import { describe, it, expect } from 'vitest';
import type { HomeAssistant } from 'custom-card-helpers';
import { entityStateChanged } from '../src/lib/hass-change';

function hassWith(states: Record<string, unknown>): HomeAssistant {
  return { states } as unknown as HomeAssistant;
}

describe('entityStateChanged', () => {
  const sunState = { state: '120', attributes: {} };
  const coverState = { state: '40', attributes: {} };

  it('returns true when oldHass is undefined (first update)', () => {
    const next = hassWith({ 'sensor.sun': sunState });
    expect(entityStateChanged(undefined, next, ['sensor.sun'])).toBe(true);
  });

  it('returns false when the watched state objects are reference-equal', () => {
    const old = hassWith({ 'sensor.sun': sunState, 'sensor.cover': coverState });
    // New hass object, but the watched state references are shared (HA's behaviour for
    // entities that did not change) plus an unrelated entity that did change.
    const next = hassWith({
      'sensor.sun': sunState,
      'sensor.cover': coverState,
      'light.kitchen': { state: 'on' },
    });
    expect(entityStateChanged(old, next, ['sensor.sun', 'sensor.cover'])).toBe(false);
  });

  it('returns true when a watched state object reference changed', () => {
    const old = hassWith({ 'sensor.sun': sunState });
    const next = hassWith({ 'sensor.sun': { state: '121', attributes: {} } });
    expect(entityStateChanged(old, next, ['sensor.sun'])).toBe(true);
  });

  it('skips undefined ids without matching', () => {
    const old = hassWith({ 'sensor.sun': sunState });
    const next = hassWith({ 'sensor.sun': sunState });
    expect(entityStateChanged(old, next, [undefined, 'sensor.sun'])).toBe(false);
  });

  it('ignores a changed entity that is not in the watch list', () => {
    const old = hassWith({ 'sensor.sun': sunState, 'sensor.other': { state: '1' } });
    const next = hassWith({ 'sensor.sun': sunState, 'sensor.other': { state: '2' } });
    expect(entityStateChanged(old, next, ['sensor.sun'])).toBe(false);
  });
});
