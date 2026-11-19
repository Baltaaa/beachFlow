import { test, expect } from '@playwright/test'

// Recorrido visual de los Pasos 2 a 4 con activo y cotizar() simulados del
// lado del cliente (vía page.route) — la DB real sigue con activo=false y
// sin tarifas, así que esto no se puede probar end-to-end todavía. Nunca
// llama a crear-reserva-publica: esa prueba real queda para cuando
// priusApp confirme activo=true con tarifas E2E cargadas (ver CLAUDE.md).
//
// Fase 5B: el recorrido anónimo termina en el Paso 4, que ahora exige login
// con Google. Los cuatro estados del Paso 4 y el Paso 5 con sesión se cubren
// en cuenta-google.spec.js, con la sesión simulada.
async function mockearConfigYTarifas(page) {
  await page.route('**/rest/v1/config_reservas_publicas**', async (route) => {
    const res = await route.fetch()
    const body = await res.json()
    const mocked = Array.isArray(body) ? body.map((r) => ({ ...r, activo: true })) : { ...body, activo: true }
    await route.fulfill({ response: res, json: mocked })
  })
  await page.route('**/rest/v1/rpc/cotizar', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '45000' })
  })
}

test('Pasos 2 a 4 se recorren sin errores (disponibilidad real, tarifas simuladas)', async ({ page }) => {
  const errores = []
  page.on('pageerror', (e) => errores.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errores.push(m.text())
  })

  await mockearConfigYTarifas(page)

  await page.goto('/#contacto')
  await page.evaluate(() => document.querySelector('#contacto')?.scrollIntoView())
  await page.getByRole('button', { name: /Carpas & Sombrillas/ }).click()
  await expect(page.getByText('PASO 2 DE 6')).toBeVisible({ timeout: 5000 })
  await page.screenshot({ path: 'test-results/paso2.png' })

  await page.locator('.rdp-reservas button.rdp-day_button:not([disabled])').nth(5).click()
  const hoja = page.locator('[data-panel-reserva]')
  await hoja.locator('button.bg-gold', { hasText: 'Siguiente' }).click()

  await expect(page.getByText('PASO 3 DE 6')).toBeVisible({ timeout: 5000 })
  await page.waitForTimeout(1500) // disponibilidad_publica real
  await page.screenshot({ path: 'test-results/paso3.png' })

  const celdaLibre = page.locator('button.cursor-pointer.rounded-sm:not([disabled])').first()
  await celdaLibre.evaluate((el) => el.click())
  await hoja.locator('button.bg-gold', { hasText: 'Siguiente' }).click()

  await expect(page.getByText('PASO 4 DE 6')).toBeVisible({ timeout: 5000 })
  await page.screenshot({ path: 'test-results/paso4.png' })

  // Fase 5B: sin sesión el Paso 4 no muestra ningún campo, solo el login.
  await expect(page.getByRole('button', { name: /Continuar con Google/i })).toBeVisible()
  await expect(page.locator('input:not([type="hidden"])')).toHaveCount(0)

  expect(errores).toEqual([])
})
