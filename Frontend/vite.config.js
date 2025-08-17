import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      crypto: "crypto-browserify",
    },
  },
  define: {
    "process.env": {},
  },
  server: {
    port: 5173,
  },
  optimizeDeps: {
  include: ["crypto-browserify"],
},
});
