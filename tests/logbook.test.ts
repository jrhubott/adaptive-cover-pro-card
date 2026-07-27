import { describe, it, expect, vi } from 'vitest';
import type { HomeAssistant } from 'custom-card-helpers';
import {
  buildUserNameMap,
  fetchLogbook,
  groupByDay,
  initials,
  parseLogbookResponse,
  parseLogbookRow,
  resolveTriggeredBy,
} from '../src/lib/logbook';
import type { LogbookEntry } from '../src/types';

const T0 = Date.UTC(2026, 6, 9, 8, 0, 0);
const T1 = Date.UTC(2026, 6, 9, 9, 0, 0);

function entry(over: Partial<LogbookEntry> = {}): LogbookEntry {
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

describe('parseLogbookRow', () => {
  it('rejects non-objects and arrays', () => {
    expect(parseLogbookRow(null)).toBeNull();
    expect(parseLogbookRow('x')).toBeNull();
    expect(parseLogbookRow([])).toBeNull();
  });

  it('requires a finite numeric `when`', () => {
    expect(parseLogbookRow({ state: 'on' })).toBeNull();
    expect(parseLogbookRow({ when: 'nope', state: 'on' })).toBeNull();
    expect(parseLogbookRow({ when: Number.NaN, state: 'on' })).toBeNull();
  });

  it('converts `when` from epoch SECONDS to milliseconds', () => {
    // The wire format is seconds-with-fraction; everything downstream is ms.
    expect(parseLogbookRow({ when: T0 / 1000, state: 'on' })?.t).toBe(T0);
  });

  it('normalizes absent and empty fields to null', () => {
    const out = parseLogbookRow({ when: T0 / 1000, state: 'on', context_name: '' });
    expect(out).toMatchObject({ contextName: null, message: null, icon: null, entityId: null });
  });

  it('falls back to the entity_id when HA supplied no friendly name', () => {
    expect(parseLogbookRow({ when: T0 / 1000, entity_id: 'cover.a' })?.name).toBe('cover.a');
  });

  it('keeps attribution fields', () => {
    const out = parseLogbookRow({
      when: T0 / 1000,
      state: 'open',
      context_user_id: 'u1',
      context_name: 'Evening blinds',
    });
    expect(out).toMatchObject({ contextUserId: 'u1', contextName: 'Evening blinds' });
  });
});

describe('parseLogbookResponse', () => {
  it('returns [] for a non-array', () => {
    expect(parseLogbookResponse(undefined)).toEqual([]);
    expect(parseLogbookResponse({})).toEqual([]);
  });

  it('drops unusable rows and sorts NEWEST first', () => {
    const out = parseLogbookResponse([
      { when: T0 / 1000, state: 'a' },
      { nope: 1 },
      { when: T1 / 1000, state: 'b' },
    ]);
    expect(out.map((e) => e.state)).toEqual(['b', 'a']);
  });
});

describe('buildUserNameMap', () => {
  function hassWith(states: Record<string, unknown>, user?: unknown): HomeAssistant {
    return { states, user } as unknown as HomeAssistant;
  }

  it('maps person entities by their user_id attribute', () => {
    const map = buildUserNameMap(
      hassWith({
        'person.jason': {
          entity_id: 'person.jason',
          attributes: { user_id: 'u1', friendly_name: 'Jason' },
        },
      }),
    );
    expect(map.get('u1')).toBe('Jason');
  });

  it('ignores non-person entities and persons with no user_id', () => {
    const map = buildUserNameMap(
      hassWith({
        'cover.a': { entity_id: 'cover.a', attributes: { user_id: 'u1', friendly_name: 'A' } },
        'person.ghost': { entity_id: 'person.ghost', attributes: { friendly_name: 'Ghost' } },
      }),
    );
    expect(map.size).toBe(0);
  });

  it('adds the current user as a fallback when no person entity covers them', () => {
    const map = buildUserNameMap(hassWith({}, { id: 'u2', name: 'Me' }));
    expect(map.get('u2')).toBe('Me');
  });

  it('lets a person entity win over the current-user fallback', () => {
    const map = buildUserNameMap(
      hassWith(
        {
          'person.jason': {
            entity_id: 'person.jason',
            attributes: { user_id: 'u1', friendly_name: 'Jason' },
          },
        },
        { id: 'u1', name: 'jason_admin' },
      ),
    );
    expect(map.get('u1')).toBe('Jason');
  });

  it('tolerates a hass with no states', () => {
    expect(buildUserNameMap({} as HomeAssistant).size).toBe(0);
  });
});

describe('resolveTriggeredBy', () => {
  const users = new Map([['u1', 'Jason']]);

  it('prefers the automation/script name HA already resolved', () => {
    expect(
      resolveTriggeredBy(entry({ contextName: 'Evening blinds', contextUserId: 'u1' }), users),
    ).toBe('Evening blinds');
  });

  it('resolves a user id through the map', () => {
    expect(resolveTriggeredBy(entry({ contextUserId: 'u1' }), users)).toBe('Jason');
  });

  it('is null for an unattributed change', () => {
    expect(resolveTriggeredBy(entry(), users)).toBeNull();
  });

  it('is null for a user id nothing maps — never invents a name', () => {
    expect(resolveTriggeredBy(entry({ contextUserId: 'unknown' }), users)).toBeNull();
  });
});

describe('initials', () => {
  it('takes first + last initial of a multi-part name', () => {
    expect(initials('Jason Rhubottom')).toBe('JR');
    expect(initials('Ada B. Lovelace')).toBe('AL');
  });

  it('takes the first two letters of a single-part name', () => {
    expect(initials('jason')).toBe('JA');
  });

  it('falls back to ? for an empty name', () => {
    expect(initials('')).toBe('?');
    expect(initials('   ')).toBe('?');
  });
});

describe('groupByDay', () => {
  it('returns [] for no entries', () => {
    expect(groupByDay([])).toEqual([]);
  });

  it('groups by LOCAL calendar day, newest day first', () => {
    // Built from local-midnight anchors so the test holds in any timezone.
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    const days = groupByDay([{ t: yesterday.getTime() }, { t: today.getTime() }]);
    expect(days).toHaveLength(2);
    expect(days[0].entries[0].t).toBe(today.getTime());
    expect(days[1].entries[0].t).toBe(yesterday.getTime());
  });

  it('sorts newest first WITHIN a day', () => {
    const days = groupByDay([{ t: T0 }, { t: T1 }]);
    expect(days[0].entries.map((e) => e.t)).toEqual([T1, T0]);
  });

  it('keys each group on local midnight', () => {
    const noon = new Date();
    noon.setHours(12, 0, 0, 0);
    const midnight = new Date(noon);
    midnight.setHours(0, 0, 0, 0);
    expect(groupByDay([{ t: noon.getTime() }])[0].dayMs).toBe(midnight.getTime());
  });

  it('is generic over anything carrying `t` — not just logbook rows', () => {
    const days = groupByDay([{ t: T0, custom: 'x' }]);
    expect(days[0].entries[0].custom).toBe('x');
  });
});

describe('fetchLogbook', () => {
  function hassWith(callWS: unknown): HomeAssistant {
    return { callWS } as unknown as HomeAssistant;
  }

  it('short-circuits without a call when no ids are given', async () => {
    const callWS = vi.fn();
    expect(await fetchLogbook(hassWith(callWS), [], T0, T1)).toEqual([]);
    expect(callWS).not.toHaveBeenCalled();
  });

  it('uses the logbook/get_events command over the requested window', async () => {
    const callWS = vi.fn().mockResolvedValue([]);
    await fetchLogbook(hassWith(callWS), ['cover.a'], T0, T1);
    expect(callWS).toHaveBeenCalledWith({
      type: 'logbook/get_events',
      start_time: new Date(T0).toISOString(),
      end_time: new Date(T1).toISOString(),
      entity_ids: ['cover.a'],
    });
  });

  it('never rejects — a failed call yields []', async () => {
    const callWS = vi.fn().mockRejectedValue(new Error('logbook not loaded'));
    await expect(fetchLogbook(hassWith(callWS), ['cover.a'], T0, T1)).resolves.toEqual([]);
  });
});
