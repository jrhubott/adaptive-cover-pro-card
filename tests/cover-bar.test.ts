import { describe, it, expect, vi } from 'vitest';
import '../src/components/cover-bar';
import { CoverBar } from '../src/components/cover-bar';
import { INTEGRATION_DOMAIN } from '../src/const';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';
import type { CSSResult } from 'lit';

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

describe('acp-cover-bar fill style — issue #135', () => {
  it('fill CSS uses color-mix for reduced opacity', () => {
    const styles = (CoverBar as unknown as { styles: CSSResult }).styles.cssText;
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
  it('both segments derive from the cover colour — open pale, closed solid', () => {
    const styles = (CoverBar as unknown as { styles: CSSResult }).styles.cssText;
    // Open portion (.fill) and closed portion (.fill-closed) share the cover hue
    // (override, else --primary-color); no gold, so nothing competes with the
    // gold sun on the compass. Open is the fainter mix, closed the stronger.
    expect(styles).toMatch(/\.fill\s*{[^}]*--acp-cover-color,\s*var\(--primary-color\)\)\s*18%/);
    expect(styles).toMatch(
      /\.fill-closed\s*{[^}]*--acp-cover-color,\s*var\(--primary-color\)\)\s*50%/,
    );
    // The fills no longer borrow the FOV gold (.warn still uses --warning-color).
    expect(styles).not.toMatch(/\.fill[^}]*--warning-color/);
  });

  it('splits the track into open + closed widths summing to 100%', async () => {
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

    const open = el.shadowRoot!.querySelector('.fill') as HTMLElement;
    const closed = el.shadowRoot!.querySelector('.fill-closed') as HTMLElement;
    expect(open.style.width).toBe('69%');
    expect(closed.style.width).toBe('31%');
  });

  it('closed segment falls back to --primary-color when no cover colour is set', () => {
    const styles = (CoverBar as unknown as { styles: CSSResult }).styles.cssText;
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
    // Marker is clamped so its centred 2px box never clips at the rail ends; the
    // 60% target sits inside the clamp window so the percent flows through.
    // (happy-dom drops clamp() from style.left, so read the rendered attribute.)
    expect(marker.getAttribute('style')).toContain('left:clamp(1px, 60%, calc(100% - 1px))');
    expect(open.style.width).toBe('44%');
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

  it('reserves a fixed badge column so the track does not reflow', () => {
    const styles = (CoverBar as unknown as { styles: CSSResult }).styles.cssText;
    expect(styles).toMatch(/grid-template-columns:[^;]*3fr\s+16px/);
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
    const styles = (CoverBar as unknown as { styles: CSSResult }).styles.cssText;
    expect(styles).toMatch(/\.marker\s*{[^}]*translateX\(-50%\)/);
  });

  it('clamps the marker inside the rail at the 100% extreme', async () => {
    const el = await mountAtTarget(100, 70);
    const marker = el.shadowRoot!.querySelector('.marker') as HTMLElement;
    // left:100% would push the centred box off the right edge under
    // overflow:hidden; the clamp keeps it inside the rail.
    expect(marker.getAttribute('style')).toContain('left:clamp(1px, 100%, calc(100% - 1px))');
  });

  it('clamps the marker inside the rail at the 0% extreme', async () => {
    const el = await mountAtTarget(0, 30);
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
