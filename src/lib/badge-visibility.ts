import { normalizeHandler } from './decision-summary';
import { BADGE_KINDS_BY_HANDLER, type BadgeKind, type HandlerName } from '../const';
import type { AdaptiveCoverProTileCardConfig, DecisionStep } from '../types';

/** Per-kind opt-in flags. Omitted/undefined = on; only `=== false` hides. */
export type BadgesConfig = AdaptiveCoverProTileCardConfig['badges'];

/** Inputs that decide whether the "Solar tracking" badge shows. */
export interface SolarActiveContext {
  /** The solar trace row matched this cycle. */
  solarMatched: boolean;
  /** The cloud-suppression handler is the winner (tracking is suppressed). */
  cloudIsWinner: boolean;
}

/**
 * The `solar` badge ("Solar tracking") shows whenever the solar handler
 * is actively contributing and cloud suppression is NOT the winner. When cloud
 * wins, tracking is suppressed and the badge is hidden.
 */
export function isSolarActive(ctx: SolarActiveContext): boolean {
  return ctx.solarMatched && !ctx.cloudIsWinner;
}

/**
 * Filter a list of badge kinds down to those that should render, applying the
 * inversion + per-badge opt-in uniformly across the tile winner badge and the
 * dialog's matched-badge list.
 *
 * - `solar` survives only when `isSolarActive(ctx)` (solar contributing, cloud
 *   not winning) AND `config.solar !== false`.
 * - the other configurable kinds (including `auto` and `cloud`) survive unless
 *   their flag is `=== false`.
 * - `off` is a state-fallback and is never filtered.
 */
export function selectVisibleBadges(
  kinds: readonly BadgeKind[],
  config: BadgesConfig | undefined,
  ctx: SolarActiveContext,
): BadgeKind[] {
  return kinds.filter((kind) => {
    if (kind === 'off') return true;
    if (kind === 'solar') return isSolarActive(ctx) && config?.solar !== false;
    return config?.[kind] !== false;
  });
}

/** Whether the solar trace row matched, derived from a decision trace. */
export function solarTraceMatched(trace: readonly DecisionStep[] | undefined): boolean {
  if (!trace) return false;
  return trace.some((row) => row.matched && normalizeHandler(row.handler) === 'solar');
}

/** Whether the winner string normalizes to the cloud handler. */
export function isCloudWinner(winner: string): boolean {
  return normalizeHandler(winner) === 'cloud';
}

/**
 * Derive the badge kind for the tile's single winner badge. Mirrors the kind
 * logic in `tile-badge.ts` (`_kind`) so the tile card can decide whether the
 * winner badge survives the visibility filter without rendering it first.
 */
export function winnerBadgeKind(opts: {
  winner: string;
  integrationEnabled: boolean;
  manualActive: boolean;
}): BadgeKind {
  if (opts.integrationEnabled === false) return 'off';
  const normalized = normalizeHandler(opts.winner) as HandlerName;
  if (opts.manualActive && normalized !== 'force' && normalized !== 'custom_position') {
    return 'manual';
  }
  return BADGE_KINDS_BY_HANDLER[normalized] ?? 'auto';
}

/**
 * Resolve the tile's single winner badge kind, layering the "Motion idle"
 * suppression + Auto fallback on top of {@link winnerBadgeKind}.
 *
 * The "Motion idle" badge (kind `motion`) is suppressed when either:
 *  - its own opt-in flag is off (`badges.motion === false`), or
 *  - the motion indicator icon is shown (`showMotionIcon`) — the icon already
 *    conveys motion, so the text badge would be redundant.
 *
 * When suppressed and `motion` was the winning kind, the tile shows the Auto
 * badge instead — unless Auto is itself disabled (`badges.auto === false`), in
 * which case there is nothing to show and this returns `null` (blank badge).
 *
 * For every non-`motion` winner this is exactly {@link winnerBadgeKind}.
 *
 * The "Off-schedule" badge (kind `off_schedule`, issue #128) layers on top: when
 * the configured schedule window is not active (`inTimeWindow === false`),
 * automatic positioning is paused, so the tile surfaces `off_schedule` in place
 * of the ordinary automatic-handler kind. It is orthogonal to the user-disabled
 * `bypass_auto_control` path and intentionally does NOT override the higher
 * "active intent" kinds — `off` (integration disabled), `manual` (override
 * active), or `force` (forced position). It can be opted out via
 * `badges.off_schedule === false`.
 */
export function resolveTileBadgeKind(opts: {
  winner: string;
  integrationEnabled: boolean;
  manualActive: boolean;
  badges: BadgesConfig | undefined;
  showMotionIcon: boolean;
  /** Schedule & Timing clock window active. `false` → automatic control paused
   *  (off-schedule). `true`/`undefined` → schedule not constraining. */
  inTimeWindow?: boolean;
}): BadgeKind | null {
  const kind = resolveWinnerKind(opts);
  // Off-schedule is shown only when auto would otherwise be running — never over
  // the integration-disabled, manual, or force states (those reflect a stronger
  // active intent the user should still see).
  if (
    opts.inTimeWindow === false &&
    opts.badges?.off_schedule !== false &&
    kind !== 'off' &&
    kind !== 'manual' &&
    kind !== 'force'
  ) {
    return 'off_schedule';
  }
  return kind;
}

/** The motion-suppression + Auto-fallback resolution, before the off-schedule
 *  layer is applied. */
function resolveWinnerKind(opts: {
  winner: string;
  integrationEnabled: boolean;
  manualActive: boolean;
  badges: BadgesConfig | undefined;
  showMotionIcon: boolean;
}): BadgeKind | null {
  const kind = winnerBadgeKind(opts);
  if (kind !== 'motion') return kind;
  const suppressed = opts.badges?.motion === false || opts.showMotionIcon;
  if (!suppressed) return kind;
  return opts.badges?.auto === false ? null : 'auto';
}

/**
 * Whether the cover is under active automatic control — independent of which
 * automatic handler won. This drives the standalone "Auto" indicator, which
 * shows alongside the winner badge (cloud, solar, climate, …) so the user can
 * tell automatic control is running even when a specific handler is shown.
 *
 * Auto is suppressed only when control is genuinely NOT automatic:
 *  - the integration is disabled, or
 *  - automatic control is off, or
 *  - a manual override is active, or
 *  - a `force` handler won (forced position, not adaptive), or
 *  - a `custom_position` slot won AND it bypasses automatic control, or
 *  - a `custom_position` priority-100 safety slot won (v2.28.0+ migrated Force
 *    Override) — suppressed defensively even when the integration omits
 *    `bypass_auto_control` on the trace.
 *
 * Every other automatic handler (cloud, solar, default, weather, climate,
 * glare_zone, motion) keeps Auto visible. The winner string is normalized
 * before the rules apply, so raw integration handler names work too.
 */
export function isAutoControlActive(opts: {
  winner: string;
  integrationEnabled: boolean;
  automaticControl: boolean;
  manualActive: boolean;
  bypassAutoControl: boolean;
  /** True when the winning custom_position slot is the priority-100 safety slot
   *  (v2.28.0+). Suppresses Auto even if `bypassAutoControl` is unset. */
  safetyActive?: boolean;
}): boolean {
  if (!opts.integrationEnabled) return false;
  if (!opts.automaticControl) return false;
  if (opts.manualActive) return false;
  const normalized = normalizeHandler(opts.winner);
  if (normalized === 'force') return false;
  if (normalized === 'custom_position' && (opts.bypassAutoControl || opts.safetyActive === true)) {
    return false;
  }
  return true;
}

/** Build the {@link SolarActiveContext} from a decision trace + winner. */
export function buildSolarActiveContext(
  trace: readonly DecisionStep[] | undefined,
  winner: string,
): SolarActiveContext {
  return {
    solarMatched: solarTraceMatched(trace),
    cloudIsWinner: isCloudWinner(winner),
  };
}
