import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { CookieConsentBanner } from "@/components/legal/CookieConsentBanner";
import { SITE_URL } from "@/src/lib/site-url";
// @ts-ignore
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BarberíaOS | Reservas, caja y control para barberías",
    template: "%s | BarberíaOS",
  },
  description: "SaaS vertical para barberías en España: reservas online, QR, agenda, caja, clientes, barberos, reportes y suscripciones.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: "BarberíaOS",
    title: "BarberíaOS | Reservas, caja y control para barberías",
    description: "Gestiona reservas online, QR, agenda, caja, clientes y barberos desde un panel SaaS pensado para barberías.",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "BarberíaOS",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "BarberíaOS | Reservas, caja y control para barberías",
    description: "SaaS vertical para barberías: reservas online, QR, agenda, caja y control de barberos.",
    images: ["/icon.svg"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BarberíaOS",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
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
        <CookieConsentBanner />
        <Analytics />
      </body>
    </html>
  );
}
