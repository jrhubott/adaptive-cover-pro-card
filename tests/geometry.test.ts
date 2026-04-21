import { describe, it, expect } from 'vitest';
import {
  azimuthToCartesian,
  elevationToRadius,
  normalizeAzimuth,
  sunDotPosition,
  wedgePath,
} from '../src/lib/geometry';

describe('geometry', () => {
  it('azimuth 0° (north) maps to (0, -r)', () => {
    const p = azimuthToCartesian(0, 1);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(-1);
  });

  it('azimuth 90° (east) maps to (r, 0)', () => {
    const p = azimuthToCartesian(90, 1);
    expect(p.x).toBeCloseTo(1);
    expect(p.y).toBeCloseTo(0);
  });

  it('azimuth 180° (south) maps to (0, r)', () => {
    const p = azimuthToCartesian(180, 1);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(1);
  });

  it('elevation 0° maps to outer ring (r=1)', () => {
    expect(elevationToRadius(0)).toBe(1);
  });

  it('elevation 90° maps to centre (r=0)', () => {
    expect(elevationToRadius(90)).toBe(0);
  });

  it('elevation clamps below 0 and above 90', () => {
    expect(elevationToRadius(-10)).toBe(1);
    expect(elevationToRadius(120)).toBe(0);
  });

  it('sun at noon zenith (any azi, elev=90) lands at origin', () => {
    const p = sunDotPosition(137, 90);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(0);
  });

  it('normalizeAzimuth wraps negatives and >=360', () => {
    expect(normalizeAzimuth(-10)).toBeCloseTo(350);
    expect(normalizeAzimuth(360)).toBeCloseTo(0);
    expect(normalizeAzimuth(725)).toBeCloseTo(5);
  });

  it('wedgePath produces a non-empty SVG path', () => {
    const d = wedgePath(90, 180, 100);
    expect(d).toMatch(/^M 0 0/);
    expect(d).toMatch(/A 100 100/);
    expect(d).toMatch(/Z$/);
  });

  it('wedgePath with innerR produces a donut arc (no M 0 0 origin move)', () => {
    const d = wedgePath(90, 180, 100, 50);
    expect(d).not.toMatch(/^M 0 0/);
    expect(d).toMatch(/A 100 100/);
    expect(d).toMatch(/A 50 50/);
  });
});
