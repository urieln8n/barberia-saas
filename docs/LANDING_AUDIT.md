# Diagnóstico Landing Actual — SquirePremiumLanding.tsx

Fecha: 2026-06-05
Auditor: AgentsOrchestrator (product-manager + design-ux-architect + brand-guardian)

---

## Lo que funciona

- Animaciones FadeUp/FadeIn con framer-motion son correctas y accesibles (useReducedMotion)
- CountUpNumber implementado como componente (no hook) — correcto para uso en maps
- AgendaMockup es una pieza visual fuerte, realista y detallada
- StatsBar transmite confianza de forma eficiente con 4 números clave
- Estructura de PricingSection con 3 planes bien definidos y plan Growth destacado
- FAQSection con acordeón animado — funcional y bien ejecutado
- ModulesSection con 12 módulos en grid — completo y visualmente claro
- Footer limpio con links legales y copyright
- StudioIASection tiene buena estructura con grid de features y CTA final en violet
- FeaturesSection con mockups inline (Agenda, Clientes, Caja) — diferenciación real
- Sistema de tokens CSS bien establecido en globals.css

---

## Lo que se ve débil o barato

- 4 secciones con bg-[#0A0B0F] oscuro pesado sin variación:
  Hero, ProblemSection, TestimonialsSection, FinalCTA
  Resultado: la landing parece un producto de gaming, no un SaaS premium para negocios
- El Hero siendo 100% oscuro contradice la identidad premium light que usa el dashboard
- body en globals.css tiene fondo negro como base — provoca flash oscuro antes de cargar
- TestimonialsSection en fondo oscuro hace que las tarjetas se pierdan visualmente
- FinalCTA oscuro puro (#0A0B0F) es genérico y no cierra con energía de conversión
- Navbar detecta scrolled para pasar de transparente (sobre fondo oscuro) a blanco —
  el ícono del logo cambia de tone:dark a tone:light en scroll, lo que crea una experiencia
  confusa cuando el hero es oscuro
- Eyebrow light variant hace los badges poco legibles sobre fondos no-oscuros
- ProblemSection tiene 5 pain cards en fondo oscuro — dificulta lectura del texto blanco/50
- No hay sección de comparación (Sin BarberíaOS vs Con BarberíaOS)
- No hay sección de beneficios económicos explícita
- No hay sección de cómo funciona con 5 pasos expandidos
- Pricing tiene nombres "Essential/Growth/Elite Studio" pero la misión dice "Básico/Pro/Elite"
- El texto del hero subtitle usa text-white/55 — contraste de 2.8:1, falla WCAG AA (4.5:1)
- Trust pills bajo el hero usan text-white/35 — contraste de 1.8:1, falla WCAG AA completamente

---

## Lo que no se entiende

- El mensaje del hero mezcla "gestiona" y "llena la agenda" sin jerarquía clara de beneficio
- El segundo CTA del hero va a #studio — interrumpe el flujo de conversión principal
- Badge del hero "Software para barberías · Sin comisión por reserva" usa text-white/60 con
  bg-white/[0.06] — casi invisible en scroll y en mobile
- La sección Problem dice "Cada día pierdes dinero sin saberlo" pero no conecta visualmente
  con la solución — hay un salto brusco a Features sin transición narrativa
- HowItWorks tiene solo 3 pasos pero la especificación pide 5 — falta contexto de control total
- ModulesSection viene después de HowItWorks, rompiendo la narrativa:
  debería ser: Problema → Solución (módulos) → Cómo funciona → Beneficios → Studio → Precios
- No hay una sección explícita de "Centro de control" o "Un panel. Todo tu negocio."
- Testimonios en fondo oscuro tienen quote text-white/60 — por debajo del mínimo WCAG

---

## Qué falta para vender

- Hero claro con imagen mental de "sistema moderno" — no estética de midnight app
- Sección Problema en fondo claro con iconos X rojos — más impacto visual
- Sección de comparación directa Sin/Con BarberíaOS — elimina fricción de decisión
- Sección de beneficios económicos con 6 cards (Menos WhatsApp, Agenda completa, etc.)
- 5 pasos en HowItWorks en lugar de 3
- Más contexto en Studio IA sobre créditos por plan
- Testimonios en fondo claro con métricas más prominentes
- CTA final con fondo negro elegante (no #0A0B0F plano) o fondo dorado tinted
- FAQ con 7 preguntas (falta: ¿Puedo usar el QR?, ¿Gestiono varios barberos?, ¿Incluye web?)
- Metadata SEO con keywords más específicas para España

---

## Secciones que sobran

- FeaturesSection (3 feature spots con mockups) — es muy larga y repite información del
  ModulesSection. Candidata a simplificar o fusionar con "Centro de control" como alternativa.
  Para el rebuild: mantener los mockups inline pero en una sección fusionada con Módulos
  o convertirla en la sección "Solución — Centro de control" con menos redundancia.

---

## Secciones que faltan

1. Sección Comparación — tabla Sin BarberíaOS vs Con BarberíaOS (6 filas)
2. Sección Beneficios Económicos — 6 cards con número/icono
3. Sección "Un panel. Todo tu negocio." — como transición Problema→Solución
4. FAQ ampliado a 7 preguntas (actualmente 6, falta la del QR y web)

---

## Plan de reconstrucción

### Cambios de diseño
- Hero: cambiar bg-[#0A0B0F] a fondo claro (#FAFAF7 o blanco) con texto oscuro
- Navbar: ajustar tone inicial a light (logo dark sobre fondo blanco)
- ProblemSection: cambiar a fondo claro (#FFF8F5) con cards de dolores usando iconos X
- TestimonialsSection: cambiar a fondo #F8FAFC con tarjetas blancas
- FinalCTA: cambiar a fondo negro más rico (#111827 con gradiente dorado) o fondo cream
- Añadir 4 secciones nuevas: Comparación, Beneficios, CentroControl, FAQ ampliado

### Cambios de copy
- H1 hero: más directo sobre el beneficio de reservas automáticas
- Subtítulo hero: mejorar contraste a text-slate-600 sobre fondo claro
- Trust pills: texto slate-500 sobre fondo claro (accesible)
- Precios: alinear nombres a Básico/Pro/Elite del documento de misión

### Cambios de estructura/orden
Nuevo orden: Navbar → Hero → Stats → Problema → Centro Control → Studio IA →
Cómo Funciona → Beneficios → Módulos → Comparación → Precios → Testimonios → FAQ → CTA Final → Footer

### Cambios de accesibilidad
- Todos los textos de información en fondo claro: mínimo text-slate-600 (contraste 5.7:1)
- Badges eyebrow: fondo visible para máxima legibilidad
- Quitar patrones de opacidad ultra baja (white/35, white/25) en secciones de venta

### Archivos a modificar
- components/landing/SquirePremiumLanding.tsx — reconstrucción completa
- app/page.tsx — metadata SEO actualizada

### Archivos NO tocar
- Rutas de dashboard, login, reservas públicas
- Configuración de Supabase, middleware, actions
- Base de datos y migraciones

---

Resultado esperado: landing premium light-first, identidad coherente con el dashboard,
mayor claridad de mensaje, 14 secciones bien ordenadas, accesibilidad WCAG AA.
