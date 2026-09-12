/**
 * Tests for reason_code-driven "active blocker" row styling (issue #295).
 *
 * A closed sun-tracking gate is the sole reason a cover sits at 100% for
 * hours, but every skip reason renders with the same dimmed, low-visual-weight
 * treatment today. When a step's `reason_code` is a recognized active-blocker
 * code, the row should render full-weight with a `blocker` modifier class and
 * a tooltip hint, instead of the uniform dimmed skip treatment.
 *
 * Four cases per TDD spec:
 *   A. recognized reason_code   → row carries `skip` + `blocker`, .reason-inline
 *                                 does NOT carry the plain `dim` class.
 *   B. reason_code absent       → back-compat: `.row.skip` only, `.reason-inline.dim`
 *                                 present, no `blocker` class, no tooltip trigger.
 *   C. unrecognized reason_code → no `blocker` class.
 *   D. blocker row              → exposes a tooltip trigger with non-empty hint text.
 */
import { describe, it, expect } from 'vitest';
import '../src/components/decision-strip';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';

interface LitLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  discovered?: DiscoveredEntities;
}

async function mount(tag: string): Promise<LitLike> {
  const el = document.createElement(tag) as LitLike;
  document.body.appendChild(el);
  return el;
}

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

  // Case D: blocker row exposes a tooltip trigger with non-empty hint text
  it('(D) exposes a tooltip trigger with non-empty hint text on the blocker row', async () => {
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
    const hint = reasonSpan!.getAttribute('data-tooltip');
    expect(hint).toBeTruthy();
    expect((hint ?? '').length).toBeGreaterThan(0);
  });
});
