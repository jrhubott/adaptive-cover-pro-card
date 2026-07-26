import { describe, it, expect, beforeEach } from 'vitest';
import '../src/components/group-member-row';
import { TILE_CARD_NAME } from '../src/const';
import type { HomeAssistant } from 'custom-card-helpers';
import { loadEntityRegistry, _resetRegistryStore } from '../src/lib/registry-store';

interface RowLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  entityId?: string;
  position?: number | null;
  acpManaged?: boolean;
}

const MEMBER = 'cover.living_left';

/** A stand-in for the real tile card: same imperative contract (`setConfig` +
 *  `hass`) and, crucially, the same `composed: true` event dispatch from inside
 *  its shadow root that the real card's more-info dialog uses. */
class FakeTileCard extends HTMLElement {
  public hass?: HomeAssistant;
  public config?: unknown;
  public setConfig(config: unknown): void {
    this.config = config;
  }
  /** Emit from inside this element's shadow root, exactly like the real card's
   *  nested `<acp-more-info-dialog>` does when the user dismisses it. */
  public emitFromShadow(type: string): void {
    const root = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
    let inner = root.querySelector('div');
    if (!inner) {
      inner = document.createElement('div');
      root.appendChild(inner);
    }
    inner.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true }));
  }
}

if (!customElements.get(TILE_CARD_NAME)) {
  customElements.define(TILE_CARD_NAME, FakeTileCard);
}

function makeHass(): HomeAssistant {
  return {
    states: {
      // The member's own ACP position sensor. `actual_positions` is what
      // resolveCoverEntryId keys on — deliberately NOT `member_positions`.
      'sensor.acp_living_position': {
        state: '40',
        attributes: { actual_positions: { [MEMBER]: 40 } },
      },
      [MEMBER]: { state: 'open', attributes: { friendly_name: 'Living Left' } },
    },
  } as unknown as HomeAssistant;
}

async function mount(): Promise<RowLike> {
  const el = document.createElement('acp-group-member-row') as RowLike;
  el.hass = makeHass();
  el.entityId = MEMBER;
  el.position = 40;
  el.acpManaged = true;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

beforeEach(async () => {
  document.body.innerHTML = '';
  _resetRegistryStore();
  await loadEntityRegistry({
    callWS: async () => [
      {
        entity_id: 'sensor.acp_living_position',
        unique_id: 'living_Cover_Position',
        platform: 'adaptive_cover_pro',
        config_entry_id: 'living_entry',
        device_id: 'dev1',
      },
    ],
  } as unknown as Parameters<typeof loadEntityRegistry>[0]);
});

describe('acp-group-member-row', () => {
  it('renders the member as its own tile card, pinned to that member cover', async () => {
    const el = await mount();
    const tile = el.shadowRoot!.querySelector(TILE_CARD_NAME) as FakeTileCard | null;
    expect(tile).not.toBeNull();
    const cfg = tile!.config as { entry_id: string; cover: string };
    // Its OWN entry, not the group's — and pinned so a multi-cover entry doesn't
    // render the same cover for every roster row.
    expect(cfg.entry_id).toBe('living_entry');
    expect(cfg.cover).toBe(MEMBER);
  });

  // The regression this file exists for: `acp-dialog-close` is composed, so
  // without a boundary it escapes the roster and reaches the GROUP tile card's
  // own `@acp-dialog-close` listener, closing the group dialog the moment a
  // member's dialog is dismissed.
  it('contains the nested tile card dialog events instead of leaking them', async () => {
    const el = await mount();
    const tile = el.shadowRoot!.querySelector(TILE_CARD_NAME) as FakeTileCard;

    const escaped: string[] = [];
    for (const type of ['acp-dialog-close', 'acp-tile-tap', 'acp-open-more-info', 'acp-tilt-set']) {
      document.body.addEventListener(type, () => escaped.push(type));
    }

    tile.emitFromShadow('acp-dialog-close');
    tile.emitFromShadow('acp-tile-tap');
    tile.emitFromShadow('acp-open-more-info');
    tile.emitFromShadow('acp-tilt-set');

    expect(escaped).toEqual([]);
  });

  it('falls back to the compact controllable row for a member with no ACP entry', async () => {
    const el = document.createElement('acp-group-member-row') as RowLike;
    el.hass = makeHass();
    el.entityId = 'cover.hall_generic';
    el.position = 20;
    el.acpManaged = false;
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector(TILE_CARD_NAME)).toBeNull();
    expect(el.shadowRoot!.querySelector('.member')).not.toBeNull();
    expect(el.shadowRoot!.querySelectorAll('.move-buttons button').length).toBe(3);
  });
});
