import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import {
  ACCENT_BG_ALPHA,
  BADGE_KINDS_BY_HANDLER,
  FG_ACCENT_MIX,
  HANDLER_I18N_KEYS,
  HANDLER_ORDER,
  HISTORY_ICON,
  INTEGRATION_DOMAIN,
  MANUAL_OVERRIDE_PRIORITY,
  type BadgeKind,
} from '../const';
import {
  buildDecisionSentence,
  isWinningSlotSafety,
  resolveCustomPositionPct,
} from '../lib/decision-summary';
import {
  buildSolarActiveContext,
  matchedHandlerSet,
  selectVisibleBadges,
} from '../lib/badge-visibility';
import { coverStateIcon, coverStateColor } from '../lib/icons';
import { resolveAxes, positionAxisInverted } from '../lib/axes';
import { coverHeldPosition, logicalCoverPosition } from '../lib/cover-position';
import { startMinuteTimer } from '../lib/minute-timer';
import type {
  AdaptiveCoverProTileCardConfig,
  CustomPositionSlotSnapshot,
  DecisionTraceAttributes,
  DiscoveredEntities,
  ForecastEvent,
  ForecastSample,
  PositionForecastAttributes,
  PositionHistorySample,
} from '../types';
import { formatPercent } from '../lib/formatters';
import { fetchPositionHistory } from '../lib/position-history';
import { startOfDay } from '../lib/sun-model';
import { t } from '../lib/i18n';
import { tooltip } from '../lib/tooltip';

import './tile-badge';
import './decision-strip';
import './overrides-panel';
import './climate-panel';
import './cover-bar';
import './forecast-strip';
import './sky-compass';
import './elevation-chart';
import './solar-calc';
import './history-dialog';
import './battery-indicator';

/**
 * ACP-specific more-info dialog rendered by the card (not HA's built-in
 * more-info, which is entity-bound and cannot carry ACP-specific context).
 *
 * Renders ALL active badges, the plain-English decision summary, a position
 * block, Resume Auto, and a collapsible Advanced section that embeds the
 * existing panel components for the full diagnostic surface.
 *
 * Slot-management UI (per-slot enable toggles, position tick marks) lands
 * in PR-4 once the integration exposes the snapshot attribute + service.
 */
@customElement('acp-more-info-dialog')
export class MoreInfoDialog extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public discovered!: DiscoveredEntities;
  @property({ type: Boolean, reflect: true }) public open = false;

  @property({ type: Boolean }) public advancedOpen = false;
  @property({ type: Boolean }) public showCompass = true;
  @property({ type: Boolean }) public showElevationChart = true;
  @property({ type: Boolean }) public showSolarCalc = true;
  @property({ type: Boolean }) public stateColor = true;

  /** Per-kind badge opt-in, threaded down from the tile-card config. */
  @property({ attribute: false }) public badges?: AdaptiveCoverProTileCardConfig['badges'];

  /** Explicit rail order/subset from the tile-card config's `covers`, so the
   *  dialog's cover bars agree with the tile that opened it. Undefined keeps
   *  the integration's order — which is what every caller that doesn't set
   *  `covers` gets, dialog and main card alike. */
  @property({ attribute: false }) public coverOrder?: string[];

  // Refresh the time-derived bits (the forecast strip's `now` cursor) every minute while
  // the dialog is open, aligned to the minute boundary. The dialog is always in the DOM via
  // the tile card, so gate on `open` rather than connection so a closed dialog isn't ticking.
  private _cancelMinuteTimer: (() => void) | null = null;

  // Recorded actual position for the forecast strip. The integration exposes no
  // history attribute, so we fetch it from the HA recorder when the dialog opens
  // (see `_maybeFetchHistory`). Keyed so it fetches once per cover-set/day, not
  // on every `hass` tick or minute-timer redraw.
  @state() private _positionHistory: PositionHistorySample[] = [];
  private _historyKey: string | null = null;

  /** The full History overlay, opened from the header's timeline button. Kept
   *  separate from `_positionHistory` above, which is only the forecast strip's
   *  actual-position line. */
  @state() private _historyOpen = false;

  protected updated(): void {
    this._syncMinuteTimer(this.open);
    this._maybeFetchHistory();
  }

  private _maybeFetchHistory(): void {
    if (!this.open || !this.hass || !this.discovered) return;
    const covers = this.discovered.managed_covers ?? [];
    if (covers.length === 0) {
      this._historyKey = null;
      if (this._positionHistory.length > 0) this._positionHistory = [];
      return;
    }
    const now = Date.now();
    const dayStartMs = startOfDay(new Date(now)).getTime();
    // The recorder holds the dispatched position; flip it into the logical
    // frame so the history track and the forecast/target curve it is plotted
    // against share one frame (#234). The frame is part of the key: it can flip
    // while the dialog is open (control_status unavailable at open, or an
    // integration reload mid-day), and a cached track in the stale frame plots
    // upside-down against the curve until the day or the cover set changes.
    const inverted = positionAxisInverted(this.discovered);
    const key = `${covers.join(',')}|${dayStartMs}|${inverted}`;
    if (key === this._historyKey) return;
    this._historyKey = key;
    void fetchPositionHistory(this.hass, covers, dayStartMs, now, inverted).then((history) => {
      // Drop a stale response if the cover-set/day/frame changed while awaiting.
      if (this._historyKey !== key) return;
      this._positionHistory = history;
    });
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._syncMinuteTimer(false);
  }

  private _syncMinuteTimer(active: boolean): void {
    if (active && this._cancelMinuteTimer === null) {
      this._cancelMinuteTimer = startMinuteTimer(() => this.requestUpdate());
    } else if (!active && this._cancelMinuteTimer !== null) {
      this._cancelMinuteTimer();
      this._cancelMinuteTimer = null;
    }
  }

  // Stable single-element wrapper for the embedded compass/chart, rebuilt only when
  // `discovered` changes — a fresh `[this.discovered]` literal each render would churn
  // the children's array prop and defeat their own `shouldUpdate` guards.
  private _listSource: DiscoveredEntities | null = null;
  private _list: DiscoveredEntities[] = [];
  private get _discoveredList(): DiscoveredEntities[] {
    if (this.discovered !== this._listSource) {
      this._listSource = this.discovered;
      this._list = this.discovered ? [this.discovered] : [];
    }
    return this._list;
  }

  private _buildHandlerLabels(): Record<string, string> {
    const labels: Record<string, string> = {};
    for (const [key, dotted] of Object.entries(HANDLER_I18N_KEYS)) {
      labels[key] = t(dotted, this.hass);
    }
    return labels;
  }

  /**
   * Header glyph, derived from the managed cover entity (HA-native icon) with
   * the same fallback chain the tile uses: explicit entity icon → device_class
   * glyph → integration cover_type → generic fallback. Position-aware via the
   * cover's `current_position`, normalized to the logical frame so an
   * `inverse_state` entry doesn't paint the open glyph on a closed cover (#234).
   */
  private _headerIcon(): string {
    const coverId = this.discovered.managed_covers?.[0];
    const stateObj = coverId ? this.hass.states[coverId] : undefined;
    return coverStateIcon({
      explicitIcon: stateObj?.attributes?.icon as string | undefined,
      deviceClass: stateObj?.attributes?.device_class as string | undefined,
      coverType: this.discovered.cover_type,
      position: logicalCoverPosition(this.hass, this.discovered, coverId),
    });
  }

  /** Header icon color, following the same state resolution as {@link _headerIcon}. */
  private _headerColor(): string | null {
    if (!this.stateColor) return null;
    const coverId = this.discovered.managed_covers?.[0];
    const stateObj = coverId ? this.hass.states[coverId] : undefined;
    return coverStateColor(stateObj?.state);
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.open || !this.hass || !this.discovered) return nothing;
    const winner = this._winner();
    const attrs = this._traceAttrs();
    const matched = this._matchedHandlers(attrs, winner);
    const safetyActive = isWinningSlotSafety(attrs);
    const summary = attrs
      ? buildDecisionSentence(
          attrs.trace ?? [],
          attrs,
          winner,
          this._buildHandlerLabels(),
          t('badge.safety', this.hass),
        )
      : '';
    const target = this._target();
    const showResume = this._shouldShowResume();
    const integrationEnabled = this._switchOn('integration_enabled_switch');
    const automaticControl = this._switchOn('automatic_control_switch');
    const configureLabel = t('dialog.configure_integration', this.hass);
    const deviceLabel = t('dialog.open_device_page', this.hass);
    const closeLabel = t('dialog.close', this.hass);
    const historyLabel = t('history.open', this.hass);
    const headerColor = this._headerColor();

    return html`
      <div class="backdrop" data-open @click=${this._onBackdrop}>
        <div class="dialog" @click=${this._stop} role="dialog" aria-modal="true">
          <div class="header">
            <ha-icon
              class="cover-icon"
              icon=${this._headerIcon()}
              style=${headerColor ? `color: ${headerColor}` : ''}
            ></ha-icon>
            <div class="title">${this.discovered.entry_title}</div>
            <div class="badges">
              ${!integrationEnabled
                ? html`<acp-tile-badge
                    .hass=${this.hass}
                    .integrationEnabled=${false}
                  ></acp-tile-badge>`
                : !automaticControl
                  ? nothing
                  : matched.map(
                      (h) =>
                        html`<acp-tile-badge
                          .hass=${this.hass}
                          .winner=${h}
                          .slotNumber=${h === 'custom_position'
                            ? attrs?.custom_position_active_slot
                            : undefined}
                          .slotName=${h === 'custom_position'
                            ? attrs?.custom_position_active_slot_name
                            : undefined}
                          .pct=${h === 'custom_position'
                            ? (resolveCustomPositionPct(attrs, target) ?? undefined)
                            : undefined}
                          .minimumMode=${h === 'custom_position'
                            ? attrs?.custom_position_minimum_mode
                            : undefined}
                          .safetyActive=${h === 'custom_position' && safetyActive}
                        ></acp-tile-badge>`,
                    )}
            </div>
            <acp-battery-indicator
              .hass=${this.hass}
              .coverIds=${this.coverOrder ?? this.discovered.managed_covers ?? []}
            ></acp-battery-indicator>
            <button
              class="icon-btn history-link"
              type="button"
              aria-label=${historyLabel}
              ${tooltip(historyLabel)}
              @click=${this._openHistory}
            >
              <ha-icon icon=${HISTORY_ICON}></ha-icon>
            </button>
            <button
              class="icon-btn options-link"
              type="button"
              aria-label=${configureLabel}
              ${tooltip(configureLabel)}
              @click=${this._openIntegrationPage}
            >
              <ha-icon icon="mdi:cog"></ha-icon>
            </button>
            ${this.discovered.device_id
              ? html`<button
                  class="icon-btn device-link"
                  type="button"
                  aria-label=${deviceLabel}
                  ${tooltip(deviceLabel)}
                  @click=${this._openDevicePage}
                >
                  <ha-icon icon="mdi:tune-variant"></ha-icon>
                </button>`
              : nothing}
            <button class="close" type="button" aria-label=${closeLabel} @click=${this._emitClose}>
              ✕
            </button>
          </div>

          ${summary ? html`<div class="summary">${summary}</div>` : nothing}

          <div class="position-block">
            <div class="position-label">${t('dialog.target', this.hass)}</div>
            <div class="position-value">${formatPercent(target)}</div>
            ${this._mismatchActive()
              ? html`<ha-icon class="warn" icon="mdi:alert-circle-outline"></ha-icon>`
              : nothing}
          </div>

          <acp-cover-bar
            .hass=${this.hass}
            .discovered=${this.discovered}
            .coverOrder=${this.coverOrder}
          ></acp-cover-bar>

          ${this._renderForecastStrip()} ${this._renderControls()}
          ${showResume
            ? html`<div class="actions">
                <button class="resume" type="button" @click=${this._onResume}>
                  ${t('dialog.resume_auto', this.hass)}
                </button>
              </div>`
            : nothing}

          <button class="advanced-toggle" type="button" @click=${this._toggleAdvanced}>
            ${this.advancedOpen
              ? t('dialog.hide_advanced', this.hass)
              : t('dialog.show_advanced', this.hass)}
          </button>
          ${this.advancedOpen
            ? html`<div class="advanced">
                ${this.showCompass
                  ? html`<div class="advanced-compass">
                      <acp-sky-compass
                        .hass=${this.hass}
                        .discovered_list=${this._discoveredList}
                        ?compact=${true}
                        .showLegend=${false}
                        .showStats=${true}
                      ></acp-sky-compass>
                    </div>`
                  : nothing}
                ${this.showElevationChart
                  ? html`<acp-elevation-chart
                      .hass=${this.hass}
                      .discoveredList=${this._discoveredList}
                      ?compact=${true}
                    ></acp-elevation-chart>`
                  : nothing}
                ${this._renderSlots(attrs?.custom_position_slots)}
                <acp-decision-strip
                  .hass=${this.hass}
                  .discovered=${this.discovered}
                ></acp-decision-strip>
                ${this.showSolarCalc
                  ? html`<acp-solar-calc
                      .hass=${this.hass}
                      .discovered=${this.discovered}
                    ></acp-solar-calc>`
                  : nothing}
                <acp-overrides-panel
                  .hass=${this.hass}
                  .discovered=${this.discovered}
                ></acp-overrides-panel>
                <acp-climate-panel
                  .hass=${this.hass}
                  .discovered=${this.discovered}
                ></acp-climate-panel>
              </div>`
            : nothing}
        </div>
      </div>
      <acp-history-dialog
        .hass=${this.hass}
        .discovered=${this.discovered}
        .open=${this._historyOpen}
        @acp-history-closed=${() => {
          this._historyOpen = false;
        }}
      ></acp-history-dialog>
    `;
  }

  private _openHistory = (e: Event): void => {
    // The header row sits inside the dialog's click-stop, but the History
    // overlay renders as a sibling of this dialog — stop here anyway so a stray
    // bubbling click can't immediately re-close it.
    e.stopPropagation();
    this._historyOpen = true;
  };

  private _winner(): string {
    const id = this.discovered.entities.decision_trace_sensor;
    if (!id) return 'default';
    return this.hass.states[id]?.state ?? 'default';
  }

  private _traceAttrs(): DecisionTraceAttributes | undefined {
    const id = this.discovered.entities.decision_trace_sensor;
    if (!id) return undefined;
    return this.hass.states[id]?.attributes as unknown as DecisionTraceAttributes | undefined;
  }

  private _matchedHandlers(
    attrs: DecisionTraceAttributes | undefined,
    winner: string,
  ): BadgeKind[] {
    if (!attrs?.trace) return [];
    // Shared with the tile card's single winner-badge elevation (issue #223):
    // walk every matched row in the trace, not just the literal winner.
    const matched = matchedHandlerSet(attrs.trace);
    // Preserve HANDLER_ORDER (highest priority first), then map each matched
    // handler to its badge kind so the inversion + per-badge opt-in apply.
    const kinds = HANDLER_ORDER.filter((h) => matched.has(h))
      .map((h) => BADGE_KINDS_BY_HANDLER[h])
      .filter((k): k is BadgeKind => k !== undefined);
    const ctx = buildSolarActiveContext(attrs.trace, winner);
    return selectVisibleBadges(kinds, this.badges, ctx);
  }

  /** Prefers the pre-interpolation `linear_position` attribute (issue #219)
   *  over the raw motor state when present. See {@link coverHeldPosition}. */
  private _target(): number | null {
    return coverHeldPosition(this.hass, this.discovered);
  }

  private _mismatchActive(): boolean {
    const id = this.discovered.entities.position_mismatch_binary;
    if (!id) return false;
    return this.hass.states[id]?.state === 'on';
  }

  private _onResume = (): void => {
    const btn = this.discovered.entities.reset_override_button;
    if (!btn) return;
    this.hass.callService('button', 'press', { entity_id: btn });
  };

  private _manualOverrideOn(): boolean {
    const id = this.discovered.entities.manual_override_binary;
    if (!id) return false;
    return this.hass.states[id]?.state === 'on';
  }

  private _switchOn(role: 'integration_enabled_switch' | 'automatic_control_switch'): boolean {
    const id = this.discovered.entities[role];
    if (!id) return true;
    return this.hass.states[id]?.state !== 'off';
  }

  private _shouldShowResume(): boolean {
    if (!this.discovered.entities.reset_override_button) return false;
    return this._manualOverrideOn();
  }

  private _renderSlots(
    slots: CustomPositionSlotSnapshot[] | undefined,
  ): TemplateResult | typeof nothing {
    if (!slots) return nothing;
    const configured = slots.filter((s) => s.sensor !== null);
    if (configured.length === 0) return nothing;
    return html`<div class="slots-section">
      <div class="slots-label">${t('dialog.custom_positions', this.hass)}</div>
      ${configured.map((s) => this._renderSlotRow(s))}
    </div>`;
  }

  private _renderSlotRow(slot: CustomPositionSlotSnapshot): TemplateResult {
    const label = slot.sensor_name ?? `#${slot.slot}`;
    // v2.28.0+ multi-sensor / template slots get a compact indicator chip. The
    // tooltip surfaces the sensor count and combine mode; the chip itself is an
    // icon so it needs no new i18n string.
    const sensorCount = slot.sensors?.length ?? 0;
    const templateChip =
      slot.template === true
        ? html`<span
            class="slot-template"
            ${tooltip(
              `Template${
                sensorCount > 0
                  ? ` · ${sensorCount} sensors${slot.template_mode ? ` (${slot.template_mode})` : ''}`
                  : ''
              }`,
            )}
          >
            <ha-icon icon="mdi:code-braces"></ha-icon>
          </span>`
        : nothing;
    return html`<div class="slot-row" data-slot=${slot.slot}>
      <span class="slot-label">${label}</span>
      ${templateChip}
      <span class="slot-position">${formatPercent(slot.position)}</span>
      ${slot.min_mode === true
        ? html`<span
            class="slot-min-mode${slot.priority != null && slot.priority > MANUAL_OVERRIDE_PRIORITY
              ? ''
              : ' is-bypassable'}"
            ${tooltip(t('dialog.floor_tooltip', this.hass))}
          >
            ${t('dialog.floor', this.hass)}
          </span>`
        : nothing}
      <button
        class="slot-toggle ${slot.enabled ? 'on' : 'off'}"
        type="button"
        aria-label=${slot.enabled
          ? t('dialog.disable_slot', this.hass, { slot: slot.slot })
          : t('dialog.enable_slot', this.hass, { slot: slot.slot })}
        @click=${() => this._toggleSlot(slot)}
      >
        ${slot.enabled ? t('dialog.on', this.hass) : t('dialog.off', this.hass)}
      </button>
    </div>`;
  }

  private _renderControls(): TemplateResult | typeof nothing {
    type SwitchRole = 'automatic_control_switch' | 'climate_mode_switch' | 'motion_control_switch';
    const rows: Array<{ role: SwitchRole; label: string }> = (
      [
        { role: 'automatic_control_switch', label: t('dialog.automatic', this.hass) },
        { role: 'climate_mode_switch', label: t('dialog.climate', this.hass) },
        { role: 'motion_control_switch', label: t('dialog.motion', this.hass) },
      ] as const
    ).filter((r) => !!this.discovered.entities[r.role]);
    if (rows.length === 0) return nothing;
    return html`<div class="controls-block">
      <div class="controls-label">${t('dialog.controls', this.hass)}</div>
      <div class="controls-row">${rows.map((r) => this._renderSwitchChip(r.role, r.label))}</div>
    </div>`;
  }

  private _renderSwitchChip(
    role: 'automatic_control_switch' | 'climate_mode_switch' | 'motion_control_switch',
    label: string,
  ): TemplateResult {
    const id = this.discovered.entities[role]!;
    const on = this.hass.states[id]?.state === 'on';
    const state = on ? t('dialog.state_on', this.hass) : t('dialog.state_off', this.hass);
    const onOff = on ? t('dialog.on', this.hass) : t('dialog.off', this.hass);
    return html`<button
      class="ctrl-toggle ${on ? 'on' : 'off'}"
      type="button"
      aria-pressed=${on}
      aria-label=${t('dialog.toggle_hint', this.hass, { label, state })}
      @click=${() => this._toggleSwitch(id, on)}
    >
      <span class="ctrl-label">${label}</span>
      <span class="ctrl-state">${onOff}</span>
    </button>`;
  }

  private _toggleSwitch(entity_id: string, currentlyOn: boolean): void {
    this.hass.callService('switch', currentlyOn ? 'turn_off' : 'turn_on', { entity_id });
  }

  private _renderForecastStrip(): TemplateResult | typeof nothing {
    const id = this.discovered.entities.position_forecast_sensor;
    const attrs = id
      ? (this.hass.states[id]?.attributes as PositionForecastAttributes | undefined)
      : undefined;
    const samples: ForecastSample[] = attrs?.forecast ?? [];
    const events: ForecastEvent[] = attrs?.events ?? [];
    const history = this._positionHistory;
    if (samples.length === 0 && history.length === 0) return nothing;
    return html`<div class="forecast-block">
      <div class="forecast-label">${t('dialog.todays_forecast', this.hass)}</div>
      <acp-forecast-strip
        .hass=${this.hass}
        .samples=${samples}
        .events=${events}
        .history=${history}
        .now=${Date.now()}
        .axes=${resolveAxes(this.discovered)}
      ></acp-forecast-strip>
      <div class="forecast-note">${t('forecast.solar_only_note', this.hass)}</div>
    </div>`;
  }

  private _toggleSlot(slot: CustomPositionSlotSnapshot): void {
    const target = this.discovered.managed_covers[0];
    if (!target) return;
    this.hass.callService(INTEGRATION_DOMAIN, 'set_custom_position', {
      entity_id: target,
      slot: slot.slot,
      enabled: !slot.enabled,
    });
  }

  private _toggleAdvanced = (): void => {
    this.advancedOpen = !this.advancedOpen;
  };

  private _openDevicePage = (): void => {
    const deviceId = this.discovered.device_id;
    if (!deviceId) return;
    this._navigate(`/config/devices/device/${deviceId}`);
  };

  /** The `#config_entry=` hash is read by HA's own integration page, which
   *  scrolls that row into view and highlights it — so the user lands on this
   *  profile rather than an unsorted list, with HA's Configure cog one click
   *  away. The options flow dialog itself can't be opened from a custom card:
   *  its element is a lazy import inside HA's bundle graph. */
  private _openIntegrationPage = (): void => {
    const entryId = this.discovered.entry_id;
    this._navigate(
      `/config/integrations/integration/${INTEGRATION_DOMAIN}` +
        (entryId ? `#config_entry=${entryId}` : ''),
    );
  };

  private _navigate(path: string): void {
    history.pushState(null, '', path);
    window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
    this._emitClose();
  }

  private _onBackdrop = (e: MouseEvent): void => {
    if (e.target === e.currentTarget) this._emitClose();
  };

  private _emitClose = (): void => {
    this.dispatchEvent(new CustomEvent('acp-dialog-close', { bubbles: true, composed: true }));
  };

  private _stop = (e: Event): void => {
    e.stopPropagation();
  };

  public static styles = css`
    :host {
      display: contents;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 5vh 12px;
      overflow-y: auto;
    }
    .dialog {
      width: 100%;
      max-width: 520px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color);
      border-radius: 12px;
      padding: 14px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .header .cover-icon {
      --mdc-icon-size: 22px;
    }
    .header .title {
      font-size: 1.1rem;
      font-weight: 600;
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .header .badges {
      display: inline-flex;
      gap: 4px;
      flex-wrap: wrap;
    }
    .close {
      border: 0;
      background: transparent;
      cursor: pointer;
      font-size: 1.1rem;
      color: var(--secondary-text-color);
      padding: 4px 6px;
    }
    .close:hover {
      color: var(--primary-text-color);
    }
    .icon-btn {
      border: 0;
      background: transparent;
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 4px 6px;
      display: inline-flex;
      align-items: center;
      --mdc-icon-size: 18px;
    }
    .icon-btn:hover {
      color: var(--primary-text-color);
    }
    .summary {
      font-size: 0.9rem;
      font-style: italic;
      color: var(--secondary-text-color);
    }
    .position-block {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
    }
    .position-label {
      color: var(--secondary-text-color);
    }
    .position-value {
      font-variant-numeric: tabular-nums;
      font-weight: 600;
    }
    .warn {
      color: var(--warning-color, orange);
      --mdc-icon-size: 18px;
    }
    .actions {
      display: flex;
      gap: 8px;
    }
    .resume {
      padding: 6px 14px;
      border: 1px solid var(--primary-color);
      border-radius: 999px;
      background: transparent;
      color: var(--primary-color);
      font-size: 0.9rem;
      cursor: pointer;
    }
    .resume:hover {
      background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.08);
    }
    .advanced-toggle {
      border: 0;
      background: transparent;
      cursor: pointer;
      color: var(--primary-color);
      font-size: 0.85rem;
      text-align: left;
      padding: 4px 0;
    }
    .advanced {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 4px;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }
    .advanced-compass {
      display: flex;
      justify-content: center;
    }
    .slots-section {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .slots-label {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .slot-row {
      display: grid;
      grid-template-columns: 1fr auto auto auto;
      gap: 8px;
      align-items: center;
      font-size: 0.85rem;
      padding: 2px 4px;
    }
    .slot-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .slot-position {
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .slot-template {
      display: inline-flex;
      align-items: center;
      color: var(--secondary-text-color);
    }
    /* Floating-tooltip cursor lifecycle for the informational chips (the
       clickable .icon-btn buttons keep their pointer cursor — they are excluded
       from this rule). Help hint on hover, default once OUR bubble appears. */
    .slot-template[data-tooltip]:hover,
    .slot-min-mode[data-tooltip]:hover {
      cursor: help;
    }
    .slot-template[data-tooltip][acp-tt-shown],
    .slot-min-mode[data-tooltip][acp-tt-shown] {
      cursor: default;
    }
    .slot-template ha-icon {
      --mdc-icon-size: 14px;
    }
    /* The dialog's copy of the tile's floor chip, and it resolves its purple the
       same way and for the same reason: the literal #6a1b9a it replaces is a
       light-theme color that sat near 1.6:1 on HA's dark theme. Keep the two in
       step — they are the same marker on two surfaces. */
    .slot-min-mode {
      font-size: 0.7rem;
      padding: 1px 6px;
      border-radius: 999px;
      --acp-floor-accent: #9c27b0;
      background: color-mix(in srgb, var(--acp-floor-accent) ${ACCENT_BG_ALPHA}%, transparent);
      color: color-mix(
        in srgb,
        var(--acp-floor-accent) ${FG_ACCENT_MIX}%,
        var(--primary-text-color, #212121)
      );
    }
    /* Priority axis: floor whose priority ≤ manual-override is bypassable by a
       manual ↓ → subdued. Per-slot rows have no clamping notion, so no
       fill/outline. Subdued via the background rather than opacity, which
       multiplied into the text and was half of why this chip was unreadable. */
    .slot-min-mode.is-bypassable {
      background: color-mix(in srgb, var(--acp-floor-accent) 10%, transparent);
      font-weight: 400;
    }
    .slot-toggle {
      padding: 2px 10px;
      border-radius: 999px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.16));
      background: transparent;
      cursor: pointer;
      font-size: 0.75rem;
      min-width: 40px;
    }
    .slot-toggle.on {
      background: rgba(76, 175, 80, 0.22);
      color: #1b5e20;
      border-color: rgba(76, 175, 80, 0.5);
    }
    .slot-toggle.off {
      color: var(--secondary-text-color);
    }
    .forecast-block {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .forecast-label {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .forecast-note {
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      opacity: 0.75;
    }
    .controls-block {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .controls-label {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .controls-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .ctrl-toggle {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 999px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.16));
      background: transparent;
      cursor: pointer;
      font-size: 0.8rem;
      color: var(--primary-text-color);
    }
    .ctrl-toggle .ctrl-label {
      font-weight: 500;
    }
    .ctrl-toggle .ctrl-state {
      font-size: 0.75rem;
      color: var(--secondary-text-color);
    }
    .ctrl-toggle.on {
      background: rgba(76, 175, 80, 0.16);
      border-color: rgba(76, 175, 80, 0.5);
    }
    .ctrl-toggle.on .ctrl-state {
      color: #1b5e20;
    }
    .ctrl-toggle.off {
      opacity: 0.85;
    }
    .ctrl-toggle:hover {
      background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.08);
    }
  `;
}
