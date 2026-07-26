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
  coverLogicalActuals,
  logicalCoverPosition,
  logicalAxisValue,
} from '../src/lib/cover-position';
import { resolveAxes, type ResolvedAxis } from '../src/lib/axes';

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
  /** `linear_actual_positions` — the logical-frame per-cover map (#234). */
  linearActuals?: Record<string, number | null>;
  /** `current_position` planted on the `cover.patio_awning` entity (#234). */
  coverPos?: unknown;
  /** `current_tilt_position` planted on the `cover.patio_awning` entity (#236). */
  coverTilt?: unknown;
}

const COVER_ID = 'cover.patio_awning';

function makeHass(o: Opts): HomeAssistant {
  return {
    states: {
      'sensor.cover_position': {
        state: o.state ?? '0',
        attributes: {
          ...(o.rawCalc !== undefined ? { raw_calculated_position: o.rawCalc } : {}),
          ...(o.actual !== undefined ? { actual_positions: o.actual } : {}),
          ...(o.linear !== undefined ? { linear_position: o.linear } : {}),
          ...(o.linearActuals !== undefined ? { linear_actual_positions: o.linearActuals } : {}),
        },
      },
      'binary_sensor.manual_override': {
        state: o.override ? 'on' : 'off',
        attributes: {},
      },
      [COVER_ID]: {
        state: 'open',
        attributes: {
          ...(o.coverPos !== undefined ? { current_position: o.coverPos } : {}),
          ...(o.coverTilt !== undefined ? { current_tilt_position: o.coverTilt } : {}),
        },
      },
    },
  } as unknown as HomeAssistant;
}

/** An `inverse_state` entry: the integration's discovery marks the position
 *  axis inverted, so every cover-frame read must be un-inverted at the read. */
const invertedDiscovered: DiscoveredEntities = {
  ...baseDiscovered,
  discovery: { axes: [{ id: 'position', inverted: true, supported: true }] },
};

/** Same discovery shape, flag explicitly false — the interpolating install that
 *  configured inversion but has it suppressed. Must behave like legacy. */
const notInvertedDiscovered: DiscoveredEntities = {
  ...baseDiscovered,
  discovery: { axes: [{ id: 'position', inverted: false, supported: true }] },
};

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

  // Regression guard: coverHeldPosition composes coverLinearPosition() with
  // `??`, which correctly treats a valid `0` as present (unlike `||`, which
  // would treat falsy 0 as absent and fall through to the motor state). These
  // pin that behavior so a future refactor to a falsy check would fail loudly.
  it('coverHeldPosition preserves a valid linear_position of 0 rather than falling back to state', () => {
    const hass = makeHass({ state: '5', linear: 0 });
    expect(coverHeldPosition(hass, baseDiscovered)).toBe(0);
  });

  it('coverMotorDivergence reports the motor value when linear_position is 0 and state is not', () => {
    const hass = makeHass({ state: '5', linear: 0 });
    expect(coverMotorDivergence(hass, baseDiscovered)).toBe(5);
  });
});

describe('logical-frame actuals — issue #234', () => {
  // The reporter's install: a fully-extended awning. Sensor STATE and
  // `actual_positions` are cover-frame (0), `linear_position` and
  // `linear_actual_positions` are logical (100).
  const REPORTER: Opts = {
    state: '0',
    linear: 100,
    rawCalc: 100,
    actual: { 'cover.patio_awning': 0 },
    linearActuals: { 'cover.patio_awning': 100 },
  };

  it('coverLogicalActuals prefers linear_actual_positions verbatim when present', () => {
    const hass = makeHass(REPORTER);
    expect(coverLogicalActuals(hass, invertedDiscovered)).toEqual({ 'cover.patio_awning': 100 });
  });

  it('coverLogicalActuals un-inverts actual_positions when the flag is set and the map is absent', () => {
    const hass = makeHass({ state: '0', actual: { 'cover.a': 0, 'cover.b': 30, 'cover.c': null } });
    expect(coverLogicalActuals(hass, invertedDiscovered)).toEqual({
      'cover.a': 100,
      'cover.b': 70,
      'cover.c': null,
    });
  });

  it('coverLogicalActuals returns actual_positions verbatim on a legacy entry (no discovery)', () => {
    const hass = makeHass({ state: '40', actual: { 'cover.a': 40, 'cover.b': 50 } });
    expect(coverLogicalActuals(hass, baseDiscovered)).toEqual({ 'cover.a': 40, 'cover.b': 50 });
  });

  it('coverLogicalActuals returns actual_positions verbatim when the flag is false', () => {
    const hass = makeHass({ state: '40', actual: { 'cover.a': 40, 'cover.b': 50 } });
    expect(coverLogicalActuals(hass, notInvertedDiscovered)).toEqual({
      'cover.a': 40,
      'cover.b': 50,
    });
  });

  it('coverLogicalActuals returns {} when the sensor publishes no actuals at all', () => {
    const hass = makeHass({ state: '40' });
    expect(coverLogicalActuals(hass, invertedDiscovered)).toEqual({});
  });

  it('coverActualPosition aggregates the logical map on an inverse install', () => {
    const hass = makeHass(REPORTER);
    expect(coverActualPosition(hass, invertedDiscovered)).toBe(100);
  });

  it('coverActualPosition un-inverts a legacy-shaped actuals map when the flag is set', () => {
    const hass = makeHass({ state: '0', actual: { 'cover.a': 0, 'cover.b': 30 } });
    // logical 100 and 70 → mean 85 (not the cover-frame 15).
    expect(coverActualPosition(hass, invertedDiscovered)).toBe(85);
  });

  it('logicalCoverPosition un-inverts the cover entity current_position when inverted', () => {
    const hass = makeHass({ ...REPORTER, coverPos: 0 });
    expect(logicalCoverPosition(hass, invertedDiscovered, COVER_ID)).toBe(100);
  });

  it('logicalCoverPosition reads current_position verbatim when the flag is false/absent', () => {
    const hass = makeHass({ coverPos: 60 });
    expect(logicalCoverPosition(hass, baseDiscovered, COVER_ID)).toBe(60);
    expect(logicalCoverPosition(hass, notInvertedDiscovered, COVER_ID)).toBe(60);
  });

  // Zero-trap, mirroring the `??`-not-`||` guards above: an inverted cover
  // reporting 100 is logically 0 — a valid 0, never null.
  it('logicalCoverPosition returns a valid 0 for an inverted cover reporting 100', () => {
    const hass = makeHass({ coverPos: 100 });
    expect(logicalCoverPosition(hass, invertedDiscovered, COVER_ID)).toBe(0);
  });

  it('logicalCoverPosition returns null for a missing attribute, cover or NaN', () => {
    expect(logicalCoverPosition(makeHass({}), invertedDiscovered, COVER_ID)).toBeNull();
    expect(
      logicalCoverPosition(makeHass({ coverPos: 'x' }), invertedDiscovered, COVER_ID),
    ).toBeNull();
    expect(
      logicalCoverPosition(makeHass({ coverPos: NaN }), invertedDiscovered, COVER_ID),
    ).toBeNull();
    expect(
      logicalCoverPosition(makeHass({ coverPos: 0 }), invertedDiscovered, undefined),
    ).toBeNull();
    expect(
      logicalCoverPosition(makeHass({ coverPos: 0 }), invertedDiscovered, 'cover.gone'),
    ).toBeNull();
  });

  it('coverMotorDivergence suppresses pure inversion on an inverse install', () => {
    // state 0 / linear 100 is the inversion itself, not interpolation bending
    // the value — there is no "motor" detail worth disclosing.
    const hass = makeHass({ state: '0', linear: 100 });
    expect(coverMotorDivergence(hass, invertedDiscovered)).toBeNull();
  });

  it('coverMotorDivergence still discloses a genuine divergence on an inverse install', () => {
    // 5 is not 100 − 100, so interpolation (or a stale motor) is in play.
    const hass = makeHass({ state: '5', linear: 100 });
    expect(coverMotorDivergence(hass, invertedDiscovered)).toBe(5);
  });
});

describe('logical-frame axis values — issue #236', () => {
  /** A venetian slat axis on an `inverse_tilt` install: the integration
   *  dispatches `100 − logical`, so the cover reports the complement. */
  const invertedTilt: ResolvedAxis = {
    id: 'tilt',
    label: 'Tilt',
    min: 0,
    max: 100,
    unit: '%',
    stateAttr: 'current_tilt_position',
    inverted: true,
  };
  /** The same axis on every non-inverse install — the helper is the identity. */
  const plainTilt: ResolvedAxis = { ...invertedTilt, inverted: false };
  /** A discovery payload that declared no `state_attr` for this axis. */
  const noAttrTilt: ResolvedAxis = { ...invertedTilt, stateAttr: undefined };

  it('un-inverts the axis state attribute when the axis is inverted', () => {
    // The headline defect: slats at logical 35 report 65 on the cover.
    expect(logicalAxisValue(makeHass({ coverTilt: 65 }), invertedTilt, COVER_ID)).toBe(35);
  });

  it('reads the axis state attribute verbatim when the axis is not inverted', () => {
    expect(logicalAxisValue(makeHass({ coverTilt: 65 }), plainTilt, COVER_ID)).toBe(65);
  });

  // Zero-trap, mirroring logicalCoverPosition: fully-closed slats are a valid
  // 0, never null — a truthiness bug here silently blanks the bar.
  it('returns a valid 0 for an inverted axis reporting 100', () => {
    expect(logicalAxisValue(makeHass({ coverTilt: 100 }), invertedTilt, COVER_ID)).toBe(0);
  });

  it('maps an inverted 0 back to 100', () => {
    expect(logicalAxisValue(makeHass({ coverTilt: 0 }), invertedTilt, COVER_ID)).toBe(100);
  });

  it('returns null when the attribute is absent', () => {
    expect(logicalAxisValue(makeHass({}), invertedTilt, COVER_ID)).toBeNull();
  });

  it('returns null for a non-numeric attribute', () => {
    expect(logicalAxisValue(makeHass({ coverTilt: 'x' }), invertedTilt, COVER_ID)).toBeNull();
  });

  it('returns null for a NaN attribute', () => {
    expect(logicalAxisValue(makeHass({ coverTilt: NaN }), invertedTilt, COVER_ID)).toBeNull();
  });

  it('returns null for a missing or unknown cover', () => {
    expect(logicalAxisValue(makeHass({ coverTilt: 65 }), invertedTilt, undefined)).toBeNull();
    expect(logicalAxisValue(makeHass({ coverTilt: 65 }), invertedTilt, 'cover.gone')).toBeNull();
  });

  it('returns null when the axis declares no state attribute', () => {
    expect(logicalAxisValue(makeHass({ coverTilt: 65 }), noAttrTilt, COVER_ID)).toBeNull();
  });

  it('normalizes an axis resolved straight out of discovery', () => {
    // Pins the descriptor → resolveAxes → helper wiring end-to-end, so a
    // dropped `inverted` anywhere in that chain fails here.
    const [tilt] = resolveAxes({
      ...baseDiscovered,
      discovery: {
        axes: [
          { id: 'tilt', state_attr: 'current_tilt_position', inverted: true, supported: true },
        ],
      },
    });
    expect(logicalAxisValue(makeHass({ coverTilt: 65 }), tilt, COVER_ID)).toBe(35);
  });
});
