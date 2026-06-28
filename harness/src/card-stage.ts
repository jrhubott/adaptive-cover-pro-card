import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';
import {
  CARD_NAME,
  DECISION_CARD_NAME,
  SKY_COMPASS_CARD_NAME,
  TILE_CARD_NAME,
} from '../../src/const';
import { _resetRegistryStore } from '../../src/lib/registry-store';
import type { HarnessConfig } from './types';

interface CardElement extends HTMLElement {
  setConfig?: (config: Record<string, unknown>) => void;
  hass?: HomeAssistant;
}

@customElement('acp-harness-card-stage')
export class AcpHarnessCardStage extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) config!: HarnessConfig;
  /** When set, render only this card; undefined renders all enabled cards
   *  (the contract the config tests and capture scripts rely on). */
  @property({ attribute: false }) activeCard?: 'root' | 'compass' | 'tile' | 'decision';
  /** Device-preview mode (rendered inside a device-sized iframe): drop the
   *  harness chrome (headings, padding, max-width) and let the card fill the
   *  viewport full-bleed like a real phone, ignoring the tile-width control —
   *  the device width is the width. */
  @property({ type: Boolean, reflect: true }) embed = false;

  private _rootEl?: CardElement;
  private _compassEl?: CardElement;
  private _tileEls: CardElement[] = [];
  private _decisionEl?: CardElement;
  private _entrySig?: string;

  /** True when `card` should render — either it's the active card, or no active
   *  card is set (render-all mode for the config tests and capture scripts). */
  private _shows(card: 'root' | 'compass' | 'tile' | 'decision'): boolean {
    return this.activeCard === undefined || this.activeCard === card;
  }

  protected render(): TemplateResult {
    return html`
      ${this._shows('root')
        ? html`
            ${this.embed
              ? ''
              : html`<h2 class="card-heading">Root card · <code>custom:${CARD_NAME}</code></h2>`}
            ${this.config.root.enabled
              ? html`<div class="card-host" id="root-host"></div>`
              : html`<p class="disabled">Disabled — toggle in Per-card config.</p>`}
          `
        : ''}
      ${this._shows('compass')
        ? html`
            ${this.embed
              ? ''
              : html`<h2 class="card-heading">
                  Sky compass card · <code>custom:${SKY_COMPASS_CARD_NAME}</code>
                </h2>`}
            ${this.config.compass.enabled
              ? html`<div
                  class="card-host"
                  id="compass-host"
                  style=${this._compassHostStyle()}
                ></div>`
              : html`<p class="disabled">Disabled — toggle in Per-card config.</p>`}
          `
        : ''}
      ${this._shows('tile')
        ? html`
            ${this.embed
              ? ''
              : html`<h2 class="card-heading">
                  Tile card · <code>custom:${TILE_CARD_NAME}</code>
                  <span class="hint"
                    >(one per entry — open to see more-info dialog with forecast)</span
                  >
                </h2>`}
            ${this.config.tile.enabled
              ? html`<div class="tile-row" id="tile-host" style=${this._tileRowStyle()}></div>`
              : html`<p class="disabled">Disabled — toggle in Per-card config.</p>`}
          `
        : ''}
      ${this._shows('decision')
        ? html`
            ${this.embed
              ? ''
              : html`<h2 class="card-heading">
                  Decision card · <code>custom:${DECISION_CARD_NAME}</code>
                </h2>`}
            ${this.config.decision.enabled
              ? html`<div class="card-host" id="decision-host"></div>`
              : html`<p class="disabled">Disabled — toggle in Per-card config.</p>`}
          `
        : ''}
    `;
  }

  /** When a tile width is simulated (issue #136), pin every tile to exactly
   *  that many px so the card receives a narrow inline-size; 0 falls back to
   *  the auto-fill grid (≥360px tiles). In device-preview mode the iframe's
   *  viewport already governs the width, so stack tiles full-bleed in a single
   *  column and ignore the tile-width control. */
  private _tileRowStyle(): string {
    if (this.embed) return 'grid-template-columns: 1fr;';
    const w = this.config.tile.tileWidth;
    return w > 0 ? `grid-template-columns: repeat(auto-fill, ${w}px); justify-content: start;` : '';
  }

  /** When a stage height is simulated (issue #146), cap the compass card-host
   *  to a fixed pixel height and clip overflow, mimicking HA's fixed grid-row
   *  height in a Sections dashboard; 0 lets the card grow freely. */
  private _compassHostStyle(): string {
    const h = this.config.stageHeight;
    return h > 0 ? `height: ${h}px; overflow: hidden;` : '';
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has('config') || changed.has('activeCard') || !this._rootEl) this._syncCards();
    // Push hass on activeCard change too: switching tabs mounts a card that was
    // never created before, and without this it would render blank (no hass).
    if (changed.has('hass') || changed.has('config') || changed.has('activeCard')) this._pushHass();
  }

  private _syncCards(): void {
    // The mock entity registry is rebuilt per scenario, but each card fetches it
    // once and caches it — the mock's event subscription is a no-op, so the cards
    // never see an entity_registry_updated event and never refetch. When the
    // configured entry set changes, tear down every card so each remounts and
    // refetches the registry for the new entries. Without this, discovery runs
    // against the previous scenario's entities and a switch to e.g. the
    // multi-window scenario renders "No matching Adaptive Cover Pro entities".
    //
    // The registry fetch is also memoized process-wide (registry-store.ts shares
    // one fetch across every card on a real dashboard). In the harness that cache
    // would survive a scenario switch and hand the remounted cards the *previous*
    // scenario's registry — so each tile renders "entry <id> not found". Clearing
    // the shared store here forces a fresh fetch against the new mock hass, the
    // dev-tool equivalent of HA emitting entity_registry_updated.
    const entrySig = this.config.entries.map((e) => e.entry_id).join(',');
    if (this._entrySig !== undefined && entrySig !== this._entrySig) {
      _resetRegistryStore();
      this._rootEl?.remove();
      this._rootEl = undefined;
      this._compassEl?.remove();
      this._compassEl = undefined;
      for (const el of this._tileEls) el.remove();
      this._tileEls = [];
      this._decisionEl?.remove();
      this._decisionEl = undefined;
    }
    this._entrySig = entrySig;

    const rootHost = this.renderRoot.querySelector<HTMLElement>('#root-host');
    if (this.config.root.enabled && rootHost) {
      if (!this._rootEl) {
        this._rootEl = document.createElement(CARD_NAME) as CardElement;
        rootHost.appendChild(this._rootEl);
      } else if (this._rootEl.parentElement !== rootHost) {
        rootHost.appendChild(this._rootEl);
      }
      this._rootEl.setConfig?.(this._rootConfig());
    } else if (this._rootEl && !this.config.root.enabled) {
      this._rootEl.remove();
      this._rootEl = undefined;
    }

    const compassHost = this.renderRoot.querySelector<HTMLElement>('#compass-host');
    if (this.config.compass.enabled && compassHost) {
      if (!this._compassEl) {
        this._compassEl = document.createElement(SKY_COMPASS_CARD_NAME) as CardElement;
        compassHost.appendChild(this._compassEl);
      } else if (this._compassEl.parentElement !== compassHost) {
        compassHost.appendChild(this._compassEl);
      }
      this._compassEl.setConfig?.(this._compassConfig());
    } else if (this._compassEl && !this.config.compass.enabled) {
      this._compassEl.remove();
      this._compassEl = undefined;
    }

    const tileHost = this.renderRoot.querySelector<HTMLElement>('#tile-host');
    if (this.config.tile.enabled && tileHost) {
      // One tile per entry. Recreate from scratch when entry count changes.
      const want = this.config.entries.length;
      while (this._tileEls.length > want) {
        const el = this._tileEls.pop();
        el?.remove();
      }
      while (this._tileEls.length < want) {
        const el = document.createElement(TILE_CARD_NAME) as CardElement;
        tileHost.appendChild(el);
        this._tileEls.push(el);
      }
      this._tileEls.forEach((el, i) => {
        // Switching tabs destroys and recreates the conditional #tile-host div,
        // detaching the retained tiles. When the entry count is unchanged the
        // create/remove loops above don't run, so re-parent here (as the root and
        // compass cards do) or the tile tab renders blank on return.
        if (el.parentElement !== tileHost) tileHost.appendChild(el);
        el.setConfig?.(this._tileConfig(this.config.entries[i].entry_id));
      });
    } else if (this._tileEls.length && !this.config.tile.enabled) {
      for (const el of this._tileEls) el.remove();
      this._tileEls = [];
    }

    const decisionHost = this.renderRoot.querySelector<HTMLElement>('#decision-host');
    if (this.config.decision.enabled && decisionHost) {
      if (!this._decisionEl) {
        this._decisionEl = document.createElement(DECISION_CARD_NAME) as CardElement;
        decisionHost.appendChild(this._decisionEl);
      } else if (this._decisionEl.parentElement !== decisionHost) {
        decisionHost.appendChild(this._decisionEl);
      }
      this._decisionEl.setConfig?.(this._decisionConfig());
    } else if (this._decisionEl && !this.config.decision.enabled) {
      this._decisionEl.remove();
      this._decisionEl = undefined;
    }
  }

  private _pushHass(): void {
    if (this._rootEl) this._rootEl.hass = this.hass;
    if (this._compassEl) this._compassEl.hass = this.hass;
    for (const t of this._tileEls) t.hass = this.hass;
    if (this._decisionEl) this._decisionEl.hass = this.hass;
  }

  private _rootConfig(): Record<string, unknown> {
    const r = this.config.root;
    return {
      type: `custom:${CARD_NAME}`,
      entry_id: this.config.entries[0].entry_id,
      show_sections: Object.entries(r.show_sections)
        .filter(([, on]) => on)
        .map(([k]) => k),
      compact: r.compact,
      show_compass_stats: r.show_compass_stats,
      show_compass_legend: r.show_compass_legend,
      show_moon: r.show_moon,
      hide_inactive_handlers: r.hide_inactive_handlers,
      show_decision_summary: r.show_decision_summary,
      cover_colors: [this.config.entries[0].color],
      north_offset: r.north_offset,
      tooltips: this._tooltipsConfig(),
    };
  }

  /** Map the harness tooltips options onto the card's `tooltips` config.
   *  `floating` → enabled; `native` → disabled (native browser tooltips). */
  private _tooltipsConfig(): Record<string, unknown> {
    const tt = this.config.tooltips;
    return {
      enabled: tt.mode === 'floating',
      offset: tt.offset,
    };
  }

  private _compassConfig(): Record<string, unknown> {
    const c = this.config.compass;
    return {
      type: `custom:${SKY_COMPASS_CARD_NAME}`,
      entry_ids: this.config.entries.map((e) => e.entry_id),
      title: c.title,
      compact: c.compact,
      show_legend: c.show_legend,
      show_stats: c.show_stats,
      show_moon: c.show_moon,
      show_cardinals: c.show_cardinals,
      show_blind_spot: c.show_blind_spot,
      show_sun_path: c.show_sun_path,
      show_sunrise_sunset: c.show_sunrise_sunset,
      show_cover_fill: c.show_cover_fill,
      show_window_arrow: c.show_window_arrow,
      show_elevation_chart: c.show_elevation_chart,
      cover_colors: this.config.entries.map((e) => e.color),
      north_offset: c.north_offset,
      tooltips: this._tooltipsConfig(),
    };
  }

  private _tileConfig(entryId: string): Record<string, unknown> {
    const t = this.config.tile;
    // Only the off badges need to be passed; omitted kinds default on.
    const badges: Record<string, boolean> = {};
    for (const [k, on] of Object.entries(t.badges ?? {})) {
      if (!on) badges[k] = false;
    }
    return {
      type: `custom:${TILE_CARD_NAME}`,
      entry_id: entryId,
      show_position: t.show_position,
      show_state: t.show_state,
      show_decision_summary: t.show_decision_summary,
      show_controls: t.show_controls,
      show_badge: t.show_badge,
      show_tilt: t.show_tilt,
      ...(Object.keys(badges).length > 0 ? { badges } : {}),
      show_compass: t.show_compass,
      show_elevation_chart: t.show_elevation_chart,
      show_solar_calc: t.show_solar_calc,
      show_motion_icon: t.show_motion_icon,
      layout: t.layout,
      tooltips: this._tooltipsConfig(),
    };
  }

  private _decisionConfig(): Record<string, unknown> {
    const d = this.config.decision;
    return {
      type: `custom:${DECISION_CARD_NAME}`,
      entry_id: this.config.entries[0].entry_id,
      title: d.title,
      compact: d.compact,
      hide_inactive_handlers: d.hide_inactive_handlers,
      show_decision_summary: d.show_decision_summary,
      tooltips: this._tooltipsConfig(),
    };
  }

  public static styles = css`
    :host {
      display: block;
      padding: 16px;
      overflow-y: auto;
      box-sizing: border-box;
    }
    /* Device-preview: fill the iframe full-bleed like a real phone dashboard —
       a small gutter (HA-like), no max-width, single-column tiles. */
    :host([embed]) {
      padding: 8px;
    }
    :host([embed]) .card-host {
      max-width: none;
    }
    .card-heading {
      margin: 18px 0 8px;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--secondary-text-color);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      display: flex;
      align-items: baseline;
      gap: 8px;
    }
    .card-heading code {
      font-size: 0.78rem;
      color: var(--primary-text-color);
      background: var(--code-editor-background-color);
      padding: 1px 6px;
      border-radius: 3px;
    }
    .card-heading .hint {
      font-weight: 400;
      text-transform: none;
      letter-spacing: 0;
      color: var(--secondary-text-color);
      font-size: 0.78rem;
    }
    .card-host {
      max-width: 720px;
    }
    .tile-row {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 12px;
    }
    .disabled {
      color: var(--secondary-text-color);
      font-style: italic;
      padding: 8px 0;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'acp-harness-card-stage': AcpHarnessCardStage;
  }
}
