import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { RailGestures, type RailAxis } from '../lib/rail-gestures';
import { tooltip } from '../lib/tooltip';
import { renderRailFill, railFillStyles } from './rail-fill';
import { renderRailOverlay, railOverlayStyles } from './rail-overlay';

/**
 * The draggable position track every rail is built from (#271 Part 2).
 *
 * Four surfaces drew one — `acp-cover-bar`'s `.track`, `acp-axis-bar`'s
 * `.track`, the cover tile's `.pos-slider` and the group tile's `.pos-slider` —
 * and each hand-wrote the same container: `role="slider"` plus its ARIA, five
 * pointer/click/keydown handlers into `RailGestures`, one `renderRailFill` /
 * `renderRailOverlay` call, and the track CSS. Part 1 unified the gesture math
 * and Part 3 the fill/overlay markup; this is the container itself, which is
 * exactly where `cover-bar.ts` was silently missed when the "moving to"
 * indicator first shipped (#272) and where the same class of bug nearly shipped
 * a second time during Part 3's own extraction.
 *
 * **Headless on purpose: the HOST stays the single source of truth for every
 * drawn value and every visibility rule.** This element owns markup, gestures
 * and ARIA *application* — it does not re-derive pending gating, auto-move
 * detection, spread collapse, mismatch tinting or drag suppression. Each
 * surface keeps computing those exactly as it does today and hands the answers
 * down as properties. A drag round-trips: the element dispatches
 * `acp-rail-preview`, the host stores it, recomputes its own chrome (readouts,
 * `.num` cells, spread collapse, pending suppression) and pushes updated drawn
 * props back down. Letting the element self-draw `preview ?? fillPct` would
 * fork those suppression rules into two places, which is the drift this whole
 * refactor exists to end.
 *
 * Service calls stay with the hosts too. The element dispatches semantic events
 * and nothing else, so `hass.callService` routing keeps the render-scope
 * context a callback could not reach — the group's snapshot, the tile's
 * per-row cover id, the axis bar's `acp-tilt-set`.
 *
 * Two shapes, one behaviour:
 *   - `variant="dialog"` — a single `.track` flex container, unprefixed
 *     `fill`/`fill-closed`/`marker` classes. The two dialog rails.
 *   - `variant="dense"` — `.pos-slider` wrapping a `.pos-bar`, `pos-` prefixed
 *     classes. The two tile rails. The wrapper is a bigger gesture target than
 *     the 6px bar it contains, and the readout slot lives on the WRAPPER so it
 *     escapes the bar's clipping (#260).
 *
 * Slots:
 *   - default — decorations drawn ON the rail (the group's spread band and
 *     per-member ticks), rendered between the overlay and the target marker.
 *     They stay light-DOM children, so the surface that styles them still
 *     reaches them with an ordinary class selector.
 *   - `readout` (dense only) — the drag readout bubble, a sibling of `.pos-bar`.
 *
 * Four host rules used to reach markup that is now element-internal, so each
 * became a custom-property knob (the codebase's established cross-boundary
 * pattern, same as `--acp-cover-color`): `--acp-rail-fill` (cover-bar's
 * mismatch tint), `--acp-rail-overflow` (the group's overhanging ticks),
 * `--acp-rail-height` (compact tracks) and `--acp-rail-hit` (the stacked tile
 * rails' shrunken grab boxes). Every fallback is today's value, so a host that
 * sets none of them renders unchanged.
 */
@customElement('acp-rail-track')
export class RailTrack extends LitElement {
  /** Only for the overlay's "moving to" label; the element reads no state. */
  @property({ attribute: false }) public hass!: HomeAssistant;

  /** Markup shape. See the class comment. */
  @property({ reflect: true }) public variant: 'dialog' | 'dense' = 'dialog';

  /** Gesture math only — never the fill geometry, which the host precomputes.
   *  Also the source of `aria-valuemin`/`aria-valuemax`. */
  @property({ attribute: false }) public axis: RailAxis = {
    min: 0,
    max: 100,
    openBlocksSun: true,
  };

  /** The LOGICAL base the keyboard steps from. Each host keeps its own policy
   *  for what that is — the group rail hands down its spread MINIMUM rather
   *  than an aggregate mean no member holds — so the element steps from
   *  whatever it is given instead of re-deriving one from `fillPct`. */
  @property({ attribute: false }) public value: number | null = null;

  /** Where the rail is filled to, as a DRAWN track percentage (0-100). */
  @property({ attribute: false }) public fillPct = 0;
  /** Trailing "closed" segment percentage; dialog variant only. `null` renders
   *  no second segment, matching `renderRailFill`'s single-segment shape. */
  @property({ attribute: false }) public closedPct: number | null = null;
  /** Solar target in axis units. `null` suppresses the marker entirely. */
  @property({ attribute: false }) public target: number | null = null;
  /** Where to draw the marker, DRAWN. Ignored while `target` is null. */
  @property({ attribute: false }) public targetPct = 0;
  /** Destination of a move in flight, in axis units — what the overlay's
   *  tooltip says. `null` suppresses the overlay. */
  @property({ attribute: false }) public pending: number | null = null;
  /** Where that destination sits, DRAWN. `null` suppresses the overlay too. */
  @property({ attribute: false }) public pendingPct: number | null = null;

  /** ARIA, computed host-side and applied verbatim: the host owns the i18n and
   *  the logical/drawn frame decisions behind each of these. */
  @property({ attribute: false }) public valueNow = 0;
  @property({ attribute: false }) public valueText = '';
  @property({ attribute: false }) public label = '';

  /** Track hint tooltip — `.track` on the dialog variant, `.pos-bar` on the
   *  dense one (same visual rect, and the node both dense rails have). Strings,
   *  not directives: the floating tooltip is a document-level singleton with
   *  per-element listeners, so the directive works fine inside this element's
   *  shadow root and the host only has to own the copy. */
  @property({ attribute: false }) public hint: string | null = null;
  /** Target-marker tooltip. Null on rails whose marker carries no copy. */
  @property({ attribute: false }) public targetTooltip: string | null = null;

  /** Non-interactive: out of the focus order, no gestures, no commits.
   *  Unavailable cover (#212) on the dialog rails, "not controllable" on the
   *  group rail. */
  @property({ type: Boolean, reflect: true }) public disabled = false;

  /** Gesture policy, forwarded to {@link RailGestures}. `'click'` is rails
   *  1-3: the preview starts on contact and the commit rides the browser's
   *  trailing compatibility click. `'release'` plus a threshold is the group
   *  rail, where a stray tap would flatten every member onto one value. */
  @property({ attribute: 'commit-on' }) public commitOn: 'click' | 'release' = 'click';
  @property({ type: Number, attribute: 'drag-threshold-px' }) public dragThresholdPx = 0;

  /** One track per element, so the controller's key is a constant. */
  private static readonly KEY = 'rail';

  /**
   * Built on first use rather than as a field.
   *
   * {@link RailGesturesOptions} is frozen in the controller's constructor,
   * while `commitOn`/`dragThresholdPx` arrive as properties AFTER this element
   * is constructed — a field initializer would capture the defaults and quietly
   * turn the group rail back into a tap-commits rail. Part 1's shipped API is
   * deliberately left alone; this is the accommodation on our side.
   */
  private _gestures: RailGestures | null = null;

  /** Last value handed to a listener, so `acp-rail-preview` fires on CHANGE
   *  rather than on every pointer event. */
  private _preview: number | null = null;

  /**
   * A drag that ends because the rail went away still ended.
   *
   * {@link RailGestures} clears its gesture in `hostDisconnected`, but that
   * happens INSIDE this element and the surface outside hears nothing — so the
   * host would keep painting a preview (the tile's readout, the group's
   * collapsed spread, every rail's suppressed pending band) for a gesture that
   * no longer exists. Before the merge the controller lived on the host and
   * cleared with it, so this announcement is what keeps that true.
   *
   * After `super`, so the controller has already cleared and `preview()` is
   * genuinely null. Never a commit: a gesture interrupted by teardown is
   * discarded, exactly as `pointercancel` is.
   */
  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._emitPreview();
  }

  private _rail(): RailGestures {
    if (!this._gestures) {
      this._gestures = new RailGestures(this, {
        commitOn: this.commitOn,
        dragThresholdPx: this.dragThresholdPx,
      });
    }
    return this._gestures;
  }

  private get _dragging(): boolean {
    return this._gestures?.isDragging(RailTrack.KEY) ?? false;
  }

  protected override render(): TemplateResult {
    const dense = this.variant === 'dense';
    const hint = this.hint !== null ? tooltip(this.hint) : nothing;
    const tip = this.targetTooltip === null ? undefined : tooltip(this.targetTooltip);
    // ONE call site for the fill / overlay / decorations / marker layer order —
    // the reason this element exists. On the dense rails every one of those is
    // `position: absolute; z-index: auto`, so DOM order IS paint order and a
    // flip sinks the "moving to" indicator under the fill (#272), invisible to
    // happy-dom. Both branches route through the same helper so neither can
    // re-derive an order of its own.
    const fill = dense
      ? renderRailFill({
          prefix: 'pos-',
          fillPct: this.fillPct,
          target: this.target,
          targetPct: this.targetPct,
          overlay: this._overlay('pos-'),
          decorations: html`<slot></slot>`,
          tooltip: tip,
        })
      : renderRailFill({
          prefix: '',
          fillPct: this.fillPct,
          closedPct: this.closedPct ?? undefined,
          target: this.target,
          targetPct: this.targetPct,
          overlay: this._overlay(''),
          decorations: html`<slot></slot>`,
          tooltip: tip,
        });
    return html`<div
      class="${dense ? 'pos-slider' : 'track'}${this.disabled ? ' disabled' : ''}${this._dragging
        ? ' dragging'
        : ''}"
      role="slider"
      tabindex=${this.disabled ? -1 : 0}
      aria-disabled=${this.disabled ? 'true' : 'false'}
      aria-valuemin=${this.axis.min}
      aria-valuemax=${this.axis.max}
      aria-valuenow=${this.valueNow}
      aria-valuetext=${this.valueText}
      aria-label=${this.label}
      @click=${this._onClick}
      @pointerdown=${this._onPointerDown}
      @pointermove=${this._onPointerMove}
      @pointerup=${this._onPointerUp}
      @pointercancel=${this._onPointerCancel}
      @keydown=${this._onKeydown}
      ${dense ? nothing : hint}
    >
      ${dense
        ? html`<div class="pos-bar" ${hint}>${fill}</div>
            <slot name="readout"></slot>`
        : fill}
    </div>`;
  }

  /** The "moving to" band + pip, gated on the host having decided there IS a
   *  move worth drawing. Both halves of the gate are the host's: this element
   *  never asks whether a cover is in motion. */
  private _overlay(prefix: '' | 'pos-'): TemplateResult | typeof nothing {
    if (!this.hass || this.pending === null || this.pendingPct === null) return nothing;
    return renderRailOverlay({
      hass: this.hass,
      liveFrac: this.fillPct,
      pendingFrac: this.pendingPct,
      pending: this.pending,
      prefix,
    });
  }

  // ── gesture wiring ─────────────────────────────────────────────────────────

  private _onClick = (e: MouseEvent): void => {
    if (this.disabled) return;
    // In `release` mode the commit already happened on pointerup, and the
    // browser's trailing compatibility click must not repeat it — `click`
    // fires for a tap and a drag alike and cannot tell them apart, which is
    // the whole reason that mode exists.
    if (this.commitOn === 'release') return;
    this._emitSet(this._rail().valueFromEvent(e, e.currentTarget as HTMLElement, this.axis));
  };

  private _onPointerDown = (e: PointerEvent): void => {
    if (this.disabled) return;
    this._rail().pointerDown(e, RailTrack.KEY, this.axis);
    this._emitPreview();
  };

  private _onPointerMove = (e: PointerEvent): void => {
    if (this.disabled || !this._gestures) return;
    this._gestures.pointerMove(e, RailTrack.KEY, this.axis);
    this._emitPreview();
  };

  private _onPointerUp = (): void => {
    if (!this._gestures) return;
    const value = this._gestures.pointerUp(RailTrack.KEY);
    // The null preview goes out BEFORE the commit: a host recomputing its
    // chrome from the preview stream has to see the drag end before it sees
    // the value land, or the readout it draws outlives the gesture that fed it.
    this._emitPreview();
    if (value !== null) this._emitSet(value);
  };

  private _onPointerCancel = (): void => {
    if (!this._gestures) return;
    this._gestures.pointerCancel(RailTrack.KEY);
    this._emitPreview();
  };

  private _onKeydown = (e: KeyboardEvent): void => {
    if (this.disabled) return;
    const next = this._rail().keydownValue(e, this.value, this.axis);
    if (next === null) return;
    this._emitSet(next);
  };

  /** The committed LOGICAL value. Hosts route the service call and start their
   *  own `PendingMoves` from here, exactly as they do today. */
  private _emitSet(value: number): void {
    this.dispatchEvent(
      new CustomEvent<number>('acp-rail-set', { detail: value, bubbles: true, composed: true }),
    );
  }

  /** The live LOGICAL drag value, or null when nothing is being dragged.
   *  Dispatched synchronously from the pointer handlers, and only on a change. */
  private _emitPreview(): void {
    const value = this._gestures?.preview(RailTrack.KEY) ?? null;
    if (value === this._preview) return;
    this._preview = value;
    this.dispatchEvent(
      new CustomEvent<number | null>('acp-rail-preview', {
        detail: value,
        bubbles: true,
        composed: true,
      }),
    );
  }

  public static styles = [
    railOverlayStyles,
    railFillStyles,
    css`
      :host {
        display: block;
      }

      /* ── dialog variant ────────────────────────────────────────────────── */
      /* One flex container holding both segments. --acp-rail-height is the
       compact knob: the cover bar and the axis bar both shrink their tracks to
       6px under their own compact selectors, which used to be host CSS
       reaching this element directly. */
      .track {
        position: relative;
        display: flex;
        height: var(--acp-rail-height, 10px);
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.08));
        border-radius: 6px;
        cursor: pointer;
        overflow: hidden;
        /* A touch-drag must move the fill, not scroll the page — own the gesture. */
        touch-action: none;
      }
      .track:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
      /* The 0.3s ease on the segments smooths server-driven updates; during a
       drag it reads as the fill lagging behind the finger, so drop it. */
      .track.dragging .fill,
      .track.dragging .fill-closed {
        transition: none;
      }
      /* Unavailable cover (#212): non-interactive, matching the up/stop/down
       controls disabled alongside it. */
      .track.disabled {
        cursor: default;
        touch-action: auto;
      }

      /* ── dense variant ─────────────────────────────────────────────────── */
      /* The wrapper is the gesture target and the positioning context; the 6px
       .pos-bar inside it is all that is visible. Layout (flex basis, max-width,
       margin-left:auto, stack placement) stays with the host, which is the only
       thing that knows how the rail sits in its row. */
      .pos-slider {
        position: relative;
        cursor: pointer;
        /* A touch-drag must move the fill, not scroll the dashboard. */
        touch-action: none;
      }
      /* The rail is 6px tall — too thin to grab on a phone. Widen the hit area
       vertically with an invisible absolute box, which adds no layout height.
       --acp-rail-hit is the knob the multi-cover tile stack uses to shrink it:
       rails sit tight there, and full-size grab boxes would overlap so the
       upper rail swallowed the lower one's top half. */
      .pos-slider::before {
        content: '';
        position: absolute;
        inset: var(--acp-rail-hit, -8px 0);
      }
      .pos-slider:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 3px;
        border-radius: 6px;
      }
      .pos-slider.dragging .pos-fill {
        transition: none;
      }
      /* Nothing to drive: match the buttons rather than looking live and
       no-oping. */
      .pos-slider.disabled {
        cursor: default;
        opacity: 0.4;
        touch-action: auto;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'acp-rail-track': RailTrack;
  }
}
