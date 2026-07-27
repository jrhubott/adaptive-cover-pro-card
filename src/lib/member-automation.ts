import type { HomeAssistant } from 'custom-card-helpers';

import { INTEGRATION_DOMAIN, UNIQUE_ID_ROLES } from '../const';
import type { EntityRegistryEntry } from './entity-registry';

/**
 * Whether a Cover Group's members are actually running their sun-tracking
 * automation — the signal the group's own `group_automation` switch cannot give.
 *
 * That switch is documented integration-side as "the last bulk command sent
 * through this group (defaults to on), **not** a consensus of member states —
 * members remain individually togglable". So it reads `on` on a fresh restart
 * even if every member is off, and never moves when a user flips one member's
 * Automatic Control at its own tile. Coloring the group's Automation button
 * from it is therefore wrong in exactly the cases the color matters.
 *
 * The truth lives on each member's own ACP entry, which the card can reach: the
 * entity registry maps a member cover back to the entry that manages it (via
 * that entry's `Cover_Position` sensor roster — the same walk
 * `entity-suggestion` does), and that entry owns the Automatic Control and
 * Integration Enabled switches.
 */

export type MemberAutomationStatus = 'all' | 'some' | 'none' | 'unknown';

export interface MemberAutomationRollup {
  /** `unknown` whenever no member resolves — a cold registry cache, an
   *  all-generic roster, or an integration too old to publish `member_winners`.
   *  Callers must fall back to their previous behavior on it rather than
   *  rendering a third state, so the rollup can never invent a status. */
  status: MemberAutomationStatus;
  /** Member covers counted as automated. */
  on: number;
  /** Member covers resolved — the denominator. Smaller than the roster whenever
   *  it holds generic covers, which have no pipeline to report on. */
  total: number;
}

const UNKNOWN: MemberAutomationRollup = { status: 'unknown', on: 0, total: 0 };

/** The three roles this rollup needs off each member entry. */
interface EntryRoles {
  positionSensor?: string;
  automaticControl?: string;
  integrationEnabled?: string;
}

/** Memoized on the registry array's identity — every group surface re-reads its
 *  snapshot on each `hass` tick, and the registry only moves when the shared
 *  store refetches it. Same trick `entity-suggestion` uses for its id index. */
let _indexFor: EntityRegistryEntry[] | null = null;
let _index: Map<string, EntryRoles> | null = null;

/** One pass over the registry: ACP entry_id → the entities we care about.
 *  Group entries fall out naturally — their position sensor carries the
 *  `group_position` role, not `Cover_Position`, so no roster of theirs is ever
 *  consulted and a group can never resolve as its own member. */
function indexEntries(registry: EntityRegistryEntry[]): Map<string, EntryRoles> {
  if (_indexFor === registry && _index) return _index;
  const byEntry = new Map<string, EntryRoles>();
  for (const entry of registry) {
    if (entry.platform !== INTEGRATION_DOMAIN) continue;
    const entryId = entry.config_entry_id;
    if (!entryId) continue;
    const prefix = `${entryId}_`;
    if (!entry.unique_id.startsWith(prefix)) continue;
    const suffix = entry.unique_id.slice(prefix.length);
    const platform = entry.entity_id.split('.')[0];
    const role = UNIQUE_ID_ROLES[`${platform}:${suffix}`];
    if (
      role !== 'target_position_sensor' &&
      role !== 'automatic_control_switch' &&
      role !== 'integration_enabled_switch'
    ) {
      continue;
    }
    const roles = byEntry.get(entryId) ?? {};
    if (role === 'target_position_sensor') roles.positionSensor = entry.entity_id;
    else if (role === 'automatic_control_switch') roles.automaticControl = entry.entity_id;
    else roles.integrationEnabled = entry.entity_id;
    byEntry.set(entryId, roles);
  }
  _indexFor = registry;
  _index = byEntry;
  return byEntry;
}

/**
 * Roll the members' live automation state up into one status.
 *
 * A member counts as automated only when its Automatic Control is `on` **and**
 * its Integration Enabled is not `off`: a member with the integration killed is
 * not being driven either, and reporting it as automated would be the same lie
 * the group latch tells. A *missing* Integration Enabled switch (older build) is
 * not evidence of anything, so it reads as enabled.
 *
 * @param memberCoverIds The group's **ACP** member covers — the `member_winners`
 *   keys. Do NOT pass the `member_positions` roster: it can also list a cover
 *   that some *other* ACP entry manages but that this group does not drive, and
 *   `group_set_automation` never touches such an entry, so counting it strands
 *   the button in a state no press can clear.
 */
export function rollupMemberAutomation(
  hass: HomeAssistant,
  registry: EntityRegistryEntry[] | null,
  memberCoverIds: string[],
): MemberAutomationRollup {
  if (!registry || memberCoverIds.length === 0) return UNKNOWN;

  const byEntry = indexEntries(registry);

  // cover entity_id → the entry that manages it, built from the entries' own
  // `actual_positions` rosters.
  const owner = new Map<string, string>();
  for (const [entryId, roles] of byEntry) {
    if (!roles.positionSensor) continue;
    const positions = hass.states[roles.positionSensor]?.attributes?.actual_positions as
      | Record<string, unknown>
      | undefined;
    if (!positions) continue;
    for (const coverId of Object.keys(positions)) owner.set(coverId, entryId);
  }

  // Counted in COVERS, not entries: a multi-cover entry shares one Automatic
  // Control switch, but "3 of my 4 covers stopped tracking" is the actionable
  // truth, and covers are the unit the roster, the who-won badge and the word
  // "members" already use everywhere else in the card. The shared switch is
  // still only read once per entry.
  const perEntry = new Map<string, boolean | null>();
  let on = 0;
  let total = 0;
  for (const coverId of new Set(memberCoverIds)) {
    const entryId = owner.get(coverId);
    if (!entryId) continue;
    let automated = perEntry.get(entryId);
    if (automated === undefined) {
      automated = entryAutomated(hass, byEntry.get(entryId));
      perEntry.set(entryId, automated);
    }
    // null = the entry cannot report; leave it out rather than call it off.
    if (automated === null) continue;
    total++;
    if (automated) on++;
  }

  if (total === 0) return UNKNOWN;
  return { status: on === total ? 'all' : on === 0 ? 'none' : 'some', on, total };
}

/**
 * Whether one entry is automating, or `null` when it cannot say.
 *
 * A switch the user has DISABLED in HA stays in the entity registry but has no
 * state at all — an absence of data, not evidence of "off". Reporting a definite
 * grey "automation off" from it would be the same invention this module exists to
 * remove, so it returns null and the caller drops the member. An `unavailable`
 * state is a different thing: the entity is reporting, and what it reports is
 * not `on`.
 *
 * `Integration Enabled` is read leniently by design — a build that never
 * published it is not evidence of a disabled integration.
 */
function entryAutomated(hass: HomeAssistant, roles: EntryRoles | undefined): boolean | null {
  if (!roles?.automaticControl) return null;
  const auto = hass.states[roles.automaticControl];
  if (!auto) return null;
  const enabled = roles.integrationEnabled
    ? hass.states[roles.integrationEnabled]?.state !== 'off'
    : true;
  return auto.state === 'on' && enabled;
}
