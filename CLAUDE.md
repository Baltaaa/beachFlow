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
- Pipeline: form (`fetch` a `VITE_N8N_WEBHOOK_URL`) → n8n (`prius-leads` workflow) → Supabase tabla `leads`
- ⚠️ **Corrección (auditoría 08/10/2026):** `ContactSection.jsx` **no inserta en Supabase
  directamente** — hace `fetch POST` al webhook de n8n, y es n8n el que escribe en `leads`
  (presumiblemente con service role, no con la anon key). Verificado con la anon key: el
  rol `anon` NO tiene permiso de `select` ni de `insert` sobre `leads` (`permission denied
  for table leads`). La descripción vieja de "RLS: insert anónimo" ya no aplica tal cual —
  cualquier futuro insert directo desde este repo con la anon key necesita que priusApp
  habilite esa policy primero.
- **Pendiente:** nodo de notificación WhatsApp vía CallMeBot en el workflow de n8n
  (bloqueado hasta tener acceso físico al WhatsApp del balneario para registrarlo)

## Prius Club (roadmap, no iniciado)

Sistema de fidelización dentro de la SPA existente (NO ruta/página separada):
- 3 tiers: Arena, Marea, Horizonte
- Generación de QR
- Links de referido únicos (captura de parámetro `?ref=`)
- Tabla Supabase `referrals`
- La barra de anuncios debe scrollear a `#prius-club`

Schema de Supabase y prompt de UI todavía no arrancados.

## ⚠️ Regla permanente: toda imagen nueva se optimiza SIEMPRE

Cada vez que se agreguen imágenes nuevas al proyecto (sin excepción, sea cual sea la
sección), Claude Code debe por defecto:

1. Convertirlas a **WebP** con `cwebp -q 85`
2. Nombrarlas en **kebab-case** descriptivo
3. Nunca dejar el archivo original (JPG/PNG) pesado en `public/images/` — solo el
   `.webp` optimizado
4. Confirmar tamaño final antes de commitear (`du -h`) para verificar que no se
   esté repitiendo el problema de imágenes de 10-20MB+ que tuvo el proyecto

Esto aplica automáticamente sin que haga falta pedirlo en cada prompt puntual.

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

## Reservas públicas y DB compartida con priusApp

### Propiedad del schema
- beachFlow comparte el proyecto Supabase `oslbsnwccchdxmbjhhcg` con el CRM (repo priusApp).
- Schema, migraciones, RLS y Edge Functions son propiedad exclusiva de priusApp. Desde este repo nunca se migra ni se despliegan funciones.
- El MCP de Supabase de este repo es read_only.
- Fuente de verdad de reglas de negocio y datos: el CLAUDE.md de priusApp.

### Qué puede hacer la anon key (contrato)
- Ejecutar `disponibilidad_publica(desde, hasta)`, `cotizar(tipo_unidad, tipo_alquiler, metodo, desde, hasta)` y `buscar_unidad_vecina(unidad_id, desde, hasta)`.
- Leer `config_reservas_publicas`.
- Insertar en `leads` (form de contacto, comportamiento heredado).
- Nada más: nunca lee `reservas`, `clientes` ni `pagos`.
- Toda creación de reserva pasa por una Edge Function de priusApp (`crear-reserva-publica`, fase 2), nunca por insert directo.
- El cliente nunca envía precios: los calcula el servidor.

### Plano de la landing
- Es EL MISMO plano diario del CRM: misma grilla, construida con `unidades.fila` y `unidades.orden`, donde los pasillos son saltos en `orden`.
- Se filtra por las fechas elegidas en el paso 1 del form.
- No muestra ningún dato de clientes. Toda unidad con `bloqueada = true` (ocupada por día, período o temporada, preconfirmada vigente o no habilitada web) aparece con un candado. Las libres son seleccionables.
- Tiempo real: suscripción al canal Broadcast `disponibilidad`, evento `cambio`. Al recibirlo, se vuelve a llamar `disponibilidad_publica` para las fechas actuales con un debounce de unos 500 ms. El payload no trae datos; es solo un aviso.
- El componente visual del plano se porta desde priusApp, en la fase 4, como componente puramente presentacional (recibe unidades y devuelve la grilla). Hay que adaptar las clases de Tailwind v3 del CRM a la v4 de este repo sin cambiar el resultado visual.

### Form step-by-step (/reservar)
1. Fechas y tipo de alquiler, solo los de `config.tipos_alquiler_web`. Para temporada se ofrece contacto, que genera un lead.
2. Cantidad de personas.
3. Carpa o sombrilla.
4. Plano.
5. Datos de contacto.
6. Resumen con el precio por cada método de pago.
7. Confirmar → QR.

Reglas del form:
- Capacidad: carpa 6, sombrilla 4 (dato de `unidades.capacidad`). Si las personas superan la capacidad, se marca una segunda unidad vecina (`buscar_unidad_vecina`) que el cliente puede cambiar por otra libre. Máximo `config.max_unidades_por_reserva`; si se necesitan más, se ofrece contacto con administración.
- Si `config.activo = false`, el form muestra que las reservas online no están disponibles y ofrece contacto.
- Sin tarifa (cotizar devuelve null), esas fechas no se pueden reservar online.

### Confirmación y QR (/r/:codigo)
- Código `PRIUS-XXXXXX`.
- El QR (librería `qrcode`) contiene la URL `https://priusplayagrande.com.ar/r/PRIUS-XXXXXX`, sin datos sensibles.
- La página /r/:codigo obtiene los datos mínimos con la Edge Function `consultar-reserva` (fase 2) y muestra el QR descargable y un botón para compartir por WhatsApp (wa.me).
- En recepción se escanea el QR o se dicta el código. Con eso solo falta cobrar.

### Orden de trabajo
- beachFlow 1-B (este repo): preparación, contrato y smoke test.
- priusApp 2: Edge Functions.
- priusApp 3: Recepción.
- beachFlow 4: form y plano, con diseño previo en Stitch.
- beachFlow 5: página del QR y email.

### Hallazgos de la auditoría 1-B (08/10/2026) — importante para fases 2, 4 y 5
- **`config_reservas_publicas.activo = false` en este momento.** El form de reservas, cuando se construya, debe arrancar mostrando el mensaje de "reservas online no disponibles" hasta que se active desde priusApp.
- `tipos_alquiler_web` actual: `["dia", "periodo"]` (sin `"temporada"` todavía).
- `max_unidades_por_reserva = 2`, `max_reservas_activas_por_telefono = 2`, `dias_anticipacion_max = 60`, `hora_corte_noshow = 12:00:00`.
- `cotizar(...)` devuelve `null` hoy (no hay tarifas cargadas en `tarifas`, 0 filas) — comportamiento esperado, sin error.
- **Firmas exactas confirmadas por MCP (introspección read-only, `pg_proc`):**
  - `disponibilidad_publica(p_desde date, p_hasta date) RETURNS TABLE(unidad_id uuid, numero integer, tipo text, fila integer, orden integer, capacidad integer, bloqueada boolean)`
  - `cotizar(p_tipo_unidad text, p_tipo_alquiler text, p_metodo text, p_desde date, p_hasta date) RETURNS numeric`
  - `buscar_unidad_vecina(p_unidad uuid, p_desde date, p_hasta date) RETURNS TABLE(unidad_id uuid, contigua boolean)` — el parámetro se llama **`p_unidad`**, no `p_unidad_id`. Importante: **no devuelve los datos completos de la unidad**, solo `unidad_id` y `contigua` — el form tiene que cruzar ese id con el resultado ya cargado de `disponibilidad_publica` para mostrarla en el plano.
- El rol `anon` **no tiene ningún permiso sobre `leads`** (ni `select` ni `insert` — `permission denied for table leads`, con RLS habilitado en la tabla), lo que confirma que el insert real pasa por n8n con otra credencial, no por la anon key del browser. Antes de que el form de reservas (fase 4/5) necesite insertar algo directamente con la anon key, hay que confirmar con priusApp qué tabla/RPC es la vía correcta — no asumir que `leads` acepta insert anónimo.
- **Columnas reales de `leads`** (confirmadas por MCP): `id, created_at, nombre, telefono, email, asunto, mensaje, origen, estado, notas_crm, motivo, datos_form`. `estado` ∈ `nuevo|contactado|convertido|descartado` (default `nuevo`). `motivo` ∈ `contacto|form_abandonado|grupo_grande|temporada|sin_disponibilidad` (default `contacto`). `datos_form` es `jsonb`, nullable.
- No existe la herramienta `generate_typescript_types` en el MCP de este repo (scope `features=database,docs`, sin el grupo `development`). `src/lib/reservas-contrato.ts` quedó escrito a mano a partir del schema real en vez de derivarse de un `src/types/supabase.ts` generado — si se necesita ese archivo, hay que ampliar el scope del MCP desde priusApp/Supabase o generarlo con la CLI de Supabase (no instalada en este entorno).