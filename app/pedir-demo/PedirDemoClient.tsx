"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

const systems = ["WhatsApp", "Papel", "Google Calendar", "Booksy", "Treatwell", "Otro"];
const problems = [
  "Pocas reservas",
  "Demasiados mensajes manuales",
  "No controla caja",
  "No sabe qué barbero factura más",
  "Pierde clientes",
  "Quiere dejar de pagar comisiones",
  "Otro",
];
const interests = [
  "Ver demo",
  "Calcular ahorro",
  "Migrar desde Booksy",
  "Activar QR",
  "Controlar caja",
  "Barbería fundadora",
];

type Props = {
  initialInterest?: string;
};

type SubmitState = "idle" | "saving" | "success" | "duplicate" | "error";

function normalizeInterest(value?: string) {
  if (value === "barberia-fundadora") return "Barbería fundadora";
  return interests.includes(value ?? "") ? value : "Ver demo";
}

export function PedirDemoClient({ initialInterest }: Props) {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState("");
  const defaultInterest = useMemo(
    () => normalizeInterest(initialInterest),
    [initialInterest]
  );

  async function submit(formData: FormData) {
    setState("saving");
    setError(null);

    const payload = {
      name: String(formData.get("name") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? ""),
      email: String(formData.get("email") ?? ""),
      barbershopName: String(formData.get("barbershopName") ?? ""),
      city: String(formData.get("city") ?? ""),
      barbersCount: String(formData.get("barbersCount") ?? ""),
      currentSystem: String(formData.get("currentSystem") ?? ""),
      mainProblem: String(formData.get("mainProblem") ?? ""),
      interest: String(formData.get("interest") ?? ""),
      message: String(formData.get("message") ?? ""),
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
        setError(result.error ?? "No se pudo guardar la solicitud.");
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
      `Hola, acabo de solicitar una demo de BarberíaOS. Mi WhatsApp es ${whatsapp}.`
    );

    return (
      <section className="min-h-screen bg-[#05070d] px-5 py-10 text-white lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-white/[0.045] p-7 text-center shadow-2xl md:p-10">
          <CheckCircle2 className="mx-auto text-emerald-400" size={42} />
          <h1 className="mt-5 text-3xl font-black md:text-5xl">
            Solicitud recibida.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/62">
            {state === "duplicate"
              ? "Ya teníamos una solicitud con ese contacto. La mantenemos en el CRM para seguimiento."
              : "Tu barbería queda registrada como lead nuevo. El siguiente paso es revisar tu caso y proponerte una demo útil."}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={`${BUSINESS_CONFIG.whatsappUrl.split("?")[0]}?text=${text}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium-blue min-h-12 px-7"
            >
              Abrir WhatsApp <MessageCircle size={17} />
            </a>
            <Link href="/r/demo-barber" className="btn-ghost premium-cta-glass min-h-12 px-7">
              Ver demo interactiva <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070d] px-5 py-10 text-white lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <section className="lg:sticky lg:top-8">
          <Link href="/" className="text-sm font-black text-[#D5A84C]">
            BarberíaOS
          </Link>
          <p className="mt-10 text-xs font-black uppercase text-[#38BDF8]">
            Diagnóstico gratis
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">
            Pide una demo aplicada a tu barbería.
          </h1>
          <p className="mt-5 text-base leading-8 text-white/62">
            Cuéntanos cómo reservas hoy y qué quieres controlar. Guardamos el lead
            en el CRM y después abrimos WhatsApp si quieres acelerar la respuesta.
          </p>
          <div className="mt-6 grid gap-3">
            {["Sin comisión por reserva", "QR y reservas sin app", "Caja, clientes y barberos en un panel"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-bold text-white/72">
                <ShieldCheck size={16} className="text-[#38BDF8]" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <form action={submit} className="rounded-[32px] border border-white/10 bg-white p-5 text-[#111827] shadow-2xl md:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre" name="name" required />
            <Field label="WhatsApp" name="whatsapp" type="tel" required />
            <Field label="Email opcional" name="email" type="email" />
            <Field label="Nombre de barbería" name="barbershopName" required />
            <Field label="Ciudad" name="city" required />
            <Field label="Número de barberos" name="barbersCount" required />
            <Select label="Sistema actual" name="currentSystem" options={systems} />
            <Select label="Principal problema" name="mainProblem" options={problems} />
            <Select label="Interés" name="interest" options={interests} defaultValue={defaultInterest ?? "Ver demo"} />
          </div>
          <label className="mt-4 block text-sm font-semibold text-neutral-700">
            Mensaje adicional
            <textarea
              name="message"
              rows={4}
              className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
              placeholder="Ej: tengo 3 barberos, uso Booksy y quiero pasar las reservas a mi propio canal."
            />
          </label>
          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={state === "saving"}
            className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0F172A] disabled:opacity-50"
          >
            {state === "saving" ? "Guardando solicitud..." : "Pedir diagnóstico gratis"}
            <ArrowRight size={17} />
          </button>
          <p className="mt-3 text-center text-xs leading-5 text-neutral-500">
            Al enviar aceptas que BarberíaOS contacte contigo para gestionar la demo. Sin spam.
          </p>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-neutral-700">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
      />
    </label>
  );
}

function Select({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-neutral-700">
      {label}
      <select
        name={name}
        required
        defaultValue={defaultValue ?? options[0]}
        className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
