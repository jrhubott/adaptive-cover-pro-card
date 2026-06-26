/**
 * Pure view-model for the Solar Calculation panel. Turns the raw
 * `solar_calculation` sensor attributes into ordered input → intermediate →
 * output field groups, formats each value by its unit-suffix convention, and
 * marks which fields are "curated" (shown by default, with a friendly label)
 * vs. raw extras (revealed by "show all", shown by their raw key).
 *
 * Kept free of Lit/DOM so the partitioning + formatting are unit-testable.
 */

/** A single key/value row ready to render. */
export interface SolarField {
  /** Raw attribute key (e.g. `effective_distance_m`). */
  key: string;
  /** Formatted, display-ready value (e.g. `1.840 m`). */
  value: string;
  /** Curated fields get a friendly i18n label; extras show their raw key. */
  curated: boolean;
}

/** One geometry axis (the primary position axis, or venetian's tilt axis). */
export interface SolarAxisView {
  /** `status` reason string, when present. */
  status?: string;
  /** True when `position_pct` is a number (there is a solar target). */
  hasTarget: boolean;
  inputs: SolarField[];
  intermediates: SolarField[];
  output: SolarField[];
}

export interface SolarCalcView {
  coverType: string;
  /** Primary (position / lift) axis. */
  position: SolarAxisView;
  /** Tilt axis — present only for `cover_venetian`. */
  tilt?: SolarAxisView;
}

const INPUT_KEYS = ['sol_elev_deg', 'gamma_deg'];
const OUTPUT_KEYS = ['position_pct'];
/** Keys handled outside the intermediate list (header / discriminator / nested). */
const RESERVED_KEYS = new Set([...INPUT_KEYS, ...OUTPUT_KEYS, 'status', 'cover_type', 'tilt']);

/**
 * Decision-relevant intermediates surfaced in the curated (default) view, per
 * cover type. The venetian tilt axis reuses the `cover_tilt` set. Order is the
 * display order; missing keys are skipped.
 */
const CURATED_INTERMEDIATES: Record<string, string[]> = {
  cover_blind: ['effective_distance_m', 'adjusted_height_m', 'safety_margin'],
  cover_awning: ['awn_angle_deg', 'vertical_position_m', 'length_m'],
  cover_tilt: ['slat_angle_raw_deg', 'tilt_mode', 'max_degrees'],
};

/** Keys that get a friendly i18n label (`solar.field.<key>`); all others show raw. */
export const CURATED_LABEL_KEYS = new Set<string>([
  ...INPUT_KEYS,
  ...OUTPUT_KEYS,
  ...Object.values(CURATED_INTERMEDIATES).flat(),
]);

/**
 * Format a solar-calc value by its key's unit-suffix convention:
 *   `*_pct` / `position_pct` → integer %   `_deg` → 1 dp °   `_m` → 3 dp m
 *   `_rad` → 3 dp rad        other numbers → 3 dp
 *   boolean → ✓ / ✗          string → as-is
 *   array → comma-joined (or "—" when empty)   null/undefined → "—"
 */
export function formatSolarValue(key: string, value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? '✓' : '✗';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  if (typeof value === 'number') {
    if (Number.isNaN(value)) return '—';
    if (key === 'position_pct' || key.endsWith('_pct')) return `${Math.round(value)}%`;
    if (key.endsWith('_deg')) return `${value.toFixed(1)}°`;
    if (key.endsWith('_m')) return `${value.toFixed(3)} m`;
    if (key.endsWith('_rad')) return `${value.toFixed(3)} rad`;
    return value.toFixed(3);
  }
  return String(value);
}

function buildFields(
  attrs: Record<string, unknown>,
  keys: string[],
  presentOnly: boolean,
): SolarField[] {
  const out: SolarField[] = [];
  for (const key of keys) {
    if (presentOnly && !(key in attrs)) continue;
    out.push({
      key,
      value: formatSolarValue(key, attrs[key]),
      curated: CURATED_LABEL_KEYS.has(key),
    });
  }
  return out;
}

/** Build one axis (position or tilt) from a flat attribute object. */
function buildAxis(
  attrs: Record<string, unknown>,
  coverType: string,
  showAll: boolean,
): SolarAxisView {
  const inputs = buildFields(attrs, INPUT_KEYS, true);
  const output = buildFields(attrs, OUTPUT_KEYS, true);

  let intermediateKeys: string[];
  if (showAll) {
    const curated = CURATED_INTERMEDIATES[coverType] ?? [];
    const extras = Object.keys(attrs).filter((k) => !RESERVED_KEYS.has(k) && !curated.includes(k));
    // Curated keys first (friendly labels), then the remaining raw extras.
    intermediateKeys = [...curated.filter((k) => k in attrs), ...extras];
  } else {
    intermediateKeys = (CURATED_INTERMEDIATES[coverType] ?? []).filter((k) => k in attrs);
  }
  const intermediates = buildFields(attrs, intermediateKeys, true);

  const pos = attrs['position_pct'];
  return {
    status: typeof attrs['status'] === 'string' ? (attrs['status'] as string) : undefined,
    hasTarget: typeof pos === 'number' && !Number.isNaN(pos),
    inputs,
    intermediates,
    output,
  };
}

/**
 * Build the full view from raw `solar_calculation` attributes. `cover_venetian`
 * yields a second `tilt` axis from the nested `tilt` sub-object.
 */
export function buildSolarCalcView(
  attrs: Record<string, unknown>,
  showAll: boolean,
): SolarCalcView {
  const coverType = typeof attrs['cover_type'] === 'string' ? (attrs['cover_type'] as string) : '';
  const position = buildAxis(attrs, coverType, showAll);

  let tilt: SolarAxisView | undefined;
  if (coverType === 'cover_venetian') {
    const tiltAttrs = attrs['tilt'];
    if (tiltAttrs && typeof tiltAttrs === 'object') {
      tilt = buildAxis(tiltAttrs as Record<string, unknown>, 'cover_tilt', showAll);
    }
  }

  return { coverType, position, tilt };
}

/** Count of intermediate fields revealed only by "show all", for the toggle label. */
export function hiddenFieldCount(attrs: Record<string, unknown>): number {
  const full = buildSolarCalcView(attrs, true);
  const curated = buildSolarCalcView(attrs, false);
  const count = (v: SolarCalcView): number =>
    v.position.intermediates.length + (v.tilt?.intermediates.length ?? 0);
  return Math.max(0, count(full) - count(curated));
}
