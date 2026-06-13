import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import type { LitElement as LitElementType } from 'lit';
import { SKY_COMPASS_CARD_NAME } from '../../src/const';
import { buildMockHass, type ServiceCallEvent } from './mock/hass';
import { applyService, type ServiceCall } from './mock/services';
import { defaultScenarioConfig, findScenario, normalizeConfig, SCENARIOS } from './scenarios';
import { loadConfig, saveConfig, STORAGE_KEY } from './persistence';
import { setFakeNow } from './fake-clock';
import { zoneForLongitude, zonedNowMs } from './zone';
import {
  clearStateFromUrl,
  copyToClipboard,
  readStateFromUrl,
  writeStateToUrl,
} from './share-state';
import type {
  HarnessConfig,
  RootCardOptions,
  SkyCompassCardOptions,
  TileCardOptions,
} from './types';
import type { ConfigChangeDetail } from './control-panel';
import './control-panel';
import './card-stage';
import './badge-gallery';
import './service-log';

/** A shallow-by-section partial of {@link HarnessConfig} accepted by the capture bridge. */
export type CapturePartial = Partial<Omit<HarnessConfig, 'root' | 'compass' | 'tile'>> & {
  root?: Partial<RootCardOptions>;
  compass?: Partial<SkyCompassCardOptions>;
  tile?: Partial<TileCardOptions>;
};

/**
 * Programmatic hook the time-lapse capture script drives via Playwright. Only
 * attached when the page URL carries a `?capture` param, so normal harness runs
 * are untouched. See `scripts/capture-timelapse.mjs`.
 */
export interface CaptureBridge {
  listScenarios(): { id: string; label: string }[];
  loadScenario(id: string): Promise<void>;
  setConfig(partial: CapturePartial): Promise<void>;
  setMinutes(minutes: number): Promise<void>;
}

function mergeCaptureConfig(base: HarnessConfig, p: CapturePartial): HarnessConfig {
  return {
    ...base,
    ...p,
    root: { ...base.root, ...(p.root ?? {}) },
    compass: { ...base.compass, ...(p.compass ?? {}) },
    tile: { ...base.tile, ...(p.tile ?? {}) },
  };
}

const MAX_LOG_ENTRIES = 200;

/** Device-preview widths. A viewport @media breakpoint (e.g. the phone tile
 *  reflow, gated on @media (max-width: 500px)) can only be exercised by giving
 *  the card its own viewport — an iframe sized to the device. The tile-width
 *  control fakes the *container* width and never trips a @media query. */
const DEVICE_PRESETS: { label: string; w: number }[] = [
  { label: 'Desktop (off)', w: 0 },
  { label: 'Android (360)', w: 360 },
  { label: 'iPhone (390)', w: 390 },
  { label: 'iPhone Max (430)', w: 430 },
  { label: 'Tablet (768)', w: 768 },
];

type StageTab = 'root' | 'compass' | 'tile' | 'badges';

function parseEmbedTab(v: string | null): StageTab {
  return v === 'root' || v === 'compass' || v === 'tile' || v === 'badges' ? v : 'tile';
}

@customElement('acp-harness-app')
export class AcpHarnessApp extends LitElement {
  // URL hash > localStorage > default preset. Normalize so configs persisted
  // before newer fields (e.g. tile.badges) were added get them backfilled.
  @state() private _config: HarnessConfig = normalizeConfig(
    readStateFromUrl() ?? loadConfig() ?? defaultScenarioConfig(),
  );
  @state() private _hass!: HomeAssistant;
  @state() private _log: ServiceCall[] = [];
  @state() private _shareToast: string | null = null;
  // Which stage view is shown. In-memory only — resets to "root" on reload.
  @state() private _tab: StageTab = 'root';
  // Device-preview width in px (0 = off). Renders the active card in an iframe
  // sized to a device so viewport @media breakpoints actually fire.
  @state() private _device = 0;

  // Capture mode (?capture URL param) keeps card-stage rendering all enabled
  // cards so the screenshot/time-lapse scripts work unchanged.
  private _capture = false;
  // Embed mode (?embed=<tab> URL param) is the document loaded *inside* a
  // device-preview iframe: it renders only the chosen card, drops the chrome,
  // and mirrors the parent's config live via localStorage `storage` events.
  private _embed = false;

  private _playInterval: ReturnType<typeof setInterval> | null = null;
  private _shareToastTimer: ReturnType<typeof setTimeout> | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    const params = new URLSearchParams(location.search);
    if (params.has('embed')) {
      // Running inside a device-preview iframe: mirror the parent, no chrome.
      this._embed = true;
      this._tab = parseEmbedTab(params.get('embed'));
      window.addEventListener('storage', this._onStorage);
    }
    this._rebuildHass();
    this._applyTheme();
    if (!this._embed && params.has('capture')) {
      this._capture = true;
      this._installCaptureBridge();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearPlayInterval();
    window.removeEventListener('storage', this._onStorage);
  }

  /** Embed mode only: the parent window writes config to localStorage on every
   *  change; same-origin `storage` events deliver it here so the device preview
   *  stays in lock-step without a postMessage channel. */
  private _onStorage = (e: StorageEvent): void => {
    if (e.key !== STORAGE_KEY) return;
    const cfg = loadConfig();
    if (cfg) this._config = normalizeConfig(cfg);
  };

  protected willUpdate(changed: Map<string, unknown>): void {
    // Rebuild hass BEFORE render (not in updated(), which runs after) so the new
    // scenario's config and its matching mock hass reach the card stage in the
    // same render. Otherwise hass lags config by one cycle: the stage remounts
    // its cards against the new entry_ids but pushes the *previous* scenario's
    // hass, so discovery fetches the stale registry and a multi-entry switch
    // renders "No matching Adaptive Cover Pro entities".
    if (changed.has('_config')) this._rebuildHass();
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has('_config')) {
      this._applyTheme();
      this._syncPlayState();
      // Embed mode is a read-only mirror — writing back would echo the parent's
      // own value into a redundant `storage` round-trip.
      if (!this._embed) saveConfig(this._config);
    }
  }

  private _rebuildHass(): void {
    // Freeze `new Date()` / `Date.now()` to the harness time before rebuilding
    // hass — the cards sample sun position via `startOfDay()` which uses
    // `new Date()`; without this the sun path is drawn for the real wall-clock
    // date, not the harness's configured date.
    setFakeNow(this._harnessNowMs());
    const bundle = buildMockHass(this._config, this._onServiceCall);
    this._hass = bundle.hass;
  }

  private _harnessNowMs(): number {
    // Interpret the date + time-of-day slider as wall time in the *location's*
    // zone (derived from longitude), matching what state-gen and the card do —
    // otherwise the slider would mean the dev machine's local time.
    return zonedNowMs(
      this._config.date,
      this._config.timeOfDayMinutes,
      zoneForLongitude(this._config.longitude),
    );
  }

  private _applyTheme(): void {
    document.documentElement.classList.toggle('theme-dark', this._config.theme === 'dark');
  }

  private _syncPlayState(): void {
    // The parent drives the clock; an embedded preview only mirrors it (a second
    // interval would double-advance time against the storage-synced value).
    if (this._embed) return;
    if (this._config.playing && !this._playInterval) {
      this._playInterval = setInterval(() => {
        const next = (this._config.timeOfDayMinutes + 1) % 1440;
        this._config = { ...this._config, timeOfDayMinutes: next };
      }, 100);
    } else if (!this._config.playing && this._playInterval) {
      this._clearPlayInterval();
    }
  }

  private _clearPlayInterval(): void {
    if (this._playInterval) {
      clearInterval(this._playInterval);
      this._playInterval = null;
    }
  }

  /** Expose `window.__acpCapture` so the time-lapse script can step time deterministically. */
  private _installCaptureBridge(): void {
    this._clearPlayInterval();
    const bridge: CaptureBridge = {
      listScenarios: () => SCENARIOS.map((s) => ({ id: s.id, label: s.label })),
      loadScenario: async (id) => {
        const sc = findScenario(id);
        if (!sc) throw new Error(`unknown scenario: ${id}`);
        this._config = normalizeConfig({ ...sc.build(), playing: false });
        await this._settle();
      },
      setConfig: async (partial) => {
        this._config = mergeCaptureConfig(this._config, { ...partial, playing: false });
        await this._settle();
      },
      setMinutes: async (minutes) => {
        this._config = { ...this._config, timeOfDayMinutes: minutes, playing: false };
        await this._settle();
      },
    };
    (window as unknown as { __acpCapture: CaptureBridge }).__acpCapture = bridge;
  }

  /**
   * Wait for the full render chain to settle. Setting `_config` triggers a hass
   * rebuild in `updated()`, which schedules a *second* update — `updateComplete`
   * resolves `false` while another update is pending, so drain those first, then
   * await the nested card-stage and compass card, and finally a paint frame.
   */
  private async _settle(): Promise<void> {
    for (let i = 0; i < 5; i++) {
      if (await this.updateComplete) break;
    }
    const stage = this.renderRoot.querySelector('acp-harness-card-stage') as LitElementType | null;
    if (stage) await stage.updateComplete;
    const compass = stage?.renderRoot?.querySelector(
      SKY_COMPASS_CARD_NAME,
    ) as LitElementType | null;
    if (compass?.updateComplete) await compass.updateComplete;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  }

  private _onServiceCall = (e: ServiceCallEvent): void => {
    const { next, applied } = applyService(this._config, e.domain, e.service, e.data, e.target);
    const entry: ServiceCall = {
      ts: e.ts,
      domain: e.domain,
      service: e.service,
      data: e.data,
      target: e.target,
      applied,
    };
    this._log = [entry, ...this._log].slice(0, MAX_LOG_ENTRIES);
    if (applied) this._config = next;
  };

  private _onConfigChange = (e: CustomEvent<ConfigChangeDetail>): void => {
    // Any user-driven change invalidates the shared snapshot in the URL hash —
    // strip it so the next "Share URL" click starts from a clean slate.
    clearStateFromUrl();
    this._config = e.detail.config;
  };

  private _onClearLog = (): void => {
    this._log = [];
  };

  private _onShareUrl = async (): Promise<void> => {
    const url = writeStateToUrl(this._config);
    const ok = await copyToClipboard(url);
    this._flashShareToast(
      ok
        ? 'URL copied — paste it to reproduce this exact state'
        : `Hash set — copy from address bar`,
    );
  };

  private _onShareJson = async (): Promise<void> => {
    const json = JSON.stringify(this._config, null, 2);
    const ok = await copyToClipboard(json);
    this._flashShareToast(ok ? 'State JSON copied' : 'Clipboard blocked — open devtools to copy');
  };

  private _flashShareToast(msg: string): void {
    this._shareToast = msg;
    if (this._shareToastTimer) clearTimeout(this._shareToastTimer);
    this._shareToastTimer = setTimeout(() => {
      this._shareToast = null;
    }, 3000);
  }

  private _tabButton(id: StageTab, label: string): TemplateResult {
    return html`<button
      class="tab ${this._tab === id ? 'active' : ''}"
      @click=${() => (this._tab = id)}
    >
      ${label}
    </button>`;
  }

  private _onDeviceChange = (e: Event): void => {
    this._device = Number((e.target as HTMLSelectElement).value) || 0;
  };

  /** The active card rendered inside an iframe sized to a device width, so its
   *  viewport @media breakpoints fire (the tile-width control can't reach them).
   *  The iframe boots the same harness in `?embed` mode and live-syncs config
   *  from this window via localStorage. */
  private _renderDeviceFrame(): TemplateResult {
    return html`<div class="device-wrap">
      <div class="device" style="width:${this._device}px">
        <div class="device-bar">${this._device}px · ${this._tab}</div>
        <iframe
          class="device-frame"
          src="?embed=${this._tab}"
          title="Device preview — ${this._device}px"
        ></iframe>
      </div>
    </div>`;
  }

  private _deviceSelect(): TemplateResult {
    return html`<label
      class="device-select"
      title="Render the active card in an iframe sized to a device. This is the only way to trip viewport @media breakpoints (e.g. the phone tile-reflow at ≤500px) — the tile-width control only fakes the container width."
    >
      📱
      <select @change=${this._onDeviceChange}>
        ${DEVICE_PRESETS.map(
          (d) => html`<option value=${d.w} ?selected=${d.w === this._device}>${d.label}</option>`,
        )}
      </select>
    </label>`;
  }

  private _renderStage(): TemplateResult {
    const showGallery = this._tab === 'badges' && !this._capture;
    // Capture mode renders all enabled cards (activeCard undefined) so the
    // screenshot scripts keep working; otherwise show only the active card tab.
    const card = this._tab === 'badges' ? undefined : this._tab;
    // Device preview owns the stage when on (but never in capture mode, where
    // the screenshot scripts expect the cards rendered directly).
    const showDevice = this._device > 0 && !this._capture;
    return html`
      ${this._capture
        ? // The capture scripts screenshot a single card's bounding box; a sticky
          // tab bar would paint over the top of that card. Drop it entirely in
          // capture mode (which renders all enabled cards, not a tab selection).
          ''
        : html`<nav class="tabs">
            ${this._tabButton('root', 'Root')} ${this._tabButton('compass', 'Sky compass')}
            ${this._tabButton('tile', 'Tile')} ${this._tabButton('badges', 'Badge gallery')}
            ${this._deviceSelect()}
          </nav>`}
      ${showDevice
        ? this._renderDeviceFrame()
        : showGallery
          ? html`<acp-harness-badge-gallery .hass=${this._hass}></acp-harness-badge-gallery>`
          : html`<acp-harness-card-stage
              .hass=${this._hass}
              .config=${this._config}
              .activeCard=${this._capture ? undefined : card}
            ></acp-harness-card-stage>`}
    `;
  }

  protected render(): TemplateResult {
    if (this._embed) {
      // Inside a device-preview iframe: just the active card, no chrome, filling
      // (and scrolling within) the iframe's device-sized viewport.
      return html`<div class="embed-stage">
        ${this._tab === 'badges'
          ? html`<acp-harness-badge-gallery .hass=${this._hass}></acp-harness-badge-gallery>`
          : html`<acp-harness-card-stage
              .hass=${this._hass}
              .config=${this._config}
              .activeCard=${this._tab}
              .embed=${true}
            ></acp-harness-card-stage>`}
      </div>`;
    }
    return html`
      <div class="layout">
        <aside class="controls">
          <header class="top">
            <strong>ACP Card Harness</strong>
            <span class="sub">No HA required</span>
            <span class="share">
              <button
                class="share-btn"
                title="Encode the current state into the URL hash and copy a shareable link"
                @click=${this._onShareUrl}
              >
                🔗 Share URL
              </button>
              <button
                class="share-btn"
                title="Copy the current state as JSON to the clipboard"
                @click=${this._onShareJson}
              >
                { } JSON
              </button>
            </span>
          </header>
          <acp-harness-control-panel
            .config=${this._config}
            @config-change=${this._onConfigChange}
          ></acp-harness-control-panel>
        </aside>
        <main class="stage">${this._renderStage()}</main>
        <section class="log">
          <acp-harness-service-log
            .calls=${this._log}
            @clear-log=${this._onClearLog}
          ></acp-harness-service-log>
        </section>
        ${this._shareToast ? html`<div class="toast">${this._shareToast}</div>` : ''}
      </div>
    `;
  }

  public static styles = css`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }
    .layout {
      display: grid;
      grid-template-columns: 360px 1fr;
      grid-template-rows: 1fr 200px;
      grid-template-areas:
        'controls stage'
        'controls log';
      height: 100vh;
      gap: 0;
    }
    .controls {
      grid-area: controls;
      background: var(--harness-panel-bg);
      border-right: 1px solid var(--harness-border);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    .controls .top {
      padding: 10px 12px;
      border-bottom: 1px solid var(--harness-border);
      display: flex;
      align-items: baseline;
      gap: 8px;
      position: sticky;
      top: 0;
      background: var(--harness-panel-bg);
      z-index: 1;
    }
    .controls .top .sub {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
    }
    .controls .top .share {
      margin-left: auto;
      display: inline-flex;
      gap: 4px;
    }
    .share-btn {
      font-size: 0.72rem;
      padding: 2px 6px;
      border: 1px solid var(--harness-border);
      background: transparent;
      color: inherit;
      border-radius: 4px;
      cursor: pointer;
    }
    .share-btn:hover {
      background: var(--secondary-background-color);
    }
    .toast {
      position: fixed;
      left: 50%;
      bottom: 230px;
      transform: translateX(-50%);
      background: var(--primary-text-color);
      color: var(--card-background-color);
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 0.82rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
      z-index: 1000;
      pointer-events: none;
    }
    .stage {
      grid-area: stage;
      overflow-y: auto;
    }
    .tabs {
      position: sticky;
      top: 0;
      z-index: 1;
      display: flex;
      gap: 4px;
      padding: 8px 12px 0;
      background: var(--card-background-color, #fff);
      border-bottom: 1px solid var(--harness-border);
    }
    .tab {
      font: inherit;
      font-size: 0.8rem;
      padding: 6px 14px;
      border: 1px solid var(--harness-border);
      border-bottom: none;
      border-radius: 6px 6px 0 0;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .tab:hover {
      background: var(--secondary-background-color);
    }
    .tab.active {
      color: var(--primary-text-color);
      background: var(--secondary-background-color);
      font-weight: 600;
    }
    .device-select {
      margin-left: auto;
      align-self: center;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8rem;
      color: var(--secondary-text-color);
      cursor: pointer;
      padding-bottom: 8px;
    }
    .device-select select {
      font: inherit;
      font-size: 0.76rem;
      padding: 2px 4px;
      border: 1px solid var(--harness-border);
      border-radius: 4px;
      background: transparent;
      color: inherit;
      cursor: pointer;
    }
    .device-wrap {
      display: flex;
      justify-content: center;
      padding: 16px;
    }
    .device {
      max-width: 100%;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--harness-border);
      border-radius: 16px;
      overflow: hidden;
      background: var(--card-background-color, #fff);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.22);
    }
    .device-bar {
      font-size: 0.7rem;
      text-align: center;
      padding: 4px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-bottom: 1px solid var(--harness-border);
    }
    .device-frame {
      border: 0;
      width: 100%;
      height: calc(100vh - 248px);
      background: var(--card-background-color, #fff);
    }
    .embed-stage {
      height: 100vh;
      overflow: auto;
      box-sizing: border-box;
      /* card-stage[embed] owns its own HA-like gutter; no extra padding here. */
    }
    .log {
      grid-area: log;
      border-top: 1px solid var(--harness-border);
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'acp-harness-app': AcpHarnessApp;
  }
}
