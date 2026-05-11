# BarberíaOS — Instrucciones globales para Claude Code

Estás trabajando en BarberíaOS, un SaaS completo para barberías.

## Objetivo del producto

Crear una plataforma que permita a barberías gestionar reservas, clientes, barberos, servicios, pagos manuales, página pública de reservas, QR de reservas y marketing digital local.

El producto debe venderse como:

> Un sistema para que tus clientes reserven desde Instagram, Google, WhatsApp o QR, y tú gestiones toda la barbería desde un panel.

## Stack principal

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Supabase/PostgreSQL.
- Supabase Auth.
- Zod para validaciones.
- Vercel para deploy.

## Principios de trabajo

1. Trabajar en modo ahorro.
2. Una tarea por vez.
3. Antes de editar, explicar plan y archivos que se tocarán.
4. No instalar dependencias sin permiso explícito.
5. No tocar más de 5-8 archivos por tarea salvo permiso.
6. No construir módulos futuros hasta terminar el MVP.
7. No crear Stripe, WhatsApp API ni IA avanzada en la V1.
8. Mantener código simple y escalable.
9. Usar nombres claros en español para rutas visibles y en inglés para funciones internas si mejora el código.
10. Después de cambios importantes, indicar cómo probarlos.

## MVP obligatorio

Debe incluir:

- Landing comercial del SaaS.
- Registro/login.
- Onboarding de barbería.
- Dashboard interno.
- CRUD de servicios.
- CRUD de barberos.
- CRUD de clientes.
- Crear/cancelar citas.
- Validación de doble reserva.
- Página pública de reservas por barbería.
- QR de reservas.
- Pagos manuales.
- Resumen diario.

## No construir todavía

- Stripe Billing.
- WhatsApp Business API.
- App móvil.
- Marketplace público.
- Multiidioma.
- Roles complejos.
- IA avanzada.
- Facturación fiscal avanzada.

## Modelo de negocio

Planes sugeridos:

- Starter: app de reservas + QR + página básica.
- Growth: reservas + marketing digital + Google/Instagram optimizado.
- Premium: campañas, CRM, fidelización y reportes.

## Seguridad

Toda tabla multi-tenant debe tener `barbershop_id`.
Cada barbería debe ver únicamente sus propios datos.
Usar RLS en Supabase.
No exponer claves privadas en frontend.

## Flujo recomendado

1. Leer `docs/TASKS.md`.
2. Elegir una tarea.
3. Proponer plan.
4. Esperar aprobación.
5. Editar.
6. Explicar cambios.
7. Indicar prueba.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
