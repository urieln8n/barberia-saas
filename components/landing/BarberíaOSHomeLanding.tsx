"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";
import {
  CalendarCheck, QrCode, Wallet, Users, Clapperboard,
  Clock, ArrowRight, Check, ShieldCheck,
  ChevronRight, BarChart3, Scissors, X, Menu,
  MessageCircle, CheckCircle2, XCircle, Zap, Instagram,
} from "lucide-react";

const FAQAccordionLanding = dynamic(() => import("./FAQAccordionLanding"), { ssr: false });

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-[#09090B]/96 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.05)]"
          : ""
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.35)]">
            <Scissors size={15} className="text-[#09090B]" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-black tracking-tight text-white">BarberíaOS</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {[
            ["Funciones", "#funciones"],
            ["Precios", "#precios"],
            ["Demo", BUSINESS_CONFIG.demoUrl],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-[13px] font-semibold text-white/50 transition hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={BUSINESS_CONFIG.loginUrl}
            className="text-[13px] font-semibold text-white/42 transition hover:text-white"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#D4AF37] px-4 text-[13px] font-black text-[#09090B] transition hover:bg-[#E8C84A] active:scale-[0.97]"
          >
            Empezar gratis <ChevronRight size={12} strokeWidth={3} />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X size={15} /> : <Menu size={15} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-white/[0.06] bg-[#09090B]/98 px-4 pb-5 md:hidden">
          <nav className="flex flex-col pt-2">
            {[
              ["Funciones", "#funciones"],
              ["Precios", "#precios"],
              ["Ver demo", BUSINESS_CONFIG.demoUrl],
              ["Entrar", BUSINESS_CONFIG.loginUrl],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3.5 text-[15px] font-semibold text-white/55 transition hover:bg-white/5 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href="/register"
            className="mt-3 flex h-12 items-center justify-center rounded-2xl bg-[#D4AF37] text-[15px] font-black text-[#09090B]"
          >
            Empezar gratis — 14 días
          </Link>
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#09090B] pb-20 pt-28">
      {/* 1. Dot grid gold */}
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{ backgroundImage: "radial-gradient(circle, rgba(212,175,55,0.07) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      {/* 2. Beam de luz dorado desde arriba */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2"
        style={{ background: "radial-gradient(ellipse 55% 90% at 50% 0%, rgba(212,175,55,0.18) 0%, transparent 100%)" }}
      />
      {/* 3. Orbs: gold principal */}
      <div className="pointer-events-none absolute left-1/2 top-[-8%] h-[650px] w-[850px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.09] blur-[130px]" />
      {/* Orb violet izquierda */}
      <div className="pointer-events-none absolute left-[-6%] top-[38%] h-[420px] w-[420px] rounded-full bg-[#7C3AED]/[0.13] blur-[110px]" />
      {/* Orb gold derecha */}
      <div className="pointer-events-none absolute right-[-4%] top-[28%] h-[360px] w-[360px] rounded-full bg-[#D4AF37]/[0.07] blur-[90px]" />
      {/* Orb violet bottom */}
      <div className="pointer-events-none absolute bottom-[8%] left-[12%] h-[280px] w-[280px] rounded-full bg-[#6D28D9]/[0.09] blur-[100px]" />

      <div className="relative mx-auto max-w-5xl px-4 md:px-6">
        {/* Badge */}
        <div className="flex justify-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/22 bg-[#D4AF37]/[0.07] px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.1em] text-[#D4AF37]">
            <Zap size={9} fill="currentColor" />
            Sin comisiones · Sin Booksy · Sin papel
          </div>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-3xl text-center text-[2.6rem] font-black leading-[1.06] tracking-tight text-white md:text-6xl lg:text-[4.25rem]">
          La agenda de tu barbería.{" "}
          <span className="bg-gradient-to-r from-[#D4AF37] via-[#F5D060] to-[#C8991F] bg-clip-text text-transparent">Siempre llena.</span>
          <br className="hidden sm:block" />
          <span className="text-white/55">Sin perder un euro.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-center text-[1rem] leading-relaxed text-white/48 md:text-lg">
          Reservas online desde Instagram, WhatsApp y QR.
          Agenda, caja y clientes en un panel.{" "}
          <span className="font-semibold text-white/68">Cuota fija. Cero comisiones.</span>
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex h-[52px] items-center gap-2.5 rounded-2xl bg-[#D4AF37] px-8 text-[15px] font-black text-[#09090B] shadow-[0_8px_36px_rgba(212,175,55,0.38)] transition hover:bg-[#E8C84A] hover:shadow-[0_12px_48px_rgba(212,175,55,0.48)] active:scale-[0.98]"
          >
            Empezar gratis — 14 días <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
          <Link
            href={BUSINESS_CONFIG.demoUrl}
            className="inline-flex h-[52px] items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-8 text-[15px] font-semibold text-white transition hover:border-white/22 hover:bg-white/[0.07]"
          >
            Ver demo en vivo
          </Link>
        </div>
        <p className="mt-3.5 text-center text-[11.5px] text-white/25">
          Sin tarjeta · Sin permanencia · Activo en 30 minutos
        </p>

        {/* Dashboard mockup */}
        <div className="mt-14 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0F0F11] shadow-[0_40px_100px_rgba(0,0,0,0.65)]">
          {/* Window chrome */}
          <div className="flex items-center gap-2.5 border-b border-white/[0.06] bg-[#111113] px-5 py-3.5">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <div className="h-3 w-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="mx-auto flex h-6 items-center gap-1.5 rounded-lg bg-white/[0.05] px-4 text-[11px] text-white/25">
              <ShieldCheck size={10} className="text-emerald-400" />
              barberiaos.com/dashboard
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
            {[
              { label: "Caja del día", value: "487 €", icon: Wallet, color: "text-emerald-400", bg: "bg-emerald-400/10", sub: "+12% vs ayer" },
              { label: "Reservas hoy", value: "12 / 14", icon: CalendarCheck, color: "text-blue-400", bg: "bg-blue-400/10", sub: "2 huecos libres" },
              { label: "Clientes activos", value: "847", icon: Users, color: "text-amber-400", bg: "bg-amber-400/10", sub: "+8 este mes" },
              { label: "Comisión Booksy", value: "0 €", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-400/10", sub: "Ahorro total" },
            ].map(({ label, value, icon: Icon, color, bg, sub }) => (
              <div key={label} className="rounded-xl border border-white/[0.05] bg-white/[0.025] p-4">
                <div className={`mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
                  <Icon size={14} className={color} />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/28">{label}</p>
                <p className="mt-0.5 text-xl font-black tabular-nums text-white">{value}</p>
                <p className="mt-0.5 text-[10px] text-white/22">{sub}</p>
              </div>
            ))}
          </div>

          {/* Agenda preview */}
          <div className="border-t border-white/[0.05] p-5 pt-0">
            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-black uppercase tracking-wide text-white/38">
                  Agenda — Hoy, miércoles
                </p>
                <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  En directo
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  { time: "10:00", name: "Carlos M.", service: "Corte + barba", barber: "Dani", dot: "bg-emerald-400", dim: false },
                  { time: "10:30", name: "Javier R.", service: "Corte fade", barber: "Marco", dot: "bg-blue-400", dim: false },
                  { time: "11:00", name: "—", service: "Hueco libre", barber: "Dani", dot: "bg-white/12", dim: true },
                  { time: "11:30", name: "David L.", service: "Barba premium", barber: "Marco", dot: "bg-amber-400", dim: false },
                ].map(({ time, name, service, barber, dot, dim }) => (
                  <div key={time} className="flex items-center gap-3">
                    <span className="w-10 shrink-0 text-[11px] font-bold tabular-nums text-white/28">{time}</span>
                    <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
                    <span className={`flex-1 text-[12px] font-semibold ${dim ? "italic text-white/20" : "text-white/65"}`}>{name}</span>
                    <span className="hidden text-[11px] text-white/28 sm:block">{service}</span>
                    <span className="shrink-0 rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] text-white/22">{barber}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Channel Bar ──────────────────────────────────────────────────────────────

function ChannelBar() {
  const channels = [
    { icon: Instagram, label: "Instagram Bio" },
    { icon: MessageCircle, label: "WhatsApp" },
    { icon: QrCode, label: "QR en puerta" },
    { icon: Zap, label: "Google Business" },
    { icon: ArrowRight, label: "Link directo" },
  ];
  return (
    <section className="border-y border-white/[0.05] bg-[#0A0A0C] py-5">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/22 md:mr-2">
            Reservas desde
          </span>
          {channels.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-[12px] font-semibold text-white/40 transition hover:border-[#D4AF37]/22 hover:text-white/65"
            >
              <Icon size={11} className="text-[#D4AF37]/60" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pain Section (ROI vs Booksy) ─────────────────────────────────────────────

function PainSection() {
  const scenarios = [
    { bookings: 100, label: "Barbería pequeña" },
    { bookings: 200, label: "Barbería media" },
    { bookings: 350, label: "Barbería activa" },
  ];
  const COMMISSION = 1.5;
  const BARBERIAOS = 79;

  return (
    <section className="bg-[#0D0D0F] py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#D4AF37]">
            El coste oculto
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
            ¿Cuánto te está costando Booksy?
          </h2>
          <p className="mt-3 text-white/42">
            Cada reserva tiene un precio. El tuyo, no el del cliente.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {scenarios.map(({ bookings, label }) => {
            const booksyCost = bookings * COMMISSION;
            const saving = booksyCost - BARBERIAOS;
            return (
              <div
                key={bookings}
                className="rounded-2xl border border-white/[0.07] bg-[#111111] p-6"
              >
                <p className="text-[11px] font-bold uppercase tracking-wide text-white/35">
                  {label} · {bookings} reservas/mes
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-red-500/15 bg-red-500/[0.06] p-3">
                    <p className="text-[10px] font-semibold text-white/35">Booksy</p>
                    <p className="mt-1 text-2xl font-black text-red-400">
                      {booksyCost.toFixed(0)} €
                    </p>
                    <p className="text-[10px] text-white/25">al mes</p>
                  </div>
                  <div className="rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07] p-3">
                    <p className="text-[10px] font-semibold text-white/35">BarberíaOS</p>
                    <p className="mt-1 text-2xl font-black text-[#D4AF37]">79 €</p>
                    <p className="text-[10px] text-white/25">cuota fija</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] px-4 py-3 text-center">
                  <p className="text-[13px] font-black text-emerald-400">
                    Ahorras {saving.toFixed(0)} €/mes
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/30">
                    {(saving * 12).toFixed(0)} € al año
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-5 text-center text-[11px] text-white/22">
          * Estimación basada en comisiones medias de plataformas de reservas. Los precios varían según plan.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/calculadora-booksy"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#D4AF37] transition hover:text-[#E8C84A]"
          >
            Calcular mi ahorro exacto <ArrowRight size={13} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Features bento ───────────────────────────────────────────────────────────

function Features() {
  const features = [
    {
      icon: CalendarCheck,
      title: "Reservas sin app ni registro",
      desc: "Los clientes reservan desde tu link, QR, Instagram Bio o Google Business. Sin descargas. En 90 segundos.",
      accent: "text-blue-400",
      bg: "bg-blue-400/8",
      border: "border-blue-400/15",
      span: "col-span-1",
    },
    {
      icon: QrCode,
      title: "QR propio e imprimible",
      desc: "Un QR único para tu barbería. En la puerta, el mostrador, tarjetas o Instagram — los clientes escanean y reservan.",
      accent: "text-[#D4AF37]",
      bg: "bg-[#D4AF37]/8",
      border: "border-[#D4AF37]/15",
      span: "col-span-1",
    },
    {
      icon: Wallet,
      title: "Caja digital diaria",
      desc: "Cobros, propinas, descuentos, corte de caja y movimientos. Sin hardware. Sin TPV externo.",
      accent: "text-emerald-400",
      bg: "bg-emerald-400/8",
      border: "border-emerald-400/15",
      span: "col-span-1",
    },
    {
      icon: Clapperboard,
      title: "Studio IA — Llena los huecos libres",
      desc: "Genera reels y posts para Instagram con IA en 2 minutos. Anuncia huecos libres antes de que se pierdan. Convierte cancelaciones en reservas nuevas.",
      accent: "text-violet-400",
      bg: "bg-violet-400/8",
      border: "border-violet-400/15",
      span: "sm:col-span-2 md:col-span-2",
      tag: "Plan Growth · Elite",
    },
    {
      icon: Users,
      title: "CRM de clientes",
      desc: "Historial completo, notas, fidelización y reactivación de clientes inactivos.",
      accent: "text-rose-400",
      bg: "bg-rose-400/8",
      border: "border-rose-400/15",
      span: "col-span-1",
    },
    {
      icon: BarChart3,
      title: "Estadísticas en tiempo real",
      desc: "Caja del día, rendimiento por barbero, ingresos del mes y clientes que no vuelven.",
      accent: "text-cyan-400",
      bg: "bg-cyan-400/8",
      border: "border-cyan-400/15",
      span: "col-span-1",
    },
    {
      icon: Instagram,
      title: "Página de reservas pública",
      desc: "Tu URL propia. Ponla en Instagram, WhatsApp o Google. Tu marca, no la de Booksy.",
      accent: "text-pink-400",
      bg: "bg-pink-400/8",
      border: "border-pink-400/15",
      span: "col-span-1",
    },
  ];

  return (
    <section id="funciones" className="bg-[#09090B] py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#D4AF37]">
            Funciones
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white">
            Todo lo que necesita tu barbería
          </h2>
          <p className="mt-3 text-white/42">En un panel. Sin integraciones. Sin complicaciones.</p>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {features.map(({ icon: Icon, title, desc, accent, bg, border, span, tag }) => (
            <div
              key={title}
              className={`group relative overflow-hidden rounded-2xl border ${border} bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] ${span}`}
            >
              {tag && (
                <span className="absolute right-4 top-4 rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-0.5 text-[10px] font-black text-violet-400">
                  {tag}
                </span>
              )}
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                <Icon size={18} className={accent} />
              </div>
              <h3 className="text-[15px] font-black leading-snug text-white">{title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/40">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Comparison table ─────────────────────────────────────────────────────────

function ComparisonSection() {
  const rows: { feature: string; barberiaos: boolean | "parcial"; booksy: boolean | "parcial"; papel: boolean }[] = [
    { feature: "Reservas online", barberiaos: true, booksy: true, papel: false },
    { feature: "Sin comisión por reserva", barberiaos: true, booksy: false, papel: true },
    { feature: "Tu marca, tu URL propia", barberiaos: true, booksy: false, papel: false },
    { feature: "Tus datos, tus clientes", barberiaos: true, booksy: false, papel: false },
    { feature: "QR propio e imprimible", barberiaos: true, booksy: false, papel: false },
    { feature: "Caja digital", barberiaos: true, booksy: false, papel: false },
    { feature: "Studio IA para Instagram", barberiaos: true, booksy: false, papel: false },
    { feature: "Sin app para el cliente", barberiaos: true, booksy: false, papel: true },
    { feature: "Agenda + barberos + CRM", barberiaos: true, booksy: "parcial", papel: false },
  ];

  return (
    <section className="bg-[#0D0D0F] py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#D4AF37]">
            Comparativa
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white">
            BarberíaOS vs el resto
          </h2>
          <p className="mt-3 text-white/42">
            Sin comisiones. Sin marketplaces. Sin depender de nadie.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/[0.07]">
          {/* Header */}
          <div className="grid grid-cols-4 border-b border-white/[0.07] bg-[#111111] px-5 py-4">
            <div />
            <div className="text-center">
              <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-[#D4AF37]">
                <Scissors size={12} className="text-[#09090B]" strokeWidth={2.5} />
              </div>
              <p className="mt-1 text-[11px] font-black text-white">BarberíaOS</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-white/8">
                <span className="text-[11px] font-black text-white/38">B</span>
              </div>
              <p className="mt-1 text-[11px] font-semibold text-white/32">Booksy</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-white/5">
                <span className="text-[13px]">📋</span>
              </div>
              <p className="mt-1 text-[11px] font-semibold text-white/32">Papel / WA</p>
            </div>
          </div>

          {/* Rows */}
          {rows.map(({ feature, barberiaos, booksy, papel }, i) => (
            <div
              key={feature}
              className={`grid grid-cols-4 border-b border-white/[0.04] px-5 py-3.5 last:border-0 ${
                i % 2 === 0 ? "bg-[#111111]" : "bg-[#0D0D0F]"
              }`}
            >
              <div className="flex items-center">
                <span className="text-[13px] font-medium text-white/52">{feature}</span>
              </div>
              {[barberiaos, booksy, papel].map((val, j) => (
                <div key={j} className="flex items-center justify-center">
                  {val === true && <CheckCircle2 size={16} className="text-emerald-400" />}
                  {val === false && <XCircle size={16} className="text-white/14" />}
                  {val === "parcial" && (
                    <span className="text-[10px] font-bold text-amber-400">Parcial</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/register"
            className="inline-flex h-11 items-center gap-2.5 rounded-xl bg-[#D4AF37] px-7 text-[13px] font-black text-[#09090B] transition hover:bg-[#E8C84A] active:scale-[0.97]"
          >
            Empezar gratis — 14 días sin tarjeta <ArrowRight size={13} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar() {
  const stats = [
    { value: "0 €", label: "Comisiones por reserva" },
    { value: "30 min", label: "Para activar tu barbería" },
    { value: "+47", label: "Barberías activas" },
    { value: "4.9 ★", label: "Valoración media clientes" },
  ];
  return (
    <section className="relative overflow-hidden bg-[#09090B] py-14">
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{ backgroundImage: "radial-gradient(circle, rgba(212,175,55,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />
      <div className="relative mx-auto max-w-5xl px-4 md:px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] md:grid-cols-4">
          {stats.map(({ value, label }, i) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center bg-[#0D0D0F] px-6 py-8 text-center"
            >
              <span
                className="text-4xl font-black leading-none tracking-tight md:text-5xl"
                style={{ background: "linear-gradient(135deg, #F5D060 0%, #D4AF37 50%, #B8860B 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
              >
                {value}
              </span>
              <span className="mt-2 text-[12px] font-medium text-white/35">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: Zap,
      title: "Crea tu cuenta en 2 minutos",
      desc: "Sin tarjeta. Sin configuración técnica. Solo nombre, barbería y listo. Te acompañamos en cada paso.",
    },
    {
      n: "02",
      icon: Scissors,
      title: "Añade barberos y servicios",
      desc: "Configura tu equipo, horarios, precios y personaliza tu página pública de reservas en menos de 30 minutos.",
    },
    {
      n: "03",
      icon: CalendarCheck,
      title: "Comparte y recibe reservas",
      desc: "Pega tu QR en la puerta. Añade el link a Instagram. Los clientes reservan solos. Tú gestionas todo desde el panel.",
    },
  ];

  return (
    <section className="bg-[#09090B] py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#D4AF37]">
            Cómo funciona
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white">
            Activo en 30 minutos
          </h2>
          <p className="mt-3 text-white/42">Tres pasos. Sin técnicos. Sin manuales.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {steps.map(({ n, icon: Icon, title, desc }) => (
            <div
              key={n}
              className="relative rounded-2xl border border-white/[0.07] bg-[#111111] p-7"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 ring-1 ring-[#D4AF37]/18">
                  <Icon size={16} className="text-[#D4AF37]" />
                </div>
                <span className="text-4xl font-black tabular-nums text-[#D4AF37]/18">{n}</span>
              </div>
              <h3 className="text-[16px] font-black leading-snug text-white">{title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/40">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Trust bar ────────────────────────────────────────────────────────────────

function TrustBar() {
  return (
    <section className="bg-[#0D0D0F] py-12">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { icon: ShieldCheck, label: "Sin comisiones", desc: "Cuota fija mensual" },
            { icon: Clock, label: "Activo en 30 min", desc: "Onboarding guiado" },
            { icon: QrCode, label: "QR propio", desc: "Imprimible desde el panel" },
            { icon: MessageCircle, label: "Soporte real", desc: "Por WhatsApp, no por bot" },
          ].map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-[#111111] p-5 text-center"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                <Icon size={15} className="text-[#D4AF37]" />
              </div>
              <p className="text-[13px] font-black text-white">{label}</p>
              <p className="text-[11px] text-white/30">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "39",
      anchor: "vs ~150 €/mes en comisiones",
      desc: "Para barberías que empiezan a digitalizar",
      features: [
        "Reservas online sin app",
        "QR propio e imprimible",
        "Hasta 2 barberos",
        "Gestión de caja básica",
        "Página pública de reservas",
        "Notificaciones al cliente",
        "Soporte por WhatsApp",
      ],
      cta: "Empezar gratis 14 días",
      href: "/register?plan=starter",
      highlight: false,
    },
    {
      name: "Growth",
      price: "79",
      anchor: "vs ~300 €/mes en comisiones",
      desc: "El más popular — todo lo que necesitas",
      features: [
        "Todo en Starter",
        "Hasta 5 barberos",
        "CRM de clientes completo",
        "Estadísticas avanzadas",
        "Studio IA (20 créditos/mes)",
        "Clientes dormidos y reactivación",
        "Soporte prioritario por WhatsApp",
      ],
      cta: "Empezar con Growth",
      href: "/register?plan=growth",
      highlight: true,
      tag: "Más popular",
    },
    {
      name: "Elite",
      price: "149",
      anchor: "vs ~525 €/mes en comisiones",
      desc: "Para barberías con alto volumen y equipo",
      features: [
        "Todo en Growth",
        "Barberos ilimitados",
        "Studio IA ilimitado",
        "Página web SEO optimizada",
        "Fidelización + tarjeta sellos",
        "Manager account dedicado",
      ],
      cta: "Empezar con Elite",
      href: "/register?plan=elite",
      highlight: false,
    },
  ];

  return (
    <section id="precios" className="bg-[#09090B] py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#D4AF37]">
            Precios
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white">
            Cuota fija. Sin comisiones.
          </h2>
          <p className="mt-3 text-white/42">
            Todas tus reservas son tuyas. Sin sorpresas al final del mes.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {plans.map(({ name, price, anchor, desc, features, cta, href, highlight, tag }) => (
            <div
              key={name}
              className={`relative flex flex-col rounded-2xl border p-7 transition-all ${
                highlight
                  ? "border-[#D4AF37]/40 bg-gradient-to-b from-[#1C1500]/90 to-[#0F0F0F] shadow-[0_0_0_1px_rgba(212,175,55,0.22),0_0_80px_rgba(212,175,55,0.22),0_30px_70px_rgba(212,175,55,0.14)]"
                  : "border-white/[0.07] bg-[#111111]"
              }`}
            >
              {highlight && (
                <div
                  className="pointer-events-none absolute inset-0 animate-pulse rounded-2xl opacity-40"
                  style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.12) 0%, transparent 60%)" }}
                />
              )}
              {tag && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F0C840] px-3 py-0.5 text-[10px] font-black text-[#09090B] shadow-[0_2px_12px_rgba(212,175,55,0.4)]">
                  {tag}
                </div>
              )}
              <div className="mb-6">
                <p className="text-[11px] font-black uppercase tracking-wider text-white/32">
                  {name}
                </p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-[2.6rem] font-black leading-none text-white">{price} €</span>
                  <span className="text-sm text-white/28">/mes</span>
                </div>
                <div className="mt-2.5 rounded-lg border border-emerald-400/12 bg-emerald-400/[0.06] px-2.5 py-1.5">
                  <p className="text-[11px] font-semibold text-emerald-400">{anchor}</p>
                </div>
                <p className="mt-2.5 text-[13px] text-white/38">{desc}</p>
              </div>

              <ul className="mb-7 flex flex-1 flex-col gap-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-white/58">
                    <Check size={12} className="mt-0.5 shrink-0 text-[#D4AF37]" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={href}
                className={`inline-flex h-11 items-center justify-center rounded-xl text-[13px] font-black transition active:scale-[0.97] ${
                  highlight
                    ? "bg-[#D4AF37] text-[#09090B] shadow-[0_4px_20px_rgba(212,175,55,0.26)] hover:bg-[#E8C84A]"
                    : "border border-white/10 bg-white/[0.04] text-white hover:border-white/18 hover:bg-white/[0.07]"
                }`}
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[11.5px] text-white/20">
          14 días de prueba gratuita · Sin tarjeta de crédito · Cancela en cualquier momento
        </p>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const faqs: readonly [string, string][] = [
  [
    "¿Mis clientes tienen que instalar una app?",
    "No. Reservan desde cualquier navegador — desde tu link, QR, Instagram o Google. Sin descargas ni registro de ningún tipo.",
  ],
  [
    "¿Booksy cobra comisión? ¿Vosotros también?",
    "Booksy cobra por cada reserva gestionada. BarberíaOS cobra una cuota mensual fija independientemente del número de reservas. Con 200 reservas al mes, la diferencia puede ser de 200-300 € a tu favor.",
  ],
  [
    "¿Puedo gestionar varios barberos?",
    "Sí. Cada barbero tiene su agenda, horario y estadísticas propias. El plan Growth permite hasta 5 barberos y Elite permite barberos ilimitados.",
  ],
  [
    "¿Mis datos y mis clientes son míos?",
    "Sí, siempre. Tus clientes, sus datos y su historial te pertenecen. No compartimos tu base de clientes con ningún marketplace ni tercero.",
  ],
  [
    "¿Puedo cancelar cuando quiera?",
    "Sí. Sin permanencia, sin penalizaciones, sin preguntas. Cancela desde tu panel en cualquier momento.",
  ],
  [
    "¿Qué incluye el Studio IA?",
    "Genera reels, posts y copy para Instagram con IA en segundos. Perfecto para anunciar huecos libres o promociones antes de que se pierdan.",
  ],
  [
    "¿Necesito conocimientos técnicos?",
    "No. Configuración inicial en 30 minutos. Soporte por WhatsApp incluido en todos los planes si necesitas ayuda en cualquier momento.",
  ],
];

function FAQSection() {
  return (
    <section className="bg-[#0D0D0F] py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#D4AF37]">FAQ</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white">
            Preguntas frecuentes
          </h2>
        </div>
        <FAQAccordionLanding items={faqs} />
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#09090B] py-28">
      {/* glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/[0.055] blur-[130px]" />

      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <div className="mb-7 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/12 ring-1 ring-[#D4AF37]/18">
          <Scissors size={28} className="text-[#D4AF37]" />
        </div>

        <h2 className="text-5xl font-black leading-[1.05] tracking-tight text-white md:text-6xl">
          Empieza hoy.
          <br />
          <span className="text-[#D4AF37]">Sin riesgo.</span>
        </h2>

        <p className="mt-5 text-lg text-white/42">
          14 días gratis. Sin tarjeta. Activo en 30 minutos.
          <br />
          <span className="text-white/58">Y sin pagar comisiones nunca más.</span>
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex h-14 items-center gap-3 rounded-2xl bg-[#D4AF37] px-9 text-[16px] font-black text-[#09090B] shadow-[0_8px_36px_rgba(212,175,55,0.40)] transition hover:bg-[#E8C84A] hover:shadow-[0_14px_48px_rgba(212,175,55,0.50)] active:scale-[0.98]"
          >
            Crear cuenta gratis <ArrowRight size={17} strokeWidth={2.5} />
          </Link>
          <Link
            href={BUSINESS_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-9 text-[15px] font-semibold text-white/65 transition hover:border-white/20 hover:text-white"
          >
            <MessageCircle size={17} className="text-emerald-400" />
            Hablar por WhatsApp
          </Link>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11.5px] text-white/22">
          {[
            "Sin tarjeta de crédito",
            "Sin permanencia",
            "Cancela cuando quieras",
            "Soporte por WhatsApp",
          ].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <Check size={9} className="text-[#D4AF37]" strokeWidth={3} />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#09090B] py-10">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#D4AF37]">
              <Scissors size={11} className="text-[#09090B]" strokeWidth={2.5} />
            </div>
            <span className="text-[13px] font-black text-white/42">BarberíaOS</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] text-white/26">
            {[
              ["Privacidad", "/legal/privacidad"],
              ["Cookies", "/legal/cookies"],
              ["Términos", "/legal/terminos"],
              ["Contacto", `mailto:${BUSINESS_CONFIG.legalEmail}`],
              ["Ver demo", BUSINESS_CONFIG.demoUrl],
              ["Alternativa a Booksy", "/alternativa-booksy-barberias"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-white/52">
                {label}
              </Link>
            ))}
          </div>
          <p className="text-[11px] text-white/18">© 2026 BarberíaOS</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Sticky mobile CTA ────────────────────────────────────────────────────────

function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] bg-[#09090B]/96 px-4 py-3 backdrop-blur-xl md:hidden">
      <Link
        href="/register"
        className="flex h-12 items-center justify-center rounded-2xl bg-[#D4AF37] text-[14px] font-black text-[#09090B] shadow-[0_4px_20px_rgba(212,175,55,0.32)]"
      >
        Empezar gratis — 14 días sin tarjeta
      </Link>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function BarberíaOSHomeLanding() {
  return (
    <div className="min-h-screen bg-[#09090B]">
      <Nav />
      <Hero />
      <ChannelBar />
      <PainSection />
      <Features />
      <ComparisonSection />
      <StatsBar />
      <HowItWorks />
      <TrustBar />
      <Pricing />
      <FAQSection />
      <FinalCTA />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
