import type { HomeAssistant } from 'custom-card-helpers';
import { INTEGRATION_DOMAIN } from '../const';

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
 * a client-side filter as defense in depth — some older HA versions ignore
 * the `domain` filter on `config_entries/get`.
 */
export async function fetchAcpConfigEntries(hass: HomeAssistant): Promise<AcpConfigEntry[]> {
  const entries = await hass.callWS<RawConfigEntry[]>({
    type: 'config_entries/get',
    domain: INTEGRATION_DOMAIN,
  });
  return entries
    .filter((e) => e.domain === INTEGRATION_DOMAIN)
    .map((e) => ({ entry_id: e.entry_id, title: e.title }));
}
