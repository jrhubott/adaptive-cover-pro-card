import { INTEGRATION_DOMAIN } from '../../../src/const';
import type { GroupFields, HarnessConfig, HarnessEntry } from '../types';
import { zonedNowMs, zoneForLongitude } from '../zone';

export interface ServiceCall {
  ts: number;
  domain: string;
  service: string;
  data: Record<string, unknown> | undefined;
  target: { entity_id?: string } | undefined;
  /** Did the harness apply a state-level effect? */
  applied: boolean;
}

/**
 * Apply optimistic state updates for the services the cards actually call.
 *
 * Returns a new HarnessConfig — callers should treat this as immutable and
 * push the result back into the app state. Returns the same config and
 * `applied: false` for service calls we don't recognize (they still get
 * logged so unknown callers are visible).
 */
export function applyService(
  cfg: HarnessConfig,
  domain: string,
  service: string,
  data: Record<string, unknown> | undefined,
  target: { entity_id?: string } | undefined,
): { next: HarnessConfig; applied: boolean } {
  const key = `${domain}.${service}`;
  const entityId = typeof data?.entity_id === 'string' ? data.entity_id : target?.entity_id;

  // switch.toggle / turn_on / turn_off — flip the role's flag if the entity_id
  // matches a known switch role.
  if (
    domain === 'switch' &&
    (service === 'toggle' || service === 'turn_on' || service === 'turn_off')
  ) {
    if (typeof entityId === 'string') {
      const result = toggleSwitchEntity(cfg, entityId, service);
      if (result) return { next: result, applied: true };
    }
    return { next: cfg, applied: false };
  }

  // select.select_option — group scene select (issue #185)
  if (key === 'select.select_option' && typeof entityId === 'string') {
    const option = typeof data?.option === 'string' ? data.option : undefined;
    if (option) {
      const result = selectGroupScene(cfg, entityId, option);
      if (result) return { next: result, applied: true };
    }
    return { next: cfg, applied: false };
  }

  // button.press — reset manual override
  if (key === 'button.press' && typeof entityId === 'string') {
    const result = pressButton(cfg, entityId);
    if (result) return { next: result, applied: true };
    return { next: cfg, applied: false };
  }

  // adaptive_cover_pro.engage_manual_override (#229) — the inverse of the
  // reset button above: engage or extend the override without moving anything.
  if (key === `${INTEGRATION_DOMAIN}.engage_manual_override`) {
    const result = engageManualOverride(cfg, data, target);
    if (result) return { next: result, applied: true };
    return { next: cfg, applied: false };
  }

  // Cover Group: group-wide move / stop (issue #185 follow-up). Both resolve
  // the group from ANY entity of its config entry, exactly like the real
  // services, so the card can target the always-present position sensor.
  if (key === `${INTEGRATION_DOMAIN}.group_set_position` && typeof entityId === 'string') {
    const pos = typeof data?.position === 'number' ? data.position : undefined;
    if (pos === undefined) return { next: cfg, applied: false };
    const result = setGroupPosition(cfg, entityId, pos);
    return result ? { next: result, applied: true } : { next: cfg, applied: false };
  }

  // adaptive_cover_pro.group_stop — no position effect to model, but log it as
  // applied so the service log distinguishes it from an unrecognized call.
  if (key === `${INTEGRATION_DOMAIN}.group_stop`) {
    return { next: cfg, applied: true };
  }

  // cover.* on a group member — the dialog's per-member controls use the native
  // services for members with no ACP pipeline behind them.
  if (key === 'cover.set_cover_position') {
    const pos = typeof data?.position === 'number' ? data.position : undefined;
    if (pos === undefined) return { next: cfg, applied: false };
    const result = setGroupMemberPosition(cfg, entityId, pos);
    return result ? { next: result, applied: true } : { next: cfg, applied: false };
  }
  if (key === 'cover.set_cover_tilt_position') {
    const tilt = typeof data?.tilt_position === 'number' ? data.tilt_position : undefined;
    if (tilt === undefined) return { next: cfg, applied: false };
    const result = setGroupTilt(cfg, entityId, tilt);
    return result ? { next: result, applied: true } : { next: cfg, applied: false };
  }
  if (key === 'cover.stop_cover') {
    return { next: cfg, applied: true };
  }

  // adaptive_cover_pro.set_position — update target + cover positions
  if (key === `${INTEGRATION_DOMAIN}.set_position`) {
    const pos = typeof data?.position === 'number' ? data.position : undefined;
    if (pos === undefined) return { next: cfg, applied: false };
    const member = setGroupMemberPosition(
      cfg,
      target?.entity_id ?? (data?.entity_id as string),
      pos,
    );
    if (member) return { next: member, applied: true };
    return {
      next: updateTargetForCover(cfg, target?.entity_id ?? (data?.entity_id as string), pos),
      applied: true,
    };
  }

  // adaptive_cover_pro.set_tilt — update the venetian slat target + cover tilt
  if (key === `${INTEGRATION_DOMAIN}.set_tilt`) {
    const tilt = typeof data?.tilt === 'number' ? data.tilt : undefined;
    if (tilt === undefined) return { next: cfg, applied: false };
    return {
      next: updateTiltForCover(cfg, target?.entity_id ?? (data?.entity_id as string), tilt),
      applied: true,
    };
  }

  // adaptive_cover_pro.set_axes — combined multi-axis move (issue #180). Applies
  // each axis in `data.axes` via the same target/tilt updaters as the legacy
  // per-axis services.
  if (key === `${INTEGRATION_DOMAIN}.set_axes`) {
    const axes = data?.axes as Record<string, unknown> | undefined;
    if (!axes || typeof axes !== 'object') return { next: cfg, applied: false };
    const cover = typeof data?.entity_id === 'string' ? data.entity_id : target?.entity_id;
    let next = cfg;
    let applied = false;
    if (typeof axes.position === 'number') {
      // An ACP member of a group lives in `group.member_positions`, not in any
      // entry's own cover list, so try the group roster first.
      const member = setGroupMemberPosition(next, cover, axes.position);
      next = member ?? updateTargetForCover(next, cover, axes.position);
      applied = true;
    }
    if (typeof axes.tilt === 'number') {
      const memberTilt = setGroupTilt(next, cover, axes.tilt);
      next = memberTilt ?? updateTiltForCover(next, cover, axes.tilt);
      applied = true;
    }
    return { next, applied };
  }

  // adaptive_cover_pro.stop — leave the position alone but log it.
  if (key === `${INTEGRATION_DOMAIN}.stop`) {
    return { next: cfg, applied: true };
  }

  // adaptive_cover_pro.set_custom_position — toggle a slot
  if (key === `${INTEGRATION_DOMAIN}.set_custom_position`) {
    const cover = typeof data?.entity_id === 'string' ? data.entity_id : target?.entity_id;
    const slot = typeof data?.slot === 'number' ? (data.slot as 1 | 2 | 3 | 4 | 5) : undefined;
    const enabled = typeof data?.enabled === 'boolean' ? data.enabled : undefined;
    if (!cover || !slot || enabled === undefined) return { next: cfg, applied: false };
    return { next: updateSlotForCover(cfg, cover, slot, enabled), applied: true };
  }

  return { next: cfg, applied: false };
}

function toggleSwitchEntity(
  cfg: HarnessConfig,
  entityId: string,
  service: 'toggle' | 'turn_on' | 'turn_off',
): HarnessConfig | null {
  // The harness owns boolean flags on the entry rather than mirroring entity_id.
  // Each switch entity_id contains the role suffix; sniff for the keyword.
  let found = false;
  const entries = cfg.entries.map((e) => {
    if (!entityId.includes(e.entry_id)) return e;
    const set = (curr: boolean): boolean => (service === 'toggle' ? !curr : service === 'turn_on');
    // Cover Group switches (issue #185) live on `e.group`, not `e.flags`.
    if (e.is_group && e.group) {
      if (/group_lock/i.test(entityId)) {
        found = true;
        return { ...e, group: { ...e.group, locked: set(e.group.locked) } };
      }
      if (/group_automation/i.test(entityId)) {
        found = true;
        return { ...e, group: { ...e.group, automation: set(e.group.automation) } };
      }
      // Matches the SWITCH only — the read-only rollup sensor shares this
      // suffix but never reaches a switch service call.
      if (/group_climate_mode/i.test(entityId)) {
        found = true;
        return { ...e, group: { ...e.group, climate: set(e.group.climate) } };
      }
      return e;
    }
    const next = { ...e, flags: { ...e.flags } };
    if (/integration_enabled/i.test(entityId)) {
      next.flags.integration_enabled = set(e.flags.integration_enabled);
      found = true;
    } else if (/automatic_control/i.test(entityId)) {
      next.flags.automatic_control = set(e.flags.automatic_control);
      found = true;
    } else if (/manual_override/i.test(entityId)) {
      next.flags.manual_override = set(e.flags.manual_override);
      found = true;
    } else if (/climate_mode/i.test(entityId)) {
      // Writes the explicit flag rather than the `climate_strategy` proxy it
      // otherwise derives from — a press means "climate off for this cover",
      // not "switch to the intermediate strategy". This is what makes the
      // group-climate-* scenarios interactive: the member's own switch is what
      // rollupMemberClimate surveys.
      next.flags.climate_mode = set(
        e.flags.climate_mode ?? e.flags.climate_strategy !== 'intermediate',
      );
      found = true;
    }
    return next;
  });
  return found ? { ...cfg, entries } : null;
}

function pressButton(cfg: HarnessConfig, entityId: string): HarnessConfig | null {
  let found = false;
  const entries = cfg.entries.map((e) => {
    if (!entityId.includes(e.entry_id)) return e;
    // Cover Group: clearing member overrides drops every `manual` winner back
    // to the group's own driver, which is what the who-won badge counts.
    if (/group_clear_overrides/i.test(entityId)) {
      if (!e.is_group || !e.group) return e;
      found = true;
      const member_winners = Object.fromEntries(
        Object.entries(e.group.member_winners).map(([id, w]) => [id, w === 'manual' ? 'solar' : w]),
      );
      return { ...e, group: { ...e.group, member_winners } };
    }
    if (!/reset_manual_override/i.test(entityId)) return e;
    found = true;
    return { ...e, flags: { ...e.flags, manual_override: false } };
  });
  return found ? { ...cfg, entries } : null;
}

/**
 * Engage/extend the manual override (#229) — the mock of the integration's
 * move-free `engage_manual_override`.
 *
 * `end_time` is absolute, so it re-derives `manual_override_minutes_from_now`
 * against the harness's *fake* clock (the same instant `state-gen` renders the
 * end sensor from) — not wall-clock now, or the countdown would jump. `duration`
 * adds to whatever is left. `end_time` wins, matching the real service.
 */
function engageManualOverride(
  cfg: HarnessConfig,
  data: Record<string, unknown> | undefined,
  target: { entity_id?: string | string[] } | undefined,
): HarnessConfig | null {
  const rawTarget = (data?.entity_id ?? target?.entity_id) as string | string[] | undefined;
  const ids =
    rawTarget === undefined ? undefined : Array.isArray(rawTarget) ? rawTarget : [rawTarget];

  const endTime = typeof data?.end_time === 'string' ? data.end_time : undefined;
  const durationSeconds = readDurationSeconds(data?.duration);
  if (endTime === undefined && durationSeconds === undefined) return null;

  const nowMs = zonedNowMs(cfg.date, cfg.timeOfDayMinutes, zoneForLongitude(cfg.longitude));
  let found = false;

  const entries = cfg.entries.map((e) => {
    // No entity_id targets every entry, mirroring HA's "all matching" default.
    const matches =
      ids === undefined ||
      e.covers.some((c) => ids.includes(c.entity_id)) ||
      ids.includes(e.entry_id);
    if (!matches) return e;

    let minutes: number;
    if (endTime !== undefined) {
      const endMs = Date.parse(endTime);
      if (Number.isNaN(endMs)) return e;
      minutes = Math.round((endMs - nowMs) / 60_000);
    } else {
      const current = e.flags.manual_override ? e.flags.manual_override_minutes_from_now : 0;
      minutes = current + Math.round(durationSeconds! / 60);
    }
    found = true;
    return {
      ...e,
      flags: {
        ...e.flags,
        manual_override: true,
        manual_override_minutes_from_now: minutes,
      },
    };
  });

  return found ? { ...cfg, entries } : null;
}

/** Read HA's `duration` selector shape (`{hours,minutes,seconds}`) as seconds. */
function readDurationSeconds(value: unknown): number | undefined {
  if (typeof value === 'number') return value;
  if (!value || typeof value !== 'object') return undefined;
  const d = value as Record<string, unknown>;
  const num = (k: string): number => (typeof d[k] === 'number' ? (d[k] as number) : 0);
  const total = num('hours') * 3600 + num('minutes') * 60 + num('seconds');
  return total > 0 ? total : undefined;
}

function updateTargetForCover(
  cfg: HarnessConfig,
  coverEntityId: string | undefined,
  pos: number,
): HarnessConfig {
  if (!coverEntityId) {
    // Apply to all entries — single-window setups omit entity_id.
    return {
      ...cfg,
      entries: cfg.entries.map((e) => bumpTarget(e, pos)),
    };
  }
  return {
    ...cfg,
    entries: cfg.entries.map((e) =>
      e.covers.some((c) => c.entity_id === coverEntityId) ? bumpTarget(e, pos, coverEntityId) : e,
    ),
  };
}

function bumpTarget(entry: HarnessEntry, pos: number, only?: string): HarnessEntry {
  return {
    ...entry,
    target_position: pos,
    covers: entry.covers.map((c) => (!only || c.entity_id === only ? { ...c, position: pos } : c)),
  };
}

function updateTiltForCover(
  cfg: HarnessConfig,
  coverEntityId: string | undefined,
  tilt: number,
): HarnessConfig {
  const bump = (entry: HarnessEntry, only?: string): HarnessEntry => ({
    ...entry,
    target_tilt: tilt,
    covers: entry.covers.map((c) => (!only || c.entity_id === only ? { ...c, tilt } : c)),
  });
  if (!coverEntityId) {
    return { ...cfg, entries: cfg.entries.map((e) => bump(e)) };
  }
  return {
    ...cfg,
    entries: cfg.entries.map((e) =>
      e.covers.some((c) => c.entity_id === coverEntityId) ? bump(e, coverEntityId) : e,
    ),
  };
}

/** Apply a group scene `select.select_option` to the matching group entry. */
function selectGroupScene(
  cfg: HarnessConfig,
  entityId: string,
  option: string,
): HarnessConfig | null {
  if (!/group_scene/i.test(entityId)) return null;
  const scene = option as import('../types').GroupFields['scene_option'];
  let found = false;
  const entries = cfg.entries.map((e) => {
    if (!e.is_group || !e.group || !entityId.includes(e.entry_id)) return e;
    found = true;
    return {
      ...e,
      group: {
        ...e.group,
        scene_option: scene,
        active_scene: scene === 'auto' ? ('none' as const) : scene,
      },
    };
  });
  return found ? { ...cfg, entries } : null;
}

/** Recompute a group's aggregate position + open/closed state from its roster.
 *  Mirrors the integration's own aggregation: average of the known member
 *  positions, `open`/`closed` only when every member agrees. */
function reaggregate(group: GroupFields): GroupFields {
  const values = Object.values(group.member_positions).filter(
    (v): v is number => typeof v === 'number',
  );
  if (values.length === 0) return { ...group, state: 'unknown' };
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const state = values.every((v) => v <= 0)
    ? ('closed' as const)
    : values.every((v) => v >= 100)
      ? ('open' as const)
      : ('mixed' as const);
  return { ...group, aggregate_position: avg, state };
}

/** `adaptive_cover_pro.group_set_position` — fan the position out to every
 *  member of the group the targeted entity belongs to. */
function setGroupPosition(
  cfg: HarnessConfig,
  entityId: string,
  position: number,
): HarnessConfig | null {
  let found = false;
  const entries = cfg.entries.map((e) => {
    if (!e.is_group || !e.group || !entityId.includes(e.entry_id)) return e;
    found = true;
    const member_positions = Object.fromEntries(
      Object.keys(e.group.member_positions).map((id) => [id, position]),
    );
    return { ...e, group: reaggregate({ ...e.group, member_positions }) };
  });
  return found ? { ...cfg, entries } : null;
}

/** A move addressed at a single group member (`cover.set_cover_position` for a
 *  generic member, `set_axes`/`set_position` for an ACP one). Group entries own
 *  no covers of their own, so this is the only path that moves one row. */
function setGroupMemberPosition(
  cfg: HarnessConfig,
  coverEntityId: string | undefined,
  position: number,
): HarnessConfig | null {
  if (!coverEntityId) return null;
  let found = false;
  const entries = cfg.entries.map((e) => {
    if (!e.is_group || !e.group) return e;
    if (!(coverEntityId in e.group.member_positions)) return e;
    found = true;
    return {
      ...e,
      group: reaggregate({
        ...e.group,
        member_positions: { ...e.group.member_positions, [coverEntityId]: position },
      }),
    };
  });
  return found ? { ...cfg, entries } : null;
}

/** `cover.set_cover_tilt_position` on either the group's aggregate cover
 *  entity (group-wide tilt) or one member (a roster row's tilt track). */
function setGroupTilt(
  cfg: HarnessConfig,
  entityId: string | undefined,
  tilt: number,
): HarnessConfig | null {
  if (!entityId) return null;
  let found = false;
  const entries = cfg.entries.map((e) => {
    if (!e.is_group || !e.group) return e;
    if (entityId in e.group.member_positions) {
      found = true;
      return {
        ...e,
        group: {
          ...e.group,
          member_tilts: { ...(e.group.member_tilts ?? {}), [entityId]: tilt },
        },
      };
    }
    // The aggregate cover's entity_id carries the entry id and the role suffix.
    if (entityId.includes(e.entry_id) && /group_cover/i.test(entityId)) {
      found = true;
      const member_tilts = Object.fromEntries(
        Object.keys(e.group.member_positions).map((id) => [id, tilt]),
      );
      return { ...e, group: { ...e.group, tilt, member_tilts } };
    }
    return e;
  });
  return found ? { ...cfg, entries } : null;
}

function updateSlotForCover(
  cfg: HarnessConfig,
  coverEntityId: string,
  slot: 1 | 2 | 3 | 4 | 5,
  enabled: boolean,
): HarnessConfig {
  return {
    ...cfg,
    entries: cfg.entries.map((e) =>
      e.covers.some((c) => c.entity_id === coverEntityId)
        ? {
            ...e,
            slots: e.slots.map((s) => (s.slot === slot ? { ...s, enabled } : s)),
          }
        : e,
    ),
  };
}
