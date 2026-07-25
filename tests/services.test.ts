import { describe, it, expect, vi } from 'vitest';
import { setAxes, engageManualOverride, hasEngageManualOverride } from '../src/lib/services';
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

// ── Manual override (#229) ───────────────────────────────────────────────────

function hassWithEngage(callService = vi.fn()): HomeAssistant {
  return {
    services: { [INTEGRATION_DOMAIN]: { engage_manual_override: {} } },
    callService,
  } as unknown as HomeAssistant;
}

describe('hasEngageManualOverride', () => {
  it('is true when the integration exposes engage_manual_override', () => {
    expect(hasEngageManualOverride(hassWithEngage())).toBe(true);
  });

  it('is false when the integration predates the service', () => {
    const hass = {
      services: { [INTEGRATION_DOMAIN]: { set_axes: {} } },
      callService: vi.fn(),
    } as unknown as HomeAssistant;
    expect(hasEngageManualOverride(hass)).toBe(false);
  });

  it('is false when hass exposes no services map at all', () => {
    expect(hasEngageManualOverride({ callService: vi.fn() } as unknown as HomeAssistant)).toBe(
      false,
    );
  });
});

describe('engageManualOverride', () => {
  it('sends end_time as an offset-bearing ISO string preserving the instant', () => {
    const callService = vi.fn();
    const endTime = new Date('2026-07-16T18:45:00Z');
    engageManualOverride(hassWithEngage(callService), ['cover.a'], { endTime });

    expect(callService).toHaveBeenCalledTimes(1);
    const [domain, service, data, target] = callService.mock.calls[0];
    expect(domain).toBe(INTEGRATION_DOMAIN);
    expect(service).toBe('engage_manual_override');
    expect(target).toEqual({ entity_id: ['cover.a'] });

    const sent = (data as { end_time: string }).end_time;
    // services.yaml:203-205 — a naive string is silently treated as UTC.
    expect(sent).toMatch(/(Z|[+-]\d{2}:\d{2})$/);
    // TZ-agnostic: the wire value must denote the same instant we asked for.
    expect(new Date(sent).getTime()).toBe(endTime.getTime());
  });

  it('sends duration as the HA duration selector shape when no end_time is given', () => {
    const callService = vi.fn();
    engageManualOverride(hassWithEngage(callService), ['cover.a'], { duration: 1800 });
    expect(callService).toHaveBeenCalledTimes(1);
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'engage_manual_override',
      { duration: { seconds: 1800 } },
      { entity_id: ['cover.a'] },
    );
  });

  it('sends only end_time when both are given — never relies on the tie-break', () => {
    const callService = vi.fn();
    const endTime = new Date('2026-07-16T18:45:00Z');
    engageManualOverride(hassWithEngage(callService), ['cover.a'], { endTime, duration: 1800 });
    expect(callService).toHaveBeenCalledTimes(1);
    const data = callService.mock.calls[0][2] as Record<string, unknown>;
    expect(Object.keys(data)).toEqual(['end_time']);
    expect(data).not.toHaveProperty('duration');
  });

  it('no-ops when neither end_time nor duration is given', () => {
    const callService = vi.fn();
    engageManualOverride(hassWithEngage(callService), ['cover.a'], {});
    expect(callService).not.toHaveBeenCalled();
  });

  it('targets every managed cover, not just the first', () => {
    const callService = vi.fn();
    engageManualOverride(hassWithEngage(callService), ['cover.a', 'cover.b', 'cover.c'], {
      endTime: new Date('2026-07-16T18:45:00Z'),
    });
    expect(callService.mock.calls[0][3]).toEqual({
      entity_id: ['cover.a', 'cover.b', 'cover.c'],
    });
  });
});
