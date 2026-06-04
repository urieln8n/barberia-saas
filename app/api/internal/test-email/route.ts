import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { sendBookingConfirmation } from "@/src/lib/email/send-booking-confirmation";
import { sendCancellationEmail } from "@/src/lib/email/send-cancellation-email";
import { sendOwnerBookingNotification } from "@/src/lib/email/send-owner-booking-notification";
import { sendReminderEmail } from "@/src/lib/email/send-reminder-email";

// API interna de prueba de emails — solo accesible para dueños autenticados.
// POST /api/internal/test-email
// body: { type: "confirmation"|"cancellation"|"owner"|"reminder", to: string }

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { type, to } = await req.json() as { type: string; to: string };

  if (!to || !/^[^@]+@[^@]+\.[^@]+$/.test(to)) {
    return NextResponse.json({ error: "Email de destino inválido" }, { status: 400 });
  }

  const demo = {
    clientName:      "Cliente Demo",
    clientEmail:     to,
    barbershopName:  "FadeLab Barbers (Demo)",
    barbershopSlug:  "demo-barber",
    barbershopPhone: "+34 600 123 456",
    barbershopAddress:"Calle Fuencarral, 42",
    barbershopCity:  "Madrid",
    serviceName:     "Corte + Barba",
    servicePrice:    25,
    barberName:      "Carlos",
    appointmentDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10), // mañana
    appointmentTime: "11:00",
    appUrl:          process.env.NEXT_PUBLIC_APP_URL ?? "https://barberiaos.com",
  };

  try {
    switch (type) {
      case "confirmation":
        await sendBookingConfirmation(demo);
        break;
      case "cancellation":
        await sendCancellationEmail({ ...demo, barbershopSlug: demo.barbershopSlug });
        break;
      case "owner":
        await sendOwnerBookingNotification({
          ...demo,
          clientPhone: "+34 611 000 000",
          ownerEmail: to,
          dashboardUrl: `${demo.appUrl}/dashboard/agenda`,
        });
        break;
      case "reminder":
        await sendReminderEmail(demo);
        break;
      default:
        return NextResponse.json({ error: "Tipo de email no válido" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, type, to });
  } catch (err) {
    console.error("[test-email]", err);
    return NextResponse.json({ error: "Error al enviar" }, { status: 500 });
  }
}
