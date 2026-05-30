# BarberíaOS — Sistema n8n Instagram

Objetivo: convertir Instagram en captación de leads para demos de BarberíaOS usando automatizaciones oficiales de Meta, n8n y Supabase.

## Variables

- `BARBERIAOS_BASE_URL`: URL pública del proyecto.
- `N8N_WEBHOOK_SECRET`: secreto compartido con BarberíaOS.
- `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`: solo dentro de BarberíaOS o n8n seguro, nunca en frontend.
- Landing recomendada: `/instagram?utm_source=instagram&utm_medium=organic_social&utm_campaign={{campaign}}`.

## Endpoints BarberíaOS

### POST `/api/leads`

Uso: formularios públicos como `/instagram`.

Payload mínimo:

```json
{
  "name": "Andrés",
  "barbershopName": "Barbería Norte",
  "city": "Valencia",
  "whatsapp": "+34600000000",
  "barbersCount": "2-3",
  "source": "instagram",
  "utmSource": "instagram",
  "utmMedium": "organic_social",
  "utmCampaign": "bio"
}
```

### POST `/api/webhooks/n8n/instagram-lead`

Uso: n8n captura conversación o comentario y crea lead.

Headers:

```http
Authorization: Bearer {{N8N_WEBHOOK_SECRET}}
```

Payload:

```json
{
  "barbershopName": "Barbería Norte",
  "contactName": "Andrés",
  "city": "Valencia",
  "whatsapp": "+34600000000",
  "instagramUsername": "barberianorte",
  "barbersCount": "2-3",
  "keyword": "DEMO",
  "temperature": "hot",
  "sourceEvent": "instagram_dm"
}
```

## Workflows

## 1. Comentario “DEMO” en Instagram → DM automático

Trigger:
- Meta Instagram Graph API Webhook: comments.
- Filtrar comentario con keyword exacta o normalizada: `demo`.

Pasos:
1. Validar firma de Meta.
2. Normalizar username, post id, comment id y texto.
3. Enviar private reply oficial con enlace:
   `{{BARBERIAOS_BASE_URL}}/instagram?utm_source=instagram&utm_medium=comment&utm_campaign=demo_keyword&utm_content={{post_id}}`
4. Guardar evento en n8n o Supabase si se quiere auditoría.

Mensaje sugerido:
“Te paso la demo de BarberíaOS. Mira esta página y déjame tu WhatsApp para enseñarte cómo quedaría en tu barbería.”

## 2. DM con palabra “demo” → capturar lead

Trigger:
- Meta Instagram Graph API Webhook: messages.
- Condición: texto contiene `demo`, `info`, `precio`, `reservas`, `caja` o `clientes`.

Pasos:
1. Responder pidiendo datos mínimos: nombre de barbería, ciudad, WhatsApp y número de barberos.
2. Cuando estén completos, llamar a `POST /api/webhooks/n8n/instagram-lead`.
3. Marcar `temperature` como:
   - `hot`: pide demo, precio o migración.
   - `warm`: pide información.
   - `cold`: interacción genérica.

## 3. Lead nuevo → aviso por WhatsApp/Telegram/email

Trigger:
- Webhook interno después de crear lead o respuesta OK de BarberíaOS.

Acción:
- Enviar alerta al founder:
  “Nuevo lead Instagram: {{barbershopName}} · {{city}} · {{barbersCount}} barberos · WhatsApp {{whatsapp}}”.

Canales:
- Telegram Bot API.
- Email SMTP.
- WhatsApp Business Platform si está aprobado.

## 4. Lead nuevo → guardar en Supabase

Opción recomendada:
- Guardar mediante `POST /api/webhooks/n8n/instagram-lead`.
- No escribir directo en Supabase desde workflows públicos salvo entorno seguro.

Tabla:
- `crm_leads`.

Campos clave:
- `source = instagram`
- `status = new`
- `utm_source = instagram`
- `instagram_username`
- `barbers_count`
- `lead_temperature`

## 5. Lead caliente → crear tarea de seguimiento

Condición:
- `temperature = hot`.

Acción implementada:
- El endpoint de BarberíaOS crea una tarea en `crm_tasks` con prioridad `alta` y vencimiento aproximado de 1 hora.

Acción n8n adicional:
- Aviso inmediato por Telegram o email con etiqueta `🔥 HOT`.

## 6. Publicaciones desde Google Sheets/Notion hacia Instagram

Trigger:
- Cron diario o semanal.
- Fuente: Google Sheets o Notion database.

Columnas recomendadas:
- `date`
- `caption`
- `creative_url`
- `campaign`
- `cta`
- `status`

Pasos:
1. Leer filas con `status = approved`.
2. Publicar vía Instagram Content Publishing API.
3. Añadir CTA con UTM:
   `/instagram?utm_source=instagram&utm_medium=post&utm_campaign={{campaign}}`
4. Cambiar `status = published`.
5. Guardar permalink y fecha de publicación.

## Seguridad

- No scraping.
- No bots de follow/unfollow.
- No DMs masivos sin interacción previa.
- Usar APIs oficiales de Meta.
- Validar firma de Meta en webhooks.
- Proteger n8n con `N8N_WEBHOOK_SECRET`.
- No exponer service role en cliente.
