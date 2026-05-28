/**
 * Harness entry point.
 *
 * 1. Defines minimal stubs for `ha-card`, `ha-icon`, `ha-svg-icon`, `ha-form`
 *    so the cards' Lit templates can render outside Home Assistant.
 * 2. Imports the cards from src/, which self-register their custom elements.
 * 3. Imports the harness app shell.
 *
 * Order matters: define the polyfills BEFORE importing the cards so the
 * cards see them at module-eval time.
 */

import * as mdi from '@mdi/js';

// Build "mdi:foo" → SVG-path lookup from @mdi/js exports.
const ICON_PATHS: Record<string, string> = {};
for (const [k, v] of Object.entries(mdi)) {
  if (k.startsWith('mdi') && typeof v === 'string') {
    const slug = k
      .replace(/^mdi/, '')
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');
    ICON_PATHS[`mdi:${slug}`] = v;
  }
}

class HaCard extends HTMLElement {
  connectedCallback(): void {
    this.style.display = 'block';
  }
}

class HaIcon extends HTMLElement {
  static observedAttributes = ['icon'];

  attributeChangedCallback(): void {
    this._render();
  }

  set icon(v: string) {
    this.setAttribute('icon', v);
  }
  get icon(): string {
    return this.getAttribute('icon') ?? '';
  }

  private _render(): void {
    const name = this.getAttribute('icon') ?? '';
    const path = ICON_PATHS[name];
    if (!path) {
      this.innerHTML = '';
      return;
    }
    this.innerHTML = `<svg viewBox="0 0 24 24"><path d="${path}"></path></svg>`;
  }
}

class HaSvgIcon extends HTMLElement {
  static observedAttributes = ['path'];

  attributeChangedCallback(): void {
    this._render();
  }

  set path(v: string) {
    this.setAttribute('path', v);
  }
  get path(): string {
    return this.getAttribute('path') ?? '';
  }

  private _render(): void {
    const path = this.getAttribute('path') ?? '';
    if (!path) {
      this.innerHTML = '';
      return;
    }
    this.innerHTML = `<svg viewBox="0 0 24 24"><path d="${path}"></path></svg>`;
  }
}

class HaFormStub extends HTMLElement {
  // Editor cards aren't loaded in v1; this exists only so any incidental render
  // doesn't blow up.
}

if (!customElements.get('ha-card')) customElements.define('ha-card', HaCard);
if (!customElements.get('ha-icon')) customElements.define('ha-icon', HaIcon);
if (!customElements.get('ha-svg-icon')) customElements.define('ha-svg-icon', HaSvgIcon);
if (!customElements.get('ha-form')) customElements.define('ha-form', HaFormStub);

// Cards self-register via @customElement decorator on import.
import '../src/adaptive-cover-pro-card';
import '../src/adaptive-cover-pro-sky-compass-card';
import '../src/adaptive-cover-pro-tile-card';

// Harness app shell.
import './src/harness-app';
