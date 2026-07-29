import type { HarnessEntry } from '../types';
import { hourInZone } from '../zone';

/**
 * Synthetic stand-ins for the integration's diagnostic event buffer and for the
 * recorder history of the non-cover sensors the History card reads.
 *
 * The harness has neither a recorder nor a coordinator, so both are generated.
 * Two separate shapes are produced because the card reads them over two
 * different transports:
 *
 *  - {@link buildEventBuffer} → the `event_timeline` list inside the
 *    `adaptive_cover_pro.get_diagnostics` service *response*
 *    (see `src/lib/event-timeline.ts`), and
 *  - {@link buildSensorHistory} → compressed recorder states returned by the
 *    `history/history_during_period` websocket command
 *    (see `src/lib/state-history.ts`).
 *
 * Event names, field names and the response envelope are copied from the
 * integration (`diagnostics/event_buffer.py`, `pipeline/registry.py`,
 * `services/diagnostics_service.py`) — keep them in lock-step, since the card's
 * parser is the thing under test here.
 */

/** One recorded state in the compressed shape (`s`/`a`/`lu`) HA returns. */
export interface CompressedSensorState {
  s: string;
  a: Record<string, unknown>;
  lu: number;
}

/** Rotation the mock walks through for the who-won track, so the band strip
 *  shows more than one color without needing a scripted scenario per handler.
 *  These are pipeline HANDLER names, as published by the `decision_trace`
 *  sensor — NOT `control_status` values (see {@link buildControlStatusHistory}). */
const WINNER_ROTATION = ['solar', 'climate', 'manual', 'default', 'weather'] as const;

/**
 * Values of the integration's `control_status` sensor — its `ControlStatus`
 * enum (`const.py` §23), i.e. WHY the integration is or isn't commanding the
 * cover. A separate axis from the winning handler, and the mock must keep them
 * separate or the card's two tracks cannot be told apart under test.
 */
const CONTROL_STATUS_ROTATION = [
  'active',
  'sun_not_visible',
  'position_delta_too_small',
  'active',
  'time_delta_too_small',
] as const;

/** Synthesize the `control_status` series. Mostly `active`, punctuated by the
 *  reasons a real install actually reports. */
export function buildControlStatusHistory(startMs: number, nowMs: number): CompressedSensorState[] {
  const out: CompressedSensorState[] = [];
  const STEP_MS = 70 * 60 * 1000;
  let i = 0;
  for (let t = startMs; t < nowMs; t += STEP_MS, i++) {
    out.push({
      s: CONTROL_STATUS_ROTATION[i % CONTROL_STATUS_ROTATION.length],
      a: {},
      lu: t / 1000,
    });
  }
  return out;
}

/**
 * Synthesize the who-won series for the `decision_trace` sensor, whose state is
 * the winning handler name: the winner changes every ~90 minutes across the
 * window, ending on the entry's live winner so the last band agrees with what
 * the rest of the card is showing.
 */
export function buildWinnerHistory(
  liveWinner: string,
  startMs: number,
  nowMs: number,
): CompressedSensorState[] {
  const out: CompressedSensorState[] = [];
  const STEP_MS = 90 * 60 * 1000;
  let i = 0;
  for (let t = startMs; t < nowMs; t += STEP_MS, i++) {
    out.push({
      s: WINNER_ROTATION[i % WINNER_ROTATION.length],
      a: {},
      lu: t / 1000,
    });
  }
  // Pin the final band to the live winner so the History card and the decision
  // strip never disagree about "right now".
  out.push({ s: liveWinner, a: {}, lu: (nowMs - 60_000) / 1000 });
  return out;
}

/** Synthesize `on`/`off` spans for a binary-sensor context track. `dutyCycle`
 *  is the fraction of each period spent `on`. */
export function buildBinaryHistory(
  startMs: number,
  nowMs: number,
  periodMs: number,
  dutyCycle: number,
): CompressedSensorState[] {
  const out: CompressedSensorState[] = [];
  for (let t = startMs; t < nowMs; t += periodMs) {
    out.push({ s: 'off', a: {}, lu: t / 1000 });
    const onAt = t + periodMs * (1 - dutyCycle);
    if (onAt < nowMs) out.push({ s: 'on', a: {}, lu: onAt / 1000 });
  }
  return out;
}

/** A generated hour (0–23, in the harness clock's own configured zone — see
 *  {@link hourInZone}) falls in the raw whole-hour "nothing changes overnight"
 *  band: 22:00–09:59 (12 hours). The band actually RENDERED in a scenario is
 *  wider than that, though: {@link buildTargetHistory} only evaluates this at
 *  2-hour candidate points, so the last pre-band and first post-band
 *  candidates generally land outside 22:00/10:00 themselves. For the
 *  `history-overnight-hold` scenario's 15:00 anchor (`scenarios.ts`) that
 *  works out to a 21:00 → 11:00 (14-hour) hold — don't read this function's
 *  own 22/10 cutoff as the visible gap width. */
function isOvernightHour(hour: number): boolean {
  return hour >= 22 || hour < 10;
}

/**
 * Synthesize the ACP TARGET series for the `Cover_Position` sensor, whose state
 * is the commanded position. Walks a HANDFUL of real changes across the window
 * — and holds perfectly FLAT overnight — rather than a dense sample every 20
 * minutes: the recorder only stores transitions, so a real install's target
 * line has one long flat gap overnight and a small number of steps during the
 * day. The card's target/actual lines diverge visibly during the day (the "did
 * the cover do what ACP asked?" read the card exists for), and the overnight
 * hold is exactly the long-gap shape issue #253's straight-ramp bug needed to
 * reproduce — the original dense sinusoid sampled every 20 minutes, close
 * enough together that an interpolated diagonal and a stepped line looked
 * identical, which is how the bug went unnoticed in the harness.
 */
export function buildTargetHistory(
  entry: HarnessEntry,
  startMs: number,
  nowMs: number,
  tz: string,
): CompressedSensorState[] {
  const out: CompressedSensorState[] = [];
  const STEP_MS = 2 * 60 * 60 * 1000; // candidate change points, a couple hours apart
  let i = 0;
  let last: number | null = null;
  for (let t = startMs; t < nowMs; t += STEP_MS, i++) {
    if (isOvernightHour(hourInZone(t, tz)) && last !== null) continue;
    // A slow sinusoid around the entry target, clamped to 0..100.
    const swing = Math.round(30 * Math.sin(i / 3));
    const pos = Math.max(0, Math.min(100, entry.target_position + swing));
    if (pos === last) continue; // recorder only stores transitions
    out.push({ s: String(pos), a: {}, lu: t / 1000 });
    last = pos;
  }
  out.push({ s: String(entry.target_position), a: {}, lu: (nowMs - 30_000) / 1000 });
  return out;
}

/** Synthesize the `last_cover_action` series — one recorded action every ~2h. */
export function buildActionHistory(startMs: number, nowMs: number): CompressedSensorState[] {
  const out: CompressedSensorState[] = [];
  const STEP_MS = 2 * 60 * 60 * 1000;
  let i = 0;
  for (let t = startMs; t < nowMs; t += STEP_MS, i++) {
    const pos = (i * 17) % 101;
    out.push({ s: `Set to ${pos}%`, a: {}, lu: t / 1000 });
  }
  return out;
}

/** Synthesize the `last_skipped_action` series — sparser than actions, and
 *  mostly `none` so the card's `none` filter is exercised. */
export function buildSkippedHistory(startMs: number, nowMs: number): CompressedSensorState[] {
  const out: CompressedSensorState[] = [];
  const STEP_MS = 5 * 60 * 60 * 1000;
  let i = 0;
  for (let t = startMs; t < nowMs; t += STEP_MS, i++) {
    out.push({ s: i % 2 === 0 ? 'time_delta_too_small' : 'none', a: {}, lu: t / 1000 });
  }
  return out;
}

/** Event shapes the mock buffer cycles through. Field sets mirror the
 *  integration's real `record()` payloads. */
const EVENT_TEMPLATES: Array<(entry: HarnessEntry, i: number) => Record<string, unknown>> = [
  (entry) => ({
    event: 'pipeline_evaluated',
    entity_id: entry.covers[0]?.entity_id ?? '',
    winning_handler: 'solar',
    winning_priority: 20,
    control_method: 'solar',
    position: entry.target_position,
    reason: 'sun in acceptance angle',
    bypass_auto_control: false,
    floor_clamp_applied: false,
  }),
  (entry) => ({
    event: 'cover_command_sent',
    entity_id: entry.covers[0]?.entity_id ?? '',
    position: entry.target_position,
    service: 'cover.set_cover_position',
  }),
  (entry, i) => ({
    event: 'cover_command_skipped',
    entity_id: entry.covers[0]?.entity_id ?? '',
    reason: 'delta_below_threshold',
    delta: i % 4,
    threshold: 5,
  }),
  () => ({ event: 'sun_entered_fov', azimuth: 214.5, elevation: 31.2 }),
  () => ({ event: 'sun_left_fov', azimuth: 268.1, elevation: 12.7 }),
  (entry) => ({
    event: 'manual_override_gate_closed',
    where: 'state_change_listener',
    manual_toggle: false,
    automatic_control: true,
    entity_ids: entry.covers.map((c) => c.entity_id),
  }),
  () => ({ event: 'transit_progress_forward', from: 40, to: 55, elapsed_s: 8 }),
  () => ({ event: 'reconcile_skipped_in_transit', pending: true }),
];

/**
 * Synthesize `count` buffer events ending at `nowMs`, spaced a few minutes
 * apart and cycling through {@link EVENT_TEMPLATES}. `count === 0` yields `[]`,
 * which the mock service then reports as a present-but-empty buffer.
 */
export function buildEventBuffer(
  entry: HarnessEntry,
  nowMs: number,
  count: number,
): Array<Record<string, unknown>> {
  const out: Array<Record<string, unknown>> = [];
  const STEP_MS = 4 * 60 * 1000;
  for (let i = 0; i < count; i++) {
    const t = nowMs - (count - i) * STEP_MS;
    const template = EVENT_TEMPLATES[i % EVENT_TEMPLATES.length];
    out.push({ ts: new Date(t).toISOString(), ...template(entry, i) });
  }
  return out;
}

/** One row in the shape `logbook/get_events` returns. `when` is epoch SECONDS
 *  (a float), matching `homeassistant/components/logbook`. */
export interface LogbookRow {
  when: number;
  name: string;
  state?: string;
  entity_id?: string;
  context_user_id?: string;
  context_name?: string;
}

/** A fake HA user id, paired with a `person.*` entity in the mock states so the
 *  card's non-admin name resolution (person → user_id) has something to find. */
export const MOCK_USER_ID = 'harness-user-0001';

/**
 * Synthesize a logbook for one entry. Deliberately mixes the three attribution
 * cases the card must render differently:
 *   - unattributed (ACP's own automatic moves),
 *   - `context_user_id` (a human pressed something — resolves to a person), and
 *   - `context_name` (an automation did it).
 * Continuous sensors are omitted, mirroring HA's own logbook filtering.
 */
export function buildLogbook(entry: HarnessEntry, startMs: number, nowMs: number): LogbookRow[] {
  const rows: LogbookRow[] = [];
  const cover = entry.covers[0];
  const STEP_MS = 100 * 60 * 1000;
  let i = 0;
  for (let t = startMs; t < nowMs; t += STEP_MS, i++) {
    if (cover) {
      rows.push({
        when: t / 1000,
        name: cover.friendly_name,
        entity_id: cover.entity_id,
        state: i % 2 === 0 ? 'open' : 'closed',
        // Every third move is credited to a human, the rest to ACP itself.
        ...(i % 3 === 1 ? { context_user_id: MOCK_USER_ID } : {}),
        ...(i % 3 === 2 ? { context_name: 'Evening blinds' } : {}),
      });
    }
    rows.push({
      when: (t + 90_000) / 1000,
      name: `${entry.title} Automatic Control`,
      entity_id: `switch.${entry.entry_id}_automatic_control`,
      state: i % 4 === 0 ? 'off' : 'on',
    });
  }
  return rows.sort((a, b) => b.when - a.when);
}

/**
 * Build the whole `get_diagnostics` response envelope for one entry, matching
 * `services/diagnostics_service.py`'s return value. Only the fields the History
 * card reads are populated — the real payload is far larger, and a card that
 * needed more of it would be reading diagnostics it should get from entities.
 */
export function buildDiagnosticsResponse(
  entry: HarnessEntry,
  nowMs: number,
  eventCount: number,
  bufferSize: number,
): Record<string, unknown> {
  const events = buildEventBuffer(entry, nowMs, eventCount);
  const stamps = events.map((e) => e.ts as string);
  const diagnostics: Record<string, unknown> = {
    debug_config: { debug_event_buffer_size: bufferSize },
    data_window: {
      start: stamps[0] ?? null,
      end: stamps[stamps.length - 1] ?? null,
      captured_at: new Date(nowMs).toISOString(),
    },
    cover_commands: {},
  };
  // The builder only sets `event_timeline` when the buffer is non-empty; the
  // card must handle its absence, so the mock reproduces that exactly.
  if (events.length > 0) diagnostics.event_timeline = events;

  return {
    version: 1,
    generated_at: new Date(nowMs).toISOString(),
    count: 1,
    entries: {
      [entry.entry_id]: {
        config_entry_id: entry.entry_id,
        name: entry.title,
        cover_type: entry.cover_type,
        last_update_success: true,
        last_update_success_time: new Date(nowMs).toISOString(),
        diagnostics,
      },
    },
  };
}
