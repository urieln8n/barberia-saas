"use client";

import { useEffect, useState } from "react";
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
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  if (!pathname) {
    return null;
  }

  if (HIDDEN_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Solicitar demo por WhatsApp"
      className="fixed bottom-6 right-4 z-50 inline-flex min-h-12 items-center gap-2 rounded-full border border-[#D5A84C]/35 bg-[#0D0F14] px-4 py-3 text-sm font-black text-[#D5A84C] shadow-[0_18px_45px_rgba(201,146,42,0.18)] transition hover:-translate-y-0.5 hover:bg-[#D5A84C]/10 focus:outline-none focus:ring-2 focus:ring-[#D5A84C]/50 focus:ring-offset-2 sm:bottom-6 sm:right-6 sm:px-5"
    >
      <MessageCircle size={18} className="shrink-0" />
      <span>Solicitar demo</span>
    </a>
  );
}
