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
 *
 * For venetian entries, solar-handler samples also carry a synthetic `tilt`
 * value (0-100%) exercising the card's generic secondary-axis forecast
 * track. This is a *visualization* mock — not an attempt to reproduce the
 * integration's real slat geometry — so `tilt` is just a simple monotonic
 * function of elevation (higher sun → slats closer, lower `tilt`%), enough to
 * visibly vary across the solar window. It's omitted entirely on non-solar
 * samples so the harness naturally exercises the card's gap-segmentation.
 *
 * DAY/NIGHT SHADES CARRY THE SAME KEY ON PURPOSE, and it is not a mistake in
 * the mock. A live `cover_day_night_shade` publishes `tilt` on its solar
 * forecast samples while its own discovery marks the tilt axis
 * `supported: false` — the shade has no slats to angle. The forecast strip
 * must therefore decide what to draw from discovery, not from which keys the
 * samples happen to carry; before it did, this entry drew a phantom tilt
 * track. Removing this key from the mock would hide the regression rather
 * than fix it.
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
      events.push({ t: s.t.toISOString(), kind: 'fov_enter', label: 'Sun enters SAA' });
    if (aboveHorizon && !inFov && prevInFov)
      events.push({ t: s.t.toISOString(), kind: 'fov_exit', label: 'Sun exits SAA' });

    prevAboveHorizon = aboveHorizon;
    prevInFov = inFov;

    const { winner, position } = decide({
      entry,
      sunAzimuth: s.azimuth,
      sunElevation: s.elevation,
      nowMs: s.t.getTime(),
    });
    const emitsTilt =
      entry.cover_type === 'cover_venetian' || entry.cover_type === 'cover_day_night_shade';
    const tilt =
      emitsTilt && winner === 'solar'
        ? Math.round(Math.max(0, Math.min(100, 90 - Math.max(0, s.elevation))))
        : undefined;
    forecast.push({
      t: s.t.toISOString(),
      position: Math.round(position),
      handler: winner === 'solar' ? 'solar' : winner === 'default' ? 'default' : winner,
      ...(tilt !== undefined ? { tilt } : {}),
    });
  }
  return { forecast, events };
}
