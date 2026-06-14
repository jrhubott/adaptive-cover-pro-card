import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { placeTooltip, DEFAULT_TOOLTIP_OFFSET } from '../lib/geometry';

/**
 * `<acp-floating-tooltip>` — the card-owned tooltip bubble.
 *
 * A single instance is appended to `document.body` by the FloatingTooltip
 * singleton (see `lib/tooltip.ts`) and repositioned/retexted as the pointer
 * moves between anchored elements. It renders a `position: fixed`, high
 * `z-index`, `pointer-events: none` bubble so it floats above the dashboard
 * without ever intercepting input.
 *
 * Positioning math lives in `geometry.placeTooltip`; this element only measures
 * its own bubble and applies the resulting transform.
 */
@customElement('acp-floating-tooltip')
export class FloatingTooltipElement extends LitElement {
  /** The tooltip text. */
  @property({ type: String }) public text = '';
  /** Pointer (or anchor) X in viewport coordinates. */
  @property({ type: Number }) public cursorX = 0;
  /** Pointer (or anchor) Y in viewport coordinates. */
  @property({ type: Number }) public cursorY = 0;
  /** [right, down] offset from the cursor. */
  @property({ attribute: false }) public offset: readonly [number, number] = DEFAULT_TOOLTIP_OFFSET;
  /** Whether the bubble is currently shown. Reflected so CSS + tests can key off it. */
  @property({ type: Boolean, reflect: true }) public visible = false;

  @state() private _x = 0;
  @state() private _y = 0;

  public connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'tooltip');
  }

  protected updated(): void {
    if (!this.visible) return;
    this.setAttribute('aria-hidden', 'false');
    // Measure the rendered bubble, then re-place. happy-dom returns 0-sized
    // rects, so the math degrades to the cursor+offset origin in tests.
    const bubble = this.shadowRoot?.querySelector('.bubble') as HTMLElement | null;
    const w = bubble?.offsetWidth ?? 0;
    const h = bubble?.offsetHeight ?? 0;
    const vpW = typeof window !== 'undefined' ? window.innerWidth : 0;
    const vpH = typeof window !== 'undefined' ? window.innerHeight : 0;
    const { x, y } = placeTooltip({
      cursorX: this.cursorX,
      cursorY: this.cursorY,
      ttW: w,
      ttH: h,
      vpW,
      vpH,
      offset: this.offset,
    });
    if (x !== this._x) this._x = x;
    if (y !== this._y) this._y = y;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.visible) {
      this.setAttribute('aria-hidden', 'true');
      return nothing;
    }
    return html`<div class="bubble" style="transform: translate3d(${this._x}px, ${this._y}px, 0)">
      ${this.text}
    </div>`;
  }

  public static styles = css`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100000;
      pointer-events: none;
    }
    :host(:not([visible])) {
      display: none;
    }
    .bubble {
      position: absolute;
      top: 0;
      left: 0;
      width: max-content;
      max-width: 280px;
      padding: 6px 10px;
      border-radius: 6px;
      background: var(--acp-tooltip-bg, rgba(40, 40, 40, 0.96));
      color: var(--acp-tooltip-fg, #fff);
      font-size: 0.78rem;
      line-height: 1.35;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
      white-space: normal;
      word-break: break-word;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'acp-floating-tooltip': FloatingTooltipElement;
  }
}
