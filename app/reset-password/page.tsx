"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LockKeyhole, Scissors } from "lucide-react";
import { supabase } from "@/src/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      setSessionReady(Boolean(data.session));
      setCheckingSession(false);
    }

    checkSession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setLoading(false);
      setError("No se pudo actualizar la contraseña. Vuelve a abrir el enlace de recuperación.");
      return;
    }

    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 1400);
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

          <h1 className="mt-5 text-2xl font-black text-[#111111]">Crear nueva contraseña</h1>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Elige una contraseña nueva para tu cuenta.
          </p>

          {checkingSession ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Comprobando tu enlace de recuperación...
            </div>
          ) : success ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              Contraseña actualizada correctamente. Redirigiendo al login...
            </div>
          ) : !sessionReady ? (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Este enlace ya no es válido o ha expirado. Solicita uno nuevo desde la recuperación de contraseña.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="form-label">Nueva contraseña</label>
                <div className="relative">
                  <LockKeyhole size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength={8}
                    className="input py-3 pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña"
                  required
                  minLength={8}
                  className="input py-3"
                />
              </div>

              {error && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading} className="btn-primary mt-2 w-full py-3">
                {loading ? "Guardando..." : "Actualizar contraseña"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
