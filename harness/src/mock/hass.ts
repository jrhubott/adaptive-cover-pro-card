import type { HomeAssistant } from 'custom-card-helpers';
import {
  HANDLER_I18N_KEYS,
  HANDLER_LABELS,
  INTEGRATION_DOMAIN,
  type HandlerName,
} from '../../../src/const';
import type { HarnessConfig, HarnessEntry, ManagedCoverCfg } from '../types';
import { zoneForLongitude } from '../zone';
import { buildRegistry } from './registry';
import { buildActualHistory, type CompressedState } from './history';
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
  'group.clear_overrides': 'Clear overrides',
  'group.who_won': '{count}/{total} group-driven',
  'group.members': 'Members',
  'group.member_placeholder': 'No members reported by the integration.',
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
  const devices: Record<string, { id: string; name: string; config_entries: string[] }> = {};
  for (const e of cfg.entries) {
    devices[`device_${e.entry_id}`] = {
      id: `device_${e.entry_id}`,
      name: e.title,
      config_entries: [e.entry_id],
    };
  }

  // Cover entity_id -> { entry, cover } for mocking recorder position history.
  const coverLookup = new Map<string, { entry: HarnessEntry; cover: ManagedCoverCfg }>();
  for (const e of cfg.entries) {
    for (const c of e.covers) coverLookup.set(c.entity_id, { entry: e, cover: c });
  }

  // hass.callWS handles the entity-registry list, config-entries, and
  // recorder-history calls.
  const callWS = async <T>(msg: { type: string; entity_ids?: string[] }): Promise<T> => {
    if (msg.type === 'config/entity_registry/list') {
      return registry as unknown as T;
    }
    if (msg.type === 'history/history_during_period') {
      const nowMs = generated.now.getTime();
      const result: Record<string, CompressedState[]> = {};
      for (const id of msg.entity_ids ?? []) {
        const found = coverLookup.get(id);
        if (!found) {
          result[id] = [];
          continue;
        }
        const samples = generated.samplesByEntry.get(found.entry.entry_id) ?? [];
        result[id] = buildActualHistory(found.entry, found.cover, samples, nowMs);
      }
      return result as unknown as T;
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
  ): Promise<void> => {
    onServiceCall({ ts: Date.now(), domain, service, data, target });
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
      ...(cfg.legacyIntegration ? {} : { set_axes: {}, engage_manual_override: {} }),
    },
  };

  const hass = {
    states: generated.states,
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
      name: 'Harness User',
      is_admin: true,
      is_owner: true,
    } as unknown as HomeAssistant['user'],
    devices,
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
