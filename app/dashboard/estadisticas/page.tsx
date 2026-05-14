import { redirect } from "next/navigation";
import { CalendarClock, Clock, Scissors, TrendingUp, Users } from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { buildStatsBarberAvailability } from "@/src/lib/stats/availability";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatCard } from "@/components/ui/StatCard";

export const dynamic = "force-dynamic";

type BarberRow = {
  id: string;
  name: string;
};

type AppointmentRow = {
  barber_id: string | null;
  start_time: string | null;
  end_time: string | null;
  status: string | null;
};

const STATUS_TONE: Record<string, string> = {
  "Alta ocupacion": "border-emerald-200 bg-emerald-50 text-emerald-700",
  Disponible: "border-[#C9922A]/25 bg-[#C9922A]/10 text-[#7A5218]",
  "Dia libre o sin horario": "border-slate-200 bg-slate-100 text-slate-600",
  Completo: "border-neutral-200 bg-neutral-100 text-neutral-700",
};

function getLocalDateISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default async function EstadisticasPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const today = getLocalDateISO();

  const [barbersResult, appointmentsResult] = await Promise.all([
    supabase
      .from("barbers")
      .select("id, name")
      .eq("barbershop_id", barbershopId)
      .eq("active", true)
      .order("name", { ascending: true }),
    supabase
      .from("appointments")
      .select("barber_id, start_time, end_time, status")
      .eq("barbershop_id", barbershopId)
      .eq("appointment_date", today),
  ]);

  const barbers = ((barbersResult.data as BarberRow[] | null) ?? []).map((barber) => ({
    id: barber.id,
    name: barber.name,
  }));
  const appointments = ((appointmentsResult.data as AppointmentRow[] | null) ?? []).map((appointment) => ({
    barber_id: appointment.barber_id,
    start_time: appointment.start_time,
    end_time: appointment.end_time,
    status: appointment.status,
  }));
  const availabilityItems = buildStatsBarberAvailability({
    barbers,
    appointments,
    todayIso: today,
  });
  const totalFreeSlots = availabilityItems.reduce((sum, item) => sum + item.freeSlots.length, 0);
  const totalAppointments = availabilityItems.reduce((sum, item) => sum + item.appointmentsToday, 0);
  const averageOccupancy =
    availabilityItems.length > 0
      ? Math.round(
          availabilityItems.reduce((sum, item) => sum + item.occupancyPercent, 0) /
            availabilityItems.length,
        )
      : 0;
  const nextAvailable = availabilityItems.find((item) => item.nextAvailableSlot);

  return (
    <div className="space-y-5">
      <PageHeader
        section="Estadísticas"
        title="Estadísticas operativas"
        description="Disponibilidad real de hoy por barbero, basada en citas activas y duración de cada reserva."
      />

      {(barbersResult.error || appointmentsResult.error) && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
          No se pudieron cargar todas las estadísticas. Revisa la conexión o permisos de lectura.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Huecos libres hoy" value={totalFreeSlots} description="Slots disponibles desde ahora" icon={CalendarClock} />
        <StatCard label="Barberos activos" value={barbers.length} description="Incluidos en el cálculo" icon={Scissors} iconBg="bg-[#D5A84C]/10" iconColor="text-[#8A641F]" />
        <StatCard label="Citas de hoy" value={totalAppointments} description="Canceladas y no-show no bloquean huecos" icon={Users} iconBg="bg-blue-50" iconColor="text-blue-700" />
        <StatCard label="Ocupación media" value={`${averageOccupancy}%`} description={nextAvailable ? `Próximo hueco ${nextAvailable.nextAvailableSlot}` : "Sin huecos detectados"} icon={TrendingUp} iconBg="bg-emerald-50" iconColor="text-emerald-700" />
      </div>

      <SectionCard
        title="Huecos libres por barbero"
        description="Ventana fallback 09:00-20:00 hasta que haya horarios formales por barbero."
      >
        {availabilityItems.length === 0 ? (
          <EmptyState
            icon={Scissors}
            title="No hay barberos activos"
            description="Activa o crea barberos para calcular huecos libres por cada miembro del equipo."
          />
        ) : (
          <div className="grid gap-3">
            {availabilityItems.map((item) => (
              <article
                key={item.barberId}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#080A0F] text-sm font-black uppercase text-[#C9922A]">
                        {item.barberName.charAt(0)}
                      </div>
                      <div>
                        <h2 className="font-black text-[#080A0F]">{item.barberName}</h2>
                        <p className="text-xs text-slate-500">
                          {item.appointmentsToday} citas hoy · {item.workingWindowLabel}
                        </p>
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${STATUS_TONE[item.visualStatusLabel]}`}>
                        {item.visualStatusLabel}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-[10px] font-black uppercase text-slate-400">Próximo hueco</p>
                      <p className="mt-1 text-lg font-black text-[#080A0F]">
                        {item.nextAvailableSlot ?? "Completo"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-[10px] font-black uppercase text-slate-400">Huecos hoy</p>
                      <p className="mt-1 text-lg font-black text-[#080A0F]">{item.freeSlots.length}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-[10px] font-black uppercase text-slate-400">Ocupación</p>
                      <p className="mt-1 text-lg font-black text-[#080A0F]">{item.occupancyPercent}%</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.freeSlots.length === 0 ? (
                    <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-500">
                      Sin huecos libres
                    </span>
                  ) : (
                    item.freeSlots.slice(0, 10).map((slot) => (
                      <span
                        key={slot}
                        className="rounded-full border border-[#C89B3C]/25 bg-[#C89B3C]/10 px-3 py-1.5 text-xs font-black text-[#8A641F]"
                      >
                        <Clock size={12} className="mr-1 inline" />
                        {slot}
                      </span>
                    ))
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
