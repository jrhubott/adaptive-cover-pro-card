import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import type { DiscoveredEntities } from '../types';
import { countdownTo } from '../lib/formatters';

@customElement('acp-overrides-panel')
export class OverridesPanel extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered!: DiscoveredEntities;
  @property({ type: Boolean, reflect: true }) public compact = false;

  private _manualActive(): boolean {
    const id = this.discovered.entities.manual_override_binary;
    return id ? this.hass.states[id]?.state === 'on' : false;
  }

  private _manualEndIso(): string | null {
    const id = this.discovered.entities.manual_override_end_sensor;
    if (!id) return null;
    const st = this.hass.states[id];
    if (!st || st.state === 'unknown' || st.state === 'unavailable') return null;
    return st.state;
  }

  private _motionStatus(): { state: string; endIso: string | null } | null {
    const id = this.discovered.entities.motion_status_sensor;
    if (!id) return null;
    const st = this.hass.states[id];
    if (!st) return null;
    const endIso = (st.attributes as { motion_timeout_end_time?: string }).motion_timeout_end_time;
    return { state: st.state, endIso: endIso ?? null };
  }

  private _forceActive(): number {
    const id = this.discovered.entities.force_override_sensor;
    if (!id) return 0;
    const st = this.hass.states[id];
    if (!st) return 0;
    return parseInt(st.state, 10) || 0;
  }

  private _resetManual(): void {
    const id = this.discovered.entities.reset_override_button;
    if (!id) return;
    this.hass.callService('button', 'press', { entity_id: id });
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.discovered) return nothing;
    const manualActive = this._manualActive();
    const manualEnd = this._manualEndIso();
    const motion = this._motionStatus();
    const forceCount = this._forceActive();
    const resetId = this.discovered.entities.reset_override_button;

    return html`
      <div class="wrap">
        <div class="label dim">Overrides</div>
        <div class="grid">
          <div class="tile ${manualActive ? 'active' : ''}">
            <div class="tile-label">Manual</div>
            <div class="tile-value">${manualActive ? 'Active' : 'Off'}</div>
            ${manualEnd
              ? html`<div class="tile-sub dim">ends in ${countdownTo(manualEnd)}</div>`
              : nothing}
          </div>

          <div class="tile ${forceCount > 0 ? 'active warning' : ''}">
            <div class="tile-label">Force</div>
            <div class="tile-value">${forceCount > 0 ? `${forceCount} active` : 'Off'}</div>
          </div>

          ${motion
            ? html`<div class="tile ${motion.state === 'motion_detected' ? 'active' : ''}">
                <div class="tile-label">Motion</div>
                <div class="tile-value">${motion.state.replace(/_/g, ' ')}</div>
                ${motion.endIso
                  ? html`<div class="tile-sub dim">timeout ${countdownTo(motion.endIso)}</div>`
                  : nothing}
              </div>`
            : nothing}
          ${resetId
            ? html`<button class="tile action" @click=${this._resetManual}>
                <ha-icon icon="mdi:restore"></ha-icon>
                <div class="tile-value">Reset Manual</div>
              </button>`
            : nothing}
        </div>
      </div>
    `;
  }

  public static styles = css`
    :host {
      display: block;
    }
    .wrap {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .label {
      font-size: 0.78rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
      gap: 6px;
    }
    .tile {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 8px 10px;
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      font-size: 0.8rem;
    }
    :host([compact]) .tile {
      padding: 4px 8px;
      font-size: 0.72rem;
    }
    :host([compact]) .tile-sub {
      display: none;
    }
    .tile.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .tile.active.warning {
      background: var(--warning-color, orange);
    }
    .tile.action {
      cursor: pointer;
      border: none;
      text-align: left;
      font-family: inherit;
      align-items: flex-start;
    }
    .tile.action:hover {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .tile-label {
      font-size: 0.72rem;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .tile-value {
      font-weight: 500;
    }
    .tile-sub {
      font-size: 0.72rem;
    }
    .dim {
      color: var(--secondary-text-color);
    }
    .tile.active .dim {
      color: inherit;
      opacity: 0.85;
    }
    ha-icon {
      --mdc-icon-size: 18px;
    }
  `;
}
