# n8n automation events

## Seguridad

- n8n nunca recibe `SUPABASE_SERVICE_ROLE_KEY`.
- El frontend nunca llama a n8n.
- Los secretos no usan `NEXT_PUBLIC_`.
- BarberiaOS guarda eventos en `automation_events` y un endpoint interno los envia a la Production URL de n8n.
- El endpoint interno exige `Authorization: Bearer <N8N_WEBHOOK_SECRET>` o `x-webhook-secret: <N8N_WEBHOOK_SECRET>`.
- Si no existe `N8N_WEBHOOK_SECRET`, usa `WEBHOOK_SECRET`.
- `N8N_WEBHOOK_URL` debe ser una URL de produccion. El endpoint rechaza `localhost`, `127.0.0.1` y dominios `.local`.

## Variables

```env
N8N_WEBHOOK_URL=https://your-n8n-domain.com/webhook/barberiaos-events
N8N_WEBHOOK_SECRET=change_me
```

## Endpoint interno

```http
POST /api/internal/automation-events/dispatch
Authorization: Bearer <N8N_WEBHOOK_SECRET>
```

Opcional:

```http
POST /api/internal/automation-events/dispatch?limit=10
x-webhook-secret: <N8N_WEBHOOK_SECRET>
```

El endpoint:

- Lee eventos `pending` o reintentables.
- Marca cada evento como `processing`.
- Envia a n8n con headers `x-webhook-secret` y `x-idempotency-key`.
- Marca `processed` si n8n responde 2xx.
- Reintenta hasta 5 intentos.
- Guarda errores en `last_error`.

## Payload base enviado a n8n

```json
{
  "id": "automation_event_uuid",
  "event_type": "appointment_created",
  "barbershop_id": "barbershop_uuid",
  "payload": {},
  "idempotency_key": "appointment_created:appointment_uuid",
  "created_at": "2026-05-20T10:00:00.000Z"
}
```

## Evento appointment_created

Se crea despues de una reserva publica correcta en `/r/[slug]`.

```json
{
  "id": "automation_event_uuid",
  "event_type": "appointment_created",
  "barbershop_id": "barbershop_uuid",
  "payload": {
    "appointment_id": "appointment_uuid",
    "barbershop_id": "barbershop_uuid",
    "barbershop_slug": "mi-barberia",
    "service_id": "service_uuid",
    "barber_id": "barber_uuid",
    "client": {
      "name": "Carlos Garcia",
      "phone": "+34 600 000 000"
    },
    "appointment": {
      "date": "2026-05-21",
      "start_time": "10:30"
    },
    "source": "public_booking"
  },
  "idempotency_key": "appointment_created:appointment_uuid",
  "created_at": "2026-05-20T10:00:00.000Z"
}
```

## Idempotencia

- `automation_events.idempotency_key` es unico.
- Para `appointment_created`, la clave es `appointment_created:<appointment_id>`.
- El endpoint tambien envia `x-idempotency-key` a n8n para que el workflow pueda ignorar duplicados si se reintenta.

## Como probar con una reserva demo

1. Aplicar la migracion `029_automation_events.sql`.
2. Configurar en servidor:

```env
N8N_WEBHOOK_URL=https://your-n8n-domain.com/webhook/barberiaos-events
N8N_WEBHOOK_SECRET=un-secreto-largo
```

3. En n8n, crear un workflow con Webhook node en Production URL.
4. Validar en n8n que llega `x-webhook-secret` y compararlo con el secreto configurado.
5. Crear una reserva demo desde `/r/[slug]`.
6. Confirmar en Supabase:

```sql
select event_type, status, attempts, idempotency_key, payload
from public.automation_events
order by created_at desc
limit 5;
```

7. Despachar manualmente:

```bash
curl -X POST "https://tu-dominio.com/api/internal/automation-events/dispatch?limit=5" \
  -H "Authorization: Bearer un-secreto-largo"
```

8. Esperado:

- El endpoint devuelve `ok: true`.
- El evento cambia a `processed`.
- n8n recibe `appointment_created`.

## Logs basicos

BarberiaOS registra en server logs:

- `automation_events queued`
- `automation_events duplicate ignored`
- `automation_events insert failed`
- `automation event dispatched`
- `automation event dispatch failed`
