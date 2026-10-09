# Stitch — Prius Playa Grande Booking Flow

Proyecto Stitch `projects/13025235678949300823`, bajado el 2026-10-09 vía MCP
(`stitch.googleapis.com`). Referencia visual únicamente — el `screen.html` de
cada carpeta no se pega tal cual al repo, se usa como guía de estructura
(ver regla de branding en CLAUDE.md: lo de producción manda).

Cada carpeta tiene `screen.html` (código generado por Stitch) y
`screenshot.png` (thumbnail, ~512px en el lado mayor — es el tamaño que
entrega el MCP, no la resolución real del diseño).

## Pantallas generadas

| Carpeta | Pantalla | Device |
|---|---|---|
| `02-fechas-personas-mobile/` | Paso 2: Fechas y Personas | Mobile (780×1992) |
| `02-fechas-personas-desktop/` | Paso 2: Fechas y Personas | Desktop (2560×2356) |
| `03-plano-mobile/` | Paso 3: Elegí tu lugar — Plano de Carpas | Mobile (780×1768) |
| `03-plano-desktop/` | Paso 3: Elegí tu lugar — Plano de Carpas | Desktop (2560×3032) |
| `04-datos-desktop/` | Paso 4: Tus Datos | Desktop (2560×2280) |
| `05-confirmar-mobile/` | Paso 5: Confirmá tu Reserva | Mobile (780×2040) |
| `05-confirmar-desktop/` | Paso 5: Confirmá tu Reserva | Desktop (2560×2048) |
| `r-pagina-publica-mobile/` | Página Pública de Reserva y Voucher QR (`/r/:codigo`) | Mobile (780×3082) |
| `ref-image-01-componentes/` | Imagen de referencia suelta (sin HTML), componentes/chips | — |
| `ref-image-02-componentes/` | Imagen de referencia suelta (sin HTML), componentes/chips | — |

## Faltantes contra el flujo pedido (ver auditoría completa en el reporte de Tarea 1)

- **Paso 4 (Tus Datos): sin versión Mobile.** Solo hay Desktop.
- **Página pública `/r/:codigo`: sin versión Desktop.** Solo hay Mobile.
- **Paso 6 (Reserva preconfirmada — código + QR, distinto de `/r/`): no existe ninguna pantalla.**
- **Ningún estado de excepción tiene pantalla propia**: cargando/skeleton, "reservas online pausadas", "grupo grande", "sin lugar" (sin disponibilidad), "lugar tomado" (realtime), "vencida" (en `/r/`).
- Paso 1 (selección de servicio) no se generó — correcto, es el Paso 1 existente de `ContactSection.jsx`, no es pantalla nueva.

## Design system de Stitch vs. producción

Resumen de diferencias — detalle completo en el reporte de Tarea 1. En síntesis: Stitch generó un design system propio (fondo claro `#F9F9FF`, tipografías Space Grotesk + Inter, dorado como `primary-container` en vez de `primary`) que **no coincide** con el de producción (negro/carbón, Exo + Instrument Sans, dorado `#F2CA50` como único acento). Por la regla de branding, se toma de Stitch solo la estructura/disposición; todo color, fuente y radio se reemplaza por el de producción, excepto el panel del plano (Glass Dark, que es intencionalmente una copia del CRM y coincide con el "Level 3" que describe el `designMd` de Stitch).
