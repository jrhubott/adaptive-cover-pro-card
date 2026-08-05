import { describe, it, expect } from 'vitest';
import { railsAreOneCover } from '../src/lib/rail-model';
import type { DiscoveredEntities } from '../src/types';

function entry(cover_type: string, extra: Partial<DiscoveredEntities> = {}): DiscoveredEntities {
  return {
    entry_id: 'e1',
    entry_title: 'Entry',
    cover_type,
    entities: {},
    managed_covers: [],
    ...extra,
  } as DiscoveredEntities;
}

describe('railsAreOneCover', () => {
  it('is true for the cover types that bind several covers per opening', () => {
    expect(railsAreOneCover(entry('cover_day_night_shade'), 2)).toBe(true);
    expect(railsAreOneCover(entry('cover_dual_panel'), 2)).toBe(true);
  });

  it('is false for a type that takes one cover per window', () => {
    // Three blinds on one entry are three windows, not three layers.
    for (const t of ['cover_blind', 'cover_awning', 'cover_venetian', 'cover_tilt']) {
      expect(railsAreOneCover(entry(t), 3)).toBe(false);
    }
  });

  it('is false below two rails whatever the type', () => {
    // Nothing to tell apart, and bracketing a lone rail asserts something untrue
    // about it. Callers gate the whole treatment on this, so it must not need a
    // separate count check.
    expect(railsAreOneCover(entry('cover_day_night_shade'), 1)).toBe(false);
    expect(railsAreOneCover(entry('cover_day_night_shade'), 0)).toBe(false);
  });

  it("is false for a Cover Group regardless of the group's reported cover type", () => {
    // A group's members are always separate covers. Its `cover_type` is whatever
    // the first member reported and must not leak into this decision.
    expect(railsAreOneCover(entry('cover_day_night_shade', { is_group: true }), 3)).toBe(false);
  });

  it('is false for an unknown cover type rather than guessing', () => {
    expect(railsAreOneCover(entry('cover_something_new'), 2)).toBe(false);
  });
});
