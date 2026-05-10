import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
// @ts-ignore
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "BarberíaOS",
  description: "SaaS de reservas, QR y marketing para barberías",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BarberíaOS",
  },
  icons: {
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
