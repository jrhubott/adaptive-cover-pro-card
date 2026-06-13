import { describe, it, expect } from 'vitest';
import {
  aboveHorizonSegments,
  azimuthInFov,
  findFovWindow,
  findFovWindows,
  getMoonData,
  sampleDay,
  startOfDay,
  startOfDayInZone,
  sunriseSetAzimuths,
} from '../src/lib/sun-model';

describe('azimuthInFov', () => {
  it('matches when azimuth equals window normal', () => {
    expect(azimuthInFov(180, 180, 45, 45)).toBe(true);
  });

  it('matches at the left edge', () => {
    expect(azimuthInFov(135, 180, 45, 45)).toBe(true);
  });

  it('matches at the right edge', () => {
    expect(azimuthInFov(225, 180, 45, 45)).toBe(true);
  });

  it('rejects well outside the wedge', () => {
    expect(azimuthInFov(60, 180, 45, 45)).toBe(false);
    expect(azimuthInFov(300, 180, 45, 45)).toBe(false);
  });

  it('wraps correctly for a wedge crossing 0°', () => {
    // Window facing due north (0°) with ±30° FOV
    expect(azimuthInFov(10, 0, 30, 30)).toBe(true);
    expect(azimuthInFov(350, 0, 30, 30)).toBe(true);
    expect(azimuthInFov(90, 0, 30, 30)).toBe(false);
  });
});

describe('sampleDay', () => {
  it('produces 145 samples for a 24h day at 10 min steps (inclusive of both endpoints)', () => {
    const samples = sampleDay(45.5, -73.6, new Date('2026-06-21T00:00:00')); // Montreal, midsummer
    expect(samples.length).toBe(145);
  });

  it('midsummer at a northern latitude has a noon elevation > 60°', () => {
    const samples = sampleDay(45.5, -73.6, new Date('2026-06-21T00:00:00'));
    const maxElev = Math.max(...samples.map((s) => s.elevation));
    expect(maxElev).toBeGreaterThan(60);
  });

  it('midwinter at a northern latitude has a noon elevation < 30°', () => {
    const samples = sampleDay(45.5, -73.6, new Date('2026-12-21T00:00:00'));
    const maxElev = Math.max(...samples.map((s) => s.elevation));
    expect(maxElev).toBeLessThan(30);
  });

  it('azimuths all land in [0, 360)', () => {
    const samples = sampleDay(45.5, -73.6, new Date('2026-06-21T00:00:00'));
    for (const s of samples) {
      expect(s.azimuth).toBeGreaterThanOrEqual(0);
      expect(s.azimuth).toBeLessThan(360);
    }
  });

  it('returns the same cached array reference for identical args', () => {
    // Distinct Date instances with the same epoch must still hit the cache, since
    // the consuming components build a fresh `startOfDay` Date on every render.
    const a = sampleDay(48.1, 11.6, new Date('2026-03-15T00:00:00Z'));
    const b = sampleDay(48.1, 11.6, new Date('2026-03-15T00:00:00Z'));
    expect(b).toBe(a);
  });

  it('returns a fresh array for a different day', () => {
    const a = sampleDay(48.1, 11.6, new Date('2026-03-15T00:00:00Z'));
    const b = sampleDay(48.1, 11.6, new Date('2026-03-16T00:00:00Z'));
    expect(b).not.toBe(a);
  });

  it('returns a fresh array for a different location', () => {
    const a = sampleDay(48.1, 11.6, new Date('2026-03-15T00:00:00Z'));
    const b = sampleDay(40.7, -74.0, new Date('2026-03-15T00:00:00Z'));
    expect(b).not.toBe(a);
  });

  it('returns a fresh array for a different step size', () => {
    const a = sampleDay(48.1, 11.6, new Date('2026-03-15T00:00:00Z'), 10);
    const b = sampleDay(48.1, 11.6, new Date('2026-03-15T00:00:00Z'), 30);
    expect(b).not.toBe(a);
    expect(b.length).not.toBe(a.length);
  });
});

describe('startOfDay', () => {
  it('zeroes hours/minutes/seconds', () => {
    const d = startOfDay(new Date('2026-06-21T17:34:22.123'));
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
    expect(d.getSeconds()).toBe(0);
    expect(d.getMilliseconds()).toBe(0);
  });
});

describe('findFovWindow', () => {
  it('returns null when the sun never enters the FOV', () => {
    // Window facing due north at a mid-northern latitude in summer — sun comes
    // from the south, never hits the FOV.
    const samples = sampleDay(45.5, -73.6, new Date('2026-06-21T00:00:00'));
    expect(findFovWindow(samples, 0, 45, 45)).toBeNull();
  });

  it('finds a contiguous window for a south-facing FOV', () => {
    const samples = sampleDay(45.5, -73.6, new Date('2026-06-21T00:00:00'));
    const win = findFovWindow(samples, 180, 60, 60);
    expect(win).not.toBeNull();
    expect(win!.endIdx).toBeGreaterThan(win!.startIdx);
    // Make sure both endpoints are above horizon
    expect(samples[win!.startIdx].elevation).toBeGreaterThan(0);
    expect(samples[win!.endIdx].elevation).toBeGreaterThan(0);
  });
});

describe('findFovWindows', () => {
  it('returns two disjoint runs for a high-latitude north-facing window in summer', () => {
    // Oslo-ish (60°N) midsummer: a wide north window catches the sun at NE
    // sunrise and again at NW sunset — two separate runs.
    const samples = sampleDay(60.0, 10.75, new Date('2026-06-21T00:00:00Z'));
    const runs = findFovWindows(samples, 0, 80, 80);
    expect(runs.length).toBe(2);
    // disjoint and chronologically ordered
    expect(runs[0].endIdx).toBeLessThan(runs[1].startIdx);
    // morning run sits on the E side of N, evening run on the W side
    expect(samples[runs[0].startIdx].azimuth).toBeLessThan(90);
    expect(samples[runs[1].endIdx].azimuth).toBeGreaterThan(270);
  });

  it('returns a single run for a south-facing window, matching findFovWindow', () => {
    const samples = sampleDay(45.5, -73.6, new Date('2026-06-21T00:00:00'));
    const runs = findFovWindows(samples, 180, 60, 60);
    expect(runs.length).toBe(1);
    expect(runs[0]).toEqual(findFovWindow(samples, 180, 60, 60));
  });

  it('returns an empty array when the sun never enters the FOV', () => {
    const samples = sampleDay(45.5, -73.6, new Date('2026-06-21T00:00:00'));
    expect(findFovWindows(samples, 0, 45, 45)).toEqual([]);
  });
});

describe('startOfDayInZone', () => {
  it('returns local midnight in a DST zone as an absolute instant', () => {
    // 2026-06-21 is PDT (UTC-7); local midnight = 07:00 UTC.
    const ref = new Date('2026-06-21T19:00:00Z'); // noon PDT
    const start = startOfDayInZone('America/Los_Angeles', ref);
    expect(start.toISOString()).toBe('2026-06-21T07:00:00.000Z');
  });

  it('handles a fixed-offset Etc zone (the harness path)', () => {
    // Etc/GMT-1 is UTC+1; local midnight = 23:00 UTC the previous day.
    const ref = new Date('2026-06-21T12:00:00Z');
    const start = startOfDayInZone('Etc/GMT-1', ref);
    expect(start.toISOString()).toBe('2026-06-20T23:00:00.000Z');
  });

  it('falls back to browser-local startOfDay when timezone is missing', () => {
    const ref = new Date('2026-06-21T17:34:22.123');
    const start = startOfDayInZone(undefined, ref);
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
    expect(start.getTime()).toBe(startOfDay(ref).getTime());
  });
});

describe('getMoonData', () => {
  it('returns azimuth in [0, 360) and elevation in [-90, 90]', () => {
    const moon = getMoonData(45.5, -73.6, new Date('2026-04-22T20:00:00Z'));
    expect(moon.azimuth).toBeGreaterThanOrEqual(0);
    expect(moon.azimuth).toBeLessThan(360);
    expect(moon.elevation).toBeGreaterThanOrEqual(-90);
    expect(moon.elevation).toBeLessThanOrEqual(90);
  });

  it('returns fraction in [0, 1] and phase in [0, 1)', () => {
    const moon = getMoonData(45.5, -73.6, new Date('2026-04-22T20:00:00Z'));
    expect(moon.fraction).toBeGreaterThanOrEqual(0);
    expect(moon.fraction).toBeLessThanOrEqual(1);
    expect(moon.phase).toBeGreaterThanOrEqual(0);
    expect(moon.phase).toBeLessThan(1);
  });

  it('reports near-full moon on a known full-moon date (2025-01-13)', () => {
    const moon = getMoonData(45.5, -73.6, new Date('2025-01-13T22:00:00Z'));
    expect(moon.fraction).toBeGreaterThan(0.95);
    expect(moon.phaseName).toBe('Full Moon');
  });

  it('reports near-new moon on a known new-moon date (2025-01-29)', () => {
    const moon = getMoonData(45.5, -73.6, new Date('2025-01-29T12:36:00Z'));
    expect(moon.fraction).toBeLessThan(0.05);
    expect(moon.phaseName).toBe('New Moon');
  });

  it('phaseName covers all eight phase bands', () => {
    const phases = [0.03, 0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.88];
    const expected = [
      'New Moon',
      'Waxing Crescent',
      'First Quarter',
      'Waxing Gibbous',
      'Full Moon',
      'Waning Gibbous',
      'Last Quarter',
      'Waning Crescent',
    ];
    // Drive through _phaseName indirectly via a mock getMoonData call at lat/lon
    // where the phase is irrelevant; we check phase→name mapping via real dates
    // that hit each band.
    const knownDates: [string, string][] = [
      ['2025-01-29T12:36:00Z', 'New Moon'],
      ['2025-02-02T00:00:00Z', 'Waxing Crescent'],
      ['2025-02-05T08:02:00Z', 'First Quarter'],
      ['2025-02-10T00:00:00Z', 'Waxing Gibbous'],
      ['2025-02-12T13:53:00Z', 'Full Moon'],
      ['2025-02-17T00:00:00Z', 'Waning Gibbous'],
      ['2025-02-20T17:33:00Z', 'Last Quarter'],
      ['2025-02-25T00:00:00Z', 'Waning Crescent'],
    ];
    for (const [dateStr, expectedName] of knownDates) {
      const moon = getMoonData(45.5, -73.6, new Date(dateStr));
      expect(moon.phaseName, `${dateStr} → ${expectedName}`).toBe(expectedName);
    }
    void phases;
    void expected;
  });
});

describe('sunriseSetAzimuths', () => {
  it('returns null for both when no samples are above horizon', () => {
    const noSun = [
      { t: new Date(), elevation: -10, azimuth: 90 },
      { t: new Date(), elevation: -5, azimuth: 95 },
    ];
    expect(sunriseSetAzimuths(noSun)).toEqual({ riseAzimuth: null, setAzimuth: null });
  });

  it('returns the first and last above-horizon azimuths for a real day', () => {
    // Use an explicit UTC time that falls in Montreal's night (2 am local, UTC-4) so the
    // 24-hour window starts well after the previous sunset and before this day's sunrise.
    // Without the Z suffix the constructor is local-time-dependent and fails in UTC CI.
    const samples = sampleDay(45.5, -73.6, new Date('2026-06-21T06:00:00Z'));
    const { riseAzimuth, setAzimuth } = sunriseSetAzimuths(samples);
    expect(riseAzimuth).not.toBeNull();
    expect(setAzimuth).not.toBeNull();
    // Midsummer sunrise is NE (roughly 50–70°) and sunset is NW (roughly 290–310°)
    expect(riseAzimuth!).toBeGreaterThan(30);
    expect(riseAzimuth!).toBeLessThan(100);
    expect(setAzimuth!).toBeGreaterThan(260);
    expect(setAzimuth!).toBeLessThan(330);
  });

  it('returns the same azimuth for rise and set when only one sample is above horizon', () => {
    const oneSun = [
      { t: new Date(), elevation: -5, azimuth: 80 },
      { t: new Date(), elevation: 1, azimuth: 90 },
      { t: new Date(), elevation: -5, azimuth: 100 },
    ];
    const { riseAzimuth, setAzimuth } = sunriseSetAzimuths(oneSun);
    expect(riseAzimuth).toBe(90);
    expect(setAzimuth).toBe(90);
  });

  it('returns null when the sun never crosses the horizon (polar day)', () => {
    // Every sample above horizon — no below→above or above→below transition.
    const polarDay = [
      { t: new Date(), elevation: 5, azimuth: 10 },
      { t: new Date(), elevation: 8, azimuth: 90 },
      { t: new Date(), elevation: 6, azimuth: 170 },
    ];
    expect(sunriseSetAzimuths(polarDay)).toEqual({ riseAzimuth: null, setAzimuth: null });
  });

  it('does not report a window-edge sample as a false sunrise/sunset', () => {
    // Window starts already above horizon, then sets. Only sunset should be
    // reported; the open start is not a real sunrise.
    const samples = [
      { t: new Date(), elevation: 12, azimuth: 70 },
      { t: new Date(), elevation: 4, azimuth: 110 },
      { t: new Date(), elevation: -3, azimuth: 130 },
    ];
    const { riseAzimuth, setAzimuth } = sunriseSetAzimuths(samples);
    expect(riseAzimuth).toBeNull();
    expect(setAzimuth).toBe(110);
  });
});

describe('aboveHorizonSegments', () => {
  it('finds exactly one contiguous run for a normal day', () => {
    const samples = sampleDay(45.5, -73.6, new Date('2026-06-21T06:00:00Z'));
    const runs = aboveHorizonSegments(samples);
    expect(runs).toHaveLength(1);
    const { startIdx, endIdx } = runs[0];
    // Every sample inside the run is above horizon.
    for (let i = startIdx; i <= endIdx; i++) {
      expect(samples[i].elevation).toBeGreaterThan(0);
    }
    // The neighbour just before the run start is at/below horizon (or the run
    // starts at index 0).
    if (startIdx > 0) {
      expect(samples[startIdx - 1].elevation).toBeLessThanOrEqual(0);
    }
  });

  it('returns no runs when every sample is below horizon', () => {
    const allBelow = [
      { t: new Date(), elevation: -10, azimuth: 90 },
      { t: new Date(), elevation: -5, azimuth: 95 },
      { t: new Date(), elevation: -1, azimuth: 100 },
    ];
    expect(aboveHorizonSegments(allBelow)).toEqual([]);
  });

  it('returns a single full-range run for a polar day (all above horizon)', () => {
    const polarDay = [
      { t: new Date(), elevation: 5, azimuth: 10 },
      { t: new Date(), elevation: 8, azimuth: 90 },
      { t: new Date(), elevation: 6, azimuth: 170 },
    ];
    expect(aboveHorizonSegments(polarDay)).toEqual([{ startIdx: 0, endIdx: 2 }]);
  });

  it('detects two disjoint runs in a [+,+,-,-,+,+] sequence', () => {
    const samples = [
      { t: new Date(), elevation: 5, azimuth: 0 },
      { t: new Date(), elevation: 10, azimuth: 30 },
      { t: new Date(), elevation: -2, azimuth: 60 },
      { t: new Date(), elevation: -5, azimuth: 90 },
      { t: new Date(), elevation: 3, azimuth: 120 },
      { t: new Date(), elevation: 7, azimuth: 150 },
    ];
    expect(aboveHorizonSegments(samples)).toEqual([
      { startIdx: 0, endIdx: 1 },
      { startIdx: 4, endIdx: 5 },
    ]);
  });
});
