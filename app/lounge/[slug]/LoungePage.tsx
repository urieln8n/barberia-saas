"use client";

import Link from "next/link";
import {
  CalendarCheck,
  MessageCircle,
  Scissors,
  Share2,
  Sparkles,
  Star,
  Tag,
  Zap,
} from "lucide-react";

type Service = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
};

type Props = {
  barbershopName: string;
  barbershopSlug: string;
  bookingUrl: string;
  whatsappUrl: string | null;
  googleReviewUrl: string | null;
  services: Service[];
  loungeUrl: string;
};

// Mock upgrade services for upsell section
const UPGRADE_SERVICES = [
  { name: "Arreglo de barba", price: 8, icon: "✂️" },
  { name: "Diseño de cejas", price: 5, icon: "✨" },
  { name: "Lavado premium", price: 6, icon: "💧" },
  { name: "Tratamiento facial", price: 12, icon: "🌿" },
  { name: "Mascarilla hidratante", price: 10, icon: "💆" },
];

export function LoungePage({
  barbershopName,
  bookingUrl,
  whatsappUrl,
  googleReviewUrl,
  services,
  loungeUrl,
}: Props) {

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: `${barbershopName} — BarberíaOS Lounge`,
          text: `Te recomiendo ${barbershopName}. Puedes reservar y ver sus servicios aquí:`,
          url: loungeUrl,
        })
        .catch(() => {
          // User cancelled share
        });
    } else {
      // Fallback: copy to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(loungeUrl).catch(() => {});
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F8F6] pb-24">
      {/* ── Header ── */}
      <header
        className="border-b border-[#D5A84C]/20 px-4 py-4 text-center"
        style={{
          background:
            "linear-gradient(135deg, #0F2040 0%, #1A3A6B 60%, #0B1A2E 100%)",
        }}
      >
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#D4AF66]/40 bg-[#D4AF66]/15">
            <Scissors size={16} className="text-[#D4AF66]" />
          </div>
          <div className="text-left">
            <p className="font-black text-white leading-none">{barbershopName}</p>
            <p className="text-[11px] font-semibold text-[#D4AF66]/70">BarberíaOS Lounge</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 space-y-6 py-6">

        {/* ── Hero ── */}
        <section className="rounded-[24px] border border-[#D5A84C]/20 bg-white p-6 text-center shadow-sm">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-[#D5A84C]/25 bg-[#FDF8EE]">
              <Sparkles size={24} className="text-[#C9922A]" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-[#080A0F]">
            Mientras esperas, descubre más
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#080A0F]/60">
            Reserva tu próxima cita, explora servicios premium y deja tu reseña en Google.
            Todo desde tu móvil, sin descargar nada.
          </p>
          <a
            href={bookingUrl}
            className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#080A0F] px-6 py-3 text-sm font-black text-white shadow-sm transition-colors hover:bg-[#1a1a1a] active:scale-[0.98]"
          >
            <CalendarCheck size={16} />
            Reservar próxima cita
          </a>
        </section>

        {/* ── Servicios de la barbería ── */}
        {services.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Scissors size={15} className="text-[#C9922A]" />
              <p className="text-xs font-black uppercase tracking-wide text-[#080A0F]/60">
                Servicios disponibles
              </p>
            </div>
            <div className="grid gap-2">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
                >
                  <div>
                    <p className="text-sm font-black text-[#080A0F]">{service.name}</p>
                    <p className="text-xs text-[#080A0F]/50">
                      {service.duration_minutes} min
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-black text-[#C9922A]">
                      {service.price}€
                    </p>
                    <a
                      href={`${bookingUrl}?service=${service.id}`}
                      className="rounded-xl border border-[#D5A84C]/30 bg-[#FDF8EE] px-3 py-1.5 text-xs font-black text-[#8A641F] transition-colors hover:bg-[#D5A84C]/20"
                    >
                      Reservar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Upgrades premium ── */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Zap size={15} className="text-[#C9922A]" />
            <p className="text-xs font-black uppercase tracking-wide text-[#080A0F]/60">
              Mejora tu experiencia
            </p>
          </div>
          <div className="grid gap-2">
            {UPGRADE_SERVICES.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#D5A84C]/15 bg-[#FDF8EE] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{service.icon}</span>
                  <div>
                    <p className="text-sm font-black text-[#080A0F]">{service.name}</p>
                    <p className="text-xs text-[#080A0F]/50">Añádelo a tu cita de hoy</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-[#C9922A]">{service.price}€</span>
                  <button
                    type="button"
                    className="rounded-xl border border-[#D5A84C]/30 bg-white px-3 py-1.5 text-xs font-black text-[#8A641F]"
                    onClick={() => {
                      // Register interest — no real data collection
                    }}
                  >
                    Me interesa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Promociones (empty state) ── */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Tag size={15} className="text-[#C9922A]" />
            <p className="text-xs font-black uppercase tracking-wide text-[#080A0F]/60">
              Promociones activas
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-[20px] border border-dashed border-slate-200 bg-white px-6 py-8 text-center">
            <Tag size={20} className="text-slate-300" />
            <p className="text-sm font-bold text-slate-500">Sin promociones activas</p>
            <p className="text-xs text-slate-400">Vuelve pronto — el equipo actualiza las ofertas regularmente.</p>
          </div>
        </section>

        {/* ── Acciones principales ── */}
        <section className="space-y-3">
          {/* Reseña Google */}
          {googleReviewUrl ? (
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-14 items-center gap-4 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 transition-colors hover:bg-yellow-100 active:scale-[0.98]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                <Star size={18} className="text-yellow-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black text-[#080A0F]">Dejar reseña en Google</p>
                <p className="text-xs text-[#080A0F]/60">Tu opinión ayuda a {barbershopName}</p>
              </div>
            </a>
          ) : (
            <div className="flex min-h-14 items-center gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-3 opacity-50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
                <Star size={18} className="text-slate-300" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-400">Reseña en Google</p>
                <p className="text-xs text-slate-300">Próximamente disponible</p>
              </div>
            </div>
          )}

          {/* WhatsApp */}
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-14 items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 transition-colors hover:bg-emerald-100 active:scale-[0.98]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                <MessageCircle size={18} className="text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black text-[#080A0F]">Hablar con la barbería</p>
                <p className="text-xs text-[#080A0F]/60">Abre WhatsApp directamente</p>
              </div>
            </a>
          ) : null}

          {/* Compartir */}
          <button
            type="button"
            onClick={() => {
              if (typeof navigator !== "undefined" && navigator.share) {
                navigator.share({
                  title: `${barbershopName} — BarberíaOS Lounge`,
                  text: `Te recomiendo ${barbershopName}. Puedes reservar aquí:`,
                  url: bookingUrl,
                }).catch(() => {});
              }
            }}
            className="flex w-full min-h-14 items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:bg-slate-50 active:scale-[0.98]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
              <Share2 size={18} className="text-slate-500" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="font-black text-[#080A0F]">Recomendar a un amigo</p>
              <p className="text-xs text-[#080A0F]/60">Comparte {barbershopName} con alguien</p>
            </div>
          </button>

          {/* Reservar CTA final */}
          <a
            href={bookingUrl}
            className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#D5A84C] px-6 py-4 text-sm font-black text-[#080A0F] shadow-md transition-colors hover:bg-[#c49a3d] active:scale-[0.98]"
          >
            <CalendarCheck size={16} />
            Reservar próxima cita
          </a>
        </section>

        {/* ── Footer ── */}
        <footer className="py-4 text-center">
          <p className="text-xs font-semibold text-[#080A0F]/30">
            Powered by{" "}
            <a
              href="/"
              className="font-black text-[#080A0F]/50 hover:text-[#C9922A] transition-colors"
            >
              BarberíaOS
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
