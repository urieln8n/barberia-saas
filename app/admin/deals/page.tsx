import { requirePlatformAdmin } from "@/src/lib/permissions/admin";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { DealsClient } from "./DealsClient";

export default async function DealsPage() {
  await requirePlatformAdmin();

  const supabase = createServiceRoleClient();
  const [{ data: deals }, { data: leads }] = await Promise.all([
    supabase.from("crm_deals").select("*").order("created_at", { ascending: false }),
    supabase.from("crm_leads").select("id, business_name").order("business_name"),
  ]);

  return <DealsClient deals={deals ?? []} leads={leads ?? []} />;
}
