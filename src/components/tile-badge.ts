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
    const groupHint = this._groupHint(kind);
    return html`<span
      class="badge kind-${kind}"
      style="background:${tokens.bg};color:${tokens.fg};"
      part="badge"
      ${groupHint ? tooltip(groupHint) : nothing}
      >${inner}</span
    >`;
  }

  /** Explanatory tooltip for the Cover Group count badge, whose "N/M" label is
   *  the one badge that doesn't state its own meaning. Every other kind carries
   *  it in the label text, so they get no tooltip. */
  private _groupHint(kind: BadgeKind): string | null {
    if (kind !== 'group') return null;
    if (this.groupCount === undefined || this.groupTotal === undefined) return null;
    // No `hass` guard: `t()` resolves to English for an undefined hass, so an
    // isolated render still gets the hint — same fallback the label relies on.
    return t('group.who_won', this.hass, { count: this.groupCount, total: this.groupTotal });
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
      /* Deliberately the same 4px every other badge uses. Only the Extend/Resume
         pair needs extra separation (see .act + .act) — and gap is a *container*
         property, so widening it here would re-space badge-icon/badge-label and
         badge-label/Extend as collateral. This container has 4 children normally
         and 3 in compact, so a widened gap costs 3x / 2x what the pair actually
         needs and leaves this badge spaced looser than every other badge for no
         functional reason. Scope the spacing to the pair instead. */
      gap: 4px;
    }
    .act {
      background: none;
      border: none;
      /* WCAG 2.2 SC 2.5.8 wants a 24px-minimum target. With zero padding the
         button box *is* the 14px glyph, so Resume and Extend become two sub-24px
         targets 4px apart on a touch tile — mis-tapping "extend the override"
         for "cancel the override". The padding grows the target to 24px and the
         matching negative margin pulls the box back onto the glyph's original
         footprint, so the badge lays out exactly as it did before. Padding and
         margin must stay equal and opposite, and sum with the glyph to 24. */
      box-sizing: border-box;
      padding: 5px;
      margin: -5px;
      min-width: 24px;
      min-height: 24px;
      color: inherit;
      font: inherit;
      line-height: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0.85;
      --mdc-icon-size: 14px;
    }
    .act:hover {
      opacity: 1;
    }
    :host([compact]) .act {
      /* Smaller glyph, same 24px target — so the padding takes up the slack. */
      --mdc-icon-size: 12px;
      padding: 6px;
      margin: -6px;
    }
    .act + .act {
      /* The negative margin on .act shrinks its *margin* box back to the glyph,
         but its 24px *border* box — the box that hit-tests — still bleeds padding
         px past that on every side. Left alone the two action buttons overlap, and
         Resume (later in DOM order, no z-index on either) paints last and wins,
         turning taps on the Extend glyph into "cancel the override".

         Separation between the two border boxes is
             Extend margin-right + container gap + Resume margin-left
           = -5 + 4 + margin-left
         so margin-left must be >= 1px to reach zero overlap; at 1px they abut
         exactly and both buttons get a true, unshared 24px target. This is NOT
         the "gap >= 2 x padding" the container-gap approach needed: overriding
         margin-left cancels this button's own negative margin instead of adding
         separation on top of it, so the number is much smaller. Only Resume
         matches — Extend follows the label, not an .act, and keeps its -5px.
         Costs 6px of badge width (margin-left -5 to 1), and unlike a widened
         container gap it costs it once rather than on every child boundary.
         Keep in sync with the padding on .act. */
      margin-left: 1px;
    }
    :host([compact]) .act + .act {
      /* Compact .act pads 6px a side, so zero overlap needs -6 + 4 + 2 = 0, i.e.
         margin-left >= 2px. NOT redundant with the rule above: ":host([compact])
         .act" is specificity (0,3,0) and its margin shorthand would re-clobber
         that (0,2,0) margin-left straight back to -6px. This selector is (0,4,0)
         and wins. Costs 8px of badge width (-6 to 2) — the compact has-actions
         branch already drops the kind icon and the "Manual · " prefix to buy that
         room back. */
      margin-left: 2px;
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
