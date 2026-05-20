import { requirePlatformAdmin } from "@/src/lib/permissions/admin";
import { createClient } from "@/src/lib/supabase/server";
import { AdminDataError } from "../_components/AdminDataError";
import { LeadsClient } from "./LeadsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LeadsPage() {
  await requirePlatformAdmin();

  const supabase = await createClient();
  const { data: leads, error } = await supabase
    .from("crm_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <AdminDataError message={error.message} />;
  }

  return <LeadsClient leads={leads ?? []} />;
}
