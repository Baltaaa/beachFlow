import { test, expect } from '@playwright/test'

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
  await page.waitForTimeout(300)

  await expect(page).toHaveScreenshot('landing-completa.png', { fullPage: true, maxDiffPixelRatio: 0.01 })
})
