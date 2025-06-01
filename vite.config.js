import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "",
  server: {
    port: 5173,
    strictPort: true,
    open: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        model: resolve(__dirname, "model.html"),
      },
    },
  },
  optimizeDeps: {
    include: ["three"],
  },
});
