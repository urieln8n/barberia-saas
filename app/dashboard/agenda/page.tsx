import { redirect } from "next/navigation";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { AgendaClient, type Appointment } from "./AgendaClient";

type Props = {
  searchParams?: {
    fecha?: string;
  };
};

type Relation<T> = T | T[] | null | undefined;

function firstRelation<T>(value: Relation<T>): T | null {
  if (!value) return null;
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

function getLocalDateISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeAppointment(item: any): Appointment {
  const client = firstRelation(item.clients);
  const service = firstRelation(item.services);
  const barber = firstRelation(item.barbers);

  return {
    id: item.id,
    appointment_date: item.appointment_date,
    start_time: item.start_time,
    end_time: item.end_time,
    status: item.status ?? "pending",
    notes: item.notes ?? null,
    clients: client
      ? {
          name: client.name ?? "Cliente sin nombre",
          phone: client.phone ?? null,
        }
      : null,
    services: service
      ? {
          name: service.name ?? "Servicio no definido",
          price: service.price ?? 0,
        }
      : null,
    barbers: barber
      ? {
          name: barber.name ?? "Sin barbero",
        }
      : null,
  };
}

export default async function AgendaPage({ searchParams }: Props) {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);

  if (!barbershopId) {
    redirect("/onboarding");
  }

  const fecha = searchParams?.fecha ?? getLocalDateISO();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const dataClient =
    supabaseUrl && serviceRoleKey
      ? createServiceClient(supabaseUrl, serviceRoleKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        })
      : supabase;

  const [
    appointmentsResult,
    upcomingAppointmentsResult,
    clientsResult,
    servicesResult,
    barbersResult,
  ] =
    await Promise.all([
      dataClient
        .from("appointments")
        .select(
          `
          id,
          appointment_date,
          start_time,
          end_time,
          status,
          notes,
          clients (
            name,
            phone
          ),
          services (
            name,
            price
          ),
          barbers (
            name
          )
        `
        )
        .eq("barbershop_id", barbershopId)
        .eq("appointment_date", fecha)
        .order("start_time", { ascending: true }),

      dataClient
        .from("appointments")
        .select(
          `
          id,
          appointment_date,
          start_time,
          end_time,
          status,
          notes,
          clients (
            name,
            phone
          ),
          services (
            name,
            price
          ),
          barbers (
            name
          )
        `
        )
        .eq("barbershop_id", barbershopId)
        .gt("appointment_date", fecha)
        .not("status", "in", "(cancelled,completed,no_show)")
        .order("appointment_date", { ascending: true })
        .order("start_time", { ascending: true })
        .limit(100),

      dataClient
        .from("clients")
        .select("id, name, phone")
        .eq("barbershop_id", barbershopId)
        .order("name", { ascending: true }),

      dataClient
        .from("services")
        .select("id, name, price, duration_minutes")
        .eq("barbershop_id", barbershopId)
        .eq("active", true)
        .order("name", { ascending: true }),

      dataClient
        .from("barbers")
        .select("id, name")
        .eq("barbershop_id", barbershopId)
        .eq("active", true)
        .order("name", { ascending: true }),
    ]);

  const appointmentsForSelectedDate = (
    (appointmentsResult.data as any[]) ?? []
  ).map(normalizeAppointment);

  const upcomingAppointments = (
    (upcomingAppointmentsResult.data as any[]) ?? []
  )
    .map(normalizeAppointment)
    .slice(0, 10);

  const allAppointments = [
    ...appointmentsForSelectedDate,
    ...upcomingAppointments,
  ];

  return (
    <AgendaClient
      appointments={appointmentsForSelectedDate}
      upcomingAppointments={upcomingAppointments}
      clients={clientsResult.data ?? []}
      services={servicesResult.data ?? []}
      barbers={barbersResult.data ?? []}
      barbershopId={barbershopId}
      fecha={fecha}
      allAppointments={allAppointments}
    />
  );
}
