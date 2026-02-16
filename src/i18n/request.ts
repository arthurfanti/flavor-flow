import {getRequestConfig} from 'next-intl/server';

export const locales = ['en', 'pt', 'es'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  
  if (!locale || !locales.includes(locale as any)) {
    locale = 'en';
  }
  
  const activeLocale = locale as Locale;

  const messages = (await import(`../messages/messages-v3-${activeLocale}.json`)).default;
  console.log(`[i18n/request] locale: ${activeLocale}, discover: ${messages.Home?.discover}`);

  return {
    locale: activeLocale,
    messages
  };
});
