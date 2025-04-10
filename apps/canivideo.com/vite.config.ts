import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import legacy from "@vitejs/plugin-legacy";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  plugins: [
    legacy({
      targets: ["chrome 68"],
    }),
    preact({
      prerender: {
        enabled: false,
        renderTarget: "#app",
      },
    }),
  ],
});
