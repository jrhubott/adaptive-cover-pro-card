import { describe, it, expect } from 'vitest';
import { discoverEntities } from '../src/lib/entity-discovery';
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
