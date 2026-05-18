# QA Report — feature/seo-control-inventory

**Date:** 2026-05-16  
**Branch:** feature/seo-control-inventory  
**Commits reviewed:** 2 (1e99840, 425063a)  
**Files changed:** 4 (all inside `docs/seo-control/`)  
**Mode:** Diff-aware / documentation review  
**Verdict:** ❌ **NO APROBADO — error crítico en CSV**

---

## Resumen ejecutivo

La rama toca únicamente `docs/seo-control/`. No hay cambios en código fuente, migraciones, variables de entorno ni rutas públicas. Build y lint pasan limpiamente. Sin embargo, `pages-inventory.csv` tiene **76 de 93 filas malformadas** por comillas faltantes en campos de texto libre — el archivo se rompe al importar en Google Sheets o cualquier parser CSV estándar.

---

## Checklist de seguridad

| Verificación | Resultado |
|---|---|
| `.env` o secretos tocados | ✅ LIMPIO |
| Migraciones de Supabase tocadas | ✅ LIMPIO |
| Archivos de auth / RLS tocados | ✅ LIMPIO |
| Rutas de pagos / Stripe tocadas | ✅ LIMPIO |
| Archivos fuera de `docs/` | ✅ LIMPIO — 100% confinado a `docs/seo-control/` |
| Código de producción modificado | ✅ NINGUNO |

---

## Build y lint

| Verificación | Resultado | Detalle |
|---|---|---|
| `npm run lint` | ✅ PASS | No ESLint warnings or errors |
| `npm run build` | ✅ PASS | ✓ Compiled successfully — 84 static pages |

---

## ❌ ERROR CRÍTICO — pages-inventory.csv: 76 filas malformadas

**Archivo:** `docs/seo-control/pages-inventory.csv`  
**Impacto:** El archivo se rompe al importar en Google Sheets. Las columnas se desplazan, los datos quedan en celdas incorrectas.

### Causa raíz

Los campos de texto libre con comas internas no están envueltos en comillas dobles en 76 de 93 filas:

```
# MAL — la meta description tiene comas sin comillas:
002,/demo,...,Prueba BarberíaOS gratis. Ve la agenda, caja, clientes y reservas...,

# BIEN — mismo campo correctamente envuelto:
001,/,...,"Software para barberías con reservas online, caja, QR, página pública..."
```

### Columnas afectadas

| Columna | Posición | Filas con error |
|---|---|---|
| Meta description | 13 | ~52 filas |
| H1 | 14 | ~24 filas |
| Keywords secundarias | 7 | Algunas filas |
| Schema JSON-LD | 18 | Algunas filas (ej: `SoftwareApplication, Organization`) |

### Datos válidos

- Header: ✅ 27 columnas correctas
- IDs: ✅ Secuenciales 001–093, sin duplicados, sin saltos
- Filas correctamente formateadas: 17 de 93
- Encoding UTF-8 BOM: ✅ Presente

---

## ✅ business-map.csv — APROBADO

| Check | Resultado |
|---|---|
| Columnas | ✅ 10 cols, 8 filas, 0 errores |
| Encoding | ✅ UTF-8 BOM |
| Valores coherentes | ✅ Estado comercial, Prioridad correctos |

---

## ✅ content-roadmap.csv — APROBADO

| Check | Resultado |
|---|---|
| Columnas | ✅ 11 cols, 24 filas, 0 errores |
| Encoding | ✅ UTF-8 BOM |
| IDs únicos | ✅ Sin duplicados |
| Valores Estado | ✅ `Pendiente — CREAR`, `En sitio — /ruta` |
| Valores Prioridad | ✅ Alta / Media / Baja |

---

## ✅ README.md — APROBADO

| Check | Resultado |
|---|---|
| Menciona los 3 CSVs | ✅ Sí |
| Guía de columnas `pages-inventory` | ✅ 27 columnas documentadas |
| Guía de columnas `content-roadmap` | ✅ 11 columnas documentadas |
| Instrucciones Google Sheets | ✅ 2 métodos de importación |
| Cadencia de revisión | ✅ Tabla incluida |
| Google Search Console | ✅ Guía de conexión paso a paso |
| Referencias a archivos fuente | ✅ Todos los archivos referenciados existen |

---

## Mejoras recomendadas (no bloqueantes)

1. **Añadir columna `Negocio`** a `content-roadmap.csv` — distingue contenido de BarberíaOS vs marca personal si se expande el sistema.
2. **Añadir validación automática** — script `docs/seo-control/validate.js` que se ejecute en CI para detectar este tipo de error de formato antes de cada commit.
3. **Fila de totales** en `README.md` — "Estado actual: 93 páginas catalogadas, 17 con datos GSC pendientes."

---

## Diagnóstico: páginas vs CSV

| Categoría | En repo | En CSV |
|---|---|---|
| `page.tsx` reales | 74 | 89 entradas activas |
| Rutas API | 13 | 13 |
| Páginas pendientes | 4 declaradas en site-config | 4 (IDs 090–093) |
| **Total** | **87** | **93** |

---

## Veredicto final

```
❌ NO APROBADO

Bloqueante: pages-inventory.csv tiene 76/93 filas con commas sin escapar.
El archivo se rompe al importar en Google Sheets.

No aprobado por: CSV malformado
Aprobado en todo lo demás: build, lint, seguridad, business-map, content-roadmap, README
```

---

## Comando para continuar

```bash
# Corregir el CSV y re-ejecutar QA:
# (Ver instrucción para Claude Code a continuación)
```

**Acción exacta para arreglar:**

Regenerar `pages-inventory.csv` asegurando que **todos** los campos de texto libre
(Meta description, H1, Título SEO, Keywords secundarias, Schema JSON-LD, Próxima acción, Notas)
estén envueltos en comillas dobles cuando contienen comas.

Comando de verificación post-fix:

```bash
node -e "
const fs = require('fs');
function parseLine(line) {
  const r=[]; let c='',q=false;
  for(let i=0;i<line.length;i++){const ch=line[i];
  if(ch=='\"'){if(q&&line[i+1]=='\"'){c+='\"';i++;}else q=!q;}
  else if(ch==','&&!q){r.push(c);c='';}else c+=ch;}
  r.push(c); return r;
}
const content = fs.readFileSync('docs/seo-control/pages-inventory.csv','utf8').replace(/^﻿/,'');
const lines = content.trim().split(/\r?\n/);
const header = parseLine(lines[0]);
let bad=0;
lines.slice(1).forEach((l)=>{ if(parseLine(l).length!==header.length) bad++; });
console.log(bad===0 ? 'CSV VÁLIDO ✓' : 'CSV INVÁLIDO: '+bad+' filas con error');
"
```
