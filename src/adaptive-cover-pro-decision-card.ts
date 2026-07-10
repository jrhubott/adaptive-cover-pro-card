import { LitElement, html, css, nothing, type TemplateResult, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { DECISION_CARD_EDITOR_NAME, DECISION_CARD_NAME } from './const';
import { createDiscoveryMemo } from './lib/entity-discovery';
import { makeEntitySuggestion } from './lib/entity-suggestion';
import { entityStateChanged } from './lib/hass-change';
import { fetchAcpConfigEntries } from './lib/config-entries';
import { t } from './lib/i18n';
import { subscribeEntityRegistry, type EntityRegistryEntry } from './lib/entity-registry';
import { loadEntityRegistry, getCachedRegistry } from './lib/registry-store';
import { registryCache } from './lib/registry-cache';
import { filterAcp } from './lib/registry-diff';
import type { AdaptiveCoverProDecisionCardConfig, DiscoveredEntities } from './types';
import { setTooltipDefaults } from './lib/tooltip';

import './components/decision-strip';
import './adaptive-cover-pro-decision-card-editor';

@customElement(DECISION_CARD_NAME)
export class AdaptiveCoverProDecisionCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config?: AdaptiveCoverProDecisionCardConfig;
  // _registry is left public-by-convention so tests can inject a registry and
  // skip the websocket fetch dance (mirrors the tile/sky-compass card pattern).
  @state() public _registry: EntityRegistryEntry[] | null = null;
  @state() private _registryError: string | null = null;

  private _unsubRegistry: (() => void) | null = null;
  private _fetchInFlight = false;
  private _fetchGen = 0;

  // Memoized discovery → stable `_discovered` reference across ticks, so the
  // hosted decision strip isn't re-rendered by unrelated state changes.
  private _memo = createDiscoveryMemo();
  private _discovered: DiscoveredEntities | null = null;

  public setConfig(config: AdaptiveCoverProDecisionCardConfig): void {
    if (!config || typeof config.entry_id !== 'string' || config.entry_id.length === 0) {
      throw new Error(
        `${DECISION_CARD_NAME}: \`entry_id\` is required and must be a non-empty string`,
      );
    }
    this._config = { ...config };
    if (config.tooltips) setTooltipDefaults(config.tooltips);
    // Warm-start synchronously from the persisted ACP slice so a reload skips the
    // Loading state; the shared fetch below revalidates.
    if (this._registry === null) {
      const cached = registryCache.get(config.entry_id);
      if (cached) this._registry = cached.entries;
    }
  }

  public getCardSize(): number {
    return 3;
  }

  // Sections-layout grid sizing. Full section width, content-driven height.
  public getGridOptions() {
    return {
      columns: 12,
      rows: 'auto',
      min_columns: 4,
      max_columns: 12,
    };
  }

  public static async getStubConfig(
    hass: HomeAssistant,
  ): Promise<AdaptiveCoverProDecisionCardConfig> {
    let entry_id = '';
    try {
      const entries = await fetchAcpConfigEntries(hass);
      entry_id = entries[0]?.entry_id ?? '';
    } catch {
      /* none discoverable — picker falls back to name + description */
    }
    return { type: `custom:${DECISION_CARD_NAME}`, entry_id };
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement(DECISION_CARD_EDITOR_NAME);
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

  // Re-render only on hass ticks that touched one of this entry's entities.
  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.size > 1 || !changed.has('hass')) return true;
    if (!this._discovered) return true;
    const old = changed.get('hass') as HomeAssistant | undefined;
    return entityStateChanged(old, this.hass, Object.values(this._discovered.entities));
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
    // Revalidate against the shared registry store — cheap when warm (no websocket call).
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
        if (entries === this._registry) return; // unchanged shared cache → O(1) revalidation
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
        ${cfg.title ? html`<div class="card-header">${cfg.title}</div>` : nothing}
        <acp-decision-strip
          .hass=${this.hass}
          .discovered=${discovered}
          ?compact=${!!cfg.compact}
          ?hide-inactive=${!!cfg.hide_inactive_handlers || !!cfg.compact}
          .showSummary=${cfg.show_decision_summary !== false}
        ></acp-decision-strip>
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
if (!window.customCards.some((c) => c.type === DECISION_CARD_NAME)) {
  window.customCards.push({
    type: DECISION_CARD_NAME,
    name: 'Adaptive Cover Pro — Decision Strip',
    description:
      'Standalone decision strip: all pipeline handlers for one Adaptive Cover Pro instance with the winning row highlighted.',
    preview: true,
    documentationURL: 'https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card',
    getEntitySuggestion: makeEntitySuggestion(`custom:${DECISION_CARD_NAME}`, 'entry_id'),
  });
}
