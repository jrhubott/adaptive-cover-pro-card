import { describe, it, expect } from 'vitest';
import { resolveAxes, positionAxisInverted } from '../src/lib/axes';
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
