import { defineConfig, devices } from '@playwright/test'

// Mismo patrón que priusApp: channel 'chrome' (el Chrome instalado, no el
// Chromium propio de Playwright) y los tres proyectos obligatorios.
//
// El puerto es configurable porque 5173 es también el default del dev server
// de priusApp: si el CRM está levantado, la suite corría contra esa app sin
// avisar. Default igual que siempre; para no pisarlo: E2E_PORT=5180 pnpm run test:e2e
const PORT = process.env.E2E_PORT ?? '5173'
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    channel: 'chrome',
  },
  webServer: {
    command: `pnpm run dev --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 30000,
  },
  projects: [
    {
      name: 'mobile-360',
      use: { ...devices['Desktop Chrome'], viewport: { width: 360, height: 800 }, hasTouch: true },
    },
    {
      name: 'mobile-390',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, hasTouch: true },
    },
    {
      name: 'desktop-1440',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
})
