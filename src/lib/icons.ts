import {
  COVER_TYPE_ICONS,
  COVER_TYPE_ICONS_CLOSED,
  COVER_TYPE_ICONS_OPEN,
  COVER_ICON_FALLBACK,
  COVER_ICON_FALLBACK_CLOSED,
  COVER_ICON_FALLBACK_OPEN,
  COVER_OPEN_THRESHOLD,
  COVER_CLOSED_THRESHOLD,
} from '../const';

/**
 * Pick a cover icon that reflects the current cover position.
 *
 * - position ≥ 95 → "open" variant
 * - position ≤ 5  → "closed" variant
 * - otherwise (including null) → partial / default
 *
 * The deadband prevents flicker when a cover reports e.g. 99 vs 100.
 */
export function pickCoverIcon(coverType: string, position: number | null): string {
  if (position !== null && !Number.isNaN(position)) {
    if (position >= COVER_OPEN_THRESHOLD) {
      return COVER_TYPE_ICONS_OPEN[coverType] ?? COVER_ICON_FALLBACK_OPEN;
    }
    if (position <= COVER_CLOSED_THRESHOLD) {
      return COVER_TYPE_ICONS_CLOSED[coverType] ?? COVER_ICON_FALLBACK_CLOSED;
    }
  }
  return COVER_TYPE_ICONS[coverType] ?? COVER_ICON_FALLBACK;
}
