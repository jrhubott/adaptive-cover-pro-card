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
      {
        slot: 5,
        enabled: true,
        position: 0,
        name: 'Safety',
        min_mode: false,
        priority: 100,
        sensors: [
          `binary_sensor.${overrides.entry_id}_wind`,
          `binary_sensor.${overrides.entry_id}_frost`,
        ],
        template: true,
        template_mode: 'or',
      },
    ],
    flags: {
      integration_enabled: true,
      automatic_control: true,
      manual_override: false,
      manual_override_minutes_from_now: 60,
      held_position: null,
      safety_slot_active: false,
      motion_status: 'idle',
      motion_timeout_minutes_from_now: 1,
      climate_strategy: 'intermediate',
      indoor_temp: 21,
      outdoor_temp: 18,
      climate_inactive_reason: 'outside_time_window',
      climate_temp_low: 18,
      climate_temp_high: 25,
      climate_temp_summer_outside: 22,
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
    tooltips: defaultTooltips(),
    stageHeight: 0,
  };
}

export function defaultTooltips(): HarnessConfig['tooltips'] {
  return { mode: 'floating', offset: [12, 16] };
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
    id: 'single-entry-cover-color',
    label: 'Single entry — custom cover color',
    description:
      'A single-entry main card with a cover-color override. #132 Problem B: the FOV/window follows the chosen shade (not the themed default), matching the standalone compass card. Legend check: every swatch — FOV, cover position, AND window normal — carries the override color, and the cover-position swatch reads the darker FOV+cover composite.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'single-entry-cover-color';
      c.entries = [
        makeEntry({
          entry_id: 'south_window',
          title: 'Living Room',
          window_azimuth: 180,
          color: '#e040fb',
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
    id: 'manual-override-divergence',
    label: 'Manual override — solar diverges',
    description:
      'Manual override holds the cover at 80% while the sun would have the integration close it to 20%. The sky compass draws the solar-target wedge plus the held/actual ring, and the COVERS bar labels Target: 20% (solar) with the fill/number at the held 80% and no alert badge — the divergence is intentional (#158). The decision strip shows 80% (held) in the position column and "solar 20%" inline after the reason (#161). Toggle the override off to see the badge return for a genuine mismatch.',
    build: () => {
      const c = baseConfig('2026-06-21', 14 * 60);
      c.scenario = 'manual-override-divergence';
      c.entries[0].flags.manual_override = true;
      c.entries[0].flags.manual_override_minutes_from_now = 60;
      // target_position is the SOLAR would-be target (surfaces as
      // raw_calculated_position); held_position is where the user parked it.
      c.entries[0].target_position = 20;
      c.entries[0].flags.held_position = 80;
      c.entries[0].covers[0].position = 80;
      return c;
    },
  },
  {
    id: 'manual-override-held-position',
    label: 'Manual override — held_position field (#161)',
    description:
      'Exercises the held_position field on the manual_override trace step (integration #608). The decision strip must show the held value (44%) in the primary position column and append "solar 60%" as inline context after the reason. The solar would-be (60%) must not appear in the position column.',
    build: () => {
      const c = baseConfig('2026-06-21', 11 * 60);
      c.scenario = 'manual-override-held-position';
      c.entries[0].flags.manual_override = true;
      c.entries[0].flags.manual_override_minutes_from_now = 30;
      // target_position = solar would-be; held_position = where the user parked it.
      c.entries[0].target_position = 60;
      c.entries[0].flags.held_position = 44;
      c.entries[0].covers[0].position = 44;
      return c;
    },
  },
  {
    id: 'safety-slot',
    label: 'Safety slot (priority 100)',
    description:
      'The v2.28.0 safety slot (slot 5, priority 100) is armed — the migrated Force Override. It wins as a custom_position with bypass_auto_control; the red, force-styled "Safety" badge shows and the Auto indicator is suppressed.',
    build: () => {
      const c = baseConfig('2026-06-21', 13 * 60);
      c.scenario = 'safety-slot';
      c.entries[0].flags.safety_slot_active = true;
      c.entries[0].target_position = 0;
      c.entries[0].covers[0].position = 0;
      return c;
    },
  },
  {
    id: 'multi-sensor-template-slot',
    label: 'Custom slot — multi-sensor template',
    description:
      'A custom-position slot driven by a multi-sensor Jinja template (OR mode) wins. Exercises the v2.28.0 sensors / template / template_mode snapshot fields surfaced in the more-info dialog slot list.',
    build: () => {
      const c = baseConfig('2026-06-21', 13 * 60);
      c.scenario = 'multi-sensor-template-slot';
      c.entries[0].slots = [
        {
          slot: 1,
          enabled: true,
          position: 35,
          name: 'Privacy (any motion)',
          min_mode: false,
          priority: 60,
          sensors: ['binary_sensor.hall_motion', 'binary_sensor.porch_motion'],
          template: true,
          template_mode: 'or',
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
        {
          slot: 5,
          enabled: false,
          position: 0,
          name: 'Safety',
          min_mode: false,
          priority: 100,
          sensors: ['binary_sensor.wind', 'binary_sensor.frost'],
          template: true,
          template_mode: 'or',
        },
      ];
      c.entries[0].flags.automatic_control = true;
      c.entries[0].target_position = 35;
      c.entries[0].covers[0].position = 35;
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
    label: 'Auto hidden — legacy force override (pre-2.28)',
    description:
      'Back-compat: a pre-2.28 build still emits the standalone `force` winner. The Auto indicator is suppressed; the red "Force" badge shows. v2.28.0+ surfaces this through the priority-100 safety slot instead (see the Safety slot scenario).',
    build: () => {
      const c = baseConfig('2026-06-21', 13 * 60);
      c.scenario = 'auto-hidden-force';
      c.decisionMode = 'scripted';
      c.scriptedWinner = 'force';
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
    id: 'six-covers-overflow',
    label: 'Six covers — Sky card overflow (issue #146)',
    description:
      'Six entries spread SE→SW so several are in-FOV at once: a tall stacked legend plus the elevation chart. Set the Sky stage height cap to clip the card and reproduce the legend/chart overflow.',
    build: () => {
      // Early afternoon with six windows fanned across the southern sky so the
      // legend stacks six cover swatches + Sun and the chart packs six ribbon
      // bars — the combination that overflows a fixed-row Sky card.
      const c = baseConfig('2026-06-21', 13 * 60 + 30);
      c.scenario = 'six-covers-overflow';
      c.stageHeight = 360;
      c.entries = [
        makeEntry({
          entry_id: 'terrasse',
          title: 'Terrasse',
          window_azimuth: 120,
          fov_left: 55,
          fov_right: 55,
          color: '#ff7043',
        }),
        makeEntry({
          entry_id: 'cuisine',
          title: 'Cuisine',
          window_azimuth: 150,
          fov_left: 55,
          fov_right: 55,
          color: '#26a69a',
        }),
        makeEntry({
          entry_id: 'salle_a_manger',
          title: 'Salle à Manger',
          window_azimuth: 180,
          fov_left: 55,
          fov_right: 55,
          color: '#7e57c2',
        }),
        makeEntry({
          entry_id: 'sdb_parentale',
          title: 'Salle de Bain Parentale',
          window_azimuth: 200,
          fov_left: 55,
          fov_right: 55,
          color: '#42a5f5',
        }),
        makeEntry({
          entry_id: 'sdb_filles',
          title: 'Salle de Bain Filles',
          window_azimuth: 220,
          fov_left: 55,
          fov_right: 55,
          color: '#ffca28',
        }),
        makeEntry({
          entry_id: 'chambre_lisa',
          title: 'Chambre Lisa',
          window_azimuth: 240,
          fov_left: 55,
          fov_right: 55,
          color: '#ec407a',
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
    id: 'issue-128-time-window',
    label: 'Time window — every schedule surface (issue #128)',
    description:
      'One stop to verify the whole "show time window" feature (issue #128) at once. The schedule is 07:30–21:00 and the clock sits at 06:00, before the start, so in_time_window is false. You should see ALL of: (1) tile card "Off-schedule" badge; (2) decision strip muted "Outside schedule — automatic control paused" banner; (3) "Sun today" chart faint gray off-schedule zones bracketing the window; (4) thin start bar @07:30 and end bar @21:00; (5) clock-time ticks on each bar (hover → "Schedule start"/"Schedule end"); (6) chart header "Schedule 07:30 – 21:00". The sky compass is intentionally excluded — it is an azimuth/FOV plot with no time axis. Drag the time past 07:30 to watch in_time_window flip and the banner/badge clear while the chart window stays drawn.',
    build: () => {
      const c = baseConfig('2026-06-21', 6 * 60); // 06:00 — before the 07:30 start.
      c.scenario = 'issue-128-time-window';
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
    id: 'climate-standby',
    label: 'Climate standby — outside operating window',
    description:
      'Climate mode is on but the status sensor is unknown (sun not currently on the window). The climate panel shows the "Standby" state plus a dim reason line ("Outside the operating time window") sourced from the integration\'s inactive_reason slug (#590/#129).',
    build: () => {
      const c = baseConfig('2026-06-21', 8 * 60);
      c.scenario = 'climate-standby';
      c.entries[0].flags.climate_strategy = 'unknown';
      c.entries[0].flags.climate_inactive_reason = 'outside_time_window';
      return c;
    },
  },
  {
    id: 'climate-thresholds',
    label: 'Climate active — temps vs thresholds (#129)',
    description:
      'Climate is actively deciding (intermediate). Each temperature tile is paired with its threshold sub-line: the current/indoor tile shows low/high, the outdoor tile shows the summer gate (#590/#129).',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'climate-thresholds';
      const f = c.entries[0].flags;
      f.climate_strategy = 'intermediate';
      f.indoor_temp = 22;
      f.outdoor_temp = 27;
      f.climate_temp_low = 18;
      f.climate_temp_high = 25;
      f.climate_temp_summer_outside = 22;
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
      "Cover at 69% open. The bar splits into two segments matching the sky compass: both use the cover colour (default blue, or the override), the open portion (left) a pale shade like the FOV wedge and the closed portion (right) a solid shade like the cover wedge — no gold. Change entry 0's colour in the control panel to watch both compass wedges and both bar segments track it. The percent label sits left of the track.",
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'cover-bar-open-style';
      c.entries[0].target_position = 69;
      c.entries[0].covers[0].position = 69;
      return c;
    },
  },
  {
    id: 'long-title-wrap',
    label: 'Long entry title — header wrap (issue #147)',
    description:
      'Entry title long enough to wrap onto two lines on a 390px (mobile) viewport. ' +
      'Regression guard for issue #147: the header must expand its height to accommodate ' +
      'the second title line without clipping. Verify on mobile simulation in devtools.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'long-title-wrap';
      c.entries = [
        makeEntry({
          entry_id: 'south_window',
          title: 'Adaptive Cover - Salle de Bain Parentale',
          window_azimuth: 180,
        }),
      ];
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
  {
    id: 'mobile-width-tiles',
    label: 'Mobile-width tiles (repro #154)',
    description:
      'Three detailed tiles with long German cover names pinned to a 390px-wide column — the same width as both a full-viewport phone tile and a medium tile in a multi-column desktop dashboard. The #154 reflow is gated on a narrow *viewport* (≤500px), not tile width alone: on this wide harness window the tiles stay inline (correct desktop behavior — no extra control row), and only when you shrink the browser window below 500px do the controls drop to their own row (the phone layout). Use the narrow-column-tiles scenario to see the #136 container-driven reflow without resizing.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'mobile-width-tiles';
      c.tile.layout = 'detailed';
      c.tile.tileWidth = 390;
      c.entries = [
        makeEntry({
          entry_id: 'eg_flur',
          title: 'EG Flur',
          window_azimuth: 180,
          color: '#ff7043',
        }),
        makeEntry({
          entry_id: 'eg_wz_oberlicht',
          title: 'EG WZ Oberlicht',
          window_azimuth: 225,
          color: '#26a69a',
        }),
        makeEntry({
          entry_id: 'eg_wz_grosses_fenster',
          title: 'EG WZ gr. Fenster',
          window_azimuth: 270,
          color: '#7e57c2',
        }),
      ];
      return c;
    },
  },
  {
    id: 'legend-live-glyphs',
    label: 'Legend live glyphs (issue #157)',
    description:
      'The reworked sky-compass legend (issue #157). A north-facing window at solar noon puts the sun SOUTH, OUTSIDE the FOV, so the legend Sun glyph (points 1/5) renders as a plain light disc with NO glow — the glyph tracks the live sun-dot state instead of a hardcoded valid gold. With Show moon on and a partial (waxing) phase, the Moon glyph (point 2) shows the real lit fraction via its own phase mask. The window row (points 3/4) is now an arrow glyph labelled "Window azimuth" (not "Window normal"), and the plotted window line carries a matching arrowhead at the rim. Change entry 0\'s colour to watch the arrow glyph + line follow the override.',
    build: () => {
      // 2026-06-21 noon: moon phase ≈ 0.24 (a clear partial waxing crescent) and
      // the noon sun sits ~south while the window faces north → sun outside FOV.
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'legend-live-glyphs';
      c.root.show_moon = true;
      c.compass.show_moon = true;
      c.entries = [
        makeEntry({
          entry_id: 'north_window',
          title: 'Loft',
          window_azimuth: 0,
          fov_left: 45,
          fov_right: 45,
          color: '#26a69a',
        }),
      ];
      return c;
    },
  },
  {
    id: 'floating-tooltip',
    label: 'Floating tooltip (#134)',
    description:
      'Card-owned floating tooltip enabled (down-and-right of the cursor, help cursor on hover that flips to default once the bubble shows). Hover the decision summary, the off-schedule banner, the compass FOV/sun groups, or the cover names. Switch the Tooltips control to "native" to compare with native browser tooltips.',
    build: () => {
      const c = baseConfig('2026-06-21', 13 * 60);
      c.scenario = 'floating-tooltip';
      // Off-schedule banner + a manual override make several tooltip carriers
      // appear at once (summary, banner, badge, compass groups, cover names).
      c.entries[0].flags.in_time_window = false;
      c.entries[0].flags.schedule_start_minutes = 9 * 60;
      c.entries[0].flags.schedule_end_minutes = 11 * 60;
      c.tooltips = { mode: 'floating', offset: [12, 16] };
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
    stageHeight: cfg.stageHeight ?? 0,
    tile: {
      ...cfg.tile,
      badges: { ...defaultBadges(), ...(cfg.tile?.badges ?? {}) },
      tileWidth: cfg.tile?.tileWidth ?? 0,
    },
    tooltips: { ...defaultTooltips(), ...(cfg.tooltips ?? {}) },
  };
}
