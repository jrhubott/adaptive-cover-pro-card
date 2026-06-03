import { describe, it, expect } from 'vitest';
import '../src/components/elevation-chart';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities, SunPositionAttributes } from '../src/types';

interface ChartLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  discoveredList?: DiscoveredEntities[];
  coverColors?: (string | null | undefined)[];
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
      discoveredList: [discovered],
    });
    const lines = el.shadowRoot!.querySelectorAll('line.limit-line');
    expect(lines.length).toBe(2);
  });

  it('draws no limit lines when neither limit is set', async () => {
    const el = await mount({ hass: hass({}), discoveredList: [discovered] });
    const lines = el.shadowRoot!.querySelectorAll('line.limit-line');
    expect(lines.length).toBe(0);
  });

  it('draws one limit line when only min_elevation is set', async () => {
    const el = await mount({ hass: hass({ min_elevation: 10 }), discoveredList: [discovered] });
    const lines = el.shadowRoot!.querySelectorAll('line.limit-line');
    expect(lines.length).toBe(1);
  });

  it('clips the FOV band y-extent to the elevation band when limits are present', async () => {
    // With min=10, max=60 on the -10..90 axis, the band occupies a strip
    // strictly inside the full plot height — so the rect y > PAD_T and the
    // height is less than the full plot height.
    const clipped = await mount({
      hass: hass({ min_elevation: 10, max_elevation: 60 }),
      discoveredList: [discovered],
    });
    const full = await mount({ hass: hass({}), discoveredList: [discovered] });

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
    const el = await mount({ hass: hass({}), discoveredList: [discovered] });
    const rect = el.shadowRoot!.querySelector('rect.fov-band');
    expect(rect).toBeTruthy();
    // PAD_T = 10, VIEWBOX_H = 160, PAD_B = 22 → full height = 128, y = 10.
    expect(parseFloat(rect!.getAttribute('y')!)).toBeCloseTo(10);
    expect(parseFloat(rect!.getAttribute('height')!)).toBeCloseTo(128);
  });

  it('keeps legacy gold fill (no inline style) for a single window', async () => {
    const el = await mount({ hass: hass({}), discoveredList: [discovered] });
    const rect = el.shadowRoot!.querySelector('rect.fov-band');
    expect(rect).toBeTruthy();
    // Single-window cards leave fill to the CSS gold — no inline fill override.
    const style = rect!.getAttribute('style') ?? '';
    expect(style).not.toMatch(/fill\s*:/);
  });
});

const discoveredSouth: DiscoveredEntities = {
  entry_id: 'south',
  entry_title: 'Living Room',
  cover_type: 'cover_blind',
  entities: { sun_sensor: 'sensor.sun_south' },
  managed_covers: [],
};
const discoveredWest: DiscoveredEntities = {
  entry_id: 'west',
  entry_title: 'Office',
  cover_type: 'cover_blind',
  entities: { sun_sensor: 'sensor.sun_west' },
  managed_covers: [],
};

function sunState(attrs: Partial<SunPositionAttributes>) {
  return {
    state: '30',
    attributes: {
      elevation: 30,
      gamma: 0,
      fov_left: 90,
      fov_right: 90,
      in_fov: true,
      ...attrs,
    },
  };
}

function multiHass(
  south: Partial<SunPositionAttributes>,
  west: Partial<SunPositionAttributes>,
): HomeAssistant {
  return {
    config: { latitude: 52.0, longitude: 4.0, time_zone: 'UTC' },
    states: {
      'sensor.sun_south': sunState({ window_azimuth: 180, ...south }),
      'sensor.sun_west': sunState({ window_azimuth: 270, ...west }),
    },
  } as unknown as HomeAssistant;
}

describe('acp-elevation-chart: multi-window', () => {
  it('renders a color-keyed band per window with inline fills', async () => {
    const el = await mount({
      hass: multiHass({}, {}),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const rects = Array.from(el.shadowRoot!.querySelectorAll('rect.fov-band'));
    expect(rects.length).toBeGreaterThanOrEqual(2);
    const fills = rects.map((r) => r.getAttribute('style') ?? '');
    expect(fills.some((s) => s.includes('#ff7043'))).toBe(true);
    expect(fills.some((s) => s.includes('#7e57c2'))).toBe(true);
  });

  it('stacks windows into disjoint lanes in normal mode', async () => {
    const el = await mount({
      hass: multiHass({}, {}),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const rects = Array.from(el.shadowRoot!.querySelectorAll('rect.fov-band'));
    // Group each rect's y-range by its inline color.
    const ranges = (fill: string) =>
      rects
        .filter((r) => (r.getAttribute('style') ?? '').includes(fill))
        .map((r) => {
          const y = parseFloat(r.getAttribute('y')!);
          const h = parseFloat(r.getAttribute('height')!);
          return { top: y, bottom: y + h };
        });
    const south = ranges('#ff7043');
    const west = ranges('#7e57c2');
    expect(south.length).toBeGreaterThan(0);
    expect(west.length).toBeGreaterThan(0);
    const southBottom = Math.max(...south.map((r) => r.bottom));
    const westTop = Math.min(...west.map((r) => r.top));
    // Lanes are vertically disjoint: window 0's lane sits entirely above
    // window 1's lane.
    expect(southBottom).toBeLessThanOrEqual(westTop + 0.01);
  });

  it('overlaps windows on the full-height strip in compact mode', async () => {
    const el = await mount({
      hass: multiHass({}, {}),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
      compact: true,
    });
    const rects = Array.from(el.shadowRoot!.querySelectorAll('rect.fov-band'));
    const tops = rects.map((r) => parseFloat(r.getAttribute('y')!));
    const bottoms = rects.map(
      (r) => parseFloat(r.getAttribute('y')!) + parseFloat(r.getAttribute('height')!),
    );
    // Every band shares the same full-height strip (no lane offset).
    expect(Math.max(...tops) - Math.min(...tops)).toBeCloseTo(0);
    expect(Math.max(...bottoms) - Math.min(...bottoms)).toBeCloseTo(0);
    // PAD_T = 10, plotBottom = 138.
    expect(Math.min(...tops)).toBeCloseTo(10);
    expect(Math.max(...bottoms)).toBeCloseTo(138);
  });

  it('clips a window to its own elevation limits within its lane', async () => {
    const el = await mount({
      hass: multiHass({ min_elevation: 10, max_elevation: 60 }, {}),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const rects = Array.from(el.shadowRoot!.querySelectorAll('rect.fov-band'));
    const heightFor = (fill: string) =>
      rects
        .filter((r) => (r.getAttribute('style') ?? '').includes(fill))
        .map((r) => parseFloat(r.getAttribute('height')!));
    // Lane height for 2 windows on a 128-tall strip = 64.
    const laneH = 64;
    const southH = heightFor('#ff7043');
    const westH = heightFor('#7e57c2');
    expect(southH.length).toBeGreaterThan(0);
    expect(westH.length).toBeGreaterThan(0);
    // Window 0 (limited) is shorter than its lane; window 1 (no limits) fills it.
    expect(Math.max(...southH)).toBeLessThan(laneH);
    expect(Math.max(...westH)).toBeCloseTo(laneH);
  });

  it('lists each window title in the head', async () => {
    const el = await mount({
      hass: multiHass({}, {}),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const head = el.shadowRoot!.querySelector('.head')!;
    const text = head.textContent ?? '';
    expect(text).toContain('Living Room');
    expect(text).toContain('Office');
  });
});
