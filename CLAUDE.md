# CLAUDE.md

**For the companion integration, see [adaptive-cover-pro](https://github.com/jrhubott/adaptive-cover-pro) and its CLAUDE.md. This repo is the Lovelace card.**

## Session Startup

**Read `HANDOFF.md` before doing anything else.**

```bash
cat HANDOFF.md && git status && git log --oneline -5
```

## HANDOFF.md

Lean forward-looking handoff — not a changelog. Update at end of any session where code merged, release cut, PR opened/closed/merged, or issue opened/closed. Do not update mid-feature-branch.

**Belongs:** Current version/branch/state, last-session summary, test count, open GitHub issues, pending upstream PRs, WIP gotchas.
**Does NOT belong:** Architecture details, release history, recently closed issues.

## Project Overview

**Adaptive Cover Pro Card** is a custom Lovelace (frontend) card that pairs with the [Adaptive Cover Pro](https://github.com/jrhubott/adaptive-cover-pro) Home Assistant integration. It reads the integration's entities and calls its services — it does **not** contain any integration-side code.

**Stack:** TypeScript 5 (strict) · Lit 3 · Rollup · Vitest (+ happy-dom) · ESLint + Prettier · npm · Node 20+
**Distribution:** HACS plugin (`hacs.json` with `content_in_root: false`, `category: "plugin"`)

## Architecture

One Lit custom element per feature area. Discovery-driven binding: the card accepts a single `entry_id` and walks the HA entity registry to find every entity belonging to that config entry.

```
src/
├── adaptive-cover-pro-card.ts     # root Lit element; wires sections
├── const.ts                       # CARD_VERSION, handler order, translation_key → role map
├── types.ts                       # shared interfaces (HA state shapes, card config)
├── lib/
│   ├── entity-discovery.ts        # entry_id → {entities, managed_covers}
│   ├── geometry.ts                # polar<->cartesian, wedge SVG paths
│   └── formatters.ts              # percent, degrees, clock, duration, countdown
└── components/
    ├── sky-compass.ts             # SVG polar plot: sun vs window FOV
    ├── decision-strip.ts          # 10 pipeline handlers, winner highlighted
    ├── cover-bar.ts               # per-cover live/target position + drag
    └── overrides-panel.ts         # manual/force/motion tiles + reset button
```

**Data flow:**
1. `setConfig({entry_id})` stores config.
2. On every `hass` update, `discoverEntities()` looks up entities by `translation_key` + `config_entry_id`.
3. Each component reads its own slice from `hass.states` and renders.
4. Writes use `hass.callService(...)` — no custom websocket channels.

## Development

```bash
./scripts/setup                # npm ci + pre-commit hooks + first build
./scripts/develop              # rollup watch; rebuilds dist/ on save
./scripts/lint                 # eslint + prettier check; --fix to auto-correct
./scripts/test                 # vitest (pass -- --watch for watch mode)
./scripts/deploy-local         # copy dist/*.js into a local HA www/community/ (needs .deploy config)
./scripts/release patch|minor|major|beta|X.Y.Z   # bump + tag + push (triggers publish workflow)
```

## Code Standards

### Keep bundle small
- No charting libraries. SVG is hand-written. Lit + custom-card-helpers is the budget.
- No lodash, date-fns, etc. Use `Intl`, `Date`, `toLocaleTimeString`.
- If a dependency is tempting, add it to `package.json` only with a bundle-size check.

### Entity binding goes through discovery
Never hardcode an entity_id. Always look it up via `entities: DiscoveredEntities['entities']`. If a sensor changes its `translation_key` in the integration, update `TRANSLATION_KEY_ROLES` in `const.ts` in the same commit.

### SVG is the primary visual language
Sky compass, position indicators, and any handler-trace diagrams use hand-written SVG. Helpers live in `lib/geometry.ts`. Don't inline math in components — extend `geometry.ts` and re-use.

### `hass.callService` only through explicit helpers
Service calls are terse one-liners in components today. If a service call grows past ~2 arg kinds or needs normalization, extract to `src/lib/services.ts`.

### Use Lit reactivity, not manual DOM
`@property({ attribute: false }) hass`, `@state()` for internal state. Lit re-renders on property change. Don't mutate `this.shadowRoot` imperatively.

### Tests are plain vitest
Unit-test pure helpers (`geometry`, `formatters`, `entity-discovery`). Component render tests are welcome but not required — test the helpers that make rendering correct rather than the render itself.

## Git & GitHub Workflow

### Branch Strategy

**Default: commit directly to current branch.** Only create a feature branch when explicitly asked.

| Type | Prefix | Example |
|------|--------|---------|
| New feature | `feature/` | `feature/elevation-chart` |
| Bug fix | `fix/` | `fix/compass-rotation-bug` |
| Docs | `docs/` | `docs/update-readme` |
| Issue (bug) | `fix/issue-NNN-` | `fix/issue-5-sun-dot-offset` |
| Issue (feature) | `feature/issue-NNN-` | `feature/issue-12-visual-editor` |

- ✅ Always pull latest before branching
- ✅ Always ask before creating a PR
- ✅ Merge PRs via `gh pr merge --squash --delete-branch`

### Commit Messages

- ❌ NEVER add `Co-Authored-By: Claude` or `Generated with Claude Code`
- ✅ First-person voice (I/me)
- Conventional format: `fix:`, `feat:`, `docs:`, `chore:`, `test:` + optional `(#123)`, under 70 chars

### Pull Requests

**Body template:**
```markdown
## Summary
What changed and why.

## Testing
- ✅ `npm run test` passing
- ✅ Built and loaded against live HA config entry
- Screenshot attached

## Related Issues
Refs #123
```

## Release Process

See [Build_and_Release.md](Build_and_Release.md) for the full release workflow.

⚠️ Only create releases when explicitly requested by the user. NEVER create proactively.

## HACS

- `hacs.json` declares this as a plugin with `filename: adaptive-cover-pro-card.js`.
- HACS serves the built file directly from the repo — `dist/adaptive-cover-pro-card.js` must be committed.
- `tests.yml` CI rejects PRs where `dist/` is out of date. Build before committing.

## Documentation

User-facing docs live in three places:

| Change | Update |
|--------|--------|
| User-visible feature, config option, troubleshooting step | **Wiki** |
| Install, landing-page elevator pitch | `README.md` (stay slim) |
| Development process | **Wiki** — [For Developers](https://github.com/jrhubott/adaptive-cover-pro-card/wiki/For-Developers) hub |

### Wiki Workflow

**Location:** `../adaptive-cover-pro-card.wiki/` — sibling directory, separate git repo. If not present, clone once:
```bash
cd .. && git clone git@github.com:jrhubott/adaptive-cover-pro-card.wiki.git
```

**Edit cycle:**
```bash
cd ../adaptive-cover-pro-card.wiki/
# edit the relevant .md
git add <file> && git commit -m "..." && git push
```

⚠️ **Wikis push direct to master — no PRs, no review gate.** Treat pushes as publish-on-commit.

**Conventions:**
- Links: `[text](Page-Name)` or `[text](Page-Name#anchor-slug)`. **Never** `#anchor-only`.
- Images: absolute raw URL — `https://raw.githubusercontent.com/jrhubott/adaptive-cover-pro-card/main/images/foo.svg`.
- Page filenames use hyphens: `Configuration-Common.md` renders as "Configuration Common".
- `_Sidebar.md` nav tree groups: Getting Started · Configuration · Views · Troubleshooting · Reference.
- `_Footer.md` boilerplate footer with repo/issues/discussions/releases links.

## Integration Coupling

This card reads integration entities by `translation_key`. The following keys MUST be present on the integration side for the card to work (defined in `src/const.ts` → `TRANSLATION_KEY_ROLES`):

**Sensors:** `cover_position`, `sun_position`, `control_status`, `decision_trace`, `last_cover_action`, `last_skipped_action`, `manual_override_end_time`, `position_verification`, `motion_status`, `force_override_triggers`, `climate_status`
**Binary sensors:** `sun_motion`, `manual_override`, `position_mismatch`, `glare_active`
**Switches:** `integration_enabled`, `automatic_control`, `manual_toggle`, `climate_mode`, `motion_control`
**Button:** `reset_manual_override`

If any of these disappear from the integration, the card degrades gracefully (the affected section shows a placeholder), but an update matching the integration version is expected.

## Dependencies

**Runtime (bundled):** `lit@^3`, `custom-card-helpers@^1.9`
**Dev only:** rollup, typescript, vitest, happy-dom, eslint, prettier
