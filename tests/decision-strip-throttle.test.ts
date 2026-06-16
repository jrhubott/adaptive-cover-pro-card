/**
 * Tests for the minimum-interval throttle countdown banner (issue #163).
 *
 * The decision strip reads the `last_skipped_sensor`. When its state is
 * `time_delta_too_small` AND `timestamp + time_threshold_minutes` is still in
 * the future, a "Next adjustment allowed in {time}" banner is shown. The banner
 * is absent when the sensor reports `none`, and absent when the computed
 * next-allowed time has already passed (a latched/stale record).
 *
 *   A. state time_delta_too_small + fresh skip + threshold 15 → banner present
 *   B. state none → banner absent
 *   C. state time_delta_too_small but skipped ~20 min ago, threshold 15 → absent
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

const discovered: DiscoveredEntities = {
  entry_id: 'entry1',
  entry_title: 'Test',
  cover_type: 'cover_blind',
  entities: {
    decision_trace_sensor: 'sensor.d_trace',
    last_skipped_sensor: 'sensor.last_skipped',
  },
  managed_covers: [],
};

/** Build a mock hass with a valid trace plus a configurable last_skipped sensor. */
function hass(skipped: { state: string; attributes?: Record<string, unknown> }): HomeAssistant {
  return {
    states: {
      'sensor.d_trace': {
        state: 'solar',
        attributes: {
          reason: 'solar positioning',
          trace: [{ handler: 'SolarHandler', matched: true, reason: 'solar', position: 89 }],
        },
      },
      'sensor.last_skipped': skipped,
    },
  } as unknown as HomeAssistant;
}

const SKIP_BANNER = '.throttle-countdown';

describe('decision-strip throttle countdown banner', () => {
  // Case A: fresh skip with a future next-allowed → banner present with countdown text
  it('(A) shows the next-change banner when state is time_delta_too_small and not yet expired', async () => {
    const el = await mount('acp-decision-strip');
    el.hass = hass({
      state: 'time_delta_too_small',
      attributes: {
        timestamp: new Date().toISOString(),
        elapsed_minutes: 1,
        time_threshold_minutes: 15,
      },
    });
    el.discovered = discovered;
    await flush(el);

    const banner = el.shadowRoot!.querySelector(SKIP_BANNER);
    expect(banner).toBeTruthy();
    expect(banner!.textContent?.trim().length).toBeGreaterThan(0);
  });

  // Case B: no skip → banner absent
  it('(B) hides the banner when the last_skipped sensor reports none', async () => {
    const el = await mount('acp-decision-strip');
    el.hass = hass({ state: 'none' });
    el.discovered = discovered;
    await flush(el);

    expect(el.shadowRoot!.querySelector(SKIP_BANNER)).toBeNull();
  });

  // Case C: latched stale record whose countdown already expired → banner absent
  it('(C) hides the banner when the computed next-allowed time is already in the past', async () => {
    const el = await mount('acp-decision-strip');
    el.hass = hass({
      state: 'time_delta_too_small',
      attributes: {
        timestamp: new Date(Date.now() - 20 * 60_000).toISOString(),
        elapsed_minutes: 20,
        time_threshold_minutes: 15,
      },
    });
    el.discovered = discovered;
    await flush(el);

    expect(el.shadowRoot!.querySelector(SKIP_BANNER)).toBeNull();
  });
});
