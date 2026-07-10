import { describe, it, expect, vi } from 'vitest';
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

describe('main card show_decision_summary config (issue #173)', () => {
  it('sets showSummary to false on the strip when show_decision_summary: false', async () => {
    const el = await mountWithRegistry({
      type: 'custom:adaptive-cover-pro-card',
      entry_id: ENTRY,
      show_decision_summary: false,
    });
    interface StripEl extends HTMLElement {
      showSummary?: boolean;
    }
    const strip = el.shadowRoot!.querySelector('acp-decision-strip') as StripEl;
    expect(strip).toBeTruthy();
    expect(strip.showSummary).toBe(false);
  });

  it('keeps showSummary true when show_decision_summary is omitted', async () => {
    const el = await mountWithRegistry({
      type: 'custom:adaptive-cover-pro-card',
      entry_id: ENTRY,
    });
    interface StripEl extends HTMLElement {
      showSummary?: boolean;
    }
    const strip = el.shadowRoot!.querySelector('acp-decision-strip') as StripEl;
    expect(strip).toBeTruthy();
    expect(strip.showSummary).toBe(true);
  });
});

const GROUP_ENTRY = 'group_xyz';

const GROUP_REGISTRY: EntityRegistryEntry[] = [
  {
    entity_id: 'sensor.group_active_scene',
    unique_id: `${GROUP_ENTRY}_group_active_scene`,
    config_entry_id: GROUP_ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'sensor.group_position',
    unique_id: `${GROUP_ENTRY}_group_position`,
    config_entry_id: GROUP_ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'sensor.group_state',
    unique_id: `${GROUP_ENTRY}_group_state`,
    config_entry_id: GROUP_ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'sensor.group_who_won',
    unique_id: `${GROUP_ENTRY}_group_who_won`,
    config_entry_id: GROUP_ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'select.group_scene',
    unique_id: `${GROUP_ENTRY}_group_scene_select`,
    config_entry_id: GROUP_ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'switch.group_lock',
    unique_id: `${GROUP_ENTRY}_group_lock`,
    config_entry_id: GROUP_ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'switch.group_automation',
    unique_id: `${GROUP_ENTRY}_group_automation`,
    config_entry_id: GROUP_ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'button.group_clear_overrides',
    unique_id: `${GROUP_ENTRY}_group_clear_overrides`,
    config_entry_id: GROUP_ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
];

function makeGroupHass(): HomeAssistant {
  return {
    config: { latitude: 52.0, longitude: 4.0, time_zone: 'UTC' },
    states: {
      'sensor.group_active_scene': { state: 'all_open', attributes: {} },
      'sensor.group_position': {
        state: '50',
        attributes: { member_positions: { 'cover.a': 40, 'cover.b': 60 } },
      },
      'sensor.group_state': { state: 'mixed', attributes: {} },
      'sensor.group_who_won': {
        state: '1',
        attributes: { member_winners: { 'cover.a': 'group_lock' } },
      },
      'select.group_scene': {
        state: 'all_open',
        attributes: {
          options: ['auto', 'all_open', 'all_closed', 'privacy'],
          current_option: 'all_open',
        },
      },
      'switch.group_lock': { state: 'off', attributes: {} },
      'switch.group_automation': { state: 'on', attributes: {} },
      'button.group_clear_overrides': { state: 'unknown', attributes: {} },
    },
    callWS: async () => [],
    connection: { subscribeEvents: async () => () => {} },
  } as unknown as HomeAssistant;
}

async function mountGroup(config: AdaptiveCoverProCardConfig): Promise<CardLike> {
  const el = document.createElement('adaptive-cover-pro-card') as CardLike;
  el.hass = makeGroupHass();
  el._registry = GROUP_REGISTRY;
  el.setConfig(config);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('Cover Group routing (issue #185 Phase 3)', () => {
  it('renders the group view and NOT the cover sections for a group entry', async () => {
    const el = await mountGroup({
      type: 'custom:adaptive-cover-pro-card',
      entry_id: GROUP_ENTRY,
    });
    expect(el.shadowRoot!.querySelector('acp-group-view')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('acp-sky-compass')).toBeNull();
    expect(el.shadowRoot!.querySelector('acp-cover-bar')).toBeNull();
    expect(el.shadowRoot!.querySelector('acp-decision-strip')).toBeNull();
    expect(el.shadowRoot!.querySelector('acp-overrides-panel')).toBeNull();
  });

  it('forwards hass + discovered to the group view', async () => {
    const el = await mountGroup({
      type: 'custom:adaptive-cover-pro-card',
      entry_id: GROUP_ENTRY,
    });
    interface GroupViewEl extends HTMLElement {
      discovered?: { is_group?: boolean };
      hass?: HomeAssistant;
    }
    const view = el.shadowRoot!.querySelector('acp-group-view') as GroupViewEl;
    expect(view.discovered?.is_group).toBe(true);
    expect(view.hass).toBeTruthy();
  });

  it('still renders all cover sections for an ordinary cover entry (regression)', async () => {
    const el = await mountWithRegistry({
      type: 'custom:adaptive-cover-pro-card',
      entry_id: ENTRY,
    });
    expect(el.shadowRoot!.querySelector('acp-group-view')).toBeNull();
    expect(el.shadowRoot!.querySelector('acp-sky-compass')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('acp-cover-bar')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('acp-decision-strip')).toBeTruthy();
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

// Registry + hass fixture that additionally exposes the two header-pill switches,
// used only by the pill-guard test below (issue #200) so the base REGISTRY/makeHass
// fixtures used elsewhere in this file stay untouched.
const PILL_REGISTRY: EntityRegistryEntry[] = [
  ...REGISTRY,
  {
    entity_id: 'switch.integration_enabled',
    unique_id: `${ENTRY}_Integration Enabled`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'switch.automatic_control',
    unique_id: `${ENTRY}_Automatic Control`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
];

function makeHassWithPills(callService: (...args: unknown[]) => unknown): HomeAssistant {
  const base = makeHass();
  return {
    ...base,
    states: {
      ...base.states,
      'switch.integration_enabled': { state: 'on', attributes: {} },
      'switch.automatic_control': { state: 'on', attributes: {} },
    },
    callService,
  } as unknown as HomeAssistant;
}

async function mountWithPills(
  config: AdaptiveCoverProCardConfig,
  callService: (...args: unknown[]) => unknown,
): Promise<CardLike> {
  const el = document.createElement('adaptive-cover-pro-card') as CardLike;
  el.hass = makeHassWithPills(callService);
  el._registry = PILL_REGISTRY;
  el.setConfig(config);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('Full card more-info dialog (issue #200)', () => {
  it('opens the more-info dialog when the header identity is tapped', async () => {
    const el = await mountWithRegistry({
      type: 'custom:adaptive-cover-pro-card',
      entry_id: ENTRY,
    });
    const headerInfo = el.shadowRoot!.querySelector('.header .header-info') as HTMLElement | null;
    expect(headerInfo).toBeTruthy();
    headerInfo!.click();
    await el.updateComplete;
    const dialog = el.shadowRoot!.querySelector('acp-more-info-dialog') as
      | (HTMLElement & { open?: boolean })
      | null;
    expect(dialog).toBeTruthy();
    expect(dialog!.open).toBe(true);
  });

  it('does not open the dialog when a header pill is toggled', async () => {
    const callService = vi.fn();
    const el = await mountWithPills(
      { type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY },
      callService,
    );
    const pill = el.shadowRoot!.querySelector('.header acp-header-pill') as HTMLElement | null;
    expect(pill).toBeTruthy();
    (pill!.shadowRoot!.querySelector('button') as HTMLElement).click();
    await el.updateComplete;
    // Regression guard: the pill's own toggle behavior must still fire.
    expect(callService).toHaveBeenCalled();
    const dialog = el.shadowRoot!.querySelector('acp-more-info-dialog') as
      | (HTMLElement & { open?: boolean })
      | null;
    expect(dialog?.open).not.toBe(true);
  });

  it('does not open the dialog on a body/cover-section click', async () => {
    const el = await mountWithRegistry({
      type: 'custom:adaptive-cover-pro-card',
      entry_id: ENTRY,
    });
    const body = el.shadowRoot!.querySelector('.body') as HTMLElement | null;
    expect(body).toBeTruthy();
    body!.click();
    await el.updateComplete;
    const dialog = el.shadowRoot!.querySelector('acp-more-info-dialog') as
      | (HTMLElement & { open?: boolean })
      | null;
    expect(dialog?.open).not.toBe(true);
  });
});
