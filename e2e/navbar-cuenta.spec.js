import { test, expect } from '@playwright/test'
import { CUENTAS, prepararPagina } from './soporte'
import { hoyArgentinaISO } from '../src/features/reservas/fechas'

// Fase 6B, Tarea 4 — cuenta del cliente en el navbar, con la sesión y
// mi_cuenta() simulados (ver soporte.js). Cubre los tres estados (sin sesión,
// confirmado con y sin unidad hoy, pendiente), el menú, que "Ingresar" vuelva
// a la misma página y que el chip no se meta encima de la navegación en
// ningún ancho de desktop. Las capturas del navbar son de no-regresión.

// Un reintento, igual que no-regresion.spec.js: son capturas pixel a pixel y
// el header anima 700 ms al scrollear; con la suite en paralelo a veces se
// captura a mitad de la transición.
test.describe.configure({ retries: 1 })

const HOY = hoyArgentinaISO()
const conUnidadHoy = {
  ...CUENTAS.confirmado,
  unidades_vigentes: [
    { tipo: 'sombrilla', numero: 7, tipo_alquiler: 'dia', desde: HOY, hasta: HOY },
    { tipo: 'carpa', numero: 133, tipo_alquiler: 'temporada', desde: '2026-01-01', hasta: '2099-12-31' },
  ],
}
const sinUnidadHoy = {
  ...CUENTAS.confirmado,
  unidades_vigentes: [{ tipo: 'carpa', numero: 40, tipo_alquiler: 'dia', desde: '2099-01-01', hasta: '2099-01-01' }],
}

const esDesktop = (page) => page.viewportSize().width >= 768
const cabecera = (page) => page.locator(esDesktop(page) ? 'header.md\\:block' : 'header.md\\:hidden')

async function capturarNavbar(page, nombre) {
  // Arriba de todo (header transparente sobre el hero) y scrolleado.
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(1500)
  const ancho = page.viewportSize().width
  await expect(page).toHaveScreenshot(`navbar-${nombre}-arriba.png`, { clip: { x: 0, y: 0, width: ancho, height: 120 }, maxDiffPixelRatio: 0.01 })
  await page.evaluate(() => window.scrollTo(0, 1400))
  await page.waitForTimeout(1500)
  await expect(page).toHaveScreenshot(`navbar-${nombre}-scrolleado.png`, { clip: { x: 0, y: 0, width: ancho, height: 100 }, maxDiffPixelRatio: 0.01 })
  await page.evaluate(() => window.scrollTo(0, 0))
}

test('sin sesión: "Ingresar" lleva a Google y vuelve a la misma página', async ({ page }) => {
  await prepararPagina(page, { cuenta: null })
  const authorize = []
  await page.route('**/auth/v1/authorize**', (route) => {
    authorize.push(new URL(route.request().url()))
    return route.fulfill({ status: 200, contentType: 'text/html', body: '<p>google</p>' })
  })
  await page.goto('/?utm_source=test')
  const ingresar = cabecera(page).locator('[data-ingresar-navbar]')
  await expect(ingresar).toBeVisible()
  await expect(cabecera(page).locator('[data-cuenta-navbar]')).toHaveCount(0)
  await capturarNavbar(page, 'sin-sesion')

  await ingresar.click()
  await expect.poll(() => authorize.length).toBe(1)
  expect(authorize[0].searchParams.get('provider')).toBe('google')
  const vuelta = new URL(authorize[0].searchParams.get('redirect_to'))
  expect(vuelta.pathname).toBe('/')
  expect(vuelta.searchParams.get('utm_source')).toBe('test')
  expect(vuelta.searchParams.has('reserva')).toBe(false)
})

test('confirmado con unidad hoy: chip "Mariana · Carpa 133" y menú', async ({ page }) => {
  await prepararPagina(page, { cuenta: conUnidadHoy })
  await page.route('**/auth/v1/logout**', (route) => route.fulfill({ status: 204, body: '' }))
  await page.goto('/')
  const chip = cabecera(page).locator('[data-cuenta-navbar] > button')
  await expect(chip).toHaveAttribute('aria-label', 'Tu cuenta: Mariana · Carpa 133')

  const texto = cabecera(page).locator('[data-texto-chip]')
  if (page.viewportSize().width >= 1280) await expect(texto).toHaveText('Mariana · Carpa 133')
  else await expect(texto).toHaveCount(0) // mobile: solo la foto
  await expect(cabecera(page).locator('[data-punto-pendiente]')).toHaveCount(0)
  await capturarNavbar(page, 'confirmado')

  await chip.click()
  const menu = page.getByRole('menu', { name: 'Tu cuenta' })
  await expect(menu).toBeVisible()
  await expect(menu.getByText('Mariana Gómez')).toBeVisible()
  await expect(menu.getByRole('menuitem', { name: 'Mi cuenta' })).toHaveAttribute('href', '/mi-cuenta')
  await expect(menu.getByRole('menuitem', { name: 'Mis reservas' })).toHaveAttribute('href', '/mi-cuenta/reservas')
  await expect(menu.getByText('Tu cuenta se confirma en recepción')).toHaveCount(0)
  const caja = await menu.boundingBox()
  expect(caja.x).toBeGreaterThanOrEqual(0)
  expect(caja.x + caja.width).toBeLessThanOrEqual(page.viewportSize().width)
  await page.waitForTimeout(500) // fin de la animación de entrada
  await page.screenshot({ path: `test-results/navbar-menu-${test.info().project.name}.png` })

  await page.keyboard.press('Escape')
  await expect(menu).toHaveCount(0)
  await chip.click()
  await menu.getByRole('menuitem', { name: 'Cerrar sesión' }).click()
  await expect(cabecera(page).locator('[data-ingresar-navbar]')).toBeVisible()
})

test('confirmado sin unidad hoy: solo el nombre', async ({ page }) => {
  await prepararPagina(page, { cuenta: sinUnidadHoy })
  await page.goto('/')
  await expect(cabecera(page).locator('[data-cuenta-navbar] > button')).toHaveAttribute('aria-label', 'Tu cuenta: Mariana')
})

test('pendiente: nombre de Google, punto de aviso y "se confirma en recepción"', async ({ page }) => {
  await prepararPagina(page, { cuenta: CUENTAS.pendiente, nombreGoogle: 'Lucía Pérez' })
  await page.goto('/')
  const chip = cabecera(page).locator('[data-cuenta-navbar] > button')
  await expect(chip).toHaveAttribute('aria-label', 'Tu cuenta: Lucía (Tu cuenta se confirma en recepción)')
  await expect(cabecera(page).locator('[data-punto-pendiente]')).toBeVisible()
  await capturarNavbar(page, 'pendiente')
  await chip.click()
  await expect(page.getByRole('menu', { name: 'Tu cuenta' }).getByText('Tu cuenta se confirma en recepción')).toBeVisible()
})

test('el chip nunca se mete encima de la navegación (768 a 1440)', async ({ page }) => {
  test.skip(!esDesktop(page), 'solo desktop/tablet')
  // 6 anchos × 2 scrolls con las animaciones del header: con la suite en
  // paralelo no entra en los 30 s por defecto.
  test.setTimeout(90000)
  // Nombre largo a propósito: el texto se corta antes de llegar a la nav.
  await prepararPagina(page, {
    cuenta: { ...conUnidadHoy, cliente: { ...conUnidadHoy.cliente, nombre: 'Maximiliano' } },
  })
  for (const ancho of [768, 900, 1024, 1180, 1280, 1440]) {
    await page.setViewportSize({ width: ancho, height: 900 })
    await page.goto('/')
    await expect(page.locator('header.md\\:block [data-cuenta-navbar]')).toBeVisible()
    for (const y of [0, 1400]) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y)
      await page.waitForTimeout(900)
      const { chipDer, navIzq } = await page.evaluate(() => {
        const h = document.querySelector('header.md\\:block')
        return {
          chipDer: h.querySelector('[data-cuenta-navbar]').getBoundingClientRect().right,
          navIzq: h.querySelector('nav').getBoundingClientRect().left,
        }
      })
      expect(chipDer, `ancho ${ancho}, scroll ${y}`).toBeLessThan(navIzq)
    }
  }
})
