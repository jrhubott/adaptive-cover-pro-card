import type { ActionConfig, HomeAssistant, LovelaceCardConfig } from 'custom-card-helpers';
import type { EntityRole, HandlerName } from './const';

export type { HomeAssistant };

export type CardSection = 'sky' | 'elevation' | 'decision' | 'covers' | 'overrides' | 'climate';

export interface AdaptiveCoverProCardConfig extends LovelaceCardConfig {
  type: string;
  entry_id: string;
  show_sections?: CardSection[];
  compact?: boolean;
  show_compass_stats?: boolean;
  show_compass_legend?: boolean;
  show_moon?: boolean;
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
  /** Render the contextual badge (default true). Master switch for the tile
   *  badge — `badges` filters within it. */
  show_badge?: boolean;
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
  /** Render a small motion indicator overlaid on the cover icon when the
   *  motion handler reports `motion_detected` (default true). */
  show_motion_icon?: boolean;
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
}

export interface DiscoveredEntities {
  entry_id: string;
  entry_title: string;
  cover_type: 'cover_blind' | 'cover_awning' | 'cover_tilt' | string;
  entities: Partial<Record<EntityRole, string>>;
  /** Underlying HA cover entity_ids the integration controls. */
  managed_covers: string[];
  /** HA device the integration's entities are attached to. Used to deep-link
   *  into `/config/devices/device/<id>` from the more-info dialog. */
  device_id?: string;
}

export interface DecisionStep {
  handler: string;
  matched: boolean;
  reason: string;
  position: number | null;
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
  /** 1-based slot number of the winning Custom Position handler.
   *  Integration v2.22.1+; absent when any other handler wins. */
  custom_position_active_slot?: 1 | 2 | 3 | 4;
  /** True when the configured floor is actively raising position above the raw
   *  autonomous calculation. False when the floor is configured but is a no-op
   *  this cycle. Absent in exact mode or when any non-custom handler wins. */
  custom_position_minimum_mode?: boolean;
  /** Friendly name of the winning slot's bound sensor — surfaces as the
   *  human-readable slot label. Integration v2.22.1+; absent when the sensor
   *  has no friendly_name. */
  custom_position_active_slot_name?: string;
  /** Snapshot of all 4 custom-position slots' configured state.
   *  Stable 4-row list (one per slot); unconfigured slots read `sensor=null`.
   *  Absent on integrations that pre-date the slot UI work. */
  custom_position_slots?: CustomPositionSlotSnapshot[];
}

export interface ForecastSample {
  t: string;
  position: number;
  handler: 'solar' | 'default' | string;
}

export interface ForecastEvent {
  t: string;
  kind: 'sunrise' | 'sunset' | 'fov_enter' | 'fov_exit' | string;
  label: string;
}

export interface PositionForecastAttributes {
  forecast: ForecastSample[];
  events: ForecastEvent[];
}

export interface CustomPositionSlotSnapshot {
  slot: 1 | 2 | 3 | 4;
  enabled: boolean;
  sensor: string | null;
  sensor_name: string | null;
  position: number | null;
  priority: number | null;
  min_mode: boolean | null;
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
  schedule_start?: string | null;
  schedule_end?: string | null;
}

export interface CoverPositionAttributes {
  actual_positions: Record<string, number | null>;
  all_at_target: boolean;
  control_method: HandlerName | string;
  reason: string;
  raw_calculated_position?: number;
  edge_case_detected?: boolean;
  safety_margin?: number;
  effective_distance?: number;
}
