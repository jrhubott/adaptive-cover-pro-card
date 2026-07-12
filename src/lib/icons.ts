import {
  COVER_TYPE_ICONS,
  COVER_TYPE_ICONS_CLOSED,
  COVER_TYPE_ICONS_OPEN,
  COVER_ICON_FALLBACK,
  COVER_ICON_FALLBACK_CLOSED,
  COVER_ICON_FALLBACK_OPEN,
  COVER_OPEN_THRESHOLD,
  COVER_CLOSED_THRESHOLD,
  COVER_DEVICE_CLASS_ICONS,
  COVER_BUTTON_INSET_CLASSES,
  COVER_OPEN_ICON,
  COVER_CLOSE_ICON,
  COVER_OPEN_ICON_INSET,
  COVER_CLOSE_ICON_INSET,
  type CoverIconVariants,
} from '../const';

/**
 * Resolve an open/partial/closed variant set against a live position, using the
 * shared deadband:
 *
 * - position ≥ 95 → `open`
 * - position ≤ 5  → `closed`
 * - otherwise (including null / NaN) → `partial`
 *
 * The deadband prevents flicker when a cover reports e.g. 99 vs 100.
 */
function pickVariant(variants: CoverIconVariants, position: number | null): string {
  if (position !== null && !Number.isNaN(position)) {
    if (position >= COVER_OPEN_THRESHOLD) return variants.open;
    if (position <= COVER_CLOSED_THRESHOLD) return variants.closed;
  }
  return variants.partial;
}

/**
 * Pick a cover icon that reflects the current cover position, keyed by the
 * integration's `cover_type`. Falls through to the generic window-shutter
 * family for any unmapped `coverType`.
 */
export function pickCoverIcon(coverType: string, position: number | null): string {
  return pickVariant(
    {
      open: COVER_TYPE_ICONS_OPEN[coverType] ?? COVER_ICON_FALLBACK_OPEN,
      partial: COVER_TYPE_ICONS[coverType] ?? COVER_ICON_FALLBACK,
      closed: COVER_TYPE_ICONS_CLOSED[coverType] ?? COVER_ICON_FALLBACK_CLOSED,
    },
    position,
  );
}

/** Inputs for {@link coverStateIcon}, gathered from the underlying HA cover. */
export interface CoverStateIconInput {
  /** The cover entity's explicit `icon` attribute, if set. Wins over device_class. */
  explicitIcon?: string;
  /** The cover entity's HA `device_class`, if any. */
  deviceClass?: string;
  /** The integration's `cover_type` (fallback when no device_class matches). */
  coverType: string;
  /** Live cover position 0..100, or null when unknown. */
  position: number | null;
}

/**
 * Resolve a cover glyph using HA standards, applying (in order):
 *   1. explicit entity `icon` attribute (if a non-empty string)
 *   2. position-aware `device_class` glyph ({@link COVER_DEVICE_CLASS_ICONS})
 *   3. the integration `cover_type` mapping ({@link pickCoverIcon})
 *   4. the generic `mdi:window-shutter*` fallback (tail of `pickCoverIcon`)
 *
 * (The per-card `cfg.icon` override is applied by the call site ahead of this,
 * since it is a card-config concern, not an entity-state one.)
 */
export function coverStateIcon(input: CoverStateIconInput): string {
  const { explicitIcon, deviceClass, coverType, position } = input;
  if (typeof explicitIcon === 'string' && explicitIcon.length > 0) return explicitIcon;
  if (deviceClass) {
    const variants = COVER_DEVICE_CLASS_ICONS[deviceClass];
    if (variants) return pickVariant(variants, position);
  }
  return pickCoverIcon(coverType, position);
}

/**
 * Glyph for the "open" (↑) control button given a cover `device_class`. Awnings,
 * curtains, doors, and gates use the horizontal expand affordance; everything
 * else (and a missing device_class) uses the up arrow.
 */
export function coverOpenIcon(deviceClass?: string): string {
  return deviceClass && COVER_BUTTON_INSET_CLASSES.has(deviceClass)
    ? COVER_OPEN_ICON_INSET
    : COVER_OPEN_ICON;
}

/** Glyph for the "close" (↓) control button given a cover `device_class`. */
export function coverCloseIcon(deviceClass?: string): string {
  return deviceClass && COVER_BUTTON_INSET_CLASSES.has(deviceClass)
    ? COVER_CLOSE_ICON_INSET
    : COVER_CLOSE_ICON;
}
