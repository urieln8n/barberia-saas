import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { FidelizacionClient } from "./FidelizacionClient";

export const dynamic = "force-dynamic";

export default async function FidelizacionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  type ActiveProgram = {
    id: string;
    name: string;
    stamps_required: number;
    reward_title: string;
    reward_description: string | null;
    reward_type: string;
    is_active: boolean;
    max_stamps_per_day: number | null;
    whatsapp_message: string | null;
  } | null;

  type CardWithClient = {
    id: string;
    client_id: string;
    current_stamps: number;
    redeemed_count: number;
    status: string;
    client_name: string;
    client_phone: string | null;
    loyalty_token: string | null;
    last_visit_at: string | null;
    progress_pct: number;
    stamps_required: number;
  };

  type StampEvent = {
    id: string;
    client_id: string;
    stamp_type: string;
    stamps_delta: number;
    note: string | null;
    created_at: string;
    client_name: string;
  };

  let activeProgram: ActiveProgram = null;
  let dbReady = false;

  let stats = {
    totalCards:       0,
    pendingRewards:   0,
    stampsThisMonth:  0,
    nearReward:       0,
    repeatVisits:     0,
    totalRedeemed:    0,
  };

  let clientsNearReward: CardWithClient[] = [];
  let pendingRewardCards: CardWithClient[] = [];
  let recentStamps: StampEvent[] = [];

  try {
    // ── Programa activo ───────────────────────────────────────────────────────
    const { data: programData } = await supabase
      .from("loyalty_programs")
      .select("id, name, stamps_required, reward_title, reward_description, reward_type, is_active, max_stamps_per_day, whatsapp_message")
      .eq("barbershop_id", barbershopId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    activeProgram = programData ?? null;
    dbReady = !!activeProgram;

    if (activeProgram) {
      // ── Todas las tarjetas activas + datos de cliente vía vista ───────────
      const { data: cardsRaw } = await supabase
        .from("loyalty_card_summary")
        .select("id, client_id, current_stamps, redeemed_count, status, client_name, client_phone, loyalty_token, last_visit_at, progress_pct, stamps_required")
        .eq("barbershop_id", barbershopId)
        .eq("program_id", activeProgram.id)
        .order("current_stamps", { ascending: false });

      const cards = (cardsRaw ?? []) as CardWithClient[];

      const activeCards    = cards.filter((c) => c.status === "active");
      const completedCards = cards.filter((c) => c.status === "completed");

      stats.totalCards     = activeCards.length;
      stats.pendingRewards = completedCards.length;
      stats.totalRedeemed  = cards.reduce((s, c) => s + (c.redeemed_count ?? 0), 0);
      stats.nearReward     = activeCards.filter(
        (c) => c.current_stamps >= activeProgram!.stamps_required - 2,
      ).length;

      // Pendientes de canjear
      pendingRewardCards = completedCards.slice(0, 10);

      // Cerca de recompensa (activas, a 3 o menos)
      clientsNearReward = activeCards
        .filter((c) => c.current_stamps >= activeProgram!.stamps_required - 3)
        .slice(0, 8);

      // ── Sellos este mes ───────────────────────────────────────────────────
      const firstOfMonth = new Date();
      firstOfMonth.setDate(1);
      firstOfMonth.setHours(0, 0, 0, 0);

      const { count: stampsCount } = await supabase
        .from("loyalty_stamps")
        .select("id", { count: "exact", head: true })
        .eq("barbershop_id", barbershopId)
        .eq("stamp_type", "stamp_added")
        .gte("created_at", firstOfMonth.toISOString());

      stats.stampsThisMonth = stampsCount ?? 0;

      // ── Visitas repetidas ─────────────────────────────────────────────────
      const { count: repeatCount } = await supabase
        .from("clients")
        .select("id", { count: "exact", head: true })
        .eq("barbershop_id", barbershopId)
        .gte("visit_count", 2);

      stats.repeatVisits = repeatCount ?? 0;

      // ── Últimos eventos de sellos ─────────────────────────────────────────
      const { data: stampsRaw } = await supabase
        .from("loyalty_stamps")
        .select("id, client_id, stamp_type, stamps_delta, note, created_at")
        .eq("barbershop_id", barbershopId)
        .in("stamp_type", ["stamp_added", "reward_unlocked", "reward_redeemed"])
        .order("created_at", { ascending: false })
        .limit(20);

      if (stampsRaw && stampsRaw.length > 0) {
        const clientIds = [...new Set(stampsRaw.map((s) => s.client_id).filter(Boolean))];
        const { data: clientNames } = await supabase
          .from("clients")
          .select("id, name")
          .in("id", clientIds as string[]);

        const nameMap: Record<string, string> = {};
        (clientNames ?? []).forEach((c) => { nameMap[c.id] = c.name; });

        recentStamps = stampsRaw.map((s) => ({
          ...s,
          client_name: nameMap[s.client_id] ?? "Cliente",
        }));
      }
    }
  } catch {
    // Tablas aún no creadas → la UI muestra el estado de configuración
  }

  return (
    <FidelizacionClient
      activeProgram={activeProgram}
      stats={stats}
      clientsNearReward={clientsNearReward}
      pendingRewardCards={pendingRewardCards}
      recentStamps={recentStamps}
      dbReady={dbReady}
      barbershopId={barbershopId}
    />
  );
}
