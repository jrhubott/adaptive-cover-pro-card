import type { HomeAssistant, LovelaceCardConfig } from 'custom-card-helpers';
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
  show_version?: boolean;
  hide_inactive_handlers?: boolean;
  controls?: {
    integration_enabled?: boolean;
    automatic_control?: boolean;
    reset_manual_override?: boolean;
  };
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
  cover_colors?: (string | null)[];
}

export interface DiscoveredEntities {
  entry_id: string;
  entry_title: string;
  cover_type: 'cover_blind' | 'cover_awning' | 'cover_tilt' | string;
  entities: Partial<Record<EntityRole, string>>;
  /** Underlying HA cover entity_ids the integration controls. */
  managed_covers: string[];
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
