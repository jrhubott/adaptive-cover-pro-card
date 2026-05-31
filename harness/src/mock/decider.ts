import { HANDLER_ORDER, type HandlerName } from '../../../src/const';
import type { DecisionStep, DecisionTraceAttributes } from '../../../src/types';
import { azimuthInFov } from '../../../src/lib/sun-model';
import type { HarnessEntry } from '../types';

export interface DecisionInput {
  entry: HarnessEntry;
  sunAzimuth: number;
  sunElevation: number;
  /** Used by the custom_position handler — pick a slot that's enabled. */
  nowMs: number;
}

export interface DecisionResult {
  winner: HandlerName | string;
  position: number;
  trace: DecisionStep[];
  reason: string;
  attrs: Omit<DecisionTraceAttributes, 'trace' | 'reason'>;
}

/**
 * Mini pipeline. Iterates HANDLER_ORDER and returns the first matching handler.
 * This is a *visualization* mock — not an attempt to reproduce the integration
 * exactly. Position numbers and reason strings are reasonable approximations.
 */
export function decide(input: DecisionInput): DecisionResult {
  const { entry, sunAzimuth, sunElevation } = input;
  const f = entry.flags;
  const trace: DecisionStep[] = [];
  let winner: HandlerName | string = 'default';
  let position = f.default_position;
  let reason = `Default position ${f.default_position}%`;

  const inFov = azimuthInFov(sunAzimuth, entry.window_azimuth, entry.fov_left, entry.fov_right);
  const elevationValid =
    (entry.min_elevation === undefined || sunElevation >= entry.min_elevation) &&
    (entry.max_elevation === undefined || sunElevation <= entry.max_elevation) &&
    sunElevation > 0;
  const inBlindSpot = (() => {
    if (!entry.blind_spot_range) return false;
    const [left, right] = entry.blind_spot_range;
    return azimuthInFov(sunAzimuth, entry.window_azimuth, -left, right);
  })();
  const directSunValid = inFov && elevationValid && !inBlindSpot;
  const enabledHandlers: HandlerName[] = [];

  let matched = false;
  for (const handler of HANDLER_ORDER) {
    const evalResult = evalHandler(handler, input, { inFov, elevationValid, directSunValid });
    if (evalResult.enabled) enabledHandlers.push(handler);
    trace.push({
      handler,
      matched: !matched && evalResult.matches,
      reason: evalResult.reason,
      position: evalResult.position,
    });
    if (!matched && evalResult.matches) {
      matched = true;
      winner = handler;
      position = evalResult.position ?? f.default_position;
      reason = evalResult.reason;
    }
  }

  const attrs: DecisionResult['attrs'] = {
    enabled_handlers: enabledHandlers,
    bypass_auto_control: !f.automatic_control && f.integration_enabled,
    default_position: f.default_position,
    is_sunset_active: f.is_sunset_active,
    in_time_window: f.in_time_window,
    sun_azimuth: sunAzimuth,
    sun_elevation: sunElevation,
    gamma: gammaFor(sunAzimuth, entry.window_azimuth),
    in_field_of_view: inFov,
    elevation_valid: elevationValid,
    in_blind_spot: inBlindSpot,
    sunset_window_active: f.is_sunset_active,
    direct_sun_valid: directSunValid,
    custom_position_active_slot: winner === 'custom_position' ? activeSlot(entry) : undefined,
    custom_position_minimum_mode:
      winner === 'custom_position' ? activeSlotMinMode(entry) : undefined,
    custom_position_active_slot_name:
      winner === 'custom_position' ? activeSlotName(entry) : undefined,
    custom_position_slots: entry.slots.map((s) => ({
      slot: s.slot,
      enabled: s.enabled,
      sensor: `sensor.custom_${entry.entry_id}_slot${s.slot}`,
      sensor_name: s.name,
      position: s.position,
      priority: s.priority,
      min_mode: s.min_mode,
    })),
  };

  return { winner, position, trace, reason, attrs };
}

interface HandlerEval {
  enabled: boolean;
  matches: boolean;
  position: number | null;
  reason: string;
}

interface DerivedConditions {
  inFov: boolean;
  elevationValid: boolean;
  directSunValid: boolean;
}

function evalHandler(
  handler: HandlerName,
  input: DecisionInput,
  c: DerivedConditions,
): HandlerEval {
  const { entry, sunElevation } = input;
  const f = entry.flags;

  if (!f.integration_enabled) {
    return { enabled: false, matches: false, position: null, reason: 'integration disabled' };
  }

  switch (handler) {
    case 'force':
      return {
        enabled: true,
        matches: f.force_override_triggers > 0,
        position: 0,
        reason:
          f.force_override_triggers > 0
            ? `Force override (${f.force_override_triggers} triggers)`
            : 'no force triggers active',
      };
    case 'weather':
      return {
        enabled: true,
        matches: false,
        position: null,
        reason: 'no weather alert',
      };
    case 'manual':
      return {
        enabled: true,
        matches: f.manual_override,
        position: entry.target_position,
        reason: f.manual_override
          ? `Manual override active — holding at ${entry.target_position}%`
          : 'no manual override',
      };
    case 'custom_position': {
      const slot = entry.slots.find((s) => s.enabled);
      const matches = !!slot && f.automatic_control;
      return {
        enabled: entry.slots.some((s) => s.enabled),
        matches,
        position: slot?.position ?? null,
        reason: matches
          ? `Custom slot ${slot!.slot} (${slot!.name}) at ${slot!.position}%`
          : 'no enabled custom slot',
      };
    }
    case 'motion':
      return {
        enabled: true,
        matches:
          f.automatic_control &&
          (f.motion_status === 'motion_detected' || f.motion_status === 'timeout_pending'),
        position: 100,
        reason:
          f.motion_status === 'motion_detected'
            ? 'Motion detected — opening'
            : f.motion_status === 'timeout_pending'
              ? 'Motion timeout pending'
              : 'no motion',
      };
    case 'cloud':
      return { enabled: true, matches: false, position: null, reason: 'clear sky' };
    case 'climate':
      return {
        enabled: true,
        matches: f.automatic_control && f.climate_strategy === 'winter_mode',
        position: 100,
        reason:
          f.climate_strategy === 'winter_mode'
            ? 'Winter mode — let sun in'
            : `Climate: ${f.climate_strategy}`,
      };
    case 'glare_zone':
      return {
        enabled: true,
        matches: f.automatic_control && f.glare_active,
        position: 30,
        reason: f.glare_active ? 'Glare zone active' : 'not in glare zone',
      };
    case 'solar': {
      const matches = f.automatic_control && c.directSunValid;
      // Linear-ish position: full close at high elevation in FOV, partial near edges.
      const closeness = Math.max(0, Math.min(1, sunElevation / 60));
      const calculatedPosition = Math.round(80 - closeness * 60);
      return {
        enabled: true,
        matches,
        position: matches ? calculatedPosition : null,
        reason: matches
          ? `Solar tracking — calculated ${calculatedPosition}%`
          : !c.inFov
            ? 'sun outside FOV'
            : !c.elevationValid
              ? 'elevation outside threshold'
              : 'sun not above horizon',
      };
    }
    case 'default':
      return {
        enabled: true,
        matches: true,
        position: f.default_position,
        reason: `Default position ${f.default_position}%`,
      };
    case 'floor_clamp':
      return { enabled: false, matches: false, position: null, reason: 'no floor' };
  }
}

function gammaFor(sunAzimuth: number, windowAzimuth: number): number {
  let g = sunAzimuth - windowAzimuth;
  while (g > 180) g -= 360;
  while (g < -180) g += 360;
  return g;
}

function activeSlot(entry: HarnessEntry): 1 | 2 | 3 | 4 | undefined {
  const s = entry.slots.find((x) => x.enabled);
  return s?.slot;
}

function activeSlotName(entry: HarnessEntry): string | undefined {
  return entry.slots.find((x) => x.enabled)?.name;
}

function activeSlotMinMode(entry: HarnessEntry): boolean | undefined {
  return entry.slots.find((x) => x.enabled)?.min_mode;
}

/**
 * Build a synthetic trace+attrs for a scripted winner. Iterates HANDLER_ORDER
 * marking everything before the target as "didn't match" with stub reasons,
 * and everything after as "skipped because <winner> already matched".
 */
export function scriptedDecision(
  winner: HandlerName,
  entry: HarnessEntry,
  sunAzimuth: number,
  sunElevation: number,
): DecisionResult {
  const trace: DecisionStep[] = HANDLER_ORDER.map((h) => ({
    handler: h,
    matched: h === winner,
    reason: h === winner ? `Scripted: ${h}` : 'skipped',
    position: h === winner ? entry.target_position : null,
  }));
  const f = entry.flags;
  // A custom_position slot that sets an exact position (min_mode false) bypasses
  // automatic control, mirroring the integration's `bypass_auto_control`. This
  // lets the Auto-badge suppression case (issue #110) be exercised even while
  // automatic control stays on.
  const customBypass = winner === 'custom_position' && activeSlotMinMode(entry) === false;
  return {
    winner,
    position: entry.target_position,
    trace,
    reason: `Scripted winner: ${winner}`,
    attrs: {
      enabled_handlers: [...HANDLER_ORDER],
      bypass_auto_control: !f.automatic_control || customBypass,
      default_position: f.default_position,
      is_sunset_active: f.is_sunset_active,
      in_time_window: f.in_time_window,
      sun_azimuth: sunAzimuth,
      sun_elevation: sunElevation,
      gamma: gammaFor(sunAzimuth, entry.window_azimuth),
      in_field_of_view: azimuthInFov(
        sunAzimuth,
        entry.window_azimuth,
        entry.fov_left,
        entry.fov_right,
      ),
      elevation_valid: sunElevation > 0,
      in_blind_spot: false,
      sunset_window_active: f.is_sunset_active,
      direct_sun_valid: false,
      custom_position_slots: entry.slots.map((s) => ({
        slot: s.slot,
        enabled: s.enabled,
        sensor: `sensor.custom_${entry.entry_id}_slot${s.slot}`,
        sensor_name: s.name,
        position: s.position,
        priority: s.priority,
        min_mode: s.min_mode,
      })),
    },
  };
}
