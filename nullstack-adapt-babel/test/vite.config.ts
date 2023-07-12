import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watchExclude: configDefaults.watchExclude.filter(
      exclude => exclude !== '**/dist/**'
    ),
    globalSetup: './test/globalSetup.ts'
  }
})
