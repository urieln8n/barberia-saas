# SEO Control — BarberíaOS

Sistema de control SEO para BarberíaOS. Inventario de todas las páginas del proyecto con datos de optimización, conversión y negocio.

---

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `pages-inventory.csv` | Inventario completo de todas las rutas Next.js con datos SEO, estado y próximas acciones |
| `business-map.csv` | Mapa de ofertas comerciales: cliente ideal, dolor, promesa y página principal por cada producto |
| `README.md` | Este archivo |

---

## pages-inventory.csv — Guía de columnas

| Columna | Descripción | Valores posibles |
|---------|-------------|-----------------|
| ID | Identificador numérico único (001, 002...) | 001–999 |
| URL | Ruta pública del navegador | `/software-para-barberias` |
| Ruta Next.js | Ruta del archivo `page.tsx` dentro de `app/` | `app/software-para-barberias/page.tsx` |
| Tipo de página | Categoría funcional de la página | Home, Landing SEO, Landing ciudad, Institucional, Legal, Dashboard privado, Admin privado, API, Funcional, Autenticación, Casos de estudio, Directorio |
| Negocio/Oferta | Producto o servicio al que sirve esta página | BarberíaOS SaaS, Demo, Academia, etc. |
| Keyword principal | Término principal de búsqueda objetivo | `software para barberías` |
| Keywords secundarias | Términos secundarios separados por coma | `agenda online barbería, reservas barbería` |
| Ciudad | Ciudad target si es landing local | `Barcelona`, `Madrid`, vacío si es nacional |
| Intención de búsqueda | Tipo de intención del usuario | Informacional, Transaccional, Navegacional, Comparativa, Local |
| Estado | Estado de publicación de la página | Publicada, En desarrollo, Recomendada — FALTA CREAR, Activa (funcional), Activa |
| Prioridad | Importancia para SEO y conversión | Alta, Media, Baja, N/A |
| Título SEO | Contenido del `<title>` y og:title | Texto libre |
| Meta description | Contenido de la meta description | Máx. 160 caracteres |
| H1 | Encabezado principal visible en la página | Texto libre |
| CTA principal | Texto del botón o acción de conversión principal | `Ver demo`, `Reservar ahora`, etc. |
| Formulario activo | ¿Tiene formulario de conversión? | Sí, No |
| WhatsApp activo | ¿Tiene botón o enlace a WhatsApp? | Sí, No |
| Schema JSON-LD | Tipos de schema presentes o pendientes | `SoftwareApplication`, `Organization`, `FAQPage`, vacío si falta |
| Está en sitemap | ¿Aparece en sitemap.ts? | Sí, No, Sí (con prioridad X), No incluido — FALTA |
| Indexada en Google | ¿Aparece en Google Search Console? | Sí, No, No verificado |
| Clicks | Clicks mensuales en Google Search Console | Número o vacío |
| Impresiones | Impresiones mensuales en Google Search Console | Número o vacío |
| CTR | Click-through rate | % o vacío |
| Posición media | Posición media en Google para la keyword principal | Número o vacío |
| Última actualización | Fecha de última revisión del inventario | `2026-05-16` |
| Próxima acción | Qué hay que hacer en esta página | Texto libre |
| Notas | Contexto técnico o de negocio relevante | Texto libre |

---

## Cómo importar en Google Sheets

### Opción A — Importar directamente (recomendado)

1. Abre Google Sheets en blanco
2. Menú: **Archivo → Importar**
3. Elige la pestaña **Subir**
4. Arrastra o selecciona `pages-inventory.csv`
5. En "Tipo de separador": selecciona **Coma**
6. En "Codificación": confirma **UTF-8** (el BOM garantiza detección automática en Windows)
7. Clic en **Importar datos**

### Opción B — Google Drive

1. Sube `pages-inventory.csv` a Google Drive
2. Clic derecho → **Abrir con Google Sheets**
3. Google detecta automáticamente el separador y la codificación

### Consejos para Google Sheets

- Congela la primera fila: **Ver → Inmovilizar → 1 fila**
- Añade filtros: selecciona fila 1 → **Datos → Crear un filtro**
- Crea vistas filtradas por `Tipo de página` o `Prioridad`
- Usa formato condicional en la columna `Estado` para marcar en rojo las páginas "FALTA CREAR"

---

## Cómo actualizar el inventario

### Al crear una nueva página

1. Copia la última fila del mismo tipo de página como plantilla
2. Incrementa el ID (ej: si el último es `093`, el nuevo es `094`)
3. Rellena: URL, Ruta Next.js, Tipo de página, Keyword principal, Título SEO, Meta description, H1
4. Actualiza `Está en sitemap` (verifica en `app/sitemap.ts`)
5. Actualiza `Schema JSON-LD` (verifica en el `page.tsx` de la nueva ruta)
6. Pon `Estado` = `Publicada` y `Última actualización` = fecha de hoy

### Al modificar una página existente

1. Encuentra la fila por URL o ID
2. Actualiza los campos modificados
3. Actualiza `Última actualización`
4. Actualiza `Próxima acción` si corresponde

### Cadencia recomendada de revisión

| Tipo de dato | Frecuencia |
|-------------|------------|
| Estructura del inventario (nuevas páginas) | Cada vez que se cree una página |
| Datos de Google Search Console (Clicks, Impresiones, CTR, Posición) | Mensual |
| Estado y Próxima acción | Mensual |
| Títulos SEO y Meta descriptions | Trimestral o tras cambios de producto |

---

## Cómo usar el inventario para SEO, negocio y conversión

### Para SEO

**1. Identificar páginas sin canonical URL**
- Filtra por `Tipo de página` = `Landing SEO`
- Comprueba la columna `Notas` — si dice "falta canonical", añádelo al `page.tsx`

**2. Identificar páginas sin JSON-LD**
- Filtra por `Schema JSON-LD` = vacío
- Las landings SEO deberían tener al menos `SoftwareApplication` + `FAQPage`

**3. Detectar rutas que faltan en sitemap**
- Filtra `Está en sitemap` = "No incluido — FALTA"
- Prioriza las de tipo `Landing SEO` y `Ciudad dinámica`

**4. Páginas pendientes de crear**
- Filtra `Estado` = "Recomendada — FALTA CREAR"
- Son páginas definidas en `src/lib/site-config.ts` que aún no tienen `page.tsx`

### Para negocio y conversión

**1. Páginas de captación vs internas**
- `Landing SEO`, `Home`, `Landing ciudad` = captación de clientes
- `Dashboard privado`, `Admin privado`, `API` = internas sin valor SEO

**2. Medir qué páginas convierten**
- Cruza `Clicks` e `Impresiones` (Google Search Console) con la columna `CTA principal`
- Las páginas con alto tráfico pero sin CTA son oportunidades de conversión perdida

**3. Priorizar desarrollo de nuevas páginas**
- Mira `Prioridad` = Alta + `Estado` = "Recomendada — FALTA CREAR"
- Empieza por `/software-inventario-barberia` y `/crm-clientes-barberia`

### Para controlar el business-map.csv

- Actualiza `Estado comercial` cuando un plan pase de "En desarrollo" a "Activo"
- Añade filas para nuevas ofertas (Shield como producto público, Academia, etc.)
- Cruza con `pages-inventory.csv`: cada oferta en `business-map.csv` debe tener al menos una `Landing SEO` o `Home` como `Página principal`

---

## Rutas críticas con acciones pendientes

Estas rutas requieren atención inmediata antes del siguiente deploy a producción:

| # | URL | Problema | Acción |
|---|-----|----------|--------|
| 1 | `/r/[slug]` | No bloqueada en robots.txt | Añadir `/r/` a `disallow` en `app/robots.ts` |
| 2 | `/review/[token]` | No bloqueada en robots.txt | Añadir `/review/` a `disallow` en `app/robots.ts` |
| 3 | `/barberias/[city]` | Falta en sitemap.ts | Añadir `generateSitemapEntries` con ciudades conocidas |
| 4 | 8 landings SEO | Sin canonical URL | Añadir `alternates: { canonical: url }` en cada `metadata` |
| 5 | 8 landings SEO | Sin JSON-LD FAQPage | Añadir schema en `SeoLandingPage.tsx` |
| 6 | 4 páginas | Sin page.tsx | Crear con `SeoLandingPage`: `/software-inventario-barberia`, `/crm-clientes-barberia`, `/whatsapp-barberias`, `/marketing-barberias` |

---

## Convenciones de nomenclatura

- **IDs**: 3 dígitos con cero a la izquierda: `001`, `002`, `093`
- **Rutas dinámicas**: se documentan con el patrón Next.js: `/barberias/[city]`, `/r/[slug]`
- **Páginas no creadas**: `Ruta Next.js` = `[PENDIENTE DE CREAR]`, `Estado` = `Recomendada — FALTA CREAR`
- **Fechas**: formato `YYYY-MM-DD`
- **Encoding**: UTF-8 con BOM — necesario para Google Sheets en Windows con caracteres españoles

---

## Relación con otros docs del proyecto

| Archivo | Relación |
|---------|----------|
| `docs/TASKS.md` | T010-T013 (Landing), T042-T044 (Marketing) corresponden a páginas de este inventario |
| `src/lib/site-config.ts` | `SEO_INTENT_PAGES` — fuente de verdad para URLs de landings SEO |
| `src/lib/institutional-pages.ts` | Metadata de páginas institucionales |
| `app/sitemap.ts` | Rutas incluidas en sitemap.xml |
| `app/robots.ts` | Rutas bloqueadas para indexación |
| `components/seo/SeoLandingPage.tsx` | Componente base para todas las landings SEO |
