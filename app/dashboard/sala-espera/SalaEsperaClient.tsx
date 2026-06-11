"use client";

import { useCallback, useState, useTransition } from "react";
import {
  Bell,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Euro,
  Plus,
  RefreshCw,
  Scissors,
  Trash2,
  User,
  X,
} from "lucide-react";
import { updateAppointmentStatus } from "@/app/dashboard/agenda/actions";
import { addToWaitlist, notifyWaitlistEntry, removeFromWaitlist } from "./actions";

// ─── Types ─────────────────────────────────────────────────────────────────────

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

type WaitlistEntry = {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  preferred_date: string;
  service_id: string | null;
  notified_at: string | null;
  expires_at: string;
  created_at: string;
};

type ServiceOption = { id: string; name: string };

type Props = {
  appointments: Appointment[];
  waitlistEntries: WaitlistEntry[];
  services: ServiceOption[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(t: string) { return t.slice(0, 5); }

function formatDateEs(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function daysSince(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  const then = new Date(y, m - 1, d).getTime();
  return Math.floor((Date.now() - then) / 86_400_000);
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
  const done    = appt.status === "completed";
  const inChair = appt.status === "confirmed";

  return (
    <div
      className={`flex items-start gap-4 rounded-2xl border p-4 transition-all duration-150 ${
        done
          ? "border-white/[0.04] bg-white/[0.02] opacity-50"
          : inChair
            ? "border-emerald-500/20 bg-emerald-500/[0.04]"
            : "border-white/[0.07] bg-white/[0.04] hover:border-white/[0.12]"
      }`}
    >
      {/* Time + status */}
      <div className="flex w-14 shrink-0 flex-col items-center gap-1 pt-0.5">
        <span className="text-[15px] font-black tabular-nums text-white/90">
          {formatTime(appt.start_time)}
        </span>
        <span
          className={`h-2 w-2 rounded-full ${
            done ? "bg-white/20" : inChair ? "bg-emerald-400" : "bg-amber-400"
          }`}
          aria-hidden="true"
        />
        <span
          className={`text-[10px] font-semibold ${
            done ? "text-white/30" : inChair ? "text-emerald-400" : "text-amber-400"
          }`}
        >
          {done ? "Listo" : inChair ? "En silla" : "Espera"}
        </span>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <User size={13} className="shrink-0 text-white/40" aria-hidden="true" />
          <p className="truncate text-[13px] font-bold text-white/90">
            {appt.clients?.name ?? "Cliente sin nombre"}
          </p>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
          {appt.services && (
            <span className="flex items-center gap-1 text-[11px] text-white/50">
              <Scissors size={10} aria-hidden="true" />
              {appt.services.name}
              {appt.services.duration_minutes && ` · ${appt.services.duration_minutes}min`}
            </span>
          )}
          {appt.services?.price != null && (
            <span className="flex items-center gap-1 text-[11px] text-[#D4AF37]/70">
              <Euro size={10} aria-hidden="true" />
              {appt.services.price}€
            </span>
          )}
          {appt.barbers && (
            <span className="text-[11px] text-white/40">{appt.barbers.name}</span>
          )}
        </div>
        {appt.notes && (
          <p className="mt-1 truncate text-[11px] italic text-white/35">{appt.notes}</p>
        )}
      </div>

      {/* Actions */}
      {!done && (
        <div className="flex shrink-0 flex-col gap-1.5">
          {!inChair && (
            <button
              type="button"
              onClick={() => onConfirm(appt.id)}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/25 bg-amber-500/[0.08] px-2.5 py-1.5 text-[11px] font-bold text-amber-400 transition hover:bg-amber-500/[0.15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
            >
              <Clock size={11} aria-hidden="true" />
              Llamar
            </button>
          )}
          {inChair && (
            <button
              type="button"
              onClick={() => onComplete(appt.id)}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] px-2.5 py-1.5 text-[11px] font-bold text-emerald-400 transition hover:bg-emerald-500/[0.15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
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

// ─── WaitlistCard ─────────────────────────────────────────────────────────────

function WaitlistCard({
  entry,
  serviceName,
  onNotify,
  onRemove,
}: {
  entry: WaitlistEntry;
  serviceName: string | null;
  onNotify: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const waitingDays = daysSince(entry.created_at.slice(0, 10));
  const isNotified  = !!entry.notified_at;

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.04] p-4 transition-all hover:border-white/[0.12]">
      {/* Date badge */}
      <div className="flex w-16 shrink-0 flex-col items-center gap-1 pt-0.5">
        <Calendar size={14} className="text-[#D4AF37]/60" aria-hidden="true" />
        <span className="text-center text-[10px] font-black leading-tight text-[#D4AF37] capitalize">
          {formatDateEs(entry.preferred_date)}
        </span>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[13px] font-bold text-white/90">{entry.client_name}</p>
          {isNotified && (
            <span className="shrink-0 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-emerald-400">
              Avisado
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[11px] text-white/45">{entry.client_email}</p>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
          {entry.client_phone && (
            <span className="text-[11px] text-white/40">{entry.client_phone}</span>
          )}
          {serviceName && (
            <span className="flex items-center gap-1 text-[11px] text-white/50">
              <Scissors size={10} aria-hidden="true" />
              {serviceName}
            </span>
          )}
          <span className="text-[11px] text-white/30">
            {waitingDays === 0 ? "Hoy" : `hace ${waitingDays}d`}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 flex-col gap-1.5">
        <button
          type="button"
          onClick={() => onNotify(entry.id)}
          title="Enviar email de aviso"
          className="flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.08] px-2.5 py-1.5 text-[11px] font-bold text-[#D4AF37] transition hover:bg-[#D4AF37]/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/30"
        >
          <Bell size={11} aria-hidden="true" />
          Avisar
        </button>
        <button
          type="button"
          onClick={() => onRemove(entry.id)}
          title="Eliminar de la lista"
          className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-2.5 py-1.5 text-[11px] font-bold text-red-400 transition hover:bg-red-500/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30"
        >
          <Trash2 size={11} aria-hidden="true" />
          Quitar
        </button>
      </div>
    </div>
  );
}

// ─── AddWaitlistForm ──────────────────────────────────────────────────────────

function AddWaitlistForm({
  services,
  onClose,
}: {
  services: ServiceOption[];
  onClose: () => void;
}) {
  const [, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [fields, setFields] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    preferred_date: "",
    service_id: "",
  });

  const set = (key: keyof typeof fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setFields((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => { if (v) fd.append(k, v); });
    startTransition(async () => {
      const res = await addToWaitlist(fd);
      if (res.success) {
        window.location.reload();
      } else {
        setFormError(res.error ?? "Error al guardar");
      }
    });
  };

  const inp =
    "w-full rounded-xl border border-white/[0.10] bg-[#0F1219] px-3 py-2 text-[13px] text-white/80 placeholder:text-white/25 focus:border-[#D4AF37]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20";
  const lbl =
    "mb-1.5 block text-[10px] font-black uppercase tracking-wide text-white/40";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.03] p-4"
    >
      {/* Form header */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-black uppercase tracking-wide text-[#D4AF37]/80">
          Añadir a lista de espera
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-white/30 transition hover:text-white/60"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Nombre *</label>
          <input
            className={inp}
            placeholder="Nombre del cliente"
            value={fields.client_name}
            onChange={set("client_name")}
            required
          />
        </div>
        <div>
          <label className={lbl}>Email *</label>
          <input
            type="email"
            className={inp}
            placeholder="email@ejemplo.com"
            value={fields.client_email}
            onChange={set("client_email")}
            required
          />
        </div>
        <div>
          <label className={lbl}>Teléfono</label>
          <input
            className={inp}
            placeholder="+34 600 000 000"
            value={fields.client_phone}
            onChange={set("client_phone")}
          />
        </div>
        <div>
          <label className={lbl}>Fecha preferida *</label>
          <input
            type="date"
            className={inp}
            value={fields.preferred_date}
            onChange={set("preferred_date")}
            required
          />
        </div>
        {services.length > 0 && (
          <div className="col-span-2">
            <label className={lbl}>Servicio (opcional)</label>
            <select
              className={inp}
              value={fields.service_id}
              onChange={set("service_id")}
            >
              <option value="">Cualquier servicio</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {formError && (
        <p className="mt-3 text-[11px] text-red-400">{formError}</p>
      )}

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-[#D4AF37] py-2.5 text-[12px] font-black text-[#080B14] transition hover:bg-[#C9A830] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/50"
      >
        Añadir a lista de espera
      </button>
    </form>
  );
}

// ─── SalaEsperaClient ─────────────────────────────────────────────────────────

export function SalaEsperaClient({
  appointments: initial,
  waitlistEntries: initialWaitlist,
  services,
}: Props) {
  const [appointments, setAppointments] = useState(initial);
  const [waitlist, setWaitlist]         = useState(initialWaitlist);
  const [tab, setTab]                   = useState<"cola" | "espera">("cola");
  const [showAddForm, setShowAddForm]   = useState(false);
  const [, startTransition]             = useTransition();

  const waiting   = appointments.filter((a) => a.status === "scheduled");
  const inChair   = appointments.filter((a) => a.status === "confirmed");
  const completed = appointments.filter((a) => a.status === "completed");

  const serviceMap = Object.fromEntries(services.map((s) => [s.id, s.name]));

  const updateStatus = useCallback(
    (id: string, status: "confirmed" | "completed") => {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
      startTransition(async () => {
        await updateAppointmentStatus(id, status);
      });
    },
    []
  );

  const handleNotify = (id: string) => {
    startTransition(async () => {
      await notifyWaitlistEntry(id);
      setWaitlist((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, notified_at: new Date().toISOString() } : e
        )
      );
    });
  };

  const handleRemove = (id: string) => {
    setWaitlist((prev) => prev.filter((e) => e.id !== id));
    startTransition(async () => {
      await removeFromWaitlist(id);
    });
  };

  const todayLabel = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-black tracking-tight text-white">
            Sala de espera
          </h1>
          <p className="mt-0.5 text-[13px] capitalize text-white/50">{todayLabel}</p>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          aria-label="Actualizar"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/40 transition hover:border-white/[0.15] hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        >
          <RefreshCw size={14} aria-hidden="true" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "En espera",   value: waiting.length,   color: "text-amber-400"   },
          { label: "En silla",    value: inChair.length,   color: "text-emerald-400" },
          { label: "Completados", value: completed.length, color: "text-white/60"    },
          { label: "Lista esp.",  value: waitlist.length,  color: "text-[#D4AF37]"   },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="flex flex-col items-center rounded-2xl border border-white/[0.06] bg-white/[0.03] py-3"
          >
            <span className={`text-[20px] font-black leading-none ${color}`}>
              {value}
            </span>
            <span className="mt-1 text-center text-[9px] font-semibold uppercase tracking-wide text-white/30">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] p-1">
        {(
          [
            { key: "cola",   label: "Cola del día",    count: waiting.length + inChair.length },
            { key: "espera", label: "Lista de espera", count: waitlist.length                 },
          ] as const
        ).map(({ key, label, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-[12px] font-bold transition ${
              tab === key
                ? "bg-white/[0.08] text-white"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {label}
            {count > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                  tab === key
                    ? "bg-[#D4AF37] text-[#080B14]"
                    : "bg-white/[0.08] text-white/50"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Cola del día ── */}
      {tab === "cola" && (
        <div className="space-y-4">
          {inChair.length > 0 && (
            <section>
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.15em] text-white/25">
                En silla ahora
              </p>
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

          <section>
            <p className="mb-2 text-[9px] font-black uppercase tracking-[0.15em] text-white/25">
              En espera{waiting.length > 0 ? ` · ${waiting.length}` : ""}
            </p>
            {waiting.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/[0.07] py-10 text-center">
                <Circle size={28} className="text-white/15" aria-hidden="true" />
                <p className="text-[13px] font-medium text-white/40">
                  Sin clientes en espera
                </p>
                <p className="text-[11px] text-white/25">
                  Las citas del día aparecerán aquí
                </p>
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

          {completed.length > 0 && (
            <section>
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.15em] text-white/25">
                Completados hoy
              </p>
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
      )}

      {/* ── Lista de espera ── */}
      {tab === "espera" && (
        <div className="space-y-3">
          {!showAddForm && (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#D4AF37]/25 py-3 text-[12px] font-bold text-[#D4AF37]/60 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/30"
            >
              <Plus size={14} aria-hidden="true" />
              Añadir cliente a lista de espera
            </button>
          )}

          {showAddForm && (
            <AddWaitlistForm
              services={services}
              onClose={() => setShowAddForm(false)}
            />
          )}

          {waitlist.length === 0 && !showAddForm ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/[0.07] py-10 text-center">
              <Circle size={28} className="text-white/15" aria-hidden="true" />
              <p className="text-[13px] font-medium text-white/40">
                Lista de espera vacía
              </p>
              <p className="text-[11px] text-white/25">
                Añade clientes que quieren ser avisados cuando haya un hueco libre
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {waitlist.map((entry) => (
                <WaitlistCard
                  key={entry.id}
                  entry={entry}
                  serviceName={
                    entry.service_id ? (serviceMap[entry.service_id] ?? null) : null
                  }
                  onNotify={handleNotify}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
