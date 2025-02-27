import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite acceso desde cualquier IP
    strictPort: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000", // Dirección del servidor de Django
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    allowedHosts: ["all"], // Permitir cualquier dominio, incluyendo Ngrok
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
