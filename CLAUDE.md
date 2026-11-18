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

## Fase 4B — Reserva online sin pago (implementado, rama `fase4b-reservas`)

### Flujo implementado
En el Paso 1 del cotizador existente (`ContactSection.jsx`), la opción
**"Carpas & Sombrillas"** entra al flujo de reserva de 6 pasos
(`src/features/reservas/ReservaFlow.jsx`) en vez de ir directo al Paso 2 de
datos de siempre. Las otras 3 opciones (Cabinas & Lockers, Eventos, Otra
consulta) siguen exactamente igual, con el mismo `fetch` al webhook de n8n
de siempre — nada de su código se tocó.

### Regla de branding
Lo que ya está en producción manda (Exo + Instrument Sans, dorado
`#F2CA50`, botones píldora, radios de la escala real). De Stitch
(`design/stitch/reservas/`) solo se tomó la estructura/disposición de las
pantallas nuevas — sus colores, fuentes y radios no se usaron donde no
coincidían con producción. Única excepción: el panel del plano (Paso 3) es
Glass Dark, copia exacta del CRM, no de Stitch. Los estilos nuevos quedan
acotados a los componentes del cotizador y a `/r/:codigo`
(`src/features/reservas/*.css`, nunca CSS global). No-regresión verificada
con capturas Playwright de la landing completa fuera del cotizador
(`e2e/no-regresion.spec.js`, baseline en
`e2e/no-regresion.spec.js-snapshots/`).

### Mensaje obligatorio: sujeta a disponibilidad hasta el pago
Todos los textos viven centralizados en `src/features/reservas/mensajes.js`
(incluida la hora de `config.hora_corte_noshow`). Paso 5 tiene un checkbox
obligatorio — sin tildarlo, el botón de confirmar queda deshabilitado.
**Prohibido usar "garantizada", "asegurada" o "confirmada" para una
reserva que todavía no se pagó** — en ningún texto nuevo de este flujo.

### Contenido inventado por Stitch que NO se implementó
Temporizador de "cupo reservado 15 minutos", "Bonificación 7%"/"Tarifa
lista"/"Sin recargo"/comprobante por WhatsApp/botón de pago instantáneo,
"lista de espera", "Sector central"/"Ubicación privilegiada"/"Sector
premium"/"Espacio seguro & lockers incluidos"/"Conexión cifrada SSL",
"Comprobante oficial válido" (en `/r/` dice "Tu reserva"), años fijos tipo
"Temporada 2025", filas/sectores inventados del plano de Stitch (se usa
siempre el componente real), y links de navegación que no existen en la
landing.

### Estructura de `src/features/reservas/`
`api.js` (RPCs + Edge Functions con mapeo de errores de negocio),
`mensajes.js`, `fechas.js`, `useConfigReservas.js`, `useDisponibilidad.js`
(RPC + Broadcast `disponibilidad`/`cambio`, debounce 500ms),
`useReservaFlow.js` (estado completo del flujo vía `useReducer`),
`useTurnstile.jsx`, `ReservaFlow.jsx`, `BarraProgreso.jsx`,
`EstadoPausadas.jsx`, `PlanoInteractivo.jsx`, `pasos/Paso2..6*.jsx`.

### Plano
`src/components/plano/` sigue siendo copia exacta de priusApp — no se edita
acá (ver `PORTABILIDAD.md`). La lógica de zoom/pan/touch y la asistencia
"tocá para acercar" en mobile viven en `src/features/reservas/
PlanoInteractivo.jsx`, fuera de esa carpeta, a propósito.

### Turnstile
Un solo widget invisible/managed montado por `ReservaFlow` (`useTurnstile`),
reseteado después de cada uso porque el token es de un solo uso. Hoy usa
`VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA` (clave de prueba pública
de Cloudflare) — **reemplazar por la clave real antes de activar
reservas online**.

### A prueba de fallas si faltan env vars (oct 2026)
`src/lib/supabase.js` **nunca** llama a `createClient()` sin las dos env
vars de Supabase — antes lo hacía siempre, y `createClient()` tira una
excepción sincrónica si falta la URL; como ese módulo se importa desde
`ContactSection.jsx` (que siempre se renderiza en la landing), una sola env
var faltante dejaba **toda la landing en blanco**, no solo el cotizador.
Ahora exporta `supabaseConfigurado` (boolean) y `supabase` (cliente real, o
`null` si falta algo). Lo mismo con `VITE_TURNSTILE_SITE_KEY`
(`turnstileConfigurado` en `useTurnstile.jsx`). `ReservaFlow.jsx` chequea
ambos flags antes de renderizar cualquier paso: si falta cualquiera de los
dos, muestra directamente el estado "Reservas Online Pausadas" — el resto
de la landing sigue funcionando normal. Verificado a mano simulando cada
variable faltante por separado (sin tocar el código, solo el `.env` local).

### Variables de entorno obligatorias en Cloudflare Pages (Production y Preview)
Las cuatro se necesitan en **ambos** entornos (Production y Preview) del
proyecto de Cloudflare Pages — la landing usa el mismo proyecto Supabase en
los dos:

| Variable | Requerida | Nota |
|---|---|---|
| `VITE_SUPABASE_URL` | Sí | `https://oslbsnwccchdxmbjhhcg.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Sí | anon key del mismo proyecto |
| `VITE_N8N_WEBHOOK_URL` | Sí (para que el form de contacto mande de verdad) | sin ella, `ContactSection.jsx` solo simula éxito en consola, no llega nada a n8n |
| `VITE_TURNSTILE_SITE_KEY` | Sí | hoy la clave de prueba `1x00000000000000000000AA`; reemplazar por la real antes de activar reservas |

Si falta `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` o
`VITE_TURNSTILE_SITE_KEY`, el flujo de reserva cae solo a "pausadas" (ver
arriba) — no rompe el resto del sitio. Si falta `VITE_N8N_WEBHOOK_URL`, el
form de contacto (las 4 opciones del Paso 1, incluido el flujo de consulta
de reservas) deja de enviar nada de verdad sin avisar visualmente al
usuario — confirmar que esté siempre cargada en los dos entornos.

### Flujo de consulta (temporada, grupo grande, sin disponibilidad, pausadas, límite por teléfono)
Reutiliza el Paso 2 de datos ya existente de `ContactSection.jsx` y el
mismo envío a n8n de siempre — mismo payload, sin campos nuevos. El
contexto (fechas, personas, motivo) va dentro del texto de `mensaje`.

### EMAIL_RESERVA_ACTIVO
`false` en `mensajes.js` — la línea "también te lo enviamos a tu email" en
el Paso 6 y en `/r/:codigo` queda oculta hasta la Fase 5 (entrega de QR por
email).

### Verificación obligatoria
Playwright, `channel: 'chrome'`, proyectos `mobile-360`, `mobile-390` y
`desktop-1440` (`playwright.config.js`, `pnpm run test:e2e`). Ningún paso
de este flujo se da por terminado sin pasar por ahí.

⚠️ **El puerto 5173 es también el default del dev server de priusApp.** Si el
CRM está levantado, `reuseExistingServer` hacía que toda la suite corriera
contra esa app y pasara o fallara por motivos inventados. El puerto ahora sale
de `E2E_PORT` (default 5173): con el CRM abierto, correr
`E2E_PORT=5180 pnpm run test:e2e`.

## Fase 5B — Login con Google en el form de reservas (implementado, rama `fase4b-reservas`)

### Qué cambia y qué no
Los pasos 1 a 3 (servicio, fechas y personas, plano) siguen **anónimos**: no
se pide login para mirar disponibilidad ni para elegir lugar. El login con
Google es obligatorio recién en el **Paso 4**, antes de confirmar y pagar.
El Paso 6 y `/r/:codigo` no cambiaron (consultar una reserva por código sigue
sin login); el resumen del Paso 5 ahora muestra el nombre del cliente
reconocido. El flujo de n8n y las otras tres opciones del cotizador no se
tocaron.

El contrato es de priusApp (Fase 5A): `mi_cuenta()`, `completar_cuenta(p)` y
`crear-reserva-publica` exigiendo sesión. Este repo nunca migra base, RLS ni
Edge Functions.

### Cliente de Supabase y persistencia durante el redirect
- `src/lib/supabase.js` crea el cliente con `persistSession: true`,
  `detectSessionInUrl: true` y **`flowType: 'pkce'`**. Los dos primeros ya eran
  el default de auth-js; `pkce` **no** lo es (el default es `'implicit'`).
- Antes de mandar al cliente a Google se guarda el flow entero en
  **`sessionStorage`**, clave versionada **`prius_reserva_v1`**
  (`src/features/reservas/persistenciaFlow.js`), todo con try/catch y con un
  TTL de 1 hora. Se guarda paso, fechas, personas, unidades elegida y
  sugerida, método, `leadId` y datos tipeados; **nunca** el `resultado` de una
  reserva ya creada.
- `redirectTo` es `window.location.origin + '/?reserva=continuar'` — anda
  igual en localhost, en la preview y en producción, sin hardcodear nada.
  `queryParams: { prompt: 'select_account' }`.
- Al volver con `?reserva=continuar`, `ContactSection` abre el cotizador en
  "Carpas & Sombrillas" con el estado restaurado, hace scroll a la tarjeta y
  limpia el parámetro de la URL con `replaceState`.
- La clave se borra al confirmar la reserva, al resetear el flow y al salir
  hacia el form de consulta.
- Si al restaurar la unidad guardada ya está ocupada, `ReservaFlow` vuelve a
  pedir `disponibilidad_publica`, la deselecciona y manda al Paso 3 con el
  mismo aviso que usa el Realtime.
- Si el login falla o el cliente cancela en Google, vuelve al mismo paso con
  "No pudimos iniciar sesión con Google. Probá de nuevo." y el form intacto.

### `useCuentaCliente` — única fuente de la cuenta del cliente web
`src/features/cuenta/useCuentaCliente.js` expone
`{ sesion, cargando, cuenta, refrescar, cerrarSesion }`. `cuenta` es el
resultado de `mi_cuenta()`, cacheado mientras dura la sesión (clave: el
`user_id`, así un `TOKEN_REFRESHED` no vuelve a pedirla) y refrescado al
iniciar sesión o al llamar a `refrescar()`. No tiene nada de reservas a
propósito: **se reutiliza tal cual en la futura sección de actividades, la
carta y los pedidos desde la carpa por QR de unidad.**

Detalles del contrato que importan:
- `mi_cuenta()` y `completar_cuenta(p)` están **revocadas para `anon`** (solo
  `authenticated`): llamarlas sin sesión no devuelve `login_requerido` sino un
  `42501` de Postgres. Nunca se llaman sin sesión.
- `mi_cuenta()` no es pura: en el primer llamado puede crear el vínculo por
  email. Por eso se llama una vez y se cachea.
- El parámetro de `completar_cuenta` se llama literalmente **`p`**.

### Estados de vínculo en el Paso 4
| `cuenta.vinculo` | Qué muestra |
|---|---|
| sin sesión | Botón "Continuar con Google" y los dos textos de uso de datos. **Ningún campo de datos a la vista.** |
| `confirmado` | Tarjeta "Hola, `<nombre>`" con nombre, apellido, teléfono formateado y email **en solo lectura**, la línea "Tu unidad esta temporada: Carpa 19" si hay `unidades_vigentes`, botón "Continuar" y link "¿Algún dato está mal? Escribinos" (WhatsApp). |
| `ninguno` | Form de nombre, apellido, teléfono y DNI (opcional), con nombre y apellido precargados del `nombre_google`. El email es el de Google, visible y no editable. Al continuar llama a `completar_cuenta()` y vuelve a pedir `mi_cuenta()`. |
| `pendiente` | "Encontramos un registro con esos datos. Lo confirmamos en recepción cuando llegues; tu reserva queda igual a tu nombre." y continúa normal, sin mostrar ningún dato del cliente existente. |

**La web nunca edita los datos de un cliente existente** (regla D5 de
priusApp): en `confirmado` no hay un solo input habilitado. Con sesión,
siempre visible "Conectado como `<email>` · Cambiar cuenta" (cierra sesión y
vuelve a Google con `select_account`, manteniendo el flow guardado).

El lead `form_abandonado` ahora se dispara **al tener sesión**, no en el blur
del teléfono, con el email verificado de la cuenta y el token del usuario
(`lead-reserva` acepta token opcional y, si viene, pisa el email y marca
`datos_form.cuenta_google`). Mismas reglas de actualización por `lead_id`.

### Paso 5 y sesión vencida
`crear-reserva-publica` **exige sesión**. `supabase.functions.invoke` ya manda
el `Authorization: Bearer <access_token>` solo: `fetchWithAuth` usa
`getSession().access_token` y cae en la anon key si no hay sesión (verificado
en `@supabase/supabase-js` 2.99.3) — no hace falta `setAuth` manual.
- Si responde **401 `login_requerido`**, el flujo vuelve al Paso 4 con
  "Tu sesión venció, iniciá sesión de nuevo" **sin perder el resto del flow**.
- Error nuevo mapeado: **`limite_por_cuenta`** (el límite de reservas activas
  ahora se cuenta también por cuenta, no solo por teléfono), más
  `cuenta_personal` y `sin_email`.
- El **email ya no se manda** en el payload: lo toma el servidor del JWT.
  Nombre, apellido y teléfono **sí se siguen mandando** incluso para un
  cliente reconocido — el schema zod de la Edge Function los exige con
  `min(1)` — pero salen de `cuenta.cliente`, no del form, y la RPC los ignora:
  usa el cliente del vínculo.

### Archivos de la fase
`src/features/cuenta/` (`useCuentaCliente.js`, `auth.js`, `BotonGoogle.jsx`),
`src/features/reservas/persistenciaFlow.js`, y los cambios en
`src/lib/supabase.js`, `useReservaFlow.js`, `ReservaFlow.jsx`,
`ContactSection.jsx`, `pasos/Paso3Plano.jsx`, `pasos/Paso4Datos.jsx`,
`pasos/Paso5Confirmar.jsx`, `mensajes.js` y `telefono.js`.
Todos los textos nuevos viven en `mensajes.js`; siguen valiendo las palabras
prohibidas y el mensaje de "sujeta a disponibilidad" tal como estaban hasta
que entre el pago online.

### Branding del botón de Google
Es el **único botón del cotizador que no es dorado**: las brand guidelines de
Google exigen el logo "G" a cuatro colores sin recolorear sobre fondo blanco o
azul. Forma y tipografía sí son las de producción (píldora `9999px`, Exo 700,
uppercase, 12px). El dorado `#F2CA50` queda para el CTA primario que sigue.
El SVG del logo está embebido en `BotonGoogle.jsx`, sin CDN.

### Verificación de esta fase
`e2e/cuenta-google.spec.js`: los cuatro estados del Paso 4 con sesión y
`mi_cuenta()` simulados (se siembra el storage de auth-js y se interceptan las
llamadas — **nunca** se hace un login real de Google en un test), y el flow
sobreviviendo a una recarga completa con `?reserva=continuar`. 33 tests en
verde en los tres proyectos, no-regresión incluida.
`e2e/reserva-flow-mock.spec.js` ahora termina en el Paso 4: el recorrido
anónimo no puede pasar de ahí.

### Pendiente de esta fase
- Prueba real con una cuenta de Google sobre la preview (ver más abajo).
- Al terminarla, limpiar desde priusApp los datos `E2E TEST` y los usuarios de
  prueba de Auth.

### Pendiente antes de activar (`config_reservas_publicas.activo = true`)
- Confirmar con priusApp los campos exactos de los payloads de
  `crear-reserva-publica`, `lead-reserva` y la forma de la respuesta de
  `consultar-reserva` — se implementaron con nombres de campo razonables
  (`turnstileToken`, `leadId`, `desde`/`hasta`/`tipoAlquiler`/`unidades`,
  etc.) pero sin el contrato exacto documentado, porque las Edge Functions
  son del lado de priusApp.
- Reemplazar `VITE_TURNSTILE_SITE_KEY` por la clave real.
- Prueba real end-to-end (reservas E2E TEST, lugar tomado con dos pestañas,
  checkbox sin tildar, consulta a n8n) — recién cuando priusApp confirme
  `activo = true` con tarifas E2E cargadas.
- Sumar la URL de preview de `fase4b-reservas` a `ALLOWED_ORIGINS` desde
  priusApp (CORS de las Edge Functions) — no se puede hacer desde este
  repo.
- ✅ **Google ya está habilitado** (18/11/2026): `/auth/v1/settings` devuelve
  `"google": true`, `/authorize?provider=google` redirige a
  `accounts.google.com` con scope `email profile` y `response_type=code`, y el
  signup público por email quedó cerrado (`disable_signup: true`).