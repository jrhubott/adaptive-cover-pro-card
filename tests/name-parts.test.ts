import { describe, it, expect } from 'vitest';
import { resolveTileName, isValidAcpName } from '../src/lib/name-parts';
import type { DiscoveredEntities } from '../src/types';

function makeDiscovered(overrides: Partial<DiscoveredEntities> = {}): DiscoveredEntities {
  return {
    entry_id: 'entry_xyz',
    entry_title: 'Patio Right',
    cover_type: 'cover_blind',
    entities: {},
    managed_covers: ['cover.left'],
    ...overrides,
  };
}

describe('resolveTileName', () => {
  it('returns the discovered entry title when name is undefined', () => {
    expect(resolveTileName(undefined, makeDiscovered())).toBe('Patio Right');
  });

  it('returns a plain string verbatim', () => {
    expect(resolveTileName('Centre Gauche', makeDiscovered())).toBe('Centre Gauche');
  });

  it('composes area + entry parts, joined with a single space', () => {
    const discovered = makeDiscovered({ area_name: 'Living Room' });
    expect(resolveTileName([{ type: 'area' }, { type: 'entry' }], discovered)).toBe(
      'Living Room Patio Right',
    );
  });

  it('falls back to the entry title when every part resolves empty', () => {
    const discovered = makeDiscovered({ area_name: undefined });
    expect(resolveTileName([{ type: 'area' }], discovered)).toBe('Patio Right');
  });

  it('renders a literal text part verbatim', () => {
    expect(resolveTileName([{ type: 'text', text: 'Custom' }], makeDiscovered())).toBe('Custom');
  });

  // Audit finding #2 (issue #247 fix pass): a bare object — the natural typo
  // from omitting the `- ` in a YAML list (`name: {type: area}` instead of
  // `name: [{type: area}]`) — must degrade to the entry title, not throw
  // "name.map is not a function" and blank the whole tile.
  it('degrades to the entry title when name is a bare object rather than an array', () => {
    const malformed = { type: 'area' } as unknown as Parameters<typeof resolveTileName>[0];
    expect(resolveTileName(malformed, makeDiscovered())).toBe('Patio Right');
  });

  it('degrades to the entry title when name is neither undefined, a string, nor an array', () => {
    const malformed = 42 as unknown as Parameters<typeof resolveTileName>[0];
    expect(resolveTileName(malformed, makeDiscovered())).toBe('Patio Right');
  });

  // A `[null]` entry — another plausible YAML typo — must be skipped, not throw
  // on `part.type` of a null part.
  it('skips a null entry inside the array rather than throwing', () => {
    const nameWithNull = [null, { type: 'text', text: 'Custom' }] as unknown as Parameters<
      typeof resolveTileName
    >[0];
    expect(resolveTileName(nameWithNull, makeDiscovered())).toBe('Custom');
  });

  it('falls back to the entry title when the array is only null entries', () => {
    const nameWithNull = [null] as unknown as Parameters<typeof resolveTileName>[0];
    expect(resolveTileName(nameWithNull, makeDiscovered())).toBe('Patio Right');
  });
});

describe('isValidAcpName', () => {
  it('accepts undefined', () => {
    expect(isValidAcpName(undefined)).toBe(true);
  });

  it('accepts a plain string', () => {
    expect(isValidAcpName('Patio Right')).toBe(true);
  });

  it('accepts a well-formed part array', () => {
    expect(isValidAcpName([{ type: 'area' }, { type: 'entry' }, { type: 'text', text: '–' }])).toBe(
      true,
    );
  });

  it('rejects a bare object (the missing `- ` YAML typo)', () => {
    expect(isValidAcpName({ type: 'area' })).toBe(false);
  });

  it('rejects an array containing null', () => {
    expect(isValidAcpName([null])).toBe(false);
  });

  it('rejects an array containing an unrecognized part type', () => {
    expect(isValidAcpName([{ type: 'bogus' }])).toBe(false);
  });

  it('rejects a text part missing its text string', () => {
    expect(isValidAcpName([{ type: 'text' }])).toBe(false);
  });

  it('rejects a number', () => {
    expect(isValidAcpName(42)).toBe(false);
  });
});
