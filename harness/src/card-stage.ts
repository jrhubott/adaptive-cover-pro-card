import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';
import { CARD_NAME, SKY_COMPASS_CARD_NAME, TILE_CARD_NAME } from '../../src/const';
import type { HarnessConfig } from './types';

interface CardElement extends HTMLElement {
  setConfig?: (config: Record<string, unknown>) => void;
  hass?: HomeAssistant;
}

@customElement('acp-harness-card-stage')
export class AcpHarnessCardStage extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) config!: HarnessConfig;

  private _rootEl?: CardElement;
  private _compassEl?: CardElement;
  private _tileEls: CardElement[] = [];
  private _entrySig?: string;

  protected render(): TemplateResult {
    return html`
      <h2 class="card-heading">Root card · <code>custom:${CARD_NAME}</code></h2>
      ${this.config.root.enabled
        ? html`<div class="card-host" id="root-host"></div>`
        : html`<p class="disabled">Disabled — toggle in Per-card config.</p>`}

      <h2 class="card-heading">Sky compass card · <code>custom:${SKY_COMPASS_CARD_NAME}</code></h2>
      ${this.config.compass.enabled
        ? html`<div class="card-host" id="compass-host"></div>`
        : html`<p class="disabled">Disabled — toggle in Per-card config.</p>`}

      <h2 class="card-heading">
        Tile card · <code>custom:${TILE_CARD_NAME}</code>
        <span class="hint">(one per entry — open to see more-info dialog with forecast)</span>
      </h2>
      ${this.config.tile.enabled
        ? html`<div class="tile-row" id="tile-host" style=${this._tileRowStyle()}></div>`
        : html`<p class="disabled">Disabled — toggle in Per-card config.</p>`}
    `;
  }

  /** When a tile width is simulated (issue #136), pin every tile to exactly
   *  that many px so the card receives a narrow inline-size; 0 falls back to
   *  the auto-fill grid (≥360px tiles). */
  private _tileRowStyle(): string {
    const w = this.config.tile.tileWidth;
    return w > 0 ? `grid-template-columns: repeat(auto-fill, ${w}px); justify-content: start;` : '';
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has('config') || !this._rootEl) this._syncCards();
    if (changed.has('hass') || changed.has('config')) this._pushHass();
  }

  private _syncCards(): void {
    // The mock entity registry is rebuilt per scenario, but each card fetches it
    // once and caches it — the mock's event subscription is a no-op, so the cards
    // never see an entity_registry_updated event and never refetch. When the
    // configured entry set changes, tear down every card so each remounts and
    // refetches the registry for the new entries. Without this, discovery runs
    // against the previous scenario's entities and a switch to e.g. the
    // multi-window scenario renders "No matching Adaptive Cover Pro entities".
    const entrySig = this.config.entries.map((e) => e.entry_id).join(',');
    if (this._entrySig !== undefined && entrySig !== this._entrySig) {
      this._rootEl?.remove();
      this._rootEl = undefined;
      this._compassEl?.remove();
      this._compassEl = undefined;
      for (const el of this._tileEls) el.remove();
      this._tileEls = [];
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
        el.setConfig?.(this._tileConfig(this.config.entries[i].entry_id));
      });
    } else if (this._tileEls.length && !this.config.tile.enabled) {
      for (const el of this._tileEls) el.remove();
      this._tileEls = [];
    }
  }

  private _pushHass(): void {
    if (this._rootEl) this._rootEl.hass = this.hass;
    if (this._compassEl) this._compassEl.hass = this.hass;
    for (const t of this._tileEls) t.hass = this.hass;
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
      ...(Object.keys(badges).length > 0 ? { badges } : {}),
      show_compass: t.show_compass,
      show_elevation_chart: t.show_elevation_chart,
      show_motion_icon: t.show_motion_icon,
      layout: t.layout,
    };
  }

  public static styles = css`
    :host {
      display: block;
      padding: 16px;
      overflow-y: auto;
      box-sizing: border-box;
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
