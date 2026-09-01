import { css, html, nothing, type CSSResult, type TemplateResult } from 'lit';
import type { HomeAssistant } from 'custom-card-helpers';

import { t } from '../lib/i18n';
import { travelBand } from '../lib/pending-move';
import { tooltip } from '../lib/tooltip';

/**
 * The "moving to" overlay, shared by every position rail.
 *
 * Four surfaces draw position tracks — `acp-cover-bar`, `acp-axis-bar`, the
 * cover tile's `_posBar` and the group tile's `pos-slider` — and the travel band
 * and destination pip are pixel-identical on all of them. Written per-surface
 * they were four copies of the same two elements and the same twenty lines of
 * CSS, which is exactly how the four rails drifted apart in the first place.
 *
 * A render helper plus a stylesheet fragment rather than an element of its own,
 * for a reason that outlived the four separate tracks: the overlay is
 * absolutely positioned against the track it belongs to, so as a nested element
 * it would need that track's box passed in, and it has to sit in the SAME flat
 * layer stack as the fill and the marker for DOM order to keep meaning paint
 * order. #271 Part 2 merged the four tracks into `acp-rail-track`, which now
 * makes this call once inside its own shadow root — the helper stayed a helper,
 * and the element it feeds is where the single source of truth ended up.
 *
 * `prefix` names the classes so a rail keeps its existing vocabulary: the
 * dialog bars use `travel`/`pending-marker`, the dense tile rails `pos-travel`/
 * `pos-pending`.
 */
export interface RailOverlayOptions {
  hass: HomeAssistant;
  /** Where the cover is now, as a DRAWN track percentage. */
  liveFrac: number;
  /** Where it is heading, as a DRAWN track percentage. */
  pendingFrac: number;
  /** The destination in axis units — what the tooltip says, never the drawn
   *  fraction: the two diverge the moment the axis is mirrored. */
  pending: number;
  /** Class prefix: '' → `travel` / `pending-marker`, 'pos-' → `pos-travel` /
   *  `pos-pending`. */
  prefix?: '' | 'pos-';
}

export function renderRailOverlay(opts: RailOverlayOptions): TemplateResult | typeof nothing {
  const { hass, liveFrac, pendingFrac, pending } = opts;
  const prefix = opts.prefix ?? '';
  const band = travelBand(liveFrac, pendingFrac);
  const label = t('covers.moving_to', hass, { pct: pending });
  const bandClass = `${prefix}travel`;
  const pipClass = prefix === '' ? 'pending-marker' : `${prefix}pending`;
  return html`<div
      class=${bandClass}
      style="left:${band.left}%;width:${band.width}%"
      ${tooltip(label)}
    ></div>
    <div
      class=${pipClass}
      style="left:clamp(1px, ${pendingFrac}%, calc(100% - 1px))"
      ${tooltip(label)}
    ></div>`;
}

/**
 * The overlay's styles, for a rail's `static styles` array.
 *
 * Two rules, both load-bearing:
 *
 * The band is STRIPED rather than a flat tint so it never reads as a second
 * fill — the solid fill beside it is the only thing claiming to be the cover's
 * real position. Animating its width makes it visibly shrink as the cover
 * closes the gap, which is the whole point of drawing a band instead of just a
 * mark.
 *
 * The pip is a different SHAPE from the solar-target marker, not merely a
 * different colour. The two share one track, and colour alone would not
 * separate them for a colour-blind user.
 *
 * Colour resolves through each rail's OWN existing variable rather than making
 * every host publish a new one: the dialog bars already thread
 * `--acp-cover-color` (per-cover tint) and the tile rails `--acp-pos-fill-color`
 * (theme override), so the chain picks up whichever the surrounding rail set.
 * `--acp-rail-accent` overrides both when a host wants the overlay to differ
 * from its fill.
 */
export const railOverlayStyles: CSSResult = css`
  .travel,
  .pos-travel {
    position: absolute;
    top: 0;
    bottom: 0;
    height: 100%;
    pointer-events: none;
    border-radius: inherit;
    background: repeating-linear-gradient(
      135deg,
      var(
          --acp-rail-accent,
          var(--acp-cover-color, var(--acp-pos-fill-color, var(--primary-color)))
        )
        0 4px,
      transparent 4px 8px
    );
    opacity: 0.45;
    transition:
      left 0.3s ease,
      width 0.3s ease;
  }
  .pending-marker,
  .pos-pending {
    position: absolute;
    top: 50%;
    width: 8px;
    height: 8px;
    pointer-events: none;
    background: var(
      --acp-rail-accent,
      var(--acp-cover-color, var(--acp-pos-fill-color, var(--primary-color)))
    );
    border: 1px solid var(--card-background-color, #fff);
    transform: translate(-50%, -50%) rotate(45deg);
    transition: left 0.3s ease;
  }
  /* The dense tile rails are 6px tall; a full-size pip would overhang them. */
  .pos-pending {
    width: 7px;
    height: 7px;
  }
  .pos-travel {
    background: repeating-linear-gradient(
      135deg,
      var(
          --acp-rail-accent,
          var(--acp-cover-color, var(--acp-pos-fill-color, var(--primary-color)))
        )
        0 3px,
      transparent 3px 6px
    );
  }
`;
