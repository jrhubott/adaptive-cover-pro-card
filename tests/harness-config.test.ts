import { describe, expect, it } from 'vitest';

import '../harness/src/card-stage';
import { defaultBadges, defaultScenarioConfig, normalizeConfig } from '../harness/src/scenarios';
import type { HarnessConfig } from '../harness/src/types';

interface CardStageLike extends HTMLElement {
  config: HarnessConfig;
  _compassConfig(): Record<string, unknown>;
  _tileConfig(entryId: string): Record<string, unknown>;
}

describe('normalizeConfig', () => {
  it('backfills tile.badges when a persisted config predates the field', () => {
    // Simulate a config saved before `tile.badges` existed (the regression that
    // blanked the control panel: the badges fieldset read `tile.badges[k]`).
    const legacy = defaultScenarioConfig();
    delete (legacy.tile as { badges?: unknown }).badges;

    const normalized = normalizeConfig(legacy as HarnessConfig);

    expect(normalized.tile.badges).toEqual(defaultBadges());
  });

  it('preserves explicit badge opt-outs while filling the rest', () => {
    const cfg = defaultScenarioConfig();
    cfg.tile.badges = { motion: false } as HarnessConfig['tile']['badges'];

    const normalized = normalizeConfig(cfg);

    expect(normalized.tile.badges.motion).toBe(false);
    expect(normalized.tile.badges.solar).toBe(true);
    expect(normalized.tile.badges.glare_zone).toBe(true);
  });

  it('leaves a fully-specified config unchanged', () => {
    const cfg = defaultScenarioConfig();
    expect(normalizeConfig(cfg).tile.badges).toEqual(defaultBadges());
  });
});

describe('show_elevation_chart harness plumbing', () => {
  it('default scenario config sets compass.show_elevation_chart and tile.show_elevation_chart to true', () => {
    const cfg = defaultScenarioConfig();
    expect(cfg.compass.show_elevation_chart).toBe(true);
    expect(cfg.tile.show_elevation_chart).toBe(true);
  });

  it('card-stage threads show_elevation_chart into the compass card config', () => {
    const el = document.createElement('acp-harness-card-stage') as unknown as CardStageLike;
    el.config = defaultScenarioConfig();
    expect(el._compassConfig().show_elevation_chart).toBe(true);
  });

  it('card-stage threads show_elevation_chart into the tile card config', () => {
    const el = document.createElement('acp-harness-card-stage') as unknown as CardStageLike;
    const cfg = defaultScenarioConfig();
    cfg.tile.show_elevation_chart = false;
    el.config = cfg;
    expect(el._tileConfig(cfg.entries[0].entry_id).show_elevation_chart).toBe(false);
  });
});
