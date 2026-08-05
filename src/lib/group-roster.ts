import { resolveCoverEntryId, type HassLike } from './entity-suggestion';
import type { EntityRegistryEntry } from './entity-registry';

/**
 * One row of a Cover Group roster.
 *
 * The integration's `member_positions` is keyed by COVER, and a roster built
 * straight from those keys renders one row per cover — so an ACP entry driving
 * three covers contributed three rows that were, by construction, three views of
 * the same entry: same title, same badges, same decision, same ↑■↓ target. The
 * only thing that actually differed between them was which rail moved.
 *
 * Grouping by owning entry says the true thing instead: one row per entry,
 * carrying that entry's own covers as its rails — which is exactly what the
 * cover tile already renders for a multi-cover entry on a dashboard. Five covers
 * across two entries become two rows of three and two rails.
 *
 * A generic (non-ACP) cover has no entry to fold into and keeps its own row, so
 * an adopted cover is never silently merged with anything.
 */
export interface RosterRow {
  /** Owning ACP config entry, or null for a generic cover. */
  entryId: string | null;
  /** The group's member covers this row represents, in roster order. NEVER the
   *  entry's full managed list: an entry can manage covers the group does not
   *  adopt, and a row must not draw a rail for a cover the group cannot drive. */
  covers: string[];
}

/**
 * Fold member cover ids into one row per owning ACP entry.
 *
 * Order is the roster's own: a row takes the position of the FIRST of its covers
 * to appear, so the list stays stable as members are added and never reshuffles
 * because an entry gained a cover.
 *
 * `resolve` is injected so this stays pure and unit-testable — the live caller
 * passes {@link buildRoster}'s registry-backed lookup, and a test passes a map.
 * A null result (generic cover, or a registry too cold to resolve yet) always
 * gets its own row; folding unresolved covers together would merge unrelated
 * covers into one row for as long as the cache stayed cold.
 */
export function rosterRows(
  memberIds: string[],
  resolve: (coverId: string) => string | null,
): RosterRow[] {
  const rows: RosterRow[] = [];
  const byEntry = new Map<string, RosterRow>();
  for (const id of memberIds) {
    const entryId = resolve(id);
    if (!entryId) {
      rows.push({ entryId: null, covers: [id] });
      continue;
    }
    const existing = byEntry.get(entryId);
    if (existing) {
      existing.covers.push(id);
      continue;
    }
    const row: RosterRow = { entryId, covers: [id] };
    byEntry.set(entryId, row);
    rows.push(row);
  }
  return rows;
}

/**
 * Cover id → the entry it last resolved to, remembered across renders.
 *
 * `resolveCoverEntryId` finds the owner by scanning `hass.states` for a state
 * carrying `actual_positions`. HA strips an `unavailable` entity down to its
 * basic attributes, so during an ACP entry reload or an HA restart that scan
 * returns null for every one of that entry's covers — and a roster rebuilt from
 * those nulls flips from "2 entry rows" to "5 generic rows", changing every
 * `repeat()` key, tearing down and rebuilding every nested tile card, and
 * writing `member_names` under the wrong keys if the user renames a row while it
 * is in that state.
 *
 * So a resolution is never *downgraded* to null: once a cover is known to belong
 * to an entry, it keeps that entry until it resolves to a DIFFERENT one. This is
 * the same rule `group-member-row.ts` already applies to its own `_entryId`
 * ("never clear a resolved entry on a transient miss"), which moving the lookup
 * up to the parent had quietly discarded.
 *
 * Module-scoped on purpose: the dialog and the main-card view render the same
 * group, and a miss in one must not undo what the other already learned.
 */
const stickyEntryFor = new Map<string, string>();

/** Test seam — the sticky map outlives any one component by design. */
export function _resetRosterStickiness(): void {
  stickyEntryFor.clear();
}

/**
 * {@link rosterRows} against the live registry, with sticky resolution.
 */
export function buildRoster(
  hass: HassLike,
  memberIds: string[],
  registryOverride?: EntityRegistryEntry[],
): RosterRow[] {
  return rosterRows(memberIds, (id) => {
    const resolved = resolveCoverEntryId(hass, id, registryOverride);
    if (resolved) {
      stickyEntryFor.set(id, resolved);
      return resolved;
    }
    return stickyEntryFor.get(id) ?? null;
  });
}

/**
 * A memoized {@link buildRoster} for one component.
 *
 * The scan is O(entities) PER MEMBER, and the group surfaces deliberately have
 * no `shouldUpdate` gate, so an ungated call re-scanned the whole state machine
 * once per member per hass tick — on a 3000-entity install, five 3000-entry
 * walks a second inside the render path. (An earlier memo lived inside
 * `buildRoster` itself and could never hit: it was rebuilt per call, and its
 * keys came from `Object.keys()` and were already unique.)
 *
 * Re-resolves when the roster membership changes or the registry is replaced,
 * which are the only two things that can change an answer.
 */
export function createRosterMemo(): (
  hass: HassLike,
  memberIds: string[],
  registry?: EntityRegistryEntry[],
) => RosterRow[] {
  let lastKey: string | null = null;
  let lastRegistry: EntityRegistryEntry[] | undefined | null = null;
  let cached: RosterRow[] = [];
  return (hass, memberIds, registry) => {
    const key = memberIds.join('|');
    if (lastKey === key && lastRegistry === registry && cached.length > 0) return cached;
    lastKey = key;
    lastRegistry = registry;
    cached = buildRoster(hass, memberIds, registry);
    return cached;
  };
}

/** Stable identity for a roster row, for `repeat()` keying. Two rows can never
 *  share a key: entry rows are keyed by entry, generic rows by their cover. */
export function rosterRowKey(row: RosterRow): string {
  return row.entryId ?? `generic:${row.covers[0]}`;
}

/**
 * The key a row is looked up under in the card's `member_names` map.
 *
 * Deliberately NOT {@link rosterRowKey}: this one ends up in the user's YAML, so
 * it drops that function's `generic:` disambiguator and uses the bare cover
 * entity_id instead. The two namespaces cannot collide anyway — an ACP entry_id
 * is a hex string and a generic member's id always starts with `cover.` — so the
 * prefix bought nothing here and made the config ugly to hand-edit.
 */
export function rosterRowConfigKey(row: RosterRow): string {
  return row.entryId ?? row.covers[0];
}
