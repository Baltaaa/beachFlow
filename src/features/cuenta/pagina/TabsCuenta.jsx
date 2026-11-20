import { Link, useOutletContext, useParams } from 'react-router-dom'
import { CalendarPlus, ChevronLeft, ChevronRight, Coffee, Download, MapPin, MessageCircle, Sparkles, Umbrella } from 'lucide-react'
import { URL_RESERVA } from '../../../lib/reservas-contrato'
import { useConfigReservas } from '../../reservas/useConfigReservas'
import { formatoPesos, resumenFechas } from '../../reservas/fechas'
import {
  TIPO_ALQUILER_LABEL,
  etiquetaUnidad,
  etiquetaUnidades,
  reservasDeHoy,
  textoEstadoReserva,
  unidadesDeHoy,
} from '../datosCuenta'
import { BadgeReserva } from './estadoReserva'
import { useQrReserva } from './useQrReserva'

export const VACIO_HOY = 'No tenés nada para hoy'
export const VACIO_PEDIDOS = 'Próximamente: vas a poder pedir del café y el mercado de playa desde tu carpa'
export const VACIO_ACTIVIDADES = 'Próximamente: actividades recreativas del balneario'

const MAPS_URL = 'https://www.google.com/maps/place/?q=place_id:ChIJQaFra8rdhJURflMJm96GTPQ'
const TARJETA = 'bg-white rounded-[24px] border border-hairline'
const BOTON_DORADO =
  'inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-gold px-6 text-xs font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover transition-colors font-display shadow-md'
const BOTON_BORDE =
  'inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-hairline px-5 text-xs font-bold uppercase tracking-wider text-prius-black hover:border-gold transition-colors font-display'

function TituloTab({ children }) {
  return <h2 className="text-lg md:text-xl font-bold uppercase tracking-wide text-prius-black font-display">{children}</h2>
}

function Vacio({ icono, texto, conReservar = false }) {
  const Icono = icono
  return (
    <div data-vacio className={`${TARJETA} px-6 py-12 flex flex-col items-center text-center`}>
      <span className="w-12 h-12 rounded-full bg-gold/15 text-prius-black flex items-center justify-center">
        <Icono size={20} />
      </span>
      <p className="mt-4 text-sm text-prius-black/70 max-w-sm leading-relaxed">{texto}</p>
      {conReservar && (
        <Link to="/#contacto" className={`mt-5 ${BOTON_DORADO}`}>
          <CalendarPlus size={14} /> Reservar
        </Link>
      )}
    </div>
  )
}

// Fila de una reserva web: abre su detalle con el QR.
function FilaReserva({ reserva }) {
  return (
    <Link
      to={`/mi-cuenta/reservas/${reserva.codigo}`}
      data-reserva={reserva.codigo}
      className={`${TARJETA} group p-4 md:p-5 flex items-center gap-4 hover:border-gold transition-colors`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-base font-bold text-prius-black font-display tracking-widest">{reserva.codigo}</span>
          <BadgeReserva estado={reserva.estado} />
        </div>
        <p className="mt-2 text-sm text-prius-black/70">
          {etiquetaUnidades(reserva.unidades)}
          <span className="text-prius-black/30"> · </span>
          {resumenFechas(reserva.desde, reserva.hasta)}
        </p>
        <p className="mt-1 text-xs text-prius-black/50">
          Total {formatoPesos(reserva.total) ?? '—'}
          {reserva.saldo > 0 && (
            <>
              <span className="text-prius-black/30"> · </span>
              Saldo <span className="font-semibold text-prius-black">{formatoPesos(reserva.saldo)}</span>
            </>
          )}
        </p>
      </div>
      <ChevronRight size={18} className="shrink-0 text-prius-black/30 group-hover:text-prius-black transition-colors" />
    </Link>
  )
}

function FilaUnidad({ unidad }) {
  return (
    <div data-unidad={`${unidad.tipo}-${unidad.numero}`} className={`${TARJETA} p-4 md:p-5 flex items-center gap-4`}>
      <span className="w-12 h-12 shrink-0 rounded-2xl bg-neutral-950 text-gold flex items-center justify-center">
        <Umbrella size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-base font-bold uppercase text-prius-black font-display tracking-wide">{etiquetaUnidad(unidad)}</p>
        <p className="text-sm text-prius-black/60">
          {TIPO_ALQUILER_LABEL[unidad.tipo_alquiler] ?? unidad.tipo_alquiler}
          <span className="text-prius-black/30"> · </span>
          {resumenFechas(unidad.desde, unidad.hasta)}
        </p>
      </div>
    </div>
  )
}

/** Hoy: reservas web de hoy y la unidad vigente hoy (temporada primero). */
export function TabHoy() {
  const { cuenta, hoy } = useOutletContext()
  const reservas = reservasDeHoy(cuenta?.reservas_web, hoy)
  const unidades = cuenta?.vinculo === 'confirmado' ? unidadesDeHoy(cuenta.unidades_vigentes, hoy, reservas) : []
  return (
    <div className="space-y-3">
      <TituloTab>Hoy</TituloTab>
      {reservas.length === 0 && unidades.length === 0 ? (
        <Vacio icono={CalendarPlus} texto={VACIO_HOY} conReservar />
      ) : (
        <>
          {unidades.map((u) => (
            <FilaUnidad key={`${u.tipo}-${u.numero}-${u.desde}`} unidad={u} />
          ))}
          {reservas.map((r) => (
            <FilaReserva key={r.codigo} reserva={r} />
          ))}
        </>
      )}
    </div>
  )
}

/** Mi unidad: unidades_vigentes (solo con vínculo confirmado). */
export function TabUnidad() {
  const { cuenta } = useOutletContext()
  const unidades = cuenta?.vinculo === 'confirmado' ? cuenta.unidades_vigentes ?? [] : []
  const texto =
    cuenta?.vinculo === 'pendiente'
      ? 'Cuando confirmemos tu cuenta en recepción, acá vas a ver tu unidad.'
      : 'No tenés una unidad asignada por ahora.'
  return (
    <div className="space-y-3">
      <TituloTab>Mi unidad</TituloTab>
      {unidades.length === 0 ? (
        <Vacio icono={Umbrella} texto={texto} />
      ) : (
        unidades.map((u) => <FilaUnidad key={`${u.tipo}-${u.numero}-${u.desde}`} unidad={u} />)
      )}
    </div>
  )
}

/** Reservas: las reservas web de ESTA cuenta (mi_cuenta().reservas_web). */
export function TabReservas() {
  const { cuenta } = useOutletContext()
  const reservas = cuenta?.reservas_web ?? []
  return (
    <div className="space-y-3">
      <TituloTab>Reservas</TituloTab>
      {reservas.length === 0 ? (
        <Vacio icono={CalendarPlus} texto="Todavía no hiciste reservas online con esta cuenta." conReservar />
      ) : (
        reservas.map((r) => <FilaReserva key={r.codigo} reserva={r} />)
      )}
    </div>
  )
}

function Dato({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-sm border-b border-hairline last:border-0">
      <span className="text-prius-black/50">{label}</span>
      <span className="font-semibold text-prius-black text-right">{children}</span>
    </div>
  )
}

/** /mi-cuenta/reservas/:codigo — detalle con el QR. */
export function DetalleReserva() {
  const { codigo } = useParams()
  const { cuenta } = useOutletContext()
  const { config } = useConfigReservas()
  const reserva = cuenta?.reservas_web?.find((r) => r.codigo === codigo) ?? null
  const qr = useQrReserva(reserva?.codigo)

  const volver = (
    <Link
      to="/mi-cuenta/reservas"
      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-prius-black/60 hover:text-prius-black transition-colors font-display"
    >
      <ChevronLeft size={14} /> Todas tus reservas
    </Link>
  )

  if (!reserva) {
    return (
      <div className="space-y-4">
        {volver}
        <div className={`${TARJETA} px-6 py-10 text-center`}>
          <p className="text-sm text-prius-black/70">No encontramos esa reserva en tu cuenta.</p>
          <Link to={`/r/${codigo}`} className={`mt-5 ${BOTON_BORDE}`}>
            Buscarla por su código
          </Link>
        </div>
      </div>
    )
  }

  const explicacion = textoEstadoReserva(reserva, config)
  const linkWhatsapp = `https://wa.me/?text=${encodeURIComponent(`Mi reserva en Prius Playa Grande: ${URL_RESERVA(reserva.codigo)}`)}`

  return (
    <div className="space-y-4" data-detalle-reserva={reserva.codigo}>
      {volver}
      <div className={`${TARJETA} p-6 md:p-8`}>
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
          <div className="mx-auto md:mx-0 shrink-0 rounded-2xl p-2 border border-hairline">
            {qr ? (
              <img src={qr} alt={`QR de la reserva ${reserva.codigo}`} className="w-52 h-52" />
            ) : (
              <div className="w-52 h-52 bg-neutral-100 rounded-xl animate-pulse" />
            )}
          </div>
          <div className="flex-1 min-w-0 text-center md:text-left">
            <BadgeReserva estado={reserva.estado} />
            <p className="mt-3 text-2xl font-bold text-prius-black font-display tracking-widest">{reserva.codigo}</p>
            {explicacion && <p className="mt-2 text-sm text-prius-black/70 leading-relaxed">{explicacion}</p>}
            <div className="mt-4 text-left">
              <Dato label="Unidades">{etiquetaUnidades(reserva.unidades)}</Dato>
              <Dato label="Fechas">{resumenFechas(reserva.desde, reserva.hasta)}</Dato>
              {reserva.total != null && <Dato label="Total">{formatoPesos(reserva.total)}</Dato>}
              {reserva.saldo != null && <Dato label="Saldo">{formatoPesos(reserva.saldo)}</Dato>}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {qr && (
            <a href={qr} download={`prius-${reserva.codigo}.png`} className={`sm:flex-1 ${BOTON_BORDE}`}>
              <Download size={14} /> Descargar QR
            </a>
          )}
          <a href={linkWhatsapp} target="_blank" rel="noopener noreferrer" className={`sm:flex-1 ${BOTON_BORDE}`}>
            <MessageCircle size={14} /> Compartir
          </a>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={`sm:flex-1 ${BOTON_BORDE}`}>
            <MapPin size={14} /> Cómo llegar
          </a>
        </div>
      </div>
    </div>
  )
}

export function TabPedidos() {
  return (
    <div className="space-y-3">
      <TituloTab>Pedidos</TituloTab>
      <Vacio icono={Coffee} texto={VACIO_PEDIDOS} />
    </div>
  )
}

export function TabActividades() {
  return (
    <div className="space-y-3">
      <TituloTab>Actividades</TituloTab>
      <Vacio icono={Sparkles} texto={VACIO_ACTIVIDADES} />
    </div>
  )
}
