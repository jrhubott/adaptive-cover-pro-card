import { describe, it, expect } from 'vitest';
import { isSolarActive, selectVisibleBadges } from '../src/lib/badge-visibility';
import type { BadgeKind } from '../src/const';

describe('isSolarActive', () => {
  it('is true when solar matched and cloud is not the winner', () => {
    expect(isSolarActive({ solarMatched: true, cloudIsWinner: false })).toBe(true);
  });

  it('is false when solar did not match', () => {
    expect(isSolarActive({ solarMatched: false, cloudIsWinner: false })).toBe(false);
  });

  it('is false when cloud is the winner (suppressed)', () => {
    expect(isSolarActive({ solarMatched: true, cloudIsWinner: true })).toBe(false);
  });

  it('is active whenever solar wins, regardless of whether cloud is configured', () => {
    // The badge no longer depends on cloud-suppression being configured: solar
    // matched + cloud not winning is sufficient.
    expect(isSolarActive({ solarMatched: true, cloudIsWinner: false })).toBe(true);
  });
});

describe('selectVisibleBadges', () => {
  const active = { solarMatched: true, cloudIsWinner: false };

  it('keeps the cloud badge by default when cloud is matched', () => {
    const kinds: BadgeKind[] = ['cloud', 'manual'];
    expect(selectVisibleBadges(kinds, undefined, active)).toEqual(['cloud', 'manual']);
  });

  it('keeps cloud when it is the winner and nothing else matched', () => {
    const kinds: BadgeKind[] = ['cloud'];
    expect(
      selectVisibleBadges(kinds, undefined, {
        solarMatched: false,
        cloudIsWinner: true,
      }),
    ).toEqual(['cloud']);
  });

  it('drops cloud when badges.cloud is false', () => {
    const kinds: BadgeKind[] = ['cloud', 'manual'];
    expect(selectVisibleBadges(kinds, { cloud: false }, active)).toEqual(['manual']);
  });

  it('keeps solar when it is active and badges.solar is not false', () => {
    expect(selectVisibleBadges(['solar'], undefined, active)).toEqual(['solar']);
  });

  it('drops solar when it is not active even if badges.solar is on', () => {
    expect(
      selectVisibleBadges(
        ['solar'],
        { solar: true },
        { solarMatched: false, cloudIsWinner: false },
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
      'cloud',
    ];
    expect(selectVisibleBadges(kinds, undefined, active)).toEqual(kinds);
    expect(selectVisibleBadges(kinds, { motion: false, cloud: false }, active)).toEqual([
      'force',
      'weather',
      'manual',
      'custom_position',
      'climate',
      'glare_zone',
    ]);
    expect(
      selectVisibleBadges(kinds, { force: false, climate: false, glare_zone: false }, active),
    ).toEqual(['weather', 'manual', 'custom_position', 'motion', 'cloud']);
  });

  it('keeps auto by default but lets badges.auto hide it; off is never filtered', () => {
    const noSolar = { solarMatched: false, cloudIsWinner: false };
    // Unrelated flags off → auto still shows.
    expect(selectVisibleBadges(['auto', 'off'], { solar: false, motion: false }, noSolar)).toEqual([
      'auto',
      'off',
    ]);
    // badges.auto === false hides auto, but off survives.
    expect(selectVisibleBadges(['auto', 'off'], { auto: false }, noSolar)).toEqual(['off']);
    expect(selectVisibleBadges(['auto'], { auto: true }, noSolar)).toEqual(['auto']);
  });

  it('preserves input order of the surviving kinds', () => {
    const kinds: BadgeKind[] = ['solar', 'manual', 'motion'];
    expect(selectVisibleBadges(kinds, undefined, active)).toEqual(['solar', 'manual', 'motion']);
  });
});
