"use client";

import Link from "next/link";
import { useState } from "react";
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

export default function OnboardingPage() {
  const [name, setName]   = useState("");
  const [slug, setSlug]   = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugEdited) setSlug(toSlug(value));
  }

  function handleSlugChange(value: string) {
    setSlugEdited(true);
    setSlug(toSlug(value));
  }

  const appUrl = getConfiguredSiteUrl();

  return (
    <main className="premium-grid-bg flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/70 bg-[#2F6FEB] text-white">
            <Scissors size={20} />
          </div>
          <span className="text-xl font-bold text-white">BarberíaOS</span>
        </div>

        <div className="rounded-2xl border border-[#E6E6E2] bg-white p-8 shadow-2xl">
          <h1 className="text-2xl font-black text-[#111111]">Crea tu barbería</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Configura los datos básicos. Podrás cambiarlos después.
          </p>

          <form action={createBarbershop} className="mt-6 flex flex-col gap-4">

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
                className="input py-3"
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
                  className="min-w-0 flex-1 outline-none"
                />
              </div>
              {slug && (
                <p className="mt-1 text-xs text-neutral-400">
                  Tus clientes reservarán en: <span className="font-semibold text-[#111111]">{appUrl}/r/{slug}</span>
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
                  className="input py-3"
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
                  className="input py-3"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary mt-2 w-full py-3"
            >
              Crear mi barbería →
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

        <p className="mt-4 text-center text-xs text-white/30">
          Paso 1 de 1 — Solo tarda 30 segundos.
        </p>
      </div>
    </main>
  );
}
