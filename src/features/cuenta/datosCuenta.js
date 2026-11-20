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
