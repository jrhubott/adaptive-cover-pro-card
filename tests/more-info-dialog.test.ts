import { describe, it, expect, vi } from 'vitest';
import '../src/components/more-info-dialog';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';

interface DialogLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  discovered?: DiscoveredEntities;
  open?: boolean;
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

describe('acp-more-info-dialog: header content', () => {
  it('renders the discovered title in the header', async () => {
    const el = await mount({ hass: hass(), discovered: discovered(), open: true });
    expect(el.shadowRoot!.querySelector('.header .title')?.textContent?.trim()).toBe('Living room');
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

describe('acp-more-info-dialog: Resume Auto', () => {
  it('Resume button calls button.press on reset_override_button', async () => {
    const callService = vi.fn();
    const el = await mount({
      hass: hass({ callService }),
      discovered: discovered(),
      open: true,
    });
    (el.shadowRoot!.querySelector('button.resume') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith('button', 'press', { entity_id: 'button.reset' });
  });

  it('Resume button is hidden when no reset_override_button discovered', async () => {
    const d = discovered();
    delete d.entities.reset_override_button;
    const el = await mount({ hass: hass(), discovered: d, open: true });
    expect(el.shadowRoot!.querySelector('button.resume')).toBeNull();
  });
});
