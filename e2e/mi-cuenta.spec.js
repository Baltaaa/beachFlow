import { test, expect } from '@playwright/test'
import { CUENTAS, prepararPagina } from './soporte'

// Fase 6B, Tareas 5 y 6 — /mi-cuenta con sus tabs y la redirección de
// /r/:codigo. Sesión y mi_cuenta() simulados (ver soporte.js): confirmado con
// unidad, confirmado sin unidad, pendiente y sin sesión. Las fechas se arman
// alrededor de HOY (Argentina) para que "Hoy" tenga sentido cualquier día.

test.describe.configure({ retries: 1 })

const hoyAR = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())
const masDias = (iso, n) => {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}
const HOY = hoyAR()

const reserva = (codigo, estado, desde, hasta = desde, numero = 19) => ({
  codigo,
  estado,
  unidades: [{ tipo: 'carpa', numero }],
  desde,
  hasta,
  total: 45000,
  saldo: estado === 'confirmada' ? 0 : 45000,
})

const RESERVA_PROXIMA = reserva('PRIUS-A3X9K2', 'preconfirmada', masDias(HOY, 7))
const RESERVA_VENCIDA = reserva('PRIUS-B7Y4M8', 'vencida', masDias(HOY, -20))
const RESERVA_HOY = reserva('PRIUS-C2D3E4', 'preconfirmada', HOY, HOY, 44)
const TEMPORADA = { tipo: 'carpa', numero: 133, tipo_alquiler: 'temporada', desde: masDias(HOY, -10), hasta: masDias(HOY, 100) }

const CASOS = {
  // Confirmado con unidad de temporada vigente y reservas web.
  'confirmado-con-unidad': {
    ...CUENTAS.confirmado,
    unidades_vigentes: [TEMPORADA],
    reservas_web: [RESERVA_PROXIMA, RESERVA_VENCIDA],
  },
  // Confirmado sin unidad y sin reservas web.
  'confirmado-sin-unidad': { ...CUENTAS.confirmado, unidades_vigentes: [], reservas_web: [] },
  // Pendiente con una reserva web de hoy (hecha con esta cuenta).
  pendiente: { ...CUENTAS.pendiente, reservas_web: [RESERVA_HOY] },
}

const TABS = ['hoy', 'unidad', 'reservas', 'pedidos', 'actividades']

async function abrir(page, ruta) {
  await page.goto(ruta)
  await expect(page.getByRole('heading', { name: 'Todo lo tuyo, en un lugar' })).toBeVisible()
}

for (const [caso, cuenta] of Object.entries(CASOS)) {
  test(`/mi-cuenta ${caso}: cada tab`, async ({ page }, testInfo) => {
    test.setTimeout(60000)
    const errores = []
    page.on('pageerror', (e) => errores.push(e.message))
    let lecturas = 0
    await prepararPagina(page, { cuenta, nombreGoogle: caso === 'pendiente' ? 'Lucía Pérez' : 'Mariana Gómez' })
    page.on('request', (r) => {
      if (r.url().includes('/rpc/mi_cuenta')) lecturas++
    })

    await abrir(page, '/mi-cuenta')
    await expect(page).toHaveURL(/\/mi-cuenta\/hoy$/)
    // Se refresca al entrar a la sección (y una sola vez: el store comparte).
    await expect.poll(() => lecturas).toBeGreaterThanOrEqual(1)

    const tarjeta = page.locator('[data-tarjeta-qr]')
    if (caso === 'confirmado-con-unidad') {
      await expect(tarjeta).toHaveAttribute('data-tarjeta-qr', 'reserva')
      await expect(tarjeta).toContainText('PRIUS-A3X9K2')
      await expect(tarjeta).toContainText('Mostrá este QR en recepción')
      await expect(tarjeta.getByRole('img', { name: 'QR de la reserva PRIUS-A3X9K2' })).toBeVisible()
      await expect(tarjeta.locator('[data-nombre-cuenta]')).toHaveText('Mariana Gómez')
    } else if (caso === 'confirmado-sin-unidad') {
      await expect(tarjeta).toHaveAttribute('data-tarjeta-qr', 'vacia')
      await expect(tarjeta.getByRole('link', { name: 'Reservar' })).toBeVisible()
    } else {
      await expect(tarjeta).toHaveAttribute('data-tarjeta-qr', 'reserva')
      await expect(tarjeta).toContainText('PRIUS-C2D3E4')
      // Nada del cliente existente: el nombre es el de Google.
      await expect(tarjeta.locator('[data-nombre-cuenta]')).toHaveText('Lucía Pérez')
      await expect(page.locator('[data-aviso-pendiente]')).toContainText('Tu cuenta se confirma en recepción')
    }

    for (const tab of TABS) {
      await page.getByRole('navigation', { name: 'Secciones de tu cuenta' }).getByRole('link').nth(TABS.indexOf(tab)).click()
      await expect(page).toHaveURL(new RegExp(`/mi-cuenta/${tab}$`))
      const contenido = page.locator('main')
      if (tab === 'hoy') {
        if (caso === 'confirmado-con-unidad') {
          await expect(contenido.locator('[data-unidad="carpa-133"]')).toContainText('Temporada')
          await expect(contenido.locator('[data-reserva]')).toHaveCount(0)
        } else if (caso === 'confirmado-sin-unidad') {
          await expect(contenido.getByText('No tenés nada para hoy')).toBeVisible()
        } else {
          await expect(contenido.locator('[data-reserva="PRIUS-C2D3E4"]')).toBeVisible()
        }
      }
      if (tab === 'unidad') {
        if (caso === 'confirmado-con-unidad') await expect(contenido.locator('[data-unidad="carpa-133"]')).toBeVisible()
        else if (caso === 'pendiente') await expect(contenido.getByText('Cuando confirmemos tu cuenta en recepción')).toBeVisible()
        else await expect(contenido.getByText('No tenés una unidad asignada por ahora.')).toBeVisible()
      }
      if (tab === 'reservas') {
        const filas = contenido.locator('[data-reserva]')
        await expect(filas).toHaveCount(cuenta.reservas_web.length)
        if (caso === 'confirmado-con-unidad') {
          await expect(filas.first()).toContainText('Preconfirmada — pagás al llegar')
          await expect(filas.nth(1)).toContainText('Vencida')
          await expect(filas.first()).toContainText('Saldo $ 45.000')
        }
      }
      if (tab === 'pedidos') {
        await expect(contenido.getByText('Próximamente: vas a poder pedir del café y el mercado de playa desde tu carpa')).toBeVisible()
      }
      if (tab === 'actividades') {
        await expect(contenido.getByText('Próximamente: actividades recreativas del balneario')).toBeVisible()
      }
      await page.waitForTimeout(150)
      await page.screenshot({ path: `test-results/mi-cuenta-${testInfo.project.name}-${caso}-${tab}.png`, fullPage: true })
    }

    // Detalle de una reserva con su QR.
    if (cuenta.reservas_web.length) {
      const codigo = cuenta.reservas_web[0].codigo
      await page.getByRole('navigation', { name: 'Secciones de tu cuenta' }).getByRole('link', { name: 'Reservas' }).click()
      await page.locator(`[data-reserva="${codigo}"]`).click()
      await expect(page).toHaveURL(new RegExp(`/mi-cuenta/reservas/${codigo}$`))
      const detalle = page.locator(`[data-detalle-reserva="${codigo}"]`)
      await expect(detalle.getByRole('img', { name: `QR de la reserva ${codigo}` })).toBeVisible()
      await expect(detalle.getByRole('link', { name: 'Descargar QR' })).toBeVisible()
      await page.screenshot({ path: `test-results/mi-cuenta-${testInfo.project.name}-${caso}-detalle.png`, fullPage: true })
    }

    // Una sola lectura de mi_cuenta() aunque se navegó por todas las tabs.
    expect(lecturas).toBe(1)
    expect(errores).toEqual([])
  })
}

test('/mi-cuenta confirmado con unidad y sin reservas web: la tarjeta muestra la unidad sin QR', async ({ page }, testInfo) => {
  await prepararPagina(page, { cuenta: { ...CUENTAS.confirmado, unidades_vigentes: [TEMPORADA], reservas_web: [] } })
  await abrir(page, '/mi-cuenta/unidad')
  const tarjeta = page.locator('[data-tarjeta-qr]')
  await expect(tarjeta).toHaveAttribute('data-tarjeta-qr', 'unidad')
  await expect(tarjeta).toContainText('Carpa 133 · Temporada')
  await expect(tarjeta).toContainText('Tu QR personal para pedidos y actividades llega pronto')
  await expect(tarjeta.getByRole('img')).toHaveCount(0)
  await page.screenshot({ path: `test-results/mi-cuenta-${testInfo.project.name}-unidad-sin-qr.png`, fullPage: true })
})

test('/mi-cuenta sin sesión: "Ingresá con Google" y vuelve a la misma pestaña', async ({ page }, testInfo) => {
  await prepararPagina(page, { cuenta: null })
  let destino = null
  await page.route('**/auth/v1/authorize**', (route) => {
    destino = new URL(route.request().url()).searchParams.get('redirect_to')
    return route.fulfill({ status: 200, contentType: 'text/html', body: '<p>google</p>' })
  })
  await abrir(page, '/mi-cuenta/reservas')
  await expect(page.locator('[data-ingresar-cuenta]')).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Secciones de tu cuenta' })).toHaveCount(0)
  await page.screenshot({ path: `test-results/mi-cuenta-${testInfo.project.name}-sin-sesion.png`, fullPage: true })
  const origen = new URL(page.url()).origin
  await page.getByRole('button', { name: /Continuar con Google/ }).click()
  await expect.poll(() => destino).toBe(`${origen}/mi-cuenta/reservas`)
})

test('menú del navbar: "Mis reservas" lleva a /mi-cuenta/reservas', async ({ page }) => {
  await prepararPagina(page, { cuenta: CASOS['confirmado-con-unidad'] })
  await page.goto('/')
  await page.locator('[data-cuenta-navbar] button:visible').first().click()
  await page.getByRole('menuitem', { name: 'Mis reservas' }).click()
  await expect(page).toHaveURL(/\/mi-cuenta\/reservas$/)
  await expect(page.locator('[data-reserva="PRIUS-A3X9K2"]')).toBeVisible()
})

// ── /r/:codigo ────────────────────────────────────────────────────────────
async function mockearConsulta(page, codigo) {
  await page.route('**/functions/v1/consultar-reserva**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        codigo,
        estado: 'preconfirmada',
        unidades: [{ tipo: 'carpa', numero: 19 }],
        desde: RESERVA_PROXIMA.desde,
        hasta: RESERVA_PROXIMA.hasta,
        titular: 'Mariana G.',
        saldo: 45000,
      }),
    }),
  )
}

test('/r/:codigo con sesión y la reserva en su cuenta → /mi-cuenta/reservas/<codigo>', async ({ page }) => {
  await prepararPagina(page, { cuenta: CASOS['confirmado-con-unidad'] })
  let consultas = 0
  page.on('request', (r) => {
    if (r.url().includes('consultar-reserva')) consultas++
  })
  await page.goto('/r/PRIUS-A3X9K2')
  await expect(page).toHaveURL(/\/mi-cuenta\/reservas\/PRIUS-A3X9K2$/)
  await expect(page.locator('[data-detalle-reserva="PRIUS-A3X9K2"]')).toBeVisible()
  // Nunca se mostró la página pública.
  expect(consultas).toBe(0)
})

test('/r/:codigo sin sesión: página pública con el branding y "Ingresá para ver todas tus reservas"', async ({ page }, testInfo) => {
  await prepararPagina(page, { cuenta: null })
  await mockearConsulta(page, 'PRIUS-A3X9K2')
  await page.goto('/r/PRIUS-A3X9K2')
  await expect(page).toHaveURL(/\/r\/PRIUS-A3X9K2$/)
  const tarjeta = page.locator('[data-reserva-publica]')
  await expect(tarjeta).toContainText('PRIUS-A3X9K2')
  await expect(tarjeta).toContainText('Preconfirmada — pagás al llegar')
  await expect(tarjeta.getByRole('img', { name: 'QR de la reserva PRIUS-A3X9K2' })).toBeVisible()
  await expect(page.getByText('Ingresá para ver todas tus reservas')).toBeVisible()
  await page.screenshot({ path: `test-results/r-codigo-${testInfo.project.name}-publica.png`, fullPage: true })
})

test('/r/:codigo con sesión pero de otra cuenta: sigue pública, con link a sus reservas', async ({ page }) => {
  await prepararPagina(page, { cuenta: CASOS['confirmado-sin-unidad'] })
  await mockearConsulta(page, 'PRIUS-Z9Z9Z9')
  await page.goto('/r/PRIUS-Z9Z9Z9')
  await expect(page.locator('[data-reserva-publica]')).toContainText('PRIUS-Z9Z9Z9')
  await expect(page).toHaveURL(/\/r\/PRIUS-Z9Z9Z9$/)
  await expect(page.getByRole('link', { name: /Ver mis reservas/ })).toHaveAttribute('href', '/mi-cuenta/reservas')
})

test('Paso 6 → "Ver en mi cuenta" cierra el overlay y abre la reserva en /mi-cuenta', async ({ page }) => {
  // La reserva recién creada ya viene en mi_cuenta() (se refresca al crearla).
  await prepararPagina(page, {
    cuenta: { ...CUENTAS.confirmado, reservas_web: [RESERVA_PROXIMA] },
    paso: 5,
  })
  await page.route('**/functions/v1/crear-reserva-publica', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, codigo: 'PRIUS-A3X9K2', total: 45000 }) }),
  )
  let lecturas = 0
  page.on('request', (r) => {
    if (r.url().includes('/rpc/mi_cuenta')) lecturas++
  })
  await page.goto('/?reserva=continuar')
  await expect(page.getByText('Paso 5 de 6')).toBeVisible({ timeout: 10000 })
  await page.locator('input[type="checkbox"]').check()
  await page.getByRole('button', { name: /Confirmar Reserva/i }).click()
  await expect(page.getByText('Paso 6 de 6')).toBeVisible({ timeout: 20000 })
  // Al confirmar se vuelve a pedir la cuenta.
  await expect.poll(() => lecturas).toBeGreaterThanOrEqual(2)
  await page.locator('[data-pie-marco]').getByRole('button', { name: /Ver en mi cuenta/ }).click()
  await expect(page.locator('[data-panel-reserva]')).toHaveCount(0)
  await expect(page).toHaveURL(/\/mi-cuenta\/reservas\/PRIUS-A3X9K2$/)
  await expect(page.locator('[data-detalle-reserva="PRIUS-A3X9K2"]')).toBeVisible()
})
