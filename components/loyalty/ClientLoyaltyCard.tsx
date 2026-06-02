import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { Gift, Star } from "lucide-react";
import { LoyaltyCardActions } from "./LoyaltyCardActions";

interface Props {
  clientId: string;
  barbershopId: string;
  clientName: string;
  phone?: string | null;
}

function formatStampDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
}

export async function ClientLoyaltyCard({ clientId, barbershopId, clientName, phone }: Props) {
  let program: {
    id: string;
    name: string;
    stamps_required: number;
    reward_description: string | null;
  } | null = null;

  let card: {
    id: string;
    current_stamps: number;
    redeemed_count: number;
  } | null = null;

  let recentStamps: Array<{ id: string; created_at: string | null; note: string | null }> = [];

  try {
    const db = createServiceRoleClient();

    const { data: programData } = await db
      .from("loyalty_programs")
      .select("id, name, stamps_required, reward_description")
      .eq("barbershop_id", barbershopId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    program = programData ?? null;

    if (program) {
      const { data: cardData } = await db
        .from("loyalty_cards")
        .select("id, current_stamps, redeemed_count")
        .eq("barbershop_id", barbershopId)
        .eq("program_id", program.id)
        .eq("client_id", clientId)
        .maybeSingle();

      card = cardData ?? null;

      if (card) {
        const { data: stampsData } = await db
          .from("loyalty_stamps")
          .select("id, created_at, note")
          .eq("card_id", card.id)
          .eq("barbershop_id", barbershopId)
          .order("created_at", { ascending: false })
          .limit(5);

        recentStamps = stampsData ?? [];
      }
    }
  } catch {
    // Tables don't exist yet — show setup state
  }

  // ── No active program ──────────────────────────────────────────────────────
  if (!program) {
    return (
      <section className="panel overflow-hidden p-0">
        <div className="border-b border-[#E7E2D8] bg-[#FDFBF7] px-5 py-4 md:px-6">
          <p className="label-section">Fidelización</p>
          <h2 className="section-heading">Tarjeta de puntos</h2>
        </div>
        <div className="p-5 md:p-6">
          <div className="rounded-2xl border border-dashed border-[#D4AF37]/40/30 bg-[#FFFBEB] p-6 text-center">
            <Gift size={22} className="mx-auto text-[#D4AF37]" />
            <p className="mt-3 text-sm font-bold text-[#8A641F]">Sin programa activo</p>
            <p className="mt-1 text-xs text-[#8A641F]/70">
              Configura un programa de fidelización para empezar a registrar sellos.
            </p>
            <a
              href="/dashboard/fidelizacion"
              className="mt-4 inline-flex text-xs font-black text-[#D4AF37] hover:underline"
            >
              Configurar programa →
            </a>
          </div>
        </div>
      </section>
    );
  }

  const stamps = card?.current_stamps ?? 0;
  const required = program.stamps_required;
  const hasReward = stamps >= required;
  const progressPct = Math.min(100, Math.round((stamps / required) * 100));
  const redemptionCount = card?.redeemed_count ?? 0;

  // Clamp grid: max 10 cells shown, scale stamp icons inside if more
  const displayCells = Math.min(required, 10);
  const cellsPerGroup = Math.ceil(required / displayCells);

  return (
    <section className="panel overflow-hidden p-0">
      {/* Header */}
      <div className="border-b border-[#E7E2D8] bg-[#FDFBF7] px-5 py-4 md:px-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="label-section">Fidelización</p>
            <h2 className="section-heading">Tarjeta de puntos</h2>
          </div>
          {hasReward && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">
              Recompensa lista
            </span>
          )}
        </div>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        {/* Stamp grid */}
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-neutral-500">
            {program.name}
          </p>
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${Math.min(required, 10)}, 1fr)` }}
          >
            {Array.from({ length: displayCells }).map((_, i) => {
              const filledCount = Math.floor(stamps / cellsPerGroup);
              const isFilled = i < filledCount;
              return (
                <div
                  key={i}
                  className={`flex aspect-square items-center justify-center rounded-xl border-2 transition ${
                    isFilled
                      ? "border-[#D4AF37]/40 bg-[#FFFBEB]"
                      : "border-neutral-200 bg-neutral-50"
                  }`}
                >
                  <Star
                    size={12}
                    className={isFilled ? "fill-[#D4AF37] text-[#D4AF37]" : "text-neutral-300"}
                  />
                </div>
              );
            })}
          </div>
          {/* Progress */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-neutral-500">
              <span className="font-semibold text-[#111827]">{stamps} sellos</span>
              <span>Meta: {required}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-[#D4AF37] transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Reward description */}
        {program.reward_description && (
          <div className="rounded-2xl border border-[#E7E2D8] bg-[#FDFBF7] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">Recompensa</p>
            <p className="mt-1 text-sm font-semibold text-[#111827]">{program.reward_description}</p>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#E7E2D8] bg-neutral-50 p-3 text-center">
            <p className="text-xl font-black tabular-nums text-[#111827]">{stamps}</p>
            <p className="text-xs text-neutral-500">Sellos actuales</p>
          </div>
          <div className="rounded-2xl border border-[#E7E2D8] bg-neutral-50 p-3 text-center">
            <p className="text-xl font-black tabular-nums text-[#111827]">{redemptionCount}</p>
            <p className="text-xs text-neutral-500">Recompensas canjeadas</p>
          </div>
        </div>

        {/* Action buttons (client component) */}
        <LoyaltyCardActions
          clientId={clientId}
          barbershopId={barbershopId}
          cardId={card?.id ?? null}
          programId={program.id}
          clientName={clientName}
          phone={phone}
          stamps={stamps}
          required={required}
          hasReward={hasReward}
          rewardDescription={program.reward_description}
        />

        {/* Recent stamp history */}
        {recentStamps.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-neutral-500">
              Últimos sellos
            </p>
            <div className="space-y-1.5">
              {recentStamps.map((stamp) => (
                <div
                  key={stamp.id}
                  className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2 text-xs"
                >
                  <span className="flex items-center gap-1.5">
                    <Star size={10} className="fill-[#D4AF37] text-[#D4AF37]" />
                    <span className="text-neutral-600">{stamp.note ?? "Sello manual"}</span>
                  </span>
                  <span className="text-neutral-400">{formatStampDate(stamp.created_at)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
