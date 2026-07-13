import { describe, it, expect } from 'vitest';
import {
  pickCoverIcon,
  coverStateIcon,
  coverOpenIcon,
  coverCloseIcon,
  coverStateColor,
} from '../src/lib/icons';

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

  describe('cover_venetian', () => {
    it('open uses blinds-open', () => {
      expect(pickCoverIcon('cover_venetian', 100)).toBe('mdi:blinds-open');
    });
    it('partial uses blinds', () => {
      expect(pickCoverIcon('cover_venetian', 50)).toBe('mdi:blinds');
    });
    it('closed also uses blinds', () => {
      expect(pickCoverIcon('cover_venetian', 0)).toBe('mdi:blinds');
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

describe('coverStateIcon', () => {
  describe('device_class map (position-aware open/partial/closed)', () => {
    const cases: Array<[string, string, string, string]> = [
      // [device_class, open (100), partial (50), closed (0)]
      ['awning', 'mdi:awning-outline', 'mdi:awning-outline', 'mdi:awning-outline'],
      ['blind', 'mdi:blinds-open', 'mdi:blinds-horizontal', 'mdi:blinds-horizontal-closed'],
      ['curtain', 'mdi:curtains', 'mdi:curtains', 'mdi:curtains-closed'],
      ['damper', 'mdi:circle', 'mdi:circle-slice-8', 'mdi:circle-slice-8'],
      ['door', 'mdi:door-open', 'mdi:door-open', 'mdi:door-closed'],
      ['garage', 'mdi:garage-open', 'mdi:garage-open', 'mdi:garage'],
      ['gate', 'mdi:gate-open', 'mdi:gate-open', 'mdi:gate'],
      ['shade', 'mdi:roller-shade', 'mdi:roller-shade', 'mdi:roller-shade-closed'],
      ['shutter', 'mdi:window-shutter-open', 'mdi:window-shutter', 'mdi:window-shutter'],
      ['window', 'mdi:window-open', 'mdi:window-open', 'mdi:window-closed'],
    ];
    for (const [deviceClass, open, partial, closed] of cases) {
      it(`${deviceClass} open`, () => {
        expect(coverStateIcon({ deviceClass, coverType: 'cover_blind', position: 100 })).toBe(open);
      });
      it(`${deviceClass} partial`, () => {
        expect(coverStateIcon({ deviceClass, coverType: 'cover_blind', position: 50 })).toBe(
          partial,
        );
      });
      it(`${deviceClass} closed`, () => {
        expect(coverStateIcon({ deviceClass, coverType: 'cover_blind', position: 0 })).toBe(closed);
      });
    }
  });

  describe('fallback chain', () => {
    it('explicit entity icon wins over device_class', () => {
      expect(
        coverStateIcon({
          explicitIcon: 'mdi:foo',
          deviceClass: 'awning',
          coverType: 'cover_blind',
          position: 0,
        }),
      ).toBe('mdi:foo');
    });
    it('ignores an empty explicit icon and uses device_class', () => {
      expect(
        coverStateIcon({
          explicitIcon: '',
          deviceClass: 'window',
          coverType: 'cover_blind',
          position: 0,
        }),
      ).toBe('mdi:window-closed');
    });
    it('unknown device_class falls back to cover_type', () => {
      expect(coverStateIcon({ deviceClass: 'zzz', coverType: 'cover_awning', position: 0 })).toBe(
        'mdi:window-closed-variant',
      );
    });
    it('no device_class falls back to cover_type', () => {
      expect(coverStateIcon({ coverType: 'cover_blind', position: 100 })).toBe('mdi:blinds-open');
    });
    it('no device_class + unknown cover_type falls back to the generic glyph', () => {
      expect(coverStateIcon({ coverType: 'cover_x', position: 0 })).toBe('mdi:window-shutter');
    });
  });
});

describe('coverOpenIcon / coverCloseIcon', () => {
  for (const dc of ['awning', 'curtain', 'door', 'gate']) {
    it(`${dc} open uses horizontal expand`, () => {
      expect(coverOpenIcon(dc)).toBe('mdi:arrow-expand-horizontal');
    });
    it(`${dc} close uses horizontal collapse`, () => {
      expect(coverCloseIcon(dc)).toBe('mdi:arrow-collapse-horizontal');
    });
  }
  it('shutter open uses the up arrow', () => {
    expect(coverOpenIcon('shutter')).toBe('mdi:arrow-up');
  });
  it('shutter close uses the down arrow', () => {
    expect(coverCloseIcon('shutter')).toBe('mdi:arrow-down');
  });
  it('undefined device_class open uses the up arrow', () => {
    expect(coverOpenIcon(undefined)).toBe('mdi:arrow-up');
  });
  it('undefined device_class close uses the down arrow', () => {
    expect(coverCloseIcon(undefined)).toBe('mdi:arrow-down');
  });
});

describe('coverStateColor', () => {
  it('open resolves to the cover-open var with active fallback chain', () => {
    expect(coverStateColor('open')).toBe(
      'var(--state-cover-open-color, var(--state-cover-active-color, var(--state-cover-color, var(--state-active-color))))',
    );
  });
  it('opening resolves to the cover-opening var with active fallback chain', () => {
    expect(coverStateColor('opening')).toBe(
      'var(--state-cover-opening-color, var(--state-cover-active-color, var(--state-cover-color, var(--state-active-color))))',
    );
  });
  it('closing resolves to the cover-closing var with active fallback chain', () => {
    expect(coverStateColor('closing')).toBe(
      'var(--state-cover-closing-color, var(--state-cover-active-color, var(--state-cover-color, var(--state-active-color))))',
    );
  });
  it('closed resolves to the cover-closed var with inactive fallback chain', () => {
    expect(coverStateColor('closed')).toBe(
      'var(--state-cover-closed-color, var(--state-cover-inactive-color, var(--state-cover-color, var(--state-inactive-color))))',
    );
  });
  it('unavailable resolves to the unavailable var', () => {
    expect(coverStateColor('unavailable')).toBe('var(--state-unavailable-color)');
  });
  it('unknown resolves to the unavailable var', () => {
    expect(coverStateColor('unknown')).toBe('var(--state-unavailable-color)');
  });
  it('undefined resolves to the unavailable var', () => {
    expect(coverStateColor(undefined)).toBe('var(--state-unavailable-color)');
  });
  it('null resolves to the unavailable var', () => {
    expect(coverStateColor(null)).toBe('var(--state-unavailable-color)');
  });
  it('empty string resolves to the unavailable var', () => {
    expect(coverStateColor('')).toBe('var(--state-unavailable-color)');
  });
});
