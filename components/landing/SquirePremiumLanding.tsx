"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Crown,
  Instagram,
  MessageCircle,
  QrCode,
  ReceiptText,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
  WalletCards,
  Bell,
} from "lucide-react";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";
import { BarberiaOSLogo } from "@/components/brand/BarberiaOSLogo";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEMO_URL = "/pedir-demo";
const WHATSAPP_URL = BUSINESS_CONFIG.whatsappUrl;

// ─── Data ─────────────────────────────────────────────────────────────────────

const problems = [
  {
    icon: MessageCircle,
    title: "Reservas por WhatsApp",
    desc: "Mensajes dispersos, confirmaciones olvidadas y dobles reservas que nadie quiere gestionar a las 10 de la noche.",
  },
  {
    icon: CalendarDays,
    title: "Doble reserva",
    desc: "Dos clientes, un mismo barbero, mismo horario. La conversación incómoda en mostrador que todos reconocen.",
  },
  {
    icon: Clock3,
    title: "Huecos invisibles",
    desc: "Franjas libres que nadie ve y que podrían convertirse en reservas — y en dinero — hoy mismo.",
  },
  {
    icon: Users,
    title: "Clientes que no vuelven",
    desc: "Sin historial ni seguimiento, el cliente satisfecho desaparece y nadie sabe cuándo fue la última vez que estuvo.",
  },
  {
    icon: WalletCards,
    title: "Caja sin control",
    desc: "Servicios, productos, efectivo y bizum sin una lectura clara del día. El cierre se convierte en adivinar.",
  },
];

const modules = [
  {
    icon: CalendarDays,
    title: "Agenda inteligente",
    desc: "Vista día, semana y mes. Filtro por barbero, línea de ahora y huecos libres destacados.",
    color: "bg-amber-50 text-amber-700 border-amber-100",
  },
  {
    icon: QrCode,
    title: "Reservas online",
    desc: "Link y QR propios. Tus clientes reservan desde Instagram, Google o WhatsApp. Sin comisión.",
    color: "bg-blue-50 text-blue-700 border-blue-100",
  },
  {
    icon: Users,
    title: "Gestión de clientes",
    desc: "Historial, última visita, segmentación VIP, frecuente y perdido. CRM real para barberías.",
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    icon: Crown,
    title: "Fidelización",
    desc: "Tarjeta de sellos digital. Tus clientes acumulan visitas y tú consigues que vuelvan solos.",
    color: "bg-purple-50 text-purple-700 border-purple-100",
  },
  {
    icon: Bell,
    title: "Recordatorios 24h",
    desc: "Email automático el día anterior. Cero no-shows. Sin configurar nada.",
    color: "bg-rose-50 text-rose-700 border-rose-100",
  },
  {
    icon: WalletCards,
    title: "Caja del día",
    desc: "Registra cobros, cierra el día y exporta datos para contabilidad. Todo en 2 minutos.",
    color: "bg-cyan-50 text-cyan-700 border-cyan-100",
  },
  {
    icon: BarChart3,
    title: "Reportes",
    desc: "Ingresos por barbero, servicio más vendido, ticket medio y ocupación semanal de un vistazo.",
    color: "bg-violet-50 text-violet-700 border-violet-100",
  },
  {
    icon: Star,
    title: "Reseñas",
    desc: "Activa solicitudes automáticas de reseña al finalizar cada cita. Sube tu rating en Google.",
    color: "bg-orange-50 text-orange-700 border-orange-100",
  },
];

const journeySteps = [
  { icon: Instagram, label: "Instagram / QR / Google", desc: "El cliente ve tu link" },
  { icon: CalendarDays, label: "Elige fecha y barbero", desc: "En 60 segundos" },
  { icon: ShieldCheck, label: "Confirmación por email", desc: "Automática" },
  { icon: Star, label: "Visita a la barbería", desc: "Recordatorio 24h antes" },
  { icon: Star, label: "Solicitud de reseña", desc: "Automática al salir" },
];

const plans = [
  {
    name: "Inicio",
    price: "39",
    desc: "Para ordenar tu barbería desde el primer día.",
    highlight: "Ideal para 1–2 barberos",
    featured: false,
    features: [
      "Agenda — día, semana y barbero",
      "Reservas online — link y QR propios",
      "Clientes — historial y ficha completa",
      "Caja del día — cobros y cierre",
      "QR imprimible para mostrador",
      "Página pública de reservas",
      "Recordatorios 24h automáticos",
    ],
  },
  {
    name: "Profesional",
    price: "79",
    desc: "Control total, crecimiento y sin perder un cliente.",
    highlight: "El más elegido — 3–5 barberos",
    featured: true,
    features: [
      "Todo lo del plan Inicio, más:",
      "Inventario y ventas de productos",
      "Finanzas — ingresos y gastos",
      "Estadísticas por barbero y servicio",
      "Marketing Studio — campañas",
      "Reseñas automáticas en Google",
      "Fidelización con tarjeta de sellos",
      "Automatizaciones y recordatorios",
    ],
  },
  {
    name: "Elite",
    price: "149",
    desc: "Infraestructura completa para escalar.",
    highlight: "Para barberías en expansión",
    featured: false,
    features: [
      "Todo lo del plan Profesional, más:",
      "Web premium con SEO local",
      "Marketing digital gestionado",
      "Automatizaciones avanzadas",
      "IA del dueño — análisis y sugerencias",
      "Soporte prioritario",
      "Onboarding personalizado",
    ],
  },
];

const testimonials = [
  {
    quote: "Antes gestionaba todo por WhatsApp y siempre había algún malentendido. Ahora los clientes reservan directamente y yo veo la agenda limpia desde el móvil.",
    name: "Óscar M.",
    role: "Dueño · Barbería & Co.",
    city: "Madrid",
    initial: "O",
    metric: "+8 reservas",
    metricSub: "por semana",
  },
  {
    quote: "Lo que más me ha cambiado es ver los huecos libres en tiempo real. Antes los perdía sin darme cuenta. Ahora puedo enviar un mensaje y llenarlos en minutos.",
    name: "Rafa P.",
    role: "Barbero principal · The Fade Room",
    city: "Barcelona",
    initial: "R",
    metric: "380€/mes",
    metricSub: "recuperados en huecos",
  },
  {
    quote: "La caja del día antes era un lío de notas. Ahora cierro en 2 minutos y sé exactamente qué entró y qué barbero rindió mejor esta semana.",
    name: "Javi L.",
    role: "Dueño · Corte & Barba",
    city: "Sevilla",
    initial: "J",
    metric: "4.9 ★",
    metricSub: "Google en 3 meses",
  },
];

const faqs = [
  {
    q: "¿Mis clientes tienen que instalar una app?",
    a: "No. Reservan desde cualquier navegador — desde tu link, QR, Instagram o Google Business. Sin descargas ni registros.",
  },
  {
    q: "¿BarberíaOS cobra comisión por cada reserva?",
    a: "No. Funciona con cuota mensual fija. Tus reservas, clientes y datos son siempre tuyos. Sin sorpresas.",
  },
  {
    q: "¿Cuánto tarda en estar operativo?",
    a: "Menos de 30 minutos. Creas tu barbería, añades servicios y barberos y ya tienes tu link de reservas activo.",
  },
  {
    q: "¿Qué pasa si quiero cambiar de plan?",
    a: "Puedes subir o bajar de plan en cualquier momento. Sin permanencia ni penalizaciones.",
  },
  {
    q: "¿Funciona para barberías con varios barberos?",
    a: "Sí. Cada barbero tiene su horario, agenda propia y estadísticas individuales. Escala sin límite de equipo en los planes superiores.",
  },
  {
    q: "¿Incluye web para mi barbería?",
    a: "El plan Elite incluye una web premium con SEO local, WhatsApp, QR y BarberíaOS conectado. Los planes Inicio y Profesional incluyen página pública de reservas.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function GoldBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#D4AF37]/30 bg-[#FFFBEB] px-3 py-1 text-xs font-black uppercase tracking-widest text-[#92650A]">
      {children}
    </span>
  );
}

function CTAPrimary({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#111111] px-8 text-sm font-black text-white shadow-[0_4px_24px_rgba(17,17,17,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(17,17,17,0.24)] active:scale-[0.98] ${className}`}
    >
      {children}
    </Link>
  );
}

function CTAGold({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-[#D4AF37]/40 bg-[#FFFBEB] px-8 text-sm font-black text-[#92650A] transition hover:-translate-y-0.5 hover:border-[#D4AF37]/60 hover:bg-[#FEF9EE] active:scale-[0.98] ${className}`}
    >
      {children}
    </Link>
  );
}

// ─── Dashboard Mockup ─────────────────────────────────────────────────────────

function DashboardMockup() {
  const stats = [
    { label: "Ingresos hoy", value: "284€", change: "+12%", up: true },
    { label: "Reservas activas", value: "9", change: "+3 vs ayer", up: true },
    { label: "Clientes nuevos", value: "4", change: "Este mes", up: true },
    { label: "Ocupación", value: "87%", change: "+6 pts", up: true },
  ];

  const appointments = [
    { time: "09:00", name: "Carlos R.", service: "Degradado + barba", barber: "Miguel", status: "confirmed" },
    { time: "10:00", name: "Adrián M.", service: "Corte clásico", barber: "Sergio", status: "confirmed" },
    { time: "10:30", name: "Pablo S.", service: "Corte + beard line", barber: "Miguel", status: "scheduled" },
    { time: "11:30", name: "—", service: "Hueco libre · 60 min", barber: "Sergio", status: "free" },
    { time: "12:00", name: "Jorge T.", service: "Afeitado clásico", barber: "Miguel", status: "scheduled" },
  ];

  return (
    <div className="pointer-events-none select-none overflow-hidden rounded-[20px] border border-[#EAEAEA] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.10),0_8px_32px_rgba(0,0,0,0.06)]">
      {/* Top bar */}
      <div className="flex items-center gap-2 border-b border-[#F0F0F0] bg-[#FAFAFA] px-5 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <div className="mx-auto flex items-center gap-2 rounded-lg border border-[#EAEAEA] bg-white px-4 py-1 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          barberiaos.com/dashboard
        </div>
      </div>

      {/* Dashboard content */}
      <div className="flex">
        {/* Sidebar mini */}
        <div className="hidden w-14 flex-col items-center gap-4 border-r border-[#F0F0F0] py-5 sm:flex">
          {[CalendarDays, Users, WalletCards, BarChart3, QrCode].map((Icon, i) => (
            <div
              key={i}
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${i === 0 ? "bg-[#111111] text-white" : "text-slate-300"}`}
            >
              <Icon size={16} />
            </div>
          ))}
        </div>

        {/* Main area */}
        <div className="flex-1 p-5">
          {/* Stats row */}
          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-[#EAEAEA] bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{s.label}</p>
                <p className="mt-1 text-2xl font-black tabular-nums text-slate-900">{s.value}</p>
                <p className={`mt-0.5 text-[11px] font-bold ${s.up ? "text-emerald-600" : "text-red-500"}`}>{s.change}</p>
              </div>
            ))}
          </div>

          {/* Appointments list */}
          <div className="rounded-2xl border border-[#EAEAEA] bg-white overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <div className="border-b border-[#F0F0F0] px-4 py-3">
              <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">Agenda de hoy — Miércoles 4 junio</p>
            </div>
            <div className="divide-y divide-[#F8F8F8]">
              {appointments.map((a) => (
                <div key={a.time} className={`flex items-center gap-3 px-4 py-3 ${a.status === "free" ? "bg-amber-50/40" : ""}`}>
                  <span className="w-10 shrink-0 text-xs font-black tabular-nums text-slate-400">{a.time}</span>
                  <div
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      a.status === "confirmed" ? "bg-emerald-400" :
                      a.status === "free" ? "bg-amber-400" : "bg-slate-300"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-[12px] font-black ${a.status === "free" ? "text-amber-700" : "text-slate-900"}`}>
                      {a.name !== "—" ? a.name : "Hueco libre"}
                    </p>
                    <p className="truncate text-[11px] text-slate-400">{a.service}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-slate-100 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                    {a.barber}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#EAEAEA] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 lg:px-8">
        <Link href="/" aria-label="BarberíaOS — inicio">
          <BarberiaOSLogo variant="full" size={36} showText tone="light" />
        </Link>

        <nav className="hidden items-center gap-7 text-[13px] font-semibold text-slate-600 md:flex">
          <Link href="#funcionalidades" className="transition hover:text-[#111111]">Funcionalidades</Link>
          <Link href="#como-funciona" className="transition hover:text-[#111111]">Cómo funciona</Link>
          <Link href="#precios" className="transition hover:text-[#111111]">Precios</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={BUSINESS_CONFIG.loginUrl}
            className="hidden text-[13px] font-bold text-slate-600 transition hover:text-[#111111] md:block"
          >
            Acceder
          </Link>
          <Link
            href={DEMO_URL}
            className="inline-flex min-h-[38px] items-center justify-center rounded-xl bg-[#111111] px-5 text-[13px] font-black text-white shadow-[0_2px_10px_rgba(17,17,17,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_4px_18px_rgba(17,17,17,0.22)]"
          >
            Solicitar demo
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="overflow-hidden bg-white px-5 pb-16 pt-20 lg:px-8 lg:pb-24 lg:pt-28">
      <div className="mx-auto max-w-6xl">
        {/* Top badge */}
        <div className="mb-8 flex justify-center">
          <GoldBadge>Software para barberías · Sin comisión por reserva</GoldBadge>
        </div>

        {/* Headline */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-[40px] font-black leading-[1.08] tracking-tight text-[#111111] sm:text-[52px] lg:text-[64px]">
            Gestiona tu barbería<br />
            <span className="text-[#D4AF37]">como un negocio profesional.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500 lg:text-xl">
            Reservas online, agenda, clientes, fidelización, caja y crecimiento en una sola plataforma.
            Tus clientes reservan desde Instagram, QR o Google — tú controlas todo desde el panel.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <CTAPrimary href={DEMO_URL}>
            Solicitar demo gratuita <ArrowRight size={16} />
          </CTAPrimary>
          <CTAGold href="#como-funciona">
            Ver cómo funciona
          </CTAGold>
        </div>

        {/* Trust bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-slate-400">
          {["Sin comisión por reserva", "Sin app para el cliente", "Activo en 30 minutos", "Sin permanencia"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <Check size={13} className="text-emerald-500" />
              {t}
            </span>
          ))}
        </div>

        {/* Dashboard mockup */}
        <div className="mx-auto mt-16 max-w-5xl">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

// ─── Social Proof Bar ─────────────────────────────────────────────────────────

function SocialProofBar() {
  const stats = [
    { value: "+500", label: "barberías activas" },
    { value: "98%", label: "satisfacción del cliente" },
    { value: "4.9★", label: "valoración media Google" },
    { value: "0€", label: "comisión por reserva" },
  ];

  return (
    <section className="border-y border-[#EAEAEA] bg-[#FAFAFA] px-5 py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="mb-8 text-center text-[11px] font-black uppercase tracking-widest text-slate-400">
          Barberías que ya usan BarberíaOS
        </p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-[#111111]">{s.value}</p>
              <p className="mt-1 text-[13px] text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Problem Section ──────────────────────────────────────────────────────────

function ProblemSection() {
  return (
    <section className="bg-white px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <GoldBadge>El problema</GoldBadge>
          <h2 className="mt-5 text-[32px] font-black leading-tight text-[#111111] sm:text-[40px]">
            ¿Reconoces alguno de estos problemas?
          </h2>
          <p className="mt-4 text-base text-slate-500 lg:text-lg">
            El 78% de las barberías aún gestionan sus reservas por WhatsApp. Cada día pierden tiempo, dinero y clientes sin saberlo.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <div
              key={p.title}
              className="group rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-[0_1px_6px_rgba(0,0,0,0.04)] transition hover:border-red-100 hover:shadow-[0_4px_20px_rgba(239,68,68,0.06)]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <p.icon size={20} />
              </div>
              <h3 className="mb-2 text-base font-black text-[#111111]">{p.title}</h3>
              <p className="text-[14px] leading-relaxed text-slate-500">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Solution Strip ───────────────────────────────────────────────────────────

function SolutionStrip() {
  return (
    <section className="bg-[#111111] px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <GoldBadge>La solución</GoldBadge>
            <h2 className="mt-5 text-[32px] font-black leading-tight text-white sm:text-[40px]">
              Todo lo que necesita tu barbería,{" "}
              <span className="text-[#D4AF37]">en un solo lugar.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-400 lg:text-lg">
              BarberíaOS une reservas, agenda, caja, clientes, fidelización, marketing e informes en un panel operativo diseñado para barberías reales.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Tus clientes reservan sin llamar ni escribir",
                "Tú ves la agenda y la caja en tiempo real",
                "Los clientes reciben confirmación y recordatorio automático",
                "Ningún hueco libre pasa desapercibido",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]">
                    <Check size={11} className="text-[#111111]" />
                  </div>
                  <p className="text-[14px] text-slate-300">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Link
                href={DEMO_URL}
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-8 text-sm font-black text-[#111111] shadow-[0_4px_20px_rgba(212,175,55,0.30)] transition hover:-translate-y-0.5 hover:bg-[#E8C547] active:scale-[0.98]"
              >
                Solicitar demo gratuita <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Solution visual */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: CalendarDays, title: "Agenda online", value: "Hoy: 9 citas" },
              { icon: TrendingUp, title: "Ingresos del mes", value: "+22% vs anterior" },
              { icon: Users, title: "Clientes activos", value: "147 registrados" },
              { icon: Crown, title: "Fidelización", value: "38 tarjetas activas" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">
                  <item.icon size={18} className="text-[#D4AF37]" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">{item.title}</p>
                <p className="mt-1 text-[15px] font-black text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Modules Grid ─────────────────────────────────────────────────────────────

function ModulesSection() {
  return (
    <section id="funcionalidades" className="bg-[#FAFAFA] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <GoldBadge>Módulos</GoldBadge>
          <h2 className="mt-5 text-[32px] font-black leading-tight text-[#111111] sm:text-[40px]">
            Cada herramienta que tu barbería necesita
          </h2>
          <p className="mt-4 text-base text-slate-500">
            Sin apps separadas. Sin integraciones complicadas. Todo en un panel que ya conoces el primer día.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <div
              key={m.title}
              className="group rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-[0_1px_6px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
            >
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl border ${m.color}`}>
                <m.icon size={20} />
              </div>
              <h3 className="mb-2 text-[15px] font-black text-[#111111]">{m.title}</h3>
              <p className="text-[13px] leading-relaxed text-slate-500">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Customer Journey ─────────────────────────────────────────────────────────

function JourneySection() {
  return (
    <section id="como-funciona" className="bg-white px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <GoldBadge>Experiencia del cliente</GoldBadge>
          <h2 className="mt-5 text-[32px] font-black leading-tight text-[#111111] sm:text-[40px]">
            De Instagram a la reseña, todo automático
          </h2>
          <p className="mt-4 text-base text-slate-500">
            Tu cliente nunca llama. Nunca espera respuesta. Nunca olvida que tiene cita. Así funciona BarberíaOS.
          </p>
        </div>

        {/* Journey steps */}
        <div className="flex flex-col items-stretch gap-0 sm:flex-row">
          {journeySteps.map((step, i) => (
            <div key={step.label} className="flex flex-1 flex-col items-center sm:flex-row">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#EAEAEA] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                  <step.icon size={24} className="text-[#111111]" />
                </div>
                <div className="mt-3">
                  <p className="text-[13px] font-black text-[#111111]">{step.label}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{step.desc}</p>
                </div>
              </div>
              {i < journeySteps.length - 1 && (
                <div className="mx-4 my-4 flex shrink-0 items-center sm:my-0">
                  <ArrowRight size={18} className="rotate-90 text-[#D4AF37] sm:rotate-0" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Journey CTA */}
        <div className="mt-14 overflow-hidden rounded-3xl bg-[#FAFAFA] border border-[#EAEAEA] p-8 text-center lg:p-12">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Sin instalación · Activo en 30 minutos</p>
          <h3 className="mx-auto mt-4 max-w-xl text-[24px] font-black text-[#111111] lg:text-[28px]">
            Tu barbería puede estar recibiendo reservas hoy mismo
          </h3>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CTAPrimary href={DEMO_URL}>
              Solicitar demo gratuita <ArrowRight size={16} />
            </CTAPrimary>
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-[#EAEAEA] bg-white px-8 text-sm font-black text-slate-700 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_4px_18px_rgba(0,0,0,0.10)]"
            >
              <MessageCircle size={16} className="text-emerald-600" />
              Hablar por WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Dashboard Feature Section ────────────────────────────────────────────────

function DashboardSection() {
  const kpis = [
    { label: "Ingresos semana", value: "1.840€", change: "+18%", icon: TrendingUp },
    { label: "Reservas activas", value: "42", change: "+7 vs sem. anterior", icon: CalendarDays },
    { label: "Clientes totales", value: "312", change: "+14 este mes", icon: Users },
    { label: "Tarjetas fidelización", value: "67", change: "38 completadas", icon: Crown },
    { label: "Ocupación media", value: "84%", change: "+6 puntos", icon: BarChart3 },
    { label: "Ticket medio", value: "31€", change: "+2€ vs anterior", icon: ReceiptText },
  ];

  return (
    <section className="bg-[#FAFAFA] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <GoldBadge>Panel de control</GoldBadge>
            <h2 className="mt-5 text-[32px] font-black leading-tight text-[#111111] sm:text-[40px]">
              Tu negocio en tiempo real,<br />
              <span className="text-[#D4AF37]">siempre visible.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-500 lg:text-lg">
              Ingresos, reservas, fidelización, ocupación y rendimiento por barbero — todo desde un panel que funciona igual en móvil que en desktop.
            </p>
            <div className="mt-8 space-y-3">
              {["Ingresos diarios y mensuales en tiempo real", "Rendimiento por barbero y por servicio", "Tasa de ocupación y huecos perdidos", "Estado de fidelización de cada cliente"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#111111]">
                    <Check size={11} className="text-white" />
                  </div>
                  <p className="text-[14px] text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* KPI grid mockup */}
          <div className="rounded-3xl border border-[#EAEAEA] bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[13px] font-black text-[#111111]">Resumen del negocio</p>
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700">En directo</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {kpis.map((k) => (
                <div key={k.label} className="rounded-2xl border border-[#F0F0F0] bg-[#FAFAFA] p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-[#111111]">
                    <k.icon size={14} className="text-[#D4AF37]" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{k.label}</p>
                  <p className="mt-1 text-xl font-black tabular-nums text-[#111111]">{k.value}</p>
                  <p className="mt-0.5 text-[11px] font-bold text-emerald-600">{k.change}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function PricingSection() {
  return (
    <section id="precios" className="bg-white px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <GoldBadge>Precios</GoldBadge>
          <h2 className="mt-5 text-[32px] font-black leading-tight text-[#111111] sm:text-[40px]">
            Sin comisiones. Sin sorpresas.
          </h2>
          <p className="mt-4 text-base text-slate-500">
            Precio fijo mensual. Cancela cuando quieras. Sin permanencia ni costes ocultos.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border p-8 ${
                plan.featured
                  ? "border-[#111111] bg-[#111111] shadow-[0_20px_60px_rgba(17,17,17,0.20)]"
                  : "border-[#EAEAEA] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-[#D4AF37] px-4 py-1.5 text-[11px] font-black text-[#111111]">
                    ⭐ Más popular
                  </span>
                </div>
              )}

              <div className="mb-2">
                <p className={`text-[11px] font-black uppercase tracking-widest ${plan.featured ? "text-[#D4AF37]" : "text-slate-400"}`}>
                  {plan.highlight}
                </p>
              </div>
              <p className={`text-xl font-black ${plan.featured ? "text-white" : "text-[#111111]"}`}>{plan.name}</p>
              <div className="mt-4 flex items-end gap-1">
                <span className={`text-5xl font-black tabular-nums ${plan.featured ? "text-white" : "text-[#111111]"}`}>{plan.price}€</span>
                <span className={`mb-2 text-sm ${plan.featured ? "text-slate-400" : "text-slate-400"}`}>/mes</span>
              </div>
              <p className={`mt-3 text-[13px] ${plan.featured ? "text-slate-400" : "text-slate-500"}`}>{plan.desc}</p>

              <Link
                href={DEMO_URL}
                className={`mt-7 flex min-h-[48px] w-full items-center justify-center rounded-2xl text-sm font-black transition hover:-translate-y-0.5 ${
                  plan.featured
                    ? "bg-[#D4AF37] text-[#111111] shadow-[0_4px_16px_rgba(212,175,55,0.30)] hover:bg-[#E8C547]"
                    : "border border-[#EAEAEA] bg-[#FAFAFA] text-[#111111] hover:bg-white hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                }`}
              >
                Solicitar demo →
              </Link>

              <div className={`mt-6 h-px ${plan.featured ? "bg-white/10" : "bg-[#F0F0F0]"}`} />

              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${plan.featured ? "bg-[#D4AF37]" : "bg-[#111111]"}`}>
                      <Check size={9} className={plan.featured ? "text-[#111111]" : "text-white"} />
                    </div>
                    <span className={`text-[13px] leading-relaxed ${plan.featured ? "text-slate-300" : "text-slate-600"}`}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-[13px] text-slate-400">
          ¿Necesitas algo personalizado?{" "}
          <Link href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-[#111111] underline underline-offset-2">
            Hablamos por WhatsApp
          </Link>
        </p>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function TestimonialsSection() {
  return (
    <section className="bg-[#FAFAFA] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <GoldBadge>Testimonios</GoldBadge>
          <h2 className="mt-5 text-[32px] font-black leading-tight text-[#111111] sm:text-[40px]">
            Lo que dicen los dueños de barbería
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-3xl border border-[#EAEAEA] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>

              {/* Quote */}
              <p className="flex-1 text-[14px] leading-relaxed text-slate-600">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Metric */}
              <div className="mt-6 rounded-2xl border border-[#D4AF37]/20 bg-[#FFFBEB] px-4 py-3">
                <p className="text-xl font-black text-[#111111]">{t.metric}</p>
                <p className="text-[12px] text-slate-500">{t.metricSub}</p>
              </div>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111111] text-sm font-black text-[#D4AF37]">
                  {t.initial}
                </div>
                <div>
                  <p className="text-[14px] font-black text-[#111111]">{t.name}</p>
                  <p className="text-[12px] text-slate-400">{t.role} · {t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-white px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mb-14 text-center">
          <GoldBadge>Preguntas frecuentes</GoldBadge>
          <h2 className="mt-5 text-[32px] font-black leading-tight text-[#111111] sm:text-[40px]">
            Todo lo que necesitas saber
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl border transition ${
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
                  size={18}
                  className={`shrink-0 text-slate-400 transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="border-t border-[#F0F0F0] px-6 py-5">
                  <p className="text-[14px] leading-relaxed text-slate-500">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="bg-[#111111] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[11px] font-black uppercase tracking-widest text-[#D4AF37]">
          Empieza hoy
        </p>
        <h2 className="mx-auto mt-5 max-w-3xl text-[36px] font-black leading-tight text-white sm:text-[48px]">
          Tu barbería merece un sistema que esté a su altura.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400 lg:text-lg">
          Solicita una demo gratuita. Sin permanencia, sin comisiones y sin necesidad de instalar nada. Activo en menos de 30 minutos.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={DEMO_URL}
            className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-10 text-base font-black text-[#111111] shadow-[0_8px_32px_rgba(212,175,55,0.35)] transition hover:-translate-y-0.5 hover:bg-[#E8C547] hover:shadow-[0_12px_40px_rgba(212,175,55,0.45)] active:scale-[0.98]"
          >
            Solicitar demo gratuita <ArrowRight size={18} />
          </Link>
          <Link
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-10 text-base font-black text-white/80 transition hover:bg-white/[0.10] hover:text-white"
          >
            <MessageCircle size={18} />
            Hablar con el equipo
          </Link>
        </div>

        <p className="mt-8 text-[13px] text-slate-500">
          Sin tarjeta de crédito · Sin comisión por reserva · Sin permanencia
        </p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const links = [
    { label: "Funcionalidades", href: "#funcionalidades" },
    { label: "Precios", href: "#precios" },
    { label: "Demo", href: DEMO_URL },
    { label: "Login", href: BUSINESS_CONFIG.loginUrl },
    { label: "Privacidad", href: "/legal/privacidad" },
    { label: "Términos", href: "/legal/terminos" },
  ];

  return (
    <footer className="border-t border-[#EAEAEA] bg-[#FAFAFA] px-5 py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <Link href="/" aria-label="BarberíaOS — inicio">
            <BarberiaOSLogo variant="full" size={32} showText tone="light" />
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-slate-500">
            {links.map((l) => (
              <Link key={l.label} href={l.href} className="transition hover:text-[#111111]">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-[#EAEAEA] pt-6 text-center text-[12px] text-slate-400">
          © {new Date().getFullYear()} BarberíaOS · Software para barberías · Hecho en España
        </div>
      </div>
    </footer>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function SquirePremiumLanding() {
  return (
    <div className="min-h-screen bg-white antialiased">
      <Navbar />
      <main>
        <Hero />
        <SocialProofBar />
        <ProblemSection />
        <SolutionStrip />
        <ModulesSection />
        <JourneySection />
        <DashboardSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
