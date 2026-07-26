import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import type { DiscoveredEntities } from '../types';
import { memberBadgeWinners } from '../lib/badge-visibility';
import { formatPercent } from '../lib/formatters';
import { coverStateColor } from '../lib/icons';
import {
  groupIcon,
  readGroup,
  setGroupPosition,
  setGroupTilt,
  stopGroup,
  type GroupSnapshot,
} from '../lib/group-controls';
import { t } from '../lib/i18n';
import { tooltip } from '../lib/tooltip';

import './cover-move-buttons';
import './group-controls-row';
import './tilt-bar';
import './tile-badge';

/**
 * Cover Group tile variant (issue #185). The registered tile card delegates to
 * this when `discovered.is_group` is true; a cover entry never reaches here.
 *
 * The control surface mirrors the cover tile's: a member-derived glyph carrying
 * the aggregate state color, the name/state label, the ↑■↓ row, a drag-to-set
 * position slider and an optional tilt track — plus the group-only control row.
 * Every read and write goes through `lib/group-controls`, and the ↑■↓ row and
 * control row are shared elements, so this surface cannot drift from the dialog
 * or the main-card view.
 *
 * Tapping the body emits `acp-open-more-info`; the host card turns that into the
 * configured tap action.
 */
@customElement('acp-group-tile')
export class GroupTile extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered!: DiscoveredEntities;
  /** Card config `show_controls` — hides the ↑■↓ row. */
  @property({ type: Boolean }) public showControls = true;
  /** Card config `show_position_bar` — hides the aggregate drag slider. */
  @property({ type: Boolean }) public showPositionBar = true;
  /** Card config `show_tilt` — hides the group tilt track (which only renders
   *  for an all-tilt roster with the aggregate cover enabled). */
  @property({ type: Boolean }) public showTilt = true;
  @property({ type: Boolean }) public showSceneSelect = true;
  @property({ type: Boolean }) public showLock = true;
  @property({ type: Boolean }) public showAutomation = true;
  @property({ type: Boolean }) public showClearOverrides = true;
  /** Card config `show_member_badges` — the member-override rollup. */
  @property({ type: Boolean }) public showMemberBadges = true;
  /** Card config `state_color` — tint the glyph by the aggregate state. */
  @property({ type: Boolean }) public stateColor = true;
  /** Card config `name` — overrides the discovered entry title. */
  @property({ attribute: false }) public name?: string;
  /** Card config `icon` — overrides the member-derived glyph. */
  @property({ attribute: false }) public icon?: string;

  /** Live percentage while a slider drag is in flight; null when idle. Drives
   *  the fill + readout so the bar tracks the finger instead of waiting on the
   *  server round-trip (mirrors the cover tile's `_posDrag`). */
  @state() private _posDrag: number | null = null;

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.discovered) return nothing;
    const s = readGroup(this.hass, this.discovered);

    const stateText = t(`group.state_${s.aggregate}`, this.hass);
    const shownPosition = this._posDrag ?? s.position;
    const iconColor = this.stateColor ? coverStateColor(s.aggregate) : '';
    const controllable = !!s.target;
    const badgeWinners = this.showMemberBadges ? memberBadgeWinners(s.memberWinners) : [];

    return html`
      <div
        class="group-tile"
        role="button"
        tabindex="0"
        @click=${this._openMoreInfo}
        @keydown=${this._onBodyKeydown}
      >
        <div class="cover-icon-wrap">
          <ha-icon
            class="cover-icon"
            icon=${this.icon ?? groupIcon(s, shownPosition)}
            style=${iconColor ? `color: ${iconColor}` : ''}
          ></ha-icon>
        </div>

        <div class="label">
          <div class="title">${this.name ?? this.discovered.entry_title}</div>
          <div class="state">${stateText} · ${formatPercent(shownPosition)}</div>
        </div>

        ${this.showControls
          ? html`<div
              class="controls"
              @click=${this._stop}
              @pointerdown=${this._stop}
              @keydown=${this._stop}
            >
              <acp-cover-move-buttons
                labels="group"
                .hass=${this.hass}
                .position=${s.position}
                .deviceClass=${s.deviceClass}
                .enabled=${controllable}
                @acp-move=${(e: CustomEvent<'open' | 'stop' | 'close'>) => this._move(e, s)}
              ></acp-cover-move-buttons>
            </div>`
          : nothing}

        <div class="chrome-line">
          ${Number.isNaN(s.whoWonCount)
            ? nothing
            : html`<acp-tile-badge
                .hass=${this.hass}
                kind-override="group"
                .groupCount=${s.whoWonCount}
                .groupTotal=${s.rosterTotal}
              ></acp-tile-badge>`}
          ${badgeWinners.map(
            (w) => html`<acp-tile-badge .hass=${this.hass} .winner=${w}></acp-tile-badge>`,
          )}
          ${this.showPositionBar
            ? html`<div
                class="pos-slider${this._posDrag !== null ? ' dragging' : ''}${controllable
                  ? ''
                  : ' disabled'}"
                role="slider"
                tabindex=${controllable ? 0 : -1}
                aria-disabled=${controllable ? 'false' : 'true'}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow=${shownPosition ?? 0}
                aria-valuetext=${formatPercent(shownPosition)}
                aria-label=${t('group.position_slider_label', this.hass)}
                ${tooltip(t('covers.click_to_set', this.hass))}
                @click=${(e: MouseEvent) => this._onPosClick(e, s)}
                @pointerdown=${(e: PointerEvent) => this._onPosPointerDown(e, controllable)}
                @pointermove=${this._onPosPointerMove}
                @pointerup=${this._onPosPointerEnd}
                @pointercancel=${this._onPosPointerEnd}
                @keydown=${(e: KeyboardEvent) => this._onPosKeydown(e, s)}
              >
                <div class="pos-bar">
                  <div
                    class="pos-fill"
                    style=${`width:${shownPosition ?? 0}%;background:${iconColor || 'var(--primary-color)'}`}
                  ></div>
                </div>
              </div>`
            : nothing}
        </div>

        ${this.showTilt && s.tilt
          ? html`<div
              class="tilt-line"
              @click=${this._stop}
              @pointerdown=${this._stop}
              @keydown=${this._stop}
            >
              <acp-axis-bar
                layout="tile"
                .hass=${this.hass}
                .label=${t('covers.tilt_title', this.hass)}
                .actual=${s.tilt.value}
                @acp-tilt-set=${(e: CustomEvent<number>) => setGroupTilt(this.hass, s, e.detail)}
              ></acp-axis-bar>
            </div>`
          : nothing}

        <acp-group-controls-row
          .hass=${this.hass}
          .discovered=${this.discovered}
          .snapshot=${s}
          .showSceneSelect=${this.showSceneSelect}
          .showLock=${this.showLock}
          .showAutomation=${this.showAutomation}
          .showClearOverrides=${this.showClearOverrides}
        ></acp-group-controls-row>
      </div>
    `;
  }

  private _move(e: CustomEvent<'open' | 'stop' | 'close'>, s: GroupSnapshot): void {
    if (e.detail === 'stop') stopGroup(this.hass, this.discovered, s);
    else setGroupPosition(this.hass, s, e.detail === 'open' ? 100 : 0);
  }

  private _openMoreInfo = (): void => {
    this.dispatchEvent(new CustomEvent('acp-open-more-info', { bubbles: true, composed: true }));
  };

  /* Only the tile body itself activates. Without the target check this handler
     also fires for Enter/Space on every nested control — and its
     `preventDefault()` cancels the button's own activation, so a keyboard user
     tabbing to the lock would open the dialog instead of toggling it. The
     children also stop `keydown`, belt-and-braces. */
  private _onBodyKeydown = (e: KeyboardEvent): void => {
    if (e.target !== e.currentTarget) return;
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    this._openMoreInfo();
  };

  /* Slider gestures mirror the cover tile's: capture the pointer, preview the
     fill locally, and let the trailing compatibility `click` do the commit — so
     no `preventDefault()` on pointerdown. Every handler stops propagation so a
     drag never reads as a tap on the tile body. */
  private _pctFromEvent(e: { clientX: number }, el: HTMLElement): number {
    const rect = el.getBoundingClientRect();
    const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    return Math.max(0, Math.min(100, pct));
  }

  private _onPosPointerDown(e: PointerEvent, controllable: boolean): void {
    e.stopPropagation();
    if (!controllable) return;
    const el = e.currentTarget as HTMLElement;
    (el as HTMLElement & { setPointerCapture?: (id: number) => void }).setPointerCapture?.(
      e.pointerId,
    );
    this._posDrag = this._pctFromEvent(e, el);
  }

  private _onPosPointerMove = (e: PointerEvent): void => {
    if (this._posDrag === null) return;
    e.stopPropagation();
    this._posDrag = this._pctFromEvent(e, e.currentTarget as HTMLElement);
  };

  private _onPosPointerEnd = (e: PointerEvent): void => {
    e.stopPropagation();
    this._posDrag = null;
  };

  private _onPosClick(e: MouseEvent, s: GroupSnapshot): void {
    e.stopPropagation();
    if (!s.target) return;
    setGroupPosition(this.hass, s, this._pctFromEvent(e, e.currentTarget as HTMLElement));
  }

  /** Standard WAI-ARIA slider keys: arrows ±1, Page ±10, Home/End to the ends. */
  private _onPosKeydown(e: KeyboardEvent, s: GroupSnapshot): void {
    const current = s.position ?? 0;
    let next: number;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = current + 1;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = current - 1;
        break;
      case 'PageUp':
        next = current + 10;
        break;
      case 'PageDown':
        next = current - 10;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = 100;
        break;
      default:
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    if (!s.target) return;
    setGroupPosition(this.hass, s, Math.max(0, Math.min(100, next)));
  }

  private _stop(e: Event): void {
    e.stopPropagation();
  }

  public static styles = css`
    :host {
      display: block;
    }
    /* Mirrors the cover tile's detailed grid: the glyph spans the label +
       chrome rows so it stays vertically centered, controls sit right. */
    .group-tile {
      display: grid;
      grid-template-areas:
        'icon label controls'
        'icon chrome chrome'
        'tilt tilt tilt'
        'group group group';
      grid-template-columns: 36px minmax(0, 1fr) auto;
      column-gap: 12px;
      row-gap: 2px;
      align-items: center;
      padding: 6px 4px;
      cursor: pointer;
    }
    .group-tile:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
      border-radius: 8px;
    }
    .cover-icon-wrap {
      grid-area: icon;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
    }
    .cover-icon {
      --mdc-icon-size: 24px;
    }
    .label {
      grid-area: label;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
    }
    /* Same theme tokens HA's ha-tile-info uses, matching the cover tile. */
    .title {
      font-size: var(--ha-font-size-m, 0.875rem);
      font-weight: var(--ha-font-weight-medium, 500);
      line-height: var(--ha-line-height-condensed, 1.375);
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .state {
      font-size: var(--ha-font-size-s, 0.75rem);
      font-weight: var(--ha-font-weight-normal, 400);
      line-height: var(--ha-line-height-condensed, 1.375);
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .controls {
      grid-area: controls;
      align-self: center;
      display: inline-flex;
    }
    .chrome-line {
      grid-area: chrome;
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      /* Reserve the badge pill's height even with no badge, so the row keeps the
         same height either way and the bar centers in it (cover tile parity). */
      min-height: 22px;
      /* The one deliberate divergence from the cover tile's nowrap: a group's
         badge count is unbounded (one per distinct member override), so the row
         wraps rather than crushing the slider. With the usual 0-1 badges the
         layout is identical. */
      flex-wrap: wrap;
    }
    /* Badges hold their intrinsic width so the bar absorbs any shortage. */
    .chrome-line acp-tile-badge {
      overflow: visible;
      flex: 0 0 auto;
    }
    /* Interactive wrapper carries the sizing; the visible rail below stays 6px.
       Geometry is copied from the cover tile's .chrome-line .pos-slider rule so
       a group tile stacked under cover tiles lines its bar up with theirs,
       instead of stretching the full width of the row. */
    .pos-slider {
      margin-left: auto;
      align-self: center;
      position: relative;
      flex: 0 1 170px;
      max-width: 55%;
      cursor: pointer;
      /* A touch-drag must move the fill, not scroll the dashboard. */
      touch-action: none;
    }
    /* The rail is too thin to grab on a phone — widen the hit area vertically
       with an invisible absolute box, which adds no layout height. */
    .pos-slider::before {
      content: '';
      position: absolute;
      inset: -8px 0;
    }
    .pos-slider:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
      border-radius: 6px;
    }
    /* Nothing to drive: match the buttons rather than looking live and no-oping. */
    .pos-slider.disabled {
      cursor: default;
      opacity: 0.4;
      touch-action: auto;
    }
    .pos-bar {
      position: relative;
      width: 100%;
      height: 6px;
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      overflow: hidden;
    }
    .pos-fill {
      position: absolute;
      inset: 0 auto 0 0;
      opacity: 0.55;
      border-radius: 6px;
      transition: width 0.3s ease;
    }
    /* The ease above smooths server-driven updates; mid-drag it reads as lag. */
    .pos-slider.dragging .pos-fill {
      transition: none;
    }
    .tilt-line {
      grid-area: tilt;
      min-width: 0;
      cursor: default;
    }
    acp-group-controls-row {
      grid-area: group;
      margin-top: 4px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'acp-group-tile': GroupTile;
  }
}
