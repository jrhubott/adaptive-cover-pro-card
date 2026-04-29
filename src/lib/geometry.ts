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
