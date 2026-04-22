import { describe, it, expect } from 'vitest';
import {
  azimuthInFov,
  findFovWindow,
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
