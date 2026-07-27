import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { HISTORY_DEFAULT_HOURS } from '../const';
import { t } from '../lib/i18n';
import type { DiscoveredEntities, HistoryTracksConfig } from '../types';

import './history-view';

/**
 * Overlay host for {@link HistoryView}, opened from the tile / root / decision
 * cards. Standalone use goes through `adaptive-cover-pro-history-card` instead —
 * both render the same `acp-history-view`, so the two entry points can never
 * drift.
 *
 * Deliberately a thin wrapper: chrome (backdrop, header, close, scroll, escape)
 * lives here so the view element stays free of dialog concerns and renders
 * identically inside an `ha-card`. The view is kept in the DOM while closed but
 * has `active` false, which gates every recorder/diagnostics fetch — same
 * pattern as `more-info-dialog.ts`'s `open` gate.
 */
@customElement('acp-history-dialog')
export class HistoryDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered!: DiscoveredEntities;
  @property({ type: Boolean, reflect: true }) public open = false;
  @property({ type: Number }) public hours = HISTORY_DEFAULT_HOURS;
  @property({ attribute: false }) public tracks?: HistoryTracksConfig;

  /** Which section the view has maximized, or null. The panel grows so the
   *  section has room, and its body stops scrolling so the section itself
   *  becomes the only scroller. Width is tuned per section: the charts and the
   *  event table are genuinely wide, an activity list at 1200px is mostly
   *  gutter. */
  @state() private _expanded: string | null = null;

  public connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('keydown', this._onKeyDown);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._onKeyDown);
  }

  private _onKeyDown = (e: KeyboardEvent): void => {
    if (this.open && e.key === 'Escape') this._close();
  };

  private _close = (): void => {
    this.open = false;
    // Leave maximized mode with the dialog: reopening should land on the normal
    // History view, not on whatever the last session was maximized into.
    this._expanded = null;
    this.dispatchEvent(new CustomEvent('acp-history-closed', { bubbles: true, composed: true }));
  };

  /** Backdrop click closes; a click that started inside the panel must not. */
  private _onBackdrop = (e: MouseEvent): void => {
    if (e.target === e.currentTarget) this._close();
  };

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.discovered) return nothing;
    const title = this.discovered.entry_title || t('history.title', this.hass);
    return html`
      <div
        class="backdrop"
        role="dialog"
        aria-modal="true"
        aria-label=${t('history.title', this.hass)}
        @click=${this._onBackdrop}
      >
        <div
          class=${`panel${this._expanded ? ' expanded' : ''}${
            this._expanded === 'activity' ? ' narrow' : ''
          }`}
        >
          <header>
            <div class="titles">
              <span class="title">${title}</span>
              <span class="subtitle">${t('history.title', this.hass)}</span>
            </div>
            <button
              type="button"
              class="close"
              @click=${this._close}
              aria-label=${t('history.close', this.hass)}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          <div class="body">
            <acp-history-view
              .hass=${this.hass}
              .discovered=${this.discovered}
              .hours=${this.hours}
              .tracks=${this.tracks}
              .active=${this.open}
              @acp-history-hours=${(e: CustomEvent<{ hours: number }>) => {
                this.hours = e.detail.hours;
              }}
              @acp-history-expand=${(e: CustomEvent<{ section: string | null }>) => {
                this._expanded = e.detail.section;
              }}
            ></acp-history-view>
          </div>
        </div>
      </div>
    `;
  }

  public static styles = css`
    :host {
      display: none;
    }
    :host([open]) {
      display: block;
    }
    /* Above the more-info dialog's backdrop (z-index 9999), because History is
       most often opened FROM that dialog and renders as its sibling — anything
       lower is painted behind it and cannot be seen or clicked. Still below the
       card's floating-tooltip layer (100000), so tooltips inside History work. */
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 10000;
      background: rgba(0, 0, 0, 0.45);
      display: grid;
      place-items: center;
      padding: 16px;
      box-sizing: border-box;
    }
    .panel {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      width: min(720px, 100%);
      max-height: min(86vh, 900px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    /* Maximized: wider for the charts' time axis and the event table's three
       columns, taller for row count, and the body stops scrolling so the
       section owns the scroll. */
    .panel.expanded {
      width: min(1200px, 100%);
      height: min(94vh, 1200px);
      max-height: 94vh;
    }
    .panel.expanded.narrow {
      width: min(900px, 100%);
    }
    .panel.expanded .body {
      overflow: hidden;
      display: flex;
      min-height: 0;
    }
    .panel.expanded .body acp-history-view {
      flex: 1;
      min-height: 0;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 14px 8px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    }
    .titles {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .title {
      font-size: 1rem;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .subtitle {
      font-size: 0.72rem;
      color: var(--secondary-text-color);
    }
    .close {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 4px;
      display: inline-flex;
    }
    .body {
      padding: 12px 14px 14px;
      overflow-y: auto;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'acp-history-dialog': HistoryDialog;
  }
}
