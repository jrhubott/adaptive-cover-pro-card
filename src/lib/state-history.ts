import type { HomeAssistant } from 'custom-card-helpers';
import type { HistoryBand, StateSample } from '../types';

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
