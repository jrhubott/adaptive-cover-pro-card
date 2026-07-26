import { describe, it, expect } from 'vitest';
import '../src/components/tilt-bar';
import type { HomeAssistant } from 'custom-card-helpers';

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
  await el.updateComplete;
  return el;
}

describe('acp-tilt-bar', () => {
  it('splits the track into open + closed widths summing to 100%', async () => {
    const el = await mount({ actual: 35, target: 70 });
    const open = el.shadowRoot!.querySelector('.fill') as HTMLElement;
    const closed = el.shadowRoot!.querySelector('.fill-closed') as HTMLElement;
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
    const marker = el.shadowRoot!.querySelector('.marker') as HTMLElement;
    expect(marker.getAttribute('style')).toContain('left:clamp(1px, 70%, calc(100% - 1px))');
  });

  it('omits the marker when there is no tilt target', async () => {
    const el = await mount({ actual: 35, target: null });
    expect(el.shadowRoot!.querySelector('.marker')).toBeNull();
  });

  it('fires acp-tilt-set with the clamped click value', async () => {
    const el = await mount({ actual: 35, target: 70 });
    const track = el.shadowRoot!.querySelector('.track') as HTMLElement;
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
    const track = el.shadowRoot!.querySelector('.track') as HTMLElement;
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
    await el.updateComplete;
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
    const open = el.shadowRoot!.querySelector('.fill') as HTMLElement;
    const closed = el.shadowRoot!.querySelector('.fill-closed') as HTMLElement;
    expect(open.style.width).toBe('50%');
    expect(closed.style.width).toBe('50%');
  });

  it('positions the marker via min/max mapping', async () => {
    // target 0 within -90..90 → 50% marker position.
    const el = await mountAxis({ actual: -90, target: 0, min: -90, max: 90, label: 'Slat' });
    const marker = el.shadowRoot!.querySelector('.marker') as HTMLElement;
    expect(marker.getAttribute('style')).toContain('left:clamp(1px, 50%, calc(100% - 1px))');
  });

  it('emits a value in [min,max] on click using the range', async () => {
    const el = await mountAxis({ actual: 0, target: 0, min: -90, max: 90, label: 'Slat' });
    const track = el.shadowRoot!.querySelector('.track') as HTMLElement;
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
    const track = el.shadowRoot!.querySelector('.track') as HTMLElement;
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
    await el.updateComplete;
    expect((el.shadowRoot!.querySelector('.fill') as HTMLElement).style.width).toBe('80%');
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
    await el.updateComplete;
    expect(fired).toEqual([80]);
  });

  it('discards the drag on pointercancel without committing', async () => {
    const { el, track, fired } = await mountWithTrack({ actual: 35, target: 70 });
    track.dispatchEvent(down(20));
    track.dispatchEvent(move(80));
    track.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, pointerId: 1 }));
    await el.updateComplete;
    expect(fired).toEqual([]);
    expect((el.shadowRoot!.querySelector('.fill') as HTMLElement).style.width).toBe('35%');
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
    await el.updateComplete;
    expect(track.getAttribute('aria-valuenow')).toBe('45');
  });

  it('suppresses the width transition only while dragging', async () => {
    const { el, track } = await mountWithTrack({ actual: 35, target: 70 });
    expect(track.classList.contains('dragging')).toBe(false);
    track.dispatchEvent(down(20));
    await el.updateComplete;
    expect(track.classList.contains('dragging')).toBe(true);
    track.dispatchEvent(
      new PointerEvent('pointerup', { bubbles: true, clientX: 20, pointerId: 1 }),
    );
    await el.updateComplete;
    expect(track.classList.contains('dragging')).toBe(false);
  });

  it('declares touch-action: none so a touch drag does not scroll the page', () => {
    const css = (customElements.get('acp-axis-bar') as unknown as { styles: { cssText: string } })
      .styles.cssText;
    expect(css).toContain('touch-action: none');
    expect(css).toContain('.track.dragging');
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
    await el.updateComplete;
    // No preview, no commit.
    expect((el.shadowRoot!.querySelector('.fill') as HTMLElement).style.width).toBe('35%');
    track.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    expect(fired).toEqual([]);
  });
});
