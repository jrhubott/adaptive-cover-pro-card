import { LitElement, html, svg, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import {
  BADGE_ICONS,
  BADGE_I18N_KEYS,
  BADGE_KINDS_BY_HANDLER,
  BADGE_TOKENS,
  CONTROL_STATUS_ACTIVE,
  CONTROL_STATUS_I18N_KEYS,
  EVENT_SEVERITY,
  HANDLER_I18N_KEYS,
  HISTORY_DEFAULT_HOURS,
  HISTORY_HOUR_CHOICES,
  STATE_TRACKS,
  type BadgeKind,
  type EntityRole,
  type HandlerName,
} from '../const';
import { spanFractionX, percentToY } from '../lib/geometry';
import { aggregatePerCover, fetchCoverAxisHistory } from '../lib/position-history';
import { positionAxisInverted, resolveAxes } from '../lib/axes';
import { summarize, formatSpan, type HistoryStats } from '../lib/history-stats';
import { aboveHorizonSegments, sampleDay, startOfDay } from '../lib/sun-model';
import { fetchStateHistory, stepExpand, toBands, toNumericSeries } from '../lib/state-history';
import { fetchEventTimeline, hasGetDiagnostics } from '../lib/event-timeline';
import { fetchLogbook, groupByDay, initials } from '../lib/logbook';
import { buildActivity } from '../lib/activity';
import { formatClock } from '../lib/formatters';
import { startMinuteTimer } from '../lib/minute-timer';
import { t } from '../lib/i18n';
import { tooltip } from '../lib/tooltip';
import type {
  AcpEvent,
  ActivityRow,
  DiscoveredEntities,
  EventTimeline,
  HistoryBand,
  HistoryTracksConfig,
  LogbookEntry,
  PositionHistorySample,
} from '../types';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/** Refetch the recorder/logbook data every N minute-timer ticks. The minute
 *  timer redraws the "now" cursor each minute; a full refetch that often would
 *  hammer the recorder for a view that changes slowly. */
const REFETCH_EVERY_MINUTES = 5;

/** A band narrower than this (in % of the track) has no room for its label. */
const LABEL_MIN_PCT = 6;

/** Which section currently owns the whole surface, or null for the normal
 *  stacked layout. */
export type MaximizedSection = 'tracks' | 'activity' | 'events' | null;

/**
 * The History view — every recorded ACP series for one config entry on a shared
 * time axis, an HA-style Activity feed, and an Advanced section exposing the
 * integration's diagnostic event buffer.
 *
 * Hosted two ways (both render this same element):
 *   - standalone as `adaptive-cover-pro-history-card`, and
 *   - in `acp-history-dialog`, opened from the tile / root / decision cards.
 *
 * Deliberately mirrors what HA's own more-info dialog gives you for a single
 * entity — a labeled state-timeline bar plus an attributed Activity list, each
 * with a "Show more" link into the matching HA panel — and then adds what HA
 * cannot know: which pipeline handler won, and what position ACP actually
 * commanded.
 *
 * Five data sources, all degrading independently to "section omitted":
 *   - **Target** — recorder history of the `Cover_Position` sensor, whose state
 *     is the commanded position.
 *   - **Actual** — recorder history of the physical covers' `current_position`
 *     ({@link fetchPositionHistory}).
 *   - **Who won** — recorder history of `control_status`, whose state IS the
 *     winning handler name.
 *   - **Entity states** — recorder history of the switches and binary sensors
 *     in {@link STATE_TRACKS}, drawn as HA-style labeled bands.
 *   - **Activity** — HA's logbook merged with ACP's command events, so a row
 *     carries both who did it and which position was commanded (see
 *     `lib/activity.ts`).
 *
 * The event buffer is the odd one out: it is NOT recorder-backed. It is
 * in-memory in the coordinator and only reachable over the `get_diagnostics`
 * service call — see `lib/event-timeline.ts`. It is fetched whenever the
 * Activity feed needs its command parameters, and reused by Advanced.
 */
@customElement('acp-history-view')
export class HistoryView extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered!: DiscoveredEntities;

  /** Window length in hours, counting back from now. */
  @property({ type: Number }) public hours = HISTORY_DEFAULT_HOURS;
  /** Per-track opt-out; omitted tracks default on. */
  @property({ attribute: false }) public tracks?: HistoryTracksConfig;
  /** Seed for the Advanced section's expanded state. */
  @property({ type: Boolean }) public advancedOpen = false;
  /** Suppress the Advanced section entirely. */
  @property({ type: Boolean }) public hideAdvanced = false;
  /** Render the in-card window-length picker. */
  @property({ type: Boolean }) public showWindowPicker = true;
  /**
   * Gate for fetching. The dialog host keeps this element in the DOM while
   * closed, and a closed dialog must not hit the recorder — mirrors the
   * `open`-gating in `more-info-dialog.ts`.
   */
  @property({ type: Boolean }) public active = true;

  @state() private _target: Array<{ t: number; value: number }> = [];
  @state() private _actual: PositionHistorySample[] = [];
  /** Per-cover actual position, drawn as faint companions to the aggregate so a
   *  single cover that failed to move is visible instead of averaged away. */
  @state() private _perCover: Record<string, PositionHistorySample[]> = {};
  /** Venetian second axis: ACP's tilt target and the covers' recorded tilt. */
  @state() private _tiltTarget: Array<{ t: number; value: number }> = [];
  @state() private _tiltActual: Record<string, PositionHistorySample[]> = {};
  @state() private _copied = false;
  @state() private _whoWon: HistoryBand[] = [];
  /** `control_status` over time — WHY the integration was or wasn't commanding
   *  the cover. A different question from who-won, and a different sensor. */
  @state() private _controlStatus: HistoryBand[] = [];
  @state() private _stateBands: Partial<Record<EntityRole, HistoryBand[]>> = {};
  @state() private _activity: ActivityRow[] = [];
  @state() private _loading = false;
  @state() private _loaded = false;

  @state() private _timeline: EventTimeline | null = null;
  @state() private _eventFilter = '';
  @state() private _advanced = false;
  /**
   * Which section, if any, has been given the whole host.
   *
   * All three sections are height-starved when stacked: the charts get ~96px a
   * track, the Activity feed a 300px scroller, and the event buffer a ~260px
   * letterbox for a dense hundreds-of-row table. Maximizing withholds the other
   * sections and lets the chosen one use the full surface — and, in the dialog,
   * a wider and taller panel.
   *
   * Modelled as one target rather than three booleans so the states cannot
   * disagree about who owns the surface.
   */
  @state() private _maximized: MaximizedSection = null;

  /** Timestamp under the pointer, shared by every track so one hover reads the
   *  whole stack at that instant. Null when the pointer is away. */
  @state() private _hoverT: number | null = null;

  /** End of the rendered window. Held in state (not read from `Date.now()` at
   *  render time) so the fetched data and the drawn axis always agree — a
   *  refetch is what moves the window forward. */
  @state() private _now = Date.now();

  private _cancelMinuteTimer: (() => void) | null = null;
  private _minutesSinceFetch = 0;
  /** Identifies the in-flight fetch so a stale response can't overwrite a newer
   *  one (window changed, entry changed, dialog reopened). */
  private _fetchKey: string | null = null;

  private static readonly VIEW_W = 600;
  private static readonly POS_H = 96;
  private static readonly POS_H_MAX = 220;
  private static readonly POS_TOP_PAD = 8;

  /** Chart height. Maximizing the tracks has to make the PLOTS taller — the
   *  charts are fixed-height, so simply giving the section more room would add
   *  whitespace and resolve nothing. */
  private get _posH(): number {
    return this._maximized === 'tracks' ? HistoryView.POS_H_MAX : HistoryView.POS_H;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._advanced = this.advancedOpen;
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopMinuteTimer();
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has('advancedOpen')) this._advanced = this.advancedOpen;
    if (changed.has('_maximized')) this.toggleAttribute('maximized', this._maximized !== null);
    if (changed.has('active') && !this.active) {
      // Going inactive ends the session: drop the fetch key so REOPENING
      // refetches instead of serving a window that stopped moving when the
      // dialog closed (the minute timer is stopped while closed, so nothing
      // else would invalidate it), and leave maximized mode so the next open
      // lands on the normal stacked view.
      this._fetchKey = null;
      this._minutesSinceFetch = 0;
      if (this._maximized !== null) {
        this._maximized = null;
        this.dispatchEvent(
          new CustomEvent('acp-history-expand', {
            detail: { expanded: false, section: null },
            bubbles: true,
            composed: true,
          }),
        );
      }
    }
    this._syncMinuteTimer();
    this._maybeFetch();
  }

  /**
   * This view's content comes from the recorder, the logbook and a service
   * call — not from `hass.states` — and it owns its own refresh cadence. A
   * `hass` tick alone therefore changes nothing on screen, while re-rendering
   * costs every track SVG, a full `summarize()` pass and the day-grouped
   * activity + event tables. HA replaces `hass` several times a second on a
   * busy install, so skipping those renders matters. The property is still
   * assigned, so `this.hass` stays fresh for the next fetch.
   */
  protected shouldUpdate(changed: Map<string, unknown>): boolean {
    return changed.size > 1 || !changed.has('hass');
  }

  // ── data ──────────────────────────────────────────────────────────────────

  private get _entryId(): string | null {
    return this.discovered?.entry_id ?? null;
  }

  private _syncMinuteTimer(): void {
    if (this.active && this._cancelMinuteTimer === null) {
      this._cancelMinuteTimer = startMinuteTimer(() => {
        this._minutesSinceFetch += 1;
        if (this._minutesSinceFetch >= REFETCH_EVERY_MINUTES) {
          this._fetchKey = null; // force the key comparison to miss
          this._maybeFetch();
        } else {
          this.requestUpdate();
        }
      });
    } else if (!this.active) {
      this._stopMinuteTimer();
    }
  }

  private _stopMinuteTimer(): void {
    if (this._cancelMinuteTimer !== null) {
      this._cancelMinuteTimer();
      this._cancelMinuteTimer = null;
    }
  }

  private _maybeFetch(): void {
    if (!this.active || !this.hass || !this.discovered) return;
    const entryId = this._entryId;
    if (!entryId) return;
    const key = `${entryId}|${this.hours}|${positionAxisInverted(this.discovered)}`;
    if (key === this._fetchKey) return;
    this._fetchKey = key;
    this._minutesSinceFetch = 0;
    void this._fetch(key);
  }

  private async _fetch(key: string): Promise<void> {
    const hass = this.hass;
    const discovered = this.discovered;
    const now = Date.now();
    const start = now - this.hours * HOUR_MS;

    this._loading = true;
    this._now = now;

    const ent = discovered.entities;
    const covers = discovered.managed_covers ?? [];

    // The recorder holds the DISPATCHED position, which is cover-frame on an
    // `inverse_state` install. Flip both sides into the logical frame (#234) so
    // they agree with each other and with every other percentage the cards
    // show. The frame is part of the fetch key above for the same reason
    // `more-info-dialog.ts` keys on it: it can flip while the view is mounted.
    const inverted = positionAxisInverted(discovered);

    // The tilt axis carries its OWN inversion option in the integration
    // (`inverse_tilt`, #236) — independent of `inverse_state`, so it must be read
    // from the tilt axis rather than reusing the position flag.
    const tiltAxis = resolveAxes(discovered).find((a) => a.id === 'tilt');
    const tiltInverted = tiltAxis?.inverted ?? false;
    const hasTilt = !!tiltAxis;

    const stateIds: string[] = [];
    if (ent.target_position_sensor) stateIds.push(ent.target_position_sensor);
    if (hasTilt && ent.target_tilt_sensor) stateIds.push(ent.target_tilt_sensor);
    if (ent.control_status_sensor) stateIds.push(ent.control_status_sensor);
    if (ent.decision_trace_sensor) stateIds.push(ent.decision_trace_sensor);
    for (const track of STATE_TRACKS) {
      const id = ent[track.role];
      if (id) stateIds.push(id);
    }

    // Logbook covers the categorical entities plus the physical covers; HA drops
    // "continuous" sensors from the logbook itself (see lib/logbook.ts), so
    // asking for the numeric ones would just waste the query.
    const logbookIds = [...covers];
    for (const track of STATE_TRACKS) {
      const id = ent[track.role];
      if (id) logbookIds.push(id);
    }
    if (ent.control_status_sensor) logbookIds.push(ent.control_status_sensor);
    if (ent.decision_trace_sensor) logbookIds.push(ent.decision_trace_sensor);
    if (ent.last_action_sensor) logbookIds.push(ent.last_action_sensor);

    const wantActivity = this._show('actions');
    const wantPosition = this._show('position') && covers.length > 0;
    // ONE recorder query for both cover axes — position and tilt are two
    // attributes of the same rows, so a query per axis asks for identical data
    // twice, and the aggregate is derived from the per-cover result rather than
    // fetched a third time.
    const [axes, states, logbook, timeline] = await Promise.all([
      wantPosition
        ? fetchCoverAxisHistory(hass, covers, start, now, {
            inverted,
            tiltInverted,
            wantTilt: hasTilt,
          })
        : Promise.resolve({ position: {}, tilt: {} }),
      fetchStateHistory(hass, stateIds, start, now),
      wantActivity
        ? fetchLogbook(hass, logbookIds, start, now)
        : Promise.resolve([] as LogbookEntry[]),
      // Fetched eagerly (not only when Advanced opens) because the Activity feed
      // needs it: the logbook records the resulting state change but never the
      // service-call arguments, so the commanded position lives only here.
      // Advanced then reuses this result rather than issuing a second call.
      wantActivity || this._advanced
        ? fetchEventTimeline(hass, this._entryId ?? '')
        : Promise.resolve(null),
    ]);

    // A newer fetch started while we awaited — drop this response entirely.
    if (this._fetchKey !== key) return;

    this._actual = aggregatePerCover(axes.position);
    // Per-cover lines only earn their ink when there is more than one cover —
    // with a single cover they would exactly overdraw the aggregate.
    this._perCover = covers.length > 1 ? axes.position : {};
    this._tiltActual = axes.tilt;
    // NOT inverted: the `Cover_Tilt` sensor publishes `pipeline_result.tilt`,
    // which is already in the pre-inversion canonical frame — `inverse_tilt` is
    // applied downstream at dispatch, never to the sensor. Flipping here would
    // draw target and actual as exact mirror images and read as a permanent
    // tracking failure on every `inverse_tilt` install. (`cover-bar.ts`'s
    // `_axisTarget` reads it raw for the same reason.)
    this._tiltTarget =
      hasTilt && ent.target_tilt_sensor
        ? toNumericSeries(states[ent.target_tilt_sensor] ?? [])
        : [];
    this._target = ent.target_position_sensor
      ? toNumericSeries(states[ent.target_position_sensor] ?? [], {
          // `linear_position` is already logical, so it is never re-inverted.
          preferAttribute: 'linear_position',
          inverted,
        })
      : [];
    // The WINNING HANDLER lives on `decision_trace` (its state is the handler
    // name — the same source `more-info-dialog._winner()` and `decision-strip`
    // read). `control_status` is a different enum entirely (ControlStatus in the
    // integration's const.py) and reading it here made every band fall through
    // to the generic "Auto" badge, since none of its values are handler names.
    this._whoWon = ent.decision_trace_sensor
      ? toBands(states[ent.decision_trace_sensor] ?? [], start, now)
      : [];
    this._controlStatus = ent.control_status_sensor
      ? toBands(states[ent.control_status_sensor] ?? [], start, now)
      : [];

    const stateBands: Partial<Record<EntityRole, HistoryBand[]>> = {};
    for (const track of STATE_TRACKS) {
      const id = ent[track.role];
      if (!id) continue;
      stateBands[track.role] = toBands(states[id] ?? [], start, now);
    }
    this._stateBands = stateBands;

    if (timeline) this._timeline = timeline;
    this._activity = wantActivity
      ? buildActivity(hass, logbook, timeline?.events ?? [], {
          startMs: start,
          endMs: now,
          inverted,
        })
      : [];

    this._loading = false;
    this._loaded = true;
  }

  private _show(track: keyof HistoryTracksConfig): boolean {
    return this.tracks?.[track] !== false;
  }

  // ── interaction ───────────────────────────────────────────────────────────

  /**
   * Map the pointer onto the time axis.
   *
   * Measured against a `.track-plot`, NOT against the listening `.tracks`
   * container: `.tracks` spans both grid columns, so its left edge is the start
   * of the 96px label column, while every track's x-mapping starts at the plot
   * column. Using the container's rect shifts every reading right by the label
   * width plus the gap. The handler stays on the container so hovering the
   * labels still tracks; only the measurement basis is the plot.
   *
   * Every row shares the same grid column, so the first plot's geometry speaks
   * for all of them.
   */
  private _onPointerMove = (e: PointerEvent): void => {
    const plot = this.renderRoot.querySelector('.track-plot');
    if (!plot) return;
    const rect = plot.getBoundingClientRect();
    if (rect.width <= 0) return;
    const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this._hoverT = this._start + frac * (this._now - this._start);
  };

  private _onPointerLeave = (): void => {
    this._hoverT = null;
  };

  private _setHours(hours: number): void {
    if (hours === this.hours) return;
    this.hours = hours;
    this.dispatchEvent(
      new CustomEvent('acp-history-hours', { detail: { hours }, bubbles: true, composed: true }),
    );
  }

  private _refresh(): void {
    this._fetchKey = null;
    this._timeline = null;
    this._maybeFetch();
  }

  /** Enter/leave maximized mode for `section`; passing the section already
   *  maximized restores the normal stacked layout. The host dialog is told so it
   *  can widen — a card embedded in a dashboard column just fills its own box. */
  private _toggleMaximize(section: Exclude<MaximizedSection, null>): void {
    this._maximized = this._maximized === section ? null : section;
    // Maximizing the buffer straight from the collapsed disclosure must still
    // have data to show.
    if (this._maximized === 'events' && this._timeline === null) {
      void fetchEventTimeline(this.hass, this._entryId ?? '').then((tl) => {
        this._timeline = tl;
      });
    }
    this.dispatchEvent(
      new CustomEvent('acp-history-expand', {
        detail: { expanded: this._maximized !== null, section: this._maximized },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** Maximize/restore button for a section header. */
  private _maximizeButton(section: Exclude<MaximizedSection, null>): TemplateResult {
    const on = this._maximized === section;
    const label = on ? t('history.collapse', this.hass) : t('history.expand', this.hass);
    return html`<button
      type="button"
      class="icon-btn"
      @click=${() => this._toggleMaximize(section)}
      ${tooltip(label)}
      aria-label=${label}
      aria-pressed=${on ? 'true' : 'false'}
    >
      <ha-icon icon=${on ? 'mdi:arrow-collapse' : 'mdi:arrow-expand'}></ha-icon>
    </button>`;
  }

  private _toggleAdvanced(): void {
    this._advanced = !this._advanced;
    if (this._advanced && this._timeline === null) {
      void fetchEventTimeline(this.hass, this._entryId ?? '').then((tl) => {
        this._timeline = tl;
      });
    }
  }

  /**
   * Copy the whole `get_diagnostics` payload to the clipboard.
   *
   * The payload is already in memory whenever Advanced is open, so this turns
   * "please attach diagnostics to the issue" into one click for a reporter who
   * would otherwise have to find the integration page and download a file.
   * Copies the snapshot currently ON SCREEN rather than re-fetching, so the
   * attached dump matches what was being looked at.
   */
  private async _copyDiagnostics(): Promise<void> {
    const raw = this._timeline?.raw;
    if (raw === null || raw === undefined) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(raw, null, 2));
      this._copied = true;
      setTimeout(() => {
        this._copied = false;
      }, 2000);
    } catch {
      // Clipboard access is refused on insecure origins and by some browsers'
      // permission policies. Nothing actionable — leave the label unchanged
      // rather than claiming a copy that did not happen.
    }
  }

  /** Deep-link into one of HA's own panels, pre-filtered to these entities and
   *  this window — the "Show more" affordance HA puts on its own sections. */
  private _showMore(panel: 'history' | 'logbook', entityIds: string[]): void {
    const params = new URLSearchParams();
    if (entityIds.length > 0) params.set('entity_id', entityIds.join(','));
    params.set('start_date', new Date(this._start).toISOString());
    params.set('end_date', new Date(this._now).toISOString());
    const path = `/${panel}?${params.toString()}`;
    history.pushState(null, '', path);
    window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
    // Close any dialog hosting us so the navigation is visible.
    this.dispatchEvent(new CustomEvent('acp-history-closed', { bubbles: true, composed: true }));
  }

  // ── render ────────────────────────────────────────────────────────────────

  private get _start(): number {
    return this._now - this.hours * HOUR_MS;
  }

  /** Position of `t` across the window, as a 0–100 percentage. Band tracks are
   *  laid out in HTML (not SVG) so their labels stay crisp and ellipsize — a
   *  `preserveAspectRatio="none"` SVG would stretch every glyph horizontally. */
  private _pct(t: number): number {
    const span = this._now - this._start;
    if (!(span > 0)) return 0;
    return Math.max(0, Math.min(100, ((t - this._start) / span) * 100));
  }

  private _x(t: number): number {
    return spanFractionX(t, this._start, this._now, HistoryView.VIEW_W);
  }

  /** `PositionHistorySample[]` (ISO `t`) → the `{t, value}` shape `stepExpand`
   *  and `valueAt` share. Unparseable timestamps are dropped rather than
   *  plotted at `NaN`. */
  private _isoToPoints(series: PositionHistorySample[]): Array<{ t: number; value: number }> {
    return series
      .map((s) => ({ t: Date.parse(s.t), value: s.position }))
      .filter((p): p is { t: number; value: number } => !Number.isNaN(p.t));
  }

  /**
   * A curve build site's shared tail: step-expand a normalized series out to
   * the window end, then map every vertex through `_x()`/`yAt()` into a
   * `<polyline points="…">` string. This is render-local — the caller must
   * pass a fresh array (e.g. via `_isoToPoints`), never `this._target` /
   * `this._actual` / `this._perCover` / `this._tiltTarget` / `this._tiltActual`
   * directly-mutated, since `valueAt` and `history-stats.ts` still read those
   * fields verbatim for the hover readout and the moves/travel stats.
   */
  private _stepPoints(
    series: Array<{ t: number; value: number }>,
    yAt: (v: number) => number,
  ): string {
    return stepExpand(series, this._now)
      .map((p) => `${this._x(p.t).toFixed(1)},${yAt(p.value).toFixed(1)}`)
      .join(' ');
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.discovered) return nothing;
    if (this._maximized !== null) return this._renderMaximized();

    return html`
      <div class="history">
        ${this._renderToolbar()} ${this._renderStats()} ${this._renderReadout()}
        <div
          class="tracks"
          @pointermove=${this._onPointerMove}
          @pointerleave=${this._onPointerLeave}
        >
          ${this._show('position') ? this._renderPositionTrack() : nothing}
          ${this._show('position') ? this._renderTiltTrack() : nothing}
          ${this._show('who_won') ? this._renderWhoWonTrack() : nothing}
          ${this._show('who_won') ? this._renderControlStatusTrack() : nothing}
          ${this._show('context') ? this._renderStateTracks() : nothing} ${this._renderAxis()}
        </div>
        ${this._loading && !this._loaded
          ? html`<p class="dim">${t('history.loading', this.hass)}</p>`
          : nothing}
        ${this._show('actions') ? this._renderActivity() : nothing} ${this._renderAdvanced()}
      </div>
    `;
  }

  private _renderToolbar(): TemplateResult | typeof nothing {
    if (!this.showWindowPicker) return nothing;
    return html`
      <div class="toolbar">
        <div class="windows" role="group" aria-label=${t('history.window_label', this.hass)}>
          ${HISTORY_HOUR_CHOICES.map(
            (h) => html`
              <button
                type="button"
                class="chip ${h === this.hours ? 'on' : ''}"
                aria-pressed=${h === this.hours ? 'true' : 'false'}
                @click=${() => this._setHours(h)}
              >
                ${t('history.window_hours', this.hass, { hours: h })}
              </button>
            `,
          )}
        </div>
        <div class="toolbar-right">
          ${
            // In maximized mode the section header already carries the title,
            // the Show-more link and the restore control. Repeating them here
            // is what produced two maximize buttons on the same screen.
            this._maximized === null
              ? html`<button
                  type="button"
                  class="link"
                  @click=${() => this._showMore('history', this._allEntityIds())}
                >
                  ${t('history.show_more', this.hass)}
                </button>`
              : nothing
          }
          <button
            type="button"
            class="icon-btn"
            @click=${this._refresh}
            ${tooltip(t('history.refresh', this.hass))}
            aria-label=${t('history.refresh', this.hass)}
          >
            <ha-icon icon="mdi:refresh" class=${this._loading ? 'spin' : ''}></ha-icon>
          </button>
          ${this._maximized === null ? this._maximizeButton('tracks') : nothing}
        </div>
      </div>
    `;
  }

  /** Every entity this view draws — the "Show more" filter for HA's panels. */
  private _allEntityIds(): string[] {
    const ent = this.discovered.entities;
    const ids = [...(this.discovered.managed_covers ?? [])];
    if (ent.target_position_sensor) ids.push(ent.target_position_sensor);
    if (ent.control_status_sensor) ids.push(ent.control_status_sensor);
    if (ent.decision_trace_sensor) ids.push(ent.decision_trace_sensor);
    for (const track of STATE_TRACKS) {
      const id = ent[track.role];
      if (id) ids.push(id);
    }
    return ids;
  }

  /** Follow-along readout: what every track said at the hovered instant. */
  private _renderReadout(): TemplateResult {
    const hoverT = this._hoverT;
    if (hoverT === null) {
      return html`<div class="readout dim">${this._renderRangeLabel()}</div>`;
    }
    const parts: string[] = [formatStamp(hoverT)];

    const target = valueAt(this._target, hoverT);
    if (target !== null)
      parts.push(`${t('history.legend_target', this.hass)} ${Math.round(target)}%`);
    const actual = valueAt(
      this._actual.map((s) => ({ t: Date.parse(s.t), value: s.position })),
      hoverT,
    );
    if (actual !== null)
      parts.push(`${t('history.legend_actual', this.hass)} ${Math.round(actual)}%`);

    const winner = bandAt(this._whoWon, hoverT);
    if (winner) parts.push(this._handlerLabel(winner.state));
    const status = bandAt(this._controlStatus, hoverT);
    if (status && !CONTROL_STATUS_ACTIVE.has(status.state)) {
      parts.push(this._controlStatusLabel(status.state));
    }

    for (const track of STATE_TRACKS) {
      const band = bandAt(this._stateBands[track.role] ?? [], hoverT);
      if (band && isOn(band.state)) parts.push(t(track.key, this.hass));
    }
    return html`<div class="readout">${parts.join(' · ')}</div>`;
  }

  /** Window bounds. A window longer than a day must carry dates — "10:44 PM →
   *  10:44 PM" for a 72h span is not just unhelpful, it reads as a zero-length
   *  window. */
  private _renderRangeLabel(): string {
    const multiDay = this._now - this._start > DAY_MS;
    const fmt = (ms: number): string =>
      multiDay ? `${formatDayLabel(ms)} ${formatStamp(ms)}` : formatStamp(ms);
    return `${fmt(this._start)} → ${fmt(this._now)}`;
  }

  private _renderPositionTrack(): TemplateResult {
    const { VIEW_W, POS_TOP_PAD } = HistoryView;
    const POS_H = this._posH;
    const usableH = POS_H - POS_TOP_PAD;
    const yAt = (v: number): number => percentToY(v, POS_TOP_PAD, usableH);

    const targetPts = this._stepPoints(this._target, yAt);
    const actualPts = this._stepPoints(this._isoToPoints(this._actual), yAt);

    // Per-cover companions, drawn UNDER the aggregate so the mean stays the
    // headline while a diverging cover is still visible.
    const perCoverPts = Object.entries(this._perCover).map(([id, series]) => ({
      id,
      points: this._stepPoints(this._isoToPoints(series), yAt),
    }));

    const empty = !targetPts && !actualPts;

    return html`
      <div class="track">
        <div class="track-label">${t('history.track_position', this.hass)}</div>
        <div class="track-plot">
          <svg
            viewBox="0 0 ${VIEW_W} ${POS_H}"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style="height: ${POS_H}px"
          >
            ${this._sunShading(POS_TOP_PAD, POS_H)} ${this._gridLines(POS_TOP_PAD, POS_H)}
            <line class="baseline" x1="0" y1=${POS_H - 0.5} x2=${VIEW_W} y2=${POS_H - 0.5}></line>
            ${perCoverPts.map((c) =>
              c.points
                ? svg`<polyline class="cover-curve" points=${c.points} fill="none"></polyline>`
                : nothing,
            )}
            ${targetPts
              ? svg`<polyline class="target-curve" points=${targetPts} fill="none"></polyline>`
              : nothing}
            ${actualPts
              ? svg`<polyline class="actual-curve" points=${actualPts} fill="none"></polyline>`
              : nothing}
            ${this._hoverLine(POS_TOP_PAD, POS_H)}
          </svg>
          ${empty ? this._renderEmptyNote(this.discovered.managed_covers?.[0]) : nothing}
          <span class="y-max">100%</span>
        </div>
      </div>
      ${empty ? nothing : this._renderPositionLegend(perCoverPts.length > 0)}
    `;
  }

  /**
   * Venetian second axis. Rendered only when the entry actually has a tilt axis
   * AND something was recorded for it — a position-only cover shows nothing,
   * not an empty track.
   */
  private _renderTiltTrack(): TemplateResult | typeof nothing {
    const { VIEW_W, POS_TOP_PAD } = HistoryView;
    const POS_H = this._posH;
    const covers = Object.values(this._tiltActual);
    if (this._tiltTarget.length === 0 && covers.length === 0) return nothing;

    const usableH = POS_H - POS_TOP_PAD;
    const yAt = (v: number): number => percentToY(v, POS_TOP_PAD, usableH);
    const targetPts = this._stepPoints(this._tiltTarget, yAt);
    const actualRuns = covers.map((series) => this._stepPoints(this._isoToPoints(series), yAt));

    return html`
      <div class="track">
        <div class="track-label">${t('covers.tilt_title', this.hass)}</div>
        <div class="track-plot">
          <svg
            viewBox="0 0 ${VIEW_W} ${POS_H}"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style="height: ${POS_H}px"
          >
            ${this._sunShading(POS_TOP_PAD, POS_H)} ${this._gridLines(POS_TOP_PAD, POS_H)}
            <line class="baseline" x1="0" y1=${POS_H - 0.5} x2=${VIEW_W} y2=${POS_H - 0.5}></line>
            ${actualRuns.map((pts) =>
              pts
                ? svg`<polyline class="actual-curve" points=${pts} fill="none"></polyline>`
                : nothing,
            )}
            ${targetPts
              ? svg`<polyline class="target-curve" points=${targetPts} fill="none"></polyline>`
              : nothing}
            ${this._hoverLine(POS_TOP_PAD, POS_H)}
          </svg>
          <span class="y-max">100%</span>
        </div>
      </div>
    `;
  }

  /**
   * Why the cover moved, drawn behind the curves: night is dimmed, and the
   * spans where the sun was inside the acceptance angle are highlighted.
   *
   * The SAA spans come from the RECORDED `sun_infront_binary` history, not from
   * re-deriving the geometry client-side — that is the integration's own
   * determination, including elevation clipping and blind spots, so the shading
   * can never disagree with the handler that acted on it. Night comes from the
   * sun model instead, because HA records no such entity per-entry and the
   * calculation is exact and free.
   */
  private _sunShading(top: number, bottom: number): TemplateResult[] {
    const out: TemplateResult[] = [];
    const h = bottom - top;

    for (const seg of this._nightSegments()) {
      const x1 = this._x(seg.start);
      const w = this._x(seg.end) - x1;
      if (w <= 0) continue;
      out.push(
        svg`<rect class="night" x=${x1.toFixed(1)} y=${top} width=${w.toFixed(1)} height=${h}></rect>`,
      );
    }

    for (const band of this._stateBands.sun_infront_binary ?? []) {
      if (!isOn(band.state)) continue;
      const x1 = this._x(band.start);
      const w = this._x(band.end) - x1;
      if (w <= 0) continue;
      out.push(
        svg`<rect class="saa" x=${x1.toFixed(1)} y=${top} width=${w.toFixed(1)} height=${h}></rect>`,
      );
    }
    return out;
  }

  /** Below-horizon spans across the window, clipped to it. Walks each local day
   *  the window touches (a rolling window routinely spans two or four). */
  private _nightSegments(): Array<{ start: number; end: number }> {
    const lat = this.hass?.config?.latitude;
    const lon = this.hass?.config?.longitude;
    if (typeof lat !== 'number' || typeof lon !== 'number') return [];

    const out: Array<{ start: number; end: number }> = [];
    let day = startOfDay(new Date(this._start)).getTime();
    // Guard the loop on a day count, not only on `day < this._now`: a bad clock
    // or a degenerate window must not spin here.
    for (let i = 0; i < 8 && day < this._now; i++) {
      const samples = sampleDay(lat, lon, new Date(day));
      if (samples.length === 0) continue;
      // Night is the complement of the above-horizon runs across the day.
      const lit = aboveHorizonSegments(samples);
      let cursor = samples[0].t.getTime();
      for (const run of lit) {
        const runStart = samples[run.startIdx].t.getTime();
        if (runStart > cursor) out.push({ start: cursor, end: runStart });
        cursor = samples[run.endIdx].t.getTime();
      }
      const dayEnd = samples[samples.length - 1].t.getTime();
      if (cursor < dayEnd) out.push({ start: cursor, end: dayEnd });

      // Step to the NEXT LOCAL MIDNIGHT rather than adding a fixed 24h: local
      // days are 23 or 25 hours across a DST boundary, so a fixed step walks off
      // midnight and leaves an hour of the window unshaded (or double-shaded)
      // twice a year. Overshooting into the next day and re-flooring is exact
      // either way.
      const next = startOfDay(new Date(day + DAY_MS + 12 * HOUR_MS)).getTime();
      day = next > day ? next : day + DAY_MS;
    }

    return out
      .map((seg) => ({
        start: Math.max(seg.start, this._start),
        end: Math.min(seg.end, this._now),
      }))
      .filter((seg) => seg.end > seg.start);
  }

  /**
   * Distinguish "nothing happened" from "nothing was recorded". An empty track
   * whose entity exists in `hass.states` almost always means the recorder is
   * excluding or has purged it — saying "No recorded data" there reads as a
   * claim about the cover, which is misleading.
   */
  private _renderEmptyNote(probeEntityId: string | undefined): TemplateResult {
    const known = probeEntityId ? !!this.hass.states?.[probeEntityId] : false;
    return html`<span class="empty-note"
      >${known ? t('history.no_recorder_data', this.hass) : t('history.no_data', this.hass)}</span
    >`;
  }

  private _renderPositionLegend(hasPerCover: boolean): TemplateResult {
    return html`
      <div class="track">
        <div class="track-label"></div>
        <div class="legend">
          <span class="legend-item"
            ><span class="line-swatch target"></span>${t('history.legend_target', this.hass)}</span
          >
          <span class="legend-item"
            ><span class="line-swatch actual"></span>${t('history.legend_actual', this.hass)}</span
          >
          ${hasPerCover
            ? html`<span class="legend-item"
                ><span class="line-swatch cover"></span>${t(
                  'history.legend_per_cover',
                  this.hass,
                )}</span
              >`
            : nothing}
          <span class="legend-item"
            ><span class="swatch saa-swatch"></span>${t('history.legend_saa', this.hass)}</span
          >
          <span class="legend-item"
            ><span class="swatch night-swatch"></span>${t('history.legend_night', this.hass)}</span
          >
        </div>
      </div>
    `;
  }

  /**
   * Window-level summary: how many times it moved, how far it travelled, how
   * long each handler held it, and how long a manual override was in force.
   * Purely derived from series already in memory (see `lib/history-stats.ts`).
   */
  private _renderStats(): TemplateResult | typeof nothing {
    if (!this._loaded) return nothing;
    const stats: HistoryStats = summarize({
      actual: this._actual,
      whoWon: this._whoWon,
      overrideBands: this._stateBands.manual_override_binary ?? [],
      isActive: isOn,
    });
    if (stats.moves === 0 && stats.handlers.length === 0) return nothing;

    return html`
      <div class="stats">
        <span class="stat"
          ><strong>${stats.moves}</strong> ${t('history.stat_moves', this.hass)}</span
        >
        <span class="stat"
          ><strong>${stats.travel}</strong> ${t('history.stat_travel', this.hass)}</span
        >
        ${stats.activeMs > 0
          ? html`<span class="stat"
              ><strong>${formatSpan(stats.activeMs)}</strong> ${t(
                'history.stat_override',
                this.hass,
              )}</span
            >`
          : nothing}
        ${stats.handlers.slice(0, 3).map((h) => {
          const tok = BADGE_TOKENS[this._badgeKind(h.handler)];
          return html`<span class="stat handler-stat">
            <span class="swatch" style="background:${tok.bg};border-color:${tok.fg}"></span>
            ${this._handlerLabel(h.handler)} ${formatSpan(h.ms)}
          </span>`;
        })}
      </div>
    `;
  }

  private _renderWhoWonTrack(): TemplateResult {
    const bands = this._whoWon.map((b) => {
      const left = this._pct(b.start);
      const width = Math.max(0.2, this._pct(b.end) - left);
      const tokens = BADGE_TOKENS[this._badgeKind(b.state)];
      const label = this._handlerLabel(b.state);
      return html`<div
        class="band"
        style=${`left:${left.toFixed(2)}%;width:${width.toFixed(2)}%;background:${tokens.bg};color:${tokens.fg};box-shadow:inset 0 0 0 1px ${tokens.fg}`}
        ${tooltip(`${label} — ${formatStamp(b.start)} → ${formatStamp(b.end)}`)}
      >
        ${width >= LABEL_MIN_PCT ? label : ''}
      </div>`;
    });

    return html`
      <div class="track">
        <div class="track-label">${t('history.track_who_won', this.hass)}</div>
        <div class="track-plot">
          <div class="bar">
            ${bands}${this._hoverMarker()}
            ${bands.length === 0
              ? html`<span class="empty-note">${t('history.no_data', this.hass)}</span>`
              : nothing}
          </div>
        </div>
      </div>
      ${this._renderWhoWonLegend()}
    `;
  }

  private _renderWhoWonLegend(): TemplateResult | typeof nothing {
    const kinds = new Map<BadgeKind, string>();
    for (const b of this._whoWon) kinds.set(this._badgeKind(b.state), b.state);
    if (kinds.size === 0) return nothing;
    return html`
      <div class="track">
        <div class="track-label"></div>
        <div class="legend">
          ${[...kinds.entries()].map(([kind, handler]) => {
            const tok = BADGE_TOKENS[kind];
            return html`<span class="legend-item">
              <span class="swatch" style="background:${tok.bg};border-color:${tok.fg}"></span>
              <ha-icon icon=${BADGE_ICONS[kind]} style="color:${tok.fg}"></ha-icon>
              ${this._handlerLabel(handler)}
            </span>`;
          })}
        </div>
      </div>
    `;
  }

  /**
   * `control_status` over time — the integration's own account of why it was or
   * wasn't commanding the cover (`active`, `sun_not_visible`,
   * `position_delta_too_small`, …). Distinct from the who-won track above,
   * which names the winning pipeline handler.
   */
  private _renderControlStatusTrack(): TemplateResult | typeof nothing {
    if (this._controlStatus.length === 0) return nothing;
    const label = t('history.track_control_status', this.hass);
    return html`
      <div class="track">
        <div class="track-label" ${tooltip(label)}>${label}</div>
        <div class="track-plot">
          <div class="bar">
            ${this._controlStatus.map((b) => {
              const left = this._pct(b.start);
              const width = Math.max(0.2, this._pct(b.end) - left);
              const text = this._controlStatusLabel(b.state);
              const active = CONTROL_STATUS_ACTIVE.has(b.state);
              return html`<div
                class=${`band status ${active ? 'active' : 'idle'}`}
                style=${`left:${left.toFixed(2)}%;width:${width.toFixed(2)}%`}
                ${tooltip(`${text} — ${formatStamp(b.start)} → ${formatStamp(b.end)}`)}
              >
                ${width >= LABEL_MIN_PCT ? text : ''}
              </div>`;
            })}${this._hoverMarker()}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * One HA-style labeled state-timeline bar per ACP switch / binary sensor —
   * the same shape HA's own more-info "History" section draws for a single
   * entity, stacked so the whole instance reads at once.
   */
  private _renderStateTracks(): TemplateResult[] {
    return STATE_TRACKS.filter((track) => this.discovered.entities[track.role]).map((track) => {
      const bands = this._stateBands[track.role] ?? [];
      const label = t(track.key, this.hass);
      return html`
        <div class="track">
          <div class="track-label" ${tooltip(label)}>${label}</div>
          <div class="track-plot">
            <div class="bar">
              ${bands.map((b) => {
                const left = this._pct(b.start);
                const width = Math.max(0.2, this._pct(b.end) - left);
                const on = isOn(b.state);
                const text = this._stateLabel(b.state);
                return html`<div
                  class=${`band state ${on ? 'on' : 'off'} ${track.cls}`}
                  style=${`left:${left.toFixed(2)}%;width:${width.toFixed(2)}%`}
                  ${tooltip(`${label}: ${text} — ${formatStamp(b.start)} → ${formatStamp(b.end)}`)}
                >
                  ${width >= LABEL_MIN_PCT ? text : ''}
                </div>`;
              })}${this._hoverMarker()}
              ${bands.length === 0
                ? html`<span class="empty-note">${t('history.no_data', this.hass)}</span>`
                : nothing}
            </div>
          </div>
        </div>
      `;
    });
  }

  private _renderAxis(): TemplateResult {
    const ticks = this._axisTicks();
    return html`
      <div class="track axis">
        <div class="track-label"></div>
        <div class="track-plot">
          <div class="axis-row">
            ${ticks.map(
              (tick, i) =>
                html`<span
                  class=${`axis-tick${i === 0 ? ' first' : ''}`}
                  style="left:${this._pct(tick).toFixed(2)}%"
                  >${
                    // Lead with the date (HA labels its first tick "Jul 26"),
                    // and repeat it whenever the window crosses midnight so a
                    // multi-day window is readable.
                    i === 0 || isMidnight(tick) ? formatDayLabel(tick) : formatStamp(tick)
                  }</span
                >`,
            )}
          </div>
        </div>
      </div>
    `;
  }

  /** Five evenly spaced tick timestamps across the window, snapped to the hour
   *  so the labels read as clock times rather than arbitrary minutes. */
  private _axisTicks(): number[] {
    const step = (this._now - this._start) / 4;
    const out: number[] = [];
    for (let i = 0; i <= 4; i++) {
      out.push(Math.round((this._start + i * step) / HOUR_MS) * HOUR_MS);
    }
    return out;
  }

  private _gridLines(top: number, bottom: number): TemplateResult[] {
    return this._axisTicks().map((tick) => {
      const x = this._x(tick).toFixed(1);
      return svg`<line class="grid" x1=${x} y1=${top} x2=${x} y2=${bottom}></line>`;
    });
  }

  private _hoverLine(top: number, bottom: number): TemplateResult | typeof nothing {
    if (this._hoverT === null) return nothing;
    const x = this._x(this._hoverT).toFixed(1);
    return svg`<line class="hover-line" x1=${x} y1=${top} x2=${x} y2=${bottom}></line>`;
  }

  /** HTML twin of {@link _hoverLine} for the band tracks. */
  private _hoverMarker(): TemplateResult | typeof nothing {
    if (this._hoverT === null) return nothing;
    return html`<div
      class="hover-marker"
      style="left:${this._pct(this._hoverT).toFixed(2)}%"
    ></div>`;
  }

  /**
   * HA-style Activity feed: day-grouped, newest first, each row carrying who
   * caused it and — for ACP's own commands — which position was commanded.
   */
  private _renderActivity(): TemplateResult {
    const days = groupByDay(this._activity);

    return html`
      <div class="section">
        ${this._maximized === 'activity'
          ? nothing
          : html`<div class="section-head">
              <h4>${t('history.activity_title', this.hass)}</h4>
              <span class="head-actions">
                <button
                  type="button"
                  class="link"
                  @click=${() => this._showMore('logbook', this._allEntityIds())}
                >
                  ${t('history.show_more', this.hass)}
                </button>
                ${this._maximizeButton('activity')}
              </span>
            </div>`}
        ${this._activity.length === 0
          ? html`<p class="dim">${t('history.activity_empty', this.hass)}</p>`
          : html`<div class="activity">
              ${days.map(
                (day) => html`
                  <div class="day-head">${formatDayHeading(day.dayMs, this._now, this.hass)}</div>
                  <ul class="log">
                    ${day.entries.map((r) => this._renderActivityRow(r))}
                  </ul>
                `,
              )}
            </div>`}
      </div>
    `;
  }

  private _renderActivityRow(r: ActivityRow): TemplateResult {
    const who = r.triggeredBy;
    return html`<li class=${`evt-row ${r.source}${r.skipped ? ' skipped' : ''}`}>
      <span class="dot"></span>
      <span class="evt-main">
        <span class="evt-title">${r.title}</span>
        ${r.detail ? html`<span class="evt-detail">${r.detail}</span>` : nothing}
        ${r.name && r.source === 'logbook'
          ? html`<span class="evt-entity">${r.name}</span>`
          : nothing}
      </span>
      ${who ? html`<span class="who" ${tooltip(who)}>${initials(who)}</span>` : nothing}
      <span class="evt-time">${formatStamp(r.t)}</span>
    </li>`;
  }

  /**
   * Single-section layout: a title row with the way back, then the chosen
   * section filling everything underneath. The window picker rides along for
   * the two time-based sections, since changing the window is the main thing
   * you want while looking at them full-size.
   */
  private _renderMaximized(): TemplateResult {
    const section = this._maximized as Exclude<MaximizedSection, null>;
    const titles: Record<string, string> = {
      // NOT `track_position` — the tracks section stacks position, tilt,
      // who-won, control status and every state timeline, so naming it after
      // one of its rows misdescribes what is on screen.
      tracks: t('history.section_tracks', this.hass),
      activity: t('history.activity_title', this.hass),
      events: t('history.advanced', this.hass),
    };
    // Each maximized section deep-links to the HA panel that matches it; the
    // buffer has no HA panel, so it gets none.
    const panel: 'history' | 'logbook' | null =
      section === 'tracks' ? 'history' : section === 'activity' ? 'logbook' : null;

    return html`
      <div class=${`history full full-${section}`}>
        <div class="full-head">
          <button type="button" class="disclosure" @click=${() => this._toggleMaximize(section)}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>
            ${titles[section]}
          </button>
          <span class="head-actions">
            ${panel
              ? html`<button
                  type="button"
                  class="link"
                  @click=${() => this._showMore(panel, this._allEntityIds())}
                >
                  ${t('history.show_more', this.hass)}
                </button>`
              : nothing}
            ${this._maximizeButton(section)}
          </span>
        </div>
        ${section === 'events' ? nothing : this._renderToolbar()}
        ${section === 'tracks'
          ? html`
              ${this._renderStats()} ${this._renderReadout()}
              <div
                class="tracks"
                @pointermove=${this._onPointerMove}
                @pointerleave=${this._onPointerLeave}
              >
                ${this._show('position') ? this._renderPositionTrack() : nothing}
                ${this._show('position') ? this._renderTiltTrack() : nothing}
                ${this._show('who_won') ? this._renderWhoWonTrack() : nothing}
                ${this._show('who_won') ? this._renderControlStatusTrack() : nothing}
                ${this._show('context') ? this._renderStateTracks() : nothing} ${this._renderAxis()}
              </div>
            `
          : nothing}
        ${section === 'activity' ? this._renderActivity() : nothing}
        ${section === 'events' ? this._renderEventBuffer() : nothing}
      </div>
    `;
  }

  private _renderAdvanced(): TemplateResult | typeof nothing {
    if (this.hideAdvanced) return nothing;
    if (!hasGetDiagnostics(this.hass)) return nothing;

    return html`
      <div class="section advanced">
        <div class="section-head">
          <button
            type="button"
            class="disclosure"
            aria-expanded=${this._advanced ? 'true' : 'false'}
            @click=${this._toggleAdvanced}
          >
            <ha-icon icon=${this._advanced ? 'mdi:chevron-down' : 'mdi:chevron-right'}></ha-icon>
            ${t('history.advanced', this.hass)}
          </button>
          ${this._maximizeButton('events')}
        </div>
        <div class="advanced-body">${this._advanced ? this._renderEventBuffer() : nothing}</div>
      </div>
    `;
  }

  private _renderEventBuffer(): TemplateResult {
    const timeline = this._timeline;
    if (timeline === null) {
      return html`<p class="dim">${t('history.loading', this.hass)}</p>`;
    }
    if (!timeline.available) {
      return html`<p class="dim">${t('history.events_unavailable', this.hass)}</p>`;
    }

    const needle = this._eventFilter.trim().toLowerCase();
    const shown = needle
      ? timeline.events.filter((e) => eventHaystack(e).includes(needle))
      : timeline.events;

    return html`
      <div class="events">
        <div class="events-meta">
          <span
            >${t('history.events_count', this.hass, {
              shown: shown.length,
              total: timeline.events.length,
            })}</span
          >
          ${timeline.bufferSize !== null
            ? html`<span
                >${t('history.buffer_size', this.hass, { size: timeline.bufferSize })}</span
              >`
            : nothing}
          ${timeline.window?.start
            ? html`<span
                >${t('history.data_window', this.hass, {
                  from: formatClock(timeline.window.start),
                  to: formatClock(timeline.window.end ?? timeline.window.start),
                })}</span
              >`
            : nothing}
          ${timeline.raw !== null && timeline.raw !== undefined
            ? html`<button type="button" class="link" @click=${() => void this._copyDiagnostics()}>
                ${this._copied
                  ? t('history.copied', this.hass)
                  : t('history.copy_diagnostics', this.hass)}
              </button>`
            : nothing}
        </div>
        <input
          class="events-search"
          type="search"
          .value=${this._eventFilter}
          placeholder=${t('history.events_search', this.hass)}
          aria-label=${t('history.events_search', this.hass)}
          @input=${(e: Event) => {
            this._eventFilter = (e.target as HTMLInputElement).value;
          }}
        />
        ${shown.length === 0
          ? html`<p class="dim">${t('history.events_empty', this.hass)}</p>`
          : html`<ul class="event-list">
              ${[...shown].reverse().map(
                (e) =>
                  html`<li class="evt sev-${EVENT_SEVERITY[e.event] ?? 'info'}">
                    <span class="evt-time">${formatClock(e.ts)}</span>
                    <span class="evt-name">${e.event}</span>
                    <span class="evt-fields">${formatFields(e.fields)}</span>
                  </li>`,
              )}
            </ul>`}
      </div>
    `;
  }

  private _badgeKind(handler: string): BadgeKind {
    return BADGE_KINDS_BY_HANDLER[handler as HandlerName] ?? 'auto';
  }

  /**
   * Localized handler name. An UNKNOWN name is humanized rather than mapped
   * through its badge kind: every unrecognized string resolves to the `auto`
   * kind, so falling back to the badge label rendered unrelated values as
   * "Auto" — three different states all reading "Auto" in the same summary,
   * with no way to tell them apart.
   */
  private _handlerLabel(handler: string): string {
    const key = HANDLER_I18N_KEYS[handler as HandlerName];
    if (key) return t(key, this.hass);
    const badgeKey = BADGE_I18N_KEYS[handler as BadgeKind];
    if (badgeKey) return t(badgeKey, this.hass);
    return humanize(handler);
  }

  /** Localized `control_status` value — the integration's ControlStatus enum,
   *  which is NOT a handler name. Unknown values humanize. */
  private _controlStatusLabel(status: string): string {
    const key = CONTROL_STATUS_I18N_KEYS[status];
    return key ? t(key, this.hass) : humanize(status);
  }

  /** Localized label for a binary/switch state, matching HA's On/Off wording. */
  private _stateLabel(raw: string): string {
    if (raw === 'on') return t('dialog.on', this.hass);
    if (raw === 'off') return t('dialog.off', this.hass);
    return raw;
  }

  public static styles = css`
    :host {
      display: block;
    }
    /* Maximized mode: the host must fill its container for the chosen section's
       flex sizing to have anything to resolve against. */
    :host([maximized]) {
      height: 100%;
    }
    .history {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .history.full {
      height: 100%;
      min-height: 0;
    }
    .full-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    /* In full mode the list is the only scroller: everything above it is fixed
       chrome, and min-height 0 is what lets a flex child actually shrink so
       the list's own overflow engages instead of the page growing. */
    .history.full .events {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    .history.full .event-list {
      flex: 1;
      min-height: 0;
      max-height: none;
      font-size: 0.72rem;
    }
    .history.full .evt {
      grid-template-columns: 64px 190px 1fr;
    }
    /* Activity maximized: the day-grouped feed becomes the only scroller,
       instead of a 300px window inside the page scroller. */
    .history.full-activity .section {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      border-top: none;
      padding-top: 0;
    }
    .history.full-activity .activity {
      flex: 1;
      min-height: 0;
      max-height: none;
    }
    /* Tracks maximized: taller band rows to match the taller plots, and the
       stack scrolls if the entry has enough entities to overflow. */
    .history.full-tracks .tracks {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      gap: 8px;
    }
    .history.full-tracks .bar {
      height: 30px;
    }
    .history.full-tracks .band {
      font-size: 0.72rem;
    }
    .history.full-tracks .track-label {
      font-size: 0.74rem;
    }
    .head-actions {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .windows {
      display: flex;
      gap: 4px;
    }
    .chip {
      font: inherit;
      font-size: 0.72rem;
      padding: 3px 9px;
      border-radius: 999px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .chip.on {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .link {
      font: inherit;
      font-size: 0.76rem;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      color: var(--primary-color);
    }
    .link:hover {
      text-decoration: underline;
    }
    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 2px;
      display: inline-flex;
    }
    .spin {
      animation: acp-spin 1s linear infinite;
    }
    @keyframes acp-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .spin {
        animation: none;
      }
    }
    .readout {
      font-size: 0.74rem;
      color: var(--primary-text-color);
      min-height: 1.1em;
    }
    .dim {
      color: var(--secondary-text-color);
      margin: 0;
      font-size: 0.78rem;
    }
    .tracks {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .track {
      display: grid;
      grid-template-columns: 96px 1fr;
      gap: 8px;
      align-items: center;
    }
    .track-label {
      font-size: 0.68rem;
      color: var(--secondary-text-color);
      text-align: right;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .track-plot {
      position: relative;
      min-width: 0;
    }
    .track-plot svg {
      display: block;
      width: 100%;
      overflow: visible;
    }
    /* Band tracks are HTML, not SVG: a preserveAspectRatio="none" viewBox
       stretches text horizontally, and these bands must carry readable labels
       (HA writes the state name inside the band). */
    .bar {
      position: relative;
      height: 22px;
      width: 100%;
      border-radius: 4px;
      overflow: hidden;
      background: var(--divider-color, rgba(0, 0, 0, 0.08));
    }
    .band {
      position: absolute;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      padding: 0 4px;
      box-sizing: border-box;
      font-size: 0.64rem;
      line-height: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* Control status: green while acting, muted amber while deliberately idle —
       "not acting" is normal, not an error, so it must not read as a fault. */
    .band.status.active {
      background: #66bb6a;
      color: #1b3d1c;
    }
    .band.status.idle {
      background: var(--divider-color, rgba(0, 0, 0, 0.18));
      color: var(--primary-text-color);
    }
    .band.state.off {
      background: var(--history-unavailable-color, #9e9e9e);
      color: var(--primary-text-color);
      opacity: 0.55;
    }
    .band.state.on {
      color: #fff;
    }
    .band.state.on.ctx-sun {
      background: #fbc02d;
      color: #3e2723;
    }
    .band.state.on.ctx-glare {
      background: #ef5350;
    }
    .band.state.on.ctx-manual {
      background: #ff9800;
      color: #3e2723;
    }
    .band.state.on.ctx-mismatch {
      background: #ab47bc;
    }
    .band.state.on.ctx-enabled,
    .band.state.on.ctx-auto {
      background: #66bb6a;
      color: #1b3d1c;
    }
    .empty-note {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      pointer-events: none;
    }
    .y-max {
      position: absolute;
      top: 0;
      left: 2px;
      font-size: 0.6rem;
      color: var(--secondary-text-color);
      pointer-events: none;
    }
    .baseline {
      stroke: var(--divider-color, rgba(0, 0, 0, 0.12));
      stroke-width: 1;
    }
    .grid {
      stroke: var(--divider-color);
      stroke-width: 0.5;
      opacity: 0.35;
      vector-effect: non-scaling-stroke;
    }
    /* Target = what ACP commanded, actual = where the cover went. Same pairing
       and colors the forecast strip uses, so the two views read alike. */
    .target-curve {
      stroke: var(--primary-color);
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
    }
    .actual-curve {
      stroke: var(--acp-actual-color, #e040fb);
      stroke-width: 1.75;
      vector-effect: non-scaling-stroke;
    }
    .hover-line {
      stroke: var(--primary-text-color, currentColor);
      stroke-width: 1;
      stroke-dasharray: 1 2;
      opacity: 0.55;
      vector-effect: non-scaling-stroke;
      pointer-events: none;
    }
    .hover-marker {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 1px;
      background: var(--primary-text-color, currentColor);
      opacity: 0.55;
      pointer-events: none;
    }
    .axis-row {
      position: relative;
      height: 14px;
    }
    .axis-tick {
      position: absolute;
      transform: translateX(-50%);
      font-size: 0.6rem;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .axis-tick.first {
      transform: none;
      left: 0 !important;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      font-size: 0.66rem;
      color: var(--secondary-text-color);
    }
    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }
    .legend-item ha-icon {
      --mdc-icon-size: 12px;
      width: 12px;
      height: 12px;
    }
    .swatch {
      width: 10px;
      height: 10px;
      border-radius: 2px;
      border: 1px solid;
      display: inline-block;
    }
    .line-swatch {
      width: 14px;
      height: 0;
      border-top: 2px solid currentColor;
      display: inline-block;
    }
    .line-swatch.target {
      color: var(--primary-color);
    }
    .line-swatch.actual {
      color: var(--acp-actual-color, #e040fb);
    }
    .line-swatch.cover {
      color: var(--secondary-text-color);
      border-top-style: dashed;
    }
    .saa-swatch {
      background: rgba(251, 192, 45, 0.35);
      border-color: rgba(251, 192, 45, 0.8);
    }
    .night-swatch {
      background: rgba(63, 81, 181, 0.18);
      border-color: rgba(63, 81, 181, 0.5);
    }
    /* Cause, drawn behind the curves: dimmed night, highlighted acceptance
       angle. Both are backdrop, so they must never compete with the lines. */
    .night {
      fill: var(--acp-night-color, rgba(63, 81, 181, 0.14));
    }
    .saa {
      fill: var(--acp-saa-color, rgba(251, 192, 45, 0.22));
    }
    /* Individual covers sit under the aggregate: thin, dashed, muted. */
    .cover-curve {
      stroke: var(--secondary-text-color);
      stroke-width: 1;
      stroke-dasharray: 3 3;
      opacity: 0.65;
      vector-effect: non-scaling-stroke;
    }
    .stats {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 12px;
      font-size: 0.7rem;
      color: var(--secondary-text-color);
    }
    .stat strong {
      color: var(--primary-text-color);
      font-weight: 600;
    }
    .handler-stat {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .section {
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      padding-top: 8px;
    }
    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .section h4 {
      margin: 0 0 6px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .activity {
      max-height: 300px;
      overflow-y: auto;
    }
    .day-head {
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--primary-text-color);
      margin: 6px 0 2px;
      position: sticky;
      top: 0;
      background: var(--card-background-color, #fff);
      padding: 2px 0;
    }
    .log {
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: 0.74rem;
    }
    .evt-row {
      display: grid;
      grid-template-columns: 14px 1fr auto auto;
      gap: 8px;
      align-items: baseline;
      padding: 3px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }
    .evt-row:last-child {
      border-bottom: none;
    }
    .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--secondary-text-color);
      align-self: center;
    }
    .evt-row.command .dot {
      background: var(--primary-color);
    }
    .evt-row.skipped .dot {
      background: #ff9800;
    }
    .evt-row.skipped .evt-title {
      color: var(--secondary-text-color);
    }
    .evt-main {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 6px;
      min-width: 0;
    }
    .evt-title {
      color: var(--primary-text-color);
    }
    .evt-detail {
      font-family: var(--code-font-family, monospace);
      font-size: 0.7rem;
      color: var(--primary-color);
    }
    .evt-entity {
      font-size: 0.68rem;
      color: var(--secondary-text-color);
    }
    .who {
      display: inline-grid;
      place-items: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--light-primary-color, #b3e5fc);
      color: var(--primary-text-color);
      font-size: 0.6rem;
      font-weight: 600;
      align-self: center;
    }
    .evt-time {
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
      font-size: 0.7rem;
    }
    .disclosure {
      background: none;
      border: none;
      padding: 0;
      font: inherit;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--primary-text-color);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .disclosure ha-icon {
      --mdc-icon-size: 16px;
      width: 16px;
      height: 16px;
    }
    .events {
      margin-top: 6px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .events-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      font-size: 0.66rem;
      color: var(--secondary-text-color);
    }
    .events-search {
      font: inherit;
      font-size: 0.72rem;
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
    }
    .event-list {
      list-style: none;
      margin: 0;
      padding: 0;
      max-height: 260px;
      overflow-y: auto;
      font-size: 0.68rem;
    }
    .evt {
      display: grid;
      grid-template-columns: 52px 150px 1fr;
      gap: 6px;
      padding: 2px 0 2px 6px;
      border-left: 3px solid transparent;
      align-items: baseline;
    }
    .evt-name {
      font-weight: 600;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .evt-fields {
      color: var(--secondary-text-color);
      font-family: var(--code-font-family, monospace);
      overflow-wrap: anywhere;
    }
    .sev-info {
      border-left-color: var(--divider-color, rgba(0, 0, 0, 0.2));
    }
    .sev-action {
      border-left-color: #4caf50;
    }
    .sev-warn {
      border-left-color: #ff9800;
    }
    [data-tooltip]:hover {
      cursor: help;
    }
    [data-tooltip][acp-tt-shown] {
      cursor: default;
    }
  `;
}

/** Turn a raw snake_case identifier into something readable — the honest
 *  fallback for a value the card has no translation for. Better than mapping it
 *  onto an unrelated known label. */
export function humanize(raw: string): string {
  if (!raw) return raw;
  const spaced = raw.replace(/_/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** HA treats anything that isn't literally `off`/`unavailable`/`unknown` as the
 *  active state for timeline coloring. */
export function isOn(state: string): boolean {
  return state !== 'off' && state !== 'unavailable' && state !== 'unknown';
}

/** The band covering `t`, or null. Bands are non-overlapping and sorted. */
export function bandAt(bands: HistoryBand[], t: number): HistoryBand | null {
  for (const b of bands) {
    if (t >= b.start && t < b.end) return b;
  }
  return null;
}

/**
 * Value in effect at `t` — the last sample at or BEFORE it.
 *
 * These are step functions: the recorder stores transitions, and a value holds
 * until the next one. Picking the nearest sample in either direction reads the
 * FUTURE whenever the cursor sits just before a change — hovering at 17:55 on a
 * target that drops to 0 at 18:00 would report 0%, disagreeing with the very
 * line under the cursor. Null before the first sample, where nothing is known.
 */
export function valueAt(points: Array<{ t: number; value: number }>, t: number): number | null {
  let best: number | null = null;
  let bestT = Number.NEGATIVE_INFINITY;
  for (const p of points) {
    if (Number.isNaN(p.t)) continue;
    if (p.t <= t && p.t >= bestT) {
      bestT = p.t;
      best = p.value;
    }
  }
  return best;
}

/** Local wall-clock time, in the viewer's 12/24h convention. */
function formatStamp(ms: number): string {
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function isMidnight(ms: number): boolean {
  const d = new Date(ms);
  return d.getHours() === 0;
}

function formatDayLabel(ms: number): string {
  return new Date(ms).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/** "Today · July 26, 2026" / "Yesterday · …" / a plain long date, mirroring the
 *  day headings in HA's Activity list. */
function formatDayHeading(dayMs: number, nowMs: number, hass: HomeAssistant | undefined): string {
  const today = new Date(nowMs);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - dayMs) / DAY_MS);
  const long = new Date(dayMs).toLocaleDateString([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  if (diffDays === 0) return `${t('history.today', hass)} · ${long}`;
  if (diffDays === 1) return `${t('history.yesterday', hass)} · ${long}`;
  return long;
}

/** Render an event's extra fields as a compact `key=value` run. Objects and
 *  arrays are JSON-stringified so a nested payload still shows something
 *  useful; null/undefined fields are dropped. */
export function formatFields(fields: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(fields)) {
    if (v === null || v === undefined || v === '') continue;
    parts.push(`${k}=${typeof v === 'object' ? JSON.stringify(v) : String(v)}`);
  }
  return parts.join('  ');
}

/** Lower-cased searchable text for one event (name + every field). */
function eventHaystack(e: AcpEvent): string {
  return `${e.event} ${formatFields(e.fields)}`.toLowerCase();
}

declare global {
  interface HTMLElementTagNameMap {
    'acp-history-view': HistoryView;
  }
}
