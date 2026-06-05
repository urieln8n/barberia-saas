import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getTodayISO } from "@/src/lib/agenda/agenda-utils";
import { getAgendaData } from "@/src/lib/agenda/get-agenda-data";
import { getMonthAppointments } from "@/src/lib/agenda/get-month-data";
import { buildMonthData } from "@/src/lib/agenda/month-metrics";
import type { AgendaView, MonthData } from "@/src/lib/agenda/types";
import { AgendaClient } from "./AgendaClient";

const VALID_VIEWS: AgendaView[] = [
  "day",
  "week",
  "month",
  "barbers",
  "opportunities",
];

type Props = {
  searchParams?: {
    view?: string;
    date?: string;
    fecha?: string; // backward compat
    barber?: string;
    service?: string;
    new?: string;
  };
};

export default async function AgendaPage({ searchParams }: Props) {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  // Resolve view (default: week on desktop, handled in client)
  const rawView = searchParams?.view ?? "week";
  const view: AgendaView = VALID_VIEWS.includes(rawView as AgendaView)
    ? (rawView as AgendaView)
    : "week";

  // Resolve date: support both `date` and legacy `fecha`
  const dateISO =
    searchParams?.date ?? searchParams?.fecha ?? getTodayISO();

  // Fetch weekly data for day/week/barbers/opportunities views
  const agendaData = await getAgendaData({
    supabase,
    barbershopId,
    selectedDate: dateISO,
  });

  // For month view: also fetch the full month
  let monthData: MonthData | null = null;
  if (view === "month") {
    const d = new Date(`${dateISO}T00:00:00`);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const { appointments: monthAppts, error: monthError } =
      await getMonthAppointments({ supabase, barbershopId, year, month });
    monthData = buildMonthData(year, month, monthAppts);
    if (monthError) agendaData.errors.push(monthError);
  }

  return (
    <AgendaClient
      {...agendaData}
      view={view}
      dateISO={dateISO}
      barbershopId={barbershopId}
      monthData={monthData}
      initialSelectedBarber={searchParams?.barber ?? ""}
      initialSelectedService={searchParams?.service ?? ""}
      autoOpen={searchParams?.new === "1"}
    />
  );
}
