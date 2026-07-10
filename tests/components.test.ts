import { describe, it, expect, vi } from 'vitest';
import '../src/components/decision-strip';
import '../src/components/cover-bar';
import '../src/components/overrides-panel';
import '../src/components/header-pill';
import '../src/components/climate-panel';
import { climateInControl } from '../src/components/climate-panel';
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
  it('renders all 13 handler rows with the winning one highlighted', async () => {
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
    expect(rows.length).toBe(13);
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

  function mountWithTrace(inTimeWindow: boolean | undefined, includeAttr = true): Promise<LitLike> {
    return (async () => {
      const el = await mount<LitLike>('acp-decision-strip');
      const attributes: Record<string, unknown> = {
        reason: 'fallback',
        trace: [{ handler: 'DefaultHandler', matched: true, reason: 'fallback', position: 60 }],
      };
      if (includeAttr) attributes.in_time_window = inTimeWindow;
      el.hass = {
        states: { 'sensor.d_trace': { state: 'default', attributes } },
      } as unknown as HomeAssistant;
      el.discovered = {
        ...baseDiscovered,
        entities: { decision_trace_sensor: 'sensor.d_trace' },
      };
      await flush(el);
      return el;
    })();
  }

  it('renders the off-schedule banner when in_time_window is false', async () => {
    const el = await mountWithTrace(false);
    const banner = el.shadowRoot!.querySelector('.off-schedule');
    expect(banner).toBeTruthy();
    expect(banner!.textContent).toContain('Outside schedule');
    // Floating tooltip: text now lives on data-tooltip (no native title=).
    expect(banner!.getAttribute('data-tooltip')).toContain('schedule window is not active');
    expect(banner!.hasAttribute('title')).toBe(false);
  });

  it('hides the off-schedule banner when in_time_window is true', async () => {
    const el = await mountWithTrace(true);
    expect(el.shadowRoot!.querySelector('.off-schedule')).toBeNull();
  });

  it('hides the off-schedule banner when in_time_window is undefined', async () => {
    const el = await mountWithTrace(undefined);
    expect(el.shadowRoot!.querySelector('.off-schedule')).toBeNull();
  });

  it('hides the off-schedule banner when in_time_window is absent (older integration)', async () => {
    const el = await mountWithTrace(undefined, false);
    expect(el.shadowRoot!.querySelector('.off-schedule')).toBeNull();
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
  it('does not render a Force tile (dropped in v2.28.0)', async () => {
    const el = await mount<LitLike>('acp-overrides-panel');
    el.hass = { states: {} } as unknown as HomeAssistant;
    el.discovered = { ...baseDiscovered, entities: {} };
    await flush(el);
    const labels = Array.from(el.shadowRoot!.querySelectorAll('.tile-label')).map((n) =>
      n.textContent!.trim(),
    );
    expect(labels).toContain('Manual');
    expect(labels).not.toContain('Force');
  });

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

  it('reset tile is interactive by default (no aria-disabled, no readonly class)', async () => {
    const el = await mount<LitLike>('acp-overrides-panel');
    el.hass = { states: {} } as unknown as HomeAssistant;
    el.discovered = { ...baseDiscovered, entities: { reset_override_button: 'button.reset' } };
    await flush(el);
    const btn = el.shadowRoot!.querySelector('.tile.action')!;
    expect(btn.hasAttribute('aria-disabled')).toBe(false);
    expect(btn.classList.contains('readonly')).toBe(false);
  });

  it('reset tile gets aria-disabled and .readonly when resetEnabled=false', async () => {
    interface OverridesLike extends LitLike {
      resetEnabled?: boolean;
    }
    const el = await mount<OverridesLike>('acp-overrides-panel');
    el.hass = { states: {} } as unknown as HomeAssistant;
    el.discovered = { ...baseDiscovered, entities: { reset_override_button: 'button.reset' } };
    el.resetEnabled = false;
    await flush(el);
    const btn = el.shadowRoot!.querySelector('.tile.action')!;
    expect(btn.getAttribute('aria-disabled')).toBe('true');
    expect(btn.getAttribute('tabindex')).toBe('-1');
    expect(btn.classList.contains('readonly')).toBe(true);
  });

  it('does not call hass.callService when resetEnabled=false and tile is clicked', async () => {
    interface OverridesLike extends LitLike {
      resetEnabled?: boolean;
    }
    const callService = vi.fn();
    const el = await mount<OverridesLike>('acp-overrides-panel');
    el.hass = { states: {}, callService } as unknown as HomeAssistant;
    el.discovered = { ...baseDiscovered, entities: { reset_override_button: 'button.reset' } };
    el.resetEnabled = false;
    await flush(el);
    (el.shadowRoot!.querySelector('.tile.action') as HTMLElement).click();
    expect(callService).not.toHaveBeenCalled();
  });

  it('calls hass.callService when resetEnabled=true and tile is clicked', async () => {
    interface OverridesLike extends LitLike {
      resetEnabled?: boolean;
    }
    const callService = vi.fn();
    const el = await mount<OverridesLike>('acp-overrides-panel');
    el.hass = { states: {}, callService } as unknown as HomeAssistant;
    el.discovered = { ...baseDiscovered, entities: { reset_override_button: 'button.reset' } };
    el.resetEnabled = true;
    await flush(el);
    (el.shadowRoot!.querySelector('.tile.action') as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith('button', 'press', { entity_id: 'button.reset' });
  });
});

describe('acp-header-pill', () => {
  interface PillLike extends HTMLElement {
    updateComplete: Promise<boolean>;
    on?: boolean;
    readonly?: boolean;
    label?: string;
  }

  it('renders with aria-disabled and tabindex=-1 when readonly=true', async () => {
    const el = document.createElement('acp-header-pill') as PillLike;
    el.on = false;
    el.readonly = true;
    el.label = 'ON';
    document.body.appendChild(el);
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector('button')!;
    expect(btn.getAttribute('aria-disabled')).toBe('true');
    expect(btn.getAttribute('tabindex')).toBe('-1');
  });

  it('adds .readonly CSS class when readonly=true', async () => {
    const el = document.createElement('acp-header-pill') as PillLike;
    el.on = true;
    el.readonly = true;
    el.label = 'ON';
    document.body.appendChild(el);
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector('button')!;
    expect(btn.classList.contains('readonly')).toBe(true);
  });

  it('does not emit pill-click when readonly=true and clicked', async () => {
    const el = document.createElement('acp-header-pill') as PillLike;
    el.on = true;
    el.readonly = true;
    el.label = 'ON';
    document.body.appendChild(el);
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener('pill-click', listener);
    el.shadowRoot!.querySelector('button')!.click();
    expect(listener).not.toHaveBeenCalled();
  });

  it('emits pill-click when readonly=false and clicked', async () => {
    const el = document.createElement('acp-header-pill') as PillLike;
    el.on = true;
    el.readonly = false;
    el.label = 'ON';
    document.body.appendChild(el);
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener('pill-click', listener);
    el.shadowRoot!.querySelector('button')!.click();
    expect(listener).toHaveBeenCalledOnce();
  });

  it('has no aria-disabled and no .readonly class when readonly=false', async () => {
    const el = document.createElement('acp-header-pill') as PillLike;
    el.on = false;
    el.readonly = false;
    el.label = 'OFF';
    document.body.appendChild(el);
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector('button')!;
    expect(btn.hasAttribute('aria-disabled')).toBe(false);
    expect(btn.classList.contains('readonly')).toBe(false);
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

describe('acp-climate-panel', () => {
  function makeHass(
    sensorState: string,
    sensorAttrs: Record<string, unknown> = {},
    switchState?: string,
  ): HomeAssistant {
    const states: Record<string, unknown> = {
      'sensor.climate': {
        entity_id: 'sensor.climate',
        state: sensorState,
        attributes: { friendly_name: 'Climate Status', ...sensorAttrs },
        last_changed: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        context: { id: 'test' },
      },
    };
    if (switchState !== undefined) {
      states['switch.climate_mode'] = {
        entity_id: 'switch.climate_mode',
        state: switchState,
        attributes: { friendly_name: 'Climate Mode' },
        last_changed: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        context: { id: 'test' },
      };
    }
    return { states } as unknown as HomeAssistant;
  }

  function makeDiscovered(withSwitch: boolean): DiscoveredEntities {
    return {
      ...baseDiscovered,
      entities: {
        climate_status_sensor: 'sensor.climate',
        ...(withSwitch ? { climate_mode_switch: 'switch.climate_mode' } : {}),
      },
    };
  }

  it('unknown state + switch off → shows "Climate mode off" label, no temps, no Active line', async () => {
    const el = await mount<LitLike>('acp-climate-panel');
    el.hass = makeHass('unknown', {}, 'off');
    el.discovered = makeDiscovered(true);
    await flush(el);
    const wrap = el.shadowRoot!.querySelector('.wrap');
    expect(wrap).toBeTruthy();
    const strategyName = el.shadowRoot!.querySelector('.strategy-name');
    expect(strategyName?.textContent?.trim()).toBe('Climate mode off');
    expect(el.shadowRoot!.querySelector('.temps')).toBeNull();
    const headDim = el.shadowRoot!.querySelector('.head .dim');
    expect(headDim).toBeNull();
  });

  it('unknown state + switch on → shows "Standby" label', async () => {
    const el = await mount<LitLike>('acp-climate-panel');
    el.hass = makeHass('unknown', {}, 'on');
    el.discovered = makeDiscovered(true);
    await flush(el);
    const strategyName = el.shadowRoot!.querySelector('.strategy-name');
    expect(strategyName?.textContent?.trim()).toBe('Standby');
  });

  it('unknown state + no switch entity → shows "Standby" label', async () => {
    const el = await mount<LitLike>('acp-climate-panel');
    el.hass = makeHass('unknown');
    el.discovered = makeDiscovered(false);
    await flush(el);
    const strategyName = el.shadowRoot!.querySelector('.strategy-name');
    expect(strategyName?.textContent?.trim()).toBe('Standby');
  });

  it('unavailable state → .wrap is null (returns nothing)', async () => {
    const el = await mount<LitLike>('acp-climate-panel');
    el.hass = makeHass('unavailable');
    el.discovered = makeDiscovered(false);
    await flush(el);
    expect(el.shadowRoot!.querySelector('.wrap')).toBeNull();
  });

  it('no climate_status_sensor role → .wrap is null', async () => {
    const el = await mount<LitLike>('acp-climate-panel');
    el.hass = { states: {} } as unknown as HomeAssistant;
    el.discovered = { ...baseDiscovered, entities: {} };
    await flush(el);
    expect(el.shadowRoot!.querySelector('.wrap')).toBeNull();
  });

  it('summer_mode state (valid, with attrs) → .wrap present AND .strategy present', async () => {
    const el = await mount<LitLike>('acp-climate-panel');
    el.hass = makeHass('summer_mode', {
      active_temperature: 24,
      temperature_unit: '°C',
      indoor_temperature: 23,
      outdoor_temperature: 28,
    });
    el.discovered = makeDiscovered(false);
    await flush(el);
    expect(el.shadowRoot!.querySelector('.wrap')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.strategy')).toBeTruthy();
  });

  // --- issue #129: standby inactive_reason line ---

  it('standby + inactive_reason "outside_time_window" → renders the localized reason line', async () => {
    const el = await mount<LitLike>('acp-climate-panel');
    el.hass = makeHass('unknown', { inactive_reason: 'outside_time_window' }, 'on');
    el.discovered = makeDiscovered(true);
    await flush(el);
    const reason = el.shadowRoot!.querySelector('.standby-reason');
    expect(reason?.textContent?.trim()).toBe('Outside the operating time window');
  });

  it.each([
    ['thresholds_not_met', 'Temperatures within the comfort band — no action needed'],
    ['other_mode_active', 'Another control mode is currently active'],
    ['readings_unavailable', 'Temperature readings unavailable'],
  ])('standby + inactive_reason "%s" → renders "%s"', async (slug, expected) => {
    const el = await mount<LitLike>('acp-climate-panel');
    el.hass = makeHass('unknown', { inactive_reason: slug }, 'on');
    el.discovered = makeDiscovered(true);
    await flush(el);
    expect(el.shadowRoot!.querySelector('.standby-reason')?.textContent?.trim()).toBe(expected);
  });

  it('standby + inactive_reason "mode_off" → no reason line (label already conveys it)', async () => {
    const el = await mount<LitLike>('acp-climate-panel');
    el.hass = makeHass('unknown', { inactive_reason: 'mode_off' }, 'off');
    el.discovered = makeDiscovered(true);
    await flush(el);
    expect(el.shadowRoot!.querySelector('.standby-reason')).toBeNull();
    expect(el.shadowRoot!.querySelector('.strategy-name')?.textContent?.trim()).toBe(
      'Climate mode off',
    );
  });

  it('standby + inactive_reason "active" → no reason line (should not reach standby)', async () => {
    const el = await mount<LitLike>('acp-climate-panel');
    el.hass = makeHass('unknown', { inactive_reason: 'active' }, 'on');
    el.discovered = makeDiscovered(true);
    await flush(el);
    expect(el.shadowRoot!.querySelector('.standby-reason')).toBeNull();
  });

  it('standby with no inactive_reason (older integration) → no reason line, unchanged', async () => {
    const el = await mount<LitLike>('acp-climate-panel');
    el.hass = makeHass('unknown', {}, 'on');
    el.discovered = makeDiscovered(true);
    await flush(el);
    expect(el.shadowRoot!.querySelector('.standby-reason')).toBeNull();
    expect(el.shadowRoot!.querySelector('.strategy-name')?.textContent?.trim()).toBe('Standby');
  });

  // --- issue #129: active-branch threshold pairing ---

  it('active + temp_switch false → indoor tile shows low/high, outdoor tile shows summer', async () => {
    const el = await mount<LitLike>('acp-climate-panel');
    el.hass = makeHass('intermediate', {
      active_temperature: 21,
      temperature_unit: '°C',
      indoor_temperature: 21,
      outdoor_temperature: 18,
      temp_switch: false,
      temp_low: 18,
      temp_high: 25,
      temp_summer_outside: 22,
    });
    el.discovered = makeDiscovered(false);
    await flush(el);
    const temps = Array.from(el.shadowRoot!.querySelectorAll('.temp'));
    expect(temps.length).toBe(2);
    const indoorThreshold = temps[0]
      .querySelector('.temp-threshold')
      ?.textContent?.replace(/\s+/g, ' ')
      .trim();
    expect(indoorThreshold).toBe('low 18.0°C high 25.0°C');
    const outdoorThreshold = temps[1]
      .querySelector('.temp-threshold')
      ?.textContent?.replace(/\s+/g, ' ')
      .trim();
    expect(outdoorThreshold).toBe('summer 22.0°C');
  });

  it('active + temp_switch true → outdoor tile shows low/high/summer, indoor tile shows none', async () => {
    const el = await mount<LitLike>('acp-climate-panel');
    el.hass = makeHass('winter_mode', {
      active_temperature: 15,
      temperature_unit: '°C',
      indoor_temperature: 21,
      outdoor_temperature: 15,
      temp_switch: true,
      temp_low: 18,
      temp_high: 25,
      temp_summer_outside: 22,
    });
    el.discovered = makeDiscovered(false);
    await flush(el);
    const temps = Array.from(el.shadowRoot!.querySelectorAll('.temp'));
    expect(temps.length).toBe(2);
    expect(temps[0].querySelector('.temp-threshold')).toBeNull();
    const outdoorThreshold = temps[1]
      .querySelector('.temp-threshold')
      ?.textContent?.replace(/\s+/g, ' ')
      .trim();
    expect(outdoorThreshold).toBe('low 18.0°C high 25.0°C summer 22.0°C');
  });

  it('active + null/missing thresholds → omits individual fragments and empty sub-lines', async () => {
    const el = await mount<LitLike>('acp-climate-panel');
    el.hass = makeHass('intermediate', {
      active_temperature: 21,
      temperature_unit: '°C',
      indoor_temperature: 21,
      outdoor_temperature: 18,
      temp_switch: false,
      temp_low: null,
      temp_high: 25,
      // temp_summer_outside absent entirely
    });
    el.discovered = makeDiscovered(false);
    await flush(el);
    const temps = Array.from(el.shadowRoot!.querySelectorAll('.temp'));
    // indoor: only high survives (low is null)
    expect(
      temps[0].querySelector('.temp-threshold')?.textContent?.replace(/\s+/g, ' ').trim(),
    ).toBe('high 25.0°C');
    // outdoor: summer absent → whole sub-line omitted, no "—" clutter
    expect(temps[1].querySelector('.temp-threshold')).toBeNull();
  });

  // --- issue #168: climate_status STATE is not sole authority; inactive_reason gates control ---

  describe('climateInControl', () => {
    it('undefined (older integration) → true', () => {
      expect(climateInControl(undefined)).toBe(true);
    });

    it('"active" → true', () => {
      expect(climateInControl('active')).toBe(true);
    });

    it.each(['thresholds_not_met', 'other_mode_active', 'mode_off', 'outside_time_window'])(
      '"%s" → false',
      (slug) => {
        expect(climateInControl(slug)).toBe(false);
      },
    );
  });

  it('active strategy + inactive_reason "thresholds_not_met" → standby treatment, no temps, no Active line', async () => {
    const el = await mount<LitLike>('acp-climate-panel');
    el.hass = makeHass('intermediate', {
      active_temperature: 21,
      temperature_unit: '°C',
      indoor_temperature: 21,
      outdoor_temperature: 18,
      temp_low: 18,
      temp_high: 25,
      temp_summer_outside: 22,
      inactive_reason: 'thresholds_not_met',
    });
    el.discovered = makeDiscovered(false);
    await flush(el);
    expect(el.shadowRoot!.querySelector('.strategy.standby')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.standby-reason')?.textContent?.trim()).toBe(
      'Temperatures within the comfort band — no action needed',
    );
    expect(el.shadowRoot!.querySelector('.temps')).toBeNull();
    expect(el.shadowRoot!.querySelector('.head .dim')).toBeNull();
  });
});
