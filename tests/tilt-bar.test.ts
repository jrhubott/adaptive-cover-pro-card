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
});
