# Adaptive Cover Pro Card — Developer Handoff

**Date:** 2026-04-21
**Current Version:** v0.1.0 (unreleased, scaffolding)
**Branch:** `main`

> Quick start: read this file, then `git status && git log --oneline -5`.
> Workflow rules and patterns: see `CLAUDE.md`.

---

**Recent Merges:**
- Initial scaffold (this commit): Lit 3 + TypeScript + Rollup card skeleton modeled on the integration's conventions. Full-dashboard MVP components written but **not yet exercised against a live Home Assistant instance**. Tests cover geometry helpers, formatters, and entity discovery — no component rendering tests yet.

## Tests

**~20 passing** — vitest, run via `npm run test`.

Covered:
- `tests/geometry.test.ts` — polar math, elevation-to-radius, wedge-path generation.
- `tests/formatters.test.ts` — percent / degrees / clock / duration / countdown.
- `tests/entity-discovery.test.ts` — registry-based discovery for a single config entry.

Not yet covered:
- Component render tests (no happy-dom-driven Lit render assertions yet).
- Pipeline trace parsing edge cases (empty trace, unknown handler names).
- Cover bar drag interactions.

## Open PRs (Awaiting Merge to Main)

| PR | Branch | Issue | Status | Notes |
|----|--------|-------|--------|-------|

## Open Issues

| # | Title | Notes |
|---|-------|-------|

(none — pre-release, no issue tracker yet.)

## Known Gotchas

- **Integration-side sensor renames break the card.** The card maps entities by `translation_key` in `src/const.ts` → `TRANSLATION_KEY_ROLES`. If the integration changes a `translation_key` (e.g. `cover_position` → `target_position`), update the map *and* bump the card version. Track known keys against `custom_components/adaptive_cover_pro/sensor.py`.

- **Entity registry fallback is not implemented yet.** `discoverEntities()` currently only uses `hass.entities`. On older HA versions that don't expose it to the frontend, discovery returns `null` and the card shows its empty-state message. If this matters, add a `hass.states`-scan fallback in `src/lib/entity-discovery.ts`.

- **`dist/adaptive-cover-pro-card.js` must be committed.** HACS serves the bundled file directly from the repo (no build step on the HACS side). The `tests.yml` CI check fails if `dist/` is stale relative to sources. Run `npm run build` before committing source changes.

- **Lit decorators need `experimentalDecorators: true`** in tsconfig. Already set. Don't switch to TS 5 standard decorators — `lit/decorators.js` still uses the legacy form.

- **Rollup terser is disabled in dev** (`ROLLUP_WATCH === 'true'`). Source maps are only emitted in dev. Production bundles have no sourcemaps to keep HACS download small.

## Recent Releases

| Version | Date | Summary |
|---------|------|---------|

(none yet — v0.1.0 is the first release.)

## Pending Upstream

| PR | Repo | Status |
|----|------|--------|
| HACS default registration | `hacs/default` | Not submitted. Submit once v0.1.0 ships and has been used against a live integration for a week. |
