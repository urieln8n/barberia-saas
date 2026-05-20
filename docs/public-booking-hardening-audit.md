# Public booking hardening audit

## Diagnostico

- `/r/[slug]` usa `createServiceRoleClient` en server actions. Es correcto para un flujo publico siempre que todo input se valide y se limite antes de tocar datos sensibles.
- Antes de este cambio, `createPublicBooking` confiaba en strings recibidos desde cliente y solo comprobaba presencia. Faltaban validaciones de UUID, fecha, hora, telefono, email y consentimiento.
- El formulario ya recogia email y check de privacidad, pero no los enviaba ni los hacia cumplir en servidor.
- No habia proteccion anti-bot: sin honeypot y sin limitacion basica de intentos por IP o telefono.
- La disponibilidad publica comprueba conflictos por solape real contra `appointments`, y el RPC `create_booking_safe` vuelve a proteger contra solapes antes de insertar. Ese doble control es bueno.
- Riesgo pendiente: el rate limit en memoria solo protege por instancia/proceso. Para produccion con varias instancias debe migrarse a tabla/Redis/Upstash o Supabase.
- Riesgo pendiente: la disponibilidad no usa horarios reales por barberia/barbero. Public booking usa `generateTimeSlots()` con 10:00-20:00, mientras dashboard/marketing/estadisticas usan fallback 09:00-20:00.

## Archivos revisados

- `app/r/[slug]/page.tsx`
- `app/r/[slug]/BookingForm.tsx`
- `app/r/[slug]/actions.ts`
- `src/lib/booking/time-slots.ts`
- `src/lib/booking/barber-availability.ts`
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_production_fixes.sql`

## Archivos tocados en este primer paso

- `app/r/[slug]/actions.ts`
- `app/r/[slug]/BookingForm.tsx`
- `docs/public-booking-hardening-audit.md`

## Primer cambio seguro aplicado

- Validacion Zod en `createPublicBooking`.
- Honeypot `website` invisible en el formulario publico.
- Rate limit basico en memoria por `barbershopId + IP` y `barbershopId + telefono`.
- Envio de `email`, `privacyAccepted` y `website` desde cliente a server action.
- Bloqueo de avance si no se acepta privacidad.

## Preparacion email

Recomendacion:

- Usar Resend si se prioriza entrega rapida y buena DX.
- Usar SMTP solo si el cliente ya tiene proveedor corporativo y se quiere evitar dependencia nueva de API.
- No exponer claves en cliente. Enviar desde server action o desde una cola/edge function.
- Guardar `client_email` antes de enviar confirmacion. Hoy el RPC solo recibe `p_client_name` y `p_client_phone`.
- El envio debe ocurrir despues de crear la cita. Si falla el email, no debe revertir la reserva; debe registrarse para reintento.

Variables propuestas:

- `RESEND_API_KEY`
- `BOOKING_EMAIL_FROM`
- `NEXT_PUBLIC_SITE_URL` o reutilizar `SITE_URL`

## Cancelacion self-service con token seguro

Diseno recomendado:

- Al crear una reserva publica, generar token aleatorio de 32 bytes.
- Guardar solo hash SHA-256 del token, nunca el token plano.
- Enviar enlace: `/r/[slug]/cancelar?token=...`
- La pagina valida token no expirado, no usado, ligado a `appointment_id` y `barbershop_id`.
- Al cancelar, actualizar `appointments.status = 'cancelled'`, marcar `booking_tokens.used_at = now()` y registrar `cancelled_at`.
- Expiracion recomendada: hasta la hora de la cita o maximo 30 dias.

## Migracion propuesta booking_tokens

```sql
create table if not exists public.booking_tokens (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershops(id) on delete cascade,
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  token_hash text not null unique,
  purpose text not null check (purpose in ('cancel_booking')),
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_booking_tokens_appointment
  on public.booking_tokens(appointment_id);

create index if not exists idx_booking_tokens_barbershop_purpose
  on public.booking_tokens(barbershop_id, purpose, expires_at);

alter table public.booking_tokens enable row level security;

-- No public select/update policies.
-- Acceso por server action con service role o RPC security definer validando hash.
```

## Auditoria disponibilidad

- `src/lib/booking/time-slots.ts` genera slots por hora entera y minutos segun intervalo. No valida que el intervalo divida 60.
- `app/r/[slug]/BookingForm.tsx` muestra slots con `generateTimeSlots()` sin parametros: 10:00-20:00.
- `app/r/[slug]/actions.ts` calcula slots no disponibles tambien con `generateTimeSlots()` sin parametros: 10:00-20:00.
- `src/lib/booking/barber-availability.ts` usa fallback 09:00-20:00 para analitica, no para la pagina publica.
- `app/dashboard/agenda/AgendaClient.tsx` usa `generateTimeSlots(9, 20, 30)`.
- `app/dashboard/page.tsx`, `app/dashboard/huecos/page.tsx`, `app/dashboard/marketing/page.tsx` y `src/lib/stats/availability.ts` asumen 09:00-20:00.

## Siguiente paso recomendado

Crear una migracion nueva, no editar antiguas:

- `booking_tokens`.
- columnas opcionales en `clients`: `email`, `marketing_consent`, `privacy_accepted_at`.
- opcionalmente `public_booking_requests` o `booking_rate_limits` si se quiere rate limit persistente en Supabase.
- extender `create_booking_safe` o crear un nuevo RPC que acepte email/consentimientos y devuelva `appointment_id`.

## Como probar

1. Abrir `/r/[slug]`.
2. Completar una reserva normal aceptando privacidad. Debe registrar la cita.
3. Intentar continuar sin aceptar privacidad. Debe bloquearse.
4. Enviar un payload con `website` no vacio desde devtools o test manual. Debe devolver error generico.
5. Repetir mas de 3 reservas con el mismo telefono en una hora. Debe bloquear.
6. Repetir mas de 8 intentos desde la misma IP para una barberia en una hora. Debe bloquear.
7. Intentar fecha pasada, UUID invalido, hora invalida o telefono con letras. Debe rechazar antes del RPC.
