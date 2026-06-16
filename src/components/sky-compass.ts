import { LitElement, html, css, svg, nothing, type TemplateResult, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { entityStateChanged } from '../lib/hass-change';

import type { DiscoveredEntities, SunPositionAttributes } from '../types';
import {
  arcsOverlap,
  arrowheadPath,
  azimuthToCartesian,
  blindSpotBearings,
  clampActiveArcToFov,
  coverWedgeOuterRadius,
  elevationGatedFovBounds,
  fovBandRadii,
  fovRunBounds,
  moonPhaseShadowDx,
  normalizeAzimuth,
  sunDotPosition,
  wedgePath,
} from '../lib/geometry';
import { coverActualPosition, displayTarget } from '../lib/cover-position';
import {
  aboveHorizonSegments,
  findFovWindows,
  sampleDay,
  startOfDayInZone,
  getMoonData,
  type SunSample,
  type MoonData,
} from '../lib/sun-model';
import { formatDegrees } from '../lib/formatters';
import { sunDotState, SUN_DOT_CLASS, type SunDotState } from '../lib/sun-dot-state';
import { resolveCoverColor } from '../lib/palette';
import { MOON_IMAGE } from '../lib/moon-image';
import { t } from '../lib/i18n';
import { tooltip } from '../lib/tooltip';

// viewBox must have ~30 px of padding beyond OUTER_R so cardinal labels
// (positioned at OUTER_R + 6..14) don't clip when rendered with
// text-anchor="middle" (~7px half-width at 12px font).
const VIEWBOX = 280;
const OUTER_R = 110;

// Monotonic counter giving each compass instance a unique legend moon-mask id,
// so the legend's phase mask never collides with the plot's hardcoded
// `moon-phase-mask` or with another compass on the same page.
let LEGEND_MOON_MASK_SEQ = 0;

interface EntryOverlay {
  d: DiscoveredEntities;
  sun: SunPositionAttributes;
  sunAzi: number;
  sunInfront: boolean;
  dotState: SunDotState;
  coverPos: number | null;
  actualPos: number | null;
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

  // Instance-unique id for the legend moon-phase mask (see LEGEND_MOON_MASK_SEQ).
  private readonly _legendMoonMaskId = `acp-legend-moon-${LEGEND_MOON_MASK_SEQ++}`;

  // Skip re-render on hass ticks that touched none of the entities this compass reads.
  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.size > 1 || !changed.has('hass')) return true;
    const old = changed.get('hass') as HomeAssistant | undefined;
    return entityStateChanged(old, this.hass, this._relevantIds());
  }

  private _relevantIds(): Array<string | undefined> {
    const ids: Array<string | undefined> = [];
    for (const d of this.discovered_list) {
      const e = d.entities;
      ids.push(
        e.sun_sensor,
        e.target_position_sensor,
        e.manual_override_binary,
        e.sun_infront_binary,
        e.decision_trace_sensor,
        e.start_sensor,
        e.end_sensor,
      );
    }
    return ids;
  }

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

  private _sunInfrontFor(d: DiscoveredEntities): boolean {
    const id = d.entities.sun_infront_binary;
    if (!id) return false;
    return this.hass.states[id]?.state === 'on';
  }

  /** Authoritative-first 3-way sun-dot state for one entry. Reads the
   *  decision_trace sensor's `sun_state` (new) / `direct_sun_valid` plus the
   *  sun_position sensor's azimuth-only `in_fov` and feeds the shared helper. */
  private _sunDotStateFor(d: DiscoveredEntities, sun: SunPositionAttributes): SunDotState {
    const dt = d.entities.decision_trace_sensor
      ? (this.hass.states[d.entities.decision_trace_sensor]?.attributes as
          | { sun_state?: string; direct_sun_valid?: boolean }
          | undefined)
      : undefined;
    return sunDotState({
      belowHorizon: sun.elevation <= 0,
      sunState: dt?.sun_state ?? null,
      directSunValid: dt?.direct_sun_valid ?? false,
      inFov: sun.in_fov === true,
    });
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
      // During a manual override the Cover_Position sensor STATE returns the
      // held position, so the target wedge and actual ring would collapse onto
      // the same value. `displayTarget` draws the target wedge at the divergent
      // solar would-be target (raw_calculated_position) when present, keeping the
      // actual ring at the held/actual position (#132, shared with the bar #158).
      out.push({
        d,
        sun,
        sunAzi,
        sunInfront: this._sunInfrontFor(d),
        dotState: this._sunDotStateFor(d, sun),
        coverPos: displayTarget(this.hass, d),
        actualPos: coverActualPosition(this.hass, d),
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
    // Aggregate the per-overlay 3-way state, picking the most-active window
    // (hitting > in_fov_not_valid > outside_fov). 'night' is shared across
    // overlays (same sun) so it short-circuits via any overlay.
    const STATE_RANK: Record<SunDotState, number> = {
      night: -1,
      outside_fov: 0,
      in_fov_not_valid: 1,
      hitting: 2,
    };
    const aggregateState: SunDotState =
      sunElev <= 0
        ? 'night'
        : overlays.reduce<SunDotState>(
            (best, ov) => (STATE_RANK[ov.dotState] > STATE_RANK[best] ? ov.dotState : best),
            'outside_fov',
          );
    const sunDotClass = SUN_DOT_CLASS[aggregateState];

    const { latitude, longitude, time_zone } = this.hass.config as unknown as {
      latitude?: number;
      longitude?: number;
      time_zone?: string;
    };
    const samples =
      latitude !== undefined && longitude !== undefined
        ? sampleDay(latitude, longitude, startOfDayInZone(time_zone))
        : [];

    const moon =
      this.showMoon && latitude !== undefined && longitude !== undefined
        ? getMoonData(latitude, longitude)
        : null;
    const moonAboveHorizon = moon !== null && moon.elevation > 0;
    // Moon disc is 2/3 the sun marker's 18px diameter → 12px (radius 6).
    const MOON_R = 6;
    const moonShadowDx = moon ? moonPhaseShadowDx(moon.phase, MOON_R) : 0;
    const moonPt = moonAboveHorizon ? sunDotPosition(moon!.azimuth, moon!.elevation, o) : null;
    const moonX = moonPt ? moonPt.x * OUTER_R : 0;
    const moonY = moonPt ? moonPt.y * OUTER_R : 0;

    // Plot only the above-horizon track: daytime samples bow toward the centre
    // (higher elevation = smaller radius). Each contiguous above-horizon run is
    // its own polyline so the not-visible (below-horizon) portion is simply
    // omitted rather than clamped onto the rim.
    const sunPathRuns = this.showSunPath
      ? aboveHorizonSegments(samples).map((run) =>
          samples.slice(run.startIdx, run.endIdx + 1).map((s) => {
            const pt = sunDotPosition(s.azimuth, s.elevation, o);
            return { x: pt.x * OUTER_R, y: pt.y * OUTER_R, elev: s.elevation };
          }),
        )
      : [];
    // The arc colour encodes the sun's ELEVATION only: a grey→gold ramp, neutral
    // grey near the horizon warming to full gold at the zenith. (No time-of-day
    // hue fade.)
    const HORIZON_GREY = [122, 127, 135];
    const ZENITH_GOLD = [245, 197, 24];
    const elevColor = (elev: number): string => {
      // sqrt curve ramps to gold quickly at low elevations, then eases off near
      // the zenith — so the arc reads gold for most of the day, grey only when
      // the sun is right at the horizon.
      const tt = Math.sqrt(Math.max(0, Math.min(1, elev / 90)));
      const c = HORIZON_GREY.map((v, i) => Math.round(v + (ZENITH_GOLD[i] - v) * tt));
      return `rgb(${c[0]},${c[1]},${c[2]})`;
    };
    // One continuous polyline per above-horizon run so a single dash pattern
    // spans the whole arc evenly (per-segment dashing made the sample-dense
    // middle read as solid). The gold→grey fade moves to a per-run linear
    // gradient projected along the sunrise→sunset time axis (pts[0]→pts[last]).
    const sunPathGradients =
      this.showSunPath && this.showSunriseSunset
        ? sunPathRuns
            .filter((pts) => pts.length > 1)
            .map((pts, i) => {
              const a = pts[0];
              const b = pts[pts.length - 1];
              const ax = b.x - a.x;
              const ay = b.y - a.y;
              const len2 = ax * ax + ay * ay || 1;
              // Stops sample the run's elevation, each positioned by projecting
              // its point onto the gradient axis, so the spine brightens toward
              // the noon high point and dims at both horizon ends.
              const stops = pts
                .filter((_, k) => k % 6 === 0 || k === pts.length - 1)
                .map((p) => ({
                  offset:
                    Math.max(0, Math.min(1, ((p.x - a.x) * ax + (p.y - a.y) * ay) / len2)) * 100,
                  color: elevColor(p.elev),
                }));
              return { id: `sun-path-grad-${i}`, x1: a.x, y1: a.y, x2: b.x, y2: b.y, stops };
            })
        : [];
    const sunPathStroke = (i: number): string =>
      this.showSunriseSunset ? `url(#sun-path-grad-${i})` : 'var(--warning-color, gold)';

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
              ${sunPathGradients.map(
                (g) => svg`
                <linearGradient id=${g.id} gradientUnits="userSpaceOnUse"
                  x1=${g.x1} y1=${g.y1} x2=${g.x2} y2=${g.y2}>
                  ${g.stops.map(
                    (s) => svg`<stop offset="${s.offset}%" stop-color=${s.color}></stop>`,
                  )}
                </linearGradient>
              `,
              )}
            </defs>

            <circle class="grid" r=${OUTER_R}></circle>
            <circle class="grid" r=${(OUTER_R * 2) / 3}></circle>
            <circle class="grid" r=${OUTER_R / 3}></circle>
            <line class="grid thin" x1=${gridNS0.x} y1=${gridNS0.y} x2=${gridNS1.x} y2=${gridNS1.y}></line>
            <line class="grid thin" x1=${gridEW0.x} y1=${gridEW0.y} x2=${gridEW1.x} y2=${gridEW1.y}></line>

            ${visibleOverlays.map((ov) => this._renderEntryLayers(ov, multi, o, samples))}

            ${
              this.showSunPath && sunPathRuns.length
                ? svg`<g ${tooltip(ttSunPath)}>${sunPathRuns
                    .filter((pts) => pts.length > 1)
                    .flatMap((pts, i) => {
                      const ptsStr = pts.map((p) => `${p.x},${p.y}`).join(' ');
                      // Thin spine carries the gold→grey gradient (and the
                      // single-colour fallback) under the directional chevrons.
                      const spine = svg`<polyline class="sun-path-line" points=${ptsStr}
                        style="stroke:${sunPathStroke(i)}"></polyline>`;
                      // Block-arrow chevrons every few samples, each rotated to
                      // the local direction of travel (sunrise→sunset sample
                      // order) and tinted by its position so the fade carries
                      // onto the arrows too.
                      const chevrons = [];
                      const step = 10;
                      for (let j = 0; j < pts.length; j += step) {
                        const p = pts[j];
                        const a = pts[Math.max(0, j - 1)];
                        const b = pts[Math.min(pts.length - 1, j + 1)];
                        const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
                        const fill = this.showSunriseSunset
                          ? elevColor(p.elev)
                          : 'var(--warning-color, gold)';
                        chevrons.push(svg`<path class="sun-path-chevron"
                          transform=${`translate(${p.x} ${p.y}) rotate(${ang})`}
                          d="M -2.4 -3 L 1.8 0 L -2.4 3 L -0.7 0 Z"
                          style=${`fill:${fill}`}></path>`);
                      }
                      return [spine, ...chevrons];
                    })}</g>`
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
              <g ${tooltip(ttMoon)}>
                <circle class="moon-outline" cx=${moonX} cy=${moonY} r=${MOON_R}></circle>
                <image
                  class="moon-img"
                  href=${MOON_IMAGE}
                  x=${moonX - MOON_R}
                  y=${moonY - MOON_R}
                  width=${MOON_R * 2}
                  height=${MOON_R * 2}
                  mask="url(#moon-phase-mask)"
                ></image>
              </g>
            `
                : nothing
            }

            <g ${tooltip(ttSun)}>
              <circle class=${sunDotClass} cx=${sunPt.x * OUTER_R} cy=${sunPt.y * OUTER_R} r="7"></circle>
            </g>
          `}
        </svg>
        ${this.showLegend ? this._renderLegend(overlays, multi, sunDotClass, moon) : nothing}
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
    const coverOuter =
      o.coverPos !== null
        ? coverWedgeOuterRadius(o.coverPos, o.coverType, OUTER_R, fovOuterR)
        : null;
    const actualOuter =
      o.actualPos !== null
        ? coverWedgeOuterRadius(o.actualPos, o.coverType, OUTER_R, fovOuterR)
        : null;
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
    const actualPath =
      actualOuter !== null && actualOuter > fovInnerR
        ? wedgePath(wedgeStart, wedgeEnd, actualOuter, fovInnerR, northOffsetDeg)
        : '';

    // Other FOV crossings for today. A window facing toward the pole catches the
    // sun on both sides of the window normal, so the day has more than one
    // disjoint "sun in FOV" run. The integration's start/end sensors describe
    // only the active/primary arc; derive the rest from the sampled sun path and
    // draw a wedge per run that doesn't overlap the primary wedge.
    const extraWedges: Array<{
      fov: string;
      cover: string;
      actual: string;
      from: number;
      to: number;
    }> = [];
    for (const run of findFovWindows(samples, windowAzi, o.sun.fov_left, o.sun.fov_right)) {
      const b = fovRunBounds(samples, run.startIdx, run.endIdx, o.sun.min_elevation);
      if (!b || arcsOverlap(b.wedgeStart, b.wedgeEnd, wedgeStart, wedgeEnd)) continue;
      extraWedges.push({
        fov: wedgePath(b.wedgeStart, b.wedgeEnd, fovOuterR, fovInnerR, northOffsetDeg),
        cover:
          this.showCoverFill && coverOuter !== null && coverOuter > fovInnerR
            ? wedgePath(b.wedgeStart, b.wedgeEnd, coverOuter, fovInnerR, northOffsetDeg)
            : '',
        actual:
          this.showCoverFill && actualOuter !== null && actualOuter > fovInnerR
            ? wedgePath(b.wedgeStart, b.wedgeEnd, actualOuter, fovInnerR, northOffsetDeg)
            : '',
        from: b.wedgeStart,
        to: b.wedgeEnd,
      });
    }

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
    // Two-line cover tooltip: a target line (awnings phrase it as "extended")
    // plus an actual line appended only when a live aggregate exists (#132).
    const ttCoverLines: string[] = [];
    if (o.coverPos !== null) {
      const targetKey =
        o.coverType === 'cover_awning'
          ? 'compass.cover_position_target_awning'
          : 'compass.cover_position_target';
      ttCoverLines.push(`${label}${t(targetKey, this.hass, { pct: o.coverPos })}`);
      if (o.actualPos !== null) {
        ttCoverLines.push(
          t('compass.cover_position_actual', this.hass, { pct: Math.round(o.actualPos) }),
        );
      }
    }
    const ttCoverFill = ttCoverLines.join('\n');
    const ttBlindSpot = bsBearings
      ? `${label}${t('compass.blind_spot', this.hass, {
          from: formatDegrees(bsBearings[0]),
          to: formatDegrees(bsBearings[1]),
        })}`
      : '';

    // In multi-entry mode the entry color is an *identity* — the whole wedge
    // group (FOV, cover, blind, window) shares it so entries are distinguishable.
    // In single-entry mode a cover-color override recolors the whole group too
    // (FOV/cover/blind/window take the chosen shade), so the main card matches
    // the standalone card. With no override the group keeps its themed colors.
    const groupColor = multi || o.isOverride;
    const coverColor = multi || o.isOverride;
    const fovStyle = groupColor ? `fill: ${o.color}; stroke: ${o.color};` : '';
    const coverStyle = coverColor ? `fill: ${o.color}; stroke: ${o.color};` : '';
    const blindStyle = groupColor ? `fill: ${o.color}; stroke: ${o.color};` : '';
    const arrowStyle = groupColor ? `stroke: ${o.color};` : '';
    const arrowBaseStyle = groupColor ? `fill: ${o.color};` : '';

    const showCover = this.showCoverFill && coverPath !== '';
    const showBlind = this.showBlindSpot && !!blindSpot;
    const showArrow = this.showWindowArrow;
    const arrowPath = `M 0 0 L ${windowArrow.x} ${windowArrow.y}`;
    // Arrowhead at the rim end of the window line, pointing along the window
    // bearing (so it reads as a vector — issue #157 point 4). It shares the
    // line's arrowStyle so an override recolours head and shaft together; the
    // line uses stroke and the head uses fill, so the inline style carries both.
    const arrowHeadStyle = groupColor ? `fill: ${o.color}; stroke: ${o.color};` : '';
    const arrowHeadPath = arrowheadPath(
      windowArrow.x,
      windowArrow.y,
      windowAzi + northOffsetDeg,
      9,
      5,
    );
    const hideStyle = 'display: none;';

    const ttFovStatic = `${label}${t('compass.fov_arc', this.hass, {
      left: formatDegrees(o.sun.fov_left),
      right: formatDegrees(o.sun.fov_right),
      elev: elevSuffix,
    })}`;
    return svg`<g class="entry-overlay">
      ${
        showStaticUnderlay
          ? svg`<g ${tooltip(ttFovStatic)}>
              <path class="fov fov-static" style=${fovStyle} d=${fovStaticPath}></path>
            </g>`
          : nothing
      }
      <g ${tooltip(ttFov)}>
        <path class="fov" style=${fovStyle} d=${fovPath}></path>
      </g>
      ${extraWedges.map((w) => {
        const ttExtra = `${label}${t('compass.active_sun_arc', this.hass, {
          from: formatDegrees(w.from),
          to: formatDegrees(w.to),
          elev: elevSuffix,
        })}`;
        return svg`<g ${tooltip(ttExtra)}>
          <path class="fov-extra" style=${fovStyle} d=${w.fov}></path>
          ${w.cover ? svg`<path class="cover-fill-extra" style=${coverStyle} d=${w.cover}></path>` : nothing}
          ${w.actual ? svg`<path class="cover-actual-extra" style=${coverStyle} d=${w.actual}></path>` : nothing}
        </g>`;
      })}
      <g class="arrow-group" style=${showArrow ? '' : hideStyle} ${tooltip(ttWindow)}>
        <path class="window" style=${arrowStyle} d=${arrowPath}></path>
        <path class="window-head" style=${arrowHeadStyle} d=${arrowHeadPath}></path>
        <circle class="window-base" style=${arrowBaseStyle} cx="0" cy="0" r="4"></circle>
      </g>
      <g class="cover-group" style=${showCover ? '' : hideStyle} ${tooltip(ttCoverFill)}>
        <path class="cover-fill" style=${coverStyle} d=${coverPath}></path>
        ${
          this.showCoverFill && actualPath
            ? svg`<path class="cover-actual" style=${coverStyle} d=${actualPath}></path>`
            : nothing
        }
      </g>
      <g class="blind-group" style=${showBlind ? '' : hideStyle} ${tooltip(ttBlindSpot)}>
        <path class="blind-spot" style=${blindStyle} d=${blindSpot ?? ''}></path>
      </g>
    </g>`;
  }

  /** Inline sun glyph: a small SVG circle carrying the EXACT live plot class
   *  string (`sun valid` | `sun in-fov` | `sun up` | `sun night`) so it inherits
   *  the plot CSS — glow only on `.sun.valid`. ViewBox is padded for the ~4px
   *  glow blur. Sized larger than the moon glyph. */
  private _legendSunGlyph(sunDotClass: string): TemplateResult {
    // Rendered at 20px: the r=5 disc in the glow-padded 16-unit viewBox comes out
    // ~12.5px across — visibly larger than the moon glyph (~9px), per the design's
    // "sun larger than moon" intent (the glow padding otherwise shrinks the disc).
    return html`<span class="glyph"
      ><svg viewBox="-8 -8 16 16" width="20" height="20">
        ${svg`<circle class=${sunDotClass} cx="0" cy="0" r="5"></circle>`}
      </svg></span
    >`;
  }

  /** Inline moon glyph: the photographic disc clipped by a legend-scoped phase
   *  mask mirroring the plot mask (instance-unique id to avoid collisions).
   *  Sized smaller than the sun glyph. */
  private _legendMoonGlyph(moon: MoonData | null): TemplateResult {
    const r = 4;
    const shadowDx = moon ? moonPhaseShadowDx(moon.phase, r) : 0;
    const maskId = this._legendMoonMaskId;
    return html`<span class="glyph"
      ><svg viewBox="-5 -5 10 10" width="11" height="11">
        ${svg`
          <defs>
            <mask id=${maskId}>
              <circle cx="0" cy="0" r=${r} fill="white"></circle>
              <circle cx=${shadowDx} cy="0" r=${r} fill="black"></circle>
            </mask>
          </defs>
          <circle class="moon-outline" cx="0" cy="0" r=${r}></circle>
          <image
            class="moon-img"
            href=${MOON_IMAGE}
            x=${-r}
            y=${-r}
            width=${r * 2}
            height=${r * 2}
            mask=${`url(#${maskId})`}
          ></image>
        `}
      </svg></span
    >`;
  }

  /** Inline window-azimuth glyph: a short line + arrowhead (it is a vector).
   *  Carries the override color inline when the first overlay is an override,
   *  matching the plotted window line. */
  private _legendWindowGlyph(overrideColor: string | null): TemplateResult {
    const style = overrideColor ? `stroke: ${overrideColor};` : '';
    const headStyle = overrideColor ? `fill: ${overrideColor};` : '';
    // Horizontal arrow pointing right (bearing 90 in compass terms): tip at +5,
    // arrowhead 4 long / 4 wide (base at x=1). The shaft stops just inside the
    // base (x=1.5) so the thick round line cap never pokes past the head tip.
    const head = arrowheadPath(5, 0, 90, 4, 2);
    return html`<span class="glyph"
      ><svg class="window-glyph" viewBox="-6 -6 12 12" width="13" height="13">
        ${svg`
          <line class="window" style=${style} x1="-5" y1="0" x2="1.5" y2="0"></line>
          <path class="window-head" style=${headStyle} d=${head}></path>
        `}
      </svg></span
    >`;
  }

  private _renderLegend(
    overlays: EntryOverlay[],
    multi: boolean,
    sunDotClass: string,
    moon: MoonData | null,
  ): TemplateResult {
    const overrideColor = overlays[0]?.isOverride ? (overlays[0].color ?? null) : null;
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
                <span class="licell"
                  ><span class="swatch entry" style="background: ${o.color}"></span
                ></span>
                ${o.d.entry_title}
                ${o.sunInfront
                  ? html`<span class="status valid">${t('compass.in_fov_check', this.hass)}</span>`
                  : o.sun.in_fov
                    ? html`<span class="status in-fov">${t('compass.in_fov', this.hass)}</span>`
                    : html`<span class="status">${t('compass.none', this.hass)}</span>`}
              </button>
            `,
          )}
          <div>${this._legendSunGlyph(sunDotClass)} ${t('compass.sun', this.hass)}</div>
          ${this.showMoon
            ? html`<div>${this._legendMoonGlyph(moon)} ${t('compass.moon', this.hass)}</div>`
            : nothing}
        </div>
      `;
    }
    return html`<div class="legend">
      <div>${this._legendSunGlyph(sunDotClass)} ${t('compass.sun', this.hass)}</div>
      ${this.showMoon
        ? html`<div>${this._legendMoonGlyph(moon)} ${t('compass.moon', this.hass)}</div>`
        : nothing}
      <div>
        <span class="licell"
          ><span
            class="swatch fov"
            style=${overrideColor ? `background: ${overrideColor}` : ''}
          ></span
        ></span>
        ${t('compass.window_fov', this.hass)}
      </div>
      ${this.showCoverFill
        ? html`<div>
            <span class="licell"
              ><span
                class="swatch cover-fill-swatch"
                style=${overrideColor ? `background: ${overrideColor}` : ''}
              ></span
            ></span>
            ${t('compass.cover_position', this.hass)}
          </div>`
        : nothing}
      ${this.showWindowArrow
        ? html`<div>
            ${this._legendWindowGlyph(overrideColor)} ${t('compass.window_normal', this.hass)}
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
                ${o.sun.in_fov
                  ? html`<span
                      class="status in-fov"
                      ${tooltip(t('compass.in_fov_tooltip', this.hass))}
                      >✓</span
                    >`
                  : nothing}
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
    /* Plot SVG only — scoped to the direct child of .compass so these sizing
       rules never cascade onto the small inline legend glyph SVGs (which size
       themselves via their width/height attributes). */
    .compass > svg {
      width: 100%;
      max-width: 260px;
      height: auto;
      display: block;
    }
    :host([compact]) .compass > svg {
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
      .compass > svg {
        max-width: none;
        flex: 1 1 0;
        min-width: 200px;
      }
      :host([compact]) .compass > svg {
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
      /* Match the stats column's row rhythm to the legend's so the two side-by-
         side columns share the same vertical spacing: same row gap as .legend
         (12px) and the same per-row height as the legend's 20px icon cell, with
         the stat text vertically centred in that height. */
      .compass .stats {
        gap: 12px;
      }
      .compass .stats-row,
      .compass .stats > span {
        justify-content: flex-start;
        min-height: 20px;
        display: flex;
        align-items: center;
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
    .fov,
    .fov-extra {
      /* Default (single-entry, no override): a lighter, more-transparent shade
         of the cover colour — same identity as the cover wedge, just fainter —
         matching how multi-entry/override mode already colours the FOV. Keeping
         it off gold lets the gold sun dot read clearly against it. */
      fill: var(--primary-color);
      fill-opacity: 0.22;
      stroke: var(--primary-color);
      stroke-width: 1;
      stroke-opacity: 0.7;
      transition:
        fill 0.3s ease,
        fill-opacity 0.3s ease,
        stroke 0.3s ease,
        stroke-opacity 0.3s ease;
    }
    /* Static FOV envelope shown dim beneath the active sun arc — lets the
       reader see the configured ±fov_left/right span at the same time as
       today's reachable sub-arc. */
    .fov.fov-static {
      fill-opacity: 0.07;
      stroke-opacity: 0.25;
      stroke-dasharray: 4 3;
    }
    .cover-fill,
    .cover-fill-extra {
      fill: var(--primary-color);
      fill-opacity: 0.3;
      stroke: var(--primary-color);
      stroke-width: 1;
      stroke-opacity: 0.6;
      transition:
        fill 0.3s ease,
        fill-opacity 0.3s ease,
        stroke 0.3s ease,
        stroke-opacity 0.3s ease;
    }
    /* Live/actual cover position drawn over the solid target wedge: same fill
       colour but fainter and dashed, so when actual == target it disappears
       into the target wedge and only a divergence reads as a second ring. */
    .cover-actual,
    .cover-actual-extra {
      fill: var(--primary-color);
      fill-opacity: 0.15;
      stroke: var(--primary-color);
      stroke-width: 1;
      stroke-opacity: 0.6;
      stroke-dasharray: 3 2;
      transition:
        fill 0.3s ease,
        fill-opacity 0.3s ease,
        stroke 0.3s ease,
        stroke-opacity 0.3s ease;
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
      transition: fill 0.3s ease;
    }
    .sun.up {
      /* outside FOV, above horizon — light yellow */
      fill: #ffe680;
    }
    .sun.in-fov {
      /* in FOV but not hitting — plain gold (no glow) */
      fill: var(--warning-color, gold);
    }
    .sun.valid {
      fill: var(--warning-color, gold);
      filter: drop-shadow(0 0 4px var(--warning-color, gold));
    }
    .sun.night {
      /* below horizon — dim grey */
      fill: var(--secondary-text-color);
      opacity: 0.55;
    }
    .legend {
      display: flex;
      gap: 12px;
      font-size: 0.75rem;
      color: var(--secondary-text-color);
      flex-wrap: wrap;
      justify-content: center;
    }
    /* Centre each glyph/swatch row against its label so larger glyphs (the sun)
       stay vertically aligned — vertical-align:middle drifts as the glyph grows.
       The cover-entry rows are buttons that already do this; these are the
       plain sun/moon/window/FOV rows. The glyph/swatch margin-right keeps the
       gap between icon and text. */
    .legend > div {
      display: flex;
      align-items: center;
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
    /* Uniform fixed-width icon cell shared by every legend row's leading icon —
       glyph wrappers (.glyph: live sun, phased moon, window arrow) and swatch
       wrappers (.licell). Centring each icon in a constant-width cell keeps all
       labels left-aligned in a column even though the glyphs differ in size
       (the sun is intentionally the largest). The cell is a fixed flex item of
       the flex legend rows; overflow stays visible so the sun's glow isn't
       clipped. */
    .glyph,
    .licell {
      flex: 0 0 20px;
      height: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-right: 6px;
    }
    .glyph svg {
      /* Size comes from each glyph's own width/height attributes; display:block
         inside the inline-block wrapper avoids inline-descender spacing. The
         explicit min/max-width reset guards against any ancestor svg rule. */
      display: block;
      overflow: visible;
      min-width: 0;
      max-width: none;
    }
    /* The legend arrow reuses the plot's .window stroke colour but the plot's
       stroke-width: 3 is far too heavy for the 12-unit glyph viewBox — scope a
       proportional shaft width here so it reads as a slim arrow, not a blob. */
    .window-glyph .window {
      stroke-width: 1.6;
    }
    /* Arrowhead on the legend window-azimuth glyph (and matched on the plotted
       window line); follows the override colour via inline style when set. */
    .window-head {
      fill: var(--primary-color);
    }
    .swatch.cover-fill-swatch {
      background: var(--primary-color);
      /* The cover wedge is drawn ON TOP of the FOV wedge in the same arc, so the
         visible cover region is the two fills composited: the FOV's 0.22 plus the
         cover's 0.30 → 1 − (1−0.22)(1−0.30) ≈ 0.45. Matching that here keeps the
         legend swatch the same darker shade the reader sees in the plot. */
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
    /* The sun path is a thin spine + directional block-arrow chevrons per
       above-horizon run. The spine carries the per-run gradient (sunrise gold →
       sunset grey, see sunPathGradients in render) and sits faint beneath the
       chevrons, which point in the direction of the sun's travel. */
    .sun-path-line {
      fill: none;
      stroke-width: 1;
      stroke-linecap: round;
      opacity: 0.45;
    }
    .sun-path-chevron {
      stroke: none;
      opacity: 0.95;
    }
    .moon-outline {
      fill: none;
      stroke: var(--secondary-text-color);
      stroke-width: 0.8;
      opacity: 0.5;
    }
    /* Photographic moon disc, clipped to the lit fraction by moon-phase-mask. */
    .moon-img {
      opacity: 0.95;
    }
    /* Floating-tooltip cursor lifecycle: a help cursor hints "there's more
       here" on hover (SVG groups + the in-FOV status pip), flipping to default
       the moment OUR bubble appears. */
    [data-tooltip]:hover {
      cursor: help;
    }
    [data-tooltip][acp-tt-shown] {
      cursor: default;
    }
  `;
}
