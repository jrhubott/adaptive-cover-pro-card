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
    const callWS = vi.fn().mockResolvedValue([
      { entry_id: 'a1', title: 'Living Room', domain: 'adaptive_cover_pro' },
      { entry_id: 'b2', title: 'Kitchen', domain: 'adaptive_cover_pro' },
      { entry_id: 'c3', title: 'Random other', domain: 'hue' },
    ]);
    const entries = await fetchAcpConfigEntries(makeHass(callWS));
    expect(entries).toEqual([
      { entry_id: 'a1', title: 'Living Room' },
      { entry_id: 'b2', title: 'Kitchen' },
    ]);
  });

  it('returns an empty array when no ACP entries exist', async () => {
    const callWS = vi.fn().mockResolvedValue([]);
    const entries = await fetchAcpConfigEntries(makeHass(callWS));
    expect(entries).toEqual([]);
  });
});
