"use client";

import { useCallback, useState, useTransition } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Euro,
  RefreshCw,
  Scissors,
  User,
} from "lucide-react";
import { updateAppointmentStatus } from "@/app/dashboard/agenda/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type Client  = { id: string; name: string; phone: string | null } | null;
type Service = { id: string; name: string; duration_minutes: number | null; price: number | null } | null;
type Barber  = { id: string; name: string } | null;

type Appointment = {
  id: string;
  start_time: string;
  end_time: string | null;
  status: string;
  notes: string | null;
  clients: Client;
  services: Service;
  barbers: Barber;
};

type Props = {
  appointments: Appointment[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  pending:   { label: "Pendiente",  color: "text-amber-600",  dot: "bg-amber-400" },
  scheduled: { label: "Programada", color: "text-blue-600",   dot: "bg-blue-400"  },
  confirmed: { label: "Confirmada", color: "text-green-600",  dot: "bg-green-400" },
  completed: { label: "Completada", color: "text-slate-400",  dot: "bg-slate-300" },
};

function formatTime(t: string) {
  return t.slice(0, 5);
}

// ─── TurnCard ─────────────────────────────────────────────────────────────────

function TurnCard({
  appt,
  onComplete,
  onConfirm,
}: {
  appt: Appointment;
  onComplete: (id: string) => void;
  onConfirm: (id: string) => void;
}) {
  const cfg      = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.scheduled;
  const done     = appt.status === "completed";
  const waiting  = appt.status === "pending" || appt.status === "scheduled";
  const inChair  = appt.status === "confirmed";

  return (
    <div
      className={`group flex items-start gap-4 rounded-2xl border bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all duration-150 ${
        done
          ? "border-slate-100 opacity-55 grayscale-[30%]"
          : inChair
            ? "border-[#B88A2A]/30 bg-[#FDFBF5]"
            : "border-[#EAE4D8] hover:border-[#D4C9B5] hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)]"
      }`}
    >
      {/* Status indicator + time */}
      <div className="flex w-14 shrink-0 flex-col items-center gap-1 pt-0.5">
        <span className="text-[15px] font-black tabular-nums text-[#151515]">
          {formatTime(appt.start_time)}
        </span>
        <span className={`h-2 w-2 rounded-full ${cfg.dot}`} aria-hidden="true" />
        <span className={`text-[10px] font-semibold ${cfg.color}`}>{cfg.label}</span>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <User size={13} className="shrink-0 text-[#6F6F6F]" aria-hidden="true" />
          <p className="truncate text-[13px] font-bold text-[#151515]">
            {appt.clients?.name ?? "Cliente sin nombre"}
          </p>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
          {appt.services && (
            <span className="flex items-center gap-1 text-[11px] text-[#6F6F6F]">
              <Scissors size={10} aria-hidden="true" />
              {appt.services.name}
              {appt.services.duration_minutes && ` · ${appt.services.duration_minutes} min`}
            </span>
          )}
          {appt.services?.price && (
            <span className="flex items-center gap-1 text-[11px] text-[#6F6F6F]">
              <Euro size={10} aria-hidden="true" />
              {appt.services.price}€
            </span>
          )}
          {appt.barbers && (
            <span className="flex items-center gap-1 text-[11px] text-[#6F6F6F]">
              <Scissors size={10} aria-hidden="true" />
              {appt.barbers.name}
            </span>
          )}
        </div>
        {appt.notes && (
          <p className="mt-1 truncate text-[11px] italic text-[#6F6F6F]">{appt.notes}</p>
        )}
      </div>

      {/* Actions */}
      {!done && (
        <div className="flex shrink-0 flex-col gap-1.5">
          {waiting && (
            <button
              type="button"
              onClick={() => onConfirm(appt.id)}
              aria-label="Llamar al cliente — pasar a silla"
              className="flex items-center gap-1.5 rounded-xl border border-[#B88A2A]/40 bg-[#F3E7C9]/60 px-2.5 py-1.5 text-[11px] font-bold text-[#A87412] transition hover:bg-[#F3E7C9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A2A]"
            >
              <Clock size={11} aria-hidden="true" />
              Llamar
            </button>
          )}
          {inChair && (
            <button
              type="button"
              onClick={() => onComplete(appt.id)}
              aria-label="Marcar como completado"
              className="flex items-center gap-1.5 rounded-xl border border-green-200 bg-green-50 px-2.5 py-1.5 text-[11px] font-bold text-green-700 transition hover:bg-green-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
            >
              <CheckCircle2 size={11} aria-hidden="true" />
              Listo
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SalaEsperaClient ─────────────────────────────────────────────────────────

export function SalaEsperaClient({ appointments: initial }: Props) {
  const [appointments, setAppointments] = useState(initial);
  const [, startTransition] = useTransition();

  const waiting   = appointments.filter((a) => a.status === "scheduled");
  const inChair   = appointments.filter((a) => a.status === "confirmed");
  const completed = appointments.filter((a) => a.status === "completed");

  const updateStatus = useCallback((id: string, status: "confirmed" | "completed") => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    startTransition(async () => {
      await updateAppointmentStatus(id, status);
    });
  }, []);

  const handleRefresh = () => { window.location.reload(); };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-black tracking-tight text-[#151515]">Sala de espera</h1>
          <p className="mt-0.5 text-[13px] text-[#6F6F6F]">
            Cola de turnos del día — {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          aria-label="Actualizar lista"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAE4D8] bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A2A] focus-visible:ring-offset-1"
        >
          <RefreshCw size={14} aria-hidden="true" />
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "En espera", value: waiting.length,   color: "text-amber-600"  },
          { label: "En silla",  value: inChair.length,   color: "text-[#B88A2A]"  },
          { label: "Completos", value: completed.length, color: "text-green-600"  },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex flex-col items-center rounded-2xl border border-[#EAE4D8] bg-white py-3 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
            <span className={`text-[22px] font-black leading-none ${color}`}>{value}</span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#6F6F6F]">{label}</span>
          </div>
        ))}
      </div>

      {/* En silla */}
      {inChair.length > 0 && (
        <section>
          <p className="mb-2 text-[9px] font-black uppercase tracking-[0.15em] text-[#B8A990]">En silla ahora</p>
          <div className="flex flex-col gap-2">
            {inChair.map((a) => (
              <TurnCard
                key={a.id}
                appt={a}
                onComplete={(id) => updateStatus(id, "completed")}
                onConfirm={(id) => updateStatus(id, "confirmed")}
              />
            ))}
          </div>
        </section>
      )}

      {/* En espera */}
      <section>
        <p className="mb-2 text-[9px] font-black uppercase tracking-[0.15em] text-[#B8A990]">
          En espera{waiting.length > 0 ? ` · ${waiting.length}` : ""}
        </p>
        {waiting.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#EAE4D8] py-10 text-center">
            <Circle size={28} className="text-[#D4C9B5]" aria-hidden="true" />
            <p className="text-[13px] font-medium text-[#6F6F6F]">Sin clientes en espera</p>
            <p className="text-[11px] text-[#B8A990]">Las nuevas citas aparecerán aquí</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {waiting.map((a) => (
              <TurnCard
                key={a.id}
                appt={a}
                onComplete={(id) => updateStatus(id, "completed")}
                onConfirm={(id) => updateStatus(id, "confirmed")}
              />
            ))}
          </div>
        )}
      </section>

      {/* Completados */}
      {completed.length > 0 && (
        <section>
          <p className="mb-2 text-[9px] font-black uppercase tracking-[0.15em] text-[#B8A990]">Completados hoy</p>
          <div className="flex flex-col gap-2">
            {completed.map((a) => (
              <TurnCard
                key={a.id}
                appt={a}
                onComplete={(id) => updateStatus(id, "completed")}
                onConfirm={(id) => updateStatus(id, "confirmed")}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
