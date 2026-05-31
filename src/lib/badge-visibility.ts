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
 */
export function resolveTileBadgeKind(opts: {
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
