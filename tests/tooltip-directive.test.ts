import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { html, render } from 'lit';
import { tooltip, setTooltipDefaults, _resetTooltipSingleton } from '../src/lib/tooltip';

beforeEach(() => {
  setTooltipDefaults({ enabled: true, offset: [12, 16], delay: 400 });
  _resetTooltipSingleton();
  document.body.innerHTML = '';
});

afterEach(() => {
  vi.useRealTimers();
});

function renderTip(text: string, opts?: Parameters<typeof tooltip>[1]): HTMLElement {
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(html`<span class="anchor" ${tooltip(text, opts)}>label</span>`, host);
  return host.querySelector('.anchor') as HTMLElement;
}

describe('tooltip directive — a11y + data wiring', () => {
  it('sets data-tooltip to the text when floating is enabled', () => {
    const el = renderTip('Hello');
    expect(el.getAttribute('data-tooltip')).toBe('Hello');
  });

  it('sets aria-describedby to the singleton bubble id', () => {
    const el = renderTip('Hello');
    expect(el.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('does NOT set a native title when floating is enabled (avoids double tooltip)', () => {
    const el = renderTip('Hello');
    expect(el.hasAttribute('title')).toBe(false);
  });

  it('degrades to a native title= and no data-tooltip when disabled', () => {
    setTooltipDefaults({ enabled: false });
    const el = renderTip('Hello');
    expect(el.getAttribute('title')).toBe('Hello');
    expect(el.hasAttribute('data-tooltip')).toBe(false);
    expect(el.hasAttribute('aria-describedby')).toBe(false);
  });
});

describe('tooltip directive — cursor lifecycle + open delay', () => {
  it('does not show the bubble before the open delay elapses', () => {
    vi.useFakeTimers();
    const el = renderTip('Hello');
    el.dispatchEvent(new PointerEvent('pointerenter', { clientX: 50, clientY: 60 }));
    expect(el.hasAttribute('acp-tt-shown')).toBe(false);
    vi.advanceTimersByTime(399);
    expect(el.hasAttribute('acp-tt-shown')).toBe(false);
  });

  it('flips to shown (acp-tt-shown) after the delay, and the bubble becomes visible', () => {
    vi.useFakeTimers();
    const el = renderTip('Hello');
    el.dispatchEvent(new PointerEvent('pointerenter', { clientX: 50, clientY: 60 }));
    vi.advanceTimersByTime(400);
    expect(el.hasAttribute('acp-tt-shown')).toBe(true);
    const bubble = document.querySelector('acp-floating-tooltip') as HTMLElement & {
      visible: boolean;
    };
    expect(bubble).toBeTruthy();
    expect(bubble.visible).toBe(true);
  });

  it('clears the open timer and never shows when the pointer leaves first', () => {
    vi.useFakeTimers();
    const el = renderTip('Hello');
    el.dispatchEvent(new PointerEvent('pointerenter', { clientX: 50, clientY: 60 }));
    vi.advanceTimersByTime(200);
    el.dispatchEvent(new PointerEvent('pointerleave'));
    vi.advanceTimersByTime(400);
    expect(el.hasAttribute('acp-tt-shown')).toBe(false);
  });

  it('hides and clears acp-tt-shown on pointerleave', () => {
    vi.useFakeTimers();
    const el = renderTip('Hello');
    el.dispatchEvent(new PointerEvent('pointerenter', { clientX: 50, clientY: 60 }));
    vi.advanceTimersByTime(400);
    expect(el.hasAttribute('acp-tt-shown')).toBe(true);
    el.dispatchEvent(new PointerEvent('pointerleave'));
    expect(el.hasAttribute('acp-tt-shown')).toBe(false);
    const bubble = document.querySelector('acp-floating-tooltip') as HTMLElement & {
      visible: boolean;
    };
    expect(bubble.visible).toBe(false);
  });

  it('hides on Escape keydown', () => {
    vi.useFakeTimers();
    const el = renderTip('Hello');
    el.dispatchEvent(new PointerEvent('pointerenter', { clientX: 50, clientY: 60 }));
    vi.advanceTimersByTime(400);
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(el.hasAttribute('acp-tt-shown')).toBe(false);
  });

  it('shows on focusin using the element bounding rect', () => {
    vi.useFakeTimers();
    const el = renderTip('Hello');
    el.dispatchEvent(new FocusEvent('focusin'));
    vi.advanceTimersByTime(400);
    expect(el.hasAttribute('acp-tt-shown')).toBe(true);
  });
});

describe('tooltip singleton — ref-counting + single mount', () => {
  it('mounts exactly one bubble element to document.body across many anchors', () => {
    renderTip('A');
    renderTip('B');
    renderTip('C');
    const bubbles = document.querySelectorAll('acp-floating-tooltip');
    expect(bubbles.length).toBe(1);
  });
});
