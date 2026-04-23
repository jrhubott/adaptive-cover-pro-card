export const CARD_VERSION = '1.3.0';
export const CARD_NAME = 'adaptive-cover-pro-card';
export const CARD_EDITOR_NAME = 'adaptive-cover-pro-card-editor';
export const SKY_COMPASS_CARD_NAME = 'adaptive-cover-pro-sky-compass-card';
export const SKY_COMPASS_CARD_EDITOR_NAME = 'adaptive-cover-pro-sky-compass-card-editor';

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

/** Logical slots the card binds to. */
export type EntityRole =
  | 'target_position_sensor'
  | 'sun_sensor'
  | 'start_sensor'
  | 'end_sensor'
  | 'control_status_sensor'
  | 'decision_trace_sensor'
  | 'last_action_sensor'
  | 'last_skipped_sensor'
  | 'manual_override_end_sensor'
  | 'position_verification_sensor'
  | 'motion_status_sensor'
  | 'force_override_sensor'
  | 'climate_status_sensor'
  | 'sun_infront_binary'
  | 'manual_override_binary'
  | 'position_mismatch_binary'
  | 'glare_active_binary'
  | 'integration_enabled_switch'
  | 'automatic_control_switch'
  | 'manual_toggle_switch'
  | 'climate_mode_switch'
  | 'motion_control_switch'
  | 'reset_override_button';

/**
 * Map (platform, unique_id suffix) → card role.
 *
 * Every ACP entity's unique_id is `{entry_id}_{suffix}` where the suffix is
 * set by the integration — it is immutable for the lifetime of the entity (not
 * affected by entity_id renames, device renames, or translation changes). This
 * is the authoritative identity field, sourced from the HA entity registry via
 * `config/entity_registry/list` websocket command.
 *
 * Platform must be part of the key: `manual_override` is used by both the
 * binary sensor (platform `binary_sensor`) and the switch (platform `switch`,
 * with capitalization: `Manual Override`). Platform disambiguates.
 *
 * Suffixes below are copied verbatim from:
 *   sensor.py    — super().__init__(..., "suffix", ...) calls
 *   binary_sensor.py — `f"{unique_id}_{key}"` / `f"{unique_id}_position_mismatch"`
 *   switch.py    — `f"{entry_id}_{switch_name}"`
 *   button.py    — `f"{entry_id}_Reset Manual Override"`
 */
export type ControlFlags = {
  integration_enabled: boolean;
  automatic_control: boolean;
  reset_manual_override: boolean;
};

export const DEFAULT_CONTROL_FLAGS: ControlFlags = {
  integration_enabled: true,
  automatic_control: true,
  reset_manual_override: true,
};

export function resolveControlFlags(
  cfg: { controls?: Partial<ControlFlags> } | undefined,
): ControlFlags {
  return { ...DEFAULT_CONTROL_FLAGS, ...cfg?.controls };
}

export const UNIQUE_ID_ROLES: Record<string, EntityRole> = {
  // sensor
  'sensor:Cover_Position': 'target_position_sensor',
  'sensor:sun_position': 'sun_sensor',
  'sensor:Start Sun': 'start_sensor',
  'sensor:End Sun': 'end_sensor',
  'sensor:control_status': 'control_status_sensor',
  'sensor:decision_trace': 'decision_trace_sensor',
  'sensor:last_cover_action': 'last_action_sensor',
  'sensor:last_skipped_action': 'last_skipped_sensor',
  'sensor:manual_override_end_time': 'manual_override_end_sensor',
  'sensor:position_verification': 'position_verification_sensor',
  'sensor:motion_status': 'motion_status_sensor',
  'sensor:force_override_triggers': 'force_override_sensor',
  'sensor:climate_status': 'climate_status_sensor',

  // binary_sensor
  'binary_sensor:sun_motion': 'sun_infront_binary',
  'binary_sensor:manual_override': 'manual_override_binary',
  'binary_sensor:position_mismatch': 'position_mismatch_binary',
  'binary_sensor:glare_active': 'glare_active_binary',

  // switch (note: different case/spacing than the binary_sensor keys)
  'switch:Integration Enabled': 'integration_enabled_switch',
  'switch:Automatic Control': 'automatic_control_switch',
  'switch:Manual Override': 'manual_toggle_switch',
  'switch:Climate Mode': 'climate_mode_switch',
  'switch:Motion Control': 'motion_control_switch',

  // button
  'button:Reset Manual Override': 'reset_override_button',
};
