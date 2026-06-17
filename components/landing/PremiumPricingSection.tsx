"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 49,
    period: "/mes",
    setup: "Setup 149 €",
    description: "Para dejar atrás WhatsApp y papel con una base profesional.",
    forWho: "Barberías pequeñas o barberos que quieren ordenar reservas.",
    limits: "App de reservas · QR · página pública · activación asistida",
    featured: false,
    ctaLabel: "Ver demo interactiva",
    ctaHref: "/r/demo-barber",
    features: [
      "App de reservas online",
      "QR personalizado",
      "Página pública de reservas",
      "Servicios, barberos y agenda",
      "Dashboard básico",
      "Soporte inicial",
    ],
  },
  {
    name: "Growth",
    price: 149,
    period: "/mes",
    setup: "Setup 249 €",
    description: "Para barberías que quieren marketing digital y más reservas.",
    forWho: "Locales que quieren Google e Instagram optimizados.",
    limits: "Todo Starter · publicidad aparte 100-300 €/mes",
    badge: "Más popular",
    featured: true,
    ctaLabel: "Pedir diagnóstico gratis",
    ctaHref: "/pedir-demo",
    features: [
      "Todo en Starter",
      "Google Business optimizado",
      "Instagram optimizado",
      "8 diseños al mes",
      "4 reels al mes",
      "Reporte mensual",
      "Recordatorios básicos cuando estén disponibles",
    ],
  },
  {
    name: "Premium",
    price: 299,
    period: "/mes",
    setup: "Setup 499 €",
    description: "Para dueños que quieren campañas, CRM y fidelización.",
    forWho: "Dueños que quieren recuperar clientes y escalar con datos.",
    limits: "Todo Growth · publicidad aparte 300-1.000 €/mes",
    featured: false,
    ctaLabel: "Ver demo interactiva",
    ctaHref: "/r/demo-barber",
    features: [
      "Todo en Growth",
      "Gestión de campañas Meta/TikTok",
      "12-16 piezas de contenido",
      "Campañas de recuperación",
      "Sistema VIP",
      "Reportes avanzados",
      "Soporte prioritario",
    ],
  },
] as const;

// ── Individual pricing card ────────────────────────────────────────────────
function PricingCard({
  plan,
  index,
  inView,
}: {
  plan: (typeof plans)[number];
  index: number;
  inView: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();

  const baseDelay = 0.1 + index * 0.12;

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: baseDelay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex min-h-full flex-col rounded-[28px] p-7 ${
        plan.featured
          ? "bg-[#0D0D0F] shadow-[0_32px_80px_rgba(213,168,76,0.18),0_0_0_1px_rgba(213,168,76,0.22)]"
          : "border border-white/[0.08] bg-[#0E0E1C] shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
      }`}
      style={{ willChange: "transform, opacity" }}
    >
      {/* Top accent line for featured */}
      {plan.featured && (
        <div className="absolute inset-x-0 top-0 h-px rounded-t-[28px] bg-gradient-to-r from-transparent via-[#D5A84C]/80 to-transparent" />
      )}

      {/* Badge */}
      {"badge" in plan && plan.badge && (
        <div className="absolute right-5 top-5">
          <span className="rounded-full bg-[#D5A84C] px-3 py-1 text-[11px] font-black text-[#080A0F]">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Plan name */}
      <h3 className="text-xl font-black text-white">
        {plan.name}
      </h3>

      {/* Description */}
      <p className="mt-2 min-h-[3rem] text-sm leading-6 text-white/55">
        {plan.description}
      </p>

      {/* Price */}
      <div className="mt-6 flex items-end gap-1">
        <span className="text-5xl font-black leading-none text-white">
          €{plan.price}
        </span>
        <span className="mb-1 text-sm font-bold text-white/35">
          {plan.period}
        </span>
      </div>
      {"setup" in plan && plan.setup && (
        <p className="mt-1 text-[11px] font-semibold text-white/30">{plan.setup}</p>
      )}

      {/* For who */}
      <div
        className={`mt-5 rounded-2xl border p-4 ${
          plan.featured
            ? "border-[#D5A84C]/20 bg-[#D5A84C]/[0.06]"
            : "border-white/[0.08] bg-white/[0.04]"
        }`}
      >
        <p className="text-[10px] font-black uppercase tracking-wider text-[#D5A84C]">
          Para quién
        </p>
        <p className="mt-1.5 text-xs leading-5 text-white/55">
          {plan.forWho}
        </p>
        <p className="mt-2 text-[10px] font-bold text-white/30">
          {plan.limits}
        </p>
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-white/[0.08]" />

      {/* Features */}
      <ul className="flex flex-1 flex-col gap-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-sm font-bold leading-5 text-white/70"
          >
            <CheckCircle2
              size={15}
              className={`mt-0.5 shrink-0 ${
                plan.featured ? "text-[#D5A84C]" : "text-[#D5A84C]/80"
              }`}
            />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={plan.ctaHref}
        className={`mt-7 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl text-sm font-black transition-all duration-200 active:scale-[0.98] ${
          plan.featured
            ? "bg-[#D5A84C] text-[#080A0F] shadow-[0_4px_20px_rgba(213,168,76,0.30)] hover:bg-[#E8C46A]"
            : "border border-white/[0.10] bg-white/[0.04] text-white/70 hover:border-[#D5A84C]/30 hover:bg-[#D5A84C]/[0.06] hover:text-white"
        }`}
        style={{ willChange: "transform" }}
      >
        {plan.ctaLabel}
        <ArrowRight size={14} />
      </a>
    </motion.article>
  );
}

// ── Main section ───────────────────────────────────────────────────────────
export function PremiumPricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="precios"
      className="relative overflow-hidden bg-[#09090B] px-5 py-16 text-white md:py-24 lg:px-8"
      aria-labelledby="pricing-section-heading"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[800px] -translate-x-1/2"
        style={{ background: "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(213,168,76,0.08) 0%, transparent 100%)" }}
      />
      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          ref={headRef}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="text-xs font-black uppercase tracking-widest text-[#D5A84C]">
            Planes
          </p>
          <h2
            id="pricing-section-heading"
            className="mt-3 text-3xl font-black leading-tight text-white md:text-5xl"
          >
            Precio fijo. Sin comisiones. Sin sorpresas.
          </h2>
          <p className="mt-4 text-base leading-7 text-white/50">
            Planes pensados por fase de negocio. Todos incluyen página pública,
            QR de reservas y activación asistida.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div ref={sectionRef} className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} index={i} inView={inView} />
          ))}
        </div>

        {/* Footnote */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mx-auto mt-7 max-w-2xl text-center text-xs text-white/30"
        >
          Sin comisiones · Sin permanencia · Precios orientativos para España. IVA y condiciones
          finales se confirman en la demo. Cancela cuando quieras.
        </motion.p>
      </div>
    </section>
  );
}
