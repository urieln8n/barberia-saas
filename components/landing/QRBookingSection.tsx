"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { CalendarCheck2, Scissors, User, Clock3, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: CalendarCheck2,
    label: "Escanear QR",
    desc: "El cliente escanea el QR del local, Instagram o tarjeta.",
    color: "#D5A84C",
    bg: "rgba(213,168,76,0.08)",
    border: "rgba(213,168,76,0.25)",
  },
  {
    icon: Scissors,
    label: "Elegir servicio",
    desc: "Selecciona corte, barba, combo o cualquier servicio activo.",
    color: "#38BDF8",
    bg: "rgba(56,189,248,0.06)",
    border: "rgba(56,189,248,0.20)",
  },
  {
    icon: User,
    label: "Elegir barbero",
    desc: "Escoge el barbero disponible o deja que el sistema asigne.",
    color: "#D5A84C",
    bg: "rgba(213,168,76,0.08)",
    border: "rgba(213,168,76,0.25)",
  },
  {
    icon: Clock3,
    label: "Elegir hora",
    desc: "Ve los huecos libres en tiempo real y elige el mejor.",
    color: "#38BDF8",
    bg: "rgba(56,189,248,0.06)",
    border: "rgba(56,189,248,0.20)",
  },
  {
    icon: CheckCircle2,
    label: "Reservar",
    desc: "Confirmación instantánea. La cita aparece en la agenda del panel.",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.07)",
    border: "rgba(34,197,94,0.25)",
  },
] as const;

// ── Animated QR code mockup ────────────────────────────────────────────────
function AnimatedQRCode() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <div ref={ref} className="relative mx-auto w-fit">
      {/* Outer card */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.88 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[28px] border border-[#D5A84C]/20 bg-[#0E0E1C] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(213,168,76,0.10)]"
        style={{ willChange: "transform, opacity" }}
      >
        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-[#D5A84C]" />
          <span className="text-xs font-black text-white/50">barberia-demo.com/reservar</span>
        </div>

        {/* QR grid */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
          {/* Corner markers */}
          {[
            ["top-0 left-0", "border-t-2 border-l-2"],
            ["top-0 right-0", "border-t-2 border-r-2"],
            ["bottom-0 left-0", "border-b-2 border-l-2"],
            ["bottom-0 right-0", "border-b-2 border-r-2"],
          ].map(([pos, border], i) => (
            <div
              key={i}
              className={`absolute ${pos} m-2 h-5 w-5 rounded-sm border-[#D5A84C] ${border}`}
            />
          ))}

          {/* QR pixel grid */}
          <div className="grid grid-cols-9 gap-0.5 p-2">
            {/* Hardcoded QR-like pattern */}
            {[
              1,1,1,0,1,0,1,1,1,
              1,0,1,0,0,0,1,0,1,
              1,0,1,1,0,1,1,0,1,
              1,0,1,0,1,0,1,0,1,
              1,1,1,1,0,1,1,1,1,
              0,1,0,1,1,0,0,1,0,
              1,0,1,1,0,1,1,0,1,
              0,1,0,0,1,0,0,1,0,
              1,1,1,0,0,1,1,0,1,
            ].map((cell, i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-[2px] transition-opacity duration-300 ${
                  cell ? "bg-white/85" : "bg-transparent"
                }`}
                style={{
                  animationDelay: `${i * 12}ms`,
                }}
              />
            ))}
          </div>

          {/* Scan line animation */}
          <motion.div
            className="absolute inset-x-2 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#D5A84C] to-transparent opacity-80"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    y: [8, 116, 8],
                    opacity: [0.6, 1, 0.6],
                  }
            }
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ top: 16, willChange: "transform, opacity" }}
          />
        </div>

        {/* Label below */}
        <p className="mt-3 text-center text-[11px] font-black text-white/45">
          Escanea para reservar
        </p>
      </motion.div>

      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] opacity-30 blur-2xl"
        style={{ background: "radial-gradient(ellipse at center, rgba(213,168,76,0.4) 0%, transparent 70%)" }}
      />
    </div>
  );
}

// ── Flow steps ─────────────────────────────────────────────────────────────
function FlowSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <div ref={ref} className="space-y-3">
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <motion.div
            key={step.label}
            initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
            animate={prefersReducedMotion ? false : (inView ? { opacity: 1, x: 0 } : {})}
            transition={{
              duration: 0.55,
              delay: 0.15 + i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex items-start gap-4 rounded-2xl border bg-[#0E0E1C] p-4"
            style={{
              borderColor: step.border,
              willChange: "transform, opacity",
            }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: step.bg, border: `1px solid ${step.border}` }}
            >
              <Icon size={18} style={{ color: step.color }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-black"
                  style={{ color: step.color }}
                >
                  Paso {i + 1}
                </span>
                <span className="text-sm font-black text-white">
                  {step.label}
                </span>
              </div>
              <p className="mt-0.5 text-xs leading-5 text-white/50">
                {step.desc}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────
export function QRBookingSection({ id }: { id?: string }) {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id={id}
      className="bg-[#0D0D0F] px-5 py-16 text-white md:py-24 lg:px-8"
      aria-labelledby="qr-section-heading"
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
            Reservas por QR
          </p>
          <h2
            id="qr-section-heading"
            className="mt-3 text-3xl font-black leading-tight text-white md:text-5xl"
          >
            El cliente escanea y reserva en menos de 60 segundos.
          </h2>
          <p className="mt-4 text-base leading-7 text-white/55">
            Sin instalar apps, sin escribir por WhatsApp, sin llamadas. Pon el
            QR en el mostrador, Instagram, tarjetas o Google y convierte ese
            tráfico en reservas ordenadas.
          </p>
        </motion.div>

        {/* Grid: QR + Steps */}
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <AnimatedQRCode />
          <FlowSteps />
        </div>
      </div>
    </section>
  );
}
