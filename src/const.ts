export const CARD_VERSION = '0.1.1';
export const CARD_NAME = 'adaptive-cover-pro-card';
export const CARD_EDITOR_NAME = 'adaptive-cover-pro-card-editor';

export const INTEGRATION_DOMAIN = 'adaptive_cover_pro';

/**
 * The 10 Adaptive Cover Pro pipeline handlers in priority order (highest first).
 * Must match `control_method` enum values emitted by the integration.
 * Keep the ordering in lock-step with `custom_components/adaptive_cover_pro/pipeline/registry.py`.
 */
export const HANDLER_ORDER = [
  'force',
  'weather',
  'manual',
  'custom_position',
  'motion',
  'cloud',
  'climate',
  'glare_zone',
  'solar',
  'default',
] as const;

export type HandlerName = (typeof HANDLER_ORDER)[number];

export const HANDLER_LABELS: Record<HandlerName, string> = {
  force: 'Force Override',
  weather: 'Weather Safety',
  manual: 'Manual Override',
  custom_position: 'Custom Position',
  motion: 'Motion Timeout',
  cloud: 'Cloud Suppression',
  climate: 'Climate',
  glare_zone: 'Glare Zone',
  solar: 'Solar Tracking',
  default: 'Default',
};

export const COVER_TYPE_ICONS: Record<string, string> = {
  cover_blind: 'mdi:blinds-horizontal',
  cover_awning: 'mdi:awning-outline',
  cover_tilt: 'mdi:blinds',
};

/**
 * Maps an ACP entity's translation_key (set in sensor.py etc.) to a logical role
 * the card uses. Used by `entity-discovery.ts` to map a config_entry_id to named slots.
 */
export const TRANSLATION_KEY_ROLES = {
  cover_position: 'target_position_sensor',
  sun_position: 'sun_sensor',
  control_status: 'control_status_sensor',
  decision_trace: 'decision_trace_sensor',
  last_cover_action: 'last_action_sensor',
  last_skipped_action: 'last_skipped_sensor',
  manual_override_end_time: 'manual_override_end_sensor',
  position_verification: 'position_verification_sensor',
  motion_status: 'motion_status_sensor',
  force_override_triggers: 'force_override_sensor',
  climate_status: 'climate_status_sensor',
  sun_motion: 'sun_infront_binary',
  manual_override: 'manual_override_binary',
  position_mismatch: 'position_mismatch_binary',
  glare_active: 'glare_active_binary',
  integration_enabled: 'integration_enabled_switch',
  automatic_control: 'automatic_control_switch',
  manual_toggle: 'manual_toggle_switch',
  climate_mode: 'climate_mode_switch',
  motion_control: 'motion_control_switch',
  reset_manual_override: 'reset_override_button',
} as const;

export type EntityRole = (typeof TRANSLATION_KEY_ROLES)[keyof typeof TRANSLATION_KEY_ROLES];
