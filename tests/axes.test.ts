import { describe, it, expect } from 'vitest';
import {
  axisDisplayValue,
  positionAxisFor,
  positionAxisInverted,
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
