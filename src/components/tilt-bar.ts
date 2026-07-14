import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { formatPercent } from '../lib/formatters';
import { t } from '../lib/i18n';
import { tooltip } from '../lib/tooltip';

/**
 * Reusable single-axis track row — generalizes the original venetian tilt
 * (slat-angle) row into any secondary cover axis.
 *
 * Shared between the cover-bar (stacked under each Position bar) and the tile
 * card (compact mini bar). It is purely presentational: it renders the
 * click-to-set track plus the solar target marker and fires an `acp-tilt-set`
 * CustomEvent (`detail: number` in [min,max]) on click. The host wires that to
 * `setAxes()` so service routing stays in one place.
 *
 * `label`/`min`/`max`/`unit` default to the original tilt values (Tilt title,
 * 0–100, %), so an un-parameterized `acp-tilt-bar` renders exactly as before.
 * Fill/marker geometry and click math derive from `min`/`max`, not literal
 * 0/100, so a non-0–100 axis maps correctly.
 *
 * `layout="cover"` mirrors the cover-bar's `.cover` grid exactly so the axis
 * track and its percentage line up with the Position row above it.
 * `layout="tile"` is a compact inline row for the dense tile card.
 */
@customElement('acp-axis-bar')
export class AxisBar extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  /** Live axis value from the cover's per-axis state attribute. */
  @property({ attribute: false }) public actual: number | null = null;
  /** Solar target from the axis's target sensor. */
  @property({ attribute: false }) public target: number | null = null;
  /** Cover colour, matching the position bar / compass wedge. */
  @property({ attribute: false }) public coverColor: string | null = null;
  /** Compact sizing (cover-bar compact mode). */
  @property({ type: Boolean, reflect: true }) public compact = false;
  /** Non-interactive when true (e.g. the underlying cover is unavailable):
   *  the track ignores clicks and does not dispatch `acp-tilt-set`. */
  @property({ type: Boolean, reflect: true }) public disabled = false;
  /** Grid variant: align under the cover-bar position row, or inline tile row. */
  @property({ reflect: true }) public layout: 'cover' | 'tile' = 'cover';
  /** Display label. When null, falls back to the tilt title (original behavior). */
  @property({ attribute: false }) public label: string | null = null;
  /** Axis range lower bound (defaults to the original 0). */
  @property({ type: Number }) public min = 0;
  /** Axis range upper bound (defaults to the original 100). */
  @property({ type: Number }) public max = 100;
  /** Axis unit (defaults to the original '%'). Forward-looking; not yet
   *  rendered in the compact label. */
  @property() public unit = '%';

  /** Map an axis value onto a 0–100 track fraction using min/max. */
  private _frac(v: number | null): number {
    const value = v ?? this.min;
    const span = this.max - this.min;
    if (span === 0) return 0;
    const pct = ((value - this.min) / span) * 100;
    return Math.max(0, Math.min(100, pct));
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass) return nothing;
    const actualFrac = this._frac(this.actual);
    const targetFrac = this._frac(this.target);
    const label = this.label ?? t('covers.tilt_title', this.hass);
    return html`
      <div
        class="row ${this.layout}"
        style=${this.coverColor ? `--acp-cover-color:${this.coverColor}` : nothing}
      >
        <span class="label">${label}</span>
        <span class="num">${formatPercent(this.actual)}</span>
        <div
          class="track ${this.disabled ? 'disabled' : ''}"
          @click=${this._onClick}
          ${tooltip(t('covers.tilt_click_to_set', this.hass))}
        >
          <div class="fill" style="width:${actualFrac}%"></div>
          <div class="fill-closed" style="width:${100 - actualFrac}%"></div>
          ${this.target !== null
            ? html`<div
                class="marker"
                style="left:clamp(1px, ${targetFrac}%, calc(100% - 1px))"
                ${tooltip(t('covers.tilt_target_tooltip', this.hass, { pct: targetFrac }))}
              ></div>`
            : nothing}
        </div>
      </div>
    `;
  }

  private _onClick(e: MouseEvent): void {
    if (this.disabled) return;
    const track = e.currentTarget as HTMLElement;
    const rect = track.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    const raw = this.min + frac * (this.max - this.min);
    const clamped = Math.max(this.min, Math.min(this.max, Math.round(raw)));
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
    /* Unavailable cover (issue #212): non-interactive track — no click-to-set,
       matching the up/stop/down controls disabled elsewhere on the tile. */
    .track.disabled {
      cursor: default;
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

/**
 * Back-compat alias. The original tag was `acp-tilt-bar`; keep it registered
 * (as a no-op subclass) so existing hosts/tests that reference the tag continue
 * to resolve to the generalized element.
 */
if (!customElements.get('acp-tilt-bar')) {
  customElements.define('acp-tilt-bar', class extends AxisBar {});
}
