import { describe, it, expect } from 'vitest';
import { discoverEntities } from '../src/lib/entity-discovery';
import type { HomeAssistant } from 'custom-card-helpers';
import type { AdaptiveCoverProCardConfig } from '../src/types';

function makeHass(): HomeAssistant {
  const h: unknown = {
    entities: {
      'sensor.living_room_blinds_cover_position': {
        entity_id: 'sensor.living_room_blinds_cover_position',
        config_entry_id: 'entry1',
        translation_key: 'cover_position',
      },
      'sensor.living_room_blinds_sun_position': {
        entity_id: 'sensor.living_room_blinds_sun_position',
        config_entry_id: 'entry1',
        translation_key: 'sun_position',
      },
      'sensor.living_room_blinds_decision_trace': {
        entity_id: 'sensor.living_room_blinds_decision_trace',
        config_entry_id: 'entry1',
        translation_key: 'decision_trace',
      },
      'sensor.other_integration_thing': {
        entity_id: 'sensor.other_integration_thing',
        config_entry_id: 'other_entry',
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
    config: {
      entries: [{ entry_id: 'entry1', title: 'Living Room Blinds', domain: 'adaptive_cover_pro' }],
    },
  };
  return h as HomeAssistant;
}

describe('discoverEntities', () => {
  it('maps translation_keys to card roles and collects managed covers', () => {
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

  it('returns null when no entities belong to the entry', () => {
    const config: AdaptiveCoverProCardConfig = {
      type: 'custom:adaptive-cover-pro-card',
      entry_id: 'nonexistent',
    };
    expect(discoverEntities(makeHass(), config)).toBeNull();
  });
});
