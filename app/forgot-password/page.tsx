"use client";

import Link from "next/link";
import { useState } from "react";
import { Scissors, ArrowLeft, Mail } from "lucide-react";
import { supabase } from "@/src/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : "/reset-password";

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setError("No se pudo enviar el enlace de recuperación. Revisa el correo e inténtalo de nuevo.");
        return;
      }

      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="premium-grid-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/70 bg-[#2F6FEB] text-white">
            <Scissors size={20} />
          </div>
          <span className="text-xl font-bold text-white">BarberíaOS</span>
        </div>

        <div className="rounded-2xl border border-[#E6E6E2] bg-white p-8 shadow-2xl">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#111111]">
            <ArrowLeft size={14} />
            Volver al login
          </Link>

          <h1 className="mt-5 text-2xl font-black text-[#111111]">Recuperar contraseña</h1>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Introduce tu correo y te enviaremos un enlace para crear una nueva contraseña.
          </p>

          {sent ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              Si el correo existe, recibirás un enlace para recuperar tu contraseña.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="form-label">Email</label>
                <div className="relative">
                  <Mail size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="input py-3 pl-10"
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading} className="btn-primary mt-2 w-full py-3">
                {loading ? "Enviando..." : "Enviar enlace de recuperación"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
