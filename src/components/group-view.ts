import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import type { HomeAssistant } from 'custom-card-helpers';

import type { DiscoveredEntities } from '../types';
import { memberBadgeWinners } from '../lib/badge-visibility';
import { formatPercent } from '../lib/formatters';
import {
  readGroup,
  setGroupPosition,
  setGroupTilt,
  stopGroup,
  type GroupSnapshot,
} from '../lib/group-controls';
import { t } from '../lib/i18n';

import './cover-move-buttons';
import './group-controls-row';
import './group-member-row';
import './tilt-bar';
import './tile-badge';

/**
 * Full Cover Group view (issue #185, Phase 3). Rendered by the ROOT card in
 * place of the sun/window/cover/decision/overrides/climate sections when
 * `discovered.is_group` is true — a group has no sun geometry, so none of those
 * sections apply.
 *
 * It carries the same surface the group tile's dialog does — aggregate readout,
 * position (and tilt) track, ↑■↓, the group control row, and a controllable
 * member roster — through the same shared reads and elements, so the two cannot
 * drift.
 *
 * No `shouldUpdate` gate: a group's own entities say nothing about its members,
 * and the roster's nested member tiles are fed `hass` through this render. See
 * the note on the root card's `shouldUpdate`.
 */
@customElement('acp-group-view')
export class GroupView extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered!: DiscoveredEntities;
  @property({ type: Boolean, reflect: true }) public compact = false;

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.discovered) return nothing;
    const s = readGroup(this.hass, this.discovered);
    const members = Object.entries(s.memberPositions);
    const controllable = !!s.target;

    return html`
      <div class="group-view">
        <div class="summary">
          <span class="agg-state">${t(`group.state_${s.aggregate}`, this.hass)}</span>
          <span class="agg-position">${formatPercent(s.position)}</span>
          ${memberBadgeWinners(s.memberWinners).map(
            (w) => html`<acp-tile-badge .hass=${this.hass} .winner=${w}></acp-tile-badge>`,
          )}
        </div>

        <acp-axis-bar
          layout="cover"
          .hass=${this.hass}
          .label=${t('group.position', this.hass)}
          .hintKey=${'covers.click_to_set'}
          .targetHintKey=${'covers.target_tooltip'}
          .actual=${s.position}
          .compact=${this.compact}
          .disabled=${!controllable}
          @acp-tilt-set=${(ev: CustomEvent<number>) => setGroupPosition(this.hass, s, ev.detail)}
        ></acp-axis-bar>
        ${s.tilt
          ? html`<acp-axis-bar
              layout="cover"
              .hass=${this.hass}
              .label=${t('covers.tilt_title', this.hass)}
              .actual=${s.tilt.value}
              .compact=${this.compact}
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
        ></acp-group-controls-row>

        <div class="members">
          <div class="members-head">${t('group.members', this.hass)}</div>
          ${members.length === 0
            ? html`<div class="member-placeholder">
                ${t('group.member_placeholder', this.hass)}
              </div>`
            : repeat(
                members,
                ([id]) => id,
                ([id, pos]) =>
                  html`<acp-group-member-row
                    .hass=${this.hass}
                    .entityId=${id}
                    .position=${pos}
                    .winner=${s.memberWinners?.[id]}
                    .acpManaged=${!!s.memberWinners && id in s.memberWinners}
                    .compact=${this.compact}
                  ></acp-group-member-row>`,
              )}
        </div>
      </div>
    `;
  }

  private _move(e: CustomEvent<'open' | 'stop' | 'close'>, s: GroupSnapshot): void {
    if (e.detail === 'stop') stopGroup(this.hass, this.discovered, s);
    else setGroupPosition(this.hass, s, e.detail === 'open' ? 100 : 0);
  }

  public static styles = css`
    :host {
      display: block;
    }
    .group-view {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .summary {
      display: flex;
      align-items: baseline;
      gap: 10px;
      font-size: 1.1rem;
      flex-wrap: wrap;
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
    }
    .members {
      display: flex;
      flex-direction: column;
      gap: 10px;
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
    'acp-group-view': GroupView;
  }
}
