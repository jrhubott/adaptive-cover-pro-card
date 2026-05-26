import { HANDLER_LABELS, HANDLER_ORDER, type HandlerName } from '../const';
import type { DecisionStep, DecisionTraceAttributes } from '../types';
import { formatPercent } from './formatters';

/**
 * Return the configured floor/exact position for a custom_position slot when
 * minimum_mode is active, or the fallback (effective sensor position) otherwise.
 *
 * The badge should display the rule's configured value (e.g. 60%), not the
 * effective output written to the cover (e.g. 100% when solar overrides the
 * floor) — that difference is the whole point of minimum_mode.
 */
export function resolveCustomPositionPct(
  attrs:
    | Pick<
        DecisionTraceAttributes,
        'custom_position_minimum_mode' | 'custom_position_slots' | 'custom_position_active_slot'
      >
    | undefined,
  fallback: number | null,
): number | null {
  if (
    attrs?.custom_position_minimum_mode === true &&
    Array.isArray(attrs.custom_position_slots) &&
    attrs.custom_position_active_slot !== undefined
  ) {
    const slot = attrs.custom_position_slots.find(
      (s) => s.slot === attrs!.custom_position_active_slot,
    );
    if (slot !== undefined && slot.position !== null && slot.position !== undefined) {
      return slot.position;
    }
  }
  return fallback;
}

/**
 * Normalize a handler name as emitted by the integration's decision_trace
 * (PascalCase like "SolarHandler", snake forms like "force_override",
 * per-slot names like "custom_position_1") to the keys used in HANDLER_ORDER.
 */
export function normalizeHandler(raw: string): string {
  const base = raw
    .replace(/Handler$/, '')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase();
  // Collapse per-slot custom_position_<digit> handler names emitted by the
  // integration (one CustomPositionHandler instance per configured slot) down
  // to the card-side HANDLER_ORDER key.
  if (/^custom_position_\d+$/.test(base)) return 'custom_position';
  switch (base) {
    case 'force_override':
      return 'force';
    case 'weather_override':
      return 'weather';
    case 'manual_override':
      return 'manual';
    case 'motion_timeout':
      return 'motion';
    case 'cloud_suppression':
      return 'cloud';
    default:
      return base;
  }
}

/**
 * Build a human-readable "Why this position?" summary from the decision trace.
 *
 * Walks the matched handlers in low→high priority order so the sentence reads
 * as a transformation pipeline ending at the winner. Example:
 *   "Solar Tracking 100% → Custom Position #1 60% floor → Manual Override 60%"
 *
 * Custom-position slots use `custom_position_active_slot[_name]` to render
 * either "Custom Position · {sensor name}" or "Custom Position #N", and append
 * ` floor` only when `custom_position_minimum_mode === true` (the configured
 * floor is actively constraining). The `false` case (floor configured but a
 * no-op right now) drops the suffix because the position already reflects raw.
 *
 * Returns `attrs.reason` when nothing matched, or an empty string when neither
 * the trace nor the reason has content (so callers can hide the row).
 */
export function buildDecisionSentence(
  trace: readonly DecisionStep[],
  attrs: Pick<
    DecisionTraceAttributes,
    | 'reason'
    | 'custom_position_active_slot'
    | 'custom_position_minimum_mode'
    | 'custom_position_active_slot_name'
  >,
  // winnerHandler is reserved for callers that want to verify the winner
  // appears last in the sentence; the current implementation derives ordering
  // from HANDLER_ORDER alone and does not need it.
  _winnerHandler: string,
  labels: Record<string, string> = HANDLER_LABELS,
): string {
  const matchedByHandler = new Map<HandlerName, DecisionStep>();
  for (const row of trace) {
    if (!row.matched) continue;
    const key = normalizeHandler(row.handler) as HandlerName;
    if (!HANDLER_ORDER.includes(key)) continue;
    matchedByHandler.set(key, row);
  }

  const ordered: HandlerName[] = [...HANDLER_ORDER]
    .reverse()
    .filter((h) => matchedByHandler.has(h));

  if (ordered.length === 0) return attrs.reason ?? '';

  return ordered.map((h) => formatStep(h, matchedByHandler.get(h)!, attrs, labels)).join(' → ');
}

function formatStep(
  handler: HandlerName,
  row: DecisionStep,
  attrs: Pick<
    DecisionTraceAttributes,
    | 'custom_position_active_slot'
    | 'custom_position_minimum_mode'
    | 'custom_position_active_slot_name'
  >,
  labels: Record<string, string>,
): string {
  const baseLabel = labels[handler] ?? handler;
  const pos = row.position;
  const pct = pos === null || pos === undefined ? '' : ` ${formatPercent(pos)}`;

  if (handler !== 'custom_position') return `${baseLabel}${pct}`.trimEnd();

  const slotLabel = attrs.custom_position_active_slot_name
    ? `${baseLabel} · ${attrs.custom_position_active_slot_name}`
    : attrs.custom_position_active_slot
      ? `${baseLabel} #${attrs.custom_position_active_slot}`
      : baseLabel;
  const floorSuffix = attrs.custom_position_minimum_mode === true ? ' floor' : '';
  return `${slotLabel}${pct}${floorSuffix}`;
}
