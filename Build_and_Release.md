# Build and Release

This document describes how to cut a release of `adaptive-cover-pro-card`.

> ⚠️ **Only create releases when explicitly requested by the user.**

## Version scheme

Semver-compatible. Two tag formats:

- **Stable:** `vX.Y.Z` (e.g. `v0.1.0`, `v1.2.3`).
- **Beta:** `vX.Y.Z-beta.N` (e.g. `v0.2.0-beta.1`). Published as a GitHub pre-release; HACS shows a "beta available" badge.

`package.json#version` and `src/const.ts#CARD_VERSION` must match. `scripts/release` keeps them in sync.

## Pre-flight

Before running `scripts/release`:

1. `git status` — working tree must be clean.
2. `npm run typecheck && npm run lint && npm run test` — all green.
3. `npm run build` — confirms a fresh `dist/adaptive-cover-pro-card.js`.
4. If user-visible behavior changed, draft release notes in `release_notes/vX.Y.Z.md`.
5. Confirm `HANDOFF.md` reflects the final state of the branch that's about to be released.

## Release flow

```bash
scripts/release patch         # 0.1.0 → 0.1.1
scripts/release minor         # 0.1.0 → 0.2.0
scripts/release major         # 0.1.0 → 1.0.0
scripts/release beta          # 0.1.0 → 0.1.1-beta.1 (or bumps existing -beta.N)
scripts/release 0.5.0         # explicit
scripts/release --dry-run patch   # preview, no writes
```

The script:

1. Bumps `package.json#version`.
2. Rewrites `CARD_VERSION` in `src/const.ts`.
3. Runs `npm run build` so `dist/` is up-to-date.
4. Commits `package.json`, `package-lock.json`, `src/const.ts`, `dist/` with message `chore: release vX.Y.Z`.
5. Creates tag `vX.Y.Z` and pushes both the commit and tag.

The `publish-release.yml` workflow:

1. Triggers on the new tag.
2. Re-installs deps and rebuilds (defence in depth).
3. Creates a GitHub Release with auto-generated notes and attaches `dist/adaptive-cover-pro-card.js` as an asset.
4. Marks betas as pre-release when the tag contains `-beta.`.

## Release notes

Place notes at `release_notes/vX.Y.Z.md`. Use this structure:

```markdown
# vX.Y.Z

## Highlights
- One-sentence pitch of the most notable change.

## Added
- ...

## Changed
- ...

## Fixed
- ...

## Breaking
- (omit this section when empty)
```

The `gather PRs and issues` flow from the integration repo does not apply here — this repo is small enough that manual notes are easier. Read `git log previous_tag..HEAD --oneline` and write a prose summary.

## HACS

First-time-only: submit to `hacs/default` once the card has been used against a live integration for at least a week. See the integration repo's `HANDOFF.md` for the format and queue-check snippet.

Ongoing: nothing special. HACS pulls the latest stable tag and serves `dist/adaptive-cover-pro-card.js` directly. Users running betas opt in via HACS's "show beta versions" toggle.

## Rollback

If a release is broken in the wild:

1. Publish a patched version *immediately* (`scripts/release patch`). Don't delete the bad tag — HACS caches tag lists.
2. If the release triggered a visible regression, edit the GitHub Release description to add a `⚠️ Do not install this version` banner.
3. Never force-push to `main` or rewrite a published tag.
