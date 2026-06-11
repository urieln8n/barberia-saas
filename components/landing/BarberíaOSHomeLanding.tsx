import Link from "next/link";
import dynamic from "next/dynamic";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";
import {
  CalendarCheck, QrCode, Wallet, Users, Clapperboard,
  Clock, Star, ArrowRight, Check, Sparkles, ShieldCheck,
  ChevronRight, BarChart3, Scissors,
} from "lucide-react";

const FAQAccordionLanding = dynamic(() => import("./FAQAccordionLanding"), { ssr: false });

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="fixed left-4 right-4 top-4 z-50 mx-auto max-w-5xl">
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#09090B]/80 px-5 py-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D4AF37]">
            <Scissors size={13} className="text-[#09090B]" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-black tracking-tight text-white">BarberíaOS</span>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          {[
            ["Funciones", "#funciones"],
            ["Precios", "#precios"],
            ["Demo", BUSINESS_CONFIG.demoUrl],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="text-[13px] font-semibold text-white/60 transition hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href={BUSINESS_CONFIG.loginUrl}
            className="hidden text-[13px] font-semibold text-white/60 transition hover:text-white md:block">
            Entrar
          </Link>
          <Link href="/register"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#D4AF37] px-4 text-[13px] font-black text-[#09090B] transition hover:bg-[#E8C84A] active:scale-[0.97]">
            Empezar gratis <ChevronRight size={13} strokeWidth={3} />
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#09090B] pt-32 pb-20">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[#D4AF37]/6 blur-[120px]" />
      <div className="pointer-events-none absolute left-[15%] top-[40%] h-[300px] w-[300px] rounded-full bg-[#2563EB]/8 blur-[80px]" />

      <div className="relative mx-auto max-w-5xl px-4">
        {/* Social badge */}
        <div className="flex justify-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/8 px-4 py-1.5 text-xs font-bold text-[#D4AF37]">
            <Star size={10} fill="currentColor" />
            +300 barberías activas en España
          </div>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-3xl text-center text-5xl font-black leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
          Tu barbería,{" "}
          <span className="relative">
            <span className="relative z-10 text-[#D4AF37]">reservada</span>
            <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-[#D4AF37]/30" />
          </span>
          .{" "}
          <br className="hidden sm:block" />
          Tu negocio,{" "}
          <span className="text-white/70">controlado</span>.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed text-white/55">
          Reservas online, agenda, caja, clientes y contenido para Instagram —
          todo en un panel hecho para barberías reales.
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/register"
            className="inline-flex h-12 items-center gap-2.5 rounded-2xl bg-[#D4AF37] px-7 text-[15px] font-black text-[#09090B] shadow-[0_8px_32px_rgba(212,175,55,0.35)] transition hover:bg-[#E8C84A] hover:shadow-[0_12px_40px_rgba(212,175,55,0.45)] active:scale-[0.98]">
            Empezar gratis — 14 días <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
          <Link href={BUSINESS_CONFIG.demoUrl}
            className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 text-[15px] font-semibold text-white transition hover:border-white/25 hover:bg-white/10">
            Ver demo en vivo
          </Link>
        </div>

        <p className="mt-4 text-center text-xs text-white/30">
          Sin tarjeta. Sin permanencia. Activo en 30 minutos.
        </p>

        {/* Dashboard preview card */}
        <div className="mt-14 overflow-hidden rounded-2xl border border-white/8 bg-[#111111] shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-white/6 px-5 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <div className="h-3 w-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="mx-auto flex h-6 items-center rounded-lg bg-white/6 px-4 text-[11px] text-white/30">
              barberiaos.com/dashboard
            </div>
          </div>
          {/* Stats preview */}
          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
            {[
              { label: "Caja del día", value: "487 €", icon: Wallet, color: "text-emerald-400", bg: "bg-emerald-400/10" },
              { label: "Reservas hoy", value: "12", icon: CalendarCheck, color: "text-blue-400", bg: "bg-blue-400/10" },
              { label: "Huecos libres", value: "3", icon: Clock, color: "text-violet-400", bg: "bg-violet-400/10" },
              { label: "Clientes", value: "847", icon: Users, color: "text-amber-400", bg: "bg-amber-400/10" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="rounded-xl border border-white/6 bg-white/3 p-4">
                <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
                  <Icon size={14} className={color} />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/35">{label}</p>
                <p className="mt-1 text-2xl font-black tabular-nums text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Social proof bar ─────────────────────────────────────────────────────────

function SocialProof() {
  return (
    <section className="border-y border-white/6 bg-[#0D0D0F] py-6">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] font-semibold text-white/35">
          <span>De confianza para:</span>
          {["Barbería La Fama", "The Cut Room", "Kings Fade", "El Maestro Barber", "Urban Scissors"].map((name) => (
            <span key={name} className="text-white/50">{name}</span>
          ))}
          <span className="rounded-full bg-white/5 px-3 py-1 text-white/40">+300 más</span>
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
      title: "Reservas sin app",
      desc: "Los clientes reservan desde tu link, QR, Instagram o Google Business. Sin descargas ni registro.",
      accent: "text-blue-400", bg: "bg-blue-400/8", border: "border-blue-400/15",
      size: "col-span-1 row-span-1",
    },
    {
      icon: QrCode,
      title: "QR propio e imprimible",
      desc: "Un QR único para tu barbería. Ponlo en la puerta, el mostrador o Instagram.",
      accent: "text-[#D4AF37]", bg: "bg-[#D4AF37]/8", border: "border-[#D4AF37]/15",
      size: "col-span-1 row-span-1",
    },
    {
      icon: Wallet,
      title: "Caja digital",
      desc: "Cobros, cortes de caja, propinas y movimientos. Sin hardware externo.",
      accent: "text-emerald-400", bg: "bg-emerald-400/8", border: "border-emerald-400/15",
      size: "col-span-1 row-span-1",
    },
    {
      icon: Clapperboard,
      title: "Studio IA",
      desc: "Crea reels y posts para Instagram con IA en segundos. Llena los huecos libres antes de que se pierdan.",
      accent: "text-violet-400", bg: "bg-violet-400/8", border: "border-violet-400/15",
      size: "sm:col-span-2 row-span-1",
      tag: "Nuevo",
    },
    {
      icon: BarChart3,
      title: "Estadísticas en tiempo real",
      desc: "Rendimiento por barbero, ingresos del mes y clientes dormidos.",
      accent: "text-cyan-400", bg: "bg-cyan-400/8", border: "border-cyan-400/15",
      size: "col-span-1 row-span-1",
    },
    {
      icon: Users,
      title: "CRM de clientes",
      desc: "Historial, notas, fidelización y reactiva a los que no vuelven.",
      accent: "text-rose-400", bg: "bg-rose-400/8", border: "border-rose-400/15",
      size: "col-span-1 row-span-1",
    },
  ];

  return (
    <section id="funciones" className="bg-[#09090B] py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">Funciones</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white">
            Todo lo que necesita tu barbería
          </h2>
          <p className="mt-3 text-white/50">En un panel. Sin integraciones. Sin complicaciones.</p>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, desc, accent, bg, border, size, tag }) => (
            <div
              key={title}
              className={`group relative overflow-hidden rounded-2xl border ${border} bg-[#111111] p-6 transition hover:-translate-y-0.5 hover:border-opacity-50 ${size}`}
            >
              {tag && (
                <span className="absolute right-4 top-4 rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-0.5 text-[10px] font-black text-violet-400">
                  {tag}
                </span>
              )}
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                <Icon size={18} className={accent} />
              </div>
              <h3 className="text-[15px] font-black text-white">{title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/45">{desc}</p>
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
    { n: "01", title: "Crea tu cuenta", desc: "Registro en 2 minutos. Sin tarjeta. Sin configuración técnica." },
    { n: "02", title: "Configura tu barbería", desc: "Añade barberos, servicios, horarios y personaliza tu página pública en menos de 30 minutos." },
    { n: "03", title: "Comparte y recibe reservas", desc: "Comparte tu QR o link. Tus clientes reservan desde el móvil sin descargar nada." },
  ];

  return (
    <section className="bg-[#0D0D0F] py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">Proceso</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white">Activo en 30 minutos</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map(({ n, title, desc }) => (
            <div key={n} className="rounded-2xl border border-white/8 bg-[#111111] p-7">
              <div className="mb-5 text-5xl font-black tabular-nums text-[#D4AF37]/25">{n}</div>
              <h3 className="text-[17px] font-black text-white">{title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/45">{desc}</p>
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
      desc: "Para barberías que empiezan a digitalizar",
      features: ["Reservas online + QR propio", "Hasta 2 barberos", "Gestión de caja básica", "Notificaciones al cliente", "Soporte por email"],
      cta: "Empezar gratis",
      href: "/register?plan=starter",
      highlight: false,
    },
    {
      name: "Growth",
      price: "79",
      desc: "El más popular — todo lo que necesitas",
      features: ["Todo en Starter", "Hasta 5 barberos", "CRM de clientes completo", "Estadísticas avanzadas", "Studio IA (20 créditos/mes)", "Soporte prioritario por WhatsApp"],
      cta: "Empezar con Growth",
      href: "/register?plan=growth",
      highlight: true,
      tag: "Más popular",
    },
    {
      name: "Elite",
      price: "149",
      desc: "Para barberías con alto volumen",
      features: ["Todo en Growth", "Barberos ilimitados", "Studio IA ilimitado", "Página web SEO optimizada", "Fidelización + tarjeta sellos", "Manager account dedicado"],
      cta: "Empezar con Elite",
      href: "/register?plan=elite",
      highlight: false,
    },
  ];

  return (
    <section id="precios" className="bg-[#09090B] py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">Precios</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white">Cuota fija. Sin comisiones.</h2>
          <p className="mt-3 text-white/50">Todas tus reservas son tuyas. Sin sorpresas al final del mes.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {plans.map(({ name, price, desc, features, cta, href, highlight, tag }) => (
            <div
              key={name}
              className={`relative flex flex-col rounded-2xl border p-7 ${
                highlight
                  ? "border-[#D4AF37]/40 bg-[#111111] shadow-[0_0_0_1px_rgba(212,175,55,0.15),0_24px_60px_rgba(212,175,55,0.12)]"
                  : "border-white/8 bg-[#111111]"
              }`}
            >
              {tag && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#D4AF37] px-3 py-0.5 text-[10px] font-black text-[#09090B]">
                  {tag}
                </div>
              )}
              <div className="mb-5">
                <p className="text-xs font-black uppercase tracking-wide text-white/40">{name}</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{price} €</span>
                  <span className="text-sm text-white/35">/mes</span>
                </div>
                <p className="mt-1.5 text-[13px] text-white/45">{desc}</p>
              </div>
              <ul className="mb-7 flex flex-1 flex-col gap-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-white/65">
                    <Check size={13} className="mt-0.5 shrink-0 text-[#D4AF37]" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={href}
                className={`inline-flex h-11 items-center justify-center rounded-xl text-[14px] font-black transition active:scale-[0.97] ${
                  highlight
                    ? "bg-[#D4AF37] text-[#09090B] shadow-[0_4px_20px_rgba(212,175,55,0.30)] hover:bg-[#E8C84A]"
                    : "border border-white/12 bg-white/5 text-white hover:border-white/25 hover:bg-white/10"
                }`}
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-white/25">
          14 días de prueba gratuita · Sin tarjeta · Cancela cuando quieras
        </p>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  const testimonials = [
    {
      text: "Antes llevaba la agenda en papel y siempre había líos. Con BarberíaOS mis clientes reservan solos desde Instagram y yo controlo todo desde el móvil.",
      name: "Carlos M.", shop: "The Kings Fade, Madrid", stars: 5,
    },
    {
      text: "Lo que más me gusta es el QR. Lo puse en la puerta y en 2 semanas ya tenía 30 reservas online que antes perdía.",
      name: "Javier R.", shop: "Barbería Premium, Sevilla", stars: 5,
    },
    {
      text: "El Studio IA me ahorra 2 horas a la semana. Genero el vídeo del hueco libre en 2 minutos y lo subo a Instagram. Funciona.",
      name: "David L.", shop: "Urban Scissors, Barcelona", stars: 5,
    },
  ];

  return (
    <section className="bg-[#0D0D0F] py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">Opiniones</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white">Barberías que ya lo usan</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map(({ text, name, shop, stars }) => (
            <div key={name} className="rounded-2xl border border-white/8 bg-[#111111] p-7">
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} size={12} className="text-[#D4AF37]" fill="currentColor" />
                ))}
              </div>
              <blockquote className="text-[14px] leading-relaxed text-white/65">
                &ldquo;{text}&rdquo;
              </blockquote>
              <div className="mt-5 border-t border-white/6 pt-4">
                <p className="text-[13px] font-black text-white">{name}</p>
                <p className="text-[11px] text-white/35">{shop}</p>
              </div>
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
    <section className="bg-[#09090B] py-14">
      <div className="mx-auto max-w-4xl px-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: ShieldCheck, label: "Sin comisiones", desc: "Cuota fija mensual" },
            { icon: Sparkles, label: "IA incluida", desc: "Studio IA en todos los planes" },
            { icon: QrCode, label: "QR propio", desc: "Imprimible desde el panel" },
            { icon: Clock, label: "Activo en 30 min", desc: "Onboarding guiado paso a paso" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center gap-2 rounded-2xl border border-white/6 bg-[#111111] p-5 text-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                <Icon size={15} className="text-[#D4AF37]" />
              </div>
              <p className="text-[13px] font-black text-white">{label}</p>
              <p className="text-[11px] text-white/35">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const faqs: readonly [string, string][] = [
  ["¿Mis clientes tienen que instalar una app?", "No. Reservan desde cualquier navegador — desde tu link, QR, Instagram o Google. Sin descargas."],
  ["¿Cobra comisión por reserva?", "No. Cuota mensual fija. Tus reservas son siempre tuyas."],
  ["¿Puedo gestionar varios barberos?", "Sí. Cada barbero tiene su agenda, horario y estadísticas propias."],
  ["¿Puedo cancelar cuando quiera?", "Sí. Sin permanencia ni penalizaciones desde el panel."],
  ["¿Qué incluye el Studio IA?", "Genera reels, posts y copys para Instagram con IA en segundos para rellenar los huecos libres."],
  ["¿Necesito conocimientos técnicos?", "No. Configuración inicial en 30 minutos con soporte guiado incluido."],
];

function FAQSection() {
  return (
    <section className="bg-[#0D0D0F] py-24">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-12 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">FAQ</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white">Preguntas frecuentes</h2>
        </div>
        <FAQAccordionLanding items={faqs} />
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#09090B] py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/7 blur-[100px]" />
      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/12 ring-1 ring-[#D4AF37]/20">
          <Scissors size={24} className="text-[#D4AF37]" />
        </div>
        <h2 className="text-5xl font-black leading-tight tracking-tight text-white">
          Empieza hoy.<br />
          <span className="text-[#D4AF37]">Sin riesgo.</span>
        </h2>
        <p className="mt-5 text-lg text-white/45">
          14 días gratis. Sin tarjeta. Activo en 30 minutos.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/register"
            className="inline-flex h-13 items-center gap-2.5 rounded-2xl bg-[#D4AF37] px-8 text-[16px] font-black text-[#09090B] shadow-[0_8px_32px_rgba(212,175,55,0.35)] transition hover:bg-[#E8C84A] hover:shadow-[0_14px_44px_rgba(212,175,55,0.45)] active:scale-[0.98]">
            Crear cuenta gratis <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
          <Link href={BUSINESS_CONFIG.whatsappUrl} target="_blank"
            className="inline-flex h-13 items-center gap-2 rounded-2xl border border-white/12 px-8 text-[15px] font-semibold text-white/70 transition hover:border-white/25 hover:text-white">
            Hablar con ventas
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/6 bg-[#09090B] py-10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#D4AF37]">
              <Scissors size={11} className="text-[#09090B]" strokeWidth={2.5} />
            </div>
            <span className="text-[13px] font-black text-white/50">BarberíaOS</span>
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-[12px] text-white/30">
            {[
              ["Privacidad", "/legal/privacidad"],
              ["Cookies", "/legal/cookies"],
              ["Términos", "/legal/terminos"],
              ["Contacto", `mailto:${BUSINESS_CONFIG.supportEmail}`],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-white/60">{label}</Link>
            ))}
          </div>
          <p className="text-[11px] text-white/20">© 2026 BarberíaOS</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function BarberíaOSHomeLanding() {
  return (
    <div className="min-h-screen bg-[#09090B]">
      <Nav />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <TrustBar />
      <Pricing />
      <Testimonials />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
