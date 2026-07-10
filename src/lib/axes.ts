import { AXIS_TARGET_SENSOR_ROLES, type EntityRole } from '../const';
import type { DiscoveredEntities } from '../types';

/**
 * A cover axis the card renders + controls, resolved from the integration's
 * self-discovery descriptor when present, or synthesized from today's signals
 * when it is absent (older integration). The fallback path reproduces the
 * card's pre-discovery behavior byte-for-byte: always a `position` axis, plus a
 * `tilt` axis iff the entry exposes a `target_tilt_sensor`.
 */
export interface ResolvedAxis {
  /** Axis id — the `set_axes` key AND legacy `set_position`/`set_tilt` param. */
  id: string;
  /** Discovery-supplied English label, or a capitalized id fallback. The
   *  rendering component prefers the card i18n key for known ids over this. */
  label: string;
  min: number;
  max: number;
  unit: string;
  /** State attribute on the managed cover entity carrying this axis's live
   *  value (e.g. `current_tilt_position`). Used for secondary axes; the
   *  position axis keeps sourcing from `actual_positions`. */
  stateAttr?: string;
  /** Card role of the sensor carrying this axis's solar target, if known. */
  targetRole?: EntityRole;
}

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_UNIT = '%';

function capitalize(id: string): string {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

/**
 * Ordered list of the supported axes for a discovered entry.
 *
 * Discovery path: filter `supported === false`, preserve the integration's
 * declared order, and map each axis id onto its target-sensor role. Every field
 * is read defensively so a partial payload still resolves.
 *
 * Fallback path (no `cover_discovery`, or a malformed one): synthesize a
 * `position` axis always, and a `tilt` axis only when `target_tilt_sensor`
 * exists — the card's original dual-axis gate. Labels/min/max/unit take card
 * defaults.
 */
export function resolveAxes(discovered: DiscoveredEntities): ResolvedAxis[] {
  const axes = discovered.discovery?.axes;
  if (Array.isArray(axes)) {
    return axes
      .filter(
        (a): a is NonNullable<typeof a> => !!a && typeof a.id === 'string' && a.supported !== false,
      )
      .map((a) => ({
        id: a.id as string,
        label: a.label ?? capitalize(a.id as string),
        min: typeof a.min === 'number' ? a.min : DEFAULT_MIN,
        max: typeof a.max === 'number' ? a.max : DEFAULT_MAX,
        unit: typeof a.unit === 'string' ? a.unit : DEFAULT_UNIT,
        stateAttr: typeof a.state_attr === 'string' ? a.state_attr : undefined,
        targetRole: AXIS_TARGET_SENSOR_ROLES[a.id as string],
      }));
  }

  const resolved: ResolvedAxis[] = [
    {
      id: 'position',
      label: capitalize('position'),
      min: DEFAULT_MIN,
      max: DEFAULT_MAX,
      unit: DEFAULT_UNIT,
      stateAttr: 'current_position',
      targetRole: 'target_position_sensor',
    },
  ];
  if (discovered.entities.target_tilt_sensor) {
    resolved.push({
      id: 'tilt',
      label: capitalize('tilt'),
      min: DEFAULT_MIN,
      max: DEFAULT_MAX,
      unit: DEFAULT_UNIT,
      stateAttr: 'current_tilt_position',
      targetRole: 'target_tilt_sensor',
    });
  }
  return resolved;
}
