import { describe, it, expect, vi } from 'vitest';
import '../src/adaptive-cover-pro-tile-card';
import '../src/adaptive-cover-pro-tile-card-editor';
import type { HomeAssistant } from 'custom-card-helpers';
import type { AdaptiveCoverProTileCardConfig } from '../src/types';
import type { EntityRegistryEntry } from '../src/lib/entity-registry';

const TYPE = 'custom:adaptive-cover-pro-tile-card';
const ENTRY = 'entry_abc';

interface EditorLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  setConfig(config: AdaptiveCoverProTileCardConfig): void;
  _entries: { entry_id: string; title: string }[] | null;
  _registry: EntityRegistryEntry[] | null;
}

const REGISTRY: EntityRegistryEntry[] = [
  {
    entity_id: 'sensor.cover_position',
    unique_id: `${ENTRY}_Cover_Position`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
];

function makeEditor(): EditorLike {
  const el = document.createElement('adaptive-cover-pro-tile-card-editor') as EditorLike;
  el.hass = {
    states: {
      'sensor.cover_position': {
        state: '42',
        attributes: { actual_positions: { 'cover.left': 40, 'cover.right': 45 } },
      },
    },
    callWS: vi.fn().mockResolvedValue([]),
    connection: { subscribeEvents: vi.fn().mockResolvedValue(() => {}) },
  } as unknown as HomeAssistant;
  return el;
}

describe('adaptive-cover-pro-tile-card editor — getConfigElement', () => {
  it('exposes a getConfigElement that returns the editor element', async () => {
    const { AdaptiveCoverProTileCard } = await import('../src/adaptive-cover-pro-tile-card');
    const el = await AdaptiveCoverProTileCard.getConfigElement();
    expect(el.tagName.toLowerCase()).toBe('adaptive-cover-pro-tile-card-editor');
  });
});

describe('adaptive-cover-pro-tile-card editor — setConfig', () => {
  it('accepts a partial config without throwing', () => {
    const el = makeEditor();
    expect(() => el.setConfig({ type: TYPE, entry_id: '' })).not.toThrow();
  });

  it('accepts a full config without throwing', () => {
    const el = makeEditor();
    expect(() =>
      el.setConfig({
        type: TYPE,
        entry_id: ENTRY,
        name: 'Kitchen',
        icon: 'mdi:blinds-horizontal',
        cover: 'cover.left',
        show_position: true,
        show_decision_summary: true,
        show_controls: false,
        show_badge: false,
        tap_action: { action: 'more-info' },
        hold_action: { action: 'none' },
        double_tap_action: { action: 'toggle' },
      }),
    ).not.toThrow();
  });
});

describe('adaptive-cover-pro-tile-card editor — value-changed', () => {
  it('dispatches config-changed when ha-form fires value-changed', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    let emitted: AdaptiveCoverProTileCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement;
    expect(haForm).toBeTruthy();
    haForm.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: {
          value: {
            type: TYPE,
            entry_id: ENTRY,
            name: 'Renamed',
            show_controls: false,
          },
        },
      }),
    );

    expect(emitted).not.toBeNull();
    expect(emitted!.name).toBe('Renamed');
    expect(emitted!.show_controls).toBe(false);
    expect(emitted!.entry_id).toBe(ENTRY);
  });

  it('preserves existing config keys not present in the value-changed payload', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({
      type: TYPE,
      entry_id: ENTRY,
      icon: 'mdi:original',
      show_badge: false,
    });
    document.body.appendChild(el);
    await el.updateComplete;

    let emitted: AdaptiveCoverProTileCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement;
    haForm.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: { value: { type: TYPE, entry_id: ENTRY, name: 'New name' } },
      }),
    );

    expect(emitted!.icon).toBe('mdi:original');
    expect(emitted!.show_badge).toBe(false);
    expect(emitted!.name).toBe('New name');
  });
});

describe('adaptive-cover-pro-tile-card editor — badge opt-in', () => {
  it('maps nested config.badges down to flat badge_* fields for the form data', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY, badges: { motion: false } });
    document.body.appendChild(el);
    await el.updateComplete;

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement & {
      data?: Record<string, unknown>;
    };
    expect(haForm.data!.badge_motion).toBe(false);
    // Omitted kinds default to on.
    expect(haForm.data!.badge_solar).toBe(true);
  });

  it('reassembles a nested badges object on emit when one badge is toggled off', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    let emitted: AdaptiveCoverProTileCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement;
    haForm.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: {
          value: { type: TYPE, entry_id: ENTRY, badge_motion: false, badge_solar: true },
        },
      }),
    );

    expect(emitted).not.toBeNull();
    expect(emitted!.badges).toEqual({ motion: false });
    // The flat keys must not leak into the emitted config.
    expect((emitted as unknown as Record<string, unknown>).badge_motion).toBeUndefined();
    expect((emitted as unknown as Record<string, unknown>).badge_solar).toBeUndefined();
  });

  it('prunes the badges object entirely when all eight badges are on', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY, badges: { motion: false } });
    document.body.appendChild(el);
    await el.updateComplete;

    let emitted: AdaptiveCoverProTileCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement;
    haForm.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: {
          value: {
            type: TYPE,
            entry_id: ENTRY,
            badge_solar: true,
            badge_force: true,
            badge_weather: true,
            badge_manual: true,
            badge_custom_position: true,
            badge_motion: true,
            badge_climate: true,
            badge_glare_zone: true,
          },
        },
      }),
    );

    expect(emitted).not.toBeNull();
    expect((emitted as unknown as Record<string, unknown>).badges).toBeUndefined();
  });
});

describe('adaptive-cover-pro-tile-card editor — default layout (issue #110)', () => {
  it('defaults the layout form field to detailed', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement & {
      data?: Record<string, unknown>;
    };
    expect(haForm.data!.layout).toBe('detailed');
  });

  it('retains an explicitly chosen layout:one-line on emit (survives serialization)', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    // _config does NOT have layout — the user is picking one-line for the first time.
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    let emitted: AdaptiveCoverProTileCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement;
    haForm.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: { value: { type: TYPE, entry_id: ENTRY, layout: 'one-line' } },
      }),
    );

    expect(emitted).not.toBeNull();
    expect(emitted!.layout).toBe('one-line');
  });

  it('prunes layout:detailed from the emitted config (it equals the default)', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    // _config does NOT have layout — detailed equals the default and must be pruned.
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    let emitted: AdaptiveCoverProTileCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement;
    haForm.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: { value: { type: TYPE, entry_id: ENTRY, layout: 'detailed' } },
      }),
    );

    expect(emitted).not.toBeNull();
    expect((emitted as unknown as Record<string, unknown>).layout).toBeUndefined();
  });
});

describe('adaptive-cover-pro-tile-card editor — show_elevation_chart', () => {
  it('includes a show_elevation_chart boolean field in the schema', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement & {
      schema?: Array<{ name: string; selector?: Record<string, unknown> }>;
    };
    const field = (haForm.schema ?? []).find((s) => s.name === 'show_elevation_chart');
    expect(field).toBeTruthy();
    expect(field!.selector).toEqual({ boolean: {} });
  });

  it('defaults show_elevation_chart to true in the form data', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement & {
      data?: Record<string, unknown>;
    };
    expect(haForm.data!.show_elevation_chart).toBe(true);
  });

  it('prunes show_elevation_chart:true from the emitted config (equals default)', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    let emitted: AdaptiveCoverProTileCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement;
    haForm.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: { value: { type: TYPE, entry_id: ENTRY, show_elevation_chart: true } },
      }),
    );

    expect(emitted).not.toBeNull();
    expect((emitted as unknown as Record<string, unknown>).show_elevation_chart).toBeUndefined();
  });

  it('keeps show_elevation_chart:false in the emitted config', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    let emitted: AdaptiveCoverProTileCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement;
    haForm.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: { value: { type: TYPE, entry_id: ENTRY, show_elevation_chart: false } },
      }),
    );

    expect(emitted!.show_elevation_chart).toBe(false);
  });
});

describe('adaptive-cover-pro-tile-card editor — state_color', () => {
  it('includes a state_color boolean field in the schema', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement & {
      schema?: Array<{ name: string; selector?: Record<string, unknown> }>;
    };
    const field = (haForm.schema ?? []).find((s) => s.name === 'state_color');
    expect(field).toBeTruthy();
    expect(field!.selector).toEqual({ boolean: {} });
  });

  it('defaults state_color to true in the form data', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement & {
      data?: Record<string, unknown>;
    };
    expect(haForm.data!.state_color).toBe(true);
  });

  it('prunes state_color:true from the emitted config (equals default)', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    let emitted: AdaptiveCoverProTileCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement;
    haForm.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: { value: { type: TYPE, entry_id: ENTRY, state_color: true } },
      }),
    );

    expect(emitted).not.toBeNull();
    expect((emitted as unknown as Record<string, unknown>).state_color).toBeUndefined();
  });

  it('keeps state_color:false in the emitted config', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    let emitted: AdaptiveCoverProTileCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement;
    haForm.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: { value: { type: TYPE, entry_id: ENTRY, state_color: false } },
      }),
    );

    expect(emitted!.state_color).toBe(false);
  });
});

describe('adaptive-cover-pro-tile-card editor — cover pre-fill', () => {
  // Build a registry + hass that makes discoverEntities return exactly one managed cover.
  function makeEditorSingleCover(): EditorLike {
    const el = document.createElement('adaptive-cover-pro-tile-card-editor') as EditorLike;
    el.hass = {
      states: {
        'sensor.cover_position': {
          state: '50',
          attributes: { actual_positions: { 'cover.left': 50 } },
        },
      },
      callWS: vi.fn().mockResolvedValue([]),
      connection: { subscribeEvents: vi.fn().mockResolvedValue(() => {}) },
    } as unknown as HomeAssistant;
    return el;
  }

  it('(a) pre-fills cover when single managed cover resolves after registry load', async () => {
    const el = makeEditorSingleCover();
    el._registry = REGISTRY; // REGISTRY maps sensor.cover_position → target_position_sensor
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);

    const emitted: AdaptiveCoverProTileCardConfig[] = [];
    el.addEventListener('config-changed', (e: Event) => {
      emitted.push((e as CustomEvent).detail.config as AdaptiveCoverProTileCardConfig);
    });

    await el.updateComplete;

    // The pre-fill should have fired config-changed with cover set to the single managed cover.
    const prefilled = emitted.find((c) => c.cover === 'cover.left');
    expect(prefilled).toBeDefined();
    expect(prefilled!.cover).toBe('cover.left');
  });

  it('(b) does NOT pre-fill when managed_covers.length > 1', async () => {
    const el = makeEditor(); // default hass has cover.left + cover.right (2 covers)
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);

    const emitted: AdaptiveCoverProTileCardConfig[] = [];
    el.addEventListener('config-changed', (e: Event) => {
      emitted.push((e as CustomEvent).detail.config as AdaptiveCoverProTileCardConfig);
    });

    await el.updateComplete;

    // With 2 managed covers, no cover pre-fill should be emitted.
    const prefilled = emitted.find((c) => c.cover !== undefined);
    expect(prefilled).toBeUndefined();
  });

  it('(c) does NOT overwrite an already-set cover', async () => {
    const el = makeEditorSingleCover();
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY, cover: 'cover.existing' });
    document.body.appendChild(el);

    const emitted: AdaptiveCoverProTileCardConfig[] = [];
    el.addEventListener('config-changed', (e: Event) => {
      emitted.push((e as CustomEvent).detail.config as AdaptiveCoverProTileCardConfig);
    });

    await el.updateComplete;

    // Pre-fill must not fire when cover is already set.
    const wrongPrefill = emitted.find((c) => c.cover === 'cover.left');
    expect(wrongPrefill).toBeUndefined();
  });
});

describe('adaptive-cover-pro-tile-card editor — schema', () => {
  it('builds an ha-form schema that includes all expected fields', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    interface SchemaNode {
      name: string;
      type?: string;
      schema?: SchemaNode[];
    }
    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement & {
      schema?: SchemaNode[];
    };
    expect(haForm).toBeTruthy();
    // Top-level fields: the badge toggles are collapsed into a single
    // unnamed `expandable` group that sits where they used to be.
    const topNames = (haForm.schema ?? []).map((s) => s.name);
    expect(topNames).toEqual([
      'entry_id',
      'name',
      'icon',
      'cover',
      'layout',
      'show_position',
      'show_state',
      'show_decision_summary',
      'show_controls',
      'show_badge',
      '', // expandable "Badges" group
      'show_motion_icon',
      'state_color',
      'show_compass',
      'show_elevation_chart',
      'show_solar_calc',
      'tap_action',
      'hold_action',
      'double_tap_action',
    ]);

    // The badge booleans live nested inside the expandable > grid.
    const collectNames = (nodes: SchemaNode[] | undefined): string[] =>
      (nodes ?? []).flatMap((s) => [s.name, ...collectNames(s.schema)]);
    const allNames = collectNames(haForm.schema);
    const badgeNames = [
      'badge_auto',
      'badge_solar',
      'badge_force',
      'badge_weather',
      'badge_manual',
      'badge_custom_position',
      'badge_motion',
      'badge_climate',
      'badge_glare_zone',
      'badge_cloud',
    ];
    for (const n of badgeNames) {
      expect(allNames).toContain(n);
    }
    const group = (haForm.schema ?? []).find((s) => s.type === 'expandable');
    expect(group).toBeTruthy();
  });

  it("restricts the cover picker to the entry's managed_covers when registry is loaded", async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement & {
      schema?: Array<{ name: string; selector: Record<string, unknown> }>;
    };
    const coverField = (haForm.schema ?? []).find((s) => s.name === 'cover')!;
    const sel = coverField.selector as { entity: { include_entities?: string[] } };
    expect(sel.entity.include_entities).toEqual(['cover.left', 'cover.right']);
  });
});
