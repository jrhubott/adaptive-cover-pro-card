import { INTEGRATION_DOMAIN } from '../const';

/**
 * Synchronous entity → ACP config-entry resolution for HA's "By entity" card
 * picker (frontend PR #52228). The picker calls each `window.customCards` entry's
 * `getEntitySuggestion(hass, entityId)` synchronously, so this cannot await the
 * entity-registry websocket fetch that `entity-discovery.ts` uses — it reads only
 * data already resident on `hass`.
 *
 * Local cast types: `custom-card-helpers`' `HomeAssistant` types neither the
 * `entities` display registry nor the `devices` registry, so we widen structurally
 * here — the same pattern as `HassWithDevices` in `entity-discovery.ts`.
 */
type EntityDisplay = { platform?: string; device_id?: string };
type DeviceDisplay = { primary_config_entry?: string | null; config_entries?: string[] };
export type HassLike = {
  states: Record<string, { attributes?: Record<string, unknown> }>;
  entities?: Record<string, EntityDisplay>;
  devices?: Record<string, DeviceDisplay>;
};

/** The config-entry that owns `deviceId`, preferring `primary_config_entry`. */
function entryIdForDevice(hass: HassLike, deviceId?: string): string | null {
  if (!deviceId) return null;
  const dev = hass.devices?.[deviceId];
  return dev?.primary_config_entry ?? dev?.config_entries?.[0] ?? null;
}

/**
 * Resolve an HA `entityId` to the ACP `config_entry_id` that owns or manages it,
 * or `null` when the entity is unrelated to Adaptive Cover Pro.
 *
 * Fully synchronous — reads only `hass.entities` / `hass.devices` / `hass.states`.
 *
 *  1. Direct ACP entity (any sensor/switch/cover on the `adaptive_cover_pro`
 *     platform, including `cover.group_cover`): its device's config entry.
 *  2. Raw managed cover (a `cover.*` owned by another integration): find the ACP
 *     position/group sensor whose `actual_positions` / `member_positions` roster
 *     includes this cover, then map that sensor's device → config entry.
 *  3. Otherwise `null`.
 */
export function resolveEntryIdForEntity(hass: HassLike, entityId: string): string | null {
  const disp = hass.entities?.[entityId];
  if (disp?.platform === INTEGRATION_DOMAIN) {
    return entryIdForDevice(hass, disp.device_id);
  }
  // Only raw covers can be managed by an ACP entry; anything else is unrelated.
  if (!entityId.startsWith('cover.')) return null;
  for (const [sid, st] of Object.entries(hass.states)) {
    const attrs = st?.attributes as
      | { actual_positions?: Record<string, unknown>; member_positions?: Record<string, unknown> }
      | undefined;
    const roster = attrs?.actual_positions ?? attrs?.member_positions;
    if (!roster || !(entityId in roster)) continue;
    const owner = hass.entities?.[sid];
    if (owner?.platform !== INTEGRATION_DOMAIN) continue;
    return entryIdForDevice(hass, owner.device_id);
  }
  return null;
}

/** The shape HA's picker expects back from `getEntitySuggestion`. */
export type EntitySuggestion = { label?: string; config: Record<string, unknown> };

/**
 * Build a `getEntitySuggestion(hass, entityId)` callback for one card registration.
 * Resolves the entity to its ACP config entry and returns that card's own config
 * (keyed by `entry_id` for the single-entry cards, `entry_ids` for the multi-entry
 * cards), or `null` when the entity isn't ACP-related — in which case HA omits the
 * suggestion entirely, so the returned config always satisfies the card's setConfig.
 *
 * @param type Full `custom:<card-name>` config type.
 * @param key  Which config key the card reads its entries from.
 */
export function makeEntitySuggestion(
  type: string,
  key: 'entry_id' | 'entry_ids',
): (hass: HassLike, entityId: string) => EntitySuggestion | null {
  return (hass, entityId) => {
    const entryId = resolveEntryIdForEntity(hass, entityId);
    if (!entryId) return null;
    const config: Record<string, unknown> =
      key === 'entry_ids' ? { type, entry_ids: [entryId] } : { type, entry_id: entryId };
    return { config };
  };
}
