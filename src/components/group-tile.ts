import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import type {
  DiscoveredEntities,
  GroupAggregateState,
  GroupPositionAttributes,
  GroupScene,
} from '../types';
import { formatPercent } from '../lib/formatters';
import { groupSelectScene, groupSetSwitch } from '../lib/services';
import { t } from '../lib/i18n';
import { tooltip } from '../lib/tooltip';

import './tile-badge';

const SCENES: GroupScene[] = ['auto', 'all_open', 'all_closed', 'privacy'];
const AGGREGATE_STATES: GroupAggregateState[] = ['open', 'closed', 'mixed', 'unknown'];

/**
 * Cover Group tile variant (issue #185). A presentational element that renders a
 * group's aggregate position + state, the scene `<select>`, the lock toggle, and
 * the who-won "N/M" badge. The registered tile card delegates to this when
 * `discovered.is_group` is true; a cover entry never reaches here.
 *
 * All values are read from the group's discovered sensors; controls drive the
 * scene-select / lock switch entities directly (via `lib/services`) for
 * optimistic UI.
 */
@customElement('acp-group-tile')
export class GroupTile extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered!: DiscoveredEntities;

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.discovered) return nothing;
    const e = this.discovered.entities;

    const posState = e.group_position_sensor
      ? this.hass.states[e.group_position_sensor]
      : undefined;
    const position = posState ? parseFloat(posState.state) : NaN;
    const memberPositions =
      (posState?.attributes as GroupPositionAttributes | undefined)?.member_positions ?? {};
    const rosterTotal = Object.keys(memberPositions).length;

    const whoWonState = e.group_who_won_sensor
      ? this.hass.states[e.group_who_won_sensor]
      : undefined;
    const whoWonCount = whoWonState ? parseInt(whoWonState.state, 10) : NaN;

    const stateText = this._aggregateStateLabel();
    const currentScene = this._currentScene();
    const locked = this._locked();

    return html`
      <div class="group-tile">
        <div class="head">
          <div class="title">${this.discovered.entry_title}</div>
          ${Number.isNaN(whoWonCount)
            ? nothing
            : html`<acp-tile-badge
                .hass=${this.hass}
                kind-override="group"
                .groupCount=${whoWonCount}
                .groupTotal=${rosterTotal}
              ></acp-tile-badge>`}
        </div>
        <div class="readout">
          <span class="group-state">${stateText}</span>
          <span class="group-position"
            >${formatPercent(Number.isNaN(position) ? null : position)}</span
          >
        </div>
        <div class="controls" @click=${this._stop} @pointerdown=${this._stop}>
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
            class="lock-toggle ${locked ? 'locked' : ''}"
            type="button"
            aria-pressed=${locked ? 'true' : 'false'}
            aria-label=${t(locked ? 'group.unlock' : 'group.lock', this.hass)}
            ${tooltip(t(locked ? 'group.unlock' : 'group.lock', this.hass))}
            @click=${() => this._toggleLock(locked)}
          >
            <ha-icon icon=${locked ? 'mdi:lock' : 'mdi:lock-open-variant'}></ha-icon>
          </button>
        </div>
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

  private _onSceneChange(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as GroupScene;
    const id = this.discovered.entities.group_scene_select;
    if (id) groupSelectScene(this.hass, id, value);
  }

  private _toggleLock(locked: boolean): void {
    const id = this.discovered.entities.group_lock_switch;
    if (id) groupSetSwitch(this.hass, id, !locked);
  }

  private _stop(e: Event): void {
    e.stopPropagation();
  }

  public static styles = css`
    :host {
      display: block;
    }
    .group-tile {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 6px 4px;
    }
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-width: 0;
    }
    .title {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }
    .readout {
      display: flex;
      align-items: baseline;
      gap: 8px;
      font-size: 0.85rem;
      color: var(--primary-text-color);
    }
    .group-state {
      color: var(--secondary-text-color);
      text-transform: capitalize;
    }
    .group-position {
      font-variant-numeric: tabular-nums;
    }
    .controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .scene-select {
      flex: 1 1 auto;
      min-width: 0;
      padding: 4px 6px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.25));
      background: var(--card-background-color, white);
      color: var(--primary-text-color);
      font-size: 0.85rem;
    }
    .lock-toggle {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 36px;
      border: none;
      border-radius: 10px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .lock-toggle.locked {
      background: rgba(63, 81, 181, 0.2);
      color: #283593;
    }
    .lock-toggle:hover {
      filter: brightness(0.95);
    }
    .lock-toggle ha-icon {
      --mdc-icon-size: 20px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'acp-group-tile': GroupTile;
  }
}
