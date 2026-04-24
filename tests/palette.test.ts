import { describe, it, expect } from 'vitest';
import { PALETTE, colorForIndex, resolveCoverColor } from '../src/lib/palette';

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

describe('resolveCoverColor', () => {
  it('returns palette default with isOverride false when override is undefined', () => {
    expect(resolveCoverColor(undefined, 0)).toEqual({ color: PALETTE[0], isOverride: false });
  });

  it('returns palette default with isOverride false for null', () => {
    expect(resolveCoverColor(null, 2)).toEqual({ color: PALETTE[2], isOverride: false });
  });

  it('returns palette default with isOverride false for empty string', () => {
    expect(resolveCoverColor('', 2)).toEqual({ color: PALETTE[2], isOverride: false });
  });

  it('returns override with isOverride true for a non-empty string', () => {
    expect(resolveCoverColor('#ff3366', 0)).toEqual({ color: '#ff3366', isOverride: true });
  });

  it('wraps index for palette fallback', () => {
    expect(resolveCoverColor(undefined, PALETTE.length)).toEqual({
      color: PALETTE[0],
      isOverride: false,
    });
  });
});
