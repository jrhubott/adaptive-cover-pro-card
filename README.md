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

## Tile card

One tile per shade: icon, name, live position, and `↑ ■ ▼` controls. The badge on the right tells you which automation is driving the cover right now, and tapping the tile opens a full Adaptive Cover Pro dialog (target, per-cover bars, forecast strip, and the compass + pipeline trace under an advanced section).

![Tile card across four automation states](https://raw.githubusercontent.com/jrhubott/adaptive-cover-pro-card/main/images/tile-gallery.png)

Same `custom:adaptive-cover-pro-tile-card` in four states. The badge changes with the live decision:

| Badge | Meaning |
|-------|---------|
| **Auto** | Automatic control is running and no specific handler has taken over. |
| **Solar tracking** | The solar handler is positioning the cover against the sun, with the target shown inline. |
| **Manual** | A manual override holds the cover. The badge shows the expiry time and a `↺` to resume automatic control. |
| **Occupancy** | The occupancy handler holds the cover open while the room is occupied. |

Force, weather, glare, climate, cloud, and custom-position slots get their own badges too. Every badge can be toggled off individually, and a small occupancy indicator can sit on the icon when occupancy is detected. Stack as many tiles as you have shades for a dense, glanceable dashboard.

## Full card

When you want everything in one place, the full card stacks the compass, the elevation chart, the pipeline decision strip (all handlers, with the winner and its position highlighted), per-cover position bars, the overrides panel, and the climate strip.

![Full card with every section](https://raw.githubusercontent.com/jrhubott/adaptive-cover-pro-card/main/images/card-preview.png)

## Cards in this bundle

| Card | Type | Summary |
|------|------|---------|
| [Adaptive Cover Pro](https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card) | `custom:adaptive-cover-pro-card` | The full card: pick one integration entry, get every section. |
| [Tile](https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card#tile-card) | `custom:adaptive-cover-pro-tile-card` | Compact per-shade row: icon, name, position, `↑ ■ ▼`, and a live decision badge. Tap opens the ACP dialog. |
| [Sky Compass](https://github.com/jrhubott/adaptive-cover-pro/wiki/Sky-Compass-Card) | `custom:adaptive-cover-pro-sky-compass-card` | The compass on its own. Accepts multiple entries and overlays each window's FOV, blind spot, and cover wedge on a shared sun dot. |

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
# show_sun_path: true
# show_legend: true
# show_stats: true
```

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
