import { describe, it, expect, vi } from 'vitest';
import '../src/components/cover-bar';
import { INTEGRATION_DOMAIN } from '../src/const';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';

interface CoverBarLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  discovered?: DiscoveredEntities;
}

const baseDiscovered: DiscoveredEntities = {
  entry_id: 'entry1',
  entry_title: 'Test',
  cover_type: 'cover_blind',
  entities: {},
  managed_covers: [],
};

describe('acp-cover-bar track-click → set_position', () => {
  it('calls adaptive_cover_pro.set_position when the track is clicked', async () => {
    const callService = vi.fn();
    const el = document.createElement('acp-cover-bar') as CoverBarLike;
    document.body.appendChild(el);

    el.hass = {
      states: {
        'sensor.cover_position': {
          state: '40',
          attributes: {
            actual_positions: { 'cover.left': 40 },
          },
        },
        'cover.left': {
          state: 'open',
          attributes: { friendly_name: 'Left' },
        },
      },
      callService,
    } as unknown as HomeAssistant;

    el.discovered = {
      ...baseDiscovered,
      entities: { target_position_sensor: 'sensor.cover_position' },
    };

    await el.updateComplete;

    const track = el.shadowRoot!.querySelector('.track') as HTMLElement;
    // Simulate a click at 50% of the track.
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100, top: 0, bottom: 10, right: 100, height: 10 }),
      configurable: true,
    });
    track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 50 }));

    expect(callService).toHaveBeenCalledWith(INTEGRATION_DOMAIN, 'set_position', {
      entity_id: 'cover.left',
      position: 50,
    });
  });
});
