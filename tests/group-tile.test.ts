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

/** The scene select and lock/automation/clear buttons live in the shared
 *  `acp-group-controls-row` child, one shadow root deeper. */
async function controlsRow(el: GroupTileLike): Promise<ShadowRoot> {
  const row = el.shadowRoot!.querySelector('acp-group-controls-row') as HTMLElement & {
    updateComplete: Promise<boolean>;
  };
  await row.updateComplete;
  return row.shadowRoot!;
}

describe('acp-group-tile', () => {
  it('renders the aggregate position from the group_position sensor', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    expect(el.shadowRoot!.querySelector('.state')?.textContent).toContain('50');
  });

  it('renders the aggregate state text from the group_state sensor', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    const text = el.shadowRoot!.querySelector('.state')?.textContent?.trim() ?? '';
    expect(text.length).toBeGreaterThan(0);
    expect(text.toLowerCase()).toContain('mixed');
  });

  it('renders the scene select with the four scene options and the current option selected', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    const select = (await controlsRow(el)).querySelector(
      'select.scene-select',
    ) as HTMLSelectElement;
    expect(select).toBeTruthy();
    const values = Array.from(select.options).map((o) => o.value);
    expect(values).toEqual(['auto', 'all_open', 'all_closed', 'privacy']);
    expect(select.value).toBe('all_open');
  });

  it('renders the who-won badge as "N/M" (count over roster size)', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    const badge = el.shadowRoot!.querySelector('.chrome-line acp-tile-badge') as HTMLElement & {
      updateComplete: Promise<boolean>;
    };
    expect(badge).toBeTruthy();
    await badge.updateComplete;
    expect(badge.shadowRoot!.textContent!.replace(/\s+/g, ' ').trim()).toBe('2/3');
  });

  it('calls select.select_option on the scene-select entity when a scene is chosen', async () => {
    const callService = vi.fn();
    const el = await mount(makeHass({ callService }), makeDiscovered());
    const select = (await controlsRow(el)).querySelector(
      'select.scene-select',
    ) as HTMLSelectElement;
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
    ((await controlsRow(el)).querySelector('.lock-toggle') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith(
      'switch',
      'turn_on',
      {},
      { entity_id: 'switch.group_lock' },
    );
  });

  // The member roster has a `manual` winner, so the group surfaces it.
  it('rolls a member override up as a badge beside the who-won count', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    const badges = Array.from(
      el.shadowRoot!.querySelectorAll('.chrome-line acp-tile-badge'),
    ) as (HTMLElement & { winner?: string; kindOverride?: string })[];
    expect(badges.filter((b) => !b.kindOverride).map((b) => b.winner)).toEqual(['manual']);
  });

  it('hides the member badge rollup when showMemberBadges is false', async () => {
    const el = document.createElement('acp-group-tile') as GroupTileLike & {
      showMemberBadges: boolean;
    };
    el.hass = makeHass();
    el.discovered = makeDiscovered();
    el.showMemberBadges = false;
    document.body.appendChild(el);
    await el.updateComplete;
    const badges = Array.from(
      el.shadowRoot!.querySelectorAll('.chrome-line acp-tile-badge'),
    ) as (HTMLElement & { winner?: string; kindOverride?: string })[];
    expect(badges.filter((b) => !b.kindOverride).map((b) => b.winner)).toEqual([]);
  });

  // Regression: the body keydown handler used to fire for Enter/Space on every
  // nested control, and its preventDefault() cancelled the control's own
  // activation — so no group control was reachable by keyboard.
  it('does not hijack Enter from a nested control', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    let opened = 0;
    el.addEventListener('acp-open-more-info', () => opened++);
    const lock = (await controlsRow(el)).querySelector('.lock-toggle') as HTMLElement;
    const ev = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true });
    lock.dispatchEvent(ev);
    expect(opened).toBe(0);
    expect(ev.defaultPrevented).toBe(false);
  });

  it('still activates from Enter on the tile body itself', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    let opened = 0;
    el.addEventListener('acp-open-more-info', () => opened++);
    const body = el.shadowRoot!.querySelector('.group-tile') as HTMLElement;
    body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(opened).toBe(1);
  });

  it('toggles the lock via switch.turn_off when currently locked', async () => {
    const callService = vi.fn();
    const el = await mount(makeHass({ callService, locked: true }), makeDiscovered());
    ((await controlsRow(el)).querySelector('.lock-toggle') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith(
      'switch',
      'turn_off',
      {},
      { entity_id: 'switch.group_lock' },
    );
  });
});
