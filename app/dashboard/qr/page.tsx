import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { QRClient } from "./QRClient";

export default async function QRPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const { data: barbershop } = await supabase
    .from("barbershops")
    .select("name, slug")
    .eq("id", barbershopId)
    .single();

  if (!barbershop) redirect("/onboarding");

  return <QRClient name={barbershop.name} slug={barbershop.slug} />;
}
