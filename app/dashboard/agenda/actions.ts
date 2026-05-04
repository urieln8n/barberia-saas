"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";

async function getBarbershopId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  return { supabase, barbershopId };
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export async function createAppointment(formData: FormData) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return { error: "Sin barbería" };

  const client_id   = formData.get("client_id") as string;
  const service_id  = formData.get("service_id") as string;
  const barber_id   = formData.get("barber_id") as string || null;
  const date        = formData.get("appointment_date") as string;
  const start_time  = formData.get("start_time") as string;
  const notes       = (formData.get("notes") as string)?.trim() || null;

  // Obtener duración del servicio para calcular end_time
  const { data: service } = await supabase
    .from("services")
    .select("duration_minutes")
    .eq("id", service_id)
    .single();

  if (!service) return { error: "Servicio no encontrado" };

  const end_time = addMinutes(start_time, service.duration_minutes);

  // Validación anti-doble reserva
  if (barber_id) {
    const { data: conflicts } = await supabase
      .from("appointments")
      .select("id")
      .eq("barbershop_id", barbershopId)
      .eq("barber_id", barber_id)
      .eq("appointment_date", date)
      .not("status", "in", '("cancelled","no_show")')
      .lt("start_time", end_time)
      .gt("end_time", start_time)
      .limit(1);

    if (conflicts && conflicts.length > 0) {
      return { error: "El barbero ya tiene una cita en ese horario" };
    }
  }

  await supabase.from("appointments").insert({
    barbershop_id:    barbershopId,
    client_id,
    service_id,
    barber_id,
    appointment_date: date,
    start_time,
    end_time,
    status:           "scheduled",
    source:           "dashboard",
    notes,
  });

  revalidatePath("/dashboard/agenda");
  return { error: null };
}

export async function updateAppointmentStatus(id: string, status: string) {
  const { supabase } = await getBarbershopId();
  await supabase.from("appointments").update({ status }).eq("id", id);
  revalidatePath("/dashboard/agenda");
}
