import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  define: {
    'process.env': {},
    global: 'window',
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom',
      'react-router-dom',
      'pdfjs-dist',
      'mammoth'
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    }
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          pdf: ['pdfjs-dist', 'mammoth'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    historyApiFallback: true,
  },
  css: {
    devSourcemap: true,
  },
});