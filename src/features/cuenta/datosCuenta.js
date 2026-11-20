import { MENSAJE_PRECONFIRMADA_PASO6, MENSAJE_VENCIDA } from '../reservas/mensajes'
import { resumenFechas } from '../reservas/fechas'

// Lo que el navbar (y /mi-cuenta) muestran de la cuenta, derivado de la
// sesión de Supabase y de mi_cuenta(). Funciones puras: se testean en
// datosCuenta.test.js.

export const CUENTA_PENDIENTE_NAVBAR = 'Tu cuenta se confirma en recepción'

const TIPO_LABEL = { carpa: 'Carpa', sombrilla: 'Sombrilla' }

function primeraPalabra(texto) {
  return (texto ?? '').trim().split(/\s+/)[0] || ''
}

/** Foto de Google (avatar_url o picture), o null. */
export function avatarDe(sesion) {
  const meta = sesion?.user?.user_metadata ?? {}
  return meta.avatar_url || meta.picture || null
}

/**
 * Nombre corto para el chip. Con vínculo confirmado, el nombre del cliente;
 * si no, el de Google (nunca datos de un cliente existente para una cuenta
 * pendiente); último recurso, la parte local del email.
 */
export function nombreCorto(cuenta, sesion) {
  if (cuenta?.vinculo === 'confirmado' && cuenta.cliente?.nombre) return primeraPalabra(cuenta.cliente.nombre)
  const meta = sesion?.user?.user_metadata ?? {}
  const google = meta.given_name || meta.full_name || meta.name || cuenta?.nombre_google
  if (google) return primeraPalabra(google)
  const email = cuenta?.email || sesion?.user?.email || ''
  return email.split('@')[0] || ''
}

/** Nombre completo para el encabezado del menú. */
export function nombreCompleto(cuenta, sesion) {
  if (cuenta?.vinculo === 'confirmado' && cuenta.cliente) {
    const completo = `${cuenta.cliente.nombre ?? ''} ${cuenta.cliente.apellido ?? ''}`.trim()
    if (completo) return completo
  }
  const meta = sesion?.user?.user_metadata ?? {}
  return meta.full_name || meta.name || cuenta?.nombre_google || nombreCorto(cuenta, sesion)
}

/**
 * La unidad vigente HOY (desde ≤ hoy ≤ hasta), de cualquier tipo, con
 * prioridad temporada. null si hoy no tiene ninguna.
 */
export function unidadDeHoy(unidades, hoyISO) {
  const deHoy = (unidades ?? []).filter((u) => u.desde <= hoyISO && hoyISO <= u.hasta)
  if (!deHoy.length) return null
  return deHoy.find((u) => u.tipo_alquiler === 'temporada') ?? deHoy[0]
}

export function etiquetaUnidad(unidad) {
  if (!unidad) return ''
  return `${TIPO_LABEL[unidad.tipo] ?? unidad.tipo} ${unidad.numero}`
}

/** "Balta · Carpa 133", o solo "Balta" sin unidad hoy. */
export function textoChip(cuenta, sesion, hoyISO) {
  const nombre = nombreCorto(cuenta, sesion)
  const unidad = cuenta?.vinculo === 'confirmado' ? unidadDeHoy(cuenta.unidades_vigentes, hoyISO) : null
  return unidad ? `${nombre} · ${etiquetaUnidad(unidad)}` : nombre
}

// ── /mi-cuenta (Fase 6B, Tarea 5) ─────────────────────────────────────────
// Todo sale de mi_cuenta(): reservas_web ({ codigo, estado, unidades:[{tipo,
// numero}], desde, hasta, total, saldo }) y, solo con vínculo confirmado,
// unidades_vigentes ({ tipo, numero, tipo_alquiler, desde, hasta }).

export const TIPO_ALQUILER_LABEL = { dia: 'Por día', periodo: 'Período', temporada: 'Temporada' }

/** Estados de reservas_web que todavía valen (las mismas del QR de /r/). */
export function reservaActiva(reserva) {
  return reserva?.estado === 'preconfirmada' || reserva?.estado === 'confirmada'
}

/** "Carpa 19 + Carpa 20". */
export function etiquetaUnidades(unidades) {
  return (unidades ?? []).map(etiquetaUnidad).join(' + ')
}

/**
 * La reserva web del QR: la activa que está en curso hoy o, si no, la próxima.
 * null si no tiene ninguna activa que termine hoy o después.
 */
export function reservaParaQR(reservas, hoyISO) {
  const vigentes = (reservas ?? []).filter((r) => reservaActiva(r) && r.hasta >= hoyISO)
  if (!vigentes.length) return null
  return [...vigentes].sort((a, b) => (a.desde < b.desde ? -1 : a.desde > b.desde ? 1 : 0))[0]
}

/** Reservas web activas que incluyen hoy. */
export function reservasDeHoy(reservas, hoyISO) {
  return (reservas ?? []).filter((r) => reservaActiva(r) && r.desde <= hoyISO && hoyISO <= r.hasta)
}

/**
 * Unidades vigentes hoy (temporada primero) que no son ya una reserva web de
 * hoy (una reserva web confirmada también aparece en unidades_vigentes).
 */
export function unidadesDeHoy(unidades, hoyISO, reservasHoy = []) {
  const deReservas = new Set(reservasHoy.flatMap((r) => (r.unidades ?? []).map((u) => `${u.tipo}:${u.numero}`)))
  return (unidades ?? [])
    .filter((u) => u.desde <= hoyISO && hoyISO <= u.hasta && !deReservas.has(`${u.tipo}:${u.numero}`))
    .sort((a, b) => (a.tipo_alquiler === 'temporada' ? -1 : 0) - (b.tipo_alquiler === 'temporada' ? -1 : 0))
}

/**
 * Unidad para la tarjeta sin QR (cuenta sin reserva web vigente): la de hoy
 * con prioridad temporada o, si no, la primera vigente (temporada primero).
 * Solo con vínculo confirmado: nada del cliente para una cuenta pendiente.
 */
export function unidadParaTarjeta(cuenta, hoyISO) {
  if (cuenta?.vinculo !== 'confirmado') return null
  const unidades = cuenta.unidades_vigentes ?? []
  return unidadDeHoy(unidades, hoyISO) ?? unidades.find((u) => u.tipo_alquiler === 'temporada') ?? unidades[0] ?? null
}

/**
 * Explicación del estado de una reserva web, la misma en /r/ y en /mi-cuenta
 * (o null si no hace falta, ej. confirmada).
 */
export function textoEstadoReserva(reserva, config) {
  if (!reserva) return null
  if (reserva.estado === 'vencida') return MENSAJE_VENCIDA
  if (reserva.estado === 'cancelada') return 'Esta reserva fue cancelada.'
  if (reserva.estado === 'preconfirmada') {
    const hora = config?.hora_corte_noshow?.slice(0, 5) ?? '12:00'
    const dia = reserva.desde ? resumenFechas(reserva.desde, reserva.desde).split(' · ')[0] : ''
    return MENSAJE_PRECONFIRMADA_PASO6(hora, dia)
  }
  return null
}
