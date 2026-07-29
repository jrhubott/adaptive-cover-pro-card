import { describe, it, expect, vi } from 'vitest';
import type { HomeAssistant } from 'custom-card-helpers';
import {
  clampToWindow,
  fetchStateHistory,
  isoToPoints,
  parseStateSeries,
  stepExpand,
  toBands,
  toNumericSeries,
  valueAt,
} from '../src/lib/state-history';

// Round epoch-ms so assertions read as clock times.
const T0 = Date.UTC(2026, 6, 9, 8, 0, 0);
const T1 = Date.UTC(2026, 6, 9, 9, 0, 0);
const T2 = Date.UTC(2026, 6, 9, 10, 0, 0);
const T3 = Date.UTC(2026, 6, 9, 11, 0, 0);

describe('parseStateSeries', () => {
  it('returns [] for a non-array', () => {
    expect(parseStateSeries(undefined)).toEqual([]);
    expect(parseStateSeries(null)).toEqual([]);
    expect(parseStateSeries({})).toEqual([]);
  });

  it('parses the compressed shape (s / a / lu)', () => {
    expect(parseStateSeries([{ s: 'on', a: { x: 1 }, lu: T0 / 1000 }])).toEqual([
      { t: T0, state: 'on', attributes: { x: 1 } },
    ]);
  });

  it('parses the uncompressed shape (state / attributes / last_updated)', () => {
    const out = parseStateSeries([
      { state: 'off', attributes: {}, last_updated: new Date(T1).toISOString() },
    ]);
    expect(out).toEqual([{ t: T1, state: 'off', attributes: {} }]);
  });

  it('falls back to lc / last_changed when lu / last_updated is absent', () => {
    expect(parseStateSeries([{ s: 'on', lc: T0 / 1000 }])[0].t).toBe(T0);
    expect(parseStateSeries([{ s: 'on', last_changed: new Date(T1).toISOString() }])[0].t).toBe(T1);
  });

  it('drops rows with no timestamp or no state', () => {
    const out = parseStateSeries([
      { s: 'on' }, // no timestamp
      { lu: T0 / 1000 }, // no state
      null,
      'nope',
      { s: 'ok', lu: T1 / 1000 },
    ]);
    expect(out).toEqual([{ t: T1, state: 'ok', attributes: {} }]);
  });

  it('sorts by timestamp', () => {
    const out = parseStateSeries([
      { s: 'c', lu: T2 / 1000 },
      { s: 'a', lu: T0 / 1000 },
      { s: 'b', lu: T1 / 1000 },
    ]);
    expect(out.map((s) => s.state)).toEqual(['a', 'b', 'c']);
  });

  it('defaults attributes to {} when absent', () => {
    expect(parseStateSeries([{ s: 'on', lu: T0 / 1000 }])[0].attributes).toEqual({});
  });
});

describe('toBands', () => {
  const S = (t: number, state: string) => ({ t, state, attributes: {} });

  it('returns [] for an empty series or an inverted window', () => {
    expect(toBands([], T0, T2)).toEqual([]);
    expect(toBands([S(T0, 'on')], T2, T0)).toEqual([]);
  });

  it('runs the last band out to the window end', () => {
    expect(toBands([S(T1, 'on')], T0, T2)).toEqual([
      { start: T1, end: T2, state: 'on', attributes: {} },
    ]);
  });

  it('closes each band where the next one starts', () => {
    const out = toBands([S(T0, 'a'), S(T1, 'b'), S(T2, 'c')], T0, T3);
    expect(out).toEqual([
      { start: T0, end: T1, state: 'a', attributes: {} },
      { start: T1, end: T2, state: 'b', attributes: {} },
      { start: T2, end: T3, state: 'c', attributes: {} },
    ]);
  });

  it('merges consecutive repeats of the same state', () => {
    // The recorder emits a row for an attribute-only update; that must not
    // split the band.
    const out = toBands([S(T0, 'on'), S(T1, 'on'), S(T2, 'off')], T0, T3);
    expect(out).toEqual([
      { start: T0, end: T2, state: 'on', attributes: {} },
      { start: T2, end: T3, state: 'off', attributes: {} },
    ]);
  });

  it('clamps a pre-window sample forward to the window start', () => {
    // The state in effect as the window opens must cover the left edge.
    const out = toBands([S(T0 - 3_600_000, 'on'), S(T1, 'off')], T0, T2);
    expect(out).toEqual([
      { start: T0, end: T1, state: 'on', attributes: {} },
      { start: T1, end: T2, state: 'off', attributes: {} },
    ]);
  });

  it('keeps only the MOST RECENT of several pre-window samples', () => {
    const out = toBands([S(T0 - 7_200_000, 'a'), S(T0 - 3_600_000, 'b')], T0, T1);
    expect(out).toEqual([{ start: T0, end: T1, state: 'b', attributes: {} }]);
  });

  it('ignores samples at or after the window end', () => {
    const out = toBands([S(T0, 'on'), S(T2, 'off')], T0, T2);
    expect(out).toEqual([{ start: T0, end: T2, state: 'on', attributes: {} }]);
  });

  it('carries the attributes of the sample that opened the band', () => {
    const out = toBands([{ t: T0, state: 'on', attributes: { why: 'sun' } }], T0, T1);
    expect(out[0].attributes).toEqual({ why: 'sun' });
  });
});

describe('toNumericSeries', () => {
  const S = (t: number, state: string, attributes: Record<string, unknown> = {}) => ({
    t,
    state,
    attributes,
  });

  it('parses the state as the number', () => {
    expect(toNumericSeries([S(T0, '45')])).toEqual([{ t: T0, value: 45 }]);
  });

  it('drops non-numeric states rather than plotting them as zero', () => {
    expect(toNumericSeries([S(T0, 'unknown'), S(T1, 'unavailable'), S(T2, '10')])).toEqual([
      { t: T2, value: 10 },
    ]);
  });

  it('inverts the state into the logical frame when asked', () => {
    expect(toNumericSeries([S(T0, '30')], { inverted: true })).toEqual([{ t: T0, value: 70 }]);
  });

  it('prefers the named attribute over the state', () => {
    const out = toNumericSeries([S(T0, '70', { linear_position: 30 })], {
      preferAttribute: 'linear_position',
    });
    expect(out).toEqual([{ t: T0, value: 30 }]);
  });

  it('does NOT re-invert the preferred attribute — it is already logical', () => {
    // `linear_position` is pre-inversion (issues #219/#234); flipping it here
    // would double-invert and put the target line upside-down.
    const out = toNumericSeries([S(T0, '70', { linear_position: 30 })], {
      preferAttribute: 'linear_position',
      inverted: true,
    });
    expect(out).toEqual([{ t: T0, value: 30 }]);
  });

  it('falls back to the inverted state when the attribute is absent', () => {
    const out = toNumericSeries([S(T0, '70')], {
      preferAttribute: 'linear_position',
      inverted: true,
    });
    expect(out).toEqual([{ t: T0, value: 30 }]);
  });

  it('ignores a non-finite attribute value', () => {
    const out = toNumericSeries([S(T0, '55', { linear_position: Number.NaN })], {
      preferAttribute: 'linear_position',
    });
    expect(out).toEqual([{ t: T0, value: 55 }]);
  });
});

describe('isoToPoints', () => {
  it('returns [] for an empty series', () => {
    expect(isoToPoints([])).toEqual([]);
  });

  it('parses the ISO `t` and takes `position` as the value', () => {
    expect(isoToPoints([{ t: new Date(T0).toISOString(), position: 60 }])).toEqual([
      { t: T0, value: 60 },
    ]);
  });

  it('drops an unparseable timestamp rather than emitting NaN', () => {
    // A NaN `t` would poison every downstream `toFixed()` and land the vertex
    // at x=NaN in the polyline.
    expect(isoToPoints([{ t: 'not-a-date', position: 60 }])).toEqual([]);
  });

  it('keeps only the parseable entries of a mixed series', () => {
    const out = isoToPoints([
      { t: new Date(T0).toISOString(), position: 10 },
      { t: 'not-a-date', position: 20 },
      { t: new Date(T2).toISOString(), position: 30 },
    ]);
    expect(out).toEqual([
      { t: T0, value: 10 },
      { t: T2, value: 30 },
    ]);
  });
});

describe('clampToWindow', () => {
  const P = (t: number, value: number) => ({ t, value });

  it('returns [] for an empty series or an inverted window', () => {
    expect(clampToWindow([], T0, T2)).toEqual([]);
    expect(clampToWindow([P(T1, 1)], T2, T0)).toEqual([]);
    expect(clampToWindow([P(T1, 1)], T0, T0)).toEqual([]);
  });

  it('sorts unsorted input into `t` order', () => {
    const out = clampToWindow([P(T2, 3), P(T0, 1), P(T1, 2)], T0 - 1, T3);
    expect(out.map((p) => p.value)).toEqual([1, 2, 3]);
    expect(out.map((p) => p.t)).toEqual([T0, T1, T2]);
  });

  it('pins a pre-window sample to the window start, keeping its value', () => {
    // The recorder answers a window query with the state in effect as the
    // window OPENED, carrying its own un-clamped timestamp. Dropping it would
    // erase the whole left half of the curve.
    expect(clampToWindow([P(T0, 40), P(T2, 50)], T1, T3)).toEqual([P(T1, 40), P(T2, 50)]);
  });

  it('keeps only the MOST RECENT of several pre-window samples', () => {
    expect(clampToWindow([P(T0, 10), P(T1, 20)], T2, T3)).toEqual([P(T2, 20)]);
  });

  it('is idempotent for a sample exactly at the window start', () => {
    expect(clampToWindow([P(T0, 40), P(T2, 50)], T0, T3)).toEqual([P(T0, 40), P(T2, 50)]);
  });

  it('KEEPS a sample exactly at the window end', () => {
    // Deliberately `>` where `toBands` uses `>=`: a zero-width band is
    // meaningless, but a polyline vertex sitting on the right edge is not.
    expect(clampToWindow([P(T0, 40), P(T2, 50)], T0, T2)).toEqual([P(T0, 40), P(T2, 50)]);
  });

  it('drops every sample past the window end', () => {
    // The loop breaks on the first one — on sorted input nothing after it can
    // be in-window either. A vertex past the end would be clamped onto the
    // axis's right edge and draw a spurious spike.
    expect(clampToWindow([P(T1, 2), P(T3 + 3_600_000, 9), P(T3 + 7_200_000, 8)], T0, T3)).toEqual([
      P(T1, 2),
    ]);
  });

  it('passes an already-in-window series through unchanged', () => {
    expect(clampToWindow([P(T1, 1), P(T2, 2)], T0, T3)).toEqual([P(T1, 1), P(T2, 2)]);
  });
});

describe('stepExpand', () => {
  it('returns [] for an empty series', () => {
    expect(stepExpand([], T2)).toEqual([]);
  });

  it('holds a single point flat out to endMs', () => {
    // Nothing else was ever recorded — the value in effect at T0 is still in
    // effect at the window end, so the render must draw a flat line there
    // rather than stopping the polyline short.
    expect(stepExpand([{ t: T0, value: 60 }], T2)).toEqual([
      { t: T0, value: 60 },
      { t: T2, value: 60 },
    ]);
  });

  it('inserts a carry-then-step pair at a transition — the overnight-hold-then-drop shape', () => {
    // The recorder only stores the two real samples (held at 100 overnight,
    // dropped to 0 at T2). SVG linearly interpolates between consecutive
    // polyline vertices, so without a carry point at (T2, 100) it draws a
    // ramp from 100 to 0 across the whole gap instead of holding flat then
    // stepping — exactly the bug in issue #253.
    expect(
      stepExpand(
        [
          { t: T0, value: 100 },
          { t: T2, value: 0 },
        ],
        T2,
      ),
    ).toEqual([
      { t: T0, value: 100 },
      { t: T2, value: 100 },
      { t: T2, value: 0 },
    ]);
  });

  it('adds no extra duplicate when the series already ends at endMs with a repeated value', () => {
    // Mirrors position-history.ts's own tail forward-fill: the last two points
    // already share a value and the last already sits at endMs, so the general
    // "value changed → insert a carry point" rule must emit nothing extra.
    expect(
      stepExpand(
        [
          { t: T0, value: 50 },
          { t: T2, value: 50 },
        ],
        T2,
      ),
    ).toEqual([
      { t: T0, value: 50 },
      { t: T2, value: 50 },
    ]);
  });

  it('gives each of several transitions its own carry point, in order', () => {
    const out = stepExpand(
      [
        { t: T0, value: 0 },
        { t: T1, value: 50 },
        { t: T2, value: 100 },
      ],
      T3,
    );
    expect(out).toEqual([
      { t: T0, value: 0 },
      { t: T1, value: 0 },
      { t: T1, value: 50 },
      { t: T2, value: 50 },
      { t: T2, value: 100 },
      { t: T3, value: 100 },
    ]);
  });
});

describe('fetchStateHistory', () => {
  function hassWith(callWS: unknown): HomeAssistant {
    return { callWS } as unknown as HomeAssistant;
  }

  it('short-circuits without a websocket call when no ids are given', async () => {
    const callWS = vi.fn();
    expect(await fetchStateHistory(hassWith(callWS), [], T0, T2)).toEqual({});
    expect(await fetchStateHistory(hassWith(callWS), ['', ''], T0, T2)).toEqual({});
    expect(callWS).not.toHaveBeenCalled();
  });

  it('returns {} when the call rejects — never propagates', async () => {
    const callWS = vi.fn().mockRejectedValue(new Error('recorder down'));
    await expect(fetchStateHistory(hassWith(callWS), ['sensor.a'], T0, T2)).resolves.toEqual({});
  });

  it('returns {} for a malformed response', async () => {
    const callWS = vi.fn().mockResolvedValue('nope');
    await expect(fetchStateHistory(hassWith(callWS), ['sensor.a'], T0, T2)).resolves.toEqual({});
  });

  it('parses one series per entity and omits entities with no history', async () => {
    const callWS = vi.fn().mockResolvedValue({
      'sensor.a': [{ s: 'on', lu: T0 / 1000 }],
      'sensor.b': [],
    });
    const out = await fetchStateHistory(hassWith(callWS), ['sensor.a', 'sensor.b'], T0, T2);
    expect(Object.keys(out)).toEqual(['sensor.a']);
    expect(out['sensor.a']).toEqual([{ t: T0, state: 'on', attributes: {} }]);
  });

  it('asks the recorder for the requested window and full attributes', async () => {
    const callWS = vi.fn().mockResolvedValue({});
    await fetchStateHistory(hassWith(callWS), ['sensor.a'], T0, T2);
    expect(callWS).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'history/history_during_period',
        start_time: new Date(T0).toISOString(),
        end_time: new Date(T2).toISOString(),
        entity_ids: ['sensor.a'],
        no_attributes: false,
        significant_changes_only: false,
      }),
    );
  });
});

describe('valueAt (step-function lookup)', () => {
  it('returns the last sample AT or BEFORE t, never the next one', () => {
    const pts = [
      { t: T0, value: 60 },
      { t: T2, value: 0 },
    ];
    // Just before the 10:00 drop, the value in effect is still 60 — picking the
    // nearest sample in either direction would read the future and disagree
    // with the line under the cursor.
    expect(valueAt(pts, T2 - 60_000)).toBe(60);
    expect(valueAt(pts, T2)).toBe(0);
    expect(valueAt(pts, T3)).toBe(0);
  });

  it('is null before the first sample — nothing is known there', () => {
    expect(valueAt([{ t: T1, value: 10 }], T0)).toBeNull();
  });

  it('is null for an empty series', () => {
    expect(valueAt([], T0)).toBeNull();
  });
});
