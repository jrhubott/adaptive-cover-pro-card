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
import { makeEntitySuggestion } from './lib/entity-suggestion';
import { resolveAxes, type ResolvedAxis } from './lib/axes';
import { setAxes } from './lib/services';
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
} from './types';
import {
  buildDecisionSentence,
  isWinningSlotSafety,
  normalizeHandler,
  resolveCustomPositionPct,
  resolveActiveMinModeFloor,
} from './lib/decision-summary';
import {
  buildSolarActiveContext,
  isAutoControlActive,
  resolveTileBadgeKind,
  selectVisibleBadges,
} from './lib/badge-visibility';
import { formatCoverState, formatPercent, isUnavailable } from './lib/formatters';
import { t } from './lib/i18n';
import { tooltip, setTooltipDefaults } from './lib/tooltip';

import './components/tile-badge';
import './components/tilt-bar';
import './components/group-tile';
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
    // of the cover tile controls + more-info dialog (both cover-specific).
    if (discovered.is_group) {
      return html`<ha-card>
        <acp-group-tile .hass=${this.hass} .discovered=${discovered}></acp-group-tile>
      </ha-card>`;
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
    `;
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
    const title = cfg.name ?? discovered.entry_title;
    const cover = this._resolvedCover(discovered);
    // Resolve the icon from the underlying HA cover entity so it matches HA's
    // native tile/more-info glyph: cfg.icon override → explicit entity icon →
    // device_class glyph → integration cover_type → generic fallback.
    const stateObj = cover ? this.hass.states[cover] : undefined;
    const coverDeviceClass = stateObj?.attributes?.device_class as string | undefined;
    // An offline/unresponsive cover (issue #212): the underlying HA entity is
    // `unavailable`/`unknown`. Every downstream derivation below (icon,
    // position, label, controls) must gate on this rather than let the
    // diagnostic target-position sensor or a stale `current_position`
    // attribute leak through as if the cover were live.
    const unavailable = isUnavailable(stateObj?.state);
    const icon =
      cfg.icon ??
      (unavailable
        ? COVER_ICON_FALLBACK_UNAVAILABLE
        : coverStateIcon({
            explicitIcon: stateObj?.attributes?.icon as string | undefined,
            deviceClass: coverDeviceClass,
            coverType: discovered.cover_type,
            position: this._liveCoverPosition(cover),
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
    const calculatedPosition = this._currentPosition(discovered);
    const reportedPosition = this._liveCoverPosition(cover);
    const livePosition = unavailable ? null : (reportedPosition ?? calculatedPosition);
    // Data-driven axes: any non-position axis (venetian tilt) drives the mini
    // bar. The detailed layout gets the bar; one-line folds it into the readout.
    // `show_tilt` is reinterpreted as "show non-position axes". On an older
    // integration `resolveAxes` synthesizes tilt from the Cover_Tilt sensor, so
    // behavior is unchanged.
    const secondaryAxis = resolveAxes(discovered).find((a) => a.id !== 'position');
    const showTilt = cfg.show_tilt !== false && !!secondaryAxis;
    // Same unavailable gate as `livePosition` above: an offline cover must not
    // leak a stale `current_tilt_position` attribute or the always-live
    // diagnostic tilt-target sensor (issue #212 follow-up).
    const liveTilt = !unavailable && secondaryAxis ? this._liveAxis(cover, secondaryAxis) : null;
    const tiltTarget =
      !unavailable && secondaryAxis ? this._axisTarget(discovered, secondaryAxis) : null;
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
    const stateText = unavailable
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
          @acp-resume=${() => this._resume(discovered)}
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
    // otherwise-empty right half of the badge row). Live position is the fill;
    // the auto/solar target is a marker tick. Purely informational — the ↑■↓
    // buttons remain the control surface. Detailed layout only, and gated on
    // `show_badge` so disabling the card's chrome (show_badge: false) still
    // yields a compact single-row tile rather than a row holding just the bar.
    const showPositionBar = detailed && showBadge && livePosition !== null;
    const posBarTooltip = showPositionBar
      ? calculatedPosition !== null
        ? `${formatPercent(livePosition)} · ${t('dialog.target', this.hass)} ${formatPercent(calculatedPosition)}`
        : formatPercent(livePosition)
      : '';
    const posBarTpl = showPositionBar
      ? html`<div class="pos-bar" ${tooltip(posBarTooltip)}>
          <div
            class="pos-fill"
            style=${`width:${livePosition}%${iconColor ? `;background:${iconColor}` : ''}`}
          ></div>
          ${calculatedPosition !== null
            ? html`<div
                class="pos-marker"
                style=${`left:clamp(1px, ${calculatedPosition}%, calc(100% - 1px))`}
              ></div>`
            : nothing}
        </div>`
      : nothing;
    // ACP's own chrome (Auto badge, winner/Manual badge, floor chip) no longer
    // rides on the name/state rows — it collects on a dedicated full-width row 3
    // so the top two rows read exactly like a native HA tile. The row exists
    // when any chrome is present — a badge, the floor chip, or the position bar.
    const showWinnerBadge = renderBadge && inlineWinnerBadge;
    const hasBadgeRow =
      detailed && (showAutoBadge || showWinnerBadge || showFloorChip || showPositionBar);

    return html`
      <div
        class=${`tile-body${detailed ? ' detailed' : ''}${hasStateLabel ? ' has-state-label' : ''}${showFloorChip && !detailed ? ' has-floor-chip' : ''}${showTilt && detailed ? ' has-tilt' : ''}${hasBadgeRow ? ' has-badge-row' : ''}${unavailable ? ' unavailable' : ''}`}
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
        ${hasBadgeRow
          ? html`<div class="badge-line">
              ${autoBadgeTpl}${showWinnerBadge ? badgeTpl : nothing}${floorChipTpl}${posBarTpl}
            </div>`
          : nothing}
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
                .disabled=${unavailable}
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
                ?disabled=${!cover || unavailable || atOpen}
                @click=${() => this._setCoverPosition(cover, 100)}
              >
                <ha-icon icon=${coverOpenIcon(coverDeviceClass)}></ha-icon>
              </button>
              <button
                class="stop"
                type="button"
                aria-label=${t('tile.stop', this.hass)}
                ?disabled=${!cover || unavailable}
                @click=${() => this._stopCover(cover)}
              >
                <ha-icon icon="mdi:stop"></ha-icon>
              </button>
              <button
                class="down"
                type="button"
                aria-label=${t('tile.close', this.hass)}
                ?disabled=${!cover || unavailable || atClosed}
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

  private _currentPosition(discovered: DiscoveredEntities): number | null {
    const id = discovered.entities.target_position_sensor;
    if (!id) return null;
    const st = this.hass.states[id];
    if (!st) return null;
    const v = parseFloat(st.state);
    return Number.isNaN(v) ? null : v;
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

  private _liveCoverPosition(cover: string | undefined): number | null {
    if (!cover) return null;
    const v = this.hass.states[cover]?.attributes?.current_position;
    return typeof v === 'number' && !Number.isNaN(v) ? v : null;
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

  /** Live value for a secondary axis from the cover's per-axis state attribute. */
  private _liveAxis(cover: string | undefined, axis: ResolvedAxis): number | null {
    if (!cover || !axis.stateAttr) return null;
    const v = this.hass.states[cover]?.attributes?.[axis.stateAttr];
    return typeof v === 'number' && !Number.isNaN(v) ? v : null;
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
    const cover = this._resolvedCoverFromState();
    handleAction(
      this,
      this.hass,
      {
        entity: cover,
        tap_action: tap,
        hold_action: this._config.hold_action,
        double_tap_action: this._config.double_tap_action,
      },
      action,
    );
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
       all on one row. ACP's own chrome (Auto / winner / floor badges) drops to
       a dedicated full-width row (.badge-line) that only exists when a badge is
       present, so the top row reads exactly like a native HA tile. */
    .tile-body.detailed {
      grid-template-columns: 36px minmax(0, 1fr) auto;
      grid-template-rows: auto;
      grid-template-areas: 'icon label controls';
      align-items: center;
      column-gap: 12px;
      row-gap: 8px;
    }
    /* Row 2 = ACP badges, indented to the label column (the icon column stays
       empty) so the name, state, and badges all share one left edge. */
    .tile-body.detailed.has-badge-row {
      grid-template-rows: auto auto;
      grid-template-areas:
        'icon label  controls'
        '.    badges badges';
    }
    /* Row 2 (or 3) = the venetian tilt slider, likewise indented under label. */
    .tile-body.detailed.has-tilt {
      grid-template-rows: auto auto;
      grid-template-areas:
        'icon label controls'
        '.    tilt  tilt';
    }
    .tile-body.detailed.has-badge-row.has-tilt {
      grid-template-rows: auto auto auto;
      grid-template-areas:
        'icon label  controls'
        '.    badges badges'
        '.    tilt   tilt';
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
    .badge-line {
      grid-area: badges;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }
    .badge-line acp-tile-badge {
      overflow: visible;
    }
    /* Target-vs-actual mini bar: right-aligned in the badge row so it fills the
       otherwise-empty space beneath the ↑■↓ buttons. Fill = live openness in the
       state color; the tick marks the auto/solar target. */
    .badge-line .pos-bar {
      margin-left: auto;
      align-self: center;
      position: relative;
      flex: 0 1 170px;
      max-width: 55%;
      height: 6px;
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      overflow: hidden;
    }
    .badge-line .pos-fill {
      position: absolute;
      inset: 0 auto 0 0;
      background: var(--primary-color);
      opacity: 0.55;
      border-radius: 6px;
      transition: width 0.3s ease;
    }
    .badge-line .pos-marker {
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
        .tile-body.detailed.has-badge-row {
          grid-template-areas:
            'icon label'
            '.    badges'
            'controls controls';
        }
        .tile-body.detailed.has-tilt {
          grid-template-areas:
            'icon label'
            '.    tilt'
            'controls controls';
        }
        .tile-body.detailed.has-badge-row.has-tilt {
          grid-template-areas:
            'icon label'
            '.    badges'
            '.    tilt'
            'controls controls';
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
      .tile-body.detailed.has-badge-row {
        grid-template-areas:
          'icon label'
          'badges badges'
          'controls controls';
      }
      .tile-body.detailed.has-tilt {
        grid-template-areas:
          'icon label'
          'tilt tilt'
          'controls controls';
      }
      .tile-body.detailed.has-badge-row.has-tilt {
        grid-template-areas:
          'icon label'
          'badges badges'
          'tilt tilt'
          'controls controls';
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
