import { describe, it, expect } from 'vitest';
import '../src/components/elevation-chart';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities, SunPositionAttributes } from '../src/types';

const VIEWBOX_H = 160;
const PAD_B = 22;

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

function svgViewBoxHeight(el: ChartLike): number {
  const svg = el.shadowRoot!.querySelector('svg')!;
  const vb = svg.getAttribute('viewBox')!.split(/\s+/).map(Number);
  return vb[3];
}

describe('acp-elevation-chart: single-window (legacy, unchanged)', () => {
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
    const style = rect!.getAttribute('style') ?? '';
    expect(style).not.toMatch(/fill\s*:/);
  });

  it('renders NO ribbon bars or tracks for a single window', async () => {
    const el = await mount({ hass: hass({}), discoveredList: [discovered] });
    expect(el.shadowRoot!.querySelectorAll('rect.ribbon-bar').length).toBe(0);
    expect(el.shadowRoot!.querySelectorAll('rect.ribbon-track').length).toBe(0);
  });

  it('keeps viewBox height 160 and no inline aspect-ratio for a single window', async () => {
    const el = await mount({ hass: hass({}), discoveredList: [discovered] });
    expect(svgViewBoxHeight(el)).toBe(160);
    const style = el.shadowRoot!.querySelector('svg')!.getAttribute('style') ?? '';
    expect(style).not.toMatch(/aspect-ratio/);
  });

  it('now-cursor y2 ends at the plot bottom for a single window', async () => {
    const el = await mount({ hass: hass({}), discoveredList: [discovered] });
    const now = el.shadowRoot!.querySelector('line.now')!;
    expect(parseFloat(now.getAttribute('y2')!)).toBeCloseTo(VIEWBOX_H - PAD_B);
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
const discoveredEast: DiscoveredEntities = {
  entry_id: 'east',
  entry_title: 'Bedroom',
  cover_type: 'cover_blind',
  entities: { sun_sensor: 'sensor.sun_east' },
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

function multiHass(states: Record<string, Partial<SunPositionAttributes>>): HomeAssistant {
  const built: Record<string, unknown> = {};
  for (const [id, attrs] of Object.entries(states)) {
    built[id] = sunState(attrs);
  }
  return {
    config: { latitude: 52.0, longitude: 4.0, time_zone: 'UTC' },
    states: built,
  } as unknown as HomeAssistant;
}

function twoWindowHass(): HomeAssistant {
  return multiHass({
    'sensor.sun_south': { window_azimuth: 180 },
    'sensor.sun_west': { window_azimuth: 270 },
  });
}

function ribbonRanges(el: ChartLike, fill: string) {
  return Array.from(el.shadowRoot!.querySelectorAll('rect.ribbon-bar'))
    .filter((r) => (r.getAttribute('style') ?? '').includes(fill))
    .map((r) => {
      const y = parseFloat(r.getAttribute('y')!);
      const h = parseFloat(r.getAttribute('height')!);
      return { top: y, bottom: y + h };
    });
}

describe('acp-elevation-chart: multi-window ribbon', () => {
  it('renders a ribbon (bars) and NO in-plot fov-band rects', async () => {
    const el = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const bars = el.shadowRoot!.querySelectorAll('rect.ribbon-bar');
    expect(bars.length).toBeGreaterThanOrEqual(2);
    // No per-window in-plot bands in multi mode.
    expect(el.shadowRoot!.querySelectorAll('rect.fov-band').length).toBe(0);
  });

  it('color-keys each window bar with an inline fill', async () => {
    const el = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const fills = Array.from(el.shadowRoot!.querySelectorAll('rect.ribbon-bar')).map(
      (r) => r.getAttribute('style') ?? '',
    );
    expect(fills.some((s) => s.includes('#ff7043'))).toBe(true);
    expect(fills.some((s) => s.includes('#7e57c2'))).toBe(true);
  });

  it('draws no per-window limit-lines in the plot for multi-window', async () => {
    const el = await mount({
      hass: multiHass({
        'sensor.sun_south': { window_azimuth: 180, min_elevation: 10, max_elevation: 60 },
        'sensor.sun_west': { window_azimuth: 270 },
      }),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    expect(el.shadowRoot!.querySelectorAll('line.limit-line').length).toBe(0);
  });

  it('renders a background track per window even when it has no FOV runs today', async () => {
    const el = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    expect(el.shadowRoot!.querySelectorAll('rect.ribbon-track').length).toBe(2);
  });

  it('gives each ribbon bar a <title> tooltip with the window name and FOV time range', async () => {
    const el = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const bars = el.shadowRoot!.querySelectorAll('rect.ribbon-bar');
    expect(bars.length).toBeGreaterThan(0);
    const titles = Array.from(bars).map((b) => b.querySelector('title')?.textContent ?? '');
    // Every bar carries a tooltip; at least one names a window with a → range.
    expect(titles.every((tx) => tx.length > 0)).toBe(true);
    expect(titles.some((tx) => tx.includes('Living Room') && tx.includes('→'))).toBe(true);
    expect(titles.some((tx) => tx.includes('Office') && tx.includes('→'))).toBe(true);
  });

  it('labels each ribbon track with its window name for empty-row identification', async () => {
    const el = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const trackTitles = Array.from(el.shadowRoot!.querySelectorAll('rect.ribbon-track')).map(
      (r) => r.querySelector('title')?.textContent ?? '',
    );
    expect(trackTitles.some((tx) => tx.includes('Living Room'))).toBe(true);
    expect(trackTitles.some((tx) => tx.includes('Office'))).toBe(true);
  });

  it('stacks window rows disjoint and ordered, all below the plot block', async () => {
    const el = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const south = ribbonRanges(el, '#ff7043');
    const west = ribbonRanges(el, '#7e57c2');
    expect(south.length).toBeGreaterThan(0);
    expect(west.length).toBeGreaterThan(0);
    const southBottom = Math.max(...south.map((r) => r.bottom));
    const westTop = Math.min(...west.map((r) => r.top));
    // Window 0 sits in a higher row than window 1 (non-overlapping y-ranges).
    expect(southBottom).toBeLessThanOrEqual(westTop + 0.01);
    // All ribbon bars live below the plot block.
    const allTops = [...south, ...west].map((r) => r.top);
    expect(Math.min(...allTops)).toBeGreaterThanOrEqual(VIEWBOX_H);
  });

  it('grows the viewBox height with window count and sets inline aspect-ratio', async () => {
    const two = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const three = await mount({
      hass: multiHass({
        'sensor.sun_south': { window_azimuth: 180 },
        'sensor.sun_west': { window_azimuth: 270 },
        'sensor.sun_east': { window_azimuth: 90 },
      }),
      discoveredList: [discoveredSouth, discoveredWest, discoveredEast],
      coverColors: ['#ff7043', '#7e57c2', '#26a69a'],
    });
    expect(svgViewBoxHeight(two)).toBeGreaterThan(160);
    expect(svgViewBoxHeight(three)).toBeGreaterThan(svgViewBoxHeight(two));
    const style = two.shadowRoot!.querySelector('svg')!.getAttribute('style') ?? '';
    expect(style).toMatch(/aspect-ratio/);
  });

  it('extends the now-cursor through the ribbon in multi mode', async () => {
    const el = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const now = el.shadowRoot!.querySelector('line.now')!;
    expect(parseFloat(now.getAttribute('y2')!)).toBeGreaterThan(VIEWBOX_H - PAD_B);
  });

  it('renders NO per-window legend in the head (the compass legend covers it)', async () => {
    const el = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const head = el.shadowRoot!.querySelector('.head')!;
    // No swatch list and no per-window names duplicated from the compass legend.
    expect(head.querySelector('.fov-list')).toBeNull();
    expect(head.querySelector('.swatch')).toBeNull();
    expect(head.textContent ?? '').not.toContain('Living Room');
    expect(head.textContent ?? '').not.toContain('Office');
  });

  it('keeps the viewBox tight to the ribbon (no dead space below the last row)', async () => {
    const el = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const height = svgViewBoxHeight(el);
    // The lowest ribbon element (track) bottom must sit just above the viewBox
    // floor — a regression guard against double-counting VIEWBOX_H, which left
    // ~160 units of empty space (and an over-long now-cursor) below the ribbon.
    const trackBottoms = Array.from(el.shadowRoot!.querySelectorAll('rect.ribbon-track')).map(
      (r) => parseFloat(r.getAttribute('y')!) + parseFloat(r.getAttribute('height')!),
    );
    const lowest = Math.max(...trackBottoms);
    expect(height - lowest).toBeLessThanOrEqual(8);
    // The now-cursor ends at the ribbon floor, not far below it.
    const now = el.shadowRoot!.querySelector('line.now')!;
    const y2 = parseFloat(now.getAttribute('y2')!);
    expect(y2).toBeGreaterThan(VIEWBOX_H - PAD_B);
    expect(y2).toBeLessThanOrEqual(height);
    expect(Math.abs(y2 - lowest)).toBeLessThanOrEqual(8);
  });
});
