import { normalizeHandler } from './decision-summary';
import { BADGE_KINDS_BY_HANDLER, HANDLER_ORDER, type BadgeKind, type HandlerName } from '../const';
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
 * - `off` and `group` are status indicators and are never filtered.
 */
export function selectVisibleBadges(
  kinds: readonly BadgeKind[],
  config: BadgesConfig | undefined,
  ctx: SolarActiveContext,
): BadgeKind[] {
  return kinds.filter((kind) => {
    if (kind === 'off' || kind === 'group') return true;
    if (kind === 'solar') return isSolarActive(ctx) && config?.solar !== false;
    return config?.[kind] !== false;
  });
}

/** Whether the solar trace row matched, derived from a decision trace. */
export function solarTraceMatched(trace: readonly DecisionStep[] | undefined): boolean {
  if (!trace) return false;
  return trace.some((row) => row.matched && normalizeHandler(row.handler) === 'solar');
}

/**
 * Walk a decision trace and collect every `matched: true` row whose handler
 * normalizes to a recognized `HANDLER_ORDER` entry. Real traces can carry
 * multiple matched rows in one cycle (see `buildDecisionSentence`'s docstring
 * example) — this is the shared primitive both the tile's single winner
 * badge and the dialog's multi-badge list use to see "what else contributed"
 * beyond the literal `winner` string.
 */
export function matchedHandlerSet(trace: readonly DecisionStep[] | undefined): Set<HandlerName> {
  const matched = new Set<HandlerName>();
  if (!trace) return matched;
  for (const row of trace) {
    if (!row.matched) continue;
    const key = normalizeHandler(row.handler) as HandlerName;
    if (HANDLER_ORDER.includes(key)) matched.add(key);
  }
  return matched;
}

/**
 * When the plain winner-derived kind is the generic `auto` fallback (the
 * winner itself doesn't map to a specific badge, e.g. `default`), scan the
 * trace's matched handlers for the highest-priority one (HANDLER_ORDER order)
 * that maps to a specific badge kind and isn't opted out via `badges.<kind>`.
 * Returns `null` when nothing qualifies, so the caller keeps the `auto`
 * fallback. `default`/`floor_clamp` never elevate — they have no
 * `BADGE_KINDS_BY_HANDLER` entry (see const.ts) and would just be `auto` again.
 *
 * `motion` is skipped even though it maps to a badge kind: it owns its own
 * dedicated icon + `showMotionIcon` suppression path in {@link resolveWinnerKind},
 * which only runs when motion is the literal winner. A matched-but-not-winning
 * motion row re-surfacing here would render both the motion icon and a
 * redundant "Motion idle" text badge, defeating that suppression (issue #223
 * follow-up). Skipping it here just lets the scan continue to the next
 * matched handler (e.g. climate) instead of returning early.
 */
function elevateFromMatchedTrace(
  trace: readonly DecisionStep[] | undefined,
  badges: BadgesConfig | undefined,
): BadgeKind | null {
  const matched = matchedHandlerSet(trace);
  for (const handler of HANDLER_ORDER) {
    if (handler === 'motion') continue;
    if (!matched.has(handler)) continue;
    const kind = BADGE_KINDS_BY_HANDLER[handler];
    if (kind === undefined) continue;
    // `off`/`group` are status kinds with no opt-in flag in BadgesConfig — never
    // gated, same as selectVisibleBadges. `group_scene`/`group_lock` are the
    // only handlers that can reach here mapped to `group`.
    if (kind === 'off' || kind === 'group') return kind;
    if (badges?.[kind] === false) continue;
    return kind;
  }
  return null;
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
 *
 * Issue #223: when the plain resolution above is the generic `auto` fallback,
 * a more specific handler can still be genuinely active in the same cycle
 * without being the literal winner (e.g. climate matched, but `default` wins
 * the trace). When `trace` is supplied, that case elevates the badge to the
 * more specific kind — see {@link elevateFromMatchedTrace} — mirroring what
 * the more-info dialog's matched-badge list already does. A winner that
 * already resolves to a specific kind is untouched: elevation only ever
 * replaces the generic `auto` fallback.
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
  /** The full decision trace, used only to elevate a generic `auto` fallback
   *  to a more specific matched-but-not-winning handler (issue #223). */
  trace?: readonly DecisionStep[];
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
 *  layer is applied. Issue #223 elevation (see {@link elevateFromMatchedTrace})
 *  applies only to the direct `auto` fallback from {@link winnerBadgeKind} —
 *  i.e. when the winner itself is unmapped (e.g. `default`). It intentionally
 *  does NOT run when `auto` is reached via motion suppression: that path
 *  exists specifically to hide the redundant "Motion idle" text when the
 *  motion icon already shows it, and a matched-motion row re-elevating back
 *  to the `motion` kind there would defeat the suppression. For the same
 *  reason, {@link elevateFromMatchedTrace} itself never returns `motion` even
 *  when reached via the direct `auto` fallback above — motion's icon +
 *  suppression is owned exclusively by the winner-is-motion branch below, so a
 *  matched-but-not-winning motion row is skipped during elevation and the scan
 *  continues to the next candidate (e.g. climate) instead. */
function resolveWinnerKind(opts: {
  winner: string;
  integrationEnabled: boolean;
  manualActive: boolean;
  badges: BadgesConfig | undefined;
  showMotionIcon: boolean;
  trace?: readonly DecisionStep[];
}): BadgeKind | null {
  const kind = winnerBadgeKind(opts);
  if (kind !== 'motion') {
    if (kind !== 'auto') return kind;
    return elevateFromMatchedTrace(opts.trace, opts.badges) ?? 'auto';
  }
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

// ── Cover Group: roll member state up onto the group surface (issue #185) ────

/**
 * Winners a Cover Group does NOT badge, for three distinct reasons:
 *
 * - `group_scene` / `group_lock` — the group's own "N/M group-driven" badge
 *   already states this; a handler badge beside it says the same thing twice.
 * - `solar` / `default` — routine automatic operation, not an exception.
 *   Badging it would put a permanent badge on every healthy group.
 * - `motion` — occupancy timeout is per-cover context. The member's own tile
 *   carries it (beside its motion icon, which is why the tile suppresses the
 *   badge there too); a group has no occupancy of its own, so on a group
 *   summary it is noise.
 */
const GROUP_ROLLUP_EXCLUDED: ReadonlySet<string> = new Set([
  'group_scene',
  'group_lock',
  'solar',
  'default',
  'motion',
]);

/**
 * The distinct member winners a Cover Group should badge, ordered by
 * `HANDLER_ORDER` so the row is stable as members come and go.
 *
 * The group's `member_winners` attribute is the **full** per-member winning-handler
 * map — the who-won sensor's *state* counts only the group-driven ones, but the
 * attribute carries every member's real winner. So a member sitting under a
 * manual override, weather safety, or a custom-position slot is visible here
 * without the group having to discover each member's own entities.
 *
 * **Known gap:** an override that is *active but out-prioritized* (e.g. manual
 * held while weather safety wins) is not in this map, because only the winner is
 * published. The member's own tile still shows it; the group cannot.
 */
export function memberBadgeWinners(
  memberWinners: Record<string, string | null> | undefined,
): string[] {
  if (!memberWinners) return [];
  const seen = new Set<string>();
  for (const raw of Object.values(memberWinners)) {
    if (!raw) continue;
    const handler = normalizeHandler(raw);
    if (GROUP_ROLLUP_EXCLUDED.has(handler)) continue;
    if (!(handler in BADGE_KINDS_BY_HANDLER)) continue;
    seen.add(handler);
  }
  return HANDLER_ORDER.filter((h) => seen.has(h));
}
