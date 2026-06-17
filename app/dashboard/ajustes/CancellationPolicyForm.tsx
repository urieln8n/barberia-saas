"use client";

import { useState } from "react";
import { ShieldCheck, Save, CheckCircle2 } from "lucide-react";

type Props = {
  barbershopId: string;
  initialCancelBeforeHours: number | null;
  initialPolicyText: string | null;
};

const HOUR_OPTIONS = [
  { value: "", label: "Sin restricción — cancelación libre" },
  { value: "2",  label: "2 horas antes" },
  { value: "6",  label: "6 horas antes" },
  { value: "12", label: "12 horas antes" },
  { value: "24", label: "24 horas antes (recomendado)" },
  { value: "48", label: "48 horas antes" },
];

export function CancellationPolicyForm({ barbershopId, initialCancelBeforeHours, initialPolicyText }: Props) {
  const [cancelHours, setCancelHours]   = useState(String(initialCancelBeforeHours ?? ""));
  const [policyText,  setPolicyText]    = useState(initialPolicyText ?? "");
  const [saving,      setSaving]        = useState(false);
  const [saved,       setSaved]         = useState(false);
  const [error,       setError]         = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    const res = await fetch("/api/internal/cancellation-policy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        barbershopId,
        cancelBeforeHours: cancelHours ? parseInt(cancelHours, 10) : null,
        cancellationPolicyText: policyText.trim() || null,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Error al guardar. Inténtalo de nuevo.");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-white/70">
          Plazo mínimo de cancelación
        </label>
        <select
          value={cancelHours}
          onChange={(e) => setCancelHours(e.target.value)}
          className="input-field py-3"
        >
          {HOUR_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <p className="mt-1 text-xs text-white/40">
          Si configuras un plazo, el cliente verá esta restricción al confirmar su reserva y deberá aceptarla.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-white/70">
          Texto personalizado de política (opcional)
        </label>
        <textarea
          value={policyText}
          onChange={(e) => setPolicyText(e.target.value)}
          rows={3}
          maxLength={400}
          placeholder="Ej: Se puede cancelar hasta 24h antes. Los no-shows reiterados pueden bloquear futuras reservas."
          className="input-field resize-none py-3"
        />
        <p className="mt-1 text-xs text-white/40">
          Si lo dejas vacío se usa el texto automático según el plazo configurado.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-500/[0.08] px-4 py-3 text-sm text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 rounded-2xl bg-[#D4AF37] px-5 py-3 text-sm font-black text-[#09090B] transition hover:bg-[#C9A130] disabled:opacity-40"
      >
        {saved
          ? <><CheckCircle2 size={15} className="text-emerald-400" /> Guardado</>
          : <><Save size={14} /> {saving ? "Guardando..." : "Guardar política"}</>
        }
      </button>
    </form>
  );
}
