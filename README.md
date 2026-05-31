![Version](https://img.shields.io/github/v/release/jrhubott/adaptive-cover-pro-card?style=for-the-badge)
![Tests](https://img.shields.io/github/actions/workflow/status/jrhubott/adaptive-cover-pro-card/tests.yml?branch=main&label=Tests&style=for-the-badge)
![HACS](https://img.shields.io/github/actions/workflow/status/jrhubott/adaptive-cover-pro-card/hacs.yaml?branch=main&label=HACS&style=for-the-badge)

# Adaptive Cover Pro Card

Custom Lovelace card for the [Adaptive Cover Pro](https://github.com/jrhubott/adaptive-cover-pro) Home Assistant integration. One glance tells you *what* the integration is doing, *why* it decided that, and *how* to take over.

![Preview](https://raw.githubusercontent.com/jrhubott/adaptive-cover-pro-card/main/images/card-preview.png)

> **📖 Full documentation:** [Lovelace Card](https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card) (full card) · [Sky Compass Card](https://github.com/jrhubott/adaptive-cover-pro/wiki/Sky-Compass-Card) (standalone multi-entry compass) on the integration wiki.

---

## What it shows

- **Sky compass** — live sun position vs. window FOV and blind spot, rendered as an SVG polar plot.
- **Decision strip** — all 10 pipeline handlers with matched/skipped state and reasons. The winning handler and its position are highlighted.
- **Cover positions** — live actual position per cover, with the target as a marker and mismatch warnings. Click the track to set a position.
- **Overrides panel** — manual override countdown, force-override status, motion timeout, and a one-click reset button.

## Cards in this bundle

| Card | Type | Summary |
|------|------|---------|
| [Adaptive Cover Pro](https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card) | `custom:adaptive-cover-pro-card` | The full card — pick one integration entry, get every section (sky, decisions, covers, overrides, climate). |
| [Adaptive Cover Pro — Tile](https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card#tile-card) | `custom:adaptive-cover-pro-tile-card` | Compact chip-style row for dense dashboards: icon + name + position + ↑■▼ + contextual badge. Tap opens the ACP more-info dialog. |
| [Adaptive Cover Pro — Sky Compass](https://github.com/jrhubott/adaptive-cover-pro/wiki/Sky-Compass-Card) | `custom:adaptive-cover-pro-sky-compass-card` | Sky compass only. Accepts **multiple** integration entries; overlays each window's FOV, blind spot, and cover-closure wedge on a single compass with a shared sun dot. |

## Quick install

**HACS (recommended):**

1. Add `https://github.com/jrhubott/adaptive-cover-pro-card` as a custom repository (category: **Lovelace**).
2. Install **Adaptive Cover Pro Card** and refresh.
3. The card registers itself under the picker as "Adaptive Cover Pro".

**Manual:**

1. Download `adaptive-cover-pro-card.js` from the latest [release](https://github.com/jrhubott/adaptive-cover-pro-card/releases/latest).
2. Copy to `config/www/community/adaptive-cover-pro-card/adaptive-cover-pro-card.js`.
3. Add a dashboard resource:
   ```yaml
   url: /local/community/adaptive-cover-pro-card/adaptive-cover-pro-card.js
   type: module
   ```

## Usage

**Full card:**
```yaml
type: custom:adaptive-cover-pro-card
entry_id: YOUR_CONFIG_ENTRY_ID   # find this under Settings → Devices & Services
# optional:
show_sections: [sky, decision, covers, overrides]
compact: false
```

**Tile card** (one per ACP instance, stack many for a dense dashboard):
```yaml
type: custom:adaptive-cover-pro-tile-card
entry_id: YOUR_CONFIG_ENTRY_ID
# optional — every field is exposed in the visual editor:
# name: Patio Right
# icon: mdi:blinds-horizontal
# cover: cover.patio_right_shade
# show_position: true
# show_controls: true
# show_badge: true
# show_resume: auto                # 'auto' | 'always' | 'never'
# tap_action: { action: more-info }   # default opens the ACP more-info dialog
```

**Standalone Sky Compass** (one or more entries):
```yaml
type: custom:adaptive-cover-pro-sky-compass-card
entry_ids:
  - KITCHEN_ENTRY_ID
  - LIVING_ROOM_ENTRY_ID
# optional:
title: West-facing windows
compact: false
show_legend: true
show_stats: true
show_moon: false
show_blind_spot: true
show_window_arrow: true
show_cover_fill: true
show_sun_path: true
show_sunrise_sunset: true
show_cardinals: true
```

Find your `entry_id` on the integration's URL:
`/config/integrations/integration/adaptive_cover_pro` → click the entry → the URL bar shows `entry_id=...`.

## Screenshots

**Sky compass — a full day in motion.** The standalone sky compass card across a simulated day: the sun rises, arcs through the window's field of view, and sets, while the cover-closure wedge tracks it. The dimmed disc is the sun below the horizon at night.

![Sky compass — a day in motion](https://raw.githubusercontent.com/jrhubott/adaptive-cover-pro-card/main/images/sky-compass-timelapse.gif)

**Tile card — five configurations stacked.** Same `custom:adaptive-cover-pro-tile-card` type; each tile reflects a different combination of `show_position`, `show_controls`, `show_badge`, and `show_resume`, plus the live winner-driven badge state (Auto / Manual countdown / etc.):

![Tile card configurations](https://raw.githubusercontent.com/jrhubott/adaptive-cover-pro-card/main/images/tile-card-variants.png)

**More-info dialog.** Tapping a tile (or the full card's chrome) opens an ACP-specific dialog with the target, per-cover bars, today's forecast strip, controls, and a collapsible advanced section with the sky compass, pipeline trace, and overrides panel:

![More-info dialog](https://raw.githubusercontent.com/jrhubott/adaptive-cover-pro-card/main/images/more-info-dialog.png)

## For developers

See the [For Developers](https://github.com/jrhubott/adaptive-cover-pro/wiki/For-Developers) wiki hub for the full dev setup, build/release flow, and contribution guide. Quick start:

```bash
npm install
npm run dev       # rollup -c -w, rebuilds dist/ on save
npm run test      # vitest
npm run lint
```

The sky-compass demo GIF above is regenerated from the dev harness with
`npm run capture:timelapse` (needs `npx playwright install chromium` once and `ffmpeg` on PATH; run `npm run capture:timelapse -- --help` for scenario/time-span/format options).

## Support

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/jrhubott)

## Credits

Pairs with [Adaptive Cover Pro](https://github.com/jrhubott/adaptive-cover-pro), which is itself inspired by and forked from [basbruss/adaptive-cover](https://github.com/basbruss/adaptive-cover).
