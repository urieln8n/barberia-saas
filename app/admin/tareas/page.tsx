import { requirePlatformAdmin } from "@/src/lib/permissions/admin";
import { createClient } from "@/src/lib/supabase/server";
import { AdminDataError } from "../_components/AdminDataError";
import { TareasClient } from "./TareasClient";

export default async function TareasPage() {
  await requirePlatformAdmin();

  const supabase = await createClient();
  const [
    { data: tasks, error: tasksError },
    { data: leads, error: leadsError },
    { data: deals, error: dealsError },
  ] = await Promise.all([
    supabase.from("crm_tasks").select("*").order("due_date", { ascending: true, nullsFirst: false }),
    supabase.from("crm_leads").select("id, business_name").order("business_name"),
    supabase.from("crm_deals").select("id, title").order("title"),
  ]);

  const error = tasksError ?? leadsError ?? dealsError;
  if (error) {
    return <AdminDataError message={error.message} />;
  }

  return <TareasClient tasks={tasks ?? []} leads={leads ?? []} deals={deals ?? []} />;
}
