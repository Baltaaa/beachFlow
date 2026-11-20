import { BADGE_CONFIRMADA, BADGE_PRECONFIRMADA } from '../../reservas/mensajes'

// Estado de una reserva web con los mismos textos en /r/:codigo y en
// /mi-cuenta (la explicación, en datosCuenta.textoEstadoReserva). Nunca "confirmada" para una reserva sin
// pagar: eso es "Preconfirmada — pagás al llegar".
const BADGE = {
  confirmada: { texto: BADGE_CONFIRMADA, clase: 'bg-green-100 text-green-700' },
  vencida: { texto: 'Vencida', clase: 'bg-neutral-200 text-neutral-600' },
  cancelada: { texto: 'Cancelada', clase: 'bg-neutral-200 text-neutral-600' },
  preconfirmada: { texto: BADGE_PRECONFIRMADA, clase: 'bg-gold/20 text-prius-black' },
}

export function BadgeReserva({ estado }) {
  const { texto, clase } = BADGE[estado] ?? BADGE.preconfirmada
  return (
    <span
      data-badge-reserva={estado}
      className={`inline-block text-[10px] font-bold uppercase tracking-widest font-display px-3 py-1.5 rounded-full ${clase}`}
    >
      {texto}
    </span>
  )
}
