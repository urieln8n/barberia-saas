# BarberíaOS — Auditoría Comercial: 50 Barberías × 79 €/mes

> **Meta:** 50 barberías × 79 €/mes = **3.950 € MRR**
> **Fecha:** 2026-06-04
> **Rama:** feature/barberiaos-50-clientes-audit
> **Estado:** Solo auditoría — sin modificaciones de código.

---

## 1. Estado actual del producto

### Stack técnico
| Capa | Tecnología | Estado |
|---|---|---|
| Frontend | Next.js 14 App Router + TypeScript | ✅ Producción |
| Estilos | Tailwind CSS 3.4 + Framer Motion | ✅ Premium |
| Base de datos | Supabase/PostgreSQL + RLS | ✅ 20 migraciones |
| Auth | Supabase Auth | ✅ Funcional |
| IA del dueño | OpenAI (con fallback local) | ⚠️ Modelo incorrecto |
| Pagos | Stripe instalado, flujo manual activo | ⚠️ Sin conectar real |
| Despliegue | Vercel (configurado) | ✅ Listo |
| WhatsApp | wa.me links (no API) | ✅ Funcional sin coste |
| QR | api.qrserver.com (externo gratuito) | ✅ Funcional |
| Inventario | v1 + v2 con caja | ✅ Funcional |

### Módulos existentes en `/dashboard`
| Módulo | Ruta | Estado |
|---|---|---|
| Dashboard principal | `/dashboard` | ✅ Operativo |
| Agenda día/semana/mes | `/dashboard/agenda` | ✅ Premium |
| Reservas públicas | `/r/[slug]` | ✅ Funcional |
| Clientes | `/dashboard/clientes` | ✅ Funcional |
| Servicios | `/dashboard/servicios` | ✅ CRUD completo |
| Barberos | `/dashboard/barberos` | ✅ CRUD completo |
| Caja diaria | `/dashboard/caja` | ✅ Con sesión + movimientos |
| QR de reservas | `/dashboard/qr` | ✅ Descargable + links |
| WhatsApp | `/dashboard/whatsapp` | ✅ Templates listos |
| IA del dueño | `/dashboard/ia` | ⚠️ Modelo mal configurado |
| Reseñas | `/dashboard/resenas` | ✅ Con respuesta IA |
| Fidelización | `/dashboard/fidelizacion` | ✅ Tarjetas + sellos |
| Marketing Studio | `/dashboard/marketing` | ✅ Campañas + presencia |
| Inventario | `/dashboard/inventario` | ✅ v2 con caja |
| Ajustes | `/dashboard/ajustes` | ✅ Nombre, slug, plan |
| Admin (fundador) | `/admin` | ✅ Leads, deals, MRR |
| Landing comercial | `/` | ✅ Ultra VIP |

---

## 2. Qué ya se puede vender HOY

Estos módulos están funcionales y generan valor inmediato para una barbería:

### ✅ Listo para demostrar y vender

**Reservas online (`/r/[slug]`)**
- El cliente reserva desde móvil sin app
- Selecciona servicio, barbero, fecha y hora
- Validación de doble reserva activa
- Tracking de visitas de página

**Agenda visual (`/dashboard/agenda`)**
- Vista día, semana, mes, por barbero y oportunidades
- Línea "Ahora" en tiempo real
- Colapso de horas pasadas
- Huecos libres detectados automáticamente
- Grid premium con contraste y estructura

**QR de reservas (`/dashboard/qr`)**
- QR generado instantáneamente con la URL pública
- Links para Instagram, WhatsApp y Google Business
- Snippet HTML para web externa

**Caja diaria (`/dashboard/caja`)**
- Apertura/cierre de sesión de caja
- Registro de cobros con método de pago
- Vinculación a cliente, barbero y servicio
- Rendimiento por barbero
- Venta de productos de inventario

**Clientes con historial (`/dashboard/clientes`)**
- Última visita, servicio e importe
- Total de citas por cliente
- RetentionActions para clientes perdidos
- Búsqueda en tiempo real

**Fidelización (`/dashboard/fidelizacion`)**
- Programa de sellos configurable
- Canje de recompensas
- Panel de clientes cerca del premio
- QR de tarjeta de fidelización

**WhatsApp templates (`/dashboard/whatsapp`)**
- Mensajes prediseñados para responder en wa.me
- Templates de precios, horarios, confirmación, recuperación
- Sin coste de API (wa.me links directos)

**Dashboard con métricas (`/dashboard`)**
- Citas de hoy y próximas
- Facturación del día
- Clientes dormidos
- Checklist de activación
- Acción recomendada inteligente

**Landing comercial (`/`)**
- UltraVipLanding premium y completa
- SEO optimizado con múltiples rutas
- FAQ, precios, testimonios, features

---

## 3. Qué bloquea vender a 50 barberías

### 🔴 Bloqueadores críticos

**B1 — Sin cobro automatizado**
- Stripe está instalado pero NO conectado en producción
- El dueño actual cobra manualmente (transferencia, Bizum, etc.)
- Con 50 clientes, cobrar a mano es inviable
- **Impacto:** 50 clientes imposible sin automatizar el cobro

**B2 — Modelo de OpenAI incorrecto**
- El código usa `gpt-5.4-mini` que NO existe en OpenAI
- Si la OPENAI_API_KEY está configurada, la IA falla silenciosamente
- **Impacto:** La IA del dueño no funciona en producción

**B3 — Sin email de confirmación al cliente**
- Cuando un cliente reserva en `/r/[slug]`, no recibe confirmación
- El dueño tampoco recibe alerta de nueva reserva
- **Impacto:** Reservas se pierden, el cliente no sabe si su cita fue confirmada

**B4 — Onboarding incompleto**
- Solo pide nombre, slug y teléfono
- Falta: horarios de apertura, fotos, descripción pública, barbers iniciales, servicios de ejemplo
- **Impacto:** El barbero no puede operar el día 1 sin configurar todo manualmente

**B5 — Sin demo pública seedeada**
- No hay `/demo` con datos reales de ejemplo
- No se puede mostrar en visitas de venta sin cuenta propia
- **Impacto:** Dificulta el cierre comercial en barbería

### 🟡 Bloqueadores secundarios

**B6 — Supabase RLS en producción**
- Las 20 migraciones existen pero deben aplicarse en producción
- Sin RLS activo, una barbería puede ver datos de otra
- **Impacto:** Riesgo de seguridad crítico antes de escalar

**B7 — Sin sistema de soporte documentado**
- No hay base de conocimiento para dueños
- Cada barbería requerirá WhatsApp directo del fundador
- **Impacto:** Con 50 clientes, el soporte colapsa

**B8 — QR sin logo de la barbería**
- El QR usa api.qrserver.com sin personalización
- Si ese servicio falla o cambia, el QR deja de funcionar
- **Impacto:** Dependencia externa sin control

**B9 — Sin recordatorios automáticos de cita**
- No hay recordatorio 24h antes para el cliente
- **Impacto:** Tasa de no-show alta, ingresos perdidos

**B10 — Ajustes de barbería limitados**
- No se pueden configurar horarios de apertura en UI
- Foto/logo no se puede subir desde el panel
- **Impacto:** La página pública `/r/[slug]` queda incompleta

---

## 4. Top 10 mejoras con impacto comercial

Ordenadas por impacto en cierre de ventas y retención de clientes.

| # | Mejora | Impacto | Esfuerzo | Prioridad |
|---|---|---|---|---|
| 1 | Corrección modelo OpenAI (`gpt-4o-mini`) | IA funciona en prod | 10 min | 🔴 AHORA |
| 2 | Email de confirmación al cliente (Resend/SMTP) | Reservas profesionales | 1 día | 🔴 AHORA |
| 3 | Notificación al dueño de nueva reserva | Control operativo | 4h | 🔴 AHORA |
| 4 | Demo pública seedeada (`/demo` con datos reales) | Cierra ventas | 1 día | 🔴 ANTES VISITAS |
| 5 | Onboarding paso a paso (horarios + servicios ejemplo) | Activa en día 1 | 2 días | 🟠 SEMANA 1 |
| 6 | QR con logo propio (generación local en canvas) | Presentación profesional | 1 día | 🟠 SEMANA 1 |
| 7 | Stripe conectado (plan Pro 79€/mes) | MRR automatizado | 2 días | 🟠 SEMANA 2 |
| 8 | Recordatorio SMS/WhatsApp 24h antes (wa.me link automático) | Reduce no-show | 1 día | 🟠 SEMANA 2 |
| 9 | Base de conocimiento / FAQs para dueños | Reduce soporte | 1 día | 🟡 MES 1 |
| 10 | Upload de logo/foto desde ajustes | Página pública completa | 1 día | 🟡 MES 1 |

---

## 5. Riesgos técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| RLS no aplicado en prod (barbería ve datos de otra) | Alta si no se verifica | Crítico | Auditar Supabase antes de onboardear cliente 2 |
| api.qrserver.com cae | Baja | Alto | Generar QR localmente con `qrcode` npm package |
| OpenAI `gpt-5.4-mini` devuelve error | Alta (modelo no existe) | Medio | Cambiar a `gpt-4o-mini` — 10 minutos de fix |
| Supabase free tier (500MB, 50k auth users) | Baja con 50 clientes | Bajo | Plan Pro a 25$/mes aguanta 50 barberías |
| Vercel free tier límite de funciones | Baja | Medio | Hobby plan aguanta, Pro si se escala |
| SECURITY_AUDIT_SERVICE_URL no configurada | Alta (servicio externo) | Bajo | El módulo Shield es interno, no bloqueante |
| Stripe webhooks sin configurar | Cuando se active | Alto | Testear en modo test antes de prod |
| Concurrencia de reservas dobles | Baja (hay validación) | Medio | `checkSlotAvailability` ya existe en actions.ts |

---

## 6. Riesgos de soporte

| Riesgo | Descripción | Solución |
|---|---|---|
| Dueño no sabe configurar servicios/barberos | Onboarding sin guía | Video de 3 min + checklist en dashboard |
| El cliente no sabe usar el QR | Falta de instrucciones físicas | Incluir hoja de instrucciones imprimible |
| Cita duplicada manual vs online | Sin bloqueo visual en agenda | Ya resuelto en agenda, falta comunicarlo |
| "¿Por qué no me llegan reservas?" | No compartió el link/QR | Recordatorio en dashboard de activación |
| Caja abierta y olvidada | El dueño no cierra sesión | Alerta visual si hay sesión abierta >12h |
| IA no responde | Sin OpenAI key o modelo incorrecto | Fix urgente + modo local visible |
| Cambio de slug rompe QR | El dueño cambia el slug y los QR impresos dejan de funcionar | Bloquear cambio de slug si hay citas activas |

---

## 7. Roadmap de 7 días

### Día 1 — Bugs críticos (sin los cuales no se puede vender)
- [ ] Fix modelo OpenAI: `gpt-5.4-mini` → `gpt-4o-mini` (1 archivo)
- [ ] Verificar que RLS está activo en Supabase producción
- [ ] Test completo de `/r/[slug]` en móvil real

### Día 2 — Email de confirmación
- [ ] Integrar Resend (plan gratuito: 100 emails/día)
- [ ] Email al cliente al confirmar reserva (nombre, servicio, hora, dirección)
- [ ] Email/notificación al dueño de nueva reserva

### Día 3 — Demo pública seedeada
- [ ] Crear barbería demo: "Barbería El Barrio" con slug `el-barrio`
- [ ] Seed: 3 servicios, 2 barberos, 10 citas de ejemplo, 5 clientes
- [ ] Script de seed en `supabase/seed-demo.sql`
- [ ] Ruta `/demo` que redirige a `/r/el-barrio`

### Día 4 — Onboarding mejorado
- [ ] Paso 2 del onboarding: servicios de ejemplo predefinidos (Corte, Barba, Combo)
- [ ] Paso 3: horario de apertura básico (L-V 9-20, S 9-14)
- [ ] Checklist de activación visible desde día 1

### Día 5 — QR premium
- [ ] Generar QR localmente con canvas (eliminar dependencia de api.qrserver.com)
- [ ] Añadir nombre de la barbería bajo el QR
- [ ] Descarga en PNG de alta resolución

### Día 6 — Preparar visita comercial
- [ ] Documento de presentación: qué enseñar y en qué orden
- [ ] Script de demo de 10 minutos
- [ ] Hoja de precios clara: Starter 49€ / Pro 79€ / Premium 129€

### Día 7 — QA y prueba real
- [ ] Prueba completa en móvil: reserva → agenda → caja → cliente → cierre
- [ ] Verificar emails en producción
- [ ] Test con número de WhatsApp real

---

## 8. Roadmap de 30 días

### Semana 1 (días 1-7)
Ver roadmap de 7 días anterior.

### Semana 2 (días 8-14) — Monetización
- [ ] Conectar Stripe en modo test (plan Pro 79€/mes)
- [ ] Flujo: registro → prueba 14 días → pago → acceso
- [ ] Panel admin `/admin/suscripciones` con MRR real
- [ ] Recordatorio de cita: wa.me link automático generado 24h antes
- [ ] Upload de logo/foto desde `/dashboard/ajustes`

### Semana 3 (días 15-21) — Retención de barberías
- [ ] Base de conocimiento: 10 artículos cortos (cómo añadir servicio, cómo compartir QR, etc.)
- [ ] Vídeo de onboarding de 5 minutos (Loom)
- [ ] Email de bienvenida automatizado al registrarse
- [ ] Panel de estado del sistema (uptime, última sincronización)

### Semana 4 (días 22-30) — Escala a primeras 10 barberías
- [ ] Visitar 10 barberías con demo lista
- [ ] Cerrar primeros 3-5 contratos Pro a 79€/mes
- [ ] Recoger feedback real de uso
- [ ] Priorizar mejoras según feedback
- [ ] Documentar proceso de onboarding manual (hasta que sea automático)

### Meses 2-3 — Escala a 50
- [ ] Automatizar onboarding completamente (sin intervención manual)
- [ ] Sistema de referidos: barbería recomienda y gana 1 mes gratis
- [ ] App móvil progresiva (PWA) para el dueño
- [ ] Recordatorios automáticos reales (WhatsApp Business API o SMS)
- [ ] Reportes mensuales automáticos por email
- [ ] Soporte in-app (Crisp o Intercom free tier)

---

## 9. Qué terminar antes de visitar barberías

### Checklist mínimo para salir a vender

- [ ] **Fix OpenAI model** — `gpt-4o-mini` funciona en producción
- [ ] **Demo seedeada** — `/demo` funciona en móvil sin login
- [ ] **Email de confirmación** — El cliente recibe email al reservar
- [ ] **QR descargable** — Alta resolución, sin dependencia externa
- [ ] **Reserva en móvil < 90 segundos** — Probado en iPhone y Android
- [ ] **Caja abre y cierra correctamente** — Flujo completo sin errores
- [ ] **Agenda operativa** — El dueño puede ver y gestionar el día
- [ ] **WhatsApp templates** — Listo para copiar y pegar
- [ ] **Precio claro** — Hoja con plan Pro 79€/mes impresa
- [ ] **Contrato simple** — 1 página: qué incluye, cómo cancela, setup fee

### Datos para la presentación comercial
- Barberías en España: ~15.000
- Ticket medio por cliente: 18-35€
- Visitas/mes por cliente: 2-3
- Beneficio potencial de recuperar 5 clientes dormidos: 300-500€/mes
- Coste de BarberíaOS Pro: 79€/mes = 2,6€/día
- ROI: si recupera 5 clientes, paga el software y le sobra

---

## 10. Qué demo enseñar para cerrar el plan Pro 79€/mes

### Script de demo en 10 minutos

**Minuto 1-2 — La web de reservas (gancho principal)**
> "Mira, este es el link de reservas de tu barbería. El cliente entra desde Instagram, escanea el QR o le mandas el link por WhatsApp. Elige servicio, barbero y hora. No necesita instalar nada."
- Abrir `/r/el-barrio` en móvil del barbero
- Hacer una reserva de prueba en vivo

**Minuto 3-4 — La agenda (control operativo)**
> "En cuanto ese cliente reserva, aquí aparece. Ves quién viene, a qué hora, con qué barbero y cuánto vas a cobrar."
- Mostrar agenda vista día con la cita recién creada
- Mostrar la línea "Ahora" y los huecos disponibles

**Minuto 5-6 — El QR (herramienta de marketing física)**
> "Este QR lo imprimes, lo pones en el escaparate, en la silla del cliente, en una tarjeta de visita. El cliente escanea y reserva en 60 segundos."
- Mostrar el QR en pantalla
- Descargar el QR en alta resolución

**Minuto 7-8 — La caja (dinero del día)**
> "Al final del día ves exactamente cuánto has cobrado, con qué método, con qué barbero. No hace falta cuadrar a mano."
- Mostrar CajaClient con movimientos del día
- Mostrar cierre con resumen de caja

**Minuto 9 — Los clientes (los que no vuelven)**
> "Aquí ves todos tus clientes, cuándo fue la última vez que vinieron y cuánto te han dejado. Puedo mandarte un mensaje a los que llevan más de 30 días sin venir."
- Mostrar lista de clientes con última visita
- Mostrar RetentionActions

**Minuto 10 — Cierre comercial**
> "Todo esto por 79€/mes. Sin comisiones por reserva. Sin permanencia. Si en 30 días no ves el valor, te devuelvo el dinero. ¿Empezamos?"
- Mostrar precio en la hoja impresa
- Pedir teléfono para configurar la barbería ese mismo día

### Objeciones frecuentes y respuestas

| Objeción | Respuesta |
|---|---|
| "Yo ya uso WhatsApp" | "WhatsApp es para chatear. Esto es para que el cliente reserve solo a las 2 de la mañana mientras duermes." |
| "Booksy es gratis" | "Booksy cobra por reserva y tus clientes son de Booksy, no tuyos. Aquí los clientes son tuyos." |
| "No sé usar estas cosas" | "En 20 minutos lo tienes funcionando. Lo configuramos juntos ahora mismo." |
| "79€ es mucho" | "¿Cuánto cobras por un corte? Si recuperas 5 clientes dormidos, el software está pagado." |
| "Lo pienso" | "Te doy 14 días gratis. Si no ves el valor, no pagas." |

---

## Resumen ejecutivo

| Dimensión | Estado |
|---|---|
| **Producto** | 85% listo — falta fix IA, emails y demo |
| **Ventas** | No empezar hasta tener demo seedeada |
| **Técnico** | Sólido — RLS, multi-tenant, TypeScript |
| **Monetización** | Manual hasta conectar Stripe |
| **Soporte** | Escalable solo hasta ~10 barberías sin base de conocimiento |
| **MRR objetivo** | 3.950 €/mes con 50 barberías × 79 € |
| **Tiempo para primera venta** | 7 días (con el roadmap aplicado) |
| **Tiempo para 50 barberías** | 60-90 días (ventas + onboarding manual) |

---

*Generado por BarberíaOS 50 Clientes Audit — 2026-06-04*
