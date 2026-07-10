import { LitElement, html, svg, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import type { ForecastEvent, ForecastSample } from '../types';
import { formatClock } from '../lib/formatters';
import { t } from '../lib/i18n';
import { dayFractionX, percentToY } from '../lib/geometry';
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
 * Secondary axis (e.g. `tilt`): samples may additively carry one extra
 * numeric key beyond `t`/`position`/`handler` (see `ForecastSample`'s index
 * signature). When present, it's detected generically (no hardcoded axis
 * name) and drawn as a second, dashed polyline distinct from the position
 * curve, split into separate segments across any in-day sample that lacks
 * the key (e.g. a non-solar stretch). Absent the key, this is a no-op and
 * output matches a card that only knows about `position`.
 */
@customElement('acp-forecast-strip')
export class ForecastStrip extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public samples: ForecastSample[] = [];
  @property({ attribute: false }) public events: ForecastEvent[] = [];
  @property({ attribute: false }) public now = Date.now();
  /** Axis id → display label, sourced from the integration's discovery. Used
   *  for secondary-axis keys that have no card i18n key; known axes (e.g.
   *  `tilt`) still prefer the card i18n string so de/fr localize. */
  @property({ attribute: false }) public axisLabels?: Record<string, string>;

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
    if (!this.samples || this.samples.length === 0) return nothing;

    const { VIEW_W, VIEW_H, TOP_PAD, EVENT_HIT_W } = ForecastStrip;
    const usableH = VIEW_H - TOP_PAD;

    // Fixed local-day axis: midnight → midnight (mirrors elevation-chart.ts)
    const dayStart = startOfDay(new Date(this.now)).getTime();

    const xAt = (t: number): number => dayFractionX(t, dayStart, VIEW_W);

    // Keep samplePts index-aligned with `this.samples` (hover indexing depends
    // on it), but flag samples that fall outside today's window so the curve and
    // hover skip them. A pre-#510 integration walks 12h from `now`, spilling past
    // midnight; clamping those onto the right edge would draw a spurious spike.
    const samplePts = this.samples.map((s) => {
      const ts = Date.parse(s.t);
      const x = xAt(ts);
      const y = percentToY(s.position, TOP_PAD, usableH);
      const inDay = !Number.isNaN(ts) && ts >= dayStart && ts <= dayStart + DAY_MS;
      return { t: ts, x, y, sample: s, inDay };
    });
    const points = samplePts
      .filter((p) => p.inDay)
      .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ');

    // Secondary-axis track (e.g. tilt): detected generically, drawn as
    // separate dashed polyline runs so a gap (a stretch of in-day samples
    // lacking the key) doesn't draw a spurious connecting line.
    const secondaryKey = findSecondaryAxisKey(this.samples);
    const secondaryRuns: string[] = [];
    if (secondaryKey !== null) {
      let current: string[] = [];
      for (const p of samplePts) {
        if (!p.inDay) continue;
        const raw = p.sample[secondaryKey];
        if (typeof raw === 'number') {
          const y2 = percentToY(raw, TOP_PAD, usableH);
          current.push(`${p.x.toFixed(1)},${y2.toFixed(1)}`);
        } else if (current.length > 0) {
          secondaryRuns.push(current.join(' '));
          current = [];
        }
      }
      if (current.length > 0) secondaryRuns.push(current.join(' '));
    }
    const secondaryCurves = secondaryRuns.map(
      (runPoints) =>
        svg`<polyline class="curve-secondary" points=${runPoints} fill="none"></polyline>`,
    );

    const eventGroups = (this.events ?? [])
      .map((e) => {
        const eventTime = Date.parse(e.t);
        if (Number.isNaN(eventTime) || eventTime < dayStart || eventTime > dayStart + DAY_MS)
          return null;
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

    const hoverLabel = hover
      ? html`<div class="hover-label" style=${`left: ${((hover.x / VIEW_W) * 100).toFixed(2)}%`}>
          ${describeSample(hover.sample, secondaryKey, this.hass, this.axisLabels)}
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
    const nowInDay = nowMs >= dayStart && nowMs <= dayStart + DAY_MS;
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
          <text class="axis-label" x="4" y=${TOP_PAD + 8} text-anchor="start">100%</text>
          ${ticks}
          <polyline class="curve" points=${points} fill="none"></polyline>
          ${secondaryCurves} ${eventGroups} ${hoverGuide} ${nowCursor}
        </svg>
        ${hoverLabel}
      </div>
    `;
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
    const dayStart = startOfDay(new Date(this.now)).getTime();
    let bestIdx = -1;
    let bestDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < this.samples.length; i++) {
      const ts = Date.parse(this.samples[i].t);
      // Skip out-of-day samples so hover can't land on a point the curve omits.
      if (Number.isNaN(ts) || ts < dayStart || ts > dayStart + DAY_MS) continue;
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
    .curve {
      stroke: var(--primary-color);
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
    }
    .curve-secondary {
      stroke: var(--accent-color, currentColor);
      stroke-width: 1.5;
      stroke-dasharray: 4 2;
      vector-effect: non-scaling-stroke;
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

// Sample keys that are never candidates for the secondary-axis track.
const KNOWN_SAMPLE_KEYS = new Set(['t', 'position', 'handler']);

/**
 * Generically detect an optional secondary-axis key (e.g. `tilt`) on
 * forecast samples: the first key across all samples that isn't one of the
 * known `t`/`position`/`handler` fields and whose value is a number.
 * Returns `null` when no sample carries such a key (older integrations,
 * single-axis covers, or no solar samples) — the caller then renders no
 * secondary track, matching today's output byte-for-byte.
 */
function findSecondaryAxisKey(samples: ForecastSample[]): string | null {
  for (const s of samples) {
    for (const k of Object.keys(s)) {
      if (!KNOWN_SAMPLE_KEYS.has(k) && typeof s[k] === 'number') return k;
    }
  }
  return null;
}

// Display labels for known secondary-axis keys, resolved via i18n. These WIN
// over discovery-supplied labels so de/fr localize. A key with no card i18n key
// falls to the discovery-supplied `axisLabels`, then a capitalized raw key name.
const AXIS_LABELS: Record<string, string> = { tilt: 'covers.tilt_title' };

function axisLabel(
  key: string,
  hass: HomeAssistant | undefined,
  axisLabels: Record<string, string> | undefined,
): string {
  const i18nKey = AXIS_LABELS[key];
  if (i18nKey) return t(i18nKey, hass);
  const discovered = axisLabels?.[key];
  if (discovered) return discovered;
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function describeSample(
  s: ForecastSample,
  secondaryKey: string | null,
  hass: HomeAssistant | undefined,
  axisLabels: Record<string, string> | undefined,
): string {
  const time = formatClock(s.t);
  const pct = `${Math.round(clampPercent(s.position))}%`;
  const base = s.handler ? `${time} · ${pct} · ${s.handler}` : `${time} · ${pct}`;
  if (secondaryKey === null) return base;
  const raw = s[secondaryKey];
  if (typeof raw !== 'number') return base;
  const label = axisLabel(secondaryKey, hass, axisLabels);
  const secondaryPct = `${Math.round(clampPercent(raw))}%`;
  return `${base} · ${label}: ${secondaryPct}`;
}
