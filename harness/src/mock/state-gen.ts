import SunCalc from 'suncalc';
import { CUSTOM_POSITION_SAFETY_PRIORITY } from '../../../src/const';
import {
  findFovWindow,
  sampleDay,
  startOfDayInZone,
  type SunSample,
} from '../../../src/lib/sun-model';
import { decide, scriptedDecision, type DecisionResult } from './decider';
import { buildForecast } from './forecast';
import { entityIdFor } from './registry';
import type { CoverType, HarnessConfig, HarnessEntry } from '../types';
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

  // Group entries run LAST. A member cover can belong to a real ACP cover entry
  // in the same scenario (that's what makes the roster render as tile cards), and
  // `addGroupStates` only stubs members that have no state yet — so the cover
  // entry must have published its own richer state first.
  const ordered = [...cfg.entries].sort((a, b) => Number(!!a.is_group) - Number(!!b.is_group));
  for (const entry of ordered) {
    // Cover Group entries (issue #185) carry no sun geometry, decision pipeline,
    // or per-cover sensors — emit their group_* entities and move on.
    if (entry.is_group) {
      samplesByEntry.set(entry.entry_id, []);
      addGroupStates(states, entry);
      continue;
    }
    const samples = sampleDay(cfg.latitude, cfg.longitude, dayStart);
    samplesByEntry.set(entry.entry_id, samples);
    const sun = nearestSample(samples, now);
    const decision =
      cfg.decisionMode === 'scripted'
        ? scriptedDecision(
            cfg.scriptedWinner,
            entry,
            sun.azimuth,
            sun.elevation,
            cfg.scriptedAlsoMatched,
          )
        : decide({
            entry,
            sunAzimuth: sun.azimuth,
            sunElevation: sun.elevation,
            nowMs: now.getTime(),
          });
    decisions.set(entry.entry_id, decision);

    addEntryStates(states, entry, sun, decision, samples, now, dayStart, tz, cfg.legacyIntegration);
    addCoverStates(states, entry);
  }

  return { states, decisions, samplesByEntry, now };
}

/**
 * Build the integration's `cover_discovery` descriptor (issue #180) for a mock
 * cover type. Mirrors the serialized `CoverDescriptor`/`AxisDescriptor` shape:
 * every cover exposes a `position` axis; venetian additionally exposes a `tilt`
 * axis. Emitted on the control_status sensor unless the legacy flag is set.
 *
 * `positionInverted` / `tiltInverted` mirror the integration's
 * `AxisDescriptor.inverted`, which is set per axis from that axis's own
 * inversion option (issues #234, #236) — the card's only oracle for
 * un-inverting cover-frame reads.
 */
export function buildCoverDiscovery(
  coverType: CoverType,
  positionInverted = false,
  tiltInverted = false,
): Record<string, unknown> {
  const label = (
    {
      cover_blind: 'Vertical Blind',
      cover_awning: 'Awning',
      cover_tilt: 'Tilt',
      cover_venetian: 'Venetian',
    } as Record<CoverType, string>
  )[coverType];
  const axes: Record<string, unknown>[] = [
    {
      id: 'position',
      label: 'Position',
      label_key: 'axes.position',
      min: 0,
      max: 100,
      unit: '%',
      capability_key: 'has_set_position',
      state_attr: 'current_position',
      service_attr: 'position',
      open_blocks_sun: coverType === 'cover_awning',
      supported: true,
      inverted: positionInverted,
    },
  ];
  if (coverType === 'cover_venetian') {
    axes.push({
      id: 'tilt',
      label: 'Tilt',
      label_key: 'axes.tilt',
      min: 0,
      max: 100,
      unit: '%',
      capability_key: 'has_set_tilt_position',
      state_attr: 'current_tilt_position',
      service_attr: 'tilt',
      open_blocks_sun: false,
      supported: true,
      inverted: tiltInverted,
    });
  }
  return { cover_type: coverType, cover_label: label, axes };
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
  legacyIntegration: boolean,
): void {
  const id = (role: Parameters<typeof entityIdFor>[1]) => entityIdFor(entry, role);
  const f = entry.flags;

  // During a manual override with a held position distinct from the solar
  // target, the integration's Cover_Position sensor STATE returns the HELD
  // position while `raw_calculated_position` keeps the solar would-be target
  // (decision.position). Model that divergence so the compass can draw both the
  // solar-target wedge and the held/actual ring (#132). Otherwise the state is
  // the (solar) target and held tracks it (the pre-#132 collapse).
  const held = f.manual_override && f.held_position !== null ? f.held_position : null;
  const coverState = held !== null ? held : entry.target_position;

  // An inverse_state entry dispatches `100 − logical`, so everything the
  // integration reports FROM the cover is in the cover frame while
  // `linear_*` stays logical (issue #234).
  const inverse = f.inverse_state;
  const flip = (v: number | null): number | null => (typeof v === 'number' ? 100 - v : v);

  const logicalActuals: Record<string, number | null> = {};
  for (const c of entry.covers) {
    // Covers physically sit at the held position during a divergent override.
    logicalActuals[c.entity_id] = held !== null ? held : c.position;
  }
  const actualPositions: Record<string, number | null> = inverse
    ? Object.fromEntries(Object.entries(logicalActuals).map(([k, v]) => [k, flip(v)]))
    : logicalActuals;
  const allAtTarget = entry.covers.every(
    (c) => c.position !== null && Math.abs(c.position - entry.target_position) <= 1,
  );

  // On an inverse entry the sensor STATE is the dispatched value, and
  // `linear_position` carries the logical one the card must display — unless a
  // scenario pins linear_position explicitly (interpolation), which still wins.
  const linearPosition =
    f.linear_position !== null ? f.linear_position : inverse ? coverState : null;

  const coverPositionAttrs: Record<string, unknown> = {
    friendly_name: `${entry.title} Cover Position`,
    unit_of_measurement: '%',
    actual_positions: actualPositions,
    // Published unconditionally by a post-#1033 integration — the identity map
    // unless the position axis is inverted (issue #234). Omitted under the
    // legacy flag so the card exercises its axis-flag fallback and, with no
    // flag either, the accepted pre-#1033 residual.
    ...(legacyIntegration ? {} : { linear_actual_positions: logicalActuals }),
    all_at_target: allAtTarget,
    control_method: decision.winner,
    reason: decision.reason,
    raw_calculated_position: decision.position,
    // Pre-interpolation logical position (issue #219). Spread conditionally so
    // "absent" is actually absent (not null), matching a real HA state object
    // and exercising the card's `typeof val === 'number'` guard honestly.
    ...(linearPosition !== null ? { linear_position: linearPosition } : {}),
  };
  // No-feedback covers publish an in-transit direction while mid-move; mirror it
  // so the tile renders the localized "Opening"/"Closing" state text.
  if (f.transit_direction) {
    coverPositionAttrs.transit_states = Object.fromEntries(
      entry.covers.map((c) => [c.entity_id, f.transit_direction]),
    );
  }
  states[id('target_position_sensor')] = mkState(
    id('target_position_sensor'),
    String(inverse ? 100 - coverState : coverState),
    coverPositionAttrs,
  );

  // Dual-axis venetian: the Cover_Tilt sensor publishes the solar slat target
  // (0–100, no attributes). Its presence is the card's dual-axis gate, so only
  // emit it for venetian entries (matches the gated registry entry).
  if (entry.cover_type === 'cover_venetian') {
    const tiltTarget = entry.target_tilt ?? 50;
    states[id('target_tilt_sensor')] = mkState(id('target_tilt_sensor'), String(tiltTarget), {
      friendly_name: `${entry.title} Cover Tilt`,
      unit_of_measurement: '%',
    });
  }

  states[id('sun_sensor')] = mkState(id('sun_sensor'), sun.azimuth.toFixed(2), {
    friendly_name: `${entry.title} Sun Position`,
    elevation: sun.elevation,
    gamma: decision.attrs.gamma,
    window_azimuth: entry.window_azimuth,
    fov_left: entry.fov_left,
    fov_right: entry.fov_right,
    azimuth_min: entry.window_azimuth - entry.fov_left,
    azimuth_max: entry.window_azimuth + entry.fov_right,
    // Azimuth-only FOV (mirror integration sun_position.in_fov), NOT full
    // validity — the card's dot reads this for the in_fov_not_valid split.
    in_fov: decision.azimuthInFov,
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
    // Multi-axis self-discovery descriptor (issue #180). Omitted under the
    // legacy flag so the card exercises its synthesized-axis fallback.
    ...(legacyIntegration
      ? {}
      : {
          cover_discovery: buildCoverDiscovery(entry.cover_type, f.inverse_state, f.inverse_tilt),
        }),
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
  if (f.throttle_pending) {
    states[id('last_skipped_sensor')] = mkState(id('last_skipped_sensor'), 'time_delta_too_small', {
      friendly_name: `${entry.title} Last Skipped Action`,
      timestamp: new Date(now.getTime() - f.throttle_skipped_minutes_ago * 60_000).toISOString(),
      elapsed_minutes: f.throttle_skipped_minutes_ago,
      time_threshold_minutes: f.throttle_threshold_minutes,
    });
  } else {
    states[id('last_skipped_sensor')] = mkState(id('last_skipped_sensor'), 'none', {
      friendly_name: `${entry.title} Last Skipped Action`,
    });
  }

  const manualEnd = f.manual_override
    ? new Date(now.getTime() + f.manual_override_minutes_from_now * 60_000).toISOString()
    : 'unavailable';
  states[id('manual_override_end_sensor')] = mkState(id('manual_override_end_sensor'), manualEnd, {
    friendly_name: `${entry.title} Manual Override End Time`,
    device_class: 'timestamp',
  });
  // `per_entity` carries each managed cover's own command target — the only
  // per-cover target the integration publishes, and what the tile's rail ticks
  // read. Each cover may pin its own `command_target`; without one the rail
  // takes the entry target, which is what a single-cover entry has always
  // effectively shown. Cover frame, like `actual_positions`. Omitted under the
  // legacy flag so the card exercises its entry-target fallback.
  states[id('position_verification_sensor')] = mkState(
    id('position_verification_sensor'),
    allAtTarget ? 'ok' : 'mismatch',
    {
      friendly_name: `${entry.title} Position Verification`,
      ...(legacyIntegration
        ? {}
        : {
            per_entity: Object.fromEntries(
              entry.covers.map((c) => {
                const logical = c.command_target ?? entry.target_position;
                return [
                  c.entity_id,
                  {
                    target: inverse ? flip(logical) : logical,
                    actual: actualPositions[c.entity_id] ?? null,
                    at_target: allAtTarget,
                    retry_count: 0,
                    last_reconcile_time: null,
                    wait_for_target: false,
                  },
                ];
              }),
            ),
          }),
    },
  );

  states[id('motion_status_sensor')] = mkState(id('motion_status_sensor'), f.motion_status, {
    friendly_name: `${entry.title} Motion Status`,
    motion_timeout_end_time:
      f.motion_status === 'timeout_pending'
        ? new Date(now.getTime() + f.motion_timeout_minutes_from_now * 60_000).toISOString()
        : undefined,
  });

  // The standalone Force Override Triggers sensor was removed in v2.28.0 — its
  // function merged into the priority-100 custom-position safety slot (slot 5),
  // whose state is surfaced through the per-slot custom-position sensor below.

  states[id('climate_status_sensor')] = mkState(
    id('climate_status_sensor'),
    f.climate_strategy,
    f.climate_strategy === 'unknown'
      ? {
          friendly_name: `${entry.title} Climate Status`,
          // #590: threshold keys always present (values may be null), plus the
          // inactive_reason slug — emitted even in standby.
          temp_low: f.climate_temp_low,
          temp_high: f.climate_temp_high,
          temp_summer_outside: f.climate_temp_summer_outside,
          inactive_reason: f.climate_inactive_reason,
        }
      : {
          friendly_name: `${entry.title} Climate Status`,
          active_temperature: f.climate_strategy === 'winter_mode' ? f.outdoor_temp : f.indoor_temp,
          temperature_unit: '°C',
          indoor_temperature: f.indoor_temp,
          outdoor_temperature: f.outdoor_temp,
          temp_switch: f.climate_strategy === 'winter_mode',
          temp_low: f.climate_temp_low,
          temp_high: f.climate_temp_high,
          temp_summer_outside: f.climate_temp_summer_outside,
          inactive_reason: f.climate_inactive_reason,
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

  // Solar Calculation diagnostic sensor (issue #169). The raw geometric trace
  // behind the Solar handler. STATE is the raw position % (or `unknown` when
  // there is no solar target); attributes carry the full per-cover-type
  // breakdown and are populated either way so the card keys off them.
  const solar = buildSolarCalc(entry, sun.elevation, decision);
  states[id('solar_calculation_sensor')] = mkState(
    id('solar_calculation_sensor'),
    solar.position_pct === null ? 'unknown' : String(solar.position_pct),
    { friendly_name: `${entry.title} Solar Calculation`, unit_of_measurement: '%', ...solar },
  );

  // Binary sensors
  states[id('sun_infront_binary')] = mkState(
    id('sun_infront_binary'),
    // Mirror integration coordinator: sun_motion == direct_sun_valid.
    decision.attrs.direct_sun_valid ? 'on' : 'off',
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
    // The priority-100 safety slot (slot 5) is armed by the dedicated
    // safety_slot_active flag rather than just being enabled.
    const armed =
      s.priority === CUSTOM_POSITION_SAFETY_PRIORITY
        ? s.enabled && entry.flags.safety_slot_active
        : s.enabled;
    states[sensorId] = mkState(sensorId, armed ? 'on' : 'off', {
      friendly_name: `${entry.title} ${s.name}`,
    });
  }
}

function addCoverStates(states: Record<string, HassState>, entry: HarnessEntry): void {
  const dualAxis = entry.cover_type === 'cover_venetian';
  // On an inverse_state entry the physical cover is driven with `100 − logical`,
  // so it REPORTS backwards: a fully-extended awning (logical 100) sits at
  // `current_position: 0` while its HA state is still `open` — the exact
  // contradiction issue #234 was reported against. Mocking the source cover
  // this way means the harness reproduces the bug, not just the fix.
  const inverse = entry.flags.inverse_state;
  for (const c of entry.covers) {
    const pos = c.position ?? entry.target_position;
    // Derived from the LOGICAL position, so it disagrees with the reported
    // attribute exactly the way the real integration leaves it.
    const state = c.state ?? (pos === 0 ? 'closed' : pos === 100 ? 'open' : 'open');
    const reportedPosition =
      inverse && typeof c.position === 'number' ? 100 - c.position : c.position;
    // Venetian covers carry a live slat angle the card reads directly off the
    // cover entity (the integration does not aggregate tilts into a sensor).
    const tilt = dualAxis ? (c.tilt ?? entry.target_tilt ?? 50) : undefined;
    // An inverse_tilt entry drives the slat axis with `100 − logical` too, so
    // the cover reports the complement while the scenario's `tilt` stays
    // logical — mirroring `reportedPosition` above (issue #236).
    const reportedTilt = entry.flags.inverse_tilt && tilt !== undefined ? 100 - tilt : tilt;
    // device_class drives the card's HA-native icon + control glyphs. Explicit
    // per-cover config wins; `'none'` suppresses it (fallback-chain proof);
    // otherwise default from the cover_type (venetian → blind, else shade),
    // preserving the pre-existing mock behavior.
    const deviceClass =
      c.device_class === 'none' ? undefined : (c.device_class ?? (dualAxis ? 'blind' : 'shade'));
    states[c.entity_id] = mkState(c.entity_id, state, {
      friendly_name: c.friendly_name,
      current_position: reportedPosition,
      // Inverse installs in the wild are typically RTS/one-way covers.
      ...(inverse ? { assumed_state: true } : {}),
      ...(reportedTilt !== undefined ? { current_tilt_position: reportedTilt } : {}),
      // Bit 16 (SET_TILT_POSITION) added for venetian so the cover advertises
      // tilt support alongside the position features (15).
      supported_features: dualAxis ? 143 : 15,
      ...(deviceClass !== undefined ? { device_class: deviceClass } : {}),
      ...(c.icon ? { icon: c.icon } : {}),
    });
  }
}

/**
 * Emit the `group_*` entity states for a Cover Group entry (issue #185). Reads
 * the group state straight off `entry.group`; the aggregate position + roster
 * come from `member_positions`, the who-won count from `member_winners`.
 */
function addGroupStates(states: Record<string, HassState>, entry: HarnessEntry): void {
  const id = (role: Parameters<typeof entityIdFor>[1]) => entityIdFor(entry, role);
  const g = entry.group;
  if (!g) return;
  // Mirrors GroupWhoWonSensor.native_value: the STATE counts only members whose
  // pipeline a GROUP handler won, while `member_winners` carries every member's
  // real winner (which is what the card rolls up into group badges).
  const GROUP_HANDLERS = ['group_scene', 'group_lock'];
  const whoWon = Object.values(g.member_winners).filter(
    (w) => w !== null && GROUP_HANDLERS.includes(w),
  ).length;

  states[id('group_position_sensor')] = mkState(
    id('group_position_sensor'),
    String(g.aggregate_position),
    {
      friendly_name: `${entry.title} Group Position`,
      unit_of_measurement: '%',
      member_positions: g.member_positions,
    },
  );
  states[id('group_state_sensor')] = mkState(id('group_state_sensor'), g.state, {
    friendly_name: `${entry.title} Group State`,
  });
  states[id('group_active_scene_sensor')] = mkState(
    id('group_active_scene_sensor'),
    g.active_scene === 'none' ? 'unknown' : g.active_scene,
    { friendly_name: `${entry.title} Group Active Scene` },
  );
  states[id('group_climate_mode_sensor')] = mkState(
    id('group_climate_mode_sensor'),
    g.climate_mode,
    { friendly_name: `${entry.title} Group Climate Mode`, member_climate_modes: {} },
  );
  states[id('group_who_won_sensor')] = mkState(id('group_who_won_sensor'), String(whoWon), {
    friendly_name: `${entry.title} Group Who Won`,
    member_winners: g.member_winners,
  });
  states[id('group_scene_select')] = mkState(id('group_scene_select'), g.scene_option, {
    friendly_name: `${entry.title} Group Scene`,
    options: ['auto', 'all_open', 'all_closed', 'privacy'],
    current_option: g.scene_option,
  });
  states[id('group_automation_switch')] = mkState(
    id('group_automation_switch'),
    g.automation ? 'on' : 'off',
    { friendly_name: `${entry.title} Group Automation` },
  );
  states[id('group_lock_switch')] = mkState(id('group_lock_switch'), g.locked ? 'on' : 'off', {
    friendly_name: `${entry.title} Group Lock`,
  });
  for (const role of [
    'group_scene_all_open_button',
    'group_scene_all_closed_button',
    'group_scene_privacy_button',
    'group_clear_overrides_button',
  ] as const) {
    states[id(role)] = mkState(id(role), 'unknown', { friendly_name: `${entry.title} ${role}` });
  }

  // The aggregate cover entity is OPT-IN in the integration, so it is emitted
  // only when the scenario asks for it — that's the branch where the group tilt
  // track can appear (features 15 = open/close/set_position/stop, +128 =
  // SET_TILT_POSITION, which the integration adds only for an all-tilt roster).
  if (g.aggregate_cover) {
    const hasTilt = g.tilt !== undefined && g.tilt !== null;
    states[id('group_cover')] = mkState(
      id('group_cover'),
      coverPositionState(g.aggregate_position),
      {
        friendly_name: `${entry.title} Group Cover`,
        current_position: g.aggregate_position,
        ...(hasTilt ? { current_tilt_position: g.tilt } : {}),
        supported_features: hasTilt ? 143 : 15,
        device_class: 'shade',
      },
    );
  }

  // Member covers are foreign entity_ids in other config entries — the card
  // never discovers them, but the group view reads each member's live
  // friendly_name/position off `hass.states`. Emit a stub cover state per
  // member (ACP-managed AND generic) so the harness main-card group view shows
  // real names + open/closed states instead of bare entity_ids.
  for (const [memberId, pos] of Object.entries(g.member_positions)) {
    // A member that belongs to a real ACP cover entry in this scenario already
    // has a full state (device_class, tilt, assumed_state, …) emitted above —
    // and that entry is what lets the roster render the member's own tile card.
    // Never clobber it with the stub.
    if (states[memberId]) continue;
    const memberTilt = g.member_tilts?.[memberId];
    const hasTilt = memberTilt !== undefined && memberTilt !== null;
    states[memberId] = mkState(memberId, coverPositionState(pos), {
      friendly_name: memberFriendlyName(memberId),
      current_position: pos ?? undefined,
      ...(hasTilt ? { current_tilt_position: memberTilt } : {}),
      supported_features: hasTilt ? 143 : 15,
      device_class: hasTilt ? 'blind' : 'shade',
    });
  }
}

/** open/closed/unknown text for a member cover from its 0..100 position. */
function coverPositionState(pos: number | null): string {
  if (pos === null) return 'unknown';
  return pos <= 0 ? 'closed' : 'open';
}

/** Humanize a member cover entity_id into a friendly name
 *  (`cover.living_left` → `Living Left`). */
function memberFriendlyName(entityId: string): string {
  return entityId
    .split('.')
    .pop()!
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Build the `solar_calculation` sensor's attribute set (issue #169). Derives a
 * plausible per-cover-type geometric trace from the mock sun elevation, the
 * decision's gamma, and whether direct sun is valid. When direct sun is not
 * valid there is no solar target: `position_pct` is null, `status` carries the
 * fallback reason, and the (still-populated) intermediates reflect the inputs.
 */
function buildSolarCalc(
  entry: HarnessEntry,
  elevationDeg: number,
  decision: DecisionResult,
): Record<string, unknown> {
  const a = decision.attrs;
  const gammaDeg = a.gamma;
  const gammaRad = (gammaDeg * Math.PI) / 180;
  const cosGamma = Math.cos(gammaRad);
  const hasTarget = a.direct_sun_valid;
  const status = hasTarget
    ? 'Direct Sun'
    : !a.in_field_of_view
      ? 'Default: FOV Exit'
      : !a.elevation_valid
        ? 'Default: Elevation Limit'
        : a.in_blind_spot
          ? 'Default: Blind Spot'
          : a.is_sunset_active
            ? 'Default: Sunset Offset'
            : 'Default';
  const positionPct = hasTarget ? decision.position : null;
  const base = {
    sol_elev_deg: Number(elevationDeg.toFixed(1)),
    gamma_deg: Number(gammaDeg.toFixed(1)),
    position_pct: positionPct,
    status,
  };

  // Vertical-blind trace, also reused as the venetian position axis.
  const blind = () => ({
    cover_type: 'cover_blind',
    ...base,
    edge_case_detected: false,
    effective_distance_m: 1.84,
    effective_distance_source: 'window_depth',
    window_depth_contribution_m: 0.15,
    sill_height_offset_m: 0.0,
    safety_margin: 0.95,
    glare_zones_active: [],
    cos_gamma: Number(cosGamma.toFixed(3)),
    cos_gamma_clamped: Number(Math.max(0, cosGamma).toFixed(3)),
    path_length_m: Number((1.84 / Math.max(0.05, Math.cos(gammaRad))).toFixed(3)),
    base_height_m: 1.2,
    adjusted_height_m: Number((1.2 * Math.max(0, cosGamma)).toFixed(3)),
    clamped_to_window: false,
  });
  const tilt = () => {
    const betaRad = (Math.max(0, elevationDeg) * Math.PI) / 180;
    const slat = hasTarget ? Number((90 - Math.max(0, elevationDeg)).toFixed(1)) : null;
    return {
      cover_type: 'cover_tilt',
      ...base,
      beta_rad: Number(betaRad.toFixed(3)),
      discriminant: 0.42,
      negative_discriminant: false,
      slat_angle_raw_deg: slat,
      nan_result: false,
      max_degrees: 90,
      tilt_mode: 'mid',
    };
  };

  switch (entry.cover_type) {
    case 'cover_awning':
      return {
        cover_type: 'cover_awning',
        ...base,
        awn_angle_deg: 40,
        a_angle_deg: Number(Math.max(0, elevationDeg).toFixed(1)),
        c_angle_deg: Number((180 - 40 - Math.max(0, elevationDeg)).toFixed(1)),
        vertical_position_m: 1.1,
        sin_c: 0.64,
        sin_c_near_zero: false,
        length_m: 1.5,
        clamped_to_awn_length: false,
      };
    case 'cover_tilt':
      return tilt();
    case 'cover_venetian':
      return { ...blind(), cover_type: 'cover_venetian', tilt: tilt() };
    case 'cover_blind':
    default:
      return blind();
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
