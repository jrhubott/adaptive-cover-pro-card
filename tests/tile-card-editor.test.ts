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
        show_resume: 'always',
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

describe('adaptive-cover-pro-tile-card editor — schema', () => {
  it('builds an ha-form schema that includes all expected fields', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el._registry = REGISTRY;
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement & {
      schema?: Array<{ name: string }>;
    };
    expect(haForm).toBeTruthy();
    const names = (haForm.schema ?? []).map((s) => s.name);
    expect(names).toEqual([
      'entry_id',
      'name',
      'icon',
      'cover',
      'layout',
      'show_position',
      'show_decision_summary',
      'show_controls',
      'show_badge',
      'show_compass',
      'show_resume',
      'tap_action',
      'hold_action',
      'double_tap_action',
    ]);
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
