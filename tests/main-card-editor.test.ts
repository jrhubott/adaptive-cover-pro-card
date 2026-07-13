import { describe, it, expect } from 'vitest';
import '../src/adaptive-cover-pro-card-editor';
import type { AdaptiveCoverProCardConfig } from '../src/types';

interface EditorLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: unknown;
  setConfig(config: AdaptiveCoverProCardConfig): void;
  _entries: { entry_id: string; title: string }[] | null;
  _onCoverColorChange(value: string): void;
  _onCoverColorReset(): void;
  _onSectionToggle(key: string, enabled: boolean): void;
}

function makeEditor(): EditorLike {
  const el = document.createElement('adaptive-cover-pro-card-editor') as EditorLike;
  el.hass = { states: {}, callWS: async () => [] };
  return el;
}

describe('main-card editor cover colors (issue #132)', () => {
  it('renders a color input when entry_id is set', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: 'a', title: 'Kitchen' }];
    el.setConfig({ type: 'custom:adaptive-cover-pro-card', entry_id: 'a' });
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('input[type="color"]')).toBeTruthy();
  });

  it('does not render a color input when entry_id is empty', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: 'a', title: 'Kitchen' }];
    el.setConfig({ type: 'custom:adaptive-cover-pro-card', entry_id: '' });
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('input[type="color"]')).toBeNull();
  });

  it('emits cover_colors:[value] on color change', () => {
    const el = makeEditor();
    el._entries = [{ entry_id: 'a', title: 'Kitchen' }];
    el.setConfig({ type: 'custom:adaptive-cover-pro-card', entry_id: 'a' });

    let emitted: AdaptiveCoverProCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    el._onCoverColorChange('#123456');
    expect(emitted).not.toBeNull();
    expect(emitted!.cover_colors).toEqual(['#123456']);
  });

  it('renders a Solar calculation section toggle, off by default', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: 'a', title: 'Kitchen' }];
    el.setConfig({ type: 'custom:adaptive-cover-pro-card', entry_id: 'a' });
    document.body.appendChild(el);
    await el.updateComplete;
    const labels = Array.from(el.shadowRoot!.querySelectorAll('*'))
      .map((n) => n.textContent ?? '')
      .join(' ');
    expect(labels).toContain('Solar calculation');
    // Opt-in: an unset show_sections must not enable solar by default. Toggling
    // it on emits a show_sections array that includes 'solar'.
    let emitted: AdaptiveCoverProCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });
    el._onSectionToggle('solar', true);
    expect(emitted!.show_sections).toContain('solar');
    // And the other (default-on) sections are preserved, solar last in order.
    expect(emitted!.show_sections).toContain('sky');
    expect(emitted!.show_sections!.indexOf('solar')).toBe(emitted!.show_sections!.length - 1);
  });

  it('reset emits a config without cover_colors', () => {
    const el = makeEditor();
    el._entries = [{ entry_id: 'a', title: 'Kitchen' }];
    el.setConfig({
      type: 'custom:adaptive-cover-pro-card',
      entry_id: 'a',
      cover_colors: ['#123456'],
    });

    let emitted: AdaptiveCoverProCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    el._onCoverColorReset();
    expect(emitted).not.toBeNull();
    expect(emitted!.cover_colors).toBeUndefined();
  });
});

describe('main-card editor state_color toggle', () => {
  function stateColorCheckbox(el: EditorLike): HTMLInputElement {
    const rows = Array.from(el.shadowRoot!.querySelectorAll('.toggle-row'));
    const row = rows.find((r) => (r.textContent ?? '').includes('Color icon by state'));
    return row!.querySelector('input[type="checkbox"]') as HTMLInputElement;
  }

  it('renders a state_color toggle, checked by default', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: 'a', title: 'Kitchen' }];
    el.setConfig({ type: 'custom:adaptive-cover-pro-card', entry_id: 'a' });
    document.body.appendChild(el);
    await el.updateComplete;
    expect(stateColorCheckbox(el).checked).toBe(true);
  });

  it('unchecks when state_color:false is set', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: 'a', title: 'Kitchen' }];
    el.setConfig({ type: 'custom:adaptive-cover-pro-card', entry_id: 'a', state_color: false });
    document.body.appendChild(el);
    await el.updateComplete;
    expect(stateColorCheckbox(el).checked).toBe(false);
  });

  it('emits state_color:false when toggled off', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: 'a', title: 'Kitchen' }];
    el.setConfig({ type: 'custom:adaptive-cover-pro-card', entry_id: 'a' });
    document.body.appendChild(el);
    await el.updateComplete;

    let emitted: AdaptiveCoverProCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    const checkbox = stateColorCheckbox(el);
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));

    expect(emitted).not.toBeNull();
    expect(emitted!.state_color).toBe(false);
  });
});
