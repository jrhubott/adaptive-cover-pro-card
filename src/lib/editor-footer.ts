import { html, type TemplateResult } from 'lit';
import type { HomeAssistant } from 'custom-card-helpers';

import { CARD_VERSION } from '../const';
import { t } from './i18n';

const BMC_URL = 'https://www.buymeacoffee.com/jrhubott';
const BMC_BADGE =
  'https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black';

/**
 * Shared editor footer: Buy Me a Coffee badge on the left, card version on the
 * right. Used by all three card editors so the support link lives in one place.
 * Relies on each editor's existing `.version-footer` / `.dim` style rules for
 * the version text.
 */
export function renderEditorFooter(hass: HomeAssistant): TemplateResult {
  return html`
    <div
      class="editor-footer"
      style="display:flex;align-items:center;justify-content:space-between;gap:8px;"
    >
      <a href=${BMC_URL} target="_blank" rel="noopener noreferrer">
        <img src=${BMC_BADGE} alt=${t('editor.common.support_alt', hass)} height="20" />
      </a>
      <span class="version-footer dim">
        ${t('root.footer_version', hass, { version: CARD_VERSION })}
      </span>
    </div>
  `;
}
