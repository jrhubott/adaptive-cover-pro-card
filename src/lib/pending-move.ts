import type { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * The "moving to" indicator's shared rules.
 *
 * Setting a position by tap, drag or arrow key returns immediately, but the
 * cover takes seconds to get there — and every rail draws the LIVE value, so
 * the moment the drag preview is released the rail snaps back to where the
 * cover still is and the number the user just chose disappears. The command is
 * in flight with nothing on screen to say so.
 *
 * The integration does publish a per-cover command target, but only once it has
 * dispatched (adaptive-cover-pro#1158), so it arrives late and is absent for a
 * cover skipped as `same_position`. This is the OPTIMISTIC local record
 * instead: the value this card just sent, held by the surface that sent it.
 *
 * Three rails render position tracks — `acp-axis-bar`, the cover tile's
 * `_posBar`, the group tile's `pos-slider` — so the arrival rule and the band
 * geometry live here rather than three times over.
 */

/**
 * How long a pending move survives without the cover reporting arrival.
 *
 * Required, not belt-and-braces: a no-feedback / assumed-state cover (a Somfy
 * RTS awning) never publishes a position at all, so an arrival-only rule would
 * pin its indicator on screen forever. Generous enough for a slow shade to
 * finish travelling first.
 */
export const PENDING_MOVE_TIMEOUT_MS = 60_000;

/**
 * How close counts as arrived, in axis units.
 *
 * Not zero: covers routinely stop a percent or two off the commanded value
 * (interpolation, routing to a coarser step, or a motor that reports 39 for a
 * commanded 40), and an exact-match rule would leave the indicator up until the
 * timeout on every one of those moves.
 */
export const PENDING_MOVE_TOLERANCE = 2;

/** Has the cover reached the value we sent it to? Unknown position → no: an
 *  unreported cover has not arrived, it is simply silent, and the timeout is
 *  what ends its indicator. */
export function hasArrivedAt(live: number | null | undefined, pending: number): boolean {
  if (live === null || live === undefined || Number.isNaN(live)) return false;
  return Math.abs(live - pending) <= PENDING_MOVE_TOLERANCE;
}

/** Is this pending move still worth drawing against the current live value? */
export function isPendingVisible(live: number | null | undefined, pending: number | null): boolean {
  return pending !== null && !hasArrivedAt(live, pending);
}

/**
 * The travel band, in DRAWN track percentages.
 *
 * Both inputs are already mapped through the rail's own polarity, so this is
 * pure geometry and works unchanged on a mirrored axis: the band simply spans
 * from wherever the fill ends to wherever the commanded marker sits, in
 * whichever order they fall.
 */
export function travelBand(liveFrac: number, pendingFrac: number): { left: number; width: number } {
  return {
    left: Math.min(liveFrac, pendingFrac),
    width: Math.abs(pendingFrac - liveFrac),
  };
}

/** HA cover states that mean the cover is travelling under its own steam —
 *  which is how an AUTOMATIC move announces itself. There is no command echo to
 *  latch onto for those: the pipeline moved the cover without this card asking,
 *  so the only evidence is the entity saying it is in motion. */
const MOVING_STATES: ReadonlySet<string> = new Set(['opening', 'closing']);

export function isMovingState(state: string | null | undefined): boolean {
  return !!state && MOVING_STATES.has(state);
}

/**
 * Per-key pending moves, as a Lit reactive controller.
 *
 * Four surfaces render position rails — `acp-cover-bar`, `acp-axis-bar`, the
 * cover tile's `_posBar`, the group tile's `pos-slider` — and each needs the
 * same three things: remember what was just commanded, retire it on arrival,
 * and give up after a timeout. Hand-rolling that per component was three
 * near-identical copies of timer bookkeeping before this existed, and the
 * fourth would have been a fourth.
 *
 * Keyed because a multi-rail tile can have several covers in flight at once and
 * each rail must show only its own destination. Single-rail hosts pass a
 * constant key.
 */
export class PendingMoves implements ReactiveController {
  private readonly host: ReactiveControllerHost;
  private moves = new Map<string, number>();
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  /** Record what a rail was just told to do, and start its expiry. */
  public start(key: string, value: number): void {
    const existing = this.timers.get(key);
    if (existing) clearTimeout(existing);
    this.moves.set(key, value);
    this.timers.set(
      key,
      setTimeout(() => this.clear(key), PENDING_MOVE_TIMEOUT_MS),
    );
    this.host.requestUpdate();
  }

  public get(key: string): number | null {
    return this.moves.get(key) ?? null;
  }

  public clear(key: string): void {
    const timer = this.timers.get(key);
    if (timer) clearTimeout(timer);
    this.timers.delete(key);
    if (this.moves.delete(key)) this.host.requestUpdate();
  }

  /**
   * Retire every move whose cover has arrived.
   *
   * Call from `updated()`, never from `render()`: dropping a move requests
   * another update, and asking for one from inside a render is the
   * update-during-update Lit warns about.
   */
  public settle(liveFor: (key: string) => number | null | undefined): void {
    for (const [key, value] of [...this.moves]) {
      if (hasArrivedAt(liveFor(key), value)) this.clear(key);
    }
  }

  public hostDisconnected(): void {
    for (const timer of this.timers.values()) clearTimeout(timer);
    this.timers.clear();
    this.moves.clear();
  }
}
