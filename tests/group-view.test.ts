import { describe, it, expect, vi } from 'vitest';
import '../src/components/group-view';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';

interface GroupViewLike extends HTMLElement {
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
      group_clear_overrides_button: 'button.group_clear_overrides',
    },
  };
}

function makeHass(
  overrides: {
    callService?: (...a: unknown[]) => unknown;
    locked?: boolean;
    automation?: boolean;
  } = {},
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
        attributes: { member_winners: { 'cover.a': 'solar', 'cover.b': 'group_lock' } },
      },
      'select.group_scene': {
        state: 'all_open',
        attributes: {
          options: ['auto', 'all_open', 'all_closed', 'privacy'],
          current_option: 'all_open',
        },
      },
      'switch.group_lock': { state: overrides.locked ? 'on' : 'off', attributes: {} },
      'switch.group_automation': {
        state: overrides.automation === false ? 'off' : 'on',
        attributes: {},
      },
      'button.group_clear_overrides': { state: 'unknown', attributes: {} },
      // Friendly names for two members; cover.generic falls back to its id.
      'cover.a': { state: 'open', attributes: { friendly_name: 'Living Left' } },
      'cover.b': { state: 'open', attributes: { friendly_name: 'Living Right' } },
    },
    callService: overrides.callService ?? vi.fn(),
  } as unknown as HomeAssistant;
}

async function mount(hass: HomeAssistant, discovered: DiscoveredEntities): Promise<GroupViewLike> {
  const el = document.createElement('acp-group-view') as GroupViewLike;
  el.hass = hass;
  el.discovered = discovered;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('acp-group-view (issue #185 Phase 3)', () => {
  it('renders one member row per member_positions entry', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    const rows = el.shadowRoot!.querySelectorAll('.member');
    expect(rows.length).toBe(3);
  });

  it('renders each member position', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    const text = el.shadowRoot!.textContent!.replace(/\s+/g, ' ');
    expect(text).toContain('40');
    expect(text).toContain('60');
  });

  it('renders the member friendly name when the member entity exists, else the entity_id', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    const names = Array.from(el.shadowRoot!.querySelectorAll('.member-name')).map((n) =>
      (n.textContent ?? '').trim(),
    );
    expect(names).toContain('Living Left');
    expect(names).toContain('Living Right');
    // Generic member has no state → falls back to its entity_id.
    expect(names).toContain('cover.generic');
  });

  it('shows a who-won badge only for members present in member_winners', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    const rows = Array.from(el.shadowRoot!.querySelectorAll('.member'));
    const withBadge = rows.filter((r) => r.querySelector('acp-tile-badge'));
    // cover.a + cover.b have winners; cover.generic does not.
    expect(withBadge.length).toBe(2);
  });

  it('renders the aggregate position and state summary', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    const summary = el.shadowRoot!.querySelector('.summary');
    expect(summary).toBeTruthy();
    const text = summary!.textContent!.replace(/\s+/g, ' ');
    expect(text).toContain('50');
    expect(text.toLowerCase()).toContain('mixed');
  });

  it('renders the scene select with the four options and the current option selected', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    const select = el.shadowRoot!.querySelector('select.scene-select') as HTMLSelectElement;
    expect(select).toBeTruthy();
    const values = Array.from(select.options).map((o) => o.value);
    expect(values).toEqual(['auto', 'all_open', 'all_closed', 'privacy']);
    expect(select.value).toBe('all_open');
  });

  it('calls select.select_option when a scene is chosen', async () => {
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

  it('toggles automation via switch.turn_off when currently on', async () => {
    const callService = vi.fn();
    const el = await mount(makeHass({ callService, automation: true }), makeDiscovered());
    (el.shadowRoot!.querySelector('.automation-toggle') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith(
      'switch',
      'turn_off',
      {},
      { entity_id: 'switch.group_automation' },
    );
  });

  it('presses the clear-overrides button via button.press', async () => {
    const callService = vi.fn();
    const el = await mount(makeHass({ callService }), makeDiscovered());
    (el.shadowRoot!.querySelector('.clear-overrides') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith(
      'button',
      'press',
      {},
      { entity_id: 'button.group_clear_overrides' },
    );
  });

  it('renders no sun/window geometry (no compass, no svg)', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    expect(el.shadowRoot!.querySelector('acp-sky-compass')).toBeNull();
    expect(el.shadowRoot!.querySelector('svg')).toBeNull();
  });

  it('shows a placeholder when the roster is empty', async () => {
    const hass = makeHass();
    (
      hass.states['sensor.group_position'].attributes as { member_positions: unknown }
    ).member_positions = {};
    const el = await mount(hass, makeDiscovered());
    expect(el.shadowRoot!.querySelector('.member-placeholder')).toBeTruthy();
    expect(el.shadowRoot!.querySelectorAll('.member').length).toBe(0);
  });
});
