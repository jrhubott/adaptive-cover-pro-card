import { describe, it, expect } from 'vitest';
import { memberBadgeWinners } from '../src/lib/badge-visibility';
import { hasMemberOverrides } from '../src/lib/group-controls';

describe('memberBadgeWinners', () => {
  it('surfaces a member held under a manual override', () => {
    expect(memberBadgeWinners({ 'cover.backyard': 'solar', 'cover.side_yard': 'manual' })).toEqual([
      'manual',
    ]);
  });

  it('drops the group handlers — the N/M badge already says that', () => {
    expect(memberBadgeWinners({ 'cover.a': 'group_scene', 'cover.b': 'group_lock' })).toEqual([]);
  });

  it('drops routine automation so a normal group stays quiet', () => {
    expect(memberBadgeWinners({ 'cover.a': 'solar', 'cover.b': 'default' })).toEqual([]);
  });

  // Occupancy timeout is per-cover context, carried by the member's own tile.
  it('drops the occupancy badge — a group has no occupancy of its own', () => {
    expect(memberBadgeWinners({ 'cover.a': 'motion' })).toEqual([]);
    // ...but a genuine exception alongside it still surfaces.
    expect(memberBadgeWinners({ 'cover.a': 'motion', 'cover.b': 'manual' })).toEqual(['manual']);
  });

  it('de-duplicates and orders by HANDLER_ORDER, not roster order', () => {
    // `weather` outranks `manual` in HANDLER_ORDER, so it leads regardless of
    // which member the map happens to list first.
    expect(
      memberBadgeWinners({
        'cover.a': 'manual',
        'cover.b': 'weather',
        'cover.c': 'manual',
      }),
    ).toEqual(['weather', 'manual']);
  });

  it('ignores null winners and unknown handler names', () => {
    expect(memberBadgeWinners({ 'cover.a': null, 'cover.b': 'not_a_handler' })).toEqual([]);
  });

  it('is empty when the who-won sensor has no attribute', () => {
    expect(memberBadgeWinners(undefined)).toEqual([]);
  });
});

describe('hasMemberOverrides', () => {
  it('is true when a member is won by its manual override', () => {
    expect(hasMemberOverrides({ 'cover.a': 'solar', 'cover.b': 'manual' })).toBe(true);
  });

  it('is false only when every winner proves no override exists', () => {
    // solar/climate sit BELOW manual, so a manual override would have won.
    expect(hasMemberOverrides({ 'cover.a': 'solar', 'cover.b': 'climate' })).toBe(false);
  });

  // The regression this rule exists for: a locked group reports `group_lock` for
  // every member, which says nothing about overrides held underneath — and
  // clearing them before unlocking is exactly when the button is needed.
  it('stays true when a higher-priority handler could be masking an override', () => {
    expect(hasMemberOverrides({ 'cover.a': 'solar', 'cover.b': 'group_lock' })).toBe(true);
    expect(hasMemberOverrides({ 'cover.a': 'weather' })).toBe(true);
    expect(hasMemberOverrides({ 'cover.a': 'force' })).toBe(true);
  });

  it('stays true for a member with no winner at all', () => {
    expect(hasMemberOverrides({ 'cover.a': null })).toBe(true);
  });

  it('is false for an empty roster', () => {
    expect(hasMemberOverrides({})).toBe(false);
  });

  // Unknown data must not disable a button whose service would still do work.
  it('stays true when the attribute is missing entirely', () => {
    expect(hasMemberOverrides(undefined)).toBe(true);
  });
});
