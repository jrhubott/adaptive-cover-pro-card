import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { formatPercent } from '../lib/formatters';
import { t } from '../lib/i18n';
import { tooltip } from '../lib/tooltip';

/**
 * Reusable single-axis track row — the venetian tilt (slat-angle) axis.
 *
 * Shared between the cover-bar (stacked under each Position bar) and the tile
 * card (compact mini bar). It is purely presentational: it renders the
 * click-to-set track plus the solar target marker and fires an `acp-tilt-set`
 * CustomEvent (`detail: number` 0–100) on click. The host wires that to the
 * integration's `set_tilt` service so service routing stays in one place.
 *
 * `layout="cover"` mirrors the cover-bar's `.cover` grid exactly so the tilt
 * track and its percentage line up with the Position row above it. `layout="tile"`
 * is a compact inline row (`TILT 35% [track]`) for the dense tile card.
 */
@customElement('acp-tilt-bar')
export class TiltBar extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  /** Live slat position (0–100) from the cover's `current_tilt_position`. */
  @property({ attribute: false }) public actual: number | null = null;
  /** Solar tilt target (0–100) from the `Cover_Tilt` sensor. */
  @property({ attribute: false }) public target: number | null = null;
  /** Cover colour, matching the position bar / compass wedge. */
  @property({ attribute: false }) public coverColor: string | null = null;
  /** Compact sizing (cover-bar compact mode). */
  @property({ type: Boolean, reflect: true }) public compact = false;
  /** Grid variant: align under the cover-bar position row, or inline tile row. */
  @property({ reflect: true }) public layout: 'cover' | 'tile' = 'cover';

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass) return nothing;
    const actualPct = this.actual ?? 0;
    const targetPct = this.target ?? 0;
    return html`
      <div
        class="row ${this.layout}"
        style=${this.coverColor ? `--acp-cover-color:${this.coverColor}` : nothing}
      >
        <span class="label">${t('covers.tilt_title', this.hass)}</span>
        <span class="num">${formatPercent(this.actual)}</span>
        <div
          class="track"
          @click=${this._onClick}
          ${tooltip(t('covers.tilt_click_to_set', this.hass))}
        >
          <div class="fill" style="width:${actualPct}%"></div>
          <div class="fill-closed" style="width:${100 - actualPct}%"></div>
          ${this.target !== null
            ? html`<div
                class="marker"
                style="left:clamp(1px, ${targetPct}%, calc(100% - 1px))"
                ${tooltip(t('covers.tilt_target_tooltip', this.hass, { pct: targetPct }))}
              ></div>`
            : nothing}
        </div>
      </div>
    `;
  }

  private _onClick(e: MouseEvent): void {
    const track = e.currentTarget as HTMLElement;
    const rect = track.getBoundingClientRect();
    const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const clamped = Math.max(0, Math.min(100, pct));
    this.dispatchEvent(
      new CustomEvent<number>('acp-tilt-set', { detail: clamped, bubbles: true, composed: true }),
    );
  }

  public static styles = css`
    :host {
      display: block;
    }
    .row {
      display: grid;
      align-items: center;
    }
    /* Cover-bar variant: mirror .cover's grid so the track + percentage line up
       with the Position row directly above (name | num | track | warn-spacer). */
    .row.cover {
      grid-template-columns: minmax(80px, 1fr) 48px 3fr 16px;
      gap: 8px;
      font-size: 0.82rem;
    }
    :host([compact]) .row.cover {
      gap: 6px;
      font-size: 0.75rem;
    }
    /* Tile variant: inline "TILT 35% [track]" — label then % then the bar. */
    .row.tile {
      grid-template-columns: auto auto 1fr;
      gap: 6px;
      font-size: 0.75rem;
    }
    .label {
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .num {
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .row.cover .num {
      text-align: right;
    }
    /* Track mirrors the position bar: open segment pale, closed solid — same
       hue as the cover wedge. */
    .track {
      position: relative;
      display: flex;
      height: 10px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.08));
      border-radius: 6px;
      cursor: pointer;
      overflow: hidden;
    }
    :host([compact]) .track,
    .row.tile .track {
      height: 6px;
    }
    .fill {
      height: 100%;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--acp-cover-color, var(--primary-color)) 18%, transparent);
      transition: width 0.3s ease;
    }
    .fill-closed {
      height: 100%;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--acp-cover-color, var(--primary-color)) 50%, transparent);
      transition: width 0.3s ease;
    }
    .marker {
      position: absolute;
      top: -2px;
      width: 2px;
      height: 14px;
      background: var(--accent-color, red);
      transform: translateX(-50%);
      transition: left 0.3s ease;
    }
  `;
}
