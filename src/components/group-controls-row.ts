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
import type { MemberAutomationStatus } from '../lib/member-automation';
import { t } from '../lib/i18n';
import { tooltip } from '../lib/tooltip';

/** Glyph per automation status. The shape changes with the color so the state
 *  survives a colorblind reading and a 20px icon. */
const AUTOMATION_ICONS: Record<Exclude<MemberAutomationStatus, 'unknown'>, string> = {
  all: 'mdi:robot',
  some: 'mdi:robot-outline',
  none: 'mdi:robot-off',
};

/** Everything the Automation button renders and writes, derived once.
 *
 *  `on` is deliberately one value driving three things — the pill's pressed
 *  look, `aria-pressed`, and what a press sends — so they cannot disagree. */
interface AutomationView {
  /** Status modifier class, or `active`/`''` on the unresolved fallback. */
  cls: string;
  icon: string;
  ariaPressed: 'true' | 'false' | 'mixed';
  /** The state sentence — tooltip and `aria-description`. The accessible *name*
   *  stays the control's purpose: folding the state into `aria-label` made a
   *  screen reader announce it twice (name + `aria-pressed`) and never say what
   *  the button is for. */
  state: string;
  /** Treated-as-on; `toggleAutomation` sends the inverse. */
  on: boolean;
}

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
        ${!automation ? nothing : this._automationButton(this._automationView(s))}
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

  /**
   * Resolve the Automation button from the members' live state, falling back to
   * the group's own latch when nothing resolves.
   *
   * The latch (`s.automationOn`) records the last bulk command and defaults to
   * on, so it says "everything automated" after a restart and stays put when a
   * member is toggled at its own tile. `s.memberAutomation` is the real answer;
   * `unknown` means the registry cache is still cold or the roster is all
   * generic covers, and then this reproduces the pre-rollup button exactly.
   */
  private _automationView(s: GroupSnapshot): AutomationView {
    const status = s.memberAutomation.status;
    if (status === 'unknown') {
      return {
        cls: s.automationOn ? 'active' : '',
        icon: s.automationOn ? AUTOMATION_ICONS.all : AUTOMATION_ICONS.none,
        ariaPressed: s.automationOn ? 'true' : 'false',
        state: t('group.automation', this.hass),
        on: s.automationOn,
      };
    }
    const on = status === 'all';
    return {
      cls: `auto-${status}`,
      icon: AUTOMATION_ICONS[status],
      // A partly-automated roster is genuinely tri-state, and ARIA has a value
      // for exactly that.
      ariaPressed: status === 'some' ? 'mixed' : on ? 'true' : 'false',
      state: t(`group.automation_${status}`, this.hass, {
        count: s.memberAutomation.on,
        total: s.memberAutomation.total,
      }),
      on,
    };
  }

  private _automationButton(v: AutomationView): TemplateResult {
    return html`<button
      class="ctrl automation-toggle ${v.cls}"
      type="button"
      aria-pressed=${v.ariaPressed}
      aria-label=${t('group.automation', this.hass)}
      aria-description=${v.state}
      ${tooltip(v.state)}
      @click=${() => toggleAutomation(this.hass, this.discovered, v.on)}
    >
      <ha-icon icon=${v.icon}></ha-icon>
    </button>`;
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
    /* Automation status (3 colors), speaking the same language as the badges
       sitting inches away on the same tile: green = the pipeline owns this (the
       auto / group badge), amber = a human has partly taken over (the manual
       badge), grey = deliberately off, not a fault. Red is left alone: it already
       means force / weather / glare in this card.

       The glyph carries the color; the pill keeps the neutral background every
       other control has. A matching tint under it read as low as 1.65:1 — below
       the 3:1 WCAG 1.4.11 floor for meaningful non-text content — because the
       glyph and its backdrop were the same hue.

       Mixed toward --primary-text-color rather than used raw for the same
       reason: HA's --success-color / --warning-color defaults (#4caf50, #ffa600)
       sit around 2.3:1 on a light pill. Because that token is near-black in a
       light theme and near-white in a dark one, one rule darkens the glyph on a
       light pill and lightens it on a dark one — ~4.5:1 and ~3.4:1 against the
       light default, and it cannot invert on a theme we have not seen. */
    .ctrl.auto-all {
      color: color-mix(in srgb, var(--success-color, #4caf50) 60%, var(--primary-text-color));
    }
    .ctrl.auto-some {
      color: color-mix(in srgb, var(--warning-color, #ffa600) 60%, var(--primary-text-color));
    }
    /* Off is the resting state, so it takes the resting color. */
    .ctrl.auto-none {
      color: var(--secondary-text-color);
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
