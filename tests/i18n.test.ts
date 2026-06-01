import { describe, expect, it } from 'vitest';

import { en } from '../src/lib/i18n/en';
import { fr } from '../src/lib/i18n/fr';
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

  it('falls back to "en" for an unknown locale', () => {
    expect(resolveLocale({ locale: { language: 'de' } })).toBe('en');
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
  it('FR has exactly the same key paths as EN', () => {
    const flat = (o: unknown, prefix = ''): string[] =>
      typeof o === 'object' && o !== null && !Array.isArray(o)
        ? Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
            flat(v, prefix ? `${prefix}.${k}` : k),
          )
        : [prefix];
    expect(flat(fr).sort()).toEqual(flat(en).sort());
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
