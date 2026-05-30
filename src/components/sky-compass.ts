import { LitElement, html, css, svg, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { HomeAssistant } from 'custom-card-helpers';

import type { DiscoveredEntities, SunPositionAttributes } from '../types';
import {
  azimuthToCartesian,
  blindSpotBearings,
  clampActiveArcToFov,
  elevationGatedFovBounds,
  fovBandRadii,
  normalizeAzimuth,
  sunDotPosition,
  wedgePath,
} from '../lib/geometry';
import {
  sampleDay,
  startOfDay,
  sunriseSetAzimuths,
  getMoonData,
  type SunSample,
} from '../lib/sun-model';
import { formatDegrees } from '../lib/formatters';
import { resolveCoverColor } from '../lib/palette';
import { t } from '../lib/i18n';

// viewBox must have ~30 px of padding beyond OUTER_R so cardinal labels
// (positioned at OUTER_R + 6..14) don't clip when rendered with
// text-anchor="middle" (~7px half-width at 12px font).
const VIEWBOX = 280;
const OUTER_R = 110;

interface EntryOverlay {
  d: DiscoveredEntities;
  sun: SunPositionAttributes;
  sunAzi: number;
  sunInfront: boolean;
  coverPos: number | null;
  coverType: DiscoveredEntities['cover_type'];
  color: string;
  isOverride: boolean;
  index: number;
}

@customElement('acp-sky-compass')
export class SkyCompass extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered_list: DiscoveredEntities[] = [];
  @property({ type: Boolean, reflect: true }) public compact = false;
  @property({ attribute: false }) public showStats = true;
  @property({ attribute: false }) public showLegend = true;
  @property({ attribute: false }) public showMoon = false;
  @property({ attribute: false }) public showCardinals = true;
  @property({ attribute: false }) public showBlindSpot = true;
  @property({ attribute: false }) public showSunPath = true;
  @property({ attribute: false }) public showSunriseSunset = true;
  @property({ attribute: false }) public showCoverFill = true;
  @property({ attribute: false }) public showWindowArrow = true;
  @property({ attribute: false }) public coverColors: (string | null | undefined)[] = [];
  @property({ attribute: false }) public northOffsetDeg = 0;

  @state() private _hiddenEntries = new Set<string>();

  private _toggleEntry(id: string) {
    const next = new Set(this._hiddenEntries);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this._hiddenEntries = next;
  }

  private _sunFor(d: DiscoveredEntities): SunPositionAttributes | null {
    const id = d.entities.sun_sensor;
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

  private _coverPositionFor(d: DiscoveredEntities): number | null {
    const id = d.entities.target_position_sensor;
    if (!id) return null;
    const val = parseFloat(this.hass.states[id]?.state ?? '');
    return Number.isNaN(val) ? null : val;
  }

  private _sunInfrontFor(d: DiscoveredEntities): boolean {
    const id = d.entities.sun_infront_binary;
    if (!id) return false;
    return this.hass.states[id]?.state === 'on';
  }

  private _readActiveAzimuth(entityId: string | undefined): number | null {
    if (!entityId) return null;
    const state = this.hass.states[entityId];
    if (!state) return null;
    if (state.state === 'unavailable' || state.state === 'unknown') return null;
    const azi = (state.attributes as { azimuth?: number }).azimuth;
    return typeof azi === 'number' && Number.isFinite(azi) ? azi : null;
  }

  private _buildOverlays(): EntryOverlay[] {
    const out: EntryOverlay[] = [];
    this.discovered_list.forEach((d, i) => {
      const sun = this._sunFor(d);
      if (!sun) return;
      const sunSensorId = d.entities.sun_sensor;
      const sunAzi = parseFloat(this.hass.states[sunSensorId!]?.state ?? '0');
      const { color, isOverride } = resolveCoverColor(this.coverColors?.[i], i);
      out.push({
        d,
        sun,
        sunAzi,
        sunInfront: this._sunInfrontFor(d),
        coverPos: this._coverPositionFor(d),
        coverType: d.cover_type,
        color,
        isOverride,
        index: i,
      });
    });
    return out;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass) return nothing;
    if (!this.discovered_list || this.discovered_list.length === 0) {
      return html`<div class="placeholder">${t('compass.placeholder_no_entries', this.hass)}</div>`;
    }

    const overlays = this._buildOverlays();
    if (overlays.length === 0) {
      return html`<div class="placeholder">${t('compass.placeholder_no_sun', this.hass)}</div>`;
    }

    // Filter at render boundary so stats and legend still see all entries
    const visibleOverlays = overlays.filter((ov) => !this._hiddenEntries.has(ov.d.entry_id));

    const o = normalizeAzimuth(this.northOffsetDeg);
    const multi = overlays.length > 1;
    const first = overlays[0];
    const sunAzi = first.sunAzi;
    const sunElev = first.sun.elevation;
    const sunPt = sunDotPosition(sunAzi, sunElev, o);
    const anyValid = overlays.some((ov) => ov.sunInfront);
    const belowHorizon = sunElev <= 0;
    const sunDotClass = belowHorizon ? 'sun' : anyValid ? 'sun valid' : 'sun up';

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
    const moonPt = moonAboveHorizon ? sunDotPosition(moon!.azimuth, moon!.elevation, o) : null;
    const moonX = moonPt ? moonPt.x * OUTER_R : 0;
    const moonY = moonPt ? moonPt.y * OUTER_R : 0;

    // Plot the full 24h track: daytime samples bow toward the centre (higher
    // elevation = smaller radius) while below-horizon samples clamp to the
    // outer rim (elevationToRadius maps elevation <= 0 to radius 1), so the
    // not-visible portion of the path traces around the outside of the circle.
    const pathPoints = this.showSunPath
      ? samples
          .map((s) => {
            const pt = sunDotPosition(s.azimuth, s.elevation, o);
            return `${(pt.x * OUTER_R).toFixed(1)},${(pt.y * OUTER_R).toFixed(1)}`;
          })
          .join(' ')
      : '';

    const { riseAzimuth, setAzimuth } = this.showSunriseSunset
      ? sunriseSetAzimuths(samples)
      : { riseAzimuth: null, setAzimuth: null };
    const risePt = riseAzimuth !== null ? azimuthToCartesian(riseAzimuth, OUTER_R, o) : null;
    const setPt = setAzimuth !== null ? azimuthToCartesian(setAzimuth, OUTER_R, o) : null;

    const cardinalPad = 14;
    const cardN = azimuthToCartesian(0, OUTER_R + cardinalPad, o);
    const cardE = azimuthToCartesian(90, OUTER_R + cardinalPad, o);
    const cardS = azimuthToCartesian(180, OUTER_R + cardinalPad, o);
    const cardW = azimuthToCartesian(270, OUTER_R + cardinalPad, o);
    const gridNS0 = azimuthToCartesian(0, OUTER_R, o);
    const gridNS1 = azimuthToCartesian(180, OUTER_R, o);
    const gridEW0 = azimuthToCartesian(90, OUTER_R, o);
    const gridEW1 = azimuthToCartesian(270, OUTER_R, o);

    const ttSun = t('compass.sun_tooltip', this.hass, {
      az: formatDegrees(sunAzi),
      el: formatDegrees(sunElev),
    });
    const ttRise =
      riseAzimuth !== null
        ? t('compass.sunrise_tooltip', this.hass, { time: formatDegrees(riseAzimuth) })
        : '';
    const ttSet =
      setAzimuth !== null
        ? t('compass.sunset_tooltip', this.hass, { time: formatDegrees(setAzimuth) })
        : '';
    const ttMoon =
      moon !== null
        ? t('compass.moon_tooltip', this.hass, {
            phase: moon.phaseName,
            pct: Math.round(moon.fraction * 100),
          })
        : '';
    const ttSunPath = t('compass.sun_path_tooltip', this.hass);

    return html`
      <div class="compass">
        <svg viewBox="${-VIEWBOX / 2} ${-VIEWBOX / 2} ${VIEWBOX} ${VIEWBOX}">
          ${svg`
            <defs>
              ${
                moonAboveHorizon
                  ? svg`
                <mask id="moon-phase-mask">
                  <circle cx=${moonX} cy=${moonY} r=${MOON_R} fill="white"></circle>
                  <circle cx=${moonX + moonShadowDx} cy=${moonY} r=${MOON_R} fill="black"></circle>
                </mask>
              `
                  : nothing
              }
            </defs>

            <circle class="grid" r=${OUTER_R}></circle>
            <circle class="grid" r=${(OUTER_R * 2) / 3}></circle>
            <circle class="grid" r=${OUTER_R / 3}></circle>
            <line class="grid thin" x1=${gridNS0.x} y1=${gridNS0.y} x2=${gridNS1.x} y2=${gridNS1.y}></line>
            <line class="grid thin" x1=${gridEW0.x} y1=${gridEW0.y} x2=${gridEW1.x} y2=${gridEW1.y}></line>

            ${visibleOverlays.map((ov) => this._renderEntryLayers(ov, multi, o, samples))}

            ${
              this.showSunPath && pathPoints
                ? svg`<g data-tooltip=${ttSunPath}><title>${ttSunPath}</title><polyline class="sun-path" points=${pathPoints}></polyline></g>`
                : nothing
            }

            ${
              this.showSunriseSunset && risePt && riseAzimuth !== null
                ? svg`<g data-tooltip=${ttRise}><title>${ttRise}</title><circle class="rise-marker" cx=${risePt.x} cy=${risePt.y} r="4"></circle></g>`
                : nothing
            }
            ${
              this.showSunriseSunset && setPt && setAzimuth !== null
                ? svg`<g data-tooltip=${ttSet}><title>${ttSet}</title><circle class="set-marker" cx=${setPt.x} cy=${setPt.y} r="4"></circle></g>`
                : nothing
            }

            ${
              this.showCardinals
                ? svg`
              <text class="cardinal" x=${cardN.x} y=${cardN.y} text-anchor="middle" dominant-baseline="central">N</text>
              <text class="cardinal" x=${cardE.x} y=${cardE.y} text-anchor="middle" dominant-baseline="central">E</text>
              <text class="cardinal" x=${cardS.x} y=${cardS.y} text-anchor="middle" dominant-baseline="central">S</text>
              <text class="cardinal" x=${cardW.x} y=${cardW.y} text-anchor="middle" dominant-baseline="central">W</text>
            `
                : nothing
            }

            ${
              moonAboveHorizon
                ? svg`
              <g data-tooltip=${ttMoon}>
                <title>${ttMoon}</title>
                <circle class="moon-outline" cx=${moonX} cy=${moonY} r=${MOON_R}></circle>
                <circle class="moon-lit" cx=${moonX} cy=${moonY} r=${MOON_R} mask="url(#moon-phase-mask)"></circle>
              </g>
            `
                : nothing
            }

            <g data-tooltip=${ttSun}>
              <title>${ttSun}</title>
              <circle class=${sunDotClass} cx=${sunPt.x * OUTER_R} cy=${sunPt.y * OUTER_R} r="7"></circle>
            </g>
          `}
        </svg>
        ${this.showLegend ? this._renderLegend(overlays, multi) : nothing}
        ${this.showStats ? this._renderStats(overlays, multi) : nothing}
      </div>
    `;
  }

  private _renderEntryLayers(
    o: EntryOverlay,
    multi: boolean,
    northOffsetDeg = 0,
    samples: SunSample[] = [],
  ) {
    const windowAzi = normalizeAzimuth(o.sun.window_azimuth);
    const fovStart = normalizeAzimuth(windowAzi - o.sun.fov_left);
    const fovEnd = normalizeAzimuth(windowAzi + o.sun.fov_right);
    const startAzi = this._readActiveAzimuth(o.d.entities.start_sensor);
    const endAzi = this._readActiveAzimuth(o.d.entities.end_sensor);
    const useActive = startAzi !== null && endAzi !== null;
    // Enforce invariant: the active sun arc is always a sub-arc of the configured FOV envelope
    // [windowAzi − fov_left, windowAzi + fov_right] (CW). When the integration reports an
    // interior start/end pair (e.g. from elevation-clipped disjoint daily intervals — issues #85,
    // #89), the "which arc contains the window normal" heuristic can pick the wrong ~270° inverse.
    // clampActiveArcToFov projects both values onto the envelope and picks the sub-arc; it
    // naturally handles the N-wrap case and falls back to the full envelope when sensors are absent.
    //
    // When sensors are absent (static FOV arc) and min_elevation is defined, narrow the azimuth
    // span to the portion of today's sun path that actually clears the elevation threshold (#92).
    let wedgeStart: number;
    let wedgeEnd: number;
    if (useActive) {
      ({ wedgeStart, wedgeEnd } = clampActiveArcToFov(
        normalizeAzimuth(startAzi!),
        normalizeAzimuth(endAzi!),
        windowAzi,
        o.sun.fov_left,
        o.sun.fov_right,
      ));
    } else {
      const gated = elevationGatedFovBounds(
        samples,
        windowAzi,
        o.sun.fov_left,
        o.sun.fov_right,
        o.sun.min_elevation,
      );
      wedgeStart = gated ? gated.wedgeStart : fovStart;
      wedgeEnd = gated ? gated.wedgeEnd : fovEnd;
    }
    const windowArrow = azimuthToCartesian(windowAzi, OUTER_R, northOffsetDeg);
    const { outer: fovOuterR, inner: fovInnerR } = fovBandRadii(
      o.sun.min_elevation,
      o.sun.max_elevation,
      OUTER_R,
    );
    const coverFraction =
      o.coverType === 'cover_awning' ? o.coverPos! / 100 : 1 - o.coverPos! / 100;
    const rawCoverR = o.coverPos !== null ? OUTER_R * coverFraction : null;
    const coverOuter = rawCoverR !== null ? Math.min(rawCoverR, fovOuterR) : null;
    const bsBearings = o.sun.blind_spot_range
      ? blindSpotBearings(windowAzi, o.sun.blind_spot_range as [number, number])
      : null;
    const blindSpot = bsBearings
      ? wedgePath(bsBearings[0], bsBearings[1], OUTER_R, 0, northOffsetDeg)
      : null;
    const fovPath = wedgePath(wedgeStart, wedgeEnd, fovOuterR, fovInnerR, northOffsetDeg);
    // Static FOV underlay: the configured `windowAzi ± fov_left/right` envelope.
    // Shown dim beneath the active arc so the developer can see the "configured
    // FOV" vs "today's reachable arc" together. We skip it when the active arc
    // already covers the full envelope (would be a redundant draw at full
    // opacity).
    const showStaticUnderlay = useActive && (wedgeStart !== fovStart || wedgeEnd !== fovEnd);
    const fovStaticPath = showStaticUnderlay
      ? wedgePath(fovStart, fovEnd, fovOuterR, fovInnerR, northOffsetDeg)
      : '';
    const coverPath =
      coverOuter !== null && coverOuter > fovInnerR
        ? wedgePath(wedgeStart, wedgeEnd, coverOuter, fovInnerR, northOffsetDeg)
        : '';

    const label = multi ? `${o.d.entry_title}: ` : '';
    const hasElevLimit = o.sun.min_elevation !== undefined || o.sun.max_elevation !== undefined;
    const elevSuffix = hasElevLimit
      ? t('compass.elev_suffix', this.hass, {
          min: formatDegrees(o.sun.min_elevation ?? 0),
          max: formatDegrees(o.sun.max_elevation ?? 90),
        })
      : '';
    const ttFov = useActive
      ? `${label}${t('compass.active_sun_arc', this.hass, {
          from: formatDegrees(wedgeStart),
          to: formatDegrees(wedgeEnd),
          elev: elevSuffix,
        })}`
      : `${label}${t('compass.fov_arc', this.hass, {
          left: formatDegrees(o.sun.fov_left),
          right: formatDegrees(o.sun.fov_right),
          elev: elevSuffix,
        })}`;
    const ttWindow = `${label}${t('compass.window_normal_tooltip', this.hass, {
      bearing: formatDegrees(windowAzi),
    })}`;
    const ttCoverFill =
      o.coverPos !== null
        ? o.coverType === 'cover_awning'
          ? `${label}${t('compass.cover_extended', this.hass, { pct: o.coverPos })}`
          : `${label}${t('compass.cover_closed_tooltip', this.hass, { pct: o.coverPos })}`
        : '';
    const ttBlindSpot = bsBearings
      ? `${label}${t('compass.blind_spot', this.hass, {
          from: formatDegrees(bsBearings[0]),
          to: formatDegrees(bsBearings[1]),
        })}`
      : '';

    const inlineColor = multi || o.isOverride;
    const fovStyle = inlineColor ? `fill: ${o.color}; stroke: ${o.color};` : '';
    const coverStyle = inlineColor ? `fill: ${o.color}; stroke: ${o.color};` : '';
    const blindStyle = inlineColor ? `fill: ${o.color}; stroke: ${o.color};` : '';
    const arrowStyle = inlineColor ? `stroke: ${o.color};` : '';
    const arrowBaseStyle = inlineColor ? `fill: ${o.color};` : '';

    const showCover = this.showCoverFill && coverPath !== '';
    const showBlind = this.showBlindSpot && !!blindSpot;
    const showArrow = this.showWindowArrow;
    const arrowPath = `M 0 0 L ${windowArrow.x} ${windowArrow.y}`;
    const hideStyle = 'display: none;';

    const ttFovStatic = `${label}${t('compass.fov_arc', this.hass, {
      left: formatDegrees(o.sun.fov_left),
      right: formatDegrees(o.sun.fov_right),
      elev: elevSuffix,
    })}`;
    return svg`<g class="entry-overlay">
      ${
        showStaticUnderlay
          ? svg`<g data-tooltip=${ttFovStatic}>
              <title>${ttFovStatic}</title>
              <path class="fov fov-static" style=${fovStyle} d=${fovStaticPath}></path>
            </g>`
          : nothing
      }
      <g data-tooltip=${ttFov}>
        <title>${ttFov}</title>
        <path class="fov" style=${fovStyle} d=${fovPath}></path>
      </g>
      <g class="arrow-group" data-tooltip=${ttWindow} style=${showArrow ? '' : hideStyle}>
        <title>${ttWindow}</title>
        <path class="window" style=${arrowStyle} d=${arrowPath}></path>
        <circle class="window-base" style=${arrowBaseStyle} cx="0" cy="0" r="4"></circle>
      </g>
      <g class="cover-group" data-tooltip=${ttCoverFill} style=${showCover ? '' : hideStyle}>
        <title>${ttCoverFill}</title>
        <path class="cover-fill" style=${coverStyle} d=${coverPath}></path>
      </g>
      <g class="blind-group" data-tooltip=${ttBlindSpot} style=${showBlind ? '' : hideStyle}>
        <title>${ttBlindSpot}</title>
        <path class="blind-spot" style=${blindStyle} d=${blindSpot ?? ''}></path>
      </g>
    </g>`;
  }

  private _renderLegend(overlays: EntryOverlay[], multi: boolean): TemplateResult {
    if (multi) {
      return html`
        <div class="legend">
          ${overlays.map(
            (o) => html`
              <button
                type="button"
                class=${classMap({
                  'entry-toggle': true,
                  hidden: this._hiddenEntries.has(o.d.entry_id),
                })}
                aria-pressed=${!this._hiddenEntries.has(o.d.entry_id)}
                @click=${() => this._toggleEntry(o.d.entry_id)}
              >
                <span class="swatch entry" style="background: ${o.color}"></span>
                ${o.d.entry_title}
                ${o.sunInfront
                  ? html`<span class="status valid">${t('compass.in_fov_check', this.hass)}</span>`
                  : o.sun.in_fov
                    ? html`<span class="status in-fov">${t('compass.in_fov', this.hass)}</span>`
                    : html`<span class="status">${t('compass.none', this.hass)}</span>`}
              </button>
            `,
          )}
          <div><span class="dot sun valid"></span> ${t('compass.sun', this.hass)}</div>
          ${this.showMoon
            ? html`<div><span class="dot moon-dot"></span> ${t('compass.moon', this.hass)}</div>`
            : nothing}
        </div>
      `;
    }
    return html`<div class="legend">
      <div><span class="dot sun valid"></span> ${t('compass.sun_hitting', this.hass)}</div>
      <div><span class="dot sun up"></span> ${t('compass.sun_up_not_hitting', this.hass)}</div>
      <div><span class="dot sun"></span> ${t('compass.sun_below_horizon', this.hass)}</div>
      ${this.showMoon
        ? html`<div><span class="dot moon-dot"></span> ${t('compass.moon', this.hass)}</div>`
        : nothing}
      <div><span class="swatch fov"></span> ${t('compass.window_fov', this.hass)}</div>
      ${this.showSunPath
        ? html`<div>
            <span class="swatch sun-path-swatch"></span> ${t('compass.sun_path', this.hass)}
          </div>`
        : nothing}
      ${this.showSunriseSunset
        ? html`<div><span class="dot rise-dot"></span> ${t('compass.sunrise', this.hass)}</div>
            <div><span class="dot set-dot"></span> ${t('compass.sunset', this.hass)}</div>`
        : nothing}
      ${this.showCoverFill
        ? html`<div>
            <span class="swatch cover-fill-swatch"></span> ${t('compass.cover_closed', this.hass)}
          </div>`
        : nothing}
      ${this.showWindowArrow
        ? html`<div>
            <span class="swatch window-swatch"></span> ${t('compass.window_normal', this.hass)}
          </div>`
        : nothing}
    </div>`;
  }

  private _renderStats(overlays: EntryOverlay[], multi: boolean): TemplateResult {
    const first = overlays[0];
    const sunAzi = first.sunAzi;
    const sunElev = first.sun.elevation;
    const { latitude, longitude } = this.hass.config as unknown as {
      latitude?: number;
      longitude?: number;
    };
    const moon =
      this.showMoon && latitude !== undefined && longitude !== undefined
        ? getMoonData(latitude, longitude)
        : null;

    if (multi) {
      return html`
        <div class="stats dim">
          <div class="stats-row">
            <span
              >${t('compass.stat_sun', this.hass)}${formatDegrees(sunAzi)} /
              ${formatDegrees(sunElev)}</span
            >
            ${this.showMoon && moon
              ? html`<span>${moon.phaseName} ${Math.round(moon.fraction * 100)}%</span>`
              : nothing}
          </div>
          ${overlays.map(
            (o) => html`
              <div class="stats-row entry-row">
                <span class="swatch entry" style="background: ${o.color}"></span>
                <span class="entry-name">${o.d.entry_title}</span>
                <span>∠${formatDegrees(o.sun.gamma)}</span>
                <span>W ${formatDegrees(normalizeAzimuth(o.sun.window_azimuth))}</span>
                ${o.sun.in_fov ? html`<span class="status in-fov">✓</span>` : nothing}
              </div>
            `,
          )}
        </div>
      `;
    }
    return html`<div class="stats dim">
      <span>${t('compass.stat_azi', this.hass)}${formatDegrees(sunAzi)}</span>
      <span>${t('compass.stat_elev', this.hass)}${formatDegrees(sunElev)}</span>
      <span>∠: ${formatDegrees(first.sun.gamma)}</span>
      <span
        >${t('compass.stat_window', this.hass)}${formatDegrees(
          normalizeAzimuth(first.sun.window_azimuth),
        )}</span
      >
      ${this.showMoon && moon
        ? html`<span>${moon.phaseName} ${Math.round(moon.fraction * 100)}%</span>`
        : nothing}
    </div>`;
  }

  public static styles = css`
    :host {
      display: block;
      width: 100%;
      container-type: inline-size;
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
    @container (min-width: 320px) {
      .compass {
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 16px;
      }
      .compass svg {
        max-width: none;
        flex: 1 1 0;
        min-width: 200px;
      }
      :host([compact]) .compass svg {
        max-width: 280px;
      }
      .compass .legend,
      .compass .stats {
        flex: 0 1 auto;
        min-width: 0;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
      }
      .compass .stats-row {
        justify-content: flex-start;
      }
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
    /* Static FOV envelope shown dim beneath the active sun arc — lets the
       reader see the configured ±fov_left/right span at the same time as
       today's reachable sub-arc. */
    .fov.fov-static {
      fill-opacity: 0.07;
      stroke-opacity: 0.25;
      stroke-dasharray: 4 3;
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
      fill: none;
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
    .sun.up {
      fill: #ffe680;
    }
    .sun.valid {
      fill: var(--warning-color, gold);
      filter: drop-shadow(0 0 4px var(--warning-color, gold));
    }
    .legend {
      display: flex;
      gap: 12px;
      font-size: 0.75rem;
      color: var(--secondary-text-color);
      flex-wrap: wrap;
      justify-content: center;
    }
    button.entry-toggle {
      background: none;
      border: 0;
      padding: 0;
      color: inherit;
      font: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    button.entry-toggle.hidden {
      opacity: 0.45;
      text-decoration: line-through;
    }
    .legend .status {
      margin-left: 4px;
      opacity: 0.8;
    }
    .legend .status.valid {
      color: var(--warning-color, gold);
    }
    .legend .status.in-fov {
      color: var(--state-active-color, orange);
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
      background: var(--warning-color, gold);
      opacity: 0.4;
      border-radius: 2px;
    }
    .swatch.entry {
      border-radius: 2px;
      opacity: 0.9;
    }
    .dot.sun {
      background: var(--secondary-text-color);
    }
    .dot.sun.valid {
      background: var(--warning-color, gold);
    }
    .dot.sun.up {
      background: #ffe680;
    }
    .swatch.cover-fill-swatch {
      background: var(--primary-color);
      opacity: 0.35;
      border-radius: 2px;
    }
    .swatch.window-swatch {
      background: var(--primary-color);
      border-radius: 2px;
    }
    .swatch.sun-path-swatch {
      background: var(--warning-color, gold);
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
      flex-direction: column;
      gap: 4px;
      font-size: 0.78rem;
      align-items: center;
    }
    .stats-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .entry-row .entry-name {
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .entry-row .status.in-fov {
      color: var(--state-active-color, orange);
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
    g[data-tooltip] {
      cursor: help;
    }
  `;
}
