import { INTEGRATION_DOMAIN } from '../const';
import type { EntityRegistryEntry } from './entity-registry';
import { getCachedRegistry, loadEntityRegistry, warmEntityRegistry } from './registry-store';

/**
 * Synchronous entity → ACP config-entry resolution for HA's "By entity" card
 * picker (frontend PR #52228). The picker calls each `window.customCards` entry's
 * `getEntitySuggestion(hass, entityId)` synchronously.
 *
 * The config entry that owns an entity lives on its **full entity-registry** entry
 * (`config_entry_id`). It is NOT derivable from `hass` synchronously: `hass.entities`
 * omits `config_entry_id`, and the entity's *device* is the wrong signal — ACP
 * attaches its entities to the **source cover's existing device**, which also belongs
 * to the source integration's config entry, so the device's `primary_config_entry`
 * is that foreign entry, not ACP's (issue #183). We therefore resolve through the
 * shared registry cache (`registry-store`), which every ACP card already fetches, and
 * warm it eagerly at registration so it is resident before the picker runs.
 */

type CoverRoster = {
  actual_positions?: Record<string, unknown>;
  member_positions?: Record<string, unknown>;
};

/** The resolver reads only `states` (managed-cover roster) and `callWS` (to warm a
 *  cold registry cache) off `hass`. Config-entry identity comes from the registry. */
export type HassLike = {
  states: Record<string, { attributes?: Record<string, unknown> }>;
  callWS?: <T>(msg: { type: string }) => Promise<T>;
};

// Index the registry by entity_id, memoized on the registry array identity so the
// picker's many per-card getEntitySuggestion calls share one map instead of each
// rebuilding it over a registry that can hold thousands of entries.
let _indexFor: EntityRegistryEntry[] | null = null;
let _index: Map<string, EntityRegistryEntry> | null = null;
function indexRegistry(registry: EntityRegistryEntry[]): Map<string, EntityRegistryEntry> {
  if (_indexFor === registry && _index) return _index;
  const map = new Map<string, EntityRegistryEntry>();
  for (const entry of registry) map.set(entry.entity_id, entry);
  _indexFor = registry;
  _index = map;
  return map;
}

/**
 * Resolve an HA `entityId` to the ACP `config_entry_id` that owns or manages it,
 * or `null` when the entity is unrelated to Adaptive Cover Pro or the registry
 * cache is not yet warm.
 *
 *  1. Direct ACP entity (any sensor/switch/cover on the `adaptive_cover_pro`
 *     platform, including `cover.group_cover`): its own `config_entry_id`.
 *  2. Raw managed cover (a `cover.*` owned by another integration): find the ACP
 *     position/group sensor whose `actual_positions` / `member_positions` roster
 *     includes this cover, then return *that sensor's* `config_entry_id`.
 *  3. Otherwise `null`.
 *
 * Fully synchronous — reads the shared in-memory registry via `getCachedRegistry()`.
 * On a cold cache it kicks a fetch (in addition to the registration-time warm) so a
 * re-selection / reopen resolves, and returns `null` for now.
 */
export function resolveEntryIdForEntity(hass: HassLike, entityId: string): string | null {
  const registry = getCachedRegistry();
  if (!registry) {
    if (hass.callWS) {
      loadEntityRegistry(hass as unknown as Parameters<typeof loadEntityRegistry>[0]).catch(
        () => {},
      );
    }
    return null;
  }

  const byId = indexRegistry(registry);
  const direct = byId.get(entityId);
  if (direct?.platform === INTEGRATION_DOMAIN) {
    return direct.config_entry_id;
  }

  // Only a raw cover from another integration can be *managed* by an ACP entry.
  if (!entityId.startsWith('cover.')) return null;
  for (const [sid, st] of Object.entries(hass.states)) {
    const attrs = st?.attributes as CoverRoster | undefined;
    const roster = attrs?.actual_positions ?? attrs?.member_positions;
    if (!roster || !(entityId in roster)) continue;
    const owner = byId.get(sid);
    if (owner?.platform !== INTEGRATION_DOMAIN) continue;
    return owner.config_entry_id;
  }
  return null;
}

/**
 * Resolve a cover to the ACP **cover** entry that manages it, ignoring any group
 * entry it also belongs to.
 *
 * {@link resolveEntryIdForEntity} accepts either roster, so for a cover that is
 * both ACP-managed *and* a group member it returns whichever sensor
 * `Object.entries(hass.states)` happens to reach first — the group's as easily as
 * the cover's own. That ambiguity is harmless for the card picker but wrong for
 * the group roster, which renders each member as *its own* tile card: resolving
 * to the group would render the group's tile N times over.
 *
 * So this consults `actual_positions` only (the per-cover roster the group
 * sensor never publishes), and returns null for a generic cover with no ACP
 * pipeline — the caller's signal to fall back to a plain controllable row.
 */
export function resolveCoverEntryId(
  hass: HassLike,
  coverEntityId: string,
  /** Registry to resolve against. Defaults to the shared cache, which only the
   *  CARD warms via its `entity_registry_updated` subscription. The card editor
   *  fetches its own copy and must pass it, or every lookup silently returns
   *  null until some card on the page happens to fill the shared cache. */
  registryOverride?: EntityRegistryEntry[],
): string | null {
  if (!coverEntityId.startsWith('cover.')) return null;
  const registry = registryOverride ?? getCachedRegistry();
  if (!registry) return null;
  const byId = indexRegistry(registry);

  // An ACP-platform cover (the aggregate group cover) is never a managed member.
  if (byId.get(coverEntityId)?.platform === INTEGRATION_DOMAIN) return null;

  for (const [sid, st] of Object.entries(hass.states)) {
    const roster = (st?.attributes as CoverRoster | undefined)?.actual_positions;
    if (!roster || !(coverEntityId in roster)) continue;
    const owner = byId.get(sid);
    if (owner?.platform !== INTEGRATION_DOMAIN) continue;
    return owner.config_entry_id;
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
 * Calling this at module load (once per card) also warms the registry cache so the
 * synchronous resolver has data by the time the picker runs.
 *
 * @param type Full `custom:<card-name>` config type.
 * @param key  Which config key the card reads its entries from.
 */
export function makeEntitySuggestion(
  type: string,
  key: 'entry_id' | 'entry_ids',
): (hass: HassLike, entityId: string) => EntitySuggestion | null {
  warmEntityRegistry();
  return (hass, entityId) => {
    const entryId = resolveEntryIdForEntity(hass, entityId);
    if (!entryId) return null;
    const config: Record<string, unknown> =
      key === 'entry_ids' ? { type, entry_ids: [entryId] } : { type, entry_id: entryId };
    return { config };
  };
}
