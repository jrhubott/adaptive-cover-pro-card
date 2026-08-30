import type { ActionConfig } from 'custom-card-helpers';

/**
 * Home Assistant's frontend renamed the "call a service" action vocabulary in
 * HA 2024.8: `call-service` → `perform-action`, `service` → `perform_action`,
 * `service_data` → `data`. This card's `ha-selector: { ui_action: {} }`
 * editor is rendered by the user's live HA frontend, so it now emits the
 * modern `perform-action` shape by default (issue #281).
 *
 * The card dispatches through `custom-card-helpers@2.0.0`'s `handleAction()`
 * (this repo's actual runtime authority — not HA's own frontend, which this
 * card never calls). Its `call-service` case
 * (`node_modules/custom-card-helpers/src/handle-action.ts:68-77`) reads only
 * `actionConfig.service` and `actionConfig.service_data` — there is no
 * fallback to `perform_action`/`data` there at all:
 *
 *   case "call-service": {
 *     if (!actionConfig.service) { forwardHaptic("failure"); return; }
 *     const [domain, service] = actionConfig.service.split(".", 2);
 *     hass.callService(domain, service, actionConfig.service_data, actionConfig.target);
 *     ...
 *
 * So it's not enough to translate `action: 'perform-action'` configs — a
 * config already spelled `action: 'call-service'` but carrying the
 * mirror-image `data` key (HA's own selector accepts either spelling for the
 * service-data field) would otherwise reach `handleAction` with no payload:
 * `service_data` stays `undefined` and the service call goes out empty.
 * `custom-card-helpers` has no newer published version to bump to (see issue
 * #281 investigation), so both directions are normalized here, once, ahead
 * of dispatch: whichever field is present wins; the config's own
 * canonically-spelled field is never clobbered by a stray mirror-image one.
 */
interface RawServiceActionConfig {
  action: 'call-service' | 'perform-action';
  service?: string;
  service_data?: Record<string, unknown>;
  perform_action?: string;
  data?: Record<string, unknown>;
  target?: unknown;
  confirmation?: unknown;
  [key: string]: unknown;
}

/** What can arrive at runtime from HA's dashboard config — untyped YAML/UI
 *  output, not TS-checked at the boundary — in addition to the already-typed
 *  `ActionConfig` shapes this card's own types declare. */
export type ActionConfigInput = ActionConfig | RawServiceActionConfig | undefined;

/**
 * Rewrites a service-call-shaped config — `perform-action` or `call-service`,
 * in either vocabulary or a mix of both — to the canonical `call-service`
 * shape `custom-card-helpers@2.0.0` understands: `service` from
 * `perform_action ?? service` (or `service ?? perform_action` for a config
 * already spelled `call-service`), `service_data` from the equivalent
 * `data`/`service_data` fallback, materialized only when a payload is
 * actually present. Every other shape — `undefined`, `'none'`, `'more-info'`,
 * etc. — passes through unchanged. Pure: never mutates its input.
 */
export function normalizeActionConfig(config: ActionConfigInput): ActionConfig | undefined {
  if (!config) return config;
  if (config.action !== 'perform-action' && config.action !== 'call-service') {
    // TS can't narrow RawServiceActionConfig out of the union here — its
    // `action` field is a two-literal union rather than a single
    // discriminant, so this branch can in fact only ever hold a real
    // `ActionConfig` at runtime.
    return config as ActionConfig;
  }

  const { action, service, service_data, perform_action, data, ...rest } =
    config as RawServiceActionConfig;
  const isPerformAction = action === 'perform-action';
  const resolvedService = isPerformAction
    ? (perform_action ?? service)
    : (service ?? perform_action);
  const resolvedData = isPerformAction ? (data ?? service_data) : (service_data ?? data);

  return {
    ...rest,
    action: 'call-service',
    ...(resolvedService !== undefined ? { service: resolvedService } : {}),
    ...(resolvedData !== undefined ? { service_data: resolvedData } : {}),
  } as ActionConfig;
}
