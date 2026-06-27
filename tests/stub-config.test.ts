import { describe, it, expect, vi } from 'vitest';
import type { HomeAssistant } from 'custom-card-helpers';
import { AdaptiveCoverProCard } from '../src/adaptive-cover-pro-card';
import { AdaptiveCoverProTileCard } from '../src/adaptive-cover-pro-tile-card';
import { AdaptiveCoverProSkyCompassCard } from '../src/adaptive-cover-pro-sky-compass-card';

function makeHass(callWS: (msg: unknown) => Promise<unknown>): HomeAssistant {
  return { callWS } as unknown as HomeAssistant;
}

const ACP_ENTRIES = [
  { entry_id: 'a1', title: 'Living Room', domain: 'adaptive_cover_pro' },
  { entry_id: 'b2', title: 'Kitchen', domain: 'adaptive_cover_pro' },
];

/** Minimal registry entries so fetchAcpConfigEntries' platform filter passes. */
const ACP_REGISTRY = [
  {
    entity_id: 'sensor.a1_foo',
    unique_id: 'a1_foo',
    platform: 'adaptive_cover_pro',
    config_entry_id: 'a1',
    device_id: null,
  },
  {
    entity_id: 'sensor.b2_foo',
    unique_id: 'b2_foo',
    platform: 'adaptive_cover_pro',
    config_entry_id: 'b2',
    device_id: null,
  },
];

/**
 * A callWS mock that dispatches between config_entries/get and the entity
 * registry list — fetchAcpConfigEntries now calls both in parallel.
 */
function makeAcpCallWS() {
  return vi.fn().mockImplementation((msg: { type: string }) => {
    if (msg.type === 'config/entity_registry/list') return Promise.resolve(ACP_REGISTRY);
    return Promise.resolve(ACP_ENTRIES);
  });
}

describe('getStubConfig — card-picker preview discovery', () => {
  describe('main card', () => {
    it('returns the first discovered entry_id', async () => {
      const hass = makeHass(makeAcpCallWS());
      const stub = await AdaptiveCoverProCard.getStubConfig(hass);
      expect(stub).toEqual({ type: 'custom:adaptive-cover-pro-card', entry_id: 'a1' });
    });

    it('falls back to an empty entry_id when no entries exist', async () => {
      const hass = makeHass(vi.fn().mockResolvedValue([]));
      const stub = await AdaptiveCoverProCard.getStubConfig(hass);
      expect(stub.entry_id).toBe('');
    });

    it('falls back to an empty entry_id when the websocket fetch rejects', async () => {
      const hass = makeHass(vi.fn().mockRejectedValue(new Error('boom')));
      const stub = await AdaptiveCoverProCard.getStubConfig(hass);
      expect(stub.entry_id).toBe('');
    });
  });

  describe('tile card', () => {
    it('returns the first discovered entry_id', async () => {
      const hass = makeHass(makeAcpCallWS());
      const stub = await AdaptiveCoverProTileCard.getStubConfig(hass);
      expect(stub).toEqual({ type: 'custom:adaptive-cover-pro-tile-card', entry_id: 'a1' });
    });

    it('falls back to an empty entry_id when the fetch rejects', async () => {
      const hass = makeHass(vi.fn().mockRejectedValue(new Error('boom')));
      const stub = await AdaptiveCoverProTileCard.getStubConfig(hass);
      expect(stub.entry_id).toBe('');
    });
  });

  describe('sky compass card', () => {
    it('wraps the first discovered entry_id in entry_ids', async () => {
      const hass = makeHass(makeAcpCallWS());
      const stub = await AdaptiveCoverProSkyCompassCard.getStubConfig(hass);
      expect(stub).toEqual({
        type: 'custom:adaptive-cover-pro-sky-compass-card',
        entry_ids: ['a1'],
      });
    });

    it('falls back to an empty entry_ids array when no entries exist', async () => {
      const hass = makeHass(vi.fn().mockResolvedValue([]));
      const stub = await AdaptiveCoverProSkyCompassCard.getStubConfig(hass);
      expect(stub.entry_ids).toEqual([]);
    });

    it('falls back to an empty entry_ids array when the fetch rejects', async () => {
      const hass = makeHass(vi.fn().mockRejectedValue(new Error('boom')));
      const stub = await AdaptiveCoverProSkyCompassCard.getStubConfig(hass);
      expect(stub.entry_ids).toEqual([]);
    });
  });
});
