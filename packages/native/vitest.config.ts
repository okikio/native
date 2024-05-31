import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // environment: 'happy-dom', // or 'jsdom', 'node'
    testTimeout: 1_500_000,
  },
})