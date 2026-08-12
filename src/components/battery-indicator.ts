import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { resolveCoverBatteries, lowestBattery, batteryIcon, isLowBattery } from '../lib/battery';
import { t } from '../lib/i18n';
import { tooltip } from '../lib/tooltip';

/**
 * Battery indicator for a set of covers, shared by the cover more-info dialog
 * and the group dialog so the two can never drift.
 *
 * Renders nothing when no cover in the set reports a battery. The glyph tracks
 * the WORST cell — a two-motor shade with one flat battery has to read as flat
 * — while the tooltip names every cover so which one is low stays recoverable.
 *
 * Clicking it leaves the dashboard for HA's own History panel, preloaded with
 * every battery source in the set, which is where an actual discharge curve
 * lives. The card has no business re-plotting that.
 */
@customElement('acp-battery-indicator')
export class BatteryIndicator extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  /** Covers whose batteries this indicator summarizes. */
  @property({ attribute: false }) public coverIds: string[] = [];

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass) return nothing;
    const batteries = resolveCoverBatteries(this.hass, this.coverIds ?? []);
    const worst = lowestBattery(batteries);
    if (!worst) return nothing;

    const levels =
      batteries.length === 1
        ? worst.level === null
          ? t('dialog.battery_unknown', this.hass)
          : t('dialog.battery', this.hass, { level: worst.level })
        : batteries
            .map((b) =>
              t('dialog.battery_named', this.hass, {
                name: this._coverName(b.cover_id),
                level: b.level === null ? '—' : b.level,
              }),
            )
            .join(' · ');
    const action = t('dialog.battery_history', this.hass);
    const title = `${levels} · ${action}`;

    return html`<button
      class="battery${isLowBattery(worst) ? ' low' : ''}"
      type="button"
      aria-label=${title}
      ${tooltip(title)}
      @click=${this._openHistory}
    >
      <ha-icon icon=${batteryIcon(worst.level, worst.charging)}></ha-icon>
    </button>`;
  }

  private _coverName(coverId: string): string {
    return (this.hass?.states[coverId]?.attributes?.friendly_name as string | undefined) ?? coverId;
  }

  /**
   * HA's History panel reads a comma-separated `entity_id` from the query
   * string, so all of the entry's battery sources land on one chart. The
   * sources are deduped — two covers on a single physical device share one
   * battery sensor, and a repeated id makes the panel's target picker show the
   * same row twice.
   */
  private _openHistory = (): void => {
    const batteries = resolveCoverBatteries(this.hass, this.coverIds ?? []);
    const sources = [...new Set(batteries.map((b) => b.source_id))];
    if (sources.length === 0) return;
    history.pushState(null, '', `/history?entity_id=${sources.join(',')}`);
    window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
    this.dispatchEvent(new CustomEvent('acp-dialog-close', { bubbles: true, composed: true }));
  };

  public static styles = css`
    :host {
      display: contents;
    }
    /* Shares the dialogs' .icon-btn metrics so it lines up with the buttons
       beside it in either header. */
    .battery {
      border: 0;
      background: transparent;
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 4px 6px;
      display: inline-flex;
      align-items: center;
      --mdc-icon-size: 18px;
    }
    .battery:hover {
      color: var(--primary-text-color);
    }
    .battery.low {
      color: var(--error-color, #db4437);
    }
    .battery.low:hover {
      color: var(--error-color, #db4437);
      filter: brightness(1.2);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'acp-battery-indicator': BatteryIndicator;
  }
}
