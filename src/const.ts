export const CARD_VERSION = '2.15.0';
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
export const HISTORY_CARD_NAME = 'adaptive-cover-pro-history-card';
export const HISTORY_CARD_EDITOR_NAME = 'adaptive-cover-pro-history-card-editor';

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
  motion: 'Occupancy Timeout',
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
  cover_venetian: 'mdi:blinds',
};

export const COVER_TYPE_ICONS_OPEN: Record<string, string> = {
  cover_blind: 'mdi:blinds-open',
  cover_awning: 'mdi:awning-outline',
  cover_tilt: 'mdi:blinds-open',
  cover_venetian: 'mdi:blinds-open',
};

export const COVER_TYPE_ICONS_CLOSED: Record<string, string> = {
  cover_blind: 'mdi:blinds-horizontal-closed',
  cover_awning: 'mdi:window-closed-variant',
  cover_tilt: 'mdi:blinds',
  cover_venetian: 'mdi:blinds',
};

export const COVER_ICON_FALLBACK = 'mdi:window-shutter';
export const COVER_ICON_FALLBACK_OPEN = 'mdi:window-shutter-open';
export const COVER_ICON_FALLBACK_CLOSED = 'mdi:window-shutter';
/** Distinct glyph for a hard-offline cover entity — HA `unavailable`/missing
 *  only, per {@link isOffline} in `lib/formatters.ts` (issue #212; narrowed off
 *  `unknown` by issue #232) — neutral/offline-looking, independent of
 *  position-derived variants. */
export const COVER_ICON_FALLBACK_UNAVAILABLE = 'mdi:help-rhombus-outline';

export const COVER_OPEN_THRESHOLD = 95;
export const COVER_CLOSED_THRESHOLD = 5;

/**
 * Position-aware open/partial/closed glyphs keyed by the underlying HA cover
 * `device_class`. Mirrors HA's own native tile / more-info cover icons so a
 * cover renders the same glyph the user already sees elsewhere in HA, instead
 * of the integration's coarse `cover_type` mapping.
 *
 * Values are runtime `mdi:*` strings resolved by HA's icon set (same as every
 * `<ha-icon icon="mdi:…">`), so this costs a small object literal — no
 * `@mdi/js` import, bundle-neutral. `partial` is used for any non-open,
 * non-closed position (and for a null/unknown position), matching HA's
 * "not closed ⇒ open"-leaning behavior.
 */
export interface CoverIconVariants {
  open: string;
  partial: string;
  closed: string;
}

export const COVER_DEVICE_CLASS_ICONS: Record<string, CoverIconVariants> = {
  awning: {
    open: 'mdi:awning-outline',
    partial: 'mdi:awning-outline',
    closed: 'mdi:awning-outline',
  },
  blind: {
    open: 'mdi:blinds-open',
    partial: 'mdi:blinds-horizontal',
    closed: 'mdi:blinds-horizontal-closed',
  },
  curtain: { open: 'mdi:curtains', partial: 'mdi:curtains', closed: 'mdi:curtains-closed' },
  damper: { open: 'mdi:circle', partial: 'mdi:circle-slice-8', closed: 'mdi:circle-slice-8' },
  door: { open: 'mdi:door-open', partial: 'mdi:door-open', closed: 'mdi:door-closed' },
  garage: { open: 'mdi:garage-open', partial: 'mdi:garage-open', closed: 'mdi:garage' },
  gate: { open: 'mdi:gate-open', partial: 'mdi:gate-open', closed: 'mdi:gate' },
  shade: {
    open: 'mdi:roller-shade',
    partial: 'mdi:roller-shade',
    closed: 'mdi:roller-shade-closed',
  },
  shutter: {
    open: 'mdi:window-shutter-open',
    partial: 'mdi:window-shutter',
    closed: 'mdi:window-shutter',
  },
  window: { open: 'mdi:window-open', partial: 'mdi:window-open', closed: 'mdi:window-closed' },
};

/**
 * device_class values whose open/close controls use HA's horizontal
 * expand/collapse affordance (`<|>` / `>|<`) instead of the default up/down
 * arrows — awnings, curtains, doors, and gates. Everything else keeps the
 * vertical arrows.
 */
export const COVER_BUTTON_INSET_CLASSES = new Set<string>(['awning', 'curtain', 'door', 'gate']);

export const COVER_OPEN_ICON = 'mdi:arrow-up';
export const COVER_CLOSE_ICON = 'mdi:arrow-down';
export const COVER_OPEN_ICON_INSET = 'mdi:arrow-expand-horizontal';
export const COVER_CLOSE_ICON_INSET = 'mdi:arrow-collapse-horizontal';

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
  | 'off_schedule'
  | 'group';

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
  // A member cover the group drives wins with one of these handlers; surface
  // it as the "Group" badge so the who-won display reads as group-controlled
  // (issue #185) instead of falling through to the generic "Auto".
  group_scene: 'group',
  group_lock: 'group',
};

interface BadgeTokens {
  label: string;
  /** The saturated hue this kind is identified by — the single value both
   *  {@link bg} and {@link fg} are derived from, so a kind cannot end up with a
   *  tint and a text color that disagree. */
  accent: string;
  bg: string;
  fg: string;
}

/** Accent share in the background tint, as a percentage. Per kind, because the
 *  originals were hand-tuned and reproducing them keeps this a contrast change
 *  rather than a redesign.
 *
 *  Exported because the floor chip is the same construct rendered by hand in two
 *  stylesheets rather than through {@link BADGE_TOKENS}, and it must not drift
 *  from the badges it sits beside. */
export const ACCENT_BG_ALPHA = 22;

/**
 * Accent share in the foreground; the remaining 60% is the THEME'S OWN text
 * color. One ratio for all thirteen kinds, chosen because it clears 4.5:1
 * against every kind's tint on both HA default themes — the darkest case is
 * `custom_position` on dark at 6.1:1 and `motion` on light at 4.7:1.
 *
 * This is what replaced the fixed dark `fg` literals each kind used to carry.
 * Those were picked against a light background, and the comment here used to
 * claim they were hard-coded "so the badge reads the same regardless of theme";
 * what they actually did was read correctly on one theme and wash out on the
 * other — `custom_position` measured 1.6:1 on HA's dark theme and `auto` 2.4:1,
 * against a 4.5:1 AA floor. Mixing with `--primary-text-color` leans each hue
 * dark on a light theme and light on a dark one from a single declaration, and
 * follows a CUSTOM theme too, which a `prefers-color-scheme` media query would
 * not — it reads the OS, not Home Assistant.
 */
export const FG_ACCENT_MIX = 40;

function badgeTokens(label: string, accent: string, bgAlpha = ACCENT_BG_ALPHA): BadgeTokens {
  return {
    label,
    accent,
    bg: `color-mix(in srgb, ${accent} ${bgAlpha}%, transparent)`,
    fg: `color-mix(in srgb, ${accent} ${FG_ACCENT_MIX}%, var(--primary-text-color, #212121))`,
  };
}

/**
 * Visual tokens per badge kind. Every consumer applies these through an inline
 * `style=` (the badge itself, the history who-won bands and legend swatches),
 * so both values must stay valid CSS colors rather than raw hex.
 */
export const BADGE_TOKENS: Record<BadgeKind, BadgeTokens> = {
  auto: badgeTokens('Auto', '#4caf50', 18),
  manual: badgeTokens('Manual', '#ff9800'),
  force: badgeTokens('Force', '#f44336'),
  weather: badgeTokens('Sun protection', '#f44336'),
  glare_zone: badgeTokens('Glare', '#f44336'),
  climate: badgeTokens('Climate', '#009688'),
  cloud: badgeTokens('Cloudy', '#2196f3'),
  custom_position: badgeTokens('Custom', '#9c27b0'),
  solar: badgeTokens('Solar tracking', '#4caf50'),
  motion: badgeTokens('Occupancy', '#ffeb3b'),
  off: badgeTokens('Off', '#616161', 28),
  off_schedule: badgeTokens('Off-schedule', '#607d8b'),
  // Cover Group who-won count badge (issue #185). Shares the `auto` palette:
  // group-driven IS normal automatic operation from the member's point of view,
  // so it should read as calm/green rather than as an exception. The label and
  // icon keep it distinguishable. Applied via `kindOverride` for the "N/M"
  // count badge, and derived from a winner for a group-driven member.
  group: badgeTokens('Group', '#4caf50', 18),
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
  group: 'badge.group',
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
  group: 'mdi:window-shutter-cog',
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
  | 'reset_override_button'
  // Cover Group roles (issue #185). Present only on a Cover Group config entry;
  // an ordinary cover entry never exposes any of these. `group_active_scene_sensor`
  // is the always-present detection marker (`is_group`).
  | 'group_position_sensor'
  | 'group_state_sensor'
  | 'group_active_scene_sensor'
  | 'group_climate_mode_sensor'
  | 'group_who_won_sensor'
  | 'group_scene_select'
  | 'group_automation_switch'
  | 'group_lock_switch'
  | 'group_scene_all_open_button'
  | 'group_scene_all_closed_button'
  | 'group_scene_privacy_button'
  | 'group_clear_overrides_button'
  | 'group_cover';

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

/**
 * Derived map (NOT a role rename): axis id → the card role of the sensor
 * carrying that axis's solar target. The integration's `AxisDescriptor.id`
 * values (`position`, `tilt`) map onto the existing target-sensor roles. A
 * future third axis would need its own target-sensor role here once the
 * integration ships one.
 */
export const AXIS_TARGET_SENSOR_ROLES: Record<string, EntityRole> = {
  position: 'target_position_sensor',
  tilt: 'target_tilt_sensor',
};

/**
 * Card i18n dotted keys for known axis ids. These WIN over discovery-supplied
 * `label`s because the integration currently emits English-only labels, so
 * preferring the card i18n keeps de/fr localized. Axes with no card key fall
 * back to the discovery label, then a capitalized raw id.
 */
export const AXIS_LABEL_I18N_KEYS: Record<string, string> = {
  position: 'covers.position_title',
  tilt: 'covers.tilt_title',
};

/**
 * Glyph for every History affordance. This is the icon Home Assistant registers
 * for its own History panel (`homeassistant/components/history/__init__.py`:
 * `async_register_built_in_panel(hass, "history", "history", "mdi:chart-box")`),
 * so the card's History button reads as the same concept users already know
 * from the sidebar and the native more-info dialog. Keep them in lock-step.
 */
export const HISTORY_ICON = 'mdi:chart-box';

/** Default History-card window, in hours back from now. One local day. */
export const HISTORY_DEFAULT_HOURS = 24;

/**
 * Entities drawn as HA-style labeled state-timeline bars in the History card —
 * the stacked equivalent of the single-entity History bar in HA's own more-info
 * dialog. Order is render order: the two master switches first (they gate
 * everything below), then the conditions ACP reacts to, then the outcome.
 *
 * `cls` selects the "on" band color in `history-view.ts`; the "off" band is
 * always HA's neutral gray, matching the native timeline.
 */
/**
 * i18n keys for the `control_status` sensor's values.
 *
 * These are NOT handler names — they are the integration's `ControlStatus` enum
 * (`const.py` §23), i.e. *why the integration is or isn't commanding the cover*.
 * The winning handler lives on the `decision_trace` sensor instead. Conflating
 * the two makes every status render as the generic "Auto" badge, since none of
 * these strings appear in {@link HANDLER_I18N_KEYS}.
 *
 * `force_override_active` is retained for pre-2.28 integrations (Force Override
 * merged into Custom Positions), matching the note on {@link HANDLER_ORDER}.
 */
export const CONTROL_STATUS_I18N_KEYS: Record<string, string> = {
  active: 'control_status.active',
  outside_time_window: 'control_status.outside_time_window',
  position_delta_too_small: 'control_status.position_delta_too_small',
  time_delta_too_small: 'control_status.time_delta_too_small',
  manual_override: 'control_status.manual_override',
  automatic_control_off: 'control_status.automatic_control_off',
  sun_not_visible: 'control_status.sun_not_visible',
  force_override_active: 'control_status.force_override_active',
  weather_override_active: 'control_status.weather_override_active',
  motion_timeout: 'control_status.motion_timeout',
};

/** Control-status values that mean "acting normally". Everything else is a
 *  reason the cover is being left alone, and is colored as such. */
export const CONTROL_STATUS_ACTIVE = new Set(['active']);

export const STATE_TRACKS: ReadonlyArray<{ role: EntityRole; key: string; cls: string }> = [
  { role: 'integration_enabled_switch', key: 'history.track_enabled', cls: 'ctx-enabled' },
  { role: 'automatic_control_switch', key: 'history.track_auto', cls: 'ctx-auto' },
  { role: 'sun_infront_binary', key: 'history.track_sun', cls: 'ctx-sun' },
  { role: 'glare_active_binary', key: 'history.track_glare', cls: 'ctx-glare' },
  { role: 'manual_override_binary', key: 'history.track_manual', cls: 'ctx-manual' },
  { role: 'position_mismatch_binary', key: 'history.track_mismatch', cls: 'ctx-mismatch' },
];

/** Selectable History-card windows (hours). Offered by the visual editor. */
export const HISTORY_HOUR_CHOICES = [6, 12, 24, 48, 72] as const;

/**
 * How each diagnostic event buffer entry is presented in the Advanced section.
 *
 * Sourced from the integration's `_event_buffer.record({... "event": <name>})`
 * call sites (coordinator.py, pipeline/registry.py, the transit/reconcile
 * managers). `severity` drives the row's accent color only — it is a display
 * hint, not a claim about integration behavior.
 *
 * Unknown event names are NOT an error: the card renders them with the `info`
 * severity and a humanized name, so a new integration event type shows up
 * without a card release. Keep entries here in lock-step when the integration
 * adds an event worth calling out.
 */
export type EventSeverity = 'info' | 'action' | 'warn';

export const EVENT_SEVERITY: Record<string, EventSeverity> = {
  pipeline_evaluated: 'info',
  cover_command_sent: 'action',
  cover_command_skipped: 'warn',
  end_time_default_sent: 'action',
  manual_override_gate_closed: 'warn',
  sun_entered_fov: 'info',
  sun_left_fov: 'info',
  sunset_window_opened: 'info',
  transit_cleared: 'info',
  transit_optimistic_target_replay: 'info',
  transit_progress_forward: 'info',
  transit_startup_delay: 'warn',
  transit_timeout_cleared: 'warn',
  reconcile_gave_up: 'warn',
  reconcile_skipped_in_transit: 'warn',
};

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

  // Cover Group entities (issue #185). All snake_case translation-key suffixes on
  // the `adaptive_cover_pro` platform. `sensor:group_active_scene` is created
  // unconditionally for every group and is the card's group-detection marker.
  'sensor:group_position': 'group_position_sensor',
  'sensor:group_state': 'group_state_sensor',
  'sensor:group_active_scene': 'group_active_scene_sensor',
  'sensor:group_climate_mode': 'group_climate_mode_sensor',
  'sensor:group_who_won': 'group_who_won_sensor',
  'select:group_scene_select': 'group_scene_select',
  'switch:group_automation': 'group_automation_switch',
  'switch:group_lock': 'group_lock_switch',
  'button:group_scene_all_open': 'group_scene_all_open_button',
  'button:group_scene_all_closed': 'group_scene_all_closed_button',
  'button:group_scene_privacy': 'group_scene_privacy_button',
  'button:group_clear_overrides': 'group_clear_overrides_button',
  'cover:group_cover': 'group_cover',
};
