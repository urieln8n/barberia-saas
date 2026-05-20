import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/src/types/database.types";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";

export type AutomationEventType = "appointment_created";

type CreateAutomationEventInput = {
  barbershopId: string;
  eventType: AutomationEventType;
  payload: Json;
  idempotencyKey: string;
  supabase?: SupabaseClient<Database>;
};

export async function createAutomationEvent({
  barbershopId,
  eventType,
  payload,
  idempotencyKey,
  supabase = createServiceRoleClient(),
}: CreateAutomationEventInput) {
  const { data, error } = await supabase
    .from("automation_events")
    .insert({
      barbershop_id: barbershopId,
      event_type: eventType,
      payload,
      idempotency_key: idempotencyKey,
    })
    .select("id")
    .single();

  if (error?.code === "23505") {
    console.info("automation_events duplicate ignored", {
      eventType,
      idempotencyKey,
    });
    return { eventId: null, duplicate: true, error: null };
  }

  if (error) {
    console.error("automation_events insert failed", {
      eventType,
      idempotencyKey,
      error: error.message,
    });
    return { eventId: null, duplicate: false, error: error.message };
  }

  console.info("automation_events queued", {
    eventType,
    eventId: data.id,
    idempotencyKey,
  });

  return { eventId: data.id, duplicate: false, error: null };
}

export function buildAppointmentCreatedPayload({
  appointmentId,
  barbershopId,
  barbershopSlug,
  serviceId,
  barberId,
  clientName,
  clientPhone,
  appointmentDate,
  startTime,
}: {
  appointmentId: string;
  barbershopId: string;
  barbershopSlug: string;
  serviceId: string;
  barberId: string | null;
  clientName: string;
  clientPhone: string;
  appointmentDate: string;
  startTime: string;
}): Json {
  return {
    appointment_id: appointmentId,
    barbershop_id: barbershopId,
    barbershop_slug: barbershopSlug,
    service_id: serviceId,
    barber_id: barberId,
    client: {
      name: clientName,
      phone: clientPhone,
    },
    appointment: {
      date: appointmentDate,
      start_time: startTime,
    },
    source: "public_booking",
  };
}
