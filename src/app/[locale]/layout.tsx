import MainLayout from "@/components/MainLayout";
import { AuthProvider } from "@/components/AuthProvider";
import { locales } from "@/i18n/request";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from 'next-intl';

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
  }>
) {
  const params = await props.params;

  const {
    children
  } = props;

  const { locale } = params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  // MANUALLY load messages using the correct locale segment
  // bypass getMessages() which seems to be stuck on 'en'
  let messages;
  try {
    messages = require(`@/messages/messages-v3-${locale}.json`);
  } catch (e) {
    messages = require(`@/messages/messages-v3-en.json`);
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
