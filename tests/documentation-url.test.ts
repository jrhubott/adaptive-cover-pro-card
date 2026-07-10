import { describe, it, expect } from 'vitest';

// Importing each card module runs its `window.customCards.push(...)` side effect,
// registering the card (and its documentationURL) with HA's card picker.
import '../src/adaptive-cover-pro-card';
import '../src/adaptive-cover-pro-decision-card';
import '../src/adaptive-cover-pro-sky-compass-card';
import '../src/adaptive-cover-pro-tile-card';

import { CARD_NAME, DECISION_CARD_NAME, SKY_COMPASS_CARD_NAME, TILE_CARD_NAME } from '../src/const';

// The canonical help-link target for every card this repo ships. HA surfaces this
// as the "?" documentation link in the card picker. Keeping all four cards on one
// URL is the invariant this test guards — see issue #186.
const CANONICAL_DOCUMENTATION_URL =
  'https://github.com/jrhubott/adaptive-cover-pro/wiki/Lovelace-Card';

const CARD_TYPES = [CARD_NAME, DECISION_CARD_NAME, SKY_COMPASS_CARD_NAME, TILE_CARD_NAME];

describe('card documentationURL registration', () => {
  it('registers all four cards in window.customCards', () => {
    const registered = new Set((window.customCards ?? []).map((c) => c.type));
    for (const type of CARD_TYPES) {
      expect(registered.has(type)).toBe(true);
    }
  });

  it('points every card at the same canonical documentation URL', () => {
    for (const type of CARD_TYPES) {
      const entry = (window.customCards ?? []).find((c) => c.type === type);
      expect(entry, `no customCards entry for ${type}`).toBeDefined();
      expect(entry?.documentationURL, `${type} documentationURL`).toBe(CANONICAL_DOCUMENTATION_URL);
    }
  });
});
