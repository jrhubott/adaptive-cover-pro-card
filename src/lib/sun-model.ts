import SunCalc from 'suncalc';

export interface SunSample {
  t: Date;
  elevation: number; // degrees, -90..90
  azimuth: number; // degrees, 0..360 (0=N, clockwise)
}

/**
 * Sample the sun position across one day at the given latitude/longitude.
 *
 * Suncalc returns azimuth in radians with 0 = south; rotate to the compass
 * convention (0 = north, clockwise) for consistency with the rest of the
 * card's geometry.
 *
 * `stepMinutes` defaults to 10 minutes → 145 samples for a 24h window.
 *
 * Memoized: the result depends only on `(latitude, longitude, dayStart, stepMinutes)`
 * and changes meaningfully only once per day (or when the location moves). HA pushes a
 * new `hass` on every state tick, so the consuming components re-render often; without
 * the cache each render would redo ~145 SunCalc evaluations. A small LRU keeps the
 * current day plus a couple of neighbours (e.g. an elevation chart paging across dates).
 */
const SAMPLE_DAY_CACHE_MAX = 4;
const _sampleDayCache = new Map<string, SunSample[]>();

export function sampleDay(
  latitude: number,
  longitude: number,
  dayStart: Date,
  stepMinutes = 10,
): SunSample[] {
  const key = `${latitude},${longitude},${dayStart.getTime()},${stepMinutes}`;
  const cached = _sampleDayCache.get(key);
  if (cached) {
    // Refresh recency: re-insertion moves the key to the end of the Map's order.
    _sampleDayCache.delete(key);
    _sampleDayCache.set(key, cached);
    return cached;
  }

  const samples: SunSample[] = [];
  const endMs = dayStart.getTime() + 24 * 60 * 60 * 1000;
  for (let ms = dayStart.getTime(); ms <= endMs; ms += stepMinutes * 60 * 1000) {
    const t = new Date(ms);
    const pos = SunCalc.getPosition(t, latitude, longitude);
    samples.push({
      t,
      elevation: (pos.altitude * 180) / Math.PI,
      // suncalc.azimuth: 0 = south, positive = west-of-south (range -pi..+pi)
      // Convert to compass: 180 + degrees, then normalize to [0, 360)
      azimuth: ((((pos.azimuth * 180) / Math.PI + 180) % 360) + 360) % 360,
    });
  }

  _sampleDayCache.set(key, samples);
  if (_sampleDayCache.size > SAMPLE_DAY_CACHE_MAX) {
    // Evict the least-recently-used entry (first key in insertion order).
    const oldest = _sampleDayCache.keys().next().value;
    if (oldest !== undefined) _sampleDayCache.delete(oldest);
  }
  return samples;
}

/** Midnight local time for the given reference date (strips hours). */
export function startOfDay(ref: Date = new Date()): Date {
  const d = new Date(ref);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * The offset (ms) between wall-clock time in `timeZone` and UTC at `date`,
 * i.e. `localWallTimeAsUTC − date`. Positive east of Greenwich.
 */
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
  const asUTC = Date.UTC(f.year, f.month - 1, f.day, f.hour, f.minute, f.second);
  return asUTC - date.getTime();
}

/**
 * Midnight (start of day) in the given IANA `timeZone`, returned as an absolute
 * instant. Use this instead of `startOfDay()` when the sun is sampled for a
 * location whose timezone may differ from the browser's — otherwise the 24h
 * sample window is anchored to the *viewer's* midnight, not the *location's*,
 * shifting the whole sun path (and sunrise/sunset/FOV) by the offset between
 * the two zones.
 *
 * Falls back to browser-local `startOfDay(ref)` when `timeZone` is missing.
 */
export function startOfDayInZone(timeZone: string | undefined, ref: Date = new Date()): Date {
  if (!timeZone) return startOfDay(ref);
  // Calendar date (Y/M/D) as it reads in the target zone right now.
  const ymd = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(ref);
  const [y, m, d] = ymd.split('-').map(Number);
  // Naïve guess: that wall date at 00:00 treated as if it were UTC.
  const guessMs = Date.UTC(y, m - 1, d, 0, 0, 0);
  // Correct by the zone's offset near that instant (DST-safe except the rare
  // midnight-DST transition — acceptable for a visualisation).
  const offset = zoneOffsetMs(timeZone, new Date(guessMs));
  return new Date(guessMs - offset);
}

/**
 * True when an azimuth falls inside a FOV wedge.
 * `windowAzi` is the window normal (0..360). `fovLeft` and `fovRight` are
 * positive degrees to each side. Handles wedges crossing 0°.
 */
export function azimuthInFov(
  azi: number,
  windowAzi: number,
  fovLeft: number,
  fovRight: number,
): boolean {
  const minEdge = (((windowAzi - fovLeft) % 360) + 360) % 360;
  const maxEdge = (((windowAzi + fovRight) % 360) + 360) % 360;
  const sweep = (((maxEdge - minEdge) % 360) + 360) % 360;
  const delta = (((azi - minEdge) % 360) + 360) % 360;
  return delta <= sweep;
}

/**
 * Find every disjoint "sun in FOV + above horizon" run for the sampled day, in
 * chronological order. A window facing toward the pole (north in the N
 * hemisphere) at high latitude catches the sun twice — once on each side of the
 * window normal — producing two separate runs; this returns both.
 */
export function findFovWindows(
  samples: SunSample[],
  windowAzi: number,
  fovLeft: number,
  fovRight: number,
): Array<{ startIdx: number; endIdx: number }> {
  const runs: Array<{ startIdx: number; endIdx: number }> = [];
  let curStart = -1;
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    const inside = s.elevation > 0 && azimuthInFov(s.azimuth, windowAzi, fovLeft, fovRight);
    if (inside) {
      if (curStart === -1) curStart = i;
    } else if (curStart !== -1) {
      runs.push({ startIdx: curStart, endIdx: i - 1 });
      curStart = -1;
    }
  }
  if (curStart !== -1) runs.push({ startIdx: curStart, endIdx: samples.length - 1 });
  return runs;
}

/**
 * The single longest contiguous "sun in FOV + above horizon" run for today, or
 * null if the sun never enters the FOV. For all disjoint runs see
 * {@link findFovWindows}.
 */
export function findFovWindow(
  samples: SunSample[],
  windowAzi: number,
  fovLeft: number,
  fovRight: number,
): { startIdx: number; endIdx: number } | null {
  const runs = findFovWindows(samples, windowAzi, fovLeft, fovRight);
  if (runs.length === 0) return null;
  return runs.reduce((best, r) => (r.endIdx - r.startIdx > best.endIdx - best.startIdx ? r : best));
}

/**
 * Find every disjoint "above horizon" run for the sampled day, in chronological
 * order — each a contiguous index range where `elevation > 0`. Mirrors the
 * run-detection loop in {@link findFovWindows} without the FOV azimuth filter,
 * so the sky-compass can draw the sun-path only where the sun is actually
 * visible (the below-horizon portion is omitted rather than hugging the rim).
 */
export function aboveHorizonSegments(
  samples: SunSample[],
): Array<{ startIdx: number; endIdx: number }> {
  const runs: Array<{ startIdx: number; endIdx: number }> = [];
  let curStart = -1;
  for (let i = 0; i < samples.length; i++) {
    if (samples[i].elevation > 0) {
      if (curStart === -1) curStart = i;
    } else if (curStart !== -1) {
      runs.push({ startIdx: curStart, endIdx: i - 1 });
      curStart = -1;
    }
  }
  if (curStart !== -1) runs.push({ startIdx: curStart, endIdx: samples.length - 1 });
  return runs;
}

export interface MoonData {
  azimuth: number;
  elevation: number;
  phase: number;
  fraction: number;
  phaseName: string;
}

export function getMoonData(latitude: number, longitude: number, now: Date = new Date()): MoonData {
  const pos = SunCalc.getMoonPosition(now, latitude, longitude);
  const illum = SunCalc.getMoonIllumination(now);
  const azimuth = ((((pos.azimuth * 180) / Math.PI + 180) % 360) + 360) % 360;
  const elevation = (pos.altitude * 180) / Math.PI;
  return {
    azimuth,
    elevation,
    phase: illum.phase,
    fraction: illum.fraction,
    phaseName: _phaseName(illum.phase),
  };
}

function _phaseName(p: number): string {
  if (p < 0.0625 || p >= 0.9375) return 'New Moon';
  if (p < 0.1875) return 'Waxing Crescent';
  if (p < 0.3125) return 'First Quarter';
  if (p < 0.4375) return 'Waxing Gibbous';
  if (p < 0.5625) return 'Full Moon';
  if (p < 0.6875) return 'Waning Gibbous';
  if (p < 0.8125) return 'Last Quarter';
  return 'Waning Crescent';
}

/**
 * Return the compass azimuths of sunrise and sunset, detected as the actual
 * horizon crossings within the sampled day: rise is the first below→above
 * transition, set is the last above→below transition.
 *
 * Returns null for either when no such crossing exists in the window — e.g. a
 * polar day (sun never sets) or a window misaligned so the boundary samples are
 * already above horizon. This avoids reporting a window-edge sample as a false
 * sunrise/sunset.
 */
export function sunriseSetAzimuths(samples: SunSample[]): {
  riseAzimuth: number | null;
  setAzimuth: number | null;
} {
  let riseAzimuth: number | null = null;
  let setAzimuth: number | null = null;
  for (let i = 1; i < samples.length; i++) {
    const prev = samples[i - 1];
    const cur = samples[i];
    // below→above: first qualifying crossing is sunrise
    if (prev.elevation <= 0 && cur.elevation > 0 && riseAzimuth === null) {
      riseAzimuth = cur.azimuth;
    }
    // above→below: keep the last qualifying crossing as sunset
    if (prev.elevation > 0 && cur.elevation <= 0) {
      setAzimuth = prev.azimuth;
    }
  }
  return { riseAzimuth, setAzimuth };
}
