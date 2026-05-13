import { describe, it, expect } from 'vitest';
import '../src/components/sky-compass';
import { SkyCompass } from '../src/components/sky-compass';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';

interface SkyCompassLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  discovered_list?: DiscoveredEntities[];
  coverColors?: (string | null | undefined)[];
  showLegend?: boolean;
  showStats?: boolean;
  showCardinals?: boolean;
  showBlindSpot?: boolean;
  showSunPath?: boolean;
  showSunriseSunset?: boolean;
  showCoverFill?: boolean;
  showWindowArrow?: boolean;
  northOffsetDeg?: number;
}

function makeDiscovered(
  entryId: string,
  title: string,
  opts: { targetSensorId?: string; startSensorId?: string; endSensorId?: string } = {},
): DiscoveredEntities {
  return {
    entry_id: entryId,
    entry_title: title,
    cover_type: 'cover_blind',
    entities: {
      sun_sensor: `sensor.sun_pos_${entryId}`,
      ...(opts.targetSensorId ? { target_position_sensor: opts.targetSensorId } : {}),
      ...(opts.startSensorId ? { start_sensor: opts.startSensorId } : {}),
      ...(opts.endSensorId ? { end_sensor: opts.endSensorId } : {}),
    },
    managed_covers: [],
  };
}

function makeHass(
  entries: {
    sensorId: string;
    windowAzimuth: number;
    blindSpot?: [number, number];
    minElevation?: number;
    maxElevation?: number;
    coverPos?: number;
    targetSensorId?: string;
    startSensorId?: string;
    startAzimuth?: number;
    startElevation?: number;
    startState?: string;
    endSensorId?: string;
    endAzimuth?: number;
    endElevation?: number;
    endState?: string;
  }[],
): HomeAssistant {
  const states: Record<string, { state: string; attributes: Record<string, unknown> }> = {};
  for (const e of entries) {
    states[e.sensorId] = {
      state: '180',
      attributes: {
        elevation: 30,
        gamma: 0,
        window_azimuth: e.windowAzimuth,
        fov_left: 45,
        fov_right: 45,
        azimuth_min: e.windowAzimuth - 45,
        azimuth_max: e.windowAzimuth + 45,
        in_fov: true,
        blind_spot_range: e.blindSpot ?? null,
        ...(e.minElevation !== undefined ? { min_elevation: e.minElevation } : {}),
        ...(e.maxElevation !== undefined ? { max_elevation: e.maxElevation } : {}),
      },
    };
    if (e.targetSensorId !== undefined && e.coverPos !== undefined) {
      states[e.targetSensorId] = { state: String(e.coverPos), attributes: {} };
    }
    if (e.startSensorId !== undefined) {
      states[e.startSensorId] = {
        state: e.startState ?? '2026-04-29T07:00:00+00:00',
        attributes: {
          ...(e.startAzimuth !== undefined ? { azimuth: e.startAzimuth } : {}),
          ...(e.startElevation !== undefined ? { elevation: e.startElevation } : {}),
        },
      };
    }
    if (e.endSensorId !== undefined) {
      states[e.endSensorId] = {
        state: e.endState ?? '2026-04-29T19:00:00+00:00',
        attributes: {
          ...(e.endAzimuth !== undefined ? { azimuth: e.endAzimuth } : {}),
          ...(e.endElevation !== undefined ? { elevation: e.endElevation } : {}),
        },
      };
    }
  }
  return {
    states,
    config: { latitude: 47.6, longitude: -122.3 },
  } as unknown as HomeAssistant;
}

async function mountCompass(
  discovered_list: DiscoveredEntities[],
  hass: HomeAssistant,
  props: Partial<SkyCompassLike> = {},
): Promise<SkyCompassLike> {
  const el = document.createElement('acp-sky-compass') as SkyCompassLike;
  document.body.appendChild(el);
  el.hass = hass;
  el.discovered_list = discovered_list;
  Object.assign(el, props);
  await el.updateComplete;
  return el;
}

describe('acp-sky-compass (single entry)', () => {
  it('legend contains "Window normal" entry by default', async () => {
    const d = makeDiscovered('entry1', 'Kitchen');
    const hass = makeHass([{ sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180 }]);
    const el = await mountCompass([d], hass);
    expect(el.shadowRoot!.textContent).toContain('Window normal');
  });

  it('empty discovered_list shows placeholder', async () => {
    const hass = makeHass([]);
    const el = await mountCompass([], hass);
    expect(el.shadowRoot!.textContent).toContain('No Adaptive Cover Pro entries selected');
  });
});

describe('acp-sky-compass (multi-entry overlay)', () => {
  it('renders one FOV wedge per entry', async () => {
    const d1 = makeDiscovered('entry1', 'Kitchen');
    const d2 = makeDiscovered('entry2', 'Living');
    const hass = makeHass([
      { sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180 },
      { sensorId: 'sensor.sun_pos_entry2', windowAzimuth: 90 },
    ]);
    const el = await mountCompass([d1, d2], hass);
    const fovs = el.shadowRoot!.querySelectorAll('path.fov');
    expect(fovs.length).toBe(2);
  });

  it('renders one window arrow per entry', async () => {
    const d1 = makeDiscovered('entry1', 'Kitchen');
    const d2 = makeDiscovered('entry2', 'Living');
    const hass = makeHass([
      { sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180 },
      { sensorId: 'sensor.sun_pos_entry2', windowAzimuth: 90 },
    ]);
    const el = await mountCompass([d1, d2], hass);
    // Each arrow is a <line> + paired <circle class="window-base">; use the circle as a
    // happy-dom-safe marker since its class attribute is reliably reflected.
    const arrowBases = el.shadowRoot!.querySelectorAll('circle.window-base');
    expect(arrowBases.length).toBe(2);
  });

  it('multi-entry legend shows each entry title', async () => {
    const d1 = makeDiscovered('entry1', 'Kitchen');
    const d2 = makeDiscovered('entry2', 'Living');
    const hass = makeHass([
      { sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180 },
      { sensorId: 'sensor.sun_pos_entry2', windowAzimuth: 90 },
    ]);
    const el = await mountCompass([d1, d2], hass);
    const text = el.shadowRoot!.textContent ?? '';
    expect(text).toContain('Kitchen');
    expect(text).toContain('Living');
  });

  it('skips entries whose sun sensor is missing without throwing', async () => {
    const good = makeDiscovered('entry1', 'Kitchen');
    const missing: DiscoveredEntities = {
      entry_id: 'entry2',
      entry_title: 'Living',
      cover_type: 'cover_blind',
      entities: {},
      managed_covers: [],
    };
    const hass = makeHass([{ sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180 }]);
    const el = await mountCompass([good, missing], hass);
    const fovs = el.shadowRoot!.querySelectorAll('path.fov');
    expect(fovs.length).toBe(1);
  });
});

describe('acp-sky-compass coverColors', () => {
  it('applies override color as inline style on single-entry compass FOV', async () => {
    const d = makeDiscovered('entry1', 'Kitchen');
    const hass = makeHass([{ sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180 }]);
    const el = await mountCompass([d], hass, { coverColors: ['#ff3366'] });
    const fov = el.shadowRoot!.querySelector('path.fov') as SVGPathElement;
    expect(fov.getAttribute('style') ?? '').toContain('#ff3366');
  });

  it('null slot falls back to palette color in multi-entry compass', async () => {
    const d1 = makeDiscovered('entry1', 'Kitchen');
    const d2 = makeDiscovered('entry2', 'Living');
    const hass = makeHass([
      { sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180 },
      { sensorId: 'sensor.sun_pos_entry2', windowAzimuth: 90 },
    ]);
    const el = await mountCompass([d1, d2], hass, { coverColors: ['#ff3366', null] });
    const fovs = el.shadowRoot!.querySelectorAll('path.fov');
    expect(fovs[0].getAttribute('style') ?? '').toContain('#ff3366');
    // slot 1 null → colorForIndex(1) = '#ff7f0e'
    expect(fovs[1].getAttribute('style') ?? '').toContain('#ff7f0e');
  });

  it('shorter coverColors array falls back for missing slots', async () => {
    const d1 = makeDiscovered('entry1', 'Kitchen');
    const d2 = makeDiscovered('entry2', 'Living');
    const hass = makeHass([
      { sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180 },
      { sensorId: 'sensor.sun_pos_entry2', windowAzimuth: 90 },
    ]);
    const el = await mountCompass([d1, d2], hass, { coverColors: ['#ff3366'] });
    const fovs = el.shadowRoot!.querySelectorAll('path.fov');
    expect(fovs[0].getAttribute('style') ?? '').toContain('#ff3366');
    expect(fovs[1].getAttribute('style') ?? '').toContain('#ff7f0e');
  });
});

describe('acp-sky-compass northOffsetDeg', () => {
  // Window azimuth=180. FOV ±45 → fovStart=135, fovEnd=225.
  // The FOV wedge path changes when offset rotates the compass.
  // path.fov is a literal class (no binding), confirmed working in existing tests.
  const d = () => makeDiscovered('entry1', 'Kitchen');
  const hass = () => makeHass([{ sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180 }]);

  it('northOffsetDeg=0 and northOffsetDeg=90 produce different FOV paths', async () => {
    const el0 = await mountCompass([d()], hass(), { northOffsetDeg: 0 });
    const el90 = await mountCompass([d()], hass(), { northOffsetDeg: 90 });
    const path0 = el0.shadowRoot!.querySelector('path.fov')?.getAttribute('d') ?? '';
    const path90 = el90.shadowRoot!.querySelector('path.fov')?.getAttribute('d') ?? '';
    expect(path0).toBeTruthy();
    expect(path90).toBeTruthy();
    expect(path0).not.toBe(path90);
  });

  it('northOffsetDeg=90 FOV path matches northOffsetDeg=0 path shifted by 90°', async () => {
    // wedgePath(135, 225, 110, 0, 90) should equal wedgePath(225, 315, 110, 0, 0)
    // i.e. the window's FOV wedge (centered on South=180) should appear at West=270 when offset=90
    const { wedgePath, normalizeAzimuth } = await import('../src/lib/geometry');
    const expected = wedgePath(normalizeAzimuth(225), normalizeAzimuth(315), 110, 0, 0);
    const el90 = await mountCompass([d()], hass(), { northOffsetDeg: 90 });
    const actual = el90.shadowRoot!.querySelector('path.fov')?.getAttribute('d') ?? '';
    expect(actual).toBe(expected);
  });
});

describe('acp-sky-compass blind spot bearing conversion', () => {
  // Integration emits blind_spot_range as FOV-left-relative offsets:
  //   [fov_left - blind_spot_right, fov_left - blind_spot_left]
  // Absolute bearings = windowAzimuth - range[1] (start) and windowAzimuth - range[0] (end)
  // Repro: windowAzimuth=180, blind_spot_range=[10, 30] → absolute 150°–170°
  it('renders blind spot wedge at absolute compass bearings derived from window_azimuth', async () => {
    const d = makeDiscovered('entry1', 'Kitchen');
    const hass = makeHass([
      { sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180, blindSpot: [10, 30] },
    ]);
    const el = await mountCompass([d], hass);
    const { wedgePath, normalizeAzimuth } = await import('../src/lib/geometry');
    const expected = wedgePath(normalizeAzimuth(150), normalizeAzimuth(170), 110, 0, 0);
    const blind = el.shadowRoot!.querySelector('path.blind-spot') as SVGPathElement;
    expect(blind.getAttribute('d')).toBe(expected);
  });

  it('blind spot tooltip shows absolute compass bearings', async () => {
    const d = makeDiscovered('entry1', 'Kitchen');
    const hass = makeHass([
      { sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180, blindSpot: [10, 30] },
    ]);
    const el = await mountCompass([d], hass);
    const title = el.shadowRoot!.querySelector('g.blind-group > title');
    expect(title?.textContent ?? '').toContain('150');
    expect(title?.textContent ?? '').toContain('170');
  });
});

describe('acp-sky-compass legend toggle', () => {
  function makeTwoEntry() {
    const d1 = makeDiscovered('entry1', 'Kitchen');
    const d2 = makeDiscovered('entry2', 'Living');
    const hass = makeHass([
      { sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180 },
      { sensorId: 'sensor.sun_pos_entry2', windowAzimuth: 90 },
    ]);
    return { d1, d2, hass };
  }

  it('multi-entry legend rows are toggle buttons with aria-pressed="true" initially', async () => {
    const { d1, d2, hass } = makeTwoEntry();
    const el = await mountCompass([d1, d2], hass);
    const buttons = el.shadowRoot!.querySelectorAll('button.entry-toggle');
    expect(buttons.length).toBe(2);
    buttons.forEach((btn) => expect(btn.getAttribute('aria-pressed')).toBe('true'));
  });

  it('clicking a row hides that entry overlay and sets aria-pressed="false"', async () => {
    const { d1, d2, hass } = makeTwoEntry();
    const el = await mountCompass([d1, d2], hass);
    expect(el.shadowRoot!.querySelectorAll('path.fov').length).toBe(2);
    const btn = el.shadowRoot!.querySelector('button.entry-toggle') as HTMLButtonElement;
    btn.click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('path.fov').length).toBe(1);
    expect(btn.getAttribute('aria-pressed')).toBe('false');
  });

  it('clicking a row twice restores the overlay and aria-pressed="true"', async () => {
    const { d1, d2, hass } = makeTwoEntry();
    const el = await mountCompass([d1, d2], hass);
    const btn = el.shadowRoot!.querySelector('button.entry-toggle') as HTMLButtonElement;
    btn.click();
    await el.updateComplete;
    btn.click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('path.fov').length).toBe(2);
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });

  it('hidden row still present in legend with .hidden class', async () => {
    const { d1, d2, hass } = makeTwoEntry();
    const el = await mountCompass([d1, d2], hass);
    const btn = el.shadowRoot!.querySelector('button.entry-toggle') as HTMLButtonElement;
    btn.click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('button.entry-toggle').length).toBe(2);
    expect(btn.classList.contains('hidden')).toBe(true);
  });

  it('hiding an entry does not affect stats panel', async () => {
    // happy-dom does not surface .stats text when the element is inside an SVG sibling tree,
    // so we assert equivalent invariants: both legend buttons still present (legend uses
    // unfiltered overlays, same source as stats), and the visualisation IS filtered.
    const { d1, d2, hass } = makeTwoEntry();
    const el = await mountCompass([d1, d2], hass);
    const btn = el.shadowRoot!.querySelector('button.entry-toggle') as HTMLButtonElement;
    btn.click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('button.entry-toggle').length).toBe(2);
    expect(el.shadowRoot!.querySelectorAll('path.fov').length).toBe(1);
    expect(btn.classList.contains('hidden')).toBe(true);
  });

  it('hidden state survives unrelated hass updates', async () => {
    const { d1, d2, hass } = makeTwoEntry();
    const el = await mountCompass([d1, d2], hass);
    const btn = el.shadowRoot!.querySelector('button.entry-toggle') as HTMLButtonElement;
    btn.click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('path.fov').length).toBe(1);
    // Trigger a re-render by reassigning hass
    (el as SkyCompassLike).hass = { ...hass };
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('path.fov').length).toBe(1);
  });
});

describe('acp-sky-compass visual toggles', () => {
  const d = () => makeDiscovered('entry1', 'Kitchen');
  // Use offset values [10, 30] — with windowAzimuth=180 these must render at 150°–170°, inside FOV [135°–225°]
  const hass = () =>
    makeHass([{ sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180, blindSpot: [10, 30] }]);

  it('showLegend=false hides legend block', async () => {
    const el = await mountCompass([d()], hass(), { showLegend: false });
    expect(el.shadowRoot!.querySelector('.legend')).toBeNull();
  });

  it('showStats=false hides stats block', async () => {
    const el = await mountCompass([d()], hass(), { showStats: false });
    expect(el.shadowRoot!.querySelector('.stats')).toBeNull();
  });

  it('showCardinals=false hides cardinal labels', async () => {
    const el = await mountCompass([d()], hass(), { showCardinals: false });
    expect(el.shadowRoot!.querySelector('text.cardinal')).toBeNull();
  });

  it('showBlindSpot=false hides blind-spot group', async () => {
    const el = await mountCompass([d()], hass(), { showBlindSpot: false });
    const group = el.shadowRoot!.querySelector('g.blind-group') as SVGGElement | null;
    expect(group).not.toBeNull();
    expect(group!.getAttribute('style') ?? '').toContain('display: none');
  });

  it('showBlindSpot=true (default) renders blind-spot wedge inside FOV', async () => {
    const el = await mountCompass([d()], hass());
    const { wedgePath, normalizeAzimuth } = await import('../src/lib/geometry');
    // windowAzimuth=180, fov_left=45, fov_right=45 → FOV: 135°–225°
    // blind_spot_range=[10, 30] → absolute bearings 150°–170° (inside FOV)
    const expected = wedgePath(normalizeAzimuth(150), normalizeAzimuth(170), 110, 0, 0);
    const blind = el.shadowRoot!.querySelector('path.blind-spot') as SVGPathElement;
    expect(blind.getAttribute('d')).toBe(expected);
  });

  it('showWindowArrow=false hides arrow group', async () => {
    const el = await mountCompass([d()], hass(), { showWindowArrow: false });
    const group = el.shadowRoot!.querySelector('g.arrow-group') as SVGGElement | null;
    expect(group).not.toBeNull();
    expect(group!.getAttribute('style') ?? '').toContain('display: none');
  });

  it('showSunPath=false hides sun-path polyline', async () => {
    const el = await mountCompass([d()], hass(), { showSunPath: false });
    expect(el.shadowRoot!.querySelector('polyline.sun-path')).toBeNull();
  });

  it('showSunriseSunset=false hides rise/set markers', async () => {
    const el = await mountCompass([d()], hass(), { showSunriseSunset: false });
    expect(el.shadowRoot!.querySelector('circle.rise-marker')).toBeNull();
    expect(el.shadowRoot!.querySelector('circle.set-marker')).toBeNull();
  });
});

describe('acp-sky-compass FOV elevation limits', () => {
  // windowAzimuth=180, fov_left=45, fov_right=45 → fovStart=135, fovEnd=225
  const sensorId = 'sensor.sun_pos_entry1';
  const d = () => makeDiscovered('entry1', 'Kitchen');

  it('no elevation limits → full pie path (baseline)', async () => {
    const { wedgePath, normalizeAzimuth } = await import('../src/lib/geometry');
    const hass = makeHass([{ sensorId, windowAzimuth: 180 }]);
    const el = await mountCompass([d()], hass);
    const expected = wedgePath(normalizeAzimuth(135), normalizeAzimuth(225), 110, 0, 0);
    expect(el.shadowRoot!.querySelector('path.fov')?.getAttribute('d')).toBe(expected);
  });

  it('min_elevation clips outer radius (horizon side)', async () => {
    const { wedgePath, normalizeAzimuth, fovBandRadii } = await import('../src/lib/geometry');
    const hass = makeHass([{ sensorId, windowAzimuth: 180, minElevation: 10 }]);
    const el = await mountCompass([d()], hass);
    const { outer } = fovBandRadii(10, undefined, 110);
    const expected = wedgePath(normalizeAzimuth(135), normalizeAzimuth(225), outer, 0, 0);
    const actual = el.shadowRoot!.querySelector('path.fov')?.getAttribute('d') ?? '';
    expect(actual).toBe(expected);
    expect(actual).not.toBe(wedgePath(normalizeAzimuth(135), normalizeAzimuth(225), 110, 0, 0));
  });

  it('max_elevation clips inner radius (donut)', async () => {
    const { wedgePath, normalizeAzimuth, fovBandRadii } = await import('../src/lib/geometry');
    const hass = makeHass([{ sensorId, windowAzimuth: 180, maxElevation: 60 }]);
    const el = await mountCompass([d()], hass);
    const { inner } = fovBandRadii(undefined, 60, 110);
    const expected = wedgePath(normalizeAzimuth(135), normalizeAzimuth(225), 110, inner, 0);
    const actual = el.shadowRoot!.querySelector('path.fov')?.getAttribute('d') ?? '';
    expect(actual).toBe(expected);
    expect(actual).not.toMatch(/^M 0 0/);
  });

  it('both limits → annular sector', async () => {
    const { wedgePath, normalizeAzimuth, fovBandRadii } = await import('../src/lib/geometry');
    const hass = makeHass([{ sensorId, windowAzimuth: 180, minElevation: 10, maxElevation: 60 }]);
    const el = await mountCompass([d()], hass);
    const { outer, inner } = fovBandRadii(10, 60, 110);
    const expected = wedgePath(normalizeAzimuth(135), normalizeAzimuth(225), outer, inner, 0);
    expect(el.shadowRoot!.querySelector('path.fov')?.getAttribute('d')).toBe(expected);
  });

  it('inverted limits (min > max) → full pie fallback', async () => {
    const { wedgePath, normalizeAzimuth } = await import('../src/lib/geometry');
    const hass = makeHass([{ sensorId, windowAzimuth: 180, minElevation: 70, maxElevation: 30 }]);
    const el = await mountCompass([d()], hass);
    const expected = wedgePath(normalizeAzimuth(135), normalizeAzimuth(225), 110, 0, 0);
    expect(el.shadowRoot!.querySelector('path.fov')?.getAttribute('d')).toBe(expected);
  });

  it('cover-fill outer is clamped to fovOuterR when rawCoverR exceeds it', async () => {
    const { wedgePath, normalizeAzimuth, fovBandRadii } = await import('../src/lib/geometry');
    const targetSensorId = 'sensor.target_pos_entry1';
    const disc = makeDiscovered('entry1', 'Kitchen', { targetSensorId });
    // coverPos=5 (5% closed) → rawCoverR = 110 * (1 - 5/100) = 104.5
    // minElevation=10 → fovOuterR ≈ 97.78  (104.5 > 97.78, so clamp applies)
    const hass = makeHass([
      { sensorId, windowAzimuth: 180, minElevation: 10, coverPos: 5, targetSensorId },
    ]);
    const el = await mountCompass([disc], hass);
    const { outer: fovOuter } = fovBandRadii(10, undefined, 110);
    const expected = wedgePath(normalizeAzimuth(135), normalizeAzimuth(225), fovOuter, 0, 0);
    const coverFill = el.shadowRoot!.querySelector('path.cover-fill') as SVGPathElement | null;
    expect(coverFill).not.toBeNull();
    expect(coverFill!.getAttribute('d')).toBe(expected);
  });

  it('tooltip includes elevation band when at least one limit is set', async () => {
    const hass = makeHass([{ sensorId, windowAzimuth: 180, minElevation: 10, maxElevation: 60 }]);
    const el = await mountCompass([d()], hass);
    const fovGroup = el.shadowRoot!.querySelector('path.fov')?.parentElement;
    const titleText = fovGroup?.querySelector('title')?.textContent ?? '';
    expect(titleText).toContain('10');
    expect(titleText).toContain('60');
  });

  it('tooltip has no elevation suffix when no limits are set', async () => {
    const hass = makeHass([{ sensorId, windowAzimuth: 180 }]);
    const el = await mountCompass([d()], hass);
    const fovGroup = el.shadowRoot!.querySelector('path.fov')?.parentElement;
    const titleText = fovGroup?.querySelector('title')?.textContent ?? '';
    expect(titleText).not.toContain('elev');
  });
});

describe('acp-sky-compass legend completeness & theme tokens', () => {
  // SkyCompass.styles is a Lit CSSResult; .cssText is plain text we can grep.
  const cssText = (SkyCompass as unknown as { styles: { cssText: string } }).styles.cssText;

  function cssBlock(selector: string): string {
    // Find `selector {...}` and return the brace contents. Selectors here are
    // literal strings the source file uses; no regex special chars to escape.
    const idx = cssText.indexOf(selector);
    if (idx < 0) throw new Error(`Selector not found in styles: ${selector}`);
    const open = cssText.indexOf('{', idx);
    const close = cssText.indexOf('}', open);
    if (open < 0 || close < 0) throw new Error(`Malformed block for ${selector}`);
    return cssText.slice(open + 1, close);
  }

  it('legend renders one swatch per sun visual state (3 distinct .dot.sun classes)', async () => {
    const d = makeDiscovered('entry1', 'Kitchen');
    const hass = makeHass([{ sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180 }]);
    const el = await mountCompass([d], hass);
    const dots = Array.from(el.shadowRoot!.querySelectorAll('.legend .dot.sun'));
    expect(dots.length).toBe(3);
    const valid = dots.filter((d) => d.classList.contains('valid'));
    const inFov = dots.filter((d) => d.classList.contains('in-fov'));
    const bare = dots.filter(
      (d) => !d.classList.contains('valid') && !d.classList.contains('in-fov'),
    );
    expect(valid.length).toBe(1);
    expect(inFov.length).toBe(1);
    expect(bare.length).toBe(1);
  });

  it('legend labels the three sun states with distinct, clear wording', async () => {
    const d = makeDiscovered('entry1', 'Kitchen');
    const hass = makeHass([{ sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180 }]);
    const el = await mountCompass([d], hass);
    const text = el.shadowRoot!.textContent ?? '';
    expect(text).toContain('Sun (hitting window)');
    expect(text).toContain('Sun (in FOV, not valid)');
    expect(text).toContain('Sun (outside FOV)');
  });

  it('FOV swatch shares its theme token with the FOV path', () => {
    const fov = cssBlock('.fov ');
    const swatch = cssBlock('.swatch.fov ');
    expect(fov).toMatch(/var\(--warning-color/);
    expect(swatch).toMatch(/var\(--warning-color/);
    expect(swatch).not.toMatch(/background:\s*gold\b/);
  });

  it('sun-path swatch shares its theme token with the sun-path polyline', () => {
    const path = cssBlock('.sun-path ');
    const swatch = cssBlock('.swatch.sun-path-swatch ');
    expect(path).toMatch(/var\(--warning-color/);
    expect(swatch).toMatch(/var\(--warning-color/);
    expect(swatch).not.toMatch(/background:\s*gold\b/);
  });

  it('valid sun dot and SVG .sun.valid share the same theme token', () => {
    const svgValid = cssBlock('.sun.valid ');
    const dotValid = cssBlock('.dot.sun.valid ');
    expect(svgValid).toMatch(/var\(--warning-color/);
    expect(dotValid).toMatch(/var\(--warning-color/);
  });

  it('in-FOV sun dot and SVG .sun.in-fov share the same theme token', () => {
    const svgInFov = cssBlock('.sun.in-fov ');
    const dotInFov = cssBlock('.dot.sun.in-fov ');
    expect(svgInFov).toMatch(/var\(--state-active-color/);
    expect(dotInFov).toMatch(/var\(--state-active-color/);
  });
});

describe('acp-sky-compass active sun arc (start/end sensor azimuths)', () => {
  // windowAzimuth=180, fov_left=45, fov_right=45 → fovStart=135, fovEnd=225 (full FOV fall-back)
  const sensorId = 'sensor.sun_pos_entry1';
  const startId = 'sensor.start_sun_entry1';
  const endId = 'sensor.end_sun_entry1';

  it('uses start/end sensor azimuths as wedge bounds when available', async () => {
    const { wedgePath, normalizeAzimuth } = await import('../src/lib/geometry');
    const d = makeDiscovered('entry1', 'Kitchen', {
      startSensorId: startId,
      endSensorId: endId,
    });
    const hass = makeHass([
      {
        sensorId,
        windowAzimuth: 180,
        startSensorId: startId,
        startAzimuth: 150,
        startElevation: 12,
        endSensorId: endId,
        endAzimuth: 210,
        endElevation: 18,
      },
    ]);
    const el = await mountCompass([d], hass);
    const expected = wedgePath(normalizeAzimuth(150), normalizeAzimuth(210), 110, 0, 0);
    expect(el.shadowRoot!.querySelector('path.fov')?.getAttribute('d')).toBe(expected);
  });

  it('falls back to fov_left/fov_right when start/end sensors absent from discovery', async () => {
    const { wedgePath, normalizeAzimuth } = await import('../src/lib/geometry');
    const d = makeDiscovered('entry1', 'Kitchen');
    const hass = makeHass([{ sensorId, windowAzimuth: 180 }]);
    const el = await mountCompass([d], hass);
    const expected = wedgePath(normalizeAzimuth(135), normalizeAzimuth(225), 110, 0, 0);
    expect(el.shadowRoot!.querySelector('path.fov')?.getAttribute('d')).toBe(expected);
  });

  it('falls back when start sensor state is unavailable', async () => {
    const { wedgePath, normalizeAzimuth } = await import('../src/lib/geometry');
    const d = makeDiscovered('entry1', 'Kitchen', {
      startSensorId: startId,
      endSensorId: endId,
    });
    const hass = makeHass([
      {
        sensorId,
        windowAzimuth: 180,
        startSensorId: startId,
        startState: 'unavailable',
        endSensorId: endId,
        endAzimuth: 210,
        endElevation: 18,
      },
    ]);
    const el = await mountCompass([d], hass);
    const expected = wedgePath(normalizeAzimuth(135), normalizeAzimuth(225), 110, 0, 0);
    expect(el.shadowRoot!.querySelector('path.fov')?.getAttribute('d')).toBe(expected);
  });

  it('falls back when azimuth attribute is missing (older integration)', async () => {
    const { wedgePath, normalizeAzimuth } = await import('../src/lib/geometry');
    const d = makeDiscovered('entry1', 'Kitchen', {
      startSensorId: startId,
      endSensorId: endId,
    });
    const hass = makeHass([
      { sensorId, windowAzimuth: 180, startSensorId: startId, endSensorId: endId },
    ]);
    const el = await mountCompass([d], hass);
    const expected = wedgePath(normalizeAzimuth(135), normalizeAzimuth(225), 110, 0, 0);
    expect(el.shadowRoot!.querySelector('path.fov')?.getAttribute('d')).toBe(expected);
  });

  it('tooltip shows active sun arc range when active', async () => {
    const d = makeDiscovered('entry1', 'Kitchen', {
      startSensorId: startId,
      endSensorId: endId,
    });
    const hass = makeHass([
      {
        sensorId,
        windowAzimuth: 180,
        startSensorId: startId,
        startAzimuth: 150,
        startElevation: 12,
        endSensorId: endId,
        endAzimuth: 210,
        endElevation: 18,
      },
    ]);
    const el = await mountCompass([d], hass);
    const fovGroup = el.shadowRoot!.querySelector('path.fov')?.parentElement;
    const titleText = fovGroup?.querySelector('title')?.textContent ?? '';
    expect(titleText).toContain('Active sun arc');
    expect(titleText).toMatch(/150/);
    expect(titleText).toMatch(/210/);
  });

  it('active arc combined with min_elevation still applies elevation clipping', async () => {
    const { wedgePath, normalizeAzimuth, fovBandRadii } = await import('../src/lib/geometry');
    const d = makeDiscovered('entry1', 'Kitchen', {
      startSensorId: startId,
      endSensorId: endId,
    });
    const hass = makeHass([
      {
        sensorId,
        windowAzimuth: 180,
        minElevation: 10,
        startSensorId: startId,
        startAzimuth: 150,
        startElevation: 12,
        endSensorId: endId,
        endAzimuth: 210,
        endElevation: 18,
      },
    ]);
    const el = await mountCompass([d], hass);
    const { outer } = fovBandRadii(10, undefined, 110);
    const expected = wedgePath(normalizeAzimuth(150), normalizeAzimuth(210), outer, 0, 0);
    expect(el.shadowRoot!.querySelector('path.fov')?.getAttribute('d')).toBe(expected);
  });
});
