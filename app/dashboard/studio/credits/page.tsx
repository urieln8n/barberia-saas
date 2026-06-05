import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { CreditsClient } from "./CreditsClient";

export const metadata: Metadata = {
  title: "Créditos Studio IA — BarberíaOS",
};

export const dynamic = "force-dynamic";

export default async function CreditsPage() {
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  // TODO: Replace with real wallet query once studio_credit_wallets table exists
  const wallet = { current: 5, monthly: 5, extra: 0, plan: "Growth" };

  // TODO: Replace with real transaction query once studio_credit_transactions table exists
  const history: { id: string; type: string; credits: number; description: string; created_at: string }[] = [
    { id: "1", type: "monthly_grant", credits: 5, description: "Créditos mensuales — Plan Growth", created_at: new Date().toISOString() },
  ];

  return <CreditsClient wallet={wallet} history={history} />;
}
