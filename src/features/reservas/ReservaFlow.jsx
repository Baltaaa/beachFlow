import { useConfigReservas } from './useConfigReservas'
import { useReservaFlow } from './useReservaFlow'
import { useTurnstile } from './useTurnstile'
import BarraProgreso from './BarraProgreso'
import EstadoPausadas from './EstadoPausadas'
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

function armarMensajeContexto(motivo, state) {
  const partes = []
  if (state.fechas.desde) partes.push(`Fechas: ${resumenFechas(state.fechas.desde, state.fechas.hasta)}`)
  if (state.personas) partes.push(`Personas: ${state.personas}`)
  const base = TEXTO_MOTIVO[motivo] ?? TEXTO_MOTIVO.contacto
  return partes.length ? `${base} (${partes.join(' · ')})` : base
}

// Flujo de reserva de 6 pasos, integrado al cotizador existente en el lugar
// de "Carpas & Sombrillas". Cuando no hay salida posible dentro del flujo
// (temporada, grupo grande, sin disponibilidad, pausadas, límite por
// teléfono), se delega al Paso 2 de datos ya existente de ContactSection
// vía onIrAConsultaForm — mismo envío a n8n de siempre, sin tocar su payload.
export default function ReservaFlow({ onIrAConsultaForm }) {
  const { config, cargando: cargandoConfig } = useConfigReservas()
  const { state, actions } = useReservaFlow()
  const { widget: turnstileWidget, obtenerToken } = useTurnstile()

  function onIrAConsulta(motivo) {
    onIrAConsultaForm({
      asunto: 'Reserva de carpas / sombrillas',
      mensaje: armarMensajeContexto(motivo, state),
    })
  }

  if (cargandoConfig) {
    return (
      <div className="py-16 flex items-center justify-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-prius-black/30 font-display">
          Cargando…
        </span>
      </div>
    )
  }

  if (state.estado === 'pausadas' || config?.activo === false) {
    return <EstadoPausadas onIrAConsulta={() => onIrAConsulta('contacto')} />
  }

  return (
    <div>
      {turnstileWidget}
      {state.paso < 6 && <BarraProgreso paso={state.paso} />}

      {state.paso === 2 && (
        <Paso2FechasPersonas config={config} state={state} actions={actions} onIrAConsulta={onIrAConsulta} />
      )}
      {state.paso === 3 && (
        <Paso3Plano config={config} state={state} actions={actions} onIrAConsulta={onIrAConsulta} />
      )}
      {state.paso === 4 && (
        <Paso4Datos state={state} actions={actions} obtenerToken={obtenerToken} />
      )}
      {state.paso === 5 && (
        <Paso5Confirmar
          config={config}
          state={state}
          actions={actions}
          obtenerToken={obtenerToken}
          onIrAConsulta={onIrAConsulta}
        />
      )}
      {state.paso === 6 && <Paso6Confirmacion config={config} state={state} />}
    </div>
  )
}
