import { defineConfig } from "vite";

// Capacitor loads the built site from `dist/` as the native web layer.
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    target: "es2020",
    assetsInlineLimit: 0,
  },
  server: {
    host: true,
    port: 5173,
  },
});
