import "server-only";
import { Resend } from "resend";

export type WelcomeEmailData = {
  ownerName: string;
  ownerEmail: string;
  barbershopName: string;
  barbershopSlug: string;
  appUrl: string;
};

function buildHtml(d: WelcomeEmailData): string {
  const bookingUrl = `${d.appUrl}/r/${d.barbershopSlug}`;
  const dashboardUrl = `${d.appUrl}/dashboard`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>¡Tu barbería está lista en BarberíaOS!</title>
</head>
<body style="margin:0;padding:0;background:#F4F1EB;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EB;padding:32px 16px;">
  <tr><td align="center">

    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;border:1px solid #E5E0D6;overflow:hidden;">

      <!-- Header dark premium -->
      <tr>
        <td style="background:#0B0F19;padding:28px 32px 24px;">
          <p style="margin:0;font-size:11px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#9CA3AF;">BarberíaOS · Bienvenida</p>
          <p style="margin:8px 0 0;font-size:22px;font-weight:900;color:#FFFFFF;line-height:1.2;">${d.barbershopName}</p>
          <p style="margin:6px 0 0;font-size:13px;color:#D4AF37;">Tu sistema de reservas ya está activo</p>
        </td>
      </tr>

      <!-- Greeting -->
      <tr>
        <td style="padding:28px 32px 0;">
          <p style="margin:0;font-size:20px;font-weight:900;color:#1F2937;">¡Hola, ${d.ownerName}! 👋</p>
          <p style="margin:12px 0 0;font-size:14px;color:#6B7280;line-height:1.7;">
            Tu barbería <strong>${d.barbershopName}</strong> acaba de ser creada en BarberíaOS.
            A partir de ahora tus clientes pueden reservar desde Instagram, Google, WhatsApp o un QR — directamente desde su móvil, sin llamadas.
          </p>
        </td>
      </tr>

      <!-- Booking URL chip -->
      <tr>
        <td style="padding:20px 32px 0;">
          <p style="margin:0 0 8px;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Tu enlace de reservas</p>
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="background:#F9F7F3;border:1px solid #E8E3D8;border-radius:12px;padding:14px 18px;">
                <a href="${bookingUrl}" style="font-size:14px;font-weight:900;color:#0B0F19;text-decoration:none;word-break:break-all;">${bookingUrl}</a>
              </td>
            </tr>
          </table>
          <p style="margin:8px 0 0;font-size:12px;color:#9CA3AF;">Comparte este enlace en tus redes, WhatsApp o imprímelo en un QR.</p>
        </td>
      </tr>

      <!-- 3 first steps -->
      <tr>
        <td style="padding:24px 32px 0;">
          <p style="margin:0 0 14px;font-size:14px;font-weight:900;color:#1F2937;">Tus primeros 3 pasos</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:0 0 12px;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:top;width:32px;">
                      <span style="display:inline-block;width:24px;height:24px;border-radius:8px;background:#D4AF37;text-align:center;line-height:24px;font-size:12px;font-weight:900;color:#0B0F19;">1</span>
                    </td>
                    <td style="padding-left:10px;vertical-align:top;">
                      <p style="margin:0;font-size:13px;font-weight:900;color:#374151;">Añade tu primer servicio</p>
                      <p style="margin:3px 0 0;font-size:12px;color:#9CA3AF;">Panel → Servicios → Nuevo servicio</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 12px;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:top;width:32px;">
                      <span style="display:inline-block;width:24px;height:24px;border-radius:8px;background:#D4AF37;text-align:center;line-height:24px;font-size:12px;font-weight:900;color:#0B0F19;">2</span>
                    </td>
                    <td style="padding-left:10px;vertical-align:top;">
                      <p style="margin:0;font-size:13px;font-weight:900;color:#374151;">Agrega a tus barberos</p>
                      <p style="margin:3px 0 0;font-size:12px;color:#9CA3AF;">Panel → Barberos → Nuevo barbero</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 4px;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:top;width:32px;">
                      <span style="display:inline-block;width:24px;height:24px;border-radius:8px;background:#D4AF37;text-align:center;line-height:24px;font-size:12px;font-weight:900;color:#0B0F19;">3</span>
                    </td>
                    <td style="padding-left:10px;vertical-align:top;">
                      <p style="margin:0;font-size:13px;font-weight:900;color:#374151;">Comparte tu enlace o QR</p>
                      <p style="margin:3px 0 0;font-size:12px;color:#9CA3AF;">Panel → QR → Descarga e imprime</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td style="padding:24px 32px 28px;">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="background:#D4AF37;border-radius:12px;padding:14px 24px;">
                <a href="${dashboardUrl}" style="color:#0B0F19;font-size:14px;font-weight:900;text-decoration:none;">
                  Ir a mi panel →
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

function buildText(d: WelcomeEmailData): string {
  const bookingUrl = `${d.appUrl}/r/${d.barbershopSlug}`;
  const dashboardUrl = `${d.appUrl}/dashboard`;

  return [
    `¡BIENVENIDO A BARBERIAOS! — ${d.barbershopName}`,
    "",
    `Hola ${d.ownerName},`,
    "",
    `Tu barbería "${d.barbershopName}" ya está activa en BarberíaOS.`,
    "Tus clientes pueden reservar desde Instagram, Google, WhatsApp o QR.",
    "",
    `Tu enlace de reservas: ${bookingUrl}`,
    "",
    "PRIMEROS PASOS:",
    "1. Añade tu primer servicio → Panel → Servicios",
    "2. Agrega a tus barberos → Panel → Barberos",
    "3. Comparte tu enlace o QR → Panel → QR",
    "",
    `Ir a tu panel: ${dashboardUrl}`,
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

export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "BarberíaOS <reservas@barberiaos.com>";

  try {
    await resend.emails.send({
      from,
      to: data.ownerEmail,
      subject: `¡Tu barbería "${data.barbershopName}" ya está lista! 🎉`,
      html: buildHtml(data),
      text: buildText(data),
    });
  } catch (err) {
    console.error("[Resend] Error al enviar email de bienvenida:", err);
  }
}
