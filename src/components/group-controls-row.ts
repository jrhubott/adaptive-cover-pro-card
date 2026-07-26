import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import type { DiscoveredEntities, GroupScene } from '../types';
import {
  SCENES,
  clearOverrides,
  hasMemberOverrides,
  selectScene,
  toggleAutomation,
  toggleLock,
  type GroupSnapshot,
} from '../lib/group-controls';
import { t } from '../lib/i18n';
import { tooltip } from '../lib/tooltip';

/**
 * The group-only control row — scene `<select>`, lock, member automation, and
 * clear-member-overrides — shared by the tile, its dialog, and the main-card
 * view so the three cannot disagree about what a group offers or when a control
 * is available.
 *
 * Each control is individually gateable from card config; the row renders
 * nothing at all once everything is off.
 */
@customElement('acp-group-controls-row')
export class GroupControlsRow extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered!: DiscoveredEntities;
  @property({ attribute: false }) public snapshot!: GroupSnapshot;

  @property({ type: Boolean }) public showSceneSelect = true;
  @property({ type: Boolean }) public showLock = true;
  @property({ type: Boolean }) public showAutomation = true;
  @property({ type: Boolean }) public showClearOverrides = true;

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.discovered || !this.snapshot) return nothing;
    const s = this.snapshot;
    // Each control needs BOTH its config opt-in and a backing entity — without
    // the entity the write is a no-op, so rendering it would be a lie.
    const clearId = this.showClearOverrides ? s.clearId : undefined;
    const lock = this.showLock && !!s.lockId;
    const automation = this.showAutomation && !!s.automationId;
    const scene = this.showSceneSelect && !!this.discovered.entities.group_scene_select;
    if (!scene && !lock && !automation && !clearId) return nothing;
    // Unknown state must not disable a button whose service would still do work
    // — see hasMemberOverrides for why a locked/weather-held group reads unknown.
    const clearable = hasMemberOverrides(s.memberWinners);

    return html`
      <div class="group-row" @click=${this._stop} @pointerdown=${this._stop} @keydown=${this._stop}>
        ${scene
          ? html`<select
              class="scene-select"
              aria-label=${t('group.scene', this.hass)}
              @change=${this._onSceneChange}
            >
              ${SCENES.map(
                (sc) =>
                  html`<option value=${sc} ?selected=${sc === s.scene}>
                    ${t(`group.scene_${sc}`, this.hass)}
                  </option>`,
              )}
            </select>`
          : nothing}
        ${!lock
          ? nothing
          : html`<button
              class="ctrl lock-toggle ${s.locked ? 'active' : ''}"
              type="button"
              aria-pressed=${s.locked ? 'true' : 'false'}
              aria-label=${t(s.locked ? 'group.unlock' : 'group.lock', this.hass)}
              ${tooltip(t(s.locked ? 'group.unlock' : 'group.lock', this.hass))}
              @click=${() => toggleLock(this.hass, this.discovered, s.locked)}
            >
              <ha-icon icon=${s.locked ? 'mdi:lock' : 'mdi:lock-open-variant'}></ha-icon>
            </button>`}
        ${!automation
          ? nothing
          : html`<button
              class="ctrl automation-toggle ${s.automationOn ? 'active' : ''}"
              type="button"
              aria-pressed=${s.automationOn ? 'true' : 'false'}
              aria-label=${t('group.automation', this.hass)}
              ${tooltip(t('group.automation', this.hass))}
              @click=${() => toggleAutomation(this.hass, this.discovered, s.automationOn)}
            >
              <ha-icon icon=${s.automationOn ? 'mdi:robot' : 'mdi:robot-off'}></ha-icon>
            </button>`}
        ${clearId
          ? html`<button
              class="ctrl clear-overrides"
              type="button"
              aria-label=${t('group.clear_overrides', this.hass)}
              ?disabled=${!clearable}
              ${tooltip(
                t(clearable ? 'group.clear_overrides' : 'group.clear_overrides_none', this.hass),
              )}
              @click=${() => clearOverrides(this.hass, clearId)}
            >
              <ha-icon icon="mdi:backup-restore"></ha-icon>
            </button>`
          : nothing}
      </div>
    `;
  }

  private _onSceneChange(e: Event): void {
    selectScene(this.hass, this.discovered, (e.target as HTMLSelectElement).value as GroupScene);
  }

  /* The host tile is itself a tap target, so no gesture inside this row may
     reach it. `keydown` matters as much as `click`: without it, Enter on the
     lock button bubbles to the tile body, which preventDefault()s it and opens
     the dialog instead of toggling the lock. */
  private _stop(e: Event): void {
    e.stopPropagation();
  }

  public static styles = css`
    :host {
      display: block;
    }
    .group-row {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: default;
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
    .ctrl {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 0;
      width: 40px;
      height: 36px;
      border: none;
      border-radius: 10px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .ctrl:hover:not(:disabled) {
      filter: brightness(0.95);
    }
    .ctrl.active {
      background: rgba(63, 81, 181, 0.2);
      color: #283593;
    }
    .ctrl:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .ctrl ha-icon {
      --mdc-icon-size: 20px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'acp-group-controls-row': GroupControlsRow;
  }
}
