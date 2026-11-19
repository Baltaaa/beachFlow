import { useCallback, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { es } from 'react-day-picker/locale'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import 'react-day-picker/style.css'
import '../rdp-reservas.css'
import { isoADate, resumenFechas, sumarDiasISO } from '../fechas'
import { fechasDeRango, useRestriccionesFechas, validarFechas } from '../reglasFechas'
import Desplegable from './Desplegable'

const FORMATO_SEMANA = new Intl.DateTimeFormat('es-AR', { weekday: 'short', timeZone: 'UTC' })
const FORMATO_DIA_MES = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' })

function etiqueta({ desde, hasta }) {
  if (!desde) return 'Elegí fechas'
  if (!hasta || hasta === desde) {
    const dia = FORMATO_SEMANA.format(isoADate(desde)).replace('.', '')
    return `${dia.charAt(0).toUpperCase()}${dia.slice(1)} ${FORMATO_DIA_MES.format(isoADate(desde))}`
  }
  return `${FORMATO_DIA_MES.format(isoADate(desde))} al ${FORMATO_DIA_MES.format(isoADate(hasta))}`
}

// Selector de fechas del header del marco (slot `selectorFecha` de
// MarcoPlanoClaro). Mismo dibujo que pide PORTABILIDAD.md: pill de 40px con
// fondo negro al 6% y ‹ fecha › con botones de 32px. Las flechas mueven un día
// y solo aparecen con alquiler por día; tocar la fecha abre el calendario para
// elegir un día o un período. Valida igual que el Paso 2 (reglasFechas.js)
// antes de avisar el cambio: `onCambiar` solo recibe fechas válidas.
// `onError(texto)`: el error de las flechas, que no tienen dónde mostrarlo.
export default function SelectorFechas({ fechas, config, bloqueado = false, amplia, onCambiar, onError }) {
  const { isoDeshabilitado, disabledMatcher, hoyISO } = useRestriccionesFechas(config)
  const [abierto, setAbierto] = useState(false)
  const [rango, setRango] = useState(undefined)
  const [error, setError] = useState('')
  const [validando, setValidando] = useState(false)
  const anclaRef = useRef(null)

  const cerrar = useCallback(() => setAbierto(false), [])

  function abrir() {
    if (bloqueado) return
    setRango(fechas.desde ? { from: isoADate(fechas.desde), to: isoADate(fechas.hasta ?? fechas.desde) } : undefined)
    setError('')
    setAbierto((v) => !v)
  }

  async function aplicar(nuevas) {
    setValidando(true)
    try {
      const textoError = await validarFechas(config, nuevas)
      if (textoError) return textoError
      onCambiar(nuevas)
      return null
    } catch {
      return 'No pudimos consultar esas fechas. Probá de nuevo.'
    } finally {
      setValidando(false)
    }
  }

  async function aplicarRango() {
    const nuevas = fechasDeRango(rango)
    if (!nuevas) return
    if (nuevas.desde === fechas.desde && nuevas.hasta === fechas.hasta) {
      cerrar()
      return
    }
    const textoError = await aplicar(nuevas)
    if (textoError) setError(textoError)
    else cerrar()
  }

  async function moverDia(delta) {
    const dia = sumarDiasISO(fechas.desde, delta)
    if (isoDeshabilitado(dia)) return
    const textoError = await aplicar({ desde: dia, hasta: dia, tipoAlquiler: 'dia' })
    if (textoError) onError?.(textoError)
  }

  const porDia = !!fechas.desde && fechas.tipoAlquiler === 'dia' && !bloqueado
  const anteriorDeshabilitado = !porDia || validando || isoDeshabilitado(sumarDiasISO(fechas.desde, -1))
  const siguienteDeshabilitado = !porDia || validando || isoDeshabilitado(sumarDiasISO(fechas.desde, 1))
  const flecha = 'w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-black hover:bg-black/[0.06] disabled:opacity-30 disabled:hover:bg-transparent transition-colors'
  const nuevas = fechasDeRango(rango)

  return (
    <div ref={anclaRef} className="relative shrink-0">
      <div
        data-selector-fechas
        className={`h-10 rounded-full bg-black/[0.06] flex items-center gap-0.5 ${porDia ? 'px-1' : 'px-1.5'} ${bloqueado ? 'opacity-60' : ''}`}
      >
        {porDia && (
          <button type="button" onClick={() => moverDia(-1)} disabled={anteriorDeshabilitado} className={flecha} aria-label="Día anterior" title="Día anterior">
            <ChevronLeft size={16} />
          </button>
        )}
        <button
          type="button"
          onClick={abrir}
          disabled={bloqueado}
          aria-haspopup="dialog"
          aria-expanded={abierto}
          aria-label={fechas.desde ? `Fechas: ${resumenFechas(fechas.desde, fechas.hasta)}. Cambiar` : 'Elegí fechas'}
          className="h-8 px-2.5 rounded-full flex items-center gap-1.5 text-[13px] leading-[18px] font-semibold text-black whitespace-nowrap hover:bg-black/[0.06] disabled:hover:bg-transparent disabled:cursor-default transition-colors"
        >
          <CalendarDays size={15} className="shrink-0" />
          {etiqueta(fechas)}
        </button>
        {porDia && (
          <button type="button" onClick={() => moverDia(1)} disabled={siguienteDeshabilitado} className={flecha} aria-label="Día siguiente" title="Día siguiente">
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      <Desplegable abierto={abierto} onCerrar={cerrar} amplia={amplia} anclaRef={anclaRef} titulo="Elegí las fechas">
        <p className="text-[13px] leading-[18px] font-semibold text-black mb-1">Elegí un día o un período</p>
        <div className="rdp-reservas flex justify-center">
          <DayPicker
            mode="range"
            locale={es}
            weekStartsOn={1}
            selected={rango}
            defaultMonth={isoADate(fechas.desde) ?? isoADate(hoyISO)}
            disabled={disabledMatcher}
            onSelect={(r) => {
              setError('')
              setRango(r)
            }}
          />
        </div>
        <p className="min-h-[18px] text-center text-[13px] leading-[18px] font-semibold text-black">
          {nuevas ? resumenFechas(nuevas.desde, nuevas.hasta) : ''}
        </p>
        {error && <p className="mt-1 text-xs text-red-500 text-center max-w-[300px] mx-auto">{error}</p>}
        <div className="mt-3 flex items-center justify-end gap-2">
          <button type="button" onClick={cerrar} className="h-10 px-4 rounded-full text-[13px] font-semibold text-[#6B6B6B] hover:text-black transition-colors">
            Cancelar
          </button>
          <button
            type="button"
            onClick={aplicarRango}
            disabled={!nuevas || validando}
            className="h-10 px-5 rounded-full bg-black text-white text-[13px] font-semibold disabled:opacity-40 transition-opacity"
          >
            {validando ? 'Consultando…' : 'Aplicar'}
          </button>
        </div>
      </Desplegable>
    </div>
  )
}
