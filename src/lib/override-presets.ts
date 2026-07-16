import { nextSolarEvents } from './sun-model';
import type { ForecastEvent } from '../types';

/**
 * One-tap preset for the extend-override dialog (#229): a meaningful future
 * moment the user can end the override at.
 *
 * Deliberately mirrors {@link ForecastEvent}'s shape — presets sourced from the
 * `position_forecast` sensor and presets computed locally from suncalc are the
 * same thing to the dialog. `label` is the sensor's raw prose; the dialog
 * resolves the display string from `forecast.event.${kind}` and only falls back
 * to `label`, so this module stays pure (no `hass`, no i18n).
 */
export interface OverridePreset {
  kind: ForecastEvent['kind'];
  /** ISO-8601 timestamp of the event. */
  t: string;
  label: string;
}

export interface BuildOverridePresetsOptions {
  /** `position_forecast.events` — the preferred source. */
  events: ForecastEvent[];
  nowMs: number;
  /** Home's location, used only to top up from suncalc. Omit and the top-up is
   *  skipped (an empty list is a fine outcome — the dialog still has its
   *  relative chips and absolute input). */
  latitude?: number;
  longitude?: number;
  max?: number;
}

const DEFAULT_MAX = 3;
/** Below this many sensor-sourced presets, top up from suncalc so the row never
 *  degenerates to a single chip late in the day. */
const TOP_UP_BELOW = 2;
const SAME_MINUTE_MS = 60_000;

/** True when two events name the same moment to the minute — the sensor and
 *  suncalc disagree by seconds on the same sunrise, and showing both would read
 *  as two distinct choices. */
function sameMinute(aIso: string, bIso: string): boolean {
  return (
    Math.floor(Date.parse(aIso) / SAME_MINUTE_MS) === Math.floor(Date.parse(bIso) / SAME_MINUTE_MS)
  );
}

/**
 * Future presets for the extend dialog, soonest first.
 *
 * Sensor events win: they carry the integration's own `fov_enter`/`fov_exit`,
 * which for a cover integration are more useful than raw sunrise/sunset. Suncalc
 * only fills the gap when the sensor has run dry (late in the day, or when the
 * forecast sensor is absent), and never duplicates a sensor event.
 */
export function buildOverridePresets(opts: BuildOverridePresetsOptions): OverridePreset[] {
  const { events, nowMs, latitude, longitude, max = DEFAULT_MAX } = opts;

  const future: OverridePreset[] = events
    .filter((e) => {
      const ms = Date.parse(e.t);
      return !Number.isNaN(ms) && ms > nowMs;
    })
    .map((e) => ({ kind: e.kind, t: e.t, label: e.label }));

  if (future.length < TOP_UP_BELOW && latitude != null && longitude != null) {
    for (const solar of nextSolarEvents(latitude, longitude, nowMs)) {
      const dup = future.some((p) => p.kind === solar.kind && sameMinute(p.t, solar.t));
      if (dup) continue;
      future.push({ kind: solar.kind, t: solar.t, label: solar.kind });
    }
  }

  return future.sort((a, b) => Date.parse(a.t) - Date.parse(b.t)).slice(0, max);
}
