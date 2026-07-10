import { LitElement, html, css, nothing, type TemplateResult, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { entityStateChanged } from '../lib/hass-change';
import type {
  DiscoveredEntities,
  GroupAggregateState,
  GroupPositionAttributes,
  GroupScene,
  GroupWhoWonAttributes,
} from '../types';
import { formatPercent } from '../lib/formatters';
import { groupSelectScene, groupSetSwitch } from '../lib/services';
import { t } from '../lib/i18n';
import { tooltip } from '../lib/tooltip';

import './tile-badge';

const SCENES: GroupScene[] = ['auto', 'all_open', 'all_closed', 'privacy'];
const AGGREGATE_STATES: GroupAggregateState[] = ['open', 'closed', 'mixed', 'unknown'];

/**
 * Full Cover Group view (issue #185, Phase 3). Rendered by the ROOT card in place
 * of the sun/window/cover/decision/overrides/climate sections when
 * `discovered.is_group` is true — a group has no sun geometry, so none of those
 * sections apply.
 *
 * It surfaces the group's aggregate position + state, the scene `<select>`, the
 * lock / automation toggles, a clear-overrides button, and a member roster (one
 * row per `member_positions` entry). Each member row shows its friendly name,
 * live position, and — only when the member appears in `member_winners` — a
 * who-won badge reusing `<acp-tile-badge>`. Generic covers (position but no
 * winner) render their position with no badge.
 *
 * Controls drive the underlying entities directly (`select.select_option`,
 * `switch.turn_on/off`, `button.press`) via `lib/services` for optimistic UI.
 */
@customElement('acp-group-view')
export class GroupView extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered!: DiscoveredEntities;
  @property({ type: Boolean, reflect: true }) public compact = false;

  // Everything this view renders is derived from the group's own sensors,
  // select, switches, and button — plus the member cover entities for their live
  // friendly names/positions. Skip hass ticks that touched none of them.
  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.size > 1 || !changed.has('hass')) return true;
    const old = changed.get('hass') as HomeAssistant | undefined;
    const e = this.discovered?.entities;
    return entityStateChanged(old, this.hass, [
      e?.group_position_sensor,
      e?.group_state_sensor,
      e?.group_who_won_sensor,
      e?.group_scene_select,
      e?.group_lock_switch,
      e?.group_automation_switch,
      ...(this.discovered?.managed_covers ?? []),
    ]);
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.discovered) return nothing;
    const e = this.discovered.entities;

    const posState = e.group_position_sensor
      ? this.hass.states[e.group_position_sensor]
      : undefined;
    const position = posState ? parseFloat(posState.state) : NaN;
    const memberPositions =
      (posState?.attributes as GroupPositionAttributes | undefined)?.member_positions ?? {};

    const whoWonState = e.group_who_won_sensor
      ? this.hass.states[e.group_who_won_sensor]
      : undefined;
    const memberWinners =
      (whoWonState?.attributes as GroupWhoWonAttributes | undefined)?.member_winners ?? {};

    const currentScene = this._currentScene();
    const locked = this._locked();
    const automationOn = this._automationOn();
    const clearId = e.group_clear_overrides_button;
    const members = Object.entries(memberPositions);

    return html`
      <div class="group-view">
        <div class="summary">
          <span class="agg-state">${this._aggregateStateLabel()}</span>
          <span class="agg-position"
            >${formatPercent(Number.isNaN(position) ? null : position)}</span
          >
        </div>

        <div class="controls">
          <select
            class="scene-select"
            aria-label=${t('group.scene', this.hass)}
            @change=${this._onSceneChange}
          >
            ${SCENES.map(
              (s) =>
                html`<option value=${s} ?selected=${s === currentScene}>
                  ${t(`group.scene_${s}`, this.hass)}
                </option>`,
            )}
          </select>
          <button
            class="ctrl lock-toggle ${locked ? 'active' : ''}"
            type="button"
            aria-pressed=${locked ? 'true' : 'false'}
            aria-label=${t(locked ? 'group.unlock' : 'group.lock', this.hass)}
            ${tooltip(t(locked ? 'group.unlock' : 'group.lock', this.hass))}
            @click=${() => this._toggleLock(locked)}
          >
            <ha-icon icon=${locked ? 'mdi:lock' : 'mdi:lock-open-variant'}></ha-icon>
          </button>
          <button
            class="ctrl automation-toggle ${automationOn ? 'active' : ''}"
            type="button"
            aria-pressed=${automationOn ? 'true' : 'false'}
            aria-label=${t('group.automation', this.hass)}
            ${tooltip(t('group.automation', this.hass))}
            @click=${() => this._toggleAutomation(automationOn)}
          >
            <ha-icon icon=${automationOn ? 'mdi:robot' : 'mdi:robot-off'}></ha-icon>
          </button>
          ${clearId
            ? html`<button
                class="ctrl clear-overrides"
                type="button"
                aria-label=${t('group.clear_overrides', this.hass)}
                ${tooltip(t('group.clear_overrides', this.hass))}
                @click=${() => this._clearOverrides(clearId)}
              >
                <ha-icon icon="mdi:backup-restore"></ha-icon>
              </button>`
            : nothing}
        </div>

        <div class="members">
          <div class="members-head">${t('group.members', this.hass)}</div>
          ${members.length === 0
            ? html`<div class="member-placeholder">
                ${t('group.member_placeholder', this.hass)}
              </div>`
            : members.map(([id, pos]) => this._memberRow(id, pos, memberWinners[id]))}
        </div>
      </div>
    `;
  }

  private _memberRow(
    entityId: string,
    pos: number | null,
    winner: string | null | undefined,
  ): TemplateResult {
    const friendly =
      (this.hass.states[entityId]?.attributes?.friendly_name as string | undefined) ?? entityId;
    const actualPct = pos ?? 0;
    return html`
      <div class="member">
        <div class="member-name" ${tooltip(entityId)}>${friendly}</div>
        <div class="track">
          <div class="fill" style="width:${actualPct}%"></div>
          <div class="fill-closed" style="width:${100 - actualPct}%"></div>
        </div>
        <div class="member-position">${formatPercent(pos)}</div>
        ${winner
          ? html`<acp-tile-badge .hass=${this.hass} .winner=${winner}></acp-tile-badge>`
          : html`<span class="badge-spacer"></span>`}
      </div>
    `;
  }

  private _aggregateStateLabel(): string {
    const id = this.discovered.entities.group_state_sensor;
    const raw = id ? (this.hass.states[id]?.state ?? 'unknown') : 'unknown';
    const known = (AGGREGATE_STATES as string[]).includes(raw)
      ? (raw as GroupAggregateState)
      : 'unknown';
    return t(`group.state_${known}`, this.hass);
  }

  private _currentScene(): GroupScene {
    const id = this.discovered.entities.group_scene_select;
    if (!id) return 'auto';
    const st = this.hass.states[id];
    const raw = (st?.attributes?.current_option as string | undefined) ?? st?.state ?? 'auto';
    return (SCENES as string[]).includes(raw) ? (raw as GroupScene) : 'auto';
  }

  private _locked(): boolean {
    const id = this.discovered.entities.group_lock_switch;
    if (!id) return false;
    return this.hass.states[id]?.state === 'on';
  }

  private _automationOn(): boolean {
    const id = this.discovered.entities.group_automation_switch;
    if (!id) return true;
    return this.hass.states[id]?.state === 'on';
  }

  private _onSceneChange(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as GroupScene;
    const id = this.discovered.entities.group_scene_select;
    if (id) groupSelectScene(this.hass, id, value);
  }

  private _toggleLock(locked: boolean): void {
    const id = this.discovered.entities.group_lock_switch;
    if (id) groupSetSwitch(this.hass, id, !locked);
  }

  private _toggleAutomation(on: boolean): void {
    const id = this.discovered.entities.group_automation_switch;
    if (id) groupSetSwitch(this.hass, id, !on);
  }

  private _clearOverrides(buttonId: string): void {
    this.hass.callService('button', 'press', {}, { entity_id: buttonId });
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
      gap: 8px;
      flex-wrap: wrap;
    }
    .scene-select {
      flex: 1 1 auto;
      min-width: 120px;
      padding: 6px 8px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.25));
      background: var(--card-background-color, white);
      color: var(--primary-text-color);
      font-size: 0.9rem;
    }
    .ctrl {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 38px;
      border: none;
      border-radius: 10px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .ctrl:hover {
      filter: brightness(0.95);
    }
    .ctrl.active {
      background: rgba(63, 81, 181, 0.2);
      color: #283593;
    }
    .ctrl ha-icon {
      --mdc-icon-size: 20px;
    }
    .members {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .members-head {
      font-size: 0.78rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .member {
      display: grid;
      grid-template-columns: minmax(80px, 1.4fr) 3fr 44px auto;
      gap: 8px;
      align-items: center;
      font-size: 0.85rem;
    }
    .member-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .member-name[data-tooltip]:hover {
      cursor: help;
    }
    .member-position {
      font-variant-numeric: tabular-nums;
      text-align: right;
    }
    .track {
      position: relative;
      display: flex;
      height: 10px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.08));
      border-radius: 6px;
      overflow: hidden;
    }
    :host([compact]) .track {
      height: 6px;
    }
    .fill {
      height: 100%;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--primary-color) 18%, transparent);
      transition: width 0.3s ease;
    }
    .fill-closed {
      height: 100%;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--primary-color) 50%, transparent);
      transition: width 0.3s ease;
    }
    .badge-spacer {
      display: inline-block;
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
