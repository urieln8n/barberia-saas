import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BarberíaOS — Reservas y marketing para barberías",
  description: "Sistema de reservas con QR, dashboard y marketing local para barberías."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
