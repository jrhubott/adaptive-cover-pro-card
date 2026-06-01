import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { SKY_COMPASS_CARD_EDITOR_NAME, SKY_COMPASS_CARD_NAME } from './const';
import { discoverEntities } from './lib/entity-discovery';
import { fetchAcpConfigEntries } from './lib/config-entries';
import { normalizeAzimuth } from './lib/geometry';
import { t } from './lib/i18n';
import {
  fetchEntityRegistry,
  subscribeEntityRegistry,
  type EntityRegistryEntry,
} from './lib/entity-registry';
import type { DiscoveredEntities, SkyCompassCardConfig } from './types';

import './components/sky-compass';
import './components/elevation-chart';
import './adaptive-cover-pro-sky-compass-card-editor';

@customElement(SKY_COMPASS_CARD_NAME)
export class AdaptiveCoverProSkyCompassCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config?: SkyCompassCardConfig;
  @state() private _registry: EntityRegistryEntry[] | null = null;
  @state() private _registryError: string | null = null;

  private _unsubRegistry: (() => void) | null = null;
  private _fetchInFlight = false;

  public setConfig(config: SkyCompassCardConfig): void {
    if (!config || !Array.isArray(config.entry_ids) || config.entry_ids.length === 0) {
      throw new Error('adaptive-cover-pro-sky-compass-card: `entry_ids` must be a non-empty array');
    }
    if (config.entry_ids.some((id) => typeof id !== 'string' || id.length === 0)) {
      throw new Error(
        'adaptive-cover-pro-sky-compass-card: every `entry_ids` entry must be a non-empty string',
      );
    }
    this._config = { ...config, entry_ids: [...config.entry_ids] };
  }

  public getCardSize(): number {
    return 4;
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement(SKY_COMPASS_CARD_EDITOR_NAME);
  }

  public static async getStubConfig(hass: HomeAssistant): Promise<SkyCompassCardConfig> {
    let entry_ids: string[] = [];
    try {
      const entries = await fetchAcpConfigEntries(hass);
      if (entries[0]) entry_ids = [entries[0].entry_id];
    } catch {
      /* none discoverable — picker falls back to name + description */
    }
    return {
      type: `custom:${SKY_COMPASS_CARD_NAME}`,
      entry_ids,
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
    if (this._registry === null && !this._fetchInFlight) this._fetchRegistry();
    if (!this._unsubRegistry) {
      this._unsubRegistry = subscribeEntityRegistry(this.hass, () => {
        this._fetchRegistry();
      });
    }
  }

  private _fetchRegistry(): void {
    if (this._fetchInFlight) return;
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
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) return nothing;

    if (this._registry === null) {
      return html`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError
              ? t('tile.registry_failed', this.hass, { error: this._registryError })
              : t('root.loading_registry', this.hass)}
          </p>
        </div>
      </ha-card>`;
    }

    const discoveredList: DiscoveredEntities[] = [];
    const missing: string[] = [];
    for (const entryId of this._config.entry_ids) {
      const d = discoverEntities(
        this.hass,
        { type: this._config.type, entry_id: entryId },
        this._registry,
      );
      if (d) discoveredList.push(d);
      else missing.push(entryId);
    }

    if (discoveredList.length === 0) {
      return html`<ha-card>
        <div class="empty">
          <p><strong>${t('root.compass_no_match', this.hass)}</strong></p>
          <p class="dim">
            ${t('root.compass_configured', this.hass, {
              entries: this._config.entry_ids.join(', '),
            })}
          </p>
        </div>
      </ha-card>`;
    }

    const cfg = this._config;
    return html`
      <ha-card>
        ${cfg.title ? html`<div class="card-header">${cfg.title}</div>` : nothing}
        <acp-sky-compass
          .hass=${this.hass}
          .discovered_list=${discoveredList}
          ?compact=${!!cfg.compact}
          .showLegend=${cfg.show_legend ?? true}
          .showStats=${cfg.show_stats ?? true}
          .showMoon=${cfg.show_moon ?? false}
          .showCardinals=${cfg.show_cardinals ?? true}
          .showBlindSpot=${cfg.show_blind_spot ?? true}
          .showSunPath=${cfg.show_sun_path ?? true}
          .showSunriseSunset=${cfg.show_sunrise_sunset ?? true}
          .showCoverFill=${cfg.show_cover_fill ?? true}
          .showWindowArrow=${cfg.show_window_arrow ?? true}
          .coverColors=${cfg.cover_colors ?? []}
          .northOffsetDeg=${normalizeAzimuth(cfg.north_offset ?? 0)}
        ></acp-sky-compass>
        ${cfg.show_elevation_chart !== false
          ? html`<acp-elevation-chart
              .hass=${this.hass}
              .discovered=${discoveredList[0]}
              ?compact=${!!cfg.compact}
            ></acp-elevation-chart>`
          : nothing}
        ${missing.length > 0
          ? html`<div class="warn dim">
              ${t('root.compass_not_found', this.hass, { entries: missing.join(', ') })}
            </div>`
          : nothing}
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
      gap: 8px;
    }
    .card-header {
      font-size: 1.05rem;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .empty {
      padding: 16px;
      text-align: center;
    }
    .dim {
      color: var(--secondary-text-color);
    }
    .warn {
      font-size: 0.78rem;
      text-align: center;
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
if (!window.customCards.some((c) => c.type === SKY_COMPASS_CARD_NAME)) {
  window.customCards.push({
    type: SKY_COMPASS_CARD_NAME,
    name: 'Adaptive Cover Pro — Sky Compass',
    description:
      'Polar sun-vs-FOV plot; overlay one or more Adaptive Cover Pro entries on a single compass.',
    preview: true,
    documentationURL: 'https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card',
  });
}
