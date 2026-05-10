-- CRM fields and customer timeline support for BarberiaOS.

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS preferences text,
  ADD COLUMN IF NOT EXISTS favorite_barber_id uuid REFERENCES public.barbers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS last_service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS visit_count int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS next_recommended_visit_at timestamptz,
  ADD COLUMN IF NOT EXISTS no_show_count int NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.recalculate_client_crm(
  p_client_id uuid,
  p_barbershop_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_visit_at timestamptz;
  v_last_service_id uuid;
  v_favorite_barber_id uuid;
  v_visit_count int := 0;
  v_no_show_count int := 0;
BEGIN
  SELECT COUNT(*)
    INTO v_visit_count
    FROM public.appointments a
   WHERE a.client_id = p_client_id
     AND a.barbershop_id = p_barbershop_id
     AND a.status IN ('scheduled', 'confirmed', 'completed');

  SELECT COUNT(*)
    INTO v_no_show_count
    FROM public.appointments a
   WHERE a.client_id = p_client_id
     AND a.barbershop_id = p_barbershop_id
     AND a.status = 'no_show';

  SELECT (a.appointment_date::timestamp + a.start_time)::timestamptz,
         a.service_id
    INTO v_last_visit_at,
         v_last_service_id
    FROM public.appointments a
   WHERE a.client_id = p_client_id
     AND a.barbershop_id = p_barbershop_id
     AND a.status IN ('scheduled', 'confirmed', 'completed', 'no_show')
   ORDER BY a.appointment_date DESC, a.start_time DESC
   LIMIT 1;

  SELECT a.barber_id
    INTO v_favorite_barber_id
    FROM public.appointments a
   WHERE a.client_id = p_client_id
     AND a.barbershop_id = p_barbershop_id
     AND a.barber_id IS NOT NULL
     AND a.status IN ('scheduled', 'confirmed', 'completed', 'no_show')
   GROUP BY a.barber_id
   ORDER BY COUNT(*) DESC, MAX(a.appointment_date) DESC, MAX(a.start_time) DESC
   LIMIT 1;

  UPDATE public.clients
     SET visit_count = v_visit_count,
         no_show_count = v_no_show_count,
         last_visit_at = v_last_visit_at,
         last_service_id = v_last_service_id,
         favorite_barber_id = v_favorite_barber_id,
         next_recommended_visit_at = CASE
           WHEN v_last_visit_at IS NULL THEN NULL
           ELSE v_last_visit_at + INTERVAL '30 days'
         END
   WHERE id = p_client_id
     AND barbershop_id = p_barbershop_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_client_crm_from_appointment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.client_id IS NOT NULL AND OLD.barbershop_id IS NOT NULL THEN
      PERFORM public.recalculate_client_crm(OLD.client_id, OLD.barbershop_id);
    END IF;
    RETURN OLD;
  END IF;

  IF NEW.client_id IS NOT NULL AND NEW.barbershop_id IS NOT NULL THEN
    PERFORM public.recalculate_client_crm(NEW.client_id, NEW.barbershop_id);
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.client_id IS NOT NULL AND OLD.barbershop_id IS NOT NULL THEN
    IF OLD.client_id <> NEW.client_id OR OLD.barbershop_id <> NEW.barbershop_id THEN
      PERFORM public.recalculate_client_crm(OLD.client_id, OLD.barbershop_id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_client_crm_from_appointment ON public.appointments;
CREATE TRIGGER trg_sync_client_crm_from_appointment
AFTER INSERT OR UPDATE OF client_id, barber_id, service_id, appointment_date, start_time, status OR DELETE
ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.sync_client_crm_from_appointment();

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT id, barbershop_id
      FROM public.clients
  LOOP
    PERFORM public.recalculate_client_crm(r.id, r.barbershop_id);
  END LOOP;
END;
$$;
