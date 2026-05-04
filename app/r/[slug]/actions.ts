"use server";

import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";

type BookingInput = {
  barbershopId: string;
  serviceId: string;
  barberId: string | null;
  date: string;
  time: string;
  name: string;
  phone: string;
};

export async function createPublicBooking(
  input: BookingInput
): Promise<{ error: string | null }> {
  const supabase = createServiceRoleClient();

  const barbershopId = input.barbershopId?.trim();
  const serviceId = input.serviceId?.trim();
  const date = input.date?.trim();
  const time = input.time?.trim();
  const name = input.name?.trim();
  const phone = input.phone?.trim();

  const barberId =
    input.barberId && input.barberId !== "any" && input.barberId.trim() !== ""
      ? input.barberId.trim()
      : null;

  if (!barbershopId || !serviceId || !date || !time || !name || !phone) {
    return {
      error: "Completa todos los campos obligatorios.",
    };
  }

  // Buscar slug de la barbería usando el ID que llega desde /r/[slug]
  const { data: barbershop, error: barbershopError } = await supabase
    .from("barbershops")
    .select("id, slug, public_booking_enabled")
    .eq("id", barbershopId)
    .maybeSingle();

  if (barbershopError || !barbershop) {
    return {
      error: "Barbería no encontrada.",
    };
  }

  if (barbershop.public_booking_enabled === false) {
    return {
      error: "Las reservas online no están activas para esta barbería.",
    };
  }

  const { error: bookingError } = await supabase.rpc("create_booking_safe", {
    p_slug: barbershop.slug,
    p_service_id: serviceId,
    p_barber_id: barberId,
    p_client_name: name,
    p_client_phone: phone,
    p_appointment_date: date,
    p_start_time: time,
    p_notes: null,
  });

  if (bookingError) {
    const message = bookingError.message || "";

    if (
      message.includes("unique_active_barber_appointment_slot") ||
      message.toLowerCase().includes("duplicate") ||
      message.toLowerCase().includes("already exists")
    ) {
      return {
        error: "Esta hora ya no está disponible. Elige otra.",
      };
    }

    if (
      message.includes("Esta hora ya no está disponible") ||
      message.includes("Barbero no disponible") ||
      message.includes("Servicio no disponible") ||
      message.includes("Barbería no encontrada")
    ) {
      return {
        error: message,
      };
    }

    return {
      error: "No se pudo crear la reserva. Inténtalo de nuevo.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/agenda");
  revalidatePath("/dashboard/clientes");
  revalidatePath(`/r/${barbershop.slug}`);

  return {
    error: null,
  };
}