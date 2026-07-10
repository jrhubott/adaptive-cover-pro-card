import type { HomeAssistant } from 'custom-card-helpers';
import { INTEGRATION_DOMAIN } from '../const';
import type { GroupScene } from '../types';

/**
 * Typed `hass.callService` helpers for the Cover Group feature (issue #185).
 *
 * Two flavours live here:
 *
 * 1. **Integration service helpers** (`group_*` services on the
 *    `adaptive_cover_pro` domain, targeting the group entity_id). These are the
 *    authoritative controls; Phase 3's main-card group view drives them.
 * 2. **Entity-driven helpers** (`select.select_option`, `switch.turn_on/off`).
 *    Where an entity already exists (scene select, lock/automation switches) the
 *    UI prefers these so Home Assistant's own optimistic-state handling updates
 *    the control instantly. The tile group variant uses these.
 *
 * This is the first `src/lib/services.ts` — introduced per CLAUDE.md's rule that
 * a service call growing past ~2 arg kinds moves out of the component. Existing
 * cover/tilt calls stay inline for now (out of scope).
 */

// ── Integration service helpers (target = group entity_id) ──────────────────

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

// ── Entity-driven helpers (optimistic UI, preferred by the tile) ────────────

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
