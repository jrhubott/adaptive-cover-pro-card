import { LitElement, html, css, nothing, type TemplateResult, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  handleAction,
  hasAction,
  type ActionConfig,
  type HomeAssistant,
} from 'custom-card-helpers';

import {
  HANDLER_I18N_KEYS,
  INTEGRATION_DOMAIN,
  TILE_CARD_NAME,
  TILE_CARD_EDITOR_NAME,
  COVER_ICON_FALLBACK_UNAVAILABLE,
} from './const';
import { createDiscoveryMemo } from './lib/entity-discovery';
import { resolveTileName, isValidAcpName } from './lib/name-parts';
import { makeEntitySuggestion } from './lib/entity-suggestion';
import { resolveAxes, type ResolvedAxis } from './lib/axes';
import { setAxes, engageManualOverride, hasEngageManualOverride } from './lib/services';
import { buildOverridePresets } from './lib/override-presets';
import './components/extend-override-dialog';
import { AXIS_LABEL_I18N_KEYS } from './const';
import { entityStateChanged } from './lib/hass-change';
import { fetchAcpConfigEntries } from './lib/config-entries';
import { coverStateIcon, coverStateColor, coverOpenIcon, coverCloseIcon } from './lib/icons';
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
import { coverHeldPosition, logicalAxisValue, logicalCoverPosition } from './lib/cover-position';
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
  @state() private _posDrag: number | null = null;
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
            @acp-open-more-info=${this._onClick}
          ></acp-group-tile>
        </ha-card>
        <acp-group-dialog
          .hass=${this.hass}
          .discovered=${discovered}
          .open=${this._dialogOpen}
          .name=${groupTitle}
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
    const title = resolveTileName(cfg.name, discovered);
    const cover = this._resolvedCover(discovered);
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
    const secondaryAxis = resolveAxes(discovered).find((a) => a.id !== 'position');
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
    // When the cover reports its position, disable the control that can't do
    // anything: open (↑) at fully-open, close (↓) at fully-closed. Covers that
    // don't report a position leave both enabled (gate stays on `!cover`).
    const atOpen = reportedPosition !== null && reportedPosition >= 100;
    const atClosed = reportedPosition !== null && reportedPosition <= 0;
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
    const showPositionBar = detailed && cfg.show_position_bar !== false && livePosition !== null;
    // A drag in flight overrides the server-truth fill and readout. Post-#234
    // `livePosition` is logical-frame and `set_axes` takes logical values, so
    // the percentage you drag to is exactly the one that gets sent.
    const posDragging = this._posDrag !== null;
    const shownPosition = this._posDrag ?? livePosition;
    const posBarTooltip = showPositionBar
      ? calculatedPosition !== null
        ? `${formatPercent(shownPosition)} · ${t('dialog.target', this.hass)} ${formatPercent(calculatedPosition)}`
        : formatPercent(shownPosition)
      : '';
    const posBarTpl = showPositionBar
      ? html`<div
          class="pos-slider${posDragging ? ' dragging' : ''}"
          role="slider"
          tabindex="0"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${shownPosition ?? 0}
          aria-valuetext=${formatPercent(shownPosition)}
          aria-label=${t('covers.position_slider_label', this.hass)}
          @click=${(e: MouseEvent) => this._onPosClick(e, cover)}
          @pointerdown=${this._onPosPointerDown}
          @pointermove=${this._onPosPointerMove}
          @pointerup=${this._onPosPointerEnd}
          @pointercancel=${this._onPosPointerEnd}
          @keydown=${(e: KeyboardEvent) => this._onPosKeydown(e, cover, livePosition ?? 0)}
        >
          <div class="pos-bar" ${tooltip(posBarTooltip)}>
            <div
              class="pos-fill"
              style=${`width:${shownPosition}%${iconColor ? `;background:${iconColor}` : ''}`}
            ></div>
            ${calculatedPosition !== null
              ? html`<div
                  class="pos-marker"
                  style=${`left:clamp(1px, ${calculatedPosition}%, calc(100% - 1px))`}
                ></div>`
              : nothing}
          </div>
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
    // Bar-only: the chrome row carries just the position bar (no badges). Center
    // the name/state across the reserved row height and let the bar hug the
    // bottom, instead of pinning the label to the top (issue #208).
    const barOnly = hasChromeRow && !hasDetailBadges;

    return html`
      <div
        class=${`tile-body${detailed ? ' detailed' : ''}${hasStateLabel ? ' has-state-label' : ''}${showFloorChip && !detailed ? ' has-floor-chip' : ''}${showTilt && detailed ? ' has-tilt' : ''}${hasChromeRow ? ' has-chrome-row' : ''}${barOnly ? ' bar-only' : ''}${offline ? ' unavailable' : ''}`}
        role=${inert ? 'group' : 'button'}
        tabindex=${inert ? -1 : 0}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @pointerleave=${this._onPointerCancel}
        @click=${this._onClick}
      >
        <div class="cover-icon-wrap">
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
                ?disabled=${!cover || offline || atOpen}
                @click=${() => this._setCoverPosition(cover, 100)}
              >
                <ha-icon icon=${coverOpenIcon(coverDeviceClass)}></ha-icon>
              </button>
              <button
                class="stop"
                type="button"
                aria-label=${t('tile.stop', this.hass)}
                ?disabled=${!cover || offline}
                @click=${() => this._stopCover(cover)}
              >
                <ha-icon icon="mdi:stop"></ha-icon>
              </button>
              <button
                class="down"
                type="button"
                aria-label=${t('tile.close', this.hass)}
                ?disabled=${!cover || offline || atClosed}
                @click=${() => this._setCoverPosition(cover, 0)}
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
  private _onPosPointerDown = (e: PointerEvent): void => {
    e.stopPropagation();
    const el = e.currentTarget as HTMLElement;
    (el as HTMLElement & { setPointerCapture?: (id: number) => void }).setPointerCapture?.(
      e.pointerId,
    );
    this._posDrag = this._posPctFromEvent(e, el);
  };

  private _onPosPointerMove = (e: PointerEvent): void => {
    if (this._posDrag === null) return;
    e.stopPropagation();
    this._posDrag = this._posPctFromEvent(e, e.currentTarget as HTMLElement);
  };

  /** Ends the gesture without writing: on pointerup the trailing `click`
   *  commits, on pointercancel nothing is sent at all. */
  private _onPosPointerEnd = (e: PointerEvent): void => {
    e.stopPropagation();
    this._posDrag = null;
  };

  private _onPosClick(e: MouseEvent, cover: string | undefined): void {
    e.stopPropagation();
    this._setCoverPosition(cover, this._posPctFromEvent(e, e.currentTarget as HTMLElement));
  }

  /** Standard WAI-ARIA slider keys: arrows ±1, Page ±10, Home/End to the ends. */
  private _onPosKeydown(e: KeyboardEvent, cover: string | undefined, current: number): void {
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
    this._setCoverPosition(cover, Math.max(0, Math.min(100, next)));
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
      column-gap: 12px;
      /* Tight row gap pulls the chrome row (badges + position bar) up snug under
         the name/state so the tile stays as short as possible when badges are
         present (issue #208). */
      row-gap: 2px;
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
    /* Bar-only (position bar, no badges): confine the bar to the label column so
       the controls can span both rows, then center the name/state across the
       full height with the bar hugging the bottom — so a bar-only tile centers
       its label instead of pinning it to the top (issue #208). Scoped to
       :not(.has-tilt): a tilt tile keeps its 3-row grid (label/chrome/tilt) and
       must NOT span the label across the bar + tilt rows, which would overlap
       them (the tilt grid wins on specificity, so the label span has to opt out
       explicitly here). */
    .tile-body.detailed.bar-only:not(.has-tilt) {
      grid-template-areas:
        'icon label  controls'
        'icon chrome controls';
    }
    .tile-body.detailed.bar-only:not(.has-tilt) .label {
      grid-row: 1 / -1;
      align-self: center;
    }
    .tile-body.detailed.bar-only:not(.has-tilt) .chrome-line {
      align-self: end;
    }
    /* Name over state, vertically centered against the icon (HA ha-tile-info). */
    .tile-body.detailed .label {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
    }
    /* Match HA's ha-tile-info text through the same theme tokens the native
       tile card uses, so ACP inherits any theme font-scaling/recoloring
       instead of drifting with hardcoded values. Fallbacks are HA's own
       defaults (name 14px/500, state 12px/400). */
    .tile-body.detailed .title {
      font-size: var(--ha-font-size-m, 0.875rem);
      font-weight: var(--ha-font-weight-medium, 500);
      line-height: var(--ha-line-height-condensed, 1.375);
      color: var(--primary-text-color);
    }
    .tile-body.detailed .state {
      font-size: var(--ha-font-size-s, 0.75rem);
      font-weight: var(--ha-font-weight-normal, 400);
      line-height: var(--ha-line-height-condensed, 1.375);
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
      flex: 0 1 170px;
      max-width: 55%;
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
      background: var(--primary-color);
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
    /* Link to HA's own ha-control-button tokens so height/radius/fill follow the
       native cover tile (and the theme) instead of hardcoded values. Fallbacks
       are HA defaults: 40px thickness, 12px radius, disabled-color @ 20% fill,
       24px glyph. Width is fixed (~56) since this inline row doesn't flex-fill
       like HA's full-width control-button-group. */
    .tile-body.detailed .controls {
      align-self: center;
      gap: 12px;
    }
    .tile-body.detailed .controls button {
      width: 56px;
      height: var(--control-button-group-thickness, 40px);
      border-radius: var(--control-button-border-radius, 12px);
      border: none;
      background: color-mix(
        in srgb,
        var(--control-button-background-color, var(--disabled-color, #7f7f7f)) 20%,
        transparent
      );
    }
    .tile-body.detailed .controls button ha-icon {
      --mdc-icon-size: 24px;
      color: var(--primary-text-color);
    }
    .tile-body.detailed .controls button:hover {
      background: color-mix(
        in srgb,
        var(--control-button-background-color, var(--disabled-color, #7f7f7f)) 32%,
        transparent
      );
    }
    /* Bare 36px glyph, no background shape — the state color carries the
       cover's status without a tinted square behind it. */
    .tile-body.detailed .cover-icon-wrap {
      place-self: center;
      width: 36px;
      height: 36px;
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
      background: rgba(156, 39, 176, 0.22);
      color: #6a1b9a;
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
      border-color: rgba(156, 39, 176, 0.5);
    }
    /* Priority axis: bypassable (priority ≤ 80) → subdued. */
    .acp-floor-chip.is-bypassable {
      opacity: 0.6;
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
        /* The wide bar-only grid is :not(.has-tilt) at (0,4,0), which out-weighs
           the (0,3,0) has-chrome-row reflow above — so re-assert the reflowed
           (controls on their own row) grid at matching specificity here, or a
           bar-only tile would keep its inline layout on phones. */
        .tile-body.detailed.bar-only:not(.has-tilt) {
          grid-template-areas:
            'icon label'
            'icon chrome'
            'controls controls';
        }
        /* Narrow reflow stacks the controls on their own row, so the bar-only
           label span from the wide layout would overlap them — pin it back to
           the name row. */
        .tile-body.detailed.bar-only:not(.has-tilt) .label {
          grid-row: 1 / 2;
        }
        .tile-body.detailed .controls {
          margin-top: 4px;
          gap: 8px;
          justify-content: space-between;
        }
        .tile-body.detailed .controls button {
          flex: 1 1 0;
          width: auto;
          height: 40px;
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
      /* Re-assert the reflowed grid for bar-only (see the 480px block): the wide
         bar-only rule out-specifies the has-chrome-row reflow, so without this a
         bar-only tile in a narrow Sections column keeps its inline controls. */
      .tile-body.detailed.bar-only:not(.has-tilt) {
        grid-template-areas:
          'icon label'
          'icon chrome'
          'controls controls';
      }
      /* Narrow reflow stacks the controls on their own row, so the bar-only
         label span from the wide layout would overlap them — pin it back. */
      .tile-body.detailed.bar-only:not(.has-tilt) .label {
        grid-row: 1 / 2;
      }
      .tile-body.detailed .controls {
        margin-top: 4px;
        gap: 8px;
        justify-content: space-between;
      }
      .tile-body.detailed .controls button {
        flex: 1 1 0;
        width: auto;
        height: 40px;
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
