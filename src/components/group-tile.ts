import { LitElement, html, css, nothing, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import type { DiscoveredEntities } from '../types';
import { memberBadgeWinners } from '../lib/badge-visibility';
import { axisDisplayValue, positionAxisFor } from '../lib/axes';
import { memberSpread } from '../lib/group-spread';
import { formatPercent } from '../lib/formatters';
import { coverStateColor, COVER_ACTIVE_COLOR } from '../lib/icons';
import {
  groupIcon,
  memberException,
  readGroup,
  restrictSnapshot,
  setGroupPosition,
  setGroupTilt,
  stopGroup,
  type GroupSnapshot,
} from '../lib/group-controls';
import { hiddenMemberCovers } from '../lib/group-roster';
import { PendingMoves, isPendingVisible } from '../lib/pending-move';
import { RailGestures } from '../lib/rail-gestures';
import { renderRailOverlay, railOverlayStyles } from './rail-overlay';
import { renderRailFill, railFillStyles } from './rail-fill';
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
  @property({ type: Boolean }) public showClimate = false;
  @property({ type: Boolean }) public showClearOverrides = true;
  /** Card config `show_member_badges` — the member-override rollup. */
  @property({ type: Boolean }) public showMemberBadges = true;
  /** Card config `state_color` — tint the glyph by the aggregate state. */
  @property({ type: Boolean }) public stateColor = true;
  /** True when `icon_tap_action` names a real action. Gives the glyph its own
   *  tap target and, exactly as in HA, turns on the tinted pill behind it. The
   *  host owns the action itself — this element only emits `acp-icon-action`. */
  @property({ type: Boolean }) public iconInteractive = false;
  /** Card config `name` — overrides the discovered entry title. */
  @property({ attribute: false }) public name?: string;
  /** Card config `icon` — overrides the member-derived glyph. */
  @property({ attribute: false }) public icon?: string;
  /** Card `members` — the roster subset this card shows. The tile renders no
   *  roster itself, but every number on it (state line, N/M badge, spread bar,
   *  percentage) is derived from one, so a member hidden here has to be
   *  excluded from those too or the tile describes covers the card does not
   *  show. */
  @property({ attribute: false }) public members?: string[];

  /** How far the pointer must travel before the gesture counts as a deliberate
   *  drag. A group write is not like a cover write: `group_set_position` flattens
   *  EVERY member onto one value and takes them off their own solar targets, so
   *  a stray tap while reaching for the tile must not commit it. Below this it is
   *  a tap, and a tap on a group rail now does nothing at all. */
  private static readonly DRAG_THRESHOLD_PX = 4;

  /** The shared drag-to-set contract — see `lib/rail-gestures.ts`. Alone among
   *  the four rails this one commits on RELEASE and only past a movement
   *  threshold; see {@link GroupTile.DRAG_THRESHOLD_PX} for why. One track per
   *  tile, so the key is a constant. */
  private _rail = new RailGestures(this, {
    commitOn: 'release',
    dragThresholdPx: GroupTile.DRAG_THRESHOLD_PX,
  });
  private static readonly RAIL_KEY = 'group';

  /** Where the group was last told to go, until it gets there — see
   *  `lib/pending-move.ts`. A single key: a group write flattens every member
   *  onto the same position, so there is only ever one destination. */
  private _pending = new PendingMoves(this);
  private static readonly PENDING_KEY = 'group';

  protected override updated(): void {
    if (!this.hass || !this.discovered) return;
    // Arrival is judged on the AGGREGATE, which is what this rail draws and what
    // the write drove every member to.
    this._pending.settle(() => this._snapshot().position);
  }

  /** The group as this card shows it: the integration's snapshot with any
   *  member the card hides removed, and every scalar recomputed over what is
   *  left. `members` is a cover-id list, so this needs no roster and no
   *  registry — the tile renders no roster of its own. */
  private _snapshot(): GroupSnapshot {
    const raw = readGroup(this.hass, this.discovered);
    if (!this.members?.length) return raw;
    return restrictSnapshot(
      this.hass,
      raw,
      hiddenMemberCovers(Object.keys(raw.memberPositions), this.members),
    );
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.discovered) return nothing;
    const s = this._snapshot();

    const stateText = t(`group.state_${s.aggregate}`, this.hass);
    const drag = this._rail.preview(GroupTile.RAIL_KEY);
    const shownPosition = drag ?? s.position;
    // Rail polarity, same source as every other position surface. A group
    // publishes no axes of its own (GroupPolicy.axes is empty), so this is
    // the synthesized fallback — mirrored unless the entry is an awning.
    const posAxis = positionAxisFor(this.discovered);
    const shownFill = shownPosition === null ? 0 : axisDisplayValue(shownPosition, posAxis);
    const iconColor = this.stateColor ? coverStateColor(s.aggregate) : '';
    const controllable = !!s.target;
    // Where the members ACTUALLY are, versus the mean the sensor publishes.
    const spread = memberSpread(s.memberPositions, posAxis);
    // Mid-drag the rail previews a SINGLE value, deliberately: the drag is about
    // to flatten every member onto it, and collapsing the spread as the finger
    // moves is the clearest possible statement of that.
    const dragging = this._rail.isDragging(GroupTile.RAIL_KEY);
    // A pending group move collapses the spread for the same reason a drag does:
    // the write flattens every member onto one value, so the disagreement the
    // band describes is about to stop existing. Suppressed mid-drag — the drag
    // preview is already answering this question.
    const commanded = dragging ? null : this._pending.get(GroupTile.PENDING_KEY);
    // See `acp-axis-bar`: a destination the group is already at never settles.
    const pending = isPendingVisible(s.position, commanded) ? commanded : null;
    const pendingFill = pending === null ? null : axisDisplayValue(pending, posAxis);
    // Second line: what the covers are ACTUALLY at, or the one thing that is
    // wrong with them.
    //
    // Not the driven count it replaced ("0 of 5 driven"): a group drives members
    // only while a scene or the lock is active, so that read "0 of N" nearly
    // always — a near-constant occupying the tile's only free line, and one the
    // N/M badge beside it already stated.
    //
    // Range beats the aggregate percentage for the same reason the spread bar
    // does: the sensor publishes a mean, and a mean of 40/40/40/0/0 is 24, which
    // describes none of them. Shown in the LOGICAL frame — these are readouts,
    // and every other readout in the card reports what the cover reports.
    const exception = memberException(this.hass, s);
    const stateDetail = dragging
      ? formatPercent(shownPosition)
      : exception
        ? t(`group.exception_${exception.kind}`, this.hass, { count: exception.count })
        : spread
          ? spread.aligned
            ? formatPercent(spread.logicalMin)
            : t('group.range', this.hass, {
                min: Math.round(spread.logicalMin),
                max: Math.round(spread.logicalMax),
              })
          : formatPercent(shownPosition);
    const badgeWinners = this.showMemberBadges ? memberBadgeWinners(s.memberWinners) : [];

    return html`
      <div
        class=${`group-tile${this.showControls ? ' has-controls' : ''}`}
        role="button"
        tabindex="0"
        @click=${this._openMoreInfo}
        @keydown=${this._onBodyKeydown}
      >
        <div
          class=${`cover-icon-wrap${this.iconInteractive ? ' background' : ''}`}
          role=${this.iconInteractive ? 'button' : nothing}
          tabindex=${this.iconInteractive ? 0 : nothing}
          aria-label=${this.iconInteractive ? t('tile.icon_action_label', this.hass) : nothing}
          style=${iconColor ? `--acp-tile-icon-color: ${iconColor}` : nothing}
          @click=${this._onIconClick}
          @keydown=${this._onIconKeydown}
        >
          <ha-icon
            class="cover-icon"
            icon=${this.icon ?? groupIcon(s, shownPosition)}
            style=${iconColor ? `color: ${iconColor}` : ''}
          ></ha-icon>
        </div>

        <div class="label">
          <div class="title">${this.name ?? this.discovered.entry_title}</div>
          <div class="state">${stateText} · ${stateDetail}</div>
        </div>

        ${this.showControls
          ? html`<div
              class="controls"
              @click=${this._stop}
              @pointerdown=${this._stop}
              @keydown=${this._stop}
            >
              <acp-cover-move-buttons
                fill
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
                class="pos-slider${dragging ? ' dragging' : ''}${controllable ? '' : ' disabled'}"
                role="slider"
                tabindex=${controllable ? 0 : -1}
                aria-disabled=${controllable ? 'false' : 'true'}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow=${spread && !dragging ? spread.min : shownFill}
                aria-valuetext=${spread && !spread.aligned && !dragging
                  ? // LOGICAL, like every other readout. `min`/`max` are coverage
                    // coordinates for drawing and are mirrored on a blind, so
                    // reading them out told a screen-reader user 60-100% while the
                    // screen said 0-40%.
                    t('group.spread_value', this.hass, {
                      min: Math.round(spread.logicalMin),
                      max: Math.round(spread.logicalMax),
                      count: spread.readable,
                    })
                  : t('covers.position_open_value', this.hass, {
                      pct: formatPercent(shownPosition),
                    })}
                aria-label=${t('group.position_slider_label', this.hass)}
                ${tooltip(t('group.drag_to_set_all', this.hass, { count: s.rosterTotal }))}
                @click=${this._stop}
                @pointerdown=${(e: PointerEvent) => this._onPosPointerDown(e, controllable)}
                @pointermove=${this._onPosPointerMove}
                @pointerup=${(e: PointerEvent) => this._onPosPointerEnd(e, s)}
                @pointercancel=${this._onPosCancel}
                @keydown=${(e: KeyboardEvent) => this._onPosKeydown(e, s)}
              >
                <div class="pos-bar">
                  ${dragging || pending !== null || !spread
                    ? // A group write has no single target — no marker.
                      renderRailFill({
                        fillPct: shownFill,
                        target: null,
                        targetPct: 0,
                        prefix: 'pos-',
                      })
                    : html`
                        <!-- Solid to the LEAST-covered member: the coverage every
                             member has reached. Band on top spans to the most-
                             covered one, so the gap between them IS the disagreement
                             the word "Mixed" was gesturing at. -->
                        <div class="pos-fill" style=${`width:${spread.min}%`}></div>
                        ${spread.aligned
                          ? nothing
                          : html`<div
                              class="pos-band"
                              style=${`left:${spread.min}%;width:${spread.max - spread.min}%`}
                            ></div>`}
                        ${spread.ticks.map(
                          (v) =>
                            html`<div
                              class="pos-tick"
                              style=${`left:clamp(1px, ${v}%, calc(100% - 1px))`}
                            ></div>`,
                        )}
                      `}
                  ${pending !== null && pendingFill !== null
                    ? renderRailOverlay({
                        hass: this.hass,
                        liveFrac: shownFill,
                        pendingFrac: pendingFill,
                        pending,
                        prefix: 'pos-',
                      })
                    : nothing}
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
                .openBlocksSun=${false}
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
          .showClimate=${this.showClimate}
          .showClearOverrides=${this.showClearOverrides}
        ></acp-group-controls-row>
      </div>
    `;
  }

  private _move(e: CustomEvent<'open' | 'stop' | 'close'>, s: GroupSnapshot): void {
    if (e.detail === 'stop') {
      // Stop cancels the destination rather than becoming one: wherever the
      // group ends up IS the new position, so an indicator pointing anywhere
      // else would be a promise the group just abandoned.
      this._pending.clear(GroupTile.PENDING_KEY);
      stopGroup(this.hass, this.discovered, s);
      return;
    }
    const value = e.detail === 'open' ? 100 : 0;
    this._pending.start(GroupTile.PENDING_KEY, value);
    setGroupPosition(this.hass, s, value);
  }

  private _openMoreInfo = (): void => {
    this.dispatchEvent(new CustomEvent('acp-open-more-info', { bubbles: true, composed: true }));
  };

  /** The glyph is its own tap target when interactive. Stopping propagation is
   *  what keeps it from also opening the group dialog via the body handler. */
  private _onIconClick = (e: Event): void => {
    if (!this.iconInteractive) return;
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('acp-icon-action', { bubbles: true, composed: true }));
  };

  private _onIconKeydown = (e: KeyboardEvent): void => {
    if (!this.iconInteractive) return;
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    this._onIconClick(e);
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

  /* Slider gesture adapters. The gesture itself lives in `RailGestures`; what
     stays here is this rail's own policy — the `controllable` gate, and the
     `stopPropagation()` on every handler that keeps a drag from reading as a
     tap on the tile body. No `preventDefault()` on pointerdown.

     The axis is resolved at EVENT time rather than held: it is derived from
     `discovered`, which is a reactive property. */
  private _onPosPointerDown(e: PointerEvent, controllable: boolean): void {
    e.stopPropagation();
    if (!controllable) return;
    // Deliberately no preview on contact — the controller's drag threshold sees
    // to that. Previewing here showed a committed-looking flatten for a tap that
    // does nothing: the spread collapsed and the state line changed, then both
    // sprang back on release.
    this._rail.pointerDown(e, GroupTile.RAIL_KEY, positionAxisFor(this.discovered));
  }

  private _onPosPointerMove = (e: PointerEvent): void => {
    if (!this._rail.isActive(GroupTile.RAIL_KEY)) return;
    e.stopPropagation();
    this._rail.pointerMove(e, GroupTile.RAIL_KEY, positionAxisFor(this.discovered));
  };

  /** Commit on release, and ONLY when the gesture actually travelled. The commit
   *  moved here from the trailing `click` precisely so a tap can be distinguished
   *  from a drag — `click` fires for both and cannot tell them apart, which is
   *  why `@click` on this rail does nothing but stop propagation. */
  private _onPosPointerEnd = (e: PointerEvent, s: GroupSnapshot): void => {
    e.stopPropagation();
    const value = this._rail.pointerUp(GroupTile.RAIL_KEY);
    if (value === null || !s.target) return;
    this._pending.start(GroupTile.PENDING_KEY, value);
    setGroupPosition(this.hass, s, value);
  };

  private _onPosCancel = (e: PointerEvent): void => {
    e.stopPropagation();
    this._rail.pointerCancel(GroupTile.RAIL_KEY);
  };

  /** Standard WAI-ARIA slider keys: arrows ±1, Page ±10, Home/End to the ends. */
  private _onPosKeydown(e: KeyboardEvent, s: GroupSnapshot): void {
    // Stepped in the DRAWN direction so an arrow key moves the fill the way it
    // points, then converted back at the commit — same contract as the cover
    // tile's rails and the axis bars.
    const posAxis = positionAxisFor(this.discovered);
    // With no aggregate reading the rail draws EMPTY (line ~83), so stepping
    // starts from the empty end. Using 0 meant the mirrored axis started from
    // the FULL end, and one rightward key redrew an empty rail as completely
    // full — the same defect fixed in acp-axis-bar.
    // Never the aggregate mean: on a 40/40/40/0/0 roster that is 24, a value no
    // member holds and which appears nowhere on the tile, so one arrow press
    // flattened all five onto 25. Step from the drawn MINIMUM instead — the
    // solid part of the rail, the coverage every member has actually reached.
    const spread = memberSpread(s.memberPositions, posAxis);
    const current =
      spread?.min ?? (s.position === null ? 0 : axisDisplayValue(s.position, posAxis));
    // `current` is DRAWN; the controller speaks logical values in both
    // directions, so it goes through `axisDisplayValue` on the way in.
    const value = this._rail.keydownValue(e, axisDisplayValue(current, posAxis), posAxis);
    if (value === null) return;
    e.stopPropagation();
    if (!s.target) return;
    this._pending.start(GroupTile.PENDING_KEY, value);
    setGroupPosition(this.hass, s, value);
  }

  private _stop(e: Event): void {
    e.stopPropagation();
  }

  public static styles = [
    railOverlayStyles,
    railFillStyles,
    css`
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
        /* HA's ha-tile-container .content: 10px gap, 56px row floor. */
        column-gap: 10px;
        min-height: var(--row-height, 56px);
        row-gap: 2px;
        align-items: center;
        padding: 6px 4px;
        cursor: pointer;
      }
      /* Same 50% controls track as the cover tile's detailed grid — HA's inline
       features block is half the card. Gated so a show_controls: false tile
       doesn't reserve half its width for an empty area. */
      .group-tile.has-controls {
        grid-template-columns: 36px minmax(0, 1fr) calc(50% - 12px);
      }
      /* Unlike the cover tile this element has no reflow that moves the controls
       onto their own row, so the 50% track would keep squeezing the name all
       the way down. Below the cover tile's own narrow threshold, hand the track
       back to content and square the buttons off — flex-filling a content-sized
       track collapses them to the glyph width. The container is the host card's
       ha-card (container-type: inline-size); container queries resolve across
       the shadow boundary. */
      @container (max-width: 340px) {
        .group-tile.has-controls {
          grid-template-columns: 36px minmax(0, 1fr) auto;
        }
        acp-cover-move-buttons {
          --acp-move-button-flex: 0 0 auto;
          --acp-move-button-width: var(--control-button-group-thickness, 36px);
        }
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
      /* HA's ha-tile-icon shape, opt-in via icon_tap_action — see the matching
       rule on the cover tile for the upstream trail. */
      .cover-icon-wrap.background {
        position: relative;
        border-radius: var(--ha-border-radius-pill, 9999px);
        overflow: hidden;
        cursor: pointer;
      }
      .cover-icon-wrap.background::before {
        content: '';
        position: absolute;
        inset: 0;
        background-color: var(--acp-tile-icon-color, var(--disabled-color, #7f7f7f));
        opacity: 0.2;
        transition: opacity 180ms ease-in-out;
      }
      .cover-icon-wrap.background:hover::before {
        opacity: 0.35;
      }
      .cover-icon-wrap.background:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px var(--acp-tile-icon-color, var(--primary-text-color));
      }
      .cover-icon-wrap.background .cover-icon {
        position: relative;
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
      }
      /* Same theme tokens HA's ha-tile-info uses, matching the cover tile — see
       that rule for why the two lines take different line-heights. */
      .title {
        font-size: var(--ha-font-size-m, 0.875rem);
        font-weight: var(--ha-font-weight-medium, 500);
        line-height: var(--ha-line-height-normal, 1.6);
        letter-spacing: 0.1px;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .state {
        font-size: var(--ha-font-size-s, 0.75rem);
        font-weight: var(--ha-font-weight-normal, 400);
        line-height: var(--ha-line-height-condensed, 1.2);
        letter-spacing: 0.4px;
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
      /* Disagreement band: from the least-covered member to the most-covered one.
       Same hue as the fill at a lower opacity, so it reads as "some of them are
       also this far" rather than as a second measurement. Zero-width when the
       members agree, which is why it isn't rendered at all in that case. */
      .pos-band {
        position: absolute;
        top: 0;
        bottom: 0;
        background: var(--acp-pos-fill-color, ${unsafeCSS(COVER_ACTIVE_COLOR)});
        opacity: 0.22;
        transition:
          left 0.3s ease,
          width 0.3s ease;
      }
      /* One tick per DISTINCT member value. Two clusters of covers draw two ticks,
       which is the whole point: "Mixed" stops being a word and becomes a picture
       of where they actually are. Clamped inside the rail (inline) so the 2px box
       survives .pos-bar's overflow:hidden at either extreme, same as the cover
       bar's target marker. */
      .pos-tick {
        position: absolute;
        top: -2px;
        width: 2px;
        height: 10px;
        border-radius: 1px;
        background: var(--acp-pos-fill-color, ${unsafeCSS(COVER_ACTIVE_COLOR)});
        transform: translateX(-50%);
        transition: left 0.3s ease;
      }
      /* The rail has to show the ticks that overhang it. Only the FILL and BAND
       need clipping to the rounded ends, so they round themselves instead. */
      .pos-bar {
        overflow: visible;
      }
      .pos-band {
        border-radius: 6px;
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
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'acp-group-tile': GroupTile;
  }
}
