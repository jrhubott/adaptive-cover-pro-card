import type { HomeAssistant } from 'custom-card-helpers';

/**
 * True when any of the given entities changed between two `hass` snapshots.
 *
 * Home Assistant pushes a fresh `hass` object on every state change anywhere in the
 * instance, but preserves the **object identity** of each individual `states[entity_id]`
 * entry that did not change. Comparing those references is the canonical, cheap way for
 * a card to skip re-rendering on ticks that touched only unrelated entities.
 *
 * `undefined` ids are skipped, so callers can pass optional discovered entity ids
 * directly without filtering. A missing `oldHass` (first update) counts as changed.
 */
export function entityStateChanged(
  oldHass: HomeAssistant | undefined,
  newHass: HomeAssistant,
  ids: Array<string | undefined>,
): boolean {
  if (!oldHass) return true;
  for (const id of ids) {
    if (id && oldHass.states[id] !== newHass.states[id]) return true;
  }
  return false;
}
