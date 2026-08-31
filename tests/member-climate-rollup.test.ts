import { describe, it, expect } from 'vitest';
import type { HomeAssistant } from 'custom-card-helpers';

import { rollupMemberClimate } from '../src/lib/member-rollup';
import { INTEGRATION_DOMAIN } from '../src/const';
import type { EntityRegistryEntry } from '../src/lib/entity-registry';

/**
 * The climate half of the shared member rollup (issue #287).
 *
 * Mirrors `member-automation-rollup.test.ts` case for case, because the two rollups
 * are the same walk over the same registry with a different switch surveyed —
 * if a rule holds for automation it must hold for climate, and a divergence
 * here means the generalization leaked.
 */

/** One ACP cover entry's registry rows: its Cover_Position sensor (carrying the
 *  `actual_positions` roster), its Climate Mode switch, and Integration Enabled. */
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
    row('switch', 'Climate Mode', `${entryId}_climate_mode`),
    row('switch', 'Integration Enabled', `${entryId}_integration_enabled`),
  ];
}

interface MemberSpec {
  cover: string;
  climate: boolean;
  /** Omit for the usual case: the integration switch is on. */
  enabled?: boolean;
  /** Set true to drop the Climate Mode switch's STATE while keeping its
   *  registry row — an entity the user disabled in HA. */
  climateStateMissing?: boolean;
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
    if (!spec.climateStateMissing) {
      states[`switch.${entryId}_climate_mode`] = {
        state: spec.climate ? 'on' : 'off',
        attributes: {},
      };
    }
    states[`switch.${entryId}_integration_enabled`] = {
      state: spec.enabled === false ? 'off' : 'on',
      attributes: {},
    };
  }

  return { hass: { states } as unknown as HomeAssistant, registry };
}

describe('rollupMemberClimate', () => {
  it('is "all" when every member has climate mode on', () => {
    const { hass, registry } = makeFixture({
      left: { cover: 'cover.left', climate: true },
      right: { cover: 'cover.right', climate: true },
    });
    expect(rollupMemberClimate(hass, registry, ['cover.left', 'cover.right'])).toEqual({
      status: 'all',
      on: 2,
      total: 2,
    });
  });

  it('is "none" when every member has climate mode off', () => {
    const { hass, registry } = makeFixture({
      left: { cover: 'cover.left', climate: false },
      right: { cover: 'cover.right', climate: false },
    });
    expect(rollupMemberClimate(hass, registry, ['cover.left', 'cover.right'])).toEqual({
      status: 'none',
      on: 0,
      total: 2,
    });
  });

  it('is "some" when the members disagree', () => {
    const { hass, registry } = makeFixture({
      left: { cover: 'cover.left', climate: true },
      right: { cover: 'cover.right', climate: false },
    });
    expect(rollupMemberClimate(hass, registry, ['cover.left', 'cover.right'])).toEqual({
      status: 'some',
      on: 1,
      total: 2,
    });
  });

  // Same rule automation uses, and for the same reason: a member whose
  // integration is switched off is not doing climate either, and counting it as
  // on would be the same lie the group latch tells.
  it('does not count a member whose integration is disabled', () => {
    const { hass, registry } = makeFixture({
      left: { cover: 'cover.left', climate: true },
      right: { cover: 'cover.right', climate: true, enabled: false },
    });
    expect(rollupMemberClimate(hass, registry, ['cover.left', 'cover.right'])).toEqual({
      status: 'some',
      on: 1,
      total: 2,
    });
  });

  // A switch the user DISABLED in HA keeps its registry row but has no state.
  // That is an absence of data, not evidence of "off" — the member drops out of
  // the denominator rather than being reported as climate-off.
  it('drops a member whose climate switch has no state at all', () => {
    const { hass, registry } = makeFixture({
      left: { cover: 'cover.left', climate: true },
      right: { cover: 'cover.right', climate: false, climateStateMissing: true },
    });
    expect(rollupMemberClimate(hass, registry, ['cover.left', 'cover.right'])).toEqual({
      status: 'all',
      on: 1,
      total: 1,
    });
  });

  it('is "unknown" with no registry', () => {
    const { hass } = makeFixture({ left: { cover: 'cover.left', climate: true } });
    expect(rollupMemberClimate(hass, null, ['cover.left'])).toEqual({
      status: 'unknown',
      on: 0,
      total: 0,
    });
  });

  it('is "unknown" with an empty member list', () => {
    const { hass, registry } = makeFixture({ left: { cover: 'cover.left', climate: true } });
    expect(rollupMemberClimate(hass, registry, [])).toEqual({
      status: 'unknown',
      on: 0,
      total: 0,
    });
  });

  // A generic cover has no ACP entry behind it, so nothing can report on it.
  it('is "unknown" for an all-generic roster', () => {
    const { hass, registry } = makeFixture({ left: { cover: 'cover.left', climate: true } });
    expect(rollupMemberClimate(hass, registry, ['cover.hall_generic'])).toEqual({
      status: 'unknown',
      on: 0,
      total: 0,
    });
  });

  it('leaves a generic cover out of the denominator', () => {
    const { hass, registry } = makeFixture({ left: { cover: 'cover.left', climate: true } });
    expect(rollupMemberClimate(hass, registry, ['cover.left', 'cover.hall_generic'])).toEqual({
      status: 'all',
      on: 1,
      total: 1,
    });
  });

  // Counted in COVERS, not entries — a multi-cover entry shares one switch, but
  // "3 of 4 covers" is the actionable truth and covers are the unit the roster
  // and the who-won badge already use.
  it('counts a multi-cover entry once per cover', () => {
    const registry = entryRows('dual');
    const hass = {
      states: {
        'sensor.dual_cover_position': {
          state: '50',
          attributes: { actual_positions: { 'cover.a': 50, 'cover.b': 50 } },
        },
        'switch.dual_climate_mode': { state: 'on', attributes: {} },
        'switch.dual_integration_enabled': { state: 'on', attributes: {} },
      },
    } as unknown as HomeAssistant;
    expect(rollupMemberClimate(hass, registry, ['cover.a', 'cover.b'])).toEqual({
      status: 'all',
      on: 2,
      total: 2,
    });
  });

  // Climate and automation are independent switches on the same entry; reading
  // one must never fall through to the other.
  it('ignores the member automation switch entirely', () => {
    const registry = [
      ...entryRows('left'),
      {
        entity_id: 'switch.left_automatic_control',
        unique_id: 'left_Automatic Control',
        platform: INTEGRATION_DOMAIN,
        config_entry_id: 'left',
        device_id: 'device_left',
      },
    ];
    const hass = {
      states: {
        'sensor.left_cover_position': {
          state: '50',
          attributes: { actual_positions: { 'cover.left': 50 } },
        },
        // Climate OFF, automation ON — the rollup must report climate.
        'switch.left_climate_mode': { state: 'off', attributes: {} },
        'switch.left_automatic_control': { state: 'on', attributes: {} },
        'switch.left_integration_enabled': { state: 'on', attributes: {} },
      },
    } as unknown as HomeAssistant;
    expect(rollupMemberClimate(hass, registry, ['cover.left'])).toEqual({
      status: 'none',
      on: 0,
      total: 1,
    });
  });
});
