import { describe, it, expect, vi } from 'vitest';
import '../src/adaptive-cover-pro-tile-card';
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
];

function makeHass(
  overrides: Partial<{
    decisionState: string;
    coverPositionSensorAttrs: Record<string, unknown>;
    manualOverrideOn: boolean;
    decisionAttrs: Record<string, unknown>;
    callService: (...args: unknown[]) => unknown;
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
      'cover.left': { state: 'open', attributes: { friendly_name: 'Left blind' } },
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
  it('renders the discovered title and current position', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass());
    const root = el.shadowRoot!;
    // Position cell shows rounded percent of cover_position sensor state.
    expect(root.querySelector('.position')?.textContent?.trim()).toBe('42%');
  });

  it('renders the Auto badge by default and no inline Resume', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass({ decisionState: 'solar' }));
    const root = el.shadowRoot!;
    expect(root.querySelector('acp-tile-badge')).toBeTruthy();
    expect(root.querySelector('.resume')).toBeFalsy();
  });

  it('shows inline Resume when manual_override_binary is on', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ manualOverrideOn: true, decisionState: 'manual' }),
    );
    expect(el.shadowRoot!.querySelector('.resume')).toBeTruthy();
  });

  it('shows inline Resume when the winner is a custom_position slot', async () => {
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ decisionState: 'custom_position_1' }),
    );
    expect(el.shadowRoot!.querySelector('.resume')).toBeTruthy();
  });
});

describe('adaptive-cover-pro-tile-card service calls', () => {
  it('↑ calls cover.open_cover against the first managed cover', async () => {
    const callService = vi.fn();
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass({ callService }));
    (el.shadowRoot!.querySelector('button.up') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith('cover', 'open_cover', { entity_id: 'cover.left' });
  });

  it('■ calls cover.stop_cover', async () => {
    const callService = vi.fn();
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass({ callService }));
    (el.shadowRoot!.querySelector('button.stop') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith('cover', 'stop_cover', { entity_id: 'cover.left' });
  });

  it('↓ calls cover.close_cover', async () => {
    const callService = vi.fn();
    const el = await mount({ type: TYPE, entry_id: ENTRY }, makeHass({ callService }));
    (el.shadowRoot!.querySelector('button.down') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith('cover', 'close_cover', { entity_id: 'cover.left' });
  });

  it('uses config.cover override when provided', async () => {
    const callService = vi.fn();
    const el = await mount(
      { type: TYPE, entry_id: ENTRY, cover: 'cover.right' },
      makeHass({ callService }),
    );
    (el.shadowRoot!.querySelector('button.up') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith('cover', 'open_cover', { entity_id: 'cover.right' });
  });

  it('inline Resume calls button.press on reset_override_button', async () => {
    const callService = vi.fn();
    const el = await mount(
      { type: TYPE, entry_id: ENTRY },
      makeHass({ manualOverrideOn: true, callService }),
    );
    (el.shadowRoot!.querySelector('.resume') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith('button', 'press', {
      entity_id: 'button.reset_manual_override',
    });
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

  it('does not fire acp-tile-tap when tap_action is none', async () => {
    const el = await mount({ type: TYPE, entry_id: ENTRY, tap_action: 'none' }, makeHass());
    const listener = vi.fn();
    el.addEventListener('acp-tile-tap', listener);
    (el.shadowRoot!.querySelector('.tile-body') as HTMLElement).click();
    expect(listener).not.toHaveBeenCalled();
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
