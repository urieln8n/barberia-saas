# Database — Supabase/PostgreSQL

## Tablas

### profiles
Usuario autenticado.

### barbershops
Barbería/negocio.

### barbershop_members
Relación usuario-barbería.

### barbers
Barberos del negocio.

### services
Servicios ofrecidos.

### clients
Clientes finales.

### appointments
Citas.

### payments
Pagos manuales.

## Estados de citas

```txt
scheduled
confirmed
completed
cancelled
no_show
```

## Métodos de pago

```txt
cash
card
bizum
transfer
other
```

## Reglas importantes

- Toda tabla operativa debe tener `barbershop_id`.
- La ruta pública `/r/[slug]` puede leer datos públicos de la barbería y servicios activos.
- La creación de reservas públicas debe estar controlada por una función/endpoint seguro.
- No exponer datos privados de pagos o clientes en páginas públicas.
