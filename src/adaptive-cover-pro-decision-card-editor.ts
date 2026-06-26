import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';

import { DECISION_CARD_EDITOR_NAME } from './const';
import { fetchAcpConfigEntries, type AcpConfigEntry } from './lib/config-entries';
import { renderEditorFooter } from './lib/editor-footer';
import { t } from './lib/i18n';
import type { AdaptiveCoverProDecisionCardConfig } from './types';

interface ValueChangedEvent extends CustomEvent {
  detail: { value: AdaptiveCoverProDecisionCardConfig };
}

interface HaFormSchemaItem {
  name: string;
  required?: boolean;
  selector?: Record<string, unknown>;
}

// Mirror the runtime defaults applied in adaptive-cover-pro-decision-card.ts so
// the editor toggles reflect actual behavior when a key is omitted from YAML.
const FORM_DEFAULTS = {
  compact: false,
  hide_inactive_handlers: false,
  show_decision_summary: true,
} as const;

const LABEL_KEYS: Record<string, string> = {
  entry_id: 'editor.common.entry_id',
  title: 'editor.decision.title',
  compact: 'editor.decision.compact_label',
  hide_inactive_handlers: 'editor.decision.hide_inactive_handlers_label',
  show_decision_summary: 'editor.decision.show_decision_summary_label',
};

const HELPER_KEYS: Record<string, string> = {
  compact: 'editor.decision.compact_desc',
  hide_inactive_handlers: 'editor.decision.hide_inactive_handlers_desc',
  show_decision_summary: 'editor.decision.show_decision_summary_desc',
};

@customElement(DECISION_CARD_EDITOR_NAME)
export class AdaptiveCoverProDecisionCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config?: AdaptiveCoverProDecisionCardConfig;
  @state() public _entries: AcpConfigEntry[] | null = null;
  @state() private _entriesError: string | null = null;

  private _entriesFetchInFlight = false;

  public setConfig(config: AdaptiveCoverProDecisionCardConfig): void {
    this._config = { ...config };
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has('hass') && this.hass) this._ensureEntries();
  }

  private _ensureEntries(): void {
    if (this._entries || this._entriesFetchInFlight) return;
    this._entriesFetchInFlight = true;
    fetchAcpConfigEntries(this.hass)
      .then((entries) => {
        this._entries = entries;
        this._entriesError = null;
        if (!this._config?.entry_id && entries.length === 1) {
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
        this._entriesFetchInFlight = false;
      });
  }

  private _emit(next: AdaptiveCoverProDecisionCardConfig): void {
    this._config = next;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _computeLabel = (schema: HaFormSchemaItem): string => {
    const key = LABEL_KEYS[schema.name];
    return key ? t(key, this.hass) : schema.name;
  };

  private _computeHelper = (schema: HaFormSchemaItem): string | undefined => {
    const key = HELPER_KEYS[schema.name];
    return key ? t(key, this.hass) : undefined;
  };

  private _valueChanged = (e: ValueChangedEvent): void => {
    e.stopPropagation();
    const value = e.detail.value;
    // ha-form passes back the entire form value (including defaults we pre-fill
    // for display). Drop keys that match the default and weren't already in the
    // user's config, so the YAML stays minimal.
    const cleaned: Record<string, unknown> = { ...value };
    for (const [k, def] of Object.entries(FORM_DEFAULTS)) {
      const wasSet = this._config && Object.prototype.hasOwnProperty.call(this._config, k);
      if (!wasSet && cleaned[k] === def) delete cleaned[k];
    }

    const next: Record<string, unknown> = {
      ...(this._config ?? { type: '', entry_id: '' }),
      ...cleaned,
    };
    this._emit(next as AdaptiveCoverProDecisionCardConfig);
  };

  protected render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;

    if (this._entriesError && !this._entries) {
      // Fall back to a manual entry_id text input.
      return html`
        <div class="form">
          <div class="error">
            ${t('editor.common.load_failed', this.hass, { error: this._entriesError })}
          </div>
          <label class="field-label" for="entry-id-fallback"
            >${t('editor.common.entry_id_fallback_label', this.hass)}</label
          >
          <input
            id="entry-id-fallback"
            type="text"
            class="text-input"
            .value=${this._config.entry_id ?? ''}
            placeholder=${t('editor.common.entry_id_manual_placeholder', this.hass)}
            @change=${(e: Event) =>
              this._emit({
                ...(this._config ?? { type: '', entry_id: '' }),
                entry_id: (e.target as HTMLInputElement).value,
              })}
          />
          ${renderEditorFooter(this.hass)}
        </div>
      `;
    }

    const schema = this._schema();
    const data = { ...FORM_DEFAULTS, ...this._config };

    return html`
      <div class="form">
        <ha-form
          .hass=${this.hass}
          .data=${data}
          .schema=${schema}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._valueChanged}
        ></ha-form>
        ${renderEditorFooter(this.hass)}
      </div>
    `;
  }

  private _schema(): HaFormSchemaItem[] {
    const entryOptions = this._entries?.map((e) => ({ value: e.entry_id, label: e.title })) ?? [];
    return [
      {
        name: 'entry_id',
        required: true,
        selector: { select: { options: entryOptions, mode: 'dropdown' } },
      },
      { name: 'title', selector: { text: {} } },
      { name: 'compact', selector: { boolean: {} } },
      { name: 'hide_inactive_handlers', selector: { boolean: {} } },
      { name: 'show_decision_summary', selector: { boolean: {} } },
    ];
  }

  public static styles = css`
    :host {
      display: block;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px 0;
    }
    .field-label {
      font-weight: 500;
      font-size: 0.88rem;
      color: var(--primary-text-color);
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
    .error {
      font-size: 0.82rem;
      color: var(--error-color, crimson);
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
