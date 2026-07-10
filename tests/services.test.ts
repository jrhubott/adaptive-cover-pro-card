import { describe, it, expect, vi } from 'vitest';
import { setAxes } from '../src/lib/services';
import { INTEGRATION_DOMAIN } from '../src/const';
import type { HomeAssistant } from 'custom-card-helpers';

function hassWithSetAxes(callService = vi.fn()): HomeAssistant {
  return {
    services: { [INTEGRATION_DOMAIN]: { set_axes: {} } },
    callService,
  } as unknown as HomeAssistant;
}

function hassLegacy(callService = vi.fn()): HomeAssistant {
  // No `services` map at all → feature-detect fails → legacy fan-out.
  return { callService } as unknown as HomeAssistant;
}

describe('setAxes — modern (set_axes present)', () => {
  it('sends a single set_axes call with the axes payload targeted by entity_id', () => {
    const callService = vi.fn();
    setAxes(hassWithSetAxes(callService), 'cover.a', { position: 60, tilt: 30 });
    expect(callService).toHaveBeenCalledTimes(1);
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      { axes: { position: 60, tilt: 30 } },
      { entity_id: 'cover.a' },
    );
  });

  it('includes force only when explicitly provided', () => {
    const callService = vi.fn();
    setAxes(hassWithSetAxes(callService), 'cover.a', { position: 60 }, { force: true });
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      { axes: { position: 60 }, force: true },
      { entity_id: 'cover.a' },
    );
  });

  it('omits force from the payload when not provided (takes the service default)', () => {
    const callService = vi.fn();
    setAxes(hassWithSetAxes(callService), 'cover.a', { tilt: 80 });
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      { axes: { tilt: 80 } },
      { entity_id: 'cover.a' },
    );
  });
});

describe('setAxes — legacy fan-out (set_axes absent)', () => {
  it('routes position → set_position and tilt → set_tilt as separate calls', () => {
    const callService = vi.fn();
    setAxes(hassLegacy(callService), 'cover.a', { position: 60, tilt: 30 });
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_position',
      { position: 60 },
      { entity_id: 'cover.a' },
    );
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_tilt',
      { tilt: 30 },
      { entity_id: 'cover.a' },
    );
    expect(callService).toHaveBeenCalledTimes(2);
    expect(callService).not.toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      expect.anything(),
      expect.anything(),
    );
  });

  it('emits a single set_position call for a position-only nudge', () => {
    const callService = vi.fn();
    setAxes(hassLegacy(callService), 'cover.a', { position: 50 });
    expect(callService).toHaveBeenCalledTimes(1);
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_position',
      { position: 50 },
      { entity_id: 'cover.a' },
    );
  });

  it('skips axis ids with no legacy service mapping', () => {
    const callService = vi.fn();
    setAxes(hassLegacy(callService), 'cover.a', { position: 50, elevation: 10 });
    expect(callService).toHaveBeenCalledTimes(1);
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_position',
      { position: 50 },
      { entity_id: 'cover.a' },
    );
  });
});
