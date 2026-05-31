import { describe, it, expect } from 'vitest';
import '../src/components/elevation-chart';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities, SunPositionAttributes } from '../src/types';

interface ChartLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  discovered?: DiscoveredEntities;
  compact?: boolean;
}

const discovered: DiscoveredEntities = {
  entry_id: 'entry1',
  entry_title: 'Test',
  cover_type: 'cover_blind',
  entities: { sun_sensor: 'sensor.sun_position' },
  managed_covers: [],
};

function hass(attrs: Partial<SunPositionAttributes>): HomeAssistant {
  return {
    config: { latitude: 52.0, longitude: 4.0, time_zone: 'UTC' },
    states: {
      'sensor.sun_position': {
        state: '30',
        attributes: {
          elevation: 30,
          gamma: 0,
          window_azimuth: 180,
          fov_left: 90,
          fov_right: 90,
          azimuth_min: 90,
          azimuth_max: 270,
          in_fov: true,
          ...attrs,
        },
      },
    },
  } as unknown as HomeAssistant;
}

async function mount(props: Partial<ChartLike>): Promise<ChartLike> {
  const el = document.createElement('acp-elevation-chart') as ChartLike;
  Object.assign(el, props);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('acp-elevation-chart: elevation limits', () => {
  it('draws two limit lines when both min_elevation and max_elevation are set', async () => {
    const el = await mount({
      hass: hass({ min_elevation: 10, max_elevation: 60 }),
      discovered,
    });
    const lines = el.shadowRoot!.querySelectorAll('line.limit-line');
    expect(lines.length).toBe(2);
  });

  it('draws no limit lines when neither limit is set', async () => {
    const el = await mount({ hass: hass({}), discovered });
    const lines = el.shadowRoot!.querySelectorAll('line.limit-line');
    expect(lines.length).toBe(0);
  });

  it('draws one limit line when only min_elevation is set', async () => {
    const el = await mount({ hass: hass({ min_elevation: 10 }), discovered });
    const lines = el.shadowRoot!.querySelectorAll('line.limit-line');
    expect(lines.length).toBe(1);
  });

  it('clips the FOV band y-extent to the elevation band when limits are present', async () => {
    // With min=10, max=60 on the -10..90 axis, the band occupies a strip
    // strictly inside the full plot height — so the rect y > PAD_T and the
    // height is less than the full plot height.
    const clipped = await mount({
      hass: hass({ min_elevation: 10, max_elevation: 60 }),
      discovered,
    });
    const full = await mount({ hass: hass({}), discovered });

    const clippedRect = clipped.shadowRoot!.querySelector('rect.fov-band');
    const fullRect = full.shadowRoot!.querySelector('rect.fov-band');
    expect(clippedRect).toBeTruthy();
    expect(fullRect).toBeTruthy();

    const clippedY = parseFloat(clippedRect!.getAttribute('y')!);
    const clippedH = parseFloat(clippedRect!.getAttribute('height')!);
    const fullY = parseFloat(fullRect!.getAttribute('y')!);
    const fullH = parseFloat(fullRect!.getAttribute('height')!);

    // Clipped band starts lower down (larger y) and is shorter than full-height.
    expect(clippedY).toBeGreaterThan(fullY);
    expect(clippedH).toBeLessThan(fullH);
  });

  it('renders full-height FOV bands (unchanged) when no limits are set', async () => {
    const el = await mount({ hass: hass({}), discovered });
    const rect = el.shadowRoot!.querySelector('rect.fov-band');
    expect(rect).toBeTruthy();
    // PAD_T = 10, VIEWBOX_H = 160, PAD_B = 22 → full height = 128, y = 10.
    expect(parseFloat(rect!.getAttribute('y')!)).toBeCloseTo(10);
    expect(parseFloat(rect!.getAttribute('height')!)).toBeCloseTo(128);
  });
});
