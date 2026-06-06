import type { HomeAssistant } from 'custom-card-helpers';
import { HANDLER_I18N_KEYS, HANDLER_LABELS, type HandlerName } from '../../../src/const';
import type { HarnessConfig } from '../types';
import { zoneForLongitude } from '../zone';
import { buildRegistry } from './registry';
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
  'badge.motion': 'Motion',
  'badge.off': 'Off',
  'badge.off_schedule': 'Off-schedule',
  'decision.outside_schedule': 'Outside schedule — automatic control paused',
  'decision.outside_schedule_tooltip':
    'The configured schedule window is not active, so automatic positioning is paused.',
  'compass.in_fov_tooltip': 'Sun is currently within this window’s field of view',
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
  'tile.motion_detected': 'Motion detected',
  'tile.motion_pending': 'Motion timeout',
  'dialog.floor': '↥',
  'dialog.floor_tooltip': 'Custom position floor is raising the calculated value.',
  'badge.floor_suffix': ' ↥',
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

  // hass.callWS handles only the entity-registry list call we care about.
  const callWS = async <T>(msg: { type: string }): Promise<T> => {
    if (msg.type === 'config/entity_registry/list') {
      return registry as unknown as T;
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

  const hass = {
    states: generated.states,
    config: {
      latitude: cfg.latitude,
      longitude: cfg.longitude,
      // Report the zone matching the configured longitude (not the dev
      // machine's) so the card anchors its sun day to the *location's* day.
      time_zone: zoneForLongitude(cfg.longitude),
      unit_system: { temperature: '°C', length: 'km', mass: 'kg' },
    } as unknown as HomeAssistant['config'],
    language: 'en' as HomeAssistant['language'],
    locale: {
      language: 'en',
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
    formatEntityState: (stateObj: { state: string }): string => stateObj.state,
  } as unknown as HomeAssistant;

  return { hass, generated };
}
