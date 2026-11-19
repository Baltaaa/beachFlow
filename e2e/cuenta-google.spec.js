import { readFileSync } from 'node:fs'
import { test, expect } from '@playwright/test'

// Fase 5B — login con Google en el Paso 4. Nunca se hace un login real de
// Google acá: se siembra una sesión simulada en el storage de auth-js y se
// interceptan mi_cuenta() y las Edge Functions. La prueba real con una cuenta
// de Google se hace a mano sobre la preview (ver CLAUDE.md).

const SUPABASE_URL = leerEnv('VITE_SUPABASE_URL')
const PROJECT_REF = new URL(SUPABASE_URL).hostname.split('.')[0]
const CLAVE_AUTH = `sb-${PROJECT_REF}-auth-token`
const CLAVE_FLOW = 'prius_reserva_v1'

function leerEnv(clave) {
  const archivo = readFileSync(new URL('../.env', import.meta.url), 'utf8')
  const linea = archivo.split('\n').find((l) => l.startsWith(`${clave}=`))
  if (!linea) throw new Error(`Falta ${clave} en .env`)
  return linea.slice(clave.length + 1).trim()
}

// JWT sin firmar: auth-js solo lo decodifica para leer exp/sub, y todas las
// llamadas que lo validarían están interceptadas.
function jwtFalso(payload) {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
  return `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64(payload)}.firma-de-prueba`
}

function sesionFalsa({ email, nombreGoogle }) {
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

const UNIDAD = {
  unidad_id: '11111111-1111-4111-8111-111111111111',
  numero: 19,
  tipo: 'carpa',
  fila: 1,
  orden: 19,
  capacidad: 6,
  bloqueada: false,
}

function flowGuardado(paso) {
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

const CUENTAS = {
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

async function prepararPagina(page, { cuenta, paso = 4 }) {
  // Config con reservas activas y una tarifa, como el mock de la Fase 4B.
  await page.route('**/rest/v1/config_reservas_publicas**', async (route) => {
    const res = await route.fetch()
    const body = await res.json()
    const mocked = Array.isArray(body) ? body.map((r) => ({ ...r, activo: true })) : { ...body, activo: true }
    await route.fulfill({ response: res, json: mocked })
  })
  await page.route('**/rest/v1/rpc/cotizar', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '45000' }),
  )
  await page.route('**/rest/v1/rpc/disponibilidad_publica', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([UNIDAD]) }),
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
      sesion: cuenta ? sesionFalsa({ email: cuenta.email, nombreGoogle: cuenta.nombre_google ?? 'Test' }) : null,
      flow: flowGuardado(paso),
    },
  )
}

for (const [nombre, cuenta] of [
  ['sin-sesion', null],
  ['confirmado', CUENTAS.confirmado],
  ['ninguno', CUENTAS.ninguno],
  ['pendiente', CUENTAS.pendiente],
]) {
  test(`Paso 4 — estado ${nombre}`, async ({ page }, testInfo) => {
    await prepararPagina(page, { cuenta })
    await page.goto('/?reserva=continuar')

    await expect(page.getByText('PASO 4 DE 6')).toBeVisible({ timeout: 10000 })

    if (nombre === 'sin-sesion') {
      await expect(page.getByRole('button', { name: /Continuar con Google/i })).toBeVisible()
      await expect(
        page.getByText('Para reservar y pagar necesitamos identificarte', { exact: false }),
      ).toBeVisible()
      await expect(page.getByText('Usamos tu nombre y email de Google', { exact: false })).toBeVisible()
      // Sin sesión no se ve ningún campo de datos.
      await expect(page.locator('input:not([type="hidden"])')).toHaveCount(0)
    }

    if (nombre === 'confirmado') {
      await expect(page.getByText('Hola, Mariana')).toBeVisible()
      await expect(page.getByText('Tu unidad esta temporada: Carpa 19')).toBeVisible()
      await expect(page.getByText('Conectado como cliente@example.com')).toBeVisible()
      await expect(page.getByRole('link', { name: /Algún dato está mal/i })).toBeVisible()
      // La web nunca edita los datos de un cliente existente.
      // (se excluye el input oculto que monta Turnstile)
      await expect(page.locator('input:not([disabled]):not([type="hidden"])')).toHaveCount(0)
    }

    if (nombre === 'ninguno') {
      // Nombre y apellido precargados desde Google.
      await expect(page.locator('input[type="text"]').first()).toHaveValue('Lucas')
      await expect(page.locator('input[type="text"]').nth(1)).toHaveValue('Fernández')
      // El email de Google se muestra pero no se edita.
      const email = page.locator('input[type="email"]')
      await expect(email).toHaveValue('nuevo@example.com')
      await expect(email).toBeDisabled()
    }

    if (nombre === 'pendiente') {
      await expect(page.getByText('Encontramos un registro con esos datos', { exact: false })).toBeVisible()
      await expect(page.getByText('Conectado como pendiente@example.com')).toBeVisible()
      await expect(page.locator('input:not([type="hidden"])')).toHaveCount(0)
    }

    // Siempre: la opción de cambiar de cuenta cuando hay sesión.
    if (cuenta) await expect(page.getByRole('button', { name: /Cambiar cuenta/i })).toBeVisible()

    await page.screenshot({
      path: `test-results/paso4-${nombre}-${testInfo.project.name}.png`,
      fullPage: false,
    })
  })
}

test('el flow sobrevive a una recarga completa con ?reserva=continuar', async ({ page }) => {
  // Restaurado en el Paso 5: es el único que muestra fechas, personas, unidad
  // y contacto juntos, así que sirve de prueba de que no se perdió nada.
  await prepararPagina(page, { cuenta: CUENTAS.confirmado, paso: 5 })
  await page.goto('/?reserva=continuar')

  await expect(page.getByText('PASO 5 DE 6')).toBeVisible({ timeout: 10000 })
  await expect(page.getByText('Carpa 19')).toBeVisible()
  await expect(page.getByText('Mariana Gómez')).toBeVisible()
  await expect(page.getByText('4', { exact: true })).toBeVisible()

  // El parámetro se limpia de la URL para que un refresh no reabra el flujo.
  await expect.poll(() => new URL(page.url()).searchParams.get('reserva')).toBeNull()
})

// Bug de la prueba real: Google/Supabase vuelven con el error en la query y
// en el fragmento, y el Paso 4 quedaba mudo con la URL sucia.
for (const { nombre, error, codigo, descripcion, mensaje } of [
  {
    nombre: 'signup_disabled',
    error: 'access_denied',
    codigo: 'signup_disabled',
    descripcion: 'Signups not allowed for this instance',
    mensaje: 'No pudimos crear tu cuenta en este momento. Escribinos por WhatsApp y te ayudamos.',
  },
  {
    nombre: 'cancelado',
    error: 'access_denied',
    codigo: null,
    descripcion: 'The user denied the request',
    mensaje: 'Cancelaste el inicio de sesión con Google. Podés intentarlo de nuevo.',
  },
  {
    nombre: 'otro',
    error: 'server_error',
    codigo: 'unexpected_failure',
    descripcion: 'Unable to exchange external code',
    mensaje: 'No pudimos iniciar sesión con Google. Probá de nuevo.',
  },
]) {
  test(`vuelta de Google con error ${nombre}: aviso en el Paso 4 y URL limpia`, async ({ page }) => {
    await prepararPagina(page, { cuenta: null })
    const params = new URLSearchParams({ error, error_description: descripcion })
    if (codigo) params.set('error_code', codigo)
    await page.goto(`/?reserva=continuar&${params}#${params}`)

    // El flow guardado se restaura en el Paso 4 con el mensaje a la vista.
    await expect(page.getByText('PASO 4 DE 6')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(mensaje, { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: /Continuar con Google/i })).toBeVisible()

    // Ni query ni fragmento: un refresh no repite el error ni reabre el flujo.
    await expect.poll(() => new URL(page.url()).search).toBe('')
    await expect.poll(() => new URL(page.url()).hash).toBe('')

    // El flow restaurado sigue entero: volver lleva al plano con la unidad.
    await page.getByRole('button', { name: 'Volver', exact: true }).click()
    await expect(page.getByText('PASO 3 DE 6')).toBeVisible()
  })
}
