import { describe, it, expect, vi } from 'vitest';
import type { HomeAssistant } from 'custom-card-helpers';
import {
  fetchEventTimeline,
  hasGetDiagnostics,
  parseEvent,
  parseTimelineResponse,
} from '../src/lib/event-timeline';
import { INTEGRATION_DOMAIN } from '../src/const';

const ENTRY = 'entry_abc';
const TS = '2026-07-09T08:00:00+00:00';

/** A `get_diagnostics` response envelope, shaped like the integration's
 *  `services/diagnostics_service.py` return value. */
function envelope(diagnostics: unknown, entryId = ENTRY): unknown {
  return {
    version: 1,
    generated_at: TS,
    count: 1,
    entries: { [entryId]: { config_entry_id: entryId, diagnostics } },
  };
}

describe('hasGetDiagnostics', () => {
  it('is false when the integration exposes no services', () => {
    expect(hasGetDiagnostics({} as HomeAssistant)).toBe(false);
  });

  it('is false on an integration build predating the service', () => {
    const hass = { services: { [INTEGRATION_DOMAIN]: { set_position: {} } } } as unknown;
    expect(hasGetDiagnostics(hass as HomeAssistant)).toBe(false);
  });

  it('is true once the service is registered', () => {
    const hass = { services: { [INTEGRATION_DOMAIN]: { get_diagnostics: {} } } } as unknown;
    expect(hasGetDiagnostics(hass as HomeAssistant)).toBe(true);
  });
});

describe('parseEvent', () => {
  it('rejects non-objects and arrays', () => {
    expect(parseEvent(null)).toBeNull();
    expect(parseEvent('x')).toBeNull();
    expect(parseEvent([])).toBeNull();
  });

  it('requires both ts and event', () => {
    expect(parseEvent({ ts: TS })).toBeNull();
    expect(parseEvent({ event: 'x' })).toBeNull();
  });

  it('rejects an unparseable timestamp', () => {
    expect(parseEvent({ ts: 'not-a-date', event: 'x' })).toBeNull();
  });

  it('splits ts/event from the event-specific fields', () => {
    const out = parseEvent({ ts: TS, event: 'cover_command_sent', position: 45, service: 'x' });
    expect(out).toEqual({
      ts: TS,
      t: Date.parse(TS),
      event: 'cover_command_sent',
      fields: { position: 45, service: 'x' },
    });
  });

  it('keeps an event with no extra fields', () => {
    expect(parseEvent({ ts: TS, event: 'transit_cleared' })?.fields).toEqual({});
  });
});

describe('parseTimelineResponse', () => {
  it('reports unavailable for junk input', () => {
    for (const junk of [null, undefined, 'x', 42, {}]) {
      const out = parseTimelineResponse(junk, ENTRY);
      expect(out.available).toBe(false);
      expect(out.events).toEqual([]);
    }
  });

  it('reports unavailable when the requested entry is absent', () => {
    expect(parseTimelineResponse(envelope({}, 'other'), ENTRY).available).toBe(false);
  });

  it('reports unavailable when the entry resolved to an error instead of a payload', () => {
    // `diagnostics_service.py` substitutes `{ error }` for the payload when the
    // build failed; `null` when it produced nothing.
    expect(parseTimelineResponse(envelope(null), ENTRY).available).toBe(false);
  });

  it('is available with NO events when the buffer is empty', () => {
    // The builder omits `event_timeline` entirely for an empty buffer but always
    // emits `data_window` — that difference is what separates "nothing recorded"
    // from "could not read".
    const out = parseTimelineResponse(
      envelope({ data_window: { start: null, end: null, captured_at: TS } }),
      ENTRY,
    );
    expect(out.available).toBe(true);
    expect(out.events).toEqual([]);
    expect(out.window?.capturedAt).toBe(TS);
  });

  it('parses events, drops unusable ones, and sorts oldest-first', () => {
    const later = '2026-07-09T09:00:00+00:00';
    const out = parseTimelineResponse(
      envelope({
        event_timeline: [{ ts: later, event: 'b' }, { ts: TS, event: 'a' }, { nope: true }],
      }),
      ENTRY,
    );
    expect(out.events.map((e) => e.event)).toEqual(['a', 'b']);
  });

  it('reads the configured buffer size from debug_config', () => {
    const out = parseTimelineResponse(
      envelope({
        event_timeline: [{ ts: TS, event: 'a' }],
        debug_config: { debug_event_buffer_size: 50 },
      }),
      ENTRY,
    );
    expect(out.bufferSize).toBe(50);
  });

  it('leaves bufferSize null when not reported', () => {
    expect(parseTimelineResponse(envelope({ event_timeline: [] }), ENTRY).bufferSize).toBeNull();
  });

  it('retains the raw payload for the clipboard copy', () => {
    const payload = envelope({ event_timeline: [{ ts: TS, event: 'a' }] });
    expect(parseTimelineResponse(payload, ENTRY).raw).toBe(payload);
  });
});

describe('fetchEventTimeline', () => {
  function hassWith(callService: unknown, withService = true): HomeAssistant {
    return {
      callService,
      services: withService ? { [INTEGRATION_DOMAIN]: { get_diagnostics: {} } } : {},
    } as unknown as HomeAssistant;
  }

  it('does not call anything when the service is missing', async () => {
    const callService = vi.fn();
    const out = await fetchEventTimeline(hassWith(callService, false), ENTRY);
    expect(out.available).toBe(false);
    expect(callService).not.toHaveBeenCalled();
  });

  it('requests the entry with return_response set', async () => {
    const callService = vi.fn().mockResolvedValue({ response: envelope({ event_timeline: [] }) });
    await fetchEventTimeline(hassWith(callService), ENTRY);
    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'get_diagnostics',
      { config_entry_id: [ENTRY] },
      undefined,
      false, // suppress HA's own error toast — the card renders its own notice
      true, // return_response: the service is SupportsResponse.ONLY
    );
  });

  it('unwraps the { response } envelope HA wraps around the payload', async () => {
    const callService = vi
      .fn()
      .mockResolvedValue({ response: envelope({ event_timeline: [{ ts: TS, event: 'a' }] }) });
    const out = await fetchEventTimeline(hassWith(callService), ENTRY);
    expect(out.available).toBe(true);
    expect(out.events.map((e) => e.event)).toEqual(['a']);
  });

  it('accepts a bare payload for callers that do not wrap it', async () => {
    const callService = vi
      .fn()
      .mockResolvedValue(envelope({ event_timeline: [{ ts: TS, event: 'a' }] }));
    const out = await fetchEventTimeline(hassWith(callService), ENTRY);
    expect(out.available).toBe(true);
  });

  it('never rejects when the service call throws', async () => {
    const callService = vi.fn().mockRejectedValue(new Error('boom'));
    await expect(fetchEventTimeline(hassWith(callService), ENTRY)).resolves.toMatchObject({
      available: false,
      events: [],
    });
  });
});
