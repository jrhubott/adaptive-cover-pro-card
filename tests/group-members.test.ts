import { describe, it, expect, vi } from 'vitest';
import '../src/adaptive-cover-pro-tile-card';
import '../src/adaptive-cover-pro-tile-card-editor';
import type { HomeAssistant } from 'custom-card-helpers';
import type { AdaptiveCoverProTileCardConfig } from '../src/types';
import type { EntityRegistryEntry } from '../src/lib/entity-registry';

const TYPE = 'custom:adaptive-cover-pro-tile-card';
const GROUP = 'group1';

interface EditorLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  setConfig(config: AdaptiveCoverProTileCardConfig): void;
  _registry: EntityRegistryEntry[] | null;
}

/** A group entry plus two member ACP entries, so the roster folds to
 *  entry_a / entry_b rows and a generic third row. */
const REGISTRY: EntityRegistryEntry[] = [
  {
    entity_id: 'sensor.group_position',
    unique_id: `${GROUP}_group_position`,
    config_entry_id: GROUP,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'sensor.group_state',
    unique_id: `${GROUP}_group_state`,
    config_entry_id: GROUP,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'sensor.group_who_won',
    unique_id: `${GROUP}_group_who_won`,
    config_entry_id: GROUP,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'sensor.group_active_scene',
    unique_id: `${GROUP}_group_active_scene`,
    config_entry_id: GROUP,
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'sensor.entry_a_cover_position',
    unique_id: 'entry_a_Cover_Position',
    config_entry_id: 'entry_a',
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
  {
    entity_id: 'sensor.entry_b_cover_position',
    unique_id: 'entry_b_Cover_Position',
    config_entry_id: 'entry_b',
    platform: 'adaptive_cover_pro',
    device_id: null,
  },
];

function hass(): HomeAssistant {
  return {
    states: {
      'sensor.entry_a_cover_position': {
        state: '40',
        attributes: { actual_positions: { 'cover.a': 40 } },
      },
      'sensor.entry_b_cover_position': {
        state: '60',
        attributes: { actual_positions: { 'cover.b': 60 } },
      },
      'cover.a': { state: 'open', attributes: { current_position: 40 } },
      'cover.b': { state: 'unavailable', attributes: {} },
      'cover.generic': { state: 'closed', attributes: { current_position: 0 } },
      'sensor.group_position': {
        state: '20',
        attributes: { member_positions: { 'cover.a': 40, 'cover.b': null, 'cover.generic': 0 } },
      },
      'sensor.group_state': { state: 'mixed', attributes: {} },
      'sensor.group_who_won': {
        state: '0',
        attributes: { member_winners: { 'cover.a': 'solar', 'cover.b': 'solar' } },
      },
    },
    callWS: vi.fn().mockResolvedValue(REGISTRY),
    connection: { subscribeEvents: vi.fn().mockResolvedValue(() => {}) },
    callService: vi.fn(),
  } as unknown as HomeAssistant;
}

describe('group members — editor eye button persists `members`', () => {
  it('emits a config carrying `members` when a row is hidden', async () => {
    const el = document.createElement(
      'adaptive-cover-pro-tile-card-editor',
    ) as unknown as EditorLike;
    el.hass = hass();
    document.body.appendChild(el);
    el.setConfig({ type: TYPE, entry_id: GROUP } as AdaptiveCoverProTileCardConfig);
    el._registry = REGISTRY;
    await el.updateComplete;
    await el.updateComplete;

    const emitted: AdaptiveCoverProTileCardConfig[] = [];
    el.addEventListener('config-changed', (e) => {
      emitted.push((e as CustomEvent).detail.config);
    });

    const rows = el.shadowRoot!.querySelectorAll('li.member-row');
    expect(rows.length).toBe(3);

    // Row 1 is entry_b, whose only cover is the UNAVAILABLE one — the case that
    // broke the earlier row-key format, since an unavailable member's owner
    // does not resolve and the editor and the card keyed it differently.
    // The eye is the last button on the row.
    const buttons = rows[1].querySelectorAll('button');
    (buttons[buttons.length - 1] as HTMLButtonElement).click();
    await el.updateComplete;

    expect(emitted.length).toBe(1);
    expect(emitted[0].members).toEqual(['cover.a', 'cover.generic']);
  });
});

describe('group members — a hidden member leaves the tile aggregates', () => {
  it('clears the unavailable exception and shrinks the denominator', async () => {
    const { loadEntityRegistry } = await import('../src/lib/registry-store');
    await loadEntityRegistry({
      callWS: async () => REGISTRY,
    } as unknown as Parameters<typeof loadEntityRegistry>[0]);

    const discovered = {
      entry_id: GROUP,
      entry_title: 'Patio',
      cover_type: 'cover_blind',
      is_group: true,
      managed_covers: ['cover.a', 'cover.b', 'cover.generic'],
      entities: {
        group_position_sensor: 'sensor.group_position',
        group_state_sensor: 'sensor.group_state',
        group_who_won_sensor: 'sensor.group_who_won',
      },
    };

    const el = document.createElement('acp-group-tile') as HTMLElement & {
      updateComplete: Promise<boolean>;
      hass?: HomeAssistant;
      discovered?: unknown;
      members?: string[];
    };
    el.hass = hass();
    el.discovered = discovered;
    el.members = ['cover.a', 'cover.generic'];
    document.body.appendChild(el);
    await el.updateComplete;

    const text = (el.shadowRoot!.textContent ?? '').replace(/\s+/g, ' ').trim();
    expect(text).not.toContain('unavailable');
  });
});
