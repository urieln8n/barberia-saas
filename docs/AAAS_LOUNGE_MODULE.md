# BarberíaOS Lounge — Documentación del módulo

**Fecha:** 2026-05-24  
**Estado:** Implementado (Fase 1 — datos mock + estructura)

---

## Qué es BarberíaOS Lounge

BarberíaOS Lounge es el módulo que convierte la sala de espera de una barbería en un canal activo de reservas, ventas y reseñas.

### Concepto central
> "Mientras el cliente espera su turno, tiene 10-15 minutos. El Lounge los convierte en una oportunidad de negocio."

### Qué hace:
- Muestra al cliente una página mobile-first con servicios, productos, promociones
- Permite reservar la próxima cita directamente desde el móvil
- Facilita dejar reseña en Google con un clic
- Abre WhatsApp directamente para consultas
- Permite compartir la barbería con un amigo (Web Share API)
- En fases futuras: personalización con IA según historial del cliente

---

## Rutas implementadas

### `/dashboard/lounge` (panel interno)
Archivo: `app/dashboard/lounge/page.tsx`

- Estado del módulo y badge de activación
- Link público copiable del Lounge
- Botones: Ver QR, Ver página pública, Ir a QR de reservas
- Sección: productos destacados (empty state con CTA)
- Sección: promociones activas (empty state con CTA)
- Sección: servicios upgrade mock (Barba, Cejas, Lavado, Facial, Mascarilla)
- Métricas Lounge (mock — escaneos, clicks, conversiones)
- Canales: Reseñas Google + WhatsApp
- Futuras secciones: Lounge TV + Lounge Ads (badge "Próximamente")

### `/dashboard/lounge/qr` (QR del Lounge)
Archivos:
- `app/dashboard/lounge/qr/page.tsx` — Server Component con auth
- `app/dashboard/lounge/qr/LoungeQRClient.tsx` — Client Component

Funcionalidades:
- QR grande generado con `api.qrserver.com` apuntando a `/lounge/[slug]`
- Botón descargar QR (PNG)
- Botón imprimir cartel
- URL copiable con botón copy + icono external link
- Preview de cartel premium para imprimir (diseño oscuro con branding BarberíaOS)
- Instrucciones de dónde colocar el QR (sala de espera, espejo, mostrador, productos)
- CTAs: Ver Lounge público, Configurar Lounge, QR de reservas

### `/lounge/[slug]` (página pública mobile-first)
Archivos:
- `app/lounge/[slug]/page.tsx` — Server Component con Supabase lookup
- `app/lounge/[slug]/LoungePage.tsx` — Client Component mobile-first

Funcionalidades:
- Hero: nombre barbería, mensaje "Mientras esperas, descubre más", CTA reservar
- Servicios de la barbería (datos reales de Supabase, máx. 6)
- Servicios upgrade (mock: barba, cejas, lavado, facial, mascarilla) con botón "Me interesa"
- Promociones (empty state elegante)
- Botón reseña Google (si `google_business_url` configurado)
- Botón WhatsApp (si `phone` configurado)
- Botón compartir (Web Share API con fallback clipboard)
- CTA final dorado para reservar
- Footer: "Powered by BarberíaOS"
- 404 elegante si slug no existe

---

## Rutas futuras

### `/dashboard/lounge/tv` (Lounge TV)
- Pantalla para sala de espera (modo TV/monitor)
- Agenda del día en tiempo real
- Promociones rotativas
- Contenido de marca personalizable
- **Estado:** Próximamente

### `/dashboard/lounge/ads` (Lounge Ads)
- Publicidad de productos locales en la sala de espera
- Modelo de ingresos adicionales para la barbería
- **Estado:** Próximamente

### `/lounge/[slug]/tv` (Vista TV pública)
- Versión de pantalla grande optimizada para proyectar en la sala
- **Estado:** Próximamente

---

## Tablas Supabase necesarias (no creadas todavía)

### `lounge_settings`
```sql
create table lounge_settings (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid references barbershops(id) on delete cascade not null,
  is_active boolean default false,
  google_review_url text,
  whatsapp_number text,
  welcome_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table lounge_settings enable row level security;
create policy "owner_access" on lounge_settings
  using (barbershop_id = (select id from barbershops where owner_id = auth.uid()));
```

### `lounge_products` (productos destacados)
```sql
create table lounge_products (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid references barbershops(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric(10,2),
  image_url text,
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);
```

### `lounge_promotions`
```sql
create table lounge_promotions (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid references barbershops(id) on delete cascade not null,
  title text not null,
  description text,
  cta_label text,
  cta_url text,
  is_active boolean default true,
  valid_from date,
  valid_until date,
  created_at timestamptz default now()
);
```

### `lounge_interactions`
```sql
create table lounge_interactions (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid references barbershops(id) on delete cascade not null,
  event_type text not null, -- 'qr_scan' | 'booking_click' | 'product_click' | 'whatsapp_click' | 'review_click' | 'share_click'
  product_id uuid references lounge_products(id),
  session_id text,
  created_at timestamptz default now()
);
```

---

## Cómo se integra con el Agente Lounge (futuro)

El Agente Lounge es un agente IA Premium que:

1. **Analiza** las interacciones del Lounge (qué productos ve, qué clicks hace)
2. **Detecta** patrones: ¿qué servicio de upgrade se pide más? ¿qué horario genera más escaneos QR?
3. **Personaliza** el contenido del Lounge según el historial del cliente (si tiene cita agendada, muestra upgrades complementarios)
4. **Genera** campañas de retención post-Lounge: clientes que interactuaron pero no volvieron

**Plan:** Premium IA 149€/mes

---

## Copy comercial

### Para landing page / onboarding
> "BarberíaOS Lounge convierte los 10 minutos de espera en ingresos: tu cliente reserva la próxima cita, descubre productos y deja su reseña en Google. Sin que tú hagas nada."

### Para el sidebar
> "Lounge — Convierte la espera en ventas."

### Para el email de activación
> "Tu sala de espera tiene 10-15 minutos de atención garantizada. El Lounge los convierte en reservas, reseñas y ventas de productos."

---

## Instrucciones de uso para el dueño

1. Ve a **Configuración** → asegúrate de tener un slug configurado
2. Ve a **Dashboard → Lounge** → copia tu URL pública del Lounge
3. Ve a **Dashboard → Lounge → QR** → descarga el QR del Lounge
4. Imprime el QR y colócalo en sala de espera, espejo y mostrador
5. Opcionalmente: añade productos en **Inventario** para que aparezcan en el Lounge
6. Activa Google Reviews URL en **Ajustes** para el botón de reseña
