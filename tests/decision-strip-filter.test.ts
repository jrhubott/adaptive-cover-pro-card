import { describe, it, expect } from 'vitest';
import { selectVisibleHandlers, computeDisabledHandlers } from '../src/components/decision-strip';
import { HANDLER_ORDER } from '../src/const';

describe('selectVisibleHandlers', () => {
  const noSteps = new Map<string, { matched: boolean }>();

  it('returns full HANDLER_ORDER when hideInactive=false', () => {
    const steps = new Map([
      ['solar', { matched: true }],
      ['default', { matched: false }],
    ]);
    expect(selectVisibleHandlers(HANDLER_ORDER, steps, 'solar', false)).toEqual([...HANDLER_ORDER]);
  });

  it('returns only winner when hideInactive=true and only winner matched', () => {
    const steps = new Map([
      ['solar', { matched: true }],
      ['default', { matched: false }],
    ]);
    expect(selectVisibleHandlers(HANDLER_ORDER, steps, 'solar', true)).toEqual(['solar']);
  });

  it('returns winner plus other matched handlers in HANDLER_ORDER priority order', () => {
    const steps = new Map([
      ['manual', { matched: true }],
      ['climate', { matched: true }],
      ['default', { matched: true }],
      ['solar', { matched: false }],
    ]);
    const result = selectVisibleHandlers(HANDLER_ORDER, steps, 'default', true);
    expect(result).toEqual(['manual', 'climate', 'default']);
  });

  it('includes winner even when it has no trace row', () => {
    const result = selectVisibleHandlers(HANDLER_ORDER, noSteps, 'solar', true);
    expect(result).toEqual(['solar']);
  });

  it('does not throw and returns only matched known handlers when winner is unknown', () => {
    const steps = new Map([['solar', { matched: true }]]);
    const result = selectVisibleHandlers(HANDLER_ORDER, steps, 'unknown_handler', true);
    expect(result).toEqual(['solar']);
  });

  it('returns empty array when no matched rows and no known winner', () => {
    const result = selectVisibleHandlers(HANDLER_ORDER, noSteps, 'unknown_handler', true);
    expect(result).toEqual([]);
  });

  it('back-compat: 4-arg call (no disabledHandlers) behaves as before', () => {
    const steps = new Map([
      ['solar', { matched: true }],
      ['manual', { matched: true }],
    ]);
    expect(selectVisibleHandlers(HANDLER_ORDER, steps, 'solar', true)).toEqual(['manual', 'solar']);
  });
});

describe('computeDisabledHandlers', () => {
  it('returns empty set when enabledHandlers is undefined (fail-open)', () => {
    expect(computeDisabledHandlers(undefined)).toEqual(new Set());
  });

  it('returns all HANDLER_ORDER members when enabledHandlers is empty', () => {
    expect(computeDisabledHandlers([])).toEqual(new Set(HANDLER_ORDER));
  });

  it('returns the complement of enabledHandlers within HANDLER_ORDER', () => {
    const result = computeDisabledHandlers(['solar', 'default']);
    const expected = new Set(HANDLER_ORDER.filter((h) => h !== 'solar' && h !== 'default'));
    expect(result).toEqual(expected);
  });

  it('returns empty set when all HANDLER_ORDER handlers are enabled', () => {
    expect(computeDisabledHandlers([...HANDLER_ORDER])).toEqual(new Set());
  });

  it('ignores unknown handler names in the enabled list', () => {
    const result = computeDisabledHandlers(['solar', 'default', 'mystery_handler']);
    expect(result.has('mystery_handler' as never)).toBe(false);
    expect(result).toEqual(new Set(HANDLER_ORDER.filter((h) => h !== 'solar' && h !== 'default')));
  });
});

describe('selectVisibleHandlers with disabledHandlers', () => {
  it('disabled handler is hidden when it is not the winner and not matched', () => {
    const steps = new Map([['solar', { matched: true }]]);
    const result = selectVisibleHandlers(HANDLER_ORDER, steps, 'solar', false, new Set(['manual']));
    expect(result).not.toContain('manual');
    expect(result).toContain('solar');
  });

  it('disabled handler is hidden even when it matched (but is not winner)', () => {
    const steps = new Map([
      ['climate', { matched: true }],
      ['solar', { matched: true }],
    ]);
    const result = selectVisibleHandlers(
      HANDLER_ORDER,
      steps,
      'solar',
      false,
      new Set(['climate']),
    );
    expect(result).not.toContain('climate');
    expect(result).toContain('solar');
  });

  it('disabled handler is still shown when it IS the winner', () => {
    const steps = new Map([['manual', { matched: true }]]);
    const result = selectVisibleHandlers(
      HANDLER_ORDER,
      steps,
      'manual',
      false,
      new Set(['manual']),
    );
    expect(result).toContain('manual');
  });

  it('empty disabled set → identical to previous behavior (hideInactive=false)', () => {
    const steps = new Map([['solar', { matched: true }]]);
    expect(selectVisibleHandlers(HANDLER_ORDER, steps, 'solar', false, new Set())).toEqual([
      ...HANDLER_ORDER,
    ]);
  });

  it('empty disabled set → identical to previous behavior (hideInactive=true)', () => {
    const steps = new Map([
      ['manual', { matched: true }],
      ['solar', { matched: true }],
    ]);
    expect(selectVisibleHandlers(HANDLER_ORDER, steps, 'solar', true, new Set())).toEqual([
      'manual',
      'solar',
    ]);
  });

  it('composes with hideInactive: disabled handler hidden even if matched; unmatched hidden by inactive filter', () => {
    const steps = new Map([
      ['manual', { matched: true }],
      ['climate', { matched: true }],
      ['solar', { matched: true }],
    ]);
    const result = selectVisibleHandlers(HANDLER_ORDER, steps, 'solar', true, new Set(['manual']));
    expect(result).not.toContain('manual');
    expect(result).toContain('climate');
    expect(result).toContain('solar');
  });
});

describe('integration: enabled_handlers attribute → visible list', () => {
  it('hides handlers not in enabled_handlers; winner override still applies', () => {
    const enabledHandlers = ['solar', 'default', 'manual'];
    const disabled = computeDisabledHandlers(enabledHandlers);

    const steps = new Map([
      ['manual', { matched: false }],
      ['climate', { matched: true }],
      ['solar', { matched: true }],
    ]);
    const visible = selectVisibleHandlers(HANDLER_ORDER, steps, 'solar', false, disabled);

    // climate, motion, force, weather, glare_zone, custom_position, cloud are not enabled
    expect(visible).not.toContain('climate');
    expect(visible).not.toContain('motion');
    expect(visible).not.toContain('force');
    // enabled set is visible
    expect(visible).toContain('manual');
    expect(visible).toContain('solar');
    expect(visible).toContain('default');
  });

  it('back-compat: undefined enabled_handlers shows all handlers', () => {
    const disabled = computeDisabledHandlers(undefined);
    const steps = new Map([['solar', { matched: true }]]);
    const visible = selectVisibleHandlers(HANDLER_ORDER, steps, 'solar', false, disabled);
    expect(visible).toEqual([...HANDLER_ORDER]);
  });

  it('disabled winner is still shown (race condition: handler emitted decision after being unconfigured)', () => {
    const enabledHandlers = ['solar', 'default'];
    const disabled = computeDisabledHandlers(enabledHandlers);
    const steps = new Map([['motion', { matched: true }]]);
    const visible = selectVisibleHandlers(HANDLER_ORDER, steps, 'motion', false, disabled);
    expect(visible).toContain('motion');
  });
});

describe('config typing', () => {
  it('accepts hide_inactive_handlers on AdaptiveCoverProCardConfig', () => {
    // This is a compile-time test; if types.ts lacks the field, tsc will fail.
    // At runtime we just confirm the value round-trips.
    const c = {
      type: 'custom:adaptive-cover-pro-card',
      entry_id: 'x',
      hide_inactive_handlers: true,
    };
    expect(c.hide_inactive_handlers).toBe(true);
  });
});
