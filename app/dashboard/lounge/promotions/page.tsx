import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getLoungePromotions } from "@/src/lib/lounge/promotions";
import { LoungePromotionsClient } from "./LoungePromotionsClient";

export const dynamic = "force-dynamic";

export default async function LoungePromotionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const promotions = await getLoungePromotions(supabase, barbershopId);

  return <LoungePromotionsClient initialPromotions={promotions} />;
}
