import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { PageHeader } from "@/components/ui/PageHeader";
import { SecurityAuditClient, type AuditHistoryEntry } from "./SecurityAuditClient";

export const metadata: Metadata = {
  title: "Auditoría web | BarberíaOS",
  description: "Analiza el rendimiento técnico, seguridad básica y señales de conversión de tu web.",
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
        eyebrow="Herramientas"
        title="Auditoría web"
        description="Analiza el estado técnico de tu web: HTTPS, cabeceras, SEO y señales de conversión para clientes."
      />
      <SecurityAuditClient history={(history ?? []) as AuditHistoryEntry[]} />
    </div>
  );
}
