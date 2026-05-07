import { requirePlatformAdmin } from "@/src/lib/permissions/admin";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { SuscripcionesClient } from "./SuscripcionesClient";

export default async function SuscripcionesPage() {
  await requirePlatformAdmin();

  const supabase = createServiceRoleClient();

  const [{ data: rawSubs }, { data: barbershops }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("*, barbershops(name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("barbershops")
      .select("id, name")
      .order("name"),
  ]);

  // Flatten the barbershop join
  const subscriptions = (rawSubs ?? []).map((s) => {
    const bs = s.barbershops as { name: string } | null;
    const { barbershops: _, ...rest } = s;
    return { ...rest, barbershop_name: bs?.name ?? null };
  });

  // MRR = only active subscriptions
  const mrr = subscriptions
    .filter(s => s.status === "active")
    .reduce((acc, s) => acc + (s.amount_monthly ?? 0), 0);

  // Count by status
  const byStatus: Record<string, number> = {};
  for (const s of subscriptions) {
    byStatus[s.status] = (byStatus[s.status] ?? 0) + 1;
  }

  return (
    <SuscripcionesClient
      subscriptions={subscriptions}
      barbershops={barbershops ?? []}
      mrr={mrr}
      byStatus={byStatus}
    />
  );
}
