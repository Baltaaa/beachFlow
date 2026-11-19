import { useCallback, useEffect, useRef, useState } from 'react'
import { supabaseConfigurado } from '../../lib/supabase'
import { useConfigReservas } from './useConfigReservas'
import { useReservaFlow } from './useReservaFlow'
import { useCuentaCliente } from '../cuenta/useCuentaCliente'
import { obtenerDisponibilidad } from './api'
import { limpiarFlow } from './persistenciaFlow'
import { MENSAJE_UNIDAD_TOMADA } from './mensajes'
import { useTurnstile, turnstileConfigurado } from './useTurnstile'
import EstadoPausadas from './EstadoPausadas'
import PanelReserva from './marco/PanelReserva'
import MarcoReserva from './marco/MarcoReserva'
import BarraPaso from './marco/BarraPaso'
import SelectorFechas from './marco/SelectorFechas'
import SelectorPersonas from './marco/SelectorPersonas'
import { useEsAmplia } from './marco/useEsAmplia'
import Paso2FechasPersonas from './pasos/Paso2FechasPersonas'
import Paso3Plano from './pasos/Paso3Plano'
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

// Flujo de reserva de 6 pasos. Fase 6B: vive en un overlay con marco fijo
// (PanelReserva + MarcoReserva) que se abre al elegir "Carpas & Sombrillas"
// en el cotizador. Cuando no hay salida posible dentro del flujo (temporada,
// grupo grande, sin disponibilidad, pausadas, límite por teléfono), se cierra
// el overlay y se delega al Paso 2 de datos ya existente de ContactSection vía
// onIrAConsultaForm — mismo envío a n8n de siempre, sin tocar su payload.
export default function ReservaFlow({ onIrAConsultaForm, onCerrar, continuar = false, avisoLogin = null }) {
  const { config, cargando: cargandoConfig } = useConfigReservas()
  const { state, actions } = useReservaFlow(continuar, avisoLogin)
  const { widget: turnstileWidget, obtenerToken } = useTurnstile()
  const cuentaCliente = useCuentaCliente()
  const amplia = useEsAmplia()
  // Chips Todo / Carpas / Sombrillas del header: null | 'carpas' | 'sombrillas'.
  const [tipoFiltro, setTipoFiltro] = useState(null)
  // Aviso que arrastra el Paso 3 cuando la unidad guardada se ocupó mientras
  // el cliente estaba en Google.
  const [avisoPlano, setAvisoPlano] = useState(null)
  // Aviso flotante del marco (ej. error de las flechas de fecha).
  const [avisoMarco, setAvisoMarco] = useState(null)
  const revalidadoRef = useRef(false)

  useEffect(() => {
    if (!avisoMarco) return
    const t = setTimeout(() => setAvisoMarco(null), AVISO_MS)
    return () => clearTimeout(t)
  }, [avisoMarco])

  // Al volver del login, el plano puede haber cambiado: la unidad que el
  // cliente tenía elegida antes del redirect quizá ya la tomó otro. Misma
  // regla que el Realtime del Paso 3 — se deselecciona, se avisa y vuelve al
  // plano.
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
          setAvisoPlano(MENSAJE_UNIDAD_TOMADA)
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

  function onIrAConsulta(motivo) {
    // Salir del flujo hacia el form de consulta cancela la reserva en curso.
    limpiarFlow()
    onIrAConsultaForm({
      asunto: 'Reserva de carpas / sombrillas',
      mensaje: armarMensajeContexto(motivo, state),
    })
  }

  const cerrar = useCallback(() => {
    actions.reset()
    onCerrar()
  }, [actions, onCerrar])

  // Fechas desde el header (Pasos 3 y 4; desde el 5 quedan bloqueadas). La
  // selección se conserva: el Paso 3 la deselecciona con aviso si no está
  // libre en las fechas nuevas. Desde el Paso 4 se vuelve al plano.
  function cambiarFechas(fechas) {
    actions.cambiarFechas(fechas)
    if (state.paso === 4) actions.irAPaso(3)
  }

  // Personas desde el header, con las mismas reglas del plano: grupo grande
  // sale a consulta; si cambia cuántas unidades hacen falta, el Paso 3 busca
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
      if (state.paso === 4 && Math.max(1, necesarias) !== elegidas) actions.irAPaso(3)
    }
    actions.setPersonas(personas)
  }

  const flujoActivo =
    supabaseConfigurado && turnstileConfigurado && !cargandoConfig && state.estado !== 'pausadas' && config?.activo !== false
  const { paso } = state
  const pedirConfirmacion =
    flujoActivo && paso < 6 && (!!state.fechas.desde || !!state.unidades.principal || paso > 2)
  // Fechas y personas se editan en el cuerpo la primera vez (Paso 2), desde el
  // header en los Pasos 3 y 4, y quedan fijas desde el 5.
  const headerEditable = flujoActivo && (paso === 3 || paso === 4)

  function cuerpo() {
    // Sin Supabase o sin Turnstile configurados, ningún paso puede funcionar
    // de verdad — mejor mostrar "pausadas" de entrada (el resto de la
    // landing, incluida esta misma sección, sigue andando igual).
    if (!supabaseConfigurado || !turnstileConfigurado || (!cargandoConfig && !flujoActivo)) {
      return (
        <CuerpoContenido>
          <EstadoPausadas onIrAConsulta={() => onIrAConsulta('contacto')} />
        </CuerpoContenido>
      )
    }
    if (cargandoConfig) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-[13px] font-medium text-[#6B6B6B]">Cargando…</span>
        </div>
      )
    }
    if (paso === 3) {
      return (
        <div className="flex-1 min-h-0 flex flex-col p-3">
          <Paso3Plano
            config={config}
            state={state}
            actions={actions}
            onIrAConsulta={onIrAConsulta}
            avisoExterno={avisoPlano}
            tipoFiltro={tipoFiltro}
          />
        </div>
      )
    }
    return (
      <CuerpoContenido key={paso}>
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
        {paso === 6 && <Paso6Confirmacion config={config} state={state} onCerrar={cerrar} />}
      </CuerpoContenido>
    )
  }

  return (
    <PanelReserva pedirConfirmacion={pedirConfirmacion} onCerrar={cerrar}>
      {(solicitarCierre) => (
        <>
          {turnstileWidget}
          <MarcoReserva
            variante={amplia ? 'amplia' : 'compacta'}
            logo={<img src="/images/prius-icon.png" alt="Prius" className="w-11 h-11 object-contain shrink-0" />}
            selectorFecha={
              <>
                <SelectorFechas
                  fechas={state.fechas}
                  config={config}
                  bloqueado={!headerEditable}
                  amplia={amplia}
                  onCambiar={cambiarFechas}
                  onError={setAvisoMarco}
                />
                <SelectorPersonas
                  personas={state.personas}
                  bloqueado={!headerEditable}
                  amplia={amplia}
                  onCambiar={cambiarPersonas}
                />
              </>
            }
            tipo={tipoFiltro}
            onTipo={setTipoFiltro}
            chipsDeshabilitados={!flujoActivo || paso !== 3}
            onCerrar={solicitarCierre}
            barra={
              flujoActivo ? (
                <BarraPaso paso={paso} onCerrar={amplia ? null : solicitarCierre} />
              ) : (
                !amplia && <BarraPaso paso={null} onCerrar={solicitarCierre} />
              )
            }
            aviso={
              avisoMarco && (
                <div role="status" className="absolute top-3 left-1/2 -translate-x-1/2 z-20 max-w-[90%] bg-black text-white text-[13px] leading-[18px] font-medium rounded-full px-4 py-2 shadow-lg">
                  {avisoMarco}
                </div>
              )
            }
          >
            {cuerpo()}
          </MarcoReserva>
        </>
      )}
    </PanelReserva>
  )
}

// Cuerpo de los pasos que no son el plano: mismo tamaño que el mapa, contenido
// centrado y scroll interno (nunca del overlay).
function CuerpoContenido({ children }) {
  return (
    <div data-cuerpo-scroll className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
      <div className="max-w-[640px] mx-auto px-4 py-6 sm:px-6 sm:py-8">{children}</div>
    </div>
  )
}
