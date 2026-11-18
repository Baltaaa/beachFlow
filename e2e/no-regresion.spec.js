import { test, expect } from '@playwright/test'

// Un reintento solo acá: es la única comparación pixel a pixel de la suite y
// los tres proyectos corren en paralelo contra el mismo dev server, así que
// una imagen lazy que llega tarde la hacía fallar sin que hubiera regresión.
test.describe.configure({ retries: 1 })

// No-regresión (Fase 4B, regla 4 de branding): la landing fuera del
// cotizador tiene que verse idéntica a como estaba antes de esta fase, en
// los tres tamaños obligatorios. No interactúa con el cotizador.
test('landing completa sin regresión visual', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // Scroll completo para disparar animaciones por IntersectionObserver y
  // lazy-loading antes de la captura full-page (si no, quedan secciones en
  // blanco — ver design/no-regresion/antes/).
  const height = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < height; y += 400) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await page.waitForTimeout(100)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  // Esperar a que terminen de bajar las imágenes lazy: con los tres
  // proyectos corriendo en paralelo contra el mismo dev server, 300 ms no
  // alcanzaban y la captura salía con secciones a medio cargar.
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(800)

  await expect(page).toHaveScreenshot('landing-completa.png', { fullPage: true, maxDiffPixelRatio: 0.01 })
})
