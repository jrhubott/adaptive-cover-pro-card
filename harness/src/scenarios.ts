import type { HarnessConfig, HarnessEntry } from './types';

function defaultRoot(): HarnessConfig['root'] {
  return {
    enabled: true,
    show_sections: {
      sky: true,
      elevation: true,
      decision: true,
      covers: true,
      overrides: true,
      climate: true,
    },
    compact: false,
    show_compass_stats: true,
    show_compass_legend: true,
    show_moon: false,
    hide_inactive_handlers: false,
    show_decision_summary: true,
    north_offset: 0,
  };
}

function defaultCompass(): HarnessConfig['compass'] {
  return {
    enabled: true,
    title: 'Sky compass',
    compact: false,
    show_legend: true,
    show_stats: true,
    show_moon: false,
    show_cardinals: true,
    show_blind_spot: true,
    show_sun_path: true,
    show_sunrise_sunset: true,
    show_cover_fill: true,
    show_window_arrow: true,
    north_offset: 0,
  };
}

/** Every badge kind on — the default opt-in state. */
export function defaultBadges(): HarnessConfig['tile']['badges'] {
  return {
    solar: true,
    force: true,
    weather: true,
    manual: true,
    custom_position: true,
    motion: true,
    climate: true,
    glare_zone: true,
  };
}

function defaultTile(): HarnessConfig['tile'] {
  return {
    enabled: true,
    show_position: true,
    show_state: true,
    show_decision_summary: false,
    show_controls: true,
    show_badge: true,
    badges: defaultBadges(),
    show_compass: true,
    show_motion_icon: true,
    show_resume: 'auto',
    layout: 'one-line',
  };
}

function makeEntry(
  overrides: Partial<HarnessEntry> & Pick<HarnessEntry, 'entry_id'>,
): HarnessEntry {
  return {
    title: overrides.title ?? 'Living Room',
    cover_type: overrides.cover_type ?? 'cover_blind',
    window_azimuth: overrides.window_azimuth ?? 180,
    fov_left: overrides.fov_left ?? 45,
    fov_right: overrides.fov_right ?? 45,
    min_elevation: overrides.min_elevation,
    max_elevation: overrides.max_elevation,
    blind_spot_range: overrides.blind_spot_range,
    target_position: overrides.target_position ?? 40,
    covers: overrides.covers ?? [
      {
        entity_id: `cover.${overrides.entry_id}_main`,
        friendly_name: `${overrides.title ?? 'Living Room'} cover`,
        position: 40,
      },
    ],
    color: overrides.color ?? '#ff7043',
    slots: overrides.slots ?? [
      { slot: 1, enabled: false, position: 75, name: 'Movie time', min_mode: false, priority: 60 },
      { slot: 2, enabled: false, position: 20, name: 'Privacy', min_mode: false, priority: 70 },
      {
        slot: 3,
        enabled: false,
        position: 100,
        name: 'Welcome home',
        min_mode: false,
        priority: 50,
      },
      { slot: 4, enabled: false, position: 50, name: 'Floor', min_mode: true, priority: 90 },
    ],
    flags: {
      integration_enabled: true,
      automatic_control: true,
      manual_override: false,
      manual_override_minutes_from_now: 60,
      force_override_triggers: 0,
      motion_status: 'idle',
      motion_timeout_minutes_from_now: 1,
      climate_strategy: 'intermediate',
      indoor_temp: 21,
      outdoor_temp: 18,
      glare_active: false,
      is_sunset_active: false,
      in_time_window: true,
      default_position: 60,
      ...overrides.flags,
    },
    entry_id: overrides.entry_id,
  };
}

function baseConfig(date: string, time: number, lat = 47.6, lon = -122.3): HarnessConfig {
  return {
    latitude: lat,
    longitude: lon,
    date,
    timeOfDayMinutes: time,
    playing: false,
    scenario: 'summer-noon-south',
    theme: 'light',
    entries: [makeEntry({ entry_id: 'south_window', title: 'Living Room', window_azimuth: 180 })],
    decisionMode: 'derived',
    scriptedWinner: 'solar',
    root: defaultRoot(),
    compass: defaultCompass(),
    tile: defaultTile(),
  };
}

export interface Scenario {
  id: string;
  label: string;
  description: string;
  build: () => HarnessConfig;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'summer-noon-south',
    label: 'Summer noon — south window',
    description: 'High elevation, sun in FOV, solar handler tracking.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'summer-noon-south';
      return c;
    },
  },
  {
    id: 'winter-morning-east',
    label: 'Winter morning — east window',
    description: 'Low elevation sun rising, narrow east FOV.',
    build: () => {
      const c = baseConfig('2026-12-21', 9 * 60);
      c.scenario = 'winter-morning-east';
      c.entries = [
        makeEntry({
          entry_id: 'east_window',
          title: 'Kitchen',
          window_azimuth: 90,
          fov_left: 30,
          fov_right: 30,
          min_elevation: 10,
          color: '#42a5f5',
        }),
      ];
      return c;
    },
  },
  {
    id: 'manual-override-active',
    label: 'Manual override active',
    description: 'User overrode the cover; manual handler holds.',
    build: () => {
      const c = baseConfig('2026-06-21', 14 * 60);
      c.scenario = 'manual-override-active';
      c.entries[0].flags.manual_override = true;
      c.entries[0].flags.manual_override_minutes_from_now = 60;
      c.entries[0].target_position = 80;
      c.entries[0].covers[0].position = 80;
      return c;
    },
  },
  {
    id: 'force-override',
    label: 'Force override',
    description: 'Force triggers active — covers slammed shut.',
    build: () => {
      const c = baseConfig('2026-06-21', 13 * 60);
      c.scenario = 'force-override';
      c.entries[0].flags.force_override_triggers = 2;
      c.entries[0].target_position = 0;
      c.entries[0].covers[0].position = 0;
      return c;
    },
  },
  {
    id: 'motion-timeout-pending',
    label: 'Motion timeout pending',
    description: 'Motion just cleared; covers reopen in 30s.',
    build: () => {
      const c = baseConfig('2026-06-21', 19 * 60);
      c.scenario = 'motion-timeout-pending';
      c.entries[0].flags.motion_status = 'timeout_pending';
      c.entries[0].flags.motion_timeout_minutes_from_now = 0.5;
      c.entries[0].target_position = 100;
      c.entries[0].covers[0].position = 100;
      return c;
    },
  },
  {
    id: 'solar-tracking-active',
    label: 'Solar tracking active',
    description:
      'Sun in FOV, solar handler wins (cloud not suppressing) — the "Solar tracking active" badge shows.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'solar-tracking-active';
      // Derived mode produces a real trace where solar matched and cloud is not
      // the winner, so the solar-active badge shows regardless of cloud config.
      c.decisionMode = 'derived';
      return c;
    },
  },
  {
    id: 'cloud-suppressed',
    label: 'Cloud suppressed — no badge',
    description:
      'Cloud-suppression handler wins (tracking suppressed). The cloud badge is dropped, so the tile shows no badge.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'cloud-suppressed';
      c.decisionMode = 'scripted';
      c.scriptedWinner = 'cloud';
      return c;
    },
  },
  {
    id: 'summer-north-highlat',
    label: 'Summer — north window (two FOV crossings)',
    description:
      'High-latitude north-facing window: the sun enters the FOV at NE sunrise and again at NW sunset — two separate windows, two wedges.',
    build: () => {
      const c = baseConfig('2026-06-21', 20 * 60, 60.0, 10.75); // Oslo-ish
      c.scenario = 'summer-north-highlat';
      c.entries = [
        makeEntry({
          entry_id: 'north_window',
          title: 'Loft',
          window_azimuth: 0,
          fov_left: 80,
          fov_right: 80,
          color: '#26a69a',
        }),
      ];
      return c;
    },
  },
  {
    id: 'floor-bypassable',
    label: 'Floor chip — bypassable (priority 75)',
    description:
      'An armed min-mode floor at 50% with priority 75 (≤ 80). The floor chip renders subdued/normal-weight because a manual ↓ would bypass it.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'floor-bypassable';
      c.decisionMode = 'derived';
      // Solar wins; a separate enabled min-mode floor slot arms the chip.
      c.entries[0].target_position = 80;
      c.entries[0].slots = [
        {
          slot: 1,
          enabled: true,
          position: 50,
          name: 'Aeration floor',
          min_mode: true,
          priority: 75,
        },
        { slot: 2, enabled: false, position: 20, name: 'Privacy', min_mode: false, priority: 70 },
        {
          slot: 3,
          enabled: false,
          position: 100,
          name: 'Welcome home',
          min_mode: false,
          priority: 50,
        },
        { slot: 4, enabled: false, position: 50, name: 'Floor', min_mode: true, priority: 90 },
      ];
      return c;
    },
  },
  {
    id: 'floor-resists-manual',
    label: 'Floor chip — resists manual (priority 90)',
    description:
      'An armed min-mode floor at 50% with priority 90 (> 80). The floor chip renders emphasized/bold because a manual ↓ will NOT bypass it.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'floor-resists-manual';
      c.decisionMode = 'derived';
      c.entries[0].target_position = 80;
      c.entries[0].slots = [
        {
          slot: 1,
          enabled: true,
          position: 50,
          name: 'Aeration floor',
          min_mode: true,
          priority: 90,
        },
        { slot: 2, enabled: false, position: 20, name: 'Privacy', min_mode: false, priority: 70 },
        {
          slot: 3,
          enabled: false,
          position: 100,
          name: 'Welcome home',
          min_mode: false,
          priority: 50,
        },
        { slot: 4, enabled: false, position: 50, name: 'Floor', min_mode: true, priority: 60 },
      ];
      return c;
    },
  },
  {
    id: 'multi-window',
    label: 'Multi-window — south + west',
    description: 'Two entries with overlapping FOV wedges.',
    build: () => {
      const c = baseConfig('2026-06-21', 16 * 60);
      c.scenario = 'multi-window';
      c.entries = [
        makeEntry({
          entry_id: 'south_window',
          title: 'Living Room',
          window_azimuth: 180,
          min_elevation: 10,
          color: '#ff7043',
        }),
        makeEntry({
          entry_id: 'west_window',
          title: 'Office',
          window_azimuth: 270,
          fov_left: 60,
          fov_right: 60,
          min_elevation: 15,
          color: '#7e57c2',
        }),
      ];
      return c;
    },
  },
];

export function findScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export function defaultScenarioConfig(): HarnessConfig {
  return SCENARIOS[0].build();
}

/**
 * Backfill fields added after a persisted config was saved. Configs restored
 * from localStorage or a shared URL may predate newer keys (e.g. `tile.badges`),
 * so merge them over the defaults before they reach the UI — otherwise a missing
 * key throws mid-render and the control panel disappears.
 */
export function normalizeConfig(cfg: HarnessConfig): HarnessConfig {
  return {
    ...cfg,
    tile: {
      ...cfg.tile,
      badges: { ...defaultBadges(), ...(cfg.tile?.badges ?? {}) },
    },
  };
}
