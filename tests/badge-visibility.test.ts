import { describe, it, expect } from 'vitest';
import { isSolarActive, isCloudConfigured, selectVisibleBadges } from '../src/lib/badge-visibility';
import type { BadgeKind } from '../src/const';

describe('isCloudConfigured (fail-open)', () => {
  it('returns true when enabled_handlers is undefined (older integration)', () => {
    expect(isCloudConfigured(undefined)).toBe(true);
  });

  it('returns true when enabled_handlers includes the cloud handler', () => {
    expect(isCloudConfigured(['solar', 'cloud', 'manual'])).toBe(true);
  });

  it('returns false when enabled_handlers is present but omits cloud', () => {
    expect(isCloudConfigured(['solar', 'manual'])).toBe(false);
  });

  it('returns false for an empty array (present-without-cloud)', () => {
    expect(isCloudConfigured([])).toBe(false);
  });
});

describe('isSolarActive', () => {
  it('is true when solar matched, cloud is not winner, and cloud configured', () => {
    expect(isSolarActive({ solarMatched: true, cloudIsWinner: false, cloudConfigured: true })).toBe(
      true,
    );
  });

  it('is false when solar did not match', () => {
    expect(
      isSolarActive({ solarMatched: false, cloudIsWinner: false, cloudConfigured: true }),
    ).toBe(false);
  });

  it('is false when cloud is the winner (suppressed)', () => {
    expect(isSolarActive({ solarMatched: true, cloudIsWinner: true, cloudConfigured: true })).toBe(
      false,
    );
  });

  it('is false when cloud is not configured', () => {
    expect(
      isSolarActive({ solarMatched: true, cloudIsWinner: false, cloudConfigured: false }),
    ).toBe(false);
  });
});

describe('selectVisibleBadges', () => {
  const active = { solarMatched: true, cloudIsWinner: false, cloudConfigured: true };

  it('always drops the cloud badge, even when cloud is matched', () => {
    const kinds: BadgeKind[] = ['cloud', 'manual'];
    expect(selectVisibleBadges(kinds, undefined, active)).toEqual(['manual']);
  });

  it('drops cloud even when cloud is the winner and nothing else matched', () => {
    const kinds: BadgeKind[] = ['cloud'];
    expect(
      selectVisibleBadges(kinds, undefined, {
        solarMatched: false,
        cloudIsWinner: true,
        cloudConfigured: true,
      }),
    ).toEqual([]);
  });

  it('keeps solar when it is active and badges.solar is not false', () => {
    expect(selectVisibleBadges(['solar'], undefined, active)).toEqual(['solar']);
  });

  it('drops solar when it is not active even if badges.solar is on', () => {
    expect(
      selectVisibleBadges(
        ['solar'],
        { solar: true },
        {
          solarMatched: false,
          cloudIsWinner: false,
          cloudConfigured: true,
        },
      ),
    ).toEqual([]);
  });

  it('drops solar when badges.solar is false even though it is active', () => {
    expect(selectVisibleBadges(['solar'], { solar: false }, active)).toEqual([]);
  });

  it('gates each of the other configurable kinds by its own flag', () => {
    const kinds: BadgeKind[] = [
      'force',
      'weather',
      'manual',
      'custom_position',
      'motion',
      'climate',
      'glare_zone',
    ];
    expect(selectVisibleBadges(kinds, undefined, active)).toEqual(kinds);
    expect(selectVisibleBadges(kinds, { motion: false }, active)).toEqual([
      'force',
      'weather',
      'manual',
      'custom_position',
      'climate',
      'glare_zone',
    ]);
    expect(
      selectVisibleBadges(kinds, { force: false, climate: false, glare_zone: false }, active),
    ).toEqual(['weather', 'manual', 'custom_position', 'motion']);
  });

  it('never filters auto or off, regardless of badges config', () => {
    expect(
      selectVisibleBadges(
        ['auto', 'off'],
        { solar: false, motion: false },
        {
          solarMatched: false,
          cloudIsWinner: false,
          cloudConfigured: true,
        },
      ),
    ).toEqual(['auto', 'off']);
  });

  it('preserves input order of the surviving kinds', () => {
    const kinds: BadgeKind[] = ['solar', 'manual', 'motion'];
    expect(selectVisibleBadges(kinds, undefined, active)).toEqual(['solar', 'manual', 'motion']);
  });
});
