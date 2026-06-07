import SunCalc from 'suncalc';
import {
  findFovWindow,
  sampleDay,
  startOfDayInZone,
  type SunSample,
} from '../../../src/lib/sun-model';
import { decide, scriptedDecision, type DecisionResult } from './decider';
import { buildForecast } from './forecast';
import { entityIdFor } from './registry';
import type { HarnessConfig, HarnessEntry } from '../types';
import { zoneForLongitude, zonedNowMs } from '../zone';

export interface HassState {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
  context: { id: string };
}

export interface GeneratedStates {
  states: Record<string, HassState>;
  /** Per-entry decision outcome (also surfaced in states; kept for log/UI). */
  decisions: Map<string, DecisionResult>;
  /** Per-entry daily sun-sample series (for moon + path consumers). */
  samplesByEntry: Map<string, SunSample[]>;
  /** "Now" moment used for this snapshot (date + time slider). */
  now: Date;
}

function mkState(entity_id: string, state: string, attributes: Record<string, unknown>): HassState {
  const ts = new Date().toISOString();
  return {
    entity_id,
    state,
    attributes,
    last_changed: ts,
    last_updated: ts,
    context: { id: 'harness' },
  };
}

/** Pick the sample whose timestamp is closest to `now`. */
function nearestSample(samples: SunSample[], now: Date): SunSample {
  let best = samples[0];
  let bestDist = Math.abs(samples[0].t.getTime() - now.getTime());
  for (const s of samples) {
    const d = Math.abs(s.t.getTime() - now.getTime());
    if (d < bestDist) {
      bestDist = d;
      best = s;
    }
  }
  return best;
}

export function buildStates(cfg: HarnessConfig): GeneratedStates {
  const tz = zoneForLongitude(cfg.longitude);
  const now = new Date(zonedNowMs(cfg.date, cfg.timeOfDayMinutes, tz));
  const dayStart = startOfDayInZone(tz, now);
  const states: Record<string, HassState> = {};
  const decisions = new Map<string, DecisionResult>();
  const samplesByEntry = new Map<string, SunSample[]>();

  for (const entry of cfg.entries) {
    const samples = sampleDay(cfg.latitude, cfg.longitude, dayStart);
    samplesByEntry.set(entry.entry_id, samples);
    const sun = nearestSample(samples, now);
    const decision =
      cfg.decisionMode === 'scripted'
        ? scriptedDecision(cfg.scriptedWinner, entry, sun.azimuth, sun.elevation)
        : decide({
            entry,
            sunAzimuth: sun.azimuth,
            sunElevation: sun.elevation,
            nowMs: now.getTime(),
          });
    decisions.set(entry.entry_id, decision);

    addEntryStates(states, entry, sun, decision, samples, now, dayStart, tz);
    addCoverStates(states, entry);
  }

  return { states, decisions, samplesByEntry, now };
}

function addEntryStates(
  states: Record<string, HassState>,
  entry: HarnessEntry,
  sun: SunSample,
  decision: DecisionResult,
  samples: SunSample[],
  now: Date,
  dayStart: Date,
  _tz: string,
): void {
  const id = (role: Parameters<typeof entityIdFor>[1]) => entityIdFor(entry, role);
  const f = entry.flags;

  const actualPositions: Record<string, number | null> = {};
  for (const c of entry.covers) actualPositions[c.entity_id] = c.position;
  const allAtTarget = entry.covers.every(
    (c) => c.position !== null && Math.abs(c.position - entry.target_position) <= 1,
  );

  states[id('target_position_sensor')] = mkState(
    id('target_position_sensor'),
    String(entry.target_position),
    {
      friendly_name: `${entry.title} Cover Position`,
      unit_of_measurement: '%',
      actual_positions: actualPositions,
      all_at_target: allAtTarget,
      control_method: decision.winner,
      reason: decision.reason,
      raw_calculated_position: decision.position,
    },
  );

  states[id('sun_sensor')] = mkState(id('sun_sensor'), sun.azimuth.toFixed(2), {
    friendly_name: `${entry.title} Sun Position`,
    elevation: sun.elevation,
    gamma: decision.attrs.gamma,
    window_azimuth: entry.window_azimuth,
    fov_left: entry.fov_left,
    fov_right: entry.fov_right,
    azimuth_min: entry.window_azimuth - entry.fov_left,
    azimuth_max: entry.window_azimuth + entry.fov_right,
    in_fov: decision.attrs.in_field_of_view,
    min_elevation: entry.min_elevation,
    max_elevation: entry.max_elevation,
    blind_spot_range: entry.blind_spot_range,
  });

  // Start / end Sun sensors bound today's contiguous in-FOV + above-horizon
  // arc. Picking first/last across the full 24h sample window is wrong: when
  // the sample window straddles two solar days (browser TZ offset from the
  // configured location), the "last in-FOV" sample can land on the next day's
  // sunrise — same azimuth as the start. The card then draws an active-arc
  // wedge that's essentially zero-width. `findFovWindow` picks the longest
  // contiguous valid run.
  const fovRun = findFovWindow(samples, entry.window_azimuth, entry.fov_left, entry.fov_right);
  let startSun: SunSample | undefined;
  let endSun: SunSample | undefined;
  if (fovRun) {
    // Further clip to min_elevation, again preserving contiguity.
    let s = fovRun.startIdx;
    let e = fovRun.endIdx;
    if (entry.min_elevation !== undefined) {
      while (s <= e && samples[s].elevation < entry.min_elevation) s++;
      while (e >= s && samples[e].elevation < entry.min_elevation) e--;
    }
    if (s <= e) {
      startSun = samples[s];
      endSun = samples[e];
    }
  }
  states[id('start_sensor')] = mkState(
    id('start_sensor'),
    startSun ? startSun.azimuth.toFixed(2) : 'unavailable',
    {
      friendly_name: `${entry.title} Start Sun`,
      azimuth: startSun?.azimuth,
      elevation: startSun?.elevation,
    },
  );
  states[id('end_sensor')] = mkState(
    id('end_sensor'),
    endSun ? endSun.azimuth.toFixed(2) : 'unavailable',
    {
      friendly_name: `${entry.title} End Sun`,
      azimuth: endSun?.azimuth,
      elevation: endSun?.elevation,
    },
  );

  // Schedule window as tz-aware ISO datetimes built from the scenario day + the
  // per-entry flag minutes. The end is rolled to the next day when end ≤ start,
  // so the window can span midnight — matching the integration contract.
  const DAY_MS = 24 * 60 * 60 * 1000;
  const isoAtMinutes = (mins: number, extraMs = 0): string =>
    new Date(dayStart.getTime() + mins * 60_000 + extraMs).toISOString();
  const sStart = f.schedule_start_minutes;
  const sEnd = f.schedule_end_minutes;
  const scheduleStart = sStart === null ? null : isoAtMinutes(sStart);
  const scheduleEnd =
    sEnd === null
      ? null
      : sStart !== null && sEnd <= sStart
        ? isoAtMinutes(sEnd, DAY_MS) // roll a midnight/early end to the next day.
        : isoAtMinutes(sEnd);
  states[id('control_status_sensor')] = mkState(id('control_status_sensor'), decision.winner, {
    friendly_name: `${entry.title} Control Status`,
    cover_type: entry.cover_type,
    schedule_start: scheduleStart,
    schedule_end: scheduleEnd,
  });

  states[id('decision_trace_sensor')] = mkState(id('decision_trace_sensor'), decision.winner, {
    friendly_name: `${entry.title} Decision Trace`,
    trace: decision.trace,
    reason: decision.reason,
    ...decision.attrs,
  });

  states[id('last_action_sensor')] = mkState(
    id('last_action_sensor'),
    `Set to ${entry.target_position}%`,
    { friendly_name: `${entry.title} Last Cover Action` },
  );
  states[id('last_skipped_sensor')] = mkState(id('last_skipped_sensor'), 'none', {
    friendly_name: `${entry.title} Last Skipped Action`,
  });

  const manualEnd = f.manual_override
    ? new Date(now.getTime() + f.manual_override_minutes_from_now * 60_000).toISOString()
    : 'unavailable';
  states[id('manual_override_end_sensor')] = mkState(id('manual_override_end_sensor'), manualEnd, {
    friendly_name: `${entry.title} Manual Override End Time`,
    device_class: 'timestamp',
  });
  states[id('position_verification_sensor')] = mkState(
    id('position_verification_sensor'),
    allAtTarget ? 'ok' : 'mismatch',
    { friendly_name: `${entry.title} Position Verification` },
  );

  states[id('motion_status_sensor')] = mkState(id('motion_status_sensor'), f.motion_status, {
    friendly_name: `${entry.title} Motion Status`,
    motion_timeout_end_time:
      f.motion_status === 'timeout_pending'
        ? new Date(now.getTime() + f.motion_timeout_minutes_from_now * 60_000).toISOString()
        : undefined,
  });

  states[id('force_override_sensor')] = mkState(
    id('force_override_sensor'),
    String(f.force_override_triggers),
    { friendly_name: `${entry.title} Force Override Triggers` },
  );

  states[id('climate_status_sensor')] = mkState(
    id('climate_status_sensor'),
    f.climate_strategy,
    f.climate_strategy === 'unknown'
      ? { friendly_name: `${entry.title} Climate Status` }
      : {
          friendly_name: `${entry.title} Climate Status`,
          active_temperature: f.indoor_temp,
          temperature_unit: '°C',
          indoor_temperature: f.indoor_temp,
          outdoor_temperature: f.outdoor_temp,
          temp_switch: f.climate_strategy === 'winter_mode',
          is_presence: true,
          is_sunny: sun.elevation > 0,
          lux_active: sun.elevation > 5,
          irradiance_active: sun.elevation > 10,
        },
  );

  const { forecast, events } = buildForecast(entry, samples);
  states[id('position_forecast_sensor')] = mkState(
    id('position_forecast_sensor'),
    String(entry.target_position),
    {
      friendly_name: `${entry.title} Position Forecast`,
      forecast,
      events,
    },
  );

  // Binary sensors
  states[id('sun_infront_binary')] = mkState(
    id('sun_infront_binary'),
    decision.attrs.in_field_of_view ? 'on' : 'off',
    { friendly_name: `${entry.title} Sun In Front`, device_class: 'motion' },
  );
  states[id('manual_override_binary')] = mkState(
    id('manual_override_binary'),
    f.manual_override ? 'on' : 'off',
    { friendly_name: `${entry.title} Manual Override` },
  );
  states[id('position_mismatch_binary')] = mkState(
    id('position_mismatch_binary'),
    allAtTarget ? 'off' : 'on',
    {
      friendly_name: `${entry.title} Position Mismatch`,
      entities: Object.fromEntries(
        entry.covers.map((c) => [
          c.entity_id,
          { mismatch: c.position !== null && Math.abs(c.position - entry.target_position) > 1 },
        ]),
      ),
    },
  );
  states[id('glare_active_binary')] = mkState(
    id('glare_active_binary'),
    f.glare_active ? 'on' : 'off',
    { friendly_name: `${entry.title} Glare Active` },
  );

  // Switches
  states[id('integration_enabled_switch')] = mkState(
    id('integration_enabled_switch'),
    f.integration_enabled ? 'on' : 'off',
    { friendly_name: `${entry.title} Integration Enabled` },
  );
  states[id('automatic_control_switch')] = mkState(
    id('automatic_control_switch'),
    f.automatic_control ? 'on' : 'off',
    { friendly_name: `${entry.title} Automatic Control` },
  );
  states[id('manual_toggle_switch')] = mkState(
    id('manual_toggle_switch'),
    f.manual_override ? 'on' : 'off',
    { friendly_name: `${entry.title} Manual Override Switch` },
  );
  states[id('climate_mode_switch')] = mkState(
    id('climate_mode_switch'),
    f.climate_strategy === 'intermediate' ? 'off' : 'on',
    { friendly_name: `${entry.title} Climate Mode` },
  );
  states[id('motion_control_switch')] = mkState(id('motion_control_switch'), 'on', {
    friendly_name: `${entry.title} Motion Control`,
  });

  states[id('reset_override_button')] = mkState(id('reset_override_button'), 'unknown', {
    friendly_name: `${entry.title} Reset Manual Override`,
  });

  // Per-slot custom-position sensors. The card's resolveActiveMinModeFloor reads
  // `hassStates[slot.sensor].state === 'on'` to decide whether a floor is armed,
  // so enabled slots must surface an "on" sensor for the floor chip to render.
  for (const s of entry.slots) {
    const sensorId = `sensor.custom_${entry.entry_id}_slot${s.slot}`;
    states[sensorId] = mkState(sensorId, s.enabled ? 'on' : 'off', {
      friendly_name: `${entry.title} ${s.name}`,
    });
  }
}

function addCoverStates(states: Record<string, HassState>, entry: HarnessEntry): void {
  for (const c of entry.covers) {
    const pos = c.position ?? entry.target_position;
    const state = pos === 0 ? 'closed' : pos === 100 ? 'open' : 'open';
    states[c.entity_id] = mkState(c.entity_id, state, {
      friendly_name: c.friendly_name,
      current_position: c.position,
      supported_features: 15,
      device_class: 'shade',
    });
  }
}

/**
 * Compute moon data using SunCalc directly so the harness can show moon info
 * even when individual entries don't need it. Returns null if SunCalc can't
 * resolve a position (shouldn't happen with valid lat/lon).
 */
export function moonAt(
  latitude: number,
  longitude: number,
  now: Date,
): { azimuth: number; elevation: number; phase: number; fraction: number } {
  const pos = SunCalc.getMoonPosition(now, latitude, longitude);
  const illum = SunCalc.getMoonIllumination(now);
  return {
    azimuth: ((((pos.azimuth * 180) / Math.PI + 180) % 360) + 360) % 360,
    elevation: (pos.altitude * 180) / Math.PI,
    phase: illum.phase,
    fraction: illum.fraction,
  };
}
