import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Fixed, non-drifting port: localStorage (accounts, dashboards) is scoped
  // per-origin, so if the dev server silently jumped to another port on a
  // restart, accounts created under the old port would look "gone" under
  // the new one. strictPort makes that fail loudly instead of happening
  // silently.
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router-dom') || id.includes('react-dom') || id.includes('react/')) {
              return 'vendor';
            }
            if (id.includes('framer-motion')) {
              return 'animation';
            }
            if (id.includes('recharts')) {
              return 'charts';
            }
            if (id.includes('jspdf')) {
              return 'pdf';
            }
            if (id.includes('firebase')) {
              return 'firebase';
            }
          }
        },
      },
    },
  },
})
