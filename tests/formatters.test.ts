import { describe, it, expect } from 'vitest';
import {
  formatPercent,
  formatDegrees,
  formatClock,
  formatDuration,
  countdownTo,
  formatCoverState,
  nextAllowedIso,
  isUnavailable,
  isOffline,
} from '../src/lib/formatters';

describe('formatters', () => {
  it('formatPercent rounds to int', () => {
    expect(formatPercent(42.6)).toBe('43%');
    expect(formatPercent(0)).toBe('0%');
    expect(formatPercent(100)).toBe('100%');
  });

  it('formatPercent returns em-dash for nullish', () => {
    expect(formatPercent(null)).toBe('—');
    expect(formatPercent(undefined)).toBe('—');
    expect(formatPercent(NaN)).toBe('—');
  });

  it('formatDegrees uses one decimal and degree sign', () => {
    expect(formatDegrees(180.456)).toBe('180.5°');
    expect(formatDegrees(-0.0)).toBe('0.0°');
  });

  it('formatClock parses ISO and returns a clock-style string', () => {
    const s = formatClock('2026-01-01T14:30:00Z');
    expect(s).toMatch(/\d{1,2}:\d{2}/);
  });

  it('formatClock handles bad input', () => {
    expect(formatClock(null)).toBe('—');
    expect(formatClock('nonsense')).toBe('—');
  });

  it('formatClock honours an explicit timeZone', () => {
    const iso = '2026-01-01T14:30:00Z';
    // Same instant, two zones → different clock strings (NY UTC-5, Tokyo UTC+9).
    // Assert format-agnostically (locale may be 12h or 24h) — just that the zone
    // shifts the result and both are valid clock strings.
    const ny = formatClock(iso, 'America/New_York');
    const tokyo = formatClock(iso, 'Asia/Tokyo');
    expect(ny).toMatch(/\d{1,2}:\d{2}/);
    expect(tokyo).toMatch(/\d{1,2}:\d{2}/);
    expect(ny).not.toBe(tokyo);
  });

  it('formatDuration handles seconds/minutes/hours', () => {
    expect(formatDuration(30)).toBe('30s');
    expect(formatDuration(90)).toBe('1m 30s');
    expect(formatDuration(3660)).toBe('1h 1m');
  });

  it('countdownTo expired returns "expired"', () => {
    const past = new Date(Date.now() - 1000).toISOString();
    expect(countdownTo(past)).toBe('expired');
  });

  it('countdownTo future returns a duration', () => {
    const future = new Date(Date.now() + 90_000).toISOString();
    expect(countdownTo(future)).toMatch(/^(1m|89s|90s)/);
  });

  describe('formatCoverState', () => {
    it('prefers hass.formatEntityState when present', () => {
      const hass = {
        states: { 'cover.x': { state: 'open' } },
        formatEntityState: (s: unknown): string => `FMT:${(s as { state: string }).state}`,
      };
      expect(formatCoverState(hass, 'cover.x')).toBe('FMT:open');
    });

    it('falls back to hass.localize with the cover state translation key', () => {
      const calls: string[] = [];
      const hass = {
        states: { 'cover.x': { state: 'opening' } },
        localize: (key: string): string => {
          calls.push(key);
          return key.endsWith('opening') ? 'Opening' : '';
        },
      };
      expect(formatCoverState(hass, 'cover.x')).toBe('Opening');
      expect(calls[0]).toBe('component.cover.entity_component._.state.opening');
    });

    it('falls back to capitalizing the raw state when no localizer is present', () => {
      const hass = { states: { 'cover.x': { state: 'closed' } } };
      expect(formatCoverState(hass, 'cover.x')).toBe('Closed');
    });

    it('localizes an override state instead of the entity state when given', () => {
      // No-feedback covers report a final `open`/`closed` state while mid-move;
      // the transit direction is passed as an override so the readout reads
      // "Opening"/"Closing" the same way a real position cover does.
      const hass = { states: { 'cover.x': { state: 'open' } } };
      expect(formatCoverState(hass, 'cover.x', 'opening')).toBe('Opening');
      expect(formatCoverState(hass, 'cover.x', 'closing')).toBe('Closing');
    });

    it('passes the override state through hass.formatEntityState', () => {
      const hass = {
        states: { 'cover.x': { state: 'closed', attributes: { device_class: 'shade' } } },
        formatEntityState: (s: unknown): string => `FMT:${(s as { state: string }).state}`,
      };
      expect(formatCoverState(hass, 'cover.x', 'opening')).toBe('FMT:opening');
    });

    it('returns null for missing entity, missing state, unknown or unavailable', () => {
      const hass = {
        states: {
          'cover.unknown': { state: 'unknown' },
          'cover.unavailable': { state: 'unavailable' },
        },
      };
      expect(formatCoverState(hass, undefined)).toBeNull();
      expect(formatCoverState(undefined, 'cover.x')).toBeNull();
      expect(formatCoverState(hass, 'cover.missing')).toBeNull();
      expect(formatCoverState(hass, 'cover.unknown')).toBeNull();
      expect(formatCoverState(hass, 'cover.unavailable')).toBeNull();
    });
  });

  describe('isUnavailable', () => {
    it('is true for "unavailable"', () => {
      expect(isUnavailable('unavailable')).toBe(true);
    });

    it('is true for "unknown"', () => {
      expect(isUnavailable('unknown')).toBe(true);
    });

    it('is false for real cover states', () => {
      expect(isUnavailable('open')).toBe(false);
      expect(isUnavailable('closed')).toBe(false);
      expect(isUnavailable('closing')).toBe(false);
      expect(isUnavailable('some_arbitrary_state')).toBe(false);
    });

    it('treats a missing state as unavailable', () => {
      expect(isUnavailable(undefined)).toBe(true);
      expect(isUnavailable(null)).toBe(true);
      expect(isUnavailable('')).toBe(true);
    });
  });

  describe('isOffline', () => {
    it('is true for "unavailable"', () => {
      expect(isOffline('unavailable')).toBe(true);
    });

    it('treats a missing state as offline', () => {
      expect(isOffline(undefined)).toBe(true);
      expect(isOffline(null)).toBe(true);
      expect(isOffline('')).toBe(true);
    });

    it('is false for "unknown" — a no-feedback cover is still controllable', () => {
      expect(isOffline('unknown')).toBe(false);
    });

    it('is false for real cover states', () => {
      expect(isOffline('open')).toBe(false);
      expect(isOffline('closed')).toBe(false);
    });
  });

  describe('nextAllowedIso', () => {
    it('adds the threshold minutes to the timestamp and returns ISO', () => {
      expect(nextAllowedIso('2026-06-16T12:00:00Z', 15)).toBe('2026-06-16T12:15:00.000Z');
    });

    it('returns null for an invalid timestamp', () => {
      expect(nextAllowedIso('not-a-date', 15)).toBeNull();
    });

    it('returns null when minutes is NaN or missing', () => {
      expect(nextAllowedIso('2026-06-16T12:00:00Z', Number.NaN)).toBeNull();
      expect(nextAllowedIso('2026-06-16T12:00:00Z', undefined)).toBeNull();
    });

    it('returns null when the timestamp is missing', () => {
      expect(nextAllowedIso(undefined, 15)).toBeNull();
      expect(nextAllowedIso(null, 15)).toBeNull();
    });
  });
});
