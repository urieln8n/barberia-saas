-- ================================================================
-- BarberíaOS — Créditos de prueba Studio IA
-- Usuario objetivo: fa.andres18@hotmail.com
-- Seguro: opera únicamente sobre el barbershop de ese usuario.
-- ================================================================
-- INSTRUCCIONES:
--   1. Abre Supabase Dashboard → SQL Editor
--   2. Pega TODO este script y pulsa "Run"
--   3. Lee los NOTICE y el SELECT final para validar
-- ================================================================


-- ── PASO 1: Auditoría del estado actual ──────────────────────────────────────
SELECT
  au.id                AS user_id,
  au.email             AS email,
  b.id                 AS barbershop_id,
  b.name               AS barbershop_name,
  COALESCE(scw.current_credits, -1)  AS current_credits_antes,
  COALESCE(scw.monthly_credits,  0)  AS monthly_credits,
  COALESCE(scw.extra_credits,    0)  AS extra_credits_antes,
  scw.updated_at       AS wallet_updated_at
FROM auth.users au
JOIN barbershops b ON b.owner_id = au.id
LEFT JOIN studio_credit_wallets scw ON scw.barbershop_id = b.id
WHERE au.email = 'fa.andres18@hotmail.com';


-- ── PASO 2: Añadir 100 créditos (atómico, solo a este usuario) ───────────────
DO $$
DECLARE
  v_user_id        UUID;
  v_barbershop_id  UUID;
  v_old_credits    INTEGER;
  v_added          CONSTANT INTEGER := 100;
BEGIN
  -- 1. Localizar usuario
  SELECT id INTO v_user_id
    FROM auth.users
   WHERE email = 'fa.andres18@hotmail.com';

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'FAIL: usuario fa.andres18@hotmail.com no encontrado en auth.users';
  END IF;

  -- 2. Localizar barbershop
  SELECT id INTO v_barbershop_id
    FROM barbershops
   WHERE owner_id = v_user_id;

  IF v_barbershop_id IS NULL THEN
    RAISE EXCEPTION 'FAIL: no hay barbershop asociado al usuario %', v_user_id;
  END IF;

  -- 3. Leer saldo actual (FOR UPDATE previene condición de carrera)
  SELECT current_credits INTO v_old_credits
    FROM studio_credit_wallets
   WHERE barbershop_id = v_barbershop_id
     FOR UPDATE;

  IF v_old_credits IS NULL THEN
    -- Wallet no existe aún → crear con 100 créditos
    INSERT INTO studio_credit_wallets
      (barbershop_id, current_credits, monthly_credits, extra_credits)
    VALUES
      (v_barbershop_id, v_added, 5, v_added);
    v_old_credits := 0;
    RAISE NOTICE 'INFO: wallet creado para barbershop %', v_barbershop_id;
  ELSE
    -- Wallet existe → sumar 100 créditos
    UPDATE studio_credit_wallets
       SET current_credits = current_credits + v_added,
           extra_credits   = extra_credits   + v_added,
           updated_at      = now()
     WHERE barbershop_id = v_barbershop_id;
  END IF;

  -- 4. Registrar en historial (tipo admin_adjustment para distinguirlo de compras/mensuales)
  INSERT INTO studio_credit_transactions
    (barbershop_id, type, credits, description)
  VALUES
    (v_barbershop_id,
     'admin_adjustment',
     v_added,
     'Créditos de prueba Fase A — desarrollo Studio IA (fa.andres18@hotmail.com)');

  -- 5. Informe de resultado
  RAISE NOTICE '=== RESULTADO ===';
  RAISE NOTICE 'Usuario        : fa.andres18@hotmail.com  (id: %)', v_user_id;
  RAISE NOTICE 'Barbershop     : %', v_barbershop_id;
  RAISE NOTICE 'Saldo anterior : % créditos', v_old_credits;
  RAISE NOTICE 'Añadidos       : % créditos (admin_adjustment)', v_added;
  RAISE NOTICE 'Saldo final    : % créditos', v_old_credits + v_added;

END;
$$;


-- ── PASO 3: Verificación final del wallet ────────────────────────────────────
SELECT
  scw.current_credits                              AS saldo_final,
  scw.monthly_credits                              AS creditos_mensuales,
  scw.extra_credits                                AS creditos_extra,
  scw.updated_at                                   AS actualizado_en
FROM auth.users au
JOIN barbershops b ON b.owner_id = au.id
JOIN studio_credit_wallets scw ON scw.barbershop_id = b.id
WHERE au.email = 'fa.andres18@hotmail.com';


-- ── PASO 4: Últimas 5 transacciones ─────────────────────────────────────────
SELECT
  type,
  credits,
  description,
  created_at
FROM studio_credit_transactions
WHERE barbershop_id = (
  SELECT b.id
    FROM auth.users au
    JOIN barbershops b ON b.owner_id = au.id
   WHERE au.email = 'fa.andres18@hotmail.com'
)
ORDER BY created_at DESC
LIMIT 5;
