import { describe, it, expect, beforeEach } from 'vitest';
import { html, render } from 'lit';
import { renderRailFill, railFillStyles, type RailFillOptions } from '../src/components/rail-fill';
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

describe('railFillStyles', () => {
  const text = (): string => railFillStyles.toString();

  it('contains the .fill rule body', () => {
    expect(text()).toMatch(/\.fill\s*{[^}]*--acp-cover-color,\s*var\(--primary-color\)\)\s*50%/);
  });

  it('contains the .fill-closed rule body', () => {
    expect(text()).toMatch(
      /\.fill-closed\s*{[^}]*--acp-cover-color,\s*var\(--primary-color\)\)\s*18%/,
    );
  });

  it('contains the .marker rule body', () => {
    expect(text()).toMatch(/\.marker\s*{[^}]*translateX\(-50%\)/);
  });

  it('contains the .pos-fill and .pos-marker rule bodies', () => {
    expect(text()).toMatch(/\.pos-fill\s*{[^}]*--acp-pos-fill-color/);
    expect(text()).toMatch(/\.pos-marker\s*{[^}]*translateX\(-50%\)/);
  });
});
