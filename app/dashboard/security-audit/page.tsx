import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { PageHeader } from "@/components/ui/PageHeader";
import { SecurityAuditClient, type AuditHistoryEntry } from "./SecurityAuditClient";

export const metadata: Metadata = {
  title: "BarberíaOS Shield | BarberíaOS",
  description: "Auditoría pasiva de confianza digital, SEO visible y conversión a reservas.",
};

export default async function SecurityAuditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const { data: history } = await supabase
    .from("security_audits")
    .select("id, website_url, score, status, created_at, report")
    .eq("barbershop_id", barbershopId)
    .eq("status", "done")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-5">
      <PageHeader
        section="Herramientas premium"
        title="BarberíaOS Shield"
        description="Auditoría pasiva de confianza digital para detectar señales públicas que ayudan a generar reservas, visibilidad y credibilidad."
      />
      <SecurityAuditClient history={(history ?? []) as AuditHistoryEntry[]} />
    </div>
  );
}
