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
}

function makeHass(o: Opts): HomeAssistant {
  return {
    states: {
      'sensor.cover_position': {
        state: o.state ?? '0',
        attributes: {
          ...(o.rawCalc !== undefined ? { raw_calculated_position: o.rawCalc } : {}),
          ...(o.actual !== undefined ? { actual_positions: o.actual } : {}),
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
