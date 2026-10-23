import { describe, it, expect, beforeEach } from 'vitest';
import '../src/components/cover-move-buttons';
import type { HomeAssistant } from 'custom-card-helpers';
import { readGroup, restrictSnapshot } from '../src/lib/group-controls';
import type { DiscoveredEntities } from '../src/types';

interface ButtonsLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  position?: number | null;
  assumedState?: boolean;
}

const HASS = { localize: (k: string) => k, language: 'en', states: {} } as unknown as HomeAssistant;

async function mount(position: number | null, assumedState = false): Promise<ShadowRoot> {
  const el = document.createElement('acp-cover-move-buttons') as ButtonsLike;
  el.hass = HASS;
  el.position = position;
  el.assumedState = assumedState;
  document.body.appendChild(el);
  await el.updateComplete;
  return el.shadowRoot!;
}

const btn = (root: ShadowRoot, cls: string): HTMLButtonElement =>
  root.querySelector(`button.${cls}`) as HTMLButtonElement;

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('acp-cover-move-buttons — at-the-end disabling', () => {
  it('disables ↑ at 100 and ↓ at 0 for a cover with real feedback', async () => {
    const open = await mount(100);
    expect(btn(open, 'up').disabled).toBe(true);
    expect(btn(open, 'down').disabled).toBe(false);
    const closed = await mount(0);
    expect(btn(closed, 'up').disabled).toBe(false);
    expect(btn(closed, 'down').disabled).toBe(true);
  });

  it('keeps ↑ and ↓ live at either end for an assumed-state cover', async () => {
    // No position feedback: the reported value is a guess, so it must never
    // strand the user without the command that would actually move the cover.
    for (const pos of [0, 100]) {
      const root = await mount(pos, true);
      expect(btn(root, 'up').disabled).toBe(false);
      expect(btn(root, 'down').disabled).toBe(false);
    }
  });
});

describe('readGroup — assumedState', () => {
  const discovered = {
    entry_id: 'g',
    entry_title: 'Patio',
    cover_type: 'cover_blind',
    is_group: true,
    managed_covers: [],
    entities: { group_position_sensor: 'sensor.group_position' },
  } as unknown as DiscoveredEntities;

  const hass = {
    states: {
      'sensor.group_position': {
        state: '100',
        attributes: { member_positions: { 'cover.shade': 100, 'cover.awning': 100 } },
      },
      'cover.shade': { state: 'open', attributes: { current_position: 100 } },
      'cover.awning': { state: 'open', attributes: { current_position: 100, assumed_state: true } },
    },
  } as unknown as HomeAssistant;

  it('is true when any member is assumed-state', () => {
    expect(readGroup(hass, discovered).assumedState).toBe(true);
  });

  it('is recomputed over the visible members only', () => {
    const full = readGroup(hass, discovered);
    expect(restrictSnapshot(hass, full, new Set(['cover.awning'])).assumedState).toBe(false);
    expect(restrictSnapshot(hass, full, new Set(['cover.shade'])).assumedState).toBe(true);
  });
});
