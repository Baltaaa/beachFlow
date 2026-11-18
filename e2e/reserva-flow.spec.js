import { test, expect } from '@playwright/test'

// Flujo real contra la DB real (anon key, solo lecturas) — nada de esto
// escribe en la base. Con config_reservas_publicas.activo = false (estado
// real hoy), entrar por "Carpas & Sombrillas" tiene que mostrar el estado
// de pausadas, no romper ni quedar colgado.
test('estado real "reservas pausadas" cuando activo=false', async ({ page }) => {
  const erroresConsola = []
  page.on('pageerror', (e) => erroresConsola.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') erroresConsola.push(m.text())
  })

  await page.goto('/#contacto')
  await page.evaluate(() => document.querySelector('#contacto')?.scrollIntoView())
  await page.getByRole('button', { name: /Carpas & Sombrillas/ }).click()

  await expect(page.getByText('Reservas Online Pausadas')).toBeVisible({ timeout: 5000 })
  await expect(page.getByText('Dejar mi consulta')).toBeVisible()

  expect(erroresConsola).toEqual([])
})

test('"Dejar mi consulta" devuelve al Paso 2 de datos existente', async ({ page }) => {
  await page.goto('/#contacto')
  await page.evaluate(() => document.querySelector('#contacto')?.scrollIntoView())
  await page.getByRole('button', { name: /Carpas & Sombrillas/ }).click()
  await expect(page.getByText('Reservas Online Pausadas')).toBeVisible({ timeout: 5000 })

  await page.getByText('Dejar mi consulta').click()
  await expect(page.locator('input[name="nombre"]')).toBeVisible()
})

// /r/:codigo — ambos casos son lecturas sin efectos secundarios.
// Ojo con el alcance: la página SÍ pide config_reservas_publicas al montar
// (necesita hora_corte_noshow, ver ReservaPublica.jsx) pase lo que pase con
// el código. Lo que no tiene que pasar nunca es consultar la reserva con un
// código que ni siquiera respeta el formato. Antes esto miraba todo
// supabase.co y pasaba solo por carrera: el request de config llega a los
// ~800 ms y la aserción corría antes.
test('código con formato inválido no consulta la reserva', async ({ page }) => {
  const consultas = []
  page.on('request', (r) => {
    if (r.url().includes('consultar-reserva')) consultas.push(r.url())
  })
  await page.goto('/r/no-es-un-codigo-valido')
  await expect(page.getByText('No encontramos esa reserva.')).toBeVisible()
  // Margen para que, si se escapara una consulta, llegue a registrarse.
  await page.waitForTimeout(1500)
  expect(consultas).toEqual([])
})

test('código con formato válido pero inexistente muestra "no encontramos"', async ({ page }) => {
  await page.goto('/r/PRIUS-A3X9K2')
  await expect(page.getByText('No encontramos esa reserva.')).toBeVisible({ timeout: 8000 })
})
