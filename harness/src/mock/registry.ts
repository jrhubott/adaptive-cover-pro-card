import { INTEGRATION_DOMAIN, UNIQUE_ID_ROLES, type EntityRole } from '../../../src/const';
import type { EntityRegistryEntry } from '../../../src/lib/entity-registry';
import type { HarnessEntry } from '../types';

interface RoleSpec {
  role: EntityRole;
  platform: string;
  suffix: string;
}

/** Pre-compute the inverse of UNIQUE_ID_ROLES once. */
const ROLE_SPECS: RoleSpec[] = Object.entries(UNIQUE_ID_ROLES).map(([key, role]) => {
  const [platform, ...suffixParts] = key.split(':');
  return { role, platform, suffix: suffixParts.join(':') };
});

/** Group roles are all prefixed `group_` in the EntityRole union (issue #185). */
const isGroupRole = (role: EntityRole): boolean => role.startsWith('group_');

/** Slugify a platform+suffix into a valid HA entity_id object portion. */
function entityObjectId(entryId: string, suffix: string): string {
  return `acp_${entryId}_${suffix}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/** Build entity_id deterministically per (entry, role). */
export function entityIdFor(entry: HarnessEntry, role: EntityRole): string {
  const spec = ROLE_SPECS.find((s) => s.role === role);
  if (!spec) throw new Error(`unknown role: ${role}`);
  return `${spec.platform}.${entityObjectId(entry.entry_id, spec.suffix)}`;
}

/** Produce a synthetic entity registry response covering all roles for every entry. */
export function buildRegistry(entries: HarnessEntry[]): EntityRegistryEntry[] {
  const out: EntityRegistryEntry[] = [];
  for (const entry of entries) {
    for (const spec of ROLE_SPECS) {
      const groupRole = isGroupRole(spec.role);
      // A Cover Group entry exposes ONLY the group_* entities; an ordinary cover
      // entry never exposes any of them (gating both ways is what keeps
      // discovery's is_group marker — group_active_scene — off cover entries).
      if (entry.is_group) {
        if (!groupRole) continue;
      } else if (groupRole) {
        continue;
      }
      // The Cover_Tilt sensor only exists for dual-axis venetian covers — its
      // presence is the card's dual-axis gate, so don't register it elsewhere.
      if (spec.role === 'target_tilt_sensor' && entry.cover_type !== 'cover_venetian') continue;
      const entity_id = `${spec.platform}.${entityObjectId(entry.entry_id, spec.suffix)}`;
      out.push({
        entity_id,
        unique_id: `${entry.entry_id}_${spec.suffix}`,
        platform: INTEGRATION_DOMAIN,
        config_entry_id: entry.entry_id,
        device_id: `device_${entry.entry_id}`,
        translation_key: spec.suffix,
      });
    }
    // Also include the underlying HA cover entities — they aren't ACP-platform,
    // but the discovery walks via target_position_sensor.actual_positions so
    // we only need them in hass.states, not the registry. Still, list them for
    // realism.
    for (const cov of entry.covers) {
      out.push({
        entity_id: cov.entity_id,
        unique_id: `external_${cov.entity_id}`,
        platform: 'demo',
        config_entry_id: null,
        device_id: null,
      });
    }
  }
  return out;
}
