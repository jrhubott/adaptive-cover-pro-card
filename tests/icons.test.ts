import { describe, it, expect } from 'vitest';
import { pickCoverIcon } from '../src/lib/icons';

describe('pickCoverIcon', () => {
  describe('cover_blind', () => {
    it('returns open variant at 100', () => {
      expect(pickCoverIcon('cover_blind', 100)).toBe('mdi:blinds-open');
    });
    it('returns open variant exactly at 95 threshold', () => {
      expect(pickCoverIcon('cover_blind', 95)).toBe('mdi:blinds-open');
    });
    it('returns partial just under 95', () => {
      expect(pickCoverIcon('cover_blind', 94)).toBe('mdi:blinds-horizontal');
    });
    it('returns partial at 50', () => {
      expect(pickCoverIcon('cover_blind', 50)).toBe('mdi:blinds-horizontal');
    });
    it('returns partial just over 5', () => {
      expect(pickCoverIcon('cover_blind', 6)).toBe('mdi:blinds-horizontal');
    });
    it('returns closed variant exactly at 5 threshold', () => {
      expect(pickCoverIcon('cover_blind', 5)).toBe('mdi:blinds-horizontal-closed');
    });
    it('returns closed variant at 0', () => {
      expect(pickCoverIcon('cover_blind', 0)).toBe('mdi:blinds-horizontal-closed');
    });
    it('returns partial on null position', () => {
      expect(pickCoverIcon('cover_blind', null)).toBe('mdi:blinds-horizontal');
    });
  });

  describe('cover_awning', () => {
    it('open uses awning-outline', () => {
      expect(pickCoverIcon('cover_awning', 100)).toBe('mdi:awning-outline');
    });
    it('partial uses awning-outline', () => {
      expect(pickCoverIcon('cover_awning', 50)).toBe('mdi:awning-outline');
    });
    it('closed swaps to window-closed-variant', () => {
      expect(pickCoverIcon('cover_awning', 0)).toBe('mdi:window-closed-variant');
    });
  });

  describe('cover_tilt', () => {
    it('open uses blinds-open', () => {
      expect(pickCoverIcon('cover_tilt', 100)).toBe('mdi:blinds-open');
    });
    it('partial uses blinds', () => {
      expect(pickCoverIcon('cover_tilt', 50)).toBe('mdi:blinds');
    });
    it('closed also uses blinds', () => {
      expect(pickCoverIcon('cover_tilt', 0)).toBe('mdi:blinds');
    });
  });

  describe('unknown cover_type fallback', () => {
    it('open falls back to window-shutter-open', () => {
      expect(pickCoverIcon('cover_mystery', 100)).toBe('mdi:window-shutter-open');
    });
    it('partial falls back to window-shutter', () => {
      expect(pickCoverIcon('cover_mystery', 50)).toBe('mdi:window-shutter');
    });
    it('closed falls back to window-shutter', () => {
      expect(pickCoverIcon('cover_mystery', 0)).toBe('mdi:window-shutter');
    });
    it('null position falls back to window-shutter', () => {
      expect(pickCoverIcon('cover_mystery', null)).toBe('mdi:window-shutter');
    });
  });

  it('NaN position treated as unknown', () => {
    expect(pickCoverIcon('cover_blind', NaN)).toBe('mdi:blinds-horizontal');
  });
});
