-- ============================================================
-- Migración 047: Fix autorización en funciones RPC de Studio IA
-- y endurecer policies de storage.objects (bucket barberiaos-media)
-- ============================================================
--
-- PROBLEMA 1 (Crítico — cross-tenant write/forge):
-- Las funciones SECURITY DEFINER creadas en 20260605_studio_ia_tables.sql,
-- 039_studio_reel_jobs.sql y 20260609_studio_video_jobs.sql no verifican
-- que el usuario autenticado (auth.uid()) pertenezca a la barbería
-- (p_barbershop_id) o sea propietaria del job (p_job_id) que están
-- modificando. Como son SECURITY DEFINER y Postgres/PostgREST otorga
-- EXECUTE a PUBLIC por defecto, cualquier usuario autenticado puede
-- llamarlas directamente vía /rest/v1/rpc/<function> con un
-- barbershop_id o job_id ajeno y:
--   - drenar/manipular los créditos de Studio IA de OTRA barbería
--     (deduct_studio_credit)
--   - forjar el resultado de un job de vídeo/reel de OTRA barbería,
--     inyectando una final_url/video_url arbitraria
--     (complete_studio_video_job / complete_studio_reel_job)
--   - marcar como fallido/reencolar jobs de OTRA barbería
--     (fail_studio_video_job / fail_studio_reel_job)
--
-- FIX: añadir guardas de autorización dentro de cada función,
-- siguiendo el mismo patrón ya usado correctamente en
-- 015_inventory_v2.sql (sell_inventory_product / is_barbershop_member).
-- No se cambia la firma de ninguna función ni su lógica de negocio,
-- por lo que el código de app/ que las invoca sigue funcionando igual
-- para usuarios legítimos; solo se bloquean llamadas cross-tenant.
--
-- grant_monthly_studio_credits() no recibe parámetros (opera sobre
-- TODAS las wallets) y está pensada para ejecutarse vía cron/servicio,
-- no desde el cliente. Se revoca EXECUTE de authenticated/anon para
-- que solo se pueda invocar con el service_role (igual que ya ocurre
-- de facto con cron jobs en este proyecto, ver app/api/internal/cron-*).
--
-- PROBLEMA 2 (Medio — cross-tenant storage write):
-- Las policies de storage.objects para el bucket 'barberiaos-media'
-- (migración 037) permiten UPDATE/DELETE a cualquier usuario
-- autenticado sobre CUALQUIER objeto del bucket, sin comprobar que
-- el objeto pertenezca a su propia barbería. El INSERT original ya
-- no se modifica (sigue permitiendo subir objetos nuevos), pero se
-- añade verificación de "carpeta = barbershop_id propio" en
-- UPDATE/DELETE para impedir que un usuario borre o sobrescriba
-- fotos de otra barbería. Asume convención de path "<barbershop_id>/...",
-- igual que ya usa mirrorVideoToStorage() en el bucket studio-videos.
--
-- No destructivo: no borra datos, no reescribe policies que ya
-- funcionan correctamente, solo añade chequeos de autorización.
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- FIX 1a — deduct_studio_credit: exigir membership de la barbería
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.deduct_studio_credit(
  p_barbershop_id UUID,
  p_description TEXT DEFAULT 'Contenido generado'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current INTEGER;
BEGIN
  IF NOT public.is_barbershop_member(p_barbershop_id) THEN
    RAISE EXCEPTION 'No autorizado para esta barbería';
  END IF;

  SELECT current_credits INTO v_current
    FROM studio_credit_wallets
   WHERE barbershop_id = p_barbershop_id
     FOR UPDATE;

  IF v_current IS NULL OR v_current < 1 THEN
    RETURN FALSE;
  END IF;

  UPDATE studio_credit_wallets
     SET current_credits = current_credits - 1,
         updated_at      = now()
   WHERE barbershop_id = p_barbershop_id;

  INSERT INTO studio_credit_transactions (barbershop_id, type, credits, description)
  VALUES (p_barbershop_id, 'usage', -1, p_description);

  RETURN TRUE;
END;
$$;


-- ─────────────────────────────────────────────────────────────
-- FIX 1b — grant_monthly_studio_credits: solo service_role (cron)
-- No recibe p_barbershop_id (opera sobre todas las wallets), así que
-- no se le puede añadir un chequeo de membership; se restringe el
-- EXECUTE en su lugar.
-- ─────────────────────────────────────────────────────────────
REVOKE EXECUTE ON FUNCTION public.grant_monthly_studio_credits() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.grant_monthly_studio_credits() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.grant_monthly_studio_credits() FROM anon;
-- service_role conserva acceso (no se ve afectado por estos REVOKE).


-- ─────────────────────────────────────────────────────────────
-- FIX 1c — complete_studio_video_job / fail_studio_video_job:
-- exigir que el job pertenezca a una barbería del usuario.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.complete_studio_video_job(
  p_job_id         UUID,
  p_video_url      TEXT,
  p_thumbnail_url  TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_barbershop_id UUID;
BEGIN
  SELECT barbershop_id INTO v_barbershop_id
    FROM studio_video_jobs
   WHERE id = p_job_id;

  IF v_barbershop_id IS NULL THEN
    RAISE EXCEPTION 'Job no encontrado';
  END IF;

  IF NOT public.is_barbershop_member(v_barbershop_id) THEN
    RAISE EXCEPTION 'No autorizado para este job';
  END IF;

  UPDATE studio_video_jobs
     SET status           = 'completed',
         output_video_url = p_video_url,
         thumbnail_url    = p_thumbnail_url,
         completed_at     = now()
   WHERE id = p_job_id
     AND status != 'completed';
END;
$$;

CREATE OR REPLACE FUNCTION public.fail_studio_video_job(
  p_job_id    UUID,
  p_error     TEXT,
  p_requeue   BOOLEAN DEFAULT FALSE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_barbershop_id UUID;
BEGIN
  SELECT barbershop_id INTO v_barbershop_id
    FROM studio_video_jobs
   WHERE id = p_job_id;

  IF v_barbershop_id IS NULL THEN
    RAISE EXCEPTION 'Job no encontrado';
  END IF;

  IF NOT public.is_barbershop_member(v_barbershop_id) THEN
    RAISE EXCEPTION 'No autorizado para este job';
  END IF;

  UPDATE studio_video_jobs
     SET status       = CASE WHEN p_requeue THEN 'pending' ELSE 'failed' END,
         error_msg    = p_error,
         retry_count  = retry_count + 1,
         completed_at = CASE WHEN p_requeue THEN NULL ELSE now() END
   WHERE id = p_job_id
     AND status NOT IN ('completed', 'failed');
END;
$$;


-- ─────────────────────────────────────────────────────────────
-- FIX 1d — complete_studio_reel_job / fail_studio_reel_job:
-- mismo chequeo que en 1c, sobre studio_reel_jobs.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.complete_studio_reel_job(
  p_job_id        UUID,
  p_final_url     TEXT,
  p_thumbnail_url TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_barbershop_id UUID;
BEGIN
  SELECT barbershop_id INTO v_barbershop_id
    FROM studio_reel_jobs
   WHERE id = p_job_id;

  IF v_barbershop_id IS NULL THEN
    RAISE EXCEPTION 'Job no encontrado';
  END IF;

  IF NOT public.is_barbershop_member(v_barbershop_id) THEN
    RAISE EXCEPTION 'No autorizado para este job';
  END IF;

  UPDATE studio_reel_jobs
     SET status        = 'completed',
         final_url     = p_final_url,
         thumbnail_url = p_thumbnail_url,
         completed_at  = now()
   WHERE id = p_job_id
     AND status != 'completed';
END;
$$;

CREATE OR REPLACE FUNCTION public.fail_studio_reel_job(
  p_job_id UUID,
  p_error  TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_barbershop_id UUID;
BEGIN
  SELECT barbershop_id INTO v_barbershop_id
    FROM studio_reel_jobs
   WHERE id = p_job_id;

  IF v_barbershop_id IS NULL THEN
    RAISE EXCEPTION 'Job no encontrado';
  END IF;

  IF NOT public.is_barbershop_member(v_barbershop_id) THEN
    RAISE EXCEPTION 'No autorizado para este job';
  END IF;

  UPDATE studio_reel_jobs
     SET status       = 'failed',
         error_msg    = p_error,
         completed_at = now()
   WHERE id = p_job_id
     AND status NOT IN ('completed', 'failed');
END;
$$;


-- ─────────────────────────────────────────────────────────────
-- FIX 2 — storage.objects (bucket barberiaos-media): impedir que
-- un usuario autenticado modifique/borre objetos de OTRA barbería.
--
-- Convención de path REAL usada por la app (ver app/dashboard/servicios
-- /actions.ts y app/dashboard/barberos/actions.ts):
--   "<recurso>/<barbershop_id>/<id>.ext"   ej: "services/<uuid>/<id>.jpg"
-- es decir, el barbershop_id es el SEGUNDO segmento del path, no el
-- primero. (storage.foldername(name))[2] = segundo segmento.
--
-- Si algún objeto no sigue esta convención (ej. nombre legacy o sin
-- subcarpetas), la función auxiliar devuelve NULL y is_barbershop_member
-- evalúa a false, negando UPDATE/DELETE de forma segura (fail-closed)
-- en vez de lanzar error. No se borra ni modifica ningún objeto
-- existente con este cambio.
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public._barberiaos_media_owner_id(object_name text)
RETURNS uuid
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN (storage.foldername(object_name))[2] ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
    THEN ((storage.foldername(object_name))[2])::uuid
    ELSE NULL
  END;
$$;

DROP POLICY IF EXISTS "Authenticated update barberiaos-media" ON storage.objects;
CREATE POLICY "Authenticated update own barbershop media"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'barberiaos-media'
  AND public.is_barbershop_member(public._barberiaos_media_owner_id(name))
);

DROP POLICY IF EXISTS "Authenticated delete barberiaos-media" ON storage.objects;
CREATE POLICY "Authenticated delete own barbershop media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'barberiaos-media'
  AND public.is_barbershop_member(public._barberiaos_media_owner_id(name))
);

-- ============================================================
-- END OF MIGRATION
-- ============================================================
