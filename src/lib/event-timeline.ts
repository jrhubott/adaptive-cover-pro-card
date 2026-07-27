import type { HomeAssistant } from 'custom-card-helpers';
import { INTEGRATION_DOMAIN } from '../const';
import type { AcpEvent, EventTimeline } from '../types';

/**
 * The integration's rolling diagnostic event buffer, fetched over a service call.
 *
 * `EventBuffer` (integration `diagnostics/event_buffer.py`) is an in-memory ring
 * buffer every pipeline writer records into. It is deliberately NOT an entity
 * attribute — it would blow past HA's attribute-size sanity and churn the state
 * machine on every evaluation. Its only outward surface is the diagnostics
 * payload, which the integration exposes to the frontend through
 * `adaptive_cover_pro.get_diagnostics` (`SupportsResponse.ONLY`). The
 * integration's own `services.yaml` describes that service as "Designed to be
 * called from the ACP Lovelace card via hass.callService(..., { return_response:
 * true })" — this module is that caller.
 *
 * Response shape (see `services/diagnostics_service.py`):
 *
 *   { version, generated_at, count,
 *     entries: { <entry_id>: { config_entry_id, name, cover_type,
 *                              last_update_success, last_update_success_time,
 *                              diagnostics: { …, event_timeline, data_window } } } }
 *
 * `event_timeline` is omitted entirely when the buffer is empty (builder.py only
 * sets it `if timeline:`), while `data_window` is always present — so an empty
 * buffer is distinguishable from a failed call.
 *
 * Everything degrades to an empty timeline: an older integration with no
 * `get_diagnostics` service, a rejected call, or a malformed payload all yield
 * `{ events: [] }` rather than throwing, so the advanced section renders a
 * placeholder instead of breaking the card.
 */

/** True when this HA install's integration exposes `get_diagnostics`. Older
 *  builds predate it; the card hides the advanced section rather than render an
 *  affordance that always fails. Mirrors the feature-detect in `lib/services.ts`. */
export function hasGetDiagnostics(hass: HomeAssistant): boolean {
  const services = (hass as unknown as { services?: Record<string, Record<string, unknown>> })
    .services;
  return !!services?.[INTEGRATION_DOMAIN]?.get_diagnostics;
}

/** `hass.callService` with HA's full frontend signature. `custom-card-helpers`
 *  types only the first four params, but the running frontend accepts
 *  `notifyOnError` and `returnResponse` — the latter is what makes a
 *  `SupportsResponse.ONLY` service callable at all. */
type CallServiceWithResponse = (
  domain: string,
  service: string,
  serviceData?: Record<string, unknown>,
  target?: Record<string, unknown>,
  notifyOnError?: boolean,
  returnResponse?: boolean,
) => Promise<{ response?: unknown } | undefined>;

interface RawEntry {
  diagnostics?: {
    event_timeline?: unknown;
    data_window?: { start?: unknown; end?: unknown; captured_at?: unknown };
    debug_config?: { debug_event_buffer_size?: unknown };
  } | null;
}

/** Coerce one raw buffer dict into a typed event, or null when unusable.
 *  Every writer emits at least `ts` + `event` (see the integration's
 *  `_event_buffer.record({...})` call sites); all other fields are
 *  event-specific and ride along untouched in `fields`. */
export function parseEvent(raw: unknown): AcpEvent | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const rec = raw as Record<string, unknown>;
  const ts = typeof rec.ts === 'string' ? rec.ts : null;
  const event = typeof rec.event === 'string' ? rec.event : null;
  if (ts === null || event === null) return null;
  const t = Date.parse(ts);
  if (Number.isNaN(t)) return null;

  const fields: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rec)) {
    if (k === 'ts' || k === 'event') continue;
    fields[k] = v;
  }
  return { ts, t, event, fields };
}

/**
 * Reduce a `get_diagnostics` response for one entry into a timeline.
 * Pure and unit-tested — the async fetch below is a thin wrapper over it.
 */
export function parseTimelineResponse(response: unknown, entryId: string): EventTimeline {
  const empty: EventTimeline = {
    events: [],
    window: null,
    bufferSize: null,
    available: false,
    raw: null,
  };
  if (!response || typeof response !== 'object') return empty;
  const entries = (response as { entries?: Record<string, RawEntry> }).entries;
  if (!entries || typeof entries !== 'object') return empty;
  const entry = entries[entryId];
  if (!entry || typeof entry !== 'object') return empty;
  const diag = entry.diagnostics;
  if (!diag || typeof diag !== 'object') return empty;
  // A resolved-but-errored entry carries `{ error }` in place of the payload
  // (`services/diagnostics_service.py` builds exactly that when
  // `read_from_coordinator` fails). It is an object, so it would otherwise parse
  // to an empty-but-`available` timeline and render "0 of 0 events" instead of
  // the could-not-read notice.
  if ('error' in (diag as Record<string, unknown>)) return empty;

  const rawEvents = Array.isArray(diag.event_timeline) ? diag.event_timeline : [];
  const events: AcpEvent[] = [];
  for (const raw of rawEvents) {
    const parsed = parseEvent(raw);
    if (parsed) events.push(parsed);
  }
  // The buffer is insertion-ordered, but sort defensively so a writer that
  // back-dates an event can't scramble the render.
  events.sort((a, b) => a.t - b.t);

  const dw = diag.data_window;
  const window =
    dw && typeof dw === 'object'
      ? {
          start: typeof dw.start === 'string' ? dw.start : null,
          end: typeof dw.end === 'string' ? dw.end : null,
          capturedAt: typeof dw.captured_at === 'string' ? dw.captured_at : null,
        }
      : null;

  const rawSize = diag.debug_config?.debug_event_buffer_size;
  const bufferSize = typeof rawSize === 'number' ? rawSize : null;

  // The untouched payload rides along so the Advanced section can hand the whole
  // diagnostics dump to the clipboard for a bug report. Retaining it costs one
  // reference to an object we already parsed — re-fetching on copy would risk
  // sending a *different* snapshot than the one on screen.
  return { events, window, bufferSize, available: true, raw: response };
}

/**
 * Fetch the event buffer for one ACP config entry. Never rejects — any failure
 * yields an empty, `available: false` timeline.
 */
export async function fetchEventTimeline(
  hass: HomeAssistant,
  entryId: string,
): Promise<EventTimeline> {
  const empty: EventTimeline = {
    events: [],
    window: null,
    bufferSize: null,
    available: false,
    raw: null,
  };
  if (!hasGetDiagnostics(hass)) return empty;

  const call = hass.callService as unknown as CallServiceWithResponse;
  let result: { response?: unknown } | undefined;
  try {
    result = await call(
      INTEGRATION_DOMAIN,
      'get_diagnostics',
      { config_entry_id: [entryId] },
      undefined,
      // Suppress HA's toast on failure — the card renders its own inline notice.
      false,
      true,
    );
  } catch {
    return empty;
  }
  // HA wraps a response-returning service call as `{ context, response }`.
  // Older/proxied paths hand back the bare payload; accept both.
  const payload =
    result && typeof result === 'object' && 'response' in result ? result.response : result;
  return parseTimelineResponse(payload, entryId);
}
