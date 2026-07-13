import { describe, it, expect } from 'vitest';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';
import {
  coverHeldPosition,
  coverSolarTarget,
  coverActualPosition,
  manualOverrideActive,
  isOverrideDivergence,
  displayTarget,
  coverMotorPosition,
  coverLinearPosition,
  coverMotorDivergence,
} from '../src/lib/cover-position';

const baseDiscovered: DiscoveredEntities = {
  entry_id: 'entry1',
  entry_title: 'Test',
  cover_type: 'cover_blind',
  entities: {
    target_position_sensor: 'sensor.cover_position',
    manual_override_binary: 'binary_sensor.manual_override',
  },
  managed_covers: [],
};

interface Opts {
  state?: string;
  rawCalc?: number;
  actual?: Record<string, number | null>;
  override?: boolean;
  linear?: number | string;
}

function makeHass(o: Opts): HomeAssistant {
  return {
    states: {
      'sensor.cover_position': {
        state: o.state ?? '0',
        attributes: {
          ...(o.rawCalc !== undefined ? { raw_calculated_position: o.rawCalc } : {}),
          ...(o.actual !== undefined ? { actual_positions: o.actual } : {}),
          ...(o.linear !== undefined ? { linear_position: o.linear } : {}),
        },
      },
      'binary_sensor.manual_override': {
        state: o.override ? 'on' : 'off',
        attributes: {},
      },
    },
  } as unknown as HomeAssistant;
}

describe('cover-position helpers — issue #158', () => {
  it('reads held position from the sensor state', () => {
    const hass = makeHass({ state: '44' });
    expect(coverHeldPosition(hass, baseDiscovered)).toBe(44);
  });

  it('reads the solar would-be target from raw_calculated_position', () => {
    const hass = makeHass({ state: '44', rawCalc: 60 });
    expect(coverSolarTarget(hass, baseDiscovered)).toBe(60);
  });

  it('aggregates the actual per-cover positions', () => {
    const hass = makeHass({ state: '44', actual: { 'cover.a': 40, 'cover.b': 50 } });
    expect(coverActualPosition(hass, baseDiscovered)).toBe(45);
  });

  it('reports manual override active from the binary sensor', () => {
    expect(manualOverrideActive(makeHass({ override: true }), baseDiscovered)).toBe(true);
    expect(manualOverrideActive(makeHass({ override: false }), baseDiscovered)).toBe(false);
  });

  describe('displayTarget / isOverrideDivergence', () => {
    it('uses the solar target during a diverging manual override', () => {
      const hass = makeHass({ state: '44', rawCalc: 60, override: true });
      expect(displayTarget(hass, baseDiscovered)).toBe(60);
      expect(isOverrideDivergence(hass, baseDiscovered)).toBe(true);
    });

    it('falls back to the held state when the override is inactive', () => {
      const hass = makeHass({ state: '44', rawCalc: 60, override: false });
      expect(displayTarget(hass, baseDiscovered)).toBe(44);
      expect(isOverrideDivergence(hass, baseDiscovered)).toBe(false);
    });

    it('falls back to the held state when raw_calculated_position is absent', () => {
      const hass = makeHass({ state: '44', override: true });
      expect(displayTarget(hass, baseDiscovered)).toBe(44);
      expect(isOverrideDivergence(hass, baseDiscovered)).toBe(false);
    });

    it('reports no divergence when the solar target equals the held state', () => {
      const hass = makeHass({ state: '60', rawCalc: 60, override: true });
      expect(displayTarget(hass, baseDiscovered)).toBe(60);
      expect(isOverrideDivergence(hass, baseDiscovered)).toBe(false);
    });
  });
});

describe('linear position preference — issue #219', () => {
  it('coverLinearPosition reads a valid numeric linear_position attribute', () => {
    const hass = makeHass({ state: '31', linear: 10 });
    expect(coverLinearPosition(hass, baseDiscovered)).toBe(10);
  });

  it('coverLinearPosition returns null when the attribute is absent', () => {
    const hass = makeHass({ state: '31' });
    expect(coverLinearPosition(hass, baseDiscovered)).toBeNull();
  });

  it('coverLinearPosition returns null when the attribute is non-numeric', () => {
    const hass = makeHass({ state: '31', linear: 'ten' });
    expect(coverLinearPosition(hass, baseDiscovered)).toBeNull();
  });

  it('coverMotorPosition reads state regardless of linear_position', () => {
    const hass = makeHass({ state: '31', linear: 10 });
    expect(coverMotorPosition(hass, baseDiscovered)).toBe(31);
  });

  it('coverHeldPosition prefers linear_position over state when both present', () => {
    const hass = makeHass({ state: '31', linear: 10 });
    expect(coverHeldPosition(hass, baseDiscovered)).toBe(10);
  });

  it('coverHeldPosition falls back to state when linear_position is absent', () => {
    const hass = makeHass({ state: '44' });
    expect(coverHeldPosition(hass, baseDiscovered)).toBe(44);
  });

  it('coverMotorDivergence returns the motor value when linear_position differs from state', () => {
    const hass = makeHass({ state: '31', linear: 10 });
    expect(coverMotorDivergence(hass, baseDiscovered)).toBe(31);
  });

  it('coverMotorDivergence returns null when linear_position equals state', () => {
    const hass = makeHass({ state: '31', linear: 31 });
    expect(coverMotorDivergence(hass, baseDiscovered)).toBeNull();
  });

  it('coverMotorDivergence returns null when linear_position is absent', () => {
    const hass = makeHass({ state: '31' });
    expect(coverMotorDivergence(hass, baseDiscovered)).toBeNull();
  });

  it('displayTarget uses the linear-preferred held value as its no-divergence fallback', () => {
    const hass = makeHass({ state: '31', linear: 10 });
    expect(displayTarget(hass, baseDiscovered)).toBe(10);
    expect(isOverrideDivergence(hass, baseDiscovered)).toBe(false);
  });
});
