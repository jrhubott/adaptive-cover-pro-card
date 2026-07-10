import { LitElement, html, css, nothing, type TemplateResult, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { entityStateChanged } from '../lib/hass-change';
import type { DiscoveredEntities } from '../types';
import { t } from '../lib/i18n';
import { tooltip } from '../lib/tooltip';

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
  // adaptive-cover-pro#590: keys always present on a current integration but
  // values can be null when the threshold is unconfigured.
  temp_low?: number | null;
  temp_high?: number | null;
  temp_summer_outside?: number | null;
  // Always a non-null slug on #590+; absent on older integrations.
  inactive_reason?: string;
}

// Reason slugs that should NOT render a dedicated standby sub-line:
//   mode_off  → the existing "Climate mode off" label already conveys it.
//   active    → the handler is active and should not reach the standby branch.
const SUPPRESSED_REASONS = new Set(['mode_off', 'active']);

// adaptive-cover-pro-card#168: the `climate_status` sensor STATE (summer_mode /
// winter_mode / intermediate) only records which strategy climate *computed* —
// it is not proof climate is the pipeline winner. `inactive_reason` is the
// integration's authority on whether climate actually holds control.
// undefined = older integration (no slug emitted) → treat as in-control for
// backward compat; 'active' is the in-control slug itself.
export function climateInControl(inactiveReason: string | undefined): boolean {
  return inactiveReason == null || inactiveReason === 'active';
}

// Keyed by slug states emitted by the integration's `climate_status` sensor
// (adaptive-cover-pro#453). The visible strategy label is sourced from
// `hass.formatEntityState`, which goes through the integration's translations.
const STRATEGY_ICONS: Record<string, string> = {
  summer_mode: 'mdi:weather-sunny',
  winter_mode: 'mdi:snowflake',
  intermediate: 'mdi:weather-partly-cloudy',
};

@customElement('acp-climate-panel')
export class ClimatePanel extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered!: DiscoveredEntities;
  @property({ type: Boolean, reflect: true }) public compact = false;

  // Driven by the climate-status sensor (+ the climate-mode switch for the off label);
  // skip hass ticks that touched neither.
  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.size > 1 || !changed.has('hass')) return true;
    const old = changed.get('hass') as HomeAssistant | undefined;
    const e = this.discovered?.entities;
    return entityStateChanged(old, this.hass, [e?.climate_status_sensor, e?.climate_mode_switch]);
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.discovered) return nothing;
    const id = this.discovered.entities.climate_status_sensor;
    if (!id) return nothing; // no climate → hide section entirely
    const st = this.hass.states[id];
    if (!st || st.state === 'unavailable') return nothing;

    if (st.state === 'unknown' || st.state === '') {
      const modeId = this.discovered.entities.climate_mode_switch;
      const modeOff = modeId ? this.hass.states[modeId]?.state === 'off' : false;
      const label = modeOff ? t('climate.mode_off', this.hass) : t('climate.standby', this.hass);
      const icon = modeOff ? 'mdi:power-off' : 'mdi:thermostat';
      const reasonSlug = (st.attributes as unknown as ClimateAttrs)?.inactive_reason;
      return this._renderStandby(icon, label, reasonSlug);
    }

    const strategy = st.state;
    const attrs = (st.attributes as unknown as ClimateAttrs) ?? {};
    const icon = STRATEGY_ICONS[strategy] ?? 'mdi:thermostat';
    const fmt = (this.hass as unknown as { formatEntityState?: (s: unknown) => string })
      .formatEntityState;
    const strategyLabel = typeof fmt === 'function' ? (fmt(st) ?? strategy) : strategy;

    // adaptive-cover-pro-card#168: the sensor STATE only records which strategy
    // climate *computed* — inactive_reason is the authority on whether climate
    // actually holds control. When it doesn't, show the same grayed standby
    // treatment as the unknown/'' branch above (with the resolved strategy
    // label instead of "Standby") rather than the full active view.
    if (!climateInControl(attrs.inactive_reason)) {
      return this._renderStandby(icon, strategyLabel, attrs.inactive_reason);
    }

    const unit = attrs.temperature_unit ?? '°';
    const activeValue =
      attrs.active_temperature !== undefined
        ? `${attrs.active_temperature.toFixed(1)}${unit}`
        : '—';

    // Threshold pairing (adaptive-cover-pro#590). Season math:
    //   current = temp_switch ? outdoor : indoor
    //   winter when current < temp_low; summer when current > temp_high AND
    //   outdoor > temp_summer_outside.
    // So temp_low/temp_high belong to whichever tile is the "current" temp, and
    // temp_summer_outside always belongs to the outdoor tile.
    const isOutdoorCurrent = attrs.temp_switch === true;
    const fragment = (labelKey: string, value: number | null | undefined): string | null => {
      if (value === null || value === undefined || Number.isNaN(value)) return null;
      return `${t(labelKey, this.hass)} ${value.toFixed(1)}${unit}`;
    };
    const indoorThreshold = isOutdoorCurrent
      ? null
      : [
          fragment('climate.threshold_low', attrs.temp_low),
          fragment('climate.threshold_high', attrs.temp_high),
        ]
          .filter((f): f is string => f !== null)
          .join(' ') || null;
    const outdoorThreshold =
      [
        ...(isOutdoorCurrent
          ? [
              fragment('climate.threshold_low', attrs.temp_low),
              fragment('climate.threshold_high', attrs.temp_high),
            ]
          : []),
        fragment('climate.threshold_summer_outside', attrs.temp_summer_outside),
      ]
        .filter((f): f is string => f !== null)
        .join(' ') || null;

    const temps = [
      attrs.indoor_temperature !== undefined
        ? {
            label: t('climate.indoor', this.hass),
            value: attrs.indoor_temperature,
            unit,
            threshold: indoorThreshold,
          }
        : null,
      attrs.outdoor_temperature !== undefined
        ? {
            label: t('climate.outdoor', this.hass),
            value: attrs.outdoor_temperature,
            unit,
            threshold: outdoorThreshold,
          }
        : null,
    ].filter(
      (row): row is { label: string; value: number; unit: string; threshold: string | null } =>
        row !== null,
    );

    const conditions: Array<{ label: string; value: boolean | undefined; icon: string }> = [
      {
        label: t('climate.presence', this.hass),
        value: attrs.is_presence,
        icon: 'mdi:account-check',
      },
      {
        label: t('climate.sunny', this.hass),
        value: attrs.is_sunny,
        icon: 'mdi:white-balance-sunny',
      },
      { label: t('climate.lux', this.hass), value: attrs.lux_active, icon: 'mdi:brightness-7' },
      {
        label: t('climate.irradiance', this.hass),
        value: attrs.irradiance_active,
        icon: 'mdi:solar-power',
      },
    ].filter((c) => c.value !== undefined);

    return html`
      <div class="wrap">
        <div class="head">
          <span class="label">${t('climate.title', this.hass)}</span>
          <span class="dim">${t('climate.active', this.hass, { strategy: activeValue })}</span>
        </div>
        <div class="strategy">
          <ha-icon icon=${icon}></ha-icon>
          <span class="strategy-name">${strategyLabel}</span>
        </div>
        ${temps.length
          ? html`
              <div class="temps">
                ${temps.map(
                  (row) => html`
                    <div class="temp">
                      <span class="temp-label dim">${row.label}</span>
                      <span class="temp-value">${row.value.toFixed(1)}${row.unit}</span>
                      ${row.threshold
                        ? html`<span class="temp-threshold dim">${row.threshold}</span>`
                        : nothing}
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
                    <div class="chip ${c.value ? 'on' : 'off'}" ${tooltip(c.label)}>
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

  // Shared grayed standby treatment: dimmed strategy label + icon, plus an
  // optional localized reason line. Used both when the sensor state itself is
  // unknown/'' (no strategy computed) and when a strategy slug is present but
  // inactive_reason says climate isn't in control (#168).
  private _renderStandby(
    icon: string,
    label: string,
    reasonSlug: string | undefined,
  ): TemplateResult {
    // Older integrations omit the slug → no reason line (backward-compat).
    // mode_off / active are suppressed (see SUPPRESSED_REASONS).
    const reasonLine =
      reasonSlug && !SUPPRESSED_REASONS.has(reasonSlug)
        ? t(`climate.reason.${reasonSlug}`, this.hass)
        : undefined;
    return html`
      <div class="wrap">
        <div class="head">
          <span class="label">${t('climate.title', this.hass)}</span>
        </div>
        <div class="strategy standby">
          <ha-icon icon=${icon}></ha-icon>
          <span class="strategy-name dim">${label}</span>
        </div>
        ${reasonLine ? html`<div class="standby-reason dim">${reasonLine}</div>` : nothing}
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
    .strategy.standby ha-icon {
      color: var(--secondary-text-color);
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
    .temp-threshold {
      font-size: 0.62rem;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .standby-reason {
      font-size: 0.78rem;
    }
    .conditions {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    :host([compact]) .temps {
      gap: 6px;
    }
    :host([compact]) .temp {
      padding: 4px 6px;
    }
    :host([compact]) .strategy {
      font-size: 0.85rem;
    }
    :host([compact]) .head {
      display: none;
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
    [data-tooltip]:hover {
      cursor: help;
    }
    [data-tooltip][acp-tt-shown] {
      cursor: default;
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
