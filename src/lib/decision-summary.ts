import {
  CUSTOM_POSITION_SAFETY_PRIORITY,
  HANDLER_LABELS,
  HANDLER_ORDER,
  MANUAL_OVERRIDE_PRIORITY,
  type HandlerName,
} from '../const';
import type { DecisionStep, DecisionTraceAttributes } from '../types';
import type { HomeAssistant } from 'custom-card-helpers';
import { formatPercent } from './formatters';

export interface ActiveFloor {
  slot: 1 | 2 | 3 | 4 | 5;
  position: number;
  name: string | null;
  /**
   * True when the floor is actively raising the cover above target right now.
   * No longer drives the chip's emphasis (that is `resistsManual`); it now
   * drives the chip's fill-vs-outline cue (solid = clamping, outline = armed).
   */
  clamping: boolean;
  sensorOn: boolean;
  /** The slot's configured 1–99 priority, or null when the integration omits it. */
  priority: number | null;
  /**
   * True when the floor's priority strictly exceeds the manual-override
   * priority — i.e. a manual ↓ will NOT bypass this floor. Null priority is
   * treated as bypassable (false).
   */
  resistsManual: boolean;
}

/**
 * Return the highest-position min-mode floor that is currently armed (enabled,
 * sensor is "on"), or null when no such floor exists.
 *
 * "Highest" means the floor with the largest position value — the one that is
 * currently the effective constraint. When multiple slots qualify, only the
 * dominant one is returned so the tile chip stays compact.
 *
 * `clamping` is true when the floor is actively raising the cover above the
 * target (i.e. `position > targetPosition`). When `targetPosition` is null
 * (position unavailable), clamping is conservatively false.
 */
export function resolveActiveMinModeFloor(
  attrs: Pick<DecisionTraceAttributes, 'custom_position_slots'> | undefined,
  hassStates: HomeAssistant['states'],
  targetPosition: number | null,
): ActiveFloor | null {
  if (!Array.isArray(attrs?.custom_position_slots)) return null;

  const candidates = attrs.custom_position_slots.filter(
    (s) =>
      s.min_mode === true &&
      s.enabled === true &&
      s.sensor !== null &&
      s.position !== null &&
      hassStates[s.sensor!]?.state === 'on',
  );

  if (candidates.length === 0) return null;

  // Pick the slot with the highest position (effective floor).
  const best = candidates.reduce((a, b) => ((b.position ?? 0) > (a.position ?? 0) ? b : a));

  const position = best.position!;
  const priority = best.priority ?? null;
  return {
    slot: best.slot,
    position,
    name: best.sensor_name,
    clamping: targetPosition !== null && position > targetPosition,
    sensorOn: true,
    priority,
    resistsManual: priority != null && priority > MANUAL_OVERRIDE_PRIORITY,
  };
}

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
 * Whether the currently-winning custom-position slot is the safety slot —
 * i.e. the slot named by `custom_position_active_slot` has a priority equal to
 * {@link CUSTOM_POSITION_SAFETY_PRIORITY} (100). This is the v2.28.0+ signal
 * that the former Force Override is active (it merged into Custom Positions as a
 * priority-100 slot). Detection is by priority, not by handler name, so the card
 * surfaces the migrated feature with its red, force-styled badge.
 *
 * Returns false when there is no active slot, the snapshot is missing, or the
 * active slot is not present in the snapshot list.
 */
export function isWinningSlotSafety(
  attrs:
    | Pick<DecisionTraceAttributes, 'custom_position_slots' | 'custom_position_active_slot'>
    | undefined,
): boolean {
  if (
    attrs?.custom_position_active_slot === undefined ||
    !Array.isArray(attrs.custom_position_slots)
  ) {
    return false;
  }
  const slot = attrs.custom_position_slots.find(
    (s) => s.slot === attrs.custom_position_active_slot,
  );
  return slot?.priority === CUSTOM_POSITION_SAFETY_PRIORITY;
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
    | 'custom_position_slots'
  >,
  // winnerHandler is reserved for callers that want to verify the winner
  // appears last in the sentence; the current implementation derives ordering
  // from HANDLER_ORDER alone and does not need it.
  _winnerHandler: string,
  labels: Record<string, string> = HANDLER_LABELS,
  safetyLabel = 'Safety',
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

  return ordered
    .map((h) => formatStep(h, matchedByHandler.get(h)!, attrs, labels, safetyLabel))
    .join(' → ');
}

function formatStep(
  handler: HandlerName,
  row: DecisionStep,
  attrs: Pick<
    DecisionTraceAttributes,
    | 'custom_position_active_slot'
    | 'custom_position_minimum_mode'
    | 'custom_position_active_slot_name'
    | 'custom_position_slots'
  >,
  labels: Record<string, string>,
  safetyLabel: string,
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
  // Priority-100 safety slots (v2.28.0+ migrated Force Override) read with a
  // trailing marker so the sentence flags the safety override.
  const safetySuffix = isWinningSlotSafety(attrs) ? ` · ${safetyLabel}` : '';
  return `${slotLabel}${pct}${floorSuffix}${safetySuffix}`;
}
