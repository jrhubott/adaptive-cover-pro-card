import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import type { HomeAssistant } from 'custom-card-helpers';

import type { DiscoveredEntities } from '../types';
import { memberBadgeWinners } from '../lib/badge-visibility';
import { positionAxisFor } from '../lib/axes';
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
import { createRosterMemo, rosterRowKey, rosterRowConfigKey } from '../lib/group-roster';
import { getCachedRegistry } from '../lib/registry-store';

import './cover-move-buttons';
import './group-controls-row';
import './group-member-row';
import './tilt-bar';
import './tile-badge';

/**
 * More-info dialog for a Cover Group entry. The cover `acp-more-info-dialog` is
 * entity-and-geometry bound (compass, elevation, decision trace), none of which
 * a group has — so groups get their own, narrower dialog.
 *
 * It repeats the tile's group-wide surface through the same shared reads
 * (`lib/group-controls`) and the same shared elements, then adds what the tile
 * has no room for: a per-member roster where every row is independently
 * controllable.
 */
@customElement('acp-group-dialog')
export class GroupDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered!: DiscoveredEntities;
  @property({ type: Boolean, reflect: true }) public open = false;
  /** Card config, threaded down so the dialog matches the tile that opened it. */
  @property({ type: Boolean }) public showTilt = true;
  @property({ type: Boolean }) public showSceneSelect = true;
  @property({ type: Boolean }) public showLock = true;
  @property({ type: Boolean }) public showAutomation = true;
  @property({ type: Boolean }) public showClearOverrides = true;
  @property({ type: Boolean }) public showMemberBadges = true;
  @property({ type: Boolean }) public stateColor = true;
  @property({ attribute: false }) public name?: string;
  @property({ attribute: false }) public icon?: string;
  /** Card `member_names` — per-row display overrides, keyed by
   *  {@link rosterRowConfigKey}. */
  @property({ attribute: false }) public memberNames?: Record<string, string>;

  /** Per-instance roster memo — see `createRosterMemo`. */
  private _roster = createRosterMemo();

  protected render(): TemplateResult | typeof nothing {
    if (!this.open || !this.hass || !this.discovered) return nothing;
    const s = readGroup(this.hass, this.discovered);

    const iconColor = this.stateColor ? coverStateColor(s.aggregate) : '';
    const members = Object.entries(s.memberPositions);
    const controllable = !!s.target;
    const badgeWinners = this.showMemberBadges ? memberBadgeWinners(s.memberWinners) : [];
    const closeLabel = t('dialog.close', this.hass);

    return html`
      <div class="backdrop" data-open @click=${this._onBackdrop}>
        <div class="dialog" @click=${this._stop} role="dialog" aria-modal="true">
          <div class="header">
            <ha-icon
              class="cover-icon"
              icon=${this.icon ?? groupIcon(s, s.position)}
              style=${iconColor ? `color: ${iconColor}` : ''}
            ></ha-icon>
            <div class="title">${this.name ?? this.discovered.entry_title}</div>
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
            <button class="close" type="button" aria-label=${closeLabel} @click=${this._emitClose}>
              ✕
            </button>
          </div>

          <div class="summary">
            <span class="agg-state">${t(`group.state_${s.aggregate}`, this.hass)}</span>
            <span class="agg-position">${formatPercent(s.position)}</span>
          </div>

          <acp-axis-bar
            layout="cover"
            .hass=${this.hass}
            .label=${t('group.position', this.hass)}
            .hintKey=${'covers.click_to_set'}
            .targetHintKey=${'covers.target_tooltip'}
            .actual=${s.position}
            .openBlocksSun=${positionAxisFor(this.discovered).openBlocksSun}
            .disabled=${!controllable}
            @acp-tilt-set=${(ev: CustomEvent<number>) => setGroupPosition(this.hass, s, ev.detail)}
          ></acp-axis-bar>
          ${this.showTilt && s.tilt
            ? html`<acp-axis-bar
                layout="cover"
                .hass=${this.hass}
                .label=${t('covers.tilt_title', this.hass)}
                .actual=${s.tilt.value}
                .openBlocksSun=${false}
                @acp-tilt-set=${(ev: CustomEvent<number>) => setGroupTilt(this.hass, s, ev.detail)}
              ></acp-axis-bar>`
            : nothing}

          <div class="controls">
            <acp-cover-move-buttons
              labels="group"
              .hass=${this.hass}
              .position=${s.position}
              .deviceClass=${s.deviceClass}
              .enabled=${controllable}
              @acp-move=${(e: CustomEvent<'open' | 'stop' | 'close'>) => this._move(e, s)}
            ></acp-cover-move-buttons>
          </div>

          <acp-group-controls-row
            .hass=${this.hass}
            .discovered=${this.discovered}
            .snapshot=${s}
            .showSceneSelect=${this.showSceneSelect}
            .showLock=${this.showLock}
            .showAutomation=${this.showAutomation}
            .showClearOverrides=${this.showClearOverrides}
          ></acp-group-controls-row>

          <div class="members">
            <div class="members-head">${t('group.members', this.hass)}</div>
            ${members.length === 0
              ? html`<div class="member-placeholder">
                  ${t('group.member_placeholder', this.hass)}
                </div>`
              : repeat(
                  this._roster(
                    this.hass,
                    members.map(([id]) => id),
                    getCachedRegistry() ?? undefined,
                  ),
                  rosterRowKey,
                  (row) =>
                    html`<acp-group-member-row
                      .hass=${this.hass}
                      .entityId=${row.covers[0]}
                      .coverIds=${row.covers}
                      .position=${s.memberPositions[row.covers[0]] ?? null}
                      .winner=${s.memberWinners?.[row.covers[0]]}
                      .openBlocksSun=${positionAxisFor(this.discovered).openBlocksSun}
                      .acpManaged=${!!s.memberWinners && row.covers[0] in s.memberWinners}
                      .displayName=${this.memberNames?.[rosterRowConfigKey(row)]}
                      .showTilt=${this.showTilt}
                    ></acp-group-member-row>`,
                )}
          </div>
        </div>
      </div>
    `;
  }

  private _move(e: CustomEvent<'open' | 'stop' | 'close'>, s: GroupSnapshot): void {
    if (e.detail === 'stop') stopGroup(this.hass, this.discovered, s);
    else setGroupPosition(this.hass, s, e.detail === 'open' ? 100 : 0);
  }

  private _onBackdrop = (e: MouseEvent): void => {
    if (e.target === e.currentTarget) this._emitClose();
  };

  private _emitClose = (): void => {
    this.dispatchEvent(new CustomEvent('acp-dialog-close', { bubbles: true, composed: true }));
  };

  private _stop = (e: Event): void => {
    e.stopPropagation();
  };

  public static styles = css`
    :host {
      display: contents;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 5vh 12px;
      overflow-y: auto;
    }
    .dialog {
      width: 100%;
      max-width: 520px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color);
      border-radius: 12px;
      padding: 14px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .header .cover-icon {
      --mdc-icon-size: 22px;
    }
    .header .title {
      font-size: 1.1rem;
      font-weight: 600;
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .close {
      border: 0;
      background: transparent;
      cursor: pointer;
      font-size: 1.1rem;
      color: var(--secondary-text-color);
      padding: 4px 6px;
    }
    .close:hover {
      color: var(--primary-text-color);
    }
    .summary {
      display: flex;
      align-items: baseline;
      gap: 10px;
      font-size: 1.1rem;
    }
    .agg-state {
      color: var(--secondary-text-color);
      text-transform: capitalize;
    }
    .agg-position {
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
    .controls {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .members {
      display: flex;
      flex-direction: column;
      gap: 10px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.25));
      padding-top: 10px;
    }
    .members-head {
      font-size: 0.78rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .member-placeholder {
      color: var(--secondary-text-color);
      text-align: center;
      padding: 12px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'acp-group-dialog': GroupDialog;
  }
}
