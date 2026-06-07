---
name: prototype
description: Rapid prototyping mode for the Adaptive Cover Pro Card. Use when the user wants to iterate fast on visual/UI changes ("let's prototype", "quick change", "try this", "prototype mode") and is viewing results live in the dev harness. Make changes as fast as possible, skip test creation/updates during iteration, mirror every change into the harness, and defer tests + cleanup until the user says the prototype is done.
---

# Rapid Prototyping Mode

A fast iteration loop for the Adaptive Cover Pro Card. The user requests a change, you implement it as fast as possible, and they view the result live in the dev harness. **Tests and cleanup are deferred until the user says the prototype is complete.**

## The Contract

1. **Speed over ceremony.** Make the change directly. No TDD, no test files, no test updates during iteration. Don't run the test suite between changes.
2. **Skip verification ceremony.** Don't launch a browser or take screenshots — the user watches the live harness. Structural correctness only when it's free (tsc/lint catch type errors).
3. **Mirror into the harness — always.** This is the one rule that never gets skipped, even in fast mode. See "Harness Mirroring" below.
4. **Keep the harness rebuilding.** Assume `./scripts/develop` (rollup watch) is running. If the harness has its own watch/dev server, changes to `harness/src/*` must trigger its rebuild too. Confirm the watch picks up edits to both `src/` and `harness/src/`.
5. **Defer the cleanup.** When the user says the prototype is done, THEN: write/update tests, run `./scripts/lint` and `./scripts/test`, build, and verify `dist/` is current before any commit.

## Workflow Per Change

1. Read the relevant component(s) only.
2. Make the edit in `src/`.
3. **Mirror** the equivalent into `harness/` (see below).
4. Move on — don't over-verify. Let the user react to the live result.

## Harness Mirroring (non-negotiable)

The harness keeps its **own copies** of card dependencies. Any change to these in `src/` MUST be mirrored in the same step:

| Change in `src/` | Mirror in `harness/` |
|---|---|
| Config options / card config type | `harness/src/types.ts`, `harness/src/control-panel.ts` |
| i18n keys / badge text | `harness/src/mock/hass.ts` |
| Entity shapes / states | `harness/src/mock/` |
| Decision-trace attributes | `harness/src/mock/` (decider/state) |
| New visible behavior | add/update a scenario in `harness/src/scenarios.ts` |

Before declaring a change "done", ask: *does this need a harness update?* If yes, do it now.

## When Prototyping Ends

The user signals completion ("ok, that's good", "let's finalize", "prototype done"). Then run the full cleanup:

- Write/update vitest tests for new pure helpers (`geometry`, `formatters`, `entity-discovery`).
- `./scripts/lint` (with `--fix` if needed)
- `./scripts/test`
- Build so `dist/adaptive-cover-pro-card.js` is current (CI rejects stale `dist/`).
- Ask before committing/PR per the repo's git workflow (target `develop`).

## Session Learnings

<!-- Append non-obvious things discovered during prototyping sessions: harness gotchas,
     which files actually need mirroring for a given kind of change, fast-path tricks,
     watch/rebuild quirks. Keep entries short and concrete. -->

- **Pure component rendering/geometry changes need NO harness mirror.** The harness bundles the real `src/components/*` via its own rollup build, so component edits are picked up directly. Mirroring is only required for config options, i18n keys, entity shapes, or new scenarios (per the table above).
- **Some components branch on single- vs multi-window** (`discoveredList.length > 1`) and only render their multi-window UI in that path. Select a multi-window scenario in the harness to view those code paths — single-window scenarios won't show them.
