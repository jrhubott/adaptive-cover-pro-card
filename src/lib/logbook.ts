import type { HomeAssistant } from 'custom-card-helpers';
import type { LogbookEntry } from '../types';

/**
 * Home Assistant's logbook — the data behind the "Activity" list in HA's own
 * more-info dialog.
 *
 * Complements `state-history.ts` rather than duplicating it. HA itself splits
 * these two: the logbook deliberately DROPS "continuous" sensors (anything with
 * a `unit_of_measurement` or `state_class` — see the integration's
 * `logbook/helpers.py::is_sensor_continuous`), because a numeric series is a
 * chart, not a list. So:
 *
 *   - numeric series (cover position, ACP target) → recorder, drawn as lines
 *   - categorical changes (switches, binary sensors, text status sensors, the
 *     cover entity itself) → logbook, listed with attribution
 *
 * The logbook's unique value over raw recorder history is **attribution**: each
 * row carries `context_user_id` (a human did it) or `context_name` (an
 * automation/script did it), which is what answers "did ACP move this, or did
 * I?" — the question a cover-automation user actually has.
 *
 * Everything degrades to an empty list: logbook not loaded, recorder disabled,
 * no retained history, or a rejected call.
 */

/** One row as returned by the `logbook/get_events` websocket command. Field
 *  names mirror `homeassistant/components/logbook/const.py`; every field beyond
 *  `when` is optional because the row shape varies by entry type (state change
 *  vs. a component-described event). */
interface RawLogbookRow {
  when?: unknown;
  name?: unknown;
  state?: unknown;
  message?: unknown;
  entity_id?: unknown;
  icon?: unknown;
  context_user_id?: unknown;
  context_name?: unknown;
  context_domain?: unknown;
  context_service?: unknown;
  context_entity_id?: unknown;
  context_entity_id_name?: unknown;
}

function str(v: unknown): string | null {
  return typeof v === 'string' && v.length > 0 ? v : null;
}

/** Parse one raw row, or null when it carries no usable timestamp.
 *  `when` is epoch **seconds** (a float) on the wire; we normalize to ms.
 *
 *  `name` is left as the raw entity_id here on purpose: `logbook/get_events`
 *  builds its processor with `include_entity_name=False`
 *  (`logbook/websocket_api.py`), so the wire NEVER carries a friendly name.
 *  Resolving it needs `hass.states`, which this pure parser does not take — see
 *  `activity.ts`, which does the lookup HA's own frontend does. */
export function parseLogbookRow(raw: unknown): LogbookEntry | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const row = raw as RawLogbookRow;
  const when = row.when;
  if (typeof when !== 'number' || !Number.isFinite(when)) return null;
  return {
    t: when * 1000,
    entityId: str(row.entity_id),
    name: str(row.name) ?? str(row.entity_id) ?? '',
    state: str(row.state),
    message: str(row.message),
    icon: str(row.icon),
    contextUserId: str(row.context_user_id),
    contextName: str(row.context_name),
    contextDomain: str(row.context_domain),
    contextService: str(row.context_service),
  };
}

/** Parse a whole `logbook/get_events` response, newest first. */
export function parseLogbookResponse(response: unknown): LogbookEntry[] {
  if (!Array.isArray(response)) return [];
  const out: LogbookEntry[] = [];
  for (const raw of response) {
    const parsed = parseLogbookRow(raw);
    if (parsed) out.push(parsed);
  }
  out.sort((a, b) => b.t - a.t);
  return out;
}

/**
 * Fetch logbook entries for the given entities over `[startMs, endMs]`.
 * Never rejects — any failure yields `[]`.
 */
export async function fetchLogbook(
  hass: HomeAssistant,
  entityIds: string[],
  startMs: number,
  endMs: number,
): Promise<LogbookEntry[]> {
  const ids = entityIds.filter((id) => typeof id === 'string' && id.length > 0);
  if (ids.length === 0) return [];
  try {
    const response = await hass.callWS<unknown>({
      type: 'logbook/get_events',
      start_time: new Date(startMs).toISOString(),
      end_time: new Date(endMs).toISOString(),
      entity_ids: ids,
    });
    return parseLogbookResponse(response);
  } catch {
    return [];
  }
}

/**
 * Build `user_id → display name` from the `person.*` entities.
 *
 * Person entities are the resolution path that matters: HA's own frontend reads
 * names from the admin-only user list, so a non-admin viewer sees a nameless
 * avatar. Every user can read `person.*` and its `user_id` attribute, so this
 * gives the same answer without admin and without a round-trip — they're
 * already in `hass.states`.
 *
 * Built ONCE per feed rather than scanned per row: a busy 72h window is
 * hundreds of rows and a mid-size install is thousands of states, so a per-row
 * scan is a needless million-iteration walk on the main thread.
 */
export function buildUserNameMap(hass: HomeAssistant): Map<string, string> {
  const map = new Map<string, string>();
  for (const state of Object.values(hass.states ?? {})) {
    if (!state.entity_id.startsWith('person.')) continue;
    const userId = (state.attributes as { user_id?: unknown }).user_id;
    const name = state.attributes.friendly_name;
    if (typeof userId === 'string' && typeof name === 'string' && name.length > 0) {
      map.set(userId, name);
    }
  }
  const me = hass.user;
  if (me?.id && me.name && !map.has(me.id)) map.set(me.id, me.name);
  return map;
}

/**
 * Human-readable "who caused this", or null when the logbook attributed it to
 * nobody (an ordinary automation-free state change).
 *
 * Resolution order: `context_name` (HA already resolved the automation/script
 * name), then `context_user_id` against the {@link buildUserNameMap} lookup.
 */
export function resolveTriggeredBy(entry: LogbookEntry, users: Map<string, string>): string | null {
  if (entry.contextName) return entry.contextName;
  const userId = entry.contextUserId;
  if (!userId) return null;
  return users.get(userId) ?? null;
}

/** Two-letter initials for the attribution chip, mirroring HA's avatar. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export interface Day<T> {
  /** Local midnight of the day, epoch ms — also the group's stable key. */
  dayMs: number;
  entries: T[];
}

/**
 * Group timestamped items into local calendar days, newest day first and newest
 * item first within each day (matching HA's Activity list). Pure and
 * unit-tested.
 *
 * Generic over anything carrying `t` so the merged Activity feed
 * (`ActivityRow`, which is not a `LogbookEntry`) can use it directly rather
 * than round-tripping through a synthetic logbook row.
 */
export function groupByDay<T extends { t: number }>(entries: T[]): Array<Day<T>> {
  const byDay = new Map<number, T[]>();
  for (const e of entries) {
    const d = new Date(e.t);
    d.setHours(0, 0, 0, 0);
    const key = d.getTime();
    const bucket = byDay.get(key);
    if (bucket) bucket.push(e);
    else byDay.set(key, [e]);
  }
  return [...byDay.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([dayMs, list]) => ({ dayMs, entries: [...list].sort((a, b) => b.t - a.t) }));
}
