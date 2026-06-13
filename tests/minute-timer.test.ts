import { describe, it, expect, vi, afterEach } from 'vitest';
import { startMinuteTimer } from '../src/lib/minute-timer';

describe('startMinuteTimer', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('aligns the first call to the next minute boundary, then fires every minute', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-13T10:00:20.000Z')); // 20s past a boundary
    const cb = vi.fn();
    const cancel = startMinuteTimer(cb);

    vi.advanceTimersByTime(39_000); // → :59, not yet the boundary
    expect(cb).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1_000); // → the boundary (40s after start)
    expect(cb).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(60_000);
    expect(cb).toHaveBeenCalledTimes(2);
    vi.advanceTimersByTime(120_000);
    expect(cb).toHaveBeenCalledTimes(4);

    cancel();
    vi.advanceTimersByTime(180_000);
    expect(cb).toHaveBeenCalledTimes(4); // nothing fires after cancel
  });

  it('fires a full minute later when started exactly on a boundary', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-13T10:00:00.000Z'));
    const cb = vi.fn();
    startMinuteTimer(cb);
    vi.advanceTimersByTime(59_000);
    expect(cb).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1_000);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('cancel before the first boundary fires nothing', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-13T10:00:20.000Z'));
    const cb = vi.fn();
    const cancel = startMinuteTimer(cb);
    cancel();
    vi.advanceTimersByTime(120_000);
    expect(cb).not.toHaveBeenCalled();
  });
});
