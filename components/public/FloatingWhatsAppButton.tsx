"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

const WHATSAPP_DEMO_URL =
  "https://wa.me/34645466308?text=Hola%2C%20quiero%20ver%20una%20demo%20de%20Barber%C3%ADaOS";

const HIDDEN_PREFIXES = [
  "/admin",
  "/dashboard",
  "/login",
  "/onboarding",
  "/forgot-password",
  "/reset-password",
  "/r/",
  "/review/",
];

export function FloatingWhatsAppButton() {
  const pathname = usePathname();

  if (HIDDEN_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <a
      href={WHATSAPP_DEMO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Solicitar demo por WhatsApp"
      className="fixed bottom-4 right-4 z-50 inline-flex min-h-12 items-center gap-2 rounded-full border border-emerald-300/50 bg-emerald-500 px-4 py-3 text-sm font-black text-white shadow-[0_18px_45px_rgba(16,185,129,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-[0_22px_55px_rgba(16,185,129,0.34)] focus:outline-none focus:ring-4 focus:ring-emerald-300/40 dark:border-emerald-400/30 dark:bg-emerald-500 dark:text-white sm:bottom-5 sm:right-5 sm:px-5"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
        <MessageCircle size={17} />
      </span>
      <span className="leading-none">Solicitar demo</span>
    </a>
  );
}
