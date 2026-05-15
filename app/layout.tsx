import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { FloatingWhatsAppButton } from "@/components/landing/FloatingWhatsAppButton";
import { CookieConsentBanner } from "@/components/legal/CookieConsentBanner";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";
// @ts-ignore
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS_CONFIG.siteUrl),
  title: {
    default: "Software para barberías | Reservas, caja y QR — BarberíaOS",
    template: "%s | BarberíaOS",
  },
  description:
    "Software para barberías con reservas online, caja, QR, página pública y control de barberos. Sin comisión por cita. Prueba BarberíaOS sin permanencia.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: BUSINESS_CONFIG.siteUrl,
    siteName: BUSINESS_CONFIG.commercialName,
    title: "Software para barberías | Reservas, caja y QR — BarberíaOS",
    description:
      "Software para barberías con reservas online, caja, QR y página pública. Sin comisión por cita. Sin permanencia.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "BarberíaOS — Software para barberías con reservas, caja y QR",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software para barberías | Reservas, caja y QR — BarberíaOS",
    description:
      "Software para barberías: reservas online, caja, QR y página pública. Sin comisión. Sin permanencia.",
    images: ["/opengraph-image"],
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
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
        <FloatingWhatsAppButton />
        <CookieConsentBanner />
        <Analytics />
      </body>
    </html>
  );
}
