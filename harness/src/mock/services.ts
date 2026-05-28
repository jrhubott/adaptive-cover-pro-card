import { INTEGRATION_DOMAIN } from '../../../src/const';
import type { HarnessConfig, HarnessEntry } from '../types';

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

  // button.press — reset manual override
  if (key === 'button.press' && typeof entityId === 'string') {
    const result = pressButton(cfg, entityId);
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

  // adaptive_cover_pro.stop — leave the position alone but log it.
  if (key === `${INTEGRATION_DOMAIN}.stop`) {
    return { next: cfg, applied: true };
  }

  // adaptive_cover_pro.set_custom_position — toggle a slot
  if (key === `${INTEGRATION_DOMAIN}.set_custom_position`) {
    const cover = typeof data?.entity_id === 'string' ? data.entity_id : target?.entity_id;
    const slot = typeof data?.slot === 'number' ? (data.slot as 1 | 2 | 3 | 4) : undefined;
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
    const next = { ...e, flags: { ...e.flags } };
    const set = (curr: boolean): boolean => (service === 'toggle' ? !curr : service === 'turn_on');
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
    return { ...e, flags: { ...e.flags, manual_override: false, force_override_triggers: 0 } };
  });
  return found ? { ...cfg, entries } : null;
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

function updateSlotForCover(
  cfg: HarnessConfig,
  coverEntityId: string,
  slot: 1 | 2 | 3 | 4,
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
