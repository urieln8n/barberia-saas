"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings, ShieldCheck, X } from "lucide-react";

type CookiePreferences = {
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "barberiaos:cookie-consent";

const defaultPreferences: CookiePreferences = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
};

function savePreferences(preferences: CookiePreferences) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...preferences,
      savedAt: new Date().toISOString(),
      version: 1,
    })
  );
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      setVisible(!stored);
    } catch {
      setVisible(false);
    }
  }, []);

  if (!visible) return null;

  function acceptAll() {
    const next = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
    } satisfies CookiePreferences;

    savePreferences(next);
    setVisible(false);
  }

  function rejectOptional() {
    savePreferences(defaultPreferences);
    setVisible(false);
  }

  function saveCustom() {
    savePreferences({ ...preferences, necessary: true });
    setVisible(false);
  }

  function toggle(key: keyof Omit<CookiePreferences, "necessary">) {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  return (
    <div className="fixed bottom-0 left-4 right-4 z-[80] pb-4 sm:left-5 sm:right-5">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(8,10,15,0.24)]">
        <div className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:p-6">
          <div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#2563EB]/10 text-[#2563EB]">
                <ShieldCheck size={18} />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-black text-[#080A0F]">Privacidad y cookies</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Usamos cookies necesarias para que BarberiaOS funcione. Las cookies de preferencias, analiticas o marketing solo se activaran si las aceptas.
                </p>
                <Link href="/legal/cookies" className="mt-2 inline-flex text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8]">
                  Ver politica de cookies
                </Link>
              </div>
            </div>

            {configOpen && (
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { key: "preferences", title: "Preferencias", text: "Recuerda ajustes no esenciales." },
                  { key: "analytics", title: "Analiticas", text: "Ayuda a medir uso agregado." },
                  { key: "marketing", title: "Marketing", text: "Permite medir campanas." },
                ].map((item) => {
                  const key = item.key as keyof Omit<CookiePreferences, "necessary">;

                  return (
                    <label key={item.key} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <input
                        type="checkbox"
                        checked={preferences[key]}
                        onChange={() => toggle(key)}
                        className="mt-1 h-4 w-4 shrink-0 accent-[#2563EB]"
                      />
                      <span>
                        <span className="block text-sm font-black text-[#080A0F]">{item.title}</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">{item.text}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 md:min-w-48">
            <button type="button" onClick={acceptAll} className="btn-primary">
              Aceptar todas
            </button>
            <button type="button" onClick={rejectOptional} className="btn-outline">
              Rechazar no necesarias
            </button>
            {configOpen ? (
              <button type="button" onClick={saveCustom} className="btn-dark">
                Guardar preferencias
              </button>
            ) : (
              <button type="button" onClick={() => setConfigOpen(true)} className="btn-ghost">
                <Settings size={16} />
                Configurar
              </button>
            )}
            <button type="button" onClick={() => setVisible(false)} aria-label="Cerrar banner de cookies" className="btn-ghost md:hidden">
              <X size={16} />
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
