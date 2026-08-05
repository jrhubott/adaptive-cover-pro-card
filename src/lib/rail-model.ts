import type { DiscoveredEntities } from '../types';

/**
 * Cover types whose managed covers are **layers of one physical opening** rather
 * than independent covers.
 *
 * The tile renders one position rail per managed cover, which makes two very
 * different entries look identical: a day/night shade whose two rails are the
 * bottom and middle bar of ONE shade, and a plain blind entry someone attached
 * three separate windows to. Both arrive as `managed_covers.length > 1` and both
 * stack the same rails with the same glyph.
 *
 * The integration already distinguishes them by cover type:
 *   - `cover_day_night_shade` — `dual_entity` control model, two rail entities
 *     of one shade, coupled by a no-pass constraint.
 *   - `cover_dual_panel` — a sheer and a blackout panel over one window.
 * Every other type takes exactly one cover per opening, so a second managed
 * cover on those is a second window.
 *
 * A card-side set, like `OPEN_BLOCKS_SUN_COVER_TYPES` in `axes.ts`, because
 * `cover_discovery` publishes only `{cover_type, cover_label, axes}` — there is
 * no layered flag to read. If the integration grows one, prefer it and demote
 * this to the same kind of fallback that set is.
 */
const LAYERED_COVER_TYPES = new Set(['cover_day_night_shade', 'cover_dual_panel']);

/**
 * Are this entry's rails layers of one cover (true) or separate covers (false)?
 *
 * False for a single-rail entry regardless of type: there is nothing to tell
 * apart, so callers can use this to gate the whole treatment without also
 * testing the rail count. Pass the tile's OWN rail list when it has one — a tile
 * narrowed to a single rail of a day/night shade is showing one cover, and
 * bracketing a lone rail says something untrue about it.
 */
export function railsAreOneCover(discovered: DiscoveredEntities, railCount: number): boolean {
  if (railCount < 2) return false;
  // A Cover Group's members are always separate covers; its `cover_type` is
  // whatever the first member reported and must not leak into this decision.
  if (discovered.is_group) return false;
  return LAYERED_COVER_TYPES.has(discovered.cover_type);
}
