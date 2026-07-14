import { describe, it, expect } from 'vitest';
import {
  isAutoControlActive,
  isSolarActive,
  resolveTileBadgeKind,
  selectVisibleBadges,
} from '../src/lib/badge-visibility';
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

describe('resolveTileBadgeKind', () => {
  const base = { integrationEnabled: true, manualActive: false };

  it('passes non-motion winners straight through', () => {
    expect(
      resolveTileBadgeKind({ ...base, winner: 'solar', badges: undefined, showMotionIcon: true }),
    ).toBe('solar');
    expect(
      resolveTileBadgeKind({ ...base, winner: 'default', badges: undefined, showMotionIcon: true }),
    ).toBe('auto');
  });

  it('keeps the Motion idle badge when the icon is off and its flag is on', () => {
    expect(
      resolveTileBadgeKind({ ...base, winner: 'motion', badges: undefined, showMotionIcon: false }),
    ).toBe('motion');
  });

  it('falls back to Auto when the motion indicator icon is shown', () => {
    expect(
      resolveTileBadgeKind({ ...base, winner: 'motion', badges: undefined, showMotionIcon: true }),
    ).toBe('auto');
  });

  it('falls back to Auto when the motion badge flag is off', () => {
    expect(
      resolveTileBadgeKind({
        ...base,
        winner: 'motion',
        badges: { motion: false },
        showMotionIcon: false,
      }),
    ).toBe('auto');
  });

  it('returns null (blank) when motion is suppressed and Auto is also disabled', () => {
    expect(
      resolveTileBadgeKind({
        ...base,
        winner: 'motion',
        badges: { motion: false, auto: false },
        showMotionIcon: false,
      }),
    ).toBeNull();
    expect(
      resolveTileBadgeKind({
        ...base,
        winner: 'motion',
        badges: { auto: false },
        showMotionIcon: true,
      }),
    ).toBeNull();
  });

  it('returns off_schedule when in_time_window is false and auto would otherwise show', () => {
    expect(
      resolveTileBadgeKind({
        ...base,
        winner: 'default',
        badges: undefined,
        showMotionIcon: true,
        inTimeWindow: false,
      }),
    ).toBe('off_schedule');
    // A specific automatic handler winning still yields off_schedule.
    expect(
      resolveTileBadgeKind({
        ...base,
        winner: 'solar',
        badges: undefined,
        showMotionIcon: true,
        inTimeWindow: false,
      }),
    ).toBe('off_schedule');
  });

  it('does not show off_schedule when in_time_window is true/undefined', () => {
    expect(
      resolveTileBadgeKind({
        ...base,
        winner: 'solar',
        badges: undefined,
        showMotionIcon: true,
        inTimeWindow: true,
      }),
    ).toBe('solar');
    expect(
      resolveTileBadgeKind({ ...base, winner: 'solar', badges: undefined, showMotionIcon: true }),
    ).toBe('solar');
  });

  it('off_schedule does not override the integration-disabled Off badge', () => {
    expect(
      resolveTileBadgeKind({
        winner: 'solar',
        integrationEnabled: false,
        manualActive: false,
        badges: undefined,
        showMotionIcon: true,
        inTimeWindow: false,
      }),
    ).toBe('off');
  });

  it('off_schedule does not override an active manual override', () => {
    expect(
      resolveTileBadgeKind({
        winner: 'solar',
        integrationEnabled: true,
        manualActive: true,
        badges: undefined,
        showMotionIcon: true,
        inTimeWindow: false,
      }),
    ).toBe('manual');
  });

  it('off_schedule does not override a force winner', () => {
    expect(
      resolveTileBadgeKind({
        ...base,
        winner: 'force',
        badges: undefined,
        showMotionIcon: true,
        inTimeWindow: false,
      }),
    ).toBe('force');
  });

  it('is hidden when badges.off_schedule is false (falls back to the handler kind)', () => {
    expect(
      resolveTileBadgeKind({
        ...base,
        winner: 'solar',
        badges: { off_schedule: false },
        showMotionIcon: true,
        inTimeWindow: false,
      }),
    ).toBe('solar');
  });

  it('does not touch a manual override that outranks the motion winner', () => {
    // manualActive forces the manual kind before motion is ever considered.
    expect(
      resolveTileBadgeKind({
        winner: 'motion',
        integrationEnabled: true,
        manualActive: true,
        badges: undefined,
        showMotionIcon: true,
      }),
    ).toBe('manual');
  });
});

describe('resolveTileBadgeKind climate elevation (issue #223)', () => {
  // Reproduces the tile-vs-dialog asymmetry: a real decision trace can carry a
  // matched climate row in the same cycle whose ultimate winner is `default`
  // (no BADGE_KINDS_BY_HANDLER entry, so it falls through to the generic
  // `auto` badge). The dialog already surfaces the more specific `climate`
  // badge by walking every matched row; the tile's single winner badge should
  // do the same, but only when the plain winner-derived kind is the generic
  // `auto` fallback — a winner that already resolves to a specific kind (e.g.
  // `cloud`) keeps its own badge.
  const base = { integrationEnabled: true, manualActive: false, showMotionIcon: true };

  it('elevates to climate when winner is the generic default fallback but climate matched in the trace', () => {
    expect(
      resolveTileBadgeKind({
        ...base,
        winner: 'default',
        badges: undefined,
        trace: [
          { handler: 'climate', matched: true, reason: 'heat protection', position: 20 },
          { handler: 'default', matched: true, reason: 'default calc', position: 60 },
        ],
      }),
    ).toBe('climate');
  });

  it('does not elevate when badges.climate is false (opt-out honored)', () => {
    expect(
      resolveTileBadgeKind({
        ...base,
        winner: 'default',
        badges: { climate: false },
        trace: [
          { handler: 'climate', matched: true, reason: 'heat protection', position: 20 },
          { handler: 'default', matched: true, reason: 'default calc', position: 60 },
        ],
      }),
    ).toBe('auto');
  });

  it('does not elevate when climate is present in the trace but did not match', () => {
    expect(
      resolveTileBadgeKind({
        ...base,
        winner: 'default',
        badges: undefined,
        trace: [
          { handler: 'climate', matched: false, reason: 'inactive', position: null },
          { handler: 'default', matched: true, reason: 'default calc', position: 60 },
        ],
      }),
    ).toBe('auto');
  });

  it('does not steal the badge from a winner that already resolves to a specific kind', () => {
    expect(
      resolveTileBadgeKind({
        ...base,
        winner: 'cloud',
        badges: undefined,
        trace: [
          { handler: 'climate', matched: true, reason: 'heat protection', position: 20 },
          { handler: 'cloud', matched: true, reason: 'cloud suppression', position: 100 },
        ],
      }),
    ).toBe('cloud');
  });
});

describe('isAutoControlActive', () => {
  const base = {
    integrationEnabled: true,
    automaticControl: true,
    manualActive: false,
    bypassAutoControl: false,
  };

  // Every ordinary automatic handler keeps Auto visible: the indicator is
  // independent of *which* automatic handler won.
  const ordinaryHandlers = [
    'cloud',
    'solar',
    'default',
    'weather',
    'climate',
    'glare_zone',
    'motion',
  ];
  for (const winner of ordinaryHandlers) {
    it(`is true for the ${winner} handler under automatic control`, () => {
      expect(isAutoControlActive({ ...base, winner })).toBe(true);
    });
  }

  it('is false when a manual override is active', () => {
    expect(isAutoControlActive({ ...base, winner: 'solar', manualActive: true })).toBe(false);
  });

  it('is false when the winner normalizes to force', () => {
    expect(isAutoControlActive({ ...base, winner: 'force' })).toBe(false);
    // Raw integration handler name normalizes to force.
    expect(isAutoControlActive({ ...base, winner: 'force_override' })).toBe(false);
  });

  it('is false for a custom_position winner that bypasses automatic control', () => {
    expect(
      isAutoControlActive({ ...base, winner: 'custom_position', bypassAutoControl: true }),
    ).toBe(false);
  });

  it('is true for a custom_position winner that does NOT bypass automatic control', () => {
    expect(
      isAutoControlActive({ ...base, winner: 'custom_position', bypassAutoControl: false }),
    ).toBe(true);
  });

  it('is false for a priority-100 safety custom_position winner even when bypass is not set', () => {
    // Defensive branch: a safety slot must suppress Auto even if the integration
    // failed to set bypass_auto_control on the trace.
    expect(
      isAutoControlActive({
        ...base,
        winner: 'custom_position',
        bypassAutoControl: false,
        safetyActive: true,
      }),
    ).toBe(false);
  });

  it('keeps the existing bypass path independent of the safety flag', () => {
    expect(
      isAutoControlActive({
        ...base,
        winner: 'custom_position',
        bypassAutoControl: true,
        safetyActive: false,
      }),
    ).toBe(false);
  });

  it('is false when the integration is disabled', () => {
    expect(isAutoControlActive({ ...base, winner: 'solar', integrationEnabled: false })).toBe(
      false,
    );
  });

  it('is false when automatic control is off', () => {
    expect(isAutoControlActive({ ...base, winner: 'solar', automaticControl: false })).toBe(false);
  });

  it('normalizes the raw winner string before applying the rules', () => {
    // A raw, space-separated winner label still flows through normalizeHandler;
    // it is not 'force' or 'custom_position', so Auto stays active.
    expect(isAutoControlActive({ ...base, winner: 'Cloud Suppression' })).toBe(true);
  });
});
