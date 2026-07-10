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

/** Extract the numeric `current_position` attribute, or null when absent/non-numeric. */
function readPosition(st: HistoryState): number | null {
  const attrs = st.a ?? st.attributes;
  const raw = attrs?.current_position;
  return typeof raw === 'number' && !Number.isNaN(raw) ? raw : null;
}

/** Walk one entity's state list into forward-filled `{t, position}` points. */
function parseEntityStates(states: HistoryState[]): RawPoint[] {
  const points: RawPoint[] = [];
  let last: number | null = null;
  for (const st of states) {
    const t = readTimestamp(st);
    const pos = readPosition(st);
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
 */
export async function fetchPositionHistory(
  hass: HomeAssistant,
  entityIds: string[],
  startMs: number,
  endMs: number,
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
  return merged;
}
