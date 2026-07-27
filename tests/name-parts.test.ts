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

  it('returns an empty string verbatim rather than falling back (empty is not "absent")', () => {
    expect(resolveTileName('', makeDiscovered())).toBe('');
  });

  // Audit finding #1 (issue #247 fix pass): `null` is what a YAML `name:` with
  // no value parses to (the templated-dashboard empty-variable case) — must
  // fall back to the entry title exactly like `undefined`, matching pre-#247
  // `cfg.name ?? entry_title` (`null ?? x` is `x`).
  it('returns the discovered entry title when name is null', () => {
    const malformed = null as unknown as Parameters<typeof resolveTileName>[0];
    expect(resolveTileName(malformed, makeDiscovered())).toBe('Patio Right');
  });

  it('falls back to the entry title when the array is empty', () => {
    expect(resolveTileName([], makeDiscovered())).toBe('Patio Right');
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

  // Audit finding #1 (issue #247 fix pass): a scalar other than a string
  // (number, boolean, ...) that slips past `isValidAcpName` must stringify
  // verbatim, matching pre-#247 `cfg.name ?? entry_title` where `name: 2` was
  // a literal value — not fall back to the entry title.
  it('stringifies a non-string, non-array scalar rather than falling back', () => {
    const malformed = 42 as unknown as Parameters<typeof resolveTileName>[0];
    expect(resolveTileName(malformed, makeDiscovered())).toBe('42');
  });

  // `0` and `false` are the subtle cases: pre-#247 `0 ?? x` is `0`, so the old
  // code rendered the falsy-but-defined literal rather than falling back.
  it('stringifies name: 0 as "0" rather than falling back to the entry title', () => {
    const malformed = 0 as unknown as Parameters<typeof resolveTileName>[0];
    expect(resolveTileName(malformed, makeDiscovered())).toBe('0');
  });

  it('stringifies name: false as "false" rather than falling back to the entry title', () => {
    const malformed = false as unknown as Parameters<typeof resolveTileName>[0];
    expect(resolveTileName(malformed, makeDiscovered())).toBe('false');
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

  // Audit finding #1 (issue #247 fix pass): a YAML `name:` with no value
  // parses to `null`, exactly what a templated dashboard emits for an empty
  // variable. Pre-#247 `cfg.name ?? entry_title` treated it as "no override";
  // `setConfig` must not hard-error the tile for this.
  it('accepts null', () => {
    expect(isValidAcpName(null)).toBe(true);
  });

  it('accepts a plain string', () => {
    expect(isValidAcpName('Patio Right')).toBe(true);
  });

  it('accepts an empty string', () => {
    expect(isValidAcpName('')).toBe(true);
  });

  it('accepts a well-formed part array', () => {
    expect(isValidAcpName([{ type: 'area' }, { type: 'entry' }, { type: 'text', text: '–' }])).toBe(
      true,
    );
  });

  it('accepts an empty array', () => {
    expect(isValidAcpName([])).toBe(true);
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

  // Audit finding #1 (issue #247 fix pass): a non-string, non-array scalar
  // (number, boolean, ...) must be ACCEPTED — `name: 2` was a literal value
  // pre-#247 (`cfg.name ?? entry_title`), not a shape error. This replaces
  // the old "rejects a number" assertion, which encoded the over-reach the
  // audit flagged.
  it('accepts a number (matches the pre-#247 literal-value fallback)', () => {
    expect(isValidAcpName(42)).toBe(true);
  });

  it('accepts name: 0 (falsy but a valid literal, not "absent")', () => {
    expect(isValidAcpName(0)).toBe(true);
  });

  it('accepts name: false (falsy but a valid literal, not "absent")', () => {
    expect(isValidAcpName(false)).toBe(true);
  });
});
