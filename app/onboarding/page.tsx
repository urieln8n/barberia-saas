"use client";

import { useState } from "react";
import { Scissors, Store, MapPin, Phone, Link2 } from "lucide-react";
import { createBarbershop } from "./actions";

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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-12">
      <div className="w-full max-w-lg">

        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold text-ink">
            <Scissors size={20} />
          </div>
          <span className="text-xl font-bold text-white">BarberíaOS</span>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <h1 className="text-2xl font-black text-ink">Crea tu barbería</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Configura los datos básicos. Podrás cambiarlos después.
          </p>

          <form action={createBarbershop} className="mt-6 flex flex-col gap-4">

            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                <Store size={14} /> Nombre de la barbería
              </label>
              <input
                name="name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Barbería El Maestro"
                required
                className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                <Link2 size={14} /> URL de reservas
              </label>
              <div className="flex items-center rounded-2xl border border-neutral-200 px-4 py-3 text-sm focus-within:border-ink">
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
                  Tus clientes reservarán en: <span className="font-semibold text-ink">{appUrl}/r/{slug}</span>
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                  <Phone size={14} /> Teléfono
                </label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="+34 600 000 000"
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink"
                />
              </div>
              <div>
                <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                  <MapPin size={14} /> Ciudad
                </label>
                <input
                  name="city"
                  type="text"
                  placeholder="Madrid"
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-2xl bg-ink py-3 font-semibold text-white transition-opacity hover:opacity-80"
            >
              Crear mi barbería →
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-white/30">
          Paso 1 de 1 — Solo tarda 30 segundos.
        </p>
      </div>
    </main>
  );
}
