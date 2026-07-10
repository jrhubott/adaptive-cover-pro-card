export const CARD_VERSION = '2.10.1';
export const CARD_NAME = 'adaptive-cover-pro-card';
export const CARD_EDITOR_NAME = 'adaptive-cover-pro-card-editor';
export const SKY_COMPASS_CARD_NAME = 'adaptive-cover-pro-sky-compass-card';
export const SKY_COMPASS_CARD_EDITOR_NAME = 'adaptive-cover-pro-sky-compass-card-editor';
export const TILE_CARD_NAME = 'adaptive-cover-pro-tile-card';
export const TILE_CARD_EDITOR_NAME = 'adaptive-cover-pro-tile-card-editor';
export const DECISION_CARD_NAME = 'adaptive-cover-pro-decision-card';
export const DECISION_CARD_EDITOR_NAME = 'adaptive-cover-pro-decision-card-editor';
export const SOLAR_CHART_CARD_NAME = 'adaptive-cover-pro-solar-chart-card';
export const SOLAR_CHART_CARD_EDITOR_NAME = 'adaptive-cover-pro-solar-chart-card-editor';

export const INTEGRATION_DOMAIN = 'adaptive_cover_pro';

/**
 * Mirrors the integration's `ManualOverrideHandler.priority` (manual_override.py).
 * A min-mode slot floor resists a manual ↓ only when its slot priority strictly
 * exceeds this value; at or below it, the manual button bypasses the floor.
 * The integration does not expose this threshold in the decision trace, so it is
 * hardcoded here. Keep it in lock-step with the integration handler.
 */
export const MANUAL_OVERRIDE_PRIORITY = 80;

/**
 * Priority of the safety custom-position slot (slot 5) in integration v2.28.0+.
 * The former standalone Force Override feature merged into Custom Positions as a
 * priority-100 slot that bypasses the time window and delta send-gates. The card
 * detects a "safety" winner by this priority rather than by a handler name, so
 * the migrated feature keeps its red, force-styled badge. Keep in lock-step with
 * the integration's safety-slot priority.
 */
export const CUSTOM_POSITION_SAFETY_PRIORITY = 100;

/**
 * The Adaptive Cover Pro pipeline handlers in priority order (highest first).
 * Must match `control_method` enum values emitted by the integration.
 * Keep the ordering in lock-step with `custom_components/adaptive_cover_pro/pipeline/registry.py`.
 * `floor_clamp` is a post-processing step that raises the output above the raw
 * calculation; it follows all handler decisions in priority.
 *
 * `group_lock` (priority 100) and `group_scene` (priority 85) are emitted only on
 * member covers of a Cover Group entry. They sit next to the ordinary handlers of
 * the same priority: `group_lock` beside `custom_position` (both 100) and
 * `group_scene` between `weather` (90) and `manual` (80).
 */
// NOTE: the `force` handler (and its HANDLER_LABELS/HANDLER_I18N_KEYS/
// BADGE_KINDS_BY_HANDLER/BADGE_TOKENS/BADGE_ICONS/BADGE_I18N_KEYS entries plus
// the `force_override → force` map in normalizeHandler) is retained for
// pre-2.28 integration builds. v2.28.0+ merged Force Override into Custom
// Positions (slot 5 / priority 100) and no longer emits `force`/`force_override`
// as a winner, but older builds still do — keep these entries so the card
// degrades gracefully across versions.
export const HANDLER_ORDER = [
  'force',
  'weather',
  'group_scene',
  'manual',
  'group_lock',
  'custom_position',
  'motion',
  'cloud',
  'climate',
  'glare_zone',
  'solar',
  'default',
  'floor_clamp',
] as const;

export type HandlerName = (typeof HANDLER_ORDER)[number];

export const HANDLER_LABELS: Record<HandlerName, string> = {
  force: 'Force Override',
  weather: 'Weather Safety',
  group_scene: 'Group Scene',
  manual: 'Manual Override',
  group_lock: 'Group Lock',
  custom_position: 'Custom Position',
  motion: 'Motion Timeout',
  cloud: 'Cloud Suppression',
  climate: 'Climate',
  glare_zone: 'Glare Zone',
  solar: 'Solar Tracking',
  default: 'Default',
  floor_clamp: 'Min Floor',
};

/**
 * i18n dotted keys for each pipeline handler. Callers with access to `hass`
 * resolve labels via `t(HANDLER_I18N_KEYS[handler], hass)`; callers without
 * `hass` fall back to `HANDLER_LABELS` for the EN string.
 */
export const HANDLER_I18N_KEYS: Record<HandlerName, string> = {
  force: 'handler.force',
  weather: 'handler.weather',
  group_scene: 'handler.group_scene',
  manual: 'handler.manual',
  group_lock: 'handler.group_lock',
  custom_position: 'handler.custom_position',
  motion: 'handler.motion',
  cloud: 'handler.cloud',
  climate: 'handler.climate',
  glare_zone: 'handler.glare_zone',
  solar: 'handler.solar',
  default: 'handler.default',
  floor_clamp: 'handler.floor_clamp',
};

export const COVER_TYPE_ICONS: Record<string, string> = {
  cover_blind: 'mdi:blinds-horizontal',
  cover_awning: 'mdi:awning-outline',
  cover_tilt: 'mdi:blinds',
};

export const COVER_TYPE_ICONS_OPEN: Record<string, string> = {
  cover_blind: 'mdi:blinds-open',
  cover_awning: 'mdi:awning-outline',
  cover_tilt: 'mdi:blinds-open',
};

export const COVER_TYPE_ICONS_CLOSED: Record<string, string> = {
  cover_blind: 'mdi:blinds-horizontal-closed',
  cover_awning: 'mdi:window-closed-variant',
  cover_tilt: 'mdi:blinds',
};

export const COVER_ICON_FALLBACK = 'mdi:window-shutter';
export const COVER_ICON_FALLBACK_OPEN = 'mdi:window-shutter-open';
export const COVER_ICON_FALLBACK_CLOSED = 'mdi:window-shutter';

export const COVER_OPEN_THRESHOLD = 95;
export const COVER_CLOSED_THRESHOLD = 5;

/**
 * Badge kinds rendered on the tile card. Each ACP pipeline handler maps to one
 * kind; `auto` is the fallback for unknown / "default" winners.
 */
export type BadgeKind =
  | 'auto'
  | 'manual'
  | 'force'
  | 'weather'
  | 'glare_zone'
  | 'climate'
  | 'cloud'
  | 'custom_position'
  | 'solar'
  | 'motion'
  | 'off'
  | 'off_schedule';

/**
 * Map a normalized winner-handler name to its badge kind. Anything not in this
 * table (including `default` and unknown handler names) falls through to `auto`.
 */
export const BADGE_KINDS_BY_HANDLER: Partial<Record<HandlerName, BadgeKind>> = {
  manual: 'manual',
  force: 'force',
  weather: 'weather',
  glare_zone: 'glare_zone',
  climate: 'climate',
  cloud: 'cloud',
  custom_position: 'custom_position',
  solar: 'solar',
  motion: 'motion',
};

interface BadgeTokens {
  label: string;
  bg: string;
  fg: string;
}

/**
 * Visual tokens per badge kind. Colors are chosen against the HA dark/light
 * background defaults; they're intentionally hard-coded rather than driven by
 * `var(--*)` so the badge reads the same regardless of theme.
 */
export const BADGE_TOKENS: Record<BadgeKind, BadgeTokens> = {
  auto: { label: 'Auto', bg: 'rgba(76, 175, 80, 0.18)', fg: '#2e7d32' },
  manual: { label: 'Manual', bg: 'rgba(255, 152, 0, 0.22)', fg: '#e65100' },
  force: { label: 'Force', bg: 'rgba(244, 67, 54, 0.22)', fg: '#b71c1c' },
  weather: { label: 'Sun protection', bg: 'rgba(244, 67, 54, 0.22)', fg: '#b71c1c' },
  glare_zone: { label: 'Glare', bg: 'rgba(244, 67, 54, 0.22)', fg: '#b71c1c' },
  climate: { label: 'Climate', bg: 'rgba(0, 150, 136, 0.22)', fg: '#00695c' },
  cloud: { label: 'Cloudy', bg: 'rgba(33, 150, 243, 0.22)', fg: '#0d47a1' },
  custom_position: { label: 'Custom', bg: 'rgba(156, 39, 176, 0.22)', fg: '#6a1b9a' },
  solar: { label: 'Solar tracking', bg: 'rgba(76, 175, 80, 0.22)', fg: '#1b5e20' },
  motion: { label: 'Motion', bg: 'rgba(255, 235, 59, 0.22)', fg: '#827717' },
  off: { label: 'Off', bg: 'rgba(97, 97, 97, 0.28)', fg: '#212121' },
  off_schedule: { label: 'Off-schedule', bg: 'rgba(96, 125, 139, 0.22)', fg: '#37474f' },
};

/**
 * i18n dotted keys for each badge kind. Callers with access to `hass`
 * resolve labels via `t(BADGE_I18N_KEYS[kind], hass)`; the EN values in
 * `BADGE_TOKENS[kind].label` are kept as a fallback when `hass` is missing
 * (e.g. unit tests, isolated component renders).
 */
export const BADGE_I18N_KEYS: Record<BadgeKind, string> = {
  auto: 'badge.auto',
  manual: 'badge.manual',
  force: 'badge.force',
  weather: 'badge.weather',
  glare_zone: 'badge.glare_zone',
  climate: 'badge.climate',
  cloud: 'badge.cloud',
  custom_position: 'badge.custom_position',
  solar: 'badge.solar',
  motion: 'badge.motion',
  off: 'badge.off',
  off_schedule: 'badge.off_schedule',
};

/**
 * Leading mdi icon rendered inside each badge.
 */
export const BADGE_ICONS: Record<BadgeKind, string> = {
  auto: 'mdi:autorenew',
  manual: 'mdi:hand-back-right',
  force: 'mdi:flash',
  weather: 'mdi:shield-sun',
  glare_zone: 'mdi:weather-sunny-alert',
  climate: 'mdi:thermostat',
  cloud: 'mdi:weather-cloudy',
  custom_position: 'mdi:bookmark',
  solar: 'mdi:white-balance-sunny',
  motion: 'mdi:motion-sensor',
  off: 'mdi:power',
  off_schedule: 'mdi:clock-alert-outline',
};

/** Logical slots the card binds to. */
export type EntityRole =
  | 'target_position_sensor'
  | 'target_tilt_sensor'
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
  | 'climate_status_sensor'
  | 'position_forecast_sensor'
  | 'solar_calculation_sensor'
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
  // Venetian dual-axis only — present when the integration's cover type exposes
  // a tilt (slat-angle) axis. Its presence is the card's dual-axis gate.
  'sensor:Cover_Tilt': 'target_tilt_sensor',
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
  // NOTE: `sensor:force_override_triggers` was removed in v2.28.0 (Force Override
  // merged into Custom Positions slot 5 / priority 100). The sensor no longer
  // exists, so its role mapping is dropped.
  'sensor:climate_status': 'climate_status_sensor',
  'sensor:position_forecast': 'position_forecast_sensor',
  'sensor:solar_calculation': 'solar_calculation_sensor',

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
