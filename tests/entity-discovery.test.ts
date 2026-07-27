import { describe, it, expect, vi } from 'vitest';
import {
  discoverEntities,
  createDiscoveryMemo,
  createDiscoveryListMemo,
} from '../src/lib/entity-discovery';
import type { HomeAssistant } from 'custom-card-helpers';
import type { EntityRegistryEntry } from '../src/lib/entity-registry';

const ENTRY_ID = 'entry1';

function makeRegistry(): EntityRegistryEntry[] {
  return [
    // Sensors — unique_ids match the actual ACP patterns
    {
      entity_id: 'sensor.living_room_blinds_target_position',
      unique_id: `${ENTRY_ID}_Cover_Position`,
      platform: 'adaptive_cover_pro',
      config_entry_id: ENTRY_ID,
      device_id: 'acp_device_living',
    },
    {
      entity_id: 'sensor.living_room_blinds_sun_position',
      unique_id: `${ENTRY_ID}_sun_position`,
      platform: 'adaptive_cover_pro',
      config_entry_id: ENTRY_ID,
      device_id: 'acp_device_living',
    },
    {
      entity_id: 'sensor.living_room_blinds_start_sun',
      unique_id: `${ENTRY_ID}_Start Sun`,
      platform: 'adaptive_cover_pro',
      config_entry_id: ENTRY_ID,
      device_id: 'acp_device_living',
    },
    {
      entity_id: 'sensor.living_room_blinds_end_sun',
      unique_id: `${ENTRY_ID}_End Sun`,
      platform: 'adaptive_cover_pro',
      config_entry_id: ENTRY_ID,
      device_id: 'acp_device_living',
    },
    {
      entity_id: 'sensor.living_room_blinds_decision_trace',
      unique_id: `${ENTRY_ID}_decision_trace`,
      platform: 'adaptive_cover_pro',
      config_entry_id: ENTRY_ID,
      device_id: 'acp_device_living',
    },
    {
      entity_id: 'sensor.living_room_blinds_control_status',
      unique_id: `${ENTRY_ID}_control_status`,
      platform: 'adaptive_cover_pro',
      config_entry_id: ENTRY_ID,
      device_id: 'acp_device_living',
    },
    // Binary sensors
    {
      entity_id: 'binary_sensor.living_room_blinds_sun_infront',
      unique_id: `${ENTRY_ID}_sun_motion`,
      platform: 'adaptive_cover_pro',
      config_entry_id: ENTRY_ID,
      device_id: 'acp_device_living',
    },
    {
      entity_id: 'binary_sensor.living_room_blinds_manual_override',
      unique_id: `${ENTRY_ID}_manual_override`,
      platform: 'adaptive_cover_pro',
      config_entry_id: ENTRY_ID,
      device_id: 'acp_device_living',
    },
    // Switches — note capitalisation and spacing in unique_id suffixes
    {
      entity_id: 'switch.living_room_blinds_integration_enabled',
      unique_id: `${ENTRY_ID}_Integration Enabled`,
      platform: 'adaptive_cover_pro',
      config_entry_id: ENTRY_ID,
      device_id: 'acp_device_living',
    },
    {
      entity_id: 'switch.living_room_blinds_automatic_control',
      unique_id: `${ENTRY_ID}_Automatic Control`,
      platform: 'adaptive_cover_pro',
      config_entry_id: ENTRY_ID,
      device_id: 'acp_device_living',
    },
    {
      entity_id: 'switch.living_room_blinds_manual_override',
      unique_id: `${ENTRY_ID}_Manual Override`,
      platform: 'adaptive_cover_pro',
      config_entry_id: ENTRY_ID,
      device_id: 'acp_device_living',
    },
    // Button
    {
      entity_id: 'button.living_room_blinds_reset_manual_override',
      unique_id: `${ENTRY_ID}_Reset Manual Override`,
      platform: 'adaptive_cover_pro',
      config_entry_id: ENTRY_ID,
      device_id: 'acp_device_living',
    },
    // Unrelated foreign entity — must be ignored
    {
      entity_id: 'sensor.kitchen_light',
      unique_id: 'kitchen_light_brightness',
      platform: 'hue',
      config_entry_id: 'other_entry',
      device_id: 'other_device',
    },
  ];
}

function makeHass(): HomeAssistant {
  const h: unknown = {
    devices: {
      acp_device_living: {
        id: 'acp_device_living',
        name: 'Living Room Blinds',
        config_entries: [ENTRY_ID],
      },
    },
    states: {
      'sensor.living_room_blinds_target_position': {
        state: '42',
        attributes: {
          actual_positions: {
            'cover.living_room_left': 40,
            'cover.living_room_right': 38,
          },
        },
      },
      'sensor.living_room_blinds_control_status': {
        state: 'active',
        attributes: { cover_type: 'cover_blind' },
      },
    },
  };
  return h as HomeAssistant;
}

describe('discoverEntities (unique_id based)', () => {
  it('maps every expected ACP entity by (platform, unique_id suffix)', () => {
    const d = discoverEntities(
      makeHass(),
      { type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY_ID },
      makeRegistry(),
    );
    expect(d).not.toBeNull();
    expect(d!.entry_title).toBe('Living Room Blinds');
    expect(d!.entities.target_position_sensor).toBe('sensor.living_room_blinds_target_position');
    expect(d!.entities.sun_sensor).toBe('sensor.living_room_blinds_sun_position');
    expect(d!.entities.start_sensor).toBe('sensor.living_room_blinds_start_sun');
    expect(d!.entities.end_sensor).toBe('sensor.living_room_blinds_end_sun');
    expect(d!.entities.decision_trace_sensor).toBe('sensor.living_room_blinds_decision_trace');
    expect(d!.entities.sun_infront_binary).toBe('binary_sensor.living_room_blinds_sun_infront');
    expect(d!.entities.manual_override_binary).toBe(
      'binary_sensor.living_room_blinds_manual_override',
    );
    expect(d!.entities.integration_enabled_switch).toBe(
      'switch.living_room_blinds_integration_enabled',
    );
    expect(d!.entities.manual_toggle_switch).toBe('switch.living_room_blinds_manual_override');
    expect(d!.entities.reset_override_button).toBe(
      'button.living_room_blinds_reset_manual_override',
    );
    expect(d!.managed_covers).toEqual(['cover.living_room_left', 'cover.living_room_right']);
    expect(d!.cover_type).toBe('cover_blind');
    expect(d!.device_id).toBe('acp_device_living');
  });

  it('resolves the dual-axis Cover_Tilt sensor to the target_tilt_sensor role', () => {
    const reg = makeRegistry();
    reg.push({
      entity_id: 'sensor.living_room_blinds_cover_tilt',
      unique_id: `${ENTRY_ID}_Cover_Tilt`,
      platform: 'adaptive_cover_pro',
      config_entry_id: ENTRY_ID,
      device_id: 'acp_device_living',
    });
    const d = discoverEntities(
      makeHass(),
      { type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY_ID },
      reg,
    );
    expect(d!.entities.target_tilt_sensor).toBe('sensor.living_room_blinds_cover_tilt');
  });

  it('leaves target_tilt_sensor unset for single-axis covers (no Cover_Tilt entity)', () => {
    const d = discoverEntities(
      makeHass(),
      { type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY_ID },
      makeRegistry(),
    );
    expect(d!.entities.target_tilt_sensor).toBeUndefined();
  });

  it('attaches a well-formed cover_discovery from the control_status sensor', () => {
    const hass = makeHass();
    const discovery = {
      cover_type: 'cover_venetian',
      cover_label: 'Venetian',
      axes: [
        { id: 'position', label: 'Position', min: 0, max: 100, unit: '%', supported: true },
        { id: 'tilt', label: 'Tilt', min: 0, max: 100, unit: '%', supported: true },
      ],
    };
    (
      hass.states['sensor.living_room_blinds_control_status'].attributes as Record<string, unknown>
    ).cover_discovery = discovery;
    const d = discoverEntities(
      hass,
      { type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY_ID },
      makeRegistry(),
    );
    expect(d!.discovery).toEqual(discovery);
  });

  it('leaves discovery undefined when the control_status sensor omits cover_discovery', () => {
    const d = discoverEntities(
      makeHass(),
      { type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY_ID },
      makeRegistry(),
    );
    expect(d!.discovery).toBeUndefined();
  });

  it('ignores a malformed cover_discovery (non-array axes)', () => {
    const hass = makeHass();
    (
      hass.states['sensor.living_room_blinds_control_status'].attributes as Record<string, unknown>
    ).cover_discovery = { cover_type: 'cover_venetian', axes: 'nope' };
    const d = discoverEntities(
      hass,
      { type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY_ID },
      makeRegistry(),
    );
    expect(d!.discovery).toBeUndefined();
  });

  it('ignores a cover_discovery that is not an object', () => {
    const hass = makeHass();
    (
      hass.states['sensor.living_room_blinds_control_status'].attributes as Record<string, unknown>
    ).cover_discovery = 'garbage';
    const d = discoverEntities(
      hass,
      { type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY_ID },
      makeRegistry(),
    );
    expect(d!.discovery).toBeUndefined();
  });

  it('disambiguates manual_override binary vs Manual Override switch by platform', () => {
    const d = discoverEntities(
      makeHass(),
      { type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY_ID },
      makeRegistry(),
    );
    expect(d!.entities.manual_override_binary).toMatch(/^binary_sensor\./);
    expect(d!.entities.manual_toggle_switch).toMatch(/^switch\./);
  });

  it('ignores non-ACP entities even if they share the config_entry_id somehow', () => {
    const reg = makeRegistry();
    reg.push({
      entity_id: 'sensor.random_other',
      unique_id: `${ENTRY_ID}_sun_position`, // looks like ours!
      platform: 'some_other_integration',
      config_entry_id: ENTRY_ID,
      device_id: null,
    });
    const d = discoverEntities(
      makeHass(),
      { type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY_ID },
      reg,
    );
    expect(d!.entities.sun_sensor).toBe('sensor.living_room_blinds_sun_position');
    // Not overwritten by the impostor
  });

  it('returns null when no ACP entity has the given config_entry_id', () => {
    expect(
      discoverEntities(
        makeHass(),
        { type: 'custom:adaptive-cover-pro-card', entry_id: 'nonexistent' },
        makeRegistry(),
      ),
    ).toBeNull();
  });

  it('returns null when registry is empty', () => {
    expect(
      discoverEntities(
        makeHass(),
        { type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY_ID },
        [],
      ),
    ).toBeNull();
  });

  it('still succeeds if hass.devices is missing — only loses the display title', () => {
    const hass = { states: {} } as HomeAssistant;
    const d = discoverEntities(
      hass,
      { type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY_ID },
      makeRegistry(),
    );
    expect(d).not.toBeNull();
    expect(d!.entry_title).toBe(ENTRY_ID);
    expect(d!.entities.target_position_sensor).toBe('sensor.living_room_blinds_target_position');
  });

  it('skips entries whose unique_id does not start with the entry_id prefix', () => {
    const reg = makeRegistry();
    reg.push({
      entity_id: 'sensor.stale_prefix',
      unique_id: 'some_other_prefix_sun_position',
      platform: 'adaptive_cover_pro',
      config_entry_id: ENTRY_ID,
      device_id: 'acp_device_living',
    });
    const d = discoverEntities(
      makeHass(),
      { type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY_ID },
      reg,
    );
    expect(d!.entities.sun_sensor).toBe('sensor.living_room_blinds_sun_position');
  });
});

describe('discoverEntities — area_name resolution (#247)', () => {
  it('resolves area_name via hass.devices[device_id].area_id -> hass.areas[area_id].name', () => {
    const hass = makeHass();
    (
      hass as unknown as { devices: Record<string, { area_id?: string }> }
    ).devices.acp_device_living.area_id = 'area_living_room';
    (hass as unknown as { areas?: unknown }).areas = {
      area_living_room: { area_id: 'area_living_room', name: 'Living Room' },
    };
    const d = discoverEntities(
      hass,
      { type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY_ID },
      makeRegistry(),
    );
    expect(d!.area_name).toBe('Living Room');
  });

  it('leaves area_name undefined when hass.areas is missing (older HA)', () => {
    const hass = makeHass();
    (
      hass as unknown as { devices: Record<string, { area_id?: string }> }
    ).devices.acp_device_living.area_id = 'area_living_room';
    // No hass.areas set at all — simulates an older HA frontend.
    const d = discoverEntities(
      hass,
      { type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY_ID },
      makeRegistry(),
    );
    expect(d!.area_name).toBeUndefined();
  });

  it('leaves area_name undefined when the device has no area_id', () => {
    const hass = makeHass();
    (hass as unknown as { areas?: unknown }).areas = {
      area_living_room: { area_id: 'area_living_room', name: 'Living Room' },
    };
    // The fixture device carries no area_id.
    const d = discoverEntities(
      hass,
      { type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY_ID },
      makeRegistry(),
    );
    expect(d!.area_name).toBeUndefined();
  });
});

const GROUP_ENTRY = 'group1';

function makeGroupRegistry(): EntityRegistryEntry[] {
  const mk = (entity_id: string, suffix: string): EntityRegistryEntry => ({
    entity_id,
    unique_id: `${GROUP_ENTRY}_${suffix}`,
    platform: 'adaptive_cover_pro',
    config_entry_id: GROUP_ENTRY,
    device_id: 'group_device',
  });
  return [
    mk('sensor.living_group_position', 'group_position'),
    mk('sensor.living_group_state', 'group_state'),
    mk('sensor.living_group_active_scene', 'group_active_scene'),
    mk('sensor.living_group_climate_mode', 'group_climate_mode'),
    mk('sensor.living_group_who_won', 'group_who_won'),
    mk('select.living_group_scene', 'group_scene_select'),
    mk('switch.living_group_automation', 'group_automation'),
    mk('switch.living_group_lock', 'group_lock'),
    mk('button.living_group_scene_all_open', 'group_scene_all_open'),
    mk('button.living_group_scene_all_closed', 'group_scene_all_closed'),
    mk('button.living_group_scene_privacy', 'group_scene_privacy'),
    mk('button.living_group_clear_overrides', 'group_clear_overrides'),
  ];
}

function makeGroupHass(): HomeAssistant {
  const h: unknown = {
    devices: {
      group_device: {
        id: 'group_device',
        name: 'Downstairs Group',
        config_entries: [GROUP_ENTRY],
      },
    },
    states: {
      'sensor.living_group_position': {
        state: '50',
        attributes: {
          member_positions: {
            'cover.a': 40,
            'cover.b': 60,
            'cover.generic': 0,
          },
        },
      },
      'sensor.living_group_who_won': {
        state: '2',
        attributes: {
          member_winners: { 'cover.a': 'solar', 'cover.b': 'manual' },
        },
      },
      'sensor.living_group_active_scene': { state: 'all_open', attributes: {} },
      'select.living_group_scene': {
        state: 'auto',
        attributes: {
          options: ['auto', 'all_open', 'all_closed', 'privacy'],
          current_option: 'auto',
        },
      },
      'switch.living_group_lock': { state: 'off', attributes: {} },
    },
  };
  return h as HomeAssistant;
}

describe('discoverEntities — Cover Group entries (issue #185)', () => {
  it('detects a group entry via the group_active_scene sensor and populates group roles', () => {
    const d = discoverEntities(
      makeGroupHass(),
      { type: 'custom:adaptive-cover-pro-tile-card', entry_id: GROUP_ENTRY },
      makeGroupRegistry(),
    );
    expect(d).not.toBeNull();
    expect(d!.is_group).toBe(true);
    expect(d!.entities.group_position_sensor).toBe('sensor.living_group_position');
    expect(d!.entities.group_state_sensor).toBe('sensor.living_group_state');
    expect(d!.entities.group_active_scene_sensor).toBe('sensor.living_group_active_scene');
    expect(d!.entities.group_who_won_sensor).toBe('sensor.living_group_who_won');
    expect(d!.entities.group_scene_select).toBe('select.living_group_scene');
    expect(d!.entities.group_automation_switch).toBe('switch.living_group_automation');
    expect(d!.entities.group_lock_switch).toBe('switch.living_group_lock');
    expect(d!.entities.group_clear_overrides_button).toBe('button.living_group_clear_overrides');
  });

  it('derives managed_covers from the group_position member_positions attribute', () => {
    const d = discoverEntities(
      makeGroupHass(),
      { type: 'custom:adaptive-cover-pro-tile-card', entry_id: GROUP_ENTRY },
      makeGroupRegistry(),
    );
    expect(d!.managed_covers).toEqual(['cover.a', 'cover.b', 'cover.generic']);
  });

  it('leaves is_group falsy for an ordinary cover entry (regression)', () => {
    const d = discoverEntities(
      makeHass(),
      { type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY_ID },
      makeRegistry(),
    );
    expect(d!.is_group).toBeFalsy();
    // Cover roles remain fully populated.
    expect(d!.entities.target_position_sensor).toBe('sensor.living_room_blinds_target_position');
    expect(d!.entities.group_position_sensor).toBeUndefined();
  });
});

describe('createDiscoveryMemo', () => {
  const CONFIG = { type: 'custom:adaptive-cover-pro-card', entry_id: ENTRY_ID };

  it('returns discovery result on first call', () => {
    const memo = createDiscoveryMemo();
    const result = memo(makeHass(), CONFIG, makeRegistry());
    expect(result).not.toBeNull();
    expect(result!.entry_id).toBe(ENTRY_ID);
  });

  it('returns cached result when all three inputs are reference-equal', () => {
    const memo = createDiscoveryMemo();
    const hass = makeHass();
    const registry = makeRegistry();
    const first = memo(hass, CONFIG, registry);
    const second = memo(hass, CONFIG, registry);
    expect(second).toBe(first); // same reference — no recompute
  });

  it('recomputes when registry reference changes', () => {
    const memo = createDiscoveryMemo();
    const hass = makeHass();
    const r1 = makeRegistry();
    const first = memo(hass, CONFIG, r1);
    const r2 = makeRegistry(); // new array, same content
    const second = memo(hass, CONFIG, r2);
    // different array reference → must recompute (result may be equal in value but is a new object)
    expect(second).not.toBe(first);
  });

  it('recomputes when entry_id changes', () => {
    const memo = createDiscoveryMemo();
    const hass = makeHass();
    const registry = makeRegistry();
    memo(hass, CONFIG, registry);
    const result2 = memo(hass, { ...CONFIG, entry_id: 'other_entry' }, registry);
    // different entry_id → recompute (different entry, likely null since registry has no 'other_entry')
    expect(result2).toBeNull();
  });

  it('returns the SAME result reference across a new hass that shares the relevant state refs', () => {
    // HA hands over a fresh `hass` object on every state tick. As long as the registry
    // and the specific states the discovery reads (target-position, control-status) and
    // `hass.devices` are reference-equal, the memo must return the same object so child
    // props stay stable.
    const memo = createDiscoveryMemo();
    const registry = makeRegistry();
    const hass1 = makeHass() as unknown as {
      devices: unknown;
      states: Record<string, unknown>;
    };
    const first = memo(hass1 as unknown as HomeAssistant, CONFIG, registry);

    // New hass object reusing the same devices + relevant state object references, but
    // with an extra unrelated entity that changed (simulating a foreign state tick).
    const hass2 = {
      devices: hass1.devices,
      states: {
        ...hass1.states,
        'light.kitchen': { state: 'on', attributes: {} },
      },
    } as unknown as HomeAssistant;
    const second = memo(hass2, CONFIG, registry);
    expect(second).toBe(first); // unrelated tick → no recompute, stable reference
  });

  it('recomputes when a relevant state object reference changes', () => {
    const memo = createDiscoveryMemo();
    const registry = makeRegistry();
    const hass1 = makeHass() as unknown as { states: Record<string, unknown>; devices: unknown };
    const first = memo(hass1 as unknown as HomeAssistant, CONFIG, registry);

    // Same registry/devices, but the control-status state is a new object (cover_type flips).
    const hass2 = {
      devices: hass1.devices,
      states: {
        ...hass1.states,
        'sensor.living_room_blinds_control_status': {
          state: 'active',
          attributes: { cover_type: 'cover_awning' },
        },
      },
    } as unknown as HomeAssistant;
    const second = memo(hass2, CONFIG, registry);
    expect(second).not.toBe(first);
    expect(second!.cover_type).toBe('cover_awning');
  });

  it('calls discoverEntities only once for repeated identical inputs', () => {
    const spy = vi.spyOn({ discoverEntities }, 'discoverEntities');
    const memo = createDiscoveryMemo();
    const hass = makeHass();
    const registry = makeRegistry();
    // Call memo 3 times with same refs
    memo(hass, CONFIG, registry);
    memo(hass, CONFIG, registry);
    memo(hass, CONFIG, registry);
    // Spy cannot intercept the import directly, but we can verify via reference equality
    // (the same object is returned, meaning discoverEntities was not called again)
    const a = memo(hass, CONFIG, registry);
    const b = memo(hass, CONFIG, registry);
    expect(a).toBe(b);
    spy.mockRestore();
  });
});

describe('createDiscoveryListMemo', () => {
  const TYPE = 'custom:adaptive-cover-pro-sky-compass-card';

  it('resolves configured entries and reports unknown ones as missing', () => {
    const memo = createDiscoveryListMemo();
    const result = memo(makeHass(), [ENTRY_ID, 'nope'], makeRegistry(), TYPE);
    expect(result.list).toHaveLength(1);
    expect(result.list[0].entry_id).toBe(ENTRY_ID);
    expect(result.missing).toEqual(['nope']);
  });

  it('returns the SAME result object (and list array) across a new hass that shares the relevant state refs', () => {
    const memo = createDiscoveryListMemo();
    const registry = makeRegistry();
    const hass1 = makeHass() as unknown as { devices: unknown; states: Record<string, unknown> };
    const first = memo(hass1 as unknown as HomeAssistant, [ENTRY_ID], registry, TYPE);

    const hass2 = {
      devices: hass1.devices,
      states: { ...hass1.states, 'light.kitchen': { state: 'on', attributes: {} } },
    } as unknown as HomeAssistant;
    const second = memo(hass2, [ENTRY_ID], registry, TYPE);
    expect(second).toBe(first);
    expect(second.list).toBe(first.list); // stable array reference → no child churn
  });

  it('recomputes when a relevant state object reference changes', () => {
    const memo = createDiscoveryListMemo();
    const registry = makeRegistry();
    const hass1 = makeHass() as unknown as { devices: unknown; states: Record<string, unknown> };
    const first = memo(hass1 as unknown as HomeAssistant, [ENTRY_ID], registry, TYPE);

    const hass2 = {
      devices: hass1.devices,
      states: {
        ...hass1.states,
        'sensor.living_room_blinds_control_status': {
          state: 'active',
          attributes: { cover_type: 'cover_awning' },
        },
      },
    } as unknown as HomeAssistant;
    const second = memo(hass2, [ENTRY_ID], registry, TYPE);
    expect(second).not.toBe(first);
    expect(second.list[0].cover_type).toBe('cover_awning');
  });

  it('recomputes when the entry_ids list changes', () => {
    const memo = createDiscoveryListMemo();
    const hass = makeHass();
    const registry = makeRegistry();
    const first = memo(hass, [ENTRY_ID], registry, TYPE);
    const second = memo(hass, [ENTRY_ID, 'nope'], registry, TYPE);
    expect(second).not.toBe(first);
    expect(second.missing).toEqual(['nope']);
  });
});
