import { describe, it, expect, vi } from 'vitest';
import type { HomeAssistant } from 'custom-card-helpers';
import { fetchPositionHistory, mergeCoverHistories } from '../src/lib/position-history';

// Timestamps as round epoch-ms for readable assertions.
const T0 = Date.UTC(2026, 6, 9, 8, 0, 0); // 08:00
const T1 = Date.UTC(2026, 6, 9, 9, 0, 0); // 09:00
const T2 = Date.UTC(2026, 6, 9, 10, 0, 0); // 10:00

describe('mergeCoverHistories', () => {
  it('returns [] for no covers', () => {
    expect(mergeCoverHistories({})).toEqual([]);
  });

  it('drops covers with no points and returns [] when all empty', () => {
    expect(mergeCoverHistories({ 'cover.a': [] })).toEqual([]);
  });

  it('passes a single cover through, sorted and ISO-stamped', () => {
    const out = mergeCoverHistories({
      'cover.a': [
        { t: T2, position: 30 },
        { t: T0, position: 50 },
      ],
    });
    expect(out).toEqual([
      { t: new Date(T0).toISOString(), position: 50 },
      { t: new Date(T2).toISOString(), position: 30 },
    ]);
  });

  it('averages two covers with forward-fill across the timestamp union', () => {
    // cover.a reports at T0 and T2; cover.b reports only at T1.
    const out = mergeCoverHistories({
      'cover.a': [
        { t: T0, position: 100 },
        { t: T2, position: 0 },
      ],
      'cover.b': [{ t: T1, position: 50 }],
    });
    // T0: only a known -> 100. T1: a=100 (filled), b=50 -> 75. T2: a=0, b=50 -> 25.
    expect(out).toEqual([
      { t: new Date(T0).toISOString(), position: 100 },
      { t: new Date(T1).toISOString(), position: 75 },
      { t: new Date(T2).toISOString(), position: 25 },
    ]);
  });

  it('skips leading timestamps where no cover has reported yet', () => {
    // cover.b's first (and only) report is at T1, so the T0 row (from cover.a)
    // still has a value from cover.a alone — never a fully-empty row.
    const out = mergeCoverHistories({
      'cover.a': [{ t: T1, position: 40 }],
      'cover.b': [{ t: T2, position: 60 }],
    });
    expect(out).toEqual([
      { t: new Date(T1).toISOString(), position: 40 },
      { t: new Date(T2).toISOString(), position: 50 },
    ]);
  });
});

function mockHass(callWS: (msg: unknown) => Promise<unknown>): HomeAssistant {
  return { callWS } as unknown as HomeAssistant;
}

describe('fetchPositionHistory', () => {
  it('returns [] for no entities without calling the recorder', async () => {
    const callWS = vi.fn();
    const out = await fetchPositionHistory(mockHass(callWS), [], T0, T2);
    expect(out).toEqual([]);
    expect(callWS).not.toHaveBeenCalled();
  });

  it('returns [] when the recorder call rejects', async () => {
    const out = await fetchPositionHistory(
      mockHass(() => Promise.reject(new Error('recorder disabled'))),
      ['cover.a'],
      T0,
      T2,
    );
    expect(out).toEqual([]);
  });

  it('parses the compressed shape and forward-fills current_position', async () => {
    const response = {
      'cover.a': [
        { s: 'open', a: { current_position: 50 }, lu: T0 / 1000 },
        // current_position unchanged -> absent from `a`; must forward-fill 50.
        { s: 'open', a: {}, lu: T1 / 1000 },
        { s: 'open', a: { current_position: 20 }, lu: T2 / 1000 },
      ],
    };
    const out = await fetchPositionHistory(
      mockHass(() => Promise.resolve(response)),
      ['cover.a'],
      T0,
      T2,
    );
    expect(out).toEqual([
      { t: new Date(T0).toISOString(), position: 50 },
      { t: new Date(T1).toISOString(), position: 50 },
      { t: new Date(T2).toISOString(), position: 20 },
    ]);
  });

  it('sends an ISO window and the managed entity ids', async () => {
    const callWS = vi.fn().mockResolvedValue({});
    await fetchPositionHistory(mockHass(callWS), ['cover.a', 'cover.b'], T0, T2);
    expect(callWS).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'history/history_during_period',
        start_time: new Date(T0).toISOString(),
        end_time: new Date(T2).toISOString(),
        entity_ids: ['cover.a', 'cover.b'],
      }),
    );
  });

  it('forward-fills the last position out to endMs so the line reaches now', async () => {
    // The cover last moved at T0; there are no later recorder points, but it is
    // still there — the series must extend a trailing point at endMs.
    const endMs = T2 + 3 * 60 * 60 * 1000; // well past the last change
    const response = {
      'cover.a': [{ s: 'open', a: { current_position: 60 }, lu: T0 / 1000 }],
    };
    const out = await fetchPositionHistory(
      mockHass(() => Promise.resolve(response)),
      ['cover.a'],
      T0,
      endMs,
    );
    expect(out).toEqual([
      { t: new Date(T0).toISOString(), position: 60 },
      { t: new Date(endMs).toISOString(), position: 60 },
    ]);
  });

  it('does not append a trailing point when the last change is already at endMs', async () => {
    const response = {
      'cover.a': [
        { s: 'open', a: { current_position: 60 }, lu: T0 / 1000 },
        { s: 'open', a: { current_position: 20 }, lu: T2 / 1000 },
      ],
    };
    const out = await fetchPositionHistory(
      mockHass(() => Promise.resolve(response)),
      ['cover.a'],
      T0,
      T2,
    );
    expect(out).toEqual([
      { t: new Date(T0).toISOString(), position: 60 },
      { t: new Date(T2).toISOString(), position: 20 },
    ]);
  });

  it('ignores entities with no returned states or non-numeric positions', async () => {
    const response = {
      'cover.a': [{ s: 'open', a: { current_position: 'foo' }, lu: T0 / 1000 }],
      'cover.b': [{ s: 'open', a: { current_position: 80 }, lu: T1 / 1000 }],
    };
    const out = await fetchPositionHistory(
      mockHass(() => Promise.resolve(response)),
      ['cover.a', 'cover.b', 'cover.missing'],
      T0,
      T2,
    );
    // cover.a's only point is non-numeric (dropped); cover.b is the sole series,
    // forward-filled from its last change (T1) out to endMs (T2).
    expect(out).toEqual([
      { t: new Date(T1).toISOString(), position: 80 },
      { t: new Date(T2).toISOString(), position: 80 },
    ]);
  });
});

describe('fetchPositionHistory — inverse_state frame normalization (#234)', () => {
  const response = {
    'cover.a': [
      { s: 'open', a: { current_position: 0 }, lu: T0 / 1000 },
      { s: 'open', a: { current_position: 30 }, lu: T1 / 1000 },
    ],
  };

  it('flips recorded positions into the logical frame when inverted', async () => {
    // The history track is drawn against the logical forecast/target curve, so
    // cover-frame samples plot it upside down relative to what it compares to.
    const out = await fetchPositionHistory(
      mockHass(() => Promise.resolve(response)),
      ['cover.a'],
      T0,
      T2,
      true,
    );
    expect(out).toEqual([
      { t: new Date(T0).toISOString(), position: 100 },
      { t: new Date(T1).toISOString(), position: 70 },
      // The forward-filled tail point is flipped too.
      { t: new Date(T2).toISOString(), position: 70 },
    ]);
  });

  it('is byte-identical to today when inverted is false or omitted', async () => {
    const expected = [
      { t: new Date(T0).toISOString(), position: 0 },
      { t: new Date(T1).toISOString(), position: 30 },
      { t: new Date(T2).toISOString(), position: 30 },
    ];
    const omitted = await fetchPositionHistory(
      mockHass(() => Promise.resolve(response)),
      ['cover.a'],
      T0,
      T2,
    );
    const explicit = await fetchPositionHistory(
      mockHass(() => Promise.resolve(response)),
      ['cover.a'],
      T0,
      T2,
      false,
    );
    expect(omitted).toEqual(expected);
    expect(explicit).toEqual(expected);
  });
});
