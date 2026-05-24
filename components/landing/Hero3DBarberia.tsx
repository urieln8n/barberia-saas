"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, CalendarCheck2, QrCode, Scissors } from "lucide-react";

// ── 3D Canvas — loaded only on desktop, no SSR ─────────────────────────────
const BarberChair3D = dynamic(() => import("./BarberChair3D"), {
  ssr: false,
  loading: () => <HeroVisualFallback />,
});

// ── Mobile / SSR fallback ──────────────────────────────────────────────────
function HeroVisualFallback() {
  return (
    <div className="relative flex h-[340px] w-full items-center justify-center md:h-[480px]">
      {/* Decorative rings */}
      <div className="absolute h-72 w-72 rounded-full border border-[#D5A84C]/10 animate-[spin_18s_linear_infinite]" />
      <div className="absolute h-52 w-52 rounded-full border border-[#D5A84C]/15 animate-[spin_12s_linear_infinite_reverse]" />
      <div className="absolute h-36 w-36 rounded-full border border-[#D5A84C]/20 animate-[spin_8s_linear_infinite]" />

      {/* Center icon */}
      <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#D5A84C]/10 ring-2 ring-[#D5A84C]/30 shadow-[0_0_48px_rgba(213,168,76,0.18)]">
        <Scissors size={40} className="text-[#D5A84C] rotate-45" style={{ animation: "none" }} />
      </div>

      {/* Floating badges */}
      <div className="absolute left-4 top-10 rounded-2xl border border-[#D5A84C]/25 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm">
        <p className="text-[11px] font-black text-[#D5A84C]">24/7</p>
        <p className="text-[10px] text-[#080A0F]/55">Reservas</p>
      </div>
      <div className="absolute right-4 bottom-12 rounded-2xl border border-[#080A0F]/10 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm">
        <p className="text-[11px] font-black text-[#080A0F]">0%</p>
        <p className="text-[10px] text-[#080A0F]/55">Comisión</p>
      </div>
      <div className="absolute right-8 top-8 rounded-2xl border border-[#080A0F]/10 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm">
        <QrCode size={14} className="text-[#D5A84C]" />
        <p className="mt-1 text-[10px] text-[#080A0F]/55">QR listo</p>
      </div>
    </div>
  );
}

// ── Main hero component ────────────────────────────────────────────────────
export function Hero3DBarberia() {
  const prefersReducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth > 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = prefersReducedMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F8F8F6] px-5 pb-16 pt-14 text-[#080A0F] md:pb-24 md:pt-20 lg:px-8"
      aria-label="Hero BarberíaOS"
    >
      {/* Subtle warm gradient top */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] opacity-40"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% -10%, rgba(213,168,76,0.12) 0%, transparent 70%)",
        }}
      />
      {/* Noise texture overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        {/* ── Left column: copy ─────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-xl"
        >
          {/* Eyebrow pill */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D5A84C]/30 bg-[#D5A84C]/8 px-3 py-1.5 text-xs font-black text-[#B8892A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D5A84C] animate-pulse" />
              SaaS para barberías · Activa en 24h
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="mt-5 text-[2.6rem] font-black leading-[1.0] tracking-[-0.025em] text-[#080A0F] sm:text-5xl md:text-6xl lg:text-[3.8rem]"
          >
            Reservas, caja y control de barberos{" "}
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, #D5A84C 0%, #E8C46A 50%, #B8892A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              en un solo panel.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mt-5 max-w-lg text-[1.05rem] leading-[1.75] text-[#080A0F]/58"
          >
            Activa tu barbería online en 24 horas con reservas por QR, agenda
            visual, clientes, caja y seguimiento inteligente.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="/pedir-demo"
              className="group inline-flex items-center gap-2 rounded-2xl bg-[#080A0F] px-6 py-3.5 text-sm font-black text-white shadow-[0_4px_20px_rgba(8,10,15,0.18)] transition-all duration-200 hover:bg-[#1a1d26] hover:shadow-[0_6px_28px_rgba(8,10,15,0.28)] active:scale-[0.98]"
              style={{ willChange: "transform, box-shadow" }}
            >
              Solicitar demo
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="#funciona"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#080A0F]/12 bg-white px-6 py-3.5 text-sm font-black text-[#080A0F]/80 shadow-sm transition-all duration-200 hover:border-[#D5A84C]/40 hover:bg-[#D5A84C]/5 hover:text-[#080A0F] active:scale-[0.98]"
              style={{ willChange: "transform, background" }}
            >
              <CalendarCheck2 size={15} className="text-[#D5A84C]" />
              Ver cómo funciona
            </a>
          </motion.div>

          {/* Social proof stats */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#080A0F]/8 pt-6"
          >
            {(
              [
                ["24/7", "Reservas abiertas"],
                ["0%", "Comisión por cita"],
                ["48h", "Para empezar"],
              ] as const
            ).map(([num, label]) => (
              <div key={label} className="flex items-baseline gap-1.5">
                <span
                  className={`text-2xl font-black ${
                    num === "0%"
                      ? "text-[#D5A84C]"
                      : "text-[#080A0F]"
                  }`}
                >
                  {num}
                </span>
                <span className="text-sm text-[#080A0F]/60">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* Trust pills */}
          <motion.div
            variants={itemVariants}
            className="mt-5 flex flex-wrap gap-2"
          >
            {["Sin comisiones", "Activación guiada", "Kit QR incluido"].map(
              (pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center rounded-full border border-[#080A0F]/10 bg-white px-3 py-1 text-xs font-bold text-[#080A0F]/55"
                >
                  {pill}
                </span>
              )
            )}
          </motion.div>
        </motion.div>

        {/* ── Right column: 3D visual ────────────────────────────────────── */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={prefersReducedMotion ? false : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
          style={{ willChange: "transform, opacity" }}
        >
          {isDesktop ? <BarberChair3D /> : <HeroVisualFallback />}
        </motion.div>
      </div>
    </section>
  );
}
