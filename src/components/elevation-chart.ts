import { LitElement, html, css, svg, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import type { DiscoveredEntities, SunPositionAttributes } from '../types';
import { findFovWindows, sampleDay, startOfDayInZone, type SunSample } from '../lib/sun-model';
import { elevationBandFraction, ribbonLayout } from '../lib/geometry';
import { resolveCoverColor } from '../lib/palette';
import { formatClock } from '../lib/formatters';
import { t } from '../lib/i18n';

const VIEWBOX_W = 400;
const VIEWBOX_H = 160;
const PAD_L = 32;
const PAD_R = 8;
const PAD_T = 10;
const PAD_B = 22;

// Per-window FOV ribbon (multi-window only), stacked below the plot block.
const RIBBON_TOP_PAD = 6;
const RIBBON_ROW_H = 8;
const RIBBON_GAP = 3;
const RIBBON_BOTTOM_PAD = 4;

@customElement('acp-elevation-chart')
export class ElevationChart extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discoveredList: DiscoveredEntities[] = [];
  @property({ attribute: false }) public coverColors: (string | null | undefined)[] = [];
  @property({ type: Boolean, reflect: true }) public compact = false;

  private _sunAttrsFor(d: DiscoveredEntities): SunPositionAttributes | null {
    const id = d.entities.sun_sensor;
    if (!id) return null;
    const st = this.hass.states[id];
    if (!st) return null;
    return st.attributes as unknown as SunPositionAttributes;
  }

  private _sunInfront(): boolean {
    const id = this.discoveredList[0]?.entities.sun_infront_binary;
    if (!id) return false;
    return this.hass.states[id]?.state === 'on';
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || this.discoveredList.length === 0) return nothing;
    const firstAttrs = this._sunAttrsFor(this.discoveredList[0]);
    const { latitude, longitude, time_zone } = (this.hass.config ?? {}) as unknown as {
      latitude?: number;
      longitude?: number;
      time_zone?: string;
    };
    if (latitude === undefined || longitude === undefined || !firstAttrs) {
      return html`<div class="placeholder">${t('elevation.placeholder', this.hass)}</div>`;
    }

    const day = startOfDayInZone(time_zone);
    const samples = sampleDay(latitude, longitude, day);
    const now = new Date();

    const maxElev = 90;
    const minElev = -10; // small negative so dawn/dusk renders below horizon

    const xAt = (t: Date): number => {
      const msIn = t.getTime() - day.getTime();
      const frac = msIn / (24 * 60 * 60 * 1000);
      return PAD_L + frac * (VIEWBOX_W - PAD_L - PAD_R);
    };
    const yAt = (elev: number): number => {
      const frac = (elev - minElev) / (maxElev - minElev);
      return VIEWBOX_H - PAD_B - frac * (VIEWBOX_H - PAD_B - PAD_T);
    };

    const curvePoints = samples
      .map((s) => `${xAt(s.t).toFixed(1)},${yAt(s.elevation).toFixed(1)}`)
      .join(' ');

    const horizonY = yAt(0);
    const nowX = xAt(now);
    const currentSample = this._interpAt(samples, now);
    const currentY = currentSample ? yAt(currentSample.elevation) : null;
    // Mirror the sky compass sun-dot colour states: dim amber below the
    // horizon, gold while the sun is hitting the window, light gold when up
    // but not hitting.
    const sunBelowHorizon = currentSample ? currentSample.elevation <= 0 : true;
    const sunDotState = sunBelowHorizon ? 'night' : this._sunInfront() ? 'valid' : 'up';

    const plotTop = PAD_T;
    const plotBottom = VIEWBOX_H - PAD_B;
    // Map a 0..1 elevation-axis fraction to a y coordinate (0 = bottom).
    const yForFrac = (frac: number): number => plotBottom - frac * (plotBottom - plotTop);

    const multi = this.discoveredList.length > 1;

    // Per-window data. The day samples, curve, axes, horizon, now-cursor and
    // sun-dot are shared (sun geometry). In single-window mode the FOV band is
    // drawn IN the plot (legacy). In multi-window mode the plot stays pristine
    // and per-window FOV timing moves to a dedicated ribbon below it.
    const windows = this.discoveredList.map((d, i) => {
      const attrs = this._sunAttrsFor(d);
      const { color, isOverride } = resolveCoverColor(this.coverColors?.[i], i);
      // Inline fill for the in-plot band only in single-window override mode; a
      // plain single window keeps the CSS gold fallback — zero regression.
      const inlineFill = isOverride;
      if (!attrs) {
        return { d, runs: [], inPlotBands: [], runBars: [], label: '', color, inlineFill };
      }
      const runs = findFovWindows(samples, attrs.window_azimuth, attrs.fov_left, attrs.fov_right);

      // Elevation limits (optional integration attrs) clip the in-plot band.
      const hasMin = typeof attrs.min_elevation === 'number';
      const hasMax = typeof attrs.max_elevation === 'number';
      const { loFrac, hiFrac } = elevationBandFraction(
        attrs.min_elevation,
        attrs.max_elevation,
        minElev,
        maxElev,
      );
      const clipTopY = hasMin || hasMax ? yForFrac(hiFrac) : plotTop;
      const clipBottomY = hasMin || hasMax ? yForFrac(loFrac) : plotBottom;
      const bandY = clipTopY;
      const bandHeight = Math.max(0, clipBottomY - clipTopY);

      // In-plot bands (single-window legacy only).
      const inPlotBands = runs.map((w) => ({
        x0: xAt(samples[w.startIdx].t),
        x1: xAt(samples[w.endIdx].t),
        y: bandY,
        height: bandHeight,
      }));
      // Ribbon bars (multi-window): x-extent + this run's clock range (for the
      // hover tooltip); y comes from ribbonLayout.
      const runBars = runs.map((w) => ({
        x0: xAt(samples[w.startIdx].t),
        x1: xAt(samples[w.endIdx].t),
        range: `${formatClock(samples[w.startIdx].t.toISOString())} → ${formatClock(
          samples[w.endIdx].t.toISOString(),
        )}`,
      }));
      const label = runs
        .map(
          (w) =>
            `${formatClock(samples[w.startIdx].t.toISOString())} → ${formatClock(
              samples[w.endIdx].t.toISOString(),
            )}`,
        )
        .join(', ');
      const limitLines: number[] = [];
      if (!multi) {
        if (hasMin) limitLines.push(clipBottomY);
        if (hasMax) limitLines.push(clipTopY);
      }
      return { d, runs, inPlotBands, runBars, label, color, inlineFill, limitLines };
    });

    const anyFov = windows.some((w) => w.runs.length > 0);

    // Ribbon layout (multi-window only). Rows are placed below the plot block
    // (y origin = VIEWBOX_H). totalH grows the svg so the ribbon is never
    // squished; an inline aspect-ratio matches the dynamic viewBox.
    // ribbonLayout works in coordinates relative to the plot block; rows are
    // offset by VIEWBOX_H at render time. (Passing an absolute `top` here would
    // double-count VIEWBOX_H in `height` and inflate totalH — and the cursor.)
    const ribbon = multi
      ? ribbonLayout(windows.length, RIBBON_TOP_PAD, RIBBON_ROW_H, RIBBON_GAP, RIBBON_BOTTOM_PAD)
      : { rows: [], height: 0 };
    const totalH = multi ? VIEWBOX_H + ribbon.height : VIEWBOX_H;
    const nowY2 = multi ? totalH - RIBBON_BOTTOM_PAD : VIEWBOX_H - PAD_B;

    return html`
      <div class="wrap">
        <div class="head">
          <span class="label">${t('elevation.title', this.hass)}</span>
          ${
            // Multi-window: no per-window legend here — the sky-compass legend
            // above already keys each window's colour. The ribbon below carries
            // the timing. Single-window keeps its inline FOV-time summary.
            multi
              ? nothing
              : anyFov
                ? html`<span class="dim"
                    >${t('elevation.fov_windows', this.hass, { windows: windows[0].label })}</span
                  >`
                : html`<span class="dim">${t('elevation.no_fov_today', this.hass)}</span>`
          }
        </div>
        <svg
          viewBox="0 0 ${VIEWBOX_W} ${totalH}"
          preserveAspectRatio="none"
          style=${multi ? `aspect-ratio: ${VIEWBOX_W} / ${totalH}` : nothing}
        >
          ${svg`
            <!-- y-axis gridlines -->
            ${[0, 30, 60, 90].map(
              (e) => svg`
              <line class="grid" x1=${PAD_L} y1=${yAt(e)} x2=${VIEWBOX_W - PAD_R} y2=${yAt(e)} />
              <text class="tick" x=${PAD_L - 4} y=${yAt(e) + 3} text-anchor="end">${e}°</text>
            `,
            )}

            <!-- x-axis gridlines at every 6h -->
            ${[0, 6, 12, 18, 24].map((h) => {
              const t = new Date(day.getTime() + h * 3600_000);
              return svg`
                <line class="grid faint" x1=${xAt(t)} y1=${PAD_T} x2=${xAt(t)} y2=${VIEWBOX_H - PAD_B} />
                <text class="tick" x=${xAt(t)} y=${VIEWBOX_H - PAD_B + 14} text-anchor="middle">${h.toString().padStart(2, '0')}:00</text>
              `;
            })}

            <!-- horizon -->
            <line class="horizon" x1=${PAD_L} y1=${horizonY} x2=${VIEWBOX_W - PAD_R} y2=${horizonY} />

            <!-- elevation limit gridlines (single-window legacy path only) -->
            ${windows.flatMap((w) =>
              (w.limitLines ?? []).map(
                (y) =>
                  svg`<line class="limit-line" x1=${PAD_L} y1=${y} x2=${VIEWBOX_W - PAD_R} y2=${y} />`,
              ),
            )}

            <!-- In-plot FOV bands: single-window legacy path only. -->
            ${
              multi
                ? nothing
                : windows.flatMap((w) =>
                    w.inPlotBands.map(
                      (b) => svg`<rect
                        class="fov-band"
                        x=${b.x0}
                        y=${b.y}
                        width=${b.x1 - b.x0}
                        height=${b.height}
                        style=${w.inlineFill ? `fill:${w.color}` : nothing}
                      />`,
                    ),
                  )
            }

            <!-- elevation curve -->
            <polyline class="curve" points=${curvePoints} />

            <!-- current-time cursor (extends through the ribbon in multi) -->
            <line class="now" x1=${nowX} y1=${PAD_T} x2=${nowX} y2=${nowY2} />

            <!-- current sun dot -->
            ${
              currentY !== null
                ? svg`<circle class="sun-dot ${sunDotState}" cx=${nowX} cy=${currentY} r="4" />`
                : nothing
            }

            <!-- Per-window FOV ribbon (multi-window only): one row per window,
                 a faint full-width track plus color-keyed bars for in-FOV runs,
                 sharing the plot's xAt() time scale. -->
            ${ribbon.rows.flatMap((row, i) => {
              const w = windows[i];
              const rowY = VIEWBOX_H + row.y;
              // Track tooltip names the window so empty rows are identifiable;
              // bar tooltips add that run's exact clock range (the numbers we
              // dropped from the head legend live here on hover instead).
              const trackTitle = w.runs.length
                ? w.d.entry_title
                : t('elevation.fov_window_named', this.hass, {
                    name: w.d.entry_title,
                    windows: t('elevation.no_fov_today', this.hass),
                  });
              const track = svg`<rect
                class="ribbon-track"
                x=${PAD_L}
                y=${rowY}
                width=${VIEWBOX_W - PAD_L - PAD_R}
                height=${row.height}
                rx="2"
              ><title>${trackTitle}</title></rect>`;
              const bars = w.runBars.map(
                (b) => svg`<rect
                  class="ribbon-bar"
                  x=${b.x0}
                  y=${rowY}
                  width=${b.x1 - b.x0}
                  height=${row.height}
                  rx="2"
                  style=${`fill:${w.color}`}
                ><title>${t('elevation.fov_window_named', this.hass, {
                  name: w.d.entry_title,
                  windows: b.range,
                })}</title></rect>`,
              );
              return [track, ...bars];
            })}
          `}
        </svg>
      </div>
    `;
  }

  private _interpAt(samples: SunSample[], t: Date): SunSample | null {
    if (samples.length === 0) return null;
    const ms = t.getTime();
    if (ms <= samples[0].t.getTime()) return samples[0];
    if (ms >= samples[samples.length - 1].t.getTime()) return samples[samples.length - 1];
    for (let i = 1; i < samples.length; i++) {
      if (samples[i].t.getTime() >= ms) {
        const a = samples[i - 1];
        const b = samples[i];
        const frac = (ms - a.t.getTime()) / (b.t.getTime() - a.t.getTime());
        return {
          t,
          elevation: a.elevation + (b.elevation - a.elevation) * frac,
          azimuth: a.azimuth + (b.azimuth - a.azimuth) * frac,
        };
      }
    }
    return samples[samples.length - 1];
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
      align-items: baseline;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }
    .label {
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    svg {
      width: 100%;
      height: auto;
      aspect-ratio: 400 / 160;
      display: block;
    }
    :host([compact]) svg {
      aspect-ratio: 400 / 110;
    }
    :host([compact]) .head {
      display: none;
    }
    .grid {
      stroke: var(--divider-color);
      stroke-width: 0.5;
      opacity: 0.6;
    }
    .grid.faint {
      opacity: 0.25;
    }
    .tick {
      font-size: 9px;
      fill: var(--secondary-text-color);
    }
    .horizon {
      stroke: var(--divider-color);
      stroke-width: 1;
      stroke-dasharray: 2 2;
    }
    .limit-line {
      stroke: var(--warning-color, gold);
      stroke-width: 1;
      stroke-dasharray: 4 3;
      opacity: 0.7;
    }
    .fov-band {
      fill: var(--warning-color, gold);
      fill-opacity: 0.18;
    }
    .ribbon-track {
      fill: var(--divider-color);
      fill-opacity: 0.25;
    }
    .ribbon-bar {
      fill: var(--warning-color, gold);
      fill-opacity: 0.85;
    }
    .curve {
      fill: none;
      stroke: var(--primary-color);
      stroke-width: 2;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    .now {
      stroke: var(--accent-color, crimson);
      stroke-width: 1.25;
    }
    /* Colour states mirror acp-sky-compass .sun.* so the sun reads the same
       across both visuals. */
    .sun-dot {
      fill: var(--secondary-text-color);
      transition: fill 0.3s ease;
    }
    .sun-dot.up {
      fill: #ffe680;
    }
    .sun-dot.valid {
      fill: var(--warning-color, gold);
      filter: drop-shadow(0 0 3px var(--warning-color, gold));
    }
    .sun-dot.night {
      fill: var(--warning-color, #d4a017);
      opacity: 0.55;
    }
    .dim {
      color: var(--secondary-text-color);
    }
    .placeholder {
      color: var(--secondary-text-color);
      text-align: center;
      padding: 20px;
    }
  `;
}
