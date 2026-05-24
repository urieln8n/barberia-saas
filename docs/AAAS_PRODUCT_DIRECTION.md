# BarberíaOS — Dirección de Producto AaaS

**Fecha:** 2026-05-24  
**Versión:** 1.0 — Fase AaaS Foundation

---

## Qué es BarberíaOS

BarberíaOS = **Core SaaS + AaaS Layer + Lounge Module**

> "La plataforma que permite a barberías gestionar reservas, clientes y crecimiento — con agentes IA que trabajan mientras el dueño corta."

### Frase de posicionamiento principal
**"Tus agentes IA trabajan mientras tú cortas."**

---

## Las tres capas del producto

### 1. Core SaaS (base operativa)
El sistema de gestión que toda barbería necesita:

- Reservas online con QR y página pública
- Agenda y calendar de citas
- CRUD de clientes, barberos, servicios
- Caja diaria y pagos manuales
- Validación anti-doble reserva
- Panel de control del dueño
- Resumen diario

**Plan:** Core 39€/mes

### 2. AaaS Layer (Agents as a Service)
La capa de inteligencia que diferencia BarberíaOS:

- Agentes IA que detectan oportunidades en los datos del negocio
- Generan mensajes, campañas, reportes listos para ejecutar
- El dueño aprueba con un clic — los agentes no actúan solos
- Conectado a datos reales: agenda, caja, clientes, servicios

**Agentes disponibles:**
1. Recepcionista IA WhatsApp (Beta → Premium IA)
2. Agente de Reseñas IA
3. Agente de Retención IA
4. Agente de Huecos Libres
5. Marketing Studio IA
6. Agente Caja & Inventario (próximamente)
7. Agente Lounge (próximamente)
8. Andrés Video Studio (suite externa futura)

**Plan:** Pro 79€/mes (agentes básicos) / Premium IA 149€/mes (todos los agentes)

### 3. BarberíaOS Lounge
El módulo que convierte la sala de espera en un canal de ventas, reservas y reseñas:

- Página pública mobile-first para clientes en espera
- QR específico para el Lounge (diferente al QR de reservas)
- Productos destacados, servicios upgrade, promociones activas
- Botón de reserva, reseña Google, WhatsApp
- Métricas: escaneos, clicks reservar, clicks productos
- Futuro: Lounge TV (pantalla en sala), Lounge Ads

**Incluido en:** Pro 79€/mes (básico) / Premium IA 149€/mes (con Agente Lounge)

---

## Los agentes premium en detalle

### Recepcionista IA WhatsApp
- **Estado:** Beta privada
- **Qué hace:** Responde mensajes de WhatsApp/Instagram 24/7. Consulta disponibilidad, redirige a reservas, escala a humano si es necesario.
- **Valor:** El dueño no necesita estar pendiente del teléfono fuera de horario.
- **Plan:** Premium IA

### Agente de Reseñas IA
- **Estado:** Activo (Fase 1 Copiloto)
- **Qué hace:** Genera el mensaje perfecto de solicitud de reseña después de cada cita. Responde críticas negativas con tono profesional.
- **Valor:** Más reseñas en Google = más visibilidad local.
- **Plan:** Starter

### Agente de Retención IA
- **Estado:** Activo (Fase 1 Copiloto)
- **Qué hace:** Detecta clientes con más de 30-45 días sin visita. Genera mensaje WhatsApp personalizado listo para enviar.
- **Valor:** El 30% de clientes dormidos vuelve con un mensaje bien redactado.
- **Plan:** Growth

### Agente de Huecos Libres
- **Estado:** Activo (Fase 1 Copiloto)
- **Qué hace:** Detecta horas vacías en la agenda. Calcula ingreso perdido. Genera copy para Instagram Stories y WhatsApp.
- **Valor:** Llenar huecos = ingresos directos ese mismo día.
- **Plan:** Growth

### Marketing Studio IA
- **Estado:** Activo (Fase 1 Copiloto)
- **Qué hace:** Analiza datos reales y genera posts, stories, mensajes WhatsApp. Plan de contenido semanal en 10 segundos.
- **Valor:** Presencia digital sin invertir horas en copywriting.
- **Plan:** Growth

### Agente Caja & Inventario
- **Estado:** Próximamente
- **Qué hace:** Detecta productos con stock bajo, oportunidades de upsell, ventas perdidas.
- **Plan:** Premium IA

### Agente Lounge
- **Estado:** Próximamente
- **Qué hace:** Personaliza el contenido del Lounge según historial del cliente. Detecta oportunidades de upgrade en sala de espera.
- **Plan:** Premium IA

---

## Cómo se vende — Los 3 planes

### Core · 39€/mes
Reservas, agenda, clientes, barberos, servicios, QR, caja básica.

**Para quién:** Barbería que empieza con reservas online.

**Features:**
- Reservas online + página pública
- QR de reservas
- Agenda y calendario
- CRUD clientes / barberos / servicios
- Caja básica
- Agente Reseñas IA (Fase 1)

### Pro · 79€/mes
Todo de Core + Marketing Studio, Lounge básico, reseñas copiloto, clientes perdidos.

**Para quién:** Barbería que quiere crecer y automatizar marketing.

**Features adicionales:**
- BarberíaOS Lounge (básico)
- Marketing Studio IA completo
- Agente Retención IA
- Agente Huecos Libres IA
- Automatizaciones de recordatorio
- Estadísticas avanzadas

### Premium IA · 149€/mes
Todo de Pro + Centro Agentes IA completo, Recepcionista WhatsApp, Agente Lounge.

**Para quién:** Barbería que quiere el sistema en piloto automático.

**Features adicionales:**
- Recepcionista IA WhatsApp 24/7
- Agente Lounge (personalización)
- Agente Caja & Inventario
- Dashboard de métricas de agentes
- Soporte prioritario

---

## Implementación actual vs fases futuras

### Implementado ahora (Fase 1 AaaS)
- AgentsClient con 8 agentes (4 activos, 1 beta, 3 próximamente)
- runAgentAction server action para ejecutar agentes
- Dashboard con bloque AaaS teaser y SmartAlerts
- Módulo Lounge completo:
  - `/dashboard/lounge` — Panel de gestión
  - `/dashboard/lounge/qr` — QR del Lounge
  - `/lounge/[slug]` — Página pública mobile-first
- RecommendedActionCard componente reutilizable
- Sidebar con entrada Lounge

### Fase 2 — Conectar agentes a datos reales
- runAgentAction retorna mensajes generados desde datos Supabase
- Métricas reales de ejecuciones de agentes
- Historial de acciones de agentes
- tabla `agent_runs` en Supabase

### Fase 3 — Semi-autonomía
- Recepcionista IA conectado a WhatsApp Business API real
- Agente Reseñas envía automáticamente (con aprobación)
- Scheduling de campañas de retención

### Fase 4 — Autonomía
- Agentes actúan 24/7 sin aprobación manual
- Dashboard de ROI de agentes (ingresos generados, clientes recuperados)
- Andrés Video Studio integrado

---

## Andrés Video Studio como add-on externo

**Qué es:** Suite premium de creación de contenido video para barberías.

**Qué hace:** Crea guiones, vídeos, contenido premium para redes sociales. Especializado para barberías que quieren crecer con video marketing.

**Modelo:** Add-on externo al ecosistema BarberíaOS. No integrado en los planes base.

**Estado:** Planificado. No implementar hasta Fase 4.

**Posicionamiento:** "Parte del ecosistema de agencias IA de Andrés Rendón."

---

## Posicionamiento frente a competidores

| Característica | BarberíaOS | Booksy | Treatwell |
|---------------|-----------|--------|-----------|
| Reservas online | ✓ | ✓ | ✓ |
| Sin comisión por reserva | ✓ | ✗ | ✗ |
| Agentes IA propios | ✓ | ✗ | ✗ |
| Lounge (sala de espera) | ✓ | ✗ | ✗ |
| Marketing IA | ✓ | ✗ | ✗ |
| Precio justo fijo | 39-149€/mes | % comisión | % comisión |
| Datos propios del negocio | ✓ | ✗ | ✗ |
