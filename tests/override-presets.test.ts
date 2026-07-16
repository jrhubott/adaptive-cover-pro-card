import { describe, it, expect } from 'vitest';
import { buildOverridePresets } from '../src/lib/override-presets';
import { nextSolarEvents } from '../src/lib/sun-model';
import type { ForecastEvent } from '../src/types';

// Amsterdam — the location whose rise/set the sun-model tests already pin.
const LAT = 52.37;
const LON = 4.9;
const NOW = Date.parse('2026-06-15T13:00:00Z');

function ev(kind: string, iso: string, label = kind): ForecastEvent {
  return { kind, t: iso, label };
}

describe('buildOverridePresets (#229)', () => {
  it('drops events at or before now', () => {
    const events = [
      ev('sunrise', '2026-06-15T03:18:00Z'), // past
      ev('fov_enter', '2026-06-15T13:00:00Z'), // exactly now → not future
      ev('fov_exit', '2026-06-15T15:30:00Z'), // future
      ev('sunset', '2026-06-15T19:58:00Z'), // future
    ];
    // No lat/lon: isolates the filter from the suncalc top-up, which would
    // otherwise legitimately re-add a *future* sunrise.
    const presets = buildOverridePresets({ events, nowMs: NOW });
    expect(presets.map((p) => p.kind)).toEqual(['fov_exit', 'sunset']);
    expect(presets.every((p) => Date.parse(p.t) > NOW)).toBe(true);
  });

  it('orders presets chronologically ascending', () => {
    const events = [
      ev('sunset', '2026-06-15T19:58:00Z'),
      ev('fov_exit', '2026-06-15T15:30:00Z'),
      ev('fov_enter', '2026-06-15T14:00:00Z'),
    ];
    const presets = buildOverridePresets({ events, nowMs: NOW, latitude: LAT, longitude: LON });
    const times = presets.map((p) => Date.parse(p.t));
    expect(times).toEqual([...times].sort((a, b) => a - b));
    expect(presets[0].kind).toBe('fov_enter');
  });

  it('caps at 3 by default, keeping the soonest', () => {
    const events = [
      ev('fov_enter', '2026-06-15T14:00:00Z'),
      ev('fov_exit', '2026-06-15T15:30:00Z'),
      ev('sunset', '2026-06-15T19:58:00Z'),
      ev('sunrise', '2026-06-16T03:18:00Z'),
    ];
    const presets = buildOverridePresets({ events, nowMs: NOW, latitude: LAT, longitude: LON });
    expect(presets).toHaveLength(3);
    expect(presets.map((p) => p.kind)).toEqual(['fov_enter', 'fov_exit', 'sunset']);
  });

  it('honours an explicit max', () => {
    const events = [
      ev('fov_enter', '2026-06-15T14:00:00Z'),
      ev('fov_exit', '2026-06-15T15:30:00Z'),
      ev('sunset', '2026-06-15T19:58:00Z'),
    ];
    const presets = buildOverridePresets({
      events,
      nowMs: NOW,
      latitude: LAT,
      longitude: LON,
      max: 2,
    });
    expect(presets).toHaveLength(2);
  });

  it('passes all four event kinds through with kind, label and t preserved', () => {
    const events = [
      ev('sunrise', '2026-06-16T03:18:00Z', 'Sunrise'),
      ev('sunset', '2026-06-15T19:58:00Z', 'Sunset'),
      ev('fov_enter', '2026-06-15T14:00:00Z', 'Sun enters window'),
      ev('fov_exit', '2026-06-15T15:30:00Z', 'Sun leaves window'),
    ];
    const presets = buildOverridePresets({
      events,
      nowMs: NOW,
      latitude: LAT,
      longitude: LON,
      max: 4,
    });
    expect(presets.map((p) => p.kind)).toEqual(['fov_enter', 'fov_exit', 'sunset', 'sunrise']);
    expect(presets.find((p) => p.kind === 'fov_exit')).toMatchObject({
      kind: 'fov_exit',
      label: 'Sun leaves window',
      t: '2026-06-15T15:30:00Z',
    });
  });

  it('tops up from suncalc when the sensor has no future events', () => {
    const events = [ev('sunrise', '2026-06-15T03:18:00Z')]; // all past
    const presets = buildOverridePresets({ events, nowMs: NOW, latitude: LAT, longitude: LON });
    const solar = nextSolarEvents(LAT, LON, NOW);
    expect(presets.length).toBeGreaterThanOrEqual(2);
    expect(presets.map((p) => p.kind)).toEqual(solar.map((e) => e.kind));
    expect(presets.map((p) => p.t)).toEqual(solar.map((e) => e.t));
  });

  it('tops a single future event up to two, deduping a same-kind suncalc entry at the same minute', () => {
    const solar = nextSolarEvents(LAT, LON, NOW);
    const first = solar[0]; // today's sunset
    // The sensor reports the same event, to the minute, with its own label.
    const sensorSame = ev(first.kind, first.t, 'Sensor sunset');
    const presets = buildOverridePresets({
      events: [sensorSame],
      nowMs: NOW,
      latitude: LAT,
      longitude: LON,
    });
    expect(presets.length).toBe(2);
    // The sensor's entry survives; the duplicate suncalc one is dropped.
    expect(presets.filter((p) => p.kind === first.kind)).toHaveLength(1);
    expect(presets.find((p) => p.kind === first.kind)!.label).toBe('Sensor sunset');
    // Topped up with the *other* solar event.
    expect(presets.map((p) => p.kind).sort()).toEqual(['sunrise', 'sunset']);
  });

  it('returns an empty list without throwing when there is no location and no future events', () => {
    expect(() =>
      buildOverridePresets({ events: [ev('sunrise', '2026-06-15T03:18:00Z')], nowMs: NOW }),
    ).not.toThrow();
    expect(
      buildOverridePresets({ events: [ev('sunrise', '2026-06-15T03:18:00Z')], nowMs: NOW }),
    ).toEqual([]);
  });

  it('ignores unparseable event timestamps', () => {
    const events = [ev('fov_exit', 'not-a-date'), ev('sunset', '2026-06-15T19:58:00Z')];
    const presets = buildOverridePresets({ events, nowMs: NOW, latitude: LAT, longitude: LON });
    expect(presets.every((p) => !Number.isNaN(Date.parse(p.t)))).toBe(true);
    expect(presets.some((p) => p.kind === 'fov_exit')).toBe(false);
  });
});
