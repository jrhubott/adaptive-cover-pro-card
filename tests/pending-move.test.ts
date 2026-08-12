import { describe, it, expect } from 'vitest';

import {
  PENDING_MOVE_TOLERANCE,
  hasArrivedAt,
  isMovingState,
  isPendingVisible,
  travelBand,
} from '../src/lib/pending-move';

describe('pending-move — arrival', () => {
  it('counts a cover within tolerance as arrived', () => {
    expect(hasArrivedAt(40, 40)).toBe(true);
    expect(hasArrivedAt(40 - PENDING_MOVE_TOLERANCE, 40)).toBe(true);
    expect(hasArrivedAt(40 + PENDING_MOVE_TOLERANCE, 40)).toBe(true);
  });

  it('does not count a cover still short of tolerance', () => {
    expect(hasArrivedAt(40 - PENDING_MOVE_TOLERANCE - 1, 40)).toBe(false);
  });

  // A no-feedback / assumed-state cover (a Somfy RTS awning) publishes no
  // position at all. It has not arrived — it is silent — and the timeout, not
  // this rule, is what ends its indicator.
  it('treats an unreported position as NOT arrived', () => {
    expect(hasArrivedAt(null, 40)).toBe(false);
    expect(hasArrivedAt(undefined, 40)).toBe(false);
    expect(hasArrivedAt(NaN, 40)).toBe(false);
  });
});

describe('pending-move — visibility', () => {
  // The bug this guard exists for: commanding a value the cover is ALREADY at
  // moves nothing, so its position never changes and nothing ever settles the
  // move. Without this the rail carried a zero-width band and a stray pip until
  // the 60s timeout.
  it('hides a destination the cover is already at', () => {
    expect(isPendingVisible(40, 40)).toBe(false);
    expect(isPendingVisible(41, 40)).toBe(false);
  });

  it('shows a destination the cover still has to travel to', () => {
    expect(isPendingVisible(100, 40)).toBe(true);
  });

  it('shows a destination for a cover that reports nothing', () => {
    expect(isPendingVisible(null, 40)).toBe(true);
  });

  it('is false when there is no destination at all', () => {
    expect(isPendingVisible(40, null)).toBe(false);
  });
});

describe('pending-move — travel band geometry', () => {
  it('spans from the fill to the destination, whichever way round they fall', () => {
    expect(travelBand(20, 80)).toEqual({ left: 20, width: 60 });
    expect(travelBand(80, 20)).toEqual({ left: 20, width: 60 });
  });

  it('collapses to nothing once they coincide', () => {
    expect(travelBand(50, 50)).toEqual({ left: 50, width: 0 });
  });
});

describe('pending-move — automatic moves', () => {
  // An automatic move has no command echo to latch onto, so the only evidence
  // is the entity saying it is in motion.
  it('recognizes the in-motion cover states', () => {
    expect(isMovingState('opening')).toBe(true);
    expect(isMovingState('closing')).toBe(true);
  });

  it('does not treat a settled or absent state as motion', () => {
    for (const s of ['open', 'closed', 'unavailable', 'unknown', '', null, undefined]) {
      expect(isMovingState(s)).toBe(false);
    }
  });
});
