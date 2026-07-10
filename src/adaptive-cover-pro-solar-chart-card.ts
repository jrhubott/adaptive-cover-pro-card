import { LitElement, html, css, nothing, type TemplateResult, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { SOLAR_CHART_CARD_EDITOR_NAME, SOLAR_CHART_CARD_NAME } from './const';
import { createDiscoveryListMemo, type DiscoveryListResult } from './lib/entity-discovery';
import { makeEntitySuggestion } from './lib/entity-suggestion';
import { entityStateChanged } from './lib/hass-change';
import { fetchAcpConfigEntries } from './lib/config-entries';
import { t } from './lib/i18n';
import { subscribeEntityRegistry, type EntityRegistryEntry } from './lib/entity-registry';
import { loadEntityRegistry, getCachedRegistry } from './lib/registry-store';
import { registryCache } from './lib/registry-cache';
import { filterAcp } from './lib/registry-diff';
import type { SolarChartCardConfig } from './types';
import { setTooltipDefaults } from './lib/tooltip';

import './components/elevation-chart';
import './adaptive-cover-pro-solar-chart-card-editor';

@customElement(SOLAR_CHART_CARD_NAME)
export class AdaptiveCoverProSolarChartCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config?: SolarChartCardConfig;
  @state() private _registry: EntityRegistryEntry[] | null = null;
  @state() private _registryError: string | null = null;

  private _unsubRegistry: (() => void) | null = null;
  private _fetchInFlight = false;

  // Memoized multi-entry discovery → stable `list` array across ticks, so the
  // hosted chart isn't re-rendered by a churning array prop. See createDiscoveryListMemo.
  private _listMemo = createDiscoveryListMemo();
  private _discoveredResult: DiscoveryListResult = { list: [], missing: [] };

  public setConfig(config: SolarChartCardConfig): void {
    if (!config || !Array.isArray(config.entry_ids) || config.entry_ids.length === 0) {
      throw new Error('adaptive-cover-pro-solar-chart-card: `entry_ids` must be a non-empty array');
    }
    if (config.entry_ids.some((id) => typeof id !== 'string' || id.length === 0)) {
      throw new Error(
        'adaptive-cover-pro-solar-chart-card: every `entry_ids` entry must be a non-empty string',
      );
    }
    this._config = { ...config, entry_ids: [...config.entry_ids] };
    if (config.tooltips) setTooltipDefaults(config.tooltips);
    // Warm-start from the persisted ACP slices so a reload skips the Loading state — but
    // only when every configured entry is cached, otherwise the missing ones would flash a
    // false "not found" until the shared fetch revalidates.
    if (this._registry === null) {
      const slices = this._config.entry_ids.map((id) => registryCache.get(id)?.entries);
      if (slices.every((s) => s !== undefined)) {
        this._registry = (slices as EntityRegistryEntry[][]).flat();
      }
    }
  }

  public getCardSize(): number {
    return 2;
  }

  // Sections-layout grid sizing. The card auto-sizes its height to its content
  // (`rows: 'auto'`) so the chart always fits no matter how many covers are
  // configured — no fixed-height clipping and no scrollbar (mirrors #146 on the
  // sky-compass card). Full section width with resize bounds.
  public getGridOptions() {
    return {
      columns: 12,
      rows: 'auto',
      min_columns: 6,
      max_columns: 12,
    };
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement(SOLAR_CHART_CARD_EDITOR_NAME);
  }

  public static async getStubConfig(hass: HomeAssistant): Promise<SolarChartCardConfig> {
    let entry_ids: string[] = [];
    try {
      const entries = await fetchAcpConfigEntries(hass);
      if (entries[0]) entry_ids = [entries[0].entry_id];
    } catch {
      /* none discoverable — picker falls back to name + description */
    }
    return {
      type: `custom:${SOLAR_CHART_CARD_NAME}`,
      entry_ids,
    };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    if (this._registry === null) {
      const mem = getCachedRegistry();
      if (mem) this._registry = mem;
    }
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

  // This card forwards `hass` to the chart, so it must re-render whenever any
  // entity the chart reads changed — but it skips ticks that touched none of them.
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
    // Revalidate against the shared registry store — cheap when warm (no websocket call),
    // so this also refreshes slices we warm-started from localStorage.
    this._fetchRegistry();
    if (!this._unsubRegistry) {
      this._unsubRegistry = subscribeEntityRegistry(this.hass, () => {
        this._fetchRegistry(true);
      });
    }
  }

  private _fetchRegistry(force = false): void {
    if (this._fetchInFlight) return;
    this._fetchInFlight = true;
    loadEntityRegistry(this.hass, force)
      .then((entries) => {
        if (entries === this._registry) return; // unchanged shared cache → O(1) revalidation
        this._registry = entries;
        this._registryError = null;
        if (this._config) {
          for (const id of this._config.entry_ids) registryCache.set(id, filterAcp(entries, id));
        }
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
        <acp-elevation-chart
          .hass=${this.hass}
          .discoveredList=${discoveredList}
          .coverColors=${cfg.cover_colors ?? []}
          ?compact=${!!cfg.compact}
        ></acp-elevation-chart>
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
      getEntitySuggestion?: (
        hass: HomeAssistant,
        entityId: string,
      ) => { label?: string; config: unknown } | null;
    }>;
  }
}

window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === SOLAR_CHART_CARD_NAME)) {
  window.customCards.push({
    type: SOLAR_CHART_CARD_NAME,
    name: 'Adaptive Cover Pro — Solar Chart',
    description:
      'Standalone solar elevation-vs-time chart; overlay one or more entries’ field-of-view windows.',
    preview: true,
    documentationURL: 'https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card',
    getEntitySuggestion: makeEntitySuggestion(`custom:${SOLAR_CHART_CARD_NAME}`, 'entry_ids'),
  });
}
