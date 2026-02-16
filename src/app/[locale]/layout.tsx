import MainLayout from "@/components/MainLayout";
import { AuthProvider } from "@/components/AuthProvider";
import { locales } from "@/i18n/request";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from 'next-intl';

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }>
) {
  const { locale } = await props.params;
  const { children } = props;

  if (!locales.includes(locale as any)) notFound();

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
