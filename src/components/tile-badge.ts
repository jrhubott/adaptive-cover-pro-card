import { LitElement, html, css, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BADGE_KINDS_BY_HANDLER, BADGE_TOKENS, type BadgeKind, type HandlerName } from '../const';
import { normalizeHandler } from '../lib/decision-summary';
import { formatClock } from '../lib/formatters';

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

  protected render(): TemplateResult {
    const kind = this._kind();
    const tokens = BADGE_TOKENS[kind];
    const label = this._label(kind, tokens.label);
    return html`<span
      class="badge kind-${kind}"
      style="background:${tokens.bg};color:${tokens.fg};"
      part="badge"
      >${label}</span
    >`;
  }

  private _kind(): BadgeKind {
    const normalized = normalizeHandler(this.winner) as HandlerName;
    return BADGE_KINDS_BY_HANDLER[normalized] ?? 'auto';
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
        ? `${base} · ${this.slotName}`
        : this.slotNumber !== undefined
          ? `${base} #${this.slotNumber}`
          : base;
      const pctPart =
        this.pct !== undefined && this.pct !== null ? ` · ${Math.round(this.pct)}%` : '';
      const floorPart = this.minimumMode === true ? ' floor' : '';
      return `${slotPart}${pctPart}${floorPart}`;
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
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      line-height: 1.4;
    }
    :host([compact]) .badge {
      padding: 1px 6px;
      font-size: 0.7rem;
    }
  `;
}
