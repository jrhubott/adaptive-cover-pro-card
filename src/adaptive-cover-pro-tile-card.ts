import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { COVER_TYPE_ICONS, TILE_CARD_NAME, type HandlerName } from './const';
import { discoverEntities } from './lib/entity-discovery';
import {
  fetchEntityRegistry,
  subscribeEntityRegistry,
  type EntityRegistryEntry,
} from './lib/entity-registry';
import type {
  AdaptiveCoverProTileCardConfig,
  DecisionTraceAttributes,
  DiscoveredEntities,
} from './types';
import { normalizeHandler } from './lib/decision-summary';
import { formatPercent } from './lib/formatters';

import './components/tile-badge';
import './components/more-info-dialog';

@customElement(TILE_CARD_NAME)
export class AdaptiveCoverProTileCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config?: AdaptiveCoverProTileCardConfig;
  // _registry is left public-by-convention so tests can inject a registry and
  // skip the websocket fetch dance (mirrors the sky-compass card pattern).
  @state() public _registry: EntityRegistryEntry[] | null = null;
  @state() private _registryError: string | null = null;
  @state() private _dialogOpen = false;

  private _unsubRegistry: (() => void) | null = null;
  private _fetchInFlight = false;

  public setConfig(config: AdaptiveCoverProTileCardConfig): void {
    if (!config || typeof config.entry_id !== 'string' || config.entry_id.length === 0) {
      throw new Error(`${TILE_CARD_NAME}: \`entry_id\` is required and must be a non-empty string`);
    }
    this._config = { ...config };
  }

  public getCardSize(): number {
    return 1;
  }

  public static getStubConfig(): AdaptiveCoverProTileCardConfig {
    return { type: `custom:${TILE_CARD_NAME}`, entry_id: '' };
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
    // Capture a generation counter so a late-resolving stale fetch can't
    // overwrite a newer registry value injected (or assigned) in the meantime.
    const myGen = ++this._fetchGen;
    fetchEntityRegistry(this.hass)
      .then((entries) => {
        if (myGen !== this._fetchGen) return;
        this._registry = entries;
        this._registryError = null;
      })
      .catch((err: Error) => {
        if (myGen !== this._fetchGen) return;
        this._registryError = err?.message ?? 'entity registry fetch failed';
      })
      .finally(() => {
        if (myGen === this._fetchGen) this._fetchInFlight = false;
      });
  }

  private _fetchGen = 0;

  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) return nothing;

    if (this._registry === null) {
      return html`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError ? `Registry fetch failed: ${this._registryError}` : 'Loading…'}
          </p>
        </div>
      </ha-card>`;
    }

    const discovered = discoverEntities(
      this.hass,
      { type: this._config.type, entry_id: this._config.entry_id },
      this._registry,
    );
    if (!discovered) {
      return html`<ha-card>
        <div class="empty">
          <p class="dim">
            Adaptive Cover Pro entry <code>${this._config.entry_id}</code> not found.
          </p>
        </div>
      </ha-card>`;
    }

    return html`
      <ha-card>${this._renderTile(discovered)}</ha-card>
      <acp-more-info-dialog
        .hass=${this.hass}
        .discovered=${discovered}
        .open=${this._dialogOpen}
        @acp-dialog-close=${this._closeDialog}
      ></acp-more-info-dialog>
    `;
  }

  private _closeDialog = (): void => {
    this._dialogOpen = false;
  };

  private _renderTile(discovered: DiscoveredEntities): TemplateResult {
    const cfg = this._config!;
    const title = cfg.name ?? discovered.entry_title;
    const icon = COVER_TYPE_ICONS[discovered.cover_type] ?? 'mdi:window-shutter';
    const cover = this._resolvedCover(discovered);
    const showPosition = cfg.show_position !== false;
    const position = this._currentPosition(discovered);
    const winner = this._winner(discovered);
    const traceAttrs = this._traceAttrs(discovered);
    const manualEndIso = this._manualEndIso(discovered);
    const showResume = this._shouldShowResume(discovered, winner);

    return html`
      <div
        class="tile-body"
        role=${cfg.tap_action === 'none' ? 'group' : 'button'}
        tabindex=${cfg.tap_action === 'none' ? -1 : 0}
        @click=${this._onTileTap}
      >
        <ha-icon class="cover-icon" icon=${icon}></ha-icon>
        <div class="label">
          <div class="title" title=${discovered.entry_title}>${title}</div>
        </div>
        ${showPosition ? html`<div class="position">${formatPercent(position)}</div>` : nothing}
        <div class="controls" @click=${this._stop}>
          <button
            class="up"
            type="button"
            aria-label="Open"
            ?disabled=${!cover}
            @click=${() => this._command(cover, 'open_cover')}
          >
            ▲
          </button>
          <button
            class="stop"
            type="button"
            aria-label="Stop"
            ?disabled=${!cover}
            @click=${() => this._command(cover, 'stop_cover')}
          >
            ■
          </button>
          <button
            class="down"
            type="button"
            aria-label="Close"
            ?disabled=${!cover}
            @click=${() => this._command(cover, 'close_cover')}
          >
            ▼
          </button>
        </div>
        <acp-tile-badge
          .winner=${winner}
          .slotNumber=${traceAttrs?.custom_position_active_slot}
          .slotName=${traceAttrs?.custom_position_active_slot_name}
          .pct=${position ?? undefined}
          .minimumMode=${traceAttrs?.custom_position_minimum_mode}
          .manualEndIso=${manualEndIso}
        ></acp-tile-badge>
        ${showResume
          ? html`<button
              class="resume"
              type="button"
              aria-label="Resume automatic control"
              @click=${(e: Event) => {
                e.stopPropagation();
                this._resume(discovered);
              }}
            >
              Resume
            </button>`
          : nothing}
      </div>
    `;
  }

  private _resolvedCover(discovered: DiscoveredEntities): string | undefined {
    if (this._config?.cover) return this._config.cover;
    return discovered.managed_covers[0];
  }

  private _currentPosition(discovered: DiscoveredEntities): number | null {
    const id = discovered.entities.target_position_sensor;
    if (!id) return null;
    const st = this.hass.states[id];
    if (!st) return null;
    const v = parseFloat(st.state);
    return Number.isNaN(v) ? null : v;
  }

  private _winner(discovered: DiscoveredEntities): string {
    const id = discovered.entities.decision_trace_sensor;
    if (!id) return 'default';
    return this.hass.states[id]?.state ?? 'default';
  }

  private _traceAttrs(discovered: DiscoveredEntities): DecisionTraceAttributes | undefined {
    const id = discovered.entities.decision_trace_sensor;
    if (!id) return undefined;
    return this.hass.states[id]?.attributes as unknown as DecisionTraceAttributes | undefined;
  }

  private _manualOverrideOn(discovered: DiscoveredEntities): boolean {
    const id = discovered.entities.manual_override_binary;
    if (!id) return false;
    return this.hass.states[id]?.state === 'on';
  }

  private _manualEndIso(discovered: DiscoveredEntities): string | undefined {
    if (!this._manualOverrideOn(discovered)) return undefined;
    const id = discovered.entities.manual_override_end_sensor;
    if (!id) return undefined;
    return this.hass.states[id]?.state;
  }

  private _shouldShowResume(discovered: DiscoveredEntities, winner: string): boolean {
    if (!discovered.entities.reset_override_button) return false;
    if (this._manualOverrideOn(discovered)) return true;
    return (normalizeHandler(winner) as HandlerName) === 'custom_position';
  }

  private _command(cover: string | undefined, service: string): void {
    if (!cover) return;
    this.hass.callService('cover', service, { entity_id: cover });
  }

  private _resume(discovered: DiscoveredEntities): void {
    const btn = discovered.entities.reset_override_button;
    if (!btn) return;
    this.hass.callService('button', 'press', { entity_id: btn });
  }

  private _onTileTap = (): void => {
    if (this._config?.tap_action === 'none') return;
    this._dialogOpen = true;
    this.dispatchEvent(new CustomEvent('acp-tile-tap', { bubbles: true, composed: true }));
  };

  private _stop(e: Event): void {
    e.stopPropagation();
  }

  public static styles = css`
    :host {
      display: block;
    }
    ha-card {
      padding: 6px 10px;
    }
    .tile-body {
      display: grid;
      grid-template-columns: 24px minmax(0, 1fr) auto auto auto auto;
      grid-template-areas: 'icon label position controls badge resume';
      align-items: center;
      column-gap: 8px;
      row-gap: 2px;
      cursor: pointer;
      user-select: none;
    }
    .tile-body[role='group'] {
      cursor: default;
    }
    .cover-icon {
      grid-area: icon;
      --mdc-icon-size: 22px;
      color: var(--primary-text-color);
    }
    .label {
      grid-area: label;
      min-width: 0;
    }
    .title {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .position {
      grid-area: position;
      font-size: 0.85rem;
      font-variant-numeric: tabular-nums;
      color: var(--primary-text-color);
      padding: 0 4px;
    }
    .controls {
      grid-area: controls;
      display: inline-flex;
      gap: 2px;
    }
    .controls button {
      width: 26px;
      height: 26px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.8rem;
      line-height: 1;
      padding: 0;
    }
    .controls button:hover {
      background: var(--secondary-background-color);
    }
    .controls button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    acp-tile-badge {
      grid-area: badge;
    }
    .resume {
      grid-area: resume;
      padding: 2px 8px;
      border: 1px solid var(--primary-color);
      border-radius: 999px;
      background: transparent;
      color: var(--primary-color);
      font-size: 0.75rem;
      cursor: pointer;
    }
    .resume:hover {
      background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.08);
    }
    .empty {
      padding: 12px;
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
    }>;
  }
}

window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === TILE_CARD_NAME)) {
  window.customCards.push({
    type: TILE_CARD_NAME,
    name: 'Adaptive Cover Pro — Tile',
    description:
      'Compact chip-style tile for one Adaptive Cover Pro instance: icon, name, position, ↑■↓, contextual badge.',
    preview: true,
    documentationURL: 'https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card',
  });
}
