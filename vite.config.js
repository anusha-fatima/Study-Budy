import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', 
  build: {
    chunkSizeWarningLimit: 1500,
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html', // Changed to object format
        app: './src/main.jsx' // Explicit entry point
      },
    },
  },
  optimizeDeps: {
    exclude: ['pdf-parse', 'mammoth'], 
    include: ['react', 'react-dom'] 
  },
  css: {
    devSourcemap: true 
  }
});