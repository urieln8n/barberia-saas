---
name: barberiaos-growth-engine
description: "Usar esta skill cuando Andrés pida crear, mejorar o auditar módulos de crecimiento para BarberíaOS, incluyendo Instagram Growth, CRM de leads, campañas, WhatsApp IA, prompts virales, ADS, reseñas, Marketing Studio, automatizaciones, conversiones, reservas generadas y módulos premium por planes. No usar para tareas que no sean BarberíaOS o growth marketing del SaaS."
---

# BarberíaOS Growth Engine Skill
---


## Identidad del proyecto

Estás trabajando en BarberíaOS, un SaaS vertical para barberías.

BarberíaOS Core incluye:
- Reservas
- Agenda
- Clientes
- Barberos
- Servicios
- Caja
- Inventario / productos
- QR de reservas
- Página pública /r/[slug]
- Dashboard de barbería
- Admin creador
- Supabase multi-tenant con barbershop_id
- RLS

El objetivo del Growth Engine es convertir BarberíaOS en un sistema de crecimiento conectado directamente a reservas, caja, clientes y agenda.

## Objetivo del módulo

Crear y evolucionar un módulo premium llamado:

BarberíaOS Growth Engine

Subtítulo comercial:
Convierte Instagram, WhatsApp y campañas en reservas reales.

El módulo debe incluir progresivamente:
- CRM de leads
- Campañas
- Keywords
- Plantillas de DM
- Plantillas WhatsApp
- Prompts virales
- Instagram Growth Engine
- WhatsApp IA
- Reseñas
- ADS
- Reportes de conversión
- Clientes calientes
- Clientes recuperados
- Métricas de reservas generadas
- Métricas de ingresos atribuidos

## Reglas críticas

- No tocar main directamente.
- Crear rama nueva para cada fase.
- No hacer merge.
- No borrar ramas.
- No eliminar migraciones.
- No editar migraciones antiguas.
- No romper reservas.
- No romper caja.
- No romper clientes.
- No romper Marketing Studio.
- No romper onboarding.
- No romper /r/[slug].
- Mantener multi-tenant por barbershop_id.
- Usar Supabase con RLS.
- Mantener diseño premium BarberíaOS.
- Mobile-first.
- No saturar el sidebar.
- Añadir solo un enlace principal llamado "Growth" o "Crecimiento".
- Dentro del módulo usar tabs internas.
- Ejecutar npm run lint.
- Ejecutar npm run build.
- Entregar resumen final de archivos creados/modificados.
- No conectar APIs externas reales sin permiso explícito.

## Reglas legales y de plataformas

No implementar:
- Scraping de Instagram
- Bots de follow/unfollow
- Likes automáticos
- Comentarios automáticos masivos
- DMs masivos no solicitados
- Automatizaciones no oficiales
- Proxies o navegación simulada para evadir límites

Preparar estructura futura para:
- Instagram Graph API
- Meta Webhooks
- Private Replies oficiales
- WhatsApp Business Platform
- Meta Ads
- Conversion API
- OpenAI API u Ollama para IA

## Arquitectura recomendada

Rutas sugeridas:

/dashboard/growth
/dashboard/growth/leads
/dashboard/growth/campaigns
/dashboard/growth/instagram
/dashboard/growth/whatsapp
/dashboard/growth/templates
/dashboard/growth/prompts
/dashboard/growth/reviews
/dashboard/growth/ads
/dashboard/growth/reports
/dashboard/growth/settings

Tabs internas recomendadas:
- Resumen
- Leads
- Campañas
- Instagram
- WhatsApp
- Plantillas
- Prompts
- Reseñas
- ADS
- Reportes
- Ajustes

## Tablas recomendadas

Crear migraciones nuevas cuando haga falta:

growth_leads
growth_campaigns
growth_keywords
growth_dm_templates
growth_prompt_templates
growth_saved_prompts
growth_events
growth_integrations
growth_messages
growth_reports
growth_consents

Todas las tablas de datos de barbería deben tener:
- id uuid primary key
- barbershop_id uuid not null cuando aplique
- created_at timestamptz
- updated_at timestamptz

RLS:
- Cada barbería solo puede ver sus propios datos.
- Las plantillas globales pueden tener barbershop_id null e is_system true.
- Los datos privados de cada barbería nunca deben mezclarse.

## Planes comerciales

Starter — 39 €/mes:
- Reservas
- Agenda
- Clientes
- QR
- Caja básica

Pro — 79 €/mes:
- Marketing Studio
- Plantillas
- Clientes perdidos
- Campañas manuales
- Prompts virales

Growth — 149 €/mes:
- CRM de leads
- Instagram Growth
- Keywords
- IA básica
- Reportes

Growth Ads — 249 €/mes o 299 €/mes:
- ADS
- ROI
- Coste por lead
- Coste por reserva
- Seguimiento comercial

Add-on WhatsApp IA:
- +49 €/mes básico
- +99 €/mes pro
- +149 €/mes premium

## UX/UI

El diseño debe ser:
- Premium
- Limpio
- Mobile-first
- Oscuro elegante si el dashboard usa dark mode
- Cards claras
- Badges por estado
- Acciones rápidas
- Tablas simples
- Empty states bonitos
- Nada saturado
- Inspiración Apple / Stripe / Vercel
- El dueño de barbería debe entender rápido qué acción hacer

## Fase 1 recomendada

Primero construir Growth Engine manual:

- Dashboard /dashboard/growth
- CRM de leads manual
- Campañas manuales
- Keywords manuales
- Plantillas DM
- Prompts virales
- Calendario de contenido
- Botón copiar mensaje
- Botón abrir WhatsApp
- Métricas manuales
- Bloqueo por plan si ya existe feature gating

No conectar todavía Meta, Instagram, WhatsApp ni ADS reales.

## Definición de terminado

Una tarea está terminada solo si:
- La app compila.
- npm run lint pasa.
- npm run build pasa.
- No hay errores de TypeScript.
- No se rompió ninguna ruta existente.
- La UI se ve bien en móvil.
- Las tablas tienen RLS si se creó migración.
- El resumen final explica archivos modificados, migraciones y próximos pasos.