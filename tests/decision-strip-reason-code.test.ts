/**
 * Tests for reason_code-driven "active blocker" row styling (issue #295).
 *
 * A closed sun-tracking gate is the sole reason a cover sits at 100% for
 * hours, but every skip reason renders with the same dimmed, low-visual-weight
 * treatment today. When a step's `reason_code` is a recognized active-blocker
 * code, the row should render full-weight with a `blocker` modifier class and
 * a tooltip hint, instead of the uniform dimmed skip treatment.
 *
 * Cases per TDD spec:
 *   A. recognized reason_code   → row carries `skip` + `blocker`, .reason-inline
 *                                 does NOT carry the plain `dim` class.
 *   B. reason_code absent       → back-compat: `.row.skip` only, `.reason-inline.dim`
 *                                 present, no `blocker` class, no tooltip trigger.
 *   C. unrecognized reason_code → no `blocker` class.
 *   D. blocker row              → exposes a tooltip trigger whose text is exactly
 *                                 en.decision.active_blocker_hint (not just non-empty —
 *                                 t() echoes a raw key on a lookup miss, so a typo'd
 *                                 key would otherwise pass a plain truthy check).
 *   E. gate reopening           → a blocker row returns to the normal skip treatment
 *                                 (blocker class, tooltip attrs) when reason_code is
 *                                 cleared on the SAME mounted element.
 *   F. winner guard             → a WINNER row never gets the blocker class, even
 *                                 when it carries a listed reason_code (audit finding 1).
 *   G. keyboard reachability    → the blocker reason span is focusable (tabindex="0")
 *                                 so the tooltip directive's focusin/focusout listeners
 *                                 can reach it; a non-blocker reason span is not.
 */
import { describe, it, expect, afterEach } from 'vitest';
import '../src/components/decision-strip';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';
import { en } from '../src/lib/i18n/en';
import { _resetTooltipSingleton } from '../src/lib/tooltip';

interface LitLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  discovered?: DiscoveredEntities;
}

const mounted: LitLike[] = [];

async function mount(tag: string): Promise<LitLike> {
  const el = document.createElement(tag) as LitLike;
  document.body.appendChild(el);
  mounted.push(el);
  return el;
}

afterEach(() => {
  for (const el of mounted.splice(0)) {
    el.remove();
  }
  _resetTooltipSingleton();
});

async function flush(el: LitLike): Promise<void> {
  await el.updateComplete;
}

const baseDiscovered: DiscoveredEntities = {
  entry_id: 'entry1',
  entry_title: 'Test',
  cover_type: 'cover_blind',
  entities: { decision_trace_sensor: 'sensor.d_trace' },
  managed_covers: [],
};

/** Build a mock hass with a solar step (per the given fields) plus a winning
 *  default step, so the solar row renders as a non-winner ("skip"/"match"). */
function hass(solarStep: Record<string, unknown>): HomeAssistant {
  return {
    states: {
      'sensor.d_trace': {
        state: 'default',
        attributes: {
          reason: 'Default position 50%',
          trace: [
            { handler: 'SolarHandler', matched: false, position: null, ...solarStep },
            {
              handler: 'DefaultHandler',
              matched: true,
              reason: 'Default position 50%',
              position: 50,
            },
          ],
        },
      },
    },
  } as unknown as HomeAssistant;
}

/** Build a mock hass where the solar step itself is the winner. */
function hassSolarWins(solarStep: Record<string, unknown>): HomeAssistant {
  return {
    states: {
      'sensor.d_trace': {
        state: 'solar',
        attributes: {
          reason: 'Solar tracking — calculated 40%',
          trace: [{ handler: 'SolarHandler', matched: true, position: 40, ...solarStep }],
        },
      },
    },
  } as unknown as HomeAssistant;
}

/** Find the pipeline row whose visible name is "Solar Tracking". */
function solarRow(el: LitLike): Element {
  const rows = Array.from(el.shadowRoot!.querySelectorAll('.row'));
  const row = rows.find((r) => r.querySelector('.name')?.textContent === 'Solar Tracking');
  expect(row).toBeTruthy();
  return row!;
}

describe('decision-strip reason_code blocker rendering (#295)', () => {
  // Case A: recognized reason_code → row carries skip + blocker, no dim on reason
  it('(A) adds a blocker class and drops dim on .reason-inline for a recognized reason_code', async () => {
    const el = await mount('acp-decision-strip');
    el.hass = hass({
      reason: 'sun tracking gate is closed',
      reason_code: 'skip.sun_tracking_gate',
    });
    el.discovered = baseDiscovered;
    await flush(el);

    const row = solarRow(el);
    expect(row.classList.contains('skip')).toBe(true);
    expect(row.classList.contains('blocker')).toBe(true);

    const reasonSpan = row.querySelector('.reason-inline');
    expect(reasonSpan).toBeTruthy();
    expect(reasonSpan!.classList.contains('dim')).toBe(false);
  });

  // Case B: reason_code absent → back-compat, identical to today
  it('(B) renders exactly as today when reason_code is absent', async () => {
    const el = await mount('acp-decision-strip');
    el.hass = hass({ reason: 'sun outside FOV' });
    el.discovered = baseDiscovered;
    await flush(el);

    const row = solarRow(el);
    expect(row.classList.contains('skip')).toBe(true);
    expect(row.classList.contains('blocker')).toBe(false);

    const reasonSpan = row.querySelector('.reason-inline');
    expect(reasonSpan).toBeTruthy();
    expect(reasonSpan!.classList.contains('dim')).toBe(true);
    expect(reasonSpan!.getAttribute('data-tooltip')).toBeNull();
  });

  // Case C: unrecognized reason_code → no blocker class
  it('(C) does not add a blocker class for an unrecognized reason_code', async () => {
    const el = await mount('acp-decision-strip');
    el.hass = hass({
      reason: 'no weather alert',
      reason_code: 'skip.something_else',
    });
    el.discovered = baseDiscovered;
    await flush(el);

    const row = solarRow(el);
    expect(row.classList.contains('blocker')).toBe(false);
  });

  // Case D: blocker row exposes a tooltip trigger whose text matches the real i18n string
  it('(D) exposes a tooltip trigger whose text is exactly the active_blocker_hint copy', async () => {
    const el = await mount('acp-decision-strip');
    el.hass = hass({
      reason: 'sun tracking gate is closed',
      reason_code: 'skip.sun_tracking_gate',
    });
    el.discovered = baseDiscovered;
    await flush(el);

    const row = solarRow(el);
    const reasonSpan = row.querySelector('.reason-inline');
    expect(reasonSpan).toBeTruthy();
    expect(reasonSpan!.getAttribute('data-tooltip')).toBe(en.decision.active_blocker_hint);
  });

  // Case E: the gate reopening on the same mounted element restores normal treatment
  it('(E) a blocker row returns to normal when reason_code clears on the same element', async () => {
    const el = await mount('acp-decision-strip');
    el.hass = hass({
      reason: 'sun tracking gate is closed',
      reason_code: 'skip.sun_tracking_gate',
    });
    el.discovered = baseDiscovered;
    await flush(el);

    expect(solarRow(el).classList.contains('blocker')).toBe(true);

    // The gate reopens: the next trace's solar step carries no reason_code.
    el.hass = hass({ reason: 'sun outside FOV' });
    await flush(el);

    const row = solarRow(el);
    expect(row.classList.contains('blocker')).toBe(false);

    const reasonSpan = row.querySelector('.reason-inline');
    expect(reasonSpan).toBeTruthy();
    expect(reasonSpan!.classList.contains('dim')).toBe(true);
    expect(reasonSpan!.getAttribute('data-tooltip')).toBeNull();
    expect(reasonSpan!.hasAttribute('aria-describedby')).toBe(false);
  });

  // Case F: a WINNER row never gets the blocker treatment, even with a listed reason_code
  it('(F) does not add a blocker class to the WINNER row even with a listed reason_code', async () => {
    const el = await mount('acp-decision-strip');
    el.hass = hassSolarWins({
      reason: 'sun tracking gate is closed',
      reason_code: 'skip.sun_tracking_gate',
    });
    el.discovered = baseDiscovered;
    await flush(el);

    const row = solarRow(el);
    expect(row.classList.contains('winner')).toBe(true);
    expect(row.classList.contains('blocker')).toBe(false);
  });

  // Case G: the blocker reason is keyboard-reachable; a normal reason is not
  it('(G) the blocker reason span is focusable (tabindex=0); a normal reason span is not', async () => {
    const blockerEl = await mount('acp-decision-strip');
    blockerEl.hass = hass({
      reason: 'sun tracking gate is closed',
      reason_code: 'skip.sun_tracking_gate',
    });
    blockerEl.discovered = baseDiscovered;
    await flush(blockerEl);
    const blockerReason = solarRow(blockerEl).querySelector('.reason-inline');
    expect(blockerReason!.getAttribute('tabindex')).toBe('0');

    const normalEl = await mount('acp-decision-strip');
    normalEl.hass = hass({ reason: 'sun outside FOV' });
    normalEl.discovered = baseDiscovered;
    await flush(normalEl);
    const normalReason = solarRow(normalEl).querySelector('.reason-inline');
    expect(normalReason!.hasAttribute('tabindex')).toBe(false);
  });
});
