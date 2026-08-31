import { LitElement, html, css, nothing, type TemplateResult, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { entityStateChanged } from '../lib/hass-change';
import type { CoverPositionAttributes, DiscoveredEntities } from '../types';
import {
  displayTarget,
  isOverrideDivergence,
  coverMotorDivergence,
  coverLogicalActuals,
  logicalAxisValue,
} from '../lib/cover-position';
import { formatCoverState, formatPercent } from '../lib/formatters';
import { AXIS_LABEL_I18N_KEYS } from '../const';
import {
  axisDisplayValue,
  hasPositionAxis,
  positionAxisFor,
  resolveAxes,
  type ResolvedAxis,
} from '../lib/axes';
import { setAxes, hasSetAxes } from '../lib/services';
import { PendingMoves, isMovingState, isPendingVisible } from '../lib/pending-move';
import { RailGestures } from '../lib/rail-gestures';
import { renderRailOverlay, railOverlayStyles } from './rail-overlay';
import { renderRailFill, railFillStyles } from './rail-fill';
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

  /** Explicit rail order/subset, threaded down from the tile card's `covers`.
   *  Undefined leaves the integration's own order (the config flow's
   *  entity-pick order) untouched, which is every other caller's behavior. Ids
   *  the entry doesn't manage are ignored. */
  @property({ attribute: false }) public coverOrder?: string[];

  /** The shared drag-to-set contract — see `lib/rail-gestures.ts`. Keyed by
   *  cover entity_id so a drag paints `.fill`/`.num` for its own row only, and
   *  in the default `'click'` mode so the commit keeps riding the trailing
   *  native `click` into `_handleTrackClick`, exactly as a plain tap does. */
  private _rail = new RailGestures(this);

  /** Moves this bar commanded, keyed by cover entity_id — see
   *  `lib/pending-move.ts`. Keyed because the dialog stacks one track per
   *  managed cover and each must show only its own destination. */
  private _pending = new PendingMoves(this);

  /** Live position per cover as of the last render, for `updated()`'s arrival
   *  check. Plain field, not `@state`: writing it must not schedule a render. */
  private _lastLive = new Map<string, number | null>();

  protected override updated(): void {
    this._pending.settle((entityId) => this._lastLive.get(entityId) ?? null);
  }

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
    // Position only — a secondary axis is drawn by `acp-axis-bar`, which arms
    // its own indicator.
    if (axisId === 'position') this._pending.start(entityId, value);
    setAxes(this.hass, entityId, { [axisId]: value });
  }

  /**
   * Snap one cover to the target the row is already drawing a marker at.
   *
   * `force: true` — the integration reads that as "skip manual-override
   * engagement", NOT "move harder". That is deliberately the opposite of every
   * other write in this component: a drag means the user wants a value ACP did
   * not pick, so it engages an override to hold it. This button drives to the
   * value ACP picked ITSELF, and pinning automation at its own answer would
   * freeze the cover the moment it was re-synced. So the move lands and the
   * pipeline stays in charge to re-decide on its next run.
   *
   * Rendered only when the integration exposes `set_axes` (see the call site).
   * `setAxes` forwards `force` on that branch alone; the legacy per-axis fan-out
   * has no such flag, so on an older integration this button would have done the
   * exact OPPOSITE of its label — engaging a manual override that pins the cover
   * at ACP's own answer. A button that cannot keep its promise is not shown.
   *
   * Sends the LOGICAL target unconverted: the sensor already publishes it in the
   * logical frame, and `axisDisplayValue` is only for turning a DRAWN fraction
   * back into one (see `_handleTrackClick`). Running it through here would
   * mirror the value on a blind and drive the cover to its complement.
   */
  private _gotoTarget(entityId: string, target: number): void {
    this._pending.start(entityId, target);
    setAxes(this.hass, entityId, { position: target }, { force: true });
  }

  /** Solar target for an axis from its target sensor's state, or null when the
   *  sensor is absent / non-numeric.
   *
   *  For a genuine SECONDARY axis only. The axis whose target sensor is
   *  `Cover_Position` goes through the position pipeline instead — see
   *  `render()`'s `secondaryTargets`. */
  private _axisTarget(axis: ResolvedAxis): number | null {
    const role = axis.targetRole;
    if (!role) return null;
    const id = this.discovered.entities[role];
    if (!id) return null;
    const v = parseFloat(this.hass.states[id]?.state ?? '');
    return Number.isNaN(v) ? null : v;
  }

  /** Live value for a secondary axis from the cover's per-axis state attribute,
   *  normalized to the logical frame (issue #236). */
  private _axisActual(axis: ResolvedAxis, entityId: string): number | null {
    return logicalAxisValue(this.hass, axis, entityId);
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
    // An order that matches nothing falls back to the integration's own order,
    // for the same reason the tile does: a `covers` list whose entities were all
    // renamed must not blank the surface out entirely.
    const ordered = this.coverOrder?.length
      ? this.coverOrder
          .filter((id) => id in covers)
          .map((id): [string, number | null] => [id, covers[id]])
      : [];
    const entries = ordered.length > 0 ? ordered : Object.entries(covers);
    if (entries.length === 0) {
      return html`<div class="placeholder">${t('covers.placeholder', this.hass)}</div>`;
    }
    // Data-driven axes: the position axis renders through the rich `_bar()`,
    // which also owns the per-cover row chrome (name, state, mismatch badge);
    // every other declared axis (e.g. venetian tilt) renders through the
    // generalized axis-bar. On an older integration `resolveAxes` synthesizes
    // the same position (+ optional tilt) set, so output is unchanged.
    const axes = resolveAxes(this.discovered);
    const secondaryAxes = axes.filter((a) => a.id !== 'position');
    // A tilt-only cover type (`cover_tilt`, louvered roof) declares NO position
    // axis, so it gets no Position target chip, and `_bar()` drops the position
    // VALUE surfaces (track, marker, go-to-target, percent) while keeping the
    // row itself — its slat axis is a secondary axis here and renders through
    // `acp-tilt-bar`, which now finds its target on `Cover_Position` (issue
    // #277). True on every legacy/no-discovery entry, so this gate is inert
    // there.
    const hasPosition = hasPositionAxis(this.discovered);
    // Carries the rail polarity (`open_blocks_sun`), with the same synthesized
    // fallback every other surface uses — a local copy is how the three
    // fallbacks drifted apart in the first place.
    const positionAxis = positionAxisFor(this.discovered);
    // An axis whose target sensor IS `Cover_Position` — the entry's LEADING
    // axis, which on a tilt-only cover type is the slat axis (issue #277) —
    // takes the value the position path already piped off that sensor rather
    // than re-reading its raw STATE: `displayTarget` swaps in the solar
    // would-be target during a diverging manual override (#158) and prefers
    // the pre-interpolation `linear_position` otherwise (#219), and reading
    // the state here would show the HELD, post-interpolation number where a
    // position entry's rail shows the solar, linear one. A genuine SECONDARY
    // axis (a venetian's tilt) has its own `Cover_Tilt` sensor and keeps the
    // plain read — this pipeline describes one sensor, not one axis id.
    const secondaryTargets = new Map(
      secondaryAxes.map((a) => [
        a.id,
        a.targetRole === 'target_position_sensor' ? target : this._axisTarget(a),
      ]),
    );
    return html`
      <div class="wrap" style=${this.coverColor ? `--acp-cover-color:${this.coverColor}` : nothing}>
        <div class="head">
          <span class="label">${t('covers.title', this.hass)}</span>
          <span class="targets">
            ${hasPosition
              ? html`<span
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
                >`
              : nothing}
            ${secondaryAxes.map(
              (axis) =>
                html`<span
                  class="target"
                  ${axis.targetRole === 'target_position_sensor' && motorDivergence !== null
                    ? // Same sensor, same disclosure (#219): when interpolation
                      // bends the configured value away from the raw command,
                      // the chip discloses what was actually dispatched.
                      tooltip(
                        t('covers.target_tooltip_motor', this.hass, {
                          pct: motorDivergence,
                        }),
                      )
                    : nothing}
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
                positionAxis,
                hasPosition,
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
                    .openBlocksSun=${axis.openBlocksSun}
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

  /**
   * One managed cover's row.
   *
   * Renders two separable things: the row's own chrome — the friendly-name tap
   * target, the entity's state word, the mismatch badge — and the POSITION axis
   * surfaces: the track with its fill/target marker, the percent readout and the
   * go-to-target button. `hasPosition` drops only the second group, for a
   * tilt-only entry that declares no position axis (issue #277). The row itself
   * always renders: it is the only place a cover's name, more-info affordance
   * and mismatch alert appear, and an entry with two managed covers would
   * otherwise show two anonymous, identically-labelled slat bars.
   */
  private _bar(
    entityId: string,
    actual: number | null,
    target: number | null,
    mismatch: boolean,
    overrideDivergence: boolean,
    transitDir: 'opening' | 'closing' | null,
    axis: ResolvedAxis,
    hasPosition: boolean,
  ): TemplateResult {
    const friendly =
      (this.hass.states[entityId]?.attributes?.friendly_name as string | undefined) ?? entityId;
    const targetPct = target ?? 0;
    // A drag/keyboard gesture in progress for this row overrides the server-truth
    // percentage in the fill bar and the percent readout; every other row (and
    // this row once the drag ends) renders from `actual` unchanged.
    const dragPct = this._rail.preview(entityId);
    const numText = dragPct !== null ? formatPercent(dragPct) : formatPercent(actual);
    // What the track paints: the sun-blocking fraction, per the axis's own
    // `open_blocks_sun` polarity. The readout above stays the integration's
    // position value — only the geometry flips. See `axisDisplayValue`.
    // A cover with no reading draws EMPTY, not full: `actual ?? 0` fed through a
    // mirrored axis yields a completely filled track, which would read as
    // "fully blocking" for a cover that has told us nothing.
    const drawnValue = dragPct ?? actual;
    const fillPct = drawnValue === null ? 0 : axisDisplayValue(drawnValue, axis);
    const markerPct = axisDisplayValue(targetPct, axis);
    // "Open · 25%", the same readout the tile card shows. A no-feedback cover's
    // in-transit direction is folded in as the state word ("Opening"), which is
    // why the separate arrow glyph below only renders when there is no state
    // text to say it — otherwise the row states the same thing twice.
    // Null (and so omitted) for an unavailable cover, leaving the bare percent.
    const stateText = formatCoverState(this.hass, entityId, transitDir ?? undefined);
    this._lastLive.set(entityId, actual);
    // An explicit command wins over the automatic-move hint; an automatic move
    // is evidenced by the entity being in motion, heading for the tick already
    // drawn. Suppressed mid-drag, where the preview answers the same question.
    const autoMoving =
      isMovingState(this.hass.states[entityId]?.state) && target !== null ? targetPct : null;
    const commanded = dragPct !== null ? null : (this._pending.get(entityId) ?? autoMoving);
    // See `acp-axis-bar`: a destination the cover is already at never settles.
    const pending = isPendingVisible(actual, commanded) ? commanded : null;
    const pendingPct = pending === null ? null : axisDisplayValue(pending, axis);
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
          ${transitDir && !stateText
            ? html`<ha-icon
                class="transit transit-${transitDir}"
                icon=${transitDir === 'opening' ? 'mdi:arrow-up-thin' : 'mdi:arrow-down-thin'}
                ${tooltip(t('covers.' + transitDir, this.hass))}
              ></ha-icon>`
            : nothing}${stateText
            ? // The separator only earns its place between two halves. With no
              // position axis the state word is the whole readout, so it trails
              // no dangling "·".
              html`<span class="num-state">${stateText}</span>${hasPosition
                  ? html`<span class="num-sep"> · </span>`
                  : nothing}`
            : nothing}${hasPosition
            ? html`<span class="num-pct">${numText}</span>`
            : stateText || transitDir
              ? nothing
              : // Nothing else made it into the cell: `formatCoverState` returns
                // null for an unavailable cover and there is no transit glyph
                // either, so dropping the percent as well would leave the
                // readout completely blank — a dead row with nothing saying so.
                // The position path never blanks; it always emits `.num-pct`,
                // which renders `formatPercent(null)` = "—" when there is no
                // value. Same cell, same placeholder (issue #277).
                html`<span class="num-pct">${formatPercent(null)}</span>`}
        </div>
        ${hasPosition
          ? html`<div
              class="track"
              role="slider"
              tabindex="0"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow=${fillPct}
              aria-valuetext=${t('covers.position_open_value', this.hass, { pct: numText })}
              aria-label=${t('covers.position_slider_label', this.hass)}
              @click=${(e: MouseEvent) => this._handleTrackClick(e, entityId, axis)}
              @pointerdown=${(e: PointerEvent) => this._rail.pointerDown(e, entityId, axis)}
              @pointermove=${(e: PointerEvent) => this._rail.pointerMove(e, entityId, axis)}
              @pointerup=${() => this._rail.pointerUp(entityId)}
              @pointercancel=${() => this._rail.pointerCancel(entityId)}
              @keydown=${(e: KeyboardEvent) => this._onTrackKeydown(e, entityId, fillPct, axis)}
              ${tooltip(t('covers.click_to_set', this.hass))}
            >
              ${pending !== null && pendingPct !== null
                ? renderRailOverlay({
                    hass: this.hass,
                    liveFrac: fillPct,
                    pendingFrac: pendingPct,
                    pending,
                  })
                : nothing}
              ${renderRailFill({
                fillPct,
                closedPct: 100 - fillPct,
                target,
                targetPct: markerPct,
                tooltip:
                  target === null
                    ? undefined
                    : tooltip(
                        t(
                          overrideDivergence
                            ? 'covers.target_tooltip_override'
                            : 'covers.target_tooltip',
                          this.hass,
                          { pct: targetPct },
                        ),
                      ),
              })}
            </div>`
          : // The row is a grid, so the track column has to be HELD, not
            // collapsed: dropping the element outright slides the trailing
            // spacer and the warn badge left into it, and offsets the slat
            // track that `acp-tilt-bar` draws directly below on a matching grid.
            html`<span class="track-spacer"></span>`}
        ${hasPosition && target !== null && hasSetAxes(this.hass)
          ? html`<button
              class="goto-target"
              type="button"
              aria-label=${t('covers.goto_target', this.hass, { pct: targetPct })}
              ${tooltip(t('covers.goto_target', this.hass, { pct: targetPct }))}
              @click=${() => this._gotoTarget(entityId, target)}
            >
              <ha-icon icon="mdi:target"></ha-icon>
            </button>`
          : html`<span class="goto-target-spacer"></span>`}
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

  /** The commit path for both a plain tap and the trailing compatibility
   *  `click` a real browser fires at the end of a drag. */
  private _handleTrackClick(e: MouseEvent, entityId: string, axis: ResolvedAxis): void {
    const track = e.currentTarget as HTMLElement;
    this._setAxis(entityId, 'position', this._rail.valueFromEvent(e, track, axis));
  }

  /** Standard WAI-ARIA slider keyboard pattern on the focused `.track`:
   *  Arrow keys step by 1, Page keys by 10, Home/End jump to the extremes.
   *  Commits immediately via `_setAxis` (no drag preview involved). `current`
   *  is the DRAWN fill, so it goes through `axisDisplayValue` on the way in —
   *  the controller speaks logical values in both directions. */
  private _onTrackKeydown(
    e: KeyboardEvent,
    entityId: string,
    current: number,
    axis: ResolvedAxis,
  ): void {
    const next = this._rail.keydownValue(e, axisDisplayValue(current, axis), axis);
    if (next === null) return;
    this._setAxis(entityId, 'position', next);
  }

  public static styles = [
    railOverlayStyles,
    railFillStyles,
    css`
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
         a toggling badge no longer reflows the bar graph (#158).

         The readout column carries "Open · 25%" and is FIXED, not minmax: every
         row is its own grid, so an auto-sized track resolves to that row's own
         max-content and two rows with different state words would put their
         tracks at different x. A longer localized state (de "Geschlossen")
         ellipsises the state word instead — .num-pct is never truncated, so the
         percentage always survives.

         The go-to-target column is FIXED for the same reason the warn column is:
         it empties out whenever the entry has no target, and an auto column
         would hand those pixels to the track and reflow the bar graph. A spacer
         holds the cell instead. Keep in lock-step with acp-tilt-bar's .row.cover
         grid — they are separate grids stacked in one .cover-group. */
        grid-template-columns: minmax(80px, 1fr) 11ch 3fr 22px 16px;
        gap: 8px;
        align-items: center;
        font-size: 0.82rem;
      }
      /* Snap this cover to the marker's value. Sized and coloured like the row's
       other glyphs rather than like a control, so a row of covers does not read
       as a row of buttons — it lights up on hover/focus. */
      .goto-target {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        padding: 0;
        border: none;
        border-radius: 50%;
        background: none;
        cursor: pointer;
        color: var(--secondary-text-color);
        --mdc-icon-size: 16px;
        transition:
          color 0.15s ease,
          background 0.15s ease;
      }
      .goto-target:hover {
        color: var(--accent-color, var(--primary-color));
        background: color-mix(in srgb, currentColor 14%, transparent);
      }
      .goto-target:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 1px;
        color: var(--accent-color, var(--primary-color));
      }
      /* Floating-tooltip cursor lifecycle for this shadow root's INERT tooltip
       carriers: the transit arrow and the header target chip. Restated here
       because a shadow root cannot borrow its host's copy of this pair.

       Deliberately not a bare [data-tooltip] selector. The other three anchors
       in here are interactive and already carry the right cursor — .name is a
       role="button" that opens more-info, and .track / the tilt track are
       drag-to-set sliders — so a blanket rule would replace three correct
       pointers with a help cursor that promises information instead of action. */
      .transit[data-tooltip]:hover,
      .target[data-tooltip]:hover {
        cursor: help;
      }
      .transit[data-tooltip][acp-tt-shown],
      .target[data-tooltip][acp-tt-shown] {
        cursor: default;
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
      :host([compact]) .goto-target {
        width: 18px;
        height: 18px;
        --mdc-icon-size: 14px;
      }
      :host([compact]) .head {
        display: none;
      }
      .num {
        font-variant-numeric: tabular-nums;
        text-align: right;
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        gap: 2px;
        white-space: nowrap;
        min-width: 0;
        overflow: hidden;
      }
      /* The state word yields first; the percentage is the part that must never
       be cut, so it holds its intrinsic width. */
      .num-state {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .num-sep,
      .num-pct {
        flex: 0 0 auto;
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
      /* On a position mismatch, recolour the leading (sun-blocking) segment with
       the error colour and lean on the warn icon at the end of the row. It is
       the segment that carries the cover hue, so tinting it is what reads as a
       divergence rather than as a second cover colour. */
      .mismatch .fill {
        background: color-mix(in srgb, var(--error-color, crimson) 35%, transparent);
      }
      .placeholder {
        color: var(--secondary-text-color);
        text-align: center;
        padding: 16px;
      }
    `,
  ];
}
