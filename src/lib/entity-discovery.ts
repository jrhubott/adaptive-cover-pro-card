import type { HomeAssistant } from 'custom-card-helpers';
import { INTEGRATION_DOMAIN, TRANSLATION_KEY_ROLES } from '../const';
import type { DiscoveredEntities, AdaptiveCoverProCardConfig } from '../types';

/**
 * Minimal shape of a device registry display entry on the HA frontend.
 * `hass.devices` gives every device keyed by its device_id.
 * These include `config_entries` (array) and `primary_config_entry` (scalar).
 */
interface DeviceDisplay {
  id: string;
  name?: string;
  name_by_user?: string;
  config_entries?: string[];
  primary_config_entry?: string;
}

/**
 * Minimal shape of an entity registry display entry on the HA frontend.
 * Note: `hass.entities[entity_id]` does NOT carry `config_entry_id` — that field
 * lives on the full entity registry (websocket-only). We go through `device_id`
 * instead, which IS on the display entry.
 */
interface EntityDisplay {
  entity_id: string;
  device_id?: string;
  translation_key?: string;
  platform?: string;
}

type HassWithRegistries = HomeAssistant & {
  entities?: Record<string, EntityDisplay>;
  devices?: Record<string, DeviceDisplay>;
};

/**
 * Resolve an ACP config entry to its logical entities.
 *
 * Strategy (device-based, fully synchronous, works with the data already on
 * `hass` — no websocket round-trip needed):
 *
 * 1. Scan `hass.devices` for devices whose `config_entries` contain the
 *    target `entry_id`. Adaptive Cover Pro creates exactly one device per
 *    config entry, but we handle multiple devices defensively.
 * 2. Scan `hass.entities` for entities whose `device_id` matches one of those
 *    devices, and for each entity, map its `translation_key` to a logical role.
 * 3. Derive `managed_covers` from the target-position sensor's
 *    `actual_positions` attribute (already authoritative in the integration).
 *
 * Entity_id strings must never be hardcoded in components — always look them up
 * through this function so translation_key renames in the integration are
 * absorbed in a single place.
 */
export function discoverEntities(
  hass: HomeAssistant,
  config: AdaptiveCoverProCardConfig,
): DiscoveredEntities | null {
  const h = hass as HassWithRegistries;
  const entryId = config.entry_id;
  if (!entryId) return null;
  if (!h.devices || !h.entities) return null;

  const deviceIds = new Set<string>();
  let entryTitle = entryId;
  for (const device of Object.values(h.devices)) {
    if (!device.config_entries?.includes(entryId)) continue;
    deviceIds.add(device.id);
    if (entryTitle === entryId) {
      entryTitle = device.name_by_user ?? device.name ?? entryId;
    }
  }

  if (deviceIds.size === 0) return null;

  const entities: DiscoveredEntities['entities'] = {};
  for (const entity of Object.values(h.entities)) {
    if (!entity.device_id || !deviceIds.has(entity.device_id)) continue;
    if (!entity.translation_key) continue;
    const role = TRANSLATION_KEY_ROLES[entity.translation_key as keyof typeof TRANSLATION_KEY_ROLES];
    if (role) {
      entities[role] = entity.entity_id;
    }
  }

  if (Object.keys(entities).length === 0) return null;

  const managedCovers: string[] = [];
  const positionSensorId = entities.target_position_sensor;
  if (positionSensorId) {
    const actualPositions = hass.states[positionSensorId]?.attributes?.actual_positions as
      | Record<string, number | null>
      | undefined;
    if (actualPositions) {
      managedCovers.push(...Object.keys(actualPositions));
    }
  }

  let coverType: DiscoveredEntities['cover_type'] = 'cover_blind';
  const controlStatus = entities.control_status_sensor;
  if (controlStatus) {
    const attrs = hass.states[controlStatus]?.attributes as { cover_type?: string } | undefined;
    if (attrs?.cover_type) coverType = attrs.cover_type;
  }

  return {
    entry_id: entryId,
    entry_title: entryTitle,
    cover_type: coverType,
    entities,
    managed_covers: managedCovers,
  };
}

// The integration-domain constant is kept for future use (e.g. stricter filtering
// once `hass.config.entries` is reliably available on the frontend).
void INTEGRATION_DOMAIN;
