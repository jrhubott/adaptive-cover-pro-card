import type { HomeAssistant } from 'custom-card-helpers';

import { normalizeHandler } from './decision-summary';
import { coverStateIcon } from './icons';
import { isOffline } from './formatters';
import { rollupMemberAutomation, rollupMemberClimate, type MemberRollup } from './member-rollup';
import { getCachedRegistry } from './registry-store';
import {
  groupSelectScene,
  groupSetPosition,
  groupSetSwitch,
  groupSetTilt,
  groupStop,
  supportsTilt,
} from './services';
import type {
  DiscoveredEntities,
  GroupAggregateState,
  GroupPositionAttributes,
  GroupScene,
  GroupWhoWonAttributes,
} from '../types';

/**
 * Single source of truth for reading and driving a Cover Group.
 *
 * The three group surfaces — the tile (`acp-group-tile`), its dialog
 * (`acp-group-dialog`) and the main-card view (`acp-group-view`) — previously
 * each carried their own copy of these reads and writes, and had already drifted
 * apart in four separate ways (different service targets, different at-the-end
 * comparisons, different glyph derivation, different `member_winners` coercion).
 * Anything a surface needs to know or do about a group belongs here so that
 * cannot recur.
 */

export const SCENES: GroupScene[] = ['auto', 'all_open', 'all_closed', 'privacy'];
const AGGREGATE_STATES: GroupAggregateState[] = ['open', 'closed', 'mixed', 'unknown'];

/** Everything the group surfaces render, read once per update. */
export interface GroupSnapshot {
  /** Aggregate position 0..100, or null when unknown/unparseable. */
  position: number | null;
  /** entity_id → live position, for every member (ACP and generic). */
  memberPositions: Record<string, number | null>;
  /** Roster size — the "N/M" denominator. */
  rosterTotal: number;
  /** How many members the group currently drives, or NaN when unavailable. */
  whoWonCount: number;
  /** entity_id → winning handler, ACP members only. **Undefined** (not `{}`)
   *  when the sensor or attribute is absent — the two mean different things to
   *  {@link hasMemberOverrides}, so never coerce this. */
  memberWinners: Record<string, string | null> | undefined;
  /** Aggregate open/closed/mixed state, normalized. */
  aggregate: GroupAggregateState;
  /** Current scene-select option. */
  scene: GroupScene;
  locked: boolean;
  /** The group's `group_automation` switch — a write-only latch recording the
   *  last bulk command, NOT a consensus of the members. Use it to decide what a
   *  press should send, never to describe what the members are doing; that is
   *  {@link memberAutomation}'s job. */
  automationOn: boolean;
  /** Live all/some/none rollup of the members' own automation, or `unknown`
   *  when nothing resolves (cold registry cache, all-generic roster). */
  memberAutomation: MemberRollup;
  /** The group's `group_climate_mode` switch — a bulk latch over the members'
   *  own Climate Mode switches, with the same write-only caveat as
   *  {@link automationOn}. Use it to decide what a press should send, never to
   *  describe the members; that is {@link memberClimate}'s job.
   *
   *  Note the read-only `sensor.<group>_climate_mode` beside this switch does
   *  NOT answer the same question — it reports which climate MODE is acting
   *  (`summer_mode` / `winter_mode` / `mixed`), not whether climate control is
   *  enabled, which is why {@link memberClimate} surveys the members directly. */
  climateOn: boolean;
  /** Live all/some/none rollup of the members' own climate mode, or `unknown`
   *  when nothing resolves. Same contract as {@link memberAutomation}. */
  memberClimate: MemberRollup;
  /** The lock / automation / climate switch entities, when the integration
   *  exposes them. A surface must render each toggle only when its id is
   *  present: the booleans above fall back to sensible defaults, so an absent
   *  switch would otherwise render a live-looking control whose click is a
   *  silent no-op. */
  lockId: string | undefined;
  automationId: string | undefined;
  climateId: string | undefined;
  /** The clear-member-overrides button entity, when the integration exposes it. */
  clearId: string | undefined;
  /** Target for the `group_*` services, or undefined when the group exposes no
   *  entity to address. Every surface must gate its controls on this — not on
   *  the position sensor alone, or the tile and dialog disagree about whether
   *  the same group is controllable. */
  target: string | undefined;
  /** The members' shared HA `device_class`, or undefined when they disagree. */
  deviceClass: string | undefined;
  /** Live aggregate tilt + its cover entity, present only when the optional
   *  aggregate cover exists AND advertises SET_TILT_POSITION. */
  tilt: { entityId: string; value: number | null } | undefined;
}

export function readGroup(hass: HomeAssistant, discovered: DiscoveredEntities): GroupSnapshot {
  const e = discovered.entities;

  const posState = e.group_position_sensor ? hass.states[e.group_position_sensor] : undefined;
  const rawPosition = posState ? parseFloat(posState.state) : NaN;
  const memberPositions =
    (posState?.attributes as GroupPositionAttributes | undefined)?.member_positions ?? {};

  const whoWonState = e.group_who_won_sensor ? hass.states[e.group_who_won_sensor] : undefined;
  const memberWinners = (whoWonState?.attributes as GroupWhoWonAttributes | undefined)
    ?.member_winners;

  const rawAggregate = e.group_state_sensor
    ? (hass.states[e.group_state_sensor]?.state ?? 'unknown')
    : 'unknown';

  const sceneState = e.group_scene_select ? hass.states[e.group_scene_select] : undefined;
  const rawScene =
    (sceneState?.attributes?.current_option as string | undefined) ?? sceneState?.state ?? 'auto';

  const classes = new Set<string>();
  for (const id of Object.keys(memberPositions)) {
    const dc = hass.states[id]?.attributes?.device_class as string | undefined;
    if (dc) classes.add(dc);
  }

  const cover = e.group_cover;
  const tiltable = supportsTilt(hass, cover);

  return {
    position: Number.isNaN(rawPosition) ? null : rawPosition,
    memberPositions,
    rosterTotal: Object.keys(memberPositions).length,
    whoWonCount: whoWonState ? parseInt(whoWonState.state, 10) : NaN,
    memberWinners,
    aggregate: (AGGREGATE_STATES as string[]).includes(rawAggregate)
      ? (rawAggregate as GroupAggregateState)
      : 'unknown',
    scene: (SCENES as string[]).includes(rawScene) ? (rawScene as GroupScene) : 'auto',
    locked: e.group_lock_switch ? hass.states[e.group_lock_switch]?.state === 'on' : false,
    automationOn: e.group_automation_switch
      ? hass.states[e.group_automation_switch]?.state === 'on'
      : true,
    // `false`, not `automationOn`'s optimistic `true`. Neither fallback is ever
    // painted — every toggle is gated on its own id — so this is about what the
    // value MEANS when read outside that gate: an absent automation switch is an
    // old build of an always-automating integration, whereas an absent climate
    // switch is an integration with no group climate feature at all.
    climateOn: e.group_climate_mode_switch
      ? hass.states[e.group_climate_mode_switch]?.state === 'on'
      : false,
    // `member_winners` — the ACP members — NOT the `member_positions` roster.
    // The roster can also list a cover that another ACP entry manages but that
    // this group does not drive (the integration filters ACP-owned covers out of
    // area-derived additions only, not the static member list). Counting one of
    // those would color the button from automation `group_set_automation` cannot
    // reach, stranding it in a state no press clears. Undefined on an older
    // integration → an empty roster → `unknown` → the caller's fallback.
    memberAutomation: rollupMemberAutomation(
      hass,
      getCachedRegistry(),
      Object.keys(memberWinners ?? {}),
    ),
    memberClimate: rollupMemberClimate(hass, getCachedRegistry(), Object.keys(memberWinners ?? {})),
    lockId: e.group_lock_switch,
    automationId: e.group_automation_switch,
    climateId: e.group_climate_mode_switch,
    clearId: e.group_clear_overrides_button,
    // The `group_*` services resolve the group through the registry from ANY
    // entity of its config entry, so the always-present aggregate-position
    // sensor stands in when the optional aggregate cover is not enabled.
    target: cover ?? e.group_position_sensor,
    deviceClass: classes.size === 1 ? [...classes][0] : undefined,
    tilt:
      cover && tiltable
        ? {
            entityId: cover,
            value:
              (hass.states[cover]?.attributes?.current_tilt_position as number | undefined) ?? null,
          }
        : undefined,
  };
}

/** The handlers the integration's group who-won sensor counts — its
 *  `_GROUP_HANDLER_NAMES`. Kept here so {@link restrictSnapshot} can recount
 *  that scalar over a subset instead of trusting a total taken over all
 *  members. */
const GROUP_DRIVEN_HANDLERS: ReadonlySet<string> = new Set(['group_scene', 'group_lock']);

/**
 * A snapshot with the hidden members removed — positions, winners, and every
 * scalar the integration published over the FULL roster.
 *
 * The scalars are the reason this exists. `position`, `aggregate` and
 * `whoWonCount` arrive as finished numbers from three sensors that know nothing
 * about a per-card `members` key, so dropping keys from `memberPositions` alone
 * would leave a tile reading "Mixed · 1 unavailable · 0/6" over a roster of two.
 * Each is therefore recomputed from the surviving members using the same rule
 * the integration uses: the aggregate percentage is their mean, the aggregate
 * state is unanimity-or-mixed, and the who-won count is how many of them a
 * group handler currently owns.
 *
 * A no-op when nothing is hidden — the common case keeps the integration's own
 * numbers rather than round-tripping them through arithmetic that could only
 * introduce disagreement.
 */
export function restrictSnapshot(
  hass: HomeAssistant,
  snapshot: GroupSnapshot,
  hidden: ReadonlySet<string>,
): GroupSnapshot {
  if (hidden.size === 0) return snapshot;

  const memberPositions: Record<string, number | null> = {};
  for (const [id, pos] of Object.entries(snapshot.memberPositions)) {
    if (!hidden.has(id)) memberPositions[id] = pos;
  }

  // Undefined and {} mean different things to `hasMemberOverrides`, so an
  // absent map stays absent rather than collapsing to empty.
  let memberWinners: Record<string, string | null> | undefined;
  if (snapshot.memberWinners) {
    memberWinners = {};
    for (const [id, winner] of Object.entries(snapshot.memberWinners)) {
      if (!hidden.has(id)) memberWinners[id] = winner;
    }
  }

  const visible = Object.keys(memberPositions);
  const known = visible.map((id) => memberPositions[id]).filter((p): p is number => p !== null);
  const position = known.length ? known.reduce((a, b) => a + b, 0) / known.length : null;

  // Unanimity or "mixed", read from the covers themselves — the group state
  // sensor's answer describes members that are no longer on this card.
  const states = new Set(visible.map((id) => hass.states[id]?.state));
  const aggregate: GroupAggregateState =
    states.size === 1 && (states.has('open') || states.has('closed'))
      ? ([...states][0] as GroupAggregateState)
      : visible.length === 0
        ? 'unknown'
        : 'mixed';

  const classes = new Set<string>();
  for (const id of visible) {
    const dc = hass.states[id]?.attributes?.device_class as string | undefined;
    if (dc) classes.add(dc);
  }

  return {
    ...snapshot,
    memberPositions,
    memberWinners,
    position,
    aggregate,
    rosterTotal: visible.length,
    // NaN stays NaN: it is the "no who-won sensor" signal every surface gates
    // its badge on, and 0 would render a live-looking "0/N" instead.
    whoWonCount: Number.isNaN(snapshot.whoWonCount)
      ? snapshot.whoWonCount
      : Object.values(memberWinners ?? {}).filter(
          (w) => w && GROUP_DRIVEN_HANDLERS.has(normalizeHandler(w)),
        ).length,
    memberAutomation: rollupMemberAutomation(
      hass,
      getCachedRegistry(),
      Object.keys(memberWinners ?? {}),
    ),
    memberClimate: rollupMemberClimate(hass, getCachedRegistry(), Object.keys(memberWinners ?? {})),
    deviceClass: classes.size === 1 ? [...classes][0] : undefined,
  };
}

/**
 * Glyph for a group, derived from its members.
 *
 * It cannot come from `discovered.cover_type` the way a cover tile's does: that
 * field is only ever populated from the `control_status` sensor, which a group
 * has none of, so it silently keeps `entity-discovery`'s `'cover_blind'` default
 * and every group would render as blinds. Read the members' own HA
 * `device_class` instead — the same signal the cover tile uses — and use it only
 * when they agree. A mixed roster has no honest single answer, so it falls
 * through to the neutral `mdi:window-shutter*` family.
 */
export function groupIcon(snapshot: GroupSnapshot, position: number | null): string {
  return coverStateIcon({
    deviceClass: snapshot.deviceClass,
    // Deliberately not a real cover type — an unmapped key is what selects the
    // neutral shutter fallback family.
    coverType: '',
    position,
  });
}

/**
 * Handlers whose priority is at or above `manual` (80), so one of them winning
 * says nothing about whether a manual override is *also* held underneath.
 *
 * Listed explicitly rather than sliced out of {@link HANDLER_ORDER}: despite
 * that array's "priority order (highest first)" docstring, `group_lock` and
 * `custom_position` — both priority 100 — sit *after* `manual` in it, so array
 * position is not a reliable priority comparison. Priorities per the const.ts
 * notes: force (legacy top), weather 90, group_scene 85, manual 80,
 * group_lock 100, custom_position 100. Everything else is below 80.
 */
/**
 * Handlers that mean a member is being HELD away from whatever the pipeline
 * would otherwise choose — a person, or a rule standing in for one.
 *
 * Narrower than {@link MASKS_MANUAL}, which answers a different question (what
 * a group scene would have to mask). `custom_position` and `group_lock` are
 * deliberately absent: those are configured behaviour doing its job, not an
 * exception worth interrupting the tile's one-line summary for.
 */
const HELD_HANDLERS: ReadonlySet<string> = new Set(['manual', 'force']);

/** The one thing about a roster worth saying instead of its position range. */
export interface MemberException {
  kind: 'unavailable' | 'held';
  count: number;
}

/**
 * The most important deviation in the roster, or null when nothing is off.
 *
 * The group tile has ONE line for a roster of any size, so this picks a single
 * thing to say rather than composing a list. Unavailable wins over held: a cover
 * that cannot be reached is a harder failure than one deliberately parked, and a
 * roster with both has the unreachable one as its real problem.
 *
 * Returns null for the ordinary case, which is the point — the caller then falls
 * back to the position range, so the line is never spent on a non-event. The old
 * "N of M driven" text failed exactly here: the group drives members only while
 * a scene or the lock is active, so it read "0 of 5" almost permanently.
 */
export function memberException(
  hass: HomeAssistant,
  snapshot: Pick<GroupSnapshot, 'memberPositions' | 'memberWinners'>,
): MemberException | null {
  let unavailable = 0;
  for (const [id, pos] of Object.entries(snapshot.memberPositions)) {
    // A null position is the group sensor saying it could not read the member;
    // an explicitly offline state is HA saying the same thing one layer down.
    // Either counts, and a member can present both, so this must not double-count.
    //
    // A MISSING state is neither. `hass.states` is filtered per user by entity
    // permissions and lags on frontend startup, so `isOffline(undefined)` (true,
    // since it tests `!state`) counted a perfectly healthy roster as entirely
    // unavailable for any non-admin — permanently replacing the range readout
    // that `memberSpread` had computed correctly from the attribute alone.
    const st = hass.states[id];
    // HA's own verdict wins whenever there is one. A null position used to
    // count on its own, which mislabelled every ONE-WAY / assumed-state cover:
    // a Somfy-style RTS awning sits at `closed` with no `current_position` at
    // all, so the group sensor has nothing to publish for it and the tile
    // reported a perfectly reachable cover as unavailable, permanently. A
    // missing position is "no position", not "no cover".
    //
    // The null still counts when HA has no state for the entity either — then
    // nothing anywhere can see the member and unavailable is the honest word.
    if (st === undefined ? pos === null : isOffline(st.state)) unavailable += 1;
  }
  if (unavailable > 0) return { kind: 'unavailable', count: unavailable };

  const winners = snapshot.memberWinners;
  if (!winners) return null;
  let held = 0;
  for (const w of Object.values(winners)) {
    if (w && HELD_HANDLERS.has(normalizeHandler(w))) held += 1;
  }
  return held > 0 ? { kind: 'held', count: held } : null;
}

const MASKS_MANUAL: ReadonlySet<string> = new Set([
  'force',
  'weather',
  'group_scene',
  'manual',
  'group_lock',
  'custom_position',
]);

/**
 * Whether the group's clear-overrides button has anything to clear.
 *
 * `group_clear_overrides` releases manual overrides on ACP members, and the only
 * group-level signal is each member's *winning* handler — an override that is
 * held but out-prioritized never appears. So this is deliberately asymmetric:
 * it returns false ONLY when every member's winner sits strictly below `manual`
 * in {@link HANDLER_ORDER}, i.e. a manual override would have won had one
 * existed, proving there is none. A winner at or above `manual` (force, weather,
 * group_scene, group_lock…) could be masking one, so the answer is "unknown" and
 * the button stays enabled — clearing stale overrides *before* unlocking a group
 * is exactly when it is most needed.
 *
 * Undefined (no sensor / older integration) is likewise unknown → enabled.
 */
export function hasMemberOverrides(
  memberWinners: Record<string, string | null> | undefined,
): boolean {
  if (!memberWinners) return true;
  const winners = Object.values(memberWinners);
  if (winners.length === 0) return false;
  return winners.some((w) => !w || MASKS_MANUAL.has(normalizeHandler(w)));
}

// ── writes ──────────────────────────────────────────────────────────────────

export function setGroupPosition(
  hass: HomeAssistant,
  snapshot: GroupSnapshot,
  position: number,
): void {
  if (snapshot.target) groupSetPosition(hass, snapshot.target, position);
}

export function stopGroup(
  hass: HomeAssistant,
  discovered: DiscoveredEntities,
  snapshot: GroupSnapshot,
): void {
  if (snapshot.target) groupStop(hass, snapshot.target, discovered.managed_covers ?? []);
}

export function setGroupTilt(hass: HomeAssistant, snapshot: GroupSnapshot, tilt: number): void {
  if (snapshot.tilt) groupSetTilt(hass, snapshot.tilt.entityId, tilt);
}

export function selectScene(
  hass: HomeAssistant,
  discovered: DiscoveredEntities,
  scene: GroupScene,
): void {
  const id = discovered.entities.group_scene_select;
  if (id) groupSelectScene(hass, id, scene);
}

export function toggleLock(
  hass: HomeAssistant,
  discovered: DiscoveredEntities,
  locked: boolean,
): void {
  const id = discovered.entities.group_lock_switch;
  if (id) groupSetSwitch(hass, id, !locked);
}

export function toggleAutomation(
  hass: HomeAssistant,
  discovered: DiscoveredEntities,
  on: boolean,
): void {
  const id = discovered.entities.group_automation_switch;
  if (id) groupSetSwitch(hass, id, !on);
}

export function toggleClimate(
  hass: HomeAssistant,
  discovered: DiscoveredEntities,
  on: boolean,
): void {
  const id = discovered.entities.group_climate_mode_switch;
  if (id) groupSetSwitch(hass, id, !on);
}

export function clearOverrides(hass: HomeAssistant, buttonId: string): void {
  hass.callService('button', 'press', {}, { entity_id: buttonId });
}
