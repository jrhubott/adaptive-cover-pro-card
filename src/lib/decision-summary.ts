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

/**
 * Resolve a set of candidate slot-name strings, in preference order, to the
 * first non-empty, trimmed string — or `null` when every candidate is
 * absent, `null`, empty, or whitespace-only.
 *
 * The shared normalization for every "what do we call this slot?" read site
 * (issue #278 audit findings #1/#2). Before this, `''` degraded three
 * different, inconsistent ways depending on the call site: the floor chip's
 * `name ? …` check treated it as absent, `buildDecisionSentence`'s
 * `slotName ? …` check also treated it as absent, but
 * `more-info-dialog.ts`'s `slot.configured_name ?? slot.sensor_name ?? '#'+slot`
 * did NOT — `??` only skips `null`/`undefined`, so an empty string slipped
 * through as a blank visible label. Trimming also catches whitespace-only
 * values (`'   '`), which plain truthiness/`??` checks would treat as present.
 */
export function resolveConfiguredName(
  ...candidates: Array<string | null | undefined>
): string | null {
  for (const candidate of candidates) {
    if (candidate == null) continue;
    const trimmed = candidate.trim();
    if (trimmed.length > 0) return trimmed;
  }
  return null;
}

export interface ActiveFloor {
  slot: 1 | 2 | 3 | 4 | 5;
  position: number;
  /**
   * The slot's own `configured_name` when the integration sends it (issue
   * #278), else the trace-level `custom_position_active_slot_configured_name`
   * when this snapshot row is the trace's active slot (split-rollout guard,
   * audit finding #8), else `sensor_name` on older/partial integrations, or
   * null when nothing qualifies — the chip omits the name segment entirely
   * rather than falling back to a `#N` label. Resolved via
   * {@link resolveConfiguredName}, so an empty/whitespace-only string is
   * treated the same as absent.
   */
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
  attrs:
    | Pick<
        DecisionTraceAttributes,
        | 'custom_position_slots'
        | 'custom_position_active_slot'
        | 'custom_position_active_slot_configured_name'
      >
    | undefined,
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
  // An integration could ship the trace-level configured name before (or
  // without) the per-slot one, or vice versa — the two are independent,
  // separately-added fields (audit finding #8). Only borrow the trace-level
  // name when the snapshot row IS the trace's active slot; it says nothing
  // about any other slot. With both new fields absent this reduces to
  // `best.sensor_name ?? null`, matching pre-#278 behavior exactly.
  const isActiveSlot = attrs?.custom_position_active_slot === best.slot;
  return {
    slot: best.slot,
    position,
    name: resolveConfiguredName(
      best.configured_name,
      isActiveSlot ? attrs?.custom_position_active_slot_configured_name : undefined,
      best.sensor_name,
    ),
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
    | 'custom_position_active_slot_configured_name'
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
    | 'custom_position_active_slot_configured_name'
    | 'custom_position_slots'
  >,
  labels: Record<string, string>,
  safetyLabel: string,
): string {
  const baseLabel = labels[handler] ?? handler;
  const pos = row.position;
  const pct = pos === null || pos === undefined ? '' : ` ${formatPercent(pos)}`;

  if (handler !== 'custom_position') return `${baseLabel}${pct}`.trimEnd();

  // Prefer the slot's own configured name (issue #278) over the bound
  // sensor's friendly name; fall back to the sensor name on integrations
  // that don't yet send the configured-name field. resolveConfiguredName
  // also treats an empty/whitespace-only string as absent (audit finding #2).
  const slotName = resolveConfiguredName(
    attrs.custom_position_active_slot_configured_name,
    attrs.custom_position_active_slot_name,
  );
  const slotLabel = slotName
    ? `${baseLabel} · ${slotName}`
    : attrs.custom_position_active_slot
      ? `${baseLabel} #${attrs.custom_position_active_slot}`
      : baseLabel;
  const floorSuffix = attrs.custom_position_minimum_mode === true ? ' floor' : '';
  // Priority-100 safety slots (v2.28.0+ migrated Force Override) read with a
  // trailing marker so the sentence flags the safety override.
  const safetySuffix = isWinningSlotSafety(attrs) ? ` · ${safetyLabel}` : '';
  return `${slotLabel}${pct}${floorSuffix}${safetySuffix}`;
}
