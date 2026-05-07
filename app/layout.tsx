import type { Metadata, Viewport } from "next";
// @ts-ignore
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#111111",
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
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
