import { describe, it, expect, beforeEach } from 'vitest';
import { setTooltipDefaults, _resetTooltipSingleton } from '../src/lib/tooltip';
import { tooltip } from '../src/lib/tooltip';
import { html, render } from 'lit';
import '../src/adaptive-cover-pro-tile-card';
import type { AdaptiveCoverProTileCardConfig } from '../src/types';

beforeEach(() => {
  setTooltipDefaults({ enabled: true, offset: [12, 16], delay: 400 });
  _resetTooltipSingleton();
  document.body.innerHTML = '';
});

function anchorWithTooltip(): HTMLElement {
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(html`<span class="anchor" ${tooltip('Hi')}>x</span>`, host);
  return host.querySelector('.anchor') as HTMLElement;
}

describe('tile-card setConfig threads tooltips config into the directive defaults', () => {
  it('disabling tooltips via config makes the directive emit a native title', async () => {
    const card = document.createElement('adaptive-cover-pro-tile-card') as HTMLElement & {
      setConfig: (c: AdaptiveCoverProTileCardConfig) => void;
    };
    card.setConfig({
      type: 'custom:adaptive-cover-pro-tile-card',
      entry_id: 'entry1',
      tooltips: { enabled: false },
    });
    const el = anchorWithTooltip();
    expect(el.getAttribute('title')).toBe('Hi');
    expect(el.hasAttribute('data-tooltip')).toBe(false);
  });

  it('enabling tooltips (default) makes the directive emit data-tooltip', async () => {
    const card = document.createElement('adaptive-cover-pro-tile-card') as HTMLElement & {
      setConfig: (c: AdaptiveCoverProTileCardConfig) => void;
    };
    card.setConfig({
      type: 'custom:adaptive-cover-pro-tile-card',
      entry_id: 'entry1',
      tooltips: { enabled: true },
    });
    const el = anchorWithTooltip();
    expect(el.getAttribute('data-tooltip')).toBe('Hi');
    expect(el.hasAttribute('title')).toBe(false);
  });
});
