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

interface SchemaField {
  name: string;
  selector?: Record<string, unknown>;
  schema?: SchemaField[];
}

/** Depth-first field lookup. Options live inside expandable/grid containers
 *  rather than at the top level, so a flat `.find()` misses them. */
function findField(el: EditorLike, name: string): SchemaField | undefined {
  const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement & {
    schema?: SchemaField[];
  };
  const walk = (nodes: SchemaField[] | undefined): SchemaField | undefined => {
    for (const n of nodes ?? []) {
      if (n.name === name && n.selector) return n;
      const hit = walk(n.schema);
      if (hit) return hit;
    }
    return undefined;
  };
  return walk(haForm.schema);
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

    // Lives inside the Dialog sections group now, so walk the tree.
    const field = findField(el, 'show_elevation_chart');
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

    // Lives inside the Content group now, so walk the tree.
    const field = findField(el, 'state_color');
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

  it('(a) does NOT pre-fill cover when a single managed cover resolves', async () => {
    const el = makeEditorSingleCover();
    el._registry = REGISTRY; // REGISTRY maps sensor.cover_position → target_position_sensor
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);

    const emitted: AdaptiveCoverProTileCardConfig[] = [];
    el.addEventListener('config-changed', (e: Event) => {
      emitted.push((e as CustomEvent).detail.config as AdaptiveCoverProTileCardConfig);
    });

    await el.updateComplete;

    // A single-cover entry must leave `cover` OUT of the config: the card's
    // `_resolvedCover` already falls back to `managed_covers[0]`, so writing it
    // pins an entity_id that discovery would resolve anyway — against the
    // "entity binding goes through discovery" rule, and stale the moment the
    // cover entity is renamed.
    const prefilled = emitted.find((c) => c.cover !== undefined);
    expect(prefilled).toBeUndefined();
  });

  it('(a2) hides the cover picker entirely for a single-cover entry', async () => {
    const el = makeEditorSingleCover();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement & {
      schema?: Array<{ name: string }>;
    };
    expect((haForm.schema ?? []).map((s) => s.name)).not.toContain('cover');
  });

  it('(a3) keeps the cover picker when an explicit cover is already configured', async () => {
    const el = makeEditorSingleCover();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    // A config written before the picker was hidden must stay editable —
    // and removable — rather than becoming invisible but still in effect.
    el.setConfig({ type: TYPE, entry_id: ENTRY, cover: 'cover.left' });
    document.body.appendChild(el);
    await el.updateComplete;

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement & {
      schema?: Array<{ name: string }>;
    };
    expect((haForm.schema ?? []).map((s) => s.name)).toContain('cover');
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

describe('adaptive-cover-pro-tile-card editor — composite (array) name (#247)', () => {
  const COMPOSED_NAME = [{ type: 'area' }, { type: 'entry' }];

  // (Audit finding #4, issue #247 fix pass: the former "does not throw when
  // _config.name is an array" test duplicated this one's setConfig+render
  // path without adding a distinct assertion — deleted rather than kept.)
  it('blanks the name field data when name is composed, without disabling the field', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY, name: COMPOSED_NAME as unknown as string });
    document.body.appendChild(el);
    await el.updateComplete;

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement & {
      data?: Record<string, unknown>;
      schema?: Array<{ name: string; disabled?: boolean }>;
    };
    expect(haForm.data!.name).toBe('');
    // Audit finding #3: the field must stay editable — its hint promises a
    // "type a new title here" escape hatch, so `disabled` must never be set.
    const nameField = (haForm.schema ?? []).find((s) => s.name === 'name');
    expect(nameField?.disabled).toBeFalsy();
  });

  it('does not corrupt a composed name via an unrelated value-changed event', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY, name: COMPOSED_NAME as unknown as string });
    document.body.appendChild(el);
    await el.updateComplete;

    let emitted: AdaptiveCoverProTileCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement;
    // Simulates ha-form's full-value-on-every-change contract: toggling an
    // unrelated field (show_position) still carries the name field's current
    // (blanked) value alongside it.
    expect(() => {
      haForm.dispatchEvent(
        new CustomEvent('value-changed', {
          bubbles: true,
          composed: true,
          detail: {
            value: { type: TYPE, entry_id: ENTRY, name: '', show_position: false },
          },
        }),
      );
    }).not.toThrow();

    expect(emitted).not.toBeNull();
    expect(emitted!.name).toEqual(COMPOSED_NAME);
    expect(emitted!.show_position).toBe(false);
  });

  // Audit finding #4 (issue #247 fix pass): this used to dispatch straight to
  // `value-changed` without ever checking the schema item was reachable at
  // all — so it kept passing even while the field was `disabled: true` (a
  // real `ha-form` would refuse to emit a change from a disabled selector;
  // the mocked element here doesn't enforce that, so the interaction it
  // claimed to exercise was actually impossible in production). Assert the
  // schema item is NOT disabled first, so this fails again if the escape
  // hatch (finding #3) is ever removed, then drive the same interaction.
  it('replaces a composed name when the user types a fresh string into the name field', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY, name: COMPOSED_NAME as unknown as string });
    document.body.appendChild(el);
    await el.updateComplete;

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement & {
      schema?: Array<{ name: string; disabled?: boolean }>;
    };
    const nameField = (haForm.schema ?? []).find((s) => s.name === 'name');
    expect(nameField?.disabled).toBeFalsy();

    let emitted: AdaptiveCoverProTileCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    haForm.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: {
          value: { type: TYPE, entry_id: ENTRY, name: 'Custom Title' },
        },
      }),
    );

    expect(emitted).not.toBeNull();
    expect(emitted!.name).toBe('Custom Title');
  });
});

describe('adaptive-cover-pro-tile-card editor — schema', () => {
  interface SchemaNode {
    name: string;
    type?: string;
    title?: string;
    expanded?: boolean;
    schema?: SchemaNode[];
  }

  const collectNames = (nodes: SchemaNode[] | undefined): string[] =>
    (nodes ?? []).flatMap((s) => [s.name, ...collectNames(s.schema)]);

  async function schemaOf(config: Record<string, unknown>): Promise<SchemaNode[]> {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig(config as never);
    document.body.appendChild(el);
    await el.updateComplete;
    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement & {
      schema?: SchemaNode[];
    };
    expect(haForm).toBeTruthy();
    return haForm.schema ?? [];
  }

  it('keeps only the entity bindings ungrouped, everything else in sections', async () => {
    const schema = await schemaOf({ type: TYPE, entry_id: ENTRY });
    // Mirrors HA's tile editor: the entity binding sits above the sections and
    // every presentation option lives inside one. `cover` joins entry_id only
    // when the entry manages more than one cover (covered separately below).
    const bindings = schema.filter((s) => s.type !== 'expandable').map((s) => s.name);
    // The REGISTRY fixture manages two covers, so the cover picker shows.
    expect(bindings).toEqual(['entry_id', 'cover']);
    // Everything that is not a binding is an unnamed expandable section.
    for (const node of schema.filter((s) => s.type === 'expandable')) {
      expect(node.name).toBe('');
    }
  });

  it('groups every option under the expected section', async () => {
    const schema = await schemaOf({ type: TYPE, entry_id: ENTRY });
    const sections = schema.filter((s) => s.type === 'expandable');
    // Five sections, in order: Content, Controls, Badges, Dialog, Interactions.
    expect(sections).toHaveLength(5);

    const namesIn = (i: number) => collectNames(sections[i].schema).filter(Boolean);
    expect(namesIn(0)).toEqual([
      'name',
      'icon',
      'layout',
      'show_position',
      'show_state',
      'show_decision_summary',
      'state_color',
      'show_motion_icon',
    ]);
    expect(namesIn(1)).toEqual(['show_controls', 'show_position_bar', 'show_tilt']);
    expect(namesIn(2)).toContain('show_badge');
    expect(namesIn(2)).toContain('badge_auto');
    expect(namesIn(3)).toEqual(['show_compass', 'show_elevation_chart', 'show_solar_calc']);
    expect(namesIn(4)).toEqual([
      'tap_action',
      'icon_tap_action',
      'hold_action',
      'double_tap_action',
    ]);
  });

  it('opens Content by default and leaves the rest collapsed', async () => {
    const sections = (await schemaOf({ type: TYPE, entry_id: ENTRY })).filter(
      (s) => s.type === 'expandable',
    );
    expect(sections[0].expanded).toBe(true);
    for (const s of sections.slice(1)) expect(s.expanded).toBeFalsy();
  });

  it('exposes show_tilt for a cover tile, not just a group', async () => {
    // The cover tile has always honored show_tilt (the venetian slat bar) but
    // the schema never offered it, so it was YAML-only.
    const names = collectNames(await schemaOf({ type: TYPE, entry_id: ENTRY }));
    expect(names).toContain('show_tilt');
  });

  it('still reaches every previously-flat field, so existing YAML keeps working', async () => {
    // Sections are unnamed, so ha-form does not nest their values — grouping
    // changed the layout only. Every key that used to be top-level must still
    // be bound somewhere in the tree.
    const names = collectNames(await schemaOf({ type: TYPE, entry_id: ENTRY }));
    for (const n of [
      'entry_id',
      'name',
      'icon',
      'layout',
      'show_position',
      'show_state',
      'show_decision_summary',
      'show_controls',
      'show_badge',
      'show_position_bar',
      'show_motion_icon',
      'state_color',
      'show_compass',
      'show_elevation_chart',
      'show_solar_calc',
      'tap_action',
      'hold_action',
      'double_tap_action',
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
    ]) {
      expect(names).toContain(n);
    }
  });

  it('gives a Cover Group its own sections, without the cover-only ones', async () => {
    // A group renders acp-group-tile, so layout / badges / dialog sections and
    // the cover picker are all inert for it and must not appear.
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Playroom' }];
    el._registry = [
      {
        entity_id: 'sensor.group_active_scene',
        unique_id: `${ENTRY}_group_active_scene`,
        config_entry_id: ENTRY,
        platform: 'adaptive_cover_pro',
        device_id: null,
      },
    ];
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement & {
      schema?: SchemaField[];
    };
    const schema = haForm.schema ?? [];
    const sections = schema.filter((s) => (s as { type?: string }).type === 'expandable');
    // Content, Controls, Group row, Interactions — no Badges, no Dialog.
    expect(sections).toHaveLength(4);

    const all = (nodes: SchemaField[] | undefined): string[] =>
      (nodes ?? []).flatMap((n) => [n.name, ...all(n.schema)]);
    const names = all(schema).filter(Boolean);
    expect(names).toContain('show_member_badges');
    expect(names).toContain('show_tilt');
    expect(names).toContain('icon_tap_action');
    for (const coverOnly of ['cover', 'layout', 'show_badge', 'show_compass', 'badge_auto']) {
      expect(names).not.toContain(coverOnly);
    }
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
