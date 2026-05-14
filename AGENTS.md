# AGENTS.md — BarberíaOS

## Proyecto

BarberíaOS es un SaaS vertical para barberías construido con Next.js App Router, TypeScript, Tailwind CSS y Supabase.

El producto incluye:
- Reservas
- Agenda
- Clientes
- Barberos
- Servicios
- Caja
- Inventario
- Marketing Studio
- Dashboard
- Página pública /r/[slug]
- Supabase con RLS
- Multi-tenant por barbershop_id

## Reglas de trabajo

- No trabajar en main directamente.
- Crear ramas por fase o feature.
- No hacer merge sin permiso.
- No borrar ramas.
- No eliminar migraciones.
- No editar migraciones antiguas.
- No romper reservas, caja, clientes, agenda, onboarding ni /r/[slug].
- Mantener diseño premium y mobile-first.
- Mantener RLS y multi-tenant por barbershop_id.
- No exponer service role en cliente.
- No usar secretos en frontend.
- No añadir dependencias pesadas sin justificar.

## Comandos de verificación

Antes de terminar una tarea ejecutar:

```bash
npm run lint
npm run build