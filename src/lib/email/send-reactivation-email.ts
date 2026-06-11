import "server-only";
import { Resend } from "resend";

export type ReactivationEmailData = {
  clientName: string;
  clientEmail: string;
  barbershopName: string;
  barbershopSlug: string;
  daysSince: number;
  appUrl: string;
};

function buildHtml(d: ReactivationEmailData): string {
  const bookingUrl = `${d.appUrl}/r/${d.barbershopSlug}`;
  const isLost     = d.daysSince > 75;
  const badge      = isLost
    ? `⏳ Hace ${d.daysSince} días que no te vemos`
    : `⏰ Hace ${d.daysSince} días por la barbería`;
  const headline = isLost
    ? `${d.clientName}, ¡cuánto tiempo sin verte!`
    : `${d.clientName}, te echamos de menos`;
  const body = isLost
    ? `Han pasado ${d.daysSince} días desde tu última visita a <strong>${d.barbershopName}</strong>. Sería un placer volver a verte — reserva cuando quieras.`
    : `Llevas ${d.daysSince} días sin pasar por <strong>${d.barbershopName}</strong>. Tu barbero favorito sigue aquí cuando lo necesites.`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Te echamos de menos — ${d.barbershopName}</title>
</head>
<body style="margin:0;padding:0;background:#F4F1EB;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EB;padding:32px 16px;">
  <tr><td align="center">

    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;border:1px solid #E5E0D6;overflow:hidden;">

      <!-- Header -->
      <tr>
        <td style="background:#0B0F19;padding:28px 32px 24px;">
          <p style="margin:0;font-size:11px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#D4AF37;">BarberíaOS · Reactivación</p>
          <p style="margin:8px 0 0;font-size:22px;font-weight:900;color:#FFFFFF;line-height:1.2;">${d.barbershopName}</p>
        </td>
      </tr>

      <!-- Badge -->
      <tr>
        <td style="padding:24px 32px 0;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#FFFBEB;border:1px solid #D4AF37;border-radius:100px;padding:6px 14px;">
                <p style="margin:0;font-size:13px;font-weight:900;color:#92400E;">${badge}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Headline + body -->
      <tr>
        <td style="padding:20px 32px 0;">
          <p style="margin:0;font-size:20px;font-weight:900;color:#111827;line-height:1.3;">${headline}</p>
          <p style="margin:12px 0 0;font-size:14px;color:#374151;line-height:1.7;">${body}</p>
        </td>
      </tr>

      <!-- Divider gold -->
      <tr>
        <td style="padding:20px 32px 0;">
          <div style="height:2px;background:linear-gradient(to right,#D4AF37,transparent);border-radius:1px;"></div>
        </td>
      </tr>

      <!-- Reasons to come back -->
      <tr>
        <td style="padding:20px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F7F3;border-radius:14px;border:1px solid #E8E3D8;">
            <tr>
              <td style="padding:16px 20px;">
                <p style="margin:0 0 12px;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">¿Qué te espera?</p>
                ${[
                  "Servicio rápido y de calidad, sin esperas innecesarias",
                  "Tu barbero favorito, listo para cuidarte como siempre",
                  "Reserva online en 60 segundos, sin llamadas",
                ]
                  .map(
                    (item) =>
                      `<p style="margin:0 0 8px;font-size:13px;color:#374151;line-height:1.5;">✓ ${item}</p>`
                  )
                  .join("")}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td style="padding:20px 32px 24px;">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="background:#D4AF37;border-radius:12px;padding:16px 24px;">
                <a href="${bookingUrl}" style="color:#0B0F19;font-size:15px;font-weight:900;text-decoration:none;letter-spacing:-0.01em;">
                  Reservar mi próxima cita →
                </a>
              </td>
            </tr>
          </table>
          <p style="margin:12px 0 0;font-size:11px;color:#9CA3AF;text-align:center;">
            O visita <a href="${bookingUrl}" style="color:#D4AF37;text-decoration:none;">${d.barbershopSlug}.barberiaos.com</a>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#F9F7F3;border-top:1px solid #E8E3D8;padding:16px 32px;">
          <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;">
            Mensaje de <strong style="color:#6B7280;">${d.barbershopName}</strong> vía BarberíaOS ·
            <a href="${bookingUrl}" style="color:#9CA3AF;">Gestionar mis preferencias</a>
          </p>
        </td>
      </tr>

    </table>

  </td></tr>
</table>

</body>
</html>`;
}

function buildText(d: ReactivationEmailData): string {
  const bookingUrl = `${d.appUrl}/r/${d.barbershopSlug}`;
  return [
    `${d.barbershopName} — Te echamos de menos`,
    "",
    `Hola ${d.clientName},`,
    "",
    `Hace ${d.daysSince} días que no pasas por ${d.barbershopName}. Cuando quieras tu próxima cita, estamos aquí.`,
    "",
    `Reserva en: ${bookingUrl}`,
    "",
    `— ${d.barbershopName} vía BarberíaOS`,
  ].join("\n");
}

let _resend: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  if (!_resend) _resend = new Resend(apiKey);
  return _resend;
}

export async function sendReactivationEmail(data: ReactivationEmailData): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;

  const from = process.env.RESEND_FROM_EMAIL?.trim() || "BarberíaOS <reservas@barberiaos.com>";

  try {
    await resend.emails.send({
      from,
      to:      data.clientEmail,
      subject: `${data.barbershopName} te echa de menos — hace ${data.daysSince} días sin verte`,
      html:    buildHtml(data),
      text:    buildText(data),
    });
  } catch (err) {
    console.error("[Resend] Error al enviar email de reactivación:", err);
  }
}
