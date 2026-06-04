import "server-only";
import { Resend } from "resend";

export type BookingConfirmationData = {
  clientName: string;
  clientEmail: string;
  barbershopName: string;
  barbershopAddress: string | null;
  barbershopCity: string | null;
  barbershopPhone: string | null;
  serviceName: string;
  barberName: string | null;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:MM
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

function buildEmailHtml(d: BookingConfirmationData): string {
  const dateLabel = formatDateEs(d.appointmentDate);
  const timeLabel = formatTime(d.appointmentTime);
  const location = [d.barbershopAddress, d.barbershopCity].filter(Boolean).join(", ");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Reserva confirmada · ${d.barbershopName}</title>
</head>
<body style="margin:0;padding:0;background:#F4F1EB;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EB;padding:32px 16px;">
  <tr>
    <td align="center">

      <!-- Card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;border:1px solid #E5E0D6;overflow:hidden;">

        <!-- Header gold -->
        <tr>
          <td style="background:#0B0F19;padding:28px 32px 24px;">
            <p style="margin:0;font-size:11px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#D4AF37;">Reserva confirmada</p>
            <p style="margin:8px 0 0;font-size:22px;font-weight:900;color:#FFFFFF;line-height:1.2;">${d.barbershopName}</p>
          </td>
        </tr>

        <!-- Check badge -->
        <tr>
          <td style="padding:28px 32px 0;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#ECFDF5;border:1px solid #BBF7D0;border-radius:100px;padding:6px 14px;">
                  <p style="margin:0;font-size:13px;font-weight:900;color:#15803D;">✓ Tu cita está reservada</p>
                </td>
              </tr>
            </table>
            <p style="margin:12px 0 0;font-size:15px;color:#374151;line-height:1.6;">
              Hola <strong>${d.clientName}</strong>, tu reserva ha quedado confirmada. Aquí tienes todos los detalles:
            </p>
          </td>
        </tr>

        <!-- Details -->
        <tr>
          <td style="padding:20px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F7F3;border-radius:14px;border:1px solid #E8E3D8;overflow:hidden;">

              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #E8E3D8;">
                  <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Servicio</p>
                  <p style="margin:4px 0 0;font-size:15px;font-weight:900;color:#111827;">${d.serviceName}</p>
                </td>
              </tr>

              ${d.barberName ? `
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #E8E3D8;">
                  <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Barbero</p>
                  <p style="margin:4px 0 0;font-size:15px;font-weight:900;color:#111827;">${d.barberName}</p>
                </td>
              </tr>` : ""}

              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #E8E3D8;">
                  <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Fecha</p>
                  <p style="margin:4px 0 0;font-size:15px;font-weight:900;color:#111827;text-transform:capitalize;">${dateLabel}</p>
                </td>
              </tr>

              <tr>
                <td style="padding:16px 20px;${location ? "border-bottom:1px solid #E8E3D8;" : ""}">
                  <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Hora</p>
                  <p style="margin:4px 0 0;font-size:24px;font-weight:900;color:#D4AF37;letter-spacing:-0.02em;">${timeLabel}</p>
                </td>
              </tr>

              ${location ? `
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Dirección</p>
                  <p style="margin:4px 0 0;font-size:14px;font-weight:700;color:#111827;">${location}</p>
                  ${d.barbershopPhone ? `<p style="margin:4px 0 0;font-size:13px;color:#6B7280;">${d.barbershopPhone}</p>` : ""}
                </td>
              </tr>` : ""}

            </table>
          </td>
        </tr>

        <!-- Note -->
        <tr>
          <td style="padding:0 32px 28px;">
            <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;border-left:3px solid #D4AF37;padding-left:12px;">
              Si necesitas cambiar o cancelar tu cita, contacta directamente con la barbería${d.barbershopPhone ? ` al <strong>${d.barbershopPhone}</strong>` : ""}.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F9F7F3;border-top:1px solid #E8E3D8;padding:20px 32px;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;">
              Reserva gestionada con <strong style="color:#6B7280;">BarberíaOS</strong> · Sistema de reservas para barberías
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

function buildEmailText(d: BookingConfirmationData): string {
  const dateLabel = formatDateEs(d.appointmentDate);
  const timeLabel = formatTime(d.appointmentTime);
  const location = [d.barbershopAddress, d.barbershopCity].filter(Boolean).join(", ");

  return [
    `RESERVA CONFIRMADA — ${d.barbershopName}`,
    "",
    `Hola ${d.clientName}, tu reserva ha quedado confirmada.`,
    "",
    `Servicio: ${d.serviceName}`,
    d.barberName ? `Barbero: ${d.barberName}` : null,
    `Fecha: ${dateLabel}`,
    `Hora: ${timeLabel}`,
    location ? `Dirección: ${location}` : null,
    d.barbershopPhone ? `Teléfono: ${d.barbershopPhone}` : null,
    "",
    "Si necesitas cambiar o cancelar tu cita, contacta directamente con la barbería.",
    "",
    "— BarberíaOS · Sistema de reservas para barberías",
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

export async function sendBookingConfirmation(
  data: BookingConfirmationData
): Promise<void> {
  const resend = getResendClient();
  if (!resend) return; // Sin API key = sin email, sin error

  const fromEmail =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "BarberíaOS <reservas@barberiaos.com>";

  try {
    await resend.emails.send({
      from: fromEmail,
      to: data.clientEmail,
      subject: `Reserva confirmada en ${data.barbershopName} — ${formatTime(data.appointmentTime)}`,
      html: buildEmailHtml(data),
      text: buildEmailText(data),
    });
  } catch (err) {
    // El email falla en silencio — la reserva ya fue creada y no debe revertirse
    console.error("[Resend] Error al enviar confirmación de reserva:", err);
  }
}
