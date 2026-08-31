import { describe, it, expect, vi, type Mock } from 'vitest';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { RailGestures, type RailAxis, type RailGesturesOptions } from '../src/lib/rail-gestures';

const identity: RailAxis = { min: 0, max: 100, openBlocksSun: true };
const mirrored: RailAxis = { min: 0, max: 100, openBlocksSun: false };
const slatIdentity: RailAxis = { min: -90, max: 90, openBlocksSun: true };
const slat: RailAxis = { min: -90, max: 90, openBlocksSun: false };

type ControllerFn = (controller: ReactiveController) => void;

interface FakeHost extends ReactiveControllerHost {
  requestUpdate: Mock<() => void>;
  addController: Mock<ControllerFn>;
}

function makeHost(): FakeHost {
  return {
    addController: vi.fn<ControllerFn>(),
    removeController: vi.fn<ControllerFn>(),
    requestUpdate: vi.fn<() => void>(),
    updateComplete: Promise.resolve(true),
  };
}

type FakeTrack = HTMLElement & { setPointerCapture: Mock<(pointerId: number) => void> };

/** A track whose rect maps clientX 1:1 onto track percent by default. */
function makeTrack(left = 0, width = 100): FakeTrack {
  return {
    getBoundingClientRect: () => ({
      left,
      width,
      top: 0,
      bottom: 8,
      right: left + width,
      height: 8,
    }),
    setPointerCapture: vi.fn<(pointerId: number) => void>(),
  } as unknown as FakeTrack;
}

function makeRail(options?: RailGesturesOptions): {
  rail: RailGestures;
  host: FakeHost;
  track: FakeTrack;
} {
  const host = makeHost();
  const track = makeTrack();
  return { rail: new RailGestures(host, options), host, track };
}

/** The controller reads only `clientX`, `pointerId` and `currentTarget`, so a
 *  plain literal stands in for a dispatched PointerEvent. */
const ptr = (clientX: number, track: HTMLElement): PointerEvent =>
  ({ clientX, pointerId: 1, currentTarget: track }) as unknown as PointerEvent;

const kbd = (key: string): KeyboardEvent & { preventDefault: Mock<() => void> } =>
  ({ key, preventDefault: vi.fn<() => void>() }) as unknown as KeyboardEvent & {
    preventDefault: Mock<() => void>;
  };

describe('RailGestures — construction', () => {
  it('registers itself with the host, like PendingMoves', () => {
    const host = makeHost();
    const rail = new RailGestures(host);
    expect(host.addController).toHaveBeenCalledWith(rail);
  });
});

describe('RailGestures.valueFromEvent', () => {
  it('reads a 0–100 identity axis straight off the track', () => {
    const { rail, track } = makeRail();
    expect(rail.valueFromEvent(ptr(80, track), track, identity)).toBe(80);
    expect(rail.valueFromEvent(ptr(0, track), track, identity)).toBe(0);
  });

  it('un-draws a mirrored 0–100 axis so the commit is the logical value', () => {
    const { rail, track } = makeRail();
    expect(rail.valueFromEvent(ptr(80, track), track, mirrored)).toBe(20);
    expect(rail.valueFromEvent(ptr(0, track), track, mirrored)).toBe(100);
  });

  it('maps through min/max on a non-0–100 axis', () => {
    const { rail, track } = makeRail();
    expect(rail.valueFromEvent(ptr(75, track), track, slatIdentity)).toBe(45);
    expect(rail.valueFromEvent(ptr(75, track), track, slat)).toBe(-45);
    expect(rail.valueFromEvent(ptr(50, track), track, slatIdentity)).toBe(0);
  });

  it('honours the track offset, not just its width', () => {
    const { rail } = makeRail();
    const track = makeTrack(20, 200);
    // 120 is 100px into a 200px track → 50%.
    expect(rail.valueFromEvent(ptr(120, track), track, identity)).toBe(50);
  });

  it('clamps a pointer that runs off either end of the track', () => {
    const { rail, track } = makeRail();
    expect(rail.valueFromEvent(ptr(-20, track), track, identity)).toBe(0);
    expect(rail.valueFromEvent(ptr(130, track), track, identity)).toBe(100);
    expect(rail.valueFromEvent(ptr(-20, track), track, mirrored)).toBe(100);
    expect(rail.valueFromEvent(ptr(130, track), track, mirrored)).toBe(0);
  });

  it('rounds in DRAWN units then mirrors — the settled tie-break at an exact half unit', () => {
    // The four rails disagreed here and only here: rails 1/3/4 rounded the drawn
    // percentage and mirrored the result (100 − round(62.5) = 37), while
    // `acp-axis-bar` mirrored the fraction and rounded that (round(100 − 62.5)
    // = 38). The three-rail idiom wins, so an `acp-axis-bar` pointer commit on a
    // mirrored axis can shift by one unit at an exact half-unit position. That
    // is a decision, and this is where it is written down.
    const { rail, track } = makeRail();
    expect(rail.valueFromEvent(ptr(62.5, track), track, mirrored)).toBe(37);
    expect(rail.valueFromEvent(ptr(62.5, track), track, identity)).toBe(63);
  });

  it('survives a zero-width track without emitting NaN', () => {
    const { rail } = makeRail();
    const track = makeTrack(0, 0);
    expect(rail.valueFromEvent(ptr(0, track), track, identity)).toBe(0);
  });
});

describe('RailGestures.keydownValue', () => {
  it.each([
    ['ArrowRight', 36],
    ['ArrowUp', 36],
    ['ArrowLeft', 34],
    ['ArrowDown', 34],
    ['PageUp', 45],
    ['PageDown', 25],
    ['Home', 0],
    ['End', 100],
  ])('steps %s from 35 to %i on an identity axis', (key, expected) => {
    const { rail } = makeRail();
    expect(rail.keydownValue(kbd(key), 35, identity)).toBe(expected);
  });

  it('steps in the DRAWN direction on a mirrored axis', () => {
    const { rail } = makeRail();
    // The fill moves the way the key points, so a rightward key LOWERS the
    // logical value on a blind.
    expect(rail.keydownValue(kbd('ArrowRight'), 35, mirrored)).toBe(34);
    expect(rail.keydownValue(kbd('ArrowLeft'), 35, mirrored)).toBe(36);
    expect(rail.keydownValue(kbd('PageUp'), 35, mirrored)).toBe(25);
    expect(rail.keydownValue(kbd('PageDown'), 35, mirrored)).toBe(45);
  });

  it('sends Home/End to the ends of the TRACK, not of the axis', () => {
    const { rail } = makeRail();
    expect(rail.keydownValue(kbd('Home'), 35, mirrored)).toBe(100);
    expect(rail.keydownValue(kbd('End'), 35, mirrored)).toBe(0);
    expect(rail.keydownValue(kbd('Home'), 0, slatIdentity)).toBe(-90);
    expect(rail.keydownValue(kbd('End'), 0, slatIdentity)).toBe(90);
    expect(rail.keydownValue(kbd('Home'), 0, slat)).toBe(90);
    expect(rail.keydownValue(kbd('End'), 0, slat)).toBe(-90);
  });

  it('steps from the drawn-EMPTY end when there is no current reading', () => {
    const { rail } = makeRail();
    // Starting from `min` on a mirrored axis is the FULL end, and one rightward
    // key redrew an empty rail as completely full.
    expect(rail.keydownValue(kbd('ArrowRight'), null, identity)).toBe(1);
    expect(rail.keydownValue(kbd('ArrowRight'), null, mirrored)).toBe(99);
    expect(rail.keydownValue(kbd('ArrowRight'), null, slatIdentity)).toBe(-89);
  });

  it('clamps a step to the axis range', () => {
    const { rail } = makeRail();
    expect(rail.keydownValue(kbd('PageUp'), 97, identity)).toBe(100);
    expect(rail.keydownValue(kbd('PageDown'), 3, identity)).toBe(0);
    expect(rail.keydownValue(kbd('ArrowLeft'), 100, mirrored)).toBe(100);
    expect(rail.keydownValue(kbd('PageUp'), 85, slatIdentity)).toBe(90);
  });

  it('returns null and leaves the event alone for a key it does not handle', () => {
    const { rail } = makeRail();
    for (const key of ['a', 'Enter', ' ', 'Tab', 'Escape']) {
      const e = kbd(key);
      expect(rail.keydownValue(e, 35, identity)).toBeNull();
      expect(e.preventDefault).not.toHaveBeenCalled();
    }
  });

  it('preventDefaults only the keys it claims', () => {
    const { rail } = makeRail();
    for (const key of [
      'ArrowRight',
      'ArrowLeft',
      'ArrowUp',
      'ArrowDown',
      'PageUp',
      'PageDown',
      'Home',
      'End',
    ]) {
      const e = kbd(key);
      rail.keydownValue(e, 35, identity);
      expect(e.preventDefault).toHaveBeenCalledTimes(1);
    }
  });
});

describe("RailGestures — 'click' commit lifecycle (rails 1–3)", () => {
  it('previews on contact and captures the pointer', () => {
    const { rail, track } = makeRail();
    rail.pointerDown(ptr(80, track), 'a', identity);
    expect(track.setPointerCapture).toHaveBeenCalledWith(1);
    expect(rail.preview('a')).toBe(80);
    expect(rail.isDragging('a')).toBe(true);
    expect(rail.isActive('a')).toBe(true);
  });

  it('tolerates a track with no setPointerCapture (happy-dom)', () => {
    const { rail } = makeRail();
    const bare = {
      getBoundingClientRect: () => ({
        left: 0,
        width: 100,
        top: 0,
        bottom: 8,
        right: 100,
        height: 8,
      }),
    } as unknown as HTMLElement;
    expect(() => rail.pointerDown(ptr(40, bare), 'a', identity)).not.toThrow();
    expect(rail.preview('a')).toBe(40);
  });

  it('updates the preview only for the key that owns the gesture', () => {
    const { rail, track } = makeRail();
    rail.pointerDown(ptr(80, track), 'a', identity);
    rail.pointerMove(ptr(30, track), 'a', identity);
    expect(rail.preview('a')).toBe(30);
    rail.pointerMove(ptr(10, track), 'b', identity);
    expect(rail.preview('a')).toBe(30);
    expect(rail.preview('b')).toBeNull();
    expect(rail.isDragging('b')).toBe(false);
    expect(rail.isActive('b')).toBe(false);
  });

  it('ignores a move with no gesture in flight', () => {
    const { rail, track } = makeRail();
    rail.pointerMove(ptr(30, track), 'a', identity);
    expect(rail.preview('a')).toBeNull();
    expect(rail.isActive('a')).toBe(false);
  });

  it('never returns a commit value on release — the trailing click owns that', () => {
    const { rail, track } = makeRail();
    rail.pointerDown(ptr(80, track), 'a', identity);
    expect(rail.pointerUp('a')).toBeNull();
    expect(rail.preview('a')).toBeNull();
    expect(rail.isActive('a')).toBe(false);
  });

  it('leaves another key’s gesture alone on release', () => {
    const { rail, track } = makeRail();
    rail.pointerDown(ptr(80, track), 'a', identity);
    expect(rail.pointerUp('b')).toBeNull();
    expect(rail.preview('a')).toBe(80);
  });

  it('discards the gesture on pointercancel', () => {
    const { rail, track } = makeRail();
    rail.pointerDown(ptr(80, track), 'a', identity);
    rail.pointerCancel('b');
    expect(rail.preview('a')).toBe(80);
    rail.pointerCancel('a');
    expect(rail.preview('a')).toBeNull();
    expect(rail.isActive('a')).toBe(false);
  });

  it('stores the LOGICAL value, so a mirrored preview is un-drawn', () => {
    const { rail, track } = makeRail();
    rail.pointerDown(ptr(80, track), 'a', mirrored);
    expect(rail.preview('a')).toBe(20);
  });

  it('asks the host to re-render on every preview transition', () => {
    const { rail, host, track } = makeRail();
    rail.pointerDown(ptr(80, track), 'a', identity);
    expect(host.requestUpdate).toHaveBeenCalledTimes(1);
    rail.pointerMove(ptr(30, track), 'a', identity);
    expect(host.requestUpdate).toHaveBeenCalledTimes(2);
    // Same value under the finger: nothing to repaint.
    rail.pointerMove(ptr(30, track), 'a', identity);
    expect(host.requestUpdate).toHaveBeenCalledTimes(2);
    rail.pointerUp('a');
    expect(host.requestUpdate).toHaveBeenCalledTimes(3);
  });
});

describe("RailGestures — 'release' commit lifecycle with a drag threshold (rail 4)", () => {
  const opts: RailGesturesOptions = { commitOn: 'release', dragThresholdPx: 4 };

  it('starts a gesture on contact but previews nothing', () => {
    const { rail, track } = makeRail(opts);
    rail.pointerDown(ptr(50, track), 'group', identity);
    expect(track.setPointerCapture).toHaveBeenCalledWith(1);
    // Active — the host stops propagation on the strength of this — but not
    // dragging: previewing on contact showed a committed-looking flatten for a
    // tap that does nothing.
    expect(rail.isActive('group')).toBe(true);
    expect(rail.isDragging('group')).toBe(false);
    expect(rail.preview('group')).toBeNull();
  });

  it('previews nothing below the threshold and commits nothing on release', () => {
    const { rail, host, track } = makeRail(opts);
    rail.pointerDown(ptr(50, track), 'group', identity);
    rail.pointerMove(ptr(52, track), 'group', identity);
    expect(rail.preview('group')).toBeNull();
    expect(rail.isActive('group')).toBe(true);
    expect(rail.pointerUp('group')).toBeNull();
    expect(rail.isActive('group')).toBe(false);
    // Nothing render-visible ever changed.
    expect(host.requestUpdate).not.toHaveBeenCalled();
  });

  it('previews live once the pointer travels past the threshold', () => {
    const { rail, track } = makeRail(opts);
    rail.pointerDown(ptr(50, track), 'group', identity);
    rail.pointerMove(ptr(54, track), 'group', identity);
    expect(rail.preview('group')).toBe(54);
    expect(rail.isDragging('group')).toBe(true);
    // Once past it, the gesture stays a drag even coming back through the gate.
    rail.pointerMove(ptr(51, track), 'group', identity);
    expect(rail.preview('group')).toBe(51);
  });

  it('returns the dragged value on release and clears the gesture', () => {
    const { rail, track } = makeRail(opts);
    rail.pointerDown(ptr(50, track), 'group', identity);
    rail.pointerMove(ptr(80, track), 'group', identity);
    expect(rail.pointerUp('group')).toBe(80);
    expect(rail.preview('group')).toBeNull();
    expect(rail.isActive('group')).toBe(false);
  });

  it('measures the threshold horizontally only', () => {
    const { rail, track } = makeRail(opts);
    rail.pointerDown(ptr(50, track), 'group', identity);
    // A finger sliding straight down the rail has not chosen a new value.
    rail.pointerMove(
      { clientX: 50, clientY: 400, pointerId: 1, currentTarget: track } as unknown as PointerEvent,
      'group',
      identity,
    );
    expect(rail.preview('group')).toBeNull();
    expect(rail.pointerUp('group')).toBeNull();
  });

  it('commits nothing after a pointercancel, however far the drag travelled', () => {
    const { rail, track } = makeRail(opts);
    rail.pointerDown(ptr(50, track), 'group', identity);
    rail.pointerMove(ptr(90, track), 'group', identity);
    expect(rail.isDragging('group')).toBe(true);
    rail.pointerCancel('group');
    expect(rail.preview('group')).toBeNull();
    expect(rail.pointerUp('group')).toBeNull();
  });

  it('ignores a release keyed to a different rail', () => {
    const { rail, track } = makeRail(opts);
    rail.pointerDown(ptr(50, track), 'group', identity);
    rail.pointerMove(ptr(90, track), 'group', identity);
    expect(rail.pointerUp('other')).toBeNull();
    expect(rail.preview('group')).toBe(90);
  });

  it('returns the LOGICAL value on a mirrored axis', () => {
    const { rail, track } = makeRail(opts);
    rail.pointerDown(ptr(20, track), 'group', mirrored);
    rail.pointerMove(ptr(80, track), 'group', mirrored);
    expect(rail.preview('group')).toBe(20);
    expect(rail.pointerUp('group')).toBe(20);
  });
});

describe('RailGestures — teardown', () => {
  it('drops an in-flight gesture when the host disconnects', () => {
    const { rail, track } = makeRail();
    rail.pointerDown(ptr(80, track), 'a', identity);
    rail.hostDisconnected();
    expect(rail.preview('a')).toBeNull();
    expect(rail.isActive('a')).toBe(false);
    expect(rail.pointerUp('a')).toBeNull();
  });
});
