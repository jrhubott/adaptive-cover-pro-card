import { describe, it, expect } from 'vitest';
import '../src/components/decision-strip';
import '../src/components/cover-bar';
import '../src/components/overrides-panel';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';

interface LitLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  discovered?: DiscoveredEntities;
  compact?: boolean;
}

async function mount<T extends LitLike>(tag: string): Promise<T> {
  const el = document.createElement(tag) as T;
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
  entities: {},
  managed_covers: [],
};

describe('acp-decision-strip', () => {
  it('renders all 10 handler rows with the winning one highlighted', async () => {
    const el = await mount<LitLike>('acp-decision-strip');
    el.hass = {
      states: {
        'sensor.d_trace': {
          state: 'solar',
          attributes: {
            reason: 'sun in FOV, tracking',
            trace: [
              {
                handler: 'ForceOverrideHandler',
                matched: false,
                reason: 'no sensors',
                position: null,
              },
              {
                handler: 'WeatherOverrideHandler',
                matched: false,
                reason: 'clear',
                position: null,
              },
              { handler: 'ManualOverrideHandler', matched: false, reason: 'none', position: null },
              {
                handler: 'CustomPositionHandler',
                matched: false,
                reason: 'no sensors',
                position: null,
              },
              {
                handler: 'MotionTimeoutHandler',
                matched: false,
                reason: 'disabled',
                position: null,
              },
              {
                handler: 'CloudSuppressionHandler',
                matched: false,
                reason: 'below threshold',
                position: null,
              },
              { handler: 'ClimateHandler', matched: false, reason: 'not active', position: null },
              { handler: 'GlareZoneHandler', matched: false, reason: 'no zones', position: null },
              { handler: 'SolarHandler', matched: true, reason: 'sun valid', position: 42 },
              { handler: 'DefaultHandler', matched: false, reason: 'fallback', position: null },
            ],
          },
        },
      },
    } as unknown as HomeAssistant;
    el.discovered = {
      ...baseDiscovered,
      entities: { decision_trace_sensor: 'sensor.d_trace' },
    };
    await flush(el);
    const rows = el.shadowRoot!.querySelectorAll('.row');
    expect(rows.length).toBe(10);
    expect(el.shadowRoot!.querySelector('.row.winner')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.row.winner')!.textContent).toContain('Solar');
  });

  it('shows a placeholder when trace is missing', async () => {
    const el = await mount<LitLike>('acp-decision-strip');
    el.hass = { states: {} } as unknown as HomeAssistant;
    el.discovered = { ...baseDiscovered, entities: {} };
    await flush(el);
    expect(el.shadowRoot!.querySelector('.placeholder')).toBeTruthy();
  });
});

describe('acp-cover-bar', () => {
  it('renders one row per managed cover', async () => {
    const el = await mount<LitLike>('acp-cover-bar');
    el.hass = {
      states: {
        'sensor.cover_position': {
          state: '42',
          attributes: {
            actual_positions: {
              'cover.left': 40,
              'cover.right': 38,
              'cover.middle': 45,
            },
          },
        },
      },
    } as unknown as HomeAssistant;
    el.discovered = {
      ...baseDiscovered,
      entities: { target_position_sensor: 'sensor.cover_position' },
    };
    await flush(el);
    const covers = el.shadowRoot!.querySelectorAll('.cover');
    expect(covers.length).toBe(3);
  });

  it('renders the placeholder when actual_positions is empty', async () => {
    const el = await mount<LitLike>('acp-cover-bar');
    el.hass = { states: {} } as unknown as HomeAssistant;
    el.discovered = { ...baseDiscovered, entities: {} };
    await flush(el);
    expect(el.shadowRoot!.querySelector('.placeholder')).toBeTruthy();
  });
});

describe('acp-overrides-panel', () => {
  it('hides the reset button when no reset_override_button is discovered', async () => {
    const el = await mount<LitLike>('acp-overrides-panel');
    el.hass = { states: {} } as unknown as HomeAssistant;
    el.discovered = { ...baseDiscovered, entities: {} };
    await flush(el);
    expect(el.shadowRoot!.querySelector('.tile.action')).toBeNull();
  });

  it('renders the reset button when the role is populated', async () => {
    const el = await mount<LitLike>('acp-overrides-panel');
    el.hass = { states: {} } as unknown as HomeAssistant;
    el.discovered = {
      ...baseDiscovered,
      entities: { reset_override_button: 'button.reset' },
    };
    await flush(el);
    expect(el.shadowRoot!.querySelector('.tile.action')).toBeTruthy();
  });
});

describe('compact attribute propagation', () => {
  it('reflects compact to the host attribute on each section', async () => {
    const el = await mount<LitLike>('acp-decision-strip');
    el.compact = true;
    await flush(el);
    expect(el.hasAttribute('compact')).toBe(true);
    el.compact = false;
    await flush(el);
    expect(el.hasAttribute('compact')).toBe(false);
  });
});
