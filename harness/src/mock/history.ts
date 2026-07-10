import type { SunSample } from '../../../src/lib/sun-model';
import type { HarnessEntry, ManagedCoverCfg } from '../types';
import { buildForecast } from './forecast';

/**
 * One recorded state in the compressed shape returned by HA's
 * `history/history_during_period` websocket command. The cover's position lives
 * in the `current_position` attribute; `lu` is the last-updated epoch (seconds).
 */
export interface CompressedState {
  s: string;
  a: { current_position: number };
  lu: number;
}

/**
 * Synthesize a per-cover recorded `current_position` history for the harness
 * (which has no recorder). Derives an "actual" line from the same decided
 * forecast, then diverges it from the prediction so the overlay is visible:
 *   - covers move in discrete ~5% steps and trail the forecast by a short lag
 *     (real actuation is stepped and delayed), and
 *   - during a manual override the cover is held flat at `held_position` while
 *     the (solar-only) forecast keeps moving.
 * The last point is pinned to the cover's current snapshot position so the actual
 * line meets the cover-bar's reality at the "now" cursor. Truncated to
 * `[dayStart, now]` since actual history only exists in the past.
 */
export function buildActualHistory(
  entry: HarnessEntry,
  cover: ManagedCoverCfg,
  samples: SunSample[],
  nowMs: number,
): CompressedState[] {
  const { forecast } = buildForecast(entry, samples);
  const held =
    entry.flags.manual_override && entry.flags.held_position !== null
      ? entry.flags.held_position
      : null;
  const LAG = 2; // trail the forecast by ~2 samples
  const STEP = 5; // covers move in ~5% increments

  const out: CompressedState[] = [];
  let prev: number | null = null;
  for (let i = 0; i < forecast.length; i++) {
    const tMs = Date.parse(forecast[i].t);
    if (Number.isNaN(tMs) || tMs > nowMs) continue;
    let pos = forecast[Math.max(0, i - LAG)].position;
    pos = Math.round(pos / STEP) * STEP;
    if (held !== null) pos = held;
    // Emit only on change (recorder-like) so the parser's forward-fill is exercised.
    if (pos !== prev) {
      out.push({ s: 'open', a: { current_position: pos }, lu: tMs / 1000 });
      prev = pos;
    }
  }

  // Pin the trailing point to the current snapshot so the actual line reaches now.
  const finalPos = held !== null ? held : cover.position;
  if (finalPos !== null && !Number.isNaN(nowMs)) {
    out.push({ s: 'open', a: { current_position: finalPos }, lu: nowMs / 1000 });
  }
  return out;
}
