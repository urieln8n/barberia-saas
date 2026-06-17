import { requirePlatformAdmin } from "@/src/lib/permissions/admin";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { AdminDataError } from "../_components/AdminDataError";
import { SuscripcionesClient } from "./SuscripcionesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SuscripcionesPage() {
  await requirePlatformAdmin();

  const supabase = createServiceRoleClient();

  const [
    { data: rawSubs, error: subscriptionsError },
    { data: barbershops, error: barbershopsError },
  ] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("*, barbershops(name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("barbershops")
      .select("id, name")
      .order("name"),
  ]);

  const error = subscriptionsError ?? barbershopsError;
  if (error) {
    return <AdminDataError message={error.message} />;
  }

  // Flatten the barbershop join
  const subscriptions = (rawSubs ?? []).map((s) => {
    const bs = s.barbershops as { name: string } | null;
    const { barbershops: _, ...rest } = s;
    return { ...rest, barbershop_name: bs?.name ?? undefined };
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
