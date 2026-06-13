import { describe, it, expect } from 'vitest';
import {
  buildDecisionSentence,
  normalizeHandler,
  resolveCustomPositionPct,
  resolveActiveMinModeFloor,
  isWinningSlotSafety,
} from '../src/lib/decision-summary';
import {
  MANUAL_OVERRIDE_PRIORITY,
  CUSTOM_POSITION_SAFETY_PRIORITY,
  HANDLER_ORDER,
  BADGE_TOKENS,
  BADGE_KINDS_BY_HANDLER,
} from '../src/const';
import type {
  CustomPositionSlotSnapshot,
  DecisionStep,
  DecisionTraceAttributes,
} from '../src/types';

describe('MANUAL_OVERRIDE_PRIORITY', () => {
  it('mirrors the integration manual-override handler priority (80)', () => {
    expect(MANUAL_OVERRIDE_PRIORITY).toBe(80);
  });
});

const step = (
  handler: string,
  matched: boolean,
  position: number | null = null,
  reason = '',
): DecisionStep => ({ handler, matched, position, reason });

const baseAttrs = (
  overrides: Partial<DecisionTraceAttributes> = {},
): Pick<
  DecisionTraceAttributes,
  | 'reason'
  | 'custom_position_active_slot'
  | 'custom_position_minimum_mode'
  | 'custom_position_active_slot_name'
  | 'custom_position_slots'
> => ({
  reason: '',
  ...overrides,
});

describe('normalizeHandler', () => {
  it('strips trailing Handler suffix and lowercases CamelCase', () => {
    expect(normalizeHandler('SolarHandler')).toBe('solar');
    expect(normalizeHandler('ManualOverrideHandler')).toBe('manual');
  });

  it('aliases canonical integration names to card HANDLER_ORDER keys', () => {
    expect(normalizeHandler('force_override')).toBe('force');
    expect(normalizeHandler('weather_override')).toBe('weather');
    expect(normalizeHandler('manual_override')).toBe('manual');
    expect(normalizeHandler('motion_timeout')).toBe('motion');
    expect(normalizeHandler('cloud_suppression')).toBe('cloud');
  });

  it('collapses per-slot custom_position_<N> to custom_position', () => {
    expect(normalizeHandler('custom_position_1')).toBe('custom_position');
    expect(normalizeHandler('custom_position_4')).toBe('custom_position');
  });

  it('passes through already-normalized names unchanged', () => {
    expect(normalizeHandler('solar')).toBe('solar');
    expect(normalizeHandler('default')).toBe('default');
    expect(normalizeHandler('glare_zone')).toBe('glare_zone');
  });
});

describe('buildDecisionSentence', () => {
  it('returns empty string when trace has no matched steps and no reason', () => {
    expect(
      buildDecisionSentence([step('solar', false), step('default', false)], baseAttrs(), 'default'),
    ).toBe('');
  });

  it('falls back to attrs.reason when nothing matched', () => {
    expect(
      buildDecisionSentence(
        [step('solar', false)],
        baseAttrs({ reason: 'no handler claimed position' }),
        'default',
      ),
    ).toBe('no handler claimed position');
  });

  it('renders single matched handler as "Label N%"', () => {
    expect(buildDecisionSentence([step('solar', true, 100)], baseAttrs(), 'solar')).toBe(
      'Solar Tracking 100%',
    );
  });

  it('orders matched handlers low-priority → high-priority so the winner reads last', () => {
    // Solar (priority 40) computed 100, custom_position (77) applied 60, manual (80) locked at 60.
    const sentence = buildDecisionSentence(
      [
        step('manual_override', true, 60),
        step('custom_position_1', true, 60),
        step('solar', true, 100),
      ],
      baseAttrs({
        custom_position_active_slot: 1,
        custom_position_minimum_mode: true,
      }),
      'manual',
    );
    expect(sentence).toBe(
      'Solar Tracking 100% → Custom Position #1 60% floor → Manual Override 60%',
    );
  });

  it('uses slot friendly name when present, falling back to #N when absent', () => {
    const withName = buildDecisionSentence(
      [step('custom_position_1', true, 60)],
      baseAttrs({
        custom_position_active_slot: 1,
        custom_position_minimum_mode: true,
        custom_position_active_slot_name: 'Table extension',
      }),
      'custom_position',
    );
    expect(withName).toBe('Custom Position · Table extension 60% floor');

    const noName = buildDecisionSentence(
      [step('custom_position_3', true, 45)],
      baseAttrs({
        custom_position_active_slot: 3,
        custom_position_minimum_mode: true,
      }),
      'custom_position',
    );
    expect(noName).toBe('Custom Position #3 45% floor');
  });

  it('omits the floor suffix in exact mode (minimum_mode is null/undefined)', () => {
    expect(
      buildDecisionSentence(
        [step('custom_position_2', true, 80)],
        baseAttrs({ custom_position_active_slot: 2 }),
        'custom_position',
      ),
    ).toBe('Custom Position #2 80%');
  });

  it('omits the floor suffix when the configured floor is currently a no-op', () => {
    // minimum_mode === false means the floor is configured but raw already meets it.
    // Showing "floor" would be misleading; the position reflects the raw calc.
    expect(
      buildDecisionSentence(
        [step('custom_position_1', true, 75)],
        baseAttrs({
          custom_position_active_slot: 1,
          custom_position_minimum_mode: false,
        }),
        'custom_position',
      ),
    ).toBe('Custom Position #1 75%');
  });

  it('renders a handler with null position as label only (no percent suffix)', () => {
    expect(
      buildDecisionSentence(
        [step('manual_override', true, null), step('solar', true, 50)],
        baseAttrs(),
        'manual',
      ),
    ).toBe('Solar Tracking 50% → Manual Override');
  });

  it('respects a custom labels override', () => {
    expect(
      buildDecisionSentence([step('solar', true, 100)], baseAttrs(), 'solar', {
        solar: 'Sun',
      } as Record<string, string>),
    ).toBe('Sun 100%');
  });

  it('ignores trace rows whose handler does not normalize to a known HANDLER_ORDER name', () => {
    expect(
      buildDecisionSentence(
        [step('mystery', true, 50), step('solar', true, 100)],
        baseAttrs(),
        'solar',
      ),
    ).toBe('Solar Tracking 100%');
  });

  it('appends a safety marker when the winning custom-position slot has priority 100', () => {
    const safetySlot: CustomPositionSlotSnapshot = {
      slot: 5,
      enabled: true,
      sensor: 'input_boolean.slot5',
      sensor_name: null,
      position: 100,
      priority: 100,
      min_mode: false,
    };
    const sentence = buildDecisionSentence(
      [step('custom_position_5', true, 100)],
      baseAttrs({
        custom_position_active_slot: 5,
        custom_position_slots: [safetySlot],
      }),
      'custom_position',
    );
    expect(sentence).toBe('Custom Position #5 100% · Safety');
  });

  it('omits the safety marker for a sub-100 priority custom-position winner', () => {
    const ordinarySlot: CustomPositionSlotSnapshot = {
      slot: 1,
      enabled: true,
      sensor: 'input_boolean.slot1',
      sensor_name: null,
      position: 60,
      priority: 90,
      min_mode: false,
    };
    const sentence = buildDecisionSentence(
      [step('custom_position_1', true, 60)],
      baseAttrs({
        custom_position_active_slot: 1,
        custom_position_slots: [ordinarySlot],
      }),
      'custom_position',
    );
    expect(sentence).toBe('Custom Position #1 60%');
  });
});

describe('resolveCustomPositionPct', () => {
  const slots = [
    {
      slot: 1 as const,
      enabled: true,
      sensor: 's',
      sensor_name: 'S',
      position: 60,
      priority: 1,
      min_mode: true,
    },
    {
      slot: 2 as const,
      enabled: false,
      sensor: null,
      sensor_name: null,
      position: null,
      priority: null,
      min_mode: null,
    },
  ];

  it('returns the slot position when minimum_mode is true and slot matches', () => {
    expect(
      resolveCustomPositionPct(
        {
          custom_position_minimum_mode: true,
          custom_position_slots: slots,
          custom_position_active_slot: 1,
        },
        100,
      ),
    ).toBe(60);
  });

  it('returns the fallback when minimum_mode is false', () => {
    expect(
      resolveCustomPositionPct(
        {
          custom_position_minimum_mode: false,
          custom_position_slots: slots,
          custom_position_active_slot: 1,
        },
        100,
      ),
    ).toBe(100);
  });

  it('returns the fallback when custom_position_slots is missing', () => {
    expect(
      resolveCustomPositionPct(
        { custom_position_minimum_mode: true, custom_position_active_slot: 1 },
        42,
      ),
    ).toBe(42);
  });

  it('returns the fallback when custom_position_active_slot is undefined', () => {
    expect(
      resolveCustomPositionPct(
        { custom_position_minimum_mode: true, custom_position_slots: slots },
        42,
      ),
    ).toBe(42);
  });

  it('returns the fallback when the matching slot has a null position', () => {
    expect(
      resolveCustomPositionPct(
        {
          custom_position_minimum_mode: true,
          custom_position_slots: slots,
          custom_position_active_slot: 2,
        },
        42,
      ),
    ).toBe(42);
  });

  it('returns the fallback when attrs is undefined', () => {
    expect(resolveCustomPositionPct(undefined, 55)).toBe(55);
  });
});

describe('resolveActiveMinModeFloor', () => {
  // Helpers to make mock hass states. Cast through unknown to avoid the full
  // HassEntity shape requirement — tests only need the `state` field.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function hassStates(entries: Record<string, string>): any {
    return Object.fromEntries(
      entries && Object.entries(entries).map(([id, state]) => [id, { state }]),
    );
  }

  const slot1On = {
    slot: 1 as const,
    enabled: true,
    sensor: 'input_boolean.slot1',
    sensor_name: 'Slot 1',
    position: 30,
    priority: 1,
    min_mode: true as boolean | null,
  };

  const slot2On = {
    slot: 2 as const,
    enabled: true,
    sensor: 'input_boolean.slot2',
    sensor_name: 'Slot 2',
    position: 50,
    priority: 2,
    min_mode: true as boolean | null,
  };

  it('returns null when attrs is undefined', () => {
    expect(resolveActiveMinModeFloor(undefined, hassStates({}), 40)).toBeNull();
  });

  it('returns null when custom_position_slots is absent', () => {
    expect(resolveActiveMinModeFloor({}, hassStates({}), 40)).toBeNull();
  });

  it('returns null when no slots have min_mode true', () => {
    const slots = [
      { ...slot1On, min_mode: false },
      { ...slot2On, min_mode: null },
    ];
    expect(
      resolveActiveMinModeFloor(
        { custom_position_slots: slots },
        hassStates({ 'input_boolean.slot1': 'on', 'input_boolean.slot2': 'on' }),
        40,
      ),
    ).toBeNull();
  });

  it('returns null when the only min_mode slot is disabled', () => {
    const slots = [{ ...slot1On, enabled: false }];
    expect(
      resolveActiveMinModeFloor(
        { custom_position_slots: slots },
        hassStates({ 'input_boolean.slot1': 'on' }),
        40,
      ),
    ).toBeNull();
  });

  it('returns null when the only min_mode slot sensor is off', () => {
    const slots = [slot1On];
    expect(
      resolveActiveMinModeFloor(
        { custom_position_slots: slots },
        hassStates({ 'input_boolean.slot1': 'off' }),
        40,
      ),
    ).toBeNull();
  });

  it('returns null when the only min_mode slot sensor entity is missing from states', () => {
    const slots = [slot1On];
    expect(
      resolveActiveMinModeFloor(
        { custom_position_slots: slots },
        hassStates({}), // sensor not present
        40,
      ),
    ).toBeNull();
  });

  it('returns the active floor when one slot qualifies', () => {
    const result = resolveActiveMinModeFloor(
      { custom_position_slots: [slot1On] },
      hassStates({ 'input_boolean.slot1': 'on' }),
      40,
    );
    expect(result).not.toBeNull();
    expect(result!.position).toBe(30);
    expect(result!.slot).toBe(1);
  });

  it('returns the highest-position floor when multiple slots qualify', () => {
    const slots = [slot1On, slot2On]; // slot2 has position 50 (higher)
    const result = resolveActiveMinModeFloor(
      { custom_position_slots: slots },
      hassStates({ 'input_boolean.slot1': 'on', 'input_boolean.slot2': 'on' }),
      40,
    );
    expect(result).not.toBeNull();
    expect(result!.position).toBe(50); // slot2 wins
    expect(result!.slot).toBe(2);
  });

  it('sets clamping true when floor position > targetPosition', () => {
    const result = resolveActiveMinModeFloor(
      { custom_position_slots: [slot1On] }, // position 30
      hassStates({ 'input_boolean.slot1': 'on' }),
      20, // target 20 < floor 30 → clamping
    );
    expect(result!.clamping).toBe(true);
  });

  it('sets clamping false when floor position <= targetPosition', () => {
    const result = resolveActiveMinModeFloor(
      { custom_position_slots: [slot1On] }, // position 30
      hassStates({ 'input_boolean.slot1': 'on' }),
      40, // target 40 >= floor 30 → not clamping
    );
    expect(result!.clamping).toBe(false);
  });

  it('sets clamping false when targetPosition is null', () => {
    const result = resolveActiveMinModeFloor(
      { custom_position_slots: [slot1On] },
      hassStates({ 'input_boolean.slot1': 'on' }),
      null,
    );
    expect(result!.clamping).toBe(false);
  });

  it('forwards the winning slot priority', () => {
    const result = resolveActiveMinModeFloor(
      { custom_position_slots: [{ ...slot1On, priority: 90 }] },
      hassStates({ 'input_boolean.slot1': 'on' }),
      40,
    );
    expect(result!.priority).toBe(90);
  });

  it('sets priority null when the slot priority is null', () => {
    const result = resolveActiveMinModeFloor(
      { custom_position_slots: [{ ...slot1On, priority: null }] },
      hassStates({ 'input_boolean.slot1': 'on' }),
      40,
    );
    expect(result!.priority).toBeNull();
  });

  it('sets resistsManual true when priority exceeds MANUAL_OVERRIDE_PRIORITY', () => {
    const result = resolveActiveMinModeFloor(
      { custom_position_slots: [{ ...slot1On, priority: 90 }] },
      hassStates({ 'input_boolean.slot1': 'on' }),
      40,
    );
    expect(result!.resistsManual).toBe(true);
  });

  it('sets resistsManual false at the priority boundary (80)', () => {
    const result = resolveActiveMinModeFloor(
      { custom_position_slots: [{ ...slot1On, priority: 80 }] },
      hassStates({ 'input_boolean.slot1': 'on' }),
      40,
    );
    expect(result!.resistsManual).toBe(false);
  });

  it('sets resistsManual true just above the boundary (81)', () => {
    const result = resolveActiveMinModeFloor(
      { custom_position_slots: [{ ...slot1On, priority: 81 }] },
      hassStates({ 'input_boolean.slot1': 'on' }),
      40,
    );
    expect(result!.resistsManual).toBe(true);
  });

  it('sets resistsManual false when priority is null', () => {
    const result = resolveActiveMinModeFloor(
      { custom_position_slots: [{ ...slot1On, priority: null }] },
      hassStates({ 'input_boolean.slot1': 'on' }),
      40,
    );
    expect(result!.resistsManual).toBe(false);
  });

  it('accepts a slot-5 (priority-100 safety) snapshot', () => {
    const slot5: CustomPositionSlotSnapshot = {
      slot: 5,
      enabled: true,
      sensor: 'input_boolean.slot5',
      sensor_name: 'Safety',
      position: 100,
      priority: 100,
      min_mode: true,
    };
    const result = resolveActiveMinModeFloor(
      { custom_position_slots: [slot5] },
      hassStates({ 'input_boolean.slot5': 'on' }),
      40,
    );
    expect(result!.slot).toBe(5);
    expect(result!.priority).toBe(100);
    expect(result!.resistsManual).toBe(true);
  });
});

describe('CUSTOM_POSITION_SAFETY_PRIORITY', () => {
  it('matches the integration safety-slot priority (100)', () => {
    expect(CUSTOM_POSITION_SAFETY_PRIORITY).toBe(100);
  });
});

// Regression lock: the `force` handler is retained for pre-2.28 integration
// builds that still emit `force`/`force_override` as a winner. A future cleanup
// must not silently drop it.
describe('force handler back-compat lock', () => {
  it('normalizes force_override → force', () => {
    expect(normalizeHandler('force_override')).toBe('force');
  });

  it('keeps force in HANDLER_ORDER', () => {
    expect(HANDLER_ORDER).toContain('force');
  });

  it('maps the force handler to the force badge kind', () => {
    expect(BADGE_KINDS_BY_HANDLER.force).toBe('force');
  });

  it('keeps the red force badge tokens', () => {
    expect(BADGE_TOKENS.force.fg).toBe('#b71c1c');
    expect(BADGE_TOKENS.force.bg).toBe('rgba(244, 67, 54, 0.22)');
  });
});

describe('isWinningSlotSafety', () => {
  const safetySlot: CustomPositionSlotSnapshot = {
    slot: 5,
    enabled: true,
    sensor: 'input_boolean.slot5',
    sensor_name: 'Safety',
    position: 100,
    priority: 100,
    min_mode: false,
  };
  const ordinarySlot: CustomPositionSlotSnapshot = {
    slot: 1,
    enabled: true,
    sensor: 'input_boolean.slot1',
    sensor_name: 'Slot 1',
    position: 60,
    priority: 90,
    min_mode: true,
  };

  it('returns true when the winning slot has priority 100', () => {
    expect(
      isWinningSlotSafety({
        custom_position_active_slot: 5,
        custom_position_slots: [ordinarySlot, safetySlot],
      }),
    ).toBe(true);
  });

  it('returns false when the winning slot has a sub-100 priority', () => {
    expect(
      isWinningSlotSafety({
        custom_position_active_slot: 1,
        custom_position_slots: [ordinarySlot, safetySlot],
      }),
    ).toBe(false);
  });

  it('returns false when there is no active slot', () => {
    expect(isWinningSlotSafety({ custom_position_slots: [safetySlot] })).toBe(false);
  });

  it('returns false when custom_position_slots is missing', () => {
    expect(isWinningSlotSafety({ custom_position_active_slot: 5 })).toBe(false);
  });

  it('returns false when attrs is undefined', () => {
    expect(isWinningSlotSafety(undefined)).toBe(false);
  });

  it('returns false when the active slot is not present in the snapshot list', () => {
    expect(
      isWinningSlotSafety({
        custom_position_active_slot: 5,
        custom_position_slots: [ordinarySlot],
      }),
    ).toBe(false);
  });
});
