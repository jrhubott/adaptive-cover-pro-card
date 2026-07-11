import type { HandlerName } from '../../src/const';
import type { GroupAggregateState, GroupScene } from '../../src/types';

export type CoverType = 'cover_blind' | 'cover_awning' | 'cover_tilt' | 'cover_venetian';

/**
 * Cover Group state a group HarnessEntry carries (issue #185). Mirrors the
 * attribute shapes the integration's group sensors emit. When `HarnessEntry.is_group`
 * is set, the mock emits the `group_*` entities from these fields instead of the
 * per-cover sensor block.
 */
export interface GroupFields {
  /** entity_id → live position (null = unknown). Includes generic + ACP members;
   *  its key count is the who-won "N/M" denominator. */
  member_positions: Record<string, number | null>;
  /** entity_id → winning handler name (snake_case) or null. ACP members only. */
  member_winners: Record<string, string | null>;
  /** Aggregate position 0..100 published as the group_position sensor state. */
  aggregate_position: number;
  /** Aggregate open/closed state (group_state sensor). */
  state: GroupAggregateState;
  /** Active scene (group_active_scene sensor); `none` → the sensor reads unknown. */
  active_scene: GroupScene | 'none';
  /** Current option of the group scene `select`. */
  scene_option: GroupScene;
  /** group_lock switch on/off. */
  locked: boolean;
  /** group_automation switch on/off. */
  automation: boolean;
  /** Aggregate climate mode string (group_climate_mode sensor). */
  climate_mode: string;
}

export type MotionStatusValue = 'idle' | 'motion_detected' | 'timeout_pending';
export type ClimateStrategy = 'summer_mode' | 'winter_mode' | 'intermediate' | 'unknown';

export type ClimateInactiveReason =
  | 'active'
  | 'mode_off'
  | 'outside_time_window'
  | 'thresholds_not_met'
  | 'other_mode_active'
  | 'readings_unavailable';
export type DecisionMode = 'derived' | 'scripted';

/** Floating-tooltip behavior mirror of the card's `tooltips` config. `mode`
 *  maps to the card's `tooltips.enabled`: `floating` → true, `native` → false.
 *  `off` also sets enabled false (native tooltips are the off-state). */
export type TooltipMode = 'floating' | 'native';

export interface TooltipsOptions {
  mode: TooltipMode;
  /** [right, down] cursor offset in px (mirrors `tooltips.offset`). */
  offset: [number, number];
}

export interface CustomPositionSlotCfg {
  slot: 1 | 2 | 3 | 4 | 5;
  enabled: boolean;
  position: number;
  name: string;
  min_mode: boolean;
  /** Slot priority (mirrors the integration). >80 resists a manual ↓; the
   *  v2.28.0 safety slot (slot 5) uses priority 100. */
  priority: number;
  /** Bound sensors when the slot uses a multi-sensor (template) trigger. */
  sensors?: string[];
  /** True when the slot's trigger is a Jinja template. */
  template?: boolean;
  /** How a multi-sensor slot combines its sensors. */
  template_mode?: 'or' | 'and' | null;
}

export interface ManagedCoverCfg {
  /** HA cover entity_id, e.g. cover.living_room */
  entity_id: string;
  friendly_name: string;
  /** Live cover position in 0..100; null = unknown */
  position: number | null;
  /** Live slat tilt in 0..100 (venetian dual-axis only); null = unknown.
   *  Emitted as `current_tilt_position` on the cover state. */
  tilt?: number | null;
}

export interface HarnessEntry {
  /** Stable id used both as HA config_entry_id and unique_id prefix. */
  entry_id: string;
  title: string;
  cover_type: CoverType;
  /** Window normal bearing 0..360, 0=N. */
  window_azimuth: number;
  /** Positive degrees left of normal that count as in-FOV. */
  fov_left: number;
  /** Positive degrees right of normal. */
  fov_right: number;
  /** Optional elevation floor; undefined = no clip. */
  min_elevation?: number;
  /** Optional elevation ceiling. */
  max_elevation?: number;
  /** Optional [left, right] blind spot relative to window normal. */
  blind_spot_range?: [number, number];
  /** Target position 0..100 (integration output). */
  target_position: number;
  /** Solar tilt target 0..100 for venetian dual-axis covers (integration
   *  output, emitted on the Cover_Tilt sensor). Ignored for other cover types. */
  target_tilt?: number;
  /** Managed cover entities and their live positions. */
  covers: ManagedCoverCfg[];
  /** Single hex color used in the sky compass legend. */
  color: string;
  /** Custom-position slot snapshots. */
  slots: CustomPositionSlotCfg[];
  /** Per-entry override flags. */
  flags: {
    integration_enabled: boolean;
    automatic_control: boolean;
    manual_override: boolean;
    /** Minutes from "now" when the manual override expires. */
    manual_override_minutes_from_now: number;
    /** During a manual override the integration's Cover_Position sensor STATE
     *  returns this HELD position, while `raw_calculated_position` keeps the
     *  solar would-be target (`target_position`). null = no divergence (held
     *  tracks the solar target, the pre-#132 collapse behavior). */
    held_position: number | null;
    /** When true, the priority-100 safety slot (slot 5) is armed and wins as a
     *  custom_position with bypass_auto_control. Replaces the pre-2.28
     *  standalone Force Override trigger count. */
    safety_slot_active: boolean;
    motion_status: MotionStatusValue;
    /** Minutes from now when motion timeout fires. */
    motion_timeout_minutes_from_now: number;
    climate_strategy: ClimateStrategy;
    /** Indoor / outdoor temps to surface in the climate panel. */
    indoor_temp: number;
    outdoor_temp: number;
    /** Why climate is inactive when the strategy is `unknown` (standby). Mirrors
     *  the integration's `inactive_reason` slug on the climate_status sensor. */
    climate_inactive_reason: ClimateInactiveReason;
    /** Configured climate thresholds surfaced on the climate_status sensor.
     *  null = unconfigured (the card guards for null). */
    climate_temp_low: number | null;
    climate_temp_high: number | null;
    climate_temp_summer_outside: number | null;
    glare_active: boolean;
    is_sunset_active: boolean;
    in_time_window: boolean;
    /** Schedule window start as minutes-from-midnight (0..1439), or null for a
     *  blank/open start. Emitted as a tz-aware ISO datetime on control_status. */
    schedule_start_minutes: number | null;
    /** Schedule window end as minutes-from-midnight, or null for no end. When
     *  end ≤ start it is rolled to the next day (midnight-spanning), matching
     *  the integration. */
    schedule_end_minutes: number | null;
    default_position: number;
    /** When true, the integration's minimum-interval throttle blocked the last
     *  move: `last_skipped_sensor` reports `time_delta_too_small` and the card
     *  shows a "next adjustment allowed in …" countdown. */
    throttle_pending: boolean;
    /** Minutes ago the throttled skip was recorded (drives the countdown's
     *  remaining time = threshold − this). */
    throttle_skipped_minutes_ago: number;
    /** Configured minimum interval between position changes, in minutes. */
    throttle_threshold_minutes: number;
    /** In-transit direction for a no-feedback (open/close-only) cover. When set,
     *  the Cover_Position sensor publishes a `transit_states` map for this
     *  entry's covers so the tile shows the localized "Opening"/"Closing" state
     *  text. null/undefined = at rest (no transit_states emitted). */
    transit_direction?: 'opening' | 'closing' | null;
  };
  /** When true this entry is a Cover Group (issue #185): the mock emits the
   *  `group_*` entities from {@link group} and skips the per-cover sensor block,
   *  so the card discovers it as a group and renders the group tile variant. */
  is_group?: boolean;
  /** Group state, required when {@link is_group} is true. */
  group?: GroupFields;
}

export interface RootCardOptions {
  enabled: boolean;
  show_sections: {
    sky: boolean;
    elevation: boolean;
    decision: boolean;
    covers: boolean;
    overrides: boolean;
    climate: boolean;
    solar: boolean;
  };
  compact: boolean;
  show_compass_stats: boolean;
  show_compass_legend: boolean;
  show_moon: boolean;
  hide_inactive_handlers: boolean;
  show_decision_summary: boolean;
  north_offset: number;
}

export interface SkyCompassCardOptions {
  enabled: boolean;
  title: string;
  compact: boolean;
  show_legend: boolean;
  show_stats: boolean;
  show_moon: boolean;
  show_cardinals: boolean;
  show_blind_spot: boolean;
  show_sun_path: boolean;
  show_sunrise_sunset: boolean;
  show_cover_fill: boolean;
  show_window_arrow: boolean;
  show_elevation_chart: boolean;
  north_offset: number;
}

export interface TileCardOptions {
  enabled: boolean;
  show_position: boolean;
  show_state: boolean;
  show_decision_summary: boolean;
  show_controls: boolean;
  show_badge: boolean;
  /** Render the mini tilt bar on dual-axis venetian tiles (default true). */
  show_tilt: boolean;
  /** Per-kind badge opt-in. All default on; only `false` hides the kind. */
  badges: {
    auto: boolean;
    solar: boolean;
    force: boolean;
    weather: boolean;
    manual: boolean;
    custom_position: boolean;
    motion: boolean;
    climate: boolean;
    glare_zone: boolean;
    cloud: boolean;
  };
  show_compass: boolean;
  show_elevation_chart: boolean;
  show_solar_calc: boolean;
  show_motion_icon: boolean;
  layout: 'one-line' | 'detailed';
  /** Simulated tile width in px, mimicking a narrow HA "Sections" column.
   *  0 = auto (the stage grid sizes tiles normally, ≥360px wide). A positive
   *  value pins every tile to exactly that width so the card's narrow-column
   *  responsive behavior (issue #136) can be exercised below 360px. */
  tileWidth: number;
}

export interface DecisionCardOptions {
  enabled: boolean;
  title: string;
  compact: boolean;
  hide_inactive_handlers: boolean;
  show_decision_summary: boolean;
}

export interface SolarChartCardOptions {
  enabled: boolean;
  title: string;
  compact: boolean;
}

export interface HarnessConfig {
  /** Latitude for solar math. */
  latitude: number;
  /** Longitude for solar math. */
  longitude: number;
  /** ISO date string YYYY-MM-DD. */
  date: string;
  /** Minutes since midnight (0..1439). */
  timeOfDayMinutes: number;
  /** Auto-advance the time slider. */
  playing: boolean;
  /** Selected scenario id (for UI display only — actual state lives below). */
  scenario: string;
  /** Theme (light/dark) toggle for the harness page. */
  theme: 'light' | 'dark';
  /** Language fed into the mock hass locale, so the card's i18n renders in
   *  the chosen locale. Mirrors the card's supported Locale set. */
  language: 'en' | 'fr' | 'de';
  /** Simulate an OLD integration that predates the multi-axis self-discovery
   *  surface: when true, the control_status sensor omits `cover_discovery` and
   *  the mock hass omits the `set_axes` service, so the card exercises its
   *  legacy fallback (synthesized axes + per-axis set_position/set_tilt). */
  legacyIntegration: boolean;
  /** Entries to simulate (1..4). */
  entries: HarnessEntry[];
  /** Forces a specific handler winner instead of running the mock pipeline. */
  decisionMode: DecisionMode;
  scriptedWinner: HandlerName;
  /** Per-card render options. */
  root: RootCardOptions;
  compass: SkyCompassCardOptions;
  tile: TileCardOptions;
  decision: DecisionCardOptions;
  solarChart: SolarChartCardOptions;
  /** Floating-tooltip behavior, threaded into all three card configs. */
  tooltips: TooltipsOptions;
  /** Fixed stage height in px for the Sky Compass card, mimicking HA's
   *  fixed grid-row height in a Sections dashboard. 0 = grow freely (the
   *  harness default). A positive value caps the compass card-host and clips
   *  overflow so the issue #146 clip is reproducible. */
  stageHeight: number;
}
