# BarberíaOS — App Audit (AaaS Phase)

**Fecha:** 2026-05-24  
**Auditor:** Claude Sonnet 4.6 (Senior Product Architect)  
**Branch:** feature/aaas-lounge-agent-platform

---

## 1. Rutas actuales encontradas

### Dashboard routes (`app/dashboard/`)
| Ruta | Archivo clave | Estado |
|------|--------------|--------|
| `/dashboard` | `page.tsx` + 20+ imports | Completo, robusto |
| `/dashboard/agenda` | Directorio | Existe |
| `/dashboard/agents` | `page.tsx` + `AgentsClient.tsx` + `actions.ts` | Completo, AaaS ready |
| `/dashboard/ajustes` | Directorio | Existe |
| `/dashboard/automatizaciones` | Directorio | Existe |
| `/dashboard/barberos` | Directorio | Existe |
| `/dashboard/caja` | Directorio | Existe |
| `/dashboard/clientes` | Directorio | Existe |
| `/dashboard/estadisticas` | Directorio | Existe |
| `/dashboard/finanzas` | Directorio | Existe |
| `/dashboard/fiscalidad` | Directorio | Existe |
| `/dashboard/growth` | Directorio | Existe |
| `/dashboard/huecos` | Directorio | Existe |
| `/dashboard/ia` | Directorio | Existe |
| `/dashboard/inventario` | Directorio | Existe |
| `/dashboard/kit` | Directorio | Existe |
| `/dashboard/marketing` | Directorio | Existe |
| `/dashboard/marketplace` | Directorio | Existe |
| `/dashboard/pagos` | Directorio | Existe |
| `/dashboard/qr` | `page.tsx` + `QRClient.tsx` | Completo, buen patrón |
| `/dashboard/recuperacion` | Directorio | Existe |
| `/dashboard/resenas` | Directorio | Existe |
| `/dashboard/reservas` | Directorio | Existe |
| `/dashboard/security-audit` | Directorio | Existe |
| `/dashboard/servicios` | Directorio | Existe |
| `/dashboard/whatsapp` | Directorio | Existe |

### Rutas públicas
| Ruta | Estado |
|------|--------|
| `/r/[slug]` | Completo, con tracking, BookingForm, SSR |
| `/lounge/[slug]` | **No existe — CREAR** |

### Nuevas rutas (esta fase)
- `/dashboard/lounge` — Panel de gestión del Lounge
- `/dashboard/lounge/qr` — QR específico del Lounge
- `/lounge/[slug]` — Página pública mobile-first

---

## 2. Problemas de navegación identificados

1. **Sidebar con 20+ ítems**: El sidebar tiene tabs (Operar/Crecer/Ajustes) pero cada tab tiene demasiados ítems. Un dueño de barbería no debe ver 12 opciones en "Operar".
2. **Lounge no existe en navegación**: El módulo más visual y vendible (sala de espera) no tiene entrada en el sidebar.
3. **"Reservas" y "Agenda" duplican concepto**: Dos entradas que confunden al usuario nuevo.
4. **Pipeline, Reservas, Agenda**: tres rutas superpuestas sin jerarquía clara.
5. **Growth, Marketing Studio, Automatizaciones**: conceptualmente solapados, difíciles de distinguir para el dueño.
6. **Security Audit en "Crecer"**: no tiene sentido desde la perspectiva del dueño de barbería.
7. **Fiscalidad en "Operar"**: demasiado avanzado para el MVP.
8. **WhatsApp como "Soporte"**: confunde el rol (debería ser canal de comunicación, no soporte técnico).

---

## 3. Problemas visuales

1. El dashboard principal funciona bien pero es muy largo (18+ secciones).
2. No hay punto de entrada claro para el dueño que llega nuevo: el "Activation Checklist" está al fondo.
3. Los colores de los badges (Pro, AaaS, Kit, Growth, Beta, Guía) crean ruido visual.
4. La diferencia entre "Caja" y "Pagos" y "Finanzas" no es obvia.
5. La landing comercial (no dashboard) necesita reflejar el nuevo posicionamiento AaaS.

---

## 4. Páginas más confusas

1. **`/dashboard/growth`** — "Growth" es un término interno. El dueño no sabe qué es.
2. **`/dashboard/marketplace`** — No hay marketplace real. Confunde expectativas.
3. **`/dashboard/fiscalidad`** — Muy avanzado, no MVP.
4. **`/dashboard/security-audit`** — Muy técnico para el target.
5. **`/dashboard/huecos`** — Correcto concepto, pero el nombre puede mejorar.
6. **`/dashboard/ia`** — Muy genérico. ¿Qué IA? El dueño no lo sabe.

---

## 5. Páginas prioritarias para mejorar

| Prioridad | Página | Motivo |
|-----------|--------|--------|
| P0 | `/dashboard` | Primera impresión — ya es buena, se añaden bloques AaaS |
| P0 | `/dashboard/agents` | Centro AaaS — es el producto diferencial |
| P1 | `/dashboard/lounge` | **Nuevo** — módulo de sala de espera + conversión |
| P1 | `/lounge/[slug]` | **Nuevo** — página pública mobile-first |
| P1 | Sidebar | Simplificar para dueño de barbería |
| P2 | `/dashboard/qr` | Enlazar con Lounge QR |
| P2 | `/dashboard/marketing` | Integrar con Agente Marketing |
| P3 | `/dashboard/growth` | Renombrar y clarificar |

---

## 6. Componentes repetidos / reutilizables

### Ya existen y son buenos:
- `PageHeader` — usado en QR, agents, etc.
- `EmptyState` — estado vacío consistente
- `StatCard` — métricas en cards
- `SectionCard` — secciones con título
- `StatusBadge` — estados de citas
- `PremiumDashboardMotion` / `PremiumDashboardItem` — grid animado
- `SmartAlerts` — alertas contextuales
- `BarberPerformance` / `TodayAvailability` — disponibilidad
- `ActivationChecklist` / `GrowthScoreCard` — progreso

### Falta crear:
- `RecommendedActionCard` — para CTA en diferentes páginas
- Componente de métricas Lounge (mock elegante)

---

## 7. Riesgos técnicos

1. **Auth/RLS**: No tocar. Supabase Auth funciona correctamente.
2. **Sidebar complexity**: Es un componente "use client" complejo (683 líneas). Añadir items es seguro. Refactorizar es riesgo alto.
3. **`/r/[slug]` es crítico**: No tocar. Es la página de reservas pública que genera ingresos.
4. **Supabase tables**: `lounge_settings`, `lounge_promotions`, `lounge_interactions` no existen. El Lounge debe funcionar con datos mock hasta que se creen las migraciones.
5. **Build TypeScript**: Mantener tipado estricto en nuevos archivos.

---

## 8. Oportunidades para AaaS

1. **Agentes ya implementados en interfaz**: Reseñas, Retención, Huecos, Marketing Studio — con `runAgentAction` server action.
2. **SmartAlerts ya conecta a `/dashboard/agents`**: Buena UX de derivación.
3. **Dashboard ya tiene bloque "AaaS Agents teaser"**: Funciona bien.
4. **lostClientsCount, todayAppointmentsCount**: datos reales disponibles para agentes.
5. **Oportunidad**: Crear panel de métricas unificado de agentes (ejecuciones, tiempo ahorrado, clientes recuperados).

---

## 9. Oportunidades para Lounge

1. **QR ya implementado**: El patrón `qrserver.com` funciona bien en `/dashboard/qr`.
2. **`/r/[slug]` tiene el patrón de barbershop lookup**: Reutilizar para `/lounge/[slug]`.
3. **Mobile-first crítico**: La sala de espera es 100% móvil.
4. **Conversión en sala de espera**: Cliente espera 10-15 min → oportunidad de reservar, descubrir productos, dejar reseña.
5. **Lounge como canal de ingresos pasivos**: Productos, upgrades de servicio, promociones.

---

## 10. Oportunidades para agentes IA premium

1. **Recepcionista IA**: Ya en Beta en AgentsClient. Prioridad para conectar con WhatsApp real (futura fase).
2. **Agente Lounge**: Personaliza contenido del Lounge según historial del cliente (datos disponibles).
3. **Agente Retención**: Datos de `dormantClientsCount` ya disponibles en el dashboard.
4. **Agente Huecos**: `totalFreeSlotsToday` ya calculado en dashboard.
5. **Agente Reseñas**: `todayAppointmentsCount` disponible para trigger post-cita.
6. **Andrés Video Studio**: Add-on externo futuro — crear guiones y vídeos para barberías.

---

## 11. Qué NO tocar todavía

- `/r/[slug]` y su BookingForm
- Auth flows (`/login`, `/signup`, `/onboarding`)
- RLS policies en Supabase
- Migraciones de base de datos existentes
- `src/lib/supabase/server.ts` y `client.ts`
- `getCurrentBarbershopId`
- Componentes de `BarberPerformance`, `TodayAvailability` (funcionan bien)
- Stripe (no implementado, no tocar)
- WhatsApp real API (no implementado, no tocar)
