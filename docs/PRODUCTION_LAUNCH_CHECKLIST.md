# PRODUCTION LAUNCH CHECKLIST
> BarberíaOS — Rama: feature/production-polish-landing-logo-agenda-seo
> Fecha de build: 2026-05-26

## BUILD Y CALIDAD ✅

- [x] `npm run lint` — 0 errores, 0 warnings
- [x] `npm run build` — 106 páginas generadas sin errores
- [x] TypeScript: sin errores de tipos
- [x] Todas las páginas SEO renderizan como estáticas (○)
- [x] Sitemap auto-generado con todas las rutas publicadas

---

## LOGO Y MARCA ✅

- [x] `components/brand/BarberiaOSLogo.tsx` — Razor eliminado
- [x] `public/icon.svg` — Razor eliminado, gradiente ring actualizado
- [x] Logo coherente en landing header, dashboard sidebar, favicon, OG image

---

## SEO — PÁGINAS NUEVAS ✅

- [x] `/qr-reservas-barberias` — creada, metadata completa, canónica
- [x] `/huecos-libres-barberia` — creada, metadata completa, canónica
- [x] `/programa-fidelizacion-barberias` — creada, metadata completa, canónica
- [x] `/marketing-para-barberias` — creada, metadata completa, canónica
- [x] `/software-barberias-madrid` — creada, metadata completa, canónica
- [x] `/software-barberias-sevilla` — creada, metadata completa, canónica
- [x] `/software-barberias-valencia` — creada, metadata completa, canónica
- [x] `SEO_INTENT_PAGES` actualizado en site-config.ts
- [x] Sitemap incluye las 7 nuevas páginas

---

## AGENDA OPERATIVA ✅ (sesión anterior)

- [x] Línea "Ahora" en DailyTimelineView — actualización cada 60s
- [x] Marcador "Hoy" con badge dorado en WeeklyCalendarGrid
- [x] Botones de acción en AppointmentDetailsPanel (confirmar/completar/no-show/cancelar)
- [x] `rescheduleAppointment()` en actions.ts con anti-solapamiento
- [x] WhatsApp link dinámico desde panel de cita

---

## RESERVAS Y ANTI-SOLAPAMIENTO ✅ (sesión anterior)

- [x] `checkSlotAvailability()` centralizado en src/lib/appointments/
- [x] `excludeAppointmentId` para reagendado sin auto-conflicto
- [x] BLOCKING_STATUSES definidos: pending, scheduled, confirmed
- [x] PostgreSQL RPC `create_booking_safe()` para reservas públicas

---

## PRE-DEPLOY — PENDIENTE MANUAL

- [ ] Variables de entorno verificadas en Vercel (Supabase URL, anon key, service key)
- [ ] RLS activo en todas las tablas multi-tenant (verificar `barbershop_id`)
- [ ] `NEXT_PUBLIC_SITE_URL` apunta a dominio de producción
- [ ] Google Search Console: sitemap enviado tras deploy
- [ ] Google Analytics / tracking verificado
- [ ] Test de reserva pública end-to-end en producción
- [ ] Test de doble reserva: intentar dos citas solapadas con el mismo barbero

---

## NOTAS POST-LAUNCH

- Las ciudades secundarias (Bilbao, Zaragoza, Málaga) se pueden añadir como nueva tarea SEO
- La landing V2 (hero más dramático) queda pendiente para siguiente iteración
- Las páginas `crm-clientes-barberia` y `whatsapp-barberias` están en `recomendada` — crear en siguiente sprint
