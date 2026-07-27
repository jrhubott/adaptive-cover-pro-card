import type { HomeAssistant } from 'custom-card-helpers';
import type { AcpEvent, ActivityRow, LogbookEntry } from '../types';
import { buildUserNameMap, resolveTriggeredBy } from './logbook';

/**
 * The Activity feed: HA's logbook merged with ACP's own command events.
 *
 * Neither source alone answers the user's question. The logbook records the
 * *resulting state change* ("Open"), never the service call that caused it —
 * so it can never tell you which position was commanded. ACP's event buffer
 * records the command itself (`cover_command_sent` carries `position` and
 * `service`), but knows nothing about changes ACP didn't make, and carries no
 * user attribution.
 *
 * Merging them gives one timeline where an ACP-driven move reads as
 * "cover.set_cover_position · position 45%" and a human-driven one reads as
 * "Open — Jason", which is exactly the distinction a cover-automation user is
 * trying to make.
 */

/** Buffer events that represent an outward action worth listing. Everything
 *  else in the buffer (pipeline evaluations, transit bookkeeping) is internal
 *  detail and stays in the Advanced section. */
const COMMAND_EVENTS: Record<string, { skipped: boolean }> = {
  cover_command_sent: { skipped: false },
  end_time_default_sent: { skipped: false },
  // NOT listed: `cover_command_skipped`. It fires on every evaluation whose
  // delta sits under the send threshold — routine, high-volume, and it records
  // a non-event ("nothing happened, on purpose"), so it buries the moves that
  // did happen. It remains in the Advanced event buffer, where volume is the
  // point.
  //
  // The reconcile pair below is kept: both are rare and each marks a real
  // failure to converge on the target, which is worth surfacing next to the
  // command it failed to complete.
  reconcile_gave_up: { skipped: true },
  reconcile_skipped_in_transit: { skipped: true },
};

/** Field names carrying a 0–100 position, in preference order. */
const POSITION_FIELDS = ['position', 'target_position', 'to'] as const;

/**
 * Render an ACP command event's parameters for display, e.g. `position 45%` or
 * `position 45% · delta 2 · threshold 5`. Returns null when the event carried
 * nothing worth showing.
 *
 * Position gets a `%` suffix and leads; the remaining scalar fields follow in
 * insertion order. Object/array fields and bookkeeping keys are dropped — the
 * Advanced section is where the raw payload lives.
 */
export function formatCommandDetail(fields: Record<string, unknown>): string | null {
  const parts: string[] = [];
  const used = new Set<string>(['entity_id', 'service', 'entity_ids']);

  for (const key of POSITION_FIELDS) {
    const v = fields[key];
    if (typeof v === 'number' && Number.isFinite(v)) {
      parts.push(`${key === 'position' ? 'position' : key} ${Math.round(v)}%`);
      used.add(key);
      break;
    }
  }

  for (const [k, v] of Object.entries(fields)) {
    if (used.has(k)) continue;
    if (v === null || v === undefined || v === '') continue;
    if (typeof v === 'object') continue;
    parts.push(`${k} ${String(v)}`);
  }

  return parts.length > 0 ? parts.join(' · ') : null;
}

/** Map one buffer event to an Activity row, or null when it isn't a command. */
export function commandRow(e: AcpEvent): ActivityRow | null {
  const spec = COMMAND_EVENTS[e.event];
  if (!spec) return null;
  const service = typeof e.fields.service === 'string' ? e.fields.service : null;
  const entityId = typeof e.fields.entity_id === 'string' ? e.fields.entity_id : null;
  return {
    t: e.t,
    source: 'command',
    title: service ?? e.event,
    name: null,
    entityId: entityId && entityId.length > 0 ? entityId : null,
    detail: formatCommandDetail(e.fields),
    service,
    triggeredBy: null,
    skipped: spec.skipped,
  };
}

/** Map one logbook entry to an Activity row. */
export function logbookRow(e: LogbookEntry, users: Map<string, string>): ActivityRow {
  return {
    t: e.t,
    source: 'logbook',
    title: e.state ?? e.message ?? '',
    name: e.name || null,
    entityId: e.entityId,
    detail: null,
    service: null,
    triggeredBy: resolveTriggeredBy(e, users),
    skipped: false,
  };
}

/**
 * Merge both sources into one newest-first feed.
 *
 * De-duplication: an ACP command and the cover state change it caused land
 * within a second or two of each other on the same entity, and listing both
 * would double every move. When a logbook row for the same entity falls within
 * `DEDUPE_MS` *after* a command row, the command wins — it is strictly more
 * informative (it carries the commanded position), and the state change adds
 * only "…and the cover acknowledged". Human-driven changes have no preceding
 * command and so are never suppressed, which is the whole point.
 */
const DEDUPE_MS = 5000;

export function buildActivity(
  hass: HomeAssistant,
  logbook: LogbookEntry[],
  events: AcpEvent[],
): ActivityRow[] {
  const commands = events.map(commandRow).filter((r): r is ActivityRow => r !== null);

  const suppressed = new Set<LogbookEntry>();
  for (const cmd of commands) {
    if (!cmd.entityId) continue;
    for (const lb of logbook) {
      if (suppressed.has(lb)) continue;
      if (lb.entityId !== cmd.entityId) continue;
      // Only a change AT or AFTER the command can be its acknowledgement.
      if (lb.t < cmd.t || lb.t - cmd.t > DEDUPE_MS) continue;
      // A change someone is credited with is never just an acknowledgement.
      if (lb.contextUserId || lb.contextName) continue;
      suppressed.add(lb);
      break;
    }
  }

  // One person-map for the whole feed (see `buildUserNameMap`).
  const users = buildUserNameMap(hass);
  const rows = [
    ...commands,
    ...logbook.filter((e) => !suppressed.has(e)).map((e) => logbookRow(e, users)),
  ];
  rows.sort((a, b) => b.t - a.t);
  return rows;
}
