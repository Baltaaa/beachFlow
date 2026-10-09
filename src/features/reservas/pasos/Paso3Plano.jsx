import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useDisponibilidad } from '../useDisponibilidad'
import { buscarUnidadVecina } from '../api'
import PlanoInteractivo from '../PlanoInteractivo'
import PlanoGrid from '../../../components/plano/PlanoGrid'
import CeldaPublica from '../../../components/plano/CeldaPublica'
import { LEYENDA_PLANO, MENSAJE_SIN_LUGAR, MENSAJE_SIN_VECINA, MENSAJE_UNIDAD_TOMADA } from '../mensajes'
import { resumenFechas } from '../fechas'

const TIPO_LABEL = { carpa: 'Carpa', sombrilla: 'Sombrilla' }

export default function Paso3Plano({ config, state, actions, onIrAConsulta }) {
  const { desde, hasta } = state.fechas
  const { unidades, cargando } = useDisponibilidad(desde, hasta)
  const [aviso, setAviso] = useState(null)
  const prevUnidadesRef = useRef(unidades)

  const { principal, sugerida } = state.unidades

  // Realtime: si la unidad elegida pasó a bloqueada, se deselecciona.
  useEffect(() => {
    if (!principal) {
      prevUnidadesRef.current = unidades
      return
    }
    const actualizada = unidades.find((u) => u.unidad_id === principal.unidad_id)
    const sugeridaActualizada = sugerida && unidades.find((u) => u.unidad_id === sugerida.unidad_id)
    if (actualizada?.bloqueada || (sugerida && !sugeridaActualizada)) {
      actions.quitarUnidades()
      setAviso(MENSAJE_UNIDAD_TOMADA)
    } else if (sugerida && sugeridaActualizada?.bloqueada) {
      actions.setUnidadSugerida(null)
      setAviso(MENSAJE_UNIDAD_TOMADA)
    }
    prevUnidadesRef.current = unidades
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unidades])

  const handleUnitClick = useCallback(
    async (slot) => {
      if (!slot?.unidad_id || slot.bloqueada) return
      setAviso(null)

      if (principal?.unidad_id === slot.unidad_id) {
        actions.quitarUnidades()
        return
      }
      if (sugerida?.unidad_id === slot.unidad_id) {
        actions.setUnidadSugerida(null)
        return
      }
      if (principal && slot.tipo === principal.tipo) {
        actions.setUnidadSugerida(slot)
        return
      }

      // Nueva selección principal (primera vez, o cambio de tipo: reinicia).
      actions.setUnidadPrincipal(slot)
      const necesarias = Math.ceil(state.personas / (slot.capacidad || 1))
      if (necesarias > config.max_unidades_por_reserva) {
        onIrAConsulta('grupo_grande')
        return
      }
      if (necesarias === 2) {
        const vecinas = await buscarUnidadVecina(slot.unidad_id, desde, hasta)
        const encontrada = vecinas[0]
          ? unidades.find((u) => u.unidad_id === vecinas[0].unidad_id)
          : null
        if (encontrada) {
          actions.setUnidadSugerida(encontrada)
        } else {
          setAviso(MENSAJE_SIN_VECINA)
        }
      }
    },
    [principal, sugerida, state.personas, config, desde, hasta, unidades, actions, onIrAConsulta],
  )

  const renderCelda = useCallback(
    (slot) => {
      const estado = !slot.unidad_id || slot.bloqueada
        ? 'bloqueada'
        : slot.unidad_id === principal?.unidad_id
          ? 'seleccionada'
          : slot.unidad_id === sugerida?.unidad_id
            ? 'sugerida'
            : 'libre'
      return (
        <CeldaPublica
          key={`${slot.tipo}-${slot.numero}`}
          numero={slot.numero}
          estado={estado}
          numberSide={slot.numberSide}
          onClick={() => handleUnitClick(slot)}
        />
      )
    },
    [principal, sugerida, handleUnitClick],
  )

  const resumenSeleccion = useMemo(() => {
    const partes = [principal, sugerida].filter(Boolean).map((u) => `${TIPO_LABEL[u.tipo] || u.tipo} ${u.numero}`)
    return partes.join(' + ')
  }, [principal, sugerida])

  const todoBloqueado = !cargando && unidades.length > 0 && unidades.every((u) => u.bloqueada)

  const necesarias = principal ? Math.ceil(state.personas / (principal.capacidad || 1)) : 0
  const seleccionCompleta = !!principal && (necesarias <= 1 || !!sugerida)

  return (
    <div className="flex flex-col gap-3 h-[520px] max-h-[70vh]">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-xs font-bold text-prius-black font-display">
            {resumenFechas(desde, hasta)} · {state.personas} persona{state.personas === 1 ? '' : 's'}
          </p>
          <button
            type="button"
            onClick={() => actions.irAPaso(2)}
            className="text-[10px] font-bold uppercase tracking-widest text-prius-black/50 hover:text-gold transition-colors font-display cursor-pointer"
          >
            Cambiar
          </button>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {LEYENDA_PLANO.map((item) => (
            <span key={item.estado} className="flex items-center gap-1 text-[9px] text-prius-black/50 font-display">
              <span
                className={`w-2.5 h-2.5 rounded-sm border ${
                  item.estado === 'bloqueada'
                    ? 'bg-neutral-300 border-neutral-400'
                    : item.estado === 'seleccionada'
                      ? 'bg-gold border-gold'
                      : item.estado === 'sugerida'
                        ? 'bg-gold/30 border-gold/50'
                        : 'bg-white border-neutral-300'
                }`}
              />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {aviso && (
        <div className="bg-neutral-50 border border-hairline rounded-xl px-4 py-2 flex items-center justify-between gap-3">
          <span className="text-xs text-prius-black/70 font-light">{aviso}</span>
          <button
            type="button"
            onClick={() => onIrAConsulta('sin_disponibilidad')}
            className="text-[10px] font-bold uppercase tracking-widest text-prius-black hover:text-gold transition-colors font-display cursor-pointer shrink-0"
          >
            Consultar →
          </button>
        </div>
      )}

      <div className="flex-1 min-h-0 relative">
        {cargando ? (
          <div className="absolute inset-0 bg-neutral-100 rounded-3xl animate-pulse flex items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-prius-black/30 font-display">
              Cargando disponibilidad…
            </span>
          </div>
        ) : todoBloqueado ? (
          <div className="absolute inset-0 bg-neutral-50 border border-hairline rounded-3xl flex items-center justify-center">
            <span className="text-xs text-prius-black/50 font-light">{MENSAJE_SIN_LUGAR}</span>
          </div>
        ) : (
          <PlanoInteractivo>
            <PlanoGrid unidades={unidades} renderCelda={renderCelda} />
          </PlanoInteractivo>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-hairline shrink-0">
        <span className="text-xs font-bold text-prius-black font-display truncate">
          {resumenSeleccion || 'Elegí tu lugar en el plano'}
        </span>
        <button
          type="button"
          onClick={() => actions.siguiente()}
          disabled={!seleccionCompleta}
          className="inline-flex h-9 md:h-10 items-center justify-center rounded-full bg-gold px-6 text-xs font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-display cursor-pointer gap-1.5 shadow-md shrink-0"
        >
          Siguiente <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
