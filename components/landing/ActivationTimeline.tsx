"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, QrCode, LayoutDashboard, Users, Megaphone, Rocket } from "lucide-react";

const milestones = [
  {
    time: "Hora 0",
    title: "Te registras",
    desc: "Creas tu cuenta, introduces los datos de tu barbería y defines tus servicios.",
    Icon: Rocket,
    color: "#D5A84C",
    bg: "rgba(213,168,76,0.08)",
    border: "rgba(213,168,76,0.25)",
    done: true,
  },
  {
    time: "Hora 2",
    title: "Agenda y barberos",
    desc: "Configuras tu equipo, horarios y restricciones. La agenda ya bloquea dobles reservas.",
    Icon: LayoutDashboard,
    color: "#38BDF8",
    bg: "rgba(56,189,248,0.06)",
    border: "rgba(56,189,248,0.20)",
    done: true,
  },
  {
    time: "Hora 6",
    title: "QR activo",
    desc: "Tu enlace público y QR están listos. Ponlos en Instagram, Google y el mostrador.",
    Icon: QrCode,
    color: "#D5A84C",
    bg: "rgba(213,168,76,0.08)",
    border: "rgba(213,168,76,0.25)",
    done: true,
  },
  {
    time: "Hora 12",
    title: "Primeras reservas",
    desc: "Los clientes empiezan a reservar desde tu QR. Las citas aparecen en el panel.",
    Icon: Users,
    color: "#22c55e",
    bg: "rgba(34,197,94,0.07)",
    border: "rgba(34,197,94,0.25)",
    done: false,
  },
  {
    time: "Hora 24",
    title: "Barbería operativa",
    desc: "Reservas, caja, clientes y marketing activos. Tu barbería funciona sin WhatsApp ni papel.",
    Icon: Megaphone,
    color: "#D5A84C",
    bg: "rgba(213,168,76,0.08)",
    border: "rgba(213,168,76,0.25)",
    done: false,
  },
] as const;

// ── Desktop horizontal timeline ────────────────────────────────────────────
function DesktopTimeline({ inView }: { inView: boolean }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="hidden lg:block">
      {/* Progress line */}
      <div className="relative mb-2 flex items-center justify-between px-12">
        {/* Background track */}
        <div className="absolute inset-x-12 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-[#080A0F]/8" />

        {/* Animated fill */}
        <motion.div
          className="absolute left-12 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#D5A84C] via-[#38BDF8] to-[#D5A84C]"
          initial={{ width: 0 }}
          animate={inView ? { width: "calc(100% - 96px)" } : {}}
          transition={{
            duration: prefersReducedMotion ? 0 : 1.6,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ willChange: "width" }}
        />

        {/* Dots */}
        {milestones.map((m, i) => (
          <motion.div
            key={m.time}
            initial={prefersReducedMotion ? false : { scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{
              duration: 0.4,
              delay: 0.2 + i * 0.22,
              type: "spring",
              stiffness: 280,
              damping: 18,
            }}
            className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white shadow-sm"
            style={{
              backgroundColor: m.color,
              boxShadow: `0 0 0 3px ${m.bg}, 0 2px 8px rgba(0,0,0,0.08)`,
              willChange: "transform",
            }}
          >
            {m.done && <CheckCircle2 size={9} className="text-white" />}
          </motion.div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-5 gap-3">
        {milestones.map((m, i) => {
          const Icon = m.Icon;
          return (
            <motion.div
              key={m.time}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.35 + i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-2xl border bg-white p-4 shadow-sm"
              style={{ borderColor: m.border, willChange: "transform, opacity" }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: m.bg, border: `1px solid ${m.border}` }}
              >
                <Icon size={16} style={{ color: m.color }} />
              </div>
              <p className="mt-3 text-[11px] font-black" style={{ color: m.color }}>
                {m.time}
              </p>
              <p className="mt-1 text-sm font-black text-[#080A0F]">{m.title}</p>
              <p className="mt-1.5 text-[11px] leading-4 text-[#080A0F]/50">{m.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Mobile vertical timeline ───────────────────────────────────────────────
function MobileTimeline({ inView }: { inView: boolean }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="lg:hidden">
      <div className="relative space-y-4 pl-6">
        {/* Vertical track */}
        <div className="absolute left-2 top-0 h-full w-0.5 rounded-full bg-[#080A0F]/8" />

        {/* Animated fill */}
        <motion.div
          className="absolute left-2 top-0 w-0.5 rounded-full bg-gradient-to-b from-[#D5A84C] to-[#38BDF8]"
          initial={{ height: 0 }}
          animate={inView ? { height: "100%" } : {}}
          transition={{
            duration: prefersReducedMotion ? 0 : 1.4,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ willChange: "height" }}
        />

        {milestones.map((m, i) => {
          const Icon = m.Icon;
          return (
            <motion.div
              key={m.time}
              initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.2 + i * 0.14,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex gap-4"
              style={{ willChange: "transform, opacity" }}
            >
              {/* Dot on track */}
              <motion.div
                initial={prefersReducedMotion ? false : { scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.35, delay: 0.3 + i * 0.14 }}
                className="absolute -left-[17px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-white"
                style={{ backgroundColor: m.color, top: 14 }}
              />

              {/* Card */}
              <div
                className="flex-1 rounded-2xl border bg-white p-4 shadow-sm"
                style={{ borderColor: m.border }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: m.bg, border: `1px solid ${m.border}` }}
                  >
                    <Icon size={16} style={{ color: m.color }} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black" style={{ color: m.color }}>
                      {m.time}
                    </p>
                    <p className="text-sm font-black text-[#080A0F]">{m.title}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#080A0F]/50">{m.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main section ───────────────────────────────────────────────────────────
export function ActivationTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="bg-white px-5 py-16 text-[#080A0F] md:py-24 lg:px-8"
      aria-labelledby="timeline-heading"
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
            Activación en 24h
          </p>
          <h2
            id="timeline-heading"
            className="mt-3 text-3xl font-black leading-tight text-[#080A0F] md:text-5xl"
          >
            De cero a barbería operativa en un día.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#080A0F]/55">
            No compras una herramienta sin más. Sales con tu barbería
            configurada: agenda, QR, página pública y primeros clientes listos.
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={sectionRef}>
          <DesktopTimeline inView={inView} />
          <MobileTimeline inView={inView} />
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <a
            href="/pedir-demo"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#080A0F] px-6 py-3.5 text-sm font-black text-white shadow-[0_4px_20px_rgba(8,10,15,0.15)] transition-all duration-200 hover:bg-[#1a1d26] active:scale-[0.98]"
            style={{ willChange: "transform" }}
          >
            Activar mi barbería
            <Rocket size={14} />
          </a>
          <a
            href="/r/demo-barber"
            className="inline-flex items-center gap-2 rounded-2xl border border-[#080A0F]/12 bg-[#F8F8F6] px-6 py-3.5 text-sm font-black text-[#080A0F]/70 shadow-sm transition-all duration-200 hover:border-[#D5A84C]/30 hover:bg-[#D5A84C]/5 active:scale-[0.98]"
            style={{ willChange: "transform" }}
          >
            Ver demo interactiva
          </a>
        </motion.div>
      </div>
    </section>
  );
}
