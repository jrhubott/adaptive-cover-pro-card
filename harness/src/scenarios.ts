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
      // Opt-in diagnostic section — off by default, mirroring the card.
      solar: false,
    },
    compact: false,
    show_compass_stats: true,
    show_compass_legend: true,
    show_moon: false,
    hide_inactive_handlers: false,
    show_decision_summary: true,
    state_color: true,
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

function defaultDecision(): HarnessConfig['decision'] {
  return {
    enabled: true,
    title: 'Decision',
    compact: false,
    hide_inactive_handlers: false,
    show_decision_summary: true,
  };
}

function defaultSolarChart(): HarnessConfig['solarChart'] {
  return {
    enabled: true,
    title: 'Solar chart',
    compact: false,
  };
}

function defaultHistory(): HarnessConfig['history'] {
  return {
    enabled: true,
    title: 'History',
    hours: 24,
    track_position: true,
    track_who_won: true,
    track_context: true,
    track_actions: true,
    advanced_open: false,
    hide_advanced: false,
    noDiagnosticsService: false,
    eventCount: 24,
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
    show_position_bar: true,
    show_tilt: true,
    covers: [],
    controls_cover: '',
    controls_axis: '',
    show_scene_select: true,
    show_lock: true,
    show_automation: true,
    show_clear_overrides: true,
    show_member_badges: true,
    badges: defaultBadges(),
    show_compass: true,
    show_elevation_chart: true,
    show_solar_calc: true,
    show_motion_icon: true,
    state_color: true,
    // Matches HA's cover default, so the glyph stays bare until opted in.
    icon_tap_action: 'none',
    layout: 'detailed',
    tileWidth: 0,
  };
}

function makeEntry(
  overrides: Partial<HarnessEntry> & Pick<HarnessEntry, 'entry_id'>,
): HarnessEntry {
  return {
    title: overrides.title ?? 'Living Room',
    area: overrides.area,
    cover_type: overrides.cover_type ?? 'cover_blind',
    window_azimuth: overrides.window_azimuth ?? 180,
    fov_left: overrides.fov_left ?? 45,
    fov_right: overrides.fov_right ?? 45,
    min_elevation: overrides.min_elevation,
    max_elevation: overrides.max_elevation,
    blind_spot_range: overrides.blind_spot_range,
    blind_spot_ranges: overrides.blind_spot_ranges,
    blind_spot_geometry_unavailable: overrides.blind_spot_geometry_unavailable,
    target_position: overrides.target_position ?? 40,
    target_tilt: overrides.target_tilt ?? 50,
    covers: overrides.covers ?? [
      {
        entity_id: `cover.${overrides.entry_id}_main`,
        friendly_name: `${overrides.title ?? 'Living Room'} cover`,
        position: 40,
        tilt: 50,
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
      linear_position: null,
      inverse_state: false,
      inverse_tilt: false,
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
      throttle_pending: false,
      throttle_skipped_minutes_ago: 2,
      throttle_threshold_minutes: 15,
      ...overrides.flags,
    },
    entry_id: overrides.entry_id,
  };
}

/**
 * Build a Cover Group HarnessEntry (issue #185). Reuses {@link makeEntry} for the
 * shared shape, then marks it a group and attaches the group state. Member covers
 * are foreign entity_ids read from `member_positions`, so the entry owns no covers
 * of its own.
 */
function makeGroupEntry(
  overrides: Partial<HarnessEntry> & Pick<HarnessEntry, 'entry_id'>,
): HarnessEntry {
  const base = makeEntry({ ...overrides, covers: overrides.covers ?? [] });
  return {
    ...base,
    is_group: true,
    group: overrides.group ?? {
      member_positions: {
        'cover.living_left': 40,
        'cover.living_right': 60,
        'cover.hall_generic': 0,
      },
      member_winners: {
        'cover.living_left': 'solar',
        'cover.living_right': 'manual',
      },
      aggregate_position: 33,
      state: 'mixed',
      active_scene: 'none',
      scene_option: 'auto',
      locked: false,
      automation: true,
      climate_mode: 'summer_mode',
    },
  };
}

/**
 * A Cover Group whose two ACP members are REAL entries in the scenario, so the
 * card can resolve each member cover back to its own Automatic Control switch —
 * which is what the group tile's Automation button colors from.
 *
 * `automation: true` on the group is left alone on purpose: that switch is a
 * write-only latch the integration defaults to on, so any scenario where the
 * members disagree with it is a scenario the old two-color button got wrong.
 */
function automationGroupEntries(auto: [boolean, boolean]): HarnessEntry[] {
  const backyard = makeEntry({
    entry_id: 'backyard',
    title: 'Backyard Shade',
    covers: [{ entity_id: 'cover.backyard_shade', friendly_name: 'Backyard Shade', position: 100 }],
    target_position: 100,
  });
  const sideYard = makeEntry({
    entry_id: 'side_yard',
    title: 'Side Yard Shade',
    covers: [
      { entity_id: 'cover.side_yard_shade', friendly_name: 'Side Yard Shade', position: 97 },
    ],
    target_position: 97,
  });
  backyard.flags.automatic_control = auto[0];
  sideYard.flags.automatic_control = auto[1];
  return [
    backyard,
    sideYard,
    makeGroupEntry({
      entry_id: 'family_room',
      title: 'Family Room',
      group: {
        member_positions: {
          'cover.backyard_shade': 100,
          'cover.side_yard_shade': 97,
          'cover.hall_generic': 40,
        },
        member_winners: {
          'cover.backyard_shade': 'solar',
          'cover.side_yard_shade': 'solar',
        },
        aggregate_position: 79,
        state: 'open',
        active_scene: 'none',
        scene_option: 'auto',
        locked: false,
        automation: true,
        climate_mode: 'summer_mode',
      },
    }),
  ];
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
    language: 'en',
    legacyIntegration: false,
    entries: [makeEntry({ entry_id: 'south_window', title: 'Living Room', window_azimuth: 180 })],
    decisionMode: 'derived',
    scriptedWinner: 'solar',
    root: defaultRoot(),
    compass: defaultCompass(),
    tile: defaultTile(),
    decision: defaultDecision(),
    solarChart: defaultSolarChart(),
    history: defaultHistory(),
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
  /** ISO date (YYYY-MM-DD) the scenario was added. Drives the "Date added" sort;
   *  when omitted the scenario is treated as older than any dated one and keeps
   *  its definition (append) order. Set it on every newly-added scenario. */
  added?: string;
  /** Associated GitHub issue number, when the scenario reproduces / guards one.
   *  When omitted, {@link scenarioIssue} falls back to parsing `#NNN` out of the
   *  label, so pre-existing scenarios that name their issue still get filtered. */
  issue?: number;
}

/** Effective issue number for a scenario: the explicit `issue` field, else the
 *  first `#NNN` found in its label, else null. */
export function scenarioIssue(s: Scenario): number | null {
  if (typeof s.issue === 'number') return s.issue;
  const m = s.label.match(/#(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

// IMPORTANT: keep this array in DATE-ADDED order — oldest first, newest last.
// Always APPEND a new scenario to the END of the array; never insert in the
// middle. The control panel's "Date added" sort relies on this definition order
// as the proxy for when each scenario was added (scenarios carry no timestamp).
export const SCENARIOS: Scenario[] = [
  {
    id: 'summer-noon-south',
    label: 'Summer noon — south window',
    description:
      'High elevation, sun in FOV, solar handler tracking. Issue #200: the Root card header (icon + entry title) AND each cover name in the COVERS section are tap targets — click either to open the same acp-more-info-dialog the Tile card opens on tap. Issue #231: the cover-bar Position track is now a drag-to-set slider — press and drag to preview a live percentage on the fill/readout, release to commit; it is also keyboard-operable (Tab to focus, Arrow keys ±1, Page Up/Down ±10, Home/End to the extremes). Clicking a header pill (Enabled/Auto) or anywhere else in the body must NOT open the dialog.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'summer-noon-south';
      return c;
    },
  },
  {
    id: 'forecast-actual-history',
    label: 'Forecast strip — actual vs. predicted',
    description:
      "Open the more-info dialog (tap the tile) and look at Today's forecast strip. Two lines now overlay: the predicted position curve (primary color, full day) and the recorded ACTUAL position (blue, 00:00 → now) fetched from the recorder. The actual line is a STEP function (issue #255, the forecast-strip twin of #253): it holds perfectly flat across the overnight gap and then steps VERTICALLY at the first morning move — never a diagonal ramp sloping from midnight up to sunrise, which would claim positions the cover was never at. It also now starts hard against the left edge at the position held from before midnight, rather than beginning partway across at the first in-day transition; the mock recorder returns that pre-window row the way HA's `include_start_time_state` does. The line stops at the `now` cursor, not at 24:00 — nothing is recorded past now. Hovering reports the value HELD at the cursor, so a hover just before a step reads the old value, matching the line underneath. Hover PAST the now cursor and the Actual segment drops out of the readout entirely — the actual line has ended there, so there is no recorded value to report and the label falls back to the forecast alone. Set mid-afternoon so there is a full morning of actual history. The manual-override-divergence scenarios show the other case — actual held flat while the forecast keeps moving.",
    build: () => {
      const c = baseConfig('2026-06-21', 15 * 60);
      c.scenario = 'forecast-actual-history';
      return c;
    },
  },
  {
    id: 'venetian-dual-axis',
    label: 'Venetian — dual-axis (position + tilt)',
    description:
      'A venetian blind exposing the tilt (slat) axis, now driven from the integration self-discovery surface (issue #180): the control_status sensor publishes a cover_discovery descriptor with position + tilt axes, and the card renders one bar per discovered axis. The cover bar shows a second Tilt bar under Position, and the tile card shows the mini tilt bar. Actual tilt (35%) diverges from the solar tilt target (70%) so the marker is offset from the fill. The more-info dialog forecast strip also plots a dashed secondary tilt track alongside the position curve. Either tilt track is a real drag-to-set slider: press and drag and the fill plus the percentage readout follow live with nothing sent mid-gesture, then release to fire the combined adaptive_cover_pro.set_axes service once (watch the service log). It is keyboard-operable too — Tab to a track, arrows step 1 axis unit, Page Up/Down step 10, Home/End jump to the range ends — and on the tile card the drag must NOT open the more-info dialog. Flip the "Legacy integration" control off/on, or use the Legacy Venetian scenario, to confirm graceful fallback to set_tilt/set_position.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'venetian-dual-axis';
      c.entries = [
        makeEntry({
          entry_id: 'south_window',
          title: 'Living Room',
          cover_type: 'cover_venetian',
          window_azimuth: 180,
          color: '#26a69a',
          target_position: 60,
          target_tilt: 70,
          covers: [
            {
              entity_id: 'cover.south_window_main',
              friendly_name: 'Living Room venetian',
              position: 60,
              tilt: 35,
            },
          ],
        }),
      ];
      return c;
    },
  },
  {
    id: 'day-night-dual-rail',
    label: 'Day/night shade — two rails (dual_entity)',
    description:
      "A day/night shade in the integration's dual_entity control model: ONE config entry binding TWO cover.* rail entities (bottom rail carries the coverage, middle rail carries the sheer-vs-blackout fabric split). The blend is not a drivable tilt axis on either entity, so discovery reports position only — pre-fix the tile card rendered managed_covers[0] and nothing else, leaving the middle rail with no readout and no control anywhere on the tile. The tile must now show ONE POSITION RAIL PER MANAGED COVER, stacked in the slot the single bar used to occupy, each led by its own cover glyph rather than a name — resolved through the same chain as the tile icon (entity `icon` → `device_class` → `cover_type`), so the two rails here carry DIFFERENT glyphs only because the middle rail pins an explicit `icon`. Hover a glyph for that rail's name, and the slider's accessible name carries it too. Clear the middle rail's `icon` in this scenario and both rails collapse to the same shutter glyph — that is correct, and the reason the names moved to the tooltip instead of disappearing. BOTH rails carry an orange target tick, but from DIFFERENT sources, deliberately. The resolved cover (the bottom rail) keeps the entry-level pipeline target — the number this tile has always shown, and the one the dialog marker still shows. Every OTHER rail reads its own dispatched value from the position_verification sensor's per_entity map: the middle rail's is 30 against the entry target of 60, because its dispatched value is the fabric blend folded into an absolute position, so borrowing the entry target would put its tick on the wrong scale. Flip “Legacy integration” on to drop per_entity entirely — the bottom rail is unaffected and the middle rail goes tickless rather than showing a borrowed number. OPEN THE MORE-INFO DIALOG AND LOOK AT THE FORECAST STRIP TOO: this cover type is the phantom-tilt repro. Its discovery declares a `tilt` axis with `supported: false` — it has two rails, not slats — while the integration still emits a `tilt` value on every solar forecast sample. The strip must draw ONE track and a legend with no Tilt entry. A second, dashed track here means something went back to deciding what to plot from the sample keys instead of from discovery, which is what drew a slat curve on a slatless shade. Compare the Venetian dual-axis scenario, where tilt IS supported and the dashed track is correct. Rail ORDER follows the integration's own entity order (config_entry.options[entities]), which the card cannot influence — set “covers (rail order)” in the Tile card panel to Reversed and the two rails swap, or to “First rail only” to prove it doubles as a filter. The ORDER CARRIES INTO THE MORE-INFO DIALOG: open the tile and the dialog\'s stacked cover bars follow the same order and subset, so the two surfaces never disagree. Only an explicit covers list travels — a tile pinned with `cover` alone leaves the dialog showing every managed cover exactly as before. The rails draw COVERAGE, not openness: a full rail means the cover is blocking the most sun, the same polarity as the sky compass wedge — which now reads the same open_blocks_sun flag instead of testing for cover_awning, so an oscillating awning no longer draws an inverted wedge beside a correctly-filled rail. Polarity comes from the discovery axis flag open_blocks_sun, so it is per-axis and per-cover-type rather than hardcoded — compare against any AWNING scenario, where extending raises both the value and the coverage so its rail fills the other way. Drag, arrows and the target tick all follow the drawn direction; only the tooltip and the service call stay in the integration frame. Each rail is an independent slider: drag one and only that rail's fill follows (a single shared drag state used to paint both), release fires exactly one set_axes for THAT entity (watch the service log), and the gesture must not open the more-info dialog. Point “controls_cover” at the middle rail in the Tile card panel and the ↑■↓ buttons retarget to it — including their at-open/at-closed disabling, which now reads the retargeted entity rather than always the first cover. It retargets the BUTTONS ONLY, deliberately: the name/state line, position readout, icon, color and tap target all keep describing the resolved cover (the bottom rail), and the orange target ticks stay where they are. Making the display follow this option was tried and reverted — the tile's `cover` is simultaneously the displayed entity, the rail carrying the entry-level pipeline target, the tilt axis's read/write target and the anchor for the entry-scale position fallback, so moving it for display silently moved a service-call target too.",
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'day-night-dual-rail';
      c.entries = [
        makeEntry({
          entry_id: 'south_window',
          title: 'Living Room',
          cover_type: 'cover_day_night_shade',
          window_azimuth: 180,
          color: '#7e57c2',
          target_position: 60,
          covers: [
            {
              entity_id: 'cover.south_window_bottom',
              friendly_name: 'Living Room bottom rail',
              position: 60,
              tilt: 0,
            },
            {
              entity_id: 'cover.south_window_middle',
              friendly_name: 'Living Room middle rail',
              position: 25,
              tilt: 0,
              // The HA-native way to tell two rails of one shade apart, since
              // the card cannot derive bottom-vs-middle from anything but names.
              icon: 'mdi:blinds-horizontal',
              // Deliberately unlike the entry target (60): this rail's
              // dispatched value is the fabric blend folded into an absolute
              // position, so its tick must come from its own per_entity target.
              command_target: 30,
            },
          ],
        }),
      ];
      return c;
    },
  },
  {
    id: 'legacy-integration-venetian',
    label: 'Legacy integration — venetian (no discovery / set_axes)',
    description:
      'The same venetian dual-axis cover, but simulating an OLD integration that predates issue #180: the control_status sensor omits cover_discovery and the mock hass omits the set_axes service. The card must degrade gracefully — it synthesizes the position + tilt axes from the Cover_Tilt sensor (byte-identical to the pre-discovery rendering) and routes drag-to-set on either track to the legacy per-axis set_position / set_tilt services, still committing once on release (watch the service log — no set_axes call). Proves the load-bearing fallback path that ships before the integration release.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'legacy-integration-venetian';
      c.legacyIntegration = true;
      c.entries = [
        makeEntry({
          entry_id: 'south_window',
          title: 'Living Room',
          cover_type: 'cover_venetian',
          window_azimuth: 180,
          color: '#26a69a',
          target_position: 60,
          target_tilt: 70,
          covers: [
            {
              entity_id: 'cover.south_window_main',
              friendly_name: 'Living Room venetian',
              position: 60,
              tilt: 35,
            },
          ],
        }),
      ];
      return c;
    },
  },
  {
    id: 'mirrored-rails-target-ticks',
    label: 'Mirrored rails — upstream: covers skipped as same_position get no tick',
    description:
      "One entry driving THREE identical shades across a window bank, reproducing an UPSTREAM integration gap (adaptive-cover-pro#1158) rather than a card bug — it is the repro case and the future regression guard, and the card deliberately does NOT paper over it. `per_entity[….].target` is a RECONCILIATION record: the integration writes it only when it dispatches, and a cover already sitting on the calculated position is skipped as `same_position`, so it never receives one even though the pipeline computed the number — visible in last_skipped_action's own calculated_position. READ THE RAILS LEFT TO RIGHT, because the three ticks come from three different places and only the middle one proves anything. The LEFT rail is managed_covers[0], the tile's resolved cover, so `railTarget` short-circuits and hands it the ENTRY target before per_entity is ever consulted — it would be ticked whatever this scenario said. The CENTER rail is the one the integration has reconciled: its tick comes from its own per_entity target, and setting its `command_target` to null visibly removes it. The RIGHT rail is unreconciled and therefore BARE — that is the bug, and the card leaves it bare on purpose, because it cannot tell a MIRRORED rail (entry scale, borrowing the entry target would be right) from a REMAPPED one (own scale, borrowing would put the tick in the wrong place). Note the integration's own diagnostics contradict themselves here exactly as they do live: per_entity reports at_target false for a cover the entry-level sensor counts inside all_at_target true. Compare the Day/night dual-rail scenario for the remapped case, where the middle rail publishes its own 30 against an entry target of 60. When the integration records the target on its skip path, the right rail gains a tick with no card change — that is the assertion this scenario holds.",
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'mirrored-rails-target-ticks';
      c.entries = [
        makeEntry({
          entry_id: 'front_bank',
          title: 'Front Shades',
          cover_type: 'cover_blind',
          window_azimuth: 180,
          color: '#7e57c2',
          target_position: 40,
          covers: [
            {
              entity_id: 'cover.front_left_shade',
              friendly_name: 'Front Left Shade',
              position: 40,
              // The RESOLVED cover (managed_covers[0]). Its tick comes from the
              // entry target via railTarget's `id === cover` short-circuit, so
              // per_entity never enters into it — deliberately left null to
              // stop this rail from looking like evidence for the per-cover path.
              command_target: null,
            },
            {
              entity_id: 'cover.front_center_shade',
              friendly_name: 'Front Center Shade',
              position: 40,
              // The load-bearing one: a NON-resolved rail the integration HAS
              // reconciled, so its tick can only have come from per_entity.
              // Flip this to null and the tick disappears.
              command_target: 40,
            },
            {
              entity_id: 'cover.front_right_shade',
              friendly_name: 'Front Right Shade',
              position: 40,
              // Non-resolved and unreconciled: bare rail, the reported bug.
              command_target: null,
            },
          ],
        }),
      ];
      return c;
    },
  },
  {
    id: 'ha-device-class-icons',
    label: 'HA device_class icons + control glyphs',
    description:
      "Issue #208: the tile/header/dialog icon and the up/down control glyphs are derived from each managed cover's HA device_class (and honor an explicit entity `icon`), matching HA's native tile card instead of the integration's coarse cover_type. Six tiles exercise the fallback chain: an AWNING (retracted → awning glyph, and horizontal expand/collapse >|< controls), a SHUTTER (partial → window-shutter), a CURTAIN (open → curtains, inset controls), a VENETIAN with device_class blind (closed → blinds-horizontal-closed), a cover with an explicit icon (mdi:star wins over its awning device_class), and a cover with NO device_class (device_class 'none' → falls back to the cover_type cover_blind glyph, plain ↑↓ controls). Compare each tile's icon + control buttons to what HA shows for the same cover.",
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'ha-device-class-icons';
      c.entries = [
        makeEntry({
          entry_id: 'awning',
          title: 'Awning',
          cover_type: 'cover_awning',
          window_azimuth: 180,
          color: '#ff7043',
          target_position: 0,
          covers: [
            {
              entity_id: 'cover.awning_main',
              friendly_name: 'Patio awning',
              position: 0,
              device_class: 'awning',
            },
          ],
        }),
        makeEntry({
          entry_id: 'shutter',
          title: 'Shutter',
          cover_type: 'cover_blind',
          window_azimuth: 200,
          color: '#8d6e63',
          target_position: 50,
          covers: [
            {
              entity_id: 'cover.shutter_main',
              friendly_name: 'Bedroom shutter',
              position: 50,
              device_class: 'shutter',
            },
          ],
        }),
        makeEntry({
          entry_id: 'curtain',
          title: 'Curtain',
          cover_type: 'cover_blind',
          window_azimuth: 160,
          color: '#5c6bc0',
          target_position: 100,
          covers: [
            {
              entity_id: 'cover.curtain_main',
              friendly_name: 'Living curtain',
              position: 100,
              device_class: 'curtain',
            },
          ],
        }),
        makeEntry({
          entry_id: 'venetian',
          title: 'Venetian',
          cover_type: 'cover_venetian',
          window_azimuth: 140,
          color: '#26a69a',
          target_position: 0,
          target_tilt: 70,
          covers: [
            {
              entity_id: 'cover.venetian_main',
              friendly_name: 'Office venetian',
              position: 0,
              tilt: 35,
              device_class: 'blind',
            },
          ],
        }),
        makeEntry({
          entry_id: 'explicit_icon',
          title: 'Explicit icon',
          cover_type: 'cover_awning',
          window_azimuth: 120,
          color: '#ec407a',
          target_position: 60,
          covers: [
            {
              entity_id: 'cover.explicit_icon_main',
              friendly_name: 'Starred cover',
              position: 60,
              device_class: 'awning',
              icon: 'mdi:star',
            },
          ],
        }),
        makeEntry({
          entry_id: 'no_device_class',
          title: 'No device_class',
          cover_type: 'cover_blind',
          window_azimuth: 220,
          color: '#78909c',
          target_position: 40,
          covers: [
            {
              entity_id: 'cover.no_device_class_main',
              friendly_name: 'Generic cover',
              position: 40,
              device_class: 'none',
            },
          ],
        }),
      ];
      return c;
    },
  },
  {
    id: 'state-color-by-status',
    label: 'Cover icon color follows state (#208)',
    description:
      "Issue #208: the tile/header/dialog cover icon COLOR now follows the underlying HA cover state, matching HA's own theme-aware --state-cover-* cascade instead of a single fixed color. Five tiles, same cover_type, side by side: OPEN and OPENING/CLOSING (in-transit) resolve to the active tier (orange --state-active-color by default), CLOSED resolves to the inactive tier (grey --state-inactive-color), and UNAVAILABLE resolves to its own --state-unavailable-color (lighter grey). Toggle each tile's `state_color` config off in the control panel to confirm the icon falls back to the old fixed color when the feature is disabled.",
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'state-color-by-status';
      c.entries = [
        makeEntry({
          entry_id: 'state_open',
          title: 'Open',
          window_azimuth: 180,
          color: '#ffa726',
          target_position: 100,
          covers: [
            {
              entity_id: 'cover.state_open_main',
              friendly_name: 'Open cover',
              position: 100,
              state: 'open',
            },
          ],
        }),
        makeEntry({
          entry_id: 'state_opening',
          title: 'Opening',
          window_azimuth: 180,
          color: '#ffa726',
          target_position: 60,
          covers: [
            {
              entity_id: 'cover.state_opening_main',
              friendly_name: 'Opening cover',
              position: 40,
              state: 'opening',
            },
          ],
        }),
        makeEntry({
          entry_id: 'state_closing',
          title: 'Closing',
          window_azimuth: 180,
          color: '#ffa726',
          target_position: 20,
          covers: [
            {
              entity_id: 'cover.state_closing_main',
              friendly_name: 'Closing cover',
              position: 60,
              state: 'closing',
            },
          ],
        }),
        makeEntry({
          entry_id: 'state_closed',
          title: 'Closed',
          window_azimuth: 180,
          color: '#8a8a8a',
          target_position: 0,
          covers: [
            {
              entity_id: 'cover.state_closed_main',
              friendly_name: 'Closed cover',
              position: 0,
              state: 'closed',
            },
          ],
        }),
        makeEntry({
          entry_id: 'state_unavailable',
          title: 'Unavailable',
          window_azimuth: 180,
          color: '#bdbdbd',
          target_position: 40,
          covers: [
            {
              entity_id: 'cover.state_unavailable_main',
              friendly_name: 'Unavailable cover',
              position: null,
              state: 'unavailable',
            },
          ],
        }),
      ];
      return c;
    },
  },
  {
    id: 'ha-tile-badge-row',
    label: 'HA tile layout — badges on the dedicated row',
    description:
      "HA-tile layout match (#208 follow-up): the detailed Tile card now mirrors HA's native tile — a state-tinted 36px icon shape, a name-over-state label column, and HA-metric control buttons — with ACP's own chrome (Auto / Manual / floor badges) dropped onto a dedicated full-width row that starts at the label's left edge. This scenario arms a manual override AND an enabled, named min-mode floor slot ('Aeration floor'), so the badge row shows the Manual badge alongside the ↥ Aeration floor · 40% chip (#278: the floor chip now surfaces the slot's configured name); the top two rows read exactly like a native HA tile. Regression guard: the floor chip must ride this badge row, not collapse the detailed grid back to the one-line layout.",
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'ha-tile-badge-row';
      c.entries = [
        makeEntry({
          entry_id: 'living_room',
          title: 'Living Room',
          window_azimuth: 180,
          color: '#7e57c2',
          target_position: 60,
          covers: [
            {
              entity_id: 'cover.living_room_main',
              friendly_name: 'Living Room shade',
              position: 60,
              device_class: 'shade',
            },
          ],
          // Enable the priority-90 min-mode floor slot (slot 4) so its sensor
          // arms — with manual override winning (manual precedes custom_position
          // in HANDLER_ORDER), the floor stays a constraint and its ↥ chip shows.
          slots: [
            {
              slot: 1,
              enabled: false,
              position: 75,
              name: 'Movie time',
              min_mode: false,
              priority: 60,
            },
            {
              slot: 2,
              enabled: false,
              position: 20,
              name: 'Privacy',
              min_mode: false,
              priority: 70,
            },
            {
              slot: 3,
              enabled: false,
              position: 100,
              name: 'Welcome home',
              min_mode: false,
              priority: 50,
            },
            {
              slot: 4,
              enabled: true,
              position: 40,
              name: 'Aeration floor',
              min_mode: true,
              priority: 90,
            },
            {
              slot: 5,
              enabled: true,
              position: 0,
              name: 'Safety',
              min_mode: false,
              priority: 100,
              sensors: ['binary_sensor.living_room_wind', 'binary_sensor.living_room_frost'],
              template: true,
              template_mode: 'or',
            },
          ],
        }),
      ];
      // Arm the manual override on the built entry (makeEntry's `flags` override
      // wants the full flag set; mutating the returned full object is simpler).
      c.entries[0].flags.manual_override = true;
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
    id: 'cover-at-travel-limits',
    label: 'Cover at travel limits — disabled controls',
    description:
      'Two windows whose covers report being fully open (100%) and fully closed (0%). The tile control cluster disables the button that can do nothing: ↑ (open) is dimmed/disabled on the fully-open cover, ↓ (close) on the fully-closed one. ■ (stop) stays active on both.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'cover-at-travel-limits';
      c.entries = [
        makeEntry({
          entry_id: 'open_window',
          title: 'Fully open',
          window_azimuth: 180,
          covers: [
            {
              entity_id: 'cover.open_window_main',
              friendly_name: 'Fully open cover',
              position: 100,
            },
          ],
        }),
        makeEntry({
          entry_id: 'closed_window',
          title: 'Fully closed',
          window_azimuth: 180,
          color: '#42a5f5',
          covers: [
            {
              entity_id: 'cover.closed_window_main',
              friendly_name: 'Fully closed cover',
              position: 0,
            },
          ],
        }),
      ];
      return c;
    },
  },
  {
    id: 'cover-unavailable',
    label: 'Cover unavailable — tile shows offline',
    description:
      'The physical cover entity has gone unavailable (offline/unresponsive), but the ' +
      "integration's diagnostics keep running — the decision trace and target-position " +
      'sensor stay live. The tile must not leak a stale position: it shows an ' +
      '"Unavailable" label, dims the whole tile, and disables all three ↑■▼ controls. A ' +
      'second, dual-axis venetian entry proves the same gate covers the tilt axis (issue ' +
      '#212 follow-up): its mini tilt bar shows no stale actual/target and ignores clicks, ' +
      'even though sensor.cover_tilt keeps reporting a live solar target.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'cover-unavailable';
      c.entries = [
        makeEntry({
          entry_id: 'offline_window',
          title: 'Offline cover',
          window_azimuth: 180,
          covers: [
            {
              entity_id: 'cover.offline_window_main',
              friendly_name: 'Offline cover',
              position: null,
              state: 'unavailable',
            },
          ],
        }),
        makeEntry({
          entry_id: 'offline_venetian_window',
          title: 'Offline venetian',
          cover_type: 'cover_venetian',
          window_azimuth: 180,
          color: '#26a69a',
          target_tilt: 70,
          covers: [
            {
              entity_id: 'cover.offline_venetian_window_main',
              friendly_name: 'Offline venetian',
              position: null,
              tilt: 35,
              state: 'unavailable',
            },
          ],
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
    label: 'Manual override — solar diverges (target 100%)',
    description:
      'Manual override holds the cover at 70% while the sun would have the integration open it fully to 100% (the trailing #158 screenshot). The sky compass draws the solar "Cover target" wedge plus the dashed "Cover position (held)" ring, and the legend now names BOTH rows. The COVERS bar header reads "Solar target: 100%" (the solar would-be value, not the held setpoint), with the fill/number at the held 70% and no alert badge — the divergence is intentional (#158). The target marker is clamped just inside the right rail at 100% so it stays visible instead of clipping. The decision strip shows 70% (held) in the position column and "solar 100%" inline after the reason (#161). Toggle the override off to see the badge return for a genuine mismatch.',
    build: () => {
      const c = baseConfig('2026-06-21', 14 * 60);
      c.scenario = 'manual-override-divergence';
      c.entries[0].flags.manual_override = true;
      c.entries[0].flags.manual_override_minutes_from_now = 60;
      // target_position is the SOLAR would-be target (surfaces as
      // raw_calculated_position); held_position is where the user parked it.
      c.entries[0].target_position = 100;
      c.entries[0].flags.held_position = 70;
      c.entries[0].covers[0].position = 70;
      return c;
    },
  },
  {
    id: 'manual-override-divergence-zero',
    label: 'Manual override — solar diverges (target 0%)',
    description:
      'The 0% counterpart to the 100% divergence scenario: manual override holds the cover at 30% while the solar would-be target is a fully-closed 0%. The COVERS target marker is clamped just inside the LEFT rail at 0% so it stays visible instead of pinning to the corner (item B at the low extreme). The header reads "Solar target: 0%", the dashed "Cover position (held)" ring shows on the compass alongside the solid target wedge, and no alert badge appears — the divergence is intentional (#158).',
    build: () => {
      const c = baseConfig('2026-06-21', 14 * 60);
      c.scenario = 'manual-override-divergence-zero';
      c.entries[0].flags.manual_override = true;
      c.entries[0].flags.manual_override_minutes_from_now = 60;
      c.entries[0].target_position = 0;
      c.entries[0].flags.held_position = 30;
      c.entries[0].covers[0].position = 30;
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
    id: 'interpolation-linear-position',
    label: 'Interpolation — linear vs. motor position (#219)',
    description:
      'A non-linear calibration curve maps the configured 10% to a 31% motor command. The COVERS "Target" chip shows the logical 10% the user configured, with a "Motor: 31%" tooltip on hover for debugging. Toggle the integration-version behavior by clearing linear_position to see the pre-#219 fallback (shows 31% as primary, no tooltip).',
    build: () => {
      const c = baseConfig('2026-06-21', 14 * 60);
      c.scenario = 'interpolation-linear-position';
      // target_position is what state-gen writes to the sensor STATE (the
      // motor/interpolated command); linear_position is the pre-interpolation
      // logical value the user actually configured.
      c.entries[0].target_position = 31;
      c.entries[0].covers[0].position = 31;
      c.entries[0].flags.linear_position = 10;
      return c;
    },
  },
  {
    id: 'inverse-state-awning',
    label: 'Inverse state — extended awning (#234)',
    description:
      'An `inverse_state` awning, fully extended and on target. The integration dispatches 100 − 100 = 0, so the Cover_Position sensor STATE, its actual_positions and the physical cover entity all read 0, while linear_position / linear_actual_positions stay at the logical 100 and the discovery position axis carries inverted: true. The card must render entirely in the logical frame: a FULL position bar with the target marker on top of it (not an empty bar with the marker pinned at the far end) — an awning blocks more sun as it extends (open_blocks_sun: true), so its rail is the one cover type whose fill is NOT mirrored, the readout "Open · 100%" agreeing with the entity state, the open glyph, ↑ (open) disabled and ↓ (close) live, the compass actual ring on the target wedge, the forecast history track the same way up as the forecast curve, and no spurious "Motor: 0%" tooltip on the COVERS Target chip. This is also the frame check for the position slider: drag the tile bar to roughly a third and the set_axes call in the service log must carry that same logical value (~33), not its cover-frame mirror (~67) — render frame and write frame have to agree.',
    build: () => {
      const c = baseConfig('2026-06-21', 14 * 60);
      c.scenario = 'inverse-state-awning';
      c.entries = [
        makeEntry({
          entry_id: 'patio',
          title: 'Patio Awning',
          cover_type: 'cover_awning',
          window_azimuth: 180,
          color: '#ff7043',
          target_position: 100,
          covers: [
            {
              entity_id: 'cover.patio_awning',
              friendly_name: 'Patio awning',
              // Logical: fully extended. state-gen flips this to the reported 0.
              position: 100,
              device_class: 'awning',
            },
          ],
        }),
      ];
      c.entries[0].flags.inverse_state = true;
      return c;
    },
  },
  {
    id: 'inverse-state-awning-legacy',
    label: 'Inverse state — pre-#1033 integration (#234 residual)',
    description:
      'The same extended awning on an integration too old to publish either frame field: no linear_actual_positions and no cover_discovery (so no inverted flag). Every card-only way to infer the frame is unsound, so the card deliberately does NOT guess — this scenario intentionally shows the BROKEN rendering (empty bar, marker at 100%, "Open · 0%", ↓ close disabled). It is the documented residual and the guard against a future "helpful" inference; the fix requires the integration upgrade.',
    build: () => {
      const c = SCENARIOS.find((s) => s.id === 'inverse-state-awning')!.build();
      c.scenario = 'inverse-state-awning-legacy';
      c.legacyIntegration = true;
      return c;
    },
  },
  {
    id: 'inverse-tilt-venetian',
    label: 'Inverse tilt — venetian slats (#236)',
    description:
      'A venetian with `inverse_tilt` configured on the SLAT axis only. The integration dispatches 100 − 35 = 65, so the mock cover reports current_tilt_position: 65 while the Cover_Tilt sensor still publishes the logical target 70 and the discovery tilt axis carries inverted: true. The card must draw the tilt bar with the readout "35 %" while its FILL sits at 65% and the target marker at 30% — slats block more sun as the value falls (open_blocks_sun: false), so the track is mirrored and aria-valuenow is the drawn 65. The wide, obvious actual-vs-target gap is the point. The POSITION bar is untouched at a logical 60 (drawn 40%), proving the two axes normalize independently. Drag the tilt track to roughly 80% and the service log must show exactly one set_axes { tilt: 80 } — NOT 20; render frame and write frame have to agree (the integration applies its own _to_wire). ArrowUp on the focused tilt track commits 34 — it steps the DRAWN value so the fill follows the key, and on a mirrored axis that is a lower tilt value. What it must never do is step from the cover-frame 65 (which would give 64 or 66) — pre-fix the bar did exactly that and jumped 31 points.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'inverse-tilt-venetian';
      c.entries = [
        makeEntry({
          entry_id: 'south_window',
          title: 'Living Room',
          cover_type: 'cover_venetian',
          window_azimuth: 180,
          color: '#26a69a',
          target_position: 60,
          target_tilt: 70,
          covers: [
            {
              entity_id: 'cover.south_window_main',
              friendly_name: 'Living Room venetian',
              position: 60,
              // Logical slat angle. state-gen flips this to the reported 65.
              tilt: 35,
            },
          ],
        }),
      ];
      c.entries[0].flags.inverse_tilt = true;
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
    label: 'Occupancy timeout pending',
    description: 'Occupancy just cleared; covers reopen in 30s.',
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
    id: 'throttled-waiting-interval',
    label: 'Throttled — waiting on interval',
    description:
      'A move was just skipped by the minimum-interval throttle (time_delta_too_small) ~2 min ago with a 15 min interval, so the decision strip shows a "next adjustment allowed in …" countdown. The cover is still at its old position while the target has moved on.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'throttled-waiting-interval';
      c.entries[0].flags.throttle_pending = true;
      c.entries[0].flags.throttle_skipped_minutes_ago = 2;
      c.entries[0].flags.throttle_threshold_minutes = 15;
      // Live ≠ target: the throttle is a send-gate, so the target keeps tracking
      // the solar position while the physical cover lags behind.
      c.entries[0].target_position = 89;
      c.entries[0].covers[0].position = 100;
      return c;
    },
  },
  {
    id: 'motion-idle-badge',
    label: 'Occupancy idle badge',
    description:
      'Occupancy handler winning with the occupancy indicator icon turned off, so the "Occupancy idle" text badge shows. Turn the indicator back on, or disable the occupancy badge, to watch it fall back to Auto.',
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
    id: 'decision-standalone-card',
    label: 'Decision card — standalone strip',
    description:
      'Exercises the standalone custom:adaptive-cover-pro-decision-card (issue #170). The same acp-decision-strip renders in the root card Decision section, inside the more-info dialog Advanced area, AND as its own card on the Decision tab — all identical. The standalone card carries a "Why this position?" header and hides inactive handlers; toggle compact / hide-inactive / show-summary in the Decision card fieldset to verify they reach the strip.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'decision-standalone-card';
      c.decisionMode = 'derived';
      c.decision.title = 'Why this position?';
      c.decision.hide_inactive_handlers = true;
      return c;
    },
  },
  {
    id: 'solar-chart-standalone-card',
    label: 'Solar chart card — standalone (issue #187)',
    description:
      'Exercises the standalone custom:adaptive-cover-pro-solar-chart-card (issue #187). Three overlapping-FOV entries (SE/S/SW) so the same multi-cover elevation chart the sky-compass card already renders (#120) shows its stacked color-keyed FOV bars here too, on its own card with no polar compass. Toggle compact in the Solar chart card fieldset to verify it reaches the chart.',
    build: () => {
      const c = baseConfig('2026-06-21', 13 * 60 + 30);
      c.scenario = 'solar-chart-standalone-card';
      c.solarChart.title = 'Sun today — all windows';
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
    id: 'group-driven-member',
    label: 'Group-driven member — group lock wins (issue #185)',
    description:
      'A member cover of a Cover Group whose group is locked: the integration emits the priority-100 `group_lock` handler as the winner. The decision strip renders a "Group Lock" winner row (and a skipped "Group Scene" step), proving the two new group handlers wire into the fixed HANDLER_ORDER. Full group discovery / group UI arrives in later phases; this scenario exercises only the decision-strip wire slice.',
    build: () => {
      const c = baseConfig('2026-06-21', 13 * 60);
      c.scenario = 'group-driven-member';
      c.decisionMode = 'scripted';
      c.scriptedWinner = 'group_lock';
      // Group lock holds the member fully closed.
      c.entries[0].target_position = 0;
      c.entries[0].covers[0].position = 0;
      return c;
    },
  },
  {
    id: 'group-tile',
    label: 'Cover Group — tile variant (issue #185)',
    description:
      "A Cover Group entry rendered as the group tile, now carrying the cover tile's full control surface: a position-aware glyph tinted by the aggregate state, the ↑■↓ button row, a drag-to-set aggregate slider, and the group row (scene select, lock, automation, clear overrides) — plus the who-won \"2/3\" badge. Drag the slider or press ↑/↓ → adaptive_cover_pro.group_set_position fans out to every member; ■ → group_stop; pick a scene → select.select_option; toggle lock/automation → switch.turn_on/off; clear overrides → button.press. Tap the tile body to open the group dialog, where every member row is independently controllable. This group's members are bare cover entity_ids with no ACP entries behind them, so the Automation button has nothing to roll up and holds its pre-rollup look — driven by the group's own switch. That degradation is the point of keeping it here; the three colors live in the group-automation-* scenarios.",
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'group-tile';
      c.entries = [makeGroupEntry({ entry_id: 'downstairs_group', title: 'Downstairs Group' })];
      // The cover-oriented root/decision/compass/solar cards don't apply to a
      // group entry; the tile (and its dialog) is the whole surface here.
      c.root.enabled = false;
      c.compass.enabled = false;
      c.decision.enabled = false;
      c.solarChart.enabled = false;
      c.tile.layout = 'detailed';
      return c;
    },
  },
  {
    id: 'group-tile-members',
    label: 'Cover Group — per-member control in the dialog',
    description:
      "The group dialog's reason for existing: a 4-member roster where each row has its own drag slider and ↑■↓ triple. Routing is split by whether the member has an ACP pipeline — `cover.living_left` / `living_right` / `bedroom` appear in member_winners so their moves go through adaptive_cover_pro.set_axes (engaging that member's manual override, exactly like dragging its own tile), while `cover.hall_generic` has a position but no winner, so it takes the native cover.set_cover_position. Watch the service log to see the two paths, and the aggregate readout/slider re-average as individual members move.",
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'group-tile-members';
      c.entries = [
        makeGroupEntry({
          entry_id: 'upstairs_group',
          title: 'Upstairs Group',
          group: {
            member_positions: {
              'cover.living_left': 30,
              'cover.living_right': 45,
              'cover.bedroom': 0,
              'cover.hall_generic': 80,
            },
            member_winners: {
              'cover.living_left': 'solar',
              'cover.living_right': 'manual',
              'cover.bedroom': 'group_lock',
            },
            aggregate_position: 39,
            state: 'mixed',
            active_scene: 'none',
            scene_option: 'auto',
            locked: false,
            automation: true,
            climate_mode: 'summer_mode',
          },
        }),
      ];
      c.root.enabled = false;
      c.compass.enabled = false;
      c.decision.enabled = false;
      c.solarChart.enabled = false;
      c.tile.layout = 'detailed';
      return c;
    },
  },
  {
    id: 'group-member-tiles',
    label: 'Cover Group — members render as their own tile cards',
    description:
      "The roster is literally a stack of tile cards. Two of the members (`cover.backyard_shade`, `cover.side_yard_shade`) are covers of REAL ACP entries in this scenario, so each roster row resolves to that entry and renders its own `adaptive-cover-pro-tile-card` — badges, state coloring, icon, ↑■↓, position slider, and tap-for-more-info are the shipped tile, not a lookalike. The third member is a generic cover with no ACP entry behind it, so it has no tile to render and falls back to the compact row. Side Yard Shade is held under a manual override, so the GROUP tile rolls that up: an orange Manual badge sits beside the 0/2 who-won count, and the clear-overrides button is enabled. Flip that member's winner to `solar` and the badge disappears and the button greys out. Open the group tile to see the roster; tapping a member tile opens that member's own more-info dialog on top of the group dialog, and closing it returns you to the group dialog. Because both ACP members resolve here, the group's Automation button also rolls their real state up — green with both on; untick Automatic control on one member and it goes amber.",
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'group-member-tiles';
      c.entries = [
        makeEntry({
          entry_id: 'backyard',
          title: 'Backyard Shade',
          covers: [
            {
              entity_id: 'cover.backyard_shade',
              friendly_name: 'Backyard Shade',
              position: 100,
              tilt: 50,
            },
          ],
          target_position: 100,
        }),
        makeEntry({
          entry_id: 'side_yard',
          title: 'Side Yard Shade',
          covers: [
            {
              entity_id: 'cover.side_yard_shade',
              friendly_name: 'Side Yard Shade',
              position: 97,
              tilt: 50,
            },
          ],
          target_position: 97,
        }),
        makeGroupEntry({
          entry_id: 'family_room',
          title: 'Family Room',
          group: {
            member_positions: {
              'cover.backyard_shade': 100,
              'cover.side_yard_shade': 97,
              'cover.hall_generic': 40,
            },
            member_winners: {
              'cover.backyard_shade': 'solar',
              'cover.side_yard_shade': 'manual',
            },
            aggregate_position: 79,
            state: 'mixed',
            active_scene: 'none',
            scene_option: 'auto',
            locked: false,
            automation: true,
            climate_mode: 'summer_mode',
          },
        }),
      ];
      // Side Yard is held manually: its own tile shows the orange Manual pill,
      // and the GROUP tile rolls that up as a Manual badge (see description).
      c.entries[1].flags.manual_override = true;
      c.entries[1].flags.manual_override_minutes_from_now = 45;
      c.root.enabled = false;
      c.compass.enabled = false;
      c.decision.enabled = false;
      c.solarChart.enabled = false;
      c.tile.layout = 'detailed';
      return c;
    },
  },
  {
    id: 'group-automation-all',
    label: 'Cover Group — Automation green (all members on)',
    description:
      "The Automation button's first color. Both ACP members have Automatic Control on, so the button is green with the solid mdi:robot glyph and reads “Automation — 2 of 2 members automating”. Green is the same signal the Auto and Group badges use — the pipeline owns every cover here, hands off. The denominator is 2, not 3: the generic member has no pipeline to report on, which is why the label always names it rather than claiming “all members”. (The who-won badge reads 0/3 here for a different reason — solar wins on both ACP members, so the group is driving none of them.) Untick Automatic control for either member in the entry panel to walk the button through amber and grey; the group's own automation switch stays ON the whole time, which is exactly why the button can no longer be driven from it.",
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'group-automation-all';
      c.entries = automationGroupEntries([true, true]);
      c.root.enabled = false;
      c.compass.enabled = false;
      c.decision.enabled = false;
      c.solarChart.enabled = false;
      c.tile.layout = 'detailed';
      return c;
    },
  },
  {
    id: 'group-automation-mixed',
    label: 'Cover Group — Automation amber (members disagree)',
    description:
      'The case the old two-color button lied about. Side Yard Shade has Automatic Control OFF while Backyard Shade has it on, so the button is amber with the outlined mdi:robot-outline glyph and reads “Automation — 1 of 2 members automating” — amber being the same color the Manual badge uses, because a human has partly taken over. aria-pressed is "mixed", ARIA\'s real tri-state value, and the accessible name leads with the purpose before the state so a screen reader still says what the button does. The group automation switch still says ON: before this, that latch painted the button fully automated and a press sent turn_OFF, moving the group further from what the icon claimed. Now a press sends turn_ON and brings the stragglers up.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'group-automation-mixed';
      c.entries = automationGroupEntries([true, false]);
      c.root.enabled = false;
      c.compass.enabled = false;
      c.decision.enabled = false;
      c.solarChart.enabled = false;
      c.tile.layout = 'detailed';
      return c;
    },
  },
  {
    id: 'group-automation-none',
    label: 'Cover Group — Automation grey (no member on)',
    description:
      'Both ACP members have Automatic Control off, so the button is grey and untinted with the mdi:robot-off glyph, reading “Automation — 0 of 2 members automating”. Grey rather than red on purpose: automation off is a state the user chose, not a fault, and red already means force / weather / glare everywhere else in this card. The group automation switch is STILL on — this scenario is the pure form of the bug, since the pre-rollup button showed indigo “automated” with every member idle.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'group-automation-none';
      c.entries = automationGroupEntries([false, false]);
      c.root.enabled = false;
      c.compass.enabled = false;
      c.decision.enabled = false;
      c.solarChart.enabled = false;
      c.tile.layout = 'detailed';
      return c;
    },
  },
  {
    id: 'group-tilt',
    label: 'Cover Group — aggregate cover + tilt axis',
    description:
      "The all-tilt branch. This group has the integration's OPT-IN aggregate cover entity (`cover.…group_cover`) and every member carries a slat axis, so the aggregate cover advertises SET_TILT_POSITION and a Tilt track appears on the tile, in the dialog, and on each member row. Group tilt is deliberately the ONLY path that needs the aggregate cover: there is no `group_set_tilt` service, and `group_set_position` requires a position that would stomp members' own overrides — so drop `aggregate_cover` from this scenario and every Tilt track disappears while position control keeps working. Group tilt writes cover.set_cover_tilt_position on the aggregate; a member's tilt writes set_axes (ACP) or cover.set_cover_tilt_position (generic).",
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'group-tilt';
      c.entries = [
        makeGroupEntry({
          entry_id: 'venetian_group',
          title: 'Venetian Group',
          group: {
            member_positions: {
              'cover.study_left': 60,
              'cover.study_right': 60,
              'cover.study_generic': 40,
            },
            member_tilts: {
              'cover.study_left': 35,
              'cover.study_right': 35,
              'cover.study_generic': 70,
            },
            member_winners: {
              'cover.study_left': 'solar',
              'cover.study_right': 'solar',
            },
            aggregate_position: 53,
            state: 'mixed',
            active_scene: 'none',
            scene_option: 'auto',
            locked: false,
            automation: true,
            climate_mode: 'summer_mode',
            aggregate_cover: true,
            tilt: 45,
          },
        }),
      ];
      c.root.enabled = true;
      c.compass.enabled = false;
      c.decision.enabled = false;
      c.solarChart.enabled = false;
      c.tile.layout = 'detailed';
      return c;
    },
  },
  {
    id: 'cover-group-full',
    label: 'Cover Group — full main-card view (issue #185)',
    description:
      'A Cover Group entry rendered through the ROOT main card, which routes it to the group view (no sun/window geometry). The view now carries the same control surface as the tile dialog: an aggregate position track, the ↑■↓ row, the scene select, lock / automation toggles, a clear-overrides button, and a member roster of 4 covers where every row is independently controllable. Winners are mixed — solar, group_scene, and group_lock drive three ACP members, while a generic cover shows its position with no who-won badge and takes native cover.* services. The group is locked.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'cover-group-full';
      c.entries = [
        makeGroupEntry({
          entry_id: 'whole_house_group',
          title: 'Whole House Group',
          group: {
            member_positions: {
              'cover.living_left': 30,
              'cover.living_right': 45,
              'cover.bedroom': 0,
              'cover.hall_generic': 80,
            },
            member_winners: {
              'cover.living_left': 'solar',
              'cover.living_right': 'group_scene',
              'cover.bedroom': 'group_lock',
            },
            aggregate_position: 39,
            state: 'mixed',
            active_scene: 'all_closed',
            scene_option: 'all_closed',
            locked: true,
            automation: true,
            climate_mode: 'summer_mode',
          },
        }),
      ];
      // The main-card group view is the focus; the tile/decision/compass/solar
      // cards are cover-oriented and hidden here. The root card routes to the
      // group view automatically via `is_group`.
      c.root.enabled = true;
      c.tile.enabled = false;
      c.compass.enabled = false;
      c.decision.enabled = false;
      c.solarChart.enabled = false;
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
      'Three entries with overlapping in-FOV times so the per-window FOV ribbon below the elevation strip shows color-keyed bars; mixed elevation limits. Also exercises the "Sun acceptance angle" / SAA rename (#206): the multi-entry legend rows show the "in SAA" / "✓ in SAA" status badges, and hovering a window wedge shows the "SAA {left} left / {right} right" arc tooltip.',
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
    id: 'climate-not-winner',
    label: 'Climate computed but not in control (#168)',
    description:
      'Climate computes "intermediate" but its thresholds aren\'t met (inactive_reason: thresholds_not_met), so the pipeline winner is Default, not climate. The climate panel must NOT paint climate as in-control: the strategy icon/label gray out and a "Temperatures within the comfort band — no action needed" reason line appears, matching the standby treatment rather than the full active view (#168). The indoor/outdoor temperature tiles still render in this grayed standby state — they are sensor readings independent of pipeline control and must persist through standby rather than disappearing alongside the suppressed active label (#198).',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'climate-not-winner';
      c.decisionMode = 'scripted';
      c.scriptedWinner = 'default';
      const f = c.entries[0].flags;
      f.climate_strategy = 'intermediate';
      f.climate_inactive_reason = 'thresholds_not_met';
      f.indoor_temp = 22;
      f.outdoor_temp = 27;
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
  {
    id: 'solar-calculation',
    label: 'Solar calculation (issue #169)',
    description:
      'Exercises the new Solar Calculation diagnostic section across all four cover types. Four south-facing entries (blind, awning, tilt, venetian) at solar noon render their input → intermediate → output breakdown; the venetian shows both position and tilt axes. A fifth north-facing entry has the sun outside its FOV, so its panel shows the "No solar target" fallback with the Default status. The Solar section is enabled in root; toggle "Show all" on each panel to reveal every raw value.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'solar-calculation';
      c.root.show_sections.solar = true;
      c.entries = [
        makeEntry({
          entry_id: 'blind_window',
          title: 'Blind (S)',
          cover_type: 'cover_blind',
          window_azimuth: 180,
          color: '#ff7043',
        }),
        makeEntry({
          entry_id: 'awning_window',
          title: 'Awning (S)',
          cover_type: 'cover_awning',
          window_azimuth: 180,
          color: '#42a5f5',
        }),
        makeEntry({
          entry_id: 'tilt_window',
          title: 'Tilt (S)',
          cover_type: 'cover_tilt',
          window_azimuth: 180,
          color: '#66bb6a',
        }),
        makeEntry({
          entry_id: 'venetian_window',
          title: 'Venetian (S)',
          cover_type: 'cover_venetian',
          window_azimuth: 180,
          color: '#ab47bc',
        }),
        makeEntry({
          entry_id: 'north_window',
          title: 'No target (N)',
          cover_type: 'cover_blind',
          window_azimuth: 0,
          color: '#bdbdbd',
        }),
      ];
      return c;
    },
  },
  {
    id: 'transit-opening-closing',
    label: 'No-feedback cover — Opening / Closing text',
    description:
      'Two open/close-only (Somfy-RTS-style) covers mid-move. The integration publishes a transit_states map, so the tile shows the localized "Opening"/"Closing" state text in the readout — the same way a real position cover does — instead of a static Open/Closed. Toggle direction live via the "Transit (no-feedback)" control.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'transit-opening-closing';
      c.entries = [
        makeEntry({
          entry_id: 'south_window',
          title: 'Opening now',
          window_azimuth: 180,
          color: '#66bb6a',
        }),
        makeEntry({
          entry_id: 'west_window',
          title: 'Closing now',
          window_azimuth: 270,
          color: '#ef5350',
        }),
      ];
      c.entries[0].flags.transit_direction = 'opening';
      c.entries[1].flags.transit_direction = 'closing';
      return c;
    },
  },
  {
    id: 'extreme-badges-crowded',
    label: 'Extreme badges — bar shrinks before wrap (#208)',
    added: '2026-07-13',
    issue: 208,
    description:
      'Stress test for the chrome-row crowding fix (#208): the tile carries the widest badge set the pipeline produces — a resumable Manual badge WITH a live countdown next to the ↥ floor chip — plus the position bar, all pinned to a deliberately narrow 320px column. Because an enabled floor slot makes custom_position win before any later auto handler, Manual + floor is the realistic maximum (two chrome badges). The row is set to nowrap: the badges hold their width and the POSITION BAR shrinks to keep everything on one line — it must NOT push the badges onto a second row. Drag the tile-width control DOWN toward ~240px to watch the bar shrink to a sliver (its floor), and only below that do the badges finally clip — the extreme fallback. Drag UP to ~420px and the bar recovers its full width. A long cover name also pressures the name row so both rows are squeezed together.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'extreme-badges-crowded';
      c.tile.layout = 'detailed';
      c.tile.tileWidth = 320;
      c.entries = [
        makeEntry({
          entry_id: 'living_room',
          title: 'Living Room Bay Window',
          window_azimuth: 180,
          color: '#7e57c2',
          target_position: 60,
          covers: [
            {
              entity_id: 'cover.living_room_main',
              friendly_name: 'Living Room shade',
              position: 60,
              device_class: 'shade',
            },
          ],
          // Enable the priority-90 min-mode floor slot (slot 4) so its sensor
          // arms and the ↥ floor chip renders; manual override (below) wins ahead
          // of custom_position so the floor stays a constraint beside the Manual
          // badge rather than becoming the winner.
          slots: [
            {
              slot: 1,
              enabled: false,
              position: 75,
              name: 'Movie time',
              min_mode: false,
              priority: 60,
            },
            {
              slot: 2,
              enabled: false,
              position: 20,
              name: 'Privacy',
              min_mode: false,
              priority: 70,
            },
            {
              slot: 3,
              enabled: false,
              position: 100,
              name: 'Welcome home',
              min_mode: false,
              priority: 50,
            },
            {
              slot: 4,
              enabled: true,
              position: 40,
              name: 'Aeration floor',
              min_mode: true,
              priority: 90,
            },
            {
              slot: 5,
              enabled: true,
              position: 0,
              name: 'Safety',
              min_mode: false,
              priority: 100,
              sensors: ['binary_sensor.living_room_wind', 'binary_sensor.living_room_frost'],
              template: true,
              template_mode: 'or',
            },
          ],
        }),
      ];
      // Arm a manual override with a countdown so the Manual badge renders at its
      // widest (resumable pill + live timer), maximizing the crowding pressure.
      c.entries[0].flags.manual_override = true;
      c.entries[0].flags.manual_override_minutes_from_now = 45;
      return c;
    },
  },
  {
    id: 'cover-battery',
    label: 'Cover battery — low overlay, dialog readout, unknown level (#260)',
    added: '2026-07-31',
    issue: 260,
    description:
      "Battery reporting across all three states the card distinguishes. A cover's battery is NOT an ACP entity — it is a separate `device_class: battery` sensor on the cover's OWN device — so the card resolves it by walking `hass.entities` for the cover's device_id and finding the battery sensor beside it. That is why this scenario gives each cover its own mock device. Three entries: 'Healthy' at 82% (no overlay — the tile icon must stay clean, and the dialog's battery button shows a full-ish glyph reading '82% battery'); 'Low' at 8% (the tile icon gains a RED battery overlay at its BOTTOM-LEFT, diagonally opposite the occupancy symbol's top-right so the two never collide, tooltip 'Low battery — 8%'); and 'Unknown' whose sensor reads `unknown` (treated as LOW deliberately — a battery that has stopped reporting is exactly what a warning is for — so it also overlays, with mdi:battery-alert-variant-outline). The threshold is LOW_BATTERY_PCT = 20 in src/lib/battery.ts, shared by the tile overlay and the dialog readout so they cannot drift. Check the multi-cover path too: 'Low' has two covers at 8% and 64%, so the icon must follow the WORST cell while the dialog tooltip names both ('Left: 8% · Right: 64%'). Set any of it live from Managed covers → the batt: select (none/level/unknown) in the control panel. A mains-powered cover (batt: none) emits no sensor at all and must render nothing anywhere. The dialog battery is a BUTTON, not a readout: clicking it leaves for HA's own History panel at `/history?entity_id=…` with every battery source in the set comma-joined, and closes the dialog on the way out (in the harness there is no HA router, so the URL changes and nothing navigates — check the address bar). The fourth entry, 'Battery Group', is a Cover Group over all four battery covers from the three entries above, and its dialog header carries the SAME indicator — worst-cell glyph (here the unknown one), tooltip naming every member, and the same history link listing all four sensors.",
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'cover-battery';
      c.tile.layout = 'detailed';
      c.entries = [
        makeEntry({
          entry_id: 'healthy',
          title: 'Healthy',
          window_azimuth: 180,
          color: '#43a047',
          target_position: 70,
          covers: [
            {
              entity_id: 'cover.healthy_shade',
              friendly_name: 'Healthy shade',
              position: 70,
              device_class: 'shade',
              battery: 82,
            },
          ],
        }),
        makeEntry({
          entry_id: 'low',
          title: 'Low',
          window_azimuth: 180,
          color: '#e53935',
          target_position: 40,
          covers: [
            {
              entity_id: 'cover.low_left',
              friendly_name: 'Left',
              position: 40,
              device_class: 'shade',
              battery: 8,
            },
            {
              entity_id: 'cover.low_right',
              friendly_name: 'Right',
              position: 40,
              device_class: 'shade',
              battery: 64,
            },
          ],
        }),
        makeEntry({
          entry_id: 'unknown_batt',
          title: 'Unknown',
          window_azimuth: 180,
          color: '#8e24aa',
          target_position: 55,
          covers: [
            {
              entity_id: 'cover.unknown_shade',
              friendly_name: 'Unknown shade',
              position: 55,
              device_class: 'shade',
              battery: null,
            },
          ],
        }),
        // A group over the three battery entries above, so the group dialog's
        // battery indicator has a mixed roster to summarize: healthy, low and
        // unknown together must resolve to the unknown cell.
        makeGroupEntry({
          entry_id: 'battery_group',
          title: 'Battery Group',
          group: {
            member_positions: {
              'cover.healthy_shade': 70,
              'cover.low_left': 40,
              'cover.low_right': 40,
              'cover.unknown_shade': 55,
            },
            member_winners: {
              'cover.healthy_shade': 'solar',
              'cover.low_left': 'solar',
            },
            aggregate_position: 51,
            state: 'open',
            active_scene: 'none',
            scene_option: 'auto',
            locked: false,
            automation: true,
            climate_mode: 'summer_mode',
          },
        }),
      ];
      return c;
    },
  },
  {
    id: 'moving-to-indicator',
    label: 'Moving to — destination shown while a cover travels',
    added: '2026-08-12',
    description:
      "Setting a position returns immediately, but the cover takes seconds to get there — and every rail draws the LIVE value, so the instant a drag preview is released the rail snapped back to where the cover still was and the number just chosen vanished. The command was in flight with nothing on screen to say so. Now the destination stays: a STRIPED travel band spans the gap between where the cover is and where it is heading, capped by a diamond pip. Tap, drag, arrow-key or press the ↑/↓ buttons on any rail here and watch it — the harness has no real covers, so nothing travels and the band simply persists until it times out, which is exactly what a no-feedback cover looks like in the wild. STOP clears the indicator instead of setting one: wherever a cover halts IS its position, so a pip still pointing elsewhere would promise a move that was just abandoned. Four rails carry it and must look identical: the tile rail here, the tile's tilt track, the more-info dialog's Position bars, and the group tile's rail (open the group entry). The band is striped, never a flat tint, so it can never be mistaken for a second fill — the solid fill beside it is the only thing claiming the cover's real position. The pip is a different SHAPE from the orange solar-target marker, not merely a different colour, because the two share one track and colour alone would not separate them for a colour-blind user. Two rules worth checking: commanding a value the cover is ALREADY at draws NOTHING (a zero-width band and a stray pip would otherwise sit there for the full 60s, since a cover that does not move never reports arrival), and a value within 2% counts as arrived for the same reason — covers routinely stop a percent short. An AUTOMATIC move shows it too, without any command: set a cover's state to `opening` or `closing` in the control panel and its rail draws the band toward the target tick, because a pipeline move has no command echo to latch onto and the entity being in motion is the only evidence there is.",
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'moving-to-indicator';
      c.tile.layout = 'detailed';
      c.entries = [
        makeEntry({
          entry_id: 'travelling',
          title: 'Travelling Shade',
          window_azimuth: 180,
          target_position: 40,
          covers: [
            {
              entity_id: 'cover.travelling_shade',
              friendly_name: 'Travelling Shade',
              position: 100,
              device_class: 'shade',
            },
          ],
        }),
        // Two rails, so the per-rail keying is visible: command one and the
        // OTHER must stay untouched.
        makeEntry({
          entry_id: 'two_rail',
          title: 'Two Rail Shade',
          window_azimuth: 200,
          target_position: 60,
          covers: [
            { entity_id: 'cover.two_rail_left', friendly_name: 'Left', position: 100 },
            { entity_id: 'cover.two_rail_right', friendly_name: 'Right', position: 0 },
          ],
        }),
      ];
      return c;
    },
  },
  {
    id: 'blind-spot-slots',
    label: 'Blind spot slots — slot 2/3 wedges the card used to drop (#269)',
    added: '2026-08-08',
    issue: 269,
    description:
      "The integration has carried THREE blind-spot slots since its #701 and publishes them all on the sun_position sensor's `blind_spot_ranges`. `blind_spot_range` (singular) is slot 1 alone, kept only for cards written before the list existed — and reading it as the whole truth is #269: a blind spot configured in slot 2 or 3 never appears, and editing one changes nothing the card looks at. Three entries. 'Slot 2 only' has a DEGENERATE slot 1 ([0, 0] — an enabled-but-unconfigured slot) and the real wedge in slot 2, which is the exact reported shape: the legacy attribute is present but spans zero degrees, so the old card drew an invisible path and the user saw no blind spot at all. It must now draw ONE wedge, from slot 2. 'Three slots' carries all three, and all three must draw, each its own grey wedge, with the tooltip listing one 'Blind spot A°–B°' line per slot under a single entry label. 'Legacy only' publishes `blind_spot_range` with NO list — an older integration — and must still draw its single wedge, proving the fallback. Ranges are SIGNED GAMMA pairs [lower, upper] measured from the window normal, positive toward the left acceptance edge, so a wedge maps to bearings [windowAzi − upper, windowAzi − lower] and lower must be < upper. Add, remove and drag slots live from Entries → Blind spot in the control panel; a slot dragged to lower == upper vanishes rather than drawing a zero-width sliver.",
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'blind-spot-slots';
      c.entries = [
        makeEntry({
          entry_id: 'slot_two_only',
          title: 'Slot 2 only',
          window_azimuth: 180,
          fov_left: 90,
          fov_right: 90,
          color: '#e53935',
          // Slot 1 enabled but never configured → zero span. Slot 2 holds the
          // wedge the user actually drew.
          blind_spot_ranges: [
            [0, 0],
            [20, 45],
          ],
        }),
        makeEntry({
          entry_id: 'three_slots',
          title: 'Three slots',
          window_azimuth: 180,
          fov_left: 90,
          fov_right: 90,
          color: '#1e88e5',
          blind_spot_ranges: [
            [-45, -30],
            [-10, 15],
            [25, 40],
          ],
        }),
        makeEntry({
          entry_id: 'legacy_only',
          title: 'Legacy only',
          window_azimuth: 180,
          fov_left: 90,
          fov_right: 90,
          color: '#43a047',
          blind_spot_range: [10, 30],
        }),
      ];
      return c;
    },
  },
  {
    id: 'blind-spot-active-no-geometry',
    label: 'Blind spot active, no geometry — compass fallback (#274)',
    added: '2026-08-16',
    issue: 274,
    description:
      "Card-side follow-up to blind-spot-slots (#269): when the integration's diagnostics omit `left_gamma`/`right_gamma` for a gamma-only blind spot (upstream bug, jrhubott/adaptive-cover-pro#1291), the sun sensor publishes NEITHER `blind_spot_range` NOR `blind_spot_ranges` even though `decision_trace.in_blind_spot` still comes through true — the compass used to draw an unbroken SAA band that visually contradicted its own decision trace (@Taknok: 'computed state is 0% but compass seems to indicate the awning should be open'). Two entries, same window/SAA/blind-spot geometry so they're directly comparable: 'No Geometry' has the sun currently inside its configured blind spot but the sun sensor omits the geometry attributes entirely — the compass legend must show a red 'Blind spot active' row (single-entry) instead of drawing nothing, and the sun dot still carries its existing (subtler) in_fov_not_valid treatment. 'With Geometry' is the control — same blind spot, geometry published normally, so the red hatched wedge draws as usual and the fallback text must NOT appear (it would double up with the wedge). Toggle 'Geometry unavailable' under Entries → Blind spot to flip either entry between the two states live; toggling the 'Blind spots' display switch off in Per-card config must hide the fallback text along with the wedges.",
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'blind-spot-active-no-geometry';
      c.entries = [
        makeEntry({
          entry_id: 'no_geometry',
          title: 'No Geometry',
          window_azimuth: 180,
          fov_left: 90,
          fov_right: 90,
          color: '#e53935',
          blind_spot_range: [-25, 25],
          blind_spot_geometry_unavailable: true,
        }),
        makeEntry({
          entry_id: 'with_geometry',
          title: 'With Geometry',
          window_azimuth: 180,
          fov_left: 90,
          fov_right: 90,
          color: '#1e88e5',
          blind_spot_range: [-25, 25],
        }),
      ];
      return c;
    },
  },
  {
    id: 'bar-only-tile',
    label: 'Bar-only tile — no badges, same grid as a badged tile (#260)',
    added: '2026-07-13',
    issue: 208,
    description:
      "The bar-only detailed tile: integration enabled but AUTOMATIC control OFF, no manual override and no floor slot, so NO chrome badges render — only the position bar. Since #260 a bar-only tile has NO grid special-case at all — it uses the same two-row grid as a badged tile, so the name/state sit in row 1 and the bar spans label+controls beneath them. It must look exactly like a badged tile with the badge pills removed: same name/state position, same full-width bar, same tile height (the chrome row still reserves the 22px badge height). The old layout centered the name/state across the full tile height and confined the bar to the label column; that centering is what produced #260's overlap — a centered label spanning both rows sat on top of the bottom-aligned bar — so it is deliberately gone, and the tile must NOT look vertically centered any more. Two entries: one at ~65% open, one fully open. Note the rail draws COVERAGE, so 65% open is a 35%-filled rail and the fully-open one is empty. Verify the responsive reflow: drag the tile-width control DOWN below ~340px — the ↑■↓ controls must drop to their own full-width row, now inherited from the plain has-chrome-row reflow rather than a bar-only re-assertion. Toggle 'show_position_bar' off in Per-card config to confirm the chrome row collapses entirely (single-row tile) and that no slider remains. The bar is also the tile's position slider: press and drag it and the fill plus the tooltip readout follow live with no service call until release, then exactly one set_axes fires (watch the service log) — dragging RIGHT closes the cover, because the rail draws coverage and the write is the un-mirrored logical value. The gesture must NOT open the more-info dialog, though a tap anywhere else on the tile still must. Its grab area extends about 8px above and below the 6px rail without changing the tile's height, and Tab reaches it for arrow (±1), Page Up/Down (±10) and Home/End control.",
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'bar-only-tile';
      c.tile.layout = 'detailed';
      c.entries = [
        makeEntry({
          entry_id: 'living_room',
          title: 'Living Room',
          window_azimuth: 180,
          color: '#7e57c2',
          target_position: 65,
          covers: [
            {
              entity_id: 'cover.living_room_main',
              friendly_name: 'Living Room shade',
              position: 65,
              device_class: 'shade',
            },
          ],
        }),
        makeEntry({
          entry_id: 'kitchen',
          title: 'Kitchen Window',
          window_azimuth: 90,
          color: '#26a69a',
          target_position: 100,
          covers: [
            {
              entity_id: 'cover.kitchen_main',
              friendly_name: 'Kitchen shade',
              position: 100,
              device_class: 'shade',
            },
          ],
        }),
      ];
      // Automatic control OFF (integration still enabled) is the realistic path
      // to a no-badge tile: the winner badge is suppressed and the Auto badge is
      // inactive, leaving only the position bar → bar-only.
      for (const e of c.entries) e.flags.automatic_control = false;
      return c;
    },
  },
  {
    id: 'climate-active-not-winner',
    label: 'Climate matched but not the literal winner (#223)',
    added: '2026-07-13',
    issue: 223,
    description:
      'Distinct from "climate-not-winner" (#168, where climate computed but its thresholds weren\'t met — genuinely NOT in control): here climate IS genuinely active this cycle (winter mode, heat protection — the climate panel shows the full in-control view) and its decision-trace row is matched: true, but the trace\'s literal `winner` is scripted to "Default" (a shape the mock derived pipeline can\'t itself produce, since climate outranks default — a scripted trace models it directly, mirroring the multi-matched-row traces the real integration can emit). Before the #223 fix, the compact tile badge only ever looked at the literal winner and showed the generic "Auto" badge here; the more-info dialog (which walks every matched row) already showed "Climate" correctly. Open the tile in BOTH layouts to confirm the single winner badge now reads "Climate" in each — tap the tile to open the dialog and confirm it still agrees.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'climate-active-not-winner';
      c.decisionMode = 'scripted';
      c.scriptedWinner = 'default';
      c.scriptedAlsoMatched = ['climate'];
      const f = c.entries[0].flags;
      f.climate_strategy = 'winter_mode';
      f.indoor_temp = 17;
      f.outdoor_temp = 4;
      return c;
    },
  },
  {
    id: 'manual-override-extend',
    label: 'Manual override — extendable from the badge (#229)',
    added: '2026-07-16',
    issue: 229,
    description:
      'A manual override active with 45 minutes left, on a current integration that exposes engage_manual_override. The badge is no longer a single Resume button: it is a container with two sibling buttons — Extend (clock-plus) and Resume (↺). Tap Extend to open the dialog: preset chips come from the position_forecast sensor (fov_exit / sunset), the relative chips add to the CURRENT end (not to now), and the time input rolls to tomorrow for a clock time already past. Confirm and watch the badge countdown jump — the mock applies end_time against the harness fake clock. Check the service log: the end_time is Z-suffixed (the integration silently treats a naive string as UTC) and targets every managed cover, not just the first.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'manual-override-extend';
      const f = c.entries[0].flags;
      f.manual_override = true;
      f.manual_override_minutes_from_now = 45;
      f.held_position = 30;
      return c;
    },
  },
  {
    id: 'legacy-integration-no-extend',
    label: 'Legacy integration — no Extend affordance (#229)',
    added: '2026-07-16',
    issue: 229,
    description:
      'The same active override as "manual-override-extend", but simulating an integration older than v2026.7.0: the mock hass omits engage_manual_override from the service registry. The card must feature-detect and degrade — the badge shows ONLY the Resume button (today\'s single-button form, byte-identical), with no Extend icon and no way to open the dialog. Pairs with legacy-integration-venetian (#180): same graceful-degradation contract, different service.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'legacy-integration-no-extend';
      c.legacyIntegration = true;
      const f = c.entries[0].flags;
      f.manual_override = true;
      f.manual_override_minutes_from_now = 45;
      f.held_position = 30;
      return c;
    },
  },
  {
    id: 'cover-unknown-controllable',
    label: 'Cover state unknown — stays controllable (assumed-state RTS)',
    description:
      'Contrast against `cover-unavailable`: an assumed-state/one-way RTS cover (e.g. a Somfy ' +
      'awning) never reports a live position, so its entity state sits permanently at ' +
      '`unknown` — but unlike a genuinely `unavailable` entity, the integration keeps ' +
      'commanding it successfully. The tile must NOT dim, must NOT show the "Unavailable" ' +
      'label, and must keep all three ↑■▼ controls enabled and clickable (issue #232). Since ' +
      "#232's follow-up fix it also renders like any other live, no-feedback cover instead of " +
      'going blank — but the primary entry ALSO carries a stale `current_position: 100` ' +
      'attribute (left over from before the cover went unknown) that must NOT be trusted: the ' +
      'icon stays the "partial" `mdi:blinds-horizontal` glyph, never the fully-open ' +
      '`mdi:blinds-open` variant the stale attribute would otherwise paint, colored with the ' +
      'same inactive-tier state color HA paints a `closed` cover with (not the amber "active" ' +
      'tint, and not the grey "unavailable" glyph/color — matching native HA, which treats ' +
      '`unknown` as inactive, never active). The readout instead reads "Unknown · 40%" — the ' +
      'same independently-sourced calculated-sensor fallback any position-less open/closed ' +
      "cover shows, never the untrusted attribute's value. A second, dual-axis venetian entry " +
      'proves the same gate covers the tilt axis: its mini tilt bar stays enabled and ' +
      'clickable, with no live "actual" fill (the raw current_tilt_position attribute is not ' +
      'trusted for an unknown-state cover) while the solar tilt-target tick still shows.',
    added: '2026-07-24',
    issue: 232,
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'cover-unknown-controllable';
      c.entries = [
        makeEntry({
          entry_id: 'unknown_window',
          title: 'Unknown-state cover',
          window_azimuth: 180,
          covers: [
            {
              entity_id: 'cover.unknown_window_main',
              friendly_name: 'Unknown-state cover',
              position: 100,
              state: 'unknown',
              device_class: 'blind',
            },
          ],
        }),
        makeEntry({
          entry_id: 'unknown_venetian_window',
          title: 'Unknown-state venetian',
          cover_type: 'cover_venetian',
          window_azimuth: 180,
          color: '#26a69a',
          target_tilt: 70,
          covers: [
            {
              entity_id: 'cover.unknown_venetian_window_main',
              friendly_name: 'Unknown-state venetian',
              position: null,
              tilt: 35,
              state: 'unknown',
            },
          ],
        }),
      ];
      return c;
    },
  },
  {
    id: 'history-card',
    label: 'History card — all tracks + event buffer',
    description:
      'The standalone History card over a 24h window. Position (recorder-backed actual cover position), Who won (banded strip of the winning handler, last band pinned to the live winner), the three context tracks (Sun in SAA / Glare / Manual override) and the cover-actions list all render off mocked recorder history. Hover anywhere across the tracks for a shared readout of what every track said at that instant. Expand Advanced to pull the diagnostic event buffer over the mocked `adaptive_cover_pro.get_diagnostics` service call \u2014 24 synthetic events across 8 event types, filterable. Same view opens as an overlay from the tile/root more-info dialog and the decision card header.',
    added: '2026-07-26',
    build: () => {
      const c = baseConfig('2026-06-21', 15 * 60);
      c.scenario = 'history-card';
      c.history.advanced_open = true;
      // The History card is the focus; the other cards are hidden so the stage
      // is not dominated by geometry views.
      c.root.enabled = false;
      c.compass.enabled = false;
      c.solarChart.enabled = false;
      return c;
    },
  },
  {
    id: 'history-no-diagnostics',
    label: 'History card — old integration, no event buffer',
    description:
      'An integration build that predates `adaptive_cover_pro.get_diagnostics`. The History card feature-detects the missing service and omits the Advanced section entirely rather than rendering a disclosure that would always fail \u2014 every recorder-backed track still works. Compare against "History card \u2014 all tracks + event buffer".',
    added: '2026-07-26',
    build: () => {
      const c = baseConfig('2026-06-21', 15 * 60);
      c.scenario = 'history-no-diagnostics';
      c.history.noDiagnosticsService = true;
      c.root.enabled = false;
      c.compass.enabled = false;
      c.solarChart.enabled = false;
      return c;
    },
  },
  {
    id: 'history-empty-buffer',
    label: 'History card — empty event buffer',
    description:
      'The `get_diagnostics` service responds, but the ring buffer holds nothing yet (fresh reload). The integration omits `event_timeline` entirely in that case while still sending `data_window`, so the card must distinguish "no events" from "could not read" \u2014 Advanced opens and reports an empty buffer, not an error.',
    added: '2026-07-26',
    build: () => {
      const c = baseConfig('2026-06-21', 15 * 60);
      c.scenario = 'history-empty-buffer';
      c.history.advanced_open = true;
      c.history.eventCount = 0;
      c.root.enabled = false;
      c.compass.enabled = false;
      c.solarChart.enabled = false;
      return c;
    },
  },
  {
    id: 'history-multi-cover',
    label: 'History card — per-cover divergence + sun context',
    description:
      'A three-cover entry where the covers do NOT agree. The aggregate Actual line only sags a little, while the thin dashed per-cover lines show one cover trailing and one that STALLS at the midpoint and never moves again — the failure the aggregate mean hides. Behind the curves, night is dimmed and the sun-in-SAA spans are highlighted (the latter from the recorded sun_infront_binary, so the shading always agrees with the handler that acted on it). The stats line summarizes moves, travel and time-per-handler for the window.',
    added: '2026-07-26',
    build: () => {
      const c = baseConfig('2026-06-21', 15 * 60);
      c.scenario = 'history-multi-cover';
      c.entries = [
        makeEntry({
          entry_id: 'south_bank',
          title: 'South Bank',
          window_azimuth: 180,
          covers: [
            { entity_id: 'cover.south_left', friendly_name: 'South Left', position: 60 },
            { entity_id: 'cover.south_mid', friendly_name: 'South Mid', position: 52 },
            { entity_id: 'cover.south_right', friendly_name: 'South Right', position: 95 },
          ],
        }),
      ];
      c.history.advanced_open = false;
      c.root.enabled = false;
      c.compass.enabled = false;
      c.solarChart.enabled = false;
      return c;
    },
  },
  {
    id: 'history-venetian-tilt',
    label: 'History card — venetian tilt track',
    description:
      'A venetian entry, so the History card renders its SECOND axis: a tilt track under the position track, plotting the ACP tilt target against the covers\u2019 recorded current_tilt_position. The tilt axis carries its own inversion option in the integration (inverse_tilt, #236) independent of inverse_state, so the card reads the flag from the tilt axis rather than reusing the position one. A position-only cover shows no tilt track at all rather than an empty one.',
    added: '2026-07-26',
    build: () => {
      const c = baseConfig('2026-06-21', 14 * 60);
      c.scenario = 'history-venetian-tilt';
      c.entries = [
        makeEntry({
          entry_id: 'venetian_window',
          title: 'Study Venetian',
          window_azimuth: 200,
          cover_type: 'cover_venetian',
          target_tilt: 45,
          covers: [
            {
              entity_id: 'cover.study_venetian',
              friendly_name: 'Study Venetian',
              position: 70,
              tilt: 40,
            },
          ],
        }),
      ];
      c.root.enabled = false;
      c.compass.enabled = false;
      c.solarChart.enabled = false;
      return c;
    },
  },
  {
    id: 'history-overnight-hold',
    label: 'History card — overnight hold then drop (issue #253)',
    description:
      'The Position track holds perfectly FLAT overnight (21:00 → 11:00, 14 hours), then steps to a new value once the day starts — the recorder stores transitions only, so a real install’s target/actual lines have exactly this shape. The hold runs wider than `isOvernightHour`’s raw 22:00–09:59 band because `buildTargetHistory` only evaluates it at 2-hour candidate points phased off this scenario’s 15:00 anchor, so the last pre-band candidate falls at 21:00 and the first post-band one at 11:00. Confirms the curve draws a held line that STEPS at the transition instant, not a diagonal ramp interpolated straight across the whole night (the bug issue #253 reported: hovering mid-gap read the correctly-held value while the line under the cursor showed a straight ramp to the drop).',
    added: '2026-07-28',
    build: () => {
      const c = baseConfig('2026-06-21', 15 * 60);
      c.scenario = 'history-overnight-hold';
      c.history.advanced_open = false;
      c.history.track_who_won = false;
      c.history.track_context = false;
      c.history.track_actions = false;
      c.root.enabled = false;
      c.compass.enabled = false;
      c.solarChart.enabled = false;
      return c;
    },
  },
  {
    id: 'composite-tile-name',
    label: 'Composite tile name (#247)',
    description:
      'Both entries have an area assigned, and the tile card’s `name` is a composed part list (`[{type: "area"}, {type: "entry"}]`) instead of a plain string, so the titles read "Living Room Blind" and "Playroom Group" — the same generator-friendly composition the native HA tile card and Mushroom support, letting one dashboard-YAML template emit "Living Room Blind" on an all-covers view and just "Blind" on an area view. The second entry is a Cover Group, which resolves the same composed name through a separate pair of components (acp-group-tile / acp-group-dialog) rather than the cover tile\'s own title element (audit finding #1, issue #247 fix pass) - both must read "Playroom Group", never "[object Object]".',
    added: '2026-07-27',
    build: () => {
      const c = baseConfig('2026-06-21', 14 * 60);
      c.scenario = 'composite-tile-name';
      c.entries = [
        makeEntry({
          entry_id: 'living_room_blind',
          title: 'Blind',
          area: 'Living Room',
          window_azimuth: 180,
        }),
        // Audit finding #1 (issue #247 fix pass): a Cover Group entry routes
        // through the separate acp-group-tile/acp-group-dialog components
        // instead of the cover tile's own title element — both must resolve
        // the same composed name, never "[object Object]".
        makeGroupEntry({
          entry_id: 'playroom_group',
          title: 'Group',
          area: 'Playroom',
        }),
      ];
      c.tile.name = [{ type: 'area' }, { type: 'entry' }];
      c.root.enabled = false;
      c.compass.enabled = false;
      c.solarChart.enabled = false;
      return c;
    },
  },
  {
    id: 'group-spread-bar',
    label: 'Group tile — spread bar, driven count, drag-only rail',
    description:
      'The Living Room group, rebuilt from the real install: five covers, three at 40% and two at 0%, so the aggregate sensor publishes 24% — the mean of two clusters, a number NO cover has ever been at. Three things change on the tile. (1) THE RAIL SHOWS THE SPREAD, not the mean: a solid fill to the least-covered member, a translucent band from there to the most-covered one, and a tick per DISTINCT member value. Two clusters draw two ticks, so "Mixed" stops being a word and becomes a picture. Set every member to the same position in the control panel and the band disappears and the ticks stack into one — that is the case where a plain fill was always honest, and it still looks like one. (2) THE STATE LINE SHOWS THE RANGE: "Mixed · 0–40%" instead of "Mixed · 24%". The aggregate 24% is the mean of two clusters and describes no cover at all; the range says what they are actually at, in the LOGICAL frame the covers report rather than the coverage frame the bar draws, which is mirrored on a blind. It collapses to a single number when they agree. An EXCEPTION takes the slot whenever there is one: park a member on a manual override and the line reads "1 held", make one unavailable and it reads "1 unavailable" — unavailable wins, being the harder failure. An earlier draft put the group-driven count here and it was useless: a group drives members only while a scene or the lock is active, so it read "0 of 5" permanently, and the N/M badge beside it already said so. (3) THE RAIL IS DRAG-ONLY. group_set_position flattens EVERY member onto one value and takes them all off solar, so a tap must not commit it. Tap the rail — nothing happens, no service call in the log. Now DRAG it: the spread visibly collapses into a single fill under your finger (deliberate — that collapse IS the preview of what the write does), and exactly one group_set_position fires on release. Drag less than 4px and it is still treated as a tap and does nothing. Keyboard is unchanged: the arrows were always deliberate, and they still commit. Check the accessible name too — with the members disagreeing the slider reads "0% to 40% across 5 covers" rather than a single fake number.',
    added: '2026-08-03',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'group-spread-bar';
      c.entries = [
        makeGroupEntry({
          entry_id: 'living_room',
          title: 'Living Room',
          group: {
            member_positions: {
              'cover.front_left': 40,
              'cover.front_center': 40,
              'cover.front_right': 40,
              'cover.side_left': 0,
              'cover.side_right': 0,
            },
            member_winners: {
              'cover.front_left': 'solar',
              'cover.front_center': 'solar',
              'cover.front_right': 'solar',
              'cover.side_left': 'solar',
              'cover.side_right': 'solar',
            },
            // The mean the integration publishes, and the reason the old rail
            // was wrong: no member is at 24.
            aggregate_position: 24,
            state: 'mixed',
            active_scene: 'none',
            scene_option: 'auto',
            locked: false,
            automation: true,
            climate_mode: 'summer_mode',
          },
        }),
      ];
      c.root.enabled = false;
      c.compass.enabled = false;
      c.solarChart.enabled = false;
      return c;
    },
  },
  {
    id: 'group-multi-cover-member-names',
    label: 'Group roster — one row per ENTRY, not per cover',
    description:
      'OPEN THE GROUP TILE and count the roster rows: TWO, not five. The group adopts five covers, but they belong to only two ACP entries — "Front Left Shade" driving front-left/center/right and "Side Left Shade" driving side-left/right — so the roster folds by owning entry and each row carries that entry\'s covers as its RAILS. It is the same thing the cover tile already renders for a multi-cover entry on a dashboard: three rails on the first row, two on the second. Before this, member_positions was mapped straight to rows, so an entry driving three covers contributed three rows that were by construction three views of the SAME entry — same title, same badges, same decision, same up/stop/down target, differing only in which rail moved. The visible symptom was the entry title repeated down the list (Front Left, Front Left, Front Left, Side Left, Side Left), because the title comes from the entry and every one of those rows WAS that entry. Check three things. (1) The rails are the GROUP\'s member covers, never the entry\'s full managed list — drop a cover from member_positions and its rail disappears from the row while the others stay, because a roster must not offer a rail the group cannot drive. (2) A generic (non-ACP) cover has no entry to fold into and still gets its own row, so an adopted cover is never merged with anything. (3) Row ORDER follows the roster: a row sits where the FIRST of its covers appeared, so adding a cover to an entry never reshuffles the list. The same grouping backs the dialog and the main-card group view through one shared helper, so the two rosters cannot drift.',
    added: '2026-08-03',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'group-multi-cover-member-names';
      const front = makeEntry({
        entry_id: 'front_shades',
        // Titled after its first cover, which is what makes the bug invisible
        // on row 1 and obvious on rows 2-3.
        title: 'Front Left Shade',
        window_azimuth: 180,
        target_position: 40,
        covers: [
          { entity_id: 'cover.front_left', friendly_name: 'Front Left Shade', position: 40 },
          { entity_id: 'cover.front_center', friendly_name: 'Front Center Shade', position: 40 },
          { entity_id: 'cover.front_right', friendly_name: 'Front Right Shade', position: 40 },
        ],
      });
      const side = makeEntry({
        entry_id: 'side_shades',
        title: 'Side Left Shade',
        window_azimuth: 250,
        target_position: 0,
        covers: [
          { entity_id: 'cover.side_left', friendly_name: 'Side Left Shade', position: 0 },
          { entity_id: 'cover.side_right', friendly_name: 'Side Right Shade', position: 0 },
        ],
      });
      c.entries = [
        front,
        side,
        makeGroupEntry({
          entry_id: 'living_room',
          title: 'Living Room',
          group: {
            member_positions: {
              'cover.front_left': 40,
              'cover.front_center': 40,
              'cover.front_right': 40,
              'cover.side_left': 0,
              'cover.side_right': 0,
            },
            member_winners: {
              'cover.front_left': 'solar',
              'cover.front_center': 'solar',
              'cover.front_right': 'solar',
              'cover.side_left': 'solar',
              'cover.side_right': 'solar',
            },
            aggregate_position: 24,
            state: 'mixed',
            active_scene: 'none',
            scene_option: 'auto',
            locked: false,
            automation: true,
            climate_mode: 'summer_mode',
          },
        }),
      ];
      c.root.enabled = false;
      c.compass.enabled = false;
      c.solarChart.enabled = false;
      return c;
    },
  },
  {
    id: 'group-member-order',
    label: 'Group roster — reorder, hide and rename members',
    added: '2026-08-08',
    description:
      "The roster's order and its membership are a per-CARD choice, not the integration's. `members` carries both: it lists the row keys to render, in order, so a key left out is a hidden member and there is no second 'hidden' list to keep in sync. This scenario ships all three levers at once — the group adopts two ACP entries plus one generic (non-ACP) hallway cover, and the card config reorders them, hides one, and renames another. What must render, in the group tile's dialog AND in the main-card group view (they share one helper and cannot drift): TWO rows, hallway FIRST even though the integration reports it last, labelled 'Hallway'; then the front entry labelled 'Bay Window' rather than its own 'Front Left Shade' title. The side entry is CONFIGURED OUT and must appear nowhere. Row keys are the owning ACP entry_id for an ACP member and the bare cover entity_id for a generic one — the same keys `member_names` already used, which is why one editor section now drives naming, ordering and visibility together instead of two that disagree about what a row is. Open the card's visual editor to drive it: the Members section is a sortable list — drag a row or use ↑/↓, the eye hides a member from this card without touching the group, and the name field on each row renames it (blank restores the entry's own title). Re-showing a hidden member puts it back where the INTEGRATION had it rather than on the end, so hide-then-show is a round trip and not a silent reorder. Unlike the rail list, the LAST member may be hidden — the dialog still carries the aggregate readout, the position track and the control row, so an empty roster is a usable card and the whole Members block simply disappears rather than leaving a bare heading over nothing. HIDING REACHES THE AGGREGATES, which is the point of this scenario: the side entry is UNAVAILABLE, and the tile must NOT read 'Mixed · 1 unavailable' for a cover it no longer shows. Everything derived from the roster is recomputed over the surviving members — the state line and its exception, the N/M who-won badge (denominator 2, not 3), the spread bar and its range, the aggregate percentage, the shared device_class the glyph comes from, and the battery indicator in the dialog header. Three of those arrive from the integration as finished scalars taken over the FULL roster (`group_position`, `group_state`, `group_who_won`), so they are recomputed the way the integration computes them — mean, unanimity-or-mixed, and a count of members a group handler owns. Show the side entry again and every number must return to what the integration published, exactly.",
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'group-member-order';
      const front = makeEntry({
        entry_id: 'front_shades',
        title: 'Front Left Shade',
        window_azimuth: 180,
        target_position: 40,
        covers: [
          { entity_id: 'cover.front_left', friendly_name: 'Front Left Shade', position: 40 },
          { entity_id: 'cover.front_center', friendly_name: 'Front Center Shade', position: 40 },
        ],
      });
      const side = makeEntry({
        entry_id: 'side_shades',
        title: 'Side Left Shade',
        window_azimuth: 250,
        target_position: 0,
        covers: [
          {
            entity_id: 'cover.side_left',
            friendly_name: 'Side Left Shade',
            position: 0,
            // UNAVAILABLE on purpose: this is the member the card hides, and an
            // unavailable one is the sharpest proof that hiding reaches the
            // aggregates. Before the snapshot was restricted, the tile kept
            // reading "Mixed · 1 unavailable" over a roster this cover was no
            // longer part of.
            state: 'unavailable',
          },
        ],
      });
      c.entries = [
        front,
        side,
        makeGroupEntry({
          entry_id: 'living_room',
          title: 'Living Room',
          group: {
            // Integration order: front entry, side entry, then the generic
            // cover. The card config below overrides all of it.
            member_positions: {
              'cover.front_left': 40,
              'cover.front_center': 40,
              'cover.side_left': 0,
              'cover.hall_generic': 70,
            },
            member_winners: {
              'cover.front_left': 'solar',
              'cover.front_center': 'solar',
              'cover.side_left': 'solar',
            },
            aggregate_position: 38,
            state: 'mixed',
            active_scene: 'none',
            scene_option: 'auto',
            locked: false,
            automation: true,
            climate_mode: 'summer_mode',
          },
        }),
      ];
      // Generic cover first, side entry configured out entirely. COVER ids —
      // the key is deliberately not the roster's row key, so an unavailable
      // member (like cover.side_left here) can still be matched.
      c.tile.members = ['cover.hall_generic', 'cover.front_left', 'cover.front_center'];
      c.tile.member_names = {
        front_shades: 'Bay Window',
        'cover.hall_generic': 'Hallway',
      };
      c.compass.enabled = false;
      c.solarChart.enabled = false;
      return c;
    },
  },
  {
    id: 'goto-target-button',
    label: 'Snap to target — per-cover ⊙ button',
    description:
      'OPEN THE MORE-INFO DIALOG (tap the tile) and look at the COVERS section. Every cover row now ends with an mdi:target button between the track and the warn-icon column. It drives THAT cover to the value its own orange marker sits at — the entry\'s solar target — so the row visibly closes the gap between fill and marker. This entry is deliberately parked well away from its target (covers at 100/20/65 against a target of 45) so all three rows have somewhere to travel, and the three covers give the per-cover claim something to prove: press one button and exactly ONE row moves. WATCH THE SERVICE LOG — the call is set_axes with force:true, and that flag is the whole design decision. The integration reads force:true as "skip manual-override engagement", NOT "move harder": every other write in this component (drag, click, arrow keys) omits it, because a drag means the user picked a value ACP did not, so an override has to hold it. This button drives to the value ACP picked ITSELF, and engaging an override there would freeze automation at its own answer the instant you re-synced it. So the cover moves and the pipeline keeps control. The tooltip and the accessible name both say "keeps automatic control" for that reason — if that ever reads as "pin it here", the wording is wrong, not the flag. Check the GEOMETRY too: the button column is fixed at 22px, never auto. It empties out on an entry with no target, and an auto column would hand those pixels to the track and reflow the bar graph on every target change — the same reason the warn column next to it is fixed (#158). Switch this entry to a VENETIAN in the control panel to check the other half: the tilt row underneath is a SEPARATE grid that mirrors this one column-for-column, so it grew a matching 22px spacer. The tilt track must stay perfectly aligned with the position track above it — any offset means the two grids drifted. Tilt gets no button of its own: this one drives the position axis, and a tilt target is a different value.',
    added: '2026-08-02',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'goto-target-button';
      c.entries = [
        makeEntry({
          entry_id: 'south_window',
          title: 'Dining Room Shade',
          cover_type: 'cover_blind',
          window_azimuth: 180,
          color: '#42a5f5',
          target_position: 45,
          covers: [
            { entity_id: 'cover.dining_left', friendly_name: 'Dining Left', position: 100 },
            { entity_id: 'cover.dining_mid', friendly_name: 'Dining Middle', position: 20 },
            { entity_id: 'cover.dining_right', friendly_name: 'Dining Right', position: 65 },
          ],
        }),
      ];
      c.root.enabled = false;
      c.compass.enabled = false;
      c.solarChart.enabled = false;
      return c;
    },
  },
  {
    id: 'layered-rails-vs-separate-covers',
    label: 'Rail stack — layers of one cover vs. separate covers',
    description:
      'THE side-by-side repro. Both tiles render a stack of position rails and until now looked identical — same glyph, same spacing — even though they mean completely different things. Tile 1 is a day/night shade: TWO RAILS OF ONE PHYSICAL SHADE (bottom rail carries the coverage, middle rail the sheer-vs-blackout fabric split), bound by the integration\'s dual_entity control model. Tile 2 is an ordinary blind entry someone attached THREE SEPARATE WINDOWS to. Tile 1 must now draw a BRACE — a hairline down the lane between the glyph column and the rails, spanning rail-center to rail-center — and its rows sit tighter (2px vs 5px). Tile 2 must be pixel-identical to before: no brace, 5px gaps, nothing changed on the common path. Check the geometry too: the brace is absolutely positioned so it adds no layout width, and the layered stack widens its glyph GAP (6→10px) to make room, which moves the stack\'s LEFT edge out while the rails keep their length and their right edge — the alignment invariant from issue #260. Both stacks carry a role="group" with an accessible name ("2 rails of one cover" / "3 covers"), so the distinction reaches a screen reader and not just the eye. The discriminator is the integration cover_type, NOT the rail count: cover_day_night_shade and cover_dual_panel are the two types whose managed covers are layers of one opening; every other type takes one cover per window. Switch tile 1\'s cover type to cover_blind in the control panel and the brace must vanish, because two blinds on one entry are two windows. Narrow it to a single rail ("First rail only" under covers) and the brace goes with the stack — a lone rail is one cover, and bracketing it would say something untrue. THE READOUT SPLITS TOO. A layered pair is one opening with two fabrics, and the state line used to describe only the RESOLVED cover — so a shade open at 60% with its middle rail at 25% read exactly like a plain shade at 60%, and the second fabric appeared nowhere in text. Tile 1 must now read \'Open 60% · Open 25%\', one segment per rail with its own state and position. Drag the two rails to the SAME value and the line must collapse back to the single \'Open 60%\' form: the split is a signal that the fabrics diverged, not a permanent second column. Tile 2 must NOT split no matter what its rails read — three separate windows disagree by a percent or two constantly, and a permanent multi-segment line there would be noise. Switch tile 1 to cover_blind and its split disappears with the brace, from the same cover_type discriminator. Detailed layout only: one-line has no room, and a VENETIAN is deliberately excluded because its second axis already has a bar directly under the line.',
    added: '2026-08-02',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'layered-rails-vs-separate-covers';
      c.entries = [
        // Layers of ONE cover: the brace case.
        makeEntry({
          entry_id: 'south_window',
          title: 'Side Yard Shade',
          cover_type: 'cover_day_night_shade',
          window_azimuth: 180,
          color: '#7e57c2',
          target_position: 60,
          covers: [
            {
              entity_id: 'cover.side_yard_bottom',
              friendly_name: 'Side Yard Shade bottom rail',
              position: 60,
              tilt: 0,
            },
            {
              entity_id: 'cover.side_yard_middle',
              friendly_name: 'Side Yard Shade middle rail',
              position: 25,
              tilt: 0,
              icon: 'mdi:blinds-horizontal',
              command_target: 30,
            },
          ],
        }),
        // Three SEPARATE windows on one entry: the unchanged case.
        makeEntry({
          entry_id: 'front_bank',
          title: 'Front Shades',
          cover_type: 'cover_blind',
          window_azimuth: 170,
          color: '#26a69a',
          target_position: 40,
          covers: [
            { entity_id: 'cover.front_left', friendly_name: 'Front Shades left', position: 100 },
            { entity_id: 'cover.front_mid', friendly_name: 'Front Shades middle', position: 100 },
            { entity_id: 'cover.front_right', friendly_name: 'Front Shades right', position: 100 },
          ],
        }),
      ];
      c.root.enabled = false;
      c.compass.enabled = false;
      c.solarChart.enabled = false;
      return c;
    },
  },
  {
    id: 'icon-tap-action-shape',
    label: 'Icon tap behavior — tinted shape',
    description:
      'The new Interactions > Icon tap behavior option, which mirrors HA\'s tile card. HA draws the pill-shaped tint behind a tile glyph only when the icon is interactive, and its getEntityDefaultTileIconAction returns "none" for the cover domain — which is why a native HA cover tile shows a bare glyph while a light shows a tinted circle. This scenario sets icon_tap_action to more-info, so BOTH the cover tile and the Cover Group tile draw the pill: the fill is the glyph\'s own state color at 20% opacity, rising to 35% on hover. Check three things. (1) The circle is behind the glyph, never dimming it. (2) Tapping the glyph opens more-info and does NOT also fire the tile body tap — they are independent targets, so the body must not open the ACP dialog on the same click. (3) Tab to the glyph: it takes a focus ring and Enter/Space activate it. Flip the control panel back to "none" and the shape must disappear entirely, restoring the pre-2.15 look.',
    build: () => {
      const c = baseConfig('2026-06-21', 12 * 60);
      c.scenario = 'icon-tap-action-shape';
      c.tile.icon_tap_action = 'more-info';
      c.entries = [
        makeEntry({ entry_id: 'south_window', title: 'Living Room', window_azimuth: 180 }),
        makeGroupEntry({ entry_id: 'playroom_group', title: 'Playroom Group' }),
      ];
      c.root.enabled = false;
      c.compass.enabled = false;
      c.solarChart.enabled = false;
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
    legacyIntegration: cfg.legacyIntegration ?? false,
    tile: {
      ...cfg.tile,
      badges: { ...defaultBadges(), ...(cfg.tile?.badges ?? {}) },
      tileWidth: cfg.tile?.tileWidth ?? 0,
      icon_tap_action: cfg.tile?.icon_tap_action ?? 'none',
    },
    decision: { ...defaultDecision(), ...(cfg.decision ?? {}) },
    solarChart: { ...defaultSolarChart(), ...(cfg.solarChart ?? {}) },
    history: { ...defaultHistory(), ...(cfg.history ?? {}) },
    tooltips: { ...defaultTooltips(), ...(cfg.tooltips ?? {}) },
  };
}
