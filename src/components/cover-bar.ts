import { LitElement, html, css, nothing, type TemplateResult, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { entityStateChanged } from '../lib/hass-change';
import type { CoverPositionAttributes, DiscoveredEntities } from '../types';
import {
  displayTarget,
  isOverrideDivergence,
  coverMotorDivergence,
  coverLogicalActuals,
} from '../lib/cover-position';
import { formatPercent } from '../lib/formatters';
import { AXIS_LABEL_I18N_KEYS } from '../const';
import { resolveAxes, type ResolvedAxis } from '../lib/axes';
import { setAxes } from '../lib/services';
import { t } from '../lib/i18n';
import { tooltip } from '../lib/tooltip';
import './tilt-bar';

@customElement('acp-cover-bar')
export class CoverBar extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered!: DiscoveredEntities;
  @property({ type: Boolean, reflect: true }) public compact = false;
  /** User-selected cover colour (config `cover_colors[0]`) — recolours the
   *  closed segment to match the compass cover wedge. Null falls back to
   *  `--primary-color`, exactly like the compass in single-entry mode. */
  @property({ attribute: false }) public coverColor: string | null = null;

  /** Live client-side preview for a Position track drag/keyboard-in-progress —
   *  set on pointerdown/pointermove, cleared on pointerup/pointercancel. Drives
   *  `.fill`/`.num` for the matching row only; never itself calls a service
   *  (the trailing native `click` after a drag commits via `_handleTrackClick`,
   *  exactly as it does for a plain tap today). */
  @state() private _dragPreview: { entityId: string; pct: number } | null = null;

  // Live positions come from `coverLogicalActuals`, which reads the target sensor's
  // `linear_actual_positions` (falling back to `actual_positions`); mismatches from the
  // position-mismatch binary. Both live on the same two entities, and per-cover friendly
  // names are effectively static, so those ids cover everything the bars render — skip
  // unrelated hass ticks.
  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.size > 1 || !changed.has('hass')) return true;
    const old = changed.get('hass') as HomeAssistant | undefined;
    const e = this.discovered?.entities;
    // Watch each resolved axis's target sensor (position + any secondary axis).
    // Secondary-axis actuals live on the cover entities (per-axis state attr),
    // not on a sensor attribute, so the managed covers stay in the watch list.
    const axisTargetIds = this.discovered
      ? resolveAxes(this.discovered)
          .map((a) => (a.targetRole ? e?.[a.targetRole] : undefined))
          .filter((id): id is string => !!id)
      : [];
    return entityStateChanged(old, this.hass, [
      ...axisTargetIds,
      e?.position_mismatch_binary,
      e?.manual_override_binary,
      ...(this.discovered?.managed_covers ?? []),
    ]);
  }

  private _target(): { target: number | null; covers: Record<string, number | null> } {
    const id = this.discovered.entities.target_position_sensor;
    if (!id) return { target: null, covers: {} };
    const st = this.hass.states[id];
    if (!st) return { target: null, covers: {} };
    return {
      // During a diverging manual override the sensor state is the held value;
      // surface the solar would-be target instead so the label and marker match
      // the compass and reveal the held-vs-target gap (#158).
      target: displayTarget(this.hass, this.discovered),
      // Logical frame, so the per-cover fills are commensurable with the
      // linear-preferred target marker on an inverse_state entry (#234).
      covers: coverLogicalActuals(this.hass, this.discovered),
    };
  }

  /** Per-cover in-transit direction from the target sensor's `transit_states`
   *  attribute (guarded like {@link _target}). No-feedback covers publish this
   *  while mid-move; absent/empty otherwise. */
  private _transit(): Record<string, 'opening' | 'closing'> {
    const id = this.discovered.entities.target_position_sensor;
    if (!id) return {};
    const st = this.hass.states[id];
    if (!st) return {};
    const attrs = st.attributes as unknown as CoverPositionAttributes;
    return attrs?.transit_states ?? {};
  }

  private _mismatched(): Set<string> {
    const id = this.discovered.entities.position_mismatch_binary;
    if (!id) return new Set();
    const st = this.hass.states[id];
    if (st?.state !== 'on') return new Set();
    const entities = (st.attributes as { entities?: Record<string, { mismatch: boolean }> })
      .entities;
    if (!entities) return new Set();
    return new Set(
      Object.entries(entities)
        .filter(([, v]) => v.mismatch)
        .map(([k]) => k),
    );
  }

  /** Move a single axis for a cover. Routes through {@link setAxes}, which uses
   *  the integration's combined `set_axes` when available and falls back to the
   *  legacy per-axis service otherwise. Interactive drags omit `force` so the
   *  service default (no forced override) preserves today's semantics. */
  private _setAxis(entityId: string, axisId: string, value: number): void {
    setAxes(this.hass, entityId, { [axisId]: value });
  }

  /** Solar target for an axis from its target sensor's state, or null when the
   *  sensor is absent / non-numeric. */
  private _axisTarget(axis: ResolvedAxis): number | null {
    const role = axis.targetRole;
    if (!role) return null;
    const id = this.discovered.entities[role];
    if (!id) return null;
    const v = parseFloat(this.hass.states[id]?.state ?? '');
    return Number.isNaN(v) ? null : v;
  }

  /** Live value for a secondary axis from the cover's per-axis state attribute. */
  private _axisActual(axis: ResolvedAxis, entityId: string): number | null {
    if (!axis.stateAttr) return null;
    const v = this.hass.states[entityId]?.attributes?.[axis.stateAttr];
    return typeof v === 'number' ? v : null;
  }

  /** Motor value to disclose in the Target chip's tooltip — the raw
   *  Cover_Position sensor state — when it diverges from the linear-preferred
   *  display value, else null (issue #219). See {@link coverMotorDivergence}. */
  private _motorDivergence(): number | null {
    return coverMotorDivergence(this.hass, this.discovered);
  }

  /** Display label for an axis: card i18n key wins for known ids, else the
   *  discovery label, else a capitalized id (already baked into axis.label). */
  private _axisLabel(axis: ResolvedAxis): string {
    const key = AXIS_LABEL_I18N_KEYS[axis.id];
    return key ? t(key, this.hass) : axis.label;
  }

  /** Header target chip for a secondary axis. Tilt keeps its dedicated i18n
   *  string; any other axis reads `Label: pct`. */
  private _axisTargetLabel(axis: ResolvedAxis, target: number | null): string {
    if (axis.id === 'tilt') {
      return t('covers.tilt_target', this.hass, { pct: formatPercent(target) });
    }
    return `${this._axisLabel(axis)}: ${formatPercent(target)}`;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.discovered) return nothing;
    const { target, covers } = this._target();
    const mismatched = this._mismatched();
    // A mismatch during a manual override is intentional (the user is holding
    // the cover away from the solar target), so don't flag it as an alert — the
    // marker/fill gap already shows it. Keep the badge for genuine mismatches.
    const overrideDivergence = isOverrideDivergence(this.hass, this.discovered);
    const motorDivergence = this._motorDivergence();
    const transit = this._transit();
    const entries = Object.entries(covers);
    if (entries.length === 0) {
      return html`<div class="placeholder">${t('covers.placeholder', this.hass)}</div>`;
    }
    // Data-driven axes: the position axis renders through the rich `_bar()`;
    // every other declared axis (e.g. venetian tilt) renders through the
    // generalized axis-bar. On an older integration `resolveAxes` synthesizes
    // the same position (+ optional tilt) set, so output is unchanged.
    const axes = resolveAxes(this.discovered);
    const secondaryAxes = axes.filter((a) => a.id !== 'position');
    const secondaryTargets = new Map(secondaryAxes.map((a) => [a.id, this._axisTarget(a)]));
    return html`
      <div class="wrap" style=${this.coverColor ? `--acp-cover-color:${this.coverColor}` : nothing}>
        <div class="head">
          <span class="label">${t('covers.title', this.hass)}</span>
          <span class="targets">
            <span
              class="target"
              ${motorDivergence !== null
                ? tooltip(
                    t('covers.target_tooltip_motor', this.hass, {
                      pct: motorDivergence,
                    }),
                  )
                : nothing}
              >${t(overrideDivergence ? 'covers.target_solar' : 'covers.target', this.hass, {
                pct: formatPercent(target),
              })}</span
            >
            ${secondaryAxes.map(
              (axis) =>
                html`<span class="target"
                  >${this._axisTargetLabel(axis, secondaryTargets.get(axis.id) ?? null)}</span
                >`,
            )}
          </span>
        </div>
        ${entries.map(
          ([id, actual]) => html`
            <div class="cover-group">
              ${this._bar(
                id,
                actual,
                target,
                mismatched.has(id),
                overrideDivergence,
                transit[id] ?? null,
              )}
              ${secondaryAxes.map(
                (axis) =>
                  html`<acp-tilt-bar
                    .hass=${this.hass}
                    .label=${this._axisLabel(axis)}
                    .min=${axis.min}
                    .max=${axis.max}
                    .unit=${axis.unit}
                    .actual=${this._axisActual(axis, id)}
                    .target=${secondaryTargets.get(axis.id) ?? null}
                    .coverColor=${this.coverColor}
                    .compact=${this.compact}
                    @acp-tilt-set=${(e: CustomEvent<number>) =>
                      this._setAxis(id, axis.id, e.detail)}
                  ></acp-tilt-bar>`,
              )}
            </div>
          `,
        )}
      </div>
    `;
  }

  private _bar(
    entityId: string,
    actual: number | null,
    target: number | null,
    mismatch: boolean,
    overrideDivergence: boolean,
    transitDir: 'opening' | 'closing' | null,
  ): TemplateResult {
    const friendly =
      (this.hass.states[entityId]?.attributes?.friendly_name as string | undefined) ?? entityId;
    const actualPct = actual ?? 0;
    const targetPct = target ?? 0;
    // A drag/keyboard gesture in progress for this row overrides the server-truth
    // percentage in the fill bar and the percent readout; every other row (and
    // this row once the drag ends) renders from `actual` unchanged.
    const dragPct = this._dragPreview?.entityId === entityId ? this._dragPreview.pct : null;
    const fillPct = dragPct ?? actualPct;
    const numText = dragPct !== null ? formatPercent(dragPct) : formatPercent(actual);
    return html`
      <div class="cover ${mismatch ? 'mismatch' : ''}">
        <div
          class="name"
          role="button"
          tabindex="0"
          @click=${this._openMoreInfo}
          @keydown=${this._onNameKeydown}
          ${tooltip(entityId)}
        >
          ${friendly}
        </div>
        <div class="num">
          ${transitDir
            ? html`<ha-icon
                class="transit transit-${transitDir}"
                icon=${transitDir === 'opening' ? 'mdi:arrow-up-thin' : 'mdi:arrow-down-thin'}
                ${tooltip(t('covers.' + transitDir, this.hass))}
              ></ha-icon>`
            : nothing}${numText}
        </div>
        <div
          class="track"
          role="slider"
          tabindex="0"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${fillPct}
          aria-valuetext=${numText}
          aria-label=${t('covers.position_slider_label', this.hass)}
          @click=${(e: MouseEvent) => this._handleTrackClick(e, entityId)}
          @pointerdown=${(e: PointerEvent) => this._onTrackPointerDown(e, entityId)}
          @pointermove=${(e: PointerEvent) => this._onTrackPointerMove(e, entityId)}
          @pointerup=${() => this._onTrackPointerEnd(entityId)}
          @pointercancel=${() => this._onTrackPointerEnd(entityId)}
          @keydown=${(e: KeyboardEvent) => this._onTrackKeydown(e, entityId, actualPct)}
          ${tooltip(t('covers.click_to_set', this.hass))}
        >
          <div class="fill" style="width:${fillPct}%"></div>
          <div class="fill-closed" style="width:${100 - fillPct}%"></div>
          ${target !== null
            ? html`<div
                class="marker"
                style="left:clamp(1px, ${targetPct}%, calc(100% - 1px))"
                ${tooltip(
                  t(
                    overrideDivergence ? 'covers.target_tooltip_override' : 'covers.target_tooltip',
                    this.hass,
                    { pct: targetPct },
                  ),
                )}
              ></div>`
            : nothing}
        </div>
        ${mismatch && !overrideDivergence
          ? html`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`
          : nothing}
      </div>
    `;
  }

  /** Tapping a cover name opens the entry's more-info dialog. The bar is a
   *  generic component, so it emits a semantic event the host card handles
   *  (the Full card opens `<acp-more-info-dialog>`) rather than owning the
   *  dialog itself. Bubbles + composed so it crosses the shadow boundary. */
  private _openMoreInfo = (): void => {
    this.dispatchEvent(new CustomEvent('acp-open-more-info', { bubbles: true, composed: true }));
  };

  private _onNameKeydown = (ev: KeyboardEvent): void => {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    ev.preventDefault();
    this._openMoreInfo();
  };

  /** Shared clientX→0-100 track-fraction math, used by the click commit path
   *  and the drag-preview pointer handlers alike. */
  private _pctFromEvent(e: { clientX: number }, track: HTMLElement): number {
    const rect = track.getBoundingClientRect();
    const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    return Math.max(0, Math.min(100, pct));
  }

  private _handleTrackClick(e: MouseEvent, entityId: string): void {
    const track = e.currentTarget as HTMLElement;
    const clamped = this._pctFromEvent(e, track);
    this._setAxis(entityId, 'position', clamped);
  }

  /** Begin a drag: capture the pointer (best-effort — happy-dom may not
   *  implement it) and start the live client-side preview for this row. No
   *  `preventDefault()` here — suppressing it would also suppress the
   *  trailing compatibility `click` the commit path depends on. */
  private _onTrackPointerDown = (e: PointerEvent, entityId: string): void => {
    const track = e.currentTarget as HTMLElement;
    (track as HTMLElement & { setPointerCapture?: (id: number) => void }).setPointerCapture?.(
      e.pointerId,
    );
    this._dragPreview = { entityId, pct: this._pctFromEvent(e, track) };
  };

  /** Update the live preview while dragging. No-op for any row other than the
   *  one that owns the current drag. */
  private _onTrackPointerMove = (e: PointerEvent, entityId: string): void => {
    if (this._dragPreview?.entityId !== entityId) return;
    const track = e.currentTarget as HTMLElement;
    this._dragPreview = { entityId, pct: this._pctFromEvent(e, track) };
  };

  /** End of gesture: clear the preview for this row. Never calls a service —
   *  on pointerup, the browser's native trailing `click` fires and
   *  `_handleTrackClick` commits; on pointercancel there is no commit at all. */
  private _onTrackPointerEnd = (entityId: string): void => {
    if (this._dragPreview?.entityId !== entityId) return;
    this._dragPreview = null;
  };

  /** Standard WAI-ARIA slider keyboard pattern on the focused `.track`:
   *  Arrow keys step by 1, Page keys by 10, Home/End jump to the extremes.
   *  Commits immediately via `_setAxis` (no drag preview involved). */
  private _onTrackKeydown(e: KeyboardEvent, entityId: string, current: number): void {
    let next: number;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = current + 1;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = current - 1;
        break;
      case 'PageUp':
        next = current + 10;
        break;
      case 'PageDown':
        next = current - 10;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = 100;
        break;
      default:
        return;
    }
    e.preventDefault();
    const clamped = Math.max(0, Math.min(100, next));
    this._setAxis(entityId, 'position', clamped);
  }

  public static styles = css`
    :host {
      display: block;
    }
    .wrap {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .head {
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }
    .label {
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .targets {
      display: flex;
      gap: 12px;
    }
    .target {
      font-variant-numeric: tabular-nums;
    }
    /* Position + (optional) tilt row stack for one cover. */
    .cover-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .cover-group acp-tilt-bar {
      /* Indent the tilt row under the position track so the two read as one
         cover's two axes. Aligns roughly with the position bar's track column. */
      padding-left: 0;
    }
    .cover {
      display: grid;
      /* Final column is fixed at the warn-icon size (16px) rather than auto so
         the track (3fr) keeps the same width whether or not the badge renders —
         a toggling badge no longer reflows the bar graph (#158). */
      grid-template-columns: minmax(80px, 1fr) 48px 3fr 16px;
      gap: 8px;
      align-items: center;
      font-size: 0.82rem;
    }
    /* The cover name is a tap target that opens the entry's more-info dialog,
       so it carries a pointer cursor and a keyboard focus ring. It still hovers
       an entity-id tooltip, but click/Enter/Space open the dialog. */
    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      border-radius: 4px;
    }
    .name:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .track {
      position: relative;
      display: flex;
      height: 10px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.08));
      border-radius: 6px;
      cursor: pointer;
      overflow: hidden;
      /* A touch-drag must move the fill, not the page — own the gesture. */
      touch-action: none;
    }
    .track:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    :host([compact]) .track {
      height: 6px;
    }
    :host([compact]) .cover {
      font-size: 0.75rem;
      gap: 6px;
    }
    :host([compact]) .head {
      display: none;
    }
    /* Both segments derive from the cover colour (override, else --primary-color),
       distinguished by opacity: open is pale, closed is solid — "lighter = more
       open" — matching the compass FOV (light) vs cover wedge (solid) of the same
       hue. No gold, so nothing competes with the gold sun on the compass. */
    .fill {
      height: 100%;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--acp-cover-color, var(--primary-color)) 18%, transparent);
      transition: width 0.3s ease;
    }
    .fill-closed {
      height: 100%;
      flex-shrink: 0;
      background: color-mix(in srgb, var(--acp-cover-color, var(--primary-color)) 50%, transparent);
      transition: width 0.3s ease;
    }
    /* The marker is centred on its left value via translateX(-50%) and its
       left is clamped 1px inside the rail (inline), so the 2px box never gets
       clipped by .track { overflow:hidden } at the 0%/100% extremes (#158). */
    .marker {
      position: absolute;
      top: -2px;
      width: 2px;
      height: 14px;
      background: var(--accent-color, red);
      transform: translateX(-50%);
      transition: left 0.3s ease;
    }
    .num {
      font-variant-numeric: tabular-nums;
      text-align: right;
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      gap: 2px;
    }
    /* In-transit motion indicator for no-feedback covers: a small direction
       arrow beside the percent, sized to the .num text. */
    .transit {
      --mdc-icon-size: 1em;
      color: var(--primary-color);
      flex-shrink: 0;
    }
    @media (prefers-reduced-motion: no-preference) {
      .transit {
        animation: acp-transit-pulse 1.1s ease-in-out infinite;
      }
    }
    @keyframes acp-transit-pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.35;
      }
    }
    .warn {
      color: var(--warning-color, orange);
      --mdc-icon-size: 16px;
    }
    /* On a position mismatch the open segment is already gold, so recoloring it
       gold would be invisible — flag the divergence with the error colour and
       lean on the warn icon at the end of the row. */
    .mismatch .fill {
      background: color-mix(in srgb, var(--error-color, crimson) 35%, transparent);
    }
    .placeholder {
      color: var(--secondary-text-color);
      text-align: center;
      padding: 16px;
    }
  `;
}
