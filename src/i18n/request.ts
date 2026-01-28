import {getRequestConfig} from 'next-intl/server';

export const locales = ['en', 'pt', 'es'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  const activeLocale = locales.includes(locale as any) ? (locale as Locale) : 'en';

  const messages = (await import(`../messages/messages-v3-${activeLocale}.json`)).default;
  console.log(`[i18n/request] locale: ${activeLocale}, discover: ${messages.Home?.discover}`);

  return {
    locale: activeLocale,
    messages
  };
});
