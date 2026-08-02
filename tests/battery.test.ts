import { describe, it, expect } from 'vitest';
import {
  resolveCoverBatteries,
  lowestBattery,
  batteryIcon,
  isLowBattery,
  LOW_BATTERY_PCT,
  type CoverBattery,
} from '../src/lib/battery';
import type { HomeAssistant } from 'custom-card-helpers';

/** Minimal `hass` carrying only what `resolveCoverBatteries` reads: the states
 *  map and the display entity registry (`hass.entities`, which is where
 *  `device_id` lives — the full websocket registry is never consulted). */
function makeHass(opts: {
  states?: Record<string, { state: string; attributes?: Record<string, unknown> }>;
  entities?: Record<string, { device_id?: string | null }>;
}): HomeAssistant {
  return {
    states: opts.states ?? {},
    ...(opts.entities !== undefined ? { entities: opts.entities } : {}),
  } as unknown as HomeAssistant;
}

function batterySensor(state: string, extra: Record<string, unknown> = {}) {
  return { state, attributes: { device_class: 'battery', ...extra } };
}

describe('resolveCoverBatteries', () => {
  it('resolves a battery sensor sitting on the cover’s own device', () => {
    const hass = makeHass({
      states: {
        'cover.shade': { state: 'open', attributes: {} },
        'sensor.shade_battery': batterySensor('72'),
      },
      entities: {
        'cover.shade': { device_id: 'dev_1' },
        'sensor.shade_battery': { device_id: 'dev_1' },
      },
    });
    expect(resolveCoverBatteries(hass, ['cover.shade'])).toEqual([
      { cover_id: 'cover.shade', source_id: 'sensor.shade_battery', level: 72, charging: false },
    ]);
  });

  it('omits a cover whose device carries no battery sensor', () => {
    const hass = makeHass({
      states: { 'cover.mains': { state: 'open', attributes: {} } },
      entities: { 'cover.mains': { device_id: 'dev_1' } },
    });
    expect(resolveCoverBatteries(hass, ['cover.mains'])).toEqual([]);
  });

  it('omits a cover that has no device at all', () => {
    const hass = makeHass({
      states: { 'cover.orphan': { state: 'open', attributes: {} } },
      entities: { 'cover.orphan': { device_id: null } },
    });
    expect(resolveCoverBatteries(hass, ['cover.orphan'])).toEqual([]);
  });

  it('does not reach across devices for a battery', () => {
    const hass = makeHass({
      states: {
        'cover.shade': { state: 'open', attributes: {} },
        'sensor.other_battery': batterySensor('5'),
      },
      entities: {
        'cover.shade': { device_id: 'dev_1' },
        'sensor.other_battery': { device_id: 'dev_2' },
      },
    });
    expect(resolveCoverBatteries(hass, ['cover.shade'])).toEqual([]);
  });

  it('prefers a battery_level attribute on the cover itself, without touching the registry', () => {
    const hass = makeHass({
      states: {
        'cover.inline': { state: 'open', attributes: { battery_level: 41 } },
      },
    });
    expect(resolveCoverBatteries(hass, ['cover.inline'])).toEqual([
      { cover_id: 'cover.inline', source_id: 'cover.inline', level: 41, charging: false },
    ]);
  });

  it('reports charging from either source', () => {
    const hass = makeHass({
      states: {
        'cover.inline': {
          state: 'open',
          attributes: { battery_level: 41, battery_charging: true },
        },
        'cover.sensored': { state: 'open', attributes: {} },
        'sensor.sensored_battery': batterySensor('60', { battery_charging: true }),
      },
      entities: {
        'cover.sensored': { device_id: 'dev_2' },
        'sensor.sensored_battery': { device_id: 'dev_2' },
      },
    });
    const out = resolveCoverBatteries(hass, ['cover.inline', 'cover.sensored']);
    expect(out.map((b) => b.charging)).toEqual([true, true]);
  });

  // The bug this guard exists for: Z-Wave JS / ZHA / deCONZ ship a
  // `binary_sensor.*_battery` (device_class "battery", state on/off) ALONGSIDE
  // the percentage sensor. Accepting it made `Number('off')` → NaN → level null
  // → "low", so a healthy cover showed a permanent red warning.
  it('ignores a binary_sensor battery even when it enumerates first', () => {
    const hass = makeHass({
      states: {
        'cover.shade': { state: 'open', attributes: {} },
        'binary_sensor.shade_battery': batterySensor('off'),
        'sensor.shade_battery': batterySensor('95'),
      },
      entities: {
        'binary_sensor.shade_battery': { device_id: 'dev_1' },
        'cover.shade': { device_id: 'dev_1' },
        'sensor.shade_battery': { device_id: 'dev_1' },
      },
    });
    expect(resolveCoverBatteries(hass, ['cover.shade'])).toEqual([
      { cover_id: 'cover.shade', source_id: 'sensor.shade_battery', level: 95, charging: false },
    ]);
  });

  it('surfaces an unavailable battery sensor as an unknown level rather than hiding it', () => {
    const hass = makeHass({
      states: {
        'cover.shade': { state: 'open', attributes: {} },
        'sensor.shade_battery': batterySensor('unavailable'),
      },
      entities: {
        'cover.shade': { device_id: 'dev_1' },
        'sensor.shade_battery': { device_id: 'dev_1' },
      },
    });
    expect(resolveCoverBatteries(hass, ['cover.shade'])[0].level).toBeNull();
  });

  it('prefers a reporting sensor when a device carries two, regardless of order', () => {
    const entities = {
      'cover.shade': { device_id: 'dev_1' },
      'sensor.a_battery': { device_id: 'dev_1' },
      'sensor.b_battery': { device_id: 'dev_1' },
    };
    const dead = batterySensor('unknown');
    const live = batterySensor('33');
    // Dead one enumerates first…
    expect(
      resolveCoverBatteries(
        makeHass({
          states: {
            'cover.shade': { state: 'open' },
            'sensor.a_battery': dead,
            'sensor.b_battery': live,
          },
          entities,
        }),
        ['cover.shade'],
      )[0],
    ).toMatchObject({ source_id: 'sensor.b_battery', level: 33 });
    // …and when it enumerates second, the reporting one is still kept.
    expect(
      resolveCoverBatteries(
        makeHass({
          states: {
            'cover.shade': { state: 'open' },
            'sensor.a_battery': live,
            'sensor.b_battery': dead,
          },
          entities,
        }),
        ['cover.shade'],
      )[0],
    ).toMatchObject({ source_id: 'sensor.a_battery', level: 33 });
  });

  // `Number(null)` and `Number('')` are both 0, so a cover reporting a null
  // battery_level would read as a flat 0% and paint a red low-battery warning.
  it('treats a null/empty battery_level as absent, not as 0%', () => {
    for (const battery_level of [null, '', undefined]) {
      const hass = makeHass({
        states: { 'cover.x': { state: 'open', attributes: { battery_level } } },
      });
      expect(resolveCoverBatteries(hass, ['cover.x'])).toEqual([]);
    }
  });

  it('clamps out-of-range levels into 0..100', () => {
    const hass = makeHass({
      states: {
        'cover.hi': { state: 'open', attributes: { battery_level: 140 } },
        'cover.lo': { state: 'open', attributes: { battery_level: -20 } },
      },
    });
    expect(resolveCoverBatteries(hass, ['cover.hi', 'cover.lo']).map((b) => b.level)).toEqual([
      100, 0,
    ]);
  });

  it('preserves the caller’s cover order and skips unknown covers', () => {
    const hass = makeHass({
      states: {
        'cover.a': { state: 'open', attributes: { battery_level: 10 } },
        'cover.b': { state: 'open', attributes: { battery_level: 20 } },
      },
    });
    expect(
      resolveCoverBatteries(hass, ['cover.b', 'cover.ghost', 'cover.a']).map((b) => b.cover_id),
    ).toEqual(['cover.b', 'cover.a']);
  });

  it('is safe with no registry, no covers, or no hass', () => {
    expect(resolveCoverBatteries(makeHass({}), [])).toEqual([]);
    expect(
      resolveCoverBatteries(makeHass({ states: { 'cover.a': { state: 'open' } } }), ['cover.a']),
    ).toEqual([]);
    expect(resolveCoverBatteries(undefined as unknown as HomeAssistant, ['cover.a'])).toEqual([]);
  });
});

describe('lowestBattery', () => {
  const b = (level: number | null): CoverBattery => ({
    cover_id: `cover.${level}`,
    source_id: 's',
    level,
    charging: false,
  });

  it('returns null for an empty set', () => {
    expect(lowestBattery([])).toBeNull();
  });

  it('picks the lowest level', () => {
    expect(lowestBattery([b(80), b(12), b(45)])?.level).toBe(12);
  });

  // An unknown level sorts WORST so a dead sensor is never hidden behind a
  // healthy sibling on a multi-cover tile.
  it('sorts an unknown level as worse than any number, in either order', () => {
    expect(lowestBattery([b(80), b(null)])?.level).toBeNull();
    expect(lowestBattery([b(null), b(3)])?.level).toBeNull();
  });

  it('keeps the first of equal levels', () => {
    const first = b(50);
    expect(lowestBattery([first, { ...b(50), cover_id: 'cover.other' }])).toBe(first);
  });
});

describe('isLowBattery', () => {
  it('is false for no battery', () => {
    expect(isLowBattery(null)).toBe(false);
  });

  it('is true at and below the threshold, false above', () => {
    const at = { cover_id: 'c', source_id: 's', level: LOW_BATTERY_PCT, charging: false };
    expect(isLowBattery(at)).toBe(true);
    expect(isLowBattery({ ...at, level: LOW_BATTERY_PCT - 1 })).toBe(true);
    expect(isLowBattery({ ...at, level: LOW_BATTERY_PCT + 1 })).toBe(false);
  });

  it('treats an unknown level as low — a battery that stopped reporting is the warning case', () => {
    expect(isLowBattery({ cover_id: 'c', source_id: 's', level: null, charging: false })).toBe(
      true,
    );
  });
});

describe('batteryIcon', () => {
  it('uses the alert glyph for an unknown level', () => {
    expect(batteryIcon(null)).toBe('mdi:battery-alert-variant-outline');
    expect(batteryIcon(null, true)).toBe('mdi:battery-alert-variant-outline');
  });

  it('uses the bare full glyph at 100', () => {
    expect(batteryIcon(100)).toBe('mdi:battery');
    expect(batteryIcon(100, true)).toBe('mdi:battery-charging-100');
  });

  it('uses the outline glyph below 10', () => {
    expect(batteryIcon(0)).toBe('mdi:battery-outline');
    expect(batteryIcon(9)).toBe('mdi:battery-outline');
    expect(batteryIcon(0, true)).toBe('mdi:battery-charging-10');
  });

  // Rounded DOWN, deliberately: a 19% battery must not read as `battery-20`.
  it('rounds down to the nearest ten in between', () => {
    expect(batteryIcon(10)).toBe('mdi:battery-10');
    expect(batteryIcon(19)).toBe('mdi:battery-10');
    expect(batteryIcon(20)).toBe('mdi:battery-20');
    expect(batteryIcon(99)).toBe('mdi:battery-90');
    expect(batteryIcon(55, true)).toBe('mdi:battery-charging-50');
  });
});
