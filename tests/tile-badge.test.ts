import { describe, it, expect } from 'vitest';
import { TileBadge } from '../src/components/tile-badge';

interface BadgeLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  winner?: string;
  slotNumber?: number;
  slotName?: string;
  pct?: number;
  minimumMode?: boolean;
  manualEndIso?: string;
  integrationEnabled?: boolean;
  resumable?: boolean;
  extendable?: boolean;
  manualActive?: boolean;
  compact?: boolean;
  safetyActive?: boolean;
  kindOverride?: string;
  groupCount?: number;
  groupTotal?: number;
}

async function mountBadge(props: Partial<BadgeLike>): Promise<BadgeLike> {
  const el = document.createElement('acp-tile-badge') as BadgeLike;
  Object.assign(el, props);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function text(el: BadgeLike): string {
  return el.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
}

function kind(el: BadgeLike): string {
  const span = el.shadowRoot!.querySelector('span.badge') as HTMLElement;
  return Array.from(span.classList)
    .filter((c) => c.startsWith('kind-'))
    .map((c) => c.slice('kind-'.length))[0];
}

function kindOf(el: BadgeLike, selector: string): string {
  const node = el.shadowRoot!.querySelector(selector) as HTMLElement;
  return Array.from(node.classList)
    .filter((c) => c.startsWith('kind-'))
    .map((c) => c.slice('kind-'.length))[0];
}

// ---------------------------------------------------------------------------
// Declared-CSS inspection.
//
// happy-dom does no layout — getBoundingClientRect() is all zeros and
// getComputedStyle() resolves nothing from a shadow-root stylesheet — so a hit
// area asserted against the rendered box would pass vacuously no matter what
// the component ships. These helpers read the rule the component actually
// declares instead, which is the thing the browser would lay out.
// ---------------------------------------------------------------------------

const BADGE_CSS = ([TileBadge.styles].flat(Infinity) as { cssText: string }[])
  .map((s) => s.cssText)
  .join('\n')
  // Comments would otherwise glue onto the next property name and hide it.
  .replace(/\/\*[\s\S]*?\*\//g, '');

type Decls = Record<string, string>;

/** Declarations of the rule whose selector is exactly `selector`. */
function declaredRule(selector: string): Decls {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`(?:^|\\})\\s*${escaped}\\s*\\{([^}]*)\\}`).exec(BADGE_CSS);
  if (!match) throw new Error(`no rule found for selector "${selector}"`);
  const decls: Decls = {};
  for (const decl of match[1].split(';')) {
    const idx = decl.indexOf(':');
    if (idx === -1) continue;
    decls[decl.slice(0, idx).trim()] = decl.slice(idx + 1).trim();
  }
  return decls;
}

function px(value: string | undefined): number {
  if (!value) return 0;
  const n = parseFloat(value);
  return Number.isNaN(n) ? 0 : n;
}

/** Expands a `padding`/`margin` shorthand into per-side pixels (1/2/3/4 values). */
function sides(shorthand: string | undefined): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  const parts = (shorthand ?? '0').split(/\s+/).map(px);
  const [top, right = top, bottom = top, left = right] = parts;
  return { top, right, bottom, left };
}

/** The tap target the browser would render for `.act`, from the declared rule. */
function hitBox(decls: Decls): { width: number; height: number; glyph: number } {
  const pad = sides(decls.padding);
  const glyph = px(decls['--mdc-icon-size']);
  return {
    width: Math.max(px(decls['min-width']), glyph + pad.left + pad.right),
    height: Math.max(px(decls['min-height']), glyph + pad.top + pad.bottom),
    glyph,
  };
}

/** `.act` as it resolves in compact — the base rule with the compact override applied. */
function actDecls(compact: boolean): Decls {
  const base = declaredRule('.act');
  return compact ? { ...base, ...declaredRule(':host([compact]) .act') } : base;
}

describe('acp-tile-badge action tap targets (WCAG 2.2 SC 2.5.8)', () => {
  // Sanity-check the inspection itself: if the parser silently found nothing,
  // every assertion below would be meaningless.
  it('reads the .act rule out of the component styles', () => {
    expect(declaredRule('.act').cursor).toBe('pointer');
    expect(actDecls(true)['--mdc-icon-size']).toBe('12px');
    expect(actDecls(false)['--mdc-icon-size']).toBe('14px');
  });

  for (const compact of [false, true]) {
    const name = compact ? 'compact' : 'normal';

    it(`gives each ${name} action button a 24px-minimum hit area in both dimensions`, () => {
      const box = hitBox(actDecls(compact));
      expect(box.width, `${name} .act hit width`).toBeGreaterThanOrEqual(24);
      expect(box.height, `${name} .act hit height`).toBeGreaterThanOrEqual(24);
    });

    it(`grows the ${name} tap target without changing the badge's rendered layout`, () => {
      const decls = actDecls(compact);
      const box = hitBox(decls);
      const margin = sides(decls.margin);
      // Negative margins pull the enlarged box back to the glyph's original
      // footprint, so the badge lays out exactly as it did with `padding: 0`.
      expect(box.width - Math.abs(margin.left) - Math.abs(margin.right)).toBe(box.glyph);
      expect(box.height - Math.abs(margin.top) - Math.abs(margin.bottom)).toBe(box.glyph);
      expect(margin.left).toBeLessThan(0);
      expect(margin.top).toBeLessThan(0);
    });
  }

  it('keeps the glyph itself at 14px / 12px — the target grows, the icon does not', () => {
    expect(actDecls(false)['--mdc-icon-size']).toBe('14px');
    expect(actDecls(true)['--mdc-icon-size']).toBe('12px');
  });
});

describe('acp-tile-badge', () => {
  it('renders Auto when winner is default', async () => {
    const el = await mountBadge({ winner: 'default' });
    expect(text(el)).toBe('Auto');
    expect(kind(el)).toBe('auto');
  });

  it('renders Auto when winner is unknown', async () => {
    const el = await mountBadge({ winner: 'mystery_handler' });
    expect(text(el)).toBe('Auto');
    expect(kind(el)).toBe('auto');
  });

  it('renders Solar tracking for solar winner', async () => {
    const el = await mountBadge({ winner: 'solar' });
    expect(text(el)).toBe('Solar tracking');
    expect(kind(el)).toBe('solar');
  });

  it('renders a leading ha-icon for the solar badge', async () => {
    const el = await mountBadge({ winner: 'solar' });
    const icon = el.shadowRoot!.querySelector('ha-icon');
    expect(icon).toBeTruthy();
    expect(icon!.getAttribute('icon')).toBe('mdi:white-balance-sunny');
  });

  it('renders just the countdown clock when manualEndIso is set (the manual color signals the kind)', async () => {
    const el = await mountBadge({
      winner: 'manual',
      manualEndIso: '2026-05-23T16:51:00Z',
    });
    // formatClock uses toLocaleTimeString, which emits either "16:51" (24h
    // locales) or "4:51 PM" (12h locales). Match both shapes; no prefix.
    expect(text(el)).toMatch(/^\d{1,2}:\d{2}(?:\s?[AP]M)?$/);
    expect(kind(el)).toBe('manual');
  });

  it('renders bare Manual when no end iso is provided', async () => {
    const el = await mountBadge({ winner: 'manual' });
    expect(text(el)).toBe('Manual');
    expect(kind(el)).toBe('manual');
  });

  it('renders Force for force winner', async () => {
    const el = await mountBadge({ winner: 'force' });
    expect(text(el)).toBe('Force');
    expect(kind(el)).toBe('force');
  });

  it('renders Sun protection for weather winner', async () => {
    const el = await mountBadge({ winner: 'weather' });
    expect(text(el)).toBe('Sun protection');
    expect(kind(el)).toBe('weather');
  });

  it('renders Glare for glare_zone winner', async () => {
    const el = await mountBadge({ winner: 'glare_zone' });
    expect(text(el)).toBe('Glare');
    expect(kind(el)).toBe('glare_zone');
  });

  it('renders Climate for climate winner', async () => {
    const el = await mountBadge({ winner: 'climate' });
    expect(text(el)).toBe('Climate');
    expect(kind(el)).toBe('climate');
  });

  it('renders the "Solar tracking" label for the solar winner string', async () => {
    const el = await mountBadge({ winner: 'solar' });
    expect(text(el)).toBe('Solar tracking');
    expect(kind(el)).toBe('solar');
  });

  it('renders Occupancy for motion winner', async () => {
    const el = await mountBadge({ winner: 'motion' });
    expect(text(el)).toBe('Occupancy');
    expect(kind(el)).toBe('motion');
  });

  it('renders Custom with slot number, percent, and floor suffix when minimumMode=true', async () => {
    const el = await mountBadge({
      winner: 'custom_position',
      slotNumber: 1,
      pct: 60,
      minimumMode: true,
    });
    expect(text(el)).toBe('Custom #1 · 60% ↥');
    expect(kind(el)).toBe('custom_position');
  });

  it('renders Custom with friendly slot name when provided', async () => {
    const el = await mountBadge({
      winner: 'custom_position',
      slotNumber: 1,
      slotName: 'Table extension',
      pct: 60,
      minimumMode: true,
    });
    expect(text(el)).toBe('Table extension · 60% ↥');
    expect(kind(el)).toBe('custom_position');
  });

  it('omits floor suffix when minimumMode is unset or false', async () => {
    const exact = await mountBadge({ winner: 'custom_position', slotNumber: 2, pct: 80 });
    expect(text(exact)).toBe('Custom #2 · 80%');

    const noop = await mountBadge({
      winner: 'custom_position',
      slotNumber: 2,
      pct: 80,
      minimumMode: false,
    });
    expect(text(noop)).toBe('Custom #2 · 80%');
  });

  it('renders a red Safety badge (force styling) when safetyActive on a custom_position winner', async () => {
    const el = await mountBadge({
      winner: 'custom_position',
      slotNumber: 5,
      pct: 100,
      safetyActive: true,
    });
    // Label is "Safety", not the purple "Custom · …" string.
    expect(text(el)).toBe('Safety');
    // The kind class stays custom_position (the winner is still a custom slot).
    expect(kind(el)).toBe('custom_position');
    // Visual tokens are the red force styling.
    const span = el.shadowRoot!.querySelector('span.badge') as HTMLElement;
    expect(span.getAttribute('style')).toContain('#b71c1c');
    // The force icon (mdi:flash) is rendered.
    expect(el.shadowRoot!.querySelector('ha-icon')!.getAttribute('icon')).toBe('mdi:flash');
  });

  it('keeps the purple Custom badge when safetyActive is false', async () => {
    const el = await mountBadge({
      winner: 'custom_position',
      slotNumber: 1,
      pct: 60,
      safetyActive: false,
    });
    expect(text(el)).toBe('Custom #1 · 60%');
    expect(kind(el)).toBe('custom_position');
    const span = el.shadowRoot!.querySelector('span.badge') as HTMLElement;
    expect(span.getAttribute('style')).not.toContain('#b71c1c');
  });

  it('accepts per-slot winner strings emitted by the integration (custom_position_3)', async () => {
    const el = await mountBadge({
      winner: 'custom_position_3',
      slotNumber: 3,
      pct: 45,
    });
    expect(text(el)).toBe('Custom #3 · 45%');
    expect(kind(el)).toBe('custom_position');
  });

  it('accepts CamelCase ControlMethod-style winner names', async () => {
    const el = await mountBadge({ winner: 'SolarHandler' });
    expect(text(el)).toBe('Solar tracking');
    expect(kind(el)).toBe('solar');
  });

  it('renders Off when integrationEnabled is false, regardless of winner', async () => {
    const el = await mountBadge({ winner: 'solar', integrationEnabled: false });
    expect(text(el)).toBe('Off');
    expect(kind(el)).toBe('off');
  });

  it('falls back to handler-driven kind when integrationEnabled is left default (true)', async () => {
    const el = await mountBadge({ winner: 'default' });
    expect(text(el)).toBe('Auto');
    expect(kind(el)).toBe('auto');
  });

  it('renders a plain span (not a button) when not resumable', async () => {
    const el = await mountBadge({ winner: 'manual' });
    expect(el.shadowRoot!.querySelector('button.badge')).toBeFalsy();
    expect(el.shadowRoot!.querySelector('span.badge')).toBeTruthy();
  });

  it('renders the "N/M" who-won label with the group icon for kindOverride=group', async () => {
    const el = await mountBadge({ kindOverride: 'group', groupCount: 3, groupTotal: 5 });
    expect(text(el)).toBe('3/5');
    expect(kind(el)).toBe('group');
    const icon = el.shadowRoot!.querySelector('ha-icon');
    expect(icon!.getAttribute('icon')).toBe('mdi:window-shutter-cog');
  });

  it('falls back to the base Group label when counts are absent', async () => {
    const el = await mountBadge({ kindOverride: 'group' });
    expect(text(el)).toBe('Group');
    expect(kind(el)).toBe('group');
  });

  // Issue #185: a member cover the group is driving wins with the group_scene
  // or group_lock handler. Its who-won badge must read "Group" — not "Auto" —
  // so the who-won display actually tells you the group is in control.
  it('renders Group for a group_scene winner', async () => {
    const el = await mountBadge({ winner: 'group_scene' });
    expect(text(el)).toBe('Group');
    expect(kind(el)).toBe('group');
  });

  it('renders Group for a group_lock winner', async () => {
    const el = await mountBadge({ winner: 'group_lock' });
    expect(text(el)).toBe('Group');
    expect(kind(el)).toBe('group');
  });

  it('renders a tappable button and emits acp-resume when resumable', async () => {
    const el = await mountBadge({ winner: 'manual', resumable: true });
    const button = el.shadowRoot!.querySelector('button.badge') as HTMLButtonElement;
    expect(button).toBeTruthy();
    let fired = false;
    el.addEventListener('acp-resume', () => {
      fired = true;
    });
    button.click();
    expect(fired).toBe(true);
  });
});

// Issue #229: while a manual override is active the badge can carry two
// actions. Today's resumable branch makes the *whole badge* a <button>, so a
// second action nested inside it would be invalid HTML and would break Resume.
describe('acp-tile-badge — extendable (#229)', () => {
  it('renders no nested buttons when both actions are present', async () => {
    const el = await mountBadge({
      winner: 'manual',
      manualActive: true,
      resumable: true,
      extendable: true,
    });
    const buttons = Array.from(el.shadowRoot!.querySelectorAll('button'));
    expect(buttons.length).toBeGreaterThan(0);
    for (const b of buttons) {
      expect(b.closest('button')).toBe(b); // no button ancestor other than itself
    }
    // The container is a span, not a button.
    expect(el.shadowRoot!.querySelector('button.badge')).toBeFalsy();
    expect(el.shadowRoot!.querySelector('span.badge.has-actions')).toBeTruthy();
  });

  it('emits acp-extend from the extend button and acp-resume from the resume button — no cross-fire', async () => {
    const el = await mountBadge({
      winner: 'manual',
      manualActive: true,
      resumable: true,
      extendable: true,
    });
    const events: string[] = [];
    el.addEventListener('acp-extend', () => events.push('extend'));
    el.addEventListener('acp-resume', () => events.push('resume'));

    (el.shadowRoot!.querySelector('button.act.extend') as HTMLButtonElement).click();
    expect(events).toEqual(['extend']);

    (el.shadowRoot!.querySelector('button.act.resume') as HTMLButtonElement).click();
    expect(events).toEqual(['extend', 'resume']);
  });

  it('renders the extend button with no resume button when not resumable', async () => {
    const el = await mountBadge({ winner: 'manual', manualActive: true, extendable: true });
    expect(el.shadowRoot!.querySelector('button.act.extend')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('button.act.resume')).toBeFalsy();
  });

  it('stops pointerdown on both action buttons so the tile hold/tap gesture never fires', async () => {
    const el = await mountBadge({
      winner: 'manual',
      manualActive: true,
      resumable: true,
      extendable: true,
    });
    for (const sel of ['button.act.extend', 'button.act.resume']) {
      let leaked = false;
      const host = (e: Event) => {
        if (e.composed) leaked = true;
      };
      document.body.addEventListener('pointerdown', host);
      const btn = el.shadowRoot!.querySelector(sel) as HTMLButtonElement;
      btn.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }));
      document.body.removeEventListener('pointerdown', host);
      expect(leaked, `${sel} leaked pointerdown to the tile`).toBe(false);
    }
  });

  // #81/#82/#199 guard: an active override can render kind `custom_position`.
  // Gating the extend affordance on kind would hide it in exactly that case.
  it('renders the extend button when a custom_position slot wins with an override active', async () => {
    const el = await mountBadge({
      winner: 'custom_position',
      slotNumber: 1,
      pct: 60,
      manualActive: true,
      resumable: true,
      extendable: true,
    });
    expect(kindOf(el, 'span.badge')).toBe('custom_position');
    expect(el.shadowRoot!.querySelector('button.act.extend')).toBeTruthy();
  });

  it('uses the clock-plus icon for extend and keeps restore for resume', async () => {
    const el = await mountBadge({
      winner: 'manual',
      manualActive: true,
      resumable: true,
      extendable: true,
    });
    expect(el.shadowRoot!.querySelector('button.act.extend ha-icon')!.getAttribute('icon')).toBe(
      'mdi:clock-plus-outline',
    );
    expect(el.shadowRoot!.querySelector('button.act.resume ha-icon')!.getAttribute('icon')).toBe(
      'mdi:restore',
    );
  });

  it('leaves the resumable-only markup byte-identical to today when extendable is false', async () => {
    const el = await mountBadge({ winner: 'manual', manualActive: true, resumable: true });
    expect(el.shadowRoot!.querySelector('button.badge.resumable')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.act')).toBeFalsy();
    expect(el.shadowRoot!.querySelector('.badge.has-actions')).toBeFalsy();
  });

  it('drops the leading kind icon in compact + has-actions so the badge stays at three glyphs', async () => {
    const el = await mountBadge({
      winner: 'manual',
      manualActive: true,
      manualEndIso: '2026-05-23T16:51:00Z',
      resumable: true,
      extendable: true,
      compact: true,
    });
    // clock text + extend icon + resume icon — no leading kind icon.
    expect(el.shadowRoot!.querySelector('.badge-icon')).toBeFalsy();
    expect(el.shadowRoot!.querySelectorAll('button.act').length).toBe(2);
  });
});
