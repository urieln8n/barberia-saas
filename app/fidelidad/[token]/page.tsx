import { notFound } from "next/navigation";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { Star, Trophy, Gift, CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

function StampGrid({ stamps, required }: { stamps: number; required: number }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {Array.from({ length: required }).map((_, i) => (
        <div
          key={i}
          className={`flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-sm transition-all duration-300 ${
            i < stamps
              ? "border-[#C9922A]/60 bg-gradient-to-br from-[#F5D58A] to-[#C9922A] shadow-[0_0_12px_rgba(201,146,42,0.3)]"
              : "border-white/20 bg-white/10"
          }`}
        >
          <Star
            size={22}
            className={i < stamps ? "text-white" : "text-white/25"}
            fill={i < stamps ? "currentColor" : "none"}
          />
        </div>
      ))}
    </div>
  );
}

export default async function FidelidadPublicPage({ params }: Props) {
  const { token } = await params;
  const supabase = createServiceRoleClient();

  const { data: client } = await supabase
    .from("clients")
    .select("id, name, barbershop_id")
    .eq("loyalty_token", token)
    .maybeSingle();

  if (!client) notFound();

  const { data: cardRaw } = await supabase
    .from("loyalty_card_summary")
    .select("current_stamps, stamps_required, status, reward_title, program_name, progress_pct, redeemed_count")
    .eq("client_id", client.id)
    .eq("barbershop_id", client.barbershop_id)
    .in("status", ["active", "completed"])
    .order("status", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: barbershop } = await supabase
    .from("barbershops")
    .select("name, slug")
    .eq("id", client.barbershop_id)
    .maybeSingle();

  const stamps    = (cardRaw?.current_stamps as number | null) ?? 0;
  const required  = (cardRaw?.stamps_required as number | null) ?? 8;
  const missing   = Math.max(0, required - stamps);
  const hasReward = cardRaw?.status === "completed";
  const pct       = (cardRaw?.progress_pct as number | null) ?? Math.round((stamps / required) * 100);
  const redeemed  = (cardRaw?.redeemed_count as number | null) ?? 0;
  const rewardTitle    = (cardRaw?.reward_title as string | null) ?? "Corte gratis";
  const programName    = (cardRaw?.program_name as string | null) ?? "Programa de puntos";

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0F1E38] to-[#061020] px-4 py-10">
      <div className="mx-auto max-w-sm">

        {/* Brand */}
        <div className="mb-8 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C9922A]/70">
            {barbershop?.name ?? "Tu barbería"}
          </p>
          <p className="mt-1 text-[11px] text-white/30">Tarjeta de fidelización</p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-[28px] border border-[#C9922A]/20 bg-gradient-to-br from-[#12203A] to-[#0A1628] shadow-[0_24px_80px_rgba(201,146,42,0.15)]">

          {/* Header */}
          <div className="border-b border-white/8 px-6 pb-5 pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C9922A]/70">
                  Hola,
                </p>
                <h1 className="mt-0.5 text-2xl font-black text-white">
                  {client.name}
                </h1>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C9922A]/30 bg-[#C9922A]/10">
                <Trophy size={22} className="text-[#C9922A]" />
              </div>
            </div>
          </div>

          {/* Sellos */}
          <div className="px-6 py-6">
            <p className="mb-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              {programName}
            </p>
            <StampGrid stamps={stamps} required={required} />
            <div className="mt-5">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#F5D58A] to-[#C9922A] transition-all duration-700"
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                <span>{stamps} sellado{stamps !== 1 ? "s" : ""}</span>
                <span>{required} para recompensa</span>
              </div>
            </div>
          </div>

          {/* Recompensa */}
          <div className={`mx-4 mb-4 rounded-2xl border p-4 ${
            hasReward
              ? "border-[#C9922A]/50 bg-[#C9922A]/15"
              : "border-white/8 bg-white/5"
          }`}>
            <div className="flex items-center gap-3">
              <Gift size={20} className={hasReward ? "text-[#C9922A]" : "text-white/30"} />
              <div>
                <p className={`text-sm font-black ${hasReward ? "text-[#F5D58A]" : "text-white/50"}`}>
                  {rewardTitle}
                </p>
                <p className={`text-[11px] ${hasReward ? "text-[#C9922A]/80" : "text-white/30"}`}>
                  {hasReward
                    ? "¡Recompensa disponible! Muéstrala en tu próxima visita."
                    : missing === 1
                    ? "Te falta solo 1 visita más"
                    : `Te faltan ${missing} visita${missing !== 1 ? "s" : ""} más`}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-white/8 px-6 py-4">
            <div className="flex items-center justify-between text-center">
              <div>
                <p className="text-xl font-black tabular-nums text-[#C9922A]">{stamps}</p>
                <p className="text-[10px] text-white/30">Sellos</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-xl font-black tabular-nums text-white">{required}</p>
                <p className="text-[10px] text-white/30">Para premio</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-xl font-black tabular-nums text-emerald-400">{redeemed}</p>
                <p className="text-[10px] text-white/30">Canjeados</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA reserva */}
        {barbershop?.slug && (
          <a
            href={`/r/${barbershop.slug}`}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-4 text-sm font-black text-white/70 transition hover:bg-white/10"
          >
            <CalendarDays size={16} />
            Reservar cita
          </a>
        )}

        <p className="mt-6 text-center text-[10px] text-white/20">
          Los sellos se añaden automáticamente al completar cada cita.
        </p>
      </div>
    </main>
  );
}
