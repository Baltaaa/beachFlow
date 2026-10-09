import { useMemo, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { es } from 'react-day-picker/locale'
import { Minus, Plus, ChevronRight } from 'lucide-react'
import 'react-day-picker/style.css'
import '../rdp-reservas.css'
import { cotizar } from '../api'
import {
  hoyArgentinaISO,
  horaArgentinaActual,
  sumarDiasISO,
  isoADate,
  dateAIso,
  resumenFechas,
} from '../fechas'
import { LINK_CONSULTA_TEMPORADA, MENSAJE_SIN_TARIFA } from '../mensajes'

export default function Paso2FechasPersonas({ config, state, actions, onIrAConsulta }) {
  const [rango, setRango] = useState(
    state.fechas.desde
      ? { from: isoADate(state.fechas.desde), to: isoADate(state.fechas.hasta ?? state.fechas.desde) }
      : undefined,
  )
  const [errorTipo, setErrorTipo] = useState('')
  const [sinTarifa, setSinTarifa] = useState(false)
  const [cargando, setCargando] = useState(false)

  const hoyISO = hoyArgentinaISO()
  const horaActual = horaArgentinaActual()
  const corteHoyPasado = config && horaActual >= config.hora_corte_noshow.slice(0, 5)
  const maxFechaISO = config ? sumarDiasISO(hoyISO, config.dias_anticipacion_max) : null

  const disabledMatcher = useMemo(() => {
    return (date) => {
      const iso = dateAIso(date)
      if (iso < hoyISO) return true
      if (iso === hoyISO && corteHoyPasado) return true
      if (maxFechaISO && iso > maxFechaISO) return true
      return false
    }
  }, [hoyISO, corteHoyPasado, maxFechaISO])

  function handleSelect(nuevoRango) {
    setErrorTipo('')
    setSinTarifa(false)
    setRango(nuevoRango)
    if (!nuevoRango?.from) {
      actions.setFechas({ desde: null, hasta: null, tipoAlquiler: null })
      return
    }
    const desde = dateAIso(nuevoRango.from)
    const hasta = dateAIso(nuevoRango.to ?? nuevoRango.from)
    const tipo = desde === hasta ? 'dia' : 'periodo'

    if (!config?.tipos_alquiler_web?.includes(tipo)) {
      setErrorTipo(
        tipo === 'periodo'
          ? 'El alquiler por período no está disponible por ahora. Elegí un solo día.'
          : 'El alquiler por día no está disponible por ahora.',
      )
      return
    }
    actions.setFechas({ desde, hasta, tipoAlquiler: tipo })
  }

  async function handleSiguiente() {
    if (!state.fechas.desde) return
    setCargando(true)
    setSinTarifa(false)
    try {
      const { desde, hasta, tipoAlquiler } = state.fechas
      const [precioCarpa, precioSombrilla] = await Promise.all([
        cotizar('carpa', tipoAlquiler, 'efectivo', desde, hasta),
        cotizar('sombrilla', tipoAlquiler, 'efectivo', desde, hasta),
      ])
      if (precioCarpa == null && precioSombrilla == null) {
        setSinTarifa(true)
        return
      }
      actions.siguiente()
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
      {errorTipo && (
        <p className="text-xs text-red-500 text-center font-light">{errorTipo}</p>
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

      <div className="flex justify-end pt-4 border-t border-hairline mt-6">
        <button
          type="button"
          onClick={handleSiguiente}
          disabled={!state.fechas.desde || !!errorTipo || cargando}
          className="inline-flex h-9 md:h-10 items-center justify-center rounded-full bg-gold px-6 text-xs font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-display cursor-pointer gap-1.5 shadow-md"
        >
          {cargando ? 'Consultando…' : 'Siguiente'} <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
