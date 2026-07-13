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
    // Real HA <ha-card> paints its own chrome (background, rounded corners,
    // themed border, shadow) from inside ITS shadow DOM. Here the card content is
    // light-DOM children, and each ACP card places its <ha-card> inside its own
    // shadow root — so page-level harness/styles.css can't reach it. Apply the
    // chrome as inline styles on the host instead, using theme vars so it tracks
    // light/dark. The themed 1px border is what visually frames every card in HA.
    const s = this.style;
    s.display = 'block';
    s.background = 'var(--card-background-color)';
    s.color = 'var(--primary-text-color)';
    s.borderRadius = 'var(--ha-card-border-radius, 12px)';
    s.border =
      'var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color))';
    s.boxShadow = 'var(--ha-card-box-shadow, none)';
  }
}

// Render into a shadow root with self-contained styling so the icon honors
// `--mdc-icon-size` and `currentColor` exactly like the real <ha-icon> — and,
// crucially, renders correctly when placed INSIDE a card's shadow DOM (e.g. the
// tile badge), where the page-level harness/styles.css rules cannot reach.
const ICON_STYLE =
  ':host{display:inline-flex;align-items:center;justify-content:center;' +
  'vertical-align:middle;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)}' +
  'svg{width:100%;height:100%;fill:currentColor}';

function svgMarkup(path: string): string {
  return `<style>${ICON_STYLE}</style><svg viewBox="0 0 24 24"><path d="${path}"></path></svg>`;
}

class HaIcon extends HTMLElement {
  static observedAttributes = ['icon'];
  private _root = this.attachShadow({ mode: 'open' });

  attributeChangedCallback(): void {
    this._render();
  }
  connectedCallback(): void {
    this._render();
  }

  set icon(v: string) {
    this.setAttribute('icon', v);
  }
  get icon(): string {
    return this.getAttribute('icon') ?? '';
  }

  private _render(): void {
    const path = ICON_PATHS[this.getAttribute('icon') ?? ''];
    this._root.innerHTML = path ? svgMarkup(path) : '';
  }
}

class HaSvgIcon extends HTMLElement {
  static observedAttributes = ['path'];
  private _root = this.attachShadow({ mode: 'open' });

  attributeChangedCallback(): void {
    this._render();
  }
  connectedCallback(): void {
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
    this._root.innerHTML = path ? svgMarkup(path) : '';
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
