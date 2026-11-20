import { Link } from 'react-router-dom'
import { CalendarPlus, QrCode } from 'lucide-react'
import { resumenFechas } from '../../reservas/fechas'
import {
  TIPO_ALQUILER_LABEL,
  etiquetaUnidad,
  etiquetaUnidades,
  nombreCompleto,
  reservaParaQR,
  unidadParaTarjeta,
} from '../datosCuenta'
import { BadgeReserva } from './estadoReserva'
import { useQrReserva } from './useQrReserva'

export const TEXTO_QR_RECEPCION = 'Mostrá este QR en recepción'
export const TEXTO_QR_PERSONAL_PRONTO = 'Tu QR personal para pedidos y actividades llega pronto'

// Tarjeta de la izquierda (arriba en mobile) de /mi-cuenta.
// 1. Con una reserva web activa (en curso o la próxima): su QR, el mismo de
//    /r/<codigo>, con el código y lo que reservó.
// 2. Sin reserva web pero con una unidad vigente (vínculo confirmado): la
//    unidad, sin QR. El QR personal para pedidos y actividades es de la fase
//    de recreación (necesita firma del servidor): acá no se inventa ninguno.
// 3. Sin nada: invitación a reservar.
// Debajo, siempre el nombre y el email de la cuenta.
export default function TarjetaQR({ cuenta, sesion, hoy }) {
  const reserva = reservaParaQR(cuenta?.reservas_web, hoy)
  const unidad = reserva ? null : unidadParaTarjeta(cuenta, hoy)
  const qr = useQrReserva(reserva?.codigo)
  const email = cuenta?.email || sesion?.user?.email || ''

  return (
    <section
      data-tarjeta-qr={reserva ? 'reserva' : unidad ? 'unidad' : 'vacia'}
      className="bg-white rounded-[28px] border border-hairline shadow-[0_20px_50px_-24px_rgba(0,0,0,0.25)] p-6 md:p-7 text-center"
    >
      {reserva ? (
        <>
          <Link to={`/mi-cuenta/reservas/${reserva.codigo}`} className="block mx-auto w-fit rounded-2xl p-2 border border-hairline hover:border-gold transition-colors">
            {qr ? (
              <img src={qr} alt={`QR de la reserva ${reserva.codigo}`} className="w-48 h-48 md:w-52 md:h-52" />
            ) : (
              <div className="w-48 h-48 md:w-52 md:h-52 bg-neutral-100 rounded-xl animate-pulse" />
            )}
          </Link>
          <p className="mt-4 text-xl font-bold text-prius-black font-display tracking-widest">{reserva.codigo}</p>
          <div className="mt-2">
            <BadgeReserva estado={reserva.estado} />
          </div>
          <p className="mt-3 text-sm text-prius-black/70">
            {etiquetaUnidades(reserva.unidades)}
            <span className="text-prius-black/30"> · </span>
            {resumenFechas(reserva.desde, reserva.hasta)}
          </p>
        </>
      ) : unidad ? (
        <>
          <div className="mx-auto w-48 h-48 md:w-52 md:h-52 rounded-2xl bg-neutral-950 flex flex-col items-center justify-center gap-2 text-white">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold font-display">Tu unidad</span>
            <span className="text-3xl font-bold uppercase font-display tracking-wide">{etiquetaUnidad(unidad)}</span>
            <span className="text-xs text-white/60">{TIPO_ALQUILER_LABEL[unidad.tipo_alquiler] ?? unidad.tipo_alquiler}</span>
          </div>
          <p className="mt-4 text-base font-bold uppercase text-prius-black font-display tracking-wider">
            {etiquetaUnidad(unidad)} · {TIPO_ALQUILER_LABEL[unidad.tipo_alquiler] ?? unidad.tipo_alquiler}
          </p>
          <p className="mt-2 text-xs text-prius-black/60 leading-relaxed max-w-[260px] mx-auto flex items-start justify-center gap-1.5">
            <QrCode size={14} className="shrink-0 mt-px text-gold" />
            {TEXTO_QR_PERSONAL_PRONTO}
          </p>
        </>
      ) : (
        <>
          <div className="mx-auto w-48 h-48 md:w-52 md:h-52 rounded-2xl border border-dashed border-prius-black/15 flex flex-col items-center justify-center gap-3 text-prius-black/40">
            <QrCode size={40} strokeWidth={1.25} />
            <span className="text-xs max-w-[160px] leading-relaxed">Acá aparece el QR de tu próxima reserva</span>
          </div>
          <Link
            to="/#contacto"
            className="mt-5 inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-gold px-6 text-xs font-bold uppercase tracking-wider text-prius-black hover:bg-gold-hover transition-colors font-display shadow-md"
          >
            <CalendarPlus size={14} /> Reservar
          </Link>
        </>
      )}

      <div className="mt-6 pt-5 border-t border-hairline">
        <p data-nombre-cuenta className="text-sm font-semibold text-prius-black truncate">{nombreCompleto(cuenta, sesion)}</p>
        <p className="text-xs text-prius-black/50 truncate">{email}</p>
        {reserva && (
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-prius-black font-display">
            {TEXTO_QR_RECEPCION}
          </p>
        )}
      </div>
    </section>
  )
}
