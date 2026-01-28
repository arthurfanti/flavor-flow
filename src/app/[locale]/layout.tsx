import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "sonner";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import MainLayout from "@/components/MainLayout";
import { AuthProvider } from "@/components/AuthProvider";
import "../globals.css";
import { locales } from "@/i18n/request";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flavor Flow",
  description: "Transform video recipes into a shopping list",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Flavor Flow",
  },
  formatDetection: {
    telephone: false,
  },
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
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
    <html lang={locale} className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <Toaster position="top-center" richColors />
        <ServiceWorkerRegister />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <MainLayout>{children}</MainLayout>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
