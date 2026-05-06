import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { FinanzasClient } from "./FinanzasClient";

export const dynamic = "force-dynamic";

function getMonthBounds() {
  const now = new Date();
  const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const end = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { start, end };
}

export default async function FinanzasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const today = new Date().toISOString().split("T")[0];
  const { start: monthStart, end: monthEnd } = getMonthBounds();

  const [
    { data: todayPayments },
    { data: monthPayments },
    { data: monthExpenses },
  ] = await Promise.all([
    supabase
      .from("payments")
      .select("amount")
      .eq("barbershop_id", barbershopId)
      .eq("status", "paid")
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`),

    supabase
      .from("payments")
      .select("amount")
      .eq("barbershop_id", barbershopId)
      .eq("status", "paid")
      .gte("created_at", `${monthStart}T00:00:00`)
      .lte("created_at", `${monthEnd}T23:59:59`),

    supabase
      .from("expenses")
      .select("id, amount, category, description, expense_date")
      .eq("barbershop_id", barbershopId)
      .gte("expense_date", monthStart)
      .lte("expense_date", monthEnd)
      .order("expense_date", { ascending: false })
      .limit(50),
  ]);

  const ingresosHoy = (todayPayments ?? []).reduce((s, p) => s + Number(p.amount), 0);
  const ingresosMes = (monthPayments ?? []).reduce((s, p) => s + Number(p.amount), 0);
  const gastosMes   = (monthExpenses ?? []).reduce((s, e) => s + Number(e.amount), 0);

  return (
    <FinanzasClient
      ingresosHoy={ingresosHoy}
      ingresosMes={ingresosMes}
      gastosMes={gastosMes}
      expenses={(monthExpenses as any) ?? []}
      today={today}
    />
  );
}
