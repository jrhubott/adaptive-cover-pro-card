import { describe, it, expect } from 'vitest';
import { sunDotState, SUN_DOT_CLASS } from '../src/lib/sun-dot-state';

describe('sunDotState', () => {
  it('below horizon always wins, even with hitting primitives', () => {
    expect(sunDotState({ belowHorizon: true, directSunValid: true, inFov: true })).toBe('night');
    expect(
      sunDotState({ belowHorizon: true, sunState: 'hitting', directSunValid: true, inFov: true }),
    ).toBe('night');
  });

  it('prefers the authoritative sun_state attr when it is a known enum value', () => {
    expect(
      sunDotState({
        belowHorizon: false,
        sunState: 'hitting',
        directSunValid: false,
        inFov: false,
      }),
    ).toBe('hitting');
    expect(
      sunDotState({
        belowHorizon: false,
        sunState: 'in_fov_not_valid',
        directSunValid: false,
        inFov: false,
      }),
    ).toBe('in_fov_not_valid');
    // Authoritative value beats the derived primitives.
    expect(
      sunDotState({
        belowHorizon: false,
        sunState: 'outside_fov',
        directSunValid: true,
        inFov: true,
      }),
    ).toBe('outside_fov');
  });

  it('falls back to the integration derivation when sun_state is absent (older integration)', () => {
    expect(sunDotState({ belowHorizon: false, directSunValid: true, inFov: true })).toBe('hitting');
    expect(sunDotState({ belowHorizon: false, directSunValid: false, inFov: true })).toBe(
      'in_fov_not_valid',
    );
    expect(sunDotState({ belowHorizon: false, directSunValid: false, inFov: false })).toBe(
      'outside_fov',
    );
  });

  it('falls back to primitives when sun_state is a garbage / future value', () => {
    expect(
      sunDotState({ belowHorizon: false, sunState: 'bogus', directSunValid: true, inFov: false }),
    ).toBe('hitting');
    expect(
      sunDotState({ belowHorizon: false, sunState: '', directSunValid: false, inFov: true }),
    ).toBe('in_fov_not_valid');
    expect(
      sunDotState({ belowHorizon: false, sunState: null, directSunValid: false, inFov: false }),
    ).toBe('outside_fov');
  });

  it('maps every state to a CSS class via SUN_DOT_CLASS', () => {
    expect(SUN_DOT_CLASS.night).toBe('sun night');
    expect(SUN_DOT_CLASS.hitting).toBe('sun valid');
    expect(SUN_DOT_CLASS.in_fov_not_valid).toBe('sun in-fov');
    expect(SUN_DOT_CLASS.outside_fov).toBe('sun up');
  });
});
