import "server-only";
import { Resend } from "resend";

export type ReminderEmailData = {
  clientName: string;
  clientEmail: string;
  barbershopName: string;
  barbershopSlug: string;
  barbershopAddress: string | null;
  barbershopCity: string | null;
  barbershopPhone: string | null;
  serviceName: string;
  barberName: string | null;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:MM
  appUrl: string;
  reminderType?: "24h" | "2h"; // defaults to "24h"
};

function formatDateEs(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(hhmm: string): string {
  return hhmm.slice(0, 5);
}

function buildHtml(d: ReminderEmailData): string {
  const dateLabel = formatDateEs(d.appointmentDate);
  const timeLabel = formatTime(d.appointmentTime);
  const location = [d.barbershopAddress, d.barbershopCity].filter(Boolean).join(", ");
  const bookingUrl = `${d.appUrl}/r/${d.barbershopSlug}`;
  const mapsUrl = location ? `https://maps.google.com/?q=${encodeURIComponent(location)}` : null;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Recordatorio de tu cita mañana</title>
</head>
<body style="margin:0;padding:0;background:#F4F1EB;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EB;padding:32px 16px;">
  <tr><td align="center">

    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;border:1px solid #E5E0D6;overflow:hidden;">

      <!-- Header -->
      <tr>
        <td style="background:#0B0F19;padding:28px 32px 24px;">
          <p style="margin:0;font-size:11px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#D4AF37;">Recordatorio · BarberíaOS</p>
          <p style="margin:8px 0 0;font-size:22px;font-weight:900;color:#FFFFFF;line-height:1.2;">${d.barbershopName}</p>
        </td>
      </tr>

      <!-- Badge recordatorio -->
      <tr>
        <td style="padding:24px 32px 0;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#FEF9EE;border:1px solid #D4AF37;border-radius:100px;padding:6px 14px;">
                <p style="margin:0;font-size:13px;font-weight:900;color:#92650A;">${d.reminderType === "2h" ? "⏰ Tu cita es en 2 horas" : "🕐 Tu cita es mañana"}</p>
              </td>
            </tr>
          </table>
          <p style="margin:12px 0 0;font-size:14px;color:#374151;line-height:1.6;">
            Hola <strong>${d.clientName}</strong>, te recordamos que tienes una cita ${d.reminderType === "2h" ? "en 2 horas" : "mañana"} en <strong>${d.barbershopName}</strong>:
          </p>
        </td>
      </tr>

      <!-- Detalles -->
      <tr>
        <td style="padding:20px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F7F3;border-radius:14px;border:1px solid #E8E3D8;overflow:hidden;">

            <tr>
              <td style="padding:14px 18px;border-bottom:1px solid #E8E3D8;">
                <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Servicio</p>
                <p style="margin:4px 0 0;font-size:15px;font-weight:900;color:#111827;">${d.serviceName}</p>
              </td>
            </tr>

            ${d.barberName ? `
            <tr>
              <td style="padding:14px 18px;border-bottom:1px solid #E8E3D8;">
                <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Barbero</p>
                <p style="margin:4px 0 0;font-size:15px;font-weight:900;color:#111827;">${d.barberName}</p>
              </td>
            </tr>` : ""}

            <tr>
              <td style="padding:14px 18px;border-bottom:1px solid #E8E3D8;">
                <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Fecha</p>
                <p style="margin:4px 0 0;font-size:15px;font-weight:900;color:#111827;text-transform:capitalize;">${dateLabel}</p>
              </td>
            </tr>

            <tr>
              <td style="padding:14px 18px;${location ? "border-bottom:1px solid #E8E3D8;" : ""}">
                <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Hora</p>
                <p style="margin:4px 0 0;font-size:28px;font-weight:900;color:#D4AF37;letter-spacing:-0.02em;">${timeLabel}</p>
              </td>
            </tr>

            ${location ? `
            <tr>
              <td style="padding:14px 18px;">
                <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Dirección</p>
                <p style="margin:4px 0 0;font-size:14px;font-weight:700;color:#111827;">${location}</p>
                ${d.barbershopPhone ? `<p style="margin:4px 0 0;font-size:13px;color:#6B7280;">${d.barbershopPhone}</p>` : ""}
              </td>
            </tr>` : ""}

          </table>
        </td>
      </tr>

      <!-- CTAs -->
      <tr>
        <td style="padding:0 32px 24px;">
          <table cellpadding="0" cellspacing="6" width="100%">
            ${d.barbershopPhone ? `
            <tr>
              <td style="background:#F9F7F3;border:1px solid #E8E3D8;border-radius:10px;padding:12px 16px;">
                <a href="tel:${d.barbershopPhone}" style="color:#111827;font-size:13px;font-weight:900;text-decoration:none;">📞 Llamar a ${d.barbershopName}</a>
              </td>
            </tr>` : ""}
            ${mapsUrl ? `
            <tr>
              <td style="background:#F9F7F3;border:1px solid #E8E3D8;border-radius:10px;padding:12px 16px;margin-top:6px;">
                <a href="${mapsUrl}" style="color:#111827;font-size:13px;font-weight:900;text-decoration:none;">📍 Cómo llegar</a>
              </td>
            </tr>` : ""}
            <tr>
              <td style="background:#0B0F19;border-radius:10px;padding:12px 16px;text-align:center;margin-top:6px;">
                <a href="${bookingUrl}" style="color:#D4AF37;font-size:13px;font-weight:900;text-decoration:none;">Cambiar o cancelar cita →</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#F9F7F3;border-top:1px solid #E8E3D8;padding:16px 32px;">
          <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;">
            Recordatorio automático de <strong style="color:#6B7280;">BarberíaOS</strong> · Sistema de reservas para barberías
          </p>
        </td>
      </tr>

    </table>

  </td></tr>
</table>

</body>
</html>`;
}

function buildText(d: ReminderEmailData): string {
  const dateLabel = formatDateEs(d.appointmentDate);
  const timeLabel = formatTime(d.appointmentTime);
  const location = [d.barbershopAddress, d.barbershopCity].filter(Boolean).join(", ");

  return [
    `RECORDATORIO — Cita mañana en ${d.barbershopName}`,
    "",
    `Hola ${d.clientName}, te recordamos tu cita de mañana:`,
    "",
    `Servicio: ${d.serviceName}`,
    d.barberName ? `Barbero: ${d.barberName}` : null,
    `Fecha: ${dateLabel}`,
    `Hora: ${timeLabel}`,
    location ? `Dirección: ${location}` : null,
    d.barbershopPhone ? `Teléfono: ${d.barbershopPhone}` : null,
    "",
    "— BarberíaOS · Sistema de reservas para barberías",
  ]
    .filter((l) => l !== null)
    .join("\n");
}

let _resend: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  if (!_resend) _resend = new Resend(apiKey);
  return _resend;
}

export async function sendReminderEmail(data: ReminderEmailData): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;

  const from = process.env.RESEND_FROM_EMAIL?.trim() || "BarberíaOS <reservas@barberiaos.com>";
  const timeLabel = formatTime(data.appointmentTime);

  const is2h = data.reminderType === "2h";
  const subject = is2h
    ? `⏰ Tu cita empieza en 2 horas — ${data.barbershopName} a las ${timeLabel}`
    : `Recordatorio: tu cita mañana a las ${timeLabel} en ${data.barbershopName}`;

  try {
    await resend.emails.send({
      from,
      to: data.clientEmail,
      subject,
      html: buildHtml(data),
      text: buildText(data),
    });
  } catch (err) {
    console.error(`[Resend] Error al enviar recordatorio ${data.reminderType ?? "24h"}:`, err);
  }
}
