import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import type { DiscoveredEntities } from '../types';

interface ClimateAttrs {
  active_temperature?: number;
  temperature_unit?: string;
  indoor_temperature?: number;
  outdoor_temperature?: number;
  temp_switch?: boolean;
  is_presence?: boolean;
  is_sunny?: boolean;
  lux_active?: boolean;
  irradiance_active?: boolean;
}

const STRATEGY_ICONS: Record<string, string> = {
  'Summer Mode': 'mdi:weather-sunny',
  'Winter Mode': 'mdi:snowflake',
  Intermediate: 'mdi:weather-partly-cloudy',
};

@customElement('acp-climate-panel')
export class ClimatePanel extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered!: DiscoveredEntities;

  protected render(): TemplateResult | typeof nothing {
    const id = this.discovered.entities.climate_status_sensor;
    if (!id) return nothing; // no climate → hide section entirely
    const st = this.hass.states[id];
    if (!st || st.state === 'unavailable') return nothing;

    const strategy = st.state;
    const attrs = (st.attributes as unknown as ClimateAttrs) ?? {};
    const icon = STRATEGY_ICONS[strategy] ?? 'mdi:thermostat';
    const unit = attrs.temperature_unit ?? '°';

    const temps = [
      attrs.indoor_temperature !== undefined
        ? { label: 'Indoor', value: attrs.indoor_temperature, unit }
        : null,
      attrs.outdoor_temperature !== undefined
        ? { label: 'Outdoor', value: attrs.outdoor_temperature, unit }
        : null,
    ].filter((t): t is { label: string; value: number; unit: string } => t !== null);

    const conditions: Array<{ label: string; value: boolean | undefined; icon: string }> = [
      { label: 'Presence', value: attrs.is_presence, icon: 'mdi:account-check' },
      { label: 'Sunny', value: attrs.is_sunny, icon: 'mdi:white-balance-sunny' },
      { label: 'Lux', value: attrs.lux_active, icon: 'mdi:brightness-7' },
      { label: 'Irradiance', value: attrs.irradiance_active, icon: 'mdi:solar-power' },
    ].filter((c) => c.value !== undefined);

    return html`
      <div class="wrap">
        <div class="head">
          <span class="label">Climate</span>
          <span class="dim"
            >Active:
            ${attrs.active_temperature !== undefined
              ? `${attrs.active_temperature.toFixed(1)}${unit}`
              : '—'}</span
          >
        </div>
        <div class="strategy">
          <ha-icon icon=${icon}></ha-icon>
          <span class="strategy-name">${strategy}</span>
        </div>
        ${temps.length
          ? html`
              <div class="temps">
                ${temps.map(
                  (t) => html`
                    <div class="temp">
                      <span class="temp-label dim">${t.label}</span>
                      <span class="temp-value">${t.value.toFixed(1)}${t.unit}</span>
                    </div>
                  `,
                )}
              </div>
            `
          : nothing}
        ${conditions.length
          ? html`
              <div class="conditions">
                ${conditions.map(
                  (c) => html`
                    <div class="chip ${c.value ? 'on' : 'off'}" title=${c.label}>
                      <ha-icon icon=${c.icon}></ha-icon>
                      <span>${c.label}</span>
                    </div>
                  `,
                )}
              </div>
            `
          : nothing}
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
    .strategy {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
      font-weight: 500;
    }
    .strategy ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }
    .temps {
      display: flex;
      gap: 12px;
    }
    .temp {
      display: flex;
      flex-direction: column;
      padding: 6px 10px;
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      min-width: 64px;
    }
    .temp-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .temp-value {
      font-variant-numeric: tabular-nums;
      font-weight: 500;
    }
    .conditions {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 0.72rem;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .chip.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .chip.off {
      opacity: 0.5;
    }
    .chip ha-icon {
      --mdc-icon-size: 14px;
    }
    .dim {
      color: var(--secondary-text-color);
    }
  `;
}
