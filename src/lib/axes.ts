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
  /** True when the integration dispatches `100 − logical` for this axis, so
   *  cover-frame reads must be un-inverted before the card renders them
   *  (issue #234). False on every older integration and on the synthesized
   *  fallback axes — the normalization is then inert. */
  inverted: boolean;
  /** True when driving this axis toward its MAXIMUM blocks more sun — an awning
   *  extends as its position rises, while a blind uncovers the window. This is
   *  the integration's own polarity flag, and it is what decides which end of a
   *  rail reads as "full": see {@link axisDisplayValue}.
   *
   *  Distinct from {@link inverted}, which is a data-frame correction on the
   *  values themselves. This one never changes a value the card reads or
   *  writes — only which end of the track draws as filled. */
  openBlocksSun: boolean;
}

/**
 * Map a logical axis value to the value the rail should *draw*, so a full rail
 * always means "blocking the most sun" regardless of which direction the axis
 * counts in. Identity for an awning (extending raises the value AND the
 * coverage); mirrored for a blind or a slat angle, where the maximum is the
 * fully-uncovered end.
 *
 * This is a **presentation transform**, not a value-frame correction: it maps
 * between the logical frame the card reads and writes and the direction the
 * track is drawn in. Every value that reaches a sensor comparison or a service
 * call is in the logical frame — a pointer or keyboard commit passes through
 * here precisely to convert a drawn fraction BACK before writing. Keep it clear
 * of the real frame corrections (`inverted` / #234, `linear_position` / #1028),
 * which change what a value means rather than which way it is painted.
 *
 * Its own inverse: applying it to a rail fraction converts back to a logical
 * value, which is why one function serves both the fill and the pointer.
 */
export function axisDisplayValue(
  value: number,
  axis: Pick<ResolvedAxis, 'openBlocksSun' | 'min' | 'max'>,
): number {
  return axis.openBlocksSun ? value : axis.min + axis.max - value;
}

/**
 * Map a logical axis value onto its 0–100 DRAWN track fraction.
 *
 * {@link axisDisplayValue} mirrors in axis units, which is all a 0–100 position
 * rail ever needs; an axis with its own range (a slat angle at −90..90) has to
 * be normalized onto the track first. The two are the same mirroring rule —
 * `normalize(axisDisplayValue(v)) === 100 − normalize(v)` — so this is
 * `axisDisplayValue` composed with the normalize step the position rails can
 * skip, and every rail can take its fill from here.
 *
 * Deliberately not a `Pick<>` of the pointer helpers' argument by accident:
 * `acp-axis-bar` satisfies this shape structurally from its own reactive
 * `min`/`max`/`openBlocksSun` properties, which is what lets a component with
 * no `ResolvedAxis` in hand call it.
 */
export function axisFraction(
  value: number | null | undefined,
  axis: Pick<ResolvedAxis, 'min' | 'max' | 'openBlocksSun'>,
): number {
  // "No reading" draws EMPTY, never full. Substituting `min` was harmless
  // while the track drew the value directly, but on a mirrored axis it maps
  // to a completely full bar — an unknown cover would read as fully blocking.
  if (value === null || value === undefined || Number.isNaN(value)) return 0;
  const span = axis.max - axis.min;
  if (span === 0) return 0;
  const pct = ((value - axis.min) / span) * 100;
  const clamped = Math.max(0, Math.min(100, pct));
  return axis.openBlocksSun ? clamped : 100 - clamped;
}

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_UNIT = '%';

/**
 * Cover types whose POSITION axis blocks more sun as it opens — the integration
 * declares its own `POSITION_AXIS_OPEN_BLOCKS_SUN` singleton for exactly these
 * (`cover_types/awning.py`, `cover_types/oscillating_awning.py`).
 *
 * Only a fallback. `open_blocks_sun` on the discovery payload is authoritative
 * whenever it is present, and a tenth cover type gets it right without touching
 * this list. This exists for the two cases that publish no flag: no
 * `cover_discovery` at all, and a `cover_discovery` from an integration that
 * predates the field — where defaulting to `false` would draw every awning
 * backwards.
 */
const OPEN_BLOCKS_SUN_COVER_TYPES = new Set(['cover_awning', 'cover_oscillating_awning']);

function fallbackOpenBlocksSun(discovered: DiscoveredEntities, axisId: string): boolean {
  return axisId === 'position' && OPEN_BLOCKS_SUN_COVER_TYPES.has(discovered.cover_type);
}

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
 * The role mapping is id-based with one exception: the entry's *declared
 * leading* axis always takes `target_position_sensor`, whatever its id. That
 * mirrors the integration exactly — `Cover_Position` carries the PRIMARY axis's
 * target for every cover type, and `Cover_Tilt` is created only where
 * `exposes_dual_axis_sensor` is true (venetian / day-night shade). Without it a
 * tilt-only policy's slat axis looks for a `Cover_Tilt` entity that was never
 * created, and its target renders nowhere (issue #277). It keys on the DECLARED
 * leader rather than the surviving one, so a dual-axis entry whose position axis
 * is merely undrivable keeps its real `Cover_Tilt` sensor. No-op for every entry
 * whose leading axis is already `position`, which is every non-tilt-only policy.
 *
 * Fallback path (no `cover_discovery`, or a malformed one): synthesize a
 * `position` axis always, and a `tilt` axis only when `target_tilt_sensor`
 * exists — the card's original dual-axis gate. Labels/min/max/unit take card
 * defaults.
 */
export function resolveAxes(discovered: DiscoveredEntities): ResolvedAxis[] {
  const axes = discovered.discovery?.axes;
  if (Array.isArray(axes)) {
    const leadingDeclaredId = axes.find((a) => !!a && typeof a.id === 'string')?.id;
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
        targetRole:
          a.id === leadingDeclaredId
            ? 'target_position_sensor'
            : AXIS_TARGET_SENSOR_ROLES[a.id as string],
        inverted: a.inverted === true,
        // Read defensively like every other field: an integration that publishes
        // `cover_discovery` but predates `open_blocks_sun` must not have its
        // awnings silently mirrored by a `=== true` default.
        openBlocksSun:
          typeof a.open_blocks_sun === 'boolean'
            ? a.open_blocks_sun
            : fallbackOpenBlocksSun(discovered, a.id as string),
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
      inverted: false,
      // The sky compass reads this same resolved axis (`geometry.ts` →
      // `coverWedgeOuterRadius` takes the flag), so an entry with no discovery
      // still has one polarity across every surface.
      openBlocksSun: fallbackOpenBlocksSun(discovered, 'position'),
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
      inverted: false,
      openBlocksSun: false,
    });
  }
  return resolved;
}

/**
 * The entry's position axis, always resolvable — the card's POLARITY oracle.
 *
 * Discovery publishes it for every cover type that HAS one; a tilt-only type
 * (`cover_tilt`, louvered roof) publishes only its slat axis, and an older
 * integration publishes nothing at all. Those two cases still need a defined
 * `open_blocks_sun` and a 0–100 range, because the sky compass wedge, the three
 * group surfaces and `geometry.ts` all take one from here — handing a slat axis
 * to {@link axisDisplayValue} instead would take its min/max, which need not be
 * the 0–100 a track fraction is expressed in.
 *
 * It is deliberately NOT the answer to "does this entry drive a position?" —
 * it always says yes. Surfaces that render a position VALUE ask
 * {@link hasPositionAxis}, and the ↑■↓ buttons take {@link primaryAxisFor}
 * (issue #277).
 *
 * Single source for that fallback: it was synthesized in three places, and the
 * copies had already drifted apart.
 */
export function positionAxisFor(discovered: DiscoveredEntities): ResolvedAxis {
  return (
    resolveAxes(discovered).find((a) => a.id === 'position') ?? {
      id: 'position',
      label: 'Position',
      min: DEFAULT_MIN,
      max: DEFAULT_MAX,
      unit: DEFAULT_UNIT,
      stateAttr: 'current_position',
      targetRole: 'target_position_sensor',
      inverted: false,
      openBlocksSun: fallbackOpenBlocksSun(discovered, 'position'),
    }
  );
}

/**
 * Does this entry actually HAVE a position axis?
 *
 * The predicate {@link positionAxisFor} deliberately cannot answer: it always
 * returns one, because the compass wedge and the group surfaces need a defined
 * polarity even for an entry that drives no position. The surfaces that render
 * a position *value* — the tile's `%` readout, its position rail, the dialog's
 * Position track, the icon's open/closed variant — need the real answer, or a
 * tilt-only entry gets a rail whose fill and target tick are two different axes
 * (issue #277).
 *
 * True on every legacy / no-discovery entry, because the fallback path
 * synthesizes a position axis — so every gate built on this is inert there.
 * Reads the SUPPORTED axes only: an axis the entry cannot drive is not one the
 * card can render.
 */
export function hasPositionAxis(discovered: DiscoveredEntities): boolean {
  return resolveAxes(discovered).some((a) => a.id === 'position');
}

/**
 * The axis this entry is primarily *about* — the one the ↑■↓ buttons drive and
 * the one the position-named integration surfaces describe.
 *
 * The integration's leading declared axis, which is the position axis for every
 * policy that has one: all eleven declare it first (`blind`, `awning`,
 * `oscillating_awning`, `sliding_curtain`, `roof_window`, and the two dual-axis
 * policies whose tuple is `(POSITION_AXIS, TILT_AXIS)`), and `supported_axes`
 * only ever filters the declared tuple, never reorders it. So this differs from
 * {@link positionAxisFor} in exactly one case: a tilt-only type (`cover_tilt`,
 * louvered roof) that declares no position axis at all, where the slat axis is
 * the only thing `set_axes` will accept.
 *
 * Falls back to the synthesized position axis when nothing survives the
 * `supported` filter — identical to today's behavior for that degenerate case.
 */
export function primaryAxisFor(discovered: DiscoveredEntities): ResolvedAxis {
  return resolveAxes(discovered)[0] ?? positionAxisFor(discovered);
}

/**
 * Is this entry's *position* axis effectively inverted right now (issue #234)?
 *
 * The single oracle for the card's frame normalization: when true, every value
 * read from a cover-frame source — the cover entity's `current_position`, the
 * sensor's `actual_positions`, recorded position history — is `100 − logical`
 * and must be un-inverted at the read. False on any integration that doesn't
 * publish the flag, which makes the normalization inert.
 */
export function positionAxisInverted(discovered: DiscoveredEntities): boolean {
  return resolveAxes(discovered).find((a) => a.id === 'position')?.inverted ?? false;
}
