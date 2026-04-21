/** Format a 0-100 integer as "42%". Returns "—" when null/undefined. */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return `${Math.round(value)}%`;
}

/** Format an angle in degrees with one decimal. */
export function formatDegrees(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return `${value.toFixed(1)}°`;
}

/**
 * Format an ISO datetime as "HH:MM" local time.
 * Returns "—" for null/undefined/invalid.
 */
export function formatClock(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/** Format seconds as "Xm Ys" or "Xh Ym" for >1h. Negative values treated as 0. */
export function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds)) return '—';
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

/** Human-readable seconds until a future ISO datetime, or "now" / "past". */
export function countdownTo(iso: string | null | undefined): string {
  if (!iso) return '—';
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return '—';
  const delta = Math.round((target - Date.now()) / 1000);
  if (delta <= 0) return 'expired';
  return formatDuration(delta);
}
