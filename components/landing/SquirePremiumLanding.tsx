"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, BarChart3, Bell, CalendarDays, Check, ChevronDown,
  Clock, Crown, Instagram, MessageCircle, QrCode, ReceiptText,
  ShieldCheck, Sparkles, Star, TrendingUp, Users, WalletCards, Zap,
} from "lucide-react";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";
import { BarberiaOSLogo } from "@/components/brand/BarberiaOSLogo";

// ─── URLs ────────────────────────────────────────────────────────────────────

const DEMO_URL    = "/pedir-demo";
const WA_URL      = BUSINESS_CONFIG.whatsappUrl;
const LOGIN_URL   = BUSINESS_CONFIG.loginUrl;

// ─── Animation primitives ────────────────────────────────────────────────────
// Uses whileInView — canonical Framer Motion pattern, no hook violations,
// SSR-safe (renders visible, animates on scroll in browser).

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const skip = useReducedMotion();
  return (
    <motion.div
      initial={skip ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const skip = useReducedMotion();
  return (
    <motion.div
      initial={skip ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Count-up component ───────────────────────────────────────────────────────
// Implemented as a component (not a hook) so it can be safely used inside maps.

function CountUpNumber({ target, suffix, duration = 1600 }: { target: number; suffix: string; duration?: number }) {
  const [val, setVal]   = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // IntersectionObserver — no hooks from framer-motion needed here
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    let step = 0;
    const id = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / steps, 3);
      setVal(Math.round(ease * target));
      if (step >= steps) clearInterval(id);
    }, duration / steps);
    return () => clearInterval(id);
  }, [started, target, duration]);

  return <div ref={ref} className="tabular-nums">{val}{suffix}</div>;
}

// ─── Reusable atoms ──────────────────────────────────────────────────────────

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-black uppercase tracking-widest ${
      light
        ? "border-white/15 bg-white/10 text-white/60"
        : "border-[#D4AF37]/30 bg-[#FFFBEB] text-[#92650A]"
    }`}>
      {children}
    </span>
  );
}

function GoldDivider() {
  return (
    <div className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
      scrolled ? "border-b border-[#EAEAEA] bg-white/95 shadow-[0_1px_20px_rgba(0,0,0,0.06)] backdrop-blur-md" : "bg-transparent"
    }`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" aria-label="BarberíaOS">
          <BarberiaOSLogo variant="full" size={34} showText tone={scrolled ? "light" : "dark"} />
        </Link>

        <nav className="hidden items-center gap-8 text-[13px] font-semibold md:flex" style={{ color: scrolled ? "#555" : "rgba(255,255,255,0.70)" }}>
          <Link href="#producto" className="transition hover:opacity-100 opacity-80">Producto</Link>
          <Link href="#como-funciona" className="transition hover:opacity-100 opacity-80">Cómo funciona</Link>
          <Link href="#precios" className="transition hover:opacity-100 opacity-80">Precios</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href={LOGIN_URL} className={`hidden text-[13px] font-bold transition md:block ${scrolled ? "text-slate-600 hover:text-slate-900" : "text-white/70 hover:text-white"}`}>
            Acceder
          </Link>
          <Link href={DEMO_URL} className="inline-flex min-h-[38px] items-center justify-center rounded-xl bg-[#D4AF37] px-5 text-[13px] font-black text-[#111111] shadow-[0_2px_12px_rgba(212,175,55,0.35)] transition hover:-translate-y-0.5 hover:bg-[#E8C547] active:scale-[0.98]">
            Solicitar demo
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function AgendaMockup() {
  const barbers = [
    { name: "Miguel", color: "#6366F1" },
    { name: "Sergio", color: "#10B981" },
    { name: "Carlos", color: "#F59E0B" },
  ];

  const slots = [
    { time: "09:00", barber: 0, client: "Adrián M.", service: "Fade + barba",   duration: 2 },
    { time: "09:00", barber: 1, client: "Pablo S.", service: "Corte clásico",   duration: 1 },
    { time: "10:00", barber: 0, client: "Jorge T.", service: "Diseño + línea",  duration: 2 },
    { time: "10:00", barber: 1, client: "Hueco libre", service: "60 min",        duration: 2, free: true },
    { time: "10:00", barber: 2, client: "Rafa L.", service: "Afeitado clásico", duration: 2 },
    { time: "11:00", barber: 0, client: "Samuel G.", service: "Fade bajo",       duration: 1 },
    { time: "11:00", barber: 2, client: "Niko B.", service: "Corte + barba",    duration: 2 },
    { time: "12:00", barber: 0, client: "David P.", service: "Corte & color",   duration: 2 },
    { time: "12:00", barber: 1, client: "Omar R.", service: "Fade completo",    duration: 2 },
  ];

  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00"];

  return (
    <div className="pointer-events-none select-none overflow-hidden rounded-[18px] border border-[#EAEAEA] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.18),0_8px_32px_rgba(0,0,0,0.08)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-[#F0F0F0] bg-[#F7F7F7] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="mx-auto flex items-center gap-1.5 rounded-md border border-[#E0E0E0] bg-white px-3 py-0.5 text-[11px] text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          app.barberiaos.com/dashboard/agenda
        </div>
      </div>

      {/* App layout */}
      <div className="flex h-[340px] sm:h-[380px]">
        {/* Sidebar */}
        <div className="hidden w-12 flex-col items-center gap-3 border-r border-[#F0F0F0] pt-4 sm:flex">
          {[CalendarDays, Users, WalletCards, BarChart3, QrCode, Bell].map((Icon, i) => (
            <div key={i} className={`flex h-8 w-8 items-center justify-center rounded-xl ${i === 0 ? "bg-[#111111] text-white" : "text-slate-300"}`}>
              <Icon size={14} />
            </div>
          ))}
        </div>

        {/* Main agenda */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-[#F4F4F4] px-4 py-2">
            <div className="flex items-center gap-2">
              <p className="text-[12px] font-black text-[#111111]">Miércoles, 4 junio 2025</p>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700">Hoy</span>
            </div>
            <div className="flex items-center gap-1.5">
              {barbers.map((b) => (
                <span key={b.name} className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: b.color + "18", color: b.color }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: b.color }} />
                  {b.name}
                </span>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="flex flex-1 overflow-hidden">
            {/* Time column */}
            <div className="flex w-12 shrink-0 flex-col border-r border-[#F4F4F4]">
              {hours.map((h) => (
                <div key={h} className="flex h-16 items-start justify-end pr-2 pt-1">
                  <span className="text-[10px] text-slate-300">{h}</span>
                </div>
              ))}
            </div>

            {/* Barber columns */}
            {barbers.map((barber, bi) => (
              <div key={bi} className="relative flex-1 border-r border-[#F8F8F8] last:border-r-0">
                {/* Hour lines */}
                {hours.map((_, hi) => (
                  <div key={hi} className="h-16 border-b border-[#F8F8F8]" />
                ))}
                {/* Appointment blocks */}
                {slots.filter((s) => s.barber === bi).map((slot, si) => {
                  const hourIndex = hours.indexOf(slot.time);
                  const top  = hourIndex * 64;
                  const h    = slot.duration * 64 - 4;
                  return (
                    <div
                      key={si}
                      className="absolute inset-x-1 overflow-hidden rounded-lg px-2 py-1.5"
                      style={{
                        top: top + 2,
                        height: h,
                        background: slot.free ? "#FFF8E7" : barber.color + "18",
                        borderLeft: `3px solid ${slot.free ? "#F59E0B" : barber.color}`,
                      }}
                    >
                      <p className="truncate text-[10px] font-black" style={{ color: slot.free ? "#92650A" : barber.color }}>
                        {slot.client}
                      </p>
                      <p className="truncate text-[9px] opacity-70" style={{ color: slot.free ? "#92650A" : barber.color }}>
                        {slot.service}
                      </p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="hidden w-36 flex-col gap-3 border-l border-[#F0F0F0] p-3 lg:flex">
          <div className="rounded-xl bg-[#FAFAFA] p-3">
            <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">Ingresos hoy</p>
            <p className="mt-0.5 text-xl font-black text-[#111111]">412€</p>
            <p className="text-[10px] font-bold text-emerald-600">+18% vs ayer</p>
          </div>
          <div className="rounded-xl bg-[#FAFAFA] p-3">
            <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">Citas hoy</p>
            <p className="mt-0.5 text-xl font-black text-[#111111]">11</p>
            <p className="text-[10px] font-bold text-slate-400">3 pendientes</p>
          </div>
          <div className="rounded-xl border border-[#D4AF37]/20 bg-[#FFFBEB] p-3">
            <p className="text-[9px] font-black uppercase tracking-wide text-[#92650A]">Hueco libre</p>
            <p className="mt-0.5 text-[11px] font-black text-[#111111]">10:00 · Sergio</p>
            <p className="mt-1 rounded-lg bg-[#D4AF37] py-1 text-center text-[9px] font-black text-[#111111]">Llenar hueco →</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0A0B0F] px-5 pb-20 pt-32 text-white lg:px-8 lg:pb-28 lg:pt-36">
      {/* Background gradient mesh */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[radial-gradient(ellipse,rgba(212,175,55,0.12)_0%,transparent_70%)]" />
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(99,102,241,0.08)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-full -translate-x-1/2 bg-gradient-to-t from-[#0A0B0F] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[12px] font-semibold text-white/60 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Software para barberías · Sin comisión por reserva
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[44px] font-black leading-[1.04] tracking-tight sm:text-[60px] lg:text-[80px]"
          >
            Tu barbería,<br />
            <span className="bg-gradient-to-r from-[#FFF59C] via-[#F5D76E] to-[#C9A227] bg-clip-text text-transparent">
              gestionada al máximo.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/55 lg:text-xl"
          >
            Reservas, agenda, clientes, fidelización, caja y marketing en un solo panel.
            Tus clientes reservan desde cualquier sitio. Tú controlas todo.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href={DEMO_URL}
              className="inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-2xl bg-[#D4AF37] px-9 text-[15px] font-black text-[#111111] shadow-[0_8px_32px_rgba(212,175,55,0.40)] transition hover:-translate-y-0.5 hover:bg-[#E8C547] hover:shadow-[0_12px_40px_rgba(212,175,55,0.50)] active:scale-[0.98]"
            >
              Solicitar demo gratuita <ArrowRight size={17} />
            </Link>
            <Link
              href="#como-funciona"
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-9 text-[15px] font-semibold text-white/70 backdrop-blur transition hover:bg-white/[0.10] hover:text-white"
            >
              Ver cómo funciona
            </Link>
          </motion.div>

          {/* Trust pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[13px] text-white/35"
          >
            {["Sin comisión por reserva", "Sin app para el cliente", "Activo en 30 minutos", "Sin permanencia"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check size={12} className="text-[#D4AF37]" />{t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          {/* Gold glow underneath */}
          <div className="absolute -inset-1 rounded-[22px] bg-gradient-to-r from-[#D4AF37]/20 via-[#F5D76E]/10 to-[#D4AF37]/20 blur-2xl" />
          <div className="relative">
            <AgendaMockup />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Stats bar ───────────────────────────────────────────────────────────────

function StatsBar() {
  const stats = [
    { target: 500, suffix: "+",   label: "barberías activas" },
    { target: 98,  suffix: "%",   label: "satisfacción" },
    { target: 0,   suffix: "€",   label: "comisión por reserva" },
    { target: 30,  suffix: "min", label: "para estar operativo" },
  ];

  return (
    <section className="border-b border-[#EAEAEA] bg-white px-5 py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <FadeUp>
          <p className="mb-10 text-center text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
            Barberías que ya trabajan con BarberíaOS
          </p>
        </FadeUp>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.1} className="text-center">
              <p className="text-4xl font-black text-[#111111] lg:text-5xl">
                <CountUpNumber target={s.target} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-[13px] text-slate-500">{s.label}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Problem statement (dark) ─────────────────────────────────────────────────

function ProblemSection() {
  const pains = [
    { icon: MessageCircle, stat: "3h/día", text: "perdidas gestionando reservas por WhatsApp" },
    { icon: CalendarDays,  stat: "2-3×/mes",  text: "doble reserva con el mismo barbero" },
    { icon: Clock,         stat: "31%",   text: "de huecos vacíos que nadie ve ni llena" },
    { icon: Users,         stat: "1 de 3", text: "clientes no vuelve sin recordatorio activo" },
    { icon: WalletCards,   stat: "Sin datos", text: "del día — cierras la caja a ciegas" },
  ];

  return (
    <section className="bg-[#0A0B0F] px-5 py-24 text-white lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <FadeUp>
            <Eyebrow light>El problema real</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-6 text-[36px] font-black leading-tight tracking-tight sm:text-[52px] lg:text-[64px]">
              Cada día pierdes dinero<br />
              <span className="bg-gradient-to-r from-[#F5D76E] to-[#C9A227] bg-clip-text text-transparent">
                sin saberlo.
              </span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mt-5 text-lg text-white/45">
              El 78% de las barberías gestionan sus reservas por WhatsApp.
              Lo que eso cuesta en tiempo, clientes perdidos y dinero es invisible — pero real.
            </p>
          </FadeUp>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pains.map((p, i) => (
            <FadeUp key={p.text} delay={i * 0.07}>
              <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.04] p-7 transition hover:border-red-500/20 hover:bg-red-500/[0.04]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                    <p.icon size={18} className="text-red-400" />
                  </div>
                  <span className="text-2xl font-black text-white">{p.stat}</span>
                </div>
                <p className="text-[14px] leading-relaxed text-white/50">{p.text}</p>
              </div>
            </FadeUp>
          ))}

          {/* Call-out card */}
          <FadeUp delay={0.35}>
            <div className="rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.07] p-7 sm:col-span-2 lg:col-span-1">
              <Sparkles size={24} className="mb-4 text-[#D4AF37]" />
              <p className="text-[22px] font-black leading-snug text-white">
                Con BarberíaOS, todo esto desaparece el primer día.
              </p>
              <Link
                href={DEMO_URL}
                className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-black text-[#D4AF37] transition hover:gap-2.5"
              >
                Ver demo <ArrowRight size={14} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── Feature deep-dives ───────────────────────────────────────────────────────

function ClientesMockup() {
  const clients = [
    { name: "Carlos Ruiz",   visits: 18, badge: "VIP",      days: 3,  badgeColor: "bg-amber-100 text-amber-800" },
    { name: "Adrián Moreno", visits: 7,  badge: "Frecuente", days: 8,  badgeColor: "bg-emerald-100 text-emerald-700" },
    { name: "Pablo Soto",    visits: 1,  badge: "Nuevo",     days: 12, badgeColor: "bg-blue-100 text-blue-700" },
    { name: "Marcos Gil",    visits: 4,  badge: "Inactivo",  days: 42, badgeColor: "bg-red-100 text-red-700" },
    { name: "Javier Leal",   visits: 12, badge: "VIP",      days: 6,  badgeColor: "bg-amber-100 text-amber-800" },
  ];
  const avatarColors = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#EAEAEA] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between border-b border-[#F0F0F0] px-5 py-3.5">
        <p className="text-[13px] font-black text-[#111111]">CRM · Clientes</p>
        <div className="flex gap-2 text-[11px]">
          {["Todos", "VIP", "Perdidos"].map((f, i) => (
            <span key={f} className={`rounded-full px-2.5 py-1 font-bold ${i === 0 ? "bg-[#111111] text-white" : "bg-slate-100 text-slate-500"}`}>{f}</span>
          ))}
        </div>
      </div>
      <div className="divide-y divide-[#F8F8F8]">
        {clients.map((c, i) => (
          <div key={c.name} className="flex items-center gap-3 px-5 py-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white" style={{ background: avatarColors[i] }}>
              {c.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-black text-[#111111]">{c.name}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${c.badgeColor}`}>{c.badge}</span>
              </div>
              <p className="text-[11px] text-slate-400">{c.visits} visitas · Hace {c.days} días</p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <button className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600"><MessageCircle size={12} /></button>
              <button className="rounded-lg bg-slate-50 p-1.5 text-slate-500"><CalendarDays size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CajaMockup() {
  const items = [
    { label: "Fade + barba", amount: 28, method: "card",  time: "09:42" },
    { label: "Corte clásico", amount: 18, method: "cash",  time: "10:10" },
    { label: "Diseño + línea", amount: 35, method: "bizum", time: "11:05" },
    { label: "Afeitado clásico", amount: 22, method: "card", time: "11:30" },
    { label: "Fade bajo", amount: 20, method: "cash", time: "12:15" },
  ];
  const methodColor: Record<string, string> = {
    card:  "bg-blue-50 text-blue-700",
    cash:  "bg-emerald-50 text-emerald-700",
    bizum: "bg-amber-50 text-amber-700",
  };
  const total = items.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#EAEAEA] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
      <div className="border-b border-[#F0F0F0] px-5 py-3.5">
        <p className="text-[13px] font-black text-[#111111]">Caja del día — Miércoles 4 junio</p>
      </div>
      <div className="divide-y divide-[#F8F8F8]">
        {items.map((item) => (
          <div key={item.time} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="text-[13px] font-semibold text-[#111111]">{item.label}</p>
              <p className="text-[11px] text-slate-400">{item.time}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${methodColor[item.method]}`}>{item.method}</span>
              <span className="text-[14px] font-black text-[#111111]">{item.amount}€</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-[#F0F0F0] bg-[#FAFAFA] px-5 py-4">
        <p className="text-[13px] font-bold text-slate-500">Total hoy</p>
        <p className="text-2xl font-black text-[#111111]">{total}€</p>
      </div>
    </div>
  );
}

type FeatureSpot = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  mockup: React.ReactNode;
  flip?: boolean;
};

function FeatureSpot({ eyebrow, title, body, bullets, mockup, flip = false }: FeatureSpot) {
  return (
    <div className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
      <div>
        <FadeUp><Eyebrow>{eyebrow}</Eyebrow></FadeUp>
        <FadeUp delay={0.1}>
          <h3 className="mt-5 text-[30px] font-black leading-tight text-[#111111] sm:text-[38px]">{title}</h3>
        </FadeUp>
        <FadeUp delay={0.18}>
          <p className="mt-4 text-base leading-relaxed text-slate-500">{body}</p>
        </FadeUp>
        <FadeUp delay={0.26}>
          <ul className="mt-7 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#111111]">
                  <Check size={10} className="text-white" />
                </div>
                <span className="text-[14px] text-slate-600">{b}</span>
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>
      <FadeIn delay={0.15}>{mockup}</FadeIn>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="producto" className="bg-[#FAFAFA] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl space-y-28">
        <FeatureSpot
          eyebrow="Agenda inteligente"
          title="La agenda que convierte huecos en dinero."
          body="Vista día, semana y mes. Filtro por barbero. Línea de ahora en tiempo real. Los huecos libres se destacan automáticamente para que puedas actuar sobre ellos al instante."
          bullets={[
            "Reservas en tiempo real desde cualquier canal",
            "Anti-duplicado: nunca dos citas en el mismo slot",
            "Reagenda arrastrando la cita — en 2 segundos",
            "Recordatorio 24h automático por email",
          ]}
          mockup={<AgendaMockup />}
        />

        <GoldDivider />

        <FeatureSpot
          flip
          eyebrow="CRM de clientes"
          title="Conoce a cada cliente mejor que él mismo."
          body="VIP, frecuente, nuevo, inactivo, perdido. Cada cliente tiene su etiqueta, su historial completo y su próxima acción sugerida. WhatsApp directo con un clic."
          bullets={[
            "Segmentación automática por comportamiento",
            "Historial completo de visitas y servicios",
            "Acción rápida: WhatsApp, reservar o reactivar",
            "Fidelización con tarjeta de sellos digital",
          ]}
          mockup={<ClientesMockup />}
        />

        <GoldDivider />

        <FeatureSpot
          eyebrow="Caja del día"
          title="Cierra el día en 2 minutos. Con datos reales."
          body="Cada cobro registrado con método de pago. Ticket medio, servicio más vendido y rendimiento por barbero. Sin hojas, sin Excel, sin suposiciones."
          bullets={[
            "Efectivo, tarjeta, Bizum y transferencia",
            "Informe diario automático al cerrar",
            "Exportación para contabilidad con un clic",
            "Histórico mensual y comparativas",
          ]}
          mockup={<CajaMockup />}
        />
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    {
      n: "01",
      title: "Creas tu barbería en 5 minutos",
      body: "Añades nombre, servicios, barberos y horarios. Tu link de reservas queda activo al instante.",
      icon: Zap,
    },
    {
      n: "02",
      title: "Tus clientes reservan solos",
      body: "Desde Instagram, Google, QR del mostrador o WhatsApp — sin llamar, sin esperar respuesta.",
      icon: CalendarDays,
    },
    {
      n: "03",
      title: "Tú controlas todo desde el panel",
      body: "Agenda en tiempo real, caja del día, clientes, fidelización y estadísticas en un solo lugar.",
      icon: BarChart3,
    },
  ];

  return (
    <section id="como-funciona" className="bg-white px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <FadeUp><Eyebrow>Cómo funciona</Eyebrow></FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-5 text-[34px] font-black leading-tight text-[#111111] sm:text-[46px]">
              Operativo en menos de 30 minutos
            </h2>
          </FadeUp>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {steps.map((s, i) => (
            <FadeUp key={s.n} delay={i * 0.12}>
              <div className="group relative rounded-3xl border border-[#EAEAEA] bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-[52px] font-black leading-none text-[#F0F0F0]">{s.n}</span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111]">
                    <s.icon size={20} className="text-[#D4AF37]" />
                  </div>
                </div>
                <h3 className="mb-3 text-[18px] font-black text-[#111111]">{s.title}</h3>
                <p className="text-[14px] leading-relaxed text-slate-500">{s.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* CTA block */}
        <FadeUp delay={0.2}>
          <div className="mx-auto mt-16 max-w-2xl rounded-3xl border border-[#EAEAEA] bg-[#FAFAFA] p-10 text-center">
            <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-slate-400">Sin instalación · Sin contrato</p>
            <h3 className="mb-7 text-[24px] font-black text-[#111111]">
              Tu primera reserva puede llegar hoy mismo
            </h3>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={DEMO_URL}
                className="inline-flex min-h-[52px] items-center gap-2 rounded-2xl bg-[#111111] px-8 text-[14px] font-black text-white shadow-[0_4px_20px_rgba(17,17,17,0.18)] transition hover:-translate-y-0.5"
              >
                Solicitar demo gratuita <ArrowRight size={15} />
              </Link>
              <Link
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] items-center gap-2 rounded-2xl border border-[#EAEAEA] bg-white px-8 text-[14px] font-black text-slate-700 transition hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
              >
                <MessageCircle size={15} className="text-emerald-500" />
                WhatsApp
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Modules ─────────────────────────────────────────────────────────────────

function ModulesSection() {
  const mods = [
    { icon: CalendarDays, title: "Agenda",        desc: "Día, semana, mes · filtro por barbero · línea de ahora",       color: "text-violet-600  bg-violet-50  border-violet-100" },
    { icon: QrCode,       title: "Reservas QR",   desc: "Link y QR propios · sin comisión · desde cualquier canal",     color: "text-blue-600   bg-blue-50   border-blue-100" },
    { icon: Users,        title: "CRM",            desc: "VIP, frecuente, perdido · historial · WhatsApp directo",       color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { icon: Crown,        title: "Fidelización",   desc: "Tarjeta de sellos digital · sin app · automática",            color: "text-amber-600  bg-amber-50  border-amber-100" },
    { icon: Bell,         title: "Recordatorios",  desc: "Email 24h antes · sin configurar nada · cero no-shows",       color: "text-rose-600   bg-rose-50   border-rose-100" },
    { icon: WalletCards,  title: "Caja",           desc: "Cobros, método de pago, ticket medio · cierre en 2 min",      color: "text-cyan-600   bg-cyan-50   border-cyan-100" },
    { icon: BarChart3,    title: "Estadísticas",   desc: "Ingresos, ocupación, rendimiento por barbero y servicio",     color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { icon: Star,         title: "Reseñas",        desc: "Solicitud automática tras cada cita · sube tu rating Google", color: "text-orange-600 bg-orange-50 border-orange-100" },
    { icon: TrendingUp,   title: "Marketing",      desc: "Campañas para llenar huecos · mensajes listos para copiar",   color: "text-pink-600   bg-pink-50   border-pink-100" },
    { icon: ReceiptText,  title: "Fiscalidad",     desc: "Exporta datos para tu gestor · sin trabajo extra",            color: "text-slate-600  bg-slate-50  border-slate-200" },
    { icon: ShieldCheck,  title: "Seguridad",      desc: "Datos tuyos · RGPD · sin acceso de terceros a tu agenda",     color: "text-teal-600   bg-teal-50   border-teal-100" },
    { icon: Instagram,    title: "Presencia",      desc: "Apareces en marketplace BarberíaOS · página pública lista",   color: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100" },
  ];

  return (
    <section className="bg-[#FAFAFA] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <FadeUp><Eyebrow>Todo incluido</Eyebrow></FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-5 text-[34px] font-black leading-tight text-[#111111] sm:text-[46px]">
              12 herramientas en un solo panel
            </h2>
          </FadeUp>
          <FadeUp delay={0.18}>
            <p className="mt-4 text-base text-slate-500">
              Sin integraciones, sin apps separadas, sin configuraciones técnicas.
            </p>
          </FadeUp>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mods.map((m, i) => (
            <FadeUp key={m.title} delay={(i % 4) * 0.06}>
              <div className="group rounded-2xl border border-[#EAEAEA] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)]">
                <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl border ${m.color}`}>
                  <m.icon size={17} />
                </div>
                <p className="mb-1 text-[14px] font-black text-[#111111]">{m.title}</p>
                <p className="text-[12px] leading-relaxed text-slate-500">{m.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

function PricingSection() {
  const plans = [
    {
      name: "Inicio",
      price: "39",
      highlight: "Para 1–2 barberos",
      desc: "Ordena tu barbería desde el primer día.",
      featured: false,
      features: [
        "Agenda — día, semana, barbero",
        "Reservas online sin comisión",
        "Clientes — historial y ficha",
        "Caja del día",
        "QR imprimible",
        "Página pública de reservas",
        "Recordatorios 24h automáticos",
        "Fiscalidad — exportación básica",
      ],
    },
    {
      name: "Profesional",
      price: "79",
      highlight: "El más elegido",
      desc: "Control total y crecimiento real.",
      featured: true,
      features: [
        "Todo lo de Inicio, más:",
        "Inventario y ventas de productos",
        "Finanzas — ingresos y gastos",
        "Estadísticas por barbero",
        "Marketing Studio",
        "Reseñas automáticas Google",
        "Fidelización — tarjeta de sellos",
        "Automatizaciones avanzadas",
      ],
    },
    {
      name: "Elite",
      price: "149",
      highlight: "Para barberías en expansión",
      desc: "Infraestructura completa para escalar.",
      featured: false,
      features: [
        "Todo lo de Profesional, más:",
        "Web premium con SEO local",
        "Marketing digital gestionado",
        "IA del dueño — insights y alertas",
        "Automatizaciones personalizadas",
        "Soporte prioritario",
        "Onboarding personalizado",
      ],
    },
  ];

  return (
    <section id="precios" className="bg-white px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <FadeUp><Eyebrow>Precios</Eyebrow></FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-5 text-[34px] font-black leading-tight text-[#111111] sm:text-[46px]">
              Sin comisiones. Sin sorpresas.
            </h2>
          </FadeUp>
          <FadeUp delay={0.18}>
            <p className="mt-4 text-base text-slate-500">
              Cuota mensual fija. Cancela cuando quieras. Todos tus datos son siempre tuyos.
            </p>
          </FadeUp>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <FadeUp key={plan.name} delay={i * 0.1}>
              <div className={`relative flex h-full flex-col rounded-3xl border p-8 transition hover:-translate-y-1 ${
                plan.featured
                  ? "border-[#111111] bg-[#111111] shadow-[0_20px_60px_rgba(17,17,17,0.22)]"
                  : "border-[#EAEAEA] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
              }`}>
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37] px-4 py-1.5 text-[11px] font-black text-[#111111]">
                      <Star size={11} className="fill-current" /> Más popular
                    </span>
                  </div>
                )}

                <div>
                  <p className={`text-[11px] font-black uppercase tracking-widest ${plan.featured ? "text-[#D4AF37]" : "text-slate-400"}`}>
                    {plan.highlight}
                  </p>
                  <p className={`mt-1 text-xl font-black ${plan.featured ? "text-white" : "text-[#111111]"}`}>{plan.name}</p>

                  <div className="mt-4 flex items-end gap-1">
                    <span className={`text-5xl font-black tabular-nums ${plan.featured ? "text-white" : "text-[#111111]"}`}>{plan.price}€</span>
                    <span className={`mb-1.5 text-sm ${plan.featured ? "text-white/40" : "text-slate-400"}`}>/mes</span>
                  </div>
                  <p className={`mt-2 text-[13px] ${plan.featured ? "text-white/50" : "text-slate-500"}`}>{plan.desc}</p>
                </div>

                <Link
                  href={DEMO_URL}
                  className={`mt-7 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl text-[13px] font-black transition hover:-translate-y-0.5 ${
                    plan.featured
                      ? "bg-[#D4AF37] text-[#111111] shadow-[0_4px_16px_rgba(212,175,55,0.35)] hover:bg-[#E8C547]"
                      : "border border-[#EAEAEA] bg-[#FAFAFA] text-[#111111] hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
                  }`}
                >
                  Empezar ahora <ArrowRight size={14} />
                </Link>

                <div className={`my-6 h-px ${plan.featured ? "bg-white/10" : "bg-[#F0F0F0]"}`} />

                <ul className="flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${plan.featured ? "bg-[#D4AF37]" : "bg-[#111111]"}`}>
                        <Check size={8} className={plan.featured ? "text-[#111111]" : "text-white"} />
                      </div>
                      <span className={`text-[13px] leading-relaxed ${plan.featured ? "text-white/70" : "text-slate-600"}`}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.15}>
          <p className="mt-10 text-center text-[13px] text-slate-400">
            ¿Necesitas algo específico?{" "}
            <Link href={WA_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-[#111111] underline underline-offset-2 hover:text-[#D4AF37]">
              Hablamos por WhatsApp
            </Link>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Antes gestionaba todo por WhatsApp y siempre había algún malentendido. Ahora los clientes reservan solos y yo veo la agenda limpia desde el móvil.",
      name: "Óscar M.",
      role: "Dueño · Barbería & Co.",
      city: "Madrid",
      initial: "O",
      metric: "+8 reservas/semana",
      color: "#6366F1",
    },
    {
      quote: "Ver los huecos libres en tiempo real me cambió la cabeza. Antes los perdía sin darme cuenta. Ahora mando un mensaje y los lleno en minutos.",
      name: "Rafa P.",
      role: "Barbero principal · The Fade Room",
      city: "Barcelona",
      initial: "R",
      metric: "380€/mes recuperados",
      color: "#10B981",
    },
    {
      quote: "La caja del día antes era un lío de notas. Ahora cierro en 2 minutos y sé exactamente qué entró y qué barbero rindió mejor esta semana.",
      name: "Javi L.",
      role: "Dueño · Corte & Barba",
      city: "Sevilla",
      initial: "J",
      metric: "4.9★ en Google",
      color: "#F59E0B",
    },
  ];

  return (
    <section className="bg-[#0A0B0F] px-5 py-24 text-white lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <FadeUp><Eyebrow light>Testimonios</Eyebrow></FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-5 text-[34px] font-black leading-tight sm:text-[46px]">
              Lo que dicen los dueños
            </h2>
          </FadeUp>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-3xl border border-white/[0.07] bg-white/[0.04] p-8">
                {/* Stars */}
                <div className="mb-5 flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="flex-1 text-[15px] leading-relaxed text-white/60">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Metric */}
                <div className="mt-6 rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.07] px-4 py-3">
                  <p className="text-[18px] font-black text-white">{t.metric}</p>
                </div>

                {/* Author */}
                <div className="mt-5 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                    style={{ background: t.color }}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-[14px] font-black text-white">{t.name}</p>
                    <p className="text-[12px] text-white/35">{t.role} · {t.city}</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "¿Mis clientes tienen que instalar una app?", a: "No. Reservan desde cualquier navegador — desde tu link, QR, Instagram o Google Business. Sin descargas ni registros de ningún tipo." },
    { q: "¿BarberíaOS cobra comisión por cada reserva?", a: "No. Cuota mensual fija. Tus reservas, clientes y datos son siempre tuyos. Sin sorpresas ni cargos ocultos." },
    { q: "¿Cuánto tarda en estar operativo?", a: "Menos de 30 minutos. Creas tu barbería, añades servicios y barberos y ya tienes tu link de reservas activo para compartir." },
    { q: "¿Funciona para barberías con varios barberos?", a: "Sí. Cada barbero tiene su horario propio, agenda individual y estadísticas. El plan Profesional y Elite no tienen límite de equipo." },
    { q: "¿Qué incluye el plan Elite?", a: "Todo lo del plan Profesional más web premium con SEO local, marketing digital gestionado, IA del dueño, automatizaciones personalizadas y soporte prioritario." },
    { q: "¿Puedo cambiar de plan cuando quiera?", a: "Sí. Sube o baja de plan en cualquier momento. Sin permanencia, sin penalizaciones, sin preguntas." },
  ];

  return (
    <section className="bg-white px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-14 text-center">
          <FadeUp><Eyebrow>FAQ</Eyebrow></FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-5 text-[34px] font-black leading-tight text-[#111111] sm:text-[46px]">
              Todo lo que necesitas saber
            </h2>
          </FadeUp>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div className={`overflow-hidden rounded-2xl border transition-colors ${open === i ? "border-[#111111]" : "border-[#EAEAEA] hover:border-[#D4D4D4]"}`}>
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-[15px] font-black text-[#111111]">{faq.q}</span>
                  <ChevronDown
                    size={17}
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: open === i ? "auto" : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[#F0F0F0] px-6 py-5">
                    <p className="text-[14px] leading-relaxed text-slate-500">{faq.a}</p>
                  </div>
                </motion.div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#0A0B0F] px-5 py-28 text-white lg:px-8 lg:py-36">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(212,175,55,0.10)_0%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <FadeUp>
          <span className="mb-6 inline-block text-[11px] font-black uppercase tracking-widest text-[#D4AF37]">
            Empieza hoy · Sin tarjeta de crédito
          </span>
        </FadeUp>
        <FadeUp delay={0.08}>
          <h2 className="text-[40px] font-black leading-[1.06] tracking-tight sm:text-[56px] lg:text-[70px]">
            Tu barbería merece<br />
            <span className="bg-gradient-to-r from-[#FFF59C] via-[#F5D76E] to-[#C9A227] bg-clip-text text-transparent">
              un sistema de verdad.
            </span>
          </h2>
        </FadeUp>
        <FadeUp delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/45">
            Solicita una demo gratuita. Sin permanencia, sin comisiones y sin necesidad de instalar nada. Operativo en 30 minutos.
          </p>
        </FadeUp>

        <FadeUp delay={0.24}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={DEMO_URL}
              className="inline-flex min-h-[58px] items-center justify-center gap-2.5 rounded-2xl bg-[#D4AF37] px-11 text-[15px] font-black text-[#111111] shadow-[0_8px_40px_rgba(212,175,55,0.40)] transition hover:-translate-y-0.5 hover:bg-[#E8C547] hover:shadow-[0_14px_50px_rgba(212,175,55,0.50)] active:scale-[0.98]"
            >
              Solicitar demo gratuita <ArrowRight size={18} />
            </Link>
            <Link
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[58px] items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.06] px-11 text-[15px] font-semibold text-white/70 backdrop-blur transition hover:bg-white/[0.10] hover:text-white"
            >
              <MessageCircle size={17} className="text-emerald-400" />
              Hablar con el equipo
            </Link>
          </div>
        </FadeUp>

        <FadeUp delay={0.3}>
          <p className="mt-8 text-[13px] text-white/25">
            Sin comisión por reserva · Sin permanencia · Sin app para el cliente
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const nav = [
    { label: "Producto",          href: "#producto" },
    { label: "Cómo funciona",     href: "#como-funciona" },
    { label: "Precios",           href: "#precios" },
    { label: "Solicitar demo",    href: DEMO_URL },
    { label: "Acceder",           href: LOGIN_URL },
    { label: "Privacidad",        href: "/legal/privacidad" },
    { label: "Términos",          href: "/legal/terminos" },
  ];

  return (
    <footer className="border-t border-[#EAEAEA] bg-[#FAFAFA] px-5 py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <Link href="/" aria-label="BarberíaOS">
            <BarberiaOSLogo variant="full" size={32} showText tone="light" />
          </Link>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-slate-500">
            {nav.map((l) => (
              <Link key={l.label} href={l.href} className="transition hover:text-[#111111]">{l.label}</Link>
            ))}
          </nav>
        </div>
        <GoldDivider />
        <p className="mt-6 text-center text-[12px] text-slate-400">
          © {new Date().getFullYear()} BarberíaOS · Software para barberías · Hecho en España
        </p>
      </div>
    </footer>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function SquirePremiumLanding() {
  return (
    <div className="min-h-screen bg-white antialiased">
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ModulesSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
