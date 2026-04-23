import { describe, it, expect } from 'vitest';
import '../src/components/sky-compass';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';

interface SkyCompassLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  discovered?: DiscoveredEntities;
}

const baseDiscovered: DiscoveredEntities = {
  entry_id: 'entry1',
  entry_title: 'Test',
  cover_type: 'cover_blind',
  entities: { sun_sensor: 'sensor.sun_pos' },
  managed_covers: [],
};

const baseHass = {
  states: {
    'sensor.sun_pos': {
      state: '180',
      attributes: {
        elevation: 30,
        gamma: 0,
        window_azimuth: 180,
        fov_left: 45,
        fov_right: 45,
        azimuth_min: 135,
        azimuth_max: 225,
        in_fov: true,
        blind_spot_range: null,
      },
    },
  },
  config: {
    latitude: 47.6,
    longitude: -122.3,
  },
} as unknown as HomeAssistant;

async function mountCompass(): Promise<SkyCompassLike> {
  const el = document.createElement('acp-sky-compass') as SkyCompassLike;
  document.body.appendChild(el);
  el.hass = baseHass;
  el.discovered = baseDiscovered;
  await el.updateComplete;
  return el;
}

describe('acp-sky-compass legend', () => {
  it('legend contains a "Window normal" entry', async () => {
    const el = await mountCompass();
    expect(el.shadowRoot!.textContent).toContain('Window normal');
  });
});
