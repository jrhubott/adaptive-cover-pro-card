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
