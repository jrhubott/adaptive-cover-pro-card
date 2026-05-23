import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  handleAction,
  hasAction,
  type ActionConfig,
  type HomeAssistant,
} from 'custom-card-helpers';

import { TILE_CARD_NAME, TILE_CARD_EDITOR_NAME, type HandlerName } from './const';
import { discoverEntities } from './lib/entity-discovery';
import { pickCoverIcon } from './lib/icons';
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
import { buildDecisionSentence, normalizeHandler } from './lib/decision-summary';
import { formatCoverState, formatPercent } from './lib/formatters';

import './components/tile-badge';
import './components/more-info-dialog';
import './adaptive-cover-pro-tile-card-editor';

const HOLD_DURATION_MS = 500;
const DOUBLE_TAP_WINDOW_MS = 250;

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
    let next: AdaptiveCoverProTileCardConfig = { ...config };
    if (typeof next.tap_action === 'string') {
      next = {
        ...next,
        tap_action: next.tap_action === 'none' ? { action: 'none' } : undefined,
      };
    }
    this._config = next;
  }

  public getCardSize(): number {
    return 1;
  }

  public static getStubConfig(): AdaptiveCoverProTileCardConfig {
    return { type: `custom:${TILE_CARD_NAME}`, entry_id: '' };
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement(TILE_CARD_EDITOR_NAME);
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
        .showCompass=${this._config.show_compass !== false}
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
    const cover = this._resolvedCover(discovered);
    const icon = cfg.icon ?? pickCoverIcon(discovered.cover_type, this._liveCoverPosition(cover));
    const showPosition = cfg.show_position !== false;
    const showState = cfg.show_state !== false;
    const showControls = cfg.show_controls !== false;
    const showBadge = cfg.show_badge !== false;
    const motionState = cfg.show_motion_icon !== false ? this._motionActiveState(discovered) : null;
    const motionTitle =
      motionState === 'timeout_pending' ? 'Motion timeout pending' : 'Motion detected';
    const twoLine = cfg.layout === 'two-line';
    const position = this._currentPosition(discovered);
    const winner = this._winner(discovered);
    const traceAttrs = this._traceAttrs(discovered);
    const manualEndIso = this._manualEndIso(discovered);
    const showResume = this._shouldShowResume(discovered, winner);
    const inert = this._isFullyInert(cfg);
    const summary =
      cfg.show_decision_summary === true && traceAttrs
        ? buildDecisionSentence(traceAttrs.trace ?? [], traceAttrs, winner)
        : '';

    const hasBottomSummary = !!summary && twoLine;
    const integrationEnabled = this._switchOn(discovered, 'integration_enabled_switch');
    const automaticControl = this._switchOn(discovered, 'automatic_control_switch');
    const renderBadge = showBadge && !(automaticControl === false && integrationEnabled === true);
    const stateText = showState ? formatCoverState(this.hass, cover) : null;
    const positionText = showPosition && position !== null ? formatPercent(position) : null;
    const labelParts = [stateText, positionText].filter((p): p is string => !!p);
    const hasStateLabel = !!stateText;

    return html`
      <div
        class=${`tile-body${twoLine ? ' two-line' : ''}${hasBottomSummary ? ' has-summary' : ''}${hasStateLabel ? ' has-state-label' : ''}`}
        role=${inert ? 'group' : 'button'}
        tabindex=${inert ? -1 : 0}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @pointerleave=${this._onPointerCancel}
        @click=${this._onClick}
      >
        <div class="cover-icon-wrap">
          <ha-icon class="cover-icon" icon=${icon}></ha-icon>
          ${motionState
            ? html`<ha-icon
                class="motion-overlay ${motionState}"
                icon="mdi:motion-sensor"
                title=${motionTitle}
              ></ha-icon>`
            : nothing}
        </div>
        <div class="label">
          <div class="title" title=${discovered.entry_title}>${title}</div>
          ${summary && !twoLine ? html`<div class="summary">${summary}</div>` : nothing}
          ${hasBottomSummary
            ? html`<div class="summary inline-summary" title=${summary}>${summary}</div>`
            : nothing}
        </div>
        ${labelParts.length > 0
          ? html`<div class="position">${labelParts.join(' · ')}</div>`
          : nothing}
        ${showControls
          ? html`<div class="controls" @click=${this._stop} @pointerdown=${this._stop}>
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
            </div>`
          : nothing}
        ${renderBadge
          ? html`<acp-tile-badge
              .winner=${winner}
              .integrationEnabled=${integrationEnabled}
              .slotNumber=${traceAttrs?.custom_position_active_slot}
              .slotName=${traceAttrs?.custom_position_active_slot_name}
              .pct=${position ?? undefined}
              .minimumMode=${traceAttrs?.custom_position_minimum_mode}
              .manualEndIso=${manualEndIso}
            ></acp-tile-badge>`
          : nothing}
        ${showResume
          ? html`<button
              class="resume"
              type="button"
              aria-label="Resume automatic control"
              @click=${(e: Event) => {
                e.stopPropagation();
                this._resume(discovered);
              }}
              @pointerdown=${this._stop}
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

  private _liveCoverPosition(cover: string | undefined): number | null {
    if (!cover) return null;
    const v = this.hass.states[cover]?.attributes?.current_position;
    return typeof v === 'number' && !Number.isNaN(v) ? v : null;
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

  private _motionActiveState(discovered: DiscoveredEntities): string | null {
    const id = discovered.entities.motion_status_sensor;
    if (!id) return null;
    const state = this.hass.states[id]?.state;
    return state === 'motion_detected' || state === 'timeout_pending' ? state : null;
  }

  private _manualOverrideOn(discovered: DiscoveredEntities): boolean {
    const id = discovered.entities.manual_override_binary;
    if (!id) return false;
    return this.hass.states[id]?.state === 'on';
  }

  private _switchOn(
    discovered: DiscoveredEntities,
    role: 'integration_enabled_switch' | 'automatic_control_switch',
  ): boolean {
    const id = discovered.entities[role];
    if (!id) return true;
    return this.hass.states[id]?.state !== 'off';
  }

  private _manualEndIso(discovered: DiscoveredEntities): string | undefined {
    if (!this._manualOverrideOn(discovered)) return undefined;
    const id = discovered.entities.manual_override_end_sensor;
    if (!id) return undefined;
    return this.hass.states[id]?.state;
  }

  private _shouldShowResume(discovered: DiscoveredEntities, winner: string): boolean {
    if (!discovered.entities.reset_override_button) return false;
    const mode = this._config?.show_resume ?? 'auto';
    if (mode === 'never') return false;
    if (mode === 'always') return true;
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

  private _holdTimer: ReturnType<typeof setTimeout> | null = null;
  private _pendingTapTimer: ReturnType<typeof setTimeout> | null = null;
  private _holdFired = false;

  private _onPointerDown = (): void => {
    this._holdFired = false;
    if (this._holdTimer != null) clearTimeout(this._holdTimer);
    if (!hasAction(this._config?.hold_action)) return;
    this._holdTimer = setTimeout(() => {
      this._holdFired = true;
      this._holdTimer = null;
      this._fireAction('hold');
    }, HOLD_DURATION_MS);
  };

  private _onPointerUp = (): void => {
    if (this._holdTimer != null) {
      clearTimeout(this._holdTimer);
      this._holdTimer = null;
    }
  };

  private _onPointerCancel = (): void => {
    if (this._holdTimer != null) {
      clearTimeout(this._holdTimer);
      this._holdTimer = null;
    }
  };

  private _onClick = (): void => {
    if (this._holdFired) {
      this._holdFired = false;
      return;
    }
    const hasDouble = hasAction(this._config?.double_tap_action);
    if (!hasDouble) {
      this._fireAction('tap');
      return;
    }
    if (this._pendingTapTimer != null) {
      clearTimeout(this._pendingTapTimer);
      this._pendingTapTimer = null;
      this._fireAction('double_tap');
      return;
    }
    this._pendingTapTimer = setTimeout(() => {
      this._pendingTapTimer = null;
      this._fireAction('tap');
    }, DOUBLE_TAP_WINDOW_MS);
  };

  private _tapActionConfig(): ActionConfig | undefined {
    const ta = this._config?.tap_action;
    if (typeof ta === 'string') return undefined; // setConfig normalizes, but be safe
    return ta;
  }

  private _isFullyInert(cfg: AdaptiveCoverProTileCardConfig): boolean {
    const tap = this._tapActionConfig();
    const isNone = (a?: ActionConfig): boolean => !!a && a.action === 'none';
    // tap_action undefined means "default = open ACP dialog" → not inert.
    if (!isNone(tap)) return false;
    if (hasAction(cfg.hold_action)) return false;
    if (hasAction(cfg.double_tap_action)) return false;
    return true;
  }

  private _fireAction(action: 'tap' | 'hold' | 'double_tap'): void {
    if (!this._config || !this.hass) return;
    const tap = this._tapActionConfig();
    if (action === 'tap' && tap === undefined) {
      // Preserve the original default: open the ACP more-info dialog.
      this._dialogOpen = true;
      this.dispatchEvent(new CustomEvent('acp-tile-tap', { bubbles: true, composed: true }));
      return;
    }
    const cover = this._resolvedCoverFromState();
    handleAction(
      this,
      this.hass,
      {
        entity: cover,
        tap_action: tap,
        hold_action: this._config.hold_action,
        double_tap_action: this._config.double_tap_action,
      },
      action,
    );
  }

  private _resolvedCoverFromState(): string | undefined {
    if (this._config?.cover) return this._config.cover;
    if (this._registry === null) return undefined;
    const discovered = discoverEntities(
      this.hass,
      { type: this._config!.type, entry_id: this._config!.entry_id },
      this._registry,
    );
    return discovered?.managed_covers[0];
  }

  private _stop(e: Event): void {
    e.stopPropagation();
  }

  public static styles = css`
    :host {
      display: block;
    }
    ha-card {
      padding: 6px 10px;
      overflow: hidden;
    }
    .tile-body {
      display: grid;
      /* Position column is fixed-width so the controls land at the same x
         across stacked tiles regardless of the digit count (87% vs 100%). */
      grid-template-columns: 24px minmax(0, 1fr) 3rem auto auto auto;
      grid-template-areas: 'icon label position controls badge resume';
      align-items: center;
      column-gap: 8px;
      row-gap: 2px;
      cursor: pointer;
      user-select: none;
      min-width: 0;
    }
    .tile-body.two-line {
      grid-template-columns: 24px 3rem auto minmax(0, 1fr) auto;
      grid-template-rows: auto auto;
      grid-template-areas:
        'icon label    label    label label'
        'icon position controls badge resume';
      row-gap: 4px;
    }
    /* When the state label is rendered ("Open · 12%") the position cell needs
       to grow to fit variable-width text. Strict tile-to-tile alignment of the
       ▲ ■ ▼ controls is impossible once the label is variable, so we let
       the cell auto-size. */
    .tile-body.has-state-label {
      grid-template-columns: 24px minmax(0, 1fr) auto auto auto auto;
    }
    .tile-body.two-line.has-state-label {
      grid-template-columns: 24px auto auto minmax(0, 1fr) auto;
    }
    .tile-body.two-line.has-summary .label {
      display: flex;
      align-items: baseline;
      gap: 8px;
      min-width: 0;
    }
    .tile-body.two-line.has-summary .label .title {
      flex: 1 1 auto;
      min-width: 0;
    }
    .tile-body.two-line.has-summary .label .inline-summary {
      flex: 0 1 auto;
      text-align: right;
    }
    .tile-body[role='group'] {
      cursor: default;
    }
    .cover-icon-wrap {
      grid-area: icon;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }
    .cover-icon {
      --mdc-icon-size: 22px;
      color: var(--primary-text-color);
    }
    .motion-overlay {
      position: absolute;
      top: -4px;
      right: -6px;
      --mdc-icon-size: 12px;
      color: var(--warning-color, #f1c232);
      background: var(--card-background-color, white);
      border-radius: 50%;
      padding: 1px;
      line-height: 0;
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
    .summary {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }
    .position {
      grid-area: position;
      font-size: 0.85rem;
      font-variant-numeric: tabular-nums;
      color: var(--primary-text-color);
      padding: 0 4px;
      /* Right-align the digits so the % sign sits flush against the controls
         column edge — combined with the fixed-width position grid column, this
         keeps the ▲ ■ ▼ row aligned across stacked tiles. */
      text-align: right;
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
      min-width: 0;
      overflow: hidden;
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
