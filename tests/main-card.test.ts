import { describe, it, expect } from 'vitest';
import '../src/adaptive-cover-pro-card';
import { AdaptiveCoverProCard } from '../src/adaptive-cover-pro-card';
import type { HomeAssistant } from 'custom-card-helpers';
import type { AdaptiveCoverProCardConfig } from '../src/types';
import type { EntityRegistryEntry } from '../src/lib/entity-registry';

interface CardLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  setConfig(config: AdaptiveCoverProCardConfig): void;
  _registry?: EntityRegistryEntry[] | null;
}

const ENTRY = 'entry_abc';

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
        },
      },
    },
    callWS: async () => [],
    connection: {
      subscribeEvents: async () => () => {},
    },
  } as unknown as HomeAssistant;
}

async function mountWithRegistry(config: AdaptiveCoverProCardConfig): Promise<CardLike> {
  const el = document.createElement('adaptive-cover-pro-card') as CardLike;
  el.hass = makeHass();
  el._registry = REGISTRY;
  el.setConfig(config);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('adaptive-cover-pro-card cover_colors (issue #132)', () => {
  it('forwards cover_colors to the embedded sky compass', async () => {
    const el = await mountWithRegistry({
      type: 'custom:adaptive-cover-pro-card',
      entry_id: ENTRY,
      cover_colors: ['#ff3366'],
    });
    interface CompassEl extends HTMLElement {
      coverColors?: unknown[];
    }
    const compass = el.shadowRoot!.querySelector('acp-sky-compass') as CompassEl;
    expect(compass).toBeTruthy();
    expect(compass.coverColors).toEqual(['#ff3366']);
  });

  it('passes an empty array when cover_colors is omitted', async () => {
    const el = await mountWithRegistry({
      type: 'custom:adaptive-cover-pro-card',
      entry_id: ENTRY,
    });
    interface CompassEl extends HTMLElement {
      coverColors?: unknown[];
    }
    const compass = el.shadowRoot!.querySelector('acp-sky-compass') as CompassEl;
    expect(compass).toBeTruthy();
    expect(compass.coverColors).toEqual([]);
  });

  it('forwards cover_colors to the embedded Sun Today elevation chart', async () => {
    // The standalone sky-compass card already wires this; the root card must too
    // so the override carries into the Sun Today chart, not just the compass.
    const el = await mountWithRegistry({
      type: 'custom:adaptive-cover-pro-card',
      entry_id: ENTRY,
      cover_colors: ['#ff3366'],
    });
    interface ChartEl extends HTMLElement {
      coverColors?: unknown[];
    }
    const chart = el.shadowRoot!.querySelector('acp-elevation-chart') as ChartEl;
    expect(chart).toBeTruthy();
    expect(chart.coverColors).toEqual(['#ff3366']);
  });
});

interface GridOptions {
  columns: number;
  rows: number | string;
  min_columns: number;
  max_columns: number;
}
interface GridCardLike extends CardLike {
  getGridOptions(): GridOptions;
}

describe('AdaptiveCoverProCard.getGridOptions', () => {
  it('spans the full section width and auto-sizes its height (issue #146)', () => {
    const card = document.createElement('adaptive-cover-pro-card') as GridCardLike;
    card.setConfig({ type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY });
    const opts = card.getGridOptions();
    expect(opts.columns).toBe(12);
    expect(opts.min_columns).toBe(6);
    expect(opts.max_columns).toBe(12);
    expect(opts.rows).toBe('auto');
  });

  it('stays auto-height regardless of the number of visible sections (issue #146)', () => {
    const oneSection = document.createElement('adaptive-cover-pro-card') as GridCardLike;
    oneSection.setConfig({
      type: 'custom:adaptive-cover-pro-card',
      entry_id: ENTRY,
      show_sections: ['covers'],
    });
    const allSections = document.createElement('adaptive-cover-pro-card') as GridCardLike;
    allSections.setConfig({
      type: 'custom:adaptive-cover-pro-card',
      entry_id: ENTRY,
      show_sections: ['sky', 'elevation', 'decision', 'covers', 'overrides', 'climate'],
    });
    expect(oneSection.getGridOptions().rows).toBe('auto');
    expect(allSections.getGridOptions().rows).toBe('auto');
  });
});

describe('header layout — long entry title', () => {
  it('renders the header with a title span', async () => {
    const el = await mountWithRegistry({
      type: 'custom:adaptive-cover-pro-card',
      entry_id: ENTRY,
    });
    const header = el.shadowRoot!.querySelector('.header');
    expect(header).toBeTruthy();
    const title = header!.querySelector('.title');
    expect(title).toBeTruthy();
  });

  it('header does not use align-items: center (which clips wrapped titles)', () => {
    // CSS layout overflow is not catchable by happy-dom, but we can assert that
    // the LitElement.styles CSSResult does not contain the clipping combination.
    const styles = (AdaptiveCoverProCard as unknown as { styles: { cssText: string } }).styles
      .cssText;
    expect(styles).toMatch(/\.header\s*\{[^}]*align-items:\s*flex-start/);
  });
});
