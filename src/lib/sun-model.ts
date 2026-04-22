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
 */
export function sampleDay(
  latitude: number,
  longitude: number,
  dayStart: Date,
  stepMinutes = 10,
): SunSample[] {
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
  return samples;
}

/** Midnight local time for the given reference date (strips hours). */
export function startOfDay(ref: Date = new Date()): Date {
  const d = new Date(ref);
  d.setHours(0, 0, 0, 0);
  return d;
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
 * Find the start/end indices of the contiguous "sun in FOV + above horizon"
 * window for today. Returns null if the sun never enters the FOV today.
 *
 * A FOV can span multiple disjoint windows in edge cases (e.g. very narrow
 * blind spots), but for the typical ACP use case we just return the
 * longest contiguous valid run — good enough for visualisation.
 */
export function findFovWindow(
  samples: SunSample[],
  windowAzi: number,
  fovLeft: number,
  fovRight: number,
): { startIdx: number; endIdx: number } | null {
  let bestStart = -1;
  let bestEnd = -1;
  let curStart = -1;
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    const inside = s.elevation > 0 && azimuthInFov(s.azimuth, windowAzi, fovLeft, fovRight);
    if (inside) {
      if (curStart === -1) curStart = i;
      if (i - curStart > bestEnd - bestStart) {
        bestStart = curStart;
        bestEnd = i;
      }
    } else {
      curStart = -1;
    }
  }
  if (bestStart === -1) return null;
  return { startIdx: bestStart, endIdx: bestEnd };
}

/**
 * Return the azimuths of the first and last above-horizon sun samples.
 * These approximate the compass directions of sunrise and sunset.
 * Returns null for either if the sun never rises (or never sets) today.
 */
export function sunriseSetAzimuths(samples: SunSample[]): {
  riseAzimuth: number | null;
  setAzimuth: number | null;
} {
  let riseIdx = -1;
  let setIdx = -1;
  for (let i = 0; i < samples.length; i++) {
    if (samples[i].elevation > 0) {
      if (riseIdx === -1) riseIdx = i;
      setIdx = i;
    }
  }
  return {
    riseAzimuth: riseIdx >= 0 ? samples[riseIdx].azimuth : null,
    setAzimuth: setIdx >= 0 ? samples[setIdx].azimuth : null,
  };
}
