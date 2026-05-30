"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowRight, Clock, Euro, Megaphone, Scissors, Users } from "lucide-react";
import { formatTime } from "@/src/lib/agenda/agenda-utils";
import type { BarberWorkload } from "@/src/lib/agenda/types";

function money(n: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function OccupancyBar({ pct }: { pct: number }) {
  const color =
    pct >= 70
      ? "bg-emerald-500"
      : pct >= 40
        ? "bg-[#D4AF37]"
        : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#080A0F]/8">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right text-[10px] font-black text-[#080A0F]/60">
        {pct}%
      </span>
    </div>
  );
}

type CardProps = {
  workload: BarberWorkload;
  index: number;
  onViewAgenda: (barberId: string) => void;
};

function BarberWorkloadCard({ workload, index, onViewAgenda }: CardProps) {
  const prefersReducedMotion = useReducedMotion();
  const { barber, todayAppointments, weekAppointments, estimatedRevenue, freeSlots, occupancyPct, topService, nextAppointment, isLowOccupancy } = workload;

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.07 }}
      className={`relative flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm
        ${isLowOccupancy ? "border-red-200" : "border-[#080A0F]/8"}
      `}
    >
      {/* Low occupancy alert */}
      {isLowOccupancy && (
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5">
          <AlertTriangle size={10} className="text-red-500" />
          <span className="text-[9px] font-black text-red-600">Baja ocupación</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#080A0F] text-[#D4AF37]">
          <Scissors size={16} />
        </div>
        <div>
          <h3 className="font-black text-[#080A0F]">{barber.name}</h3>
          {topService && (
            <p className="text-xs text-[#080A0F]/50">
              Servicio top: <span className="font-bold">{topService}</span>
            </p>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[#080A0F]/6 bg-[#F8F8F6] p-3">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-[#080A0F]/40" />
            <span className="text-[10px] font-black uppercase text-[#080A0F]/40">
              Hoy
            </span>
          </div>
          <p className="mt-1 text-2xl font-black text-[#080A0F]">
            {todayAppointments}
          </p>
          <p className="text-[10px] text-[#080A0F]/40">citas activas</p>
        </div>

        <div className="rounded-xl border border-[#080A0F]/6 bg-[#F8F8F6] p-3">
          <div className="flex items-center gap-1.5">
            <Users size={12} className="text-[#080A0F]/40" />
            <span className="text-[10px] font-black uppercase text-[#080A0F]/40">
              Semana
            </span>
          </div>
          <p className="mt-1 text-2xl font-black text-[#080A0F]">
            {weekAppointments}
          </p>
          <p className="text-[10px] text-[#080A0F]/40">citas activas</p>
        </div>

        <div className="rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-3">
          <div className="flex items-center gap-1.5">
            <Euro size={12} className="text-[#B88917]/70" />
            <span className="text-[10px] font-black uppercase text-[#B88917]/70">
              Ingresos
            </span>
          </div>
          <p className="mt-1 text-xl font-black text-[#080A0F]">
            {money(estimatedRevenue)}
          </p>
          <p className="text-[10px] text-[#080A0F]/40">esta semana</p>
        </div>

        <div className="rounded-xl border border-[#080A0F]/6 bg-[#F8F8F6] p-3">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-[#080A0F]/40" />
            <span className="text-[10px] font-black uppercase text-[#080A0F]/40">
              Huecos
            </span>
          </div>
          <p className="mt-1 text-2xl font-black text-emerald-600">
            {freeSlots}
          </p>
          <p className="text-[10px] text-[#080A0F]/40">disponibles</p>
        </div>
      </div>

      {/* Occupancy bar */}
      <div>
        <p className="mb-1.5 text-[10px] font-black uppercase tracking-wide text-[#080A0F]/40">
          Ocupación
        </p>
        <OccupancyBar pct={occupancyPct} />
      </div>

      {/* Next appointment */}
      {nextAppointment && (
        <div className="rounded-xl border border-[#080A0F]/6 bg-[#F8F8F6] px-3 py-2">
          <p className="text-[10px] font-black uppercase text-[#080A0F]/40">
            Próxima cita
          </p>
          <p className="mt-0.5 text-xs font-black text-[#080A0F]">
            {nextAppointment.client?.name ?? "Cliente"} ·{" "}
            {formatTime(nextAppointment.start_time)}
          </p>
          <p className="text-[10px] text-[#080A0F]/50">
            {nextAppointment.service?.name ?? "Sin servicio"}
          </p>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onViewAgenda(barber.id)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#080A0F]/10 bg-[#F8F8F6] px-3 py-2 text-xs font-black text-[#080A0F]/70 transition hover:bg-[#080A0F]/5"
        >
          <ArrowRight size={11} />
          Ver agenda
        </button>
        <a
          href="/dashboard/marketing"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/8 px-3 py-2 text-xs font-black text-[#B88917] transition hover:bg-[#D4AF37]/15"
        >
          <Megaphone size={11} />
          Campaña
        </a>
      </div>
    </motion.div>
  );
}

type Props = {
  workloads: BarberWorkload[];
  onViewBarberAgenda: (barberId: string) => void;
};

export function BarberWorkloadView({ workloads, onViewBarberAgenda }: Props) {
  if (workloads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#080A0F]/12 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F8F6]">
          <Users size={20} className="text-[#080A0F]/30" />
        </div>
        <p className="mt-4 font-black text-[#080A0F]">Sin barberos configurados</p>
        <p className="mt-1 text-sm text-[#080A0F]/50">
          Añade tu equipo en Configuración → Barberos para ver el análisis de carga.
        </p>
        <a
          href="/dashboard/barberos"
          className="mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-[#080A0F] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#1a1d26]"
        >
          <ArrowRight size={13} /> Añadir barberos
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-[#D4AF37]">
          Vista barberos
        </p>
        <p className="text-xs text-[#080A0F]/50">
          Rendimiento y carga por barbero esta semana
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {workloads.map((w, i) => (
          <BarberWorkloadCard
            key={w.barber.id}
            workload={w}
            index={i}
            onViewAgenda={onViewBarberAgenda}
          />
        ))}
      </div>
    </div>
  );
}
