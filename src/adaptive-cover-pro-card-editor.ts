import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';

import { CARD_EDITOR_NAME } from './const';
import type { ControlFlags } from './const';
import { fetchAcpConfigEntries, type AcpConfigEntry } from './lib/config-entries';
import { renderEditorFooter } from './lib/editor-footer';
import { colorForIndex } from './lib/palette';
import { t } from './lib/i18n';
import type { AdaptiveCoverProCardConfig, CardSection } from './types';

interface SectionRow {
  key: CardSection;
  labelKey: string;
  descKey: string;
  /** Whether the section is on when `show_sections` is unset. Defaults to true;
   *  set false for opt-in diagnostic sections so the toggle still lists but
   *  starts unchecked. Must mirror the card's own `DEFAULT_SECTIONS`. */
  enabledByDefault?: boolean;
}

const SECTION_ROWS: SectionRow[] = [
  {
    key: 'sky',
    labelKey: 'editor.main.section_sky_label',
    descKey: 'editor.main.section_sky_desc',
  },
  {
    key: 'elevation',
    labelKey: 'editor.main.section_elevation_label',
    descKey: 'editor.main.section_elevation_desc',
  },
  {
    key: 'decision',
    labelKey: 'editor.main.section_decision_label',
    descKey: 'editor.main.section_decision_desc',
  },
  {
    key: 'covers',
    labelKey: 'editor.main.section_covers_label',
    descKey: 'editor.main.section_covers_desc',
  },
  {
    key: 'overrides',
    labelKey: 'editor.main.section_overrides_label',
    descKey: 'editor.main.section_overrides_desc',
  },
  {
    key: 'climate',
    labelKey: 'editor.main.section_climate_label',
    descKey: 'editor.main.section_climate_desc',
  },
  {
    key: 'solar',
    labelKey: 'editor.main.section_solar_label',
    descKey: 'editor.main.section_solar_desc',
    enabledByDefault: false,
  },
];

// Mirrors the card's own DEFAULT_SECTIONS: opt-in rows (enabledByDefault: false)
// are excluded so an unset `show_sections` omits them.
const DEFAULT_SECTIONS: CardSection[] = SECTION_ROWS.filter(
  (r) => r.enabledByDefault !== false,
).map((r) => r.key);

@customElement(CARD_EDITOR_NAME)
export class AdaptiveCoverProCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: AdaptiveCoverProCardConfig;
  @state() private _entries: AcpConfigEntry[] | null = null;
  @state() private _entriesError: string | null = null;
  private _fetchInFlight = false;

  public setConfig(config: AdaptiveCoverProCardConfig): void {
    this._config = config;
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has('hass') && this.hass && !this._entries && !this._fetchInFlight) {
      this._fetchInFlight = true;
      fetchAcpConfigEntries(this.hass)
        .then((entries) => {
          this._entries = entries;
          this._entriesError = null;
          if (!this._config?.entry_id && entries.length === 1) {
            // Single instance → auto-select.
            this._emit({
              ...(this._config ?? { type: '', entry_id: '' }),
              entry_id: entries[0].entry_id,
            });
          }
        })
        .catch((err: Error) => {
          this._entriesError = err?.message ?? 'failed to load config entries';
        })
        .finally(() => {
          this._fetchInFlight = false;
        });
    }
  }

  private get _currentSections(): CardSection[] {
    return this._config?.show_sections ?? DEFAULT_SECTIONS;
  }

  private _emit(next: AdaptiveCoverProCardConfig): void {
    this._config = next;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onEntryChange(e: Event): void {
    const value = (e.target as HTMLSelectElement).value;
    this._emit({ ...(this._config ?? { type: '', entry_id: '' }), entry_id: value });
  }

  private _onSectionToggle(key: CardSection, enabled: boolean): void {
    const current = new Set(this._currentSections);
    if (enabled) current.add(key);
    else current.delete(key);
    // Preserve SECTION_ROWS ordering for consistency
    const ordered = SECTION_ROWS.map((r) => r.key).filter((k) => current.has(k));
    this._emit({ ...(this._config ?? { type: '', entry_id: '' }), show_sections: ordered });
  }

  private _onCompactToggle(enabled: boolean): void {
    this._emit({ ...(this._config ?? { type: '', entry_id: '' }), compact: enabled });
  }

  private _onCompassStatsToggle(enabled: boolean): void {
    this._emit({ ...(this._config ?? { type: '', entry_id: '' }), show_compass_stats: enabled });
  }

  private _onCompassLegendToggle(enabled: boolean): void {
    this._emit({ ...(this._config ?? { type: '', entry_id: '' }), show_compass_legend: enabled });
  }

  private _onMoonToggle(enabled: boolean): void {
    this._emit({ ...(this._config ?? { type: '', entry_id: '' }), show_moon: enabled });
  }

  /** Cover Group entries only. Shown unconditionally: this editor resolves no
   *  entity registry, so it cannot tell a group entry from a cover one — the
   *  same reason the compass and handler options above stay visible for a group,
   *  which renders neither. */
  private _onClimateToggle(enabled: boolean): void {
    this._emit({ ...(this._config ?? { type: '', entry_id: '' }), show_climate: enabled });
  }

  private _onHideInactiveToggle(enabled: boolean): void {
    this._emit({
      ...(this._config ?? { type: '', entry_id: '' }),
      hide_inactive_handlers: enabled,
    });
  }

  private _onStateColorToggle(enabled: boolean): void {
    this._emit({ ...(this._config ?? { type: '', entry_id: '' }), state_color: enabled });
  }

  _onNorthOffsetChange(e: Event): void {
    const raw = parseFloat((e.target as HTMLInputElement).value);
    const value = Number.isFinite(raw) ? raw : 0;
    this._emit({ ...(this._config ?? { type: '', entry_id: '' }), north_offset: value });
  }

  private _onControlToggle(key: keyof ControlFlags, enabled: boolean): void {
    const cfg = this._config ?? { type: '', entry_id: '' };
    this._emit({ ...cfg, controls: { ...cfg.controls, [key]: enabled } });
  }

  // The main card embeds a single sky-compass overlay, so cover colors are a
  // single slot bound to index 0 of the cover_colors array.
  private _onCoverColorChange(value: string): void {
    const cfg = this._config ?? { type: '', entry_id: '' };
    this._emit({ ...cfg, cover_colors: [value] });
  }

  private _onCoverColorReset(): void {
    const cfg = { ...(this._config ?? { type: '', entry_id: '' }) };
    delete (cfg as { cover_colors?: unknown }).cover_colors;
    this._emit(cfg);
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;
    const activeSections = new Set(this._currentSections);

    return html`
      <div class="form">
        <div class="section">
          <label class="field-label">${t('editor.common.entry_id', this.hass)}</label>
          ${this._renderEntryPicker()}
        </div>

        <div class="section">
          <label class="field-label">${t('editor.main.sections', this.hass)}</label>
          <div class="hint">${t('editor.main.sections_hint', this.hass)}</div>
          ${SECTION_ROWS.map(
            (row) => html`
              <label class="toggle-row">
                <input
                  type="checkbox"
                  .checked=${activeSections.has(row.key)}
                  @change=${(e: Event) =>
                    this._onSectionToggle(row.key, (e.target as HTMLInputElement).checked)}
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
          <label class="field-label">${t('editor.main.controls', this.hass)}</label>
          <div class="hint">${t('editor.main.controls_hint', this.hass)}</div>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.integration_enabled ?? true}
              @change=${(e: Event) =>
                this._onControlToggle(
                  'integration_enabled',
                  (e.target as HTMLInputElement).checked,
                )}
            />
            <span class="toggle-text">
              <span class="toggle-label"
                >${t('editor.main.integration_pill_label', this.hass)}</span
              >
              <span class="toggle-desc">${t('editor.main.integration_pill_desc', this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.automatic_control ?? true}
              @change=${(e: Event) =>
                this._onControlToggle('automatic_control', (e.target as HTMLInputElement).checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${t('editor.main.automatic_pill_label', this.hass)}</span>
              <span class="toggle-desc">${t('editor.main.automatic_pill_desc', this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.controls?.reset_manual_override ?? true}
              @change=${(e: Event) =>
                this._onControlToggle(
                  'reset_manual_override',
                  (e.target as HTMLInputElement).checked,
                )}
            />
            <span class="toggle-text">
              <span class="toggle-label">${t('editor.main.reset_button_label', this.hass)}</span>
              <span class="toggle-desc">${t('editor.main.reset_button_desc', this.hass)}</span>
            </span>
          </label>
        </div>

        ${this._config.entry_id
          ? html`
              <div class="section">
                <label class="field-label">${t('editor.compass.cover_colors', this.hass)}</label>
                <div class="hint">${t('editor.compass.cover_colors_hint', this.hass)}</div>
                ${(() => {
                  const override = this._config!.cover_colors?.[0] ?? null;
                  const resolved = override ?? colorForIndex(0);
                  return html`
                    <div class="color-row">
                      <input
                        type="color"
                        .value=${resolved}
                        @change=${(e: Event) =>
                          this._onCoverColorChange((e.target as HTMLInputElement).value)}
                      />
                      <span class="toggle-text">
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
                        @click=${() => this._onCoverColorReset()}
                      >
                        ${t('editor.common.reset', this.hass)}
                      </button>
                    </div>
                  `;
                })()}
              </div>
            `
          : nothing}

        <div class="section">
          <label class="field-label">${t('editor.main.display', this.hass)}</label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.compact ?? false}
              @change=${(e: Event) => this._onCompactToggle((e.target as HTMLInputElement).checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${t('editor.main.compact_label', this.hass)}</span>
              <span class="toggle-desc">${t('editor.main.compact_desc', this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.show_compass_stats ?? true}
              @change=${(e: Event) =>
                this._onCompassStatsToggle((e.target as HTMLInputElement).checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label"
                >${t('editor.main.show_compass_stats_label', this.hass)}</span
              >
              <span class="toggle-desc"
                >${t('editor.main.show_compass_stats_desc', this.hass)}</span
              >
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.show_compass_legend ?? true}
              @change=${(e: Event) =>
                this._onCompassLegendToggle((e.target as HTMLInputElement).checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label"
                >${t('editor.main.show_compass_legend_label', this.hass)}</span
              >
              <span class="toggle-desc"
                >${t('editor.main.show_compass_legend_desc', this.hass)}</span
              >
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.show_moon ?? false}
              @change=${(e: Event) => this._onMoonToggle((e.target as HTMLInputElement).checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${t('editor.main.show_moon_label', this.hass)}</span>
              <span class="toggle-desc">${t('editor.main.show_moon_desc', this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.show_climate ?? false}
              @change=${(e: Event) => this._onClimateToggle((e.target as HTMLInputElement).checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${t('editor.main.show_climate_label', this.hass)}</span>
              <span class="toggle-desc">${t('editor.main.show_climate_desc', this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.hide_inactive_handlers ?? false}
              @change=${(e: Event) =>
                this._onHideInactiveToggle((e.target as HTMLInputElement).checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${t('editor.main.hide_inactive_label', this.hass)}</span>
              <span class="toggle-desc">${t('editor.main.hide_inactive_desc', this.hass)}</span>
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.state_color !== false}
              @change=${(e: Event) =>
                this._onStateColorToggle((e.target as HTMLInputElement).checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">${t('editor.main.state_color_label', this.hass)}</span>
              <span class="toggle-desc">${t('editor.main.state_color_desc', this.hass)}</span>
            </span>
          </label>
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

  private _renderEntryPicker(): TemplateResult {
    if (this._entriesError) {
      return html`
        <div class="error">
          ${t('editor.common.load_failed', this.hass, { error: this._entriesError })}
        </div>
        <input
          type="text"
          .value=${this._config?.entry_id ?? ''}
          placeholder=${t('editor.common.entry_id_manual_placeholder', this.hass)}
          @change=${this._onEntryChange}
          class="text-input"
        />
      `;
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
      <select class="select" .value=${this._config?.entry_id ?? ''} @change=${this._onEntryChange}>
        ${this._config?.entry_id &&
        !this._entries.some((e) => e.entry_id === this._config!.entry_id)
          ? html`<option value=${this._config.entry_id}>
              ${t('editor.common.unknown_entry', this.hass, { entry: this._config.entry_id })}
            </option>`
          : nothing}
        ${this._entries.map(
          (e) => html`
            <option value=${e.entry_id} ?selected=${e.entry_id === this._config?.entry_id}>
              ${e.title}
            </option>
          `,
        )}
      </select>
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
    .select,
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
    .select:focus,
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
