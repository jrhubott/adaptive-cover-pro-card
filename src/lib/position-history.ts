import type { HomeAssistant } from 'custom-card-helpers';
import type { PositionHistorySample } from '../types';
import { aggregateActualPosition } from './geometry';

/**
 * Actual cover-position history, sourced from Home Assistant's recorder.
 *
 * The integration exposes no ready-made history: `Cover_Position.actual_positions`
 * is a point-in-time snapshot (and unrecorded), and `position_forecast.forecast`
 * is a recomputed projection (also unrecorded). So the only source of *actual*
 * position over time is the recorder — the physical cover entities' recorded
 * `current_position`. This module fetches that via the `history/history_during_period`
 * websocket command and reduces it to a single aggregate series (mean across
 * covers, mirroring {@link aggregateActualPosition}).
 *
 * Everything degrades to an empty series: recorder disabled, no retained history,
 * or a rejected call all yield `[]`, and the forecast strip simply omits the line.
 */

/** Raw per-cover point after parsing (epoch ms + numeric position). */
interface RawPoint {
  t: number;
  position: number;
}

/**
 * A single state as returned by `history/history_during_period`. The command
 * uses a compressed shape (`s`/`a`/`lu`/`lc`); we also accept the uncompressed
 * shape (`state`/`attributes`/`last_updated`) for robustness across HA versions.
 * Cover position lives in the `current_position` attribute, which is only present
 * when it changed — callers forward-fill the last known value.
 */
interface HistoryState {
  s?: string;
  state?: string;
  a?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
  lu?: number;
  lc?: number;
  last_updated?: string;
  last_changed?: string;
}

/** Extract epoch-ms timestamp from a compressed or uncompressed state, or null. */
function readTimestamp(st: HistoryState): number | null {
  if (typeof st.lu === 'number') return st.lu * 1000;
  if (typeof st.lc === 'number') return st.lc * 1000;
  const iso = st.last_updated ?? st.last_changed;
  if (typeof iso === 'string') {
    const ms = Date.parse(iso);
    if (!Number.isNaN(ms)) return ms;
  }
  return null;
}

/** The cover attribute carrying the primary (position) axis. */
export const POSITION_ATTR = 'current_position';
/** The cover attribute carrying the secondary (slat tilt) axis, on covers that
 *  advertise SET_TILT_POSITION. */
export const TILT_ATTR = 'current_tilt_position';

/** Extract a numeric axis attribute, or null when absent/non-numeric.
 *  `attr` defaults to `current_position`, so existing callers are unchanged. */
function readPosition(st: HistoryState, attr: string = POSITION_ATTR): number | null {
  const attrs = st.a ?? st.attributes;
  const raw = attrs?.[attr];
  return typeof raw === 'number' && !Number.isNaN(raw) ? raw : null;
}

/** Walk one entity's state list into forward-filled `{t, position}` points. */
function parseEntityStates(states: HistoryState[], attr: string = POSITION_ATTR): RawPoint[] {
  const points: RawPoint[] = [];
  let last: number | null = null;
  for (const st of states) {
    const t = readTimestamp(st);
    const pos = readPosition(st, attr);
    if (pos !== null) last = pos;
    if (t !== null && last !== null) points.push({ t, position: last });
  }
  return points;
}

/**
 * Merge per-cover position series into a single aggregate series. Pure and
 * unit-tested. Builds the union of timestamps, forward-fills each cover's last
 * known position, and averages the covers that have a value at each timestamp
 * (via {@link aggregateActualPosition}). Timestamps where no cover has reported
 * yet are skipped. A single cover passes through (sorted, deduped).
 */
export function mergeCoverHistories(perCover: Record<string, RawPoint[]>): PositionHistorySample[] {
  const covers = Object.keys(perCover).filter((id) => perCover[id].length > 0);
  if (covers.length === 0) return [];

  const sorted: Record<string, RawPoint[]> = {};
  const allTs = new Set<number>();
  for (const id of covers) {
    const list = [...perCover[id]].sort((a, b) => a.t - b.t);
    sorted[id] = list;
    for (const p of list) allTs.add(p.t);
  }
  const timeline = [...allTs].sort((a, b) => a - b);

  const idx: Record<string, number> = {};
  const lastKnown: Record<string, number | null> = {};
  for (const id of covers) {
    idx[id] = 0;
    lastKnown[id] = null;
  }

  const out: PositionHistorySample[] = [];
  for (const t of timeline) {
    for (const id of covers) {
      const list = sorted[id];
      while (idx[id] < list.length && list[idx[id]].t <= t) {
        lastKnown[id] = list[idx[id]].position;
        idx[id]++;
      }
    }
    const mean = aggregateActualPosition(lastKnown);
    if (mean !== null) out.push({ t: new Date(t).toISOString(), position: mean });
  }
  return out;
}

/**
 * Fetch recorded actual position for the given entities over `[startMs, endMs]`
 * and return one aggregate series. Never rejects — any failure yields `[]`.
 *
 * `inverted` (issue #234): on an `inverse_state` entry the recorder holds the
 * *dispatched* `current_position`, i.e. `100 − logical`. The forecast strip
 * plots this track against the logical forecast/target curve, so the samples
 * are flipped into the logical frame here rather than at the render. The flip
 * is applied post-merge — the mean of flips equals the flip of the mean, so
 * {@link mergeCoverHistories} stays pure and untouched. Defaults false, which
 * makes it inert on every non-inverse install.
 */
export async function fetchPositionHistory(
  hass: HomeAssistant,
  entityIds: string[],
  startMs: number,
  endMs: number,
  inverted = false,
): Promise<PositionHistorySample[]> {
  if (entityIds.length === 0) return [];

  let response: Record<string, HistoryState[]> | undefined;
  try {
    response = await hass.callWS<Record<string, HistoryState[]>>({
      type: 'history/history_during_period',
      start_time: new Date(startMs).toISOString(),
      end_time: new Date(endMs).toISOString(),
      entity_ids: entityIds,
      minimal_response: false,
      no_attributes: false,
      significant_changes_only: false,
    });
  } catch {
    return [];
  }
  if (!response || typeof response !== 'object') return [];

  const perCover: Record<string, RawPoint[]> = {};
  for (const id of entityIds) {
    const states = response[id];
    if (!Array.isArray(states)) continue;
    const points = parseEntityStates(states);
    if (points.length > 0) perCover[id] = points;
  }

  const merged = mergeCoverHistories(perCover);
  // The last recorder point is the last position *change*, which may be hours
  // before now. The cover is still there, so forward-fill the last position out
  // to `endMs` so the actual line reaches the "now" cursor instead of stopping short.
  if (merged.length > 0) {
    const last = merged[merged.length - 1];
    if (Date.parse(last.t) < endMs) {
      merged.push({ t: new Date(endMs).toISOString(), position: last.position });
    }
  }
  if (!inverted) return merged;
  return merged.map((s) => ({ t: s.t, position: 100 - s.position }));
}

/**
 * Per-cover recorded history for one axis — the un-aggregated counterpart to
 * {@link fetchPositionHistory}.
 *
 * The aggregate mean is the right default (one line, one story), but it hides
 * exactly the failure a history view exists to expose: when one cover of several
 * fails to move, the mean drifts a little and looks merely sluggish. Keeping the
 * covers separate makes the stuck one obvious.
 *
 * `attribute` selects the axis: {@link POSITION_ATTR} (default) or
 * {@link TILT_ATTR} for the venetian slat axis. `inverted` flips the samples into
 * the logical frame exactly as {@link fetchPositionHistory} does — note the two
 * axes carry INDEPENDENT inversion options in the integration (`inverse_state`
 * vs `inverse_tilt`, issues #234/#236), so callers must pass the flag for the
 * axis they asked for, not the entry's position flag.
 *
 * Never rejects — any failure yields `{}`. Covers with no retained history are
 * simply absent from the result.
 */
export async function fetchPerCoverHistory(
  hass: HomeAssistant,
  entityIds: string[],
  startMs: number,
  endMs: number,
  opts: { attribute?: string; inverted?: boolean } = {},
): Promise<Record<string, PositionHistorySample[]>> {
  const ids = entityIds.filter((id) => typeof id === 'string' && id.length > 0);
  if (ids.length === 0) return {};
  const attribute = opts.attribute ?? POSITION_ATTR;

  let response: Record<string, HistoryState[]> | undefined;
  try {
    response = await hass.callWS<Record<string, HistoryState[]>>({
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

  const out: Record<string, PositionHistorySample[]> = {};
  for (const id of ids) {
    const states = response[id];
    if (!Array.isArray(states)) continue;
    const points = parseEntityStates(states, attribute);
    if (points.length === 0) continue;
    const series = points
      .sort((a, b) => a.t - b.t)
      .map((p) => ({
        t: new Date(p.t).toISOString(),
        position: opts.inverted ? 100 - p.position : p.position,
      }));
    // Same forward-fill as the aggregate: the last recorded change may be hours
    // old, but the cover is still there, so carry it to the window's end.
    const last = series[series.length - 1];
    if (Date.parse(last.t) < endMs) {
      series.push({ t: new Date(endMs).toISOString(), position: last.position });
    }
    out[id] = series;
  }
  return out;
}

/** One cover's recorded series for both axes, from a single recorder query. */
export interface CoverAxisHistory {
  position: Record<string, PositionHistorySample[]>;
  tilt: Record<string, PositionHistorySample[]>;
}

/**
 * Fetch BOTH axes for the given covers in ONE recorder query.
 *
 * The position and tilt series live in the same rows — they are two attributes
 * of the same cover state — so issuing a query per axis (and a third for the
 * aggregate) asks the recorder for identical data two or three times. On a
 * 4-cover venetian entry over 72h that is three full attribute-bearing scans
 * repeated on every window change and every refresh tick.
 *
 * `tiltInverted` is separate from `inverted` on purpose: the integration
 * carries `inverse_state` and `inverse_tilt` as INDEPENDENT options
 * (issues #234 / #236), so a mixed install would be flipped wrongly on one axis
 * if the flags were shared.
 *
 * Never rejects — any failure yields empty maps.
 */
export async function fetchCoverAxisHistory(
  hass: HomeAssistant,
  entityIds: string[],
  startMs: number,
  endMs: number,
  opts: { inverted?: boolean; tiltInverted?: boolean; wantTilt?: boolean } = {},
): Promise<CoverAxisHistory> {
  const empty: CoverAxisHistory = { position: {}, tilt: {} };
  const ids = entityIds.filter((id) => typeof id === 'string' && id.length > 0);
  if (ids.length === 0) return empty;

  let response: Record<string, HistoryState[]> | undefined;
  try {
    response = await hass.callWS<Record<string, HistoryState[]>>({
      type: 'history/history_during_period',
      start_time: new Date(startMs).toISOString(),
      end_time: new Date(endMs).toISOString(),
      entity_ids: ids,
      minimal_response: false,
      no_attributes: false,
      significant_changes_only: false,
    });
  } catch {
    return empty;
  }
  if (!response || typeof response !== 'object') return empty;

  const out: CoverAxisHistory = { position: {}, tilt: {} };
  for (const id of ids) {
    const states = response[id];
    if (!Array.isArray(states)) continue;
    const pos = seriesFrom(states, POSITION_ATTR, !!opts.inverted, endMs);
    if (pos) out.position[id] = pos;
    if (opts.wantTilt) {
      const tilt = seriesFrom(states, TILT_ATTR, !!opts.tiltInverted, endMs);
      if (tilt) out.tilt[id] = tilt;
    }
  }
  return out;
}

/** Parse one axis out of an entity's rows, or null when nothing was recorded. */
function seriesFrom(
  states: HistoryState[],
  attribute: string,
  inverted: boolean,
  endMs: number,
): PositionHistorySample[] | null {
  const points = parseEntityStates(states, attribute);
  if (points.length === 0) return null;
  const series = points
    .sort((a, b) => a.t - b.t)
    .map((p) => ({
      t: new Date(p.t).toISOString(),
      position: inverted ? 100 - p.position : p.position,
    }));
  const last = series[series.length - 1];
  if (Date.parse(last.t) < endMs) {
    series.push({ t: new Date(endMs).toISOString(), position: last.position });
  }
  return series;
}

/**
 * Aggregate per-cover series into the mean series, so the aggregate can be
 * derived from an already-fetched per-cover result instead of costing a second
 * identical recorder query. Mirrors {@link mergeCoverHistories}, which works on
 * the raw pre-ISO points.
 */
export function aggregatePerCover(
  perCover: Record<string, PositionHistorySample[]>,
): PositionHistorySample[] {
  const raw: Record<string, RawPoint[]> = {};
  for (const [id, series] of Object.entries(perCover)) {
    const points = series
      .map((s) => ({ t: Date.parse(s.t), position: s.position }))
      .filter((p) => !Number.isNaN(p.t));
    if (points.length > 0) raw[id] = points;
  }
  return mergeCoverHistories(raw);
}
