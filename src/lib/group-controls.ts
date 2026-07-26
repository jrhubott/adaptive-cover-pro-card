import type { HomeAssistant } from 'custom-card-helpers';

import { normalizeHandler } from './decision-summary';
import { coverStateIcon } from './icons';
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
  automationOn: boolean;
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

export function clearOverrides(hass: HomeAssistant, buttonId: string): void {
  hass.callService('button', 'press', {}, { entity_id: buttonId });
}
