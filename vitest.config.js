import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // e2e/ son specs de Playwright, no de vitest — excluirlas explícito
    // además del default (node_modules, dist) para que no se pisen.
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
})
