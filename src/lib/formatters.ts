import { t } from './i18n';

/** Format a 0-100 integer as "42%". Returns "—" when null/undefined. */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return `${Math.round(value)}%`;
}

interface HassLike {
  states: Record<string, { state: string; attributes?: Record<string, unknown> } | undefined>;
  localize?: (key: string, ...args: unknown[]) => string;
  formatEntityState?: (stateObj: unknown) => string;
}

/**
 * True when a state string signals the entity has no usable data — HA's
 * `unavailable`/`unknown` sentinels, or a missing state entirely (treated the
 * same way, since a missing entity is functionally the same signal).
 */
export function isUnavailable(state: string | null | undefined): boolean {
  return !state || state === 'unavailable' || state === 'unknown';
}

/**
 * True only for a hard-offline entity — HA's `unavailable` sentinel, or a
 * missing state entirely. Unlike {@link isUnavailable}, this does NOT treat
 * `unknown` as offline: a cover reporting `unknown` (e.g. an assumed-state
 * RTS/one-way cover that never reports a position) is still reachable and
 * accepts commands, so it must not be dimmed/disabled/mislabeled as if the
 * entity itself had dropped off HA (issue #232).
 */
export function isOffline(state: string | null | undefined): boolean {
  return !state || state === 'unavailable';
}

/**
 * Localized cover state ("Open", "Closed", "Opening", …). Returns null when
 * the entity is missing or has no state. Prefers `hass.formatEntityState`
 * (modern HA frontend), falls back to `hass.localize` with the standard
 * cover state translation key, and finally to a capitalized raw state.
 *
 * `overrideState` substitutes the state to localize while keeping the entity's
 * attributes/context — no-feedback covers report a final `open`/`closed` state
 * mid-move, so the transit direction is passed here to render "Opening"/
 * "Closing" the same way a real position cover does.
 */
export function formatCoverState(
  hass: HassLike | undefined,
  entityId: string | undefined,
  overrideState?: string,
): string | null {
  if (!hass || !entityId) return null;
  const stateObj = hass.states[entityId];
  if (!stateObj || isUnavailable(stateObj.state)) {
    return null;
  }
  const effective = overrideState ? { ...stateObj, state: overrideState } : stateObj;
  if (typeof hass.formatEntityState === 'function') {
    const formatted = hass.formatEntityState(effective);
    if (formatted) return formatted;
  }
  if (typeof hass.localize === 'function') {
    const localized = hass.localize(`component.cover.entity_component._.state.${effective.state}`);
    if (localized) return localized;
  }
  return effective.state.charAt(0).toUpperCase() + effective.state.slice(1);
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
export function formatClock(iso: string | null | undefined, timeZone?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone });
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

/**
 * Compute `timestampIso + thresholdMinutes` as an ISO-8601 string, or `null`
 * when either input is missing/invalid. Used to derive the next-allowed time
 * for the minimum-interval throttle countdown without inlining date math in
 * components.
 */
export function nextAllowedIso(
  timestampIso: string | null | undefined,
  thresholdMinutes: number | null | undefined,
): string | null {
  if (!timestampIso) return null;
  if (thresholdMinutes === null || thresholdMinutes === undefined || Number.isNaN(thresholdMinutes))
    return null;
  const base = new Date(timestampIso).getTime();
  if (Number.isNaN(base)) return null;
  return new Date(base + thresholdMinutes * 60_000).toISOString();
}

/** Human-readable seconds until a future ISO datetime, or "now" / "past".
 *  Pass `hass` to localize the "expired" sentinel; without it, the EN value
 *  is returned so pure-helper callers remain locale-agnostic. */
export function countdownTo(
  iso: string | null | undefined,
  hass?: Parameters<typeof t>[1],
): string {
  if (!iso) return '—';
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return '—';
  const delta = Math.round((target - Date.now()) / 1000);
  if (delta <= 0) return hass ? t('formatters.expired', hass) : 'expired';
  return formatDuration(delta);
}
