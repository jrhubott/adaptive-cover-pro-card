import type { HomeAssistant } from 'custom-card-helpers';
import type { HistoryBand, PositionHistorySample, StateSample } from '../types';

/**
 * Generic recorder state history — the counterpart to `position-history.ts`.
 *
 * `position-history.ts` is purpose-built: it reads the `current_position`
 * attribute off physical cover entities and reduces every cover to one mean
 * series. The History card needs the *other* recorded shapes — a sensor's plain
 * state over time (who won the pipeline, what action was last taken) and a
 * binary sensor's on/off spans (sun in FOV, glare active, manual override). Both
 * are "state as a step function", so they share one fetch and one band reducer
 * here rather than growing `position-history.ts` a second personality.
 *
 * Same degradation contract as `position-history.ts`: recorder disabled, no
 * retained history, or a rejected call all yield an empty map, and the card
 * simply omits the affected track.
 */

/** A single state as returned by `history/history_during_period`, in either the
 *  compressed (`s`/`a`/`lu`/`lc`) or uncompressed shape. Mirrors the parser in
 *  `position-history.ts` — HA has shipped both across versions. */
interface RawHistoryState {
  s?: string;
  state?: string;
  a?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
  lu?: number;
  lc?: number;
  last_updated?: string;
  last_changed?: string;
}

/** Epoch-ms timestamp from a compressed or uncompressed state, or null. */
function readTimestamp(st: RawHistoryState): number | null {
  if (typeof st.lu === 'number') return st.lu * 1000;
  if (typeof st.lc === 'number') return st.lc * 1000;
  const iso = st.last_updated ?? st.last_changed;
  if (typeof iso === 'string') {
    const ms = Date.parse(iso);
    if (!Number.isNaN(ms)) return ms;
  }
  return null;
}

/** Walk one entity's raw state list into sorted `{t, state, attributes}` samples. */
export function parseStateSeries(states: unknown): StateSample[] {
  if (!Array.isArray(states)) return [];
  const out: StateSample[] = [];
  for (const raw of states as RawHistoryState[]) {
    if (!raw || typeof raw !== 'object') continue;
    const t = readTimestamp(raw);
    const state = raw.s ?? raw.state;
    if (t === null || typeof state !== 'string') continue;
    out.push({ t, state, attributes: raw.a ?? raw.attributes ?? {} });
  }
  out.sort((a, b) => a.t - b.t);
  return out;
}

/**
 * Collapse a state series into contiguous bands, merging consecutive samples
 * that report the same state. The final band runs to `endMs` (the state is
 * still in effect — the recorder only stores transitions), and a leading sample
 * before `startMs` is clamped forward so the band covers the window's left edge.
 *
 * Pure and unit-tested. Returns `[]` for an empty series or an inverted window.
 */
export function toBands(samples: StateSample[], startMs: number, endMs: number): HistoryBand[] {
  if (samples.length === 0 || endMs <= startMs) return [];

  // Everything at or before the window start collapses to a single carry-in
  // sample pinned to startMs (the most recent one wins — it is the state in
  // effect as the window opens). Everything after passes through unchanged.
  let carryIn: StateSample | null = null;
  const inWindow: StateSample[] = [];
  for (const s of samples) {
    if (s.t >= endMs) break;
    if (s.t <= startMs) carryIn = s;
    else inWindow.push(s);
  }
  const ordered: StateSample[] = carryIn
    ? [{ ...carryIn, t: startMs }, ...inWindow]
    : [...inWindow];
  if (ordered.length === 0) return [];

  const bands: HistoryBand[] = [];
  for (const s of ordered) {
    const prev = bands[bands.length - 1];
    // Merge a repeat of the same state into the open band (the recorder stores
    // attribute-only updates as fresh states).
    if (prev && prev.state === s.state) continue;
    if (prev) prev.end = s.t;
    bands.push({ start: s.t, end: endMs, state: s.state, attributes: s.attributes });
  }
  return bands.filter((b) => b.end > b.start);
}

/**
 * Reduce a state series to numeric points — the ACP target track.
 *
 * `position-history.ts` reads the *physical* cover entities' `current_position`
 * attribute; this reads a sensor whose STATE is itself the number, which is how
 * the integration publishes `Cover_Position`. Plotted together they answer the
 * question the card exists for: did the cover go where ACP told it to?
 *
 * Frame handling mirrors `lib/cover-position.ts`: the `linear_position`
 * attribute is already logical (pre-interpolation *and* pre-inversion) and wins
 * when present; otherwise the state is the dispatched value and needs flipping
 * on an `inverse_state` install (#219, #234). Non-numeric samples (`unknown`,
 * `unavailable`) are dropped rather than plotted as zero.
 */
export function toNumericSeries(
  samples: StateSample[],
  opts: { preferAttribute?: string; inverted?: boolean } = {},
): Array<{ t: number; value: number }> {
  const out: Array<{ t: number; value: number }> = [];
  for (const s of samples) {
    const attrRaw = opts.preferAttribute ? s.attributes[opts.preferAttribute] : undefined;
    if (typeof attrRaw === 'number' && Number.isFinite(attrRaw)) {
      out.push({ t: s.t, value: attrRaw });
      continue;
    }
    const parsed = parseFloat(s.state);
    if (Number.isNaN(parsed)) continue;
    out.push({ t: s.t, value: opts.inverted ? 100 - parsed : parsed });
  }
  return out;
}

/** `PositionHistorySample[]` (ISO `t`) → the `{t, value}` shape `stepExpand`
 *  and `valueAt` share. Unparseable timestamps are dropped rather than
 *  plotted at `NaN`. */
export function isoToPoints(series: PositionHistorySample[]): Array<{ t: number; value: number }> {
  return series
    .map((s) => ({ t: Date.parse(s.t), value: s.position }))
    .filter((p): p is { t: number; value: number } => !Number.isNaN(p.t));
}

/**
 * Restrict a step-function series to `[startMs, endMs]`, pinning the state in
 * effect as the window opened to the left edge.
 *
 * The recorder answers a window query with that pre-window state as the first
 * row, carrying its own un-clamped `last_changed` — the same phenomenon
 * {@link toBands} names and handles with its own `carryIn`. Dropping the row
 * instead would erase everything up to the first in-window transition; a cover
 * that last moved yesterday would render nothing at all.
 *
 * Samples past `endMs` are dropped outright: the axis mappers in
 * `lib/geometry.ts` clamp an out-of-window timestamp onto the axis's right
 * edge, so keeping one would draw a spurious spike there. Note the deliberate
 * `>` where {@link toBands} uses `>=` — a zero-width band is meaningless, but
 * a polyline vertex sitting exactly on the right edge is not.
 *
 * ORDER RELATIVE TO {@link stepExpand} IS LOAD-BEARING: clamp first, expand
 * second. Expanding a raw series and filtering the result afterwards drops the
 * boundary carry-in (it still sits at its true pre-window timestamp), and
 * filtering the raw series first — without pinning — erases the transition
 * entirely.
 *
 * Pure. Returns `[]` for an empty series or an inverted window.
 */
export function clampToWindow(
  points: Array<{ t: number; value: number }>,
  startMs: number,
  endMs: number,
): Array<{ t: number; value: number }> {
  if (points.length === 0 || !(endMs > startMs)) return [];
  const sorted = [...points].sort((a, b) => a.t - b.t);
  let carryIn: { t: number; value: number } | null = null;
  const inWindow: Array<{ t: number; value: number }> = [];
  for (const p of sorted) {
    if (p.t > endMs) break;
    if (p.t <= startMs) carryIn = p;
    else inWindow.push(p);
  }
  return carryIn ? [{ t: startMs, value: carryIn.value }, ...inWindow] : inWindow;
}

/**
 * Expand a step-function series into render-ready hold vertices.
 *
 * The recorder stores transitions only — a value holds until the next sample —
 * but SVG's `<polyline>` linearly interpolates between consecutive points. Fed
 * straight through, a long gap between two real samples draws a diagonal ramp
 * instead of the flat-then-step shape the data actually represents (issue
 * #253's overnight-hold-then-drop symptom). This inserts a carry-forward point
 * immediately before every value change (same time as the new sample, value of
 * the one it replaces) so the polyline holds flat right up to the step, and
 * extends the final value out to `endMs` when the last sample is still in
 * effect there.
 *
 * Pure and render-local: apply this to a COPY of a series right before mapping
 * it into screen coordinates, never to the stored series itself —
 * {@link valueAt}'s hold-lookup and `history-stats.ts`'s move-counting both
 * read the raw series and must not see synthesized points.
 *
 * Returns `[]` for an empty series — no terminator point is conjured from
 * nothing (mirrors {@link toBands}'s empty-input guard).
 */
export function stepExpand(
  points: Array<{ t: number; value: number }>,
  endMs: number,
): Array<{ t: number; value: number }> {
  if (points.length === 0) return [];

  const out: Array<{ t: number; value: number }> = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    if (cur.value !== prev.value) out.push({ t: cur.t, value: prev.value });
    out.push(cur);
  }

  const last = out[out.length - 1];
  if (last.t < endMs) out.push({ t: endMs, value: last.value });
  return out;
}

/**
 * Value in effect at `t` — the last sample at or BEFORE it.
 *
 * These are step functions: the recorder stores transitions, and a value holds
 * until the next one. Picking the nearest sample in either direction reads the
 * FUTURE whenever the cursor sits just before a change — hovering at 17:55 on a
 * target that drops to 0 at 18:00 would report 0%, disagreeing with the very
 * line under the cursor. Null before the first sample, where nothing is known.
 */
export function valueAt(points: Array<{ t: number; value: number }>, t: number): number | null {
  let best: number | null = null;
  let bestT = Number.NEGATIVE_INFINITY;
  for (const p of points) {
    if (Number.isNaN(p.t)) continue;
    if (p.t <= t && p.t >= bestT) {
      bestT = p.t;
      best = p.value;
    }
  }
  return best;
}

/**
 * Fetch recorded state for the given entities over `[startMs, endMs]`.
 * Returns one parsed series per entity id. Never rejects — any failure yields
 * an empty map, and an entity with no retained history is simply absent.
 */
export async function fetchStateHistory(
  hass: HomeAssistant,
  entityIds: string[],
  startMs: number,
  endMs: number,
): Promise<Record<string, StateSample[]>> {
  const ids = entityIds.filter((id) => typeof id === 'string' && id.length > 0);
  if (ids.length === 0) return {};

  let response: Record<string, unknown> | undefined;
  try {
    response = await hass.callWS<Record<string, unknown>>({
      type: 'history/history_during_period',
      start_time: new Date(startMs).toISOString(),
      end_time: new Date(endMs).toISOString(),
      entity_ids: ids,
      minimal_response: false,
      no_attributes: false,
      significant_changes_only: false,
    });
  } catch {
    return {};
  }
  if (!response || typeof response !== 'object') return {};

  const out: Record<string, StateSample[]> = {};
  for (const id of ids) {
    const series = parseStateSeries(response[id]);
    if (series.length > 0) out[id] = series;
  }
  return out;
}
