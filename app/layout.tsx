import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { FloatingWhatsAppButton } from "@/components/landing/FloatingWhatsAppButton";
import { CookieConsentBanner } from "@/components/legal/CookieConsentBanner";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";
// @ts-ignore
import "./globals.css";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS_CONFIG.siteUrl),
  title: "BarberíaOS | Software para barberías con reservas, caja y QR sin comisión",
  description:
    "Controla reservas, caja, clientes, barberos y huecos libres desde un solo panel. Agenda online, QR propio y cero comisiones por reserva.",
  alternates: {
    canonical: BUSINESS_CONFIG.siteUrl,
  },
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
    title: "BarberíaOS | Software para barberías con reservas, caja y QR sin comisión",
    description:
      "Reservas, agenda, caja, clientes, barberos, huecos libres, QR y marketing en un solo panel para barberías.",
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
    title: "BarberíaOS | Reservas, caja y QR para barberías",
    description:
      "Controla reservas, caja, clientes, barberos y huecos libres desde un solo panel.",
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
    <html lang="es" className={cn("font-sans", inter.variable, GeistSans.variable, GeistMono.variable)}>
      <body className="font-sans antialiased">
        {children}
        <FloatingWhatsAppButton />
        <CookieConsentBanner />
        <AnalyticsScripts />
        <Analytics />
      </body>
    </html>
  );
}
