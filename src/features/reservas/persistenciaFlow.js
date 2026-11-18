// Persistencia del flujo de reserva durante el redirect de OAuth (Fase 5B).
// El login con Google saca al cliente de la landing y lo trae de vuelta con
// una recarga completa de la página: sin esto se pierde todo lo que cargó en
// los pasos 2 a 4. Clave única y versionada; todo con try/catch porque
// sessionStorage tira en modo privado de algunos browsers y con cookies de
// terceros bloqueadas.

export const CLAVE_FLOW = 'prius_reserva_v1'
export const PARAM_CONTINUAR = 'reserva'
export const VALOR_CONTINUAR = 'continuar'

// Un ida y vuelta por Google son segundos. Más de una hora es un flow
// abandonado: mejor arrancar limpio que revivir fechas viejas.
const TTL_MS = 60 * 60 * 1000

// Qué se guarda: todo el estado del flow menos `resultado` (una reserva ya
// creada no se restaura nunca) y menos los avisos efímeros.
function serializable(state) {
  return {
    paso: state.paso,
    fechas: state.fechas,
    personas: state.personas,
    unidades: state.unidades,
    datos: state.datos,
    leadId: state.leadId,
    metodoPago: state.metodoPago,
    aceptaCondiciones: state.aceptaCondiciones,
    estado: state.estado,
    motivoConsulta: state.motivoConsulta,
  }
}

export function guardarFlow(state) {
  try {
    sessionStorage.setItem(
      CLAVE_FLOW,
      JSON.stringify({ v: 1, guardadoEn: Date.now(), state: serializable(state) }),
    )
    return true
  } catch {
    // Sin sessionStorage el login igual funciona: el cliente vuelve al
    // cotizador desde cero en vez de a su paso 4.
    return false
  }
}

export function leerFlow() {
  try {
    const crudo = sessionStorage.getItem(CLAVE_FLOW)
    if (!crudo) return null
    const guardado = JSON.parse(crudo)
    if (guardado?.v !== 1 || !guardado.state) return null
    if (Date.now() - (guardado.guardadoEn ?? 0) > TTL_MS) {
      limpiarFlow()
      return null
    }
    return guardado.state
  } catch {
    return null
  }
}

export function limpiarFlow() {
  try {
    sessionStorage.removeItem(CLAVE_FLOW)
  } catch {
    // nada que hacer
  }
}

/** ¿La URL actual es la vuelta de un login de Google con un flow guardado? */
export function hayQueContinuar() {
  try {
    const params = new URLSearchParams(window.location.search)
    return params.get(PARAM_CONTINUAR) === VALOR_CONTINUAR && leerFlow() !== null
  } catch {
    return false
  }
}

/** Saca ?reserva=continuar de la URL sin recargar ni ensuciar el historial. */
export function limpiarParamContinuar() {
  try {
    const url = new URL(window.location.href)
    if (!url.searchParams.has(PARAM_CONTINUAR)) return
    url.searchParams.delete(PARAM_CONTINUAR)
    const query = url.searchParams.toString()
    window.history.replaceState({}, '', `${url.pathname}${query ? `?${query}` : ''}${url.hash}`)
  } catch {
    // nada que hacer
  }
}

/** URL a la que Google tiene que devolver al cliente. */
export function urlDeRetorno() {
  return `${window.location.origin}/?${PARAM_CONTINUAR}=${VALOR_CONTINUAR}`
}
