import { describe, it, expect, vi } from 'vitest';
import '../src/components/cover-bar';
import { CoverBar } from '../src/components/cover-bar';
import { INTEGRATION_DOMAIN } from '../src/const';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';
import { t } from '../src/lib/i18n';
import { formatPercent } from '../src/lib/formatters';

interface CoverBarLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  discovered?: DiscoveredEntities;
}

const baseDiscovered: DiscoveredEntities = {
  entry_id: 'entry1',
  entry_title: 'Test',
  cover_type: 'cover_blind',
  entities: {},
  managed_covers: [],
};

/** A component's stylesheet as one string. `styles` became an ARRAY when the
 *  rail overlay's shared fragment was factored out, so a single `.cssText` no
 *  longer covers the whole sheet. */
function sheetOf(ctor: unknown): string {
  const styles = (ctor as { styles: { cssText: string } | { cssText: string }[] }).styles;
  return Array.isArray(styles) ? styles.map((s) => s.cssText).join('\n') : styles.cssText;
}

describe('acp-cover-bar fill style — issue #135', () => {
  it('fill CSS uses color-mix for reduced opacity', () => {
    const styles = sheetOf(CoverBar);
    expect(styles).toContain('color-mix');
  });

  it('renders the percent label before the track', async () => {
    const el = document.createElement('acp-cover-bar') as CoverBarLike;
    document.body.appendChild(el);

    el.hass = {
      states: {
        'sensor.cover_position': {
          state: '31',
          attributes: {
            actual_positions: { 'cover.living_room': 31 },
          },
        },
        'cover.living_room': {
          state: 'open',
          attributes: { friendly_name: 'Living Room' },
        },
      },
      callService: vi.fn(),
    } as unknown as HomeAssistant;

    el.discovered = {
      ...baseDiscovered,
      entities: { target_position_sensor: 'sensor.cover_position' },
    };

    await el.updateComplete;

    const cover = el.shadowRoot!.querySelector('.cover')!;
    const children = Array.from(cover.children);
    const numIdx = children.findIndex((c) => c.classList.contains('num'));
    const trackIdx = children.findIndex((c) => c.classList.contains('track'));
    expect(numIdx).toBeGreaterThanOrEqual(0);
    expect(trackIdx).toBeGreaterThanOrEqual(0);
    expect(numIdx).toBeLessThan(trackIdx);
  });
});

describe('acp-cover-bar two-tone fill — issue #135 follow-up', () => {
  it('both segments derive from the cover colour — blocking solid, clear pale', () => {
    const styles = sheetOf(CoverBar);
    // Both segments share the cover hue (override, else --primary-color); no
    // gold, so nothing competes with the gold sun on the compass. `.fill` is the
    // LEADING segment and now carries the sun-blocking portion, so it takes the
    // stronger mix and `.fill-closed` (the clear remainder) the fainter one.
    expect(styles).toMatch(/\.fill\s*{[^}]*--acp-cover-color,\s*var\(--primary-color\)\)\s*50%/);
    expect(styles).toMatch(
      /\.fill-closed\s*{[^}]*--acp-cover-color,\s*var\(--primary-color\)\)\s*18%/,
    );
    // The fills no longer borrow the FOV gold (.warn still uses --warning-color).
    expect(styles).not.toMatch(/\.fill[^}]*--warning-color/);
  });

  it('splits the track into blocking + clear widths summing to 100%', async () => {
    const el = document.createElement('acp-cover-bar') as CoverBarLike;
    document.body.appendChild(el);

    el.hass = {
      states: {
        'sensor.cover_position': {
          state: '69',
          attributes: {
            actual_positions: { 'cover.gauche': 69 },
          },
        },
        'cover.gauche': {
          state: 'open',
          attributes: { friendly_name: 'Gauche cover' },
        },
      },
      callService: vi.fn(),
    } as unknown as HomeAssistant;

    el.discovered = {
      ...baseDiscovered,
      entities: { target_position_sensor: 'sensor.cover_position' },
    };

    await el.updateComplete;

    const blocking = el.shadowRoot!.querySelector('.fill') as HTMLElement;
    const clear = el.shadowRoot!.querySelector('.fill-closed') as HTMLElement;
    // A blind at 69% OPEN is 31% covered, and the track draws coverage.
    expect(blocking.style.width).toBe('31%');
    expect(clear.style.width).toBe('69%');
  });

  it('closed segment falls back to --primary-color when no cover colour is set', () => {
    const styles = sheetOf(CoverBar);
    expect(styles).toMatch(/\.fill-closed\s*{[^}]*--acp-cover-color,\s*var\(--primary-color\)/);
  });

  it('applies the user-selected cover colour as the --acp-cover-color var', async () => {
    const el = document.createElement('acp-cover-bar') as CoverBarLike & {
      coverColor?: string | null;
    };
    document.body.appendChild(el);

    el.hass = {
      states: {
        'sensor.cover_position': {
          state: '69',
          attributes: { actual_positions: { 'cover.gauche': 69 } },
        },
        'cover.gauche': {
          state: 'open',
          attributes: { friendly_name: 'Gauche cover' },
        },
      },
      callService: vi.fn(),
    } as unknown as HomeAssistant;

    el.discovered = {
      ...baseDiscovered,
      entities: { target_position_sensor: 'sensor.cover_position' },
    };
    el.coverColor = '#ff7043';

    await el.updateComplete;

    const wrap = el.shadowRoot!.querySelector('.wrap') as HTMLElement;
    expect(wrap.style.getPropertyValue('--acp-cover-color')).toBe('#ff7043');
  });
});

describe('acp-cover-bar manual-override divergence — issue #158', () => {
  // Cover held at 44% while the solar would-be target is 60% with a manual
  // override active and a position mismatch flagged for the cover.
  function overrideHass(mismatch: boolean, override = true): HomeAssistant {
    return {
      states: {
        'sensor.cover_position': {
          state: '44',
          attributes: {
            actual_positions: { 'cover.a': 44 },
            raw_calculated_position: 60,
          },
        },
        'binary_sensor.manual_override': {
          state: override ? 'on' : 'off',
          attributes: {},
        },
        'binary_sensor.position_mismatch': {
          state: mismatch ? 'on' : 'off',
          attributes: { entities: { 'cover.a': { mismatch } } },
        },
        'cover.a': { state: 'open', attributes: { friendly_name: 'Cover A' } },
      },
      callService: vi.fn(),
    } as unknown as HomeAssistant;
  }

  const overrideDiscovered: DiscoveredEntities = {
    ...baseDiscovered,
    entities: {
      target_position_sensor: 'sensor.cover_position',
      manual_override_binary: 'binary_sensor.manual_override',
      position_mismatch_binary: 'binary_sensor.position_mismatch',
    },
  };

  async function mount(hass: HomeAssistant): Promise<CoverBarLike> {
    const el = document.createElement('acp-cover-bar') as CoverBarLike;
    document.body.appendChild(el);
    el.hass = hass;
    el.discovered = overrideDiscovered;
    await el.updateComplete;
    return el;
  }

  it('labels the COVERS target with the solar would-be value (60%), not the held 44%', async () => {
    const el = await mount(overrideHass(true));
    const target = el.shadowRoot!.querySelector('.head .target')!.textContent!;
    expect(target).toContain('60');
    expect(target).not.toContain('44');
  });

  it('draws the target marker at the solar target while fill/num stay at the held value', async () => {
    const el = await mount(overrideHass(true));
    const marker = el.shadowRoot!.querySelector('.marker') as HTMLElement;
    const open = el.shadowRoot!.querySelector('.fill') as HTMLElement;
    const num = el.shadowRoot!.querySelector('.num')!.textContent!;
    // Marker is clamped so its centred 2px box never clips at the rail ends.
    // Both the marker and the fill are drawn in the COVERAGE direction, so a 60%
    // solar target sits at 40% along the track and a held 44% draws 56%; the
    // readout stays in the integration's frame.
    // (happy-dom drops clamp() from style.left, so read the rendered attribute.)
    expect(marker.getAttribute('style')).toContain('left:clamp(1px, 40%, calc(100% - 1px))');
    expect(open.style.width).toBe('56%');
    expect(num).toContain('44');
  });

  it('relabels the COVERS header to "Solar target" during a diverging override', async () => {
    const el = await mount(overrideHass(true));
    const target = el.shadowRoot!.querySelector('.head .target')!.textContent!;
    // covers.target_solar = "Solar target: {pct}" — value stays the solar 60%.
    expect(target).toContain('Solar target');
    expect(target).toContain('60');
  });

  it('uses the override-specific marker tooltip during a diverging override', async () => {
    const el = await mount(overrideHass(true));
    const marker = el.shadowRoot!.querySelector('.marker') as HTMLElement;
    const tip = marker.getAttribute('data-tooltip') ?? '';
    // covers.target_tooltip_override mentions the would-be solar target + held.
    expect(tip).toContain('Would-be solar target');
    expect(tip).toContain('60');
    expect(tip).toContain('held by manual override');
  });

  it('suppresses the alert badge when the mismatch is an intentional override divergence', async () => {
    const el = await mount(overrideHass(true));
    expect(el.shadowRoot!.querySelector('.cover ha-icon.warn')).toBeNull();
  });

  it('keeps the alert badge for a genuine mismatch with no active override', async () => {
    const el = await mount(overrideHass(true, false));
    expect(el.shadowRoot!.querySelector('.cover ha-icon.warn')).not.toBeNull();
  });

  it('reserves fixed trailing columns so the track does not reflow', () => {
    const styles = sheetOf(CoverBar);
    // Two fixed columns after the track: the go-to-target button (22px) and the
    // warn badge (16px). Both empty out on some rows, and an `auto` track would
    // hand those pixels to the 3fr and reflow the bar graph (#158).
    expect(styles).toMatch(/grid-template-columns:[^;]*3fr\s+22px\s+16px/);
    expect(styles).not.toMatch(/grid-template-columns:[^;]*3fr\s+auto/);
  });

  it('keeps the plain "Target" header label and base tooltip without a divergence', async () => {
    // Override off → no divergence → the displayTarget is the held 44%, the
    // header reads the plain "Target:" label and the marker keeps the base
    // tooltip. Normal operation must be unchanged by the divergence relabel.
    const el = await mount(overrideHass(false, false));
    const target = el.shadowRoot!.querySelector('.head .target')!.textContent!;
    expect(target).toContain('Target');
    expect(target).not.toContain('Solar target');
    const marker = el.shadowRoot!.querySelector('.marker') as HTMLElement;
    const tip = marker.getAttribute('data-tooltip') ?? '';
    expect(tip).not.toContain('Would-be solar target');
  });
});

describe('acp-cover-bar linear position (motor tooltip) — issue #219', () => {
  function linearHass(opts: { linear?: number; state?: string }): HomeAssistant {
    return {
      states: {
        'sensor.cover_position': {
          state: opts.state ?? '31',
          attributes: {
            actual_positions: { 'cover.a': 31 },
            ...(opts.linear !== undefined ? { linear_position: opts.linear } : {}),
          },
        },
        'cover.a': { state: 'open', attributes: { friendly_name: 'Cover A' } },
      },
      callService: vi.fn(),
    } as unknown as HomeAssistant;
  }

  const linearDiscovered: DiscoveredEntities = {
    ...baseDiscovered,
    entities: { target_position_sensor: 'sensor.cover_position' },
  };

  async function mount(hass: HomeAssistant): Promise<CoverBarLike> {
    const el = document.createElement('acp-cover-bar') as CoverBarLike;
    document.body.appendChild(el);
    el.hass = hass;
    el.discovered = linearDiscovered;
    await el.updateComplete;
    return el;
  }

  it('shows the linear_position (10%) as the Target chip text, not the raw state (31%)', async () => {
    const el = await mount(linearHass({ state: '31', linear: 10 }));
    const target = el.shadowRoot!.querySelector('.head .target')!.textContent!;
    expect(target).toContain('10');
    expect(target).not.toContain('31');
  });

  it('attaches a motor tooltip to the Target chip when linear_position differs from state', async () => {
    const el = await mount(linearHass({ state: '31', linear: 10 }));
    const target = el.shadowRoot!.querySelector('.head .target') as HTMLElement;
    const tip = target.getAttribute('data-tooltip') ?? '';
    // Regression guard: formatPercent() already appends "%", so passing its
    // output through the `{pct}%` tooltip template double-percents the value
    // (e.g. "31%%"). The tooltip must render a single "%".
    expect(tip).not.toContain('%%');
    expect(tip).toContain('Motor: 31%');
  });

  it('attaches no motor tooltip when linear_position is absent', async () => {
    const el = await mount(linearHass({ state: '31' }));
    const target = el.shadowRoot!.querySelector('.head .target') as HTMLElement;
    expect(target.getAttribute('data-tooltip')).toBeNull();
  });

  it('attaches no motor tooltip when linear_position equals state (nothing to disclose)', async () => {
    const el = await mount(linearHass({ state: '31', linear: 31 }));
    const target = el.shadowRoot!.querySelector('.head .target') as HTMLElement;
    expect(target.getAttribute('data-tooltip')).toBeNull();
  });

  it('clears the stale motor tooltip attributes when a live update removes the divergence', async () => {
    // The Target chip is a persistent element: the tooltip directive attaches
    // and detaches on it across re-renders (motorDivergence null <-> non-null)
    // without the element itself ever being torn down. On detach, the
    // directive must strip the attributes it applied — otherwise a screen
    // reader keeps announcing a stale aria-describedby pointing at the shared
    // tooltip bubble, and data-tooltip lingers with no directive to update it.
    const el = await mount(linearHass({ state: '31', linear: 10 }));
    const target = el.shadowRoot!.querySelector('.head .target') as HTMLElement;
    expect(target.getAttribute('data-tooltip')).toContain('Motor: 31%');
    expect(target.hasAttribute('aria-describedby')).toBe(true);

    // Live hass update: linear_position now equals state, so the divergence
    // clears and the tooltip directive detaches from this same element.
    el.hass = linearHass({ state: '31', linear: 31 });
    await el.updateComplete;

    expect(target.hasAttribute('data-tooltip')).toBe(false);
    expect(target.hasAttribute('aria-describedby')).toBe(false);
    expect(target.hasAttribute('acp-tt-shown')).toBe(false);
  });
});

describe('acp-cover-bar target marker clamp at extremes — issue #158 (trailing)', () => {
  const baseDiscoveredLocal: DiscoveredEntities = {
    ...baseDiscovered,
    entities: { target_position_sensor: 'sensor.cover_position' },
  };

  // Held distinct from the solar target so displayTarget = the solar would-be
  // value, letting us drive the marker to the 0% / 100% extremes.
  async function mountAtTarget(solar: number, held: number): Promise<CoverBarLike> {
    const el = document.createElement('acp-cover-bar') as CoverBarLike;
    document.body.appendChild(el);
    el.hass = {
      states: {
        'sensor.cover_position': {
          state: String(held),
          attributes: {
            actual_positions: { 'cover.a': held },
            raw_calculated_position: solar,
          },
        },
        'binary_sensor.manual_override': { state: 'on', attributes: {} },
        'cover.a': { state: 'open', attributes: { friendly_name: 'Cover A' } },
      },
      callService: vi.fn(),
    } as unknown as HomeAssistant;
    el.discovered = {
      ...baseDiscoveredLocal,
      entities: {
        target_position_sensor: 'sensor.cover_position',
        manual_override_binary: 'binary_sensor.manual_override',
      },
    };
    await el.updateComplete;
    return el;
  }

  it('centres the marker on its value via translateX(-50%)', () => {
    const styles = sheetOf(CoverBar);
    expect(styles).toMatch(/\.marker\s*{[^}]*translateX\(-50%\)/);
  });

  it('clamps the marker inside the rail at the 100% extreme', async () => {
    // Target 0 (fully closed) draws at the 100% end of a coverage track.
    const el = await mountAtTarget(0, 30);
    const marker = el.shadowRoot!.querySelector('.marker') as HTMLElement;
    // left:100% would push the centred box off the right edge under
    // overflow:hidden; the clamp keeps it inside the rail.
    expect(marker.getAttribute('style')).toContain('left:clamp(1px, 100%, calc(100% - 1px))');
  });

  it('clamps the marker inside the rail at the 0% extreme', async () => {
    // Target 100 (fully open) draws at the 0% end of a coverage track.
    const el = await mountAtTarget(100, 70);
    const marker = el.shadowRoot!.querySelector('.marker') as HTMLElement;
    expect(marker.getAttribute('style')).toContain('left:clamp(1px, 0%, calc(100% - 1px))');
  });
});

describe('acp-cover-bar dual-axis tilt row', () => {
  function dualAxisHass(callService = vi.fn()): HomeAssistant {
    return {
      states: {
        'sensor.cover_position': {
          state: '60',
          attributes: { actual_positions: { 'cover.a': 60 } },
        },
        'sensor.cover_tilt': { state: '70', attributes: {} },
        'cover.a': {
          state: 'open',
          attributes: { friendly_name: 'Cover A', current_tilt_position: 35 },
        },
      },
      callService,
    } as unknown as HomeAssistant;
  }

  const dualDiscovered: DiscoveredEntities = {
    ...baseDiscovered,
    cover_type: 'cover_venetian',
    entities: {
      target_position_sensor: 'sensor.cover_position',
      target_tilt_sensor: 'sensor.cover_tilt',
    },
  };

  async function mount(hass: HomeAssistant, discovered: DiscoveredEntities): Promise<CoverBarLike> {
    const el = document.createElement('acp-cover-bar') as CoverBarLike;
    document.body.appendChild(el);
    el.hass = hass;
    el.discovered = discovered;
    await el.updateComplete;
    return el;
  }

  it('renders a tilt bar with the cover’s current_tilt_position and solar target', async () => {
    const el = await mount(dualAxisHass(), dualDiscovered);
    const tilt = el.shadowRoot!.querySelector('acp-tilt-bar') as HTMLElement & {
      actual: number | null;
      target: number | null;
    };
    expect(tilt).not.toBeNull();
    expect(tilt.actual).toBe(35);
    expect(tilt.target).toBe(70);
  });

  it('omits the tilt bar when the entry has no Cover_Tilt sensor', async () => {
    const el = await mount(dualAxisHass(), {
      ...baseDiscovered,
      entities: { target_position_sensor: 'sensor.cover_position' },
    });
    expect(el.shadowRoot!.querySelector('acp-tilt-bar')).toBeNull();
  });

  it('shows the tilt target alongside the position target in the header', async () => {
    const el = await mount(dualAxisHass(), dualDiscovered);
    const targets = el.shadowRoot!.querySelector('.head .targets')!.textContent!;
    expect(targets).toContain('60');
    expect(targets).toContain('Tilt');
    expect(targets).toContain('70');
  });

  it('calls adaptive_cover_pro.set_tilt when the tilt bar requests a value', async () => {
    const callService = vi.fn();
    const el = await mount(dualAxisHass(callService), dualDiscovered);
    const tilt = el.shadowRoot!.querySelector('acp-tilt-bar')!;
    tilt.dispatchEvent(new CustomEvent('acp-tilt-set', { detail: 80, bubbles: true }));
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_tilt',
      { tilt: 80 },
      { entity_id: 'cover.a' },
    );
  });
});

describe('acp-cover-bar discovery-driven multi-axis + set_axes', () => {
  const discovery = {
    cover_type: 'cover_venetian',
    cover_label: 'Venetian',
    axes: [
      {
        id: 'position',
        label: 'Position',
        min: 0,
        max: 100,
        unit: '%',
        state_attr: 'current_position',
        supported: true,
      },
      {
        id: 'tilt',
        label: 'Tilt',
        min: 0,
        max: 100,
        unit: '%',
        state_attr: 'current_tilt_position',
        supported: true,
      },
    ],
  };

  const discovered: DiscoveredEntities = {
    ...baseDiscovered,
    cover_type: 'cover_venetian',
    entities: {
      target_position_sensor: 'sensor.cover_position',
      target_tilt_sensor: 'sensor.cover_tilt',
    },
    discovery,
  };

  function modernHass(callService = vi.fn()): HomeAssistant {
    return {
      services: { adaptive_cover_pro: { set_axes: {}, set_position: {}, set_tilt: {} } },
      states: {
        'sensor.cover_position': {
          state: '60',
          attributes: { actual_positions: { 'cover.a': 60 } },
        },
        'sensor.cover_tilt': { state: '70', attributes: {} },
        'cover.a': {
          state: 'open',
          attributes: { friendly_name: 'Cover A', current_tilt_position: 35 },
        },
      },
      callService,
    } as unknown as HomeAssistant;
  }

  async function mount(hass: HomeAssistant): Promise<CoverBarLike> {
    const el = document.createElement('acp-cover-bar') as CoverBarLike;
    document.body.appendChild(el);
    el.hass = hass;
    el.discovered = discovered;
    await el.updateComplete;
    return el;
  }

  it('renders both a position bar and a secondary (tilt) axis bar from discovery', async () => {
    const el = await mount(modernHass());
    expect(el.shadowRoot!.querySelector('.cover')).not.toBeNull();
    const axisBar = el.shadowRoot!.querySelector('acp-tilt-bar') as HTMLElement & {
      actual: number | null;
      target: number | null;
    };
    expect(axisBar).not.toBeNull();
    expect(axisBar.actual).toBe(35);
    expect(axisBar.target).toBe(70);
  });

  it('fires set_axes for the tilt axis when the service is present', async () => {
    const callService = vi.fn();
    const el = await mount(modernHass(callService));
    el.shadowRoot!.querySelector('acp-tilt-bar')!.dispatchEvent(
      new CustomEvent('acp-tilt-set', { detail: 80, bubbles: true }),
    );
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      { axes: { tilt: 80 } },
      { entity_id: 'cover.a' },
    );
  });

  it('fires set_axes for a position track click when the service is present', async () => {
    const callService = vi.fn();
    const el = await mount(modernHass(callService));
    const track = el.shadowRoot!.querySelector('.track') as HTMLElement;
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100, top: 0, bottom: 10, right: 100, height: 10 }),
      configurable: true,
    });
    track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 50 }));
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      { axes: { position: 50 } },
      { entity_id: 'cover.a' },
    );
  });
});

describe('acp-cover-bar legacy fallback parity (no discovery, no set_axes)', () => {
  function legacyHass(callService = vi.fn()): HomeAssistant {
    return {
      states: {
        'sensor.cover_position': {
          state: '60',
          attributes: { actual_positions: { 'cover.a': 60 } },
        },
        'sensor.cover_tilt': { state: '70', attributes: {} },
        'cover.a': {
          state: 'open',
          attributes: { friendly_name: 'Cover A', current_tilt_position: 35 },
        },
      },
      callService,
    } as unknown as HomeAssistant;
  }

  const legacyDiscovered: DiscoveredEntities = {
    ...baseDiscovered,
    cover_type: 'cover_venetian',
    entities: {
      target_position_sensor: 'sensor.cover_position',
      target_tilt_sensor: 'sensor.cover_tilt',
    },
  };

  async function mount(hass: HomeAssistant): Promise<CoverBarLike> {
    const el = document.createElement('acp-cover-bar') as CoverBarLike;
    document.body.appendChild(el);
    el.hass = hass;
    el.discovered = legacyDiscovered;
    await el.updateComplete;
    return el;
  }

  it('routes a tilt drag to legacy set_tilt (NOT set_axes) when the service is absent', async () => {
    const callService = vi.fn();
    const el = await mount(legacyHass(callService));
    el.shadowRoot!.querySelector('acp-tilt-bar')!.dispatchEvent(
      new CustomEvent('acp-tilt-set', { detail: 80, bubbles: true }),
    );
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_tilt',
      { tilt: 80 },
      { entity_id: 'cover.a' },
    );
    expect(callService).not.toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      expect.anything(),
      expect.anything(),
    );
  });

  it('routes a position track click to legacy set_position (NOT set_axes)', async () => {
    const callService = vi.fn();
    const el = await mount(legacyHass(callService));
    const track = el.shadowRoot!.querySelector('.track') as HTMLElement;
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100, top: 0, bottom: 10, right: 100, height: 10 }),
      configurable: true,
    });
    track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 50 }));
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_position',
      { position: 50 },
      { entity_id: 'cover.a' },
    );
    expect(callService).not.toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      expect.anything(),
      expect.anything(),
    );
  });
});

describe('acp-cover-bar transit motion indicator', () => {
  function transitHass(transit?: Record<string, 'opening' | 'closing'>): HomeAssistant {
    return {
      states: {
        'sensor.cover_position': {
          state: '50',
          attributes: {
            actual_positions: { 'cover.x': 50 },
            ...(transit ? { transit_states: transit } : {}),
          },
        },
        'cover.x': { state: 'open', attributes: { friendly_name: 'Cover X' } },
      },
      callService: vi.fn(),
    } as unknown as HomeAssistant;
  }

  async function mount(hass: HomeAssistant): Promise<CoverBarLike> {
    const el = document.createElement('acp-cover-bar') as CoverBarLike;
    document.body.appendChild(el);
    el.hass = hass;
    el.discovered = {
      ...baseDiscovered,
      entities: { target_position_sensor: 'sensor.cover_position' },
    };
    await el.updateComplete;
    return el;
  }

  it('states the closing direction in the readout when the cover is mid-close', async () => {
    const el = await mount(transitHass({ 'cover.x': 'closing' }));
    // The readout now leads with the localized state, and a no-feedback cover's
    // transit direction is folded into it — so the separate arrow glyph would
    // say the same thing twice and is suppressed whenever state text renders.
    const num = el.shadowRoot!.querySelector('.num')!.textContent!;
    expect(num).toContain('Closing');
    expect(num).toContain('50');
    expect(el.shadowRoot!.querySelector('.num .transit-closing')).toBeNull();
  });

  it('states the opening direction in the readout when the cover is mid-open', async () => {
    const el = await mount(transitHass({ 'cover.x': 'opening' }));
    const num = el.shadowRoot!.querySelector('.num')!.textContent!;
    expect(num).toContain('Opening');
    expect(el.shadowRoot!.querySelector('.num .transit-opening')).toBeNull();
  });

  it('renders no transit indicator when transit_states is absent', async () => {
    const el = await mount(transitHass());
    expect(el.shadowRoot!.querySelector('.transit')).toBeNull();
  });

  it('renders no transit indicator for a cover not present in transit_states', async () => {
    const el = await mount(transitHass({ 'cover.other': 'closing' }));
    expect(el.shadowRoot!.querySelector('.transit')).toBeNull();
  });
});

describe('acp-cover-bar track-click → set_position', () => {
  it('calls adaptive_cover_pro.set_position when the track is clicked', async () => {
    const callService = vi.fn();
    const el = document.createElement('acp-cover-bar') as CoverBarLike;
    document.body.appendChild(el);

    el.hass = {
      states: {
        'sensor.cover_position': {
          state: '40',
          attributes: {
            actual_positions: { 'cover.left': 40 },
          },
        },
        'cover.left': {
          state: 'open',
          attributes: { friendly_name: 'Left' },
        },
      },
      callService,
    } as unknown as HomeAssistant;

    el.discovered = {
      ...baseDiscovered,
      entities: { target_position_sensor: 'sensor.cover_position' },
    };

    await el.updateComplete;

    const track = el.shadowRoot!.querySelector('.track') as HTMLElement;
    // Simulate a click at 50% of the track.
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100, top: 0, bottom: 10, right: 100, height: 10 }),
      configurable: true,
    });
    track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 50 }));

    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_position',
      { position: 50 },
      { entity_id: 'cover.left' },
    );
  });
});

describe('acp-cover-bar cover name opens more-info', () => {
  function mount(callService: (...args: unknown[]) => unknown): CoverBarLike {
    const el = document.createElement('acp-cover-bar') as CoverBarLike;
    el.hass = {
      states: {
        'sensor.cover_position': {
          state: '40',
          attributes: { actual_positions: { 'cover.living': 40 } },
        },
        'cover.living': { state: 'open', attributes: { friendly_name: 'Living Room' } },
      },
      callService,
    } as unknown as HomeAssistant;
    el.discovered = {
      ...baseDiscovered,
      entities: { target_position_sensor: 'sensor.cover_position' },
    };
    document.body.appendChild(el);
    return el;
  }

  it('dispatches acp-open-more-info when the cover name is clicked', async () => {
    const el = mount(vi.fn());
    await el.updateComplete;
    const name = el.shadowRoot!.querySelector('.cover .name') as HTMLElement;
    expect(name).toBeTruthy();
    const spy = vi.fn();
    el.addEventListener('acp-open-more-info', spy);
    name.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('dispatches acp-open-more-info on Enter/Space keydown on the cover name', async () => {
    const el = mount(vi.fn());
    await el.updateComplete;
    const name = el.shadowRoot!.querySelector('.cover .name') as HTMLElement;
    const spy = vi.fn();
    el.addEventListener('acp-open-more-info', spy);
    name.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    name.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('does not dispatch acp-open-more-info when the track is clicked (keeps set-position)', async () => {
    const callService = vi.fn();
    const el = mount(callService);
    await el.updateComplete;
    const track = el.shadowRoot!.querySelector('.cover .track') as HTMLElement;
    const spy = vi.fn();
    el.addEventListener('acp-open-more-info', spy);
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100, top: 0, bottom: 10, right: 100, height: 10 }),
      configurable: true,
    });
    track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 50 }));
    // Regression guard: the track still drives set-position and never opens the dialog.
    expect(spy).not.toHaveBeenCalled();
    expect(callService).toHaveBeenCalled();
  });
});

describe('acp-cover-bar position slider — issue #231', () => {
  function stubRect(track: HTMLElement): void {
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100, top: 0, bottom: 10, right: 100, height: 10 }),
      configurable: true,
    });
  }

  function singleCoverHass(actual: number, callService = vi.fn()): HomeAssistant {
    return {
      states: {
        'sensor.cover_position': {
          state: String(actual),
          attributes: { actual_positions: { 'cover.a': actual } },
        },
        'cover.a': { state: 'open', attributes: { friendly_name: 'Cover A' } },
      },
      callService,
    } as unknown as HomeAssistant;
  }

  const discovered: DiscoveredEntities = {
    ...baseDiscovered,
    entities: { target_position_sensor: 'sensor.cover_position' },
  };

  async function mount(hass: HomeAssistant): Promise<CoverBarLike> {
    const el = document.createElement('acp-cover-bar') as CoverBarLike;
    document.body.appendChild(el);
    el.hass = hass;
    el.discovered = discovered;
    await el.updateComplete;
    return el;
  }

  it('renders .track as an accessible slider with aria-valuenow matching the actual percent', async () => {
    const el = await mount(singleCoverHass(42));
    const track = el.shadowRoot!.querySelector('.track') as HTMLElement;
    expect(track.getAttribute('role')).toBe('slider');
    expect(track.getAttribute('tabindex')).toBe('0');
    expect(track.getAttribute('aria-valuemin')).toBe('0');
    expect(track.getAttribute('aria-valuemax')).toBe('100');
    // The track draws COVERAGE, and ARIA describes the visual, so valuenow is
    // the mirrored value; valuetext carries the open percentage it came from.
    expect(track.getAttribute('aria-valuenow')).toBe('58');
    expect(track.getAttribute('aria-valuetext')).toBe(
      t('covers.position_open_value', el.hass, { pct: formatPercent(42) }),
    );
    expect(track.getAttribute('aria-label')).toBe(t('covers.position_slider_label', el.hass));
  });

  it('previews a live percentage on .num/.fill while dragging, without committing', async () => {
    const callService = vi.fn();
    const el = await mount(singleCoverHass(20, callService));
    const track = el.shadowRoot!.querySelector('.track') as HTMLElement;
    stubRect(track);

    track.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, clientX: 20, pointerId: 1 }),
    );
    track.dispatchEvent(
      new PointerEvent('pointermove', { bubbles: true, clientX: 80, pointerId: 1 }),
    );
    await el.updateComplete;

    // 80% along the track is 80% COVERED, i.e. 20% open — the readout stays in
    // the integration's frame while the fill follows the finger.
    const num = el.shadowRoot!.querySelector('.num')!;
    expect(num.textContent).toContain('20');
    const fill = el.shadowRoot!.querySelector('.fill') as HTMLElement;
    expect(fill.style.width).toBe('80%');
    expect(callService).not.toHaveBeenCalled();
  });

  it('commits the final dragged value exactly once via the trailing click', async () => {
    const callService = vi.fn();
    const el = await mount(singleCoverHass(20, callService));
    const track = el.shadowRoot!.querySelector('.track') as HTMLElement;
    stubRect(track);

    track.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, clientX: 20, pointerId: 1 }),
    );
    track.dispatchEvent(
      new PointerEvent('pointermove', { bubbles: true, clientX: 80, pointerId: 1 }),
    );
    track.dispatchEvent(
      new PointerEvent('pointerup', { bubbles: true, clientX: 80, pointerId: 1 }),
    );
    // A real browser fires a trailing compatibility `click` at the release point.
    track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 80 }));
    await el.updateComplete;

    expect(callService).toHaveBeenCalledTimes(1);
    // Released 80% along the track = 80% covered = position 20. The write is
    // always in the integration's frame, never the drawn one.
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_position',
      { position: 20 },
      { entity_id: 'cover.a' },
    );
  });

  it('reverts the preview and does not commit on pointercancel', async () => {
    const callService = vi.fn();
    const el = await mount(singleCoverHass(20, callService));
    const track = el.shadowRoot!.querySelector('.track') as HTMLElement;
    stubRect(track);

    track.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, clientX: 20, pointerId: 1 }),
    );
    track.dispatchEvent(
      new PointerEvent('pointermove', { bubbles: true, clientX: 80, pointerId: 1 }),
    );
    track.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, pointerId: 1 }));
    await el.updateComplete;

    expect(callService).not.toHaveBeenCalled();
    const num = el.shadowRoot!.querySelector('.num')!;
    expect(num.textContent).toContain('20');
    // Back to server truth: 20% open draws as 80% covered.
    const fill = el.shadowRoot!.querySelector('.fill') as HTMLElement;
    expect(fill.style.width).toBe('80%');
  });

  // Keys step the DRAWN value, so the fill always moves the way the key points.
  // On a blind (mirrored) that means a rightward key raises coverage, which is a
  // LOWER position; Home/End name the ends of the track, not of the axis.
  it.each([
    ['ArrowRight', 49],
    ['ArrowUp', 49],
    ['ArrowLeft', 51],
    ['ArrowDown', 51],
    ['PageUp', 40],
    ['PageDown', 60],
    ['Home', 100],
    ['End', 0],
  ])('keydown %s from actual=50 calls set_position with %d', async (key, expected) => {
    const callService = vi.fn();
    const el = await mount(singleCoverHass(50, callService));
    const track = el.shadowRoot!.querySelector('.track') as HTMLElement;

    track.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_position',
      { position: expected },
      { entity_id: 'cover.a' },
    );
  });

  it('clamps PageUp at the fully-covered end near the top of the track', async () => {
    const callService = vi.fn();
    // 5% open = 95% covered; PageUp adds 10 points of coverage and clamps.
    const el = await mount(singleCoverHass(5, callService));
    const track = el.shadowRoot!.querySelector('.track') as HTMLElement;
    track.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }));
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_position',
      { position: 0 },
      { entity_id: 'cover.a' },
    );
  });

  it('clamps PageDown at the fully-clear end near the bottom of the track', async () => {
    const callService = vi.fn();
    // 95% open = 5% covered; PageDown removes 10 points of coverage and clamps.
    const el = await mount(singleCoverHass(95, callService));
    const track = el.shadowRoot!.querySelector('.track') as HTMLElement;
    track.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }));
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_position',
      { position: 100 },
      { entity_id: 'cover.a' },
    );
  });

  it('drags only the targeted cover row — the other cover renders unaffected', async () => {
    const callService = vi.fn();
    const el = await mount({
      states: {
        'sensor.cover_position': {
          state: '20',
          attributes: { actual_positions: { 'cover.a': 20, 'cover.b': 70 } },
        },
        'cover.a': { state: 'open', attributes: { friendly_name: 'Cover A' } },
        'cover.b': { state: 'open', attributes: { friendly_name: 'Cover B' } },
      },
      callService,
    } as unknown as HomeAssistant);

    const tracks = el.shadowRoot!.querySelectorAll('.track');
    const nums = el.shadowRoot!.querySelectorAll('.num');
    expect(tracks.length).toBe(2);
    const trackA = tracks[0] as HTMLElement;
    stubRect(trackA);

    trackA.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, clientX: 20, pointerId: 1 }),
    );
    trackA.dispatchEvent(
      new PointerEvent('pointermove', { bubbles: true, clientX: 90, pointerId: 1 }),
    );
    await el.updateComplete;

    // Dragged to 90% along the track = 90% covered = position 10.
    expect(nums[0].textContent).toContain('10');
    // Row B is untouched: still 70% open, drawn as 30% covered.
    expect(nums[1].textContent).toContain('70');
    const fillB = el.shadowRoot!.querySelectorAll('.fill')[1] as HTMLElement;
    expect(fillB.style.width).toBe('30%');
    expect(callService).not.toHaveBeenCalled();
  });

  it('adds touch-action: none to .track so a touch drag does not fight page scroll', () => {
    const styles = sheetOf(CoverBar);
    expect(styles).toMatch(/\.track\s*{[^}]*touch-action:\s*none/);
  });
});

// ── inverse_state frame normalization (#234) ─────────────────────────────────

describe('acp-cover-bar inverse_state frame normalization (#234)', () => {
  const AWNING = 'cover.patio_awning';

  function inverseDiscovered(legacy = false): DiscoveredEntities {
    return {
      ...baseDiscovered,
      cover_type: 'cover_awning',
      entities: { target_position_sensor: 'sensor.cover_position' },
      ...(legacy
        ? {}
        : { discovery: { axes: [{ id: 'position', inverted: true, supported: true }] } }),
    };
  }

  /** Fully-extended awning: logical 100, dispatched 0. */
  function inverseHass(opts: { linearActuals?: boolean } = {}): HomeAssistant {
    return {
      states: {
        'sensor.cover_position': {
          state: '0',
          attributes: {
            actual_positions: { [AWNING]: 0 },
            ...(opts.linearActuals === false ? {} : { linear_actual_positions: { [AWNING]: 100 } }),
            linear_position: 100,
            raw_calculated_position: 100,
          },
        },
        [AWNING]: { state: 'open', attributes: { friendly_name: 'Patio Awning' } },
      },
      callService: vi.fn(),
    } as unknown as HomeAssistant;
  }

  async function mount(hass: HomeAssistant, discovered: DiscoveredEntities): Promise<CoverBarLike> {
    const el = document.createElement('acp-cover-bar') as CoverBarLike;
    document.body.appendChild(el);
    el.hass = hass;
    el.discovered = discovered;
    await el.updateComplete;
    return el;
  }

  it('fills the per-cover track from the logical frame, matching the Target marker', async () => {
    const el = await mount(inverseHass(), inverseDiscovered());
    const open = el.shadowRoot!.querySelector('.fill') as HTMLElement;
    const closed = el.shadowRoot!.querySelector('.fill-closed') as HTMLElement;
    const marker = el.shadowRoot!.querySelector('.marker') as HTMLElement;
    // A fully-extended AWNING: logical 100, and extending an awning blocks more
    // sun, so the track draws it full — polarity is identity here. Fill and
    // marker still agree, which is what this test is about.
    expect(open.style.width).toBe('100%');
    expect(closed.style.width).toBe('0%');
    // The marker's left is a clamp() expression, so read the raw attribute
    // (happy-dom does not expose clamp() through style.left).
    expect(marker.getAttribute('style') ?? '').toContain('left:clamp(1px, 100%, calc(100% - 1px))');
    // The readout leads with the localized state and stays in the integration's
    // frame — the display polarity never reaches it.
    expect(el.shadowRoot!.querySelector('.num')!.textContent!.trim()).toBe('Open · 100%');
  });

  it('un-inverts actual_positions when linear_actual_positions is absent', async () => {
    const el = await mount(inverseHass({ linearActuals: false }), inverseDiscovered());
    expect((el.shadowRoot!.querySelector('.fill') as HTMLElement).style.width).toBe('100%');
  });

  it('suppresses the Motor tooltip when the divergence is the inversion itself', async () => {
    const el = await mount(inverseHass(), inverseDiscovered());
    const target = el.shadowRoot!.querySelector('.head .target') as HTMLElement;
    expect(target.getAttribute('data-tooltip')).toBeNull();
  });

  it('renders verbatim on a legacy entry with neither new field', async () => {
    const el = await mount(inverseHass({ linearActuals: false }), inverseDiscovered(true));
    expect((el.shadowRoot!.querySelector('.fill') as HTMLElement).style.width).toBe('0%');
  });
});

// ── inverse_tilt frame normalization (#236) ──────────────────────────────────

describe('acp-cover-bar inverse_tilt frame normalization (#236)', () => {
  interface AxisBarLike extends HTMLElement {
    updateComplete: Promise<boolean>;
    actual: number | null;
    target: number | null;
  }

  /** A venetian on an `inverse_tilt` install: the tilt axis alone is inverted,
   *  so slats at logical 35 report `current_tilt_position: 65` while the
   *  position axis stays in the logical frame at 60. */
  const inverseTiltDiscovered: DiscoveredEntities = {
    ...baseDiscovered,
    cover_type: 'cover_venetian',
    entities: {
      target_position_sensor: 'sensor.cover_position',
      target_tilt_sensor: 'sensor.cover_tilt',
    },
    discovery: {
      cover_type: 'cover_venetian',
      axes: [
        { id: 'position', state_attr: 'current_position', supported: true, inverted: false },
        { id: 'tilt', state_attr: 'current_tilt_position', supported: true, inverted: true },
      ],
    },
  };

  /** The `cover_tilt` / `cover_louvered_roof` shape: tilt is the ONLY declared
   *  axis, so `secondaryAxes` picks it up and the same read applies. */
  const tiltPrimaryDiscovered: DiscoveredEntities = {
    ...inverseTiltDiscovered,
    cover_type: 'cover_tilt',
    discovery: {
      cover_type: 'cover_tilt',
      axes: [{ id: 'tilt', state_attr: 'current_tilt_position', supported: true, inverted: true }],
    },
  };

  function inverseTiltHass(callService = vi.fn()): HomeAssistant {
    return {
      services: { adaptive_cover_pro: { set_axes: {}, set_position: {}, set_tilt: {} } },
      states: {
        'sensor.cover_position': {
          state: '60',
          attributes: { actual_positions: { 'cover.a': 60 } },
        },
        'sensor.cover_tilt': { state: '70', attributes: {} },
        'cover.a': {
          state: 'open',
          attributes: {
            friendly_name: 'Cover A',
            current_position: 60,
            current_tilt_position: 65,
          },
        },
      },
      callService,
    } as unknown as HomeAssistant;
  }

  async function mount(hass: HomeAssistant, discovered: DiscoveredEntities): Promise<CoverBarLike> {
    const el = document.createElement('acp-cover-bar') as CoverBarLike;
    document.body.appendChild(el);
    el.hass = hass;
    el.discovered = discovered;
    await el.updateComplete;
    return el;
  }

  const tiltBarOf = (el: CoverBarLike): AxisBarLike =>
    el.shadowRoot!.querySelector('acp-tilt-bar') as AxisBarLike;

  it('hands the tilt bar the logical value, not the cover-frame attribute', async () => {
    const el = await mount(inverseTiltHass(), inverseTiltDiscovered);
    const tilt = tiltBarOf(el);
    expect(tilt.actual).toBe(35);
    expect(tilt.target).toBe(70);
  });

  it('draws the tilt fill and readout in the logical frame', async () => {
    const el = await mount(inverseTiltHass(), inverseTiltDiscovered);
    const tilt = tiltBarOf(el);
    await tilt.updateComplete;
    const open = tilt.shadowRoot!.querySelector('.fill') as HTMLElement;
    const closed = tilt.shadowRoot!.querySelector('.fill-closed') as HTMLElement;
    // Logical tilt 35; slats block more sun as the value falls, so 35 draws 65.
    expect(open.style.width).toBe('65%');
    expect(closed.style.width).toBe('35%');
    expect(tilt.shadowRoot!.querySelector('.num')!.textContent).toContain('35');
  });

  it('normalizes each axis independently — the position bar is untouched', async () => {
    const el = await mount(inverseTiltHass(), inverseTiltDiscovered);
    // The cover-bar's own `.fill` is the position track; the tilt track lives
    // inside the nested acp-tilt-bar's shadow root.
    // Position is logical 60, drawn as 40% blocking — untouched by the tilt
    // axis's own inversion, which is the point of this test.
    expect((el.shadowRoot!.querySelector('.fill') as HTMLElement).style.width).toBe('40%');
    expect(el.shadowRoot!.querySelector('.head .targets')!.textContent).toContain('60');
  });

  it('writes the un-inverted logical value — the integration applies _to_wire', async () => {
    const callService = vi.fn();
    const el = await mount(inverseTiltHass(callService), inverseTiltDiscovered);
    tiltBarOf(el).dispatchEvent(new CustomEvent('acp-tilt-set', { detail: 80, bubbles: true }));
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      { axes: { tilt: 80 } },
      { entity_id: 'cover.a' },
    );
  });

  it('steps the keyboard from the logical base (ArrowUp on 35 commits 34, not 66)', async () => {
    const callService = vi.fn();
    const el = await mount(inverseTiltHass(callService), inverseTiltDiscovered);
    const tilt = tiltBarOf(el);
    await tilt.updateComplete;
    const track = tilt.shadowRoot!.querySelector('.track') as HTMLElement;
    track.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowUp' }));
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      // ArrowUp moves the fill up, which on a slat axis means MORE blocking and
      // so a lower value: 34. The thing this test guards is that it steps from
      // the logical 35 and not the cover-frame 65 (which would give 64/66).
      { axes: { tilt: 34 } },
      { entity_id: 'cover.a' },
    );
  });

  it('normalizes a tilt-primary cover whose only declared axis is tilt', async () => {
    const el = await mount(inverseTiltHass(), tiltPrimaryDiscovered);
    expect(tiltBarOf(el).actual).toBe(35);
  });
});
