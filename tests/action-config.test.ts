import { describe, it, expect } from 'vitest';
import { normalizeActionConfig } from '../src/lib/action-config';

describe('normalizeActionConfig', () => {
  it('passes undefined through unchanged', () => {
    expect(normalizeActionConfig(undefined)).toBeUndefined();
  });

  it('leaves action: none unchanged', () => {
    const config = { action: 'none' } as const;
    expect(normalizeActionConfig(config)).toEqual({ action: 'none' });
  });

  it('leaves an existing call-service config unchanged', () => {
    const config = {
      action: 'call-service',
      service: 'cover.open_cover',
      service_data: { position: 50 },
    } as const;
    expect(normalizeActionConfig(config)).toEqual(config);
  });

  it('leaves action: more-info unchanged', () => {
    const config = { action: 'more-info' } as const;
    expect(normalizeActionConfig(config)).toEqual({ action: 'more-info' });
  });

  it('rewrites a perform-action config with no data to call-service with no service_data key', () => {
    const config = {
      action: 'perform-action',
      perform_action: 'button.press',
      target: { entity_id: 'button.reset' },
    } as const;
    const result = normalizeActionConfig(config);
    expect(result).toEqual({
      action: 'call-service',
      service: 'button.press',
      target: { entity_id: 'button.reset' },
    });
    expect(result).not.toHaveProperty('service_data');
    expect(result).not.toHaveProperty('perform_action');
    expect(result).not.toHaveProperty('data');
  });

  it('rewrites a perform-action config with data to call-service with service_data', () => {
    const config = {
      action: 'perform-action',
      perform_action: 'cover.open_cover',
      data: { position: 50 },
      target: { entity_id: 'cover.left' },
    } as const;
    const result = normalizeActionConfig(config);
    expect(result).toEqual({
      action: 'call-service',
      service: 'cover.open_cover',
      service_data: { position: 50 },
      target: { entity_id: 'cover.left' },
    });
  });

  // custom-card-helpers@2.0.0's own call-service case
  // (node_modules/custom-card-helpers/src/handle-action.ts:68-77) reads only
  // `actionConfig.service` / `actionConfig.service_data` — no fallback to
  // `perform_action`/`data` at all. So a config already spelled action:
  // 'call-service' but carrying the mirror-image `data` key (HA accepts
  // either spelling for extras) would otherwise reach handleAction with no
  // payload. The four cases below cover both fallback directions on both
  // action spellings, and that an already-populated field is never clobbered
  // by its mirror-image counterpart.

  it("falls back a call-service config's data field into service_data when service_data is absent", () => {
    const config = {
      action: 'call-service',
      service: 'cover.set_cover_position',
      data: { position: 50 },
    } as const;
    const result = normalizeActionConfig(config);
    expect(result).toEqual({
      action: 'call-service',
      service: 'cover.set_cover_position',
      service_data: { position: 50 },
    });
    expect(result).not.toHaveProperty('data');
  });

  it("keeps a call-service config's own service_data over a stray data field", () => {
    const config = {
      action: 'call-service',
      service: 'cover.set_cover_position',
      service_data: { position: 50 },
      data: { position: 0 },
    } as const;
    const result = normalizeActionConfig(config);
    expect(result).toEqual({
      action: 'call-service',
      service: 'cover.set_cover_position',
      service_data: { position: 50 },
    });
  });

  it("falls back a call-service config's perform_action field into service when service is absent", () => {
    const config = {
      action: 'call-service',
      perform_action: 'cover.set_cover_position',
      service_data: { position: 50 },
    } as const;
    const result = normalizeActionConfig(config);
    expect(result).toEqual({
      action: 'call-service',
      service: 'cover.set_cover_position',
      service_data: { position: 50 },
    });
    expect(result).not.toHaveProperty('perform_action');
  });

  it("keeps a call-service config's own service over a stray perform_action field", () => {
    const config = {
      action: 'call-service',
      service: 'cover.set_cover_position',
      perform_action: 'cover.open_cover',
    } as const;
    const result = normalizeActionConfig(config);
    expect(result).toEqual({
      action: 'call-service',
      service: 'cover.set_cover_position',
    });
  });

  it("falls back a perform-action config's legacy service field into service when perform_action is absent", () => {
    const config = {
      action: 'perform-action',
      service: 'cover.set_cover_position',
      data: { position: 50 },
    } as const;
    const result = normalizeActionConfig(config);
    expect(result).toEqual({
      action: 'call-service',
      service: 'cover.set_cover_position',
      service_data: { position: 50 },
    });
  });

  it("falls back a perform-action config's legacy service_data field into service_data when data is absent", () => {
    const config = {
      action: 'perform-action',
      perform_action: 'cover.set_cover_position',
      service_data: { position: 50 },
    } as const;
    const result = normalizeActionConfig(config);
    expect(result).toEqual({
      action: 'call-service',
      service: 'cover.set_cover_position',
      service_data: { position: 50 },
    });
  });
});
