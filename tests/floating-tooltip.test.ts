import { describe, it, expect } from 'vitest';
import '../src/components/floating-tooltip';
import { FloatingTooltipElement } from '../src/components/floating-tooltip';
import type { CSSResult } from 'lit';

interface TTLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  text: string;
  cursorX: number;
  cursorY: number;
  visible: boolean;
}

function make(): TTLike {
  const el = document.createElement('acp-floating-tooltip') as TTLike;
  document.body.appendChild(el);
  return el;
}

describe('acp-floating-tooltip element', () => {
  it('exposes role=tooltip on the host for a11y', async () => {
    const el = make();
    await el.updateComplete;
    expect(el.getAttribute('role')).toBe('tooltip');
  });

  it('is hidden (aria-hidden) until visible is set', async () => {
    const el = make();
    await el.updateComplete;
    expect(el.hasAttribute('visible')).toBe(false);
    el.visible = true;
    await el.updateComplete;
    expect(el.hasAttribute('visible')).toBe(true);
  });

  it('renders the supplied text', async () => {
    const el = make();
    el.text = 'Hello tooltip';
    el.visible = true;
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).toContain('Hello tooltip');
  });

  it('positions itself with fixed positioning at the placed coordinates', async () => {
    const el = make();
    el.text = 'x';
    el.cursorX = 100;
    el.cursorY = 200;
    el.visible = true;
    await el.updateComplete;
    const bubble = el.shadowRoot!.querySelector('.bubble') as HTMLElement;
    expect(bubble).toBeTruthy();
    // transform is a translate3d to the placed origin (down-right of cursor).
    expect(bubble.style.transform).toContain('translate');
  });

  it('uses pointer-events:none and a high z-index so it never blocks input', () => {
    const styles = (FloatingTooltipElement as unknown as { styles: CSSResult }).styles.cssText;
    expect(styles).toContain('pointer-events: none');
    expect(styles).toMatch(/z-index:\s*\d{4,}/);
    expect(styles).toContain('position: fixed');
  });
});
