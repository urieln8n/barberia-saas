import "server-only";
import { Resend } from "resend";

export type OwnerBookingNotificationData = {
  // Cliente
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  // Reserva
  barbershopName: string;
  serviceName: string;
  servicePrice: number | null;
  barberName: string | null;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:MM
  // Barbería
  barbershopAddress: string | null;
  barbershopCity: string | null;
  // Destino
  ownerEmail: string;
  dashboardUrl: string;
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

function formatPrice(price: number | null): string | null {
  if (!price || price <= 0) return null;
  return `${price.toFixed(0)} €`;
}

function buildOwnerEmailHtml(d: OwnerBookingNotificationData): string {
  const dateLabel = formatDateEs(d.appointmentDate);
  const timeLabel = formatTime(d.appointmentTime);
  const priceLabel = formatPrice(d.servicePrice);
  const location = [d.barbershopAddress, d.barbershopCity].filter(Boolean).join(", ");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Nueva reserva · ${d.barbershopName}</title>
</head>
<body style="margin:0;padding:0;background:#F4F1EB;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EB;padding:32px 16px;">
  <tr>
    <td align="center">

      <!-- Card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;border:1px solid #E5E0D6;overflow:hidden;">

        <!-- Header oscuro — perspectiva del dueño -->
        <tr>
          <td style="background:#0B0F19;padding:28px 32px 24px;">
            <p style="margin:0;font-size:11px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#D4AF37;">BarberíaOS · Nueva reserva</p>
            <p style="margin:8px 0 0;font-size:22px;font-weight:900;color:#FFFFFF;line-height:1.2;">${d.barbershopName}</p>
          </td>
        </tr>

        <!-- Alert badge -->
        <tr>
          <td style="padding:24px 32px 0;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#FEF9EE;border:1px solid #D4AF37;border-radius:100px;padding:6px 14px;">
                  <p style="margin:0;font-size:13px;font-weight:900;color:#92650A;">📅 Nueva cita confirmada — ${timeLabel}</p>
                </td>
              </tr>
            </table>
            <p style="margin:12px 0 0;font-size:14px;color:#374151;line-height:1.6;">
              Has recibido una nueva reserva desde BarberíaOS. Aquí tienes todos los datos:
            </p>
          </td>
        </tr>

        <!-- Cliente -->
        <tr>
          <td style="padding:20px 32px 0;">
            <p style="margin:0 0 8px;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Cliente</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F7F3;border-radius:14px;border:1px solid #E8E3D8;overflow:hidden;">
              <tr>
                <td style="padding:14px 18px;border-bottom:1px solid #E8E3D8;">
                  <p style="margin:0;font-size:16px;font-weight:900;color:#111827;">${d.clientName}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 18px;${d.clientEmail ? "border-bottom:1px solid #E8E3D8;" : ""}">
                  <p style="margin:0;font-size:13px;color:#374151;">📞 <strong>${d.clientPhone}</strong></p>
                </td>
              </tr>
              ${d.clientEmail ? `
              <tr>
                <td style="padding:12px 18px;">
                  <p style="margin:0;font-size:13px;color:#374151;">✉️ ${d.clientEmail}</p>
                </td>
              </tr>` : ""}
            </table>
          </td>
        </tr>

        <!-- Reserva -->
        <tr>
          <td style="padding:16px 32px 0;">
            <p style="margin:0 0 8px;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Detalle de la reserva</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F7F3;border-radius:14px;border:1px solid #E8E3D8;overflow:hidden;">

              <tr>
                <td style="padding:12px 18px;border-bottom:1px solid #E8E3D8;">
                  <p style="margin:0;font-size:10px;font-weight:700;color:#9CA3AF;">SERVICIO</p>
                  <p style="margin:3px 0 0;font-size:14px;font-weight:900;color:#111827;">
                    ${d.serviceName}
                    ${priceLabel ? `<span style="color:#D4AF37;margin-left:8px;">${priceLabel}</span>` : ""}
                  </p>
                </td>
              </tr>

              ${d.barberName ? `
              <tr>
                <td style="padding:12px 18px;border-bottom:1px solid #E8E3D8;">
                  <p style="margin:0;font-size:10px;font-weight:700;color:#9CA3AF;">BARBERO</p>
                  <p style="margin:3px 0 0;font-size:14px;font-weight:900;color:#111827;">${d.barberName}</p>
                </td>
              </tr>` : ""}

              <tr>
                <td style="padding:12px 18px;border-bottom:1px solid #E8E3D8;">
                  <p style="margin:0;font-size:10px;font-weight:700;color:#9CA3AF;">FECHA</p>
                  <p style="margin:3px 0 0;font-size:14px;font-weight:900;color:#111827;text-transform:capitalize;">${dateLabel}</p>
                </td>
              </tr>

              <tr>
                <td style="padding:12px 18px;">
                  <p style="margin:0;font-size:10px;font-weight:700;color:#9CA3AF;">HORA</p>
                  <p style="margin:3px 0 0;font-size:28px;font-weight:900;color:#D4AF37;letter-spacing:-0.02em;">${timeLabel}</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- CTA agenda -->
        <tr>
          <td style="padding:20px 32px;">
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="background:#0B0F19;border-radius:12px;padding:14px 24px;">
                  <a href="${d.dashboardUrl}" style="color:#D4AF37;font-size:14px;font-weight:900;text-decoration:none;">
                    Ver agenda en BarberíaOS →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Barbería info (pie) -->
        ${location ? `
        <tr>
          <td style="padding:0 32px 8px;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;">${d.barbershopName} · ${location}</p>
          </td>
        </tr>` : ""}

        <!-- Footer -->
        <tr>
          <td style="background:#F9F7F3;border-top:1px solid #E8E3D8;padding:16px 32px;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;">
              Notificación automática de <strong style="color:#6B7280;">BarberíaOS</strong> · Sistema de reservas para barberías
            </p>
          </td>
        </tr>

      </table>
      <!-- /Card -->

    </td>
  </tr>
</table>

</body>
</html>`;
}

function buildOwnerEmailText(d: OwnerBookingNotificationData): string {
  const dateLabel = formatDateEs(d.appointmentDate);
  const timeLabel = formatTime(d.appointmentTime);
  const priceLabel = formatPrice(d.servicePrice);

  return [
    `NUEVA RESERVA — ${d.barbershopName}`,
    "",
    "CLIENTE",
    `Nombre: ${d.clientName}`,
    `Teléfono: ${d.clientPhone}`,
    d.clientEmail ? `Email: ${d.clientEmail}` : null,
    "",
    "RESERVA",
    `Servicio: ${d.serviceName}${priceLabel ? ` (${priceLabel})` : ""}`,
    d.barberName ? `Barbero: ${d.barberName}` : null,
    `Fecha: ${dateLabel}`,
    `Hora: ${timeLabel}`,
    "",
    `Ver agenda: ${d.dashboardUrl}`,
    "",
    "— BarberíaOS · Notificación automática de reservas",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

let _resend: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  if (!_resend) _resend = new Resend(apiKey);
  return _resend;
}

export async function sendOwnerBookingNotification(
  data: OwnerBookingNotificationData
): Promise<void> {
  const resend = getResendClient();
  if (!resend) return; // Sin API key = sin email, sin error

  const fromEmail =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "BarberíaOS <reservas@barberiaos.com>";

  const timeLabel = formatTime(data.appointmentTime);

  try {
    await resend.emails.send({
      from: fromEmail,
      to: data.ownerEmail,
      subject: `Nueva reserva en BarberíaOS — ${data.serviceName} a las ${timeLabel}`,
      html: buildOwnerEmailHtml(data),
      text: buildOwnerEmailText(data),
    });
  } catch (err) {
    // Falla en silencio — la reserva ya fue creada y no debe revertirse
    console.error("[Resend] Error al notificar al dueño de nueva reserva:", err);
  }
}
