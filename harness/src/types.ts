import type { HandlerName } from '../../src/const';

export type CoverType = 'cover_blind' | 'cover_awning' | 'cover_tilt';

export type MotionStatusValue = 'idle' | 'motion_detected' | 'timeout_pending';
export type ClimateStrategy = 'summer_mode' | 'winter_mode' | 'intermediate' | 'unknown';
export type DecisionMode = 'derived' | 'scripted';

export interface CustomPositionSlotCfg {
  slot: 1 | 2 | 3 | 4;
  enabled: boolean;
  position: number;
  name: string;
  min_mode: boolean;
  /** Slot priority 1–99 (mirrors the integration). >80 resists a manual ↓. */
  priority: number;
}

export interface ManagedCoverCfg {
  /** HA cover entity_id, e.g. cover.living_room */
  entity_id: string;
  friendly_name: string;
  /** Live cover position in 0..100; null = unknown */
  position: number | null;
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
    force_override_triggers: number;
    motion_status: MotionStatusValue;
    /** Minutes from now when motion timeout fires. */
    motion_timeout_minutes_from_now: number;
    climate_strategy: ClimateStrategy;
    /** Indoor / outdoor temps to surface in the climate panel. */
    indoor_temp: number;
    outdoor_temp: number;
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
  };
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
  show_motion_icon: boolean;
  layout: 'one-line' | 'detailed';
  /** Simulated tile width in px, mimicking a narrow HA "Sections" column.
   *  0 = auto (the stage grid sizes tiles normally, ≥360px wide). A positive
   *  value pins every tile to exactly that width so the card's narrow-column
   *  responsive behavior (issue #136) can be exercised below 360px. */
  tileWidth: number;
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
  /** Entries to simulate (1..4). */
  entries: HarnessEntry[];
  /** Forces a specific handler winner instead of running the mock pipeline. */
  decisionMode: DecisionMode;
  scriptedWinner: HandlerName;
  /** Per-card render options. */
  root: RootCardOptions;
  compass: SkyCompassCardOptions;
  tile: TileCardOptions;
}
