import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Body inválido" }, { status: 400 });

  const { barbershopId, clientName, clientEmail, clientPhone, preferredDate, serviceId } =
    body as {
      barbershopId: string;
      clientName: string;
      clientEmail: string;
      clientPhone: string | null;
      preferredDate: string;
      serviceId: string | null;
    };

  if (!barbershopId || !clientName?.trim() || !clientEmail?.trim() || !preferredDate) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  // biome-ignore lint: waitlist_entries not yet in generated types
  const { error } = await (supabase as any)
    .from("waitlist_entries")
    .insert({
      barbershop_id:  barbershopId,
      client_name:    clientName.trim(),
      client_email:   clientEmail.trim().toLowerCase(),
      client_phone:   clientPhone ?? null,
      preferred_date: preferredDate,
      service_id:     serviceId ?? null,
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
