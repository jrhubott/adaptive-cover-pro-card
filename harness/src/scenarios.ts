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
    show_elevation_chart: true,
    north_offset: 0,
  };
}

/** Every badge kind on — the default opt-in state. */
export function defaultBadges(): HarnessConfig['tile']['badges'] {
  return {
    auto: true,
    solar: true,
    force: true,
    weather: true,
    manual: true,
    custom_position: true,
    motion: true,
    climate: true,
    glare_zone: true,
    cloud: true,
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
    show_elevation_chart: true,
    show_motion_icon: true,
    layout: 'detailed',
    tileWidth: 0,
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
      schedule_start_minutes: 7 * 60 + 30, // 07:30
      schedule_end_minutes: 21 * 60, // 21:00
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
    description:
      'User overrode the cover; manual handler holds. The Manual badge is tappable (↺) to resume automatic control.',
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
    id: 'motion-idle-badge',
    label: 'Motion idle badge',
    description:
      'Motion handler winning with the motion indicator icon turned off, so the "Motion idle" text badge shows. Turn the indicator back on, or disable the motion badge, to watch it fall back to Auto.',
    build: () => {
      const c = baseConfig('2026-06-21', 19 * 60);
      c.scenario = 'motion-idle-badge';
      c.entries[0].flags.motion_status = 'timeout_pending';
      c.entries[0].flags.motion_timeout_minutes_from_now = 0.5;
      c.entries[0].target_position = 100;
      c.entries[0].covers[0].position = 100;
      c.tile.show_motion_icon = false;
      return c;
    },
  },
  {
    id: 'solar-tracking-active',
    label: 'Solar tracking',
    description:
      'Sun in FOV, solar handler wins (cloud not suppressing) — the "Solar tracking" badge shows.',
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
    id: 'solar-detailed-layout',
    label: 'Solar tracking — detailed layout',
    description:
      'Detailed layout: the solar badge rides inline on the state line, right-aligned against the controls.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'solar-detailed-layout';
      c.decisionMode = 'derived';
      c.tile.layout = 'detailed';
      return c;
    },
  },
  {
    id: 'cloud-suppressed',
    label: 'Cloud suppressed — Cloudy + Auto badges',
    description:
      'Cloud-suppression handler wins (tracking suppressed). In the detailed layout the tile now shows BOTH the green "Auto" badge on the line above AND the blue "Cloudy" winner badge inline. Toggle badge: auto off to hide Auto, or badge: cloud off to hide Cloudy.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'cloud-suppressed';
      c.decisionMode = 'scripted';
      c.scriptedWinner = 'cloud';
      return c;
    },
  },
  {
    id: 'auto-default-badge',
    label: 'Auto badge — default winner',
    description:
      'No specific handler wins (the default position applies). The tile shows the green "Auto" badge; toggle badge: auto off to hide it.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'auto-default-badge';
      c.decisionMode = 'scripted';
      c.scriptedWinner = 'default';
      return c;
    },
  },
  {
    id: 'auto-with-cloud-winner',
    label: 'Auto + Cloudy (issue #110)',
    description:
      'Cloud wins while automatic control is on. The detailed tile shows the green "Auto" indicator on the line above AND the "Cloudy" winner badge inline — proof that automatic control stays visible behind a specific handler. Toggle badge: auto / badge: cloud to hide either.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'auto-with-cloud-winner';
      c.decisionMode = 'scripted';
      c.scriptedWinner = 'cloud';
      return c;
    },
  },
  {
    id: 'auto-hidden-manual',
    label: 'Auto hidden — manual override',
    description:
      'A manual override is active, so automatic control is NOT running. The Auto indicator is suppressed; only the tappable Manual badge shows.',
    build: () => {
      const c = baseConfig('2026-06-21', 14 * 60);
      c.scenario = 'auto-hidden-manual';
      c.entries[0].flags.manual_override = true;
      c.entries[0].flags.manual_override_minutes_from_now = 60;
      c.entries[0].target_position = 80;
      c.entries[0].covers[0].position = 80;
      return c;
    },
  },
  {
    id: 'auto-hidden-force',
    label: 'Auto hidden — force override',
    description:
      'A force trigger wins (forced position, not adaptive). The Auto indicator is suppressed; the red "Force" badge shows.',
    build: () => {
      const c = baseConfig('2026-06-21', 13 * 60);
      c.scenario = 'auto-hidden-force';
      c.decisionMode = 'scripted';
      c.scriptedWinner = 'force';
      c.entries[0].flags.force_override_triggers = 2;
      c.entries[0].target_position = 0;
      c.entries[0].covers[0].position = 0;
      return c;
    },
  },
  {
    id: 'auto-hidden-custom-bypass',
    label: 'Auto hidden — custom position bypass',
    description:
      'A custom-position slot wins with an exact (non-floor) position that bypasses automatic control (bypass_auto_control). The Auto indicator is suppressed; the purple "Custom" badge shows. Automatic control stays ON — the slot itself is the bypass.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'auto-hidden-custom-bypass';
      c.decisionMode = 'scripted';
      c.scriptedWinner = 'custom_position';
      // Enable a single exact-position (min_mode false) slot so the scripted
      // decider derives bypass_auto_control: true while automatic control is on.
      c.entries[0].slots = [
        { slot: 1, enabled: true, position: 30, name: 'Privacy', min_mode: false, priority: 60 },
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
      c.entries[0].target_position = 30;
      c.entries[0].covers[0].position = 30;
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
    label: 'Multi-window — SE + S + SW',
    description:
      'Three entries with overlapping in-FOV times so the per-window FOV ribbon below the elevation strip shows color-keyed bars; mixed elevation limits.',
    build: () => {
      // Early afternoon: the SE, S and SW windows all catch the sun within a
      // few hours of each other, so ≥2 are simultaneously in FOV and the
      // FOV ribbon below the elevation strip shows overlapping color-keyed bars.
      const c = baseConfig('2026-06-21', 13 * 60 + 30);
      c.scenario = 'multi-window';
      c.entries = [
        makeEntry({
          entry_id: 'se_window',
          title: 'Living Room',
          window_azimuth: 135,
          fov_left: 60,
          fov_right: 60,
          min_elevation: 10,
          max_elevation: 70,
          color: '#ff7043',
        }),
        makeEntry({
          entry_id: 's_window',
          title: 'Kitchen',
          window_azimuth: 180,
          fov_left: 60,
          fov_right: 60,
          color: '#26a69a',
        }),
        makeEntry({
          entry_id: 'sw_window',
          title: 'Office',
          window_azimuth: 225,
          fov_left: 60,
          fov_right: 60,
          min_elevation: 15,
          color: '#7e57c2',
        }),
      ];
      return c;
    },
  },
  {
    id: 'winter-night-moonlit',
    label: 'Winter night — sun below horizon',
    description:
      'Sun well below the horizon renders as a dim amber filled disc, distinct from the grey moon disc. Moon overlay enabled.',
    build: () => {
      const c = baseConfig('2026-12-21', 21 * 60);
      c.scenario = 'winter-night-moonlit';
      c.root.show_moon = true;
      c.compass.show_moon = true;
      return c;
    },
  },
  {
    id: 'outside-schedule',
    label: 'Outside schedule — auto paused',
    description:
      'The configured Schedule & Timing clock window (07:30–21:00) is not active right now (in_time_window false), so automatic control is paused. The "Sun today" chart shows the faint off-schedule zones bracketing the window with start/end bars + clock ticks; the decision strip shows the muted "Outside schedule" banner and the tile shows the "Off-schedule" badge. Default position wins. Set the time before 07:30 or after 21:00 to land literally outside the window.',
    build: () => {
      const c = baseConfig('2026-06-21', 6 * 60); // 06:00 — before the 07:30 start.
      c.scenario = 'outside-schedule';
      c.entries[0].flags.in_time_window = false;
      c.entries[0].flags.schedule_start_minutes = 7 * 60 + 30; // 07:30
      c.entries[0].flags.schedule_end_minutes = 21 * 60; // 21:00
      // Default position wins so the banner + badge read cleanly.
      c.entries[0].target_position = 60;
      c.entries[0].covers[0].position = 60;
      return c;
    },
  },
  {
    id: 'schedule-spans-midnight',
    label: 'Schedule spans midnight (21:00 → 06:00)',
    description:
      'An overnight schedule whose end rolls to the next day. The "Sun today" chart draws a single gray off-schedule band across the daytime gap (06:00–21:00) with both clock bars; in-schedule wraps midnight. Drag the time across midnight to watch in_time_window flip.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60); // noon — inside the daytime off-schedule gap.
      c.scenario = 'schedule-spans-midnight';
      c.entries[0].flags.schedule_start_minutes = 21 * 60; // 21:00
      c.entries[0].flags.schedule_end_minutes = 6 * 60; // 06:00 (rolls to next day)
      c.entries[0].flags.in_time_window = false; // noon is outside the overnight window.
      return c;
    },
  },
  {
    id: 'schedule-open-ended',
    label: 'Schedule open-ended (no end set)',
    description:
      'A schedule with a start (07:30) but no end bound. The "Sun today" chart grays only the pre-start zone and draws a single start bar; the head reads "Schedule from 07:30". Toggle the schedule end "no bound" control to exercise the open path.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'schedule-open-ended';
      c.entries[0].flags.schedule_start_minutes = 7 * 60 + 30; // 07:30
      c.entries[0].flags.schedule_end_minutes = null; // open-ended
      return c;
    },
  },
  {
    id: 'climate-standby',
    label: 'Climate standby — outside operating window',
    description:
      'Climate mode is on but the status sensor is unknown (sun not currently on the window). The climate panel shows the "Standby" state instead of "Unknown / Active: —".',
    build: () => {
      const c = baseConfig('2026-06-21', 8 * 60);
      c.scenario = 'climate-standby';
      c.entries[0].flags.climate_strategy = 'unknown';
      return c;
    },
  },
  {
    id: 'compass-actual-vs-target',
    label: 'Compass — actual vs target divergence',
    description:
      'The cover is mid-travel: target is 30% but the cover is still at 80%. The sky compass draws a solid target wedge plus a fainter dashed actual wedge so the divergence reads at a glance. The custom overlay color carries through the main card.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'compass-actual-vs-target';
      c.entries[0].target_position = 30;
      c.entries[0].covers[0].position = 80;
      c.entries[0].color = '#ec407a';
      return c;
    },
  },
  {
    id: 'sun-hitting-window',
    label: 'Sun hitting window (repro #137)',
    description:
      'High elevation, sun azimuth in FOV, solar handler wins, direct_sun_valid true → sun dot must be orange/gold (hitting), NOT light-yellow. Reproduces issue #137.',
    build: () => {
      // Summer noon at the default location: sun high (~66°) and roughly south
      // (~180°). The wide off-axis FOV (window 141°, ±90/103°) spans ~51–244°,
      // so the sun is inside it and unblocked → direct_sun_valid true → hitting.
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'sun-hitting-window';
      c.decisionMode = 'derived';
      c.entries = [
        makeEntry({
          entry_id: 'south_window',
          title: 'Living Room',
          window_azimuth: 141,
          fov_left: 90,
          fov_right: 103,
        }),
      ];
      return c;
    },
  },
  {
    id: 'sun-in-fov-not-valid',
    label: 'Sun in FOV but not hitting (#137 contrast)',
    description:
      'Same azimuth-in-FOV geometry as the hitting case, but the sun is above max_elevation so direct_sun_valid is false → sun dot must be light-yellow (in FOV, not hitting), distinct from the orange hitting state.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'sun-in-fov-not-valid';
      c.decisionMode = 'derived';
      c.entries = [
        makeEntry({
          entry_id: 'south_window',
          title: 'Living Room',
          window_azimuth: 141,
          fov_left: 90,
          fov_right: 103,
          // Cap elevation below the real noon sun so it is in FOV (azimuth) but
          // elevation-invalid → direct_sun_valid false → in_fov_not_valid.
          max_elevation: 40,
        }),
      ];
      return c;
    },
  },
  {
    id: 'cover-bar-open-style',
    label: 'Cover bar — two-tone open/closed fill (issue #135)',
    description:
      "Cover at 69% open. The bar splits into two segments matching the sky compass: the open portion (left) is gold like the FOV wedge, the closed portion (right) uses the selected cover colour like the cover wedge. Change entry 0's colour in the control panel to watch both the compass wedge and the bar's closed segment track it. The percent label sits left of the track.",
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'cover-bar-open-style';
      c.entries[0].target_position = 69;
      c.entries[0].covers[0].position = 69;
      return c;
    },
  },
  {
    id: 'narrow-column-tiles',
    label: 'Narrow column tiles (repro #136)',
    description:
      'Four detailed tiles with long names pinned to a 260px-wide column, mimicking a narrow HA "Sections" layout. The fixed ↑■▼ control column starves the name, truncating "Centre Gauche" → "C…". Drag the tile width control up to ~360px to watch the names recover. Use this to verify the narrow-column responsive fix.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'narrow-column-tiles';
      c.tile.layout = 'detailed';
      c.tile.tileWidth = 260;
      c.entries = [
        makeEntry({ entry_id: 'gauche', title: 'Gauche', window_azimuth: 135, color: '#ff7043' }),
        makeEntry({
          entry_id: 'centre_gauche',
          title: 'Centre Gauche',
          window_azimuth: 180,
          color: '#26a69a',
        }),
        makeEntry({
          entry_id: 'centre_droite',
          title: 'Centre Droite',
          window_azimuth: 180,
          color: '#7e57c2',
        }),
        makeEntry({ entry_id: 'droite', title: 'Droite', window_azimuth: 225, color: '#42a5f5' }),
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
      tileWidth: cfg.tile?.tileWidth ?? 0,
    },
  };
}
