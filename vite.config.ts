import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { target: 'es2022' },
  server: {
    // Personal source material and raw assets aren't part of the site; watching
    // them can crash the dev server when a file is locked (e.g. an open PDF).
    watch: { ignored: ['**/My projects and About ME/**', '**/raw/**'] },
  },
})
