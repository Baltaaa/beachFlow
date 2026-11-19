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

// Parámetros con los que Supabase/Google devuelven un login fallido. Llegan
// duplicados en la query y en el fragmento: ?error=...&error_code=...#error=...
const PARAMS_ERROR_OAUTH = ['error', 'error_code', 'error_description']

/**
 * ¿La vuelta de Google trajo un error? Lee query y hash (el que tenga datos).
 * Devuelve { error, codigo, descripcion } o null.
 */
export function leerErrorOAuth() {
  try {
    const query = new URLSearchParams(window.location.search)
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const leer = (clave) => query.get(clave) || hash.get(clave) || null
    const error = leer('error')
    const codigo = leer('error_code')
    const descripcion = leer('error_description')
    if (!error && !codigo && !descripcion) return null
    return { error, codigo, descripcion }
  } catch {
    return null
  }
}

/**
 * ¿La URL actual es la vuelta de un login de Google con un flow guardado?
 * Cuenta también un error de OAuth sin ?reserva=continuar: si Supabase no
 * respetó el redirectTo, el flow guardado igual se tiene que restaurar.
 */
export function hayQueContinuar() {
  try {
    const params = new URLSearchParams(window.location.search)
    const esRetorno = params.get(PARAM_CONTINUAR) === VALOR_CONTINUAR || leerErrorOAuth() !== null
    return esRetorno && leerFlow() !== null
  } catch {
    return false
  }
}

/**
 * Saca de la URL todo lo que dejó la vuelta de Google (?reserva=continuar,
 * error, error_code, error_description y el fragmento con el error) sin
 * recargar ni ensuciar el historial. Así un refresh no reabre el flujo ni
 * repite el mensaje de error.
 */
export function limpiarUrlRetorno() {
  try {
    const url = new URL(window.location.href)
    const hash = new URLSearchParams(url.hash.replace(/^#/, ''))
    const hashConError = PARAMS_ERROR_OAUTH.some((clave) => hash.has(clave))
    const queryConRetorno = [PARAM_CONTINUAR, ...PARAMS_ERROR_OAUTH].some((clave) =>
      url.searchParams.has(clave),
    )
    if (!hashConError && !queryConRetorno) return
    for (const clave of [PARAM_CONTINUAR, ...PARAMS_ERROR_OAUTH]) url.searchParams.delete(clave)
    const query = url.searchParams.toString()
    const fragmento = hashConError ? '' : url.hash
    window.history.replaceState({}, '', `${url.pathname}${query ? `?${query}` : ''}${fragmento}`)
  } catch {
    // nada que hacer
  }
}

/** URL a la que Google tiene que devolver al cliente. */
export function urlDeRetorno() {
  return `${window.location.origin}/?${PARAM_CONTINUAR}=${VALOR_CONTINUAR}`
}
