import { describe, it, expect } from 'vitest';
import { PALETTE, colorForIndex } from '../src/lib/palette';

describe('palette', () => {
  it('returns the first color for index 0', () => {
    expect(colorForIndex(0)).toBe(PALETTE[0]);
  });

  it('wraps on overflow', () => {
    expect(colorForIndex(PALETTE.length)).toBe(PALETTE[0]);
    expect(colorForIndex(PALETTE.length + 2)).toBe(PALETTE[2]);
  });

  it('handles negative indices by wrapping', () => {
    expect(colorForIndex(-1)).toBe(PALETTE[PALETTE.length - 1]);
    expect(colorForIndex(-PALETTE.length)).toBe(PALETTE[0]);
  });

  it('every palette entry is a hex color string', () => {
    for (const c of PALETTE) {
      expect(c).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
