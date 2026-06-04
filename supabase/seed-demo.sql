-- ============================================================
-- BarberíaOS — Seed de barbería demo
-- Barbería: FadeLab Barbers (slug: demo-barber)
-- ============================================================
-- Ejecutar en Supabase SQL Editor con Service Role (bypass RLS).
-- SEGURO: solo toca registros con slug = 'demo-barber'.
-- IDEMPOTENTE: elimina y recrea los datos cada vez.
--
-- Instrucciones:
--   1. Ir a Supabase Dashboard → SQL Editor
--   2. Pegar este archivo completo
--   3. Ejecutar con "Run"
--   4. Verificar en /r/demo-barber que aparece la barbería
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- LIMPIEZA (CASCADE borra barbers, services, clients,
-- appointments y todo lo relacionado automáticamente)
-- ────────────────────────────────────────────────────────────
DELETE FROM public.barbershops WHERE slug = 'demo-barber';

-- ────────────────────────────────────────────────────────────
-- 1. BARBERSHOP
-- ────────────────────────────────────────────────────────────
INSERT INTO public.barbershops (
  id, name, slug, phone, address, city,
  instagram_url, google_business_url, public_booking_enabled
) VALUES (
  'a0d00000-d000-4000-8000-000000000001',
  'FadeLab Barbers',
  'demo-barber',
  '+34 600 123 456',
  'Calle Fuencarral, 42',
  'Madrid',
  'https://instagram.com/fadelab',
  null,
  true
);

-- ────────────────────────────────────────────────────────────
-- 2. PERFIL PÚBLICO (visible en /r/demo-barber)
-- ────────────────────────────────────────────────────────────
INSERT INTO public.barbershop_public_profiles (
  id, barbershop_id, slug, public_name,
  city, neighborhood, phone, whatsapp,
  description, is_published, marketplace_enabled
) VALUES (
  'b0d00000-d000-4000-8000-000000000001',
  'a0d00000-d000-4000-8000-000000000001',
  'demo-barber',
  'FadeLab Barbers',
  'Madrid',
  'Malasaña',
  '+34 600 123 456',
  '+34600123456',
  'Barbería premium en el corazón de Madrid. Cortes clásicos, fades y barba. Reserva en 60 segundos, sin app, sin llamadas.',
  true,
  false
);

-- ────────────────────────────────────────────────────────────
-- 3. BARBEROS
-- ────────────────────────────────────────────────────────────
INSERT INTO public.barbers (id, barbershop_id, name, phone, active) VALUES
  ('c0d00000-d000-4000-8000-000000000001', 'a0d00000-d000-4000-8000-000000000001', 'Carlos',  '+34 600 111 001', true),
  ('c0d00000-d000-4000-8000-000000000002', 'a0d00000-d000-4000-8000-000000000001', 'Miguel',  '+34 600 111 002', true);

-- ────────────────────────────────────────────────────────────
-- 4. SERVICIOS
-- ────────────────────────────────────────────────────────────
INSERT INTO public.services (id, barbershop_id, name, description, price, duration_minutes, active) VALUES
  ('d0d00000-d000-4000-8000-000000000001', 'a0d00000-d000-4000-8000-000000000001',
   'Corte clásico',   'Corte con tijera o máquina, acabado y producto.',        18.00, 30, true),
  ('d0d00000-d000-4000-8000-000000000002', 'a0d00000-d000-4000-8000-000000000001',
   'Arreglo de barba','Perfilado y arreglo de barba con navaja y producto.',    12.00, 20, true),
  ('d0d00000-d000-4000-8000-000000000003', 'a0d00000-d000-4000-8000-000000000001',
   'Corte + Barba',   'Pack corte completo más arreglo de barba. El favorito.',  25.00, 50, true),
  ('d0d00000-d000-4000-8000-000000000004', 'a0d00000-d000-4000-8000-000000000001',
   'Fade / Degradado','Degradado con máquina, fade limpio y difuminado preciso.',20.00, 35, true);

-- ────────────────────────────────────────────────────────────
-- 5. HORARIOS POR BARBERO
-- Carlos: Lun-Vie 09:00-20:00, Sáb 09:00-14:00
-- Miguel: Mar-Vie 10:00-20:00, Sáb 10:00-14:00
-- weekday: 0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb
-- ────────────────────────────────────────────────────────────
INSERT INTO public.barber_schedules (barbershop_id, barber_id, weekday, start_time, end_time, active) VALUES
  -- Carlos
  ('a0d00000-d000-4000-8000-000000000001','c0d00000-d000-4000-8000-000000000001',1,'09:00','20:00',true),
  ('a0d00000-d000-4000-8000-000000000001','c0d00000-d000-4000-8000-000000000001',2,'09:00','20:00',true),
  ('a0d00000-d000-4000-8000-000000000001','c0d00000-d000-4000-8000-000000000001',3,'09:00','20:00',true),
  ('a0d00000-d000-4000-8000-000000000001','c0d00000-d000-4000-8000-000000000001',4,'09:00','20:00',true),
  ('a0d00000-d000-4000-8000-000000000001','c0d00000-d000-4000-8000-000000000001',5,'09:00','20:00',true),
  ('a0d00000-d000-4000-8000-000000000001','c0d00000-d000-4000-8000-000000000001',6,'09:00','14:00',true),
  -- Miguel
  ('a0d00000-d000-4000-8000-000000000001','c0d00000-d000-4000-8000-000000000002',2,'10:00','20:00',true),
  ('a0d00000-d000-4000-8000-000000000001','c0d00000-d000-4000-8000-000000000002',3,'10:00','20:00',true),
  ('a0d00000-d000-4000-8000-000000000001','c0d00000-d000-4000-8000-000000000002',4,'10:00','20:00',true),
  ('a0d00000-d000-4000-8000-000000000001','c0d00000-d000-4000-8000-000000000002',5,'10:00','20:00',true),
  ('a0d00000-d000-4000-8000-000000000001','c0d00000-d000-4000-8000-000000000002',6,'10:00','14:00',true);

-- ────────────────────────────────────────────────────────────
-- 6. CLIENTES (15 clientes con historial variado)
-- ────────────────────────────────────────────────────────────
INSERT INTO public.clients (id, barbershop_id, name, phone, email, notes, last_visit_at) VALUES
  -- Clientes activos (últimas 2 semanas)
  ('f0d00000-d000-4000-8000-000000000001','a0d00000-d000-4000-8000-000000000001','Andrés García',    '+34 611 001 001','andres@email.com',   'Siempre Corte + Barba. Llega 5 min antes.',          NOW() - INTERVAL '4 days'),
  ('f0d00000-d000-4000-8000-000000000002','a0d00000-d000-4000-8000-000000000001','Pablo Martínez',   '+34 611 001 002','pablo@email.com',    'Fade limpio. Prefiere Carlos.',                      NOW() - INTERVAL '7 days'),
  ('f0d00000-d000-4000-8000-000000000003','a0d00000-d000-4000-8000-000000000001','Javier López',     '+34 611 001 003',null,                 'Barba larga, cuidado con el perfilado.',             NOW() - INTERVAL '3 days'),
  ('f0d00000-d000-4000-8000-000000000004','a0d00000-d000-4000-8000-000000000001','Miguel Sánchez',   '+34 611 001 004','miguel@email.com',   'Cliente nuevo. Viene por Instagram.',                NOW() - INTERVAL '10 days'),
  ('f0d00000-d000-4000-8000-000000000005','a0d00000-d000-4000-8000-000000000001','David Torres',     '+34 611 001 005',null,                 'Corte clásico, sin producto.',                      NOW() - INTERVAL '6 days'),
  -- Clientes semi-activos (2-5 semanas)
  ('f0d00000-d000-4000-8000-000000000006','a0d00000-d000-4000-8000-000000000001','Carlos Ruiz',      '+34 611 001 006','carlos.r@email.com', 'Combo siempre. Paga con Bizum.',                    NOW() - INTERVAL '22 days'),
  ('f0d00000-d000-4000-8000-000000000007','a0d00000-d000-4000-8000-000000000001','Luis Fernández',   '+34 611 001 007',null,                 'Fade alto. Solo con Miguel.',                       NOW() - INTERVAL '18 days'),
  ('f0d00000-d000-4000-8000-000000000008','a0d00000-d000-4000-8000-000000000001','Sergio Díaz',      '+34 611 001 008','sergio@email.com',   'Viene con su hermano a veces.',                     NOW() - INTERVAL '25 days'),
  ('f0d00000-d000-4000-8000-000000000009','a0d00000-d000-4000-8000-000000000001','Roberto Jiménez',  '+34 611 001 009',null,                 'Corte rápido, sin barba.',                          NOW() - INTERVAL '28 days'),
  -- Clientes dormidos (más de 30 días — candidatos a recuperar)
  ('f0d00000-d000-4000-8000-000000000010','a0d00000-d000-4000-8000-000000000001','Alejandro Moreno', '+34 611 001 010','alex@email.com',     'Fue cliente frecuente. Dejó de venir en abril.',    NOW() - INTERVAL '45 days'),
  ('f0d00000-d000-4000-8000-000000000011','a0d00000-d000-4000-8000-000000000001','Fernando Gil',     '+34 611 001 011',null,                 'Vino 3 veces seguidas. Sin noticias desde marzo.',  NOW() - INTERVAL '52 days'),
  ('f0d00000-d000-4000-8000-000000000012','a0d00000-d000-4000-8000-000000000001','Marcos Castro',    '+34 611 001 012','marcos@email.com',   'Gasto alto. Vale la pena recuperarlo.',             NOW() - INTERVAL '38 days'),
  ('f0d00000-d000-4000-8000-000000000013','a0d00000-d000-4000-8000-000000000001','Iván Molina',      '+34 611 001 013',null,                 'Reservó por QR la primera vez.',                    NOW() - INTERVAL '60 days'),
  ('f0d00000-d000-4000-8000-000000000014','a0d00000-d000-4000-8000-000000000001','Oscar Ortega',     '+34 611 001 014','oscar@email.com',    'Fade + barba. Cliente de alto valor.',              NOW() - INTERVAL '35 days'),
  ('f0d00000-d000-4000-8000-000000000015','a0d00000-d000-4000-8000-000000000001','Héctor Vargas',    '+34 611 001 015',null,                 'Vino una vez. Hay que recuperarlo.',                NOW() - INTERVAL '70 days');

-- ────────────────────────────────────────────────────────────
-- 7. CITAS PASADAS (completadas, para mostrar historial)
-- ────────────────────────────────────────────────────────────
INSERT INTO public.appointments (
  barbershop_id, client_id, barber_id, service_id,
  appointment_date, start_time, end_time, status, source
) VALUES
  -- Ayer
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000001','c0d00000-d000-4000-8000-000000000001','d0d00000-d000-4000-8000-000000000003',
   CURRENT_DATE - 1,'10:00','10:50','completed','public_booking'),
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000003','c0d00000-d000-4000-8000-000000000002','d0d00000-d000-4000-8000-000000000002',
   CURRENT_DATE - 1,'11:00','11:20','completed','dashboard'),
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000005','c0d00000-d000-4000-8000-000000000001','d0d00000-d000-4000-8000-000000000001',
   CURRENT_DATE - 1,'12:00','12:30','completed','qr'),
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000007','c0d00000-d000-4000-8000-000000000002','d0d00000-d000-4000-8000-000000000004',
   CURRENT_DATE - 1,'15:00','15:35','no_show','public_booking'),
  -- Hace 2 días
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000002','c0d00000-d000-4000-8000-000000000001','d0d00000-d000-4000-8000-000000000004',
   CURRENT_DATE - 2,'10:00','10:35','completed','instagram'),
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000008','c0d00000-d000-4000-8000-000000000002','d0d00000-d000-4000-8000-000000000003',
   CURRENT_DATE - 2,'11:00','11:50','completed','public_booking'),
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000006','c0d00000-d000-4000-8000-000000000001','d0d00000-d000-4000-8000-000000000003',
   CURRENT_DATE - 2,'17:00','17:50','completed','whatsapp'),
  -- Hace 3 días
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000004','c0d00000-d000-4000-8000-000000000001','d0d00000-d000-4000-8000-000000000001',
   CURRENT_DATE - 3,'09:00','09:30','completed','public_booking'),
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000009','c0d00000-d000-4000-8000-000000000002','d0d00000-d000-4000-8000-000000000001',
   CURRENT_DATE - 3,'10:00','10:30','completed','qr');

-- ────────────────────────────────────────────────────────────
-- 8. CITAS FUTURAS (para ver en agenda — próximos 7 días)
-- Solo días laborables seguros (Mon/Wed/Fri/Sat)
-- ────────────────────────────────────────────────────────────
INSERT INTO public.appointments (
  barbershop_id, client_id, barber_id, service_id,
  appointment_date, start_time, end_time, status, source
) VALUES
  -- Hoy (si hay horario)
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000001','c0d00000-d000-4000-8000-000000000001','d0d00000-d000-4000-8000-000000000003',
   CURRENT_DATE,'11:00','11:50','confirmed','public_booking'),
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000002','c0d00000-d000-4000-8000-000000000002','d0d00000-d000-4000-8000-000000000004',
   CURRENT_DATE,'12:00','12:35','scheduled','public_booking'),
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000005','c0d00000-d000-4000-8000-000000000001','d0d00000-d000-4000-8000-000000000001',
   CURRENT_DATE,'16:00','16:30','scheduled','dashboard'),
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000003','c0d00000-d000-4000-8000-000000000002','d0d00000-d000-4000-8000-000000000002',
   CURRENT_DATE,'17:00','17:20','scheduled','whatsapp'),
  -- Mañana
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000006','c0d00000-d000-4000-8000-000000000001','d0d00000-d000-4000-8000-000000000003',
   CURRENT_DATE + 1,'10:00','10:50','confirmed','public_booking'),
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000004','c0d00000-d000-4000-8000-000000000002','d0d00000-d000-4000-8000-000000000001',
   CURRENT_DATE + 1,'11:00','11:30','scheduled','qr'),
  -- En 2 días
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000007','c0d00000-d000-4000-8000-000000000001','d0d00000-d000-4000-8000-000000000004',
   CURRENT_DATE + 2,'09:00','09:35','confirmed','instagram'),
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000008','c0d00000-d000-4000-8000-000000000002','d0d00000-d000-4000-8000-000000000003',
   CURRENT_DATE + 2,'15:00','15:50','scheduled','public_booking'),
  -- En 3 días
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000009','c0d00000-d000-4000-8000-000000000001','d0d00000-d000-4000-8000-000000000001',
   CURRENT_DATE + 3,'10:30','11:00','scheduled','public_booking'),
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000001','c0d00000-d000-4000-8000-000000000002','d0d00000-d000-4000-8000-000000000002',
   CURRENT_DATE + 3,'12:00','12:20','scheduled','whatsapp'),
  -- En 5 días
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000002','c0d00000-d000-4000-8000-000000000001','d0d00000-d000-4000-8000-000000000003',
   CURRENT_DATE + 5,'11:00','11:50','confirmed','public_booking'),
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000004','c0d00000-d000-4000-8000-000000000002','d0d00000-d000-4000-8000-000000000004',
   CURRENT_DATE + 5,'16:00','16:35','scheduled','qr'),
  -- En 7 días
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000005','c0d00000-d000-4000-8000-000000000001','d0d00000-d000-4000-8000-000000000003',
   CURRENT_DATE + 7,'10:00','10:50','scheduled','public_booking'),
  ('a0d00000-d000-4000-8000-000000000001','f0d00000-d000-4000-8000-000000000003','c0d00000-d000-4000-8000-000000000002','d0d00000-d000-4000-8000-000000000001',
   CURRENT_DATE + 7,'14:00','14:30','scheduled','instagram');

-- ────────────────────────────────────────────────────────────
-- 9. SUSCRIPCIÓN DEMO (plan pro activo para mostrar features)
-- ────────────────────────────────────────────────────────────
INSERT INTO public.subscriptions (
  barbershop_id, plan_name, amount_monthly, currency,
  billing_cycle, status, started_at, current_period_start, current_period_end,
  notes
) VALUES (
  'a0d00000-d000-4000-8000-000000000001',
  'pro',
  79.00,
  'EUR',
  'monthly',
  'active',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '30 days',
  NOW() + INTERVAL '30 days',
  'Cuenta demo de BarberíaOS — no cobrar'
);

-- ────────────────────────────────────────────────────────────
-- VERIFICACIÓN
-- ────────────────────────────────────────────────────────────
SELECT
  b.name                                            AS barberia,
  b.slug,
  b.public_booking_enabled,
  (SELECT count(*) FROM public.barbers    WHERE barbershop_id = b.id) AS barberos,
  (SELECT count(*) FROM public.services   WHERE barbershop_id = b.id) AS servicios,
  (SELECT count(*) FROM public.clients    WHERE barbershop_id = b.id) AS clientes,
  (SELECT count(*) FROM public.appointments WHERE barbershop_id = b.id) AS citas_total,
  (SELECT count(*) FROM public.appointments WHERE barbershop_id = b.id AND appointment_date >= CURRENT_DATE) AS citas_futuras,
  (SELECT plan_name FROM public.subscriptions WHERE barbershop_id = b.id LIMIT 1) AS plan
FROM public.barbershops b
WHERE b.slug = 'demo-barber';
