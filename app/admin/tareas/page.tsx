import { requireSuperAdmin } from "@/src/lib/permissions/admin";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { TareasClient } from "./TareasClient";

export default async function TareasPage() {
  await requireSuperAdmin();

  const supabase = createServiceRoleClient();
  const [{ data: tasks }, { data: leads }, { data: deals }] = await Promise.all([
    supabase.from("crm_tasks").select("*").order("due_date", { ascending: true, nullsFirst: false }),
    supabase.from("crm_leads").select("id, business_name").order("business_name"),
    supabase.from("crm_deals").select("id, title").order("title"),
  ]);

  return <TareasClient tasks={tasks ?? []} leads={leads ?? []} deals={deals ?? []} />;
}
