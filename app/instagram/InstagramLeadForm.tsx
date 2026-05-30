"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

type SubmitState = "idle" | "saving" | "success" | "duplicate" | "error";

function readUtm() {
  if (typeof window === "undefined") {
    return {
      utmSource: "instagram",
      utmMedium: "organic_social",
      utmCampaign: "",
      utmContent: "",
      landingPath: "/instagram",
    };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") || "instagram",
    utmMedium: params.get("utm_medium") || "organic_social",
    utmCampaign: params.get("utm_campaign") || "instagram_landing",
    utmContent: params.get("utm_content") || "",
    landingPath: `${window.location.pathname}${window.location.search}`,
  };
}

export function InstagramLeadForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState("");

  async function submit(formData: FormData) {
    setState("saving");
    setError(null);

    const payload = {
      name: String(formData.get("name") ?? ""),
      barbershopName: String(formData.get("barbershopName") ?? ""),
      city: String(formData.get("city") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? ""),
      barbersCount: String(formData.get("barbersCount") ?? ""),
      source: "instagram",
      interest: "Pedir demo",
      mainProblem: "Lead desde Instagram",
      currentSystem: "No indicado",
      message: "",
      ...readUtm(),
    };

    setWhatsapp(payload.whatsapp);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        setState("error");
        setError(result.error ?? "No se pudo guardar el lead.");
        return;
      }

      setState(result.duplicated ? "duplicate" : "success");
    } catch {
      setState("error");
      setError("No se pudo conectar con el servidor. Inténtalo de nuevo.");
    }
  }

  if (state === "success" || state === "duplicate") {
    const text = encodeURIComponent(
      `Hola, vengo de Instagram y quiero pedir una demo de BarberíaOS. Mi WhatsApp es ${whatsapp}.`,
    );

    return (
      <div className="rounded-[28px] border border-[#D5A84C]/25 bg-white/[0.06] p-5 text-center shadow-[0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur md:p-7">
        <CheckCircle2 className="mx-auto text-emerald-400" size={40} />
        <h2 className="mt-4 text-2xl font-black text-white">Demo solicitada</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/62">
          {state === "duplicate"
            ? "Ya teníamos ese contacto en el CRM. Lo mantenemos para seguimiento."
            : "Guardamos tu solicitud como lead de Instagram. Puedes abrir WhatsApp para acelerar la conversación."}
        </p>
        <a
          href={`${BUSINESS_CONFIG.whatsappUrl.split("?")[0]}?text=${text}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#D5A84C] px-5 py-3 text-sm font-black text-[#080A0F] transition hover:bg-[#E8C675]"
        >
          Abrir WhatsApp <MessageCircle size={17} />
        </a>
      </div>
    );
  }

  return (
    <form
      action={submit}
      className="rounded-[28px] border border-[#D5A84C]/22 bg-white p-4 text-[#111827] shadow-[0_28px_80px_rgba(0,0,0,0.35)] md:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#B88917]">
            Demo BarberíaOS
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight">Pide tu demo</h2>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase text-emerald-700">
          Instagram
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Field label="Nombre" name="name" autoComplete="name" required />
        <Field label="WhatsApp" name="whatsapp" type="tel" autoComplete="tel" required />
        <Field label="Barbería" name="barbershopName" required />
        <Field label="Ciudad" name="city" autoComplete="address-level2" required />
        <label className="block text-sm font-semibold text-neutral-700 sm:col-span-2">
          Número de barberos
          <select
            name="barbersCount"
            required
            defaultValue=""
            className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B88917] focus:ring-2 focus:ring-[#D5A84C]/20"
          >
            <option value="" disabled>Selecciona una opción</option>
            <option value="1">1 barbero</option>
            <option value="2-3">2-3 barberos</option>
            <option value="4-6">4-6 barberos</option>
            <option value="7+">7+ barberos</option>
          </select>
        </label>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "saving"}
        className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#080A0F] px-5 py-3 text-sm font-black text-[#D5A84C] transition hover:bg-[#111827] disabled:opacity-55"
      >
        {state === "saving" ? "Guardando..." : "Pedir demo"}
        <ArrowRight size={17} />
      </button>
      <p className="mt-3 text-center text-xs leading-5 text-neutral-500">
        Guardamos el origen Instagram y te contactamos para coordinar la demo. Sin spam.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-neutral-700">
      {label}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-[#B88917] focus:ring-2 focus:ring-[#D5A84C]/20"
      />
    </label>
  );
}
