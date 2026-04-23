import { LitElement, html, css, svg, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import type { DiscoveredEntities, SunPositionAttributes } from '../types';
import { azimuthToCartesian, normalizeAzimuth, sunDotPosition, wedgePath } from '../lib/geometry';
import { sampleDay, startOfDay, sunriseSetAzimuths, getMoonData } from '../lib/sun-model';
import { formatDegrees } from '../lib/formatters';

// viewBox must have ~30 px of padding beyond OUTER_R so cardinal labels
// (positioned at OUTER_R + 6..14) don't clip when rendered with
// text-anchor="middle" (~7px half-width at 12px font).
const VIEWBOX = 280;
const OUTER_R = 110;

@customElement('acp-sky-compass')
export class SkyCompass extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered!: DiscoveredEntities;
  @property({ type: Boolean, reflect: true }) public compact = false;
  @property({ attribute: false }) public showStats = true;
  @property({ attribute: false }) public showLegend = true;
  @property({ attribute: false }) public showMoon = false;

  private _sun(): SunPositionAttributes | null {
    const id = this.discovered.entities.sun_sensor;
    if (!id) return null;
    const state = this.hass.states[id];
    if (!state) return null;
    const azimuth = parseFloat(state.state);
    if (Number.isNaN(azimuth)) return null;
    return {
      ...(state.attributes as unknown as SunPositionAttributes),
      window_azimuth: (state.attributes as { window_azimuth: number }).window_azimuth,
    };
  }

  private _coverPosition(): number | null {
    const id = this.discovered.entities.target_position_sensor;
    if (!id) return null;
    const val = parseFloat(this.hass.states[id]?.state ?? '');
    return Number.isNaN(val) ? null : val;
  }

  private _sunInfront(): boolean {
    const id = this.discovered.entities.sun_infront_binary;
    if (!id) return false;
    return this.hass.states[id]?.state === 'on';
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.discovered) return nothing;
    const sun = this._sun();
    if (!sun) {
      return html`<div class="placeholder">Sun sensor not yet populated.</div>`;
    }

    const windowAzi = normalizeAzimuth(sun.window_azimuth);
    const fovStart = normalizeAzimuth(windowAzi - sun.fov_left);
    const fovEnd = normalizeAzimuth(windowAzi + sun.fov_right);
    const sunSensorId = this.discovered.entities.sun_sensor;
    const sunAzi = parseFloat(this.hass.states[sunSensorId!]?.state ?? '0');
    const sunElev = sun.elevation;
    const sunPt = sunDotPosition(sunAzi, sunElev);
    const windowArrow = azimuthToCartesian(windowAzi, OUTER_R);

    const { latitude, longitude } = this.hass.config as unknown as {
      latitude?: number;
      longitude?: number;
    };
    const samples =
      latitude !== undefined && longitude !== undefined
        ? sampleDay(latitude, longitude, startOfDay())
        : [];

    const moon =
      this.showMoon && latitude !== undefined && longitude !== undefined
        ? getMoonData(latitude, longitude)
        : null;
    const moonAboveHorizon = moon !== null && moon.elevation > 0;
    const MOON_R = 6;
    const moonShadowDx = moon
      ? moon.phase < 0.5
        ? -4 * MOON_R * moon.phase
        : 4 * MOON_R * (1 - moon.phase)
      : 0;
    const moonPt = moonAboveHorizon ? sunDotPosition(moon!.azimuth, moon!.elevation) : null;
    const moonX = moonPt ? moonPt.x * OUTER_R : 0;
    const moonY = moonPt ? moonPt.y * OUTER_R : 0;

    const pathPoints = samples
      .filter((s) => s.elevation > 0)
      .map((s) => {
        const pt = sunDotPosition(s.azimuth, s.elevation);
        return `${(pt.x * OUTER_R).toFixed(1)},${(pt.y * OUTER_R).toFixed(1)}`;
      })
      .join(' ');

    const { riseAzimuth, setAzimuth } = sunriseSetAzimuths(samples);
    const risePt = riseAzimuth !== null ? azimuthToCartesian(riseAzimuth, OUTER_R) : null;
    const setPt = setAzimuth !== null ? azimuthToCartesian(setAzimuth, OUTER_R) : null;

    const blindSpot = sun.blind_spot_range
      ? wedgePath(
          normalizeAzimuth(sun.blind_spot_range[0]),
          normalizeAzimuth(sun.blind_spot_range[1]),
          OUTER_R,
        )
      : null;

    const coverPos = this._coverPosition();
    const coverR = coverPos !== null ? OUTER_R * (1 - coverPos / 100) : null;

    const inFov = sun.in_fov;
    const sunValid = this._sunInfront();
    const belowHorizon = sunElev <= 0;
    const sunDotClass =
      !belowHorizon && sunValid ? 'sun valid' : !belowHorizon && inFov ? 'sun in-fov' : 'sun';

    return html`
      <div class="compass">
        <svg viewBox="${-VIEWBOX / 2} ${-VIEWBOX / 2} ${VIEWBOX} ${VIEWBOX}">
          ${svg`
            <defs>
              ${
                moonAboveHorizon
                  ? svg`
                <mask id="moon-phase-mask">
                  <circle cx=${moonX} cy=${moonY} r=${MOON_R} fill="white" />
                  <circle cx=${moonX + moonShadowDx} cy=${moonY} r=${MOON_R} fill="black" />
                </mask>
              `
                  : nothing
              }
            </defs>
            <!-- concentric elevation rings at 30°, 60° -->
            <circle class="grid" r=${OUTER_R} />
            <circle class="grid" r=${(OUTER_R * 2) / 3} />
            <circle class="grid" r=${OUTER_R / 3} />
            <!-- cardinal direction lines -->
            <line class="grid thin" x1="0" y1=${-OUTER_R} x2="0" y2=${OUTER_R} />
            <line class="grid thin" x1=${-OUTER_R} y1="0" x2=${OUTER_R} y2="0" />

            <!-- FOV wedge -->
            <path class="fov" d=${wedgePath(fovStart, fovEnd, OUTER_R)} />

            <!-- cover closure fill (inner wedge, same FOV span, radius ∝ closure) -->
            ${coverR !== null && coverR > 0.5 ? svg`<path class="cover-fill" d=${wedgePath(fovStart, fovEnd, coverR)} />` : nothing}

            <!-- blind spot (hatched) -->
            ${blindSpot ? svg`<path class="blind-spot" d=${blindSpot} />` : nothing}

            <!-- sun path arc -->
            ${pathPoints ? svg`<polyline class="sun-path" points=${pathPoints} />` : nothing}

            <!-- sunrise / sunset markers -->
            ${risePt ? svg`<circle class="rise-marker" cx=${risePt.x} cy=${risePt.y} r="4" />` : nothing}
            ${setPt ? svg`<circle class="set-marker" cx=${setPt.x} cy=${setPt.y} r="4" />` : nothing}

            <!-- window normal arrow -->
            <line
              class="window"
              x1="0" y1="0"
              x2=${windowArrow.x} y2=${windowArrow.y}
            />
            <circle class="window-base" cx="0" cy="0" r="4" />

            <!-- cardinal labels -->
            <text class="cardinal" x="0" y=${-OUTER_R - 6} text-anchor="middle">N</text>
            <text class="cardinal" x=${OUTER_R + 10} y="4" text-anchor="middle">E</text>
            <text class="cardinal" x="0" y=${OUTER_R + 14} text-anchor="middle">S</text>
            <text class="cardinal" x=${-OUTER_R - 10} y="4" text-anchor="middle">W</text>

            <!-- moon dot (above-horizon only) -->
            ${
              moonAboveHorizon
                ? svg`
              <circle class="moon-outline" cx=${moonX} cy=${moonY} r=${MOON_R} />
              <circle class="moon-lit" cx=${moonX} cy=${moonY} r=${MOON_R} mask="url(#moon-phase-mask)" />
            `
                : nothing
            }

            <!-- sun dot -->
            <circle
              class=${sunDotClass}
              cx=${sunPt.x * OUTER_R}
              cy=${sunPt.y * OUTER_R}
              r="7"
            />
          `}
        </svg>
        ${this.showLegend
          ? html`<div class="legend">
              <div><span class="dot sun valid"></span> Sun (in FOV)</div>
              <div><span class="dot sun"></span> Sun (outside)</div>
              ${this.showMoon ? html`<div><span class="dot moon-dot"></span> Moon</div>` : nothing}
              <div><span class="swatch fov"></span> Window FOV</div>
              <div><span class="swatch sun-path-swatch"></span> Sun path</div>
              <div><span class="dot rise-dot"></span> Sunrise</div>
              <div><span class="dot set-dot"></span> Sunset</div>
              <div><span class="swatch cover-fill-swatch"></span> Cover closed</div>
            </div>`
          : nothing}
        ${this.showStats
          ? html`<div class="stats dim">
              <span>Azi: ${formatDegrees(sunAzi)}</span>
              <span>Elev: ${formatDegrees(sunElev)}</span>
              <span>∠: ${formatDegrees(sun.gamma)}</span>
              <span>Window: ${formatDegrees(windowAzi)}</span>
              ${this.showMoon && moon
                ? html`<span>${moon.phaseName} ${Math.round(moon.fraction * 100)}%</span>`
                : nothing}
            </div>`
          : nothing}
      </div>
    `;
  }

  public static styles = css`
    :host {
      display: block;
    }
    .compass {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    svg {
      width: 100%;
      max-width: 260px;
      height: auto;
      display: block;
    }
    :host([compact]) svg {
      max-width: 180px;
    }
    :host([compact]) .legend {
      display: none;
    }
    .grid {
      fill: none;
      stroke: var(--divider-color);
      stroke-width: 1;
    }
    .grid.thin {
      stroke-width: 0.5;
      opacity: 0.5;
    }
    .fov {
      fill: var(--warning-color, gold);
      fill-opacity: 0.22;
      stroke: var(--warning-color, gold);
      stroke-width: 1;
      stroke-opacity: 0.7;
      transition: all 0.3s ease;
    }
    .cover-fill {
      fill: var(--primary-color);
      fill-opacity: 0.3;
      stroke: var(--primary-color);
      stroke-width: 1;
      stroke-opacity: 0.6;
      transition: all 0.3s ease;
    }
    .blind-spot {
      fill: var(--error-color, crimson);
      fill-opacity: 0.12;
      stroke: var(--error-color, crimson);
      stroke-dasharray: 3 3;
    }
    .window {
      stroke: var(--primary-color);
      stroke-width: 3;
      stroke-linecap: round;
    }
    .window-base {
      fill: var(--primary-color);
    }
    .cardinal {
      font-size: 12px;
      fill: var(--secondary-text-color);
      font-weight: 500;
    }
    .sun {
      fill: var(--secondary-text-color);
      transition:
        cx 0.3s ease,
        cy 0.3s ease,
        fill 0.3s ease;
    }
    .sun.in-fov {
      fill: orange;
    }
    .sun.valid {
      fill: gold;
      filter: drop-shadow(0 0 4px gold);
    }
    .legend {
      display: flex;
      gap: 12px;
      font-size: 0.75rem;
      color: var(--secondary-text-color);
      flex-wrap: wrap;
      justify-content: center;
    }
    .dot,
    .swatch {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 4px;
    }
    .swatch.fov {
      background: gold;
      opacity: 0.4;
      border-radius: 2px;
    }
    .dot.sun {
      background: var(--secondary-text-color);
    }
    .dot.sun.valid {
      background: gold;
    }
    .swatch.cover-fill-swatch {
      background: var(--primary-color);
      opacity: 0.35;
      border-radius: 2px;
    }
    .swatch.sun-path-swatch {
      background: gold;
      opacity: 0.45;
      border-radius: 2px;
    }
    .dot.rise-dot {
      background: var(--warning-color, gold);
      opacity: 0.75;
    }
    .dot.set-dot {
      background: var(--secondary-text-color);
      opacity: 0.55;
    }
    .stats {
      display: flex;
      gap: 12px;
      font-size: 0.78rem;
      flex-wrap: wrap;
      justify-content: center;
    }
    .dim {
      color: var(--secondary-text-color);
    }
    .placeholder {
      color: var(--secondary-text-color);
      text-align: center;
      padding: 20px;
    }
    .sun-path {
      fill: none;
      stroke: var(--warning-color, gold);
      stroke-width: 1.5;
      stroke-dasharray: 4 3;
      opacity: 0.45;
    }
    .rise-marker {
      fill: var(--warning-color, gold);
      opacity: 0.75;
    }
    .set-marker {
      fill: var(--secondary-text-color);
      opacity: 0.55;
    }
    .moon-outline {
      fill: none;
      stroke: var(--secondary-text-color);
      stroke-width: 0.8;
      opacity: 0.5;
    }
    .moon-lit {
      fill: var(--secondary-text-color);
      opacity: 0.75;
      transition:
        cx 0.3s ease,
        cy 0.3s ease;
    }
    .dot.moon-dot {
      background: var(--secondary-text-color);
      opacity: 0.6;
    }
  `;
}
