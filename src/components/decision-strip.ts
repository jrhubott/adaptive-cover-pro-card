import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { HANDLER_LABELS, HANDLER_ORDER, type HandlerName } from '../const';
import type { DecisionTraceAttributes, DiscoveredEntities } from '../types';
import { formatPercent } from '../lib/formatters';

@customElement('acp-decision-strip')
export class DecisionStrip extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered!: DiscoveredEntities;
  @property({ type: Boolean, reflect: true }) public compact = false;

  private _trace(): {
    winner: string;
    reason: string;
    steps: Map<string, TraceRow>;
    enabledHandlers: string[] | undefined;
  } | null {
    const id = this.discovered.entities.decision_trace_sensor;
    if (!id) return null;
    const st = this.hass.states[id];
    if (!st) return null;
    const attrs = st.attributes as unknown as DecisionTraceAttributes;
    if (!attrs?.trace) return null;
    const steps = new Map<string, TraceRow>();
    for (const row of attrs.trace) {
      steps.set(normalizeHandler(row.handler), {
        matched: row.matched,
        reason: row.reason,
        position: row.position,
      });
    }
    return {
      winner: st.state,
      reason: attrs.reason ?? '',
      steps,
      enabledHandlers: attrs.enabled_handlers,
    };
  }

  @property({ type: Boolean, reflect: true, attribute: 'hide-inactive' }) public hideInactive =
    false;

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.discovered) return nothing;
    const t = this._trace();
    if (!t) return html`<div class="placeholder">Decision trace not yet populated.</div>`;
    const disabled = computeDisabledHandlers(t.enabledHandlers);
    const visible = selectVisibleHandlers(
      HANDLER_ORDER,
      t.steps,
      t.winner,
      this.hideInactive,
      disabled,
    );
    return html`
      <div class="wrap">
        <div class="head">
          <span class="label">Pipeline</span>
          <span class="winner">Winner: ${t.winner}</span>
        </div>
        <div class="rows">${visible.map((h) => this._row(h, t.steps.get(h), t.winner === h))}</div>
        <div class="reason dim">${t.reason}</div>
      </div>
    `;
  }

  private _row(h: HandlerName, row: TraceRow | undefined, isWinner: boolean): TemplateResult {
    const matched = row?.matched ?? false;
    const reason = row?.reason ?? 'not evaluated';
    const pos = row?.position;
    return html`
      <div class="row ${isWinner ? 'winner' : matched ? 'match' : 'skip'}">
        <span class="name">${HANDLER_LABELS[h]}</span>
        <span class="dots" aria-hidden="true">${matched ? '████' : '────'}</span>
        <span class="pos">${pos !== null && pos !== undefined ? formatPercent(pos) : ''}</span>
        <span class="reason-inline dim">${reason}</span>
        ${isWinner ? html`<span class="badge">✓</span>` : nothing}
      </div>
    `;
  }

  public static styles = css`
    :host {
      display: block;
    }
    .wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .head {
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      margin-bottom: 2px;
    }
    .label {
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .rows {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .row {
      display: grid;
      grid-template-columns: 112px 52px 48px 1fr auto;
      align-items: center;
      gap: 6px;
      padding: 3px 6px;
      border-radius: 4px;
      font-size: 0.8rem;
      line-height: 1.3;
    }
    :host([compact]) .row {
      grid-template-columns: 96px 36px 40px 1fr auto;
      font-size: 0.72rem;
      padding: 1px 4px;
    }
    :host([compact]) .reason {
      display: none;
    }
    :host([compact]) .head {
      display: none;
    }
    .row.skip {
      opacity: 0.55;
    }
    .row.match {
      background: rgba(255, 193, 7, 0.08);
    }
    .row.winner {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-weight: 600;
    }
    .row.winner .dim {
      color: inherit;
      opacity: 0.85;
    }
    .name {
      font-weight: 500;
    }
    .dots {
      font-family: 'ui-monospace', monospace;
      letter-spacing: -1px;
    }
    .pos {
      font-variant-numeric: tabular-nums;
      text-align: right;
    }
    .reason-inline {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .badge {
      font-weight: 700;
      padding-left: 4px;
    }
    .reason {
      font-size: 0.78rem;
      font-style: italic;
      margin-top: 2px;
    }
    .dim {
      color: var(--secondary-text-color);
    }
    .placeholder {
      color: var(--secondary-text-color);
      padding: 16px;
      text-align: center;
    }
  `;
}

/** Pure helper: derive the set of handlers to hide from the integration's
 *  `enabled_handlers` attribute on the decision_trace sensor. Fail-open when
 *  the attribute is absent (older integration) — show all handlers. */
export function computeDisabledHandlers(
  enabledHandlers: readonly string[] | undefined,
): Set<HandlerName> {
  if (!enabledHandlers) return new Set();
  const enabled = new Set<string>(enabledHandlers);
  return new Set(HANDLER_ORDER.filter((h) => !enabled.has(h)));
}

export function selectVisibleHandlers(
  order: readonly HandlerName[],
  steps: Map<string, { matched: boolean }>,
  winner: string,
  hideInactive: boolean,
  disabledHandlers: ReadonlySet<HandlerName> = new Set(),
): HandlerName[] {
  return order.filter((h) => {
    if (h === winner) return true;
    if (disabledHandlers.has(h)) return false;
    if (hideInactive && steps.get(h)?.matched !== true) return false;
    return true;
  });
}

interface TraceRow {
  matched: boolean;
  reason: string;
  position: number | null;
}

/** Integration sometimes emits handler names with title case or class names;
 *  normalize to the ControlMethod-style lowercase snake used in HANDLER_ORDER. */
function normalizeHandler(raw: string): string {
  return raw
    .replace(/Handler$/, '')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/^force_override$/, 'force')
    .replace(/^weather_override$/, 'weather')
    .replace(/^manual_override$/, 'manual')
    .replace(/^motion_timeout$/, 'motion')
    .replace(/^cloud_suppression$/, 'cloud');
}
