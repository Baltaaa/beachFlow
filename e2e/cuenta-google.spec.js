import { test, expect } from '@playwright/test'
import { CLAVE_AUTH, CLAVE_FLOW, CUENTAS, UNIDAD, prepararPagina } from './soporte'

// Fase 5B — login con Google en el Paso 4. Helpers compartidos (sesión
// simulada, flow guardado, mocks) en ./soporte.js.

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

// Bug de la prueba real con la cuenta B: alta con el teléfono de otro cliente,
// "Cargando…" y de vuelta al mismo form, en bucle. La respuesta de
// completar_cuenta() es la cuenta nueva: se usa directo, sin volver a pedir
// mi_cuenta() ni redibujar el form en silencio.
async function prepararAlta(page, respuestaCompletar) {
  await prepararPagina(page, { cuenta: CUENTAS.ninguno })
  const llamadas = { miCuenta: 0, completar: [], leads: [] }
  // Las rutas registradas después tienen prioridad sobre las de prepararPagina.
  await page.route('**/rest/v1/rpc/mi_cuenta', (route) => {
    llamadas.miCuenta += 1
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CUENTAS.ninguno) })
  })
  await page.route('**/rest/v1/rpc/completar_cuenta', (route) => {
    llamadas.completar.push(route.request().postDataJSON())
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(respuestaCompletar) })
  })
  await page.route('**/functions/v1/lead-reserva', (route) => {
    llamadas.leads.push(route.request().postDataJSON())
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, lead_id: null }) })
  })
  const avisosTurnstile = []
  page.on('console', (m) => {
    if (/Turnstile has not been loaded/i.test(m.text())) avisosTurnstile.push(m.text())
  })

  await page.goto('/?reserva=continuar')
  await expect(page.getByText('PASO 4 DE 6')).toBeVisible({ timeout: 10000 })
  await expect(page.locator('input[type="text"]').first()).toHaveValue('Lucas')

  // Los datos de la prueba real: el teléfono es el del cliente A.
  await page.locator('input[type="tel"]').fill('+5492235000001')
  await page.locator('input[inputmode="numeric"]').fill('44123457')
  return { llamadas, avisosTurnstile }
}

const continuar = (page) => page.getByRole('button', { name: 'Continuar', exact: true })

test('alta → pendiente: mensaje de pendiente y sigue al Paso 5', async ({ page }) => {
  const { llamadas, avisosTurnstile } = await prepararAlta(page, CUENTAS.pendiente)
  await continuar(page).click()

  await expect(page.getByText('Encontramos un registro con esos datos', { exact: false })).toBeVisible()
  await expect(page.locator('input:not([type="hidden"])')).toHaveCount(0)
  expect(llamadas.completar).toHaveLength(1)
  expect(llamadas.completar[0]).toEqual({
    p: { nombre: 'Lucas', apellido: 'Fernández', telefono_e164: '+5492235000001', dni: '44123457' },
  })

  await continuar(page).click()
  await expect(page.getByText('PASO 5 DE 6')).toBeVisible()

  // Turnstile: el lead salió con un token (el widget estaba montado) y nunca
  // se le pidió nada a un widget sin cargar.
  await expect.poll(() => llamadas.leads.length, { timeout: 20000 }).toBeGreaterThan(0)
  expect(llamadas.leads[0].turnstile_token).toBeTruthy()

  // Y crear-reserva-publica también sale con token: el widget se reseteó
  // después del lead y se volvió a ejecutar. (La clave de prueba de
  // Cloudflare devuelve siempre el mismo token dummy: no se compara.)
  const reservas = []
  await page.route('**/functions/v1/crear-reserva-publica', (route) => {
    reservas.push(route.request().postDataJSON())
    return route.fulfill({
      status: 429,
      contentType: 'application/json',
      body: JSON.stringify({ ok: false, error: 'rate_limited' }),
    })
  })
  await page.locator('input[type="checkbox"]').check()
  await page.getByRole('button', { name: /Confirmar Reserva/i }).click()
  await expect(page.getByText('Probá de nuevo en unos minutos.')).toBeVisible({ timeout: 20000 })
  expect(reservas).toHaveLength(1)
  expect(reservas[0].turnstile_token).toBeTruthy()
  expect(avisosTurnstile).toEqual([])
})

test('alta → respuesta de completar_cuenta usada directo, sin volver al form', async ({ page }) => {
  const { llamadas } = await prepararAlta(page, {
    ...CUENTAS.confirmado,
    email: 'nuevo@example.com',
    cliente: { ...CUENTAS.confirmado.cliente, nombre: 'Lucas', apellido: 'Fernández', email: 'nuevo@example.com' },
    unidades_vigentes: [],
  })
  const miCuentaAntes = llamadas.miCuenta
  await continuar(page).click()

  await expect(page.getByText('Hola, Lucas')).toBeVisible()
  await expect(page.getByText('Completá tus datos')).toHaveCount(0)
  await expect(page.getByText('Cargando…')).toHaveCount(0)
  // No se volvió a pedir mi_cuenta(): la caché se reemplazó con la respuesta.
  expect(llamadas.miCuenta).toBe(miCuentaAntes)

  await continuar(page).click()
  await expect(page.getByText('PASO 5 DE 6')).toBeVisible()
})

test('alta → completar_cuenta sigue en "ninguno" (conflicto): avisa, no vuelve en silencio', async ({ page }) => {
  await prepararAlta(page, CUENTAS.ninguno)
  await continuar(page).click()

  await expect(
    page.getByText('No pudimos vincular tu cuenta con esos datos. Escribinos por WhatsApp y te ayudamos.'),
  ).toBeVisible()
  // Lo cargado sigue ahí.
  await expect(page.locator('input[type="tel"]')).toHaveValue('+5492235000001')
  await expect(continuar(page)).toBeEnabled()
})

for (const { error, respuesta, texto } of [
  {
    error: 'datos_invalidos',
    respuesta: { ok: false, error: 'datos_invalidos', campos: { telefono_e164: 'El teléfono no es válido' } },
    texto: 'Revisá los datos ingresados.',
  },
  {
    error: 'rate_limited',
    respuesta: { ok: false, error: 'rate_limited', mensaje: 'Demasiados intentos. Esperá un momento y probá de nuevo.' },
    texto: 'Demasiados intentos. Esperá un momento y probá de nuevo.',
  },
  {
    error: 'cuenta_personal',
    respuesta: {
      ok: false,
      error: 'cuenta_personal',
      mensaje: 'Esta cuenta es del personal del balneario: no se vincula como cliente.',
    },
    texto: 'Esta cuenta es del personal del balneario: no se vincula como cliente.',
  },
  {
    error: 'sin_email',
    respuesta: { ok: false, error: 'sin_email' },
    texto: 'Tu cuenta de Google no tiene un email asociado. Probá con otra cuenta.',
  },
]) {
  test(`alta → ok:false ${error}: muestra el error y no vuelve en silencio`, async ({ page }) => {
    await prepararAlta(page, respuesta)
    await continuar(page).click()

    await expect(page.getByText(texto, { exact: true })).toBeVisible()
    if (error === 'datos_invalidos') await expect(page.getByText('El teléfono no es válido')).toBeVisible()
    await expect(page.getByText('Completá tus datos')).toBeVisible()
    await expect(page.locator('input[type="tel"]')).toHaveValue('+5492235000001')
    await expect(continuar(page)).toBeEnabled()
  })
}
