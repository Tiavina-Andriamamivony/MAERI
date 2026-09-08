import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Le tsconfig du projet utilise `jsx: preserve` (Next) : on passe par esbuild
  // (oxc désactivé) avec le runtime JSX automatique pour transpiler les
  // fichiers .tsx importés par les tests (proforma-pdf).
  oxc: false,
  esbuild: {
    jsx: 'automatic',
  },
})
