import { nothing, type ElementPart } from 'lit';
import { directive, AsyncDirective, PartType, type PartInfo } from 'lit/async-directive.js';

import { DEFAULT_TOOLTIP_OFFSET } from './geometry';
// Side-effect import: registers the `<acp-floating-tooltip>` custom element so
// the singleton manager can create it on demand.
import '../components/floating-tooltip';
import type { FloatingTooltipElement } from '../components/floating-tooltip';

/**
 * Card-owned floating tooltip.
 *
 * `tooltip(text, opts?)` is a Lit `AsyncDirective` applied to an element. While
 * floating tooltips are enabled it:
 *   - mirrors `text` onto `data-tooltip` and wires `aria-describedby` to the
 *     shared bubble's stable id (a11y),
 *   - installs pointer/focus/keyboard listeners that arm an open-delay timer,
 *     show the singleton bubble down-and-right of the cursor, follow the pointer,
 *     and dismiss on leave / blur / Escape / scroll,
 *   - drives a help→default cursor handoff via the `acp-tt-shown` attribute
 *     (CSS keys `cursor: help` on hover, `cursor: default` once OUR bubble shows).
 *
 * When disabled it degrades to a plain native `title=` (today's behavior) and
 * sets no `data-tooltip`/`aria-describedby`/listeners.
 *
 * All positioning math lives in `geometry.placeTooltip`; all rendering lives in
 * `<acp-floating-tooltip>`. This module owns only lifecycle + listeners.
 */

export interface TooltipOptions {
  /** Master switch. Default true. */
  enabled?: boolean;
  /** [right, down] cursor offset. Default [12, 16]. */
  offset?: readonly [number, number];
  /** Open delay in ms before the bubble appears. Default 400. */
  delay?: number;
}

interface ResolvedTooltipDefaults {
  enabled: boolean;
  offset: readonly [number, number];
  delay: number;
}

const moduleDefaults: ResolvedTooltipDefaults = {
  enabled: true,
  offset: DEFAULT_TOOLTIP_OFFSET,
  delay: 400,
};

/** Thread per-card config into the directive's module-level defaults. */
export function setTooltipDefaults(opts: TooltipOptions): void {
  if (opts.enabled !== undefined) moduleDefaults.enabled = opts.enabled;
  if (opts.offset !== undefined) moduleDefaults.offset = opts.offset;
  if (opts.delay !== undefined) moduleDefaults.delay = opts.delay;
}

const BUBBLE_ID = 'acp-floating-tooltip-bubble';

/**
 * Ref-counted manager for the single `<acp-floating-tooltip>` appended to
 * `document.body`. Lazily mounts on first show/connect and tracks how many live
 * directives reference it so it can stay mounted while any anchor is active.
 */
class FloatingTooltipManager {
  private _el: FloatingTooltipElement | null = null;
  private _refs = 0;

  public get id(): string {
    return BUBBLE_ID;
  }

  public retain(): void {
    this._refs += 1;
    // Mount eagerly on first reference so the single bubble exists in the DOM
    // (with its stable id for aria-describedby) before any hover.
    this._ensure();
  }

  public release(): void {
    this._refs = Math.max(0, this._refs - 1);
  }

  private _ensure(): FloatingTooltipElement | null {
    if (typeof document === 'undefined') return null;
    if (this._el && this._el.isConnected) return this._el;
    // Importing the element module registers the custom element.
    const el = document.createElement('acp-floating-tooltip') as FloatingTooltipElement;
    el.id = BUBBLE_ID;
    document.body.appendChild(el);
    this._el = el;
    return el;
  }

  public show(text: string, x: number, y: number, offset: readonly [number, number]): void {
    const el = this._ensure();
    if (!el) return;
    el.text = text;
    el.cursorX = x;
    el.cursorY = y;
    el.offset = offset;
    el.visible = true;
  }

  public move(x: number, y: number): void {
    if (!this._el || !this._el.visible) return;
    this._el.cursorX = x;
    this._el.cursorY = y;
  }

  public hide(): void {
    if (this._el) this._el.visible = false;
  }

  /** Test-only: tear the singleton down so each test starts clean. */
  public _reset(): void {
    if (this._el && this._el.parentNode) this._el.parentNode.removeChild(this._el);
    this._el = null;
    this._refs = 0;
  }
}

const manager = new FloatingTooltipManager();

/** Test-only helper to reset the shared singleton between cases. */
export function _resetTooltipSingleton(): void {
  manager._reset();
}

class TooltipDirective extends AsyncDirective {
  private _el: Element | null = null;
  private _text = '';
  private _offset: readonly [number, number] = DEFAULT_TOOLTIP_OFFSET;
  private _delay = 400;
  private _enabled = true;
  private _openTimer: ReturnType<typeof setTimeout> | null = null;
  private _shown = false;
  private _retained = false;
  private _lastX = 0;
  private _lastY = 0;

  // Bound listeners (stable references for add/removeEventListener).
  private _onEnter = (e: Event): void => this._handleEnter(e as PointerEvent);
  private _onMove = (e: Event): void => this._handleMove(e as PointerEvent);
  private _onLeave = (): void => this._dismiss();
  private _onFocus = (): void => this._handleFocus();
  private _onBlur = (): void => this._dismiss();
  private _onKey = (e: Event): void => {
    if ((e as KeyboardEvent).key === 'Escape') this._dismiss();
  };
  private _onScroll = (): void => this._dismiss();

  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('tooltip() can only be used as an element-part directive');
    }
  }

  public render(_text: string, _opts?: TooltipOptions): typeof nothing {
    return nothing;
  }

  public override update(part: ElementPart, [text, opts]: [string, TooltipOptions?]): unknown {
    const el = part.element;
    this._text = text ?? '';
    this._offset = opts?.offset ?? moduleDefaults.offset;
    this._delay = opts?.delay ?? moduleDefaults.delay;
    this._enabled = opts?.enabled ?? moduleDefaults.enabled;

    if (this._el !== el) {
      this._teardown();
      this._el = el;
      this._wire();
    } else {
      this._applyAttributes();
    }
    return this.render(text, opts);
  }

  private _wire(): void {
    const el = this._el;
    if (!el) return;
    this._applyAttributes();
    if (!this._enabled) return;
    manager.retain();
    this._retained = true;
    el.addEventListener('pointerenter', this._onEnter);
    el.addEventListener('pointermove', this._onMove);
    el.addEventListener('pointerleave', this._onLeave);
    el.addEventListener('focusin', this._onFocus);
    el.addEventListener('focusout', this._onBlur);
    el.addEventListener('keydown', this._onKey);
    window.addEventListener('scroll', this._onScroll, true);
  }

  private _applyAttributes(): void {
    const el = this._el;
    if (!el) return;
    if (this._enabled) {
      el.removeAttribute('title');
      el.setAttribute('data-tooltip', this._text);
      el.setAttribute('aria-describedby', manager.id);
    } else {
      el.removeAttribute('data-tooltip');
      el.removeAttribute('aria-describedby');
      el.removeAttribute('acp-tt-shown');
      el.setAttribute('title', this._text);
    }
  }

  private _handleEnter(e: PointerEvent): void {
    this._lastX = e.clientX;
    this._lastY = e.clientY;
    this._armOpen();
  }

  private _handleFocus(): void {
    const el = this._el as HTMLElement | null;
    if (el && typeof el.getBoundingClientRect === 'function') {
      const r = el.getBoundingClientRect();
      this._lastX = r.left + r.width / 2;
      this._lastY = r.bottom;
    }
    this._armOpen();
  }

  private _armOpen(): void {
    if (this._openTimer !== null) return;
    this._openTimer = setTimeout(() => {
      this._openTimer = null;
      this._open();
    }, this._delay);
  }

  private _open(): void {
    if (!this._el) return;
    manager.show(this._text, this._lastX, this._lastY, this._offset);
    this._shown = true;
    this._el.setAttribute('acp-tt-shown', '');
  }

  private _handleMove(e: PointerEvent): void {
    this._lastX = e.clientX;
    this._lastY = e.clientY;
    if (this._shown) manager.move(this._lastX, this._lastY);
  }

  private _dismiss(): void {
    if (this._openTimer !== null) {
      clearTimeout(this._openTimer);
      this._openTimer = null;
    }
    if (this._shown) {
      manager.hide();
      this._shown = false;
    }
    this._el?.removeAttribute('acp-tt-shown');
  }

  private _teardown(): void {
    const el = this._el;
    if (!el) return;
    this._dismiss();
    el.removeEventListener('pointerenter', this._onEnter);
    el.removeEventListener('pointermove', this._onMove);
    el.removeEventListener('pointerleave', this._onLeave);
    el.removeEventListener('focusin', this._onFocus);
    el.removeEventListener('focusout', this._onBlur);
    el.removeEventListener('keydown', this._onKey);
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this._onScroll, true);
    }
    if (this._retained) {
      manager.release();
      this._retained = false;
    }
    this._el = null;
  }

  public override disconnected(): void {
    this._teardown();
  }

  public override reconnected(): void {
    this._wire();
  }
}

export const tooltip = directive(TooltipDirective);
