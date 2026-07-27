import { describe, it, expect, vi } from 'vitest';
import '../src/components/group-tile';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';
import { loadEntityRegistry } from '../src/lib/registry-store';

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
  overrides: {
    callService?: (...a: unknown[]) => unknown;
    locked?: boolean;
    /** Per-member `automatic_control` states, keyed by member entry id. Left
     *  out by default so the rollup stays `unknown` and every other case in
     *  this file exercises the pre-rollup fallback rendering. */
    memberAutomation?: Record<'a' | 'b', boolean>;
    /** Replace the `member_winners` map, or drop the attribute with `null`. */
    memberWinners?: Record<string, string> | null;
  } = {},
): HomeAssistant {
  const winners =
    overrides.memberWinners === undefined
      ? { 'cover.a': 'solar', 'cover.b': 'manual' }
      : overrides.memberWinners;
  return {
    states: {
      ...(overrides.memberAutomation ? memberStates(overrides.memberAutomation) : {}),
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
        attributes: winners ? { member_winners: winners } : {},
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

/** `cover.a` and `cover.b` are members with their own ACP entries (`entry_a` /
 *  `entry_b`); `cover.generic` has none. Mirrors what {@link memberRegistry}
 *  registers. */
function memberStates(auto: Record<'a' | 'b', boolean>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of ['a', 'b'] as const) {
    out[`sensor.entry_${key}_cover_position`] = {
      state: '50',
      attributes: { actual_positions: { [`cover.${key}`]: 50 } },
    };
    out[`switch.entry_${key}_automatic_control`] = {
      state: auto[key] ? 'on' : 'off',
      attributes: {},
    };
  }
  return out;
}

/** Warm the shared registry store with the two member entries, so `readGroup`
 *  can resolve each member cover back to its own Automatic Control switch. */
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
      entity_id: `switch.entry_${key}_automatic_control`,
      unique_id: `entry_${key}_Automatic Control`,
      platform: 'adaptive_cover_pro',
      config_entry_id: `entry_${key}`,
      device_id: `dev_${key}`,
    },
  ]);
  await loadEntityRegistry({
    callWS: async () => rows,
  } as unknown as Parameters<typeof loadEntityRegistry>[0]);
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

/**
 * The Automation button's three-color status.
 *
 * `switch.group_automation` is a write-only latch the integration defaults to
 * `on`, so coloring from it claims "everything automated" on a fresh restart and
 * never moves when a member is toggled at its own tile. These cases pin the
 * button to the members' real state instead.
 */
describe('acp-group-tile — Automation status color', () => {
  async function automationButton(auto?: Record<'a' | 'b', boolean>): Promise<HTMLElement> {
    if (auto) await memberRegistry();
    const el = await mount(makeHass({ memberAutomation: auto }), makeDiscovered());
    return (await controlsRow(el)).querySelector('.automation-toggle') as HTMLElement;
  }

  it('is green (all) when every member has automation on', async () => {
    const btn = await automationButton({ a: true, b: true });
    expect(btn.classList.contains('auto-all')).toBe(true);
    expect(btn.querySelector('ha-icon')!.getAttribute('icon')).toBe('mdi:robot');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });

  it('is amber (some) when the members disagree', async () => {
    const btn = await automationButton({ a: true, b: false });
    expect(btn.classList.contains('auto-some')).toBe(true);
    expect(btn.querySelector('ha-icon')!.getAttribute('icon')).toBe('mdi:robot-outline');
    // ARIA's real tri-state toggle value — a screen reader gets what a sighted
    // user gets from the amber.
    expect(btn.getAttribute('aria-pressed')).toBe('mixed');
  });

  it('is grey (none) when no member has automation on', async () => {
    const btn = await automationButton({ a: false, b: false });
    expect(btn.classList.contains('auto-none')).toBe(true);
    expect(btn.querySelector('ha-icon')!.getAttribute('icon')).toBe('mdi:robot-off');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
  });

  // The group latch says `on` here. Before the rollup that painted the button
  // "automated" and sent turn_off — with one member already off, the press
  // moved the group further from what the icon claimed.
  it('does not read the group latch as the members’ state', async () => {
    const btn = await automationButton({ a: false, b: false });
    expect(btn.classList.contains('active')).toBe(false);
  });

  // The tooltip carries the state; the accessible NAME stays the control's
  // purpose. Folding the state into aria-label made a screen reader announce it
  // twice (name + aria-pressed) and never say what the button does.
  it('puts the count in the tooltip and keeps the plain name in aria-label', async () => {
    const btn = await automationButton({ a: true, b: false });
    const tip = btn.getAttribute('data-tooltip') ?? '';
    expect(tip).toContain('1');
    expect(tip).toContain('2');
    expect(btn.getAttribute('aria-label')).toBe('Automation');
  });

  // Finding from the audit: `member_positions` can list a cover that an ACP
  // entry manages but that is NOT a group member (the integration only filters
  // ACP-owned covers out of area-derived additions, not the static roster).
  // `group_set_automation` never touches such an entry, so counting it produced
  // an amber button that no press could ever clear.
  it('ignores an ACP cover that is not one of the group’s members', async () => {
    await memberRegistry();
    // cover.b is ACP-managed with automation OFF, but the group does not list it
    // as a member — only cover.a is. The button must read the members only.
    const el = await mount(
      makeHass({ memberAutomation: { a: true, b: false }, memberWinners: { 'cover.a': 'solar' } }),
      makeDiscovered(),
    );
    const btn = (await controlsRow(el)).querySelector('.automation-toggle') as HTMLElement;
    expect(btn.classList.contains('auto-all')).toBe(true);
  });

  // Regression guard: an integration too old to publish `member_winners` has no
  // way to say which covers are ACP members, so the rollup must not guess.
  it('falls back when the group publishes no member_winners', async () => {
    await memberRegistry();
    const el = await mount(
      makeHass({ memberAutomation: { a: false, b: false }, memberWinners: null }),
      makeDiscovered(),
    );
    const btn = (await controlsRow(el)).querySelector('.automation-toggle') as HTMLElement;
    expect(btn.className).not.toMatch(/auto-(all|some|none)/);
    expect(btn.classList.contains('active')).toBe(true);
  });

  it('turns automation on from a mixed roster rather than inverting the latch', async () => {
    await memberRegistry();
    const callService = vi.fn();
    const el = await mount(
      makeHass({ callService, memberAutomation: { a: true, b: false } }),
      makeDiscovered(),
    );
    ((await controlsRow(el)).querySelector('.automation-toggle') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith(
      'switch',
      'turn_on',
      {},
      { entity_id: 'switch.group_automation' },
    );
  });

  it('turns automation off when every member is on', async () => {
    await memberRegistry();
    const callService = vi.fn();
    const el = await mount(
      makeHass({ callService, memberAutomation: { a: true, b: true } }),
      makeDiscovered(),
    );
    ((await controlsRow(el)).querySelector('.automation-toggle') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith(
      'switch',
      'turn_off',
      {},
      { entity_id: 'switch.group_automation' },
    );
  });

  // Regression guard: the registry cache is cold on first paint, and an
  // all-generic roster never resolves at all. Both must render exactly the
  // pre-rollup button, driven by the group latch.
  it('falls back to the group latch when no member resolves', async () => {
    const btn = await automationButton();
    expect(btn.classList.contains('active')).toBe(true);
    expect(btn.className).not.toMatch(/auto-(all|some|none)/);
    expect(btn.querySelector('ha-icon')!.getAttribute('icon')).toBe('mdi:robot');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });

  it('still inverts the latch on the unresolved fallback path', async () => {
    const callService = vi.fn();
    const el = await mount(makeHass({ callService }), makeDiscovered());
    ((await controlsRow(el)).querySelector('.automation-toggle') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith(
      'switch',
      'turn_off',
      {},
      { entity_id: 'switch.group_automation' },
    );
  });
});
