import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "katex/dist/katex.min.css";` // Ensure KaTeX CSS is imported
      }
    }
  }
});

