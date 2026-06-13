import type { HarnessConfig } from './types';

export const STORAGE_KEY = 'acp-harness-v1';

export function saveConfig(cfg: HarnessConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {
    // Quota exceeded / unavailable — ignore.
  }
}

export function loadConfig(): HarnessConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HarnessConfig;
  } catch {
    return null;
  }
}

export function clearConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
