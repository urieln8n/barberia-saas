"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { assertCanCreateBarber, getBarbershopPlanUsage } from "@/src/lib/plans/limits";

async function getBarbershopId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  return { supabase, barbershopId };
}

export async function createBarber(formData: FormData) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };

  const usage = await getBarbershopPlanUsage(supabase, barbershopId);
  const limitError = assertCanCreateBarber(usage);
  if (limitError) return { error: limitError };

  const { error } = await supabase.from("barbers").insert({
    barbershop_id: barbershopId,
    name:  (formData.get("name") as string).trim(),
    phone: (formData.get("phone") as string)?.trim() || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/barberos");
  return { success: true };
}

export async function updateBarber(formData: FormData) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };
  const id = formData.get("id") as string;

  const { error } = await supabase.from("barbers").update({
    name:  (formData.get("name") as string).trim(),
    phone: (formData.get("phone") as string)?.trim() || null,
  }).eq("id", id).eq("barbershop_id", barbershopId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/barberos");
  return { success: true };
}

export async function toggleBarber(id: string, active: boolean) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };

  const { error } = await supabase
    .from("barbers")
    .update({ active })
    .eq("id", id)
    .eq("barbershop_id", barbershopId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/barberos");
  return { success: true };
}

export async function deleteBarber(id: string) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };

  const { error } = await supabase
    .from("barbers")
    .delete()
    .eq("id", id)
    .eq("barbershop_id", barbershopId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/barberos");
  return { success: true };
}

export async function updateBarberSchedules(formData: FormData) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };

  const barberId = String(formData.get("barber_id") ?? "");
  const { data: barber } = await supabase
    .from("barbers")
    .select("id")
    .eq("id", barberId)
    .eq("barbershop_id", barbershopId)
    .maybeSingle();

  if (!barber) return { error: "Barbero no válido." };

  const rows = Array.from({ length: 7 }, (_, weekday) => {
    const isOpen = formData.get(`open_${weekday}`) === "on";
    const start = String(formData.get(`start_${weekday}`) ?? "").slice(0, 5);
    const end = String(formData.get(`end_${weekday}`) ?? "").slice(0, 5);

    if (!isOpen) return null;
    if (!/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) {
      return "invalid";
    }
    if (start >= end) return "invalid";

    return {
      barbershop_id: barbershopId,
      barber_id: barberId,
      weekday,
      start_time: start,
      end_time: end,
      active: true,
    };
  });

  if (rows.includes("invalid")) {
    return { error: "Revisa los horarios: la apertura debe ser anterior al cierre." };
  }

  const { error: deleteError } = await supabase
    .from("barber_schedules")
    .delete()
    .eq("barbershop_id", barbershopId)
    .eq("barber_id", barberId);

  if (deleteError) return { error: deleteError.message };

  const schedules = rows.filter(Boolean) as Array<{
    barbershop_id: string;
    barber_id: string;
    weekday: number;
    start_time: string;
    end_time: string;
    active: boolean;
  }>;

  if (schedules.length > 0) {
    const { error: insertError } = await supabase
      .from("barber_schedules")
      .insert(schedules);

    if (insertError) return { error: insertError.message };
  }

  revalidatePath("/dashboard/barberos");
  revalidatePath("/dashboard/agenda");
  return { success: true };
}

export async function createClosure(formData: FormData) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };

  const closureDate = String(formData.get("closure_date") ?? "");
  const fullDay = formData.get("full_day") === "on";
  const start = String(formData.get("start_time") ?? "").slice(0, 5);
  const end = String(formData.get("end_time") ?? "").slice(0, 5);
  const reason = String(formData.get("reason") ?? "").trim() || null;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(closureDate)) {
    return { error: "Elige una fecha válida." };
  }

  if (!fullDay && (start >= end || !start || !end)) {
    return { error: "Para cierre parcial, indica una franja válida." };
  }

  const { error } = await supabase.from("barbershop_closures").insert({
    barbershop_id: barbershopId,
    closure_date: closureDate,
    start_time: fullDay ? null : start,
    end_time: fullDay ? null : end,
    reason,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/barberos");
  return { success: true };
}

export async function deleteClosure(id: string) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };

  const { error } = await supabase
    .from("barbershop_closures")
    .delete()
    .eq("id", id)
    .eq("barbershop_id", barbershopId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/barberos");
  return { success: true };
}
