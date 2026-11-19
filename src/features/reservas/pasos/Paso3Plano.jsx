import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDisponibilidad } from '../useDisponibilidad'
import { buscarUnidadVecina } from '../api'
import PlanoInteractivo from '../PlanoInteractivo'
import PlanoGrid from '../../../components/plano/PlanoGrid'
import CeldaPublica from '../../../components/plano/CeldaPublica'
import {
  LEYENDA_PLANO,
  MENSAJE_SIN_LUGAR,
  MENSAJE_SIN_VECINA,
  MENSAJE_UNIDAD_OCUPADA_EN_FECHAS,
  MENSAJE_UNIDAD_TOMADA,
} from '../mensajes'
import PiePaso, { BotonSiguiente } from '../marco/PiePaso'

const TIPO_LABEL = { carpa: 'Carpa', sombrilla: 'Sombrilla' }

export default function Paso3Plano({ config, state, actions, onIrAConsulta, avisoExterno = null }) {
  const { desde, hasta } = state.fechas
  const { unidades, cargando } = useDisponibilidad(desde, hasta)
  // avisoExterno: la unidad guardada se ocupó mientras el cliente estaba en
  // Google (ver ReservaFlow). Solo es el valor inicial; cualquier click lo borra.
  const [aviso, setAviso] = useState(avisoExterno)
  // Rango de la última disponibilidad revisada: si cambió, la unidad no se
  // "tomó" recién, es que no está libre en las fechas nuevas del header.
  const rangoRevisadoRef = useRef(null)

  const { principal, sugerida } = state.unidades

  // Realtime y cambio de fechas: si la unidad elegida pasó a bloqueada, se
  // deselecciona con aviso.
  useEffect(() => {
    if (cargando) return
    const rango = `${desde}|${hasta}`
    const cambioDeFechas = rangoRevisadoRef.current !== null && rangoRevisadoRef.current !== rango
    rangoRevisadoRef.current = rango
    if (!principal) return
    const aviso = cambioDeFechas ? MENSAJE_UNIDAD_OCUPADA_EN_FECHAS : MENSAJE_UNIDAD_TOMADA
    const actualizada = unidades.find((u) => u.unidad_id === principal.unidad_id)
    const sugeridaActualizada = sugerida && unidades.find((u) => u.unidad_id === sugerida.unidad_id)
    if (actualizada?.bloqueada || (sugerida && !sugeridaActualizada)) {
      actions.quitarUnidades()
      setAviso(aviso)
    } else if (sugerida && sugeridaActualizada?.bloqueada) {
      actions.setUnidadSugerida(null)
      setAviso(aviso)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unidades, cargando])

  // Busca la vecina para un grupo que necesita dos unidades.
  const completarConVecina = useCallback(
    async (slot) => {
      const vecinas = await buscarUnidadVecina(slot.unidad_id, desde, hasta)
      const encontrada = vecinas[0] ? unidades.find((u) => u.unidad_id === vecinas[0].unidad_id) : null
      if (encontrada && !encontrada.bloqueada) actions.setUnidadSugerida(encontrada)
      else setAviso(MENSAJE_SIN_VECINA)
    },
    [desde, hasta, unidades, actions],
  )

  // Personas cambiadas desde el header (Fase 6B), con la selección hecha:
  // misma regla que al elegir. Si ahora alcanza una unidad se suelta la
  // vecina; si hacen falta dos, se busca. El grupo grande lo saca a consulta
  // ReservaFlow antes de llegar acá.
  useEffect(() => {
    if (!principal || cargando) return
    const necesarias = Math.ceil(state.personas / (principal.capacidad || 1))
    if (necesarias <= 1 && sugerida) actions.setUnidadSugerida(null)
    else if (necesarias === 2 && !sugerida) completarConVecina(principal)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.personas, cargando])

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
      if (necesarias === 2) await completarConVecina(slot)
    },
    [principal, sugerida, state.personas, config, actions, onIrAConsulta, completarConVecina],
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
    <div className="flex-1 min-h-0 flex flex-col gap-3">
      <div className="flex items-center justify-end flex-wrap gap-2 shrink-0">
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

      <PiePaso
        izquierda={
          <span className="text-[13px] leading-[18px] font-semibold text-black truncate">
            {resumenSeleccion || 'Elegí tu lugar en el plano'}
          </span>
        }
        derecha={
          <BotonSiguiente onClick={() => actions.siguiente()} disabled={!seleccionCompleta}>
            Siguiente
          </BotonSiguiente>
        }
      />
    </div>
  )
}
