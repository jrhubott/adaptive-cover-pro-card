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
  const parts = name.map((part) => resolvePart(part, discovered)).filter((p): p is string => !!p);
  return parts.length > 0 ? parts.join(' ') : discovered.entry_title;
}

function resolvePart(part: AcpNamePart, discovered: DiscoveredEntities): string | undefined {
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
