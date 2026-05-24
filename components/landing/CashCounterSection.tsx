"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { TrendingUp, Scissors, ShoppingBag, Users } from "lucide-react";

// ── Animated number counter ────────────────────────────────────────────────
function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, {
    stiffness: 38,
    damping: 14,
    mass: 0.8,
  });

  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView && !prefersReducedMotion) {
      motionVal.set(target);
    } else if (inView && prefersReducedMotion) {
      setDisplay(target.toFixed(decimals));
    }
  }, [inView, target, motionVal, prefersReducedMotion, decimals]);

  useEffect(() => {
    const unsub = springVal.on("change", (v) => {
      setDisplay(v.toFixed(decimals));
    });
    return unsub;
  }, [springVal, decimals]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

// ── Revenue card ───────────────────────────────────────────────────────────
function RevenueCard({ inView }: { inView: boolean }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[28px] p-8 md:p-10"
      style={{
        background:
          "linear-gradient(135deg, #0d1117 0%, #111827 50%, #0a0e1a 100%)",
        border: "1px solid rgba(213,168,76,0.15)",
        boxShadow:
          "0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(213,168,76,0.06), inset 0 1px 0 rgba(213,168,76,0.1)",
        willChange: "transform, opacity",
      }}
    >
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D5A84C]/60 to-transparent" />

      {/* Eyebrow */}
      <p className="text-xs font-black uppercase tracking-widest text-[#D5A84C]/70">
        Caja del día
      </p>

      {/* Main counter */}
      <div className="mt-4 flex items-end gap-2">
        <span className="text-6xl font-black leading-none text-white md:text-7xl">
          <AnimatedCounter target={847} prefix="€" />
        </span>
        <div className="mb-2 flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1">
          <TrendingUp size={12} className="text-emerald-400" />
          <span className="text-xs font-black text-emerald-400">+12%</span>
        </div>
      </div>

      {/* Sub stats */}
      <div className="mt-2 text-sm font-bold text-white/40">
        vs. €755 ayer
      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-white/8" />

      {/* Detail stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { Icon: Scissors, label: "Servicios", value: "18", color: "text-[#D5A84C]" },
          { Icon: Users, label: "Barberos", value: "4", color: "text-[#38BDF8]" },
          { Icon: ShoppingBag, label: "Productos", value: "3", color: "text-emerald-400" },
        ].map(({ Icon, label, value, color }) => (
          <div key={label} className="text-center">
            <Icon size={16} className={`mx-auto ${color}`} />
            <p className={`mt-2 text-xl font-black text-white`}>{value}</p>
            <p className="mt-0.5 text-[10px] font-bold text-white/35">{label}</p>
          </div>
        ))}
      </div>

      {/* Methods breakdown */}
      <div className="mt-6 space-y-2">
        <p className="text-[10px] font-black uppercase text-white/28">
          Por método de pago
        </p>
        {[
          { method: "Efectivo", amount: 320, pct: 38 },
          { method: "Tarjeta", amount: 411, pct: 49 },
          { method: "Bizum", amount: 116, pct: 13 },
        ].map(({ method, amount, pct }) => (
          <div key={method} className="flex items-center gap-3">
            <span className="w-14 text-xs font-bold text-white/45">{method}</span>
            <div className="flex-1 rounded-full bg-white/8">
              <motion.div
                className="h-1.5 rounded-full bg-[#D5A84C]"
                initial={{ width: 0 }}
                animate={inView ? { width: `${pct}%` } : {}}
                transition={{
                  duration: 1.1,
                  delay: 0.6 + pct * 0.005,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ willChange: "width" }}
              />
            </div>
            <span className="w-12 text-right text-xs font-black text-white/60">
              €{amount}
            </span>
          </div>
        ))}
      </div>

      {/* Subtle glow */}
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #D5A84C, transparent)" }}
      />
    </motion.div>
  );
}

// ── Side stats column ──────────────────────────────────────────────────────
function SideStats({ inView }: { inView: boolean }) {
  const prefersReducedMotion = useReducedMotion();

  const items = [
    {
      label: "Ticket medio",
      value: <AnimatedCounter target={47} prefix="€" />,
      desc: "por servicio cerrado",
      color: "text-[#D5A84C]",
      bg: "rgba(213,168,76,0.06)",
      border: "rgba(213,168,76,0.15)",
      delay: 0.2,
    },
    {
      label: "Tasa de ocupación",
      value: <AnimatedCounter target={78} suffix="%" />,
      desc: "sobre huecos disponibles",
      color: "text-[#38BDF8]",
      bg: "rgba(56,189,248,0.06)",
      border: "rgba(56,189,248,0.15)",
      delay: 0.32,
    },
    {
      label: "Clientes recurrentes",
      value: <AnimatedCounter target={73} suffix="%" />,
      desc: "volvieron en 30 días",
      color: "text-emerald-500",
      bg: "rgba(34,197,94,0.06)",
      border: "rgba(34,197,94,0.15)",
      delay: 0.44,
    },
    {
      label: "Mejor barbero hoy",
      value: "Marcos",
      desc: "9 citas · €398",
      color: "text-[#D5A84C]",
      bg: "rgba(213,168,76,0.06)",
      border: "rgba(213,168,76,0.15)",
      delay: 0.56,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {items.map(({ label, value, desc, color, bg, border, delay }) => (
        <motion.div
          key={label}
          initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border bg-white p-5 shadow-sm"
          style={{ borderColor: border, willChange: "transform, opacity" }}
        >
          <p className="text-xs font-black uppercase text-[#080A0F]/55">{label}</p>
          <p className={`mt-2 text-3xl font-black ${color}`}>{value}</p>
          <p className="mt-1 text-xs text-[#080A0F]/60">{desc}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ── Main section ───────────────────────────────────────────────────────────
export function CashCounterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="bg-[#F8F8F6] px-5 py-16 text-[#080A0F] md:py-24 lg:px-8"
      aria-labelledby="cash-section-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          ref={headRef}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="text-xs font-black uppercase tracking-widest text-[#D5A84C]">
            Caja diaria
          </p>
          <h2
            id="cash-section-heading"
            className="mt-3 text-3xl font-black leading-tight text-[#080A0F] md:text-5xl"
          >
            Sabes exactamente cuánto entra, quién lo genera y cómo.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#080A0F]/55">
            Servicios, productos, propinas, barbero y método de pago. Todo queda
            registrado al cerrar cada cita, sin depender de papel ni memoria.
          </p>
        </motion.div>

        {/* Grid */}
        <div ref={sectionRef} className="grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
          <RevenueCard inView={inView} />
          <SideStats inView={inView} />
        </div>
      </div>
    </section>
  );
}
