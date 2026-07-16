import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { countdownTo, formatClock } from '../lib/formatters';
import { t } from '../lib/i18n';
import type { OverridePreset } from '../lib/override-presets';

/** Relative "add time" chips, in minutes. Additive from the current override
 *  end — extending is about pushing the existing deadline out, not restarting
 *  the clock from now. */
const RELATIVE_MINUTES = [15, 30, 60, 120];

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Dialog for extending an active manual override (#229).
 *
 * Presentational by contract: it resolves an end instant and dispatches
 * `acp-extend-confirm` with `{ endMs }`. The tile card owns the service call,
 * exactly as it does for `acp-resume` — keeping the write path in one place.
 *
 * Hand-rolled `<input type="time">` + chips rather than `ha-form`: `ha-form` is
 * an undefined custom element outside the HA frontend, so under this repo's
 * structural-verification-only rule the dialog's primary input would ship with
 * no real test coverage.
 */
@customElement('acp-extend-override-dialog')
export class ExtendOverrideDialog extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ type: Boolean }) public open = false;
  @property({ attribute: false }) public presets: OverridePreset[] = [];

  /** Current override end, the base for the relative chips. Falls back to `now`
   *  when the end-time sensor is unreadable. */
  @property({ type: Number, attribute: false }) public currentEndMs?: number;

  /** The resolved end instant, or undefined until the user picks something. */
  @state() private _endMs?: number;

  protected updated(changed: Map<string, unknown>): void {
    // Reopening must not inherit the previous session's choice.
    if (changed.has('open') && this.open) this._endMs = undefined;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.open) return nothing;
    const title = this._t('dialog.extend.title', 'Extend manual override');

    return html`
      <div class="backdrop" data-open @click=${this._onBackdrop}>
        <div class="dialog" @click=${this._stop} role="dialog" aria-modal="true">
          <div class="title">${title}</div>

          ${this.presets.length > 0
            ? html`<div class="section">
                <div class="label">${this._t('dialog.extend.presets_label', 'Until')}</div>
                <div class="chips">
                  ${this.presets.map(
                    (p) =>
                      html`<button
                        class="preset"
                        type="button"
                        @click=${() => this._pick(Date.parse(p.t))}
                      >
                        ${this._presetLabel(p)} · ${formatClock(p.t)}
                      </button>`,
                  )}
                </div>
              </div>`
            : nothing}

          <div class="section">
            <div class="label">${this._t('dialog.extend.relative_label', 'Add time')}</div>
            <div class="chips">
              ${RELATIVE_MINUTES.map(
                (mins) =>
                  html`<button
                    class="rel"
                    type="button"
                    data-mins=${mins}
                    @click=${() => this._addRelative(mins)}
                  >
                    +${mins < 60 ? `${mins}m` : `${mins / 60}h`}
                  </button>`,
              )}
            </div>
          </div>

          <div class="section">
            <div class="label">${this._t('dialog.extend.absolute_label', 'End at')}</div>
            <input type="time" @change=${this._onTimeChange} />
          </div>

          <div class="preview">${this._previewText()}</div>

          <div class="actions">
            <button class="cancel" type="button" @click=${this._emitClose}>
              ${this._t('dialog.extend.cancel', 'Cancel')}
            </button>
            <button
              class="confirm"
              type="button"
              ?disabled=${this._endMs === undefined}
              @click=${this._onConfirm}
            >
              ${this._t('dialog.extend.confirm', 'Extend')}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _t(key: string, fallback: string): string {
    if (!this.hass) return fallback;
    const translated = t(key, this.hass);
    return translated === key ? fallback : translated;
  }

  /** Prefer the shared `forecast.event.*` prose the forecast strip already uses;
   *  fall back to the sensor's own label for kinds we have no translation for. */
  private _presetLabel(p: OverridePreset): string {
    const key = `forecast.event.${p.kind}`;
    const translated = this.hass ? t(key, this.hass) : key;
    return translated === key ? (p.label ?? p.kind) : translated;
  }

  private _previewText(): string {
    if (this._endMs === undefined) return '';
    const iso = new Date(this._endMs).toISOString();
    const time = formatClock(iso);
    const tomorrow =
      new Date(this._endMs).getDate() !== new Date().getDate()
        ? this._t('dialog.extend.tomorrow_suffix', ' (tomorrow)')
        : '';
    const template = this._t('dialog.extend.preview', 'Override until {time}');
    return `${template.replace('{time}', `${time}${tomorrow}`)} · ${countdownTo(iso, this.hass)}`;
  }

  private _pick(endMs: number): void {
    this._endMs = endMs;
  }

  /** Relative chips push the *current end* out, and stack on each other. */
  private _addRelative(mins: number): void {
    const base = this._endMs ?? this.currentEndMs ?? Date.now();
    this._endMs = base + mins * 60_000;
  }

  private _onTimeChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value) return;
    const [hh, mm] = value.split(':').map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return;
    const now = new Date();
    const candidate = new Date(now);
    candidate.setHours(hh, mm, 0, 0);
    // A clock time already past today means the user meant tomorrow — an
    // override cannot end in the past.
    if (candidate.getTime() <= now.getTime()) candidate.setTime(candidate.getTime() + DAY_MS);
    this._endMs = candidate.getTime();
  }

  private _onConfirm(): void {
    if (this._endMs === undefined) return;
    this.dispatchEvent(
      new CustomEvent('acp-extend-confirm', {
        detail: { endMs: this._endMs },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onBackdrop = (e: MouseEvent): void => {
    if (e.target === e.currentTarget) this._emitClose();
  };

  private _emitClose = (): void => {
    this.dispatchEvent(new CustomEvent('acp-extend-close', { bubbles: true, composed: true }));
  };

  private _stop = (e: Event): void => {
    e.stopPropagation();
  };

  public static styles = css`
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }
    .dialog {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border-radius: 12px;
      padding: 16px;
      min-width: 280px;
      max-width: 92vw;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
    .title {
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 12px;
    }
    .section {
      margin-bottom: 12px;
    }
    .label {
      font-size: 0.75rem;
      opacity: 0.7;
      margin-bottom: 4px;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .chips button {
      font-family: inherit;
      font-size: 0.75rem;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: none;
      color: inherit;
      cursor: pointer;
    }
    .chips button:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    input[type='time'] {
      font-family: inherit;
      font-size: 0.9rem;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: none;
      color: inherit;
    }
    .preview {
      min-height: 1.2em;
      font-size: 0.8rem;
      opacity: 0.85;
      margin-bottom: 12px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .actions button {
      font-family: inherit;
      font-size: 0.85rem;
      padding: 6px 14px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      background: none;
      color: inherit;
    }
    .actions .confirm {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
    }
    .actions .confirm[disabled] {
      opacity: 0.4;
      cursor: default;
    }
  `;
}
