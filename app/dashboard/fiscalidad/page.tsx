import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { FiscalClient } from "./FiscalClient";

export const dynamic = "force-dynamic";

export default async function FiscalidadPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const year = new Date().getFullYear();
  const yearStart = `${year}-01-01`;
  const yearEnd   = `${year}-12-31`;

  const [{ data: payments }, { data: expenses }] = await Promise.all([
    supabase
      .from("payments")
      .select("amount, created_at")
      .eq("barbershop_id", barbershopId)
      .eq("status", "paid")
      .gte("created_at", `${yearStart}T00:00:00`)
      .lte("created_at", `${yearEnd}T23:59:59`),

    supabase
      .from("expenses")
      .select("amount, category, expense_date")
      .eq("barbershop_id", barbershopId)
      .gte("expense_date", yearStart)
      .lte("expense_date", yearEnd),
  ]);

  return (
    <FiscalClient
      payments={(payments as any) ?? []}
      expenses={(expenses as any) ?? []}
      year={year}
    />
  );
}
