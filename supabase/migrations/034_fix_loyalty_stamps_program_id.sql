-- ============================================================
-- Migración 034: Fix loyalty_stamps.program_id NOT NULL
-- ============================================================
-- Problema: tabla loyalty_stamps tenía program_id NOT NULL de una versión
-- anterior. loyalty_add_stamp() no incluía program_id en el INSERT → crash.
-- Solución doble:
--   1. Quitar NOT NULL de program_id (si existe la columna)
--   2. Reemplazar loyalty_add_stamp() para incluir program_id en inserts
-- ============================================================

-- ── 1. Hacer program_id nullable si existe con NOT NULL ───────────────────────

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name   = 'loyalty_stamps'
       AND column_name  = 'program_id'
  ) THEN
    ALTER TABLE public.loyalty_stamps
      ALTER COLUMN program_id DROP NOT NULL;
  ELSE
    -- Si no existía, añadirla como nullable para consistencia futura
    ALTER TABLE public.loyalty_stamps
      ADD COLUMN IF NOT EXISTS program_id uuid REFERENCES public.loyalty_programs(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ── 2. Reemplazar loyalty_add_stamp incluyendo program_id en inserts ──────────

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

  -- Insertar sello — incluye program_id para compatibilidad con schemas anteriores
  BEGIN
    INSERT INTO public.loyalty_stamps (
      barbershop_id, client_id, card_id, program_id,
      appointment_id, payment_id, barber_id, service_id,
      stamp_type, stamps_delta, note, created_by
    ) VALUES (
      p_barbershop_id, p_client_id, v_card_id, v_program.id,
      p_appointment_id, p_payment_id, p_barber_id, p_service_id,
      'stamp_added', 1, p_note, p_created_by
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

    INSERT INTO public.loyalty_stamps (
      barbershop_id, client_id, card_id, program_id,
      stamp_type, stamps_delta, note, created_by
    ) VALUES (
      p_barbershop_id, p_client_id, v_card_id, v_program.id,
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
