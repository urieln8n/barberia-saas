import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { ReservasClient } from "./ReservasClient";

export const dynamic = "force-dynamic";

// ─── Raw types from Supabase join ───────────────────────────────────────────

type RawRelation<T> = T | T[] | null | undefined;

type RawAppointment = {
  id: string;
  appointment_date: string;
  start_time: string | null;
  end_time: string | null;
  status: string | null;
  notes: string | null;
  source: string | null;
  created_at: string;
  clients: RawRelation<{
    id: string;
    name: string | null;
    phone: string | null;
    visit_count: number | null;
  }>;
  services: RawRelation<{
    id: string;
    name: string | null;
    price: number | null;
    duration_minutes: number | null;
  }>;
  barbers: RawRelation<{
    id: string;
    name: string | null;
  }>;
};

type RawBarber = { id: string; name: string };
type RawService = { id: string; name: string };

// ─── Public types for the client component ───────────────────────────────────

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show"
  | "pending";

export type ReservationItem = {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes: string | null;
  source: string | null;
  created_at: string;
  client_id: string;
  client_name: string;
  client_phone: string | null;
  client_visit_count: number;
  service_id: string;
  service_name: string;
  service_price: number;
  service_duration: number;
  barber_id: string | null;
  barber_name: string | null;
};

export type ReservasKPIs = {
  todayAppointments: ReservationItem[];
  todayRevenue: number;
  pendingCount: number;
  confirmedCount: number;
  cancelledCount: number;
  newClientsToday: number;
  upcomingNext3h: ReservationItem[];
};

export type BarberFilter = { id: string; name: string };
export type ServiceFilter = { id: string; name: string };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function firstOf<T>(val: RawRelation<T>): T | null {
  if (!val) return null;
  return Array.isArray(val) ? (val[0] ?? null) : val;
}

function normalizeStatus(s: string | null): AppointmentStatus {
  const allowed: AppointmentStatus[] = [
    "scheduled",
    "confirmed",
    "completed",
    "cancelled",
    "no_show",
    "pending",
  ];
  return allowed.includes(s as AppointmentStatus)
    ? (s as AppointmentStatus)
    : "scheduled";
}

function toReservationItem(row: RawAppointment): ReservationItem {
  const client = firstOf(row.clients);
  const service = firstOf(row.services);
  const barber = firstOf(row.barbers);

  return {
    id: row.id,
    appointment_date: row.appointment_date,
    start_time: row.start_time ?? "00:00",
    end_time: row.end_time ?? "00:00",
    status: normalizeStatus(row.status),
    notes: row.notes,
    source: row.source,
    created_at: row.created_at,
    client_id: client?.id ?? "",
    client_name: client?.name ?? "Cliente",
    client_phone: client?.phone ?? null,
    client_visit_count: client?.visit_count ?? 0,
    service_id: service?.id ?? "",
    service_name: service?.name ?? "Servicio",
    service_price: service?.price ?? 0,
    service_duration: service?.duration_minutes ?? 0,
    barber_id: barber?.id ?? null,
    barber_name: barber?.name ?? null,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ReservasPage() {
  // 1. Auth
  const authClient = await createClient();
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) redirect("/login");

  // 2. Barbershop
  const barbershopId = await getCurrentBarbershopId(authClient, user.id);
  if (!barbershopId) redirect("/onboarding");

  // 3. Main appointments query
  const supabase = createServiceRoleClient();

  const { data: rawData } = await supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_date,
      start_time,
      end_time,
      status,
      notes,
      source,
      created_at,
      clients (id, name, phone, visit_count),
      services (id, name, price, duration_minutes),
      barbers (id, name)
    `
    )
    .eq("barbershop_id", barbershopId)
    .order("appointment_date", { ascending: false })
    .order("start_time", { ascending: false })
    .limit(200);

  const appointments: ReservationItem[] = ((rawData ?? []) as RawAppointment[]).map(
    toReservationItem
  );

  // 4. KPIs
  const todayISO = new Date().toISOString().slice(0, 10);
  const nowH = new Date().getHours();
  const nowMin = new Date().getMinutes();
  const nowTotalMin = nowH * 60 + nowMin;

  const todayAppointments = appointments.filter(
    (a) => a.appointment_date === todayISO
  );

  const todayRevenue = todayAppointments
    .filter((a) => a.status === "completed" || a.status === "confirmed")
    .reduce((sum, a) => sum + a.service_price, 0);

  const pendingCount = appointments.filter(
    (a) => a.status === "scheduled" || a.status === "pending"
  ).length;

  const confirmedCount = appointments.filter(
    (a) => a.status === "confirmed"
  ).length;

  const cancelledCount = appointments.filter(
    (a) => a.status === "cancelled" || a.status === "no_show"
  ).length;

  const newClientsToday = todayAppointments.filter(
    (a) => a.client_visit_count === 1
  ).length;

  const upcomingNext3h = todayAppointments.filter((a) => {
    const [h, m] = a.start_time.split(":").map(Number);
    const startMin = (h ?? 0) * 60 + (m ?? 0);
    const diffMin = startMin - nowTotalMin;
    return (
      diffMin > 0 &&
      diffMin <= 180 &&
      (a.status === "scheduled" || a.status === "confirmed" || a.status === "pending")
    );
  });

  const kpis: ReservasKPIs = {
    todayAppointments,
    todayRevenue,
    pendingCount,
    confirmedCount,
    cancelledCount,
    newClientsToday,
    upcomingNext3h,
  };

  // 5. Filter lists
  const { data: barbersRaw } = await supabase
    .from("barbers")
    .select("id, name")
    .eq("barbershop_id", barbershopId)
    .eq("active", true)
    .order("name");

  const { data: servicesRaw } = await supabase
    .from("services")
    .select("id, name")
    .eq("barbershop_id", barbershopId)
    .eq("active", true)
    .order("name");

  const barbers: BarberFilter[] = ((barbersRaw ?? []) as RawBarber[]).map(
    (b) => ({ id: b.id, name: b.name })
  );

  const services: ServiceFilter[] = ((servicesRaw ?? []) as RawService[]).map(
    (s) => ({ id: s.id, name: s.name })
  );

  return (
    <ReservasClient
      appointments={appointments}
      kpis={kpis}
      barbers={barbers}
      services={services}
      barbershopId={barbershopId}
    />
  );
}
