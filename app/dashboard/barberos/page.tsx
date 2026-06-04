import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getBarbershopPlanUsage } from "@/src/lib/plans/limits";
import { BarberosClient } from "./BarberosClient";

export default async function BarberosPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);
  const dayOfWeek = today.getDay(); // 0=Dom … 6=Sáb
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((dayOfWeek + 6) % 7)); // lunes
  const weekStartISO = weekStart.toISOString().slice(0, 10);

  const [
    { data: barbers },
    { data: schedules },
    { data: closures },
    { data: apptToday },
    { data: apptWeek },
  ] = await Promise.all([
    // photo_url disponible tras migración 035
    (supabase as any)
      .from("barbers")
      .select("id, name, phone, active, photo_url")
      .eq("barbershop_id", barbershopId)
      .order("created_at", { ascending: true }),

    supabase
      .from("barber_schedules")
      .select("id, barber_id, weekday, start_time, end_time, active")
      .eq("barbershop_id", barbershopId)
      .order("weekday", { ascending: true })
      .order("start_time", { ascending: true }),

    supabase
      .from("barbershop_closures")
      .select("id, closure_date, start_time, end_time, reason")
      .eq("barbershop_id", barbershopId)
      .gte("closure_date", todayISO)
      .order("closure_date", { ascending: true })
      .limit(12),

    // Citas de hoy activas — agrupadas por barbero
    supabase
      .from("appointments")
      .select("barber_id, status")
      .eq("barbershop_id", barbershopId)
      .eq("appointment_date", todayISO)
      .in("status", ["scheduled", "confirmed", "completed"]),

    // Citas de esta semana activas — agrupadas por barbero
    supabase
      .from("appointments")
      .select("barber_id, status, service_id, services(price)")
      .eq("barbershop_id", barbershopId)
      .gte("appointment_date", weekStartISO)
      .lte("appointment_date", todayISO)
      .in("status", ["scheduled", "confirmed", "completed"]),
  ]);

  // Calcular stats por barbero
  const todayCountByBarber: Record<string, number> = {};
  for (const a of apptToday ?? []) {
    if (a.barber_id) todayCountByBarber[a.barber_id] = (todayCountByBarber[a.barber_id] ?? 0) + 1;
  }

  const weekCountByBarber: Record<string, number> = {};
  const weekRevenueByBarber: Record<string, number> = {};
  for (const a of apptWeek ?? []) {
    if (!a.barber_id) continue;
    weekCountByBarber[a.barber_id] = (weekCountByBarber[a.barber_id] ?? 0) + 1;
    const price = Array.isArray(a.services) ? (a.services[0]?.price ?? 0) : (a.services?.price ?? 0);
    weekRevenueByBarber[a.barber_id] = (weekRevenueByBarber[a.barber_id] ?? 0) + Number(price);
  }

  const planUsage = await getBarbershopPlanUsage(supabase, barbershopId);

  return (
    <BarberosClient
      barbers={barbers ?? []}
      schedules={schedules ?? []}
      closures={closures ?? []}
      barbershopId={barbershopId}
      planUsage={planUsage}
      todayCountByBarber={todayCountByBarber}
      weekCountByBarber={weekCountByBarber}
      weekRevenueByBarber={weekRevenueByBarber}
    />
  );
}
