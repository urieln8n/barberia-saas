# Deploy

## Local

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Supabase

1. Crear proyecto en Supabase.
2. Copiar variables a `.env.local`.
3. Ejecutar migración `supabase/migrations/001_initial_schema.sql`.
4. Revisar políticas RLS antes de producción.

## Vercel

1. Subir repo a GitHub.
2. Importar en Vercel.
3. Añadir variables de entorno.
4. Deploy.
5. Configurar dominio.

## Variables

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
```
