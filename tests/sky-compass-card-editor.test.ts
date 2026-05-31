import { describe, it, expect } from 'vitest';
import '../src/adaptive-cover-pro-sky-compass-card-editor';
import type { SkyCompassCardConfig } from '../src/types';

interface EditorLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: unknown;
  setConfig(config: SkyCompassCardConfig): void;
  _entries: { entry_id: string; title: string }[] | null;
  _onCoverColorChange(index: number, value: string): void;
  _onCoverColorReset(index: number): void;
  _onEntryToggle(entryId: string, enabled: boolean): void;
  _onToggle(key: string, enabled: boolean): void;
  _onNorthOffsetChange(e: Event): void;
}

function makeEditor(): EditorLike {
  const el = document.createElement('adaptive-cover-pro-sky-compass-card-editor') as EditorLike;
  el.hass = { states: {}, callWS: async () => [] };
  return el;
}

describe('editor north_offset', () => {
  it('emits north_offset in config-changed when changed', () => {
    const el = makeEditor();
    el._entries = [{ entry_id: 'a', title: 'Kitchen' }];
    el.setConfig({ type: 'custom:x', entry_ids: ['a'] });

    let emitted: SkyCompassCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    const fakeEvent = { target: { value: '90' } } as unknown as Event;
    el._onNorthOffsetChange(fakeEvent);
    expect(emitted).not.toBeNull();
    expect(emitted!.north_offset).toBe(90);
  });

  it('non-numeric north_offset input emits 0', () => {
    const el = makeEditor();
    el._entries = [{ entry_id: 'a', title: 'Kitchen' }];
    el.setConfig({ type: 'custom:x', entry_ids: ['a'] });

    let emitted: SkyCompassCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    const fakeEvent = { target: { value: 'abc' } } as unknown as Event;
    el._onNorthOffsetChange(fakeEvent);
    expect(emitted!.north_offset).toBe(0);
  });
});

describe('editor show_elevation_chart toggle', () => {
  it('emits show_elevation_chart in config-changed when toggled off', () => {
    const el = makeEditor();
    el._entries = [{ entry_id: 'a', title: 'Kitchen' }];
    el.setConfig({ type: 'custom:x', entry_ids: ['a'] });

    let emitted: SkyCompassCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    el._onToggle('show_elevation_chart', false);
    expect(emitted).not.toBeNull();
    expect(emitted!.show_elevation_chart).toBe(false);
  });

  it('renders a show_elevation_chart checkbox in the display toggles, defaulting on', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: 'a', title: 'Kitchen' }];
    el.setConfig({ type: 'custom:x', entry_ids: ['a'] });
    document.body.appendChild(el);
    await el.updateComplete;

    const labels = Array.from(el.shadowRoot!.querySelectorAll('.toggle-label')).map(
      (n) => n.textContent?.trim() ?? '',
    );
    expect(labels).toContain('Sun-today chart');
  });
});

describe('editor cover_colors', () => {
  it('emits cover_colors on color change', () => {
    const el = makeEditor();
    el._entries = [
      { entry_id: 'a', title: 'Kitchen' },
      { entry_id: 'b', title: 'Living' },
    ];
    el.setConfig({ type: 'custom:x', entry_ids: ['a', 'b'] });

    let emitted: SkyCompassCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    el._onCoverColorChange(0, '#ff3366');
    expect(emitted).not.toBeNull();
    expect(emitted!.cover_colors).toEqual(['#ff3366']);
  });

  it('setting a second slot preserves the first', () => {
    const el = makeEditor();
    el._entries = [
      { entry_id: 'a', title: 'Kitchen' },
      { entry_id: 'b', title: 'Living' },
    ];
    el.setConfig({ type: 'custom:x', entry_ids: ['a', 'b'], cover_colors: ['#ff3366'] });

    let emitted: SkyCompassCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    el._onCoverColorChange(1, '#00aaff');
    expect(emitted!.cover_colors).toEqual(['#ff3366', '#00aaff']);
  });

  it('Reset clears a single slot; all-null array is omitted from config', () => {
    const el = makeEditor();
    el._entries = [{ entry_id: 'a', title: 'Kitchen' }];
    el.setConfig({ type: 'custom:x', entry_ids: ['a'], cover_colors: ['#ff3366'] });

    let emitted: SkyCompassCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    el._onCoverColorReset(0);
    expect(emitted!.cover_colors).toBeUndefined();
  });

  it('Reset of one slot keeps other overrides', () => {
    const el = makeEditor();
    el._entries = [
      { entry_id: 'a', title: 'Kitchen' },
      { entry_id: 'b', title: 'Living' },
    ];
    el.setConfig({
      type: 'custom:x',
      entry_ids: ['a', 'b'],
      cover_colors: ['#ff3366', '#00aaff'],
    });

    let emitted: SkyCompassCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    el._onCoverColorReset(0);
    expect(emitted!.cover_colors).toEqual([null, '#00aaff']);
  });

  it('toggling an entry off re-aligns cover_colors', () => {
    const el = makeEditor();
    el._entries = [
      { entry_id: 'a', title: 'Kitchen' },
      { entry_id: 'b', title: 'Living' },
    ];
    el.setConfig({
      type: 'custom:x',
      entry_ids: ['a', 'b'],
      cover_colors: ['#ff3366', '#00aaff'],
    });

    let emitted: SkyCompassCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    el._onEntryToggle('a', false);
    expect(emitted!.entry_ids).toEqual(['b']);
    expect(emitted!.cover_colors).toEqual(['#00aaff']);
  });

  it('toggling an entry off with only that entry set omits cover_colors', () => {
    const el = makeEditor();
    el._entries = [
      { entry_id: 'a', title: 'Kitchen' },
      { entry_id: 'b', title: 'Living' },
    ];
    el.setConfig({
      type: 'custom:x',
      entry_ids: ['a', 'b'],
      cover_colors: ['#ff3366', null],
    });

    let emitted: SkyCompassCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    el._onEntryToggle('a', false);
    expect(emitted!.entry_ids).toEqual(['b']);
    expect(emitted!.cover_colors).toBeUndefined();
  });
});
