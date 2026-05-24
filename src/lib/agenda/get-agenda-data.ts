import type { SupabaseClient } from "@supabase/supabase-js";
import { getWeekDays } from "./agenda-utils";
import { detectFreeSlots } from "./free-slots";
import { buildAgendaRecommendation, calculateAgendaMetrics } from "./agenda-metrics";
import type {
  AgendaAppointment,
  AgendaBarber,
  AgendaClient,
  AgendaSchedule,
  AgendaService,
} from "./types";

type Relation<T> = T | T[] | null | undefined;

function firstRelation<T>(value: Relation<T>): T | null {
  if (!value) return null;
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

function normalizeAppointment(item: any): AgendaAppointment {
  const client = firstRelation(item.clients);
  const service = firstRelation(item.services);
  const barber = firstRelation(item.barbers);

  return {
    id: item.id,
    appointment_date: item.appointment_date,
    start_time: item.start_time,
    end_time: item.end_time,
    status: item.status ?? "scheduled",
    source: item.source ?? null,
    notes: item.notes ?? null,
    created_at: item.created_at ?? null,
    client: client
      ? {
          id: client.id,
          name: client.name ?? "Cliente sin nombre",
          phone: client.phone ?? null,
          email: client.email ?? null,
          notes: client.notes ?? null,
          visit_count: client.visit_count ?? 0,
          last_visit_at: client.last_visit_at ?? null,
          created_at: client.created_at ?? null,
        }
      : null,
    service: service
      ? {
          id: service.id,
          name: service.name ?? "Servicio no definido",
          price: Number(service.price ?? 0),
          duration_minutes: Number(service.duration_minutes ?? 30),
        }
      : null,
    barber: barber
      ? {
          id: barber.id,
          name: barber.name ?? "Sin barbero",
          phone: barber.phone ?? null,
        }
      : null,
  };
}

export async function getAgendaData({
  supabase,
  barbershopId,
  selectedDate,
}: {
  supabase: SupabaseClient;
  barbershopId: string;
  selectedDate: string;
}) {
  const days = getWeekDays(selectedDate);
  const weekStart = days[0].iso;
  const weekEnd = days[days.length - 1].iso;

  const [appointmentsResult, clientsResult, servicesResult, barbersResult, schedulesResult] =
    await Promise.all([
      supabase
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
          clients (
            id,
            name,
            phone,
            email,
            notes,
            visit_count,
            last_visit_at,
            created_at
          ),
          services (
            id,
            name,
            price,
            duration_minutes
          ),
          barbers (
            id,
            name,
            phone
          )
        `,
        )
        .eq("barbershop_id", barbershopId)
        .gte("appointment_date", weekStart)
        .lte("appointment_date", weekEnd)
        .order("appointment_date", { ascending: true })
        .order("start_time", { ascending: true }),

      supabase
        .from("clients")
        .select("id, name, phone, email, notes, visit_count, last_visit_at, created_at")
        .eq("barbershop_id", barbershopId)
        .order("name", { ascending: true }),

      supabase
        .from("services")
        .select("id, name, price, duration_minutes")
        .eq("barbershop_id", barbershopId)
        .eq("active", true)
        .order("name", { ascending: true }),

      supabase
        .from("barbers")
        .select("id, name, phone")
        .eq("barbershop_id", barbershopId)
        .eq("active", true)
        .order("name", { ascending: true }),

      supabase
        .from("barber_schedules")
        .select("id, barber_id, weekday, start_time, end_time, active")
        .eq("barbershop_id", barbershopId)
        .eq("active", true),
    ]);

  const appointments = ((appointmentsResult.data as any[]) ?? []).map(normalizeAppointment);
  const clients = (clientsResult.data ?? []) as AgendaClient[];
  const services = (servicesResult.data ?? []) as AgendaService[];
  const barbers = (barbersResult.data ?? []) as AgendaBarber[];
  const schedules = (schedulesResult.data ?? []) as AgendaSchedule[];
  const freeSlots = detectFreeSlots({ days, appointments, barbers, schedules });
  const metrics = calculateAgendaMetrics(appointments, freeSlots);
  const recommendation = buildAgendaRecommendation(metrics, appointments, freeSlots);

  return {
    days,
    weekStart,
    weekEnd,
    appointments,
    clients,
    services,
    barbers,
    schedules,
    freeSlots,
    metrics,
    recommendation,
    errors: [
      appointmentsResult.error?.message,
      clientsResult.error?.message,
      servicesResult.error?.message,
      barbersResult.error?.message,
      schedulesResult.error?.message,
    ].filter((message): message is string => Boolean(message)),
  };
}
