// ============================================================
// VITE CONFIG
// Vite is the build tool and dev server for our React app.
// The proxy setting forwards /api requests to the backend,
// so the browser never sees a CORS issue during development.
// ============================================================
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy: any request starting with /api goes to backend
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
