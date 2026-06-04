"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Mail,
  Send,
  XCircle,
} from "lucide-react";

const EMAIL_TYPES = [
  {
    value: "confirmation",
    label: "Confirmación de reserva",
    description: "Email que recibe el cliente tras reservar.",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    value: "cancellation",
    label: "Cancelación de reserva",
    description: "Email que recibe el cliente cuando se cancela su cita.",
    color: "text-red-700 bg-red-50 border-red-200",
  },
  {
    value: "owner",
    label: "Notificación al dueño",
    description: "Email que recibe el dueño cuando llega una reserva nueva.",
    color: "text-blue-700 bg-blue-50 border-blue-200",
  },
  {
    value: "reminder",
    label: "Recordatorio 24h antes",
    description: "Email automático que se envía el día anterior a la cita.",
    color: "text-amber-700 bg-amber-50 border-amber-200",
  },
] as const;

type EmailType = (typeof EMAIL_TYPES)[number]["value"];

export default function EmailsTestPage() {
  const [to,      setTo]      = useState("");
  const [type,    setType]    = useState<EmailType>("confirmation");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<{ ok: boolean; message: string } | null>(null);

  async function handleSend() {
    if (!to.trim()) { setResult({ ok: false, message: "Introduce un email de destino." }); return; }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/internal/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, to: to.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({ ok: true, message: `Email "${EMAIL_TYPES.find(e => e.value === type)?.label}" enviado a ${to.trim()}.` });
      } else {
        setResult({ ok: false, message: data.error ?? "Error desconocido." });
      }
    } catch {
      setResult({ ok: false, message: "Error de red. Comprueba la consola." });
    }

    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-[#C9922A]">Panel de pruebas</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Probar emails</h1>
        <p className="mt-1 text-sm text-slate-500">
          Envía emails de prueba con datos de demo para verificar que Resend está conectado y los templates son correctos.
        </p>
      </div>

      {/* Aviso RESEND_API_KEY */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <p className="font-black">Requisitos previos</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5 text-amber-700">
          <li><code className="text-xs">RESEND_API_KEY</code> configurada en Vercel env vars o en <code className="text-xs">.env.local</code></li>
          <li><code className="text-xs">RESEND_FROM_EMAIL</code> con dominio verificado en Resend</li>
        </ul>
      </div>

      {/* Selector de tipo */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">Tipo de email</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {EMAIL_TYPES.map((e) => (
            <button
              key={e.value}
              type="button"
              onClick={() => { setType(e.value); setResult(null); }}
              className={`rounded-2xl border p-4 text-left transition-all ${
                type === e.value
                  ? e.color + " ring-1 ring-current"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <p className="font-black text-sm">{e.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{e.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Email de destino */}
      <div>
        <label htmlFor="email-to" className="mb-1 block text-sm font-semibold text-slate-700">
          Enviar a (tu email)
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="email-to"
              type="email"
              value={to}
              onChange={(e) => { setTo(e.target.value); setResult(null); }}
              placeholder="tu@email.com"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
            />
          </div>
          <button
            type="button"
            onClick={handleSend}
            disabled={loading || !to.trim()}
            className="flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-black text-white transition hover:bg-slate-700 active:scale-95 disabled:opacity-40"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            Enviar prueba
          </button>
        </div>
      </div>

      {/* Resultado */}
      {result && (
        <div className={`flex items-start gap-3 rounded-2xl border p-4 ${
          result.ok
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-red-200 bg-red-50 text-red-800"
        }`}>
          {result.ok
            ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
            : <XCircle size={18} className="mt-0.5 shrink-0 text-red-600" />}
          <p className="text-sm font-semibold">{result.message}</p>
        </div>
      )}

      {/* Info sobre el cron */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-black text-slate-700">Probar cron de recordatorios 24h</p>
        <p className="mt-1 text-xs text-slate-500">
          El recordatorio automático no se puede enviar desde aquí (necesita citas de mañana en la BD). Para probarlo manualmente:
        </p>
        <code className="mt-2 block rounded-xl bg-slate-900 px-4 py-3 text-xs text-emerald-400">
          curl -X GET /api/internal/cron-reminders \<br />
          {"  "}-H &quot;Authorization: Bearer TU_CRON_SECRET&quot;
        </code>
      </div>
    </div>
  );
}
