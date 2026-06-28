import { describe, expect, it } from 'vitest';

import { en } from '../src/lib/i18n/en';
import { fr } from '../src/lib/i18n/fr';
import { de } from '../src/lib/i18n/de';
import { resolveLocale, t } from '../src/lib/i18n';

describe('resolveLocale', () => {
  it('returns "en" when hass is undefined', () => {
    expect(resolveLocale(undefined)).toBe('en');
  });

  it('prefers hass.locale.language over hass.language', () => {
    expect(resolveLocale({ language: 'en', locale: { language: 'fr' } })).toBe('fr');
  });

  it('falls back to hass.language when locale.language is absent', () => {
    expect(resolveLocale({ language: 'fr' })).toBe('fr');
  });

  it('strips the region tag from BCP-47 codes', () => {
    expect(resolveLocale({ locale: { language: 'fr-CA' } })).toBe('fr');
  });

  it('handles case-insensitive BCP-47 codes', () => {
    expect(resolveLocale({ locale: { language: 'FR-ca' } })).toBe('fr');
  });

  it('resolves the German locale', () => {
    expect(resolveLocale({ locale: { language: 'de' } })).toBe('de');
  });

  it('strips the region tag from German BCP-47 codes', () => {
    expect(resolveLocale({ locale: { language: 'de-AT' } })).toBe('de');
  });

  it('falls back to "en" for an unknown locale', () => {
    expect(resolveLocale({ locale: { language: 'es' } })).toBe('en');
  });

  it('falls back to "en" for an empty locale string', () => {
    expect(resolveLocale({ locale: { language: '' } })).toBe('en');
  });
});

describe('t', () => {
  it('returns the key when neither EN nor FR table has the entry', () => {
    expect(t('does.not.exist', undefined)).toBe('does.not.exist');
  });

  it('returns the EN value when locale resolves to en', () => {
    expect(t('handler.solar', { locale: { language: 'en' } })).toBe('Solar Tracking');
  });

  it('returns the FR table value for fr locale', () => {
    expect(t('handler.solar', { locale: { language: 'fr' } })).toBe('Suivi solaire');
  });

  it('returns the DE table value for de locale', () => {
    expect(t('handler.solar', { locale: { language: 'de' } })).toBe(de.handler.solar);
    expect(de.handler.solar).not.toBe(en.handler.solar);
  });

  it('returns the key name when neither table has the entry for fr locale', () => {
    expect(t('handler.unknown_handler', { locale: { language: 'fr' } })).toBe(
      'handler.unknown_handler',
    );
  });

  it('interpolates a string parameter', () => {
    expect(t('overrides.ends_in', undefined, { time: '5m' })).toBe('ends in 5m');
  });

  it('leaves placeholders intact when no params are passed', () => {
    expect(t('overrides.ends_in', undefined)).toBe('ends in {time}');
  });

  it('leaves placeholders intact when params is an empty object', () => {
    expect(t('overrides.ends_in', undefined, {})).toBe('ends in {time}');
  });

  it('coerces numeric params to strings', () => {
    expect(t('overrides.active_count', undefined, { count: 3 })).toBe('3 active');
  });
});

describe('floor glyph (↥) i18n', () => {
  it('dialog.floor is the ↥ glyph in EN and FR (language-neutral)', () => {
    expect(en.dialog.floor).toBe('↥');
    expect(fr.dialog.floor).toBe('↥');
  });

  it('badge.floor_suffix is " ↥" (leading space) in EN and FR', () => {
    expect((en.badge as Record<string, string>).floor_suffix).toBe(' ↥');
    expect((fr.badge as Record<string, string>).floor_suffix).toBe(' ↥');
  });
});

describe('climate inactive_reason + threshold i18n (issue #129)', () => {
  const reasonSlugs = [
    'outside_time_window',
    'thresholds_not_met',
    'other_mode_active',
    'readings_unavailable',
    'mode_off',
  ];
  const thresholdKeys = ['threshold_low', 'threshold_high', 'threshold_summer_outside'];

  it.each(reasonSlugs)('en.climate.reason.%s is a non-empty string', (slug) => {
    const v = (en.climate.reason as Record<string, string>)[slug];
    expect(typeof v).toBe('string');
    expect(v.length).toBeGreaterThan(0);
  });

  it.each(reasonSlugs)('fr.climate.reason.%s is a non-empty string (parity)', (slug) => {
    const v = (fr.climate.reason as Record<string, string>)[slug];
    expect(typeof v).toBe('string');
    expect(v.length).toBeGreaterThan(0);
  });

  it.each(thresholdKeys)('en.climate.%s and fr.climate.%s are non-empty (parity)', (key) => {
    const enV = (en.climate as unknown as Record<string, string>)[key];
    const frV = (fr.climate as unknown as Record<string, string>)[key];
    expect(typeof enV).toBe('string');
    expect(enV.length).toBeGreaterThan(0);
    expect(typeof frV).toBe('string');
    expect(frV.length).toBeGreaterThan(0);
  });
});

describe('version footer i18n', () => {
  it('root.footer_version is defined in EN', () => {
    expect(en.root.footer_version).toBeDefined();
  });

  it('root.footer_version is defined in FR', () => {
    expect(fr.root.footer_version).toBeDefined();
  });

  it('editor.main.show_version_label is undefined in EN', () => {
    expect((en.editor.main as Record<string, string>)['show_version_label']).toBeUndefined();
  });

  it('editor.main.show_version_label is undefined in FR', () => {
    expect((fr.editor.main as Record<string, string>)['show_version_label']).toBeUndefined();
  });

  it('editor.main.show_version_desc is undefined in EN', () => {
    expect((en.editor.main as Record<string, string>)['show_version_desc']).toBeUndefined();
  });

  it('editor.main.show_version_desc is undefined in FR', () => {
    expect((fr.editor.main as Record<string, string>)['show_version_desc']).toBeUndefined();
  });
});

describe('locale-table parity', () => {
  // Compile-time parity comes from `const fr: typeof en = {...}` in fr.ts. Runtime check is defense-in-depth.
  const flat = (o: unknown, prefix = ''): string[] =>
    typeof o === 'object' && o !== null && !Array.isArray(o)
      ? Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
          flat(v, prefix ? `${prefix}.${k}` : k),
        )
      : [prefix];

  it('FR has exactly the same key paths as EN', () => {
    expect(flat(fr).sort()).toEqual(flat(en).sort());
  });

  it('DE has exactly the same key paths as EN', () => {
    expect(flat(de).sort()).toEqual(flat(en).sort());
  });

  const leaves = (o: unknown, prefix = ''): Array<[string, unknown]> =>
    typeof o === 'object' && o !== null && !Array.isArray(o)
      ? Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
          leaves(v, prefix ? `${prefix}.${k}` : k),
        )
      : [[prefix, o]];

  it('every DE value is a non-empty string', () => {
    for (const [key, value] of leaves(de)) {
      expect(typeof value, key).toBe('string');
      expect((value as string).length, key).toBeGreaterThan(0);
    }
  });

  it('DE placeholder tokens match EN for every interpolated key', () => {
    const tokens = (s: string): string[] => (s.match(/\{(\w+)\}/g) ?? []).sort();
    const enLeaves = Object.fromEntries(leaves(en) as Array<[string, string]>);
    for (const [key, value] of leaves(de) as Array<[string, string]>) {
      expect(tokens(value), key).toEqual(tokens(enLeaves[key]));
    }
  });
});

describe('cover position i18n (issue #132)', () => {
  const keys = [
    // compass.cover_position retired in #158 → cover_target / cover_held.
    'compass.cover_target',
    'compass.cover_held',
    'compass.cover_position_target',
    'compass.cover_position_target_awning',
    'compass.cover_position_actual',
  ];
  for (const key of keys) {
    it(`${key} resolves to a non-key string in EN and FR`, () => {
      const enVal = t(key, { locale: { language: 'en' } });
      const frVal = t(key, { locale: { language: 'fr' } });
      expect(enVal).not.toBe(key);
      expect(frVal).not.toBe(key);
      expect(enVal.length).toBeGreaterThan(0);
      expect(frVal.length).toBeGreaterThan(0);
    });
  }

  it('the removed cover_closed / cover_extended keys are gone from both locales', () => {
    expect((en.compass as Record<string, string>)['cover_closed']).toBeUndefined();
    expect((en.compass as Record<string, string>)['cover_extended']).toBeUndefined();
    expect((en.compass as Record<string, string>)['cover_closed_tooltip']).toBeUndefined();
    expect((fr.compass as Record<string, string>)['cover_closed']).toBeUndefined();
    expect((fr.compass as Record<string, string>)['cover_extended']).toBeUndefined();
    expect((fr.compass as Record<string, string>)['cover_closed_tooltip']).toBeUndefined();
  });
});

describe('decision card editor i18n', () => {
  const keys = [
    'editor.decision.title',
    'editor.decision.compact_label',
    'editor.decision.compact_desc',
    'editor.decision.hide_inactive_handlers_label',
    'editor.decision.hide_inactive_handlers_desc',
    'editor.decision.show_decision_summary_label',
    'editor.decision.show_decision_summary_desc',
  ];
  for (const key of keys) {
    it(`${key} resolves to a non-key string in EN and FR`, () => {
      const enVal = t(key, { locale: { language: 'en' } });
      const frVal = t(key, { locale: { language: 'fr' } });
      expect(enVal).not.toBe(key);
      expect(frVal).not.toBe(key);
      expect(enVal.length).toBeGreaterThan(0);
      expect(frVal.length).toBeGreaterThan(0);
    });
  }
});

describe('outside-schedule i18n', () => {
  it('decision.outside_schedule resolves to a non-key string in EN and FR', () => {
    const enVal = t('decision.outside_schedule', { locale: { language: 'en' } });
    const frVal = t('decision.outside_schedule', { locale: { language: 'fr' } });
    expect(enVal).not.toBe('decision.outside_schedule');
    expect(frVal).not.toBe('decision.outside_schedule');
    expect(enVal.length).toBeGreaterThan(0);
    expect(frVal.length).toBeGreaterThan(0);
  });

  it('decision.outside_schedule_tooltip resolves to a non-key string in EN and FR', () => {
    const enVal = t('decision.outside_schedule_tooltip', { locale: { language: 'en' } });
    const frVal = t('decision.outside_schedule_tooltip', { locale: { language: 'fr' } });
    expect(enVal).not.toBe('decision.outside_schedule_tooltip');
    expect(frVal).not.toBe('decision.outside_schedule_tooltip');
  });

  it('badge.off_schedule resolves to a non-key string in EN and FR', () => {
    const enVal = t('badge.off_schedule', { locale: { language: 'en' } });
    const frVal = t('badge.off_schedule', { locale: { language: 'fr' } });
    expect(enVal).not.toBe('badge.off_schedule');
    expect(frVal).not.toBe('badge.off_schedule');
  });
});

describe('elevation schedule i18n (issue #128)', () => {
  const keys = [
    'elevation.schedule',
    'elevation.schedule_from',
    'elevation.schedule_until',
    'elevation.schedule_start_tooltip',
    'elevation.schedule_end_tooltip',
  ];
  for (const key of keys) {
    it(`${key} resolves to a non-key string in EN and FR`, () => {
      const enVal = t(key, { locale: { language: 'en' } });
      const frVal = t(key, { locale: { language: 'fr' } });
      expect(enVal).not.toBe(key);
      expect(frVal).not.toBe(key);
      expect(enVal.length).toBeGreaterThan(0);
      expect(frVal.length).toBeGreaterThan(0);
    });
  }

  it('elevation.schedule interpolates {from} and {to}', () => {
    expect(
      t('elevation.schedule', { locale: { language: 'en' } }, { from: '07:30', to: '21:00' }),
    ).toBe('Schedule 07:30 – 21:00');
  });
});

describe('forecast.solar_only_note i18n', () => {
  it('resolves to a non-key string in EN', () => {
    const result = t('forecast.solar_only_note', { locale: { language: 'en' } });
    expect(result).not.toBe('forecast.solar_only_note');
    expect(result.length).toBeGreaterThan(0);
  });

  it('resolves to a non-key string in FR', () => {
    const result = t('forecast.solar_only_note', { locale: { language: 'fr' } });
    expect(result).not.toBe('forecast.solar_only_note');
    expect(result.length).toBeGreaterThan(0);
  });
});
