import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';

import { TILE_CARD_EDITOR_NAME } from './const';
import { fetchAcpConfigEntries, type AcpConfigEntry } from './lib/config-entries';
import { renderEditorFooter } from './lib/editor-footer';
import {
  fetchEntityRegistry,
  subscribeEntityRegistry,
  type EntityRegistryEntry,
} from './lib/entity-registry';
import { discoverEntities } from './lib/entity-discovery';
import { t } from './lib/i18n';
import type { AdaptiveCoverProTileCardConfig } from './types';

interface ValueChangedEvent extends CustomEvent {
  detail: { value: AdaptiveCoverProTileCardConfig };
}

interface HaFormSchemaItem {
  name: string;
  required?: boolean;
  selector?: Record<string, unknown>;
  // Layout-group containers (ha-form `expandable` / `grid`). When `type` is set
  // the item groups `schema` children instead of binding a selector.
  type?: string;
  title?: string;
  icon?: string;
  expanded?: boolean;
  column_min_width?: string;
  schema?: HaFormSchemaItem[];
}

// Mirror the runtime defaults applied in adaptive-cover-pro-tile-card.ts so the
// editor toggles reflect actual behavior when a key is omitted from YAML.
// The 9 configurable handler-badge kinds, surfaced as flat `badge_<kind>`
// boolean fields in the form and reassembled into a nested `badges` object on
// emit. `off` and `auto` are state-fallbacks and are never user-configurable.
const BADGE_KINDS = [
  'auto',
  'solar',
  'force',
  'weather',
  'manual',
  'custom_position',
  'motion',
  'climate',
  'glare_zone',
  'cloud',
] as const;

const FORM_DEFAULTS = {
  show_position: true,
  show_state: true,
  show_decision_summary: false,
  show_controls: true,
  show_badge: true,
  show_position_bar: true,
  show_tilt: true,
  show_compass: true,
  show_elevation_chart: true,
  show_solar_calc: true,
  show_motion_icon: true,
  state_color: true,
  layout: 'detailed',
  // All badges default on; only `=== false` hides.
  badge_auto: true,
  badge_solar: true,
  badge_force: true,
  badge_weather: true,
  badge_manual: true,
  badge_custom_position: true,
  badge_motion: true,
  badge_climate: true,
  badge_glare_zone: true,
  badge_cloud: true,
  // Cover Group entries only — see the group branch of `_schema()`.
  show_scene_select: true,
  show_lock: true,
  show_automation: true,
  show_clear_overrides: true,
  show_member_badges: true,
} as const;

const LABEL_KEYS: Record<string, string> = {
  entry_id: 'editor.common.entry_id',
  name: 'editor.tile.name',
  icon: 'editor.tile.icon',
  cover: 'editor.tile.cover',
  layout: 'editor.tile.layout',
  show_position: 'editor.tile.show_position',
  show_state: 'editor.tile.show_state',
  show_decision_summary: 'editor.tile.show_decision_summary',
  show_controls: 'editor.tile.show_controls',
  show_badge: 'editor.tile.show_badge',
  show_position_bar: 'editor.tile.show_position_bar',
  show_tilt: 'editor.tile.show_tilt',
  badge_section: 'editor.tile.badge_section',
  badge_auto: 'editor.tile.badge_auto',
  badge_solar: 'editor.tile.badge_solar',
  badge_force: 'editor.tile.badge_force',
  badge_weather: 'editor.tile.badge_weather',
  badge_manual: 'editor.tile.badge_manual',
  badge_custom_position: 'editor.tile.badge_custom_position',
  badge_motion: 'editor.tile.badge_motion',
  badge_climate: 'editor.tile.badge_climate',
  badge_glare_zone: 'editor.tile.badge_glare_zone',
  badge_cloud: 'editor.tile.badge_cloud',
  show_compass: 'editor.tile.show_compass',
  show_elevation_chart: 'editor.tile.show_elevation_chart',
  show_solar_calc: 'editor.tile.show_solar_calc',
  show_motion_icon: 'editor.tile.show_motion_icon',
  state_color: 'editor.tile.state_color',
  tap_action: 'editor.tile.tap_action',
  icon_tap_action: 'editor.tile.icon_tap_action',
  hold_action: 'editor.tile.hold_action',
  double_tap_action: 'editor.tile.double_tap_action',
  interactions_section: 'editor.tile.interactions_section',
  content_section: 'editor.tile.content_section',
  controls_section: 'editor.tile.controls_section',
  dialog_section: 'editor.tile.dialog_section',
  group_row_section: 'editor.tile.group_row_section',
  show_scene_select: 'editor.tile.show_scene_select',
  show_lock: 'editor.tile.show_lock',
  show_automation: 'editor.tile.show_automation',
  show_clear_overrides: 'editor.tile.show_clear_overrides',
  show_member_badges: 'editor.tile.show_member_badges',
};

@customElement(TILE_CARD_EDITOR_NAME)
export class AdaptiveCoverProTileCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config?: AdaptiveCoverProTileCardConfig;
  @state() private _entries: AcpConfigEntry[] | null = null;
  @state() private _entriesError: string | null = null;
  @state() public _registry: EntityRegistryEntry[] | null = null;
  @state() private _managedCovers: string[] = [];

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
    if (changed.has('_registry') && this._registry !== null) {
      this._refreshManagedCovers();
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
        this._refreshManagedCovers();
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
          this._refreshManagedCovers();
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

  /**
   * Record the entry's managed covers so the form can decide whether the
   * `cover` picker is worth offering.
   *
   * Deliberately does NOT prefill `cover`. It used to write
   * `managed_covers[0]` into the config whenever an entry managed exactly one
   * cover — the one case where the value is pure redundancy, since
   * `_resolvedCover` already falls back to that same entity. Writing it pinned
   * an entity_id into YAML against CLAUDE.md's "entity binding goes through
   * discovery" rule, contradicted the editor's own "leave blank" hint, and left
   * the config pointing at a dead id if the cover were ever renamed.
   *
   * Configs that already carry `cover` are untouched — `_resolvedCover` still
   * honors an explicit value.
   */
  private _refreshManagedCovers(): void {
    if (!this._config?.entry_id || !this._registry || !this.hass) return;
    const discovered = discoverEntities(
      this.hass,
      { type: this._config.type, entry_id: this._config.entry_id },
      this._registry,
    );
    this._managedCovers = discovered?.managed_covers ?? [];
  }

  private _computeLabel = (schema: HaFormSchemaItem): string => {
    const key = LABEL_KEYS[schema.name];
    return key ? t(key, this.hass) : schema.name;
  };

  /** True when `_config.name` is a composed part list rather than a plain
   *  string (issue #247) — the `name` text field is rendered blank (but still
   *  editable) in that case (see `_schema()`/`render()`), never bound to the
   *  raw array. Typing a fresh string into the field is an explicit,
   *  intentional overwrite of the composed name — see `_valueChanged`. */
  private _nameIsComposed(): boolean {
    return Array.isArray(this._config?.name);
  }

  private _valueChanged = (e: ValueChangedEvent): void => {
    e.stopPropagation();
    const value = e.detail.value;
    // ha-form passes back the entire form value (including defaults we pre-fill
    // for display). Drop keys that match the default and weren't already in
    // the user's config, so the YAML stays minimal.
    const cleaned: Record<string, unknown> = { ...value };

    // A composed `name` isn't editable through this text field — it's
    // rendered blank (see `_schema()`/`render()`) so it never stringifies the
    // array. An untouched blank means the user didn't type into it (this
    // value-changed fired for some other field), so the existing array must
    // survive; a non-empty string is a deliberate, explicit overwrite of the
    // composed name with a plain string.
    if (this._nameIsComposed() && !cleaned.name) {
      delete cleaned.name;
    }

    for (const [k, def] of Object.entries(FORM_DEFAULTS)) {
      // The flat badge_* fields don't live on _config (they're nested under
      // `badges`), so treat them purely as default-prunable: drop them whenever
      // they equal the default (true). Off badges survive and are reassembled
      // into the nested object below.
      if (k.startsWith('badge_')) {
        if (cleaned[k] === def) delete cleaned[k];
        continue;
      }
      const wasSet = this._config && Object.prototype.hasOwnProperty.call(this._config, k);
      if (!wasSet && cleaned[k] === def) delete cleaned[k];
    }

    // Reassemble the surviving flat badge_<kind>=false fields into a nested
    // `badges` object, and strip the flat keys so they don't leak into YAML.
    const badges: Record<string, boolean> = {};
    for (const k of BADGE_KINDS) {
      const flatKey = `badge_${k}`;
      if (cleaned[flatKey] === false) badges[k] = false;
      delete cleaned[flatKey];
    }

    const next: Record<string, unknown> = {
      ...(this._config ?? { type: '', entry_id: '' }),
      ...cleaned,
    };
    // Prune the object entirely when all nine badges are on (keeps YAML minimal).
    if (Object.keys(badges).length > 0) next.badges = badges;
    else delete next.badges;

    this._emit(next as AdaptiveCoverProTileCardConfig);
  };

  protected render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;

    if (this._entriesError && !this._entries) {
      // Fall back to the same manual-entry input the main editor uses.
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
    // Flatten the nested `badges` object into `badge_<kind>` form fields. The
    // `badges` key itself is not a form field, so drop it from `data`.
    const { badges, ...rest } = this._config;
    const flatBadges: Record<string, boolean> = {};
    for (const k of BADGE_KINDS) {
      if (badges && badges[k] === false) flatBadges[`badge_${k}`] = false;
    }
    const nameIsComposed = this._nameIsComposed();
    const data = {
      ...FORM_DEFAULTS,
      ...rest,
      // A composed (array) name is never bound to the text field's data —
      // that would stringify to "[object Object]" on the next render. Blank
      // it instead; `_valueChanged` preserves the underlying array as long as
      // the field comes back untouched (issue #247).
      ...(nameIsComposed ? { name: '' } : {}),
      ...flatBadges,
    };

    return html`
      <div class="form">
        <ha-form
          .hass=${this.hass}
          .data=${data}
          .schema=${schema}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>
        ${nameIsComposed
          ? html`<div class="hint">${t('editor.tile.name_composed_hint', this.hass)}</div>`
          : nothing}
        ${this._managedCovers.length > 1 && !this._config?.cover
          ? html`<div class="hint">${t('editor.tile.cover_blank_hint', this.hass)}</div>`
          : nothing}
        ${renderEditorFooter(this.hass)}
      </div>
    `;
  }

  private _schema(): HaFormSchemaItem[] {
    const entryOptions = this._entries?.map((e) => ({ value: e.entry_id, label: e.title })) ?? [];

    const layoutOptions = [
      { value: 'one-line', label: t('editor.tile.layout_option_one_line', this.hass) },
      { value: 'detailed', label: t('editor.tile.layout_option_detailed', this.hass) },
    ];

    // Filter the cover picker to the entry's managed covers once we have
    // registry + entry_id. Without those, fall back to any cover.* so the
    // field is still usable.
    let coverSelector: Record<string, unknown> = { entity: { domain: 'cover' } };
    let isGroup = false;
    // Read the cover count from THIS discovery rather than the `_managedCovers`
    // state field: that field is written from `updated()`, so gating the schema
    // on it would need a second render cycle before the picker appeared.
    let managedCount = 0;
    if (this._registry && this._config?.entry_id) {
      const discovered = discoverEntities(
        this.hass,
        { type: this._config.type, entry_id: this._config.entry_id },
        this._registry,
      );
      isGroup = !!discovered?.is_group;
      managedCount = discovered?.managed_covers.length ?? 0;
      if (discovered && !isGroup && discovered.managed_covers.length > 0) {
        coverSelector = {
          entity: { domain: 'cover', include_entities: discovered.managed_covers },
        };
      }
    }

    // A Cover Group renders `acp-group-tile`, not the cover tile — so almost
    // every cover option below is inert for it (no single cover to pick, no
    // decision summary, no compass/elevation/solar dialog sections, no motion
    // icon, no per-kind winner badges, no layout variants, and tap always opens
    // the group dialog). Offering them would be a wall of switches that do
    // nothing. Show the group's own surface instead.
    if (isGroup) {
      return [
        {
          name: 'entry_id',
          required: true,
          selector: { select: { options: entryOptions, mode: 'dropdown' } },
        },
        this._section('content_section', 'mdi:format-text', true, [
          { name: 'name', selector: { text: {} } },
          { name: 'icon', selector: { icon: {} } },
          this._grid([{ name: 'state_color', selector: { boolean: {} } }]),
        ]),
        this._section('controls_section', 'mdi:arrow-up-down', false, [
          this._grid([
            { name: 'show_controls', selector: { boolean: {} } },
            { name: 'show_position_bar', selector: { boolean: {} } },
            { name: 'show_tilt', selector: { boolean: {} } },
          ]),
        ]),
        this._section('group_row_section', 'mdi:window-shutter-cog', false, [
          this._grid([
            { name: 'show_scene_select', selector: { boolean: {} } },
            { name: 'show_lock', selector: { boolean: {} } },
            { name: 'show_automation', selector: { boolean: {} } },
            { name: 'show_clear_overrides', selector: { boolean: {} } },
            { name: 'show_member_badges', selector: { boolean: {} } },
          ]),
        ]),
        this._interactionsSection(),
      ];
    }

    return [
      {
        name: 'entry_id',
        required: true,
        selector: { select: { options: entryOptions, mode: 'dropdown' } },
      },
      // The cover picker only appears when the entry manages MORE THAN ONE
      // cover. With a single cover it can only ever select the entity
      // `_resolvedCover` already falls back to, so offering it is a control that
      // cannot change anything. An existing explicit `cover` keeps the field
      // visible so a previously-written value stays editable (and removable)
      // rather than becoming invisible-but-live. Sits beside `entry_id` above
      // the sections because both are entity binding, not presentation.
      ...(managedCount > 1 || this._config?.cover
        ? [{ name: 'cover', selector: coverSelector }]
        : []),
      this._section('content_section', 'mdi:format-text', true, [
        { name: 'name', selector: { text: {} } },
        { name: 'icon', selector: { icon: {} } },
        {
          name: 'layout',
          selector: { select: { mode: 'list', options: layoutOptions } },
        },
        this._grid([
          { name: 'show_position', selector: { boolean: {} } },
          { name: 'show_state', selector: { boolean: {} } },
          { name: 'show_decision_summary', selector: { boolean: {} } },
          { name: 'state_color', selector: { boolean: {} } },
          { name: 'show_motion_icon', selector: { boolean: {} } },
        ]),
      ]),
      this._section('controls_section', 'mdi:arrow-up-down', false, [
        this._grid([
          { name: 'show_controls', selector: { boolean: {} } },
          { name: 'show_position_bar', selector: { boolean: {} } },
          // Cover tiles honor show_tilt (the mini slat-angle bar on a venetian)
          // but the schema never offered it, so it was YAML-only until now.
          { name: 'show_tilt', selector: { boolean: {} } },
        ]),
      ]),
      this._section('badge_section', 'mdi:label-multiple-outline', false, [
        { name: 'show_badge', selector: { boolean: {} } },
        this._grid(BADGE_KINDS.map((k) => ({ name: `badge_${k}`, selector: { boolean: {} } }))),
      ]),
      this._section('dialog_section', 'mdi:card-text-outline', false, [
        this._grid([
          { name: 'show_compass', selector: { boolean: {} } },
          { name: 'show_elevation_chart', selector: { boolean: {} } },
          { name: 'show_solar_calc', selector: { boolean: {} } },
        ]),
      ]),
      this._interactionsSection(),
    ];
  }

  /** A collapsible group. The name MUST stay empty: ha-form does not nest
   *  unnamed groups, so every field inside stays flat in the form value and the
   *  emitted YAML keeps its existing top-level keys. Naming these (HA's own
   *  approach, which pairs a name with `flatten: true`) would nest every value
   *  and break existing configs. */
  private _section(
    titleKey: string,
    icon: string,
    expanded: boolean,
    schema: HaFormSchemaItem[],
  ): HaFormSchemaItem {
    return {
      type: 'expandable',
      name: '',
      title: t(`editor.tile.${titleKey}`, this.hass),
      icon,
      expanded,
      schema,
    };
  }

  /** Two-column cluster for related booleans, matching how HA grids its own
   *  icon/color/picture/hide_state row. */
  private _grid(schema: HaFormSchemaItem[]): HaFormSchemaItem {
    return { type: 'grid', name: '', schema };
  }

  /** The Interactions group, shared by both the cover and group schemas so the
   *  two can't drift. Mirrors HA's own tile editor, which collects tap /
   *  icon-tap / hold / double-tap under one expandable. `icon_tap_action`
   *  defaults to `none` — matching HA for the cover domain — and doubles as the
   *  switch for the tinted pill behind the glyph (see types.ts). */
  private _interactionsSection() {
    return this._section('interactions_section', 'mdi:gesture-tap', false, [
      { name: 'tap_action', selector: { ui_action: {} } },
      { name: 'icon_tap_action', selector: { ui_action: { default_action: 'none' } } },
      { name: 'hold_action', selector: { ui_action: {} } },
      { name: 'double_tap_action', selector: { ui_action: {} } },
    ]);
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
    .hint {
      font-size: 0.8rem;
      color: var(--secondary-text-color, #888);
      padding: 4px 0 0;
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
