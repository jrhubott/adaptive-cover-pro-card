import { describe, it, expect } from 'vitest';
import '../src/adaptive-cover-pro-solar-chart-card';
import { AdaptiveCoverProSolarChartCard } from '../src/adaptive-cover-pro-solar-chart-card';
// Vite/Vitest raw import: load the card source as text so the reuse-guard
// assertions below can grep it (mirrors the decision-card reuse guard).
import solarChartCardSource from '../src/adaptive-cover-pro-solar-chart-card.ts?raw';
import type { HomeAssistant } from 'custom-card-helpers';
import type { SolarChartCardConfig } from '../src/types';
import type { EntityRegistryEntry } from '../src/lib/entity-registry';

interface CardLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  setConfig(config: SolarChartCardConfig): void;
  _registry?: EntityRegistryEntry[] | null;
}

function makeCard(): CardLike {
  return document.createElement('adaptive-cover-pro-solar-chart-card') as CardLike;
}

const ENTRY = 'entry_abc';
const ENTRY_2 = 'entry_def';

const REGISTRY: EntityRegistryEntry[] = [
  {
    entity_id: 'sensor.cover_position',
    unique_id: `${ENTRY}_Cover_Position`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'sensor.sun_position',
    unique_id: `${ENTRY}_sun_position`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'sensor.cover_position_2',
    unique_id: `${ENTRY_2}_Cover_Position`,
    config_entry_id: ENTRY_2,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'sensor.sun_position_2',
    unique_id: `${ENTRY_2}_sun_position`,
    config_entry_id: ENTRY_2,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
];

function makeHass(): HomeAssistant {
  return {
    config: { latitude: 52.0, longitude: 4.0, time_zone: 'UTC' },
    states: {
      'sensor.cover_position': {
        state: '40',
        attributes: { actual_positions: { 'cover.living': 40 } },
      },
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
          min_elevation: 10,
          max_elevation: 60,
        },
      },
      'sensor.cover_position_2': {
        state: '40',
        attributes: { actual_positions: { 'cover.office': 40 } },
      },
      'sensor.sun_position_2': {
        state: '30',
        attributes: {
          elevation: 30,
          gamma: 0,
          window_azimuth: 270,
          fov_left: 90,
          fov_right: 90,
          azimuth_min: 180,
          azimuth_max: 360,
          in_fov: true,
        },
      },
    },
    callWS: async () => [],
    connection: {
      subscribeEvents: async () => () => {},
    },
  } as unknown as HomeAssistant;
}

async function mountWithRegistry(config: SolarChartCardConfig): Promise<CardLike> {
  const el = makeCard();
  el.hass = makeHass();
  el._registry = REGISTRY;
  el.setConfig(config);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('adaptive-cover-pro-solar-chart-card setConfig', () => {
  it('throws when entry_ids is missing', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({ type: 'custom:adaptive-cover-pro-solar-chart-card' } as SolarChartCardConfig),
    ).toThrow(/entry_ids/);
  });

  it('throws when entry_ids is empty', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: 'custom:adaptive-cover-pro-solar-chart-card',
        entry_ids: [],
      }),
    ).toThrow(/entry_ids/);
  });

  it('throws when entry_ids contains a non-string', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: 'custom:adaptive-cover-pro-solar-chart-card',
        entry_ids: [123 as unknown as string],
      }),
    ).toThrow();
  });

  it('throws when entry_ids contains an empty string', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: 'custom:adaptive-cover-pro-solar-chart-card',
        entry_ids: [''],
      }),
    ).toThrow();
  });

  it('accepts a valid single-entry config', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: 'custom:adaptive-cover-pro-solar-chart-card',
        entry_ids: ['abc'],
      }),
    ).not.toThrow();
  });

  it('accepts a valid multi-entry config', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: 'custom:adaptive-cover-pro-solar-chart-card',
        entry_ids: ['abc', 'def'],
        compact: true,
      }),
    ).not.toThrow();
  });

  it('accepts cover_colors array alongside entry_ids', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: 'custom:adaptive-cover-pro-solar-chart-card',
        entry_ids: ['a', 'b'],
        cover_colors: ['#ff3366', null],
      }),
    ).not.toThrow();
  });

  it('accepts cover_colors shorter than entry_ids', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: 'custom:adaptive-cover-pro-solar-chart-card',
        entry_ids: ['a', 'b', 'c'],
        cover_colors: ['#ff3366'],
      }),
    ).not.toThrow();
  });

  it('defensively copies entry_ids so callers can mutate their input', () => {
    const el = makeCard();
    const input = ['a', 'b'];
    el.setConfig({
      type: 'custom:adaptive-cover-pro-solar-chart-card',
      entry_ids: input,
    });
    input.push('c');
    expect(input.length).toBe(3);
  });
});

describe('adaptive-cover-pro-solar-chart-card render', () => {
  it('renders exactly one acp-elevation-chart', async () => {
    const el = await mountWithRegistry({
      type: 'custom:adaptive-cover-pro-solar-chart-card',
      entry_ids: [ENTRY],
    });
    const charts = el.shadowRoot!.querySelectorAll('acp-elevation-chart');
    expect(charts.length).toBe(1);
  });

  it('never renders acp-sky-compass', async () => {
    const el = await mountWithRegistry({
      type: 'custom:adaptive-cover-pro-solar-chart-card',
      entry_ids: [ENTRY],
    });
    expect(el.shadowRoot!.querySelector('acp-sky-compass')).toBeNull();
  });

  it('forwards the full discovered list and cover_colors to the elevation chart', async () => {
    const el = await mountWithRegistry({
      type: 'custom:adaptive-cover-pro-solar-chart-card',
      entry_ids: [ENTRY, ENTRY_2],
      cover_colors: ['#ff7043', '#7e57c2'],
    });
    interface ChartEl extends HTMLElement {
      discoveredList?: unknown[];
      coverColors?: unknown[];
    }
    const chart = el.shadowRoot!.querySelector('acp-elevation-chart') as ChartEl;
    expect(chart).toBeTruthy();
    expect(chart.discoveredList?.length).toBe(2);
    expect(chart.coverColors).toEqual(['#ff7043', '#7e57c2']);
  });

  it('renders a card-header when title is set', async () => {
    const el = await mountWithRegistry({
      type: 'custom:adaptive-cover-pro-solar-chart-card',
      entry_ids: [ENTRY],
      title: 'Sun today',
    });
    const header = el.shadowRoot!.querySelector('.card-header');
    expect(header).toBeTruthy();
    expect(header!.textContent).toContain('Sun today');
  });

  it('renders no card-header when title is omitted', async () => {
    const el = await mountWithRegistry({
      type: 'custom:adaptive-cover-pro-solar-chart-card',
      entry_ids: [ENTRY],
    });
    expect(el.shadowRoot!.querySelector('.card-header')).toBeNull();
  });
});

interface GridOptions {
  columns: number;
  rows: number | string;
  min_columns: number;
  max_columns: number;
}
interface GridSolarChartLike extends CardLike {
  getGridOptions(): GridOptions;
}

describe('adaptive-cover-pro-solar-chart-card getGridOptions', () => {
  it('spans the full section width and auto-sizes its height (issue #146 pattern)', () => {
    const card = makeCard() as GridSolarChartLike;
    card.setConfig({ type: 'custom:adaptive-cover-pro-solar-chart-card', entry_ids: [ENTRY] });
    const opts = card.getGridOptions();
    expect(opts.columns).toBe(12);
    expect(opts.min_columns).toBe(6);
    expect(opts.max_columns).toBe(12);
    expect(opts.rows).toBe('auto');
  });
});

describe('adaptive-cover-pro-solar-chart-card reuse guard', () => {
  it('imports the shared elevation-chart component and never the sky-compass component', () => {
    expect(solarChartCardSource).toMatch(/import\s+['"]\.\/components\/elevation-chart['"]/);
    expect(solarChartCardSource).not.toMatch(/import\s+['"]\.\/components\/sky-compass['"]/);
    expect(solarChartCardSource).not.toMatch(/<acp-sky-compass/);
  });
});

describe('adaptive-cover-pro-solar-chart-card class export', () => {
  it('exports the card class', () => {
    expect(AdaptiveCoverProSolarChartCard).toBeTruthy();
  });
});
