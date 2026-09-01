import { describe, it, expect } from 'vitest';
import '../src/components/tilt-bar';
import type { HomeAssistant } from 'custom-card-helpers';

import { railEl, railRoot, railSettled } from './rail-query';

interface TiltBarLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  actual?: number | null;
  target?: number | null;
  layout?: 'cover' | 'tile';
  coverColor?: string | null;
  label?: string | null;
  min?: number;
  max?: number;
  unit?: string;
  disabled?: boolean;
}

const hass = { states: {} } as unknown as HomeAssistant;

async function mount(props: Partial<TiltBarLike>): Promise<TiltBarLike> {
  const el = document.createElement('acp-tilt-bar') as TiltBarLike;
  el.hass = hass;
  Object.assign(el, props);
  document.body.appendChild(el);
  // Settle the nested rail, not just the bar: the container the assertions
  // reach for lives inside `acp-rail-track`'s own shadow root now.
  await railSettled(el);
  return el;
}

/** A component's stylesheet as one string. `styles` became an ARRAY when the
 *  rail overlay's shared fragment was factored out, so a single `.cssText` no
 *  longer covers the whole sheet. */
function sheetOf(ctor: unknown): string {
  const styles = (ctor as { styles: { cssText: string } | { cssText: string }[] }).styles;
  return Array.isArray(styles) ? styles.map((s) => s.cssText).join('\n') : styles.cssText;
}

describe('acp-tilt-bar', () => {
  it('splits the track into open + closed widths summing to 100%', async () => {
    const el = await mount({ actual: 35, target: 70 });
    const open = railRoot(el.shadowRoot!).querySelector('.fill') as HTMLElement;
    const closed = railRoot(el.shadowRoot!).querySelector('.fill-closed') as HTMLElement;
    expect(open.style.width).toBe('35%');
    expect(closed.style.width).toBe('65%');
  });

  it('renders the actual percentage label', async () => {
    const el = await mount({ actual: 35, target: 70 });
    const num = el.shadowRoot!.querySelector('.num')!.textContent!;
    expect(num).toContain('35');
  });

  it('clamps the target marker inside the rail', async () => {
    const el = await mount({ actual: 35, target: 70 });
    const marker = railRoot(el.shadowRoot!).querySelector('.marker') as HTMLElement;
    expect(marker.getAttribute('style')).toContain('left:clamp(1px, 70%, calc(100% - 1px))');
  });

  it('omits the marker when there is no tilt target', async () => {
    const el = await mount({ actual: 35, target: null });
    expect(railRoot(el.shadowRoot!).querySelector('.marker')).toBeNull();
  });

  it('fires acp-tilt-set with the clamped click value', async () => {
    const el = await mount({ actual: 35, target: 70 });
    const track = railRoot(el.shadowRoot!).querySelector('.track') as HTMLElement;
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100, top: 0, bottom: 8, right: 100, height: 8 }),
      configurable: true,
    });
    let detail: number | undefined;
    el.addEventListener('acp-tilt-set', (e) => {
      detail = (e as CustomEvent<number>).detail;
    });
    track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 80 }));
    expect(detail).toBe(80);
  });

  it('uses the cover-aligned grid by default and the inline grid for the tile', async () => {
    const coverEl = await mount({ actual: 35, target: 70 });
    expect(coverEl.shadowRoot!.querySelector('.row.cover')).not.toBeNull();
    const tileEl = await mount({ actual: 35, target: 70, layout: 'tile' });
    expect(tileEl.shadowRoot!.querySelector('.row.tile')).not.toBeNull();
  });

  it('defaults its label to the tilt title when no label prop is set', async () => {
    const el = await mount({ actual: 35, target: 70 });
    expect(el.shadowRoot!.querySelector('.label')!.textContent).toContain('Tilt');
  });

  it('does not fire acp-tilt-set on a track click when disabled', async () => {
    const el = await mount({ actual: 35, target: 70, disabled: true });
    const track = railRoot(el.shadowRoot!).querySelector('.track') as HTMLElement;
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100, top: 0, bottom: 8, right: 100, height: 8 }),
      configurable: true,
    });
    let fired = false;
    el.addEventListener('acp-tilt-set', () => {
      fired = true;
    });
    track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 80 }));
    expect(fired).toBe(false);
  });
});

describe('acp-axis-bar generalization', () => {
  async function mountAxis(props: Partial<TiltBarLike>): Promise<TiltBarLike> {
    const el = document.createElement('acp-axis-bar') as TiltBarLike;
    el.hass = hass;
    Object.assign(el, props);
    document.body.appendChild(el);
    await railSettled(el);
    return el;
  }

  it('registers acp-tilt-bar as an alias resolving to the same element', () => {
    expect(customElements.get('acp-axis-bar')).toBeDefined();
    expect(customElements.get('acp-tilt-bar')).toBeDefined();
  });

  it('renders a custom label when the label prop is provided', async () => {
    const el = await mountAxis({ actual: 20, target: 40, label: 'Elevation' });
    expect(el.shadowRoot!.querySelector('.label')!.textContent).toContain('Elevation');
  });

  it('maps a non-0–100 range onto the track fill using min/max', async () => {
    // Range -90..90, actual 0 → midpoint → 50% fill, 50% closed.
    const el = await mountAxis({ actual: 0, target: 45, min: -90, max: 90, label: 'Slat' });
    const open = railRoot(el.shadowRoot!).querySelector('.fill') as HTMLElement;
    const closed = railRoot(el.shadowRoot!).querySelector('.fill-closed') as HTMLElement;
    expect(open.style.width).toBe('50%');
    expect(closed.style.width).toBe('50%');
  });

  it('positions the marker via min/max mapping', async () => {
    // target 0 within -90..90 → 50% marker position.
    const el = await mountAxis({ actual: -90, target: 0, min: -90, max: 90, label: 'Slat' });
    const marker = railRoot(el.shadowRoot!).querySelector('.marker') as HTMLElement;
    expect(marker.getAttribute('style')).toContain('left:clamp(1px, 50%, calc(100% - 1px))');
  });

  it('emits a value in [min,max] on click using the range', async () => {
    const el = await mountAxis({ actual: 0, target: 0, min: -90, max: 90, label: 'Slat' });
    const track = railRoot(el.shadowRoot!).querySelector('.track') as HTMLElement;
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100, top: 0, bottom: 8, right: 100, height: 8 }),
      configurable: true,
    });
    let detail: number | undefined;
    el.addEventListener('acp-tilt-set', (e) => {
      detail = (e as CustomEvent<number>).detail;
    });
    // Click at 50% of the track → midpoint of -90..90 = 0.
    track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 50 }));
    expect(detail).toBe(0);
  });
});

describe('acp-axis-bar drag slider', () => {
  const RECT = { left: 0, width: 100, top: 0, bottom: 8, right: 100, height: 8 };

  /** Mount and stub the track rect so clientX maps 1:1 onto track percent. */
  async function mountWithTrack(
    props: Partial<TiltBarLike>,
  ): Promise<{ el: TiltBarLike; track: HTMLElement; fired: number[] }> {
    const el = await mount(props);
    const track = railRoot(el.shadowRoot!).querySelector('.track') as HTMLElement;
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => RECT,
      configurable: true,
    });
    const fired: number[] = [];
    el.addEventListener('acp-tilt-set', (e) => fired.push((e as CustomEvent<number>).detail));
    return { el, track, fired };
  }

  const down = (x: number): PointerEvent =>
    new PointerEvent('pointerdown', { bubbles: true, clientX: x, pointerId: 1 });
  const move = (x: number): PointerEvent =>
    new PointerEvent('pointermove', { bubbles: true, clientX: x, pointerId: 1 });

  it('exposes WAI-ARIA slider semantics on the track', async () => {
    const { track } = await mountWithTrack({ actual: 35, target: 70 });
    expect(track.getAttribute('role')).toBe('slider');
    expect(track.getAttribute('tabindex')).toBe('0');
    expect(track.getAttribute('aria-valuemin')).toBe('0');
    expect(track.getAttribute('aria-valuemax')).toBe('100');
    expect(track.getAttribute('aria-valuenow')).toBe('35');
    expect(track.getAttribute('aria-valuetext')).toContain('35');
    // Accessible name reuses the visible axis label — no separate i18n key.
    expect(track.getAttribute('aria-label')).toContain('Tilt');
  });

  it('takes aria-valuemin/max from a non-0-100 axis range', async () => {
    const { track } = await mountWithTrack({
      actual: 0,
      target: 0,
      min: -90,
      max: 90,
      label: 'Slat',
    });
    expect(track.getAttribute('aria-valuemin')).toBe('-90');
    expect(track.getAttribute('aria-valuemax')).toBe('90');
    expect(track.getAttribute('aria-label')).toContain('Slat');
  });

  it('previews the dragged value live without committing', async () => {
    const { el, track, fired } = await mountWithTrack({ actual: 35, target: 70 });
    track.dispatchEvent(down(20));
    track.dispatchEvent(move(80));
    await railSettled(el);
    expect((railRoot(el.shadowRoot!).querySelector('.fill') as HTMLElement).style.width).toBe(
      '80%',
    );
    expect(el.shadowRoot!.querySelector('.num')!.textContent).toContain('80');
    expect(track.getAttribute('aria-valuenow')).toBe('80');
    // Nothing is sent until the gesture completes.
    expect(fired).toEqual([]);
  });

  it('commits once on the trailing click after a drag', async () => {
    const { el, track, fired } = await mountWithTrack({ actual: 35, target: 70 });
    track.dispatchEvent(down(20));
    track.dispatchEvent(move(80));
    track.dispatchEvent(
      new PointerEvent('pointerup', { bubbles: true, clientX: 80, pointerId: 1 }),
    );
    // Real browsers fire a compatibility click at the release point.
    track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 80 }));
    await railSettled(el);
    expect(fired).toEqual([80]);
  });

  it('discards the drag on pointercancel without committing', async () => {
    const { el, track, fired } = await mountWithTrack({ actual: 35, target: 70 });
    track.dispatchEvent(down(20));
    track.dispatchEvent(move(80));
    track.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, pointerId: 1 }));
    await railSettled(el);
    expect(fired).toEqual([]);
    expect((railRoot(el.shadowRoot!).querySelector('.fill') as HTMLElement).style.width).toBe(
      '35%',
    );
    expect(el.shadowRoot!.querySelector('.num')!.textContent).toContain('35');
  });

  it('maps the drag preview through min/max on a non-0-100 axis', async () => {
    const { el, track } = await mountWithTrack({
      actual: 0,
      target: 0,
      min: -90,
      max: 90,
      label: 'Slat',
    });
    track.dispatchEvent(down(50));
    track.dispatchEvent(move(75)); // 75% of -90..90 → 45
    await railSettled(el);
    expect(track.getAttribute('aria-valuenow')).toBe('45');
  });

  it('suppresses the width transition only while dragging', async () => {
    const { el, track } = await mountWithTrack({ actual: 35, target: 70 });
    expect(track.classList.contains('dragging')).toBe(false);
    track.dispatchEvent(down(20));
    await railSettled(el);
    expect(track.classList.contains('dragging')).toBe(true);
    track.dispatchEvent(
      new PointerEvent('pointerup', { bubbles: true, clientX: 20, pointerId: 1 }),
    );
    await railSettled(el);
    expect(track.classList.contains('dragging')).toBe(false);
  });

  // Re-pointed at `acp-rail-track` with the merge (#271 Part 2): both rules now
  // live in the element that owns the container, and asserting them against
  // this bar's own sheet would pass on nothing.
  it('declares touch-action: none so a touch drag does not scroll the page', () => {
    const css = sheetOf(customElements.get('acp-rail-track'));
    expect(css).toContain('touch-action: none');
    expect(css).toContain('.track.dragging');
  });

  // The compact/tile shrink is the one track rule still decided out here, and
  // it can only reach the element through the knob.
  it('shrinks the compact and tile rails through the --acp-rail-height knob', () => {
    const css = sheetOf(customElements.get('acp-axis-bar'));
    expect(css).toMatch(
      /:host\(\[compact\]\) acp-rail-track,\s*\.row\.tile acp-rail-track\s*\{[^}]*--acp-rail-height:\s*6px/,
    );
  });

  it.each([
    ['ArrowRight', 36],
    ['ArrowUp', 36],
    ['ArrowLeft', 34],
    ['ArrowDown', 34],
    ['PageUp', 45],
    ['PageDown', 25],
    ['Home', 0],
    ['End', 100],
  ])('commits %s from the keyboard as %i', async (key, expected) => {
    const { track, fired } = await mountWithTrack({ actual: 35, target: 70 });
    track.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key }));
    expect(fired).toEqual([expected]);
  });

  it('clamps keyboard steps to the axis range', async () => {
    const { track, fired } = await mountWithTrack({ actual: 97, target: 0 });
    track.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'PageUp' }));
    expect(fired).toEqual([100]);
  });

  it('steps in axis units on a non-0-100 range', async () => {
    const { track, fired } = await mountWithTrack({
      actual: 0,
      target: 0,
      min: -90,
      max: 90,
      label: 'Slat',
    });
    track.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Home' }));
    track.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'End' }));
    expect(fired).toEqual([-90, 90]);
  });

  it('ignores unrelated keys', async () => {
    const { track, fired } = await mountWithTrack({ actual: 35, target: 70 });
    track.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'a' }));
    track.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
    expect(fired).toEqual([]);
  });

  it('is inert when disabled: no focus stop, no drag, no keyboard commit', async () => {
    const { el, track, fired } = await mountWithTrack({ actual: 35, target: 70, disabled: true });
    expect(track.getAttribute('tabindex')).toBe('-1');
    expect(track.getAttribute('aria-disabled')).toBe('true');
    track.dispatchEvent(down(20));
    track.dispatchEvent(move(80));
    await railSettled(el);
    // No preview, no commit.
    expect((railRoot(el.shadowRoot!).querySelector('.fill') as HTMLElement).style.width).toBe(
      '35%',
    );
    track.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    expect(fired).toEqual([]);
  });
});

/**
 * #271 Part 2: the bar stops hand-writing its own slider container and composes
 * the shared `<acp-rail-track>` instead. Everything above this block is the
 * behaviour that must survive the swap unchanged — these two tests pin the swap
 * itself, so a bar that quietly went back to drawing its own track fails here
 * rather than passing every behavioural test through markup nobody else shares.
 */
describe('acp-axis-bar — composes the shared rail track (#271 Part 2)', () => {
  const at = (type: string, x: number): PointerEvent =>
    new PointerEvent(type, { bubbles: true, clientX: x, pointerId: 1 });

  it('renders its track through acp-rail-track, ARIA intact on the inner .track', async () => {
    const el = await mount({ actual: 35, target: 70 });
    expect(railEl(el.shadowRoot!)).toBeTruthy();
    const track = railRoot(el.shadowRoot!).querySelector('.track') as HTMLElement;
    // Byte-for-byte the slider semantics the hand-written container carried.
    expect(track.getAttribute('role')).toBe('slider');
    expect(track.getAttribute('tabindex')).toBe('0');
    expect(track.getAttribute('aria-valuemin')).toBe('0');
    expect(track.getAttribute('aria-valuemax')).toBe('100');
    expect(track.getAttribute('aria-valuenow')).toBe('35');
    expect(track.getAttribute('aria-valuetext')).toContain('35');
    expect(track.getAttribute('aria-label')).toContain('Tilt');
  });

  // `acp-tilt-set` is this bar's whole public surface — four hosts listen for
  // it and nothing else. The rail's own `acp-rail-set` / `acp-rail-preview`
  // both bubble AND compose, so without containment the swap would silently
  // widen that surface and a host listening for rail events on a wrapper would
  // start hearing its nested axis bars' gestures too.
  it('keeps acp-tilt-set as its only public event — the rail events stay inside', async () => {
    const el = await mount({ actual: 35, target: 70 });
    const track = railRoot(el.shadowRoot!).querySelector('.track') as HTMLElement;
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100, top: 0, bottom: 8, right: 100, height: 8 }),
      configurable: true,
    });
    const escaped: string[] = [];
    for (const type of ['acp-rail-set', 'acp-rail-preview']) {
      document.body.addEventListener(type, () => escaped.push(type));
    }
    const tiltSets: number[] = [];
    el.addEventListener('acp-tilt-set', (e) => tiltSets.push((e as CustomEvent<number>).detail));
    track.dispatchEvent(at('pointerdown', 20));
    track.dispatchEvent(at('pointermove', 80));
    track.dispatchEvent(at('pointerup', 80));
    track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 80 }));
    await railSettled(el);
    expect(tiltSets).toEqual([80]);
    expect(escaped).toEqual([]);
  });
});
