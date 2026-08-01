import type { HomeAssistant } from 'custom-card-helpers';

import type { CoverPositionAttributes, DiscoveredEntities } from '../types';
import { positionAxisInverted, type ResolvedAxis } from './axes';
import { aggregateActualPosition, overrideDivergenceTarget } from './geometry';

/**
 * Shared cover-position readers for the COVERS bar and the sky compass. During a
 * manual override the integration's `Cover_Position` sensor STATE returns the
 * held (manually-set) position, while the solar would-be target lives on the
 * sensor's `raw_calculated_position` attribute. These helpers give both
 * components one source of truth for held / actual / solar values and the
 * override-divergence decision (issue #158).
 *
 * Frame invariant (issues #234, #236): **the card renders in the logical
 * (HA-convention) frame, and any value it reads from a cover-frame source is
 * normalized here at the read, never at the render.** This holds for every
 * axis, not just position: on an `inverse_state` install the integration
 * dispatches `100 − logical` to the physical cover, so the cover entity's
 * `current_position` and the sensor's `actual_positions` are the complement of
 * `linear_position` / `raw_calculated_position`, and on an `inverse_tilt`
 * install the same is true of the slat axis's `current_tilt_position` against
 * the `Cover_Tilt` target sensor. Every actual-side read therefore goes through
 * {@link coverLogicalActuals}, {@link logicalCoverPosition} or
 * {@link logicalAxisValue}; nothing downstream un-inverts anything.
 */

/** Raw `Cover_Position` sensor STATE — the interpolated/motor value actually
 *  commanded. Exported so components can surface it as a secondary "motor:"
 *  detail when it diverges from the linear-preferred {@link coverHeldPosition}. */
export function coverMotorPosition(hass: HomeAssistant, d: DiscoveredEntities): number | null {
  const id = d.entities.target_position_sensor;
  if (!id) return null;
  const val = parseFloat(hass.states[id]?.state ?? '');
  return Number.isNaN(val) ? null : val;
}

/** The sensor's `linear_position` attribute — the position in the **logical**
 *  frame: pre-interpolation *and* pre-inversion (issues #219, #234). Null when
 *  absent or non-numeric: older integrations, or interpolation not configured
 *  for this axis. */
export function coverLinearPosition(hass: HomeAssistant, d: DiscoveredEntities): number | null {
  const id = d.entities.target_position_sensor;
  if (!id) return null;
  const attrs = hass.states[id]?.attributes as { linear_position?: unknown } | undefined;
  const val = attrs?.linear_position;
  return typeof val === 'number' && Number.isFinite(val) ? val : null;
}

/** Held position — the value to display as the cover's held/target position,
 *  in the logical frame. Prefers the `linear_position` attribute (issue #219)
 *  when present; falls back to the `Cover_Position` sensor STATE, which is the
 *  dispatched value and therefore only coincides with `linear_position` when
 *  neither interpolation nor inversion is in play. Null when missing/NaN.
 *
 *  Deliberately NOT frame-normalized (issue #234): `linear_position` is already
 *  logical, and user commands are interpreted as logical, so pre-inverting here
 *  would double-invert. The *actual* side is what needs normalizing — see
 *  {@link coverLogicalActuals} and {@link logicalCoverPosition}. */
export function coverHeldPosition(hass: HomeAssistant, d: DiscoveredEntities): number | null {
  return coverLinearPosition(hass, d) ?? coverMotorPosition(hass, d);
}

/** The motor value to show as a secondary "motor: X%" detail, or null when
 *  there's nothing to disclose — `linear_position` absent/invalid (older
 *  integration, or interpolation off) or equal to the motor value (issue
 *  #219). Only ever non-null when interpolation is actively bending the
 *  configured value away from the raw command. */
export function coverMotorDivergence(hass: HomeAssistant, d: DiscoveredEntities): number | null {
  const linear = coverLinearPosition(hass, d);
  const motor = coverMotorPosition(hass, d);
  if (linear === null || motor === null || linear === motor) return null;
  // On an inverse_state install the sensor STATE is the *dispatched* value, so
  // it differs from `linear_position` by the inversion alone. That is the frame,
  // not interpolation bending the value, and disclosing `100 − linear` as a
  // "motor" detail would be pure noise (issue #234).
  if (positionAxisInverted(d) && motor === 100 - linear) return null;
  return motor;
}

/** Solar would-be target — the sensor's `raw_calculated_position` attribute.
 *  Null when the attribute is absent or non-finite. */
export function coverSolarTarget(hass: HomeAssistant, d: DiscoveredEntities): number | null {
  const id = d.entities.target_position_sensor;
  if (!id) return null;
  const attrs = hass.states[id]?.attributes as { raw_calculated_position?: number } | undefined;
  const val = attrs?.raw_calculated_position;
  return typeof val === 'number' && Number.isFinite(val) ? val : null;
}

/**
 * Per-cover **command** targets in the logical frame — the position the
 * integration last resolved and dispatched to each managed cover, read from the
 * `position_verification` sensor's `per_entity` diagnostics map.
 *
 * This is the only per-cover target the integration publishes, and it is the
 * only one that is meaningful on a cover whose dispatched value is a remap of
 * the entry's abstract target: a day/night shade in the `dual_entity` control
 * model folds the fabric blend into its middle rail's absolute position, so the
 * entry-level target sits on a different scale than that rail's own travel.
 *
 * Note this is the last *commanded* position, not the solar/pipeline target —
 * they diverge mid-move and under a manual override.
 *
 * Values arrive in the cover frame, like `actual_positions`, so they take the
 * same `inverted` un-flip. One caveat for the `dual_entity` middle rail: the
 * integration tracks separately whether inversion was actually applied to the
 * value it dispatched there, and the card cannot see that flag — so on an
 * inverse-state entry that rail's tick may be mirrored. Inert on every
 * non-inverse install.
 *
 * `{}` when the sensor or the attribute is missing (older integration).
 */
export function coverCommandTargets(
  hass: HomeAssistant,
  d: DiscoveredEntities,
): Record<string, number> {
  const id = d.entities.position_verification_sensor;
  if (!id) return {};
  const perEntity = hass.states[id]?.attributes?.per_entity as
    | Record<string, { target?: number | null }>
    | undefined;
  if (!perEntity || typeof perEntity !== 'object') return {};
  const inverted = positionAxisInverted(d);
  // Non-numeric entries are omitted rather than mapped to null: an absent key
  // and a null-valued key would mean the same thing to every caller, and the
  // nullable type only invited handling for a case that cannot occur.
  const out: Record<string, number> = {};
  for (const [eid, diag] of Object.entries(perEntity)) {
    const v = diag?.target;
    if (typeof v !== 'number' || !Number.isFinite(v)) continue;
    out[eid] = inverted ? 100 - v : v;
  }
  return out;
}

/**
 * Live per-cover positions in the **logical** frame — the map every actual-side
 * surface renders from (covers bar fills, compass actual ring). Resolution
 * order (issue #234):
 *
 * 1. the sensor's `linear_actual_positions`, published already-normalized;
 * 2. `actual_positions` un-inverted with the position axis's `inverted` flag,
 *    for an inverse install on an integration that predates (1);
 * 3. `actual_positions` verbatim — the identity on every non-inverse install,
 *    which is why this is inert for everyone else.
 *
 * `{}` when the sensor or the attribute is missing.
 */
export function coverLogicalActuals(
  hass: HomeAssistant,
  d: DiscoveredEntities,
): Record<string, number | null> {
  const id = d.entities.target_position_sensor;
  if (!id) return {};
  const attrs = hass.states[id]?.attributes as Partial<CoverPositionAttributes> | undefined;
  const linear = attrs?.linear_actual_positions;
  if (linear && typeof linear === 'object') return linear;
  const actual = attrs?.actual_positions;
  if (!actual) return {};
  if (!positionAxisInverted(d)) return actual;
  return Object.fromEntries(
    Object.entries(actual).map(([k, v]) => [k, typeof v === 'number' ? 100 - v : null]),
  );
}

/**
 * One cover entity's **live** position in the logical frame — the raw
 * `current_position` attribute, un-inverted when the position axis is inverted
 * (issue #234). Reads the entity rather than the sensor snapshot so the tile
 * stays live mid-move. Null when the cover, the attribute, or a numeric value
 * is missing.
 */
export function logicalCoverPosition(
  hass: HomeAssistant,
  d: DiscoveredEntities,
  cover: string | undefined,
): number | null {
  if (!cover) return null;
  const v = hass.states[cover]?.attributes?.current_position;
  if (typeof v !== 'number' || Number.isNaN(v)) return null;
  return positionAxisInverted(d) ? 100 - v : v;
}

/**
 * One cover entity's live value for `axis`, in the logical frame — the axis's
 * own `state_attr`, un-inverted when the integration reports that axis's
 * `inverted` flag (issues #234, #236). Mirrors the integration's
 * `inverse_state()`, which is `100 − v` for every axis regardless of the
 * declared range. Inert on every non-inverse install and on the synthesized
 * fallback axes, which always carry `inverted: false`.
 *
 * Null when the cover, the axis's state attribute, or a finite numeric value
 * is missing — a valid `0` is never collapsed to null.
 */
export function logicalAxisValue(
  hass: HomeAssistant,
  axis: ResolvedAxis,
  cover: string | undefined,
): number | null {
  if (!cover || !axis.stateAttr) return null;
  const v = hass.states[cover]?.attributes?.[axis.stateAttr];
  if (typeof v !== 'number' || Number.isNaN(v)) return null;
  return axis.inverted ? 100 - v : v;
}

/** Mean of the live per-cover positions, in the logical frame. Null when
 *  absent, empty, or all-null. See {@link coverLogicalActuals}. */
export function coverActualPosition(hass: HomeAssistant, d: DiscoveredEntities): number | null {
  return aggregateActualPosition(coverLogicalActuals(hass, d));
}

/** True when the discovered manual-override binary sensor is `on`. */
export function manualOverrideActive(hass: HomeAssistant, d: DiscoveredEntities): boolean {
  const id = d.entities.manual_override_binary;
  if (!id) return false;
  return hass.states[id]?.state === 'on';
}

/** True when a manual override is active AND the solar would-be target diverges
 *  from the held position (so the bar/compass should split target vs actual). */
export function isOverrideDivergence(hass: HomeAssistant, d: DiscoveredEntities): boolean {
  return (
    overrideDivergenceTarget(
      manualOverrideActive(hass, d),
      coverSolarTarget(hass, d),
      coverHeldPosition(hass, d),
    ) !== null
  );
}

/** The value to label and mark as "Target": the solar would-be target during a
 *  diverging manual override, else the held position (the sensor state). */
export function displayTarget(hass: HomeAssistant, d: DiscoveredEntities): number | null {
  const held = coverHeldPosition(hass, d);
  return (
    overrideDivergenceTarget(manualOverrideActive(hass, d), coverSolarTarget(hass, d), held) ?? held
  );
}
