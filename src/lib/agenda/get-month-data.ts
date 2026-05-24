import type { SupabaseClient } from "@supabase/supabase-js";
import { toISODate } from "./agenda-utils";
import type { AgendaAppointment, AgendaBarber, AgendaService } from "./types";

function firstRelation<T>(value: unknown): T | null {
  if (!value) return null;
  if (Array.isArray(value)) return (value[0] as T) ?? null;
  return value as T;
}

function normalizeAppointment(item: Record<string, unknown>): AgendaAppointment {
  const client = firstRelation<Record<string, unknown>>(item.clients);
  const service = firstRelation<Record<string, unknown>>(item.services);
  const barber = firstRelation<Record<string, unknown>>(item.barbers);

  return {
    id: String(item.id),
    appointment_date: String(item.appointment_date),
    start_time: String(item.start_time),
    end_time: item.end_time ? String(item.end_time) : null,
    status: (item.status as AgendaAppointment["status"]) ?? "scheduled",
    source: item.source ? String(item.source) : null,
    notes: item.notes ? String(item.notes) : null,
    created_at: item.created_at ? String(item.created_at) : null,
    client: client
      ? {
          id: String(client.id),
          name: String(client.name ?? "Cliente"),
          phone: client.phone ? String(client.phone) : null,
          visit_count: Number(client.visit_count ?? 0),
          last_visit_at: client.last_visit_at
            ? String(client.last_visit_at)
            : null,
        }
      : null,
    service: service
      ? {
          id: String(service.id),
          name: String(service.name ?? "Servicio"),
          price: Number(service.price ?? 0),
          duration_minutes: Number(service.duration_minutes ?? 30),
        }
      : null,
    barber: barber
      ? {
          id: String(barber.id),
          name: String(barber.name ?? "Barbero"),
          phone: barber.phone ? String(barber.phone) : null,
        }
      : null,
  };
}

export async function getMonthAppointments({
  supabase,
  barbershopId,
  year,
  month,
}: {
  supabase: SupabaseClient;
  barbershopId: string;
  year: number;
  month: number;
}): Promise<{ appointments: AgendaAppointment[]; error: string | null }> {
  const firstDay = toISODate(new Date(year, month - 1, 1));
  const lastDay = toISODate(new Date(year, month, 0));

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_date,
      start_time,
      end_time,
      status,
      source,
      notes,
      created_at,
      clients ( id, name, phone, visit_count, last_visit_at ),
      services ( id, name, price, duration_minutes ),
      barbers ( id, name, phone )
    `,
    )
    .eq("barbershop_id", barbershopId)
    .gte("appointment_date", firstDay)
    .lte("appointment_date", lastDay)
    .order("appointment_date", { ascending: true })
    .order("start_time", { ascending: true });

  return {
    appointments: ((data as Record<string, unknown>[]) ?? []).map(
      normalizeAppointment,
    ),
    error: error?.message ?? null,
  };
}
