import type { HarnessConfig } from './types';

const HASH_KEY = 'state';

/** Compact JSON → URL-safe base64 (no padding, no `+` / `/`). */
function encodeState(cfg: HarnessConfig): string {
  const json = JSON.stringify(cfg);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeState(encoded: string): HarnessConfig | null {
  try {
    const padded =
      encoded.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((encoded.length + 3) % 4);
    const json = decodeURIComponent(escape(atob(padded)));
    return JSON.parse(json) as HarnessConfig;
  } catch {
    return null;
  }
}

/** Read the encoded config off `location.hash`, or null if absent / invalid. */
export function readStateFromUrl(): HarnessConfig | null {
  if (typeof location === 'undefined' || !location.hash) return null;
  const m = location.hash.match(new RegExp(`(?:^#|&)${HASH_KEY}=([^&]+)`));
  if (!m) return null;
  return decodeState(m[1]);
}

/** Write the config into `location.hash` AND return the full shareable URL. */
export function writeStateToUrl(cfg: HarnessConfig): string {
  const encoded = encodeState(cfg);
  const url = `${location.origin}${location.pathname}#${HASH_KEY}=${encoded}`;
  history.replaceState(null, '', url);
  return url;
}

/** Clear the encoded hash without reloading. */
export function clearStateFromUrl(): void {
  if (typeof location === 'undefined') return;
  if (location.hash) history.replaceState(null, '', `${location.origin}${location.pathname}`);
}

/** Best-effort: write text to clipboard. Resolves false on failure. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
