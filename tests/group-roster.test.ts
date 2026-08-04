import { describe, it, expect } from 'vitest';
import { rosterRows, rosterRowKey, rosterRowConfigKey } from '../src/lib/group-roster';

/** Resolver stub: a plain map, plus null for anything unlisted (a generic
 *  cover, or a registry too cold to answer yet). */
const resolver =
  (map: Record<string, string>) =>
  (id: string): string | null =>
    map[id] ?? null;

describe('rosterRows', () => {
  it('folds each entry into ONE row carrying its covers', () => {
    // The reported install: five covers, two entries. Five rows were five views
    // of two entries, identical but for which rail moved.
    const rows = rosterRows(
      ['cover.fl', 'cover.fc', 'cover.fr', 'cover.sl', 'cover.sr'],
      resolver({
        'cover.fl': 'front',
        'cover.fc': 'front',
        'cover.fr': 'front',
        'cover.sl': 'side',
        'cover.sr': 'side',
      }),
    );
    expect(rows).toEqual([
      { entryId: 'front', covers: ['cover.fl', 'cover.fc', 'cover.fr'] },
      { entryId: 'side', covers: ['cover.sl', 'cover.sr'] },
    ]);
  });

  it('places a row where its FIRST cover appeared', () => {
    // Order follows the roster, so gaining a cover never reshuffles the list.
    const rows = rosterRows(
      ['cover.a', 'cover.b', 'cover.a2'],
      resolver({ 'cover.a': 'e1', 'cover.a2': 'e1', 'cover.b': 'e2' }),
    );
    expect(rows.map((r) => r.entryId)).toEqual(['e1', 'e2']);
    expect(rows[0].covers).toEqual(['cover.a', 'cover.a2']);
  });

  it('gives every unresolved cover its own row', () => {
    // A generic adopted cover has no entry to fold into, and folding unresolved
    // covers together would merge unrelated ones for as long as a cache stayed
    // cold.
    const rows = rosterRows(['cover.g1', 'cover.g2'], resolver({}));
    expect(rows).toEqual([
      { entryId: null, covers: ['cover.g1'] },
      { entryId: null, covers: ['cover.g2'] },
    ]);
  });

  it('mixes entry rows and generic rows in roster order', () => {
    const rows = rosterRows(
      ['cover.a', 'cover.generic', 'cover.a2'],
      resolver({ 'cover.a': 'e1', 'cover.a2': 'e1' }),
    );
    expect(rows).toEqual([
      { entryId: 'e1', covers: ['cover.a', 'cover.a2'] },
      { entryId: null, covers: ['cover.generic'] },
    ]);
  });

  it('returns nothing for an empty roster', () => {
    expect(rosterRows([], resolver({}))).toEqual([]);
  });
});

describe('roster row keys', () => {
  it('cannot collide between an entry row and a generic row', () => {
    const entryRow = { entryId: 'e1', covers: ['cover.a'] };
    const genericRow = { entryId: null, covers: ['cover.a'] };
    expect(rosterRowKey(entryRow)).not.toBe(rosterRowKey(genericRow));
  });

  it('uses a bare cover id in config, dropping the repeat() disambiguator', () => {
    // The config key lands in the user's YAML. An entry_id is hex and a cover id
    // starts with `cover.`, so the `generic:` prefix bought nothing there.
    expect(rosterRowConfigKey({ entryId: 'e1', covers: ['cover.a'] })).toBe('e1');
    expect(rosterRowConfigKey({ entryId: null, covers: ['cover.a'] })).toBe('cover.a');
    expect(rosterRowKey({ entryId: null, covers: ['cover.a'] })).toBe('generic:cover.a');
  });
});
