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
import { buildStates } from '../harness/src/mock/state-gen';
import { applyService } from '../harness/src/mock/services';
import { zonedNowMs, zoneForLongitude } from '../harness/src/zone';
import { INTEGRATION_DOMAIN } from '../src/const';
import { buildRegistry } from '../harness/src/mock/registry';
import { discoverEntities } from '../src/lib/entity-discovery';
import { positionAxisInverted, resolveAxes } from '../src/lib/axes';
import {
  coverHeldPosition,
  coverLogicalActuals,
  logicalAxisValue,
  logicalCoverPosition,
} from '../src/lib/cover-position';

interface CardStageLike extends HTMLElement {
  config: HarnessConfig;
  _rootConfig(): Record<string, unknown>;
  _compassConfig(): Record<string, unknown>;
  _tileConfig(entryId: string): Record<string, unknown>;
  _solarChartConfig(): Record<string, unknown>;
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

describe('group-tile scenario (issue #185)', () => {
  it('exposes a "group-tile" scenario with a single group entry', () => {
    const scenario = findScenario('group-tile');
    expect(scenario).toBeTruthy();
    const cfg = scenario!.build();
    expect(cfg.entries).toHaveLength(1);
    expect(cfg.entries[0].is_group).toBe(true);
    expect(cfg.entries[0].group).toBeTruthy();
    // Phase 2 wires only the tile — the other cards are hidden here.
    expect(cfg.tile.enabled).toBe(true);
    expect(cfg.root.enabled).toBe(false);
  });

  it('the mock registry + states let the card discover the entry as a group', () => {
    const cfg = findScenario('group-tile')!.build();
    const entry = cfg.entries[0];
    const registry = buildRegistry(cfg.entries);
    const { states } = buildStates(cfg);
    const hass = { states, devices: {} } as unknown as import('custom-card-helpers').HomeAssistant;
    const d = discoverEntities(
      hass,
      { type: 'custom:adaptive-cover-pro-tile-card', entry_id: entry.entry_id },
      registry,
    );
    expect(d).not.toBeNull();
    expect(d!.is_group).toBe(true);
    expect(d!.entities.group_active_scene_sensor).toBeTruthy();
    expect(d!.entities.group_scene_select).toBeTruthy();
    expect(d!.entities.group_lock_switch).toBeTruthy();
    // Group entries expose no cover-position sensor.
    expect(d!.entities.target_position_sensor).toBeUndefined();
    // Roster comes from member_positions.
    expect(d!.managed_covers.length).toBeGreaterThan(0);
  });

  it('gates the group roles OFF an ordinary cover entry (no false is_group)', () => {
    const cfg = defaultScenarioConfig();
    const registry = buildRegistry(cfg.entries);
    const { states } = buildStates(cfg);
    const hass = { states, devices: {} } as unknown as import('custom-card-helpers').HomeAssistant;
    const d = discoverEntities(
      hass,
      { type: 'custom:adaptive-cover-pro-card', entry_id: cfg.entries[0].entry_id },
      registry,
    );
    expect(d!.is_group).toBeFalsy();
    expect(d!.entities.group_active_scene_sensor).toBeUndefined();
    expect(d!.entities.target_position_sensor).toBeTruthy();
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

describe('solar chart card harness plumbing (issue #187)', () => {
  it('backfills solarChart when a persisted config predates the field', () => {
    const legacy = defaultScenarioConfig();
    delete (legacy as { solarChart?: unknown }).solarChart;

    const normalized = normalizeConfig(legacy as HarnessConfig);

    expect(normalized.solarChart).toEqual({
      enabled: true,
      title: 'Solar chart',
      compact: false,
    });
  });

  it('card-stage threads entry_ids, title, compact, and cover_colors into the solar chart card config', () => {
    const el = document.createElement('acp-harness-card-stage') as unknown as CardStageLike;
    const cfg = defaultScenarioConfig();
    cfg.solarChart.title = 'Sun today';
    cfg.solarChart.compact = true;
    el.config = cfg;
    const solarChartCfg = el._solarChartConfig();
    expect(solarChartCfg.type).toBe('custom:adaptive-cover-pro-solar-chart-card');
    expect(solarChartCfg.entry_ids).toEqual([cfg.entries[0].entry_id]);
    expect(solarChartCfg.title).toBe('Sun today');
    expect(solarChartCfg.compact).toBe(true);
    expect(solarChartCfg.cover_colors).toEqual([cfg.entries[0].color]);
  });

  it('exposes a "solar-chart-standalone-card" scenario with 2+ entries exercising multi-cover FOV bars', () => {
    const scenario = findScenario('solar-chart-standalone-card');
    expect(scenario).toBeTruthy();
    const cfg = scenario!.build();
    expect(cfg.solarChart.enabled).toBe(true);
    expect(cfg.entries.length).toBeGreaterThanOrEqual(2);

    const el = document.createElement('acp-harness-card-stage') as unknown as CardStageLike;
    el.config = cfg;
    const solarChartCfg = el._solarChartConfig();
    expect((solarChartCfg.entry_ids as string[]).length).toBe(cfg.entries.length);
  });
});

// ── Extend manual override (#229) ────────────────────────────────────────────

describe('applyService — adaptive_cover_pro.engage_manual_override (#229)', () => {
  function baseCfg(): HarnessConfig {
    const cfg = defaultScenarioConfig();
    const entries = cfg.entries.map((e) => ({
      ...e,
      flags: { ...e.flags, manual_override: true, manual_override_minutes_from_now: 45 },
    }));
    return { ...cfg, entries };
  }

  /** The harness's pinned "now" — the same instant state-gen derives the
   *  override end from, so minutes-from-now round-trips exactly. */
  function harnessNowMs(cfg: HarnessConfig): number {
    return zonedNowMs(cfg.date, cfg.timeOfDayMinutes, zoneForLongitude(cfg.longitude));
  }

  it('applies an absolute end_time as minutes from the fake clock', () => {
    const cfg = baseCfg();
    const entry = cfg.entries[0];
    const endMs = harnessNowMs(cfg) + 90 * 60_000;
    const { next, applied } = applyService(
      cfg,
      INTEGRATION_DOMAIN,
      'engage_manual_override',
      { end_time: new Date(endMs).toISOString() },
      { entity_id: entry.covers[0].entity_id },
    );
    expect(applied).toBe(true);
    const flags = next.entries[0].flags;
    expect(flags.manual_override).toBe(true);
    expect(flags.manual_override_minutes_from_now).toBe(90);
  });

  it('adds a duration to the current override end', () => {
    const cfg = baseCfg();
    const { next, applied } = applyService(
      cfg,
      INTEGRATION_DOMAIN,
      'engage_manual_override',
      { duration: { seconds: 1800 } },
      { entity_id: cfg.entries[0].covers[0].entity_id },
    );
    expect(applied).toBe(true);
    // 45 active + 30 added.
    expect(next.entries[0].flags.manual_override_minutes_from_now).toBe(75);
  });

  it('engages the override when none is active', () => {
    const cfg = baseCfg();
    const off = {
      ...cfg,
      entries: cfg.entries.map((e) => ({
        ...e,
        flags: { ...e.flags, manual_override: false },
      })),
    };
    const { next } = applyService(
      off,
      INTEGRATION_DOMAIN,
      'engage_manual_override',
      { end_time: new Date(harnessNowMs(off) + 60 * 60_000).toISOString() },
      { entity_id: off.entries[0].covers[0].entity_id },
    );
    expect(next.entries[0].flags.manual_override).toBe(true);
  });

  it('targets every entry when entity_id is an array of covers', () => {
    const cfg = baseCfg();
    const ids = cfg.entries.flatMap((e) => e.covers.map((c) => c.entity_id));
    const endMs = harnessNowMs(cfg) + 120 * 60_000;
    const { next, applied } = applyService(
      cfg,
      INTEGRATION_DOMAIN,
      'engage_manual_override',
      { end_time: new Date(endMs).toISOString() },
      { entity_id: ids } as unknown as { entity_id?: string },
    );
    expect(applied).toBe(true);
    for (const e of next.entries) {
      expect(e.flags.manual_override_minutes_from_now).toBe(120);
    }
  });

  it('no-ops with neither end_time nor duration', () => {
    const cfg = baseCfg();
    const { next, applied } = applyService(
      cfg,
      INTEGRATION_DOMAIN,
      'engage_manual_override',
      {},
      { entity_id: cfg.entries[0].covers[0].entity_id },
    );
    expect(applied).toBe(false);
    expect(next).toBe(cfg);
  });
});

// ── frame-normalization harness scenarios (#234, #236) ───────────────────────

/** Build a scenario's mock states and run the card's own discovery over them,
 *  so harness output and card expectations are checked against each other. */
function discoverFor(scenarioId: string) {
  const cfg = findScenario(scenarioId)!.build();
  const entry = cfg.entries[0];
  const registry = buildRegistry(cfg.entries);
  const { states } = buildStates(cfg);
  const hass = { states, devices: {} } as unknown as import('custom-card-helpers').HomeAssistant;
  const d = discoverEntities(
    hass,
    { type: 'custom:adaptive-cover-pro-tile-card', entry_id: entry.entry_id },
    registry,
  );
  return { hass, states, discovered: d! };
}

describe('harness inverse_state scenarios (#234)', () => {
  it('emits the reporter fixture: cover-frame state/actuals, logical linear_*', () => {
    const { states, discovered } = discoverFor('inverse-state-awning');
    const sensor = states[discovered.entities.target_position_sensor!];
    expect(sensor.state).toBe('0');
    expect(sensor.attributes.linear_position).toBe(100);
    expect(sensor.attributes.actual_positions).toEqual({ 'cover.patio_awning': 0 });
    expect(sensor.attributes.linear_actual_positions).toEqual({ 'cover.patio_awning': 100 });
    // The mock source cover reports backwards while its state still says open —
    // the exact contradiction the issue was filed against.
    expect(states['cover.patio_awning'].attributes.current_position).toBe(0);
    expect(states['cover.patio_awning'].state).toBe('open');
    expect(states['cover.patio_awning'].attributes.assumed_state).toBe(true);
  });

  it('carries inverted: true through discovery so the card can normalize', () => {
    const { hass, discovered } = discoverFor('inverse-state-awning');
    expect(positionAxisInverted(discovered)).toBe(true);
    expect(coverLogicalActuals(hass, discovered)).toEqual({ 'cover.patio_awning': 100 });
    expect(logicalCoverPosition(hass, discovered, 'cover.patio_awning')).toBe(100);
    expect(coverHeldPosition(hass, discovered)).toBe(100);
  });

  it('legacy variant publishes neither field, so the card stays in the cover frame', () => {
    const { hass, states, discovered } = discoverFor('inverse-state-awning-legacy');
    const sensor = states[discovered.entities.target_position_sensor!];
    expect(sensor.attributes.linear_actual_positions).toBeUndefined();
    expect(discovered.discovery).toBeUndefined();
    expect(positionAxisInverted(discovered)).toBe(false);
    // The documented pre-#1033 residual: no sound oracle, so no guess.
    expect(logicalCoverPosition(hass, discovered, 'cover.patio_awning')).toBe(0);
  });

  it('leaves a non-inverse scenario byte-identical, with an identity actuals map', () => {
    const { hass, states, discovered } = discoverFor('interpolation-linear-position');
    const sensor = states[discovered.entities.target_position_sensor!];
    expect(sensor.state).toBe('31');
    expect(sensor.attributes.linear_position).toBe(10);
    expect(positionAxisInverted(discovered)).toBe(false);
    expect(sensor.attributes.linear_actual_positions).toEqual(sensor.attributes.actual_positions);
    expect(coverLogicalActuals(hass, discovered)).toEqual(sensor.attributes.actual_positions);
  });
});

// ── inverse_tilt harness scenario (#236) ─────────────────────────────────────

describe('harness inverse_tilt scenario (#236)', () => {
  const VENETIAN = 'cover.south_window_main';

  it('emits the fixture: cover-frame tilt attribute, logical tilt target, untouched position', () => {
    const { states, discovered } = discoverFor('inverse-tilt-venetian');
    const cover = states[VENETIAN];
    // Slats at logical 35 report their complement…
    expect(cover.attributes.current_tilt_position).toBe(65);
    // …while the position axis is not inverted, so it stays as configured.
    expect(cover.attributes.current_position).toBe(60);
    // The Cover_Tilt sensor is the integration's pre-_to_wire logical target
    // and must never be flipped by the mock.
    expect(states[discovered.entities.target_tilt_sensor!].state).toBe('70');
  });

  it('carries inverted through discovery on the tilt axis only', () => {
    const { discovered } = discoverFor('inverse-tilt-venetian');
    const axes = resolveAxes(discovered);
    expect(axes.map((a) => a.id)).toEqual(['position', 'tilt']);
    expect(axes.map((a) => a.inverted)).toEqual([false, true]);
    expect(positionAxisInverted(discovered)).toBe(false);
  });

  it('lets the card turn the reported 65 back into the logical 35', () => {
    const { hass, discovered } = discoverFor('inverse-tilt-venetian');
    const tilt = resolveAxes(discovered).find((a) => a.id === 'tilt')!;
    expect(logicalAxisValue(hass, tilt, VENETIAN)).toBe(35);
  });
});
