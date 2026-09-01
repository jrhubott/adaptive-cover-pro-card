import { describe, it, expect, beforeEach } from 'vitest';
import type { HomeAssistant } from 'custom-card-helpers';

import '../src/components/rail-track';
import type { RailTrack } from '../src/components/rail-track';
import type { RailAxis } from '../src/lib/rail-gestures';
import { _resetTooltipSingleton } from '../src/lib/tooltip';

/**
 * Direct tests for `<acp-rail-track>` — the one element the four position rails
 * compose (issue #271 Part 2). Everything here drives the element on its own,
 * with no surface around it, because the whole point of the merge is that the
 * container, the gesture wiring, the ARIA application and the fill/overlay
 * ordering are decided ONCE, here, instead of four times.
 *
 * Two hard rules this file keeps, both from prior breakage on these rails:
 *   - Every gesture enters through a real dispatched `PointerEvent` /
 *     `KeyboardEvent`. No test pokes a property or a private field to fake a
 *     drag — that is how the #260 readout tests kept passing after the state
 *     they asserted on had been deleted.
 *   - Nothing depends on CSS hit-testing (pointer-events, cursor, overlap).
 *     happy-dom has no hit-testing at all, so such a test could never fail;
 *     the stylesheet-string assertions at the bottom are the substitute.
 */

const hass = { states: {} } as unknown as HomeAssistant;

/** 0–100, un-mirrored: clientX maps 1:1 onto both drawn and logical units. */
const AXIS: RailAxis = { min: 0, max: 100, openBlocksSun: true };
/** A blind: the axis maximum is the fully-UNCOVERED end, so drawn 80 is
 *  logical 20. Every commit is asserted in the logical frame (#234). */
const MIRRORED: RailAxis = { min: 0, max: 100, openBlocksSun: false };
/** A slat angle: a range that is not 0–100, so a bare percentage is wrong. */
const SLAT: RailAxis = { min: -90, max: 90, openBlocksSun: true };

const RECT = { left: 0, width: 100, top: 0, bottom: 10, right: 100, height: 10 };

beforeEach(() => {
  _resetTooltipSingleton();
  document.body.innerHTML = '';
});

async function mount(props: Partial<RailTrack> = {}): Promise<RailTrack> {
  const el = document.createElement('acp-rail-track') as RailTrack;
  el.hass = hass;
  el.axis = AXIS;
  Object.assign(el, props);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

/** The interactive container: `.track` on the dialog variant, `.pos-slider` on
 *  the dense one. It is the node the gestures are wired to AND the node whose
 *  rect the pointer math measures, so it is the node every gesture test
 *  dispatches on. Throws rather than returning null so a markup change surfaces
 *  at the capture line instead of as a confusing null dereference later. */
function slider(el: RailTrack): HTMLElement {
  const node = el.shadowRoot!.querySelector('.track, .pos-slider');
  if (!node) throw new Error('acp-rail-track rendered no .track / .pos-slider container');
  return node as HTMLElement;
}

/** Stub the container rect so clientX maps 1:1 onto track percent. */
function stubRect(node: HTMLElement): HTMLElement {
  Object.defineProperty(node, 'getBoundingClientRect', { value: () => RECT, configurable: true });
  return node;
}

/** Flattened child order. `<slot>` has no class, so it names itself — the two
 *  order guards below have to see exactly where the decorations land. */
function childOrder(parent: Element): string[] {
  return Array.from(parent.children).map((c) => c.className || c.localName);
}

/** A component's stylesheet as one string; `styles` is an array here because
 *  the element composes the shared overlay + fill fragments. */
function sheetOf(ctor: unknown): string {
  const styles = (ctor as { styles: { cssText: string } | { cssText: string }[] }).styles;
  return Array.isArray(styles) ? styles.map((s) => s.cssText).join('\n') : styles.cssText;
}

const down = (x: number): PointerEvent =>
  new PointerEvent('pointerdown', { bubbles: true, clientX: x, pointerId: 1 });
const move = (x: number): PointerEvent =>
  new PointerEvent('pointermove', { bubbles: true, clientX: x, pointerId: 1 });
const up = (x: number): PointerEvent =>
  new PointerEvent('pointerup', { bubbles: true, clientX: x, pointerId: 1 });
const cancel = (): PointerEvent =>
  new PointerEvent('pointercancel', { bubbles: true, pointerId: 1 });
const click = (x: number): MouseEvent => new MouseEvent('click', { bubbles: true, clientX: x });

interface Recorder {
  sets: number[];
  previews: (number | null)[];
  /** Interleaved, so ordering between the two streams is assertable. */
  seen: string[];
}

function record(el: RailTrack): Recorder {
  const r: Recorder = { sets: [], previews: [], seen: [] };
  el.addEventListener('acp-rail-set', (e) => {
    const v = (e as CustomEvent<number>).detail;
    r.sets.push(v);
    r.seen.push(`set:${v}`);
  });
  el.addEventListener('acp-rail-preview', (e) => {
    const v = (e as CustomEvent<number | null>).detail;
    r.previews.push(v);
    r.seen.push(`preview:${v}`);
  });
  return r;
}

describe('acp-rail-track — markup shapes', () => {
  it('defaults to the dialog variant', async () => {
    const el = await mount();
    expect(el.variant).toBe('dialog');
  });

  it('dialog: renders one .track holding both fill segments', async () => {
    const el = await mount({
      variant: 'dialog',
      fillPct: 35,
      closedPct: 65,
      target: null,
      targetPct: 0,
    });
    const track = el.shadowRoot!.querySelector('.track') as HTMLElement;
    expect(track).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.pos-slider')).toBeNull();
    expect((track.querySelector('.fill') as HTMLElement).style.width).toBe('35%');
    expect((track.querySelector('.fill-closed') as HTMLElement).style.width).toBe('65%');
  });

  it('dialog: omits .fill-closed when the host passes no closedPct', async () => {
    const el = await mount({ variant: 'dialog', fillPct: 35, target: null, targetPct: 0 });
    expect(el.shadowRoot!.querySelector('.fill')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.fill-closed')).toBeNull();
  });

  it('dense: renders .pos-slider > .pos-bar with the prefixed single-segment fill', async () => {
    const el = await mount({ variant: 'dense', fillPct: 35, target: null, targetPct: 0 });
    const wrap = el.shadowRoot!.querySelector('.pos-slider') as HTMLElement;
    expect(wrap).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.track')).toBeNull();
    const bar = wrap.querySelector('.pos-bar') as HTMLElement;
    expect(bar).toBeTruthy();
    expect((bar.querySelector('.pos-fill') as HTMLElement).style.width).toBe('35%');
    expect(wrap.querySelector('.pos-fill-closed')).toBeNull();
  });

  it('draws the target marker, clamped, only when target is non-null', async () => {
    const shown = await mount({ variant: 'dense', fillPct: 40, target: 70, targetPct: 70 });
    expect(
      (shown.shadowRoot!.querySelector('.pos-marker') as HTMLElement).getAttribute('style'),
    ).toBe('left:clamp(1px, 70%, calc(100% - 1px))');
    const hidden = await mount({ variant: 'dense', fillPct: 40, target: null, targetPct: 70 });
    expect(hidden.shadowRoot!.querySelector('.pos-marker')).toBeNull();
  });

  it('draws the moving-to overlay only when both pending and pendingPct are non-null', async () => {
    const shown = await mount({
      variant: 'dense',
      fillPct: 40,
      target: null,
      targetPct: 0,
      pending: 60,
      pendingPct: 60,
    });
    expect(shown.shadowRoot!.querySelector('.pos-travel')).toBeTruthy();
    expect(
      (shown.shadowRoot!.querySelector('.pos-pending') as HTMLElement).getAttribute('style'),
    ).toBe('left:clamp(1px, 60%, calc(100% - 1px))');
    const hidden = await mount({ variant: 'dense', fillPct: 40, target: null, targetPct: 0 });
    expect(hidden.shadowRoot!.querySelector('.pos-travel')).toBeNull();
    expect(hidden.shadowRoot!.querySelector('.pos-pending')).toBeNull();
  });
});

// The reason this element exists at all: the layer order is decided HERE, once,
// instead of at four hand-written call sites. On the dense rails `.pos-fill`,
// `.pos-travel`/`.pos-pending` and `.pos-marker` are all `position: absolute`
// with `z-index: auto`, so DOM order IS paint order — a flip sinks the "moving
// to" indicator under the 55%-opaque fill (#272), which has already shipped
// once and nearly shipped a second time during Part 3's extraction. happy-dom
// has no paint model, so nothing but these arrays can catch it. Never weaken
// them to lengths or subsets.
describe('acp-rail-track — layer stacking order (#272 paint-order guard)', () => {
  it('dense: fill → travel → pip → decorations slot → marker, inside .pos-bar', async () => {
    const el = await mount({
      variant: 'dense',
      fillPct: 40,
      target: 70,
      targetPct: 70,
      pending: 60,
      pendingPct: 60,
    });
    const bar = el.shadowRoot!.querySelector('.pos-bar') as HTMLElement;
    expect(childOrder(bar)).toEqual([
      'pos-fill',
      'pos-travel',
      'pos-pending',
      'slot',
      'pos-marker',
    ]);
  });

  it('dialog: fill → closed → travel → pip → decorations slot → marker, inside .track', async () => {
    const el = await mount({
      variant: 'dialog',
      fillPct: 40,
      closedPct: 60,
      target: 70,
      targetPct: 70,
      pending: 60,
      pendingPct: 60,
    });
    const track = el.shadowRoot!.querySelector('.track') as HTMLElement;
    expect(childOrder(track)).toEqual([
      'fill',
      'fill-closed',
      'travel',
      'pending-marker',
      'slot',
      'marker',
    ]);
  });

  it('assigns default-slot light-DOM children to the decorations slot, in order', async () => {
    const el = await mount({ variant: 'dense', fillPct: 40, target: null, targetPct: 0 });
    const band = document.createElement('div');
    band.className = 'pos-band';
    const tick = document.createElement('div');
    tick.className = 'pos-tick';
    el.append(band, tick);
    await el.updateComplete;
    const slot = el.shadowRoot!.querySelector('.pos-bar > slot:not([name])') as HTMLSlotElement;
    expect(slot.assignedElements()).toEqual([band, tick]);
  });

  // #260: the readout bubble sits ABOVE the rail and would be clipped by
  // `.pos-bar`'s overflow, so its slot has to be a sibling of the bar, not a
  // child of it.
  it('dense: puts the readout slot inside .pos-slider but OUTSIDE .pos-bar (#260)', async () => {
    const el = await mount({ variant: 'dense', fillPct: 40, target: null, targetPct: 0 });
    const wrap = el.shadowRoot!.querySelector('.pos-slider') as HTMLElement;
    const readout = el.shadowRoot!.querySelector('slot[name="readout"]') as HTMLSlotElement;
    expect(readout).toBeTruthy();
    expect(readout.parentElement).toBe(wrap);
    expect(el.shadowRoot!.querySelector('.pos-bar slot[name="readout"]')).toBeNull();
    const bubble = document.createElement('div');
    bubble.className = 'pos-readout';
    bubble.slot = 'readout';
    el.appendChild(bubble);
    await el.updateComplete;
    expect(readout.assignedElements()).toEqual([bubble]);
  });
});

describe('acp-rail-track — ARIA application', () => {
  it('dialog: applies the host-computed slider ARIA verbatim, min/max from the axis', async () => {
    const el = await mount({
      variant: 'dialog',
      axis: SLAT,
      fillPct: 50,
      closedPct: 50,
      target: null,
      targetPct: 0,
      valueNow: 45,
      valueText: '45%',
      label: 'Slat',
    });
    const node = slider(el);
    expect(node.getAttribute('role')).toBe('slider');
    expect(node.getAttribute('tabindex')).toBe('0');
    expect(node.getAttribute('aria-disabled')).toBe('false');
    expect(node.getAttribute('aria-valuemin')).toBe('-90');
    expect(node.getAttribute('aria-valuemax')).toBe('90');
    expect(node.getAttribute('aria-valuenow')).toBe('45');
    expect(node.getAttribute('aria-valuetext')).toBe('45%');
    expect(node.getAttribute('aria-label')).toBe('Slat');
  });

  it('dense: applies the same slider ARIA to .pos-slider', async () => {
    const el = await mount({
      variant: 'dense',
      fillPct: 40,
      target: null,
      targetPct: 0,
      valueNow: 40,
      valueText: '60% open',
      label: 'Kitchen · Position',
    });
    const node = slider(el);
    expect(node.classList.contains('pos-slider')).toBe(true);
    expect(node.getAttribute('role')).toBe('slider');
    expect(node.getAttribute('tabindex')).toBe('0');
    expect(node.getAttribute('aria-valuemin')).toBe('0');
    expect(node.getAttribute('aria-valuemax')).toBe('100');
    expect(node.getAttribute('aria-valuenow')).toBe('40');
    expect(node.getAttribute('aria-valuetext')).toBe('60% open');
    expect(node.getAttribute('aria-label')).toBe('Kitchen · Position');
  });
});

describe('acp-rail-track — tooltips', () => {
  it('dialog: hint lands on .track, targetTooltip on the marker', async () => {
    const el = await mount({
      variant: 'dialog',
      fillPct: 40,
      closedPct: 60,
      target: 70,
      targetPct: 70,
      hint: 'Click to set',
      targetTooltip: 'Target 70%',
    });
    expect(slider(el).getAttribute('data-tooltip')).toBe('Click to set');
    expect(
      (el.shadowRoot!.querySelector('.marker') as HTMLElement).getAttribute('data-tooltip'),
    ).toBe('Target 70%');
  });

  // The bar, not the wrapper: same visual rect, and it is the node that exists
  // on both dense rails.
  it('dense: hint lands on .pos-bar, not on the .pos-slider wrapper', async () => {
    const el = await mount({
      variant: 'dense',
      fillPct: 40,
      target: null,
      targetPct: 0,
      hint: 'Drag to set all 4',
    });
    expect(
      (el.shadowRoot!.querySelector('.pos-bar') as HTMLElement).getAttribute('data-tooltip'),
    ).toBe('Drag to set all 4');
    expect(slider(el).hasAttribute('data-tooltip')).toBe(false);
  });

  it('sets no tooltip attributes when hint and targetTooltip are null', async () => {
    const el = await mount({ variant: 'dense', fillPct: 40, target: 70, targetPct: 70 });
    expect(
      (el.shadowRoot!.querySelector('.pos-bar') as HTMLElement).hasAttribute('data-tooltip'),
    ).toBe(false);
    expect(
      (el.shadowRoot!.querySelector('.pos-marker') as HTMLElement).hasAttribute('data-tooltip'),
    ).toBe(false);
  });
});

describe('acp-rail-track — click commit (rails 1–3)', () => {
  it('fires acp-rail-set with the LOGICAL value on a mirrored axis (#234)', async () => {
    const el = await mount({
      variant: 'dialog',
      axis: MIRRORED,
      fillPct: 0,
      closedPct: 100,
      target: null,
      targetPct: 0,
    });
    const node = stubRect(slider(el));
    const r = record(el);
    node.dispatchEvent(click(80));
    // Drawn 80% of the track; on a blind that is logical 20.
    expect(r.sets).toEqual([20]);
  });

  it('maps a click through a non-0–100 axis range', async () => {
    const el = await mount({
      variant: 'dialog',
      axis: SLAT,
      fillPct: 50,
      closedPct: 50,
      target: null,
      targetPct: 0,
    });
    const node = stubRect(slider(el));
    const r = record(el);
    node.dispatchEvent(click(75)); // 75% of -90..90
    expect(r.sets).toEqual([45]);
  });

  it('commits once on the trailing click after a drag, and previews on the way', async () => {
    const el = await mount({ variant: 'dense', fillPct: 35, target: null, targetPct: 0 });
    const node = stubRect(slider(el));
    const r = record(el);
    node.dispatchEvent(down(20));
    node.dispatchEvent(move(80));
    node.dispatchEvent(up(80));
    node.dispatchEvent(click(80));
    await el.updateComplete;
    expect(r.sets).toEqual([80]);
    expect(r.previews).toEqual([20, 80, null]);
  });

  it('dispatches acp-rail-set so a host outside the shadow boundary can hear it', async () => {
    const el = await mount({ variant: 'dense', fillPct: 35, target: null, targetPct: 0 });
    const node = stubRect(slider(el));
    let seen: CustomEvent<number> | null = null;
    document.body.addEventListener('acp-rail-set', (e) => {
      seen = e as CustomEvent<number>;
    });
    node.dispatchEvent(click(60));
    expect(seen).not.toBeNull();
    expect(seen!.bubbles).toBe(true);
    expect(seen!.composed).toBe(true);
    expect(seen!.detail).toBe(60);
  });
});

// The group rail's contract (#267): a stray tap while reaching for the tile must
// not flatten every member onto one value, so the commit moves to release and
// only counts past a real movement threshold.
describe('acp-rail-track — release commit with a drag threshold', () => {
  async function mountRelease(): Promise<{ el: RailTrack; node: HTMLElement; r: Recorder }> {
    const el = await mount({
      variant: 'dense',
      commitOn: 'release',
      dragThresholdPx: 4,
      fillPct: 40,
      target: null,
      targetPct: 0,
    });
    const node = stubRect(slider(el));
    return { el, node, r: record(el) };
  }

  it('a tap commits nothing and previews nothing', async () => {
    const { el, node, r } = await mountRelease();
    node.dispatchEvent(down(50));
    node.dispatchEvent(up(50));
    node.dispatchEvent(click(50));
    await el.updateComplete;
    expect(r.sets).toEqual([]);
    expect(r.previews).toEqual([]);
  });

  it('a sub-threshold move previews nothing and commits nothing', async () => {
    const { el, node, r } = await mountRelease();
    node.dispatchEvent(down(50));
    node.dispatchEvent(move(52)); // 2px < the 4px threshold
    node.dispatchEvent(up(52));
    await el.updateComplete;
    expect(r.previews).toEqual([]);
    expect(r.sets).toEqual([]);
  });

  it('commits exactly once on release once the gesture crosses the threshold', async () => {
    const { el, node, r } = await mountRelease();
    node.dispatchEvent(down(50));
    node.dispatchEvent(move(80));
    node.dispatchEvent(up(80));
    // The browser still fires a compatibility click at the release point; in
    // release mode it must NOT produce a second commit.
    node.dispatchEvent(click(80));
    await el.updateComplete;
    expect(r.sets).toEqual([80]);
  });

  it('dispatches the null preview BEFORE the release commit', async () => {
    const { el, node, r } = await mountRelease();
    node.dispatchEvent(down(50));
    node.dispatchEvent(move(80));
    node.dispatchEvent(up(80));
    await el.updateComplete;
    expect(r.seen).toEqual(['preview:80', 'preview:null', 'set:80']);
  });

  it('discards the gesture on pointercancel: null preview, no commit', async () => {
    const { el, node, r } = await mountRelease();
    node.dispatchEvent(down(50));
    node.dispatchEvent(move(80));
    node.dispatchEvent(cancel());
    await el.updateComplete;
    expect(r.previews).toEqual([80, null]);
    expect(r.sets).toEqual([]);
  });
});

describe('acp-rail-track — preview stream', () => {
  it('emits nothing for a move that does not change the value', async () => {
    const el = await mount({ variant: 'dense', fillPct: 35, target: null, targetPct: 0 });
    const node = stubRect(slider(el));
    const r = record(el);
    node.dispatchEvent(down(40));
    node.dispatchEvent(move(40));
    node.dispatchEvent(move(40));
    await el.updateComplete;
    expect(r.previews).toEqual([40]);
  });

  it('previews the LOGICAL value on a mirrored axis', async () => {
    const el = await mount({
      variant: 'dense',
      axis: MIRRORED,
      fillPct: 0,
      target: null,
      targetPct: 0,
    });
    const node = stubRect(slider(el));
    const r = record(el);
    node.dispatchEvent(down(10));
    node.dispatchEvent(move(80));
    await el.updateComplete;
    expect(r.previews).toEqual([90, 20]);
  });

  it('acp-rail-preview bubbles and is composed', async () => {
    const el = await mount({ variant: 'dense', fillPct: 35, target: null, targetPct: 0 });
    const node = stubRect(slider(el));
    let seen: CustomEvent<number | null> | null = null;
    document.body.addEventListener('acp-rail-preview', (e) => {
      seen = e as CustomEvent<number | null>;
    });
    node.dispatchEvent(down(20));
    expect(seen).not.toBeNull();
    expect(seen!.bubbles).toBe(true);
    expect(seen!.composed).toBe(true);
    expect(seen!.detail).toBe(20);
  });
});

describe('acp-rail-track — keyboard', () => {
  it.each([
    ['ArrowRight', 36],
    ['ArrowUp', 36],
    ['ArrowLeft', 34],
    ['ArrowDown', 34],
    ['PageUp', 45],
    ['PageDown', 25],
    ['Home', 0],
    ['End', 100],
  ])('commits %s from `value` as %i', async (key, expected) => {
    const el = await mount({
      variant: 'dialog',
      fillPct: 35,
      closedPct: 65,
      target: null,
      targetPct: 0,
      value: 35,
    });
    const r = record(el);
    slider(el).dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key }));
    expect(r.sets).toEqual([expected]);
  });

  it('clamps a keyboard step to the axis range', async () => {
    const el = await mount({
      variant: 'dense',
      fillPct: 97,
      target: null,
      targetPct: 0,
      value: 97,
    });
    const r = record(el);
    slider(el).dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'PageUp' }));
    expect(r.sets).toEqual([100]);
  });

  it('steps in axis units on a non-0–100 range', async () => {
    const el = await mount({
      variant: 'dialog',
      axis: SLAT,
      fillPct: 50,
      closedPct: 50,
      target: null,
      targetPct: 0,
      value: 0,
    });
    const r = record(el);
    const node = slider(el);
    node.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Home' }));
    node.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'End' }));
    expect(r.sets).toEqual([-90, 90]);
  });

  // `value` is the LOGICAL stepping base the host chose — the group rail hands
  // down its spread minimum rather than the aggregate mean, and the element
  // must step from whatever it is given rather than re-deriving one.
  it('steps from `value`, not from the drawn fillPct', async () => {
    const el = await mount({
      variant: 'dense',
      fillPct: 80,
      target: null,
      targetPct: 0,
      value: 10,
    });
    const r = record(el);
    slider(el).dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    expect(r.sets).toEqual([11]);
  });

  it('ignores keys outside the slider map', async () => {
    const el = await mount({
      variant: 'dense',
      fillPct: 35,
      target: null,
      targetPct: 0,
      value: 35,
    });
    const r = record(el);
    const node = slider(el);
    node.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'a' }));
    node.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
    expect(r.sets).toEqual([]);
  });
});

describe('acp-rail-track — disabled (#212 unavailable cover, group not controllable)', () => {
  it('reflects the attribute and drops out of the focus order', async () => {
    const el = await mount({
      variant: 'dialog',
      fillPct: 35,
      closedPct: 65,
      target: null,
      targetPct: 0,
      disabled: true,
    });
    expect(el.hasAttribute('disabled')).toBe(true);
    const node = slider(el);
    expect(node.getAttribute('tabindex')).toBe('-1');
    expect(node.getAttribute('aria-disabled')).toBe('true');
    expect(node.classList.contains('disabled')).toBe(true);
  });

  it('is inert: no preview, no click commit, no keyboard commit', async () => {
    const el = await mount({
      variant: 'dense',
      fillPct: 35,
      target: null,
      targetPct: 0,
      value: 35,
      disabled: true,
    });
    const node = stubRect(slider(el));
    const r = record(el);
    node.dispatchEvent(down(20));
    node.dispatchEvent(move(80));
    node.dispatchEvent(up(80));
    node.dispatchEvent(click(80));
    node.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    await el.updateComplete;
    expect(r.previews).toEqual([]);
    expect(r.sets).toEqual([]);
    expect(node.classList.contains('dragging')).toBe(false);
  });
});

describe('acp-rail-track — .dragging lifecycle', () => {
  it('marks the container while a preview is live and clears it on release', async () => {
    const el = await mount({ variant: 'dense', fillPct: 35, target: null, targetPct: 0 });
    const node = stubRect(slider(el));
    expect(node.classList.contains('dragging')).toBe(false);
    node.dispatchEvent(down(20));
    await el.updateComplete;
    expect(node.classList.contains('dragging')).toBe(true);
    node.dispatchEvent(up(20));
    await el.updateComplete;
    expect(node.classList.contains('dragging')).toBe(false);
  });

  it('clears the marker on pointercancel too', async () => {
    const el = await mount({
      variant: 'dialog',
      fillPct: 35,
      closedPct: 65,
      target: null,
      targetPct: 0,
    });
    const node = stubRect(slider(el));
    node.dispatchEvent(down(20));
    await el.updateComplete;
    expect(node.classList.contains('dragging')).toBe(true);
    node.dispatchEvent(cancel());
    await el.updateComplete;
    expect(node.classList.contains('dragging')).toBe(false);
  });
});

// happy-dom has no hit-testing and no paint model, so these assert on the
// compiled stylesheet text. They pin declarations a SURFACE depends on: the
// four cross-boundary knobs exist precisely because host CSS can no longer
// reach this markup by selector, and each fallback is today's value, so the
// still-unconverted rails render unchanged.
describe('acp-rail-track — styles', () => {
  const css = (): string => sheetOf(customElements.get('acp-rail-track'));

  it('declares touch-action: none so a touch drag never scrolls the page', () => {
    expect(css()).toContain('touch-action: none');
  });

  it('suppresses the fill transition mid-drag on both variants', () => {
    expect(css()).toMatch(/\.track\.dragging\s+\.fill/);
    expect(css()).toMatch(/\.pos-slider\.dragging\s+\.pos-fill/);
  });

  it('--acp-rail-fill retints the dialog fill, defaulting to the cover-colour blend', () => {
    expect(css()).toMatch(/\.fill\s*\{[^}]*background:\s*var\(\s*--acp-rail-fill\s*,\s*color-mix/);
  });

  it('--acp-rail-overflow lets the group rail unclip its ticks, defaulting to hidden', () => {
    expect(css()).toMatch(
      /\.pos-bar\s*\{[^}]*overflow:\s*var\(\s*--acp-rail-overflow\s*,\s*hidden\s*\)/,
    );
  });

  it('--acp-rail-height lets a compact host shrink the dialog track, defaulting to 10px', () => {
    expect(css()).toMatch(/\.track\s*\{[^}]*height:\s*var\(\s*--acp-rail-height\s*,\s*10px\s*\)/);
  });

  it('--acp-rail-hit lets the stacked tile rails shrink the grab box, defaulting to -8px 0', () => {
    expect(css()).toMatch(
      /\.pos-slider::before\s*\{[^}]*inset:\s*var\(\s*--acp-rail-hit\s*,\s*-8px\s+0\s*\)/,
    );
  });
});
