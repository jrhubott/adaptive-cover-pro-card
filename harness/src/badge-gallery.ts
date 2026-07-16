import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { BADGE_TOKENS, type BadgeKind } from '../../src/const';
import '../../src/components/tile-badge';

/** Fixed point in time the manual-countdown variants format to "04:35 PM".
 *  A literal ISO is parsed directly, so the harness fake clock doesn't shift it. */
const MANUAL_END_ISO = '2026-06-09T16:35:00';

interface Variant {
  caption: string;
  render: (hass?: HomeAssistant) => TemplateResult;
}

/** Contextual / non-default badge forms that the "all kinds" grid can't show
 *  on its own (countdown clock, slot suffixes, resumable affordance, compact). */
const VARIANTS: Variant[] = [
  {
    caption: 'Manual · countdown clock',
    render: (hass) =>
      html`<acp-tile-badge
        .hass=${hass}
        kind-override="manual"
        manual-end-iso=${MANUAL_END_ISO}
      ></acp-tile-badge>`,
  },
  {
    caption: 'Manual · resumable (tappable ↺)',
    render: (hass) =>
      html`<acp-tile-badge
        .hass=${hass}
        kind-override="manual"
        manual-end-iso=${MANUAL_END_ISO}
        resumable
      ></acp-tile-badge>`,
  },
  {
    caption: 'Manual · extendable + resumable (two buttons)',
    render: (hass) =>
      html`<acp-tile-badge
        .hass=${hass}
        kind-override="manual"
        manual-end-iso=${MANUAL_END_ISO}
        manual-active
        resumable
        extendable
      ></acp-tile-badge>`,
  },
  {
    caption: 'Manual · extendable + resumable, compact (kind icon dropped)',
    render: (hass) =>
      html`<acp-tile-badge
        .hass=${hass}
        kind-override="manual"
        manual-end-iso=${MANUAL_END_ISO}
        manual-active
        resumable
        extendable
        compact
      ></acp-tile-badge>`,
  },
  {
    caption: 'Custom · named slot + % + floor',
    render: (hass) =>
      html`<acp-tile-badge
        .hass=${hass}
        kind-override="custom_position"
        slot-name="Table extension"
        .pct=${60}
        minimum-mode
      ></acp-tile-badge>`,
  },
  {
    caption: 'Custom · slot number + %',
    render: (hass) =>
      html`<acp-tile-badge
        .hass=${hass}
        kind-override="custom_position"
        .slotNumber=${2}
        .pct=${30}
      ></acp-tile-badge>`,
  },
  {
    caption: 'Auto · compact',
    render: (hass) =>
      html`<acp-tile-badge .hass=${hass} kind-override="auto" compact></acp-tile-badge>`,
  },
  {
    caption: 'Custom · compact',
    render: (hass) =>
      html`<acp-tile-badge
        .hass=${hass}
        kind-override="custom_position"
        slot-name="Table extension"
        .pct=${60}
        compact
      ></acp-tile-badge>`,
  },
];

/**
 * Reference view listing every badge the tile card can render. Driven off
 * {@link BADGE_TOKENS} so a newly added {@link BadgeKind} appears automatically;
 * the hand-authored VARIANTS row covers the contextual label forms the bare
 * kind grid can't express.
 */
@customElement('acp-harness-badge-gallery')
export class AcpHarnessBadgeGallery extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;

  protected render(): TemplateResult {
    const kinds = Object.keys(BADGE_TOKENS) as BadgeKind[];
    return html`
      <h2 class="heading">All badge kinds <span class="hint">(${kinds.length})</span></h2>
      <div class="grid" id="kinds">
        ${kinds.map(
          (kind) => html`
            <div class="cell">
              <code class="label">${kind}</code>
              <acp-tile-badge .hass=${this.hass} kind-override=${kind}></acp-tile-badge>
            </div>
          `,
        )}
      </div>

      <h2 class="heading">Contextual variants</h2>
      <div class="grid" id="variants">
        ${VARIANTS.map(
          (v) => html`
            <div class="cell">
              <code class="label">${v.caption}</code>
              ${v.render(this.hass)}
            </div>
          `,
        )}
      </div>
    `;
  }

  public static styles = css`
    :host {
      display: block;
      padding: 16px;
      box-sizing: border-box;
    }
    .heading {
      margin: 18px 0 8px;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--secondary-text-color);
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .heading .hint {
      font-weight: 400;
      text-transform: none;
      letter-spacing: 0;
      color: var(--secondary-text-color);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;
    }
    .cell {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      padding: 12px;
      border: 1px solid var(--harness-border);
      border-radius: 8px;
      background: var(--harness-panel-bg);
    }
    .label {
      font-size: 0.72rem;
      color: var(--secondary-text-color);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'acp-harness-badge-gallery': AcpHarnessBadgeGallery;
  }
}
