import { LitElement, html, css, nothing, type TemplateResult, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { entityStateChanged } from '../lib/hass-change';
import type { CoverPositionAttributes, DiscoveredEntities } from '../types';
import { displayTarget, isOverrideDivergence } from '../lib/cover-position';
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

  // Live positions come from the target sensor's `actual_positions`; mismatches from the
  // position-mismatch binary. Per-cover friendly names are effectively static, so those
  // two ids cover everything the bars render — skip unrelated hass ticks.
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
    const attrs = st.attributes as unknown as CoverPositionAttributes;
    return {
      // During a diverging manual override the sensor state is the held value;
      // surface the solar would-be target instead so the label and marker match
      // the compass and reveal the held-vs-target gap (#158).
      target: displayTarget(this.hass, this.discovered),
      covers: attrs?.actual_positions ?? {},
    };
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
            <span class="target"
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
              ${this._bar(id, actual, target, mismatched.has(id), overrideDivergence)}
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
  ): TemplateResult {
    const friendly =
      (this.hass.states[entityId]?.attributes?.friendly_name as string | undefined) ?? entityId;
    const actualPct = actual ?? 0;
    const targetPct = target ?? 0;
    return html`
      <div class="cover ${mismatch ? 'mismatch' : ''}">
        <div class="name" ${tooltip(entityId)}>${friendly}</div>
        <div class="num">${formatPercent(actual)}</div>
        <div
          class="track"
          @click=${(e: MouseEvent) => this._handleTrackClick(e, entityId)}
          ${tooltip(t('covers.click_to_set', this.hass))}
        >
          <div class="fill" style="width:${actualPct}%"></div>
          <div class="fill-closed" style="width:${100 - actualPct}%"></div>
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

  private _handleTrackClick(e: MouseEvent, entityId: string): void {
    const track = e.currentTarget as HTMLElement;
    const rect = track.getBoundingClientRect();
    const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const clamped = Math.max(0, Math.min(100, pct));
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
    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* The cover name hints with a help cursor; the track is clickable and keeps
       its pointer cursor (it is excluded from the help rule below). Both revert
       to their natural cursor once OUR bubble is shown. */
    .name[data-tooltip]:hover {
      cursor: help;
    }
    .name[data-tooltip][acp-tt-shown] {
      cursor: default;
    }
    .track {
      position: relative;
      display: flex;
      height: 10px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.08));
      border-radius: 6px;
      cursor: pointer;
      overflow: hidden;
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
