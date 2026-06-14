import { describe, it, expect } from 'vitest';
import { placeTooltip } from '../src/lib/geometry';

describe('placeTooltip — down-and-right with viewport clamping', () => {
  const vp = { vpW: 1000, vpH: 800 };
  const tt = { ttW: 120, ttH: 40 };
  const offset: [number, number] = [12, 16];

  it('places the bubble down-and-right of the cursor by default', () => {
    const r = placeTooltip({ cursorX: 100, cursorY: 200, ...tt, ...vp, offset });
    expect(r).toEqual({ x: 112, y: 216, flipped: false });
  });

  it('flips X to the left when the bubble would overflow the right edge', () => {
    // cursorX near right edge: 100 + 12 + 120 = 232 fits at x=950? No: 950+12+120=1082 > 1000
    const r = placeTooltip({ cursorX: 950, cursorY: 200, ...tt, ...vp, offset });
    // flipped X = cursorX - offsetX - ttW = 950 - 12 - 120 = 818
    expect(r.x).toBe(818);
    expect(r.flipped).toBe(true);
  });

  it('flips Y upward when the bubble would overflow the bottom edge', () => {
    const r = placeTooltip({ cursorX: 100, cursorY: 790, ...tt, ...vp, offset });
    // flipped Y = cursorY - offsetY - ttH = 790 - 16 - 40 = 734
    expect(r.y).toBe(734);
  });

  it('clamps X to >= 0 when a leftward flip would still go negative', () => {
    const r = placeTooltip({
      cursorX: 5,
      cursorY: 200,
      ttW: 120,
      ttH: 40,
      vpW: 100,
      vpH: 800,
      offset,
    });
    // down-right overflows (5+12+120=137 > 100); flip left = 5-12-120 = -127 -> clamp 0
    expect(r.x).toBe(0);
    expect(r.flipped).toBe(true);
  });

  it('clamps Y to >= 0 when an upward flip would still go negative', () => {
    const r = placeTooltip({
      cursorX: 100,
      cursorY: 5,
      ttW: 120,
      ttH: 40,
      vpW: 1000,
      vpH: 30,
      offset,
    });
    // down (5+16+40=61 > 30); flip up = 5-16-40 = -51 -> clamp 0
    expect(r.y).toBe(0);
  });

  it('uses a default offset of [12, 16] when offset is omitted', () => {
    const r = placeTooltip({ cursorX: 100, cursorY: 200, ttW: 120, ttH: 40, vpW: 1000, vpH: 800 });
    expect(r).toEqual({ x: 112, y: 216, flipped: false });
  });
});
