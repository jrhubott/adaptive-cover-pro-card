import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { ServiceCall } from './mock/services';

@customElement('acp-harness-service-log')
export class AcpHarnessServiceLog extends LitElement {
  @property({ attribute: false }) calls: ServiceCall[] = [];

  protected render(): TemplateResult {
    return html`
      <div class="header">
        <span class="title">Service log</span>
        <span class="count">${this.calls.length}</span>
        <button class="action" @click=${this._clear} ?disabled=${this.calls.length === 0}>
          Clear
        </button>
        <button class="action" @click=${this._copy} ?disabled=${this.calls.length === 0}>
          Copy JSON
        </button>
      </div>
      <ol class="entries">
        ${this.calls.length === 0
          ? html`<li class="empty">No service calls yet — interact with a card.</li>`
          : this.calls.map(
              (c, i) => html`
                <li class=${c.applied ? 'entry applied' : 'entry unhandled'}>
                  <span class="idx">${this.calls.length - i}</span>
                  <span class="when">${this._fmtTime(c.ts)}</span>
                  <code class="svc">${c.domain}.${c.service}</code>
                  <code class="args">${this._fmtArgs(c)}</code>
                  ${c.applied
                    ? html`<span class="tag applied-tag">applied</span>`
                    : html`<span class="tag unhandled-tag">log-only</span>`}
                </li>
              `,
            )}
      </ol>
    `;
  }

  private _fmtTime(ts: number): string {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  }

  private _fmtArgs(c: ServiceCall): string {
    const merged = { ...(c.data ?? {}), ...(c.target ?? {}) };
    if (Object.keys(merged).length === 0) return '{}';
    return JSON.stringify(merged);
  }

  private _clear = (): void => {
    this.dispatchEvent(new CustomEvent('clear-log', { bubbles: true, composed: true }));
  };

  private _copy = async (): Promise<void> => {
    const payload = JSON.stringify(this.calls, null, 2);
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      // ignore
    }
  };

  public static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-bottom: 1px solid var(--harness-border);
      background: var(--harness-panel-bg);
    }
    .title {
      font-weight: 600;
    }
    .count {
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .action {
      margin-left: auto;
      padding: 2px 8px;
      border: 1px solid var(--harness-border);
      background: transparent;
      color: inherit;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
    }
    .action:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .action + .action {
      margin-left: 4px;
    }
    .entries {
      flex: 1 1 auto;
      overflow-y: auto;
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 0.8rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .entry {
      display: grid;
      grid-template-columns: 28px 64px minmax(140px, 1fr) minmax(120px, 2fr) 64px;
      gap: 6px;
      padding: 4px 10px;
      border-bottom: 1px solid var(--harness-border);
      align-items: center;
    }
    .idx {
      color: var(--secondary-text-color);
      text-align: right;
    }
    .when {
      color: var(--secondary-text-color);
    }
    .svc {
      color: var(--primary-color);
    }
    .args {
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .tag {
      font-size: 0.7rem;
      padding: 1px 6px;
      border-radius: 999px;
      text-align: center;
    }
    .applied-tag {
      background: rgba(76, 175, 80, 0.18);
      color: #2e7d32;
    }
    .unhandled-tag {
      background: rgba(255, 152, 0, 0.18);
      color: #e65100;
    }
    .empty {
      padding: 16px;
      text-align: center;
      color: var(--secondary-text-color);
    }
  `;
}
