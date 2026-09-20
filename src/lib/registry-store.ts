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
 * `entity_registry_updated` subscription the first chance it gets — either at warm time via
 * the global `hassConnection` (see `warmEntityRegistry`) or on the first `loadEntityRegistry`
 * call via `hass.connection` (see `connFromHass`), whichever comes first — and refetches on
 * any event, so the cache is correct whether or not any ACP card instance happens to be
 * mounted and subscribed on its own, and whether or not the global was ever set. A burst of
 * events (e.g. a new config entry registering ~20 entities at once) coalesces into at most
 * one trailing refetch rather than one round trip per event — see `refetchAndSettle`.
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

/** `hass.connection` is a real HA `Connection` instance at runtime — it
 *  already exposes both `subscribeEvents` and `sendMessagePromise`, the same
 *  two methods this module already calls via the global `hassConnection`.
 *  `entity-registry.ts`'s own `HassWithConnection` narrows `connection` to
 *  just `subscribeEvents`, since that file never needs `sendMessagePromise`;
 *  this module does (for the trailing refetch), so it declares its own
 *  narrowing with both methods rather than casting through the narrower one. */
type HassWithConnection = HomeAssistant & { connection: HassConnection['conn'] };

/** The connection `loadEntityRegistry` can reach directly off `hass`, with no
 *  dependency on the global `hassConnection` (see `subscribeToRegistryChanges`
 *  callers below). `undefined` for hass-shaped test doubles that never set
 *  `connection` — the original `loadEntityRegistry` tests use exactly that
 *  shape, and there is nothing to subscribe through in that case. */
function connFromHass(hass: HomeAssistant): HassConnection['conn'] | undefined {
  return (hass as HassWithConnection).connection;
}

/** POST `config/entity_registry/list` and replace `_cache` with the result.
 *  The actual network call — always invoked through `refetchAndSettle`, which
 *  is what tracks `_inFlight`. */
function refetchAndCache(conn: HassConnection['conn']): Promise<EntityRegistryEntry[]> {
  return conn
    .sendMessagePromise<EntityRegistryEntry[]>({ type: 'config/entity_registry/list' })
    .then((entries) => {
      _cache = entries;
      return entries;
    });
}

/** Set when an `entity_registry_updated` event arrives while a fetch is already
 *  in flight (the initial warm fetch, an ordinary `loadEntityRegistry` caller,
 *  or a previous event's own refetch). Consumed by `runTrailingRefetchIfPending`
 *  once that fetch settles to run exactly one trailing refetch, so a burst of
 *  N events collapses into at most one extra round trip instead of N
 *  concurrent ones — and so an event that arrives during someone else's fetch
 *  is never silently dropped. */
let _pendingRefetch = false;

/** The live connection, captured the moment the module's own subscription is
 *  established (see `subscribeToRegistryChanges`). `runTrailingRefetchIfPending`
 *  needs a `conn` to actually issue a trailing fetch — including when the fetch
 *  that just settled was an ordinary `loadEntityRegistry` call, which only ever
 *  has a `hass`, not a `conn`. Null until the subscription resolves (e.g. most
 *  tests, which never warm), in which case there is no event source that could
 *  have set `_pendingRefetch` in the first place. */
let _conn: HassConnection['conn'] | null = null;

/** Run one fetch-and-cache cycle as the shared `_inFlight`, then clear it and
 *  run the trailing-refetch check. Used by the initial warm fetch and by the
 *  subscription's own event handler — the two places that fetch over the raw
 *  `conn` rather than `hass.callWS`. Never leaves `_inFlight` dangling, on
 *  success or failure. */
function refetchAndSettle(conn: HassConnection['conn']): Promise<EntityRegistryEntry[]> {
  return refetchAndCache(conn)
    .then((entries) => {
      _inFlight = null;
      runTrailingRefetchIfPending();
      return entries;
    })
    .catch((err) => {
      _inFlight = null;
      runTrailingRefetchIfPending();
      throw err;
    });
}

/** The trailing half of the coalescing scheme: if a registry event arrived
 *  while a fetch was in flight, start exactly one more now that it has
 *  settled, so the event's change still lands in `_cache` instead of being
 *  dropped. Called from every path that clears `_inFlight` — `refetchAndSettle`
 *  (the subscription's own refetches and the initial warm fetch) and
 *  `loadEntityRegistry` (an ordinary card's fetch) — because an event can
 *  arrive while any of them is in flight, not just a subscription-driven one.
 *  Reads the module-level `_conn` rather than taking a parameter, precisely so
 *  `loadEntityRegistry` (which has no `conn` of its own) can call it too.
 *  No-op if the subscription was never established (`_conn` is null).
 *
 *  Strictly best-effort: it is always called synchronously from inside another
 *  settle handler's `.then`/`.catch` body, so a throw here would propagate
 *  into *that* handler — flipping an already-successful `loadEntityRegistry`
 *  resolution into a rejection, or masking the original error on its failure
 *  path. It must never throw. */
function runTrailingRefetchIfPending(): void {
  if (!_pendingRefetch || !_conn) return;
  _pendingRefetch = false;
  try {
    _inFlight = refetchAndSettle(_conn);
    _inFlight.catch(() => {
      // Swallow — a failed trailing refresh just leaves the prior cache in place;
      // the next `loadEntityRegistry` caller can still retry.
    });
  } catch {
    // Swallow a synchronous throw (e.g. from `conn.sendMessagePromise` itself
    // throwing instead of rejecting) for the same reason — this function must
    // never affect its caller's own resolve/reject path.
    _inFlight = null;
  }
}

/** Guards the module-level `entity_registry_updated` subscription so it is
 *  established at most once, independent of `_cache`/`_inFlight` state. */
let _subscribed = false;
let _unsubscribe: (() => void) | null = null;

/** Subscribe once to `entity_registry_updated`, from whichever caller gets
 *  here first — `warmEntityRegistry` (via the global `hassConnection`) or
 *  `loadEntityRegistry` (via `hass.connection`, see `connFromHass`). Each
 *  event either starts a fresh refetch-and-replace of `_cache`, or — if a
 *  fetch is already in flight — sets `_pendingRefetch` so
 *  `runTrailingRefetchIfPending` runs exactly one trailing refetch once that
 *  fetch settles (whichever path settles it — see `runTrailingRefetchIfPending`).
 *  This is process-lifetime by design — there is no unmount event for a
 *  module-scoped cache — and is intentionally never torn down outside tests
 *  (`_resetRegistryStore` unsubscribes and clears the guard for test isolation
 *  only). Independent of the `_cache`/`_inFlight` guard in `warmEntityRegistry`
 *  so a cache populated by some other path can never skip establishing this
 *  subscription.
 *
 *  If the `subscribeEvents` call itself rejects, the guard is released so a
 *  later call (either entry point) can retry — one attempt per call, not an
 *  unbounded loop, but a transient failure here must not permanently latch
 *  `_subscribed` with no subscription ever established for the rest of the
 *  session. */
function subscribeToRegistryChanges(conn: HassConnection['conn']): void {
  if (_subscribed) return;
  _subscribed = true;
  _conn = conn;
  conn
    .subscribeEvents(() => {
      if (_inFlight) {
        _pendingRefetch = true;
        return;
      }
      _inFlight = refetchAndSettle(conn);
      _inFlight.catch(() => {
        // Swallow — a failed refresh on an event just leaves the prior cache in
        // place; the next `loadEntityRegistry` caller can still retry.
      });
    }, 'entity_registry_updated')
    .then((unsub) => {
      _unsubscribe = unsub;
    })
    .catch(() => {
      // Release the guard — see the doc comment above — so a later
      // `warmEntityRegistry`/`loadEntityRegistry` call retries instead of the
      // cache going permanently stale for the rest of the session.
      _subscribed = false;
      _conn = null;
    });
}

/**
 * Eagerly warm the shared cache at card-registration time via the global HA
 * connection. HA's by-entity card picker computes suggestions (calling each
 * card's synchronous `getEntitySuggestion`) *before* any ACP card has rendered,
 * so nothing else has populated the cache yet — and the picker memoizes on the
 * selected entity, so it will not recompute on a later `hass` tick. Warming at
 * registration means the registry is usually resident by the time the user opens
 * the picker. Also tries to establish the module's own `entity_registry_updated`
 * subscription (idempotent regardless of how many times this runs — it's called
 * once per card registration, six times total) so the cache stays correct even
 * before any ACP card instance is mounted. No-op when no global connection
 * exists yet (e.g. tests, or HA not having set it before this module evaluates)
 * — this is only ever an optimization, not the only way the subscription gets
 * established: `loadEntityRegistry` retries the same subscribe via
 * `hass.connection` on every call, so a missing global here just means the
 * subscription starts a little later rather than never. Reuses `_inFlight` so
 * a concurrent `loadEntityRegistry` dedupes.
 */
export function warmEntityRegistry(): void {
  const connPromise = hassConnection();
  if (!connPromise) return;
  connPromise.then(({ conn }) => subscribeToRegistryChanges(conn)).catch(() => {});
  if (_cache || _inFlight) return;
  const p: Promise<EntityRegistryEntry[]> = connPromise
    .then(({ conn }) => refetchAndSettle(conn))
    .catch((err) => {
      // Reaches here when `connPromise` itself rejects (HA auth failure, a
      // failed bootstrap reconnect) or the `{ conn }` destructure throws —
      // cases where `refetchAndSettle` never even started, so nothing else
      // ever clears `_inFlight`. Without this, `_inFlight` would point at a
      // permanently-rejected promise for the rest of the page session:
      // `loadEntityRegistry`'s `if (_inFlight) return _inFlight;` would hand
      // that rejection to every later caller, including forced refreshes, and
      // `warmEntityRegistry`'s own `_cache || _inFlight` guard would never
      // retry. Only clear `_inFlight` if it still points at *this* chain —
      // if `refetchAndCache` inside `refetchAndSettle` is what actually
      // rejected instead, its own catch already cleared `_inFlight` and may
      // have started a trailing refetch (`runTrailingRefetchIfPending`) by
      // the time this runs; stomping that reference here would silently
      // break the in-flight dedupe for it.
      if (_inFlight === p) _inFlight = null;
      throw err;
    });
  _inFlight = p;
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
 * - Also runs the trailing-refetch check on settle (`runTrailingRefetchIfPending`): if a
 *   registry event arrived while *this* fetch was the one in flight, the event's change
 *   isn't reflected in what this fetch returned, so one more conn-based refetch runs to
 *   pick it up rather than leaving it stranded until some unrelated later fetch happens by.
 * - Also tries to establish the module's own subscription via `hass.connection`
 *   (see `connFromHass`), independent of the cache/in-flight state below (so a
 *   warm-cache hit still tries). `warmEntityRegistry`'s global `hassConnection`
 *   depends on HA having set that global before card registration — an
 *   assumption this module shouldn't have to make. `hass.connection` is
 *   always available once any card actually has a `hass`, and this runs on
 *   every call, so it's retried on every subsequent call too if it hasn't
 *   succeeded yet (e.g. after a rejected `subscribeEvents`, see
 *   `subscribeToRegistryChanges`). Routing through `hass` this way makes the
 *   global an optimization — it warms the subscription earlier — rather than
 *   a hard dependency.
 */
export function loadEntityRegistry(
  hass: HomeAssistant,
  force = false,
): Promise<EntityRegistryEntry[]> {
  const conn = connFromHass(hass);
  if (conn) subscribeToRegistryChanges(conn);
  if (_inFlight) return _inFlight;
  if (!force && _cache) return Promise.resolve(_cache);
  const p = fetchEntityRegistry(hass)
    .then((entries) => {
      _cache = entries;
      _inFlight = null;
      runTrailingRefetchIfPending();
      return entries;
    })
    .catch((err) => {
      _inFlight = null;
      runTrailingRefetchIfPending();
      throw err;
    });
  _inFlight = p;
  return p;
}

/** Test-only: reset the module-level cache and subscription guard between cases. */
export function _resetRegistryStore(): void {
  _cache = null;
  _inFlight = null;
  _pendingRefetch = false;
  _conn = null;
  if (_unsubscribe) _unsubscribe();
  _unsubscribe = null;
  _subscribed = false;
}
