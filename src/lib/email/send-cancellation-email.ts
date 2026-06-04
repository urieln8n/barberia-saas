import "server-only";
import { Resend } from "resend";

export type CancellationEmailData = {
  clientName: string;
  clientEmail: string;
  barbershopName: string;
  barbershopSlug: string;
  barbershopPhone: string | null;
  serviceName: string;
  barberName: string | null;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:MM
  appUrl: string;
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

function buildHtml(d: CancellationEmailData): string {
  const dateLabel = formatDateEs(d.appointmentDate);
  const timeLabel = formatTime(d.appointmentTime);
  const bookingUrl = `${d.appUrl}/r/${d.barbershopSlug}`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Tu reserva ha sido cancelada</title>
</head>
<body style="margin:0;padding:0;background:#F4F1EB;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EB;padding:32px 16px;">
  <tr><td align="center">

    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;border:1px solid #E5E0D6;overflow:hidden;">

      <!-- Header -->
      <tr>
        <td style="background:#0B0F19;padding:28px 32px 24px;">
          <p style="margin:0;font-size:11px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#9CA3AF;">BarberíaOS · Reserva cancelada</p>
          <p style="margin:8px 0 0;font-size:22px;font-weight:900;color:#FFFFFF;line-height:1.2;">${d.barbershopName}</p>
        </td>
      </tr>

      <!-- Badge cancelación -->
      <tr>
        <td style="padding:24px 32px 0;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:100px;padding:6px 14px;">
                <p style="margin:0;font-size:13px;font-weight:900;color:#B91C1C;">✕ Tu reserva ha sido cancelada</p>
              </td>
            </tr>
          </table>
          <p style="margin:12px 0 0;font-size:14px;color:#374151;line-height:1.6;">
            Hola <strong>${d.clientName}</strong>, te informamos que tu cita en <strong>${d.barbershopName}</strong> ha sido cancelada. Aquí tienes los detalles:
          </p>
        </td>
      </tr>

      <!-- Detalles de la reserva cancelada -->
      <tr>
        <td style="padding:20px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FEF2F2;border-radius:14px;border:1px solid #FECACA;overflow:hidden;">

            <tr>
              <td style="padding:14px 18px;border-bottom:1px solid #FECACA;">
                <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Servicio</p>
                <p style="margin:4px 0 0;font-size:15px;font-weight:900;color:#374151;text-decoration:line-through;">${d.serviceName}</p>
              </td>
            </tr>

            ${d.barberName ? `
            <tr>
              <td style="padding:14px 18px;border-bottom:1px solid #FECACA;">
                <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Barbero</p>
                <p style="margin:4px 0 0;font-size:15px;font-weight:900;color:#374151;text-decoration:line-through;">${d.barberName}</p>
              </td>
            </tr>` : ""}

            <tr>
              <td style="padding:14px 18px;border-bottom:1px solid #FECACA;">
                <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Fecha</p>
                <p style="margin:4px 0 0;font-size:15px;font-weight:900;color:#374151;text-decoration:line-through;text-transform:capitalize;">${dateLabel}</p>
              </td>
            </tr>

            <tr>
              <td style="padding:14px 18px;">
                <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Hora</p>
                <p style="margin:4px 0 0;font-size:22px;font-weight:900;color:#9CA3AF;text-decoration:line-through;">${timeLabel}</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>

      <!-- Nota y CTA -->
      <tr>
        <td style="padding:0 32px 20px;">
          <p style="margin:0 0 16px;font-size:13px;color:#6B7280;line-height:1.6;border-left:3px solid #9CA3AF;padding-left:12px;">
            Si crees que esta cancelación fue un error, contacta directamente con la barbería${d.barbershopPhone ? ` al <strong>${d.barbershopPhone}</strong>` : ""}.
          </p>
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="background:#D4AF37;border-radius:12px;padding:14px 24px;">
                <a href="${bookingUrl}" style="color:#0B0F19;font-size:14px;font-weight:900;text-decoration:none;">
                  Reservar nueva cita →
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#F9F7F3;border-top:1px solid #E8E3D8;padding:16px 32px;">
          <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;">
            Notificación automática de <strong style="color:#6B7280;">BarberíaOS</strong> · Sistema de reservas para barberías
          </p>
        </td>
      </tr>

    </table>

  </td></tr>
</table>

</body>
</html>`;
}

function buildText(d: CancellationEmailData): string {
  const dateLabel = formatDateEs(d.appointmentDate);
  const timeLabel = formatTime(d.appointmentTime);
  const bookingUrl = `${d.appUrl}/r/${d.barbershopSlug}`;

  return [
    `RESERVA CANCELADA — ${d.barbershopName}`,
    "",
    `Hola ${d.clientName}, tu reserva ha sido cancelada.`,
    "",
    `Servicio: ${d.serviceName}`,
    d.barberName ? `Barbero: ${d.barberName}` : null,
    `Fecha: ${dateLabel}`,
    `Hora: ${timeLabel}`,
    "",
    d.barbershopPhone ? `Para dudas, contacta con la barbería al ${d.barbershopPhone}.` : null,
    "",
    `¿Quieres reservar otra cita? ${bookingUrl}`,
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

export async function sendCancellationEmail(data: CancellationEmailData): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;

  const from = process.env.RESEND_FROM_EMAIL?.trim() || "BarberíaOS <reservas@barberiaos.com>";

  try {
    await resend.emails.send({
      from,
      to: data.clientEmail,
      subject: `Tu reserva en ${data.barbershopName} ha sido cancelada`,
      html: buildHtml(data),
      text: buildText(data),
    });
  } catch (err) {
    console.error("[Resend] Error al enviar email de cancelación:", err);
  }
}
