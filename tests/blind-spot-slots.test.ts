import { describe, it, expect } from 'vitest';

import { blindSpotBearingList, blindSpotBearings } from '../src/lib/geometry';

/**
 * Issue #269 — a blind spot configured in slot 2 or 3 never appeared.
 *
 * The integration has carried three blind-spot slots since its #701 and
 * publishes them all on `blind_spot_ranges`. `blind_spot_range` (singular) is
 * slot 1 alone, kept only for cards written before the list existed — and
 * reading it as the whole truth is the bug.
 */
describe('blindSpotBearingList', () => {
  it('draws every configured slot, not just the first', () => {
    const out = blindSpotBearingList(
      180,
      [
        [-45, -30],
        [-10, 15],
        [25, 40],
      ],
      undefined,
    );
    expect(out).toHaveLength(3);
    expect(out).toEqual([
      blindSpotBearings(180, [-45, -30]),
      blindSpotBearings(180, [-10, 15]),
      blindSpotBearings(180, [25, 40]),
    ]);
  });

  // The exact reported shape: slot 1 enabled but never configured stores
  // left_gamma = right_gamma = 0, so the legacy attribute is PRESENT and spans
  // zero degrees. The old card drew an invisible path and the user saw nothing.
  it('skips a degenerate slot and still draws the real one behind it', () => {
    const out = blindSpotBearingList(
      180,
      [
        [0, 0],
        [20, 45],
      ],
      [0, 0],
    );
    expect(out).toEqual([blindSpotBearings(180, [20, 45])]);
  });

  it('falls back to the legacy single range when no list is published', () => {
    expect(blindSpotBearingList(180, undefined, [10, 30])).toEqual([
      blindSpotBearings(180, [10, 30]),
    ]);
  });

  it('draws nothing when the entry has no blind spot at all', () => {
    expect(blindSpotBearingList(180, undefined, undefined)).toEqual([]);
    expect(blindSpotBearingList(180, [], undefined)).toEqual([]);
  });

  it('drops a zero-span legacy range rather than drawing a sliver', () => {
    expect(blindSpotBearingList(180, undefined, [12, 12])).toEqual([]);
  });

  it('ignores malformed and non-finite pairs', () => {
    const out = blindSpotBearingList(
      180,
      [
        [NaN, 20],
        [10, Infinity],
        [20, 45],
      ],
      undefined,
    );
    expect(out).toEqual([blindSpotBearings(180, [20, 45])]);
  });
});
