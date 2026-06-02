import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarCheck, Gift, MessageCircle, QrCode, Scissors, Star, Trophy,
} from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = { params: { token: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "Mi tarjeta de fidelización | BarberíaOS",
    description: "Consulta tus sellos y recompensas.",
  };
}

// ── StampCircles ──────────────────────────────────────────────────────────────

function StampCircles({ stamps, required }: { stamps: number; required: number }) {
  const cells = Array.from({ length: required });
  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {cells.map((_, i) => (
        <div
          key={i}
          className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
            i < stamps
              ? "border-[#C9922A]/60 bg-gradient-to-br from-[#F5D58A] to-[#C9922A] text-white shadow-[0_4px_12px_rgba(201,146,42,0.35)]"
              : stamps === required
              ? "animate-pulse border-[#C9922A]/30 bg-amber-50 text-[#C9922A]"
              : "border-slate-200 bg-slate-50 text-slate-300"
          }`}
        >
          <Star
            size={18}
            fill={i < stamps ? "currentColor" : "none"}
            strokeWidth={i < stamps ? 0 : 1.5}
          />
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function LoyaltyPublicPage({ params }: Props) {
  const token = params.token?.trim();
  if (!token || token.length < 10) notFound();

  const supabase = await createClient();

  // Buscar cliente por loyalty_token
  const { data: client } = await supabase
    .from("clients")
    .select("id, name, barbershop_id, loyalty_token")
    .eq("loyalty_token", token)
    .maybeSingle();

  if (!client) notFound();

  // Datos de la barbería
  const { data: barbershop } = await supabase
    .from("barbershops")
    .select("id, name, slug, phone, public_booking_enabled")
    .eq("id", client.barbershop_id)
    .maybeSingle();

  // Programa activo
  const { data: program } = await supabase
    .from("loyalty_programs")
    .select("id, name, stamps_required, reward_title, reward_description")
    .eq("barbershop_id", client.barbershop_id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!program) {
    // La barbería no tiene programa activo
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#F9FAFB] px-5 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <Gift size={28} className="text-slate-300" />
        </div>
        <h1 className="mt-5 text-xl font-black text-slate-900">Programa no disponible</h1>
        <p className="mt-2 text-sm text-slate-500">
          {barbershop?.name ?? "Esta barbería"} aún no tiene un programa de fidelización activo.
        </p>
      </main>
    );
  }

  // Tarjeta activa del cliente
  const { data: card } = await supabase
    .from("loyalty_cards")
    .select("id, current_stamps, redeemed_count, status, completed_at")
    .eq("client_id", client.id)
    .eq("barbershop_id", client.barbershop_id)
    .eq("program_id", program.id)
    .in("status", ["active", "completed"])
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const stamps        = card?.current_stamps ?? 0;
  const required      = program.stamps_required;
  const isCompleted   = card?.status === "completed" || stamps >= required;
  const missing       = Math.max(0, required - stamps);
  const pct           = Math.min(100, Math.round((stamps / required) * 100));
  const bookingHref   = `/r/${barbershop?.slug ?? ""}`;
  const waPhone       = barbershop?.phone?.replace(/\D/g, "");
  const waHref        = waPhone ? `https://wa.me/${waPhone}` : null;
  const totalRedeemed = card?.redeemed_count ?? 0;

  return (
    <main className="min-h-screen bg-[#F9FAFB]">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white">
              <Scissors size={15} className="text-[#C9922A]" />
            </div>
            <span className="text-sm font-black text-slate-900">{barbershop?.name ?? "BarberíaOS"}</span>
          </div>
          {barbershop?.public_booking_enabled && (
            <Link href={bookingHref}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-900 px-4 text-xs font-black text-white hover:bg-slate-700">
              <CalendarCheck size={13} /> Reservar
            </Link>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-md px-5 py-8">

        {/* Greeting */}
        <div className="mb-6 text-center">
          <p className="text-sm text-slate-500">Hola, <span className="font-black text-slate-900">{client.name}</span> 👋</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">Tu tarjeta de fidelización</h1>
          <p className="mt-1 text-sm text-slate-500">{program.name}</p>
        </div>

        {/* Card visual */}
        <div className={`relative overflow-hidden rounded-[28px] p-6 shadow-xl ${
          isCompleted
            ? "border border-[#C9922A]/30 bg-gradient-to-br from-[#0F1A2E] via-[#0B1220] to-[#050A14]"
            : "border border-slate-200 bg-white"
        }`}>
          {isCompleted && (
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,146,42,0.15),transparent_60%)]" />
          )}

          {/* Status badge */}
          <div className="mb-5 flex items-center justify-between">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9922A]/40 bg-[#C9922A]/15 px-3 py-1 text-xs font-black text-[#C9922A]">
                <Trophy size={11} /> ¡Recompensa desbloqueada!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
                <Star size={11} /> Acumulando sellos
              </span>
            )}
            <p className={`text-2xl font-black tabular-nums ${isCompleted ? "text-[#C9922A]" : "text-slate-900"}`}>
              {stamps}/{required}
            </p>
          </div>

          {/* Stamp circles */}
          <StampCircles stamps={stamps} required={required} />

          {/* Progress bar */}
          {!isCompleted && (
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#F5D58A] to-[#C9922A] transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          )}

          {/* Reward info */}
          <div className={`mt-5 rounded-2xl p-4 ${isCompleted ? "border border-white/10 bg-white/5" : "border border-slate-100 bg-slate-50"}`}>
            <div className="flex items-center gap-3">
              <Gift size={16} className={isCompleted ? "text-[#C9922A]" : "text-slate-400"} />
              <div>
                <p className={`text-xs font-semibold ${isCompleted ? "text-white/50" : "text-slate-400"}`}>
                  {isCompleted ? "Tu recompensa:" : "Próxima recompensa:"}
                </p>
                <p className={`text-sm font-black ${isCompleted ? "text-white" : "text-slate-900"}`}>
                  {program.reward_title}
                </p>
                {program.reward_description && (
                  <p className={`mt-0.5 text-xs ${isCompleted ? "text-white/40" : "text-slate-400"}`}>
                    {program.reward_description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Motivational message */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
          {isCompleted ? (
            <p className="text-sm font-black text-[#C9922A]">
              🎁 ¡Enhorabuena! Habla con tu barbero para canjear tu recompensa.
            </p>
          ) : missing === 1 ? (
            <p className="text-sm font-semibold text-slate-700">
              ⭐ ¡Solo te falta <strong>1 visita más</strong> para conseguir tu recompensa!
            </p>
          ) : (
            <p className="text-sm text-slate-500">
              Te faltan <strong className="text-slate-900">{missing} visitas</strong> para conseguir{" "}
              <strong className="text-slate-900">{program.reward_title}</strong>.
            </p>
          )}
        </div>

        {/* Stats */}
        {totalRedeemed > 0 && (
          <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
            <p className="text-xs text-slate-400">Ya has canjeado</p>
            <p className="text-2xl font-black text-[#8A641F]">{totalRedeemed}</p>
            <p className="text-xs text-slate-400">recompensa{totalRedeemed !== 1 ? "s" : ""} en total</p>
          </div>
        )}

        {/* CTAs */}
        <div className="mt-6 flex flex-col gap-3">
          {barbershop?.public_booking_enabled && (
            <Link href={bookingHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-900 text-sm font-black text-white transition hover:bg-slate-700">
              <CalendarCheck size={16} /> Reservar nueva cita
            </Link>
          )}
          {waHref && (
            <a href={waHref} target="_blank" rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 text-sm font-black text-emerald-700 transition hover:bg-emerald-100">
              <MessageCircle size={16} /> Contactar por WhatsApp
            </a>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Tarjeta gestionada por <span className="font-semibold">{barbershop?.name ?? "BarberíaOS"}</span>
          {" · "}
          <Link href="/" className="hover:text-slate-600">BarberíaOS</Link>
        </p>
      </div>
    </main>
  );
}
