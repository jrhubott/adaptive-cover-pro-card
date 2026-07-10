import type { HomeAssistant } from 'custom-card-helpers';
import { INTEGRATION_DOMAIN } from '../const';
import type { GroupScene } from '../types';

/**
 * Typed `hass.callService` helpers for the card.
 *
 * Introduced per CLAUDE.md's rule that a service call growing past ~2 arg kinds
 * moves out of the component. Two feature groups live here:
 *
 * - **Cover Group** (issue #185): the `group_*` integration services plus the
 *   entity-driven `select`/`switch` helpers the group UI prefers for optimistic
 *   state.
 * - **Multi-axis covers** (#180): `setAxes` feature-detects the integration's
 *   `set_axes` service and otherwise fans out to the legacy per-axis services.
 */

// ── Cover Group: integration service helpers (target = group entity_id) ──────

/** `adaptive_cover_pro.group_activate_scene` — `auto` releases the active scene. */
export function groupActivateScene(
  hass: HomeAssistant,
  groupEntityId: string,
  scene: GroupScene,
): Promise<void> {
  return hass.callService(
    INTEGRATION_DOMAIN,
    'group_activate_scene',
    { scene },
    {
      entity_id: groupEntityId,
    },
  ) as unknown as Promise<void>;
}

/** `adaptive_cover_pro.group_lock` — lock the whole group (no fields). */
export function groupLock(hass: HomeAssistant, groupEntityId: string): Promise<void> {
  return hass.callService(
    INTEGRATION_DOMAIN,
    'group_lock',
    {},
    {
      entity_id: groupEntityId,
    },
  ) as unknown as Promise<void>;
}

/** `adaptive_cover_pro.group_unlock` — release the group lock (no fields). */
export function groupUnlock(hass: HomeAssistant, groupEntityId: string): Promise<void> {
  return hass.callService(
    INTEGRATION_DOMAIN,
    'group_unlock',
    {},
    {
      entity_id: groupEntityId,
    },
  ) as unknown as Promise<void>;
}

/** `adaptive_cover_pro.group_set_position` — position (0-100), optional tilt (0-100). */
export function groupSetPosition(
  hass: HomeAssistant,
  groupEntityId: string,
  position: number,
  tilt?: number,
): Promise<void> {
  const data = tilt === undefined ? { position } : { position, tilt };
  return hass.callService(INTEGRATION_DOMAIN, 'group_set_position', data, {
    entity_id: groupEntityId,
  }) as unknown as Promise<void>;
}

/** `adaptive_cover_pro.group_clear_overrides` — clear member overrides (no fields). */
export function groupClearOverrides(hass: HomeAssistant, groupEntityId: string): Promise<void> {
  return hass.callService(
    INTEGRATION_DOMAIN,
    'group_clear_overrides',
    {},
    {
      entity_id: groupEntityId,
    },
  ) as unknown as Promise<void>;
}

/** `adaptive_cover_pro.group_set_automation` — toggle group automation. */
export function groupSetAutomation(
  hass: HomeAssistant,
  groupEntityId: string,
  enabled: boolean,
): Promise<void> {
  return hass.callService(
    INTEGRATION_DOMAIN,
    'group_set_automation',
    { enabled },
    {
      entity_id: groupEntityId,
    },
  ) as unknown as Promise<void>;
}

// ── Cover Group: entity-driven helpers (optimistic UI, preferred by the tile) ─

/** Drive the group scene `select` entity directly (`select.select_option`). */
export function groupSelectScene(
  hass: HomeAssistant,
  sceneSelectEntityId: string,
  scene: GroupScene,
): Promise<void> {
  return hass.callService(
    'select',
    'select_option',
    { option: scene },
    {
      entity_id: sceneSelectEntityId,
    },
  ) as unknown as Promise<void>;
}

/** Drive a group boolean switch entity directly (`switch.turn_on`/`turn_off`).
 *  Used for both the lock and automation switches. */
export function groupSetSwitch(
  hass: HomeAssistant,
  switchEntityId: string,
  on: boolean,
): Promise<void> {
  return hass.callService(
    'switch',
    on ? 'turn_on' : 'turn_off',
    {},
    {
      entity_id: switchEntityId,
    },
  ) as unknown as Promise<void>;
}

// ── Multi-axis covers (#180): set_axes with legacy fallback ──────────────────

/** Values to move, keyed by axis id (matches the integration's `set_axes` keys
 *  AND the legacy per-axis service param names). */
export type AxisValues = Record<string, number>;

export interface SetAxesOptions {
  /** Engage manual override like a slider. Omit to take the service default
   *  (false) — interactive drags must NOT force so today's override semantics
   *  are preserved. */
  force?: boolean;
}

/** Legacy per-axis services, keyed by axis id. Axis ids with no mapping here
 *  are skipped in the legacy fan-out (the modern `set_axes` path handles any
 *  axis the integration declares). */
const LEGACY_AXIS_SERVICES: Record<string, string> = {
  position: 'set_position',
  tilt: 'set_tilt',
};

function hasSetAxes(hass: HomeAssistant): boolean {
  const services = (hass as unknown as { services?: Record<string, Record<string, unknown>> })
    .services;
  return !!services?.[INTEGRATION_DOMAIN]?.set_axes;
}

/**
 * Move one or more cover axes for `entityId`.
 *
 * Feature-detects the integration's `set_axes` service: when present, sends a
 * single combined call `{ axes, [force] }`. When absent (older integration),
 * fans out to the legacy per-axis services (`position` → `set_position`,
 * `tilt` → `set_tilt`), skipping any axis id with no legacy mapping. On the
 * currently-shipped integration this reproduces the card's original one-service
 * calls byte-for-byte.
 */
export function setAxes(
  hass: HomeAssistant,
  entityId: string,
  axes: AxisValues,
  opts?: SetAxesOptions,
): void {
  if (hasSetAxes(hass)) {
    const data: { axes: AxisValues; force?: boolean } = { axes };
    if (opts?.force != null) data.force = opts.force;
    hass.callService(INTEGRATION_DOMAIN, 'set_axes', data, { entity_id: entityId });
    return;
  }
  for (const [axisId, value] of Object.entries(axes)) {
    const service = LEGACY_AXIS_SERVICES[axisId];
    if (!service) continue;
    hass.callService(INTEGRATION_DOMAIN, service, { [axisId]: value }, { entity_id: entityId });
  }
}
