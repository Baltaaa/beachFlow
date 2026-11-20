import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabaseConfigurado } from '../../lib/supabase'
import { useConfigReservas } from './useConfigReservas'
import { useReservaFlow } from './useReservaFlow'
import { useCuentaCliente } from '../cuenta/useCuentaCliente'
import { obtenerDisponibilidad } from './api'
import { limpiarFlow } from './persistenciaFlow'
import { MENSAJE_UNIDAD_TOMADA } from './mensajes'
import { useTurnstile, turnstileConfigurado } from './useTurnstile'
import EstadoPausadas from './EstadoPausadas'
import MarcoPlanoClaro from '../../components/plano/MarcoPlanoClaro'
import PanelReserva from './marco/PanelReserva'
import BarraPaso from './marco/BarraPaso'
import SelectorFechas from './marco/SelectorFechas'
import SelectorPersonas from './marco/SelectorPersonas'
import { ContextoPieMarco } from './marco/contextoMarco'
import { useEsAmplia } from './marco/useEsAmplia'
import './marco/plano-claro.css'
import Paso2FechasPersonas from './pasos/Paso2FechasPersonas'
import { usePaso3Plano } from './pasos/Paso3Plano'
import Paso4Datos from './pasos/Paso4Datos'
import Paso5Confirmar from './pasos/Paso5Confirmar'
import Paso6Confirmacion from './pasos/Paso6Confirmacion'
import { resumenFechas } from './fechas'

const TEXTO_MOTIVO = {
  temporada: 'Quiero consultar por una reserva de temporada completa.',
  grupo_grande: 'Somos un grupo grande, necesito coordinar la reserva directamente.',
  sin_disponibilidad: 'No encontré disponibilidad online para estas fechas/unidades.',
  contacto: 'Quiero hacer una consulta sobre mi reserva.',
}

const AVISO_MS = 5000

function armarMensajeContexto(motivo, state) {
  const partes = []
  if (state.fechas.desde) partes.push(`Fechas: ${resumenFechas(state.fechas.desde, state.fechas.hasta)}`)
  if (state.personas) partes.push(`Personas: ${state.personas}`)
  const base = TEXTO_MOTIVO[motivo] ?? TEXTO_MOTIVO.contacto
  return partes.length ? `${base} (${partes.join(' · ')})` : base
}

function unidadesNecesarias(personas, unidad) {
  return Math.ceil(personas / (unidad?.capacidad || 1))
}

const LOGO = <img src="/images/prius-icon.png" alt="Prius" className="w-11 h-11 object-contain shrink-0" />

// Flujo de reserva de 6 pasos. Fase 6B: vive en un overlay (PanelReserva) con
// el marco de la vista clientes del CRM (MarcoPlanoClaro, copia exacta de
// priusApp) en TODOS los pasos: mismo header, barra del paso, cuerpo y footer.
// El Paso 3 es el mapa en vivo; los demás, cuerpo libre con scroll interno.
// Cuando no hay salida posible dentro del flujo (temporada, grupo grande, sin
// disponibilidad, pausadas, límite por teléfono), se cierra el overlay y se
// delega al Paso 2 de datos ya existente de ContactSection vía
// onIrAConsultaForm — mismo envío a n8n de siempre, sin tocar su payload.
export default function ReservaFlow({ onIrAConsultaForm, onCerrar, continuar = false, avisoLogin = null }) {
  const { config, cargando: cargandoConfig } = useConfigReservas()
  const { state, actions } = useReservaFlow(continuar, avisoLogin)
  const { widget: turnstileWidget, obtenerToken } = useTurnstile()
  const cuentaCliente = useCuentaCliente()
  const navigate = useNavigate()
  const amplia = useEsAmplia()
  // Chips Todo / Carpas / Sombrillas del header: null | 'carpas' | 'sombrillas'.
  const [tipoFiltro, setTipoFiltro] = useState(null)
  const [rotado, setRotado] = useState(false)
  // Aviso flotante del marco (ej. error de las flechas de fecha).
  const [avisoMarco, setAvisoMarco] = useState(null)
  // Nodo del footer del marco: cada paso dibuja ahí sus botones (PiePaso).
  const [nodoPie, setNodoPie] = useState(null)
  const mapaRef = useRef(null)
  const revalidadoRef = useRef(false)

  const flujoActivo =
    supabaseConfigurado && turnstileConfigurado && !cargandoConfig && state.estado !== 'pausadas' && config?.activo !== false
  const { paso } = state

  const onIrAConsulta = useCallback(
    (motivo) => {
      // Salir del flujo hacia el form de consulta cancela la reserva en curso.
      limpiarFlow()
      onIrAConsultaForm({
        asunto: 'Reserva de carpas / sombrillas',
        mensaje: armarMensajeContexto(motivo, state),
      })
    },
    [onIrAConsultaForm, state],
  )

  const plano = usePaso3Plano({
    activo: flujoActivo && paso === 3,
    config,
    state,
    actions,
    onIrAConsulta,
    tipoFiltro,
    amplia,
    mapaRef,
    rotado,
  })
  const avisarPlano = plano.avisar

  useEffect(() => {
    if (!avisoMarco) return
    const t = setTimeout(() => setAvisoMarco(null), AVISO_MS)
    return () => clearTimeout(t)
  }, [avisoMarco])

  // Cada paso del cuerpo libre arranca arriba (el scroll es del marco).
  useLayoutEffect(() => {
    document.querySelector('[data-panel-reserva] [data-scroll-cuerpo]')?.scrollTo(0, 0)
  }, [paso])

  // Reserva creada: la cuenta (navbar, /mi-cuenta) la tiene que ver ya.
  const codigoCreado = paso === 6 ? state.resultado?.codigo : null
  const { refrescar: refrescarCuenta } = cuentaCliente
  useEffect(() => {
    if (codigoCreado) refrescarCuenta()
  }, [codigoCreado, refrescarCuenta])

  // Al volver del login, el plano puede haber cambiado: la unidad que el
  // cliente tenía elegida antes del redirect quizá ya la tomó otro. Misma
  // regla que el plano en vivo — se deselecciona, se avisa y vuelve al plano.
  useEffect(() => {
    if (!continuar || revalidadoRef.current) return
    const { principal, sugerida } = state.unidades
    const { desde, hasta } = state.fechas
    if (!principal || !desde || !hasta) return
    revalidadoRef.current = true
    let vivo = true
    obtenerDisponibilidad(desde, hasta)
      .then((unidades) => {
        if (!vivo) return
        const sigueLibre = (u) => {
          if (!u) return true
          const actual = unidades.find((x) => x.unidad_id === u.unidad_id)
          return !!actual && !actual.bloqueada
        }
        if (!sigueLibre(principal) || !sigueLibre(sugerida)) {
          actions.quitarUnidades()
          avisarPlano(MENSAJE_UNIDAD_TOMADA)
          actions.irAPaso(3)
        }
      })
      .catch(() => {
        // Sin respuesta no se toca nada: el Paso 3 vuelve a consultar igual.
      })
    return () => {
      vivo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continuar])

  const cerrar = useCallback(() => {
    actions.reset()
    onCerrar()
  }, [actions, onCerrar])

  // Paso 6 → "Ver en mi cuenta": cierra el overlay y lleva a la reserva.
  const verEnCuenta = useCallback(
    (codigo) => {
      cerrar()
      navigate(`/mi-cuenta/reservas/${codigo}`)
    },
    [cerrar, navigate],
  )

  // Fechas desde el header (Pasos 3 y 4; desde el 5 quedan bloqueadas). La
  // selección se conserva: el plano la deselecciona con aviso si no está
  // libre en las fechas nuevas. Desde el Paso 4 se vuelve al plano.
  function cambiarFechas(fechas) {
    actions.cambiarFechas(fechas)
    if (paso === 4) actions.irAPaso(3)
  }

  // Personas desde el header, con las mismas reglas del plano: grupo grande
  // sale a consulta; si cambia cuántas unidades hacen falta, el plano busca
  // o suelta la vecina (y desde el Paso 4 se vuelve al plano).
  function cambiarPersonas(personas) {
    const { principal, sugerida } = state.unidades
    if (principal) {
      const necesarias = unidadesNecesarias(personas, principal)
      if (config && necesarias > config.max_unidades_por_reserva) {
        actions.setPersonas(personas)
        onIrAConsulta('grupo_grande')
        return
      }
      const elegidas = sugerida ? 2 : 1
      if (paso === 4 && Math.max(1, necesarias) !== elegidas) actions.irAPaso(3)
    }
    actions.setPersonas(personas)
  }

  const pedirConfirmacion =
    flujoActivo && paso < 6 && (!!state.fechas.desde || !!state.unidades.principal || paso > 2)
  // Fechas y personas se editan en el cuerpo la primera vez (Paso 2), desde el
  // header en los Pasos 3 y 4, y quedan fijas desde el 5.
  const headerEditable = flujoActivo && (paso === 3 || paso === 4)
  const enMapa = flujoActivo && paso === 3

  function cuerpoLibre() {
    // Sin Supabase o sin Turnstile configurados, ningún paso puede funcionar
    // de verdad — mejor mostrar "pausadas" de entrada (el resto de la
    // landing, incluida esta misma sección, sigue andando igual).
    if (!supabaseConfigurado || !turnstileConfigurado || (!cargandoConfig && !flujoActivo)) {
      return (
        <ContenidoPaso>
          <EstadoPausadas onIrAConsulta={() => onIrAConsulta('contacto')} />
        </ContenidoPaso>
      )
    }
    if (cargandoConfig) {
      return (
        <div className="h-full flex items-center justify-center">
          <span className="text-[13px] font-medium text-[#6B6B6B]">Cargando…</span>
        </div>
      )
    }
    return (
      <ContenidoPaso key={paso}>
        {paso === 2 && (
          <Paso2FechasPersonas config={config} state={state} actions={actions} onIrAConsulta={onIrAConsulta} />
        )}
        {paso === 4 && (
          <Paso4Datos state={state} actions={actions} obtenerToken={obtenerToken} cuentaCliente={cuentaCliente} />
        )}
        {paso === 5 && (
          <Paso5Confirmar
            config={config}
            state={state}
            actions={actions}
            obtenerToken={obtenerToken}
            onIrAConsulta={onIrAConsulta}
            cuentaCliente={cuentaCliente}
          />
        )}
        {paso === 6 && <Paso6Confirmacion config={config} state={state} onCerrar={cerrar} onVerEnCuenta={verEnCuenta} />}
      </ContenidoPaso>
    )
  }

  const toastMarco = avisoMarco && (
    <div
      role="status"
      className="absolute top-3 left-1/2 -translate-x-1/2 z-30 max-w-[90%] bg-black text-white text-[13px] leading-[18px] font-medium rounded-full px-4 py-2 shadow-lg"
    >
      {avisoMarco}
    </div>
  )

  return (
    <PanelReserva pedirConfirmacion={pedirConfirmacion} onCerrar={cerrar}>
      {(solicitarCierre) => (
        <ContextoPieMarco.Provider value={nodoPie}>
          {turnstileWidget}
          <MarcoPlanoClaro
            variante={amplia ? 'amplia' : 'compacta'}
            logo={LOGO}
            selectorFecha={
              <SelectorFechas
                fechas={state.fechas}
                config={config}
                bloqueado={!headerEditable}
                amplia={amplia}
                onCambiar={cambiarFechas}
                onError={setAvisoMarco}
              />
            }
            selectorPersonas={
              <SelectorPersonas
                personas={state.personas}
                bloqueado={!headerEditable}
                amplia={amplia}
                onCambiar={cambiarPersonas}
              />
            }
            tipo={tipoFiltro}
            onTipo={setTipoFiltro}
            chipsDeshabilitados={!enMapa}
            // Amplia: la X del header. Compacta: la X va en la barra del paso
            // (sin onCerrar, la pill del mapa no muestra "cerrar pantalla").
            onCerrar={amplia ? solicitarCierre : undefined}
            tituloCerrar="Cerrar"
            onRefrescar={enMapa ? plano.refrescar : undefined}
            refrescando={enMapa && plano.refrescando}
            barra={
              flujoActivo ? (
                <BarraPaso paso={paso} onCerrar={amplia ? null : solicitarCierre} />
              ) : (
                !amplia && <BarraPaso paso={null} onCerrar={solicitarCierre} />
              )
            }
            cuerpo={enMapa ? 'mapa' : 'libre'}
            claseCuerpo="border border-[#EDEDED]"
            leyenda={enMapa && plano.leyenda}
            aviso={
              (toastMarco || enMapa) && (
                <>
                  {enMapa && plano.aviso}
                  {toastMarco}
                </>
              )
            }
            pieRef={setNodoPie}
            rotado={rotado}
            onRotar={() => setRotado((v) => !v)}
            cargando={enMapa && plano.cargando}
            mapaRef={mapaRef}
            resetKey={tipoFiltro ?? ''}
          >
            {enMapa ? plano.plano : cuerpoLibre()}
          </MarcoPlanoClaro>
          {enMapa && plano.pie}
        </ContextoPieMarco.Provider>
      )}
    </PanelReserva>
  )
}

// Contenido de los pasos que no son el mapa: centrado y de 640px como máximo.
// El scroll interno lo pone el marco (cuerpo="libre").
function ContenidoPaso({ children }) {
  return <div className="max-w-[640px] mx-auto px-4 py-6 sm:px-6 sm:py-8">{children}</div>
}
