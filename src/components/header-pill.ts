import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { tooltip } from '../lib/tooltip';

@customElement('acp-header-pill')
export class AcpHeaderPill extends LitElement {
  @property({ type: Boolean }) public on = false;
  @property({ type: Boolean }) public readonly = false;
  @property({ type: String }) public label = '';
  @property({ type: String }) public title = '';

  private _handleClick(): void {
    if (this.readonly) return;
    this.dispatchEvent(new CustomEvent('pill-click', { bubbles: true, composed: true }));
  }

  protected render() {
    return html`
      <button
        class="pill ${this.on ? 'on' : 'off'} ${this.readonly ? 'readonly' : ''}"
        ${tooltip(this.title)}
        aria-disabled=${this.readonly ? 'true' : nothing}
        tabindex=${this.readonly ? '-1' : '0'}
        @click=${this._handleClick}
      >
        ${this.label}
      </button>
    `;
  }

  public static styles = css`
    .pill {
      padding: 2px 10px;
      border-radius: 999px;
      border: 1px solid var(--divider-color);
      background: transparent;
      font-size: 0.78rem;
      letter-spacing: 0.04em;
      cursor: pointer;
      color: var(--secondary-text-color);
    }
    .pill.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: transparent;
    }
    .pill.off {
      opacity: 0.6;
    }
    .pill.readonly {
      cursor: default;
      opacity: 0.85;
    }
    /* Readonly pills aren't clickable, so a help cursor is a useful "hover for
       more" hint; clickable pills keep their pointer cursor (below). The shown
       state reverts to default once OUR bubble appears. */
    .pill.readonly[data-tooltip]:hover {
      cursor: help;
    }
    .pill[data-tooltip][acp-tt-shown] {
      cursor: default;
    }
    .pill.on.readonly {
      opacity: 0.85;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'acp-header-pill': AcpHeaderPill;
  }
}
