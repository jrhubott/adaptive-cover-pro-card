import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import type { LitElement as LitElementType } from 'lit';
import { SKY_COMPASS_CARD_NAME } from '../../src/const';
import { buildMockHass, type ServiceCallEvent } from './mock/hass';
import { applyService, type ServiceCall } from './mock/services';
import { defaultScenarioConfig, findScenario, normalizeConfig, SCENARIOS } from './scenarios';
import { loadConfig, saveConfig } from './persistence';
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
  @state() private _tab: 'root' | 'compass' | 'tile' | 'badges' = 'root';

  // Capture mode (?capture URL param) keeps card-stage rendering all enabled
  // cards so the screenshot/time-lapse scripts work unchanged.
  private _capture = false;

  private _playInterval: ReturnType<typeof setInterval> | null = null;
  private _shareToastTimer: ReturnType<typeof setTimeout> | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this._rebuildHass();
    this._applyTheme();
    if (new URLSearchParams(location.search).has('capture')) {
      this._capture = true;
      this._installCaptureBridge();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearPlayInterval();
  }

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
      saveConfig(this._config);
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

  private _tabButton(id: typeof this._tab, label: string): TemplateResult {
    return html`<button
      class="tab ${this._tab === id ? 'active' : ''}"
      @click=${() => (this._tab = id)}
    >
      ${label}
    </button>`;
  }

  private _renderStage(): TemplateResult {
    const showGallery = this._tab === 'badges' && !this._capture;
    // Capture mode renders all enabled cards (activeCard undefined) so the
    // screenshot scripts keep working; otherwise show only the active card tab.
    const card = this._tab === 'badges' ? undefined : this._tab;
    return html`
      ${this._capture
        ? // The capture scripts screenshot a single card's bounding box; a sticky
          // tab bar would paint over the top of that card. Drop it entirely in
          // capture mode (which renders all enabled cards, not a tab selection).
          ''
        : html`<nav class="tabs">
            ${this._tabButton('root', 'Root')} ${this._tabButton('compass', 'Sky compass')}
            ${this._tabButton('tile', 'Tile')} ${this._tabButton('badges', 'Badge gallery')}
          </nav>`}
      ${showGallery
        ? html`<acp-harness-badge-gallery .hass=${this._hass}></acp-harness-badge-gallery>`
        : html`<acp-harness-card-stage
            .hass=${this._hass}
            .config=${this._config}
            .activeCard=${this._capture ? undefined : card}
          ></acp-harness-card-stage>`}
    `;
  }

  protected render(): TemplateResult {
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
