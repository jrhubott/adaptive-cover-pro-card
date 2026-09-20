import { describe, it, expect, vi, afterEach } from 'vitest';
import type { HomeAssistant } from 'custom-card-helpers';
import type { EntityRegistryEntry } from '../src/lib/entity-registry';
import {
  loadEntityRegistry,
  getCachedRegistry,
  warmEntityRegistry,
} from '../src/lib/registry-store';

/** Flush the microtask queue enough hops for a `.then().then()` chain to settle. */
async function flush(): Promise<void> {
  await new Promise((r) => setTimeout(r, 0));
  await new Promise((r) => setTimeout(r, 0));
}

// The global test setup (tests/setup.ts) resets the store before each test.

const REGISTRY: EntityRegistryEntry[] = [
  {
    entity_id: 'sensor.x',
    unique_id: 'e1_sun_position',
    platform: 'adaptive_cover_pro',
    config_entry_id: 'e1',
    device_id: null,
  },
];

function hassWithCallWS(impl: () => Promise<EntityRegistryEntry[]>): {
  hass: HomeAssistant;
  calls: () => number;
} {
  let n = 0;
  const hass = {
    callWS: () => {
      n += 1;
      return impl();
    },
  } as unknown as HomeAssistant;
  return { hass, calls: () => n };
}

describe('registry-store', () => {
  it('fetches once and caches the result', async () => {
    const { hass, calls } = hassWithCallWS(() => Promise.resolve(REGISTRY));
    const a = await loadEntityRegistry(hass);
    expect(a).toBe(REGISTRY);
    expect(getCachedRegistry()).toBe(REGISTRY);

    const b = await loadEntityRegistry(hass);
    expect(b).toBe(REGISTRY);
    expect(calls()).toBe(1); // warm cache — no second websocket call
  });

  it('dedupes concurrent callers into a single fetch', async () => {
    let resolve!: (v: EntityRegistryEntry[]) => void;
    const { hass, calls } = hassWithCallWS(
      () => new Promise<EntityRegistryEntry[]>((r) => (resolve = r)),
    );
    const p1 = loadEntityRegistry(hass);
    const p2 = loadEntityRegistry(hass);
    resolve(REGISTRY);
    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toBe(REGISTRY);
    expect(r2).toBe(REGISTRY);
    expect(calls()).toBe(1); // both callers shared one in-flight fetch
  });

  it('force re-fetches past a warm cache', async () => {
    const next: EntityRegistryEntry[] = [{ ...REGISTRY[0], entity_id: 'sensor.y' }];
    const impl = vi
      .fn<() => Promise<EntityRegistryEntry[]>>()
      .mockResolvedValueOnce(REGISTRY)
      .mockResolvedValueOnce(next);
    const hass = { callWS: impl } as unknown as HomeAssistant;

    expect(await loadEntityRegistry(hass)).toBe(REGISTRY);
    expect(await loadEntityRegistry(hass, true)).toBe(next);
    expect(getCachedRegistry()).toBe(next);
    expect(impl).toHaveBeenCalledTimes(2);
  });

  it('clears in-flight on failure so a later call can retry', async () => {
    const impl = vi
      .fn<() => Promise<EntityRegistryEntry[]>>()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce(REGISTRY);
    const hass = { callWS: impl } as unknown as HomeAssistant;

    await expect(loadEntityRegistry(hass)).rejects.toThrow('boom');
    expect(getCachedRegistry()).toBeNull();
    expect(await loadEntityRegistry(hass)).toBe(REGISTRY);
  });

  describe('warmEntityRegistry subscription', () => {
    afterEach(() => {
      delete (globalThis as { hassConnection?: unknown }).hassConnection;
    });

    it('keeps the shared cache fresh via its own registry subscription', async () => {
      const REGISTRY_V2: EntityRegistryEntry[] = [{ ...REGISTRY[0], entity_id: 'sensor.y' }];
      let capturedCb: ((ev: { data: unknown }) => void) | null = null;
      const sendMessagePromise = vi
        .fn()
        .mockResolvedValueOnce(REGISTRY)
        .mockResolvedValueOnce(REGISTRY_V2);
      const subscribeEvents = vi.fn((cb: (ev: { data: unknown }) => void) => {
        capturedCb = cb;
        return Promise.resolve(() => {});
      });
      (globalThis as { hassConnection?: unknown }).hassConnection = Promise.resolve({
        conn: { sendMessagePromise, subscribeEvents },
      });

      warmEntityRegistry();
      await flush();

      expect(getCachedRegistry()).toBe(REGISTRY);
      expect(subscribeEvents).toHaveBeenCalledWith(expect.any(Function), 'entity_registry_updated');

      expect(capturedCb).not.toBeNull();
      capturedCb!({ data: { action: 'create', entity_id: 'sensor.y' } });
      await flush();

      expect(sendMessagePromise).toHaveBeenCalledTimes(2);
      expect(getCachedRegistry()).toBe(REGISTRY_V2);
    });

    it('subscribes even when the cache is already populated', async () => {
      // Warm the cache through a plain `loadEntityRegistry` call first — this is
      // the "some other path already populated `_cache`" case. The subscription
      // must still be established; it must not be skipped by the `_cache`/
      // `_inFlight` early return that guards the fetch itself.
      const { hass } = hassWithCallWS(() => Promise.resolve(REGISTRY));
      await loadEntityRegistry(hass);
      expect(getCachedRegistry()).toBe(REGISTRY);

      const subscribeEvents = vi.fn(() => Promise.resolve(() => {}));
      const sendMessagePromise = vi.fn().mockResolvedValue(REGISTRY);
      (globalThis as { hassConnection?: unknown }).hassConnection = Promise.resolve({
        conn: { sendMessagePromise, subscribeEvents },
      });

      warmEntityRegistry();
      await flush();

      expect(subscribeEvents).toHaveBeenCalledWith(expect.any(Function), 'entity_registry_updated');
    });

    it('establishes exactly one subscription across six warm calls', async () => {
      const subscribeEvents = vi.fn(() => Promise.resolve(() => {}));
      const sendMessagePromise = vi.fn().mockResolvedValue(REGISTRY);
      (globalThis as { hassConnection?: unknown }).hassConnection = Promise.resolve({
        conn: { sendMessagePromise, subscribeEvents },
      });

      // Production calls this once per card registration — six cards, six calls,
      // synchronously in the same tick.
      for (let i = 0; i < 6; i += 1) warmEntityRegistry();
      await flush();

      expect(subscribeEvents.mock.calls.length).toBe(1);
    });

    it('coalesces a burst of events into at most one trailing refetch', async () => {
      // The initial warm fetch never resolves until we say so, so every event
      // fired below arrives while a fetch is genuinely in flight.
      let resolveInitial!: (v: EntityRegistryEntry[]) => void;
      const sendMessagePromise = vi
        .fn()
        .mockImplementationOnce(
          () => new Promise<EntityRegistryEntry[]>((r) => (resolveInitial = r)),
        )
        .mockResolvedValue(REGISTRY);
      let capturedCb: ((ev: { data: unknown }) => void) | null = null;
      const subscribeEvents = vi.fn((cb: (ev: { data: unknown }) => void) => {
        capturedCb = cb;
        return Promise.resolve(() => {});
      });
      (globalThis as { hassConnection?: unknown }).hassConnection = Promise.resolve({
        conn: { sendMessagePromise, subscribeEvents },
      });

      warmEntityRegistry();
      await flush();
      expect(capturedCb).not.toBeNull();
      expect(sendMessagePromise).toHaveBeenCalledTimes(1); // the initial fetch, still pending

      // A burst of ~20 registry events land while that fetch is in flight — e.g.
      // a new config entry registering its entities one by one.
      for (let i = 0; i < 20; i += 1) {
        capturedCb!({ data: { action: 'create', entity_id: `sensor.new_${i}` } });
      }

      // Let the in-flight fetch settle, then let a trailing refetch (if any) run.
      resolveInitial(REGISTRY);
      await flush();

      // One fetch for the burst's trailing refetch, on top of the initial one —
      // never one fetch per event.
      expect(sendMessagePromise).toHaveBeenCalledTimes(2);
    });

    it('runs a trailing refetch when an event arrives during a loadEntityRegistry fetch', async () => {
      // Get the subscription established and the store settled first — this is
      // the zero-ACP-cards-mounted case: nothing but the module's own
      // subscription will ever refresh the cache again.
      const REGISTRY_V2: EntityRegistryEntry[] = [{ ...REGISTRY[0], entity_id: 'sensor.y' }];
      const sendMessagePromise = vi
        .fn()
        .mockResolvedValueOnce(REGISTRY) // the initial warm fetch
        .mockResolvedValueOnce(REGISTRY_V2); // the trailing refetch after the event
      let capturedCb: ((ev: { data: unknown }) => void) | null = null;
      const subscribeEvents = vi.fn((cb: (ev: { data: unknown }) => void) => {
        capturedCb = cb;
        return Promise.resolve(() => {});
      });
      (globalThis as { hassConnection?: unknown }).hassConnection = Promise.resolve({
        conn: { sendMessagePromise, subscribeEvents },
      });

      warmEntityRegistry();
      await flush();
      expect(getCachedRegistry()).toBe(REGISTRY);
      expect(capturedCb).not.toBeNull();

      // An ordinary card calls `loadEntityRegistry(hass, true)` — a fetch path
      // that goes through `hass.callWS`, entirely independent of the conn — and
      // it is held open so we control exactly when it resolves.
      let resolveCallWS!: (v: EntityRegistryEntry[]) => void;
      const REGISTRY_FROM_CALLWS: EntityRegistryEntry[] = [
        { ...REGISTRY[0], entity_id: 'sensor.callws' },
      ];
      const { hass } = hassWithCallWS(
        () => new Promise<EntityRegistryEntry[]>((r) => (resolveCallWS = r)),
      );
      const loadPromise = loadEntityRegistry(hass, true);

      // A registry event arrives while that fetch is still in flight.
      capturedCb!({ data: { action: 'create', entity_id: 'sensor.y' } });

      // The in-flight `loadEntityRegistry` fetch now resolves — with a snapshot
      // that predates the event, the classic race this is guarding against.
      resolveCallWS(REGISTRY_FROM_CALLWS);
      await loadPromise;
      await flush();

      // A trailing refetch must still have run and won the cache — the event's
      // change must not be silently dropped just because a different fetch path
      // was the one in flight when it arrived.
      expect(sendMessagePromise).toHaveBeenCalledTimes(2);
      expect(getCachedRegistry()).toBe(REGISTRY_V2);
    });
  });
});
