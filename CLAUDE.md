# Prius Playa Grande — Landing Page (beachFlow)

## Qué es este proyecto

Landing page del beach club **Prius Playa Grande** (Playa Grande, Mar del Plata).
Deploy en producción: https://priusplayagrande.pages.dev/

⚠️ **Migración de dominio en curso:** el desarrollo sigue por ahora en la URL de Worker
(`priusplayagrande.pages.dev`), pero los DNS ya están transferidos y el dominio oficial
de producción va a ser **`priusplayagrande.com.ar`**, ya linkeado al worker. Cuando se
confirme el corte definitivo, actualizar cualquier referencia hardcodeada a la URL vieja
(meta tags OG, sitemap, canonical links, config de Supabase/n8n si aplica, variables de
entorno con la URL del sitio) para que apunten al dominio `.com.ar`.

Este repo (`beachFlow`) es la landing. Existe un segundo proyecto, la **CRM web app**,
que es un repo/codebase separado pero comparte el mismo proyecto de Supabase. Cambios
de schema en Supabase deben considerar ambos consumidores y sus distintos contextos de auth
(landing: acceso anónimo para inserts; CRM: acceso autenticado para reads/updates).

## Stack

- **Vite + React + JSX** — NO es Next.js. No usar convenciones de Next (ni App Router,
  ni `process.env.NEXT_PUBLIC_*`, ni `next/image`, etc.)
- **Tailwind CSS**
- Deploy: **Cloudflare Pages**
- Backend/automatización: **Supabase** + **n8n** (`priuspg.app.n8n.cloud`) + **CallMeBot** (WhatsApp)

## ⚠️ Regla crítica: variables de entorno

Este proyecto usa **exclusivamente** `import.meta.env.VITE_*`.

NUNCA usar `process.env.NEXT_PUBLIC_*` — es un error que se repitió antes con Gemini/Dyad.
Cualquier código, ejemplo o snippet que toque env vars debe usar la sintaxis de Vite.

## Sistema de diseño (auditado directo del sitio en producción, 07/08/2026)

### Paleta de colores REAL

⚠️ Corrección importante: la base **no es navy/azul**, es **negro/carbón puro**. No usar
azules en el sistema de diseño salvo que se decida agregar como excepción puntual.

- **Dorado (único acento de marca):** `#F2CA50` / `rgb(242, 202, 80)`
- **Base oscura (fondo principal):** `rgb(23, 23, 23)` y `rgb(10, 10, 10)` — negro/carbón,
  no azul marino
- **Blancos con opacidad** para texto sobre fondo oscuro, escalonados según jerarquía:
  `rgba(255,255,255,0.95)` (texto principal) hasta `rgba(255,255,255,0.4)` (texto terciario/disabled)
- **Negros con opacidad** para texto sobre fondo claro: de `rgba(0,0,0,0.8)` a `rgba(0,0,0,0.4)`
- Fondos claros puntuales: `rgb(255,255,255)`, `rgb(249,249,249)`, `rgb(229,229,229)`

⚠️ **Inconsistencia detectada en producción, pendiente de decisión:** la sección de
testimonios usa `bg-blue-600` / `bg-blue-500` (azules default de Tailwind) en avatares
con iniciales y un ícono de check tipo "verificado". Esto rompe la regla de dorado como
único acento. No replicar este patrón en desarrollo nuevo sin confirmar con Balta si es
intencional (estilo check de verificado) o hay que reemplazarlo por dorado/blanco.

### Tipografía REAL

- **Headings:** `Exo, sans-serif` — siempre en `UPPERCASE`. Weight varía según jerarquía:
  `700` (bold) para H1 y headings de mayor impacto, `400` (regular) para algunos H2 de sección
- **Body/texto general:** `"Instrument Sans", sans-serif`
- Tamaños de referencia: H1 hero `64px`, H2 de sección `48px`, H2 grande (ej. "El Salón.") `62px`

### Botones / CTAs (patrón muy consistente en todo el sitio)

- **Siempre pill-shape:** `border-radius: 9999px` (nunca esquinas rectas ni levemente
  redondeadas en botones)
- Texto: `UPPERCASE`, `font-weight: 700`, tamaño chico (`11px`–`12px`)
- Padding típico: `14px 28px` (CTA principal), `8px 16px` (filtros/tabs), `0px 28px` (botones compactos)
- Color de fondo: dorado `#F2CA50` para CTAs primarios

### Border radius (cards y contenedores)

Escala usada en el sitio, de mayor a menor:
`28px` → `24px` → `16px` → `12px` → `8px` → `2px` (elementos chicos)
Botones y elementos tipo "pill" usan `9999px` (full round), no esta escala.

### Responsive

- Obligatorio desde **360px** (mobile) hasta **4K / 2560px+**
- Usar `max-w` containers para que el contenido no se estire feo en pantallas grandes

### Secciones reales del sitio (orden actual)

`hero` → `partners` (Socios Estratégicos) → `servicios` → `eventos` → `testimonios` → `contacto`

Headings de servicios confirmados en producción (útil para no duplicar/inventar nombres):
Deck Principal, Reposeras Ergonómicas, Solárium & Pileta, Sabores de Costa, Lanzamientos y
Cenas, Barra de Encuentros, Conexión estable para reuniones (coworking), Espacio de
Sombrillas, Espejo de Agua, Aqua Dance, Celebraciones Privadas, Casamientos y Fiestas de 15,
Cocktails de Autor, Baños Renovados, entre otros.

## Zonas del código: funcional vs visual

**Separar siempre cambios visuales de cambios funcionales.** No tocar lógica funcional
al hacer cambios de UI, salvo pedido explícito:

- Lógica del **cotizador** (pasos, estados) — actualmente funcionalmente congelada,
  no se debe tocar hasta que avance el desarrollo del CRM
- Integraciones con **Supabase**
- **Webhook de n8n**
- Estados de **modales**
- Lógica de **filtros**

## Lead capture (en producción, funcionando)

- `ContactSection.jsx` — formulario de 5 campos con validación de estados
- Pipeline: form → n8n (`prius-leads` workflow) → Supabase tabla `leads`
- RLS configurado: insert anónimo (landing) + read/update autenticado (CRM)
- **Pendiente:** nodo de notificación WhatsApp vía CallMeBot en el workflow de n8n
  (bloqueado hasta tener acceso físico al WhatsApp del balneario para registrarlo)

## Cotizador / reservas

Sección actualmente **funcionalmente intocable**. Roadmap futuro (no implementar todavía
sin confirmación explícita):
- Mapa interactivo de playa (espejo del que va a tener el CRM)
- Renderizado en tiempo real desde Supabase
- Gateway de pago Mercado Pago
- Generación de ID único de reserva

## Prius Club (roadmap, no iniciado)

Sistema de fidelización dentro de la SPA existente (NO ruta/página separada):
- 3 tiers: Arena, Marea, Horizonte
- Generación de QR
- Links de referido únicos (captura de parámetro `?ref=`)
- Tabla Supabase `referrals`
- La barra de anuncios debe scrollear a `#prius-club`

Schema de Supabase y prompt de UI todavía no arrancados.

## Assets e imágenes

- Optimización con `cwebp`, baseline de calidad **q=85** (q=80 disponible si se necesita
  más reducción de tamaño a costa de calidad)
- ⚠️ **Hay una limpieza de imágenes pesadas pendiente en `/public/images`** — varios
  archivos de 10-20MB+ sin optimizar. Antes de agregar imágenes nuevas, revisar que
  no se repita el problema.
- Assets ya establecidos: `prius-logo-white.png` (fondo transparente, texto blanco,
  para navbar), logo original, favicons completos (múltiples tamaños + Apple touch icon)

## Navbar sticky

Solución elegida: fondo navy oscuro con `backdrop-blur-lg`, manteniendo siempre visible
`prius-logo-white.png` (se descartó la lógica de swap dual de logos por ser más compleja
de mantener y menos consistente con la marca).

## Bug conocido pendiente

Marquee de "Socios Estratégicos" (logos de partners) duplica logos incorrectamente
dentro del viewport por mal manejo del array en el loop infinito.

## Flujo de trabajo

- Cambios visuales y funcionales van en commits/prompts separados
- Cuando se pida un cambio de UI, no asumir que también hay que tocar lógica —
  si hace falta, preguntar antes
- Priorizar código explícito y scopeado; evitar refactors amplios no pedidos