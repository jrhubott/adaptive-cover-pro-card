import { describe, it, expect } from 'vitest';
import '../src/components/sky-compass';
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

function makeDiscovered(entryId: string, title: string): DiscoveredEntities {
  return {
    entry_id: entryId,
    entry_title: title,
    cover_type: 'cover_blind',
    entities: { sun_sensor: `sensor.sun_pos_${entryId}` },
    managed_covers: [],
  };
}

function makeHass(
  entries: { sensorId: string; windowAzimuth: number; blindSpot?: [number, number] }[],
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
      },
    };
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

describe('acp-sky-compass visual toggles', () => {
  const d = () => makeDiscovered('entry1', 'Kitchen');
  const hass = () =>
    makeHass([{ sensorId: 'sensor.sun_pos_entry1', windowAzimuth: 180, blindSpot: [0, 45] }]);

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
