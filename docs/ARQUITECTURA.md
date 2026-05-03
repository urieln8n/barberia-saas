# Arquitectura — BarberíaOS

## Stack

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Supabase Auth.
- Supabase PostgreSQL.
- Zod.
- Vercel.

## Capas

```txt
Landing pública
    ↓
App privada / dashboard
    ↓
Server actions / API routes
    ↓
Supabase client/server
    ↓
PostgreSQL + RLS
```

## Rutas principales

```txt
/                         Landing comercial
/login                    Login
/onboarding               Crear barbería
/dashboard                Panel principal
/dashboard/agenda         Agenda
/dashboard/clientes       Clientes
/dashboard/servicios      Servicios
/dashboard/barberos       Barberos
/dashboard/pagos          Pagos
/r/[slug]                 Página pública de reservas
```

## Multi-tenant

Cada registro operativo debe estar asociado a una barbería mediante `barbershop_id`.

Tablas clave:

- profiles
- barbershops
- barbershop_members
- barbers
- services
- clients
- appointments
- payments

## Seguridad

- Activar Row Level Security.
- Usuario solo puede leer/escribir barberías donde sea miembro.
- Claves secretas solo en servidor.
- No exponer service role al navegador.

## Reservas públicas

La ruta `/r/[slug]` permite que clientes finales reserven sin entrar al dashboard.

Flujo:

1. Cliente entra al link o QR.
2. Elige servicio.
3. Elige barbero o cualquiera.
4. Elige fecha/hora.
5. Introduce nombre y teléfono.
6. Se crea cliente/cita.
7. Se muestra confirmación.

## Validación de disponibilidad

Una cita no puede solaparse con otra del mismo barbero.

Regla:

```txt
new_start < existing_end AND new_end > existing_start
```

## Deploy

- Vercel para app.
- Supabase producción para DB.
- Dominio principal para landing.
- Subdominio `app.` para dashboard si se separa.
