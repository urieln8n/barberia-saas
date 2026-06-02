-- ============================================================
-- Migración 033: Módulo de Fidelización para BarberíaOS
-- ============================================================
-- Crea loyalty_programs, loyalty_cards, loyalty_stamps
-- + RLS multi-tenant + trigger auto-sello en cita completada
-- No destructiva: usa CREATE TABLE IF NOT EXISTS y ADD COLUMN IF NOT EXISTS
-- ============================================================

-- ── 1. loyalty_programs ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.loyalty_programs (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id       uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  name                text NOT NULL DEFAULT 'Mi programa de fidelización',
  description         text,
  stamps_required     int  NOT NULL DEFAULT 8 CHECK (stamps_required BETWEEN 2 AND 50),
  reward_title        text NOT NULL DEFAULT 'Corte gratis',
  reward_description  text,
  reward_type         text NOT NULL DEFAULT 'free_service'
                        CHECK (reward_type IN ('free_service','discount','product','custom')),
  reward_value        numeric(10,2),
  is_active           boolean NOT NULL DEFAULT true,
  -- Opciones avanzadas
  max_stamps_per_day  int  DEFAULT 1,  -- 1 = un sello máximo por día por cliente
  min_payment_amount  numeric(10,2),   -- NULL = cualquier pago cuenta
  whatsapp_message    text,            -- Mensaje plantilla para n8n/WhatsApp
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_programs_barbershop
  ON public.loyalty_programs(barbershop_id);

-- Columnas nuevas en loyalty_programs (si la tabla ya existía sin ellas)
ALTER TABLE public.loyalty_programs
  ADD COLUMN IF NOT EXISTS description         text,
  ADD COLUMN IF NOT EXISTS reward_title        text NOT NULL DEFAULT 'Corte gratis',
  ADD COLUMN IF NOT EXISTS reward_type         text NOT NULL DEFAULT 'free_service',
  ADD COLUMN IF NOT EXISTS reward_value        numeric(10,2),
  ADD COLUMN IF NOT EXISTS max_stamps_per_day  int  DEFAULT 1,
  ADD COLUMN IF NOT EXISTS min_payment_amount  numeric(10,2),
  ADD COLUMN IF NOT EXISTS whatsapp_message    text;

-- ── 2. loyalty_cards ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.loyalty_cards (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id        uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  client_id            uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  program_id           uuid NOT NULL REFERENCES public.loyalty_programs(id) ON DELETE CASCADE,
  current_stamps       int  NOT NULL DEFAULT 0 CHECK (current_stamps >= 0),
  redeemed_count       int  NOT NULL DEFAULT 0,  -- cuántas veces ha canjeado recompensa
  status               text NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active','completed','redeemed','expired')),
  started_at           timestamptz NOT NULL DEFAULT now(),
  completed_at         timestamptz,
  redeemed_at          timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  -- Una sola tarjeta activa por cliente × programa
  UNIQUE (barbershop_id, client_id, program_id, status)
    DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX IF NOT EXISTS idx_loyalty_cards_barbershop
  ON public.loyalty_cards(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_client
  ON public.loyalty_cards(client_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_program
  ON public.loyalty_cards(program_id);
-- Columnas nuevas en loyalty_cards (si la tabla ya existía sin ellas)
ALTER TABLE public.loyalty_cards
  ADD COLUMN IF NOT EXISTS status        text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS started_at    timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS completed_at  timestamptz,
  ADD COLUMN IF NOT EXISTS redeemed_at   timestamptz;

-- Añadir CHECK constraint en status si no existe
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'loyalty_cards_status_check'
  ) THEN
    ALTER TABLE public.loyalty_cards
      ADD CONSTRAINT loyalty_cards_status_check
      CHECK (status IN ('active','completed','redeemed','expired'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_loyalty_cards_status
  ON public.loyalty_cards(barbershop_id, status);

-- ── 3. loyalty_stamps ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.loyalty_stamps (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id    uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  client_id        uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  card_id          uuid NOT NULL REFERENCES public.loyalty_cards(id) ON DELETE CASCADE,
  appointment_id   uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  payment_id       uuid REFERENCES public.payments(id) ON DELETE SET NULL,
  barber_id        uuid REFERENCES public.barbers(id) ON DELETE SET NULL,
  service_id       uuid REFERENCES public.services(id) ON DELETE SET NULL,
  -- stamp_type: stamp_added, reward_unlocked, reward_redeemed, manual_add, manual_remove
  stamp_type       text NOT NULL DEFAULT 'stamp_added'
                     CHECK (stamp_type IN (
                       'stamp_added','reward_unlocked','reward_redeemed',
                       'manual_add','manual_remove'
                     )),
  stamps_delta     int  NOT NULL DEFAULT 1,  -- positivo = añadir, negativo = quitar
  note             text,
  created_by       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Columnas nuevas en loyalty_stamps (si la tabla ya existía con el schema anterior)
ALTER TABLE public.loyalty_stamps
  ADD COLUMN IF NOT EXISTS payment_id    uuid REFERENCES public.payments(id)  ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS barber_id     uuid REFERENCES public.barbers(id)   ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS service_id    uuid REFERENCES public.services(id)  ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS stamp_type    text NOT NULL DEFAULT 'stamp_added',
  ADD COLUMN IF NOT EXISTS stamps_delta  int  NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS note          text,
  ADD COLUMN IF NOT EXISTS created_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Añadir CHECK constraint en stamp_type si no existe
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'loyalty_stamps_stamp_type_check'
  ) THEN
    ALTER TABLE public.loyalty_stamps
      ADD CONSTRAINT loyalty_stamps_stamp_type_check
      CHECK (stamp_type IN ('stamp_added','reward_unlocked','reward_redeemed','manual_add','manual_remove'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_loyalty_stamps_barbershop
  ON public.loyalty_stamps(barbershop_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_loyalty_stamps_client
  ON public.loyalty_stamps(client_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_loyalty_stamps_card
  ON public.loyalty_stamps(card_id);
-- Evitar doble sello por la misma cita
CREATE UNIQUE INDEX IF NOT EXISTS idx_loyalty_stamps_appointment_unique
  ON public.loyalty_stamps(appointment_id)
  WHERE appointment_id IS NOT NULL AND stamp_type = 'stamp_added';
-- Evitar doble sello por el mismo pago
CREATE UNIQUE INDEX IF NOT EXISTS idx_loyalty_stamps_payment_unique
  ON public.loyalty_stamps(payment_id)
  WHERE payment_id IS NOT NULL AND stamp_type = 'stamp_added';

-- ── 4. Token público para vista de cliente ────────────────────────────────────
-- Añadimos loyalty_token a clients si no existe

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS loyalty_token uuid DEFAULT gen_random_uuid() UNIQUE;

-- Rellenar tokens a los clientes existentes que no tengan
UPDATE public.clients
  SET loyalty_token = gen_random_uuid()
  WHERE loyalty_token IS NULL;

-- ── 5. RLS ───────────────────────────────────────────────────────────────────

ALTER TABLE public.loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_cards    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_stamps   ENABLE ROW LEVEL SECURITY;

-- loyalty_programs: solo la barbería propietaria
DROP POLICY IF EXISTS "loyalty_programs_tenant_isolation" ON public.loyalty_programs;
CREATE POLICY "loyalty_programs_tenant_isolation"
  ON public.loyalty_programs
  FOR ALL
  USING (
    barbershop_id IN (
      SELECT barbershop_id FROM public.barbershop_members
       WHERE user_id = auth.uid()
    )
  );

-- loyalty_cards: solo la barbería propietaria
DROP POLICY IF EXISTS "loyalty_cards_tenant_isolation" ON public.loyalty_cards;
CREATE POLICY "loyalty_cards_tenant_isolation"
  ON public.loyalty_cards
  FOR ALL
  USING (
    barbershop_id IN (
      SELECT barbershop_id FROM public.barbershop_members
       WHERE user_id = auth.uid()
    )
  );

-- loyalty_stamps: solo la barbería propietaria
DROP POLICY IF EXISTS "loyalty_stamps_tenant_isolation" ON public.loyalty_stamps;
CREATE POLICY "loyalty_stamps_tenant_isolation"
  ON public.loyalty_stamps
  FOR ALL
  USING (
    barbershop_id IN (
      SELECT barbershop_id FROM public.barbershop_members
       WHERE user_id = auth.uid()
    )
  );

-- ── 6. Función helper: obtener o crear tarjeta activa ─────────────────────────

CREATE OR REPLACE FUNCTION public.get_or_create_loyalty_card(
  p_barbershop_id  uuid,
  p_client_id      uuid,
  p_program_id     uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_card_id uuid;
BEGIN
  -- Buscar tarjeta activa existente
  SELECT id INTO v_card_id
    FROM public.loyalty_cards
   WHERE barbershop_id = p_barbershop_id
     AND client_id     = p_client_id
     AND program_id    = p_program_id
     AND status        = 'active'
   LIMIT 1;

  -- Si no existe, crear una nueva
  IF v_card_id IS NULL THEN
    INSERT INTO public.loyalty_cards (barbershop_id, client_id, program_id, status)
    VALUES (p_barbershop_id, p_client_id, p_program_id, 'active')
    RETURNING id INTO v_card_id;
  END IF;

  RETURN v_card_id;
END;
$$;

-- ── 7. Función core: añadir sello ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.loyalty_add_stamp(
  p_barbershop_id   uuid,
  p_client_id       uuid,
  p_appointment_id  uuid DEFAULT NULL,
  p_payment_id      uuid DEFAULT NULL,
  p_barber_id       uuid DEFAULT NULL,
  p_service_id      uuid DEFAULT NULL,
  p_note            text DEFAULT NULL,
  p_created_by      uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_program     record;
  v_card_id     uuid;
  v_new_stamps  int;
  v_completed   boolean := false;
  v_stamp_id    uuid;
BEGIN
  -- Obtener programa activo
  SELECT id, stamps_required, reward_title, max_stamps_per_day
    INTO v_program
    FROM public.loyalty_programs
   WHERE barbershop_id = p_barbershop_id
     AND is_active = true
   ORDER BY created_at DESC
   LIMIT 1;

  IF v_program IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'no_active_program');
  END IF;

  -- Control: máximo 1 sello por cliente por día
  IF v_program.max_stamps_per_day IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.loyalty_stamps s
        JOIN public.loyalty_cards c ON c.id = s.card_id
       WHERE s.client_id     = p_client_id
         AND s.barbershop_id = p_barbershop_id
         AND s.stamp_type    = 'stamp_added'
         AND s.created_at   >= date_trunc('day', now())
    ) THEN
      RETURN jsonb_build_object('ok', false, 'reason', 'max_stamps_per_day_reached');
    END IF;
  END IF;

  -- Obtener o crear tarjeta activa
  v_card_id := public.get_or_create_loyalty_card(p_barbershop_id, p_client_id, v_program.id);

  -- Insertar sello (el índice único evita duplicados por cita/pago)
  BEGIN
    INSERT INTO public.loyalty_stamps (
      barbershop_id, client_id, card_id, appointment_id, payment_id,
      barber_id, service_id, stamp_type, stamps_delta, note, created_by
    ) VALUES (
      p_barbershop_id, p_client_id, v_card_id, p_appointment_id, p_payment_id,
      p_barber_id, p_service_id, 'stamp_added', 1, p_note, p_created_by
    )
    RETURNING id INTO v_stamp_id;
  EXCEPTION WHEN unique_violation THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'already_stamped');
  END;

  -- Actualizar contador en la tarjeta
  UPDATE public.loyalty_cards
     SET current_stamps = current_stamps + 1,
         updated_at     = now()
   WHERE id = v_card_id
  RETURNING current_stamps INTO v_new_stamps;

  -- Verificar si alcanzó la recompensa
  IF v_new_stamps >= v_program.stamps_required THEN
    v_completed := true;
    UPDATE public.loyalty_cards
       SET status       = 'completed',
           completed_at = now(),
           updated_at   = now()
     WHERE id = v_card_id;

    -- Registrar evento reward_unlocked
    INSERT INTO public.loyalty_stamps (
      barbershop_id, client_id, card_id, stamp_type, stamps_delta, note, created_by
    ) VALUES (
      p_barbershop_id, p_client_id, v_card_id,
      'reward_unlocked', 0, 'Recompensa desbloqueada automáticamente', p_created_by
    );
  END IF;

  RETURN jsonb_build_object(
    'ok',              true,
    'card_id',         v_card_id,
    'stamp_id',        v_stamp_id,
    'current_stamps',  v_new_stamps,
    'stamps_required', v_program.stamps_required,
    'reward_unlocked', v_completed,
    'reward_title',    v_program.reward_title
  );
END;
$$;

-- ── 8. Trigger: auto-sello cuando cita → completed ────────────────────────────

CREATE OR REPLACE FUNCTION public.loyalty_on_appointment_completed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Solo actuar cuando el status cambia a 'completed'
  IF NEW.status = 'completed' AND OLD.status <> 'completed' THEN
    -- Solo si el cliente está asignado
    IF NEW.client_id IS NOT NULL THEN
      PERFORM public.loyalty_add_stamp(
        p_barbershop_id  => NEW.barbershop_id,
        p_client_id      => NEW.client_id,
        p_appointment_id => NEW.id,
        p_barber_id      => NEW.barber_id,
        p_service_id     => NEW.service_id,
        p_note           => 'Sello automático por cita completada'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_loyalty_appointment_completed ON public.appointments;
CREATE TRIGGER trg_loyalty_appointment_completed
  AFTER UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.loyalty_on_appointment_completed();

-- ── 9. Función: canjear recompensa ────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.loyalty_redeem_reward(
  p_card_id    uuid,
  p_created_by uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_card    record;
  v_program record;
BEGIN
  SELECT c.*, c.program_id
    INTO v_card
    FROM public.loyalty_cards c
   WHERE c.id = p_card_id
     AND c.status = 'completed';

  IF v_card IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'card_not_found_or_not_completed');
  END IF;

  SELECT id, reward_title INTO v_program
    FROM public.loyalty_programs WHERE id = v_card.program_id;

  -- Marcar tarjeta como canjeada
  UPDATE public.loyalty_cards
     SET status       = 'redeemed',
         redeemed_at  = now(),
         redeemed_count = redeemed_count + 1,
         updated_at   = now()
   WHERE id = p_card_id;

  -- Registrar evento
  INSERT INTO public.loyalty_stamps (
    barbershop_id, client_id, card_id, stamp_type, stamps_delta, note, created_by
  ) VALUES (
    v_card.barbershop_id, v_card.client_id, p_card_id,
    'reward_redeemed', 0,
    concat('Recompensa canjeada: ', v_program.reward_title),
    p_created_by
  );

  -- Crear nueva tarjeta activa para seguir acumulando
  INSERT INTO public.loyalty_cards (
    barbershop_id, client_id, program_id, status, current_stamps
  ) VALUES (
    v_card.barbershop_id, v_card.client_id, v_card.program_id, 'active', 0
  );

  RETURN jsonb_build_object(
    'ok',           true,
    'reward_title', v_program.reward_title,
    'message',      'Recompensa canjeada. Nueva tarjeta iniciada.'
  );
END;
$$;

-- ── 10. updated_at automático ─────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
     WHERE tgname = 'trg_loyalty_programs_updated_at'
  ) THEN
    CREATE TRIGGER trg_loyalty_programs_updated_at
      BEFORE UPDATE ON public.loyalty_programs
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
     WHERE tgname = 'trg_loyalty_cards_updated_at'
  ) THEN
    CREATE TRIGGER trg_loyalty_cards_updated_at
      BEFORE UPDATE ON public.loyalty_cards
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- ── 11. Vista útil para dashboard ─────────────────────────────────────────────

CREATE OR REPLACE VIEW public.loyalty_card_summary AS
SELECT
  lc.id,
  lc.barbershop_id,
  lc.client_id,
  lc.program_id,
  lc.current_stamps,
  lc.redeemed_count,
  lc.status,
  lc.started_at,
  lc.completed_at,
  lc.redeemed_at,
  c.name        AS client_name,
  c.phone       AS client_phone,
  c.last_visit_at,
  c.loyalty_token,
  lp.stamps_required,
  lp.reward_title,
  lp.name       AS program_name,
  ROUND((lc.current_stamps::numeric / lp.stamps_required) * 100) AS progress_pct
FROM public.loyalty_cards lc
JOIN public.clients         c  ON c.id  = lc.client_id
JOIN public.loyalty_programs lp ON lp.id = lc.program_id;
