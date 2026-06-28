import { en, type EnDict } from './i18n/en';
import { fr } from './i18n/fr';
import { de } from './i18n/de';

export type Locale = 'en' | 'fr' | 'de';

const TABLES: Record<Locale, EnDict> = { en, fr, de };

interface HassLocaleLike {
  language?: string;
  locale?: { language?: string };
}

export function resolveLocale(hass: HassLocaleLike | undefined): Locale {
  const raw = hass?.locale?.language ?? hass?.language ?? 'en';
  const base = raw.toLowerCase().split('-')[0];
  if (base in TABLES) {
    return base as Locale;
  }
  return 'en';
}

function lookup(table: unknown, key: string): string | undefined {
  const parts = key.split('.');
  let node: unknown = table;
  for (const part of parts) {
    if (typeof node !== 'object' || node === null) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === 'string' ? node : undefined;
}

function interpolate(template: string, params: Record<string, unknown> | undefined): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    if (Object.prototype.hasOwnProperty.call(params, name)) {
      return String(params[name]);
    }
    return match;
  });
}

export function t(
  key: string,
  hass: HassLocaleLike | undefined,
  params?: Record<string, unknown>,
): string {
  const locale = resolveLocale(hass);
  const primary = lookup(TABLES[locale], key);
  if (primary !== undefined) return interpolate(primary, params);
  if (locale !== 'en') {
    const fallback = lookup(TABLES.en, key);
    if (fallback !== undefined) return interpolate(fallback, params);
  }
  return key;
}
