import type { HomeAssistant } from 'custom-card-helpers';
import { INTEGRATION_DOMAIN, UNIQUE_ID_ROLES } from '../const';
import type { EntityRegistryEntry } from './entity-registry';
import type { CoverDiscovery, DiscoveredEntities, AdaptiveCoverProCardConfig } from '../types';

/**
 * Memoized discovery for the root card, which re-runs on every HA state tick (HA
 * hands over a fresh `hass` object each time). Keying on `hass` identity would miss
 * every tick; instead this tracks the *real* inputs:
 *
 * - the **registry-derived base** (entities map + device_id) — memoized on
 *   `(registry, entryId)`, since the entity wiring only moves when the registry does;
 * - the four `hass`-derived references the result depends on: `hass.devices` (title),
 *   `hass.areas` (composite tile-card name's area part, issue #247), the target-position
 *   state (managed covers) and the control-status state (cover type).
 *
 * When all of those are reference-equal to the previous call it returns the **same**
 * `DiscoveredEntities` object — so `_discovered` (and the child props derived from it)
 * stay stable across unrelated ticks instead of churning a new object every time.
 */
export function createDiscoveryMemo(): (
  hass: HomeAssistant,
  config: AdaptiveCoverProCardConfig,
  registry: EntityRegistryEntry[],
) => DiscoveredEntities | null {
  let last: {
    registry: EntityRegistryEntry[];
    entryId: string;
    base: DiscoverBase | null;
    devices: unknown;
    areas: unknown;
    posState: unknown;
    ctrlState: unknown;
    result: DiscoveredEntities | null;
  } | null = null;

  return (hass, config, registry) => {
    const entryId = config.entry_id ?? '';
    if (!entryId) {
      last = null;
      return null;
    }

    const baseSame = last !== null && last.registry === registry && last.entryId === entryId;
    const base = baseSame ? last!.base : discoverBase(entryId, registry);
    if (!base) {
      last = {
        registry,
        entryId,
        base: null,
        devices: null,
        areas: null,
        posState: null,
        ctrlState: null,
        result: null,
      };
      return null;
    }

    const devices = (hass as HassWithDevices).devices;
    // Issue #247 audit finding #6: a device *reassignment* to a different
    // area replaces `hass.devices` (caught above), but a pure area *rename*
    // (same area_id, new `name`) only replaces `hass.areas` — track it too so
    // a composed tile-card `name` picks up the rename instead of holding the
    // stale area name until some other input happens to invalidate the memo.
    const areas = (hass as HassWithAreas).areas;
    // For a group entry the roster (managed_covers) is read from the
    // group_position sensor's member_positions; track it so a member move
    // invalidates the memo the same way the cover target sensor does.
    const posId = base.entities.target_position_sensor ?? base.entities.group_position_sensor;
    const ctrlId = base.entities.control_status_sensor;
    const posState = posId ? hass.states[posId] : undefined;
    const ctrlState = ctrlId ? hass.states[ctrlId] : undefined;

    if (
      baseSame &&
      last !== null &&
      last.result !== null &&
      last.devices === devices &&
      last.areas === areas &&
      last.posState === posState &&
      last.ctrlState === ctrlState
    ) {
      return last.result;
    }

    const result = assembleDiscovered(hass, entryId, base);
    last = { registry, entryId, base, devices, areas, posState, ctrlState, result };
    return result;
  };
}

/** Result of multi-entry discovery: the entries that resolved, plus the ids that didn't. */
export interface DiscoveryListResult {
  list: DiscoveredEntities[];
  missing: string[];
}

/**
 * Memoized discovery for the multi-entry cards (sky-compass card, …) which accept a
 * list of `entry_ids`. Each id runs through its own {@link createDiscoveryMemo}, so a
 * per-entry result is reference-stable across ticks. This wrapper additionally returns
 * the **same `{ list, missing }` object** (and therefore the same `list` array) when the
 * id list and every per-entry result are unchanged — so the array handed to the child
 * compass/chart stays reference-stable and does not defeat their own `shouldUpdate`.
 */
export function createDiscoveryListMemo(): (
  hass: HomeAssistant,
  entryIds: string[],
  registry: EntityRegistryEntry[],
  type: string,
) => DiscoveryListResult {
  const memos = new Map<string, ReturnType<typeof createDiscoveryMemo>>();
  let lastEntryIds: string[] = [];
  let lastResults: (DiscoveredEntities | null)[] = [];
  let cached: DiscoveryListResult = { list: [], missing: [] };

  return (hass, entryIds, registry, type) => {
    const results = entryIds.map((id) => {
      let memo = memos.get(id);
      if (!memo) {
        memo = createDiscoveryMemo();
        memos.set(id, memo);
      }
      return memo(hass, { type, entry_id: id }, registry);
    });
    // Drop per-entry memos for ids no longer configured.
    if (memos.size > entryIds.length) {
      for (const id of memos.keys()) if (!entryIds.includes(id)) memos.delete(id);
    }

    const unchanged =
      lastEntryIds.length === entryIds.length &&
      lastEntryIds.every((id, i) => id === entryIds[i]) &&
      lastResults.length === results.length &&
      lastResults.every((r, i) => r === results[i]);
    if (unchanged) return cached;

    lastEntryIds = entryIds.slice();
    lastResults = results;
    const list: DiscoveredEntities[] = [];
    const missing: string[] = [];
    entryIds.forEach((id, i) => {
      const d = results[i];
      if (d) list.push(d);
      else missing.push(id);
    });
    cached = { list, missing };
    return cached;
  };
}

interface DeviceDisplay {
  id: string;
  name?: string;
  name_by_user?: string;
  config_entries?: string[];
  /** HA area registry id the device is assigned to, or null/absent when
   *  unassigned. Read only for the composite tile-card `name` (issue #247);
   *  never used for identity. */
  area_id?: string | null;
}

type HassWithDevices = HomeAssistant & {
  devices?: Record<string, DeviceDisplay>;
};

interface AreaDisplay {
  area_id: string;
  name?: string;
}

/** Parallels {@link HassWithDevices}: `hass.areas` is a synchronous,
 *  already-present-on-tick registry map (same as `hass.devices`), just not
 *  declared on `custom-card-helpers`' `HomeAssistant` type. */
type HassWithAreas = HomeAssistant & {
  areas?: Record<string, AreaDisplay>;
};

/**
 * Identity is derived from `(platform, unique_id_suffix)`. The unique_id of
 * every ACP entity is `{entry_id}_{suffix}`; stripping the entry_id prefix
 * gives a stable, user-unrenameable identifier that the integration controls.
 *
 * The full entity registry is an async websocket fetch (`hass.entities` is a
 * display-only subset that omits `unique_id`/`config_entry_id`). The caller
 * passes in the pre-fetched registry so discovery stays pure and sync.
 *
 * `hass.devices` is used only for the *display title* and the list of managed
 * cover entity_ids (from the target-position sensor's `actual_positions`
 * attribute). It is not used for identity.
 */

/** Registry-derived identity for an entry — the part that only moves when the entity
 *  registry does. Returned by {@link discoverBase} and reused across `hass` ticks. */
interface DiscoverBase {
  entities: DiscoveredEntities['entities'];
  deviceId: string | undefined;
}

/** Walk the registry and resolve an entry's entities + device id. Pure in
 *  `(entryId, registry)`. Returns null when the entry has no matching entities. */
function discoverBase(entryId: string, registry: EntityRegistryEntry[]): DiscoverBase | null {
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
  return { entities, deviceId };
}

/** Combine the registry-derived base with the `hass`-derived fields (title, managed
 *  covers, cover type) into a full {@link DiscoveredEntities}. */
function assembleDiscovered(
  hass: HomeAssistant,
  entryId: string,
  base: DiscoverBase,
): DiscoveredEntities {
  const { entities, deviceId } = base;

  const h = hass as HassWithDevices;
  let entryTitle = entryId;
  if (h.devices) {
    for (const device of Object.values(h.devices)) {
      if (!device.config_entries?.includes(entryId)) continue;
      entryTitle = device.name_by_user ?? device.name ?? entryId;
      break;
    }
  }

  // Area (issue #247, tile card composite `name`): a direct key lookup off
  // the already-resolved `deviceId`, cheaper than re-walking `h.devices` the
  // way the title loop above does (it has no device id to key off yet at that
  // point). `hass.areas` is undefined on older HA frontends; both reads are
  // optional-chained so a missing device/area/registry simply resolves to no
  // area name rather than throwing.
  const areaId = deviceId ? h.devices?.[deviceId]?.area_id : undefined;
  const areaName = areaId ? (hass as HassWithAreas).areas?.[areaId]?.name : undefined;

  // The always-present group_active_scene sensor is the group-detection marker.
  const isGroup = !!entities.group_active_scene_sensor;

  const managedCovers: string[] = [];
  if (isGroup) {
    // Members are foreign cover entity_ids in other config entries — never
    // discovered. Read the roster from the group_position sensor's
    // member_positions keys (parallel to the cover actual_positions path).
    const groupPosId = entities.group_position_sensor;
    if (groupPosId) {
      const memberPositions = hass.states[groupPosId]?.attributes?.member_positions as
        | Record<string, number | null>
        | undefined;
      if (memberPositions) managedCovers.push(...Object.keys(memberPositions));
    }
  } else {
    const positionSensorId = entities.target_position_sensor;
    if (positionSensorId) {
      const actualPositions = hass.states[positionSensorId]?.attributes?.actual_positions as
        | Record<string, number | null>
        | undefined;
      if (actualPositions) managedCovers.push(...Object.keys(actualPositions));
    }
  }

  let coverType: DiscoveredEntities['cover_type'] = 'cover_blind';
  let discovery: CoverDiscovery | undefined;
  const controlStatus = entities.control_status_sensor;
  if (controlStatus) {
    const attrs = hass.states[controlStatus]?.attributes as
      | { cover_type?: string; cover_discovery?: unknown }
      | undefined;
    if (attrs?.cover_type) coverType = attrs.cover_type;
    // Attach discovery only when it is an object carrying an array `axes` —
    // tolerate a missing / malformed payload from an older or partial build.
    const cd = attrs?.cover_discovery;
    if (cd && typeof cd === 'object' && Array.isArray((cd as CoverDiscovery).axes)) {
      discovery = cd as CoverDiscovery;
    }
  }

  return {
    entry_id: entryId,
    entry_title: entryTitle,
    cover_type: coverType,
    entities,
    managed_covers: managedCovers,
    device_id: deviceId,
    is_group: isGroup,
    ...(discovery ? { discovery } : {}),
    ...(areaName ? { area_name: areaName } : {}),
  };
}

export function discoverEntities(
  hass: HomeAssistant,
  config: AdaptiveCoverProCardConfig,
  registry: EntityRegistryEntry[],
): DiscoveredEntities | null {
  const entryId = config.entry_id;
  if (!entryId) return null;
  const base = discoverBase(entryId, registry);
  if (!base) return null;
  return assembleDiscovered(hass, entryId, base);
}
