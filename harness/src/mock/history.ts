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

/**
 * Per-cover divergence for the History card's per-cover lines.
 *
 * {@link buildActualHistory} models one cover trailing the forecast. This adds a
 * per-cover personality on top: cover 0 tracks normally, and every later cover
 * lags further and (for the last one) STALLS partway through the window. The
 * stall is the case the per-cover lines exist for — the aggregate mean only
 * sags a little when one cover of three stops moving, which reads as sluggish
 * rather than broken.
 */
export function buildDivergentHistory(
  entry: HarnessEntry,
  cover: ManagedCoverCfg,
  index: number,
  samples: SunSample[],
  nowMs: number,
): CompressedState[] {
  const base = buildActualHistory(entry, cover, samples, nowMs);
  if (index === 0 || base.length === 0) return base;

  // The last cover of a multi-cover entry stops responding at the midpoint.
  const stalls = index >= 2;
  const stallAt = base[Math.floor(base.length / 2)]?.lu ?? nowMs / 1000;
  const offset = index * 8; // each cover sits a little further from the target

  const out: CompressedState[] = [];
  let frozen: number | null = null;
  for (const st of base) {
    if (stalls && st.lu >= stallAt) {
      if (frozen === null) frozen = st.a.current_position;
      continue;
    }
    out.push({
      ...st,
      a: { current_position: Math.max(0, Math.min(100, st.a.current_position - offset)) },
    });
  }
  if (frozen !== null) {
    out.push({ s: 'open', a: { current_position: frozen }, lu: nowMs / 1000 });
  }
  return out;
}

/** A generated hour (0–23, in the environment's local time) falls in the
 *  "slats don't move overnight" span — roughly 10:40 PM to 10:20 AM, rounded to
 *  whole hours since the mock steps in coarse increments. Mirrors
 *  `mock/events.ts`'s `isOvernightHour` (the two mocks have no shared module to
 *  hang a single copy off of, and it is one line). */
function isOvernightHour(hour: number): boolean {
  return hour >= 22 || hour < 10;
}

/**
 * Synthesize recorded slat tilt for a venetian cover. Tracks the entry's tilt
 * target with a lag across a HANDFUL of real changes, holding perfectly FLAT
 * overnight, so the History card's tilt track has both a target line and an
 * actual line that visibly differ during the day — and a long flat overnight
 * gap that exercises the same step-vs-interpolated render path as the position
 * track (issue #253). The original dense 30-minute sinusoid never produced a
 * gap long enough to tell a stepped line from an interpolated one.
 */
export function buildTiltHistory(
  entry: HarnessEntry,
  cover: ManagedCoverCfg,
  startMs: number,
  nowMs: number,
): CompressedState[] {
  const target = entry.target_tilt ?? 50;
  const out: CompressedState[] = [];
  const STEP_MS = 90 * 60 * 1000; // candidate change points, a bit over an hour apart
  let i = 0;
  let last: number | null = null;
  for (let t = startMs; t < nowMs; t += STEP_MS, i++) {
    if (isOvernightHour(new Date(t).getHours()) && last !== null) continue;
    const swing = Math.round(20 * Math.sin(i / 4));
    const tilt = Math.max(0, Math.min(100, target + swing));
    if (tilt === last) continue; // recorder only stores transitions
    out.push({ s: 'open', a: { current_tilt_position: tilt } as never, lu: t / 1000 });
    last = tilt;
  }
  const finalTilt = cover.tilt ?? target;
  out.push({ s: 'open', a: { current_tilt_position: finalTilt } as never, lu: nowMs / 1000 });
  return out;
}
