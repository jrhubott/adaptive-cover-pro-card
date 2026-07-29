import { describe, it, expect } from 'vitest';
import type { HomeAssistant } from 'custom-card-helpers';
import { buildActivity, commandRow, formatCommandDetail, logbookRow } from '../src/lib/activity';
import type { AcpEvent, LogbookEntry } from '../src/types';

const T0 = Date.UTC(2026, 6, 9, 8, 0, 0);

const HASS = {
  states: {
    'person.jason': {
      entity_id: 'person.jason',
      attributes: { user_id: 'u1', friendly_name: 'Jason' },
    },
    'cover.a': { entity_id: 'cover.a', attributes: { friendly_name: 'Cover A (friendly)' } },
  },
} as unknown as HomeAssistant;

/** Window wide enough that clipping never interferes with a dedupe assertion. */
const WINDOW = { startMs: T0 - 86_400_000, endMs: T0 + 86_400_000, inverted: false };

function event(over: Partial<AcpEvent> & { event: string }): AcpEvent {
  return { ts: new Date(T0).toISOString(), t: T0, fields: {}, ...over };
}

function lb(over: Partial<LogbookEntry> = {}): LogbookEntry {
  return {
    t: T0,
    entityId: 'cover.a',
    name: 'Cover A',
    state: 'open',
    message: null,
    icon: null,
    contextUserId: null,
    contextName: null,
    contextDomain: null,
    contextService: null,
    ...over,
  };
}

describe('formatCommandDetail', () => {
  it('returns null when nothing is worth showing', () => {
    expect(formatCommandDetail({})).toBeNull();
    expect(formatCommandDetail({ entity_id: 'cover.a', service: 'x' })).toBeNull();
  });

  it('leads with the commanded position, suffixed with %', () => {
    expect(formatCommandDetail({ position: 45 })).toBe('position 45%');
  });

  it('rounds a fractional position', () => {
    expect(formatCommandDetail({ position: 44.6 })).toBe('position 45%');
  });

  it('appends the remaining scalar fields', () => {
    expect(formatCommandDetail({ position: 45, reason: 'solar', delta: 3 })).toBe(
      'position 45% · reason solar · delta 3',
    );
  });

  it('drops the bookkeeping keys the row already renders elsewhere', () => {
    expect(formatCommandDetail({ position: 10, entity_id: 'cover.a', service: 'cover.x' })).toBe(
      'position 10%',
    );
  });

  it('drops empty and object-valued fields — the raw payload lives in Advanced', () => {
    expect(formatCommandDetail({ position: 10, empty: '', nil: null, nested: { a: 1 } })).toBe(
      'position 10%',
    );
  });
});

describe('commandRow', () => {
  it('ignores buffer events that are not outward actions', () => {
    expect(commandRow(event({ event: 'pipeline_evaluated' }))).toBeNull();
    expect(commandRow(event({ event: 'transit_progress_forward' }))).toBeNull();
  });

  it('ignores cover_command_skipped — routine, high-volume, a non-event', () => {
    // Deliberately excluded: it fires on every under-threshold evaluation and
    // would bury the moves that actually happened.
    expect(commandRow(event({ event: 'cover_command_skipped' }))).toBeNull();
  });

  it('maps a sent command, titled by its service', () => {
    const row = commandRow(
      event({
        event: 'cover_command_sent',
        fields: { entity_id: 'cover.a', position: 45, service: 'cover.set_cover_position' },
      }),
    );
    expect(row).toMatchObject({
      source: 'command',
      title: 'cover.set_cover_position',
      entityId: 'cover.a',
      detail: 'position 45%',
      skipped: false,
    });
  });

  it('falls back to the event name when no service was recorded', () => {
    expect(commandRow(event({ event: 'end_time_default_sent' }))?.title).toBe(
      'end_time_default_sent',
    );
  });

  it('marks the reconcile failures as skipped', () => {
    expect(commandRow(event({ event: 'reconcile_gave_up' }))?.skipped).toBe(true);
    expect(commandRow(event({ event: 'reconcile_skipped_in_transit' }))?.skipped).toBe(true);
  });
});

describe('logbookRow', () => {
  const users = new Map([['u1', 'Jason']]);

  it('titles the row with the new state', () => {
    expect(logbookRow(lb({ state: 'open' }), users, HASS).title).toBe('open');
  });

  it('falls back to the message on a described event', () => {
    expect(logbookRow(lb({ state: null, message: 'was turned on' }), users, HASS).title).toBe(
      'was turned on',
    );
  });

  it('carries the resolved attribution', () => {
    expect(logbookRow(lb({ contextUserId: 'u1' }), users, HASS).triggeredBy).toBe('Jason');
  });
});

describe('buildActivity', () => {
  it('returns [] for two empty sources', () => {
    expect(buildActivity(HASS, [], [], WINDOW)).toEqual([]);
  });

  it('merges both sources newest-first', () => {
    const rows = buildActivity(
      HASS,
      [lb({ t: T0, entityId: 'cover.b' })],
      [event({ event: 'cover_command_sent', t: T0 + 60_000, fields: { entity_id: 'cover.a' } })],
      WINDOW,
    );
    expect(rows.map((r) => r.source)).toEqual(['command', 'logbook']);
  });

  it('suppresses the state change a command caused', () => {
    // The command carries the commanded position; the acknowledgement adds only
    // "…and the cover agreed". Listing both would double every move.
    const rows = buildActivity(
      HASS,
      [lb({ t: T0 + 1000, entityId: 'cover.a' })],
      [
        event({
          event: 'cover_command_sent',
          t: T0,
          fields: { entity_id: 'cover.a', position: 45, service: 'cover.set_cover_position' },
        }),
      ],
      WINDOW,
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].source).toBe('command');
  });

  it('does NOT suppress a state change on a different entity', () => {
    const rows = buildActivity(
      HASS,
      [lb({ t: T0 + 1000, entityId: 'cover.b' })],
      [event({ event: 'cover_command_sent', t: T0, fields: { entity_id: 'cover.a' } })],
      WINDOW,
    );
    expect(rows).toHaveLength(2);
  });

  it('does NOT suppress a change that happened BEFORE the command', () => {
    const rows = buildActivity(
      HASS,
      [lb({ t: T0 - 1000, entityId: 'cover.a' })],
      [event({ event: 'cover_command_sent', t: T0, fields: { entity_id: 'cover.a' } })],
      WINDOW,
    );
    expect(rows).toHaveLength(2);
  });

  it('does NOT suppress a change well after the command', () => {
    const rows = buildActivity(
      HASS,
      [lb({ t: T0 + 60_000, entityId: 'cover.a' })],
      [event({ event: 'cover_command_sent', t: T0, fields: { entity_id: 'cover.a' } })],
      WINDOW,
    );
    expect(rows).toHaveLength(2);
  });

  it('NEVER suppresses an attributed change — that is the whole point', () => {
    // A human moving the cover right after ACP did must stay visible; that
    // distinction is the reason the feed exists.
    const rows = buildActivity(
      HASS,
      [lb({ t: T0 + 1000, entityId: 'cover.a', contextUserId: 'u1' })],
      [event({ event: 'cover_command_sent', t: T0, fields: { entity_id: 'cover.a' } })],
      WINDOW,
    );
    expect(rows).toHaveLength(2);
    expect(rows.find((r) => r.source === 'logbook')?.triggeredBy).toBe('Jason');
  });

  it('suppresses at most one acknowledgement per command', () => {
    const rows = buildActivity(
      HASS,
      [lb({ t: T0 + 500, entityId: 'cover.a' }), lb({ t: T0 + 1500, entityId: 'cover.a' })],
      [event({ event: 'cover_command_sent', t: T0, fields: { entity_id: 'cover.a' } })],
      WINDOW,
    );
    expect(rows.filter((r) => r.source === 'logbook')).toHaveLength(1);
  });

  it('does not suppress anything for a command with no entity', () => {
    const rows = buildActivity(
      HASS,
      [lb({ t: T0 + 1000 })],
      [event({ event: 'end_time_default_sent', t: T0 })],
      WINDOW,
    );
    expect(rows).toHaveLength(2);
  });
});

describe('buildActivity — audit regressions', () => {
  it('clips command rows to the window', () => {
    // The event buffer is a ring buffer with no time bound and happily holds
    // events from days before the selected window; without clipping the window
    // picker would govern only the logbook half of the feed.
    const rows = buildActivity(
      HASS,
      [],
      [
        event({ event: 'cover_command_sent', t: T0, fields: { entity_id: 'cover.a' } }),
        event({
          event: 'cover_command_sent',
          t: T0 - 5 * 86_400_000,
          fields: { entity_id: 'cover.a' },
        }),
      ],
      { startMs: T0 - 3600_000, endMs: T0 + 3600_000, inverted: false },
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].t).toBe(T0);
  });

  it('reports the commanded position in the LOGICAL frame on an inverse_state entry', () => {
    // The buffer records the DISPATCHED value; every other percentage the card
    // shows is logical, so an unflipped row would contradict the position track
    // directly above it.
    const rows = buildActivity(
      HASS,
      [],
      [
        event({
          event: 'cover_command_sent',
          t: T0,
          fields: { entity_id: 'cover.a', position: 20 },
        }),
      ],
      { ...WINDOW, inverted: true },
    );
    expect(rows[0].detail).toBe('position 80%');
  });

  it('suppresses the SETTLED state, not the transient one', () => {
    // Logbook arrives newest-first; scanning it in place would suppress `open`
    // and leave `opening`, still double-listing the move.
    const rows = buildActivity(
      HASS,
      [
        lb({ t: T0 + 4000, entityId: 'cover.a', state: 'open' }),
        lb({ t: T0 + 1000, entityId: 'cover.a', state: 'opening' }),
      ],
      [event({ event: 'cover_command_sent', t: T0, fields: { entity_id: 'cover.a' } })],
      WINDOW,
    );
    const survivor = rows.find((r) => r.source === 'logbook');
    expect(survivor?.title).toBe('open');
  });

  it('resolves the friendly name from hass.states', () => {
    // `logbook/get_events` is built with include_entity_name=False, so the wire
    // only ever carries the raw entity_id.
    const rows = buildActivity(HASS, [lb({ name: 'cover.a' })], [], WINDOW);
    expect(rows[0].name).toBe('Cover A (friendly)');
  });
});
