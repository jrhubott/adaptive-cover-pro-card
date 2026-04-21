import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { CARD_EDITOR_NAME, CARD_NAME, CARD_VERSION, COVER_TYPE_ICONS } from './const';
import { discoverEntities } from './lib/entity-discovery';
import {
  fetchEntityRegistry,
  subscribeEntityRegistry,
  type EntityRegistryEntry,
} from './lib/entity-registry';
import type { AdaptiveCoverProCardConfig, CardSection, DiscoveredEntities } from './types';

import './components/sky-compass';
import './components/elevation-chart';
import './components/decision-strip';
import './components/cover-bar';
import './components/overrides-panel';
import './components/climate-panel';
import './adaptive-cover-pro-card-editor';

const DEFAULT_SECTIONS: CardSection[] = [
  'sky',
  'elevation',
  'decision',
  'covers',
  'overrides',
  'climate',
];

@customElement(CARD_NAME)
export class AdaptiveCoverProCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config?: AdaptiveCoverProCardConfig;
  @state() private _registry: EntityRegistryEntry[] | null = null;
  @state() private _registryError: string | null = null;

  private _unsubRegistry: (() => void) | null = null;
  private _fetchInFlight = false;

  public setConfig(config: AdaptiveCoverProCardConfig): void {
    if (!config?.entry_id) {
      throw new Error('adaptive-cover-pro-card: `entry_id` is required');
    }
    this._config = { ...config };
  }

  public getCardSize(): number {
    return 6;
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement(CARD_EDITOR_NAME);
  }

  public static getStubConfig(): AdaptiveCoverProCardConfig {
    return {
      type: `custom:${CARD_NAME}`,
      entry_id: '',
    };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    if (this.hass) this._ensureRegistry();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._unsubRegistry) {
      this._unsubRegistry();
      this._unsubRegistry = null;
    }
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has('hass') && this.hass) this._ensureRegistry();
  }

  private _ensureRegistry(): void {
    if (this._registry !== null || this._fetchInFlight) return;
    this._fetchInFlight = true;
    fetchEntityRegistry(this.hass)
      .then((entries) => {
        this._registry = entries;
        this._registryError = null;
      })
      .catch((err: Error) => {
        this._registryError = err?.message ?? 'entity registry fetch failed';
      })
      .finally(() => {
        this._fetchInFlight = false;
      });

    if (!this._unsubRegistry) {
      this._unsubRegistry = subscribeEntityRegistry(this.hass, () => {
        // Force a refresh on the next tick.
        this._registry = null;
        this._fetchInFlight = false;
        this._ensureRegistry();
      });
    }
  }

  private get _sections(): CardSection[] {
    return this._config?.show_sections ?? DEFAULT_SECTIONS;
  }

  private _renderHeader(d: DiscoveredEntities): TemplateResult {
    const icon = COVER_TYPE_ICONS[d.cover_type] ?? 'mdi:window-shutter';
    const enabledId = d.entities.integration_enabled_switch;
    const autoId = d.entities.automatic_control_switch;
    const enabledOn = enabledId ? this.hass.states[enabledId]?.state === 'on' : true;
    const autoOn = autoId ? this.hass.states[autoId]?.state === 'on' : true;
    return html`
      <div class="header">
        <ha-icon .icon=${icon}></ha-icon>
        <span class="title">${d.entry_title}</span>
        <span class="spacer"></span>
        ${enabledId
          ? html`<button
              class="pill ${enabledOn ? 'on' : 'off'}"
              @click=${() => this._toggle(enabledId)}
              title="Integration Enabled"
            >
              ${enabledOn ? 'ON' : 'OFF'}
            </button>`
          : nothing}
        ${autoId
          ? html`<button
              class="pill ${autoOn ? 'on' : 'off'}"
              @click=${() => this._toggle(autoId)}
              title="Automatic Control"
            >
              Auto
            </button>`
          : nothing}
      </div>
    `;
  }

  private _toggle(entityId: string): void {
    const domain = entityId.split('.')[0];
    this.hass.callService(domain, 'toggle', { entity_id: entityId });
  }

  private _renderLoading(): TemplateResult {
    return html`
      <ha-card>
        <div class="empty">
          <p class="dim">Loading Adaptive Cover Pro registry…</p>
        </div>
      </ha-card>
    `;
  }

  private _renderEmpty(reason: string): TemplateResult {
    const entryId = this._config!.entry_id;
    const registrySize = this._registry?.length ?? 0;
    const acpCount = this._registry?.filter(
      (e) => e.config_entry_id === entryId && e.platform === 'adaptive_cover_pro',
    ).length;
    return html`
      <ha-card>
        <div class="empty">
          <p><strong>No Adaptive Cover Pro entities found</strong></p>
          <p class="dim">Configured <code>entry_id</code>: <code>${entryId}</code></p>
          <ul class="diag">
            <li>Reason: <code>${reason}</code></li>
            <li>Registry entries loaded: <code>${registrySize}</code></li>
            <li>ACP entities matching entry_id: <code>${acpCount ?? '—'}</code></li>
            ${this._registryError
              ? html`<li>Registry fetch error: <code>${this._registryError}</code></li>`
              : nothing}
          </ul>
          <p class="dim">
            If the count is 0, the <code>entry_id</code> is wrong. Find it at
            <code>/config/integrations</code> → click the Adaptive Cover Pro entry → the URL bar
            shows <code>config_entry=…</code>.
          </p>
        </div>
      </ha-card>
    `;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) return nothing;

    if (this._registry === null) {
      return this._registryError
        ? this._renderEmpty('registry fetch failed')
        : this._renderLoading();
    }

    const discovered = discoverEntities(this.hass, this._config, this._registry);
    if (!discovered) return this._renderEmpty('no matching entities after unique_id lookup');

    const sections = this._sections;
    return html`
      <ha-card>
        ${this._renderHeader(discovered)}
        <div class="body ${this._config.compact ? 'compact' : ''}">
          ${sections.includes('sky')
            ? html`<acp-sky-compass .hass=${this.hass} .discovered=${discovered}></acp-sky-compass>`
            : nothing}
          ${sections.includes('elevation')
            ? html`<acp-elevation-chart
                .hass=${this.hass}
                .discovered=${discovered}
                ?compact=${!!this._config.compact}
              ></acp-elevation-chart>`
            : nothing}
          ${sections.includes('decision')
            ? html`<acp-decision-strip
                .hass=${this.hass}
                .discovered=${discovered}
                ?compact=${!!this._config.compact}
              ></acp-decision-strip>`
            : nothing}
          ${sections.includes('covers')
            ? html`<acp-cover-bar
                .hass=${this.hass}
                .discovered=${discovered}
                ?compact=${!!this._config.compact}
              ></acp-cover-bar>`
            : nothing}
          ${sections.includes('overrides')
            ? html`<acp-overrides-panel
                .hass=${this.hass}
                .discovered=${discovered}
                ?compact=${!!this._config.compact}
              ></acp-overrides-panel>`
            : nothing}
          ${sections.includes('climate')
            ? html`<acp-climate-panel
                .hass=${this.hass}
                .discovered=${discovered}
                ?compact=${!!this._config.compact}
              ></acp-climate-panel>`
            : nothing}
        </div>
        <div class="footer dim">adaptive-cover-pro-card v${CARD_VERSION}</div>
      </ha-card>
    `;
  }

  public static styles = css`
    :host {
      display: block;
    }
    ha-card {
      padding: 12px 14px 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
    .header ha-icon {
      --mdc-icon-size: 22px;
      color: var(--primary-color);
    }
    .title {
      font-size: 1.05rem;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .pill {
      padding: 2px 10px;
      border-radius: 999px;
      border: 1px solid var(--divider-color);
      background: transparent;
      font-size: 0.78rem;
      letter-spacing: 0.04em;
      cursor: pointer;
      color: var(--secondary-text-color);
    }
    .pill.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: transparent;
    }
    .pill.off {
      opacity: 0.6;
    }
    .body {
      display: grid;
      gap: 12px;
    }
    .body.compact {
      gap: 8px;
    }
    .empty {
      padding: 16px;
      text-align: center;
    }
    .empty code {
      background: var(--code-editor-background-color, rgba(0, 0, 0, 0.08));
      padding: 1px 6px;
      border-radius: 3px;
    }
    .empty ul.diag {
      list-style: none;
      padding: 0;
      margin: 8px auto;
      text-align: left;
      display: inline-block;
      font-size: 0.82rem;
    }
    .footer {
      font-size: 0.7rem;
      text-align: right;
    }
    .dim {
      color: var(--secondary-text-color);
    }
  `;
}

declare global {
  interface Window {
    customCards: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: CARD_NAME,
  name: 'Adaptive Cover Pro',
  description:
    'Visualize sun/window geometry, the pipeline decision trace, and live cover positions with inline controls.',
  preview: true,
  documentationURL: 'https://github.com/jrhubott/adaptive-cover-pro-card',
});

// eslint-disable-next-line no-console
console.info(
  `%c adaptive-cover-pro-card %c v${CARD_VERSION} `,
  'color: white; background: #3f51b5; font-weight: 700;',
  'color: #3f51b5; background: white; font-weight: 700;',
);
