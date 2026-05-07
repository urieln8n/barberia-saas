import { requireSuperAdmin } from "@/src/lib/permissions/admin";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { LeadsClient } from "./LeadsClient";

export default async function LeadsPage() {
  await requireSuperAdmin();

  const supabase = createServiceRoleClient();
  const { data: leads } = await supabase
    .from("crm_leads")
    .select("*")
    .order("created_at", { ascending: false });

  return <LeadsClient leads={leads ?? []} />;
}
