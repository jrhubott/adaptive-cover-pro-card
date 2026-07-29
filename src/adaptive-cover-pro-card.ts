import { LitElement, html, css, nothing, type TemplateResult, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { entityStateChanged } from './lib/hass-change';

import { CARD_EDITOR_NAME, CARD_NAME, CARD_VERSION, resolveControlFlags } from './const';
import { coverStateIcon, coverStateColor } from './lib/icons';
import { logicalCoverPosition } from './lib/cover-position';
import { t } from './lib/i18n';
import { setTooltipDefaults } from './lib/tooltip';
import { createDiscoveryMemo } from './lib/entity-discovery';
import { makeEntitySuggestion } from './lib/entity-suggestion';
import { fetchAcpConfigEntries } from './lib/config-entries';
import { normalizeAzimuth } from './lib/geometry';
import { subscribeEntityRegistry, type EntityRegistryEntry } from './lib/entity-registry';
import { loadEntityRegistry, getCachedRegistry } from './lib/registry-store';
import { registryCache } from './lib/registry-cache';
import { registryChanged, isAcpRegistryEvent, filterAcp } from './lib/registry-diff';
import type { AdaptiveCoverProCardConfig, CardSection, DiscoveredEntities } from './types';

import './components/header-pill';
import './components/sky-compass';
import './components/elevation-chart';
import './components/decision-strip';
import './adaptive-cover-pro-tile-card';
import './components/cover-bar';
import './components/group-view';
import './components/overrides-panel';
import './components/climate-panel';
import './components/solar-calc';
import './components/more-info-dialog';
import './components/history-dialog';
import './adaptive-cover-pro-card-editor';
import './adaptive-cover-pro-sky-compass-card';
import './adaptive-cover-pro-decision-card';
import './adaptive-cover-pro-solar-chart-card';
import './adaptive-cover-pro-history-card';

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
  @state() private _discovered: DiscoveredEntities | null = null;
  @state() private _dialogOpen = false;

  // Stable single-element wrapper list handed to the compass + elevation chart.
  // Rebuilt only when `_discovered`'s reference changes, so a root re-render for
  // header reasons doesn't churn those children's array prop on every tick.
  private _discoveredList: DiscoveredEntities[] = [];
  private _discoveredListSource: DiscoveredEntities | null = null;

  private _unsubRegistry: (() => void) | null = null;
  private _fetchInFlight = false;
  private _memo = createDiscoveryMemo();
  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private _debounceFirstAt: number | null = null;
  private readonly _DEBOUNCE_DELAY = 500;
  private readonly _DEBOUNCE_MAX = 2000;

  public setConfig(config: AdaptiveCoverProCardConfig): void {
    if (!config?.entry_id) {
      throw new Error('adaptive-cover-pro-card: `entry_id` is required');
    }
    this._config = { ...config };
    if (config.tooltips) setTooltipDefaults(config.tooltips);
    // Warm-start: synchronously hydrate registry from cache so first render skips loading state.
    if (this._registry === null) {
      const cached = registryCache.get(config.entry_id);
      if (cached) this._registry = cached.entries;
    }
  }

  public getCardSize(): number {
    return 6;
  }

  // Sections-layout grid sizing. The card auto-sizes its height to its content
  // (`rows: 'auto'`) so every visible section always fits without a fixed-height
  // clip or scrollbar (issue #146). Full section width with resize bounds.
  public getGridOptions() {
    return {
      columns: 12,
      rows: 'auto',
      min_columns: 6,
      max_columns: 12,
    };
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement(CARD_EDITOR_NAME);
  }

  public static async getStubConfig(hass: HomeAssistant): Promise<AdaptiveCoverProCardConfig> {
    let entry_id = '';
    try {
      const entries = await fetchAcpConfigEntries(hass);
      entry_id = entries[0]?.entry_id ?? '';
    } catch {
      /* none discoverable — picker falls back to name + description */
    }
    return {
      type: `custom:${CARD_NAME}`,
      entry_id,
    };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    // Warm-start from the in-memory registry if another card already fetched it this
    // session — avoids the Loading flash on the 2nd..Nth card and after tab navigation.
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
    if (this._debounceTimer !== null) {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
      this._debounceFirstAt = null;
    }
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has('hass') && this.hass) this._ensureRegistry();
  }

  // Root re-renders whenever ANY entity belonging to this config entry changed,
  // because it is the one that forwards `hass` to every section — short-circuit
  // here and the children never see the update. Each child then applies its own
  // narrower guard so the expensive sections skip ticks they don't care about.
  // Unrelated (non-ACP) state ticks change none of these ids, so the root (and
  // therefore the whole card) skips them entirely.
  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.size > 1 || !changed.has('hass')) return true;
    if (!this._discovered) return true;
    // A Cover Group must not gate on its own entities: the roster renders each
    // member as a nested tile card that HA never feeds directly, so it only sees
    // a new `hass` when this card re-renders. A member's own ACP sensors belong
    // to a different config entry and are absent from `discovered.entities`, so
    // gating would freeze every member badge, countdown and chart until some
    // group sensor happened to tick.
    if (this._discovered.is_group) return true;
    const old = changed.get('hass') as HomeAssistant | undefined;
    return entityStateChanged(old, this.hass, Object.values(this._discovered.entities));
  }

  protected willUpdate(changed: Map<string, unknown>): void {
    if (
      this._registry !== null &&
      this._config &&
      this.hass &&
      (changed.has('hass') || changed.has('_registry') || changed.has('_config'))
    ) {
      this._discovered = this._memo(this.hass, this._config, this._registry);
    }
    if (this._discovered !== this._discoveredListSource) {
      this._discoveredListSource = this._discovered;
      this._discoveredList = this._discovered ? [this._discovered] : [];
    }
  }

  private _ensureRegistry(): void {
    // Always fetch (or revalidate) — _fetchRegistry guards against concurrent in-flight fetches
    // and only swaps _registry when the ACP slice actually changed.
    this._fetchRegistry();

    if (!this._unsubRegistry) {
      this._unsubRegistry = subscribeEntityRegistry(this.hass, (payload) => {
        const acpIds = new Set(
          filterAcp(this._registry ?? [], this._config?.entry_id ?? '').map((e) => e.entity_id),
        );
        if (!isAcpRegistryEvent(payload, acpIds)) return;
        this._scheduleRefetch();
      });
    }
  }

  private _fetchRegistry(force = false): void {
    if (this._fetchInFlight) return;
    this._fetchInFlight = true;
    loadEntityRegistry(this.hass, force)
      .then((entries) => {
        // Shared cache returned the same array we already hold — nothing changed, so the
        // per-tick revalidation path costs O(1) instead of re-filtering the registry.
        if (entries === this._registry) return;
        const entryId = this._config?.entry_id;
        if (entryId) {
          const slice = filterAcp(entries, entryId);
          if (
            this._registry === null ||
            registryChanged(filterAcp(this._registry, entryId), slice)
          ) {
            this._registry = entries;
            if (slice.length) registryCache.set(entryId, slice);
          }
        } else {
          this._registry = entries;
        }
        this._registryError = null;
      })
      .catch((err: Error) => {
        this._registryError = err?.message ?? 'entity registry fetch failed';
      })
      .finally(() => {
        this._fetchInFlight = false;
      });
  }

  private _scheduleRefetch(): void {
    const now = Date.now();
    if (this._debounceFirstAt === null) this._debounceFirstAt = now;

    const elapsed = now - this._debounceFirstAt;
    const remaining = this._DEBOUNCE_MAX - elapsed;
    const delay = Math.min(this._DEBOUNCE_DELAY, remaining);

    if (this._debounceTimer !== null) clearTimeout(this._debounceTimer);

    if (delay <= 0) {
      // Max wait exceeded — fire immediately. Force past the shared cache so the registry
      // change that triggered this refetch isn't masked by a stale cached value.
      this._debounceFirstAt = null;
      this._fetchRegistry(true);
      return;
    }

    this._debounceTimer = setTimeout(() => {
      this._debounceTimer = null;
      this._debounceFirstAt = null;
      this._fetchRegistry(true);
    }, delay);
  }

  private get _sections(): CardSection[] {
    return this._config?.show_sections ?? DEFAULT_SECTIONS;
  }

  private _renderHeader(
    d: DiscoveredEntities,
    flags: ReturnType<typeof resolveControlFlags>,
  ): TemplateResult {
    // Resolve the header glyph from the underlying HA cover so it matches HA's
    // native icon (explicit entity icon → device_class glyph → cover_type →
    // generic), position-aware via the cover's current_position — read in the
    // logical frame so an inverse_state entry gets the right glyph (#234).
    const coverId = d.managed_covers?.[0];
    const coverState = coverId ? this.hass.states[coverId] : undefined;
    const icon = coverStateIcon({
      explicitIcon: coverState?.attributes?.icon as string | undefined,
      deviceClass: coverState?.attributes?.device_class as string | undefined,
      coverType: d.cover_type,
      position: logicalCoverPosition(this.hass, d, coverId),
    });
    const iconColor =
      this._config!.state_color !== false ? coverStateColor(coverState?.state) : null;
    const enabledId = d.entities.integration_enabled_switch;
    const autoId = d.entities.automatic_control_switch;
    const enabledOn = enabledId ? this.hass.states[enabledId]?.state === 'on' : true;
    const autoOn = autoId ? this.hass.states[autoId]?.state === 'on' : true;
    return html`
      <div class="header">
        <div
          class="header-info"
          role="button"
          tabindex="0"
          @click=${this._openDialog}
          @keydown=${this._onHeaderInfoKeydown}
        >
          <ha-icon .icon=${icon} style=${iconColor ? `color: ${iconColor}` : ''}></ha-icon>
          <span class="title">${d.entry_title}</span>
        </div>
        <span class="spacer"></span>
        ${enabledId
          ? html`<acp-header-pill
              .on=${enabledOn}
              .readonly=${!flags.integration_enabled}
              .label=${enabledOn ? t('header.on', this.hass) : t('header.off', this.hass)}
              title=${t('header.integration_enabled', this.hass)}
              @pill-click=${() => this._toggle(enabledId)}
            ></acp-header-pill>`
          : nothing}
        ${autoId
          ? html`<acp-header-pill
              .on=${autoOn}
              .readonly=${!flags.automatic_control}
              .label=${t('header.auto', this.hass)}
              title=${t('header.automatic_control', this.hass)}
              @pill-click=${() => this._toggle(autoId)}
            ></acp-header-pill>`
          : nothing}
      </div>
    `;
  }

  private _toggle(entityId: string): void {
    const domain = entityId.split('.')[0];
    this.hass.callService(domain, 'toggle', { entity_id: entityId });
  }

  private _openDialog = (): void => {
    this._dialogOpen = true;
  };

  private _closeDialog = (): void => {
    this._dialogOpen = false;
  };

  private _onHeaderInfoKeydown = (ev: KeyboardEvent): void => {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    ev.preventDefault();
    this._openDialog();
  };

  private _renderLoading(): TemplateResult {
    return html`
      <ha-card>
        <div class="empty">
          <p class="dim">${t('root.loading_registry', this.hass)}</p>
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
          <p><strong>${t('root.no_entities_title', this.hass)}</strong></p>
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

    const discovered = this._discovered;
    if (!discovered) return this._renderEmpty('no matching entities after unique_id lookup');

    const flags = resolveControlFlags(this._config);

    // Cover Group entries (issue #185) have no sun/window geometry — route them
    // to the dedicated group view in place of every cover section. Members'
    // who-won badges cover "who's driving each member", so the per-cover
    // decision strip does not belong here.
    if (discovered.is_group) {
      return html`
        <ha-card>
          ${this._renderHeader(discovered, flags)}
          <div class="body ${this._config.compact ? 'compact' : ''}">
            <acp-group-view
              .hass=${this.hass}
              .discovered=${discovered}
              ?compact=${!!this._config.compact}
            ></acp-group-view>
          </div>
        </ha-card>
      `;
    }

    const sections = this._sections;
    return html`
      <ha-card>
        ${this._renderHeader(discovered, flags)}
        <div class="body ${this._config.compact ? 'compact' : ''}">
          ${sections.includes('sky')
            ? html`<acp-sky-compass
                .hass=${this.hass}
                .discovered_list=${this._discoveredList}
                ?compact=${!!this._config.compact}
                .showStats=${this._config.show_compass_stats ?? true}
                .showLegend=${this._config.show_compass_legend ?? true}
                .showMoon=${this._config.show_moon ?? false}
                .coverColors=${this._config.cover_colors ?? []}
                .northOffsetDeg=${normalizeAzimuth(this._config.north_offset ?? 0)}
              ></acp-sky-compass>`
            : nothing}
          ${sections.includes('elevation')
            ? html`<acp-elevation-chart
                .hass=${this.hass}
                .discoveredList=${this._discoveredList}
                ?compact=${!!this._config.compact}
                .coverColors=${this._config.cover_colors ?? []}
              ></acp-elevation-chart>`
            : nothing}
          ${sections.includes('decision')
            ? html`<acp-decision-strip
                .hass=${this.hass}
                .discovered=${discovered}
                ?compact=${!!this._config.compact}
                ?hide-inactive=${!!this._config.hide_inactive_handlers || !!this._config.compact}
                .showSummary=${this._config.show_decision_summary !== false}
              ></acp-decision-strip>`
            : nothing}
          ${sections.includes('covers')
            ? html`<acp-cover-bar
                .hass=${this.hass}
                .discovered=${discovered}
                ?compact=${!!this._config.compact}
                .coverColor=${this._config.cover_colors?.[0] ?? null}
                @acp-open-more-info=${this._openDialog}
              ></acp-cover-bar>`
            : nothing}
          ${sections.includes('overrides')
            ? html`<acp-overrides-panel
                .hass=${this.hass}
                .discovered=${discovered}
                ?compact=${!!this._config.compact}
                .resetEnabled=${flags.reset_manual_override}
              ></acp-overrides-panel>`
            : nothing}
          ${sections.includes('climate')
            ? html`<acp-climate-panel
                .hass=${this.hass}
                .discovered=${discovered}
                ?compact=${!!this._config.compact}
              ></acp-climate-panel>`
            : nothing}
          ${sections.includes('solar')
            ? html`<acp-solar-calc
                .hass=${this.hass}
                .discovered=${discovered}
                ?compact=${!!this._config.compact}
              ></acp-solar-calc>`
            : nothing}
        </div>
      </ha-card>
      <acp-more-info-dialog
        .hass=${this.hass}
        .discovered=${discovered}
        .open=${this._dialogOpen}
        .stateColor=${this._config!.state_color !== false}
        @acp-dialog-close=${this._closeDialog}
      ></acp-more-info-dialog>
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
      box-sizing: border-box;
    }
    .header {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-weight: 500;
    }
    .header ha-icon {
      --mdc-icon-size: 22px;
      color: var(--primary-color);
    }
    .header-info {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      cursor: pointer;
      border-radius: 6px;
    }
    .header-info:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .title {
      font-size: 1.05rem;
    }
    .spacer {
      flex: 1 1 auto;
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
      getEntitySuggestion?: (
        hass: HomeAssistant,
        entityId: string,
      ) => { label?: string; config: unknown } | null;
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
  documentationURL: 'https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card',
  getEntitySuggestion: makeEntitySuggestion(`custom:${CARD_NAME}`, 'entry_id'),
});

// eslint-disable-next-line no-console
console.info(
  `%c adaptive-cover-pro-card %c v${CARD_VERSION} `,
  'color: white; background: #3f51b5; font-weight: 700;',
  'color: #3f51b5; background: white; font-weight: 700;',
);
