import { describe, it, expect } from 'vitest';
import { memberSpread } from '../src/lib/group-spread';

/** A blind: driving the position UP uncovers the window, so the drawn value is
 *  mirrored. This is the default for a group. */
const BLIND = { openBlocksSun: false, min: 0, max: 100 };
/** An awning: extending raises both the value and the coverage, so drawn is
 *  identity. */
const AWNING = { openBlocksSun: true, min: 0, max: 100 };

describe('memberSpread', () => {
  it('returns null when nothing is readable', () => {
    expect(memberSpread({}, BLIND)).toBeNull();
    expect(memberSpread({ a: null, b: null }, BLIND)).toBeNull();
  });

  it('keeps the drawn and logical frames separate on a blind', () => {
    // Three at 40 and two at 0 — the reported case. Logical 0..40 mirrors to
    // drawn 60..100. Printing a drawn number as a readout would contradict every
    // other readout in the card, which is why both frames are carried.
    const s = memberSpread({ a: 40, b: 40, c: 40, d: 0, e: 0 }, BLIND)!;
    expect(s.logicalMin).toBe(0);
    expect(s.logicalMax).toBe(40);
    expect(s.min).toBe(60);
    expect(s.max).toBe(100);
  });

  it('leaves both frames identical on an awning', () => {
    const s = memberSpread({ a: 20, b: 80 }, AWNING)!;
    expect(s.min).toBe(20);
    expect(s.max).toBe(80);
    expect(s.logicalMin).toBe(20);
    expect(s.logicalMax).toBe(80);
  });

  it('deduplicates ticks but counts every readable member', () => {
    // Five covers in two clusters draw two marks; five stacked at two x is five
    // times the paint for two ticks, and the count is carried separately.
    const s = memberSpread({ a: 40, b: 40, c: 40, d: 0, e: 0 }, BLIND)!;
    expect(s.ticks).toEqual([60, 100]);
    expect(s.readable).toBe(5);
  });

  it('reports aligned when every member sits at one value', () => {
    const s = memberSpread({ a: 30, b: 30, c: 30 }, BLIND)!;
    expect(s.aligned).toBe(true);
    expect(s.ticks).toEqual([70]);
    expect(s.logicalMin).toBe(30);
    expect(s.logicalMax).toBe(30);
  });

  it('ignores unreadable members instead of treating them as zero', () => {
    // A null is "we could not read it", not "it is closed". Folding it in as 0
    // would stretch the range to a member nobody has a position for.
    const s = memberSpread({ a: 40, b: null, c: 60 }, BLIND)!;
    expect(s.readable).toBe(2);
    expect(s.logicalMin).toBe(40);
    expect(s.logicalMax).toBe(60);
  });

  it('ignores NaN the same way', () => {
    const s = memberSpread({ a: Number.NaN, b: 50 }, BLIND)!;
    expect(s.readable).toBe(1);
    expect(s.aligned).toBe(true);
    expect(s.logicalMin).toBe(50);
  });
});
