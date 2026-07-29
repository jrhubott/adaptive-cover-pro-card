import { describe, it, expect } from 'vitest';
import '../src/components/forecast-strip';
import type { ForecastSample, ForecastEvent, PositionHistorySample } from '../src/types';
import { startOfDay } from '../src/lib/sun-model';

interface StripLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  samples?: ForecastSample[];
  events?: ForecastEvent[];
  history?: PositionHistorySample[];
  now?: number;
  axisLabels?: Record<string, string>;
}

async function mount(
  samples: ForecastSample[],
  events: ForecastEvent[],
  nowMs?: number,
  history?: PositionHistorySample[],
  axisLabels?: Record<string, string>,
): Promise<StripLike> {
  const el = document.createElement('acp-forecast-strip') as StripLike;
  el.samples = samples;
  el.events = events;
  if (history !== undefined) el.history = history;
  if (nowMs !== undefined) el.now = nowMs;
  if (axisLabels !== undefined) el.axisLabels = axisLabels;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

/** Hover the strip at a client-x, with the SVG's layout box stubbed to the
 *  600px viewBox width so client-x and SVG-x are the same number. */
async function hoverAt(el: StripLike, clientX: number): Promise<Element | null> {
  const svgEl = el.shadowRoot!.querySelector('svg')!;
  Object.defineProperty(svgEl, 'getBoundingClientRect', {
    value: () => ({ left: 0, top: 0, width: 600, height: 80, right: 600, bottom: 80 }),
    configurable: true,
  });
  svgEl.dispatchEvent(new PointerEvent('pointermove', { clientX, clientY: 5 }));
  await el.updateComplete;
  return el.shadowRoot!.querySelector('.hover-label');
}

async function hoverFirst(el: StripLike): Promise<Element | null> {
  return hoverAt(el, 0);
}

/** Parse a `<polyline points="...">` string into `[x, y]` vertex pairs. */
function parsePoints(raw: string): Array<[number, number]> {
  return raw
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((pair) => pair.split(',').map(Number) as [number, number]);
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

  function history(offsetMs: number, position: number): PositionHistorySample {
    return { t: new Date(DAY_START + offsetMs).toISOString(), position };
  }

  it('does not render an actual-curve when history is empty', async () => {
    const samples = [sample(0, 0), sample(6 * 3600_000, 60)];
    const el = await mount(samples, [], NOW);
    expect(el.shadowRoot!.querySelector('polyline.actual-curve')).toBeNull();
    expect(el.shadowRoot!.querySelector('.legend')).toBeNull();
  });

  it('renders a second polyline + legend for the actual history series', async () => {
    const samples = [sample(0, 0), sample(6 * 3600_000, 60), sample(12 * 3600_000, 100)];
    const hist = [history(0, 10), history(3 * 3600_000, 40), history(6 * 3600_000, 55)];
    const el = await mount(samples, [], NOW, hist);
    const actual = el.shadowRoot!.querySelector('polyline.actual-curve');
    expect(actual).toBeTruthy();
    // Three real samples + two carry vertices (one per transition) + one
    // terminator holding the last value out to `now`.
    expect(actual!.getAttribute('points')!.trim().split(/\s+/).length).toBe(6);
    // The forecast curve still renders alongside it.
    expect(el.shadowRoot!.querySelector('polyline.curve')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.legend')).toBeTruthy();
  });

  it('drops next-day history samples from the actual-curve', async () => {
    const samples = [sample(6 * 3600_000, 50)];
    const hist = [
      history(6 * 3600_000, 50), // in day
      history(26 * 3600_000, 30), // next day — outside day
    ];
    const el = await mount(samples, [], NOW, hist);
    const points =
      el.shadowRoot!.querySelector('polyline.actual-curve')!.getAttribute('points') ?? '';
    const pts = parsePoints(points);
    // The in-day sample plus a terminator at `now` (12:00 → x=300).
    expect(pts.length).toBe(2);
    expect(pts[0]).toEqual([150.0, 45.0]);
    expect(pts[1]).toEqual([300.0, 45.0]);
    // A next-day sample must be dropped, never clamped onto the right edge —
    // that would draw a spurious spike out to x=600.
    expect(Math.max(...pts.map((p) => p[0]))).toBeLessThan(600);
  });

  it('renders a hold-then-step across a long recorder gap, not a diagonal ramp (issue #255)', async () => {
    // The recorder stores transitions only: the cover held at 20% from 01:00
    // until it moved to 80% at 09:00. Fed raw to a `<polyline>`, SVG linearly
    // interpolates and draws an eight-hour diagonal ramp that claims positions
    // the cover was never at — the forecast-strip twin of issue #253.
    const samples = [sample(0, 0), sample(12 * 3600_000, 100)];
    const hist = [history(3600_000, 20), history(9 * 3600_000, 80)];
    const el = await mount(samples, [], NOW, hist);
    const raw = el.shadowRoot!.querySelector('polyline.actual-curve')!.getAttribute('points') ?? '';
    const pts = parsePoints(raw);

    // 25.0,66.0 225.0,66.0 225.0,24.0 300.0,24.0
    expect(pts.length).toBe(4);
    const [first, held, dropped, terminator] = pts;
    expect(first).toEqual([25.0, 66.0]);
    // The carry vertex repeats the PRE-transition value …
    expect(held[1]).toBeCloseTo(first[1], 5);
    // … strictly after the first vertex …
    expect(held[0]).toBeGreaterThan(first[0]);
    // … and pinned exactly to the transition instant, so the step is vertical.
    // Two raw vertices (today's output) put `held` at the transition's value
    // instead and fail this.
    expect(held[0]).toBeCloseTo(dropped[0], 1);
    expect(dropped[1]).not.toBeCloseTo(first[1], 1);
    // The new value then holds flat out to `now` (12:00 → x=300), NOT out to
    // the day's far edge (24:00 → x=600), where nothing is recorded yet.
    expect(terminator[1]).toBeCloseTo(dropped[1], 5);
    expect(terminator[0]).toBeCloseTo(300, 0);
  });

  it('carries a pre-midnight sample in at the left edge instead of dropping it', async () => {
    // HA's `history_during_period` answers a window query with the state in
    // effect as the window opened, carrying its own un-clamped `last_changed`.
    // Dropping that row erases the entire pre-transition morning.
    const samples = [sample(0, 0), sample(12 * 3600_000, 100)];
    const hist = [history(-3600_000, 40), history(9 * 3600_000, 80)];
    const el = await mount(samples, [], NOW, hist);
    const pts = parsePoints(
      el.shadowRoot!.querySelector('polyline.actual-curve')!.getAttribute('points') ?? '',
    );

    expect(pts.length).toBe(4);
    // Pinned to midnight, not dropped …
    expect(pts[0][0]).toBeCloseTo(0, 5);
    // … and flat from midnight to the 09:00 transition.
    expect(pts[1][1]).toBeCloseTo(pts[0][1], 5);
  });

  it('draws a flat line when the only change predates midnight', async () => {
    // The shape `fetchPositionHistory` really emits for a cover that has not
    // moved today: one pre-window carry row and one forward-filled tail at the
    // window end. One surviving vertex would render an invisible line.
    const samples = [sample(0, 70), sample(12 * 3600_000, 70)];
    const hist = [history(-3 * 3600_000, 70), history(12 * 3600_000, 70)];
    const el = await mount(samples, [], NOW, hist);
    const pts = parsePoints(
      el.shadowRoot!.querySelector('polyline.actual-curve')!.getAttribute('points') ?? '',
    );

    expect(pts.length).toBe(2);
    expect(pts[0]).toEqual([0.0, 31.0]);
    expect(pts[1]).toEqual([300.0, 31.0]);
  });

  it('the hover readout reports the value held at the cursor, never the next transition', async () => {
    // Nearest-by-x-distance reads the FUTURE just before a transition: at
    // 08:00 the 09:00 sample is an hour away and the 01:00 one is seven, so a
    // distance lookup reports 80% while the line under the cursor sits at 20%.
    const samples = [sample(0, 5), sample(8 * 3600_000, 45), sample(10 * 3600_000, 55)];
    const hist = [history(3600_000, 20), history(9 * 3600_000, 80)];
    const el = await mount(samples, [], NOW, hist);

    // x=200 → the 08:00 sample, still inside the 20% hold.
    const before = await hoverAt(el, 200);
    expect(before).toBeTruthy();
    expect(before!.textContent ?? '').toContain('20%');
    expect(before!.textContent ?? '').not.toContain('80%');

    // x=250 → the 10:00 sample, after the transition.
    const after = await hoverAt(el, 250);
    expect(after!.textContent ?? '').toContain('80%');
  });

  it('renders the strip from history alone when there are no forecast samples', async () => {
    const hist = [history(0, 10), history(6 * 3600_000, 50)];
    const el = await mount([], [], NOW, hist);
    expect(el.shadowRoot!.querySelector('svg')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('polyline.actual-curve')).toBeTruthy();
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
    expect(tooltips[1]).toMatch(/^Sun enters window sun acceptance angle — \d{1,2}:\d{2}/);
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
    const label = await hoverFirst(el);
    expect(label).toBeTruthy();
    expect(label!.textContent ?? '').toContain('Tilt');
    expect(label!.textContent ?? '').toContain('20%');
  });

  it('uses a discovery-supplied axisLabel for an unknown secondary axis key', async () => {
    const samples = [
      { ...sample(0, 50), elevation: 15 },
      { ...sample(6 * 3600_000, 60), elevation: 25 },
    ];
    // Discovery label deliberately differs from the capitalized key ("Elevation")
    // so this proves the axisLabels override is consulted, not the fallback.
    const el = await mount(samples, [], NOW, undefined, { elevation: 'Sun height' });
    const label = await hoverFirst(el);
    expect(label).toBeTruthy();
    expect(label!.textContent ?? '').toContain('Sun height');
    expect(label!.textContent ?? '').toContain('15%');
  });

  it('still prefers the card i18n tilt label over an axisLabels override for tilt', async () => {
    const samples = [
      { ...sample(0, 50), tilt: 20 },
      { ...sample(6 * 3600_000, 60), tilt: 40 },
    ];
    const el = await mount(samples, [], NOW, undefined, { tilt: 'ShouldNotWin' });
    const label = await hoverFirst(el);
    expect(label!.textContent ?? '').toContain('Tilt');
    expect(label!.textContent ?? '').not.toContain('ShouldNotWin');
  });
});
