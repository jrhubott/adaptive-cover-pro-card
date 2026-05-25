import type { HomeAssistant } from 'custom-card-helpers';
import { INTEGRATION_DOMAIN, UNIQUE_ID_ROLES } from '../const';
import type { EntityRegistryEntry } from './entity-registry';
import type { DiscoveredEntities, AdaptiveCoverProCardConfig } from '../types';

interface MemoKey {
  registry: EntityRegistryEntry[];
  hass: HomeAssistant;
  entryId: string;
}

export function createDiscoveryMemo(): (
  hass: HomeAssistant,
  config: AdaptiveCoverProCardConfig,
  registry: EntityRegistryEntry[],
) => DiscoveredEntities | null {
  let lastKey: MemoKey | null = null;
  let lastResult: DiscoveredEntities | null = null;

  return (hass, config, registry) => {
    const entryId = config.entry_id ?? '';
    if (
      lastKey !== null &&
      lastKey.registry === registry &&
      lastKey.hass === hass &&
      lastKey.entryId === entryId
    ) {
      return lastResult;
    }
    lastKey = { registry, hass, entryId };
    lastResult = discoverEntities(hass, config, registry);
    return lastResult;
  };
}

interface DeviceDisplay {
  id: string;
  name?: string;
  name_by_user?: string;
  config_entries?: string[];
}

type HassWithDevices = HomeAssistant & {
  devices?: Record<string, DeviceDisplay>;
};

/**
 * Resolve an ACP config entry to its logical entities.
 *
 * Identity is derived from `(platform, unique_id_suffix)`. The unique_id of
 * every ACP entity is `{entry_id}_{suffix}`; stripping the entry_id prefix
 * gives a stable, user-unrenameable identifier that the integration controls.
 *
 * The full entity registry is an async websocket fetch (`hass.entities` is a
 * display-only subset that omits `unique_id`/`config_entry_id`). The caller
 * passes in the pre-fetched registry so this function stays pure and sync.
 *
 * `hass.devices` is used only for the *display title* and the list of managed
 * cover entity_ids (from the target-position sensor's `actual_positions`
 * attribute). It is not used for identity.
 */
export function discoverEntities(
  hass: HomeAssistant,
  config: AdaptiveCoverProCardConfig,
  registry: EntityRegistryEntry[],
): DiscoveredEntities | null {
  const entryId = config.entry_id;
  if (!entryId) return null;

  const entities: DiscoveredEntities['entities'] = {};
  const prefix = `${entryId}_`;
  let anyEntryMatched = false;
  let deviceId: string | undefined;

  for (const entry of registry) {
    if (entry.config_entry_id !== entryId) continue;
    if (entry.platform !== INTEGRATION_DOMAIN) continue;
    anyEntryMatched = true;
    if (!deviceId && entry.device_id) deviceId = entry.device_id;

    if (!entry.unique_id.startsWith(prefix)) continue;
    const suffix = entry.unique_id.slice(prefix.length);
    const platform = entry.entity_id.split('.')[0];
    const role = UNIQUE_ID_ROLES[`${platform}:${suffix}`];
    if (!role) continue;
    entities[role] = entry.entity_id;
  }

  if (!anyEntryMatched || Object.keys(entities).length === 0) return null;

  const h = hass as HassWithDevices;
  let entryTitle = entryId;
  if (h.devices) {
    for (const device of Object.values(h.devices)) {
      if (!device.config_entries?.includes(entryId)) continue;
      entryTitle = device.name_by_user ?? device.name ?? entryId;
      break;
    }
  }

  const managedCovers: string[] = [];
  const positionSensorId = entities.target_position_sensor;
  if (positionSensorId) {
    const actualPositions = hass.states[positionSensorId]?.attributes?.actual_positions as
      | Record<string, number | null>
      | undefined;
    if (actualPositions) managedCovers.push(...Object.keys(actualPositions));
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
    device_id: deviceId,
  };
}
