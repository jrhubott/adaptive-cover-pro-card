import { axisDisplayValue, type ResolvedAxis } from './axes';

/**
 * Where a group's members actually sit, in DRAWN (coverage) coordinates.
 *
 * The aggregate position sensor publishes a mean, and a mean is the one number
 * guaranteed to describe none of the members: a Living Room group with three
 * covers at 40% and two at 0% publishes 24%, which no cover has ever been at and
 * which reads as a single settled position rather than as two clusters. Drawing
 * that mean as a fill made the tile confidently wrong.
 *
 * Everything here is already mapped through {@link axisDisplayValue}, so a
 * caller can hand these straight to a CSS width without knowing the polarity.
 */
export interface MemberSpread {
  /** Drawn value of the least-covering member — the fill every member reaches. */
  min: number;
  /** Drawn value of the most-covering member. */
  max: number;
  /** One drawn value per member that has a reading, ascending, deduplicated.
   *  Deduplicated because five ticks stacked at one x are five times the paint
   *  for one mark, and the count is carried by {@link readable} anyway. */
  ticks: number[];
  /** How many members had a readable position. */
  readable: number;
  /** Every readable member is at the same drawn value — the case where a single
   *  fill IS honest, and the band collapses to nothing. */
  aligned: boolean;
  /** The same extremes in the LOGICAL frame — the numbers the covers report and
   *  the ones any READOUT must show. Distinct from {@link min}/{@link max},
   *  which are coverage coordinates for drawing: on a blind the two are
   *  mirrored, so a rail filled to 60 is a cover reporting 40, and printing the
   *  drawn number beside the bar would contradict every other readout. */
  logicalMin: number;
  logicalMax: number;
}

/**
 * Reduce a `member_positions` map to a drawable spread, or null when nothing is
 * readable (all members unknown, or an empty roster) — the caller then has
 * nothing truthful to draw and should fall back to the empty rail.
 */
export function memberSpread(
  memberPositions: Record<string, number | null>,
  axis: Pick<ResolvedAxis, 'openBlocksSun' | 'min' | 'max'>,
): MemberSpread | null {
  const drawn: number[] = [];
  const logical: number[] = [];
  for (const value of Object.values(memberPositions)) {
    if (typeof value !== 'number' || Number.isNaN(value)) continue;
    drawn.push(axisDisplayValue(value, axis));
    logical.push(value);
  }
  if (drawn.length === 0) return null;
  drawn.sort((a, b) => a - b);
  logical.sort((a, b) => a - b);
  const ticks = drawn.filter((v, i) => i === 0 || v !== drawn[i - 1]);
  return {
    min: drawn[0],
    max: drawn[drawn.length - 1],
    ticks,
    readable: drawn.length,
    aligned: drawn[0] === drawn[drawn.length - 1],
    logicalMin: logical[0],
    logicalMax: logical[logical.length - 1],
  };
}
