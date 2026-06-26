import { describe, it, expect } from 'vitest';
import '../src/components/solar-calc';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';

interface PanelLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  discovered?: DiscoveredEntities;
}

const SENSOR = 'sensor.solar_calculation';

function discovered(withSensor = true): DiscoveredEntities {
  return {
    entry_id: 'entry_xyz',
    entry_title: 'Living room',
    cover_type: 'cover_blind',
    entities: withSensor ? { solar_calculation_sensor: SENSOR } : {},
    managed_covers: ['cover.left'],
  };
}

function hass(state: string, attributes: Record<string, unknown>): HomeAssistant {
  return {
    states: { [SENSOR]: { state, attributes } },
    language: 'en',
    locale: { language: 'en' },
  } as unknown as HomeAssistant;
}

async function mount(props: Partial<PanelLike>): Promise<PanelLike> {
  const el = document.createElement('acp-solar-calc') as PanelLike;
  Object.assign(el, props);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const BLIND_ATTRS = {
  cover_type: 'cover_blind',
  sol_elev_deg: 41.2,
  gamma_deg: 12.4,
  position_pct: 72,
  status: 'Direct Sun',
  effective_distance_m: 1.84,
  adjusted_height_m: 1.21,
  safety_margin: 0.95,
  cos_gamma: 0.977,
  path_length_m: 1.88,
};

describe('acp-solar-calc: degrade', () => {
  it('renders nothing when the sensor is not discovered', async () => {
    const el = await mount({ hass: hass('72', BLIND_ATTRS), discovered: discovered(false) });
    expect(el.shadowRoot!.querySelector('.wrap')).toBeNull();
  });

  it('renders nothing when the sensor is unavailable', async () => {
    const el = await mount({ hass: hass('unavailable', BLIND_ATTRS), discovered: discovered() });
    expect(el.shadowRoot!.querySelector('.wrap')).toBeNull();
  });
});

describe('acp-solar-calc: blind', () => {
  it('renders the status chip, inputs, intermediates, and output', async () => {
    const el = await mount({ hass: hass('72', BLIND_ATTRS), discovered: discovered() });
    const chip = el.shadowRoot!.querySelector('.status-chip');
    expect(chip?.classList.contains('direct')).toBe(true);
    expect(chip?.textContent?.trim()).toBe('Direct sun');
    // Output group present (has solar target).
    expect(el.shadowRoot!.querySelector('.no-target')).toBeNull();
    const rows = el.shadowRoot!.querySelectorAll('.row');
    expect(rows.length).toBeGreaterThan(0);
    // Curated default: cos_gamma hidden until "show all".
    expect(el.shadowRoot!.textContent).not.toContain('cos_gamma');
  });

  it('"show all" reveals raw extras and toggles back', async () => {
    const el = await mount({ hass: hass('72', BLIND_ATTRS), discovered: discovered() });
    const btn = el.shadowRoot!.querySelector('.show-all') as HTMLElement;
    expect(btn).toBeTruthy();
    btn.click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.key.raw')?.textContent).toContain('cos_gamma');
  });
});

describe('acp-solar-calc: no solar target', () => {
  it('shows the no-target fallback with the default status', async () => {
    const attrs = {
      cover_type: 'cover_blind',
      sol_elev_deg: 5,
      gamma_deg: 80,
      position_pct: null,
      status: 'Default: FOV Exit',
    };
    const el = await mount({ hass: hass('unknown', attrs), discovered: discovered() });
    const noTarget = el.shadowRoot!.querySelector('.no-target');
    expect(noTarget).toBeTruthy();
    const chip = el.shadowRoot!.querySelector('.status-chip');
    expect(chip?.classList.contains('default')).toBe(true);
  });
});

describe('acp-solar-calc: venetian dual axis', () => {
  it('renders both position and tilt axis groups', async () => {
    const attrs = {
      ...BLIND_ATTRS,
      cover_type: 'cover_venetian',
      tilt: {
        cover_type: 'cover_tilt',
        sol_elev_deg: 41.2,
        gamma_deg: 12.4,
        position_pct: 30,
        status: 'Direct Sun',
        slat_angle_raw_deg: 48.8,
        tilt_mode: 'mid',
        max_degrees: 90,
      },
    };
    const el = await mount({ hass: hass('72', attrs), discovered: discovered() });
    const titles = Array.from(el.shadowRoot!.querySelectorAll('.axis-title')).map((n) =>
      n.textContent?.trim(),
    );
    expect(titles).toEqual(['Position axis', 'Tilt axis']);
  });
});
