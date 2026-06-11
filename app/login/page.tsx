"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Chrome } from "lucide-react";
import { BarberiaOSLogo } from "@/components/brand/BarberiaOSLogo";
import { supabase } from "@/src/lib/supabase/client";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("error") === "oauth") {
        setError("No se pudo iniciar con Google. Inténtalo de nuevo.");
      }
      if (params.get("tab") === "register" || params.get("mode") === "register") {
        setMode("register");
      }
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setError("Confirma tu email antes de entrar. Revisa tu bandeja de entrada.");
        } else if (error.message.includes("Invalid login credentials")) {
          setError("Email o contraseña incorrectos.");
        } else {
          setError(error.message);
        }
      } else {
        window.location.href = "/dashboard";
      }
    } else {
      if (!fullName.trim()) {
        setError("Introduce tu nombre completo.");
        setLoading(false);
        return;
      }
      if (!acceptedLegal) {
        setError("Debes aceptar los términos y confirmar que has leído la política de privacidad.");
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback`
              : undefined,
        },
      });
      if (error) {
        if (error.message.includes("User already registered") || error.message.includes("already been registered")) {
          setError("Ya existe una cuenta con ese email. Inicia sesión.");
        } else {
          setError(error.message);
        }
      } else {
        window.location.href = "/onboarding";
      }
    }

    setLoading(false);
  }

  async function handleGoogleLogin() {
    setError("");
    setOauthLoading(true);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : "/auth/callback";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setOauthLoading(false);
      setError("No se pudo continuar con Google. Vuelve a intentarlo.");
    }
  }

  return (
    <main className="premium-grid-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        <div className="mb-8 flex items-center justify-center">
          <BarberiaOSLogo variant="full" size="lg" />
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-[var(--shadow-card)] md:p-8">
          <div className="mb-6 rounded-2xl border border-[#DDE7FB] bg-[#F8FAFC] p-4">
            <p className="text-xs font-black uppercase text-[#2563EB]">Acceso al producto</p>
            <h1 className="mt-1 text-2xl font-black text-[#111827]">
              Entra, configura tu barbería y prueba reservas online.
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Si estás explorando, empieza por la demo guiada para saber qué mirar primero.
            </p>
            <Link href="/demo" className="mt-3 inline-flex items-center gap-2 text-sm font-black text-[#2563EB]">
              Ver demo guiada <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mb-6 flex rounded-xl bg-[#FAFAF8] p-1">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${mode === "login" ? "bg-white text-[#111111] shadow-sm" : "text-neutral-500"}`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${mode === "register" ? "bg-white text-[#111111] shadow-sm" : "text-neutral-500"}`}
              >
              Crear cuenta
            </button>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || oauthLoading}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-bold text-[#111111] shadow-sm transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Chrome size={16} className="text-[#2563EB]" />
            {oauthLoading ? "Redirigiendo..." : "Continuar con Google"}
          </button>

          <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
            <span className="h-px flex-1 bg-[#E5E7EB]" />
            o
            <span className="h-px flex-1 bg-[#E5E7EB]" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "register" && (
              <div>
                <label className="form-label">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  className="input py-3"
                />
              </div>
            )}

            <div>
              <label className="form-label">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="input py-3"
              />
            </div>

            <div>
              <label className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="input py-3"
              />
              {mode === "login" && (
                <div className="mt-2 flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              )}
            </div>

            {mode === "register" && (
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={acceptedLegal}
                  onChange={(e) => setAcceptedLegal(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#2F6FEB]"
                />
                <span className="text-xs leading-5 text-slate-600">
                  Acepto los{" "}
                  <Link href="/legal/terminos" className="font-bold text-[#2563EB] hover:text-[#1D4ED8]">
                    Términos y Condiciones
                  </Link>{" "}
                  y he leído la{" "}
                  <Link href="/legal/privacidad" className="font-bold text-[#2563EB] hover:text-[#1D4ED8]">
                    Política de Privacidad
                  </Link>
                  .
                </span>
              </label>
            )}

            {error && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 w-full py-3"
            >
              {loading
                ? "Cargando..."
                : mode === "login" ? "Entrar al dashboard" : "Crear cuenta y configurar"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          <Link href="/" className="font-bold text-[#2563EB] hover:text-[#1D4ED8]">
            Volver a la landing
          </Link>{" "}
          ·{" "}
          <Link href="/legal" className="font-bold text-slate-700 hover:text-[#050A14]">
            Centro legal
          </Link>
        </p>
      </div>
    </main>
  );
}
