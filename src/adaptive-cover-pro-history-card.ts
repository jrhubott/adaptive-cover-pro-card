import { LitElement, html, css, nothing, type TemplateResult, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { HISTORY_CARD_EDITOR_NAME, HISTORY_CARD_NAME, HISTORY_DEFAULT_HOURS } from './const';
import { createDiscoveryMemo } from './lib/entity-discovery';
import { makeEntitySuggestion } from './lib/entity-suggestion';
import { fetchAcpConfigEntries } from './lib/config-entries';
import { t } from './lib/i18n';
import { subscribeEntityRegistry, type EntityRegistryEntry } from './lib/entity-registry';
import { loadEntityRegistry, getCachedRegistry } from './lib/registry-store';
import { registryCache } from './lib/registry-cache';
import { filterAcp } from './lib/registry-diff';
import type { AdaptiveCoverProHistoryCardConfig, DiscoveredEntities } from './types';
import { setTooltipDefaults } from './lib/tooltip';

import './components/history-view';
import './adaptive-cover-pro-history-card-editor';

/**
 * Standalone History card. Mirrors the decision card's shape (single `entry_id`,
 * registry-backed discovery, warm-start from the shared registry cache) and
 * hosts `acp-history-view` — the same element `acp-history-dialog` renders when
 * the other cards open History as an overlay.
 *
 * Unlike the other cards this one does NOT re-render on every `hass` tick: its
 * content comes from the recorder and the diagnostics service, not from
 * `hass.states`. The view owns its own refresh cadence (a 5-minute refetch plus
 * an explicit Refresh button), so a `shouldUpdate` that tracked entity states
 * would churn the DOM for nothing. `hass` is still forwarded — the view needs it
 * to make its calls and to localize.
 */
@customElement(HISTORY_CARD_NAME)
export class AdaptiveCoverProHistoryCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config?: AdaptiveCoverProHistoryCardConfig;
  // Left public-by-convention so tests can inject a registry and skip the
  // websocket fetch dance (mirrors the decision/tile/sky-compass cards).
  @state() public _registry: EntityRegistryEntry[] | null = null;
  @state() private _registryError: string | null = null;

  private _unsubRegistry: (() => void) | null = null;
  private _fetchInFlight = false;
  private _fetchGen = 0;

  private _memo = createDiscoveryMemo();
  private _discovered: DiscoveredEntities | null = null;

  public setConfig(config: AdaptiveCoverProHistoryCardConfig): void {
    if (!config || typeof config.entry_id !== 'string' || config.entry_id.length === 0) {
      throw new Error(
        `${HISTORY_CARD_NAME}: \`entry_id\` is required and must be a non-empty string`,
      );
    }
    if (config.hours !== undefined && (typeof config.hours !== 'number' || config.hours <= 0)) {
      throw new Error(`${HISTORY_CARD_NAME}: \`hours\` must be a positive number`);
    }
    this._config = { ...config };
    if (config.tooltips) setTooltipDefaults(config.tooltips);
    if (this._registry === null) {
      const cached = registryCache.get(config.entry_id);
      if (cached) this._registry = cached.entries;
    }
  }

  public getCardSize(): number {
    return 6;
  }

  public getGridOptions() {
    return {
      columns: 12,
      rows: 'auto',
      min_columns: 6,
      max_columns: 12,
    };
  }

  public static async getStubConfig(
    hass: HomeAssistant,
  ): Promise<AdaptiveCoverProHistoryCardConfig> {
    let entry_id = '';
    try {
      const entries = await fetchAcpConfigEntries(hass);
      entry_id = entries[0]?.entry_id ?? '';
    } catch {
      /* none discoverable — picker falls back to name + description */
    }
    return { type: `custom:${HISTORY_CARD_NAME}`, entry_id, hours: HISTORY_DEFAULT_HOURS };
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement(HISTORY_CARD_EDITOR_NAME);
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

  protected willUpdate(changed: PropertyValues): void {
    if (
      this._config &&
      this.hass &&
      this._registry !== null &&
      (changed.has('hass') || changed.has('_registry') || changed.has('_config'))
    ) {
      this._discovered = this._memo(
        this.hass,
        { type: this._config.type, entry_id: this._config.entry_id },
        this._registry,
      );
    }
  }

  private _ensureRegistry(): void {
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
    const myGen = ++this._fetchGen;
    loadEntityRegistry(this.hass, force)
      .then((entries) => {
        if (myGen !== this._fetchGen) return;
        if (entries === this._registry) return;
        this._registry = entries;
        this._registryError = null;
        if (this._config)
          registryCache.set(this._config.entry_id, filterAcp(entries, this._config.entry_id));
      })
      .catch((err: Error) => {
        if (myGen !== this._fetchGen) return;
        this._registryError = err?.message ?? 'entity registry fetch failed';
      })
      .finally(() => {
        if (myGen === this._fetchGen) this._fetchInFlight = false;
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
              : t('tile.loading', this.hass)}
          </p>
        </div>
      </ha-card>`;
    }

    const discovered = this._discovered;
    if (!discovered) {
      return html`<ha-card>
        <div class="empty">
          <p class="dim">
            ${t('tile.entry_not_found', this.hass, { entry: this._config.entry_id })}
          </p>
        </div>
      </ha-card>`;
    }

    const cfg = this._config;
    return html`
      <ha-card>
        <div class="card-header">${cfg.title ?? t('history.title', this.hass)}</div>
        <acp-history-view
          .hass=${this.hass}
          .discovered=${discovered}
          .hours=${cfg.hours ?? HISTORY_DEFAULT_HOURS}
          .tracks=${cfg.tracks}
          .advancedOpen=${!!cfg.advanced_open}
          .hideAdvanced=${!!cfg.hide_advanced}
        ></acp-history-view>
      </ha-card>
    `;
  }

  public static styles = css`
    :host {
      display: block;
    }
    ha-card {
      padding: 12px 14px 12px;
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
      margin: 0;
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
if (!window.customCards.some((c) => c.type === HISTORY_CARD_NAME)) {
  window.customCards.push({
    type: HISTORY_CARD_NAME,
    name: 'Adaptive Cover Pro — History',
    description:
      'Recorded position, winning handler, sun/glare/override context and cover actions for one Adaptive Cover Pro instance, plus the diagnostic event buffer.',
    preview: true,
    documentationURL: 'https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card',
    getEntitySuggestion: makeEntitySuggestion(`custom:${HISTORY_CARD_NAME}`, 'entry_id'),
  });
}
