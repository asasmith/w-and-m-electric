import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    globals: true,
    css: true,
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules/**", "e2e/**"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
});
