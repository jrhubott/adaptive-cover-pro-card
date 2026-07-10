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
 * without touching the network. Registry changes are still picked up via the
 * `entity_registry_updated` subscription, which calls in with `force: true`.
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
  conn: { sendMessagePromise: <T>(msg: { type: string }) => Promise<T> };
};
function hassConnection(): Promise<HassConnection> | undefined {
  return (globalThis as { hassConnection?: Promise<HassConnection> }).hassConnection;
}

/**
 * Eagerly warm the shared cache at card-registration time via the global HA
 * connection. HA's by-entity card picker computes suggestions (calling each
 * card's synchronous `getEntitySuggestion`) *before* any ACP card has rendered,
 * so nothing else has populated the cache yet — and the picker memoizes on the
 * selected entity, so it will not recompute on a later `hass` tick. Warming at
 * registration means the registry is usually resident by the time the user opens
 * the picker. No-op when already warm/in-flight or when no connection exists
 * (e.g. tests). Reuses `_inFlight` so a concurrent `loadEntityRegistry` dedupes.
 */
export function warmEntityRegistry(): void {
  if (_cache || _inFlight) return;
  const connPromise = hassConnection();
  if (!connPromise) return;
  _inFlight = connPromise
    .then(({ conn }) =>
      conn.sendMessagePromise<EntityRegistryEntry[]>({ type: 'config/entity_registry/list' }),
    )
    .then((entries) => {
      _cache = entries;
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

/** Test-only: reset the module-level cache between cases. */
export function _resetRegistryStore(): void {
  _cache = null;
  _inFlight = null;
}
