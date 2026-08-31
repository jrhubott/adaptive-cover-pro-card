import type { HomeAssistant } from 'custom-card-helpers';

import { INTEGRATION_DOMAIN, UNIQUE_ID_ROLES } from '../const';
import type { EntityRegistryEntry } from './entity-registry';

/**
 * What a Cover Group's members are actually doing — the signal the group's own
 * bulk switches cannot give.
 *
 * Those switches are documented integration-side as "the last bulk command sent
 * through this group (defaults to on), **not** a consensus of member states —
 * members remain individually togglable". So one reads `on` on a fresh restart
 * even if every member is off, and never moves when a user flips the same
 * feature at a member's own tile. Coloring a group button from it is therefore
 * wrong in exactly the cases the color matters.
 *
 * The truth lives on each member's own ACP entry, which the card can reach: the
 * entity registry maps a member cover back to the entry that manages it (via
 * that entry's `Cover_Position` sensor roster — the same walk
 * `entity-suggestion` does), and that entry owns the per-cover switches.
 *
 * Two group buttons need this and ask different questions of the same walk —
 * Automation reads `Automatic Control` (#243/#185), Climate reads `Climate Mode`
 * (#287). Everything except *which switch to read* is shared, so the surveyed
 * switch is a parameter and nothing else is.
 */

export type MemberRollupStatus = 'all' | 'some' | 'none' | 'unknown';

export interface MemberRollup {
  /** `unknown` whenever no member resolves — a cold registry cache, an
   *  all-generic roster, or an integration too old to publish `member_winners`.
   *  Callers must fall back to their previous behavior on it rather than
   *  rendering a third state, so the rollup can never invent a status. */
  status: MemberRollupStatus;
  /** Member covers counted as on. */
  on: number;
  /** Member covers resolved — the denominator. Smaller than the roster whenever
   *  it holds generic covers, which have no pipeline to report on. */
  total: number;
}

const UNKNOWN: MemberRollup = { status: 'unknown', on: 0, total: 0 };

/** The roles this rollup needs off each member entry. `positionSensor` and
 *  `integrationEnabled` are shared by every question; the rest is one field per
 *  surveyable feature. */
interface EntryRoles {
  positionSensor?: string;
  integrationEnabled?: string;
  automaticControl?: string;
  climateMode?: string;
}

/** Which `EntryRoles` field a rollup surveys. Adding a feature means adding a
 *  field above, a role below, and a member of this union — not another copy of
 *  the walk. */
type SurveyedFeature = 'automaticControl' | 'climateMode';

/** Card role → the `EntryRoles` field it populates. The registry pass keeps only
 *  these, so an entry's other two dozen entities never enter the index. */
const INDEXED_ROLES: Record<string, keyof EntryRoles> = {
  target_position_sensor: 'positionSensor',
  integration_enabled_switch: 'integrationEnabled',
  automatic_control_switch: 'automaticControl',
  climate_mode_switch: 'climateMode',
};

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
    const field = role ? INDEXED_ROLES[role] : undefined;
    if (!field) continue;
    const roles = byEntry.get(entryId) ?? {};
    roles[field] = entry.entity_id;
    byEntry.set(entryId, roles);
  }
  _indexFor = registry;
  _index = byEntry;
  return byEntry;
}

/**
 * Roll one feature up across the members into a single status.
 *
 * A member counts as on only when its own switch is `on` **and** its Integration
 * Enabled is not `off`: a member with the integration killed is not being driven
 * either, and reporting it as on would be the same lie the group latch tells. A
 * *missing* Integration Enabled switch (older build) is not evidence of
 * anything, so it reads as enabled.
 *
 * @param memberCoverIds The group's **ACP** member covers — the `member_winners`
 *   keys. Do NOT pass the `member_positions` roster: it can also list a cover
 *   that some *other* ACP entry manages but that this group does not drive, and
 *   the group's bulk service never touches such an entry, so counting it strands
 *   the button in a state no press can clear.
 */
function rollupMemberFeature(
  hass: HomeAssistant,
  registry: EntityRegistryEntry[] | null,
  memberCoverIds: string[],
  feature: SurveyedFeature,
): MemberRollup {
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

  // Counted in COVERS, not entries: a multi-cover entry shares one switch, but
  // "3 of my 4 covers stopped tracking" is the actionable truth, and covers are
  // the unit the roster, the who-won badge and the word "members" already use
  // everywhere else in the card. The shared switch is still only read once per
  // entry.
  const perEntry = new Map<string, boolean | null>();
  let on = 0;
  let total = 0;
  for (const coverId of new Set(memberCoverIds)) {
    const entryId = owner.get(coverId);
    if (!entryId) continue;
    let active = perEntry.get(entryId);
    if (active === undefined) {
      active = entryActive(hass, byEntry.get(entryId), feature);
      perEntry.set(entryId, active);
    }
    // null = the entry cannot report; leave it out rather than call it off.
    if (active === null) continue;
    total++;
    if (active) on++;
  }

  if (total === 0) return UNKNOWN;
  return { status: on === total ? 'all' : on === 0 ? 'none' : 'some', on, total };
}

/**
 * Whether one entry has the surveyed feature active, or `null` when it cannot
 * say.
 *
 * A switch the user has DISABLED in HA stays in the entity registry but has no
 * state at all — an absence of data, not evidence of "off". Reporting a definite
 * grey "off" from it would be the same invention this module exists to remove,
 * so it returns null and the caller drops the member. An `unavailable` state is
 * a different thing: the entity is reporting, and what it reports is not `on`.
 *
 * `Integration Enabled` is read leniently by design — a build that never
 * published it is not evidence of a disabled integration.
 */
function entryActive(
  hass: HomeAssistant,
  roles: EntryRoles | undefined,
  feature: SurveyedFeature,
): boolean | null {
  const switchId = roles?.[feature];
  if (!switchId) return null;
  const own = hass.states[switchId];
  if (!own) return null;
  const enabled = roles.integrationEnabled
    ? hass.states[roles.integrationEnabled]?.state !== 'off'
    : true;
  return own.state === 'on' && enabled;
}

/** Are the members running their sun-tracking automation? (#185) */
export function rollupMemberAutomation(
  hass: HomeAssistant,
  registry: EntityRegistryEntry[] | null,
  memberCoverIds: string[],
): MemberRollup {
  return rollupMemberFeature(hass, registry, memberCoverIds, 'automaticControl');
}

/**
 * Do the members have climate mode enabled? (#287)
 *
 * Not to be confused with the group's read-only `sensor.<group>_climate_mode`,
 * which reports which climate MODE is acting (summer / winter / mixed). That is
 * a different question from whether climate control is switched on, which is
 * why this rollup exists rather than the card reading that sensor.
 */
export function rollupMemberClimate(
  hass: HomeAssistant,
  registry: EntityRegistryEntry[] | null,
  memberCoverIds: string[],
): MemberRollup {
  return rollupMemberFeature(hass, registry, memberCoverIds, 'climateMode');
}
