import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';

import { SKY_COMPASS_CARD_EDITOR_NAME, SKY_COMPASS_CARD_NAME } from './const';
import { fetchAcpConfigEntries, type AcpConfigEntry } from './lib/config-entries';
import type { SkyCompassCardConfig } from './types';

type ToggleKey =
  | 'compact'
  | 'show_legend'
  | 'show_stats'
  | 'show_moon'
  | 'show_cardinals'
  | 'show_blind_spot'
  | 'show_sun_path'
  | 'show_sunrise_sunset'
  | 'show_cover_fill'
  | 'show_window_arrow';

interface ToggleRow {
  key: ToggleKey;
  label: string;
  description: string;
  defaultOn: boolean;
}

const TOGGLE_ROWS: ToggleRow[] = [
  {
    key: 'compact',
    label: 'Compact mode',
    description: 'Smaller SVG, legend hidden.',
    defaultOn: false,
  },
  {
    key: 'show_legend',
    label: 'Legend',
    description: 'Color swatches + entry labels below compass.',
    defaultOn: true,
  },
  {
    key: 'show_stats',
    label: 'Stats',
    description: 'Sun + per-window numeric rows.',
    defaultOn: true,
  },
  {
    key: 'show_moon',
    label: 'Moon',
    description: 'Render moon position and phase.',
    defaultOn: false,
  },
  {
    key: 'show_cardinals',
    label: 'Cardinal labels',
    description: 'N/E/S/W letters around the compass.',
    defaultOn: true,
  },
  {
    key: 'show_blind_spot',
    label: 'Blind spots',
    description: 'Hatched wedges for each window’s blind range.',
    defaultOn: true,
  },
  {
    key: 'show_sun_path',
    label: 'Sun path',
    description: 'Today’s sun arc across the sky.',
    defaultOn: true,
  },
  {
    key: 'show_sunrise_sunset',
    label: 'Sunrise / sunset markers',
    description: 'Small dots at rise and set azimuths.',
    defaultOn: true,
  },
  {
    key: 'show_cover_fill',
    label: 'Cover closure fill',
    description: 'Inner wedge showing how closed each cover is.',
    defaultOn: true,
  },
  {
    key: 'show_window_arrow',
    label: 'Window-normal arrow',
    description: 'Line from center toward each window’s azimuth.',
    defaultOn: true,
  },
];

@customElement(SKY_COMPASS_CARD_EDITOR_NAME)
export class AdaptiveCoverProSkyCompassCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: SkyCompassCardConfig;
  @state() private _entries: AcpConfigEntry[] | null = null;
  @state() private _entriesError: string | null = null;
  private _fetchInFlight = false;

  public setConfig(config: SkyCompassCardConfig): void {
    this._config = config;
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has('hass') && this.hass && !this._entries && !this._fetchInFlight) {
      this._fetchInFlight = true;
      fetchAcpConfigEntries(this.hass)
        .then((entries) => {
          this._entries = entries;
          this._entriesError = null;
        })
        .catch((err: Error) => {
          this._entriesError = err?.message ?? 'failed to load config entries';
        })
        .finally(() => {
          this._fetchInFlight = false;
        });
    }
  }

  private _emit(next: SkyCompassCardConfig): void {
    this._config = next;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _baseConfig(): SkyCompassCardConfig {
    return this._config ?? { type: `custom:${SKY_COMPASS_CARD_NAME}`, entry_ids: [] };
  }

  private _onEntryToggle(entryId: string, enabled: boolean): void {
    const base = this._baseConfig();
    const current = new Set(base.entry_ids);
    if (enabled) current.add(entryId);
    else current.delete(entryId);
    // Preserve discovery order for consistency.
    const ordered = (this._entries ?? []).map((e) => e.entry_id).filter((id) => current.has(id));
    this._emit({ ...base, entry_ids: ordered });
  }

  private _onToggle(key: ToggleKey, enabled: boolean): void {
    this._emit({ ...this._baseConfig(), [key]: enabled });
  }

  private _onTitleChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    const base = this._baseConfig();
    if (value) this._emit({ ...base, title: value });
    else {
      const { title: _title, ...rest } = base;
      void _title;
      this._emit(rest as SkyCompassCardConfig);
    }
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;
    const selected = new Set(this._config.entry_ids);
    return html`
      <div class="form">
        <div class="section">
          <label class="field-label">Adaptive Cover Pro instances</label>
          <div class="hint">
            Pick one or more. Each selected entry adds an overlay to the compass.
          </div>
          ${this._renderEntryPicker(selected)}
        </div>

        <div class="section">
          <label class="field-label">Title (optional)</label>
          <input
            type="text"
            class="text-input"
            .value=${this._config.title ?? ''}
            placeholder="e.g. West-facing windows"
            @change=${this._onTitleChange}
          />
        </div>

        <div class="section">
          <label class="field-label">Display</label>
          ${TOGGLE_ROWS.map(
            (row) => html`
              <label class="toggle-row">
                <input
                  type="checkbox"
                  .checked=${((this._config as Record<string, unknown>)[row.key] as boolean) ??
                  row.defaultOn}
                  @change=${(e: Event) =>
                    this._onToggle(row.key, (e.target as HTMLInputElement).checked)}
                />
                <span class="toggle-text">
                  <span class="toggle-label">${row.label}</span>
                  <span class="toggle-desc">${row.description}</span>
                </span>
              </label>
            `,
          )}
        </div>
      </div>
    `;
  }

  private _renderEntryPicker(selected: Set<string>): TemplateResult {
    if (this._entriesError) {
      return html`<div class="error">Failed to load config entries: ${this._entriesError}</div>`;
    }
    if (!this._entries) {
      return html`<div class="hint">Loading Adaptive Cover Pro config entries…</div>`;
    }
    if (this._entries.length === 0) {
      return html`
        <div class="error">
          No Adaptive Cover Pro config entries found. Add an instance under
          <code>Settings → Devices &amp; Services</code>, then come back.
        </div>
      `;
    }
    return html`
      <div class="entry-list">
        ${this._entries.map(
          (e) => html`
            <label class="toggle-row">
              <input
                type="checkbox"
                .checked=${selected.has(e.entry_id)}
                @change=${(evt: Event) =>
                  this._onEntryToggle(e.entry_id, (evt.target as HTMLInputElement).checked)}
              />
              <span class="toggle-text">
                <span class="toggle-label">${e.title}</span>
                <span class="toggle-desc">${e.entry_id}</span>
              </span>
            </label>
          `,
        )}
      </div>
    `;
  }

  public static styles = css`
    :host {
      display: block;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 8px 0;
    }
    .section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .field-label {
      font-weight: 500;
      font-size: 0.88rem;
      color: var(--primary-text-color);
    }
    .hint {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }
    .error {
      font-size: 0.82rem;
      color: var(--error-color, crimson);
    }
    .text-input {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      font-size: 0.9rem;
      font-family: inherit;
    }
    .text-input:focus {
      outline: none;
      border-color: var(--primary-color);
    }
    .toggle-row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 6px 0;
      cursor: pointer;
    }
    .toggle-row input[type='checkbox'] {
      margin-top: 3px;
      accent-color: var(--primary-color);
      width: 16px;
      height: 16px;
    }
    .toggle-text {
      display: flex;
      flex-direction: column;
    }
    .toggle-label {
      font-size: 0.88rem;
      color: var(--primary-text-color);
    }
    .toggle-desc {
      font-size: 0.74rem;
      color: var(--secondary-text-color);
    }
    .entry-list {
      display: flex;
      flex-direction: column;
    }
    code {
      background: var(--code-editor-background-color, rgba(0, 0, 0, 0.08));
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 0.85em;
    }
  `;
}
