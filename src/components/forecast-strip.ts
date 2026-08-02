import { LitElement, html, svg, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import type { ForecastEvent, ForecastSample, PositionHistorySample } from '../types';
import type { ResolvedAxis } from '../lib/axes';
import { AXIS_LABEL_I18N_KEYS } from '../const';
import { formatClock } from '../lib/formatters';
import { t } from '../lib/i18n';
import { dayFractionX, percentToY } from '../lib/geometry';
import { clampToWindow, isoToPoints, stepExpand, valueAt } from '../lib/state-history';
import { startOfDay } from '../lib/sun-model';
import { tooltip } from '../lib/tooltip';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Hand-written SVG strip rendering today's forecast curve + boundary events.
 *
 * Keeps the bundle small (no charting library; see CLAUDE.md "Keep bundle
 * small"). Inputs are the integration's `position_forecast` sensor
 * attributes: a list of (t, position) samples and a list of (t, kind, label)
 * events. Time axis is pinned to a fixed midnight→midnight local-day window
 * (00:00→24:00) so it aligns with the elevation chart.
 *
 * Hover affordances:
 *   - Vertical event markers get a wide invisible hit area and a card-owned
 *     floating tooltip (kind meaning + local time) via the `tooltip()`
 *     directive, with a help→default cursor handoff.
 *   - The curve shows a follow-along label with the nearest sample's time,
 *     position %, and handler (solar/default/...).
 *   - The "now" cursor mirrors the elevation chart: a wide invisible hit line
 *     plus a floating tooltip showing the current local time.
 *
 * Axis tracks: one polyline per axis the entry actually has. The axis list is
 * the integration's own `cover_discovery` descriptor, resolved by
 * `lib/axes.ts` and passed in as `axes` — NOT sniffed off the sample keys.
 * That distinction is load-bearing: a `cover_day_night_shade` publishes a
 * `tilt` axis with `supported: false` and its forecast still carries a `tilt`
 * value on solar samples, so key-sniffing drew a phantom slat track on a cover
 * with no slats. Every other surface in the card already filters on
 * `supported`; this one now agrees with them.
 *
 * Each secondary track is dashed and takes its own color from a small palette,
 * deliberately clear of the amber/orange/green the event markers use. Runs are
 * split across any in-day sample lacking the key (e.g. a non-solar stretch) so
 * a gap never draws a spurious connecting line, and values are normalized
 * through the axis's own `min`/`max` rather than assuming 0-100.
 *
 * With no `axes` supplied at all (a caller that predates the property) it falls
 * back to the original single-key sniff. That fallback restores the old
 * MEMBERSHIP rule, not the old pixels: a sniffed axis is now drawn in the
 * palette rather than `--accent-color`, and it appears in the legend, which a
 * legacy strip with no history never rendered. Nothing in the card reaches this
 * path — `more-info-dialog` always passes `axes` — so the divergence is
 * documentation for a future caller rather than a live behavior difference.
 */
@customElement('acp-forecast-strip')
export class ForecastStrip extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public samples: ForecastSample[] = [];
  @property({ attribute: false }) public events: ForecastEvent[] = [];
  /** Recorded actual position over today, from the HA recorder (may be empty). */
  @property({ attribute: false }) public history: PositionHistorySample[] = [];
  @property({ attribute: false }) public now = Date.now();
  /** The entry's supported axes, from `resolveAxes(discovered)`. Decides which
   *  tracks are drawn, what they are called, and the value range each is
   *  normalized against.
   *
   *  UNDEFINED and EMPTY mean different things, and conflating them reopens the
   *  bug this property exists to close. Undefined is "nobody told me" — a caller
   *  that predates this property — and only that falls back to the legacy
   *  key-sniff. An empty ARRAY is discovery's own answer: `resolveAxes` returns
   *  `[]` for a payload whose axes are all `supported: false`, and sniffing
   *  there would draw the phantom slat track on exactly the cover type that
   *  reported no drivable axis at all. */
  @property({ attribute: false }) public axes?: ResolvedAxis[];

  @state() private _hoverIdx: number | null = null;

  // Fixed SVG viewport. The element scales to fit its container via
  // preserveAspectRatio="none" so callers can constrain the rendered height
  // without touching the viewBox math.
  private static readonly VIEW_W = 600;
  private static readonly VIEW_H = 80;
  // Reserve a tiny strip at the top for event labels and tick labels at the bottom.
  private static readonly TOP_PAD = 10;
  // Width of the invisible hit-area overlaid on each event line.
  private static readonly EVENT_HIT_W = 12;

  protected render(): TemplateResult | typeof nothing {
    const hasSamples = this.samples && this.samples.length > 0;
    const hasHistory = this.history && this.history.length > 0;
    if (!hasSamples && !hasHistory) return nothing;

    const { VIEW_W, VIEW_H, TOP_PAD, EVENT_HIT_W } = ForecastStrip;
    const usableH = VIEW_H - TOP_PAD;

    // Fixed local-day axis: midnight → midnight (mirrors elevation-chart.ts)
    const dayStart = startOfDay(new Date(this.now)).getTime();
    const dayEnd = dayStart + DAY_MS;

    // One track per axis the entry actually has, primary first.
    const tracks = resolveTracks(this.samples, this.axes, this.hass);
    const primary = tracks[0];

    const xAt = (t: number): number => dayFractionX(t, dayStart, VIEW_W);
    // EVERY y-mapping goes through an axis's declared range rather than assuming
    // 0-100, or the curve, the hover dot and the actual line end up on three
    // different scales — the dot floating a chart-height off the line it
    // annotates. Which axis differs by WHAT is being plotted:
    //   - forecast values → the track they belong to;
    //   - the hover dot → the primary track, the line it sits on;
    //   - recorded history → the POSITION axis, always. `this.history` is
    //     `PositionHistorySample[]`, a position percent from the recorder, and
    //     it stays one whatever the entry's leading axis is. On a tilt-only
    //     entry the primary track is the slat axis, and scaling a position
    //     against a slat range is only invisible while both are 0-100.
    const yAt = (value: number): number =>
      percentToY(axisFraction(value, primary), TOP_PAD, usableH);
    const historyAxis = tracks.find((track) => track.key === 'position') ?? primary;
    const yHistory = (value: number): number =>
      percentToY(axisFraction(value, historyAxis), TOP_PAD, usableH);

    // Keep samplePts index-aligned with `this.samples` (hover indexing depends
    // on it), but flag samples that fall outside today's window so the curve and
    // hover skip them. A pre-#510 integration walks 12h from `now`, spilling past
    // midnight; clamping those onto the right edge would draw a spurious spike.
    const samplePts = this.samples.map((s) => {
      const ts = Date.parse(s.t);
      const x = xAt(ts);
      // The dot sits on the PRIMARY track's line, so it reads that track's key
      // rather than always `position` — on a tilt-only entry the curve is the
      // slat axis and a position-keyed dot would float off it. Falls back to
      // `position`, the one key a ForecastSample is guaranteed to carry.
      const raw = s[primary.key];
      const y = yAt(typeof raw === 'number' ? raw : s.position);
      const inDay = !Number.isNaN(ts) && ts >= dayStart && ts <= dayEnd;
      return { t: ts, x, y, sample: s, inDay };
    });

    // Recorded actual position (00:00 → now). Same axis/mapping as the
    // forecast curve, but the recorder stores TRANSITIONS only — this is a
    // step function, and fed straight to a `<polyline>` a multi-hour hold
    // draws a diagonal ramp through positions the cover was never at (#255,
    // the forecast-strip twin of #253). Clamp to the window first (which pins
    // the pre-midnight carry-in to the left edge and drops spillover past the
    // right one), then step-expand across it. BOTH take `this.now` as that
    // right edge — the extent of what the recorder actually knows, not the
    // day's far edge, where nothing is recorded yet. Stating it once is what
    // keeps a sample in `(now, dayEnd]` from surviving the clamp and plotting
    // to the RIGHT of the now cursor, past where the curve terminates.
    const historyValues = clampToWindow(isoToPoints(this.history ?? []), dayStart, this.now);
    const actualPoints = stepExpand(historyValues, this.now)
      .map((p) => `${xAt(p.t).toFixed(1)},${yHistory(p.value).toFixed(1)}`)
      .join(' ');

    // Each track is drawn as separate polyline runs so a gap (a stretch of
    // in-day samples lacking the key) doesn't draw a spurious connecting line.
    for (const track of tracks) {
      let current: string[] = [];
      for (const p of samplePts) {
        if (!p.inDay) continue;
        const raw = p.sample[track.key];
        if (typeof raw === 'number') {
          current.push(
            `${p.x.toFixed(1)},${percentToY(axisFraction(raw, track), TOP_PAD, usableH).toFixed(1)}`,
          );
        } else if (current.length > 0) {
          track.runs.push(current.join(' '));
          current = [];
        }
      }
      if (current.length > 0) track.runs.push(current.join(' '));
    }
    // The tracks that actually put ink on the strip, which is what the legend
    // is allowed to describe — see `_renderLegend`. A run of ONE point is not
    // one of them: `<polyline points="345.2,41.0">` is a valid element that
    // draws nothing, so counting runs rather than drawn segments would let a
    // lone in-day sample legend a line nobody can see.
    const drawn = tracks.filter((track) => track.runs.some((run) => run.includes(' ')));
    const trackCurves = drawn.flatMap((track) =>
      track.runs.map(
        (runPoints) =>
          svg`<polyline class="track ${track.cls}" points=${runPoints} fill="none"></polyline>`,
      ),
    );

    const eventGroups = (this.events ?? [])
      .map((e) => {
        const eventTime = Date.parse(e.t);
        if (Number.isNaN(eventTime) || eventTime < dayStart || eventTime > dayEnd) return null;
        const x = xAt(eventTime);
        const colorClass = `evt-${e.kind}`;
        const ttText = describeEvent(e, this.hass);
        return svg`<g class="event-group" ${tooltip(ttText)}>
          <line
            class="event-hit"
            x1=${x.toFixed(1)}
            x2=${x.toFixed(1)}
            y1=${TOP_PAD}
            y2=${VIEW_H}
            stroke-width=${EVENT_HIT_W}
          ></line>
          <line
            class="event-marker ${colorClass}"
            x1=${x.toFixed(1)}
            x2=${x.toFixed(1)}
            y1=${TOP_PAD}
            y2=${VIEW_H}
          ></line>
        </g>`;
      })
      .filter((node) => node !== null);

    const hover =
      this._hoverIdx !== null && this._hoverIdx >= 0 && this._hoverIdx < samplePts.length
        ? samplePts[this._hoverIdx]
        : null;

    const hoverGuide = hover
      ? svg`<g class="hover-guide" pointer-events="none">
          <line class="hover-line"
            x1=${hover.x.toFixed(1)} x2=${hover.x.toFixed(1)}
            y1=${TOP_PAD} y2=${VIEW_H}></line>
          <circle class="hover-dot" cx=${hover.x.toFixed(1)} cy=${hover.y.toFixed(1)} r="3"></circle>
        </g>`
      : nothing;

    // A HOLD lookup, not nearest-by-distance: the series is a step function,
    // so picking the nearest sample in either direction reads the FUTURE just
    // before a transition and disagrees with the very line under the cursor.
    // Reads the clamped but UN-expanded series on purpose — per `stepExpand`'s
    // own doc, a hold lookup must not see synthesized carry vertices.
    //
    // Suppressed entirely past `now`: the actual curve ends there, so a hold
    // lookup on an evening forecast sample would report the last recorded
    // value with no actual line anywhere beneath the cursor — the same
    // readout-disagrees-with-the-line problem in the other direction. Written
    // as `!(t > now)` so an unparseable sample's NaN `t` (NaN compares false)
    // falls through to `valueAt`, which returns null for it as before.
    const hoverActual = hover && !(hover.t > this.now) ? valueAt(historyValues, hover.t) : null;

    const hoverLabel = hover
      ? html`<div class="hover-label" style=${`left: ${((hover.x / VIEW_W) * 100).toFixed(2)}%`}>
          ${describeSample(hover.sample, tracks)}${hoverActual !== null
            ? ` · ${t('forecast.legend_actual', this.hass)} ${axisValueText(hoverActual, historyAxis)}`
            : ''}
        </div>`
      : nothing;

    // Fixed 00/06/12/18/24 tick labels + faint gridlines (mirrors elevation-chart.ts)
    const ticks = [0, 6, 12, 18, 24].map((h) => {
      const tickX = xAt(dayStart + h * 3600_000);
      return svg`
        <line class="grid faint" x1=${tickX} y1=${TOP_PAD} x2=${tickX} y2=${VIEW_H - 0.5} />
        <text class="axis-label tick-time" x=${tickX} y=${VIEW_H - 3} text-anchor="middle">${h.toString().padStart(2, '0')}:00</text>
      `;
    });

    // "now" cursor — only rendered when now falls within today's window
    const nowMs = this.now;
    const nowX = xAt(nowMs);
    const nowInDay = nowMs >= dayStart && nowMs <= dayEnd;
    const nowCursor = nowInDay
      ? svg`<g class="now-group" ${tooltip(formatClock(new Date(nowMs).toISOString()))}>
          <line class="now-hit" x1=${nowX.toFixed(1)} y1=${TOP_PAD} x2=${nowX.toFixed(1)} y2=${VIEW_H - 0.5}></line>
          <line class="now" x1=${nowX.toFixed(1)} y1=${TOP_PAD} x2=${nowX.toFixed(1)} y2=${VIEW_H - 0.5}></line>
        </g>`
      : nothing;

    return html`
      <div class="wrap">
        <svg
          viewBox="0 0 ${VIEW_W} ${VIEW_H}"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          @pointermove=${this._onPointerMove}
          @pointerleave=${this._onPointerLeave}
        >
          <line class="baseline" x1="0" y1=${VIEW_H - 0.5} x2=${VIEW_W} y2=${VIEW_H - 0.5}></line>
          <text class="axis-label" x="4" y=${TOP_PAD + 8} text-anchor="start">
            ${axisValueText(primary.max, primary)}
          </text>
          ${ticks} ${trackCurves}
          ${actualPoints
            ? svg`<polyline class="track actual-curve" points=${actualPoints} fill="none"></polyline>`
            : nothing}
          ${eventGroups} ${hoverGuide} ${nowCursor}
        </svg>
        ${this._renderLegend(drawn, hasHistory)} ${hoverLabel}
      </div>
    `;
  }

  /**
   * Legend built from what was actually plotted, never from what might have
   * been: one entry per DRAWN track (same class, so the swatch carries the same
   * color and dash as its line) plus Actual only when there is recorded history
   * to draw. A single-track strip with no history has nothing to disambiguate,
   * so it gets no legend at all.
   *
   * `drawn` — not the resolved track list — is what makes this honest, and the
   * distinction is reachable rather than theoretical. Track membership is
   * decided by whether ANY sample carries the axis; the curve is drawn only
   * from samples inside today's window. A pre-#510 integration walking 12h
   * forward from the evening carries its solar samples (and their tilt values)
   * entirely into TOMORROW, so the axis resolves, nothing plots, and legending
   * the resolved list would show a swatch for a line that isn't there — and
   * flip the position entry's label as collateral, via `multiAxis` below.
   *
   * The lone position track keeps reading "Forecast" — with nothing to contrast
   * it against, its axis name says less than what the line IS. As soon as a
   * second axis appears, both switch to their axis labels, because "Forecast"
   * vs "Tilt" would imply the tilt line isn't also a forecast.
   */
  private _renderLegend(drawn: AxisTrack[], hasHistory: boolean): TemplateResult | typeof nothing {
    if (drawn.length < 2 && !hasHistory) return nothing;
    const multiAxis = drawn.length > 1;
    return html`<div class="legend">
      ${drawn.map(
        (track) =>
          html`<span class="legend-item"
            ><span class="swatch ${track.cls}"></span>${track.primary && !multiAxis
              ? t('forecast.legend_forecast', this.hass)
              : track.label}</span
          >`,
      )}
      ${hasHistory
        ? html`<span class="legend-item"
            ><span class="swatch actual-curve"></span>${t(
              'forecast.legend_actual',
              this.hass,
            )}</span
          >`
        : nothing}
    </div>`;
  }

  private _onPointerMove = (e: PointerEvent): void => {
    const svgEl = e.currentTarget as SVGSVGElement;
    const rect = svgEl.getBoundingClientRect();
    if (rect.width <= 0) return;
    const fraction = (e.clientX - rect.left) / rect.width;
    const svgX = Math.max(0, Math.min(1, fraction)) * ForecastStrip.VIEW_W;
    this._hoverIdx = this._nearestSampleIdx(svgX);
  };

  private _onPointerLeave = (): void => {
    this._hoverIdx = null;
  };

  private _nearestSampleIdx(svgX: number): number | null {
    // Same fixed local-day window `render()` draws — recomputed here because
    // this runs off a pointer event, outside that render pass.
    const dayStart = startOfDay(new Date(this.now)).getTime();
    const dayEnd = dayStart + DAY_MS;
    let bestIdx = -1;
    let bestDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < this.samples.length; i++) {
      const ts = Date.parse(this.samples[i].t);
      // Skip out-of-day samples so hover can't land on a point the curve omits.
      if (Number.isNaN(ts) || ts < dayStart || ts > dayEnd) continue;
      const x = dayFractionX(ts, dayStart, ForecastStrip.VIEW_W);
      const d = Math.abs(x - svgX);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    return bestIdx >= 0 ? bestIdx : null;
  }

  public static styles = css`
    :host {
      display: block;
    }
    .wrap {
      position: relative;
      width: 100%;
    }
    svg {
      display: block;
      width: 100%;
      height: 80px;
      overflow: visible;
    }
    .baseline {
      stroke: var(--divider-color, rgba(0, 0, 0, 0.12));
      stroke-width: 1;
    }
    /* One color per plotted series, declared once as --acp-track-color and then
       consumed as a stroke by the polyline and as a border color by the legend
       swatch carrying the same class. That shared declaration is what keeps the
       legend honest: a track cannot change color without its swatch following. */
    .track {
      stroke: var(--acp-track-color, var(--primary-color));
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
    }
    .track.secondary {
      stroke-dasharray: 4 2;
    }
    .track.actual-curve {
      stroke-width: 1.75;
    }
    .curve {
      --acp-track-color: var(--primary-color);
    }
    /* Recorded actual position: a solid contrasting line over the forecast so
       "predicted vs. reality" reads at a glance. Uses a distinct literal color
       (not --info-color, which collides with the blue --primary-color forecast
       in many themes); overridable via --acp-actual-color. */
    .actual-curve {
      --acp-track-color: var(--acp-actual-color, #e040fb);
    }
    /* Secondary-axis palette. Deliberately clear of every color already spoken
       for on this strip: the primary blue, the magenta actual line, and the
       amber/orange/green/grey of the sunrise, sunset and acceptance-angle
       markers. It notably does NOT use --accent-color, which these tracks used
       to take and which resolves to the same amber as the sunrise marker in
       HA's stock dark theme, so a horizontal tilt track and a vertical sunrise
       line were drawn identically. */
    .axis-c0 {
      --acp-track-color: var(--acp-forecast-axis-1, #26a69a);
    }
    .axis-c1 {
      --acp-track-color: var(--acp-forecast-axis-2, #7e57c2);
    }
    .axis-c2 {
      --acp-track-color: var(--acp-forecast-axis-3, #8d6e63);
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 12px;
      margin-top: 2px;
      font-size: 0.68rem;
      color: var(--secondary-text-color, #888);
    }
    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .swatch {
      display: inline-block;
      width: 12px;
      height: 0;
      border-top: 2px solid var(--acp-track-color, currentColor);
    }
    .swatch.secondary {
      border-top-style: dashed;
    }
    /* Floating-tooltip cursor lifecycle: a help cursor hints at the event
       marker on hover, flipping to default once OUR bubble appears. */
    [data-tooltip]:hover {
      cursor: help;
    }
    [data-tooltip][acp-tt-shown] {
      cursor: default;
    }
    .event-hit {
      stroke: transparent;
      vector-effect: non-scaling-stroke;
    }
    .event-marker {
      stroke: var(--secondary-text-color);
      stroke-width: 1;
      stroke-dasharray: 2 2;
      vector-effect: non-scaling-stroke;
      pointer-events: none;
    }
    .evt-sunrise {
      stroke: #fbc02d;
    }
    .evt-sunset {
      stroke: #f57c00;
    }
    .evt-fov_enter {
      stroke: #4caf50;
    }
    .evt-fov_exit {
      stroke: #9e9e9e;
    }
    .hover-line {
      stroke: var(--primary-text-color, currentColor);
      stroke-width: 1;
      stroke-dasharray: 1 2;
      opacity: 0.55;
      vector-effect: non-scaling-stroke;
    }
    .hover-dot {
      fill: var(--primary-color);
      stroke: var(--card-background-color, #fff);
      stroke-width: 1;
    }
    .hover-label {
      position: absolute;
      bottom: calc(100% + 4px);
      transform: translateX(-50%);
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.75));
      color: var(--primary-text-color, #fff);
      font-size: 0.72rem;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    .axis-label {
      font-size: 9px;
      fill: var(--secondary-text-color, #888);
      pointer-events: none;
      vector-effect: non-scaling-stroke;
      user-select: none;
    }
    .grid {
      stroke: var(--divider-color);
      stroke-width: 0.5;
      opacity: 0.6;
    }
    .grid.faint {
      opacity: 0.25;
    }
    .now {
      stroke: var(--accent-color, crimson);
      stroke-width: 1.25;
      pointer-events: none;
    }
    .now-hit {
      stroke: transparent;
      stroke-width: 10;
    }
  `;
}

function clampPercent(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

function describeEvent(e: ForecastEvent, hass: HomeAssistant | undefined): string {
  const key = `forecast.event.${e.kind}`;
  const translated = t(key, hass);
  // `t()` echoes the key when missing — treat that as "no translation found".
  const meaning = translated === key ? (e.label ?? e.kind) : translated;
  const time = formatClock(e.t);
  return time === '—' ? meaning : `${meaning} — ${time}`;
}

/** One plotted series: the primary curve, or one secondary-axis track. */
interface AxisTrack {
  /** Sample key this track reads. */
  key: string;
  /** True for the entry's leading axis — the solid curve, and the range every
   *  other y-mapping on the strip (hover dot, recorded-actual line, the axis
   *  label at the top left) is expressed in. Carried as a flag rather than
   *  inferred from index 0, because the legend is handed a FILTERED list and
   *  its first element need not be this one. */
  primary: boolean;
  /** Display label — the legend entry and the hover readout's prefix. */
  label: string;
  /** Value range this axis counts in, used to map onto the 0-100 plot scale. */
  min: number;
  max: number;
  /** Unit suffix for the hover readout. */
  unit: string;
  /** CSS class carrying the track's color (plus `secondary` for the dash). */
  cls: string;
  /** Polyline point-strings, one per contiguous run. Filled in by `render()`. */
  runs: string[];
}

// Sample keys that are never candidates for a secondary-axis track.
const KNOWN_SAMPLE_KEYS = new Set(['t', 'position', 'handler']);

// How many distinct secondary-axis colors the palette defines. Beyond this the
// classes cycle — no integration publishes four drivable axes today, and a
// repeated color still reads correctly because the legend repeats it too.
const AXIS_PALETTE_SIZE = 3;

/** A plottable axis. `ResolvedAxis` satisfies it; the legacy sniff synthesizes
 *  one. Deliberately narrower than `ResolvedAxis` — nothing here needs the
 *  control-side fields (`stateAttr`, `targetRole`, `openBlocksSun`). */
type PlottableAxis = Pick<ResolvedAxis, 'id' | 'label' | 'min' | 'max' | 'unit'>;

function axisLabel(axis: PlottableAxis, hass: HomeAssistant | undefined): string {
  // AXIS_LABEL_I18N_KEYS is the card's single map of axis id → i18n key, shared
  // with the cover bar, the tile and the editor. A local copy is how the
  // forecast strip ended up the one surface that didn't localize a new axis.
  const i18nKey = AXIS_LABEL_I18N_KEYS[axis.id];
  if (i18nKey) return t(i18nKey, hass);
  if (axis.label) return axis.label;
  return axis.id.charAt(0).toUpperCase() + axis.id.slice(1);
}

function makeTrack(axis: PlottableAxis, hass: HomeAssistant | undefined, index: number): AxisTrack {
  return {
    key: axis.id,
    primary: index === 0,
    label: axisLabel(axis, hass),
    min: axis.min,
    max: axis.max,
    unit: axis.unit,
    cls: index === 0 ? 'curve' : `axis-c${(index - 1) % AXIS_PALETTE_SIZE} secondary`,
    runs: [],
  };
}

/** The axis a caller-less strip plots: the one field every `ForecastSample` is
 *  guaranteed to carry, as a plain percent. */
const IMPLICIT_POSITION_AXIS: PlottableAxis = {
  id: 'position',
  label: '',
  min: 0,
  max: 100,
  unit: '%',
};

/**
 * The tracks to plot, leading axis first.
 *
 * Membership is DISCOVERY's call, for every track including the first. The
 * entry's declared axis order decides which one is the solid curve; the samples
 * only decide whether a declared axis has anything to draw.
 *
 * That the first track is not special-cased to `position` is the point. A
 * tilt-only cover type (`cover_tilt`, a louvered roof — see `axes.ts`
 * `positionAxisFor`) publishes ONLY its slat axis, and hard-coding a position
 * curve there would draw a line for an axis discovery says does not exist and
 * then let the new legend put a name on it — the day/night phantom-tilt bug
 * mirrored, and worse for being labelled.
 *
 * Three inputs, three different answers — see the `axes` property doc:
 *   - `undefined` (a caller predating the property): implicit position axis plus
 *     the old single-key sniff. This is the path that mis-plotted a
 *     `supported: false` tilt; it survives only as a compatibility fallback and
 *     must never be reached from the dialog. It restores the old membership
 *     rule, not the old styling — see the class doc.
 *   - `[]` (discovery answered, and nothing is supported): the implicit position
 *     axis ALONE. `position` is the one field every `ForecastSample` carries, so
 *     the curve still has something to draw — but no sniff, because an entry
 *     that declares no drivable axis is precisely the one a sniff would invent a
 *     slat track for.
 *   - a declared list: exactly those axes.
 */
function resolveTracks(
  samples: ForecastSample[],
  axes: ResolvedAxis[] | undefined,
  hass: HomeAssistant | undefined,
): AxisTrack[] {
  const carried = (key: string): boolean => samples.some((s) => typeof s[key] === 'number');

  if (axes === undefined) {
    return [IMPLICIT_POSITION_AXIS, ...legacySniffAxis(samples)].map((axis, i) =>
      makeTrack(axis, hass, i),
    );
  }
  if (axes.length === 0) return [makeTrack(IMPLICIT_POSITION_AXIS, hass, 0)];

  // Dedupe by id: a malformed payload declaring an axis twice would otherwise
  // draw two identical polylines in different palette colors, legend both, and
  // repeat itself in the hover readout.
  const seen = new Set<string>();
  const declared = axes.filter((a) => !seen.has(a.id) && (seen.add(a.id), true));

  // The leading axis always gets a track — an entry that declares it but whose
  // samples omit it simply draws nothing, and the `drawn` filter in `render()`
  // keeps that out of the legend. Every axis after it has to earn its track by
  // appearing in the samples.
  return declared
    .filter((axis, i) => i === 0 || carried(axis.id))
    .map((axis, i) => makeTrack(axis, hass, i));
}

/**
 * Pre-discovery fallback: the first numeric key across all samples that isn't
 * `t`/`position`/`handler`, synthesized into a percent axis. Only reachable
 * when the caller supplies no axes at all — `resolveAxes()` always returns at
 * least a position axis, so a real entry never lands here.
 */
function legacySniffAxis(samples: ForecastSample[]): PlottableAxis[] {
  for (const s of samples) {
    for (const k of Object.keys(s)) {
      if (!KNOWN_SAMPLE_KEYS.has(k) && typeof s[k] === 'number') {
        return [{ id: k, label: '', min: 0, max: 100, unit: '%' }];
      }
    }
  }
  return [];
}

/** Map a raw axis value onto the strip's 0-100 plot scale. Identity for the
 *  0-100 percent axes every cover type publishes today; the division is what
 *  lets a future degrees-or-millimetres axis plot against the same grid. */
function axisFraction(value: number, axis: Pick<AxisTrack, 'min' | 'max'>): number {
  const span = axis.max - axis.min;
  if (span === 0) return 0;
  return clampPercent(((value - axis.min) / span) * 100);
}

/** Clamp into the axis's own declared range, so the readout can never report a
 *  value the axis cannot hold. NOT `clampPercent` — that hardcodes 0-100 and
 *  would silently truncate any axis counting in something else. */
function clampToAxis(value: number, axis: Pick<AxisTrack, 'min' | 'max'>): number {
  if (Number.isNaN(value)) return axis.min;
  return Math.max(axis.min, Math.min(axis.max, value));
}

/** A value with its axis's unit. `%` and `°` sit tight against the number the
 *  way every other readout in the card writes them; a word-like unit gets the
 *  space it needs so a hypothetical millimetre axis doesn't read "50mm" jammed
 *  against a percent-shaped number. */
function axisValueText(value: number, axis: Pick<AxisTrack, 'min' | 'max' | 'unit'>): string {
  const rounded = Math.round(clampToAxis(value, axis));
  const tight = axis.unit === '' || axis.unit === '%' || axis.unit === '°';
  return `${rounded}${tight ? '' : ' '}${axis.unit}`;
}

function describeSample(s: ForecastSample, tracks: AxisTrack[]): string {
  const time = formatClock(s.t);
  const primary = tracks.find((track) => track.primary) ?? tracks[0];
  const primaryRaw = s[primary.key];
  const lead = axisValueText(typeof primaryRaw === 'number' ? primaryRaw : s.position, primary);
  const base = s.handler ? `${time} · ${lead} · ${s.handler}` : `${time} · ${lead}`;
  const extras = tracks
    .filter((track) => track !== primary)
    .map((track) => {
      const raw = s[track.key];
      return typeof raw === 'number' ? ` · ${track.label}: ${axisValueText(raw, track)}` : '';
    })
    .join('');
  return `${base}${extras}`;
}
