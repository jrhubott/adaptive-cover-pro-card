import { describe, it, expect, beforeEach } from 'vitest';
import { html, render } from 'lit';
import type { HomeAssistant } from 'custom-card-helpers';
import { renderRailFill, railFillStyles, type RailFillOptions } from '../src/components/rail-fill';
import { renderRailOverlay } from '../src/components/rail-overlay';
import { tooltip, _resetTooltipSingleton } from '../src/lib/tooltip';

beforeEach(() => {
  _resetTooltipSingleton();
  document.body.innerHTML = '';
});

function mountFill(opts: RailFillOptions): HTMLElement {
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(html`${renderRailFill(opts)}`, host);
  return host;
}

describe('renderRailFill', () => {
  it('renders .fill at the given width percentage', () => {
    const host = mountFill({ fillPct: 42, target: null, targetPct: 0 });
    const fill = host.querySelector('.fill') as HTMLElement;
    expect(fill).toBeTruthy();
    expect(fill.getAttribute('style')).toBe('width:42%');
  });

  it('renders no .fill-closed when closedPct is omitted', () => {
    const host = mountFill({ fillPct: 42, target: null, targetPct: 0 });
    expect(host.querySelector('.fill-closed')).toBeNull();
  });

  it('renders .fill-closed at the given width percentage when closedPct is given', () => {
    const host = mountFill({ fillPct: 42, closedPct: 58, target: null, targetPct: 0 });
    const closed = host.querySelector('.fill-closed') as HTMLElement;
    expect(closed).toBeTruthy();
    expect(closed.getAttribute('style')).toBe('width:58%');
  });

  it('renders .marker clamped at the target percentage when target is given', () => {
    const host = mountFill({ fillPct: 42, target: 70, targetPct: 70 });
    const marker = host.querySelector('.marker') as HTMLElement;
    expect(marker).toBeTruthy();
    expect(marker.getAttribute('style')).toBe('left:clamp(1px, 70%, calc(100% - 1px))');
  });

  it('renders no marker when target is null', () => {
    const host = mountFill({ fillPct: 42, target: null, targetPct: 70 });
    expect(host.querySelector('.marker')).toBeNull();
  });

  it('applies the tooltip directive to the marker when given', () => {
    const host = mountFill({
      fillPct: 42,
      target: 70,
      targetPct: 70,
      tooltip: tooltip('Target 70%'),
    });
    const marker = host.querySelector('.marker') as HTMLElement;
    expect(marker.getAttribute('data-tooltip')).toBe('Target 70%');
  });

  it('renders no tooltip attributes on the marker when tooltip is omitted', () => {
    const host = mountFill({ fillPct: 42, target: 70, targetPct: 70 });
    const marker = host.querySelector('.marker') as HTMLElement;
    expect(marker.hasAttribute('data-tooltip')).toBe(false);
  });

  it("prefix: 'pos-' renders .pos-fill and .pos-marker instead of .fill/.marker", () => {
    const host = mountFill({ fillPct: 42, target: 70, targetPct: 70, prefix: 'pos-' });
    expect(host.querySelector('.pos-fill')).toBeTruthy();
    expect(host.querySelector('.pos-marker')).toBeTruthy();
    expect(host.querySelector('.fill')).toBeNull();
    expect(host.querySelector('.marker')).toBeNull();
  });
});

// On the dense tile rails, `.pos-fill`, the overlay's `.pos-travel`/
// `.pos-pending`, and `.pos-marker` are all `position: absolute` with
// `z-index: auto` (see `rail-overlay.ts` and the `.pos-*` rules in
// `railFillStyles`), so DOM order IS paint order there — unlike the
// two-segment dialog rails, where `.fill`/`.fill-closed` are unpositioned
// flex items and their place in the order is cosmetic. A refactor that
// rendered the `overlay` slot before the fill segments would silently sink
// the "moving to" indicator under the 55%-opaque fill (#272), invisible to
// every other test in this suite: happy-dom has no paint model, so nothing
// but an explicit order assertion on the real elements catches it.
describe('renderRailFill — layer stacking order (#272 paint-order guard)', () => {
  const hass = {} as unknown as HomeAssistant;

  it('renders the overlay between the fill and the marker on the pos- prefixed (dense tile) rail', () => {
    const host = mountFill({
      fillPct: 40,
      target: 70,
      targetPct: 70,
      prefix: 'pos-',
      overlay: renderRailOverlay({
        hass,
        liveFrac: 40,
        pendingFrac: 60,
        pending: 60,
        prefix: 'pos-',
      }),
    });
    const order = Array.from(host.children).map((el) => el.className);
    expect(order).toEqual(['pos-fill', 'pos-travel', 'pos-pending', 'pos-marker']);
  });

  it('renders the overlay between the fill segments and the marker on the unprefixed (dialog) rail', () => {
    const host = mountFill({
      fillPct: 40,
      closedPct: 60,
      target: 70,
      targetPct: 70,
      overlay: renderRailOverlay({ hass, liveFrac: 40, pendingFrac: 60, pending: 60 }),
    });
    const order = Array.from(host.children).map((el) => el.className);
    expect(order).toEqual(['fill', 'fill-closed', 'travel', 'pending-marker', 'marker']);
  });

  // The `decorations` slot exists for the group rail's spread band + per-member
  // ticks, which `acp-rail-track` passes down as a `<slot>` so they stay
  // light-DOM children of the surface that styles them. They belong ABOVE the
  // travel band (they are member readings, not a destination) and BELOW the
  // target marker (which must stay the topmost mark on the rail), so the slot
  // sits exactly where the overlay/marker split already is — pinned here for
  // the same reason as the overlay itself: happy-dom has no paint model.
  it('renders decorations between the overlay and the marker on the pos- prefixed (dense tile) rail', () => {
    const host = mountFill({
      fillPct: 40,
      target: 70,
      targetPct: 70,
      prefix: 'pos-',
      overlay: renderRailOverlay({
        hass,
        liveFrac: 40,
        pendingFrac: 60,
        pending: 60,
        prefix: 'pos-',
      }),
      decorations: html`<span class="deco"></span>`,
    });
    const order = Array.from(host.children).map((el) => el.className);
    expect(order).toEqual(['pos-fill', 'pos-travel', 'pos-pending', 'deco', 'pos-marker']);
  });

  it('renders decorations between the overlay and the marker on the unprefixed (dialog) rail', () => {
    const host = mountFill({
      fillPct: 40,
      closedPct: 60,
      target: 70,
      targetPct: 70,
      overlay: renderRailOverlay({ hass, liveFrac: 40, pendingFrac: 60, pending: 60 }),
      decorations: html`<span class="deco"></span>`,
    });
    const order = Array.from(host.children).map((el) => el.className);
    expect(order).toEqual(['fill', 'fill-closed', 'travel', 'pending-marker', 'deco', 'marker']);
  });

  it('renders no overlay nodes at all when the overlay option is omitted', () => {
    const host = mountFill({ fillPct: 40, target: 70, targetPct: 70, prefix: 'pos-' });
    const order = Array.from(host.children).map((el) => el.className);
    expect(order).toEqual(['pos-fill', 'pos-marker']);
  });
});

// These assert declarations a rail actually DEPENDS on breaking, not just the
// rule's presence — a regex that only re-confirms a rule exists catches a
// deletion but waves a wrong value through unnoticed.
describe('railFillStyles', () => {
  const text = (): string => railFillStyles.toString();

  it('gives .fill the stronger (50%) tint and .fill-closed the fainter (18%) one — "lighter = more open"', () => {
    expect(text()).toMatch(/\.fill\s*{[^}]*--acp-cover-color,\s*var\(--primary-color\)\)\s*50%/);
    expect(text()).toMatch(
      /\.fill-closed\s*{[^}]*--acp-cover-color,\s*var\(--primary-color\)\)\s*18%/,
    );
  });

  it('positions .marker absolutely and centers it on its left value (#158)', () => {
    expect(text()).toMatch(/\.marker\s*{[^}]*position:\s*absolute/);
    expect(text()).toMatch(/\.marker\s*{[^}]*transform:\s*translateX\(-50%\)/);
  });

  // If either of these lost `position: absolute`, it would drop out of the
  // z-index:auto layer stack the `overlay` slot's ordering promise depends on
  // (see `RailFillOptions.overlay`'s doc comment and the #272 order guard
  // above) — silently, since happy-dom has no paint model to catch it any
  // other way.
  it('positions .pos-fill and .pos-marker absolutely — load-bearing for the #272 DOM-order-is-paint-order contract', () => {
    expect(text()).toMatch(/\.pos-fill\s*{[^}]*position:\s*absolute/);
    expect(text()).toMatch(/\.pos-marker\s*{[^}]*position:\s*absolute/);
  });

  it('themes .pos-fill via --acp-pos-fill-color and centers .pos-marker the same way .marker is', () => {
    expect(text()).toMatch(/\.pos-fill\s*{[^}]*--acp-pos-fill-color/);
    expect(text()).toMatch(/\.pos-marker\s*{[^}]*transform:\s*translateX\(-50%\)/);
  });
});
