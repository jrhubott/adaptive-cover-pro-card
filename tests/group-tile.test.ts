import { describe, it, expect, vi } from 'vitest';
import { GroupTile } from '../src/components/group-tile';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';
import { loadEntityRegistry } from '../src/lib/registry-store';
import { INTEGRATION_DOMAIN } from '../src/const';
import { RailTrack } from '../src/components/rail-track';
import { railRoot, railSettled } from './rail-query';

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
  it('states the position RANGE, not the aggregate mean', async () => {
    // Members at 40/60/0 publish an aggregate of 50, a number no member holds.
    // The tile reports what they are actually at, in the LOGICAL frame.
    const el = await mount(
      makeHass({ memberWinners: { 'cover.a': 'solar', 'cover.b': 'solar' } }),
      makeDiscovered(),
    );
    const text = el.shadowRoot!.querySelector('.state')?.textContent ?? '';
    expect(text).toContain('0');
    expect(text).toContain('60');
    expect(text).not.toContain('50');
  });

  it('collapses the range to one number when every member agrees', async () => {
    const hass = makeHass({ memberWinners: { 'cover.a': 'solar', 'cover.b': 'solar' } });
    const sensor = hass.states['sensor.group_position'];
    sensor.attributes = {
      ...sensor.attributes,
      member_positions: { 'cover.a': 40, 'cover.b': 40, 'cover.generic': 40 },
    };
    const el = await mount(hass, makeDiscovered());
    expect(el.shadowRoot!.querySelector('.state')?.textContent).toContain('40');
  });

  it('lets a held member take the slot from the range', async () => {
    // The default fixture parks `cover.b` on a manual override. An exception is
    // the one thing worth interrupting the range for.
    const el = await mount(makeHass(), makeDiscovered());
    expect(el.shadowRoot!.querySelector('.state')?.textContent).toContain('1');
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
    await railSettled(el);
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

  // The name leads with the control's purpose, then carries the state.
  // `aria-description` cannot do that job here: the tooltip directive always
  // sets `aria-describedby`, which takes precedence over it — and that IDREF
  // points at a bubble in document.body, which no IDREF crosses a shadow
  // boundary to reach. So the state has to live in the name or reach nobody.
  it('leads the accessible name with the purpose and then the state', async () => {
    const btn = await automationButton({ a: true, b: false });
    const label = btn.getAttribute('aria-label') ?? '';
    expect(label.startsWith('Automation')).toBe(true);
    expect(label).toContain('1');
    expect(label).toContain('2');
    expect(btn.getAttribute('aria-description')).toBeNull();
    expect(btn.getAttribute('data-tooltip') ?? '').toContain('1');
  });

  // Every state names its denominator. `total` counts only the covers that could
  // report — generic members and members whose Automatic Control entity is
  // disabled drop out — so "on for all members" would claim the whole group
  // from a sample of one.
  it('names the denominator even when every member is automated', async () => {
    const btn = await automationButton({ a: true, b: true });
    const label = btn.getAttribute('aria-label') ?? '';
    expect(label).toContain('2 of 2');
  });

  it('names the denominator when no member is automated', async () => {
    const btn = await automationButton({ a: false, b: false });
    expect(btn.getAttribute('aria-label') ?? '').toContain('0 of 2');
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
    // The name is the one field that carries state on the resolved paths, so it
    // is the one most easily leaked into this one. Building the count above the
    // early return would announce "0 of 0 members automating" on every cold
    // first paint, and nothing else in this test would notice.
    expect(btn.getAttribute('aria-label')).toBe('Automation');
    expect(btn.getAttribute('data-tooltip')).toBe('Automation');
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

// Mirrors the cover tile's icon_tap_action behavior. The group tile is purely
// presentational: the host owns the action and only tells it whether the glyph
// is interactive, so this element's job is the class, the a11y attributes, and
// emitting acp-icon-action without also triggering the body's more-info.
describe('acp-group-tile — icon interactivity', () => {
  async function mountWithIcon(interactive: boolean): Promise<GroupTileLike> {
    const el = document.createElement('acp-group-tile') as GroupTileLike & {
      iconInteractive?: boolean;
    };
    el.hass = makeHass({});
    el.discovered = makeDiscovered();
    el.iconInteractive = interactive;
    document.body.appendChild(el);
    await railSettled(el);
    return el;
  }

  it('leaves the glyph bare when not interactive', async () => {
    const el = await mountWithIcon(false);
    const wrap = el.shadowRoot!.querySelector('.cover-icon-wrap')!;
    expect(wrap.classList.contains('background')).toBe(false);
    expect(wrap.getAttribute('role')).toBeNull();
  });

  it('draws the shape and exposes a button role when interactive', async () => {
    const el = await mountWithIcon(true);
    const wrap = el.shadowRoot!.querySelector('.cover-icon-wrap')!;
    expect(wrap.classList.contains('background')).toBe(true);
    expect(wrap.getAttribute('role')).toBe('button');
    expect(wrap.getAttribute('tabindex')).toBe('0');
  });

  it('emits acp-icon-action and not acp-open-more-info on a glyph tap', async () => {
    const el = await mountWithIcon(true);
    const iconAction = vi.fn();
    const moreInfo = vi.fn();
    el.addEventListener('acp-icon-action', iconAction);
    el.addEventListener('acp-open-more-info', moreInfo);
    const wrap = el.shadowRoot!.querySelector('.cover-icon-wrap') as HTMLElement;
    wrap.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await railSettled(el);
    expect(iconAction).toHaveBeenCalled();
    expect(moreInfo).not.toHaveBeenCalled();
  });

  it('falls through to the body more-info when the glyph is not interactive', async () => {
    const el = await mountWithIcon(false);
    const iconAction = vi.fn();
    const moreInfo = vi.fn();
    el.addEventListener('acp-icon-action', iconAction);
    el.addEventListener('acp-open-more-info', moreInfo);
    const wrap = el.shadowRoot!.querySelector('.cover-icon-wrap') as HTMLElement;
    wrap.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await railSettled(el);
    expect(iconAction).not.toHaveBeenCalled();
    expect(moreInfo).toHaveBeenCalled();
  });
});

describe('group tile — rail color is constant (#260)', () => {
  // The inline `background:${iconColor || 'var(--primary-color)'}` was removed
  // so the rail no longer changes hue with the aggregate state. This element's
  // `.pos-fill` had NO background in CSS at all before that — it relied entirely
  // on the inline style — so the CSS default is load-bearing, not cosmetic.
  it('declares a background on .pos-fill in CSS', () => {
    const css = RailTrack.styles.toString();
    expect(css).toMatch(/\.pos-fill\s*\{[^}]*background:/);
    expect(css).toContain('--acp-pos-fill-color');
    expect(css).toContain('var(--state-cover-active-color');
  });

  it('never writes an inline background onto the fill', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    const fill = railRoot(el.shadowRoot!).querySelector('.pos-fill');
    expect(fill).toBeTruthy();
    expect(fill!.getAttribute('style') ?? '').not.toContain('background');
  });
});

// ── #267 characterization: the group rail's gesture contract ────────────────
//
// Written BEFORE the `RailGestures` extraction and against the hand-rolled
// handlers, so it records what ships today rather than what the refactor
// produces. `group_set_position` flattens every member onto one value and takes
// them off their own solar targets, which is why this rail — alone among the
// four — refuses to commit a tap and previews nothing below the drag threshold.
// Until now that behavior had no automated guard at all.
describe('group tile — position rail gestures (#267 characterization)', () => {
  const RECT = { left: 0, width: 100, top: 0, bottom: 8, right: 100, height: 8 };

  /** The default roster is `{a:40, b:60, generic:0}` on a `cover_blind`, so the
   *  position axis is MIRRORED: drawn = 100 − logical. Drawn members are
   *  40/60/100, giving a spread whose solid fill stops at 40%. */
  async function mountRail(): Promise<{
    el: GroupTileLike;
    slider: HTMLElement;
    callService: ReturnType<typeof vi.fn>;
  }> {
    const callService = vi.fn();
    const el = await mount(
      makeHass({ callService: callService as unknown as (...a: unknown[]) => unknown }),
      makeDiscovered(),
    );
    const slider = railRoot(el.shadowRoot!).querySelector('.pos-slider') as HTMLElement;
    Object.defineProperty(slider, 'getBoundingClientRect', {
      value: () => RECT,
      configurable: true,
    });
    return { el, slider, callService };
  }

  const down = (x: number): PointerEvent =>
    new PointerEvent('pointerdown', { bubbles: true, composed: true, clientX: x, pointerId: 1 });
  const move = (x: number): PointerEvent =>
    new PointerEvent('pointermove', { bubbles: true, composed: true, clientX: x, pointerId: 1 });
  const up = (x: number): PointerEvent =>
    new PointerEvent('pointerup', { bubbles: true, composed: true, clientX: x, pointerId: 1 });

  const fillWidth = (el: GroupTileLike): string =>
    (railRoot(el.shadowRoot!).querySelector('.pos-fill') as HTMLElement).getAttribute('style') ??
    '';
  const isDragging = (slider: HTMLElement): boolean => slider.classList.contains('dragging');

  it('a tap with no pointer movement commits nothing', async () => {
    const { el, slider, callService } = await mountRail();
    slider.dispatchEvent(down(50));
    await railSettled(el);
    expect(isDragging(slider)).toBe(false);
    slider.dispatchEvent(up(50));
    await railSettled(el);
    expect(isDragging(slider)).toBe(false);
    // Real browsers fire a trailing compatibility click at the release point.
    // Rails 1–3 commit on it; this one must not.
    slider.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, clientX: 50 }));
    await railSettled(el);
    expect(callService).not.toHaveBeenCalled();
  });

  it('movement below the 4px threshold neither previews nor commits', async () => {
    const { el, slider, callService } = await mountRail();
    slider.dispatchEvent(down(50));
    slider.dispatchEvent(move(52));
    await railSettled(el);
    expect(isDragging(slider)).toBe(false);
    // The spread band is still drawn: nothing has collapsed onto one value.
    expect(fillWidth(el)).toContain('width:40%');
    expect(el.shadowRoot!.querySelector('.pos-band')).not.toBeNull();
    slider.dispatchEvent(up(52));
    await railSettled(el);
    expect(callService).not.toHaveBeenCalled();
  });

  it('a drag past the threshold previews live and commits on release, once', async () => {
    const { el, slider, callService } = await mountRail();
    slider.dispatchEvent(down(20));
    slider.dispatchEvent(move(80));
    await railSettled(el);
    expect(isDragging(slider)).toBe(true);
    // Drawn 80 on a mirrored axis is logical 20, and the preview collapses the
    // spread band because the write is about to flatten every member.
    expect(fillWidth(el)).toContain('width:80%');
    expect(el.shadowRoot!.querySelector('.pos-band')).toBeNull();
    expect(callService).not.toHaveBeenCalled();
    slider.dispatchEvent(up(80));
    await railSettled(el);
    expect(callService).toHaveBeenCalledTimes(1);
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'group_set_position',
      { position: 20 },
      { entity_id: 'sensor.group_position' },
    );
    slider.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, clientX: 80 }));
    await railSettled(el);
    expect(callService).toHaveBeenCalledTimes(1);
  });

  it('pointercancel discards a past-threshold drag without committing', async () => {
    const { el, slider, callService } = await mountRail();
    slider.dispatchEvent(down(20));
    slider.dispatchEvent(move(80));
    await railSettled(el);
    expect(isDragging(slider)).toBe(true);
    slider.dispatchEvent(
      new PointerEvent('pointercancel', { bubbles: true, composed: true, pointerId: 1 }),
    );
    await railSettled(el);
    expect(callService).not.toHaveBeenCalled();
    expect(isDragging(slider)).toBe(false);
    expect(fillWidth(el)).toContain('width:40%');
  });

  // The pointer-move gate has to survive the rail being torn out mid-gesture.
  // `RailGestures.isActive()` — what this tile's `_railActive` flag replaced —
  // also cleared on host disconnect; the flag only saw pointerup/pointercancel
  // on the tag, and a rail removed under the finger produces neither. The stale
  // `true` then made the NEXT rail swallow every pointermove until a fresh
  // down/up pair. Driven entirely through dispatched events plus the card's own
  // public `show_position_bar` option — nothing reaches into gesture state.
  it('releases the pointer-move gate when the rail is removed mid-drag', async () => {
    const { el, slider } = await mountRail();
    const bar = el as GroupTileLike & { showPositionBar: boolean };
    slider.dispatchEvent(down(20));
    slider.dispatchEvent(move(80));
    await railSettled(el);

    // The rail goes away under the finger: no pointerup ever reaches the tag.
    bar.showPositionBar = false;
    await railSettled(el);
    expect(el.shadowRoot!.querySelector('acp-rail-track')).toBeNull();
    bar.showPositionBar = true;
    await railSettled(el);

    // A pointer merely crossing the fresh rail must still reach the dashboard.
    const seen: string[] = [];
    const spy = (): void => {
      seen.push('move');
    };
    document.addEventListener('pointermove', spy);
    try {
      railRoot(el.shadowRoot!).querySelector('.pos-slider')!.dispatchEvent(move(50));
    } finally {
      document.removeEventListener('pointermove', spy);
    }
    expect(seen).toEqual(['move']);
  });

  // The rail swallows only the keys the slider actually CONSUMED, so a key it
  // ignores still reaches whatever wraps the card. `RailGestures` calls
  // preventDefault() on exactly the keys it handles and `_stopIfConsumed` reads
  // that back, which is why these events are `cancelable: true`: without it
  // happy-dom leaves `defaultPrevented` false and the gate silently degrades to
  // "never stop" — the state this pair exists to rule out.
  //
  // Note the tile body is NOT what this protects: `_onBodyKeydown` ignores any
  // keydown whose target is not the body itself, precisely so nested controls
  // keep their own Enter/Space. What is downstream is the dashboard around the
  // card.
  it('swallows a consumed slider key and lets an unrelated one through', async () => {
    const { el, slider, callService } = await mountRail();
    const escaped: string[] = [];
    const spy = (e: Event): void => {
      escaped.push((e as KeyboardEvent).key);
    };
    const key = (k: string): KeyboardEvent =>
      new KeyboardEvent('keydown', { bubbles: true, composed: true, cancelable: true, key: k });

    document.addEventListener('keydown', spy);
    try {
      slider.dispatchEvent(key('ArrowRight'));
      slider.dispatchEvent(key('Enter'));
    } finally {
      document.removeEventListener('keydown', spy);
    }
    await railSettled(el);
    expect(escaped).toEqual(['Enter']);
    // And the consumed one really was consumed: it moved the group, once.
    expect(callService).toHaveBeenCalledTimes(1);
  });

  it('arrow and Home/End keys step the drawn fill and commit immediately', async () => {
    const { el, slider, callService } = await mountRail();
    const sent = (): number[] =>
      callService.mock.calls.map((c) => (c[2] as { position: number }).position);
    // Steps from the drawn spread MINIMUM (40), not the aggregate mean.
    slider.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    await railSettled(el);
    expect(sent()).toEqual([59]);
    // Home/End name the ends of the TRACK, so on a mirrored axis Home is
    // logical 100 and End is logical 0.
    slider.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Home' }));
    slider.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'End' }));
    await railSettled(el);
    expect(sent()).toEqual([59, 100, 0]);
  });
});

// DOM order IS paint order for these `position: absolute; z-index: auto`
// layers, so an overlay drawn before the fill sinks the "moving to" indicator
// underneath it (#272).
//
// This call site used to be the odd one out: its non-spread fast path called
// `renderRailOverlay` as a following SIBLING of `renderRailFill` rather than
// through the helper's `overlay` slot, so the shared helper's own order tests
// could not see it and this guard had to pin the ordering by hand. #271 Part 2
// removed that divergence — every rail now reaches one call site inside
// `acp-rail-track`, and the order is decided there once.
//
// So what this guard is FOR has changed, and it is still worth its place: it
// pins that the group host actually threads `pendingPct` down into that shared
// call site. Drop the thread and the overlay stops rendering here entirely,
// which no other assertion in this file would notice.
describe('group tile — position rail fill/overlay order (#272 call-site order guard)', () => {
  const RECT = { left: 0, width: 100, top: 0, bottom: 8, right: 100, height: 8 };

  it('renders .pos-fill before the overlay once a committed move is pending', async () => {
    const callService = vi.fn();
    const el = await mount(
      makeHass({ callService: callService as unknown as (...a: unknown[]) => unknown }),
      makeDiscovered(),
    );
    const slider = railRoot(el.shadowRoot!).querySelector('.pos-slider') as HTMLElement;
    Object.defineProperty(slider, 'getBoundingClientRect', {
      value: () => RECT,
      configurable: true,
    });
    // A past-threshold drag-then-release, same as the #267 suite uses to
    // commit a move — the commit is what arms the "moving to" overlay.
    slider.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        composed: true,
        clientX: 20,
        pointerId: 1,
      }),
    );
    slider.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        composed: true,
        clientX: 80,
        pointerId: 1,
      }),
    );
    slider.dispatchEvent(
      new PointerEvent('pointerup', { bubbles: true, composed: true, clientX: 80, pointerId: 1 }),
    );
    await railSettled(el);
    expect(callService).toHaveBeenCalledTimes(1);
    const bar = railRoot(el.shadowRoot!).querySelector('.pos-bar') as HTMLElement;
    expect(bar).toBeTruthy();
    // The decorations `<slot>` carries no class and is not a drawn layer; its
    // own place between the pip and the marker is pinned once, at the element
    // level, in rail-track.test.ts.
    const order = Array.from(bar.children)
      .map((c) => c.className)
      .filter((n) => n !== '');
    expect(order).toEqual(['pos-fill', 'pos-travel', 'pos-pending']);
  });
});

// #271 Part 2: the band and the ticks are the group's own chrome, drawn ON the
// shared rail. They stay light-DOM children — so this component's plain class
// selectors still style them, and `.pos-band`'s containing block is still the
// `.pos-bar` it is positioned against in the flattened tree — handed down
// through the element's decorations slot.
describe('group tile — spread decorations are slotted onto the shared rail', () => {
  it('renders the band and one tick per distinct member value into the rail slot', async () => {
    const el = await mount(makeHass(), makeDiscovered());
    const bar = railRoot(el.shadowRoot!).querySelector('.pos-bar') as HTMLElement;
    // The fill is the element's; everything after it comes through the slot.
    expect(Array.from(bar.children).map((c) => c.className || c.localName)).toEqual([
      'pos-fill',
      'slot',
    ]);
    const slot = bar.querySelector('slot:not([name])') as HTMLSlotElement;
    // Drawn members are 60/40/100 on this mirrored blind, so three distinct
    // ticks, and the band spans the disagreement between the extremes.
    expect(slot.assignedElements().map((n) => n.className)).toEqual([
      'pos-band',
      'pos-tick',
      'pos-tick',
      'pos-tick',
    ]);
  });

  it('lets the ticks overhang the rail through the --acp-rail-overflow knob', () => {
    // The `.pos-bar { overflow: visible }` override cannot cross the element's
    // shadow boundary any more, so the host sets the knob and the element's own
    // rule reads it.
    expect(GroupTile.styles.toString()).toMatch(
      /acp-rail-track\s*\{[^}]*--acp-rail-overflow:\s*visible/,
    );
    expect(RailTrack.styles.toString()).toMatch(
      /\.pos-bar\s*\{[^}]*overflow:\s*var\(\s*--acp-rail-overflow\s*,\s*hidden\s*\)/,
    );
  });
});
