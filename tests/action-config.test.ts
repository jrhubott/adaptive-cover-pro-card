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
});
