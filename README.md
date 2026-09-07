![Version](https://img.shields.io/github/v/release/jrhubott/adaptive-cover-pro-card?style=for-the-badge)
![Tests](https://img.shields.io/github/actions/workflow/status/jrhubott/adaptive-cover-pro-card/tests.yml?branch=main&label=Tests&style=for-the-badge)
![HACS](https://img.shields.io/github/actions/workflow/status/jrhubott/adaptive-cover-pro-card/hacs.yaml?branch=main&label=HACS&style=for-the-badge)

# Adaptive Cover Pro Card

Lovelace cards for the [Adaptive Cover Pro](https://github.com/jrhubott/adaptive-cover-pro) Home Assistant integration. Drop a tile on your dashboard to see where every shade sits and why, and put up a compass that shows the sun crossing each window in real time.

![Sky compass tracking the sun across a full day](https://raw.githubusercontent.com/jrhubott/adaptive-cover-pro-card/main/images/sky-compass-timelapse.gif)

> **📖 Full documentation:** [Lovelace Card](https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card) · [Sky Compass Card](https://github.com/jrhubott/adaptive-cover-pro/wiki/Sky-Compass-Card) on the integration wiki.

---

## Sky compass

The compass above is the standalone card running through a simulated day. The sun rises, arcs across the window's field of view, and sets; the shaded wedge is the cover closing as the sun enters the FOV, and the dimmed disc is the sun below the horizon at night. The "Sun Today" strip underneath plots elevation against the same FOV window so you can read the whole day at a glance.

It is hand-drawn SVG (no charting library), reads sun and window geometry straight from the integration, and takes one or more `entry_id`s so several windows can share a single compass with one sun dot.

## Solar chart

The standalone Solar Chart shows the sun's elevation over the day for one or more Adaptive Cover Pro entries. It highlights each window's field of view and splits the open-status band around blind spots that the sun actually intersects, including the configured elevation limits.

The Solar Chart uses `blind_spot_mode` to choose how blind spots are rendered.

## Decision card

The Decision card focuses on the current automation pipeline for one entry. It shows the active decision, the winning handler, the target position, and the other handlers that contributed to the result. Set `compact: true` or `hide_inactive_handlers: true` when you only want the relevant handlers. The history button opens the same detailed history dialog used by the other cards.

## History card

The standalone History card displays recorder-backed cover position, winning-handler, context, and action tracks for the selected entry. It defaults to the last 24 hours and includes an optional Advanced diagnostics section.

Use `hours` to change the time window, `tracks` to hide individual tracks, `advanced_open` to expand diagnostics initially, or `hide_advanced` to remove that section.

## Tile card

One tile per shade: icon, name, live position, and `↑ ■ ▼` controls. The badge on the right tells you which automation is driving the cover right now, and tapping the tile opens a full Adaptive Cover Pro dialog (target, per-cover bars, forecast strip, and the compass + pipeline trace under an advanced section).

![Tile card across four automation states](https://raw.githubusercontent.com/jrhubott/adaptive-cover-pro-card/main/images/tile-gallery.png)

Same `custom:adaptive-cover-pro-tile-card` in four states. The badge changes with the live decision:

| Badge              | Meaning                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| **Auto**           | Automatic control is running and no specific handler has taken over.                                      |
| **Solar tracking** | The solar handler is positioning the cover against the sun, with the target shown inline.                 |
| **Manual**         | A manual override holds the cover. The badge shows the expiry time and a `↺` to resume automatic control. |
| **Occupancy**      | The occupancy handler holds the cover open while the room is occupied.                                    |

Force, weather, glare, climate, cloud, and custom-position slots get their own badges too. Every badge can be toggled off individually, and a small occupancy indicator can sit on the icon when occupancy is detected. Stack as many tiles as you have shades for a dense, glanceable dashboard.

## Full card

When you want everything in one place, the full card stacks the compass, the elevation chart, the pipeline decision strip (all handlers, with the winner and its position highlighted), per-cover position bars, the overrides panel, and the climate strip.

![Full card with every section](https://raw.githubusercontent.com/jrhubott/adaptive-cover-pro-card/main/images/card-preview.png)

## Cards in this bundle

| Card                                                                                    | Type                                         | Summary                                                                                                                           |
| --------------------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [Adaptive Cover Pro](https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card) | `custom:adaptive-cover-pro-card`             | The full card: pick one integration entry, get every section.                                                                     |
| [Tile](https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card#tile-card)     | `custom:adaptive-cover-pro-tile-card`        | Compact per-shade row: icon, name, position, `↑ ■ ▼`, and a live decision badge. Tap opens the ACP dialog.                        |
| [Sky Compass](https://github.com/jrhubott/adaptive-cover-pro/wiki/Sky-Compass-Card)     | `custom:adaptive-cover-pro-sky-compass-card` | The compass on its own. Accepts multiple entries and overlays each window's FOV, blind spot, and cover wedge on a shared sun dot. |
| Solar Chart                                                                             | `custom:adaptive-cover-pro-solar-chart-card` | The sun-elevation chart for one or more entries, with FOV and blind-spot-aware open-status bands.                                 |
| Decision                                                                                | `custom:adaptive-cover-pro-decision-card`    | The current automation pipeline and winning decision for one entry, with a shortcut to history.                                   |
| History                                                                                 | `custom:adaptive-cover-pro-history-card`     | Recorder-backed position, handler, context, and action history for one entry.                                                     |

## Install

**HACS (recommended):**

1. Add `https://github.com/jrhubott/adaptive-cover-pro-card` as a custom repository (category: **Lovelace**).
2. Install **Adaptive Cover Pro Card** and refresh.
3. The cards appear in the card picker under "Adaptive Cover Pro".

**Manual:**

1. Download `adaptive-cover-pro-card.js` from the latest [release](https://github.com/jrhubott/adaptive-cover-pro-card/releases/latest).
2. Copy it to `config/www/community/adaptive-cover-pro-card/adaptive-cover-pro-card.js`.
3. Add a dashboard resource:
   ```yaml
   url: /local/community/adaptive-cover-pro-card/adaptive-cover-pro-card.js
   type: module
   ```

## Configuration

Every option is exposed in the visual editor — except the composed `name` list below, which is YAML-only — and the rest of the YAML is the equivalent.

**Tile card** (stack one per shade):

```yaml
type: custom:adaptive-cover-pro-tile-card
entry_id: YOUR_CONFIG_ENTRY_ID
# optional:
# name: Patio Right
# name: [{type: entry}]                                           # same as omitting name
# name: [{type: area}, {type: entry}]                             # "Living Room Patio Right"
# name: [{type: area}, {type: text, text: "·"}, {type: entry}]    # "Living Room · Patio Right"
#   an `area` or `entry` part that resolves to nothing drops out of the
#   title, but a `text` part always renders — a separator will show even
#   when the part beside it is empty.
# icon: mdi:blinds-horizontal
# cover: cover.patio_right_shade
# layout: detailed          # 'detailed' | 'one-line'
# show_position: true
# show_controls: true
# show_badge: true
# show_resume: auto         # 'auto' | 'always' | 'never'
# tap_action: { action: more-info }
```

**Sky compass** (one or more entries):

```yaml
type: custom:adaptive-cover-pro-sky-compass-card
entry_ids:
  - KITCHEN_ENTRY_ID
  - LIVING_ROOM_ENTRY_ID
# optional:
# title: West-facing windows
# show_elevation_chart: true
# show_moon: false
# show_blind_spot: true
# show_raw_blind_spot: false # show configured angles for setup/debugging
# show_sun_path: true
# show_legend: true
# show_stats: true
```

**Solar chart** (one or more entries):

```yaml
type: custom:adaptive-cover-pro-solar-chart-card
entry_ids:
  - KITCHEN_ENTRY_ID
  - LIVING_ROOM_ENTRY_ID
# optional:
# title: Sun today
# compact: false
# blind_spot_mode: full # none | void | width | full
# none: FOV only; void: split FOV without overlay; width: full-height overlay;
# full: overlay height follows the blind-spot elevation setting
# cover_colors: ['#f9a825', '#42a5f5']
```

**Decision card** (one entry):

```yaml
type: custom:adaptive-cover-pro-decision-card
entry_id: YOUR_CONFIG_ENTRY_ID
# optional:
# title: Why this position?
# compact: false
# hide_inactive_handlers: false
# show_decision_summary: true
```

**History card** (one entry):

```yaml
type: custom:adaptive-cover-pro-history-card
entry_id: YOUR_CONFIG_ENTRY_ID
# optional:
# title: Cover history
# hours: 24
# tracks:
#   position: true
#   who_won: true
#   context: true
#   actions: true
# advanced_open: false
# hide_advanced: false
```

The compass and Solar Chart cards show blind spots by default only where
today's sampled sun path intersects the configured azimuth and elevation
limits. This prevents a blind-spot wedge or chart gap when the sun is below
the awning's effective elevation. The Sky Compass retains
`show_raw_blind_spot: true` for setup/debugging; the Solar Chart uses
`blind_spot_mode: width` when a full-height, sun-path-width overlay is desired.

**Full card:**

```yaml
type: custom:adaptive-cover-pro-card
entry_id: YOUR_CONFIG_ENTRY_ID
# optional:
# show_sections: [sky, decision, covers, overrides]
# compact: false
```

Find your `entry_id` at `/config/integrations/integration/adaptive_cover_pro`: click the entry and read it out of the URL bar (`entry_id=...`).

## For developers

See the [For Developers](https://github.com/jrhubott/adaptive-cover-pro/wiki/For-Developers) wiki for the full setup and build/release flow. Quick start:

```bash
npm install
npm run dev       # rollup -c -w, rebuilds dist/ on save
npm run harness   # interactive dev harness with a control panel
npm run test      # vitest
npm run lint
```

The README and wiki imagery is generated from the dev harness, so it stays in sync with the cards. One command regenerates everything:

```bash
npm run capture:readme-wiki   # all stills, the tile gallery, and the GIF
```

Or run the pieces directly:

```bash
npm run capture:screenshots   # still PNGs of each card/control into images/
npm run capture:timelapse     # the animated sky-compass GIF
```

All need Playwright (`npx playwright install chromium` once); the timelapse also needs `ffmpeg` on PATH, as does `capture:screenshots --compose`. Run any of them with `--help` for options, or `capture:screenshots --list-shots` to see what each shot captures.

## Support

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/jrhubott)

## Credits

Pairs with [Adaptive Cover Pro](https://github.com/jrhubott/adaptive-cover-pro), itself forked from [basbruss/adaptive-cover](https://github.com/basbruss/adaptive-cover).
