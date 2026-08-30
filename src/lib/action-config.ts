import type { ActionConfig } from 'custom-card-helpers';

/**
 * Home Assistant's frontend renamed the "call a service" action vocabulary in
 * HA 2024.8: `call-service` → `perform-action`, `service` → `perform_action`,
 * `service_data` → `data`. This card's `ha-selector: { ui_action: {} }`
 * editor is rendered by the user's live HA frontend, so it now emits the
 * modern `perform-action` shape by default (issue #281) — but the pinned
 * `custom-card-helpers@2.0.0` `handleAction()` only recognizes `call-service`
 * and silently no-ops on anything else. `custom-card-helpers` has no newer
 * published version to bump to (see issue #281 investigation), so this shape
 * is translated once, ahead of dispatch, instead.
 */
export interface PerformActionActionConfig {
  action: 'perform-action';
  perform_action: string;
  data?: Record<string, unknown>;
  target?: unknown;
  confirmation?: unknown;
  [key: string]: unknown;
}

/** What can arrive at runtime from HA's dashboard config — untyped YAML/UI
 *  output, not TS-checked at the boundary — in addition to the already-typed
 *  `ActionConfig` shapes this card's own types declare. */
export type ActionConfigInput = ActionConfig | PerformActionActionConfig | undefined;

/**
 * Rewrites a `perform-action` config to the `call-service` shape
 * `custom-card-helpers@2.0.0` understands. Every other shape — `undefined`,
 * `'none'`, `'more-info'`, an already-`call-service` config, etc. — passes
 * through unchanged. Pure: never mutates its input.
 */
export function normalizeActionConfig(config: ActionConfigInput): ActionConfig | undefined {
  if (!config || config.action !== 'perform-action') return config;
  const { action: _action, perform_action, data, ...rest } = config;
  return {
    ...rest,
    action: 'call-service',
    service: perform_action,
    ...(data !== undefined ? { service_data: data } : {}),
  } as ActionConfig;
}
