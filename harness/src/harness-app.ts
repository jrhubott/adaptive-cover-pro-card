import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { buildMockHass, type ServiceCallEvent } from './mock/hass';
import { applyService, type ServiceCall } from './mock/services';
import { defaultScenarioConfig, normalizeConfig } from './scenarios';
import { loadConfig, saveConfig } from './persistence';
import { setFakeNow } from './fake-clock';
import {
  clearStateFromUrl,
  copyToClipboard,
  readStateFromUrl,
  writeStateToUrl,
} from './share-state';
import type { HarnessConfig } from './types';
import type { ConfigChangeDetail } from './control-panel';
import './control-panel';
import './card-stage';
import './service-log';

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

  private _playInterval: ReturnType<typeof setInterval> | null = null;
  private _shareToastTimer: ReturnType<typeof setTimeout> | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this._rebuildHass();
    this._applyTheme();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearPlayInterval();
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has('_config')) {
      this._rebuildHass();
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
    // Parse the harness date in local time (matches what state-gen does), then
    // add the time-of-day slider.
    const dayStart = new Date(`${this._config.date}T00:00:00`);
    dayStart.setHours(0, 0, 0, 0);
    return dayStart.getTime() + this._config.timeOfDayMinutes * 60_000;
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
        <main class="stage">
          <acp-harness-card-stage
            .hass=${this._hass}
            .config=${this._config}
          ></acp-harness-card-stage>
        </main>
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
