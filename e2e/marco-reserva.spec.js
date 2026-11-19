import { test, expect } from '@playwright/test'
import { CUENTAS, UNIDAD, flowGuardado, prepararPagina } from './soporte'

// Fase 6B, Tarea 2 — marco fijo del flujo de reserva: overlay con el mismo
// tamaño en los 6 pasos, cierre (X, Escape, click afuera) con confirmación,
// body lock y fechas / personas desde el header. Todo con config, tarifas,
// disponibilidad, sesión y Edge Functions simuladas (ver soporte.js).

const hoja = (page) => page.locator('[data-panel-reserva]')
const siguiente = (page) => hoja(page).getByRole('button', { name: /^Siguiente/ })

async function medir(page) {
  const caja = await hoja(page).boundingBox()
  return { x: Math.round(caja.x), y: Math.round(caja.y), w: Math.round(caja.width), h: Math.round(caja.height) }
}

async function abrirDesdeCotizador(page) {
  await page.goto('/#contacto')
  await page.evaluate(() => document.querySelector('#contacto')?.scrollIntoView())
  await page.getByRole('button', { name: /Carpas & Sombrillas/ }).click()
  await expect(hoja(page)).toBeVisible()
}

test('el marco mide exactamente lo mismo en los 6 pasos', async ({ page }, testInfo) => {
  const errores = []
  page.on('pageerror', (e) => errores.push(e.message))
  await prepararPagina(page, { cuenta: CUENTAS.confirmado })
  await page.route('**/functions/v1/crear-reserva-publica', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, codigo: 'PRIUS-A3X9K2', total: 45000 }),
    }),
  )
  const captura = (n) => page.screenshot({ path: `test-results/marco-${testInfo.project.name}-paso${n}.png` })

  await abrirDesdeCotizador(page)
  const medidas = []

  await expect(page.getByText('Paso 2 de 6')).toBeVisible()
  medidas.push(await medir(page))
  await captura(2)
  await page.locator('.rdp-reservas button.rdp-day_button:not([disabled])').nth(5).click()
  await siguiente(page).click()

  await expect(page.getByText('Paso 3 de 6')).toBeVisible()
  medidas.push(await medir(page))
  await page.locator('button.cursor-pointer.rounded-sm:not([disabled])').first().evaluate((el) => el.click())
  await expect(page.locator('[data-pie-marco]')).toContainText('Carpa 19')
  await captura(3)
  await siguiente(page).click()

  await expect(page.getByText('Paso 4 de 6')).toBeVisible()
  await expect(page.getByText('Hola, Mariana')).toBeVisible()
  medidas.push(await medir(page))
  await captura(4)
  await page.getByRole('button', { name: 'Continuar', exact: true }).click()

  await expect(page.getByText('Paso 5 de 6')).toBeVisible()
  medidas.push(await medir(page))
  await captura(5)
  await page.locator('input[type="checkbox"]').check()
  await page.getByRole('button', { name: /Confirmar Reserva/i }).click()

  await expect(page.getByText('PRIUS-A3X9K2')).toBeVisible({ timeout: 20000 })
  medidas.push(await medir(page))
  await captura(6)

  for (const m of medidas) expect(m).toEqual(medidas[0])

  const vp = page.viewportSize()
  if (vp.width >= 768) {
    // 90vw × 88dvh con máximo 1440 × 920.
    expect(medidas[0].w).toBe(Math.round(Math.min(vp.width * 0.9, 1440)))
    expect(medidas[0].h).toBe(Math.round(Math.min(vp.height * 0.88, 920)))
  } else {
    expect(medidas[0]).toEqual({ x: 0, y: 0, w: vp.width, h: vp.height })
  }

  // En el Paso 6 se cierra sin preguntar y el cotizador vuelve a su Paso 1.
  await page.getByRole('button', { name: 'Listo' }).click()
  await expect(hoja(page)).toHaveCount(0)
  await expect(page.getByText('¿Qué servicio te interesa cotizar?')).toBeVisible()
  expect(errores).toEqual([])
})

test('cerrar: sin datos cierra directo; con datos pide confirmación', async ({ page }) => {
  await prepararPagina(page, { cuenta: null })
  await abrirDesdeCotizador(page)

  // Recién abierto, sin fechas: Escape cierra sin preguntar.
  await page.keyboard.press('Escape')
  await expect(hoja(page)).toHaveCount(0)

  await page.getByRole('button', { name: /Carpas & Sombrillas/ }).click()
  await page.locator('.rdp-reservas button.rdp-day_button:not([disabled])').nth(5).click()

  // Con fechas elegidas: la X pregunta; "Seguir reservando" no pierde nada.
  await page.getByRole('button', { name: 'Cerrar' }).click()
  await expect(page.getByText('¿Salir de la reserva?')).toBeVisible()
  await page.getByRole('button', { name: 'Seguir reservando' }).click()
  await expect(page.getByText('¿Salir de la reserva?')).toHaveCount(0)
  await expect(page.getByText('Paso 2 de 6')).toBeVisible()

  // Escape también pregunta, y un segundo Escape cancela la pregunta.
  await page.keyboard.press('Escape')
  await expect(page.getByText('¿Salir de la reserva?')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByText('¿Salir de la reserva?')).toHaveCount(0)
  await expect(hoja(page)).toBeVisible()

  // Click afuera (solo hay "afuera" en desktop) → pregunta → Salir.
  if (page.viewportSize().width >= 768) {
    await page.mouse.click(10, 10)
  } else {
    await page.getByRole('button', { name: 'Cerrar' }).click()
  }
  await expect(page.getByText('¿Salir de la reserva?')).toBeVisible()
  await page.getByRole('button', { name: 'Salir', exact: true }).click()
  await expect(hoja(page)).toHaveCount(0)
  await expect(page.getByText('¿Qué servicio te interesa cotizar?')).toBeVisible()
})

test('body lock: la página de fondo no scrollea con el overlay abierto', async ({ page }) => {
  await prepararPagina(page, { cuenta: null })
  await abrirDesdeCotizador(page)
  const antes = await page.evaluate(() => window.scrollY)
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe('hidden')

  await page.mouse.move(20, 400)
  await page.mouse.wheel(0, 1500)
  await page.waitForTimeout(400)
  expect(await page.evaluate(() => window.scrollY)).toBe(antes)

  await page.keyboard.press('Escape')
  await expect(hoja(page)).toHaveCount(0)
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).not.toBe('hidden')
  expect(await page.evaluate(() => window.scrollY)).toBe(antes)
})

test('fechas desde el header: flechas por día y la selección se conserva si sigue libre', async ({ page }) => {
  await prepararPagina(page, { cuenta: null, paso: 3 })
  // El día siguiente al guardado, la carpa 19 está ocupada.
  const desdeGuardado = flowGuardado(3).state.fechas.desde
  await page.route('**/rest/v1/rpc/disponibilidad_publica', async (route) => {
    const { p_desde } = route.request().postDataJSON()
    const ocupada = p_desde > desdeGuardado
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ ...UNIDAD, bloqueada: ocupada }]) })
  })
  await page.goto('/?reserva=continuar')
  await expect(page.getByText('Paso 3 de 6')).toBeVisible({ timeout: 10000 })
  await expect(page.locator('[data-pie-marco]')).toContainText('Carpa 19')

  const selector = page.locator('[data-selector-fechas]')
  const etiquetaAntes = await selector.innerText()
  await page.getByRole('button', { name: 'Día siguiente' }).click()
  await expect(selector).not.toHaveText(etiquetaAntes)
  await expect(page.getByText('Lo que elegiste no está libre en las fechas nuevas', { exact: false })).toBeVisible()
  await expect(page.locator('[data-pie-marco]')).toContainText('Elegí tu lugar en el plano')

  // Vuelve al día original: libre otra vez, se puede elegir.
  await page.getByRole('button', { name: 'Día anterior' }).click()
  await expect(selector).toHaveText(etiquetaAntes)
})

test('fechas desde el Paso 4 vuelven al plano conservando la selección libre', async ({ page }) => {
  await prepararPagina(page, { cuenta: CUENTAS.confirmado, paso: 4 })
  await page.goto('/?reserva=continuar')
  await expect(page.getByText('Paso 4 de 6')).toBeVisible({ timeout: 10000 })

  await page.getByRole('button', { name: 'Día siguiente' }).click()
  await expect(page.getByText('Paso 3 de 6')).toBeVisible()
  await expect(page.locator('[data-pie-marco]')).toContainText('Carpa 19')
  await expect(siguiente(page)).toBeEnabled()
})

test('desde el Paso 5 las fechas y las personas quedan fijas', async ({ page }) => {
  await prepararPagina(page, { cuenta: CUENTAS.confirmado, paso: 5 })
  await page.goto('/?reserva=continuar')
  await expect(page.getByText('Paso 5 de 6')).toBeVisible({ timeout: 10000 })
  await expect(page.getByRole('button', { name: 'Día siguiente' })).toHaveCount(0)
  await expect(page.locator('[data-selector-fechas] button[aria-haspopup]')).toBeDisabled()
  await expect(page.getByRole('button', { name: /personas\. Cambiar/ })).toBeDisabled()
})

test('personas desde el header: vecina, y grupo grande sale a consulta', async ({ page }) => {
  await prepararPagina(page, { cuenta: null, paso: 3 })
  const vecinas = []
  await page.route('**/rest/v1/rpc/buscar_unidad_vecina', (route) => {
    vecinas.push(route.request().postDataJSON())
    return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  })
  await page.goto('/?reserva=continuar')
  await expect(page.getByText('Paso 3 de 6')).toBeVisible({ timeout: 10000 })

  const pill = page.getByRole('button', { name: /personas\. Cambiar/ })
  await pill.click()
  // 4 → 8 personas: con capacidad 6 hacen falta dos unidades.
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Una persona más' }).click()
  await page.getByRole('button', { name: 'Aplicar' }).click()
  await expect.poll(() => vecinas.length).toBe(1)
  await expect(page.getByText('No hay otra unidad libre para esas fechas.')).toBeVisible()
  await expect(siguiente(page)).toBeDisabled()

  // Muchas personas: grupo grande → se cierra el overlay y queda el form de
  // consulta del cotizador con el contexto.
  await pill.click()
  for (let i = 0; i < 30; i++) await page.getByRole('button', { name: 'Una persona más' }).click()
  await page.getByRole('button', { name: 'Aplicar' }).click()
  await expect(hoja(page)).toHaveCount(0)
  await expect(page.locator('input[name="nombre"]')).toBeVisible()
})
