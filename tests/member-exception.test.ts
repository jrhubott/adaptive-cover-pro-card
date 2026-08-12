import { describe, it, expect } from 'vitest';
import type { HomeAssistant } from 'custom-card-helpers';
import { memberException } from '../src/lib/group-controls';

function hassWith(states: Record<string, string>): HomeAssistant {
  return {
    states: Object.fromEntries(
      Object.entries(states).map(([id, state]) => [id, { entity_id: id, state, attributes: {} }]),
    ),
  } as unknown as HomeAssistant;
}

const LIVE = hassWith({ 'cover.a': 'open', 'cover.b': 'open', 'cover.c': 'closed' });

describe('memberException', () => {
  it('returns null when the roster is healthy, so the caller can show the range', () => {
    expect(
      memberException(LIVE, {
        memberPositions: { 'cover.a': 40, 'cover.b': 40, 'cover.c': 0 },
        memberWinners: { 'cover.a': 'solar', 'cover.b': 'solar', 'cover.c': 'solar' },
      }),
    ).toBeNull();
  });

  it('does NOT count a null position when HA reports the cover live', () => {
    // A one-way / assumed-state cover (Somfy RTS awning) sits at open/closed
    // with no `current_position`, so the group sensor publishes null for it.
    // That is "no position", not "no cover" — calling it unavailable pinned a
    // permanent false warning on the tile of anyone owning such an awning.
    expect(
      memberException(LIVE, {
        memberPositions: { 'cover.a': 40, 'cover.b': null },
        memberWinners: undefined,
      }),
    ).toBeNull();
  });

  it('counts a null position when HA has no state for the member either', () => {
    // Nothing anywhere can see this member, so unavailable is the honest word.
    expect(
      memberException(LIVE, {
        memberPositions: { 'cover.a': 40, 'cover.gone': null },
        memberWinners: undefined,
      }),
    ).toEqual({ kind: 'unavailable', count: 1 });
  });

  it('counts an explicitly offline state as unavailable', () => {
    const hass = hassWith({ 'cover.a': 'open', 'cover.b': 'unavailable' });
    expect(
      memberException(hass, {
        memberPositions: { 'cover.a': 40, 'cover.b': 40 },
        memberWinners: undefined,
      }),
    ).toEqual({ kind: 'unavailable', count: 1 });
  });

  it('does NOT treat a missing state as unavailable', () => {
    // `hass.states` is filtered per user by entity permissions and lags on
    // frontend startup. Treating absence as offline reported a healthy roster as
    // entirely unavailable for any non-admin, permanently hiding the range.
    expect(
      memberException(hassWith({}), {
        memberPositions: { 'cover.a': 40, 'cover.b': 0 },
        memberWinners: { 'cover.a': 'solar', 'cover.b': 'solar' },
      }),
    ).toBeNull();
  });

  it('does not double-count a member that is both null and offline', () => {
    const hass = hassWith({ 'cover.a': 'unavailable' });
    expect(
      memberException(hass, {
        memberPositions: { 'cover.a': null },
        memberWinners: undefined,
      }),
    ).toEqual({ kind: 'unavailable', count: 1 });
  });

  it('reports held members when everything is reachable', () => {
    expect(
      memberException(LIVE, {
        memberPositions: { 'cover.a': 40, 'cover.b': 40, 'cover.c': 0 },
        memberWinners: { 'cover.a': 'manual', 'cover.b': 'force', 'cover.c': 'solar' },
      }),
    ).toEqual({ kind: 'held', count: 2 });
  });

  it('lets unavailable win over held, being the harder failure', () => {
    const hass = hassWith({ 'cover.a': 'unavailable', 'cover.b': 'open' });
    expect(
      memberException(hass, {
        memberPositions: { 'cover.a': 40, 'cover.b': 40 },
        memberWinners: { 'cover.a': 'solar', 'cover.b': 'manual' },
      }),
    ).toEqual({ kind: 'unavailable', count: 1 });
  });

  it('does not treat configured behaviour as an exception', () => {
    // `custom_position` and `group_lock` are rules doing their job, not a
    // deviation worth spending the tile's one free line on.
    expect(
      memberException(LIVE, {
        memberPositions: { 'cover.a': 40, 'cover.b': 40 },
        memberWinners: { 'cover.a': 'custom_position', 'cover.b': 'group_lock' },
      }),
    ).toBeNull();
  });

  it('returns null when the integration publishes no winners at all', () => {
    expect(
      memberException(LIVE, {
        memberPositions: { 'cover.a': 40 },
        memberWinners: undefined,
      }),
    ).toBeNull();
  });
});
