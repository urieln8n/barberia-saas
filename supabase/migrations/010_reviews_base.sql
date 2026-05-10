-- Reviews base module for BarberiaOS.

ALTER TABLE public.barbershops
  ADD COLUMN IF NOT EXISTS google_review_url text;

CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  public_token uuid NOT NULL DEFAULT gen_random_uuid(),
  rating int CHECK (rating BETWEEN 1 AND 5),
  comment text,
  source text NOT NULL DEFAULT 'manual_link',
  is_public boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','google_redirect_ready','private_feedback','archived')),
  respuesta_sugerida text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (public_token)
);

CREATE INDEX IF NOT EXISTS idx_reviews_business_created
  ON public.reviews(business_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_booking_id
  ON public.reviews(booking_id);

CREATE INDEX IF NOT EXISTS idx_reviews_customer_id
  ON public.reviews(customer_id);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can manage reviews" ON public.reviews;
CREATE POLICY "Members can manage reviews" ON public.reviews
FOR ALL USING (public.is_barbershop_member(business_id))
WITH CHECK (public.is_barbershop_member(business_id));
