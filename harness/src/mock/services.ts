import { INTEGRATION_DOMAIN } from '../../../src/const';
import type { HarnessConfig, HarnessEntry } from '../types';
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

  // adaptive_cover_pro.set_position — update target + cover positions
  if (key === `${INTEGRATION_DOMAIN}.set_position`) {
    const pos = typeof data?.position === 'number' ? data.position : undefined;
    if (pos === undefined) return { next: cfg, applied: false };
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
      next = updateTargetForCover(next, cover, axes.position);
      applied = true;
    }
    if (typeof axes.tilt === 'number') {
      next = updateTiltForCover(next, cover, axes.tilt);
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
    }
    return next;
  });
  return found ? { ...cfg, entries } : null;
}

function pressButton(cfg: HarnessConfig, entityId: string): HarnessConfig | null {
  let found = false;
  const entries = cfg.entries.map((e) => {
    if (!entityId.includes(e.entry_id)) return e;
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
