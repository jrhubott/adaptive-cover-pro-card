import {
  LitElement,
  html,
  css,
  nothing,
  unsafeCSS,
  type TemplateResult,
  type PropertyValues,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  handleAction,
  hasAction,
  type ActionConfig,
  type HomeAssistant,
} from 'custom-card-helpers';

import {
  ACCENT_BG_ALPHA,
  FG_ACCENT_MIX,
  HANDLER_I18N_KEYS,
  INTEGRATION_DOMAIN,
  TILE_CARD_NAME,
  TILE_CARD_EDITOR_NAME,
  COVER_ICON_FALLBACK_UNAVAILABLE,
} from './const';
import { createDiscoveryMemo } from './lib/entity-discovery';
import { resolveTileName, isValidAcpName } from './lib/name-parts';
import { makeEntitySuggestion } from './lib/entity-suggestion';
import { axisDisplayValue, positionAxisFor, resolveAxes, type ResolvedAxis } from './lib/axes';
import { railsAreOneCover } from './lib/rail-model';
import { setAxes, engageManualOverride, hasEngageManualOverride } from './lib/services';
import { buildOverridePresets } from './lib/override-presets';
import './components/extend-override-dialog';
import { AXIS_LABEL_I18N_KEYS } from './const';
import { entityStateChanged } from './lib/hass-change';
import { resolveCoverBatteries, lowestBattery, batteryIcon, isLowBattery } from './lib/battery';
import { fetchAcpConfigEntries } from './lib/config-entries';
import {
  coverStateIcon,
  coverStateColor,
  coverOpenIcon,
  coverCloseIcon,
  COVER_ACTIVE_COLOR,
} from './lib/icons';
import { subscribeEntityRegistry, type EntityRegistryEntry } from './lib/entity-registry';
import { loadEntityRegistry, getCachedRegistry } from './lib/registry-store';
import { registryCache } from './lib/registry-cache';
import { filterAcp } from './lib/registry-diff';
import type {
  AdaptiveCoverProTileCardConfig,
  DecisionTraceAttributes,
  DiscoveredEntities,
  PositionForecastAttributes,
} from './types';
import type { OverridePreset } from './lib/override-presets';
import {
  buildDecisionSentence,
  isWinningSlotSafety,
  normalizeHandler,
  resolveCustomPositionPct,
  resolveActiveMinModeFloor,
} from './lib/decision-summary';
import {
  coverCommandTargets,
  coverHeldPosition,
  coverLogicalActuals,
  logicalAxisValue,
  logicalCoverPosition,
} from './lib/cover-position';
import {
  buildSolarActiveContext,
  isAutoControlActive,
  resolveTileBadgeKind,
  selectVisibleBadges,
} from './lib/badge-visibility';
import { formatCoverState, formatPercent, isUnavailable, isOffline } from './lib/formatters';
import { t } from './lib/i18n';
import { tooltip, setTooltipDefaults } from './lib/tooltip';

import './components/tile-badge';
import './components/tilt-bar';
import './components/group-tile';
import './components/group-dialog';
import './components/more-info-dialog';
import './adaptive-cover-pro-tile-card-editor';

const HOLD_DURATION_MS = 500;
const DOUBLE_TAP_WINDOW_MS = 250;

@customElement(TILE_CARD_NAME)
export class AdaptiveCoverProTileCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config?: AdaptiveCoverProTileCardConfig;
  // _registry is left public-by-convention so tests can inject a registry and
  // skip the websocket fetch dance (mirrors the sky-compass card pattern).
  @state() public _registry: EntityRegistryEntry[] | null = null;
  @state() private _registryError: string | null = null;
  @state() private _dialogOpen = false;
  /** Live client-side percent while the position slider is being dragged.
   *  Drives the fill and readout; the write happens on the gesture's trailing
   *  click, never mid-drag. Null whenever no drag is in flight. */
  /** In-flight position drag, keyed by the cover entity being dragged — a
   *  multi-cover entry renders one rail per cover, so a single scalar would
   *  paint every rail with whichever one has the finger on it. */
  @state() private _posDrag: { id: string; pct: number } | null = null;
  @state() private _extendOpen = false;

  private _unsubRegistry: (() => void) | null = null;
  private _fetchInFlight = false;

  // Memoized discovery → stable `_discovered` reference across ticks (keeps the
  // more-info-dialog and its compass from re-rendering on unrelated state changes).
  private _memo = createDiscoveryMemo();
  private _discovered: DiscoveredEntities | null = null;

  public setConfig(config: AdaptiveCoverProTileCardConfig): void {
    if (!config || typeof config.entry_id !== 'string' || config.entry_id.length === 0) {
      throw new Error(`${TILE_CARD_NAME}: \`entry_id\` is required and must be a non-empty string`);
    }
    // Issue #247 audit finding #2: reject a malformed `name` here — most
    // commonly the missing `- ` YAML-list typo (`name: {type: area}` instead
    // of `name: [{type: area}]`) — rather than letting it reach
    // `resolveTileName()` and silently blank the tile at render time.
    // `isValidAcpName` accepts `null`/`undefined` and any other scalar
    // (audit finding #1) so a templated dashboard's empty `name:` (which
    // parses to `null`) or a literal like `name: 2` still renders instead of
    // hard-erroring the tile — see the block comment on `isValidAcpName`.
    if (!isValidAcpName(config.name)) {
      throw new Error(
        `${TILE_CARD_NAME}: \`name\` must be a string or an array of ` +
          `{type: 'entry'|'area'} or {type: 'text', text: string} parts`,
      );
    }
    let next: AdaptiveCoverProTileCardConfig = { ...config };
    if (typeof next.tap_action === 'string') {
      next = {
        ...next,
        tap_action: next.tap_action === 'none' ? { action: 'none' } : undefined,
      };
    }
    this._config = next;
    if (next.tooltips) setTooltipDefaults(next.tooltips);
    // Warm-start synchronously from the persisted ACP slice so a reload skips the Loading
    // state; the shared fetch below revalidates. Discovery filters the registry anyway, so
    // holding just the slice is fine.
    if (this._registry === null) {
      const cached = registryCache.get(next.entry_id);
      if (cached) this._registry = cached.entries;
    }
  }

  public getCardSize(): number {
    return 1;
  }

  // Sections-layout grid sizing. Defaults to full section width and
  // content-driven (auto) height; still narrowable via the column handle.
  // The detailed layout is two text rows tall, so it floors at 2 grid rows —
  // dragging it to 1 row would clip the controls. one-line fits in a single row.
  public getGridOptions() {
    const detailed = this._config?.layout !== 'one-line';
    return {
      columns: 'full',
      rows: 'auto',
      min_columns: 3,
      min_rows: detailed ? 2 : 1,
    };
  }

  public static async getStubConfig(hass: HomeAssistant): Promise<AdaptiveCoverProTileCardConfig> {
    let entry_id = '';
    try {
      const entries = await fetchAcpConfigEntries(hass);
      entry_id = entries[0]?.entry_id ?? '';
    } catch {
      /* none discoverable — picker falls back to name + description */
    }
    return { type: `custom:${TILE_CARD_NAME}`, entry_id };
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement(TILE_CARD_EDITOR_NAME);
  }

  public connectedCallback(): void {
    super.connectedCallback();
    if (this._registry === null) {
      const mem = getCachedRegistry();
      if (mem) this._registry = mem;
    }
    if (this.hass) this._ensureRegistry();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._unsubRegistry) {
      this._unsubRegistry();
      this._unsubRegistry = null;
    }
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has('hass') && this.hass) this._ensureRegistry();
  }

  // Re-render only on hass ticks that touched one of this entry's entities (the union
  // covers the tile body and everything the more-info-dialog forwards).
  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.size > 1 || !changed.has('hass')) return true;
    if (!this._discovered) return true;
    // A Cover Group must not gate on its own entities: the roster renders each
    // member as a nested tile card that HA never feeds directly, so it only sees
    // a new `hass` when this card re-renders. A member's own ACP sensors belong
    // to a different config entry and are absent from `discovered.entities`, so
    // gating would freeze every member badge, countdown and chart until some
    // group sensor happened to tick.
    if (this._discovered.is_group) return true;
    const old = changed.get('hass') as HomeAssistant | undefined;
    return entityStateChanged(old, this.hass, Object.values(this._discovered.entities));
  }

  protected willUpdate(changed: PropertyValues): void {
    if (
      this._config &&
      this.hass &&
      this._registry !== null &&
      (changed.has('hass') || changed.has('_registry') || changed.has('_config'))
    ) {
      this._discovered = this._memo(
        this.hass,
        { type: this._config.type, entry_id: this._config.entry_id },
        this._registry,
      );
    }
  }

  private _ensureRegistry(): void {
    // Revalidate against the shared registry store — cheap when warm (no websocket call),
    // so this also refreshes a slice we warm-started from localStorage.
    this._fetchRegistry();
    if (!this._unsubRegistry) {
      this._unsubRegistry = subscribeEntityRegistry(this.hass, () => {
        this._fetchRegistry(true);
      });
    }
  }

  private _fetchRegistry(force = false): void {
    if (this._fetchInFlight) return;
    this._fetchInFlight = true;
    // Capture a generation counter so a late-resolving stale fetch can't
    // overwrite a newer registry value injected (or assigned) in the meantime.
    const myGen = ++this._fetchGen;
    loadEntityRegistry(this.hass, force)
      .then((entries) => {
        if (myGen !== this._fetchGen) return;
        if (entries === this._registry) return; // unchanged shared cache → O(1) revalidation
        this._registry = entries;
        this._registryError = null;
        if (this._config)
          registryCache.set(this._config.entry_id, filterAcp(entries, this._config.entry_id));
      })
      .catch((err: Error) => {
        if (myGen !== this._fetchGen) return;
        this._registryError = err?.message ?? 'entity registry fetch failed';
      })
      .finally(() => {
        if (myGen === this._fetchGen) this._fetchInFlight = false;
      });
  }

  private _fetchGen = 0;

  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) return nothing;

    if (this._registry === null) {
      return html`<ha-card>
        <div class="empty">
          <p class="dim">
            ${this._registryError
              ? t('tile.registry_failed', this.hass, { error: this._registryError })
              : t('tile.loading', this.hass)}
          </p>
        </div>
      </ha-card>`;
    }

    const discovered = this._discovered;
    if (!discovered) {
      return html`<ha-card>
        <div class="empty">
          <p class="dim">
            ${t('tile.entry_not_found', this.hass, {
              entry: this._config.entry_id,
            })}
          </p>
        </div>
      </ha-card>`;
    }

    // Cover Group entries (issue #185) route to the group tile variant instead
    // of the cover tile controls, and to the group dialog instead of the
    // cover more-info dialog (compass/elevation/decision trace are all
    // geometry-bound and a group has no geometry).
    if (discovered.is_group) {
      const groupTitle = resolveTileName(this._config.name, discovered);
      return html`
        <ha-card>
          <acp-group-tile
            @pointerdown=${this._onPointerDown}
            @pointerup=${this._onPointerUp}
            @pointercancel=${this._onPointerCancel}
            @pointerleave=${this._onPointerCancel}
            .hass=${this.hass}
            .discovered=${discovered}
            .name=${groupTitle}
            .icon=${this._config.icon}
            .stateColor=${this._config.state_color !== false}
            .showControls=${this._config.show_controls !== false}
            .showPositionBar=${this._config.show_position_bar !== false}
            .showTilt=${this._config.show_tilt !== false}
            .showSceneSelect=${this._config.show_scene_select !== false}
            .showLock=${this._config.show_lock !== false}
            .showAutomation=${this._config.show_automation !== false}
            .showClearOverrides=${this._config.show_clear_overrides !== false}
            .showMemberBadges=${this._config.show_member_badges !== false}
            .iconInteractive=${this._hasIconAction()}
            @acp-open-more-info=${this._onClick}
            @acp-icon-action=${this._onIconClick}
          ></acp-group-tile>
        </ha-card>
        <acp-group-dialog
          .hass=${this.hass}
          .discovered=${discovered}
          .open=${this._dialogOpen}
          .name=${groupTitle}
          .memberNames=${this._config.member_names}
          .icon=${this._config.icon}
          .stateColor=${this._config.state_color !== false}
          .showTilt=${this._config.show_tilt !== false}
          .showSceneSelect=${this._config.show_scene_select !== false}
          .showLock=${this._config.show_lock !== false}
          .showAutomation=${this._config.show_automation !== false}
          .showClearOverrides=${this._config.show_clear_overrides !== false}
          .showMemberBadges=${this._config.show_member_badges !== false}
          @acp-dialog-close=${this._closeDialog}
        ></acp-group-dialog>
      `;
    }

    return html`
      <ha-card>${this._renderTile(discovered)}</ha-card>
      <acp-more-info-dialog
        .hass=${this.hass}
        .discovered=${discovered}
        .open=${this._dialogOpen}
        .showCompass=${this._config.show_compass !== false}
        .showElevationChart=${this._config.show_elevation_chart !== false}
        .showSolarCalc=${this._config.show_solar_calc !== false}
        .stateColor=${this._config.state_color !== false}
        .badges=${this._config.badges}
        .coverOrder=${this._config.covers}
        @acp-dialog-close=${this._closeDialog}
      ></acp-more-info-dialog>
      <acp-extend-override-dialog
        .hass=${this.hass}
        .open=${this._extendOpen}
        .presets=${this._extendPresets(discovered)}
        .currentEndMs=${this._manualEndMs(discovered)}
        @acp-extend-confirm=${(e: CustomEvent<{ endMs: number }>) =>
          this._onExtendConfirm(e, discovered)}
        @acp-extend-close=${() => (this._extendOpen = false)}
      ></acp-extend-override-dialog>
    `;
  }

  /** Preset moments for the extend dialog, sourced from the `position_forecast`
   *  sensor the card already discovers, topped up from suncalc late in the day. */
  private _extendPresets(discovered: DiscoveredEntities): OverridePreset[] {
    const id = discovered.entities.position_forecast_sensor;
    const attrs = id
      ? (this.hass.states[id]?.attributes as PositionForecastAttributes | undefined)
      : undefined;
    return buildOverridePresets({
      events: attrs?.events ?? [],
      nowMs: Date.now(),
      latitude: this.hass.config?.latitude,
      longitude: this.hass.config?.longitude,
    });
  }

  /** The current override end as epoch ms — the base the dialog's relative chips
   *  push out from. Undefined when the sensor is missing or unparseable. */
  private _manualEndMs(discovered: DiscoveredEntities): number | undefined {
    const id = discovered.entities.manual_override_end_sensor;
    const raw = id ? this.hass.states[id]?.state : undefined;
    if (!raw) return undefined;
    const ms = Date.parse(raw);
    return Number.isNaN(ms) ? undefined : ms;
  }

  private _onExtendConfirm(
    e: CustomEvent<{ endMs: number }>,
    discovered: DiscoveredEntities,
  ): void {
    // Entry-level surface: the badge summarises the whole entry, so extending
    // only one cover would desync the badge from reality.
    engageManualOverride(this.hass, discovered.managed_covers, {
      endTime: new Date(e.detail.endMs),
    });
    this._extendOpen = false;
  }

  private _closeDialog = (): void => {
    this._dialogOpen = false;
  };

  private _buildHandlerLabels(): Record<string, string> {
    const labels: Record<string, string> = {};
    for (const [key, dotted] of Object.entries(HANDLER_I18N_KEYS)) {
      labels[key] = t(dotted, this.hass);
    }
    return labels;
  }

  private _renderTile(discovered: DiscoveredEntities): TemplateResult {
    const cfg = this._config!;
    const cover = this._resolvedCover(discovered);
    const title = resolveTileName(cfg.name, discovered);
    // Resolve the icon from the underlying HA cover entity so it matches HA's
    // native tile/more-info glyph: cfg.icon override → explicit entity icon →
    // device_class glyph → integration cover_type → generic fallback.
    const stateObj = cover ? this.hass.states[cover] : undefined;
    const coverDeviceClass = stateObj?.attributes?.device_class as string | undefined;
    // Two distinct "no live data" concepts (split after issue #232 — a Somfy
    // RTS-style one-way cover sits at `unknown` forever but is still fully
    // controllable, so it must render like any other live, no-feedback cover):
    // - `offline` (narrow — HA `unavailable`/missing only): the entity itself
    //   is gone. This alone drives total blackout — dim the tile, disable
    //   every control and the tilt bar, show the "Unavailable" label, use the
    //   fallback glyph/color, and null out BOTH the live position/tilt AND
    //   the diagnostic calculated-position/tilt-target sensors (issue #212's
    //   original concern: neither a stale `current_position` attribute nor an
    //   always-live diagnostic sensor may leak through as if the cover were
    //   live).
    // - `noLiveData` (broad — also true for `unknown`): this entity's OWN
    //   reported attributes (`current_position`, `current_tilt_position`)
    //   aren't trustworthy right now, so those raw reads are blocked below.
    //   It does NOT gate the icon, color, dim class, controls, or the
    //   independently-sourced ACP diagnostic sensors (calculated position,
    //   tilt target) — an `unknown` cover shows those exactly like any other
    //   no-feedback cover.
    const offline = isOffline(stateObj?.state);
    const noLiveData = isUnavailable(stateObj?.state);
    const calculatedPosition = this._currentPosition(discovered);
    // The raw entity attribute is only trusted when this cover's own state
    // gives us a reason to trust it (`!noLiveData`) — an `unknown` cover does
    // not get its `current_position` attribute treated as live truth, but the
    // independently-sourced `calculatedPosition` fallback below still applies,
    // same as any other no-feedback cover (issue #232).
    const reportedPosition = noLiveData ? null : this._liveCoverPosition(discovered, cover);
    const livePosition = offline ? null : (reportedPosition ?? calculatedPosition);
    const icon =
      cfg.icon ??
      (offline
        ? COVER_ICON_FALLBACK_UNAVAILABLE
        : coverStateIcon({
            explicitIcon: stateObj?.attributes?.icon as string | undefined,
            deviceClass: coverDeviceClass,
            coverType: discovered.cover_type,
            // Gated, not the raw attribute (issue #232 follow-up): the glyph
            // must agree with the readout/position bar below, both of which
            // derive from `livePosition` — a leftover stale `current_position`
            // attribute on an `unknown` cover must not paint a fully-open/
            // fully-closed variant that the rest of the tile disagrees with.
            position: livePosition,
          }));
    const iconColor = cfg.state_color !== false ? coverStateColor(stateObj?.state) : null;
    // Drives both the icon's own tap target and HA's tinted-pill background,
    // which upstream gates on exactly this (see `icon_tap_action` in types.ts).
    const iconInteractive = this._hasIconAction();
    const showPosition = cfg.show_position !== false;
    const showState = cfg.show_state !== false;
    const showControls = cfg.show_controls !== false;
    const showBadge = cfg.show_badge !== false;
    const motionState = cfg.show_motion_icon !== false ? this._motionActiveState(discovered) : null;
    const motionTitle =
      motionState === 'timeout_pending'
        ? t('tile.motion_pending', this.hass)
        : t('tile.motion_detected', this.hass);
    // `detailed` is the default layout; `one-line` is the compact opt-out.
    const detailed = cfg.layout !== 'one-line';
    // Data-driven axes: any non-position axis (venetian tilt) drives the mini
    // bar. The detailed layout gets the bar; one-line folds it into the readout.
    // `show_tilt` is reinterpreted as "show non-position axes". On an older
    // integration `resolveAxes` synthesizes tilt from the Cover_Tilt sensor, so
    // behavior is unchanged.
    const axes = resolveAxes(discovered);
    const secondaryAxis = axes.find((a) => a.id !== 'position');
    // The rails' axis, always the POSITION one — never `axes[0]`, which on a
    // tilt-only cover type is the slat axis and carries its range, not the
    // 0–100 a track fraction speaks in.
    const positionAxis = positionAxisFor(discovered);
    const showTilt = cfg.show_tilt !== false && !!secondaryAxis;
    // liveTilt mirrors reportedPosition above: the raw `current_tilt_position`
    // attribute is gated on `noLiveData` (not trusted for `unknown` either).
    // tiltTarget mirrors calculatedPosition: it's the independently-sourced
    // diagnostic tilt-target sensor, so it's gated only on `offline` — a
    // genuinely offline cover must not leak a stale attribute or an
    // always-live diagnostic sensor (issue #212 follow-up), but an `unknown`
    // cover's live solar tilt target is legitimate to show.
    const liveTilt = !noLiveData && secondaryAxis ? this._liveAxis(cover, secondaryAxis) : null;
    const tiltTarget =
      !offline && secondaryAxis ? this._axisTarget(discovered, secondaryAxis) : null;
    // The ↑■↓ buttons are retargetable (`controls_cover` / `controls_axis`):
    // by default they drive the resolved cover's position axis exactly as
    // before, but a day/night shade in the integration's `dual_entity` model
    // binds two rail entities and a venetian exposes a second axis, and either
    // can be the thing the user wants the buttons on.
    // Falls back to the POSITION axis, never `axes[0]`. On a tilt-only cover
    // type (cover_tilt, louvered roof) discovery publishes only the slat axis,
    // and taking axes[0] silently changed the default ↑/↓ payload from
    // `{position: …}` to `{tilt: …}` and re-gated at-open/at-closed on
    // `current_tilt_position`.
    const controlsAxis =
      axes.find((a) => a.id === cfg.controls_axis) ?? positionAxisFor(discovered);
    // Validated against the roster exactly like `covers` is. Unvalidated, a
    // `controls_cover` left behind by an entry change (or hand-written) would
    // aim `set_axes` at a cover in a DIFFERENT config entry — the integration
    // resolves the entity id, so that cover would physically move.
    const controlsCover =
      cfg.controls_cover &&
      (discovered.managed_covers.length === 0 ||
        discovered.managed_covers.includes(cfg.controls_cover))
        ? cfg.controls_cover
        : cover;
    // Same trust gate as `reportedPosition`, but applied to whichever entity
    // the buttons actually drive — an `unknown` rail must not have its stale
    // attribute decide whether ↑ is disabled.
    const controlsState = controlsCover ? this.hass.states[controlsCover] : undefined;
    // The buttons follow the entity they DRIVE, not the one the tile is about.
    // Reading `offline` (the resolved cover) disabled a live retargeted rail
    // whenever the resolved cover happened to be unavailable, and left the
    // buttons live against an unavailable retargeted one.
    const controlsOffline = isOffline(controlsState?.state);
    const controlsValue =
      isUnavailable(controlsState?.state) || !controlsAxis
        ? null
        : controlsAxis.id === 'position'
          ? logicalCoverPosition(this.hass, discovered, controlsCover)
          : logicalAxisValue(this.hass, controlsAxis, controlsCover);
    // When the target reports its value, disable the control that can't do
    // anything: open (↑) at the axis maximum, close (↓) at its minimum. Targets
    // that don't report leave both enabled (gate stays on `!controlsCover`).
    const atOpen = controlsValue !== null && controlsValue >= (controlsAxis?.max ?? 100);
    const atClosed = controlsValue !== null && controlsValue <= (controlsAxis?.min ?? 0);
    const winner = this._winner(discovered);
    const traceAttrs = this._traceAttrs(discovered);
    const manualEndIso = this._manualEndIso(discovered);
    const inert = this._isFullyInert(cfg);
    const safetyActive = isWinningSlotSafety(traceAttrs);
    const summary =
      cfg.show_decision_summary === true && traceAttrs
        ? buildDecisionSentence(
            traceAttrs.trace ?? [],
            traceAttrs,
            winner,
            this._buildHandlerLabels(),
            t('badge.safety', this.hass),
          )
        : '';

    const hasBottomSummary = !!summary && detailed;
    const integrationEnabled = this._switchOn(discovered, 'integration_enabled_switch');
    const automaticControl = this._switchOn(discovered, 'automatic_control_switch');
    const manualActive = this._manualOverrideOn(discovered);
    // Resolve the single winner badge: the same inversion + per-badge opt-in
    // used by the dialog, plus the "Motion idle" → Auto fallback (the badge is
    // redundant when the motion icon shows, and hidden when its flag is off).
    // When cloud wins, the badge is dropped (blank).
    const winnerKind = resolveTileBadgeKind({
      winner,
      integrationEnabled,
      manualActive,
      badges: cfg.badges,
      showMotionIcon: cfg.show_motion_icon !== false,
      inTimeWindow: traceAttrs?.in_time_window,
      trace: traceAttrs?.trace,
    });
    const solarCtx = buildSolarActiveContext(traceAttrs?.trace, winner);
    const winnerVisible =
      winnerKind !== null && selectVisibleBadges([winnerKind], cfg.badges, solarCtx).length > 0;
    const renderBadge =
      showBadge && winnerVisible && !(automaticControl === false && integrationEnabled === true);
    // Standalone "Auto" indicator (issue #110): shows whenever the cover is
    // under automatic control, independent of which automatic handler won, so
    // a non-auto winner badge (Cloudy, Solar, …) no longer hides the fact that
    // automatic control is running. Detailed layout only — one-line has no room.
    const autoActive = isAutoControlActive({
      winner,
      integrationEnabled,
      automaticControl,
      manualActive,
      bypassAutoControl: traceAttrs?.bypass_auto_control === true,
      safetyActive,
    });
    const showAutoBadge = detailed && showBadge && cfg.badges?.auto !== false && autoActive;
    // Dedupe: when the winner badge is itself `auto` (default winner), render
    // the Auto line only and suppress the inline winner badge.
    const inlineWinnerBadge = !(showAutoBadge && winnerKind === 'auto');
    // No-feedback covers publish an in-transit direction; surface it as the same
    // localized "Opening"/"Closing" state text a real position cover shows, by
    // overriding the entity's (final open/closed) state in the readout.
    const transitDir = this._transitState(discovered);
    const stateText = offline
      ? t('tile.unavailable', this.hass)
      : showState
        ? formatCoverState(this.hass, cover, transitDir ?? undefined)
        : null;
    const positionText = showPosition && livePosition !== null ? formatPercent(livePosition) : null;
    // One-line has no room for the bar, so fold tilt into the readout as ⟂30%.
    const tiltText =
      showTilt && !detailed && liveTilt !== null ? `⟂${formatPercent(liveTilt)}` : null;
    const labelParts = [stateText, positionText, tiltText].filter((p): p is string => !!p);
    const hasStateLabel = !!stateText;

    const activeFloor = resolveActiveMinModeFloor(traceAttrs, this.hass.states, calculatedPosition);
    const winnerNormalized = normalizeHandler(winner);
    const showFloorChip =
      showBadge &&
      !!activeFloor &&
      !(
        winnerNormalized === 'custom_position' && traceAttrs?.custom_position_minimum_mode === true
      ) &&
      integrationEnabled;

    // Detailed layout now inlines the badge + floor chip onto the state line
    // The Resume action is folded into the badge: while a manual override is
    // active and the integration exposes a reset button, the contextual badge
    // (Manual, or Custom when a slot also wins) becomes tappable to resume
    // automatic control — replacing the old standalone Resume pill.
    const resumable = manualActive && !!discovered.entities.reset_override_button;
    // Extend (#229) gates on `manualActive` and service presence — never on the
    // badge kind. Per `badge-visibility.ts:127` an active override renders kind
    // `custom_position`/`force` whenever a slot also wins, so `kind === 'manual'`
    // is NOT equivalent to "override active"; deriving override affordances from
    // the winning handler is the bug behind #81, #82 and #199. The service half
    // mirrors the entity-presence idiom above: integrations older than v2026.7.0
    // lack `engage_manual_override`, and the affordance simply doesn't render.
    const extendable = manualActive && hasEngageManualOverride(this.hass);

    const positionTpl =
      labelParts.length > 0 ? html`<div class="position">${labelParts.join(' · ')}</div>` : nothing;
    const floorChipTpl = showFloorChip
      ? html`<span
          class=${`acp-floor-chip${activeFloor!.clamping ? '' : ' is-armed'}${
            activeFloor!.resistsManual ? ' resists-manual' : ' is-bypassable'
          }`}
          ${tooltip(t('dialog.floor_tooltip', this.hass))}
          >${t('dialog.floor', this.hass)} ${formatPercent(activeFloor!.position)}</span
        >`
      : nothing;
    const badgeTpl = renderBadge
      ? html`<acp-tile-badge
          .hass=${this.hass}
          .winner=${winner}
          .kindOverride=${winnerKind ?? undefined}
          .integrationEnabled=${integrationEnabled}
          .slotNumber=${traceAttrs?.custom_position_active_slot}
          .slotName=${traceAttrs?.custom_position_active_slot_name}
          .pct=${resolveCustomPositionPct(traceAttrs, calculatedPosition) ?? undefined}
          .minimumMode=${traceAttrs?.custom_position_minimum_mode}
          .safetyActive=${safetyActive}
          .manualEndIso=${manualEndIso}
          .manualActive=${manualActive}
          .resumable=${resumable}
          .extendable=${extendable}
          @acp-resume=${() => this._resume(discovered)}
          @acp-extend=${() => (this._extendOpen = true)}
        ></acp-tile-badge>`
      : nothing;
    // The standalone Auto badge reuses the existing `auto` kind/tokens/icon —
    // no resume/manual context, no countdown, just the indicator.
    const autoBadgeTpl = showAutoBadge
      ? html`<acp-tile-badge
          .hass=${this.hass}
          .winner=${winner}
          .kindOverride=${'auto'}
          .integrationEnabled=${integrationEnabled}
        ></acp-tile-badge>`
      : nothing;

    // HA-tile secondary line: the "Open · 25%" readout stacked under the name.
    const stateLineTpl =
      labelParts.length > 0 ? html`<div class="state">${labelParts.join(' · ')}</div>` : nothing;
    // Right-aligned target-vs-actual mini bar under the ↑■↓ controls (fills the
    // otherwise-empty right half of the chrome row). Live position is the fill;
    // the auto/solar target is a marker tick. Purely informational — the ↑■↓
    // buttons remain the control surface. Detailed layout only, with its own
    // `show_position_bar` toggle independent of the badge master switch.
    // One rail per managed cover. An entry that drives several covers (a day/
    // night shade's two rails in the `dual_entity` model, or plain multi-cover
    // entry) previously rendered only `managed_covers[0]`, so the rest of the
    // covers the tile is bound to had no readout and no control at all.
    //
    // `covers` picks the rails and their order — the integration's own order is
    // the config flow's entity-pick order, which the card cannot influence.
    // Unknown ids are dropped rather than rendered as dead rails. Failing that,
    // `cover` pins the tile to its single rail, as before.
    // Default rails: the `cover` pin alone when one is set, else every managed
    // cover. The editor's rail widget must agree with this exactly.
    const defaultCovers = cfg.cover
      ? [cfg.cover]
      : discovered.managed_covers.length > 0
        ? discovered.managed_covers
        : cover
          ? [cover]
          : [];
    // An explicit `covers` list picks the rails and their order; ids the entry
    // no longer manages are dropped. If that leaves NOTHING — every listed cover
    // was renamed or removed from the entry — fall back to the default rather
    // than rendering a tile with no position bar: the editor hides its repair
    // widget below two managed covers, so an empty result would be escapable
    // only by hand-editing YAML.
    const listed = cfg.covers?.length
      ? discovered.managed_covers.length > 0
        ? cfg.covers.filter((id) => discovered.managed_covers.includes(id))
        : cfg.covers
      : [];
    const barCovers = listed.length > 0 ? listed : defaultCovers;
    // Are the stacked rails layers of ONE cover, or separate covers? Both arrive
    // here as a plain id list and rendered identically, which made a day/night
    // shade's two rails indistinguishable from an entry someone attached three
    // windows to. Keyed off the tile's own rail list, not the entry's, so
    // narrowing a dual-rail shade to one rail drops the bracket with the stack.
    const layeredRails = railsAreOneCover(discovered, barCovers.length);
    // Low-battery overlay on the tile icon, sibling to the motion overlay. Keyed
    // off the tile's OWN cover list, not the entry's: a tile narrowed to one rail
    // of a dual-rail shade must not warn about the battery of a cover it doesn't
    // show. Renders only when low, so a healthy or mains-powered cover is silent.
    const lowBattery = (() => {
      const worst = lowestBattery(resolveCoverBatteries(this.hass, barCovers));
      return isLowBattery(worst) ? worst : null;
    })();
    // Live value for any rail. The resolved cover keeps the value the rest of
    // the tile (icon, readout, controls) already agrees on; every other rail
    // reproduces the same resolution for ITSELF rather than reading a raw
    // attribute: the `unknown`-state gate from issue #232 (a stale
    // `current_position` is not live truth), then the integration's own
    // snapshot — which carries the assumed position for a no-feedback cover, and
    // is exactly what the dialog's cover bars read, so the two agree.
    const logicalActuals = coverLogicalActuals(this.hass, discovered);
    const railLive = (id: string): number | null => {
      if (id === cover) return livePosition;
      const st = this.hass.states[id];
      if (isOffline(st?.state)) return null;
      const reported = isUnavailable(st?.state)
        ? null
        : logicalCoverPosition(this.hass, discovered, id);
      return reported ?? logicalActuals[id] ?? null;
    };
    // The resolved cover's tick stays the entry's pipeline target — the number
    // this tile has always shown, and the one the dialog's marker still shows.
    // Only the OTHER rails take the per-cover command target, because the entry
    // target is on the wrong scale for them (a day/night shade's middle rail
    // carries the fabric blend folded into an absolute position). Deliberately
    // not the reverse: routing can pin a dispatched value to 0/100 on an
    // open/close-only cover, and interpolation makes it diverge from the linear
    // value, so it is a worse tick wherever the pipeline target is available.
    //
    // A rail with no command target stays TICKLESS rather than borrowing the
    // entry's, and that is deliberate: the card cannot tell a mirrored rail
    // (entry scale, borrowing would be right) from a remapped one (own scale,
    // borrowing would put the tick in the wrong place), so it declines to
    // guess. Note that a missing target is currently more common than it
    // should be — the integration records a command target only on dispatch,
    // so a cover skipped as `same_position` never gets one even though the
    // pipeline computed it (adaptive-cover-pro#1158). The fix belongs there,
    // where the number is known, not in a card-side guess.
    const commandTargets = coverCommandTargets(this.hass, discovered);
    const railTarget = (id: string): number | null =>
      id === cover ? calculatedPosition : (commandTargets[id] ?? null);
    const showPositionBar =
      detailed && cfg.show_position_bar !== false && barCovers.some((id) => railLive(id) !== null);
    // A single cover shows a bare rail — no glyph, there is nothing to tell apart.
    // The stack reserves a glyph lane to its LEFT rather than taking it out of the
    // rails, so a stacked rail and a lone rail are the same length and line up on
    // both edges (issue #260).
    const posBarTpl = showPositionBar
      ? barCovers.length === 1
        ? // Same per-rail resolution as the stack below. Reading `livePosition`
          // here painted the RESOLVED cover's value onto whatever cover
          // `covers[0]` names, while clicks/drags wrote to `covers[0]`.
          this._posBar(barCovers[0], railLive(barCovers[0]), railTarget(barCovers[0]), positionAxis)
        : html`<div
            class=${`pos-stack${layeredRails ? ' layered' : ''}`}
            role="group"
            aria-label=${t(layeredRails ? 'tile.rails_layered' : 'tile.rails_separate', this.hass, {
              count: barCovers.length,
            })}
            ${layeredRails ? tooltip(t('tile.rails_layered_hint', this.hass)) : nothing}
          >
            ${barCovers.map((id) => {
              const live = railLive(id);
              const railName = this._coverShortName(id, discovered);
              return html`<div class="pos-row">
                <ha-icon
                  class="pos-glyph"
                  icon=${this._railIcon(id, discovered, live)}
                  ${tooltip(railName)}
                ></ha-icon>
                ${this._posBar(id, live, railTarget(id), positionAxis, railName)}
              </div>`;
            })}
          </div>`
      : nothing;
    // ACP's own chrome (Auto badge, winner/Manual badge, floor chip) and the
    // position bar share one row beneath the name/state: badges left, bar
    // right-aligned. The icon spans both rows so it stays vertically centered in
    // the tile (issue #208).
    const showWinnerBadge = renderBadge && inlineWinnerBadge;
    const hasDetailBadges = detailed && (showAutoBadge || showWinnerBadge || showFloorChip);
    const detailBadges = hasDetailBadges
      ? html`${autoBadgeTpl}${showWinnerBadge ? badgeTpl : nothing}${floorChipTpl}`
      : nothing;
    const hasChromeRow = detailed && (hasDetailBadges || showPositionBar);
    // Bar-only: the chrome row carries just the position bar (no badges). Kept
    // as a class for tests and styling hooks, but the layout is identical to a
    // badged tile's — see the .bar-only note in the stylesheet (issue #260).
    const barOnly = hasChromeRow && !hasDetailBadges;

    return html`
      <div
        class=${`tile-body${detailed ? ' detailed' : ''}${hasStateLabel ? ' has-state-label' : ''}${showFloorChip && !detailed ? ' has-floor-chip' : ''}${showTilt && detailed ? ' has-tilt' : ''}${hasChromeRow ? ' has-chrome-row' : ''}${barOnly ? ' bar-only' : ''}${showControls ? ' has-controls' : ''}${offline ? ' unavailable' : ''}`}
        role=${inert ? 'group' : 'button'}
        tabindex=${inert ? -1 : 0}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @pointerleave=${this._onPointerCancel}
        @click=${this._onClick}
      >
        <div
          class=${`cover-icon-wrap${iconInteractive ? ' background' : ''}`}
          role=${iconInteractive ? 'button' : nothing}
          tabindex=${iconInteractive ? 0 : nothing}
          aria-label=${iconInteractive ? t('tile.icon_action_label', this.hass) : nothing}
          style=${iconColor ? `--acp-tile-icon-color: ${iconColor}` : nothing}
          @click=${this._onIconClick}
          @keydown=${this._onIconKeydown}
        >
          <ha-icon
            class="cover-icon"
            icon=${icon}
            style=${iconColor ? `color: ${iconColor}` : ''}
          ></ha-icon>
          ${motionState
            ? html`<ha-icon
                class="motion-overlay ${motionState}"
                icon="mdi:motion-sensor"
                ${tooltip(motionTitle)}
              ></ha-icon>`
            : nothing}
          ${lowBattery
            ? html`<ha-icon
                class="battery-overlay"
                icon=${batteryIcon(lowBattery.level, lowBattery.charging)}
                ${tooltip(
                  lowBattery.level === null
                    ? t('tile.battery_unknown', this.hass)
                    : t('tile.battery_low', this.hass, { level: lowBattery.level }),
                )}
              ></ha-icon>`
            : nothing}
        </div>
        <div class="label">
          <div class="title">${title}</div>
          ${detailed ? stateLineTpl : nothing}
          ${summary && !detailed ? html`<div class="summary">${summary}</div>` : nothing}
          ${hasBottomSummary
            ? html`<div class="summary" ${tooltip(summary)}>${summary}</div>`
            : nothing}
        </div>
        ${detailed ? nothing : html`${positionTpl}${floorChipTpl}`}
        ${hasChromeRow ? html`<div class="chrome-line">${detailBadges}${posBarTpl}</div>` : nothing}
        ${showTilt && detailed
          ? html`<div
              class="tilt-line"
              @click=${this._stop}
              @pointerdown=${this._stop}
              @pointerup=${this._stop}
            >
              <acp-tilt-bar
                layout="tile"
                .hass=${this.hass}
                .label=${secondaryAxis ? this._axisLabel(secondaryAxis) : null}
                .min=${secondaryAxis?.min ?? 0}
                .max=${secondaryAxis?.max ?? 100}
                .unit=${secondaryAxis?.unit ?? '%'}
                .actual=${liveTilt}
                .target=${tiltTarget}
                .openBlocksSun=${secondaryAxis?.openBlocksSun ?? false}
                .disabled=${offline}
                @acp-tilt-set=${(e: CustomEvent<number>) =>
                  secondaryAxis && this._setAxis(cover, secondaryAxis.id, e.detail)}
              ></acp-tilt-bar>
            </div>`
          : nothing}
        ${showControls
          ? html`<div class="controls" @click=${this._stop} @pointerdown=${this._stop}>
              <button
                class="up"
                type="button"
                aria-label=${t('tile.open', this.hass)}
                ?disabled=${!controlsCover || controlsOffline || atOpen}
                @click=${() =>
                  controlsAxis && this._setAxis(controlsCover, controlsAxis.id, controlsAxis.max)}
              >
                <ha-icon icon=${coverOpenIcon(coverDeviceClass)}></ha-icon>
              </button>
              <button
                class="stop"
                type="button"
                aria-label=${t('tile.stop', this.hass)}
                ?disabled=${!controlsCover || controlsOffline}
                @click=${() => this._stopCover(controlsCover)}
              >
                <ha-icon icon="mdi:stop"></ha-icon>
              </button>
              <button
                class="down"
                type="button"
                aria-label=${t('tile.close', this.hass)}
                ?disabled=${!controlsCover || controlsOffline || atClosed}
                @click=${() =>
                  controlsAxis && this._setAxis(controlsCover, controlsAxis.id, controlsAxis.min)}
              >
                <ha-icon icon=${coverCloseIcon(coverDeviceClass)}></ha-icon>
              </button>
            </div>`
          : nothing}
        ${detailed ? nothing : badgeTpl}
      </div>
    `;
  }

  private _resolvedCover(discovered: DiscoveredEntities): string | undefined {
    if (this._config?.cover) return this._config.cover;
    return discovered.managed_covers[0];
  }

  /** Prefers the pre-interpolation `linear_position` attribute (issue #219)
   *  over the raw motor state when present. See {@link coverHeldPosition}. */
  private _currentPosition(discovered: DiscoveredEntities): number | null {
    return coverHeldPosition(this.hass, discovered);
  }

  /** In-transit direction for this entry's resolved cover, read from the
   *  target sensor's `transit_states` attribute (no-feedback covers publish it
   *  while mid-move). Returns null when absent or for a different cover. */
  private _transitState(discovered: DiscoveredEntities): 'opening' | 'closing' | null {
    const id = discovered.entities.target_position_sensor;
    if (!id) return null;
    const cover = this._resolvedCover(discovered);
    if (!cover) return null;
    const transit = this.hass.states[id]?.attributes?.transit_states as
      | Record<string, 'opening' | 'closing'>
      | undefined;
    return transit?.[cover] ?? null;
  }

  /** The cover's live position in the **logical** frame — un-inverted at the
   *  read on an `inverse_state` entry so the fill, readout, glyph, tooltip and
   *  the ↑/↓ travel-limit gates all share one frame with the
   *  `coverHeldPosition`-derived target marker (issue #234). Inert (identity)
   *  on every non-inverse install. */
  private _liveCoverPosition(
    discovered: DiscoveredEntities,
    cover: string | undefined,
  ): number | null {
    return logicalCoverPosition(this.hass, discovered, cover);
  }

  private _winner(discovered: DiscoveredEntities): string {
    const id = discovered.entities.decision_trace_sensor;
    if (!id) return 'default';
    return this.hass.states[id]?.state ?? 'default';
  }

  private _traceAttrs(discovered: DiscoveredEntities): DecisionTraceAttributes | undefined {
    const id = discovered.entities.decision_trace_sensor;
    if (!id) return undefined;
    return this.hass.states[id]?.attributes as unknown as DecisionTraceAttributes | undefined;
  }

  private _motionActiveState(discovered: DiscoveredEntities): string | null {
    const id = discovered.entities.motion_status_sensor;
    if (!id) return null;
    const state = this.hass.states[id]?.state;
    return state === 'motion_detected' || state === 'timeout_pending' ? state : null;
  }

  private _manualOverrideOn(discovered: DiscoveredEntities): boolean {
    const id = discovered.entities.manual_override_binary;
    if (!id) return false;
    return this.hass.states[id]?.state === 'on';
  }

  private _switchOn(
    discovered: DiscoveredEntities,
    role: 'integration_enabled_switch' | 'automatic_control_switch',
  ): boolean {
    const id = discovered.entities[role];
    if (!id) return true;
    return this.hass.states[id]?.state !== 'off';
  }

  private _manualEndIso(discovered: DiscoveredEntities): string | undefined {
    if (!this._manualOverrideOn(discovered)) return undefined;
    const id = discovered.entities.manual_override_end_sensor;
    if (!id) return undefined;
    return this.hass.states[id]?.state;
  }

  private _setCoverPosition(cover: string | undefined, position: number): void {
    if (!cover) return;
    this._setAxis(cover, 'position', position);
  }

  /** One position rail. `live` is the logical-frame value, `target` the command
   *  target tick (null on a rail the entry-level target doesn't describe).
   *
   *  The rail DRAWS coverage, not openness: a full rail means the cover is
   *  blocking the most sun, which is the polarity the sky compass has always
   *  used. `axisDisplayValue` is the only place that flip happens, and it is
   *  applied symmetrically — fill, tick, pointer and keyboard all go through it,
   *  so the value read from the sensor and the value handed to `set_axes` stay
   *  in the logical frame untouched. */
  private _posBar(
    id: string,
    live: number | null,
    target: number | null,
    axis: ResolvedAxis,
    /** Rail name, folded into the slider's accessible name on a multi-rail tile
     *  where "Position" alone doesn't say which cover is being driven. */
    railName?: string,
  ): TemplateResult {
    // A drag in flight overrides the server-truth fill and readout. Post-#234
    // the live value is logical-frame and `set_axes` takes logical values, so
    // the percentage you drag to is exactly the one that gets sent.
    const dragging = this._posDrag?.id === id;
    const shown = dragging ? this._posDrag!.pct : live;
    // What the rail paints. ARIA describes the visual, so `aria-valuenow` is
    // this too — a screen reader stepping the slider must move the fill the way
    // the arrow key points. The open percentage is still spoken, via valuetext.
    // 0, never null: a null width would emit `width:null%` and only render empty
    // because the browser drops the invalid declaration. The sibling bars both
    // normalize here too.
    const shownFill = shown === null ? 0 : axisDisplayValue(shown, axis);
    const targetFill = target === null ? null : axisDisplayValue(target, axis);
    const tip =
      target !== null
        ? `${formatPercent(shown)} · ${t('dialog.target', this.hass)} ${formatPercent(target)}`
        : formatPercent(shown);
    return html`<div
      class="pos-slider${dragging ? ' dragging' : ''}"
      role="slider"
      tabindex="0"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${shownFill}
      aria-valuetext=${t('covers.position_open_value', this.hass, {
        pct: formatPercent(shown),
      })}
      aria-label=${railName
        ? `${railName} · ${t('covers.position_slider_label', this.hass)}`
        : t('covers.position_slider_label', this.hass)}
      @click=${(e: MouseEvent) => this._onPosClick(e, id, axis)}
      @pointerdown=${(e: PointerEvent) => this._onPosPointerDown(e, id, axis)}
      @pointermove=${(e: PointerEvent) => this._onPosPointerMove(e, id, axis)}
      @pointerup=${this._onPosPointerEnd}
      @pointercancel=${this._onPosPointerEnd}
      @keydown=${(e: KeyboardEvent) => this._onPosKeydown(e, id, shownFill, axis)}
    >
      <div class="pos-bar" ${tooltip(tip)}>
        <div class="pos-fill" style=${`width:${shownFill}%`}></div>
        ${targetFill !== null
          ? html`<div
              class="pos-marker"
              style=${`left:clamp(1px, ${targetFill}%, calc(100% - 1px))`}
            ></div>`
          : nothing}
      </div>
      ${dragging
        ? html`<div
            class="pos-readout"
            style=${`left:clamp(16px, ${shownFill}%, calc(100% - 16px))`}
          >
            ${formatPercent(shown)}
          </div>`
        : nothing}
    </div>`;
  }

  /** Glyph for one rail on a multi-cover tile, resolved through the same chain
   *  as the tile's own icon: the cover entity's explicit `icon` wins, then its
   *  `device_class`, then the entry's `cover_type`. The card has no way to know
   *  which rail of a day/night shade is the bottom one and which the middle —
   *  that distinction lives only in the entity names — so set an `icon` on the
   *  rail entities in HA to tell them apart at a glance. */
  private _railIcon(id: string, discovered: DiscoveredEntities, live: number | null): string {
    const st = this.hass.states[id];
    return coverStateIcon({
      explicitIcon: st?.attributes?.icon as string | undefined,
      deviceClass: st?.attributes?.device_class as string | undefined,
      coverType: discovered.cover_type,
      position: live,
    });
  }

  /** Rail label for a multi-cover tile: the cover's friendly name with the
   *  entry title stripped off the front, so two rails of one shade read
   *  "Bottom" / "Middle" rather than repeating the shade's name twice. */
  private _coverShortName(id: string, discovered: DiscoveredEntities): string {
    const full = (this.hass.states[id]?.attributes?.friendly_name as string | undefined) ?? id;
    const prefix = discovered.entry_title;
    if (prefix && full.toLowerCase().startsWith(prefix.toLowerCase())) {
      const rest = full.slice(prefix.length).replace(/^[\s\-–—:]+/, '');
      if (rest) return rest;
    }
    return full;
  }

  /** Percent along the position slider from a pointer's clientX. */
  private _posPctFromEvent(e: { clientX: number }, el: HTMLElement): number {
    const rect = el.getBoundingClientRect();
    const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    return Math.max(0, Math.min(100, pct));
  }

  /* The tile body is itself a tap target that opens the more-info dialog, so
     every slider gesture stops propagation, exactly as `.controls` does. No
     `preventDefault()` on pointerdown: that would also suppress the trailing
     compatibility `click` the commit rides on. */
  /* `_posDrag.pct` is stored in the LOGICAL frame, like every other value the
     card holds — `axisDisplayValue` converts the rail fraction back on the way
     in, so the drag preview, the readout and the eventual service call are all
     the same number and no caller has to remember which frame it is holding. */
  private _onPosPointerDown = (e: PointerEvent, id: string, axis: ResolvedAxis): void => {
    e.stopPropagation();
    const el = e.currentTarget as HTMLElement;
    (el as HTMLElement & { setPointerCapture?: (id: number) => void }).setPointerCapture?.(
      e.pointerId,
    );
    this._posDrag = { id, pct: axisDisplayValue(this._posPctFromEvent(e, el), axis) };
  };

  private _onPosPointerMove = (e: PointerEvent, id: string, axis: ResolvedAxis): void => {
    if (this._posDrag?.id !== id) return;
    e.stopPropagation();
    this._posDrag = {
      id,
      pct: axisDisplayValue(this._posPctFromEvent(e, e.currentTarget as HTMLElement), axis),
    };
  };

  /** Ends the gesture without writing: on pointerup the trailing `click`
   *  commits, on pointercancel nothing is sent at all. */
  private _onPosPointerEnd = (e: PointerEvent): void => {
    e.stopPropagation();
    this._posDrag = null;
  };

  private _onPosClick(e: MouseEvent, cover: string | undefined, axis: ResolvedAxis): void {
    e.stopPropagation();
    this._setCoverPosition(
      cover,
      axisDisplayValue(this._posPctFromEvent(e, e.currentTarget as HTMLElement), axis),
    );
  }

  /** Standard WAI-ARIA slider keys: arrows ±1, Page ±10, Home/End to the ends.
   *  `current` and `next` are rail fractions, matching `aria-valuenow`, so the
   *  arrow keys always move the fill the way they point; the step is converted
   *  back to a logical value at the write. */
  private _onPosKeydown(
    e: KeyboardEvent,
    cover: string | undefined,
    current: number,
    axis: ResolvedAxis,
  ): void {
    let next: number;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = current + 1;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = current - 1;
        break;
      case 'PageUp':
        next = current + 10;
        break;
      case 'PageDown':
        next = current - 10;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = 100;
        break;
      default:
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    this._setCoverPosition(cover, axisDisplayValue(Math.max(0, Math.min(100, next)), axis));
  }

  private _stopCover(cover: string | undefined): void {
    if (!cover) return;
    this.hass.callService(INTEGRATION_DOMAIN, 'stop', {}, { entity_id: cover });
  }

  /** Move a single axis. Routes through {@link setAxes} (combined `set_axes`
   *  when available, legacy per-axis service otherwise). Omits `force` so the
   *  service default preserves today's override semantics. */
  private _setAxis(cover: string | undefined, axisId: string, value: number): void {
    if (!cover) return;
    setAxes(this.hass, cover, { [axisId]: value });
  }

  /** Solar target for an axis from its target sensor's state, else null. */
  private _axisTarget(discovered: DiscoveredEntities, axis: ResolvedAxis): number | null {
    const role = axis.targetRole;
    if (!role) return null;
    const id = discovered.entities[role];
    if (!id) return null;
    const v = parseFloat(this.hass.states[id]?.state ?? '');
    return Number.isNaN(v) ? null : v;
  }

  /** Live value for a secondary axis from the cover's per-axis state attribute,
   *  normalized to the logical frame (issue #236). */
  private _liveAxis(cover: string | undefined, axis: ResolvedAxis): number | null {
    return logicalAxisValue(this.hass, axis, cover);
  }

  /** Display label for an axis: card i18n key wins for known ids, else the
   *  discovery label. */
  private _axisLabel(axis: ResolvedAxis): string {
    const key = AXIS_LABEL_I18N_KEYS[axis.id];
    return key ? t(key, this.hass) : axis.label;
  }

  private _resume(discovered: DiscoveredEntities): void {
    const btn = discovered.entities.reset_override_button;
    if (!btn) return;
    this.hass.callService('button', 'press', { entity_id: btn });
  }

  private _holdTimer: ReturnType<typeof setTimeout> | null = null;
  private _pendingTapTimer: ReturnType<typeof setTimeout> | null = null;
  private _holdFired = false;

  private _onPointerDown = (): void => {
    this._holdFired = false;
    if (this._holdTimer != null) clearTimeout(this._holdTimer);
    if (!hasAction(this._config?.hold_action)) return;
    this._holdTimer = setTimeout(() => {
      this._holdFired = true;
      this._holdTimer = null;
      this._fireAction('hold');
    }, HOLD_DURATION_MS);
  };

  private _onPointerUp = (): void => {
    if (this._holdTimer != null) {
      clearTimeout(this._holdTimer);
      this._holdTimer = null;
    }
  };

  private _onPointerCancel = (): void => {
    if (this._holdTimer != null) {
      clearTimeout(this._holdTimer);
      this._holdTimer = null;
    }
  };

  private _onClick = (): void => {
    if (this._holdFired) {
      this._holdFired = false;
      return;
    }
    const hasDouble = hasAction(this._config?.double_tap_action);
    if (!hasDouble) {
      this._fireAction('tap');
      return;
    }
    if (this._pendingTapTimer != null) {
      clearTimeout(this._pendingTapTimer);
      this._pendingTapTimer = null;
      this._fireAction('double_tap');
      return;
    }
    this._pendingTapTimer = setTimeout(() => {
      this._pendingTapTimer = null;
      this._fireAction('tap');
    }, DOUBLE_TAP_WINDOW_MS);
  };

  private _tapActionConfig(): ActionConfig | undefined {
    const ta = this._config?.tap_action;
    if (typeof ta === 'string') return undefined; // setConfig normalizes, but be safe
    return ta;
  }

  private _isFullyInert(cfg: AdaptiveCoverProTileCardConfig): boolean {
    const tap = this._tapActionConfig();
    const isNone = (a?: ActionConfig): boolean => !!a && a.action === 'none';
    // tap_action undefined means "default = open ACP dialog" → not inert.
    if (!isNone(tap)) return false;
    if (hasAction(cfg.hold_action)) return false;
    if (hasAction(cfg.double_tap_action)) return false;
    return true;
  }

  private _fireAction(action: 'tap' | 'hold' | 'double_tap'): void {
    if (!this._config || !this.hass) return;
    const tap = this._tapActionConfig();
    if (action === 'tap' && tap === undefined) {
      // Preserve the original default: open the ACP more-info dialog.
      this._dialogOpen = true;
      this.dispatchEvent(new CustomEvent('acp-tile-tap', { bubbles: true, composed: true }));
      return;
    }
    handleAction(
      this,
      this.hass,
      {
        entity: this._actionEntity(),
        tap_action: tap,
        hold_action: this._config.hold_action,
        double_tap_action: this._config.double_tap_action,
      },
      action,
    );
  }

  /** True when the glyph carries its own tap action, which is also what turns
   *  on the tinted pill behind it (HA gates that background on the icon being
   *  interactive — see `icon_tap_action` in types.ts). Unset means `none`, so
   *  an upgraded tile looks exactly as it did before. */
  private _hasIconAction(): boolean {
    return hasAction(this._config?.icon_tap_action);
  }

  /** Runs the icon's own action. Stops propagation so the glyph never also
   *  triggers the tile body's tap — they are independent targets, as in HA. */
  private _onIconClick = (e: Event): void => {
    if (!this._hasIconAction()) return;
    e.stopPropagation();
    if (!this._config || !this.hass) return;
    handleAction(
      this,
      this.hass,
      { entity: this._actionEntity(), tap_action: this._config.icon_tap_action },
      'tap',
    );
  };

  private _onIconKeydown = (e: KeyboardEvent): void => {
    if (!this._hasIconAction()) return;
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    this._onIconClick(e);
  };

  /** Entity a configured tap/hold/double-tap action targets. A cover entry uses
   *  its resolved cover; a Cover Group has none — `managed_covers` holds its
   *  members, so that would aim a `more-info` at one arbitrary member. Use the
   *  group's own aggregate cover when the integration exposes it, else the
   *  always-present group position sensor. */
  private _actionEntity(): string | undefined {
    const discovered = this._discovered;
    if (!discovered?.is_group) return this._resolvedCoverFromState();
    return discovered.entities.group_cover ?? discovered.entities.group_position_sensor;
  }

  private _resolvedCoverFromState(): string | undefined {
    if (this._config?.cover) return this._config.cover;
    if (this._registry === null) return undefined;
    const discovered =
      this._discovered ??
      this._memo(
        this.hass,
        { type: this._config!.type, entry_id: this._config!.entry_id },
        this._registry,
      );
    return discovered?.managed_covers[0];
  }

  private _stop(e: Event): void {
    e.stopPropagation();
  }

  public static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    ha-card {
      padding: 6px 10px;
      overflow: hidden;
      height: 100%;
      box-sizing: border-box;
      /* Center the tile body vertically so a taller-than-default grid cell
         (Sections drag-resize) keeps the content centered rather than top-aligned. */
      display: flex;
      flex-direction: column;
      justify-content: center;
      /* In HA's "Sections" view the tile width is driven by the dashboard
         column, not the viewport, so @media can't see the squeeze. Make the
         card a query container (issue #136) so the detailed layout can reflow
         its controls onto their own row once the column gets narrow. */
      container-type: inline-size;
    }
    .tile-body {
      display: grid;
      /* Position column is fixed-width so the controls land at the same x
         across stacked tiles regardless of the digit count (87% vs 100%). */
      grid-template-columns: 24px minmax(0, 1fr) 3rem auto auto;
      grid-template-areas: 'icon label position controls badge';
      align-items: center;
      column-gap: 8px;
      row-gap: 2px;
      cursor: pointer;
      user-select: none;
      min-width: 0;
    }
    /* When the state label is rendered ("Open · 12%") the position cell needs
       to grow to fit variable-width text. Strict tile-to-tile alignment of the
       ▲ ■ ▼ controls is impossible once the label is variable, so we let
       the cell auto-size. */
    .tile-body.has-state-label {
      grid-template-columns: 24px minmax(0, 1fr) auto auto auto;
    }
    /* Detailed layout matches HA's native tile card: a tinted icon shape, a
       name-over-state label column, and inline control buttons on the right —
       all on one row. ACP's own chrome (Auto / winner / floor badges) and the
       position bar share a second row (.chrome-line): badges left, bar right.
       The icon spans both rows so it stays vertically centered (issue #208). */
    .tile-body.detailed {
      grid-template-columns: 36px minmax(0, 1fr) auto;
      grid-template-rows: auto;
      grid-template-areas: 'icon label controls';
      align-items: center;
      /* HA's ha-tile-container .content uses a 10px gap and a 56px row floor. */
      column-gap: 10px;
      min-height: var(--row-height, 56px);
      /* Tight row gap pulls the chrome row (badges + position bar) up snug under
         the name/state so the tile stays as short as possible when badges are
         present (issue #208). */
      row-gap: 2px;
    }
    /* HA's inline features block is a hard 50% of the card, not a content-sized
       or equal-share column — see the .controls rule below. The 12px subtrahend
       is its --ha-space-3 inline-end padding. Gated on .has-controls: with
       show_controls false the track is empty, and a 50% track would reserve half
       the tile for nothing where the auto above collapses to zero. */
    .tile-body.detailed.has-controls {
      grid-template-columns: 36px minmax(0, 1fr) calc(50% - 12px);
    }
    /* Row 2 = the chrome row: Auto/winner/floor badges on the left, position bar
       right-aligned. The icon spans both rows (grid-area repeated) so it stays
       vertically centered in the tile rather than pinned to the name row
       (issue #208). */
    .tile-body.detailed.has-chrome-row {
      grid-template-rows: auto auto;
      grid-template-areas:
        'icon label  controls'
        'icon chrome chrome';
    }
    /* Row 2 (or 3) = the venetian tilt slider, indented under label; icon still
       spans every row so it stays centered. */
    .tile-body.detailed.has-tilt {
      grid-template-rows: auto auto;
      grid-template-areas:
        'icon label controls'
        'icon tilt  tilt';
    }
    .tile-body.detailed.has-chrome-row.has-tilt {
      grid-template-rows: auto auto auto;
      grid-template-areas:
        'icon label  controls'
        'icon chrome chrome'
        'icon tilt   tilt';
    }
    /* Bar-only (position bar, no badges) gets NO grid special-case: it uses the
       same .has-chrome-row grid as a badged tile, so the bar spans label+controls
       at full tile width and the name/state sit in row 1. The old special-case
       confined the bar to the label column and spanned .label across both rows to
       keep it centered (issue #208) — but a centered label and a bottom-aligned
       bar then shared one cell and overlapped (issue #260), and the confined bar
       read as a different component from the badged tile's full-width one. A
       bar-only tile is now a badged tile minus the badges. */
    /* Name over state, vertically centered against the icon (HA ha-tile-info).
       No gap: HA's .info stacks the two lines with no gap and lets the primary
       line-height (normal, 1.6) do the spacing. */
    .tile-body.detailed .label {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    /* Match HA's ha-tile-info text through the same theme tokens the native
       tile card uses, so ACP inherits any theme font-scaling/recoloring
       instead of drifting with hardcoded values. Fallbacks are HA's own
       defaults: name 14px/500 at line-height normal with 0.1px tracking, state
       12px/400 at condensed with 0.4px. Note the primary and secondary lines
       use DIFFERENT line-heights upstream — normal for the name, condensed for
       the state. */
    .tile-body.detailed .title {
      font-size: var(--ha-font-size-m, 0.875rem);
      font-weight: var(--ha-font-weight-medium, 500);
      line-height: var(--ha-line-height-normal, 1.6);
      letter-spacing: 0.1px;
      color: var(--primary-text-color);
    }
    .tile-body.detailed .state {
      font-size: var(--ha-font-size-s, 0.75rem);
      font-weight: var(--ha-font-weight-normal, 400);
      line-height: var(--ha-line-height-condensed, 1.2);
      letter-spacing: 0.4px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }
    /* Chrome row: Auto/winner/floor badges (left) and the position bar (right)
       share one row under the name/state. Kept on a single line (nowrap): the
       badges hold their size and the position bar shrinks to absorb the squeeze,
       so badges never spill onto a second row before the bar has given up its
       width (issue #208). */
    .chrome-line {
      grid-area: chrome;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      gap: 6px;
      min-width: 0;
      /* Rail geometry, shared by the lone rail and the multi-cover stack so the
         two stay the same length — see the .pos-stack note (issue #260). The
         glyph lane is the per-rail glyph plus the .pos-row gap that separates it
         from the rail. */
      --acp-rail-basis: 170px;
      --acp-rail-max: 55%;
      --acp-rail-glyph-size: 15px;
      --acp-rail-glyph-gap: 6px;
      --acp-rail-glyph-lane: calc(var(--acp-rail-glyph-size) + var(--acp-rail-glyph-gap));
      /* Reserve the badge pill's height even when no badge is present, so a
         bar-only tile is the same height as one with badges — the position bar
         just centers in the reserved space (issue #208). Matches the tile-badge
         height (0.75rem × 1.4 line + 2px×2 padding ≈ 22px). */
      min-height: 22px;
    }
    /* Badges hold their intrinsic width so the bar (not the badges) absorbs any
       shortage of room on the single chrome line. */
    .chrome-line acp-tile-badge {
      overflow: visible;
      flex: 0 0 auto;
    }
    .chrome-line .acp-floor-chip {
      flex: 0 0 auto;
    }
    /* Target-vs-actual mini bar: right-aligned (margin-left:auto) so it fills the
       otherwise-empty space beneath the ↑■↓ buttons. Fill = live openness in the
       state color; the tick marks the auto/solar target. */
    /* Interactive wrapper: carries the flex sizing the rail used to own, so the
       visible 6px rail below is unchanged while the gesture target is bigger. */
    .chrome-line .pos-slider {
      margin-left: auto;
      align-self: center;
      position: relative;
      flex: 0 1 var(--acp-rail-basis);
      max-width: var(--acp-rail-max);
      cursor: pointer;
      /* A touch-drag must move the fill, not scroll the dashboard. */
      touch-action: none;
    }
    /* The rail is 6px tall — too thin to grab on a phone. Widen the hit area
       vertically with an invisible absolute box, which adds no layout height. */
    .chrome-line .pos-slider::before {
      content: '';
      position: absolute;
      inset: -8px 0;
    }
    /* Multi-cover entry: the rails stack in the slot the single rail occupies,
       each labelled with its cover's glyph. The stack owns the flex sizing so
       each rail below it can size itself to the full stack width.

       It is WIDER than a lone rail by exactly the glyph lane, so the glyphs hang
       to the left of the rail track instead of shortening the rails. Both are
       margin-left:auto, so the right edges meet and — the lane cancelling out on
       the left — a stacked rail and a lone rail are the same length and start at
       the same x (issue #260). Derive, never hardcode: the lane is the glyph's
       own width plus the .pos-row gap. */
    .chrome-line .pos-stack {
      margin-left: auto;
      align-self: center;
      flex: 0 1 calc(var(--acp-rail-basis) + var(--acp-rail-glyph-lane));
      max-width: calc(var(--acp-rail-max) + var(--acp-rail-glyph-lane));
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .chrome-line .pos-stack .pos-row {
      display: flex;
      align-items: center;
      gap: var(--acp-rail-glyph-gap);
      min-width: 0;
    }
    /* Layers of ONE cover vs. separate covers. A day/night shade's two rails and
       a blind entry with three windows attached both render as a rail stack, and
       until now looked identical — same glyph, same spacing, same everything.

       Layered rails get a BRACE: a hairline down the glyph lane's gap, tying the
       rails into one object. Separate covers keep today's rendering untouched,
       so the common path has nothing to regress.

       The brace is absolutely positioned, so it costs no layout width — but the
       6px gap is too tight to sit a line in with air either side, so the layered
       stack widens its gap. That widens the derived glyph lane, which moves the
       stack's LEFT edge out; the rails keep their length and their right edge,
       which is the invariant issue #260 established. */
    .chrome-line .pos-stack.layered {
      --acp-rail-glyph-gap: 10px;
      /* Re-declare the lane HERE, not just the gap. A custom property is
         substituted at computed-value time on the element that DECLARES it, so
         the lane inherited from .chrome-line is already frozen at the 6px gap —
         overriding the gap alone would leave the flex basis 4px short and the
         rails 4px stubbier than a lone rail. Redeclaring recomputes it against
         the local gap, which is the whole point of deriving it. */
      --acp-rail-glyph-lane: calc(var(--acp-rail-glyph-size) + var(--acp-rail-glyph-gap));
      position: relative;
      gap: 2px;
    }
    .chrome-line .pos-stack.layered::before {
      content: '';
      position: absolute;
      /* Centered in the gap between the glyph column and the rails. */
      left: calc(var(--acp-rail-glyph-size) + (var(--acp-rail-glyph-gap) / 2) - 1px);
      width: 2px;
      /* Span rail-center to rail-center rather than the full box, so the brace
         reads as joining the rails instead of boxing the stack. A row is the
         glyph's height, so half of one is the inset at each end. */
      top: calc(var(--acp-rail-glyph-size) / 2);
      bottom: calc(var(--acp-rail-glyph-size) / 2);
      border-radius: 1px;
      background: var(--secondary-text-color);
      opacity: 0.45;
    }
    /* Per-rail glyph in place of a name: two rails of one shade have long,
       near-identical names that ate the rail's width.

       ha-icon defaults to inline-flex and inherits the tile's line-height, so
       its glyph sits low inside its own box even though the row centers that
       box. Making it a zero-line-height flex box centers the glyph on the rail
       rather than on a text baseline the rail knows nothing about. */
    .chrome-line .pos-stack .pos-glyph {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      align-self: center;
      line-height: 0;
      --mdc-icon-size: var(--acp-rail-glyph-size);
      width: var(--acp-rail-glyph-size);
      height: var(--acp-rail-glyph-size);
      color: var(--secondary-text-color);
    }
    .chrome-line .pos-stack .pos-slider {
      margin-left: 0;
      flex: 1 1 auto;
      max-width: none;
    }
    /* Rails sit tight in the stack, so the ±8px grab boxes would overlap and
       the upper rail would swallow the lower rail's top half. */
    .chrome-line .pos-stack .pos-slider::before {
      inset: -2px 0;
    }
    .chrome-line .pos-slider:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
      border-radius: 6px;
    }
    /* The 0.3s ease below smooths server-driven updates; mid-drag it would read
       as the fill lagging behind the finger. */
    .chrome-line .pos-slider.dragging .pos-fill {
      transition: none;
    }
    /* Live percentage while a drag is in flight. The hover tooltip carries the
       same number, but a tooltip is mouse-only — on a phone, the finger setting
       the position is also the thing covering the rail, so without this the user
       is dragging blind. Sits in .pos-slider, NOT .pos-bar: the bar is
       overflow:hidden to clip the fill, which would clip this too. Pointer-events
       off so it never eats the drag it is reporting on. */
    .chrome-line .pos-readout {
      position: absolute;
      bottom: calc(100% + 6px);
      transform: translateX(-50%);
      padding: 1px 5px;
      border-radius: 4px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.9));
      color: var(--primary-text-color);
      font-size: var(--ha-font-size-s, 0.75rem);
      line-height: var(--ha-line-height-condensed, 1.2);
      white-space: nowrap;
      pointer-events: none;
      z-index: 2;
    }
    .chrome-line .pos-bar {
      position: relative;
      width: 100%;
      height: 6px;
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      overflow: hidden;
    }
    .chrome-line .pos-fill {
      position: absolute;
      inset: 0 auto 0 0;
      /* One constant color for every rail, never the cover's state color: a rail
         that changed hue as it crossed open/closed read as a status light rather
         than a measurement, and on a multi-rail tile the rails disagreed with
         each other. The icon still carries state color (the state_color option),
         which is where that signal belongs. Overridable per-theme via
         --acp-pos-fill-color. */
      background: var(--acp-pos-fill-color, ${unsafeCSS(COVER_ACTIVE_COLOR)});
      opacity: 0.55;
      border-radius: 6px;
      transition: width 0.3s ease;
    }
    .chrome-line .pos-marker {
      position: absolute;
      top: 0;
      width: 2px;
      height: 100%;
      background: var(--accent-color, #ff9800);
      transform: translateX(-50%);
      transition: left 0.3s ease;
    }
    .tilt-line {
      grid-area: tilt;
      min-width: 0;
      margin-top: 2px;
      cursor: default;
    }
    /* Optional decision summary stacks as a dim third line under the state. */
    .tile-body.detailed .label .summary {
      font-size: 0.72rem;
    }
    /* Mirror HA's tile card in features_position: inline mode, whose spec
       differs from the bottom feature row. ha-tile-container's
       .container.horizontal rule for the features slot sets
       --feature-height: var(--ha-space-9) — 36px, not the 42px of a bottom row —
       and pins the block to calc(50% - gap/2 - var(--ha-space-3)). Inside it,
       card-feature-styles maps --feature-height onto
       --control-button-group-thickness and --feature-border-radius
       (--ha-border-radius-lg = 12px) onto --control-button-border-radius, while
       ha-control-button contributes a 20px glyph and a --disabled-color fill at
       20% opacity. Buttons are flex: 1 inside that block, so they widen with the
       tile exactly as HA's do. */
    .tile-body.detailed .controls {
      align-self: center;
      /* --feature-button-spacing */
      gap: 12px;
      width: 100%;
    }
    .tile-body.detailed .controls button {
      flex: 1 1 0;
      width: auto;
      height: var(--control-button-group-thickness, 36px);
      border-radius: var(--control-button-border-radius, 12px);
      border: none;
      background: color-mix(
        in srgb,
        var(--control-button-background-color, var(--disabled-color, #7f7f7f)) 20%,
        transparent
      );
    }
    .tile-body.detailed .controls button ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-text-color);
    }
    .tile-body.detailed .controls button:hover {
      background: color-mix(
        in srgb,
        var(--control-button-background-color, var(--disabled-color, #7f7f7f)) 32%,
        transparent
      );
    }
    /* Bare 36px glyph by default — the state color carries the cover's status
       with nothing behind it. HA does the same for covers, though by a
       different route: its shape is drawn only when the icon is interactive,
       and getEntityDefaultTileIconAction returns none for the cover domain.
       Setting icon_tap_action opts into the shape via .background below. */
    .tile-body.detailed .cover-icon-wrap {
      place-self: center;
      width: 36px;
      height: 36px;
    }
    /* HA's ha-tile-icon shape: a pill at --ha-border-radius-pill filled with the
       icon's own color at 0.2 opacity (0.35 on hover), painted as a ::before so
       the tint never dims the glyph on top of it. --acp-tile-icon-color is set
       inline from coverStateColor, so shape and glyph always agree. */
    /* Scoped to .detailed: the one-line layout's glyph box is 24px around a 22px
       icon, so a pill there would be a hairline of tint around the glyph. The
       tap action still works in one-line — only the shape is detailed-only. */
    .tile-body.detailed .cover-icon-wrap.background {
      position: relative;
      border-radius: var(--ha-border-radius-pill, 9999px);
      overflow: hidden;
      cursor: pointer;
    }
    .tile-body.detailed .cover-icon-wrap.background::before {
      content: '';
      position: absolute;
      inset: 0;
      background-color: var(--acp-tile-icon-color, var(--disabled-color, #7f7f7f));
      opacity: 0.2;
      transition: opacity 180ms ease-in-out;
    }
    .tile-body.detailed .cover-icon-wrap.background:hover::before {
      opacity: 0.35;
    }
    .cover-icon-wrap.background:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px var(--acp-tile-icon-color, var(--primary-text-color));
      border-radius: var(--ha-border-radius-pill, 9999px);
    }
    /* The glyph must sit above the ::before wash. */
    .tile-body.detailed .cover-icon-wrap.background .cover-icon {
      position: relative;
    }
    .tile-body.detailed .cover-icon {
      --mdc-icon-size: 24px;
    }
    .tile-body[role='group'] {
      cursor: default;
    }
    /* Offline/unresponsive cover (issue #212): dim the whole tile so it reads
       as unavailable at a glance, matching HA's own unavailable-entity dimming. */
    .tile-body.unavailable {
      opacity: 0.5;
    }
    .cover-icon-wrap {
      grid-area: icon;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }
    .cover-icon {
      --mdc-icon-size: 22px;
      color: var(--primary-text-color);
    }
    .motion-overlay {
      position: absolute;
      top: -4px;
      right: -6px;
      --mdc-icon-size: 12px;
      color: var(--warning-color, #f1c232);
      background: var(--card-background-color, white);
      border-radius: 50%;
      padding: 1px;
      line-height: 0;
    }
    /* Sibling of .motion-overlay, pinned to the opposite corner so a cover that
       is both occupied and low on battery shows both without them colliding —
       motion top-right, battery bottom-left. */
    .battery-overlay {
      position: absolute;
      bottom: -4px;
      left: -6px;
      --mdc-icon-size: 12px;
      color: var(--error-color, #db4437);
      background: var(--card-background-color, white);
      border-radius: 50%;
      padding: 1px;
      line-height: 0;
    }
    .label {
      grid-area: label;
      min-width: 0;
    }
    .title {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .summary {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }
    .position {
      grid-area: position;
      font-size: 0.85rem;
      font-variant-numeric: tabular-nums;
      color: var(--primary-text-color);
      padding: 0 4px;
      /* Right-align the digits so the % sign sits flush against the controls
         column edge — combined with the fixed-width position grid column, this
         keeps the ▲ ■ ▼ row aligned across stacked tiles. */
      text-align: right;
    }
    .controls {
      grid-area: controls;
      display: inline-flex;
      gap: 2px;
    }
    .controls button {
      width: 26px;
      height: 26px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.8rem;
      line-height: 1;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .controls button ha-icon {
      --mdc-icon-size: 16px;
      color: var(--primary-text-color);
      line-height: 0;
    }
    .controls button:hover {
      background: var(--secondary-background-color);
    }
    .controls button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    acp-tile-badge {
      grid-area: badge;
      min-width: 0;
      overflow: hidden;
    }
    .acp-floor-chip {
      grid-area: floor-chip;
      font-size: 0.7rem;
      padding: 1px 6px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--acp-floor-accent) ${ACCENT_BG_ALPHA}%, transparent);
      /* The custom-position purple resolved AGAINST THE THEME'S OWN TEXT COLOR
         rather than pinned to a literal. The literal it replaces (#6a1b9a) is a
         dark purple chosen for a light background; on HA's dark theme it landed
         at 1.6:1 filled and 1.3:1 hollow — the chip was legible only if you knew
         what it said. Mixing with --primary-text-color leans the same hue dark
         on a light theme and light on a dark one, so one declaration covers
         both, and it follows a custom theme rather than guessing from the OS
         the way prefers-color-scheme would.

         The ratios come from const.ts rather than being restated here. Written
         out by hand this chip used 60%, which reads as a deliberate emphasis
         and is not — it lands at 4.35:1 on HA dark, under the 4.5:1 floor the
         badges beside it clear at 40%. Importing the constants is what stops the
         chip and the badges from drifting apart again. */
      --acp-floor-accent: #9c27b0;
      color: color-mix(
        in srgb,
        var(--acp-floor-accent) ${FG_ACCENT_MIX}%,
        var(--primary-text-color, #212121)
      );
      /* Reserve the border so the outline (is-armed) state doesn't shift layout. */
      border: 1px solid transparent;
      white-space: nowrap;
      align-self: center;
    }
    /* Floating-tooltip cursor lifecycle for the tooltip carriers inside the
       tile (floor chip, title, inline summary, motion overlay). Help hint on
       hover, default once OUR bubble appears. */
    [data-tooltip]:hover {
      cursor: help;
    }
    [data-tooltip][acp-tt-shown] {
      cursor: default;
    }
    /* Clamping axis: not-clamping → hollow/outline (transparent fill + purple border). */
    .acp-floor-chip.is-armed {
      background: transparent;
      border-color: color-mix(in srgb, var(--acp-floor-accent) 60%, transparent);
    }
    /* Priority axis: bypassable (priority ≤ 80) → subdued.
       NOT opacity any more. Opacity multiplies into the TEXT as much as the
       chrome, and stacked on the hollow variant it was what took this chip to
       1.3:1 — a legibility cost paid to signal a secondary attribute. The
       priority axis already has a non-destructive carrier in font-weight (see
       .resists-manual), so bypassable states itself by NOT being emphasized,
       and softens its outline instead. Text contrast is untouched. */
    .acp-floor-chip.is-bypassable {
      font-weight: 400;
    }
    /* Scoped to the hollow variant on purpose: the filled one has a deliberately
       transparent border, and softening a border that isn't drawn would instead
       make one appear. */
    .acp-floor-chip.is-armed.is-bypassable {
      border-color: color-mix(in srgb, var(--acp-floor-accent) 35%, transparent);
    }
    /* Priority axis: resists manual ↓ (priority > 80) → emphasized. */
    .acp-floor-chip.resists-manual {
      font-weight: 600;
    }
    /* One-line layout: add a second row for the floor chip under the position cell */
    .tile-body.has-floor-chip {
      grid-template-rows: auto auto;
      grid-template-areas:
        'icon label     position  controls badge resume'
        'icon label     floor-chip .        .     .';
    }
    .tile-body.has-state-label.has-floor-chip {
      grid-template-rows: auto auto;
      grid-template-areas:
        'icon label     position  controls badge resume'
        'icon label     floor-chip .        .     .';
    }
    /* Reflow (issues #136, #154): drop the ↑■▼ controls onto their own
       full-width row beneath the name so the cover name gets the whole column,
       with the badge and tilt rows stacked between. The same reflow fires from
       two independent triggers, because "the tile is narrow" alone can't tell a
       phone from a medium tile in a multi-column desktop dashboard — both can be
       ~400px wide:

         1. #154 — a phone: the whole viewport is narrow (≤500px) AND the tile is
            near full-width (≤480px). Gated on the *viewport*, not the container
            alone, so a ~400px tile on a wide laptop screen keeps the inline
            layout and does not grow an extra control row (the bug from blanket
            @container 450px).
         2. #136 — a desktop "Sections" narrow column (≤340px): the tile width is
            column-driven on a wide viewport, so @media can't see the squeeze;
            the bare container query catches the genuinely-tiny column.

       The two blocks below are identical reflow declarations — keep them in
       sync. Each detailed grid variant is re-asserted (placed after the wide
       rules so it wins when a query matches — the grid rules rely on source
       order, not just specificity). */
    @media (max-width: 500px) {
      @container (max-width: 480px) {
        .tile-body.detailed {
          grid-template-columns: 36px minmax(0, 1fr);
          grid-template-areas:
            'icon label'
            'controls controls';
        }
        /* The 50% has-controls track is (0,3,0) and a query adds no specificity,
           so without this it would keep a third column alive here and strand the
           reflowed full-width controls row beside it. */
        .tile-body.detailed.has-controls {
          grid-template-columns: 36px minmax(0, 1fr);
        }
        .tile-body.detailed.has-chrome-row {
          grid-template-areas:
            'icon label'
            'icon chrome'
            'controls controls';
        }
        .tile-body.detailed.has-tilt {
          grid-template-areas:
            'icon label'
            'icon tilt'
            'controls controls';
        }
        .tile-body.detailed.has-chrome-row.has-tilt {
          grid-template-areas:
            'icon label'
            'icon chrome'
            'icon tilt'
            'controls controls';
        }
        /* No bar-only re-assertion needed: the wide layout no longer special-cases
           bar-only, so the .has-chrome-row reflow above already applies (#260). */
        .tile-body.detailed .controls {
          margin-top: 4px;
          gap: 8px;
          justify-content: space-between;
        }
        .tile-body.detailed .controls button {
          flex: 1 1 0;
          width: auto;
          height: var(--control-button-group-thickness, 36px);
        }
      }
    }
    @container (max-width: 340px) {
      .tile-body.detailed {
        grid-template-columns: 36px minmax(0, 1fr);
        grid-template-areas:
          'icon label'
          'controls controls';
      }
      /* Same re-assertion as the 480px block — see the note there. */
      .tile-body.detailed.has-controls {
        grid-template-columns: 36px minmax(0, 1fr);
      }
      .tile-body.detailed.has-chrome-row {
        grid-template-areas:
          'icon label'
          'icon chrome'
          'controls controls';
      }
      .tile-body.detailed.has-tilt {
        grid-template-areas:
          'icon label'
          'icon tilt'
          'controls controls';
      }
      .tile-body.detailed.has-chrome-row.has-tilt {
        grid-template-areas:
          'icon label'
          'icon chrome'
          'tilt tilt'
          'controls controls';
      }
      /* Same as the 480px block: no bar-only re-assertion needed (#260). */
      .tile-body.detailed .controls {
        margin-top: 4px;
        gap: 8px;
        justify-content: space-between;
      }
      .tile-body.detailed .controls button {
        flex: 1 1 0;
        width: auto;
        height: var(--control-button-group-thickness, 36px);
      }
    }
    .empty {
      padding: 12px;
      text-align: center;
    }
    .dim {
      color: var(--secondary-text-color);
      margin: 0;
    }
  `;
}

declare global {
  interface Window {
    customCards: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
      getEntitySuggestion?: (
        hass: HomeAssistant,
        entityId: string,
      ) => { label?: string; config: unknown } | null;
    }>;
  }
}

window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === TILE_CARD_NAME)) {
  window.customCards.push({
    type: TILE_CARD_NAME,
    name: 'Adaptive Cover Pro — Tile',
    description:
      'Compact chip-style tile for one Adaptive Cover Pro instance: icon, name, position, ↑■↓, contextual badge.',
    preview: true,
    documentationURL: 'https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card',
    getEntitySuggestion: makeEntitySuggestion(`custom:${TILE_CARD_NAME}`, 'entry_id'),
  });
}
