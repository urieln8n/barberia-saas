import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Huecos libres | BarberíaOS",
  description: "Mira qué barbero está libre ahora y llena la agenda en segundos.",
};
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { ArrowRight, CalendarPlus, Megaphone } from "lucide-react";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { buildOperationalFreeSlots } from "@/src/lib/agenda/get-free-slots";
import { PageHeader } from "@/components/ui/PageHeader";
import { HuecosClient } from "./HuecosClient";

export const dynamic = "force-dynamic";

type SearchParams = {
  date?: string;
  fecha?: string;
};

type PageProps = {
  searchParams?: SearchParams;
};

type AppointmentRow = {
  barber_id: string | null;
  start_time: string | null;
  end_time: string | null;
  status: string | null;
};

type BarberRow = {
  id: string;
  name: string;
};

type ServiceRow = {
  id: string;
  name: string;
  price: number | null;
  duration_minutes: number | null;
};

type ScheduleRow = {
  barber_id: string;
  weekday: number;
  start_time: string | null;
  end_time: string | null;
  active: boolean | null;
};

function getMadridDateISO() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function isValidDateISO(value?: string) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

export default async function HuecosPage({ searchParams }: PageProps) {
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

  const requestedDate = searchParams?.date ?? searchParams?.fecha;
  const todayISO = getMadridDateISO();
  const dateISO = isValidDateISO(requestedDate) ? requestedDate! : todayISO;
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

  const [barbersResult, servicesResult, appointmentsResult, schedulesResult] =
    await Promise.all([
      dataClient
        .from("barbers")
        .select("id, name")
        .eq("barbershop_id", barbershopId)
        .eq("active", true)
        .order("name", { ascending: true }),

      dataClient
        .from("services")
        .select("id, name, price, duration_minutes")
        .eq("barbershop_id", barbershopId)
        .eq("active", true)
        .order("duration_minutes", { ascending: true }),

      dataClient
        .from("appointments")
        .select("barber_id, start_time, end_time, status")
        .eq("barbershop_id", barbershopId)
        .eq("appointment_date", dateISO),

      dataClient
        .from("barber_schedules")
        .select("barber_id, weekday, start_time, end_time, active")
        .eq("barbershop_id", barbershopId)
        .eq("active", true),
    ]);

  const barbers = ((barbersResult.data as BarberRow[] | null) ?? []).map((barber) => ({
    id: barber.id,
    name: barber.name,
  }));
  const services = ((servicesResult.data as ServiceRow[] | null) ?? []).map((service) => ({
    id: service.id,
    name: service.name,
    price: service.price,
    duration_minutes: service.duration_minutes,
  }));
  const appointments = ((appointmentsResult.data as AppointmentRow[] | null) ?? []).map(
    (appointment) => ({
      barber_id: appointment.barber_id,
      start_time: appointment.start_time,
      end_time: appointment.end_time,
      status: appointment.status,
    }),
  );
  const schedules = ((schedulesResult.data as ScheduleRow[] | null) ?? []).map((schedule) => ({
    barber_id: schedule.barber_id,
    weekday: schedule.weekday,
    start_time: schedule.start_time,
    end_time: schedule.end_time,
    active: schedule.active,
  }));

  const { slots, summary } = buildOperationalFreeSlots({
    dateISO,
    barbers,
    appointments,
    services,
    schedules,
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Huecos libres"
        description="Mira quien esta libre y llena la agenda en segundos."
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/dashboard/agenda" className="btn-primary">
              <CalendarPlus size={15} />
              Nueva reserva
            </Link>
            <Link href={`/dashboard/agenda?view=day&date=${dateISO}`} className="btn-outline">
              Ver agenda
              <ArrowRight size={15} />
            </Link>
            <Link href="/dashboard/marketing" className="btn-outline">
              <Megaphone size={15} />
              Campana rapida
            </Link>
          </div>
        }
      />

      {(barbersResult.error ||
        servicesResult.error ||
        appointmentsResult.error ||
        schedulesResult.error) && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
          No se pudieron cargar todos los datos de huecos. Revisa conexion o permisos de lectura.
        </div>
      )}

      <HuecosClient
        dateISO={dateISO}
        todayISO={todayISO}
        slots={slots}
        summary={summary}
        services={services}
        barbers={barbers}
      />

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs font-medium text-slate-500">
        Calculo basado en horarios de barbero si existen, reservas activas y servicios que caben en cada intervalo.
        Bloquean `pending`, `scheduled` y `confirmed`; no bloquean `cancelled`, `completed` ni `no_show`.
      </div>
    </div>
  );
}
