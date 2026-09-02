import { describe, it, expect } from 'vitest';
import {
  axisDisplayValue,
  axisFraction,
  hasPositionAxis,
  positionAxisFor,
  positionAxisInverted,
  primaryAxisFor,
  resolveAxes,
} from '../src/lib/axes';
import type { CoverDiscovery, DiscoveredEntities } from '../src/types';

const base: DiscoveredEntities = {
  entry_id: 'e1',
  entry_title: 'Test',
  cover_type: 'cover_blind',
  entities: {},
  managed_covers: [],
};

function withDiscovery(discovery: CoverDiscovery, entities = {}): DiscoveredEntities {
  return { ...base, entities, discovery };
}

describe('resolveAxes — discovery path', () => {
  it('maps every supported axis in discovery order with id → target role', () => {
    const d = withDiscovery(
      {
        cover_type: 'cover_venetian',
        axes: [
          {
            id: 'position',
            label: 'Position',
            min: 0,
            max: 100,
            unit: '%',
            state_attr: 'current_position',
            supported: true,
          },
          {
            id: 'tilt',
            label: 'Tilt',
            min: 0,
            max: 100,
            unit: '%',
            state_attr: 'current_tilt_position',
            supported: true,
          },
        ],
      },
      { target_position_sensor: 'sensor.pos', target_tilt_sensor: 'sensor.tilt' },
    );
    const axes = resolveAxes(d);
    expect(axes.map((a) => a.id)).toEqual(['position', 'tilt']);
    expect(axes[0].targetRole).toBe('target_position_sensor');
    expect(axes[1].targetRole).toBe('target_tilt_sensor');
    expect(axes[1].label).toBe('Tilt');
    expect(axes[1].stateAttr).toBe('current_tilt_position');
    expect(axes[0].min).toBe(0);
    expect(axes[0].max).toBe(100);
    expect(axes[0].unit).toBe('%');
  });

  it('filters out axes with supported === false but keeps order', () => {
    const d = withDiscovery({
      axes: [
        { id: 'position', supported: true },
        { id: 'tilt', supported: false },
      ],
    });
    expect(resolveAxes(d).map((a) => a.id)).toEqual(['position']);
  });

  it('treats a missing supported flag as supported', () => {
    const d = withDiscovery({ axes: [{ id: 'position' }, { id: 'tilt' }] });
    expect(resolveAxes(d).map((a) => a.id)).toEqual(['position', 'tilt']);
  });

  it('defaults min/max/unit and capitalizes the id label when discovery omits them', () => {
    const d = withDiscovery({ axes: [{ id: 'position' }] });
    const [pos] = resolveAxes(d);
    expect(pos.min).toBe(0);
    expect(pos.max).toBe(100);
    expect(pos.unit).toBe('%');
    expect(pos.label).toBe('Position');
  });

  it('honors non-0–100 ranges and a custom unit from discovery', () => {
    const d = withDiscovery({
      axes: [{ id: 'position', min: -90, max: 90, unit: '°', supported: true }],
    });
    const [pos] = resolveAxes(d);
    expect(pos.min).toBe(-90);
    expect(pos.max).toBe(90);
    expect(pos.unit).toBe('°');
  });
});

describe('resolveAxes — fallback path (no discovery)', () => {
  it('synthesizes a single position axis when no tilt sensor exists', () => {
    const axes = resolveAxes(base);
    expect(axes.map((a) => a.id)).toEqual(['position']);
    expect(axes[0].targetRole).toBe('target_position_sensor');
    expect(axes[0].stateAttr).toBe('current_position');
    expect(axes[0].min).toBe(0);
    expect(axes[0].max).toBe(100);
    expect(axes[0].unit).toBe('%');
  });

  it('adds a tilt axis when the entry exposes a target_tilt_sensor', () => {
    const d: DiscoveredEntities = {
      ...base,
      cover_type: 'cover_venetian',
      entities: { target_position_sensor: 'sensor.pos', target_tilt_sensor: 'sensor.tilt' },
    };
    const axes = resolveAxes(d);
    expect(axes.map((a) => a.id)).toEqual(['position', 'tilt']);
    expect(axes[1].targetRole).toBe('target_tilt_sensor');
    expect(axes[1].stateAttr).toBe('current_tilt_position');
  });

  it('falls back when discovery is present but axes is not an array', () => {
    const d = { ...base, discovery: { axes: undefined } } as DiscoveredEntities;
    expect(resolveAxes(d).map((a) => a.id)).toEqual(['position']);
  });
});

// ── Frame inversion (#234) ───────────────────────────────────────────────────
// `inverted` means "effectively inverted right now" — the integration already
// accounts for interpolation suppressing position inversion, so the card only
// ever reads the flag, never re-derives it.
describe('resolveAxes — inverted flag (#234)', () => {
  it('carries inverted: true from a discovery axis', () => {
    const d = withDiscovery({ axes: [{ id: 'position', inverted: true, supported: true }] });
    expect(resolveAxes(d)[0].inverted).toBe(true);
  });

  it('defaults inverted to false when the discovery axis omits the field', () => {
    const d = withDiscovery({ axes: [{ id: 'position', supported: true }] });
    expect(resolveAxes(d)[0].inverted).toBe(false);
  });

  // The tilt axis carries its own inversion option (CONF_INVERSE_TILT) on the
  // integration side, so `inverted` must survive per-axis, not just on position
  // (issue #236).
  it('carries inverted through on a non-position (tilt) axis', () => {
    const d = withDiscovery({
      axes: [
        { id: 'position', supported: true },
        { id: 'tilt', inverted: true, supported: true },
      ],
    });
    expect(resolveAxes(d).map((a) => a.inverted)).toEqual([false, true]);
  });

  it('defaults inverted to false on both synthesized fallback axes', () => {
    const d: DiscoveredEntities = {
      ...base,
      cover_type: 'cover_venetian',
      entities: { target_position_sensor: 'sensor.pos', target_tilt_sensor: 'sensor.tilt' },
    };
    expect(resolveAxes(d).map((a) => a.inverted)).toEqual([false, false]);
  });
});

describe('positionAxisInverted — #234', () => {
  it('is true when the discovered position axis is inverted', () => {
    const d = withDiscovery({ axes: [{ id: 'position', inverted: true, supported: true }] });
    expect(positionAxisInverted(d)).toBe(true);
  });

  it('is false when the position axis omits the flag', () => {
    const d = withDiscovery({ axes: [{ id: 'position', supported: true }] });
    expect(positionAxisInverted(d)).toBe(false);
  });

  it('is false when only a non-position axis is inverted', () => {
    const d = withDiscovery({
      axes: [
        { id: 'position', supported: true },
        { id: 'tilt', inverted: true, supported: true },
      ],
    });
    expect(positionAxisInverted(d)).toBe(false);
  });

  it('is false on a legacy entry with no discovery at all', () => {
    expect(positionAxisInverted(base)).toBe(false);
  });
});

// ── display polarity: open_blocks_sun → axisDisplayValue ─────────────────────
// The rails, the covers-bar tracks and the compass wedge all draw "how much sun
// is this axis blocking", so the direction a track fills in is data, not a
// per-component decision. These pin the resolution order for that flag and the
// transform it feeds.

describe('resolveAxes — openBlocksSun resolution', () => {
  it('takes the discovery flag verbatim when the integration publishes it', () => {
    const d = withDiscovery({
      axes: [
        { id: 'position', supported: true, open_blocks_sun: true },
        { id: 'tilt', supported: true, open_blocks_sun: false },
      ],
    });
    const axes = resolveAxes(d);
    expect(axes.find((a) => a.id === 'position')!.openBlocksSun).toBe(true);
    expect(axes.find((a) => a.id === 'tilt')!.openBlocksSun).toBe(false);
  });

  it('honours a published `false` on an awning rather than the cover-type guess', () => {
    // The payload wins outright — a future cover type that reports itself is not
    // second-guessed by the card's fallback list.
    const d = {
      ...base,
      cover_type: 'cover_awning',
      discovery: {
        axes: [{ id: 'position', supported: true, open_blocks_sun: false }],
      },
    } as DiscoveredEntities;
    expect(resolveAxes(d).find((a) => a.id === 'position')!.openBlocksSun).toBe(false);
  });

  it('falls back to the cover type when discovery omits the flag entirely', () => {
    // An integration new enough to publish `cover_discovery` but older than
    // `open_blocks_sun`. Defaulting to false here drew every awning backwards.
    const awning = {
      ...base,
      cover_type: 'cover_awning',
      discovery: {
        axes: [{ id: 'position', supported: true }],
      },
    } as DiscoveredEntities;
    const blind = withDiscovery({ axes: [{ id: 'position', supported: true }] });
    expect(resolveAxes(awning).find((a) => a.id === 'position')!.openBlocksSun).toBe(true);
    expect(resolveAxes(blind).find((a) => a.id === 'position')!.openBlocksSun).toBe(false);
  });

  it('covers the oscillating awning, which the integration marks the same way', () => {
    const d = { ...base, cover_type: 'cover_oscillating_awning' } as DiscoveredEntities;
    expect(positionAxisFor(d).openBlocksSun).toBe(true);
  });

  it('never marks a non-position axis from the cover type alone', () => {
    // Only the POSITION axis of an awning extends into the sun; its slat axis
    // (were it to have one) closes like any other.
    const d = {
      ...base,
      cover_type: 'cover_awning',
      discovery: {
        axes: [{ id: 'tilt', supported: true }],
      },
    } as DiscoveredEntities;
    expect(resolveAxes(d).find((a) => a.id === 'tilt')!.openBlocksSun).toBe(false);
  });

  it('synthesizes the flag on a legacy entry with no discovery at all', () => {
    const awning = { ...base, cover_type: 'cover_awning' } as DiscoveredEntities;
    expect(resolveAxes(awning)[0].openBlocksSun).toBe(true);
    expect(resolveAxes(base)[0].openBlocksSun).toBe(false);
  });
});

describe('positionAxisFor', () => {
  it('returns the discovered position axis when there is one', () => {
    const d = withDiscovery({
      axes: [{ id: 'position', supported: true, min: 0, max: 100, open_blocks_sun: true }],
    });
    expect(positionAxisFor(d).id).toBe('position');
    expect(positionAxisFor(d).openBlocksSun).toBe(true);
  });

  it('synthesizes a position axis for a tilt-only cover type', () => {
    // `cover_tilt` / louvered roof publish only a slat axis, but the card still
    // renders position rails. Taking axes[0] would hand them the slat axis and
    // its range, which need not be the 0–100 a track fraction speaks in.
    const d = {
      ...base,
      cover_type: 'cover_tilt',
      discovery: {
        axes: [{ id: 'tilt', supported: true, min: -90, max: 90 }],
      },
    } as DiscoveredEntities;
    const axis = positionAxisFor(d);
    expect(axis.id).toBe('position');
    expect(axis.min).toBe(0);
    expect(axis.max).toBe(100);
  });
});

// ── tilt-only cover types: no fabricated position axis (#277) ────────────────
// A louvered roof / `cover_tilt` entry declares exactly one axis and it is the
// slat axis. `positionAxisFor` synthesizes a position axis anyway (it is the
// polarity oracle for the compass and the group surfaces), so the surfaces that
// must NOT fabricate one — the ↑■↓ buttons, the `%` readout, the position rail —
// need their own predicate and their own default axis.

describe('hasPositionAxis (#277)', () => {
  it('is false for a tilt-only discovery (cover_louvered_roof)', () => {
    const d = {
      ...base,
      cover_type: 'cover_louvered_roof',
      discovery: {
        cover_type: 'cover_louvered_roof',
        axes: [{ id: 'tilt', state_attr: 'current_tilt_position', supported: true }],
      },
    } as DiscoveredEntities;
    expect(hasPositionAxis(d)).toBe(false);
  });

  it('is true when discovery declares a position axis', () => {
    const d = withDiscovery({
      axes: [
        { id: 'position', supported: true },
        { id: 'tilt', supported: true },
      ],
    });
    expect(hasPositionAxis(d)).toBe(true);
  });

  it('is true on a legacy entry with no discovery — the fallback synthesizes one', () => {
    // Inert for every pre-discovery install: the gates this predicate feeds must
    // not change anything on an integration that publishes no `cover_discovery`.
    expect(hasPositionAxis(base)).toBe(true);
  });

  it('is false when the position axis is declared but supported: false', () => {
    // Reads the SUPPORTED axes, like every other consumer of `resolveAxes`: an
    // axis the entry cannot drive is not a position axis the card can render.
    const d = withDiscovery({
      axes: [
        { id: 'position', supported: false },
        { id: 'tilt', supported: true },
      ],
    });
    expect(hasPositionAxis(d)).toBe(false);
  });
});

describe('primaryAxisFor (#277)', () => {
  it('returns the slat axis for a tilt-only cover type', () => {
    const d = {
      ...base,
      cover_type: 'cover_louvered_roof',
      discovery: {
        cover_type: 'cover_louvered_roof',
        axes: [{ id: 'tilt', state_attr: 'current_tilt_position', supported: true }],
      },
    } as DiscoveredEntities;
    const axis = primaryAxisFor(d);
    expect(axis.id).toBe('tilt');
    expect(axis.stateAttr).toBe('current_tilt_position');
  });

  it('returns the position axis on a dual-axis (venetian) entry — dual-axis policies declare position first', () => {
    const d = withDiscovery({
      cover_type: 'cover_venetian',
      axes: [
        { id: 'position', state_attr: 'current_position', supported: true },
        { id: 'tilt', state_attr: 'current_tilt_position', supported: true },
      ],
    });
    expect(primaryAxisFor(d).id).toBe('position');
  });

  it('returns the surviving tilt axis when the declared position axis is supported: false', () => {
    // `set_axes` accepts only the supported axes, so the surviving one is the
    // only payload that can move this cover.
    const d = withDiscovery({
      axes: [
        { id: 'position', supported: false },
        { id: 'tilt', state_attr: 'current_tilt_position', supported: true },
      ],
    });
    expect(primaryAxisFor(d).id).toBe('tilt');
  });

  it('falls back to the synthesized position axis on a legacy entry', () => {
    expect(primaryAxisFor(base).id).toBe('position');
  });

  it('falls back to the synthesized position axis when every declared axis is unsupported', () => {
    const d = withDiscovery({
      axes: [
        { id: 'position', supported: false },
        { id: 'tilt', supported: false },
      ],
    });
    const axis = primaryAxisFor(d);
    expect(axis.id).toBe('position');
    expect(axis.min).toBe(0);
    expect(axis.max).toBe(100);
  });
});

describe('resolveAxes — leading-axis targetRole (#277)', () => {
  it('maps a leading non-position axis to target_position_sensor (tilt-only)', () => {
    // The integration publishes the PRIMARY axis under the position-named
    // surfaces: `Cover_Position` carries its target for every cover type, and
    // `Cover_Tilt` exists only where `exposes_dual_axis_sensor` is true
    // (venetian / day-night shade). A louvered roof's slat target therefore
    // lives on `Cover_Position`, not on a sensor that was never created.
    const d = {
      ...base,
      cover_type: 'cover_louvered_roof',
      discovery: {
        cover_type: 'cover_louvered_roof',
        axes: [{ id: 'tilt', state_attr: 'current_tilt_position', supported: true }],
      },
    } as DiscoveredEntities;
    expect(resolveAxes(d)[0].targetRole).toBe('target_position_sensor');
  });

  it('keeps id-based roles on a position-led dual-axis entry', () => {
    const d = withDiscovery({
      cover_type: 'cover_venetian',
      axes: [
        { id: 'position', supported: true },
        { id: 'tilt', supported: true },
      ],
    });
    expect(resolveAxes(d).map((a) => a.targetRole)).toEqual([
      'target_position_sensor',
      'target_tilt_sensor',
    ]);
  });

  it('keeps target_tilt_sensor on a surviving tilt axis when the declared leader (position) was filtered as unsupported', () => {
    // The re-map keys on the DECLARED leader, not the surviving one: this entry
    // is a dual-axis type whose position axis happens to be undrivable, so its
    // `Cover_Tilt` sensor still exists and still carries the slat target.
    const d = withDiscovery({
      cover_type: 'cover_venetian',
      axes: [
        { id: 'position', supported: false },
        { id: 'tilt', supported: true },
      ],
    });
    expect(resolveAxes(d).map((a) => a.targetRole)).toEqual(['target_tilt_sensor']);
  });
});

describe('axisDisplayValue', () => {
  const blind = { openBlocksSun: false, min: 0, max: 100 };
  const awning = { openBlocksSun: true, min: 0, max: 100 };

  it('mirrors an axis whose open end lets the sun in', () => {
    expect(axisDisplayValue(0, blind)).toBe(100);
    expect(axisDisplayValue(100, blind)).toBe(0);
    expect(axisDisplayValue(30, blind)).toBe(70);
  });

  it('is the identity for an axis whose open end blocks the sun', () => {
    expect(axisDisplayValue(0, awning)).toBe(0);
    expect(axisDisplayValue(100, awning)).toBe(100);
    expect(axisDisplayValue(30, awning)).toBe(30);
  });

  it('is its own inverse — which is what lets one function serve fill and pointer', () => {
    for (const v of [0, 1, 37, 50, 99, 100]) {
      expect(axisDisplayValue(axisDisplayValue(v, blind), blind)).toBe(v);
      expect(axisDisplayValue(axisDisplayValue(v, awning), awning)).toBe(v);
    }
  });

  it('mirrors within a non-0–100 range, so a slat axis stays inside its bounds', () => {
    const slat = { openBlocksSun: false, min: -90, max: 90 };
    expect(axisDisplayValue(-90, slat)).toBe(90);
    expect(axisDisplayValue(90, slat)).toBe(-90);
    expect(axisDisplayValue(0, slat)).toBe(0);
  });
});

describe('axisFraction', () => {
  const blind = { openBlocksSun: false, min: 0, max: 100 };
  const awning = { openBlocksSun: true, min: 0, max: 100 };
  const slat = { openBlocksSun: false, min: -90, max: 90 };
  const slatIdentity = { openBlocksSun: true, min: -90, max: 90 };

  it('maps a 0–100 identity axis straight onto the track', () => {
    expect(axisFraction(0, awning)).toBe(0);
    expect(axisFraction(35, awning)).toBe(35);
    expect(axisFraction(100, awning)).toBe(100);
  });

  it('flips a mirrored 0–100 axis', () => {
    expect(axisFraction(35, blind)).toBe(65);
    expect(axisFraction(0, blind)).toBe(100);
    expect(axisFraction(100, blind)).toBe(0);
  });

  it('normalizes a non-0–100 range onto the track before mirroring', () => {
    expect(axisFraction(45, slatIdentity)).toBe(75);
    expect(axisFraction(45, slat)).toBe(25);
  });

  it('draws EMPTY, never full, when there is no reading', () => {
    // Substituting `min` would be harmless on an identity axis but maps to a
    // completely full bar on a mirrored one — an unknown cover reading as
    // fully blocking.
    expect(axisFraction(null, blind)).toBe(0);
    expect(axisFraction(undefined, blind)).toBe(0);
    expect(axisFraction(NaN, blind)).toBe(0);
    expect(axisFraction(null, awning)).toBe(0);
  });

  it('draws empty for a zero-span axis rather than dividing by zero', () => {
    expect(axisFraction(50, { openBlocksSun: true, min: 50, max: 50 })).toBe(0);
    expect(axisFraction(50, { openBlocksSun: false, min: 50, max: 50 })).toBe(0);
  });

  it('clamps a value outside the range to the track ends', () => {
    expect(axisFraction(150, awning)).toBe(100);
    expect(axisFraction(-20, awning)).toBe(0);
    expect(axisFraction(150, blind)).toBe(0);
    expect(axisFraction(-20, blind)).toBe(100);
  });

  it('agrees with axisDisplayValue — the parity that lets one helper serve both', () => {
    // `_frac` in `acp-axis-bar` mirrored on the PERCENTAGE while
    // `axisDisplayValue` mirrors in AXIS UNITS. This sweep is the evidence that
    // the two rules are the same rule, which is what allows `_frac` to be
    // deleted in favour of this helper.
    for (const v of [0, 1, 17, 35, 50, 62, 99, 100]) {
      expect(axisFraction(v, blind)).toBe(axisFraction(axisDisplayValue(v, blind), awning));
    }
    for (const v of [-90, -45, -1, 0, 1, 45, 90]) {
      expect(axisFraction(v, slat)).toBe(axisFraction(axisDisplayValue(v, slat), slatIdentity));
    }
  });
});
