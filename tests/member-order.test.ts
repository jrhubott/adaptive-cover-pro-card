import { describe, it, expect } from 'vitest';

import { applyMemberOrder, hiddenMemberCovers, type RosterRow } from '../src/lib/group-roster';

const ROWS: RosterRow[] = [
  { entryId: 'entry_a', covers: ['cover.a1', 'cover.a2'] },
  { entryId: 'entry_b', covers: ['cover.b'] },
  { entryId: null, covers: ['cover.generic'] },
];
const ALL = ROWS.flatMap((r) => r.covers);

describe('hiddenMemberCovers', () => {
  it('hides nothing when the card has no members key', () => {
    expect(hiddenMemberCovers(ALL, undefined).size).toBe(0);
    expect(hiddenMemberCovers(ALL, []).size).toBe(0);
  });

  it('hides exactly the covers the key leaves out', () => {
    expect([...hiddenMemberCovers(ALL, ['cover.a1', 'cover.a2', 'cover.generic'])]).toEqual([
      'cover.b',
    ]);
  });

  /**
   * The #269-adjacent trap this whole namespace choice exists for.
   *
   * `members` used to hold roster ROW keys, which resolve to an owning entry_id
   * only while the cover's owner can be found — and HA strips an UNAVAILABLE
   * entity down to its basic attributes, so the owner scan returns null for
   * exactly the members a user is most likely to hide. Editor and card then
   * keyed the same row differently, the omission matched nothing, and every
   * member stayed visible with the roster count stuck at full size.
   */
  it('is immune to entry-vs-cover key drift, because it only speaks cover ids', () => {
    // An entry_id-shaped list matches no member at all.
    expect(hiddenMemberCovers(ALL, ['entry_a', 'entry_b']).size).toBe(0);
  });

  it('ignores a list that names no current member rather than hiding everything', () => {
    // A config written against the old row-key format, or aimed at another
    // group. Acting on it would blank the roster and zero every aggregate.
    expect(hiddenMemberCovers(ALL, ['cover.from_another_group']).size).toBe(0);
  });

  it('trusts a list that matches SOME members — that is just a departed member', () => {
    expect([...hiddenMemberCovers(ALL, ['cover.a1', 'cover.gone'])].sort()).toEqual([
      'cover.a2',
      'cover.b',
      'cover.generic',
    ]);
  });
});

describe('applyMemberOrder', () => {
  it('leaves the roster alone when unconfigured', () => {
    expect(applyMemberOrder(ROWS, undefined)).toBe(ROWS);
  });

  it('reorders rows by their earliest listed cover', () => {
    const out = applyMemberOrder(ROWS, ['cover.generic', 'cover.b', 'cover.a1', 'cover.a2']);
    expect(out.map((r) => r.entryId)).toEqual([null, 'entry_b', 'entry_a']);
  });

  it('drops a row whose covers are all hidden', () => {
    const out = applyMemberOrder(ROWS, ['cover.a1', 'cover.a2', 'cover.generic']);
    expect(out.map((r) => r.entryId)).toEqual(['entry_a', null]);
  });

  // Hiding one rail of a multi-cover entry trims that row rather than dropping
  // the whole entry. Not reachable from the editor, which hides whole rows, but
  // hand-written YAML can express it and it should mean something sane.
  it('trims a row to just its listed covers', () => {
    const out = applyMemberOrder(ROWS, ['cover.a2', 'cover.b']);
    expect(out[0]).toEqual({ entryId: 'entry_a', covers: ['cover.a2'] });
  });

  it('does not mutate the rows it was handed', () => {
    applyMemberOrder(ROWS, ['cover.a2']);
    expect(ROWS[0].covers).toEqual(['cover.a1', 'cover.a2']);
  });

  it('ignores an unrecognized list, matching hiddenMemberCovers', () => {
    // The two must agree or the roster and the aggregates disagree about who is
    // in the group.
    expect(applyMemberOrder(ROWS, ['entry_a', 'entry_b'])).toBe(ROWS);
  });
});
