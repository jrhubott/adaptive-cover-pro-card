import { LitElement, html, css, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { coverCloseIcon, coverOpenIcon } from '../lib/icons';
import { t } from '../lib/i18n';

export type MoveAction = 'open' | 'stop' | 'close';

/**
 * The ↑ ■ ↓ triple, shared by every group surface (tile, dialog, main-card view)
 * and the member roster rows.
 *
 * Purely presentational: it emits `acp-move` with the action and the host runs
 * the service call, so routing stays in one place. Existing as one element is
 * what keeps the surfaces from drifting — before this, the tile disabled its
 * buttons with `>= 100` while the dialog used `=== 100`, and only the tile used
 * the device-class-aware arrow glyphs.
 *
 * Sizing mirrors the cover tile's detailed control row, including the
 * `padding: 0` / `box-sizing` pair its base rule sets — without those a UA's
 * default button padding inflates the fixed 40×40 box.
 */
@customElement('acp-cover-move-buttons')
export class CoverMoveButtons extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  /** Live position 0..100 driving the at-the-end disabling. Pass SERVER truth,
   *  never a drag preview, or the buttons flicker disabled mid-gesture. */
  @property({ attribute: false }) public position: number | null = null;
  /** HA `device_class`, so awning/curtain/door/gate get the inset arrows. */
  @property({ attribute: false }) public deviceClass?: string;
  /** False when there is nothing to drive (no resolved service target). */
  @property({ type: Boolean }) public enabled = true;
  /** i18n key prefix — `group` for a whole group, `tile` for a single cover. */
  @property() public labels: 'group' | 'tile' = 'tile';
  /** Compact variant for the repeated per-member rows in a roster. */
  @property({ type: Boolean, reflect: true }) public compact = false;
  /** Stretch the trio across the host's full width, flex-filling like HA's
   *  ha-control-button-group. Opt-in, and only the group TILE wants it: its
   *  buttons sit in a 50%-wide grid track that mirrors HA's inline-features
   *  block. The dialog and the main-card group view put this in a full-width
   *  flex row, where filling would stretch three buttons edge to edge. */
  @property({ type: Boolean, reflect: true }) public fill = false;

  protected render(): TemplateResult {
    const atOpen = this.position !== null && this.position >= 100;
    const atClosed = this.position !== null && this.position <= 0;
    return html`
      <div class="move-buttons">
        <button
          class="up"
          type="button"
          aria-label=${t(`${this.labels}.open`, this.hass)}
          ?disabled=${!this.enabled || atOpen}
          @click=${() => this._emit('open')}
        >
          <ha-icon icon=${coverOpenIcon(this.deviceClass)}></ha-icon>
        </button>
        <button
          class="stop"
          type="button"
          aria-label=${t(`${this.labels}.stop`, this.hass)}
          ?disabled=${!this.enabled}
          @click=${() => this._emit('stop')}
        >
          <ha-icon icon="mdi:stop"></ha-icon>
        </button>
        <button
          class="down"
          type="button"
          aria-label=${t(`${this.labels}.close`, this.hass)}
          ?disabled=${!this.enabled || atClosed}
          @click=${() => this._emit('close')}
        >
          <ha-icon icon=${coverCloseIcon(this.deviceClass)}></ha-icon>
        </button>
      </div>
    `;
  }

  private _emit(action: MoveAction): void {
    this.dispatchEvent(
      new CustomEvent<MoveAction>('acp-move', { detail: action, bubbles: true, composed: true }),
    );
  }

  public static styles = css`
    :host {
      display: contents;
    }
    .move-buttons {
      display: inline-flex;
      align-items: center;
      /* --feature-button-spacing */
      gap: 12px;
    }
    :host([fill]) .move-buttons {
      width: 100%;
    }
    :host([compact]) .move-buttons {
      gap: 6px;
    }
    .move-buttons button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 0;
      font-size: 0.8rem;
      line-height: 1;
      /* Square at HA's inline-feature thickness by default, matching the cover
         tile's detailed control row — see that rule for the upstream token
         trail. Only [fill] flex-fills; see the property doc for why. */
      width: var(--control-button-group-thickness, 36px);
      height: var(--control-button-group-thickness, 36px);
      border-radius: var(--control-button-border-radius, 12px);
      border: none;
      background: color-mix(
        in srgb,
        var(--control-button-background-color, var(--disabled-color, #7f7f7f)) 20%,
        transparent
      );
      cursor: pointer;
    }
    /* The two overrides let a narrow host opt back out of filling without
       needing to drop the [fill] attribute reactively — see the group tile's
       container query. Custom properties inherit through the shadow boundary. */
    :host([fill]) .move-buttons button {
      flex: var(--acp-move-button-flex, 1 1 0);
      width: var(--acp-move-button-width, auto);
    }
    :host([compact]) .move-buttons button {
      width: 40px;
      height: 32px;
      border-radius: 8px;
    }
    .move-buttons button ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-text-color);
      line-height: 0;
    }
    :host([compact]) .move-buttons button ha-icon {
      --mdc-icon-size: 18px;
    }
    .move-buttons button:hover:not(:disabled) {
      background: color-mix(
        in srgb,
        var(--control-button-background-color, var(--disabled-color, #7f7f7f)) 32%,
        transparent
      );
    }
    .move-buttons button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'acp-cover-move-buttons': CoverMoveButtons;
  }
}
