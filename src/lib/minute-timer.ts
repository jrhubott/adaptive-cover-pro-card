/**
 * Invoke `cb` on every wall-clock minute boundary.
 *
 * The first call is aligned to the next `:00` second (so a displayed HH:MM flips when the
 * real minute changes, not up to 59 s late), then it repeats every 60 s. Used to advance
 * the "now" cursors, which are otherwise only repainted when a watched sensor changes.
 *
 * Returns a teardown that cancels the pending alignment timeout and the interval. Safe to
 * call more than once.
 */
export function startMinuteTimer(cb: () => void): () => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let interval: ReturnType<typeof setInterval> | null = null;

  const msToNextMinute = 60_000 - (Date.now() % 60_000);
  timeout = setTimeout(() => {
    timeout = null;
    cb();
    interval = setInterval(cb, 60_000);
  }, msToNextMinute);

  return () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
  };
}
