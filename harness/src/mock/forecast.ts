import { azimuthInFov, type SunSample } from '../../../src/lib/sun-model';
import type { ForecastEvent, ForecastSample } from '../../../src/types';
import { decide } from './decider';
import type { HarnessEntry } from '../types';

interface SyntheticForecast {
  forecast: ForecastSample[];
  events: ForecastEvent[];
}

/**
 * Run the mock decider over each sun sample to build a realistic forecast +
 * boundary events (sunrise / sunset / fov_enter / fov_exit). The result mirrors
 * `position_forecast_sensor` attributes that the real integration emits.
 */
export function buildForecast(entry: HarnessEntry, samples: SunSample[]): SyntheticForecast {
  const forecast: ForecastSample[] = [];
  const events: ForecastEvent[] = [];
  let prevAboveHorizon = false;
  let prevInFov = false;

  for (const s of samples) {
    const aboveHorizon = s.elevation > 0;
    const inFov = azimuthInFov(s.azimuth, entry.window_azimuth, entry.fov_left, entry.fov_right);

    if (aboveHorizon && !prevAboveHorizon)
      events.push({ t: s.t.toISOString(), kind: 'sunrise', label: 'Sunrise' });
    if (!aboveHorizon && prevAboveHorizon)
      events.push({ t: s.t.toISOString(), kind: 'sunset', label: 'Sunset' });
    if (aboveHorizon && inFov && !prevInFov)
      events.push({ t: s.t.toISOString(), kind: 'fov_enter', label: 'Sun enters FOV' });
    if (aboveHorizon && !inFov && prevInFov)
      events.push({ t: s.t.toISOString(), kind: 'fov_exit', label: 'Sun exits FOV' });

    prevAboveHorizon = aboveHorizon;
    prevInFov = inFov;

    const { winner, position } = decide({
      entry,
      sunAzimuth: s.azimuth,
      sunElevation: s.elevation,
      nowMs: s.t.getTime(),
    });
    forecast.push({
      t: s.t.toISOString(),
      position: Math.round(position),
      handler: winner === 'solar' ? 'solar' : winner === 'default' ? 'default' : winner,
    });
  }
  return { forecast, events };
}
