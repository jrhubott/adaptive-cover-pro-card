# Adaptive Cover Pro Card — Developer Handoff

**Date:** 2026-04-21
**Current Version:** v0.4.0
**Branch:** `main`

> Quick start: read this file, then `git status && git log --oneline -5`.
> Workflow rules and patterns: see `CLAUDE.md`.

---

**Recent Merges:**

- **v0.4.0** — Phase 4 polish. Compact mode propagates to every section via
  a `compact` boolean reflected as a host attribute + `:host([compact])`
  CSS; each component tightens its own layout. 7 new component render
  tests (happy-dom + Lit). Initial-render guards on every section
  (return `nothing` if `hass`/`discovered` undefined) to prevent crashes
  during the bind window. Unused `theme` config field removed — HA's own
  theme system already flows through every `var(--…)` in our CSS.
- **v0.3.0** — Visual card editor. Dropping the card on a dashboard opens
  a form with an instance dropdown (fed by `config_entries/get` WS), one
  checkbox per section, and a compact toggle. `getConfigElement()` +
  `getStubConfig()` hooks wired. Editor uses native `<select>`/`<input>`
  for now — ha-form polish deferred.
- **v0.2.0** — Added elevation-vs-time chart (SVG, sun curve + FOV band +
  current-time cursor, suncalc-driven from `hass.config.latitude/longitude`)
  and climate panel (auto-hidden when climate mode off). Discovery
  rewritten around `unique_id` from `config/entity_registry/list` WS.
- **v0.1.0** — Initial scaffold: Lit 3 + TS + Rollup, 5 section
  components, HACS plugin manifest, release workflow.

## Tests

**47 passing** across 6 files:
- `tests/geometry.test.ts` — polar math (10)
- `tests/formatters.test.ts` — units/durations/countdown (8)
- `tests/sun-model.test.ts` — azimuth-in-fov wedge math, midsummer/midwinter
  elevation sanity, FOV window discovery (12)
- `tests/entity-discovery.test.ts` — unique_id-based role resolution, foreign
  impostor rejection, registry-less fallback (7)
- `tests/config-entries.test.ts` — domain-filtered WS call (3)
- `tests/components.test.ts` — decision strip / cover bar / overrides
  panel render smoke, compact attribute reflection (7)

Run: `npm run test`

## Open PRs (Awaiting Merge to Main)

| PR | Branch | Issue | Status | Notes |
|----|--------|-------|--------|-------|

(none — working directly on main per the default branch strategy)

## Open Issues

(none — pre-HACS-default-registry, no external users yet)

## Known Gotchas

- **`dist/adaptive-cover-pro-card.js` must be committed.** HACS serves it
  directly. `tests.yml` CI rejects PRs where `dist/` is stale. Always
  `npm run build` before committing source changes.

- **HA caches Lovelace module URLs aggressively.** When installing a new
  card version, bump the resource URL's cache-buster query string
  (`?v=0.4.0`) in Settings → Dashboards → Resources. Hard-refresh alone
  does not invalidate ES modules.

- **Initial render with undefined props is real.** Lit fires render()
  immediately after `document.createElement(tag)` + `appendChild(el)`,
  before HA assigns `hass` and `discovered`. Every component now guards
  with `if (!this.hass || !this.discovered) return nothing;`. If you add
  a new section component, do the same — otherwise the component test
  suite's first createElement will throw.

- **Discovery requires the entity-registry WS call.** The frontend's
  `hass.entities` is a display subset that strips `unique_id` and
  `config_entry_id`. We fetch the full registry once via
  `config/entity_registry/list` and resubscribe on
  `entity_registry_updated`. Loss of `callWS` access degrades gracefully
  to the empty-state's diagnostic block.

- **Integration-side renames can break discovery.** Card maps entities by
  `(platform, unique_id suffix)`. If the integration changes a unique_id
  suffix (e.g. `"Cover_Position"` → `"target_position"`), the card needs
  a matching `UNIQUE_ID_ROLES` update shipped in the same beta cycle.

## Deferred Work

See `TODO.md`:
- Integration cleanup: add `_attr_translation_key` to every ACP sensor
  (semantic correctness, nicer UI names, even simpler card mapping path)
- Wiki bootstrap (needs one-time web UI click)
- Service shortcut menu (Phase 3 stretch, higher scope)
- ha-form native editor controls (cosmetic polish)

## Recent Releases

| Version | Date | Summary |
|---------|------|---------|
| v0.4.0 | 2026-04-21 | Compact mode actually compacts; component render tests; initial-render guards |
| v0.3.0 | 2026-04-21 | Visual card editor with instance dropdown + per-section toggles |
| v0.2.0 | 2026-04-21 | Elevation chart + climate panel; discovery via unique_id/WS |
| v0.1.x | 2026-04-21 | Scaffold + MVP + compass viewBox fix + unique_id discovery rewrite |

## Pending Upstream

| PR | Repo | Status |
|----|------|--------|
| HACS default registration | `hacs/default` | Not submitted — policy is "after first live use for a week". v0.1.0 tagged 2026-04-21; earliest submit 2026-04-28. |
