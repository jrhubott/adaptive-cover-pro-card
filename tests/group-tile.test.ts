import { describe, it, expect, vi } from 'vitest';
import '../src/components/group-tile';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';

interface GroupTileLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  discovered?: DiscoveredEntities;
}

const GROUP_ENTRY = 'group1';

function makeDiscovered(): DiscoveredEntities {
  return {
    entry_id: GROUP_ENTRY,
    entry_title: 'Downstairs Group',
    cover_type: 'cover_blind',
    is_group: true,
    managed_covers: ['cover.a', 'cover.b', 'cover.generic'],
    entities: {
      group_position_sensor: 'sensor.group_position',
      group_state_sensor: 'sensor.group_state',
      group_active_scene_sensor: 'sensor.group_active_scene',
      group_who_won_sensor: 'sensor.group_who_won',
      group_scene_select: 'select.group_scene',
      group_lock_switch: 'switch.group_lock',
      group_automation_switch: 'switch.group_automation',
    },
  };
}

function makeHass(
  overrides: { callService?: (...a: unknown[]) => unknown; locked?: boolean } = {},
): HomeAssistant {
  return {
    states: {
      'sensor.group_position': {
        state: '50',
        attributes: {
          member_positions: { 'cover.a': 40, 'cover.b': 60, 'cover.generic': 0 },
        },
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
      'switch.group_lock': { state: overrides.locked ? 'on' : 'off', attributes: {} },
      'switch.group_automation': { state: 'on', attributes: {} },
    },
    callService: overrides.callService ?? vi.fn(),
  } as unknown as HomeAssistant;
}

async function mount(hass: HomeAssistant, discovered: DiscoveredEntities): Promise<GroupTileLike> {
  const el = document.createElement('acp-group-tile') as GroupTileLike;
  el.hass = hass;
  el.discovered = discovered;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('acp-group-tile', () => {
  it('renders the aggregate position from the group_position sensor', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    expect(el.shadowRoot!.querySelector('.group-position')?.textContent).toContain('50');
  });

  it('renders the aggregate state text from the group_state sensor', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    const text = el.shadowRoot!.querySelector('.group-state')?.textContent?.trim() ?? '';
    expect(text.length).toBeGreaterThan(0);
    expect(text.toLowerCase()).toContain('mixed');
  });

  it('renders the scene select with the four scene options and the current option selected', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    const select = el.shadowRoot!.querySelector('select.scene-select') as HTMLSelectElement;
    expect(select).toBeTruthy();
    const values = Array.from(select.options).map((o) => o.value);
    expect(values).toEqual(['auto', 'all_open', 'all_closed', 'privacy']);
    expect(select.value).toBe('all_open');
  });

  it('renders the who-won badge as "N/M" (count over roster size)', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    const badge = el.shadowRoot!.querySelector('acp-tile-badge') as HTMLElement & {
      updateComplete: Promise<boolean>;
    };
    expect(badge).toBeTruthy();
    await badge.updateComplete;
    expect(badge.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim()).toBe('2/3');
  });

  it('calls select.select_option on the scene-select entity when a scene is chosen', async () => {
    const callService = vi.fn();
    const el = await mount(makeHass({ callService }), makeDiscovered());
    const select = el.shadowRoot!.querySelector('select.scene-select') as HTMLSelectElement;
    select.value = 'privacy';
    select.dispatchEvent(new Event('change'));
    expect(callService).toHaveBeenCalledWith(
      'select',
      'select_option',
      { option: 'privacy' },
      { entity_id: 'select.group_scene' },
    );
  });

  it('toggles the lock via switch.turn_on when currently unlocked', async () => {
    const callService = vi.fn();
    const el = await mount(makeHass({ callService, locked: false }), makeDiscovered());
    (el.shadowRoot!.querySelector('.lock-toggle') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith(
      'switch',
      'turn_on',
      {},
      { entity_id: 'switch.group_lock' },
    );
  });

  it('toggles the lock via switch.turn_off when currently locked', async () => {
    const callService = vi.fn();
    const el = await mount(makeHass({ callService, locked: true }), makeDiscovered());
    (el.shadowRoot!.querySelector('.lock-toggle') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith(
      'switch',
      'turn_off',
      {},
      { entity_id: 'switch.group_lock' },
    );
  });
});
