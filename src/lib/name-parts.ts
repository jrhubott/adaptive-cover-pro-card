import type { AcpNamePart, DiscoveredEntities } from '../types';

/**
 * Resolve a tile card's `name` config into its display title (issue #247).
 *
 * - `undefined` → the discovered entry title (today's existing fallback).
 * - a plain string → used verbatim, unchanged from pre-#247 behavior (this
 *   is the byte-identical backward-compatibility path — even an empty
 *   string is returned as-is, exactly like the old `cfg.name ?? entry_title`).
 * - an {@link AcpNamePart} array → each part is resolved, empty-resolving
 *   parts are dropped, and the rest are joined with a single space. If every
 *   part resolves empty, falls back to the discovered entry title (the tile
 *   must never render a blank title).
 */
export function resolveTileName(
  name: string | AcpNamePart[] | undefined,
  discovered: DiscoveredEntities,
): string {
  if (name === undefined) return discovered.entry_title;
  if (typeof name === 'string') return name;
  // Guard against malformed YAML — a bare object (the natural typo from
  // omitting the `- ` in a YAML list, e.g. `name: {type: area}`) or any other
  // non-array value has no `.map`. `setConfig` (adaptive-cover-pro-tile-card.ts)
  // validates this shape up front via `isValidAcpName` so a user gets a
  // readable error, but this helper must degrade rather than throw
  // regardless — the tile must never render blank.
  if (!Array.isArray(name)) return discovered.entry_title;
  const parts = name.map((part) => resolvePart(part, discovered)).filter((p): p is string => !!p);
  return parts.length > 0 ? parts.join(' ') : discovered.entry_title;
}

function resolvePart(part: AcpNamePart, discovered: DiscoveredEntities): string | undefined {
  // A `[null]`/non-object entry in the array (also a plausible YAML typo) is
  // skipped rather than throwing on `part.type`.
  if (!part || typeof part !== 'object') return undefined;
  switch (part.type) {
    case 'entry':
      return discovered.entry_title || undefined;
    case 'area':
      return discovered.area_name || undefined;
    case 'text':
      return part.text || undefined;
    default:
      return undefined;
  }
}

/**
 * Validate a config's raw `name` value before it's accepted (issue #247 audit
 * finding #2) — called from `setConfig` so a malformed shape (most commonly
 * the missing `- ` YAML-list typo, `name: {type: area}` instead of
 * `name: [{type: area}]`, or a stray `null`/unrecognized part) throws a
 * readable error immediately rather than silently blanking the tile at
 * render time. `resolveTileName` still degrades defensively on its own (it
 * has no way to reject bad input, only render around it), but this is the
 * up-front check that gives the user an actual message.
 */
export function isValidAcpName(name: unknown): name is string | AcpNamePart[] | undefined {
  if (name === undefined || typeof name === 'string') return true;
  if (!Array.isArray(name)) return false;
  return name.every(isValidAcpNamePart);
}

function isValidAcpNamePart(part: unknown): part is AcpNamePart {
  if (!part || typeof part !== 'object') return false;
  const type = (part as { type?: unknown }).type;
  if (type === 'entry' || type === 'area') return true;
  if (type === 'text') return typeof (part as { text?: unknown }).text === 'string';
  return false;
}
