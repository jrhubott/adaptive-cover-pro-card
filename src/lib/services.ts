import type { HomeAssistant } from 'custom-card-helpers';
import { INTEGRATION_DOMAIN } from '../const';

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
