import { describe, it, expect } from 'vitest';
import { discoverEntities } from '../src/lib/entity-discovery';
import type { HomeAssistant } from 'custom-card-helpers';
import type { AdaptiveCoverProCardConfig } from '../src/types';

function makeHass(): HomeAssistant {
  const h: unknown = {
    devices: {
      acp_device_living: {
        id: 'acp_device_living',
        name: 'Living Room Blinds',
        config_entries: ['entry1'],
        primary_config_entry: 'entry1',
      },
      other_device: {
        id: 'other_device',
        name: 'Kitchen Light',
        config_entries: ['other_entry'],
      },
    },
    entities: {
      'sensor.living_room_blinds_cover_position': {
        entity_id: 'sensor.living_room_blinds_cover_position',
        device_id: 'acp_device_living',
        translation_key: 'cover_position',
      },
      'sensor.living_room_blinds_sun_position': {
        entity_id: 'sensor.living_room_blinds_sun_position',
        device_id: 'acp_device_living',
        translation_key: 'sun_position',
      },
      'sensor.living_room_blinds_decision_trace': {
        entity_id: 'sensor.living_room_blinds_decision_trace',
        device_id: 'acp_device_living',
        translation_key: 'decision_trace',
      },
      'sensor.living_room_blinds_unmapped': {
        entity_id: 'sensor.living_room_blinds_unmapped',
        device_id: 'acp_device_living',
        translation_key: 'something_not_in_map',
      },
      'sensor.other_integration_thing': {
        entity_id: 'sensor.other_integration_thing',
        device_id: 'other_device',
        translation_key: 'something',
      },
    },
    states: {
      'sensor.living_room_blinds_cover_position': {
        state: '42',
        attributes: {
          actual_positions: {
            'cover.living_room_left': 40,
            'cover.living_room_right': 38,
          },
        },
      },
    },
  };
  return h as HomeAssistant;
}

describe('discoverEntities', () => {
  it('walks devices + entities for the config entry and maps translation_keys to roles', () => {
    const config: AdaptiveCoverProCardConfig = {
      type: 'custom:adaptive-cover-pro-card',
      entry_id: 'entry1',
    };
    const d = discoverEntities(makeHass(), config);
    expect(d).not.toBeNull();
    expect(d!.entry_id).toBe('entry1');
    expect(d!.entry_title).toBe('Living Room Blinds');
    expect(d!.entities.target_position_sensor).toBe('sensor.living_room_blinds_cover_position');
    expect(d!.entities.sun_sensor).toBe('sensor.living_room_blinds_sun_position');
    expect(d!.entities.decision_trace_sensor).toBe('sensor.living_room_blinds_decision_trace');
    expect(d!.managed_covers).toEqual(['cover.living_room_left', 'cover.living_room_right']);
  });

  it('returns null when no device matches the entry_id', () => {
    const config: AdaptiveCoverProCardConfig = {
      type: 'custom:adaptive-cover-pro-card',
      entry_id: 'nonexistent',
    };
    expect(discoverEntities(makeHass(), config)).toBeNull();
  });

  it('returns null when hass.devices / hass.entities are missing', () => {
    const config: AdaptiveCoverProCardConfig = {
      type: 'custom:adaptive-cover-pro-card',
      entry_id: 'entry1',
    };
    const bare = { states: {} } as HomeAssistant;
    expect(discoverEntities(bare, config)).toBeNull();
  });

  it('prefers name_by_user over name for the entry title', () => {
    const hass = makeHass() as HomeAssistant & { devices: Record<string, unknown> };
    (hass.devices['acp_device_living'] as Record<string, unknown>).name_by_user = 'My Blinds';
    const d = discoverEntities(hass, {
      type: 'custom:adaptive-cover-pro-card',
      entry_id: 'entry1',
    });
    expect(d!.entry_title).toBe('My Blinds');
  });

  it('ignores entities whose translation_key is unknown', () => {
    const d = discoverEntities(makeHass(), {
      type: 'custom:adaptive-cover-pro-card',
      entry_id: 'entry1',
    });
    // the unmapped `something_not_in_map` sensor belongs to the same device but must not land
    const values = Object.values(d!.entities);
    expect(values).not.toContain('sensor.living_room_blinds_unmapped');
  });
});
