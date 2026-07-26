import type { HomeAssistant } from 'custom-card-helpers';

import type { CoverPositionAttributes, DiscoveredEntities } from '../types';
import { positionAxisInverted } from './axes';
import { aggregateActualPosition, overrideDivergenceTarget } from './geometry';

/**
 * Shared cover-position readers for the COVERS bar and the sky compass. During a
 * manual override the integration's `Cover_Position` sensor STATE returns the
 * held (manually-set) position, while the solar would-be target lives on the
 * sensor's `raw_calculated_position` attribute. These helpers give both
 * components one source of truth for held / actual / solar values and the
 * override-divergence decision (issue #158).
 *
 * Frame invariant (issue #234): **the card renders in the logical
 * (HA-convention) frame, and any value it reads from a cover-frame source is
 * normalized here at the read, never at the render.** On an `inverse_state`
 * install the integration dispatches `100 − logical` to the physical cover, so
 * the cover entity's `current_position` and the sensor's `actual_positions` are
 * the complement of `linear_position` / `raw_calculated_position`. Every
 * actual-side read therefore goes through {@link coverLogicalActuals} or
 * {@link logicalCoverPosition}; nothing downstream un-inverts anything.
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
