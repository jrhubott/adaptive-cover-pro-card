import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';

import { TILE_CARD_EDITOR_NAME } from './const';
import { fetchAcpConfigEntries, type AcpConfigEntry } from './lib/config-entries';
import {
  fetchEntityRegistry,
  subscribeEntityRegistry,
  type EntityRegistryEntry,
} from './lib/entity-registry';
import { discoverEntities } from './lib/entity-discovery';
import type { AdaptiveCoverProTileCardConfig } from './types';

interface ValueChangedEvent extends CustomEvent {
  detail: { value: AdaptiveCoverProTileCardConfig };
}

interface HaFormSchemaItem {
  name: string;
  required?: boolean;
  selector: Record<string, unknown>;
}

const RESUME_OPTIONS = [
  { value: 'auto', label: 'Auto (manual override or custom position)' },
  { value: 'always', label: 'Always (when reset button is available)' },
  { value: 'never', label: 'Never' },
];

const LAYOUT_OPTIONS = [
  { value: 'one-line', label: 'One line (compact)' },
  { value: 'two-line', label: 'Two lines (title on top)' },
];

// Mirror the runtime defaults applied in adaptive-cover-pro-tile-card.ts so the
// editor toggles reflect actual behavior when a key is omitted from YAML.
const FORM_DEFAULTS = {
  show_position: true,
  show_state: true,
  show_decision_summary: false,
  show_controls: true,
  show_badge: true,
  show_compass: true,
  show_motion_icon: true,
  show_resume: 'auto',
  layout: 'one-line',
} as const;

const LABELS: Record<string, string> = {
  entry_id: 'Adaptive Cover Pro instance',
  name: 'Title override',
  icon: 'Icon override',
  cover: 'Cover entity',
  layout: 'Layout',
  show_position: 'Show position %',
  show_state: 'Show state (Open/Closed)',
  show_decision_summary: 'Show decision summary',
  show_controls: 'Show ↑■▼ controls',
  show_badge: 'Show contextual badge',
  show_compass: 'Show sun compass in dialog',
  show_motion_icon: 'Show motion indicator',
  show_resume: 'Resume button',
  tap_action: 'Tap action',
  hold_action: 'Hold action',
  double_tap_action: 'Double-tap action',
};

@customElement(TILE_CARD_EDITOR_NAME)
export class AdaptiveCoverProTileCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config?: AdaptiveCoverProTileCardConfig;
  @state() private _entries: AcpConfigEntry[] | null = null;
  @state() private _entriesError: string | null = null;
  @state() public _registry: EntityRegistryEntry[] | null = null;

  private _entriesFetchInFlight = false;
  private _registryFetchInFlight = false;
  private _unsubRegistry: (() => void) | null = null;

  public setConfig(config: AdaptiveCoverProTileCardConfig): void {
    this._config = { ...config };
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._unsubRegistry) {
      this._unsubRegistry();
      this._unsubRegistry = null;
    }
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has('hass') && this.hass) {
      this._ensureEntries();
      this._ensureRegistry();
    }
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

  private _ensureRegistry(): void {
    if (this._registry === null && !this._registryFetchInFlight) {
      this._registryFetchInFlight = true;
      fetchEntityRegistry(this.hass)
        .then((entries) => {
          this._registry = entries;
        })
        .catch(() => {
          // Cover picker just falls back to the unfiltered cover domain.
          this._registry = [];
        })
        .finally(() => {
          this._registryFetchInFlight = false;
        });
    }
    if (!this._unsubRegistry) {
      this._unsubRegistry = subscribeEntityRegistry(this.hass, () => {
        this._registryFetchInFlight = true;
        fetchEntityRegistry(this.hass)
          .then((entries) => {
            this._registry = entries;
          })
          .catch(() => {
            // ignore — keep last good value
          })
          .finally(() => {
            this._registryFetchInFlight = false;
          });
      });
    }
  }

  private _emit(next: AdaptiveCoverProTileCardConfig): void {
    this._config = next;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _computeLabel = (schema: HaFormSchemaItem): string => LABELS[schema.name] ?? schema.name;

  private _valueChanged = (e: ValueChangedEvent): void => {
    e.stopPropagation();
    const value = e.detail.value;
    // ha-form passes back the entire form value (including defaults we pre-fill
    // for display). Drop keys that match the default and weren't already in
    // the user's config, so the YAML stays minimal.
    const cleaned: Record<string, unknown> = { ...value };
    for (const [k, def] of Object.entries(FORM_DEFAULTS)) {
      const wasSet = this._config && Object.prototype.hasOwnProperty.call(this._config, k);
      if (!wasSet && cleaned[k] === def) delete cleaned[k];
    }
    this._emit({
      ...(this._config ?? { type: '', entry_id: '' }),
      ...(cleaned as Partial<AdaptiveCoverProTileCardConfig>),
    });
  };

  protected render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;

    if (this._entriesError && !this._entries) {
      // Fall back to the same manual-entry input the main editor uses.
      return html`
        <div class="form">
          <div class="error">Failed to load config entries: ${this._entriesError}</div>
          <label class="field-label" for="entry-id-fallback">Entry ID</label>
          <input
            id="entry-id-fallback"
            type="text"
            class="text-input"
            .value=${this._config.entry_id ?? ''}
            placeholder="Enter config entry ID manually"
            @change=${(e: Event) =>
              this._emit({
                ...(this._config ?? { type: '', entry_id: '' }),
                entry_id: (e.target as HTMLInputElement).value,
              })}
          />
        </div>
      `;
    }

    const schema = this._schema();
    const data = { ...FORM_DEFAULTS, ...this._config };

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _schema(): HaFormSchemaItem[] {
    const entryOptions = this._entries?.map((e) => ({ value: e.entry_id, label: e.title })) ?? [];

    // Filter the cover picker to the entry's managed covers once we have
    // registry + entry_id. Without those, fall back to any cover.* so the
    // field is still usable.
    let coverSelector: Record<string, unknown> = { entity: { domain: 'cover' } };
    if (this._registry && this._config?.entry_id) {
      const discovered = discoverEntities(
        this.hass,
        { type: this._config.type, entry_id: this._config.entry_id },
        this._registry,
      );
      if (discovered && discovered.managed_covers.length > 0) {
        coverSelector = {
          entity: { domain: 'cover', include_entities: discovered.managed_covers },
        };
      }
    }

    return [
      {
        name: 'entry_id',
        required: true,
        selector: { select: { options: entryOptions, mode: 'dropdown' } },
      },
      { name: 'name', selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
      { name: 'cover', selector: coverSelector },
      {
        name: 'layout',
        selector: { select: { mode: 'list', options: LAYOUT_OPTIONS } },
      },
      { name: 'show_position', selector: { boolean: {} } },
      { name: 'show_state', selector: { boolean: {} } },
      { name: 'show_decision_summary', selector: { boolean: {} } },
      { name: 'show_controls', selector: { boolean: {} } },
      { name: 'show_badge', selector: { boolean: {} } },
      { name: 'show_motion_icon', selector: { boolean: {} } },
      { name: 'show_compass', selector: { boolean: {} } },
      {
        name: 'show_resume',
        selector: { select: { mode: 'list', options: RESUME_OPTIONS } },
      },
      { name: 'tap_action', selector: { ui_action: {} } },
      { name: 'hold_action', selector: { ui_action: {} } },
      { name: 'double_tap_action', selector: { ui_action: {} } },
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
  `;
}
