# Tasks — BarberíaOS MVP

## Fase 0 — Preparación

- [ ] T001 — Revisar estructura del kit y starter.
- [ ] T002 — Crear proyecto Next.js real si no existe.
- [ ] T003 — Configurar Tailwind y layout base.
- [ ] T004 — Configurar Supabase client/server.

## Fase 1 — Base de datos

- [ ] T005 — Crear migración SQL inicial.
- [ ] T006 — Crear tablas: profiles, barbershops, members, barbers, services, clients, appointments, payments.
- [ ] T007 — Activar Row Level Security.
- [ ] T008 — Crear políticas RLS básicas.
- [ ] T009 — Crear índices para agenda y búsquedas.

## Fase 2 — Landing SaaS

- [ ] T010 — Crear landing comercial en `/`.
- [ ] T011 — Crear secciones: hero, problema, solución, QR, dashboard, marketing, precios, CTA.
- [ ] T012 — Crear copy enfocado en reservas, no en software.
- [ ] T013 — Añadir CTA a demo/contacto.

## Fase 3 — Auth y onboarding

- [ ] T014 — Crear login.
- [ ] T015 — Crear onboarding de barbería.
- [ ] T016 — Crear perfil del usuario.
- [ ] T017 — Asociar usuario a barbería.

## Fase 4 — Dashboard base

- [ ] T018 — Crear layout del dashboard.
- [ ] T019 — Crear navegación lateral.
- [ ] T020 — Crear cards de métricas.
- [ ] T021 — Mostrar citas de hoy.
- [ ] T022 — Mostrar ingresos del día.

## Fase 5 — CRUD operativo

- [ ] T023 — Crear CRUD de servicios.
- [ ] T024 — Crear CRUD de barberos.
- [ ] T025 — Crear CRUD de clientes.
- [ ] T026 — Crear citas desde dashboard.
- [ ] T027 — Cancelar citas.
- [ ] T028 — Registrar pagos manuales.

## Fase 6 — Agenda

- [ ] T029 — Vista agenda diaria.
- [ ] T030 — Filtro por barbero.
- [ ] T031 — Estados de cita: scheduled, confirmed, completed, cancelled, no_show.
- [ ] T032 — Validación anti doble reserva.

## Fase 7 — Página pública de reservas

- [ ] T033 — Crear ruta `/r/[slug]`.
- [ ] T034 — Mostrar datos de barbería.
- [ ] T035 — Selección de servicio.
- [ ] T036 — Selección de barbero.
- [ ] T037 — Selección de fecha/hora.
- [ ] T038 — Confirmación de reserva.

## Fase 8 — QR

- [ ] T039 — Generar link público de reservas.
- [ ] T040 — Crear componente QR o integración de librería.
- [ ] T041 — Página para descargar/imprimir QR.

## Fase 9 — Marketing local

- [ ] T042 — Crear ficha de canales: Instagram, Google, TikTok, WhatsApp, QR.
- [ ] T043 — Crear dashboard simple de fuentes de reserva.
- [ ] T044 — Plantillas de copy para redes.

## Fase 10 — Producción

- [ ] T045 — Preparar variables de entorno.
- [ ] T046 — Preparar README de deploy.
- [ ] T047 — Probar build.
- [ ] T048 — Deploy en Vercel.
- [ ] T049 — Configurar dominio.
- [ ] T050 — Checklist de entrega a primer cliente.

## Deuda técnica — UI/Accesibilidad

- [ ] T051 — Auditar touch targets en dashboard: buscar patrón `py-1.5 text-xs` en componentes interactivos de `/dashboard` y subir a mínimo `py-2` (objetivo 40px táctil).
- [ ] T052 — QA de Inter en Safari iOS: verificar que `next/font/google` carga la fuente correctamente en Safari iOS (network tab, sin flash de system font en primer paint). Comparar con Chrome/Android.
