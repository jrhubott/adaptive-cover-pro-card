import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { BADGE_I18N_KEYS, BADGE_ICONS, BADGE_TOKENS, type BadgeKind } from '../const';
import { winnerBadgeKind } from '../lib/badge-visibility';
import { formatClock } from '../lib/formatters';
import { t } from '../lib/i18n';
import { tooltip } from '../lib/tooltip';

/**
 * Compact contextual badge for the tile card.
 *
 * One badge per cover summarising what the integration is doing right now:
 * `Auto`, `Manual · 16:51`, `Custom · Table extension · 60% floor`, etc.
 *
 * The kind is derived from the winning handler name; everything else
 * (countdown clock, slot label, percent suffix) is data the caller passes in
 * after reading the relevant entities/attributes from the integration.
 */
@customElement('acp-tile-badge')
export class TileBadge extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property() public winner: string = 'default';

  /** Manual override end time (ISO) — drives the "Manual · HH:MM" suffix. */
  @property({ attribute: 'manual-end-iso' }) public manualEndIso?: string;

  /** 1-based slot number for the custom-position badge. Named `slotNumber`
   *  rather than `slot` to avoid clashing with HTMLElement's native `slot`. */
  @property({ type: Number, attribute: 'slot-number' }) public slotNumber?: number;

  /** Slot's bound-sensor friendly name (preferred over `#N` when present). */
  @property({ attribute: 'slot-name' }) public slotName?: string;

  /** Cover position (0-100) shown in the custom-position badge. */
  @property({ type: Number }) public pct?: number;

  /** True when the configured floor is actively constraining position. */
  @property({ type: Boolean, attribute: 'minimum-mode' }) public minimumMode?: boolean;

  @property({ type: Boolean, reflect: true }) public compact = false;

  /** When false, the badge renders an "Off" pill regardless of `winner`. */
  @property({ type: Boolean, attribute: 'integration-enabled' })
  public integrationEnabled = true;

  /** When true, the badge renders "Manual" regardless of `winner` (unless force handler wins). */
  @property({ type: Boolean, attribute: 'manual-active' })
  public manualActive = false;

  /** When true and the winner is a `custom_position` slot, the badge renders the
   *  red, force-styled "Safety" variant (v2.28.0+ migrated Force Override —
   *  priority-100 slot 5). `_kind()` is unchanged: the underlying kind stays
   *  `custom_position`; only the rendered tokens/icon/label are substituted. */
  @property({ type: Boolean, attribute: 'safety-active' })
  public safetyActive = false;

  /** Explicit badge kind that overrides the winner-derived kind. The tile card
   *  sets this to substitute the Auto badge for a suppressed "Motion idle"
   *  winner; left undefined the kind is derived from `winner` as usual. */
  @property({ attribute: 'kind-override' }) public kindOverride?: BadgeKind;

  /** Cover Group who-won count (issue #185): the number of group members the
   *  group is currently driving. Rendered as "N/M" with {@link groupTotal} on
   *  the `group` badge. */
  @property({ type: Number, attribute: 'group-count' }) public groupCount?: number;

  /** Cover Group roster size (issue #185): the "N/M" denominator — the total
   *  member count (`member_positions` length). */
  @property({ type: Number, attribute: 'group-total' }) public groupTotal?: number;

  /** When true, the badge becomes a tappable button that emits `acp-resume`
   *  (used to resume automatic control while a manual override is active). The
   *  badge stays presentational — it dispatches the event; the host runs the
   *  actual service call. A trailing ↺ icon signals the affordance. */
  @property({ type: Boolean, reflect: true }) public resumable = false;

  /** When true, the badge grows an Extend action that emits `acp-extend` (the
   *  host opens the extend-override dialog and runs the service call — the badge
   *  stays presentational, exactly like {@link resumable}).
   *
   *  The host must gate this on **`manualActive`, never on the badge `kind`**:
   *  an active override renders kind `custom_position` or `force` whenever a
   *  slot also wins (`badge-visibility.ts:127`), and deriving override
   *  affordances from the winning handler is the bug behind #81, #82 and #199. */
  @property({ type: Boolean, reflect: true }) public extendable = false;

  protected render(): TemplateResult {
    const kind = this._kind();
    // A priority-100 safety custom_position slot (v2.28.0+ migrated Force
    // Override) reuses the red `force` tokens/icon and the "Safety" label, while
    // the kind class stays `custom_position` so the badge tracks the real winner.
    const safetyVariant = kind === 'custom_position' && this.safetyActive;
    const tokens = safetyVariant ? BADGE_TOKENS.force : BADGE_TOKENS[kind];
    const base = this.hass ? t(BADGE_I18N_KEYS[kind], this.hass) : BADGE_TOKENS[kind].label;
    const label = safetyVariant
      ? this.hass
        ? t('badge.safety', this.hass)
        : 'Safety'
      : this._label(kind, base);
    const icon = safetyVariant ? BADGE_ICONS.force : BADGE_ICONS[kind];

    // Two-action branch (#229). A second tap target cannot live inside the
    // resumable branch below — that makes the *whole badge* a <button>, and a
    // nested <button> is invalid HTML that breaks both handlers. So the badge
    // becomes a plain container holding sibling buttons instead.
    if (this.extendable) {
      const extendHint = this.hass ? t('tile.extend_aria', this.hass) : 'Extend manual override';
      const resumeHint = this.hass ? t('tile.resume_aria', this.hass) : 'Resume automatic control';
      // Compact already drops the "Manual · " prefix to stay narrow; with two
      // action glyphs the leading kind icon is the next thing to go — the badge
      // color already signals the kind (same rationale as `_label()`).
      const showKindIcon = !!icon && !this.compact;
      return html`<span
        class="badge kind-${kind} has-actions"
        style="background:${tokens.bg};color:${tokens.fg};"
        part="badge"
      >
        ${showKindIcon ? html`<ha-icon class="badge-icon" icon=${icon}></ha-icon>` : nothing}
        <span class="badge-label">${label}</span>
        <button
          class="act extend"
          type="button"
          ${tooltip(extendHint)}
          aria-label=${extendHint}
          @click=${this._onExtendClick}
          @pointerdown=${this._stop}
        >
          <ha-icon icon="mdi:clock-plus-outline"></ha-icon>
        </button>
        ${this.resumable
          ? html`<button
              class="act resume"
              type="button"
              ${tooltip(resumeHint)}
              aria-label=${resumeHint}
              @click=${this._onResumeClick}
              @pointerdown=${this._stop}
            >
              <ha-icon icon="mdi:restore"></ha-icon>
            </button>`
          : nothing}
      </span>`;
    }

    const inner = html`${icon
      ? html`<ha-icon class="badge-icon" icon=${icon}></ha-icon>`
      : nothing}${label}${this.resumable
      ? html`<ha-icon class="resume-icon" icon="mdi:restore"></ha-icon>`
      : nothing}`;
    if (this.resumable) {
      const hint = this.hass ? t('tile.resume_aria', this.hass) : 'Resume automatic control';
      return html`<button
        class="badge kind-${kind} resumable"
        style="background:${tokens.bg};color:${tokens.fg};"
        part="badge"
        type="button"
        ${tooltip(hint)}
        aria-label=${hint}
        @click=${this._onResumeClick}
        @pointerdown=${this._stop}
      >
        ${inner}
      </button>`;
    }
    return html`<span
      class="badge kind-${kind}"
      style="background:${tokens.bg};color:${tokens.fg};"
      part="badge"
      >${inner}</span
    >`;
  }

  private _stop(e: Event): void {
    e.stopPropagation();
  }

  private _onResumeClick(e: Event): void {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('acp-resume', { bubbles: true, composed: true }));
  }

  private _onExtendClick(e: Event): void {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('acp-extend', { bubbles: true, composed: true }));
  }

  private _kind(): BadgeKind {
    return (
      this.kindOverride ??
      winnerBadgeKind({
        winner: this.winner,
        integrationEnabled: this.integrationEnabled,
        manualActive: this.manualActive,
      })
    );
  }

  private _label(kind: BadgeKind, base: string): string {
    if (kind === 'manual') {
      // The orange "manual" color already signals the kind — when a
      // countdown time is available we drop the "Manual · " prefix so the
      // badge stays narrow ("04:35 PM" instead of "Manual · 04:35 PM").
      if (!this.manualEndIso) return base;
      return formatClock(this.manualEndIso);
    }
    if (kind === 'custom_position') {
      const slotPart = this.slotName
        ? // The purple custom_position color already signals the kind — drop the
          // "Custom · " prefix so the named-slot badge stays narrow, symmetric
          // with how the manual badge drops "Manual · " when a clock is shown.
          this.slotName
        : this.slotNumber !== undefined
          ? `${base} #${this.slotNumber}`
          : base;
      const pctPart =
        this.pct !== undefined && this.pct !== null ? ` · ${Math.round(this.pct)}%` : '';
      const floorPart =
        this.minimumMode === true ? (this.hass ? t('badge.floor_suffix', this.hass) : ' ↥') : '';
      return `${slotPart}${pctPart}${floorPart}`;
    }
    if (kind === 'group') {
      // The who-won badge renders "N/M": N group-driven members over the full
      // roster. Fall back to the base label when counts aren't supplied (e.g.
      // the badge gallery renders the bare kind).
      if (this.groupCount === undefined || this.groupTotal === undefined) return base;
      return `${this.groupCount}/${this.groupTotal}`;
    }
    return base;
  }

  public static styles = css`
    :host {
      display: inline-flex;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      line-height: 1.4;
    }
    .badge-icon {
      --mdc-icon-size: 14px;
      line-height: 0;
      flex: 0 0 auto;
    }
    button.badge {
      /* Inherit only the family — the font shorthand would reset font-size to
         the page value and make the resumable (manual) badge larger than the
         span badges, which keep the .badge 0.75rem size. */
      font-family: inherit;
      border: none;
      cursor: pointer;
    }
    button.badge:hover {
      filter: brightness(0.92);
    }
    .badge.has-actions {
      /* Flex gap already spaces the label from the sibling action buttons. */
      gap: 4px;
    }
    .act {
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      color: inherit;
      font: inherit;
      line-height: 0;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      opacity: 0.85;
      --mdc-icon-size: 14px;
    }
    .act:hover {
      opacity: 1;
    }
    :host([compact]) .act {
      --mdc-icon-size: 12px;
    }
    .resume-icon {
      --mdc-icon-size: 14px;
      line-height: 0;
      flex: 0 0 auto;
      opacity: 0.85;
    }
    :host([compact]) .resume-icon {
      --mdc-icon-size: 12px;
    }
    :host([compact]) .badge {
      padding: 1px 6px;
      font-size: 0.7rem;
    }
    :host([compact]) .badge-icon {
      --mdc-icon-size: 12px;
    }
  `;
}
