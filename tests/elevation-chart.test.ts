import { describe, it, expect, vi, afterEach } from 'vitest';
import '../src/components/elevation-chart';
import { ElevationChart } from '../src/components/elevation-chart';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities, SunPositionAttributes } from '../src/types';
import { formatClock } from '../src/lib/formatters';

const VIEWBOX_H = 160;
const PAD_B = 22;

interface ChartLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  discoveredList?: DiscoveredEntities[];
  coverColors?: (string | null | undefined)[];
  compact?: boolean;
}

const discovered: DiscoveredEntities = {
  entry_id: 'entry1',
  entry_title: 'Test',
  cover_type: 'cover_blind',
  entities: { sun_sensor: 'sensor.sun_position' },
  managed_covers: [],
};

function hass(attrs: Partial<SunPositionAttributes>): HomeAssistant {
  return {
    config: { latitude: 52.0, longitude: 4.0, time_zone: 'UTC' },
    states: {
      'sensor.sun_position': {
        state: '30',
        attributes: {
          elevation: 30,
          gamma: 0,
          window_azimuth: 180,
          fov_left: 90,
          fov_right: 90,
          azimuth_min: 90,
          azimuth_max: 270,
          in_fov: true,
          ...attrs,
        },
      },
    },
  } as unknown as HomeAssistant;
}

async function mount(props: Partial<ChartLike>): Promise<ChartLike> {
  const el = document.createElement('acp-elevation-chart') as ChartLike;
  Object.assign(el, props);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function svgViewBoxHeight(el: ChartLike): number {
  const svg = el.shadowRoot!.querySelector('svg')!;
  const vb = svg.getAttribute('viewBox')!.split(/\s+/).map(Number);
  return vb[3];
}

describe('acp-elevation-chart: single-window (legacy, unchanged)', () => {
  it('draws two limit lines when both min_elevation and max_elevation are set', async () => {
    const el = await mount({
      hass: hass({ min_elevation: 10, max_elevation: 60 }),
      discoveredList: [discovered],
    });
    const lines = el.shadowRoot!.querySelectorAll('line.limit-line');
    expect(lines.length).toBe(2);
  });

  it('draws no limit lines when neither limit is set', async () => {
    const el = await mount({ hass: hass({}), discoveredList: [discovered] });
    const lines = el.shadowRoot!.querySelectorAll('line.limit-line');
    expect(lines.length).toBe(0);
  });

  it('draws one limit line when only min_elevation is set', async () => {
    const el = await mount({ hass: hass({ min_elevation: 10 }), discoveredList: [discovered] });
    const lines = el.shadowRoot!.querySelectorAll('line.limit-line');
    expect(lines.length).toBe(1);
  });

  it('clips the FOV band y-extent to the elevation band when limits are present', async () => {
    const clipped = await mount({
      hass: hass({ min_elevation: 10, max_elevation: 60 }),
      discoveredList: [discovered],
    });
    const full = await mount({ hass: hass({}), discoveredList: [discovered] });

    const clippedRect = clipped.shadowRoot!.querySelector('rect.fov-band');
    const fullRect = full.shadowRoot!.querySelector('rect.fov-band');
    expect(clippedRect).toBeTruthy();
    expect(fullRect).toBeTruthy();

    const clippedY = parseFloat(clippedRect!.getAttribute('y')!);
    const clippedH = parseFloat(clippedRect!.getAttribute('height')!);
    const fullY = parseFloat(fullRect!.getAttribute('y')!);
    const fullH = parseFloat(fullRect!.getAttribute('height')!);

    expect(clippedY).toBeGreaterThan(fullY);
    expect(clippedH).toBeLessThan(fullH);
  });

  it('renders full-height FOV bands (unchanged) when no limits are set', async () => {
    const el = await mount({ hass: hass({}), discoveredList: [discovered] });
    const rect = el.shadowRoot!.querySelector('rect.fov-band');
    expect(rect).toBeTruthy();
    // PAD_T = 10, VIEWBOX_H = 160, PAD_B = 22 → full height = 128, y = 10.
    expect(parseFloat(rect!.getAttribute('y')!)).toBeCloseTo(10);
    expect(parseFloat(rect!.getAttribute('height')!)).toBeCloseTo(128);
  });

  it('keeps legacy gold fill (no inline style) for a single window', async () => {
    const el = await mount({ hass: hass({}), discoveredList: [discovered] });
    const rect = el.shadowRoot!.querySelector('rect.fov-band');
    expect(rect).toBeTruthy();
    const style = rect!.getAttribute('style') ?? '';
    expect(style).not.toMatch(/fill\s*:/);
  });

  it('renders NO ribbon bars or tracks for a single window', async () => {
    const el = await mount({ hass: hass({}), discoveredList: [discovered] });
    expect(el.shadowRoot!.querySelectorAll('rect.ribbon-bar').length).toBe(0);
    expect(el.shadowRoot!.querySelectorAll('rect.ribbon-track').length).toBe(0);
  });

  it('keeps viewBox height 160 and no inline aspect-ratio for a single window', async () => {
    const el = await mount({ hass: hass({}), discoveredList: [discovered] });
    expect(svgViewBoxHeight(el)).toBe(160);
    const style = el.shadowRoot!.querySelector('svg')!.getAttribute('style') ?? '';
    expect(style).not.toMatch(/aspect-ratio/);
  });

  it('now-cursor y2 ends at the plot bottom for a single window', async () => {
    const el = await mount({ hass: hass({}), discoveredList: [discovered] });
    const now = el.shadowRoot!.querySelector('line.now')!;
    expect(parseFloat(now.getAttribute('y2')!)).toBeCloseTo(VIEWBOX_H - PAD_B);
  });
});

const discoveredSouth: DiscoveredEntities = {
  entry_id: 'south',
  entry_title: 'Living Room',
  cover_type: 'cover_blind',
  entities: { sun_sensor: 'sensor.sun_south' },
  managed_covers: [],
};
const discoveredWest: DiscoveredEntities = {
  entry_id: 'west',
  entry_title: 'Office',
  cover_type: 'cover_blind',
  entities: { sun_sensor: 'sensor.sun_west' },
  managed_covers: [],
};
const discoveredEast: DiscoveredEntities = {
  entry_id: 'east',
  entry_title: 'Bedroom',
  cover_type: 'cover_blind',
  entities: { sun_sensor: 'sensor.sun_east' },
  managed_covers: [],
};

function sunState(attrs: Partial<SunPositionAttributes>) {
  return {
    state: '30',
    attributes: {
      elevation: 30,
      gamma: 0,
      fov_left: 90,
      fov_right: 90,
      in_fov: true,
      ...attrs,
    },
  };
}

function multiHass(states: Record<string, Partial<SunPositionAttributes>>): HomeAssistant {
  const built: Record<string, unknown> = {};
  for (const [id, attrs] of Object.entries(states)) {
    built[id] = sunState(attrs);
  }
  return {
    config: { latitude: 52.0, longitude: 4.0, time_zone: 'UTC' },
    states: built,
  } as unknown as HomeAssistant;
}

function twoWindowHass(): HomeAssistant {
  return multiHass({
    'sensor.sun_south': { window_azimuth: 180 },
    'sensor.sun_west': { window_azimuth: 270 },
  });
}

function ribbonRanges(el: ChartLike, fill: string) {
  return Array.from(el.shadowRoot!.querySelectorAll('rect.ribbon-bar'))
    .filter((r) => (r.getAttribute('style') ?? '').includes(fill))
    .map((r) => {
      const y = parseFloat(r.getAttribute('y')!);
      const h = parseFloat(r.getAttribute('height')!);
      return { top: y, bottom: y + h };
    });
}

describe('acp-elevation-chart: multi-window ribbon', () => {
  it('renders a ribbon (bars) and NO in-plot fov-band rects', async () => {
    const el = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const bars = el.shadowRoot!.querySelectorAll('rect.ribbon-bar');
    expect(bars.length).toBeGreaterThanOrEqual(2);
    // No per-window in-plot bands in multi mode.
    expect(el.shadowRoot!.querySelectorAll('rect.fov-band').length).toBe(0);
  });

  it('color-keys each window bar with an inline fill', async () => {
    const el = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const fills = Array.from(el.shadowRoot!.querySelectorAll('rect.ribbon-bar')).map(
      (r) => r.getAttribute('style') ?? '',
    );
    expect(fills.some((s) => s.includes('#ff7043'))).toBe(true);
    expect(fills.some((s) => s.includes('#7e57c2'))).toBe(true);
  });

  it('draws no per-window limit-lines in the plot for multi-window', async () => {
    const el = await mount({
      hass: multiHass({
        'sensor.sun_south': { window_azimuth: 180, min_elevation: 10, max_elevation: 60 },
        'sensor.sun_west': { window_azimuth: 270 },
      }),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    expect(el.shadowRoot!.querySelectorAll('line.limit-line').length).toBe(0);
  });

  it('renders a background track per window even when it has no FOV runs today', async () => {
    const el = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    expect(el.shadowRoot!.querySelectorAll('rect.ribbon-track').length).toBe(2);
  });

  it('gives each ribbon bar a <title> tooltip with the window name and FOV time range', async () => {
    const el = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const bars = el.shadowRoot!.querySelectorAll('rect.ribbon-bar');
    expect(bars.length).toBeGreaterThan(0);
    const titles = Array.from(bars).map((b) => b.querySelector('title')?.textContent ?? '');
    // Every bar carries a tooltip; at least one names a window with a → range.
    expect(titles.every((tx) => tx.length > 0)).toBe(true);
    expect(titles.some((tx) => tx.includes('Living Room') && tx.includes('→'))).toBe(true);
    expect(titles.some((tx) => tx.includes('Office') && tx.includes('→'))).toBe(true);
  });

  it('labels each ribbon track with its window name for empty-row identification', async () => {
    const el = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const trackTitles = Array.from(el.shadowRoot!.querySelectorAll('rect.ribbon-track')).map(
      (r) => r.querySelector('title')?.textContent ?? '',
    );
    expect(trackTitles.some((tx) => tx.includes('Living Room'))).toBe(true);
    expect(trackTitles.some((tx) => tx.includes('Office'))).toBe(true);
  });

  it('stacks window rows disjoint and ordered, inside the plot grid', async () => {
    const el = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const south = ribbonRanges(el, '#ff7043');
    const west = ribbonRanges(el, '#7e57c2');
    expect(south.length).toBeGreaterThan(0);
    expect(west.length).toBeGreaterThan(0);
    const southBottom = Math.max(...south.map((r) => r.bottom));
    const westTop = Math.min(...west.map((r) => r.top));
    // Window 0 sits in a higher row than window 1 (non-overlapping y-ranges).
    expect(southBottom).toBeLessThanOrEqual(westTop + 0.01);
    // The ribbon now lives INSIDE the plot, anchored to the bottom band just
    // above the time axis (not appended below the plot block).
    const axisY = VIEWBOX_H - PAD_B;
    const allTops = [...south, ...west].map((r) => r.top);
    const allBottoms = [...south, ...west].map((r) => r.bottom);
    expect(Math.max(...allBottoms)).toBeLessThanOrEqual(axisY + 0.01);
    // Bottom-anchored: rows sit in the lower half of the plot.
    expect(Math.min(...allTops)).toBeGreaterThan(axisY / 2);
  });

  it('keeps the viewBox height fixed at 160 with no inline aspect-ratio, any window count', async () => {
    const two = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const three = await mount({
      hass: multiHass({
        'sensor.sun_south': { window_azimuth: 180 },
        'sensor.sun_west': { window_azimuth: 270 },
        'sensor.sun_east': { window_azimuth: 90 },
      }),
      discoveredList: [discoveredSouth, discoveredWest, discoveredEast],
      coverColors: ['#ff7043', '#7e57c2', '#26a69a'],
    });
    // The ribbon is overlaid inside the plot, so the viewBox no longer grows
    // with window count and there's no dynamic inline aspect-ratio.
    expect(svgViewBoxHeight(two)).toBe(160);
    expect(svgViewBoxHeight(three)).toBe(160);
    const style = two.shadowRoot!.querySelector('svg')!.getAttribute('style') ?? '';
    expect(style).not.toMatch(/aspect-ratio/);
  });

  it('ends the now-cursor at the time axis in multi mode (ribbon is in-plot)', async () => {
    const el = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const now = el.shadowRoot!.querySelector('line.now')!;
    // Ribbon moved inside the plot, so the cursor stops at the axis like the
    // single-window case rather than extending into an appended strip below.
    expect(parseFloat(now.getAttribute('y2')!)).toBeCloseTo(VIEWBOX_H - PAD_B);
  });

  it('renders NO per-window legend in the head (the compass legend covers it)', async () => {
    const el = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    const head = el.shadowRoot!.querySelector('.head')!;
    // No swatch list and no per-window names duplicated from the compass legend.
    expect(head.querySelector('.fov-list')).toBeNull();
    expect(head.querySelector('.swatch')).toBeNull();
    expect(head.textContent ?? '').not.toContain('Living Room');
    expect(head.textContent ?? '').not.toContain('Office');
  });

  it('anchors the ribbon band to the bottom of the plot, just above the time axis', async () => {
    const el = await mount({
      hass: twoWindowHass(),
      discoveredList: [discoveredSouth, discoveredWest],
      coverColors: ['#ff7043', '#7e57c2'],
    });
    // viewBox stays a fixed 400x160 — the ribbon is overlaid, not appended.
    expect(svgViewBoxHeight(el)).toBe(160);
    const axisY = VIEWBOX_H - PAD_B;
    // The lowest ribbon track bottom sits just above the time axis (a small
    // inset), inside the plot — not below the plot block.
    const trackBottoms = Array.from(el.shadowRoot!.querySelectorAll('rect.ribbon-track')).map(
      (r) => parseFloat(r.getAttribute('y')!) + parseFloat(r.getAttribute('height')!),
    );
    const lowest = Math.max(...trackBottoms);
    expect(lowest).toBeLessThanOrEqual(axisY + 0.01);
    expect(axisY - lowest).toBeLessThanOrEqual(8);
  });
});

// Build a tz-aware UTC ISO datetime at HH:MM on TODAY (the chart anchors its
// x-domain to the start of today in the configured zone). dayOffset rolls the
// datetime to a later day (e.g. a next-day-rolled midnight end).
function todayIso(hour: number, minute = 0, dayOffset = 0): string {
  const d = new Date();
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + dayOffset, hour, minute, 0),
  ).toISOString();
}

const discoveredWithControl: DiscoveredEntities = {
  entry_id: 'entry1',
  entry_title: 'Test',
  cover_type: 'cover_blind',
  entities: { sun_sensor: 'sensor.sun_position', control_status_sensor: 'sensor.control_status' },
  managed_covers: [],
};

function scheduleHass(scheduleAttrs: Record<string, unknown> | null): HomeAssistant {
  const states: Record<string, unknown> = {
    'sensor.sun_position': {
      state: '30',
      attributes: {
        elevation: 30,
        gamma: 0,
        window_azimuth: 180,
        fov_left: 90,
        fov_right: 90,
        azimuth_min: 90,
        azimuth_max: 270,
        in_fov: true,
      },
    },
  };
  if (scheduleAttrs) {
    states['sensor.control_status'] = { state: 'solar', attributes: scheduleAttrs };
  }
  return {
    config: { latitude: 52.0, longitude: 4.0, time_zone: 'UTC' },
    states,
  } as unknown as HomeAssistant;
}

describe('acp-elevation-chart: schedule window (issue #128)', () => {
  it('renders off-schedule zones and start/end bars when both bounds are present', async () => {
    const el = await mount({
      hass: scheduleHass({
        schedule_start: todayIso(7, 30),
        schedule_end: todayIso(21, 0),
      }),
      discoveredList: [discoveredWithControl],
    });
    // Normal in-day window 07:30–21:00 → two off-schedule edge bands.
    expect(el.shadowRoot!.querySelectorAll('rect.off-schedule-zone').length).toBe(2);
    // A start bar and an end bar (both true fractions are in-domain).
    expect(el.shadowRoot!.querySelectorAll('line.schedule-bar').length).toBe(2);
  });

  it('labels each schedule bar with its clock time in a tick distinct from axis ticks', async () => {
    const startIso = todayIso(7, 30);
    const endIso = todayIso(21, 0);
    const el = await mount({
      hass: scheduleHass({ schedule_start: startIso, schedule_end: endIso }),
      discoveredList: [discoveredWithControl],
    });
    const tickTexts = Array.from(el.shadowRoot!.querySelectorAll('text.schedule-tick')).map(
      (t) => t.textContent ?? '',
    );
    expect(tickTexts.length).toBe(2);
    expect(tickTexts.join(' ')).toContain(formatClock(startIso, 'UTC'));
    expect(tickTexts.join(' ')).toContain(formatClock(endIso, 'UTC'));
  });

  it('renders nothing schedule-related when control_status_sensor is absent', async () => {
    const el = await mount({
      hass: scheduleHass(null),
      discoveredList: [discovered], // no control_status_sensor on this entry
    });
    expect(el.shadowRoot!.querySelectorAll('rect.off-schedule-zone').length).toBe(0);
    expect(el.shadowRoot!.querySelectorAll('line.schedule-bar').length).toBe(0);
    // The sun curve still renders — chart is otherwise unchanged.
    expect(el.shadowRoot!.querySelector('polyline.curve')).toBeTruthy();
  });

  it('renders nothing schedule-related when both bounds are null', async () => {
    const el = await mount({
      hass: scheduleHass({ schedule_start: null, schedule_end: null }),
      discoveredList: [discoveredWithControl],
    });
    expect(el.shadowRoot!.querySelectorAll('rect.off-schedule-zone').length).toBe(0);
    expect(el.shadowRoot!.querySelectorAll('line.schedule-bar').length).toBe(0);
    expect(el.shadowRoot!.querySelector('polyline.curve')).toBeTruthy();
  });

  it('renders a single bar + single zone for an open-ended (null end) window', async () => {
    const el = await mount({
      hass: scheduleHass({ schedule_start: todayIso(7, 30), schedule_end: null }),
      discoveredList: [discoveredWithControl],
    });
    expect(el.shadowRoot!.querySelectorAll('rect.off-schedule-zone').length).toBe(1);
    expect(el.shadowRoot!.querySelectorAll('line.schedule-bar').length).toBe(1);
  });

  it('renders the schedule summary in the head for a normal window', async () => {
    const startIso = todayIso(7, 30);
    const endIso = todayIso(21, 0);
    const el = await mount({
      hass: scheduleHass({ schedule_start: startIso, schedule_end: endIso }),
      discoveredList: [discoveredWithControl],
    });
    const head = el.shadowRoot!.querySelector('.head')!;
    expect(head.textContent ?? '').toContain(formatClock(startIso, 'UTC'));
    expect(head.textContent ?? '').toContain(formatClock(endIso, 'UTC'));
    expect(head.textContent ?? '').toContain('Schedule');
  });

  it('renders an open-ended head summary when one bound is null', async () => {
    const endIso = todayIso(21, 0);
    const el = await mount({
      hass: scheduleHass({ schedule_start: null, schedule_end: endIso }),
      discoveredList: [discoveredWithControl],
    });
    const head = el.shadowRoot!.querySelector('.head')!;
    expect(head.textContent ?? '').toContain(formatClock(endIso, 'UTC'));
    // "Schedule until 21:00" — no start time present.
    expect(head.textContent ?? '').toMatch(/until/i);
  });
});

describe('acp-elevation-chart: sun-dot 3-way state (issue #137)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  // Pin `now` to local noon at the equator so the interpolated sun sample is
  // reliably above the horizon and the sun-dot renders deterministically.
  function dayHass(opts: {
    sunState?: string;
    directSunValid?: boolean;
    inFov?: boolean;
    withDecisionTrace?: boolean;
  }): HomeAssistant {
    const now = new Date();
    vi.setSystemTime(
      new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0)),
    );
    const states: Record<string, unknown> = {
      'sensor.sun_position': {
        state: '180',
        attributes: {
          elevation: 80,
          gamma: 0,
          window_azimuth: 180,
          fov_left: 90,
          fov_right: 90,
          azimuth_min: 90,
          azimuth_max: 270,
          in_fov: opts.inFov ?? true,
        },
      },
    };
    if (opts.withDecisionTrace !== false) {
      states['sensor.decision_trace'] = {
        state: 'ok',
        attributes: {
          ...(opts.sunState !== undefined ? { sun_state: opts.sunState } : {}),
          ...(opts.directSunValid !== undefined ? { direct_sun_valid: opts.directSunValid } : {}),
        },
      };
    }
    return {
      config: { latitude: 0, longitude: 0, time_zone: 'UTC' },
      states,
    } as unknown as HomeAssistant;
  }

  const discoveredWithTrace: DiscoveredEntities = {
    entry_id: 'entry1',
    entry_title: 'Test',
    cover_type: 'cover_blind',
    entities: {
      sun_sensor: 'sensor.sun_position',
      decision_trace_sensor: 'sensor.decision_trace',
    },
    managed_covers: [],
  };

  it('renders sun-dot "valid" when hitting', async () => {
    const el = await mount({
      hass: dayHass({ sunState: 'hitting', directSunValid: true, inFov: true }),
      discoveredList: [discoveredWithTrace],
    });
    const dot = el.shadowRoot!.querySelector('circle.sun-dot') as SVGCircleElement;
    expect(dot).toBeTruthy();
    expect(dot.classList.contains('valid')).toBe(true);
    expect(dot.classList.contains('in-fov')).toBe(false);
  });

  it('renders sun-dot "in-fov" when in FOV but not hitting', async () => {
    const el = await mount({
      hass: dayHass({ sunState: 'in_fov_not_valid', directSunValid: false, inFov: true }),
      discoveredList: [discoveredWithTrace],
    });
    const dot = el.shadowRoot!.querySelector('circle.sun-dot') as SVGCircleElement;
    expect(dot).toBeTruthy();
    expect(dot.classList.contains('in-fov')).toBe(true);
    expect(dot.classList.contains('valid')).toBe(false);
    expect(dot.classList.contains('up')).toBe(false);
  });

  it('renders sun-dot "up" when outside FOV', async () => {
    const el = await mount({
      hass: dayHass({ sunState: 'outside_fov', directSunValid: false, inFov: false }),
      discoveredList: [discoveredWithTrace],
    });
    const dot = el.shadowRoot!.querySelector('circle.sun-dot') as SVGCircleElement;
    expect(dot).toBeTruthy();
    expect(dot.classList.contains('up')).toBe(true);
    expect(dot.classList.contains('in-fov')).toBe(false);
  });

  it('falls back to deriving from direct_sun_valid + in_fov when sun_state absent', async () => {
    const el = await mount({
      hass: dayHass({ directSunValid: false, inFov: true }),
      discoveredList: [discoveredWithTrace],
    });
    const dot = el.shadowRoot!.querySelector('circle.sun-dot') as SVGCircleElement;
    expect(dot).toBeTruthy();
    expect(dot.classList.contains('in-fov')).toBe(true);
    expect(dot.classList.contains('valid')).toBe(false);
  });

  it('exposes a .sun-dot.in-fov gold CSS rule', () => {
    const cssText = (ElevationChart as unknown as { styles: { cssText: string } }).styles.cssText;
    const idx = cssText.indexOf('.sun-dot.in-fov');
    expect(idx).toBeGreaterThan(-1);
    const block = cssText.slice(cssText.indexOf('{', idx), cssText.indexOf('}', idx));
    expect(block).toContain('var(--warning-color, gold)');
  });
});
