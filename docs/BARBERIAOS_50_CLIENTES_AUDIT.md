# BarberíaOS — Auditoría Comercial
## 50 Barberías × 79 €/mes = 3.950 € MRR

> **Skill:** barberiaos-50-clientes
> **Rama:** feature/barberiaos-50-clientes-audit
> **Fecha:** 2026-06-04
> **Modo:** Solo auditoría — cero modificaciones de código

---

## 1. Estado actual del producto

### Stack técnico auditado

| Capa | Tecnología | Versión | Estado |
|---|---|---|---|
| Framework | Next.js App Router | 14.2.30 | ✅ Producción |
| Lenguaje | TypeScript | 5.6.3 | ✅ Tipado completo |
| Estilos | Tailwind CSS + Framer Motion | 3.4 + 12.x | ✅ Premium |
| Base de datos | Supabase / PostgreSQL | 2.45.4 | ✅ 20 migraciones |
| Auth | Supabase Auth | integrada | ✅ Middleware activo |
| IA del dueño | OpenAI con fallback local | SDK 6.x | ⚠️ Modelo incorrecto |
| Pagos | Stripe (instalado, no conectado) | 17.x | ⚠️ Solo estructura |
| Deploy | Vercel | — | ✅ Configurado |
| WhatsApp | wa.me links (sin API) | — | ✅ Sin coste |
| QR | api.qrserver.com (externo) | — | ⚠️ Dependencia externa |
| Animaciones 3D | Three.js + R3F | 0.184 | ⚠️ Peso innecesario en prod |

### Planes de precios definidos en código

| Plan | Precio | Barberos | Servicios | Módulos incluidos |
|---|---|---|---|---|
| Free | 0 € | 1 | 5 | Pagos básicos |
| **Starter** | **39 €/mes** | **2** | **Ilimitados** | Pagos |
| **Pro** | **79 €/mes** | **6** | **Ilimitados** | Pagos + Finanzas + Reseñas |
| Growth | 149 €/mes | 12 | Ilimitados | Todo + WhatsApp + Automatizaciones |
| Premium | 299 €/mes | Ilimitados | Ilimitados | Todo |

**El plan objetivo de venta es Pro a 79 €/mes.** Está correctamente definido en `src/lib/stripe/plans.ts` y `src/lib/plans/limits.ts`.

### Migraciones de base de datos (20 aplicadas)

| Migración | Contenido |
|---|---|
| 001 | Schema inicial: barbershops, barbers, services, clients, appointments |
| 002 | Fixes de producción |
| 003 | Gastos (expenses) |
| 004 | Fix RLS para members |
| 005 | Admin y super admin |
| 006 | CRM de leads |
| 007 | Subscripciones (plan, estado, MRR) |
| 008 | Roles de plataforma |
| 009 | Stripe billing |
| 010 | Reseñas base |
| 011 | CRM de clientes |
| 012 | Asistente de caja |
| 013 | Marketplace y auditoría |
| 014-015 | Inventario v1 y v2 |
| 016-017 | Marketplace maps y eventos |
| 018 | Reglas de automatización |
| 019 | Peticiones de IA |
| 020 | Growth engine |

### Módulos del dashboard auditados

| Módulo | Ruta | Estado | Observaciones |
|---|---|---|---|
| Dashboard principal | `/dashboard` | ✅ Operativo | Stats, checklist, IA recomendada, quick booking |
| Agenda | `/dashboard/agenda` | ✅ Premium | Día/semana/mes/barberos/oportunidades |
| Clientes | `/dashboard/clientes` | ✅ Funcional | Stats, búsqueda, retención, última visita |
| Servicios | `/dashboard/servicios` | ✅ CRUD completo | Límites por plan activos |
| Barberos | `/dashboard/barberos` | ✅ CRUD + horarios | Horarios por barbero, cierres, toggles |
| Reservas públicas | `/r/[slug]` | ✅ 5 pasos | Servicio→Barbero→Fecha→Datos→Confirmar |
| Caja | `/dashboard/caja` | ✅ Sesiones + cierre | Cobros, inventario, rendimiento por barbero |
| QR | `/dashboard/qr` | ✅ Descargable | Links Instagram, WhatsApp, Google, widget |
| WhatsApp | `/dashboard/whatsapp` | ✅ Templates | Sin API — wa.me links con texto preescrito |
| IA del dueño | `/dashboard/ia` | ⚠️ Bug modelo | OpenAI + fallback local. Modelo mal puesto |
| Reseñas | `/dashboard/resenas` | ✅ Con IA | Token público, respuesta sugerida por IA |
| Fidelización | `/dashboard/fidelizacion` | ✅ Completo | Sellos, canjes, clientes cerca del premio |
| Marketing Studio | `/dashboard/marketing` | ✅ 4 tabs | Plantillas, Presencia, Campañas, Historial |
| Inventario | `/dashboard/inventario` | ✅ v2 | Conectado a caja para venta en mostrador |
| Ajustes | `/dashboard/ajustes` | ⚠️ Básico | Solo nombre, slug, plan. Sin foto/logo |
| Admin | `/admin` | ✅ MRR real | Leads, deals, tasks, suscripciones |
| Demo | `/demo` | ⚠️ Sin datos reales | Página existe, pero dashboard es estático |

---

## 2. Qué ya está vendible hoy

### ✅ Valor inmediato para una barbería

**Reservas online sin app (`/r/[slug]`)**
- Flujo de 5 pasos: Servicio → Barbero → Fecha y hora → Datos → Confirmar
- Disponibilidad real calculada por horario de barbero y citas existentes
- Rate limiting: 8 reservas/hora por IP, 3 por teléfono (antiabuso)
- Validación de doble reserva activa (`checkSlotAvailability`)
- Prefill de última reserva del cliente (localStorage)
- Metadata SEO dinámica por barbería
- Funcionamiento sin login para el cliente

**Agenda operativa (`/dashboard/agenda`)**
- 5 vistas: día, semana, mes, por barbero, oportunidades
- Colapso de horas pasadas con overlay y contador
- Línea "Ahora" en tiempo real con scroll automático
- Huecos libres detectados y agrupados automáticamente
- Panel de detalle con cambio de estado inline
- QuickBookingPanel desde huecos

**QR premium (`/dashboard/qr`)**
- QR generado con URL pública de la barbería
- Links listos para pegar: Instagram, WhatsApp, Google Business
- Snippet HTML para web externa
- Descarga en PNG

**Caja diaria (`/dashboard/caja`)**
- Apertura/cierre de sesión
- Cobros vinculados a cliente, barbero y servicio
- Métodos de pago múltiples (efectivo, tarjeta, Bizum, etc.)
- Propinas, descuentos
- Venta de productos de inventario
- Rendimiento por barbero
- Cierre con resumen imprimible

**Barberos con horarios reales**
- CRUD de barberos con toggle activo/inactivo
- Horarios por día de la semana por barbero
- Cierres y festivos configurables
- La disponibilidad del booking usa estos horarios

**Clientes con historial (`/dashboard/clientes`)**
- Última visita, servicio recibido, barbero, estado
- Total de citas por cliente
- Mensaje de retención copiable listo para WhatsApp
- Búsqueda en tiempo real
- Link directo para reservar de nuevo

**Fidelización (`/dashboard/fidelizacion`)**
- Programa de sellos configurable (nombre, sellos requeridos, recompensa)
- Añadir/quitar sellos manualmente por cliente
- Panel de clientes cerca del premio
- QR de tarjeta de fidelización pública

**WhatsApp sin API (`/dashboard/whatsapp`)**
- Templates listos para copiar: precios, horarios, confirmación, huecos, recuperación
- Construcción automática del wa.me link con mensaje preescrito
- Cero coste de API

**Dashboard operativo (`/dashboard`)**
- Citas hoy y próximas
- Facturación del día
- Clientes dormidos
- Checklist de activación gamificado
- Acción recomendada con inteligencia
- QuickBooking sin salir del panel

**Marketing Studio (`/dashboard/marketing`)**
- Plantillas de texto para Instagram, WhatsApp, Google
- Presencia digital: estado de Google Business, Instagram, web
- Historial de campañas
- Consejo semanal rotativo

**Reseñas con IA**
- Enlace personalizado para pedir reseña al cliente
- Respuesta sugerida por IA (cuando OpenAI funcione)
- Guardado de URL de Google Reviews

**Admin fundador (`/admin`)**
- MRR calculado desde tabla subscriptions
- Leads CRM con estados y próximas acciones
- Deals con valor y fecha de cierre esperada
- Tareas con prioridades
- Métricas de plataforma: barberías, barberos, citas totales

**Landing comercial (`/`)**
- UltraVipLanding con todas las secciones premium
- SEO con múltiples rutas de destino
- Páginas SEO: `/programa-fidelizacion-barberias`, `/tarjeta-puntos-digital-barberia`, `/alternativa-booksy-barberias`
- Página de demo en `/demo`

---

## 3. Qué bloquea vender a 50 barberías

### 🔴 Bloqueadores críticos (impiden operar)

**B1 — Modelo OpenAI incorrecto**
- Archivo: `src/lib/ai/openai-client.ts`
- Código actual: `DEFAULT_OWNER_AI_MODEL = "gpt-5.4-mini"` — este modelo NO existe
- El sistema tiene fallback local (funciona), pero la IA del dueño no responde con OpenAI aunque tengan API key
- **Fix:** Cambiar a `gpt-4o-mini` — 1 línea de código, 5 minutos

**B2 — Sin email de confirmación al cliente**
- Cuando un cliente reserva en `/r/[slug]`, no recibe ninguna confirmación
- El dueño tampoco recibe notificación inmediata de nueva reserva
- **Riesgo real:** El cliente piensa que la reserva no llegó y reserva otra vez o llama
- **Fix:** Integrar Resend (100 emails/día gratis) — 1 día

**B3 — Sin cobro automatizado**
- Stripe está instalado en el código pero NO conectado en producción
- La tabla `subscriptions` existe con campos stripe_*, pero sin webhook real
- Con 50 clientes, cobrar manualmente es inviable
- **Fix:** Conectar Stripe en modo producción — 2 días

**B4 — Demo sin datos reales interactivos**
- `/demo` existe con buena presentación comercial, pero el dashboard es estático
- `BUSINESS_CONFIG.demoBookingUrl` apunta a una URL demo, pero si no hay una barbería seedeada con ese slug, falla
- En visitas de venta no se puede mostrar en el teléfono del barbero sin cuenta propia
- **Fix:** Seed de barbería demo completa — 1 día

**B5 — Onboarding sin horarios ni servicios de ejemplo**
- El onboarding solo pide nombre, slug, ciudad y teléfono
- El barbero termina en el dashboard vacío: sin servicios, sin barberos, sin horarios
- No sabe qué hacer primero
- **Fix:** Paso 2 del onboarding con servicios de ejemplo y horarios default — 1 día

### 🟡 Bloqueadores secundarios (limitan escala)

**B6 — QR con dependencia externa**
- `https://api.qrserver.com/v1/create-qr-code/` es un servicio gratuito de terceros
- Sin logo de la barbería, sin control sobre disponibilidad
- Si cae, todos los QR de todas las barberías dejan de verse
- **Fix:** Generación local con canvas o librería npm — 1 día

**B7 — Ajustes de barbería muy básicos**
- No se puede subir logo o foto de portada desde el panel
- La página pública `/r/[slug]` no muestra foto ni descripción atractiva
- **Fix:** Upload a Supabase Storage + campo description — 1-2 días

**B8 — Sin recordatorio de cita al cliente**
- No hay recordatorio 24h antes para reducir no-shows
- **Fix:** Job nocturno con Resend o wa.me link automático — 1 día

**B9 — Sin base de conocimiento / soporte escalable**
- Con 50 clientes, cualquier duda va al WhatsApp del fundador
- **Fix:** 10 artículos FAQ + video de 5 min + base de conocimiento

**B10 — Slug no se puede cambiar con seguridad**
- Si el dueño cambia el slug, todos los QR impresos dejan de funcionar
- No hay advertencia en la UI
- **Fix:** Bloquear cambio de slug si hay citas activas — 2 horas

---

## 4. Top 10 mejoras prioritarias con impacto comercial

| # | Mejora | Archivo principal | Impacto | Esfuerzo | Urgencia |
|---|---|---|---|---|---|
| 1 | Fix modelo OpenAI → `gpt-4o-mini` | `src/lib/ai/openai-client.ts` | IA funciona en producción | 5 min | 🔴 HOY |
| 2 | Email confirmación al cliente (Resend) | `app/r/[slug]/actions.ts` | Reservas profesionales, cero dudas | 1 día | 🔴 ESTA SEMANA |
| 3 | Notificación al dueño de nueva reserva | `app/r/[slug]/actions.ts` | El dueño está al tanto en tiempo real | 4 h | 🔴 ESTA SEMANA |
| 4 | Seed de demo interactiva (`el-barrio`) | `supabase/seed-demo.sql` | Cierra ventas en visitas | 1 día | 🔴 ANTES DE VISITAS |
| 5 | Onboarding con servicios + horarios default | `app/onboarding/` | Primera activación < 5 min | 2 días | 🟠 SEMANA 1 |
| 6 | QR local con logo (canvas/npm) | `app/dashboard/qr/QRClient.tsx` | QR premium y sin dependencia | 1 día | 🟠 SEMANA 1 |
| 7 | Upload de logo/foto de portada | `app/dashboard/ajustes/` | Página pública atractiva | 1 día | 🟠 SEMANA 2 |
| 8 | Stripe conectado (plan Pro 79€) | `app/dashboard/ajustes/` | MRR automatizado, 0 cobros manuales | 2 días | 🟠 SEMANA 2 |
| 9 | Recordatorio de cita (wa.me automático) | Nueva acción en cron/scheduler | Reduce no-shows ~30% | 1 día | 🟡 MES 1 |
| 10 | Base de conocimiento para dueños | Docs externos o `/ayuda` | Elimina soporte manual por WhatsApp | 2 días | 🟡 MES 1 |

---

## 5. Riesgos técnicos

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| RLS sin verificar en producción | Alta | Crítico — barbería A ve datos de B | Auditar tabla por tabla en Supabase Dashboard antes de cliente 2 |
| OpenAI `gpt-5.4-mini` no existe | Certeza | Medio — IA siempre usa fallback | Fix inmediato: `gpt-4o-mini` |
| api.qrserver.com cae | Baja | Alto — QR de 50 barberías muertos | Generación local con canvas |
| Stripe webhook sin configurar | Alta (cuando actives) | Alto — pagos no se registran | Configurar y testear en modo test antes |
| Supabase free tier 500 MB | Baja con 50 clientes | Medio | Plan Pro Supabase (~25$/mes) al llegar a 20 barberías |
| Vercel serverless timeout | Baja | Medio | Las server actions son ligeras, no hay riesgo inmediato |
| Cambio de slug rompe QR impresos | Media | Alto por pérdida de reservas | Advertencia + bloqueo en UI |
| Three.js cargado en landing | Certeza | Bajo-medio — lentitud inicial | Lazy load o eliminar si no aporta conversión |
| SECURITY_AUDIT_SERVICE_URL no configurada | Alta | Bajo — módulo Shield no operativo | El módulo es interno, no bloquea el negocio |
| Concurrencia de reservas dobles | Baja | Medio | `checkSlotAvailability` activo en server action |

---

## 6. Riesgos comerciales

| Riesgo | Descripción | Probabilidad | Mitigación |
|---|---|---|---|
| "Ya uso Booksy" | Booksy es gratis para el cliente pero cobra por cita | Alta | "Con BarberíaOS tus clientes son tuyos, sin comisión" |
| "Treatwell me trae clientes nuevos" | Treatwell tiene marketplace propio | Media | "Treatwell te cobra y te compite. BarberíaOS te da herramienta + tus datos" |
| "No tengo tiempo de configurarlo" | Setup manual en onboarding actual | Alta | Demo en vivo + onboarding guiado en la visita |
| "Lo pienso" | Decisión postergada | Alta | "14 días gratis, lo configuro contigo ahora mismo" |
| "No necesito online, tengo WhatsApp" | Confort con el método actual | Media | "Con BarberíaOS el cliente reserva a las 2 AM sin que contestes" |
| Precio percibido como alto | 79€/mes vs Booksy 0€ coste directo | Alta | ROI: si recupera 5 clientes dormidos, se paga solo |
| Barbería cierra o cambia de dueño | Churn natural del sector | Alta | Contratos mensuales, sin permanencia. Churn normal en barberías |
| Competencia de apps similares | Styleseat, Fresha, Versum | Media | Diferenciador: sin comisión + datos propios + en español |

### Diferenciación vs competencia

| Característica | BarberíaOS | Booksy | Treatwell | Fresha |
|---|---|---|---|---|
| Sin comisión por cita | ✅ | ❌ (cobra) | ❌ (cobra ~20%) | ✅ |
| Datos del cliente son tuyos | ✅ | ❌ | ❌ | ✅ |
| Caja integrada | ✅ | ❌ | ❌ | ✅ |
| QR propio | ✅ | ❌ | ❌ | Parcial |
| IA para el dueño | ✅ | ❌ | ❌ | ❌ |
| Fidelización propia | ✅ | ❌ | ❌ | Parcial |
| Precio transparente | ✅ 79€ fijo | Variable | % por reserva | 0€ pero limitado |
| En español | ✅ | Parcial | ✅ | Parcial |
| Sin marketplace (competencia) | ✅ | ❌ compite | ❌ compite | ❌ |

**Ventaja competitiva real de BarberíaOS:**
> "El cliente reserva sin instalar app, la cita llega a la agenda, la caja lo registra y el cliente es tuyo para siempre. Sin que Booksy o Treatwell sepan quién es."

---

## 7. Riesgos de soporte

| Riesgo | Descripción | Solución |
|---|---|---|
| "No sé configurar servicios" | Onboarding vacío confunde | Video de 3 min + servicios de ejemplo en onboarding |
| "¿Dónde está el QR?" | Navegación no obvia | Checklist de activación en dashboard + tutorial |
| "El cliente no recibió confirmación" | No hay email actualmente | Fix urgente: email con Resend |
| "La IA no funciona" | Modelo incorrecto silencioso | Fix urgente: gpt-4o-mini + mensaje claro cuando no hay key |
| "¿Cómo comparto el link?" | Primera vez perdido | QR page + WhatsApp button prominente |
| "Caja abierta de ayer" | Olvidaron cerrar | Alerta visual si sesión > 12h abierta |
| "Cambié el slug y el QR no funciona" | Bug conocido | Advertencia + bloqueo preventivo |
| "No me llegan reservas online" | No compartió el link | Dashboard con estado "tu página no está activa/compartida" |
| Soporte vía WhatsApp del fundador | Insostenible con 50 | Base de conocimiento + email support dedicado |
| Barbero añadido pero no aparece en booking | Necesita horarios configurados | Guía en UI de barberos: "añade horarios para activar en reservas" |

---

## 8. Roadmap de 7 días

> Objetivo: producto listo para hacer la primera visita de venta con demo funcional.

### Día 1 — Fix crítico + verificación (sin salir del repo)
- [ ] Cambiar `gpt-5.4-mini` → `gpt-4o-mini` en `src/lib/ai/openai-client.ts`
- [ ] Verificar RLS activo en Supabase producción (tabla por tabla)
- [ ] Test de reserva en `/r/[slug]` en móvil real (iPhone + Android)
- [ ] Verificar que `BUSINESS_CONFIG.demoBookingUrl` apunta a un slug existente

### Día 2 — Email de confirmación
- [ ] Integrar Resend (plan gratuito: 100 emails/día — suficiente para empezar)
- [ ] Email al cliente al confirmar: nombre, servicio, hora, barbero, dirección
- [ ] Email/notificación interna al dueño: "Nueva reserva de [Nombre] — [Hora]"
- [ ] Test en producción con reserva real

### Día 3 — Demo interactiva seedeada
- [ ] Crear barbería demo: slug `demo-barberia-os`, nombre "Demo Barber Studio"
- [ ] Seed: 3 servicios (Corte 18€, Barba 12€, Combo 25€), 2 barberos
- [ ] Seed: 10 citas de ejemplo en los próximos 7 días
- [ ] Seed: 15 clientes con historial variado
- [ ] Verificar que `BUSINESS_CONFIG.demoBookingUrl` apunta a `/r/demo-barberia-os`
- [ ] Probar en móvil desde `/demo` → booking → confirmación

### Día 4 — Onboarding mejorado
- [ ] Añadir paso 2: servicios de ejemplo predefinidos con opción de activar/saltar
- [ ] Añadir paso 3: horario semanal básico (L-V 9-20, S 9-14) con opción de personalizar
- [ ] Mensaje de bienvenida en dashboard: "Tus primeros 3 pasos"
- [ ] Probar flujo completo: registro → onboarding → primera reserva

### Día 5 — QR sin dependencia externa
- [ ] Instalar `qrcode` (librería npm, 0 dependencias externas)
- [ ] Generar QR en canvas con nombre de barbería bajo el código
- [ ] Descarga en PNG de alta resolución (500×500px)
- [ ] Eliminar llamada a api.qrserver.com

### Día 6 — Materiales de venta
- [ ] PDF de precios: Free / Starter 39€ / Pro 79€ / Growth 149€
- [ ] Hoja de comparativa vs Booksy / Treatwell (1 página A4)
- [ ] Script de demo de 10 minutos documentado
- [ ] Grabar vídeo Loom de 5 minutos: "Cómo funciona BarberíaOS en una barbería real"

### Día 7 — QA + prueba real
- [ ] Prueba completa: registro → onboarding → servicio → barbero → reserva pública → agenda → caja → cierre
- [ ] Test en 3 dispositivos: iPhone, Android gama media, desktop
- [ ] Verificar que el email de confirmación llega en < 30 segundos
- [ ] Verificar QR funciona al escanear con cámara del móvil

---

## 9. Roadmap de 30 días

### Semana 1 (días 1-7)
Ver roadmap de 7 días. Al final de la semana: producto listo para primera visita.

### Semana 2 (días 8-14) — Monetización y primeras visitas
- [ ] Conectar Stripe en modo producción (plan Pro 79€/mes)
- [ ] Flujo completo: registro → 14 días trial → reminder día 10 → pago → acceso Pro
- [ ] Webhook Stripe activo y testeado
- [ ] Panel `/admin/suscripciones` con MRR real de Stripe
- [ ] Realizar primeras 3-5 visitas a barberías con demo lista
- [ ] Upload de logo desde `/dashboard/ajustes` (Supabase Storage)
- [ ] Descripción pública visible en `/r/[slug]`

### Semana 3 (días 15-21) — Retención y primeros clientes
- [ ] Email de bienvenida automatizado al registrarse
- [ ] Recordatorio de cita (wa.me link generado 24h antes)
- [ ] Advertencia + bloqueo de cambio de slug si hay citas activas
- [ ] Base de conocimiento: 10 artículos (cómo añadir servicio, compartir QR, etc.)
- [ ] Alerta visual en caja si sesión lleva > 12h abierta
- [ ] Cerrar primeros 3 contratos Pro

### Semana 4 (días 22-30) — Escala
- [ ] Onboarding completo sin intervención manual del fundador
- [ ] Email de soporte dedicado (sin depender del WhatsApp personal)
- [ ] Sistema de referidos: barbería recomienda y gana 1 mes
- [ ] Recoger feedback de los primeros clientes y priorizar
- [ ] Tener 5-10 barberías activas antes de escalar marketing

### Meses 2-3 — Hacia las 50 barberías
- [ ] Marketing de contenido: Instagram + LinkedIn con casos reales
- [ ] PWA para el dueño (instalar en móvil sin App Store)
- [ ] Recordatorios automáticos reales (WhatsApp Business API o Twilio SMS)
- [ ] Reportes mensuales por email para cada barbería
- [ ] Soporte in-app (Crisp free tier)
- [ ] Medir: churn mensual, NPS, tiempo hasta primera reserva

---

## 10. Checklist para vender la primera barbería

### Antes de la visita
- [ ] Demo interactiva funcionando en `/r/demo-barberia-os`
- [ ] `/demo` carga correctamente en móvil
- [ ] Email de confirmación funcionando (testeado con email real)
- [ ] QR descargable sin dependencias externas
- [ ] Hoja de precios impresa: Starter 39€ / Pro 79€
- [ ] Script de demo memorizado (ver sección 12)
- [ ] Vídeo de 5 min grabado para dejar después de la visita

### Durante la visita
- [ ] Abrir `/demo` en el móvil del barbero
- [ ] Hacer una reserva de prueba en vivo en `/r/demo-barberia-os`
- [ ] Mostrar la cita en la agenda
- [ ] Mostrar el QR y escanearlo con su cámara
- [ ] Mostrar la caja con el cobro
- [ ] Copiar un mensaje de retención de WhatsApp
- [ ] Preguntar: "¿Cuántos clientes llevan más de 30 días sin venir?"

### Para cerrar
- [ ] Ofrecer 14 días gratis sin tarjeta
- [ ] Decir: "Lo configuro contigo ahora mismo, en 20 minutos tienes todo listo"
- [ ] Pedir el teléfono para crear la cuenta ese mismo día

---

## 11. Checklist para escalar a 50 barberías

### Técnico
- [ ] RLS verificado en producción (ninguna barbería ve datos de otra)
- [ ] Stripe conectado y testeado con pagos reales
- [ ] Email de confirmación funcionando en producción
- [ ] QR generado localmente (sin api.qrserver.com)
- [ ] Supabase en plan Pro (aguanta 50+ barberías)
- [ ] Vercel en plan Pro o Hobby (revisar límites de serverless)
- [ ] OpenAI key configurada en producción (opcional — hay fallback)
- [ ] Backups de base de datos activos en Supabase
- [ ] Monitorización básica (Vercel Analytics activo)

### Producto
- [ ] Onboarding completo sin intervención manual
- [ ] Logo/foto subible desde ajustes
- [ ] Recordatorio de cita a cliente
- [ ] Email de bienvenida automatizado
- [ ] Base de conocimiento con 10+ artículos

### Comercial
- [ ] CRM de leads en `/admin/leads` activo y actualizado
- [ ] Proceso de onboarding documentado (guión de 20 min por barbería)
- [ ] Contrato de 1 página firmado digitalmente
- [ ] Sistema de referidos activo
- [ ] 5 barberías activas → testimonios → captación de más

### Soporte
- [ ] Email de soporte dedicado (sin WhatsApp personal del fundador)
- [ ] FAQs documentadas y accesibles desde el panel
- [ ] Proceso claro de baja (sin fricción, para no quemar relación)
- [ ] Churn tracking en `/admin` (barberías canceladas por mes)

---

## 12. Qué demo enseñar para cerrar el plan Pro a 79 €/mes

### Script de demo — 10 minutos en la barbería

**Minuto 1-2 — El gancho: reserva desde el móvil del cliente**
> "Mira, esto es lo que ve un cliente tuyo cuando le mandas el link o escanea tu QR."
- Abrir `/r/demo-barberia-os` en el móvil del barbero
- Hacer la reserva completa en vivo: servicio → barbero → fecha → nombre/teléfono → confirmar
- Tiempo objetivo: 60-90 segundos

**Minuto 3-4 — La agenda: control sin mensajes**
> "En el momento que ese cliente reserva, aquí aparece. Sin WhatsApp, sin llamadas, sin anotar en papel."
- Mostrar la cita recién creada en vista día
- Mostrar la línea "Ahora" y los huecos libres
- Cambiar el estado de una cita a "completada"

**Minuto 5 — El QR: marketing físico**
> "Este QR lo imprimes, lo pegas en el espejo, en la puerta, en una tarjeta. El cliente escanea y reserva en 60 segundos."
- Mostrar el QR en pantalla
- Escanearlo con la cámara del móvil del barbero
- Descargar el PNG para demostrar que es suyo

**Minuto 6-7 — La caja: dinero del día sin sorpresas**
> "Al final del día esto te dice exactamente cuánto has ganado, con qué método, con qué barbero. No tienes que cuadrar nada a mano."
- Mostrar caja con movimientos de ejemplo
- Mostrar el cierre con resumen
- Mostrar el rendimiento por barbero

**Minuto 8 — Los clientes que no vuelven**
> "¿Cuántos clientes llevan más de 30 días sin venir? Con esto ves cuáles son. Y con un clic tienes el mensaje de WhatsApp listo para mandarles."
- Mostrar lista de clientes
- Copiar el mensaje de retención
- Mostrar que va al wa.me del cliente

**Minuto 9 — La IA del dueño**
> "Puedes preguntarle qué pasó hoy, qué clientes recuperar, qué huecos llenar. Te da el texto para Instagram y el mensaje para WhatsApp."
- Hacer una pregunta rápida: "¿Qué promoción lanzo esta semana?"
- Mostrar el resultado con texto copiable

**Minuto 10 — Cierre**
> "Todo esto por 79€ al mes. Sin comisiones por reserva. Tus clientes son tuyos. Si en 30 días no ves el valor, cancelas sin preguntas. ¿Empezamos ahora mismo? En 20 minutos tienes la barbería configurada."

### Objeciones y respuestas

| Objeción | Respuesta |
|---|---|
| "Yo ya uso WhatsApp para reservas" | "Esto es para que el cliente reserve a las 2 de la mañana sin que tú contestes. WhatsApp es para chatear, esto es para vender citas mientras duermes." |
| "Booksy es gratis" | "Booksy te cobra por cada reserva y tus clientes quedan en su base de datos. Aquí pagas 79€ fijos y los clientes son tuyos para siempre." |
| "Treatwell me trae clientes nuevos" | "Treatwell te trae clientes de descuento que no fidelizan. Aquí retienes y reactivias los que ya tienes, que son los que más valen." |
| "No sé si me llenaré la agenda" | "No es para llenar más. Es para no perder los que ya tienes: reservas que llegan solas, clientes que vuelven, caja sin errores." |
| "No tengo tiempo de aprenderlo" | "Lo configuramos juntos en 20 minutos. Yo lo hago, tú apruebas. A partir de ahí funciona solo." |
| "79€ es mucho" | "¿Cuánto cobras por un corte? Si recuperas 5 clientes dormidos al mes, el software está pagado. El resto es beneficio." |
| "Lo pienso" | "Empieza 14 días gratis, sin tarjeta. Si no te convence, no pagas. ¿Qué tienes que perder?" |

---

## 13. Qué partes NO tocar para no romper el sistema

### Intocable sin revisión profunda
| Módulo | Por qué no tocar |
|---|---|
| `app/r/[slug]/actions.ts` | Rate limiting + validación de disponibilidad real. Cualquier cambio puede abrir reservas duplicadas |
| `src/lib/booking/real-availability.ts` | Algoritmo de slots disponibles. Error = cliente reserva fuera de horario |
| `supabase/migrations/` | Migraciones ya aplicadas. Editarlas no sirve. Solo añadir nuevas |
| `middleware.ts` | Protección de rutas. Un error bloquea todo el dashboard |
| `src/lib/plans/limits.ts` | Límites por plan. Tocar mal = barbería free accede a módulos premium |
| `src/lib/appointments/check-availability.ts` | Antiduplicados de cita. Sin esto, doble reserva posible |
| `app/r/[slug]/page.tsx` — `public_booking_enabled` check | Si se elimina, barberías desactivadas quedan públicas |
| RLS de Supabase | Si se deshabilita una policy, datos entre barberías mezclados |
| `src/lib/supabase/service-role.ts` | Solo se usa en server actions. Nunca en cliente. Si se expone, fallo de seguridad |

### Módulos que se pueden mejorar sin riesgo
- `components/agenda/*` — Solo visualización
- `components/landing/*` — Solo marketing
- `app/dashboard/qr/QRClient.tsx` — Solo UI
- `app/dashboard/whatsapp/page.tsx` — Solo templates de texto
- `app/demo/page.tsx` — Solo página estática
- `app/onboarding/page.tsx` — Solo UI de creación inicial
- `app/dashboard/ajustes/` — Solo configuración de barbería

---

## 14. Recomendación final: qué implementar primero

### Orden estricto de prioridad

**Esta semana (antes de cualquier visita de venta):**

1. **Fix modelo OpenAI** — 5 minutos, 1 línea. Sin excusas.
2. **Email de confirmación al cliente** — Sin esto la reserva parece fallida. Es el primer momento de verdad del producto.
3. **Seed de demo interactiva** — Sin demo funcional en el móvil del barbero, no cierras la venta.

**Esta semana también (para activar día 1):**

4. **Onboarding con servicios + horarios default** — El barbero que registra y no sabe qué hacer = churn inmediato.
5. **QR sin dependencia externa** — Con 50 barberías, la caída de api.qrserver.com afecta a todos.

**Semana 2 (para monetizar):**

6. **Stripe conectado en producción** — Sin cobro automático no hay escalabilidad real.
7. **Upload de logo/foto** — La página pública `/r/[slug]` sin foto de la barbería parece demo, no producto real.

**Mes 1 (para retener):**

8. **Recordatorio de cita** — Reduce no-shows sin esfuerzo del dueño.
9. **Base de conocimiento** — Reduce soporte a WhatsApp del fundador.
10. **Alerta caja abierta >12h** — Evita confusión en cierre diario.

---

### Resumen ejecutivo

| Dimensión | Puntuación actual | Objetivo 30 días |
|---|---|---|
| Producto funcional | 8/10 | 9.5/10 |
| Listo para vender | 6/10 | 9/10 |
| Monetización | 3/10 | 8/10 |
| Soporte escalable | 3/10 | 7/10 |
| Demo comercial | 5/10 | 9/10 |
| Diferenciación vs Booksy | 9/10 | 9/10 |

**El producto ya es bueno. Faltan 3 fixes para que sea vendible. Faltan 7 días para tener la primera visita lista.**

**La mayor amenaza no es técnica. Es no salir a vender.**

---

*BarberíaOS — Auditoría 50 Clientes | Skill: barberiaos-50-clientes | 2026-06-04*
