import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getTodayISO } from "@/src/lib/agenda/agenda-utils";
import { getAgendaData } from "@/src/lib/agenda/get-agenda-data";
import { AgendaClient } from "./AgendaClient";

type Props = {
  searchParams?: {
    fecha?: string;
  };
};

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

  const selectedDate = searchParams?.fecha ?? getTodayISO();
  const agendaData = await getAgendaData({
    supabase,
    barbershopId,
    selectedDate,
  });

  return (
    <AgendaClient
      {...agendaData}
      selectedDate={selectedDate}
      barbershopId={barbershopId}
    />
  );
}
