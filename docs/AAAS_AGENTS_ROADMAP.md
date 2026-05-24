# BarberíaOS — Roadmap de Agentes IA (AaaS)
**Agents as a Service — 3 Fases · 9 Agentes prioritarios**
Fecha: 2026-05-23

---

## Filosofía AaaS para barberías

Un agente de IA para barbería no es un chatbot. Es un empleado digital que:
1. **Observa** datos reales del negocio (citas, clientes, caja, reseñas)
2. **Razona** sobre qué acción tiene mayor impacto en ingresos
3. **Actúa** o propone la acción al dueño para que la apruebe
4. **Aprende** del resultado para mejorar en el siguiente ciclo

Cada agente tiene un **job to be done** específico, trabaja con datos reales del
sistema y tiene una propuesta de acción concreta (nunca solo un informe).

---

## Modelo de 3 fases

### Fase 1 — Copiloto (V1 actual + pequeños cambios)
> El agente observa y recomienda. El dueño decide y actúa.
> **No requiere APIs externas. Funciona con datos de Supabase.**

- Genera textos, mensajes, copias.
- Detecta situaciones (clientes perdidos, huecos libres, etc.).
- Muestra sugerencias accionables con botón "Copiar" o "Aplicar".
- Requiere acción manual del dueño para ejecutar.

### Fase 2 — Semi-autónomo (V2 · mes 3-6)
> El agente prepara la acción, el dueño aprueba con un clic.
> **Requiere integraciones: WhatsApp Business API (Twilio/360Dialog), Google My Business API.**

- Agenda el envío de mensajes WhatsApp.
- Publica en Google Business con aprobación.
- Genera campañas y las activa tras confirmación.
- Dashboard de acciones pendientes de aprobación.

### Fase 3 — Autónomo (V3 · mes 6-12)
> El agente actúa solo dentro de reglas definidas por el dueño.
> **Requiere: webhooks, cron jobs, reglas de negocio configurables.**

- Envía mensajes de retención automáticamente.
- Gestiona huecos libres en tiempo real.
- Redirige clientes a barberos disponibles.
- Reporta resultados diarios al dueño.

---

## Agentes prioritarios

---

### Agente 1 — Recepcionista IA
**Nickname:** `receptor`
**Icono:** `Bot`

**Problema que resuelve:**
Los barberos pierden tiempo respondiendo "¿Tenéis hueco el jueves?" por WhatsApp
e Instagram cuando podrían estar cortando.

**Solución:**
Responde automáticamente a consultas de disponibilidad y dirige al link de reservas.
En Fase 1 genera el mensaje. En Fase 3 responde en WhatsApp Business.

**Datos que usa:**
- `appointments` (disponibilidad real por fecha/barbero)
- `barbershop.slug` (link de reservas)
- `barbers` (nombres y horarios)

**Herramientas seguras:**
```typescript
checkAvailability(barbershopId, date)     // Lectura
getPublicBookingUrl(barbershopId)          // Lectura
generateReplyMessage(context, template)   // Generación de texto
```

**Pantallas en el producto:**
- `/dashboard/agents` → card del agente con estado activo/inactivo
- Preview del mensaje que enviaría con botón "Copiar"

**Plan de precios:**
- Fase 1 (copiar mensaje): Starter ✅
- Fase 2 (envío semi-auto): Growth ✅
- Fase 3 (WhatsApp autónomo): Premium ✅

---

### Agente 2 — Retención IA
**Nickname:** `retencion`
**Icono:** `RotateCcw`

**Problema que resuelve:**
El 30% de los clientes desaparece después de 42 días sin visita. Nadie los llama
porque no hay tiempo ni proceso definido.

**Solución:**
Detecta clientes en riesgo (>30 días sin visita), genera un mensaje de WhatsApp
personalizado con nombre del cliente y razón para volver, y lo presenta listo para
copiar o enviar.

**Datos que usa:**
- `clients` (nombre, teléfono, last_visit_at)
- `appointments` (historial de visitas)
- `services` (servicio favorito estimado)

**Herramientas seguras:**
```typescript
getLostClients(barbershopId, daysSinceVisit: 30)  // Lectura
generateRetentionMessage(client, barbershopContext) // Generación de texto
createRetentionCampaign(clients[], message)          // Fase 2: crea campaña
```

**Pantallas en el producto:**
- `/dashboard/agents` → card con "X clientes en riesgo hoy"
- Modal con lista de clientes + mensaje generado por cada uno
- Botón "Copiar" (Fase 1) → "Enviar por WhatsApp" (Fase 2)

**Plan de precios:**
- Fase 1 (detectar + copiar mensaje): Growth ✅
- Fase 2 (campaña semi-auto): Premium ✅

---

### Agente 3 — Huecos Libres IA
**Nickname:** `huecos`
**Icono:** `CalendarX2`

**Problema que resuelve:**
Las barberías tienen huecos libres en la agenda pero no los monetizan porque
no tienen proceso para comunicarlos rápidamente.

**Solución:**
Detecta huecos libres del día o semana, calcula el ingreso potencial perdido,
y genera un post de Instagram Stories + mensaje de WhatsApp listo para compartir.

**Datos que usa:**
- `appointments` (huecos en agenda de hoy)
- `barbers` (disponibles hoy)
- `services` (precio medio de servicios)

**Herramientas seguras:**
```typescript
getFreeSlots(barbershopId, date)                    // Lectura
calculateLostRevenue(slots[], avgServicePrice)       // Cálculo
generateFreeSlotContent(slots[], barbershopContext)  // Generación de texto/copy
```

**Pantallas en el producto:**
- `/dashboard/agents` → card con "N huecos hoy · X€ perdidos"
- Texto de WhatsApp Stories + Instagram Story listo para copiar

**Plan de precios:**
- Fase 1: Growth ✅
- Fase 2 (auto-post Instagram): Premium ✅

---

### Agente 4 — Reseñas IA
**Nickname:** `resenas`
**Icono:** `Star`

**Problema que resuelve:**
Las reseñas de Google aumentan la visibilidad local pero pedirlas manualmente
es incómodo y se olvida. Las respuestas a reseñas negativas se demoran o no
se hacen, dañando el SEO local.

**Solución:**
Genera el mensaje de solicitud de reseña para el momento perfecto (final del
corte) y respuestas profesionales a reseñas negativas. En Fase 2 automatiza
el envío post-cita.

**Datos que usa:**
- `appointments` (citas completadas hoy)
- `clients` (nombre)
- `barbershop.google_business_url` (link reseña)

**Herramientas seguras:**
```typescript
getCompletedAppointmentsToday(barbershopId)   // Lectura
generateReviewRequestMessage(client, url)      // Generación de texto
generateReviewResponse(reviewText, sentiment) // Generación de texto
```

**Plan de precios:**
- Fase 1: Starter ✅ (genera mensaje para copiar)
- Fase 2: Growth ✅ (envío automático post-cita)

---

### Agente 5 — Marketing Studio IA
**Nickname:** `marketing`
**Icono:** `Megaphone`

**Problema que resuelve:**
Crear contenido para redes sociales cada semana consume horas de un negocio
que no tiene equipo de marketing.

**Solución:**
Analiza los datos del negocio (servicios más vendidos, clientes, huecos) y
genera un plan de contenido semanal con textos listos para Instagram, WhatsApp
y Google Business.

**Datos que usa:**
- `services` (catálogo y precios)
- `appointments` (qué servicios se venden más)
- `clients` (datos demográficos)
- `barbershop` (nombre, ciudad, slug)

**Herramientas seguras:**
```typescript
getTopServices(barbershopId, period: "week")    // Lectura
generateWeeklyContentPlan(barbershopContext)     // Generación
generateInstagramCaption(service, tone)          // Generación
generateGoogleBusinessPost(event, barbershop)   // Generación
```

**Plan de precios:**
- Fase 1: Growth ✅ (genera textos manualmente)
- Fase 2: Premium ✅ (calendario de publicación automático)

---

### Agente 6 — Caja & Finanzas IA
**Nickname:** `caja`
**Icono:** `Banknote`

**Problema que resuelve:**
El dueño no tiene tiempo para analizar números al final del día ni sabe
qué días son más rentables para optimizar horarios.

**Solución:**
Genera el resumen diario de caja con análisis de tendencias, identifica
días/horas de mayor rendimiento y sugiere cambios operativos.

**Datos que usa:**
- `cash_sessions` (sesiones de caja)
- `cash_sales` (ventas del día)
- `appointments` (citas completadas)

**Herramientas seguras:**
```typescript
getDailySummary(barbershopId, date)           // Lectura
analyzeCashTrends(barbershopId, period)       // Análisis
generateDailyCashReport(summary)             // Generación de texto
```

**Plan de precios:**
- Fase 1: Premium ✅

---

### Agente 7 — SEO & Presencia Local IA
**Nickname:** `seo`
**Icono:** `Globe`

**Problema que resuelve:**
La barbería no aparece en "barbería cerca de mí" porque su perfil de Google
Business está desactualizado y no publica regularmente.

**Solución:**
Audita el perfil de Google Business (horario, fotos, posts), genera un plan
de mejora semanal y textos para publicar directamente.

**Datos que usa:**
- Checklist de Google Business configurada en Marketing > Presencia
- `barbershop` (nombre, ciudad, servicios)

**Herramientas seguras:**
```typescript
auditOnlinePresence(barbershopContext)          // Análisis de checklist
generateGoogleBusinessContent(barbershop)       // Generación
generateLocalSEORecommendations(barbershop)     // Recomendaciones
```

**Plan de precios:**
- Fase 1: Growth ✅

---

### Agente 8 — WhatsApp Business IA
**Nickname:** `whatsapp`
**Icono:** `MessageCircle`

**Problema que resuelve:**
WhatsApp es el canal principal de comunicación de barberías pero gestionarlo
manualmente 24/7 es imposible y caro contratar personal.

**Solución:**
Gestiona respuestas automáticas de WhatsApp Business para consultas de
disponibilidad, confirmaciones de cita y recordatorios.

**Herramientas seguras:**
```typescript
handleIncomingMessage(message, barbershopId)    // Fase 3
sendAppointmentReminder(appointment)            // Fase 2/3
sendAvailabilityReply(query, barbershopId)      // Fase 2/3
```

**Nota:** Fase 1 es solo generador de texto. Fases 2-3 requieren WhatsApp Business API.

**Plan de precios:**
- Fase 1: Growth ✅
- Fase 2-3: Premium ✅

---

### Agente 9 — Inventario & Ventas IA
**Nickname:** `inventario`
**Icono:** `Boxes`

**Problema que resuelve:**
Los productos se acaban sin previo aviso o se compran en exceso, afectando
el flujo de caja.

**Solución:**
Monitoriza el inventario, predice cuándo se agotarán los productos más usados
y genera el pedido de reposición con una estimación de coste.

**Datos que usa:**
- `products` (stock actual)
- `cash_sales` (ventas de productos)

**Plan de precios:**
- Fase 1: Premium ✅

---

## Resumen de cobertura por plan

| Agente | Starter | Growth | Premium |
|--------|---------|--------|---------|
| Recepcionista IA | ✅ Copiloto | ✅ Semi-auto | ✅ Autónomo |
| Retención IA | — | ✅ Copiloto | ✅ Semi-auto |
| Huecos Libres IA | — | ✅ Copiloto | ✅ Semi-auto |
| Reseñas IA | ✅ Copiloto | ✅ Semi-auto | ✅ Semi-auto |
| Marketing Studio IA | — | ✅ Copiloto | ✅ Semi-auto |
| Caja & Finanzas IA | — | — | ✅ Copiloto |
| SEO & Presencia Local IA | — | ✅ Copiloto | ✅ Semi-auto |
| WhatsApp Business IA | — | ✅ Copiloto | ✅ Autónomo |
| Inventario & Ventas IA | — | — | ✅ Copiloto |

---

## Roadmap temporal

```
Mes 1 (actual)
└── Fase 1 · Copiloto
    ├── Centro de Agentes UI (/dashboard/agents)
    ├── Agente Retención (genera mensajes)
    ├── Agente Huecos (detecta y genera copy)
    └── Agente Reseñas (genera solicitudes)

Mes 2-3
└── Fase 1 completa
    ├── Agente Recepcionista (genera respuestas)
    ├── Agente Marketing Studio (genera plan semanal)
    └── Agente SEO & Presencia (auditoría + recomendaciones)

Mes 4-6
└── Fase 2 · Semi-autónomo
    ├── Integración WhatsApp Business API
    ├── Integración Google My Business API
    ├── Dashboard de aprobaciones
    └── Campañas programadas con aprobación

Mes 7-12
└── Fase 3 · Autónomo
    ├── Agentes en background (cron jobs)
    ├── Reglas de negocio configurables
    └── Reportes de impacto automáticos
```

---

## Agenda Visual Pro como motor AaaS

La nueva agenda semanal prepara la capa AaaS desde el producto core:

- **Agente de Huecos Libres:** detecta espacios visuales sin citas y los conecta con Marketing Studio. En Fase 1 solo recomienda; en fases futuras preparara campanas con aprobacion humana.
- **Recepcionista IA conectada a disponibilidad:** la agenda expone la estructura necesaria para responder "que huecos hay" sin crear reservas automaticamente todavia.
- **Agenda como motor de recomendaciones:** las metricas de pendientes, nuevos clientes, ocupacion y huecos alimentan recomendaciones simples basadas en reglas.
- **Futuro:** acciones automaticas solo con aprobacion humana previa: promocionar hueco, enviar recordatorio, confirmar cita, sugerir upsell o pedir resena.

No se activa OpenAI real, WhatsApp real ni automatizacion autonoma en esta fase.

---

*Documento generado en rama feature/aaas-agentic-product-audit*
*Revisar y ajustar según feedback de primeros usuarios*
