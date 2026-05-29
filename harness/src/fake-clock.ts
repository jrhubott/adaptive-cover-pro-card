/**
 * Date shim that lets the harness pin `new Date()` and `Date.now()` to a
 * harness-configured "now". The cards compute sun-path / day samples from
 * `startOfDay()` (which calls `new Date()` with no args). Without this shim
 * the path is drawn for the real wall-clock day, not the harness's date —
 * so a winter-morning preset gets a summer sun arc behind a winter sun dot.
 *
 * `new Date(...)` with arguments and all instance methods are unaffected —
 * we extend the native Date class. Static methods like `Date.UTC` and
 * `Date.parse` are inherited.
 */

const NativeDate = Date;
let frozenNowMs: number | null = null;
let installed = false;

// Match every Date constructor overload so spread typing resolves cleanly.
type DateCtorArgs =
  | []
  | [number]
  | [string]
  | [Date]
  | [number, number]
  | [number, number, number]
  | [number, number, number, number]
  | [number, number, number, number, number]
  | [number, number, number, number, number, number]
  | [number, number, number, number, number, number, number];

class HarnessDate extends NativeDate {
  constructor(...args: DateCtorArgs) {
    if (args.length === 0) {
      super(frozenNowMs ?? NativeDate.now());
    } else {
      super(...(args as [number, number, number, number, number, number, number]));
    }
  }

  static now(): number {
    return frozenNowMs ?? NativeDate.now();
  }
}

export function setFakeNow(ms: number): void {
  frozenNowMs = ms;
  if (!installed) {
    globalThis.Date = HarnessDate as unknown as DateConstructor;
    installed = true;
  }
}

export function clearFakeNow(): void {
  frozenNowMs = null;
  if (installed) {
    globalThis.Date = NativeDate;
    installed = false;
  }
}

export function getFakeNow(): number | null {
  return frozenNowMs;
}
