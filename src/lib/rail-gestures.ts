import type { ReactiveController, ReactiveControllerHost } from 'lit';

import { axisDisplayValue, type ResolvedAxis } from './axes';

/**
 * The drag-to-set contract every position rail shares, as a Lit reactive
 * controller.
 *
 * Four surfaces render a draggable track — `acp-cover-bar`, `acp-axis-bar`, the
 * cover tile's `_posBar` and the group tile's `pos-slider` — and each had
 * hand-rolled the same four behaviors: clientX → axis value, a pointer-captured
 * live preview, the tap-versus-drag commit rule, and the WAI-ARIA slider key
 * map. Four copies had already drifted apart at the rounding tie-break (see
 * {@link RailGestures.valueFromEvent}), which is what this exists to stop.
 *
 * Shaped after `pending-move.ts`'s `PendingMoves`, deliberately: keyed and
 * pull-based, with no callbacks. The host asks what the preview is while
 * rendering and routes its own service call when the gesture commits, so
 * `hass.callService` routing stays where it already lives and every commit
 * keeps the render-scope context a callback could not reach — the group's
 * snapshot, the tile's per-row cover id, the axis bar's `acp-tilt-set`.
 *
 * Keyed because a multi-rail tile drags one row at a time and every other row
 * must ignore the gesture; single-track hosts pass a constant key, the same
 * convention `PendingMoves.PENDING_KEY` uses. At most ONE gesture is in flight
 * at a time, which is exactly what a single `_dragPreview` object gave before.
 *
 * Axis geometry arrives per CALL rather than in the constructor: the tile and
 * the cover bar thread a per-row `ResolvedAxis`, `acp-axis-bar`'s min/max are
 * mutable reactive properties, and the group tile resolves its axis at event
 * time. Constructor-frozen geometry would go stale or be wrong per row. The
 * constructor holds behavioral policy only.
 *
 * Not to be confused with `rail-model.ts`, which is about rail IDENTITY (which
 * cover a row stands for) and has nothing to do with gestures.
 */

/** The slice of {@link ResolvedAxis} the gesture math needs. Structural, so
 *  `acp-axis-bar` satisfies it from its own reactive properties. */
export type RailAxis = Pick<ResolvedAxis, 'min' | 'max' | 'openBlocksSun'>;

export interface RailGesturesOptions {
  /**
   * `'click'` (default): the preview starts on contact and the commit rides the
   * browser's trailing compatibility `click`, so {@link RailGestures.pointerUp}
   * never returns a value. This is rails 1–3.
   *
   * `'release'`: `pointerUp()` returns the dragged value once the threshold was
   * crossed, and the host's own `click` handler must do nothing but stop
   * propagation. A tap is then a no-op — see {@link dragThresholdPx}.
   */
  commitOn?: 'click' | 'release';
  /**
   * Horizontal pixels the pointer must travel before the gesture counts as a
   * deliberate drag. Below it there is NO preview and no commit. Only
   * meaningful with `commitOn: 'release'`; defaults to 0, which makes the
   * gesture a drag from the moment of contact.
   */
  dragThresholdPx?: number;
}

interface Gesture {
  key: string;
  /** Pointer x at contact, for the threshold test. */
  downX: number;
  /** Has this gesture travelled far enough to count as a drag? */
  moved: boolean;
  /** Live LOGICAL value under the finger, or null while below the threshold. */
  value: number | null;
}

export class RailGestures implements ReactiveController {
  private readonly host: ReactiveControllerHost;
  private readonly commitOn: 'click' | 'release';
  private readonly dragThresholdPx: number;
  private gesture: Gesture | null = null;

  constructor(host: ReactiveControllerHost, options: RailGesturesOptions = {}) {
    this.host = host;
    this.commitOn = options.commitOn ?? 'click';
    this.dragThresholdPx = options.dragThresholdPx ?? 0;
    host.addController(this);
  }

  // ── pure value math ────────────────────────────────────────────────────────

  /**
   * The LOGICAL axis value a pointer is sitting on.
   *
   * Rounds in DRAWN units, clamps to the track, and only then un-draws through
   * {@link axisDisplayValue}. That order is the settled tie-break: the three
   * position rails rounded the drawn percentage and mirrored the result, while
   * `acp-axis-bar` mirrored the fraction and rounded that, and the two disagree
   * by one unit at an exact half-unit pointer position on a mirrored axis. This
   * is the three-rail idiom, generalized to a range that is not 0–100.
   */
  public valueFromEvent(e: { clientX: number }, track: HTMLElement, axis: RailAxis): number {
    const rect = track.getBoundingClientRect();
    // A zero-width track would otherwise emit NaN into a CSS width and a
    // service call. Nothing has been laid out yet, so the track start is the
    // only honest answer.
    const frac = rect.width === 0 ? 0 : (e.clientX - rect.left) / rect.width;
    const drawn = Math.round(axis.min + frac * (axis.max - axis.min));
    return axisDisplayValue(Math.max(axis.min, Math.min(axis.max, drawn)), axis);
  }

  /**
   * The WAI-ARIA slider key map: arrows step 1, Page keys step 10, Home/End
   * jump to the ends of the DRAWN track.
   *
   * Expressed in the LOGICAL frame with a signed step, so the fill always moves
   * the way the key points and the value handed back is ready for a service
   * call. Home/End name the ends of the TRACK, which on a mirrored axis puts
   * Home on the axis maximum. `current` null steps from the drawn-EMPTY end —
   * starting from `min` there is the FULL end, and one rightward key used to
   * redraw an empty rail as completely full.
   *
   * Returns null for a key it does not handle, and calls `preventDefault()`
   * only on the ones it does.
   */
  public keydownValue(e: KeyboardEvent, current: number | null, axis: RailAxis): number | null {
    const step = axis.openBlocksSun ? 1 : -1;
    const trackStart = axis.openBlocksSun ? axis.min : axis.max;
    const trackEnd = axis.openBlocksSun ? axis.max : axis.min;
    const base = current ?? trackStart;
    let next: number;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = base + step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = base - step;
        break;
      case 'PageUp':
        next = base + 10 * step;
        break;
      case 'PageDown':
        next = base - 10 * step;
        break;
      case 'Home':
        next = trackStart;
        break;
      case 'End':
        next = trackEnd;
        break;
      default:
        return null;
    }
    e.preventDefault();
    return Math.max(axis.min, Math.min(axis.max, Math.round(next)));
  }

  // ── gesture lifecycle ──────────────────────────────────────────────────────

  /**
   * Begin a gesture. Captures the pointer best-effort — happy-dom does not
   * implement it — and deliberately never calls `preventDefault()`: suppressing
   * it would also suppress the trailing compatibility `click` the `'click'`
   * commit path depends on.
   */
  public pointerDown(e: PointerEvent, key: string, axis: RailAxis): void {
    const track = e.currentTarget as HTMLElement;
    (track as HTMLElement & { setPointerCapture?: (id: number) => void }).setPointerCapture?.(
      e.pointerId,
    );
    this.gesture = { key, downX: e.clientX, moved: false, value: null };
    this.track(e, axis);
  }

  /** Follow the finger. A no-op for any key other than the one that owns the
   *  gesture in flight, and — below the drag threshold — for that one too. */
  public pointerMove(e: PointerEvent, key: string, axis: RailAxis): void {
    if (this.gesture?.key !== key) return;
    this.track(e, axis);
  }

  /**
   * End the gesture, and in `'release'` mode hand back the value to commit.
   *
   * Null in `'click'` mode always — the trailing `click` commits there — and
   * null in `'release'` mode for a gesture that never passed the threshold,
   * which is what makes a tap a no-op.
   */
  public pointerUp(key: string): number | null {
    if (this.gesture?.key !== key) return null;
    // Null unless the gesture became a drag, so this needs no `moved` re-test.
    const value = this.gesture.value;
    this.clear();
    return this.commitOn === 'release' ? value : null;
  }

  /** Abandon the gesture. Never commits, whatever it had travelled. */
  public pointerCancel(key: string): void {
    if (this.gesture?.key !== key) return;
    this.clear();
  }

  // ── render-side reads ──────────────────────────────────────────────────────

  /** The live LOGICAL drag value for this key, or null when it is not the key
   *  being dragged (or the gesture has not passed the threshold). */
  public preview(key: string): number | null {
    return this.gesture?.key === key ? this.gesture.value : null;
  }

  /** Is this key painting a live preview? Drives the `.dragging` class and the
   *  fill override. */
  public isDragging(key: string): boolean {
    return this.preview(key) !== null;
  }

  /** Is a gesture in flight on this key, INCLUDING one still below the drag
   *  threshold? The group rail stops propagation on the strength of this, so it
   *  has to be true for a gesture that is not previewing anything yet. */
  public isActive(key: string): boolean {
    return this.gesture?.key === key;
  }

  public hostDisconnected(): void {
    this.clear();
  }

  private track(e: PointerEvent, axis: RailAxis): void {
    const g = this.gesture;
    if (!g) return;
    // Horizontal only: a finger sliding down the rail has not chosen a value.
    if (Math.abs(e.clientX - g.downX) >= this.dragThresholdPx) g.moved = true;
    if (!g.moved) return;
    const value = this.valueFromEvent(e, e.currentTarget as HTMLElement, axis);
    if (value === g.value) return;
    g.value = value;
    this.host.requestUpdate();
  }

  private clear(): void {
    // Only a gesture that was actually painting a preview leaves anything to
    // repaint — a tap below the threshold never changed the render.
    const painting = this.gesture !== null && this.gesture.value !== null;
    this.gesture = null;
    if (painting) this.host.requestUpdate();
  }
}
