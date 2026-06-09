import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import '../src/components/sky-compass';
import { SkyCompass } from '../src/components/sky-compass';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';
import { coverWedgeOuterRadius, normalizeAzimuth, wedgePath } from '../src/lib/geometry';

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
  opts: {
    targetSensorId?: string;
    startSensorId?: string;
    endSensorId?: string;
    coverType?: DiscoveredEntities['cover_type'];
    decisionTraceSensorId?: string;
    overrideBinaryId?: string;
  } = {},
): DiscoveredEntities {
  return {
    entry_id: entryId,
    entry_title: title,
    cover_type: opts.coverType ?? 'cover_blind',
    entities: {
      sun_sensor: `sensor.sun_pos_${entryId}`,
      ...(opts.targetSensorId ? { target_position_sensor: opts.targetSensorId } : {}),
      ...(opts.startSensorId ? { start_sensor: opts.startSensorId } : {}),
      ...(opts.endSensorId ? { end_sensor: opts.endSensorId } : {}),
      ...(opts.decisionTraceSensorId ? { decision_trace_sensor: opts.decisionTraceSensorId } : {}),
      ...(opts.overrideBinaryId ? { manual_override_binary: opts.overrideBinaryId } : {}),
    },
    managed_covers: [],
  };
}

function makeHass(
  entries: {
    sensorId: string;
    windowAzimuth: number;
    fovLeft?: number;
    fovRight?: number;
    blindSpot?: [number, number];
    minElevation?: number;
    maxElevation?: number;
    coverPos?: number;
    actualPositions?: Record<string, number | null>;
    rawCalculatedPosition?: number;
    overrideBinaryId?: string;
    manualOverride?: boolean;
    targetSensorId?: string;
    startSensorId?: string;
    startAzimuth?: number;
    startElevation?: number;
    startState?: string;
    endSensorId?: string;
    endAzimuth?: number;
    endElevation?: number;
    endState?: string;
    inFov?: boolean;
    decisionTraceSensorId?: string;
    sunState?: string;
    directSunValid?: boolean;
  }[],
  opts: { omitLocation?: boolean } = {},
): HomeAssistant {
  const states: Record<string, { state: string; attributes: Record<string, unknown> }> = {};
  for (const e of entries) {
    const fovLeft = e.fovLeft ?? 45;
    const fovRight = e.fovRight ?? 45;
    states[e.sensorId] = {
      state: '180',
      attributes: {
        elevation: 30,
        gamma: 0,
        window_azimuth: e.windowAzimuth,
        fov_left: fovLeft,
        fov_right: fovRight,
        azimuth_min: e.windowAzimuth - fovLeft,
        azimuth_max: e.windowAzimuth + fovRight,
        in_fov: e.inFov ?? true,
        blind_spot_range: e.blindSpot ?? null,
        ...(e.minElevation !== undefined ? { min_elevation: e.minElevation } : {}),
        ...(e.maxElevation !== undefined ? { max_elevation: e.maxElevation } : {}),
      },
    };
    if (e.decisionTraceSensorId !== undefined) {
      states[e.decisionTraceSensorId] = {
        state: 'ok',
        attributes: {
          ...(e.sunState !== undefined ? { sun_state: e.sunState } : {}),
          ...(e.directSunValid !== undefined ? { direct_sun_valid: e.directSunValid } : {}),
        },
      };
    }
    if (e.targetSensorId !== undefined && e.coverPos !== undefined) {
      states[e.targetSensorId] = {
        state: String(e.coverPos),
        attributes: {
          ...(e.actualPositions !== undefined ? { actual_positions: e.actualPositions } : {}),
          ...(e.rawCalculatedPosition !== undefined
            ? { raw_calculated_position: e.rawCalculatedPosition }
            : {}),
        },
      };
    }
    if (e.overrideBinaryId !== undefined) {
      states[e.overrideBinaryId] = {
        state: e.manualOverride ? 'on' : 'off',
        attributes: {},
      };
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
    // The real integration always supplies time_zone; pin it to the location's
    // zone so the sampled day anchors to the location's midnight (not the test
    // runner's), keeping the sun path deterministic across CI timezones.
    config: opts.omitLocation
      ? {}
      : { latitude: 47.6, longitude: -122.3, time_zone: 'America/Los_Angeles' },
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

  it('above-horizon sun renders a flat circle, not an <image>', async () => {
    const d = makeDiscovered('entry1', 'Kitchen');
    const hass = makeHass([{ sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180 }]);
    // helper defaults elevation to 30 (above horizon)
    const el = await mountCompass([d], hass);
    // No photographic image marker
    expect(el.shadowRoot!.querySelector('image.sun-img')).toBeNull();
    // Flat SVG circle is present
    const sun = el.shadowRoot!.querySelector('circle.sun') as SVGCircleElement;
    expect(sun).toBeTruthy();
    expect(sun.classList.contains('night')).toBe(false);
  });

  it('below-horizon sun renders the night class on the flat disc', async () => {
    const d = makeDiscovered('entry1', 'Kitchen');
    const hass = makeHass([{ sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180 }]);
    hass.states['sensor.sun_pos_entry1'].attributes.elevation = -10;
    const el = await mountCompass([d], hass);
    const sun = el.shadowRoot!.querySelector('circle.sun.night') as SVGCircleElement;
    expect(sun).toBeTruthy();
    expect(el.shadowRoot!.querySelector('circle.sun.up')).toBeNull();
    expect(el.shadowRoot!.querySelector('circle.sun.valid')).toBeNull();
  });
});

describe('acp-sky-compass sun-dot 3-way state', () => {
  it('renders "sun valid" (hitting) when sun_state is hitting', async () => {
    const d = makeDiscovered('entry1', 'Kitchen', {
      decisionTraceSensorId: 'sensor.dt_entry1',
    });
    const hass = makeHass([
      {
        sensorId: 'sensor.sun_pos_entry1',
        windowAzimuth: 180,
        inFov: true,
        decisionTraceSensorId: 'sensor.dt_entry1',
        sunState: 'hitting',
        directSunValid: true,
      },
    ]);
    const el = await mountCompass([d], hass);
    expect(el.shadowRoot!.querySelector('circle.sun.valid')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('circle.sun.in-fov')).toBeNull();
    expect(el.shadowRoot!.querySelector('circle.sun.up')).toBeNull();
  });

  it('renders "sun in-fov" (light yellow) when in FOV but not valid', async () => {
    const d = makeDiscovered('entry1', 'Kitchen', {
      decisionTraceSensorId: 'sensor.dt_entry1',
    });
    const hass = makeHass([
      {
        sensorId: 'sensor.sun_pos_entry1',
        windowAzimuth: 180,
        inFov: true,
        decisionTraceSensorId: 'sensor.dt_entry1',
        sunState: 'in_fov_not_valid',
        directSunValid: false,
      },
    ]);
    const el = await mountCompass([d], hass);
    expect(el.shadowRoot!.querySelector('circle.sun.in-fov')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('circle.sun.valid')).toBeNull();
    expect(el.shadowRoot!.querySelector('circle.sun.up')).toBeNull();
  });

  it('renders "sun up" (dim neutral) when outside FOV', async () => {
    const d = makeDiscovered('entry1', 'Kitchen', {
      decisionTraceSensorId: 'sensor.dt_entry1',
    });
    const hass = makeHass([
      {
        sensorId: 'sensor.sun_pos_entry1',
        windowAzimuth: 180,
        inFov: false,
        decisionTraceSensorId: 'sensor.dt_entry1',
        sunState: 'outside_fov',
        directSunValid: false,
      },
    ]);
    const el = await mountCompass([d], hass);
    expect(el.shadowRoot!.querySelector('circle.sun.up')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('circle.sun.in-fov')).toBeNull();
    expect(el.shadowRoot!.querySelector('circle.sun.valid')).toBeNull();
  });

  it('falls back to deriving from direct_sun_valid + in_fov when sun_state absent', async () => {
    const d = makeDiscovered('entry1', 'Kitchen', {
      decisionTraceSensorId: 'sensor.dt_entry1',
    });
    const hass = makeHass([
      {
        sensorId: 'sensor.sun_pos_entry1',
        windowAzimuth: 180,
        inFov: true,
        decisionTraceSensorId: 'sensor.dt_entry1',
        directSunValid: false, // no sunState attr -> derive: in_fov && !valid
      },
    ]);
    const el = await mountCompass([d], hass);
    expect(el.shadowRoot!.querySelector('circle.sun.in-fov')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('circle.sun.valid')).toBeNull();
  });

  it('picks the most-active state across overlapping windows (hitting wins)', async () => {
    const d1 = makeDiscovered('entry1', 'Kitchen', {
      decisionTraceSensorId: 'sensor.dt_entry1',
    });
    const d2 = makeDiscovered('entry2', 'Office', {
      decisionTraceSensorId: 'sensor.dt_entry2',
    });
    const hass = makeHass([
      {
        sensorId: 'sensor.sun_pos_entry1',
        windowAzimuth: 180,
        inFov: true,
        decisionTraceSensorId: 'sensor.dt_entry1',
        sunState: 'in_fov_not_valid',
        directSunValid: false,
      },
      {
        sensorId: 'sensor.sun_pos_entry2',
        windowAzimuth: 180,
        inFov: true,
        decisionTraceSensorId: 'sensor.dt_entry2',
        sunState: 'hitting',
        directSunValid: true,
      },
    ]);
    const el = await mountCompass([d1, d2], hass);
    expect(el.shadowRoot!.querySelector('circle.sun.valid')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('circle.sun.in-fov')).toBeNull();
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

  it('multi-entry stats ✓ carries an explanatory tooltip (#128 follow-up)', async () => {
    const d1 = makeDiscovered('entry1', 'Kitchen');
    const d2 = makeDiscovered('entry2', 'Living');
    const hass = makeHass([
      { sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180 },
      { sensorId: 'sensor.sun_pos_entry2', windowAzimuth: 90 },
    ]);
    const el = await mountCompass([d1, d2], hass);
    const ticks = el.shadowRoot!.querySelectorAll('.entry-row .status.in-fov');
    expect(ticks.length).toBe(2);
    ticks.forEach((tick) => {
      expect(tick.textContent?.trim()).toBe('✓');
      const title = tick.getAttribute('title') ?? '';
      expect(title).toContain('field of view');
    });
  });
});

describe('acp-sky-compass cover legend wording (#132)', () => {
  it('legend shows "Cover position", not "Cover closed"', async () => {
    const d = makeDiscovered('entry1', 'Kitchen');
    const hass = makeHass([{ sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180 }]);
    const el = await mountCompass([d], hass);
    const text = el.shadowRoot!.textContent ?? '';
    expect(text).toContain('Cover position');
    expect(text).not.toContain('Cover closed');
  });
});

describe('acp-sky-compass coverColors', () => {
  it('single-entry override colors both the cover wedge and the FOV', async () => {
    // #132 Problem B: a cover-color override on a single-entry compass recolors
    // the cover wedge AND the FOV/window uniformly, so the main card matches the
    // standalone (multi-entry) card and the reporter's request.
    const targetSensorId = 'sensor.target_pos_entry1';
    const d = makeDiscovered('entry1', 'Kitchen', { targetSensorId });
    const hass = makeHass([
      { sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180, coverPos: 40, targetSensorId },
    ]);
    const el = await mountCompass([d], hass, { coverColors: ['#ff3366'] });
    const cover = el.shadowRoot!.querySelector('path.cover-fill') as SVGPathElement;
    expect(cover.getAttribute('style') ?? '').toContain('#ff3366');
    const fov = el.shadowRoot!.querySelector('path.fov') as SVGPathElement;
    expect(fov.getAttribute('style') ?? '').toContain('#ff3366');
  });

  it('single-entry override colors the legend cover swatch to match the wedge', async () => {
    const targetSensorId = 'sensor.target_pos_entry1';
    const d = makeDiscovered('entry1', 'Kitchen', { targetSensorId });
    const hass = makeHass([
      { sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180, coverPos: 40, targetSensorId },
    ]);
    const el = await mountCompass([d], hass, { coverColors: ['#ff3366'] });
    const swatch = el.shadowRoot!.querySelector('.swatch.cover-fill-swatch') as HTMLElement | null;
    expect(swatch).not.toBeNull();
    expect(swatch!.getAttribute('style') ?? '').toContain('#ff3366');
  });

  it('single-entry override colors the legend FOV swatch to match the wedge', async () => {
    // #132 Problem B: when the FOV follows the override color, the legend FOV
    // swatch must carry the same inline background so legend and plot agree.
    const targetSensorId = 'sensor.target_pos_entry1';
    const d = makeDiscovered('entry1', 'Kitchen', { targetSensorId });
    const hass = makeHass([
      { sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180, coverPos: 40, targetSensorId },
    ]);
    const el = await mountCompass([d], hass, { coverColors: ['#ff3366'] });
    const swatch = el.shadowRoot!.querySelector('.swatch.fov') as HTMLElement | null;
    expect(swatch).not.toBeNull();
    expect(swatch!.getAttribute('style') ?? '').toContain('#ff3366');
  });

  it('single-entry WITHOUT override leaves the FOV on its themed default (no inline color)', async () => {
    // #132 Problem B regression: with no cover-color override the FOV path and
    // legend FOV swatch carry no inline color — they fall to the CSS default
    // (--primary-color since #144, formerly gold).
    const targetSensorId = 'sensor.target_pos_entry1';
    const d = makeDiscovered('entry1', 'Kitchen', { targetSensorId });
    const hass = makeHass([
      { sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180, coverPos: 40, targetSensorId },
    ]);
    const el = await mountCompass([d], hass);
    const fov = el.shadowRoot!.querySelector('path.fov') as SVGPathElement;
    expect(fov.getAttribute('style') ?? '').toBe('');
    const swatch = el.shadowRoot!.querySelector('.swatch.fov') as HTMLElement | null;
    expect(swatch).not.toBeNull();
    expect(swatch!.getAttribute('style') ?? '').toBe('');
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

  it('showSunPath=false hides the sun path', async () => {
    const el = await mountCompass([d()], hass(), { showSunPath: false });
    expect(el.shadowRoot!.querySelector('polyline.sun-path-line')).toBeNull();
  });

  // The sun path is now one dashed polyline per above-horizon run; the gold→grey
  // fade lives in a per-run <linearGradient> referenced by the polyline stroke.
  const sunPathLines = (el: SkyCompassLike): SVGPolylineElement[] =>
    Array.from(el.shadowRoot!.querySelectorAll('polyline.sun-path-line')) as SVGPolylineElement[];
  const linePoints = (l: SVGPolylineElement): Array<{ x: number; y: number }> =>
    (l.getAttribute('points') ?? '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((pair) => {
        const [x, y] = pair.split(',').map(Number);
        return { x, y };
      });
  const allPathMags = (el: SkyCompassLike): number[] =>
    sunPathLines(el)
      .flatMap(linePoints)
      .map((p) => Math.hypot(p.x, p.y));
  const stopRgb = (s: Element): RegExpMatchArray | null =>
    (s.getAttribute('stop-color') ?? '').match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);

  it('sun-path masks the below-horizon trajectory (daytime arc only)', async () => {
    const el = await mountCompass([d()], hass());
    expect(sunPathLines(el).length).toBeGreaterThanOrEqual(1);
    const OUTER_R = 110;
    const mags = allPathMags(el);
    expect(mags.length).toBeGreaterThan(0);
    // The daytime arc bows toward the centre.
    expect(Math.min(...mags)).toBeLessThan(OUTER_R * 0.9);
    // No point rides outside the rim (the night arc is gone, not clamped out).
    for (const m of mags) {
      expect(m).toBeLessThanOrEqual(OUTER_R + 0.5);
    }
    // Rim-hugging points only occur at the horizon-crossing endpoints of each run.
    const onRim = mags.filter((m) => Math.abs(m - OUTER_R) < 0.5);
    expect(onRim.length).toBeLessThanOrEqual(4);
  });

  it('showSunriseSunset=true ramps the arc grey (horizon) → gold (zenith) by elevation', async () => {
    const el = await mountCompass([d()], hass(), { showSunriseSunset: true });
    const lines = sunPathLines(el);
    expect(lines.length).toBeGreaterThanOrEqual(1);
    // The stroke references a per-run multi-stop gradient that samples elevation.
    const idMatch = (lines[0].getAttribute('style') ?? '').match(/url\(#(sun-path-grad-\d+)\)/);
    expect(idMatch).not.toBeNull();
    const stops = Array.from(el.shadowRoot!.querySelectorAll(`linearGradient#${idMatch![1]} stop`));
    expect(stops.length).toBeGreaterThanOrEqual(3);
    // "Goldness" = red − blue: ~0 for neutral grey, large and positive for gold.
    const goldness = stops.map((s) => {
      const m = stopRgb(s)!;
      return Number(m[1]) - Number(m[3]);
    });
    const maxGold = Math.max(...goldness);
    const maxIdx = goldness.indexOf(maxGold);
    // The gold peak sits at a mid-arc (high-elevation) stop, not at a horizon end.
    expect(maxIdx).toBeGreaterThan(0);
    expect(maxIdx).toBeLessThan(goldness.length - 1);
    expect(maxGold).toBeGreaterThan(goldness[0]);
    expect(maxGold).toBeGreaterThan(goldness[goldness.length - 1]);
    expect(maxGold).toBeGreaterThan(150); // clearly gold at the top
    // Horizon ends read neutral grey, not gold.
    expect(Math.abs(goldness[0])).toBeLessThan(80);
    expect(Math.abs(goldness[goldness.length - 1])).toBeLessThan(80);
  });

  it('showSunriseSunset=false draws the arc in a single colour', async () => {
    const el = await mountCompass([d()], hass(), { showSunriseSunset: false });
    const lines = sunPathLines(el);
    expect(lines.length).toBeGreaterThan(0);
    // No gradient defs when the fade is off.
    expect(el.shadowRoot!.querySelector('linearGradient[id^="sun-path-grad"]')).toBeNull();
    const strokes = new Set(lines.map((l) => (l.getAttribute('style') ?? '').trim()));
    // Every run shares one stroke (no gradient) — a single sun-path colour.
    expect(strokes.size).toBe(1);
    expect([...strokes][0]).toContain('--warning-color');
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
    // omitLocation: no sun samples → azimuth gating falls back to full FOV envelope;
    // this test focuses on the radial clipping behavior only.
    const hass = makeHass([{ sensorId, windowAzimuth: 180, minElevation: 10 }], {
      omitLocation: true,
    });
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
    // omitLocation: no sun samples → azimuth gating falls back to full FOV envelope;
    // this test focuses on the annular-sector (both radial limits) behavior only.
    const hass = makeHass([{ sensorId, windowAzimuth: 180, minElevation: 10, maxElevation: 60 }], {
      omitLocation: true,
    });
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
    // omitLocation: no sun samples → azimuth gating falls back to full FOV envelope;
    // this test focuses on the cover-fill radial-clamp behavior only.
    const hass = makeHass(
      [{ sensorId, windowAzimuth: 180, minElevation: 10, coverPos: 5, targetSensorId }],
      { omitLocation: true },
    );
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

describe('acp-sky-compass cover-fill polarity by cover_type', () => {
  // windowAzimuth=180, fov_left=45, fov_right=45 → fovStart=135, fovEnd=225
  // No elevation limits, no start/end sensors → fovInnerR=0, fovOuterR=OUTER_R=110
  // Full FOV wedge = wedgePath(135, 225, 110, 0, 0)

  it('cover_awning at position=100 fills the full FOV wedge', async () => {
    const { wedgePath, normalizeAzimuth } = await import('../src/lib/geometry');
    const targetSensorId = 'sensor.target_pos_awning1';
    const disc = makeDiscovered('awning1', 'Awning', { targetSensorId, coverType: 'cover_awning' });
    const hass = makeHass([
      { sensorId: 'sensor.sun_pos_awning1', windowAzimuth: 180, coverPos: 100, targetSensorId },
    ]);
    const el = await mountCompass([disc], hass);
    const expected = wedgePath(normalizeAzimuth(135), normalizeAzimuth(225), 110, 0, 0);
    const coverFill = el.shadowRoot!.querySelector('path.cover-fill') as SVGPathElement | null;
    const coverGroup = el.shadowRoot!.querySelector('g.cover-group') as SVGGElement | null;
    expect(coverFill).not.toBeNull();
    expect(coverFill!.getAttribute('d')).toBe(expected);
    expect(coverGroup!.getAttribute('style') ?? '').not.toContain('display: none');
  });

  it('cover_awning at position=0 hides cover-fill', async () => {
    const targetSensorId = 'sensor.target_pos_awning2';
    const disc = makeDiscovered('awning2', 'Awning', { targetSensorId, coverType: 'cover_awning' });
    const hass = makeHass([
      { sensorId: 'sensor.sun_pos_awning2', windowAzimuth: 180, coverPos: 0, targetSensorId },
    ]);
    const el = await mountCompass([disc], hass);
    const coverGroup = el.shadowRoot!.querySelector('g.cover-group') as SVGGElement | null;
    expect(coverGroup!.getAttribute('style') ?? '').toContain('display: none');
  });

  it('cover_awning at 50 and cover_blind at 50 produce the same cover-fill path', async () => {
    const { wedgePath, normalizeAzimuth } = await import('../src/lib/geometry');
    const targetAwning = 'sensor.target_pos_awning3';
    const discAwning = makeDiscovered('awning3', 'Awning', {
      targetSensorId: targetAwning,
      coverType: 'cover_awning',
    });
    const hassAwning = makeHass([
      {
        sensorId: 'sensor.sun_pos_awning3',
        windowAzimuth: 180,
        coverPos: 50,
        targetSensorId: targetAwning,
      },
    ]);
    const elAwning = await mountCompass([discAwning], hassAwning);

    const targetBlind = 'sensor.target_pos_blind3';
    const discBlind = makeDiscovered('blind3', 'Blind', {
      targetSensorId: targetBlind,
      coverType: 'cover_blind',
    });
    const hassBlind = makeHass([
      {
        sensorId: 'sensor.sun_pos_blind3',
        windowAzimuth: 180,
        coverPos: 50,
        targetSensorId: targetBlind,
      },
    ]);
    const elBlind = await mountCompass([discBlind], hassBlind);

    // Both should use coverFraction=0.5 → rawCoverR = 55 → wedgePath(135, 225, 55, 0, 0)
    const expectedD = wedgePath(normalizeAzimuth(135), normalizeAzimuth(225), 55, 0, 0);
    const awningD = elAwning.shadowRoot!.querySelector('path.cover-fill')?.getAttribute('d') ?? '';
    const blindD = elBlind.shadowRoot!.querySelector('path.cover-fill')?.getAttribute('d') ?? '';
    expect(awningD).toBe(expectedD);
    expect(blindD).toBe(expectedD);
  });

  it('cover_blind at position=0 fills the full FOV wedge (regression)', async () => {
    const { wedgePath, normalizeAzimuth } = await import('../src/lib/geometry');
    const targetSensorId = 'sensor.target_pos_blind4';
    const disc = makeDiscovered('blind4', 'Blind', { targetSensorId, coverType: 'cover_blind' });
    const hass = makeHass([
      { sensorId: 'sensor.sun_pos_blind4', windowAzimuth: 180, coverPos: 0, targetSensorId },
    ]);
    const el = await mountCompass([disc], hass);
    const expected = wedgePath(normalizeAzimuth(135), normalizeAzimuth(225), 110, 0, 0);
    const coverFill = el.shadowRoot!.querySelector('path.cover-fill') as SVGPathElement | null;
    const coverGroup = el.shadowRoot!.querySelector('g.cover-group') as SVGGElement | null;
    expect(coverFill).not.toBeNull();
    expect(coverFill!.getAttribute('d')).toBe(expected);
    expect(coverGroup!.getAttribute('style') ?? '').not.toContain('display: none');
  });

  it('cover_blind at position=100 hides cover-fill (regression)', async () => {
    const targetSensorId = 'sensor.target_pos_blind5';
    const disc = makeDiscovered('blind5', 'Blind', { targetSensorId, coverType: 'cover_blind' });
    const hass = makeHass([
      { sensorId: 'sensor.sun_pos_blind5', windowAzimuth: 180, coverPos: 100, targetSensorId },
    ]);
    const el = await mountCompass([disc], hass);
    const coverGroup = el.shadowRoot!.querySelector('g.cover-group') as SVGGElement | null;
    expect(coverGroup!.getAttribute('style') ?? '').toContain('display: none');
  });

  it('cover_tilt at position=0 fills the full FOV wedge (same semantics as blind)', async () => {
    const { wedgePath, normalizeAzimuth } = await import('../src/lib/geometry');
    const targetSensorId = 'sensor.target_pos_tilt6';
    const disc = makeDiscovered('tilt6', 'Tilt', { targetSensorId, coverType: 'cover_tilt' });
    const hass = makeHass([
      { sensorId: 'sensor.sun_pos_tilt6', windowAzimuth: 180, coverPos: 0, targetSensorId },
    ]);
    const el = await mountCompass([disc], hass);
    const expected = wedgePath(normalizeAzimuth(135), normalizeAzimuth(225), 110, 0, 0);
    const coverFill = el.shadowRoot!.querySelector('path.cover-fill') as SVGPathElement | null;
    expect(coverFill).not.toBeNull();
    expect(coverFill!.getAttribute('d')).toBe(expected);
  });

  it('tooltip: cover_awning target line uses "extended", cover_blind uses plain target', async () => {
    const targetAwning = 'sensor.target_pos_awning7';
    const discAwning = makeDiscovered('awning7', 'Awning', {
      targetSensorId: targetAwning,
      coverType: 'cover_awning',
    });
    const hassAwning = makeHass([
      {
        sensorId: 'sensor.sun_pos_awning7',
        windowAzimuth: 180,
        coverPos: 75,
        targetSensorId: targetAwning,
      },
    ]);
    const elAwning = await mountCompass([discAwning], hassAwning);
    const awningTitle = elAwning.shadowRoot!.querySelector('g.cover-group > title');
    expect(awningTitle?.textContent ?? '').toContain('Target (extended): 75%');

    const targetBlind = 'sensor.target_pos_blind7';
    const discBlind = makeDiscovered('blind7', 'Blind', {
      targetSensorId: targetBlind,
      coverType: 'cover_blind',
    });
    const hassBlind = makeHass([
      {
        sensorId: 'sensor.sun_pos_blind7',
        windowAzimuth: 180,
        coverPos: 75,
        targetSensorId: targetBlind,
      },
    ]);
    const elBlind = await mountCompass([discBlind], hassBlind);
    const blindTitle = elBlind.shadowRoot!.querySelector('g.cover-group > title');
    expect(blindTitle?.textContent ?? '').toContain('Target: 75%');
    expect(blindTitle?.textContent ?? '').not.toContain('extended');
  });
});

describe('acp-sky-compass cover tooltip target + actual lines (#132)', () => {
  const sensorId = 'sensor.sun_pos_tt';
  const targetSensorId = 'sensor.target_pos_tt';

  it('appends an Actual line when an actual aggregate exists', async () => {
    const disc = makeDiscovered('tt', 'Kitchen', { targetSensorId });
    const hass = makeHass([
      {
        sensorId,
        windowAzimuth: 180,
        coverPos: 30,
        targetSensorId,
        actualPositions: { 'cover.x': 80 },
      },
    ]);
    const el = await mountCompass([disc], hass);
    const tt = el.shadowRoot!.querySelector('g.cover-group > title')?.textContent ?? '';
    expect(tt).toContain('Target: 30%');
    expect(tt).toContain('Actual: 80%');
  });

  it('shows only the target line when no actual aggregate exists', async () => {
    const disc = makeDiscovered('tt', 'Kitchen', { targetSensorId });
    const hass = makeHass([{ sensorId, windowAzimuth: 180, coverPos: 30, targetSensorId }]);
    const el = await mountCompass([disc], hass);
    const tt = el.shadowRoot!.querySelector('g.cover-group > title')?.textContent ?? '';
    expect(tt).toContain('Target: 30%');
    expect(tt).not.toContain('Actual');
  });
});

describe('acp-sky-compass actual-vs-target dual wedge (#132)', () => {
  // windowAzimuth=180, fov ±45 → fovStart=135, fovEnd=225, full FOV wedge.
  const sensorId = 'sensor.sun_pos_dual';
  const targetSensorId = 'sensor.target_pos_dual';
  const disc = () => makeDiscovered('dual', 'Kitchen', { targetSensorId });

  it('renders both cover-fill (target) and cover-actual when they diverge', async () => {
    const hass = makeHass([
      {
        sensorId,
        windowAzimuth: 180,
        coverPos: 30,
        targetSensorId,
        actualPositions: { 'cover.x': 80 },
      },
    ]);
    const el = await mountCompass([disc()], hass);
    const fill = el.shadowRoot!.querySelector('path.cover-fill') as SVGPathElement | null;
    const actual = el.shadowRoot!.querySelector('path.cover-actual') as SVGPathElement | null;
    expect(fill).not.toBeNull();
    expect(actual).not.toBeNull();
    expect(fill!.getAttribute('d')).not.toBe(actual!.getAttribute('d'));
  });

  it('cover-actual equals cover-fill when actual mean == target', async () => {
    const hass = makeHass([
      {
        sensorId,
        windowAzimuth: 180,
        coverPos: 30,
        targetSensorId,
        actualPositions: { 'cover.x': 30 },
      },
    ]);
    const el = await mountCompass([disc()], hass);
    const fill = el.shadowRoot!.querySelector('path.cover-fill') as SVGPathElement | null;
    const actual = el.shadowRoot!.querySelector('path.cover-actual') as SVGPathElement | null;
    expect(actual).not.toBeNull();
    expect(actual!.getAttribute('d')).toBe(fill!.getAttribute('d'));
  });

  it('omits cover-actual when actual_positions is empty', async () => {
    const hass = makeHass([
      { sensorId, windowAzimuth: 180, coverPos: 30, targetSensorId, actualPositions: {} },
    ]);
    const el = await mountCompass([disc()], hass);
    expect(el.shadowRoot!.querySelector('path.cover-actual')).toBeNull();
    // Target wedge still present.
    expect(el.shadowRoot!.querySelector('path.cover-fill')).not.toBeNull();
  });

  it('omits cover-actual when every actual value is null', async () => {
    const hass = makeHass([
      {
        sensorId,
        windowAzimuth: 180,
        coverPos: 30,
        targetSensorId,
        actualPositions: { 'cover.x': null },
      },
    ]);
    const el = await mountCompass([disc()], hass);
    expect(el.shadowRoot!.querySelector('path.cover-actual')).toBeNull();
  });

  it('omits cover-actual when the target sensor carries no actual_positions attribute', async () => {
    const hass = makeHass([{ sensorId, windowAzimuth: 180, coverPos: 30, targetSensorId }]);
    const el = await mountCompass([disc()], hass);
    expect(el.shadowRoot!.querySelector('path.cover-actual')).toBeNull();
    expect(el.shadowRoot!.querySelector('path.cover-fill')).not.toBeNull();
  });

  it('does not render cover-actual when showCoverFill is off', async () => {
    const hass = makeHass([
      {
        sensorId,
        windowAzimuth: 180,
        coverPos: 30,
        targetSensorId,
        actualPositions: { 'cover.x': 80 },
      },
    ]);
    const el = await mountCompass([disc()], hass, { showCoverFill: false });
    expect(el.shadowRoot!.querySelector('path.cover-actual')).toBeNull();
  });
});

describe('acp-sky-compass manual-override divergence (#132 Problem A)', () => {
  // windowAzimuth=180, fov ±45 → fovStart=135, fovEnd=225, full FOV wedge.
  // No elevation limits → fovOuterR=110, fovInnerR=0.
  const sensorId = 'sensor.sun_pos_ov';
  const targetSensorId = 'sensor.target_pos_ov';
  const overrideBinaryId = 'binary_sensor.manual_override_ov';
  const disc = () => makeDiscovered('ov', 'Kitchen', { targetSensorId, overrideBinaryId });

  // During override the Cover_Position sensor STATE returns the held position
  // (80); the integration still publishes the solar would-be target as the
  // raw_calculated_position attribute (20). The target wedge must move to the
  // solar target while the actual ring stays at held.
  it('draws the target wedge at the solar target and actual ring at held', async () => {
    const hass = makeHass([
      {
        sensorId,
        windowAzimuth: 180,
        coverPos: 80, // sensor STATE = held position during override
        rawCalculatedPosition: 20, // solar would-be target
        actualPositions: { 'cover.x': 80 }, // covers physically at held
        targetSensorId,
        overrideBinaryId,
        manualOverride: true,
      },
    ]);
    const el = await mountCompass([disc()], hass);
    const fill = el.shadowRoot!.querySelector('path.cover-fill') as SVGPathElement | null;
    const actual = el.shadowRoot!.querySelector('path.cover-actual') as SVGPathElement | null;
    expect(fill).not.toBeNull();
    expect(actual).not.toBeNull();
    // Two distinct wedges: target (solar=20) ≠ actual ring (held=80).
    const fillD = fill!.getAttribute('d')!;
    const actualD = actual!.getAttribute('d')!;
    expect(fillD).not.toBe(actualD);
    // Target wedge radius reflects the SOLAR target (20% → blind 80% open →
    // outer radius 88), the actual ring reflects HELD (80% → 20% open → 22).
    const solarTargetPath = wedgePath(
      normalizeAzimuth(135),
      normalizeAzimuth(225),
      coverWedgeOuterRadius(20, 'cover_blind', 110, 110),
      0,
      0,
    );
    const heldPath = wedgePath(
      normalizeAzimuth(135),
      normalizeAzimuth(225),
      coverWedgeOuterRadius(80, 'cover_blind', 110, 110),
      0,
      0,
    );
    expect(fillD).toBe(solarTargetPath);
    expect(actualD).toBe(heldPath);
  });

  it('tooltip shows the solar target line and the held/actual line as distinct values', async () => {
    const hass = makeHass([
      {
        sensorId,
        windowAzimuth: 180,
        coverPos: 80,
        rawCalculatedPosition: 20,
        actualPositions: { 'cover.x': 80 },
        targetSensorId,
        overrideBinaryId,
        manualOverride: true,
      },
    ]);
    const el = await mountCompass([disc()], hass);
    const tt = el.shadowRoot!.querySelector('g.cover-group > title')?.textContent ?? '';
    // Target line = solar would-be (20%); Actual line = held (80%).
    expect(tt).toContain('Target: 20%');
    expect(tt).toContain('Actual: 80%');
  });

  it('single wedge when override active but raw_calculated_position is absent', async () => {
    const hass = makeHass([
      {
        sensorId,
        windowAzimuth: 180,
        coverPos: 80,
        // no rawCalculatedPosition published
        actualPositions: { 'cover.x': 80 },
        targetSensorId,
        overrideBinaryId,
        manualOverride: true,
      },
    ]);
    const el = await mountCompass([disc()], hass);
    const fill = el.shadowRoot!.querySelector('path.cover-fill') as SVGPathElement | null;
    const actual = el.shadowRoot!.querySelector('path.cover-actual') as SVGPathElement | null;
    expect(fill).not.toBeNull();
    expect(actual).not.toBeNull();
    // No divergence data → target and actual ring coincide (current behavior).
    expect(actual!.getAttribute('d')).toBe(fill!.getAttribute('d'));
  });

  it('single wedge when raw_calculated_position equals the held position', async () => {
    const hass = makeHass([
      {
        sensorId,
        windowAzimuth: 180,
        coverPos: 80,
        rawCalculatedPosition: 80, // solar == held, no divergence
        actualPositions: { 'cover.x': 80 },
        targetSensorId,
        overrideBinaryId,
        manualOverride: true,
      },
    ]);
    const el = await mountCompass([disc()], hass);
    const fill = el.shadowRoot!.querySelector('path.cover-fill') as SVGPathElement | null;
    const actual = el.shadowRoot!.querySelector('path.cover-actual') as SVGPathElement | null;
    expect(actual!.getAttribute('d')).toBe(fill!.getAttribute('d'));
  });

  it('single wedge when raw_calculated_position differs but override is NOT active', async () => {
    const hass = makeHass([
      {
        sensorId,
        windowAzimuth: 180,
        coverPos: 80,
        rawCalculatedPosition: 20, // diverges, but override off → ignore it
        actualPositions: { 'cover.x': 80 },
        targetSensorId,
        overrideBinaryId,
        manualOverride: false,
      },
    ]);
    const el = await mountCompass([disc()], hass);
    const fill = el.shadowRoot!.querySelector('path.cover-fill') as SVGPathElement | null;
    const actual = el.shadowRoot!.querySelector('path.cover-actual') as SVGPathElement | null;
    // Target wedge stays at the sensor STATE (80), actual ring at held (80).
    expect(actual!.getAttribute('d')).toBe(fill!.getAttribute('d'));
    const heldPath = wedgePath(
      normalizeAzimuth(135),
      normalizeAzimuth(225),
      coverWedgeOuterRadius(80, 'cover_blind', 110, 110),
      0,
      0,
    );
    expect(fill!.getAttribute('d')).toBe(heldPath);
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

  it('legend renders a single Sun swatch (valid)', async () => {
    const d = makeDiscovered('entry1', 'Kitchen');
    const hass = makeHass([{ sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180 }]);
    const el = await mountCompass([d], hass);
    const dots = Array.from(el.shadowRoot!.querySelectorAll('.legend .dot.sun'));
    expect(dots.length).toBe(1);
    expect(dots[0].classList.contains('valid')).toBe(true);
    expect(dots.some((dot) => dot.classList.contains('in-fov'))).toBe(false);
  });

  it('legend labels the single sun swatch "Sun"', async () => {
    const d = makeDiscovered('entry1', 'Kitchen');
    const hass = makeHass([{ sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180 }]);
    const el = await mountCompass([d], hass);
    const text = el.shadowRoot!.textContent ?? '';
    expect(text).toContain('Sun');
    expect(text).not.toContain('Sun (hitting window)');
    expect(text).not.toContain('Sun (below horizon)');
  });

  it('FOV swatch shares its theme token with the FOV path', () => {
    const fov = cssBlock('.fov ');
    const swatch = cssBlock('.swatch.fov ');
    expect(fov).toMatch(/var\(--warning-color/);
    expect(swatch).toMatch(/var\(--warning-color/);
    expect(swatch).not.toMatch(/background:\s*gold\b/);
  });

  it('valid sun glow and the legend dot share the warning theme token', () => {
    const circleValid = cssBlock('.sun.valid ');
    const dotValid = cssBlock('.dot.sun.valid ');
    expect(circleValid).toMatch(/var\(--warning-color/);
    expect(dotValid).toMatch(/var\(--warning-color/);
  });

  it('legend outside-FOV sun dot uses a dim neutral token', () => {
    const dotUp = cssBlock('.dot.sun.up ');
    expect(dotUp).toMatch(/var\(--secondary-text-color/);
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
    expect(el.shadowRoot!.querySelector('path.fov:not(.fov-static)')?.getAttribute('d')).toBe(
      expected,
    );
  });

  it('wraps wedge around N when active sensors straddle window normal (#85 regression)', async () => {
    // Reporter case: N-facing window at 342°, FOV ±90°.
    // startAzimuth=72° (ENE, sun ENTERS FOV — CW/right edge of the arc).
    // endAzimuth=252° (WSW, sun EXITS FOV — CCW/left edge of the arc).
    // The forward arc 72°→252° (CW, 180° through S) does NOT contain 342°.
    // The fix must pick the reverse arc: wedgeStart=endAzi=252, wedgeEnd=startAzi=72
    // (CW 180° through N, passing through 342°).
    const { wedgePath, normalizeAzimuth } = await import('../src/lib/geometry');
    const d = makeDiscovered('entry1', 'Kitchen', {
      startSensorId: startId,
      endSensorId: endId,
    });
    const hass = makeHass([
      {
        sensorId,
        windowAzimuth: 342,
        fovLeft: 90,
        fovRight: 90,
        startSensorId: startId,
        startAzimuth: 72,
        startElevation: 10,
        endSensorId: endId,
        endAzimuth: 252,
        endElevation: 10,
      },
    ]);
    const el = await mountCompass([d], hass);
    // clampActiveArcToFov: fovStart=252, fovSweep=180; offS=(72-252+360)%360=180=fovSweep → clamped to 180;
    // offE=(252-252+360)%360=0; lo=0, hi=180 → wedgeStart=252, wedgeEnd=normalize(252+180)=72. ✓
    const expected = wedgePath(normalizeAzimuth(252), normalizeAzimuth(72), 110, 0, 0);
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
    const fovGroup = el.shadowRoot!.querySelector('path.fov:not(.fov-static)')?.parentElement;
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
    expect(el.shadowRoot!.querySelector('path.fov:not(.fov-static)')?.getAttribute('d')).toBe(
      expected,
    );
  });

  it('renders narrow N-arc for N-wrap envelope with interior sunrise/sunset pair (#89 follow-up)', async () => {
    // @an0Nym0us63: windowAzi=340, fov 90/90 → envelope [250..70] through N.
    // sunrise az≈58 and sunset az≈302 both inside envelope; naïve arc would go through South.
    // clampActiveArcToFov produces wedgeStart=302, wedgeEnd=58 — a 116° arc through North.
    const { wedgePath, normalizeAzimuth } = await import('../src/lib/geometry');
    const d = makeDiscovered('entry1', 'Kitchen', {
      startSensorId: startId,
      endSensorId: endId,
    });
    const hass = makeHass([
      {
        sensorId,
        windowAzimuth: 340,
        fovLeft: 90,
        fovRight: 90,
        startSensorId: startId,
        startAzimuth: 58,
        startElevation: 4,
        endSensorId: endId,
        endAzimuth: 302,
        endElevation: 2,
      },
    ]);
    const el = await mountCompass([d], hass);
    const expected = wedgePath(normalizeAzimuth(302), normalizeAzimuth(58), 110, 0, 0);
    expect(el.shadowRoot!.querySelector('path.fov:not(.fov-static)')?.getAttribute('d')).toBe(
      expected,
    );
  });

  it('clamps active arc to FOV envelope when start/end sensors report interior pair (#89 regression)', async () => {
    // Disjoint-FOV bug: windowAzi=180, fov_left=60, fov_right=60 → envelope [120°..240°], sweep=120°.
    // Integration emits interior pair startAzimuth=130, endAzimuth=170 due to elevation clipping
    // (max_elevation forces two disjoint daily intervals; both azimuths sit on the CCW/left side
    // of the window normal and are NOT straddling it).
    //
    // Old heuristic (v2.0.1): fwdSweep = (170-130+360)%360 = 40°;
    //   fwdContainsWindow = (180-130+360)%360 = 50 <= 40 → false
    //   → picks wedgeStart=170, wedgeEnd=130 (320° inverted arc — THE BUG).
    //
    // clampActiveArcToFov: offS=(130-120)=10, offE=(170-120)=50; lo=10, hi=50
    //   → wedgeStart=130, wedgeEnd=170 (correct 40° arc inside envelope).
    const { wedgePath, normalizeAzimuth, fovBandRadii } = await import('../src/lib/geometry');
    const d = makeDiscovered('entry1', 'Kitchen', {
      startSensorId: startId,
      endSensorId: endId,
    });
    const hass = makeHass([
      {
        sensorId,
        windowAzimuth: 180,
        fovLeft: 60,
        fovRight: 60,
        minElevation: 17,
        maxElevation: 50,
        startSensorId: startId,
        startAzimuth: 130,
        startElevation: 30,
        endSensorId: endId,
        endAzimuth: 170,
        endElevation: 30,
      },
    ]);
    const el = await mountCompass([d], hass);
    const { outer: fovOuterR, inner: fovInnerR } = fovBandRadii(17, 50, 110);
    const expected = wedgePath(
      normalizeAzimuth(130),
      normalizeAzimuth(170),
      fovOuterR,
      fovInnerR,
      0,
    );
    expect(el.shadowRoot!.querySelector('path.fov:not(.fov-static)')?.getAttribute('d')).toBe(
      expected,
    );
  });

  it('renders dimmed static-FOV underlay when active arc clips the configured envelope', async () => {
    const { wedgePath, normalizeAzimuth } = await import('../src/lib/geometry');
    const d = makeDiscovered('entry1', 'Kitchen', {
      startSensorId: startId,
      endSensorId: endId,
    });
    // windowAzi=180, fov ±45 → static envelope 135..225 (sweep 90).
    // start/end sensors clip to 150..210 (sweep 60) — underlay should appear.
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
    const staticPath = el.shadowRoot!.querySelector('path.fov.fov-static') as SVGPathElement | null;
    expect(staticPath).not.toBeNull();
    const expectedStatic = wedgePath(normalizeAzimuth(135), normalizeAzimuth(225), 110, 0, 0);
    expect(staticPath?.getAttribute('d')).toBe(expectedStatic);
  });

  it('does not render static underlay when active arc covers the full envelope', async () => {
    const d = makeDiscovered('entry1', 'Kitchen');
    // No start/end sensors at all → useActive=false → no underlay.
    const hass = makeHass([{ sensorId, windowAzimuth: 180 }]);
    const el = await mountCompass([d], hass);
    expect(el.shadowRoot!.querySelector('path.fov.fov-static')).toBeNull();
  });
});

describe('acp-sky-compass (multiple FOV crossings)', () => {
  // A high-latitude north-facing window catches the sun twice; the active
  // sensors describe only the evening arc, so the morning crossing must be
  // drawn as a separate `fov-extra` wedge. Freeze the clock + pin the zone so
  // the sampled day is the location's, regardless of the machine timezone.
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-21T10:00:00Z'));
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  function northHass(): HomeAssistant {
    return {
      states: {
        'sensor.sun_pos_loft': {
          state: '20',
          attributes: {
            elevation: 10,
            gamma: 0,
            window_azimuth: 0,
            fov_left: 80,
            fov_right: 80,
            azimuth_min: -80,
            azimuth_max: 80,
            in_fov: true,
            blind_spot_range: null,
          },
        },
        'sensor.start_loft': { state: 'x', attributes: { azimuth: 300, elevation: 5 } },
        'sensor.end_loft': { state: 'x', attributes: { azimuth: 340, elevation: 3 } },
      },
      config: { latitude: 60, longitude: 10.75, time_zone: 'Etc/GMT-1' },
    } as unknown as HomeAssistant;
  }

  it('draws a second wedge for the morning crossing of a north window', async () => {
    const d = makeDiscovered('loft', 'Loft', {
      startSensorId: 'sensor.start_loft',
      endSensorId: 'sensor.end_loft',
    });
    const el = await mountCompass([d], northHass());
    const extras = el.shadowRoot!.querySelectorAll('path.fov-extra');
    expect(extras.length).toBeGreaterThanOrEqual(1);
    // there is still exactly one primary active-arc wedge (plus its static underlay)
    expect(el.shadowRoot!.querySelectorAll('path.fov:not(.fov-static)').length).toBe(1);
    // each extra crossing reuses the active-sun-arc tooltip
    const titleText = extras[0].parentElement?.querySelector('title')?.textContent ?? '';
    expect(titleText).toContain('Active sun arc');
  });
});

describe('acp-sky-compass tooltip cursor', () => {
  // Regression guard: tooltip carriers must use cursor: default, not cursor: help
  // (issue #134 — the question-mark cursor confuses users).
  const cssText = (SkyCompass as unknown as { styles: { cssText: string } }).styles.cssText;

  it('g[data-tooltip] uses cursor: default, not cursor: help', () => {
    expect(cssText).not.toContain('cursor: help');
  });
});
