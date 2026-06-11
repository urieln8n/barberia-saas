"use client";

import { useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  User,
} from "lucide-react";

type Service = {
  id: string;
  name: string;
};

type Props = {
  barbershopId: string;
  barbershopName: string;
  services: Service[];
};

export function WaitlistForm({ barbershopId, barbershopName, services }: Props) {
  const [clientName, setClientName]       = useState("");
  const [clientEmail, setClientEmail]     = useState("");
  const [clientPhone, setClientPhone]     = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [serviceId, setServiceId]         = useState("");
  const [saving, setSaving]               = useState(false);
  const [submitted, setSubmitted]         = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !preferredDate) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/public/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barbershopId,
          clientName:    clientName.trim(),
          clientEmail:   clientEmail.trim(),
          clientPhone:   clientPhone.trim() || null,
          preferredDate,
          serviceId:     serviceId || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Error al apuntarte a la lista");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSaving(false);
    }
  }

  if (submitted) {
    return (
      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle2 size={32} className="text-[#D4AF37]" />
          <p className="font-black text-white">¡Apuntado!</p>
          <p className="text-sm leading-6 text-white/50">
            Te avisaremos por email si se libera un hueco en{" "}
            <span className="font-semibold text-white/70">{barbershopName}</span>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <Bell size={13} className="text-[#D4AF37]" />
        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/30">
          Lista de espera
        </p>
      </div>
      <p className="mb-4 text-xs leading-5 text-white/40">
        ¿No encuentras tu hueco? Apúntate y te avisamos por email si alguien cancela.
      </p>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Nombre */}
        <div className="relative">
          <User size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            placeholder="Tu nombre"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            maxLength={60}
            className="w-full rounded-xl border border-white/10 bg-white/[0.06] py-2.5 pl-8 pr-3 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#D4AF37]/40 focus:ring-1 focus:ring-[#D4AF37]/20"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="email"
            placeholder="Tu email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-white/[0.06] py-2.5 pl-8 pr-3 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#D4AF37]/40 focus:ring-1 focus:ring-[#D4AF37]/20"
          />
        </div>

        {/* Teléfono opcional */}
        <div className="relative">
          <Phone size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="tel"
            placeholder="Teléfono (opcional)"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            maxLength={20}
            className="w-full rounded-xl border border-white/10 bg-white/[0.06] py-2.5 pl-8 pr-3 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#D4AF37]/40 focus:ring-1 focus:ring-[#D4AF37]/20"
          />
        </div>

        {/* Fecha preferida */}
        <div className="relative">
          <CalendarDays size={12} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            min={today}
            max={maxDate}
            required
            className="w-full rounded-xl border border-white/10 bg-white/[0.06] py-2.5 pl-8 pr-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/40 focus:ring-1 focus:ring-[#D4AF37]/20 [color-scheme:dark]"
          />
        </div>

        {/* Servicio (opcional) */}
        {services.length > 0 && (
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0B1220] px-3 py-2.5 text-sm text-white/60 outline-none transition focus:border-[#D4AF37]/40 focus:ring-1 focus:ring-[#D4AF37]/20"
          >
            <option value="">Cualquier servicio</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        )}

        {error && (
          <p className="text-xs font-semibold text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37]/15 py-2.5 text-sm font-black text-[#D4AF37] transition hover:bg-[#D4AF37]/25 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Bell size={13} />
          )}
          {saving ? "Guardando..." : "Avisarme si hay hueco"}
        </button>
      </form>
    </section>
  );
}
