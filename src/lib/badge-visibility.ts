import { normalizeHandler } from './decision-summary';
import { BADGE_KINDS_BY_HANDLER, type BadgeKind, type HandlerName } from '../const';
import type { AdaptiveCoverProTileCardConfig, DecisionStep } from '../types';

/** Per-kind opt-in flags. Omitted/undefined = on; only `=== false` hides. */
export type BadgesConfig = AdaptiveCoverProTileCardConfig['badges'];

/** Inputs that decide whether the "Solar tracking active" badge shows. */
export interface SolarActiveContext {
  /** The solar trace row matched this cycle. */
  solarMatched: boolean;
  /** The cloud-suppression handler is the winner (tracking is suppressed). */
  cloudIsWinner: boolean;
}

/**
 * The `solar` badge ("Solar tracking active") shows whenever the solar handler
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
 * - `cloud` is always dropped (never rendered as a badge).
 * - `solar` survives only when `isSolarActive(ctx)` (solar contributing, cloud
 *   not winning) AND `config.solar !== false`.
 * - the other 7 configurable kinds survive unless their flag is `=== false`.
 * - `auto` and `off` are state-fallbacks and are never filtered.
 */
export function selectVisibleBadges(
  kinds: readonly BadgeKind[],
  config: BadgesConfig | undefined,
  ctx: SolarActiveContext,
): BadgeKind[] {
  return kinds.filter((kind) => {
    if (kind === 'cloud') return false;
    if (kind === 'auto' || kind === 'off') return true;
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
