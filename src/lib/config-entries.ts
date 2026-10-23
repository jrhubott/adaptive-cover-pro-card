import type { HomeAssistant } from 'custom-card-helpers';
import { INTEGRATION_DOMAIN } from '../const';
import { loadEntityRegistry } from './registry-store';

export interface AcpConfigEntry {
  entry_id: string;
  title: string;
}

interface RawConfigEntry {
  entry_id: string;
  title: string;
  domain: string;
  state?: string;
}

/**
 * Fetch the list of Adaptive Cover Pro config entries via websocket.
 *
 * Used by the card editor to populate the `entry_id` dropdown. The request is
 * paired with `domain: 'adaptive_cover_pro'` to keep the payload small, with
 * a client-side domain filter as defense in depth — some older HA versions
 * ignore the `domain` filter on `config_entries/get`.
 *
 * Additionally filters to entries that own at least one entity with
 * `platform === 'adaptive_cover_pro'` in the entity registry. This excludes
 * "building profile" config entries (introduced in integration 2.30) that
 * share the same domain but provision no cover entities.
 *
 * The registry half of the lookup is served from `registry-store.ts`'s shared
 * process-wide cache (`loadEntityRegistry`) rather than a raw fetch, so the
 * six `getStubConfig` callers and six card-editor dropdowns that all call this
 * function no longer each pay their own full `config/entity_registry/list`
 * round trip. The store keeps itself fresh via its own `entity_registry_updated`
 * subscription, so this stays correct even before any ACP card is mounted.
 */
export async function fetchAcpConfigEntries(hass: HomeAssistant): Promise<AcpConfigEntry[]> {
  const [entries, registry] = await Promise.all([
    hass.callWS<RawConfigEntry[]>({
      type: 'config_entries/get',
      domain: INTEGRATION_DOMAIN,
    }),
    loadEntityRegistry(hass),
  ]);
  const coverProfileIds = new Set(
    registry
      .filter((e) => e.platform === INTEGRATION_DOMAIN && e.config_entry_id != null)
      .map((e) => e.config_entry_id as string),
  );
  return entries
    .filter((e) => e.domain === INTEGRATION_DOMAIN && coverProfileIds.has(e.entry_id))
    .map((e) => ({ entry_id: e.entry_id, title: e.title }));
}
