import type { HomeAssistant } from 'custom-card-helpers';

import type { DiscoveredEntities } from '../types';
import { aggregateActualPosition, overrideDivergenceTarget } from './geometry';

/**
 * Shared cover-position readers for the COVERS bar and the sky compass. During a
 * manual override the integration's `Cover_Position` sensor STATE returns the
 * held (manually-set) position, while the solar would-be target lives on the
 * sensor's `raw_calculated_position` attribute. These helpers give both
 * components one source of truth for held / actual / solar values and the
 * override-divergence decision (issue #158).
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

/** Pre-interpolation logical position — the sensor's `linear_position`
 *  attribute (issue #219). Null when absent or non-numeric: older
 *  integrations, or interpolation not configured for this axis. */
export function coverLinearPosition(hass: HomeAssistant, d: DiscoveredEntities): number | null {
  const id = d.entities.target_position_sensor;
  if (!id) return null;
  const attrs = hass.states[id]?.attributes as { linear_position?: unknown } | undefined;
  const val = attrs?.linear_position;
  return typeof val === 'number' && Number.isFinite(val) ? val : null;
}

/** Held position — the value to display as the cover's held/target position.
 *  Prefers the pre-interpolation `linear_position` attribute (issue #219)
 *  when present; falls back to the `Cover_Position` sensor STATE (today's
 *  behavior — and the value the two coincide at when interpolation is off,
 *  or on any integration that doesn't yet expose `linear_position`). Null
 *  when missing/NaN. */
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

/** Mean of the live per-cover positions on the sensor's `actual_positions`
 *  attribute. Null when absent, empty, or all-null. */
export function coverActualPosition(hass: HomeAssistant, d: DiscoveredEntities): number | null {
  const id = d.entities.target_position_sensor;
  if (!id) return null;
  const attrs = hass.states[id]?.attributes as
    | { actual_positions?: Record<string, number | null> }
    | undefined;
  if (!attrs?.actual_positions) return null;
  return aggregateActualPosition(attrs.actual_positions);
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
