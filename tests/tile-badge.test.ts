import { describe, it, expect } from 'vitest';
import '../src/components/tile-badge';

interface BadgeLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  winner?: string;
  slotNumber?: number;
  slotName?: string;
  pct?: number;
  minimumMode?: boolean;
  manualEndIso?: string;
  integrationEnabled?: boolean;
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

  it('renders Motion for motion winner', async () => {
    const el = await mountBadge({ winner: 'motion' });
    expect(text(el)).toBe('Motion');
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
});
