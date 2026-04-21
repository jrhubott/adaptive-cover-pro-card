import { describe, it, expect } from 'vitest';
import {
  formatPercent,
  formatDegrees,
  formatClock,
  formatDuration,
  countdownTo,
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
});
