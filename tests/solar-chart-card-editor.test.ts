import { describe, it, expect } from 'vitest';
import '../src/adaptive-cover-pro-solar-chart-card-editor';
import type { SolarChartCardConfig } from '../src/types';

interface EditorLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: unknown;
  setConfig(config: SolarChartCardConfig): void;
  _entries: { entry_id: string; title: string }[] | null;
  _onCoverColorChange(index: number, value: string): void;
  _onCoverColorReset(index: number): void;
  _onEntryToggle(entryId: string, enabled: boolean): void;
  _onToggle(key: string, enabled: boolean): void;
}

function makeEditor(): EditorLike {
  const el = document.createElement('adaptive-cover-pro-solar-chart-card-editor') as EditorLike;
  el.hass = { states: {}, callWS: async () => [] };
  return el;
}

describe('solar-chart-card editor mounting', () => {
  it('mounts without throwing and renders the entry picker', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: 'a', title: 'Kitchen' }];
    el.setConfig({ type: 'custom:x', entry_ids: ['a'] });
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.entry-list')).toBeTruthy();
  });
});

describe('solar-chart-card editor entry_ids', () => {
  it('emits entry_ids in config-changed when an entry is toggled on', () => {
    const el = makeEditor();
    el._entries = [
      { entry_id: 'a', title: 'Kitchen' },
      { entry_id: 'b', title: 'Living' },
    ];
    el.setConfig({ type: 'custom:x', entry_ids: ['a'] });

    let emitted: SolarChartCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    el._onEntryToggle('b', true);
    expect(emitted).not.toBeNull();
    expect(emitted!.entry_ids).toEqual(['a', 'b']);
  });

  it('emits entry_ids in config-changed when an entry is toggled off', () => {
    const el = makeEditor();
    el._entries = [
      { entry_id: 'a', title: 'Kitchen' },
      { entry_id: 'b', title: 'Living' },
    ];
    el.setConfig({ type: 'custom:x', entry_ids: ['a', 'b'] });

    let emitted: SolarChartCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    el._onEntryToggle('a', false);
    expect(emitted!.entry_ids).toEqual(['b']);
  });
});

describe('solar-chart-card editor title', () => {
  it('emits title in config-changed when set', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: 'a', title: 'Kitchen' }];
    el.setConfig({ type: 'custom:x', entry_ids: ['a'] });
    document.body.appendChild(el);
    await el.updateComplete;

    let emitted: SolarChartCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    const input = el.shadowRoot!.querySelector('input[type="text"]') as HTMLInputElement;
    input.value = 'Sun today';
    input.dispatchEvent(new Event('change'));
    expect(emitted).not.toBeNull();
    expect(emitted!.title).toBe('Sun today');
  });
});

describe('solar-chart-card editor compact toggle', () => {
  it('emits compact in config-changed when toggled on', () => {
    const el = makeEditor();
    el._entries = [{ entry_id: 'a', title: 'Kitchen' }];
    el.setConfig({ type: 'custom:x', entry_ids: ['a'] });

    let emitted: SolarChartCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    el._onToggle('compact', true);
    expect(emitted).not.toBeNull();
    expect(emitted!.compact).toBe(true);
  });
});

describe('solar-chart-card editor cover_colors', () => {
  it('emits cover_colors on color change', () => {
    const el = makeEditor();
    el._entries = [
      { entry_id: 'a', title: 'Kitchen' },
      { entry_id: 'b', title: 'Living' },
    ];
    el.setConfig({ type: 'custom:x', entry_ids: ['a', 'b'] });

    let emitted: SolarChartCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    el._onCoverColorChange(0, '#ff3366');
    expect(emitted).not.toBeNull();
    expect(emitted!.cover_colors).toEqual(['#ff3366']);
  });

  it('Reset clears a single slot; all-null array is omitted from config', () => {
    const el = makeEditor();
    el._entries = [{ entry_id: 'a', title: 'Kitchen' }];
    el.setConfig({ type: 'custom:x', entry_ids: ['a'], cover_colors: ['#ff3366'] });

    let emitted: SolarChartCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    el._onCoverColorReset(0);
    expect(emitted!.cover_colors).toBeUndefined();
  });
});
