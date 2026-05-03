# BarberíaOS Starter

Starter Next.js para construir el SaaS de barberías.

## Instalar

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Rutas

- `/` landing.
- `/dashboard` dashboard.
- `/dashboard/agenda` agenda.
- `/dashboard/clientes` clientes.
- `/dashboard/servicios` servicios.
- `/dashboard/barberos` barberos.
- `/dashboard/pagos` pagos.
- `/r/[slug]` página pública de reservas.

## Supabase

La migración inicial está en:

```txt
supabase/migrations/001_initial_schema.sql
```
