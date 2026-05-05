-- BarberíaOS — Production Fixes
-- Migración: 002_production_fixes.sql
-- Aplicar desde Supabase SQL Editor o con: supabase db push
--
-- ORDEN DE EJECUCIÓN (respetar dependencias):
--   FIX 1  → payments.notes (columna faltante)
--   FIX 2  → appointments.status CHECK (añadir 'pending')
--   FIX 3  → clients UNIQUE (phone) — necesario antes del RPC
--   FIX 4  → Índices faltantes
--   FIX 5  → UNIQUE index anti-double-booking
--   FIX 6  → RLS: policies para profiles y barbershop_members
--   FIX 7  → RLS: restringir policies públicas de barbers/services
--   FIX 8  → RPC create_booking_safe (depende de FIX 3 y FIX 5)


-- ─────────────────────────────────────────────────────────────────────────────
-- FIX 1 — Añadir columna `notes` a payments
-- El código en pagos/actions.ts inserta este campo pero no existía en schema.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS notes text;


-- ─────────────────────────────────────────────────────────────────────────────
-- FIX 2 — Añadir 'pending' al CHECK constraint de appointments.status
-- El código usa 'pending' en anti-double-booking, labels y filtros de agenda.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.appointments
  DROP CONSTRAINT IF EXISTS appointments_status_check;

ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_status_check
  CHECK (status IN ('pending','scheduled','confirmed','completed','cancelled','no_show'));


-- ─────────────────────────────────────────────────────────────────────────────
-- FIX 3 — UNIQUE constraint en clients(barbershop_id, phone)
-- Evita clientes duplicados y permite ON CONFLICT en el RPC de reserva pública.
-- Primero elimina duplicados conservando el registro más antiguo.
-- ─────────────────────────────────────────────────────────────────────────────

DELETE FROM public.clients c1
USING public.clients c2
WHERE c1.barbershop_id = c2.barbershop_id
  AND c1.phone IS NOT NULL
  AND c1.phone = c2.phone
  AND c1.created_at > c2.created_at;

ALTER TABLE public.clients
  ADD CONSTRAINT clients_barbershop_phone_unique
  UNIQUE (barbershop_id, phone);


-- ─────────────────────────────────────────────────────────────────────────────
-- FIX 4 — Índices faltantes
-- Nota: CREATE INDEX sin CONCURRENTLY para compatibilidad con transacciones.
-- En producción con tablas grandes usar CONCURRENTLY desde el SQL Editor.
-- ─────────────────────────────────────────────────────────────────────────────

-- FKs sin índice (seq scan en cada JOIN)
CREATE INDEX IF NOT EXISTS idx_appointments_client_id
  ON public.appointments(client_id);

CREATE INDEX IF NOT EXISTS idx_payments_client_id
  ON public.payments(client_id);

CREATE INDEX IF NOT EXISTS idx_payments_appointment_id
  ON public.payments(appointment_id);

-- getCurrentBarbershopId se ejecuta en cada request del dashboard
CREATE INDEX IF NOT EXISTS idx_barbershop_members_user_id
  ON public.barbershop_members(user_id);

CREATE INDEX IF NOT EXISTS idx_barbershops_owner_id
  ON public.barbershops(owner_id);

-- Partial indexes para filtros frecuentes de activos
CREATE INDEX IF NOT EXISTS idx_services_barbershop_active
  ON public.services(barbershop_id)
  WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_barbers_barbershop_active
  ON public.barbers(barbershop_id)
  WHERE active = true;

-- Eliminar índice redundante (slug UNIQUE ya crea un B-tree implícito)
DROP INDEX IF EXISTS public.idx_barbershops_slug;


-- ─────────────────────────────────────────────────────────────────────────────
-- FIX 5 — UNIQUE index para anti-double-booking a nivel de base de datos
-- Última línea de defensa contra race conditions concurrentes.
-- También activa el catch 'unique_active_barber_appointment_slot' en el código.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE UNIQUE INDEX IF NOT EXISTS unique_active_barber_appointment_slot
  ON public.appointments(barber_id, appointment_date, start_time)
  WHERE status IN ('pending','scheduled','confirmed');


-- ─────────────────────────────────────────────────────────────────────────────
-- FIX 6 — Policies RLS faltantes
-- ─────────────────────────────────────────────────────────────────────────────

-- profiles: faltaba la policy INSERT (el upsert de onboarding fallaba con RLS)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- barbershop_members: tenía RLS activo pero CERO policies → denegaba todo
-- getCurrentBarbershopId con el client del usuario siempre devolvía vacío.
DROP POLICY IF EXISTS "Members can read their own memberships" ON public.barbershop_members;
CREATE POLICY "Members can read their own memberships" ON public.barbershop_members
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Owners can manage members" ON public.barbershop_members;
CREATE POLICY "Owners can manage members" ON public.barbershop_members
  FOR ALL
  USING (public.is_barbershop_member(barbershop_id))
  WITH CHECK (public.is_barbershop_member(barbershop_id));


-- ─────────────────────────────────────────────────────────────────────────────
-- FIX 7 — Restringir policies públicas de barbers y services
-- Las policies anteriores exponían TODOS los registros activos de todos los
-- tenants a cualquier llamada anónima a la API de Supabase.
-- ─────────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Public can read active barbers" ON public.barbers;
DROP POLICY IF EXISTS "Public can read active services" ON public.services;

DROP POLICY IF EXISTS "Public can read active barbers of public barbershops" ON public.barbers;
CREATE POLICY "Public can read active barbers of public barbershops"
  ON public.barbers
  FOR SELECT USING (
    active = true
    AND EXISTS (
      SELECT 1 FROM public.barbershops bs
      WHERE bs.id = barbers.barbershop_id
        AND bs.public_booking_enabled = true
    )
  );

DROP POLICY IF EXISTS "Public can read active services of public barbershops" ON public.services;
CREATE POLICY "Public can read active services of public barbershops"
  ON public.services
  FOR SELECT USING (
    active = true
    AND EXISTS (
      SELECT 1 FROM public.barbershops bs
      WHERE bs.id = services.barbershop_id
        AND bs.public_booking_enabled = true
    )
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- FIX 8 — RPC create_booking_safe
-- Función atómica para reservas públicas (/r/[slug]).
-- Reemplaza la llamada a supabase.rpc("create_booking_safe") que fallaba
-- porque no existía. Incluye:
--   · Resolución de barbershop por slug
--   · Validación de servicio y barbero
--   · Auto-asignación de barbero libre (si p_barber_id IS NULL)
--   · Validación de overlap real (start_time/end_time), no solo exact match
--   · FOR UPDATE lock para evitar race conditions
--   · Upsert de cliente por teléfono (evita duplicados)
--   · Insert atómico de cita
-- ─────────────────────────────────────────────────────────────────────────────

DROP FUNCTION IF EXISTS public.create_booking_safe(text,uuid,uuid,text,text,date,time,text);
DROP FUNCTION IF EXISTS public.create_booking_safe(text,uuid,uuid,text,text,date,time without time zone,text);

CREATE OR REPLACE FUNCTION public.create_booking_safe(
  p_slug             text,
  p_service_id       uuid,
  p_barber_id        uuid,
  p_client_name      text,
  p_client_phone     text,
  p_appointment_date date,
  p_start_time       time,
  p_notes            text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_barbershop_id  uuid;
  v_duration_min   int;
  v_barber_id      uuid;
  v_client_id      uuid;
  v_end_time       time;
  v_conflict_id    uuid;
  v_appointment_id uuid;
BEGIN
  -- 1. Resolver barbershop por slug y verificar reservas públicas activas
  SELECT id
    INTO v_barbershop_id
    FROM public.barbershops
   WHERE slug = p_slug
     AND public_booking_enabled = true;

  IF v_barbershop_id IS NULL THEN
    RAISE EXCEPTION 'Barbería no encontrada';
  END IF;

  -- 2. Validar servicio pertenece a la barbería y está activo
  SELECT duration_minutes
    INTO v_duration_min
    FROM public.services
   WHERE id              = p_service_id
     AND barbershop_id   = v_barbershop_id
     AND active          = true;

  IF v_duration_min IS NULL THEN
    RAISE EXCEPTION 'Servicio no disponible';
  END IF;

  -- 3. Calcular end_time
  v_end_time := (p_start_time + (v_duration_min || ' minutes')::interval)::time;

  -- 4. Resolver barbero
  IF p_barber_id IS NOT NULL THEN
    -- Barbero específico: validar que pertenece a la barbería y está activo
    SELECT id
      INTO v_barber_id
      FROM public.barbers
     WHERE id            = p_barber_id
       AND barbershop_id = v_barbershop_id
       AND active        = true;

    IF v_barber_id IS NULL THEN
      RAISE EXCEPTION 'Barbero no disponible';
    END IF;
  ELSE
    -- Sin preferencia: asignar primer barbero libre con overlap real + lock
    SELECT b.id
      INTO v_barber_id
      FROM public.barbers b
     WHERE b.barbershop_id = v_barbershop_id
       AND b.active        = true
       AND NOT EXISTS (
         SELECT 1
           FROM public.appointments a
          WHERE a.barber_id        = b.id
            AND a.appointment_date = p_appointment_date
            AND a.status IN ('pending','scheduled','confirmed')
            AND a.start_time       < v_end_time
            AND a.end_time         > p_start_time
       )
     ORDER BY b.name
     LIMIT 1
     FOR UPDATE SKIP LOCKED;

    IF v_barber_id IS NULL THEN
      RAISE EXCEPTION 'Esta hora ya no está disponible. Elige otra.';
    END IF;
  END IF;

  -- 5. Verificar overlap real con lock para eliminar race condition
  SELECT id
    INTO v_conflict_id
    FROM public.appointments
   WHERE barber_id        = v_barber_id
     AND appointment_date = p_appointment_date
     AND status IN ('pending','scheduled','confirmed')
     AND start_time       < v_end_time
     AND end_time         > p_start_time
   FOR UPDATE;

  IF v_conflict_id IS NOT NULL THEN
    RAISE EXCEPTION 'Esta hora ya no está disponible. Elige otra.';
  END IF;

  -- 6. Upsert cliente por teléfono dentro de la barbería (evita duplicados)
  INSERT INTO public.clients (barbershop_id, name, phone)
  VALUES (v_barbershop_id, p_client_name, p_client_phone)
  ON CONFLICT (barbershop_id, phone)
  DO UPDATE SET
    name         = EXCLUDED.name,
    last_visit_at = now()
  RETURNING id INTO v_client_id;

  -- 7. Insertar cita de forma atómica
  INSERT INTO public.appointments (
    barbershop_id,
    client_id,
    barber_id,
    service_id,
    appointment_date,
    start_time,
    end_time,
    status,
    source,
    notes
  ) VALUES (
    v_barbershop_id,
    v_client_id,
    v_barber_id,
    p_service_id,
    p_appointment_date,
    p_start_time,
    v_end_time,
    'scheduled',
    'public_booking',
    p_notes
  )
  RETURNING id INTO v_appointment_id;

  RETURN v_appointment_id;
END;
$$;
