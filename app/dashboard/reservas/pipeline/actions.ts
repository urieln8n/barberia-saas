"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";

const ALLOWED_STATUS = ["scheduled", "confirmed", "completed", "cancelled", "no_show"] as const;

export async function updatePipelineAppointmentStatus(formData: FormData) {
  const id = String(formData.get("appointment_id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (!id || !ALLOWED_STATUS.includes(status as (typeof ALLOWED_STATUS)[number])) {
    return;
  }

  const authClient = await createServerClient();
  const {
    data: { user },
    error,
  } = await authClient.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const barbershopId = await getCurrentBarbershopId(authClient, user.id);
  if (!barbershopId) {
    redirect("/onboarding");
  }

  const supabase = createServiceRoleClient();
  await supabase
    .from("appointments")
    .update({ status: status as (typeof ALLOWED_STATUS)[number] })
    .eq("id", id)
    .eq("barbershop_id", barbershopId);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/agenda");
  revalidatePath("/dashboard/reservas");
  revalidatePath("/dashboard/reservas/pipeline");
}
