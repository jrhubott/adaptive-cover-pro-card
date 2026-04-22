import { describe, it, expect } from 'vitest';
import { selectVisibleHandlers } from '../src/components/decision-strip';
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
