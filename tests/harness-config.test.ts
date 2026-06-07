import { describe, expect, it } from 'vitest';

import '../harness/src/card-stage';
import '../harness/src/control-panel';
import {
  defaultBadges,
  defaultScenarioConfig,
  findScenario,
  normalizeConfig,
} from '../harness/src/scenarios';
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

interface ControlPanelLike extends HTMLElement {
  config: HarnessConfig;
  updateComplete: Promise<boolean>;
}

async function mountControlPanel(cfg: HarnessConfig): Promise<ControlPanelLike> {
  const el = document.createElement('acp-harness-control-panel') as unknown as ControlPanelLike;
  el.config = cfg;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function findCheckboxByLabel(el: ControlPanelLike, label: string): HTMLInputElement | undefined {
  const rows = Array.from(el.shadowRoot!.querySelectorAll('label.row'));
  const row = rows.find((r) => r.querySelector('span')?.textContent?.trim() === label);
  return row?.querySelector('input[type="checkbox"]') as HTMLInputElement | undefined;
}

describe('control-panel in_time_window toggle (issue #128)', () => {
  it('renders an "In schedule window" checkbox bound to the per-entry flag', async () => {
    const el = await mountControlPanel(defaultScenarioConfig());
    const checkbox = findCheckboxByLabel(el, 'In schedule window');
    expect(checkbox).toBeTruthy();
    // default scenario has in_time_window: true
    expect(checkbox!.checked).toBe(true);
  });

  it('emits config-change flipping in_time_window to false when unchecked', async () => {
    const el = await mountControlPanel(defaultScenarioConfig());
    let emitted: HarnessConfig | undefined;
    el.addEventListener('config-change', (e) => {
      emitted = (e as CustomEvent<{ config: HarnessConfig }>).detail.config;
    });
    const checkbox = findCheckboxByLabel(el, 'In schedule window')!;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));
    expect(emitted).toBeTruthy();
    expect(emitted!.entries[0].flags.in_time_window).toBe(false);
  });

  it('renders a schedule-end "no bound" toggle that nulls the end when unchecked', async () => {
    const el = await mountControlPanel(defaultScenarioConfig());
    let emitted: HarnessConfig | undefined;
    el.addEventListener('config-change', (e) => {
      emitted = (e as CustomEvent<{ config: HarnessConfig }>).detail.config;
    });
    // The label carries the formatted bound; match by prefix.
    const rows = Array.from(el.shadowRoot!.querySelectorAll('label.row'));
    const endRow = rows.find((r) =>
      r.querySelector('span')?.textContent?.trim().startsWith('Schedule end'),
    );
    expect(endRow).toBeTruthy();
    const toggle = endRow!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(toggle.checked).toBe(true); // default scenario has an end bound
    toggle.checked = false;
    toggle.dispatchEvent(new Event('change'));
    expect(emitted!.entries[0].flags.schedule_end_minutes).toBeNull();
  });
});

describe('outside-schedule scenario (issue #128)', () => {
  it('exposes an "outside-schedule" scenario that sets in_time_window false', () => {
    const scenario = findScenario('outside-schedule');
    expect(scenario).toBeTruthy();
    const cfg = scenario!.build();
    expect(cfg.entries[0].flags.in_time_window).toBe(false);
  });

  it('outside-schedule carries a concrete schedule window (start + end minutes)', () => {
    const cfg = findScenario('outside-schedule')!.build();
    expect(cfg.entries[0].flags.schedule_start_minutes).toBe(7 * 60 + 30);
    expect(cfg.entries[0].flags.schedule_end_minutes).toBe(21 * 60);
  });
});

describe('schedule window scenarios (issue #128 Track B)', () => {
  it('default entry flags include a schedule window', () => {
    const cfg = defaultScenarioConfig();
    expect(cfg.entries[0].flags.schedule_start_minutes).toBe(7 * 60 + 30);
    expect(cfg.entries[0].flags.schedule_end_minutes).toBe(21 * 60);
  });

  it('exposes a midnight-spanning scenario (end ≤ start)', () => {
    const scenario = findScenario('schedule-spans-midnight');
    expect(scenario).toBeTruthy();
    const cfg = scenario!.build();
    const start = cfg.entries[0].flags.schedule_start_minutes!;
    const end = cfg.entries[0].flags.schedule_end_minutes!;
    expect(end).toBeLessThanOrEqual(start);
  });

  it('exposes an open-ended scenario (one bound null)', () => {
    const scenario = findScenario('schedule-open-ended');
    expect(scenario).toBeTruthy();
    const cfg = scenario!.build();
    const { schedule_start_minutes, schedule_end_minutes } = cfg.entries[0].flags;
    expect(schedule_start_minutes === null || schedule_end_minutes === null).toBe(true);
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
