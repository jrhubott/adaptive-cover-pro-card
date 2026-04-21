# TODO

Intentionally deferred work. Not a bug tracker — those live in [GitHub Issues](https://github.com/jrhubott/adaptive-cover-pro-card/issues). Items here are considered decisions, not oversights; each records *why* it's deferred so future-me doesn't re-litigate.

---

## [Integration] Add `_attr_translation_key` to every ACP entity

**Context.** The card identifies ACP entities by `(platform, unique_id_suffix)` — authoritative, integration-controlled, stable. The full entity registry is fetched via `config/entity_registry/list` websocket to get `unique_id`, since the frontend's `hass.entities` display subset strips it. This works today against any ACP version ≥ v2.14.0.

**What's missing.** Several ACP sensors have no `_attr_translation_key` set:

| Class | File | Line |
|---|---|---|
| `AdaptiveCoverSensorEntity` (Target Position) | `sensor.py` | ~185 |
| `AdaptiveCoverTimeSensorEntity` (Start/End Sun) | `sensor.py` | ~268 |
| `AdaptiveCoverSunPositionSensor` | `sensor.py` | ~305 |
| `AdaptiveCoverLastActionSensor` | `sensor.py` | ~518 |
| `AdaptiveCoverManualOverrideEndSensor` | `sensor.py` | ~601 |
| `AdaptiveCoverPositionVerificationSensor` | `sensor.py` | ~696 |
| `AdaptiveCoverForceOverrideTriggerSensor` | `sensor.py` | ~852 |
| `AdaptiveCoverClimateStatusSensor` | `sensor.py` | ~914 |
| `AdaptiveCoverLastSkippedActionSensor` | `sensor.py` | ~1086 |

(Sensors that DO have `_attr_translation_key`: `control_status`, `motion_status`, `decision_trace`. Binary sensors and switches set `translation_key = key`, button sets `reset_manual_override`.)

**Why do it.**
- Semantic correctness — `translation_key` is HA's intended mechanism for localized names, not a hack.
- HA UI picks up translations from `translations/en.json` → `entity.sensor.<key>.name`, giving nicer default display names without overriding `_attr_name`.
- If the card ever wants a secondary identity path (e.g. a registry-less fallback), `translation_key` is the cleanest hook. Unique_id remains primary.

**Why deferred.**
- Non-blocking — the card works without this via unique_id.
- Behavior change footprint: setting `translation_key` on a sensor that previously used `_attr_name` alone will, *for fresh installs*, change the default entity_id slug. Existing entity_ids in user registries are preserved, so existing users are unaffected — but we should still verify with a test install before shipping.
- Touches en.json/de.json/fr.json — needs the `acp-translate` skill workflow.

**Acceptance.**
- [ ] Add `_attr_translation_key = "<snake_case>"` to each sensor class above. Match the existing unique_id suffix where reasonable (e.g. `last_cover_action`, `manual_override_end_time`).
- [ ] Add `entity.sensor.<key>.name` entries to `translations/en.json` using the current hardcoded display names.
- [ ] Propagate to de.json / fr.json via the `acp-translate` skill ("sync translations").
- [ ] Run `./scripts/validate_translations.py` and full test suite.
- [ ] Manual: restart HA against a fresh install, confirm entity_ids still match the existing v2.18.x ones (HA should preserve existing entity_ids in the registry).
- [ ] No card-side changes needed — unique_id path continues to be primary.

**Tracked decision.** See conversation 2026-04-21 (`/home/jrhubott/.claude/plans/i-m-thinking-that-a-quizzical-koala.md`).

---

## [Card] Service shortcut menu

**Context.** Phase 3 of the original plan included a long-press-header
service sheet that calls `adaptive_cover_pro.set_sun_tracking`,
`set_position_limits`, `set_climate`, etc. with current values prefilled.
Useful for users tuning their cover from the dashboard without opening the
Options flow.

**Why deferred.** The editor (Phase 3's main ask) is higher value. The
service sheet requires a lot of per-service schema/UI work (each service
has 5–15 parameters), and building it well overlaps with the ha-form
polish planned for v0.4.

**Acceptance.**
- [ ] Long-press header on the card opens a bottom sheet / overlay.
- [ ] Sheet lists the ACP runtime services (from `services.yaml`).
- [ ] Selecting a service opens a form prefilled with current config
  values (fetched from `coordinator.data` via sensor attributes or a
  separate service export).
- [ ] Submit calls the service; the card state updates on the next HA
  push.

---

## [Card] Bootstrap the Wiki (one-time)

**Context.** The repo has `has_wiki: true` but the wiki repo (`.wiki.git`)
doesn't exist on GitHub until the first page is created. Cloning
`git@github.com:jrhubott/adaptive-cover-pro-card.wiki.git` fails with
"Repository not found" until that happens.

**Why deferred.** Needs a one-time manual step via the GitHub web UI that
an automated run can't bypass.

**Acceptance.**
- [ ] Visit <https://github.com/jrhubott/adaptive-cover-pro-card/wiki>,
  click **Create the first page**, title it `Home`, save. This
  initializes the `.wiki.git` repo.
- [ ] Clone locally as `../adaptive-cover-pro-card.wiki/`.
- [ ] Populate:
  - `Home.md` — elevator pitch + jump-off links (mirror the integration's
    wiki Home page structure)
  - `Installation.md` — HACS + manual + cache-buster tips
  - `Configuration.md` — YAML schema + editor walkthrough + per-section
    toggles
  - `Sky-Compass.md`, `Sun-Today.md`, `Decision-Strip.md`,
    `Cover-Positions.md`, `Overrides.md`, `Climate.md` — section deep-dives
  - `Troubleshooting.md` — empty-state diagnostics, module cache traps,
    wget + cache-buster workflow
  - `For-Developers.md` — setup, scripts, test, release
  - `_Sidebar.md`, `_Footer.md`
- [ ] Reference absolute raw URLs for images
  (`https://raw.githubusercontent.com/jrhubott/adaptive-cover-pro-card/main/images/…`).
- [ ] Trim README to point at the wiki (it's already slim; just add a
  "Full docs" banner once pages exist).

---

## [Card] ha-form native-looking editor

**Context.** v0.3.0 editor uses native `<select>` and `<input>` elements.
HA's own card editors use `ha-form`, `ha-select`, `ha-switch`, etc., which
integrate better with the theme and have built-in validation.

**Why deferred.** Native controls are functional and unblock the feature.
Migrating to ha-form requires more careful typing (ha-form expects a
schema DSL, not direct children) and a styling pass.

**Acceptance.**
- [ ] Replace native `<select>` with `<ha-combo-box>` or `<ha-select>`.
- [ ] Replace toggle `<input type="checkbox">` with `<ha-switch>` +
  `<ha-formfield>`.
- [ ] Verify the editor styling matches other HA core card editors in
  both light and dark themes.
