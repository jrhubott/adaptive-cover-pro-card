import type { AcpNamePart, DiscoveredEntities } from '../types';

/**
 * Resolve a tile card's `name` config into its display title (issue #247).
 *
 * - `undefined`/`null` → the discovered entry title (today's existing
 *   fallback). A YAML `name:` with no value parses to `null` — exactly what
 *   a templated dashboard emits for an empty variable — and pre-#247
 *   `cfg.name ?? entry_title` already treated it as "no override" (`null ?? x`
 *   is `x`), so this stays a fallback rather than a hard error (audit finding
 *   #1, issue #247 fix pass).
 * - a plain string → used verbatim, unchanged from pre-#247 behavior (this
 *   is the byte-identical backward-compatibility path — even an empty
 *   string is returned as-is, exactly like the old `cfg.name ?? entry_title`).
 * - any other scalar (number, boolean, ...) → stringified verbatim via
 *   `String(name)`. Pre-#247 `cfg.name ?? entry_title` rendered these as
 *   literal values too (`name: 0` produced `"0"`, not the entry title —
 *   `0 ?? x` is `0`), so `isValidAcpName` accepts them and this degrades to
 *   matching output rather than throwing (audit finding #1).
 * - an {@link AcpNamePart} array → each part is resolved, empty-resolving
 *   parts are dropped, and the rest are joined with a single space. If every
 *   part resolves empty, falls back to the discovered entry title (the tile
 *   must never render a blank title).
 * - a bare (non-array) object → also falls back to the entry title. This is
 *   the malformed-YAML case (the missing `- ` YAML-list typo, e.g.
 *   `name: {type: area}`) that `setConfig`'s `isValidAcpName` rejects up
 *   front with a readable error, but this helper degrades defensively
 *   regardless — the tile must never render blank.
 */
export function resolveTileName(
  name: string | AcpNamePart[] | undefined,
  discovered: DiscoveredEntities,
): string {
  if (name === undefined || name === null) return discovered.entry_title;
  if (typeof name === 'string') return name;
  if (Array.isArray(name)) {
    const parts = name.map((part) => resolvePart(part, discovered)).filter((p): p is string => !!p);
    return parts.length > 0 ? parts.join(' ') : discovered.entry_title;
  }
  if (typeof name === 'object') return discovered.entry_title;
  return String(name);
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
 * findings #1 and #2) — called from `setConfig` so a malformed shape throws a
 * readable error immediately rather than silently blanking the tile at render
 * time, while still tolerating everything the pre-#247 config shape
 * (`cfg.name ?? entry_title`) tolerated:
 *
 * - `null`/`undefined` and any other non-string, non-array scalar (number,
 *   boolean, ...) are ACCEPTED. A YAML `name:` with no value parses to
 *   `null` — the templated-dashboard empty-variable case — and `name: 2`/
 *   `name: false` were literal values pre-#247, not shape errors. Rejecting
 *   these hard-errored configs that rendered fine before (audit finding #1).
 *   `resolveTileName` renders them (falling back to the entry title for
 *   `null`/`undefined`, stringifying any other scalar).
 * - a bare (non-array) object is REJECTED — most commonly the missing `- `
 *   YAML-list typo, `name: {type: area}` instead of `name: [{type: area}]`.
 *   This is the actual typo the check was added for (audit finding #2).
 * - an array is valid only if every entry is a well-formed {@link AcpNamePart}
 *   (a stray `null`/unrecognized part type throws).
 *
 * `resolveTileName` still degrades defensively on its own for anything that
 * slips past this check, but this is the up-front check that gives the user
 * an actual message for the typo case.
 */
export function isValidAcpName(name: unknown): name is string | AcpNamePart[] | undefined {
  if (name == null || typeof name === 'string') return true;
  if (Array.isArray(name)) return name.every(isValidAcpNamePart);
  // A bare object — the missing `- ` YAML-list typo — is the one shape this
  // check actually exists to reject.
  if (typeof name === 'object') return false;
  // Any other scalar (number, boolean, ...) matches pre-#247 literal-value
  // behavior; see the block comment above.
  return true;
}

function isValidAcpNamePart(part: unknown): part is AcpNamePart {
  if (!part || typeof part !== 'object') return false;
  const type = (part as { type?: unknown }).type;
  if (type === 'entry' || type === 'area') return true;
  if (type === 'text') return typeof (part as { text?: unknown }).text === 'string';
  return false;
}
