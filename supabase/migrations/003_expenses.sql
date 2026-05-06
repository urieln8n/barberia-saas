-- BarberíaOS — Módulo Finanzas
-- Migración: 003_expenses.sql
-- EJECUTAR en Supabase SQL Editor ANTES de usar /dashboard/finanzas

CREATE TABLE IF NOT EXISTS public.expenses (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  amount        numeric(10,2) NOT NULL,
  category      text NOT NULL CHECK (category IN (
                  'alquiler','productos','herramientas','marketing','nomina','otros'
                )),
  description   text,
  expense_date  date NOT NULL DEFAULT current_date,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expenses_barbershop_date
  ON public.expenses(barbershop_id, expense_date);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can manage expenses" ON public.expenses;
CREATE POLICY "Members can manage expenses" ON public.expenses
  FOR ALL
  USING (public.is_barbershop_member(barbershop_id))
  WITH CHECK (public.is_barbershop_member(barbershop_id));
