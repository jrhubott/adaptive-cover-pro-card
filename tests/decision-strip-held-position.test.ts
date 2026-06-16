/**
 * Tests for held_position rendering on the manual_override step (issue #161).
 *
 * Three cases per TDD spec:
 *   A. held present  → .pos shows held %, .reason-inline contains solar %
 *   B. held absent   → .pos shows solar %, no solar context fragment (back-compat)
 *   C. held is 0     → .pos shows "0%" (not "55%", not empty)
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

/** Build a mock hass with a single manual step on the trace. */
function hass(manualStep: Record<string, unknown>): HomeAssistant {
  return {
    states: {
      'sensor.d_trace': {
        state: 'manual',
        attributes: {
          reason: 'manual override active',
          trace: [{ handler: 'ManualOverrideHandler', ...manualStep }],
        },
      },
    },
  } as unknown as HomeAssistant;
}

describe('decision-strip held_position rendering', () => {
  // Case A: held_position present → primary cell shows held %, reason-inline has solar %
  it('(A) shows held_position % in .pos and solar context in .reason-inline when held_position is present', async () => {
    const el = await mount('acp-decision-strip');
    el.hass = hass({ matched: true, reason: 'holding', position: 60, held_position: 44 });
    el.discovered = baseDiscovered;
    await flush(el);

    const winner = el.shadowRoot!.querySelector('.row.winner');
    expect(winner).toBeTruthy();

    const posSpan = winner!.querySelector('.pos');
    expect(posSpan).toBeTruthy();
    expect(posSpan!.textContent).toContain('44%');
    // Must NOT show the solar value (60%) in the primary pos cell
    expect(posSpan!.textContent).not.toContain('60%');

    // The reason-inline span should include the solar context ("60%")
    const reasonSpan = winner!.querySelector('.reason-inline');
    expect(reasonSpan).toBeTruthy();
    expect(reasonSpan!.textContent).toContain('60%');
  });

  // Case B: held_position absent → .pos shows solar %, no solar context in reason-inline
  it('(B) shows position % in .pos and no solar context in .reason-inline when held_position is absent', async () => {
    const el = await mount('acp-decision-strip');
    el.hass = hass({ matched: true, reason: 'holding', position: 60 });
    el.discovered = baseDiscovered;
    await flush(el);

    const winner = el.shadowRoot!.querySelector('.row.winner');
    expect(winner).toBeTruthy();

    const posSpan = winner!.querySelector('.pos');
    expect(posSpan).toBeTruthy();
    expect(posSpan!.textContent).toContain('60%');

    // No solar context fragment should appear (backward-compat)
    const reasonSpan = winner!.querySelector('.reason-inline');
    expect(reasonSpan).toBeTruthy();
    // The reason-inline text should be just the reason, not containing a "solar" context
    // (it must not contain "solar" as added context — the reason text itself "holding" does not)
    expect(reasonSpan!.textContent).not.toContain('solar');
  });

  // Case C: held_position is 0 → .pos shows "0%" (not "55%", not empty)
  it('(C) shows 0% in .pos when held_position is 0 (not empty, not falling back to position)', async () => {
    const el = await mount('acp-decision-strip');
    el.hass = hass({ matched: true, reason: 'holding at floor', position: 55, held_position: 0 });
    el.discovered = baseDiscovered;
    await flush(el);

    const winner = el.shadowRoot!.querySelector('.row.winner');
    expect(winner).toBeTruthy();

    const posSpan = winner!.querySelector('.pos');
    expect(posSpan).toBeTruthy();
    // Must show "0%" — not empty string, not "55%"
    expect(posSpan!.textContent?.trim()).toContain('0%');
    expect(posSpan!.textContent).not.toContain('55%');
  });
});
