"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/34645466308?text=Hola%2C%20quiero%20ver%20una%20demo%20de%20Barber%C3%ADaOS";

const HIDDEN_PATH_PREFIXES = [
  "/admin",
  "/auth",
  "/dashboard",
  "/forgot-password",
  "/login",
  "/onboarding",
  "/r/",
  "/reset-password",
  "/review",
];

export function FloatingWhatsAppButton() {
  const pathname = usePathname();

  if (HIDDEN_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Solicitar demo por WhatsApp"
      className="fixed bottom-4 right-4 z-50 inline-flex min-h-12 items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500 px-4 py-3 text-sm font-black text-white shadow-[0_18px_45px_rgba(16,185,129,0.28)] transition hover:-translate-y-0.5 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:bottom-5 sm:right-5 sm:px-5"
    >
      <MessageCircle size={18} className="shrink-0" />
      <span>Solicitar demo</span>
    </a>
  );
}
