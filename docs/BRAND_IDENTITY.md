# BarberíaOS — Identidad de Marca Oficial

> **Versión: 1.0 · Fecha: 2026-06-16**
> Este documento es la referencia única de marca. Si algo visual o de copy contradice lo aquí escrito, lo aquí escrito gana — se corrige el código, no el documento.
> Reemplaza/complementa: `docs/BARBERIAOS_DESIGN_SYSTEM.md` (sigue siendo válido para detalle de componentes del dashboard) y deja obsoleto `docs/BARBERIAOS_VISUAL_DIRECTION.md` en el punto de tipografía (ver sección 7).

---

## 0. Por qué existe este documento

El producto ha pasado por múltiples rebuilds de landing, cambios de paleta y cambios de copy del Hero en sesiones sucesivas. El código ya tiene un sistema bastante consistente — el problema no es falta de dirección, es falta de **una fuente única de verdad documentada** a la que volver antes de iterar otra vez. Este documento fija las decisiones. Cambiar la marca a partir de ahora requiere editar este archivo primero, no directamente el componente.

---

## 1. Auditoría — inconsistencias encontradas en el código (con archivo y detalle)

### 1.1 Dorado — 4 tonos distintos convivían en el repo

| Hex | Dónde aparece | Veredicto |
|---|---|---|
| `#D4AF37` | `app/globals.css` (`--gold`, token raíz), `tailwind.config.ts` (`gold`), `components/landing/BarberíaOSHomeLanding.tsx` (la landing real, importada en `app/page.tsx`), `components/brand/BarberiaOSLogo.tsx` (stop intermedio del gradiente del logo) | **OFICIAL** — es el token raíz del sistema y el más usado con diferencia |
| `#C9A227` / `#C9922A` | `components/brand/BarberiaOSLogo.tsx` (gradiente del wordmark "OS"), `docs/BARBERIAOS_DESIGN_SYSTEM.md` (sugerido para kickers/labels) | Variante secundaria válida — es un dorado más oscuro derivado del mismo sistema, no un dorado distinto sin relación |
| `#B88917` | `app/globals.css` (`--gold-dark`), `tailwind.config.ts` (`goldDark`) | Variante oficial — dorado oscuro para texto sobre fondo claro |
| `#c9a84c` (minúsculas, tono distinto y no derivado del sistema) | `app/alternativa-a-booksy/page.tsx`, `app/calculadora-booksy/CalculadoraBooksyClient.tsx`, `app/blog/cuanto-cobra-booksy/page.tsx` | **INCONSISTENCIA REAL.** Estas 3 páginas no usan los tokens de Tailwind/CSS del resto del sitio: están escritas con `style={{ ... }}` inline, con su propio dorado (`#c9a84c`), su propio negro (`#0a0a0a`, no `#09090B`/`--carbon`), su propio gris de texto (`#999`, no `--gray-text` `#52525B`), tipografía `system-ui` en vez de Plus Jakarta Sans, y el wordmark "BarberíaOS" como texto plano en vez de `<BarberiaOSLogo />`. Son páginas de campaña SEO (alternativa a Booksy, calculadora, blog) construidas como HTML aislado, probablemente copiadas de los prototipos en `docs/imports/booksy-campaign/*.html`. |

**Decisión**: `#D4AF37` es el dorado oficial. Es el token raíz (`--gold`) en `globals.css`, el que define `tailwind.config.ts`, y el que usa la landing real. No se inventa un tono nuevo.

**Pendiente de unificar (NO corregido en esta tarea — afecta 3 archivos con ~15-17 ocurrencias cada uno, fuera del límite de "fix trivial de una línea")**: migrar `alternativa-a-booksy/page.tsx`, `calculadora-booksy/CalculadoraBooksyClient.tsx` y `blog/cuanto-cobra-booksy/page.tsx` de estilos inline a clases Tailwind con los tokens oficiales, y sustituir el wordmark de texto por `<BarberiaOSLogo variant="full" tone="dark" />`. Recomendado como tarea propia de 1-2 sesiones.

### 1.2 Fondos oscuros — consistentes, no hay tono "huérfano"

Verificado en `app/globals.css`:
- `#09090B` (`--carbon`) — fondo de página (landing, sidebar, body). Confirmado como el `background` real del `<body>` (línea ~139, gradiente que va de `#09090B` a `#0D0D0F` a `#111111`).
- `#111111` (`--carbon-soft`) — negro premium elevado, hover de carbon.
- `#0E0E1C` — fondo de **card oscura**, usado de forma consistente en `.card-dark`, `.panel`, `.bento-card`, `.dashboard-card`, `.premium-card`, `.quick-action-card`, `.surface-frame`, `.section-band-dark` (todas en `globals.css`, líneas 233-531). No es una inconsistencia: es el token deliberado de "card sobre fondo oscuro", un nivel por encima del fondo de página.
- `#0D0D0F` — paso intermedio del gradiente de fondo, y también usado puntualmente como fondo de card en el rediseño de Sidebar (sprint "Sidebar Dark Premium").

**Veredicto**: el sistema de 3 niveles ya es coherente. La única mancha es, de nuevo, `alternativa-a-booksy` y las otras 2 páginas de campaña usando `#0a0a0a` y `#141414` en vez de `#09090B`/`#0E0E1C`.

### 1.3 Mensaje de posicionamiento — coherente en las páginas vivas, pero hay código muerto que confunde

Páginas de venta activas auditadas: `components/landing/BarberíaOSHomeLanding.tsx` (única landing importada en `app/page.tsx`), `app/alternativa-a-booksy/page.tsx`, `app/calculadora-booksy/`, `app/blog/cuanto-cobra-booksy/page.tsx`. Todas atacan a Booksy con el mismo eje: **comisión por reserva vs. cuota fija**. Frases encontradas:

- `BarberíaOSHomeLanding.tsx`: "0% comisión", "Reserva sin comisión", "Precio fijo mensual. Sin comisión por reserva. Sin permanencia mínima."
- `alternativa-a-booksy/page.tsx`: "Deja de pagar el 30% por tus propios clientes", "Booksy cobra comisión incluso por clientes que ya son tuyos. BarberíaOS es un precio fijo mensual."

El mensaje en sí **no está fragmentado** — el eje de ataque a Booksy es idéntico en todas. El problema es puramente visual (sección 1.1), no de mensaje.

**Hallazgo adicional**: existen dos componentes de landing completos sin usar — `components/landing/UltraVipLanding.tsx` y `components/landing/SquirePremiumLanding.tsx` — que NO están importados en ninguna ruta de `app/`. Llevan el mismo mensaje anti-Booksy (revisado), así que no contradicen la marca, pero son código muerto que puede confundir a futuras sesiones si alguien las edita pensando que están en producción. Recomendado: borrarlas o moverlas a una carpeta `_archive/` en una tarea de limpieza aparte.

### 1.4 Violeta — uso correcto, confirmado

Revisado `components/dashboard/Sidebar.tsx`: el violeta (`#7C3AED`, `#6D28D9`, `#A78BFA`, `#5B21B6`) se aplica únicamente cuando `item.isAI` es verdadero (el item "Studio IA" del sidebar). Revisado también `docs/BARBERIAOS_DESIGN_SYSTEM.md`, que documenta la misma regla ("Violet: exclusivamente para Studio IA"). No se encontró ningún uso de violeta fuera de Studio IA/Marketing Studio/IA Dueño en los archivos auditados (`app/dashboard/estadisticas/page.tsx` no usa violeta, por ejemplo). **Regla ya respetada en el código — solo faltaba documentarla a nivel de marca general, no solo de dashboard.**

### 1.5 Estados semánticos — consistentes

`--success: #16A34A`, `--danger: #EF4444`, `--warning/--amber: #F59E0B`, azul `--brand-accent: #2563EB` para CTA/acción. Mismos valores en `globals.css` y en `docs/BARBERIAOS_DESIGN_SYSTEM.md`. Confirmado, sin hallazgos de inconsistencia.

### 1.6 Tipografía — un doc oficial desactualizado (corregido aquí)

`docs/BARBERIAOS_VISUAL_DIRECTION.md` (v1.0, 2026-05-30) dice: *"Inter para cuerpo de texto, Geist Sans para headings"*. Esto ya no es así: `app/layout.tsx` importa y aplica `Plus_Jakarta_Sans` como única fuente (`--font-sans`, aplicada a `<html>` y `<body>`), confirmado también en el comentario de `globals.css` línea 12 ("Variable inyectada por next/font: --font-sans (Plus Jakarta Sans)"). El cambio de fuente ocurrió en un sprint posterior (memoria del proyecto: "Sprint 2026-06-11 ... Jakarta Sans") y `BARBERIAOS_VISUAL_DIRECTION.md` no se actualizó. Este documento (`BRAND_IDENTITY.md`) es ahora la referencia correcta en este punto.

---

## 2. Paleta de colores oficial (definitiva)

### Dorado — único acento de marca

| Token | Hex | Uso |
|---|---|---|
| `--gold` / `gold` | **`#D4AF37`** | Color de marca principal. Iconos activos, bordes de acento, CTAs premium, glow, línea superior de PageHeader. |
| `--gold-dark` / `goldDark` | `#B88917` | Texto dorado sobre fondo claro (el `#D4AF37` puro falla contraste sobre blanco). |
| variante gradiente wordmark | `#C9A227` | Solo dentro del gradiente del logo (`BarberiaOSLogo.tsx`) y para kickers/labels pequeños donde se necesita más contraste que el dorado puro. |
| `--gold-tint` | `rgba(212,175,55,0.10)` | Fondo tinted muy sutil. |
| `--gold-border` | `rgba(212,175,55,0.28)` | Borde de elementos con acento gold. |
| `--gold-glow` | `rgba(212,175,55,0.22)` | Sombra/resplandor dorado. |

**Prohibido**: cualquier otro hex de dorado nuevo (`#c9a84c` queda explícitamente desautorizado — ver sección 1.1).

### Fondos oscuros (landing, sidebar, hero) — 3 niveles

| Nivel | Token | Hex | Uso |
|---|---|---|---|
| Fondo de página | `--carbon` | `#09090B` | Body de landing, fondo del sidebar. |
| Fondo intermedio / hover | `--carbon-soft` | `#111111` (con `#0D0D0F` como paso de transición en gradientes) | Hover de carbon, segundo paso del gradiente de body. |
| Fondo de card destacada | `0E0E1C` | `#0E0E1C` | `.card-dark`, `.panel`, `.bento-card`, `.dashboard-card`, `.premium-card`. Toda card que "flota" sobre el fondo oscuro. |

### Fondos claros (dashboard)

| Token | Hex | Uso |
|---|---|---|
| `--cream` | `#F7F3EA` | Fondo de página del dashboard. |
| `--warm-white` | `#FAFAF7` | Cards, panels, inputs sobre fondo claro. |

### Violeta — exclusivo de Studio IA / funciones de IA generativa

| Token | Hex | Uso |
|---|---|---|
| `--violet` | `#6D28D9` | Fondo de botones/iconos activos de Studio IA. |
| `--violet-mid` | `#7C3AED` | Variante intermedia, focus rings de Studio. |
| `--violet-soft` | `#A78BFA` | Bordes y líneas decorativas de Studio. |
| `--violet-surface` | `#F6F3FF` | Fondo tinted de secciones Studio sobre fondo claro. |

**Regla**: el violeta nunca se usa para navegación general, CTAs del producto base, ni branding fuera de Studio IA / IA Dueño / Marketing Studio con IA generativa. Si un componente nuevo no es una feature de IA, no lleva violeta. Esta regla ya se respeta en el código (`Sidebar.tsx` la aplica condicionalmente con `item.isAI`); este documento solo la formaliza fuera del scope del dashboard.

### Estados semánticos (ya consistentes — confirmado, no se tocan)

| Estado | Hex | Uso |
|---|---|---|
| Éxito / activo | `#16A34A` | Confirmaciones, estado activo, hueco libre en agenda (`#DDF8E7` como tint). |
| Advertencia | `#F59E0B` | Alertas, pendiente. |
| Error / cancelado | `#EF4444` | Errores, cancelaciones, no apareció. |
| Acción / CTA / información | `#2563EB` | Botones de acción primaria, confirmado, info. |

---

## 3. Tipografía oficial

- **Familia única**: Plus Jakarta Sans (`next/font/google`, variable `--font-sans`), aplicada globalmente vía `app/layout.tsx`.
- **Peso máximo permitido: 800** (`font-extrabold`). Nunca usar peso 900 — la fuente no lo soporta correctamente y rompe el build (ya documentado en memoria del proyecto, confirmado aquí como regla de marca, no solo técnica).
- Cualquier página que use `font-family: system-ui` o similar vía estilos inline (caso de las 3 páginas de campaña en sección 1.1) está fuera de la identidad tipográfica oficial.

---

## 4. Logo

**Componente**: `components/brand/BarberiaOSLogo.tsx`.

- Marca: una "B" dorada tipo moneda/medalla con gradiente metálico de 7 stops (`#FFF59C` → `#D4AF37` → `#C9A227` → `#7A5506`), fondo crema/marfil radial, rim dorado.
- Variantes: `icon` (solo la B), `sidebar` (B a 34px), `full` (B + wordmark "Barbería" + "OS" en gradiente dorado), `horizontal`/`small` (alias de `full`), `isotipo`/`favicon` (alias de `icon`).
- Tonos: `light` (texto `#111111`, para fondos claros) y `dark` (texto blanco, para fondos oscuros).
- **Regla**: cualquier página de venta o campaña debe usar `<BarberiaOSLogo />`, nunca el wordmark "BarberíaOS" como texto plano con estilos inline (incumplido actualmente en `alternativa-a-booksy/page.tsx` — ver 1.1).

---

## 5. Mensaje de posicionamiento central

> **Frase oficial única**: *"Cuota fija mensual. 0% comisión por reserva. La alternativa a Booksy para barberías que quieren quedarse con sus clientes."*

Variantes cortas autorizadas (para Hero, badges, kickers — deben transmitir siempre el mismo eje: cuota fija vs. comisión):
- "0% comisión por reserva. Para siempre."
- "Precio fijo mensual. Sin comisión por reserva. Sin permanencia mínima."
- "Deja de pagar por tus propios clientes."

**Cómo debe aparecer en todas las páginas de venta**: el eje "cuota fija vs. comisión variable de Booksy" debe estar presente en el Hero (primeras 2 frases) y repetirse al menos una vez más antes del CTA final (pricing o FAQ). Confirmado que esto ya ocurre en `BarberíaOSHomeLanding.tsx` y en `alternativa-a-booksy/page.tsx` — el mensaje en sí está bien, solo falta corregir el envoltorio visual de las páginas de campaña.

**Mensaje de producto** (no competitivo, descriptivo): *"Un sistema para que tus clientes reserven desde Instagram, Google, WhatsApp o QR, y tú gestiones toda la barbería desde un panel."* — usar en metadatos SEO, descripciones cortas, secciones de producto donde no se está comparando con Booksy directamente.

---

## 6. Tono de voz

**Características**: directo, español de España, frases cortas, datos concretos, cero jerga corporativa, cero promesas vagas.

### Sí es BarberíaOS
- "Activo en 30 minutos." (concreto, medible)
- "Sin tarjeta · Sin permanencia." (datos directos, sin adornos)
- "0% comisión por reserva." (cifra exacta, sin eufemismo)
- "Booksy cobra por cada reserva gestionada. BarberíaOS cobra una cuota mensual fija." (comparación directa, sin victimismo)
- "48 horas desde que empezamos. El día 1 configuramos barbería, servicios, barberos y QR." (proceso concreto con tiempos reales)

### No es BarberíaOS
- "Revoluciona la gestión de tu barbería con nuestra innovadora plataforma todo-en-uno." (jerga corporativa, "revoluciona"/"innovadora" sin sustento)
- "Únete a la nueva era digital de la peluquería." (vago, sin dato, sin beneficio concreto)
- "Empodera tu negocio con soluciones de vanguardia." (palabrería sin información)
- "¡Tu barbería al siguiente nivel! 🚀✨" (exceso de exclamaciones/emojis, tono hype sin sustancia — el producto vende con cifras, no con entusiasmo artificial)
- "Optimizamos sinérgicamente tu flujo de trabajo end-to-end." (anglicismo/buzzword innecesario; en español de España, sin tecnicismos de consultora)

---

## 7. Checklist — antes de cambiar algo visual o de copy

Antes de tocar cualquier color, fuente, logo o mensaje de venta, verificar:

1. **¿El dorado que voy a usar es `#D4AF37` (o sus variantes oficiales `#B88917`/`#C9A227`)?** Si es cualquier otro hex, no se usa — se corrige al oficial.
2. **¿El fondo oscuro corresponde al nivel correcto?** Página → `#09090B`. Card sobre fondo oscuro → `#0E0E1C`. No inventar un cuarto nivel.
3. **¿Estoy usando Tailwind/clases del sistema o estilos inline `style={{}}`?** Si es una página nueva de venta/campaña, debe usar las clases y tokens existentes — no recrear un mini design-system aislado (el error que cometieron `alternativa-a-booksy`, `calculadora-booksy` y `blog/cuanto-cobra-booksy`).
4. **¿Es violeta?** Solo si la feature es de IA generativa (Studio IA, IA Dueño, Marketing Studio con IA). Si no, no.
5. **¿La tipografía es Plus Jakarta Sans, peso ≤ 800?** Nunca `system-ui` en páginas nuevas, nunca peso 900.
6. **¿El logo es el componente `<BarberiaOSLogo />`?** Nunca el wordmark como texto plano con estilos propios.
7. **¿El mensaje de venta mantiene el eje "cuota fija vs. comisión Booksy"?** Si es una página de venta/competitiva, ese eje debe aparecer en el Hero.
8. **¿El tono suena a dato concreto o a frase de agencia de marketing?** Si suena a "revoluciona"/"empodera"/"siguiente nivel", se reescribe (ver sección 6, columna "No es BarberíaOS").
9. **¿Estoy creando un componente de landing nuevo en paralelo a uno que ya existe?** Antes de crear `XxxLanding.tsx` nuevo, comprobar qué componente está realmente importado en `app/page.tsx` y editar ese, en vez de crear una variante más que quede sin usar (como pasó con `UltraVipLanding.tsx` y `SquirePremiumLanding.tsx`).

---

## 8. Pendientes de unificación (fuera de scope de esta tarea)

- Migrar estilos inline de `app/alternativa-a-booksy/page.tsx`, `app/calculadora-booksy/CalculadoraBooksyClient.tsx` y `app/blog/cuanto-cobra-booksy/page.tsx` a los tokens oficiales (Tailwind + `globals.css`) y sustituir el wordmark de texto por `<BarberiaOSLogo />`.
- Decidir si `components/landing/UltraVipLanding.tsx` y `components/landing/SquirePremiumLanding.tsx` (no usados en ninguna ruta) se archivan o se eliminan, para que no generen confusión en sesiones futuras.
- Actualizar o deprecar formalmente `docs/BARBERIAOS_VISUAL_DIRECTION.md` en el punto de tipografía (dice Inter/Geist Sans; la tipografía real y oficial es Plus Jakarta Sans, ya corregido en este documento).
