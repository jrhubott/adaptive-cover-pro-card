import { describe, it, expect, vi } from 'vitest';
import '../src/adaptive-cover-pro-decision-card';
import '../src/adaptive-cover-pro-decision-card-editor';
import type { HomeAssistant } from 'custom-card-helpers';
import type { AdaptiveCoverProDecisionCardConfig } from '../src/types';

const TYPE = 'custom:adaptive-cover-pro-decision-card';
const ENTRY = 'entry_dec';

interface EditorLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  setConfig(config: AdaptiveCoverProDecisionCardConfig): void;
  _entries: { entry_id: string; title: string }[] | null;
}

function makeEditor(): EditorLike {
  const el = document.createElement('adaptive-cover-pro-decision-card-editor') as EditorLike;
  el.hass = {
    states: {},
    callWS: vi.fn().mockResolvedValue([]),
    connection: { subscribeEvents: vi.fn().mockResolvedValue(() => {}) },
  } as unknown as HomeAssistant;
  return el;
}

describe('adaptive-cover-pro-decision-card editor — getConfigElement', () => {
  it('exposes a getConfigElement that returns the editor element', async () => {
    const { AdaptiveCoverProDecisionCard } =
      await import('../src/adaptive-cover-pro-decision-card');
    const el = await AdaptiveCoverProDecisionCard.getConfigElement();
    expect(el.tagName.toLowerCase()).toBe('adaptive-cover-pro-decision-card-editor');
  });
});

describe('adaptive-cover-pro-decision-card editor — setConfig', () => {
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
        title: 'Why?',
        compact: true,
        hide_inactive_handlers: true,
        show_decision_summary: false,
      }),
    ).not.toThrow();
  });
});

describe('adaptive-cover-pro-decision-card editor — value-changed', () => {
  it('emits entry_id, title and toggled options', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    let emitted: AdaptiveCoverProDecisionCardConfig | null = null;
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
            title: 'Decision',
            compact: true,
            hide_inactive_handlers: true,
            show_decision_summary: true,
          },
        },
      }),
    );

    expect(emitted).not.toBeNull();
    expect(emitted!.entry_id).toBe(ENTRY);
    expect(emitted!.title).toBe('Decision');
    expect(emitted!.compact).toBe(true);
    expect(emitted!.hide_inactive_handlers).toBe(true);
    // show_decision_summary:true equals the default → pruned from the emitted config.
    expect((emitted as unknown as Record<string, unknown>).show_decision_summary).toBeUndefined();
  });

  it('keeps show_decision_summary:false in the emitted config', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    let emitted: AdaptiveCoverProDecisionCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement;
    haForm.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: { value: { type: TYPE, entry_id: ENTRY, show_decision_summary: false } },
      }),
    );

    expect(emitted!.show_decision_summary).toBe(false);
  });

  it('preserves existing config keys absent from the value-changed payload', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el.setConfig({ type: TYPE, entry_id: ENTRY, title: 'Original' });
    document.body.appendChild(el);
    await el.updateComplete;

    let emitted: AdaptiveCoverProDecisionCardConfig | null = null;
    el.addEventListener('config-changed', (e: Event) => {
      emitted = (e as CustomEvent).detail.config;
    });

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement;
    haForm.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: { value: { type: TYPE, entry_id: ENTRY, compact: true } },
      }),
    );

    expect(emitted!.title).toBe('Original');
    expect(emitted!.compact).toBe(true);
  });
});

describe('adaptive-cover-pro-decision-card editor — schema', () => {
  it('builds an ha-form schema with the expected top-level field order', async () => {
    const el = makeEditor();
    el._entries = [{ entry_id: ENTRY, title: 'Kitchen' }];
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    document.body.appendChild(el);
    await el.updateComplete;

    const haForm = el.shadowRoot!.querySelector('ha-form') as HTMLElement & {
      schema?: Array<{ name: string }>;
      data?: Record<string, unknown>;
    };
    expect(haForm).toBeTruthy();
    const topNames = (haForm.schema ?? []).map((s) => s.name);
    expect(topNames).toEqual([
      'entry_id',
      'title',
      'compact',
      'hide_inactive_handlers',
      'show_decision_summary',
    ]);
    // Defaults surfaced in the form data.
    expect(haForm.data!.compact).toBe(false);
    expect(haForm.data!.hide_inactive_handlers).toBe(false);
    expect(haForm.data!.show_decision_summary).toBe(true);
  });
});
