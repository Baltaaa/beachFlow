import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { es } from 'react-day-picker/locale'
import { Minus, Plus } from 'lucide-react'
import 'react-day-picker/style.css'
import '../rdp-reservas.css'
import { isoADate, resumenFechas } from '../fechas'
import { errorTipoAlquiler, fechasDeRango, useRestriccionesFechas, validarFechas } from '../reglasFechas'
import { LINK_CONSULTA_TEMPORADA, MENSAJE_SIN_TARIFA } from '../mensajes'
import PiePaso, { BotonSiguiente } from '../marco/PiePaso'

// "Fechas y personas": solo la primera vez (Fase 6B). Después las fechas y
// las personas se cambian desde el header del marco sin salir del plano. Las
// reglas de qué fechas valen son las mismas (reglasFechas.js).
export default function Paso2FechasPersonas({ config, state, actions, onIrAConsulta }) {
  const [rango, setRango] = useState(
    state.fechas.desde
      ? { from: isoADate(state.fechas.desde), to: isoADate(state.fechas.hasta ?? state.fechas.desde) }
      : undefined,
  )
  const [errorTipo, setErrorTipo] = useState('')
  const [sinTarifa, setSinTarifa] = useState(false)
  const [errorConsulta, setErrorConsulta] = useState('')
  const [cargando, setCargando] = useState(false)
  const { hoyISO, disabledMatcher } = useRestriccionesFechas(config)

  function handleSelect(nuevoRango) {
    setErrorTipo('')
    setSinTarifa(false)
    setErrorConsulta('')
    setRango(nuevoRango)
    const fechas = fechasDeRango(nuevoRango)
    if (!fechas) {
      actions.setFechas({ desde: null, hasta: null, tipoAlquiler: null })
      return
    }
    const error = errorTipoAlquiler(config, fechas.tipoAlquiler)
    if (error) {
      setErrorTipo(error)
      return
    }
    actions.setFechas(fechas)
  }

  async function handleSiguiente() {
    if (!state.fechas.desde) return
    setCargando(true)
    setSinTarifa(false)
    setErrorConsulta('')
    try {
      const error = await validarFechas(config, state.fechas)
      if (error === MENSAJE_SIN_TARIFA) {
        setSinTarifa(true)
        return
      }
      if (error) {
        setErrorTipo(error)
        return
      }
      actions.siguiente()
    } catch {
      setErrorConsulta('No pudimos consultar esas fechas. Probá de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  const personas = state.personas

  return (
    <div className="space-y-5">
      <div className="text-center md:text-left">
        <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-prius-black font-display mb-0.5">
          ¿Cuándo venís?
        </h3>
        <p className="text-prius-black/50 text-xs font-light">
          Elegí un día, o un rango para armar un período.
        </p>
      </div>

      <div className="rdp-reservas flex justify-center">
        <DayPicker
          mode="range"
          locale={es}
          weekStartsOn={1}
          selected={rango}
          defaultMonth={isoADate(state.fechas.desde) ?? isoADate(hoyISO)}
          disabled={disabledMatcher}
          onSelect={handleSelect}
        />
      </div>

      {state.fechas.desde && (
        <p className="text-center text-xs font-bold text-prius-black font-display">
          {resumenFechas(state.fechas.desde, state.fechas.hasta)}
        </p>
      )}
      {(errorTipo || errorConsulta) && (
        <p className="text-xs text-red-500 text-center font-light">{errorTipo || errorConsulta}</p>
      )}

      <div className="flex items-center justify-center gap-6 pt-2">
        <span className="text-[9px] font-bold uppercase tracking-widest text-prius-black/50 font-display">
          Personas
        </span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => actions.setPersonas(personas - 1)}
            disabled={personas <= 1}
            className="w-9 h-9 rounded-full border border-hairline flex items-center justify-center text-prius-black disabled:opacity-30 hover:border-gold transition-colors cursor-pointer"
          >
            <Minus size={14} />
          </button>
          <span className="text-lg font-bold text-prius-black font-display w-6 text-center">
            {personas}
          </span>
          <button
            type="button"
            onClick={() => actions.setPersonas(personas + 1)}
            className="w-9 h-9 rounded-full border border-hairline flex items-center justify-center text-prius-black hover:border-gold transition-colors cursor-pointer"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {sinTarifa && (
        <div className="bg-neutral-50 border border-hairline rounded-xl p-4 text-center space-y-2">
          <p className="text-xs text-prius-black/70 font-light">{MENSAJE_SIN_TARIFA}</p>
          <button
            type="button"
            onClick={() => onIrAConsulta('sin_disponibilidad')}
            className="text-xs font-bold uppercase tracking-widest text-prius-black hover:text-gold transition-colors font-display cursor-pointer"
          >
            Dejar mi consulta →
          </button>
        </div>
      )}

      <div className="text-center">
        <button
          type="button"
          onClick={() => onIrAConsulta('temporada')}
          className="text-[11px] font-bold uppercase tracking-widest text-prius-black/50 hover:text-gold transition-colors font-display cursor-pointer"
        >
          {LINK_CONSULTA_TEMPORADA}
        </button>
      </div>

      <PiePaso
        derecha={
          <BotonSiguiente onClick={handleSiguiente} disabled={!state.fechas.desde || !!errorTipo || cargando}>
            {cargando ? 'Consultando…' : 'Siguiente'}
          </BotonSiguiente>
        }
      />
    </div>
  )
}
