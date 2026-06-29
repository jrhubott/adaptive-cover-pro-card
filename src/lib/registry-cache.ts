import { CARD_VERSION } from '../const';
import type { EntityRegistryEntry } from './entity-registry';

const SCHEMA_VERSION = 1;
const REGISTRY_CACHE_TTL_MS = 60_000;

function cacheKey(entryId: string): string {
  return `acp-card:registry:v1:${entryId}`;
}

export interface RegistryCacheEntry {
  schemaVersion: number;
  cardVersion: string;
  fetchedAt: number;
  entries: EntityRegistryEntry[];
}

export const registryCache = {
  get(entryId: string): RegistryCacheEntry | null {
    try {
      const raw = localStorage.getItem(cacheKey(entryId));
      if (!raw) return null;
      const parsed = JSON.parse(raw) as RegistryCacheEntry;
      if (parsed.schemaVersion !== SCHEMA_VERSION) return null;
      if (!parsed.entries?.length) return null;
      if (
        typeof parsed.fetchedAt === 'number' &&
        Date.now() - parsed.fetchedAt > REGISTRY_CACHE_TTL_MS
      )
        return null;
      return parsed;
    } catch {
      return null;
    }
  },

  set(entryId: string, entries: EntityRegistryEntry[]): void {
    if (entries.length === 0) return;
    try {
      const payload: RegistryCacheEntry = {
        schemaVersion: SCHEMA_VERSION,
        cardVersion: CARD_VERSION,
        fetchedAt: Date.now(),
        entries,
      };
      localStorage.setItem(cacheKey(entryId), JSON.stringify(payload));
    } catch {
      // localStorage unavailable or quota exceeded — degrade silently
    }
  },

  invalidate(entryId: string): void {
    try {
      localStorage.removeItem(cacheKey(entryId));
    } catch {
      // ignore
    }
  },

  clear(): void {
    try {
      const prefix = 'acp-card:registry:v1:';
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith(prefix)) keysToRemove.push(k);
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }
  },
};
