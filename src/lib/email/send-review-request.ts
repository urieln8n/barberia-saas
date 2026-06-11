import "server-only";
import { Resend } from "resend";

export type ReviewRequestData = {
  clientName: string;
  clientEmail: string;
  barbershopName: string;
  barbershopSlug: string;
  googleBusinessUrl: string | null;
  serviceName: string;
  barberName: string | null;
  appointmentDate: string; // YYYY-MM-DD
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

function buildHtml(d: ReviewRequestData): string {
  const dateLabel = formatDateEs(d.appointmentDate);
  const bookingUrl = `${d.appUrl}/r/${d.barbershopSlug}`;
  const reviewUrl = d.googleBusinessUrl ?? bookingUrl;
  const ctaText = d.googleBusinessUrl ? "Dejar reseña en Google →" : "Volver a reservar →";

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>¿Qué te pareció tu visita?</title>
</head>
<body style="margin:0;padding:0;background:#F4F1EB;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EB;padding:32px 16px;">
  <tr><td align="center">

    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;border:1px solid #E5E0D6;overflow:hidden;">

      <!-- Header -->
      <tr>
        <td style="background:#0B0F19;padding:28px 32px 24px;">
          <p style="margin:0;font-size:11px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#9CA3AF;">BarberíaOS · Tu visita</p>
          <p style="margin:8px 0 0;font-size:22px;font-weight:900;color:#FFFFFF;line-height:1.2;">${d.barbershopName}</p>
        </td>
      </tr>

      <!-- Estrellas decorativas -->
      <tr>
        <td style="padding:28px 32px 0;text-align:center;">
          <p style="margin:0;font-size:32px;letter-spacing:4px;">⭐⭐⭐⭐⭐</p>
          <p style="margin:12px 0 0;font-size:20px;font-weight:900;color:#1F2937;">¿Qué tal fue tu visita?</p>
          <p style="margin:8px 0 0;font-size:14px;color:#6B7280;line-height:1.6;">
            Hola <strong>${d.clientName}</strong>, gracias por venir a <strong>${d.barbershopName}</strong>. Tu opinión ayuda a otros clientes a elegir una buena barbería.
          </p>
        </td>
      </tr>

      <!-- Detalles de la cita -->
      <tr>
        <td style="padding:20px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F7F3;border-radius:14px;border:1px solid #E8E3D8;overflow:hidden;">

            <tr>
              <td style="padding:14px 18px;border-bottom:1px solid #E8E3D8;">
                <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Servicio</p>
                <p style="margin:4px 0 0;font-size:15px;font-weight:900;color:#374151;">${d.serviceName}</p>
              </td>
            </tr>

            ${d.barberName ? `
            <tr>
              <td style="padding:14px 18px;border-bottom:1px solid #E8E3D8;">
                <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Barbero</p>
                <p style="margin:4px 0 0;font-size:15px;font-weight:900;color:#374151;">${d.barberName}</p>
              </td>
            </tr>` : ""}

            <tr>
              <td style="padding:14px 18px;">
                <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Fecha</p>
                <p style="margin:4px 0 0;font-size:15px;font-weight:900;color:#374151;text-transform:capitalize;">${dateLabel}</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>

      <!-- CTA principal -->
      <tr>
        <td style="padding:0 32px 24px;">
          ${d.googleBusinessUrl ? `
          <p style="margin:0 0 16px;font-size:13px;color:#6B7280;line-height:1.6;border-left:3px solid #D4AF37;padding-left:12px;">
            Solo te llevará un minuto y es de gran ayuda para la barbería. ¡Muchas gracias!
          </p>` : `
          <p style="margin:0 0 16px;font-size:13px;color:#6B7280;line-height:1.6;border-left:3px solid #D4AF37;padding-left:12px;">
            ¡Hasta la próxima! Reserva tu siguiente cita cuando quieras.
          </p>`}
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="background:#D4AF37;border-radius:12px;padding:14px 24px;">
                <a href="${reviewUrl}" style="color:#0B0F19;font-size:14px;font-weight:900;text-decoration:none;">
                  ${ctaText}
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

function buildText(d: ReviewRequestData): string {
  const dateLabel = formatDateEs(d.appointmentDate);
  const bookingUrl = `${d.appUrl}/r/${d.barbershopSlug}`;
  const reviewUrl = d.googleBusinessUrl ?? bookingUrl;

  return [
    `¿QUÉ TAL FUE TU VISITA? — ${d.barbershopName}`,
    "",
    `Hola ${d.clientName}, gracias por venir a ${d.barbershopName}.`,
    "",
    `Servicio: ${d.serviceName}`,
    d.barberName ? `Barbero: ${d.barberName}` : null,
    `Fecha: ${dateLabel}`,
    "",
    d.googleBusinessUrl
      ? `Tu opinión ayuda a otros clientes. Deja tu reseña en Google: ${reviewUrl}`
      : `¡Hasta la próxima! Reserva tu siguiente cita: ${bookingUrl}`,
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

export async function sendReviewRequest(data: ReviewRequestData): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;

  const from = process.env.RESEND_FROM_EMAIL?.trim() || "BarberíaOS <reservas@barberiaos.com>";

  try {
    await resend.emails.send({
      from,
      to: data.clientEmail,
      subject: `¿Qué te pareció tu visita en ${data.barbershopName}? ⭐`,
      html: buildHtml(data),
      text: buildText(data),
    });
  } catch (err) {
    console.error("[Resend] Error al enviar solicitud de reseña:", err);
  }
}
