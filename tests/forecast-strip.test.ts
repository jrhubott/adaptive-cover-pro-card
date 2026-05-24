import { describe, it, expect } from 'vitest';
import '../src/components/forecast-strip';
import type { ForecastSample, ForecastEvent } from '../src/types';

interface StripLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  samples?: ForecastSample[];
  events?: ForecastEvent[];
}

async function mount(samples: ForecastSample[], events: ForecastEvent[]): Promise<StripLike> {
  const el = document.createElement('acp-forecast-strip') as StripLike;
  el.samples = samples;
  el.events = events;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const NOW = new Date('2026-06-01T06:00:00Z').getTime();

function sample(offsetMinutes: number, position: number, handler = 'solar'): ForecastSample {
  return {
    t: new Date(NOW + offsetMinutes * 60_000).toISOString(),
    position,
    handler,
  };
}

function event(offsetMinutes: number, kind: ForecastEvent['kind'], label: string): ForecastEvent {
  return { t: new Date(NOW + offsetMinutes * 60_000).toISOString(), kind, label };
}

describe('acp-forecast-strip', () => {
  it('renders nothing when samples is empty', async () => {
    const el = await mount([], []);
    expect(el.shadowRoot!.querySelector('svg')).toBeNull();
  });

  it('renders an SVG with a polyline for the sample series', async () => {
    const samples = [sample(0, 0), sample(60, 30), sample(120, 60), sample(180, 100)];
    const el = await mount(samples, []);
    const svg = el.shadowRoot!.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg!.querySelector('polyline.curve')).toBeTruthy();
  });

  it('plots one event marker per event in the events array', async () => {
    const samples = [sample(0, 0), sample(60, 50), sample(120, 100)];
    const events = [
      event(30, 'sunrise', 'Sunrise'),
      event(75, 'fov_enter', 'Sun enters FOV'),
      event(110, 'fov_exit', 'Sun exits FOV'),
    ];
    const el = await mount(samples, events);
    expect(el.shadowRoot!.querySelectorAll('line.event-marker').length).toBe(3);
  });

  it('skips events whose timestamps fall outside the rendered sample range', async () => {
    const samples = [sample(60, 50), sample(120, 50)];
    const events = [
      event(0, 'sunrise', 'Sunrise'), // before first sample
      event(90, 'fov_enter', 'Sun enters FOV'), // inside
      event(240, 'sunset', 'Sunset'), // after last sample
    ];
    const el = await mount(samples, events);
    // Only the in-range event renders.
    expect(el.shadowRoot!.querySelectorAll('line.event-marker').length).toBe(1);
  });

  it('preserves the relative position of samples in the polyline points string', async () => {
    const samples = [sample(0, 0), sample(60, 100)];
    const el = await mount(samples, []);
    const points = el.shadowRoot!.querySelector('polyline.curve')!.getAttribute('points') ?? '';
    const pairs = points.trim().split(/\s+/);
    expect(pairs.length).toBe(2);
  });

  it('wraps each event in a hoverable group with a richer tooltip', async () => {
    const samples = [sample(0, 0), sample(120, 100)];
    const events = [
      event(30, 'sunrise', 'Sunrise'),
      event(60, 'fov_enter', 'Sun enters FOV'),
      event(90, 'unknown_kind', 'Mystery'),
    ];
    const el = await mount(samples, events);
    const groups = el.shadowRoot!.querySelectorAll('g.event-group');
    expect(groups.length).toBe(3);

    // Each group has a wide hit-area line + a visible marker line.
    for (const g of Array.from(groups)) {
      expect(g.querySelector('line.event-hit')).toBeTruthy();
      expect(g.querySelector('line.event-marker')).toBeTruthy();
    }

    const tooltips = Array.from(groups).map((g) => g.getAttribute('data-tooltip') ?? '');
    expect(tooltips[0]).toMatch(/^Sunrise — \d{1,2}:\d{2}/);
    expect(tooltips[1]).toMatch(/^Sun enters window field of view — \d{1,2}:\d{2}/);
    // Unknown kind falls back to the integration-supplied label.
    expect(tooltips[2]).toMatch(/^Mystery — \d{1,2}:\d{2}/);
  });
});
