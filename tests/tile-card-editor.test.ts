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
    // `controls_cover` joins the Controls section whenever the entry manages
    // more than one cover; `controls_axis` only when it exposes more than one
    // axis. `covers` is deliberately absent — rail order is the sortable list
    // rendered outside ha-form, not a schema field.
    expect(namesIn(1)).toEqual([
      'show_controls',
      'show_position_bar',
      'show_tilt',
      'controls_cover',
    ]);
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

// ── rail order widget ────────────────────────────────────────────────────────
// `covers` is edited by a bespoke sortable list rather than an ha-form field:
// HA's multi-entity selector can add and remove but not reorder, which is the
// one thing this control exists to do. It emits config directly, so these pin
// the state machine — every review pass found a defect in it.

describe('adaptive-cover-pro-tile-card editor — rail order', () => {
  /** Mount the editor with three managed covers. */
  async function mountRails(
    config: Partial<AdaptiveCoverProTileCardConfig> = {},
  ): Promise<{ el: EditorLike; emitted: AdaptiveCoverProTileCardConfig[] }> {
    const el = makeEditor();
    (el.hass!.states as Record<string, unknown>)['sensor.cover_position'] = {
      state: '42',
      attributes: { actual_positions: { 'cover.a': 10, 'cover.b': 20, 'cover.c': 30 } },
    };
    for (const id of ['cover.a', 'cover.b', 'cover.c']) {
      (el.hass!.states as Record<string, unknown>)[id] = {
        state: 'open',
        attributes: { friendly_name: id },
      };
    }
    el.setConfig({ type: TYPE, entry_id: ENTRY, ...config } as AdaptiveCoverProTileCardConfig);
    document.body.appendChild(el);
    el._entries = [{ entry_id: ENTRY, title: 'Test' }];
    el._registry = REGISTRY;
    await el.updateComplete;
    await el.updateComplete;
    const emitted: AdaptiveCoverProTileCardConfig[] = [];
    el.addEventListener('config-changed', (e) =>
      emitted.push((e as CustomEvent).detail.config as AdaptiveCoverProTileCardConfig),
    );
    return { el, emitted };
  }

  const rows = (el: EditorLike): HTMLElement[] =>
    Array.from(el.shadowRoot!.querySelectorAll('.rail-order li.rail')) as HTMLElement[];
  const names = (el: EditorLike): string[] =>
    rows(el).map((r) => r.querySelector('.rail-name')!.textContent!.trim());
  const btn = (row: HTMLElement, i: number): HTMLButtonElement =>
    row.querySelectorAll('.rail-btn')[i] as HTMLButtonElement;
  /** Most recent emitted config. (`Array.prototype.at` is past this
   *  project's lib target.) */
  const last = (a: AdaptiveCoverProTileCardConfig[]): AdaptiveCoverProTileCardConfig =>
    a[a.length - 1];

  it('lists every managed cover in the integration’s order by default', async () => {
    const { el } = await mountRails();
    expect(names(el)).toEqual(['cover.a', 'cover.b', 'cover.c']);
    expect(rows(el).every((r) => !r.classList.contains('hidden-rail'))).toBe(true);
  });

  it('shows only the pinned cover when `cover` is set, matching the tile', async () => {
    // The widget disagreeing with the tile is what made hiding a rail ADD one.
    const { el } = await mountRails({ cover: 'cover.b' });
    const shown = rows(el).filter((r) => !r.classList.contains('hidden-rail'));
    expect(shown.length).toBe(1);
    expect(shown[0].querySelector('.rail-name')!.textContent!.trim()).toBe('cover.b');
  });

  it('does not render for an entry with fewer than two managed covers', async () => {
    const el = makeEditor();
    (el.hass!.states as Record<string, unknown>)['sensor.cover_position'] = {
      state: '42',
      attributes: { actual_positions: { 'cover.only': 10 } },
    };
    el.setConfig({ type: TYPE, entry_id: ENTRY } as AdaptiveCoverProTileCardConfig);
    document.body.appendChild(el);
    el._entries = [{ entry_id: ENTRY, title: 'Test' }];
    el._registry = REGISTRY;
    await el.updateComplete;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.rail-order')).toBeNull();
  });

  it('moves a rail down and persists the new order', async () => {
    const { el, emitted } = await mountRails();
    btn(rows(el)[0], 1).click(); // ↓ on the first row
    expect(last(emitted).covers).toEqual(['cover.b', 'cover.a', 'cover.c']);
  });

  it('drops the `covers` key when the order returns to the default', async () => {
    // An untouched card keeps a clean config rather than gaining a redundant key.
    const { el, emitted } = await mountRails({ covers: ['cover.b', 'cover.a', 'cover.c'] });
    btn(rows(el)[0], 1).click(); // ↓ on cover.b restores a, b, c
    expect(last(emitted).covers).toBeUndefined();
  });

  it('hides a rail by removing it from `covers`', async () => {
    const { el, emitted } = await mountRails();
    btn(rows(el)[2], 2).click(); // eye on cover.c
    expect(last(emitted).covers).toEqual(['cover.a', 'cover.b']);
  });

  it('hide-then-show is an involution — the rail returns to its own position', async () => {
    // Appending on show made one accidental toggle a permanent reorder, and
    // pinned a redundant `covers` key into the YAML.
    const { el, emitted } = await mountRails();
    btn(rows(el)[0], 2).click(); // hide cover.a
    expect(last(emitted).covers).toEqual(['cover.b', 'cover.c']);

    const { el: el2, emitted: emitted2 } = await mountRails({ covers: ['cover.b', 'cover.c'] });
    const hidden = rows(el2).find((r) => r.classList.contains('hidden-rail'))!;
    btn(hidden, 2).click(); // show cover.a again
    expect(last(emitted2).covers).toBeUndefined(); // back to the default order
  });

  it('refuses to hide the last visible rail', async () => {
    // A tile with no position bar is what `show_position_bar` is for; losing
    // every rail here would leave no way back except editing YAML.
    const { el, emitted } = await mountRails({ covers: ['cover.a'] });
    const eye = btn(rows(el)[0], 2);
    expect(eye.disabled).toBe(true);
    eye.click();
    expect(emitted.length).toBe(0);
  });

  it('disables the arrows on a hidden rail rather than no-opping', async () => {
    // Only shown rails are persisted, so a move involving a hidden one could
    // not be represented and silently snapped back.
    const { el } = await mountRails({ covers: ['cover.a'] });
    const hidden = rows(el).filter((r) => r.classList.contains('hidden-rail'));
    expect(hidden.length).toBe(2);
    for (const row of hidden) {
      expect(btn(row, 0).disabled).toBe(true);
      expect(btn(row, 1).disabled).toBe(true);
      expect(row.getAttribute('draggable')).toBe('false');
    }
  });

  it('disables ↓ on the last SHOWN rail, not the last row', async () => {
    const { el } = await mountRails({ covers: ['cover.a', 'cover.b'] });
    const shown = rows(el).filter((r) => !r.classList.contains('hidden-rail'));
    expect(btn(shown[shown.length - 1], 1).disabled).toBe(true);
    expect(btn(shown[0], 1).disabled).toBe(false);
  });

  it('keeps shown rails ahead of hidden ones so ↑ is never enabled over a no-op', async () => {
    const { el } = await mountRails({ cover: 'cover.c' });
    // cover.c is the only shown rail and must sit at index 0, or its ↑ button
    // would be enabled over a move `_moveRail` refuses to make.
    expect(rows(el)[0].classList.contains('hidden-rail')).toBe(false);
    expect(btn(rows(el)[0], 0).disabled).toBe(true);
  });

  it('purges the cover-binding keys when the entry changes', async () => {
    // They name entities of the OLD entry: `covers` would filter to nothing and
    // `controls_cover` would aim ↑■↓ at another entry's cover.
    const { el, emitted } = await mountRails({
      covers: ['cover.a'],
      cover: 'cover.a',
      controls_cover: 'cover.a',
      controls_axis: 'position',
    });
    const haForm = el.shadowRoot!.querySelector('ha-form')!;
    haForm.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: { entry_id: 'entry_other' } },
        bubbles: true,
        composed: true,
      }),
    );
    const cfg = last(emitted);
    expect(cfg.entry_id).toBe('entry_other');
    expect(cfg.covers).toBeUndefined();
    expect(cfg.cover).toBeUndefined();
    expect(cfg.controls_cover).toBeUndefined();
    expect(cfg.controls_axis).toBeUndefined();
  });
});
