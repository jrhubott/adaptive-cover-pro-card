import { LitElement, html, css, svg, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import type { DiscoveredEntities, SunPositionAttributes } from '../types';
import { findFovWindow, sampleDay, startOfDay, type SunSample } from '../lib/sun-model';
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
  @property({ attribute: false }) public discovered!: DiscoveredEntities;
  @property({ type: Boolean, reflect: true }) public compact = false;

  private _sunAttrs(): SunPositionAttributes | null {
    const id = this.discovered.entities.sun_sensor;
    if (!id) return null;
    const st = this.hass.states[id];
    if (!st) return null;
    return st.attributes as unknown as SunPositionAttributes;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.discovered) return nothing;
    const attrs = this._sunAttrs();
    const { latitude, longitude } = this.hass.config as unknown as {
      latitude?: number;
      longitude?: number;
    };
    if (latitude === undefined || longitude === undefined || !attrs) {
      return html`<div class="placeholder">${t('elevation.placeholder', this.hass)}</div>`;
    }

    const day = startOfDay();
    const samples = sampleDay(latitude, longitude, day);
    const now = new Date();
    const fov = findFovWindow(samples, attrs.window_azimuth, attrs.fov_left, attrs.fov_right);

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

    const fovStart = fov ? samples[fov.startIdx].t : null;
    const fovEnd = fov ? samples[fov.endIdx].t : null;
    const fovX0 = fovStart ? xAt(fovStart) : null;
    const fovX1 = fovEnd ? xAt(fovEnd) : null;

    return html`
      <div class="wrap">
        <div class="head">
          <span class="label">${t('elevation.title', this.hass)}</span>
          ${fovStart && fovEnd
            ? html`<span class="dim"
                >${t('elevation.fov_window', this.hass, {
                  from: formatClock(fovStart.toISOString()),
                  to: formatClock(fovEnd.toISOString()),
                })}</span
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

            <!-- FOV shaded band (only the time the sun is actually in FOV + above horizon) -->
            ${
              fovX0 !== null && fovX1 !== null
                ? svg`<rect
                  class="fov-band"
                  x=${fovX0}
                  y=${PAD_T}
                  width=${fovX1 - fovX0}
                  height=${VIEWBOX_H - PAD_T - PAD_B}
                />`
                : nothing
            }

            <!-- elevation curve -->
            <polyline class="curve" points=${curvePoints} />

            <!-- current-time cursor -->
            <line class="now" x1=${nowX} y1=${PAD_T} x2=${nowX} y2=${VIEWBOX_H - PAD_B} />

            <!-- current sun dot -->
            ${
              currentY !== null
                ? svg`<circle class="sun-dot" cx=${nowX} cy=${currentY} r="4" />`
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
    .sun-dot {
      fill: gold;
      filter: drop-shadow(0 0 3px gold);
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
