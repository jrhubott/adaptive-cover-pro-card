import { describe, it, expect } from 'vitest';
import '../src/components/forecast-strip';
import type { ForecastSample, ForecastEvent } from '../src/types';
import { startOfDay } from '../src/lib/sun-model';

interface StripLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  samples?: ForecastSample[];
  events?: ForecastEvent[];
  now?: number;
}

async function mount(
  samples: ForecastSample[],
  events: ForecastEvent[],
  nowMs?: number,
): Promise<StripLike> {
  const el = document.createElement('acp-forecast-strip') as StripLike;
  el.samples = samples;
  el.events = events;
  if (nowMs !== undefined) el.now = nowMs;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

// All fixtures are anchored to local midnight so tests are timezone-independent.
// DAY_START is midnight local time for a fixed reference date.
const DAY_START = startOfDay(new Date('2026-06-01T12:00:00')).getTime();
// NOW is local noon of the same day.
const NOW = DAY_START + 12 * 3600_000;

function sample(offsetMs: number, position: number, handler = 'solar'): ForecastSample {
  return {
    t: new Date(DAY_START + offsetMs).toISOString(),
    position,
    handler,
  };
}

function event(offsetMs: number, kind: ForecastEvent['kind'], label: string): ForecastEvent {
  return { t: new Date(DAY_START + offsetMs).toISOString(), kind, label };
}

describe('acp-forecast-strip', () => {
  it('renders nothing when samples is empty', async () => {
    const el = await mount([], [], NOW);
    expect(el.shadowRoot!.querySelector('svg')).toBeNull();
  });

  it('renders an SVG with a polyline for the sample series', async () => {
    const samples = [
      sample(0, 0),
      sample(3 * 3600_000, 30),
      sample(6 * 3600_000, 60),
      sample(9 * 3600_000, 100),
    ];
    const el = await mount(samples, [], NOW);
    const svg = el.shadowRoot!.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg!.querySelector('polyline.curve')).toBeTruthy();
  });

  it('plots one event marker per event in the events array', async () => {
    const samples = [sample(0, 0), sample(6 * 3600_000, 50), sample(12 * 3600_000, 100)];
    const events = [
      event(2 * 3600_000, 'sunrise', 'Sunrise'),
      event(7 * 3600_000, 'fov_enter', 'Sun enters FOV'),
      event(11 * 3600_000, 'fov_exit', 'Sun exits FOV'),
    ];
    const el = await mount(samples, events, NOW);
    expect(el.shadowRoot!.querySelectorAll('line.event-marker').length).toBe(3);
  });

  it('skips events whose timestamps fall outside the fixed day window', async () => {
    const samples = [sample(6 * 3600_000, 50), sample(12 * 3600_000, 50)];
    const events = [
      event(9 * 3600_000, 'fov_enter', 'Sun enters FOV'), // inside day
      event(-3600_000, 'sunrise', 'Sunrise'), // before midnight (outside day)
      event(25 * 3600_000, 'sunset', 'Sunset'), // after midnight+24h (outside day)
    ];
    const el = await mount(samples, events, NOW);
    // Only the in-day event renders.
    expect(el.shadowRoot!.querySelectorAll('line.event-marker').length).toBe(1);
  });

  it('preserves the relative position of samples in the polyline points string', async () => {
    const samples = [sample(0, 0), sample(6 * 3600_000, 100)];
    const el = await mount(samples, [], NOW);
    const points = el.shadowRoot!.querySelector('polyline.curve')!.getAttribute('points') ?? '';
    const pairs = points.trim().split(/\s+/);
    expect(pairs.length).toBe(2);
  });

  it('drops samples whose timestamps fall outside the fixed day window from the curve', async () => {
    // A pre-#510 integration walks 12h from `now`, so an evening forecast spills
    // past midnight. Those out-of-day samples must be excluded, not clamped onto
    // the right edge (which would draw a spurious vertical spike).
    const samples = [
      sample(18 * 3600_000, 50), // 18:00 — in day
      sample(23 * 3600_000, 40), // 23:00 — in day
      sample(26 * 3600_000, 30), // 02:00 next day — outside day
      sample(28 * 3600_000, 20), // 04:00 next day — outside day
    ];
    const el = await mount(samples, [], NOW);
    const points = el.shadowRoot!.querySelector('polyline.curve')!.getAttribute('points') ?? '';
    const pairs = points.trim().split(/\s+/).filter(Boolean);
    expect(pairs.length).toBe(2);
  });

  it('renders axis labels: 100% top label and five fixed time-axis tick labels', async () => {
    const samples = [sample(0, 0), sample(12 * 3600_000, 100)];
    const el = await mount(samples, [], NOW);
    const svgEl = el.shadowRoot!.querySelector('svg')!;
    const inner = svgEl.innerHTML;

    // The 100% label must appear in the SVG
    expect(inner).toContain('100%');

    // Five fixed tick labels must all appear
    expect(inner).toContain('00:00');
    expect(inner).toContain('06:00');
    expect(inner).toContain('12:00');
    expect(inner).toContain('18:00');
    expect(inner).toContain('24:00');
  });

  it('renders five fixed time-axis tick labels: 00:00, 06:00, 12:00, 18:00, 24:00', async () => {
    const fullDaySamples = [
      sample(0, 0),
      sample(6 * 3600_000, 50),
      sample(12 * 3600_000, 100),
      sample(18 * 3600_000, 50),
      sample(23 * 3600_000, 0),
    ];
    const el = await mount(fullDaySamples, [], NOW);
    const inner = el.shadowRoot!.querySelector('svg')!.innerHTML;
    expect(inner).toContain('00:00');
    expect(inner).toContain('06:00');
    expect(inner).toContain('12:00');
    expect(inner).toContain('18:00');
    expect(inner).toContain('24:00');
  });

  it('wraps each event in a hoverable group with a richer tooltip', async () => {
    const samples = [sample(0, 0), sample(12 * 3600_000, 100)];
    const events = [
      event(2 * 3600_000, 'sunrise', 'Sunrise'),
      event(6 * 3600_000, 'fov_enter', 'Sun enters FOV'),
      event(10 * 3600_000, 'unknown_kind', 'Mystery'),
    ];
    const el = await mount(samples, events, NOW);
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

  it('renders a now cursor line and places it at x=300 (center) when now is at noon', async () => {
    const samples = [sample(0, 0), sample(12 * 3600_000, 100)];
    // VIEW_W=600, noon = 50% = x300
    const nowNoon = DAY_START + 12 * 3600_000;
    const el = await mount(samples, [], nowNoon);
    const svgEl = el.shadowRoot!.querySelector('svg')!;
    const nowLine = svgEl.querySelector('line.now');
    expect(nowLine).toBeTruthy();
    expect(Number(nowLine!.getAttribute('x1'))).toBeCloseTo(300, 0);
  });

  it('renders a now cursor at x≈0 when now is at the start of the day', async () => {
    const samples = [sample(0, 0), sample(12 * 3600_000, 100)];
    const nowAtStart = DAY_START; // midnight
    const el = await mount(samples, [], nowAtStart);
    const svgEl = el.shadowRoot!.querySelector('svg')!;
    const nowLine = svgEl.querySelector('line.now');
    expect(nowLine).toBeTruthy();
    expect(Number(nowLine!.getAttribute('x1'))).toBeCloseTo(0, 0);
  });

  it('wraps the now cursor in a hoverable group with a current-time tooltip', async () => {
    const samples = [sample(0, 0), sample(12 * 3600_000, 100)];
    const el = await mount(samples, [], NOW);
    const group = el.shadowRoot!.querySelector('g.now-group');
    expect(group).toBeTruthy();
    // Wide invisible hit area + the visible line, mirroring the elevation chart.
    expect(group!.querySelector('line.now-hit')).toBeTruthy();
    expect(group!.querySelector('line.now')).toBeTruthy();
    // The tooltip() directive mirrors its text onto data-tooltip.
    expect(group!.getAttribute('data-tooltip') ?? '').toMatch(/^\d{1,2}:\d{2}/);
  });

  it('renders no secondary-axis track when no sample carries an extra key', async () => {
    const samples = [sample(0, 0), sample(6 * 3600_000, 50), sample(12 * 3600_000, 100)];
    const el = await mount(samples, [], NOW);
    expect(el.shadowRoot!.querySelectorAll('polyline.curve-secondary').length).toBe(0);
  });

  it('renders a secondary-axis polyline when samples carry an extra numeric key', async () => {
    const samples = [
      { ...sample(0, 50), tilt: 20 },
      { ...sample(6 * 3600_000, 60), tilt: 40 },
    ];
    const el = await mount(samples, [], NOW);
    const secondary = el.shadowRoot!.querySelectorAll('polyline.curve-secondary');
    expect(secondary.length).toBe(1);
    const points = secondary[0].getAttribute('points') ?? '';
    const pairs = points.trim().split(/\s+/).filter(Boolean);
    expect(pairs.length).toBe(2);
  });

  it('splits the secondary-axis track into separate segments across a gap', async () => {
    const samples: ForecastSample[] = [
      { ...sample(0, 30), tilt: 10 },
      { ...sample(2 * 3600_000, 40), tilt: 20 },
      sample(6 * 3600_000, 50, 'default'), // gap: no tilt key on this in-day sample
      { ...sample(10 * 3600_000, 60), tilt: 30 },
      { ...sample(12 * 3600_000, 70), tilt: 40 },
    ];
    const el = await mount(samples, [], NOW);
    const secondary = el.shadowRoot!.querySelectorAll('polyline.curve-secondary');
    expect(secondary.length).toBe(2);
  });

  it('type-checks a sample literal carrying an inline secondary-axis key', async () => {
    const literalSample: ForecastSample = {
      t: new Date(DAY_START).toISOString(),
      position: 50,
      handler: 'solar',
      tilt: 20,
    };
    const el = await mount([literalSample], [], NOW);
    expect(el.shadowRoot!.querySelector('polyline.curve-secondary')).toBeTruthy();
  });

  it('includes the secondary-axis value in the hover label when present', async () => {
    const samples = [
      { ...sample(0, 50), tilt: 20 },
      { ...sample(6 * 3600_000, 60), tilt: 40 },
    ];
    const el = await mount(samples, [], NOW);
    const svgEl = el.shadowRoot!.querySelector('svg')!;
    Object.defineProperty(svgEl, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 600, height: 80, right: 600, bottom: 80 }),
      configurable: true,
    });
    svgEl.dispatchEvent(new PointerEvent('pointermove', { clientX: 0, clientY: 5 }));
    await el.updateComplete;
    const label = el.shadowRoot!.querySelector('.hover-label');
    expect(label).toBeTruthy();
    expect(label!.textContent ?? '').toContain('Tilt');
    expect(label!.textContent ?? '').toContain('20%');
  });
});
