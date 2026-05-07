"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scissors } from "lucide-react";
import { supabase } from "@/src/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        router.push("/dashboard");
        router.refresh();
      }
    } else {
      if (!fullName.trim()) {
        setError("Introduce tu nombre completo.");
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) {
        if (error.message.includes("User already registered") || error.message.includes("already been registered")) {
          setError("Ya existe una cuenta con ese email. Inicia sesión.");
        } else {
          setError(error.message);
        }
      } else {
        router.push("/onboarding");
        router.refresh();
      }
    }

    setLoading(false);
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
            </div>

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
                : mode === "login" ? "Entrar al panel" : "Crear cuenta"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-white/40">
          ¿Tienes una barbería? Empieza gratis.
        </p>
      </div>
    </main>
  );
}
