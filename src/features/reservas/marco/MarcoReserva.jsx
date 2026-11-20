import { useState } from 'react'
import { X } from 'lucide-react'
import { ContextoPieMarco } from './contextoMarco'

// Marco fijo del flujo de reserva (Fase 6B).
//
// PROVISORIO hasta la 6A.1 de priusApp: MarcoPlanoClaro (src/components/plano,
// copia exacta, no se edita acá) todavía no tiene lugar para la barra del
// paso, el footer ni un cuerpo que no sea el mapa. Este componente dibuja el
// mismo header (mismas clases que MarcoPlanoClaro en f1a031a) y expone las
// props que va a tener el de la 6A.1, así el reemplazo es cambiar este import
// por MarcoPlanoClaro y borrar el archivo.
//
// amplia (≥768px): [logo] [selectorFecha] [Todo | Carpas | Sombrillas] ... [X]
// compacta (<768px): fila [selectorFecha] [chips] con scroll horizontal; la X
// va en la barra del paso.
//
// ── PEDIDO A priusApp: MarcoPlanoClaro 6A.1 ────────────────────────────────
// Todas opcionales: sin ellas el marco se ve y se comporta igual que en
// f1a031a (el modal del CRM no cambia; repetir sus capturas píxel a píxel).
//
//  1. `barra` (node): fila entre el header y el cuerpo, en las dos
//     variantes, shrink-0. La landing pone "Paso X de 6 · nombre" con el
//     progreso dorado y, en compacta, la X.
//  2. `pie` (node): fila debajo del cuerpo, en las dos variantes, shrink-0.
//     La landing pone ahí un <div ref> de 64px donde cada paso dibuja
//     Volver / Siguiente (o Confirmar) por portal.
//  3. `contenido` (node): si viene, reemplaza TODO lo de adentro de la card
//     del cuerpo (rótulo "Pasillo A · B · C", mapa y controles de zoom) por
//     `contenido`, en una card del mismo tamaño y posición:
//     `CARD flex-1 min-h-0 min-w-0 relative overflow-hidden flex flex-col`,
//     sin padding (el contenido maneja su scroll interno). Con `contenido` no
//     hacen falta `encuadre` ni `children`, y `cargando` se ignora. Es para
//     los pasos 2, 4, 5 y 6 (fechas, datos, confirmar, QR): el marco no
//     cambia de tamaño entre pasos.
//  4. `onRefrescar` (fn) + `refrescando` (bool): botón "Actualizar
//     disponibilidad" (lucide RefreshCw, gira mientras `refrescando`, y queda
//     disabled) al final de los controles, con el mismo dibujo que los demás:
//     en BarraZoomPlano (amplia) y en PillZoomPlano (compacta, antes del
//     botón de cerrar). Sin `onRefrescar`, no aparece. (Alternativa válida:
//     `extraBotones` reenviado a BarraZoomPlano.extraButtons y una prop
//     `extraButtons` nueva en PillZoomPlano; prefiero el botón propio para
//     que el dibujo quede igual en las dos variantes.)
//  5. `mapaRef` (ref): en compacta, el ref de ZoomPanPinch hacia afuera (hoy
//     `mapaCompacto` es interno), para "el primer toque acerca" en mobile,
//     que la landing hace en su wrapper. Al API imperativo de ZoomPanPinch le
//     falta:
//       - `acercarEn(clientX, clientY, escala?)`: zoom animado centrado en un
//         punto de pantalla (el centro de la casilla tocada). Sin `escala`,
//         la mínima en la que la casilla `tactil` queda de ≥44×36px reales.
//       - `estado()` ya existe ({ s, fit, max, ... }): alcanza para decidir
//         si la casilla está chica.
//     En amplia no hace falta: el zoom ya es externo (`encuadre`).
//  6. `aviso` (node): se dibuja `absolute` arriba y centrado DENTRO de la card
//     del cuerpo (z-20), por encima del mapa y sin moverlo ni re-encuadrarlo
//     (ej. "Lo que elegiste no está libre en las fechas nuevas").
//  7. `leyenda` (node): en la fila del rótulo "Pasillo A · B · C", del lado
//     derecho (hoy es un `<div className="flex items-center gap-3 shrink-0" />`
//     vacío en amplia; en compacta, la misma fila). La landing pone Libre /
//     Ocupada / Tu elección / Sugerida.
//  8. `chipsDeshabilitados` (bool): los chips Todo / Carpas / Sombrillas se
//     ven atenuados (opacity-50) y no responden. El header no cambia de
//     tamaño entre pasos; fuera del plano los chips no aplican.
//  9. `cargando`: sin cambios, pero documentar que reemplaza el mapa por
//     "Cargando plano…" (desmonta el viewport y pierde el zoom). La landing lo
//     va a pasar solo en la carga inicial; los refrescos en vivo (Broadcast,
//     foco, cada 60 s, botón) no lo tocan.
// 10. `data-*` estables para tests (opcional): `data-marco-plano`,
//     `data-cuerpo-marco` en la card del cuerpo, `data-pie-marco` en el pie.
//
// Lo que NO hace falta cambiar: `selectorFecha` ya es un slot (la landing
// pasa fechas + personas juntas); la X de compacta la pone la landing en
// `barra` y no pasa `onCerrar` en compacta, así la pill no muestra Shrink.
const CARD = 'bg-white rounded-[24px]'

// Mismo dibujo que ChipsTipo de MarcoPlanoClaro (no se exporta de ahí).
function ChipsTipo({ valor, onChange, deshabilitados = false }) {
  const opciones = [
    { value: null, label: 'Todo' },
    { value: 'carpas', label: 'Carpas' },
    { value: 'sombrillas', label: 'Sombrillas' },
  ]
  return (
    <div
      role="group"
      aria-label="Filtrar el plano por tipo de unidad"
      className={`inline-flex items-center gap-1 p-1 rounded-full bg-[#F2F1EC] shrink-0 ${deshabilitados ? 'opacity-50' : ''}`}
    >
      {opciones.map((o) => {
        const activa = (valor ?? null) === o.value
        return (
          <button
            key={String(o.value)}
            type="button"
            aria-pressed={activa}
            disabled={deshabilitados}
            onClick={() => onChange?.(o.value)}
            className={`h-11 md:h-8 min-h-0 px-4 rounded-full text-[13px] leading-[18px] font-medium transition-colors disabled:cursor-default ${
              activa ? 'bg-black text-white' : 'text-[#6B6B6B] hover:text-black disabled:hover:text-[#6B6B6B]'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

export default function MarcoReserva({
  variante = 'amplia',
  logo = null,
  selectorFecha = null,
  tipo = null,
  onTipo,
  chipsDeshabilitados = false,
  onCerrar,
  tituloCerrar = 'Cerrar',
  barra = null,
  aviso = null,
  children,
}) {
  const [nodoPie, setNodoPie] = useState(null)
  const chips = <ChipsTipo valor={tipo} onChange={onTipo} deshabilitados={chipsDeshabilitados} />

  const header =
    variante === 'compacta' ? (
      <div className="shrink-0 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {selectorFecha}
        {chips}
      </div>
    ) : (
      <div className={`${CARD} p-3 shrink-0`}>
        <div className="flex items-center gap-4">
          {logo}
          {selectorFecha}
          {chips}
          {onCerrar && (
            <button
              type="button"
              onClick={onCerrar}
              title={tituloCerrar}
              aria-label={tituloCerrar}
              className="ml-auto w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-black hover:bg-[#F2F1EC] transition-colors"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    )

  return (
    <div data-marco-reserva className={`flex-1 min-h-0 flex flex-col ${variante === 'compacta' ? 'gap-2' : 'gap-2.5'}`}>
      {header}
      {barra}
      <section data-cuerpo-marco className={`${CARD} flex-1 min-h-0 min-w-0 relative overflow-hidden flex flex-col border border-[#EDEDED]`}>
        {aviso}
        <ContextoPieMarco.Provider value={nodoPie}>{children}</ContextoPieMarco.Provider>
      </section>
      <div
        ref={setNodoPie}
        data-pie-marco
        className="shrink-0 h-16 flex items-center border-t border-[#EDEDED] px-1"
      />
    </div>
  )
}
