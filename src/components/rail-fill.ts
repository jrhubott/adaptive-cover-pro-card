import { css, html, nothing, unsafeCSS, type CSSResult, type TemplateResult } from 'lit';
import type { DirectiveResult } from 'lit/directive.js';

import { COVER_ACTIVE_COLOR } from '../lib/icons';

/**
 * The fill + target-marker markup shared by every position rail.
 *
 * Four surfaces draw position tracks — `acp-cover-bar`, `acp-axis-bar`, the
 * cover tile's `_posBar` and the group tile's `pos-slider` — and the leading
 * fill, the (optional) trailing "closed" segment, and the target marker were
 * pixel-identical hand-copies on all of them: same `color-mix()` blend on the
 * two dialog rails, same `--acp-pos-fill-color` token on the two dense tile
 * rails, same `clamp(1px, …, calc(100% - 1px))` marker geometry. That is
 * exactly the shape #271 flags as having already drifted once per feature.
 *
 * A render helper plus a stylesheet fragment, not its own custom element —
 * same rationale as `rail-overlay.ts`: each rail's track lives in its own
 * shadow root, and moving the fill/marker behind a nested one would put them
 * out of reach of the ~400 existing shadow-DOM assertions that query them.
 *
 * `prefix` names the classes so a rail keeps its existing vocabulary: the
 * dialog bars use `fill`/`fill-closed`/`marker`, the dense tile rails
 * `pos-fill`/`pos-fill-closed`/`pos-marker`. `closedPct` is opt-in — only the
 * two-segment dialog rails draw a trailing segment; the dense tile rails and
 * the group rail's non-spread fast path render `.fill` alone. `target: null`
 * suppresses the marker entirely (a group write has no single target). The
 * marker's tooltip text differs per surface (cover-bar/tilt-bar carry i18n
 * copy, the tile card's marker has none), so it is threaded through as an
 * already-built directive result rather than owned here.
 */
export interface RailFillOptions {
  /** Where the cover is now, as a DRAWN track percentage (0-100). */
  fillPct: number;
  /** Trailing "closed" segment percentage. Opt-in: only the two-segment
   *  dialog rails (`acp-cover-bar` / `acp-axis-bar`) draw a second segment. */
  closedPct?: number;
  /** The target in axis units. `null` suppresses the marker entirely. */
  target: number | null;
  /** Where to draw the marker, as a DRAWN track percentage. Ignored when
   *  `target` is null. */
  targetPct: number;
  /** Class prefix: '' → `fill`/`fill-closed`/`marker`, 'pos-' →
   *  `pos-fill`/`pos-fill-closed`/`pos-marker`. */
  prefix?: '' | 'pos-';
  /** Marker tooltip, an already-built element-part directive result (e.g.
   *  `tooltip(text)`). i18n stays owned by the host — the tile card's marker
   *  passes none. */
  tooltip?: DirectiveResult;
  /** The "moving to" overlay (typically a `renderRailOverlay(...)` result, or
   *  `nothing`), rendered between the fill segments and the marker. On the
   *  two-segment dialog rails `.fill`/`.fill-closed` are unpositioned flex
   *  items, so their place in this order is cosmetic. On the dense tile
   *  rails `.pos-fill`, the overlay's `.pos-travel`/`.pos-pending`, and
   *  `.pos-marker` are all `position: absolute` with `z-index: auto` — DOM
   *  order there IS paint order, so this slot is what keeps the fill under
   *  the travel band and the marker on top of both, instead of leaving each
   *  rail to re-derive that ordering itself. */
  overlay?: TemplateResult | typeof nothing;
}

export function renderRailFill(opts: RailFillOptions): TemplateResult {
  const { fillPct, closedPct, target, targetPct, tooltip: tip, overlay } = opts;
  const prefix = opts.prefix ?? '';
  return html`<div class=${`${prefix}fill`} style="width:${fillPct}%"></div>
    ${closedPct !== undefined
      ? html`<div class=${`${prefix}fill-closed`} style="width:${closedPct}%"></div>`
      : nothing}
    ${overlay ?? nothing}
    ${target !== null
      ? html`<div
          class=${`${prefix}marker`}
          style="left:clamp(1px, ${targetPct}%, calc(100% - 1px))"
          ${tip !== undefined ? tip : nothing}
        ></div>`
      : nothing}`;
}

/**
 * The fill/marker styles, for a rail's `static styles` array.
 *
 * `.fill`/`.fill-closed` (dialog rails) and `.pos-fill` (dense tile rails)
 * are NOT the same rule — the dialog rails blend translucency via
 * `color-mix()`, the dense rails paint a themeable token at fixed opacity —
 * so they stay as separate rule bodies rather than a shared selector list
 * the way `rail-overlay.ts` combines its band/pip. `.pos-bar` (the dense
 * rail's track) is included too: its markup stays host-owned (it also wraps
 * the drag readout), but its CSS was byte-identical between the tile card
 * and the group tile, so it belongs here alongside the rule it clips.
 */
export const railFillStyles: CSSResult = css`
  /* Both segments derive from the cover colour (override, else --primary-color),
   distinguished by opacity: blocking is solid, clear is pale — "lighter =
   more open" — matching the compass FOV (light) vs cover wedge (solid) of
   the same hue. No gold, so nothing competes with the gold sun on the compass.

   .fill is the LEADING segment and carries the sun-blocking portion, so the
   track fills from the left as the cover closes — the same polarity as the
   tile rails and the compass wedge. Class names are kept (a rename buys
   nothing the comment does not) but the colours swapped with the meaning. */
  .fill {
    height: 100%;
    flex-shrink: 0;
    background: color-mix(in srgb, var(--acp-cover-color, var(--primary-color)) 50%, transparent);
    transition: width 0.3s ease;
  }
  .fill-closed {
    height: 100%;
    flex-shrink: 0;
    background: color-mix(in srgb, var(--acp-cover-color, var(--primary-color)) 18%, transparent);
    transition: width 0.3s ease;
  }
  /* The marker is centred on its left value via translateX(-50%) and its left
   is clamped 1px inside the rail (inline), so the 2px box never gets clipped
   by the track's overflow:hidden at the 0%/100% extremes (#158). */
  .marker {
    position: absolute;
    top: -2px;
    width: 2px;
    height: 14px;
    background: var(--accent-color, red);
    transform: translateX(-50%);
    transition: left 0.3s ease;
  }
  .pos-bar {
    position: relative;
    width: 100%;
    height: 6px;
    border-radius: 6px;
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
    overflow: hidden;
  }
  /* One constant color for every rail, never the cover's state color: a rail
   that changed hue as it crossed open/closed read as a status light rather
   than a measurement, and on a multi-rail tile the rails disagreed with each
   other. The icon still carries state color (the state_color option), which
   is where that signal belongs. Overridable per-theme via
   --acp-pos-fill-color. */
  .pos-fill {
    position: absolute;
    inset: 0 auto 0 0;
    background: var(--acp-pos-fill-color, ${unsafeCSS(COVER_ACTIVE_COLOR)});
    opacity: 0.55;
    border-radius: 6px;
    transition: width 0.3s ease;
  }
  .pos-marker {
    position: absolute;
    top: 0;
    width: 2px;
    height: 100%;
    background: var(--accent-color, #ff9800);
    transform: translateX(-50%);
    transition: left 0.3s ease;
  }
`;
