import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';

import { CARD_EDITOR_NAME } from './const';
import type { ControlFlags } from './const';
import { fetchAcpConfigEntries, type AcpConfigEntry } from './lib/config-entries';
import type { AdaptiveCoverProCardConfig, CardSection } from './types';

interface SectionRow {
  key: CardSection;
  label: string;
  description: string;
}

const SECTION_ROWS: SectionRow[] = [
  { key: 'sky', label: 'Sky compass', description: 'Sun vs. window FOV, polar plot' },
  {
    key: 'elevation',
    label: 'Sun today',
    description: 'Elevation-vs-time chart with FOV band and current-time cursor',
  },
  {
    key: 'decision',
    label: 'Decision strip',
    description: 'All 10 pipeline handlers with the winning row highlighted',
  },
  {
    key: 'covers',
    label: 'Cover positions',
    description: 'Per-cover live vs. target bars; click to set position',
  },
  {
    key: 'overrides',
    label: 'Overrides panel',
    description: 'Manual, force, motion tiles + reset button',
  },
  {
    key: 'climate',
    label: 'Climate panel',
    description: 'Summer/winter/intermediate strategy (auto-hidden if climate mode is off)',
  },
];

const DEFAULT_SECTIONS: CardSection[] = SECTION_ROWS.map((r) => r.key);

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

  private _onVersionToggle(enabled: boolean): void {
    this._emit({ ...(this._config ?? { type: '', entry_id: '' }), show_version: enabled });
  }

  private _onHideInactiveToggle(enabled: boolean): void {
    this._emit({
      ...(this._config ?? { type: '', entry_id: '' }),
      hide_inactive_handlers: enabled,
    });
  }

  private _onControlToggle(key: keyof ControlFlags, enabled: boolean): void {
    const cfg = this._config ?? { type: '', entry_id: '' };
    this._emit({ ...cfg, controls: { ...cfg.controls, [key]: enabled } });
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;
    const activeSections = new Set(this._currentSections);

    return html`
      <div class="form">
        <div class="section">
          <label class="field-label">Adaptive Cover Pro instance</label>
          ${this._renderEntryPicker()}
        </div>

        <div class="section">
          <label class="field-label">Sections</label>
          <div class="hint">Toggle which parts of the card are shown.</div>
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
                  <span class="toggle-label">${row.label}</span>
                  <span class="toggle-desc">${row.description}</span>
                </span>
              </label>
            `,
          )}
        </div>

        <div class="section">
          <label class="field-label">Controls</label>
          <div class="hint">Render as read-only (visible but not clickable).</div>
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
              <span class="toggle-label">Integration ON/OFF pill</span>
              <span class="toggle-desc">Allow toggling the integration from the card header.</span>
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
              <span class="toggle-label">Automatic Control pill</span>
              <span class="toggle-desc"
                >Allow toggling automatic control from the card header.</span
              >
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
              <span class="toggle-label">Reset Manual Override button</span>
              <span class="toggle-desc">Allow pressing the reset tile in the overrides panel.</span>
            </span>
          </label>
        </div>

        <div class="section">
          <label class="field-label">Display</label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.compact ?? false}
              @change=${(e: Event) => this._onCompactToggle((e.target as HTMLInputElement).checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">Compact mode</span>
              <span class="toggle-desc">Tighter spacing between sections.</span>
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
              <span class="toggle-label">Hide inactive handlers</span>
              <span class="toggle-desc"
                >Show only the winner and actively matched pipeline handlers.</span
              >
            </span>
          </label>
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._config.show_version ?? false}
              @change=${(e: Event) => this._onVersionToggle((e.target as HTMLInputElement).checked)}
            />
            <span class="toggle-text">
              <span class="toggle-label">Show version tag</span>
              <span class="toggle-desc">Display card version at the bottom.</span>
            </span>
          </label>
        </div>
      </div>
    `;
  }

  private _renderEntryPicker(): TemplateResult {
    if (this._entriesError) {
      return html`
        <div class="error">Failed to load config entries: ${this._entriesError}</div>
        <input
          type="text"
          .value=${this._config?.entry_id ?? ''}
          placeholder="Enter config entry ID manually"
          @change=${this._onEntryChange}
          class="text-input"
        />
      `;
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
      <select class="select" .value=${this._config?.entry_id ?? ''} @change=${this._onEntryChange}>
        ${this._config?.entry_id &&
        !this._entries.some((e) => e.entry_id === this._config!.entry_id)
          ? html`<option value=${this._config.entry_id}>
              (unknown: ${this._config.entry_id})
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
    code {
      background: var(--code-editor-background-color, rgba(0, 0, 0, 0.08));
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 0.85em;
    }
  `;
}
