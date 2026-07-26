import { describe, it, expect, vi, afterEach } from 'vitest';
import '../src/components/more-info-dialog';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities, PositionHistorySample } from '../src/types';

interface DialogLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  discovered?: DiscoveredEntities;
  open?: boolean;
  showCompass?: boolean;
  showElevationChart?: boolean;
  showSolarCalc?: boolean;
  stateColor?: boolean;
  badges?: Record<string, boolean>;
}

function badgeKinds(el: DialogLike): string[] {
  return Array.from(el.shadowRoot!.querySelectorAll('.header acp-tile-badge')).map((b) => {
    const span = b.shadowRoot!.querySelector('span.badge') as HTMLElement;
    return (
      Array.from(span.classList)
        .filter((c) => c.startsWith('kind-'))
        .map((c) => c.slice('kind-'.length))[0] ?? ''
    );
  });
}

async function mount(props: Partial<DialogLike>): Promise<DialogLike> {
  const el = document.createElement('acp-more-info-dialog') as DialogLike;
  Object.assign(el, props);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function discovered(extra: Partial<DiscoveredEntities['entities']> = {}): DiscoveredEntities {
  return {
    entry_id: 'entry_xyz',
    entry_title: 'Living room',
    cover_type: 'cover_blind',
    entities: {
      decision_trace_sensor: 'sensor.decision_trace',
      target_position_sensor: 'sensor.cover_position',
      position_mismatch_binary: 'binary_sensor.position_mismatch',
      reset_override_button: 'button.reset',
      ...extra,
    },
    managed_covers: ['cover.left'],
  };
}

function hass(
  overrides: Partial<{
    winner: string;
    trace: Array<{ handler: string; matched: boolean; position: number | null; reason: string }>;
    traceExtraAttrs: Record<string, unknown>;
    callService: (...args: unknown[]) => unknown;
  }> = {},
): HomeAssistant {
  const trace = overrides.trace ?? [];
  return {
    states: {
      'sensor.decision_trace': {
        state: overrides.winner ?? 'solar',
        attributes: { trace, reason: '', ...(overrides.traceExtraAttrs ?? {}) },
      },
      'sensor.cover_position': {
        state: '42',
        attributes: { actual_positions: { 'cover.left': 40 } },
      },
      'binary_sensor.position_mismatch': { state: 'off', attributes: {} },
      'cover.left': { state: 'open', attributes: { friendly_name: 'Left blind' } },
    },
    callService: overrides.callService ?? vi.fn(),
  } as unknown as HomeAssistant;
}

describe('acp-more-info-dialog: open/close', () => {
  it('renders no dialog content when open=false', async () => {
    const el = await mount({ hass: hass(), discovered: discovered(), open: false });
    expect(el.shadowRoot!.querySelector('[data-open]')).toBeNull();
  });

  it('reflects open=true via [data-open] attribute on the container', async () => {
    const el = await mount({ hass: hass(), discovered: discovered(), open: true });
    expect(el.shadowRoot!.querySelector('[data-open]')).toBeTruthy();
  });

  it('close button dispatches acp-dialog-close', async () => {
    const el = await mount({ hass: hass(), discovered: discovered(), open: true });
    const listener = vi.fn();
    el.addEventListener('acp-dialog-close', listener);
    (el.shadowRoot!.querySelector('button.close') as HTMLElement).click();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe('acp-more-info-dialog: minute timer (now cursor)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('ticks every minute only while open', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-13T10:00:00.000Z')); // on a boundary → ticks at +60s, +120s
    const el = await mount({ hass: hass(), discovered: discovered(), open: false });

    const spy = vi.spyOn(el as unknown as { requestUpdate: () => void }, 'requestUpdate');
    vi.advanceTimersByTime(180_000);
    expect(spy).not.toHaveBeenCalled(); // closed → no timer

    el.open = true;
    await el.updateComplete;
    spy.mockClear();
    vi.advanceTimersByTime(120_000);
    expect(spy).toHaveBeenCalledTimes(2);

    el.open = false;
    await el.updateComplete;
    spy.mockClear();
    vi.advanceTimersByTime(180_000);
    expect(spy).not.toHaveBeenCalled(); // closed again → timer cleared
  });
});

describe('acp-more-info-dialog: header nav buttons', () => {
  it('omits the device-link button when discovered.device_id is missing', async () => {
    const el = await mount({ hass: hass(), discovered: discovered(), open: true });
    expect(el.shadowRoot!.querySelector('button.device-link')).toBeNull();
  });

  it('renders the device-link button when discovered.device_id is present', async () => {
    const d = { ...discovered(), device_id: 'dev_123' };
    const el = await mount({ hass: hass(), discovered: d, open: true });
    expect(el.shadowRoot!.querySelector('button.device-link')).toBeTruthy();
  });

  it('clicking device-link navigates to the device page and closes the dialog', async () => {
    const d = { ...discovered(), device_id: 'dev_123' };
    const el = await mount({ hass: hass(), discovered: d, open: true });
    const pushSpy = vi.spyOn(history, 'pushState');
    const eventSpy = vi.fn();
    window.addEventListener('location-changed', eventSpy);
    const closeSpy = vi.fn();
    el.addEventListener('acp-dialog-close', closeSpy);

    (el.shadowRoot!.querySelector('button.device-link') as HTMLElement).click();

    expect(pushSpy).toHaveBeenCalledWith(null, '', '/config/devices/device/dev_123');
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledTimes(1);

    window.removeEventListener('location-changed', eventSpy);
    pushSpy.mockRestore();
  });

  it('always renders the options-link button regardless of device_id', async () => {
    const el = await mount({ hass: hass(), discovered: discovered(), open: true });
    expect(el.shadowRoot!.querySelector('button.options-link')).toBeTruthy();
  });

  it('clicking options-link navigates to the integration page and closes the dialog', async () => {
    const el = await mount({ hass: hass(), discovered: discovered(), open: true });
    const pushSpy = vi.spyOn(history, 'pushState');
    const eventSpy = vi.fn();
    window.addEventListener('location-changed', eventSpy);
    const closeSpy = vi.fn();
    el.addEventListener('acp-dialog-close', closeSpy);

    (el.shadowRoot!.querySelector('button.options-link') as HTMLElement).click();

    expect(pushSpy).toHaveBeenCalledWith(
      null,
      '',
      '/config/integrations/integration/adaptive_cover_pro',
    );
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledTimes(1);

    window.removeEventListener('location-changed', eventSpy);
    pushSpy.mockRestore();
  });
});

describe('acp-more-info-dialog: header content', () => {
  it('renders the discovered title in the header', async () => {
    const el = await mount({ hass: hass(), discovered: discovered(), open: true });
    expect(el.shadowRoot!.querySelector('.header .title')?.textContent?.trim()).toBe('Living room');
  });

  it("derives the header icon from the managed cover's device_class", async () => {
    const h = hass();
    (h.states['cover.left'].attributes as Record<string, unknown>).device_class = 'awning';
    const el = await mount({ hass: h, discovered: discovered(), open: true });
    expect(el.shadowRoot!.querySelector('.header ha-icon.cover-icon')?.getAttribute('icon')).toBe(
      'mdi:awning-outline',
    );
  });

  it("honors the managed cover's explicit icon in the header", async () => {
    const h = hass();
    (h.states['cover.left'].attributes as Record<string, unknown>).device_class = 'awning';
    (h.states['cover.left'].attributes as Record<string, unknown>).icon = 'mdi:star';
    const el = await mount({ hass: h, discovered: discovered(), open: true });
    expect(el.shadowRoot!.querySelector('.header ha-icon.cover-icon')?.getAttribute('icon')).toBe(
      'mdi:star',
    );
  });

  it('colors the header cover icon by state (open) by default', async () => {
    const el = await mount({ hass: hass(), discovered: discovered(), open: true });
    expect(
      el.shadowRoot!.querySelector('.header ha-icon.cover-icon')?.getAttribute('style'),
    ).toContain(
      'var(--state-cover-open-color, var(--state-cover-active-color, var(--state-cover-color, var(--state-active-color))))',
    );
  });

  it('colors the header cover icon by state (closed) by default', async () => {
    const h = hass();
    h.states['cover.left'].state = 'closed';
    const el = await mount({ hass: h, discovered: discovered(), open: true });
    expect(
      el.shadowRoot!.querySelector('.header ha-icon.cover-icon')?.getAttribute('style'),
    ).toContain(
      'var(--state-cover-closed-color, var(--state-cover-inactive-color, var(--state-cover-color, var(--state-inactive-color))))',
    );
  });

  it('omits the inline header icon state color when stateColor is false', async () => {
    const el = await mount({
      hass: hass(),
      discovered: discovered(),
      open: true,
      stateColor: false,
    });
    expect(
      el.shadowRoot!.querySelector('.header ha-icon.cover-icon')?.getAttribute('style') ?? '',
    ).not.toContain('--state-cover');
  });

  it('renders one badge per matched handler', async () => {
    const el = await mount({
      hass: hass({
        winner: 'manual',
        trace: [
          { handler: 'solar', matched: true, position: 100, reason: '' },
          { handler: 'custom_position_1', matched: true, position: 60, reason: '' },
          { handler: 'manual_override', matched: true, position: 60, reason: '' },
          { handler: 'default', matched: false, position: 0, reason: '' },
        ],
        traceExtraAttrs: { custom_position_active_slot: 1, custom_position_minimum_mode: true },
      }),
      discovered: discovered(),
      open: true,
    });
    const badges = el.shadowRoot!.querySelectorAll('.header acp-tile-badge');
    expect(badges.length).toBe(3);
  });

  it('renders the plain-English decision summary line', async () => {
    const el = await mount({
      hass: hass({
        winner: 'manual',
        trace: [
          { handler: 'solar', matched: true, position: 100, reason: '' },
          { handler: 'manual_override', matched: true, position: 60, reason: '' },
        ],
      }),
      discovered: discovered(),
      open: true,
    });
    const txt = el.shadowRoot!.querySelector('.summary')?.textContent?.trim();
    expect(txt).toBe('Solar Tracking 100% → Manual Override 60%');
  });
});

describe('acp-more-info-dialog: badge inversion + opt-in', () => {
  function solarTrace() {
    return [
      { handler: 'solar', matched: true, position: 100, reason: '' },
      { handler: 'default', matched: false, position: 0, reason: '' },
    ];
  }

  it('shows the solar badge when solar matched and cloud is not the winner', async () => {
    const el = await mount({
      hass: hass({ winner: 'solar', trace: solarTrace() }),
      discovered: discovered(),
      open: true,
    });
    expect(badgeKinds(el)).toContain('solar');
  });

  it('shows the solar badge even when cloud is not configured (enabled_handlers omits cloud)', async () => {
    const el = await mount({
      hass: hass({
        winner: 'solar',
        trace: solarTrace(),
        traceExtraAttrs: { enabled_handlers: ['solar', 'manual'] },
      }),
      discovered: discovered(),
      open: true,
    });
    expect(badgeKinds(el)).toContain('solar');
  });

  it('drops the solar badge when badges.solar is false even though it is active', async () => {
    const el = await mount({
      hass: hass({ winner: 'solar', trace: solarTrace() }),
      discovered: discovered(),
      open: true,
      badges: { solar: false },
    });
    expect(badgeKinds(el)).not.toContain('solar');
  });

  it('renders the cloud badge when the cloud handler matched', async () => {
    const el = await mount({
      hass: hass({
        winner: 'cloud_suppression',
        trace: [
          { handler: 'cloud_suppression', matched: true, position: 0, reason: '' },
          { handler: 'default', matched: false, position: 0, reason: '' },
        ],
        traceExtraAttrs: { enabled_handlers: ['cloud', 'solar'] },
      }),
      discovered: discovered(),
      open: true,
    });
    expect(badgeKinds(el)).toContain('cloud');
  });

  it('hides the cloud badge when badges.cloud is false', async () => {
    const el = await mount({
      hass: hass({
        winner: 'cloud_suppression',
        trace: [
          { handler: 'cloud_suppression', matched: true, position: 0, reason: '' },
          { handler: 'default', matched: false, position: 0, reason: '' },
        ],
        traceExtraAttrs: { enabled_handlers: ['cloud', 'solar'] },
      }),
      discovered: discovered(),
      open: true,
      badges: { cloud: false },
    });
    expect(badgeKinds(el)).not.toContain('cloud');
  });

  it('respects badges.motion: false in the dialog list', async () => {
    const el = await mount({
      hass: hass({
        winner: 'manual',
        trace: [
          { handler: 'motion_timeout', matched: true, position: 100, reason: '' },
          { handler: 'manual_override', matched: true, position: 60, reason: '' },
        ],
      }),
      discovered: discovered(),
      open: true,
      badges: { motion: false },
    });
    const kinds = badgeKinds(el);
    expect(kinds).toContain('manual');
    expect(kinds).not.toContain('motion');
  });
});

describe('acp-more-info-dialog: slot management', () => {
  const slots = [
    {
      slot: 1,
      enabled: true,
      sensor: 'binary_sensor.scene_a',
      sensor_name: 'Table extension',
      position: 60,
      priority: 80,
      min_mode: true,
    },
    {
      slot: 2,
      enabled: false,
      sensor: 'binary_sensor.scene_b',
      sensor_name: 'Movie',
      position: 30,
      priority: 70,
      min_mode: false,
    },
    {
      slot: 3,
      enabled: false,
      sensor: null,
      sensor_name: null,
      position: null,
      priority: null,
      min_mode: null,
    },
    {
      slot: 4,
      enabled: false,
      sensor: null,
      sensor_name: null,
      position: null,
      priority: null,
      min_mode: null,
    },
  ];

  it('renders one slot row per configured slot, hiding unconfigured ones', async () => {
    const el = await mount({
      hass: hass({ traceExtraAttrs: { custom_position_slots: slots } }),
      discovered: discovered(),
      open: true,
    });
    // Make the advanced section visible so slot rows render.
    (el.shadowRoot!.querySelector('.advanced-toggle') as HTMLElement).click();
    await el.updateComplete;
    const rows = el.shadowRoot!.querySelectorAll('.slot-row');
    expect(rows.length).toBe(2);
  });

  it('renders the slot label using sensor_name when present, falling back to #N', async () => {
    const noNameSlots = [{ ...slots[0], sensor_name: null }, { ...slots[1] }, slots[2], slots[3]];
    const el = await mount({
      hass: hass({ traceExtraAttrs: { custom_position_slots: noNameSlots } }),
      discovered: discovered(),
      open: true,
    });
    (el.shadowRoot!.querySelector('.advanced-toggle') as HTMLElement).click();
    await el.updateComplete;
    const labels = Array.from(el.shadowRoot!.querySelectorAll('.slot-row .slot-label')).map(
      (el) => el.textContent?.trim() ?? '',
    );
    expect(labels[0]).toMatch(/^#1\b/);
    expect(labels[1]).toContain('Movie');
  });

  it('shows the floor badge only when min_mode is true', async () => {
    const el = await mount({
      hass: hass({ traceExtraAttrs: { custom_position_slots: slots } }),
      discovered: discovered(),
      open: true,
    });
    (el.shadowRoot!.querySelector('.advanced-toggle') as HTMLElement).click();
    await el.updateComplete;
    const minModeTags = el.shadowRoot!.querySelectorAll('.slot-row .slot-min-mode');
    // Only the slot 1 row should have a floor marker.
    expect(minModeTags.length).toBe(1);
  });

  it('renders a template chip only for slots with template=true', async () => {
    const templated = [
      {
        ...slots[0],
        template: true,
        template_mode: 'or' as const,
        sensors: ['binary_sensor.a', 'binary_sensor.b'],
      },
      { ...slots[1] }, // not templated
    ];
    const el = await mount({
      hass: hass({ traceExtraAttrs: { custom_position_slots: templated } }),
      discovered: discovered(),
      open: true,
    });
    (el.shadowRoot!.querySelector('.advanced-toggle') as HTMLElement).click();
    await el.updateComplete;
    const chips = el.shadowRoot!.querySelectorAll('.slot-row .slot-template');
    expect(chips.length).toBe(1);
    // The chip's tooltip surfaces the sensor count and combine mode.
    expect(chips[0].getAttribute('data-tooltip')).toContain('2 sensors');
    expect(chips[0].getAttribute('data-tooltip')).toContain('or');
  });

  it('floor pill is the ↥ glyph', async () => {
    const el = await mount({
      hass: hass({ traceExtraAttrs: { custom_position_slots: slots } }),
      discovered: discovered(),
      open: true,
    });
    (el.shadowRoot!.querySelector('.advanced-toggle') as HTMLElement).click();
    await el.updateComplete;
    const pill = el.shadowRoot!.querySelector('.slot-row .slot-min-mode');
    expect(pill!.textContent?.trim()).toBe('↥');
  });

  it('floor pill is subdued (is-bypassable) when slot priority <= MANUAL_OVERRIDE_PRIORITY', async () => {
    // slot 1 has priority 80 ≤ 80 → bypassable
    const el = await mount({
      hass: hass({ traceExtraAttrs: { custom_position_slots: slots } }),
      discovered: discovered(),
      open: true,
    });
    (el.shadowRoot!.querySelector('.advanced-toggle') as HTMLElement).click();
    await el.updateComplete;
    const pill = el.shadowRoot!.querySelector('.slot-row .slot-min-mode');
    expect(pill!.classList.contains('is-bypassable')).toBe(true);
  });

  it('floor pill is emphasized (not is-bypassable) when slot priority > MANUAL_OVERRIDE_PRIORITY', async () => {
    const highPrioritySlots = [{ ...slots[0], priority: 90 }, slots[1], slots[2], slots[3]];
    const el = await mount({
      hass: hass({ traceExtraAttrs: { custom_position_slots: highPrioritySlots } }),
      discovered: discovered(),
      open: true,
    });
    (el.shadowRoot!.querySelector('.advanced-toggle') as HTMLElement).click();
    await el.updateComplete;
    const pill = el.shadowRoot!.querySelector('.slot-row .slot-min-mode');
    expect(pill!.classList.contains('is-bypassable')).toBe(false);
  });

  it('toggle calls set_custom_position with {slot, enabled} for the row', async () => {
    const callService = vi.fn();
    const el = await mount({
      hass: hass({
        callService,
        traceExtraAttrs: { custom_position_slots: slots },
      }),
      discovered: discovered(),
      open: true,
    });
    (el.shadowRoot!.querySelector('.advanced-toggle') as HTMLElement).click();
    await el.updateComplete;
    // First slot's toggle — clicking it should send enabled=false (it was true).
    const toggle = el.shadowRoot!.querySelector(
      '.slot-row[data-slot="1"] button.slot-toggle',
    ) as HTMLElement;
    toggle.click();
    expect(callService).toHaveBeenCalledWith('adaptive_cover_pro', 'set_custom_position', {
      entity_id: 'cover.left',
      slot: 1,
      enabled: false,
    });
  });

  it('hides the slot section entirely when custom_position_slots is absent', async () => {
    const el = await mount({
      hass: hass(),
      discovered: discovered(),
      open: true,
    });
    (el.shadowRoot!.querySelector('.advanced-toggle') as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.slots-section')).toBeNull();
  });
});

describe('acp-more-info-dialog: forecast strip', () => {
  function discWithForecast(): DiscoveredEntities {
    return {
      ...discovered(),
      entities: { ...discovered().entities, position_forecast_sensor: 'sensor.forecast' },
    };
  }

  it('renders the strip when the forecast sensor has samples', async () => {
    const d = discWithForecast();
    const h = hass();
    (h.states as Record<string, unknown>)['sensor.forecast'] = {
      state: '2026-06-01T10:00:00Z',
      attributes: {
        forecast: [
          { t: '2026-06-01T06:00:00Z', position: 0, handler: 'default' },
          { t: '2026-06-01T08:00:00Z', position: 50, handler: 'solar' },
        ],
        events: [{ t: '2026-06-01T07:30:00Z', kind: 'fov_enter', label: 'Sun enters FOV' }],
      },
    };
    const el = await mount({ hass: h, discovered: d, open: true });
    const strip = el.shadowRoot!.querySelector('acp-forecast-strip');
    expect(strip).toBeTruthy();
  });

  it('hides the strip when the forecast sensor is not discovered', async () => {
    const el = await mount({ hass: hass(), discovered: discovered(), open: true });
    expect(el.shadowRoot!.querySelector('acp-forecast-strip')).toBeNull();
  });

  it('hides the strip when the forecast attribute has no samples', async () => {
    const d = discWithForecast();
    const h = hass();
    (h.states as Record<string, unknown>)['sensor.forecast'] = {
      state: '',
      attributes: { forecast: [], events: [] },
    };
    const el = await mount({ hass: h, discovered: d, open: true });
    expect(el.shadowRoot!.querySelector('acp-forecast-strip')).toBeNull();
  });
});

describe('acp-more-info-dialog: sky compass', () => {
  it('renders the compass in the advanced section by default when advanced is open', async () => {
    const el = await mount({ hass: hass(), discovered: discovered(), open: true });
    (el.shadowRoot!.querySelector('.advanced-toggle') as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.advanced acp-sky-compass')).toBeTruthy();
  });

  it('hides the compass when showCompass=false', async () => {
    const el = await mount({
      hass: hass(),
      discovered: discovered(),
      open: true,
      showCompass: false,
    });
    (el.shadowRoot!.querySelector('.advanced-toggle') as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.advanced acp-sky-compass')).toBeNull();
  });

  it('does not render the compass while advanced is collapsed', async () => {
    const el = await mount({ hass: hass(), discovered: discovered(), open: true });
    expect(el.shadowRoot!.querySelector('acp-sky-compass')).toBeNull();
  });
});

describe('acp-more-info-dialog: elevation chart', () => {
  it('renders the elevation chart in the advanced section by default when advanced is open', async () => {
    const el = await mount({ hass: hass(), discovered: discovered(), open: true });
    (el.shadowRoot!.querySelector('.advanced-toggle') as HTMLElement).click();
    await el.updateComplete;
    const chart = el.shadowRoot!.querySelector('.advanced acp-elevation-chart') as
      | (HTMLElement & { discoveredList?: unknown[]; updateComplete?: Promise<boolean> })
      | null;
    expect(chart).toBeTruthy();
    // Guard the prop wiring: the chart takes discoveredList (not the removed
    // single `discovered`). A stale binding would leave it empty → renders
    // nothing, silently dropping the chart from the more-info dialog.
    expect(chart!.discoveredList?.length).toBe(1);
    await chart!.updateComplete;
    // It renders real content (chart or placeholder), not the empty `nothing`
    // a stale/empty binding would produce.
    expect(chart!.shadowRoot!.querySelector('.wrap, .placeholder')).toBeTruthy();
  });

  it('hides the elevation chart when showElevationChart=false', async () => {
    const el = await mount({
      hass: hass(),
      discovered: discovered(),
      open: true,
      showElevationChart: false,
    });
    (el.shadowRoot!.querySelector('.advanced-toggle') as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.advanced acp-elevation-chart')).toBeNull();
  });

  it('does not render the elevation chart while advanced is collapsed', async () => {
    const el = await mount({ hass: hass(), discovered: discovered(), open: true });
    expect(el.shadowRoot!.querySelector('acp-elevation-chart')).toBeNull();
  });
});

describe('acp-more-info-dialog: solar calculation', () => {
  it('renders the solar-calc panel in the advanced section by default', async () => {
    const el = await mount({ hass: hass(), discovered: discovered(), open: true });
    (el.shadowRoot!.querySelector('.advanced-toggle') as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.advanced acp-solar-calc')).toBeTruthy();
  });

  it('hides the solar-calc panel when showSolarCalc=false', async () => {
    const el = await mount({
      hass: hass(),
      discovered: discovered(),
      open: true,
      showSolarCalc: false,
    });
    (el.shadowRoot!.querySelector('.advanced-toggle') as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.advanced acp-solar-calc')).toBeNull();
  });

  it('does not render the solar-calc panel while advanced is collapsed', async () => {
    const el = await mount({ hass: hass(), discovered: discovered(), open: true });
    expect(el.shadowRoot!.querySelector('acp-solar-calc')).toBeNull();
  });
});

describe('acp-more-info-dialog: Resume Auto', () => {
  it('Resume button calls button.press on reset_override_button', async () => {
    const callService = vi.fn();
    const d = discovered({ manual_override_binary: 'binary_sensor.manual_override' });
    const h = hass({ callService, winner: 'solar' });
    (h.states as Record<string, { state: string; attributes: Record<string, unknown> }>)[
      'binary_sensor.manual_override'
    ] = { state: 'on', attributes: {} };
    const el = await mount({ hass: h, discovered: d, open: true });
    (el.shadowRoot!.querySelector('button.resume') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith('button', 'press', { entity_id: 'button.reset' });
  });

  it('Resume button is hidden when no reset_override_button discovered', async () => {
    const d = discovered();
    delete d.entities.reset_override_button;
    const el = await mount({
      hass: hass({ winner: 'custom_position_1' }),
      discovered: d,
      open: true,
    });
    expect(el.shadowRoot!.querySelector('button.resume')).toBeNull();
  });

  it('Resume button is hidden when control is fully automatic (no manual override, no custom position)', async () => {
    const el = await mount({
      hass: hass({ winner: 'solar' }),
      discovered: discovered(),
      open: true,
    });
    expect(el.shadowRoot!.querySelector('button.resume')).toBeNull();
  });

  it('Resume button is hidden when winner is custom_position and manual override is off', async () => {
    const el = await mount({
      hass: hass({ winner: 'custom_position_1' }),
      discovered: discovered(),
      open: true,
    });
    expect(el.shadowRoot!.querySelector('button.resume')).toBeNull();
  });

  it('Resume button is shown when manual override is active AND winner is custom_position', async () => {
    const d = discovered({ manual_override_binary: 'binary_sensor.manual_override' });
    const h = hass({ winner: 'custom_position_1' });
    (h.states as Record<string, { state: string; attributes: Record<string, unknown> }>)[
      'binary_sensor.manual_override'
    ] = { state: 'on', attributes: {} };
    const el = await mount({ hass: h, discovered: d, open: true });
    expect(el.shadowRoot!.querySelector('button.resume')).toBeTruthy();
  });

  it('Resume button is shown when manual override is active', async () => {
    const d = discovered({ manual_override_binary: 'binary_sensor.manual_override' });
    const h = hass({ winner: 'solar' });
    (h.states as Record<string, { state: string; attributes: Record<string, unknown> }>)[
      'binary_sensor.manual_override'
    ] = { state: 'on', attributes: {} };
    const el = await mount({ hass: h, discovered: d, open: true });
    expect(el.shadowRoot!.querySelector('button.resume')).toBeTruthy();
  });
});

describe('acp-more-info-dialog: Controls row', () => {
  type SwitchStates = Partial<{
    automatic: 'on' | 'off';
    climate: 'on' | 'off';
    motion: 'on' | 'off';
  }>;
  function withControls(states: SwitchStates = {}): {
    d: DiscoveredEntities;
    h: HomeAssistant;
    callService: ReturnType<typeof vi.fn>;
  } {
    const d = discovered({
      automatic_control_switch: 'switch.automatic',
      climate_mode_switch: 'switch.climate',
      motion_control_switch: 'switch.motion',
    });
    const callService = vi.fn();
    const h = hass({ callService });
    const s = h.states as Record<string, { state: string; attributes: Record<string, unknown> }>;
    s['switch.automatic'] = { state: states.automatic ?? 'on', attributes: {} };
    s['switch.climate'] = { state: states.climate ?? 'on', attributes: {} };
    s['switch.motion'] = { state: states.motion ?? 'on', attributes: {} };
    return { d, h, callService };
  }

  it('renders three chips when all three switches are discovered', async () => {
    const { d, h } = withControls();
    const el = await mount({ hass: h, discovered: d, open: true });
    const chips = el.shadowRoot!.querySelectorAll('.controls-block .ctrl-toggle');
    expect(chips.length).toBe(3);
    const labels = Array.from(chips).map(
      (c) => c.querySelector('.ctrl-label')?.textContent?.trim() ?? '',
    );
    expect(labels).toEqual(['Automatic', 'Climate', 'Occupancy']);
  });

  it('chip state reflects each switch (on/off)', async () => {
    const { d, h } = withControls({ automatic: 'off' });
    const el = await mount({ hass: h, discovered: d, open: true });
    const chips = el.shadowRoot!.querySelectorAll('.controls-block .ctrl-toggle');
    expect(chips[0].classList.contains('off')).toBe(true);
    expect(chips[0].getAttribute('aria-pressed')).toBe('false');
    expect(chips[1].classList.contains('on')).toBe(true);
    expect(chips[1].getAttribute('aria-pressed')).toBe('true');
  });

  it('clicking an on chip calls switch.turn_off with that entity_id', async () => {
    const { d, h, callService } = withControls();
    const el = await mount({ hass: h, discovered: d, open: true });
    const chip = el.shadowRoot!.querySelectorAll('.controls-block .ctrl-toggle')[0] as HTMLElement;
    chip.click();
    expect(callService).toHaveBeenCalledWith('switch', 'turn_off', {
      entity_id: 'switch.automatic',
    });
  });

  it('clicking an off chip calls switch.turn_on with that entity_id', async () => {
    const { d, h, callService } = withControls({ motion: 'off' });
    const el = await mount({ hass: h, discovered: d, open: true });
    const chip = el.shadowRoot!.querySelectorAll('.controls-block .ctrl-toggle')[2] as HTMLElement;
    chip.click();
    expect(callService).toHaveBeenCalledWith('switch', 'turn_on', { entity_id: 'switch.motion' });
  });

  it('renders only the discovered switches (omits chips for missing entities)', async () => {
    const d = discovered({ automatic_control_switch: 'switch.automatic' });
    const h = hass();
    (h.states as Record<string, { state: string; attributes: Record<string, unknown> }>)[
      'switch.automatic'
    ] = { state: 'on', attributes: {} };
    const el = await mount({ hass: h, discovered: d, open: true });
    const chips = el.shadowRoot!.querySelectorAll('.controls-block .ctrl-toggle');
    expect(chips.length).toBe(1);
    expect(chips[0].querySelector('.ctrl-label')?.textContent?.trim()).toBe('Automatic');
  });

  it('hides the Controls block entirely when none of the three switches are discovered', async () => {
    const el = await mount({ hass: hass(), discovered: discovered(), open: true });
    expect(el.shadowRoot!.querySelector('.controls-block')).toBeNull();
  });
});

describe('acp-more-info-dialog: header badge respects control switches', () => {
  function trace() {
    return [
      { handler: 'solar', matched: true, position: 100, reason: '' },
      { handler: 'default', matched: false, position: 0, reason: '' },
    ];
  }

  it('renders matched handler badges when both switches are on', async () => {
    const d = discovered({
      automatic_control_switch: 'switch.automatic',
      integration_enabled_switch: 'switch.master',
    });
    const h = hass({ trace: trace() });
    const s = h.states as Record<string, { state: string; attributes: Record<string, unknown> }>;
    s['switch.automatic'] = { state: 'on', attributes: {} };
    s['switch.master'] = { state: 'on', attributes: {} };
    const el = await mount({ hass: h, discovered: d, open: true });
    const badges = el.shadowRoot!.querySelectorAll('.header acp-tile-badge');
    expect(badges.length).toBe(1);
  });

  it('hides header badges entirely when automatic_control is off (integration on)', async () => {
    const d = discovered({
      automatic_control_switch: 'switch.automatic',
      integration_enabled_switch: 'switch.master',
    });
    const h = hass({ trace: trace() });
    const s = h.states as Record<string, { state: string; attributes: Record<string, unknown> }>;
    s['switch.automatic'] = { state: 'off', attributes: {} };
    s['switch.master'] = { state: 'on', attributes: {} };
    const el = await mount({ hass: h, discovered: d, open: true });
    const badges = el.shadowRoot!.querySelectorAll('.header acp-tile-badge');
    expect(badges.length).toBe(0);
  });

  it('renders a single Off badge in the header when integration_enabled is off', async () => {
    const d = discovered({
      automatic_control_switch: 'switch.automatic',
      integration_enabled_switch: 'switch.master',
    });
    const h = hass({ trace: trace() });
    const s = h.states as Record<string, { state: string; attributes: Record<string, unknown> }>;
    s['switch.automatic'] = { state: 'on', attributes: {} };
    s['switch.master'] = { state: 'off', attributes: {} };
    const el = await mount({ hass: h, discovered: d, open: true });
    const badges = el.shadowRoot!.querySelectorAll('.header acp-tile-badge');
    expect(badges.length).toBe(1);
    const txt = badges[0].shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    expect(txt).toBe('Off');
  });
});

describe('acp-more-info-dialog: position-history fetch cache (#234)', () => {
  const flush = (): Promise<void> => new Promise((r) => setTimeout(r, 0));

  function historyHass(callWS: ReturnType<typeof vi.fn>): HomeAssistant {
    const h = hass();
    (h as unknown as { callWS: unknown }).callWS = callWS;
    return h;
  }

  /** Same entry, but the position axis now reports the inverse frame. */
  function inverseDiscovered(): DiscoveredEntities {
    return {
      ...discovered(),
      discovery: {
        cover_type: 'cover_awning',
        axes: [
          {
            id: 'position',
            label: 'Position',
            state_attr: 'current_position',
            supported: true,
            inverted: true,
          },
        ],
      },
    };
  }

  function stripHistory(el: DialogLike): number[] {
    const strip = el.shadowRoot!.querySelector('acp-forecast-strip') as
      | (HTMLElement & { history: PositionHistorySample[] })
      | null;
    return (strip?.history ?? []).map((s) => s.position);
  }

  it('refetches when the position axis frame flips while the dialog is open', async () => {
    // `inverted` is not stable for the life of an open dialog: control_status can
    // be unavailable at dialog-open and arrive a tick later, or the integration
    // can reload mid-day. The cache key must carry the frame, or the track stays
    // in the old frame and plots upside-down against the logical forecast curve.
    const callWS = vi.fn().mockResolvedValue({
      'cover.left': [
        { s: 'open', a: { current_position: 30 }, lu: (Date.now() - 3_600_000) / 1000 },
      ],
    });
    const el = await mount({ hass: historyHass(callWS), discovered: discovered(), open: true });
    await flush();
    await el.updateComplete;
    expect(callWS).toHaveBeenCalledTimes(1);
    // Sample + forward-filled tail, both in the cover frame (not inverted yet).
    expect(stripHistory(el)).toEqual([30, 30]);

    el.discovered = inverseDiscovered();
    await el.updateComplete;
    await flush();
    await el.updateComplete;
    expect(callWS).toHaveBeenCalledTimes(2);
    expect(stripHistory(el)).toEqual([70, 70]);
  });

  it('does not refetch when the frame is unchanged', async () => {
    const callWS = vi.fn().mockResolvedValue({
      'cover.left': [
        { s: 'open', a: { current_position: 30 }, lu: (Date.now() - 3_600_000) / 1000 },
      ],
    });
    const el = await mount({ hass: historyHass(callWS), discovered: discovered(), open: true });
    await flush();
    await el.updateComplete;
    expect(callWS).toHaveBeenCalledTimes(1);

    // A fresh-but-equivalent `discovered` (same covers, same frame) must still
    // hit the cache — the key stays keyed on values, never object identity.
    el.discovered = discovered();
    await el.updateComplete;
    await flush();
    expect(callWS).toHaveBeenCalledTimes(1);
  });
});
