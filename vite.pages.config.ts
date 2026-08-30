import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  root: "pages",
  base: "/learn/",
  publicDir: "../public",
  plugins: [react()],
  resolve: {
    alias: {
      "next/image": path.resolve(__dirname, "pages/next-image.tsx"),
      "next/link": path.resolve(__dirname, "pages/next-link.tsx"),
    },
  },
  build: {
    outDir: "../pages-dist",
    emptyOutDir: true,
    rollupOptions: { input: path.resolve(__dirname, "pages/index.html") },
  },
});
