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

  // biome-ignore lint: studio tables not yet in generated types
  const [walletResult, historyResult] = await Promise.all([
    (supabase as any)
      .from("studio_credit_wallets")
      .select("current_credits, monthly_credits, extra_credits")
      .eq("barbershop_id", barbershopId)
      .maybeSingle(),
    (supabase as any)
      .from("studio_credit_transactions")
      .select("id, type, credits, description, created_at")
      .eq("barbershop_id", barbershopId)
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  const wallet = walletResult.data
    ? {
        current: walletResult.data.current_credits,
        monthly: walletResult.data.monthly_credits,
        extra: walletResult.data.extra_credits,
        plan: "Growth",
      }
    : { current: 0, monthly: 1, extra: 0, plan: "Starter" };

  const history = ((historyResult.data ?? []) as any[]).map((tx) => ({
    id: tx.id,
    type: tx.type,
    credits: tx.credits,
    description: tx.description,
    created_at: tx.created_at,
  }));

  return <CreditsClient wallet={wallet} history={history} />;
}
