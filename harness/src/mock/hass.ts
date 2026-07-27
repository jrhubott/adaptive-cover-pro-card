import type { HomeAssistant } from 'custom-card-helpers';
import {
  HANDLER_I18N_KEYS,
  HANDLER_LABELS,
  INTEGRATION_DOMAIN,
  type HandlerName,
} from '../../../src/const';
import type { HarnessConfig, HarnessEntry, ManagedCoverCfg } from '../types';
import { zoneForLongitude } from '../zone';
import { buildRegistry, entityIdFor } from './registry';
import { buildDivergentHistory, buildTiltHistory, type CompressedState } from './history';
import {
  buildActionHistory,
  buildBinaryHistory,
  buildControlStatusHistory,
  buildDiagnosticsResponse,
  buildLogbook,
  buildTargetHistory,
  buildSkippedHistory,
  buildWinnerHistory,
  MOCK_USER_ID,
  type CompressedSensorState,
  type LogbookRow,
} from './events';
import { buildStates, type GeneratedStates } from './state-gen';

export interface ServiceCallEvent {
  ts: number;
  domain: string;
  service: string;
  data: Record<string, unknown> | undefined;
  target: { entity_id?: string } | undefined;
}

export interface MockHassBundle {
  hass: HomeAssistant;
  generated: GeneratedStates;
}

/** The non-cover roles the History card reads recorder history for. Mirrors
 *  the card's own STATE_TRACKS plus the target/status/action sensors. */
const HISTORY_ROLES = [
  'target_position_sensor',
  'target_tilt_sensor',
  'control_status_sensor',
  'decision_trace_sensor',
  'last_action_sensor',
  'last_skipped_sensor',
  'integration_enabled_switch',
  'automatic_control_switch',
  'sun_infront_binary',
  'glare_active_binary',
  'manual_override_binary',
  'position_mismatch_binary',
] as const;

type HistoryRole = (typeof HISTORY_ROLES)[number];

/** Synthesize the recorder series for one History-card role. Each role gets a
 *  distinct rhythm so the stacked tracks don't all change at the same instants. */
function buildSensorSeries(
  entry: HarnessEntry,
  role: HistoryRole,
  startMs: number,
  nowMs: number,
  generated: GeneratedStates,
): CompressedSensorState[] {
  const HOUR = 60 * 60 * 1000;
  switch (role) {
    case 'target_position_sensor':
      return buildTargetHistory(entry, startMs, nowMs);
    case 'target_tilt_sensor':
      return buildTargetHistory(
        { ...entry, target_position: entry.target_tilt ?? 50 },
        startMs,
        nowMs,
      );
    // Two DIFFERENT axes, deliberately given different values and rhythms:
    // `decision_trace` publishes the winning handler, `control_status` publishes
    // the ControlStatus enum. The mock previously fed handler names to
    // `control_status`, which hid the card reading the wrong sensor.
    case 'decision_trace_sensor': {
      const live = generated.decisions.get(entry.entry_id)?.winner ?? 'default';
      return buildWinnerHistory(live, startMs, nowMs);
    }
    case 'control_status_sensor':
      return buildControlStatusHistory(startMs, nowMs);
    case 'last_action_sensor':
      return buildActionHistory(startMs, nowMs);
    case 'last_skipped_sensor':
      return buildSkippedHistory(startMs, nowMs);
    // The two master switches sit "on" for almost the whole window, with one
    // short off span — the shape a real install shows, and the case the card's
    // narrow-band label suppression has to handle.
    case 'integration_enabled_switch':
      return buildBinaryHistory(startMs, nowMs, 24 * HOUR, 0.96);
    case 'automatic_control_switch':
      return buildBinaryHistory(startMs, nowMs, 14 * HOUR, 0.85);
    case 'sun_infront_binary':
      return buildBinaryHistory(startMs, nowMs, 8 * HOUR, 0.45);
    case 'glare_active_binary':
      return buildBinaryHistory(startMs, nowMs, 6 * HOUR, 0.2);
    case 'manual_override_binary':
      return buildBinaryHistory(startMs, nowMs, 11 * HOUR, 0.15);
    case 'position_mismatch_binary':
      return buildBinaryHistory(startMs, nowMs, 9 * HOUR, 0.08);
  }
}

const FALLBACK_LOCALIZATIONS: Record<string, string> = {
  'header.on': 'On',
  'header.off': 'Off',
  'header.auto': 'Auto',
  'header.integration_enabled': 'Integration enabled',
  'header.automatic_control': 'Automatic control',
  'badge.auto': 'Auto',
  'badge.manual': 'Manual',
  'badge.force': 'Force',
  'badge.weather': 'Sun protection',
  'badge.glare_zone': 'Glare',
  'badge.climate': 'Climate',
  'badge.cloud': 'Cloudy',
  'badge.custom_position': 'Custom',
  'badge.solar': 'Solar tracking',
  'badge.motion': 'Occupancy',
  'badge.off': 'Off',
  'badge.off_schedule': 'Off-schedule',
  'badge.safety': 'Safety',
  'badge.group': 'Group',
  // Cover Group tile (issue #185)
  'group.title': 'Cover Group',
  'group.scene': 'Scene',
  'group.scene_auto': 'Auto',
  'group.scene_all_open': 'All open',
  'group.scene_all_closed': 'All closed',
  'group.scene_privacy': 'Privacy',
  'group.state_open': 'Open',
  'group.state_closed': 'Closed',
  'group.state_mixed': 'Mixed',
  'group.state_unknown': 'Unknown',
  'group.lock': 'Lock group',
  'group.unlock': 'Unlock group',
  'group.automation': 'Automation',
  'group.automation_count': '{count} of {total} members automating',
  'group.clear_overrides': 'Clear overrides',
  'group.clear_overrides_none': 'No member overrides to clear',
  'group.who_won':
    '{count} of {total} members are group-driven — a group scene or the group lock is currently deciding their position',
  'group.members': 'Members',
  'group.member_placeholder': 'No members reported by the integration.',
  'group.position': 'Position',
  'group.open': 'Open group',
  'group.close': 'Close group',
  'group.stop': 'Stop group',
  'group.position_slider_label': 'Group position',
  'decision.outside_schedule': 'Outside schedule — automatic control paused',
  'decision.outside_schedule_tooltip':
    'The configured schedule window is not active, so automatic positioning is paused.',
  'decision.solar_would_be': 'solar {pct}',
  'decision.next_change_in': 'Next adjustment allowed in {time}',
  'elevation.schedule': 'Schedule {from} – {to}',
  'elevation.schedule_from': 'Schedule from {from}',
  'elevation.schedule_until': 'Schedule until {to}',
  'elevation.schedule_start_tooltip': 'Schedule start',
  'elevation.schedule_end_tooltip': 'Schedule end',
  'compass.in_fov_tooltip': 'Sun is currently within this window’s sun acceptance angle',
  // Cover legend rows (#158): the solid wedge is the target, the dashed ring the
  // held position. Mirror the real en.ts strings so the harness legend renders
  // real text instead of the raw i18n keys.
  'compass.cover_target': 'Cover target',
  'compass.cover_held': 'Cover position (held)',
  'compass.window_fov': 'Window SAA',
  'compass.window_normal': 'Window azimuth',
  'compass.sun': 'Sun',
  'compass.moon': 'Moon',
  // COVERS bar header + marker tooltip (#158): plain vs solar-target labelling
  // and the base vs override marker tooltips.
  'covers.title': 'Covers',
  'covers.target': 'Target: {pct}',
  'covers.target_solar': 'Solar target: {pct}',
  'covers.target_tooltip': 'Target {pct}%',
  'covers.target_tooltip_override':
    'Would-be solar target {pct}% — cover is held by manual override',
  'covers.click_to_set': 'Click to set position',
  // Accessible name for the Position track's role="slider" (issue #231).
  'covers.position_slider_label': 'Cover position slider',
  'covers.placeholder': 'No covers reported by the integration.',
  'root.loading_registry': 'Loading entity registry…',
  'root.no_entities_title': 'No matching entities',
  'root.footer_version': 'adaptive-cover-pro-card v{version}',
  'editor.common.support_alt': 'Buy me a coffee',
  'tile.loading': 'Loading…',
  'tile.entry_not_found': 'Entry not found ({entry})',
  'tile.registry_failed': 'Registry failed: {error}',
  'tile.open': 'Open',
  'tile.close': 'Close',
  'tile.stop': 'Stop',
  'tile.resume': 'Resume',
  'tile.resume_aria': 'Resume automation',
  'tile.extend_aria': 'Extend manual override',
  'dialog.extend.title': 'Extend manual override',
  'dialog.extend.presets_label': 'Until',
  'dialog.extend.relative_label': 'Add time',
  'dialog.extend.absolute_label': 'End at',
  'dialog.extend.preview': 'Override until {time}',
  'dialog.extend.confirm': 'Extend',
  'dialog.extend.cancel': 'Cancel',
  'dialog.extend.tomorrow_suffix': ' (tomorrow)',
  'tile.motion_detected': 'Occupancy detected',
  'tile.motion_pending': 'Occupancy timeout',
  'dialog.floor': '↥',
  'dialog.floor_tooltip': 'Custom position floor is raising the calculated value.',
  'badge.floor_suffix': ' ↥',
  // Forecast-strip legend (actual-vs-forecast overlay).
  'forecast.legend_forecast': 'Forecast',
  'forecast.legend_actual': 'Actual',
};

for (const h of Object.keys(HANDLER_LABELS)) {
  const handler = h as HandlerName;
  FALLBACK_LOCALIZATIONS[HANDLER_I18N_KEYS[handler]] = HANDLER_LABELS[handler];
}

function localize(key: string, args?: Record<string, string | number>): string {
  const tmpl = FALLBACK_LOCALIZATIONS[key] ?? key;
  if (!args) return tmpl;
  return tmpl.replace(/\{(\w+)\}/g, (_, k) => String(args[k] ?? ''));
}

export function buildMockHass(
  cfg: HarnessConfig,
  onServiceCall: (e: ServiceCallEvent) => void,
): MockHassBundle {
  const generated = buildStates(cfg);
  const registry = buildRegistry(cfg.entries);
  const devices: Record<
    string,
    { id: string; name: string; config_entries: string[]; area_id?: string }
  > = {};
  // Mirrors `area_id` per entry into a slugified area registry id, so the
  // tile card's composite `name` `{ type: 'area' }` part (issue #247) has a
  // real `hass.devices[…].area_id` -> `hass.areas[…].name` chain to resolve,
  // same as a real HA install.
  const areas: Record<string, { area_id: string; name: string }> = {};
  const areaIdFor = (name: string): string => `area_${name.toLowerCase().replace(/\s+/g, '_')}`;
  for (const e of cfg.entries) {
    const areaId = e.area ? areaIdFor(e.area) : undefined;
    devices[`device_${e.entry_id}`] = {
      id: `device_${e.entry_id}`,
      name: e.title,
      config_entries: [e.entry_id],
      ...(areaId ? { area_id: areaId } : {}),
    };
    if (areaId && e.area) areas[areaId] = { area_id: areaId, name: e.area };
  }

  // Cover entity_id -> { entry, cover, index } for mocking recorder position
  // history. `index` lets the mock give each cover of a multi-cover entry its
  // own trajectory, so the History card's per-cover lines have something to
  // separate (see buildDivergentHistory).
  const coverLookup = new Map<
    string,
    { entry: HarnessEntry; cover: ManagedCoverCfg; index: number }
  >();
  for (const e of cfg.entries) {
    e.covers.forEach((c, index) => coverLookup.set(c.entity_id, { entry: e, cover: c, index }));
  }

  // Non-cover entity_id -> { entry, role } for mocking the History card's
  // recorder reads (who-won, actions, and the context binary sensors). The
  // cover lookup above only covers physical `cover.*` entities.
  const sensorLookup = new Map<string, { entry: HarnessEntry; role: HistoryRole }>();
  for (const e of cfg.entries) {
    for (const role of HISTORY_ROLES) {
      sensorLookup.set(entityIdFor(e, role), { entry: e, role });
    }
  }

  // hass.callWS handles the entity-registry list, config-entries, and
  // recorder-history calls.
  const callWS = async <T>(msg: {
    type: string;
    entity_ids?: string[];
    start_time?: string;
  }): Promise<T> => {
    if (msg.type === 'config/entity_registry/list') {
      return registry as unknown as T;
    }
    if (msg.type === 'history/history_during_period') {
      const nowMs = generated.now.getTime();
      // The History card asks for an N-hour window ending now; the more-info
      // dialog asks for midnight→now. Honor whatever start the caller sent so
      // both windows render correctly against the same mock.
      const startMs = msg.start_time ? Date.parse(msg.start_time) : nowMs - 24 * 60 * 60 * 1000;
      const result: Record<string, CompressedState[] | CompressedSensorState[]> = {};
      for (const id of msg.entity_ids ?? []) {
        const cover = coverLookup.get(id);
        if (cover) {
          const samples = generated.samplesByEntry.get(cover.entry.entry_id) ?? [];
          const position = buildDivergentHistory(
            cover.entry,
            cover.cover,
            cover.index,
            samples,
            nowMs,
          );
          // A venetian cover advertises a slat axis, so its recorded states must
          // also carry `current_tilt_position` for the History tilt track.
          result[id] =
            cover.entry.cover_type === 'cover_venetian'
              ? [...position, ...buildTiltHistory(cover.entry, cover.cover, startMs, nowMs)].sort(
                  (a, b) => a.lu - b.lu,
                )
              : position;
          continue;
        }
        const sensor = sensorLookup.get(id);
        if (sensor) {
          result[id] = buildSensorSeries(sensor.entry, sensor.role, startMs, nowMs, generated);
          continue;
        }
        result[id] = [];
      }
      return result as unknown as T;
    }
    if (msg.type === 'logbook/get_events') {
      // HA's Activity feed. The card asks for the ACP switches/binary sensors
      // plus the physical covers; the mock answers for the first entry, which
      // is the one the History card is pointed at.
      const nowMs = generated.now.getTime();
      const startMs = msg.start_time ? Date.parse(msg.start_time) : nowMs - 24 * 60 * 60 * 1000;
      const rows: LogbookRow[] = cfg.entries[0] ? buildLogbook(cfg.entries[0], startMs, nowMs) : [];
      return rows as unknown as T;
    }
    if (msg.type === 'config_entries/get') {
      // Return the harness entries as simulated cover-profile config entries so
      // the card editor's instance picker still shows them after the platform
      // filter was added in fetchAcpConfigEntries (issue #176).
      return cfg.entries.map((e) => ({
        entry_id: e.entry_id,
        title: e.title,
        domain: INTEGRATION_DOMAIN,
      })) as unknown as T;
    }
    return [] as unknown as T;
  };

  // Subscription is a no-op; we drive re-renders by re-assigning hass.
  const subscribeEvents = async (
    _cb: (ev: { data: unknown }) => void,
    _eventType: string,
  ): Promise<() => void> => {
    return () => {};
  };

  const callService = (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: { entity_id?: string },
    _notifyOnError?: boolean,
    returnResponse?: boolean,
  ): Promise<void | { response: unknown }> => {
    onServiceCall({ ts: Date.now(), domain, service, data, target });
    // `get_diagnostics` is SupportsResponse.ONLY — the History card's Advanced
    // section reads the event buffer out of its response (see
    // src/lib/event-timeline.ts). Reproduce HA's `{ response }` envelope.
    if (domain === INTEGRATION_DOMAIN && service === 'get_diagnostics' && returnResponse) {
      const requested = (data?.config_entry_id as string[] | undefined) ?? [];
      const entry = cfg.entries.find((e) => requested.includes(e.entry_id)) ?? cfg.entries[0];
      return Promise.resolve({
        response: buildDiagnosticsResponse(
          entry,
          generated.now.getTime(),
          cfg.history.eventCount,
          50,
        ),
      });
    }
    return Promise.resolve();
  };

  // Integration service registry the card feature-detects (issues #180, #229).
  // Under the legacy flag `set_axes` is omitted so `setAxes` falls back to the
  // per-axis legacy services, and `engage_manual_override` is omitted so the
  // badge's Extend affordance hides (integrations before v2026.7.0).
  const services = {
    [INTEGRATION_DOMAIN]: {
      set_position: {},
      set_tilt: {},
      stop: {},
      set_custom_position: {},
      group_set_position: {},
      // `group_stop` shipped with the aggregate group cover, so the legacy flag
      // withholds it too — that's the branch where `groupStop` falls back to a
      // plain `cover.stop_cover` fan-out over the member roster.
      ...(cfg.legacyIntegration
        ? {}
        : { set_axes: {}, engage_manual_override: {}, group_stop: {} }),
      // The History card feature-detects this before rendering its Advanced
      // section; the toggle simulates an integration that predates it.
      ...(cfg.history.noDiagnosticsService ? {} : { get_diagnostics: {} }),
    },
  };

  // A `person` entity carrying `user_id` — the card resolves logbook attribution
  // through these rather than the admin-only user list, so a non-admin viewer
  // still sees who moved a cover (see `resolveTriggeredBy`). The harness must
  // carry one or that path is never exercised.
  const states: Record<string, unknown> = {
    ...generated.states,
    'person.harness_user': {
      entity_id: 'person.harness_user',
      state: 'home',
      attributes: { friendly_name: 'Harness User', user_id: MOCK_USER_ID },
      last_changed: generated.now.toISOString(),
      last_updated: generated.now.toISOString(),
      context: { id: 'person' },
    },
  };

  const hass = {
    states: states as unknown as HomeAssistant['states'],
    services,
    config: {
      latitude: cfg.latitude,
      longitude: cfg.longitude,
      // Report the zone matching the configured longitude (not the dev
      // machine's) so the card anchors its sun day to the *location's* day.
      time_zone: zoneForLongitude(cfg.longitude),
      unit_system: { temperature: '°C', length: 'km', mass: 'kg' },
    } as unknown as HomeAssistant['config'],
    language: (cfg.language ?? 'en') as HomeAssistant['language'],
    locale: {
      language: cfg.language ?? 'en',
      number_format: 'comma_decimal',
      time_format: '24',
    } as unknown as HomeAssistant['locale'],
    themes: { darkMode: cfg.theme === 'dark' } as unknown as HomeAssistant['themes'],
    user: {
      id: MOCK_USER_ID,
      name: 'Harness User',
      is_admin: true,
      is_owner: true,
    } as unknown as HomeAssistant['user'],
    devices,
    areas,
    callService: callService as unknown as HomeAssistant['callService'],
    callWS: callWS as unknown as HomeAssistant['callWS'],
    connection: {
      subscribeEvents,
    } as unknown as HomeAssistant['connection'],
    localize: ((key: string, ...rest: unknown[]) => {
      const args: Record<string, string | number> = {};
      for (let i = 0; i < rest.length; i += 2) {
        const k = rest[i];
        const v = rest[i + 1];
        if (typeof k === 'string' && (typeof v === 'string' || typeof v === 'number')) {
          args[k] = v;
        }
      }
      return localize(key, args);
    }) as unknown as HomeAssistant['localize'],
    // HA's formatEntityState returns the localized, title-cased state
    // ("Open", "Closed", "Opening", …); mirror that so the harness matches the
    // real card instead of showing the raw lowercase state.
    formatEntityState: (stateObj: { state: string }): string =>
      stateObj.state
        ? stateObj.state.charAt(0).toUpperCase() + stateObj.state.slice(1)
        : stateObj.state,
  } as unknown as HomeAssistant;

  return { hass, generated };
}
