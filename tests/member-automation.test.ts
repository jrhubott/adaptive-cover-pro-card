import { describe, it, expect } from 'vitest';
import type { HomeAssistant } from 'custom-card-helpers';

import { rollupMemberAutomation } from '../src/lib/member-automation';
import { INTEGRATION_DOMAIN } from '../src/const';
import type { EntityRegistryEntry } from '../src/lib/entity-registry';

/** One ACP cover entry's registry rows: its Cover_Position sensor (which
 *  carries the `actual_positions` roster) plus the two automation switches. */
function entryRows(entryId: string): EntityRegistryEntry[] {
  const row = (platform: string, suffix: string, object: string): EntityRegistryEntry => ({
    entity_id: `${platform}.${object}`,
    unique_id: `${entryId}_${suffix}`,
    platform: INTEGRATION_DOMAIN,
    config_entry_id: entryId,
    device_id: `device_${entryId}`,
  });
  return [
    row('sensor', 'Cover_Position', `${entryId}_cover_position`),
    row('switch', 'Automatic Control', `${entryId}_automatic_control`),
    row('switch', 'Integration Enabled', `${entryId}_integration_enabled`),
  ];
}

interface MemberSpec {
  /** The raw cover this entry manages — the id the group lists as a member. */
  cover: string;
  auto: boolean;
  /** Omit for the usual case: the integration switch is on. */
  enabled?: boolean;
}

function makeFixture(members: Record<string, MemberSpec>): {
  hass: HomeAssistant;
  registry: EntityRegistryEntry[];
} {
  const registry: EntityRegistryEntry[] = [];
  const states: Record<string, { state: string; attributes: Record<string, unknown> }> = {};

  for (const [entryId, spec] of Object.entries(members)) {
    registry.push(...entryRows(entryId));
    states[`sensor.${entryId}_cover_position`] = {
      state: '50',
      attributes: { actual_positions: { [spec.cover]: 50 } },
    };
    states[`switch.${entryId}_automatic_control`] = {
      state: spec.auto ? 'on' : 'off',
      attributes: {},
    };
    states[`switch.${entryId}_integration_enabled`] = {
      state: spec.enabled === false ? 'off' : 'on',
      attributes: {},
    };
  }

  return { hass: { states } as unknown as HomeAssistant, registry };
}

describe('rollupMemberAutomation', () => {
  it('is "all" when every member has automatic control on', () => {
    const { hass, registry } = makeFixture({
      left: { cover: 'cover.left', auto: true },
      right: { cover: 'cover.right', auto: true },
    });
    expect(rollupMemberAutomation(hass, registry, ['cover.left', 'cover.right'])).toEqual({
      status: 'all',
      on: 2,
      total: 2,
    });
  });

  it('is "none" when every member has automatic control off', () => {
    const { hass, registry } = makeFixture({
      left: { cover: 'cover.left', auto: false },
      right: { cover: 'cover.right', auto: false },
    });
    expect(rollupMemberAutomation(hass, registry, ['cover.left', 'cover.right'])).toEqual({
      status: 'none',
      on: 0,
      total: 2,
    });
  });

  it('is "some" when the members disagree', () => {
    const { hass, registry } = makeFixture({
      left: { cover: 'cover.left', auto: true },
      right: { cover: 'cover.right', auto: false },
    });
    expect(rollupMemberAutomation(hass, registry, ['cover.left', 'cover.right'])).toEqual({
      status: 'some',
      on: 1,
      total: 2,
    });
  });

  // The whole point of the rollup: the group's own switch is a write-only latch
  // that defaults to on, so a member toggled at its own tile is the case the
  // button has to stop lying about.
  it('counts a member with the integration disabled as not automated', () => {
    const { hass, registry } = makeFixture({
      left: { cover: 'cover.left', auto: true },
      right: { cover: 'cover.right', auto: true, enabled: false },
    });
    expect(rollupMemberAutomation(hass, registry, ['cover.left', 'cover.right'])).toEqual({
      status: 'some',
      on: 1,
      total: 2,
    });
  });

  // An older integration may not expose the master switch at all; its absence
  // must not read as "disabled" and grey out a fully automated group.
  it('treats a missing Integration Enabled switch as enabled', () => {
    const { hass, registry } = makeFixture({ left: { cover: 'cover.left', auto: true } });
    const trimmed = registry.filter((e) => !e.unique_id.endsWith('_Integration Enabled'));
    expect(rollupMemberAutomation(hass, trimmed, ['cover.left'])).toEqual({
      status: 'all',
      on: 1,
      total: 1,
    });
  });

  it('is "unknown" with no registry — the cache is cold on first paint', () => {
    const { hass } = makeFixture({ left: { cover: 'cover.left', auto: true } });
    expect(rollupMemberAutomation(hass, null, ['cover.left'])).toEqual({
      status: 'unknown',
      on: 0,
      total: 0,
    });
  });

  it('is "unknown" for an empty roster', () => {
    const { hass, registry } = makeFixture({ left: { cover: 'cover.left', auto: true } });
    expect(rollupMemberAutomation(hass, registry, [])).toEqual({
      status: 'unknown',
      on: 0,
      total: 0,
    });
  });

  // A generic cover the group drives has no ACP pipeline and therefore no
  // automation to report; a roster of nothing but those resolves to nothing.
  it('is "unknown" when no member resolves to an ACP entry', () => {
    const { hass, registry } = makeFixture({ left: { cover: 'cover.left', auto: true } });
    expect(rollupMemberAutomation(hass, registry, ['cover.hall_generic'])).toEqual({
      status: 'unknown',
      on: 0,
      total: 0,
    });
  });

  it('ignores unresolvable members instead of counting them against the total', () => {
    const { hass, registry } = makeFixture({ left: { cover: 'cover.left', auto: true } });
    expect(rollupMemberAutomation(hass, registry, ['cover.left', 'cover.hall_generic'])).toEqual({
      status: 'all',
      on: 1,
      total: 1,
    });
  });

  // One ACP entry can manage several covers and the group lists each one. The
  // count is in COVERS — the unit the roster, the who-won badge and the word
  // "members" use everywhere else in the card — even though the shared switch
  // behind them is read once.
  it('counts every cover of a multi-cover entry', () => {
    const registry = entryRows('living');
    const hass = {
      states: {
        'sensor.living_cover_position': {
          state: '50',
          attributes: { actual_positions: { 'cover.left': 50, 'cover.right': 50 } },
        },
        'switch.living_automatic_control': { state: 'on', attributes: {} },
        'switch.living_integration_enabled': { state: 'on', attributes: {} },
      },
    } as unknown as HomeAssistant;
    expect(rollupMemberAutomation(hass, registry, ['cover.left', 'cover.right'])).toEqual({
      status: 'all',
      on: 2,
      total: 2,
    });
  });

  // Counting entries instead would report "1 of 2" here and understate how much
  // of the group has stopped tracking.
  it('weights a multi-cover entry by its covers', () => {
    const registry = [...entryRows('living'), ...entryRows('hall')];
    const hass = {
      states: {
        'sensor.living_cover_position': {
          state: '50',
          attributes: { actual_positions: { 'cover.left': 50, 'cover.right': 50 } },
        },
        'switch.living_automatic_control': { state: 'off', attributes: {} },
        'switch.living_integration_enabled': { state: 'on', attributes: {} },
        'sensor.hall_cover_position': {
          state: '50',
          attributes: { actual_positions: { 'cover.hall': 50 } },
        },
        'switch.hall_automatic_control': { state: 'on', attributes: {} },
        'switch.hall_integration_enabled': { state: 'on', attributes: {} },
      },
    } as unknown as HomeAssistant;
    expect(
      rollupMemberAutomation(hass, registry, ['cover.left', 'cover.right', 'cover.hall']),
    ).toEqual({ status: 'some', on: 1, total: 3 });
  });

  // A switch the user has DISABLED in HA stays in the entity registry but has no
  // state at all. That is an absence of data, not evidence of "off" — inventing
  // a definite grey "automation off" from it is the exact class of claim this
  // module exists to stop making. (An `unavailable` state is different: the
  // entity is reporting, and what it reports is not `on`.)
  it('excludes a member whose Automatic Control switch has no state', () => {
    const { hass, registry } = makeFixture({ left: { cover: 'cover.left', auto: true } });
    delete (hass.states as Record<string, unknown>)['switch.left_automatic_control'];
    expect(rollupMemberAutomation(hass, registry, ['cover.left'])).toEqual({
      status: 'unknown',
      on: 0,
      total: 0,
    });
  });

  // A group is itself an ACP entry with a `member_positions` roster. Resolving
  // through it would make the group its own member.
  it('never resolves a member through a group entry roster', () => {
    const registry = [
      ...entryRows('living'),
      {
        entity_id: 'sensor.the_group_position',
        unique_id: 'the_group_group_position',
        platform: INTEGRATION_DOMAIN,
        config_entry_id: 'the_group',
        device_id: 'device_the_group',
      },
    ];
    const hass = {
      states: {
        'sensor.living_cover_position': {
          state: '50',
          attributes: { actual_positions: { 'cover.left': 50 } },
        },
        'switch.living_automatic_control': { state: 'off', attributes: {} },
        'switch.living_integration_enabled': { state: 'on', attributes: {} },
        'sensor.the_group_position': {
          state: '50',
          attributes: { member_positions: { 'cover.left': 50 } },
        },
      },
    } as unknown as HomeAssistant;
    expect(rollupMemberAutomation(hass, registry, ['cover.left'])).toEqual({
      status: 'none',
      on: 0,
      total: 1,
    });
  });

  it('treats an unavailable automatic-control switch as not automated', () => {
    const { hass, registry } = makeFixture({ left: { cover: 'cover.left', auto: true } });
    (hass.states as Record<string, { state: string }>)['switch.left_automatic_control'].state =
      'unavailable';
    expect(rollupMemberAutomation(hass, registry, ['cover.left'])).toEqual({
      status: 'none',
      on: 0,
      total: 1,
    });
  });
});
