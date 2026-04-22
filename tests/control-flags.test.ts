import { describe, it, expect } from 'vitest';
import { resolveControlFlags } from '../src/const';
import type { AdaptiveCoverProCardConfig } from '../src/types';

const base: AdaptiveCoverProCardConfig = { type: 'adaptive-cover-pro-card', entry_id: 'e1' };

describe('resolveControlFlags', () => {
  it('returns all true when config has no controls block', () => {
    expect(resolveControlFlags(base)).toEqual({
      integration_enabled: true,
      automatic_control: true,
      reset_manual_override: true,
    });
  });

  it('returns all true when controls is an empty object', () => {
    expect(resolveControlFlags({ ...base, controls: {} })).toEqual({
      integration_enabled: true,
      automatic_control: true,
      reset_manual_override: true,
    });
  });

  it('defaults missing keys to true and honors explicit false', () => {
    expect(resolveControlFlags({ ...base, controls: { integration_enabled: false } })).toEqual({
      integration_enabled: false,
      automatic_control: true,
      reset_manual_override: true,
    });
  });

  it('honors explicit true the same as undefined', () => {
    expect(resolveControlFlags({ ...base, controls: { reset_manual_override: true } })).toEqual({
      integration_enabled: true,
      automatic_control: true,
      reset_manual_override: true,
    });
  });

  it('accepts a partial controls block on the config type', () => {
    const cfg: AdaptiveCoverProCardConfig = { ...base, controls: { automatic_control: false } };
    const flags = resolveControlFlags(cfg);
    expect(flags.automatic_control).toBe(false);
  });
});
