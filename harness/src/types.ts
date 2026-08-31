import type { HandlerName } from '../../src/const';
import type { AcpNamePart, GroupAggregateState, GroupScene } from '../../src/types';

export type CoverType =
  | 'cover_blind'
  | 'cover_awning'
  | 'cover_tilt'
  /** Slats rotating in a horizontal/pitched roof plane (a pergola). Like
   *  `cover_tilt` it is TILT-ONLY: the policy declares the slat axis and nothing
   *  else, so that axis carries the primary-axis semantics — `inverse_state`
   *  inverts it, and the integration publishes its value and target under the
   *  position-named surfaces (`Cover_Position`, `actual_positions`). There is no
   *  position axis anywhere in its discovery payload (issue #277). */
  | 'cover_louvered_roof'
  | 'cover_venetian'
  /** Day/night dual-fabric shade. In the integration's `dual_entity` control
   *  model one entry binds two rail cover entities, so the card must handle a
   *  multi-cover entry that is not a Cover Group. */
  | 'cover_day_night_shade'
  /** Sheer + blackout panels over ONE window. Like the day/night shade it binds
   *  two cover entities per opening — the other cover type whose managed covers
   *  are layers rather than separate windows. */
  | 'cover_dual_panel';

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
  /** group_climate_mode SWITCH on/off — the writable bulk latch. Distinct from
   *  {@link climate_mode}, which is the read-only rollup sensor sharing the same
   *  translation key on a different platform. */
  climate: boolean;
  /** Aggregate climate mode string (group_climate_mode sensor). */
  climate_mode: string;
  /** Emit the integration's OPT-IN aggregate `cover.…group_cover` entity. It is
   *  off by default because a real install only gets it when the user enables
   *  it — the cards must degrade without it. */
  aggregate_cover?: boolean;
  /** Aggregate tilt on the group cover. Only meaningful with
   *  {@link aggregate_cover}; when set, the group cover advertises
   *  SET_TILT_POSITION (an all-tilt roster) and the group tilt track renders. */
  tilt?: number | null;
  /** entity_id → live slat tilt. A member with an entry here advertises
   *  SET_TILT_POSITION, so its roster row grows a second track. */
  member_tilts?: Record<string, number | null>;
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
  /** HA cover `device_class` (awning, blind, curtain, damper, door, garage,
   *  gate, shade, shutter, window). Drives the card's HA-native icon + control
   *  glyphs. When unset, the mock defaults it from the cover_type (see
   *  `addCoverStates`). Pass `'none'` to emit NO device_class (fallback proof). */
  device_class?: string;
  /** Explicit `icon` attribute on the cover entity. When set, the card honors
   *  it over the device_class glyph (mirrors HA's explicit-icon precedence). */
  icon?: string;
  /** HA state override, e.g. 'unavailable' — when set, wins over the
   *  position-derived open/closed state. */
  state?: string;
  /** This cover's own command target in the logical frame, published on the
   *  position_verification sensor's `per_entity` map and read by the tile's
   *  rail target tick. Defaults to the entry target. Set it per cover to model
   *  a rail whose dispatched value is a remap of the entry target — a day/night
   *  shade's middle rail carries the fabric blend folded into an absolute
   *  position.
   *
   *  Set it to `null` for the OTHER live shape: `per_entity[…].target` is a
   *  RECONCILIATION record, so it stays null (alongside a null
   *  `last_reconcile_time`) until the integration has actually dispatched to
   *  that entity — and a cover already resting on the calculated position is
   *  skipped as `same_position` and never dispatched to at all. A mirrored entry
   *  driving several identical shades therefore publishes a number for the one
   *  cover it reconciled and null for the rest.
   *
   *  The tile draws NO TICK on such a rail. It does not borrow the entry target,
   *  because it cannot tell a mirrored rail (entry scale, borrowing would be
   *  right) from a remapped one (own scale, borrowing would be wrong). The fix
   *  belongs upstream — adaptive-cover-pro#1158. */
  command_target?: number | null;
  /** Battery charge for this cover, 0..100. Emits a `device_class: battery`
   *  sensor on the cover's own device — the same shape a Zigbee shade motor
   *  produces, and the only thing `resolveCoverBatteries` looks for. Omit for a
   *  mains-powered cover (no battery entity at all, nothing renders); `null`
   *  emits the sensor as `unknown`, which the card treats as low. */
  battery?: number | null;
}

export interface HarnessEntry {
  /** Stable id used both as HA config_entry_id and unique_id prefix. */
  entry_id: string;
  title: string;
  /** HA area name the entry's mock device is assigned to (issue #247). Wired
   *  into the mock `hass.devices[…].area_id` / `hass.areas` so the tile
   *  card's composite `name` `{ type: 'area' }` part has something to
   *  resolve. Undefined = no area (mirrors an unassigned real device). */
  area?: string;
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
  /** Optional [left, right] blind spot relative to window normal — slot 1
   *  shorthand. Ignored when {@link blind_spot_ranges} is set. */
  blind_spot_range?: [number, number];
  /** Every configured blind-spot slot (the integration allows three). When set
   *  it replaces {@link blind_spot_range}, and the mock emits it the way the
   *  integration does: `blind_spot_ranges` carries the whole list while the
   *  legacy `blind_spot_range` carries only the first entry. Use a degenerate
   *  first slot (`[0, 0]`) to reproduce #269 — a card reading only the legacy
   *  attribute then draws nothing. */
  blind_spot_ranges?: Array<[number, number]>;
  /** Reproduces the #269/#274 upstream diagnostics omission
   *  (jrhubott/adaptive-cover-pro#1291): the decision pipeline still evaluates
   *  {@link blind_spot_range}/{@link blind_spot_ranges} for `in_blind_spot`,
   *  but the sun sensor omits BOTH `blind_spot_range` and `blind_spot_ranges`
   *  from its published attributes — so the card gets the boolean with no
   *  geometry to draw a wedge from. Exercises the compass's "Blind spot
   *  active" fallback indicator. */
  blind_spot_geometry_unavailable?: boolean;
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
    /** Pre-interpolation logical position the Cover_Position sensor's
     *  `linear_position` attribute carries (issue #219). null = attribute
     *  absent — simulates an older integration or interpolation not configured
     *  for this axis; the card falls back to `state` (today's behavior). */
    linear_position: number | null;
    /** Simulate an `inverse_state` install (issue #234): the integration
     *  dispatches `100 − logical`, so the Cover_Position sensor STATE, its
     *  `actual_positions` and the mock source cover entity all go cover-frame,
     *  while `linear_position` / `linear_actual_positions` stay logical and the
     *  discovery position axis carries `inverted: true`. Combine with
     *  `legacyIntegration` to reproduce the pre-#1033 residual, where the card
     *  has no frame oracle and renders the defect. */
    inverse_state: boolean;
    /** Simulate an `inverse_tilt` install (issue #236): the venetian second
     *  axis carries its own inversion option (the integration's
     *  `CONF_INVERSE_TILT`, `interpolatable=False`, so interpolation never
     *  suppresses it). The mock reports the cover-frame `current_tilt_position`
     *  (`100 − logical`) on the source cover and marks the discovery tilt axis
     *  `inverted: true`, while the Cover_Tilt target sensor stays LOGICAL —
     *  the integration publishes the pre-`_to_wire` target there. */
    inverse_tilt: boolean;
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
  /** Cover Group entries only — the group view's climate on/off toggle. */
  show_climate: boolean;
  show_decision_summary: boolean;
  /** Color the header cover icon by state, HA-style (default true). */
  state_color: boolean;
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
  /** Title override (issue #247). A plain string is used verbatim; an
   *  {@link AcpNamePart} array composes a title from the entry's discovered
   *  title / area / literal text parts. Undefined = the discovered entry
   *  title (today's default). */
  name?: string | AcpNamePart[];
  /* Cover Group entries only — the group tile ignores everything else here
     except show_controls / show_position_bar / show_tilt / state_color. */
  show_scene_select: boolean;
  show_lock: boolean;
  show_automation: boolean;
  show_climate: boolean;
  show_clear_overrides: boolean;
  show_member_badges: boolean;
  /** Per-member roster display-name overrides, keyed by member entry_id (or a
   *  generic cover's entity_id). Mirrors the card's `member_names`. */
  member_names?: Record<string, string>;
  /** Roster order + subset as COVER entity ids (NOT {@link member_names}'s
   *  per-row keys). Absent = the integration's own order with every member
   *  shown. Mirrors the card's `members`. */
  members?: string[];
  show_position: boolean;
  show_state: boolean;
  show_decision_summary: boolean;
  show_controls: boolean;
  show_badge: boolean;
  /** Render the target-vs-actual position bar (default true). Independent of
   *  `show_badge`. */
  show_position_bar: boolean;
  /** Render the mini tilt bar on dual-axis venetian tiles (default true). */
  show_tilt: boolean;
  /** Which position rails to render, in order. Empty = every managed cover in
   *  the integration's own order. */
  covers: string[];
  /** Which managed cover the ↑■↓ buttons drive. Empty = the tile's resolved
   *  cover (today's behavior). Only meaningful on a multi-cover entry, e.g. a
   *  day/night shade's two rails. */
  controls_cover: string;
  /** Which discovered axis the ↑■↓ buttons drive. Empty = `position`. */
  controls_axis: string;
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
  /** Color the cover state icon by state (open/opening/closing = active tier,
   *  closed = inactive tier, unavailable = unavailable tier). Default true. */
  state_color: boolean;
  /** Card config `icon_tap_action`. `none` (the default, matching HA for the
   *  cover domain) leaves the glyph bare; anything else gives it its own tap
   *  target AND turns on HA's tinted pill behind it. */
  icon_tap_action: 'none' | 'more-info' | 'toggle';
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

export interface HistoryCardOptions {
  enabled: boolean;
  title: string;
  /** Window length in hours (mirrors HISTORY_HOUR_CHOICES). */
  hours: number;
  track_position: boolean;
  track_who_won: boolean;
  track_context: boolean;
  track_actions: boolean;
  advanced_open: boolean;
  hide_advanced: boolean;
  /** Simulate an OLD integration with no `get_diagnostics` service, so the
   *  card hides the Advanced section instead of rendering a dead affordance. */
  noDiagnosticsService: boolean;
  /** How many synthetic events the mock event buffer emits. 0 exercises the
   *  "buffer present but empty" path. */
  eventCount: number;
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
  /** Scripted mode only (issue #223): additional handlers to mark `matched: true`
   *  in the trace alongside `scriptedWinner`, without making them win. Lets a
   *  scenario reproduce a real decision trace where more than one handler
   *  contributes in the same cycle (e.g. climate matched, default wins) — the
   *  derived `decide()` pipeline can only ever mark one row matched. Omitted /
   *  empty = no extra matched rows (existing scripted scenarios unaffected). */
  scriptedAlsoMatched?: HandlerName[];
  /** Per-card render options. */
  root: RootCardOptions;
  compass: SkyCompassCardOptions;
  tile: TileCardOptions;
  decision: DecisionCardOptions;
  solarChart: SolarChartCardOptions;
  history: HistoryCardOptions;
  /** Floating-tooltip behavior, threaded into all three card configs. */
  tooltips: TooltipsOptions;
  /** Fixed stage height in px for the Sky Compass card, mimicking HA's
   *  fixed grid-row height in a Sections dashboard. 0 = grow freely (the
   *  harness default). A positive value caps the compass card-host and clips
   *  overflow so the issue #146 clip is reproducible. */
  stageHeight: number;
}
