import { describe, it, expect } from 'vitest';
import {
  activeDuration,
  countMoves,
  formatSpan,
  handlerShares,
  summarize,
} from '../src/lib/history-stats';
import type { HistoryBand, PositionHistorySample } from '../src/types';

const HOUR = 60 * 60 * 1000;
const T0 = Date.UTC(2026, 6, 9, 8, 0, 0);

function sample(t: number, position: number): PositionHistorySample {
  return { t: new Date(t).toISOString(), position };
}

function band(start: number, end: number, state: string): HistoryBand {
  return { start, end, state, attributes: {} };
}

const isOn = (s: string): boolean => s !== 'off' && s !== 'unavailable' && s !== 'unknown';

describe('countMoves', () => {
  it('is zero for an empty or single-sample series', () => {
    expect(countMoves([])).toEqual({ moves: 0, travel: 0 });
    expect(countMoves([sample(T0, 50)])).toEqual({ moves: 0, travel: 0 });
  });

  it('counts VALUE changes, not recorder rows', () => {
    // The recorder emits rows for attribute-only updates, and the fetch
    // forward-fills a final sample to the window end. Counting rows would
    // inflate both numbers.
    expect(countMoves([sample(T0, 50), sample(T0 + HOUR, 50), sample(T0 + 2 * HOUR, 50)])).toEqual({
      moves: 0,
      travel: 0,
    });
  });

  it('sums absolute deltas as travel', () => {
    expect(countMoves([sample(T0, 0), sample(T0 + HOUR, 100), sample(T0 + 2 * HOUR, 0)])).toEqual({
      moves: 2,
      travel: 200,
    });
  });

  it('counts a downward move the same as an upward one', () => {
    expect(countMoves([sample(T0, 80), sample(T0 + HOUR, 30)])).toEqual({ moves: 1, travel: 50 });
  });

  it('rounds travel to whole percentage points', () => {
    expect(countMoves([sample(T0, 0), sample(T0 + HOUR, 33.3)]).travel).toBe(33);
  });

  it('skips non-finite positions', () => {
    expect(
      countMoves([sample(T0, 10), sample(T0 + HOUR, Number.NaN), sample(T0 + 2 * HOUR, 20)]),
    ).toEqual({ moves: 1, travel: 10 });
  });
});

describe('handlerShares', () => {
  it('is empty with no bands', () => {
    expect(handlerShares([])).toEqual([]);
  });

  it('ignores zero-length bands', () => {
    expect(handlerShares([band(T0, T0, 'solar')])).toEqual([]);
  });

  it('sums a handler that won more than once across the window', () => {
    // solar → manual → solar must total solar's two spans, not report it twice.
    const out = handlerShares([
      band(T0, T0 + HOUR, 'solar'),
      band(T0 + HOUR, T0 + 2 * HOUR, 'manual'),
      band(T0 + 2 * HOUR, T0 + 4 * HOUR, 'solar'),
    ]);
    expect(out).toEqual([
      { handler: 'solar', ms: 3 * HOUR, fraction: 0.75 },
      { handler: 'manual', ms: HOUR, fraction: 0.25 },
    ]);
  });

  it('sorts largest first', () => {
    const out = handlerShares([band(T0, T0 + HOUR, 'a'), band(T0 + HOUR, T0 + 4 * HOUR, 'b')]);
    expect(out.map((h) => h.handler)).toEqual(['b', 'a']);
  });

  it('takes fractions over BANDED time, not window length', () => {
    // Documented explicitly: a recorder gap means the bands do not cover the
    // window, and the fractions must still sum to 1.
    const out = handlerShares([band(T0, T0 + HOUR, 'solar')]);
    expect(out[0].fraction).toBe(1);
  });
});

describe('activeDuration', () => {
  it('is zero with no bands', () => {
    expect(activeDuration([], isOn)).toBe(0);
  });

  it('sums only the active bands', () => {
    const ms = activeDuration(
      [
        band(T0, T0 + HOUR, 'on'),
        band(T0 + HOUR, T0 + 3 * HOUR, 'off'),
        band(T0 + 3 * HOUR, T0 + 4 * HOUR, 'on'),
      ],
      isOn,
    );
    expect(ms).toBe(2 * HOUR);
  });

  it('honors the injected predicate rather than assuming on/off', () => {
    expect(activeDuration([band(T0, T0 + HOUR, 'on')], () => false)).toBe(0);
  });
});

describe('summarize', () => {
  it('composes the three derivations', () => {
    const stats = summarize({
      actual: [sample(T0, 0), sample(T0 + HOUR, 40)],
      whoWon: [band(T0, T0 + 2 * HOUR, 'solar')],
      overrideBands: [band(T0, T0 + HOUR, 'on')],
      isActive: isOn,
    });
    expect(stats).toEqual({
      moves: 1,
      travel: 40,
      handlers: [{ handler: 'solar', ms: 2 * HOUR, fraction: 1 }],
      activeMs: HOUR,
    });
  });

  it('degrades to zeroes when every source is empty', () => {
    expect(summarize({ actual: [], whoWon: [], overrideBands: [], isActive: isOn })).toEqual({
      moves: 0,
      travel: 0,
      handlers: [],
      activeMs: 0,
    });
  });
});

describe('formatSpan', () => {
  it('reports sub-minute spans as <1m rather than 0m', () => {
    expect(formatSpan(0)).toBe('<1m');
    expect(formatSpan(20_000)).toBe('<1m');
  });

  it('formats minutes under an hour', () => {
    expect(formatSpan(35 * 60_000)).toBe('35m');
  });

  it('drops the minutes on a whole hour', () => {
    expect(formatSpan(4 * HOUR)).toBe('4h');
  });

  it('formats hours and minutes', () => {
    expect(formatSpan(4 * HOUR + 20 * 60_000)).toBe('4h 20m');
  });

  it('rounds to the nearest minute', () => {
    expect(formatSpan(90_000)).toBe('2m');
  });
});
