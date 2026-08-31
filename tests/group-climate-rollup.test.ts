import { describe, it, expect, vi, beforeEach } from 'vitest';
import '../src/components/group-controls-row';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';
import { readGroup, restrictSnapshot } from '../src/lib/group-controls';
import { loadEntityRegistry } from '../src/lib/registry-store';

/**
 * The Climate button's three-color status (issue #287).
 *
 * `switch.<group>_climate_mode` is a write-only latch the integration restores
 * to its last bulk command, so coloring from it claims "climate everywhere" on a
 * fresh restart and never moves when a member is toggled at its own tile. These
 * cases pin the button to the members' real state instead — the same treatment
 * the Automation button beside it already had.
 */

const CLIMATE_SWITCH = 'switch.group_climate_mode';

interface RowLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  discovered?: DiscoveredEntities;
  snapshot?: unknown;
  showClimate?: boolean;
}

function makeDiscovered(): DiscoveredEntities {
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
      group_climate_mode_switch: CLIMATE_SWITCH,
    },
  };
}

/** Registry rows for two ACP member entries, each owning one cover plus its own
 *  Climate Mode switch — the walk `rollupMemberClimate` performs. */
async function memberRegistry(): Promise<void> {
  const rows = (['a', 'b'] as const).flatMap((key) => [
    {
      entity_id: `sensor.entry_${key}_cover_position`,
      unique_id: `entry_${key}_Cover_Position`,
      platform: 'adaptive_cover_pro',
      config_entry_id: `entry_${key}`,
      device_id: `dev_${key}`,
    },
    {
      entity_id: `switch.entry_${key}_climate_mode`,
      unique_id: `entry_${key}_Climate Mode`,
      platform: 'adaptive_cover_pro',
      config_entry_id: `entry_${key}`,
      device_id: `dev_${key}`,
    },
  ]);
  await loadEntityRegistry({
    callWS: async () => rows,
  } as unknown as Parameters<typeof loadEntityRegistry>[0]);
}

function memberStates(climate: Record<'a' | 'b', boolean>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of ['a', 'b'] as const) {
    out[`sensor.entry_${key}_cover_position`] = {
      state: '50',
      attributes: { actual_positions: { [`cover.${key}`]: 50 } },
    };
    out[`switch.entry_${key}_climate_mode`] = {
      state: climate[key] ? 'on' : 'off',
      attributes: {},
    };
  }
  return out;
}

function makeHass(
  overrides: {
    callService?: (...a: unknown[]) => unknown;
    /** Per-member `climate_mode` states. Left out so the rollup stays `unknown`
     *  and the button falls back to the group latch. */
    memberClimate?: Record<'a' | 'b', boolean>;
    /** The group's own latch — deliberately `on` in most cases below, so a test
     *  that disagrees with the members proves the rollup won. */
    groupLatch?: boolean;
  } = {},
): HomeAssistant {
  return {
    states: {
      ...(overrides.memberClimate ? memberStates(overrides.memberClimate) : {}),
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
      [CLIMATE_SWITCH]: {
        state: overrides.groupLatch === false ? 'off' : 'on',
        attributes: {},
      },
      'cover.a': { state: 'open', attributes: { current_position: 40 } },
      'cover.b': { state: 'open', attributes: { current_position: 60 } },
    },
    callService: overrides.callService ?? vi.fn(),
    localize: (k: string) => k,
    language: 'en',
  } as unknown as HomeAssistant;
}

async function climateButton(
  climate?: Record<'a' | 'b', boolean>,
  extra: { callService?: (...a: unknown[]) => unknown; groupLatch?: boolean } = {},
): Promise<HTMLElement> {
  if (climate) await memberRegistry();
  const hass = makeHass({ memberClimate: climate, ...extra });
  const discovered = makeDiscovered();
  const el = document.createElement('acp-group-controls-row') as RowLike;
  el.hass = hass;
  el.discovered = discovered;
  el.snapshot = readGroup(hass, discovered);
  el.showClimate = true;
  document.body.appendChild(el);
  await el.updateComplete;
  return el.shadowRoot!.querySelector('.climate-toggle') as HTMLElement;
}

describe('acp-group-controls-row — Climate status color', () => {
  it('is green (all) when every member has climate on', async () => {
    const btn = await climateButton({ a: true, b: true });
    expect(btn.classList.contains('auto-all')).toBe(true);
    expect(btn.querySelector('ha-icon')!.getAttribute('icon')).toBe('mdi:sun-thermometer');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });

  it('is amber (some) when the members disagree', async () => {
    const btn = await climateButton({ a: true, b: false });
    expect(btn.classList.contains('auto-some')).toBe(true);
    expect(btn.querySelector('ha-icon')!.getAttribute('icon')).toBe('mdi:sun-thermometer-outline');
    // ARIA's real tri-state toggle value — a screen reader gets what a sighted
    // user gets from the amber.
    expect(btn.getAttribute('aria-pressed')).toBe('mixed');
  });

  it('is grey (none) when no member has climate on', async () => {
    const btn = await climateButton({ a: false, b: false });
    expect(btn.classList.contains('auto-none')).toBe(true);
    expect(btn.querySelector('ha-icon')!.getAttribute('icon')).toBe('mdi:thermometer-off');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
  });

  // The whole point of #287. The group latch says `on` here; before the rollup
  // that painted the button "climate everywhere" and a press sent turn_off —
  // with one member already off, the press moved the group further from what
  // the icon claimed.
  it('does not read the group latch as the members’ state', async () => {
    const btn = await climateButton({ a: true, b: false }, { groupLatch: true });
    expect(btn.classList.contains('auto-some')).toBe(true);
    expect(btn.classList.contains('active')).toBe(false);
  });

  it('sends turn_on from the mixed state, bringing the stragglers up', async () => {
    const callService = vi.fn();
    const btn = await climateButton({ a: true, b: false }, { callService, groupLatch: true });
    btn.click();
    expect(callService).toHaveBeenCalledWith(
      'switch',
      'turn_on',
      {},
      { entity_id: CLIMATE_SWITCH },
    );
  });

  it('sends turn_off only when every member is already on', async () => {
    const callService = vi.fn();
    const btn = await climateButton({ a: true, b: true }, { callService });
    btn.click();
    expect(callService).toHaveBeenCalledWith(
      'switch',
      'turn_off',
      {},
      { entity_id: CLIMATE_SWITCH },
    );
  });

  it('names the count in the accessible label', async () => {
    const btn = await climateButton({ a: true, b: false });
    expect(btn.getAttribute('aria-label')).toContain('1 of 2');
  });
});

describe('climate rollup falls back to the latch when nothing resolves', () => {
  beforeEach(async () => {
    // An empty registry — the cold-cache / all-generic-roster case.
    await loadEntityRegistry({
      callWS: async () => [],
    } as unknown as Parameters<typeof loadEntityRegistry>[0]);
  });

  it('paints from the group latch when the rollup is unknown', async () => {
    const btn = await climateButton(undefined, { groupLatch: true });
    expect(btn.classList.contains('active')).toBe(true);
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    // No status modifier — this is the pre-rollup rendering, unchanged.
    expect(btn.classList.contains('auto-all')).toBe(false);
  });

  it('paints unpressed from an off latch when the rollup is unknown', async () => {
    const btn = await climateButton(undefined, { groupLatch: false });
    expect(btn.classList.contains('active')).toBe(false);
    expect(btn.getAttribute('aria-pressed')).toBe('false');
  });

  // The fallback borrows the resolved set's endpoints rather than keeping its
  // own pair. #225 shipped `sun-thermometer-outline` for the off latch; that is
  // now `thermometer-off`, matching what `none` shows once the rollup resolves,
  // so the same state cannot render two different glyphs depending on whether
  // the registry cache happens to be warm.
  it('uses the same glyphs the resolved states use', async () => {
    const on = await climateButton(undefined, { groupLatch: true });
    expect(on.querySelector('ha-icon')!.getAttribute('icon')).toBe('mdi:sun-thermometer');
    const off = await climateButton(undefined, { groupLatch: false });
    expect(off.querySelector('ha-icon')!.getAttribute('icon')).toBe('mdi:thermometer-off');
  });
});

describe('memberClimate on the snapshot', () => {
  it('is recomputed over the surviving members by restrictSnapshot', async () => {
    await memberRegistry();
    const hass = makeHass({ memberClimate: { a: true, b: false } });
    const discovered = makeDiscovered();
    const full = readGroup(hass, discovered);
    expect(full.memberClimate).toEqual({ status: 'some', on: 1, total: 2 });

    // Hide the member that has climate off — the survivor is unanimous, so the
    // status must move. A scalar carried through untouched would still read
    // "some" over a roster of one.
    const restricted = restrictSnapshot(hass, full, new Set(['cover.b']));
    expect(restricted.memberClimate).toEqual({ status: 'all', on: 1, total: 1 });
  });
});
