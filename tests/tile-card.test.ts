import { describe, it, expect, vi } from 'vitest';
import { AdaptiveCoverProTileCard } from '../src/adaptive-cover-pro-tile-card';
import { INTEGRATION_DOMAIN } from '../src/const';
import type { HomeAssistant } from 'custom-card-helpers';
import type { AdaptiveCoverProTileCardConfig } from '../src/types';
import type { EntityRegistryEntry } from '../src/lib/entity-registry';

const TYPE = 'custom:adaptive-cover-pro-tile-card';

interface CardLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  setConfig(config: AdaptiveCoverProTileCardConfig): void;
  // Internal — set directly in tests to bypass the websocket registry fetch.
  _registry?: EntityRegistryEntry[] | null;
}

function makeCard(): CardLike {
  return document.createElement('adaptive-cover-pro-tile-card') as CardLike;
}

const ENTRY = 'entry_xyz';

const REGISTRY: EntityRegistryEntry[] = [
  {
    entity_id: 'sensor.cover_position',
    unique_id: `${ENTRY}_Cover_Position`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'sensor.decision_trace',
    unique_id: `${ENTRY}_decision_trace`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'binary_sensor.manual_override',
    unique_id: `${ENTRY}_manual_override`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'sensor.manual_override_end_time',
    unique_id: `${ENTRY}_manual_override_end_time`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'button.reset_manual_override',
    unique_id: `${ENTRY}_Reset Manual Override`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'switch.integration_enabled',
    unique_id: `${ENTRY}_Integration Enabled`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'switch.automatic_control',
    unique_id: `${ENTRY}_Automatic Control`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
];

function makeHass(
  overrides: Partial<{
    decisionState: string;
    coverPositionSensorAttrs: Record<string, unknown>;
    manualOverrideOn: boolean;
    decisionAttrs: Record<string, unknown>;
    integrationEnabled: boolean;
    automaticControl: boolean;
    callService: (...args: unknown[]) => unknown;
    coverLeftCurrentPosition: number | undefined;
  }> = {},
): HomeAssistant {
  return {
    states: {
      'sensor.cover_position': {
        state: '42',
        attributes: {
          actual_positions: { 'cover.left': 40, 'cover.right': 45 },
          ...(overrides.coverPositionSensorAttrs ?? {}),
        },
      },
      'sensor.decision_trace': {
        state: overrides.decisionState ?? 'solar',
        attributes: { trace: [], ...(overrides.decisionAttrs ?? {}) },
      },
      'binary_sensor.manual_override': {
        state: overrides.manualOverrideOn ? 'on' : 'off',
        attributes: {},
      },
      'sensor.manual_override_end_time': {
        state: '2026-05-23T16:51:00Z',
        attributes: {},
      },
      'switch.integration_enabled': {
        state: overrides.integrationEnabled === false ? 'off' : 'on',
        attributes: {},
      },
      'switch.automatic_control': {
        state: overrides.automaticControl === false ? 'off' : 'on',
        attributes: {},
      },
      'cover.left': {
        state: 'open',
        attributes: {
          friendly_name: 'Left blind',
          ...(overrides.coverLeftCurrentPosition !== undefined
            ? { current_position: overrides.coverLeftCurrentPosition }
            : {}),
        },
      },
      'cover.right': { state: 'open', attributes: { friendly_name: 'Right blind' } },
    },
    callService: overrides.callService ?? vi.fn(),
    // Resolve to the same fixture the tests inject directly, so the async
    // background fetch can't race with the test and clobber the registry
    // with an empty array.
    callWS: vi.fn().mockResolvedValue(REGISTRY),
    // Mock connection.subscribeEvents so the tile-card's registry subscribe
    // dance does not crash on a missing websocket connection.
    connection: { subscribeEvents: vi.fn().mockResolvedValue(() => {}) },
  } as unknown as HomeAssistant;
}

async function mount(
  config: AdaptiveCoverProTileCardConfig,
  hass: HomeAssistant,
): Promise<CardLike> {
  const el = makeCard();
  el.setConfig(config);
  el.hass = hass;
  document.body.appendChild(el);
  el._registry = REGISTRY;
  await el.updateComplete;
  return el;
}

// Dual-axis fixtures: a venetian entry that also exposes the Cover_Tilt sensor.
const TILT_REGISTRY: EntityRegistryEntry[] = [
  ...REGISTRY,
  {
    entity_id: 'sensor.cover_tilt',
    unique_id: `${ENTRY}_Cover_Tilt`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
];

function tiltHass(callService?: (...args: unknown[]) => unknown): HomeAssistant {
  const h = makeHass({ callService });
  h.states['sensor.cover_tilt'] = { state: '70', attributes: {} } as never;
  (h.states['cover.left'].attributes as Record<string, unknown>).current_tilt_position = 35;
  (h as unknown as { callWS: unknown }).callWS = vi.fn().mockResolvedValue(TILT_REGISTRY);
  return h;
}

async function mountTilt(
  config: AdaptiveCoverProTileCardConfig,
  hass: HomeAssistant,
): Promise<CardLike> {
  const el = makeCard();
  el.setConfig(config);
  el.hass = hass;
  document.body.appendChild(el);
  el._registry = TILT_REGISTRY;
  await el.updateComplete;
  return el;
}

describe('adaptive-cover-pro-tile-card setConfig', () => {
  it('throws when entry_id is missing', () => {
    const el = makeCard();
    expect(() => el.setConfig({ type: TYPE } as AdaptiveCoverProTileCardConfig)).toThrow(
      /entry_id/,
    );
  });

  it('throws when entry_id is empty', () => {
    const el = makeCard();
    expect(() => el.setConfig({ type: TYPE, entry_id: '' })).toThrow(/entry_id/);
  });

  it('accepts a valid config', () => {
    const el = makeCard();
    expect(() => el.setConfig({ type: TYPE, entry_id: ENTRY })).not.toThrow();
  });
});

describe('adaptive-cover-pro-tile-card render', () => {
  it('renders state and position by default ("Open · 42%")', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass());
    const root = el.shadowRoot!;
    // cover.left has state 'open' in the fixture; no localizer is mocked so
    // formatCoverState falls back to capitalizing the raw state.
    expect(root.querySelector('.position')?.textContent?.trim()).toBe('Open · 42%');
  });

  it('renders the mini tilt bar for a dual-axis venetian cover', async () => {
    const el = await mountTilt({ type: TYPE, entry_id: ENTRY }, tiltHass());
    const tilt = el.shadowRoot!.querySelector('acp-tilt-bar') as HTMLElement & {
      actual: number | null;
      target: number | null;
    };
    expect(tilt).not.toBeNull();
    expect(tilt.actual).toBe(35);
    expect(tilt.target).toBe(70);
  });

  it('omits the tilt bar when show_tilt is false', async () => {
    const el = await mountTilt({ type: TYPE, entry_id: ENTRY, show_tilt: false }, tiltHass());
    expect(el.shadowRoot!.querySelector('acp-tilt-bar')).toBeNull();
  });

  it('calls adaptive_cover_pro.set_tilt when the tilt bar requests a value', async () => {
    const callService = vi.fn();
    const el = await mountTilt({ type: TYPE, entry_id: ENTRY }, tiltHass(callService));
    el.shadowRoot!.querySelector('acp-tilt-bar')!.dispatchEvent(
      new CustomEvent('acp-tilt-set', { detail: 80, bubbles: true }),
    );
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_tilt',
      { tilt: 80 },
      { entity_id: 'cover.left' },
    );
  });

  it('fires set_axes for the tilt bar when the set_axes service is present', async () => {
    const callService = vi.fn();
    const h = tiltHass(callService);
    (h as unknown as { services: unknown }).services = {
      adaptive_cover_pro: { set_axes: {}, set_position: {}, set_tilt: {} },
    };
    const el = await mountTilt({ type: TYPE, entry_id: ENTRY }, h);
    el.shadowRoot!.querySelector('acp-tilt-bar')!.dispatchEvent(
      new CustomEvent('acp-tilt-set', { detail: 80, bubbles: true }),
    );
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      { axes: { tilt: 80 } },
      { entity_id: 'cover.left' },
    );
  });

  it('fires set_axes for the ↑ button when the set_axes service is present', async () => {
    const callService = vi.fn();
    const h = makeHass({ callService });
    (h as unknown as { services: unknown }).services = {
      adaptive_cover_pro: { set_axes: {}, set_position: {} },
    };
    const el = await mount({ type: TYPE, entry_id: ENTRY }, h);
    (el.shadowRoot!.querySelector('button.up') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      { axes: { position: 100 } },
      { entity_id: 'cover.left' },
    );
  });

  it('routes the tilt bar to legacy set_tilt (NOT set_axes) when the service is absent', async () => {
    const callService = vi.fn();
    const el = await mountTilt({ type: TYPE, entry_id: ENTRY }, tiltHass(callService));
    el.shadowRoot!.querySelector('acp-tilt-bar')!.dispatchEvent(
      new CustomEvent('acp-tilt-set', { detail: 80, bubbles: true }),
    );
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_tilt',
      { tilt: 80 },
      { entity_id: 'cover.left' },
    );
    expect(callService).not.toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      expect.anything(),
      expect.anything(),
    );
  });

  it('renders only the percentage when show_state is false (legacy behavior)', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY, show_state: false }, makeHass());
    expect(el.shadowRoot!.querySelector('.position')?.textContent?.trim()).toBe('42%');
  });

  it('renders only the state when show_position is false', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY, show_position: false }, makeHass());
    expect(el.shadowRoot!.querySelector('.position')?.textContent?.trim()).toBe('Open');
  });

  it('hides the position cell entirely when both toggles are off', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, show_position: false, show_state: false },
      makeHass(),
    );
    expect(el.shadowRoot!.querySelector('.position')).toBeFalsy();
  });

  it('renders the winner badge by default and it is not resumable (solar tracking active)', async () => {
    // Solar wins with a matched solar trace row and cloud is not the winner →
    // the "solar active" badge shows.
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({
        decisionState: 'solar',
        decisionAttrs: {
          trace: [{ handler: 'solar', matched: true, reason: '', position: 60 }],
        },
      }),
    );
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge).toBeTruthy();
    expect(badge!.hasAttribute('resumable')).toBe(false);
  });

  it('shows the solar winner badge even when cloud suppression is not configured', async () => {
    // Regression: solar wins but enabled_handlers omits cloud (cloud suppression
    // off). The badge must still render — it no longer depends on cloud config.
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({
        decisionState: 'solar',
        decisionAttrs: {
          trace: [{ handler: 'solar', matched: true, reason: '', position: 60 }],
          enabled_handlers: ['solar', 'manual'],
        },
      }),
    );
    expect(el.shadowRoot!.querySelector('acp-tile-badge')).toBeTruthy();
  });

  it('renders the Cloudy winner badge when cloud suppression wins', async () => {
    // Cloud-suppression handler wins → the tile shows the "Cloudy" badge instead
    // of a blank badge area. Pinned to one-line so this exercises the single
    // winner badge (detailed now also renders a separate Auto indicator).
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'one-line' },
      makeHass({
        decisionState: 'cloud',
        decisionAttrs: {
          trace: [{ handler: 'cloud', matched: true, reason: '', position: 100 }],
        },
      }),
    );
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge).toBeTruthy();
    const text = badge!.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    expect(text).toBe('Cloudy');
  });

  it('hides the cloud winner badge when badges.cloud is false', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'one-line', badges: { cloud: false } },
      makeHass({
        decisionState: 'cloud',
        decisionAttrs: {
          trace: [{ handler: 'cloud', matched: true, reason: '', position: 100 }],
        },
      }),
    );
    expect(el.shadowRoot!.querySelector('acp-tile-badge')).toBeFalsy();
  });

  it('renders the Off-schedule badge when in_time_window is false (issue #128)', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'one-line' },
      makeHass({
        decisionState: 'solar',
        decisionAttrs: {
          trace: [{ handler: 'solar', matched: true, reason: '', position: 60 }],
          in_time_window: false,
        },
      }),
    );
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge).toBeTruthy();
    const text = badge!.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    expect(text).toBe('Off-schedule');
  });

  it('does NOT render the Off-schedule badge when in_time_window is true', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'one-line' },
      makeHass({
        decisionState: 'solar',
        decisionAttrs: {
          trace: [{ handler: 'solar', matched: true, reason: '', position: 60 }],
          in_time_window: true,
        },
      }),
    );
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    const text = badge!.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    expect(text).not.toBe('Off-schedule');
    expect(text).toBe('Solar tracking');
  });

  it('does NOT render the Off-schedule badge when in_time_window is absent (older integration)', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'one-line' },
      makeHass({
        decisionState: 'solar',
        decisionAttrs: {
          trace: [{ handler: 'solar', matched: true, reason: '', position: 60 }],
        },
      }),
    );
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    const text = badge!.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    expect(text).not.toBe('Off-schedule');
  });

  it('makes the badge resumable when manual_override_binary is on', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ manualOverrideOn: true, decisionState: 'manual' }),
    );
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge).toBeTruthy();
    expect(badge!.hasAttribute('resumable')).toBe(true);
  });

  it('keeps the badge non-resumable when winner is custom_position but no override is active', async () => {
    // Regression for issue #81: after resuming, manual_override clears but
    // winner stays custom_position_1. The badge must stop being resumable.
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ decisionState: 'custom_position_1', manualOverrideOn: false }),
    );
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge!.hasAttribute('resumable')).toBe(false);
  });

  it('makes the badge resumable when manual_override is on AND winner is custom_position', async () => {
    // Override active + custom_position winner simultaneously → the badge stays
    // tappable to resume.
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ decisionState: 'custom_position_1', manualOverrideOn: true }),
    );
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge!.hasAttribute('resumable')).toBe(true);
  });

  it('hides the badge entirely when automatic_control is off but integration is on', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass({ automaticControl: false }));
    expect(el.shadowRoot!.querySelector('acp-tile-badge')).toBeFalsy();
  });

  it('renders the Off badge when integration_enabled is off', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ integrationEnabled: false }),
    );
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge).toBeTruthy();
    const text = badge!.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    expect(text).toBe('Off');
  });

  it('renders the Off badge when both switches are off (integration_enabled wins over automatic_control)', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ integrationEnabled: false, automaticControl: false }),
    );
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge).toBeTruthy();
    const text = badge!.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    expect(text).toBe('Off');
  });

  it('displays the live cover current_position, not the calculated sensor value', async () => {
    // Symptom 3: sensor state = 100 (calculated target) but actual cover is at 16.
    // The label should show 16%, not 100%.
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({
        coverPositionSensorAttrs: { actual_positions: { 'cover.left': 16, 'cover.right': 45 } },
        coverLeftCurrentPosition: 16,
      }),
    );
    // Override the sensor state to 100 to make calculated vs live differ clearly.
    (el.hass!.states['sensor.cover_position'] as { state: string }).state = '100';
    el.hass = { ...el.hass! };
    await el.updateComplete;
    const text = el.shadowRoot!.querySelector('.position')?.textContent?.trim();
    expect(text).toBe('Open · 16%');
  });

  it('badge shows the configured floor value (60%), not the effective computed position (42%), when minimum_mode is true', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'one-line' },
      makeHass({
        decisionState: 'custom_position_1',
        decisionAttrs: {
          trace: [{ handler: 'custom_position_1', matched: true, reason: '', position: 100 }],
          custom_position_active_slot: 1,
          custom_position_active_slot_name: 'Table terrasse',
          custom_position_minimum_mode: true,
          custom_position_slots: [
            {
              slot: 1,
              enabled: true,
              sensor: 'input_number.table',
              sensor_name: 'Table terrasse',
              position: 60,
              priority: 1,
              min_mode: true,
            },
            {
              slot: 2,
              enabled: false,
              sensor: null,
              sensor_name: null,
              position: null,
              priority: null,
              min_mode: null,
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
          ],
        },
      }),
    );
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge).toBeTruthy();
    // Should show floor value 60%, NOT computed position 42%
    const text = badge!.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    expect(text).toBe('Table terrasse · 60% ↥');
  });

  it('badge shows custom-floor label, not timer, when manual_override is on and winner is custom_position', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({
        decisionState: 'custom_position_1',
        manualOverrideOn: true,
        decisionAttrs: {
          trace: [{ handler: 'custom_position_1', matched: true, reason: '', position: 100 }],
          custom_position_active_slot: 1,
          custom_position_active_slot_name: 'Table terrasse',
          custom_position_minimum_mode: true,
          custom_position_slots: [
            {
              slot: 1,
              enabled: true,
              sensor: 'input_number.table',
              sensor_name: 'Table terrasse',
              position: 60,
              priority: 1,
              min_mode: true,
            },
            {
              slot: 2,
              enabled: false,
              sensor: null,
              sensor_name: null,
              position: null,
              priority: null,
              min_mode: null,
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
          ],
        },
      }),
    );
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge).toBeTruthy();
    const text = badge!.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    expect(text).toBe('Table terrasse · 60% ↥');
  });

  it('shows Manual badge when manual_override is on even if pipeline winner is not manual', async () => {
    // Symptom 3b: winner = solar but manual_override binary = on → badge must say "Manual".
    // Use a registry without the end-time sensor so manualEndIso is undefined and the
    // badge renders "Manual" text rather than a clock time.
    const registryNoEndTime = REGISTRY.filter(
      (e) => e.entity_id !== 'sensor.manual_override_end_time',
    );
    const el = makeCard();
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    el.hass = makeHass({ manualOverrideOn: true, decisionState: 'solar' });
    document.body.appendChild(el);
    el._registry = registryNoEndTime;
    await el.updateComplete;
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge).toBeTruthy();
    const text = badge!.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    expect(text).toMatch(/manual/i);
  });
});

describe('adaptive-cover-pro-tile-card service calls', () => {
  it('↑ calls adaptive_cover_pro.set_position(100) against the first managed cover', async () => {
    const callService = vi.fn();
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass({ callService }));
    (el.shadowRoot!.querySelector('button.up') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_position',
      { position: 100 },
      { entity_id: 'cover.left' },
    );
  });

  it('■ calls adaptive_cover_pro.stop', async () => {
    const callService = vi.fn();
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass({ callService }));
    (el.shadowRoot!.querySelector('button.stop') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'stop',
      {},
      {
        entity_id: 'cover.left',
      },
    );
  });

  it('↓ calls adaptive_cover_pro.set_position(0) against the first managed cover', async () => {
    const callService = vi.fn();
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass({ callService }));
    (el.shadowRoot!.querySelector('button.down') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_position',
      { position: 0 },
      { entity_id: 'cover.left' },
    );
  });

  it('uses config.cover override when provided', async () => {
    const callService = vi.fn();
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, cover: 'cover.right' },
      makeHass({ callService }),
    );
    (el.shadowRoot!.querySelector('button.up') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_position',
      { position: 100 },
      { entity_id: 'cover.right' },
    );
  });

  it('badge acp-resume event calls button.press on reset_override_button', async () => {
    const callService = vi.fn();
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ manualOverrideOn: true, callService }),
    );
    el.shadowRoot!.querySelector('acp-tile-badge')!.dispatchEvent(
      new CustomEvent('acp-resume', { bubbles: true, composed: true }),
    );
    expect(callService).toHaveBeenCalledWith('button', 'press', {
      entity_id: 'button.reset_manual_override',
    });
  });
});

describe('adaptive-cover-pro-tile-card control disabling at travel limits', () => {
  const upBtn = (el: CardLike) => el.shadowRoot!.querySelector('button.up') as HTMLButtonElement;
  const stopBtn = (el: CardLike) =>
    el.shadowRoot!.querySelector('button.stop') as HTMLButtonElement;
  const downBtn = (el: CardLike) =>
    el.shadowRoot!.querySelector('button.down') as HTMLButtonElement;

  it('disables ↑ (open) but not ↓ (close) when the cover reports fully open (100)', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftCurrentPosition: 100 }),
    );
    expect(upBtn(el).disabled).toBe(true);
    expect(downBtn(el).disabled).toBe(false);
    expect(stopBtn(el).disabled).toBe(false);
  });

  it('disables ↓ (close) but not ↑ (open) when the cover reports fully closed (0)', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftCurrentPosition: 0 }),
    );
    expect(downBtn(el).disabled).toBe(true);
    expect(upBtn(el).disabled).toBe(false);
    expect(stopBtn(el).disabled).toBe(false);
  });

  it('leaves both ↑ and ↓ enabled at a mid position (40)', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftCurrentPosition: 40 }),
    );
    expect(upBtn(el).disabled).toBe(false);
    expect(downBtn(el).disabled).toBe(false);
    expect(stopBtn(el).disabled).toBe(false);
  });

  it('leaves both enabled when the cover does not report a position', async () => {
    // No current_position attribute → cannot prove the cover is at a limit, so
    // neither button is disabled.
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass());
    expect(upBtn(el).disabled).toBe(false);
    expect(downBtn(el).disabled).toBe(false);
    expect(stopBtn(el).disabled).toBe(false);
  });
});

describe('adaptive-cover-pro-tile-card tap action', () => {
  it('fires acp-tile-tap event on tile body click when tap_action is default (dialog)', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass());
    const listener = vi.fn();
    el.addEventListener('acp-tile-tap', listener);
    (el.shadowRoot!.querySelector('.tile-body') as HTMLElement).click();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('does not fire acp-tile-tap when tap_action is none (legacy string normalized)', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY, tap_action: 'none' }, makeHass());
    const listener = vi.fn();
    el.addEventListener('acp-tile-tap', listener);
    (el.shadowRoot!.querySelector('.tile-body') as HTMLElement).click();
    expect(listener).not.toHaveBeenCalled();
  });

  it('does not fire acp-tile-tap when tap_action is {action: none}', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, tap_action: { action: 'none' } },
      makeHass(),
    );
    const listener = vi.fn();
    el.addEventListener('acp-tile-tap', listener);
    (el.shadowRoot!.querySelector('.tile-body') as HTMLElement).click();
    expect(listener).not.toHaveBeenCalled();
  });

  it('treats legacy tap_action "dialog" as the default (still opens ACP dialog)', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY, tap_action: 'dialog' }, makeHass());
    const listener = vi.fn();
    el.addEventListener('acp-tile-tap', listener);
    (el.shadowRoot!.querySelector('.tile-body') as HTMLElement).click();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('does not fire acp-tile-tap when ↑■↓ buttons are clicked (stopPropagation)', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass());
    const listener = vi.fn();
    el.addEventListener('acp-tile-tap', listener);
    (el.shadowRoot!.querySelector('button.up') as HTMLElement).click();
    (el.shadowRoot!.querySelector('button.stop') as HTMLElement).click();
    (el.shadowRoot!.querySelector('button.down') as HTMLElement).click();
    expect(listener).not.toHaveBeenCalled();
  });

  it('threads show_elevation_chart=false into the dialog as showElevationChart=false', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, show_elevation_chart: false },
      makeHass(),
    );
    const dialog = el.shadowRoot!.querySelector('acp-more-info-dialog') as HTMLElement & {
      showElevationChart?: boolean;
    };
    expect(dialog).toBeTruthy();
    expect(dialog.showElevationChart).toBe(false);
  });

  it('defaults showElevationChart to true on the dialog when the key is omitted', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass());
    const dialog = el.shadowRoot!.querySelector('acp-more-info-dialog') as HTMLElement & {
      showElevationChart?: boolean;
    };
    expect(dialog.showElevationChart).toBe(true);
  });

  it('opens the more-info dialog on tile body click and closes via dialog close event', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass());
    const dialog = el.shadowRoot!.querySelector('acp-more-info-dialog') as HTMLElement & {
      open?: boolean;
      updateComplete: Promise<boolean>;
    };
    expect(dialog).toBeTruthy();
    expect(dialog.open).toBe(false);

    (el.shadowRoot!.querySelector('.tile-body') as HTMLElement).click();
    await el.updateComplete;
    await dialog.updateComplete;
    expect(dialog.open).toBe(true);

    // Simulate the dialog firing its close event (e.g. user clicked ✕).
    dialog.dispatchEvent(new CustomEvent('acp-dialog-close', { bubbles: true, composed: true }));
    await el.updateComplete;
    await dialog.updateComplete;
    expect(dialog.open).toBe(false);
  });
});

describe('adaptive-cover-pro-tile-card new options', () => {
  it('show_controls: false hides the ↑■▼ row', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY, show_controls: false }, makeHass());
    expect(el.shadowRoot!.querySelector('.controls')).toBeFalsy();
  });

  it('show_badge: false hides the contextual badge', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY, show_badge: false }, makeHass());
    expect(el.shadowRoot!.querySelector('acp-tile-badge')).toBeFalsy();
  });

  it('renders the Cloudy badge when the un-normalized cloud_suppression handler wins', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'one-line' },
      makeHass({
        decisionState: 'cloud_suppression',
        decisionAttrs: {
          trace: [{ handler: 'cloud_suppression', matched: true, reason: '', position: 0 }],
          enabled_handlers: ['cloud', 'solar'],
        },
      }),
    );
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge).toBeTruthy();
    const text = badge!.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    expect(text).toBe('Cloudy');
  });

  // The "Motion idle" winner badge is suppressed two ways — its own flag being
  // off, or the (default-on) motion indicator icon making it redundant — and in
  // both cases falls back to the Auto badge unless Auto is itself disabled.
  const motionWinnerHass = () =>
    makeHass({
      decisionState: 'motion_timeout',
      decisionAttrs: {
        trace: [{ handler: 'motion_timeout', matched: true, reason: '', position: 100 }],
      },
    });

  it('shows the Motion idle badge when the icon is off and its flag is on', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'one-line', show_motion_icon: false },
      motionWinnerHass(),
    );
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge).toBeTruthy();
    const text = badge!.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    expect(text).toBe('Motion idle');
  });

  it('falls back to Auto when motion wins but badges.motion is off', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, show_motion_icon: false, badges: { motion: false } },
      motionWinnerHass(),
    );
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge).toBeTruthy();
    const text = badge!.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    expect(text).toBe('Auto');
  });

  it('falls back to Auto when motion wins and the motion indicator icon is enabled (default)', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, motionWinnerHass());
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge).toBeTruthy();
    const text = badge!.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    expect(text).toBe('Auto');
  });

  it('blanks the badge when motion is suppressed and Auto is also off', async () => {
    const el = await mount(
      {
        type: TYPE,
        entry_id: ENTRY,
        show_motion_icon: false,
        badges: { motion: false, auto: false },
      },
      motionWinnerHass(),
    );
    expect(el.shadowRoot!.querySelector('acp-tile-badge')).toBeFalsy();
  });

  it('icon overrides the cover_type default', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY, icon: 'mdi:test-icon' }, makeHass());
    const icon = el.shadowRoot!.querySelector('ha-icon.cover-icon') as HTMLElement & {
      icon?: string;
    };
    expect(icon.getAttribute('icon')).toBe('mdi:test-icon');
  });

  it('show_decision_summary renders the summary line under the title', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, show_decision_summary: true },
      makeHass({
        decisionState: 'solar',
        decisionAttrs: {
          trace: [{ handler: 'solar', matched: true, reason: '', position: 60 }],
          reason: 'Solar tracking',
        },
      }),
    );
    const summary = el.shadowRoot!.querySelector('.summary');
    expect(summary).toBeTruthy();
    expect(summary!.textContent?.length ?? 0).toBeGreaterThan(0);
  });

  it('omits the summary line when show_decision_summary is unset', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass());
    expect(el.shadowRoot!.querySelector('.summary')).toBeFalsy();
  });

  it('one-line layout keeps the summary nested inside .label', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, show_decision_summary: true, layout: 'one-line' },
      makeHass({
        decisionState: 'solar',
        decisionAttrs: {
          trace: [{ handler: 'solar', matched: true, reason: '', position: 60 }],
          reason: 'Solar tracking',
        },
      }),
    );
    const summary = el.shadowRoot!.querySelector('.summary');
    expect(summary).toBeTruthy();
    expect(summary!.parentElement?.classList.contains('label')).toBe(true);
    expect(el.shadowRoot!.querySelector('.tile-body.has-summary')).toBeFalsy();
  });

  it('detailed layout shows the summary inline with the title, right-justified', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, show_decision_summary: true, layout: 'detailed' },
      makeHass({
        decisionState: 'solar',
        decisionAttrs: {
          trace: [{ handler: 'solar', matched: true, reason: '', position: 60 }],
          reason: 'Solar tracking',
        },
      }),
    );
    const summary = el.shadowRoot!.querySelector('.summary');
    expect(summary).toBeTruthy();
    expect(summary!.classList.contains('inline-summary')).toBe(true);
    expect(summary!.parentElement?.classList.contains('label')).toBe(true);
    expect(el.shadowRoot!.querySelector('.tile-body.detailed.has-summary')).toBeTruthy();
  });

  it('detailed layout renders the badge inline on the state line', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed' },
      makeHass({
        decisionState: 'solar',
        decisionAttrs: {
          trace: [{ handler: 'solar', matched: true, reason: '', position: 60 }],
          reason: 'Solar tracking',
        },
      }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed');
    expect(body).toBeTruthy();
    // Badge no longer claims its own row; with no resume button there is no
    // third row, and the badge sits inline within .detail-line.
    expect(el.shadowRoot!.querySelector('.tile-body.detailed.has-row3')).toBeNull();
    const badge = el.shadowRoot!.querySelector('.detail-line acp-tile-badge');
    expect(badge).toBeTruthy();
  });

  it('detailed layout renders no tile badge when show_badge is false', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed', show_badge: false },
      makeHass(),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed');
    expect(body).toBeTruthy();
    // Scope to the tile body — the more-info dialog has its own badges, and
    // happy-dom's querySelector pierces shadow roots.
    expect(body!.querySelector('acp-tile-badge')).toBeFalsy();
  });
});

describe('adaptive-cover-pro-tile-card Auto indicator (issue #110)', () => {
  it('detailed: cloud wins under automatic control → BOTH the Cloudy winner badge and a separate Auto badge', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed' },
      makeHass({
        decisionState: 'cloud',
        decisionAttrs: {
          trace: [{ handler: 'cloud', matched: true, reason: '', position: 100 }],
        },
      }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    // Two distinct badges render: the Cloudy winner inline on .detail-line and
    // the Auto indicator on its own .auto-line above it.
    const badges = body.querySelectorAll('acp-tile-badge');
    expect(badges.length).toBe(2);

    const detailLineBadge = body.querySelector('.detail-line acp-tile-badge');
    expect(detailLineBadge).toBeTruthy();
    expect(detailLineBadge!.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim()).toBe('Cloudy');

    const autoLine = body.querySelector('.auto-line');
    expect(autoLine).toBeTruthy();
    const autoBadge = autoLine!.querySelector('acp-tile-badge');
    expect(autoBadge).toBeTruthy();
    expect(autoBadge!.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim()).toBe('Auto');
  });

  it('detailed: .auto-line appears in DOM order BEFORE .detail-line within .tile-body.detailed', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed' },
      makeHass({
        decisionState: 'cloud',
        decisionAttrs: {
          trace: [{ handler: 'cloud', matched: true, reason: '', position: 100 }],
        },
      }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    const rows = Array.from(body.children);
    const autoIdx = rows.findIndex((n) => (n as Element).classList.contains('auto-line'));
    const detailIdx = rows.findIndex((n) => (n as Element).classList.contains('detail-line'));
    expect(autoIdx).toBeGreaterThanOrEqual(0);
    expect(detailIdx).toBeGreaterThanOrEqual(0);
    expect(autoIdx).toBeLessThan(detailIdx);
  });

  it('detailed: default winner (auto) renders the Auto line only — no duplicate inline Auto badge', async () => {
    // Dedupe: when the winner badge kind is itself `auto`, the inline winner
    // badge is suppressed so Auto never shows twice.
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed' },
      makeHass({
        decisionState: 'default',
        decisionAttrs: {
          trace: [{ handler: 'default', matched: true, reason: '', position: 60 }],
        },
      }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    const badges = body.querySelectorAll('acp-tile-badge');
    expect(badges.length).toBe(1);
    // The single badge lives on .auto-line, not inline on .detail-line.
    expect(body.querySelector('.auto-line acp-tile-badge')).toBeTruthy();
    expect(body.querySelector('.detail-line acp-tile-badge')).toBeFalsy();
  });

  it('detailed: manual override active → no Auto badge', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed' },
      makeHass({ manualOverrideOn: true, decisionState: 'manual' }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    expect(body.querySelector('.auto-line')).toBeFalsy();
  });

  it('detailed: force winner → no Auto badge', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed' },
      makeHass({
        decisionState: 'force',
        decisionAttrs: {
          trace: [{ handler: 'force', matched: true, reason: '', position: 0 }],
        },
      }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    expect(body.querySelector('.auto-line')).toBeFalsy();
  });

  it('detailed: custom_position with bypass_auto_control true → no Auto badge', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed' },
      makeHass({
        decisionState: 'custom_position_1',
        decisionAttrs: {
          trace: [{ handler: 'custom_position_1', matched: true, reason: '', position: 50 }],
          bypass_auto_control: true,
        },
      }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    expect(body.querySelector('.auto-line')).toBeFalsy();
  });

  it('detailed: custom_position with bypass_auto_control false → Auto badge present', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed' },
      makeHass({
        decisionState: 'custom_position_1',
        decisionAttrs: {
          trace: [{ handler: 'custom_position_1', matched: true, reason: '', position: 50 }],
          bypass_auto_control: false,
        },
      }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    expect(body.querySelector('.auto-line acp-tile-badge')).toBeTruthy();
  });

  it('detailed: badges.auto false hides the Auto badge but keeps the winner badge', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed', badges: { auto: false } },
      makeHass({
        decisionState: 'cloud',
        decisionAttrs: {
          trace: [{ handler: 'cloud', matched: true, reason: '', position: 100 }],
        },
      }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    expect(body.querySelector('.auto-line')).toBeFalsy();
    expect(body.querySelector('.detail-line acp-tile-badge')).toBeTruthy();
  });

  it('one-line: Auto-active cloud winner → no .auto-line, exactly one badge', async () => {
    // Auto is detailed-only; one-line is the compact opt-out with no vertical room.
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'one-line' },
      makeHass({
        decisionState: 'cloud',
        decisionAttrs: {
          trace: [{ handler: 'cloud', matched: true, reason: '', position: 100 }],
        },
      }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body')!;
    expect(body.querySelector('.auto-line')).toBeFalsy();
    expect(body.querySelectorAll('acp-tile-badge').length).toBe(1);
  });
});

describe('adaptive-cover-pro-tile-card motion indicator', () => {
  const MOTION_REGISTRY: EntityRegistryEntry[] = [
    ...REGISTRY,
    {
      entity_id: 'sensor.motion_status',
      unique_id: `${ENTRY}_motion_status`,
      config_entry_id: ENTRY,
      platform: 'adaptive_cover_pro',
      device_id: null,
    },
  ];

  function makeMotionHass(motionState: string): HomeAssistant {
    const hass = makeHass();
    (hass.states as Record<string, unknown>)['sensor.motion_status'] = {
      state: motionState,
      attributes: {},
    };
    return hass;
  }

  async function mountWithMotion(
    config: AdaptiveCoverProTileCardConfig,
    motionState: string,
  ): Promise<CardLike> {
    const el = makeCard();
    el.setConfig(config);
    el.hass = makeMotionHass(motionState);
    document.body.appendChild(el);
    el._registry = MOTION_REGISTRY;
    await el.updateComplete;
    return el;
  }

  it('renders the overlay when motion_status is motion_detected', async () => {
    const el = await mountWithMotion({ type: TYPE, entry_id: ENTRY }, 'motion_detected');
    const overlay = el.shadowRoot!.querySelector('.motion-overlay');
    expect(overlay).toBeTruthy();
    expect(overlay!.getAttribute('data-tooltip')).toBe('Motion detected');
  });

  it('renders the overlay when motion_status is timeout_pending', async () => {
    const el = await mountWithMotion({ type: TYPE, entry_id: ENTRY }, 'timeout_pending');
    const overlay = el.shadowRoot!.querySelector('.motion-overlay');
    expect(overlay).toBeTruthy();
    expect(overlay!.getAttribute('data-tooltip')).toBe('Motion timeout pending');
  });

  it('hides the overlay when motion_status is no_motion', async () => {
    const el = await mountWithMotion({ type: TYPE, entry_id: ENTRY }, 'no_motion');
    expect(el.shadowRoot!.querySelector('.motion-overlay')).toBeFalsy();
  });

  it('hides the overlay when show_motion_icon is false even during motion', async () => {
    const el = await mountWithMotion(
      { type: TYPE, entry_id: ENTRY, show_motion_icon: false },
      'motion_detected',
    );
    expect(el.shadowRoot!.querySelector('.motion-overlay')).toBeFalsy();
  });

  it('hides the overlay when show_motion_icon is false during timeout_pending', async () => {
    const el = await mountWithMotion(
      { type: TYPE, entry_id: ENTRY, show_motion_icon: false },
      'timeout_pending',
    );
    expect(el.shadowRoot!.querySelector('.motion-overlay')).toBeFalsy();
  });

  it('hides the overlay when the motion_status sensor is not discovered', async () => {
    // Reuse the default REGISTRY (no motion sensor) — overlay must not render.
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass());
    expect(el.shadowRoot!.querySelector('.motion-overlay')).toBeFalsy();
  });

  it('still renders the cover icon when the motion overlay is shown', async () => {
    const el = await mountWithMotion({ type: TYPE, entry_id: ENTRY }, 'motion_detected');
    expect(el.shadowRoot!.querySelector('ha-icon.cover-icon')).toBeTruthy();
  });
});

describe('adaptive-cover-pro-tile-card hold / double-tap actions', () => {
  it('hold_action fires via handleAction when pointer is held', async () => {
    vi.useFakeTimers();
    try {
      const callService = vi.fn();
      const el = await mount(
        {
          type: TYPE,
          entry_id: ENTRY,
          hold_action: {
            action: 'call-service',
            service: 'cover.open_cover',
            service_data: { entity_id: 'cover.left' },
          },
        },
        makeHass({ callService }),
      );
      const body = el.shadowRoot!.querySelector('.tile-body') as HTMLElement;
      body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      vi.advanceTimersByTime(600);
      expect(callService).toHaveBeenCalledWith(
        'cover',
        'open_cover',
        { entity_id: 'cover.left' },
        undefined,
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not fire hold_action when none is configured', async () => {
    vi.useFakeTimers();
    try {
      const callService = vi.fn();
      const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass({ callService }));
      const body = el.shadowRoot!.querySelector('.tile-body') as HTMLElement;
      body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      vi.advanceTimersByTime(600);
      // No hold action, no service call — only ↑■▼ clicks would trigger one.
      expect(callService).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  it('double_tap_action fires on a quick double-click', async () => {
    const callService = vi.fn();
    const el = await mount(
      {
        type: TYPE,
        entry_id: ENTRY,
        double_tap_action: {
          action: 'call-service',
          service: 'cover.close_cover',
          service_data: { entity_id: 'cover.left' },
        },
      },
      makeHass({ callService }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body') as HTMLElement;
    body.click();
    body.click();
    expect(callService).toHaveBeenCalledWith(
      'cover',
      'close_cover',
      { entity_id: 'cover.left' },
      undefined,
    );
  });

  it('single click still opens the ACP dialog when double_tap_action is configured (after timeout)', async () => {
    vi.useFakeTimers();
    try {
      const el = await mount(
        {
          type: TYPE,
          entry_id: ENTRY,
          double_tap_action: { action: 'call-service', service: 'cover.close_cover' },
        },
        makeHass(),
      );
      const listener = vi.fn();
      el.addEventListener('acp-tile-tap', listener);
      const body = el.shadowRoot!.querySelector('.tile-body') as HTMLElement;
      body.click();
      vi.advanceTimersByTime(300);
      expect(listener).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('adaptive-cover-pro-tile-card floor chip', () => {
  // A fixture with one armed min-mode slot (sensor = on, position = 25).
  function makeFloorHass(
    opts: {
      winner?: string;
      sensorOn?: boolean;
      targetPosition?: number;
      integrationEnabled?: boolean;
      customPositionMinimumMode?: boolean;
      priority?: number | null;
    } = {},
  ): HomeAssistant {
    const {
      winner = 'solar',
      sensorOn = true,
      targetPosition = 42,
      integrationEnabled = true,
      customPositionMinimumMode = false,
      priority = 1,
    } = opts;
    const hass = makeHass({
      decisionState: winner,
      integrationEnabled,
      decisionAttrs: {
        trace: [{ handler: winner, matched: true, reason: '', position: targetPosition }],
        custom_position_minimum_mode: customPositionMinimumMode,
        custom_position_slots: [
          {
            slot: 1,
            enabled: true,
            sensor: 'input_boolean.floor_sensor',
            sensor_name: 'Aeration',
            position: 25,
            priority,
            min_mode: true,
          },
          {
            slot: 2,
            enabled: false,
            sensor: null,
            sensor_name: null,
            position: null,
            priority: null,
            min_mode: null,
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
        ],
      },
    });
    // Set the cover-position sensor state to targetPosition so
    // _currentPosition() (which reads .state) feeds the correct calculatedPosition
    // into resolveActiveMinModeFloor.
    (hass.states['sensor.cover_position'] as { state: string }).state = String(targetPosition);
    // Add the floor sensor to hass.states
    (hass.states as Record<string, unknown>)['input_boolean.floor_sensor'] = {
      state: sensorOn ? 'on' : 'off',
      attributes: {},
    };
    return hass;
  }

  it('renders floor chip with correct text when an armed min-mode floor exists', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeFloorHass());
    const chip = el.shadowRoot!.querySelector('.acp-floor-chip');
    expect(chip).toBeTruthy();
    expect(chip!.textContent?.trim()).toMatch(/↥\s*25%/);
  });

  it('floor chip has is-armed class when floor position <= target (not clamping)', async () => {
    // target = 42, floor = 25 → target >= floor → armed but not clamping
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeFloorHass({ targetPosition: 42 }));
    const chip = el.shadowRoot!.querySelector('.acp-floor-chip');
    expect(chip).toBeTruthy();
    expect(chip!.classList.contains('is-armed')).toBe(true);
  });

  it('floor chip does not have is-armed class when floor > target (clamping)', async () => {
    // target = 10, floor = 25 → floor > target → clamping → full-color, no is-armed
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeFloorHass({ targetPosition: 10 }));
    const chip = el.shadowRoot!.querySelector('.acp-floor-chip');
    expect(chip).toBeTruthy();
    expect(chip!.classList.contains('is-armed')).toBe(false);
  });

  it('floor chip has is-bypassable class when priority <= MANUAL_OVERRIDE_PRIORITY', async () => {
    // priority 75 ≤ 80 → manual ↓ bypasses → subdued
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeFloorHass({ priority: 75 }));
    const chip = el.shadowRoot!.querySelector('.acp-floor-chip');
    expect(chip).toBeTruthy();
    expect(chip!.classList.contains('is-bypassable')).toBe(true);
    expect(chip!.classList.contains('resists-manual')).toBe(false);
  });

  it('floor chip has resists-manual class when priority > MANUAL_OVERRIDE_PRIORITY', async () => {
    // priority 90 > 80 → resists manual ↓ → emphasized
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeFloorHass({ priority: 90 }));
    const chip = el.shadowRoot!.querySelector('.acp-floor-chip');
    expect(chip).toBeTruthy();
    expect(chip!.classList.contains('resists-manual')).toBe(true);
    expect(chip!.classList.contains('is-bypassable')).toBe(false);
  });

  it('suppresses floor chip when winner is custom_position with minimum_mode true', async () => {
    // The badge already says "… floor" — no redundant chip needed
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeFloorHass({ winner: 'custom_position_1', customPositionMinimumMode: true }),
    );
    expect(el.shadowRoot!.querySelector('.acp-floor-chip')).toBeFalsy();
  });

  it('suppresses floor chip when floor sensor is off', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeFloorHass({ sensorOn: false }));
    expect(el.shadowRoot!.querySelector('.acp-floor-chip')).toBeFalsy();
  });

  it('suppresses floor chip when integration is disabled', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeFloorHass({ integrationEnabled: false }),
    );
    expect(el.shadowRoot!.querySelector('.acp-floor-chip')).toBeFalsy();
  });

  it('shows highest-position floor chip when two slots are both armed', async () => {
    const hass = makeHass({
      decisionState: 'solar',
      decisionAttrs: {
        trace: [{ handler: 'solar', matched: true, reason: '', position: 30 }],
        custom_position_slots: [
          {
            slot: 1,
            enabled: true,
            sensor: 'input_boolean.slot1',
            sensor_name: 'Low floor',
            position: 20,
            priority: 1,
            min_mode: true,
          },
          {
            slot: 2,
            enabled: true,
            sensor: 'input_boolean.slot2',
            sensor_name: 'High floor',
            position: 45,
            priority: 2,
            min_mode: true,
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
        ],
      },
    });
    (hass.states as Record<string, unknown>)['input_boolean.slot1'] = {
      state: 'on',
      attributes: {},
    };
    (hass.states as Record<string, unknown>)['input_boolean.slot2'] = {
      state: 'on',
      attributes: {},
    };
    const el = await mount({ type: TYPE, entry_id: ENTRY }, hass);
    const chip = el.shadowRoot!.querySelector('.acp-floor-chip');
    expect(chip).toBeTruthy();
    // Should show the highest floor (45%), not the lower one (20%)
    expect(chip!.textContent?.trim()).toMatch(/45%/);
  });
});

describe('adaptive-cover-pro-tile-card narrow-column responsiveness (#136)', () => {
  // happy-dom has no layout engine, so these lock the DOM contract the CSS relies
  // on (structural guard) and assert the container-query mechanism is present in
  // the stylesheet. Actual visual reflow is verified via the harness + build.
  it('keeps all three controls and the full title in detailed layout (regression guard)', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed', name: 'Centre Gauche' },
      makeHass(),
    );
    expect(el.shadowRoot!.querySelectorAll('.controls button').length).toBe(3);
    const title = el.shadowRoot!.querySelector('.title');
    expect(title).toBeTruthy();
    // The full name stays in the DOM — the narrow fix must free space via the
    // grid, never by dropping or clipping the title element's text content.
    expect(title!.textContent?.trim()).toBe('Centre Gauche');
  });

  it('declares an inline-size container so the column width drives the layout', () => {
    const css = (AdaptiveCoverProTileCard.styles as { cssText: string }).cssText;
    expect(css).toContain('container-type: inline-size');
  });

  it('reflows the detailed controls onto their own full-width row at a narrow breakpoint', () => {
    const css = (AdaptiveCoverProTileCard.styles as { cssText: string }).cssText;
    expect(css).toContain('@container');
    // The narrow detailed grid moves controls to a row of their own — this
    // 'controls'-spanning template area exists only in the narrow reflow.
    expect(css).toContain('controls controls controls');
  });

  it('reflows phone tiles via a viewport gate, not tile width alone (#154)', () => {
    // A phone tile spans ~360-390px, the same as a medium tile in a multi-column
    // desktop dashboard — so a bare container query can't tell them apart and a
    // blanket raise made laptop tiles grow a control row. The phone reflow is
    // gated on a narrow *viewport* (≤500px) so only real phones trigger it.
    const css = (AdaptiveCoverProTileCard.styles as { cssText: string }).cssText;
    expect(css).toContain('@media (max-width: 500px)');
    expect(css).toContain('max-width: 480px');
  });

  it('still reflows a genuinely narrow desktop column via the container query (#136)', () => {
    // #136 is a column-driven squeeze on a wide viewport, where @media can't see
    // the narrow tile — the bare container query at ≤340px must remain.
    const css = (AdaptiveCoverProTileCard.styles as { cssText: string }).cssText;
    expect(css).toContain('@container (max-width: 340px)');
  });
});

interface GridOptions {
  columns: number | string;
  rows: number | string;
  min_columns: number;
  min_rows: number;
}
interface GridTileLike extends CardLike {
  getGridOptions(): GridOptions;
}

describe('AdaptiveCoverProTileCard.getGridOptions', () => {
  it('defaults to full section width and content-driven (auto) height', () => {
    const card = makeCard() as GridTileLike;
    card.setConfig({ type: TYPE, entry_id: ENTRY });
    const opts = card.getGridOptions();
    expect(opts.columns).toBe('full');
    expect(opts.rows).toBe('auto');
    expect(opts.min_columns).toBe(3);
  });

  it('floors detailed (default) layout at 2 rows so controls never clip', () => {
    const card = makeCard() as GridTileLike;
    card.setConfig({ type: TYPE, entry_id: ENTRY });
    expect(card.getGridOptions().min_rows).toBe(2);
  });

  it('lets the one-line layout shrink to a single row', () => {
    const card = makeCard() as GridTileLike;
    card.setConfig({ type: TYPE, entry_id: ENTRY, layout: 'one-line' });
    expect(card.getGridOptions().min_rows).toBe(1);
  });

  it('keeps the auto-height default regardless of layout mode', () => {
    const card = makeCard() as GridTileLike;
    card.setConfig({ type: TYPE, entry_id: ENTRY, layout: 'one-line' });
    expect(card.getGridOptions().rows).toBe('auto');
  });
});
