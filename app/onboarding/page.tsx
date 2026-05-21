"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Scissors, Store, MapPin, Phone, Link2 } from "lucide-react";
import { createBarbershop } from "./actions";
import { getConfiguredSiteUrl } from "@/src/lib/site-url";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const ERROR_MESSAGES: Record<string, string> = {
  required: "El nombre y la URL de la barbería son obligatorios.",
  slug:     "Esa URL ya está en uso. Elige un slug distinto.",
  server:   "Error del servidor al guardar. Inténtalo de nuevo.",
};

function OnboardingForm() {
  const searchParams  = useSearchParams();
  const errorCode     = searchParams.get("error");
  const errorMessage  = errorCode ? (ERROR_MESSAGES[errorCode] ?? "Error inesperado. Inténtalo de nuevo.") : null;

  const [name, setName]             = useState("");
  const [slug, setSlug]             = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [isLoading, setIsLoading]   = useState(false);

  const appUrl = getConfiguredSiteUrl();

  function handleNameChange(value: string) {
    setName(value);
    if (!slugEdited) setSlug(toSlug(value));
  }

  function handleSlugChange(value: string) {
    setSlugEdited(true);
    setSlug(toSlug(value));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createBarbershop(formData);
    } catch {
      // Si la acción lanza inesperadamente (redirect() no lanza en cliente)
      setIsLoading(false);
    }
  }

  return (
    <main className="premium-grid-bg flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#2563EB]/15 bg-[#2563EB] text-white shadow-[0_14px_34px_rgba(37,99,235,0.26)]">
            <Scissors size={20} />
          </div>
          <span className="text-xl font-black text-[#050A14]">BarberíaOS</span>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-[var(--shadow-card)] md:p-8">
          <h1 className="text-2xl font-black text-[#111111]">Crea tu barbería</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Configura los datos básicos. Podrás cambiarlos después.
          </p>

          {errorMessage && (
            <div role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">

            <div>
              <label className="form-label flex items-center gap-2">
                <Store size={14} /> Nombre de la barbería
              </label>
              <input
                name="name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Barbería El Maestro"
                required
                disabled={isLoading}
                className="input py-3 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="form-label flex items-center gap-2">
                <Link2 size={14} /> URL de reservas
              </label>
              <div className="flex items-center rounded-xl border border-[#E6E6E2] px-4 py-3 text-sm transition-colors focus-within:border-[#2F6FEB] focus-within:ring-2 focus-within:ring-[#2F6FEB]/10">
                <span className="shrink-0 text-neutral-400">{appUrl}/r/</span>
                <input
                  name="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="mi-barberia"
                  required
                  disabled={isLoading}
                  className="min-w-0 flex-1 outline-none disabled:opacity-60"
                />
              </div>
              {slug && (
                <p className="mt-1 text-xs text-neutral-400">
                  Tus clientes reservarán en:{" "}
                  <span className="font-semibold text-[#111111]">{appUrl}/r/{slug}</span>
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="form-label flex items-center gap-2">
                  <Phone size={14} /> Teléfono
                </label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="+34 600 000 000"
                  disabled={isLoading}
                  className="input py-3 disabled:opacity-60"
                />
              </div>
              <div>
                <label className="form-label flex items-center gap-2">
                  <MapPin size={14} /> Ciudad
                </label>
                <input
                  name="city"
                  type="text"
                  placeholder="Madrid"
                  disabled={isLoading}
                  className="input py-3 disabled:opacity-60"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary mt-2 w-full py-3 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Guardando..." : "Crear mi barbería →"}
            </button>

            <p className="text-xs leading-5 text-neutral-500">
              Al crear tu barbería confirmas que has leído la{" "}
              <Link href="/legal/privacidad" className="font-bold text-[#2F6FEB] hover:text-[#1D4ED8]">
                Política de Privacidad
              </Link>{" "}
              y aceptas los{" "}
              <Link href="/legal/terminos" className="font-bold text-[#2F6FEB] hover:text-[#1D4ED8]">
                Términos y Condiciones
              </Link>
              .
            </p>
          </form>
        </div>

        <p className="mt-4 text-center text-xs font-semibold text-slate-500">
          Paso 1 de 1 — Solo tarda 30 segundos.
        </p>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingForm />
    </Suspense>
  );
}
