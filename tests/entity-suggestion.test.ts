import { describe, it, expect } from 'vitest';

import { resolveEntryIdForEntity } from '../src/lib/entity-suggestion';

// Importing each card module runs its `window.customCards.push(...)` side effect,
// which is what registers `getEntitySuggestion` with HA's by-entity picker.
import '../src/adaptive-cover-pro-card';
import '../src/adaptive-cover-pro-tile-card';
import '../src/adaptive-cover-pro-decision-card';
import '../src/adaptive-cover-pro-sky-compass-card';
import '../src/adaptive-cover-pro-solar-chart-card';

import {
  CARD_NAME,
  TILE_CARD_NAME,
  DECISION_CARD_NAME,
  SKY_COMPASS_CARD_NAME,
  SOLAR_CHART_CARD_NAME,
} from '../src/const';

// Minimal `hass`-shaped fixture. The helper only reads `states`, `entities`, and
// `devices`, all of which HA hands the synchronous picker callback directly.
type MockHass = {
  states: Record<string, { attributes?: Record<string, unknown> }>;
  entities?: Record<string, { platform?: string; device_id?: string }>;
  devices?: Record<string, { primary_config_entry?: string | null; config_entries?: string[] }>;
};

describe('resolveEntryIdForEntity', () => {
  it('resolves a direct ACP entity to its device config entry', () => {
    const hass: MockHass = {
      states: {},
      entities: {
        'sensor.lr_cover_position': { platform: 'adaptive_cover_pro', device_id: 'dev1' },
      },
      devices: {
        dev1: { primary_config_entry: 'entry_lr', config_entries: ['entry_lr'] },
      },
    };
    expect(resolveEntryIdForEntity(hass, 'sensor.lr_cover_position')).toBe('entry_lr');
  });

  it('resolves a raw managed cover via a position sensor actual_positions roster', () => {
    const hass: MockHass = {
      states: {
        'sensor.lr_cover_position': {
          attributes: { actual_positions: { 'cover.living': 40 } },
        },
      },
      entities: {
        'sensor.lr_cover_position': { platform: 'adaptive_cover_pro', device_id: 'dev1' },
      },
      devices: {
        dev1: { primary_config_entry: 'entry_lr' },
      },
    };
    expect(resolveEntryIdForEntity(hass, 'cover.living')).toBe('entry_lr');
  });

  it('resolves a group member cover via member_positions and config_entries[0] fallback', () => {
    const hass: MockHass = {
      states: {
        'sensor.grp_group_position': {
          attributes: { member_positions: { 'cover.member': 70 } },
        },
      },
      entities: {
        'sensor.grp_group_position': { platform: 'adaptive_cover_pro', device_id: 'devG' },
      },
      // No primary_config_entry — must fall back to config_entries[0].
      devices: {
        devG: { config_entries: ['entry_g'] },
      },
    };
    expect(resolveEntryIdForEntity(hass, 'cover.member')).toBe('entry_g');
  });

  it('resolves a direct ACP group cover (cover.group_cover) via config_entries[0] fallback', () => {
    const hass: MockHass = {
      states: {},
      entities: {
        'cover.group_cover': { platform: 'adaptive_cover_pro', device_id: 'devG' },
      },
      devices: {
        devG: { config_entries: ['entry_g'] },
      },
    };
    expect(resolveEntryIdForEntity(hass, 'cover.group_cover')).toBe('entry_g');
  });

  it('returns null for a non-ACP entity', () => {
    const hass: MockHass = {
      states: {},
      entities: { 'light.x': { platform: 'demo', device_id: 'devD' } },
      devices: { devD: { primary_config_entry: 'entry_demo' } },
    };
    expect(resolveEntryIdForEntity(hass, 'light.x')).toBeNull();
  });

  it('returns null for an unknown entity', () => {
    const hass: MockHass = { states: {}, entities: {}, devices: {} };
    expect(resolveEntryIdForEntity(hass, 'sensor.nope')).toBeNull();
  });

  it('returns null for a cover.* not present in any ACP roster', () => {
    const hass: MockHass = {
      states: {
        'sensor.lr_cover_position': {
          attributes: { actual_positions: { 'cover.other': 40 } },
        },
      },
      entities: {
        'sensor.lr_cover_position': { platform: 'adaptive_cover_pro', device_id: 'dev1' },
      },
      devices: { dev1: { primary_config_entry: 'entry_lr' } },
    };
    expect(resolveEntryIdForEntity(hass, 'cover.living')).toBeNull();
  });

  it('returns null when a roster match belongs to a non-ACP sensor', () => {
    const hass: MockHass = {
      states: {
        'sensor.foreign': {
          attributes: { actual_positions: { 'cover.living': 40 } },
        },
      },
      entities: {
        'sensor.foreign': { platform: 'other_integration', device_id: 'devX' },
      },
      devices: { devX: { primary_config_entry: 'entry_x' } },
    };
    expect(resolveEntryIdForEntity(hass, 'cover.living')).toBeNull();
  });

  it('returns null for an ACP entity with no device_id', () => {
    const hass: MockHass = {
      states: {},
      entities: { 'sensor.orphan': { platform: 'adaptive_cover_pro' } },
      devices: {},
    };
    expect(resolveEntryIdForEntity(hass, 'sensor.orphan')).toBeNull();
  });
});

describe('getEntitySuggestion card registrations', () => {
  // A mock hass that resolves the probe entity to `entry_lr`.
  const resolvingHass: MockHass = {
    states: {},
    entities: {
      'sensor.lr_cover_position': { platform: 'adaptive_cover_pro', device_id: 'dev1' },
    },
    devices: { dev1: { primary_config_entry: 'entry_lr', config_entries: ['entry_lr'] } },
  };
  const emptyHass: MockHass = { states: {}, entities: {}, devices: {} };

  const findEntry = (type: string) =>
    (window.customCards ?? []).find((c) => c.type === type) as
      | {
          type: string;
          getEntitySuggestion?: (
            hass: unknown,
            entityId: string,
          ) => { label?: string; config: unknown } | null;
        }
      | undefined;

  const ENTRY_ID_CARDS = [CARD_NAME, TILE_CARD_NAME, DECISION_CARD_NAME];
  const ENTRY_IDS_CARDS = [SKY_COMPASS_CARD_NAME, SOLAR_CHART_CARD_NAME];

  for (const type of [...ENTRY_ID_CARDS, ...ENTRY_IDS_CARDS]) {
    it(`${type} registers a getEntitySuggestion function`, () => {
      const entry = findEntry(type);
      expect(entry, `no customCards entry for ${type}`).toBeDefined();
      expect(typeof entry?.getEntitySuggestion).toBe('function');
    });

    it(`${type} returns null for an unresolved entity`, () => {
      const entry = findEntry(type);
      expect(entry?.getEntitySuggestion?.(emptyHass, 'sensor.nope')).toBeNull();
    });
  }

  for (const type of ENTRY_ID_CARDS) {
    it(`${type} suggests a config keyed by entry_id`, () => {
      const entry = findEntry(type);
      expect(entry?.getEntitySuggestion?.(resolvingHass, 'sensor.lr_cover_position')).toEqual({
        config: { type: `custom:${type}`, entry_id: 'entry_lr' },
      });
    });
  }

  for (const type of ENTRY_IDS_CARDS) {
    it(`${type} suggests a config keyed by entry_ids`, () => {
      const entry = findEntry(type);
      expect(entry?.getEntitySuggestion?.(resolvingHass, 'sensor.lr_cover_position')).toEqual({
        config: { type: `custom:${type}`, entry_ids: ['entry_lr'] },
      });
    });
  }
});
