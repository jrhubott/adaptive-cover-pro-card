import { describe, it, expect, beforeEach } from 'vitest';

import { resolveEntryIdForEntity } from '../src/lib/entity-suggestion';
import { loadEntityRegistry, _resetRegistryStore } from '../src/lib/registry-store';
import type { EntityRegistryEntry } from '../src/lib/entity-registry';

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

// The resolver only reads `states` (for the managed-cover roster) and `callWS`
// (to warm a cold registry cache) off `hass`. The config-entry mapping comes from
// the full entity registry, NOT from `hass.entities`/`hass.devices` — those omit
// `config_entry_id`, and the device is shared with the source integration.
type MockHass = {
  states: Record<string, { attributes?: Record<string, unknown> }>;
  callWS?: <T>(msg: { type: string }) => Promise<T>;
};

/** Build a full-registry entry. `unique_id`/`device_id` are irrelevant to
 *  resolution now (config_entry_id is authoritative) but kept realistic. */
function reg(
  entity_id: string,
  config_entry_id: string | null,
  platform = 'adaptive_cover_pro',
  device_id: string | null = null,
): EntityRegistryEntry {
  return {
    entity_id,
    unique_id: `${config_entry_id ?? 'x'}_${entity_id}`,
    platform,
    config_entry_id,
    device_id,
  };
}

/** Populate the shared in-memory registry cache the sync resolver reads. */
async function prime(entries: EntityRegistryEntry[]): Promise<void> {
  await loadEntityRegistry({ callWS: async () => entries } as unknown as Parameters<
    typeof loadEntityRegistry
  >[0]);
}

beforeEach(() => {
  _resetRegistryStore();
});

describe('resolveEntryIdForEntity', () => {
  it('resolves a direct ACP entity to its own config_entry_id', async () => {
    await prime([reg('sensor.lr_cover_position', 'entry_lr')]);
    expect(resolveEntryIdForEntity({ states: {} }, 'sensor.lr_cover_position')).toBe('entry_lr');
  });

  it('resolves a raw managed cover to the ACP sensor config_entry_id, not the shared device entry', async () => {
    // Regression guard for #183: ACP attaches its position sensor to the SOURCE
    // cover's device, which also belongs to the source integration's config entry.
    // Resolution must use the ACP sensor's own config_entry_id (entry_acp), never
    // anything device-derived (the device's primary entry is entry_zha here).
    await prime([
      reg('sensor.acp_cover_position', 'entry_acp', 'adaptive_cover_pro', 'shared_dev'),
      reg('cover.zha_shade', 'entry_zha', 'zha', 'shared_dev'),
    ]);
    const hass: MockHass = {
      states: {
        'sensor.acp_cover_position': {
          attributes: { actual_positions: { 'cover.zha_shade': 40 } },
        },
      },
    };
    expect(resolveEntryIdForEntity(hass, 'cover.zha_shade')).toBe('entry_acp');
  });

  it('resolves a group member cover via member_positions', async () => {
    await prime([reg('sensor.grp_group_position', 'entry_g')]);
    const hass: MockHass = {
      states: {
        'sensor.grp_group_position': { attributes: { member_positions: { 'cover.member': 70 } } },
      },
    };
    expect(resolveEntryIdForEntity(hass, 'cover.member')).toBe('entry_g');
  });

  it('resolves a direct ACP group cover (cover.group_cover)', async () => {
    await prime([reg('cover.group_cover', 'entry_g')]);
    expect(resolveEntryIdForEntity({ states: {} }, 'cover.group_cover')).toBe('entry_g');
  });

  it('returns null when the registry cache is cold', () => {
    // No prime → the shared cache is empty; the resolver cannot resolve synchronously.
    expect(resolveEntryIdForEntity({ states: {} }, 'sensor.lr_cover_position')).toBeNull();
  });

  it('kicks a registry fetch on a cold cache so a later call can resolve', async () => {
    let fetched = false;
    const hass: MockHass = {
      states: {},
      callWS: async () => {
        fetched = true;
        return [reg('sensor.warm', 'entry_w')] as never;
      },
    };
    expect(resolveEntryIdForEntity(hass, 'sensor.warm')).toBeNull();
    await new Promise((r) => setTimeout(r, 0));
    expect(fetched).toBe(true);
    expect(resolveEntryIdForEntity({ states: {} }, 'sensor.warm')).toBe('entry_w');
  });

  it('returns null for a non-ACP entity', async () => {
    await prime([reg('light.x', 'entry_demo', 'demo')]);
    expect(resolveEntryIdForEntity({ states: {} }, 'light.x')).toBeNull();
  });

  it('returns null for an unknown entity', async () => {
    await prime([reg('sensor.other', 'entry_o')]);
    expect(resolveEntryIdForEntity({ states: {} }, 'sensor.nope')).toBeNull();
  });

  it('returns null for a cover.* not present in any ACP roster', async () => {
    await prime([reg('sensor.lr_cover_position', 'entry_lr')]);
    const hass: MockHass = {
      states: {
        'sensor.lr_cover_position': { attributes: { actual_positions: { 'cover.other': 40 } } },
      },
    };
    expect(resolveEntryIdForEntity(hass, 'cover.living')).toBeNull();
  });

  it('returns null when a roster match belongs to a non-ACP sensor', async () => {
    await prime([reg('sensor.foreign', 'entry_x', 'other_integration')]);
    const hass: MockHass = {
      states: {
        'sensor.foreign': { attributes: { actual_positions: { 'cover.living': 40 } } },
      },
    };
    expect(resolveEntryIdForEntity(hass, 'cover.living')).toBeNull();
  });

  it('returns null for an ACP entity whose config_entry_id is null', async () => {
    await prime([reg('sensor.orphan', null)]);
    expect(resolveEntryIdForEntity({ states: {} }, 'sensor.orphan')).toBeNull();
  });
});

describe('getEntitySuggestion card registrations', () => {
  const resolvingHass: MockHass = { states: {} };

  beforeEach(async () => {
    await prime([reg('sensor.lr_cover_position', 'entry_lr')]);
  });

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
      expect(entry?.getEntitySuggestion?.(resolvingHass, 'sensor.nope')).toBeNull();
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
