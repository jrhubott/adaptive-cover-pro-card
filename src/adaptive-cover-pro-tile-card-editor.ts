import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';

import { AXIS_LABEL_I18N_KEYS, TILE_CARD_EDITOR_NAME } from './const';
import { resolveAxes } from './lib/axes';
import { fetchAcpConfigEntries, type AcpConfigEntry } from './lib/config-entries';
import { renderEditorFooter } from './lib/editor-footer';
import {
  fetchEntityRegistry,
  subscribeEntityRegistry,
  type EntityRegistryEntry,
} from './lib/entity-registry';
import { discoverEntities } from './lib/entity-discovery';
import { t } from './lib/i18n';
import type { AdaptiveCoverProTileCardConfig, DiscoveredEntities } from './types';
import { readGroup } from './lib/group-controls';
import {
  applyMemberOrder,
  buildRoster,
  rosterRowConfigKey,
  rosterRowKey,
  type RosterRow,
} from './lib/group-roster';
import { getCachedRegistry } from './lib/registry-store';

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
  controls_cover: 'editor.tile.controls_cover',
  controls_axis: 'editor.tile.controls_axis',
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
    // `_config` too, not just `_registry`: switching entry_id changes which
    // covers exist, and a stale `_managedCovers` makes the rail list show the
    // PREVIOUS entry's covers — which then get re-emitted into `covers` on the
    // next interaction, leaving a config the tile filters down to nothing.
    if ((changed.has('_registry') || changed.has('_config')) && this._registry !== null) {
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
    // Seed from the SHARED store first. Every card on the dashboard behind this
    // dialog subscribes to the entity registry and keeps that store warm, so the
    // data is almost always already in memory — while the fetch below is a full
    // registry round-trip that took seconds on a large install, during which the
    // group member-name fields could not render at all (they need the registry
    // to resolve each member cover to its entry).
    //
    // The fetch still runs: the store can be cold when no ACP card has mounted
    // yet, and a refresh costs nothing once the fields are already up.
    if (this._registry === null) {
      const cached = getCachedRegistry();
      if (cached) {
        this._registry = cached;
        this._refreshManagedCovers();
      }
    }
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
    this._isGroupEntry = !!discovered?.is_group;
    this._groupDiscovered = discovered?.is_group ? discovered : null;
    this._memberLabels.clear();
    // Seed the name drafts HERE, never in render(): assigning reactive state
    // during a render schedules an update from inside an update, which Lit warns
    // about and which re-entered often enough to keep resetting the inputs.
    const entryId = this._config?.entry_id ?? '';
    if (this._memberDrafts === null || this._memberDraftsFor !== entryId) {
      this._memberDrafts = { ...(this._config?.member_names ?? {}) };
      this._memberDraftsFor = entryId;
    }
  }

  /** True for a Cover Group entry. The group tile ignores every cover-tile
   *  option, so the rail-order widget must not offer one — same rationale as
   *  the group branch of {@link _schema}. */
  @state() private _isGroupEntry = false;

  /** The discovered group entry, kept so {@link _renderMemberNames} can build
   *  the same roster the dialog does instead of guessing at the member list. */
  @state() private _groupDiscovered: DiscoveredEntities | null = null;

  /**
   * In-progress text for the member-name fields, keyed by
   * {@link rosterRowConfigKey}.
   *
   * The fields cannot bind `.value` to the config directly. HA hands this editor
   * a fresh `hass` on every state tick, so it re-renders about once a second,
   * and each render would push the STORED value back into the input. `change`
   * only fires on blur, so every keystroke was reverted before it could be
   * committed and the field read as uneditable.
   *
   * Drafts absorb that: typing updates the draft (no config write), blur commits
   * it. Seeded from the config on first render and re-seeded when the edited
   * entry changes, which is the only time an outside edit can be in flight.
   */
  @state() private _memberDrafts: Record<string, string> | null = null;

  /** entry_id the drafts were seeded for, so switching the edited card reseeds
   *  them instead of carrying another entry's half-typed names across. */
  private _memberDraftsFor: string | null = null;

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
    // Every cover-binding key names an entity of the OLD entry, so switching
    // entries must drop them rather than carry them across. Left behind, `covers`
    // filters to nothing (a tile with no rails and no way back through the UI)
    // and `controls_cover` would aim ↑■↓ at another entry's cover.
    if (this._config?.entry_id && next.entry_id !== this._config.entry_id) {
      delete next.cover;
      delete next.covers;
      delete next.controls_cover;
      delete next.controls_axis;
    }
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
            @change=${(e: Event) => {
              // Same cover-key purge as `_valueChanged` — this path bypasses
              // ha-form entirely, and it is reached exactly when discovery is
              // degraded, which is when a stale `controls_cover` slips through
              // the tile's roster validation.
              const next = {
                ...(this._config ?? { type: '', entry_id: '' }),
                entry_id: (e.target as HTMLInputElement).value,
              };
              if (this._config?.entry_id && next.entry_id !== this._config.entry_id) {
                delete next.cover;
                delete next.covers;
                delete next.controls_cover;
                delete next.controls_axis;
              }
              this._emit(next);
            }}
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
        ${this._renderRailOrder()} ${this._renderMemberNames()} ${renderEditorFooter(this.hass)}
      </div>
    `;
  }

  /** Index currently being dragged in the rail-order list, or null. */
  @state() private _dragFrom: number | null = null;

  /**
   * The rail list in its effective order: the configured `covers` first (minus
   * anything the entry no longer manages), then every remaining managed cover.
   * Rails past the configured list are the hidden ones — this is what lets one
   * widget express both order and subset without a separate "add" affordance.
   */
  private _railRows(): { id: string; shown: boolean }[] {
    const managed = this._managedCovers;
    const configured = (this._config?.covers ?? []).filter((id) => managed.includes(id));
    const rest = managed.filter((id) => !configured.includes(id));
    // With no `covers` set, the widget must show what the TILE renders, which
    // is the `cover` pin alone when one is set and every managed cover
    // otherwise. Marking them all shown regardless made the widget disagree
    // with the tile, and made hiding a rail paradoxically ADD one.
    const rows =
      configured.length > 0
        ? [
            ...configured.map((id) => ({ id, shown: true })),
            ...rest.map((id) => ({ id, shown: false })),
          ]
        : managed.map((id) => ({ id, shown: this._defaultShows(id) }));
    // Shown rails ALWAYS come first. Only they are persisted, so `_moveRail`
    // can only reorder within that block — leaving a shown rail at a high index
    // behind a hidden one left its ↑ button enabled over a no-op.
    return [...rows.filter((r) => r.shown), ...rows.filter((r) => !r.shown)];
  }

  /** Which rails the tile draws when `covers` is absent — {@link _emitRails}
   *  and {@link _railRows} must agree on this or the key gets dropped into a
   *  state that renders differently from the list the user just arranged. */
  private _defaultShows(id: string): boolean {
    return this._config?.cover ? id === this._config.cover : true;
  }

  private _coverName(id: string): string {
    return (this.hass?.states[id]?.attributes?.friendly_name as string | undefined) ?? id;
  }

  /** Write a reordered/re-filtered row list back to `covers`. An all-shown list
   *  in the integration's own order is written as `undefined` so an untouched
   *  card keeps a clean config rather than gaining a redundant key. */
  private _emitRails(rows: { id: string; shown: boolean }[]): void {
    if (!this._config) return;
    const covers = rows.filter((r) => r.shown).map((r) => r.id);
    // "Default" is what the tile renders with no `covers` key — which is the
    // `cover` pin when one is set, NOT the full managed list. Comparing against
    // the full list would delete the key on a pinned tile and silently collapse
    // it back to one rail.
    const fallback = this._managedCovers.filter((id) => this._defaultShows(id));
    const isDefault =
      covers.length === fallback.length && covers.every((id, i) => id === fallback[i]);
    const { covers: _drop, ...rest } = this._config;
    this._emit(isDefault ? rest : { ...rest, covers });
  }

  /** Reorder within the SHOWN block only. Only shown rails are persisted, so a
   *  move involving a hidden row could not be represented and silently snapped
   *  back — the buttons for those are disabled instead of pretending to work. */
  private _moveRail(from: number, to: number): void {
    const rows = this._railRows();
    const shownCount = rows.filter((r) => r.shown).length;
    if (to < 0 || to >= shownCount || from >= shownCount || from === to) return;
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    this._emitRails(next);
  }

  private _toggleRail(index: number): void {
    const rows = this._railRows();
    // Never let the last visible rail be hidden — a tile with no position bar
    // is what `show_position_bar` is for, and losing every rail here would
    // leave no way back except editing YAML.
    if (rows[index].shown && rows.filter((r) => r.shown).length === 1) return;
    const target = rows[index];
    if (target.shown) {
      this._emitRails(rows.map((r, i) => (i === index ? { ...r, shown: false } : r)));
      return;
    }
    // Re-showing puts the rail back at its position in the integration's own
    // order rather than on the end. Appending made hide-then-show a permanent
    // reorder: hiding A in [A,B,C] and showing it again yielded [B,C,A], which
    // then also pinned a redundant `covers` key into the YAML.
    const shown = rows.filter((r) => r.shown);
    const home = this._managedCovers.indexOf(target.id);
    const at = shown.filter((r) => this._managedCovers.indexOf(r.id) < home).length;
    const restored = [...shown];
    restored.splice(at, 0, { ...target, shown: true });
    this._emitRails(restored);
  }

  /**
   * The Cover Group roster: per-row display name, order, and visibility in one
   * widget.
   *
   * A plain `ha-form` field cannot express any of it — the keys are entry ids
   * the user has never seen and could not type — so the widget lists the roster
   * itself and labels each row with the name it resolves to today. Order and
   * visibility use the same list as the rail widget below (drag, ↑/↓, eye)
   * because they are the same problem; the name input just rides along on each
   * row, which is why naming and sorting are one section rather than two that
   * disagree about what a row is.
   *
   * Leaving a name empty removes the override rather than storing an empty
   * string, so the entry's own title comes back instead of a blank row.
   */
  private _renderMemberNames(): TemplateResult | typeof nothing {
    const rows = this._memberRows();
    if (rows.length === 0) return nothing;
    const drafts = this._memberDrafts ?? {};
    const shownCount = rows.filter((r) => r.shown).length;
    return html`
      <div class="rail-order">
        <div class="rail-order-title">${t('editor.tile.member_names', this.hass)}</div>
        <div class="hint">${t('editor.tile.member_names_hint', this.hass)}</div>
        <ul>
          ${rows.map((row, i) => {
            const key = rosterRowConfigKey(row.row);
            const label = this._memberRowLabel(row.row);
            return html`
              <li
                class=${`rail member-row${row.shown ? '' : ' hidden-rail'}${
                  this._memberDragFrom === i ? ' dragging' : ''
                }`}
                draggable=${row.shown ? 'true' : 'false'}
                @dragstart=${() => (this._memberDragFrom = i)}
                @dragend=${() => (this._memberDragFrom = null)}
                @dragover=${(e: DragEvent) => {
                  if (row.shown) e.preventDefault();
                }}
                @drop=${(e: DragEvent) => {
                  e.preventDefault();
                  if (this._memberDragFrom !== null && row.shown)
                    this._moveMember(this._memberDragFrom, i);
                  this._memberDragFrom = null;
                }}
              >
                <ha-icon class="grip" icon="mdi:drag-horizontal-variant"></ha-icon>
                <input
                  class="member-name"
                  type="text"
                  .value=${drafts[key] ?? ''}
                  placeholder=${label}
                  aria-label=${label}
                  @change=${(e: Event) =>
                    this._memberNameChanged(key, (e.target as HTMLInputElement).value)}
                />
                <button
                  type="button"
                  class="rail-btn"
                  aria-label=${t('editor.tile.covers_move_up', this.hass)}
                  ?disabled=${!row.shown || i === 0}
                  @click=${() => this._moveMember(i, i - 1)}
                >
                  <ha-icon icon="mdi:arrow-up"></ha-icon>
                </button>
                <button
                  type="button"
                  class="rail-btn"
                  aria-label=${t('editor.tile.covers_move_down', this.hass)}
                  ?disabled=${!row.shown || i >= shownCount - 1}
                  @click=${() => this._moveMember(i, i + 1)}
                >
                  <ha-icon icon="mdi:arrow-down"></ha-icon>
                </button>
                <button
                  type="button"
                  class="rail-btn"
                  aria-label=${t(
                    row.shown ? 'editor.tile.members_hide' : 'editor.tile.members_show',
                    this.hass,
                  )}
                  aria-pressed=${row.shown ? 'true' : 'false'}
                  @click=${() => this._toggleMember(i)}
                >
                  <ha-icon icon=${row.shown ? 'mdi:eye' : 'mdi:eye-off'}></ha-icon>
                </button>
              </li>
            `;
          })}
        </ul>
      </div>
    `;
  }

  /** Index currently being dragged in the member list, or null. Separate from
   *  `_dragFrom`: both lists can be on screen for a group entry, and sharing
   *  one index made a drag in either highlight a row in the other. */
  @state() private _memberDragFrom: number | null = null;

  /** The live roster in the order the card renders it. Shown rows first, in the
   *  configured `members` order; then everything the key leaves out, which is
   *  exactly the hidden set. Same shape as {@link _railRows} so the two lists
   *  behave identically. */
  private _memberRows(): { row: RosterRow; shown: boolean }[] {
    const roster = this._naturalRoster();
    const configured = this._config?.members;
    if (!configured?.length) return roster.map((row) => ({ row, shown: true }));
    const visible = new Set(configured);
    // `applyMemberOrder` trims each row to its listed covers; the editor lists
    // WHOLE rows, so re-attach the untrimmed row it came from — hiding and
    // showing operate on the row, not on one of its rails.
    const byKey = new Map(roster.map((row) => [rosterRowKey(row), row]));
    const shown = applyMemberOrder(roster, configured).map((row) => ({
      row: byKey.get(rosterRowKey(row)) ?? row,
      shown: true,
    }));
    const hidden = roster
      .filter((row) => !row.covers.some((id) => visible.has(id)))
      .map((row) => ({ row, shown: false }));
    return [...shown, ...hidden];
  }

  /** The roster in the integration's own order — the baseline both "is this
   *  still the default?" and "where does a re-shown row go back to?" measure
   *  against. Must NOT be `_memberRows()`, which is already re-ordered. */
  private _naturalRoster(): RosterRow[] {
    const discovered = this._groupDiscovered;
    if (!discovered || !this.hass) return [];
    return buildRoster(
      this.hass,
      Object.keys(readGroup(this.hass, discovered).memberPositions),
      this._registry ?? undefined,
    );
  }

  /** Write a reordered/re-filtered roster back to `members`. An all-shown list
   *  in the integration's own order drops the key, so an untouched card keeps a
   *  clean config — same rule as {@link _emitRails}. */
  private _emitMembers(rows: { row: RosterRow; shown: boolean }[]): void {
    if (!this._config) return;
    // COVER ids, not row keys — see `hiddenMemberCovers`. A row key is the
    // owning entry_id only while that cover's owner resolves, and an
    // unavailable member (the kind most likely to be hidden) resolves to
    // nothing, so a row-keyed list silently stopped matching.
    const members = rows.filter((r) => r.shown).flatMap((r) => r.row.covers);
    const fallback = this._naturalRoster().flatMap((row) => row.covers);
    const isDefault =
      members.length === fallback.length && members.every((id, i) => id === fallback[i]);
    const { members: _drop, ...rest } = this._config;
    this._emit(isDefault ? rest : { ...rest, members });
  }

  /** Reorder within the SHOWN block only — a hidden row has no position in the
   *  persisted list, so moving it could not be represented. */
  private _moveMember(from: number, to: number): void {
    const rows = this._memberRows();
    const shownCount = rows.filter((r) => r.shown).length;
    if (to < 0 || to >= shownCount || from >= shownCount || from === to) return;
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    this._emitMembers(next);
  }

  /**
   * Hide or re-show one roster row.
   *
   * Unlike a rail, the LAST member may be hidden: a group dialog with no roster
   * still carries the aggregate readout, the position track and the control
   * row, so hiding everything leaves a usable card rather than an empty one.
   *
   * Re-showing restores the row to its place in the integration's own roster
   * order rather than appending, so hide-then-show is a round trip instead of a
   * silent reorder.
   */
  private _toggleMember(index: number): void {
    const rows = this._memberRows();
    const target = rows[index];
    if (!target) return;
    if (target.shown) {
      this._emitMembers(rows.map((r, i) => (i === index ? { ...r, shown: false } : r)));
      return;
    }
    const natural = this._naturalRoster().map(rosterRowKey);
    const home = natural.indexOf(rosterRowKey(target.row));
    const shown = rows.filter((r) => r.shown);
    const at = shown.filter((r) => natural.indexOf(rosterRowKey(r.row)) < home).length;
    const restored = [...shown];
    restored.splice(at, 0, { ...target, shown: true });
    this._emitMembers(restored);
  }

  /** One member's name override. `ha-form` used to hand back the whole map at
   *  once; a per-row input hands back one key, so patch rather than replace. */
  private _memberNameChanged(key: string, raw: string): void {
    this._memberNamesChanged({ ...(this._memberDrafts ?? {}), [key]: raw });
  }

  /** What this row is called today: its ACP entry's title, or a generic cover's
   *  friendly name. Shown as the field label AND as the placeholder, so an empty
   *  field reads as "this is what you will get" rather than as missing data. */
  private _memberRowLabel(row: RosterRow): string {
    const cached = this._memberLabels.get(row.entryId ?? row.covers[0]);
    if (cached !== undefined) return cached;
    let label: string | undefined;
    if (row.entryId && this._registry) {
      const d = discoverEntities(
        this.hass,
        { type: this._config!.type, entry_id: row.entryId },
        this._registry,
      );
      label = d?.entry_title;
    }
    if (!label) {
      const st = this.hass.states[row.covers[0]];
      label = (st?.attributes?.friendly_name as string | undefined) ?? row.covers[0];
    }
    this._memberLabels.set(row.entryId ?? row.covers[0], label);
    return label;
  }

  /**
   * Resolved row labels, cached across renders.
   *
   * Each miss costs a full `discoverEntities` walk of the entity registry, and
   * this editor re-renders on every hass tick — so an uncached lookup was one
   * registry walk per member per second while the config dialog sat open.
   * Cleared whenever the registry is replaced, which is the only thing that can
   * change an entry's resolved title.
   */
  private _memberLabels = new Map<string, string>();

  /**
   * Commit the whole member-name map from `ha-form`.
   *
   * `ha-form` hands back every field each time, so this replaces the map rather
   * than patching one key. Blank fields are DROPPED instead of stored as "" —
   * an empty string is a name, and would blank the roster row instead of
   * restoring the entry's own title.
   */
  private _memberNamesChanged(value: Record<string, string>): void {
    const next: Record<string, string> = {};
    for (const [key, raw] of Object.entries(value ?? {})) {
      const trimmed = typeof raw === 'string' ? raw.trim() : '';
      if (trimmed) next[key] = trimmed;
    }
    this._memberDrafts = { ...value };
    this._memberDraftsFor = this._config?.entry_id ?? '';
    const config = { ...this._config! };
    if (Object.keys(next).length > 0) config.member_names = next;
    else delete config.member_names;
    this._emit(config);
  }

  /**
   * Rail order/visibility, as a sortable list rather than an `ha-form` field.
   * Drag a row, or use the ↑/↓ buttons — those are not a lesser fallback but
   * the only path that works on touch and with a keyboard, since HTML5 drag
   * events fire for neither.
   */
  private _renderRailOrder(): TemplateResult | typeof nothing {
    // A Cover Group renders `acp-group-tile`, which reads none of this — same
    // reason `_schema()` hides the cover options for a group.
    if (this._isGroupEntry || this._managedCovers.length < 2) return nothing;
    const rows = this._railRows();
    const shownCount = rows.filter((r) => r.shown).length;
    return html`
      <div class="rail-order">
        <div class="rail-order-title">${t('editor.tile.covers', this.hass)}</div>
        <div class="hint">${t('editor.tile.covers_hint', this.hass)}</div>
        <ul>
          ${rows.map(
            (row, i) => html`
              <li
                class=${`rail${row.shown ? '' : ' hidden-rail'}${this._dragFrom === i ? ' dragging' : ''}`}
                draggable=${row.shown ? 'true' : 'false'}
                @dragstart=${() => (this._dragFrom = i)}
                @dragend=${() => (this._dragFrom = null)}
                @dragover=${(e: DragEvent) => {
                  // Only shown rows are valid drop targets — a hidden row has no
                  // position in the persisted list, so a drop there would snap
                  // back with no explanation. Refusing the dragover means the
                  // cursor says "not allowed" instead.
                  if (row.shown) e.preventDefault();
                }}
                @drop=${(e: DragEvent) => {
                  e.preventDefault();
                  if (this._dragFrom !== null && row.shown) this._moveRail(this._dragFrom, i);
                  this._dragFrom = null;
                }}
              >
                <ha-icon class="grip" icon="mdi:drag-horizontal-variant"></ha-icon>
                <span class="rail-name">${this._coverName(row.id)}</span>
                <button
                  type="button"
                  class="rail-btn"
                  aria-label=${t('editor.tile.covers_move_up', this.hass)}
                  ?disabled=${!row.shown || i === 0}
                  @click=${() => this._moveRail(i, i - 1)}
                >
                  <ha-icon icon="mdi:arrow-up"></ha-icon>
                </button>
                <button
                  type="button"
                  class="rail-btn"
                  aria-label=${t('editor.tile.covers_move_down', this.hass)}
                  ?disabled=${!row.shown || i >= shownCount - 1}
                  @click=${() => this._moveRail(i, i + 1)}
                >
                  <ha-icon icon="mdi:arrow-down"></ha-icon>
                </button>
                <button
                  type="button"
                  class="rail-btn"
                  aria-label=${t(
                    row.shown ? 'editor.tile.covers_hide' : 'editor.tile.covers_show',
                    this.hass,
                  )}
                  aria-pressed=${row.shown ? 'true' : 'false'}
                  ?disabled=${row.shown && shownCount === 1}
                  @click=${() => this._toggleRail(i)}
                >
                  <ha-icon icon=${row.shown ? 'mdi:eye' : 'mdi:eye-off'}></ha-icon>
                </button>
              </li>
            `,
          )}
        </ul>
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
    // Axes the entry actually exposes, for the ↑■↓ target picker. Labels prefer
    // the card's own i18n for known ids (the integration emits English-only
    // labels), matching what the bars themselves render.
    let axisOptions: { value: string; label: string }[] = [];
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
      if (discovered && !isGroup) {
        axisOptions = resolveAxes(discovered).map((a) => ({
          value: a.id,
          label: AXIS_LABEL_I18N_KEYS[a.id] ? t(AXIS_LABEL_I18N_KEYS[a.id], this.hass) : a.label,
        }));
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
      // NOTE: rail order/subset (`covers`) is NOT an ha-form field. HA's
      // multi-entity selector is an add/remove list with no reordering, which
      // is the one thing this control exists to do — so it renders as the
      // sortable list in `_renderRailOrder()` instead.
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
        // What the ↑■↓ buttons drive. Each picker appears only when it has a
        // real choice to offer — one cover or one axis means the control can
        // only ever re-select the default.
        ...(managedCount > 1 || this._config?.controls_cover
          ? [{ name: 'controls_cover', selector: coverSelector }]
          : []),
        ...(axisOptions.length > 1 || this._config?.controls_axis
          ? [
              {
                name: 'controls_axis',
                selector: { select: { options: axisOptions, mode: 'dropdown' } },
              },
            ]
          : []),
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
    /* Rail order: a sortable list, because HA's multi-entity selector can add
       and remove but not reorder. */
    .rail-order-title {
      font-weight: 500;
      font-size: 0.88rem;
      color: var(--primary-text-color);
    }
    .rail-order ul {
      list-style: none;
      margin: 6px 0 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .rail-order li.rail {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color, transparent);
      cursor: grab;
    }
    .rail-order li.rail.dragging {
      opacity: 0.5;
      cursor: grabbing;
    }
    .rail-order li.rail.hidden-rail .rail-name {
      opacity: 0.45;
      text-decoration: line-through;
    }
    .rail-order .grip {
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color);
      flex: 0 0 auto;
    }
    .rail-order .rail-name {
      flex: 1 1 auto;
      min-width: 0;
      font-size: 0.88rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /* The member row's name field stands in for .rail-name, so it takes the
       same flex slot. Borderless until hovered/focused so the list reads as a
       list rather than as a stack of form fields. */
    .rail-order .member-name {
      flex: 1 1 auto;
      min-width: 0;
      font: inherit;
      font-size: 0.88rem;
      color: var(--primary-text-color);
      background: transparent;
      border: 1px solid transparent;
      border-radius: 4px;
      padding: 3px 6px;
    }
    .rail-order .member-name::placeholder {
      color: var(--secondary-text-color);
      opacity: 1;
    }
    .rail-order .member-name:hover {
      border-color: var(--divider-color);
    }
    .rail-order .member-name:focus {
      outline: none;
      border-color: var(--primary-color);
    }
    .rail-order li.rail.hidden-rail .member-name {
      opacity: 0.45;
      text-decoration: line-through;
    }
    /* A text field inside a draggable row swallows click-to-place-caret on some
       browsers unless the row's grab cursor yields to it. */
    .rail-order li.member-row .member-name {
      cursor: text;
    }
    .rail-order .rail-btn {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .rail-order .rail-btn:hover:not(:disabled) {
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
    }
    .rail-order .rail-btn:disabled {
      opacity: 0.3;
      cursor: default;
    }
    .rail-order .rail-btn ha-icon {
      --mdc-icon-size: 18px;
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
