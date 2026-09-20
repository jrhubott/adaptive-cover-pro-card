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
  });
});
