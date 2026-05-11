import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient as createSupabaseServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getConfiguredSiteUrl } from "@/src/lib/site-url";
import { buildTodayBarberAvailability } from "@/src/lib/booking/barber-availability";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MarketingStudioClient } from "./MarketingStudioClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Marketing Studio | BarberíaOS",
  description: "Sabe qué publicar y qué enviar para llenar tu agenda sin perder tiempo pensando.",
};

type BarbershopRow  = { name: string | null; slug: string | null; phone: string | null; city: string | null };
type ServiceRow     = { id: string; name: string; price: number | null };
type BarberRow      = { id: string; name: string };
type AppointmentRow = { barber_id: string | null; start_time: string | null; end_time: string | null; status: string | null };

function getLocalDateISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default async function MarketingPage() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const today = getLocalDateISO();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dataClient  =
    supabaseUrl && serviceKey
      ? createSupabaseServiceClient(supabaseUrl, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
      : supabase;

  const [
    barbershopRes,
    servicesRes,
    barbersRes,
    inactiveRes,
    appointmentsRes,
  ] = await Promise.all([
    dataClient
      .from("barbershops")
      .select("name, slug, phone, city")
      .eq("id", barbershopId)
      .maybeSingle(),

    dataClient
      .from("services")
      .select("id, name, price")
      .eq("barbershop_id", barbershopId)
      .eq("active", true)
      .order("name"),

    dataClient
      .from("barbers")
      .select("id, name")
      .eq("barbershop_id", barbershopId)
      .eq("active", true)
      .order("name"),

    dataClient
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId)
      .lt(
        "last_visit_at",
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      ),

    dataClient
      .from("appointments")
      .select("barber_id, start_time, end_time, status")
      .eq("barbershop_id", barbershopId)
      .eq("appointment_date", today),
  ]);

  const shop     = barbershopRes.data as BarbershopRow | null;
  const services = (servicesRes.data as ServiceRow[] | null) ?? [];
  const barbers  = (barbersRes.data as BarberRow[] | null) ?? [];
  const inactiveClientsCount = inactiveRes.count ?? 0;
  const bookingUrl = shop?.slug ? `${getConfiguredSiteUrl()}/r/${shop.slug}` : null;

  const availabilityItems = buildTodayBarberAvailability({
    barbers,
    appointments: (appointmentsRes.data as AppointmentRow[] | null) ?? [],
    todayIso: today,
    startHour: 9,
    endHour: 20,
    intervalMinutes: 30,
  });

  const totalFreeSlotsToday = availabilityItems.reduce(
    (sum, item) => sum + item.freeSlots.length,
    0,
  );
  const topBarber = availabilityItems.find((item) => item.freeSlots.length > 0);
  const freeSlotText = topBarber
    ? `${topBarber.freeSlots.slice(0, 3).join(", ")} con ${topBarber.barberName}`
    : null;

  return (
    <div className="space-y-5">
      <PageHeader
        section="Marketing Studio"
        title="Marketing Studio"
        description="Sabe qué publicar y qué enviar para llenar tu agenda sin perder tiempo pensando."
      />
      <MarketingStudioClient
        barbershopName={shop?.name ?? null}
        bookingUrl={bookingUrl}
        city={shop?.city ?? null}
        phone={shop?.phone ?? null}
        services={services}
        barbers={barbers}
        inactiveClientsCount={inactiveClientsCount}
        totalFreeSlotsToday={totalFreeSlotsToday}
        freeSlotText={freeSlotText}
      />
    </div>
  );
}
