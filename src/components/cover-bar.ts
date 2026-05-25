import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import type { CoverPositionAttributes, DiscoveredEntities } from '../types';
import { formatPercent } from '../lib/formatters';
import { t } from '../lib/i18n';

@customElement('acp-cover-bar')
export class CoverBar extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered!: DiscoveredEntities;
  @property({ type: Boolean, reflect: true }) public compact = false;

  private _target(): { target: number | null; covers: Record<string, number | null> } {
    const id = this.discovered.entities.target_position_sensor;
    if (!id) return { target: null, covers: {} };
    const st = this.hass.states[id];
    if (!st) return { target: null, covers: {} };
    const target = parseFloat(st.state);
    const attrs = st.attributes as unknown as CoverPositionAttributes;
    return {
      target: Number.isNaN(target) ? null : target,
      covers: attrs?.actual_positions ?? {},
    };
  }

  private _mismatched(): Set<string> {
    const id = this.discovered.entities.position_mismatch_binary;
    if (!id) return new Set();
    const st = this.hass.states[id];
    if (st?.state !== 'on') return new Set();
    const entities = (st.attributes as { entities?: Record<string, { mismatch: boolean }> })
      .entities;
    if (!entities) return new Set();
    return new Set(
      Object.entries(entities)
        .filter(([, v]) => v.mismatch)
        .map(([k]) => k),
    );
  }

  private _setPosition(entityId: string, position: number): void {
    this.hass.callService('cover', 'set_cover_position', { entity_id: entityId, position });
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.discovered) return nothing;
    const { target, covers } = this._target();
    const mismatched = this._mismatched();
    const entries = Object.entries(covers);
    if (entries.length === 0) {
      return html`<div class="placeholder">${t('covers.placeholder', this.hass)}</div>`;
    }
    return html`
      <div class="wrap">
        <div class="head">
          <span class="label">${t('covers.title', this.hass)}</span>
          <span class="target"
            >${t('covers.target', this.hass, { pct: formatPercent(target) })}</span
          >
        </div>
        ${entries.map(([id, actual]) => this._bar(id, actual, target, mismatched.has(id)))}
      </div>
    `;
  }

  private _bar(
    entityId: string,
    actual: number | null,
    target: number | null,
    mismatch: boolean,
  ): TemplateResult {
    const friendly =
      (this.hass.states[entityId]?.attributes?.friendly_name as string | undefined) ?? entityId;
    const actualPct = actual ?? 0;
    const targetPct = target ?? 0;
    return html`
      <div class="cover ${mismatch ? 'mismatch' : ''}">
        <div class="name" title=${entityId}>${friendly}</div>
        <div
          class="track"
          @click=${(e: MouseEvent) => this._handleTrackClick(e, entityId)}
          title=${t('covers.click_to_set', this.hass)}
        >
          <div class="fill" style="width:${actualPct}%"></div>
          ${target !== null
            ? html`<div
                class="marker"
                style="left:${targetPct}%"
                title=${t('covers.target_tooltip', this.hass, { pct: targetPct })}
              ></div>`
            : nothing}
        </div>
        <div class="num">${formatPercent(actual)}</div>
        ${mismatch
          ? html`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`
          : nothing}
      </div>
    `;
  }

  private _handleTrackClick(e: MouseEvent, entityId: string): void {
    const track = e.currentTarget as HTMLElement;
    const rect = track.getBoundingClientRect();
    const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const clamped = Math.max(0, Math.min(100, pct));
    this._setPosition(entityId, clamped);
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
    .head {
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }
    .label {
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .target {
      font-variant-numeric: tabular-nums;
    }
    .cover {
      display: grid;
      grid-template-columns: minmax(80px, 1fr) 3fr 48px auto;
      gap: 8px;
      align-items: center;
      font-size: 0.82rem;
    }
    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .track {
      position: relative;
      height: 10px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.08));
      border-radius: 6px;
      cursor: pointer;
      overflow: hidden;
    }
    :host([compact]) .track {
      height: 6px;
    }
    :host([compact]) .cover {
      font-size: 0.75rem;
      gap: 6px;
    }
    :host([compact]) .head {
      display: none;
    }
    .fill {
      height: 100%;
      background: var(--primary-color);
      transition: width 0.3s ease;
    }
    .marker {
      position: absolute;
      top: -2px;
      width: 2px;
      height: 14px;
      background: var(--accent-color, red);
      transition: left 0.3s ease;
    }
    .num {
      font-variant-numeric: tabular-nums;
      text-align: right;
    }
    .warn {
      color: var(--warning-color, orange);
      --mdc-icon-size: 16px;
    }
    .mismatch .fill {
      background: var(--warning-color, orange);
    }
    .placeholder {
      color: var(--secondary-text-color);
      text-align: center;
      padding: 16px;
    }
  `;
}
