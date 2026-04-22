![Version](https://img.shields.io/github/v/release/jrhubott/adaptive-cover-pro-card?style=for-the-badge)
![Tests](https://img.shields.io/github/actions/workflow/status/jrhubott/adaptive-cover-pro-card/tests.yml?branch=main&label=Tests&style=for-the-badge)
![HACS](https://img.shields.io/github/actions/workflow/status/jrhubott/adaptive-cover-pro-card/hacs.yaml?branch=main&label=HACS&style=for-the-badge)

# Adaptive Cover Pro Card

Custom Lovelace card for the [Adaptive Cover Pro](https://github.com/jrhubott/adaptive-cover-pro) Home Assistant integration. One glance tells you *what* the integration is doing, *why* it decided that, and *how* to take over.

![Preview](https://raw.githubusercontent.com/jrhubott/adaptive-cover-pro-card/main/images/card-preview.png)

> **📖 Full documentation:** see the [Lovelace Card](https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card) page on the integration wiki.

---

## What it shows

- **Sky compass** — live sun position vs. window FOV and blind spot, rendered as an SVG polar plot.
- **Decision strip** — all 10 pipeline handlers with matched/skipped state and reasons. The winning handler and its position are highlighted.
- **Cover positions** — live actual position per cover, with the target as a marker and mismatch warnings. Click the track to set a position.
- **Overrides panel** — manual override countdown, force-override status, motion timeout, and a one-click reset button.

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

```yaml
type: custom:adaptive-cover-pro-card
entry_id: YOUR_CONFIG_ENTRY_ID   # find this under Settings → Devices & Services
# optional:
show_sections: [sky, decision, covers, overrides]
compact: false
```

Find your `entry_id` on the integration's URL:
`/config/integrations/integration/adaptive_cover_pro` → click the entry → the URL bar shows `entry_id=...`.

## For developers

See the [For Developers](https://github.com/jrhubott/adaptive-cover-pro/wiki/For-Developers) wiki hub for the full dev setup, build/release flow, and contribution guide. Quick start:

```bash
npm install
npm run dev       # rollup -c -w, rebuilds dist/ on save
npm run test      # vitest
npm run lint
```

## Support

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/jrhubott)

## Credits

Pairs with [Adaptive Cover Pro](https://github.com/jrhubott/adaptive-cover-pro), which is itself inspired by and forked from [basbruss/adaptive-cover](https://github.com/basbruss/adaptive-cover).
