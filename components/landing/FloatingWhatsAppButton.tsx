"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

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
      className="
        md:hidden
        fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50
        inline-flex items-center gap-2.5
        rounded-2xl
        border border-[#D4AF37]/30
        bg-[#0A0C10]/95 backdrop-blur-sm
        px-4 py-3
        shadow-[0_8px_32px_rgba(212,175,55,0.20),0_2px_8px_rgba(0,0,0,0.60)]
        transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D4AF37]/55 hover:shadow-[0_12px_40px_rgba(212,175,55,0.28)]
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:ring-offset-2
      "
    >
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/12">
        <span className="absolute inset-0 rounded-xl bg-[#D4AF37]/25 motion-safe:animate-ping" style={{ animationDuration: "2.4s" }} aria-hidden="true" />
        <MessageCircle size={17} className="relative text-[#D4AF37]" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[13px] font-black text-[#D4AF37]">Solicitar demo</span>
        <span className="text-[10px] font-medium text-white/45">Te respondemos por WhatsApp</span>
      </div>
    </a>
  );
}
