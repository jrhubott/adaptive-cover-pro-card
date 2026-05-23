import { LitElement, html, svg, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { ForecastEvent, ForecastSample } from '../types';

/**
 * Hand-written SVG strip rendering today's forecast curve + boundary events.
 *
 * Keeps the bundle small (no charting library; see CLAUDE.md "Keep bundle
 * small"). Inputs are the integration's `position_forecast` sensor
 * attributes: a list of (t, position) samples and a list of (t, kind, label)
 * events. Time axis is derived from the first/last sample so the strip
 * always fills its viewport regardless of forecast window length.
 */
@customElement('acp-forecast-strip')
export class ForecastStrip extends LitElement {
  @property({ attribute: false }) public samples: ForecastSample[] = [];
  @property({ attribute: false }) public events: ForecastEvent[] = [];
  /** Optional override for "now"; defaults to wall-clock at render time. */
  @property({ attribute: false }) public now?: number;

  // Fixed SVG viewport. The element scales to fit its container via
  // preserveAspectRatio="none" so callers can constrain the rendered height
  // without touching the viewBox math.
  private static readonly VIEW_W = 600;
  private static readonly VIEW_H = 80;
  // Reserve a tiny strip at the top for event labels.
  private static readonly TOP_PAD = 10;

  protected render(): TemplateResult | typeof nothing {
    if (!this.samples || this.samples.length === 0) return nothing;
    const range = this._timeRange();
    if (!range) return nothing;
    const { start, end } = range;
    const span = end - start;
    if (span <= 0) return nothing;
    const { VIEW_W, VIEW_H, TOP_PAD } = ForecastStrip;
    const usableH = VIEW_H - TOP_PAD;

    const points = this.samples
      .map((s) => {
        const t = Date.parse(s.t);
        const x = ((t - start) / span) * VIEW_W;
        const y = TOP_PAD + (1 - clampPercent(s.position) / 100) * usableH;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    const eventLines = (this.events ?? [])
      .map((e) => {
        const t = Date.parse(e.t);
        if (Number.isNaN(t) || t < start || t > end) return null;
        const x = ((t - start) / span) * VIEW_W;
        const colorClass = `evt-${e.kind}`;
        return svg`<line
          class="event-marker ${colorClass}"
          x1=${x.toFixed(1)}
          x2=${x.toFixed(1)}
          y1=${TOP_PAD}
          y2=${VIEW_H}
        >
          <title>${e.label}</title>
        </line>`;
      })
      .filter((node) => node !== null);

    const now = this.now ?? Date.now();
    let nowMarker: TemplateResult | typeof nothing = nothing;
    if (now >= start && now <= end) {
      const x = ((now - start) / span) * VIEW_W;
      nowMarker = svg`<line
        class="now-line"
        x1=${x.toFixed(1)}
        x2=${x.toFixed(1)}
        y1="0"
        y2=${VIEW_H}
      ><title>Now</title></line>`;
    }

    return html`
      <div class="wrap">
        <svg
          viewBox="0 0 ${VIEW_W} ${VIEW_H}"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line class="baseline" x1="0" y1=${VIEW_H - 0.5} x2=${VIEW_W} y2=${VIEW_H - 0.5}></line>
          <polyline class="curve" points=${points} fill="none"></polyline>
          ${eventLines}
          ${nowMarker}
        </svg>
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

  public static styles = css`
    :host {
      display: block;
    }
    .wrap {
      width: 100%;
    }
    svg {
      display: block;
      width: 100%;
      height: 80px;
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
    .event-marker {
      stroke: var(--secondary-text-color);
      stroke-width: 1;
      stroke-dasharray: 2 2;
      vector-effect: non-scaling-stroke;
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
    .now-line {
      stroke: var(--primary-text-color);
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
    }
  `;
}

function clampPercent(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}
