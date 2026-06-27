import { describe, it, expect, vi } from 'vitest';
import type { HomeAssistant } from 'custom-card-helpers';
import { fetchAcpConfigEntries } from '../src/lib/config-entries';

function makeHass(callWS: (msg: unknown) => Promise<unknown>): HomeAssistant {
  return { callWS } as unknown as HomeAssistant;
}

describe('fetchAcpConfigEntries', () => {
  it('passes domain=adaptive_cover_pro to the websocket call', async () => {
    const callWS = vi.fn().mockResolvedValue([]);
    await fetchAcpConfigEntries(makeHass(callWS));
    expect(callWS).toHaveBeenCalledWith({
      type: 'config_entries/get',
      domain: 'adaptive_cover_pro',
    });
  });

  it('filters out non-ACP entries defensively', async () => {
    const configEntries = [
      { entry_id: 'a1', title: 'Living Room', domain: 'adaptive_cover_pro' },
      { entry_id: 'b2', title: 'Kitchen', domain: 'adaptive_cover_pro' },
      { entry_id: 'c3', title: 'Random other', domain: 'hue' },
    ];
    const registryEntries = [
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
    const callWS = vi.fn().mockImplementation((msg: { type: string }) => {
      if (msg.type === 'config/entity_registry/list') return Promise.resolve(registryEntries);
      return Promise.resolve(configEntries);
    });
    const entries = await fetchAcpConfigEntries(makeHass(callWS));
    expect(entries).toEqual([
      { entry_id: 'a1', title: 'Living Room' },
      { entry_id: 'b2', title: 'Kitchen' },
    ]);
  });

  it('excludes building-profile entries that have no adaptive_cover_pro-platform entities', async () => {
    const configEntries = [
      { entry_id: 'cp1', title: 'Cover Profile 1', domain: 'adaptive_cover_pro' },
      {
        entry_id: 'bp1',
        title: 'Building Profile My Smart Home',
        domain: 'adaptive_cover_pro',
      },
    ];
    const registryEntries = [
      {
        entity_id: 'sensor.cp1_sun',
        unique_id: 'cp1_sun',
        platform: 'adaptive_cover_pro',
        config_entry_id: 'cp1',
        device_id: null,
      },
      // bp1 has NO adaptive_cover_pro-platform entities — only a non-ACP entity
      {
        entity_id: 'sensor.bp1_something',
        unique_id: 'bp1_something',
        platform: 'some_other_platform',
        config_entry_id: 'bp1',
        device_id: null,
      },
    ];
    const callWS = vi.fn().mockImplementation((msg: { type: string }) => {
      if (msg.type === 'config/entity_registry/list') return Promise.resolve(registryEntries);
      return Promise.resolve(configEntries);
    });
    const entries = await fetchAcpConfigEntries(makeHass(callWS));
    expect(entries).toEqual([{ entry_id: 'cp1', title: 'Cover Profile 1' }]);
  });

  it('returns an empty array when no ACP entries exist', async () => {
    const callWS = vi.fn().mockResolvedValue([]);
    const entries = await fetchAcpConfigEntries(makeHass(callWS));
    expect(entries).toEqual([]);
  });
});
