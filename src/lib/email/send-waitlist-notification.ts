import "server-only";
import { Resend } from "resend";

export type WaitlistNotificationData = {
  clientName: string;
  clientEmail: string;
  barbershopName: string;
  barbershopSlug: string;
  availableDate: string; // YYYY-MM-DD
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

function buildHtml(d: WaitlistNotificationData): string {
  const dateLabel = formatDateEs(d.availableDate);
  const bookingUrl = `${d.appUrl}/r/${d.barbershopSlug}`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>¡Hay un hueco disponible!</title>
</head>
<body style="margin:0;padding:0;background:#F4F1EB;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EB;padding:32px 16px;">
  <tr><td align="center">

    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;border:1px solid #E5E0D6;overflow:hidden;">

      <!-- Header -->
      <tr>
        <td style="background:#0B0F19;padding:28px 32px 24px;">
          <p style="margin:0;font-size:11px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#9CA3AF;">BarberíaOS · Lista de espera</p>
          <p style="margin:8px 0 0;font-size:22px;font-weight:900;color:#FFFFFF;line-height:1.2;">${d.barbershopName}</p>
        </td>
      </tr>

      <!-- Badge disponibilidad -->
      <tr>
        <td style="padding:24px 32px 0;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#FFFBEB;border:1px solid #D4AF37;border-radius:100px;padding:6px 14px;">
                <p style="margin:0;font-size:13px;font-weight:900;color:#92400E;">★ ¡Hay un hueco disponible!</p>
              </td>
            </tr>
          </table>
          <p style="margin:12px 0 0;font-size:14px;color:#374151;line-height:1.6;">
            Hola <strong>${d.clientName}</strong>, estás en la lista de espera de <strong>${d.barbershopName}</strong> y se ha liberado un hueco para la siguiente fecha:
          </p>
        </td>
      </tr>

      <!-- Fecha disponible -->
      <tr>
        <td style="padding:20px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFBEB;border-radius:14px;border:1px solid #FDE68A;overflow:hidden;">
            <tr>
              <td style="padding:18px 20px;">
                <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Fecha disponible</p>
                <p style="margin:6px 0 0;font-size:18px;font-weight:900;color:#1F2937;text-transform:capitalize;">${dateLabel}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Nota y CTA -->
      <tr>
        <td style="padding:0 32px 20px;">
          <p style="margin:0 0 16px;font-size:13px;color:#6B7280;line-height:1.6;border-left:3px solid #D4AF37;padding-left:12px;">
            Date prisa: los huecos suelen llenarse rápido. Reserva ahora para asegurar tu cita.
          </p>
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="background:#D4AF37;border-radius:12px;padding:14px 24px;">
                <a href="${bookingUrl}" style="color:#0B0F19;font-size:14px;font-weight:900;text-decoration:none;">
                  Reservar ahora →
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

function buildText(d: WaitlistNotificationData): string {
  const dateLabel = formatDateEs(d.availableDate);
  const bookingUrl = `${d.appUrl}/r/${d.barbershopSlug}`;

  return [
    `¡HUECO DISPONIBLE! — ${d.barbershopName}`,
    "",
    `Hola ${d.clientName}, se ha liberado un hueco para la siguiente fecha:`,
    "",
    `Fecha: ${dateLabel}`,
    "",
    "Date prisa: los huecos suelen llenarse rápido.",
    "",
    `Reserva ahora: ${bookingUrl}`,
    "",
    "— BarberíaOS · Sistema de reservas para barberías",
  ].join("\n");
}

let _resend: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  if (!_resend) _resend = new Resend(apiKey);
  return _resend;
}

export async function sendWaitlistNotification(data: WaitlistNotificationData): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;

  const from = process.env.RESEND_FROM_EMAIL?.trim() || "BarberíaOS <reservas@barberiaos.com>";

  try {
    await resend.emails.send({
      from,
      to: data.clientEmail,
      subject: `¡Hay un hueco disponible en ${data.barbershopName}! Fecha: ${formatDateEs(data.availableDate)}`,
      html: buildHtml(data),
      text: buildText(data),
    });
  } catch (err) {
    console.error("[Resend] Error al enviar email de lista de espera:", err);
  }
}
