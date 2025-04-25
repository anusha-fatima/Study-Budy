import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['pdf-parse', 'mammoth'], 
    include: ['pdf-lib'] 
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, 
      exclude: ['node_modules/pdf-parse/**'] 
    }
  }
})