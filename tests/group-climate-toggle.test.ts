import { describe, it, expect, vi } from 'vitest';
import '../src/components/group-controls-row';
import '../src/components/group-tile';
import '../src/components/group-view';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';
import { readGroup, restrictSnapshot, toggleClimate } from '../src/lib/group-controls';

/**
 * The group Climate on/off toggle (issue #225).
 *
 * `switch.<group>_climate_mode` is a bulk latch: a press enables or disables
 * climate mode on every ACP member. It is the fourth control in the shared
 * group row, and the only one that defaults to HIDDEN — a press reaches every
 * member at once, so it is opt-in per card rather than opt-out.
 */

const CLIMATE_SWITCH = 'switch.group_climate_mode';

interface RowLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  discovered?: DiscoveredEntities;
  snapshot?: unknown;
  showClimate?: boolean;
}

function makeDiscovered(withClimate = true): DiscoveredEntities {
  return {
    entry_id: 'group1',
    entry_title: 'Downstairs Group',
    cover_type: 'cover_blind',
    is_group: true,
    managed_covers: ['cover.a', 'cover.b'],
    entities: {
      group_position_sensor: 'sensor.group_position',
      group_state_sensor: 'sensor.group_state',
      group_active_scene_sensor: 'sensor.group_active_scene',
      group_who_won_sensor: 'sensor.group_who_won',
      group_scene_select: 'select.group_scene',
      group_lock_switch: 'switch.group_lock',
      group_automation_switch: 'switch.group_automation',
      ...(withClimate ? { group_climate_mode_switch: CLIMATE_SWITCH } : {}),
    },
  };
}

function makeHass(
  overrides: { callService?: (...a: unknown[]) => unknown; climate?: boolean } = {},
): HomeAssistant {
  return {
    states: {
      'sensor.group_position': {
        state: '50',
        attributes: { member_positions: { 'cover.a': 40, 'cover.b': 60 } },
      },
      'sensor.group_state': { state: 'mixed', attributes: {} },
      'sensor.group_active_scene': { state: 'all_open', attributes: {} },
      'sensor.group_who_won': {
        state: '1',
        attributes: { member_winners: { 'cover.a': 'solar', 'cover.b': 'group_lock' } },
      },
      'select.group_scene': {
        state: 'auto',
        attributes: {
          options: ['auto', 'all_open', 'all_closed', 'privacy'],
          current_option: 'auto',
        },
      },
      'switch.group_lock': { state: 'off', attributes: {} },
      'switch.group_automation': { state: 'on', attributes: {} },
      [CLIMATE_SWITCH]: { state: overrides.climate ? 'on' : 'off', attributes: {} },
      'cover.a': { state: 'open', attributes: { current_position: 40 } },
      'cover.b': { state: 'open', attributes: { current_position: 60 } },
    },
    callService: overrides.callService ?? vi.fn(),
    localize: (k: string) => k,
    language: 'en',
  } as unknown as HomeAssistant;
}

async function mountRow(
  hass: HomeAssistant,
  discovered: DiscoveredEntities,
  showClimate: boolean,
): Promise<ShadowRoot> {
  const el = document.createElement('acp-group-controls-row') as RowLike;
  el.hass = hass;
  el.discovered = discovered;
  el.snapshot = readGroup(hass, discovered);
  el.showClimate = showClimate;
  document.body.appendChild(el);
  await el.updateComplete;
  return el.shadowRoot!;
}

describe('group climate toggle — discovery', () => {
  it('reads the climate switch entity into the snapshot', () => {
    const hass = makeHass({ climate: true });
    const s = readGroup(hass, makeDiscovered());
    expect(s.climateId).toBe(CLIMATE_SWITCH);
    expect(s.climateOn).toBe(true);
  });

  it('leaves climateId undefined when the integration exposes no switch', () => {
    const hass = makeHass();
    const s = readGroup(hass, makeDiscovered(false));
    expect(s.climateId).toBeUndefined();
    expect(s.climateOn).toBe(false);
  });

  // Climate is a group-level latch, not a per-member rollup, so hiding members
  // must not change it — unlike position/aggregate/whoWonCount, which are
  // recomputed over the survivors.
  it('carries climate through restrictSnapshot untouched', () => {
    const hass = makeHass({ climate: true });
    const s = readGroup(hass, makeDiscovered());
    const restricted = restrictSnapshot(hass, s, new Set(['cover.b']));
    expect(restricted.climateOn).toBe(true);
    expect(restricted.climateId).toBe(CLIMATE_SWITCH);
  });
});

describe('group climate toggle — service calls', () => {
  it('turns the switch on when climate is currently off', () => {
    const callService = vi.fn();
    const hass = makeHass({ callService, climate: false });
    toggleClimate(hass, makeDiscovered(), false);
    expect(callService).toHaveBeenCalledWith(
      'switch',
      'turn_on',
      {},
      { entity_id: CLIMATE_SWITCH },
    );
  });

  it('turns the switch off when climate is currently on', () => {
    const callService = vi.fn();
    const hass = makeHass({ callService, climate: true });
    toggleClimate(hass, makeDiscovered(), true);
    expect(callService).toHaveBeenCalledWith(
      'switch',
      'turn_off',
      {},
      { entity_id: CLIMATE_SWITCH },
    );
  });

  it('is a no-op when the integration exposes no climate switch', () => {
    const callService = vi.fn();
    const hass = makeHass({ callService });
    toggleClimate(hass, makeDiscovered(false), false);
    expect(callService).not.toHaveBeenCalled();
  });
});

describe('acp-group-controls-row — climate button', () => {
  it('renders the button when opted in and the entity exists', async () => {
    const root = await mountRow(makeHass({ climate: true }), makeDiscovered(), true);
    const btn = root.querySelector('.climate-toggle') as HTMLElement;
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    expect(btn.classList.contains('active')).toBe(true);
  });

  it('renders unpressed when climate is off', async () => {
    const root = await mountRow(makeHass({ climate: false }), makeDiscovered(), true);
    const btn = root.querySelector('.climate-toggle') as HTMLElement;
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    expect(btn.classList.contains('active')).toBe(false);
  });

  // The opt-in half of the gate: the entity is there, the card said no.
  it('omits the button when showClimate is false', async () => {
    const on = await mountRow(makeHass({ climate: true }), makeDiscovered(), true);
    expect(on.querySelector('.climate-toggle')).toBeTruthy();
    const off = await mountRow(makeHass({ climate: true }), makeDiscovered(), false);
    expect(off.querySelector('.climate-toggle')).toBeNull();
  });

  // The entity half: opted in, but nothing to write to. Rendering it would be
  // a control whose press is a silent no-op.
  it('omits the button when the integration exposes no switch', async () => {
    const root = await mountRow(makeHass(), makeDiscovered(false), true);
    expect(root.querySelector('.climate-toggle')).toBeNull();
  });

  it('sends switch.turn_on from a press when climate is off', async () => {
    const callService = vi.fn();
    const root = await mountRow(makeHass({ callService, climate: false }), makeDiscovered(), true);
    (root.querySelector('.climate-toggle') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith(
      'switch',
      'turn_on',
      {},
      { entity_id: CLIMATE_SWITCH },
    );
  });

  it('sends switch.turn_off from a press when climate is on', async () => {
    const callService = vi.fn();
    const root = await mountRow(makeHass({ callService, climate: true }), makeDiscovered(), true);
    (root.querySelector('.climate-toggle') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith(
      'switch',
      'turn_off',
      {},
      { entity_id: CLIMATE_SWITCH },
    );
  });

  // The row's whole-row escape hatch: with every control off it renders nothing,
  // and the climate button must be part of that count rather than resurrecting
  // an otherwise-empty row.
  it('still renders nothing when climate is the only enabled control and it is absent', async () => {
    const el = document.createElement('acp-group-controls-row') as RowLike & {
      showSceneSelect: boolean;
      showLock: boolean;
      showAutomation: boolean;
      showClearOverrides: boolean;
    };
    const hass = makeHass();
    el.hass = hass;
    el.discovered = makeDiscovered(false);
    el.snapshot = readGroup(hass, makeDiscovered(false));
    el.showSceneSelect = false;
    el.showLock = false;
    el.showAutomation = false;
    el.showClearOverrides = false;
    el.showClimate = true;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.group-row')).toBeNull();
  });
});

/**
 * Both surfaces reach the shared row through their own `showClimate` property,
 * so a dropped binding on either one is a silently missing control rather than
 * a type error. `acp-group-view` matters most: it forwards NO other `show*`
 * flag, so this binding is the only route the main card has to this button.
 */
describe('surfaces forward showClimate to the shared row', () => {
  async function rowOf(tag: string, showClimate: boolean): Promise<ShadowRoot> {
    const el = document.createElement(tag) as RowLike;
    el.hass = makeHass({ climate: true });
    el.discovered = makeDiscovered();
    el.showClimate = showClimate;
    document.body.appendChild(el);
    await el.updateComplete;
    const row = el.shadowRoot!.querySelector('acp-group-controls-row') as HTMLElement & {
      updateComplete: Promise<boolean>;
    };
    await row.updateComplete;
    return row.shadowRoot!;
  }

  it('acp-group-tile shows the button when opted in', async () => {
    expect((await rowOf('acp-group-tile', true)).querySelector('.climate-toggle')).toBeTruthy();
  });

  it('acp-group-tile hides it by default', async () => {
    expect((await rowOf('acp-group-tile', false)).querySelector('.climate-toggle')).toBeNull();
  });

  it('acp-group-view shows the button when opted in', async () => {
    expect((await rowOf('acp-group-view', true)).querySelector('.climate-toggle')).toBeTruthy();
  });

  it('acp-group-view hides it by default', async () => {
    expect((await rowOf('acp-group-view', false)).querySelector('.climate-toggle')).toBeNull();
  });
});

describe('climate toggle defaults to hidden', () => {
  it('is off by default on the shared row', async () => {
    const el = document.createElement('acp-group-controls-row') as RowLike;
    const hass = makeHass({ climate: true });
    el.hass = hass;
    el.discovered = makeDiscovered();
    el.snapshot = readGroup(hass, makeDiscovered());
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.climate-toggle')).toBeNull();
    // The other three controls are unaffected — this is opt-in, not a new
    // blanket default for the row.
    expect(el.shadowRoot!.querySelector('.lock-toggle')).toBeTruthy();
  });
});
