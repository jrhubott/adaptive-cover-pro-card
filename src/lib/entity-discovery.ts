import type { HomeAssistant } from 'custom-card-helpers';
import { INTEGRATION_DOMAIN, TRANSLATION_KEY_ROLES } from '../const';
import type { DiscoveredEntities, AdaptiveCoverProCardConfig } from '../types';

type HassEntityRegistry = {
  entity_id: string;
  unique_id?: string;
  config_entry_id?: string;
  translation_key?: string;
  platform?: string;
};

type HassWithRegistries = HomeAssistant & {
  entities?: Record<string, HassEntityRegistry>;
  config?: { entries?: Array<{ entry_id: string; title: string; domain: string }> };
};

/**
 * Resolve an ACP config entry to its logical entities.
 *
 * Strategy:
 * 1. Walk `hass.entities` (modern HA exposes the entity registry on the frontend
 *    object) and filter by `config_entry_id === entry_id`. Match each entity to
 *    a known translation_key role.
 * 2. If the registry isn't populated (older HA), fall back to scanning
 *    `hass.states` keys for `*_{entry_id_slug}_*` patterns — best-effort only.
 *
 * Entity_id strings should NEVER be hardcoded in components; always look them
 * up here so renames in the integration don't break the card.
 */
export function discoverEntities(
  hass: HomeAssistant,
  config: AdaptiveCoverProCardConfig,
): DiscoveredEntities | null {
  const h = hass as HassWithRegistries;
  const entryId = config.entry_id;
  if (!entryId) return null;

  const entryTitle =
    h.config?.entries?.find((e) => e.entry_id === entryId && e.domain === INTEGRATION_DOMAIN)
      ?.title ?? config.entry_id;

  const entities: DiscoveredEntities['entities'] = {};
  let coverType: DiscoveredEntities['cover_type'] = 'cover_blind';
  const managedCovers: string[] = [];

  if (h.entities) {
    for (const reg of Object.values(h.entities)) {
      if (reg.config_entry_id !== entryId) continue;
      if (!reg.translation_key) continue;
      const role = TRANSLATION_KEY_ROLES[reg.translation_key as keyof typeof TRANSLATION_KEY_ROLES];
      if (role) {
        entities[role] = reg.entity_id;
      }
    }
  }

  const positionSensorId = entities.target_position_sensor;
  if (positionSensorId) {
    const actualPositions = hass.states[positionSensorId]?.attributes?.actual_positions as
      | Record<string, number | null>
      | undefined;
    if (actualPositions) {
      managedCovers.push(...Object.keys(actualPositions));
    }
  }

  const controlStatus = entities.control_status_sensor;
  if (controlStatus) {
    const attrs = hass.states[controlStatus]?.attributes as { cover_type?: string } | undefined;
    if (attrs?.cover_type) coverType = attrs.cover_type;
  }

  if (Object.keys(entities).length === 0) {
    return null;
  }

  return {
    entry_id: entryId,
    entry_title: entryTitle,
    cover_type: coverType,
    entities,
    managed_covers: managedCovers,
  };
}
