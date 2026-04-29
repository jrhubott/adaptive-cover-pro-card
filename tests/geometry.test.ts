import { describe, it, expect } from 'vitest';
import {
  azimuthToCartesian,
  blindSpotBearings,
  elevationToRadius,
  fovBandRadii,
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

describe('geometry — north offset', () => {
  it('azimuthToCartesian default (offset=0) preserves existing behavior', () => {
    const p = azimuthToCartesian(0, 1, 0);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(-1);
  });

  it('azimuthToCartesian offset=90 rotates N to East position', () => {
    const p = azimuthToCartesian(0, 1, 90);
    expect(p.x).toBeCloseTo(1);
    expect(p.y).toBeCloseTo(0);
  });

  it('azimuthToCartesian offset=90: East azimuth moves to South position', () => {
    const p = azimuthToCartesian(90, 1, 90);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(1);
  });

  it('azimuthToCartesian offset=360 same as offset=0', () => {
    const p0 = azimuthToCartesian(45, 1, 0);
    const p360 = azimuthToCartesian(45, 1, 360);
    expect(p360.x).toBeCloseTo(p0.x);
    expect(p360.y).toBeCloseTo(p0.y);
  });

  it('azimuthToCartesian negative offset same as positive equivalent', () => {
    const pNeg = azimuthToCartesian(0, 1, -90);
    const pPos = azimuthToCartesian(0, 1, 270);
    expect(pNeg.x).toBeCloseTo(pPos.x);
    expect(pNeg.y).toBeCloseTo(pPos.y);
  });

  it('sunDotPosition forwards offset to azimuthToCartesian', () => {
    const p = sunDotPosition(0, 0, 90);
    expect(p.x).toBeCloseTo(1);
    expect(p.y).toBeCloseTo(0);
  });

  it('wedgePath with offset produces different path than without', () => {
    const d0 = wedgePath(0, 90, 100, 0, 0);
    const d90 = wedgePath(0, 90, 100, 0, 90);
    expect(d0).not.toBe(d90);
  });

  it('wedgePath offset=90: wedge(0,90) equivalent to wedge(90,180) with offset=0', () => {
    const dOffset = wedgePath(0, 90, 100, 0, 90);
    const dBase = wedgePath(90, 180, 100, 0, 0);
    expect(dOffset).toBe(dBase);
  });
});

describe('geometry — fovBandRadii', () => {
  const R = 110;

  it('no limits → full pie defaults', () => {
    const { outer, inner } = fovBandRadii(undefined, undefined, R);
    expect(outer).toBeCloseTo(R);
    expect(inner).toBeCloseTo(0);
  });

  it('min_elevation=0 (horizon) → outer unchanged', () => {
    const { outer, inner } = fovBandRadii(0, undefined, R);
    expect(outer).toBeCloseTo(R);
    expect(inner).toBeCloseTo(0);
  });

  it('max_elevation=90 (zenith) → inner unchanged', () => {
    const { outer, inner } = fovBandRadii(undefined, 90, R);
    expect(outer).toBeCloseTo(R);
    expect(inner).toBeCloseTo(0);
  });

  it('min_elevation=10 only → clips outer radius', () => {
    const { outer, inner } = fovBandRadii(10, undefined, R);
    expect(outer).toBeCloseTo(R * elevationToRadius(10));
    expect(inner).toBeCloseTo(0);
  });

  it('max_elevation=60 only → clips inner radius (donut)', () => {
    const { outer, inner } = fovBandRadii(undefined, 60, R);
    expect(outer).toBeCloseTo(R);
    expect(inner).toBeCloseTo(R * elevationToRadius(60));
  });

  it('both min_elevation=10 and max_elevation=60 → annular band', () => {
    const { outer, inner } = fovBandRadii(10, 60, R);
    expect(outer).toBeCloseTo(R * elevationToRadius(10));
    expect(inner).toBeCloseTo(R * elevationToRadius(60));
  });

  it('inverted limits (min > max) → falls back to full pie', () => {
    const { outer, inner } = fovBandRadii(70, 30, R);
    expect(outer).toBeCloseTo(R);
    expect(inner).toBeCloseTo(0);
  });

  it('out-of-range values clamp via elevationToRadius', () => {
    const { outer, inner } = fovBandRadii(-5, 95, R);
    expect(outer).toBeCloseTo(R);
    expect(inner).toBeCloseTo(0);
  });
});

describe('geometry — blindSpotBearings', () => {
  it('repro: windowAzimuth=180, range=[10, 30] → [150, 170]', () => {
    const [start, end] = blindSpotBearings(180, [10, 30]);
    expect(start).toBeCloseTo(150);
    expect(end).toBeCloseTo(170);
  });

  it('wrap-around: windowAzimuth=10, range=[20, 40] → [330, 350]', () => {
    const [start, end] = blindSpotBearings(10, [20, 40]);
    expect(start).toBeCloseTo(330);
    expect(end).toBeCloseTo(350);
  });

  it('identity: windowAzimuth=0, range=[0, 0] → [0, 0]', () => {
    const [start, end] = blindSpotBearings(0, [0, 0]);
    expect(start).toBeCloseTo(0);
    expect(end).toBeCloseTo(0);
  });
});
