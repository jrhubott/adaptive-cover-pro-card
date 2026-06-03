import { LitElement, html, css, svg, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import type { DiscoveredEntities, SunPositionAttributes } from '../types';
import { findFovWindows, sampleDay, startOfDayInZone, type SunSample } from '../lib/sun-model';
import { bandLaneRect, elevationBandFraction } from '../lib/geometry';
import { resolveCoverColor } from '../lib/palette';
import { formatClock } from '../lib/formatters';
import { t } from '../lib/i18n';

const VIEWBOX_W = 400;
const VIEWBOX_H = 160;
const PAD_L = 32;
const PAD_R = 8;
const PAD_T = 10;
const PAD_B = 22;

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
    // Lanes stack the windows vertically (one strip each) so overlapping FOV
    // times stay legible. Compact mode (and single-window) overlap instead —
    // vertical space is scarce, so bands share the full-height strip.
    const layout: 'lanes' | 'overlap' = this.compact || !multi ? 'overlap' : 'lanes';

    // Per-window FOV bands, elevation-clipped and color-keyed. The day samples,
    // curve, axes, horizon, now-cursor and sun-dot are shared (sun geometry).
    const count = this.discoveredList.length;
    const windows = this.discoveredList.map((d, i) => {
      const attrs = this._sunAttrsFor(d);
      const { color, isOverride } = resolveCoverColor(this.coverColors?.[i], i);
      // Inline fill only in multi-window (or explicit override) mode; a single
      // window keeps the CSS gold fallback — zero visual regression.
      const inlineFill = multi || isOverride;
      if (!attrs) {
        return { d, runs: [], bands: [], label: '', color, inlineFill };
      }
      const runs = findFovWindows(samples, attrs.window_azimuth, attrs.fov_left, attrs.fov_right);

      // Elevation limits (optional integration attrs) clip the band y-extent.
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

      // In lane mode each window owns a horizontal slice; intersect its
      // elevation clip with that lane. In overlap mode the lane is the full
      // strip, so the band spans clipTop..clipBottom directly.
      const lane =
        layout === 'lanes'
          ? bandLaneRect(i, count, plotTop, plotBottom)
          : bandLaneRect(0, 1, plotTop, plotBottom);
      const laneTop = lane.y;
      const laneBottom = lane.y + lane.height;
      const bandTop = Math.max(clipTopY, laneTop);
      const bandBottom = Math.min(clipBottomY, laneBottom);
      const bandY = bandTop;
      const bandHeight = Math.max(0, bandBottom - bandTop);

      const bands = runs.map((w) => ({
        x0: xAt(samples[w.startIdx].t),
        x1: xAt(samples[w.endIdx].t),
        y: bandY,
        height: bandHeight,
      }));
      const label = runs
        .map(
          (w) =>
            `${formatClock(samples[w.startIdx].t.toISOString())} → ${formatClock(
              samples[w.endIdx].t.toISOString(),
            )}`,
        )
        .join(', ');
      // Limit gridlines: full-width only in the single-window legacy path; in
      // multi-window lane mode the per-lane band height conveys the clip.
      const limitLines: number[] = [];
      if (!multi) {
        if (hasMin) limitLines.push(clipBottomY);
        if (hasMax) limitLines.push(clipTopY);
      }
      return { d, runs, bands, label, color, inlineFill, limitLines };
    });

    const anyFov = windows.some((w) => w.runs.length > 0);

    return html`
      <div class="wrap">
        <div class="head">
          <span class="label">${t('elevation.title', this.hass)}</span>
          ${multi
            ? html`<div class="fov-list">
                ${windows.map(
                  (w) =>
                    html`<span class="fov-line">
                      <span
                        class="swatch"
                        style=${w.inlineFill ? `background:${w.color}` : nothing}
                      ></span>
                      <span class="dim"
                        >${w.runs.length
                          ? t('elevation.fov_window_named', this.hass, {
                              name: w.d.entry_title,
                              windows: w.label,
                            })
                          : t('elevation.no_fov_today', this.hass)}</span
                      >
                    </span>`,
                )}
              </div>`
            : anyFov
              ? html`<span class="dim"
                  >${t('elevation.fov_windows', this.hass, { windows: windows[0].label })}</span
                >`
              : html`<span class="dim">${t('elevation.no_fov_today', this.hass)}</span>`}
        </div>
        <svg viewBox="0 0 ${VIEWBOX_W} ${VIEWBOX_H}" preserveAspectRatio="none">
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

            <!-- elevation limit gridlines (single-window legacy path only;
                 multi-window lane heights convey the clip) -->
            ${windows.flatMap((w) =>
              (w.limitLines ?? []).map(
                (y) =>
                  svg`<line class="limit-line" x1=${PAD_L} y1=${y} x2=${VIEWBOX_W - PAD_R} y2=${y} />`,
              ),
            )}

            <!-- FOV shaded bands per window (each time the sun is actually in
                 FOV + above horizon), clipped to the in-band elevation range
                 and color-keyed in multi-window mode -->
            ${windows.flatMap((w) =>
              w.bands.map(
                (b) => svg`<rect
                  class="fov-band"
                  x=${b.x0}
                  y=${b.y}
                  width=${b.x1 - b.x0}
                  height=${b.height}
                  style=${w.inlineFill ? `fill:${w.color}` : nothing}
                />`,
              ),
            )}

            <!-- elevation curve -->
            <polyline class="curve" points=${curvePoints} />

            <!-- current-time cursor -->
            <line class="now" x1=${nowX} y1=${PAD_T} x2=${nowX} y2=${VIEWBOX_H - PAD_B} />

            <!-- current sun dot -->
            ${
              currentY !== null
                ? svg`<circle class="sun-dot ${sunDotState}" cx=${nowX} cy=${currentY} r="4" />`
                : nothing
            }
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
    .fov-list {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
    }
    .fov-line {
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .swatch {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 2px;
      background: var(--warning-color, gold);
      flex: 0 0 auto;
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
