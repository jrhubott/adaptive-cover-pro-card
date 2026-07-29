/**
 * Timezone helpers for the harness. The card anchors its sun day to
 * `hass.config.time_zone`; for the harness to show a *location's* solar day
 * (rather than the developer machine's), it must both report a zone matching
 * the configured longitude and interpret the date/time slider as wall time in
 * that zone. We use a fixed-offset IANA zone (`Etc/GMT±N`) — no DST, but close
 * enough to visualise any location regardless of the machine's real timezone.
 */

/** Fixed-offset IANA zone (`Etc/GMT±N`) closest to a longitude. */
export function zoneForLongitude(lon: number): string {
  const off = Math.round(lon / 15); // whole hours east of UTC
  if (off === 0) return 'Etc/GMT';
  // IANA Etc/GMT signs are inverted: `Etc/GMT-1` is UTC+1 (east).
  return `Etc/GMT${off > 0 ? '-' : '+'}${Math.abs(off)}`;
}

/** Offset (ms) of `timeZone` at `date`, i.e. localWallTimeAsUTC − date. */
function zoneOffsetMs(timeZone: string, date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const f: Record<string, number> = {};
  for (const p of parts) if (p.type !== 'literal') f[p.type] = Number(p.value);
  return Date.UTC(f.year, f.month - 1, f.day, f.hour, f.minute, f.second) - date.getTime();
}

/**
 * The absolute instant for calendar `date` (YYYY-MM-DD) + `minutes` past
 * midnight, interpreted as wall-clock time in `timeZone`.
 */
export function zonedNowMs(date: string, minutes: number, timeZone: string): number {
  const [y, m, d] = date.split('-').map(Number);
  const guess = Date.UTC(y, m - 1, d, 0, 0, 0) + minutes * 60_000;
  const offset = zoneOffsetMs(timeZone, new Date(guess));
  return guess - offset;
}

/**
 * The wall-clock hour (0–23) of the instant `ms` as it reads in `timeZone` —
 * the inverse direction from {@link zonedNowMs}. Mock data generators use this
 * to place "overnight" gaps against the harness's own configured location
 * (see {@link zoneForLongitude}) instead of the developer machine's timezone,
 * which is all `Date.prototype.getHours()` can see.
 */
export function hourInZone(ms: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(ms));
  // An invalid IANA zone throws inside the `Intl.DateTimeFormat` constructor
  // above, before this line is ever reached, so there is no live path where
  // `find` fails to locate the 'hour' part — `hourCycle: 'h23'` guarantees
  // one is always emitted. No fallback: a machine-local `Date.getHours()`
  // read here would silently reinstate the developer-machine timezone this
  // function exists to keep out of the harness's mock data generators.
  return Number(parts.find((p) => p.type === 'hour')!.value);
}
