import type { HistoryBand, PositionHistorySample } from '../types';

/**
 * Window-level summary of a History view — the "how did today go?" read.
 *
 * Every track in the card answers a question about one instant; nothing
 * answered a question about the window as a whole. These are the numbers you
 * tune against: a high move count with small travel means the send threshold is
 * too tight, and a handler-time breakdown shows whether solar tracking actually
 * got to run or spent the day pre-empted.
 *
 * Everything here is pure derivation from series the view already holds — no
 * extra fetch, no `Date.now()` — so it is cheap and directly unit-testable.
 */

export interface HandlerShare {
  /** Raw handler name as recorded by `control_status` (not localized here — the
   *  component maps it through HANDLER_I18N_KEYS). */
  handler: string;
  /** Total milliseconds this handler held the window. */
  ms: number;
  /**
   * Share of the BANDED time, 0–1 — not of the window. The two differ whenever
   * who-won history doesn't cover the whole window (a recorder gap, or the
   * entry added mid-window), so this must not be presented as "x% of the day".
   */
  fraction: number;
}

export interface HistoryStats {
  /** Number of distinct position changes in the window. */
  moves: number;
  /** Sum of absolute position deltas, in percentage points. A cover that went
   *  0→100→0 travelled 200. */
  travel: number;
  /** Handler shares, largest first. Empty when who-won history is unavailable. */
  handlers: HandlerShare[];
  /** Milliseconds any of `bands` spent in an active (`on`) state — used for the
   *  manual-override total. */
  activeMs: number;
}

/**
 * Count position changes and total travel over a series.
 *
 * A "move" is a change in the recorded value, not a recorder row: the recorder
 * emits rows for attribute-only updates, and `fetchPositionHistory` forward-
 * fills its final sample out to the window end. Counting rows would inflate
 * both numbers; counting *changes* is what a user means by "it moved 12 times".
 */
export function countMoves(series: PositionHistorySample[]): { moves: number; travel: number } {
  let moves = 0;
  let travel = 0;
  let prev: number | null = null;
  for (const s of series) {
    if (!Number.isFinite(s.position)) continue;
    if (prev !== null && s.position !== prev) {
      moves += 1;
      travel += Math.abs(s.position - prev);
    }
    prev = s.position;
  }
  return { moves, travel: Math.round(travel) };
}

/**
 * Total time per handler across the who-won bands, largest first.
 *
 * `toBands` already merged consecutive repeats, but the same handler can win
 * more than once across a window (solar → manual → solar), so shares are summed
 * per name rather than taken per band.
 */
export function handlerShares(bands: HistoryBand[]): HandlerShare[] {
  const totals = new Map<string, number>();
  let grand = 0;
  for (const b of bands) {
    const ms = Math.max(0, b.end - b.start);
    if (ms === 0) continue;
    totals.set(b.state, (totals.get(b.state) ?? 0) + ms);
    grand += ms;
  }
  if (grand === 0) return [];
  return [...totals.entries()]
    .map(([handler, ms]) => ({ handler, ms, fraction: ms / grand }))
    .sort((a, b) => b.ms - a.ms);
}

/** Total milliseconds the given bands spent in an active state. `isActive` is
 *  injected so the component's single on/off predicate stays the one source of
 *  truth for what "active" means. */
export function activeDuration(bands: HistoryBand[], isActive: (state: string) => boolean): number {
  let ms = 0;
  for (const b of bands) {
    if (isActive(b.state)) ms += Math.max(0, b.end - b.start);
  }
  return ms;
}

export function summarize(args: {
  actual: PositionHistorySample[];
  whoWon: HistoryBand[];
  overrideBands: HistoryBand[];
  isActive: (state: string) => boolean;
}): HistoryStats {
  const { moves, travel } = countMoves(args.actual);
  return {
    moves,
    travel,
    handlers: handlerShares(args.whoWon),
    activeMs: activeDuration(args.overrideBands, args.isActive),
  };
}

/** Compact duration for the stats line: `4h 20m`, `35m`, or `<1m`. Distinct
 *  from `formatters.formatDuration`, which is second-precision and used for
 *  countdowns; a window total wants hours and minutes only. */
export function formatSpan(ms: number): string {
  const totalMin = Math.round(ms / 60000);
  if (totalMin < 1) return '<1m';
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
