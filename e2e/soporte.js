import { readFileSync } from 'node:fs'

// Soporte compartido de los specs con sesión y flow simulados (Fase 5B, 6B).
// Nunca se hace un login real de Google acá: se siembra una sesión simulada en el storage de auth-js y se
// interceptan mi_cuenta() y las Edge Functions. La prueba real con una cuenta
// de Google se hace a mano sobre la preview (ver CLAUDE.md).

export const SUPABASE_URL = leerEnv('VITE_SUPABASE_URL')
export const PROJECT_REF = new URL(SUPABASE_URL).hostname.split('.')[0]
export const CLAVE_AUTH = `sb-${PROJECT_REF}-auth-token`
export const CLAVE_FLOW = 'prius_reserva_v1'

export function leerEnv(clave) {
  const archivo = readFileSync(new URL('../.env', import.meta.url), 'utf8')
  const linea = archivo.split('\n').find((l) => l.startsWith(`${clave}=`))
  if (!linea) throw new Error(`Falta ${clave} en .env`)
  return linea.slice(clave.length + 1).trim()
}

// JWT sin firmar: auth-js solo lo decodifica para leer exp/sub, y todas las
// llamadas que lo validarían están interceptadas.
export function jwtFalso(payload) {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
  return `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64(payload)}.firma-de-prueba`
}

export function sesionFalsa({ email, nombreGoogle }) {
  const exp = Math.floor(Date.now() / 1000) + 3600
  const userId = '00000000-0000-4000-8000-000000000001'
  return {
    access_token: jwtFalso({ sub: userId, email, role: 'authenticated', exp, aud: 'authenticated' }),
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: exp,
    refresh_token: 'refresh-de-prueba',
    user: {
      id: userId,
      aud: 'authenticated',
      role: 'authenticated',
      email,
      app_metadata: { provider: 'google', providers: ['google'] },
      user_metadata: { full_name: nombreGoogle, email, email_verified: true },
      created_at: new Date().toISOString(),
    },
  }
}

export const CONFIG = {
  id: true,
  activo: true,
  tipos_alquiler_web: ['dia', 'periodo'],
  hora_corte_noshow: '12:00:00',
  max_unidades_por_reserva: 2,
  max_reservas_activas_por_telefono: 2,
  dias_anticipacion_max: 60,
}

export const UNIDAD = {
  unidad_id: '11111111-1111-4111-8111-111111111111',
  numero: 19,
  tipo: 'carpa',
  fila: 1,
  orden: 19,
  capacidad: 6,
  bloqueada: false,
}

export function flowGuardado(paso) {
  const hoy = new Date()
  const desde = new Date(hoy.getTime() + 7 * 86400000).toISOString().slice(0, 10)
  return {
    v: 1,
    guardadoEn: Date.now(),
    state: {
      paso,
      fechas: { desde, hasta: desde, tipoAlquiler: 'dia' },
      personas: 4,
      unidades: { principal: UNIDAD, sugerida: null },
      datos: { nombre: '', apellido: '', telefono: '', email: '', dni: '' },
      leadId: null,
      metodoPago: null,
      aceptaCondiciones: false,
      estado: 'idle',
      motivoConsulta: null,
    },
  }
}

export const CUENTAS = {
  confirmado: {
    ok: true,
    vinculo: 'confirmado',
    email: 'cliente@example.com',
    cliente: {
      nombre: 'Mariana',
      apellido: 'Gómez',
      telefono: '+5492235765482',
      email: 'cliente@example.com',
      dni_cargado: true,
    },
    unidades_vigentes: [
      { tipo: 'carpa', numero: 19, tipo_alquiler: 'temporada', desde: '2026-12-01', hasta: '2027-03-15' },
    ],
    reservas_web: [],
  },
  ninguno: {
    ok: true,
    vinculo: 'ninguno',
    email: 'nuevo@example.com',
    nombre_google: 'Lucas Fernández',
  },
  pendiente: {
    ok: true,
    vinculo: 'pendiente',
    email: 'pendiente@example.com',
  },
}

// `flow`: flow guardado a restaurar (default: el del Paso `paso` con la
// carpa 19 elegida); `unidades`: respuesta de disponibilidad_publica.
export async function prepararPagina(page, { cuenta, paso = 4, flow = flowGuardado(paso), unidades = [UNIDAD], nombreGoogle }) {
  // Config con reservas activas y una tarifa, como el mock de la Fase 4B.
  // Config fija (no la real): con la sesión simulada supabase-js manda el JWT
  // falso y PostgREST rechaza la lectura, que quedaba en null.
  await page.route('**/rest/v1/config_reservas_publicas**', (route) => {
    const comoObjeto = (route.request().headers()['accept'] ?? '').includes('vnd.pgrst.object')
    return route.fulfill({ status: 200, contentType: 'application/json', json: comoObjeto ? CONFIG : [CONFIG] })
  })
  await page.route('**/rest/v1/rpc/cotizar', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '45000' }),
  )
  await page.route('**/rest/v1/rpc/disponibilidad_publica', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(unidades) }),
  )
  await page.route('**/rest/v1/rpc/mi_cuenta', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(cuenta ?? null) }),
  )
  // El lead de form_abandonado ahora se dispara al tener sesión: no tiene que
  // llegar a la Edge Function real desde un test.
  await page.route('**/functions/v1/lead-reserva', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, lead_id: null }) }),
  )
  // Cualquier validación de token que intente auth-js.
  await page.route('**/auth/v1/user**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(sesionFalsa({ email: cuenta?.email ?? 'x@example.com', nombreGoogle: 'Test' }).user),
    }),
  )

  await page.addInitScript(
    ({ claveAuth, claveFlow, sesion, flow }) => {
      if (sesion) window.localStorage.setItem(claveAuth, JSON.stringify(sesion))
      else window.localStorage.removeItem(claveAuth)
      window.sessionStorage.setItem(claveFlow, JSON.stringify(flow))
    },
    {
      claveAuth: CLAVE_AUTH,
      claveFlow: CLAVE_FLOW,
      sesion: cuenta ? sesionFalsa({ email: cuenta.email, nombreGoogle: nombreGoogle ?? cuenta.nombre_google ?? 'Test' }) : null,
      flow,
    },
  )
}

// Toca una casilla del plano (CeldaClara) como lo haría el cliente.
// - Amplia (≥768): la casilla `compacta` es un <div> clickeable con el botón
//   adentro sin eventos de puntero: se clickea el div.
// - Compacta (mobile): el botón `tactil`. Si la casilla se ve chica, el
//   primer toque acerca ("Tocá de nuevo para elegir") y el segundo elige.
// `celda`: el data-celda ("carpa-19") o un locator ya armado.
export async function tocarCelda(page, celda) {
  const boton =
    typeof celda === 'string' ? page.locator(`[data-panel-reserva] [data-celda="${celda}"]`) : celda
  const amplia = page.viewportSize().width >= 768
  const objetivo = amplia ? boton.locator('xpath=..') : boton
  const estadoAntes = await boton.getAttribute('data-estado')
  await objetivo.click()
  if (amplia) return
  // ZoomPanPinch difiere el tap 260 ms (por si es doble) y anima el zoom.
  await page.waitForTimeout(700)
  if ((await boton.getAttribute('data-estado')) === estadoAntes) {
    await objetivo.click()
    await page.waitForTimeout(400)
  }
}
