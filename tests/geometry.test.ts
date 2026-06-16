import { describe, it, expect } from 'vitest';
import {
  aggregateActualPosition,
  arcsOverlap,
  arrowheadPath,
  azimuthToCartesian,
  blindSpotBearings,
  clampActiveArcToFov,
  coverWedgeOuterRadius,
  dayFractionX,
  elevationBandFraction,
  elevationGatedFovBounds,
  elevationToRadius,
  fovBandRadii,
  fovRunBounds,
  moonPhaseShadowDx,
  normalizeAzimuth,
  overrideDivergenceTarget,
  ribbonLayout,
  scheduleZones,
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

  it('no limits → full pie {outer: R, inner: 0}', () => {
    const { outer, inner } = fovBandRadii(undefined, undefined, R);
    expect(outer).toBe(R);
    expect(inner).toBe(0);
  });

  it('min=0 (sunset) → outer stays at horizon, no clip', () => {
    const { outer, inner } = fovBandRadii(0, undefined, R);
    expect(outer).toBeCloseTo(R);
    expect(inner).toBe(0);
  });

  it('min only → outer clipped, inner stays 0', () => {
    const { outer, inner } = fovBandRadii(10, undefined, R);
    expect(outer).toBeCloseTo(R * elevationToRadius(10));
    expect(inner).toBe(0);
  });

  it('max=90 → inner stays at 0 (zenith = centre)', () => {
    const { outer, inner } = fovBandRadii(undefined, 90, R);
    expect(outer).toBe(R);
    expect(inner).toBeCloseTo(0);
  });

  it('max only → inner clipped (donut)', () => {
    const { outer, inner } = fovBandRadii(undefined, 60, R);
    expect(outer).toBe(R);
    expect(inner).toBeCloseTo(R * elevationToRadius(60));
  });

  it('both set → annular sector', () => {
    const { outer, inner } = fovBandRadii(10, 60, R);
    expect(outer).toBeCloseTo(R * elevationToRadius(10));
    expect(inner).toBeCloseTo(R * elevationToRadius(60));
  });

  it('inverted limits (min > max) → fallback to full pie', () => {
    const { outer, inner } = fovBandRadii(70, 30, R);
    expect(outer).toBe(R);
    expect(inner).toBe(0);
  });

  it('out-of-range values clamp via elevationToRadius', () => {
    const { outer, inner } = fovBandRadii(-5, 95, R);
    expect(outer).toBeCloseTo(R * elevationToRadius(-5)); // clamps to R*1 = R
    expect(inner).toBeCloseTo(R * elevationToRadius(95)); // clamps to R*0 = 0
  });
});

describe('geometry — elevationBandFraction', () => {
  // axisMin = -10, axisMax = 90 mirrors the elevation chart's y-axis.
  const AXIS_MIN = -10;
  const AXIS_MAX = 90;

  it('both set → in-band fractions (0 = axisMin, 1 = axisMax)', () => {
    // min=10 → (10 - -10)/100 = 0.2 ; max=60 → (60 - -10)/100 = 0.7
    const { loFrac, hiFrac } = elevationBandFraction(10, 60, AXIS_MIN, AXIS_MAX);
    expect(loFrac).toBeCloseTo(0.2);
    expect(hiFrac).toBeCloseTo(0.7);
  });

  it('inverted limits (min > max) → fallback to full axis {0, 1}', () => {
    const { loFrac, hiFrac } = elevationBandFraction(70, 30, AXIS_MIN, AXIS_MAX);
    expect(loFrac).toBe(0);
    expect(hiFrac).toBe(1);
  });

  it('min only → lo clipped, hi at axis top (1)', () => {
    const { loFrac, hiFrac } = elevationBandFraction(10, undefined, AXIS_MIN, AXIS_MAX);
    expect(loFrac).toBeCloseTo(0.2);
    expect(hiFrac).toBe(1);
  });

  it('max only → lo at axis bottom (0), hi clipped', () => {
    const { loFrac, hiFrac } = elevationBandFraction(undefined, 60, AXIS_MIN, AXIS_MAX);
    expect(loFrac).toBe(0);
    expect(hiFrac).toBeCloseTo(0.7);
  });

  it('neither set → full axis {0, 1}', () => {
    const { loFrac, hiFrac } = elevationBandFraction(undefined, undefined, AXIS_MIN, AXIS_MAX);
    expect(loFrac).toBe(0);
    expect(hiFrac).toBe(1);
  });

  it('out-of-range values clamp to [0, 1]', () => {
    // min below axisMin → 0 ; max above axisMax → 1
    const { loFrac, hiFrac } = elevationBandFraction(-50, 200, AXIS_MIN, AXIS_MAX);
    expect(loFrac).toBe(0);
    expect(hiFrac).toBe(1);
  });
});

describe('geometry — ribbonLayout', () => {
  it('count=3 stacks three rows with top pad, fixed height, and gaps', () => {
    const { rows, height } = ribbonLayout(3, 6, 8, 3, 4);
    expect(rows).toHaveLength(3);
    expect(rows[0]).toEqual({ y: 6, height: 8 });
    expect(rows[1]).toEqual({ y: 17, height: 8 });
    expect(rows[2]).toEqual({ y: 28, height: 8 });
    // top(6) + 3*rowH(24) + 2*gap(6) + bottom(4) = 40
    expect(height).toBe(40);
  });

  it('count=1 yields a single row and minimal height', () => {
    const { rows, height } = ribbonLayout(1, 6, 8, 3, 4);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({ y: 6, height: 8 });
    // top(6) + 1*rowH(8) + 0 gaps + bottom(4) = 18
    expect(height).toBe(18);
  });

  it('rows are disjoint and ordered top-to-bottom', () => {
    const { rows } = ribbonLayout(3, 6, 8, 3, 4);
    expect(rows[0].y).toBeLessThan(rows[1].y);
    expect(rows[1].y).toBeLessThan(rows[2].y);
    // Non-overlapping: each row ends before the next begins.
    expect(rows[0].y + rows[0].height).toBeLessThanOrEqual(rows[1].y);
    expect(rows[1].y + rows[1].height).toBeLessThanOrEqual(rows[2].y);
  });

  it('count=0 yields no rows and zero height', () => {
    const { rows, height } = ribbonLayout(0, 6, 8, 3, 4);
    expect(rows).toEqual([]);
    expect(height).toBe(0);
  });
});

describe('geometry — clampActiveArcToFov', () => {
  // windowAzi=180, fov_left=45, fov_right=45 → fovStart=135, fovEnd=225, fovSweep=90

  it('identity inside envelope: inputs on envelope edges pass through unchanged', () => {
    // rawS=150, rawE=210 both inside [135..225]; offS=15, offE=75; lo=15, hi=75
    // wedgeStart=135+15=150, wedgeEnd=135+75=210
    const result = clampActiveArcToFov(150, 210, 180, 45, 45);
    expect(result.wedgeStart).toBeCloseTo(150);
    expect(result.wedgeEnd).toBeCloseTo(210);
  });

  it('N-wrap envelope (PR #85 case): window at 342°, FOV ±90°, inputs straddle N', () => {
    // fovStart = normalize(342-90) = 252, fovSweep=180
    // rawS=72: offS = (72-252+360)%360 = 180 — exactly at fovSweep edge → clamped to 180
    // rawE=252: offE = (252-252+360)%360 = 0
    // lo=0, hi=180 → wedgeStart=252+0=252, wedgeEnd=normalize(252+180)=72
    const result = clampActiveArcToFov(72, 252, 342, 90, 90);
    expect(result.wedgeStart).toBeCloseTo(252);
    expect(result.wedgeEnd).toBeCloseTo(72);
  });

  it("reporter's interior-pair (issue #89): windowAzi=150, fov 84+86, inputs=(180,120)", () => {
    // fovStart = normalize(150-84) = 66, fovSweep = 84+86 = 170
    // rawS=180: offS = (180-66+360)%360 = 114; inside [0,170] → clampedS=114
    // rawE=120: offE = (120-66+360)%360 = 54;  inside [0,170] → clampedE=54
    // lo=54, hi=114 → wedgeStart=normalize(66+54)=120, wedgeEnd=normalize(66+114)=180
    const result = clampActiveArcToFov(180, 120, 150, 84, 86);
    expect(result.wedgeStart).toBeCloseTo(120);
    expect(result.wedgeEnd).toBeCloseTo(180);
  });

  it('one value outside envelope: rawS=50 clamps to fovStart=135, rawE=210 inside', () => {
    // fovStart=135, fovSweep=90
    // offS = (50-135+360)%360 = 275; >90 → distance to 90 edge = 185, to 0 edge = 85 → clamp to 0
    // offE = (210-135+360)%360 = 75; inside → clampedE=75
    // lo=0, hi=75 → wedgeStart=135, wedgeEnd=135+75=210
    const result = clampActiveArcToFov(50, 210, 180, 45, 45);
    expect(result.wedgeStart).toBeCloseTo(135);
    expect(result.wedgeEnd).toBeCloseTo(210);
  });

  it('both values outside/coincident → fallback to full envelope [135, 225]', () => {
    // rawS=50: offS = (50-135+360)%360 = 275; >90 → clamp to 0
    // rawE=60: offE = (60-135+360)%360 = 285; >90 → clamp to 0
    // clampedS === clampedE → fallback: wedgeStart=135, wedgeEnd=225
    const result = clampActiveArcToFov(50, 60, 180, 45, 45);
    expect(result.wedgeStart).toBeCloseTo(135);
    expect(result.wedgeEnd).toBeCloseTo(225);
  });

  it('#89 follow-up: N-wrap envelope with interior sunrise/sunset pair', () => {
    // windowAzi=340 (NNW), fov_left=fov_right=90 → envelope [250..70] (through N), sweep=180°.
    // Integration emits sunrise az (~58, INSIDE envelope) and sunset az (~302, INSIDE envelope).
    // Naïve wedgePath(58, 302) draws a 244° arc through South (the reported inverse).
    // The clamp must produce {wedgeStart: 302, wedgeEnd: 58} — a 116° arc through North.
    const result = clampActiveArcToFov(58, 302, 340, 90, 90);
    expect(result.wedgeStart).toBeCloseTo(302);
    expect(result.wedgeEnd).toBeCloseTo(58);
  });

  it('#89 follow-up: clamp is order-independent for N-wrap interior pair', () => {
    const a = clampActiveArcToFov(58, 302, 340, 90, 90);
    const b = clampActiveArcToFov(302, 58, 340, 90, 90);
    expect(a).toEqual(b);
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

describe('geometry — elevationGatedFovBounds', () => {
  // Helper: build a sample array with given azimuth/elevation pairs
  function mkSamples(
    pairs: Array<[number, number]>,
  ): Array<{ azimuth: number; elevation: number }> {
    return pairs.map(([azimuth, elevation]) => ({ azimuth, elevation }));
  }

  // Case (a): All samples above min_elevation within FOV → returns first/last azimuth
  it('all samples above threshold inside FOV → bounds match first/last qualifying azimuth', () => {
    // windowAzi=180, fov_left=45, fov_right=45 → fovStart=135, fovSweep=90
    // All samples 140°–220° are within FOV; all elevation > 10
    const samples = mkSamples([
      [140, 15],
      [160, 20],
      [180, 25],
      [200, 18],
      [220, 12],
    ]);
    const result = elevationGatedFovBounds(samples, 180, 45, 45, 10);
    expect(result).not.toBeNull();
    expect(result!.wedgeStart).toBe(140);
    expect(result!.wedgeEnd).toBe(220);
  });

  // Case (b): Only some samples above min_elevation → bounds of the above-threshold subset
  it('partially above threshold → bounds of qualifying subset only', () => {
    // windowAzi=180, fov_left=45, fov_right=45 → fovStart=135, fovSweep=90
    // samples at 140° (elev=5, below threshold), 160° (elev=15, OK), 200° (elev=20, OK), 220° (elev=3, below)
    const samples = mkSamples([
      [140, 5],
      [160, 15],
      [200, 20],
      [220, 3],
    ]);
    const result = elevationGatedFovBounds(samples, 180, 45, 45, 10);
    expect(result).not.toBeNull();
    expect(result!.wedgeStart).toBe(160);
    expect(result!.wedgeEnd).toBe(200);
  });

  // Case (c): No samples above min_elevation within FOV → returns null
  it('no samples above threshold in FOV → null', () => {
    // windowAzi=180, fov_left=45, fov_right=45 → fovStart=135, fovSweep=90
    const samples = mkSamples([
      [140, 3],
      [160, 5],
      [180, 2],
    ]);
    const result = elevationGatedFovBounds(samples, 180, 45, 45, 10);
    expect(result).toBeNull();
  });

  // Case (d): N-wrap FOV (windowAzi=342, fov_left=90, fov_right=90) spanning 252°→72° through N
  it('N-wrap FOV: samples spanning through North are correctly filtered', () => {
    // fovStart = normalizeAzimuth(342-90) = 252, fovSweep = 180
    // FOV covers 252°→72° (through N=0°/360°)
    // Samples: 260° (in FOV, above threshold), 10° (in FOV, above threshold),
    //          60° (in FOV, above threshold), 180° (outside FOV, ignored),
    //          250° (outside FOV — offset=(250-252+360)%360=358 > 180, ignored)
    const samples = mkSamples([
      [260, 20],
      [10, 15],
      [60, 12],
      [180, 25], // outside FOV
      [250, 18], // outside FOV (just past fovStart edge)
    ]);
    const result = elevationGatedFovBounds(samples, 342, 90, 90, 10);
    expect(result).not.toBeNull();
    // first qualifying in FOV = 260°, last = 60°
    expect(result!.wedgeStart).toBe(260);
    expect(result!.wedgeEnd).toBe(60);
  });

  // Case (e): min_elevation === undefined → returns null (no gate; caller falls back to raw envelope)
  it('min_elevation undefined → returns null (no gate)', () => {
    const samples = mkSamples([
      [140, 15],
      [160, 20],
      [180, 25],
    ]);
    const result = elevationGatedFovBounds(samples, 180, 45, 45, undefined);
    expect(result).toBeNull();
  });
});

describe('geometry — fovRunBounds', () => {
  const s = (azimuth: number, elevation: number) => ({ azimuth, elevation });

  it('returns first/last azimuth of the run with no elevation gate', () => {
    const samples = [s(40, 2), s(50, 8), s(60, 12), s(70, 6)];
    expect(fovRunBounds(samples, 0, 3, undefined)).toEqual({ wedgeStart: 40, wedgeEnd: 70 });
  });

  it('narrows the run to samples clearing the elevation gate', () => {
    const samples = [s(40, 2), s(50, 8), s(60, 12), s(70, 6)];
    // gate 7 → only 50/8, 60/12 qualify
    expect(fovRunBounds(samples, 0, 3, 7)).toEqual({ wedgeStart: 50, wedgeEnd: 60 });
  });

  it('respects the start/end index window', () => {
    const samples = [s(10, 5), s(40, 8), s(60, 9), s(300, 5)];
    expect(fovRunBounds(samples, 1, 2, undefined)).toEqual({ wedgeStart: 40, wedgeEnd: 60 });
  });

  it('returns null when no sample in the run clears the gate', () => {
    const samples = [s(40, 2), s(50, 3)];
    expect(fovRunBounds(samples, 0, 1, 10)).toBeNull();
  });
});

describe('geometry — arcsOverlap', () => {
  it('detects overlapping arcs', () => {
    expect(arcsOverlap(10, 50, 40, 80)).toBe(true);
  });

  it('reports disjoint arcs as non-overlapping', () => {
    // morning NE run vs evening NW run around a north window — never overlap
    expect(arcsOverlap(20, 70, 290, 340)).toBe(false);
  });

  it('handles arcs that wrap past north', () => {
    expect(arcsOverlap(300, 40, 20, 60)).toBe(true); // 20..60 sits inside 300..40? overlaps at 20..40
    expect(arcsOverlap(300, 20, 80, 140)).toBe(false);
  });
});

describe('geometry — dayFractionX', () => {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const WIDTH = 600;
  // Fixed reference: midnight 2026-06-01 UTC (used as a concrete dayStart)
  const dayStart = new Date('2026-06-01T00:00:00Z').getTime();

  it('dayStart maps to 0', () => {
    expect(dayFractionX(dayStart, dayStart, WIDTH)).toBe(0);
  });

  it('dayStart + 12h maps to width / 2', () => {
    expect(dayFractionX(dayStart + 12 * 3600_000, dayStart, WIDTH)).toBeCloseTo(WIDTH / 2);
  });

  it('dayStart + 24h maps to width', () => {
    expect(dayFractionX(dayStart + DAY_MS, dayStart, WIDTH)).toBeCloseTo(WIDTH);
  });

  it('clamps below-day inputs to 0', () => {
    expect(dayFractionX(dayStart - 1, dayStart, WIDTH)).toBe(0);
  });

  it('clamps above-day inputs to width', () => {
    expect(dayFractionX(dayStart + DAY_MS + 1, dayStart, WIDTH)).toBe(WIDTH);
  });
});

describe('scheduleZones', () => {
  const DAY = 24 * 60 * 60 * 1000;
  const dayStart = Date.UTC(2026, 5, 6, 0, 0, 0); // 2026-06-06 00:00 UTC
  const at = (h: number, m = 0): Date => new Date(dayStart + (h * 60 + m) * 60_000);

  describe('normal in-day window (start < end)', () => {
    it('off-schedule is the two edge bands [0,startFrac] and [endFrac,1]', () => {
      const z = scheduleZones(at(6), at(18), dayStart, DAY);
      expect(z.offSchedule).toEqual([
        { x0: 0, x1: 0.25 },
        { x0: 0.75, x1: 1 },
      ]);
    });

    it('emits a drawable bar at each true in-domain bound', () => {
      const z = scheduleZones(at(6), at(18), dayStart, DAY);
      expect(z.bars).toEqual([0.25, 0.75]);
    });
  });

  describe('midnight-spanning window (end ≤ start)', () => {
    it('off-schedule is the single middle band [endFrac, startFrac]', () => {
      // In-schedule 21:00 → 06:00 (next day). Off-schedule is the daytime gap.
      const z = scheduleZones(at(21), new Date(dayStart + DAY + 6 * 3600_000), dayStart, DAY);
      expect(z.offSchedule).toEqual([{ x0: 0.25, x1: 0.875 }]);
    });

    it('treats a same-day end equal-or-before start as midnight-spanning', () => {
      // end exactly 00:00 next day (rolled): endFrac would be 1.0 → clamps, no
      // off band on the right; here use end < start in-day to exercise middle.
      const z = scheduleZones(at(20), at(8), dayStart, DAY);
      // start 20:00 → 0.8333, end 08:00 → 0.3333; middle band [0.333, 0.833].
      expect(z.offSchedule).toEqual([{ x0: 8 / 24, x1: 20 / 24 }]);
      expect(z.bars).toEqual([20 / 24, 8 / 24]);
    });
  });

  describe('open-ended / null bounds', () => {
    it('null end: open to the right — off-schedule [0,startFrac], left bar only', () => {
      const z = scheduleZones(at(6), null, dayStart, DAY);
      expect(z.offSchedule).toEqual([{ x0: 0, x1: 0.25 }]);
      expect(z.bars).toEqual([0.25]);
    });

    it('null start: open to the left — off-schedule [endFrac,1], right bar only', () => {
      const z = scheduleZones(null, at(18), dayStart, DAY);
      expect(z.offSchedule).toEqual([{ x0: 0.75, x1: 1 }]);
      expect(z.bars).toEqual([0.75]);
    });

    it('both null: empty (no zones, no bars)', () => {
      const z = scheduleZones(null, null, dayStart, DAY);
      expect(z.offSchedule).toEqual([]);
      expect(z.bars).toEqual([]);
    });
  });

  describe('out-of-domain bounds clamp the zone and omit the bar', () => {
    it('start before today (frac < 0): gray clamps to 0, no left bar', () => {
      const z = scheduleZones(new Date(dayStart - 2 * 3600_000), at(18), dayStart, DAY);
      // start frac = −2/24 → clamp to 0; window is in-day so off-schedule is the
      // two edge bands but the left band collapses (csf=0) and is dropped.
      expect(z.offSchedule).toEqual([{ x0: 0.75, x1: 1 }]);
      expect(z.bars).toEqual([0.75]);
    });

    it('end rolled to next day (frac > 1): wraps to its clock time, no right bar', () => {
      const z = scheduleZones(at(6), new Date(dayStart + DAY + 3 * 3600_000), dayStart, DAY);
      // In-schedule 06:00 → 03:00 next day (a next-day-rolled end). The end's
      // clock time (03:00 → 0.125) wraps onto today, making the window
      // midnight-spanning: off-schedule is the 03:00–06:00 gap. The rolled end
      // lands past the right edge (true frac 1.125), so it draws no bar.
      expect(z.offSchedule).toEqual([{ x0: 0.125, x1: 0.25 }]);
      expect(z.bars).toEqual([0.25]);
    });
  });
});

describe('aggregateActualPosition', () => {
  it('returns the arithmetic mean of all non-null values', () => {
    expect(aggregateActualPosition({ a: 80, b: 40 })).toBe(60);
  });

  it('ignores null values when averaging', () => {
    expect(aggregateActualPosition({ a: 50, b: null })).toBe(50);
  });

  it('returns null when every value is null', () => {
    expect(aggregateActualPosition({ a: null, b: null })).toBeNull();
  });

  it('returns null for an empty map', () => {
    expect(aggregateActualPosition({})).toBeNull();
  });

  it('returns 0 for a single zero value (not null)', () => {
    expect(aggregateActualPosition({ a: 0 })).toBe(0);
  });
});

describe('coverWedgeOuterRadius', () => {
  const OUTER_R = 110;

  it('blind at position=0 fills the full FOV (clamped to fovOuter)', () => {
    // 1 - 0/100 = 1 → OUTER_R, clamped to fovOuter when smaller.
    expect(coverWedgeOuterRadius(0, 'cover_blind', OUTER_R, OUTER_R)).toBe(OUTER_R);
    expect(coverWedgeOuterRadius(0, 'cover_blind', OUTER_R, 90)).toBe(90);
  });

  it('blind at position=100 collapses to centre (≤ fovInner side / null per inner gate)', () => {
    // 1 - 100/100 = 0 → radius 0, which is ≤ any positive fovInner so it does
    // not draw; the raw radius is 0.
    expect(coverWedgeOuterRadius(100, 'cover_blind', OUTER_R, OUTER_R)).toBe(0);
  });

  it('clamps to fovOuterR when the raw cover radius exceeds it', () => {
    // blind pos=5 → 1 - 0.05 = 0.95 → rawCoverR = 104.5; fovOuter 97.78 → clamp.
    const fovOuter = 97.78;
    expect(coverWedgeOuterRadius(5, 'cover_blind', OUTER_R, fovOuter)).toBe(fovOuter);
  });

  it('awning fraction is position/100 (inverse of blind)', () => {
    // awning pos=100 → fraction 1 → OUTER_R.
    expect(coverWedgeOuterRadius(100, 'cover_awning', OUTER_R, OUTER_R)).toBe(OUTER_R);
    // awning pos=0 → fraction 0 → radius 0.
    expect(coverWedgeOuterRadius(0, 'cover_awning', OUTER_R, OUTER_R)).toBe(0);
    // awning pos=50 → fraction 0.5 → 55.
    expect(coverWedgeOuterRadius(50, 'cover_awning', OUTER_R, OUTER_R)).toBe(55);
  });
});

describe('overrideDivergenceTarget', () => {
  it('returns the solar target when override is active and it differs from held', () => {
    expect(overrideDivergenceTarget(true, 20, 80)).toBe(20);
  });

  it('returns 0 (a valid divergent target) when held is non-zero', () => {
    // 0 is a legitimate solar target; only the held==rawCalc guard suppresses it.
    expect(overrideDivergenceTarget(true, 0, 80)).toBe(0);
  });

  it('returns null when override is not active', () => {
    expect(overrideDivergenceTarget(false, 20, 80)).toBeNull();
  });

  it('returns null when raw_calculated_position equals the held position', () => {
    // Guards the integration default (e.g. both 0 outside the time window).
    expect(overrideDivergenceTarget(true, 80, 80)).toBeNull();
    expect(overrideDivergenceTarget(true, 0, 0)).toBeNull();
  });

  it('returns null when raw_calculated_position is absent', () => {
    expect(overrideDivergenceTarget(true, null, 80)).toBeNull();
    expect(overrideDivergenceTarget(true, undefined, 80)).toBeNull();
  });

  it('returns null when raw_calculated_position is non-finite', () => {
    expect(overrideDivergenceTarget(true, NaN, 80)).toBeNull();
    expect(overrideDivergenceTarget(true, Infinity, 80)).toBeNull();
  });
});

describe('moonPhaseShadowDx', () => {
  // The shadow circle (drawn in black over the lit disc inside the phase mask)
  // is offset horizontally so the unmasked sliver matches the lit fraction.
  // Sign convention must match the plot's existing inline ternary so the
  // refactor produces identical output.
  it('is zero at new moon (phase 0)', () => {
    // -4*r*0 yields -0, which is numerically zero and matches the existing plot.
    expect(moonPhaseShadowDx(0, 6)).toBeCloseTo(0, 10);
  });

  it('is zero at full moon (phase 1)', () => {
    expect(moonPhaseShadowDx(1, 6)).toBe(0);
  });

  it('shifts the shadow left (negative) for a waxing phase < 0.5', () => {
    // -4 * r * phase
    expect(moonPhaseShadowDx(0.25, 6)).toBe(-4 * 6 * 0.25);
  });

  it('shifts the shadow right (positive) for a waning phase ≥ 0.5', () => {
    // 4 * r * (1 - phase)
    expect(moonPhaseShadowDx(0.75, 6)).toBe(4 * 6 * (1 - 0.75));
  });

  it('scales linearly with the radius', () => {
    expect(moonPhaseShadowDx(0.25, 12)).toBe(2 * moonPhaseShadowDx(0.25, 6));
  });
});

describe('arrowheadPath', () => {
  // A closed triangular arrowhead path "M … L … L … Z" with its tip at
  // (tipX, tipY) pointing along bearingDeg (0 = North/up, CW).
  it('returns a closed three-point path starting with M and ending with Z', () => {
    const d = arrowheadPath(0, -100, 0, 8, 4);
    expect(d.startsWith('M ')).toBe(true);
    expect(d.trimEnd().endsWith('Z')).toBe(true);
    // M + 2×L = tip and two base corners.
    expect((d.match(/L /g) ?? []).length).toBe(2);
  });

  it('places the tip exactly at (tipX, tipY)', () => {
    const d = arrowheadPath(10, -100, 0, 8, 4);
    expect(d.startsWith('M 10 -100')).toBe(true);
  });

  it('for a north-pointing arrow (bearing 0) the base sits below the tip', () => {
    // bearing 0 = up (-y). Base corners are `length` back along +y from the tip.
    const tipY = -100;
    const length = 8;
    const d = arrowheadPath(0, tipY, 0, length, 4);
    const nums = d.match(/-?\d+(\.\d+)?/g)!.map(Number);
    // nums: [tipX, tipY, c1x, c1y, c2x, c2y]
    const baseY1 = nums[3];
    const baseY2 = nums[5];
    expect(baseY1).toBeCloseTo(tipY + length, 6);
    expect(baseY2).toBeCloseTo(tipY + length, 6);
    // The two base corners straddle the centerline by ±halfWidth.
    expect(nums[2]).toBeCloseTo(4, 6);
    expect(nums[4]).toBeCloseTo(-4, 6);
  });

  it('for an east-pointing arrow (bearing 90) the base sits left (−x) of the tip', () => {
    const d = arrowheadPath(100, 0, 90, 8, 4);
    const nums = d.match(/-?\d+(\.\d+)?/g)!.map(Number);
    // tip at (100,0); base centre is `length` back along −x → x≈92.
    expect(nums[2]).toBeCloseTo(92, 6);
    expect(nums[4]).toBeCloseTo(92, 6);
    // Base corners straddle along ±y by halfWidth (order: +y then −y).
    expect(nums[3]).toBeCloseTo(4, 6);
    expect(nums[5]).toBeCloseTo(-4, 6);
  });
});
