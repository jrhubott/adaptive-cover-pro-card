/**
 * Classification of the sky-compass / elevation-chart sun dot.
 *
 * `night` is below-horizon; the three above-horizon states mirror the
 * integration's `SunState` enum (outside_fov < in_fov_not_valid < hitting,
 * in increasing "activity").
 */
export type SunDotState = 'night' | 'outside_fov' | 'in_fov_not_valid' | 'hitting';

/** The three above-horizon enum values the integration may report on
 *  `decision_trace.sun_state`. `night` is card-only (derived from elevation). */
const KNOWN_SUN_STATES = new Set<SunDotState>(['outside_fov', 'in_fov_not_valid', 'hitting']);

/** State -> SVG/legend class names, shared by sky-compass and elevation-chart so
 *  the two components never drift. The `sun ` prefix matches both component CSS. */
export const SUN_DOT_CLASS: Record<SunDotState, string> = {
  night: 'sun night',
  hitting: 'sun valid',
  in_fov_not_valid: 'sun in-fov',
  outside_fov: 'sun up',
};

/**
 * Authoritative-first 3-way (4 incl. night) sun-dot classifier.
 *
 * Priority:
 *   1. `belowHorizon` -> 'night'.
 *   2. `sunState` (the new integration `decision_trace.sun_state` attr) when it
 *      is a known enum value -> map straight through (authoritative).
 *   3. FALLBACK (integration derivation, for older builds without `sun_state`):
 *      `directSunValid` -> 'hitting'; else `inFov` -> 'in_fov_not_valid';
 *      else 'outside_fov'.
 *
 * `inFov` MUST be the azimuth-only `sun_position.in_fov` value — NOT
 * `decision_trace.in_field_of_view` (which is full validity on the integration).
 */
export function sunDotState(input: {
  belowHorizon: boolean;
  sunState?: string | null;
  directSunValid: boolean;
  inFov: boolean;
}): SunDotState {
  if (input.belowHorizon) return 'night';
  if (input.sunState && KNOWN_SUN_STATES.has(input.sunState as SunDotState)) {
    return input.sunState as SunDotState;
  }
  if (input.directSunValid) return 'hitting';
  if (input.inFov) return 'in_fov_not_valid';
  return 'outside_fov';
}
