import { LitElement, html, svg, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type { ForecastEvent, ForecastSample } from '../types';
import { formatClock } from '../lib/formatters';

/**
 * Hand-written SVG strip rendering today's forecast curve + boundary events.
 *
 * Keeps the bundle small (no charting library; see CLAUDE.md "Keep bundle
 * small"). Inputs are the integration's `position_forecast` sensor
 * attributes: a list of (t, position) samples and a list of (t, kind, label)
 * events. Time axis is derived from the first/last sample so the strip
 * always fills its viewport regardless of forecast window length.
 *
 * Hover affordances:
 *   - Vertical event markers get a wide invisible hit area + cursor:help and
 *     a richer `<title>` (kind meaning + local time).
 *   - The curve shows a follow-along label with the nearest sample's time,
 *     position %, and handler (solar/default/...).
 */
@customElement('acp-forecast-strip')
export class ForecastStrip extends LitElement {
  @property({ attribute: false }) public samples: ForecastSample[] = [];
  @property({ attribute: false }) public events: ForecastEvent[] = [];

  @state() private _hoverIdx: number | null = null;

  // Fixed SVG viewport. The element scales to fit its container via
  // preserveAspectRatio="none" so callers can constrain the rendered height
  // without touching the viewBox math.
  private static readonly VIEW_W = 600;
  private static readonly VIEW_H = 80;
  // Reserve a tiny strip at the top for event labels.
  private static readonly TOP_PAD = 10;
  // Width of the invisible hit-area overlaid on each event line.
  private static readonly EVENT_HIT_W = 12;

  protected render(): TemplateResult | typeof nothing {
    if (!this.samples || this.samples.length === 0) return nothing;
    const range = this._timeRange();
    if (!range) return nothing;
    const { start, end } = range;
    const span = end - start;
    if (span <= 0) return nothing;
    const { VIEW_W, VIEW_H, TOP_PAD, EVENT_HIT_W } = ForecastStrip;
    const usableH = VIEW_H - TOP_PAD;

    const samplePts = this.samples.map((s) => {
      const t = Date.parse(s.t);
      const x = ((t - start) / span) * VIEW_W;
      const y = TOP_PAD + (1 - clampPercent(s.position) / 100) * usableH;
      return { t, x, y, sample: s };
    });
    const points = samplePts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

    const eventGroups = (this.events ?? [])
      .map((e) => {
        const t = Date.parse(e.t);
        if (Number.isNaN(t) || t < start || t > end) return null;
        const x = ((t - start) / span) * VIEW_W;
        const colorClass = `evt-${e.kind}`;
        const tooltip = describeEvent(e);
        return svg`<g class="event-group" data-tooltip=${tooltip}>
          <title>${tooltip}</title>
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
          ${describeSample(hover.sample)}
        </div>`
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
          <title>
            Hover the curve for time + forecast position; hover a colored line for the event it
            marks.
          </title>
          <line class="baseline" x1="0" y1=${VIEW_H - 0.5} x2=${VIEW_W} y2=${VIEW_H - 0.5}></line>
          <polyline class="curve" points=${points} fill="none"></polyline>
          ${eventGroups} ${hoverGuide}
        </svg>
        ${hoverLabel}
      </div>
    `;
  }

  private _timeRange(): { start: number; end: number } | null {
    let start = Number.POSITIVE_INFINITY;
    let end = Number.NEGATIVE_INFINITY;
    for (const s of this.samples) {
      const t = Date.parse(s.t);
      if (Number.isNaN(t)) continue;
      if (t < start) start = t;
      if (t > end) end = t;
    }
    if (start === Number.POSITIVE_INFINITY) return null;
    return { start, end };
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
    const range = this._timeRange();
    if (!range) return null;
    const span = range.end - range.start;
    if (span <= 0) return null;
    let bestIdx = -1;
    let bestDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < this.samples.length; i++) {
      const t = Date.parse(this.samples[i].t);
      if (Number.isNaN(t)) continue;
      const x = ((t - range.start) / span) * ForecastStrip.VIEW_W;
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
    .event-group {
      cursor: help;
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
  `;
}

function clampPercent(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

const EVENT_KIND_MEANINGS: Record<string, string> = {
  sunrise: 'Sunrise',
  sunset: 'Sunset',
  fov_enter: 'Sun enters window field of view',
  fov_exit: 'Sun leaves window field of view',
};

function describeEvent(e: ForecastEvent): string {
  const meaning = EVENT_KIND_MEANINGS[e.kind] ?? e.label ?? e.kind;
  const time = formatClock(e.t);
  return time === '—' ? meaning : `${meaning} — ${time}`;
}

function describeSample(s: ForecastSample): string {
  const time = formatClock(s.t);
  const pct = `${Math.round(clampPercent(s.position))}%`;
  return s.handler ? `${time} · ${pct} · ${s.handler}` : `${time} · ${pct}`;
}
