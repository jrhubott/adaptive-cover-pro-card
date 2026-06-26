import { describe, it, expect } from 'vitest';
import { formatSolarValue, buildSolarCalcView, hiddenFieldCount } from '../src/lib/solar-calc';

describe('formatSolarValue', () => {
  it('formats by unit suffix', () => {
    expect(formatSolarValue('position_pct', 72.4)).toBe('72%');
    expect(formatSolarValue('sol_elev_deg', 41.23)).toBe('41.2°');
    expect(formatSolarValue('effective_distance_m', 1.8401)).toBe('1.840 m');
    expect(formatSolarValue('beta_rad', 0.7159)).toBe('0.716 rad');
    expect(formatSolarValue('cos_gamma', 0.97712)).toBe('0.977');
  });

  it('formats booleans, arrays, strings, and nullish', () => {
    expect(formatSolarValue('edge_case_detected', true)).toBe('✓');
    expect(formatSolarValue('edge_case_detected', false)).toBe('✗');
    expect(formatSolarValue('glare_zones_active', ['a', 'b'])).toBe('a, b');
    expect(formatSolarValue('glare_zones_active', [])).toBe('—');
    expect(formatSolarValue('tilt_mode', 'mid')).toBe('mid');
    expect(formatSolarValue('position_pct', null)).toBe('—');
    expect(formatSolarValue('position_pct', undefined)).toBe('—');
    expect(formatSolarValue('sol_elev_deg', NaN)).toBe('—');
  });
});

const BLIND = {
  cover_type: 'cover_blind',
  sol_elev_deg: 41.2,
  gamma_deg: 12.4,
  position_pct: 72,
  status: 'Direct Sun',
  effective_distance_m: 1.84,
  adjusted_height_m: 1.21,
  safety_margin: 0.95,
  cos_gamma: 0.977,
  path_length_m: 1.88,
  base_height_m: 1.2,
};

describe('buildSolarCalcView — curated vs full', () => {
  it('curated view shows inputs, curated intermediates, output', () => {
    const v = buildSolarCalcView(BLIND, false);
    expect(v.coverType).toBe('cover_blind');
    expect(v.position.inputs.map((f) => f.key)).toEqual(['sol_elev_deg', 'gamma_deg']);
    expect(v.position.output.map((f) => f.key)).toEqual(['position_pct']);
    // Only the curated intermediates present in attrs.
    expect(v.position.intermediates.map((f) => f.key)).toEqual([
      'effective_distance_m',
      'adjusted_height_m',
      'safety_margin',
    ]);
    expect(v.position.hasTarget).toBe(true);
    expect(v.position.status).toBe('Direct Sun');
  });

  it('show-all view reveals raw extras after the curated keys', () => {
    const v = buildSolarCalcView(BLIND, true);
    const keys = v.position.intermediates.map((f) => f.key);
    // Curated first, then the remaining raw keys.
    expect(keys.slice(0, 3)).toEqual([
      'effective_distance_m',
      'adjusted_height_m',
      'safety_margin',
    ]);
    expect(keys).toContain('cos_gamma');
    expect(keys).toContain('path_length_m');
    expect(keys).toContain('base_height_m');
    // Raw extras are not flagged curated; curated keys are.
    expect(v.position.intermediates.find((f) => f.key === 'cos_gamma')!.curated).toBe(false);
    expect(v.position.intermediates.find((f) => f.key === 'safety_margin')!.curated).toBe(true);
  });

  it('hiddenFieldCount counts the show-all-only extras', () => {
    expect(hiddenFieldCount(BLIND)).toBe(3); // cos_gamma, path_length_m, base_height_m
  });
});

describe('buildSolarCalcView — no solar target', () => {
  it('marks hasTarget false when position_pct is null', () => {
    const v = buildSolarCalcView(
      {
        cover_type: 'cover_blind',
        sol_elev_deg: 5,
        gamma_deg: 80,
        position_pct: null,
        status: 'Default: FOV Exit',
      },
      false,
    );
    expect(v.position.hasTarget).toBe(false);
    expect(v.position.status).toBe('Default: FOV Exit');
    // Output field still present (value renders as em-dash), inputs present.
    expect(v.position.inputs.length).toBe(2);
  });
});

describe('buildSolarCalcView — venetian dual axis', () => {
  it('builds a tilt axis from the nested tilt sub-object', () => {
    const venetian = {
      ...BLIND,
      cover_type: 'cover_venetian',
      tilt: {
        cover_type: 'cover_tilt',
        sol_elev_deg: 41.2,
        gamma_deg: 12.4,
        position_pct: 30,
        status: 'Direct Sun',
        slat_angle_raw_deg: 48.8,
        tilt_mode: 'mid',
        max_degrees: 90,
        beta_rad: 0.719,
      },
    };
    const v = buildSolarCalcView(venetian, false);
    expect(v.coverType).toBe('cover_venetian');
    expect(v.tilt).toBeDefined();
    expect(v.tilt!.inputs.map((f) => f.key)).toEqual(['sol_elev_deg', 'gamma_deg']);
    expect(v.tilt!.intermediates.map((f) => f.key)).toEqual([
      'slat_angle_raw_deg',
      'tilt_mode',
      'max_degrees',
    ]);
    expect(v.tilt!.output.map((f) => f.key)).toEqual(['position_pct']);
  });

  it('omits the tilt axis for non-venetian cover types', () => {
    expect(buildSolarCalcView(BLIND, false).tilt).toBeUndefined();
  });
});
