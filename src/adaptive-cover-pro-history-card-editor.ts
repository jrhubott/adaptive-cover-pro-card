import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';

import { HISTORY_CARD_EDITOR_NAME, HISTORY_DEFAULT_HOURS, HISTORY_HOUR_CHOICES } from './const';
import { fetchAcpConfigEntries, type AcpConfigEntry } from './lib/config-entries';
import { renderEditorFooter } from './lib/editor-footer';
import { t } from './lib/i18n';
import type { AdaptiveCoverProHistoryCardConfig } from './types';

interface ValueChangedEvent extends CustomEvent {
  detail: { value: Record<string, unknown> };
}

interface HaFormSchemaItem {
  name: string;
  required?: boolean;
  selector?: Record<string, unknown>;
}

// Mirror the runtime defaults applied in adaptive-cover-pro-history-card.ts /
// history-view.ts so the editor toggles reflect actual behavior when a key is
// omitted from YAML.
const FORM_DEFAULTS = {
  hours: HISTORY_DEFAULT_HOURS,
  advanced_open: false,
  hide_advanced: false,
  track_position: true,
  track_who_won: true,
  track_context: true,
  track_actions: true,
} as const;

/** Flat form key → `tracks` sub-key. `tracks` is a nested object in the card
 *  config, but `ha-form` has no grouped-boolean selector, so the editor
 *  flattens it for display and re-nests on emit. */
const TRACK_KEYS: Record<string, keyof NonNullable<AdaptiveCoverProHistoryCardConfig['tracks']>> = {
  track_position: 'position',
  track_who_won: 'who_won',
  track_context: 'context',
  track_actions: 'actions',
};

const LABEL_KEYS: Record<string, string> = {
  entry_id: 'editor.common.entry_id',
  title: 'editor.history.title',
  hours: 'editor.history.hours_label',
  advanced_open: 'editor.history.advanced_open_label',
  hide_advanced: 'editor.history.hide_advanced_label',
  track_position: 'editor.history.track_position_label',
  track_who_won: 'editor.history.track_who_won_label',
  track_context: 'editor.history.track_context_label',
  track_actions: 'editor.history.track_actions_label',
};

const HELPER_KEYS: Record<string, string> = {
  hours: 'editor.history.hours_desc',
  advanced_open: 'editor.history.advanced_open_desc',
  hide_advanced: 'editor.history.hide_advanced_desc',
  track_position: 'editor.history.track_position_desc',
  track_who_won: 'editor.history.track_who_won_desc',
  track_context: 'editor.history.track_context_desc',
  track_actions: 'editor.history.track_actions_desc',
};

@customElement(HISTORY_CARD_EDITOR_NAME)
export class AdaptiveCoverProHistoryCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config?: AdaptiveCoverProHistoryCardConfig;
  @state() public _entries: AcpConfigEntry[] | null = null;
  @state() private _entriesError: string | null = null;

  private _entriesFetchInFlight = false;

  public setConfig(config: AdaptiveCoverProHistoryCardConfig): void {
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

  private _emit(next: AdaptiveCoverProHistoryCardConfig): void {
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
    const value = { ...e.detail.value };

    // Re-nest the flattened track booleans. Only an explicit `false` is written
    // — every track defaults on, so an "on" toggle stays out of the YAML.
    const tracks: Record<string, boolean> = {};
    for (const [formKey, trackKey] of Object.entries(TRACK_KEYS)) {
      if (value[formKey] === false) tracks[trackKey] = false;
      delete value[formKey];
    }

    // Drop scalar keys that match the default and weren't already in the user's
    // config, so the YAML stays minimal (mirrors the decision-card editor).
    for (const [k, def] of Object.entries(FORM_DEFAULTS)) {
      if (k in TRACK_KEYS) continue;
      const wasSet = this._config && Object.prototype.hasOwnProperty.call(this._config, k);
      if (!wasSet && value[k] === def) delete value[k];
    }

    const next: Record<string, unknown> = {
      ...(this._config ?? { type: '', entry_id: '' }),
      ...value,
    };
    if (Object.keys(tracks).length > 0) next.tracks = tracks;
    else delete next.tracks;

    this._emit(next as AdaptiveCoverProHistoryCardConfig);
  };

  protected render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;

    if (this._entriesError && !this._entries) {
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

    const cfg = this._config;
    const data = {
      ...FORM_DEFAULTS,
      ...cfg,
      track_position: cfg.tracks?.position !== false,
      track_who_won: cfg.tracks?.who_won !== false,
      track_context: cfg.tracks?.context !== false,
      track_actions: cfg.tracks?.actions !== false,
    };

    return html`
      <div class="form">
        <ha-form
          .hass=${this.hass}
          .data=${data}
          .schema=${this._schema()}
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
    const hourOptions = HISTORY_HOUR_CHOICES.map((h) => ({
      value: h,
      label: t('history.window_hours', this.hass, { hours: h }),
    }));
    return [
      {
        name: 'entry_id',
        required: true,
        selector: { select: { options: entryOptions, mode: 'dropdown' } },
      },
      { name: 'title', selector: { text: {} } },
      { name: 'hours', selector: { select: { options: hourOptions, mode: 'dropdown' } } },
      { name: 'track_position', selector: { boolean: {} } },
      { name: 'track_who_won', selector: { boolean: {} } },
      { name: 'track_context', selector: { boolean: {} } },
      { name: 'track_actions', selector: { boolean: {} } },
      { name: 'advanced_open', selector: { boolean: {} } },
      { name: 'hide_advanced', selector: { boolean: {} } },
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
