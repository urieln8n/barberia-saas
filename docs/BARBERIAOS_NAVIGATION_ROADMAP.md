# BarberíaOS — Navigation Roadmap
> Arquitectura de navegación propuesta + hoja de ruta por fases  
> Fecha: 2026-05-25

---

## PROBLEMA ACTUAL

El sidebar actual usa 3 pestañas horizontales (Operar / Crecer / Ajustes) con 27 ítems en total y 8 tipos de badges distintos.

**Resultado:** El dueño no sabe dónde está cada función. La navegación parece un panel de administración, no un panel de control del negocio.

---

## NUEVA ARQUITECTURA PROPUESTA

Eliminar las pestañas. Usar grupos verticales con separadores, como Linear, Vercel o Stripe Dashboard.

---

## ESTRUCTURA DE NAVEGACIÓN DEFINITIVA

### GRUPO 1 — Operación diaria
*"Lo que usas cada día"*

| Ítem | Ruta | Estado | Plan |
|------|------|--------|------|
| Inicio | `/dashboard` | ✅ Existe | Todos |
| Agenda | `/dashboard/agenda` | ✅ Existe | Todos |
| Reservas | `/dashboard/reservas` | ✅ Existe | Todos |
| Caja del día | `/dashboard/caja` | ✅ Existe | Todos |
| Clientes | `/dashboard/clientes` | ✅ Existe | Todos |

---

### GRUPO 2 — Tu equipo
*"Gestiona barberos, servicios y horarios"*

| Ítem | Ruta | Estado | Plan |
|------|------|--------|------|
| Barberos | `/dashboard/barberos` | ✅ Existe | Todos |
| Servicios | `/dashboard/servicios` | ✅ Existe | Todos |
| Inventario | `/dashboard/inventario` | ✅ Existe | Pro |
| Comisiones | `/dashboard/barberos#comisiones` | ⚠️ En Barberos, no aislado | Pro |

**Nota:** "Comisiones" puede ser una pestaña dentro de `/dashboard/barberos`, no una ruta propia en V1.

---

### GRUPO 3 — Ingresos y caja
*"Controla el dinero de tu barbería"*

| Ítem | Ruta | Estado | Plan |
|------|------|--------|------|
| Pagos | `/dashboard/pagos` | ✅ Existe | Todos |
| Finanzas | `/dashboard/finanzas` | ✅ Existe | Pro |
| Estadísticas | `/dashboard/estadisticas` | ✅ Existe | Pro |
| Fiscalidad | `/dashboard/fiscalidad` | ✅ Existe | Pro |

---

### GRUPO 4 — Crecer y fidelizar
*"Trae más clientes y que vuelvan"*

| Ítem | Ruta | Estado | Plan |
|------|------|--------|------|
| Marketing Studio | `/dashboard/marketing` | ✅ Existe | Todos |
| Reseñas | `/dashboard/resenas` | ✅ Existe | Todos |
| Clientes perdidos | `/dashboard/recuperacion` | ✅ Existe | Todos |
| Agentes IA | `/dashboard/agents` | ✅ Existe | Pro |
| Growth Engine | `/dashboard/growth` | ✅ Existe | Premium |

---

### GRUPO 5 — Presencia online
*"Tu barbería en internet"*

| Ítem | Ruta | Estado | Plan |
|------|------|--------|------|
| QR y página pública | `/dashboard/qr` | ✅ Existe | Todos |
| Sala de espera | `/dashboard/lounge` | ✅ Existe | Pro |
| Marketplace | `/dashboard/marketplace` | ✅ Existe | Premium |
| Automatizaciones | `/dashboard/automatizaciones` | ✅ Existe | Pro |

---

### GRUPO 6 — Configuración
*"Ajustes de tu barbería"*

| Ítem | Ruta | Estado | Plan |
|------|------|--------|------|
| Mi barbería | `/dashboard/ajustes` | ✅ Existe | Todos |
| Soporte | `/dashboard/whatsapp` | ✅ Existe | Todos |

---

## ÍTEMS A ELIMINAR DEL SIDEBAR PRINCIPAL

Los siguientes ítems deben salir del sidebar y vivir dentro de otras páginas:

| Ítem actual | Por qué sacarlo | Dónde vive |
|---|---|---|
| "Pipeline" | Jerga; solo es una vista de `/reservas` | Sub-tab en `/dashboard/reservas` |
| "BarberíaOS Kit" | No es navegación diaria | Acceso desde el avatar/menú de perfil |
| "IA del Dueño" | Feature beta; no para navegación primaria | Acceso desde el banner o quick action |
| "Auditoría Web" | Feature muy nicho; beta | Accesible desde `/ajustes` o link directo |

---

## CAMBIOS EN BADGES

### Regla: máximo 3 tipos de badges, usados con moderación

| Badge | Cuándo usar | Máximo ítems |
|---|---|---|
| `Nuevo` (verde) | Feature lanzado en los últimos 30 días | 1-2 por mes |
| `Pro` (dorado) | Feature exclusivo de plan Pro o Premium | Todos los que aplican |
| `Beta` (gris) | Feature en fase beta activa | Solo si es beta real |

**Eliminar badges:** AaaS, Kit, Growth, IA, Guía — son categorías, no estados

---

## GRUPOS EN MOBILE (bottom nav)

El mobile bottom nav de 5 ítems actual es correcto. Mantener:

1. **Inicio** (Home)
2. **Agenda** (Calendar)
3. **Caja** (Banknote)
4. **Clientes** (Users)
5. **Más** (Menu — abre drawer completo)

---

## HOJA DE RUTA DE NAVEGACIÓN POR FASES

### FASE 0 — Ya implementado ✅
- 32 rutas de dashboard funcionando
- Sidebar con 3 pestañas
- Mobile bottom nav (5 ítems) + drawer

### FASE 1 — Reorganización del sidebar (PRÓXIMO)
**Archivos:** `components/dashboard/Sidebar.tsx`  
**Objetivo:** Reemplazar 3 pestañas → 6 grupos verticales  
**Esfuerzo:** ~4-6 horas  
**Riesgo:** Bajo (solo visual, sin romper rutas)

Cambios:
- Eliminar `SidebarTab` (Operar/Crecer/Ajustes)
- Añadir `SidebarGroup` con label de sección
- Reordenar ítems según la nueva arquitectura
- Reducir badges a Pro / Nuevo / Beta
- Eliminar Pipeline, BarberíaOS Kit, IA del Dueño del sidebar primario

### FASE 2 — Dashboard home simplificado
**Archivos:** `app/dashboard/page.tsx`  
**Objetivo:** De 19 secciones → 5-6 secciones con jerarquía clara  
**Esfuerzo:** ~3-4 horas  
**Riesgo:** Bajo (no toca Supabase ni auth)

Estructura nueva del home:
```
1. PageHeader — "Buenos días, [Barbería]" + fecha + acciones rápidas
2. KPI Bar — 4 métricas: Caja hoy | Reservas | Huecos libres | Clientes perdidos
3. Agenda de hoy — Lista limpia de citas del día
4. Acción recomendada — 1 sola, la más importante
5. Barberos de hoy — Rendimiento y disponibilidad
6. [Onboarding checklist — solo si activación < 80%]
```

### FASE 3 — Páginas prioritarias
**Objetivo:** Mejorar Caja, Clientes, Barberos y Servicios  
**Esfuerzo:** ~2-3 horas por página  
**Riesgo:** Bajo si no se tocan queries existentes

Orden de prioridad:
1. Caja (`/dashboard/caja`) — dinero = máxima prioridad
2. Clientes (`/dashboard/clientes`) — CRM visual
3. Barberos (`/dashboard/barberos`) — ranking visual
4. Servicios (`/dashboard/servicios`) — conectar con rentabilidad
5. Estadísticas (`/dashboard/estadisticas`) — narrative visual
6. Pagos (`/dashboard/pagos`) — mejora de tabla

### FASE 4 — Design system premium
**Archivos:** `app/globals.css`, `tailwind.config.ts`, componentes UI  
**Objetivo:** Limpiar tokens de color, estandarizar headers, premium cards  
**Esfuerzo:** ~3-4 horas  
**Riesgo:** Medio (cambios en globals.css afectan toda la app — probar bien)

### FASE 5 — Mobile y quick actions
**Objetivo:** Quick action global, mobile refinado  
**Esfuerzo:** ~2-3 horas  
**Riesgo:** Bajo

---

## TABLA: TODAS LAS RUTAS + PRIORIDAD + PLAN

| Ruta | Nombre en UI | Existe | Plan | Prioridad |
|------|-------------|--------|------|-----------|
| `/dashboard` | Inicio | ✅ | Todos | P1 |
| `/dashboard/agenda` | Agenda | ✅ | Todos | P1 |
| `/dashboard/reservas` | Reservas | ✅ | Todos | P2 |
| `/dashboard/caja` | Caja del día | ✅ | Todos | P1 |
| `/dashboard/clientes` | Clientes | ✅ | Todos | P1 |
| `/dashboard/barberos` | Barberos | ✅ | Todos | P2 |
| `/dashboard/servicios` | Servicios | ✅ | Todos | P2 |
| `/dashboard/inventario` | Inventario | ✅ | Pro | P3 |
| `/dashboard/pagos` | Pagos | ✅ | Todos | P3 |
| `/dashboard/finanzas` | Finanzas | ✅ | Pro | P2 |
| `/dashboard/estadisticas` | Estadísticas | ✅ | Pro | P3 |
| `/dashboard/fiscalidad` | Fiscalidad | ✅ | Pro | P4 |
| `/dashboard/marketing` | Marketing Studio | ✅ | Todos | P2 |
| `/dashboard/resenas` | Reseñas | ✅ | Todos | P3 |
| `/dashboard/recuperacion` | Clientes perdidos | ✅ | Todos | P2 |
| `/dashboard/agents` | Agentes IA | ✅ | Pro | P3 |
| `/dashboard/growth` | Growth Engine | ✅ | Premium | P4 |
| `/dashboard/qr` | QR y página pública | ✅ | Todos | P2 |
| `/dashboard/lounge` | Sala de espera | ✅ | Pro | P3 |
| `/dashboard/automatizaciones` | Automatizaciones | ✅ | Pro | P4 |
| `/dashboard/marketplace` | Marketplace | ✅ | Premium | P4 |
| `/dashboard/ajustes` | Configuración | ✅ | Todos | P3 |
| `/dashboard/whatsapp` | Soporte | ✅ | Todos | P4 |
| `/dashboard/ia` | IA del Dueño | ✅ | Premium | P4 |
| `/dashboard/kit` | BarberíaOS Kit | ✅ | — | Mover fuera del nav |
| `/dashboard/security-audit` | Auditoría Web | ✅ | Beta | Mover a Ajustes |
| `/dashboard/huecos` | Huecos libres | ✅ | — | Sub-vista de Agenda |
| `/dashboard/reservas/pipeline` | Pipeline | ✅ | — | Sub-tab de Reservas |
| `/dashboard/lounge/promotions` | Promociones | ✅ | Pro | Dentro de Lounge |
| `/dashboard/lounge/qr` | QR Lounge | ✅ | Pro | Dentro de Lounge |
| `/dashboard/lounge/settings` | Config Lounge | ✅ | Pro | Dentro de Lounge |
| `/dashboard/clientes/[id]` | Detalle cliente | ✅ | Todos | — |

---

## REGLAS DE DISEÑO PARA EL SIDEBAR NUEVO

```tsx
// Estructura de datos propuesta para el sidebar
type SidebarItem = {
  label: string;        // "Agenda" — nombre corto
  route: string;        // "/dashboard/agenda"
  icon: LucideIcon;     // CalendarDays
  badge?: "Pro" | "Nuevo" | "Beta";  // solo 3 tipos
  tooltip?: string;     // "Ver citas del día y de la semana"
  disabled?: boolean;   // para futuras rutas
};

type SidebarGroup = {
  label: string;        // "Operación diaria"
  items: SidebarItem[];
};
```

### Reglas de estilo del sidebar
- Fondo: `slate-900` (dark, elegante)
- Texto inactivo: `slate-400`
- Texto activo: `white` + borde izquierdo dorado 3px
- Fondo activo: `rgba(212, 175, 102, 0.08)` (dorado muy sutil)
- Separador de grupo: `border-t border-slate-800` + label `text-[10px] uppercase text-slate-500 tracking-widest`
- Icono: 18px, Lucide, stroke-width 1.75
- Badge Pro: `bg-amber-500/20 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded`
- Transición: `transition-all duration-150`
- Mobile drawer: misma estructura, fondo `slate-900`, fácil de cerrar

---

*Documento generado: 2026-05-25*  
*Ver docs/BARBERIAOS_UI_UX_AUDIT.md para diagnóstico completo*
