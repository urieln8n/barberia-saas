"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

// ── Demo data ──────────────────────────────────────────────────────────────
const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const HOURS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "16:00", "17:00", "18:00"];

type Booking = {
  day: number; // column 0-5
  slot: number; // row 0-8
  name: string;
  service: string;
  barber: string;
  color: "gold" | "blue" | "green";
};

const EXISTING_BOOKINGS: Booking[] = [
  { day: 0, slot: 0, name: "Carlos M.", service: "Corte + barba", barber: "Marcos", color: "gold" },
  { day: 0, slot: 2, name: "David R.", service: "Corte", barber: "Marcos", color: "blue" },
  { day: 1, slot: 1, name: "Javier L.", service: "Corte", barber: "Toni", color: "gold" },
  { day: 1, slot: 4, name: "Sergio P.", service: "Afeitado", barber: "Toni", color: "blue" },
  { day: 2, slot: 0, name: "Rubén G.", service: "Combo", barber: "Marcos", color: "green" },
  { day: 2, slot: 3, name: "Álvaro T.", service: "Barba", barber: "Toni", color: "gold" },
  { day: 3, slot: 2, name: "Miguel A.", service: "Corte", barber: "Marcos", color: "blue" },
  { day: 4, slot: 1, name: "Pablo S.", service: "Corte + barba", barber: "Toni", color: "gold" },
  { day: 4, slot: 5, name: "Fernando V.", service: "Corte", barber: "Marcos", color: "blue" },
  { day: 5, slot: 0, name: "Eduardo C.", service: "Combo", barber: "Toni", color: "green" },
];

// Incoming booking that "flies in" when scrolled into view
const INCOMING_BOOKING: Booking = {
  day: 3,
  slot: 6,
  name: "Luis N.",
  service: "Corte",
  barber: "Marcos",
  color: "gold",
};

const colorMap = {
  gold: {
    bg: "bg-[#D5A84C]/12",
    border: "border-[#D5A84C]/30",
    dot: "bg-[#D5A84C]",
    text: "text-[#B8892A]",
    name: "text-[#080A0F]",
  },
  blue: {
    bg: "bg-[#38BDF8]/8",
    border: "border-[#38BDF8]/20",
    dot: "bg-[#38BDF8]",
    text: "text-[#0284c7]",
    name: "text-[#080A0F]",
  },
  green: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    text: "text-emerald-600",
    name: "text-[#080A0F]",
  },
};

function BookingCard({
  booking,
  animate,
  delay = 0,
  inView,
}: {
  booking: Booking;
  animate?: boolean;
  delay?: number;
  inView: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const c = colorMap[booking.color];

  const card = (
    <div
      className={`rounded-[10px] border px-2 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] ${c.bg} ${c.border}`}
      style={{ minWidth: 0 }}
    >
      <div className="flex items-center gap-1">
        <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.dot}`} />
        <span className={`truncate text-[10px] font-black ${c.name}`}>
          {booking.name}
        </span>
      </div>
      <p className={`mt-0.5 truncate text-[9px] font-bold ${c.text}`}>
        {booking.service}
      </p>
      <p className="truncate text-[9px] text-[#080A0F]/35">{booking.barber}</p>
    </div>
  );

  if (!animate || prefersReducedMotion) return card;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75, y: -10 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.22, 1, 0.36, 1],
        type: "spring",
        stiffness: 200,
        damping: 18,
      }}
      style={{ willChange: "transform, opacity" }}
    >
      {card}
    </motion.div>
  );
}

function AgendaGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[28px] border border-[#080A0F]/8 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04),0_24px_64px_-12px_rgba(0,0,0,0.10)]"
    >
      {/* Browser-style chrome bar */}
      <div className="flex items-center gap-1.5 border-b border-[#080A0F]/6 bg-[#FBFBFA] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#080A0F]/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#080A0F]/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#080A0F]/15" />
        <span className="ml-3 truncate text-[10px] font-bold text-[#080A0F]/30">
          app.barberiaos.com/agenda
        </span>
      </div>

      <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        {/* Header row: days */}
        <div className="grid border-b border-[#080A0F]/8 bg-[#F8F8F6]" style={{ gridTemplateColumns: "68px repeat(6, 1fr)" }}>
          <div className="p-3" />
          {DAYS.map((d) => (
            <div key={d} className="p-3 text-center text-[11px] font-black text-[#080A0F]/45">
              {d}
            </div>
          ))}
        </div>

        {/* Time rows */}
        {HOURS.map((hour, rowIdx) => (
          <div
            key={hour}
            className="grid border-b border-[#080A0F]/5 last:border-b-0"
            style={{ gridTemplateColumns: "68px repeat(6, 1fr)" }}
          >
            {/* Time label */}
            <div className="flex items-start p-2 pt-2.5">
              <span className="text-[10px] font-bold text-[#080A0F]/35">{hour}</span>
            </div>

            {/* Day columns */}
            {DAYS.map((_, colIdx) => {
              const existing = EXISTING_BOOKINGS.find(
                (b) => b.day === colIdx && b.slot === rowIdx
              );
              const isIncoming =
                INCOMING_BOOKING.day === colIdx && INCOMING_BOOKING.slot === rowIdx;

              return (
                <div
                  key={colIdx}
                  className="min-h-[52px] border-l border-[#080A0F]/5 p-1"
                >
                  {existing && (
                    <BookingCard booking={existing} inView={inView} delay={0.05 * rowIdx + 0.05 * colIdx} />
                  )}
                  {isIncoming && (
                    <BookingCard
                      booking={INCOMING_BOOKING}
                      animate
                      delay={0.8}
                      inView={inView}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

// ── Stats row ──────────────────────────────────────────────────────────────
function AgendaStats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  const stats = [
    { label: "Citas hoy", value: "11", color: "text-[#D5A84C]" },
    { label: "Barberos activos", value: "2", color: "text-[#080A0F]" },
    { label: "Huecos libres", value: "7", color: "text-emerald-600" },
    { label: "Ocupación", value: "61%", color: "text-[#38BDF8]" },
  ];

  return (
    <div ref={ref} className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.45,
            delay: 0.1 * i,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="rounded-2xl border border-[#080A0F]/8 bg-white p-4 text-center shadow-[0_2px_6px_rgba(0,0,0,0.03)] transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
        >
          <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
          <p className="mt-0.5 text-xs text-[#080A0F]/60">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ── Main section ───────────────────────────────────────────────────────────
export function AgendaPreviewSection() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="bg-white px-5 py-16 text-[#080A0F] md:py-24 lg:px-8"
      aria-labelledby="agenda-section-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          ref={headRef}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 max-w-2xl"
        >
          <p className="text-xs font-black uppercase tracking-widest text-[#D5A84C]">
            Agenda visual
          </p>
          <h2
            id="agenda-section-heading"
            className="mt-3 text-3xl font-black leading-tight text-[#080A0F] md:text-5xl"
          >
            Toda la semana de tu barbería en un solo vistazo.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#080A0F]/55">
            Ve citas, huecos y barberos en un panel claro. Las reservas
            aparecen al instante y nunca se cruzan dos citas en el mismo hueco.
          </p>
        </motion.div>

        {/* Calendar grid */}
        <AgendaGrid />

        {/* Stats */}
        <AgendaStats />
      </div>
    </section>
  );
}
