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

  // Both translations, not just DE: a placeholder typo'd in one locale renders
  // a literal `{total}` to that locale's users, and key-path parity above does
  // not catch it — the key is present, only its body is wrong.
  const TRANSLATIONS: Array<[string, unknown]> = [
    ['FR', fr],
    ['DE', de],
  ];

  it.each(TRANSLATIONS)('every %s value is a non-empty string', (_locale, table) => {
    for (const [key, value] of leaves(table)) {
      expect(typeof value, key).toBe('string');
      expect((value as string).length, key).toBeGreaterThan(0);
    }
  });

  it.each(TRANSLATIONS)(
    '%s placeholder tokens match EN for every interpolated key',
    (_locale, table) => {
      const tokens = (s: string): string[] => (s.match(/\{(\w+)\}/g) ?? []).sort();
      const enLeaves = Object.fromEntries(leaves(en) as Array<[string, string]>);
      for (const [key, value] of leaves(table) as Array<[string, string]>) {
        expect(tokens(value), key).toEqual(tokens(enLeaves[key]));
      }
    },
  );
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

describe('linear position motor tooltip i18n (issue #219)', () => {
  const keys = ['covers.target_tooltip_motor'];
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

describe('tile card editor i18n — show_controls arrow consistency (issue #217)', () => {
  it.each([
    ['en', en],
    ['fr', fr],
    ['de', de],
  ])('%s editor.tile.show_controls uses ↑ ■ ↓, not the ▼ triangle', (_locale, table) => {
    const value = table.editor.tile.show_controls;
    expect(value).toContain('↓');
    expect(value).not.toContain('▼');
  });
});

describe('History card i18n', () => {
  // Every key the History card renders, enumerated from the EN table so a newly
  // added key is covered without touching this list.
  const historyKeys = Object.keys(en.history).map((k) => `history.${k}`);
  const statusKeys = Object.keys(en.control_status).map((k) => `control_status.${k}`);
  const editorKeys = Object.keys(en.editor.history).map((k) => `editor.history.${k}`);
  const allKeys = [...historyKeys, ...statusKeys, ...editorKeys];

  it('defines a non-trivial number of keys (guards an accidental block deletion)', () => {
    expect(historyKeys.length).toBeGreaterThan(30);
    expect(statusKeys.length).toBeGreaterThan(5);
  });

  for (const locale of ['en', 'fr', 'de'] as const) {
    it(`every key resolves to a non-empty, non-key string in ${locale.toUpperCase()}`, () => {
      const hass = { locale: { language: locale } };
      for (const key of allKeys) {
        const value = t(key, hass);
        // `t()` echoes the key when the lookup misses.
        expect(value, `${key} missing in ${locale}`).not.toBe(key);
        expect(value.trim(), `${key} empty in ${locale}`).not.toBe('');
      }
    });
  }

  it('FR and DE carry the same placeholder tokens as EN for every History key', () => {
    // A dropped {hours} / {shown} / {from} would render a literal brace to the
    // user, and TypeScript cannot catch it — the type is just `string`.
    const tokens = (s: string): string[] => (s.match(/\{(\w+)\}/g) ?? []).sort();
    for (const key of allKeys) {
      const enValue = t(key, { locale: { language: 'en' } });
      for (const locale of ['fr', 'de'] as const) {
        const value = t(key, { locale: { language: locale } });
        expect(tokens(value), `${key} placeholders differ in ${locale}`).toEqual(tokens(enValue));
      }
    }
  });

  it('control_status values cover the integration ControlStatus enum', () => {
    // Mirrors `ControlStatus` in the integration's const.py §23. A value the
    // card cannot name falls back to a humanized raw string, which is legible
    // but untranslated — so drift here is worth catching.
    for (const value of [
      'active',
      'outside_time_window',
      'position_delta_too_small',
      'time_delta_too_small',
      'manual_override',
      'automatic_control_off',
      'sun_not_visible',
      'force_override_active',
      'weather_override_active',
      'motion_timeout',
    ]) {
      expect(Object.keys(en.control_status)).toContain(value);
    }
  });

  it('the interpolated History keys actually substitute', () => {
    expect(t('history.window_hours', undefined, { hours: 24 })).toContain('24');
    expect(t('history.events_count', undefined, { shown: 3, total: 9 })).toContain('3');
    expect(t('history.buffer_size', undefined, { size: 50 })).toContain('50');
    expect(t('history.data_window', undefined, { from: 'A', to: 'B' })).toContain('A');
  });
});
