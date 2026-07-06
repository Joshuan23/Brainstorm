import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Produces one self-contained dist-single/index.html (all JS/CSS inlined, no
// external requests) — used to host the game as a single shareable web page.
export default defineConfig({
  base: "./",
  plugins: [viteSingleFile()],
  build: {
    outDir: "dist-single",
    target: "es2020",
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
  },
});
