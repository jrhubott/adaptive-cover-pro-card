import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';
import type { HomeAssistant } from 'custom-card-helpers';

import { TILE_CARD_NAME } from '../const';
import { setGroupMemberAxis, stopGroupMember, supportsTilt } from '../lib/services';
import { resolveCoverEntryId } from '../lib/entity-suggestion';
import { getCachedRegistry } from '../lib/registry-store';
import type { EntityRegistryEntry } from '../lib/entity-registry';
import { isOffline } from '../lib/formatters';
import type { AdaptiveCoverProTileCardConfig } from '../types';
import { t } from '../lib/i18n';
import { tooltip } from '../lib/tooltip';

import './cover-move-buttons';
import './tilt-bar';
import './tile-badge';

/** A tile card instance driven imperatively — `setConfig` is a method, not a
 *  property, so the element is built in JS and handed to Lit as a DOM node. */
interface TileCardElement extends HTMLElement {
  hass: HomeAssistant;
  setConfig(config: AdaptiveCoverProTileCardConfig): void;
}

/**
 * Every event a tile card's own subtree emits. All of them are already handled
 * *inside* that card — its more-info dialog, extend dialog, badge, and axis bars
 * all sit in its shadow root, and those listeners fire first — but each is
 * dispatched `composed: true`, so it keeps crossing shadow boundaries afterwards.
 *
 * Unconstrained, a member tile's `acp-dialog-close` therefore bubbles out of the
 * roster, through `<acp-group-dialog>`, and into the group tile card's own
 * `@acp-dialog-close` listener — closing the group dialog the moment the user
 * dismisses a *member's* dialog, so there is nothing to return to. Nesting whole
 * cards means owning their event boundary; that is what {@link _tileCard} does
 * with this list.
 *
 * Keep it in step with the events the tile card subtree dispatches.
 */
const CONTAINED_TILE_EVENTS = [
  'acp-dialog-close',
  'acp-tile-tap',
  'acp-open-more-info',
  'acp-resume',
  'acp-extend',
  'acp-extend-confirm',
  'acp-extend-close',
  'acp-tilt-set',
] as const;

/**
 * One Cover Group member. Shared by the group dialog (opened from the tile) and
 * the main-card group view, so the two rosters cannot drift.
 *
 * **A member that has its own ACP entry renders as that entry's real tile card**
 * — the same element the user has on their dashboard, so badges, state coloring,
 * icons, the ↑■↓ row, the position slider, and tap-for-more-info are identical
 * by construction rather than by imitation. The roster is literally a stack of
 * tile cards.
 *
 * A **generic** member (a plain cover the group drives, with no ACP pipeline)
 * has no entry to point a tile card at, so it falls back to the compact row
 * below: name, position track, optional tilt track, and the ↑■↓ triple. Tracks
 * reuse `acp-axis-bar`, which owns the drag/keyboard/ARIA slider contract.
 *
 * Fallback writes route through {@link setGroupMemberAxis} /
 * {@link stopGroupMember}; on the tile-card path the tile owns its own writes.
 */
/** Stable per-array identity for the registry cache, so the resolve memo can
 *  tell "same registry" from "registry changed" without deep comparison. */
let _idSeq = 0;
const _ids = new WeakMap<object, number>();
function registryIdentity(registry: EntityRegistryEntry[]): number {
  let id = _ids.get(registry);
  if (id === undefined) {
    id = ++_idSeq;
    _ids.set(registry, id);
  }
  return id;
}

@customElement('acp-group-member-row')
export class GroupMemberRow extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public entityId!: string;
  /** Live position from the group's `member_positions`, null when unknown. */
  @property({ attribute: false }) public position: number | null = null;
  /** Winning handler for an ACP member; null/undefined for a generic cover. */
  @property({ attribute: false }) public winner: string | null | undefined = null;
  /** True when this member appears in the group's `member_winners` — i.e. it has
   *  an ACP pipeline, so its moves must engage its own manual override. */
  @property({ type: Boolean }) public acpManaged = false;
  /** Host-level opt-out for the tilt track (the card's `show_tilt`). */
  @property({ type: Boolean }) public showTilt = true;
  @property({ type: Boolean, reflect: true }) public compact = false;

  /** This member's own ACP config entry, once the registry cache is warm.
   *  Null means "no ACP entry" (generic member) or "not resolved yet". */
  @state() private _entryId: string | null = null;

  /** The member's tile card, built once and reused. Rebuilding it every render
   *  would restart its registry warm-up and drop any open more-info dialog. */
  private _tile: TileCardElement | null = null;
  private _tileKey: string | null = null;

  /** Memo key for the resolve scan: `entityId` + the identity of the registry
   *  array it was resolved against. Keeps the O(states) scan to once per member
   *  instead of once per hass tick, while still re-resolving when the registry
   *  changes — which is what happens when a member's own ACP entry loads, or a
   *  user creates one for a cover that was previously a generic member. Keying
   *  on registry *warmth* instead (the first attempt at this) pinned such a
   *  member to the generic fallback row permanently. */
  private _resolveKey: string | null = null;

  protected willUpdate(changed: PropertyValues): void {
    if (!this.hass || !this.entityId) return;
    // A roster row may be reused for a DIFFERENT member (Lit reuses elements
    // positionally). Carrying `_entryId` across would render the previous
    // member's entry pinned to this cover — its badges and decision state for a
    // cover it doesn't manage, and `set_axes` aimed at a cover with no ACP
    // pipeline. Reset hard, then re-resolve.
    if (changed.has('entityId')) {
      this._entryId = null;
      this._tile = null;
      this._tileKey = null;
      this._resolveKey = null;
    }
    const registry = getCachedRegistry();
    // A cold registry cannot resolve anything (`resolveCoverEntryId` short-
    // circuits), so leave the key unset and retry next tick — that path is O(1).
    if (!registry) return;
    const key = `${this.entityId}|${registryIdentity(registry)}`;
    if (this._resolveKey === key) return;
    this._resolveKey = key;
    const resolved = resolveCoverEntryId(this.hass, this.entityId);
    // Never clear a resolved entry on a transient miss — that would tear down a
    // live tile card. A genuine member change resets it above instead.
    if (resolved) this._entryId = resolved;
  }

  /* HA never sets `hass` on an imperatively-created card, so the nested tile is
     fed here on every update — not only when `render()` happens to rebuild it. */
  protected updated(): void {
    if (this._tile && this.hass) this._tile.hass = this.hass;
  }

  /** The member's tile card element, created on first use and cached. Returns
   *  null when the tile card isn't registered (it always is in the shipped
   *  bundle — this keeps the roster from throwing if that ever changes). */
  private _tileCard(entryId: string): TileCardElement | null {
    const key = `${entryId}|${this.entityId}|${this.showTilt}`;
    if (this._tile && this._tileKey === key) {
      this._tile.hass = this.hass;
      return this._tile;
    }
    if (!customElements.get(TILE_CARD_NAME)) return null;
    const el = document.createElement(TILE_CARD_NAME) as TileCardElement;
    el.setConfig({
      type: `custom:${TILE_CARD_NAME}`,
      entry_id: entryId,
      // Pin the tile to THIS member. An entry can manage several covers and the
      // tile otherwise defaults to `managed_covers[0]`, which would render the
      // same cover for every row of a multi-cover entry.
      cover: this.entityId,
      show_tilt: this.showTilt,
    });
    // Event boundary — see CONTAINED_TILE_EVENTS. Attached on the card element
    // itself, so the card's own inner listeners (deeper in its shadow tree) have
    // already run by the time propagation is stopped here.
    for (const name of CONTAINED_TILE_EVENTS) {
      el.addEventListener(name, (ev: Event) => ev.stopPropagation());
    }
    el.hass = this.hass;
    this._tile = el;
    this._tileKey = key;
    return el;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.entityId) return nothing;
    if (this._entryId) {
      const tile = this._tileCard(this._entryId);
      if (tile) return html`<div class="tile-host">${tile}</div>`;
    }
    return this._fallbackRow();
  }

  /** Generic member (no ACP entry to point a tile card at). */
  private _fallbackRow(): TemplateResult {
    const state = this.hass.states[this.entityId];
    const friendly = (state?.attributes?.friendly_name as string | undefined) ?? this.entityId;
    const offline = isOffline(state?.state);
    const tilt = this.showTilt && supportsTilt(this.hass, this.entityId);
    const liveTilt = tilt
      ? ((state?.attributes?.current_tilt_position as number | undefined) ?? null)
      : null;

    return html`
      <div class="member ${offline ? 'unavailable' : ''}">
        <div class="head">
          <div class="name" ${tooltip(this.entityId)}>${friendly}</div>
          ${
            this.winner
              ? html`<acp-tile-badge .hass=${this.hass} .winner=${this.winner}></acp-tile-badge>`
              : nothing
          }
        </div>
        <div class="body">
          <div class="tracks">
            <acp-axis-bar
              layout="cover"
              .hass=${this.hass}
              .label=${t('group.position', this.hass)}
              .hintKey=${'covers.click_to_set'}
              .targetHintKey=${'covers.target_tooltip'}
              .actual=${this.position}
              .disabled=${offline}
              .compact=${this.compact}
              @acp-tilt-set=${(e: CustomEvent<number>) => this._set('position', e.detail)}
            ></acp-axis-bar>
            ${
              tilt
                ? html`<acp-axis-bar
                    layout="cover"
                    .hass=${this.hass}
                    .label=${t('covers.tilt_title', this.hass)}
                    .actual=${liveTilt}
                    .disabled=${offline}
                    .compact=${this.compact}
                    @acp-tilt-set=${(e: CustomEvent<number>) => this._set('tilt', e.detail)}
                  ></acp-axis-bar>`
                : nothing
            }
          </div>
          <acp-cover-move-buttons
            compact
            labels="tile"
            .hass=${this.hass}
            .position=${this.position}
            .deviceClass=${state?.attributes?.device_class as string | undefined}
            .enabled=${!offline}
            @acp-move=${this._onMove}
          ></acp-cover-move-buttons>
          </div>
        </div>
      </div>
    `;
  }

  private _set(axisId: 'position' | 'tilt', value: number): void {
    setGroupMemberAxis(this.hass, this.entityId, axisId, value, this.acpManaged);
  }

  private _onMove = (e: CustomEvent<'open' | 'stop' | 'close'>): void => {
    if (e.detail === 'stop') stopGroupMember(this.hass, this.entityId, this.acpManaged);
    else this._set('position', e.detail === 'open' ? 100 : 0);
  };

  public static styles = css`
    :host {
      display: block;
    }
    /* The nested tile brings its own <ha-card> inside its own shadow root, so
       it can only be restyled through the custom properties ha-card reads (they
       inherit across the boundary; a descendant selector would not reach it).
       Drop the elevation and let a hairline carry the separation — otherwise a
       roster reads as a pile of floating cards rather than one surface. */
    .tile-host {
      display: block;
      --ha-card-box-shadow: none;
      --ha-card-border-width: 1px;
      --ha-card-border-color: var(--divider-color, rgba(127, 127, 127, 0.25));
    }
    .member {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .member.unavailable {
      opacity: 0.5;
    }
    .head {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      min-width: 0;
    }
    .name {
      flex: 1 1 auto;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .name[data-tooltip]:hover {
      cursor: help;
    }
    .body {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .tracks {
      flex: 1 1 auto;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    /* A roster repeats this triple per member, so it is deliberately smaller
       than the tile's own ↑■↓ — four members otherwise read as a button wall. */
    .move-buttons {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .move-buttons button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 32px;
      border-radius: 8px;
      border: none;
      background: color-mix(
        in srgb,
        var(--control-button-background-color, var(--disabled-color, #7f7f7f)) 20%,
        transparent
      );
      cursor: pointer;
    }
    .move-buttons button ha-icon {
      --mdc-icon-size: 18px;
      color: var(--primary-text-color);
    }
    .move-buttons button:hover {
      background: color-mix(
        in srgb,
        var(--control-button-background-color, var(--disabled-color, #7f7f7f)) 32%,
        transparent
      );
    }
    .move-buttons button:disabled {
      opacity: 0.4;
      cursor: default;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'acp-group-member-row': GroupMemberRow;
  }
}
