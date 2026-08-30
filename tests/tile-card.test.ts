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
    coverLeftDeviceClass: string | undefined;
    coverLeftIcon: string | undefined;
    coverLeftState: string;
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
        state: overrides.coverLeftState ?? 'open',
        attributes: {
          friendly_name: 'Left blind',
          ...(overrides.coverLeftCurrentPosition !== undefined
            ? { current_position: overrides.coverLeftCurrentPosition }
            : {}),
          ...(overrides.coverLeftDeviceClass !== undefined
            ? { device_class: overrides.coverLeftDeviceClass }
            : {}),
          ...(overrides.coverLeftIcon !== undefined ? { icon: overrides.coverLeftIcon } : {}),
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

function tiltHass(
  callService?: (...args: unknown[]) => unknown,
  overrides: Partial<{ coverLeftState: string }> = {},
): HomeAssistant {
  const h = makeHass({ callService, ...overrides });
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

/** The tile's stylesheet as one string. `styles` is an ARRAY since the rail
 *  overlay's shared fragment was factored out, so a single `.cssText` no longer
 *  covers it — joining keeps these assertions checking the whole sheet. */
function tileCss(): string {
  const styles = AdaptiveCoverProTileCard.styles as unknown as
    | { cssText: string }
    | { cssText: string }[];
  return Array.isArray(styles) ? styles.map((s) => s.cssText).join('\n') : styles.cssText;
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

  // Audit finding #2 (issue #247 fix pass): a malformed `name` — the natural
  // typo from omitting the `- ` in a YAML list, e.g. `name: {type: area}`
  // instead of `name: [{type: area}]` — must throw a readable setConfig error
  // rather than silently blanking the whole tile at render time.
  it('throws when name is a bare object instead of an array of parts', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: TYPE,
        entry_id: ENTRY,
        name: { type: 'area' } as unknown as AdaptiveCoverProTileCardConfig['name'],
      }),
    ).toThrow(/name/);
  });

  it('throws when name is an array containing a null entry', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: TYPE,
        entry_id: ENTRY,
        name: [null] as unknown as AdaptiveCoverProTileCardConfig['name'],
      }),
    ).toThrow(/name/);
  });

  it('throws when name is an array containing an unrecognized part type', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: TYPE,
        entry_id: ENTRY,
        name: [{ type: 'bogus' }] as unknown as AdaptiveCoverProTileCardConfig['name'],
      }),
    ).toThrow(/name/);
  });

  // Audit finding #1 (issue #247 fix pass): a YAML `name:` with no value
  // parses to `null` — the templated-dashboard empty-variable case that issue
  // #247 was filed for. Pre-#247 `cfg.name ?? entry_title` rendered this fine;
  // `setConfig` must not hard-error it.
  it('does not throw when name is null', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: TYPE,
        entry_id: ENTRY,
        name: null as unknown as AdaptiveCoverProTileCardConfig['name'],
      }),
    ).not.toThrow();
  });

  // `0` and `false` are literal values pre-#247 (`0 ?? x` is `0`), not shape
  // errors — must not throw.
  it('does not throw when name is 0', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: TYPE,
        entry_id: ENTRY,
        name: 0 as unknown as AdaptiveCoverProTileCardConfig['name'],
      }),
    ).not.toThrow();
  });

  it('does not throw when name is false', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: TYPE,
        entry_id: ENTRY,
        name: false as unknown as AdaptiveCoverProTileCardConfig['name'],
      }),
    ).not.toThrow();
  });

  it('accepts a plain string name unchanged', () => {
    const el = makeCard();
    expect(() => el.setConfig({ type: TYPE, entry_id: ENTRY, name: 'Patio Right' })).not.toThrow();
  });

  it('accepts a well-formed composed name array', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: TYPE,
        entry_id: ENTRY,
        name: [{ type: 'area' }, { type: 'entry' }, { type: 'text', text: '–' }],
      }),
    ).not.toThrow();
  });
});

describe('adaptive-cover-pro-tile-card render', () => {
  it('renders state and position by default ("Open · 42%")', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass());
    const root = el.shadowRoot!;
    // cover.left has state 'open' in the fixture; no localizer is mocked so
    // formatCoverState falls back to capitalizing the raw state.
    expect(root.querySelector('.state')?.textContent?.trim()).toBe('Open · 42%');
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
    expect(el.shadowRoot!.querySelector('.state')?.textContent?.trim()).toBe('42%');
  });

  it('renders only the state when show_position is false', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY, show_position: false }, makeHass());
    expect(el.shadowRoot!.querySelector('.state')?.textContent?.trim()).toBe('Open');
  });

  it('hides the position cell entirely when both toggles are off', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, show_position: false, show_state: false },
      makeHass(),
    );
    expect(el.shadowRoot!.querySelector('.state')).toBeFalsy();
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
    // Override the sensor state to 100 on a LATER `hass` tick (not just at mount
    // time), to make calculated vs live differ clearly. This must swap in a
    // fresh `sensor.cover_position` object and a fresh top-level `hass` +
    // `states` object — mutating the existing sensor object in place would
    // leave its reference identity unchanged, and `shouldUpdate`
    // (src/adaptive-cover-pro-tile-card.ts) skips re-rendering via
    // `entityStateChanged` (src/lib/hass-change.ts) whenever none of the
    // discovered entities' object identities changed, silently leaving this
    // assertion checking the mount-time DOM instead of the poked value.
    const oldHass = el.hass!;
    el.hass = {
      ...oldHass,
      states: {
        ...oldHass.states,
        'sensor.cover_position': {
          ...(oldHass.states['sensor.cover_position'] as { state: string }),
          state: '100',
        },
      },
    } as unknown as HomeAssistant;
    await el.updateComplete;
    const text = el.shadowRoot!.querySelector('.state')?.textContent?.trim();
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

describe('adaptive-cover-pro-tile-card transit motion indicator', () => {
  // No-feedback covers surface their in-transit direction as the same localized
  // "Opening"/"Closing" state text a real position cover shows — no custom glyph.
  // The fixture cover.left reports state 'open' with no localizer mocked, so
  // formatCoverState falls back to capitalizing the (overridden) state.
  it('renders the readout as "Opening" when transit_states marks the cover opening', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({
        coverPositionSensorAttrs: {
          actual_positions: { 'cover.left': 40, 'cover.right': 45 },
          transit_states: { 'cover.left': 'opening' },
        },
      }),
    );
    const position = el.shadowRoot!.querySelector('.state');
    expect(position?.textContent).toContain('Opening');
    // The custom arrow glyph is gone — the state text is the only indication.
    expect(el.shadowRoot!.querySelector('.state ha-icon')).toBeFalsy();
  });

  it('renders the readout as "Closing" when transit_states marks the cover closing', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({
        coverPositionSensorAttrs: {
          actual_positions: { 'cover.left': 40, 'cover.right': 45 },
          transit_states: { 'cover.left': 'closing' },
        },
      }),
    );
    const position = el.shadowRoot!.querySelector('.state');
    expect(position?.textContent).toContain('Closing');
    expect(el.shadowRoot!.querySelector('.state ha-icon')).toBeFalsy();
  });

  it('shows the resting state (not Opening/Closing) when transit_states is absent', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass());
    const text = el.shadowRoot!.querySelector('.state')?.textContent ?? '';
    expect(text).toContain('Open');
    expect(text).not.toContain('Opening');
    expect(text).not.toContain('Closing');
  });

  it('shows the resting state for a cover not present in transit_states', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({
        coverPositionSensorAttrs: {
          actual_positions: { 'cover.left': 40, 'cover.right': 45 },
          transit_states: { 'cover.other': 'closing' },
        },
      }),
    );
    const text = el.shadowRoot!.querySelector('.state')?.textContent ?? '';
    expect(text).toContain('Open');
    expect(text).not.toContain('Opening');
    expect(text).not.toContain('Closing');
  });

  it('hides the transit indication when show_state is false (matches real covers)', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, show_state: false },
      makeHass({
        coverPositionSensorAttrs: {
          actual_positions: { 'cover.left': 40, 'cover.right': 45 },
          transit_states: { 'cover.left': 'opening' },
        },
      }),
    );
    const text = el.shadowRoot!.querySelector('.position')?.textContent ?? '';
    expect(text).not.toContain('Opening');
  });
});

describe('adaptive-cover-pro-tile-card group entry (issue #185)', () => {
  const GROUP_ENTRY = 'group_xyz';
  const GROUP_REGISTRY: EntityRegistryEntry[] = [
    {
      entity_id: 'sensor.group_position',
      unique_id: `${GROUP_ENTRY}_group_position`,
      config_entry_id: GROUP_ENTRY,
      platform: 'adaptive_cover_pro',
      device_id: null,
    },
    {
      entity_id: 'sensor.group_state',
      unique_id: `${GROUP_ENTRY}_group_state`,
      config_entry_id: GROUP_ENTRY,
      platform: 'adaptive_cover_pro',
      device_id: null,
    },
    {
      entity_id: 'sensor.group_active_scene',
      unique_id: `${GROUP_ENTRY}_group_active_scene`,
      config_entry_id: GROUP_ENTRY,
      platform: 'adaptive_cover_pro',
      device_id: null,
    },
    {
      entity_id: 'sensor.group_who_won',
      unique_id: `${GROUP_ENTRY}_group_who_won`,
      config_entry_id: GROUP_ENTRY,
      platform: 'adaptive_cover_pro',
      device_id: null,
    },
    {
      entity_id: 'select.group_scene',
      unique_id: `${GROUP_ENTRY}_group_scene_select`,
      config_entry_id: GROUP_ENTRY,
      platform: 'adaptive_cover_pro',
      device_id: null,
    },
    {
      entity_id: 'switch.group_lock',
      unique_id: `${GROUP_ENTRY}_group_lock`,
      config_entry_id: GROUP_ENTRY,
      platform: 'adaptive_cover_pro',
      device_id: null,
    },
  ];

  function makeGroupHass(): HomeAssistant {
    return {
      states: {
        'sensor.group_position': {
          state: '50',
          attributes: { member_positions: { 'cover.a': 40, 'cover.b': 60 } },
        },
        'sensor.group_state': { state: 'mixed', attributes: {} },
        'sensor.group_active_scene': { state: 'all_open', attributes: {} },
        'sensor.group_who_won': {
          state: '2',
          attributes: { member_winners: { 'cover.a': 'solar', 'cover.b': 'manual' } },
        },
        'select.group_scene': {
          state: 'all_open',
          attributes: {
            options: ['auto', 'all_open', 'all_closed', 'privacy'],
            current_option: 'all_open',
          },
        },
        'switch.group_lock': { state: 'off', attributes: {} },
      },
      callService: vi.fn(),
      callWS: vi.fn().mockResolvedValue(GROUP_REGISTRY),
      connection: { subscribeEvents: vi.fn().mockResolvedValue(() => {}) },
    } as unknown as HomeAssistant;
  }

  it('delegates to <acp-group-tile> and renders no cover controls for a group entry', async () => {
    const el = makeCard();
    el.setConfig({ type: TYPE, entry_id: GROUP_ENTRY });
    el.hass = makeGroupHass();
    document.body.appendChild(el);
    el._registry = GROUP_REGISTRY;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('acp-group-tile')).toBeTruthy();
    // The cover ↑/↓ controls must NOT render for a group.
    expect(el.shadowRoot!.querySelector('button.up')).toBeFalsy();
    expect(el.shadowRoot!.querySelector('button.down')).toBeFalsy();
  });

  it('still renders the cover tile (with controls) for a non-group entry', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass());
    expect(el.shadowRoot!.querySelector('acp-group-tile')).toBeFalsy();
    expect(el.shadowRoot!.querySelector('button.up')).toBeTruthy();
  });

  // Audit finding #1 (issue #247 fix pass): a Cover Group entry with a
  // composed `name` must resolve through resolveTileName() before it reaches
  // <acp-group-tile>/<acp-group-dialog> — those components only ever declare
  // `name?: string` and render `${this.name ?? entry_title}`, so a raw
  // AcpNamePart[] handed to them stringifies to "[object Object]".
  it('resolves a composed name before handing it to acp-group-tile / acp-group-dialog', async () => {
    const el = makeCard();
    el.setConfig({
      type: TYPE,
      entry_id: GROUP_ENTRY,
      name: [
        { type: 'text', text: 'Composed' },
        { type: 'text', text: 'Name' },
      ],
    });
    el.hass = makeGroupHass();
    document.body.appendChild(el);
    el._registry = GROUP_REGISTRY;
    await el.updateComplete;

    const groupTile = el.shadowRoot!.querySelector('acp-group-tile') as HTMLElement & {
      updateComplete: Promise<boolean>;
      name?: string;
    };
    expect(groupTile).toBeTruthy();
    expect(groupTile.name).toBe('Composed Name');
    await groupTile.updateComplete;
    expect(groupTile.shadowRoot!.querySelector('.title')?.textContent?.trim()).toBe(
      'Composed Name',
    );

    const groupDialog = el.shadowRoot!.querySelector('acp-group-dialog') as HTMLElement & {
      name?: string;
    };
    expect(groupDialog).toBeTruthy();
    expect(groupDialog.name).toBe('Composed Name');
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

  it('shows the Occupancy idle badge when the icon is off and its flag is on', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'one-line', show_motion_icon: false },
      motionWinnerHass(),
    );
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge).toBeTruthy();
    const text = badge!.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();
    expect(text).toBe('Occupancy idle');
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

  it("derives the tile icon from the cover's device_class", async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftDeviceClass: 'awning' }),
    );
    expect(el.shadowRoot!.querySelector('ha-icon.cover-icon')?.getAttribute('icon')).toBe(
      'mdi:awning-outline',
    );
  });

  it('device_class icon is position-aware (window closed at 0)', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftDeviceClass: 'window', coverLeftCurrentPosition: 0 }),
    );
    expect(el.shadowRoot!.querySelector('ha-icon.cover-icon')?.getAttribute('icon')).toBe(
      'mdi:window-closed',
    );
  });

  it("an explicit entity icon wins over the cover's device_class", async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftDeviceClass: 'awning', coverLeftIcon: 'mdi:star' }),
    );
    expect(el.shadowRoot!.querySelector('ha-icon.cover-icon')?.getAttribute('icon')).toBe(
      'mdi:star',
    );
  });

  it('cfg.icon still wins over the device_class icon', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, icon: 'mdi:test-icon' },
      makeHass({ coverLeftDeviceClass: 'awning' }),
    );
    expect(el.shadowRoot!.querySelector('ha-icon.cover-icon')?.getAttribute('icon')).toBe(
      'mdi:test-icon',
    );
  });

  it('colors the cover icon by state (open) by default', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass({ coverLeftState: 'open' }));
    const icon = el.shadowRoot!.querySelector('ha-icon.cover-icon');
    expect(icon?.getAttribute('style')).toContain(
      'var(--state-cover-open-color, var(--state-cover-active-color, var(--state-cover-color, var(--state-active-color))))',
    );
  });

  it('colors the cover icon by state (closed) by default', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass({ coverLeftState: 'closed' }));
    const icon = el.shadowRoot!.querySelector('ha-icon.cover-icon');
    expect(icon?.getAttribute('style')).toContain(
      'var(--state-cover-closed-color, var(--state-cover-inactive-color, var(--state-cover-color, var(--state-inactive-color))))',
    );
  });

  it('colors the cover icon with the unavailable var when the cover is unavailable', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftState: 'unavailable' }),
    );
    const icon = el.shadowRoot!.querySelector('ha-icon.cover-icon');
    expect(icon?.getAttribute('style')).toContain('var(--state-unavailable-color)');
  });

  it('omits the inline state color when state_color is false', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, state_color: false },
      makeHass({ coverLeftState: 'open' }),
    );
    const icon = el.shadowRoot!.querySelector('ha-icon.cover-icon');
    expect(icon?.getAttribute('style') ?? '').not.toContain('--state-cover');
  });

  it('uses horizontal expand/collapse control glyphs for an awning', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftDeviceClass: 'awning' }),
    );
    expect(el.shadowRoot!.querySelector('.controls .up ha-icon')?.getAttribute('icon')).toBe(
      'mdi:arrow-expand-horizontal',
    );
    expect(el.shadowRoot!.querySelector('.controls .down ha-icon')?.getAttribute('icon')).toBe(
      'mdi:arrow-collapse-horizontal',
    );
    expect(el.shadowRoot!.querySelector('.controls .stop ha-icon')?.getAttribute('icon')).toBe(
      'mdi:stop',
    );
  });

  it('uses vertical arrow control glyphs when the cover has no device_class', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass());
    expect(el.shadowRoot!.querySelector('.controls .up ha-icon')?.getAttribute('icon')).toBe(
      'mdi:arrow-up',
    );
    expect(el.shadowRoot!.querySelector('.controls .down ha-icon')?.getAttribute('icon')).toBe(
      'mdi:arrow-down',
    );
  });

  it('still fires the position service when an awning control is clicked', async () => {
    const callService = vi.fn();
    const h = makeHass({ callService, coverLeftDeviceClass: 'awning' });
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

  it('detailed layout stacks the summary under the state within the label', async () => {
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
    // The summary is a dim line stacked inside the flex-column label (HA-tile
    // structure), no longer a right-justified inline chip on the title row.
    expect(summary!.parentElement?.classList.contains('label')).toBe(true);
  });

  it('detailed layout renders the winner badge on the badge row', async () => {
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
    // ACP badges collect on the dedicated .chrome-line row, not on the name/state
    // rows. The winner (Solar) badge lives there.
    const badge = el.shadowRoot!.querySelector('.chrome-line acp-tile-badge');
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
  // Text of a badge element from its shadow root, whitespace-collapsed.
  const badgeText = (b: Element): string => b.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim();

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
    // Both badges live on the dedicated .chrome-line row: Auto first, then the
    // Cloudy winner.
    const badges = body.querySelectorAll('.chrome-line acp-tile-badge');
    expect(badges.length).toBe(2);
    expect(badgeText(badges[0])).toBe('Auto');
    expect(badgeText(badges[1])).toBe('Cloudy');
  });

  it('detailed: the Auto badge appears before the winner badge within .chrome-line', async () => {
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
    const badges = Array.from(body.querySelectorAll('.chrome-line acp-tile-badge'));
    const autoIdx = badges.findIndex((b) => badgeText(b) === 'Auto');
    const winnerIdx = badges.findIndex((b) => badgeText(b) === 'Cloudy');
    expect(autoIdx).toBeGreaterThanOrEqual(0);
    expect(winnerIdx).toBeGreaterThanOrEqual(0);
    expect(autoIdx).toBeLessThan(winnerIdx);
  });

  it('detailed: default winner (auto) renders the Auto badge only — no duplicate', async () => {
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
    const badges = body.querySelectorAll('.chrome-line acp-tile-badge');
    expect(badges.length).toBe(1);
    expect(badgeText(badges[0])).toBe('Auto');
  });

  it('detailed: manual override active → no Auto badge', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed' },
      makeHass({ manualOverrideOn: true, decisionState: 'manual' }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    const badges = Array.from(body.querySelectorAll('.chrome-line acp-tile-badge'));
    expect(badges.some((b) => badgeText(b) === 'Auto')).toBe(false);
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
    const badges = Array.from(body.querySelectorAll('.chrome-line acp-tile-badge'));
    expect(badges.some((b) => badgeText(b) === 'Auto')).toBe(false);
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
    const badges = Array.from(body.querySelectorAll('.chrome-line acp-tile-badge'));
    expect(badges.some((b) => badgeText(b) === 'Auto')).toBe(false);
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
    const badges = Array.from(body.querySelectorAll('.chrome-line acp-tile-badge'));
    expect(badges.some((b) => badgeText(b) === 'Auto')).toBe(true);
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
    const badges = Array.from(body.querySelectorAll('.chrome-line acp-tile-badge'));
    expect(badges.some((b) => badgeText(b) === 'Auto')).toBe(false);
    expect(badges.some((b) => badgeText(b) === 'Cloudy')).toBe(true);
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

  // Issue #223: the tile's single winner badge derived its kind purely from
  // the literal winner string, never consulting the matched decision-trace
  // rows. When climate is genuinely matched but a different handler (here,
  // `default`) is the literal winner, the tile fell back to the generic
  // "Auto" badge while the more-info dialog (which walks every matched row)
  // correctly showed "Climate". Both layouts must agree once fixed.
  it('one-line: climate matched but not the literal winner → single badge reads Climate, not Auto', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'one-line', badges: { climate: true } },
      makeHass({
        decisionState: 'default',
        decisionAttrs: {
          trace: [
            { handler: 'climate', matched: true, reason: 'heat protection', position: 20 },
            { handler: 'default', matched: true, reason: 'default calc', position: 60 },
          ],
        },
      }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body')!;
    const badges = body.querySelectorAll('acp-tile-badge');
    expect(badges.length).toBe(1);
    expect(badgeText(badges[0])).toBe('Climate');
  });

  it('detailed: climate matched but not the literal winner → winner badge reads Climate, not Auto', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed', badges: { climate: true } },
      makeHass({
        decisionState: 'default',
        decisionAttrs: {
          trace: [
            { handler: 'climate', matched: true, reason: 'heat protection', position: 20 },
            { handler: 'default', matched: true, reason: 'default calc', position: 60 },
          ],
        },
      }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    const badges = Array.from(body.querySelectorAll('.chrome-line acp-tile-badge'));
    expect(badges.some((b) => badgeText(b) === 'Climate')).toBe(true);
    expect(badges.some((b) => badgeText(b) === 'Auto')).toBe(true);
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
    expect(overlay!.getAttribute('data-tooltip')).toBe('Occupancy detected');
  });

  it('renders the overlay when motion_status is timeout_pending', async () => {
    const el = await mountWithMotion({ type: TYPE, entry_id: ENTRY }, 'timeout_pending');
    const overlay = el.shadowRoot!.querySelector('.motion-overlay');
    expect(overlay).toBeTruthy();
    expect(overlay!.getAttribute('data-tooltip')).toBe('Occupancy timeout pending');
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

  it('tap_action fires via handleAction using call-service syntax', async () => {
    const callService = vi.fn();
    const el = await mount(
      {
        type: TYPE,
        entry_id: ENTRY,
        tap_action: {
          action: 'call-service',
          service: 'cover.open_cover',
          service_data: { entity_id: 'cover.left' },
        },
      },
      makeHass({ callService }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body') as HTMLElement;
    body.click();
    expect(callService).toHaveBeenCalledWith(
      'cover',
      'open_cover',
      { entity_id: 'cover.left' },
      undefined,
    );
  });

  // #281: HA renamed call-service → perform-action (service → perform_action,
  // service_data → data) in 2024.8; the card's ha-selector editor now emits
  // this vocabulary by default, but pinned custom-card-helpers@2.0.0 only
  // understands call-service. setConfig normalizes perform-action configs
  // before handleAction ever sees them — these prove that for all four
  // action-config options.
  it('tap_action fires via handleAction using perform-action syntax (#281)', async () => {
    const callService = vi.fn();
    const el = await mount(
      {
        type: TYPE,
        entry_id: ENTRY,
        tap_action: {
          action: 'perform-action',
          perform_action: 'cover.open_cover',
          data: { entity_id: 'cover.left' },
        } as unknown as AdaptiveCoverProTileCardConfig['tap_action'],
      },
      makeHass({ callService }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body') as HTMLElement;
    body.click();
    expect(callService).toHaveBeenCalledWith(
      'cover',
      'open_cover',
      { entity_id: 'cover.left' },
      undefined,
    );
  });

  it('hold_action fires via handleAction using perform-action syntax (#281)', async () => {
    vi.useFakeTimers();
    try {
      const callService = vi.fn();
      const el = await mount(
        {
          type: TYPE,
          entry_id: ENTRY,
          hold_action: {
            action: 'perform-action',
            perform_action: 'cover.open_cover',
            data: { entity_id: 'cover.left' },
          } as unknown as AdaptiveCoverProTileCardConfig['hold_action'],
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

  it('double_tap_action fires via handleAction using perform-action syntax (#281)', async () => {
    const callService = vi.fn();
    const el = await mount(
      {
        type: TYPE,
        entry_id: ENTRY,
        double_tap_action: {
          action: 'perform-action',
          perform_action: 'cover.close_cover',
          data: { entity_id: 'cover.left' },
        } as unknown as AdaptiveCoverProTileCardConfig['double_tap_action'],
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
      sensorName?: string | null;
    } = {},
  ): HomeAssistant {
    const {
      winner = 'solar',
      sensorOn = true,
      targetPosition = 42,
      integrationEnabled = true,
      customPositionMinimumMode = false,
      priority = 1,
      sensorName = 'Aeration',
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
            sensor_name: sensorName,
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
    expect(chip!.textContent?.trim()).toMatch(/↥\s*Aeration\s*·\s*25%/);
  });

  it('omits the name segment when the winning slot has no sensor_name', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeFloorHass({ sensorName: null }));
    const chip = el.shadowRoot!.querySelector('.acp-floor-chip');
    expect(chip).toBeTruthy();
    expect(chip!.textContent?.trim()).toMatch(/^↥\s*25%$/);
  });

  it('detailed: floor chip rides the dedicated badge row, not the one-line grid (#208 follow-up)', async () => {
    // Regression: an active min-mode floor must trigger the detailed badge row
    // (.chrome-line) and must NOT re-add the one-line `has-floor-chip` grid,
    // which would clobber the detailed grid areas and orphan .chrome-line/.tilt.
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeFloorHass());
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    expect(body.classList.contains('has-chrome-row')).toBe(true);
    expect(body.classList.contains('has-floor-chip')).toBe(false);
    expect(body.querySelector('.chrome-line .acp-floor-chip')).toBeTruthy();
  });

  it('detailed: show_badge false hides the floor chip (badge master switch, #208)', async () => {
    // The floor chip is now part of ACP's badge chrome: show_badge:false hides it
    // along with the Auto/winner badges (previously it leaked through).
    const el = await mount({ type: TYPE, entry_id: ENTRY, show_badge: false }, makeFloorHass());
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    expect(body.querySelector('.acp-floor-chip')).toBeFalsy();
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
    // Only the winning (highest-position) slot's name should surface.
    expect(chip!.textContent).toContain('High floor');
    expect(chip!.textContent).not.toContain('Low floor');
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
    const css = tileCss();
    expect(css).toContain('container-type: inline-size');
  });

  it('reflows the detailed controls onto their own full-width row at a narrow breakpoint', () => {
    const css = tileCss();
    expect(css).toContain('@container');
    // The narrow detailed grid (2 columns) moves controls to a row of their own
    // — this 'controls'-spanning template area exists only in the narrow reflow.
    expect(css).toContain('controls controls');
  });

  it('reflows phone tiles via a viewport gate, not tile width alone (#154)', () => {
    // A phone tile spans ~360-390px, the same as a medium tile in a multi-column
    // desktop dashboard — so a bare container query can't tell them apart and a
    // blanket raise made laptop tiles grow a control row. The phone reflow is
    // gated on a narrow *viewport* (≤500px) so only real phones trigger it.
    const css = tileCss();
    expect(css).toContain('@media (max-width: 500px)');
    expect(css).toContain('max-width: 480px');
  });

  it('still reflows a genuinely narrow desktop column via the container query (#136)', () => {
    // #136 is a column-driven squeeze on a wide viewport, where @media can't see
    // the narrow tile — the bare container query at ≤340px must remain.
    const css = tileCss();
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

describe('adaptive-cover-pro-tile-card unavailable cover (issue #212)', () => {
  const upBtn = (el: CardLike) => el.shadowRoot!.querySelector('button.up') as HTMLButtonElement;
  const stopBtn = (el: CardLike) =>
    el.shadowRoot!.querySelector('button.stop') as HTMLButtonElement;
  const downBtn = (el: CardLike) =>
    el.shadowRoot!.querySelector('button.down') as HTMLButtonElement;

  it('does not leak a stale position when the cover is unavailable, even though the diagnostic target sensor is still live', async () => {
    // Mirrors the bug report: the physical cover goes offline (unavailable),
    // but current_position is still numeric (stale attribute) and the
    // diagnostic target-position sensor keeps reporting a live value. Neither
    // should leak through as a displayed percentage.
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftState: 'unavailable', coverLeftCurrentPosition: 16 }),
    );
    // Simulate the diagnostic sensor staying live/stale at a divergent value
    // on a LATER `hass` tick (not just at mount time). This must swap in a
    // fresh `sensor.cover_position` object and a fresh top-level `hass` +
    // `states` object — mutating the existing sensor object in place would
    // leave its reference identity unchanged, and `shouldUpdate`
    // (src/adaptive-cover-pro-tile-card.ts) skips re-rendering via
    // `entityStateChanged` (src/lib/hass-change.ts) whenever none of the
    // discovered entities' object identities changed, silently leaving this
    // assertion checking the mount-time DOM instead of the poked value.
    const oldHass = el.hass!;
    el.hass = {
      ...oldHass,
      states: {
        ...oldHass.states,
        'sensor.cover_position': {
          ...(oldHass.states['sensor.cover_position'] as { state: string }),
          state: '100',
        },
      },
    } as unknown as HomeAssistant;
    await el.updateComplete;

    // `.position` only renders in the one-line layout; the default (detailed)
    // layout this test mounts puts the readout in `.state` instead, so assert
    // against the element that actually renders here.
    const stateCell = el.shadowRoot!.querySelector('.state');
    expect(stateCell?.textContent ?? '').not.toMatch(/%/);
  });

  it('renders an "Unavailable" label when the cover is unavailable', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftState: 'unavailable' }),
    );
    expect(el.shadowRoot!.textContent).toContain('Unavailable');
  });

  it('adds the unavailable class to .tile-body when the cover is unavailable', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftState: 'unavailable' }),
    );
    expect(el.shadowRoot!.querySelector('.tile-body')?.classList.contains('unavailable')).toBe(
      true,
    );
  });

  it('disables all three controls when the cover is unavailable', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftState: 'unavailable' }),
    );
    expect(upBtn(el).disabled).toBe(true);
    expect(stopBtn(el).disabled).toBe(true);
    expect(downBtn(el).disabled).toBe(true);
  });

  it('renders the unavailable fallback glyph (not the normal position-derived cover icon) when the cover is unavailable', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftState: 'unavailable' }),
    );
    const icon = el.shadowRoot!.querySelector('ha-icon.cover-icon');
    expect(icon?.getAttribute('icon')).toBe('mdi:help-rhombus-outline');
  });

  it("shows the calculated-sensor position (parity with any other no-feedback cover) but never the cover's own stale-looking current_position attribute when unknown", async () => {
    // Unlike hard-offline, an `unknown` cover (issue #232) is still
    // controllable, and its live readout should behave like any other
    // no-feedback cover: the ACP diagnostic (calculated) sensor is a
    // legitimate fallback. But this entity's OWN current_position attribute
    // is not trusted while its state itself signals "no confidence" — so the
    // stale-looking 16 must never surface, even though the calculated
    // sensor's 42 legitimately does.
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftState: 'unknown', coverLeftCurrentPosition: 16 }),
    );
    const stateText = el.shadowRoot!.querySelector('.state')?.textContent ?? '';
    expect(stateText).not.toContain('16%');
    expect(stateText).toContain('42%');
  });

  it('does not render an "Unavailable" label when the cover is unknown (it stays controllable)', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftState: 'unknown' }),
    );
    expect(el.shadowRoot!.textContent).not.toContain('Unavailable');
  });

  it('does not add the unavailable class to .tile-body when the cover is unknown', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftState: 'unknown' }),
    );
    expect(el.shadowRoot!.querySelector('.tile-body')?.classList.contains('unavailable')).toBe(
      false,
    );
  });

  it('keeps all three controls enabled when the cover is unknown', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftState: 'unknown' }),
    );
    expect(upBtn(el).disabled).toBe(false);
    expect(stopBtn(el).disabled).toBe(false);
    expect(downBtn(el).disabled).toBe(false);
  });

  it('regression (#73/#74): still shows the live cover position, not the calculated sensor value, when the cover IS available', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({
        coverLeftState: 'open',
        coverPositionSensorAttrs: { actual_positions: { 'cover.left': 16, 'cover.right': 45 } },
        coverLeftCurrentPosition: 16,
      }),
    );
    // Poke the sensor state on a LATER `hass` tick (not at mount time) — see the
    // identical pattern (and rationale) above in "does not leak a stale position
    // when the cover is unavailable...": a fresh top-level `hass` + `states` +
    // `sensor.cover_position` object is required, or `shouldUpdate` skips the
    // re-render and this assertion silently checks the mount-time DOM instead.
    const oldHass = el.hass!;
    el.hass = {
      ...oldHass,
      states: {
        ...oldHass.states,
        'sensor.cover_position': {
          ...(oldHass.states['sensor.cover_position'] as { state: string }),
          state: '100',
        },
      },
    } as unknown as HomeAssistant;
    await el.updateComplete;
    const text = el.shadowRoot!.querySelector('.state')?.textContent?.trim();
    expect(text).toBe('Open · 16%');
  });
});

describe('adaptive-cover-pro-tile-card unavailable dual-axis cover (issue #212)', () => {
  // Mirrors the primary-axis fixture: the physical cover goes `unavailable`,
  // but `current_tilt_position` is a stale attribute left over from the last
  // live update, and the diagnostic tilt-target sensor (sensor.cover_tilt)
  // keeps reporting a live solar target. Neither should leak through.

  it('nulls out the tilt bar actual/target when the cover is unavailable', async () => {
    const el = await mountTilt(
      { type: TYPE, entry_id: ENTRY },
      tiltHass(undefined, { coverLeftState: 'unavailable' }),
    );
    const tilt = el.shadowRoot!.querySelector('acp-tilt-bar') as HTMLElement & {
      actual: number | null;
      target: number | null;
    };
    expect(tilt).not.toBeNull();
    expect(tilt.actual).toBeNull();
    expect(tilt.target).toBeNull();
  });

  it('marks the tilt bar disabled when the cover is unavailable', async () => {
    const el = await mountTilt(
      { type: TYPE, entry_id: ENTRY },
      tiltHass(undefined, { coverLeftState: 'unavailable' }),
    );
    const tilt = el.shadowRoot!.querySelector('acp-tilt-bar') as HTMLElement & {
      disabled: boolean;
    };
    expect(tilt.disabled).toBe(true);
  });

  it('does not fire a service call when the tilt bar track is clicked while unavailable', async () => {
    const callService = vi.fn();
    const el = await mountTilt(
      { type: TYPE, entry_id: ENTRY },
      tiltHass(callService, { coverLeftState: 'unavailable' }),
    );
    const tiltBar = el.shadowRoot!.querySelector('acp-tilt-bar') as HTMLElement & {
      updateComplete: Promise<boolean>;
    };
    await tiltBar.updateComplete;
    const track = tiltBar.shadowRoot!.querySelector('.track') as HTMLElement;
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100, top: 0, bottom: 8, right: 100, height: 8 }),
      configurable: true,
    });
    track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 80 }));
    expect(callService).not.toHaveBeenCalled();
  });

  it('does not leak a stale tilt readout ("⟂") when the cover is unavailable (one-line layout)', async () => {
    const el = await mountTilt(
      { type: TYPE, entry_id: ENTRY, layout: 'one-line' },
      tiltHass(undefined, { coverLeftState: 'unavailable' }),
    );
    expect(el.shadowRoot!.textContent ?? '').not.toContain('⟂');
  });

  it('keeps the tilt bar enabled and clickable when the cover is unknown', async () => {
    const callService = vi.fn();
    const el = await mountTilt(
      { type: TYPE, entry_id: ENTRY },
      tiltHass(callService, { coverLeftState: 'unknown' }),
    );
    const tiltBar = el.shadowRoot!.querySelector('acp-tilt-bar') as HTMLElement & {
      disabled: boolean;
      updateComplete: Promise<boolean>;
    };
    expect(tiltBar.disabled).toBe(false);
    await tiltBar.updateComplete;
    const track = tiltBar.shadowRoot!.querySelector('.track') as HTMLElement;
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100, top: 0, bottom: 8, right: 100, height: 8 }),
      configurable: true,
    });
    track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 80 }));
    expect(callService).toHaveBeenCalled();
  });

  it('does not trust the raw current_tilt_position attribute, but the diagnostic tilt-target sensor still shows, when the cover is unknown', async () => {
    // Mirrors the primary-axis fixture: `noLiveData` blocks the raw attribute
    // (35, set unconditionally by tiltHass) but not the independently-sourced
    // diagnostic target sensor (70) — same live/diagnostic split as position.
    const el = await mountTilt(
      { type: TYPE, entry_id: ENTRY },
      tiltHass(undefined, { coverLeftState: 'unknown' }),
    );
    const tilt = el.shadowRoot!.querySelector('acp-tilt-bar') as HTMLElement & {
      actual: number | null;
      target: number | null;
    };
    expect(tilt.actual).toBeNull();
    expect(tilt.target).toBe(70);
  });
});

describe('adaptive-cover-pro-tile-card unknown-state cover renders like any other live cover (issue #232)', () => {
  const upBtn = (el: CardLike) => el.shadowRoot!.querySelector('button.up') as HTMLButtonElement;

  it('uses the normal cover icon glyph, not the unavailable fallback', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftState: 'unknown' }),
    );
    const icon = el.shadowRoot!.querySelector('ha-icon.cover-icon');
    expect(icon?.getAttribute('icon')).not.toBe('mdi:help-rhombus-outline');
    expect(icon?.getAttribute('icon')).toBe('mdi:blinds-horizontal');
  });

  it('colors the icon with the live (inactive-tier) cascade, not the unavailable var — matches native HA, which paints an unknown cover as inactive/grey rather than active/on', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftState: 'unknown' }),
    );
    const icon = el.shadowRoot!.querySelector('ha-icon.cover-icon');
    expect(icon?.getAttribute('style') ?? '').not.toContain('var(--state-unavailable-color)');
    expect(icon?.getAttribute('style')).toContain(
      'var(--state-cover-unknown-color, var(--state-cover-inactive-color, var(--state-cover-color, var(--state-inactive-color))))',
    );
  });

  it('shows the state text alone, with no percentage, when neither a live nor a calculated position exists', async () => {
    // No current_position attribute on the cover, and the calculated-sensor
    // fallback is made non-numeric here too (simulating a no-feedback cover
    // with no diagnostic estimate available either) — the row must show the
    // state text, never a blank row or an invented percentage. Set the
    // non-numeric sensor state before mount (not via a post-mount mutation):
    // the card skips re-rendering on a `hass` tick that doesn't change any
    // discovered entity's object identity, so mutating in place afterwards
    // would silently no-op.
    const hass = makeHass({ coverLeftState: 'unknown' });
    (hass.states['sensor.cover_position'] as { state: string }).state = 'unavailable';
    const el = await mount({ type: TYPE, entry_id: ENTRY }, hass);
    const stateEl = el.shadowRoot!.querySelector('.state');
    expect(stateEl?.textContent?.trim()).toBe('Unknown');
  });

  it('renders "Opening"/"Closing" transit text for a no-feedback cover mid-move even while unknown', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({
        coverLeftState: 'unknown',
        coverPositionSensorAttrs: { transit_states: { 'cover.left': 'opening' } },
      }),
    );
    expect(el.shadowRoot!.querySelector('.state')?.textContent).toContain('Opening');
  });

  it('does not disable ↑ from a stale-looking fully-open current_position attribute — an unknown cover does not trust its own attribute', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftState: 'unknown', coverLeftCurrentPosition: 100 }),
    );
    expect(upBtn(el).disabled).toBe(false);
  });

  it('does not let a leftover stale current_position attribute drive the icon glyph — the glyph follows the same gated position as the readout/bar', async () => {
    // Same untrusted-attribute rule as the readout and the button-disable
    // gating above must also apply to the icon glyph. A HA restart can leave
    // a stale `current_position` attribute in place while the state is still
    // `unknown`; the glyph must reflect the gated position (here, the
    // calculated-sensor fallback of 42 → the "partial" variant), never the
    // raw attribute's fully-closed or fully-open variant.
    const closedLeftover = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftState: 'unknown', coverLeftCurrentPosition: 0 }),
    );
    const closedIcon = closedLeftover.shadowRoot!.querySelector('ha-icon.cover-icon');
    expect(closedIcon?.getAttribute('icon')).not.toBe('mdi:blinds-horizontal-closed');
    expect(closedIcon?.getAttribute('icon')).toBe('mdi:blinds-horizontal');

    const openLeftover = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftState: 'unknown', coverLeftCurrentPosition: 100 }),
    );
    const openIcon = openLeftover.shadowRoot!.querySelector('ha-icon.cover-icon');
    expect(openIcon?.getAttribute('icon')).not.toBe('mdi:blinds-open');
    expect(openIcon?.getAttribute('icon')).toBe('mdi:blinds-horizontal');
  });
});

describe('adaptive-cover-pro-tile-card HA tile layout (detailed)', () => {
  it('detailed: leaves the icon bare (no tint shape / no --acp-icon-tint)', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass());
    const wrap = el.shadowRoot!.querySelector(
      '.tile-body.detailed .cover-icon-wrap',
    ) as HTMLElement;
    expect(wrap).toBeTruthy();
    expect(wrap.getAttribute('style') ?? '').not.toContain('--acp-icon-tint');
    expect(wrap.querySelector('.cover-icon')).toBeTruthy();
  });

  it('one-line: leaves the icon bare (no tint shape)', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY, layout: 'one-line' }, makeHass());
    const wrap = el.shadowRoot!.querySelector('.cover-icon-wrap') as HTMLElement;
    expect(wrap.getAttribute('style') ?? '').not.toContain('--acp-icon-tint');
  });

  it('detailed: renders the state readout as a .state line stacked in the label', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass());
    const stateLine = el.shadowRoot!.querySelector('.tile-body.detailed .label .state');
    expect(stateLine).toBeTruthy();
    expect(stateLine!.textContent?.trim()).toBe('Open · 42%');
  });

  it('detailed: no chrome row when neither badges nor the position bar are present', async () => {
    // With badges off AND the bar off there is nothing to put on the chrome row,
    // so it collapses entirely (bar-only would otherwise keep it for the bar).
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, show_badge: false, show_position_bar: false },
      makeHass(),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    expect(body.classList.contains('has-chrome-row')).toBe(false);
    expect(body.querySelector('.chrome-line')).toBeFalsy();
  });

  it('detailed: adds the badge row when the Auto badge shows', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({
        decisionState: 'default',
        decisionAttrs: {
          trace: [{ handler: 'default', matched: true, reason: '', position: 60 }],
        },
      }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    expect(body.classList.contains('has-chrome-row')).toBe(true);
    expect(body.querySelector('.chrome-line')).toBeTruthy();
  });

  it('links detailed controls to HA ha-control-button CSS tokens', () => {
    const css = tileCss();
    // 36px is HA's inline-features thickness (--feature-height: --ha-space-9),
    // which is what ha-tile-container sets for a features block beside the
    // info column — not the 42px of a full-width bottom feature row.
    expect(css).toContain('height: var(--control-button-group-thickness, 36px)');
    expect(css).toContain('border-radius: var(--control-button-border-radius, 12px)');
    // Buttons flex-fill their track, as HA's ha-control-button-group children do.
    expect(css).toContain('flex: 1 1 0');
  });

  it('detailed: renders the target-vs-actual position bar (fill = live, marker = target)', async () => {
    // current_position 60 → live fill; sensor.cover_position 42 → target marker.
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftCurrentPosition: 60 }),
    );
    const bar = el.shadowRoot!.querySelector(
      '.tile-body.detailed .chrome-line .pos-bar',
    ) as HTMLElement;
    expect(bar).toBeTruthy();
    const fill = bar.querySelector('.pos-fill') as HTMLElement;
    const marker = bar.querySelector('.pos-marker') as HTMLElement;
    // The rail draws COVERAGE on a blind: 60% open is 40% blocking, and the 42%
    // solar target sits at 58% along the track.
    expect(fill.getAttribute('style') ?? '').toContain('width:40%');
    expect(marker.getAttribute('style') ?? '').toContain('58%');
  });

  it('detailed: keeps the position bar when show_badge is false (bar is independent of badges)', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, show_badge: false },
      makeHass({ coverLeftCurrentPosition: 60 }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    // No ACP badges render, but the position bar stays — it has its own toggle.
    expect(body.querySelector('acp-tile-badge')).toBeFalsy();
    expect(body.querySelector('.pos-bar')).toBeTruthy();
    // The chrome row still exists to carry the bar, in its bar-only form.
    expect(body.classList.contains('has-chrome-row')).toBe(true);
    expect(body.classList.contains('bar-only')).toBe(true);
  });

  it('detailed: show_position_bar false hides the position bar (independent of badges)', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, show_position_bar: false },
      makeHass({ coverLeftCurrentPosition: 60 }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    expect(body.querySelector('.pos-bar')).toBeFalsy();
    // Badges still render (only the bar was turned off), so the chrome row is
    // NOT bar-only here.
    expect(body.classList.contains('bar-only')).toBe(false);
  });
});

// ── Extend manual override (#229) ────────────────────────────────────────────

const EXTEND_REGISTRY: EntityRegistryEntry[] = [
  ...REGISTRY,
  {
    entity_id: 'sensor.position_forecast',
    unique_id: `${ENTRY}_position_forecast`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
];

const FORECAST_EVENTS = [
  { t: '2099-06-15T15:30:00Z', kind: 'fov_exit', label: 'Sun leaves window' },
  { t: '2099-06-15T19:58:00Z', kind: 'sunset', label: 'Sunset' },
];

function extendHass(
  opts: {
    manualOverrideOn?: boolean;
    decisionState?: string;
    withService?: boolean;
    callService?: (...args: unknown[]) => unknown;
  } = {},
): HomeAssistant {
  const h = makeHass({
    manualOverrideOn: opts.manualOverrideOn ?? true,
    decisionState: opts.decisionState ?? 'manual',
    callService: opts.callService,
  });
  h.states['sensor.position_forecast'] = {
    state: 'ok',
    attributes: { forecast: [], events: FORECAST_EVENTS },
  } as never;
  if (opts.withService !== false) {
    (h as unknown as { services: unknown }).services = {
      [INTEGRATION_DOMAIN]: { engage_manual_override: {} },
    };
  }
  (h as unknown as { config: unknown }).config = { latitude: 52.37, longitude: 4.9 };
  (h as unknown as { callWS: unknown }).callWS = vi.fn().mockResolvedValue(EXTEND_REGISTRY);
  return h;
}

async function mountExtend(hass: HomeAssistant): Promise<CardLike> {
  const el = makeCard();
  el.setConfig({ type: TYPE, entry_id: ENTRY });
  el.hass = hass;
  document.body.appendChild(el);
  el._registry = EXTEND_REGISTRY;
  await el.updateComplete;
  return el;
}

describe('adaptive-cover-pro-tile-card — extend manual override (#229)', () => {
  it('makes the badge extendable when an override is active and the service exists', async () => {
    const el = await mountExtend(extendHass());
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge!.hasAttribute('extendable')).toBe(true);
  });

  it('hides the extend affordance on a legacy integration lacking the service, keeping Resume', async () => {
    const el = await mountExtend(extendHass({ withService: false }));
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge!.hasAttribute('extendable')).toBe(false);
    expect(badge!.hasAttribute('resumable')).toBe(true);
  });

  it('is not extendable when no override is active', async () => {
    const el = await mountExtend(extendHass({ manualOverrideOn: false, decisionState: 'solar' }));
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge!.hasAttribute('extendable')).toBe(false);
  });

  // #81/#82/#199 guard at the card layer: gate on manualActive, never on kind.
  it('is extendable when a custom_position slot wins with an override active', async () => {
    const el = await mountExtend(
      extendHass({ manualOverrideOn: true, decisionState: 'custom_position_1' }),
    );
    const badge = el.shadowRoot!.querySelector('acp-tile-badge');
    expect(badge!.hasAttribute('extendable')).toBe(true);
  });

  it('opens the extend dialog on acp-extend from the badge', async () => {
    const el = await mountExtend(extendHass());
    const dialog = el.shadowRoot!.querySelector('acp-extend-override-dialog') as HTMLElement & {
      open?: boolean;
    };
    expect(dialog.open).toBe(false);
    el.shadowRoot!.querySelector('acp-tile-badge')!.dispatchEvent(
      new CustomEvent('acp-extend', { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    expect(dialog.open).toBe(true);
  });

  it('passes presets derived from the position_forecast sensor to the dialog', async () => {
    const el = await mountExtend(extendHass());
    const dialog = el.shadowRoot!.querySelector('acp-extend-override-dialog') as HTMLElement & {
      presets?: Array<{ kind: string; t: string }>;
    };
    expect(dialog.presets!.map((p) => p.kind)).toEqual(['fov_exit', 'sunset']);
    expect(dialog.presets![0].t).toBe('2099-06-15T15:30:00Z');
  });

  it('calls engage_manual_override on ALL managed covers with a Z-suffixed end_time', async () => {
    const callService = vi.fn();
    const el = await mountExtend(extendHass({ callService }));
    const endMs = Date.parse('2099-06-15T19:58:00Z');
    el.shadowRoot!.querySelector('acp-extend-override-dialog')!.dispatchEvent(
      new CustomEvent('acp-extend-confirm', { detail: { endMs }, bubbles: true, composed: true }),
    );
    await el.updateComplete;

    const call = callService.mock.calls.find((c) => c[1] === 'engage_manual_override');
    expect(call).toBeTruthy();
    expect(call![0]).toBe(INTEGRATION_DOMAIN);
    const data = call![2] as { end_time: string };
    expect(data.end_time).toMatch(/(Z|[+-]\d{2}:\d{2})$/);
    expect(new Date(data.end_time).getTime()).toBe(endMs);
    // Entry-level surface: every managed cover, not just the first.
    expect(call![3]).toEqual({ entity_id: ['cover.left', 'cover.right'] });
  });

  it('closes the dialog after confirming', async () => {
    const el = await mountExtend(extendHass({ callService: vi.fn() }));
    el.shadowRoot!.querySelector('acp-tile-badge')!.dispatchEvent(
      new CustomEvent('acp-extend', { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    const dialog = el.shadowRoot!.querySelector('acp-extend-override-dialog') as HTMLElement & {
      open?: boolean;
    };
    expect(dialog.open).toBe(true);
    dialog.dispatchEvent(
      new CustomEvent('acp-extend-confirm', {
        detail: { endMs: Date.parse('2099-06-15T19:58:00Z') },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    expect(dialog.open).toBe(false);
  });
});

// ── inverse_state frame normalization (#234) ─────────────────────────────────

const INVERSE_REGISTRY: EntityRegistryEntry[] = [
  ...REGISTRY,
  {
    entity_id: 'sensor.control_status',
    unique_id: `${ENTRY}_control_status`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
];

const AWNING = 'cover.patio_awning';

/**
 * The reporter's exact install: a fully-extended awning on an `inverse_state`
 * entry. Logical position is 100 (extended), but the integration dispatches
 * `100 − 100 = 0`, so the cover entity AND `actual_positions` both report 0
 * while `linear_position` / `linear_actual_positions` stay logical at 100.
 *
 * `legacy` drops both post-#1033 fields (the accepted residual: the card cannot
 * detect the frame, so it must render exactly as it does today).
 * `reportsPosition: false` drops `current_position` to exercise the
 * `reportedPosition ?? calculatedPosition` fallback.
 */
function inverseHass(opts: { legacy?: boolean; reportsPosition?: boolean } = {}): HomeAssistant {
  const legacy = opts.legacy === true;
  const h = makeHass({
    coverPositionSensorAttrs: {
      actual_positions: { [AWNING]: 0 },
      ...(legacy ? {} : { linear_actual_positions: { [AWNING]: 100 } }),
      linear_position: 100,
      raw_calculated_position: 100,
      all_at_target: true,
    },
  });
  h.states['sensor.cover_position'].state = '0';
  h.states['sensor.control_status'] = {
    state: 'auto',
    attributes: {
      cover_type: 'cover_awning',
      cover_discovery: {
        cover_type: 'cover_awning',
        axes: [
          {
            id: 'position',
            label: 'Position',
            state_attr: 'current_position',
            supported: true,
            ...(legacy ? {} : { inverted: true }),
          },
        ],
      },
    },
  } as never;
  h.states[AWNING] = {
    state: 'open',
    attributes: {
      friendly_name: 'Patio Awning',
      device_class: 'awning',
      assumed_state: true,
      ...(opts.reportsPosition === false ? {} : { current_position: 0 }),
    },
  } as never;
  (h as unknown as { callWS: unknown }).callWS = vi.fn().mockResolvedValue(INVERSE_REGISTRY);
  return h;
}

async function mountInverse(hass: HomeAssistant): Promise<CardLike> {
  const el = makeCard();
  el.setConfig({ type: TYPE, entry_id: ENTRY });
  el.hass = hass;
  document.body.appendChild(el);
  el._registry = INVERSE_REGISTRY;
  await el.updateComplete;
  return el;
}

const fillWidth = (el: CardLike): string =>
  (el.shadowRoot!.querySelector('.pos-bar .pos-fill') as HTMLElement).getAttribute('style') ?? '';

describe('adaptive-cover-pro-tile-card — inverse_state frame normalization (#234)', () => {
  it('draws the fill and the target marker from one frame when the cover is at target', async () => {
    // The whole defect in one assertion: `all_at_target` is true, so an empty
    // bar with the marker pinned at the far end is a 100-point disagreement
    // inside a single widget. Both must resolve to the same number.
    const el = await mountInverse(inverseHass());
    const bar = el.shadowRoot!.querySelector('.pos-bar') as HTMLElement;
    expect(bar).toBeTruthy();
    const marker = bar.querySelector('.pos-marker') as HTMLElement;
    expect(fillWidth(el)).toContain('width:100%');
    // Bind the marker's own value: the rendered style is
    // `left:clamp(1px, X%, calc(100% - 1px))`, so a bare `100%` substring matches
    // for any X via the upper bound. Anchor on the clamp's middle argument.
    expect(marker.getAttribute('style') ?? '').toContain('left:clamp(1px, 100%,');
  });

  it('disables ↑ (open) and keeps ↓ (close) live on a fully-extended awning', async () => {
    // Pre-fix the raw 0 read as "fully closed", so the tile disabled Close —
    // the only direction the awning could actually move.
    const el = await mountInverse(inverseHass());
    const up = el.shadowRoot!.querySelector('button.up') as HTMLButtonElement;
    const down = el.shadowRoot!.querySelector('button.down') as HTMLButtonElement;
    expect(down.disabled).toBe(false);
    expect(up.disabled).toBe(true);
  });

  it('shows a readout that agrees with the entity state ("Open · 100%")', async () => {
    const el = await mountInverse(inverseHass());
    expect(el.shadowRoot!.querySelector('.state')?.textContent?.trim()).toBe('Open · 100%');
  });

  it('renders the same frame whether or not the cover reports a position', async () => {
    // `livePosition = reportedPosition ?? calculatedPosition` must not switch
    // frames on the presence of `current_position`: a reporting cover and a
    // no-feedback cover at the same logical position render the same bar.
    const reporting = await mountInverse(inverseHass());
    const noFeedback = await mountInverse(inverseHass({ reportsPosition: false }));
    expect(fillWidth(reporting)).toBe(fillWidth(noFeedback));
    expect(fillWidth(noFeedback)).toContain('width:100%');
  });

  it('stays byte-identical to today on a pre-#1033 integration (no new fields)', async () => {
    // Accepted residual, pinned deliberately: with neither `inverted` nor
    // `linear_actual_positions` the card has no sound frame oracle, so it must
    // NOT guess. This guards the normalization against a future "helpful"
    // inference from the state/linear_position relation.
    const el = await mountInverse(inverseHass({ legacy: true }));
    expect(fillWidth(el)).toContain('width:0%');
    const down = el.shadowRoot!.querySelector('button.down') as HTMLButtonElement;
    expect(down.disabled).toBe(true);
  });
});

describe('adaptive-cover-pro-tile-card — position bar drag slider', () => {
  const RECT = { left: 0, width: 100, top: 0, bottom: 6, right: 100, height: 6 };

  /** Mount a detailed tile with a live position and a stubbed slider rect, so
   *  clientX maps 1:1 onto percent. */
  async function mountSlider(
    callService = vi.fn(),
    hassOverrides: Record<string, unknown> = {},
  ): Promise<{ el: CardLike; slider: HTMLElement; callService: ReturnType<typeof vi.fn> }> {
    const h = makeHass({ callService, coverLeftCurrentPosition: 60, ...hassOverrides });
    (h as unknown as { services: unknown }).services = {
      adaptive_cover_pro: { set_axes: {}, set_position: {} },
    };
    const el = await mount({ type: TYPE, entry_id: ENTRY }, h);
    const slider = el.shadowRoot!.querySelector('.pos-slider') as HTMLElement;
    if (slider) {
      Object.defineProperty(slider, 'getBoundingClientRect', {
        value: () => RECT,
        configurable: true,
      });
    }
    return { el, slider, callService };
  }

  const down = (x: number): PointerEvent =>
    new PointerEvent('pointerdown', { bubbles: true, composed: true, clientX: x, pointerId: 1 });
  const move = (x: number): PointerEvent =>
    new PointerEvent('pointermove', { bubbles: true, composed: true, clientX: x, pointerId: 1 });
  const up = (x: number): PointerEvent =>
    new PointerEvent('pointerup', { bubbles: true, composed: true, clientX: x, pointerId: 1 });

  const posCall = (
    cs: ReturnType<typeof vi.fn>,
  ): [string, string, Record<string, unknown>, Record<string, unknown>] | undefined =>
    cs.mock.calls.find((c) => c[1] === 'set_axes' || c[1] === 'set_position') as
      | [string, string, Record<string, unknown>, Record<string, unknown>]
      | undefined;

  it('wraps the position bar in a slider exposing WAI-ARIA semantics', async () => {
    const { slider } = await mountSlider();
    expect(slider).toBeTruthy();
    expect(slider.getAttribute('role')).toBe('slider');
    expect(slider.getAttribute('tabindex')).toBe('0');
    expect(slider.getAttribute('aria-valuemin')).toBe('0');
    expect(slider.getAttribute('aria-valuemax')).toBe('100');
    // ARIA describes the visual, so valuenow is the drawn (coverage) value.
    expect(slider.getAttribute('aria-valuenow')).toBe('40');
    expect(slider.getAttribute('aria-label')).toBeTruthy();
    // The visible rail stays nested inside, untouched.
    expect(slider.querySelector('.pos-bar')).toBeTruthy();
  });

  it('previews the dragged value live without calling a service', async () => {
    const { el, slider, callService } = await mountSlider();
    slider.dispatchEvent(down(20));
    slider.dispatchEvent(move(80));
    await el.updateComplete;
    expect(fillWidth(el)).toContain('width:80%');
    expect(slider.getAttribute('aria-valuenow')).toBe('80');
    expect(posCall(callService)).toBeUndefined();
  });

  it('commits once on the trailing click after a drag', async () => {
    const { el, slider, callService } = await mountSlider();
    slider.dispatchEvent(down(20));
    slider.dispatchEvent(move(80));
    slider.dispatchEvent(up(80));
    slider.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, clientX: 80 }));
    await el.updateComplete;
    // Released 80% along the track = 80% covered = position 20. The write stays
    // in the integration's frame.
    expect(posCall(callService)).toEqual([
      INTEGRATION_DOMAIN,
      'set_axes',
      { axes: { position: 20 } },
      { entity_id: 'cover.left' },
    ]);
  });

  it('does not open the more-info dialog when the gesture lands on the slider', async () => {
    const { el, slider } = await mountSlider();
    slider.dispatchEvent(down(20));
    slider.dispatchEvent(move(80));
    slider.dispatchEvent(up(80));
    slider.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, clientX: 80 }));
    await el.updateComplete;
    // The tile's tap target must stay shielded, exactly as .controls is.
    expect((el as unknown as { _dialogOpen: boolean })._dialogOpen).toBe(false);
  });

  it('discards the drag on pointercancel without committing', async () => {
    const { el, slider, callService } = await mountSlider();
    slider.dispatchEvent(down(20));
    slider.dispatchEvent(move(80));
    slider.dispatchEvent(
      new PointerEvent('pointercancel', { bubbles: true, composed: true, pointerId: 1 }),
    );
    await el.updateComplete;
    expect(posCall(callService)).toBeUndefined();
    // Back to server truth: 60% open draws as 40% blocking.
    expect(fillWidth(el)).toContain('width:40%');
  });

  // Keys step the DRAWN value so the fill moves the way the key points; on a
  // blind that means a rightward key raises coverage, i.e. lowers the position.
  // Home/End name the ends of the track, not of the axis.
  it.each([
    ['ArrowRight', 59],
    ['ArrowLeft', 61],
    ['PageUp', 50],
    ['PageDown', 70],
    ['Home', 100],
    ['End', 0],
  ])('commits %s from the keyboard as %i', async (key, expected) => {
    const { slider, callService } = await mountSlider();
    slider.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, composed: true, key }));
    expect(posCall(callService)?.[2]).toEqual({ axes: { position: expected } });
  });

  it('ignores unrelated keys', async () => {
    const { slider, callService } = await mountSlider();
    slider.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, composed: true, key: 'Enter' }),
    );
    expect(posCall(callService)).toBeUndefined();
  });

  it('suppresses the width transition only while dragging', async () => {
    const { el, slider } = await mountSlider();
    expect(slider.classList.contains('dragging')).toBe(false);
    slider.dispatchEvent(down(20));
    await el.updateComplete;
    expect(slider.classList.contains('dragging')).toBe(true);
    slider.dispatchEvent(up(20));
    await el.updateComplete;
    expect(slider.classList.contains('dragging')).toBe(false);
  });

  it('declares an expanded touch target and owns the touch gesture', () => {
    const css = tileCss();
    expect(css).toContain('touch-action: none');
    // The 6px rail is too thin to grab; an invisible ::before widens the hit
    // area without adding layout height.
    expect(css).toContain('.pos-slider::before');
    expect(css).toContain('.pos-slider.dragging');
  });

  it('writes in the same logical frame it renders on an inverse_state cover (#234)', async () => {
    // The bar reads logical-frame actuals post-#234 and set_axes takes logical
    // values, so dragging to 30% must send 30 — not the cover-frame mirror.
    const callService = vi.fn();
    const h = inverseHass();
    (h as unknown as { callService: unknown }).callService = callService;
    (h as unknown as { services: unknown }).services = {
      adaptive_cover_pro: { set_axes: {}, set_position: {} },
    };
    const el = await mountInverse(h);
    const slider = el.shadowRoot!.querySelector('.pos-slider') as HTMLElement;
    Object.defineProperty(slider, 'getBoundingClientRect', {
      value: () => RECT,
      configurable: true,
    });
    slider.dispatchEvent(down(30));
    slider.dispatchEvent(up(30));
    slider.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, clientX: 30 }));
    await el.updateComplete;
    expect(posCall(callService)?.[2]).toEqual({ axes: { position: 30 } });
  });

  it('renders no slider when the position bar is turned off', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, show_position_bar: false },
      makeHass({ coverLeftCurrentPosition: 60 }),
    );
    expect(el.shadowRoot!.querySelector('.pos-slider')).toBeFalsy();
  });
});

// ── inverse_tilt frame normalization (#236) ──────────────────────────────────

const TILT_INVERSE_REGISTRY: EntityRegistryEntry[] = [
  ...REGISTRY,
  {
    entity_id: 'sensor.cover_tilt',
    unique_id: `${ENTRY}_Cover_Tilt`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'sensor.control_status',
    unique_id: `${ENTRY}_control_status`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
];

/**
 * A venetian on an `inverse_tilt` install: only the tilt axis carries
 * `inverted: true`, so the cover reports `current_tilt_position: 65` for slats
 * at logical 35 while `current_position` stays in the logical frame.
 */
function inverseTiltHass(
  overrides: Partial<{
    callService: (...args: unknown[]) => unknown;
    coverLeftState: string;
    modernServices: boolean;
  }> = {},
): HomeAssistant {
  const h = makeHass({
    callService: overrides.callService,
    coverLeftState: overrides.coverLeftState,
    coverLeftCurrentPosition: 42,
  });
  h.states['sensor.cover_tilt'] = { state: '70', attributes: {} } as never;
  (h.states['cover.left'].attributes as Record<string, unknown>).current_tilt_position = 65;
  h.states['sensor.control_status'] = {
    state: 'auto',
    attributes: {
      cover_type: 'cover_venetian',
      cover_discovery: {
        cover_type: 'cover_venetian',
        axes: [
          {
            id: 'position',
            label: 'Position',
            state_attr: 'current_position',
            supported: true,
            inverted: false,
          },
          {
            id: 'tilt',
            label: 'Tilt',
            state_attr: 'current_tilt_position',
            supported: true,
            inverted: true,
          },
        ],
      },
    },
  } as never;
  if (overrides.modernServices) {
    (h as unknown as { services: unknown }).services = {
      adaptive_cover_pro: { set_axes: {}, set_position: {}, set_tilt: {} },
    };
  }
  (h as unknown as { callWS: unknown }).callWS = vi.fn().mockResolvedValue(TILT_INVERSE_REGISTRY);
  return h;
}

async function mountInverseTilt(hass: HomeAssistant): Promise<CardLike> {
  const el = makeCard();
  el.setConfig({ type: TYPE, entry_id: ENTRY });
  el.hass = hass;
  document.body.appendChild(el);
  el._registry = TILT_INVERSE_REGISTRY;
  await el.updateComplete;
  return el;
}

describe('adaptive-cover-pro-tile-card — inverse_tilt frame normalization (#236)', () => {
  const tiltBarOf = (el: CardLike) =>
    el.shadowRoot!.querySelector('acp-tilt-bar') as HTMLElement & {
      actual: number | null;
      target: number | null;
    };

  it('feeds the mini tilt bar the logical value, not the cover-frame attribute', async () => {
    const el = await mountInverseTilt(inverseTiltHass());
    const tilt = tiltBarOf(el);
    expect(tilt).not.toBeNull();
    expect(tilt.actual).toBe(35);
    expect(tilt.target).toBe(70);
  });

  // The `noLiveData` gate runs BEFORE `_liveAxis`, so a suppressed read must
  // stay null — never `100 − null` (issues #212 / #232 / #239).
  it.each(['unavailable', 'unknown'])(
    'keeps the suppressed tilt read null on a %s cover',
    async (coverLeftState) => {
      const el = await mountInverseTilt(inverseTiltHass({ coverLeftState }));
      expect(tiltBarOf(el).actual).toBeNull();
    },
  );

  it('writes the un-inverted logical value — the integration applies _to_wire', async () => {
    const callService = vi.fn();
    const el = await mountInverseTilt(inverseTiltHass({ callService, modernServices: true }));
    tiltBarOf(el).dispatchEvent(new CustomEvent('acp-tilt-set', { detail: 80, bubbles: true }));
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      { axes: { tilt: 80 } },
      { entity_id: 'cover.left' },
    );
  });
});

// ── tilt-only cover type — louvered roof (#277) ──────────────────────────────

/** The reporter's entry: no `Cover_Tilt` sensor, because the integration only
 *  creates one where `exposes_dual_axis_sensor` is true (venetian / day-night
 *  shade). A louvered roof's slat target lives on `Cover_Position`. */
const LOUVERED_REGISTRY: EntityRegistryEntry[] = [
  ...REGISTRY,
  {
    entity_id: 'sensor.control_status',
    unique_id: `${ENTRY}_control_status`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
];

const SLATS = 'cover.pergola_slats';

/** `LouveredRoofPolicy.axes = (TILT_AXIS_PRIMARY,)` — one axis, and it is the
 *  slat axis. There is no position axis anywhere in the payload. */
const TILT_ONLY_AXES = [
  {
    id: 'tilt',
    label: 'Tilt',
    state_attr: 'current_tilt_position',
    supported: true,
    inverted: false,
  },
];

/** Every dual-axis policy declares `(POSITION_AXIS, TILT_AXIS)` in that order. */
const VENETIAN_AXES = [
  {
    id: 'position',
    label: 'Position',
    state_attr: 'current_position',
    supported: true,
    inverted: false,
  },
  {
    id: 'tilt',
    label: 'Tilt',
    state_attr: 'current_tilt_position',
    supported: true,
    inverted: false,
  },
];

/**
 * The field-reported shape: the cover reports `current_position: 0` (an axis
 * this entry does not drive) while the slats it DOES drive sit at 23, and the
 * entry's `Cover_Position` sensor carries the slat target (80).
 */
function louveredHass(
  opts: {
    tilt?: number;
    position?: number;
    coverType?: string;
    axes?: Record<string, unknown>[];
    callService?: (...args: unknown[]) => unknown;
  } = {},
): HomeAssistant {
  const tilt = opts.tilt ?? 23;
  const coverType = opts.coverType ?? 'cover_louvered_roof';
  const h = makeHass({
    callService: opts.callService,
    coverPositionSensorAttrs: { actual_positions: { [SLATS]: tilt } },
  });
  h.states['sensor.cover_position'].state = '80';
  h.states['sensor.control_status'] = {
    state: 'auto',
    attributes: {
      cover_type: coverType,
      cover_discovery: { cover_type: coverType, axes: opts.axes ?? TILT_ONLY_AXES },
    },
  } as never;
  h.states[SLATS] = {
    state: 'open',
    attributes: {
      friendly_name: 'Pergola Slats',
      device_class: 'blind',
      current_position: opts.position ?? 0,
      current_tilt_position: tilt,
    },
  } as never;
  (h as unknown as { services: unknown }).services = { adaptive_cover_pro: { set_axes: {} } };
  (h as unknown as { callWS: unknown }).callWS = vi.fn().mockResolvedValue(LOUVERED_REGISTRY);
  return h;
}

async function mountLouvered(
  hass: HomeAssistant,
  config: Partial<AdaptiveCoverProTileCardConfig> = {},
): Promise<CardLike> {
  const el = makeCard();
  el.setConfig({ type: TYPE, entry_id: ENTRY, ...config });
  el.hass = hass;
  document.body.appendChild(el);
  el._registry = LOUVERED_REGISTRY;
  await el.updateComplete;
  return el;
}

describe('adaptive-cover-pro-tile-card — tilt-only cover type (#277)', () => {
  const btn = (el: CardLike, cls: string): HTMLButtonElement =>
    el.shadowRoot!.querySelector(`button.${cls}`) as HTMLButtonElement;

  it('↑ dispatches set_axes {tilt: 100}, never {position: 100}', async () => {
    // `set_axes` validates every key against `policy.supported_axes(caps)` and
    // raises for an unsupported one, so a `{position: …}` payload here is not a
    // no-op — it is an error toast and a cover that never moves.
    const callService = vi.fn();
    const el = await mountLouvered(louveredHass({ callService }));
    btn(el, 'up').click();
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      { axes: { tilt: 100 } },
      { entity_id: SLATS },
    );
  });

  it('keeps ↓ live at current_position: 0 — at-closed gates on the slat axis', async () => {
    // The reporter's exact symptom: `current_position` is 0 for an axis the
    // entry does not have, so Close was greyed out on slats sitting at 23.
    const el = await mountLouvered(louveredHass());
    expect(btn(el, 'down').disabled).toBe(false);
    expect(btn(el, 'up').disabled).toBe(false);
  });

  it('renders no position rail for an entry with no position axis', async () => {
    const el = await mountLouvered(louveredHass());
    expect(el.shadowRoot!.querySelector('.pos-bar')).toBeNull();
  });

  it('renders no % readout, but keeps the entity state text', async () => {
    // `stateText` is the cover's own HA state, not a card-fabricated number —
    // "Open" for a pergola with slats at 23% is true and useful. Only the `%`
    // half describes an axis the entry does not have.
    const el = await mountLouvered(louveredHass());
    const readout = el.shadowRoot!.querySelector('.state')?.textContent?.trim();
    expect(readout).toBe('Open');
    expect(readout).not.toContain('0%');
  });

  it('hands the slat bar its target from the Cover_Position sensor', async () => {
    const el = await mountLouvered(louveredHass());
    const tiltBar = el.shadowRoot!.querySelector('acp-tilt-bar') as HTMLElement & {
      actual: number | null;
      target: number | null;
    };
    expect(tiltBar).not.toBeNull();
    expect(tiltBar.actual).toBe(23);
    expect(tiltBar.target).toBe(80);
  });

  it('does not force the fully-closed icon variant from a position the entry does not have', async () => {
    const el = await mountLouvered(louveredHass());
    const icon = el.shadowRoot!.querySelector('ha-icon.cover-icon') as HTMLElement;
    expect(icon).not.toBeNull();
    // device_class `blind`: a live 0 picks `closed`, no live value picks
    // `partial`. The tile must not paint "fully closed" off a phantom axis.
    expect(icon.getAttribute('icon')).not.toBe('mdi:blinds-horizontal-closed');
    expect(icon.getAttribute('icon')).toBe('mdi:blinds-horizontal');
  });

  // ── pins: green before and after, so the fix cannot overshoot ──────────────

  it('disables ↓ only when the slat axis itself is at its minimum', async () => {
    const el = await mountLouvered(louveredHass({ tilt: 0 }));
    expect(btn(el, 'down').disabled).toBe(true);
    expect(btn(el, 'up').disabled).toBe(false);
  });

  it('a dual-axis (venetian) entry still defaults ↑/↓ to {position: …}', async () => {
    // The hazard the old `axes[0]` revert was about. A venetian declares
    // position FIRST, so the leading-axis default resolves to it unchanged.
    const callService = vi.fn();
    const el = await mountLouvered(
      louveredHass({ callService, coverType: 'cover_venetian', axes: VENETIAN_AXES, position: 60 }),
    );
    btn(el, 'down').click();
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      { axes: { position: 0 } },
      { entity_id: SLATS },
    );
  });

  it('controls_axis: "tilt" explicitly retargets ↑/↓ on a dual-axis entry', async () => {
    const callService = vi.fn();
    const el = await mountLouvered(
      louveredHass({ callService, coverType: 'cover_venetian', axes: VENETIAN_AXES, position: 60 }),
      { controls_axis: 'tilt' },
    );
    btn(el, 'down').click();
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      { axes: { tilt: 0 } },
      { entity_id: SLATS },
    );
  });

  // ── audit follow-ups ──────────────────────────────────────────────────────

  const slatBar = (
    el: CardLike,
  ): HTMLElement & { target: number | null; movingTo: number | null } =>
    el.shadowRoot!.querySelector('acp-tilt-bar') as HTMLElement & {
      target: number | null;
      movingTo: number | null;
    };

  it('prefers linear_position over the raw sensor state for the slat target (#219)', async () => {
    // The leading axis's target sensor IS `Cover_Position`, so it takes the same
    // read the tile's own position rail takes off that sensor — the
    // pre-interpolation logical value, not the value dispatched to the motor.
    const hass = louveredHass();
    (hass.states['sensor.cover_position'].attributes as Record<string, unknown>).linear_position =
      74;
    const el = await mountLouvered(hass);
    expect(slatBar(el).target).toBe(74);
  });

  it('arms the slat bar’s moving-to indicator when ↓ drives the leading axis', async () => {
    // The ↑/↓ buttons drive the leading axis straight to its max/min without
    // going near the bar, so the bar cannot arm its own indicator — the tile
    // has to hand it the destination or a tilt-only entry gets no feedback at
    // all from a button press.
    const el = await mountLouvered(louveredHass());
    expect(slatBar(el).movingTo).toBeNull();
    btn(el, 'down').click();
    await el.updateComplete;
    expect(slatBar(el).movingTo).toBe(0);
  });

  it('leaves the moving-to hint alone when the slat bar itself commanded the move', async () => {
    // A venetian's secondary axis is driven THROUGH `acp-axis-bar`, which arms
    // its own indicator; a second host-owned band for the same command would be
    // two answers to one question.
    const el = await mountLouvered(
      louveredHass({ coverType: 'cover_venetian', axes: VENETIAN_AXES, position: 60 }),
    );
    const bar = slatBar(el);
    bar.dispatchEvent(new CustomEvent('acp-tilt-set', { detail: 80, bubbles: true }));
    await el.updateComplete;
    expect(bar.movingTo).toBeNull();
  });

  it('a dual-axis ↓ still arms the POSITION rail, not the slat bar', async () => {
    const el = await mountLouvered(
      louveredHass({ coverType: 'cover_venetian', axes: VENETIAN_AXES, position: 60 }),
    );
    btn(el, 'down').click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.pos-pending')).not.toBeNull();
    expect(slatBar(el).movingTo).toBeNull();
  });
});

describe('adaptive-cover-pro-tile-card — composite name (#247)', () => {
  // Same REGISTRY as the rest of this file, but with device_id set so the
  // area/entry-title lookups below have a device to resolve against.
  const AREA_REGISTRY: EntityRegistryEntry[] = REGISTRY.map((r) => ({
    ...r,
    device_id: 'device_living',
  }));

  function makeAreaHass(withArea: boolean): HomeAssistant {
    const hass = makeHass();
    (hass as unknown as { devices?: unknown }).devices = {
      device_living: {
        id: 'device_living',
        name: 'Blind',
        config_entries: [ENTRY],
        ...(withArea ? { area_id: 'area_living' } : {}),
      },
    };
    if (withArea) {
      (hass as unknown as { areas?: unknown }).areas = {
        area_living: { area_id: 'area_living', name: 'Living Room' },
      };
    }
    return hass;
  }

  async function mountWithAreaRegistry(
    config: AdaptiveCoverProTileCardConfig,
    hass: HomeAssistant,
  ): Promise<CardLike> {
    const el = makeCard();
    el.setConfig(config);
    el.hass = hass;
    document.body.appendChild(el);
    el._registry = AREA_REGISTRY;
    await el.updateComplete;
    return el;
  }

  it('renders "<Area> <Entry title>" when the device has an area', async () => {
    const el = await mountWithAreaRegistry(
      {
        type: TYPE,
        entry_id: ENTRY,
        layout: 'detailed',
        name: [{ type: 'area' }, { type: 'entry' }],
      },
      makeAreaHass(true),
    );
    const title = el.shadowRoot!.querySelector('.title');
    expect(title!.textContent?.trim()).toBe('Living Room Blind');
  });

  it('falls back to just the entry title (no stray leading space) when the device has no area', async () => {
    const el = await mountWithAreaRegistry(
      {
        type: TYPE,
        entry_id: ENTRY,
        layout: 'detailed',
        name: [{ type: 'area' }, { type: 'entry' }],
      },
      makeAreaHass(false),
    );
    const title = el.shadowRoot!.querySelector('.title');
    expect(title!.textContent?.trim()).toBe('Blind');
  });

  it('renders a literal text part verbatim', async () => {
    const el = await mountWithAreaRegistry(
      {
        type: TYPE,
        entry_id: ENTRY,
        layout: 'detailed',
        name: [{ type: 'text', text: 'Custom' }],
      },
      makeAreaHass(true),
    );
    const title = el.shadowRoot!.querySelector('.title');
    expect(title!.textContent?.trim()).toBe('Custom');
  });

  it('renders discovered.entry_title unchanged when name is omitted (regression guard)', async () => {
    const el = await mountWithAreaRegistry(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed' },
      makeAreaHass(true),
    );
    const title = el.shadowRoot!.querySelector('.title');
    expect(title!.textContent?.trim()).toBe('Blind');
  });

  it('keeps a plain-string name working byte-identically (backward compatibility)', async () => {
    const el = await mountWithAreaRegistry(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed', name: 'Centre Gauche' },
      makeAreaHass(true),
    );
    const title = el.shadowRoot!.querySelector('.title');
    expect(title!.textContent?.trim()).toBe('Centre Gauche');
  });

  // Audit finding #1 (issue #247 fix pass): a YAML `name:` with no value
  // parses to `null` — must render the entry title, not hard-error the tile.
  it('renders the entry title when name is null (templated-dashboard empty variable)', async () => {
    const el = await mountWithAreaRegistry(
      {
        type: TYPE,
        entry_id: ENTRY,
        layout: 'detailed',
        name: null as unknown as AdaptiveCoverProTileCardConfig['name'],
      },
      makeAreaHass(true),
    );
    const title = el.shadowRoot!.querySelector('.title');
    expect(title!.textContent?.trim()).toBe('Blind');
  });

  // The subtle case: `0` and `false` are falsy but valid literal values
  // pre-#247 (`0 ?? x` is `0`) — must render the literal, not fall back.
  it('renders "0" verbatim when name is 0, not the entry title', async () => {
    const el = await mountWithAreaRegistry(
      {
        type: TYPE,
        entry_id: ENTRY,
        layout: 'detailed',
        name: 0 as unknown as AdaptiveCoverProTileCardConfig['name'],
      },
      makeAreaHass(true),
    );
    const title = el.shadowRoot!.querySelector('.title');
    expect(title!.textContent?.trim()).toBe('0');
  });

  it('renders "false" verbatim when name is false, not the entry title', async () => {
    const el = await mountWithAreaRegistry(
      {
        type: TYPE,
        entry_id: ENTRY,
        layout: 'detailed',
        name: false as unknown as AdaptiveCoverProTileCardConfig['name'],
      },
      makeAreaHass(true),
    );
    const title = el.shadowRoot!.querySelector('.title');
    expect(title!.textContent?.trim()).toBe('false');
  });

  it('falls back to the entry title when name is an empty array', async () => {
    const el = await mountWithAreaRegistry(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed', name: [] },
      makeAreaHass(true),
    );
    const title = el.shadowRoot!.querySelector('.title');
    expect(title!.textContent?.trim()).toBe('Blind');
  });
});

// Icon tap behavior (Interactions section). HA draws the tinted pill behind a
// tile glyph only when the icon is interactive, and its
// getEntityDefaultTileIconAction returns "none" for the cover domain — so the
// shape is opt-in here and an upgraded tile must look untouched.
describe('adaptive-cover-pro-tile-card — icon_tap_action', () => {
  it('leaves the glyph bare when icon_tap_action is unset (HA cover default)', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY, layout: 'detailed' }, makeHass({}));
    const wrap = el.shadowRoot!.querySelector('.cover-icon-wrap')!;
    expect(wrap.classList.contains('background')).toBe(false);
    expect(wrap.getAttribute('role')).toBeNull();
    expect(wrap.getAttribute('tabindex')).toBeNull();
  });

  it('leaves the glyph bare when icon_tap_action is explicitly none', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed', icon_tap_action: { action: 'none' } },
      makeHass({}),
    );
    const wrap = el.shadowRoot!.querySelector('.cover-icon-wrap')!;
    expect(wrap.classList.contains('background')).toBe(false);
  });

  it('draws the shape and makes the glyph a button when an action is set', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed', icon_tap_action: { action: 'more-info' } },
      makeHass({}),
    );
    const wrap = el.shadowRoot!.querySelector('.cover-icon-wrap')!;
    expect(wrap.classList.contains('background')).toBe(true);
    expect(wrap.getAttribute('role')).toBe('button');
    expect(wrap.getAttribute('tabindex')).toBe('0');
  });

  it('carries the state color into the shape so tint and glyph agree', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed', icon_tap_action: { action: 'more-info' } },
      makeHass({}),
    );
    const wrap = el.shadowRoot!.querySelector('.cover-icon-wrap') as HTMLElement;
    expect(wrap.getAttribute('style')).toContain('--acp-tile-icon-color');
  });

  it('does not fire the tile body tap when the glyph is tapped', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed', icon_tap_action: { action: 'more-info' } },
      makeHass({}),
    );
    const bodyTap = vi.fn();
    el.addEventListener('acp-tile-tap', bodyTap);
    const wrap = el.shadowRoot!.querySelector('.cover-icon-wrap') as HTMLElement;
    wrap.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(bodyTap).not.toHaveBeenCalled();
  });

  it('still opens the ACP dialog when the body is tapped, shape or not', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, layout: 'detailed', icon_tap_action: { action: 'more-info' } },
      makeHass({}),
    );
    const bodyTap = vi.fn();
    el.addEventListener('acp-tile-tap', bodyTap);
    const body = el.shadowRoot!.querySelector('.tile-body') as HTMLElement;
    body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(bodyTap).toHaveBeenCalled();
  });

  it('ignores clicks on the bare glyph when no icon action is configured', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY, layout: 'detailed' }, makeHass({}));
    const bodyTap = vi.fn();
    el.addEventListener('acp-tile-tap', bodyTap);
    const wrap = el.shadowRoot!.querySelector('.cover-icon-wrap') as HTMLElement;
    // No stopPropagation happens when inert, so the body handler still runs —
    // the glyph is simply not a separate target.
    wrap.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(bodyTap).toHaveBeenCalled();
  });

  it('exposes the pill and 0.2 tint in the stylesheet', () => {
    const css = tileCss();
    expect(css).toContain('border-radius: var(--ha-border-radius-pill, 9999px)');
    expect(css).toContain('opacity: 0.2');
    expect(css).toContain('opacity: 0.35');
  });

  it('fires hass.callService when icon_tap_action uses call-service syntax', async () => {
    const callService = vi.fn();
    const el = await mount(
      {
        type: TYPE,
        entry_id: ENTRY,
        layout: 'detailed',
        icon_tap_action: {
          action: 'call-service',
          service: 'cover.open_cover',
          service_data: { entity_id: 'cover.left' },
        },
      },
      makeHass({ callService }),
    );
    const wrap = el.shadowRoot!.querySelector('.cover-icon-wrap') as HTMLElement;
    wrap.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(callService).toHaveBeenCalledWith(
      'cover',
      'open_cover',
      { entity_id: 'cover.left' },
      undefined,
    );
  });

  // #281: icon_tap_action goes through the same setConfig-time normalization
  // as the other three action-config options — see the perform-action tests
  // in the "hold / double-tap actions" describe block above for context.
  it('fires hass.callService when icon_tap_action uses perform-action syntax (#281)', async () => {
    const callService = vi.fn();
    const el = await mount(
      {
        type: TYPE,
        entry_id: ENTRY,
        layout: 'detailed',
        icon_tap_action: {
          action: 'perform-action',
          perform_action: 'cover.open_cover',
          data: { entity_id: 'cover.left' },
        } as unknown as AdaptiveCoverProTileCardConfig['icon_tap_action'],
      },
      makeHass({ callService }),
    );
    const wrap = el.shadowRoot!.querySelector('.cover-icon-wrap') as HTMLElement;
    wrap.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(callService).toHaveBeenCalledWith(
      'cover',
      'open_cover',
      { entity_id: 'cover.left' },
      undefined,
    );
  });
});

// ── one rail per managed cover ───────────────────────────────────────────────
// An entry that binds several covers (a day/night shade in the integration's
// `dual_entity` model binds a bottom and a middle rail) previously rendered only
// `managed_covers[0]`, leaving every other cover with no readout and no control
// anywhere on the tile.

describe('adaptive-cover-pro-tile-card — multi-cover rails', () => {
  /** Two managed covers, each reporting its own position, plus a per-entity
   *  command target for the second one. */
  function twoRailHass(overrides: Record<string, unknown> = {}): HomeAssistant {
    const h = makeHass() as unknown as { states: Record<string, unknown> };
    h.states['sensor.cover_position'] = {
      state: '42',
      attributes: { actual_positions: { 'cover.left': 60, 'cover.right': 25 } },
    };
    h.states['cover.left'] = {
      state: 'open',
      attributes: { friendly_name: 'Living Room bottom rail', current_position: 60 },
    };
    h.states['cover.right'] = {
      state: 'open',
      attributes: { friendly_name: 'Living Room middle rail', current_position: 25 },
    };
    h.states['sensor.position_verification'] = {
      state: 'ok',
      attributes: { per_entity: { 'cover.right': { target: 30 } } },
    };
    Object.assign(h.states, overrides);
    return h as unknown as HomeAssistant;
  }

  const REG = [
    ...REGISTRY,
    {
      entity_id: 'sensor.position_verification',
      unique_id: `${ENTRY}_position_verification`,
      config_entry_id: ENTRY,
      platform: 'adaptive_cover_pro',
      device_id: null,
    },
  ];

  async function mountRails(
    config: Partial<AdaptiveCoverProTileCardConfig> = {},
    hass = twoRailHass(),
  ): Promise<CardLike> {
    const el = makeCard();
    el.setConfig({ type: TYPE, entry_id: ENTRY, ...config } as AdaptiveCoverProTileCardConfig);
    el.hass = hass;
    document.body.appendChild(el);
    el._registry = REG;
    await el.updateComplete;
    return el;
  }

  function rails(el: CardLike): HTMLElement[] {
    return Array.from(el.shadowRoot!.querySelectorAll('.pos-stack .pos-row')) as HTMLElement[];
  }

  it('renders one rail per managed cover, in the integration’s order', async () => {
    const el = await mountRails();
    expect(rails(el).length).toBe(2);
  });

  it('draws each rail from its OWN cover, not the resolved one', async () => {
    const el = await mountRails();
    const fills = el.shadowRoot!.querySelectorAll('.pos-stack .pos-fill');
    // Blind polarity: 60 open → 40 blocking, 25 open → 75 blocking.
    expect(fills[0].getAttribute('style')).toContain('width:40%');
    expect(fills[1].getAttribute('style')).toContain('width:75%');
  });

  it('labels each rail with its cover glyph and keeps the name as a tooltip', async () => {
    const el = await mountRails();
    const glyphs = el.shadowRoot!.querySelectorAll('.pos-stack .pos-glyph');
    expect(glyphs.length).toBe(2);
    // The entry title is stripped off the friendly name, so two rails of one
    // shade read as "bottom rail" / "middle rail" rather than repeating it.
    expect(glyphs[0].getAttribute('data-tooltip')).toContain('bottom rail');
    expect(glyphs[1].getAttribute('data-tooltip')).toContain('middle rail');
  });

  it('names each slider for its own rail so they are distinguishable', async () => {
    const el = await mountRails();
    const sliders = el.shadowRoot!.querySelectorAll('.pos-stack .pos-slider');
    expect(sliders[0].getAttribute('aria-label')).toContain('bottom rail');
    expect(sliders[1].getAttribute('aria-label')).toContain('middle rail');
  });

  it('drags one rail without moving the other', async () => {
    const el = await mountRails();
    const sliders = el.shadowRoot!.querySelectorAll('.pos-stack .pos-slider');
    const first = sliders[0] as HTMLElement;
    Object.defineProperty(first, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100, top: 0, bottom: 6, right: 100, height: 6 }),
      configurable: true,
    });
    first.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, composed: true, clientX: 90, pointerId: 1 }),
    );
    await el.updateComplete;
    const fills = el.shadowRoot!.querySelectorAll('.pos-stack .pos-fill');
    // A single shared drag state used to paint both rails from whichever one
    // had the finger on it.
    expect(fills[0].getAttribute('style')).toContain('width:90%');
    expect(fills[1].getAttribute('style')).toContain('width:75%');
  });

  it('commits a drag to the rail that was dragged', async () => {
    const callService = vi.fn();
    const hass = twoRailHass();
    (hass as unknown as { callService: unknown }).callService = callService;
    (hass as unknown as { services: unknown }).services = {
      adaptive_cover_pro: { set_axes: {} },
    };
    const el = await mountRails({}, hass);
    const second = el.shadowRoot!.querySelectorAll('.pos-stack .pos-slider')[1] as HTMLElement;
    Object.defineProperty(second, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100, top: 0, bottom: 6, right: 100, height: 6 }),
      configurable: true,
    });
    second.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, clientX: 80 }));
    await el.updateComplete;
    // 80% along a coverage track = position 20, written to the SECOND cover.
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      { axes: { position: 20 } },
      { entity_id: 'cover.right' },
    );
  });

  it('ticks the resolved rail from the pipeline target and the rest per-entity', async () => {
    const el = await mountRails();
    const markers = el.shadowRoot!.querySelectorAll('.pos-stack .pos-marker');
    // Resolved cover keeps the entry target (42 → 58 drawn); the second rail
    // takes its own dispatched value (30 → 70 drawn), which is on a different
    // scale precisely because it is a remap.
    expect(markers[0].getAttribute('style')).toContain('58%');
    expect(markers[1].getAttribute('style')).toContain('70%');
  });

  it('leaves a non-resolved rail tickless when the integration publishes no per-entity target', async () => {
    const hass = twoRailHass();
    delete (hass as unknown as { states: Record<string, unknown> }).states[
      'sensor.position_verification'
    ];
    const el = await mountRails({}, hass);
    const railEls = rails(el);
    // Better tickless than borrowing the entry target, which is on the wrong
    // scale for this rail.
    expect(railEls[1].querySelector('.pos-marker')).toBeNull();
    expect(railEls[0].querySelector('.pos-marker')).not.toBeNull();
  });

  it('collapses to a single rail when the tile is pinned with `cover`', async () => {
    const el = await mountRails({ cover: 'cover.right' });
    expect(el.shadowRoot!.querySelector('.pos-stack')).toBeNull();
    const fill = el.shadowRoot!.querySelector('.pos-fill') as HTMLElement;
    // The single-rail branch must read the PINNED cover, not the resolved one.
    expect(fill.getAttribute('style')).toContain('width:75%');
  });

  it('orders and filters the rails from `covers`', async () => {
    const el = await mountRails({ covers: ['cover.right', 'cover.left'] });
    const glyphs = el.shadowRoot!.querySelectorAll('.pos-stack .pos-glyph');
    expect(glyphs[0].getAttribute('data-tooltip')).toContain('middle rail');
    expect(glyphs[1].getAttribute('data-tooltip')).toContain('bottom rail');
  });

  it('drops ids the entry does not manage', async () => {
    const el = await mountRails({ covers: ['cover.right', 'cover.gone'] });
    expect(el.shadowRoot!.querySelector('.pos-stack')).toBeNull();
    expect(el.shadowRoot!.querySelector('.pos-fill')).not.toBeNull();
  });

  it('falls back to every rail when `covers` matches nothing at all', async () => {
    // Every listed cover renamed or removed from the entry. Rendering no bar
    // would be unrecoverable: the editor hides its repair widget below two
    // managed covers, leaving only YAML.
    const el = await mountRails({ covers: ['cover.gone', 'cover.also_gone'] });
    expect(rails(el).length).toBe(2);
  });
});

// ── retargetable ↑■↓ ─────────────────────────────────────────────────────────

describe('adaptive-cover-pro-tile-card — controls_cover / controls_axis', () => {
  function hassFor(callService: ReturnType<typeof vi.fn>): HomeAssistant {
    const h = makeHass({
      callService: callService as unknown as (...args: unknown[]) => unknown,
    }) as unknown as {
      states: Record<string, unknown>;
      services?: unknown;
    };
    h.states['cover.left'] = {
      state: 'open',
      attributes: { friendly_name: 'Bottom', current_position: 60 },
    };
    h.states['cover.right'] = {
      state: 'open',
      attributes: { friendly_name: 'Middle', current_position: 100 },
    };
    h.services = { adaptive_cover_pro: { set_axes: {} } };
    return h as unknown as HomeAssistant;
  }

  it('drives the resolved cover by default', async () => {
    const callService = vi.fn();
    const el = await mount({ type: TYPE, entry_id: ENTRY }, hassFor(callService));
    (el.shadowRoot!.querySelector('button.down') as HTMLButtonElement).click();
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      { axes: { position: 0 } },
      { entity_id: 'cover.left' },
    );
  });

  it('retargets to the named cover', async () => {
    const callService = vi.fn();
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, controls_cover: 'cover.right' },
      hassFor(callService),
    );
    (el.shadowRoot!.querySelector('button.down') as HTMLButtonElement).click();
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      { axes: { position: 0 } },
      { entity_id: 'cover.right' },
    );
  });

  it('gates at-open/at-closed on the retargeted cover, not the resolved one', async () => {
    // `cover.right` is fully open, `cover.left` is at 60.
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, controls_cover: 'cover.right' },
      hassFor(vi.fn()),
    );
    expect((el.shadowRoot!.querySelector('button.up') as HTMLButtonElement).disabled).toBe(true);
    expect((el.shadowRoot!.querySelector('button.down') as HTMLButtonElement).disabled).toBe(false);
  });

  it('ignores a controls_cover the entry does not manage', async () => {
    // Unvalidated, this would fire set_axes at a cover in another config entry —
    // the integration resolves the entity id, so it would physically move.
    const callService = vi.fn();
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, controls_cover: 'cover.someone_elses' },
      hassFor(callService),
    );
    (el.shadowRoot!.querySelector('button.down') as HTMLButtonElement).click();
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_axes',
      { axes: { position: 0 } },
      { entity_id: 'cover.left' },
    );
  });
});

// ── Bar-only layout, rail geometry, battery + rail chrome (#260) ─────────────

describe('tile card — bar-only layout (#260)', () => {
  // The overlap fix: the bar-only grid special-case was deleted outright, so a
  // bar-only tile uses the same `.has-chrome-row` grid as a badged one. The old
  // rule spanned `.label` across both rows in the same column as `.chrome-line`,
  // and `.tile-body`'s `align-items: center` then centered the label on top of
  // the bottom-aligned bar. happy-dom does no layout, so the stylesheet text is
  // the only assertable trace of the mechanism being gone.
  const css = (): string => AdaptiveCoverProTileCard.styles.toString();

  it('no longer spans the bar-only label across both grid rows', () => {
    expect(css()).not.toContain('grid-row: 1 / -1');
  });

  it('has no bar-only grid override left at any breakpoint', () => {
    expect(css()).not.toContain('.tile-body.detailed.bar-only');
  });

  it('still emits the bar-only class as a styling/test hook', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, show_badge: false },
      makeHass({ coverLeftCurrentPosition: 60 }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    expect(body.classList.contains('bar-only')).toBe(true);
  });

  // The regression guard flagged during investigation: ~15 rules are scoped
  // `.chrome-line .pos-*`, so the bar markup must stay under `.chrome-line`.
  it('keeps .chrome-line as the bar’s wrapper, as a sibling of .label', async () => {
    for (const showBadge of [true, false]) {
      const el = await mount(
        { type: TYPE, entry_id: ENTRY, show_badge: showBadge },
        makeHass({ coverLeftCurrentPosition: 60 }),
      );
      const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
      expect(body.querySelector('.chrome-line .pos-bar')).toBeTruthy();
      expect(body.querySelector('.label .chrome-line')).toBeFalsy();
    }
  });
});

describe('tile card — rail geometry (#260)', () => {
  const css = (): string => AdaptiveCoverProTileCard.styles.toString();

  // A lone rail and a stacked rail must be the same length. The stack is wider
  // than a lone rail by exactly the glyph lane, so the glyphs hang to its LEFT
  // instead of eating into the rails.
  it('derives the glyph lane from the glyph size and row gap rather than hardcoding it', () => {
    const text = css();
    expect(text).toContain(
      '--acp-rail-glyph-lane: calc(var(--acp-rail-glyph-size) + var(--acp-rail-glyph-gap))',
    );
    expect(text).toContain('calc(var(--acp-rail-basis) + var(--acp-rail-glyph-lane))');
  });

  it('sizes the glyph and the row gap from those same tokens, so the lane cannot drift', () => {
    const text = css();
    expect(text).toContain('width: var(--acp-rail-glyph-size)');
    expect(text).toContain('gap: var(--acp-rail-glyph-gap)');
  });

  it('renders a bare rail with no glyph for a single cover', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, covers: ['cover.left'] },
      makeHass({ coverLeftCurrentPosition: 60 }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    expect(body.querySelector('.pos-bar')).toBeTruthy();
    expect(body.querySelector('.pos-stack')).toBeFalsy();
    expect(body.querySelector('.pos-glyph')).toBeFalsy();
  });

  it('renders one glyph-led row per cover for a multi-cover entry', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftCurrentPosition: 60 }),
    );
    const body = el.shadowRoot!.querySelector('.tile-body.detailed')!;
    expect(body.querySelectorAll('.pos-stack .pos-row').length).toBe(2);
    expect(body.querySelectorAll('.pos-stack .pos-row .pos-glyph').length).toBe(2);
  });
});

describe('tile card — rail color is constant (#260)', () => {
  const css = (): string => AdaptiveCoverProTileCard.styles.toString();

  // A rail is a measurement, not a status light: it must not change hue as the
  // cover crosses open/closed, and on a multi-rail tile the rails must agree.
  it('paints the fill from the cover-active token, not the per-state one', () => {
    const text = css();
    expect(text).toContain('--acp-pos-fill-color');
    expect(text).toContain('var(--state-cover-active-color');
    expect(text).not.toContain('--state-cover-open-color');
  });

  it('never writes an inline background onto the fill', async () => {
    for (const coverLeftState of ['open', 'closed']) {
      const el = await mount(
        { type: TYPE, entry_id: ENTRY },
        makeHass({ coverLeftCurrentPosition: 60, coverLeftState }),
      );
      const fills = el.shadowRoot!.querySelectorAll('.pos-fill');
      expect(fills.length).toBeGreaterThan(0);
      for (const fill of fills) {
        expect(fill.getAttribute('style') ?? '').not.toContain('background');
      }
    }
  });
});

describe('tile card — low-battery overlay (#260)', () => {
  /** `hass.entities` is the display registry the battery lookup walks; the
   *  tile-card fixture has no reason to carry it otherwise. */
  function withBattery(
    hass: HomeAssistant,
    level: string | null,
    opts: { deviceClass?: string; entityId?: string } = {},
  ): HomeAssistant {
    const id = opts.entityId ?? 'sensor.left_battery';
    const h = hass as unknown as {
      states: Record<string, unknown>;
      entities?: Record<string, { device_id?: string | null }>;
    };
    if (level !== null) {
      h.states[id] = { state: level, attributes: { device_class: opts.deviceClass ?? 'battery' } };
    }
    h.entities = {
      'cover.left': { device_id: 'dev_left' },
      ...(level !== null ? { [id]: { device_id: 'dev_left' } } : {}),
    };
    return hass;
  }

  it('renders no overlay for a healthy battery', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, covers: ['cover.left'] },
      withBattery(makeHass({ coverLeftCurrentPosition: 60 }), '82'),
    );
    expect(el.shadowRoot!.querySelector('.battery-overlay')).toBeFalsy();
  });

  it('renders no overlay for a mains-powered cover with no battery entity', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, covers: ['cover.left'] },
      withBattery(makeHass({ coverLeftCurrentPosition: 60 }), null),
    );
    expect(el.shadowRoot!.querySelector('.battery-overlay')).toBeFalsy();
  });

  it('renders a level-appropriate overlay below the threshold', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, covers: ['cover.left'] },
      withBattery(makeHass({ coverLeftCurrentPosition: 60 }), '8'),
    );
    const overlay = el.shadowRoot!.querySelector('.battery-overlay')!;
    expect(overlay).toBeTruthy();
    expect(overlay.getAttribute('icon')).toBe('mdi:battery-outline');
  });

  // A battery sensor that has stopped reporting is exactly the warning case.
  it('renders the alert overlay for an unknown level', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, covers: ['cover.left'] },
      withBattery(makeHass({ coverLeftCurrentPosition: 60 }), 'unavailable'),
    );
    expect(el.shadowRoot!.querySelector('.battery-overlay')!.getAttribute('icon')).toBe(
      'mdi:battery-alert-variant-outline',
    );
  });

  // Z-Wave/ZHA ship a binary_sensor battery alongside the percentage sensor.
  it('ignores a binary_sensor battery instead of warning on its on/off state', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, covers: ['cover.left'] },
      withBattery(makeHass({ coverLeftCurrentPosition: 60 }), 'off', {
        entityId: 'binary_sensor.left_battery',
      }),
    );
    expect(el.shadowRoot!.querySelector('.battery-overlay')).toBeFalsy();
  });

  // Motion sits top-right, battery bottom-left, so both can show at once.
  it('pins the two icon overlays to opposite corners', () => {
    const text = AdaptiveCoverProTileCard.styles.toString();
    expect(text).toMatch(/\.motion-overlay\s*\{[^}]*top:\s*-4px;[^}]*right:\s*-6px/);
    expect(text).toMatch(/\.battery-overlay\s*\{[^}]*bottom:\s*-4px;[^}]*left:\s*-6px/);
  });
});

describe('tile card — drag position readout (#260)', () => {
  interface Draggable extends CardLike {
    _posDrag: { id: string; pct: number } | null;
  }

  it('shows no readout when idle', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, covers: ['cover.left'] },
      makeHass({ coverLeftCurrentPosition: 60 }),
    );
    expect(el.shadowRoot!.querySelector('.pos-readout')).toBeFalsy();
  });

  // The hover tooltip carries the same number, but a tooltip is mouse-only —
  // on a phone the finger setting the position also covers the rail.
  it('shows the live logical percentage on the dragged rail only', async () => {
    const el = (await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ coverLeftCurrentPosition: 60 }),
    )) as Draggable;
    el._posDrag = { id: 'cover.left', pct: 37 };
    await el.updateComplete;

    const readouts = el.shadowRoot!.querySelectorAll('.pos-readout');
    expect(readouts.length).toBe(1);
    expect(readouts[0].textContent!.trim()).toContain('37');
  });

  it('clears the readout when the drag ends', async () => {
    const el = (await mount(
      { type: TYPE, entry_id: ENTRY, covers: ['cover.left'] },
      makeHass({ coverLeftCurrentPosition: 60 }),
    )) as Draggable;
    el._posDrag = { id: 'cover.left', pct: 37 };
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.pos-readout')).toBeTruthy();

    el._posDrag = null;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.pos-readout')).toBeFalsy();
  });

  // .pos-bar is overflow:hidden to clip the fill, so the readout must not live
  // inside it, and it must never swallow the drag it reports on.
  it('sits outside the clipped bar and is pointer-transparent', async () => {
    const el = (await mount(
      { type: TYPE, entry_id: ENTRY, covers: ['cover.left'] },
      makeHass({ coverLeftCurrentPosition: 60 }),
    )) as Draggable;
    el._posDrag = { id: 'cover.left', pct: 37 };
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.pos-slider > .pos-readout')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.pos-bar .pos-readout')).toBeFalsy();
    expect(AdaptiveCoverProTileCard.styles.toString()).toMatch(
      /\.pos-readout\s*\{[^}]*pointer-events:\s*none/,
    );
  });
});

/**
 * Two-rail readout for a LAYERED entry (day/night + dual-panel shades).
 *
 * The single readout describes the resolved cover only, so a shade whose two
 * fabrics sit at different positions read exactly like one at a single
 * position. These pin both halves of the rule: the split appears when the
 * fabrics disagree, and does NOT appear when they agree or when the two rails
 * are separate windows rather than layers of one opening.
 */
const LAYERED_REGISTRY: EntityRegistryEntry[] = [
  ...REGISTRY,
  {
    entity_id: 'sensor.control_status',
    unique_id: `${ENTRY}_control_status`,
    config_entry_id: ENTRY,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
];

function layeredHass(opts: {
  leftState: string;
  leftPos: number;
  rightState: string;
  rightPos: number;
  coverType?: string;
}): HomeAssistant {
  const h = makeHass();
  const s = h.states as unknown as Record<string, unknown>;
  s['sensor.control_status'] = {
    state: 'auto',
    attributes: { cover_type: opts.coverType ?? 'cover_day_night_shade' },
  };
  s['sensor.cover_position'] = {
    state: String(opts.leftPos),
    attributes: { actual_positions: { 'cover.left': opts.leftPos, 'cover.right': opts.rightPos } },
  };
  s['cover.left'] = { state: opts.leftState, attributes: { current_position: opts.leftPos } };
  s['cover.right'] = { state: opts.rightState, attributes: { current_position: opts.rightPos } };
  return h;
}

async function mountLayered(hass: HomeAssistant): Promise<CardLike> {
  const el = makeCard();
  el.setConfig({ type: TYPE, entry_id: ENTRY, layout: 'detailed' });
  el.hass = hass;
  document.body.appendChild(el);
  el._registry = LAYERED_REGISTRY;
  await el.updateComplete;
  return el;
}

describe('tile readout — layered two-rail entries', () => {
  it('splits into per-rail state + position when the fabrics disagree', async () => {
    const el = await mountLayered(
      layeredHass({ leftState: 'open', leftPos: 100, rightState: 'closed', rightPos: 50 }),
    );
    expect(el.shadowRoot!.querySelector('.state')?.textContent?.trim()).toBe(
      'Open 100% · Closed 50%',
    );
  });

  it('keeps the single readout when the fabrics agree', async () => {
    const el = await mountLayered(
      layeredHass({ leftState: 'open', leftPos: 100, rightState: 'open', rightPos: 100 }),
    );
    expect(el.shadowRoot!.querySelector('.state')?.textContent?.trim()).toBe('Open · 100%');
  });

  it('leaves SEPARATE-cover entries alone even when their rails differ', async () => {
    // Two windows on one entry, not two layers of one opening. They disagree by
    // a couple of percent all the time; splitting the line there would be noise.
    const el = await mountLayered(
      layeredHass({
        leftState: 'open',
        leftPos: 42,
        rightState: 'open',
        rightPos: 45,
        coverType: 'cover_blind',
      }),
    );
    expect(el.shadowRoot!.querySelector('.state')?.textContent?.trim()).toBe('Open · 42%');
  });
});
