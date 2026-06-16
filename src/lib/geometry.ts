/**
 * Geometry helpers for the SVG sky compass.
 *
 * Coordinate system: azimuth degrees (0 = North, 90 = East, 180 = South, 270 = West).
 * The compass is rendered as a unit circle with North at the top (12 o'clock).
 *
 * Elevation is mapped to the radius: 0° sun elevation = outer ring (horizon),
 * 90° sun elevation = centre (zenith). This gives a "planetarium looking up"
 * feel and keeps winter suns near the edge where they belong.
 */

export interface Point {
  x: number;
  y: number;
}

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Default down-and-right offset (px) for the floating tooltip: [right, down]. */
export const DEFAULT_TOOLTIP_OFFSET: readonly [number, number] = [12, 16];

export interface PlaceTooltipArgs {
  /** Pointer (or anchor) X in viewport coordinates. */
  cursorX: number;
  /** Pointer (or anchor) Y in viewport coordinates. */
  cursorY: number;
  /** Measured tooltip bubble width (px). */
  ttW: number;
  /** Measured tooltip bubble height (px). */
  ttH: number;
  /** Viewport width (px). */
  vpW: number;
  /** Viewport height (px). */
  vpH: number;
  /** [right, down] offset from the cursor; defaults to DEFAULT_TOOLTIP_OFFSET. */
  offset?: readonly [number, number];
}

/**
 * Position a floating tooltip down-and-right of the cursor, flipping to the
 * opposite side of either axis when the preferred placement would overflow the
 * viewport, and finally clamping both coordinates to be non-negative.
 *
 * Pure: takes the cursor position, the measured bubble size, the viewport size,
 * and an offset; returns the top-left {x, y} of the bubble plus `flipped` (true
 * when the X axis was flipped to the left of the cursor). All math lives here so
 * the component and tests share one implementation.
 */
export function placeTooltip(args: PlaceTooltipArgs): { x: number; y: number; flipped: boolean } {
  const { cursorX, cursorY, ttW, ttH, vpW, vpH } = args;
  const [offsetX, offsetY] = args.offset ?? DEFAULT_TOOLTIP_OFFSET;

  let x = cursorX + offsetX;
  let flipped = false;
  if (x + ttW > vpW) {
    x = cursorX - offsetX - ttW;
    flipped = true;
  }
  if (x < 0) x = 0;

  let y = cursorY + offsetY;
  if (y + ttH > vpH) {
    y = cursorY - offsetY - ttH;
  }
  if (y < 0) y = 0;

  return { x, y, flipped };
}

/** Azimuth (degrees, 0=N clockwise) + radius (0..1) → Cartesian point on a unit circle with +y down.
 *  northOffsetDeg rotates the whole compass clockwise by that many degrees (0 = North at top). */
export function azimuthToCartesian(azimuthDeg: number, radius: number, northOffsetDeg = 0): Point {
  const theta = degToRad(azimuthDeg - 90 + northOffsetDeg);
  return {
    x: radius * Math.cos(theta),
    y: radius * Math.sin(theta),
  };
}

/** Map a sun elevation (°) to a radius in [0..1]; 0°→1, 90°→0. Clamps to [0,1]. */
export function elevationToRadius(elevationDeg: number): number {
  const clamped = Math.max(0, Math.min(90, elevationDeg));
  return 1 - clamped / 90;
}

/**
 * Build an SVG path string for a circular sector (pie wedge).
 * Angles are azimuths in degrees (0=N clockwise). Sweeps clockwise from startAzi to endAzi.
 * If the wedge crosses 360, split the sweep appropriately.
 */
export function wedgePath(
  startAziDeg: number,
  endAziDeg: number,
  outerR: number,
  innerR = 0,
  northOffsetDeg = 0,
): string {
  const normalize = (a: number) => ((a % 360) + 360) % 360;
  const start = normalize(startAziDeg);
  const end = normalize(endAziDeg);
  let sweep = end - start;
  if (sweep < 0) sweep += 360;
  const largeArc = sweep > 180 ? 1 : 0;

  const p0 = azimuthToCartesian(start, outerR, northOffsetDeg);
  const p1 = azimuthToCartesian(end, outerR, northOffsetDeg);

  if (innerR <= 0) {
    return `M 0 0 L ${p0.x} ${p0.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${p1.x} ${p1.y} Z`;
  }

  const q0 = azimuthToCartesian(end, innerR, northOffsetDeg);
  const q1 = azimuthToCartesian(start, innerR, northOffsetDeg);
  return [
    `M ${p0.x} ${p0.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${p1.x} ${p1.y}`,
    `L ${q0.x} ${q0.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${q1.x} ${q1.y}`,
    'Z',
  ].join(' ');
}

/** Project sun (azimuth, elevation) onto the compass. */
export function sunDotPosition(
  azimuthDeg: number,
  elevationDeg: number,
  northOffsetDeg = 0,
): Point {
  return azimuthToCartesian(azimuthDeg, elevationToRadius(elevationDeg), northOffsetDeg);
}

/** Normalize arbitrary degrees to [0, 360). */
export function normalizeAzimuth(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Compute the outer and inner radii for an elevation-clipped FOV wedge.
 * min_elevation (near horizon) clips the outer radius; max_elevation (near zenith) clips the inner.
 * Returns {outer: outerR, inner: 0} (full pie) when limits are absent or inverted.
 */
export function fovBandRadii(
  minElevDeg: number | undefined,
  maxElevDeg: number | undefined,
  outerR: number,
): { outer: number; inner: number } {
  if (minElevDeg !== undefined && maxElevDeg !== undefined && minElevDeg > maxElevDeg) {
    return { outer: outerR, inner: 0 };
  }
  const outer = minElevDeg !== undefined ? outerR * elevationToRadius(minElevDeg) : outerR;
  const inner = maxElevDeg !== undefined ? outerR * elevationToRadius(maxElevDeg) : 0;
  return { outer, inner };
}

/**
 * Map an elevation band [minElevDeg, maxElevDeg] onto a linear elevation axis
 * [axisMin, axisMax] (e.g. the "Sun today" chart's y-axis), returning the
 * band's normalized fractions { loFrac, hiFrac } where 0 = axisMin and
 * 1 = axisMax. Both fractions are clamped to [0, 1]. An undefined limit falls
 * back to the corresponding axis edge (min → 0, max → 1). Inverted limits
 * (min > max) fall back to the full axis {loFrac: 0, hiFrac: 1}, mirroring
 * `fovBandRadii`'s inverted-limit guard.
 */
export function elevationBandFraction(
  minElevDeg: number | undefined,
  maxElevDeg: number | undefined,
  axisMin: number,
  axisMax: number,
): { loFrac: number; hiFrac: number } {
  if (minElevDeg !== undefined && maxElevDeg !== undefined && minElevDeg > maxElevDeg) {
    return { loFrac: 0, hiFrac: 1 };
  }
  const span = axisMax - axisMin;
  const frac = (elev: number): number => Math.max(0, Math.min(1, (elev - axisMin) / span));
  return {
    loFrac: minElevDeg !== undefined ? frac(minElevDeg) : 0,
    hiFrac: maxElevDeg !== undefined ? frac(maxElevDeg) : 1,
  };
}

/**
 * Project rawStart/rawEnd onto the configured FOV envelope
 * [windowAzi − fovLeft, windowAzi + fovRight] (CW). Returns the absolute
 * (wedgeStart, wedgeEnd) bounds for the active sun wedge, always a subset of
 * the envelope. If either raw value lies outside the envelope it is clamped to
 * the nearest envelope edge. If both project to the same point (zero sweep),
 * falls back to the full envelope.
 *
 * Invariant enforced: the active sun arc is always a sub-arc of the FOV
 * envelope — issues #85 (N-wrap) and #89 (interior/disjoint pair from
 * elevation clipping) are both covered by this approach.
 */
export function clampActiveArcToFov(
  rawStart: number,
  rawEnd: number,
  windowAzi: number,
  fovLeft: number,
  fovRight: number,
): { wedgeStart: number; wedgeEnd: number } {
  const fovStart = (((windowAzi - fovLeft) % 360) + 360) % 360;
  const fovSweep = fovLeft + fovRight;
  // Project rawStart / rawEnd onto [0, fovSweep] offset from fovStart (CW).
  const offS = (((rawStart - fovStart) % 360) + 360) % 360;
  const offE = (((rawEnd - fovStart) % 360) + 360) % 360;
  // If outside the envelope (offset > fovSweep), snap to nearest edge (0 or fovSweep).
  const clampOffset = (off: number): number => {
    if (off <= fovSweep) return off;
    // off is in (fovSweep, 360). Distance to fovSweep edge vs wraparound to 0.
    return off - fovSweep < 360 - off ? fovSweep : 0;
  };
  const clampedS = clampOffset(offS);
  const clampedE = clampOffset(offE);
  // If both collapsed to the same offset, fall back to full envelope.
  if (clampedS === clampedE) {
    return {
      wedgeStart: fovStart,
      wedgeEnd: (((fovStart + fovSweep) % 360) + 360) % 360,
    };
  }
  const lo = Math.min(clampedS, clampedE);
  const hi = Math.max(clampedS, clampedE);
  return {
    wedgeStart: (((fovStart + lo) % 360) + 360) % 360,
    wedgeEnd: (((fovStart + hi) % 360) + 360) % 360,
  };
}

/**
 * Compute the azimuth bounds of the static FOV arc clipped by an elevation gate.
 *
 * Scans the day's sun samples, filters to those that are:
 *   (a) inside the configured FOV azimuth envelope
 *       [windowAzi − fovLeft, windowAzi + fovRight] (CW), and
 *   (b) strictly above `minElevDeg`.
 *
 * Returns the first and last (chronological) qualifying sample azimuths as
 * { wedgeStart, wedgeEnd }, or `null` when:
 *   - `minElevDeg === undefined` (no gate; caller falls back to raw envelope), or
 *   - no qualifying samples exist in the FOV.
 */
export function elevationGatedFovBounds(
  samples: Array<{ azimuth: number; elevation: number }>,
  windowAzi: number,
  fovLeft: number,
  fovRight: number,
  minElevDeg: number | undefined,
): { wedgeStart: number; wedgeEnd: number } | null {
  if (minElevDeg === undefined) return null;
  const fovStart = normalizeAzimuth(windowAzi - fovLeft);
  const fovSweep = fovLeft + fovRight;
  const filtered = samples.filter((s) => {
    const offset = (((s.azimuth - fovStart) % 360) + 360) % 360;
    return offset <= fovSweep && s.elevation > minElevDeg;
  });
  if (filtered.length === 0) return null;
  return {
    wedgeStart: filtered[0].azimuth,
    wedgeEnd: filtered[filtered.length - 1].azimuth,
  };
}

/**
 * Azimuth bounds of a single FOV run (a contiguous index range from
 * `findFovWindows`), narrowed to the samples that clear `minElevDeg`. Returns
 * the first and last qualifying sample azimuths as { wedgeStart, wedgeEnd }, or
 * null when no sample in the run clears the elevation gate.
 */
export function fovRunBounds(
  samples: Array<{ azimuth: number; elevation: number }>,
  startIdx: number,
  endIdx: number,
  minElevDeg: number | undefined,
): { wedgeStart: number; wedgeEnd: number } | null {
  const gate = minElevDeg ?? 0;
  let first = -1;
  let last = -1;
  for (let i = startIdx; i <= endIdx && i < samples.length; i++) {
    if (samples[i].elevation > gate) {
      if (first === -1) first = i;
      last = i;
    }
  }
  if (first === -1) return null;
  return { wedgeStart: samples[first].azimuth, wedgeEnd: samples[last].azimuth };
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Map a timestamp `t` (epoch ms) onto a fixed local-day x-coordinate.
 *
 * The domain is [dayStart, dayStart + 24h] and maps linearly onto [0, width].
 * Inputs outside that window are clamped so the result is always in [0, width].
 *
 * @param t        - The timestamp to map (ms since epoch).
 * @param dayStart - Local midnight of the target day (ms since epoch).
 * @param width    - Width of the SVG viewport in user units.
 */
export function dayFractionX(t: number, dayStart: number, width: number): number {
  const frac = (t - dayStart) / DAY_MS;
  return Math.max(0, Math.min(width, frac * width));
}

/** True when azimuth `x` lies on the CW arc from `start` to `end`. */
function azimuthInArc(x: number, start: number, end: number): boolean {
  const sweep = (((end - start) % 360) + 360) % 360;
  const delta = (((x - start) % 360) + 360) % 360;
  return delta <= sweep;
}

/** True when two CW azimuth arcs [s1,e1] and [s2,e2] overlap at all. */
export function arcsOverlap(s1: number, e1: number, s2: number, e2: number): boolean {
  return (
    azimuthInArc(s2, s1, e1) ||
    azimuthInArc(e2, s1, e1) ||
    azimuthInArc(s1, s2, e2) ||
    azimuthInArc(e1, s2, e2)
  );
}

/**
 * Vertical layout for the per-window FOV ribbon below the elevation plot.
 * Returns one {y,height} row per window (stacked top-to-bottom) plus the
 * ribbon's total height (top pad + rows + gaps + bottom pad).
 *
 * `rows[i].y = top + i*(rowH+gap)`, `rows[i].height = rowH`. The y values are
 * relative to whatever origin the caller passes as `top` (e.g. pass the
 * plot-block bottom plus a pad to place the ribbon below the plot).
 */
export function ribbonLayout(
  count: number,
  top: number,
  rowH: number,
  gap: number,
  bottom: number,
): { rows: Array<{ y: number; height: number }>; height: number } {
  if (count <= 0) return { rows: [], height: 0 };
  const rows = Array.from({ length: count }, (_, i) => ({
    y: top + i * (rowH + gap),
    height: rowH,
  }));
  const height = top + count * rowH + (count - 1) * gap + bottom;
  return { rows, height };
}

export interface ScheduleZones {
  /** Off-schedule spans as clamped fractions in [0,1], left-to-right. */
  offSchedule: Array<{ x0: number; x1: number }>;
  /** Drawable vertical-bar fractions: only bounds whose TRUE fraction lies
   *  strictly inside (0,1). A bound clamped to an edge yields no bar. */
  bars: number[];
}

/**
 * Map a schedule [start, end] onto today's [dayStart, dayStart+dayMs] x-domain,
 * returning the OFF-schedule spans (the parts to gray out) plus the drawable
 * start/end bar fractions.
 *
 * Fractions are `(t − dayStart) / dayMs`. A bound's TRUE fraction is computed
 * first (may be < 0 or > 1 when an offset/next-day datetime pushes it outside
 * today); off-schedule spans are then clamped to [0,1]. A bar is emitted only
 * when the true fraction is strictly inside (0,1) — a bound that clamps to an
 * edge contributes a gray span but no bar (there is no line to draw at the
 * very edge of the plot).
 *
 * BARS use the raw TRUE fraction `(t − dayStart)/dayMs`: a bound that lands
 * outside today (true frac ≤ 0 or ≥ 1 — a next-day-rolled end, or a start that
 * began yesterday) draws no vertical bar, only a gray span clamped to the edge.
 *
 * ZONE fractions resolve each bound to today's domain:
 *  - A START before today (frac < 0) clamps to the left edge 0 (the window was
 *    already open at midnight). A START after today (frac > 1) clamps to 1.
 *  - An END after today (frac > 1) is the integration's next-day-rolled midnight
 *    end: its clock time wraps back onto today (frac mod 1), making the window
 *    midnight-spanning. An END before today (frac < 0) clamps to 0.
 *
 * Window shapes (using resolved zone fractions s, e):
 *  - Normal (s ≤ e): off-schedule is the two edge bands [0, s] ∪ [e, 1].
 *  - Midnight-spanning (s > e — end < start, or end rolled to the next day):
 *    in-schedule wraps midnight, off-schedule is the single MIDDLE band [e, s].
 *  - Null start: open to the left — off-schedule is [e, 1], no left bar.
 *    Null end: symmetric ([0, s], no right bar). Both null: empty.
 */
export function scheduleZones(
  start: Date | null,
  end: Date | null,
  dayStartMs: number,
  dayMs: number,
): ScheduleZones {
  if (!start && !end) return { offSchedule: [], bars: [] };

  const trueFrac = (d: Date): number => (d.getTime() - dayStartMs) / dayMs;
  const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));
  // Resolve a START's zone fraction: clamp to the nearest edge if outside today.
  const startZone = (f: number): number => clamp01(f);
  // Resolve an END's zone fraction: a next-day-rolled end (f > 1) wraps to its
  // clock time on today; an end before today clamps to 0.
  const endZone = (f: number): number => (f > 1 ? f - Math.floor(f) : clamp01(f));
  // A bar is drawable only when its true fraction sits strictly inside (0,1).
  const barFor = (f: number): number[] => (f > 0 && f < 1 ? [f] : []);

  // Open-ended: only one bound configured.
  if (start && !end) {
    const sf = trueFrac(start);
    return { offSchedule: [{ x0: 0, x1: startZone(sf) }], bars: barFor(sf) };
  }
  if (!start && end) {
    const ef = trueFrac(end);
    return { offSchedule: [{ x0: endZone(ef), x1: 1 }], bars: barFor(ef) };
  }

  // Both bounds present.
  const sf = trueFrac(start!);
  const ef = trueFrac(end!);
  const s = startZone(sf);
  const e = endZone(ef);
  const bars = [...barFor(sf), ...barFor(ef)];

  if (s > e) {
    // Midnight-spanning: in-schedule wraps midnight, off-schedule is the middle.
    return { offSchedule: [{ x0: e, x1: s }], bars };
  }

  // Normal in-day window: off-schedule is the two edge bands.
  const offSchedule: Array<{ x0: number; x1: number }> = [];
  if (s > 0) offSchedule.push({ x0: 0, x1: s });
  if (e < 1) offSchedule.push({ x0: e, x1: 1 });
  return { offSchedule, bars };
}

/**
 * Aggregate a map of per-cover actual positions into a single value by taking
 * the arithmetic mean of all non-null entries. Returns null when the map is
 * empty or every value is null (so callers can gracefully omit the actual
 * wedge). A single 0 yields 0, not null.
 */
export function aggregateActualPosition(map: Record<string, number | null>): number | null {
  const vals = Object.values(map).filter((v): v is number => typeof v === 'number');
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

/**
 * Outer radius of a cover-fill wedge for a given position (0–100) and cover
 * type, clamped to the FOV's outer radius. Blinds/tilts close from the rim
 * inward (fraction = 1 − pos/100); awnings extend from the centre outward
 * (fraction = pos/100). The result is `min(outerR × fraction, fovOuterR)` —
 * callers decide whether the wedge draws by comparing against the inner radius.
 */
export function coverWedgeOuterRadius(
  pos: number,
  coverType: string,
  outerR: number,
  fovOuterR: number,
): number {
  const fraction = coverType === 'cover_awning' ? pos / 100 : 1 - pos / 100;
  return Math.min(outerR * fraction, fovOuterR);
}

/**
 * Decide whether the cover compass should split its single wedge into a
 * distinct solar-target wedge plus a held/actual ring during a manual override.
 *
 * During manual override the integration's `Cover_Position` sensor STATE returns
 * the held (manually-set) position, so the card's target wedge and actual ring
 * collapse onto the same value. The integration still publishes the solar
 * would-be target as the sensor's `raw_calculated_position` attribute. When that
 * value is present, finite, and differs from the held position, the card should
 * draw the target wedge at the solar value instead of the held state.
 *
 * Returns the solar target to use as the target wedge position when divergence
 * applies, or `null` to keep current behavior (single wedge at the held state).
 * Gating on `held` differing from `rawCalc` guards the integration's `0` default
 * outside the active time window (which would otherwise read as a phantom
 * divergence whenever the held position is also 0).
 */
export function overrideDivergenceTarget(
  overrideActive: boolean,
  rawCalc: number | null | undefined,
  held: number | null,
): number | null {
  if (!overrideActive) return null;
  if (rawCalc === null || rawCalc === undefined || !Number.isFinite(rawCalc)) return null;
  if (rawCalc === held) return null;
  return rawCalc;
}

/**
 * Horizontal offset (px) of the moon-phase mask's shadow circle for a given
 * illuminated `phase` (0 = new, 0.5 = full, 1 = new again) and disc radius `r`.
 *
 * The phase mask paints a white lit disc with a black shadow circle of the same
 * radius offset by this dx; the unmasked crescent/gibbous sliver is what shows.
 * A waxing phase (< 0.5) shifts the shadow left (negative); a waning phase
 * (≥ 0.5) shifts it right (positive). New and full moons return 0.
 */
export function moonPhaseShadowDx(phase: number, r: number): number {
  return phase < 0.5 ? -4 * r * phase : 4 * r * (1 - phase);
}

/**
 * Closed triangular arrowhead SVG path "M tip L corner L corner Z" with its tip
 * at (tipX, tipY) pointing along `bearingDeg` (0 = North/up, clockwise, matching
 * `azimuthToCartesian`). The base sits `length` back from the tip along the
 * reverse bearing, with the two corners straddling the centerline by ±halfWidth.
 */
export function arrowheadPath(
  tipX: number,
  tipY: number,
  bearingDeg: number,
  length: number,
  halfWidth: number,
): string {
  // Unit forward vector along the bearing; perpendicular for the base corners.
  const fwd = azimuthToCartesian(bearingDeg, 1);
  const perpX = -fwd.y;
  const perpY = fwd.x;
  const baseX = tipX - fwd.x * length;
  const baseY = tipY - fwd.y * length;
  const c1x = baseX + perpX * halfWidth;
  const c1y = baseY + perpY * halfWidth;
  const c2x = baseX - perpX * halfWidth;
  const c2y = baseY - perpY * halfWidth;
  return `M ${tipX} ${tipY} L ${c1x} ${c1y} L ${c2x} ${c2y} Z`;
}

/**
 * Convert the integration's blind_spot_range (FOV-left-relative offsets,
 * [fov_left − blind_spot_right, fov_left − blind_spot_left]) into absolute
 * compass bearings [startAzi, endAzi] suitable for wedgePath.
 */
export function blindSpotBearings(
  windowAziDeg: number,
  range: readonly [number, number],
): [number, number] {
  return [normalizeAzimuth(windowAziDeg - range[1]), normalizeAzimuth(windowAziDeg - range[0])];
}
