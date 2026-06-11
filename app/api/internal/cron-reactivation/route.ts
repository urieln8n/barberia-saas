import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { sendReactivationEmail } from "@/src/lib/email/send-reactivation-email";

// Reactivación automática — ejecutar diariamente a las 10:00 UTC.
// vercel.json: { "path": "/api/internal/cron-reactivation", "schedule": "0 10 * * *" }
// Requiere: CRON_SECRET, RESEND_API_KEY, migración 045 aplicada en Supabase.
// Lógica: clientes cuya última cita completada fue hace 46-120 días
// y que no hayan recibido este email en los últimos 30 días.

export const dynamic    = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret || req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const appUrl   = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "";

  const today     = new Date();
  const day46ago  = new Date(today.getTime() - 46  * 86_400_000).toISOString().slice(0, 10);
  const day120ago = new Date(today.getTime() - 120 * 86_400_000).toISOString().slice(0, 10);
  const day30ago  = new Date(today.getTime() - 30  * 86_400_000).toISOString();

  const { data: barbershops, error: shopErr } = await supabase
    .from("barbershops")
    .select("id, name, slug");

  if (shopErr) {
    console.error("[cron-reactivation] Error al obtener barberías:", shopErr.message);
    return NextResponse.json({ error: shopErr.message }, { status: 500 });
  }

  const totals = { sent: 0, skipped: 0, errors: 0 };

  for (const shop of barbershops ?? []) {
    // Paso 1: última cita completada por cliente en los últimos 120 días
    const { data: appts } = await supabase
      .from("appointments")
      .select("client_id, appointment_date")
      .eq("barbershop_id", shop.id)
      .eq("status", "completed")
      .gte("appointment_date", day120ago)
      .order("appointment_date", { ascending: false });

    // clientId → fecha de última cita (en ventana 120 días)
    const lastApptMap = new Map<string, string>();
    for (const appt of appts ?? []) {
      const cid  = (appt as any).client_id  as string;
      const date = (appt as any).appointment_date as string;
      if (!lastApptMap.has(cid)) lastApptMap.set(cid, date);
    }

    // Solo los que su última visita fue hace más de 46 días (zona riesgo/perdido)
    const targetIds = [...lastApptMap.entries()]
      .filter(([, date]) => date <= day46ago)
      .map(([id, date]) => ({ id, lastDate: date }));

    if (targetIds.length === 0) continue;

    // Paso 2: datos de esos clientes + filtro anti-spam (30 días)
    const { data: clients } = await (supabase as any)
      .from("clients")
      .select("id, name, email, reactivation_sent_at")
      .eq("barbershop_id", shop.id)
      .in("id", targetIds.map((t) => t.id))
      .not("email", "is", null)
      .or(`reactivation_sent_at.is.null,reactivation_sent_at.lt.${day30ago}`);

    const clientMap = new Map(
      (clients ?? []).map((c: any) => [c.id as string, c])
    );

    for (const { id, lastDate } of targetIds) {
      const client = clientMap.get(id);
      if (!client) { totals.skipped++; continue; }

      const daysSince = Math.floor(
        (today.getTime() - new Date(lastDate).getTime()) / 86_400_000
      );

      try {
        await sendReactivationEmail({
          clientName:     (client as any).name  ?? "Cliente",
          clientEmail:    (client as any).email as string,
          barbershopName: shop.name,
          barbershopSlug: shop.slug,
          daysSince,
          appUrl,
        });

        await (supabase as any)
          .from("clients")
          .update({ reactivation_sent_at: today.toISOString() })
          .eq("id", id);

        totals.sent++;
      } catch (err) {
        console.error(`[cron-reactivation] Error cliente ${id}:`, err);
        totals.errors++;
      }
    }
  }

  console.log(
    `[cron-reactivation] window=${day46ago}..${day120ago} → sent=${totals.sent} skipped=${totals.skipped} errors=${totals.errors}`
  );

  return NextResponse.json({ ok: true, window: `${day46ago}..${day120ago}`, ...totals });
}
