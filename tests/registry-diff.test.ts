import { describe, it, expect } from 'vitest';
import { registryChanged, filterAcp, isAcpRegistryEvent } from '../src/lib/registry-diff';
import type { EntityRegistryEntry } from '../src/lib/entity-registry';

function entry(overrides: Partial<EntityRegistryEntry>): EntityRegistryEntry {
  return {
    entity_id: 'sensor.default',
    unique_id: 'entry_default',
    platform: 'sensor',
    config_entry_id: 'cfg1',
    device_id: null,
    ...overrides,
  };
}

const A = entry({
  entity_id: 'sensor.a',
  unique_id: 'cfg1_a',
  platform: 'sensor',
  config_entry_id: 'cfg1',
});
const B = entry({
  entity_id: 'switch.b',
  unique_id: 'cfg1_b',
  platform: 'switch',
  config_entry_id: 'cfg1',
});
const C = entry({
  entity_id: 'sensor.c',
  unique_id: 'cfg2_c',
  platform: 'sensor',
  config_entry_id: 'cfg2',
});

describe('registryChanged', () => {
  it('returns false for identical arrays', () => {
    expect(registryChanged([A, B], [A, B])).toBe(false);
  });

  it('returns false when order differs but content is same', () => {
    expect(registryChanged([A, B], [B, A])).toBe(false);
  });

  it('returns true when an entry is added', () => {
    expect(registryChanged([A], [A, B])).toBe(true);
  });

  it('returns true when an entry is removed', () => {
    expect(registryChanged([A, B], [A])).toBe(true);
  });

  it('returns true when entity_id changes', () => {
    const A2 = { ...A, entity_id: 'sensor.renamed' };
    expect(registryChanged([A], [A2])).toBe(true);
  });

  it('returns true when unique_id changes', () => {
    const A2 = { ...A, unique_id: 'cfg1_a_renamed' };
    expect(registryChanged([A], [A2])).toBe(true);
  });

  it('returns true when platform changes', () => {
    const A2 = { ...A, platform: 'binary_sensor' };
    expect(registryChanged([A], [A2])).toBe(true);
  });

  it('returns true when config_entry_id changes', () => {
    const A2 = { ...A, config_entry_id: 'cfg_other' };
    expect(registryChanged([A], [A2])).toBe(true);
  });

  it('returns false for two empty arrays', () => {
    expect(registryChanged([], [])).toBe(false);
  });
});

describe('filterAcp', () => {
  it('returns only entries matching entryId and platform', () => {
    const result = filterAcp([A, B, C], 'cfg1', 'sensor');
    expect(result).toEqual([A]);
  });

  it('returns empty array when nothing matches', () => {
    expect(filterAcp([A, B], 'cfg2', 'sensor')).toEqual([]);
  });

  it('returns all matching entries across platforms when platform is omitted', () => {
    const result = filterAcp([A, B, C], 'cfg1');
    expect(result).toHaveLength(2);
    expect(result).toContain(A);
    expect(result).toContain(B);
  });
});

describe('isAcpRegistryEvent', () => {
  const ACP_ENTITY_IDS = new Set([A.entity_id, B.entity_id]);

  it('returns true when entity_id is in the ACP set (update action)', () => {
    expect(isAcpRegistryEvent({ action: 'update', entity_id: A.entity_id }, ACP_ENTITY_IDS)).toBe(
      true,
    );
  });

  it('returns true when entity_id is in the ACP set (remove action)', () => {
    expect(isAcpRegistryEvent({ action: 'remove', entity_id: A.entity_id }, ACP_ENTITY_IDS)).toBe(
      true,
    );
  });

  it('returns false when entity_id is not in the ACP set and action is update', () => {
    expect(
      isAcpRegistryEvent({ action: 'update', entity_id: 'sensor.unrelated' }, ACP_ENTITY_IDS),
    ).toBe(false);
  });

  it('returns true for create action regardless of entity_id (new entity may be ACP)', () => {
    expect(
      isAcpRegistryEvent({ action: 'create', entity_id: 'sensor.brand_new' }, ACP_ENTITY_IDS),
    ).toBe(true);
  });

  it('returns false for remove action on unknown entity', () => {
    expect(
      isAcpRegistryEvent({ action: 'remove', entity_id: 'sensor.unrelated' }, ACP_ENTITY_IDS),
    ).toBe(false);
  });
});
