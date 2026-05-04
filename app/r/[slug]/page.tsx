import { notFound } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { BookingForm } from "./BookingForm";

type Props = { params: { slug: string } };

export default async function PublicBookingPage({ params }: Props) {
  const supabase = await createClient();

  // Buscar barbería por slug
  const { data: barbershop } = await supabase
    .from("barbershops")
    .select("id, name, city")
    .eq("slug", params.slug)
    .eq("public_booking_enabled", true)
    .single();

  if (!barbershop) notFound();

  // Cargar servicios y barberos activos en paralelo
  const [{ data: services }, { data: barbers }] = await Promise.all([
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

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <BookingForm
          barbershopName={barbershop.name}
          barbershopCity={barbershop.city ?? ""}
          services={services ?? []}
          barbers={barbers ?? []}
        />
      </div>
    </main>
  );
}
