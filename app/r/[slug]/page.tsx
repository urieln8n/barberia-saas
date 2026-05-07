import { notFound } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { BookingForm } from "./BookingForm";

export const dynamic = "force-dynamic";

type Props = {
  params: {
    slug: string;
  };
};

type Barbershop = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  public_booking_enabled: boolean | null;
};

type Service = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
};

type Barber = {
  id: string;
  name: string;
};

export default async function PublicBookingPage({ params }: Props) {
  const supabase = await createClient();

  const slug = params.slug?.trim();

  if (!slug) {
    notFound();
  }

  const { data: barbershop, error: barbershopError } = await supabase
    .from("barbershops")
    .select("id, name, slug, city, public_booking_enabled")
    .eq("slug", slug)
    .eq("public_booking_enabled", true)
    .maybeSingle();

  if (barbershopError || !barbershop) {
    notFound();
  }

  const [{ data: services, error: servicesError }, { data: barbers, error: barbersError }] =
    await Promise.all([
      supabase
        .from("services")
        .select("id, name, price, duration_minutes")
        .eq("barbershop_id", barbershop.id)
        .eq("active", true)
        .order("created_at", { ascending: true }),

      supabase
        .from("barbers")
        .select("id, name")
        .eq("barbershop_id", barbershop.id)
        .eq("active", true)
        .order("created_at", { ascending: true }),
    ]);

  if (servicesError || barbersError) {
    console.error("Error loading public booking data:", {
      servicesError,
      barbersError,
    });
  }

  return (
    <main className="premium-grid-bg min-h-screen px-4 py-6 text-slate-950 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl">
        <BookingForm
          barbershopId={barbershop.id}
          barbershopName={barbershop.name}
          barbershopCity={barbershop.city ?? ""}
          services={(services ?? []) as Service[]}
          barbers={(barbers ?? []) as Barber[]}
        />
      </div>
    </main>
  );
}
