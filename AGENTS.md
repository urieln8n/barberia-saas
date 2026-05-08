# AGENTS.md

Instrucciones para agentes que trabajen en BarberiaOS.

- No romper la arquitectura actual de Next.js App Router, TypeScript, Tailwind y Supabase.
- Trabajar por fases y limitar los cambios a la fase solicitada.
- Mantener TypeScript limpio y evitar `any` salvo integraciones o datos legacy ya existentes.
- Disenar mobile-first y preservar la experiencia actual del dashboard y la reserva publica.
- Preservar rutas actuales: `/`, `/login`, `/onboarding`, `/dashboard`, `/dashboard/*`, `/admin/*`, `/r/[slug]`.
- No exponer secretos de entorno en cliente. `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY` y webhooks solo en servidor.
- Reutilizar componentes existentes antes de crear nuevos componentes.
- Revisar migraciones SQL antes de proponer o crear tablas nuevas.
- Mantener `barbershop_id` en datos operativos multi-tenant.
- Ejecutar `npm run lint` y `npm run build` antes de terminar cambios funcionales cuando sea viable.
