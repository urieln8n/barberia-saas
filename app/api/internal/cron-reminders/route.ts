import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { sendReminderEmail } from "@/src/lib/email/send-reminder-email";

// Protegida con CRON_SECRET — llamar desde Vercel Cron o cron externo.
// Configurar en vercel.json:
//   { "crons": [{ "path": "/api/internal/cron-reminders", "schedule": "0 9 * * *" }] }
// La ejecución diaria a las 09:00 UTC enviará recordatorios para citas del día siguiente.

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Vercel Hobby: max 60s

export async function GET(req: NextRequest) {
  // Verificación de seguridad
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (cronSecret) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = createServiceRoleClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";

  // Calcular ventana: mañana de 00:00 a 23:59
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = tomorrow.toISOString().slice(0, 10);

  // Buscar citas activas de mañana con email de cliente y sin recordatorio enviado.
  // Se usa `as any` porque reminder_24h_sent_at requiere ejecutar la migración 036
  // antes de que Supabase regenere los tipos TypeScript.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: appointments, error } = await (supabase as any)
    .from("appointments")
    .select(`
      id,
      appointment_date,
      start_time,
      reminder_24h_sent_at,
      clients!inner(name, email),
      services!inner(name),
      barbers(name),
      barbershops!inner(name, slug, phone, address, city)
    `)
    .eq("appointment_date", tomorrowISO)
    .in("status", ["scheduled", "confirmed"])
    .is("reminder_24h_sent_at", null);

  if (error) {
    console.error("[cron-reminders] Error al consultar citas:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = { sent: 0, skipped: 0, errors: 0 };

  for (const appt of appointments ?? []) {
    try {
      const client     = Array.isArray(appt.clients)     ? appt.clients[0]     : appt.clients;
      const service    = Array.isArray(appt.services)    ? appt.services[0]    : appt.services;
      const barber     = Array.isArray(appt.barbers)     ? appt.barbers[0]     : appt.barbers;
      const barbershop = Array.isArray(appt.barbershops) ? appt.barbershops[0] : appt.barbershops;

      const clientEmail = (client as { email?: string | null } | null)?.email?.trim();

      if (!clientEmail) {
        results.skipped++;
        continue;
      }

      await sendReminderEmail({
        clientName:       (client as { name?: string | null } | null)?.name ?? "Cliente",
        clientEmail,
        barbershopName:   (barbershop as { name?: string | null } | null)?.name ?? "",
        barbershopSlug:   (barbershop as { slug?: string | null } | null)?.slug ?? "",
        barbershopAddress:(barbershop as { address?: string | null } | null)?.address ?? null,
        barbershopCity:   (barbershop as { city?: string | null } | null)?.city ?? null,
        barbershopPhone:  (barbershop as { phone?: string | null } | null)?.phone ?? null,
        serviceName:      (service as { name?: string | null } | null)?.name ?? "",
        barberName:       (barber as { name?: string | null } | null)?.name ?? null,
        appointmentDate:  appt.appointment_date,
        appointmentTime:  appt.start_time,
        appUrl,
      });

      // Marcar como enviado para evitar duplicados
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from("appointments")
        .update({ reminder_24h_sent_at: new Date().toISOString() })
        .eq("id", (appt as any).id);

      results.sent++;
    } catch (err) {
      console.error(`[cron-reminders] Error en cita ${appt.id}:`, err);
      results.errors++;
    }
  }

  console.log(`[cron-reminders] ${tomorrowISO} → sent=${results.sent} skipped=${results.skipped} errors=${results.errors}`);

  return NextResponse.json({
    ok: true,
    date: tomorrowISO,
    ...results,
  });
}
