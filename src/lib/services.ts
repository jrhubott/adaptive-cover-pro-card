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
 * - **Manual override** (#229): `engageManualOverride` extends (or engages) a
 *   move-free manual override, feature-detected like `setAxes`.
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

/** `adaptive_cover_pro.group_stop` — stop every member cover mid-travel.
 *
 *  Shipped alongside the group cover entity, so an older integration may not
 *  have it. Feature-detected like {@link setAxes}: when the service is absent
 *  the caller's member roster is stopped one-by-one with plain `cover.stop_cover`,
 *  which every cover platform supports. */
export function groupStop(
  hass: HomeAssistant,
  groupEntityId: string,
  memberCovers: string[] = [],
): void {
  const services = (hass as unknown as { services?: Record<string, Record<string, unknown>> })
    .services;
  if (services?.[INTEGRATION_DOMAIN]?.group_stop) {
    hass.callService(INTEGRATION_DOMAIN, 'group_stop', {}, { entity_id: groupEntityId });
    return;
  }
  if (memberCovers.length === 0) return;
  hass.callService('cover', 'stop_cover', {}, { entity_id: memberCovers });
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

/** Tilt the whole group through its aggregate cover entity. Unlike position
 *  there is no `group_set_tilt` service, and `group_set_position` requires a
 *  `position` — resending one would stomp members' own position overrides. So
 *  group tilt is offered ONLY when the optional aggregate cover exists and
 *  advertises `SET_TILT_POSITION`; see {@link supportsTilt}. */
export function groupSetTilt(
  hass: HomeAssistant,
  groupCoverEntityId: string,
  tilt: number,
): Promise<void> {
  return hass.callService(
    'cover',
    'set_cover_tilt_position',
    { tilt_position: tilt },
    { entity_id: groupCoverEntityId },
  ) as unknown as Promise<void>;
}

// ── Cover Group: per-member writes (dialog + main-card roster) ───────────────

/** `CoverEntityFeature.SET_TILT_POSITION`. */
const COVER_FEATURE_SET_TILT = 128;

/** Does this cover entity advertise a settable tilt axis? */
export function supportsTilt(hass: HomeAssistant, entityId: string | undefined): boolean {
  if (!entityId) return false;
  const features = hass.states[entityId]?.attributes?.supported_features;
  return typeof features === 'number' && (features & COVER_FEATURE_SET_TILT) !== 0;
}

/**
 * Move one axis of a single group member.
 *
 * Routing is split by whether the member has an ACP pipeline behind it
 * (`acpManaged` — true when it appears in the group's `member_winners`):
 *
 * - **ACP member** → {@link setAxes}, which engages that member's own manual
 *   override exactly like dragging its tile. A raw `cover.*` write here would
 *   be silently re-driven on the next pipeline run.
 * - **Generic member** → the native `cover.*` service. It has no ACP pipeline
 *   to override, and `set_axes` would not resolve it.
 */
export function setGroupMemberAxis(
  hass: HomeAssistant,
  entityId: string,
  axisId: 'position' | 'tilt',
  value: number,
  acpManaged: boolean,
): void {
  if (acpManaged) {
    setAxes(hass, entityId, { [axisId]: value });
    return;
  }
  if (axisId === 'tilt') {
    hass.callService(
      'cover',
      'set_cover_tilt_position',
      { tilt_position: value },
      {
        entity_id: entityId,
      },
    );
    return;
  }
  hass.callService('cover', 'set_cover_position', { position: value }, { entity_id: entityId });
}

/** Stop a single group member mid-travel. ACP members go through the
 *  integration's `stop` (same call the cover tile's ■ makes); a generic member
 *  takes the native service. */
export function stopGroupMember(hass: HomeAssistant, entityId: string, acpManaged: boolean): void {
  if (acpManaged) {
    hass.callService(INTEGRATION_DOMAIN, 'stop', {}, { entity_id: entityId });
    return;
  }
  hass.callService('cover', 'stop_cover', {}, { entity_id: entityId });
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

// ── Manual override (#229) ───────────────────────────────────────────────────

export interface EngageManualOverrideOptions {
  /** Absolute end of the override. Serialized with `.toISOString()` so the wire
   *  value always carries an explicit UTC offset — see the note on
   *  {@link engageManualOverride}. Wins over `duration` when both are given. */
  endTime?: Date;
  /** Seconds to extend an active override by (or engage fresh for, if none is
   *  active). Ignored when `endTime` is set. */
  duration?: number;
}

/** `adaptive_cover_pro.engage_manual_override` shipped in integration v2026.7.0
 *  — recent enough that older installs must degrade gracefully rather than
 *  render an affordance that throws. Mirrors {@link setAxes}' feature-detect. */
export function hasEngageManualOverride(hass: HomeAssistant): boolean {
  const services = (hass as unknown as { services?: Record<string, Record<string, unknown>> })
    .services;
  return !!services?.[INTEGRATION_DOMAIN]?.engage_manual_override;
}

/**
 * Extend (or engage) a move-free manual override on `entityIds`.
 *
 * Timezone contract: the integration treats an `end_time` with no UTC offset as
 * UTC, not local time (services.yaml:203-205), so a naive local ISO string would
 * silently shift the override by the viewer's offset. `.toISOString()` is always
 * `Z`-suffixed, which sidesteps the trap entirely.
 *
 * Sends `end_time` **or** `duration`, never both: the integration lets `end_time`
 * win, but the card shouldn't lean on a tie-break. With neither, this no-ops
 * rather than silently engaging for the configured default duration.
 */
export function engageManualOverride(
  hass: HomeAssistant,
  entityIds: string[],
  opts: EngageManualOverrideOptions,
): void {
  const data: { end_time?: string; duration?: { seconds: number } } = {};
  if (opts.endTime) {
    data.end_time = opts.endTime.toISOString();
  } else if (opts.duration != null) {
    data.duration = { seconds: opts.duration };
  } else {
    return;
  }
  hass.callService(INTEGRATION_DOMAIN, 'engage_manual_override', data, { entity_id: entityIds });
}
