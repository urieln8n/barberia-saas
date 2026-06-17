-- ============================================================
-- Migración 048: Unificar acceso de staff (no-owner) en módulos
-- que solo permitían al owner — lounge, fidelización, créditos
-- de Studio IA y lista de espera.
-- ============================================================
--
-- PROBLEMA (Bajo riesgo — inconsistencia de producto, fail-closed):
-- Las policies RLS de las tablas lounge_*, loyalty_*, studio_credit_*,
-- studio_contents, studio_reel_jobs, studio_video_jobs y
-- waitlist_entries comprueban pertenencia de dos formas distintas
-- e inconsistentes con el resto del esquema:
--
--   a) lounge_settings / lounge_promotions / lounge_interactions
--      (031_lounge_module.sql) comprueban directamente
--      "barbershop_members bm WHERE bm.user_id = auth.uid()"
--      — sin el fallback a barbershops.owner_id que sí tiene el
--      helper canónico is_barbershop_member().
--
--   b) loyalty_programs / loyalty_cards / loyalty_stamps
--      (033_loyalty_module.sql) usan
--      "barbershop_id IN (SELECT barbershop_id FROM barbershop_members
--       WHERE user_id = auth.uid())" — mismo problema que (a).
--
--   c) studio_credit_wallets / studio_credit_transactions /
--      studio_contents (20260605_studio_ia_tables.sql),
--      studio_reel_jobs (039_studio_reel_jobs.sql),
--      studio_video_jobs (20260609_studio_video_jobs.sql) y
--      waitlist_entries (042_waitlist.sql) usan
--      "barbershop_id IN (SELECT id FROM barbershops WHERE
--       owner_id = auth.uid())" — el inverso: solo el owner,
--      ignorando a los miembros en barbershop_members que no son
--      owner.
--
-- En appointments, clients, services, etc. (ver 001_initial_schema.sql
-- y 004_fix_rls_members.sql) se usa el helper canónico
-- is_barbershop_member(barbershop_id), que cubre AMBOS casos:
--   - el usuario está en barbershop_members para esa barbería, O
--   - el usuario es barbershops.owner_id de esa barbería.
--
-- Efecto actual: un miembro del staff (en barbershop_members pero
-- no owner) puede gestionar citas/clientes/servicios pero NO puede
-- gestionar el lounge, fidelización, créditos de Studio IA, ni la
-- lista de espera. Es una restricción más estricta de lo debido
-- (fail-closed), no una fuga de datos cross-tenant — pero es una
-- inconsistencia de producto que bloquea a empleados legítimos.
--
-- FIX: reemplazar esas policies para usar is_barbershop_member(...)
-- en vez de la comprobación directa a barbershop_members u owner_id.
-- No se toca ninguna otra tabla/policy que ya use el patrón correcto
-- (appointments, clients, services, lounge_*_public_read,
-- *_public_insert, studio_credit_packs "Anyone can read active packs").
--
-- No destructivo: solo DROP POLICY IF EXISTS + CREATE POLICY con el
-- mismo nombre (o nombre equivalente cuando el original no tenía
-- comillas), igual que hizo la migración 047 para storage.objects.
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- FIX A — lounge_settings / lounge_promotions / lounge_interactions
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "lounge_settings_owner_all" ON public.lounge_settings;
CREATE POLICY "lounge_settings_owner_all"
  ON public.lounge_settings
  FOR ALL
  USING (public.is_barbershop_member(lounge_settings.barbershop_id))
  WITH CHECK (public.is_barbershop_member(lounge_settings.barbershop_id));

DROP POLICY IF EXISTS "lounge_promotions_owner_all" ON public.lounge_promotions;
CREATE POLICY "lounge_promotions_owner_all"
  ON public.lounge_promotions
  FOR ALL
  USING (public.is_barbershop_member(lounge_promotions.barbershop_id))
  WITH CHECK (public.is_barbershop_member(lounge_promotions.barbershop_id));

DROP POLICY IF EXISTS "lounge_interactions_owner_select" ON public.lounge_interactions;
CREATE POLICY "lounge_interactions_owner_select"
  ON public.lounge_interactions
  FOR SELECT
  USING (public.is_barbershop_member(lounge_interactions.barbershop_id));

-- lounge_settings_public_read, lounge_promotions_public_read y
-- lounge_interactions_public_insert NO se tocan: ya son correctas
-- (acceso público de solo lectura/inserción, sin relación con staff).


-- ─────────────────────────────────────────────────────────────
-- FIX B — loyalty_programs / loyalty_cards / loyalty_stamps
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "loyalty_programs_tenant_isolation" ON public.loyalty_programs;
CREATE POLICY "loyalty_programs_tenant_isolation"
  ON public.loyalty_programs
  FOR ALL
  USING (public.is_barbershop_member(loyalty_programs.barbershop_id))
  WITH CHECK (public.is_barbershop_member(loyalty_programs.barbershop_id));

DROP POLICY IF EXISTS "loyalty_cards_tenant_isolation" ON public.loyalty_cards;
CREATE POLICY "loyalty_cards_tenant_isolation"
  ON public.loyalty_cards
  FOR ALL
  USING (public.is_barbershop_member(loyalty_cards.barbershop_id))
  WITH CHECK (public.is_barbershop_member(loyalty_cards.barbershop_id));

DROP POLICY IF EXISTS "loyalty_stamps_tenant_isolation" ON public.loyalty_stamps;
CREATE POLICY "loyalty_stamps_tenant_isolation"
  ON public.loyalty_stamps
  FOR ALL
  USING (public.is_barbershop_member(loyalty_stamps.barbershop_id))
  WITH CHECK (public.is_barbershop_member(loyalty_stamps.barbershop_id));


-- ─────────────────────────────────────────────────────────────
-- FIX C — Studio IA: wallets, transacciones y contenido generado
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Owner can manage own wallet" ON public.studio_credit_wallets;
CREATE POLICY "Owner can manage own wallet"
  ON public.studio_credit_wallets
  FOR ALL
  USING (public.is_barbershop_member(studio_credit_wallets.barbershop_id))
  WITH CHECK (public.is_barbershop_member(studio_credit_wallets.barbershop_id));

DROP POLICY IF EXISTS "Owner can view own transactions" ON public.studio_credit_transactions;
CREATE POLICY "Owner can view own transactions"
  ON public.studio_credit_transactions
  FOR SELECT
  USING (public.is_barbershop_member(studio_credit_transactions.barbershop_id));

DROP POLICY IF EXISTS "Owner can manage own content" ON public.studio_contents;
CREATE POLICY "Owner can manage own content"
  ON public.studio_contents
  FOR ALL
  USING (public.is_barbershop_member(studio_contents.barbershop_id))
  WITH CHECK (public.is_barbershop_member(studio_contents.barbershop_id));

-- "Anyone can read active packs" (studio_credit_packs) NO se toca:
-- es un catálogo global de solo lectura pública, sin relación con staff.


-- ─────────────────────────────────────────────────────────────
-- FIX D — Studio IA: jobs de reel y vídeo
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Owner can manage own reel jobs" ON public.studio_reel_jobs;
CREATE POLICY "Owner can manage own reel jobs"
  ON public.studio_reel_jobs
  FOR ALL
  USING (public.is_barbershop_member(studio_reel_jobs.barbershop_id))
  WITH CHECK (public.is_barbershop_member(studio_reel_jobs.barbershop_id));

DROP POLICY IF EXISTS "Owner can manage own video jobs" ON public.studio_video_jobs;
CREATE POLICY "Owner can manage own video jobs"
  ON public.studio_video_jobs
  FOR ALL
  USING (public.is_barbershop_member(studio_video_jobs.barbershop_id))
  WITH CHECK (public.is_barbershop_member(studio_video_jobs.barbershop_id));


-- ─────────────────────────────────────────────────────────────
-- FIX E — waitlist_entries
-- ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Members can manage waitlist" ON public.waitlist_entries;
CREATE POLICY "Members can manage waitlist"
  ON public.waitlist_entries
  FOR ALL
  USING (public.is_barbershop_member(waitlist_entries.barbershop_id))
  WITH CHECK (public.is_barbershop_member(waitlist_entries.barbershop_id));

-- "Public can join waitlist" (INSERT público con WITH CHECK (true))
-- NO se toca: es el formulario público de apuntarse a la lista,
-- sin relación con staff.

-- ============================================================
-- END OF MIGRATION
-- ============================================================
