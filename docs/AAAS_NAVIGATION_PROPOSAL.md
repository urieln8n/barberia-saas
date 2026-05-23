# BarberíaOS — Propuesta de Navegación Simplificada
**Navigation Redesign Proposal — AaaS**
Fecha: 2026-05-23

---

## Problema actual

La sidebar desktop tiene 20+ items al mismo nivel visual sin jerarquía clara.
El usuario no sabe dónde está la IA ni cómo se relacionan los módulos.

---

## Propuesta: 3 zonas + 1 zona IA destacada

### Zona 1 — OPERAR (trabajo diario)
```
Inicio          /dashboard
Agenda          /dashboard/agenda
Caja            /dashboard/caja
Reservas        /dashboard/reservas
Servicios       /dashboard/servicios
Barberos        /dashboard/barberos
```

### Zona 2 — CRECER (captación y retención)
```
Clientes CRM    /dashboard/clientes
Marketing       /dashboard/marketing
QR y reservas   /dashboard/qr
Reseñas         /dashboard/resenas
Growth          /dashboard/growth     [badge: Growth]
```

### Zona 3 — IA (diferenciador del producto)
```
★ Agentes IA    /dashboard/agents    [badge: Nuevo]  ← DESTACADO
  IA del Dueño  /dashboard/ia        [badge: IA]
  Automatiza.   /dashboard/automatizaciones [badge: Pro]
```

### Zona 4 — ADMIN (configuración y opcionales)
```
Estadísticas    /dashboard/estadisticas
Ventas          /dashboard/finanzas
Inventario      /dashboard/inventario
Pagos           /dashboard/pagos
Fiscalidad      /dashboard/fiscalidad
Ajustes         /dashboard/ajustes
Soporte         /dashboard/whatsapp
Auditoría Web   /dashboard/security-audit [badge: Beta]
```

---

## Implementación en Sidebar.tsx

La sidebar actual usa el sistema de tabs (operar/crecer/ajustes).
La propuesta añade una nueva tab "IA" visible entre "crecer" y "ajustes":

```typescript
type TabId = "operar" | "crecer" | "ia" | "ajustes";
```

**Nota:** El cambio estructural de tabs requiere modificar `Sidebar.tsx` en ~15 líneas
y no afecta rutas ni lógica de servidor. Se puede hacer en Sprint 2.

---

## Mobile bottom bar (ya correcto)

La barra inferior mobile tiene la distribución correcta:
```
Inicio | Agenda | Caja | Clientes | [Más]
```

Propuesta: cambiar "Clientes" por "Agentes" en la barra principal:
```
Inicio | Agenda | Caja | Agentes IA | [Más]
```

Razón: "Agentes IA" es el diferenciador del producto y debe tener presencia directa.
"Clientes" pasa al drawer "Más".

---

## Principios de la propuesta

1. **Jerarquía visual:** Las 3 zonas (Operar / Crecer / IA) tienen identidad propia.
2. **IA siempre visible:** El Centro de Agentes IA no debe estar enterrado en el drawer.
3. **Progresión natural:** El flujo operar → crecer → IA cuenta la historia del producto.
4. **Admin opcional:** Estadísticas, inventario y fiscalidad son vistas secundarias.

---

*Implementar en Sprint 2 tras validar el Centro de Agentes IA con usuarios*
