import "server-only";
import { Resend } from "resend";

export type BirthdayEmailData = {
  clientName: string;
  clientEmail: string;
  barbershopName: string;
  barbershopSlug: string;
  appUrl: string;
};

function buildHtml(d: BirthdayEmailData): string {
  const bookingUrl = `${d.appUrl}/r/${d.barbershopSlug}`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>¡Feliz cumpleaños, ${d.clientName}!</title>
</head>
<body style="margin:0;padding:0;background:#F4F1EB;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EB;padding:32px 16px;">
  <tr><td align="center">

    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;border:1px solid #E5E0D6;overflow:hidden;">

      <!-- Header oscuro con confeti simulado -->
      <tr>
        <td style="background:#0B0F19;padding:32px 32px 28px;text-align:center;">
          <p style="margin:0;font-size:32px;line-height:1;">🎂</p>
          <p style="margin:10px 0 0;font-size:11px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#D4AF37;">
            BarberíaOS · Cumpleaños
          </p>
          <p style="margin:8px 0 0;font-size:26px;font-weight:900;color:#FFFFFF;line-height:1.2;">
            ¡Feliz cumpleaños,<br/>${d.clientName}!
          </p>
          <p style="margin:10px 0 0;font-size:13px;color:#9CA3AF;">
            Con cariño de <strong style="color:#D4AF37;">${d.barbershopName}</strong>
          </p>
        </td>
      </tr>

      <!-- Badge regalo -->
      <tr>
        <td style="padding:24px 32px 0;text-align:center;">
          <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
              <td style="background:#FFFBEB;border:1px solid #D4AF37;border-radius:100px;padding:8px 18px;">
                <p style="margin:0;font-size:13px;font-weight:900;color:#92400E;">
                  🎁 Tienes un regalo esperándote
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Mensaje -->
      <tr>
        <td style="padding:20px 32px 0;">
          <p style="margin:0;font-size:15px;color:#374151;line-height:1.8;text-align:center;">
            En tu día especial queremos celebrarlo contigo.<br/>
            <strong>Tu próxima visita a ${d.barbershopName}</strong><br/>
            es nuestra forma de felicitarte.
          </p>
        </td>
      </tr>

      <!-- Decoración gold -->
      <tr>
        <td style="padding:20px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFBEB;border-radius:14px;border:1px solid #FDE68A;">
            <tr>
              <td style="padding:18px 20px;text-align:center;">
                <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">
                  Tu regalo de cumpleaños
                </p>
                <p style="margin:8px 0 0;font-size:20px;font-weight:900;color:#1F2937;">
                  Reserva prioritaria sin esperas
                </p>
                <p style="margin:6px 0 0;font-size:13px;color:#6B7280;">
                  Válido hoy y durante los próximos 7 días
                </p>
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
                <a href="${bookingUrl}" style="color:#0B0F19;font-size:15px;font-weight:900;text-decoration:none;">
                  Reservar mi regalo →
                </a>
              </td>
            </tr>
          </table>
          <p style="margin:12px 0 0;font-size:11px;color:#9CA3AF;text-align:center;">
            Reserva online en 60 segundos en
            <a href="${bookingUrl}" style="color:#D4AF37;text-decoration:none;">${d.barbershopSlug}.barberiaos.com</a>
          </p>
        </td>
      </tr>

      <!-- Mensaje final cálido -->
      <tr>
        <td style="padding:0 32px 24px;">
          <p style="margin:0;font-size:13px;color:#6B7280;text-align:center;line-height:1.6;border-top:1px solid #F3EEEA;padding-top:16px;">
            ¡Que tengas un día increíble! 🥳<br/>
            Todo el equipo de <strong>${d.barbershopName}</strong>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#F9F7F3;border-top:1px solid #E8E3D8;padding:16px 32px;">
          <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;">
            Felicitación automática de <strong style="color:#6B7280;">${d.barbershopName}</strong> vía BarberíaOS
          </p>
        </td>
      </tr>

    </table>

  </td></tr>
</table>

</body>
</html>`;
}

function buildText(d: BirthdayEmailData): string {
  const bookingUrl = `${d.appUrl}/r/${d.barbershopSlug}`;
  return [
    `🎂 ¡Feliz cumpleaños, ${d.clientName}!`,
    "",
    `Todo el equipo de ${d.barbershopName} te deseamos un día increíble.`,
    "",
    "Como regalo, te reservamos atención prioritaria esta semana.",
    "",
    `Reserva ahora: ${bookingUrl}`,
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

export async function sendBirthdayEmail(data: BirthdayEmailData): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;

  const from = process.env.RESEND_FROM_EMAIL?.trim() || "BarberíaOS <reservas@barberiaos.com>";

  try {
    await resend.emails.send({
      from,
      to:      data.clientEmail,
      subject: `🎂 ¡Feliz cumpleaños, ${data.clientName}! Un regalo de ${data.barbershopName}`,
      html:    buildHtml(data),
      text:    buildText(data),
    });
  } catch (err) {
    console.error("[Resend] Error al enviar email de cumpleaños:", err);
  }
}
