import { LitElement, html, css, nothing, type TemplateResult, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { entityStateChanged } from '../lib/hass-change';
import type { DiscoveredEntities } from '../types';
import { buildSolarCalcView, hiddenFieldCount, type SolarAxisView } from '../lib/solar-calc';
import { t } from '../lib/i18n';

/**
 * Solar Calculation breakdown. Renders the integration's `solar_calculation`
 * diagnostic sensor as an input → intermediate → output trace, so a user can
 * see why the Solar handler produced a given raw position. Curated by default;
 * a "show all" toggle reveals every raw geometric value. Venetian covers render
 * a second tilt-axis group. Self-hides when the sensor is absent (older
 * integration) — graceful degrade, no placeholder.
 */
@customElement('acp-solar-calc')
export class SolarCalc extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered!: DiscoveredEntities;
  @property({ type: Boolean, reflect: true }) public compact = false;

  @state() private _showAll = false;

  // Driven solely by the solar_calculation sensor; skip unrelated hass ticks.
  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.size > 1 || !changed.has('hass')) return true;
    const old = changed.get('hass') as HomeAssistant | undefined;
    return entityStateChanged(old, this.hass, [this.discovered?.entities.solar_calculation_sensor]);
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.discovered) return nothing;
    const id = this.discovered.entities.solar_calculation_sensor;
    if (!id) return nothing; // older integration → no sensor → hide section
    const st = this.hass.states[id];
    if (!st || st.state === 'unavailable') return nothing;

    const attrs = st.attributes as unknown as Record<string, unknown>;
    const view = buildSolarCalcView(attrs, this._showAll);
    const hidden = hiddenFieldCount(attrs);

    return html`
      <div class="wrap">
        <div class="head">
          <span class="label">${t('solar.title', this.hass)}</span>
          ${this._statusChip(view.position.status)}
        </div>
        ${this._axis(view.position, view.tilt ? t('solar.axis_position', this.hass) : undefined)}
        ${view.tilt ? this._axis(view.tilt, t('solar.axis_tilt', this.hass)) : nothing}
        ${hidden > 0
          ? html`<button class="show-all" type="button" @click=${this._toggleShowAll}>
              ${this._showAll
                ? t('solar.show_less', this.hass)
                : t('solar.show_all', this.hass, { count: hidden })}
            </button>`
          : nothing}
      </div>
    `;
  }

  private _statusChip(status: string | undefined): TemplateResult | typeof nothing {
    if (!status) return nothing;
    const direct = status.startsWith('Direct');
    const slug = this._statusSlug(status);
    // Unrecognised status → render the integration's raw string verbatim.
    const label = slug === '_unknown' ? status : t(`solar.status.${slug}`, this.hass);
    return html`<span class="status-chip ${direct ? 'direct' : 'default'}">${label}</span>`;
  }

  // Map the integration's status strings to i18n slugs; falls back to the raw
  // string when unrecognised (t() returns the key, so we guard in the caller).
  private _statusSlug(status: string): string {
    const map: Record<string, string> = {
      'Direct Sun': 'direct_sun',
      'Default: FOV Exit': 'fov_exit',
      'Default: Elevation Limit': 'elevation_limit',
      'Default: Sunset Offset': 'sunset_offset',
      'Default: Blind Spot': 'blind_spot',
      Default: 'default',
    };
    return map[status] ?? '_unknown';
  }

  private _axis(axis: SolarAxisView, title: string | undefined): TemplateResult {
    return html`
      <div class="axis">
        ${title ? html`<div class="axis-title dim">${title}</div>` : nothing}
        ${this._group(t('solar.group_inputs', this.hass), axis.inputs)}
        ${this._group(t('solar.group_intermediates', this.hass), axis.intermediates)}
        ${axis.hasTarget
          ? this._group(t('solar.group_output', this.hass), axis.output)
          : html`<div class="no-target dim">
              ${t('solar.no_target', this.hass, { status: axis.status ?? '—' })}
            </div>`}
      </div>
    `;
  }

  private _group(title: string, fields: SolarAxisView['inputs']): TemplateResult | typeof nothing {
    if (fields.length === 0) return nothing;
    return html`
      <div class="group">
        <div class="group-label dim">${title}</div>
        <div class="rows">
          ${fields.map(
            (f) =>
              html`<div class="row">
                <span class="key ${f.curated ? '' : 'raw'}"
                  >${f.curated ? t(`solar.field.${f.key}`, this.hass) : f.key}</span
                >
                <span class="value">${f.value}</span>
              </div>`,
          )}
        </div>
      </div>
    `;
  }

  private _toggleShowAll = (): void => {
    this._showAll = !this._showAll;
  };

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
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }
    .label {
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .status-chip {
      font-size: 0.72rem;
      padding: 1px 8px;
      border-radius: 999px;
      white-space: nowrap;
    }
    .status-chip.direct {
      background: rgba(76, 175, 80, 0.22);
      color: #1b5e20;
    }
    .status-chip.default {
      background: rgba(96, 125, 139, 0.22);
      color: #37474f;
    }
    .axis {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .axis-title {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-weight: 600;
    }
    .group {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .group-label {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .rows {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 1px 12px;
    }
    .row {
      display: contents;
    }
    .key {
      font-size: 0.82rem;
    }
    .key.raw {
      font-family: var(--code-font-family, monospace);
      font-size: 0.74rem;
      color: var(--secondary-text-color);
    }
    .value {
      font-size: 0.82rem;
      font-variant-numeric: tabular-nums;
      text-align: right;
      white-space: nowrap;
    }
    .no-target {
      font-size: 0.82rem;
      font-style: italic;
    }
    .show-all {
      align-self: flex-start;
      border: 0;
      background: transparent;
      cursor: pointer;
      color: var(--primary-color);
      font-size: 0.8rem;
      padding: 2px 0;
    }
    :host([compact]) .head {
      display: none;
    }
    .dim {
      color: var(--secondary-text-color);
    }
    [data-tooltip]:hover {
      cursor: help;
    }
    [data-tooltip][acp-tt-shown] {
      cursor: default;
    }
  `;
}
