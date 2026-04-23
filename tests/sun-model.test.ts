import { describe, it, expect } from 'vitest';
import {
  azimuthInFov,
  findFovWindow,
  getMoonData,
  sampleDay,
  startOfDay,
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
    const samples = sampleDay(45.5, -73.6, new Date('2026-06-21T00:00:00'));
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
});
