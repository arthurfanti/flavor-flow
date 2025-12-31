import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flavor Flow",
  description: "Transform video recipes into a shopping list",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
