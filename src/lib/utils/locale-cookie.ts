import { locales, Locale } from '@/i18n/request';

export const PREFERRED_LOCALE_COOKIE = 'preferred_locale';

export function isValidLocale(locale: string | undefined): locale is Locale {
  return locale !== undefined && locales.includes(locale as Locale);
}

export function parseLocale(locale: string | undefined): Locale {
  if (isValidLocale(locale)) return locale;
  return 'en';
}