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
  _rootConfig(): Record<string, unknown>;
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

describe('cover colors + actual-vs-target harness plumbing (issue #132)', () => {
  it('card-stage threads cover_colors (entry color) into the root card config', () => {
    const el = document.createElement('acp-harness-card-stage') as unknown as CardStageLike;
    const cfg = defaultScenarioConfig();
    el.config = cfg;
    expect(el._rootConfig().cover_colors).toEqual([cfg.entries[0].color]);
  });

  it('exposes a "compass-actual-vs-target" scenario whose actual mean ≠ target', () => {
    const scenario = findScenario('compass-actual-vs-target');
    expect(scenario).toBeTruthy();
    const cfg = scenario!.build();
    const entry = cfg.entries[0];
    const positions = entry.covers
      .map((c) => c.position)
      .filter((p): p is number => typeof p === 'number');
    const mean = positions.reduce((a, b) => a + b, 0) / positions.length;
    expect(mean).not.toBe(entry.target_position);
  });
});

describe('card-stage remounts cards when the entry set changes (multi-window stale-registry fix)', () => {
  // The cards fetch the mock entity registry once and cache it (the mock's event
  // subscription is a no-op). When the configured entry set changes the stage
  // must remount its cards so each refetches the new scenario's registry —
  // otherwise switching to e.g. the multi-window scenario discovers against the
  // prior scenario's entities and renders "No matching Adaptive Cover Pro entities".
  interface StageInternals extends CardStageLike {
    _compassEl?: HTMLElement;
    updateComplete: Promise<boolean>;
  }

  it('remounts the compass card on entry-set change but reuses it otherwise', async () => {
    const el = document.createElement('acp-harness-card-stage') as unknown as StageInternals;
    document.body.appendChild(el);
    try {
      el.config = defaultScenarioConfig();
      await el.updateComplete;
      const first = el._compassEl;
      expect(first).toBeTruthy();

      // Different entry_ids (multi-window) → remount.
      el.config = normalizeConfig(findScenario('multi-window')!.build());
      await el.updateComplete;
      expect(el._compassEl).toBeTruthy();
      expect(el._compassEl).not.toBe(first);

      // Same entry set, unrelated config change → reuse the element.
      const reused = el._compassEl;
      el.config = { ...el.config, compass: { ...el.config.compass } };
      await el.updateComplete;
      expect(el._compassEl).toBe(reused);
    } finally {
      el.remove();
    }
  });
});

describe('card-stage activeCard filter (one tab per card)', () => {
  interface FilterableStage extends CardStageLike {
    activeCard?: 'root' | 'compass' | 'tile';
    hass?: unknown;
    _compassEl?: { hass?: unknown };
    updateComplete: Promise<boolean>;
  }

  function hosts(el: FilterableStage): { root: boolean; compass: boolean; tile: boolean } {
    const sr = (el as unknown as { shadowRoot: ShadowRoot }).shadowRoot;
    return {
      root: !!sr.getElementById('root-host'),
      compass: !!sr.getElementById('compass-host'),
      tile: !!sr.getElementById('tile-host'),
    };
  }

  it('renders only the active card, and all cards when unset', async () => {
    const el = document.createElement('acp-harness-card-stage') as unknown as FilterableStage;
    document.body.appendChild(el);
    try {
      el.config = defaultScenarioConfig();
      await el.updateComplete;
      // Unset (the contract the threading/remount tests + capture scripts rely on).
      expect(hosts(el)).toEqual({ root: true, compass: true, tile: true });

      el.activeCard = 'tile';
      await el.updateComplete;
      expect(hosts(el)).toEqual({ root: false, compass: false, tile: true });

      el.activeCard = 'root';
      await el.updateComplete;
      expect(hosts(el)).toEqual({ root: true, compass: false, tile: false });
    } finally {
      el.remove();
    }
  });

  it('re-attaches tiles to the fresh tile-host after navigating away and back', async () => {
    // Switching tabs makes Lit destroy and recreate the conditional #tile-host
    // div. The retained tile elements must be re-parented onto the new host on
    // return — otherwise (entry count unchanged) neither create/remove loop runs
    // and the tile tab renders blank.
    interface TileStage extends FilterableStage {
      _tileEls: HTMLElement[];
    }
    const el = document.createElement('acp-harness-card-stage') as unknown as TileStage;
    document.body.appendChild(el);
    try {
      el.config = defaultScenarioConfig();
      el.activeCard = 'tile';
      await el.updateComplete;
      const sr = (el as unknown as { shadowRoot: ShadowRoot }).shadowRoot;
      const want = el.config.entries.length;
      expect(sr.getElementById('tile-host')!.childElementCount).toBe(want);

      // Away…
      el.activeCard = 'root';
      await el.updateComplete;
      // …and back: the tile-host is a brand-new div and must receive the tiles.
      el.activeCard = 'tile';
      await el.updateComplete;
      const host = sr.getElementById('tile-host')!;
      expect(host.childElementCount).toBe(want);
      for (const t of el._tileEls) expect(t.parentElement).toBe(host);
    } finally {
      el.remove();
    }
  });

  it('pushes hass to a card mounted on a tab switch (not just on hass/config change)', async () => {
    const el = document.createElement('acp-harness-card-stage') as unknown as FilterableStage;
    document.body.appendChild(el);
    try {
      const hass = { fake: true };
      el.config = defaultScenarioConfig();
      el.hass = hass;
      el.activeCard = 'root';
      await el.updateComplete;

      // Switching to compass mounts a card that never existed before; only
      // activeCard changed, so hass must still reach the freshly created element.
      el.activeCard = 'compass';
      await el.updateComplete;
      expect(el._compassEl).toBeTruthy();
      expect(el._compassEl!.hass).toBe(hass);
    } finally {
      el.remove();
    }
  });
});

describe('legend-live-glyphs scenario (issue #157)', () => {
  it('exposes a "legend-live-glyphs" scenario with the compass legend + moon on', () => {
    const scenario = findScenario('legend-live-glyphs');
    expect(scenario).toBeTruthy();
    const cfg = scenario!.build();
    expect(cfg.root.show_compass_legend).toBe(true);
    expect(cfg.compass.show_legend).toBe(true);
    expect(cfg.root.show_moon).toBe(true);
    expect(cfg.compass.show_moon).toBe(true);
  });

  it('places the sun OUTSIDE the FOV so the legend sun glyph renders without glow', () => {
    const cfg = findScenario('legend-live-glyphs')!.build();
    const entry = cfg.entries[0];
    // A north-facing window at solar noon: the sun sits south, well outside the
    // window's azimuth FOV — the legend sun glyph state is then outside_fov.
    expect(entry.window_azimuth).toBe(0);
    // Narrow enough FOV that the southern noon sun cannot land inside it.
    expect(entry.fov_left + entry.fov_right).toBeLessThanOrEqual(120);
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
