# BarberíaOS — Auditoría de Producto AaaS
**Agents as a Service — Product Audit**
Fecha: 2026-05-23 | Rama: feature/aaas-agentic-product-audit

---

## Resumen ejecutivo

BarberíaOS tiene todos los módulos de un SaaS de gestión completo pero se presenta
visualmente como una colección de herramientas independientes, no como un sistema
operativo inteligente. La oportunidad central es **reposicionar el producto como una
plataforma AaaS (Agents as a Service)** donde los módulos actuales son el backend de
datos que alimenta agentes IA que trabajan por el barbero 24/7.

**Veredicto de posicionamiento actual:** "Software de reservas con extras"
**Veredicto de posicionamiento objetivo:** "Sistema operativo de barbería con agentes IA"

---

## 1. Auditoría visual y UX — Estado actual

### 1.1 Dashboard principal (`/dashboard`)

| Área | Estado | Problema | Prioridad |
|------|--------|----------|-----------|
| Hero KPIs | ✅ Bien | Cards bien definidas | — |
| Link de reservas | ⚠️ Débil | No destaca como canal central | Alta |
| Resumen de hoy | ✅ Bien | Lista de citas clara | — |
| Quick actions | ⚠️ Débil | 4 acciones, ninguna de IA | Alta |
| Próximas citas | ✅ Bien | Tabla funcional | — |
| Copy general | ❌ Frío | Lenguaje neutro, no convierte | Crítica |

**Hallazgos:**
- El dashboard no comunica "sistema operativo". Parece un panel de administración genérico.
- No hay ningún elemento que señale la capacidad de agentes IA.
- El eyebrow "Tu barbería, en un solo lugar" no diferencia ni convierte.
- Las quick actions (Agenda, Marketing, QR, Caja) no tienen jerarquía de valor.

**Propuesta de mejora rápida:**
- Añadir un "Agente activo hoy" widget en el dashboard home.
- Cambiar eyebrow a "Tu equipo IA trabaja mientras tú cortas".
- Priorizar quick action "Ver Agentes" con badge "Nuevo".

---

### 1.2 Agenda (`/dashboard/agenda`)

| Área | Estado | Problema | Prioridad |
|------|--------|----------|-----------|
| Vista de citas | ✅ Bien | Clara y funcional | — |
| Vista por barbero | ✅ Bien | Grid columnar correcto | — |
| Estado de citas | ⚠️ Débil | Solo 3 estados (pending/confirmed/cancelled) | Media |
| Huecos libres | ❌ Ausente | No visualiza huecos disponibles hoy | Alta |
| Sugerencias IA | ❌ Ausente | No sugiere cómo llenar huecos | Alta |

**Hallazgos:**
- No hay vista de "huecos disponibles hoy" → oportunidad perdida de upsell.
- Un agente podría detectar automáticamente huecos y enviar WhatsApp.
- El botón "Nueva reserva" no está prominente en mobile.

---

### 1.3 Clientes CRM (`/dashboard/clientes`)

| Área | Estado | Problema | Prioridad |
|------|--------|----------|-----------|
| Tabla de clientes | ✅ Bien | Búsqueda y edición correctas | — |
| Clientes perdidos | ⚠️ Débil | Solo cuenta, no actúa | Alta |
| Insight de recuperación | ⚠️ Débil | Solo muestra 1 cliente, no tiene acción directa | Alta |
| Valor total gastado | ❌ Mock | Muestra "-- EUR" hardcodeado | Crítica |
| Servicio favorito | ❌ Mock | Muestra "Corte" hardcodeado | Crítica |
| WhatsApp action | ⚠️ Débil | Abre wa.me sin mensaje predefinido | Media |

**Hallazgos:**
- El CRM muestra datos mock que dañan la credibilidad del producto.
- El botón de reactivación (RotateCcw) no hace nada → usuario confundido.
- Un agente de retención podría generar el mensaje de WhatsApp listo para enviar.

---

### 1.4 Marketing Studio (`/dashboard/marketing`)

| Área | Estado | Problema | Prioridad |
|------|--------|----------|-----------|
| Tab Plantillas | ✅ Bien | Copia clara y útil | — |
| Tab Campañas | ✅ Bien | Generación de textos correcta | — |
| Tab Presencia | ✅ Bien | Checklist de Google Business | — |
| Tab Historial | ✅ Bien | Registro de copias | — |
| Consejo semanal | ✅ Bien | Rotación semanal inteligente | — |
| Datos conectados | ⚠️ Débil | No vincula datos a acciones automáticas | Media |

**Hallazgos:**
- Marketing Studio es el módulo más completo pero es 100% manual.
- Un agente podría ejecutar campañas automáticamente en fechas clave.
- El "Consejo semanal" podría ser generado por IA con datos reales de la barbería.

---

### 1.5 IA del Dueño (`/dashboard/ia`)

| Área | Estado | Problema | Prioridad |
|------|--------|----------|-----------|
| Chat con IA | ⚠️ Débil | Requiere OpenAI API key configurada | Alta |
| Preguntas rápidas | ✅ Bien | 8 quick actions útiles | — |
| Respuestas | ⚠️ Débil | Genera texto pero no ejecuta acciones | Alta |
| Posicionamiento | ❌ Ausente | No conecta con el concepto de "agentes" | Crítica |

**Hallazgos:**
- La IA del dueño es un chatbot, no un agente. No actúa, solo responde.
- Requiere configuración manual de OpenAI → alta fricción de activación.
- No está conectado visualmente al concepto AaaS del resto del producto.

---

### 1.6 Automatizaciones (`/dashboard/automatizaciones`)

| Área | Estado | Problema | Prioridad |
|------|--------|----------|-----------|
| Página | ❌ Vacía | Solo placeholder | Crítica |

**Hallazgos:**
- La ruta existe pero no tiene contenido. Daña la percepción del producto.
- Candidata a ser reemplazada por el Centro de Agentes IA.

---

### 1.7 Caja (`/dashboard/caja`)

| Área | Estado | Problema | Prioridad |
|------|--------|----------|-----------|
| Sesión de caja | ✅ Bien | Apertura/cierre funcional | — |
| Registro de ventas | ✅ Bien | CRUD completo | — |
| Efectivo esperado | ✅ Bien | Cálculo automático | — |
| Análisis de tendencias | ❌ Ausente | No sugiere qué días son más rentables | Media |

---

### 1.8 QR y página pública (`/dashboard/qr`)

| Área | Estado | Problema | Prioridad |
|------|--------|----------|-----------|
| QR generado | ✅ Bien | Funcional y descargable | — |
| Canales (Instagram, WhatsApp, Google, Widget) | ✅ Bien | Completo | — |
| Instrucciones de colocación | ✅ Bien | Clara | — |
| Agente de distribución | ❌ Ausente | No hay agente que monitorice clicks | Baja |

---

### 1.9 Estadísticas (`/dashboard/estadisticas`)

| Área | Estado | Problema | Prioridad |
|------|--------|----------|-----------|
| KPIs básicos | ✅ Bien | Ingresos, citas, clientes | — |
| Datos por barbero | ✅ Bien | Ranking visible | — |
| Tendencias temporales | ⚠️ Débil | No hay gráficos de evolución | Media |
| Insights automáticos | ❌ Ausente | No genera conclusiones de negocio | Alta |

---

### 1.10 Navegación (`Sidebar`)

| Área | Estado | Problema | Prioridad |
|------|--------|----------|-----------|
| Items principales | ⚠️ Sobrecargado | 20+ items en sidebar desktop | Alta |
| Agrupación | ❌ Sin jerarquía | Todos los items al mismo nivel visual | Alta |
| Agentes IA | ❌ Ausente | No hay sección dedicada a agentes | Crítica |
| Mobile bottom bar | ✅ Bien | 4 items + drawer correcto | — |

---

## 2. Auditoría comercial

### 2.1 Propuesta de valor actual vs. objetivo

**Actual (débil):** "Software de gestión para barberías"
**Objetivo (fuerte):** "El sistema operativo con IA que trabaja por tu barbería 24/7"

### 2.2 Diferenciación de mercado

| Competidor | Posicionamiento | Brecha BarberíaOS |
|------------|----------------|-------------------|
| Booksy | Marketplace + reservas | No tiene agentes IA activos |
| Treatwell | Beauty marketplace | No tiene CRM inteligente |
| Fresha | Gratis + comisión | No tiene marketing studio |
| Goldie | Mobile-first scheduling | No tiene AaaS |
| SetMore | Genérico multi-industria | No especializado barberías |

**Ventaja competitiva única:** BarberíaOS puede ser el único SaaS de barberías con
agentes IA que **actúan** (no solo informan) sobre los datos del negocio.

### 2.3 Planes actuales vs. plan AaaS propuesto

**Actual:**
- Starter: reservas + QR
- Growth: marketing
- Premium: CRM + reportes

**Propuesto (AaaS):**
- Starter: reservas + QR + Agente Recepcionista (lectura)
- Growth: + Agente Marketing + Agente Retención (semi-auto)
- Premium: + Agente WhatsApp + Agente Reseñas + todos los agentes autónomos

---

## 3. Métricas de éxito post-auditoría

| Métrica | Baseline estimado | Objetivo 90 días |
|---------|-------------------|-----------------|
| Tiempo de activación | 15 min | 5 min |
| Features activadas por usuario | 3.2 | 6+ |
| Churn mensual | ~8% | <5% |
| NPS | Desconocido | >40 |
| Upgrading a Growth | Desconocido | >20% |
| Agentes activados por cuenta | 0 | 2+ |

---

## 4. Prioridad de acciones inmediatas

### Sprint 1 (esta semana)
1. ✅ Crear `/dashboard/agents` — Centro de Agentes IA
2. ✅ Añadir entry en sidebar para Agentes
3. Actualizar copy del dashboard home
4. Limpiar datos mock del CRM (-- EUR, "Corte" hardcoded)

### Sprint 2 (próximas 2 semanas)
1. Conectar botón de reactivación en CRM con plantilla WhatsApp
2. Widget "Agente activo hoy" en dashboard home
3. Vista de huecos disponibles en Agenda

### Sprint 3 (mes 2)
1. Primer agente funcional: Agente Retención (semi-auto, genera y copia texto)
2. Agente Huecos: detecta y propone acción
3. Sistema de onboarding de agentes (activa/desactiva)

---

*Documento generado en rama feature/aaas-agentic-product-audit*
*Actualizar tras cada sprint*
