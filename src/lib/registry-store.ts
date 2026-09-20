import type { HomeAssistant } from 'custom-card-helpers';
import { fetchEntityRegistry, type EntityRegistryEntry } from './entity-registry';

/**
 * Process-wide shared cache for the full entity registry.
 *
 * Every ACP card needs the same `config/entity_registry/list` payload to identify its
 * entities (`hass.entities` omits `unique_id`/`config_entry_id`). Without sharing, every
 * card on a dashboard fires its own identical full-instance fetch on load — N cards = N
 * round-trips contending on the websocket, each one slower, lengthening the "Loading…"
 * flash. The main card also revalidates on every hass tick, which without a cache means a
 * fresh full-registry fetch per tick.
 *
 * This caches the result in memory and dedupes concurrent fetches, so the whole board pays
 * a single round-trip; the 2nd..Nth callers (and per-tick revalidations) read the cache
 * without touching the network. The store keeps itself fresh: it establishes its own
 * `entity_registry_updated` subscription at warm time (see `warmEntityRegistry`) and
 * refetches on any event, so the cache is correct whether or not any ACP card instance
 * happens to be mounted and subscribed on its own.
 */

let _cache: EntityRegistryEntry[] | null = null;
let _inFlight: Promise<EntityRegistryEntry[]> | null = null;

/** The in-memory registry if any card has fetched it this session, else null. */
export function getCachedRegistry(): EntityRegistryEntry[] | null {
  return _cache;
}

/** HA sets `window.hassConnection` early in bootstrap, before custom-card
 *  resources load. It's the only handle available at card-registration time,
 *  when we have no `hass` yet. */
type HassConnection = {
  conn: {
    sendMessagePromise: <T>(msg: { type: string }) => Promise<T>;
    subscribeEvents: (
      callback: (ev: { data: unknown }) => void,
      event: string,
    ) => Promise<() => void>;
  };
};
function hassConnection(): Promise<HassConnection> | undefined {
  return (globalThis as { hassConnection?: Promise<HassConnection> }).hassConnection;
}

/** POST `config/entity_registry/list` and replace `_cache` with the result.
 *  Shared by the initial warm fetch and the subscription's refetch-on-event. */
function refetchAndCache(conn: HassConnection['conn']): Promise<EntityRegistryEntry[]> {
  return conn
    .sendMessagePromise<EntityRegistryEntry[]>({ type: 'config/entity_registry/list' })
    .then((entries) => {
      _cache = entries;
      return entries;
    });
}

/** Guards the module-level `entity_registry_updated` subscription so it is
 *  established at most once, independent of `_cache`/`_inFlight` state. */
let _subscribed = false;
let _unsubscribe: (() => void) | null = null;

/** Subscribe once to `entity_registry_updated` and refetch-and-replace `_cache`
 *  on any event. This is process-lifetime by design — there is no unmount event
 *  for a module-scoped cache — and is intentionally never torn down outside
 *  tests (`_resetRegistryStore` unsubscribes and clears the guard for test
 *  isolation only). Independent of the `_cache`/`_inFlight` guard in
 *  `warmEntityRegistry` so a cache populated by some other path can never skip
 *  establishing this subscription. */
function subscribeToRegistryChanges(conn: HassConnection['conn']): void {
  if (_subscribed) return;
  _subscribed = true;
  conn
    .subscribeEvents(() => {
      refetchAndCache(conn).catch(() => {
        // Swallow — a failed refresh on an event just leaves the prior cache in
        // place; the next `loadEntityRegistry` caller can still retry.
      });
    }, 'entity_registry_updated')
    .then((unsub) => {
      _unsubscribe = unsub;
    })
    .catch(() => {
      // Swallow — subscription failure means the cache won't auto-refresh on
      // registry changes, but manual reload (a forced `loadEntityRegistry`) still works.
    });
}

/**
 * Eagerly warm the shared cache at card-registration time via the global HA
 * connection. HA's by-entity card picker computes suggestions (calling each
 * card's synchronous `getEntitySuggestion`) *before* any ACP card has rendered,
 * so nothing else has populated the cache yet — and the picker memoizes on the
 * selected entity, so it will not recompute on a later `hass` tick. Warming at
 * registration means the registry is usually resident by the time the user opens
 * the picker. Also establishes the module's own `entity_registry_updated`
 * subscription (once, regardless of how many times this runs — it's called once
 * per card registration, six times total) so the cache stays correct even before
 * any ACP card instance is mounted. No-op when no connection exists (e.g. tests).
 * Reuses `_inFlight` so a concurrent `loadEntityRegistry` dedupes.
 */
export function warmEntityRegistry(): void {
  const connPromise = hassConnection();
  if (!connPromise) return;
  connPromise.then(({ conn }) => subscribeToRegistryChanges(conn)).catch(() => {});
  if (_cache || _inFlight) return;
  _inFlight = connPromise
    .then(({ conn }) => refetchAndCache(conn))
    .then((entries) => {
      _inFlight = null;
      return entries;
    })
    .catch((err) => {
      _inFlight = null;
      throw err;
    });
  // Fire-and-forget: swallow rejection here so an unawaited warm can't surface as
  // an unhandled rejection. Real `loadEntityRegistry` awaiters still see failures.
  _inFlight.catch(() => {});
}

/**
 * Resolve the full entity registry, sharing one fetch across all callers.
 *
 * - A warm cache resolves without a websocket call (unless `force`).
 * - Concurrent callers — including forced refreshes — share the single in-flight fetch.
 * - `force` triggers a fresh fetch when nothing is in-flight; used after a registry-updated
 *   event so a stale cache can't mask the change.
 */
export function loadEntityRegistry(
  hass: HomeAssistant,
  force = false,
): Promise<EntityRegistryEntry[]> {
  if (_inFlight) return _inFlight;
  if (!force && _cache) return Promise.resolve(_cache);
  const p = fetchEntityRegistry(hass)
    .then((entries) => {
      _cache = entries;
      _inFlight = null;
      return entries;
    })
    .catch((err) => {
      _inFlight = null;
      throw err;
    });
  _inFlight = p;
  return p;
}

/** Test-only: reset the module-level cache and subscription guard between cases. */
export function _resetRegistryStore(): void {
  _cache = null;
  _inFlight = null;
  if (_unsubscribe) _unsubscribe();
  _unsubscribe = null;
  _subscribed = false;
}
