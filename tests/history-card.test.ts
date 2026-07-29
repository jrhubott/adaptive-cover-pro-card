import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../src/adaptive-cover-pro-history-card';
import '../src/components/history-view';
import { HISTORY_CARD_NAME, HISTORY_DEFAULT_HOURS } from '../src/const';
import type { AdaptiveCoverProHistoryCardConfig, DiscoveredEntities } from '../src/types';
import type { HomeAssistant } from 'custom-card-helpers';

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

interface HistoryViewLike extends HTMLElement {
  hass?: HomeAssistant;
  discovered?: DiscoveredEntities;
  hours?: number;
  tracks?: { actions?: boolean };
  updateComplete: Promise<boolean>;
}

const baseDiscovered: DiscoveredEntities = {
  entry_id: 'entry_position_track',
  entry_title: 'Position Track Test',
  cover_type: 'cover_blind',
  entities: {},
  managed_covers: [],
};

/** Wait for the view's fetch-then-render cycle to settle. `_fetch` awaits a
 *  `Promise.all` before assigning any `@state` field, so the render triggered
 *  by mounting happens before the data arrives — a single `updateComplete`
 *  isn't enough. Polling a couple of microtask/macrotask turns is simpler than
 *  threading a fetch-complete hook through the component for tests alone. */
async function flush(el: HistoryViewLike, turns = 20): Promise<void> {
  for (let i = 0; i < turns; i++) {
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

/** Parse a `<polyline points="...">` string into `[x, y]` vertex pairs. */
function parsePoints(raw: string): Array<[number, number]> {
  return raw
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((pair) => pair.split(',').map(Number) as [number, number]);
}

describe('acp-history-view — step-expanded curves (issue #253)', () => {
  it('draws a held vertex across a long gap instead of an interpolated diagonal', async () => {
    // The issue's exact shape: the target sensor holds at 100% for hours, then
    // drops to 0% at one instant. The recorder only stores those two samples,
    // so without step-expansion the polyline is a straight two-vertex ramp
    // from 100% to 0% across the whole gap.
    // `_fetch` derives its window from the real `Date.now()` (`el.hours = 1`
    // below → a 60-minute window ending now), so the fixture must be anchored
    // there too — a hardcoded date makes both samples fall outside whatever
    // window the component actually builds, clamping every vertex to x=0.
    // 10 min of margin at the start and 5 min at the end comfortably absorbs
    // the few milliseconds of drift between capturing `now` here and
    // `_fetch`'s own `Date.now()` call a tick later.
    const now = Date.now();
    const holdStart = now - 50 * 60_000; // 50 min ago
    const drop = now - 5 * 60_000; // 5 min ago

    const callWS = vi.fn().mockResolvedValue({
      'sensor.acp_target_position': [
        { s: '100', lu: holdStart / 1000 },
        { s: '0', lu: drop / 1000 },
      ],
    });

    const el = document.createElement('acp-history-view') as HistoryViewLike;
    el.hass = { callWS, states: {}, config: {} } as unknown as HomeAssistant;
    el.discovered = {
      ...baseDiscovered,
      entities: { target_position_sensor: 'sensor.acp_target_position' },
    };
    el.hours = 1;
    el.tracks = { actions: false };
    document.body.appendChild(el);

    await flush(el);

    const polyline = el.shadowRoot!.querySelector('polyline.target-curve');
    expect(polyline).toBeTruthy();
    const points = parsePoints(polyline!.getAttribute('points') ?? '');

    // Two real samples, one carried-forward hold vertex at the drop, and one
    // terminator extending the dropped value out to the window end ("now")
    // — never a bare two-point diagonal from 100% straight down to 0%.
    expect(points.length).toBe(4);
    const [first, held, dropped, terminator] = points;
    // The held vertex repeats the PRE-DROP y (same as the first vertex) …
    expect(held[1]).toBeCloseTo(first[1], 5);
    // … strictly after the hold-start's x, never collapsed back onto it — a
    // carry vertex anchored to `prev.t` instead of `cur.t` would land held[0]
    // exactly on first[0] and fail this.
    expect(held[0]).toBeGreaterThan(first[0]);
    // And the line does actually reach the dropped value afterwards.
    expect(dropped[1]).not.toBeCloseTo(first[1], 1);
    // The dropped value then holds flat out to the window end rather than the
    // polyline simply stopping at the last real sample.
    expect(terminator[1]).toBeCloseTo(dropped[1], 5);
    expect(terminator[0]).toBeGreaterThan(dropped[0]);

    el.remove();
  });

  it('still shows the empty-state note when both series are genuinely empty', async () => {
    const el = document.createElement('acp-history-view') as HistoryViewLike;
    el.hass = { callWS: vi.fn(), states: {}, config: {} } as unknown as HomeAssistant;
    el.discovered = { ...baseDiscovered, entities: {}, managed_covers: [] };
    el.hours = 1;
    el.tracks = { actions: false };
    document.body.appendChild(el);

    await flush(el);

    expect(el.shadowRoot!.querySelector('polyline.target-curve')).toBeNull();
    expect(el.shadowRoot!.querySelector('polyline.actual-curve')).toBeNull();
    // Scoped to the position track specifically: its `.track-plot` is the only
    // one that pairs an `<svg>` with an `.empty-note` sibling (the who-won and
    // context tracks lay their own `.empty-note` out inside a `.bar` div with
    // no `<svg>`), so this can't pass on the strength of a different track's
    // note while the position track's own note is missing.
    expect(el.shadowRoot!.querySelector('.track-plot svg ~ .empty-note')).toBeTruthy();

    el.remove();
  });
});
