"use client";

import { useState } from "react";
import { Settings, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { upsertLoungeSettings } from "@/src/lib/lounge/upsert-lounge-settings";
import type { LoungeSettings } from "@/src/lib/lounge/get-lounge-settings";

type Props = {
  initialSettings: LoungeSettings | null;
};

type FormState = {
  welcome_title: string;
  welcome_description: string;
  show_booking: boolean;
  show_products: boolean;
  show_promos: boolean;
  show_reviews: boolean;
  show_whatsapp: boolean;
  google_review_url: string;
  whatsapp_url: string;
  is_active: boolean;
};

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 transition hover:border-white/[0.10]">
      <div>
        <p className="text-sm font-black text-white/85">{label}</p>
        {hint && <p className="text-xs text-white/45">{hint}</p>}
      </div>
      <div
        role="switch"
        aria-checked={checked}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-[#D4AF37]" : "bg-white/[0.10]"
        }`}
        onClick={() => onChange(!checked)}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </div>
    </label>
  );
}

export function LoungeSettingsClient({ initialSettings }: Props) {
  const [form, setForm] = useState<FormState>({
    welcome_title: initialSettings?.welcome_title ?? "",
    welcome_description: initialSettings?.welcome_description ?? "",
    show_booking: initialSettings?.show_booking ?? true,
    show_products: initialSettings?.show_products ?? true,
    show_promos: initialSettings?.show_promos ?? true,
    show_reviews: initialSettings?.show_reviews ?? true,
    show_whatsapp: initialSettings?.show_whatsapp ?? true,
    google_review_url: initialSettings?.google_review_url ?? "",
    whatsapp_url: initialSettings?.whatsapp_url ?? "",
    is_active: initialSettings?.is_active ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFeedback(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const result = await upsertLoungeSettings({
        welcome_title: form.welcome_title || undefined,
        welcome_description: form.welcome_description || undefined,
        show_booking: form.show_booking,
        show_products: form.show_products,
        show_promos: form.show_promos,
        show_reviews: form.show_reviews,
        show_whatsapp: form.show_whatsapp,
        google_review_url: form.google_review_url || undefined,
        whatsapp_url: form.whatsapp_url || undefined,
        is_active: form.is_active,
      });

      if (result.success) {
        setFeedback({ type: "success", message: "Configuración guardada correctamente." });
      } else {
        setFeedback({
          type: "error",
          message: result.error ?? "Error al guardar. Inténtalo de nuevo.",
        });
      }
    } catch {
      setFeedback({ type: "error", message: "Error inesperado. Inténtalo de nuevo." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Estado del Lounge */}
      <div className="surface-frame p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={16} className="text-[#C9922A]" />
          <p className="label-section">Estado del Lounge</p>
        </div>
        <Toggle
          label="Lounge activo"
          hint="Si está desactivado, la página pública no mostrará contenido."
          checked={form.is_active}
          onChange={(v) => setField("is_active", v)}
        />
      </div>

      {/* Mensajes de bienvenida */}
      <div className="surface-frame p-5 md:p-6">
        <div className="mb-4">
          <p className="label-section">Mensaje de bienvenida</p>
          <p className="section-subtext mt-1">
            Lo que verán tus clientes al abrir el Lounge desde el QR.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="welcome_title"
              className="mb-1.5 block text-xs font-black uppercase tracking-wide text-white/45"
            >
              Título (máx. 60 caracteres)
            </label>
            <input
              id="welcome_title"
              type="text"
              maxLength={60}
              value={form.welcome_title}
              onChange={(e) => setField("welcome_title", e.target.value)}
              placeholder="Mientras esperas, descubre más"
              className="w-full rounded-2xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/80 placeholder:text-white/25 focus:border-[#D4AF37]/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/15"
            />
            <p className="mt-1 text-right text-xs text-white/30">
              {form.welcome_title.length}/60
            </p>
          </div>

          <div>
            <label
              htmlFor="welcome_description"
              className="mb-1.5 block text-xs font-black uppercase tracking-wide text-white/45"
            >
              Descripción (máx. 120 caracteres)
            </label>
            <textarea
              id="welcome_description"
              maxLength={120}
              rows={3}
              value={form.welcome_description}
              onChange={(e) => setField("welcome_description", e.target.value)}
              placeholder="Reserva tu próxima cita, explora servicios premium y deja tu reseña."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#080A0F] placeholder:text-slate-400 focus:border-[#C9922A]/50 focus:outline-none focus:ring-2 focus:ring-[#C9922A]/20"
            />
            <p className="mt-1 text-right text-xs text-white/30">
              {form.welcome_description.length}/120
            </p>
          </div>
        </div>
      </div>

      {/* Secciones visibles */}
      <div className="surface-frame p-5 md:p-6">
        <div className="mb-4">
          <p className="label-section">Secciones visibles</p>
          <p className="section-subtext mt-1">
            Controla qué botones y secciones ven tus clientes en la página del Lounge.
          </p>
        </div>
        <div className="space-y-2">
          <Toggle
            label="Mostrar botón Reservar"
            hint="El CTA de reserva próxima cita"
            checked={form.show_booking}
            onChange={(v) => setField("show_booking", v)}
          />
          <Toggle
            label="Mostrar Productos"
            hint="Servicios y productos del menú"
            checked={form.show_products}
            onChange={(v) => setField("show_products", v)}
          />
          <Toggle
            label="Mostrar Promociones"
            hint="Las promociones activas de tu barbería"
            checked={form.show_promos}
            onChange={(v) => setField("show_promos", v)}
          />
          <Toggle
            label="Mostrar Reseñas Google"
            hint="Botón para dejar reseña en Google"
            checked={form.show_reviews}
            onChange={(v) => setField("show_reviews", v)}
          />
          <Toggle
            label="Mostrar WhatsApp"
            hint="Botón de contacto rápido por WhatsApp"
            checked={form.show_whatsapp}
            onChange={(v) => setField("show_whatsapp", v)}
          />
        </div>
      </div>

      {/* URLs de integración */}
      <div className="surface-frame p-5 md:p-6">
        <div className="mb-4">
          <p className="label-section">URLs de integración</p>
          <p className="section-subtext mt-1">
            Personaliza los enlaces de Google Reviews y WhatsApp para el Lounge.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="google_review_url"
              className="mb-1.5 block text-xs font-black uppercase tracking-wide text-white/45"
            >
              URL de Reseña Google (opcional)
            </label>
            <input
              id="google_review_url"
              type="url"
              value={form.google_review_url}
              onChange={(e) => setField("google_review_url", e.target.value)}
              placeholder="https://g.page/r/tu-barberia/review"
              className="w-full rounded-2xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/80 placeholder:text-white/25 focus:border-[#D4AF37]/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/15"
            />
          </div>

          <div>
            <label
              htmlFor="whatsapp_url"
              className="mb-1.5 block text-xs font-black uppercase tracking-wide text-white/45"
            >
              URL de WhatsApp (opcional)
            </label>
            <input
              id="whatsapp_url"
              type="url"
              value={form.whatsapp_url}
              onChange={(e) => setField("whatsapp_url", e.target.value)}
              placeholder="https://wa.me/34612345678"
              className="w-full rounded-2xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/80 placeholder:text-white/25 focus:border-[#D4AF37]/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/15"
            />
            <p className="mt-1 text-xs text-white/30">
              Si no lo configuras, se usará el teléfono de la barbería.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold ${
            feedback.type === "success"
              ? "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-400"
              : "border-red-500/20 bg-red-500/[0.08] text-red-400"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle size={16} className="shrink-0 text-red-500" />
          )}
          {feedback.message}
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="btn-gold inline-flex min-h-11 items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar configuración"
          )}
        </button>
      </div>
    </form>
  );
}
