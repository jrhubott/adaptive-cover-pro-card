import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// happy-dom's localStorage stub has no methods — provide a real in-memory one.
function makeStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    key(index: number) {
      return [...store.keys()][index] ?? null;
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
}

let mockStorage: Storage;

beforeEach(async () => {
  mockStorage = makeStorage();
  vi.stubGlobal('localStorage', mockStorage);
  // Re-import to pick up the stubbed global in each test
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

// Dynamic import so the module re-evaluates after stubGlobal
async function getCache() {
  const { registryCache } = await import('../src/lib/registry-cache');
  return registryCache;
}

const ENTRY_ID = 'abc123';
const OTHER_ENTRY_ID = 'xyz789';
const ENTRIES = [
  {
    entity_id: 'sensor.foo',
    unique_id: 'abc123_foo',
    platform: 'sensor',
    config_entry_id: ENTRY_ID,
    device_id: null,
  },
  {
    entity_id: 'switch.bar',
    unique_id: 'abc123_bar',
    platform: 'switch',
    config_entry_id: ENTRY_ID,
    device_id: null,
  },
];

describe('registryCache.get / set round-trip', () => {
  it('get returns null on missing key', async () => {
    const cache = await getCache();
    expect(cache.get(ENTRY_ID)).toBeNull();
  });

  it('set then get returns stored entries', async () => {
    const cache = await getCache();
    cache.set(ENTRY_ID, ENTRIES as never);
    const result = cache.get(ENTRY_ID);
    expect(result).not.toBeNull();
    expect(result!.entries).toEqual(ENTRIES);
    expect(result!.schemaVersion).toBe(1);
    expect(typeof result!.fetchedAt).toBe('number');
  });

  it('stored payload includes cardVersion', async () => {
    const cache = await getCache();
    cache.set(ENTRY_ID, ENTRIES as never);
    const result = cache.get(ENTRY_ID);
    expect(typeof result!.cardVersion).toBe('string');
  });
});

describe('registryCache.invalidate', () => {
  it('invalidate removes only the target entry', async () => {
    const cache = await getCache();
    cache.set(ENTRY_ID, ENTRIES as never);
    cache.set(OTHER_ENTRY_ID, ENTRIES as never);
    cache.invalidate(ENTRY_ID);
    expect(cache.get(ENTRY_ID)).toBeNull();
    expect(cache.get(OTHER_ENTRY_ID)).not.toBeNull();
  });
});

describe('registryCache.clear', () => {
  it('clear wipes all acp-card registry entries', async () => {
    const cache = await getCache();
    cache.set(ENTRY_ID, ENTRIES as never);
    cache.set(OTHER_ENTRY_ID, [] as never);
    cache.clear();
    expect(cache.get(ENTRY_ID)).toBeNull();
    expect(cache.get(OTHER_ENTRY_ID)).toBeNull();
  });

  it('clear does not remove unrelated localStorage keys', async () => {
    const cache = await getCache();
    mockStorage.setItem('unrelated-key', 'keep-me');
    cache.set(ENTRY_ID, ENTRIES as never);
    cache.clear();
    expect(mockStorage.getItem('unrelated-key')).toBe('keep-me');
  });
});

describe('registryCache schema validation', () => {
  it('get returns null when stored schemaVersion is 0', async () => {
    const cache = await getCache();
    const key = `acp-card:registry:v1:${ENTRY_ID}`;
    mockStorage.setItem(
      key,
      JSON.stringify({
        schemaVersion: 0,
        cardVersion: '1.0.0',
        fetchedAt: Date.now(),
        entries: ENTRIES,
      }),
    );
    expect(cache.get(ENTRY_ID)).toBeNull();
  });

  it('get returns null when stored JSON is invalid', async () => {
    const cache = await getCache();
    const key = `acp-card:registry:v1:${ENTRY_ID}`;
    mockStorage.setItem(key, 'not-valid-json{{{');
    expect(cache.get(ENTRY_ID)).toBeNull();
  });

  it('get returns null when localStorage.getItem throws', async () => {
    const cache = await getCache();
    vi.spyOn(mockStorage, 'getItem').mockImplementationOnce(() => {
      throw new Error('quota exceeded');
    });
    expect(cache.get(ENTRY_ID)).toBeNull();
  });

  it('set silently ignores localStorage.setItem errors', async () => {
    const cache = await getCache();
    vi.spyOn(mockStorage, 'setItem').mockImplementationOnce(() => {
      throw new Error('quota exceeded');
    });
    expect(() => cache.set(ENTRY_ID, ENTRIES as never)).not.toThrow();
  });
});

describe('registryCache empty-slice guard', () => {
  it('set with empty entries does not persist a usable cache entry', async () => {
    const cache = await getCache();
    cache.set(ENTRY_ID, [] as never);
    expect(cache.get(ENTRY_ID)).toBeNull();
  });
});

describe('registryCache TTL guard', () => {
  it('get returns null when fetchedAt exceeds the TTL', async () => {
    const cache = await getCache();
    const key = `acp-card:registry:v1:${ENTRY_ID}`;
    mockStorage.setItem(
      key,
      JSON.stringify({
        schemaVersion: 1,
        cardVersion: '1.0.0',
        fetchedAt: Date.now() - 61_000,
        entries: ENTRIES,
      }),
    );
    expect(cache.get(ENTRY_ID)).toBeNull();
  });

  it('get returns stored entries when fetchedAt is within the TTL', async () => {
    const cache = await getCache();
    const key = `acp-card:registry:v1:${ENTRY_ID}`;
    mockStorage.setItem(
      key,
      JSON.stringify({
        schemaVersion: 1,
        cardVersion: '1.0.0',
        fetchedAt: Date.now(),
        entries: ENTRIES,
      }),
    );
    const result = cache.get(ENTRY_ID);
    expect(result).not.toBeNull();
    expect(result!.entries).toEqual(ENTRIES);
  });
});
