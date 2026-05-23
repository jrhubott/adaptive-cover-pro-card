import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { COVER_TYPE_ICONS, HANDLER_ORDER, INTEGRATION_DOMAIN, type HandlerName } from '../const';
import { buildDecisionSentence, normalizeHandler } from '../lib/decision-summary';
import type {
  CustomPositionSlotSnapshot,
  DecisionTraceAttributes,
  DecisionStep,
  DiscoveredEntities,
  ForecastEvent,
  ForecastSample,
  PositionForecastAttributes,
} from '../types';
import { formatPercent } from '../lib/formatters';

import './tile-badge';
import './decision-strip';
import './overrides-panel';
import './climate-panel';
import './cover-bar';
import './forecast-strip';

/**
 * ACP-specific more-info dialog rendered by the card (not HA's built-in
 * more-info, which is entity-bound and cannot carry ACP-specific context).
 *
 * Renders ALL active badges, the plain-English decision summary, a position
 * block, Resume Auto, and a collapsible Advanced section that embeds the
 * existing panel components for the full diagnostic surface.
 *
 * Slot-management UI (per-slot enable toggles, position tick marks) lands
 * in PR-4 once the integration exposes the snapshot attribute + service.
 */
@customElement('acp-more-info-dialog')
export class MoreInfoDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered!: DiscoveredEntities;
  @property({ type: Boolean, reflect: true }) public open = false;

  @property({ type: Boolean }) public advancedOpen = false;

  protected render(): TemplateResult | typeof nothing {
    if (!this.open || !this.hass || !this.discovered) return nothing;
    const winner = this._winner();
    const attrs = this._traceAttrs();
    const matched = this._matchedHandlers(attrs);
    const summary = attrs ? buildDecisionSentence(attrs.trace ?? [], attrs, winner) : '';
    const target = this._target();
    const hasReset = !!this.discovered.entities.reset_override_button;

    return html`
      <div class="backdrop" data-open @click=${this._onBackdrop}>
        <div class="dialog" @click=${this._stop} role="dialog" aria-modal="true">
          <div class="header">
            <ha-icon
              class="cover-icon"
              icon=${COVER_TYPE_ICONS[this.discovered.cover_type] ?? 'mdi:window-shutter'}
            ></ha-icon>
            <div class="title">${this.discovered.entry_title}</div>
            <div class="badges">
              ${matched.map(
                (h) =>
                  html`<acp-tile-badge
                    .winner=${h}
                    .slotNumber=${h === 'custom_position'
                      ? attrs?.custom_position_active_slot
                      : undefined}
                    .slotName=${h === 'custom_position'
                      ? attrs?.custom_position_active_slot_name
                      : undefined}
                    .pct=${h === 'custom_position' ? (target ?? undefined) : undefined}
                    .minimumMode=${h === 'custom_position'
                      ? attrs?.custom_position_minimum_mode
                      : undefined}
                  ></acp-tile-badge>`,
              )}
            </div>
            <button class="close" type="button" aria-label="Close" @click=${this._emitClose}>
              ✕
            </button>
          </div>

          ${summary ? html`<div class="summary">${summary}</div>` : nothing}

          <div class="position-block">
            <div class="position-label">Target</div>
            <div class="position-value">${formatPercent(target)}</div>
            ${this._mismatchActive()
              ? html`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`
              : nothing}
          </div>

          <acp-cover-bar .hass=${this.hass} .discovered=${this.discovered}></acp-cover-bar>

          ${this._renderForecastStrip()}
          ${hasReset
            ? html`<div class="actions">
                <button class="resume" type="button" @click=${this._onResume}>Resume Auto</button>
              </div>`
            : nothing}

          <button class="advanced-toggle" type="button" @click=${this._toggleAdvanced}>
            ${this.advancedOpen ? '▼ Hide advanced' : '▶ Advanced'}
          </button>
          ${this.advancedOpen
            ? html`<div class="advanced">
                ${this._renderSlots(attrs?.custom_position_slots)}
                <acp-decision-strip
                  .hass=${this.hass}
                  .discovered=${this.discovered}
                ></acp-decision-strip>
                <acp-overrides-panel
                  .hass=${this.hass}
                  .discovered=${this.discovered}
                ></acp-overrides-panel>
                <acp-climate-panel
                  .hass=${this.hass}
                  .discovered=${this.discovered}
                ></acp-climate-panel>
              </div>`
            : nothing}
        </div>
      </div>
    `;
  }

  private _winner(): string {
    const id = this.discovered.entities.decision_trace_sensor;
    if (!id) return 'default';
    return this.hass.states[id]?.state ?? 'default';
  }

  private _traceAttrs(): DecisionTraceAttributes | undefined {
    const id = this.discovered.entities.decision_trace_sensor;
    if (!id) return undefined;
    return this.hass.states[id]?.attributes as unknown as DecisionTraceAttributes | undefined;
  }

  private _matchedHandlers(attrs: DecisionTraceAttributes | undefined): HandlerName[] {
    if (!attrs?.trace) return [];
    const matched = new Set<HandlerName>();
    for (const row of attrs.trace as DecisionStep[]) {
      if (!row.matched) continue;
      const key = normalizeHandler(row.handler) as HandlerName;
      if (HANDLER_ORDER.includes(key)) matched.add(key);
    }
    // Preserve HANDLER_ORDER (highest priority first) for badge sequence.
    return HANDLER_ORDER.filter((h) => matched.has(h));
  }

  private _target(): number | null {
    const id = this.discovered.entities.target_position_sensor;
    if (!id) return null;
    const st = this.hass.states[id];
    if (!st) return null;
    const v = parseFloat(st.state);
    return Number.isNaN(v) ? null : v;
  }

  private _mismatchActive(): boolean {
    const id = this.discovered.entities.position_mismatch_binary;
    if (!id) return false;
    return this.hass.states[id]?.state === 'on';
  }

  private _onResume = (): void => {
    const btn = this.discovered.entities.reset_override_button;
    if (!btn) return;
    this.hass.callService('button', 'press', { entity_id: btn });
  };

  private _renderSlots(
    slots: CustomPositionSlotSnapshot[] | undefined,
  ): TemplateResult | typeof nothing {
    if (!slots) return nothing;
    const configured = slots.filter((s) => s.sensor !== null);
    if (configured.length === 0) return nothing;
    return html`<div class="slots-section">
      <div class="slots-label">Custom positions</div>
      ${configured.map((s) => this._renderSlotRow(s))}
    </div>`;
  }

  private _renderSlotRow(slot: CustomPositionSlotSnapshot): TemplateResult {
    const label = slot.sensor_name ?? `#${slot.slot}`;
    return html`<div class="slot-row" data-slot=${slot.slot}>
      <span class="slot-label">${label}</span>
      <span class="slot-position">${formatPercent(slot.position)}</span>
      ${slot.min_mode === true
        ? html`<span class="slot-min-mode" title="Floor — slot raises position above raw calc">
            floor
          </span>`
        : nothing}
      <button
        class="slot-toggle ${slot.enabled ? 'on' : 'off'}"
        type="button"
        aria-label=${slot.enabled ? `Disable slot ${slot.slot}` : `Enable slot ${slot.slot}`}
        @click=${() => this._toggleSlot(slot)}
      >
        ${slot.enabled ? 'On' : 'Off'}
      </button>
    </div>`;
  }

  private _renderForecastStrip(): TemplateResult | typeof nothing {
    const id = this.discovered.entities.position_forecast_sensor;
    if (!id) return nothing;
    const attrs = this.hass.states[id]?.attributes as PositionForecastAttributes | undefined;
    const samples: ForecastSample[] = attrs?.forecast ?? [];
    const events: ForecastEvent[] = attrs?.events ?? [];
    if (samples.length === 0) return nothing;
    return html`<div class="forecast-block">
      <div class="forecast-label">Today's forecast</div>
      <acp-forecast-strip .samples=${samples} .events=${events}></acp-forecast-strip>
    </div>`;
  }

  private _toggleSlot(slot: CustomPositionSlotSnapshot): void {
    const target = this.discovered.managed_covers[0];
    if (!target) return;
    this.hass.callService(INTEGRATION_DOMAIN, 'set_custom_position', {
      entity_id: target,
      slot: slot.slot,
      enabled: !slot.enabled,
    });
  }

  private _toggleAdvanced = (): void => {
    this.advancedOpen = !this.advancedOpen;
  };

  private _onBackdrop = (e: MouseEvent): void => {
    if (e.target === e.currentTarget) this._emitClose();
  };

  private _emitClose = (): void => {
    this.dispatchEvent(new CustomEvent('acp-dialog-close', { bubbles: true, composed: true }));
  };

  private _stop = (e: Event): void => {
    e.stopPropagation();
  };

  public static styles = css`
    :host {
      display: contents;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 5vh 12px;
      overflow-y: auto;
    }
    .dialog {
      width: 100%;
      max-width: 520px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color);
      border-radius: 12px;
      padding: 14px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .header .cover-icon {
      --mdc-icon-size: 22px;
    }
    .header .title {
      font-size: 1.1rem;
      font-weight: 600;
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .header .badges {
      display: inline-flex;
      gap: 4px;
      flex-wrap: wrap;
    }
    .close {
      border: 0;
      background: transparent;
      cursor: pointer;
      font-size: 1.1rem;
      color: var(--secondary-text-color);
      padding: 4px 6px;
    }
    .close:hover {
      color: var(--primary-text-color);
    }
    .summary {
      font-size: 0.9rem;
      font-style: italic;
      color: var(--secondary-text-color);
    }
    .position-block {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
    }
    .position-label {
      color: var(--secondary-text-color);
    }
    .position-value {
      font-variant-numeric: tabular-nums;
      font-weight: 600;
    }
    .warn {
      color: var(--warning-color, orange);
      --mdc-icon-size: 18px;
    }
    .actions {
      display: flex;
      gap: 8px;
    }
    .resume {
      padding: 6px 14px;
      border: 1px solid var(--primary-color);
      border-radius: 999px;
      background: transparent;
      color: var(--primary-color);
      font-size: 0.9rem;
      cursor: pointer;
    }
    .resume:hover {
      background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.08);
    }
    .advanced-toggle {
      border: 0;
      background: transparent;
      cursor: pointer;
      color: var(--primary-color);
      font-size: 0.85rem;
      text-align: left;
      padding: 4px 0;
    }
    .advanced {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 4px;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }
    .slots-section {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .slots-label {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .slot-row {
      display: grid;
      grid-template-columns: 1fr auto auto auto;
      gap: 8px;
      align-items: center;
      font-size: 0.85rem;
      padding: 2px 4px;
    }
    .slot-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .slot-position {
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .slot-min-mode {
      font-size: 0.7rem;
      padding: 1px 6px;
      border-radius: 999px;
      background: rgba(156, 39, 176, 0.22);
      color: #6a1b9a;
    }
    .slot-toggle {
      padding: 2px 10px;
      border-radius: 999px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.16));
      background: transparent;
      cursor: pointer;
      font-size: 0.75rem;
      min-width: 40px;
    }
    .slot-toggle.on {
      background: rgba(76, 175, 80, 0.22);
      color: #1b5e20;
      border-color: rgba(76, 175, 80, 0.5);
    }
    .slot-toggle.off {
      color: var(--secondary-text-color);
    }
    .forecast-block {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .forecast-label {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  `;
}
