import { requirePlatformAdmin } from "@/src/lib/permissions/admin";
import { createClient } from "@/src/lib/supabase/server";
import { AdminDataError } from "../_components/AdminDataError";
import { DealsClient } from "./DealsClient";

export default async function DealsPage() {
  await requirePlatformAdmin();

  const supabase = await createClient();
  const [
    { data: deals, error: dealsError },
    { data: leads, error: leadsError },
  ] = await Promise.all([
    supabase.from("crm_deals").select("*").order("created_at", { ascending: false }),
    supabase.from("crm_leads").select("id, business_name").order("business_name"),
  ]);

  const error = dealsError ?? leadsError;
  if (error) {
    return <AdminDataError message={error.message} />;
  }

  return <DealsClient deals={deals ?? []} leads={leads ?? []} />;
}
