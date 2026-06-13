import { LitElement, html, css, svg, nothing, type TemplateResult, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { entityStateChanged } from '../lib/hass-change';

import type { ControlStatusAttributes, DiscoveredEntities, SunPositionAttributes } from '../types';
import { findFovWindows, sampleDay, startOfDayInZone, type SunSample } from '../lib/sun-model';
import { elevationBandFraction, ribbonLayout, scheduleZones } from '../lib/geometry';
import { sunDotState, SUN_DOT_CLASS } from '../lib/sun-dot-state';
import { resolveCoverColor } from '../lib/palette';
import { formatClock } from '../lib/formatters';
import { t } from '../lib/i18n';

const VIEWBOX_W = 400;
const VIEWBOX_H = 160;
const PAD_L = 32;
const PAD_R = 8;
const PAD_T = 10;
const PAD_B = 22;

// Per-window FOV ribbon (multi-window only), overlaid inside the plot grid as a
// band anchored just above the time axis (reclaims the old below-plot strip).
const RIBBON_ROW_H = 8;
const RIBBON_GAP = 3;
const RIBBON_BOTTOM_INSET = 3;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Parse a schedule bound (tz-aware ISO or null/missing) to a Date, or null. */
function parseScheduleBound(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

@customElement('acp-elevation-chart')
export class ElevationChart extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discoveredList: DiscoveredEntities[] = [];
  @property({ attribute: false }) public coverColors: (string | null | undefined)[] = [];
  @property({ type: Boolean, reflect: true }) public compact = false;

  // Skip re-render on hass ticks that touched none of the entities this chart reads.
  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.size > 1 || !changed.has('hass')) return true;
    const old = changed.get('hass') as HomeAssistant | undefined;
    const ids: Array<string | undefined> = [];
    for (const d of this.discoveredList) {
      const e = d.entities;
      ids.push(e.sun_sensor, e.decision_trace_sensor, e.control_status_sensor);
    }
    return entityStateChanged(old, this.hass, ids);
  }

  private _sunAttrsFor(d: DiscoveredEntities): SunPositionAttributes | null {
    const id = d.entities.sun_sensor;
    if (!id) return null;
    const st = this.hass.states[id];
    if (!st) return null;
    return st.attributes as unknown as SunPositionAttributes;
  }

  /** Decision-trace inputs for the shared 3-way sun-dot classifier. Reads the
   *  first entry's decision_trace sensor (`sun_state` / `direct_sun_valid`). */
  private _sunDotTraceInputs(): { sunState: string | null; directSunValid: boolean } {
    const id = this.discoveredList[0]?.entities.decision_trace_sensor;
    const attrs = id
      ? (this.hass.states[id]?.attributes as
          | { sun_state?: string; direct_sun_valid?: boolean }
          | undefined)
      : undefined;
    return {
      sunState: attrs?.sun_state ?? null,
      directSunValid: attrs?.direct_sun_valid ?? false,
    };
  }

  /** Schedule start/end bounds from the first entry's control_status sensor.
   *  Returns null when the sensor is absent (older integration). */
  private _scheduleBounds(): { start: Date | null; end: Date | null } | null {
    const id = this.discoveredList[0]?.entities.control_status_sensor;
    if (!id) return null;
    const attrs = this.hass.states[id]?.attributes as ControlStatusAttributes | undefined;
    if (!attrs) return null;
    return {
      start: parseScheduleBound(attrs.schedule_start),
      end: parseScheduleBound(attrs.schedule_end),
    };
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
    // Mirror the sky compass sun-dot 3-way colour states: dim amber below the
    // horizon, orange/gold while hitting, light-yellow in FOV but not hitting,
    // dim neutral outside FOV. Sourced from the authoritative decision_trace
    // (sun_state) with a fallback derivation for older integrations.
    const sunBelowHorizon = currentSample ? currentSample.elevation <= 0 : true;
    const traceInputs = this._sunDotTraceInputs();
    const sunDotCls = SUN_DOT_CLASS[
      sunDotState({
        belowHorizon: sunBelowHorizon,
        sunState: traceInputs.sunState,
        directSunValid: traceInputs.directSunValid,
        inFov: firstAttrs.in_fov === true,
      })
    ]
      // SUN_DOT_CLASS values are the compass classes ('sun valid' etc.); the
      // chart's circle uses the bare state suffix, so strip the 'sun ' prefix.
      .replace(/^sun /, '');

    const plotTop = PAD_T;
    const plotBottom = VIEWBOX_H - PAD_B;
    // Map a 0..1 elevation-axis fraction to a y coordinate (0 = bottom).
    const yForFrac = (frac: number): number => plotBottom - frac * (plotBottom - plotTop);

    const multi = this.discoveredList.length > 1;

    // Schedule window overlay (issue #128). Off-schedule gray zones + thin
    // start/end bars come from the integration's control_status sensor; absent
    // sensor or both-bounds-null renders nothing. Geometry lives in
    // scheduleZones (handles normal / midnight-spanning / open-ended / clamp).
    const bounds = this._scheduleBounds();
    const schedule = bounds
      ? scheduleZones(bounds.start, bounds.end, day.getTime(), DAY_MS)
      : { offSchedule: [], bars: [] };
    const fracToX = (frac: number): number => PAD_L + frac * (VIEWBOX_W - PAD_L - PAD_R);
    const scheduleZoneRects = schedule.offSchedule.map((z) => ({
      x: fracToX(z.x0),
      width: fracToX(z.x1) - fracToX(z.x0),
    }));
    // Each drawable bar gets its clock-time label. Match a bar fraction back to
    // the bound it came from (start vs end) for the right tooltip + tick.
    const startFrac =
      bounds?.start && day ? (bounds.start.getTime() - day.getTime()) / DAY_MS : null;
    const scheduleBars = schedule.bars.map((frac) => {
      const iso =
        startFrac !== null && Math.abs(frac - startFrac) < 1e-9
          ? bounds!.start!.toISOString()
          : bounds!.end!.toISOString();
      const isStart = startFrac !== null && Math.abs(frac - startFrac) < 1e-9;
      const xVal = fracToX(frac);
      // Anchor edge ticks inward so a near-right-edge schedule label (e.g.
      // 21:57) sits inside the viewBox instead of clipping past it (issue #146).
      const anchor: 'start' | 'middle' | 'end' =
        xVal >= VIEWBOX_W - PAD_R - 1 ? 'end' : xVal <= PAD_L + 1 ? 'start' : 'middle';
      return {
        x: xVal,
        anchor,
        label: formatClock(iso, time_zone),
        tooltip: isStart
          ? t('elevation.schedule_start_tooltip', this.hass)
          : t('elevation.schedule_end_tooltip', this.hass),
      };
    });
    // Head summary line: "Schedule 07:30 – 21:00" with open-ended variants.
    const scheduleSummary = ((): string | null => {
      if (!bounds) return null;
      const from = bounds.start ? formatClock(bounds.start.toISOString(), time_zone) : null;
      const to = bounds.end ? formatClock(bounds.end.toISOString(), time_zone) : null;
      if (from && to) return t('elevation.schedule', this.hass, { from, to });
      if (from) return t('elevation.schedule_from', this.hass, { from });
      if (to) return t('elevation.schedule_until', this.hass, { to });
      return null;
    })();

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
        range: `${formatClock(samples[w.startIdx].t.toISOString(), time_zone)} → ${formatClock(
          samples[w.endIdx].t.toISOString(),
          time_zone,
        )}`,
      }));
      const label = runs
        .map(
          (w) =>
            `${formatClock(samples[w.startIdx].t.toISOString(), time_zone)} → ${formatClock(
              samples[w.endIdx].t.toISOString(),
              time_zone,
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

    // Ribbon layout (multi-window only). Rows are now overlaid INSIDE the plot
    // grid as a band anchored to the bottom (just above the time axis), so the
    // viewBox stays a fixed 400x160 and no strip is appended below the chart.
    // ribbonLayout gives row offsets relative to the band top (no extra pads);
    // each row is offset by ribbonBandTop at render time.
    const ribbon = multi
      ? ribbonLayout(windows.length, 0, RIBBON_ROW_H, RIBBON_GAP, 0)
      : { rows: [], height: 0 };
    const ribbonBandTop = plotBottom - ribbon.height - RIBBON_BOTTOM_INSET;
    const totalH = VIEWBOX_H;
    const nowY2 = VIEWBOX_H - PAD_B;

    return html`
      <div class="wrap">
        <div class="head">
          <span class="label">${t('elevation.title', this.hass)}</span>
          <span class="head-meta">
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
            ${scheduleSummary
              ? html`<span class="dim schedule">${scheduleSummary}</span>`
              : nothing}
          </span>
        </div>
        <svg viewBox="0 0 ${VIEWBOX_W} ${totalH}" preserveAspectRatio="none">
          ${svg`
            <!-- y-axis gridlines -->
            ${[0, 30, 60, 90].map(
              (e) => svg`
              <line class="grid" x1=${PAD_L} y1=${yAt(e)} x2=${VIEWBOX_W - PAD_R} y2=${yAt(e)} />
              <text class="tick" x=${PAD_L - 4} y=${yAt(e) + 3} text-anchor="end">${e}°</text>
            `,
            )}

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

            <!-- Per-window FOV ribbon (multi-window only): one row per window,
                 a faint full-width track plus color-keyed bars for in-FOV runs,
                 sharing the plot's xAt() time scale. Overlaid as a band anchored
                 to the bottom of the plot; drawn BEFORE the curve so the blue
                 curve stays crisp on top. -->
            ${ribbon.rows.flatMap((row, i) => {
              const w = windows[i];
              const rowY = ribbonBandTop + row.y;
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

            <!-- Schedule window overlay (issue #128): faint off-schedule gray
                 zone(s) + thin start/end bars with a clock-time tick. Rendered
                 PRE-CURVE so the sun curve and now-line paint on top. The tick
                 label sits slightly higher than the axis ticks (its own class)
                 so it doesn't read as an axis tick. -->
            ${scheduleZoneRects.map(
              (z) => svg`<rect
                class="off-schedule-zone"
                x=${z.x}
                y=${PAD_T}
                width=${z.width}
                height=${VIEWBOX_H - PAD_B - PAD_T}
              />`,
            )}
            ${scheduleBars.flatMap((b) => [
              svg`<line
                class="schedule-bar"
                x1=${b.x}
                y1=${PAD_T}
                x2=${b.x}
                y2=${VIEWBOX_H - PAD_B}
              ><title>${b.tooltip}</title></line>`,
              svg`<text
                class="schedule-tick"
                x=${b.x}
                y=${PAD_T + 7}
                text-anchor=${b.anchor}
              >${b.label}</text>`,
            ])}

            <!-- elevation curve (drawn after the ribbon so it sits on top) -->
            <polyline class="curve" points=${curvePoints} />

            <!-- current-time cursor + sun dot, drawn last so they sit on top of
                 the curve AND the ribbon bars. A wide transparent hit-line widens
                 the hover target so the thin now-line is easy to tooltip. -->
            <g class="now-group">
              <title>${formatClock(now.toISOString(), time_zone)}</title>
              <line class="now-hit" x1=${nowX} y1=${PAD_T} x2=${nowX} y2=${nowY2} />
              <line class="now" x1=${nowX} y1=${PAD_T} x2=${nowX} y2=${nowY2} />
            </g>
            ${
              currentY !== null
                ? svg`<circle class="sun-dot ${sunDotCls}" cx=${nowX} cy=${currentY} r="4" />`
                : nothing
            }

            <!-- x-axis gridlines + time labels at every 6h, drawn last so the
                 axis sits on the topmost layer (nothing paints over the times).
                 Edge labels anchor inward (start at 00:00, end at 24:00) so they
                 don't clip past the viewBox. -->
            ${[0, 6, 12, 18, 24].map((h) => {
              const t = new Date(day.getTime() + h * 3600_000);
              const anchor = h === 0 ? 'start' : h === 24 ? 'end' : 'middle';
              return svg`
                <line class="grid faint" x1=${xAt(t)} y1=${PAD_T} x2=${xAt(t)} y2=${VIEWBOX_H - PAD_B} />
                <text class="tick" x=${xAt(t)} y=${VIEWBOX_H - PAD_B + 14} text-anchor=${anchor}>${h.toString().padStart(2, '0')}:00</text>
              `;
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
      width: 100%;
      min-width: 0;
    }
    .wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
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
    .head-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 1px;
      text-align: right;
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
      /* Lighter shade of the cover colour (not gold), so the gold sun-dot reads
         clearly against it. Matches the sky-compass .fov default. */
      fill: var(--primary-color);
      fill-opacity: 0.18;
    }
    .off-schedule-zone {
      fill: var(--divider-color);
      fill-opacity: 0.12;
      pointer-events: none;
    }
    .schedule-bar {
      stroke: var(--divider-color);
      stroke-width: 1;
      cursor: default;
    }
    .schedule-tick {
      font-size: 8px;
      fill: var(--secondary-text-color);
    }
    .ribbon-track {
      fill: var(--divider-color);
      fill-opacity: 0.25;
      cursor: default;
    }
    .ribbon-bar {
      /* Fallback only — the ribbon always sets an inline per-window fill. Kept on
         the cover colour for consistency with the FOV band. */
      fill: var(--primary-color);
      fill-opacity: 0.85;
      cursor: default;
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
      pointer-events: none;
    }
    .now-hit {
      stroke: transparent;
      stroke-width: 10;
      cursor: default;
    }
    /* Colour states mirror acp-sky-compass .sun.* so the sun reads the same
       across both visuals. */
    .sun-dot {
      fill: var(--secondary-text-color);
      transition: fill 0.3s ease;
    }
    .sun-dot.up {
      /* outside FOV, above horizon — light yellow */
      fill: #ffe680;
    }
    .sun-dot.in-fov {
      /* in FOV but not hitting — plain gold (no glow) */
      fill: var(--warning-color, gold);
    }
    .sun-dot.valid {
      fill: var(--warning-color, gold);
      filter: drop-shadow(0 0 3px var(--warning-color, gold));
    }
    .sun-dot.night {
      /* below horizon — dim grey */
      fill: var(--secondary-text-color);
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
