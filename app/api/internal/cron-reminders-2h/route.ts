import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { sendReminderEmail } from "@/src/lib/email/send-reminder-email";

// Recordatorio 2 horas antes — ejecutar cada hora con Vercel Cron (requiere Pro).
// vercel.json: { "path": "/api/internal/cron-reminders-2h", "schedule": "0 * * * *" }
// Requiere: CRON_SECRET, RESEND_API_KEY, migración 044 aplicada en Supabase.

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret || req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";

  // Ventana de 2h: citas entre ahora+1.5h y ahora+2.5h
  const now = new Date();
  const windowStart = new Date(now.getTime() + 90 * 60 * 1000);   // +1h30
  const windowEnd   = new Date(now.getTime() + 150 * 60 * 1000);  // +2h30

  const todayISO  = windowStart.toISOString().slice(0, 10);
  const timeStart = windowStart.toISOString().slice(11, 16); // HH:MM
  const timeEnd   = windowEnd.toISOString().slice(11, 16);

  const { data: appointments, error } = await (supabase as any)
    .from("appointments")
    .select(`
      id,
      appointment_date,
      start_time,
      reminder_2h_sent_at,
      clients!inner(name, email),
      services!inner(name),
      barbers(name),
      barbershops!inner(name, slug, phone, address, city)
    `)
    .eq("appointment_date", todayISO)
    .gte("start_time", timeStart)
    .lte("start_time", timeEnd)
    .in("status", ["scheduled", "confirmed"])
    .is("reminder_2h_sent_at", null);

  if (error) {
    console.error("[cron-reminders-2h] Error al consultar citas:", error.message);
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
      if (!clientEmail) { results.skipped++; continue; }

      await sendReminderEmail({
        clientName:        (client     as { name?:    string | null } | null)?.name    ?? "Cliente",
        clientEmail,
        barbershopName:    (barbershop as { name?:    string | null } | null)?.name    ?? "",
        barbershopSlug:    (barbershop as { slug?:    string | null } | null)?.slug    ?? "",
        barbershopAddress: (barbershop as { address?: string | null } | null)?.address ?? null,
        barbershopCity:    (barbershop as { city?:    string | null } | null)?.city    ?? null,
        barbershopPhone:   (barbershop as { phone?:   string | null } | null)?.phone   ?? null,
        serviceName:       (service    as { name?:    string | null } | null)?.name    ?? "",
        barberName:        (barber     as { name?:    string | null } | null)?.name    ?? null,
        appointmentDate:   appt.appointment_date,
        appointmentTime:   appt.start_time,
        appUrl,
        reminderType: "2h",
      });

      await (supabase as any)
        .from("appointments")
        .update({ reminder_2h_sent_at: new Date().toISOString() })
        .eq("id", (appt as any).id);

      results.sent++;
    } catch (err) {
      console.error(`[cron-reminders-2h] Error en cita ${appt.id}:`, err);
      results.errors++;
    }
  }

  console.log(`[cron-reminders-2h] window=${timeStart}–${timeEnd} → sent=${results.sent} skipped=${results.skipped} errors=${results.errors}`);

  return NextResponse.json({ ok: true, window: `${timeStart}–${timeEnd}`, ...results });
}
