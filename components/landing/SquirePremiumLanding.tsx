"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, BarChart3, Bell, CalendarDays, Check, CheckCircle2,
  ChevronDown, Clock, Crown, Instagram, MessageCircle, QrCode,
  ReceiptText, ShieldCheck, Sparkles, Star, TrendingUp, Users,
  WalletCards, X, Zap, Globe, Scissors,
} from "lucide-react";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";
import { BarberiaOSLogo } from "@/components/brand/BarberiaOSLogo";

// ─── URLs ────────────────────────────────────────────────────────────────────

const DEMO_URL  = "/pedir-demo";
const WA_URL    = BUSINESS_CONFIG.whatsappUrl;
const LOGIN_URL = BUSINESS_CONFIG.loginUrl;

// ─── Animation primitives ────────────────────────────────────────────────────

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

function CountUpNumber({
  target,
  suffix,
  duration = 1600,
}: {
  target: number;
  suffix: string;
  duration?: number;
}) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
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

  return (
    <span ref={ref} className="tabular-nums">
      {val}
      {suffix}
    </span>
  );
}

// ─── Reusable atoms ──────────────────────────────────────────────────────────

function Eyebrow({ children, violet = false }: { children: React.ReactNode; violet?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-black uppercase tracking-widest ${
        violet
          ? "border-[#A78BFA]/40 bg-[#F6F3FF] text-[#6D28D9]"
          : "border-[#D4AF37]/30 bg-[#FFFBEB] text-[#92650A]"
      }`}
    >
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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[#EAEAEA] bg-white/95 shadow-[0_1px_20px_rgba(0,0,0,0.06)] backdrop-blur-md"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" aria-label="BarberíaOS">
          <BarberiaOSLogo variant="full" size={34} showText tone="light" />
        </Link>

        <nav className="hidden items-center gap-8 text-[13px] font-semibold text-slate-600 md:flex">
          <Link href="#producto" className="transition hover:text-slate-900">
            Producto
          </Link>
          <Link href="#precios" className="transition hover:text-slate-900">
            Precios
          </Link>
          <Link href="#studio" className="transition hover:text-slate-900">
            Studio IA
          </Link>
          <Link href="#como-funciona" className="transition hover:text-slate-900">
            Demo
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={LOGIN_URL}
            className="hidden text-[13px] font-bold text-slate-600 transition hover:text-slate-900 md:block"
          >
            Acceder
          </Link>
          <Link
            href={DEMO_URL}
            className="inline-flex min-h-[38px] items-center justify-center rounded-xl bg-[#111111] px-5 text-[13px] font-black text-white shadow-[0_2px_12px_rgba(17,17,17,0.20)] transition hover:-translate-y-0.5 hover:bg-[#1a1a1a] active:scale-[0.98]"
          >
            Ver demo
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAEAEA] text-slate-700 transition hover:bg-slate-50 md:hidden"
            aria-label="Menú"
          >
            <span className="flex flex-col gap-1.5">
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-opacity ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-[#EAEAEA] bg-white px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {[
              { label: "Producto", href: "#producto" },
              { label: "Precios", href: "#precios" },
              { label: "Studio IA", href: "#studio" },
              { label: "Demo", href: "#como-funciona" },
              { label: "Acceder", href: LOGIN_URL },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={DEMO_URL}
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex min-h-[44px] items-center justify-center rounded-xl bg-[#111111] text-[14px] font-black text-white"
            >
              Solicitar demo gratuita
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

// ─── Hero (fondo claro premium) ───────────────────────────────────────────────

function AgendaMockup() {
  const barbers = [
    { name: "Miguel", color: "#6366F1" },
    { name: "Sergio", color: "#10B981" },
    { name: "Carlos", color: "#F59E0B" },
  ];

  const slots = [
    { time: "09:00", barber: 0, client: "Adrián M.", service: "Fade + barba", duration: 2 },
    { time: "09:00", barber: 1, client: "Pablo S.", service: "Corte clásico", duration: 1 },
    { time: "10:00", barber: 0, client: "Jorge T.", service: "Diseño + línea", duration: 2 },
    { time: "10:00", barber: 1, client: "Hueco libre", service: "60 min", duration: 2, free: true },
    { time: "10:00", barber: 2, client: "Rafa L.", service: "Afeitado clásico", duration: 2 },
    { time: "11:00", barber: 0, client: "Samuel G.", service: "Fade bajo", duration: 1 },
    { time: "11:00", barber: 2, client: "Niko B.", service: "Corte + barba", duration: 2 },
    { time: "12:00", barber: 0, client: "David P.", service: "Corte & color", duration: 2 },
    { time: "12:00", barber: 1, client: "Omar R.", service: "Fade completo", duration: 2 },
  ];

  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00"];

  return (
    <div className="pointer-events-none select-none overflow-hidden rounded-[18px] border border-[#EAEAEA] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.14),0_8px_32px_rgba(0,0,0,0.06)]">
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
            <div
              key={i}
              className={`flex h-8 w-8 items-center justify-center rounded-xl ${i === 0 ? "bg-[#111111] text-white" : "text-slate-300"}`}
            >
              <Icon size={14} />
            </div>
          ))}
        </div>

        {/* Main agenda */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#F4F4F4] px-4 py-2">
            <div className="flex items-center gap-2">
              <p className="text-[12px] font-black text-[#111111]">Miércoles, 4 junio 2025</p>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700">
                Hoy
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {barbers.map((b) => (
                <span
                  key={b.name}
                  className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: b.color + "18", color: b.color }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: b.color }} />
                  {b.name}
                </span>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="flex flex-1 overflow-hidden">
            <div className="flex w-12 shrink-0 flex-col border-r border-[#F4F4F4]">
              {hours.map((h) => (
                <div key={h} className="flex h-16 items-start justify-end pr-2 pt-1">
                  <span className="text-[10px] text-slate-300">{h}</span>
                </div>
              ))}
            </div>

            {barbers.map((barber, bi) => (
              <div key={bi} className="relative flex-1 border-r border-[#F8F8F8] last:border-r-0">
                {hours.map((_, hi) => (
                  <div key={hi} className="h-16 border-b border-[#F8F8F8]" />
                ))}
                {slots
                  .filter((s) => s.barber === bi)
                  .map((slot, si) => {
                    const hourIndex = hours.indexOf(slot.time);
                    const top = hourIndex * 64;
                    const h = slot.duration * 64 - 4;
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
                        <p
                          className="truncate text-[10px] font-black"
                          style={{ color: slot.free ? "#92650A" : barber.color }}
                        >
                          {slot.client}
                        </p>
                        <p
                          className="truncate text-[9px] opacity-70"
                          style={{ color: slot.free ? "#92650A" : barber.color }}
                        >
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
            <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">
              Ingresos hoy
            </p>
            <p className="mt-0.5 text-xl font-black text-[#111111]">412€</p>
            <p className="text-[10px] font-bold text-emerald-600">+18% vs ayer</p>
          </div>
          <div className="rounded-xl bg-[#FAFAFA] p-3">
            <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">
              Citas hoy
            </p>
            <p className="mt-0.5 text-xl font-black text-[#111111]">11</p>
            <p className="text-[10px] font-bold text-slate-400">3 pendientes</p>
          </div>
          <div className="rounded-xl border border-[#D4AF37]/20 bg-[#FFFBEB] p-3">
            <p className="text-[9px] font-black uppercase tracking-wide text-[#92650A]">
              Hueco libre
            </p>
            <p className="mt-0.5 text-[11px] font-black text-[#111111]">10:00 · Sergio</p>
            <p className="mt-1 rounded-lg bg-[#D4AF37] py-1 text-center text-[9px] font-black text-[#111111]">
              Llenar hueco →
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FAFAF7] px-5 pb-20 pt-32 lg:px-8 lg:pb-28 lg:pt-36">
      {/* Subtle background texture */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[radial-gradient(ellipse,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] translate-x-1/4 rounded-full bg-[radial-gradient(ellipse,rgba(109,40,217,0.04)_0%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-600 shadow-[0_1px_6px_rgba(0,0,0,0.06)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Creado para barberías modernas que quieren crecer
          </motion.div>

          {/* Studio IA badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
            className="mb-8"
          >
            <Link
              href="#studio"
              className="inline-flex items-center gap-2 rounded-full border border-[#A78BFA]/40 bg-[#F6F3FF] px-4 py-1.5 text-[12px] font-black text-[#6D28D9] transition hover:bg-[#EDE9FF]"
            >
              <Sparkles size={11} />
              Nuevo: Studio IA — Crea reels y campañas con inteligencia artificial
              <ArrowRight size={10} />
            </Link>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[44px] font-black leading-[1.04] tracking-tight text-[#111111] sm:text-[60px] lg:text-[76px]"
          >
            El sistema inteligente<br />
            para{" "}
            <span className="bg-gradient-to-r from-[#C9922A] via-[#D4AF37] to-[#B88917] bg-clip-text text-transparent">
              llenar la agenda
            </span>
            <br />
            de tu barbería
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-slate-600 lg:text-xl"
          >
            Reservas online, recordatorios, clientes, reseñas, promociones y contenido para
            Instagram en una sola plataforma. Sin comisiones. Sin app para tus clientes.
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
              className="inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-2xl bg-[#111111] px-9 text-[15px] font-black text-white shadow-[0_8px_32px_rgba(17,17,17,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1a1a1a] hover:shadow-[0_12px_40px_rgba(17,17,17,0.28)] active:scale-[0.98]"
            >
              Ver demo gratuita <ArrowRight size={17} />
            </Link>
            <Link
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-[#EAEAEA] bg-white px-9 text-[15px] font-semibold text-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.10)]"
            >
              <MessageCircle size={16} className="text-emerald-500" />
              Hablar por WhatsApp
            </Link>
          </motion.div>

          {/* Trust pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[13px] text-slate-500"
          >
            {[
              "Sin comisión por reserva",
              "Sin app para el cliente",
              "Activo en 30 minutos",
              "Sin permanencia",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check size={12} className="text-[#D4AF37]" />
                {t}
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
          <div className="absolute -inset-2 rounded-[24px] bg-gradient-to-r from-[#D4AF37]/10 via-[#F5D76E]/06 to-[#D4AF37]/10 blur-2xl" />
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
    { target: 500, suffix: "+", label: "barberías activas" },
    { target: 98, suffix: "%", label: "satisfacción" },
    { target: 0, suffix: "€", label: "comisión por reserva" },
    { target: 30, suffix: "min", label: "para estar operativo" },
  ];

  return (
    <section className="border-y border-[#EAEAEA] bg-white px-5 py-12 lg:px-8">
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
        <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      </div>
    </section>
  );
}

// ─── Problem section (fondo claro) ────────────────────────────────────────────

function ProblemSection() {
  const pains = [
    {
      icon: MessageCircle,
      title: "WhatsApp todo el día",
      text: "Clientes preguntando disponibilidad, cancelando a última hora, sin registro de nada.",
    },
    {
      icon: CalendarDays,
      title: "Agenda en papel o notas",
      text: "Reservas desordenadas, errores de doble cita y huecos que nadie ve.",
    },
    {
      icon: Clock,
      title: "Huecos libres sin llenar",
      text: "El 31% de huecos vacíos que nadie sabe que existen — dinero perdido cada día.",
    },
    {
      icon: Users,
      title: "Clientes que no vuelven",
      text: "Sin recordatorios ni fidelización, 1 de cada 3 clientes no regresa.",
    },
    {
      icon: Star,
      title: "Pocas reseñas en Google",
      text: "Sin sistema automático post-cita, tu reputación online no crece.",
    },
    {
      icon: Instagram,
      title: "Instagram sin contenido",
      text: "No hay tiempo para crear contenido y el perfil lleva semanas sin publicar.",
    },
    {
      icon: BarChart3,
      title: "Sin datos del negocio",
      text: "No sabes qué barbero rinde más, qué servicio vende más ni cómo va el mes.",
    },
  ];

  return (
    <section className="bg-white px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <FadeUp>
            <Eyebrow>El problema real</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-6 text-[36px] font-black leading-tight tracking-tight text-[#111111] sm:text-[52px]">
              ¿Te suena esto?
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mt-5 text-lg text-slate-600">
              El 78% de las barberías gestionan reservas por WhatsApp. Lo que eso cuesta en tiempo,
              clientes perdidos y dinero es invisible — pero muy real.
            </p>
          </FadeUp>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pains.map((p, i) => (
            <FadeUp key={p.title} delay={i * 0.06}>
              <div className="group rounded-2xl border border-slate-200/80 bg-[#FAFAF7] p-6 transition hover:border-red-200 hover:bg-red-50/40">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50">
                    <X size={16} className="text-red-500" />
                  </div>
                  <p.icon size={16} className="text-slate-400" />
                </div>
                <p className="mb-1.5 text-[14px] font-black text-[#111111]">{p.title}</p>
                <p className="text-[13px] leading-relaxed text-slate-500">{p.text}</p>
              </div>
            </FadeUp>
          ))}

          {/* Solution call-out */}
          <FadeUp delay={0.42}>
            <div className="flex flex-col justify-between rounded-2xl border border-[#D4AF37]/30 bg-[#FFFBEB] p-6 sm:col-span-2 lg:col-span-1">
              <div>
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]">
                  <CheckCircle2 size={18} className="text-[#111111]" />
                </div>
                <p className="text-[18px] font-black leading-snug text-[#111111]">
                  BarberíaOS lo resuelve todo desde el día 1.
                </p>
              </div>
              <Link
                href={DEMO_URL}
                className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-black text-[#92650A] transition hover:gap-2.5"
              >
                Ver cómo funciona <ArrowRight size={14} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── Centro de control (Solución) ─────────────────────────────────────────────

function SolucionSection() {
  const modules = [
    { icon: CalendarDays, title: "Agenda", color: "text-violet-600 bg-violet-50 border-violet-100" },
    { icon: QrCode, title: "Reservas QR", color: "text-blue-600 bg-blue-50 border-blue-100" },
    { icon: Users, title: "Clientes", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { icon: Crown, title: "Fidelización", color: "text-amber-600 bg-amber-50 border-amber-100" },
    { icon: Bell, title: "Recordatorios", color: "text-rose-600 bg-rose-50 border-rose-100" },
    { icon: Star, title: "Reseñas", color: "text-orange-600 bg-orange-50 border-orange-100" },
    { icon: WalletCards, title: "Caja", color: "text-cyan-600 bg-cyan-50 border-cyan-100" },
    { icon: BarChart3, title: "Estadísticas", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { icon: TrendingUp, title: "Marketing", color: "text-pink-600 bg-pink-50 border-pink-100" },
    { icon: Clock, title: "Sala de espera", color: "text-teal-600 bg-teal-50 border-teal-100" },
    { icon: ReceiptText, title: "Inventario", color: "text-slate-600 bg-slate-50 border-slate-200" },
    { icon: Sparkles, title: "Studio IA", color: "text-purple-600 bg-purple-50 border-purple-100" },
  ];

  return (
    <section id="producto" className="bg-[#FAFAF7] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <FadeUp>
            <Eyebrow>Centro de control</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-5 text-[36px] font-black leading-tight tracking-tight text-[#111111] sm:text-[52px]">
              Un panel.{" "}
              <span className="bg-gradient-to-r from-[#C9922A] to-[#D4AF37] bg-clip-text text-transparent">
                Todo tu negocio.
              </span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.18}>
            <p className="mt-5 text-lg text-slate-600">
              BarberíaOS centraliza agenda, clientes, caja, barberos, reseñas y contenido.
              Sin integraciones, sin apps separadas, sin configuraciones técnicas.
            </p>
          </FadeUp>
        </div>

        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {modules.map((m, i) => (
            <FadeUp key={m.title} delay={(i % 6) * 0.05}>
              <div className="group flex flex-col items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)]">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${m.color}`}>
                  <m.icon size={18} />
                </div>
                <p className="text-[12px] font-black text-[#111111]">{m.title}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Studio IA Section ────────────────────────────────────────────────────────

function StudioIASection() {
  const features = [
    {
      icon: "🎬",
      title: "Reels de ofertas",
      desc: "Genera un reel listo para publicar en 60 segundos con tus promociones del día",
    },
    {
      icon: "↔️",
      title: "Videos antes/después",
      desc: "El formato más viral en barberías para mostrar transformaciones",
    },
    {
      icon: "⚡",
      title: "Promos de última hora",
      desc: "Llena huecos del día con contenido urgente que llama a la acción",
    },
    {
      icon: "📱",
      title: "Historias Instagram",
      desc: "Formato vertical optimizado para Stories y Reels automáticamente",
    },
    {
      icon: "⭐",
      title: "Videos de reseñas",
      desc: "Convierte opiniones positivas en contenido visual de confianza",
    },
    {
      icon: "📅",
      title: "Campañas semanales",
      desc: "Plan de contenido completo para toda la semana en un clic",
    },
    {
      icon: "💬",
      title: "Mensajes WhatsApp",
      desc: "Copies persuasivos listos para enviar a tus clientes directamente",
    },
    {
      icon: "🧴",
      title: "Promoción de productos",
      desc: "Muestra y vende productos de la barbería con contenido atractivo",
    },
    {
      icon: "💈",
      title: "Barbero destacado",
      desc: "Presenta a tu equipo y genera confianza con potenciales clientes",
    },
  ];

  return (
    <section id="studio" className="overflow-hidden bg-[#F6F3FF] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <FadeUp>
            <Eyebrow violet>
              <Sparkles size={11} />
              Studio IA — Módulo premium
            </Eyebrow>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-6 text-[34px] font-black leading-tight tracking-tight text-[#111111] sm:text-[48px]">
              Convierte huecos libres y reseñas<br />
              <span className="bg-gradient-to-r from-[#6D28D9] to-[#A78BFA] bg-clip-text text-transparent">
                en contenido para Instagram
              </span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mt-5 text-lg text-slate-600">
              Mientras otros sistemas solo gestionan tu agenda, BarberíaOS también crea contenido
              para llenar tus huecos. Reels, historias, promociones y campañas listos para publicar.
            </p>
          </FadeUp>
        </div>

        {/* Features grid */}
        <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FadeUp key={f.title} delay={i * 0.05}>
              <div className="group flex items-start gap-4 rounded-2xl border border-[#DDD6FE]/50 bg-white p-5 transition hover:border-[#A78BFA]/40 hover:shadow-[0_4px_20px_rgba(109,40,217,0.08)]">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="text-sm font-black text-[#111111]">{f.title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500">{f.desc}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Bottom CTA */}
        <FadeUp>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6D28D9] to-[#5B21B6] p-10 text-center text-white shadow-[0_20px_60px_rgba(109,40,217,0.25)]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(167,139,250,0.25)_0%,transparent_70%)]" />
              <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(196,181,253,0.15)_0%,transparent_70%)]" />
            </div>
            <div className="relative">
              <div className="mb-3 flex items-center justify-center gap-2">
                <Sparkles size={18} className="text-[#C4B5FD]" />
                <p className="text-[11px] font-black uppercase tracking-widest text-[#C4B5FD]">
                  Studio IA
                </p>
              </div>
              <h3 className="text-[28px] font-black leading-tight sm:text-[36px]">
                Mientras el cliente espera,<br />
                BarberíaOS vende por ti.
              </h3>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/70">
                No solo reservas. BarberíaOS te ayuda a atraer más clientes con contenido que
                genera confianza y llena huecos automáticamente.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href={DEMO_URL}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-[14px] font-black text-[#6D28D9] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Explorar Studio IA <ArrowRight size={14} />
                </Link>
                <Link
                  href="#precios"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-3.5 text-[14px] font-semibold text-white/80 transition hover:bg-white/20"
                >
                  Ver créditos por plan
                </Link>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    {
      n: "01",
      title: "Configuras en 5 minutos",
      body: "Añades nombre, servicios, horarios y barberos. Tu link de reservas queda activo al instante.",
      icon: Zap,
    },
    {
      n: "02",
      title: "Compartes tu QR o link",
      body: "En Instagram, Google, QR del mostrador o WhatsApp. Los clientes reservan solos.",
      icon: QrCode,
    },
    {
      n: "03",
      title: "El cliente reserva desde el móvil",
      body: "Sin descargar ninguna app. Elige barbero, servicio y hora en menos de 2 minutos.",
      icon: CalendarDays,
    },
    {
      n: "04",
      title: "Tú controlas todo desde el panel",
      body: "Agenda en tiempo real, caja del día, clientes, fidelización y estadísticas en un lugar.",
      icon: BarChart3,
    },
    {
      n: "05",
      title: "BarberíaOS trabaja por ti",
      body: "Recordatorios automáticos, recuperación de clientes perdidos y contenido con IA.",
      icon: Sparkles,
    },
  ];

  return (
    <section id="como-funciona" className="bg-white px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <FadeUp>
            <Eyebrow>Cómo funciona</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-5 text-[34px] font-black leading-tight text-[#111111] sm:text-[46px]">
              Operativo en menos de 30 minutos
            </h2>
          </FadeUp>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <FadeUp key={s.n} delay={i * 0.1}>
              <div className="group relative rounded-3xl border border-[#EAEAEA] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-[44px] font-black leading-none text-[#F0F0F0]">{s.n}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111111]">
                    <s.icon size={18} className="text-[#D4AF37]" />
                  </div>
                </div>
                <h3 className="mb-2.5 text-[15px] font-black text-[#111111]">{s.title}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500">{s.body}</p>
                {i < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block">
                    <ArrowRight size={16} className="text-slate-200" />
                  </div>
                )}
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.3}>
          <div className="mx-auto mt-16 max-w-2xl rounded-3xl border border-[#EAEAEA] bg-[#FAFAFA] p-10 text-center">
            <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
              Sin instalación · Sin contrato
            </p>
            <h3 className="mb-7 text-[22px] font-black text-[#111111]">
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

// ─── Beneficios económicos ────────────────────────────────────────────────────

function BeneficiosSection() {
  const benefits = [
    {
      icon: MessageCircle,
      number: "3h/día",
      title: "Menos WhatsApp",
      desc: "Reservas 24/7 sin atender mensajes. El cliente reserva solo.",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: CalendarDays,
      number: "+40%",
      title: "Agenda completa",
      desc: "Huecos libres visibles y convertibles en citas con un mensaje.",
      color: "text-blue-600 bg-blue-50",
    },
    {
      icon: Crown,
      number: "1 de 3",
      title: "Clientes que vuelven",
      desc: "Fidelización y recordatorios automáticos recuperan clientes inactivos.",
      color: "text-amber-600 bg-amber-50",
    },
    {
      icon: Star,
      number: "4.8+",
      title: "Más reseñas en Google",
      desc: "Flujo automático post-cita que multiplica tus valoraciones.",
      color: "text-orange-600 bg-orange-50",
    },
    {
      icon: Globe,
      number: "24/7",
      title: "Imagen profesional",
      desc: "Página pública y QR propio — reservas incluso cuando duermes.",
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      icon: BarChart3,
      number: "100%",
      title: "Control total",
      desc: "Dashboard con estadísticas en tiempo real. Cierra el día en 2 min.",
      color: "text-violet-600 bg-violet-50",
    },
  ];

  return (
    <section className="bg-[#FAFAF7] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <FadeUp>
            <Eyebrow>Por qué funciona</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-5 text-[34px] font-black leading-tight text-[#111111] sm:text-[46px]">
              Más reservas. Más control.{" "}
              <span className="bg-gradient-to-r from-[#C9922A] to-[#D4AF37] bg-clip-text text-transparent">
                Más ingresos.
              </span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.18}>
            <p className="mt-4 text-base text-slate-600">
              BarberíaOS no es solo una agenda — es un sistema completo para hacer crecer tu negocio.
            </p>
          </FadeUp>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <FadeUp key={b.title} delay={i * 0.08}>
              <div className="group rounded-2xl border border-slate-200/80 bg-white p-7 transition hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.09)]">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${b.color}`}
                  >
                    <b.icon size={18} />
                  </div>
                  <span className="text-[22px] font-black text-[#111111]">{b.number}</span>
                </div>
                <p className="mb-1.5 text-[15px] font-black text-[#111111]">{b.title}</p>
                <p className="text-[13px] leading-relaxed text-slate-500">{b.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Modules ─────────────────────────────────────────────────────────────────

function ModulesSection() {
  const mods = [
    {
      icon: CalendarDays,
      title: "Agenda inteligente",
      desc: "Día, semana, mes · filtro por barbero · línea de ahora en tiempo real",
      color: "text-violet-600 bg-violet-50 border-violet-100",
    },
    {
      icon: QrCode,
      title: "Reservas online + QR",
      desc: "Link y QR propios · sin comisión · desde cualquier canal",
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      icon: Users,
      title: "CRM de clientes",
      desc: "VIP, frecuente, perdido · historial completo · WhatsApp directo",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      icon: Crown,
      title: "Fidelización",
      desc: "Tarjeta de sellos digital · sin app para el cliente · automática",
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      icon: Bell,
      title: "Recordatorios",
      desc: "Email 24h antes de la cita · cero no-shows · sin configurar nada",
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
    {
      icon: WalletCards,
      title: "Caja del día",
      desc: "Cobros, método de pago, ticket medio · cierre en 2 minutos",
      color: "text-cyan-600 bg-cyan-50 border-cyan-100",
    },
    {
      icon: BarChart3,
      title: "Estadísticas",
      desc: "Ingresos, ocupación y rendimiento por barbero y servicio",
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      icon: Star,
      title: "Reseñas automáticas",
      desc: "Solicitud automática tras cada cita · sube tu rating en Google",
      color: "text-orange-600 bg-orange-50 border-orange-100",
    },
    {
      icon: TrendingUp,
      title: "Marketing",
      desc: "Campañas para llenar huecos · mensajes listos para copiar",
      color: "text-pink-600 bg-pink-50 border-pink-100",
    },
    {
      icon: Clock,
      title: "Sala de espera",
      desc: "Pantalla de turno para tu barbería · experiencia profesional",
      color: "text-teal-600 bg-teal-50 border-teal-100",
    },
    {
      icon: ShieldCheck,
      title: "Seguridad RGPD",
      desc: "Datos tuyos · RGPD · sin acceso de terceros a tu agenda",
      color: "text-slate-600 bg-slate-50 border-slate-200",
    },
    {
      icon: Sparkles,
      title: "Studio IA",
      desc: "Reels, historias y campañas generados por inteligencia artificial",
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
  ];

  return (
    <section className="bg-white px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <FadeUp>
            <Eyebrow>Todo incluido</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-5 text-[34px] font-black leading-tight text-[#111111] sm:text-[46px]">
              12 herramientas en un solo panel
            </h2>
          </FadeUp>
          <FadeUp delay={0.18}>
            <p className="mt-4 text-base text-slate-600">
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

// ─── Comparación Sin/Con ──────────────────────────────────────────────────────

function ComparacionSection() {
  const rows = [
    { sin: "WhatsApp todo el día para reservas", con: "Reservas 24/7 totalmente automáticas" },
    { sin: "Agenda en papel o notas desorganizadas", con: "Panel digital en tiempo real por barbero" },
    { sin: "Clientes que se olvidan de venir", con: "Recordatorio automático 24h antes" },
    { sin: "Clientes que desaparecen sin aviso", con: "Fidelización y reactivación automática" },
    { sin: "Pocas o ninguna reseña en Google", con: "Flujo post-cita que multiplica valoraciones" },
    { sin: "Instagram vacío semanas seguidas", con: "Contenido generado por IA en minutos" },
    { sin: "Cierre de caja a ciegas", con: "Dashboard con estadísticas en tiempo real" },
  ];

  return (
    <section className="bg-[#FAFAF7] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <FadeUp>
            <Eyebrow>La diferencia</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-5 text-[34px] font-black leading-tight text-[#111111] sm:text-[46px]">
              Tu barbería con BarberíaOS vs. sin él
            </h2>
          </FadeUp>
        </div>

        <FadeIn delay={0.1}>
          <div className="overflow-hidden rounded-3xl border border-[#EAEAEA] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            {/* Header */}
            <div className="grid grid-cols-2 border-b border-[#EAEAEA]">
              <div className="flex items-center gap-2.5 border-r border-[#EAEAEA] px-6 py-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100">
                  <X size={14} className="text-red-500" />
                </div>
                <span className="text-[13px] font-black text-slate-500 uppercase tracking-wide">
                  Sin BarberíaOS
                </span>
              </div>
              <div className="flex items-center gap-2.5 px-6 py-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                  <Check size={14} className="text-emerald-600" />
                </div>
                <span className="text-[13px] font-black text-[#111111] uppercase tracking-wide">
                  Con BarberíaOS
                </span>
              </div>
            </div>

            {/* Rows */}
            {rows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-2 ${i < rows.length - 1 ? "border-b border-[#F0F0F0]" : ""}`}
              >
                <div className="flex items-center gap-3 border-r border-[#F0F0F0] px-6 py-4">
                  <X size={13} className="shrink-0 text-red-400" />
                  <p className="text-[13px] leading-relaxed text-slate-500">{row.sin}</p>
                </div>
                <div className="flex items-center gap-3 bg-[#F8FFF8] px-6 py-4">
                  <Check size={13} className="shrink-0 text-emerald-500" />
                  <p className="text-[13px] font-semibold leading-relaxed text-[#111111]">
                    {row.con}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeUp delay={0.2}>
          <div className="mt-10 text-center">
            <Link
              href={DEMO_URL}
              className="inline-flex min-h-[52px] items-center gap-2.5 rounded-2xl bg-[#D4AF37] px-10 text-[15px] font-black text-[#111111] shadow-[0_8px_32px_rgba(212,175,55,0.35)] transition hover:-translate-y-0.5 hover:bg-[#E8C547]"
            >
              Quiero BarberíaOS para mi barbería <ArrowRight size={17} />
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

function PricingSection() {
  const plans = [
    {
      name: "Básico",
      price: "39",
      oferta: "29",
      highlight: "Para empezar",
      desc: "Reservas, agenda, clientes y QR. Todo lo que necesitas para arrancar.",
      featured: false,
      studioCredits: "1 crédito Studio IA/mes",
      features: [
        "Agenda — día, semana, barbero",
        "Reservas online sin comisión",
        "Clientes — historial y ficha",
        "QR imprimible de reservas",
        "Página pública de tu barbería",
        "Recordatorios 24h automáticos",
        "Caja del día",
        "Fidelización básica",
        "1 crédito Studio IA al mes",
      ],
    },
    {
      name: "Pro",
      price: "79",
      oferta: "59",
      highlight: "Más popular",
      desc: "Control total, fidelización avanzada y Studio IA. El favorito de los dueños.",
      featured: true,
      studioCredits: "5 créditos Studio IA/mes",
      features: [
        "Todo lo del plan Básico, más:",
        "Inventario y venta de productos",
        "Caja avanzada + cierre de sesión",
        "Estadísticas por barbero",
        "Fidelización avanzada con puntos",
        "Reseñas automáticas en Google",
        "Sala de espera básica",
        "5 créditos Studio IA al mes",
      ],
    },
    {
      name: "Elite",
      price: "149",
      oferta: "99",
      highlight: "Plan estrella",
      desc: "El ecosistema completo para barberías premium que quieren crecer en serio.",
      featured: false,
      studioCredits: "50 créditos Studio IA/mes",
      features: [
        "Todo lo del plan Pro, más:",
        "Web premium con SEO local incluida",
        "Campañas Instagram, TikTok y WhatsApp",
        "Sala de espera premium",
        "Inventario conectado a caja",
        "Reportes de ventas y productos",
        "50 créditos Studio IA al mes",
        "Soporte prioritario",
      ],
    },
  ];

  return (
    <section id="precios" className="bg-white px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-6 max-w-2xl text-center">
          <FadeUp>
            <Eyebrow>Precios</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-5 text-[34px] font-black leading-tight text-[#111111] sm:text-[46px]">
              Sin comisiones. Sin sorpresas.
            </h2>
          </FadeUp>
          <FadeUp delay={0.18}>
            <p className="mt-4 text-base text-slate-600">
              Cuota mensual fija. Cancela cuando quieras. Todos tus datos son siempre tuyos.
            </p>
          </FadeUp>
        </div>

        {/* Launch offer banner */}
        <FadeUp delay={0.2}>
          <div className="mb-10 rounded-2xl border border-[#D4AF37]/30 bg-[#FFFBEB] px-6 py-4 text-center">
            <p className="text-sm font-black text-[#92650A]">
              Oferta de lanzamiento — Los 3 primeros meses al precio especial. Sin permanencia.
            </p>
          </div>
        </FadeUp>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <FadeUp key={plan.name} delay={i * 0.1}>
              <div
                className={`relative flex h-full flex-col rounded-3xl border p-8 transition hover:-translate-y-1 ${
                  plan.featured
                    ? "border-[#111111] bg-[#111111] shadow-[0_20px_60px_rgba(17,17,17,0.22)]"
                    : plan.name === "Elite"
                      ? "border-[#A78BFA]/40 bg-white shadow-[0_4px_20px_rgba(109,40,217,0.06)] hover:shadow-[0_12px_40px_rgba(109,40,217,0.12)]"
                      : "border-[#EAEAEA] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37] px-4 py-1.5 text-[11px] font-black text-[#111111]">
                      <Star size={11} className="fill-current" /> {plan.highlight}
                    </span>
                  </div>
                )}
                {plan.name === "Elite" && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6D28D9] px-4 py-1.5 text-[11px] font-black text-white">
                      <Sparkles size={11} /> {plan.highlight}
                    </span>
                  </div>
                )}

                <div>
                  <p
                    className={`text-[11px] font-black uppercase tracking-widest ${
                      plan.featured
                        ? "text-[#D4AF37]"
                        : plan.name === "Elite"
                          ? "text-[#7C3AED]"
                          : "text-slate-400"
                    }`}
                  >
                    {plan.highlight}
                  </p>
                  <p
                    className={`mt-1 text-xl font-black ${plan.featured ? "text-white" : "text-[#111111]"}`}
                  >
                    {plan.name}
                  </p>

                  <div className="mt-4 flex items-end gap-2">
                    <span
                      className={`text-4xl font-black tabular-nums ${plan.featured ? "text-white" : "text-[#111111]"}`}
                    >
                      {plan.oferta}€
                    </span>
                    <span
                      className={`mb-1.5 text-sm ${plan.featured ? "text-white/40" : "text-slate-400"}`}
                    >
                      /mes
                    </span>
                    <span
                      className={`mb-1.5 text-sm line-through ${plan.featured ? "text-white/25" : "text-slate-300"}`}
                    >
                      {plan.price}€
                    </span>
                  </div>
                  <p
                    className={`mt-0.5 text-[11px] font-semibold ${plan.featured ? "text-[#D4AF37]/80" : "text-emerald-600"}`}
                  >
                    3 meses · luego {plan.price}€/mes
                  </p>
                  <p
                    className={`mt-2 text-[13px] ${plan.featured ? "text-white/55" : "text-slate-500"}`}
                  >
                    {plan.desc}
                  </p>

                  {/* Studio IA credits badge */}
                  <div
                    className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black ${
                      plan.name === "Elite"
                        ? "bg-[#6D28D9]/10 text-[#6D28D9]"
                        : plan.featured
                          ? "bg-[#A78BFA]/20 text-[#C4B5FD]"
                          : "bg-violet-50 text-violet-700"
                    }`}
                  >
                    <Sparkles size={10} />
                    {plan.studioCredits}
                  </div>
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
                      <div
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${plan.featured ? "bg-[#D4AF37]" : "bg-[#111111]"}`}
                      >
                        <Check
                          size={8}
                          className={plan.featured ? "text-[#111111]" : "text-white"}
                        />
                      </div>
                      <span
                        className={`text-[13px] leading-relaxed ${plan.featured ? "text-white/75" : "text-slate-600"}`}
                      >
                        {f}
                      </span>
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
            <Link
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#111111] underline underline-offset-2 hover:text-[#D4AF37]"
            >
              Hablamos por WhatsApp
            </Link>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Testimonials (fondo claro) ───────────────────────────────────────────────

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Antes gestionaba todo por WhatsApp y siempre había algún malentendido. Ahora los clientes reservan solos y yo veo la agenda limpia desde el móvil.",
      name: "Óscar M.",
      role: "Dueño · Barbería & Co.",
      city: "Madrid",
      initial: "O",
      metric: "+8 reservas/semana",
      color: "#6366F1",
    },
    {
      quote:
        "Ver los huecos libres en tiempo real me cambió la cabeza. Antes los perdía sin darme cuenta. Ahora mando un mensaje y los lleno en minutos.",
      name: "Rafa P.",
      role: "Barbero principal · The Fade Room",
      city: "Barcelona",
      initial: "R",
      metric: "380€/mes recuperados",
      color: "#10B981",
    },
    {
      quote:
        "La caja del día antes era un lío de notas. Ahora cierro en 2 minutos y sé exactamente qué entró y qué barbero rindió mejor esta semana.",
      name: "Javi L.",
      role: "Dueño · Corte & Barba",
      city: "Sevilla",
      initial: "J",
      metric: "4.9 estrellas en Google",
      color: "#F59E0B",
    },
  ];

  return (
    <section className="bg-[#FAFAF7] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <FadeUp>
            <Eyebrow>Testimonios</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-5 text-[34px] font-black leading-tight text-[#111111] sm:text-[46px]">
              Lo que dicen los dueños de barberías
            </h2>
          </FadeUp>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
                {/* Stars */}
                <div className="mb-5 flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="flex-1 text-[15px] leading-relaxed text-slate-600">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Metric */}
                <div className="mt-6 rounded-2xl border border-[#D4AF37]/20 bg-[#FFFBEB] px-4 py-3">
                  <p className="text-[18px] font-black text-[#111111]">{t.metric}</p>
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
                    <p className="text-[14px] font-black text-[#111111]">{t.name}</p>
                    <p className="text-[12px] text-slate-400">
                      {t.role} · {t.city}
                    </p>
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
    {
      q: "¿Necesito conocimientos técnicos para usar BarberíaOS?",
      a: "No. BarberíaOS está diseñado para dueños de barberías, no para técnicos. La configuración inicial tarda menos de 30 minutos y tienes soporte por WhatsApp si necesitas ayuda.",
    },
    {
      q: "¿Mis clientes tienen que instalar una app?",
      a: "No. Reservan desde cualquier navegador — desde tu link, QR, Instagram o Google Business. Sin descargas ni registros de ningún tipo.",
    },
    {
      q: "¿Puedo poner mi QR en la puerta de la barbería?",
      a: "Sí. Cada barbería tiene su propio QR único e imprimible. Ponlo en la puerta, en el mostrador, en tarjetas o en Instagram — los clientes escanean y reservan en 2 minutos.",
    },
    {
      q: "¿Puedo recibir reservas desde Instagram y Google?",
      a: "Sí. Compartes tu link de reservas en la bio de Instagram, en tu ficha de Google Business y por WhatsApp. Sin configuraciones avanzadas.",
    },
    {
      q: "¿Puedo gestionar varios barberos?",
      a: "Sí. Cada barbero tiene su horario propio, agenda individual y estadísticas. Los planes Pro y Elite permiten equipos sin límite de barberos.",
    },
    {
      q: "¿El plan Elite incluye página web?",
      a: "Sí. El plan Elite incluye una web premium con SEO local optimizado para que tu barbería aparezca en Google cuando alguien busca barberías en tu ciudad.",
    },
    {
      q: "¿BarberíaOS cobra comisión por cada reserva?",
      a: "No. Cuota mensual fija. Tus reservas, clientes y datos son siempre tuyos. Sin sorpresas ni cargos ocultos.",
    },
    {
      q: "¿Puedo cancelar cuando quiera?",
      a: "Sí. Sin permanencia, sin penalizaciones, sin preguntas. Puedes cancelar desde el panel en cualquier momento.",
    },
  ];

  return (
    <section className="bg-white px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-14 text-center">
          <FadeUp>
            <Eyebrow>FAQ</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mt-5 text-[34px] font-black leading-tight text-[#111111] sm:text-[46px]">
              Todo lo que necesitas saber
            </h2>
          </FadeUp>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <FadeUp key={i} delay={i * 0.04}>
              <div
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  open === i ? "border-[#111111]" : "border-[#EAEAEA] hover:border-[#D4D4D4]"
                }`}
              >
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
                    <p className="text-[14px] leading-relaxed text-slate-600">{faq.a}</p>
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

// ─── Final CTA (elegante, no oscuro pesado) ───────────────────────────────────

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#111827] px-5 py-28 lg:px-8 lg:py-36">
      {/* Background glow dorado */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(212,175,55,0.12)_0%,transparent_65%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <FadeUp>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-[#D4AF37]">
            Empieza hoy · Sin tarjeta de crédito
          </span>
        </FadeUp>
        <FadeUp delay={0.08}>
          <h2 className="text-[40px] font-black leading-[1.06] tracking-tight text-white sm:text-[56px] lg:text-[68px]">
            Convierte tu barbería<br />
            en un negocio moderno,{" "}
            <span className="bg-gradient-to-r from-[#FFF59C] via-[#F5D76E] to-[#C9A227] bg-clip-text text-transparent">
              organizado y rentable
            </span>
          </h2>
        </FadeUp>
        <FadeUp delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60">
            Sin permanencia. Sin comisiones. Con soporte real.
            Solicita una demo gratuita y recibe tu primera reserva hoy.
          </p>
        </FadeUp>

        <FadeUp delay={0.24}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={DEMO_URL}
              className="inline-flex min-h-[58px] items-center justify-center gap-2.5 rounded-2xl bg-[#D4AF37] px-11 text-[15px] font-black text-[#111111] shadow-[0_8px_40px_rgba(212,175,55,0.40)] transition hover:-translate-y-0.5 hover:bg-[#E8C547] hover:shadow-[0_14px_50px_rgba(212,175,55,0.50)] active:scale-[0.98]"
            >
              Reservar demo gratuita <ArrowRight size={18} />
            </Link>
            <Link
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[58px] items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.06] px-11 text-[15px] font-semibold text-white/75 backdrop-blur transition hover:bg-white/[0.10] hover:text-white"
            >
              <MessageCircle size={17} className="text-emerald-400" />
              Hablar por WhatsApp
            </Link>
          </div>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-white/35">
            {[
              "Sin comisión por reserva",
              "Sin permanencia",
              "Sin app para el cliente",
              "Operativo en 30 min",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check size={12} className="text-[#D4AF37]" />
                {t}
              </span>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const nav = [
    { label: "Producto", href: "#producto" },
    { label: "Precios", href: "#precios" },
    { label: "Studio IA", href: "#studio" },
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Solicitar demo", href: DEMO_URL },
    { label: "Acceder", href: LOGIN_URL },
    { label: "Privacidad", href: "/legal/privacidad" },
    { label: "Términos", href: "/legal/terminos" },
  ];

  return (
    <footer className="border-t border-[#EAEAEA] bg-[#FAFAF7] px-5 py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" aria-label="BarberíaOS">
              <BarberiaOSLogo variant="full" size={32} showText tone="light" />
            </Link>
            <p className="mt-2 max-w-xs text-[12px] text-slate-400">
              Software para barberías modernas. Reservas, agenda, clientes, caja y Studio IA.
            </p>
          </div>
          <nav className="flex flex-wrap justify-start gap-x-6 gap-y-2 text-[13px] text-slate-500 sm:justify-end">
            {nav.map((l) => (
              <Link key={l.label} href={l.href} className="transition hover:text-[#111111]">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <GoldDivider />
        <div className="mt-6 flex flex-col items-center justify-between gap-2 text-center sm:flex-row">
          <p className="text-[12px] text-slate-400">
            © {new Date().getFullYear()} BarberíaOS · Software para barberías · Hecho en España
          </p>
          <div className="flex items-center gap-1.5 text-[12px] text-slate-400">
            <Scissors size={11} className="text-[#D4AF37]" />
            <span>Creado para los mejores barberos</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function SquirePremiumLanding() {
  return (
    <div className="min-h-screen bg-white antialiased">
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <ProblemSection />
        <SolucionSection />
        <StudioIASection />
        <HowItWorksSection />
        <BeneficiosSection />
        <ModulesSection />
        <ComparacionSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
