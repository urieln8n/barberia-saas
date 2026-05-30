import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { FidelizacionClient } from "./FidelizacionClient";

export const dynamic = "force-dynamic";

export default async function FidelizacionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  // Intentamos leer loyalty_programs si existe la tabla.
  // Si la tabla no existe todavía, simplemente no pasamos datos y la UI
  // muestra el estado vacío de configuración.
  let activeProgram: {
    id: string;
    name: string;
    stamps_required: number;
    reward_description: string | null;
    is_active: boolean;
  } | null = null;

  let stats = {
    totalCards: 0,
    pendingRewards: 0,
    stampsThisMonth: 0,
    nearReward: 0,
    repeatVisits: 0,
  };

  let clientsNearReward: Array<{
    id: string;
    name: string;
    phone: string | null;
    stamps: number;
    stampsRequired: number;
    lastVisit: string | null;
  }> = [];

  try {
    // ── Programa activo ─────────────────────────────────────────────────────────
    const { data: programData } = await supabase
      .from("loyalty_programs")
      .select("id, name, stamps_required, reward_description, is_active")
      .eq("barbershop_id", barbershopId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    activeProgram = programData ?? null;

    if (activeProgram) {
      // ── Cards activas y estadísticas ──────────────────────────────────────────
      const { data: cardsData } = await supabase
        .from("loyalty_cards")
        .select("id, client_id, current_stamps, redeemed_count")
        .eq("barbershop_id", barbershopId)
        .eq("program_id", activeProgram.id);

      type CardRow = { id: string; client_id: string | null; current_stamps: number; redeemed_count: number };
      if (cardsData) {
        stats.totalCards = (cardsData as CardRow[]).length;
        stats.pendingRewards = (cardsData as CardRow[]).filter(
          (c) => c.current_stamps >= activeProgram!.stamps_required
        ).length;
        stats.nearReward = (cardsData as CardRow[]).filter(
          (c) =>
            c.current_stamps >= activeProgram!.stamps_required - 2 &&
            c.current_stamps < activeProgram!.stamps_required
        ).length;
      }

      // ── Sellos este mes ───────────────────────────────────────────────────────
      const firstOfMonth = new Date();
      firstOfMonth.setDate(1);
      firstOfMonth.setHours(0, 0, 0, 0);

      const { count: stampsCount } = await supabase
        .from("loyalty_stamps")
        .select("id", { count: "exact", head: true })
        .eq("barbershop_id", barbershopId)
        .gte("created_at", firstOfMonth.toISOString());

      stats.stampsThisMonth = stampsCount ?? 0;

      // ── Clientes cerca de recompensa ──────────────────────────────────────────
      if (cardsData && (cardsData as CardRow[]).length > 0) {
        const nearCards = (cardsData as CardRow[])
          .filter(
            (c) =>
              c.current_stamps >= activeProgram!.stamps_required - 3 &&
              c.current_stamps < activeProgram!.stamps_required
          )
          .slice(0, 6);

        if (nearCards.length > 0) {
          const clientIds = nearCards.map((c) => c.client_id).filter(Boolean);
          const { data: clientsData } = await supabase
            .from("clients")
            .select("id, name, phone, last_visit_at")
            .in("id", clientIds as string[]);

          clientsNearReward = nearCards.map((card) => {
            const client = clientsData?.find((cl) => cl.id === card.client_id);
            return {
              id: card.client_id as string,
              name: client?.name ?? "Cliente",
              phone: client?.phone ?? null,
              stamps: card.current_stamps ?? 0,
              stampsRequired: activeProgram!.stamps_required,
              lastVisit: client?.last_visit_at ?? null,
            };
          });
        }
      }

      // ── Visitas repetidas ─────────────────────────────────────────────────────
      const { count: repeatCount } = await supabase
        .from("clients")
        .select("id", { count: "exact", head: true })
        .eq("barbershop_id", barbershopId)
        .gte("visit_count", 2);

      stats.repeatVisits = repeatCount ?? 0;
    }
  } catch {
    // La tabla loyalty_programs aún no existe. La UI mostrará el estado de configuración.
  }

  return (
    <FidelizacionClient
      activeProgram={activeProgram}
      stats={stats}
      clientsNearReward={clientsNearReward}
      dbReady={!!activeProgram}
    />
  );
}
