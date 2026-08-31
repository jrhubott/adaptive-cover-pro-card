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
  toggleClimate,
  toggleLock,
  type GroupSnapshot,
} from '../lib/group-controls';
import type { MemberRollup, MemberRollupStatus } from '../lib/member-rollup';
import { t } from '../lib/i18n';
import { tooltip } from '../lib/tooltip';

type ResolvedStatus = Exclude<MemberRollupStatus, 'unknown'>;

/** Glyph per status, per button. The shape changes with the color so the state
 *  survives a colorblind reading and a 20px icon.
 *
 *  Climate has no `sun-thermometer-off` in MDI, so its `none` drops the sun and
 *  takes `thermometer-off` — a bigger shape jump than automation's family of
 *  three, which is if anything an improvement for the state that most needs to
 *  be unmistakable. */
const STATUS_ICONS: Record<'automation' | 'climate', Record<ResolvedStatus, string>> = {
  automation: { all: 'mdi:robot', some: 'mdi:robot-outline', none: 'mdi:robot-off' },
  climate: {
    all: 'mdi:sun-thermometer',
    some: 'mdi:sun-thermometer-outline',
    none: 'mdi:thermometer-off',
  },
};

/** The unresolved-fallback glyph pair, used when the rollup cannot report and the
 *  button paints from the group's own latch instead. */
const LATCH_ICONS: Record<'automation' | 'climate', { on: string; off: string }> = {
  automation: { on: STATUS_ICONS.automation.all, off: STATUS_ICONS.automation.none },
  climate: { on: STATUS_ICONS.climate.all, off: STATUS_ICONS.climate.none },
};

/** Everything a rollup-backed button renders and writes, derived once.
 *
 *  `on` is deliberately one value driving three things — the pill's pressed
 *  look, `aria-pressed`, and what a press sends — so they cannot disagree. */
interface RollupView {
  /** Status modifier class, or `active`/`''` on the unresolved fallback. */
  cls: string;
  icon: string;
  ariaPressed: 'true' | 'false' | 'mixed';
  /** The full accessible name and tooltip: the control's purpose first, then the
   *  state. `aria-description` cannot carry the state instead — the tooltip
   *  directive always sets `aria-describedby`, which takes precedence over it,
   *  and that IDREF points at a bubble in `document.body` that no IDREF reaches
   *  across a shadow boundary. So the state goes in the name or nowhere. */
  label: string;
  /** Treated-as-on; the toggle sends the inverse. */
  on: boolean;
}

/**
 * The group-only control row — scene `<select>`, lock, member automation,
 * climate on/off, and clear-member-overrides — shared by the tile, its dialog,
 * and the main-card
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
  /** The one control in this row that defaults to HIDDEN. A press disables
   *  climate mode on every ACP member at once, and unlike lock or a scene there
   *  is no group-level readout that makes the resulting state obvious, so it is
   *  opt-in per card rather than opt-out. */
  @property({ type: Boolean }) public showClimate = false;

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.discovered || !this.snapshot) return nothing;
    const s = this.snapshot;
    // Each control needs BOTH its config opt-in and a backing entity — without
    // the entity the write is a no-op, so rendering it would be a lie.
    const clearId = this.showClearOverrides ? s.clearId : undefined;
    const lock = this.showLock && !!s.lockId;
    const automation = this.showAutomation && !!s.automationId;
    const climate = this.showClimate && !!s.climateId;
    const scene = this.showSceneSelect && !!this.discovered.entities.group_scene_select;
    if (!scene && !lock && !automation && !climate && !clearId) return nothing;
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
          : this._rollupButton(
              'automation',
              this._rollupView('automation', s.memberAutomation, s.automationOn),
            )}
        ${!climate
          ? nothing
          : this._rollupButton(
              'climate',
              this._rollupView('climate', s.memberClimate, s.climateOn),
            )}
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
   * Resolve a rollup-backed button from the members' live state, falling back to
   * the group's own latch when nothing resolves.
   *
   * The latch (`s.automationOn` / `s.climateOn`) records the last bulk command,
   * so it says "everything on" after a restart and stays put when a member is
   * toggled at its own tile. The rollup is the real answer; `unknown` means the
   * registry cache is still cold or the roster is all generic covers, and then
   * this reproduces the pre-rollup button exactly.
   *
   * Automation and Climate ask different questions of the same walk and differ
   * only in glyphs and strings, so they share this rather than keeping two
   * copies that can drift — which is how the group surfaces got into trouble
   * before `group-controls.ts` existed.
   */
  private _rollupView(
    kind: 'automation' | 'climate',
    rollup: MemberRollup,
    latchOn: boolean,
  ): RollupView {
    const name = t(kind === 'automation' ? 'group.automation' : 'group.climate', this.hass);
    const status = rollup.status;
    if (status === 'unknown') {
      return {
        cls: latchOn ? 'active' : '',
        icon: latchOn ? LATCH_ICONS[kind].on : LATCH_ICONS[kind].off,
        ariaPressed: latchOn ? 'true' : 'false',
        label: name,
        on: latchOn,
      };
    }
    const on = status === 'all';
    const count = t(
      kind === 'automation' ? 'group.automation_count' : 'group.climate_count',
      this.hass,
      { count: rollup.on, total: rollup.total },
    );
    return {
      cls: `auto-${status}`,
      icon: STATUS_ICONS[kind][status],
      // A partly-on roster is genuinely tri-state, and ARIA has a value for
      // exactly that.
      ariaPressed: status === 'some' ? 'mixed' : on ? 'true' : 'false',
      label: `${name} — ${count}`,
      on,
    };
  }

  private _rollupButton(kind: 'automation' | 'climate', v: RollupView): TemplateResult {
    const toggle = kind === 'automation' ? toggleAutomation : toggleClimate;
    return html`<button
      class="ctrl ${kind}-toggle ${v.cls}"
      type="button"
      aria-pressed=${v.ariaPressed}
      aria-label=${v.label}
      ${tooltip(v.label)}
      @click=${() => toggle(this.hass, this.discovered, v.on)}
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

       The glyph color is mixed toward --primary-text-color rather than used raw.
       HA's --success-color / --warning-color defaults (#4caf50, #ffa600) sit
       around 1.7-2.3:1 over these tints — under the 3:1 WCAG 1.4.11 floor for
       meaningful non-text content, since glyph and backdrop share a hue. Because
       that token is near-black in a light theme and near-white in a dark one,
       one rule darkens the glyph on a light pill and lightens it on a dark one:
       ~4.6:1 and ~3.5:1 over the light tints, higher on dark, and it cannot
       invert on a theme we have not seen.

       The tints stay. They are what makes an engaged control look engaged — the
       same job .active does on lock — and dropping them left the all-automated
       state with no pressed affordance plus a visible un-highlight on every
       load, since the button paints the tinted unresolved fallback until the
       registry cache warms. */
    .ctrl.auto-all {
      background: rgba(76, 175, 80, 0.18);
      color: color-mix(in srgb, var(--success-color, #4caf50) 60%, var(--primary-text-color));
    }
    .ctrl.auto-some {
      background: rgba(255, 152, 0, 0.22);
      color: color-mix(in srgb, var(--warning-color, #ffa600) 60%, var(--primary-text-color));
    }
    /* Off is the resting state, so it takes the resting look — and the untinted
       fallback for a latch that reads off, so that path never flashes either. */
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
