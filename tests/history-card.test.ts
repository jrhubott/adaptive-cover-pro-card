import { describe, it, expect, beforeEach } from 'vitest';
import '../src/adaptive-cover-pro-history-card';
import { HISTORY_CARD_NAME, HISTORY_DEFAULT_HOURS } from '../src/const';
import type { AdaptiveCoverProHistoryCardConfig } from '../src/types';

const TYPE = `custom:${HISTORY_CARD_NAME}`;
const ENTRY = 'entry_abc';

interface CardLike extends HTMLElement {
  setConfig: (config: AdaptiveCoverProHistoryCardConfig) => void;
  getCardSize: () => number;
  getGridOptions: () => { columns: number; rows: string; min_columns: number; max_columns: number };
}

function makeCard(): CardLike {
  return document.createElement(HISTORY_CARD_NAME) as CardLike;
}

describe('adaptive-cover-pro-history-card — setConfig', () => {
  it('accepts a minimal config', () => {
    expect(() => makeCard().setConfig({ type: TYPE, entry_id: ENTRY })).not.toThrow();
  });

  it('rejects a missing or empty entry_id', () => {
    const el = makeCard();
    expect(() => el.setConfig({ type: TYPE } as AdaptiveCoverProHistoryCardConfig)).toThrow(
      /entry_id/,
    );
    expect(() => el.setConfig({ type: TYPE, entry_id: '' })).toThrow(/entry_id/);
  });

  it('rejects a non-string entry_id', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({ type: TYPE, entry_id: 42 } as unknown as AdaptiveCoverProHistoryCardConfig),
    ).toThrow(/entry_id/);
  });

  it('rejects a non-positive or non-numeric hours', () => {
    const el = makeCard();
    expect(() => el.setConfig({ type: TYPE, entry_id: ENTRY, hours: 0 })).toThrow(/hours/);
    expect(() => el.setConfig({ type: TYPE, entry_id: ENTRY, hours: -6 })).toThrow(/hours/);
    expect(() =>
      el.setConfig({
        type: TYPE,
        entry_id: ENTRY,
        hours: '24',
      } as unknown as AdaptiveCoverProHistoryCardConfig),
    ).toThrow(/hours/);
  });

  it('accepts an omitted hours — the card supplies the default', () => {
    expect(() => makeCard().setConfig({ type: TYPE, entry_id: ENTRY })).not.toThrow();
    expect(HISTORY_DEFAULT_HOURS).toBe(24);
  });
});

describe('adaptive-cover-pro-history-card — layout contract', () => {
  it('reports a card size', () => {
    const el = makeCard();
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    expect(el.getCardSize()).toBeGreaterThan(0);
  });

  it('auto-sizes its height in a Sections dashboard', () => {
    // `rows: 'auto'` is what keeps a tall stack of tracks from being clipped by
    // a fixed grid-row height (the issue #146 failure mode on the compass card).
    const el = makeCard();
    el.setConfig({ type: TYPE, entry_id: ENTRY });
    expect(el.getGridOptions()).toMatchObject({ rows: 'auto', columns: 12 });
  });
});

describe('adaptive-cover-pro-history-card — registration', () => {
  beforeEach(() => {
    // The module registers on import; the array persists across tests.
  });

  it('registers itself exactly once in the card picker', () => {
    const matches = (window.customCards ?? []).filter((c) => c.type === HISTORY_CARD_NAME);
    expect(matches).toHaveLength(1);
  });

  it('offers a preview and a documentation link', () => {
    const entry = (window.customCards ?? []).find((c) => c.type === HISTORY_CARD_NAME)!;
    expect(entry.preview).toBe(true);
    expect(entry.documentationURL).toMatch(/^https:\/\//);
    expect(entry.name).toMatch(/History/);
  });
});
