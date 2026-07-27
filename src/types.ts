import type { ActionConfig, HomeAssistant, LovelaceCardConfig } from 'custom-card-helpers';
import type { EntityRole, HandlerName } from './const';

export type { HomeAssistant };

export type CardSection =
  | 'sky'
  | 'elevation'
  | 'decision'
  | 'covers'
  | 'overrides'
  | 'climate'
  | 'solar';

/**
 * Card-owned floating-tooltip configuration. When `enabled === false` the card
 * falls back to native browser `title=` tooltips. `offset` is the [right, down]
 * pixel offset of the bubble from the cursor; `delay` is the open delay (ms).
 */
export interface TooltipsConfig {
  enabled?: boolean;
  offset?: [number, number];
  delay?: number;
}

export interface AdaptiveCoverProCardConfig extends LovelaceCardConfig {
  type: string;
  entry_id: string;
  show_sections?: CardSection[];
  compact?: boolean;
  show_compass_stats?: boolean;
  show_compass_legend?: boolean;
  show_moon?: boolean;
  /** Color the header cover state icon by its HA state (open/opening/closing =
   *  active tier, closed/unknown = inactive tier, unavailable/missing =
   *  unavailable tier), matching HA's own theme-aware `--state-cover-*`
   *  cascade (default true). */
  state_color?: boolean;
  hide_inactive_handlers?: boolean;
  /** Render a plain-English "Why this position?" sentence above the decision
   *  strip's row grid. Defaults to true. */
  show_decision_summary?: boolean;
  north_offset?: number;
  /** Per-overlay color overrides for the embedded sky compass, indexed by
   *  discovery order. Same shape as `SkyCompassCardConfig.cover_colors`. */
  cover_colors?: (string | null)[];
  controls?: {
    integration_enabled?: boolean;
    automatic_control?: boolean;
    reset_manual_override?: boolean;
  };
  /** Card-owned floating tooltip behavior. Defaults: enabled, offset [12,16],
   *  delay 400ms. Set `enabled: false` to use native browser tooltips. */
  tooltips?: TooltipsConfig;
}

export interface AdaptiveCoverProTileCardConfig extends LovelaceCardConfig {
  type: string;
  entry_id: string;
  /** Override the discovered instance title. */
  name?: string;
  /** Override the auto-resolved cover icon (mdi:*). */
  icon?: string;
  /** Explicit `cover.*` entity when an entry manages multiple covers
   *  (default: first key of the integration's `actual_positions`). */
  cover?: string;
  /** Render the cover's current position to the right of the title. */
  show_position?: boolean;
  /** Render the cover's localized state ("Open" / "Closed" / "Opening" / …)
   *  in the position slot. Combined with `show_position`, renders as
   *  "Open · 12%". Defaults to true. */
  show_state?: boolean;
  /** Render the plain-English decision-summary sentence under the title. */
  show_decision_summary?: boolean;
  /** Render the ↑■▼ controls row (default true). */
  show_controls?: boolean;
  /** Render the mini tilt (slat-angle) bar for dual-axis venetian covers
   *  (default true). Self-hides when the entry exposes no `Cover_Tilt` sensor,
   *  and on the `one-line` layout (tilt folds into the readout there). */
  show_tilt?: boolean;
  /** Render the contextual badge (default true). Master switch for ACP's own
   *  chrome badges — the Auto indicator, the winner/Manual badge, AND the
   *  minimum-mode floor chip. `badges` filters the winner kinds within it.
   *  Independent of the position bar (see `show_position_bar`). */
  show_badge?: boolean;
  /** Render the target-vs-actual position bar on the chrome row (default true).
   *  Independent of `show_badge` — the bar still shows when badges are hidden,
   *  and hides on its own when this is false. Detailed layout only. */
  show_position_bar?: boolean;
  /** Per-kind opt-in for the 10 configurable badge kinds. Omitted/undefined =
   *  on; only `=== false` hides. `off` is a state-fallback and is never
   *  filtered by this. */
  badges?: {
    auto?: boolean;
    solar?: boolean;
    force?: boolean;
    weather?: boolean;
    manual?: boolean;
    custom_position?: boolean;
    motion?: boolean;
    climate?: boolean;
    glare_zone?: boolean;
    cloud?: boolean;
    off_schedule?: boolean;
  };
  /** Render the sky compass inside the more-info dialog's Advanced section
   *  (default true). */
  show_compass?: boolean;
  /** Render the "Sun today" elevation chart inside the more-info dialog's
   *  Advanced section (default true). */
  show_elevation_chart?: boolean;
  /** Render the Solar Calculation breakdown inside the more-info dialog's
   *  Advanced section (default true). Self-hides when the integration is older
   *  and does not expose the `solar_calculation` diagnostic sensor. */
  show_solar_calc?: boolean;
  /** Render a small motion indicator overlaid on the cover icon when the
   *  motion handler reports `motion_detected` (default true). */
  show_motion_icon?: boolean;
  /** Color the cover state icon by its HA state (open/opening/closing =
   *  active tier, closed/unknown = inactive tier, unavailable/missing =
   *  unavailable tier), matching HA's own theme-aware `--state-cover-*`
   *  cascade (default true). */
  state_color?: boolean;
  /** Tile layout. `detailed` (default) stacks title on row 1, an optional
   *  standalone "Auto" indicator on row 2, and state · position + inline winner
   *  badge on row 3, with the controls floating to the right across the rows.
   *  `one-line` is the compact single-row opt-out (no Auto indicator). */
  layout?: 'one-line' | 'detailed';
  /** Tap behavior. When undefined, opens the ACP more-info dialog (default).
   *  Otherwise a standard HA `ActionConfig`. Legacy string values
   *  `'dialog'` / `'none'` are still accepted and normalized in setConfig. */
  tap_action?: ActionConfig | 'dialog' | 'none';
  /** Long-press action. Standard HA `ActionConfig`. */
  hold_action?: ActionConfig;
  /** Double-tap action. Standard HA `ActionConfig`. */
  double_tap_action?: ActionConfig;

  // ── Cover Group entries only (issue #185) ─────────────────────────────────
  // A group entry renders `acp-group-tile`, which shares only `name`, `icon`,
  // `state_color`, `show_controls`, `show_position_bar` and `show_tilt` with the
  // cover tile — everything else above is cover-specific and the visual editor
  // hides it. The options below exist only for a group and are hidden for a
  // cover, so neither editor shows a switch that does nothing.

  /** Render the group's scene `<select>` (default true). */
  show_scene_select?: boolean;
  /** Render the group lock toggle (default true). */
  show_lock?: boolean;
  /** Render the member-automation toggle (default true). */
  show_automation?: boolean;
  /** Render the clear-member-overrides button (default true). Turn it off to
   *  keep a shared dashboard from clearing everyone's overrides. */
  show_clear_overrides?: boolean;
  /** Roll member overrides up onto the group as badges beside the "N/M"
   *  who-won count (default true). See `memberBadgeWinners`. */
  show_member_badges?: boolean;
  /** Card-owned floating tooltip behavior. Defaults: enabled, offset [12,16],
   *  delay 400ms. Set `enabled: false` to use native browser tooltips. */
  tooltips?: TooltipsConfig;
}

export interface SkyCompassCardConfig extends LovelaceCardConfig {
  type: string;
  entry_ids: string[];
  title?: string;
  compact?: boolean;
  show_legend?: boolean;
  show_stats?: boolean;
  show_moon?: boolean;
  show_cardinals?: boolean;
  show_blind_spot?: boolean;
  show_sun_path?: boolean;
  show_sunrise_sunset?: boolean;
  show_cover_fill?: boolean;
  show_window_arrow?: boolean;
  /** Render the "Sun today" elevation-vs-time chart below the compass
   *  (default true). The chart always reflects the integration's elevation
   *  limits when present. */
  show_elevation_chart?: boolean;
  cover_colors?: (string | null)[];
  north_offset?: number;
  /** Card-owned floating tooltip behavior. Defaults: enabled, offset [12,16],
   *  delay 400ms. Set `enabled: false` to use native browser tooltips. */
  tooltips?: TooltipsConfig;
}

export interface SolarChartCardConfig extends LovelaceCardConfig {
  type: string;
  entry_ids: string[];
  title?: string;
  compact?: boolean;
  cover_colors?: (string | null)[];
  /** Card-owned floating tooltip behavior. Defaults: enabled, offset [12,16],
   *  delay 400ms. Set `enabled: false` to use native browser tooltips. */
  tooltips?: TooltipsConfig;
}

export interface AdaptiveCoverProDecisionCardConfig extends LovelaceCardConfig {
  type: string;
  entry_id: string;
  /** Optional header rendered above the strip in the card's `ha-card`. */
  title?: string;
  /** Tighter row layout; also forces `hide_inactive_handlers` on. */
  compact?: boolean;
  /** Show only the winner and actively matched pipeline handlers. */
  hide_inactive_handlers?: boolean;
  /** Render the plain-English "Why this position?" summary above the strip's
   *  row grid. Defaults to true. */
  show_decision_summary?: boolean;
  /** Card-owned floating tooltip behavior. Defaults: enabled, offset [12,16],
   *  delay 400ms. Set `enabled: false` to use native browser tooltips. */
  tooltips?: TooltipsConfig;
}

/** Which History-card tracks are rendered. Every track defaults on; a user
 *  turns one off in the visual editor or YAML. */
export interface HistoryTracksConfig {
  /** Recorder-backed actual cover position over the window. */
  position?: boolean;
  /** Banded strip of the winning pipeline handler over time. */
  who_won?: boolean;
  /** Overlay bands for sun-in-FOV, glare-active, and manual-override spans. */
  context?: boolean;
  /** Scrollable list of cover actions and skipped actions. */
  actions?: boolean;
}

export interface AdaptiveCoverProHistoryCardConfig extends LovelaceCardConfig {
  type: string;
  entry_id: string;
  /** Optional header rendered above the tracks in the card's `ha-card`. */
  title?: string;
  /** Hours of history to show, counting back from now. Defaults to 24. */
  hours?: number;
  /** Per-track opt-out. Omitted tracks default on. */
  tracks?: HistoryTracksConfig;
  /** Start with the Advanced (event buffer) section expanded. Defaults false. */
  advanced_open?: boolean;
  /** Hide the Advanced section entirely, even when the integration exposes
   *  `get_diagnostics`. Defaults false. */
  hide_advanced?: boolean;
  /** Card-owned floating tooltip behavior. Defaults: enabled, offset [12,16],
   *  delay 400ms. Set `enabled: false` to use native browser tooltips. */
  tooltips?: TooltipsConfig;
}

/**
 * One recorded state of any entity, parsed out of HA's
 * `history/history_during_period` response by `lib/state-history.ts`.
 * `t` is epoch-ms (not ISO, unlike {@link PositionHistorySample}) because every
 * consumer does arithmetic on it.
 */
export interface StateSample {
  t: number;
  state: string;
  attributes: Record<string, unknown>;
}

/** A contiguous span during which an entity held one state. Produced by
 *  `toBands()`; `end` is exclusive and the last band runs to the window end. */
export interface HistoryBand {
  start: number;
  end: number;
  state: string;
  attributes: Record<string, unknown>;
}

/**
 * One row of HA's logbook, parsed from `logbook/get_events`. Mirrors the field
 * set in `homeassistant/components/logbook/const.py`, normalized: `t` is epoch
 * **ms** (the wire format is epoch seconds), and every absent/empty field is
 * `null` rather than missing.
 */
export interface LogbookEntry {
  t: number;
  entityId: string | null;
  /** The raw entity_id. `logbook/get_events` is built with
   *  `include_entity_name=False`, so the wire never carries a friendly name —
   *  `activity.ts` resolves one from `hass.states`. */
  name: string;
  /** New state, for state-change rows. Null on component-described events. */
  state: string | null;
  /** Free-form text, for component-described events (null on state changes). */
  message: string | null;
  icon: string | null;
  /** The user who caused it, when HA attributed one. */
  contextUserId: string | null;
  /** The automation/script that caused it, already name-resolved by HA. */
  contextName: string | null;
  contextDomain: string | null;
  contextService: string | null;
}

/**
 * One row of the History card's Activity list. Unifies two sources that answer
 * the same question from different angles: HA's logbook (what changed, and who
 * did it) and ACP's own event buffer (what ACP commanded, and with what
 * parameters — the logbook records only the resulting state, never the
 * service-call arguments).
 */
export interface ActivityRow {
  t: number;
  /** Which source produced the row — drives the icon and accent. */
  source: 'logbook' | 'command';
  /** Primary label: the new state, or the ACP event's action. */
  title: string;
  /** Entity friendly name, when the row is entity-scoped. */
  name: string | null;
  entityId: string | null;
  /** Rendered service parameters, e.g. `position 45%` — command rows only. */
  detail: string | null;
  /** Service the command used, e.g. `cover.set_cover_position`. */
  service: string | null;
  /** "Who did it", resolved for display. Null when unattributed. */
  triggeredBy: string | null;
  /** True when the row records something ACP declined to do. */
  skipped: boolean;
}

/**
 * One entry from the integration's diagnostic event buffer. `event` is the
 * discriminator (`pipeline_evaluated`, `cover_command_sent`, …) and every other
 * key the writer recorded rides in `fields` untouched — the card renders them
 * generically so a new integration event type needs no card change.
 */
export interface AcpEvent {
  /** Raw ISO-8601 timestamp as recorded. */
  ts: string;
  /** `Date.parse(ts)` — epoch ms, guaranteed non-NaN by the parser. */
  t: number;
  event: string;
  fields: Record<string, unknown>;
}

/** The event buffer plus the metadata that makes a snapshot self-describing. */
export interface EventTimeline {
  events: AcpEvent[];
  /** The buffer's own reported data window (`data_window` in diagnostics).
   *  Present even when the buffer is empty. */
  window: { start: string | null; end: string | null; capturedAt: string | null } | null;
  /** Configured ring-buffer capacity (`debug_event_buffer_size`), when reported. */
  bufferSize: number | null;
  /** False when the fetch failed, the service is missing, or the payload was
   *  unusable — distinguishes "no events" from "could not read". */
  available: boolean;
  /** The untouched `get_diagnostics` response, retained so the Advanced section
   *  can copy the whole dump to the clipboard for a bug report. Null when the
   *  fetch failed. */
  raw: unknown;
}

/**
 * One axis of a discovered cover, mirroring the integration's serialized
 * `AxisDescriptor` (`cover_types/base.py` → `asdict`). Every field is optional
 * so the card can read a partial/older payload defensively — a missing field
 * falls back to a card default. Venetian covers expose two axes: `position`
 * (state_attr `current_position`) and `tilt` (state_attr `current_tilt_position`).
 */
export interface AxisDescriptor {
  /** Axis id — also the `set_axes` key AND the legacy `set_position`/`set_tilt`
   *  param name (`position` | `tilt`). */
  id?: string;
  /** English display label (`Position` / `Tilt`). Server-side is English-only
   *  today, so the card prefers its own i18n for known axis ids. */
  label?: string;
  label_key?: string;
  min?: number;
  max?: number;
  unit?: string;
  capability_key?: string;
  /** Attribute on the managed cover entity carrying this axis's live value. */
  state_attr?: string;
  service_attr?: string;
  open_blocks_sun?: boolean;
  /** Rolled up across managed covers (ANY member exposes it). Absent/true =
   *  supported; only `=== false` filters the axis out. */
  supported?: boolean;
  /** True when this axis is *effectively* inverted right now — the integration
   *  dispatches `100 − logical` to the cover, so every value the card reads
   *  from a cover-frame source (the cover entity's `current_position`, the
   *  sensor's `actual_positions`) is the complement of the logical value the
   *  card renders (issue #234). The integration already accounts for
   *  interpolation suppressing position inversion, so the card reads this flag
   *  and must never re-derive it. Absent on older integrations → false. */
  inverted?: boolean;
}

/**
 * The integration's self-discovery descriptor, published on the `control_status`
 * sensor's `cover_discovery` attribute. Additive: older integrations omit it and
 * the card synthesizes an equivalent axis list from today's signals.
 */
export interface CoverDiscovery {
  cover_type?: string;
  cover_label?: string;
  axes?: AxisDescriptor[];
}

export interface DiscoveredEntities {
  entry_id: string;
  entry_title: string;
  cover_type: 'cover_blind' | 'cover_awning' | 'cover_tilt' | 'cover_venetian' | string;
  entities: Partial<Record<EntityRole, string>>;
  /** Underlying HA cover entity_ids the integration controls. */
  managed_covers: string[];
  /** HA device the integration's entities are attached to. Used to deep-link
   *  into `/config/devices/device/<id>` from the more-info dialog. */
  device_id?: string;
  /** True when this entry is a Cover Group (issue #185). Set when the
   *  always-present `group_active_scene` sensor is discovered. When true the
   *  card routes to the group UI and `managed_covers` is the member roster read
   *  from `group_position`'s `member_positions` keys. A cover entry never sets
   *  this, so all existing code paths are unchanged. */
  is_group?: boolean;
  /** Integration self-discovery axis descriptor, when the integration is new
   *  enough to publish `cover_discovery` on the control_status sensor. Absent on
   *  older integrations — the card falls back to synthesizing axes. */
  discovery?: CoverDiscovery;
}

/**
 * Attributes on a Cover Group's `group_position` sensor (issue #185). The sensor
 * state is the aggregate position; `member_positions` maps every member cover
 * entity_id (ACP-managed AND generic `cover.*`) to its live position (null =
 * unknown). Its key count is the full roster size (the who-won "N/M" denominator).
 */
export interface GroupPositionAttributes {
  member_positions: Record<string, number | null>;
}

/**
 * Attributes on a Cover Group's `group_who_won` sensor (issue #185). The sensor
 * state is a bare integer count of ACP members currently driven by the group;
 * `member_winners` maps each ACP member entity_id to its winning handler name
 * (snake_case) or null. Generic covers are absent from this map.
 */
export interface GroupWhoWonAttributes {
  member_winners: Record<string, string | null>;
}

/** Aggregate open/closed state emitted by a Cover Group's `group_state` sensor. */
export type GroupAggregateState = 'open' | 'closed' | 'mixed' | 'unknown';

/** Scene options the group scene `select` exposes / the services accept. */
export type GroupScene = 'auto' | 'all_open' | 'all_closed' | 'privacy';

export interface DecisionStep {
  handler: string;
  matched: boolean;
  reason: string;
  position: number | null;
  /** Position the integration is holding the cover at during a manual override.
   *  Present only when the integration emits it (v2.x+, issue #608).
   *  When present, `position` is the solar would-be target; this field is the
   *  actual held value that should be displayed as the primary position. */
  held_position?: number | null;
}

export interface DecisionTraceAttributes {
  trace: DecisionStep[];
  reason: string;
  /** Handlers that are configured in the integration. Older integrations omit
   *  this; the card falls open and shows all handlers when missing. */
  enabled_handlers?: string[];
  bypass_auto_control: boolean;
  default_position: number;
  is_sunset_active: boolean;
  in_time_window: boolean;
  sun_azimuth: number;
  sun_elevation: number;
  gamma: number;
  in_field_of_view: boolean;
  elevation_valid: boolean;
  in_blind_spot: boolean;
  sunset_window_active: boolean;
  direct_sun_valid: boolean;
  /** Authoritative 3-way sun state ('outside_fov' | 'in_fov_not_valid' |
   *  'hitting') the card uses for the sun-dot colour. Integration v2.x+; absent
   *  on older builds — the card falls back to deriving from direct_sun_valid +
   *  sun_position.in_fov. */
  sun_state?: string;
  /** 1-based slot number of the winning Custom Position handler.
   *  Integration v2.22.1+; absent when any other handler wins. Slot 5 is the
   *  v2.28.0+ safety slot (priority 100) that the former Force Override merged
   *  into. */
  custom_position_active_slot?: 1 | 2 | 3 | 4 | 5;
  /** True when the configured floor is actively raising position above the raw
   *  autonomous calculation. False when the floor is configured but is a no-op
   *  this cycle. Absent in exact mode or when any non-custom handler wins. */
  custom_position_minimum_mode?: boolean;
  /** Friendly name of the winning slot's bound sensor — surfaces as the
   *  human-readable slot label. Integration v2.22.1+; absent when the sensor
   *  has no friendly_name. */
  custom_position_active_slot_name?: string;
  /** Snapshot of all custom-position slots' configured state. Stable list (one
   *  row per slot); unconfigured slots read `sensor=null`. v2.28.0+ adds a 5th
   *  row for the priority-100 safety slot. Absent on integrations that pre-date
   *  the slot UI work. */
  custom_position_slots?: CustomPositionSlotSnapshot[];
}

export interface ForecastSample {
  t: string;
  position: number;
  handler: 'solar' | 'default' | string;
  /** Optional secondary-axis value (e.g. `tilt` for venetian solar-tracking
   *  samples), keyed by the integration's axis name (`CoverAxis.name`).
   *  Additive: present only for cover types that project a secondary axis
   *  and only on solar-handler samples. A card that reads only `position`
   *  is unaffected. */
  [axisKey: string]: string | number | undefined;
}

export interface ForecastEvent {
  t: string;
  kind: 'sunrise' | 'sunset' | 'fov_enter' | 'fov_exit' | string;
  label: string;
}

/**
 * One point of recorded actual cover position over time. Sourced from Home
 * Assistant's recorder (the card has no ready-made history attribute; see
 * `src/lib/position-history.ts`), so `t` is an ISO-8601 datetime and `position`
 * is the aggregate physical position (0–100) across the managed covers.
 */
export interface PositionHistorySample {
  t: string;
  position: number;
}

export interface PositionForecastAttributes {
  forecast: ForecastSample[];
  events: ForecastEvent[];
}

export interface CustomPositionSlotSnapshot {
  slot: 1 | 2 | 3 | 4 | 5;
  enabled: boolean;
  sensor: string | null;
  sensor_name: string | null;
  position: number | null;
  priority: number | null;
  min_mode: boolean | null;
  /** Bound sensors when the slot uses a multi-sensor (template) trigger.
   *  Integration v2.28.0+; absent on single-sensor slots and older builds. */
  sensors?: string[];
  /** True when the slot's trigger is a Jinja template rather than a plain
   *  sensor-state match. Integration v2.28.0+. */
  template?: boolean;
  /** How a multi-sensor slot combines its sensors ('or' | 'and'), or null when
   *  not applicable. Integration v2.28.0+. */
  template_mode?: 'or' | 'and' | null;
}

export interface SunPositionAttributes {
  elevation: number;
  gamma: number;
  window_azimuth: number;
  fov_left: number;
  fov_right: number;
  azimuth_min: number;
  azimuth_max: number;
  in_fov: boolean;
  min_elevation?: number;
  max_elevation?: number;
  blind_spot_range?: [number, number];
}

export interface StartEndSunAttributes {
  azimuth: number;
  elevation: number;
}

/**
 * Attributes on the integration's `control_status` sensor that the card reads.
 * `schedule_start` / `schedule_end` are tz-aware ISO-8601 datetime strings (or
 * null when a bound is blank/open). A midnight end is rolled to the next-day
 * datetime upstream, so the in-schedule window may span midnight.
 */
export interface ControlStatusAttributes {
  cover_type?: string;
  cover_discovery?: CoverDiscovery;
  schedule_start?: string | null;
  schedule_end?: string | null;
}

/**
 * Attributes on the integration's `last_skipped_action` sensor. The sensor's
 * state carries the skip `reason` (e.g. `time_delta_too_small`); these
 * attributes describe the most recent skip. `timestamp` is a UTC ISO-8601
 * datetime; `time_threshold_minutes` is the configured minimum interval.
 */
export interface LastSkippedAttributes {
  timestamp?: string;
  elapsed_minutes?: number;
  time_threshold_minutes?: number;
}

export interface CoverPositionAttributes {
  actual_positions: Record<string, number | null>;
  /** `actual_positions` re-expressed in the logical (HA-convention) frame — the
   *  identity map unless the position axis is inverted, in which case each
   *  entry is `100 − actual` (issue #234). Published unconditionally by new
   *  enough integrations; absent on older ones, where the card falls back to
   *  un-inverting `actual_positions` itself via the axis flag. */
  linear_actual_positions?: Record<string, number | null>;
  /** Per-cover in-transit direction for no-feedback (Somfy-RTS-style) covers,
   *  keyed by cover entity_id. Present only while a cover is mid-move (~45s
   *  window); absent/empty otherwise. Lets the card show motion the way a
   *  position cover shows a changing %. */
  transit_states?: Record<string, 'opening' | 'closing'>;
  all_at_target: boolean;
  control_method: HandlerName | string;
  reason: string;
  raw_calculated_position?: number;
  /** Pre-interpolation logical position — the value the user configured,
   *  before the integration's calibration curve maps it to a motor command
   *  (issue #219). Additive/optional: absent on integrations that don't yet
   *  expose it, or when interpolation isn't configured for this axis — the
   *  card falls back to `state` either way. */
  linear_position?: number;
  edge_case_detected?: boolean;
  safety_margin?: number;
  effective_distance?: number;
}

/**
 * Reason string on the `solar_calculation` sensor's `status` attribute. `Direct
 * Sun` is the live-geometry case; every `Default: *` value means the geometry
 * fell back to the default position for the stated reason (so there is no solar
 * target and `position_pct` is null). Typed as a union for the known v1 values
 * but widened with `string` so an unrecognised future reason still renders.
 */
export type SolarCalcStatus =
  | 'Direct Sun'
  | 'Default: FOV Exit'
  | 'Default: Elevation Limit'
  | 'Default: Sunset Offset'
  | 'Default: Blind Spot'
  | 'Default'
  | string;

/** Keys common to every cover type's `solar_calculation` attribute set. */
interface SolarCalcBase {
  /** Discriminator. */
  cover_type: string;
  /** Sun elevation input (°). */
  sol_elev_deg?: number;
  /** Relative azimuth input (°). */
  gamma_deg?: number;
  /** Raw geometric output (%); null when there is no solar target. */
  position_pct?: number | null;
  /** Reason the calculation produced its output (see {@link SolarCalcStatus}). */
  status?: SolarCalcStatus;
}

/** Vertical-blind solar geometry trace (`cover_blind`). */
export interface SolarCalcBlindAttributes extends SolarCalcBase {
  cover_type: 'cover_blind';
  edge_case_detected?: boolean;
  effective_distance_m?: number;
  effective_distance_source?: string;
  window_depth_contribution_m?: number;
  sill_height_offset_m?: number;
  safety_margin?: number;
  glare_zones_active?: string[];
  cos_gamma?: number;
  cos_gamma_clamped?: number;
  path_length_m?: number;
  base_height_m?: number;
  adjusted_height_m?: number;
  clamped_to_window?: boolean;
}

/** Horizontal-awning solar geometry trace (`cover_awning`). */
export interface SolarCalcAwningAttributes extends SolarCalcBase {
  cover_type: 'cover_awning';
  awn_angle_deg?: number;
  a_angle_deg?: number;
  c_angle_deg?: number;
  vertical_position_m?: number;
  sin_c?: number;
  sin_c_near_zero?: boolean;
  length_m?: number;
  clamped_to_awn_length?: boolean;
}

/** Tilt (slat-angle) solar geometry trace (`cover_tilt`). */
export interface SolarCalcTiltAttributes extends SolarCalcBase {
  cover_type: 'cover_tilt';
  beta_rad?: number;
  discriminant?: number;
  negative_discriminant?: boolean;
  slat_angle_raw_deg?: number | null;
  nan_result?: boolean;
  max_degrees?: number;
  tilt_mode?: string;
}

/**
 * Venetian solar geometry trace (`cover_venetian`): the vertical/position keys
 * at top level plus a nested `tilt` sub-trace for the slat-angle axis.
 */
export interface SolarCalcVenetianAttributes extends Omit<SolarCalcBlindAttributes, 'cover_type'> {
  cover_type: 'cover_venetian';
  tilt?: Omit<SolarCalcTiltAttributes, 'cover_type'> & { cover_type?: string };
}

export type SolarCalculationAttributes =
  | SolarCalcBlindAttributes
  | SolarCalcAwningAttributes
  | SolarCalcTiltAttributes
  | SolarCalcVenetianAttributes;
