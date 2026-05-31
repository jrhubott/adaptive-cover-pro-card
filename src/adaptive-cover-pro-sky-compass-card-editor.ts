import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';

import { SKY_COMPASS_CARD_EDITOR_NAME, SKY_COMPASS_CARD_NAME } from './const';
import { fetchAcpConfigEntries, type AcpConfigEntry } from './lib/config-entries';
import { renderEditorFooter } from './lib/editor-footer';
import { colorForIndex } from './lib/palette';
import { t } from './lib/i18n';
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
  | 'show_window_arrow'
  | 'show_elevation_chart';

interface ToggleRow {
  key: ToggleKey;
  labelKey: string;
  descKey: string;
  defaultOn: boolean;
}

const TOGGLE_ROWS: ToggleRow[] = [
  {
    key: 'compact',
    labelKey: 'editor.compass.toggle_compact_label',
    descKey: 'editor.compass.toggle_compact_desc',
    defaultOn: false,
  },
  {
    key: 'show_legend',
    labelKey: 'editor.compass.toggle_legend_label',
    descKey: 'editor.compass.toggle_legend_desc',
    defaultOn: true,
  },
  {
    key: 'show_stats',
    labelKey: 'editor.compass.toggle_stats_label',
    descKey: 'editor.compass.toggle_stats_desc',
    defaultOn: true,
  },
  {
    key: 'show_moon',
    labelKey: 'editor.compass.toggle_moon_label',
    descKey: 'editor.compass.toggle_moon_desc',
    defaultOn: false,
  },
  {
    key: 'show_cardinals',
    labelKey: 'editor.compass.toggle_cardinals_label',
    descKey: 'editor.compass.toggle_cardinals_desc',
    defaultOn: true,
  },
  {
    key: 'show_blind_spot',
    labelKey: 'editor.compass.toggle_blind_spot_label',
    descKey: 'editor.compass.toggle_blind_spot_desc',
    defaultOn: true,
  },
  {
    key: 'show_sun_path',
    labelKey: 'editor.compass.toggle_sun_path_label',
    descKey: 'editor.compass.toggle_sun_path_desc',
    defaultOn: true,
  },
  {
    key: 'show_sunrise_sunset',
    labelKey: 'editor.compass.toggle_sunrise_sunset_label',
    descKey: 'editor.compass.toggle_sunrise_sunset_desc',
    defaultOn: true,
  },
  {
    key: 'show_cover_fill',
    labelKey: 'editor.compass.toggle_cover_fill_label',
    descKey: 'editor.compass.toggle_cover_fill_desc',
    defaultOn: true,
  },
  {
    key: 'show_window_arrow',
    labelKey: 'editor.compass.toggle_window_arrow_label',
    descKey: 'editor.compass.toggle_window_arrow_desc',
    defaultOn: true,
  },
  {
    key: 'show_elevation_chart',
    labelKey: 'editor.compass.toggle_elevation_chart_label',
    descKey: 'editor.compass.toggle_elevation_chart_desc',
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

  private _trimColors(arr: (string | null)[]): (string | null)[] | undefined {
    let last = -1;
    for (let i = 0; i < arr.length; i++) if (arr[i]) last = i;
    if (last < 0) return undefined;
    return arr.slice(0, last + 1);
  }

  private _emitWithColors(
    base: SkyCompassCardConfig,
    colors: (string | null)[],
    overrides?: Partial<SkyCompassCardConfig>,
  ): void {
    const trimmed = this._trimColors(colors);
    const { cover_colors: _cc, ...rest } = base;
    void _cc;
    const next: SkyCompassCardConfig = trimmed
      ? { ...(rest as SkyCompassCardConfig), ...overrides, cover_colors: trimmed }
      : { ...(rest as SkyCompassCardConfig), ...overrides };
    this._emit(next);
  }

  private _onCoverColorChange(index: number, value: string): void {
    const base = this._baseConfig();
    const colors: (string | null)[] = [...(base.cover_colors ?? [])];
    while (colors.length <= index) colors.push(null);
    colors[index] = value;
    this._emitWithColors(base, colors);
  }

  private _onCoverColorReset(index: number): void {
    const base = this._baseConfig();
    const colors: (string | null)[] = [...(base.cover_colors ?? [])];
    if (index < colors.length) colors[index] = null;
    this._emitWithColors(base, colors);
  }

  private _onEntryToggle(entryId: string, enabled: boolean): void {
    const base = this._baseConfig();
    const current = new Set(base.entry_ids);
    if (enabled) current.add(entryId);
    else current.delete(entryId);
    // Preserve discovery order for consistency.
    const ordered = (this._entries ?? []).map((e) => e.entry_id).filter((id) => current.has(id));
    // Re-align cover_colors to new entry_ids order.
    const oldColors = base.cover_colors ?? [];
    const newColors: (string | null)[] = ordered.map((id) => {
      const oldIdx = base.entry_ids.indexOf(id);
      return oldIdx >= 0 ? (oldColors[oldIdx] ?? null) : null;
    });
    this._emitWithColors(base, newColors, { entry_ids: ordered });
  }

  private _onToggle(key: ToggleKey, enabled: boolean): void {
    this._emit({ ...this._baseConfig(), [key]: enabled });
  }

  _onNorthOffsetChange(e: Event): void {
    const raw = parseFloat((e.target as HTMLInputElement).value);
    const value = Number.isFinite(raw) ? raw : 0;
    this._emit({ ...this._baseConfig(), north_offset: value });
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
          <label class="field-label">${t('editor.compass.instances', this.hass)}</label>
          <div class="hint">${t('editor.compass.instances_hint', this.hass)}</div>
          ${this._renderEntryPicker(selected)}
        </div>

        <div class="section">
          <label class="field-label">${t('editor.common.title_optional', this.hass)}</label>
          <input
            type="text"
            class="text-input"
            .value=${this._config.title ?? ''}
            placeholder=${t('editor.common.title_placeholder', this.hass)}
            @change=${this._onTitleChange}
          />
        </div>

        ${this._config.entry_ids.length > 0
          ? html`
              <div class="section">
                <label class="field-label">${t('editor.compass.cover_colors', this.hass)}</label>
                <div class="hint">${t('editor.compass.cover_colors_hint', this.hass)}</div>
                ${this._config.entry_ids.map((id, i) => {
                  const override = this._config!.cover_colors?.[i] ?? null;
                  const resolved = override ?? colorForIndex(i);
                  const entry = this._entries?.find((e) => e.entry_id === id);
                  return html`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${resolved}
                        @change=${(e: Event) =>
                          this._onCoverColorChange(i, (e.target as HTMLInputElement).value)}
                      />
                      <span class="toggle-text">
                        <span class="toggle-label">${entry?.title ?? id}</span>
                        <span class="toggle-desc"
                          >${override
                            ? override
                            : t('editor.compass.default_color', this.hass)}</span
                        >
                      </span>
                      <button
                        type="button"
                        class="reset-btn"
                        ?disabled=${!override}
                        @click=${() => this._onCoverColorReset(i)}
                      >
                        ${t('editor.common.reset', this.hass)}
                      </button>
                    </div>
                  `;
                })}
              </div>
            `
          : nothing}

        <div class="section">
          <label class="field-label">${t('editor.compass.display', this.hass)}</label>
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
                  <span class="toggle-label">${t(row.labelKey, this.hass)}</span>
                  <span class="toggle-desc">${t(row.descKey, this.hass)}</span>
                </span>
              </label>
            `,
          )}
        </div>

        <div class="section">
          <label class="field-label">${t('editor.common.north_offset', this.hass)}</label>
          <div class="hint">${t('editor.common.north_offset_hint', this.hass)}</div>
          <input
            type="number"
            class="text-input"
            .value=${String(this._config.north_offset ?? 0)}
            step="1"
            inputmode="numeric"
            @change=${this._onNorthOffsetChange}
          />
        </div>
        ${renderEditorFooter(this.hass)}
      </div>
    `;
  }

  private _renderEntryPicker(selected: Set<string>): TemplateResult {
    if (this._entriesError) {
      return html`<div class="error">
        ${t('editor.common.load_failed', this.hass, { error: this._entriesError })}
      </div>`;
    }
    if (!this._entries) {
      return html`<div class="hint">${t('editor.common.loading_entries', this.hass)}</div>`;
    }
    if (this._entries.length === 0) {
      return html`
        <div class="error">
          ${t('editor.common.no_entries', this.hass)}
          <code>${t('editor.common.no_entries_path', this.hass)}</code>${t(
            'editor.common.no_entries_then',
            this.hass,
          )}
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
    .color-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 4px 0;
    }
    .color-row input[type='color'] {
      width: 32px;
      height: 32px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      padding: 2px;
      background: none;
      cursor: pointer;
      flex-shrink: 0;
    }
    .color-row .toggle-text {
      flex: 1;
    }
    .reset-btn {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      padding: 3px 8px;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      cursor: pointer;
      flex-shrink: 0;
    }
    .reset-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }
    code {
      background: var(--code-editor-background-color, rgba(0, 0, 0, 0.08));
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 0.85em;
    }
    .version-footer {
      font-size: 0.7rem;
      text-align: right;
    }
    .dim {
      color: var(--secondary-text-color);
    }
  `;
}
