import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDisponibilidad } from '../useDisponibilidad'
import { buscarUnidadVecina } from '../api'
import PlanoClaro from '../../../components/plano/PlanoClaro'
import CeldaClara from '../../../components/plano/CeldaClara'
import {
  MENSAJE_SIN_LUGAR,
  MENSAJE_SIN_VECINA,
  MENSAJE_TOCAR_DE_NUEVO,
  MENSAJE_UNIDAD_OCUPADA_EN_FECHAS,
  MENSAJE_UNIDAD_TOMADA,
} from '../mensajes'
import PiePaso, { BotonSiguiente } from '../marco/PiePaso'
import LeyendaPlano from '../marco/LeyendaPlano'

const TIPO_LABEL = { carpa: 'Carpa', sombrilla: 'Sombrilla' }
const ESTADO_LABEL = { libre: 'libre', ocupada: 'ocupada', elegida: 'tu elección', sugerida: 'sugerida' }
const AYUDA_MS = 1800
const MENSAJE_ERROR_PLANO = 'No pudimos actualizar el plano. Probá de nuevo con ↻.'

// "El primer toque acerca" (vive acá, nunca en src/components/plano): si la
// casilla tocada se ve más chica que el mínimo táctil, el toque acerca en ese
// punto en vez de elegir. Escala a partir de la cual la casilla ya es cómoda:
// `tactil` (mobile) mide 44×36 a escala 1; `compacta` (desde md) mide 28×20,
// y llega a 44×36 recién a 1.8.
const ESCALA_COMODA = { amplia: 1.8, compacta: 1 }
const FACTOR_MINIMO = 1.8

const coincideTipo = (slot, tipo) => !tipo || (tipo === 'carpas' ? slot.tipo === 'carpa' : slot.tipo === 'sombrilla')

// En compacta (mobile) siempre es táctil. En amplia solo con puntero grueso
// (tablet): con mouse, el click elige directo.
function esToqueGrueso(amplia) {
  if (!amplia) return true
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
}

/**
 * Paso 3 — el plano "vista clientes" en vivo dentro de MarcoPlanoClaro.
 *
 * Es un hook y no un componente porque el mapa tiene que ser el `children`
 * directo del marco (que es de ReservaFlow y no se remonta entre pasos): acá
 * vive toda la lógica del paso y se devuelven las piezas que ReservaFlow le
 * pasa al marco. Con `activo` en false (otro paso) no consulta nada.
 *
 * Reglas: vecina sugerida para grupos, capacidad, grupo grande a consulta,
 * deselección con aviso si lo elegido pasa a ocupado (en vivo o al cambiar
 * las fechas del header) y el primer toque acerca.
 *
 * Devuelve { plano, leyenda, aviso, pie, cargando, refrescando, refrescar, avisar }.
 */
export function usePaso3Plano({ activo, config, state, actions, onIrAConsulta, tipoFiltro, amplia, mapaRef, rotado }) {
  const { desde, hasta } = state.fechas
  const rangoActual = desde && hasta ? `${desde}|${hasta}` : null
  const { unidades, rango, cargando, refrescando, error, refrescar } = useDisponibilidad(desde, hasta, { activo })
  // Datos del rango del header (no de las fechas anteriores mientras llegan
  // las nuevas).
  const datosAlDia = rango === rangoActual
  const [aviso, setAviso] = useState(null)
  const [ayuda, setAyuda] = useState(false)
  const ayudaRef = useRef(null)
  // Rango de la última disponibilidad revisada: si cambió, la unidad no se
  // "tomó" recién, es que no está libre en las fechas nuevas del header.
  const rangoRevisadoRef = useRef(null)

  // Al salir del plano se descarta el aviso (ajuste de estado en el render,
  // no en un efecto).
  const [activoPrevio, setActivoPrevio] = useState(activo)
  if (activoPrevio !== activo) {
    setActivoPrevio(activo)
    if (!activo) {
      setAviso(null)
      setAyuda(false)
    }
  }

  useEffect(() => () => clearTimeout(ayudaRef.current), [])

  const { principal, sugerida } = state.unidades

  // En vivo y al cambiar de fechas: si lo elegido pasó a ocupado, se
  // deselecciona con aviso.
  useEffect(() => {
    if (!activo || !datosAlDia) return
    const cambioDeFechas = rangoRevisadoRef.current !== null && rangoRevisadoRef.current !== rango
    rangoRevisadoRef.current = rango
    if (!principal) return
    const texto = cambioDeFechas ? MENSAJE_UNIDAD_OCUPADA_EN_FECHAS : MENSAJE_UNIDAD_TOMADA
    const actualizada = unidades.find((u) => u.unidad_id === principal.unidad_id)
    const sugeridaActualizada = sugerida && unidades.find((u) => u.unidad_id === sugerida.unidad_id)
    if (actualizada?.bloqueada || (sugerida && !sugeridaActualizada)) {
      actions.quitarUnidades()
      setAviso(texto)
    } else if (sugerida && sugeridaActualizada?.bloqueada) {
      actions.setUnidadSugerida(null)
      setAviso(texto)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unidades, rango, activo])

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

  // Personas cambiadas desde el header con la selección hecha: misma regla
  // que al elegir. Si ahora alcanza una unidad se suelta la vecina; si hacen
  // falta dos, se busca. El grupo grande lo saca a consulta ReservaFlow.
  useEffect(() => {
    if (!activo || !principal || !datosAlDia) return
    const necesarias = Math.ceil(state.personas / (principal.capacidad || 1))
    if (necesarias <= 1 && sugerida) actions.setUnidadSugerida(null)
    else if (necesarias === 2 && !sugerida) completarConVecina(principal)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.personas, datosAlDia, activo])

  const elegir = useCallback(
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

  const tocar = useCallback(
    (slot, evento) => {
      // Mientras llegan los datos de las fechas nuevas, lo que se ve es viejo.
      if (!datosAlDia) return
      const mapa = mapaRef.current
      if (mapa && evento && esToqueGrueso(amplia)) {
        const { escala, escalaMax } = mapa.estado()
        const comoda = ESCALA_COMODA[amplia ? 'amplia' : 'compacta']
        if (escala < comoda - 0.01) {
          const destino = Math.min(escalaMax, Math.max(comoda, escala * FACTOR_MINIMO))
          mapa.acercarEn(evento.clientX, evento.clientY, destino / escala)
          setAyuda(true)
          clearTimeout(ayudaRef.current)
          ayudaRef.current = setTimeout(() => setAyuda(false), AYUDA_MS)
          return
        }
      }
      setAyuda(false)
      elegir(slot)
    },
    [datosAlDia, mapaRef, amplia, elegir],
  )

  const renderCelda = (slot) => {
    const estado =
      !slot.unidad_id || slot.bloqueada
        ? 'ocupada'
        : slot.unidad_id === principal?.unidad_id
          ? 'elegida'
          : slot.unidad_id === sugerida?.unidad_id
            ? 'sugerida'
            : 'libre'
    const coincide = coincideTipo(slot, tipoFiltro)
    return (
      <CeldaClara
        key={`${slot.tipo}-${slot.numero}`}
        numero={slot.numero}
        numberSide={slot.numberSide}
        tamano={amplia ? 'compacta' : 'tactil'}
        estado={estado}
        deshabilitada={!!tipoFiltro && !coincide}
        resaltada={!!tipoFiltro && coincide}
        onClick={(_, evento) => tocar(slot, evento)}
        etiqueta={`${TIPO_LABEL[slot.tipo] || slot.tipo} ${slot.numero}, ${ESTADO_LABEL[estado]}`}
        data-celda={`${slot.tipo}-${slot.numero}`}
        data-estado={estado}
      />
    )
  }

  const resumenSeleccion = useMemo(
    () =>
      [principal, sugerida]
        .filter(Boolean)
        .map((u) => `${TIPO_LABEL[u.tipo] || u.tipo} ${u.numero}`)
        .join(' + '),
    [principal, sugerida],
  )

  const todoBloqueado = datosAlDia && unidades.length > 0 && unidades.every((u) => u.bloqueada)
  const necesarias = principal ? Math.ceil(state.personas / (principal.capacidad || 1)) : 0
  const seleccionCompleta = !!principal && (necesarias <= 1 || !!sugerida)
  const textoAviso = aviso || (todoBloqueado ? MENSAJE_SIN_LUGAR : error ? MENSAJE_ERROR_PLANO : null)

  if (!activo) return { plano: null, leyenda: null, aviso: null, pie: null, cargando: false, refrescando: false, refrescar, avisar: setAviso }

  return {
    plano: <PlanoClaro unidades={unidades} renderCelda={renderCelda} rotado={rotado} />,
    leyenda: <LeyendaPlano amplia={amplia} />,
    aviso: (
      <>
        {ayuda ? (
          <div
            role="status"
            className="pointer-events-none absolute top-11 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap bg-black text-white text-[13px] leading-[18px] font-semibold rounded-full px-4 py-2 shadow-lg"
          >
            {MENSAJE_TOCAR_DE_NUEVO}
          </div>
        ) : (
          textoAviso && (
            <div
              role="status"
              data-aviso-plano
              className="absolute top-11 left-1/2 -translate-x-1/2 z-20 w-max max-w-[calc(100%-24px)] bg-white border border-[#E5E5E5] rounded-2xl shadow-[0_12px_32px_-12px_rgba(0,0,0,0.3)] pl-4 pr-2 py-2 flex items-center gap-3"
            >
              <span className="text-[13px] leading-[18px] font-medium text-black">{textoAviso}</span>
              {aviso || todoBloqueado ? (
                <button
                  type="button"
                  onClick={() => onIrAConsulta('sin_disponibilidad')}
                  className="shrink-0 h-9 px-3 rounded-full text-[13px] font-semibold text-black hover:bg-[#F2F1EC] transition-colors"
                >
                  Consultar
                </button>
              ) : null}
            </div>
          )
        )}
      </>
    ),
    pie: (
      <PiePaso
        izquierda={
          <span data-resumen-seleccion className="text-[13px] leading-[18px] font-semibold text-black truncate">
            {resumenSeleccion || 'Elegí tu lugar en el plano'}
          </span>
        }
        derecha={
          <BotonSiguiente onClick={() => actions.siguiente()} disabled={!seleccionCompleta}>
            Siguiente
          </BotonSiguiente>
        }
      />
    ),
    cargando,
    refrescando,
    refrescar,
    avisar: setAviso,
  }
}
