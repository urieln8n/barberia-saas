# BarberíaOS — Planes y Precios AaaS
**Agents as a Service — Pricing Strategy**
Fecha: 2026-05-23

---

## Filosofía de precios

El precio debe reflejar el valor real que genera cada plan:
- **Starter:** Ahorro de tiempo en reservas (valor estimado: 2-4h/semana)
- **Growth:** Más clientes, menos perdidos (valor estimado: 800-1500€/mes adicionales)
- **Premium:** Barbería en piloto automático (valor estimado: sistema operativo completo)

La diferenciación entre planes debe ser **por capacidad de agente**, no solo por features.

---

## Estructura de planes propuesta (AaaS)

### Starter — 29€/mes
> "Recibe reservas sin esfuerzo"

**Core:**
- Página pública de reservas online
- QR de reservas (descargable e imprimible)
- Gestión de agenda y citas
- CRUD de servicios y barberos
- Caja y pagos manuales

**Agentes IA incluidos (Fase 1 · Copiloto):**
- 🤖 Agente Reseñas IA (genera solicitudes de reseña post-corte)
- 🤖 Agente Recepcionista IA (genera respuestas a preguntas frecuentes)

**Límites:**
- Hasta 2 barberos
- 1 barbería
- 500 citas/mes

---

### Growth — 59€/mes
> "Llena tu agenda y recupera clientes perdidos"

**Todo lo de Starter, más:**
- Marketing Studio completo
- CRM de clientes con retención inteligente
- Estadísticas avanzadas por barbero
- Canal de reseñas integrado
- Recuperación de clientes perdidos

**Agentes IA incluidos (Fase 1 · Copiloto):**
- 🤖 Agente Retención IA (detecta clientes en riesgo, genera WhatsApp)
- 🤖 Agente Huecos Libres IA (detecta huecos, genera copy para stories)
- 🤖 Agente Marketing Studio IA (genera plan de contenido semanal)
- 🤖 Agente SEO & Presencia Local IA (auditoría y textos para Google Business)
- Todo lo de Starter

**Límites:**
- Hasta 5 barberos
- 1 barbería
- Citas ilimitadas

---

### Premium — 99€/mes
> "Tu barbería en piloto automático con IA"

**Todo lo de Growth, más:**
- Inventario y control de stock
- Fiscalidad y reportes avanzados
- Marketplace (visibilidad en directorio)
- Acceso anticipado a agentes en Fase 2

**Agentes IA incluidos (Fase 1 · Copiloto + Fase 2 cuando disponible):**
- 🤖 Agente Caja & Finanzas IA (resumen diario + análisis de tendencias)
- 🤖 Agente WhatsApp Business IA (generación de mensajes completos)
- 🤖 Agente Inventario & Ventas IA (alertas de stock + pedidos sugeridos)
- Todo lo de Growth
- Acceso beta a funciones semi-autónomas

**Límites:**
- Barberos ilimitados
- Multi-localización (hasta 3 sedes)
- Soporte prioritario

---

## Comparativa de valor por plan

| Feature | Starter 29€ | Growth 59€ | Premium 99€ |
|---------|-------------|-----------|-------------|
| Reservas online | ✅ | ✅ | ✅ |
| QR de reservas | ✅ | ✅ | ✅ |
| Agenda y citas | ✅ | ✅ | ✅ |
| Caja y pagos | ✅ | ✅ | ✅ |
| Marketing Studio | — | ✅ | ✅ |
| CRM de clientes | — | ✅ | ✅ |
| Estadísticas avanzadas | — | ✅ | ✅ |
| Inventario | — | — | ✅ |
| Fiscalidad | — | — | ✅ |
| Agente Reseñas IA | ✅ | ✅ | ✅ |
| Agente Recepcionista IA | ✅ | ✅ | ✅ |
| Agente Retención IA | — | ✅ | ✅ |
| Agente Huecos Libres IA | — | ✅ | ✅ |
| Agente Marketing IA | — | ✅ | ✅ |
| Agente SEO & Presencia IA | — | ✅ | ✅ |
| Agente Caja & Finanzas IA | — | — | ✅ |
| Agente WhatsApp IA | — | — | ✅ |
| Agente Inventario IA | — | — | ✅ |
| Barberos incluidos | 2 | 5 | Ilimitados |
| Sedes | 1 | 1 | 3 |

---

## Estrategia de conversión

### De Starter a Growth
**Trigger:** El dueño ve "3 clientes en riesgo" en el widget de Retención pero no puede
activar el agente. CTA: "Activa Growth para recuperarlos hoy."

**Precio psychological:** 59€/mes = 2€/día. Un cliente recuperado ya lo cubre.

### De Growth a Premium
**Trigger:** El dueño tiene >5 barberos o quiere la funcionalidad de inventario.
**Trigger:** Ve que "Agente Caja & Finanzas IA" está bloqueado en Premium.

---

## Modelo de ingresos proyectado

Asumiendo:
- 100 barberías activas al mes 6
- Distribución: 40% Starter, 45% Growth, 15% Premium

```
MRR estimado mes 6:
  40 × 29€ = 1.160€
  45 × 59€ = 2.655€
  15 × 99€ = 1.485€
  ────────────────
  Total MRR = 5.300€/mes
  ARR estimado = 63.600€
```

**Objetivo realista año 1:** 5.000-10.000€ MRR con 150-300 barberías activas.

---

## Notas para implementación

- Los precios pueden ser en EUR (España/Europa) o USD (América Latina con ajuste).
- Considerar descuento anual: -20% (Growth = 47€/mes, Premium = 79€/mes).
- Trial gratuito: 14 días sin tarjeta para Starter.
- El plan actual en código es un mock — implementar con Stripe Billing en V2.
- Ver `CLAUDE.md`: Stripe está explícitamente fuera del MVP V1.

---

*Documento generado en rama feature/aaas-agentic-product-audit*
*Revisar precios con feedback de mercado antes de publicar*
