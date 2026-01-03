import type { Metadata } from "next";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import MainLayout from "@/components/MainLayout";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegister />
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
