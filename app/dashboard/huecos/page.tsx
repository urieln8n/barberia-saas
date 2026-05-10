import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { ArrowRight, CalendarClock, Scissors, Users } from "lucide-react";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { buildTodayBarberAvailability } from "@/src/lib/booking/barber-availability";
import { TodayAvailability } from "@/components/dashboard/TodayAvailability";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { StatCard } from "@/components/ui/StatCard";

export const dynamic = "force-dynamic";

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

function getLocalDateISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default async function HuecosPage() {
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

  const today = getLocalDateISO();
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

  const [barbersResult, appointmentsResult] = await Promise.all([
    dataClient
      .from("barbers")
      .select("id, name")
      .eq("barbershop_id", barbershopId)
      .eq("active", true)
      .order("name", { ascending: true }),

    dataClient
      .from("appointments")
      .select("barber_id, start_time, end_time, status")
      .eq("barbershop_id", barbershopId)
      .eq("appointment_date", today),
  ]);

  const barbers = ((barbersResult.data as BarberRow[]) ?? []).map((barber) => ({
    id: barber.id,
    name: barber.name,
  }));

  const availabilityItems = buildTodayBarberAvailability({
    barbers,
    appointments: ((appointmentsResult.data as AppointmentRow[]) ?? []).map((appointment) => ({
      barber_id: appointment.barber_id,
      start_time: appointment.start_time,
      end_time: appointment.end_time,
      status: appointment.status,
    })),
    todayIso: today,
    startHour: 9,
    endHour: 20,
    intervalMinutes: 30,
  });

  const totalFreeSlots = availabilityItems.reduce(
    (sum, item) => sum + item.freeSlots.length,
    0
  );
  const totalAppointments = availabilityItems.reduce(
    (sum, item) => sum + item.appointmentsToday,
    0
  );
  const barberWithMostSlots = availabilityItems.reduce(
    (top, item) => (!top || item.freeSlots.length > top.freeSlots.length ? item : top),
    null as (typeof availabilityItems)[number] | null
  );
  const availableBarbers = availabilityItems.filter((item) => item.freeSlots.length > 0).length;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Agenda"
        title="Huecos libres"
        description="Vista rápida para saber qué barbero tiene horas disponibles hoy y copiar un mensaje listo para captar clientes."
        action={
          <PrimaryButton href="/dashboard/agenda" variant="secondary">
            Ver agenda <ArrowRight size={15} />
          </PrimaryButton>
        }
      />

      {(barbersResult.error || appointmentsResult.error) && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
          No se pudieron cargar todos los huecos. Revisa la conexión o permisos de lectura.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total huecos libres hoy"
          value={totalFreeSlots}
          description="Slots disponibles desde ahora"
          icon={CalendarClock}
        />
        <StatCard
          label="Barbero con más huecos"
          value={barberWithMostSlots?.barberName ?? "Sin barberos"}
          description={barberWithMostSlots ? `${barberWithMostSlots.freeSlots.length} huecos libres` : "Activa tu equipo"}
          icon={Scissors}
          iconBg="bg-[#D5A84C]/10"
          iconColor="text-[#8A641F]"
        />
        <StatCard
          label="Barberos disponibles"
          value={availableBarbers}
          description="Con al menos un hueco"
          icon={Users}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
        />
        <StatCard
          label="Citas de hoy"
          value={totalAppointments}
          description="Reservas activas asignadas"
          icon={CalendarClock}
          iconBg="bg-blue-50"
          iconColor="text-blue-700"
        />
      </div>

      {barbers.length === 0 ? (
        <EmptyState
          icon={Scissors}
          title="Sin barberos activos"
          description="Activa o crea barberos para calcular huecos libres por cada miembro del equipo."
          action={
            <PrimaryButton href="/dashboard/barberos" variant="primary">
              Gestionar barberos
            </PrimaryButton>
          }
        />
      ) : (
        <TodayAvailability items={availabilityItems} />
      )}

      {barbers.length > 0 && totalFreeSlots === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-600 shadow-sm">
          No hay huecos libres restantes para hoy con el horario actual. Puedes revisar la agenda o crear una cita manual para otro día.
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
        Cálculo basado en barberos activos y citas de hoy con estado pendiente, programada o confirmada. No modifica reservas ni disponibilidad pública.
      </div>
    </div>
  );
}
