import { LitElement, html, css, nothing, type TemplateResult, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { SKY_COMPASS_CARD_EDITOR_NAME, SKY_COMPASS_CARD_NAME } from './const';
import { createDiscoveryListMemo, type DiscoveryListResult } from './lib/entity-discovery';
import { entityStateChanged } from './lib/hass-change';
import { fetchAcpConfigEntries } from './lib/config-entries';
import { normalizeAzimuth } from './lib/geometry';
import { t } from './lib/i18n';
import {
  fetchEntityRegistry,
  subscribeEntityRegistry,
  type EntityRegistryEntry,
} from './lib/entity-registry';
import type { SkyCompassCardConfig } from './types';

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

  // Memoized multi-entry discovery → stable `list` array across ticks, so the hosted
  // compass/chart aren't re-rendered by a churning array prop. See createDiscoveryListMemo.
  private _listMemo = createDiscoveryListMemo();
  private _discoveredResult: DiscoveryListResult = { list: [], missing: [] };

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

  // Sections-layout grid sizing. The card auto-sizes its height to its content
  // (`rows: 'auto'`) so the legend, stats, and elevation chart always fit no
  // matter how many covers are configured — no fixed-height clipping and no
  // scrollbar (issue #146). Full section width with resize bounds.
  public getGridOptions() {
    return {
      columns: 12,
      rows: 'auto',
      min_columns: 6,
      max_columns: 12,
    };
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

  // This card forwards `hass` to the compass + chart, so it must re-render whenever any
  // entity those children read changed — but it skips ticks that touched none of them.
  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.size > 1 || !changed.has('hass')) return true;
    const ids: Array<string | undefined> = [];
    for (const d of this._discoveredResult.list) ids.push(...Object.values(d.entities));
    if (ids.length === 0) return true;
    const old = changed.get('hass') as HomeAssistant | undefined;
    return entityStateChanged(old, this.hass, ids);
  }

  protected willUpdate(changed: PropertyValues): void {
    if (
      this._config &&
      this.hass &&
      this._registry !== null &&
      (changed.has('hass') || changed.has('_registry') || changed.has('_config'))
    ) {
      this._discoveredResult = this._listMemo(
        this.hass,
        this._config.entry_ids,
        this._registry,
        this._config.type,
      );
    }
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

    const { list: discoveredList, missing } = this._discoveredResult;

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
              .discoveredList=${discoveredList}
              .coverColors=${cfg.cover_colors ?? []}
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
      box-sizing: border-box;
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
