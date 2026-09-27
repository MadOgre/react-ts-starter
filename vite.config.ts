import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [
    react(),
    // Shows TypeScript and ESLint errors in the browser overlay during `pnpm dev`.
    checker({
      enableBuild: false,
      typescript: { buildMode: true },
      eslint: { lintCommand: "eslint .", useFlatConfig: true },
    }),
  ],
  server: {
    // The Dev VM's provisioning sets DEV_SERVER_HOST=0.0.0.0 so its forwarded port can reach Vite.
    // On the Host it's unset, and the dev server stays private to localhost.
    host: process.env.DEV_SERVER_HOST ?? "localhost",
    // A fixed, memorable port. Fail instead of silently moving to another one if it's taken.
    // Keep in sync with DEV_SERVER_PORT in the Vagrantfile.
    port: 9000,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
